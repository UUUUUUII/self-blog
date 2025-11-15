---
title: 面试题4
---

## 401. Fiber架构
将递归的、不可中断的渲染过程，拆解成链表结构的、可中断的纤维节点（Fiber Node）。
React Fiber的核心特点：
- **增量渲染**：将渲染工作分割成多个小任务
- **可中断**：高优先级任务可中断低优先级任务
- **优先级调度**：基于浏览器空闲时间执行任务
- **双向链表结构**：便于任务暂停和恢复

## 402. Hook必须在顶层作用域的原因
根本原因在于 React 内部通过“调用顺序”来管理 Hook 状态。

在函数组件中，React 使用一个单向链表来存储所有 Hook。每次组件渲染时，它会按 Hook 的调用顺序依次遍历这个链表。

如果 Hook 被放在条件语句或循环中，多次渲染间的 Hook 调用顺序就会不一致，导致 React 无法正确地将状态与其对应的 Hook 关联起来，从而引发难以追踪的 Bug。

- React依赖Hook的调用顺序来正确关联状态
- 条件渲染会导致Hook调用顺序不一致
- 保证组件在多次渲染间状态的一致性

## 403. React任务优先级与存储
**优先级等级：**
- Immediate：用户输入、动画等
- UserBlocking：数据获取
- Normal：普通更新
- Low：可延迟的任务

**存储机制：**
- Fiber节点包含state、props、effect等
- 双缓存技术：current树和workInProgress树
- 状态更新时创建新的Fiber树

## 404. Diff算法同级比较
```javascript
// 旧: A B C E
// 新: F A B E

// Diff过程：
1. 比较A和F -> 不同，删除A，创建F
2. 比较B和A -> 不同，删除B，创建A  
3. 比较C和B -> 不同，删除C，创建B
4. 比较E和E -> 相同，复用

// 优化方案：使用key
// 旧: <div key="A">A</div><div key="B">B</div>...
// 新: <div key="F">F</div><div key="A">A</div>...
// 通过key匹配可以复用A、B节点
```

## 405. 原型链，let a=1，原型链上找的到吗?a.number可以执行吗?为什么?
原型链是 JavaScript 中实现继承的机制。每个对象都有一个内部属性 `[[Prototype]]`（可通过 `__proto__` 或 `Object.getPrototypeOf()` 访问），当访问对象的属性时，如果对象本身没有该属性，就会沿着原型链向上查找。

```javascript
let a = 1;
```

这里的 `a` 是一个**原始值（primitive value）**，不是对象。原始值包括：
- `number`（如 `1`）
- `string`（如 `"hello"`）
- `boolean`（如 `true`）
- `undefined`
- `null`
- `symbol`
- `bigint`

原型链上能找到 `a` 吗？**不能**：

- `a` 是变量标识符，不是对象的属性
- 原型链是**对象之间**的继承关系，而 `a` 是原始值，本身没有原型链
- 变量存在于**作用域**中，而不是原型链中

```javascript
let a = 1;
console.log(a.number); // 输出：undefined
```

**可以执行**，但返回 `undefined`，原因如下：
1. 当对原始值访问属性时，JavaScript 会**临时**将其转换为对应的包装对象
2. 对于数字 `1`，会临时创建 `Number` 对象
3. 然后在 `Number` 对象的原型链上查找 `number` 属性
```
a (原始值) 
→ 临时 Number 对象 
  → Number.prototype 
    → Object.prototype 
      → null
```
```javascript
let a = 1;

// 可以访问，但返回 undefined
console.log(a.number); // undefined

// 可以访问 Number 原型上的方法
console.log(a.toString()); // "1"
console.log(a.toFixed(2)); // "1.00"

// 证明临时包装对象的存在
console.log(a.__proto__ === Number.prototype); // true（不推荐使用 __proto__）
console.log(Object.getPrototypeOf(a) === Number.prototype); // true
```

| 问题 | 答案 | 原因 |
|------|------|------|
| 原型链上能找到 `a` 吗？ | 不能 | `a` 是变量，不是对象属性 |
| `a.number` 可以执行吗？ | 可以 | 原始值会被临时包装为对象 |
| 为什么返回 `undefined`？ | 原型链上没有 `number` 属性 | 在 `Number.prototype` 上找不到该属性 |

**关键点**：JavaScript 对原始值的属性访问会进行**自动装箱（autoboxing）**，临时将其转换为对应的包装对象，然后在包装对象的原型链上进行属性查找。

## 406 TS interface type 
### 相同点
1. **都可以定义对象类型** - 描述对象的形状和结构
2. **都支持函数类型** - 定义函数的参数和返回值类型
3. **都支持扩展** - 可以通过继承或交叉类型进行组合
4. **都支持泛型** - 可以参数化类型
5. **都支持索引签名** - 定义动态属性
6. **都支持只读修饰符** - 使用 `readonly` 关键字
7. **在大多数情况下可以互换使用** - 对于对象类型定义功能相似

### 不同点
1. **语法不同** - `interface` 使用 `interface` 关键字，`type` 使用 `type` 关键字
2. **扩展方式** - `interface` 使用 `extends`，`type` 使用 `&`（交叉类型）
3. **合并声明** - `interface` 支持声明合并，`type` 不支持
4. **实现方式** - 类只能 `implements` `interface`，不能 `implements` `type`
5. **类型范围** - `type` 可以定义更广泛的类型（联合类型、元组、原始类型等）
6. **性能考虑** - `interface` 在大型项目中可能有更好的性能表现
7. **错误信息** - 使用 `interface` 时错误信息可能更友好
8. **递归引用** - `type` 在递归类型定义中更灵活