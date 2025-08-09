---
title: 日常记录
---

## 1、静态资源挂了，怎么处理

```js
// 监听所有静态资源加载错误（需在事件捕获阶段触发）
window.addEventListener(
  "error",
  (event) => {
    const target = event.target;
    // 过滤非资源错误（如JS报错）
    if (
      target &&
      (target.tagName === "IMG" ||
        target.tagName === "SCRIPT" ||
        target.tagName === "LINK")
    ) {
      const url = target.src || target.href; // 获取失败资源地址
      console.error("资源加载失败:", url);
      // 上报错误到监控系统
      reportError({ type: "RESOURCE_ERROR", url });
    }
  },
  true
); // 关键：使用捕获阶段监听
//对动态创建的资源（如异步加载的图片），单独绑定 onerror：
const img = new Image();
img.src = "";
img.onerror = () => {
  console.error("图片加载失败:", img.src);
  reportError({ type: "IMAGE_ERROR", url: img.src });
};
document.body.appendChild(img);
```

## 2、get post 区别

| 特性         | GET 方法                      | POST 方法        |
| ------------ | ----------------------------- | ---------------- |
| 语义         | 获取资源                      | 提交数据         |
| 数据位置     | URL 查询字符串                | 请求体(body)     |
| 数据可见性   | 明文显示在 URL 中             | 不可见(除非抓包) |
| 数据长度限制 | 受 URL 长度限制(约 2048 字符) | 无限制           |
| 安全性       | 不应传输敏感数据              | 相对更安全       |
| 缓存         | 可被缓存                      | 默认不缓存       |
| 幂等性       | 幂等(多次执行结果相同)        | 非幂等           |

## 3、http 1.0 1.1 2.0 3.0

#### HTTP/1.0 (1996)

核心特点：
基本请求/响应模型
每个请求需要新建 TCP 连接（无连接特性）
无 host 头字段（一个 IP 只能托管一个域名）
简单缓存控制（Expires 头）

#### HTTP/1.1 (1999) 🚀

关键改进：
持久连接（Connection: keep-alive）
管道化（pipelining，但存在队头阻塞）
强制 Host 头（支持虚拟主机）
分块传输编码（Transfer-Encoding: chunked）
更多缓存控制（Cache-Control, ETag）
新增方法（PUT, DELETE, OPTIONS 等）

#### HTTP/2 (2015) ⚡

革命性变化：
二进制分帧层（替代文本格式）
多路复用（解决队头阻塞）
头部压缩（HPACK 算法）
服务器推送（Server Push）
流优先级控制

#### HTTP/3 (2022) 🌐

底层革新：
基于 QUIC 协议（UDP 代替 TCP）
0-RTT 握手（快速重新连接）
改进的多路复用（解决 TCP 队头阻塞）
前向纠错（FEC）能力
连接迁移（切换网络不掉线）
| 特性 | HTTP/1.0 | HTTP/1.1 | HTTP/2 | HTTP/3 |
| ---------- | -------- | -------- | ------------ | ------------ |
| 传输协议 | TCP | TCP | TCP | UDP(QUIC) |
| 连接方式 | 非持久 | 持久连接 | 多路复用 | 改进多路复用 |
| 头部压缩 | 无 | 无 | HPACK | QPACK |
| 队头阻塞 | 严重 | 存在 | 流级别解决 | 彻底解决 |
| 握手延迟 | 高 | 高 | 中 | 0-RTT 可能 |
| 服务器推送 | 不支持 | 不支持 | 支持 | 优化支持 |
| 安全加密 | 可选 | 可选 | 事实要求 TLS | 强制加密 |

## 4、http https

| 特性   | HTTP (超文本传输协议)       | HTTPS (HTTP Secure)                |
| ------ | --------------------------- | ---------------------------------- |
| 全称   | HyperText Transfer Protocol | HyperText Transfer Protocol Secure |
| 端口   | 80                          | 443                                |
| 协议栈 | TCP + HTTP                  | TCP + TLS/SSL + HTTP               |
| 加密   | 明文传输                    | 加密传输                           |

## 5、文本框或者富文本多个的聚焦后话只有最后一个被聚焦的不会垃圾回收，这是一个 bug，官方也不打算修复，如果最后一个聚焦的是富文本 内容比较多 造成卡顿的时候 ，可以手动创建一个 然后聚焦，让这个创建的不会被垃圾回收。

## 6、问题分析与解答

---

### **1. 前端发送数据时，如果黑客篡改前端数据怎么办？**

- **风险**：前端代码在客户端运行，攻击者可通过开发者工具、抓包工具等修改请求参数。
- **防护措施**：
  - **后端数据校验**：对接收的所有数据进行合法性检查（如类型、范围、格式等）。
  - **身份认证与授权**：使用 Token（如 JWT）或 Session 验证用户身份，确保请求来源合法。
  - **HTTPS**：防止中间人攻击，确保传输过程加密。
  - **签名机制**：对敏感数据生成签名（如 HMAC），后端验证签名是否匹配。
  - **CSRF Token**：防御跨站请求伪造攻击。

---

### **2. `any` 和 `unknown` 有什么区别？**

- **`any`**：
  - 关闭类型检查，可以随意赋值和调用任何方法（如 `anyType.trim()`）。
  - 灵活性高，但完全失去 TypeScript 的类型安全优势。
- **`unknown`**：
  - 表示“未知类型”，不能直接操作，需通过类型断言或类型收窄后才能使用。
  - 更安全，强制开发者显式处理类型问题。
  ```typescript
  let a: any = "hello";
  a.trim(); // 合法，但可能运行时出错
  let b: unknown = "world";
  if (typeof b === "string") {
    b.trim(); // 合法，需类型检查
  }
  ```

---

### **3. 封装公共库时如何定义类型？**

- **原则**：通用性、灵活性、类型安全。
- **实践**：
  - **泛型**：适用于数据处理类库（如 `Array<T>`）。
  - **明确的接口（Interface）**：定义清晰的输入输出类型。
  - **联合类型与字面量类型**：支持多种合法值（如 `type Method = "GET" | "POST"`）。
  - **避免 `any`**：使用 `unknown` 或自定义类型替代。
  - **类型导出**：提供 `.d.ts` 文件或直接在代码中导出类型，方便使用者查阅。

---

### **4. 前端发请求 vs. Postman 复制 Cookie 发请求的区别**

- **前端直接发请求**：
  - 自动携带同域 Cookie（包括 `HttpOnly` Cookie）。
  - 受浏览器同源策略限制（跨域需 CORS 支持）。
- **Postman 复制 Cookie**：
  - 手动添加 Cookie，无法自动携带 `HttpOnly` Cookie（需显式复制）。
  - 绕过浏览器限制，直接发送请求，可能用于测试或攻击。
- **核心区别**：  
  Postman 的请求与前端请求在服务端看来无本质区别，但 `HttpOnly` Cookie 在前端无法通过 JavaScript 读取，只能由浏览器自动发送。

---

### **5. HTTPS 的 Body 在浏览器中是否显示为加密？**

- **答案**：在浏览器开发者工具的 **Network 面板**中看到的 HTTPS 请求/响应 Body 是解密后的明文。
- **原因**：  
  HTTPS 的加密发生在传输层（TLS/SSL），浏览器在接收到数据后会自动解密。开发者工具展示的是应用层（HTTP）的数据，因此是明文。
  - 验证加密：在请求详情中查看 **Protocol** 字段是否为 `h2`（HTTP/2）或 `http/1.1`，同时检查 URL 是否为 `https://`。

---

### **7. 手写防抖与节流**

- **防抖（Debounce）**：  
  触发后延迟执行，若在延迟期间重复触发，则重新计时。
  ```javascript
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  ```
  **场景**：搜索框输入联想、窗口 resize。
- **节流（Throttle）**：  
  固定时间间隔内只执行一次。
  ```javascript
  function throttle(fn, interval) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  }
  ```

### **8. 浏览器输入 url 后**

- URL 检测：纠错／补全
- DNS
- TCP 三次握手（ SSL 握手）
- 准备请求（请求头： cookie +...）
- 发送请求（ GET ）
- 服务器处理请求
- 服务器响应
- 浏览器收到响应头
- 处理响应头（set-cookie、content-type、缓存、状态码、connection:keep-alive）
- 收响应体
- 渲染
  ○ 解析（预处理线程，资源加载，资源描述符 async defer
  ○ prefetch repload）
  ○ 生成 DOM 树＋ CSSOM 树
  ○ 样式计算
  ○ Layout 布局
  ○ layer 分层
  ○ paint 绘制
  一主线程结束，可以继续进行后续任务一 -合成线程开始
  ○ tiles 分块
  ○ 栅格化
  ○ draw
- 四次挥手
