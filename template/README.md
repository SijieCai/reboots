## Installation

0. 配置后端环境（略）
1. 安装 Git：`yum install git`
2. 在服务器上安装 node: https://nodejs.org/dist/v4.2.1/
    
    ```
    $ cd private-cloud-fe
    $ git checkout develop
    ```
    
4. 进入项目页添加 nginx 配置文件并添加文件到 `.gitignore` 中：
    
    ```
    $ cd src/nginx
    $ cp lizheming.cloud.cn.conf yourname.conf  # 修改 yourname 为你的文件名
    $ vi yourname.conf  # 修改 server_name 和 root 为对应的地址，其中 root 需要指定到 provate-cloud-fe/dist 文件夹
    ```
5. 修改 `private-cloud-fe/src/common/request/index.js` 中的第 4 行地址为配置好的后端地址并将此文件添加到 `.gitignore` 中
6. 安装所需要的依赖并编译：
    
    ```
    $ cd private-cloud-fe
    $ npm install --registry=https://registry.npm.taobao.org
    $ npm run dist
    ```
7. 将 nginx 配置文件软链到 NGINX 配置文件夹中：

    ```
    ln -s /home/lizheming/private-cloud-fe/dist/nginx/yourname.conf /usr/local/nginx/conf/yourname.conf
    ```
    
8. 重启 NGINX 服务

## Installation Tips

如果是 Windows 环境安装 node-sass 之前需要安装 [VS Express](http://download.microsoft.com/download/4/4/E/44ED2754-ABC4-443F-812B-42AFEF04D478/vs2013.5_dskexp_CHS.iso?type=ISO)

    npm install --registry=https://registry.npm.taobao.org --verbose

## 编译
    npm start serve:hot   开发环境，react hot模式，不稳定
    npm start serve:production 线上环境，带一系列优化器，后端地址具体查看webpack.config.production.js文件

    npm start copy
    npm start clean
    npm start release:dev
    npm start release:test
    npm start release:production

