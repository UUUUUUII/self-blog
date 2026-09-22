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

## 12. 数组扁平化
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

