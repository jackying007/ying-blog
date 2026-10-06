---
pageType: doc
sidebar: false
tags: [js,ts,前端]
date: 2023-8-25
---

# web 前端多标签页之间的通信

跨标签页通信有好几种方案，这里选择 `localStorage` 和 `BroadcastChannel` 两种方案去实现。

## 抽象类型定义

因为接下来要分别使用两种方案去实现，并且我要实现的跨页通信功能里需要知道是否有其他页面活跃，所以我先定义好一组通用生命周期类型和一个抽象接口。

```ts
type StringKey<T> = Extract<keyof T, string>

const lifeCycleEvents = ['connect', 'reply', 'close'] as const
type LifeCycleEvent = (typeof lifeCycleEvents)[number]
function isLifeCycleEvent(event: any): event is LifeCycleEvent {
  return lifeCycleEvents.includes(event as LifeCycleEvent)
}

type Handler<T> = (id: number, payload: T) => void
type LifeCycleHandler = (id: number) => void

interface CrossTabChannel<E extends Record<string, any>> {
  off<K extends StringKey<E>>(event: K, handler: Handler<E[K]>): void
  on<K extends StringKey<E>>(event: K, handler: Handler<E[K]>): () => void
  emit<K extends StringKey<E>>(event: K, payload: E[K]): void
  offLifeCycle(event: LifeCycleEvent, handler: LifeCycleHandler): void
  onLifeCycle(event: LifeCycleEvent, handler: LifeCycleHandler): () => void
  emitLifeCycle(event: LifeCycleEvent): void
}

type CrossTabChannelOptions = {
  name: string
  id: number
  allPageClose: () => void
}
```

## localStorage

window 上的 storage 事件，只有当别的标签页改动 storage 时才会触发，并会带回被改动的 key、新值、旧值。

### 核心实现

```ts
export class LocalStorage<E extends Record<string, any>> implements CrossTabChannel<E> {
  name: string
  id: number
  listeners = new Set<number>()
  #handlersMap = new Map<keyof E, Handler<any>[]>()
  #lifeCycleHandlersMap = new Map<LifeCycleEvent, LifeCycleHandler[]>()
  #allPageClose: () => void
  constructor({ name, id, allPageClose }: CrossTabChannelOptions) {
    this.name = name
    this.id = id
    this.#allPageClose = allPageClose
    this.setUp()
  }

  off: CrossTabChannel<E>['off'] = (event, handler) => {
    const handlers = this.#handlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#handlersMap.delete(event)
    } else {
      this.#handlersMap.set(event, newHanlders)
    }
  }

  on: CrossTabChannel<E>['on'] = (event, handler) => {
    const list = this.#handlersMap.get(event) ?? []
    list.push(handler)
    this.#handlersMap.set(event, list)

    return () => this.off(event, handler)
  }

  emit: CrossTabChannel<E>['emit'] = (event, payload) => {
    localStorage.setItem(
      `@@${this.name}`,
      JSON.stringify({
        data: {
          event,
          id: this.id,
          payload
        },
        timestamp: Date.now()
      })
    )
  }

  offLifeCycle: CrossTabChannel<E>['offLifeCycle'] = (event, handler) => {
    const handlers = this.#lifeCycleHandlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#lifeCycleHandlersMap.delete(event)
    } else {
      this.#lifeCycleHandlersMap.set(event, newHanlders)
    }
  }

  onLifeCycle: CrossTabChannel<E>['onLifeCycle'] = (event, handler) => {
    const list = this.#lifeCycleHandlersMap.get(event) ?? []
    list.push(handler)
    this.#lifeCycleHandlersMap.set(event, list)

    return () => this.offLifeCycle(event, handler)
  }

  emitLifeCycle: CrossTabChannel<E>['emitLifeCycle'] = event => {
    localStorage.setItem(
      `@@${this.name}`,
      JSON.stringify({
        data: {
          event,
          id: this.id
        },
        timestamp: Date.now()
      })
    )
  }

  #storageHandler = (e: StorageEvent) => {
    if (!e.key || !e.newValue || !e.key.startsWith(`@@${this.name}`)) return
    const value = JSON.parse(e.newValue)
    const data = value.data as {
      event: keyof E | LifeCycleEvent
      id: number
      payload: E[keyof E]
    }
    const { event, id, payload } = data
    if (isLifeCycleEvent(event)) {
      this.#lifeCycleHandlersMap.get(event)?.forEach(handler => handler(id))
    } else {
      this.#handlersMap.get(event)?.forEach(handler => handler(id, payload))
    }
  }

  clear() {
    window.removeEventListener('storage', this.#storageHandler)
  }

  setUp() {
    this.emitLifeCycle('connect')
    window.addEventListener('pagehide', () => {
      if (this.listeners.size === 0) this.#allPageClose()
      this.emitLifeCycle('close')
    })
    this.onLifeCycle('connect', id => {
      this.emitLifeCycle('reply')
      this.listeners.add(id)
    })
    this.onLifeCycle('reply', id => {
      this.listeners.add(id)
    })
    this.onLifeCycle('close', id => {
      this.listeners.delete(id)
    })
    window.addEventListener('storage', this.#storageHandler)
  }
}
```

`emit` 时，`localStorage.setItem` 的值一定要加一个 timestamp 是因为：如果直传递数据，在两次相同的数据设置时，storage 事件不会触发。所以需要把存储值包成一个对象，里面放入数据和一个每次都不同的值。

### 通用 Manager

```ts
export class ChannelManager<T extends Record<string, Record<string, any>>> {
  createId(name: string) {
    const key = `channel-${name}`
    let id = +(localStorage.getItem(key) ?? 0)
    id++
    localStorage.setItem(key, id.toString())
    return id
  }
  clearId(name: string) {
    const key = `channel-${name}`
    localStorage.removeItem(key)
  }
  createLocalStorageChannel<K extends StringKey<T>>(name: K) {
    const id = this.createId(name)
    return new LocalStorage<T[K]>({ name, id, allPageClose: () => this.clearId(name) })
  }
}
```

## BroadcastChannel

### 核心逻辑

```ts
export class Broadcast<E extends Record<string, any>> implements CrossTabChannel<E> {
  #channel: BroadcastChannel
  id: number
  listeners = new Set<number>()
  #handlersMap = new Map<keyof E, Handler<any>[]>()
  #lifeCycleHandlersMap = new Map<LifeCycleEvent, LifeCycleHandler[]>()
  #allPageClose: () => void
  constructor({ name, id, allPageClose }: CrossTabChannelOptions) {
    this.#channel = new BroadcastChannel(name)
    this.id = id
    this.#allPageClose = allPageClose
    this.setUp()
  }

  off: CrossTabChannel<E>['off'] = (event, handler) => {
    const handlers = this.#handlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#handlersMap.delete(event)
    } else {
      this.#handlersMap.set(event, newHanlders)
    }
  }

  on: CrossTabChannel<E>['on'] = (event, handler) => {
    const list = this.#handlersMap.get(event) ?? []
    list.push(handler)
    this.#handlersMap.set(event, list)

    return () => this.off(event, handler)
  }

  emit: CrossTabChannel<E>['emit'] = (event, payload) => {
    this.#channel.postMessage({
      event,
      id: this.id,
      payload
    })
  }

  offLifeCycle: CrossTabChannel<E>['offLifeCycle'] = (event, handler) => {
    const handlers = this.#lifeCycleHandlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#lifeCycleHandlersMap.delete(event)
    } else {
      this.#lifeCycleHandlersMap.set(event, newHanlders)
    }
  }

  onLifeCycle: CrossTabChannel<E>['onLifeCycle'] = (event, handler) => {
    const list = this.#lifeCycleHandlersMap.get(event) ?? []
    list.push(handler)
    this.#lifeCycleHandlersMap.set(event, list)

    return () => this.offLifeCycle(event, handler)
  }

  emitLifeCycle: CrossTabChannel<E>['emitLifeCycle'] = event => {
    this.#channel.postMessage({
      event,
      id: this.id
    })
  }

  #messageEvent = (e: MessageEvent<any>) => {
    const data = e.data as {
      event: keyof E | LifeCycleEvent
      id: number
      payload: E[keyof E]
    }
    const { event, id, payload } = data
    if (isLifeCycleEvent(event)) {
      this.#lifeCycleHandlersMap.get(event)?.forEach(handler => handler(id))
    } else {
      this.#handlersMap.get(event)?.forEach(handler => handler(id, payload))
    }
  }

  clear() {
    this.#channel.removeEventListener('message', this.#messageEvent)
  }

  setUp() {
    this.emitLifeCycle('connect')
    window.addEventListener('pagehide', () => {
      if (this.listeners.size === 0) this.#allPageClose()
      this.emitLifeCycle('close')
    })
    this.onLifeCycle('connect', id => {
      this.emitLifeCycle('reply')
      this.listeners.add(id)
    })
    this.onLifeCycle('reply', id => {
      this.listeners.add(id)
    })
    this.onLifeCycle('close', id => {
      this.listeners.delete(id)
    })
    this.#channel.addEventListener('message', this.#messageEvent)
  }
}
```

### 通用 Manager

给前面写的`ChannelManager`添加一个新的函数。

```ts
export class ChannelManager<T extends Record<string, Record<string, any>>> {
  // ...
  createBroadcastChannel<K extends StringKey<T>>(name: K) {
    const id = this.createId(name)
    return new Broadcast<T[K]>({ name, id, allPageClose: () => this.clearId(name) })
  }
}
```

## 使用

创建`ChannelManager`对象，传入整体类型。

```ts
type Event = {
  test: {
    event1: null
    event2: { a: string; b: string }
  }
}

const channelManager = new ChannelManager<Event>()
```

使用 `createLocalStorageChannel` 或 `createBroadcastChannel` 创建 `channel`，并监听对应的事件。

```ts
const channel = channelManager.createLocalStorageChannel('test')
// const channel = channelManager.createBroadcastChannel('test')
console.log('channel id created', channel.id)
channel.on('event1', (id, data) => {
  // id data 都有对应的类型提示
  console.log({ id, data })
})
channel.on('event2', (id, data) => {
  // id data 都有对应的类型提示
  console.log({ id, data })
})
channel.onLifeCycle('close', id => {
  console.log('someone close', id)
})
```

试着在某处触发事件。

```ts
console.log(channel.listeners)
if (channel.listeners.size) {
  channel.emit('event2', { a: 'aaa', b: 'bbb' }) // 都有对应的类型提示
  channel.emit('event1', null) // 都有对应的类型提示
} else {
  console.log('没有其他标签页')
}
```

无论是使用 `createLocalStorageChannel` 还是 `createBroadcastChannel`, 效果都一样。
