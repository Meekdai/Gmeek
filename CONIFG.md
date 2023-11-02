# 配置文件说明

### `config.json` 文件

```javascript
{
    "title":"Meekdai",
    "displayTitle":"eekdai",
    "subTitle":"童话是一种生活态度，仅此而已。",
    "homeUrl":"http://blog.meekdai.com",
    "avatarUrl":"http://meekdai.com/avatar.jpg",
    "faviconUrl":"http://meekdai.com/favicon.ico",
    "singlePage":["link","about"],
    "GMEEK_VERSION":"v2.5"
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
```
另有不清楚的也可以参考 https://github.com/Meekdai/meekdai.github.io/blob/main/config.json


### `.github/workflows/Gmeek.yml` 文件 

此文件保存到指定目录即可，无需修改。

```yml
name: build Gmeek

on:
  workflow_dispatch:
  issues:
    types: [opened, edited]

jobs:
  build:
    name: Generate blog
    runs-on: ubuntu-20.04
    if: github.event.repository.owner.id == github.event.sender.id
    permissions: write-all
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v3

      - name: Get config.json
        run: |
          echo "====== check config.josn file ======"
          cat config.json
          echo "====== check config.josn end  ======"
          sudo apt-get install jq

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.8

      - name: Clone source code
        run: |
          git clone -b $(jq -r ".GMEEK_VERSION" config.json) https://github.com/Meekdai/Gmeek.git /opt/Gmeek

      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r /opt/Gmeek/requirements.txt

      - name: Generate new html
        run: |
          cp -r ./* /opt/Gmeek/
          cd /opt/Gmeek/
          python Gmeek.py ${{ secrets.GITHUB_TOKEN }} ${{ github.repository }} --issue_number '${{ github.event.issue.number }}'
          cp -a /opt/Gmeek/docs ${{ github.workspace }} 
          cp -a /opt/Gmeek/backup ${{ github.workspace }} 
          cp /opt/Gmeek/blogBase.json ${{ github.workspace }} 
          
      - name: update html
        run: |
          git config --local user.email "$(jq -r ".email" config.json)"
          git config --local user.name "${{ github.repository_owner }}"
          git add .
          git commit -a -m '🎉auto update by Gmeek action' || echo "nothing to commit"
          git push || echo "nothing to push"
          sleep 3
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'docs/.'
          
  deploy:
    name: Deploy blog
    runs-on: ubuntu-20.04
    needs: build
    permissions:
      contents: write
      pages: write
      id-token: write
    concurrency:
      group: "pages"
      cancel-in-progress: false
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2

```
