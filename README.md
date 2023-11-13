**简体中文** | **[English](README-en.md)**
# Gmeek

一个博客框架，超轻量级个人博客模板。完全基于`Github Pages` 、 `Github Issues` 和 `Github Actions`。不需要本地部署，从搭建到写作，只需要18秒，2步搭建好博客，第3步就是写作。

- [Demo页面](http://meekdai.github.io/)
- [更新日志](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)

![light](img/light.jpg)

### 安装

1. 点击[创建仓库](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai)，建议仓库名称为`XXX.github.io`，其中`XXX`为你的github用户名。

2. 在你创建好的仓库的设置`Settings`中`Pages->Build and deployment->Source`下面选择`Github Actions`。

3. 打开一篇issue，开始写作，并且添加一个标签，保存issue后会自动创建博客内容，片刻后可通过https://XXX.github.io 访问

如果有问题可在本仓库提交[Issues](https://github.com/Meekdai/Gmeek/issues)

### 特性

- UI界面和Github同源，只引入了Github原生CSS：[primer.style](https://primer.style/css)
- 博客写作在Issues中完成后，自动触发Actions执行部署任务
- 评论系统引入[utteranc.es](https://utteranc.es/)
- 使用`jinja2`对html进行渲染，可通过模板自定义UI主题

### 说明
1. 请确保每一篇文章有且仅有一个`Label`，为了防止他人提交的Issue也被抓取生成文章。

2. 如果要导入以前的文章，如何设置发布时间呢？  
如需上传旧博客的文章需要修改发布时间，可以在文章最后一行添加如下代码。里面的时间是采用时间戳的形式，可以用如下[网站](https://tool.lu/timestamp)转换。  
```html
<!-- ##{"timestamp":1490764800}## -->
```

3. 自定义单篇文章页面的`style`和`script`，同样是在文章最后一行添加如下代码，为JSON格式。
```html
<!-- ##{"style":"<style>#postBody{font-size:20px}</style>"}## -->
```
```html
<!-- ##{"script":"<script async src='//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'></script>"}## -->
```
4. 可同时一起添加多种自定义参数：  
```html
<!-- ##{"script":"<script async src='//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'></script>","style":"<style>#postBody{font-size:20px}</style>","timestamp":1490764800}## -->
```

5. 如果修改过config.json里面的参数后，发现生成文章失败，或其他奇奇怪怪的问题。  
建议通过Actions->build Gmeek->Run workflow->里面的按钮全局重新生成一次就行。

6. 置顶博客文章,只需要`Pin issue`即可。

7. 如果在评论里面登录后评论报错，可直接按照提示安装`utteranc app`即可
> Error: utterances is not installed on xxx/xxx.github.io. If you own this repo, install the app. Read more about this change in the PR.

### 配置文件

`config.json` 文件
```javascript
{
    "title":"Meekdai",
    "displayTitle":"eekdai",
    "subTitle":"童话是一种生活态度，仅此而已。",
    "homeUrl":"http://blog.meekdai.com",
    "avatarUrl":"http://meekdai.com/avatar.jpg",
    "faviconUrl":"http://meekdai.com/favicon.ico",
    "singlePage":[],
    "GMEEK_VERSION":"last"
}
```
以上是必须的字段，修改为自己的信息即可，下面是可以自定义字段的描述，可以选择加入到`config.json`中。

```javascript
"email":"meekdai@163.com",
"startSite":"02/16/2015",
"filingNum":"浙ICP备20023628号",
"onePageListNum":15,
"commentLabelColor":"#006b75",
"yearColorList":["#bc4c00", "#0969da", "#1f883d", "#A333D0"],
"i18n":"CN",
"dayTheme":"light",
"nightTheme":"dark_colorblind",
"urlMode":"pinyin",
```
另有不清楚的也可以参考 https://github.com/Meekdai/meekdai.github.io/blob/main/config.json


### 鸣谢
- [jinja2](https://jinja.palletsprojects.com/)
- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)

### License

请保留页面底部和console界面版权信息，谢谢！
