const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
  // 获取token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 检查是否有token
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '无访问权限，请先登录'
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 将用户信息添加到请求对象
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'Token无效或已过期'
    });
  }
}; 