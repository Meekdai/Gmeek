# -*- coding: utf-8 -*-
import os
import json
import time
import datetime
import shutil
import urllib
import requests
import argparse
from github import Github
from xpinyin import Pinyin
from feedgen.feed import FeedGenerator

######################################################################################
class GMEEK():
    def __init__(self,options):
        self.options=options
        self.config=json.loads(open('config.json', 'r', encoding='utf-8').read())

        self.root_dir='docs/'
        self.post_folder='post/'
        self.post_dir=self.root_dir+self.post_folder

        self.plist_example=open('plist_example.html', 'r', encoding='utf-8').read()
        self.post_example=open('post_example.html', 'r', encoding='utf-8').read()
        self.feed = FeedGenerator()

        user = Github(self.options.github_token)
        self.repo = self.get_repo(user, options.repo_name)

        self.labelColorDict=json.loads('{}')
        for label in self.repo.get_labels():
            self.labelColorDict[label.name]='#'+label.color

        print(self.labelColorDict)

        self.blogBase=self.config.copy()
        self.blogBase["GMEEK_VERSION"]=options.Gmeek_version
        self.blogBase["postListJson"]=json.loads('{}')

    def cleanFile(self):
        if os.path.exists("backup/"):
            shutil.rmtree("backup/")
            
        if os.path.exists(self.root_dir):
            shutil.rmtree(self.root_dir)

        os.mkdir("backup/")
        os.mkdir(self.root_dir)
        os.mkdir(self.post_dir)
        

    def get_repo(self,user: Github, repo: str):
        return user.get_repo(repo)

    def markdown2html(self,mdstr):
        payload = {"text": mdstr, "mode": "markdown"}
        ret=requests.post("https://api.github.com/markdown", json=payload,headers={"Authorzation":"token {}".format(self.options.github_token)})
        if ret.status_code==200:
            return ret.text
        else:
            raise Exception("markdown2html error status_code=%d"%(ret.status_code))

    def createPostHtml(self,issue):
        if issue["label"] in self.blogBase["singlePage"]:
            gen_Html = 'docs/{}.html'.format(issue["label"])
        else:
            gen_Html = self.post_dir+'{}.html'.format(Pinyin().get_pinyin(issue["postTitle"]))

        f = open("backup/"+issue["postTitle"]+".md", 'r', encoding='UTF-8')
        post_body=self.markdown2html(f.read())
        f.close()

        postBase=json.loads('{}')
        postBase["postTitle"]=issue["postTitle"]
        postBase["postBody"]=post_body
        postBase["title"]=self.blogBase["title"]
        postBase["homeUrl"]=self.blogBase["homeUrl"]
        postBase["postSourceUrl"]=issue["postSourceUrl"]
        postBase["faviconUrl"]=self.blogBase["faviconUrl"]
        postBase["filingNum"]=self.blogBase["filingNum"]
        postBase["startSite"]=self.blogBase["startSite"]
        postBase["i18n"]=self.blogBase["i18n"]
        postBase["commentNum"]=issue["commentNum"]
        postBase["repoName"]=options.repo_name
        postBase["GMEEK_VERSION"]=options.Gmeek_version

        f = open(gen_Html, 'w', encoding='UTF-8')
        f.write(self.post_example % json.dumps(postBase))
        f.close()
        print("create postPage title=%s file=%s " % (issue["postTitle"],gen_Html))

    def createPlistHtml(self):
        self.blogBase["postListJson"]=dict(sorted(self.blogBase["postListJson"].items(),key=lambda x:x[1]["createdAt"],reverse=True))#使列表由时间排序

        f = open(self.root_dir+"index.html", 'w', encoding='UTF-8')
        f.write(self.plist_example % json.dumps(self.blogBase))
        f.close()
        print("create docs/index.html")

    def createFeedXml(self):
        self.blogBase["postListJson"]=dict(sorted(self.blogBase["postListJson"].items(),key=lambda x:x[1]["createdAt"],reverse=False))#使列表由时间排序
        feed = FeedGenerator()
        feed.title(self.blogBase["title"])
        feed.description(self.blogBase["subTitle"])
        feed.link(href=self.blogBase["homeUrl"])
        feed.image(url=self.blogBase["avatarUrl"],title="avatar", link=self.blogBase["homeUrl"])
        feed.pubDate(time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime()))
        feed.copyright(self.blogBase["title"])
        feed.managingEditor(self.blogBase["title"])
        feed.webMaster(self.blogBase["title"])
        feed.ttl("60")

        for num in self.blogBase["postListJson"]:
            item=feed.add_item()
            item.guid(self.blogBase["homeUrl"]+"/"+self.blogBase["postListJson"][num]["postUrl"],permalink=True)
            item.title(self.blogBase["postListJson"][num]["postTitle"])
            item.description(self.blogBase["postListJson"][num]["description"])
            item.link(href=self.blogBase["homeUrl"]+"/"+self.blogBase["postListJson"][num]["postUrl"])
            item.pubDate(time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime(self.blogBase["postListJson"][num]["createdAt"])))

        feed.rss_file(self.root_dir+'rss.xml')


    def addOnePostJson(self,issue):
        if len(issue.labels)==1:
            postNum="P"+str(issue.number)
            self.blogBase["postListJson"][postNum]=json.loads('{}')
            self.blogBase["postListJson"][postNum]["label"]=issue.labels[0].name
            self.blogBase["postListJson"][postNum]["labelColor"]=self.labelColorDict[issue.labels[0].name]
            self.blogBase["postListJson"][postNum]["postTitle"]=issue.title
            self.blogBase["postListJson"][postNum]["postUrl"]=urllib.parse.quote(self.post_folder+'{}.html'.format(Pinyin().get_pinyin(issue.title)))
            self.blogBase["postListJson"][postNum]["postSourceUrl"]="https://github.com/"+options.repo_name+"/issues/"+str(issue.number)
            self.blogBase["postListJson"][postNum]["commentNum"]=issue.get_comments().totalCount
            if self.blogBase["i18n"]=="CN":
                period="。"
            else:
                period="."
            self.blogBase["postListJson"][postNum]["description"]=issue.body.split(period)[0]+period
            
            try:
                modifyTime=json.loads(issue.body.split("\r\n")[-1:][0].split("##")[1])
                self.blogBase["postListJson"][postNum]["createdAt"]=modifyTime["timestamp"]
            except:
                self.blogBase["postListJson"][postNum]["createdAt"]=int(time.mktime(issue.created_at.timetuple()))

            thisYear=datetime.datetime.fromtimestamp(self.blogBase["postListJson"][postNum]["createdAt"]).year
            self.blogBase["postListJson"][postNum]["dateLabelColor"]=self.blogBase["yearColorList"][int(thisYear)%len(self.blogBase["yearColorList"])]

            f = open("backup/"+issue.title+".md", 'w', encoding='UTF-8')
            f.write(issue.body)
            f.close()

    def runAll(self):
        print("====== start create static html ======")
        self.cleanFile()

        issues=self.repo.get_issues()
        for issue in issues:
            self.addOnePostJson(issue)

        for issue in self.blogBase["postListJson"].values():
            self.createPostHtml(issue)

        self.createPlistHtml()
        self.createFeedXml()
        print("====== create static html end ======")

    def runOne(self,number_str):
        print("====== start create static html ======")
        issue=self.repo.get_issue(int(number_str))
        self.addOnePostJson(issue)
        self.createPostHtml(self.blogBase["postListJson"]["P"+number_str])
        self.createPlistHtml()
        self.createFeedXml()
        print("====== create static html end ======")

######################################################################################

parser = argparse.ArgumentParser()
parser.add_argument("github_token", help="github_token")
parser.add_argument("repo_name", help="repo_name")
parser.add_argument("Gmeek_version", help="Gmeek_version")
parser.add_argument("--issue_number", help="issue_number", default=0, required=False)
options = parser.parse_args()

blog=GMEEK(options)

if not os.path.exists("blogBase.json"):
    print("blogBase is not exists, runAll")
    blog.runAll()
else:
    if options.issue_number=="0" or options.issue_number=="":
        print("issue_number=='0', runAll")
        blog.runAll()
    else:
        f=open("blogBase.json","r")
        print("blogBase is exists and issue_number!=0, runOne")
        blog.blogBase=json.loads(f.read())
        f.close()
        blog.runOne(options.issue_number)

listFile=open("blogBase.json","w")
listFile.write(json.dumps(blog.blogBase))
listFile.close()


######################################################################################