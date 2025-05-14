const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/config');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/express', require('./routes/express'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/secondhand', require('./routes/secondhand'));
app.use('/api/errand', require('./routes/errand'));
app.use('/api/housing', require('./routes/housing'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/upload', require('./routes/upload'));

// 基础路由
app.get('/', (req, res) => {
  res.send('微信小程序后台管理系统API');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: err.message || '服务器错误'
  });
});

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 