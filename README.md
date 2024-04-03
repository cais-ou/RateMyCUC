# RateMyCUC

### 运行方式：

#### 数据库配置：

- Step1:将仓库`clone`至`WSL`中

- Step2:安装[docker-compose](https://docs.docker.com/compose/features-uses/)

- Step3:成功安装后`cd`至·`backend`文件夹下

- Step4:确认该文件夹下存在`docker-compose.yml`，并在终端输入以下命令：

  ```shell
  docker-compose up -d
  ```

  搭建数据库

  - 存在两个`docker-compose.yml`
  - 若只配置基础数据库（不包含搜索功能），则位于`backend`
  - 若要配置完整功能，则位于`backend --> data`

- Step5:成功执行命令后打开`docker`，数据库即上线成功



#### 前后端运行：

- Step1:执行`npm install`命令安装依赖

- Step2:

  - 对于后端：

    在打开docker的情况下，执行`npm run start:dev`开启后端

  - 对于前端：

    执行`npm run dev`命令开启前端，前端部分功能需要后端开启