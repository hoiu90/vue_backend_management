const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SecondHand = require('../models/SecondHand');

// @route   GET /api/secondhand/list
// @desc    获取二手商品列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, title, category, status } = req.query;
    
    // 构建查询条件
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;

    // 查询数据
    const total = await SecondHand.countDocuments(query);
    const secondHandList = await SecondHand.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      code: 200,
      data: {
        list: secondHandList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取二手商品列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/secondhand/:id
// @desc    获取二手商品详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const secondHand = await SecondHand.findById(req.params.id);
    
    if (!secondHand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该二手商品'
      });
    }

    res.json({
      code: 200,
      data: secondHand
    });
  } catch (err) {
    console.error('获取二手商品详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/secondhand/create
// @desc    创建二手商品
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, price, images, category, phone, openid, status } = req.body;

    // 创建新二手商品
    const secondHand = new SecondHand({
      title,
      description,
      price,
      images: images || [],
      category,
      phone,
      openid,
      status: status || 'active'
    });

    await secondHand.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: secondHand
    });
  } catch (err) {
    console.error('创建二手商品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/secondhand/:id
// @desc    更新二手商品
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, images, category, phone, status } = req.body;

    // 构建更新对象
    const secondHandFields = {};
    if (title) secondHandFields.title = title;
    if (description) secondHandFields.description = description;
    if (price !== undefined) secondHandFields.price = price;
    if (images) secondHandFields.images = images;
    if (category) secondHandFields.category = category;
    if (phone) secondHandFields.phone = phone;
    if (status) secondHandFields.status = status;

    // 查找并更新二手商品
    let secondHand = await SecondHand.findById(req.params.id);
    
    if (!secondHand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该二手商品'
      });
    }

    secondHand = await SecondHand.findByIdAndUpdate(
      req.params.id,
      { $set: secondHandFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: secondHand
    });
  } catch (err) {
    console.error('更新二手商品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/secondhand/:id
// @desc    删除二手商品
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除二手商品
    const secondHand = await SecondHand.findById(req.params.id);
    
    if (!secondHand) {
      return res.status(404).json({
        code: 404,
        message: '未找到该二手商品'
      });
    }

    await SecondHand.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除二手商品错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 