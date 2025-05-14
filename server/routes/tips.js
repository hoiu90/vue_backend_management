const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tips = require('../models/Tips');

// @route   GET /api/tips/list
// @desc    获取省钱技巧列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, title, category, tag } = req.query;
    
    // 构建查询条件
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    // 查询数据
    const total = await Tips.countDocuments(query);
    const tipsList = await Tips.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      code: 200,
      data: {
        list: tipsList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取省钱技巧列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/tips/:id
// @desc    获取省钱技巧详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const tips = await Tips.findById(req.params.id);
    
    if (!tips) {
      return res.status(404).json({
        code: 404,
        message: '未找到该省钱技巧'
      });
    }

    res.json({
      code: 200,
      data: tips
    });
  } catch (err) {
    console.error('获取省钱技巧详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/tips/create
// @desc    创建省钱技巧
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { title, content, category, tags, image } = req.body;

    // 创建新省钱技巧
    const tips = new Tips({
      title,
      content,
      category,
      tags: tags || [],
      image
    });

    await tips.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: tips
    });
  } catch (err) {
    console.error('创建省钱技巧错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/tips/:id
// @desc    更新省钱技巧
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, tags, image } = req.body;

    // 构建更新对象
    const tipsFields = {};
    if (title) tipsFields.title = title;
    if (content) tipsFields.content = content;
    if (category) tipsFields.category = category;
    if (tags) tipsFields.tags = tags;
    if (image !== undefined) tipsFields.image = image;

    // 查找并更新省钱技巧
    let tips = await Tips.findById(req.params.id);
    
    if (!tips) {
      return res.status(404).json({
        code: 404,
        message: '未找到该省钱技巧'
      });
    }

    tips = await Tips.findByIdAndUpdate(
      req.params.id,
      { $set: tipsFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: tips
    });
  } catch (err) {
    console.error('更新省钱技巧错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/tips/:id
// @desc    删除省钱技巧
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除省钱技巧
    const tips = await Tips.findById(req.params.id);
    
    if (!tips) {
      return res.status(404).json({
        code: 404,
        message: '未找到该省钱技巧'
      });
    }

    await Tips.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除省钱技巧错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 