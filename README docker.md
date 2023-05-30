# 安装 docker

yum install docker

# 安装 docker-compose

yum install -y docker-compose

# 启动 docker

systemctl start docker

# 查看 docker 的运行状态

systemctl status docker

# 设置 docker 开启自启动

systemctl enable docker

# 查看 docker 容器

docker ps

# 查看 docker 镜像

docker images

# 构建镜像

docker build -t test .

# 构建镜像

#镜像启动一个容器
docker run -d -p 8080:80 --name test-image test

# docker 停止容器

使用 docker stop ID

# docker 移除容器

docker rm ID

# docker 移除所有容器

docker rm -f $(docker ps -aq)

# docker 移除镜像

docker rmi ID

# docker 移除所有镜像

docker rmi $(docker images -aq)

# 会停止和删除所有的容器、网络和卷

# docker -v 选项用于删除关联的卷，--rmi all 选项用于删除所有未打上标签的镜像。

docker-compose down -v --rmi all

# --build 参数强制 Docker Compose 构建所有镜像

# 如果你想在后台运行容器（即“守护模式”），可以在命令中加上 -d

docker-compose up --build -d

# --force-recreate 参数让 Docker 强制重新创建容器 这将会停止并删除现有的容器，然后使用新构建的镜像来启动新的容器。

docker-compose up -d --force-recreate -d
