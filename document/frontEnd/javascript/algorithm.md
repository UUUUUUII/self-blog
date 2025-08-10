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
