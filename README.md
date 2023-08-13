**简体中文** | **[English](README-en.md)**
# Gmeek

一个博客框架，超轻量级个人博客模板。完全基于`Github Pages` 、 `Github Issues` 和 `Github Actions`。不需要本地部署，从搭建到写作，只需要几分钟的时间，3步搭建好博客，第4步就是写作。

- [Demo页面](http://meekdai.github.io/)
- [更新日志](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)

![light](img/light.jpg)

### 安装

1. 创建自己的`XXX.github.io`的仓库，在仓库的设置中`Pages->Build and deployment->Source`下面选择`Github Actions`。
2. 在仓库中创建文件`config.json`和`.github/workflows/Gmeek.yml`复制[链接](CONIFG.md)中的代码分别保存。
3. 在Issues中删除多余标签，创建自己的标签，如`link`、`about`、`日常`等。
4. 打开一篇issue，开始写作，并且添加一个标签，保存issue后会自动创建博客内容，片刻后可通过https://XXX.github.io 访问

如果有问题可在本仓库提交[Issues](https://github.com/Meekdai/Gmeek/issues) 或者添加 QQ：`294977308`

### 特性

- UI界面和Github同源，只引入了Github原生CSS：[primer.style](https://primer.style/css)
- 博客写作在Issues中完成后，自动触发Actions执行部署任务
- 评论系统引入[utteranc.es](https://utteranc.es/)
- 使用`jinja2`对html进行渲染，可通过模板自定义UI主题

### 说明
1. 请确保每一篇文章有且仅有一个`Label`，为了防止他人提交的Issue也被抓取生成文章。

2. 如果要导入以前的文章，如何设置发布时间呢？  
> 如需上传旧博客的文章需要修改发布时间，可以在文章最后一行添加如下代码。  
> `[comment]: # (##{"timestamp":1451096020}##)`
> 里面的时间是采用时间戳的形式，可以用如下[网站](https://tool.lu/timestamp)转换。  

3. 如果修改过config.json里面的参数后，发现生成文章失败，或其他奇奇怪怪的问题。
> 建议通过Actions->build Gmeek->Run workflow->里面的按钮全局重新生成一次就行。

4. 置顶博客文章,只需要`Pin issue`即可。

### 鸣谢

- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)

### License

请保留页面底部和console界面版权信息，谢谢！
