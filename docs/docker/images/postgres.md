# Postgres 数据库

## 命令运行容器

```bash
docker run --name postgres-test \
  -p 5432:5432 \
  -v D:/DockerData/ContainerBackup/postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=ying123456 \
  -e TZ=Asia/Shanghai \
  -d --restart=always postgres
```

如果是在 windows 下使用 cmd 跑命令，把 `\` 换行符改为 `^` 即可。

## docker compose 文件启动容器

```yml
version: '3'
services:
  mysql:
    container_name: postgres-test
    image: postgres:latest
    environment:
      TZ: Asia/Shanghai
      POSTGRES_PASSWORD: ying123456
    restart: always
    volumes:
      - D:/DockerData/ContainerBackup/postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
```
