# Gmeek

### [中文说明](https://github.com/Meekdai/Gmeek/blob/main/README_CN.md)

Gmeek is a Blog Generator based on `Github Pages` and `Github Issues` and `Github Actions`. No local deployment is required, and it only takes a few minutes from building to writing.

- [Demo](http://meekdai.github.io/)
- [Update Log](https://meekdai.github.io/post/Gmeek-geng-xin-ri-zhi.html)

### Feature

- The UI interface is of the same origin as Github, only Github’s native CSS is introduced：[primer.style](https://primer.style/css)
- After blog writing is completed in Issues, Actions are automatically triggered to perform deployment tasks.
- The comment system used [utteranc.es](https://utteranc.es/)

### Installation

1. Clone this repository to your own `XXX.github.io` repository
2. Configure your own secret key `secrets.meblog` in the repository to have read and write permissions, etc. The keyword definition can be changed in `Geek.yml`
3. Modify `GITHUB_NAME` and `GITHUB_EMAIL` in the `Geek.yml` file
4. Set the relevant parameters of `github page` in the repository configuration. The root directory of the website needs to be assigned to `docs/`, and the personal domain name needs to be configured here.
5. Configure the parameters in `config.json`, if not use, please use `''`, the `key` value cannot be deleted.
6. Add tags to the Issues of the repository, such as `link`, `about`, etc.
7. Finally, open an Issue and start writing an article. After saving, you can access it through https://XXX..github.io

The above installation is just a guide, and some configuration details will be written later. If you have any questions, please submit [Issues](https://github.com/Meekdai/Gmeek/issues) in this repository

### Thanks

- [utteranc.es](https://utteranc.es/)
- [primer.style](https://primer.style/css)
- [gitblog](https://github.com/yihong0618/gitblog)
