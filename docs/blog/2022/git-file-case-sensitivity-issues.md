---
pageType: doc
sidebar: false
tags: [git]
date: 2022-04-11
---

# git文件大小写问题

对工程项目做 Git 初始化并提交后，把文件夹和文件名的大写字母改成小写，Git 却完全没有记录这次改动。

## 问题

```tree
Component
├── Test1.vue
└── test2.vue
```

把以上的内容提交到 Git，然后有一天你发现文件夹的名字命名的不是很合理，你想把`Component`文件夹的`C`改成小写，把里面的`Test1.vue`第一个字母改成小写`t`。

```tree
component
├── test1.vue
└── test2.vue
```

改了之后你会发现一个神奇的现象，Git对这个改动没有跟踪记录，原因是 Git 默认忽略大小写，本地文件名的变动不会被跟踪。

之前用大写文件名提交到远程仓库，远程一直是大写。本地改成小写后因为不被跟踪，无法同步到远程。于是本地按小写开发，部署到服务器却是大写文件，很容易出错，且问题极难排查，可能调一上午都找不到原因。

## 解决

解决办法只有一行配置，把 Git 的 core.ignorecase 由默认的忽略大小写改为 false，此后 Git 就会识别大小写，重新出现跟踪记录，再提交就能把新文件名正确同步到服务器。

```bash
git config core.ignorecase false
```
