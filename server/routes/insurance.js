const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Insurance = require('../models/Insurance');

// @route   GET /api/insurance/list
// @desc    获取保险列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, name, type } = req.query;
    
    // 构建查询条件
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (type) query.type = type;

    // 查询数据
    const total = await Insurance.countDocuments(query);
    const insuranceList = await Insurance.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      code: 200,
      data: {
        list: insuranceList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取保险列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/insurance/:id
// @desc    获取保险详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);
    
    if (!insurance) {
      return res.status(404).json({
        code: 404,
        message: '未找到该保险产品'
      });
    }

    res.json({
      code: 200,
      data: insurance
    });
  } catch (err) {
    console.error('获取保险详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/insurance/create
// @desc    创建保险产品
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { name, type, description, coverage, price, company, image } = req.body;

    // 创建新保险产品
    const insurance = new Insurance({
      name,
      type,
      description,
      coverage,
      price,
      company,
      image
    });

    await insurance.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: insurance
    });
  } catch (err) {
    console.error('创建保险产品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/insurance/:id
// @desc    更新保险产品
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, description, coverage, price, company, image } = req.body;

    // 构建更新对象
    const insuranceFields = {};
    if (name) insuranceFields.name = name;
    if (type) insuranceFields.type = type;
    if (description) insuranceFields.description = description;
    if (coverage) insuranceFields.coverage = coverage;
    if (price !== undefined) insuranceFields.price = price;
    if (company) insuranceFields.company = company;
    if (image) insuranceFields.image = image;

    // 查找并更新保险产品
    let insurance = await Insurance.findById(req.params.id);
    
    if (!insurance) {
      return res.status(404).json({
        code: 404,
        message: '未找到该保险产品'
      });
    }

    insurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      { $set: insuranceFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: insurance
    });
  } catch (err) {
    console.error('更新保险产品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/insurance/:id
// @desc    删除保险产品
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除保险产品
    const insurance = await Insurance.findById(req.params.id);
    
    if (!insurance) {
      return res.status(404).json({
        code: 404,
        message: '未找到该保险产品'
      });
    }

    await Insurance.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除保险产品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 