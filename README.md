# self-blog

个人学习记录博客，使用 VitePress 构建并部署在 GitHub Pages。

在线访问：[笔记-Notes](https://uuuuuuii.github.io/self-blog/)

## 内容

- [前端](https://uuuuuuii.github.io/self-blog/frontEnd.html)：JavaScript 学习、算法、工具函数和前端工程化
- [Three.js](https://uuuuuuii.github.io/self-blog/three.html)：Three.js 相关学习记录和辅助函数
- [后端](https://uuuuuuii.github.io/self-blog/backEnd.html)：MySQL、NestJS 等后端技术笔记
- [个人记录](https://uuuuuuii.github.io/self-blog/self.html)：日常学习、问题记录和有趣知识
- [搭建 Blog](https://uuuuuuii.github.io/self-blog/create-blog-guide.html)：使用 VitePress 搭建和部署博客的过程记录

这些笔记主要用于总结知识、记录学习过程，并通过持续回顾巩固理解。

## 技术栈

- [VitePress](https://vitepress.dev/zh/)：静态文档网站生成器
- [vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)：根据文档目录自动生成侧边栏
- [canvas-confetti](https://github.com/cat-in-136/canvas-confetti)：首页彩带效果
- GitHub Pages + GitHub Actions：自动构建和部署

## 项目结构

```text
self-blog/
├── .github/workflows/deploy.yml  # GitHub Pages 部署流程
├── .vitepress/config.mts         # VitePress 配置
├── document/                     # 博客文档和静态资源
│   ├── frontEnd/                 # 前端学习记录
│   ├── backEnd/                  # 后端学习记录
│   ├── self/                     # 个人记录
│   ├── three/                    # Three.js 记录
│   └── index.md                  # 博客首页
├── package.json
└── README.md
```

## 本地运行

环境要求：Node.js 22 或更高版本。

```bash
# 安装依赖
npm ci

# 启动本地开发服务
npm run dev

# 构建静态文件
npm run build

# 预览构建结果
npm run preview
```

开发服务启动后，根据终端提示打开本地地址即可。新增或修改文章时，直接编辑 `document/` 目录下对应的 Markdown 文件。

## 部署

项目通过 GitHub Actions 部署到 GitHub Pages：

1. 将修改提交并推送到 `main` 分支。
2. GitHub Actions 自动安装依赖并执行 `npm run build`。
3. 构建产物发布到 GitHub Pages。

部署配置位于 `.github/workflows/deploy.yml`，站点路径配置在 `.vitepress/config.mts` 的 `base` 字段中。