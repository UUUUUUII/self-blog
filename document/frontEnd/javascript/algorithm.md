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
