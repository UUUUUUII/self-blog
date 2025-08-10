---
title: 搭建流程
---

如果你想搭建一个自己的博客，根据[VitePress](https://vitepress.dev/zh/)即可简单快速的搭建起来一个静态网页博客。
这个页面主要是记录我搭建的时候遇到的一些问题。

如果你想查看或者获取文档资源请移步[Github](https://github.com/UUUUUUII/self-blog),如果有帮助可以点个👍。

## 项目结构

```dos
SELF-BLOG/
├── .github/
│ └── workflows/
│   └── deploy.yml
├── .vitepress/
│ ├── cache/
│ ├── theme/
│ └── config.mts
├── document/
| ├── frontEnd/
|   ├── interviewQuestions/
|   ├── javascript/
│   └── index.md
| ├── public/
│   ├── gifs/
│   ├── images/
│   ├── document.svg
│   ├── logo.svg
│   ├── reinforce.svg
│   └── summarize.svg
| ├── self/
|   ├── dailyJS/
│   └── index.md
| ├── three/
|   ├── helperFuns/
│   └── index.md
│ ├── create-blog-guide.md
│ └── index.md
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## QA

### 一、侧边栏[vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)

我的侧边栏使用的是[vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)这个插件来自动生成的，就不需要我们自己在配置侧边栏选项，非常方便

#### srcDir 指定文档本目录

- 根据项目结构，把所有的都在 document 文件夹下，所以我们需要指定在 UserConfig 里面`srcDir: "./document"` 这样即可。
- 配置图标网站的时候需要在`UserConfig`里面,请注意 `href`。

```javascript
head: [
  [
    "link",
    {
      rel: "icon",
      href: "./logo.svg",
      type: "image/svg+xml",
    },
  ],
];
```

- 在 `UserConfig.themeConfig.logo`是配置页面里面的图标`logo: "/logo.svg"`
- 启动搜索文档功能后配置为中文在 `UserConfig.themeConfig.logo`配置。

```javascript
search: {
    provider: "local",
    options: {
      locales: {
        root: {
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              noResultsText: "无法找到相关结果",
              resetButtonTitle: "清除查询条件",
              footer: {
                selectText: "选择",
                navigateText: "切换",
                close: "关闭",
              },
            },
          },
        },
      },
    },
  }
```

### 二、部署

部署 Github pages 里面（[github-pages 参考](https://vitepress.dev/zh/guide/deploy#github-pages)），只能部署静态网页，完全免费。

#### 配置 UserConfig 中的 `base: "/self-blog/"`

#### 工作流
完成上面的操作后，根据上面的项目结构，我们需要更改（带⭐的改动）
```yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist # ⭐

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
