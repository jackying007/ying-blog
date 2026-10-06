---
pageType: doc
sidebar: false
tags: [js]
date: 2022-5-14
---

# null 和 undefined到底有啥区别？

null 和 undefined 有什么区别？什么时候该用null，什么时候该用undefined？JS 作者 Brendan Eich 给出了明确定义：null 表示 NO object，undefined 表示 NO value，并承认设计上存在缺陷，就是 null 和 object 共享同一套类型标记，导致 `typeof null === 'object'`的 bug。

## undefined的含义：没有值

undefined 表示 NO value，即没有值。

例如定义一个变量 A 不赋值，它的值就是undefined。

```js
var a
console.log(a) // undefined
```

访问对象不存在的属性，结果也是undefined。

```js
var obj = {}
console.log(obj.x) // undefined
```

这表示它将来可能是任意值（数字、对象、字符串等），但此时此刻没有值。

## null的含义：没有对象

null 表示 NO object，即没有对象。它的设计天生与对象关联。

例如通过 document.getElementById 传入不存在的id得到null，因为期望得到的是DOM对象但拿不到。

```js
console.log(document.getElementById('xx')) // null
```

null总是跟对象相关联，你甚至可以定义一个类去继承null。

```js
class A extends null {}
```

## 历史兼容与使用建议

虽然理想情况下程序语言只需要一个表示`无`的东西，但考虑历史代码兼容性，这个美好愿望回不去了，只能接受。

总结使用场景：如果要表达这里原本应该是一个对象但现在没有对象，用null；如果要表达这个地方可能是任何东西但目前没有值，用undefined。
