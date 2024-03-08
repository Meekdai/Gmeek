**[简体中文](README.md)** | **English** | **[Русский](README-ru.md)**
# Gmeek

Gmeek is a Blog Generator based on `Github Pages` and `Github Issues` and `Github Actions`. No local deployment is required, and it only takes a few minutes to deploy.

- [Demo](http://meekdai.github.io/)
- [Update Log](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)
- [Gmeek Get Started](https://blog.meekdai.com/post/Gmeek-kuai-su-shang-shou.html)

![dark](img/dark.jpg)

### Installation
1. Click [Create a repository from template](https://github.com/new?template_name=Gmeek-template&template_owner=Meekdai), the recommended repository name is `XXX.github.io`,where `XXX` is your github username.

2. In the repository `Settings`, select `Github Actions` in `Pages->Build and deployment->Source`.

3. Open an issue, start writing, and add a label. After saving the issue, blog content will be automatically created. After a while, it can be accessed through https://XXX.github.io

The above installation is just a guide, and some configuration details will be written later. If you have any questions, please submit [Issues](https://github.com/Meekdai/Gmeek/issues) in this repository

### Feature

- The UI interface is of the same origin as Github, only Github’s native CSS is introduced：[primer.style](https://primer.style/css)
- After blog writing is completed in Issues, Actions are automatically triggered to perform deployment tasks.
- The comment system used [utteranc.es](https://utteranc.es/)

### Thanks
- [jinja2](https://jinja.palletsprojects.com/)
- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)
