---
title: 自我记录
---

## 工程化优化

1. 按需引入
2. cdn
3. 拆包分包

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 核心运行时库
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "vendor-react";
            }
            // UI库
            if (id.includes("antd") || id.includes("element-plus")) {
              return "vendor-ui";
            }
            // 工具库
            if (id.includes("lodash") || id.includes("ramda")) {
              return "vendor-utils";
            }
            // 其他依赖
            return "vendor";
          }
          // 业务代码按路由拆分
          if (id.includes("/src/pages/")) {
            const match = id.match(/\/src\/pages\/(.*?)\//);
            return match ? `page-${match[1]}` : null;
          }
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

4. 压缩 br gzip
5. tree shaking``

## nginx 部署前端项目

```nginx
location / {
root D:\dist;
index index.html index.htm;
try files $uri $uri/ /index.html;#解决刷新404
}
location /dev/{ # dev后面带上/匹配/dev
#设置代理目标
proxy_pass http:/xxxxx.cn/;#url最后的/ 把上面匹配到的/dev删除掉
}
```

## 难点
### 封装了Table组件
这个table组件可以懒加载数据，可增加自定义列，前多少列悬停，加载不同的单元格，分组，排序，隐藏header的内容等
- 灵活性和扩展问题，只要需要后台配置数据，即可动态改变table
- 一级和二级表头数据处理表格前多少列悬停 计算每个的悬停距离
- 数据处理：分页和懒加载问题 加载图标问题 计算
- 操作高亮引导区域 
- 边框问题
- 颜色混合
- 单元格的层级问题，以及提示框 最下的 tr 跟随悬浮以及层级问题处理
- 最下方总结框问题
- 可以扩宽列
- 自定义列

### 封装hooks组件
- 封装测量工具
- 射线检测模型和事件处理
      通过用户点击的位置把浏览器的坐标[0,1]转为threejs的坐标映射为[-1,1]， 浏览器的默认坐标轴是左上角00点，我们需要根据当前的canvas在浏览器的位置，找到用户点击的位置在canvas中的[-1,1]的位置，x轴只要%*2 -1 即可，y需要反转坐标系 -%*2+1，然后得到以后通过threejs的raycaster射线检测，从场景中返回与相机相交模型，我们过滤出距离最近即可面积hi是我们点击的模型。
- three js 场景模型数据的操作（UI 2D和3D transform拖动输入双向绑定 undo redo ）
- 无感刷新
- 大文分片
     获取 CPU的数量 navigator.hardwareConcurrency 
     设置每个分块的大小 
     根据当前的文件大小计算出一共多少块 然后计算给每个cpu 分了多少块
     通过一个当前CPU数量的 for循环，给每个cpu开启一个worker进行hash计算
     在worker里面使用 FileReader 读取数据 然后使用 Spark MD5得到hash值
     计算完成后传递消息给页面，然后在做数据上传
- sse
    获取文件转换的进度

### 

### 网络
物理层 数据链路层 网络 传输 会话 表示 应用