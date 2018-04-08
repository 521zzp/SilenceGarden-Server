# SilenceGarden-Server

> A node.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# build for compressed production 
npm run build-compress

```

### 本项目是个人网站，当个记事本记录自己的学习，分享自己喜欢的东西吧φ(>ω<*) 

[项目地址，我的秘密花园(～￣▽￣)～ ](http://www.silencegarden.com/ "静谧花园")

#### 概况：
本项目运行在阿里云centos系统，采用前后端分离架构，前端使用的是 [vue](https://cn.vuejs.org/ "vue.js") 框架，后端使用的是nodejs+express+mongodb开发。前端服务器使用nignx，后端运行用的pm2。

### 然后我们开始吧(　 ´-ω ･)▄︻┻┳══━一

#### 1. 购买云服务器
 国内云服务器提供商随便买个（本项目是阿里云服务器centos系统，其它云服务器不保证结果），如果是阿里云可以找我推荐有优惠哦٩(๑❛ᴗ❛๑)۶。
  
 开机登录啥的Linux基本操作，然后下载xshell连接远程服务器吧。
  
 连接步骤：
    
 1. 云服务器配置安全组入方向 22/22 端口允许通过。
 
 2. 安装xshell，文件 → 新建 → 连接 → 名称随意，主机ip填云服务器ip → 用户身份验证 → 用户名填服务器登录名（root）,密码自己设置的密码 → 确认 → 连接
 
 3. 连接上后有就可以远程操作啦！
 
 4. 常用操作命令：
 
 ```
    文件上传： rz (在 xshell 中有效哦) 
 
    解压缩文件： unzip filename.zip
    
    解压缩并覆盖更新文件： unzip -o filename.zip
    
    查找文件： find / -name filename
    
    移动文件： mv filename folder
    
    文件夹或文件改名： mv oldname(.*) newname(.*)
    
    删除文件夹及内部所以文件： rm -rf folder
    
    删除文件：rm -f filename
    
    查看编辑文件： vi filename，打开后 i 编辑
    
    修改保存和不保存：esc + : + w + q + enter (保存修改) esc + : + q + ! + enter （不保存修改）
    
    centos安装程序： yun -y install packagename
 
 ```
 
 #### 2.安装相关软件
 
 1. 云服务安装nginx
 
    1. 安装nginx
    
    ```
     yum -y install nginx
    ```
    
    2. 启动&关闭nginx
    
    ```
    service nginx start
    service nginx stop
    ```
    
    3. 编辑nginx.conf
    
    
    ```
    vi /etc/nginx/nginx.conf
    ```
    
    4. 前端部分nginx配置
    
    ```
    server {
        listen       80 default_server;               # 默认监听80端口
        listen       [::]:80 default_server;
        server_name  _;
        include /etc/nginx/default.d/*.conf;

        location ^~ /assets/ {
                root /home/project/static;            # 静态文件，图片，音频等存放目录 
        }

        location / {
            if ( $request_uri ~ "^\/api\/*" ) {       # 所有带api的请求发送到后端
                proxy_pass   http://127.0.0.1:4000;   # 自定义端口号
            }
            root /home/project/dist;                  # 前端文件存放目录
            try_files $uri $uri/ /index.html;         # 找不到文件时定向到index.html
        }
     }
     ```
     
    5. 开启服务器80端口访问
    
        安全组添加规则允许80端口访问
    
2. 安装配置 nodejs
    1. 安装
    
    ```
    yum -y install nodejs
    ```
    
    2. 将 npm 和 node 命令添加到全局
    
    ```
        ln -s /root/node-v8.9.3-linux-x64/bin/node /usr/local/bin/node
        ln -s /root/node-v8.9.3-linux-x64/bin/npm /usr/local/bin/npm
    ``` 
    
 3. 安装mongodb
  参考这个链接：[centos安装MongoDB](http://www.baidu.com "centos安装MongoDB")
    

#### 3. 部署

1. 前端部分

  vue项目打包生成的文件用nginx代理就行
  
2. 后端部分

  安装使用pm2后台启动node服务
  
  全局安装：
  
  ```
  $ npm isntall pm2 -g
  ```
    
  将pm2命令添加到全局： 
  
  在根目录执行：
  
  ```
  $ ln -s /home/nodejs/node-v8.9.3-linux-x64/bin/pm2 /usr/local/bin/pm2

  /home/nodejs/node-v8.9.3-linux-x64/bin/pm2 是我的安装目录，可以通过

  $ find / -name pm2 查找到
  ```
    
  启动项目:
  
  ```
  $ pm2 start app.js
  ```
