const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Express = require('../models/Express');

// @route   GET /api/express/list
// @desc    获取快递列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sender, receiver, sendMethod } = req.query;
    
    // 构建查询条件
    const query = {};
    if (sender) query.senderName = { $regex: sender, $options: 'i' };
    if (receiver) query.receiverName = { $regex: receiver, $options: 'i' };
    if (sendMethod) query.sendMethod = sendMethod;

    // 查询数据
    const total = await Express.countDocuments(query);
    const expressList = await Express.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      code: 200,
      data: {
        list: expressList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取快递列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/express/:id
// @desc    获取快递详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const express = await Express.findById(req.params.id);
    
    if (!express) {
      return res.status(404).json({
        code: 404,
        message: '未找到该快递订单'
      });
    }

    res.json({
      code: 200,
      data: express
    });
  } catch (err) {
    console.error('获取快递详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/express/create
// @desc    创建快递订单
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      pickupTime,
      itemInfo,
      remark,
      sendMethod,
      estimatedPrice,
      images,
      openid
    } = req.body;

    // 创建新快递订单
    const express = new Express({
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      pickupTime,
      itemInfo,
      remark,
      sendMethod,
      estimatedPrice,
      images: images || [],
      openid
    });

    await express.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: express
    });
  } catch (err) {
    console.error('创建快递订单错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/express/:id
// @desc    更新快递订单
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      pickupTime,
      itemInfo,
      remark,
      sendMethod,
      estimatedPrice,
      images
    } = req.body;

    // 构建更新对象
    const expressFields = {};
    if (senderName) expressFields.senderName = senderName;
    if (senderPhone) expressFields.senderPhone = senderPhone;
    if (receiverName) expressFields.receiverName = receiverName;
    if (receiverPhone) expressFields.receiverPhone = receiverPhone;
    if (pickupTime) expressFields.pickupTime = pickupTime;
    if (itemInfo) expressFields.itemInfo = itemInfo;
    if (remark !== undefined) expressFields.remark = remark;
    if (sendMethod) expressFields.sendMethod = sendMethod;
    if (estimatedPrice !== undefined) expressFields.estimatedPrice = estimatedPrice;
    if (images) expressFields.images = images;

    // 查找并更新快递订单
    let express = await Express.findById(req.params.id);
    
    if (!express) {
      return res.status(404).json({
        code: 404,
        message: '未找到该快递订单'
      });
    }

    express = await Express.findByIdAndUpdate(
      req.params.id,
      { $set: expressFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: express
    });
  } catch (err) {
    console.error('更新快递订单错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/express/:id
// @desc    删除快递订单
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除快递订单
    const express = await Express.findById(req.params.id);
    
    if (!express) {
      return res.status(404).json({
        code: 404,
        message: '未找到该快递订单'
      });
    }

    await Express.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除快递订单错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 