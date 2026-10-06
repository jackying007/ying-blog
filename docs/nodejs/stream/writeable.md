# 可写流

本篇来说一下可写流，之前的可读流就是为了生产数据，处于结构的上游，而可写流就是用于消费数据处于结构下游，通过可写流就能够去把数据写入到指定的地方，常见的操作就是往磁盘文件中写入内容，或者对 tcp 以及 http 的网络响应去进行操作，注意这里我们所说的是响应，而请求一般都是可读流，同样我们还是先去通过两个代码片段来看一下可写流的基本使用。

```js
const rs = fs.createReadStream('text1.txt')
const ws = fs.createWriteStream('text2.txt')
rs.pipe(ws)
```

```js
const rs = fs.createReadStream('text1.txt')
const ws = fs.createWriteStream('text2.txt')
rs.on('data', chunk => {
  ws.write(chunk)
})
```

这两段代码实现的效果都是复制 `text1.txt` 文件的内容到 `text2.txt`。

## 自定义可写流

```js
const fs = require('fs')
const { Writable } = require('stream')
class MyWriteable extends Writable {
  constructor() {
    super()
  }

  _write(chunk, encoding, callback) {
    console.log('模拟写入数据: ', chunk.toString())
    // 写入完成后调用 callback
    process.nextTick(callback)
  }
}

let myWriteable = new MyWriteable()

myWriteable.write('哇咔咔', () => {
  console.log('哇咔咔写入完成')
})

myWriteable.on('pipe', () => {
  console.log('on pipe')
})

myWriteable.on('drain', () => {
  console.log('on drain')
})

const rs = fs.createReadStream('text1.txt')
rs.pipe(myWriteable)
```

其实知道了可读流的工作流程以及实现之后，其他三种流的操作都会很好理解，比如说当前我们就类比可读流就会知道，如果想要去实现一个自定义的可写流，同样我们也要去完成两个核心的操作，第一个就是我们要去继承 stream 里面的 `Writeable`，第二个就是去重写它里边的 `_write` 方法。

我们再来看一下常见的事件操作，实际开发中经常见到的就应该是 `pipe` 事件的使用，当可读流调用 `pipe` 方法向可写流传输数据的时候，就会去触发可写流的 `pipe` 事件，从而去完成最终的数据写入操作，还有一个就是 `unpipe` 事件，他会在可读流调用 `unpipe` 方法的时候被触发，如果说 `pipe` 是数据的到来，那么 `unpipe` 就是数据的切断，一般来说这个操作它不是特别的常用。

再有一个就是 `drain` 事件，字面的意思就是抽干，会在可写流的内部缓冲区被清空时触发。更具体地说，它会在 `write` 方法返回 false(表示内部缓冲区已满)，当缓冲区被清空，可以安全地继续写入数据时被触发。

我们提到过使用流操作数据的好处之一就在于不会撑爆内存，`write` 方法在执行的时候，会判断一下当前想要写入的数据量，是否小于当前流中所设置的缓存大小上限，如果是小于的，则正常执行写入，`write`方法就会返回一个 true，但是假设我们要想去写入 100 个字节，可是流中的缓存上限才 10 个字节，那这样的话就不能再执行一次性地写入了，就需要先去经过慢慢的消化处理之后，然后再去继续执行的写入新的数据，这个时候就需要通过监听 `drain` 事件来实现流量控制（背压）。

背压是指数据生产者和消费者之间速度不匹配的问题。如果生产者（如文件读取）速度远超消费者（如网络响应），数据就会在内存中堆积。如果不加控制，最终会导致内存溢出或程序崩溃。

当然还有 `end`、 `error` 这样的一些必备事件，这里就不去一一列举了。
