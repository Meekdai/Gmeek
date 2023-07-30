# 配置文件说明

### `config.js` 文件

里面的`key`值请不要修改，如没有其中的`value`值请填写`""`

```javascript
{
    "title":"Meekdai",
    "subTitle":"童话是一种生活态度，仅此而已。",
    "homeUrl":"http://blog.meekdai.com",
    "avatarUrl":"http://meekdai.com/avatar.jpg",
    "faviconUrl":"http://meekdai.com/favicon.ico",
    "startSite":"02/16/2015",
    "filingNum":"浙ICP备20023628号",
    "singlePage":["link","about"],
    "commentLabelColor":"#006b75",
    "yearColorList":["#bc4c00", "#0969da", "#1f883d", "#A333D0"],
    "i18n":"CN"
}
```

### `.github/workflows/Gmeek.yml` 文件 

注意修改其中的`GITHUB_NAME`和`GITHUB_EMAIL`两个参数。

```yml
name: build Gmeek

on:
  workflow_dispatch:
  issues:
    types: [opened, edited]

env:
  GITHUB_NAME: Meekdai
  GITHUB_EMAIL: meekdai@163.com

jobs:
  build:
    name: Generate blog
    runs-on: ubuntu-20.04
    if: github.event.repository.owner.id == github.event.sender.id 
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.8

      - name: Clone source code
        run: |
          git clone https://github.com/Meekdai/Gmeek.git /opt/Gmeek

      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r /opt/Gmeek/requirements.txt

      - name: Generate new html
        run: |
          cp -r ./* /opt/Gmeek/
          cd /opt/Gmeek/
          echo "====== check config.josn file ======"
          cat config.json
          echo "====== check config.josn end  ======"
          python Gmeek.py ${{ secrets.meblog }} ${{ github.repository }} --issue_number '${{ github.event.issue.number }}'
          cp -a /opt/Gmeek/docs ${{ github.workspace }} 
          cp -a /opt/Gmeek/backup ${{ github.workspace }} 
          cp /opt/Gmeek/blogBase.json ${{ github.workspace }} 
        
      - name: update html
        run: |
          git config --local user.email "${{ env.GITHUB_EMAIL }}"
          git config --local user.name "${{ env.GITHUB_NAME }}"
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
