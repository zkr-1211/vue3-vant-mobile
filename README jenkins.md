# 下载 Jenkins 资源

sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo

# 这一步如果出现报错，使用下面的命令解决

sudo yum install -y ca-certificates

# 获取并导入信任的包制作者的秘钥

sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key

# 升级 yum 源中的所有包

sudo yum upgrade

# Jenkins 依赖于 java 所以需要安装 JDK

sudo yum install java-11-openjdk

# 安装 Jenkins

sudo yum install jenkins

# 提示：jenkins-2.401-1.1.noarch.rpm 的公钥没有安装则输入下面 并再安装一次 Jenkins

wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# 安装完成后默认打开 8080，如果打不开需要打开服务器安全组 8080 和开放防火墙

# 查看防火墙状态

systemctl status firewalld

# 查看所有永久开放的端口

firewall-cmd --list-ports --permanent

# 添加永久开放的端口

firewall-cmd --add-port=8080/tcp --permanent

# 重启一下防火墙

systemctl restart firewalld

# 端口被占用

# 可以停掉占用端口的程序，或者换个端口，同样需要在安全组放行

# 查看某个端口被占用 lsof -i:端口号

lsof -i:8080

# 如果有的话就 kill 对应进程的 pid

kill -9 PID

# 进入后安装推荐插件，并且安装 NODE.JS,ssh,webhook

# 配置全局 ssh 以及 node

# 可以参考

https://juejin.cn/post/7191076198506561573
https://juejin.cn/post/6995588010934796302#heading-6
https://cloud.tencent.com/developer/article/1915574

# 执行 shell

node -v
npm -v
npm install
npm run build
tar -zcvf dist.tar ./dist

# Exec command

cd /home/polarday/h5-payfly # 进入文件所在目录
mkdir -p backup
if [ -d "dist" ]; then # 检查是否存在 dist 目录
mv dist backup/dist\_$(date +%Y%m%d%H%M%S) # 如果存在，则备份到 backup 目录下
fi
tar zxvf dist.tar # 解压 dist.tar 文件到当前目录下
rm -rf dist.tar # 删除 dist.tar 压缩包
docker-compose up -d --force-recreate # 强制重新创建容器 这将会停止并删除现有的容器，然后使用新构建的镜像来启动新的容器
