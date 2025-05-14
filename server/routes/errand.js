const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Errand = require('../models/Errand');

// @route   GET /api/errand/list
// @desc    获取跑腿服务列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, title, area, serviceType, status } = req.query;
    
    // 构建查询条件
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (area) query.area = area;
    if (serviceType) query.serviceType = serviceType;
    if (status) query.status = status;

    // 查询数据
    const total = await Errand.countDocuments(query);
    const errandList = await Errand.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      code: 200,
      data: {
        list: errandList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取跑腿服务列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/errand/:id
// @desc    获取跑腿服务详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const errand = await Errand.findById(req.params.id);
    
    if (!errand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该跑腿服务'
      });
    }

    res.json({
      code: 200,
      data: errand
    });
  } catch (err) {
    console.error('获取跑腿服务详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/errand/create
// @desc    创建跑腿服务
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, price, area, serviceType, phone, openid, status } = req.body;

    // 创建新跑腿服务
    const errand = new Errand({
      title,
      description,
      price,
      area,
      serviceType,
      phone,
      openid,
      status: status || 'active'
    });

    await errand.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: errand
    });
  } catch (err) {
    console.error('创建跑腿服务错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/errand/:id
// @desc    更新跑腿服务
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, area, serviceType, phone, status } = req.body;

    // 构建更新对象
    const errandFields = {};
    if (title) errandFields.title = title;
    if (description) errandFields.description = description;
    if (price !== undefined) errandFields.price = price;
    if (area) errandFields.area = area;
    if (serviceType) errandFields.serviceType = serviceType;
    if (phone) errandFields.phone = phone;
    if (status) errandFields.status = status;

    // 查找并更新跑腿服务
    let errand = await Errand.findById(req.params.id);
    
    if (!errand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该跑腿服务'
      });
    }

    errand = await Errand.findByIdAndUpdate(
      req.params.id,
      { $set: errandFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: errand
    });
  } catch (err) {
    console.error('更新跑腿服务错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/errand/:id
// @desc    删除跑腿服务
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除跑腿服务
    const errand = await Errand.findById(req.params.id);
    
    if (!errand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该跑腿服务'
      });
    }

    await Errand.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除跑腿服务错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 