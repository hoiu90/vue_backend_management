# 微信小程序后台管理系统

一个基于Vue 3和MongoDB的轻量级后台管理系统，用于管理微信小程序数据。该系统包含快递、保险、二手、跑腿、租房和省钱技巧六个功能模块，设计简洁，易于维护。

## 技术栈

### 前端
- Vue 3
- Vue Router 4
- Pinia
- Element Plus
- Axios

### 后端
- Express.js
- MongoDB
- JWT认证
- Multer文件上传

## 目录结构

```
wechat-admin/
├── client/             # 前端代码
│   ├── public/         # 静态资源
│   └── src/            # 源代码
│       ├── api/        # API接口
│       ├── assets/     # 资源文件
│       ├── components/ # 组件
│       ├── router/     # 路由
│       ├── store/      # 状态管理
│       ├── utils/      # 工具函数
│       └── views/      # 页面
├── server/             # 后端代码
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── middleware/     # 中间件
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   └── uploads/        # 上传文件目录
└── README.md           # 项目说明
```

## 功能模块

1. **用户管理**：基于微信小程序openid的用户管理
2. **快递模块**：管理快递订单信息
3. **保险模块**：管理保险产品信息
4. **二手交易模块**：管理二手商品信息
5. **跑腿服务模块**：管理跑腿服务信息
6. **租房模块**：管理房源信息
7. **省钱技巧模块**：管理省钱技巧文章

## 安装与运行

### 前端

```bash
cd client
npm install
npm run dev
```

### 后端

```bash
cd server
npm install
npm run dev
```

## 部署

1. 前端构建：
```bash
cd client
npm run build
```

2. 后端部署：
```bash
cd server
npm start
```

## 默认管理员账号

- 用户名：admin
- 密码：admin123

可在server/config/config.js中修改默认账号密码。

## 注意事项

1. 请确保MongoDB服务已启动
2. 默认端口：前端3000，后端5000
3. 上传文件存储在server/uploads目录下 