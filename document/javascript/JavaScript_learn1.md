---
title: 面试题1
---

## 1. 根据下面 _ES6_ 构造函数的书写方式，要求写出 _ES5_ 的

```js
//ES6
class Example {
  constructor(name) {
    this.name = name;
  }
  init() {
    const fun = () => {
      console.log(this.name);
    };
    fun();
  }
}
const e = new Example("Hello");
e.init();
// ES5 构造函数
function Example(name) {
  this.name = name;
}

// 原型方法 init
Example.prototype.init = function () {
  var self = this; // 保存外层 this 的引用
  var fun = function () {
    console.log(self.name); // 使用保存的 self 替代箭头函数中的 this
  };
  fun();
};
var e = new Example("Hello");
e.init();
```

## 3. 描述下列代码的执行结果

```js
foo(typeof a);
function foo(p) {
  console.log(this);
  console.log(p);
  console.log(typeof b);
  let b = 0;
}
```

## 4. 描述下列代码的执行结果

```js
class Foo {
  constructor(arr) {
    this.arr = arr;
  }
  bar(n) {
    return this.arr.slice(0, n);
  }
}
var f = new Foo([0, 1, 2, 3]);
console.log(f.bar(1));
console.log(f.bar(2).splice(1, 1));
console.log(f.arr);
```

## 5. 描述下列代码的执行结果

```js
function f(count) {
  console.log(`foo${count}`);
  setTimeout(() => {
    console.log(`bar${count}`);
  });
}
f(1);
f(2);
setTimeout(() => {
  f(3);
});

// log
foo1;
foo2;
bar1;
bar2;
foo3;
bar3;
```

## 6. 描述下列代码的执行结果

```js
var a = 2;
var b = 5;
console.log(a === 2 || (1 && b === 3) || 4);
//log
true;
```

## 7. 描述下列代码的执行结果

```js
export class ButtonWrapper {
  constructor(domBtnEl, hash) {
    this.domBtnEl = domBtnEl;
    this.hash = hash;
    this.bindEvent();
  }
  bindEvent() {
    this.domBtnEl.addEventListener("click", this.clickEvent, false);
  }
  detachEvent() {
    this.domBtnEl.removeEventListener("click", this.clickEvent);
  }
  clickEvent() {
    console.log(`The hash of the button is: ${this.hash}`);
  }
}
```

## 8. 箭头函数有哪些特点

`语法简介，继承外层的this，适合回调函数。不能用作构造函数，没有自己的this，没有args。`

## 9. 说一说类的继承

`可以通过extends关键字，来继承父类，内置对象，通过关键字super来访问父类属性和方法，子类会继承父类的静态方法和属性，子类的实例对象的原型对象指向父类的原型对象，还可以重写父类的方法。`

## 10. _new_ 操作符都做了哪些事？

`创建一个对象，绑定this，执行构造函数代码，返回对象`

## 11. _call、apply、bind_ 的区别 ？

|   特性   |          call           |          apply          |            bind            |
| :------: | :---------------------: | :---------------------: | :------------------------: |
| 调用时机 |        立即调用         |        立即调用         |         返回新函数         |
| 参数形式 |      单个依次传递       |        数组形式         |        单个依次传递        |
|  返回值  |     函数执行的结果      |     函数执行的结果      |    绑定了 this 的新函数    |
|   用途   | 改变 this，直接调用函数 | 改变 this，直接调用函数 | 创建保定特定 this 的新函数 |

## 12. 事件循环机制（宏任务、微任务）

`事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。
在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。
何为线程？
浏览器有哪些进程和线程？
过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。
渲染主线程是如何工作的？
若干解释
根据W3C官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。`

## 13. 你了解 _node_ 中的事件循环机制吗？_node11_ 版本以后有什么改变

## 14. 什么是函数柯里化？

`将一个多参数函数转换为接收单个函数的函数链`
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// 示例
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
```


## 15. _promise.all_ 方法的使用场景？数组中必须每一项都是 _promise_ 对象吗？不是 _promise_ 对象会如何处理 ？

`并行处理多个异步任务的方法 他会等待所有任务完成后再返回结果，如果其中一个任务失败时立即返回失败的promise `
`每一项并不都是promise对象 ，会直接封装成为已完成的promise，相当于调用了promise.resolve `

## 16. _this_ 的指向哪几种 ？

`取决于函数的调用方式 。
全局作用域，对象方法，构造函数，箭头函数，显示绑定（call apply bind），类方法
`

## 17. _JS_ 中继承实现的几种方式

`原型链 构造函数 组合继承 原型式  寄生式  class  object.create `

## 18. 什么是事件监听

`某些对象或者元素绑定特定的操作，比如点击，键盘，鼠标移动，发生时触发回调函数。通过监听事件触发行为实现交互`

## 19. 什么是 _js_ 的闭包？有什么作用？

`引用了另一个函数作用域中变量的函数 通常是嵌套函数中实现的 `
`可以保留其被定义时的作用域 这就意味着臂包内部可以访问外部函数的局部变量 即使外部函数已经执行完毕 这种特性呢 可以使b包在后续调用中使用这些变量 `
`怎么会使得函数内部的变量在函数执行后仍然存在于内存中 直到没有任何引用指向闭包。不注意管理 可能会导致内存泄露 `

## 20. 事件委托以及冒泡原理

`事件处理程序附加到一个祖先元素上 而不是直接附加到每个子元素上 当子元素上上冒泡时 祖先元素捕获事件 并根据事件目标来确定如何处理事件 `
`从出发的目标元素开启逐级向上 冒泡到dom树的根节点  ，事件冒泡是默认的事件传播方式 `
`adevent listeners 第三个参数true为捕获FALSE为冒泡默认为FALSE  `

## 21. _let const var_ 的区别？什么是块级作用域？如何用？
| 特性         | `var`            | `let`       | `const`     |
|--------------|------------------|-------------|-------------|
| **作用域**   | 函数作用域       | 块级作用域  | 块级作用域  |
| **重复声明** | ✅ 允许          | ❌ 禁止     | ❌ 禁止     |
| **变量提升** | ✅（值为 `undefined`） | ❌（TDZ）  | ❌（TDZ）  |
| **重新赋值** | ✅ 允许          | ✅ 允许     | ❌ 禁止     |
| **初始化**   | 可不初始化       | 可不初始化  | 必须初始化  |

`有大花括号 包括的代码块 其中let const 在当前的块级作用域中有效 `

## 22. _ES5_ 的方法实现块级作用域（立即执行函数） _ES6_ 呢？

`eS 5中没有块级作用域 只有函数作用域 通过立即执行函数表达式来模拟 变量仅在函数内有效。es 6本身就支持块级作用域 通过let和const来定义变量     `

## 23. _ES6_ 箭头函数的特性

`语法简洁，没有自己的this，不能作为构造函数，没有arguments，没有prototype`

## 24. 箭头函数与普通函数的区别 ？

`同23，
箭头函数的作用？
消除函数的二义性（一个function函数可以直接调用，也可以new，箭头函数不能new，还有class，只能通过new来创建。）
`

## 25. _JS_ 的基本数据类型有哪些？基本数据类型和引用数据类型的区别

```
基本  （栈）
boolean   number string  null undefine symbol  bigint
引用  （堆）
object

```

## 26. _NaN_ 是什么的缩写

`Not a Number`

## 27. _JS_ 的作用域类型

| 作用域类型 | 关键字/语法     | 核心特点                 | 典型应用场景       |
| ---------- | --------------- | ------------------------ | ------------------ |
| 全局作用域 | `var`（非模块） | 跨作用域访问，易污染全局 | 全局配置、工具函数 |
| 函数作用域 | `var`           | 变量提升，函数内封装     | 旧代码、IIFE       |
| 块级作用域 | `let/const`     | 隔离临时变量，避免泄漏   | 循环、条件语句     |
| 模块作用域 | `export/import` | 隔离模块，按需共享       | 现代模块化开发     |
| 词法作用域 | 闭包            | 静态确定，闭包保持引用   | 状态封装、高阶函数 |

**作用域链（Scope Chain）**

- 函数执行时会从内到外逐级查找变量，形成链式结构。
- 闭包通过保留对外部作用域的引用，突破函数作用域的生命周期限制。

## 28. _undefined==null_ 返回的结果是什么？_undefined_ 与 _null_ 的区别在哪？

| 特性         | `undefined`                  | `null`                     |
| ------------ | ---------------------------- | -------------------------- |
| **赋值方式** | 系统自动赋值                 | 开发者显式赋值             |
| **语义**     | “未定义”或“缺失”             | “有意的空对象引用”         |
| **类型**     | `undefined`                  | `object`（历史遗留）       |
| **使用场景** | 变量未初始化、函数缺省返回值 | 显式标记空值、清空对象引用 |
| **检测**     | `x === undefined`            | `x === null`               |

## 29. 写一个函数判断变量类型

```javascript
function getType(value) {
  // 处理 null（typeof null 返回 'object'，需特殊处理）
  if (value === null) return "null";

  // 处理原始类型（undefined、boolean、number、string、symbol、bigint）
  const primitiveType = typeof value;
  if (primitiveType !== "object" && primitiveType !== "function") {
    return primitiveType;
  }

  // 处理对象类型：通过 Object.prototype.toString 获取内部 [[Class]]
  const objectType = Object.prototype.toString.call(value);
  /*
    示例返回值：
    [object Array] → 'array'
    [object Date] → 'date'
    [object RegExp] → 'regexp'
    [object Promise] → 'promise' 
  */
  return objectType.slice(8, -1).toLowerCase();
}
```

| 方法                        | 优点                 | 缺点                            |
| --------------------------- | -------------------- | ------------------------------- |
| `typeof`                    | 快速识别原始类型     | 无法区分 `null` 和对象类型      |
| `instanceof`                | 检测构造函数         | 跨环境不可靠                    |
| `Object.prototype.toString` | 精准识别所有内置类型 | 需处理格式（如 `[object Xxx]`） |

## 30. _js_ 的异步处理函数

## 31. _defer_ 与 _async_ 的区别

```
defer = 异步加载 + 延迟执行 + 顺序保障 → 适合依赖型脚本。
async = 异步加载 + 立即执行 + 无序执行 → 适合独立型脚本。
默认行为（无属性） = 同步加载 + 立即执行 → 阻塞渲染，慎用。
```

## 32. 浏览器事件循环和任务队列

```javascript
事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其
他线程只需要在合适的时候将任务加入到队列未尾即可。过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。
```

## 33. 原型与原型链 （美团 19 年）

```javascript
1.原型:函数都有prototype属性,称之为原型，也称为原型对象
>原型可以放一些属性和方法，共享给实例对象使用
>原型可以做继承
2.原型链:对象都有 proto 属性,这个属性指向它的原型对象,原型对象也是对象,也有 proto 属性,指向原型对象的原型对象,这样一层一层形成的链式结构称为原型链，最顶层找不到则返回 null
```

## 34. 作用域与作用域链 （美团 19 年）

```javascript
作用域（Scope）
定义：变量和函数的可访问范围（即变量生效的区域）。
作用：隔离代码，避免命名冲突，控制变量生命周期。
作用域链（Scope Chain）
定义：函数执行时，从当前作用域到全局作用域的层级访问链。
作用：确定变量和函数的查找顺序（由内向外逐级查找）。
```

## 35. 闭包及应用场景以及闭包缺点 （美团 19 年）

**闭包（Closure）的定义**  
闭包是 **函数与其词法作用域的组合**，允许函数访问并记忆其定义时的外层作用域变量，即使函数在定义时的作用域外执行。  
**核心本质**：内部函数持有对外部作用域变量的引用，导致这些变量无法被垃圾回收（GC）。
**闭包的应用场景**
**1. 模块化与数据封装**  
**场景**：创建私有变量，暴露公共接口，避免全局污染。  
 **2. 函数柯里化（Currying）**  
**场景**：将多参数函数转换为单参数链式调用，复用部分参数。
**3. 防抖（Debounce）与节流（Throttle）**  
**场景**：控制高频事件（如滚动、输入）的触发频率。  
**4. 回调函数与异步任务**  
**场景**：在异步操作（如 `setTimeout`、`Promise`）中保留上下文变量。  
**5. 缓存计算结果（Memoization）**  
**场景**：缓存函数计算结果，避免重复计算。  
**闭包的缺点与注意事项**  
_1.内存泄漏风险_

- 问题：闭包导致外部函数变量无法释放，长期占用内存。
- 案例：DOM 元素引用未清理，阻止垃圾回收。  
  _2.循环中的闭包陷阱_
- 问题：循环内创建闭包可能意外捕获循环变量最终值。  
  _3.性能影响_
- 问题：频繁创建闭包可能增加内存和 CPU 开销。
- 优化：避免在热点代码（如高频触发的回调）中过度使用闭包。
  _4.调试复杂性_
- 问题：闭包引用链较长时，调试变量来源困难。
- 建议：命名清晰，控制闭包层级，避免深层嵌套。

| 优点               | 应用场景                  | 示例                         |
| ------------------ | ------------------------- | ---------------------------- |
| **数据私有化**     | 模块化开发、封装工具库    | 隐藏内部变量，暴露有限接口   |
| **状态保持**       | 计数器、计时器、缓存      | 保留变量状态，避免全局污染   |
| **动态生成函数**   | 函数工厂、柯里化          | 根据参数生成定制函数         |
| **异步上下文保留** | 事件监听、定时器、Promise | 确保回调函数访问正确的变量值 |

## 36. 继承方式 （美团 19 年）

**1. 原型链继承**  
**实现方式**：将子类的原型指向父类的实例。

```javascript
function Parent() {
  this.name = "Parent";
}
Parent.prototype.say = function () {
  console.log(this.name);
};

function Child() {}
Child.prototype = new Parent(); // 继承父类实例和原型

const child = new Child();
child.say(); // "Parent"
```

**2. 构造函数继承（经典继承）**  
**实现方式**：在子类构造函数中调用父类构造函数。

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ["red"];
}
function Child(name) {
  Parent.call(this, name); // 继承父类实例属性
}
const child1 = new Child("Child1");
child1.colors.push("blue");
console.log(child1.colors); // ['red', 'blue']
const child2 = new Child("Child2");
console.log(child2.colors); // ['red']（独立）
```

**3. 组合继承（原型链 + 构造函数）**  
**实现方式**：结合原型链继承和构造函数继承。

```javascript
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {};

function Child(name) {
  Parent.call(this, name); // 第二次调用 Parent
}
Child.prototype = new Parent(); // 第一次调用 Parent
Child.prototype.constructor = Child;

const child = new Child("Child");
child.say(); // 继承父类原型方法
```

**4. 原型式继承**  
**实现方式**：基于已有对象创建新对象（类似 `Object.create()`）。

```javascript
function createObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

const parent = { name: "Parent" };
const child = createObject(parent);
console.log(child.name); // "Parent"
```

**5. 寄生式继承**  
**实现方式**：在原型式继承基础上增强对象。

```javascript
function createEnhancedObject(obj) {
  const clone = Object.create(obj);
  clone.say = function () {
    console.log(this.name);
  };
  return clone;
}

const parent = { name: "Parent" };
const child = createEnhancedObject(parent);
child.say(); // "Parent"
```

**6. 寄生组合继承（最优方案）**  
**实现方式**：通过 `Object.create()` 继承父类原型，避免调用父类构造函数。

```javascript
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // 继承父类原型
  prototype.constructor = Child;
  Child.prototype = prototype;
}
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {};
function Child(name) {
  Parent.call(this, name); // 仅调用一次 Parent
}
inheritPrototype(Child, Parent); // 继承父类原型
const child = new Child("Child");
child.say(); // 继承父类原型方法
```

**7. ES6 Class 继承**  
**实现方式**：使用 `extends` 和 `super` 关键字。

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  say() {}
}
class Child extends Parent {
  constructor(name) {
    super(name); // 调用父类构造函数
  }
}
const child = new Child("Child");
child.say(); // 继承父类方法
```

| 继承方式         | 实现关键步骤                                     | 优点                   | 缺点                   | 适用场景             |
| ---------------- | ------------------------------------------------ | ---------------------- | ---------------------- | -------------------- |
| **原型链继承**   | `Child.prototype = new Parent()`                 | 简单                   | 引用属性共享，无法传参 | 简单原型扩展         |
| **构造函数继承** | 子类构造函数中调用 `Parent.call(this)`           | 解决引用共享，支持传参 | 无法继承父类原型方法   | 需要独立实例属性     |
| **组合继承**     | 构造函数继承 + 原型链继承                        | 属性独立，继承原型方法 | 父类构造函数被调用两次 | 通用场景（历史方案） |
| **原型式继承**   | `Object.create()` 或模拟实现                     | 轻量，适合对象浅继承   | 引用属性共享           | 基于对象继承         |
| **寄生式继承**   | 原型式继承 + 增强对象                            | 可扩展对象功能         | 方法无法复用           | 简单对象扩展         |
| **寄生组合继承** | `Object.create(Parent.prototype)` + 构造函数继承 | 性能最优，无副作用     | 代码较复杂             | 复杂继承需求         |
| **ES6 Class**    | `extends` + `super`                              | 语法简洁，底层自动优化 | 依赖 ES6+ 环境         | 现代项目首选         |

## 37. 原始值与引用值 （美团 19 年）

| 类别       | 类型                                                                   | 存储方式                               |
| ---------- | ---------------------------------------------------------------------- | -------------------------------------- |
| **原始值** | `undefined`、`null`、`boolean`、`number`、`string`、`symbol`、`bigint` | **栈内存**（按值直接存储）             |
| **引用值** | `object`（包含 `array`、`function`、`date` 等）                        | **堆内存**（按引用存储，栈中存堆地址） |

| 特性             | 原始值                 | 引用值                     |
| ---------------- | ---------------------- | -------------------------- |
| **存储位置**     | 栈内存（直接存储值）   | 堆内存（栈中存储引用地址） |
| **复制行为**     | 按值复制（独立）       | 按引用复制（共享地址）     |
| **比较方式**     | 比较值本身             | 比较引用地址               |
| **函数传参影响** | 不影响原值             | 可能修改原对象             |
| **可变性**       | 不可变（操作生成新值） | 可变（直接修改原对象）     |

## 38. 描述下列代码的执行结果

```js
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(1);
      }, 0);
      setTimeout(() => {
        console.log(2);
        resolve(3);
      }, 0);
      resolve(4);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg, 5); // 1 bb
    });
    setTimeout(() => {
      console.log(6);
    }, 0);
  });
first().then((arg) => {
  console.log(arg, 7); // 2 aa
  setTimeout(() => {
    console.log(8);
  }, 0);
});
setTimeout(() => {
  console.log(9);
}, 0);
console.log(10);
```

## 39. 如何判断数组或对象（美团 19 年）

```js
function checkType(target) {
  if (Array.isArray(target)) {
    return "Array";
  } else if (
    typeof target === "object" &&
    target !== null &&
    Object.prototype.toString.call(target) === "[object Object]"
  ) {
    return "Object";
  } else {
    return "其他类型";
  }
}
console.log(checkType([1, 2])); // "Array"
console.log(checkType({ a: 1 })); // "Object"
console.log(checkType(null)); // "其他类型"
console.log(checkType(new Date())); // "其他类型"
```

## 40. 对象深拷贝与浅拷贝，单独问了 _Object.assign_（美团 19 年）

```javascript
function deepClone(source) {
  if (source === null || typeof source !== "object") return source;

  const target = Array.isArray(source) ? [] : {};
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone(source[key]);
    }
  }
  return target;
}

const obj = { a: 1, b: { c: 2 } };
const deepCopy = deepClone(obj);
deepCopy.b.c = 3;
console.log(obj.b.c); // 2（原对象未变）
```

## 42. 说说 _instanceof_ 原理，并回答下面的题目（美团 19 年）

```js
function A() {}
function B() {}
A.prototype = new B();
let a = new A();
console.log(a instanceof B); // true of false ?

function instanceOf(obj, Constructor) {
  let proto = obj.__proto__;
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}

true;
```

## 43. 内存泄漏（美团 19 年）

| 场景              | 解决方案                                                     |
| ----------------- | ------------------------------------------------------------ |
| **全局变量**      | 使用严格模式，避免隐式全局变量                               |
| **定时器/监听器** | 在组件生命周期结束时清理（如 React 的 `useEffect` 清理函数） |
| **闭包**          | 及时解除无用引用，避免保留大对象                             |
| **DOM 操作**      | 移除 DOM 后清除引用，解绑事件监听器                          |
| **缓存**          | 使用 `WeakMap` 或设置过期策略                                |

## 44. _ES6_ 新增哪些东西？让你自己说（美团 19 年）=

| 类别         | 核心特性                     | 解决的问题              |
| ------------ | ---------------------------- | ----------------------- |
| **作用域**   | `let/const`                  | 变量提升、全局污染      |
| **函数**     | 箭头函数、默认参数、剩余参数 | `this` 绑定、参数灵活性 |
| **异步**     | `Promise`                    | 回调地狱                |
| **面向对象** | `class`、`super`             | 继承语法标准化          |
| **模块化**   | `import/export`              | 代码组织与复用          |
| **数据结构** | `Set`、`Map`、`Symbol`       | 复杂数据管理            |

## 45. _weakmap、weakset_（美团 _19_ 年）

`WeakMap` 和 `WeakSet` 是 ES6 新增的两种数据结构，专为 **弱引用** 场景设计，可避免内存泄漏。
**1. `WeakMap`**  
**特性**

- **键必须是对象**（不能是原始值）。
- **键是弱引用**：若键对象在其他地方无强引用，则会被垃圾回收（GC），对应的键值对自动删除。
- **不可遍历**：没有 `keys()`、`values()`、`entries()` 方法，也没有 `size` 属性。  
  **方法**
- `set(key, value)`：设置键值对。
- `get(key)`：获取值。
- `has(key)`：检查是否存在键。
- `delete(key)`：删除键值对。

**2. `WeakSet`**  
**特性**

- **值必须是对象**。
- **值是弱引用**：若值对象在其他地方无强引用，则会被垃圾回收，自动从集合中移除。
- **不可遍历**：没有 `values()` 方法，也没有 `size` 属性。

**方法**

- `add(value)`：添加值。
- `has(value)`：检查是否存在值。
- `delete(value)`：删除值。

## **与 `Map`、`Set` 的对比**

| 特性             | `Map`/`Set`                   | `WeakMap`/`WeakSet`             |
| ---------------- | ----------------------------- | ------------------------------- |
| **键/值类型**    | 任意类型                      | 仅对象                          |
| **可遍历性**     | 支持遍历（如 `for...of`）     | 不可遍历                        |
| **引用强度**     | 强引用（阻止 GC）             | 弱引用（不阻止 GC）             |
| **内存泄漏风险** | 需手动清理                    | 自动清理                        |
| **API 丰富性**   | 支持 `size`、`clear()` 等方法 | 仅基本操作（`set`/`get`/`add`） |

**使用场景总结**

1. **`WeakMap`**：

   - 存储对象的私有数据（如 DOM 元素的附加信息）。
   - 缓存计算结果，依赖对象生命周期自动清理。

2. **`WeakSet`**：
   - 记录对象是否已被处理（如事件防抖）。
   - 跟踪临时对象，无需手动管理集合。

## 46. 为什么 _ES6_ 会新增 _Promise_（美团 19 年）

**ES6 新增 `Promise` 的核心原因**：为了解决 JavaScript 异步编程中的 **回调地狱（Callback Hell）** 问题，提供更优雅、可维护的异步代码管理方案。

## 47. _ES5_ 实现继承？（虾皮）

| 继承方式         | 优点                         | 缺点                           |
| ---------------- | ---------------------------- | ------------------------------ |
| **组合继承**     | 实例属性独立，可继承原型方法 | 父类构造函数调用两次，冗余属性 |
| **寄生组合继承** | 最优性能，无冗余属性         | 代码稍复杂                     |
| **原型链继承**   | 简单                         | 引用属性共享                   |
| **构造函数继承** | 实例属性独立                 | 无法继承原型方法               |

## 48. 科里化？（搜狗）

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // 参数足够，执行原函数
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs)); // 合并参数，继续柯里化
      };
    }
  };
}
// 普通函数
function add(a, b, c) {
  return a + b + c;
}
// 柯里化后
const curriedAdd = curry(add);
console.log("---", curriedAdd, curriedAdd(1)(2)(3));
```

## 49. 防抖和节流？（虾皮）

```javascript
function debounce(fn, delay, immediate = false) {
  let timer = null;
  return function (...args) {
    const context = this;
    // 清除之前的定时器
    if (timer) clearTimeout(timer);
    // 立即执行模式
    if (immediate && !timer) {
      fn.apply(context, args);
    }
    // 设置新定时器
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      timer = null; // 重置 timer
    }, delay);
  };
}
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const context = this;
    const now = Date.now();
    // 判断是否达到时间间隔
    if (now - lastTime >= interval) {
      fn.apply(context, args);
      lastTime = now;
    }
  };
}
function throttle(fn, interval) {
  let timer = null;
  return function (...args) {
    const context = this;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, interval);
    }
  };
}


function debounce(fn, delay) {
  let timer = null;
  
  return function(...args) {
    // 每次触发都清除之前的定时器
    clearTimeout(timer);
    
    // 设置新的定时器
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

function debounce(fn, time) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
}

function throttle(fn, delay) {
  let lastTime = 0;
  return (...args)=> {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn(...args); 
      lastTime = now;
    }
  };
}
```

## 52. 排序算法---（时间复杂度、空间复杂度）

## 55. _let、const、var_ 的区别

| 特性         | `var`                            | `let`                     | `const`                    |
| ------------ | -------------------------------- | ------------------------- | -------------------------- |
| **作用域**   | 函数作用域或全局作用域           | 块级作用域（`{}` 内有效） | 块级作用域（`{}` 内有效）  |
| **变量提升** | 是（声明提升，值为 `undefined`） | 是（存在暂时性死区，TDZ） | 是（存在暂时性死区，TDZ）  |
| **重复声明** | 允许（可能覆盖变量）             | 禁止（语法错误）          | 禁止（语法错误）           |
| **重新赋值** | 允许                             | 允许                      | **禁止**（对象属性可修改） |
| **全局声明** | 成为 `window` 的属性             | 不会成为 `window` 的属性  | 不会成为 `window` 的属性   |

## 57. _Promise_

## 58. 实现一个函数,对一个 url 进行请求,失败就再次请求,超过最大次数就走失败回调,任何一次成功都走成功回调

```js
async function retryRequest(url, maxRetries, successCallback, failureCallback) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      // 如果响应状态码为 2xx，视为成功
      if (response.ok) {
        successCallback(await response.json()); // 假设成功回调需要 JSON 数据
        return; // 成功直接终止
      } else {
        throw new Error(`请求失败，状态码: ${response.status}`);
      }
    } catch (error) {
      // 达到最大重试次数时触发失败回调
      if (attempt === maxRetries) {
        failureCallback(error);
        return;
      }
      attempt++;
    }
  }
}

// 使用示例
retryRequest(
  "https://api.example.com/data",
  3, // 最大重试次数（若设为 3，则总请求次数为 4 次）
  (data) => console.log("成功:", data),
  (error) => console.error("失败:", error.message)
);
```

## 59. 冒泡排序

## 60. 数组降维

## 62. promise 代码题

```js
new Promise((resolve, reject) => {
  reject(1);
  console.log(2);
  resolve(3);
  console.log(4);
})
  .then((res) => {
    console.log(res);
  })
  .catch((res) => {
    console.log("reject1");
  });
try {
  new Promise((resolve, reject) => {
    throw "error";
  })
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.log("reject2");
    });
} catch (err) {
  console.log(err);
}
//promise 中的 throw "error"只会触发promise的catch
//log
2;
4;
reject1;
reject2;
```

## 63. _proxy_ 是实现代理，可以改变 _js_ 底层的实现方式, 然后说了一下和 _Object.defineProperty_ 的区别

| **特性**         | **Proxy**                                             | **Object.defineProperty**            |
| ---------------- | ----------------------------------------------------- | ------------------------------------ |
| **设计目标**     | 代理整个对象，拦截底层操作                            | 劫持单个属性的读写操作               |
| **拦截能力**     | 支持 13 种操作（如 `get`, `set`, `delete`, `has` 等） | 仅支持 `get` 和 `set`                |
| **作用范围**     | 代理整个对象（包括动态新增属性）                      | 只能劫持已定义的属性                 |
| **对数组的监听** | 直接监听数组索引变化和 `push`/`pop` 等方法            | 需手动重写数组方法或监听索引         |
| **性能开销**     | 初始化快，复杂拦截逻辑可能影响性能                    | 初始化需递归遍历属性，大规模数据较慢 |
| **兼容性**       | ES6+ 支持（IE 不支持）                                | ES5+ 广泛支持                        |

## 64. 使用 _ES5_ 与 _ES6_ 分别实现继承

以下是使用 **ES5** 和 **ES6** 实现继承的核心对比与代码示例：

---

## **ES5 实现继承**

**核心方法：组合继承（构造函数 + 原型链）**

```javascript
// 1. 定义父类
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.sayName = function () {
  console.log("Parent name:", this.name);
};

// 2. 定义子类
function Child(name, age) {
  Parent.call(this, name); // 借用父类构造函数（继承实例属性）
  this.age = age;
}

// 3. 继承父类原型方法（关键步骤）
Child.prototype = Object.create(Parent.prototype); // 避免直接赋值导致原型污染
Child.prototype.constructor = Child; // 修正构造函数指向

// 4. 添加子类方法
Child.prototype.sayAge = function () {
  console.log("Child age:", this.age);
};

// 测试
const child = new Child("Tom", 10);
child.sayName(); // "Parent name: Tom"
child.sayAge(); // "Child age: 10"
```

**ES6 实现继承**  
**核心语法：`class` 和 `extends`**

```javascript
// 1. 定义父类
class Parent {
  constructor(name) {
    this.name = name;
    this.colors = ["red", "blue"];
  }
  sayName() {
    console.log("Parent name:", this.name);
  }
}

// 2. 定义子类（通过 extends 继承）
class Child extends Parent {
  constructor(name, age) {
    super(name); // 必须调用 super() 继承父类属性
    this.age = age;
  }

  // 3. 添加子类方法
  sayAge() {
    console.log("Child age:", this.age);
  }

  // 4. 重写父类方法（可选）
  sayName() {
    super.sayName(); // 调用父类方法
    console.log("Child override");
  }
}

// 测试
const child = new Child("Tom", 10);
child.sayName(); // "Parent name: Tom" → "Child override"
child.sayAge(); // "Child age: 10"
```

**ES5 继承的优化（寄生组合继承）**

```javascript
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // 创建父类原型副本
  prototype.constructor = Child; // 修正构造函数
  Child.prototype = prototype; // 赋值给子类原型
}
// 使用方式：
inheritPrototype(Child, Parent);
```

## 65. 深拷贝

**1. JSON 序列化（局限性明显）**

```javascript
function deepCloneJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// 测试问题
const obj = {
  date: new Date(),
  fn: () => console.log("test"),
};
const cloned = deepCloneJSON(obj);
console.log(cloned.date); // 字符串，非 Date 对象
console.log(cloned.fn); // undefined
```

### **2. 递归实现（基础版）**

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
// 测试
const original = { a: 1, b: { c: 2 }, d: new Date() };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // 2（未受影响）
```

### **3. 使用第三方库 Lodash**

```javascript
import _ from "lodash";
const cloned = _.cloneDeep(original);
```

### **4. 浏览器原生 `structuredClone()`**

```javascript
const cloned = structuredClone(original); // 支持循环引用，但不支持函数
```

## 66. _async_ 与 _await_ 的作用

- **`async`**：声明异步函数，确保返回值封装为 Promise。
- **`await`**：暂停异步函数执行，等待 Promise 完成，以同步方式编写异步逻辑。
- **核心价值**：
  - 代码可读性高，避免回调地狱。
  - 错误处理集中（`try/catch`）。
  - 结合 `Promise` 方法（如 `Promise.all`）实现灵活流程控制。
- **适用场景**：替代传统回调或 Promise 链，简化 **API 调用、文件操作、数据库查询** 等异步任务。

## 67. 数据的基础类型（原始类型）有哪些

7 种原始类型：number、string、boolean、undefined、null、symbol、bigint。
引用类型（对象类型）：如 Object、Array、Function 等，与原始类型存储方式不同。
类型检测要点：优先使用 typeof 并结合严格判断（如 === null）。

## 68. _typeof null_ 返回结果

object

## 69. 对变量进行类型判断的方式有哪些

## **方法对比与推荐场景**

| **方法**                     | **适用类型**          | **优点**         | **缺点**                                 |
| ---------------------------- | --------------------- | ---------------- | ---------------------------------------- |
| `typeof`                     | 基本类型（除 `null`） | 简单快速         | 无法区分 `null` 和对象，无法检测引用类型 |
| `instanceof`                 | 对象类型              | 判断构造函数实例 | 跨环境失效，不适用于原始类型             |
| `Object.prototype.toString`  | 所有类型              | 精确、全面       | 代码较长，需注意 `Symbol.toStringTag`    |
| `Array.isArray()`            | 数组                  | 专一、可靠       | 仅限数组                                 |
| `=== null` / `=== undefined` | `null` 和 `undefined` | 精确判断         | 仅限特定值                               |

**最佳实践**

1. **基本类型**：优先使用 `typeof`（结合 `=== null` 判断 `null`）。
2. **数组**：使用 `Array.isArray()`。
3. **通用对象类型**：使用 `Object.prototype.toString.call()`。

## 70. _typeof_ 与 _instanceof_ 的区别？ _instanceof_ 是如何实现？

## **`typeof` 与 `instanceof` 的核心区别**

### **1. 功能对比**

| **特性**     | **`typeof`**                             | **`instanceof`**                     |
| ------------ | ---------------------------------------- | ------------------------------------ |
| **用途**     | 检测变量的**基本类型**（原始类型）       | 检测对象是否为某个**构造函数**的实例 |
| **返回值**   | 类型字符串（如 `'number'`, `'object'`）  | 布尔值（`true`/`false`）             |
| **适用类型** | 原始类型（除 `null` 外）、`function`     | 对象类型（不适用于原始类型）         |
| **局限性**   | 无法区分对象的具体类型（如数组 vs 对象） | 跨全局环境（如 iframe）可能失效      |

**2. 典型示例**

```javascript
// typeof 示例
typeof 42;                // 'number'
typeof 'hello';           // 'string'
typeof true;              // 'boolean'
typeof undefined;         // 'undefined'
typeof null;              // 'object'（历史遗留问题）
typeof {};                // 'object'
typeof [];                // 'object'（无法区分数组和对象）
typeof function() {};     // 'function'

// instanceof 示例
[] instanceof Array;      // true
[] instanceof Object;     // true（原型链继承）
{} instanceof Object;     // true
new Date() instanceof Date; // true
'str' instanceof String;  // false（原始类型不是对象实例）
```

**`instanceof` 的实现原理**  
`instanceof` 的核心逻辑是：**沿着对象的原型链向上查找，判断构造函数的 `prototype` 是否出现在原型链中**。

**手动实现 `instanceof`**

```javascript
function myInstanceof(obj, Constructor) {
  // 基本类型直接返回 false
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj); // 获取对象的原型
  while (proto !== null) {
    if (proto === Constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto); // 继续向上查找原型链
  }
  return false;
}

// 测试
console.log(myInstanceof([], Array)); // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof("str", String)); // false（原始类型）
```

**1. 为什么 `typeof null` 返回 `'object'`？**

- **历史遗留问题**：JavaScript 早期设计时，用**低位二进制标记类型**，`null` 的二进制全为 `0`，而对象类型标记也为 `0`，导致误判。
- **无法修复**：已大量存在于现有代码中，修复会导致兼容性问题。

**2. `instanceof` 的局限性**

- **跨全局环境失效**：
  ```javascript
  // 在 iframe 中创建的数组，父页面中检测可能失败
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const iframeArray = iframe.contentWindow.Array;
  const arr = new iframeArray();
  console.log(arr instanceof Array); // false（不同全局环境的 Array 构造函数）
  ```
- **原始类型无法检测**：
  ```javascript
  "str" instanceof String; // false（字符串字面量是原始类型）
  new String("str") instanceof String; // true（String 对象实例）
  ```
  **应用场景建议**
  | **场景** | **推荐方法** |
  |------------------------------|--------------------------|
  | 检测基本类型（如 `number`） | `typeof` |
  | 判断数组类型 | `Array.isArray()` |
  | 检测对象是否为特定构造实例 | `instanceof` |
  | 精确判断所有类型（含 `null`）| `Object.prototype.toString.call()` |
  **总结**
- **`typeof`**：快速判断原始类型，但对 `null` 和对象类型区分不足。
- **`instanceof`**：基于原型链判断对象类型，不适用于原始类型，需注意跨环境问题。
- **底层原理**：`instanceof` 通过遍历原型链，检查构造函数 `prototype` 是否存在。

## 71. 引用类型有哪些，有什么特点

| **类型**       | **描述**                           | **示例**                          |
| -------------- | ---------------------------------- | --------------------------------- |
| **`Object`**   | 通用对象，所有引用类型的基类       | `{}`、`new Object()`              |
| **`Array`**    | 有序数据集合，支持索引访问         | `[]`、`new Array()`               |
| **`Function`** | 可执行对象，可创建函数实例         | `function() {}`、`new Function()` |
| **`Date`**     | 日期和时间操作                     | `new Date()`                      |
| **`RegExp`**   | 正则表达式匹配                     | `/pattern/`、`new RegExp()`       |
| **`Map`**      | 键值对集合，键可为任意类型（ES6+） | `new Map()`                       |
| **`Set`**      | 唯一值集合（ES6+）                 | `new Set()`                       |
| **`WeakMap`**  | 弱引用键的 Map（ES6+）             | `new WeakMap()`                   |
| **`WeakSet`**  | 弱引用值的 Set（ES6+）             | `new WeakSet()`                   |
| **自定义对象** | 用户定义的结构化数据               | `class MyClass {}`                |

| **特性**       | **引用类型**                              | **基础类型**             |
| -------------- | ----------------------------------------- | ------------------------ |
| **存储方式**   | 内存地址（堆内存）                        | 直接存储值（栈内存）     |
| **可变性**     | 可动态修改属性                            | 不可变（值本身不可修改） |
| **赋值与比较** | 按引用传递和比较                          | 按值传递和比较           |
| **检测方法**   | `instanceof`、`Object.prototype.toString` | `typeof`、`===`          |

- **引用类型**：通过内存地址引用，支持动态扩展，包含 `Object`、`Array`、`Function` 等。
- **核心特点**：按引用传递、动态可变、`typeof` 检测局限性、原型链继承。
- **应用场景**：结构化数据存储、复杂操作（如 DOM 操作、异步任务管理）。

## 72. 如何得到一个变量的类型---指函数封装实现

```javascript
/**
 * 获取变量的精确类型
 * @param {any} value - 需要检测的变量
 * @returns {string} 小写类型字符串 (如 'null', 'array', 'date')
 */
function getType(value) {
  // 1. 处理特殊类型检测
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  // 2. 基础类型快速判断
  const primitiveType = typeof value
  if (primitiveType !== 'object' && primitiveType !== 'function') {
    return primitiveType
  }

  // 3. 引用类型精确判断
  const typeString = Object.prototype.toString.call(value)

  // 4. 提取并格式化类型
  const type = typeString.slice(8, -1).toLowerCase()

  return type === 'json' ? 'object' : type
}
// 基础类型
console.log(getType(42))               // 'number'
console.log(getType('hello')))         // 'string'
console.log(getType(true)))            // 'boolean'
console.log(getType(null)))            // 'null'
console.log(getType(undefined)))       // 'undefined'
console.log(getType(Symbol())))        // 'symbol'
console.log(getType(10n)))             // 'bigint'

// 引用类型
console.log(getType({})))              // 'object'
console.log(getType([])))              // 'array'
console.log(getType(/regex/)))         // 'regexp'
console.log(getType(new Date)))        // 'date'
console.log(getType(() => {})))        // 'function'
console.log(getType(new Map)))         // 'map'
console.log(getType(new Set)))         // 'set'
console.log(getType(Promise.resolve())))// 'promise'

// 特殊对象
console.log(getType(window)))          // 'window' (浏览器环境)
console.log(getType(document)))        // 'htmldocument'
console.log(getType(document.body)))   // 'htmlbodyelement'
```

## 73. 什么是作用域

**定义与本质**
**作用域（Scope）** 是程序中定义变量的 **可访问性规则**，决定了变量、函数、对象在代码中的 **可见范围**。它规定了代码中不同位置的变量如何被查找和使用，是 JavaScript 引擎管理变量生命周期和访问权限的核心机制。

| **类型**       | **作用范围**                | **声明方式**          | **特点**                                         |
| -------------- | --------------------------- | --------------------- | ------------------------------------------------ |
| **全局作用域** | 整个程序                    | 在函数/块外声明       | 变量在任何地方可访问，易引发污染                 |
| **函数作用域** | 函数内部                    | `var` 声明（ES5）     | 变量在函数内有效，函数外不可访问                 |
| **块级作用域** | `{}` 内部（如 `if`、`for`） | `let`/`const`（ES6+） | 变量仅在块内有效，避免变量泄漏                   |
| **模块作用域** | ES6 模块文件内部            | `export`/`import`     | 变量仅在模块内有效，需显式导出才能被其他模块使用 |

**作用域 vs 执行上下文**
| **维度** | **作用域（Scope）** | **执行上下文（Execution Context）** |
|----------------|--------------------------------------|--------------------------------------|
| **定义** | 变量访问规则 | 代码执行时的环境（包含变量对象、作用域链、this） |
| **创建时机** | 代码编写阶段（词法作用域） | 函数调用时动态创建 |
| **核心内容** | 变量可见性规则 | 变量值、函数调用栈、this 指向 |

## 74. 怎么销毁闭包？

闭包（Closure）是 JavaScript 中函数与其词法作用域（定义时的作用域）绑定的特性。闭包可能导致内存泄漏，因为它们会保留对外部变量的引用，阻止垃圾回收（GC）。以下是销毁闭包的有效方法：
| **方法** | **适用场景** | **操作步骤** |
|-------------------------|----------------------------------|----------------------------------|
| **解除引用** | 所有闭包 | 将闭包函数或变量设为 `null` |
| **释放外部资源** | 闭包持有 DOM/定时器/事件监听器 | 移除监听器、清除定时器、解除 DOM 引用 |
| **避免不必要闭包** | 高频操作（循环、事件） | 使用 `let`/IIFE 隔离作用域 |
| **弱引用** | 管理对象关联数据 | 使用 `WeakMap`/`WeakSet` |
| **模块化隔离** | 长期存在的闭包 | 通过 IIFE 或 ES6 模块限制作用域 |

## 75. *JS*的垃圾回收站机制

JavaScript 的垃圾回收机制（Garbage Collection, GC）旨在自动管理内存，释放不再使用的对象。其核心机制和优化策略如下：
**核心算法**
**1. 标记-清除（Mark-and-Sweep）**

- **原理**：
  - **标记阶段**：从根对象（全局对象、当前函数调用栈、活动作用域等）出发，递归遍历所有可达对象，并标记为“存活”。
  - **清除阶段**：遍历堆内存，回收未被标记的对象内存。
- **优点**：能处理循环引用（两个互相引用的对象若不可达，仍会被回收）。
- **缺点**：可能产生内存碎片。

**2. 引用计数（Reference Counting）**

- **原理**：跟踪每个对象被引用的次数，引用数为 0 时立即回收。
- **缺点**：无法处理循环引用（两个对象互相引用时，引用数永不为 0）。
- **现状**：现代浏览器已弃用，仅在某些旧引擎中保留。

## 77. _new_ 一个构造函数发生了什么

| **步骤**     | **操作**                                | **目的**                         |
| ------------ | --------------------------------------- | -------------------------------- |
| 创建空对象   | `const obj = {}`                        | 初始化对象存储空间               |
| 绑定原型链   | `obj.__proto__ = Constructor.prototype` | 实现原型继承                     |
| 执行构造函数 | `Constructor.call(obj, ...args)`        | 挂载实例属性，绑定 `this`        |
| 处理返回值   | 检查构造函数返回值类型                  | 决定返回新对象还是构造函数返回值 |

## 78. 对一个构造函数实例化后. 它的原型链指向什么

指向由构造函数的 prototype

## 79. 什么是变量提升

代码执行前引擎将变量和函数声明移动到其作用域顶部的过程。
| **声明类型** | **提升行为** | **初始值** | **重复声明** |
|--------------------|----------------------------------|----------------|------------------|
| `var` | 声明提升，赋值保留原位 | `undefined` | 允许 |
| `let` | 声明提升，存在 TDZ | 未初始化 | 禁止 |
| `const` | 声明提升，存在 TDZ | 未初始化 | 禁止 |
| **函数声明** | 整体提升（函数体一并提升） | 函数定义 | 允许（覆盖变量） |
| **函数表达式** | 仅变量声明提升 | `undefined` | 允许 |

## 80. == 和 === 的区别是什么

==（宽松相等）：比较时会进行 类型转换，再判断值是否相等。
===（严格相等）：直接比较 值和类型，不进行类型转换。

## 81. _Object.is_ 方法比较的是什么

---

## **`Object.is` 方法的核心比较规则**

`Object.is` 是 JavaScript 中用于精确比较两个值是否相同的工具方法，其行为与严格相等运算符 `===` 大部分一致，但在处理 **`NaN`** 和 **`±0`** 时有显著差异。

```javascript
// 相同基本值
Object.is(5, 5); // true
Object.is("hello", "hello"); // true

// 类型不同
Object.is(5, "5"); // false

// 特殊值比较
Object.is(NaN, NaN); // true（与 === 不同）
Object.is(+0, -0); // false（与 === 不同）
Object.is(0, -0); // false
Object.is(-0, -0); // true

// 对象比较
const obj = {};
Object.is(obj, obj); // true
Object.is({}, {}); // false（不同引用）
```

| **方法**        | **比较逻辑**               | **特殊值处理**                        | **适用场景**                 |
| --------------- | -------------------------- | ------------------------------------- | ---------------------------- |
| **`Object.is`** | `SameValue` 算法（更严格） | `NaN` 等于自身，区分 `+0` 和 `-0`     | 需要精确比较特殊值           |
| **`===`**       | 严格相等（快速通用）       | `NaN` 不等于自身，不区分 `+0` 和 `-0` | 常规严格比较（推荐默认使用） |

## 82. 基础数据类型和引用数据类型，哪个是保存在栈内存中？哪个是在堆内存中？

基础数据类型 ： 栈内存
引用数据类型 ： 堆内存

## 83. 箭头函数解决了什么问题？

| **问题**            | **解决方案**                                          |
| ------------------- | ----------------------------------------------------- |
| `this` 动态绑定问题 | 箭头函数继承外层 `this`，避免因调用方式导致的指向错误 |
| 语法冗余            | 简洁语法（隐式返回、参数简写）                        |
| 意外构造函数调用    | 禁止通过 `new` 调用，减少错误                         |
| 复杂作用域管理      | 减少对 `bind`、`call`、`apply` 的依赖                 |

## 84. _new_ 一个箭头函数后，它的 _this_ 指向什么？

| **特性**        | **普通函数**               | **箭头函数**                   |
| --------------- | -------------------------- | ------------------------------ |
| **能否 `new`**  | 可以                       | 不可，触发 `TypeError`         |
| **`this` 来源** | 动态绑定（取决于调用方式） | 静态继承（定义时的外层作用域） |
| **`prototype`** | 有                         | 无                             |

- **禁止 `new`**：箭头函数无法实例化对象，设计初衷是简化回调和非构造场景。
- **`this` 不可变**：无论调用方式如何，箭头函数 `this` 始终继承自外层作用域。
- **最佳实践**：仅将箭头函数用于非构造场景（如工具函数、回调），需构造对象时使用普通函数或 `class`。

## 85. _promise_ 的其他方法有用过吗？如 _all、race_。请说下这两者的区别

| **特性**     | **`Promise.all`**                                    | **`Promise.race`**                             |
| ------------ | ---------------------------------------------------- | ---------------------------------------------- |
| **触发条件** | 所有 Promise 都成功时返回结果                        | 第一个成功或失败的 Promise 触发响应            |
| **返回值**   | 成功时返回所有结果的数组（按输入顺序）               | 返回第一个完成的结果（可能是成功或失败）       |
| **失败行为** | 任意一个 Promise 失败，立即返回该失败原因            | 仅响应第一个完成的结果，无论成功或失败         |
| **适用场景** | 需要所有异步操作均完成的场景（如并行请求、数据聚合） | 竞速场景（如超时控制、优先使用最快响应的资源） |

| **方法**                 | **作用**                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| **`Promise.allSettled`** | 等待所有 Promise 完成（无论成功/失败），返回状态和结果数组（ES2020+） |
| **`Promise.any`**        | 返回第一个成功的 Promise，全部失败时抛出聚合错误（ES2021+）           |

## 86. _class_ 是如何实现的

## 88. _ES6_ 中模块化导入和导出与 _common.js_ 有什么区别

## **总结对比表**

| **特性**     | **CommonJS**                    | **ES6**                         |
| ------------ | ------------------------------- | ------------------------------- |
| **值传递**   | 值的拷贝（静态）                | 值的引用（动态绑定）            |
| **加载时机** | 运行时加载（同步）              | 编译时静态分析（支持异步）      |
| **作用域**   | 模块作用域，`this` 指向模块对象 | 严格模式，`this` 为 `undefined` |
| **缓存机制** | 首次加载后缓存                  | 无缓存，动态引用                |
| **语法**     | `require`/`module.exports`      | `import`/`export`               |

## 92. 了解过 _js_ 中 _arguments_ 吗？接收的是实参还是形参？

arguments 对象接收的是函数调用时传入的实参（实际参数），而非形参（形式参数）
arguments 对象捕获的是实参，反映函数调用时的实际输入。
非严格模式下与形参动态绑定，严格模式下独立。
优先使用剩余参数（...args）替代 arguments，代码更简洁安全。
| **特性** | **形参（形式参数）** | **实参（实际参数）** |
|----------------|----------------------------------|----------------------------------|
| **定义** | 函数定义时声明的变量 | 函数调用时实际传入的值 |
| **存储位置** | 函数作用域的局部变量 | `arguments` 对象中 |
| **数量** | 由函数声明决定 | 由调用时传入的参数决定 |
| **动态性** | 固定（除非手动修改） | 动态（可接收任意数量参数） |

## 94. 强制类型转换方法有哪些？

| **目标类型** | **常用方法**             | **适用场景**       | **注意事项**           |
| ------------ | ------------------------ | ------------------ | ---------------------- |
| **数字**     | `Number()`、`parseInt()` | 表单输入、数学运算 | 处理 `NaN` 和进制问题  |
| **字符串**   | `String()`、`toString()` | 数据展示、拼接     | 对象默认转换需谨慎     |
| **布尔值**   | `Boolean()`、`!!`        | 条件判断、逻辑运算 | 明确假值列表           |
| **特殊类型** | `JSON` 方法、日期方法    | 数据存储、接口交互 | 处理循环引用和日期格式 |

## 95. 纯函数

**纯函数（Pure Function）** 是函数式编程中的核心概念，满足以下两个条件：

1. **相同输入始终返回相同输出**（确定性）。
2. **无副作用**（不改变外部状态或依赖外部变量）。

| **维度**       | **纯函数**               | **非纯函数**                 |
| -------------- | ------------------------ | ---------------------------- |
| **输出确定性** | ✅ 输入相同，输出必相同  | ❌ 输出可能变化              |
| **副作用**     | ❌ 无                    | ✅ 可能修改外部状态          |
| **可测试性**   | ✅ 高                    | ❌ 低                        |
| **适用场景**   | 数据处理、计算、状态转换 | I/O 操作、DOM 交互、日志记录 |

## 96. _JS_ 模块化

作用域隔离：避免全局污染，模块间通过接口通信

依赖管理：显式声明依赖关系，便于维护和复用

按需加载：动态导入优化性能 (如路由懒加载)

静态分析：编译时优化 (Tree-shaking、类型检查)

生态统一：ES6 模块成为浏览器和服务端的统一标准

## 97. 看过 _jquery_ 源码吗？

## 98. 说一下 _js_ 中的 _this_

| **规则**       | **触发条件**               | **`this` 指向**                                            | **示例**                                       |
| -------------- | -------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **默认绑定**   | 独立函数调用               | 非严格模式 → `window`/`global` <br> 严格模式 → `undefined` | `function foo() { console.log(this); } foo();` |
| **隐式绑定**   | 通过对象调用方法           | 调用该方法的对象                                           | `obj.foo()` → `this` 指向 `obj`                |
| **显式绑定**   | 使用 `call`/`apply`/`bind` | 绑定的第一个参数                                           | `foo.call(ctx)` → `this` 指向 `ctx`            |
| **`new` 绑定** | 构造函数调用               | 新创建的实例对象                                           | `new Foo()` → `this` 指向新实例                |
| **箭头函数**   | 箭头函数调用               | **继承外层作用域的 `this`**（静态）                        | `const foo = () => { console.log(this); }`     |

| **场景**             | **`this` 指向**         | **代码建议**                        |
| -------------------- | ----------------------- | ----------------------------------- |
| **对象方法**         | 调用方法的对象          | 确保方法通过对象调用（`obj.foo()`） |
| **构造函数**         | 新创建的实例            | 始终使用 `new` 调用                 |
| **异步回调**         | 容易丢失原 `this`       | 使用 `bind` 或箭头函数绑定          |
| **需要灵活绑定**     | 动态指定上下文          | 使用 `call`/`apply`/`bind`          |
| **避免 `this` 污染** | 箭头函数继承外层 `this` | 优先用箭头函数处理回调              |

- **谁调用，`this` 就指向谁**（隐式绑定）。
- **箭头函数无视调用方式，`this` 由外层决定**。
- **显式绑定优先级最高**（`call`/`apply`/`bind`）。

## 100. 手写 _reduce flat_

