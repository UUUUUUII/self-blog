---
title: 算法
---

## 1. 平铺数据转树形结构
```javascript
interface IStructure {
  id: string;
  parentId: string | null;
  name: string;
  children: IStructure[];
}

export const convertToTree = (list: IStructure[]) => {
  const map: Record<string, IStructure> = list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, IStructure>);
  const result: IStructure[] = [];
  for (const key in map) {
    //ESLint for in 中的逻辑应该包裹在if中
    if (Object.hasOwn(map, key)) {
      const item = map[key];
      if (item.parentId === "0" || !item.parentId) {
        result.push(item);
      } else {
        const parent = map[item.parentId];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(item);
        }
      }
    }
    return { business: result, nodeMap: map };
  }
};

//递归实现
const convertToTree = (list) => {
  if (list.length === 0) return [];
  let res=[];
  list.forEach((v) => {
    if (!v.parentId) {
      res.push({
        id: v.id,
        name: v.name,
        children: [],
      });
    }
  });
  const findValues = (parentId) => {
    if (!parentId) return [];
    return list
      .map((v) => {
        if (v.parentId === parentId) {
          return {
            id: v.id,
            name: v.name,
            children: findValues(v.id),
          };
        }
        return null;
      })
      .filter(Boolean);
  };
  for (let i = 0; i < res.length; i++) {
    res[i].children = findValues(res[i].id);
  }
  return res;
};
```
## 2. 扁平化数组
```javascript
const flatArray = (array) => {
  if (!Array.isArray(array)) return;
  const res = [];
  const _flatArray = (arr) => {
    for (const element of arr) {
      if (Array.isArray(element)) {
        _flatArray(element);
      } else {
        res.push(element);
      }
    }
  };
  _flatArray(array);
  return res;
};
```
## 3. 二叉树的层序遍历
```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    // 遍历当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      // 将下一层的节点加入队列
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

console.log(levelOrder(new TreeNode(1, new TreeNode(2), new TreeNode(3))));
```
## 4. 无重复字符的最长子串
```javascript
const lengthOfLongestSubstring = (s) => {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  let start = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      start = left;
    }
  }
  const str = s.substring(start, start + maxLen);
  return str;
};

console.log(lengthOfLongestSubstring("bcacbdefaaf"));
```
## 5. 动态规划
```javascript
/**
 * 
 * @param {*} coins 硬币数组
 * @param {*} amount 金额
 * @returns 凑成金额所需的最少硬币数
 * @description
 * 输入: coins = [1, 2, 5], amount = 11
输出: 3
解释: 11 = 5 + 5 + 1
 */
function coinChange(coins, amount) {
  // dp[i] 表示凑成金额 i 所需的最少硬币数
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 金额为 0 需要 0 个硬币

  // 遍历所有金额
  for (let i = 1; i <= amount; i++) {
    // 尝试每种硬币
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));

//最长递增子序列（LIS）
function lengthOfLIS_WithPath(nums) {
  if (nums.length === 0) return [];

  const n = nums.length;
  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1); // 记录前驱索引

  let maxLen = 1;
  let maxIndex = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j; // 记录 i 的前驱是 j
      }
    }
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIndex = i;
    }
  }
  console.log(prev,maxIndex);

  // 回溯路径
  const result = [];
  let curr = maxIndex;
  while (curr !== -1) {
    result.unshift(nums[curr]);
    curr = prev[curr];
    console.log(result, curr);
  }

  return result;
}
console.log(lengthOfLIS_WithPath([10, 9, 2, 5, 3, 7, 101, 18]));
```

## 6. 接雨水
```javascript
/**
 * @param {number[]} height
 * @return {number}
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
 */
function trap(height) {
  if (height.length === 0) return 0;

  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      // 左边较低，处理左边
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      // 右边较低，处理右边
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }

  return water;
}

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));
```

## 7. 前 K 个高频元素
```javascript
// 给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。
// 可以按任意顺序返回答案。
function topKFrequent(nums, k) {
  const freqMap = new Map();

  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, frequency] of freqMap) {
    buckets[frequency].push(num);
  }

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3, 3], 2));
```

## 8. 合并区间
```javascript
// 以数组 intervals 表示若干个区间的集合，其中单个区间为 [start, end]。
// 合并所有重叠的区间，并返回一个不重叠的区间数组。
function merge(intervals) {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }

  return result;
}

console.log(
  merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ]),
);
```

## 9. 单词拆分
```javascript
// 给你一个字符串 s 和一个字符串列表 wordDict 作为字典，
// 判断是否可以利用字典中的单词拼接出 s。字典中的单词可以重复使用。
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const n = s.length;

  // dp[i] 表示 s[0...i - 1] 是否可以被拆分
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      // 如果前缀可以被拆分，且 s[j...i - 1] 在字典中
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[n];
}

console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));
```

## 10. 数组扁平化
```javascript
const arr = [1, 2, [3, 4, 5, [6, 7, 8], 9], 10, [11, 12]];

const flatArray = (array) => {
  if (Array.isArray(array)) {
    let result = [];

    for (const element of array) {
      if (Array.isArray(element)) {
        result = result.concat(flatArray(element));
      } else {
        result.push(element);
      }
    }

    return result;
  }

  return array;
};

console.log(flatArray(arr));
console.log(arr.flat(Infinity));
```

## 11. 计算数列第 N 个位置的值
```javascript
/**
 * 数列前 M 项为 1 到 M：
 * - 前 M 项存在重复值时，新值为窗口最大值与最小值之和
 * - 前 M 项不存在重复值时，新值为窗口最大值与最小值之差
 *
 * @param {number} m 窗口大小，3 <= m <= 10
 * @param {number} n 要计算的位置，1 <= n <= 50
 * @returns {number}
 */
function getSequenceValue(m, n) {
  if (!Number.isInteger(m) || m < 3 || m > 10) {
    throw new RangeError("m must be an integer between 3 and 10");
  }
  if (!Number.isInteger(n) || n < 1 || n > 50) {
    throw new RangeError("n must be an integer between 1 and 50");
  }

  const sequence = Array.from({ length: m }, (_, index) => index + 1);

  for (let position = m; position < n; position++) {
    const window = sequence.slice(position - m, position);
    const uniqueValues = new Set(window);
    const min = Math.min(...window);
    const max = Math.max(...window);
    const nextValue = uniqueValues.size < m ? max + min : max - min;

    sequence.push(nextValue);
  }

  return sequence[n - 1];
}

console.log(getSequenceValue(5, 1)); // 1
console.log(getSequenceValue(5, 5)); // 5
console.log(getSequenceValue(5, 6)); // 4
console.log(getSequenceValue(5, 7)); // 7
console.log(getSequenceValue(5, 8)); // 10
```

## 12. 勇攀数字高峰
```javascript
/**
 * 在数字地图中，从唯一最低点走到唯一最高点，计算所有可行路径的数量。
 *
 * 规则：
 * - 每次只能向上、下、左、右移动
 * - 下一格的高度必须更高
 * - 相邻两格的高度差必须大于 0 且不超过 maxDiff
 *
 * 坐标格式为 [行号, 列号]，并且从 0 开始计数。
 * 例如 heights[1][0] 表示第 1 行、第 0 列的高度。
 *
 * @param {number[][]} heights 数字地形图
 * @param {number} maxDiff 单步允许的最大高度差
 * @returns {number} 可行路径数量
 */
function countMountainPaths(heights, maxDiff) {
  const rows = heights.length;
  const cols = heights[0].length;

  let start = [0, 0];
  let peak = [0, 0];

  // 找到最低点和最高点的坐标
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (heights[row][col] < heights[start[0]][start[1]]) {
        start = [row, col];
      }

      if (heights[row][col] > heights[peak[0]][peak[1]]) {
        peak = [row, col];
      }
    }
  }

  const directions = [
    [-1, 0], // 上
    [1, 0],  // 下
    [0, -1], // 左
    [0, 1],  // 右
  ];

  // memo[row][col] 表示从当前位置到最高点的路径数量
  const memo = Array.from(
    { length: rows },
    () => Array(cols).fill(-1),
  );

  function dfs(row, col) {
    // 到达最高点，表示找到一条完整路径
    if (row === peak[0] && col === peak[1]) {
      return 1;
    }

    if (memo[row][col] !== -1) {
      return memo[row][col];
    }

    let count = 0;

    for (const [rowOffset, colOffset] of directions) {
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      // 越界时不能移动
      if (
        nextRow < 0 ||
        nextRow >= rows ||
        nextCol < 0 ||
        nextCol >= cols
      ) {
        continue;
      }

      const heightDiff =
        heights[nextRow][nextCol] - heights[row][col];

      // 必须严格变高，并且高度差不能超过限制
      if (heightDiff > 0 && heightDiff <= maxDiff) {
        count += dfs(nextRow, nextCol);
      }
    }

    memo[row][col] = count;
    return count;
  }

  return dfs(start[0], start[1]);
}

console.log(countMountainPaths([[1, 2], [3, 5]], 2));
// 1，路径：1 -> 3 -> 5

console.log(countMountainPaths([[4, 3], [3, 2]], 1));
// 2

console.log(countMountainPaths([[1, 3], [3, 4]], 1));
// 0，1 到 3 的高度差为 2，超过限制
```

## 13. 准备生日礼物
```javascript
/**
 * 统计指定月份需要准备的生日礼物数量。
 * 同一员工重复录入时，以最后一次录入的生日为准。
 *
 * @param {number} month 要发放礼物的月份，范围为 1 到 12
 * @param {string[]} employees 员工姓名列表
 * @param {string[]} birthdays 与员工一一对应的生日列表，格式为 Year/Month/Day
 * @returns {number} 需要准备的礼物数量
 */
function countBirthdayGifts(month, employees, birthdays) {
  const birthdayMonthByEmployee = new Map();

  for (let i = 0; i < employees.length; i++) {
    const birthdayMonth = Number(birthdays[i].split("/")[1]);
    birthdayMonthByEmployee.set(employees[i], birthdayMonth);
  }

  let count = 0;
  for (const birthdayMonth of birthdayMonthByEmployee.values()) {
    if (birthdayMonth === month) {
      count++;
    }
  }

  return count;
}

console.log(
  countBirthdayGifts(
    5,
    ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],
    ["1985/5/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"],
  ),
); // 3

console.log(
  countBirthdayGifts(
    10,
    ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],
    ["1985/05/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/10/13", "2010/10/13", "2015/10/14", "2020/10/15"],
  ),
); // 6

console.log(
  countBirthdayGifts(
    5,
    ["Alice", "Bob", "Charlie", "Alice", "Eve", "Frank", "Grace", "Helen"],
    ["1985/5/10", "1990/10/11", "1995/10/11", "1985/7/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"],
  ),
); // 2，Alice 最后一次录入的生日月份为 7 月
```

## 14. 配置操作失败数量统计
**正则版本**
```javascript
function countFailedConfigOperationsWithRegex(input) {
  const rules = new Map();
  let failures = 0;

  for (const [, command] of input.matchAll(/\[([^\]]*)\]/g)) {
    const [operation, ...argumentsList] = command.trim().split(/\s+/);
    const params = new Map();
    let valid = true;

    for (const argument of argumentsList) {
      const separatorIndex = argument.indexOf("=");
      if (separatorIndex <= 0 || separatorIndex === argument.length - 1) {
        valid = false;
        break;
      }

      const key = argument.slice(0, separatorIndex);
      const value = argument.slice(separatorIndex + 1);
      if (
        (key !== "rule_id" && key !== "rule_index") ||
        params.has(key) ||
        !/^\d+$/.test(value)
      ) {
        valid = false;
        break;
      }

      const number = Number(value);
      if (number < 1 || number > 9999) {
        valid = false;
        break;
      }
      params.set(key, number);
    }

    if (!valid) {
      failures++;
      continue;
    }

    const ruleId = params.get("rule_id");
    const ruleIndex = params.get("rule_index");

    if (operation === "add_rule") {
      if (!params.has("rule_id") || !params.has("rule_index") || rules.has(ruleId)) {
        failures++;
      } else {
        rules.set(ruleId, ruleIndex);
      }
    } else if (operation === "mod_rule") {
      if (
        !params.has("rule_id") ||
        !params.has("rule_index") ||
        !rules.has(ruleId) ||
        rules.get(ruleId) === ruleIndex
      ) {
        failures++;
      } else {
        rules.set(ruleId, ruleIndex);
      }
    } else if (operation === "del_rule") {
      if (!params.has("rule_id") || !rules.has(ruleId)) {
        failures++;
      } else {
        rules.delete(ruleId);
      }
    } else {
      failures++;
    }
  }

  return failures;
}

console.log(
  countFailedConfigOperationsWithRegex(
    "[add_rule rule_id=1 rule_index=9999][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]",
  ),
); // 0

console.log(
  countFailedConfigOperationsWithRegex(
    "[add_rule rule_id=1][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]",
  ),
); // 3

console.log(
  countFailedConfigOperationsWithRegex("[add_rule rule_id=1 rule_index=10000]"),
); // 1
```

正则版本用正则提取命令、拆分空白字符并检查数字格式。

**不用正则版本**
```javascript
/**
 * 依次执行批量配置命令，并统计失败次数。
 *
 * @param {string} input 格式为 [cmd][cmd]... 的批量命令字符串
 * @returns {number} 配置操作失败次数
 */
function countFailedConfigOperations(input) {
  const commands = input.replaceAll("[", "").split("]").filter(Boolean);
  const rules = new Map();
  let failures = 0;

  for (const command of commands) {
    const [operation, ...argumentsList] = command.trim().split(" ").filter(Boolean);
    const params = new Map();
    let valid = true;

    for (const argument of argumentsList) {
      const parts = argument.split("=");
      if (parts.length !== 2) {
        valid = false;
        break;
      }

      const [key, value] = parts;
      const number = parseRuleValue(value);
      if (
        (key !== "rule_id" && key !== "rule_index") ||
        params.has(key) ||
        number === null
      ) {
        valid = false;
        break;
      }

      params.set(key, number);
    }

    if (!valid) {
      failures++;
      continue;
    }

    const ruleId = params.get("rule_id");
    const ruleIndex = params.get("rule_index");

    switch (operation) {
      case "add_rule":
        if (!params.has("rule_id") || !params.has("rule_index") || rules.has(ruleId)) {
          failures++;
        } else {
          rules.set(ruleId, ruleIndex);
        }
        break;
      case "mod_rule":
        if (
          !params.has("rule_id") ||
          !params.has("rule_index") ||
          !rules.has(ruleId) ||
          rules.get(ruleId) === ruleIndex
        ) {
          failures++;
        } else {
          rules.set(ruleId, ruleIndex);
        }
        break;
      case "del_rule":
        if (!params.has("rule_id") || !rules.has(ruleId)) {
          failures++;
        } else {
          rules.delete(ruleId);
        }
        break;
      default:
        failures++;
    }
  }

  return failures;
}

function parseRuleValue(value) {
  if (!value) return null;

  let number = 0;
  for (const character of value) {
    if (character < "0" || character > "9") return null;
    number = number * 10 + Number(character);
    if (number > 9999) return null;
  }

  return number > 0 ? number : null;
}

console.log(
  countFailedConfigOperations(
    "[add_rule rule_id=1 rule_index=9999][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]",
  ),
); // 0

console.log(
  countFailedConfigOperations(
    "[add_rule rule_id=1][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]",
  ),
); // 3

console.log(
  countFailedConfigOperations("[add_rule rule_id=1 rule_index=10000]"),
); // 1
```

## 15. 直捣黄龙
```javascript
/**
 * 统计避开哨兵警戒范围后，从入口到司令部的最短路径条数和长度。
 * 路径长度按经过的格子数计算，包含起点和终点。
 *
 * @param {number} n 敌营矩阵边长，n 为大于 1 的奇数且小于 30
 * @param {{ x: number, y: number }[]} sentries 哨兵位置列表
 * @returns {[number, number]} [最短路径条数, 最短路径长度]
 */
function countShortestSafePaths(n, sentries) {
  const blocked = Array.from({ length: n }, () => Array(n).fill(false));

  // blocked[x][y] 为 true 表示该位置处在哨兵的警戒范围内，角色不能进入。
  // 先把所有哨兵的警戒范围合并到同一张矩阵中；多个范围重叠也只需标记一次。
  for (const { x, y } of sentries) {
    // x 表示行，y 表示列。范围从哨兵坐标前后各扩展一格。
    // 使用 Math.max / Math.min 截断边界，避免访问矩阵之外的位置。
    for (let row = Math.max(0, x - 1); row <= Math.min(n - 1, x + 1); row++) {
      for (let col = Math.max(0, y - 1); col <= Math.min(n - 1, y + 1); col++) {
        blocked[row][col] = true;
      }
    }
  }

  const middle = Math.floor(n / 2);
  // n 是奇数，因此中间列下标为 n / 2（向下取整）。入口和终点位于该列的两端。
  const start = [0, middle];
  const destination = [n - 1, middle];
  // 起点或终点也在任意哨兵的警戒范围内时，角色无法完成任务。
  if (blocked[start[0]][start[1]] || blocked[destination[0]][destination[1]]) {
    return [0, 0];
  }

  // distance[x][y] 保存从入口到该格子的最短路径长度，按经过的格子数计数。
  // distance 为 0 表示尚未访问；起点长度设为 1，所以结果包含起点和终点。
  const distance = Array.from({ length: n }, () => Array(n).fill(0));
  // ways[x][y] 保存所有到达该格子的最短路径条数。
  const ways = Array.from({ length: n }, () => Array(n).fill(0));

  // BFS 队列按“先近后远”的顺序处理格子；head 代替 shift，避免反复移动数组元素。
  const queue = [start];
  // 每次行动只能沿上下左右移动一格，不允许斜向移动。
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  distance[start[0]][start[1]] = 1;
  // 到达入口只有一种空的起始选择，因此初始路径数为 1。
  ways[start[0]][start[1]] = 1;

  for (let head = 0; head < queue.length; head++) {
    const [row, col] = queue[head];

    for (const [rowOffset, colOffset] of directions) {
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      // 越界或进入警戒格都不是合法移动，跳过该方向。
      if (
        nextRow < 0 || nextRow >= n ||
        nextCol < 0 || nextCol >= n ||
        blocked[nextRow][nextCol]
      ) {
        continue;
      }

      const nextDistance = distance[row][col] + 1;
      // 首次到达该格：BFS 保证这是最短距离，继承当前格的最短路径数并入队。
      if (distance[nextRow][nextCol] === 0) {
        distance[nextRow][nextCol] = nextDistance;
        ways[nextRow][nextCol] = ways[row][col];
        queue.push([nextRow, nextCol]);
      // 再次以同样的最短距离到达：发现了另一条最短路径，只累加路径数。
      } else if (distance[nextRow][nextCol] === nextDistance) {
        ways[nextRow][nextCol] += ways[row][col];
      }
    }
  }

  // 终点不可达时 distance 和 ways 都仍为 0；否则返回最短路径条数及其格子数。
  return [ways[destination[0]][destination[1]], distance[destination[0]][destination[1]]];
}

console.log(countShortestSafePaths(3, [{ x: 1, y: 1 }])); // [0, 0]
console.log(countShortestSafePaths(5, [{ x: 2, y: 1 }])); // [1, 7]
console.log(countShortestSafePaths(5, [{ x: 2, y: 2 }])); // [2, 9]
```

## 16. API 请求日志去重分析
```javascript
/**
 * 合并相邻的相同请求路径，并统计每组请求的数量和平均响应时间。
 *
 * @param {string[]} paths 按时间顺序排列的请求路径
 * @param {number[]} responseTimes 与请求路径一一对应的响应时间
 * @returns {number[][]} 每组的 [首次出现索引, 连续次数, 平均响应时间]
 */
function mergeAdjacentApiLogs(paths, responseTimes) {
  if (paths.length === 0) return [];

  const result = [];
  let groupStart = 0;
  let responseTimeSum = responseTimes[0];

  for (let i = 1; i < paths.length; i++) {
    if (paths[i] === paths[i - 1]) {
      responseTimeSum += responseTimes[i];
      continue;
    }

    const count = i - groupStart;
    result.push([groupStart, count, Math.floor(responseTimeSum / count)]);
    groupStart = i;
    responseTimeSum = responseTimes[i];
  }

  const count = paths.length - groupStart;
  result.push([groupStart, count, Math.floor(responseTimeSum / count)]);

  return result;
}

console.log(
  mergeAdjacentApiLogs(
    ["/api/user", "/api/user", "/api/order", "/api/user", "/api/order", "/api/order"],
    [100, 200, 150, 300, 250, 350],
  ),
); // [[0, 2, 150], [2, 1, 150], [3, 1, 300], [4, 2, 300]]

console.log(
  mergeAdjacentApiLogs(
    ["/api/login", "/api/login", "/api/login", "/api/login"],
    [50, 60, 70, 80],
  ),
); // [[0, 4, 65]]

console.log(
  mergeAdjacentApiLogs(["/api/a", "/api/b", "/api/c"], [100, 200, 300]),
); // [[0, 1, 100], [1, 1, 200], [2, 1, 300]]
console.log(mergeAdjacentApiLogs([], [])); // []
```

按顺序扫描日志，路径发生变化时结算上一组，因此相同路径被其他路径分隔后会分别统计。时间复杂度为 `O(n)`，除输出结果外的额外空间复杂度为 `O(1)`。

## 17. 失灵的键盘
```javascript
/**
 * 根据键盘输出还原按键次数，并按次数降序、原按键字符升序返回。
 * uu 还原为一次 j，tt 还原为一次 b；其它字符各还原为对应按键。
 *
 * @param {string} input 屏幕上输出的字符串，不包含 b 和 j
 * @returns {number[][]} 每项为 [按键转义值, 按键次数]
 */
function analyzeBrokenKeyboard(input) {
  const counts = new Map();

  for (let index = 0; index < input.length;) {
    const character = input[index];
    let key = character;

    if (
      (character === "u" || character === "t") &&
      input[index + 1] === character
    ) {
      key = character === "u" ? "j" : "b";
      index += 2;
    } else {
      index++;
    }

    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts, ([key, count]) => [key, count])
    .sort((a, b) => b[1] - a[1] || a[0].charCodeAt(0) - b[0].charCodeAt(0))
    .map(([key, count]) => {
      const escapedKey = key >= "0" && key <= "9"
        ? Number(key)
        : key.charCodeAt(0) - "a".charCodeAt(0) + 10;
      return [escapedKey, count];
    });
}

console.log(analyzeBrokenKeyboard("t")); // [[29, 1]]
console.log(analyzeBrokenKeyboard("uuuua")); // [[19, 2], [10, 1]]
console.log(analyzeBrokenKeyboard("tttt")); // [[11, 2]]，两次按下 b
console.log(analyzeBrokenKeyboard("a1")); // [[1, 1], [10, 1]]，次数相同按原字符升序
console.log(analyzeBrokenKeyboard("")); // []
```

从左到右扫描时，遇到 `uu` 或 `tt` 就消费两个字符并记为一次失灵键；题目约束保证这种贪心解析唯一。排序使用还原后的原按键字符作为次级排序条件，再将按键转换为输出值。时间复杂度为 `O(n + k log k)`，其中 `n` 为字符串长度、`k` 为实际按键种类数；空间复杂度为 `O(k)`。

## 18. 小猫钓鱼
```javascript
/**
 * 模拟两名玩家的小猫钓鱼游戏。
 * 收牌后按桌面从底到顶的顺序，将整摞牌放到当前玩家手牌队列末尾。
 *
 * @param {number[]} playerA 甲的初始牌队列
 * @param {number[]} playerB 乙的初始牌队列
 * @returns {number} 获胜方手牌队首牌，或平局时桌面最上方的牌
 */
function playCatFishing(playerA, playerB) {
  // 用数组保存手牌，并用 head 指向下一张待出的牌。
  // 已出过的牌留在数组前部，不需要每次都 shift 移动剩余元素。
  const players = [
    { cards: [...playerA], head: 0 },
    { cards: [...playerB], head: 0 },
  ];
  // 桌面数组从左到右表示从底到顶，最后一个元素就是桌面最上方的牌。
  let table = [];
  // 0 表示甲，1 表示乙；收牌后当前玩家继续，未收牌才轮到另一方。
  let currentPlayer = 0;
  // 统计已经实际打出的牌数，用于限制模拟步数。
  let playCount = 0;

  while (true) {
    const player = players[currentPlayer];
    const opponent = players[1 - currentPlayer];

    // 游戏结束条件发生在回合开始时，因此先检查当前玩家是否还有牌。
    if (player.head === player.cards.length) {
      // 双方都没有手牌时平局；按照题意，桌面有牌则返回桌面顶牌。
      if (opponent.head === opponent.cards.length) {
        return table[table.length - 1] ?? 0;
      }
      // 当前玩家无牌而对手有牌，对手获胜，返回对手手牌队首。
      return opponent.cards[opponent.head];
    }

    // 已完成 10000 次出牌且游戏仍未结束，按平局处理。
    // 空桌时没有“桌面顶牌”，使用空值合并运算符返回 0。
    if (playCount === 10000) {
      return table[table.length - 1] ?? 0;
    }

    // 取出队首牌：head 前移代表这张牌已从玩家手牌中打出。
    const card = player.cards[player.head++];
    playCount++;
    // 新出的牌放在桌面最上方。
    table.push(card);

    // -1 表示本次出牌没有触发收牌；否则记录收牌区间的起始下标。
    let captureStart = -1;
    if (card === 11 && table.length > 1) {
      // 11 代表 J。桌面此时至少有一张之前的牌，J 收走整桌，包含刚出的 J。
      // 先判断 J 特效，因此它不会再按普通同点数规则处理。
      captureStart = 0;
    } else if (card !== 11) {
      // 普通牌从新牌前一张开始向桌底查找，找到最近的同点数牌即停止。
      // 这样多次出现相同点数时，只收走最近匹配牌到桌面顶部的这一段。
      for (let index = table.length - 2; index >= 0; index--) {
        if (table[index] === card) {
          captureStart = index;
          break;
        }
      }
    }

    if (captureStart !== -1) {
      // splice 按桌面由底到顶的顺序取出收牌区间。
      const capturedCards = table.splice(captureStart);
      // 整摞牌翻面后成为手牌队列末尾；数组顺序保持不变。
      player.cards.push(...capturedCards);
    } else {
      // 没收牌时轮换出牌方；若刚才收了牌，则 currentPlayer 保持不变。
      currentPlayer = 1 - currentPlayer;
    }
  }
}

console.log(playCatFishing([1, 2], [10, 12])); // 12，平局时桌面顶牌
console.log(playCatFishing([1, 2], [1, 2])); // 1，甲获胜时的手牌队首
console.log(playCatFishing([1, 2, 11, 4], [10, 12, 2, 1])); // 12，甲获胜时的手牌队首
```

每个玩家用数组和队首索引表示手牌，出牌只移动索引，收牌则将桌面对应部分追加到当前玩家队尾。桌面从左到右表示从底到顶；普通收牌从最近的同点数牌开始，J 在桌面非空时收走整桌牌。令 `T` 为出牌次数上限、`n` 为每位玩家初始牌数，时间复杂度为 `O(Tn)`，空间复杂度为 `O(T + n)`。

## 19. 8 位 LED 控制器
```javascript
/**
 * 按顺序执行 LED 点亮、熄灭和切换指令，返回最终状态对应的整数。
 * 每条指令由操作符和 LED 编号组成，例如 L0、D3、T7。
 *
 * @param {string} instructions 指令字符串
 * @returns {number} 8 位 LED 状态对应的整数
 */
function controlLeds(instructions) {
  let state = 0;

  for (let index = 0; index < instructions.length; index += 2) {
    const operation = instructions[index];
    const ledIndex = instructions.charCodeAt(index + 1) - "0".charCodeAt(0);

    if (!Number.isInteger(ledIndex) || ledIndex < 0 || ledIndex > 7) {
      throw new RangeError("LED index must be between 0 and 7");
    }

    const mask = 1 << ledIndex;
    switch (operation) {
      case "L":
        state |= mask;
        break;
      case "D":
        state &= ~mask;
        break;
      case "T":
        state ^= mask;
        break;
      default:
        throw new TypeError(`Unknown LED operation: ${operation}`);
    }
  }

  return state;
}

console.log(controlLeds("L0L1L2D1")); // 5
console.log(controlLeds("L0L1L2T1")); // 5
console.log(controlLeds("L0L1L2L3L4L5L6L7")); // 255
console.log(controlLeds("")); // 0
```

`1 << x` 生成第 `x` 位为 1 的掩码。点亮用按位或 `|` 将目标位设为 1；熄灭用按位与 `& ~mask` 将目标位清零；切换用按位异或 `^` 翻转目标位。每条指令只处理一次，时间复杂度为 `O(n)`，额外空间复杂度为 `O(1)`，其中 `n` 为指令字符串长度。

## 20. 分辨率排序
```javascript
/**
 * 按清晰度、像素面积和宽度从大到小排序分辨率。
 * 清晰度只在宽、高同时达到对应标准时匹配，不交换宽高。
 *
 * @param {string} input 空格分隔的“宽x高”字符串
 * @returns {string} 排序后的分辨率字符串
 */
function sortResolutions(input) {
  const qualityThresholds = [
    { width: 3840, height: 2160, level: 3 },
    { width: 2560, height: 1440, level: 2 },
    { width: 1920, height: 1080, level: 1 },
  ];
  const resolytionList = input.split(" ");
  const res = resolytionList
    .map((item) => {
      const [w, h] = item.split("x");
      const getLevel =
        qualityThresholds.find(
          (v) => parseInt(w) >= v.width && parseInt(h) >= v.height,
        )?.level || 0;
      return {
        level: getLevel,
        value: item,
        area: parseInt(w) * parseInt(h),
        w: parseInt(w),
        h: parseInt(h),
      };
    })
    .sort((a, b) => b.level - a.leveel || b.area - a.area || b.w - a.w);
  return res.reduce((a, c) => (a = a + " " + c.value), "");
}

console.log(
  sortResolutions("3840x2160 3840x2161 3840x1080 2560x1440 1920x1080 1x1"),
); // 3840x2161 3840x2160 2560x1440 3840x1080 1920x1080 1x1

console.log(sortResolutions("2560x1440 4000x5000 5000x4000"));
// 5000x4000 4000x5000 2560x1440
console.log(sortResolutions("2600x1400 2500x3200"));
// 2500x3200 2600x1400：两者都是 1080P，按面积排序
```

先判断是否同时达到 4K、2K、1080P 的宽高门槛；都不满足时归入 720P 档。随后按清晰度档位、面积、宽度依次降序比较。时间复杂度为 `O(n log n)`，除排序所需数据外的空间复杂度为 `O(n)`。

## 21. Wi-Fi 网络规划
```javascript
/**
 * 用最少数量的 AP 覆盖所有空地，且任意两个 AP 的 3*3 覆盖区域不能重叠。
 * AP 只能放在空地上；越过网格边界的覆盖部分不计入网格。
 *
 * @param {(string[] | string)[]} inputGrid 由 '.' 和 '#' 组成的矩阵，也支持每行是字符串
 * @returns {number} 最少 AP 数量；无解或空网格时返回 -1
 */
function minWifiAccessPoints(inputGrid) {
  // 空数组没有任何网格行，按题意作为无效空输入处理。
  if (!Array.isArray(inputGrid) || inputGrid.length === 0) return -1;

  // 允许两种输入：[['.', '#'], ...] 字符矩阵，或 [".#", ...] 字符串行。
  // 字符串行转换成字符数组，后续逻辑只处理统一的二维数组格式。
  const grid = inputGrid.map((row) =>
    typeof row === "string" ? Array.from(row) : row,
  );
  // 转换后每一行都必须是数组，否则无法安全读取行列。
  if (!grid.every(Array.isArray)) return -1;

  // 网格必须至少有一列，且每一行列数相同，才能使用行列坐标计算格子编号。
  const rows = grid.length;
  const cols = grid[0].length;
  if (cols === 0 || grid.some((row) => row.length !== cols)) return -1;
  // 只接受空地 '.' 和墙壁 '#' 两种字符。
  if (grid.some((row) => row.some((cell) => cell !== "." && cell !== "#"))) {
    return -1;
  }

  // covered 记录空地是否已经被覆盖；occupied 记录 AP 覆盖区域是否占用该格。
  // occupied 同时包含墙格，因为 AP 的覆盖区域即使压到墙上也不能与其它 AP 重叠。
  const covered = Array.from({ length: rows }, () => Array(cols).fill(false));
  const occupied = Array.from({ length: rows }, () => Array(cols).fill(false));
  let remaining = 0;

  // 统计需要覆盖的空地总数。
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === ".") remaining++;
    }
  }
  if (remaining === 0) return 0;

  let best = Infinity;

  function search(remaining, used) {
    // 所有空地都被覆盖，记录当前方案的 AP 数量。
    if (remaining === 0) {
      best = Math.min(best, used);
      return;
    }

    // 一个 AP 最多覆盖 9 块空地，用这个下界剪掉不可能优于当前答案的分支。
    if (used + Math.ceil(remaining / 9) >= best) return;

    // 找到按行优先顺序遇到的第一块未覆盖空地，下一台 AP 必须覆盖它。
    let targetRow = -1;
    let targetCol = -1;
    for (let row = 0; row < rows && targetRow === -1; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === "." && !covered[row][col]) {
          targetRow = row;
          targetCol = col;
          break;
        }
      }
    }

    // 任何能覆盖目标空地的 AP，其中心都只能在目标周围一格范围内。
    for (let apRow = Math.max(0, targetRow - 1); apRow <= Math.min(rows - 1, targetRow + 1); apRow++) {
      for (let apCol = Math.max(0, targetCol - 1); apCol <= Math.min(cols - 1, targetCol + 1); apCol++) {
        // AP 只能放在空地上。
        if (grid[apRow][apCol] !== ".") continue;

        const area = [];
        let overlaps = false;
        let newlyCovered = 0;

        // 检查 AP 在网格内的 3*3 区域，同时统计它会新覆盖多少空地。
        for (let row = Math.max(0, apRow - 1); row <= Math.min(rows - 1, apRow + 1); row++) {
          for (let col = Math.max(0, apCol - 1); col <= Math.min(cols - 1, apCol + 1); col++) {
            area.push([row, col]);
            if (occupied[row][col]) overlaps = true;
            if (grid[row][col] === "." && !covered[row][col]) newlyCovered++;
          }
        }

        // 覆盖区域有任意格已被占用，都代表与之前的 AP 重叠。
        if (overlaps) continue;

        // 选择该 AP：占用整个区域，并标记区域内的空地已覆盖。
        for (const [row, col] of area) {
          occupied[row][col] = true;
          if (grid[row][col] === ".") covered[row][col] = true;
        }

        // 递归覆盖剩余空地，AP 数加一。
        search(remaining - newlyCovered, used + 1);

        // 回溯撤销本次选择，恢复状态供其它候选 AP 使用。
        for (const [row, col] of area) {
          occupied[row][col] = false;
          if (grid[row][col] === ".") covered[row][col] = false;
        }
      }
    }
  }

  search(remaining, 0);
  return Number.isFinite(best) ? best : -1;
}

// 按顺序验证题目中的五个示例。
console.log(minWifiAccessPoints([
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
  [".", ".", ".", "#", ".", ".", "."],
])); // 6

console.log(minWifiAccessPoints([
  [".", ".", "#", ".", "."],
  [".", ".", "#", ".", "."],
  [".", ".", "#", ".", "."],
  [".", ".", "#", ".", "."],
  [".", ".", "#", ".", "."],
])); // 4

console.log(minWifiAccessPoints([["."], ["."], ["."], ["."], ["."]])); // 2
console.log(minWifiAccessPoints([[]])); // -1
console.log(minWifiAccessPoints([
  [".", "#", ".", "#"],
  ["#", ".", "#", "."],
  [".", "#", ".", "#"],
  ["#", ".", "#", "."],
])); // -1
```

`covered` 和 `occupied` 分别记录空地覆盖状态与 AP 区域占用状态。DFS 每次找到第一块未覆盖空地，只尝试其周围可能的 AP 位置；放置后递归，返回时撤销状态。每个 AP 最多覆盖 9 块空地，因此用 `ceil(剩余空地数 / 9)` 做下界剪枝。此版本更直观，但仍是精确回溯，最坏时间复杂度为指数级，大规模复杂布局可能需要较长搜索时间。
