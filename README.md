**简体中文** | **[English](README-en.md)**
# Gmeek

一个博客框架，超轻量级个人博客模板。完全基于`Github Pages` 、 `Github Issues` 和 `Github Actions`。不需要本地部署，从搭建到写作，只需要18秒，2步搭建好博客，第3步就是写作。

- [Demo页面](http://meekdai.github.io/)
- [更新日志](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)
- [Gmeek快速上手](https://blog.meekdai.com/post/Gmeek-kuai-su-shang-shou.html)

![light](img/light.jpg)

### 安装

1. 点击[通过模板创建仓库](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai)，建议仓库名称为`XXX.github.io`，其中`XXX`为你的github用户名。

2. 在你创建好的仓库的设置`Settings`中`Pages->Build and deployment->Source`下面选择`Github Actions`。

3. 打开一篇issue，开始写作，并且添加一个标签，保存issue后会自动创建博客内容，片刻后可通过https://XXX.github.io 访问

### 提交问题

1. 如果有问题可参考[Gmeek快速上手](https://blog.meekdai.com/post/Gmeek-kuai-su-shang-shou.html)   
2. 在本仓库提交[Issues](https://github.com/Meekdai/Gmeek/issues)之前，请手动全局生成一次。如果还有错误，提交`Issues`后，我会帮忙查看构建流程，定位问题出处。   
3. 手动全局生成一次方法：
```
通过Actions->build Gmeek->Run workflow->里面的按钮全局重新生成一次
```

### 特性

- UI界面和Github同源，只引入了Github原生CSS：[primer.style](https://primer.style/css)
- 博客写作在Issues中完成后，自动触发Actions执行部署任务
- 评论系统引入[utteranc.es](https://utteranc.es/)
- 使用`jinja2`对html进行渲染，可通过模板自定义UI主题

### 鸣谢
- [jinja2](https://jinja.palletsprojects.com/)
- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)

### License

请保留页面底部和console界面版权信息，谢谢！
