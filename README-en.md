**[简体中文](README.md)** | **English**
# Gmeek

Gmeek is a Blog Generator based on `Github Pages` and `Github Issues` and `Github Actions`. No local deployment is required, and it only takes a few minutes from building to writing.

- [Demo](http://meekdai.github.io/)
- [Update Log](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)

![dark](img/dark.jpg)

### Installation
1. Create your own `XXX.github.io` repository. In the repository `Settings`, select `Github Actions` under `Pages->Build and deployment->Source`.
2. Create files `config.json` and `.github/workflows/Gmeek.yml` in the repository, copy the code in [link](CONIFG.md) and save them separately.
3. Delete redundant tags in Issues and create your own tags, such as `link`, `about`, `daily`, etc.
4. Open an issue and start writing. After saving the issue, the blog content will be automatically created. After a while, it can be accessed through https://XXX.github.io

The above installation is just a guide, and some configuration details will be written later. If you have any questions, please submit [Issues](https://github.com/Meekdai/Gmeek/issues) in this repository

### Feature

- The UI interface is of the same origin as Github, only Github’s native CSS is introduced：[primer.style](https://primer.style/css)
- After blog writing is completed in Issues, Actions are automatically triggered to perform deployment tasks.
- The comment system used [utteranc.es](https://utteranc.es/)

### Thanks

- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)
