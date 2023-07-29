**简体中文** | **[English](README-en.md)**
# Gmeek

一个博客框架，完全基于`Github Page` 、 `Github Issues` 和 `Github Actions`。不需要本地部署，从搭建到写作，只需要几分钟的时间。

- [Demo页面](http://meekdai.github.io/)
- [更新日志](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)

### 特性

- UI界面和Github同源，只引入了Github原生CSS：[primer.style](https://primer.style/css)
- 博客写作在Issues中完成后，自动触发Actions执行部署任务
- 评论系统引入[utteranc.es](https://utteranc.es/)

### 安装

1. 克隆本仓库到自己的`XXX.github.io`的仓库
2. 在仓库中配置自己的秘钥`secrets.meblog`有读写权限等，关键字定义在`Geek.yml`中可改
3. 修改`Geek.yml`文件中的`GITHUB_NAME` 和 `GITHUB_EMAIL`
4. 在仓库配置中设置`github page`的相关参数，网站根目录需要指定到`docs/`，需要配置个人域名的也在这里配置
5. 配置`config.json`中的参数，如没有请留空，不能删除`key`值
6. 给仓库的Issues添加标签，如`link`、`about`等
7. 最后打开一个Issues，开始编写文章，保存后即可通过https://XXX..github.io 访问

以上安装仅仅只是一个指导，其中有一些配置细节会在后续编写，如果有问题可在本仓库提交[Issues](https://github.com/Meekdai/Gmeek/issues),或者添加 QQ：`294977308`

### 鸣谢

- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)
