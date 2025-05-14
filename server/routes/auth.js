const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    管理员登录
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 验证用户名和密码
    if (username !== config.adminUsername || password !== config.adminPassword) {
      return res.status(400).json({
        code: 400,
        message: '用户名或密码错误'
      });
    }

    // 创建JWT Payload
    const payload = {
      user: {
        id: 'admin',
        username: username
      }
    };

    // 生成Token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire },
      (err, token) => {
        if (err) throw err;
        res.json({
          code: 200,
          message: '登录成功',
          data: {
            token,
            username
          }
        });
      }
    );
  } catch (err) {
    console.error('登录错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/auth/info
// @desc    获取当前用户信息
// @access  Private
router.get('/info', auth, async (req, res) => {
  try {
    res.json({
      code: 200,
      data: {
        username: req.user.username,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('获取用户信息错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    退出登录
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    res.json({
      code: 200,
      message: '退出成功'
    });
  } catch (err) {
    console.error('退出登录错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 