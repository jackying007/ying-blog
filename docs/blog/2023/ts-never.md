---
pageType: doc
sidebar: false
tags: [ts]
date: 2023-6-13
---

# typescript never 的妙用

typescript 有个神奇的类型，叫 `never`，表示不存在，本篇文章来探讨一下它的两种实用场景。

## 反向约束

我们需要写一个函数，需要约束参数「不能是某一个类型」（如不能是 number），其他类型都可以。

这时可以用条件类型对泛型做三目判断，当传入类型 extend number 时返回 never，否则返回传入类型本身，从而在传入 number 时报错。

```ts
function test<T>(x: T extends number ? never : T) {}
test('sdsds')
test(1) // ts 报错
```

我们可以把它写成一个通用类型工具

```ts
type BanType<T, U> = T extends U ? never : T

function test<T>(x: BanType<T, number>) {}
test('sdsds')
test(1) // ts 报错
```

## 类型收窄

```ts
type X = 'test1' | 'test2'

function test(x: X) {
  switch (x) {
    case 'test1':
      x // 鼠标放这里，x 类型提示为 test1
      break
    case 'test2':
      x // 鼠标放这里，x 类型提示为 test2
      break
    default:
      // 这个时候，x 类型提示为 never，我们直接把 x 赋值给一个 never 类型的数据
      const _exhaustiveCheck: never = x // 往 X 新增类型，TypeScript 可以帮助你发现这里需要处理
      throw new Error(`Unknown: ${_exhaustiveCheck}`)
  }
}
```

给 X 新增类型 `test3`，这时 default 分支会把类型收窄为 `test3`，那么 `_exhaustiveCheck` 那里 ts 会报错，提示不能将类型“"test3"”分配给类型“never”。

使用 `if else` 也是可以进行类型收窄的。

```ts
type X = 'test1' | 'test2'

function test(x: X) {
  if (x === 'test1') {
    x // 鼠标放这里，x 类型提示为 test1
  } else if (x === 'test2') {
    x // 鼠标放这里，x 类型提示为 test2
  } else {
    // 这个时候，x 类型提示为 never，我们直接把 x 赋值给一个 never 类型的数据
    const _exhaustiveCheck: never = x // 往 X 新增类型， TypeScript 可以帮助你发现这里需要处理
    throw new Error(`Unknown: ${_exhaustiveCheck}`)
  }
}
```
