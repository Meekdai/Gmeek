
if(typeof(blogBase["subTitle"])=='undefined'){htmlType="post";}
else{htmlType="plist";}

var i18nEN=["switch theme","Run "," days","links","about me","Search","Home","Comments","Loading"];
var i18nCN=["切换主题",    "网站运行","天","友情链接","关于",   "搜索",   "首页", "评论",    "加载中"];

if(blogBase["i18n"]=="CN"){var i18n=i18nCN;}
else{var i18n=i18nEN;}

if(blogBase["startSite"]!=""){
    var now=new Date();
    var startSite=new Date(blogBase["startSite"]);
    var diff=now.getTime()-startSite.getTime();
    var diffDay=Math.floor(diff/(1000*60*60*24));
    document.getElementById("year").innerHTML=now.getFullYear();
    document.getElementById("runday").innerHTML=i18n[1]+diffDay+i18n[2]+" • ";
}
if(blogBase["filingNum"]!=""){document.getElementById("filingNum").innerHTML=blogBase["filingNum"]+" • ";}
document.getElementById("footerblogTitle").innerHTML=blogBase["title"];
document.getElementById("footerblogTitle").href=blogBase["homeUrl"];

if(blogBase["faviconUrl"]!=""){
    link=document.createElement("link");
    link.setAttribute("rel","icon");
    link.setAttribute("href",blogBase["faviconUrl"]);
    document.head.appendChild(link);
}

document.getElementById("changeTheme").setAttribute("title",i18n[0]);
document.getElementById("themeSwitch").setAttribute("d",value=IconList["sun"]);
if(localStorage.getItem("meek_theme")==null){localStorage.setItem("meek_theme","light")}
else if(localStorage.getItem("meek_theme")=="dark"){changeDark();}
else if(localStorage.getItem("meek_theme")=="light"){changeLight();}

var utterancesLoad=0
if(localStorage.getItem("meek_theme")==null){localStorage.setItem("meek_theme","light")}
else if(localStorage.getItem("meek_theme")=="dark"){changeDark();}
else if(localStorage.getItem("meek_theme")=="light"){changeLight();}

function changeDark(){
    document.getElementsByTagName("html")[0].attributes.getNamedItem("data-color-mode").value="dark";
    document.getElementById("themeSwitch").attributes.getNamedItem("d").value=IconList["moon"];
    if(utterancesLoad==1){utterancesTheme("dark-blue");}
}
function changeLight(){
    document.getElementsByTagName("html")[0].attributes.getNamedItem("data-color-mode").value="light";
    document.getElementById("themeSwitch").attributes.getNamedItem("d").value=IconList["sun"];
    if(utterancesLoad==1){utterancesTheme("github-light");}
}
function modeSwitch(){
    if(document.getElementsByTagName("html")[0].attributes[0].value=="light"){changeDark();localStorage.setItem("meek_theme","dark");}
    else{changeLight();localStorage.setItem("meek_theme","light");}
}
function utterancesTheme(theme){
    const message = {type: 'set-theme',theme: theme};
    const iframe = document.getElementsByClassName('utterances-frame')[0];
    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
}

console.log("\n %c Gmeek "+blogBase["GMEEK_VERSION"]+" %c https://github.com/Meekdai/Gmeek \n\n", "color: #fff; background-image: linear-gradient(90deg, rgb(47, 172, 178) 0%, rgb(45, 190, 96) 100%); padding:5px 1px;", "background-image: linear-gradient(90deg, rgb(45, 190, 96) 0%, rgb(255, 255, 255) 100%); padding:5px 0;");

if(htmlType=="plist"){
    var postListJson=blogBase["postListJson"];
    document.title=blogBase["title"];
    document.getElementById("avatarImg").src=blogBase["avatarUrl"];
    document.getElementById("blogTitle").innerHTML=blogBase["displayTitle"];
    document.getElementById("blogSubTitle").innerHTML=blogBase["subTitle"];
    document.getElementById("searchSite").setAttribute("value","site:"+blogBase["homeUrl"]);
    document.getElementById("buttonRSS").childNodes[0].childNodes[0].setAttribute("d",value=IconList["rss"]);
    document.getElementById("buttonLink").setAttribute("title",i18n[3]);
    document.getElementById("buttonAbout").setAttribute("title",i18n[4]);
    document.getElementById("buttonSearch").innerHTML=i18n[5];
    document.getElementById("searchSVG").setAttribute("d",value=IconList["search"]);

    var navList=document.getElementById("navList");
    for(var num in postListJson){
        if(blogBase["singlePage"].indexOf(postListJson[num]["label"])==-1){
            SideNavItem=document.createElement("a");
            SideNavItem.setAttribute("class", "SideNav-item d-flex flex-items-center flex-justify-between");
            SideNavItem.setAttribute("href", postListJson[num]["postUrl"]);
    
            div=document.createElement("div");
            svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
            path=document.createElementNS("http://www.w3.org/2000/svg","path"); 
            span=document.createElement("span");
            div.setAttribute("class","d-flex flex-items-center");
            svg.setAttributeNS(null,"class","SideNav-icon octicon");
            svg.setAttributeNS(null,"style","witdh:16px;height:16px");
            path.setAttributeNS(null, "d", IconList["post"]);
            span.innerHTML=postListJson[num]["postTitle"];
            svg.appendChild(path);
            div.appendChild(svg);
            div.appendChild(span);
            SideNavItem.appendChild(div);
    
            div=document.createElement("div");
            div.setAttribute("class","listLabels");
    
            if(postListJson[num]["commentNum"]>0){
                span=document.createElement("span");
                span.setAttribute("class","Label");
                span.setAttribute("style","background-color:"+blogBase["commentLabelColor"]);
                span.innerHTML=postListJson[num]["commentNum"];
                div.appendChild(span);
            }
    
            span=document.createElement("span");
            span.setAttribute("class","Label");
            span.setAttribute("style","background-color:"+postListJson[num]["labelColor"]);
            span.innerHTML=postListJson[num]["label"];
            div.appendChild(span);
    
            span=document.createElement("span");
            span.setAttribute("class","Label");
            span.setAttribute("style","background-color:"+postListJson[num]["dateLabelColor"]);
            date=new Date(postListJson[num]["createdAt"] * 1000);
            span.innerHTML=date.getFullYear()+"-"+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+"-"+(date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            div.appendChild(span);
            
            SideNavItem.appendChild(div);
            navList.appendChild(SideNavItem);
        }
        else{
            if(postListJson[num]["label"]=="link"){
                document.getElementById("buttonLink").childNodes[0].childNodes[0].setAttribute("d",value=IconList["link"]);
                document.getElementById("buttonLink").style="display:block";
            }
            else if(postListJson[num]["label"]=="about"){
                document.getElementById("buttonAbout").childNodes[0].childNodes[0].setAttribute("d",value=IconList["person"]);
                document.getElementById("buttonAbout").style="display:block";
            }
        }
    }

    

}
else{

    document.title=blogBase["postTitle"];
    document.getElementById("postTitle").innerHTML=blogBase["postTitle"];
    document.getElementById("postBody").innerHTML=blogBase["postBody"];
    document.getElementById("buttonHome").setAttribute("title",i18n[6]);
    document.getElementById("cmButton").innerHTML=i18n[7];
    function gotoSource(){window.open(blogBase["postSourceUrl"]);}
    document.getElementById("pathHome").setAttribute("d",value=IconList["home"]);
    document.getElementById("pathIssue").setAttribute("d",value=IconList["github"]);

    if(blogBase["commentNum"]>0){
        cmButton=document.getElementById("cmButton");
        span=document.createElement("span");
        span.setAttribute("class","Counter");
        span.innerHTML=blogBase["commentNum"];
        cmButton.appendChild(span);
    }

    function openComments(){
        cm=document.getElementById("comments");
        cmButton=document.getElementById("cmButton");
        cmButton.innerHTML=i18n[8];
        span=document.createElement("span");
        span.setAttribute("class","AnimatedEllipsis");
        cmButton.appendChild(span);
    
        script=document.createElement("script");
        script.setAttribute("src","https://utteranc.es/client.js");
        script.setAttribute("repo",blogBase["repoName"]);
        script.setAttribute("issue-term","title");
        if(localStorage.getItem("meek_theme")=="dark"){script.setAttribute("theme","dark-blue");}
        else{script.setAttribute("theme","github-light");}
        script.setAttribute("crossorigin","anonymous");
        script.setAttribute("async","");
        cm.appendChild(script);
    
        int=self.setInterval("iFrameLoading()",200);
    }

    function iFrameLoading(){
        var utterances=document.getElementsByClassName('utterances');
        if(utterances.length==1){
            if(utterances[0].style.height!=""){
                utterancesLoad=1;
                int=window.clearInterval(int);
                document.getElementById("cmButton").style.display="none";
                console.log("utterances Load OK");
            }
        }
    }
    
}

