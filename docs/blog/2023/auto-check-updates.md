---
pageType: doc
sidebar: false
tags: [js,ts,前端]
date: 2023-10-11
---

# 实现页面自动检测更新的方法

来看这样一个需求，用户在站点停留时间较长，系统每天多次更新，现在希望用户能收到「系统已更新，请刷新」的提示，当用户点击确定后页面自动刷新。

## 核心实现

该方案核心是每隔一小段时间（示例为 2 秒）用 fetch 请求获取服务器首页并解析为纯文本，取出其中的 script 元素；前端工程化会给 JS 文件带上文件指纹（哈希值），文件变动则哈希值随之变化。

```ts
let lastSrcs: string[]

async function extractNewScripts() {
  const res = await fetch('/?_timestamp=' + Date.now())
  if (!res.ok) {
    throw new Error(`fetch html failed: ${res.status}`)
  }
  const html = await res.text()
  const matches = html.matchAll(/<script[^>]*\ssrc=["'](?<src>[^"']+)["']/gi)
  return [...matches].map(m => m.groups?.src).filter(src => src !== undefined)
}

async function checkUpdate() {
  const newScripts = await extractNewScripts()
  if (!lastSrcs) {
    lastSrcs = newScripts
    return false
  }
  let result = false
  if (lastSrcs.length !== newScripts.length) {
    result = true
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true
      break
    }
  }
  lastSrcs = newScripts
  return result
}

export type AutoUpdateOptions = {
  onUpdate: () => Promise<void> | void
  duration?: number
}
export function autoUpdate({ onUpdate, duration = 30000 }: AutoUpdateOptions) {
  async function autoCheck() {
    const needUpdate = await checkUpdate()
    if (needUpdate) await onUpdate()
    setTimeout(autoCheck, duration)
  }
  setTimeout(autoCheck, duration)
}
```

用变量保存上一次获取的 JS 地址，第一个函数请求首页（带时间戳避免缓存），用正则提取所有 JS 的 URL 并存入数组返回。

第二个函数比较新旧地址，有差异即需更新，首次则无需更新。

第三个函数每隔固定秒数调用检查函数，需要更新则对外通知并等待，执行完成后递归调用自身继续检查。

## 使用

```ts
autoUpdate({
  onUpdate: () => {
    const result = confirm('页面有更新，点击确定刷新页面')
    if (result) location.reload()
  },
  duration: 10000
})
```

## 总结

该方案相比在生产环境开启热更新或自行使用 WebSocket 更省事，无需改动服务器，一小段 JS 代码即可解决。且单页应用下每次请求传输的内容极少，就算 2 秒检查一次也完全不影响整个系统运行。
