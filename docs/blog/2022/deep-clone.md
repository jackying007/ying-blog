---
pageType: doc
sidebar: false
tags: [js,ts]
date: 2022-3-29
---

# 深度克隆的各种方式

本编文章来探讨一下各种深度克隆的方式

## 不处理循环引用的深克隆

### 最简单的写法

```ts
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
```

### 递归实现

```ts
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const result: any = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }
  return result
}
```

### 问题

以上的两种写法，一旦对象出现循环引用（属性指向自身），就会无限递归，直接报错。

```ts
const obj: any = { a: 1, b: 2, c: { x: 1 } }
obj.d = obj // 循环引用
const newObj = deepCopy(obj)
console.log(obj === newObj, obj.c === newObj.c) // false false
```

## 处理循环引用的深克隆

### 递归实现

```ts
export function deepClone<T>(obj: T): T {
  const objectMap = new Map()
  const _deepClone = (value: any) => {
    if (value === null || typeof value !== 'object') {
      return value
    }
    if (objectMap.has(value)) return objectMap.get(value)
    const result: any = Array.isArray(value) ? [] : {}
    objectMap.set(value, result)
    for (const key in value) {
      result[key] = _deepClone(value[key])
    }
    return result
  }
  return _deepClone(obj)
}
```

### MessageChannel 实现

```ts
export function deepClone<T>(obj: T): Promise<T> {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port1.postMessage(obj)
    port2.onmessage = msg => resolve(msg.data)
  })
}
```

以上的两种写法，都可以处理循环引用的问题，不会报错。

```ts
const obj: any = { a: 1, b: 2, c: { x: 1 } }
obj.d = obj // 循环引用
const newObj = deepCopy(obj)
console.log(obj === newObj, obj.c === newObj.c, obj.d === newObj.d) // false false false
```
