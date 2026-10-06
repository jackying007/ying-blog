# MySQL 数据库

## 命令运行容器

```bash
docker run --name mysql-test \
  -p 3306:3306 \
  -v D:/DockerData/ContainerBackup/mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=ying123456 \
  -e TZ=Asia/Shanghai \
  -d --restart=always mysql
```

如果是在 windows 下使用 cmd 跑命令，把 `\` 换行符改为 `^` 即可。

## docker compose 文件启动容器

```yml
version: '3'
services:
  mysql:
    container_name: mysql-test
    image: mysql:latest
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: ying123456
    restart: always
    volumes:
      - D:/DockerData/ContainerBackup/mysql-data:/var/lib/mysql
    ports:
      - '3306:3306'
```
