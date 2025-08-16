---
title: 工程化相关
---

## 工程化优化

### 按需引入

### cdn

### 路由懒加载

### 拆包分包

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer"; //分析工具

export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      output: {
        outDir: "dist",
        //超出大小的警告
        chunkSizeWarningLimit: 200,
        //资源目录
        assetsDir: "images",
        // sourcemap
        //一般情况下都不能直接将 sourcemap 部署到生产环境，因为会暴露源码
        // 面试官：sourcemap 是什么？？？如果不能上传到生产环境的话，怎么定位线上报错问题？？？
        // 实战：企业级性能与异常监控平台，会托管 sourcemap 文件，通过 sourcemap 文件定位到源码
        sourcemap: true,
        //打包映射的资源文件
        manifest: true,
        //一种方式
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 核心运行时库
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "chunk-react";
            }
            // UI库
            if (id.includes("antd") || id.includes("element-plus")) {
              return "chunk-ui";
            }
            // 工具库
            if (id.includes("lodash")) {
              return "chunk-utils";
            }
            // 其他依赖
            return "chunk";
          }
          // 业务代码按路由拆分
          if (id.includes("/src/pages/")) {
            const match = id.match(/\/src\/pages\/(.*?)\//);
            return match ? `page-${match[1]}` : null;
          }
        },
        //另一种方式
        manualChunks: {
          "chunk-react": ["react", "react-dom", "scheduler"],
          "chunk-ui": ["antd", "element-plus"],
          "chunk-utils": ["lodash"],
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        experimentalPreload: true,
      },
    },
  },
});
```

### 压缩 br gzip

### tree shaking

### vite 插件
- 增强用户体验，加载速度
#### preload prefetch

- `preload` 提前加载资源
- `prefetch` 浏览器空闲时加载资源 ， 在空闲时加载未来会用到的资源

#### 打包配置自动生成

```javascript
export const preLayzPlugin = (type, prePaths = []) => {
  // 存储预加载 URL
  let preUrls = [];
  return {
    name: "vite-plugin-pre-lazy",
    // 在构建完成后处理
    async closeBundle() {
      // eslint-disable-next-line no-undef
      const outDir = path.resolve(process.cwd(), "dist");
      //找到映射文件
      const manifestPath = path.join(outDir, ".vite/manifest.json");
      if (fs.existsSync(manifestPath)) {
        //读取
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        //把读取到的映射文件 和 prePaths 匹配并且过滤
        preUrls = prePaths
          .map((item) => manifest[item]?.file)
          .filter(Boolean)
          .map((file) => "/" + file);
        //读取入口文件
        const filePath = path.join(outDir, "index.html");
        let html = fs.readFileSync(filePath, "utf-8");
        if (preUrls.length > 0) {
          let preStrs = "";
          //写入要pre脚本
          preUrls.forEach((item) => {
            preStrs += `<link rel="${type}" href="${item}" as="script">\n`;
          });
          html = html.replace("</head>", preStrs + "</head>");
          //写入文件
          fs.writeFileSync(filePath, html);
        }
      } else {
        console.warn(`Manifest not found at ${manifestPath}`);
      }
    },
  };
};
```

#### 注意事项

- 在 defineConfig 中一定要配置 `manifest: true,` ，
- 在 defineConfig 的使用`plugins: [react(), preLayzPlugin("preload", ["src/pages/home/home.jsx"])],`
