
## 201. 冒泡排序的思路，不用 _sort_

- 相邻比较与交换：
  从数组的第一个元素开始，依次比较相邻的两个元素。若前一个元素比后一个大，则交换它们的位置。

- 多轮遍历：
  每一轮遍历会将当前未排序部分的最大元素“冒泡”到正确的位置（数组末尾）。重复此过程，直到整个数组有序。

- 优化终止：
  如果在某一轮遍历中没有发生任何交换，说明数组已完全有序，可提前终止排序。

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  let swapped; // 用于优化：记录是否发生交换

  for (let i = 0; i < n - 1; i++) {
    swapped = false;

    // 每轮遍历后，最大的元素会沉到末尾，无需再比较
    for (let j = 0; j < n - 1 - i; j++) {
      // 比较相邻元素
      if (arr[j] > arr[j + 1]) {
        // 交换位置
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果本轮未交换，说明已有序，提前终止
    if (!swapped) break;
  }

  return arr;
}

// 示例
const nums = [5, 3, 8, 4, 2];
console.log(bubbleSort(nums)); // [2, 3, 4, 5, 8]
```

## 202. _symbol_ 用途

JavaScript 中的 **`Symbol`** 是一种 **唯一且不可变** 的原始数据类型，用于创建独一无二的标识符。
| **场景** | **Symbol 的优势** |
|-----------------------|-------------------------------------------------------|
| 唯一属性名 | 避免命名冲突，保障属性安全性 |
| 元编程 | 通过内置 Symbol 控制对象内部行为 |
| 跨模块共享标识 | 使用 `Symbol.for()` 管理全局唯一标识 |
| 代码可维护性 | 替代魔法字符串，减少硬编码风险 |

- Symbol 属性需通过 `Object.getOwnPropertySymbols()` 获取，无法通过常规遍历（如 `for...in`）访问。
- 无法通过 `JSON.stringify()` 序列化 Symbol 属性。
- 适合用于 **框架、库开发** 或需要高度封装的场景。

## 203. 什么是函数式编程，应用场景是什么

- 函数式编程（Functional Programming，FP） 是一种以 函数为核心 的编程范式，强调通过 纯函数、不可变数据 和 声明式代码 构建程序。其核心思想是避免副作用（如修改外部状态），用数学函数式的思维解决问题。
- 场景：
  数据处理与转换
  状态管理
  并发与异步编程
  数学与算法实现

## 205. _JS_ 小数不精准，如何计算

- 简单场景：使用整数放大法或 toFixed。

- 高精度场景：依赖 decimal.js 等专业库。

- 比较浮点数：通过误差范围而非直接相等判断。

## 208. 给定一个字符串，请你找出其中不含有重复字符的最长子串的长度。

```javascript
function lengthOfLongestSubstring(s) {
  const charMap = {}; // 存储字符最后出现的位置
  let maxLength = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const currentChar = s[end];
    // 如果字符已存在且在窗口内，则更新窗口左边界
    if (charMap[currentChar] !== undefined && charMap[currentChar] >= start) {
      start = charMap[currentChar] + 1;
    }
    // 更新字符的最后出现位置
    charMap[currentChar] = end;
    // 计算当前窗口长度并更新最大值
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}
```

## 209. 有一堆整数，请把他们分成三份，确保每一份和尽量相等（11，42，23，4，5，6 4 5 6 11 23 42 56 78 90）(滴滴 _2020_)

```javascript
function divideIntoThreeParts(nums) {
  // 将数组从大到小排序
  const sorted = [...nums].sort((a, b) => b - a);
  // 初始化三个组的总和
  const sums = [0, 0, 0];

  for (const num of sorted) {
    // 找到当前总和最小的组的索引
    const minSumIndex = sums.indexOf(Math.min(...sums));
    // 将当前数添加到该组
    sums[minSumIndex] += num;
  }

  return sums;
}

// 示例输入
const nums = [11, 42, 23, 4, 5, 6, 4, 5, 6, 11, 23, 42, 56, 78, 90];
const result = divideIntoThreeParts(nums);
console.log("三组的总和分别为:", result);
```

## 210. 手写发布订阅（头条 2020）

```javascript
class EventEmitter {
  constructor() {
    this.events = {}; // 存储事件名与回调函数的映射
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 取消订阅
  off(eventName, callback) {
    const callbacks = this.events[eventName];
    if (!callbacks) return;

    if (!callback) {
      // 移除事件的所有回调
      delete this.events[eventName];
    } else {
      // 移除指定回调（包括 once 的包装函数）
      this.events[eventName] = callbacks.filter(
        (cb) => cb !== callback && cb.original !== callback
      );
    }
  }

  // 触发事件
  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      // 复制数组避免循环时修改原数组
      const copies = callbacks.slice();
      for (const cb of copies) {
        cb.apply(this, args);
      }
    }
  }

  // 一次性订阅
  once(eventName, callback) {
    const wrapper = (...args) => {
      // 先解除绑定避免多次执行
      this.off(eventName, wrapper);
      callback.apply(this, args);
    };
    wrapper.original = callback; // 保留原函数引用
    this.on(eventName, wrapper);
  }
}
```

## 211. 手写用 _ES6proxy_ 如何实现 _arr[-1]_ 的访问（滴滴 2020）

## 212. 下列代码执行结果

```js
console.log(1);
setTimeout(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(3);
  });
  new Promise((resolve) => {
    console.log(4);
    resolve();
  }).then(() => {
    console.log(5);
  });
});
new Promise((resolve) => {
  console.log(7);
  resolve();
}).then(() => {
  console.log(8);
});
process.nextTick(() => {
  console.log(6);
});
setTimeout(() => {
  console.log(9);
  process.nextTick(() => {
    console.log(10);
  });
  new Promise((resolve) => {
    console.log(11);
    resolve();
  }).then(() => {
    console.log(12);
  });
});
/**
1
7
6
8
2
4
3
5
9
9
9
9
9
11
10
12

 */
```

## 213. Number() 的存储空间是多大？如果后台发送了一个超过最大自己的数字怎么办

存储空间：Number 类型占 8 字节，安全整数上限为 2^53 - 1。

处理大数：通过字符串传输 + BigInt 或高精度库解决精度问题。

前后端协作：需约定大数的传输格式（如字符串），避免隐式转换。

## 214. 事件是如何实现的？(字节 2020)

基于浏览器事件驱动模型，依赖捕获/冒泡机制和事件循环。

## 215. 下列代码执行结果

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
//0123456
```

## 217. JavaScript 中的数组和函数在内存中是如何存储的？

- **数组**：
  - 快速模式（连续内存）和字典模式（哈希表）动态切换。
  - 堆内存存储数据，栈内存存储引用。
- **函数**：
  - 代码存储在代码区，对象和作用域链存储在堆中。
  - 闭包可能导致外层变量长期占用内存。

## 218. _JavaScript_ 是如何运行的？解释型语言和编译型语言的差异是什么？

- JavaScript 运行机制：基于 JIT 编译和事件循环，兼顾开发效率与执行性能。

- 解释型 vs 编译型：

- -- 编译型语言性能高但开发周期长，适合底层开发。

- --解释型语言灵活且跨平台，适合快速迭代和 Web 场景。

## 219. 列举你所了解的编程范式？

| **范式**     | **优势**                       | **典型场景**        |
| ------------ | ------------------------------ | ------------------- |
| **命令式**   | 直观控制流程，适合精细操作     | 系统开发、算法实现  |
| **函数式**   | 高可维护性，适合数据转换和并发 | 数据处理、数学计算  |
| **声明式**   | 简洁清晰，聚焦业务逻辑         | 数据库查询、UI 构建 |
| **事件驱动** | 高效处理异步任务               | GUI、实时应用       |

## 220. 什么是面向切面（AOP）的编程？

面向切面编程（AOP，Aspect-Oriented Programming）是一种编程范式，旨在通过模块化横切关注点（Cross-Cutting Concerns）来增强代码的复用性和可维护性。它补充了传统的面向对象编程（OOP），专注于解决那些在多个模块中重复出现、但与核心业务逻辑无关的功能性问题。

## 221. _JavaScript_ 中的 _const_ 数组可以进行 _push_ 操作吗？为什么？

const 仅确保变量 不能被重新赋值，但不会限制其指向的对象（如数组、对象）的 内部状态变更。

## 222. JavaScript 中对象的属性描述符有哪些？分别有什么作用？

| **方法**                                       | **作用**                      |
| ---------------------------------------------- | ----------------------------- |
| `Object.defineProperty(obj, prop, descriptor)` | 定义或修改单个属性描述符      |
| `Object.defineProperties(obj, descriptors)`    | 批量定义多个属性描述符        |
| `Object.getOwnPropertyDescriptor(obj, prop)`   | 获取属性描述符                |
| `Object.getOwnPropertyDescriptors(obj)`        | 获取对象所有属性描述符        |
| `Object.preventExtensions(obj)`                | 禁止添加新属性                |
| `Object.seal(obj)`                             | 密封对象（属性不可删除/新增） |
| `Object.freeze(obj)`                           | 冻结对象（完全不可修改）      |

JavaScript 的属性描述符提供了对对象属性的精细化控制，通过 `value`、`writable`、`get`、`set`、`configurable` 和 `enumerable` 六个核心字段，开发者可以实现：

- **数据保护**：防止意外修改或删除属性。
- **动态计算**：通过 `get`/`set` 实现属性逻辑。
- **不可变数据**：结合 `writable: false` 和 `configurable: false`。
- **隐藏属性**：通过 `enumerable: false` 避免被枚举。

## 223. _JavaScript_ 中 _console_ 有哪些 _api_ ?

| **方法**          | **作用**                                 | **示例**                           |
| ----------------- | ---------------------------------------- | ---------------------------------- |
| `console.log()`   | 输出普通日志                             | `console.log('Hello', { a: 1 })`   |
| `console.info()`  | 输出信息类日志（通常带`ℹ`图标）          | `console.info('用户登录成功')`     |
| `console.warn()`  | 输出警告类日志（黄色背景，带`⚠`图标）    | `console.warn('内存不足')`         |
| `console.error()` | 输出错误日志（红色背景，带`×`图标）      | `console.error('请求超时')`        |
| `console.debug()` | 输出调试日志（需浏览器开启详细日志显示） | `console.debug('临时变量:', temp)` |

### **表格化数据 `console.table()`**

| **方法**                   | **作用**                         |
| -------------------------- | -------------------------------- |
| `console.group()`          | 创建可折叠的日志分组（默认展开） |
| `console.groupCollapsed()` | 创建折叠的分组                   |
| `console.groupEnd()`       | 结束当前分组                     |

| **方法**           | **作用**                         |
| ------------------ | -------------------------------- |
| `console.trace()`  | 输出当前代码的调用栈追踪信息     |
| `console.assert()` | 条件断言，仅当断言为假时输出日志 |

| **方法**               | **作用**                       |
| ---------------------- | ------------------------------ |
| `console.count()`      | 统计代码执行次数（按标签计数） |
| `console.countReset()` | 重置计数器                     |

| **方法**            | **作用**                         |
| ------------------- | -------------------------------- |
| `console.clear()`   | 清空控制台                       |
| `console.memory`    | 查看内存使用情况（非标准属性）   |
| `console.timeLog()` | 输出计时器的当前值（不结束计时） |

## 224. 简单对比一下 _Callback、Promise、Generator、Async_ 几个异步 _API_ 的优劣？

| **特性**       | Callback          | Promise                | Generator         | Async/Await           |
| -------------- | ----------------- | ---------------------- | ----------------- | --------------------- |
| **代码可读性** | ❌ 嵌套地狱       | ✅ 链式调用            | ✅ 接近同步       | ✅ 同步化写法         |
| **错误处理**   | ❌ 手动传递 `err` | ✅ `.catch()` 统一处理 | ❌ 需结合 Promise | ✅ `try/catch`        |
| **流程控制**   | ❌ 弱             | ✅ 并发控制            | ✅ 灵活暂停/恢复  | ✅ 直观顺序执行       |
| **兼容性**     | ✅ 全环境支持     | ✅ ES6+                | ✅ ES6+           | ❌ 需 ES7+或转译      |
| **学习成本**   | ✅ 低             | ✅ 中等                | ❌ 高             | ✅ 低（基于 Promise） |
| **适用场景**   | 简单异步          | 链式/并发任务          | 复杂流程控制      | 现代异步编程首选      |

## 226. _Object.defineProperty_ 和 _ES6_ 的 _Proxy_ 有什么区别？

在 JavaScript 中，`Object.defineProperty` 和 `Proxy` 都可以用于拦截和自定义对象的行为。

| **特性**     | `Object.defineProperty`                | `Proxy`                                                  |
| ------------ | -------------------------------------- | -------------------------------------------------------- |
| **设计目的** | 精确控制单个属性的特性（如读写、枚举） | 拦截并自定义对象的所有操作（如读、写、删除、方法调用等） |
| **拦截粒度** | **属性级别**（需逐个定义属性）         | **对象级别**（代理整个对象的所有操作）                   |
| **兼容性**   | ES5+，广泛支持（包括旧浏览器）         | ES6+，不兼容 IE11 及以下                                 |

| **限制**               | `Object.defineProperty`           | `Proxy`                             |
| ---------------------- | --------------------------------- | ----------------------------------- |
| **监听数组变化**       | ❌ 需重写数组方法                 | ✅ 直接监听索引修改和 `push` 等操作 |
| **监听新增属性**       | ❌ 需手动调用 API（如 `Vue.set`） | ✅ 自动监听                         |
| **拦截 `delete` 操作** | ❌ 无法拦截 `delete obj.prop`     | ✅ 通过 `deleteProperty` 拦截       |
| **拦截 `in` 操作符**   | ❌ 无法监听 `'prop' in obj`       | ✅ 通过 `has` 拦截                  |

| **特性**       | `Object.defineProperty`       | `Proxy`                  |
| -------------- | ----------------------------- | ------------------------ |
| **适用场景**   | 兼容旧浏览器、简单属性劫持    | 现代浏览器、复杂对象拦截 |
| **开发便利性** | 需手动处理数组和新增属性      | 自动监听所有操作         |
| **性能权衡**   | 初始化慢但运行快              | 初始化快但运行略慢       |
| **未来趋势**   | 逐渐被 Proxy 替代（如 Vue 3） | 现代项目的首选方案       |

## 227. _intanceof_ 操作符的实现原理及实现

**实现原理**

1. **基本类型处理**：若对象是基本类型（如 `number`、`string`），直接返回 `false`。
2. **原型链遍历**：通过 `Object.getPrototypeOf()` 获取对象的原型，逐级向上查找。
3. **原型匹配**：若某一层原型等于构造函数的 `prototype` 属性，返回 `true`；若遍历至 `null`（原型链顶端），返回 `false`。

```javascript
function myInstanceof(instance, constructor) {
  // 处理基本类型
  if (typeof instance !== "object" || instance === null) return false;

  // 处理 Symbol.hasInstance（ES6 特性）
  if (typeof constructor[Symbol.hasInstance] === "function") {
    return constructor[Symbol.hasInstance](instance);
  }

  // 检查构造函数合法性
  if (typeof constructor !== "function") {
    throw new TypeError("Right-hand side of " instanceof " is not callable");
  }

  // 获取构造函数的原型
  const prototype = constructor.prototype;
  if (typeof prototype !== "object" || prototype === null) {
    throw new TypeError("Function has non-object prototype");
  }

  // 遍历原型链
  let currentProto = Object.getPrototypeOf(instance);
  while (currentProto !== null) {
    if (currentProto === prototype) return true;
    currentProto = Object.getPrototypeOf(currentProto);
  }
  return false;
}
```

## 228. 强制类型转换规则？

在 JavaScript 中，**强制类型转换**（Type Coercion）分为 **显式转换**（开发者主动调用方法）和 **隐式转换**（引擎自动转换）。以下是详细的转换规则和示例：

**一、显式强制类型转换**
通过调用方法或构造函数明确转换数据类型。
**1. 转数字**
| 方法 | 规则 | 示例 |
|---------------------|----------------------------------------------------------------------|---------------------------|
| `Number(value)` | 严格转换，非纯数字字符串或无效值返回 `NaN` | `Number('123') → 123` |
| `parseInt(string)` | 解析字符串直到非数字字符，忽略前导空格 | `parseInt('123abc') → 123`|
| `parseFloat(string)`| 解析浮点数，其他规则同 `parseInt` | `parseFloat('12.3') → 12.3|
| `+`运算符          | 将值转换为数字（同`Number()`）                                      | `+'42' → 42` |

**2. 转字符串**
| 方法 | 规则 | 示例 |
|---------------------|----------------------------------------------------------------------|---------------------------|
| `String(value)` | 直接转换为字符串，`null` → `"null"`，`undefined` → `"undefined"` | `String(123) → '123'` |
| `value.toString()` | 不能处理 `null` 和 `undefined` | `(true).toString() → 'true'` |
| 模板字符串 | 自动调用 `toString()` | `${42} → '42'` |

**3. 转布尔值**
| 方法 | 规则 | 示例 |
|---------------------|----------------------------------------------------------------------|---------------------------|
| `Boolean(value)` | 遵循 **Falsy 值**（`false`, `0`, `''`, `null`, `undefined`, `NaN`） | `Boolean('') → false` |
| `!!` 运算符 | 快速转布尔值（同 `Boolean()`） | `!!'hello' → true` |

**二、隐式强制类型转换**
在特定操作中，JavaScript 引擎自动转换类型。

**1. 数学运算中的转换**

- **`+` 运算符**：若操作数含字符串，优先转字符串拼接。
  ```javascript
  3 + "4"; // '34'（字符串拼接）
  "5" + null; // '5null'
  ```
- **其他运算符（`-`、`*`、`/`）**：强制转换为数字。
  ```javascript
  "10" - 2; // 8
  "5" * "2"; // 10
  ```
  **2. 逻辑判断中的转换**
- **`if`、`while` 等条件判断**：将值转换为布尔值。

  ```javascript
  if ("hello") {
    /* 执行（非空字符串为 true） */
  }
  if (0) {
    /* 不执行（0 为 false） */
  }
  ```

  **3. 相等比较（`==`）的转换**

- **`==` 的隐式转换规则**：
  1. 类型相同时直接比较值。
  2. 类型不同时，按优先级转换：
     - **对象 → 原始值**：调用 `valueOf()` 或 `toString()`。
     - **布尔值 → 数字**：`true → 1`，`false → 0`。
     - **字符串 ↔ 数字**：字符串转数字比较。
     - **对象 ↔ 非对象**：对象转原始值后比较。
  3. **特殊规则**：
     ```javascript
     null == undefined; // true
     NaN == NaN; // false（NaN 不等于自身）
     ```

**示例**：

```javascript
'42' == 42          // true（字符串 → 数字）
true == 1           // true（布尔 → 数字）
[] == 0             // true（对象 → 原始值 → 数字）
[] == ![]           // true（![] → false → 0，[] → '' → 0）
{} == '[object Object]' // true（对象 → 字符串）
```

---

**三、对象到原始值的转换**
对象转换为原始值时，引擎调用 `valueOf()` 和 `toString()` 方法，规则如下：

**1. 数值上下文（如 `+`、数学运算）**

1. 调用 `valueOf()`，若返回原始值则使用。
2. 否则调用 `toString()`，若返回原始值则使用。
3. 否则抛出错误。

**示例**：

```javascript
const obj = {
  valueOf: () => 42,
  toString: () => "100",
};
console.log(obj + 1); // 43（优先 valueOf）
```

**2. 字符串上下文（如 `alert()`、模板字符串）**

1. 调用 `toString()`，若返回原始值则使用。
2. 否则调用 `valueOf()`，若返回原始值则使用。
3. 否则抛出错误。

**示例**：

```javascript
const obj = {
  toString: () => "hello",
};
console.log(`${obj}`); // 'hello'
```

**3. 默认行为（如 `==` 比较）**
优先调用 `valueOf()`，若未返回原始值则调用 `toString()`。

**示例**：

```javascript
[] == 0; // true
// 转换过程：[] → valueOf() → []（非原始值） → toString() → '' → 0
```

## **四、特殊转换案例**

| **表达式**          | **结果**            | **原因**                                          |
| ------------------- | ------------------- | ------------------------------------------------- |
| `Number('')`        | `0`                 | 空字符串转数字为 0                                |
| `Number(null)`      | `0`                 | `null` 转数字为 0                                 |
| `Number(undefined)` | `NaN`               | `undefined` 转数字为 NaN                          |
| `Boolean({})`       | `true`              | 对象始终为 `true`                                 |
| `[] + {}`           | `"[object Object]"` | `[] → ''`，`{} → '[object Object]'`，拼接为字符串 |
| `{} + []`           | `0`                 | 此处 `{}` 被解析为空代码块，`+[] → 0`             |

## 229. _Object.is_( ) 与比较操作符 “===”、“==” 的区别

| **比较方式**      | **类型转换** | **特殊值处理（`NaN`、`±0`）**                                   | **适用场景**                 |
| ----------------- | ------------ | --------------------------------------------------------------- | ---------------------------- |
| **`==`**          | ✅ 自动转换  | `NaN != NaN`，`-0 == +0`                                        | 极少使用（存在隐式转换风险） |
| **`===`**         | ❌ 不转换    | `NaN !== NaN`，`-0 === +0`                                      | 大多数场景（严格判断）       |
| **`Object.is()`** | ❌ 不转换    | `Object.is(NaN, NaN) === true`<br>`Object.is(-0, +0) === false` | 特殊值精确比较               |

| **比较表达式**      | **`==`** | **`===`** | **`Object.is()`** |
| ------------------- | -------- | --------- | ----------------- |
| `NaN == NaN`        | `false`  | `false`   | `true`            |
| `-0 == +0`          | `true`   | `true`    | `false`           |
| `null == undefined` | `true`   | `false`   | `false`           |
| `5 == '5'`          | `true`   | `false`   | `false`           |
| `Object.is({}, {})` | `false`  | `false`   | `false`           |

## 231. _object.assign_ 和扩展运算法是深拷贝还是浅拷贝

- 在 JavaScript 中，Object.assign() 和扩展运算符（...）都是浅拷贝（Shallow Copy）。它们仅复制对象的 顶层属性，如果属性值是引用类型（如对象或数组），则拷贝的是 引用地址，而非创建新对象。

## 233. 如果 _new_ 一个箭头函数的会怎么样

TypeError: xxx is not a constructor

## 235. _Proxy_ 可以实现什么功能？

- 在 JavaScript 中，Proxy 是 ES6 引入的元编程特性，允许你创建一个对象的代理（Proxy），从而 拦截并自定义对象的基本操作（如属性访问、赋值、函数调用等）。它的核心功能是通过 拦截器（Traps） 实现对对象行为的动态控制。

## 236. 对象与数组的解构的理解

在 JavaScript 中，**对象与数组的解构（Destructuring）** 是一种通过 **模式匹配** 快速提取数据的高效语法.

- **数组解构**：按索引提取，支持跳过元素、默认值、剩余收集。
- **对象解构**：按属性名提取，支持重命名、嵌套解构、动态属性。
-

## 237. 如何提取高度嵌套的对象里的指定属性？

| **方法**           | **优点**                   | **缺点**               |
| ------------------ | -------------------------- | ---------------------- |
| **可选链 `?.`**    | 语法简洁，直接内嵌代码     | 不兼容旧环境           |
| **Lodash `_.get`** | 功能强大，支持复杂路径     | 需引入第三方库         |
| **解构 + 默认值**  | 无需额外函数，适合固定结构 | 嵌套层级较深时代码冗长 |

## 238. _Unicode、UTF-8、UTF-16、UTF-32_ 的区别？

在计算机中，字符编码是字符与二进制数据之间的映射规则。**Unicode** 定义了字符的全球唯一标识（码点），而 **UTF-8、UTF-16、UTF-32** 是 Unicode 的不同编码实现方式，核心区别在于 **存储效率、兼容性、应用场景**。
| **特性** | UTF-8 | UTF-16 | UTF-32 |
|-----------------|--------------------------|--------------------------|--------------------------|
| **最小单位** | 1 字节 | 2 字节 | 4 字节 |
| **存储效率** | 高（英文） | 中（BMP 字符） | 低（固定 4 字节） |
| **字节序问题** | 无 | 有（需 BOM） | 通常无 |
| **兼容 ASCII** | ✅ | ❌ | ❌ |
| **适用场景** | Web、网络传输、存储 | 内存操作（Java、Windows）| 特殊领域（如字体设计） |

## 239. 为什么函数的 _arguments_ 参数是类数组而不是数组？如何遍历类数组?

**类数组的特征**
典型的类数组对象具有以下特征：

- **数字索引属性**（如 `arguments[0]`、`arguments[1]`）
- **`length` 属性**（表示元素数量）
- **无数组方法**（如 `push`、`slice`）

**遍历类数组的 4 种方法**
**1. 传统 `for` 循环**
**2. `Array.from()` 转换为数组**
**3. 扩展运算符（`...`）**
**4. 借用数组方法（`call`/`apply`）**

**现代替代方案：`rest` 参数**
ES6 引入的 **rest 参数**（`...args`）可以直接获取参数数组，避免使用 `arguments`：

```javascript
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sum(1, 2, 3)); // 6
```

| **方法**            | **优点**                         | **缺点**                 |
| ------------------- | -------------------------------- | ------------------------ |
| `for` 循环          | 兼容性好，无需转换               | 代码较冗余               |
| `Array.from()`      | 代码简洁，支持数组方法           | 需要 ES6+ 环境           |
| 扩展运算符（`...`） | 语法最简洁，直接替代 `arguments` | 需使用 rest 参数声明函数 |
| 借用数组方法        | 不生成新数组，内存高效           | 语法稍复杂               |

## 240. _escape、encodeURI、encodeURIComponent_ 的区别

| **特性**              | `escape`            | `encodeURI`                | `encodeURIComponent`        |
| --------------------- | ------------------- | -------------------------- | --------------------------- |
| **用途**              | 已废弃              | 编码完整 URL               | 编码 URL 组成部分（如参数） |
| **保留特殊符号**      | `/` `@` `+` `.` 等  | `:/?#&=+`                  | **无**（全部编码）          |
| **空格编码**          | `%20`               | `%20`                      | `%20`                       |
| **非 ASCII 编码方式** | `%uXXXX`（Unicode） | `%XX`（UTF-8）             | `%XX`（UTF-8）              |
| **推荐程度**          | ❌ 废弃             | ✅ 需要保留 URL 结构时使用 | ✅ 处理 URL 参数时使用      |

- **弃用 `escape`**：存在编码缺陷，仅用于兼容旧代码。
- **`encodeURI`**：处理完整 URL，保留保留符号。
- **`encodeURIComponent`**：处理 URL 参数，编码所有特殊符号。
- **核心规则**：需要保留 URL 结构时用 `encodeURI`，需要嵌入动态内容时用 `encodeURIComponent`。

## 242. _for...in_ 和 _for...of_ 的区别

- for...in：用于遍历对象的键名（注意过滤原型链属性）。key

- for...of：用于遍历可迭代对象的值（推荐处理数组、Map、Set 等）。value

## 243. _ajax、axios、fetch_ 的区别

```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data");
xhr.send();

// 取消请求
document.querySelector("#cancelBtn").addEventListener("click", () => {
  xhr.abort(); // 终止请求
  console.log("请求已取消");
});

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("https://api.example.com/data", {
    cancelToken: source.token,
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log("请求已取消", error.message);
    }
  });

// 取消请求
source.cancel("用户主动取消");

const controller = new AbortController();

axios
  .get("https://api.example.com/data", {
    signal: controller.signal,
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log("请求已取消");
    }
  });

// 取消请求
controller.abort();

const controller = new AbortController();

fetch("https://api.example.com/data", {
  signal: controller.signal,
})
  .then((response) => response.json())
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("请求已取消");
    }
  });

// 取消请求
controller.abort();
```

## 244. 下面代码的输出是什么？（ _D_ ）

```javascript
function sayHi() {
  console.log(name);
  console.log(age);
  var name = "Lydia";
  let age = 21;
}

sayHi();
```

- A: _Lydia_ 和 _undefined_ ✔️
- B: _Lydia_ 和 _ReferenceError_
- C: _ReferenceError_ 和 _21_
- D: _undefined_ 和 _ReferenceError_

## 245. 下面代码的输出是什么？（ _C_ ）

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}
```

- A: _0 1 2_ 和 _0 1 2_
- B: _0 1 2_ 和 _3 3 3_
- C: _3 3 3_ 和 _0 1 2_ ✔️

## 246. 下面代码的输出是什么？（ _B_ ）

```javascript
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius,
};

shape.diameter();
shape.perimeter();
```

- A: _20_ 和 _62.83185307179586_
- B: _20_ 和 _NaN_ ✔️
- C: _20_ 和 _63_
- D: _NaN_ 和 _63_

## 247. 下面代码的输出是什么？（ _A_ ）

```
+true;
!"Lydia";
```

- A: _1_ 和 _false_ ✔️
- B: _false_ 和 _NaN_
- C: _false_ 和 _false_

## 248. 哪个选项是不正确的？（ _A_ ）

```javascript
const bird = {
  size: "small",
};

const mouse = {
  name: "Mickey",
  small: true,
};
```

- A: _mouse.bird.size_
- B: *mouse[bird.size]*✔️
- C: *mouse[bird["size"]]*✔️
- D: 以上选项都对

## 249. 下面代码的输出是什么？（ _A_ ）

```javascript
let c = { greeting: "Hey!" };
let d;

d = c;
c.greeting = "Hello";
console.log(d.greeting);
```

- A: _Hello_ ✔️
- B: _undefined_
- C: _ReferenceError_
- D: _TypeError_

## 250. 下面代码的输出是什么？（ _C_ ）

```js
let a = 3;
let b = new Number(3);
let c = 3;

console.log(a == b);
console.log(a === b);
console.log(b === c);
```

- A: _true_ _false_ _true_
- B: _false_ _false_ _true_
- C: _true_ _false_ _false_ ✔️
- D: _false_ _true_ _true_

## 251. 下面代码的输出是什么？（ _D_ ）

```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
  }

  constructor({ newColor = "green" } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: "purple" });
freddie.colorChange("orange");
```

- A: _orange_
- B: _purple_
- C: _green_
- D: _TypeError_ ✔️

## 252. 下面代码的输出是什么？（ _A_ ）

```js
let greeting;
greetign = {}; // Typo!
console.log(greetign);
```

- A: *{}*✔️
- B: _ReferenceError: greetign is not defined_
- C: _undefined_

## 253. 当我们执行以下代码时会发生什么？（ _A_ ）

```js
function bark() {
  console.log("Woof!");
}

bark.animal = "dog";
```

- A 什么都不会发生 ✔️
- B: _SyntaxError. You cannot add properties to a function this way._
- C: _undefined_
- D: _ReferenceError_

> **分析：**
>
> 因为函数也是对象！（原始类型之外的所有东西都是对象）
>
> 函数是一种特殊类型的对象，我们可以给函数添加属性，且此属性是可调用的。

## 254. 下面代码的输出是什么？（ _A_ ）

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const member = new Person("Lydia", "Hallie");
Person.getFullName = () => this.firstName + this.lastName;

console.log(member.getFullName());
```

- A: _TypeError_ ✔️
- B: _SyntaxError_
- C: _Lydia Hallie_
- D: _undefined_ _undefined_

## 255. 下面代码的输出是什么？（ _A_ ）

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const lydia = new Person("Lydia", "Hallie");
const sarah = Person("Sarah", "Smith");

console.log(lydia);
console.log(sarah);
```

- A: _Person { firstName: "Lydia", lastName: "Hallie" }_ 和 _undefined_
- B: _Person { firstName: "Lydia", lastName: "Hallie" }_ 和 _Person { firstName: "Sarah", lastName: "Smith" }_
- C: _Person { firstName: "Lydia", lastName: "Hallie" }_ 和 _{}_
- D: _Person { firstName: "Lydia", lastName: "Hallie" }_ 和 _ReferenceError_

## 256. 事件传播的三个阶段是什么？（ _D_ ）

- A: 目标 > 捕获 > 冒泡
- B: 冒泡 > 目标 > 捕获
- C: 目标 > 冒泡 > 捕获
- D: 捕获 > 目标 > 冒泡

## 257. 下面代码的输出是什么？（ _C_ ）

```js
function sum(a, b) {
  return a + b;
}

sum(1, "2");
```

- A: _NaN_
- B: _TypeError_
- C: _"12"_
- D: _3_

## 258. 下面代码的输出是什么？（ _C_ ）

```js
let number = 0;
console.log(number++);
console.log(++number);
console.log(number);
```

- A: _1 1 2_
- B: _1 2 2_
- C: _0 2 2_
- D: _0 1 2_

## 259. 下面代码的输出是什么？（ _B_ ）

```js
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = "Lydia";
const age = 21;

getPersonInfo`${person} is ${age} years old`;
```

- A: _Lydia_ _21_ _["", "is", "years old"]_
- B: _["", "is", "years old"]_ _Lydia_ _21_
- C: _Lydia_ _["", "is", "years old"]_ _21_

## 260. 下面代码的输出是什么？（ _C_ ）

```js
function checkAge(data) {
  if (data === { age: 18 }) {
    console.log("You are an adult!");
  } else if (data == { age: 18 }) {
    console.log("You are still an adult.");
  } else {
    console.log(`Hmm.. You don't have an age I guess`);
  }
}

checkAge({ age: 18 });
```

- A: _You are an adult!_
- B: _You are still an adult._
- C: _Hmm.. You don't have an age I guess_

## 261. 下面代码的输出是什么？（ _C_ ）

```js
function getAge(...args) {
  console.log(typeof args);
}

getAge(21);
```

- A: _"number"_
- B: _"array"_
- C: _"object"_
- D: _"NaN"_

## 262. 下面代码的输出是什么？（ _C_ ）

```js
function getAge() {
  "use strict";
  age = 21;
  console.log(age);
}

getAge();
```

- A: _21_
- B: _undefined_
- C: _ReferenceError_
- D: _TypeError_

## 263. 下面代码的输出是什么？（ _A_ ）

```js
const sum = eval("10*10+5");
```

- A: _105_
- B: _"105"_
- C: _TypeError_
- D: _"10\*10+5"_

## 264. _cool_secret_ 可以访问多长时间？（ _B_ ）

```js
sessionStorage.setItem("cool_secret", 123);
```

- A：永远，数据不会丢失。
- B：用户关闭选项卡时。
- C：当用户关闭整个浏览器时，不仅是选项卡。
- D：用户关闭计算机时。

## 265. 下面代码的输出是什么？（ _B_ ）

```js
var num = 8;
var num = 10;

console.log(num);
```

- A: _8_
- B: _10_
- C: _SyntaxError_
- D: _ReferenceError_

## 266. 下面代码的输出是什么？（ _C_ ）

```js
const obj = { 1: "a", 2: "b", 3: "c" };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty("1");
obj.hasOwnProperty(1);
set.has("1");
set.has(1);
```

- A: _false_ _true_ _false_ _true_
- B: _false_ _true_ _true_ _true_
- C: _true_ _true_ _false_ _true_
- D: _true_ _true_ _true_ _true_

## 267. 下面代码的输出是什么？（ _C_ ）

```js
const obj = { a: "one", b: "two", a: "three" };
console.log(obj);
```

- A: _{ a: "one", b: "two" }_
- B: _{ b: "two", a: "three" }_
- C: _{ a: "three", b: "two" }_
- D: _SyntaxError_

## 268. 下面代码的输出是什么？（ _C_ ）

```js
for (let i = 1; i < 5; i++) {
  if (i === 3) continue;
  console.log(i);
}
```

- A: _1 2_
- B: _1 2 3_
- C: _1 2 4_
- D: _1 3 4_

## 269. 下面代码的输出是什么？（ _A_ ）

```js
String.prototype.giveLydiaPizza = () => {
  return "Just give Lydia pizza already!";
};

const name = "Lydia";

name.giveLydiaPizza();
```

- A: _"Just give Lydia pizza already!"_
- B: _TypeError: not a function_
- C: _SyntaxError_
- D: _undefined_

## 270. 下面代码的输出是什么？（ _B_ ）

```js
const a = {};
const b = { key: "b" };
const c = { key: "c" };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
```

- A: _123_
- B: _456_
- C: _undefined_
- D: _ReferenceError_

## 271. 下面代码的输出是什么？（ _B_ ）

```js
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"));
const baz = () => console.log("Third");

bar();
foo();
baz();
```

- A: _First_ _Second_ _Third_
- B: _First_ _Third_ _Second_
- C: _Second_ _First_ _Third_
- D: _Second_ _Third_ _First_

## 272. 单击按钮时 _event.target_ 是什么？（ _C_ ）

```html
<div onclick="console.log('first div')">
  <div onclick="console.log('second div')">
    <button onclick="console.log('button')">Click!</button>
  </div>
</div>
```

- A: _div_ 外部
- B: _div_ 内部
- C: _button_
- D: 所有嵌套元素的数组

## 273. 单击下面的 _html_ 片段打印的内容是什么？（ _A_ ）

```html
<div onclick="console.log('div')">
  <p onclick="console.log('p')">Click here!</p>
</div>
```

- A: _p_ _div_
- B: _div_ _p_
- C: _p_
- D: _div_

## 274. 下面代码的输出是什么？（ _D_ ）

```js
const person = { name: "Lydia" };

function sayHi(age) {
  console.log(`${this.name} is ${age}`);
}

sayHi.call(person, 21);
sayHi.bind(person, 21);
```

- A: _undefined is 21_ _Lydia is 21_
- B: _function_ _function_
- C: _Lydia is 21_ _Lydia is 21_
- D: _Lydia is 21_ _function_

## 275. 下面代码的输出是什么？（ _B_ ）

```js
function sayHi() {
  return (() => 0)();
}

typeof sayHi();
```

- A: _"object"_
- B: _"number"_
- C: _"function"_
- D: _"undefined"_

## 276. 下面这些值哪些是假值？（ _A_ ）

```js
0;
new Number(0);
("");
(" ");
new Boolean(false);
undefined;
```

- A: _0_ _""_ _undefined_
- B: _0_ _new Number(0)_ _""_ _new Boolean(false)_ _undefined_
- C: _0_ _""_ _new Boolean(false)_ _undefined_
- D: 所有都是假值。

## 278. 下面代码的输出是什么？（ _B_ ）

```js
console.log(typeof typeof 1);
```

- A: _"number"_
- B: _"string"_
- C: _"object"_
- D: _"undefined"_

## 279. 下面代码的输出是什么？（ _C_ ）

```js
const numbers = [1, 2, 3];
numbers[10] = 11;
console.log(numbers);
```

- A: _[1, 2, 3, 7 x null, 11]_
- B: _[1, 2, 3, 11]_
- C: _[1, 2, 3, 7 x empty, 11]_
- D: _SyntaxError_

## 280. 下面代码的输出是什么？（ _A_ ）

```js
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
```

- A: _1_ _undefined_ _2_
- B: _undefined_ _undefined_ _undefined_
- C: _1_ _1_ _2_
- D: _1_ _undefined_ _undefined_

## 281. _JavaScript_ 中的所有内容都是…（ _A_ ）

- A：原始或对象
- B：函数或对象
- C：技巧问题！只有对象
- D：数字或对象

## 282. 下面代码的输出是什么?

```js
[
  [0, 1],
  [2, 3],
].reduce(
  (acc, cur) => {
    return acc.concat(cur);
  },
  [1, 2]
);
```

- A: _[0, 1, 2, 3, 1, 2]_
- B: _[6, 1, 2]_
- C: _[1, 2, 0, 1, 2, 3]_ ✔️
- D: _[1, 2, 6]_

## 283. 下面代码的输出是什么？（ _B_ ）

```js
!!null;
!!"";
!!1;
```

- A: _false_ _true_ _false_
- B: _false_ _false_ _true_
- C: _false_ _true_ _true_
- D: _true_ _true_ _false_

## 284. _setInterval_ 方法的返回值什么？（ _A_ ）

```js
setInterval(() => console.log("Hi"), 1000);
```

- A：一个唯一的 _id_
- B：指定的毫秒数
- C：传递的函数
- D：_undefined_

## 285. 下面代码的返回值是什么？（ _A_ ）

```js
[..."Lydia"];
```

- A: _["L", "y", "d", "i", "a"]_
- B: _["Lydia"]_
- C: _[[], "Lydia"]_
- D: _[["L", "y", "d", "i", "a"]]_

## 287. 假设有两个变量 _a_ 和 _b_，他们的值都是数字，如何在不借用第三个变量的情况下，将两个变量的值对调？

- [a,b]=[b,a]
- a = a + b; // 将 a 和 b 的和存入 a
  b = a - b; // 此时 b = 原 a 的值
  a = a - b; // 此时 a = 原 b 的值

## 288. 前端为什么提倡模块化开发？

主要原因是为了 解决代码复杂度失控、提升可维护性、增强复用性和优化协作效率

## 289. 请解释 _JSONP_ 的原理，并用代码描述其过程。

**JSONP（JSON with Padding）** 是一种绕过浏览器同源策略限制的跨域数据请求技术，其核心原理是 **利用 `<script>` 标签不受同源策略限制的特性**，通过动态创建脚本的方式实现跨域数据获取.

**一、JSONP 原理**

1. **基本思路**：

   - 客户端预先定义一个全局回调函数（如 `handleResponse`）。
   - 动态创建 `<script>` 标签，其 `src` 指向目标 API 地址，并通过 URL 参数传递回调函数名（如 `callback=handleResponse`）。
   - 服务端接收请求后，将数据包裹在回调函数调用中返回（如 `handleResponse({data: ...})`）。
   - 客户端脚本加载完成后，自动执行回调函数处理数据。

2. **关键限制**：
   - 仅支持 **GET 请求**。
   - 需要服务端配合返回特定格式的 JavaScript 代码。

**1. 客户端实现**

```javascript
// 定义全局回调函数
function handleResponse(data) {
  console.log("Received data:", data);
  // 清理已创建的 script 标签
  document.body.removeChild(script);
}

// 动态创建 script 标签
const script = document.createElement("script");
script.src = "https://api.example.com/data?callback=handleResponse";

// 设置超时处理
script.onerror = () => {
  console.error("请求失败");
  document.body.removeChild(script);
};

// 发起请求
document.body.appendChild(script);
```

**2. 服务端实现（Node.js 示例）**

```javascript
const express = require("express");
const app = express();

app.get("/data", (req, res) => {
  const data = { message: "Hello, JSONP!" };
  const callbackName = req.query.callback;

  // 返回 JavaScript 代码：callbackName(data)
  res.set("Content-Type", "application/javascript");
  res.send(`${callbackName}(${JSON.stringify(data)})`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**3. 完整交互流程**

1. 客户端请求 URL：`https://api.example.com/data?callback=handleResponse`
2. 服务端响应内容：`handleResponse({"message": "Hello, JSONP!"})`
3. 客户端自动执行 `handleResponse` 函数，获取数据。

| **优点**                   | **缺点**                                        |
| -------------------------- | ----------------------------------------------- |
| 兼容性好（支持老旧浏览器） | 仅支持 GET 请求，无法使用 POST、PUT 等方法      |
| 实现简单，无需复杂配置     | 安全性风险（需信任服务端，可能遭受 XSS 攻击）   |
| 绕过同源策略限制           | 错误处理困难（无法精确捕获 HTTP 错误状态码）    |
|                            | 数据格式受限（只能传输 JSON，需服务端配合包装） |

## **四、现代替代方案**

- **CORS（跨域资源共享）**：通过 HTTP 头实现安全可控的跨域请求（推荐）。
- **WebSocket**：全双工通信协议，支持跨域。
- **代理服务器**：前端请求同源代理，由代理转发至目标服务。

JSONP 是早期解决跨域问题的经典方案，但在现代前端开发中，应优先使用 **CORS** 或 **代理服务器** 等更安全、灵活的技术。理解 JSONP 的原理有助于深入掌握浏览器安全策略及网络请求机制。

## 291. 分析以下代码的执行结果并解释为什么。

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

console.log(a.x); // undefined
console.log(b.x); // { n: 2 }
```

## 292. 分析以下代码的执行结果并解释为什么。

```js
// example 1
var a = {},
  b = "123",
  c = 123;
a[b] = "b";
a[c] = "c";
console.log(a[b]);

// example 2
var a = {},
  b = Symbol("123"),
  c = Symbol("123");
a[b] = "b";
a[c] = "c";
console.log(a[b]);

// example 3
var a = {},
  b = { key: "123" },
  c = { key: "456" };
a[b] = "b";
a[c] = "c";
console.log(a[b]);

//c  b  c
```

## 293. 下面的代码打印什么内容？为什么？

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();

//
function b() {
  b = 20;
  console.log(b);
}
```

## 294. 下面代码中，_a_ 在什么情况下会执行输出语句打印 _1_ ？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}

var a = {
  i: 1,
  valueOf: function() {
    return this.i++; // 每次比较时自增
  }
};
var a = {
  i: 1,
  toString: function() {
    return this.i++; // 每次比较时自增
  }
};
```

## 296. 请指出 _document.onload_ 和 document.ready 两个事件的区别

| **事件**               | 触发时机                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| **`DOMContentLoaded`** | **DOM 树构建完成时触发**（不等待图片、样式表等外部资源加载完成）。        |
| **`window.onload`**    | **所有资源加载完毕后触发**（包括图片、样式表、脚本、iframe 等外部资源）。 |

| **场景**                | 推荐事件           | 原因                                                 |
| ----------------------- | ------------------ | ---------------------------------------------------- |
| **操作 DOM 元素**       | `DOMContentLoaded` | DOM 树已就绪，无需等待图片等资源，提升交互响应速度。 |
| **获取图片/元素的尺寸** | `window.onload`    | 需确保图片等资源已加载完成，否则尺寸计算可能不准确。 |
| **初始化第三方插件**    | `DOMContentLoaded` | 尽早初始化插件，避免用户感知延迟。                   |
| **依赖外部资源的脚本**  | `window.onload`    | 确保脚本执行时外部资源（如依赖的 JS 库）已加载完成。 |

- **`DOMContentLoaded` / `document.ready`**：优先使用，用于快速操作 DOM。
- **`window.onload`**：仅在需要依赖完整资源时使用。

## 297. 表单元素的*readonly* 和 _disabled_ 两个属性有什么区别？

| **属性**       | 作用                                                                                 | 用户交互                                                                   |
| -------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **`readonly`** | 仅禁止用户修改输入内容，但允许**聚焦、选中、复制内容**，且字段可触发事件（如点击）。 | 输入框外观正常，光标可定位，内容可选中和复制，但无法编辑。                 |
| **`disabled`** | 完全禁用表单元素，禁止**所有交互**（聚焦、选中、复制、触发事件等）。                 | 输入框变灰（浏览器默认样式），无法聚焦或选中，内容不可操作，事件监听失效。 |

## 299. 区分什么是“客户区坐标”、“页面坐标”、“屏幕坐标”？

```
客户区坐标（Client Coordinates）：
指相对于浏览器可视区域（Viewport）左上角的坐标，不包含滚动条偏移。通过 clientX/clientY 获取。
特点：滚动页面时，值不变（始终基于当前可视区域）。

页面坐标（Page Coordinates）：
指相对于整个文档（含滚动偏移）左上角的坐标，包含滚动条偏移。通过 pageX/pageY 获取。
特点：滚动页面时，值会变化（始终基于文档顶部）。

屏幕坐标（Screen Coordinates）：
指相对于用户物理屏幕左上角的坐标，包含浏览器外框。通过 screenX/screenY 获取。
特点：与浏览器窗口位置相关，移动窗口时值会变化。
```

## 300. 如何编写高性能的 _JavaScript_？

编写高性能的 JavaScript 代码需要从 **语言特性**、**运行机制** 和 **浏览器环境** 三个维度进行优化。以下是关键策略和具体实践：

---

**一、语言层优化**

1.  **减少作用域链查找**

- **避免全局变量**：全局变量查找最慢（位于作用域链末端）

  ```js
  // 反例：频繁访问全局变量
  for (let i = 0; i < 1000; i++) {
    console.log(window.someGlobalValue); // 每次循环都要查全局作用域
  }

  // 正例：缓存局部变量
  const localValue = window.someGlobalValue;
  for (let i = 0; i < 1000; i++) {
    console.log(localValue);
  }
  ```

2. **选择高效的数据结构**

- **优先使用 `Map/Set`**：比 `Object` 在频繁增删键值对时更快
  ```js
  const map = new Map(); // 查找、删除时间复杂度 O(1)
  map.set("key", "value");
  map.has("key"); // 比 Object.prototype.hasOwnProperty 更快
  ```

3. **避免不必要的计算**

- **延迟计算**：仅在需要时执行

  ```js
  // 反例：立即计算可能未使用的值
  function process(data) {
    const heavyResult = heavyComputation(); // 即使不执行后续逻辑也会计算
    if (data.condition) {
      use(heavyResult);
    }
  }

  // 正例：惰性计算
  function process(data) {
    if (data.condition) {
      const heavyResult = heavyComputation(); // 条件成立才计算
      use(heavyResult);
    }
  }
  ```

---

**二、内存管理**

1. **避免内存泄漏**

- **及时解绑事件监听器**：

  ```js
  // 反例：未移除监听导致元素无法回收
  element.addEventListener("click", onClick);

  // 正例：移除监听
  element.addEventListener("click", onClick);
  element.removeEventListener("click", onClick);
  ```

- **清除定时器**：
  ```js
  const timer = setInterval(() => {}, 1000);
  clearInterval(timer); // 不再需要时清除
  ```

2. **优化对象生命周期**

- **解除不再使用的引用**：
  ```js
  let bigData = new Array(1e6).fill({ data: "..." });
  // 不再需要时置空
  bigData = null; // 允许垃圾回收
  ```

**三、DOM 操作优化**

1. **减少重排（Reflow）和重绘（Repaint）**

- **批量修改样式**：

  ```js
  // 反例：多次触发重排
  element.style.width = "100px";
  element.style.height = "200px";
  element.style.margin = "10px";

  // 正例：一次性修改（使用 class 或 cssText）
  element.style.cssText = "width:100px; height:200px; margin:10px;";
  ```

- **使用文档片段（DocumentFragment）**：
  ```js
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    fragment.appendChild(div);
  }
  document.body.appendChild(fragment); // 仅一次重排
  ```

2.  **事件委托**

- **利用事件冒泡**：

  ```js
  // 反例：为每个子元素绑定事件
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", handleClick);
  });

  // 正例：父元素代理
  document.getElementById("parent").addEventListener("click", (e) => {
    if (e.target.classList.contains("item")) {
      handleClick(e);
    }
  });
  ```

  **四、异步优化**

1.  **合理使用事件循环**

- **分解长任务**：用 `setTimeout` 或 `requestIdleCallback` 分片
  ```js
  function processChunk(start) {
    let i = start;
    while (i < 1e6 && performance.now() - startTime < 50) {
      // 每帧不超过 50ms
      process(data[i++]);
    }
    if (i < 1e6) {
      setTimeout(() => processChunk(i)); // 让出主线程
    }
  }
  processChunk(0);
  ```

2.  **Web Workers 处理 CPU 密集型任务**

- **多线程计算**：

  ```js
  // main.js
  const worker = new Worker("task.js");
  worker.postMessage(data);
  worker.onmessage = (e) => {
    /* 处理结果 */
  };

  // task.js
  self.onmessage = (e) => {
    const result = heavyComputation(e.data);
    self.postMessage(result);
  };
  ```

  **五、算法与逻辑优化**

1.  **时间复杂度优化**

- **避免嵌套循环**：使用哈希表（空间换时间）

  ```js
  // 反例：O(n²) 查找两数之和
  function findSumPair(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] + arr[j] === target) return [i, j];
      }
    }
  }

  // 正例：O(n) 哈希优化
  function findSumPair(arr, target) {
    const map = new Map();
    for (let i = 0; i < arr.length; i++) {
      const complement = target - arr[i];
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      map.set(arr[i], i);
    }
  }
  ```

2. **节流（Throttle）与防抖（Debounce）**

- **控制高频事件**：

  ```js
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

  **六、工具与工程化**

1.  **代码拆分（Code Splitting）**

- **按需加载**：
  ```js
  // 动态导入模块
  button.addEventListener("click", async () => {
    const module = await import("./heavyModule.js");
    module.run();
  });
  ```

2.  **性能分析工具**

- **Chrome DevTools**：
  - **Performance 面板**：分析运行时性能瓶颈
  - **Memory 面板**：检测内存泄漏
  - **Coverage 工具**：查看未使用的代码
    **七、其他关键技巧**
- **使用 `requestAnimationFrame` 替代 `setTimeout` 动画**：

  ```js
  function animate() {
    // 更新动画状态
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  ```

- **避免使用 `eval` 和 `with`**：破坏作用域链，影响优化
  **总结：性能优化的核心原则**

1. **减少计算量**：算法优化、惰性执行
2. **减少内存占用**：及时释放、复用对象
3. **减少主线程阻塞**：异步化、任务分片
4. **减少渲染压力**：批量 DOM 操作、GPU 加速（如 `transform`）

## 301. 下面的代码输出什么？

```js
var a = function () {
  return 5;
};
a.toString = function () {
  return 3;
};
console.log(a + 7);
// 10
```