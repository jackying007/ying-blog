# 网络

## 创建网络

```bash
docker network create -d bridge mynet
```

## 删除网络

```bash
docker network rm mynet
```

## 列出网络

```bash
docker network ls
```

## 获取有关网络的信息

```bash
docker network inspect mynet
```

## 将正在运行的容器连接到网络

```bash
docker network connect mynet nginx
```

## 启动时将容器连接到网络

```bash
docker run -it -d --network=mynet nginx
```

## 断开容器与网络的连接

```bash
docker network disconnect mynet nginx
```
