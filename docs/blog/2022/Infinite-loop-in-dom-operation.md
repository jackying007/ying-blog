---
pageType: doc
sidebar: false
tags: [js]
date: 2022-7-06
---

# dom 操作的死循环之坑

来看这样一个场景，一个含1234的列表和一个按钮，点击后复制列表中的每个li元素并重新放回ul中，实现点击一次出现两列1234，再点出现三列的效果。

## 问题与解决

```html
<div>
  <ul class="list">
    <li class="list-item">1</li>
    <li class="list-item">2</li>
    <li class="list-item">3</li>
    <li class="list-item">4</li>
  </ul>
  <button>复制一份</button>
</div>
```

```js
const list = document.getElementsByClassName('list')[0]
const listItems = document.getElementsByClassName('list-item')
const button = document.getElementsByTagName('button')[0]
button.onclick = () => {
  for (let i = 0; i < listItems.length; i++) {
    const cloned = listItems[i].cloneNode(true)
    list.appendChild(cloned)
  }
}
```

获取ul、所有li和按钮，给按钮注册点击事件，在事件中遍历li集合并逐个复制追加到ul。这段看似没有问题的代码，在点击后页面却完全卡死，浏览器无响应。

卡死的根本原因，就是通过`getElementsByClassName`得到的集合是动态的，页面改动会实时影响集合内容，每次复制并追加新元素都会使集合增长，导致循环无穷无尽。

要解决这个问题要用另外一个叫`querySelectorAll`的API

```js
const listItems = document.querySelectorAll('.list-item')
```

这个API使用CSS选择器获取所有匹配元素，返回静态集合，与页面变化无关。

## 总结

`getElementsByClassName`返回动态的`HTMLCollection`，页面变化会影响它。`querySelectorAll`返回静态的`NodeList`，像一张照片一样固定在获取时刻，与页面变化无关。我们编码的时候多数情况下需要静态集合的。