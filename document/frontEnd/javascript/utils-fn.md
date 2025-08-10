---
title: 工具函数
---

## 1. 大文件分片上传

#### 定义 handleUploadFile.js 文件

```javascript
// import SparkMD5 = require("spark-md5");
import SparkMD5 from "spark-md5";
const CHUNK_SIZE = 1024 * 1024 * 5;
const THREAD_COUNT = navigator.hardwareConcurrency || 4; //10 CPU内核数量
/**
 *
 * @param {*文件对象} file
 * @returns
 */
export async function cutFile(file) {
  return new Promise((resolve) => {
    let chunkDataInfo = [];
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE); //99 一共有多少个分片
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT); //10 每个CPU内核处理多少个分片
    let threadDoneCount = 0;
    console.log(
      `一共有${chunkCount}分片,CPU内核数${THREAD_COUNT},每个CPU内核分到分片数量${threadChunkCount}`
    );
    //创建线程，并且分配任务
    for (let i = 0; i < THREAD_COUNT; i++) {
      const woker = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
      const start = i * threadChunkCount; //当前线程处理分片开始位置
      let end = (i + 1) * threadChunkCount; //当前线程处理分片结束位置
      //如果大于总的分片数量那么就等于它
      if (end > chunkCount) {
        end = chunkCount;
      }
      //传递给worker进行CPU计算hash
      woker.postMessage({
        file,
        name: `worker线程${i}`,
        chunkSize: CHUNK_SIZE,
        startThreadIndex: start,
        endThreadIndex: end,
      });
      //等待接受worker计算完成hash后的数据回调
      woker.onmessage = (e) => {
        console.log(`主线程接收worker线程${i}和数据`, e.data);
        //不能直接push，因为不能保证按顺序完成计算，所以需要根据当前开启的worker处理的分片数据位置来进行赋值
        for (let i = start; i < end; i++) {
          chunkDataInfo[i] = e.data[i - start];
        }
        //等到运行这个回调函数时证明已经完成计算，结束当前的worker线程
        woker.terminate();
        //然后让完成的线程数量+1
        threadDoneCount++;
        //当完成的线程和系统的线程一样的时候，证明所有的hash都已经处理完毕，返回数据
        if (threadDoneCount === THREAD_COUNT) resolve(chunkDataInfo);
      };
    }
  });
}
export async function createChunk(file, index, chunkSize, name) {
  return new Promise((resolve) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const blob = file.slice(start, end);
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      resolve({
        start,
        end,
        index,
        hash: spark.end(),
        blob,
        name,
      });
    };
    fileReader.readAsArrayBuffer(blob);
  });
}
```

#### 定义 Worker.js

```javascript
import { createChunk } from "./handleUploadFile";

self.onmessage = async (e) => {
  console.log(`worker接收主线程传递过来的数据`, e.data);
  const { file, chunkSize, startThreadIndex, endThreadIndex, name } = e.data;
  let threadHandleChunkData = [];
  for (let i = startThreadIndex; i < endThreadIndex; i++) {
    const chunkObj = createChunk(file, i, chunkSize, name);
    threadHandleChunkData.push(chunkObj);
  }
  const chunks = await Promise.all(threadHandleChunkData);
  self.postMessage(chunks);
};
```

#### 使用

```javascript
const chooseFile = async (e) => {
  const fileObj = e.target.files[0];
  console.time("cutFile");
  const fileHandleInfo = await cutFile(fileObj);
  console.timeEnd("cutFile");
  console.log(fileHandleInfo);
};
```

## 2. 无感刷新 Token

#### 二次封装 axios ./service.js

```javascript
import axios from "axios";
import { getToken, setRefreshToken, setToken, clearToken } from "./token";
import { USERS } from "./constantAPI";
import { refreshToken, isRefreshToken } from "./refreshToken";

/**
 * @constant {BASE_URL} 获取.env 里面的基础url
 */
const BASE_URL = import.meta.env.VITE_BASE_URL;
/**
 * @typedef {Object} 网络请求的配置
 */
const options = {
  baseURL: BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
};
//创建axios网络请求
const service = axios.create(options);

/**
 * @description 拦截所有的API请求，并加上token请求
 */
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @description  拦截所有的API响应 ，设置token 和 refreshToken 。
 * @description  并在401处理token使用refreshToken刷新，实现无感刷新
 */
service.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    if (config.url === USERS.LOGIN) {
      const { token, refreshToken } = data.data;
      setToken(token.replace("Bearer ", ""));
      setRefreshToken(refreshToken.replace("refresh ", ""));
    }
    if (config.url === USERS.REFRESH_TOKEN) {
      const { token } = data.data;
      setToken(token.replace("Bearer ", ""));
      // setRefreshToken(refreshToken);
    }
    return data;
  },
  async (error) => {
    const { response } = error;
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }
    if (response.status === 401 && !isRefreshToken(response.config)) {
      const isSuccess = await refreshToken();
      if (isSuccess) {
        return service.request(response.config);
      }
    }
    clearToken();
    window.location.href = "/login";
    return Promise.reject(error);
  }
);

export default service;
```

#### 封装 ./token.js

```javascript
/**
 * 此文件是关于token和refreshToken的 存储 获取 以及 清除 的js方法文件
 */

import { TOKEN_TYPE } from "../../common/constant";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_TYPE.TOKEN, token);
};

export const setRefreshToken = (refreshToken) => {
  localStorage.setItem(TOKEN_TYPE.REFRESH_TOKEN, refreshToken);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_TYPE.TOKEN);
};

export const getRefreshToken = () => {
  return localStorage.getItem(TOKEN_TYPE.REFRESH_TOKEN);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_TYPE.TOKEN);
  localStorage.removeItem(TOKEN_TYPE.REFRESH_TOKEN);
};
```

#### 封装 ./refreshToken.js

```javascript
import { USERS } from "./constantAPI";
import service from "./service";
import { getRefreshToken } from "./token";
/**
 * @description 长token刷新短token方法，标记上上当前的请求是 __isRefreshToken
 * @returns {boolean} token 是否刷新成功
 */
export const refreshToken = async () => {
  const res = await service.post(
    USERS.REFRESH_TOKEN,
    {
      refreshToken: getRefreshToken(),
    },
    {
      __isRefreshToken: true,
    }
  );
  console.log(res);
  return res.code === 200;
};
/**
 * @description 用来获取当前的请求是不是refreshToken API
 * @param {Headers} config
 * @returns {boolean}
 */
export const isRefreshToken = (config) => {
  return !!config.__isRefreshToken;
};
```

```javascript

```

## 3. 封装 SSE

```javascript
/**
 * @description SSE(Server Send Event)
 * @example
 * const sse = new SSEClient('http://api.example.com/sse');
 * sse.connect();
 * sse.on('message', (data) => console.log('message:', data));
 * sse.on('error', (err) => console.error('error:', err));
 */
class SSEClient {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.listeners = new Map();
  }
  connect() {
    this.eventSource = new EventSource(this.url);
    this.eventSource.onmessage = (event) => {
      this.emit("message", JSON.parse(event.data));
    };
    this.eventSource.onerror = (error) => {
      this.emit("error", error);
      this.reconnect();
    };
  }
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      const listener = (event) => {
        callback(JSON.parse(event.data));
      };
      this.eventSource.addEventListener(eventName, listener);
      this.listeners.set(eventName, listener);
    }
  }
  emit(eventName, data) {
    const callback = this.listeners.get(eventName);
    if (callback) callback(data);
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.listeners.clear();
    }
  }
  reconnect() {
    this.close();
    setTimeout(() => this.connect(), 3000);
  }
}
export default SSEClient;
```

## 4. 并发控制请求

```javascript
export default function concurrentRequestControl(urlList, maxNum) {
  return new Promise((resolve) => {
    if (urlList.length === 0) {
      resolve([]);
      return;
    }
    let nextIndex = 0;
    let results = [];
    let doneCount = 0;
    async function _request() {
      const currentIndex = nextIndex;
      const url = urlList[nextIndex];
      nextIndex++;
      try {
        const res = await fetch(url);
        results[currentIndex] = res;
      } catch (error) {
        results[currentIndex] = error;
      }
      doneCount++;
      if (nextIndex < urlList.length) {
        _request();
      }
      if (doneCount === urlList.length) {
        resolve(results);
      }
    }
    for (let i = 0; i < Math.min(urlList.length, maxNum); i++) {
      _request();
    }
  });
}
```

## 5. 防抖 & 节流

```javascript
/**
 * Usage: debounce｜throttle
 * 
const yourDebounceFun = useCallback(
    debounce((arg1,arg2) => {
        console.log(arg1,arg2);
        // ... your logic
    }, 500),
    []
);
const yourThrottleFun = useCallback(
    throttle((arg1,arg2) => {
        console.log(arg1,arg2);
        // ... your logic
    }, 500),
    []
);
yourDebounceFun(arg1,garg2);
yourThrottleFun(arg1,garg2);
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn, delay) {
  let flag = true;
  return function (...args) {
    if (!flag) return;
    flag = false;
    fn.apply(this, args);
    setTimeout(() => {
      flag = true;
    }, delay);
  };
}

// 防抖：最后一次触发后执行
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 节流：固定间隔执行
function throttle(fn, interval) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn(...args);
      lastTime = now;
    }
  };
}
```

## 6. 比较两个对象是否相等

```javascript
export function isObjectValueEqual(objFirst, objSecond) {
  if (objFirst === objSecond) return true;
  let aProps = Object.keys(objFirst || "").length;
  let bProps = Object.keys(objSecond || "").length;
  if (aProps !== bProps) return false;
  for (let prop in objFirst) {
    if (Object.hasOwn(objSecond, prop)) {
      if (typeof objFirst[prop] === "object") {
        if (!isObjectValueEqual(objFirst[prop], objSecond[prop])) return false;
      } else if (objFirst[prop] !== objSecond[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}
```

## 7. 深度克隆对象

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj); // 解决循环引用

  let clone;
  switch (true) {
    case obj instanceof Date:
      clone = new Date(obj);
      break;
    case obj instanceof RegExp:
      clone = new RegExp(obj);
      break;
    case Array.isArray(obj):
      clone = [];
      break;
    default:
      clone = {};
  }
  hash.set(obj, clone); // 缓存已拷贝对象
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }
  return clone;
}
```
