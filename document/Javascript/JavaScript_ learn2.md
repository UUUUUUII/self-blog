
## 101. == 隐试转换的原理？是怎么转换的
JavaScript 的 `==`（宽松相等）会在比较不同类型的值时触发隐式类型转换，其转换规则基于 **ECMAScript 规范** 中的抽象操作 `ToPrimitive` 和 `ToNumber`。
操作数类型相同 → 直接按值比较（除 NaN != NaN 外）。

**操作数类型不同 → 按以下优先级触发转换：**

- 数值比较优先：尝试将非数值类型转为数值。
- 对象转原始值：通过 ToPrimitive 转换对象。
- 布尔转数值：布尔值优先转为 0 或 1。
- 特殊值处理：null 和 undefined 仅在相互比较时返回 true。

| **场景**         | **建议**                                              |
| ---------------- | ----------------------------------------------------- |
| **避免隐式转换** | 优先使用 `===`（严格相等）进行比较                    |
| **显式类型转换** | 使用 `Number()`、`String()`、`Boolean()` 明确转换意图 |
| **处理对象比较** | 重写 `valueOf` 或 `toString` 控制转换行为             |
| **特殊值处理**   | 使用 `Object.is()` 精确判断 `NaN` 或 `±0`             |

## 102. ['1', '2', '3'].map(parseInt) 结果是什么，为什么 （字节）

```javascript
['1', '2', '3'].map(parseInt) 的结果是 [1, NaN, NaN]
```

**1. `Array.map` 的回调参数传递规则**
`map` 方法在调用回调函数时，会传递 **三个参数**：

- **当前元素**
- **元素索引**
- **原数组**

语法等价于：

```javascript
["1", "2", "3"].map((value, index, array) => parseInt(value, index, array));
```

**2. `parseInt` 的参数行为**
`parseInt` 函数接收 **两个参数**：

- **`string`**: 要解析的字符串
- **`radix`**: 进制基数（2 ≤ radix ≤ 36）

| **调用**           | **等效参数**      | **解析逻辑**             | **结果** |
| ------------------ | ----------------- | ------------------------ | -------- |
| `parseInt('1', 0)` | `radix=0`         | 按 10 进制解析           | `1`      |
| `parseInt('2', 1)` | `radix=1`（非法） | 无法解析任何数字         | `NaN`    |
| `parseInt('3', 2)` | `radix=2`         | `'3'` 不是有效二进制字符 | `NaN`    |

## 104. 介绍下 _Set、Map、WeakSet_ 和 _WeakMap_ 的区别（字节）

## **核心区别总结**

| **特性**         | **Set**                     | **Map**                       | **WeakSet**                 | **WeakMap**                    |
| ---------------- | --------------------------- | ----------------------------- | --------------------------- | ------------------------------ |
| **键/值类型**    | 唯一值（任意类型）          | 键值对（键可为任意类型）      | 唯一值（仅对象）            | 键值对（键仅对象，值任意类型） |
| **可遍历性**     | 是（`for...of`、`forEach`） | 是（`for...of`、`forEach`）   | 否                          | 否                             |
| **引用强度**     | 强引用（阻止垃圾回收）      | 强引用（阻止垃圾回收）        | 弱引用（不阻止垃圾回收）    | 弱引用（键不阻止垃圾回收）     |
| **内存泄漏风险** | 高（需手动删除无用元素）    | 高（需手动删除无用键）        | 低（自动清理无引用元素）    | 低（键被回收时值自动释放）     |
| **主要方法**     | `add`、`delete`、`has`      | `set`、`get`、`has`、`delete` | `add`、`delete`、`has`      | `set`、`get`、`has`、`delete`  |
| **典型应用场景** | 去重、集合运算              | 键值存储、复杂数据关联        | 临时对象集合（如 DOM 元素） | 私有数据、缓存、对象元数据关联 |

- **强引用结构（Set/Map）**：需手动管理内存，适合长期存储数据。
- **弱引用结构（WeakSet/WeakMap）**：自动清理无引用对象，避免内存泄漏，适合临时关联数据。

## 106. _Promise_ 构造函数是同步执行还是异步执行，那么 _then_ 方法呢？（字节）

| **操作**             | **执行顺序**   | **触发时机**             |
| -------------------- | -------------- | ------------------------ |
| **Promise 构造函数** | 同步执行       | 立即执行，阻塞主线程     |
| **`then` 回调**      | 异步（微任务） | 当前执行栈清空后立即执行 |
| **`setTimeout`**     | 异步（宏任务） | 微任务队列处理完毕后执行 |

## 107. 情人节福利题，如何实现一个 _new_ （字节）

```js
let Parent = function (name, age) {
  this.name = name;
  this.age = age;
};
Parent.prototype.sayName = function () {
  console.log(this.name);
};
//自己定义的 new 方法
let newMethod = function (Parent, ...rest) {
  // 1.以构造器的 prototype 属性为原型，创建新对象；
  let child = Object.create(Parent.prototype);
  // 2.将 this 和调用参数传给构造器执行
  let result = Parent.apply(child, rest);
  // 3.如果构造器没有手动返回对象，则返回第一步的对象
  return typeof result === "object" ? result : child;
};
//创建实例，将构造函数 Parent 与形参作为参数传入
const child = newMethod(Parent, "echo", 26);
child.sayName(); //'echo';
//最后检验，与使用 new 的效果相同
console.log(child instanceof Parent); //true
console.log(child.hasOwnProperty("name")); //true
console.log(child.hasOwnProperty("age")); //true
console.log(child.hasOwnProperty("sayName")); //false
```

## 108. 实现一个 _sleep_ 函数（字节）

```javascript
function cancellableSleep(ms) {
  let timeoutId;
  const promise = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, ms);
  });
  promise.cancel = () => clearTimeout(timeoutId);
  return promise;
}
// 使用示例
const sleepPromise = cancellableSleep(3000);
sleepPromise.cancel(); // 取消等待
```

## 109. 使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果 （字节）

在 JavaScript 中直接使用 `sort()` 对数组 `[3, 15, 8, 29, 102, 22]` 进行排序时，输出结果为：

```
[102, 15, 22, 29, 3, 8]
```

**原因解析**
`sort()` 方法默认会将数组元素转换为**字符串**，并按 **Unicode 字符顺序**排序，而非按数值大小排序。具体逻辑如下：

| 原始数组值      | 转换为字符串                                                                            | Unicode 字符顺序比较规则 | 排序结果位置 |
| --------------- | --------------------------------------------------------------------------------------- | ------------------------ | ------------ |
| `3` → `"3"`     | `"3"` 的 Unicode 码为 `51`，比 `"15"` 的首字符 `"1"`（码为 `49`）大，因此排在后面       | 倒数第二位               |
| `15` → `"15"`   | `"15"` 的首字符 `"1"` 较小，但 `"102"` 的首字符也是 `"1"`，继续比较第二位 `"0"` < `"5"` | 第二位                   |
| `102` → `"102"` | 首字符 `"1"`，第二位 `"0"`，在 `"1"` 开头的字符串中最小                                 | 第一位                   |

## **正确排序数值的方法**

若需按数值从小到大排序，需传入比较函数：

```javascript
const arr = [3, 15, 8, 29, 102, 22];
arr.sort((a, b) => a - b); // 升序排序
console.log(arr); // [3, 8, 15, 22, 29, 102]
```

| **排序方式**      | **结果**                  | **规则**                  |
| ----------------- | ------------------------- | ------------------------- |
| **默认 `sort()`** | `[102, 15, 22, 29, 3, 8]` | 按字符串 Unicode 顺序排序 |
| **数值排序**      | `[3, 8, 15, 22, 29, 102]` | 按数值大小升序排序        |

**关键点**：始终记住 `sort()` 的默认行为基于字符串比较，处理数值时需显式提供比较函数。

## 110. 实现 5.add(3).sub(2) (百度)

```js
// 工厂函数创建链式对象
function num(n) {
  return {
    value: n,
    add(m) {
      this.value += m;
      return this; // 返回对象本身以支持链式调用
    },
    sub(m) {
      this.value -= m;
      return this;
    },
    result() {
      return this.value; // 显式获取结果
    },
  };
}

// 使用示例
console.log(num(5).add(3).sub(2).result()); // 输出: 6
```

## 111. 给定两个数组，求交集

```javascript
function intersection(nums1, nums2) {
  // 将第一个数组转换为集合，用于快速查找
  const set1 = new Set(nums1);
  // 筛选第二个数组中存在于集合的元素，并去重
  const result = new Set(nums2.filter((num) => set1.has(num)));
  // 将集合转回数组
  return Array.from(result);
}

// 示例用法
const arr1 = [1, 2, 2, 3];
const arr2 = [2, 3, 3, 4];
console.log(intersection(arr1, arr2)); // 输出: [2, 3]
```

## 112. 为什么普通 _for_ 循环的性能远远高于 _forEach_ 的性能，请解释其中的原因。

| **场景**           | **推荐方法**          | **原因**                             |
| ------------------ | --------------------- | ------------------------------------ |
| **性能敏感代码**   | 普通 `for` 循环       | 避免函数调用开销，最大化引擎优化潜力 |
| **代码简洁性优先** | `forEach`             | 语法简洁，可读性高                   |
| **大数据量遍历**   | `for` 循环或 `for-of` | 减少内存和计算开销                   |

- **`for` 循环** 直接控制索引，无额外抽象层，适合高性能需求场景。
- **`forEach`** 通过回调函数提供更声明式的写法，牺牲性能换取代码可读性。
- 现代引擎已大幅优化 `forEach`，但大规模数据遍历时仍优先选择 `for`。

## 113. 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置。

```javascript
function bruteForceSearch(S, T) {
  const n = S.length;
  const m = T.length;
  if (m === 0) return 0; // 处理 T 为空的情况
  if (n < m) return -1;

  for (let i = 0; i <= n - m; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      if (S[i + j] !== T[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}
```

## 114. 使用 _JavaScript Proxy_ 实现简单的数据绑定

```javascript
<input type="text" id="input">
<p id="output"></p>

<script>
// 创建响应式数据对象
const data = {
  text: ""
};

// 获取 DOM 元素
const input = document.getElementById("input");
const output = document.getElementById("output");

// 创建 Proxy 代理
const reactiveData = new Proxy(data, {
  set(target, key, value) {
    // 更新数据
    target[key] = value;

    // 同步更新 DOM（视图）
    if (key === "text") {
      input.value = value;      // 更新输入框
      output.textContent = value; // 更新显示文本
    }
    return true;
  }
});

// 监听输入事件
input.addEventListener("input", (e) => {
  reactiveData.text = e.target.value; // 数据驱动视图
});

// 测试程序修改数据
setTimeout(() => {
  reactiveData.text = "3秒后自动更新"; // 视图自动同步
}, 3000);
</script>
```

## 115. 数组里面有 _10_ 万个数据，取第一个元素和第 _10_ 万个元素的时间相差多少（字节）

- 理论时间复杂度：访问任意元素的平均时间复杂度为 O(1)（常数时间）。
- 实际耗时差异：在正常数组（非稀疏数组）中，访问第 1 个 和第 100,000 个 元素的耗时 几乎相同（纳秒级差异，可忽略不计）。

## 116. 打印出 _1~10000_ 以内的对称数

```javascript
function isPalindrome(num) {
  const str = num.toString();
  return str === str.split("").reverse().join("");
}

const result = [];
for (let i = 1; i <= 10000; i++) {
  if (isPalindrome(i)) result.push(i);
}
console.log(result);
```

## 117. 简述同步和异步的区别

| **维度**       | **同步（Synchronous）**                                    | **异步（Asynchronous）**                                              |
| -------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| **执行方式**   | 任务按代码顺序**依次执行**，前一个任务未完成会阻塞后续代码 | 任务发起后**立即继续执行后续代码**，结果通过回调、事件或 Promise 处理 |
| **线程行为**   | 通常占用主线程直到任务完成（如浏览器中阻塞 UI 渲染）       | 不阻塞主线程，任务在后台执行（如 Web Worker、I/O 操作）               |
| **性能影响**   | 可能导致程序卡顿（如耗时计算阻塞界面响应）                 | 提升吞吐量和响应速度（如网络请求不阻塞用户操作）                      |
| **代码复杂度** | 逻辑简单直观，易于调试                                     | 需处理回调嵌套（回调地狱）或使用 Promise/async 控制流                 |
| **典型场景**   | 简单计算、即时操作（如数学运算、变量赋值）                 | 网络请求、文件读写、定时任务、事件监听                                |

## 118. 怎么添加、移除、复制、创建、和查找节点

一、创建节点
| 操作 | 方法 | 示例 |
|--------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 创建元素节点 | `document.createElement(tagName)` | `const div = document.createElement('div')` |
| 创建文本节点 | `document.createTextNode(text)` | `const text = document.createTextNode('Hello')` |
| 创建文档片段 | `document.createDocumentFragment()` | `const fragment = document.createDocumentFragment()` |

二、添加节点
| 操作 | 方法 | 示例 |
|--------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 追加子节点 | `parent.appendChild(node)` | `document.body.appendChild(div)` |
| 插入到指定位置 | `parent.insertBefore(newNode, referenceNode)` | `list.insertBefore(newItem, list.firstChild)` |
| 批量插入 | `parent.append(...nodes)` (现代方法) | `div.append(span, textNode)` |

三、删除节点
| 操作 | 方法 | 示例 |
|--------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 移除子节点 | `parent.removeChild(node)` | `list.removeChild(list.lastElementChild)` |
| 自移除节点 | `node.remove()` (现代方法) | `document.getElementById('temp').remove()` |

四、复制节点
| 操作 | 方法 | 示例 |
|--------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 浅拷贝 | `node.cloneNode(false)` (只复制节点本身) | `const cloned = div.cloneNode(false)` |
| 深拷贝 | `node.cloneNode(true)` (复制节点及所有子节点) | `const cloned = div.cloneNode(true)` |

五、查找节点
| 操作 | 方法 | 示例 |
|--------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 通过 ID 查找 | `document.getElementById(id)` | `const header = document.getElementById('header')` |
| 通过类名查找 | `element.getElementsByClassName(class)` | `const items = list.getElementsByClassName('item')` |
| 通过标签名查找 | `element.getElementsByTagName(tag)` | `const imgs = document.getElementsByTagName('img')` |
| CSS 选择器查找单个 | `document.querySelector(selector)` | `const btn = document.querySelector('#submit-btn')` |
| CSS 选择器查找多个 | `document.querySelectorAll(selector)` | `const redItems = document.querySelectorAll('.item.red')` |

## 119. 实现一个函数 _clone_ 可以对 _Javascript_ 中的五种主要数据类型（_Number、string、 Object、Array、Boolean_）进行复制

```javascript
function clone(source, hash = new WeakMap()) {
  // 处理基本类型（Number、String、Boolean）和 null/undefined
  if (typeof source !== "object" || source === null) {
    return source;
  }

  // 处理循环引用
  if (hash.has(source)) {
    return hash.get(source);
  }

  // 处理数组
  if (Array.isArray(source)) {
    const target = [];
    hash.set(source, target);
    source.forEach((item, index) => {
      target[index] = clone(item, hash);
    });
    return target;
  }

  // 处理普通对象
  const target = {};
  hash.set(source, target);
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = clone(source[key], hash);
    }
  }
  return target;
}

// 测试用例
const num = 42;
const str = "hello";
const bool = true;
const arr = [1, { a: 2 }];
const obj = { b: [3, 4], self: null };

// 设置循环引用
obj.self = obj;

// 执行克隆
const clonedNum = clone(num); // 42
const clonedStr = clone(str); // "hello"
const clonedBool = clone(bool); // true
const clonedArr = clone(arr); // [1, { a: 2 }]
const clonedObj = clone(obj); // { b: [3,4], self: [Circular] }

// 验证深拷贝
clonedArr[0] = 100;
clonedArr[1].a = 200;
console.log(arr[0]); // 1（原数组未改变）
console.log(arr[1].a); // 2（原对象未改变）

clonedObj.b[0] = 300;
console.log(obj.b[0]); // 3（原数组未改变）
console.log(clonedObj.self === clonedObj); // true（循环引用保留）
```

## 120. 如何消除一个数组里面重复的元素

```javascript
const uniqueArray = (arr) => [...new Set(arr)];

// 示例
console.log(uniqueArray([1, 2, 2, 3, NaN, NaN]));
// 输出: [1, 2, 3, NaN] (自动去重且保留一个 NaN)

const uniqueArray = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) === index);

// 示例
console.log(uniqueArray([1, 2, 2, 3]));
// 输出: [1, 2, 3]

const uniqueArray = (arr) =>
  arr.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []);

// 示例
console.log(uniqueArray([1, 2, 2, 3])); // [1, 2, 3]
```

## 122. 使用递归完成 1 到 100 的累加

```javascript
function sum(n) {
  // 基线条件：当 n 递减至 1 时终止递归
  if (n === 1) return 1;

  // 递推公式：sum(n) = n + sum(n-1)
  return n + sum(n - 1);
}

// 计算 1 到 100 的和
console.log(sum(100)); // 输出 5050
```

## 125. console.log(1+'2')和 console.log(1-'2')的打印结果

12
-1

## 126. _JS_ 的事件委托是什么，原理是什么

JavaScript 的事件委托（Event Delegation）是一种利用 事件冒泡 机制，将子元素的事件处理程序统一绑定到父元素上的技术。其核心原理是通过父元素监听子元素的事件，并根据事件目标（event.target）执行对应逻辑，从而减少事件监听器的数量并优化性能

## 127. 如何改变函数内部的 _this_ 指针的指向

| **特性**     | **`call()`**            | **`apply()`**             | **`bind()`**                   |
| ------------ | ----------------------- | ------------------------- | ------------------------------ |
| **执行方式** | 立即执行                | 立即执行                  | 返回新函数，延迟执行           |
| **参数传递** | 逐个传递 (`arg1, arg2`) | 数组传递 (`[arg1, arg2]`) | 可部分或全部参数，返回函数     |
| **适用场景** | 明确参数列表            | 动态参数或数组参数        | 预置上下文或参数（如事件监听） |
| **性能影响** | 无额外开销              | 无额外开销                | 创建新函数，可能增加内存占用   |

- **立即调用**：使用 `call` 或 `apply`，根据参数形式选择。
- **延迟执行**：使用 `bind` 创建绑定后的函数。
- **箭头函数**：无法改变 `this`，依赖定义时的上下文。
- **构造函数**：`new` 操作符优先级高于 `bind`。
- **严格模式**：未指定 `this` 时默认为 `undefined`。

## 128. _JS_ 延迟加载的方式有哪些？

| **方法**                  | **控制粒度** | **依赖管理** | **适用场景**      |
| ------------------------- | ------------ | ------------ | ----------------- |
| **`async/defer`**         | 文件级       | 弱           | 基础脚本优化      |
| **动态脚本注入**          | 文件级       | 手动         | 需条件触发的脚本  |
| **Intersection Observer** | 元素级       | 手动         | 可视区域触发加载  |
| **动态导入**              | 模块级       | 自动         | 现代模块化项目    |
| **Webpack 代码分割**      | 模块级       | 自动         | 大型 SPA 应用优化 |

## 129. 说说严格模式的限制

1. **变量必须声明**

   - 禁止未声明变量，避免意外全局变量污染。

2. **禁止删除不可删除属性**

   - `delete` 仅用于对象可配置属性，防止静默失败。

3. **函数参数不可重复**

   - 避免参数重名导致的逻辑混乱。

4. **禁用 `with` 语句**

   - 防止作用域链混乱和性能问题。

5. **`this` 默认不指向全局对象**

   - 普通函数调用时 `this` 为 `undefined`，防止误操作。

6. **禁止八进制字面量**

   - 强制使用 `0o` 前缀明确八进制，避免歧义。

7. **`eval` 独立作用域**

   - 隔离 `eval` 内部变量，防止污染外部作用域。

8. **`arguments` 与形参解耦**

   - 修改 `arguments` 不影响命名参数，减少副作用。

9. **保留关键字限制**

   - 禁止使用未来可能为关键字的标识符（如 `interface`）。

10. **禁止修改只读属性**
    - 显式抛出错误，避免静默失败。

## 130. _attribute_ 和 _property_ 的区别是什么？

| **维度**     | **Attribute**                         | **Property**                                |
| ------------ | ------------------------------------- | ------------------------------------------- |
| **定义**     | HTML 标签上的静态属性（字符串形式）   | DOM 对象上的动态属性（JavaScript 对象属性） |
| **访问方式** | `element.getAttribute(name)`          | `element.propertyName`                      |
| **数据类型** | 始终为字符串                          | 可以是任意类型（布尔、数字、对象等）        |
| **同步性**   | 修改后不会自动更新对应的 Property     | 修改后可能更新对应的 Attribute（部分属性）  |
| **典型示例** | `<input id="myInput" value="初始值">` | `input.value = "新值"`（实时反映用户输入）  |

- **Attribute**：HTML 标签的静态元数据，用于初始化设置。
- **Property**：DOM 对象的动态属性，反映实时状态。
- **关键原则**：操作用户交互数据用 Property，管理初始配置用 Attribute。

## 131. _ES6_ 能写 _class_ 么，为什么会出现 _class_ 这种东西?

ES6 的 class 通过语法糖形式，解决了传统原型链写法的冗余问题，提供了更现代、清晰的面向对象编程体验。它降低了 JavaScript 的学习门槛，增强了代码组织能力，尤其适用于复杂应用和团队协作场景。但开发者仍需理解其原型本质，避免过度依赖传统类继承思维。

## 134. _null_ 是对象吗？

null 不是对象，尽管 typeof null 会返回 "object"，但这源于 JavaScript 的一个历史遗留问题

## 135. 为什么 _console.log(0.2+0.1==0.3) // false_

---

## **原因解析**

JavaScript 中的浮点数运算遵循 **IEEE 754 标准**，使用双精度（64 位）表示数值。但某些十进制小数无法精确转换为二进制，导致精度丢失，最终结果为近似值。以下是详细分析：
**十进制转二进制**

- 0.1 的二进制表示：  
  `0.1` 在二进制中是无限循环小数：  
  `0.0001100110011001100110011001100110011001100110011001101...`
- 0.2 的二进制表示：  
  `0.2` 在二进制中也是无限循环小数：  
  `0.001100110011001100110011001100110011001100110011001101...`

## 136. 说一下 _JS_ 中类型转换的规则？

## 137. 深拷贝和浅拷贝的区别？如何实现

### 深拷贝与浅拷贝的区别

**浅拷贝**

- **定义**：仅复制对象的第一层属性。
  - **基本类型**：直接复制值。
  - **引用类型**（如对象、数组）：复制内存地址（原对象与拷贝对象共享嵌套引用）。
- **特点**：
  - 修改原对象或拷贝对象中的 **引用类型属性**，会相互影响。
  - 适用于简单对象或无需隔离嵌套数据的场景。

**深拷贝**

- **定义**：递归复制对象的所有层级，包括嵌套的引用类型。
  - **所有层级**：完全独立的内存空间，修改互不影响。
- **特点**：
  - 完全隔离原对象与拷贝对象。
  - 适用于需要完全独立副本的场景（如状态管理、数据快照）。

### 浅拷贝的实现方法

- **`Object.assign()`**

- **扩展运算符 `...`**

- **数组浅拷贝**

## 深拷贝的实现方法

**`JSON.parse(JSON.stringify())`**  
**功能完整版**（支持循环引用、处理特殊对象）：

```javascript
function deepClone(source, hash = new WeakMap()) {
  // 处理非对象或 null
  if (source === null || typeof source !== "object") return source;

  // 处理循环引用
  if (hash.has(source)) return hash.get(source);

  // 处理 Date
  if (source instanceof Date) return new Date(source);

  // 处理 RegExp
  if (source instanceof RegExp) return new RegExp(source);

  // 处理 Set
  if (source instanceof Set) {
    const cloneSet = new Set();
    hash.set(source, cloneSet);
    source.forEach((value) => cloneSet.add(deepClone(value, hash)));
    return cloneSet;
  }

  // 处理 Map
  if (source instanceof Map) {
    const cloneMap = new Map();
    hash.set(source, cloneMap);
    source.forEach((value, key) => cloneMap.set(key, deepClone(value, hash)));
    return cloneMap;
  }

  // 处理对象或数组
  const target = Array.isArray(source) ? [] : {};
  hash.set(source, target);

  // 递归复制属性（包括 Symbol 键）
  const keys = Reflect.ownKeys(source);
  for (const key of keys) {
    target[key] = deepClone(source[key], hash);
  }

  return target;
}
```

## 139. _call、apply_ 以及 _bind_ 函数内部实现是怎么样的

```javascript
Function.prototype.myCall = function (context, ...args) {
  // 处理 context 为 null 或 undefined（默认指向全局对象）
  context = context || (typeof window !== "undefined" ? window : global);

  // 创建唯一键避免属性冲突
  const fnKey = Symbol("fn");
  context[fnKey] = this; // this 指向原函数

  // 调用函数并保存结果
  const result = context[fnKey](...args);

  // 清理临时属性
  delete context[fnKey];

  return result;
};

// 测试用例
function greet(msg) {
  console.log(`${msg}, ${this.name}`);
}

const obj = { name: "Alice" };
greet.myCall(obj, "Hello"); // 输出: Hello, Alice

Function.prototype.myApply = function (context, argsArray) {
  context = context || (typeof window !== "undefined" ? window : global);
  const fnKey = Symbol("fn");
  context[fnKey] = this;

  // 处理参数数组（若未传则视为空数组）
  const result = argsArray ? context[fnKey](...argsArray) : context[fnKey]();

  delete context[fnKey];
  return result;
};

// 测试用例
greet.myApply(obj, ["Hi"]); // 输出: Hi, Alice

Function.prototype.myBind = function (context, ...presetArgs) {
  const originalFunc = this;

  // 定义绑定函数
  const boundFunc = function (...args) {
    // 判断是否通过 new 调用（this 是否为 boundFunc 的实例）
    const isNewCall = this instanceof boundFunc;

    // 若通过 new 调用，则使用新创建的实例作为上下文
    const thisContext = isNewCall ? this : context;

    // 合并预置参数和调用时参数
    return originalFunc.apply(thisContext, [...presetArgs, ...args]);
  };

  // 继承原函数的原型（保持 new 操作符的行为）
  boundFunc.prototype = Object.create(originalFunc.prototype);

  return boundFunc;
};

// 测试用例
const boundGreet = greet.myBind(obj);
boundGreet("Hey"); // 输出: Hey, Alice

// 测试 new 操作符
function Person(name) {
  this.name = name;
}
const BoundPerson = Person.myBind(null, "Bob");
const person = new BoundPerson();
console.log(person.name); // 输出: Bob
```

## 140. 为什么会出现 _setTimeout_ 倒计时误差？如何减少

**出现误差的原因：**

1. **事件循环机制**：JavaScript 是单线程的，`setTimeout` 的回调需等待主线程空闲才能执行。若主线程被阻塞（如密集计算、同步任务），回调会延迟。
2. **最小延迟限制**：浏览器对 `setTimeout` 有最低延时（如嵌套调用时 ≥4ms），且系统计时器精度有限（如旧系统为 15ms）。
3. **累积误差**：每次回调执行的微小误差会随倒计时次数逐渐累积。

**减少误差的方法：**

1. **动态校准**  
   每次执行时用**实际时间差**计算剩余时间，而非依赖固定间隔。例如：

   ```javascript
   let start = Date.now();
   let count = 10;

   function update() {
     const elapsed = Date.now() - start;
     const remaining = count * 1000 - elapsed;

     if (remaining <= 0) {
       console.log("End");
     } else {
       console.log(Math.ceil(remaining / 1000));
       setTimeout(update, remaining % 1000 || 1000); // 动态调整下次延迟
     }
   }
   update();
   ```

2. **高精度定时器**  
   使用 `requestAnimationFrame`（适合 UI 更新）或 `performance.now()` 提升时间精度：

   ```javascript
   function highPrecisionCount() {
     let start = performance.now();

     function tick() {
       const elapsed = performance.now() - start;
       if (elapsed >= 1000) {
         start += 1000; // 按实际流逝时间更新基准
         console.log("Tick");
       }
       requestAnimationFrame(tick);
     }
     tick();
   }
   ```

3. **Web Worker**  
   将计时逻辑放到 Web Worker 中，避免主线程阻塞：

   ```javascript
   // 主线程
   const worker = new Worker("timer-worker.js");
   worker.onmessage = (e) => {
     console.log(e.data);
   };

   // timer-worker.js
   let count = 10;
   function countdown() {
     setInterval(() => {
       postMessage(--count);
     }, 1000);
   }
   countdown();
   ```

## 141. 谈谈你对 _JS_ 执行上下文栈和作用域链的理解

- JavaScript 代码运行时，每个函数调用或全局代码块都会生成一个执行上下文（Execution Context），这些上下文按调用顺序形成一个栈结构（后进先出），称为执行上下文栈。
- 作用域链是当前执行上下文中变量访问的规则链，由当前环境的变量对象（VO/AO）和所有外层词法环境的变量对象组成，用于标识符解析（查找变量）。

## 145. 取数组的最大值（_ES5、ES6_）

- 现代项目直接用 `Math.max(...arr)`；
- 需兼容性时用 `apply`；
- 超大数组或复杂逻辑用 `reduce`。

## 147. _Promise_ 有几种状态, _Promise_ 有什么优缺点 ?

**Promise 的状态**  
Promise 有三种不可逆的状态：

1. **Pending（进行中）**：初始状态，尚未完成或拒绝。
2. **Fulfilled（已成功）**：异步操作成功完成，触发 `resolve(value)`。
3. **Rejected（已失败）**：异步操作失败，触发 `reject(reason)`。

状态一旦变为 `Fulfilled` 或 `Rejected`，便不可再改变。

**Promise 的优点**

1. **解决回调地狱（Callback Hell）**  
   通过链式调用 `.then()` 替代嵌套回调，代码更扁平、可读：

   ```javascript
   fetchData().then(processData).then(saveData).catch(handleError);
   ```

2. **统一的错误处理**  
   使用 `.catch()` 可集中捕获链中任意环节的错误：

   ```javascript
   asyncTask()
     .then(step1)
     .then(step2)
     .catch((err) => console.error("失败:", err));
   ```

3. **支持并行与竞态**

   - **并行执行**：`Promise.all([p1, p2])` 等待所有任务完成。
   - **竞态获取**：`Promise.race([p1, p2])` 取最先完成的结果。

4. **更好的异步流程控制**  
   结合 `async/await` 可编写接近同步代码的异步逻辑：
   ```javascript
   async function init() {
     try {
       const data = await fetchData();
       const result = await process(data);
     } catch (err) {
       // 统一处理错误
     }
   }
   ```

**Promise 的缺点**

1. **无法取消**  
   一旦创建 Promise，无法中途终止其执行（需自行实现超时或标志位控制）。

2. **错误可能被静默忽略**  
   若未添加 `.catch()`，未处理的 `reject` 可能导致错误被隐藏（浏览器中会触发 `unhandledrejection` 事件）。

3. **链式调用冗余**  
   多层 `.then()` 仍可能让代码显得冗长，不如 `async/await` 直观。

4. **兼容性依赖 Polyfill**  
   旧版浏览器（如 IE11）需引入 `es6-promise` 等 Polyfill 支持。

## 150. 如何实现 _Promise.all_ ?

```javascript
function myPromiseAll(iterable) {
  // 同步校验参数是否为可迭代对象
  if (typeof iterable?.[Symbol.iterator] !== "function") {
    throw new TypeError(`${typeof iterable} is not iterable`);
  }

  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let remaining = promises.length;

    // 空数组直接 resolve
    if (remaining === 0) {
      resolve(results);
      return;
    }

    promises.forEach((item, index) => {
      // 统一处理非 Promise 值
      Promise.resolve(item).then(
        (value) => {
          results[index] = value; // 按索引存储结果
          remaining--;
          if (remaining === 0) {
            resolve(results); // 全部成功
          }
        },
        (reason) => {
          reject(reason); // 遇到第一个失败立即终止
        }
      );
    });
  });
}
```

## 151. 如何实现 _Promise.finally_ ?

```javascript
Promise.prototype.finally = function (callback) {
  const PromiseConstructor = this.constructor; // 支持子类化
  return this.then(
    // 处理成功状态
    (value) => PromiseConstructor.resolve(callback()).then(() => value),
    // 处理失败状态
    (reason) =>
      PromiseConstructor.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

## 152. 如何判断 _img_ 加载完成

- 简单场景：直接使用 load 事件 + complete 属性检查。

- 复杂异步控制：用 Promise 封装，结合 Promise.all 管理多图加载。

```javascript
<img src="image.jpg" onload="handleLoad()" onerror="handleError()">

const img = document.querySelector('img');
if (img.complete) {
  console.log('图片已缓存，直接使用');
  handleLoad();
} else {
  img.addEventListener('load', handleLoad);
}
function handleLoad() {
  console.log('图片加载完成（含缓存）');
}
```

## 153. 如何阻止冒泡？

event.stopPropagation()

## 154. 如何阻止默认事件？

event.preventDefault()

## 155. 如何用原生 _js_ 给一个按钮绑定两个 _onclick_ 事件？

addEventListener

## 156. 拖拽会用到哪些事件

**1. 被拖拽元素（源元素）的事件**
| **事件** | **触发时机** | **常见用途** |
|----------------|--------------------------------|--------------------------------|
| `dragstart` | 用户**开始拖动**元素时触发 | 初始化拖拽数据（如 `event.dataTransfer.setData()`）、设置拖拽视觉效果 |
| `drag` | 拖拽过程中**持续触发**（类似 `mousemove`） | 实时更新拖拽状态（较少使用） |
| `dragend` | 拖拽**结束**时触发（无论是否成功释放到目标） | 清理资源、记录拖拽结果 |

---

**2. 放置目标元素（目标区域）的事件**
| **事件** | **触发时机** | **常见用途** |
|----------------|--------------------------------|--------------------------------|
| `dragenter` | 拖拽元素**首次进入**目标区域时触发 | 高亮目标区域（如改变边框颜色） |
| `dragover` | 拖拽元素**在目标区域内移动时持续触发** | **必须阻止默认行为**（`event.preventDefault()`）以允许放置 |
| `dragleave` | 拖拽元素**离开目标区域**时触发 | 取消目标区域的高亮状态 |
| `drop` | 拖拽元素**在目标区域释放**时触发 | 处理放置逻辑（如获取拖拽数据、更新 DOM） |

---

**完整事件触发顺序**

```text
1. 源元素: dragstart → drag → (持续触发 drag)
2. 目标区域: dragenter → dragover → (持续触发 dragover)
3. 释放时: drop → dragend
4. 若未放置到目标区域: dragend
```

1. **设置元素可拖拽**  
   必须为源元素添加 `draggable="true"` 属性：

   ```html
   <div draggable="true">可拖拽元素</div>
   ```

2. **必须阻止 `dragover` 的默认行为**  
   否则 `drop` 事件不会触发：

   ```javascript
   dropZone.addEventListener("dragover", (e) => e.preventDefault());
   ```

3. **跨元素数据传递**  
   使用 `dataTransfer` 对象在拖拽过程中传递数据：

   - **设置数据**：`e.dataTransfer.setData(format, value)`
   - **获取数据**：`e.dataTransfer.getData(format)`

4. **拖拽视觉效果**
   - 通过 `effectAllowed` 和 `dropEffect` 控制光标样式（如 `copy`、`move`）。
   - 使用 `e.dataTransfer.setDragImage(image, xOffset, yOffset)` 自定义拖拽预览图像。

## 157. _document.write_ 和 _innerHTML_ 的区别

| **特性**     | `document.write`                       | `innerHTML`                              |
| ------------ | -------------------------------------- | ---------------------------------------- |
| **操作对象** | 直接操作整个文档流（`document`）       | 操作特定 DOM 元素的内部 HTML 内容        |
| **写入位置** | 在脚本执行位置插入内容（若在加载阶段） | 修改指定元素的子节点内容                 |
| **覆盖风险** | 若在页面加载完成后调用，会覆盖整个文档 | 仅覆盖目标元素的内容，不影响页面其他部分 |

## 161. _await async_ 如何实现 （阿里）

`async/await` 本质是 **Generator（生成器）** 和 **Promise** 的语法糖，通过自动执行生成器函数并处理异步操作，使异步代码看起来像同步代码。以下是其实现原理及手动模拟方法：

```javascript
// 模拟 async 函数
function* asyncGenerator() {
  try {
    const result1 = yield mockAsyncTask(1000, "数据1"); // 模拟 await
    console.log(result1); // 输出: 数据1 (1秒后)
    const result2 = yield mockAsyncTask(500, "数据2");
    console.log(result2); // 输出: 数据2 (0.5秒后)
  } catch (err) {
    console.error("捕获错误:", err);
  }
}

// 模拟异步任务（返回 Promise）
function mockAsyncTask(delay, data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// 自动执行生成器的运行器
function run(generator) {
  const gen = generator();

  function handle(result) {
    if (result.done) return result.value;
    return result.value.then(
      (res) => handle(gen.next(res)), // 将 Promise 结果传回生成器
      (err) => handle(gen.throw(err)) // 抛出错误到生成器
    );
  }

  return handle(gen.next());
}

// 执行模拟的 async 函数
run(asyncGenerator);
```

`async/await` 的底层通过生成器函数和 Promise 实现异步流程控制，利用运行器函数自动处理暂停与恢复，最终以同步写法简化异步代码。

## 162. **`clientWidth`、`offsetWidth`、`scrollWidth` 的区别详解**

| **属性**      | 包含内容                        | 是否包含滚动条 | 典型用途           |
| ------------- | ------------------------------- | -------------- | ------------------ |
| `clientWidth` | 内容 + 内边距                   | 否             | 内部可用空间计算   |
| `offsetWidth` | 内容 + 内边距 + 边框 + 滚动条   | 是             | 元素整体占位宽度   |
| `scrollWidth` | 实际内容（含溢出部分） + 内边距 | 否             | 检测溢出或滚动范围 |

```javascript
clientWidth = width + padding-left + padding-right - 垂直滚动条宽度（如果存在）
offsetWidth = width + padding-left + padding-right + border-left + border-right + 垂直滚动条宽度
scrollWidth = 实际内容宽度 + padding-left + padding-right
```

## 163. 产生一个不重复的随机数组

```javascript
/**
 * 生成指定范围内的不重复随机整数数组
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @param {number} length 需要的数组长度
 * @returns {number[]} 不重复的随机数组
 */
function generateUniqueRandomArray(min, max, length) {
  // 参数校验
  if (min > max) throw new Error("最小值不能大于最大值");
  const range = max - min + 1;
  if (length > range) throw new Error("长度超过可能的最大唯一值数量");

  // 生成有序数组
  const arr = Array.from({ length: range }, (_, i) => min + i);

  // Fisher-Yates 洗牌算法
  for (let i = arr.length - 1; i > 0; i--) {
    const random = Math.random();
    const j = Math.floor(random * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // 返回前 N 项
  return arr.slice(0, length);
}

// 示例：生成 1-100 之间的 10 个不重复随机数
const randomArray = generateUniqueRandomArray(1, 100, 10);
// 输出类似：[34, 12, 89, 5, 67, 23, 91, 48, 2, 77]

function dynamicRandomArray(min, max, length) {
  const set = new Set();
  while (set.size < length) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    set.add(num);
  }
  return Array.from(set);
}

// 示例：从 1-100000 生成 10 个不重复数（碰撞概率低时高效）
console.log(dynamicRandomArray(1, 100000, 10));
```

## 164. _continue_ 和 _break_ 的区别

| **特性**     | `break`                              | `continue`                             |
| ------------ | ------------------------------------ | -------------------------------------- |
| **循环控制** | 终止整个循环                         | 仅跳过当前迭代，继续下一次循环         |
| **执行位置** | 执行后循环完全结束                   | 执行后循环继续，进入下一轮迭代         |
| **适用场景** | 提前退出循环、查找首个匹配项         | 跳过无效操作、过滤数据                 |
| **嵌套循环** | 只退出当前所在循环（不影响外层循环） | 只跳过当前循环的当前迭代（不影响外层） |

## 166. _async/await_ 如何捕获错误

1. **使用 `try/catch` 块**：在 `async` 函数内部包裹 `await` 表达式，捕获同步和异步错误。

2. **在调用 `async` 函数时使用 `.catch()`**：在外层处理错误，适用于不需要在函数内部处理错误的情况。

## 168. 原型链，可以改变原型链的规则吗?

原型链的规则是语言设计的核心机制，无法直接修改其底层行为（例如属性查找顺序、继承逻辑等）。但开发者可以通过操作对象的原型（prototype 或 **proto**），间接改变原型链的结构，从而实现动态继承、扩展或覆盖原型链的效果。

## 170. 栈和堆有什么区别，为什么要这样存储。（快手）

- 栈（Stack）和堆（Heap）是两种不同的内存分配方式，它们的核心区别在于 管理方式、存储内容、生命周期及性能特点。这种区分是为了优化内存使用效率、满足不同场景需求，同时简化编程模型。
- 栈和堆的区分是为了 平衡效率与灵活性。栈提供快速、自动化的短期存储，堆支持动态、长期的内存需求，二者协同工作以优化程序性能与资源管理。

## 171. _setTimeout(() => {}, 0)_ 什么时候执行

1.当前执行栈（同步代码）完全清空。

2.所有微任务（如 Promise 回调）执行完毕。

3.进入事件循环的宏任务队列，等待被调度。

## 172. _js_ 有函数重载吗（网易）

没有

## 173. 给你一个数组，计算每个数出现的次数，如果每个数组返回的数都是独一无二的就返回 _true_ 相反则返回的 _flase_

```javascript
function uniqueOccurrences(arr) {
  const frequency = {};
  // 统计每个元素的出现次数
  for (const num of arr) {
    frequency[num] = (frequency[num] || 0) + 1;
  }
  // 获取所有出现次数
  const counts = Object.values(frequency);
  // 检查次数是否唯一
  return counts.length === new Set(counts).size;
}
```

## 175. 写出代码的执行结果，并解释为什么？

```js
function a() {
  console.log(1);
}
(function () {
  if (false) {
    function a() {
      console.log(2);
    }
  }
  console.log(typeof a);
  a();
})();
//JavaScript 在非严格模式下，块内的函数声明会提升到外层作用域顶部但未初始化，导致变量覆盖且值为 undefined。
//即使在 if (false) 中，这种提升仍然发生。
//如果为true则正常输出 function 2
undefined
Uncaught TypeError: a is not a function
```

## 176. 写出代码的执行结果，并解释为什么？

```js
alert(a);
a();
var a = 3;
function a() {
  alert(10);
}
alert(a);
a = 6;
a();
//----
function a() {
  alert(10);
} // 函数声明提升
var a; // 变量声明提升（被函数声明覆盖）
alert(a); // 输出函数定义
a(); // 执行函数，输出 10
a = 3; // 覆盖 a 为数值 3
alert(a); // 输出 3
a = 6; // 再次覆盖为 6
a(); // 尝试调用数值 6，触发错误
```

## 177. 写出下面程序的打印顺序，并简要说明原因

```js
setTimeout(function () {
  console.log("set1");
  new Promise(function (resolve) {
    resolve();
  }).then(function () {
    new Promise(function (resolve) {
      resolve();
    }).then(function () {
      console.log("then4");
    });
    console.log("then2");
  });
});
new Promise(function (resolve) {
  console.log("pr1");
  resolve();
}).then(function () {
  console.log("then1");
});

setTimeout(function () {
  console.log("set2");
});
console.log(2);

new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("then3");
});
/**
pr1
2
then1
then3
set1
then2
then4
set2  //每次事件循环只执行一个宏任务，之后必须清空所有微任务，再执行下一个宏任务。
 */
```

## 178. _javascript_ 中什么是伪数组？如何将伪数组转换为标准数组

伪数组（Array-like Object）是指 **具有数字索引和 `length` 属性，但缺乏数组方法（如 `push`、`pop` 等）的对象**。常见伪数组包括：

- **`arguments` 对象**：函数参数列表。
- **DOM 集合**：如 `document.getElementsByTagName` 返回的节点列表。
- **字符串**：虽然字符串不可变，但支持类似数组的访问（如 `str[0]`）。

| **方法**                     | **优点**                 | **缺点**           | **适用场景**                        |
| ---------------------------- | ------------------------ | ------------------ | ----------------------------------- |
| `Array.prototype.slice.call` | 兼容性好（支持旧浏览器） | 代码稍显冗长       | 需要兼容旧环境                      |
| `Array.from()`               | 简洁直观，支持映射转换   | 需 ES6+ 支持       | 现代项目首选                        |
| 展开运算符 `...`             | 语法简洁                 | 仅适用于可迭代对象 | 处理可迭代的伪数组（如 `NodeList`） |
| 手动遍历填充                 | 完全控制转换过程         | 代码冗余，效率低   | 特殊结构的伪数组处理                |

## 182. 请实现一个模块 _math_，支持链式调用`math.add(2,4).minus(3).times(2);`

```javascript
const math = (() => {
  let value = 0;

  return {
    add(...args) {
      value += args.reduce((sum, num) => sum + num, 0);
      return this; // 返回当前对象，支持链式调用
    },
    minus(...args) {
      value -= args.reduce((sum, num) => sum + num, 0);
      return this;
    },
    times(num) {
      value *= num;
      return this;
    },
    get result() {
      const finalValue = value;
      value = 0; // 重置内部状态，以便下次调用重新开始
      return finalValue;
    },
  };
})();

// 示例调用
console.log(math.add(2, 4).minus(3).times(2).result); // 输出: 6
console.log(math.add(5).times(3).result); // 输出: 15
```

## 183. 请简述 _ES6_ 代码转成 _ES5_ 代码的实现思路。

将 ES6 代码转换为 ES5 代码的核心思路是通过 **代码解析、语法转换、代码生成** 三个步骤实现，并辅以 **Polyfill** 处理新 API。以下是具体实现思路：

1. **解析（Parsing）**
   将 ES6 代码解析为 **抽象语法树（AST）**，以便后续操作：

- **工具**：使用解析器（如 `@babel/parser`，原 Babylon）进行词法分析和语法分析。
- **过程**：将源代码字符串转换为树状结构的 AST，每个节点对应代码中的语法元素（如变量声明、函数调用等）。

```javascript
// 示例：将 ES6 代码解析为 AST
const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
```

2.  **转换（Transformation）**
    遍历 AST 并应用 **插件** 或 **预设**，将 ES6 语法替换为 ES5 实现：

- **工具**：使用 `@babel/traverse` 遍历 AST，配合插件（如 `@babel/plugin-transform-arrow-functions`）修改节点。
- **关键转换**：
  - **箭头函数** → 普通函数（处理 `this` 绑定）。
  - **类（Class）** → 构造函数和原型方法。
  - **模板字符串** → 字符串拼接（`"Hello " + name`）。
  - **解构赋值** → 逐层属性访问。
  - `let/const` → `var`（通过重命名解决块级作用域问题）。
  - **模块系统**（`import/export`）→ CommonJS 或 AMD。

```javascript
// 示例：转换箭头函数的插件逻辑
traverse(ast, {
  ArrowFunctionExpression(path) {
    // 将箭头函数节点替换为普通函数节点
    path.replaceWith(t.functionExpression(...));
  }
});
```

3. **生成（Code Generation）**
   将转换后的 AST 重新生成为 ES5 代码：

- **工具**：使用 `@babel/generator` 将 AST 转换为代码字符串。
- **附加功能**：生成 **Source Map**，便于调试转换后的代码。

```javascript
// 示例：生成 ES5 代码
const { code: es5Code, map } = generator(ast);
```

4.  **Polyfill 注入**
    处理 ES6 新增的 API（如 `Promise`、`Array.from`）：

- **方法**：通过 `core-js` 或 `@babel/polyfill` 模拟这些 API。
- **按需加载**：使用 `@babel/preset-env` 的 `useBuiltIns: 'usage'` 自动按需引入 Polyfill。

```javascript
// 示例：转换前代码中的 Promise
const p = new Promise(...);

// 转换后代码中插入 Polyfill
require("core-js/modules/es.promise.js");
const p = new Promise(...);
```

**工具链整合**

- **配置预设**：通过 `@babel/preset-env` 指定目标浏览器环境，自动决定需要转换的语法和 Polyfill。
- **构建工具集成**：配合 Webpack、Rollup 等工具，在打包流程中调用 Babel。

```javascript
// 示例：Babel 配置文件 .babelrc
{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.25%, not dead" }]
  ]
}
```

**总结流程**

```
ES6 代码 → 解析为 AST → 遍历 AST 并转换 → 生成 ES5 代码 → 注入 Polyfill
```

通过这一流程，ES6+ 的新特性被降级为兼容性更强的 ES5 代码，同时通过 Polyfill 补齐缺失的 API，确保代码在旧环境中正常运行。

## 184. 下列代码的执行结果

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");

/**
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
 */
```

## 185. _JS_ 有哪些内置对象？

JavaScript 的内置对象（Built-in Objects）分为 **标准内置对象** 和 **宿主环境对象**（如浏览器或 Node.js 提供的对象）。以下是核心分类和常见内置对象：

**标准内置对象（由 ECMAScript 规范定义）**

1.  **基础对象**

- `Object`：所有对象的基类。
- `Function`：函数的构造函数。
- `Boolean`、`String`、`Number`：原始类型的包装对象。
- `Symbol`（ES6+）：表示唯一值。

2.  **数据结构与集合**

- `Array`：数组。
- `Map`（ES6+）：键值对集合，键可以是任意类型。
- `Set`（ES6+）：唯一值集合。
- `WeakMap`、`WeakSet`（ES6+）：弱引用集合。
- `TypedArray`（ES6+）：二进制数据缓冲区视图（如 `Int32Array`）。
- `ArrayBuffer`：二进制数据缓冲区。

3.  **时间与数学**

- `Date`：日期和时间操作。
- `Math`：数学工具对象（无需实例化，直接调用方法如 `Math.random()`）。

4.  **正则与错误处理**

- `RegExp`：正则表达式。
- `Error`：错误基类（如 `SyntaxError`、`TypeError`、`ReferenceError` 等子类）。

5.  **反射与元编程**

- `Proxy`（ES6+）：拦截对象操作。
- `Reflect`（ES6+）：提供对象操作的静态方法。

6.  **异步与模块**

- `Promise`（ES6+）：异步操作管理。
- `Generator`、`GeneratorFunction`（ES6+）：生成器函数。
- `AsyncFunction`（ES7+）：异步函数。

7.  **其他工具对象**

- `JSON`：JSON 解析与序列化。
- `Intl`：国际化 API（如日期、数字格式化）。
- `Global`：全局对象（浏览器中为 `window`，Node.js 中为 `global`）。
  **宿主环境对象（由运行环境提供）**

1.  **浏览器环境**

- `Window`：浏览器窗口对象。
- `Document`（DOM）：文档操作。
- `XMLHttpRequest`、`Fetch API`：网络请求。
- `Console`：控制台输出（如 `console.log`）。

2.  **Node.js 环境**

- `Process`：进程信息（如 `process.env`）。
- `Buffer`：二进制数据处理。
- `Module`、`Require`：模块系统。
  **ES6+ 新增关键对象**
  | 对象/类 | 用途 |
  |-----------------|-----------------------------|
  | `Promise` | 异步编程的解决方案 |
  | `Proxy`/`Reflect`| 元编程，拦截对象操作 |
  | `Map`/`Set` | 高效的数据结构 |
  | `Symbol` | 唯一标识符，避免属性名冲突 |
  | `TypedArray` | 处理二进制数据 |

**常见示例**

```javascript
// 1. 基础对象
const obj = new Object();
const str = new String("Hello");
const num = new Number(42);

// 2. 数据结构
const arr = new Array(1, 2, 3);
const map = new Map().set("key", "value");

// 3. 异步操作
new Promise((resolve) => resolve(100));

// 4. 错误处理
throw new Error("Something went wrong!");

// 5. 反射
const proxy = new Proxy(target, handler);
```

总结

- **标准内置对象**：语言核心，与运行环境无关。
- **宿主对象**：依赖执行环境（浏览器/Node.js）。
- **ES6+ 扩展**：新增了更强大的数据结构与异步工具。

## 186. _DOM_ 怎样添加、移除、移动、复制、创建和查找节点

| 操作 | 方法/属性                         | 示例                                    |
| ---- | --------------------------------- | --------------------------------------- |
| 创建 | `createElement`, `createTextNode` | `document.createElement('div')`         |
| 添加 | `appendChild`, `insertBefore`     | `parent.appendChild(child)`             |
| 移除 | `removeChild`, `remove()`         | `child.remove()`                        |
| 移动 | `insertBefore`                    | `newParent.insertBefore(node, refNode)` |
| 复制 | `cloneNode(true/false)`           | `node.cloneNode(true)`                  |
| 查找 | `querySelector`, `getElementById` | `document.querySelector('.class')`      |

## 196. _map_ 和 _forEach_ 的区别？

| **特性**           | **`map`**                                     | **`forEach`**                                           |
| ------------------ | --------------------------------------------- | ------------------------------------------------------- |
| **返回值**         | 返回一个 **新数组**（由回调函数的返回值组成） | 返回 `undefined`                                        |
| **用途**           | 用于 **转换数组元素**（生成新数组）           | 用于 **遍历数组执行副作用操作**（如修改原数组、打印等） |
| **是否修改原数组** | 不修改原数组（除非在回调中显式操作）          | 可能修改原数组（通过回调操作元素）                      |
| **链式调用**       | 支持（返回值是新数组，可继续调用其他方法）    | 不支持（返回 `undefined`）                              |

- 需要新数组 → `map`
- 仅需遍历 → `forEach`
- 需要链式操作 → `map`

## 199. 什么是预解析（预编译）

在 Vite 项目启动时（vite dev），它会扫描项目依赖的第三方库（如 lodash、react 等），将它们的代码预先转换为 浏览器可执行的 ES 模块（ESM），并合并为一个或多个文件。这一过程称为 依赖预构建。
