const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Housing = require('../models/Housing');

// @route   GET /api/housing/list
// @desc    获取租房信息列表
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, title, area, houseType, minPrice, maxPrice } = req.query;
    
    // 构建查询条件
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (area) query.district = area;
    if (houseType) query.houseType = houseType;
    
    // 价格范围查询
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = parseInt(minPrice);
      if (maxPrice) query.rent.$lte = parseInt(maxPrice);
    }

    // 查询数据
    const total = await Housing.countDocuments(query);
    const housingList = await Housing.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // 转换字段名称以适应客户端
    const formattedList = housingList.map(house => {
      const item = house.toObject();
      return {
        ...item,
        price: item.rent,
        size: item.area,
        area: item.district,
        publishDate: new Date(item.createdAt).toLocaleDateString()
      };
    });

    res.json({
      code: 200,
      data: {
        list: formattedList,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('获取租房信息列表错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   GET /api/housing/:id
// @desc    获取租房信息详情
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id);
    
    if (!housing) {
      return res.status(404).json({
        code: 404,
        message: '未找到该租房信息'
      });
    }

    // 转换字段名称以适应客户端
    const item = housing.toObject();
    const formattedHousing = {
      ...item,
      price: item.rent, // 将rent映射为price
      size: item.area, // 将area映射为size
      area: item.district, // 将district映射为area
      publishDate: new Date(item.createdAt).toLocaleDateString() // 格式化发布日期
    };

    res.json({
      code: 200,
      data: formattedHousing
    });
  } catch (err) {
    console.error('获取租房信息详情错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   POST /api/housing/create
// @desc    创建租房信息
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price,
      size,
      address, 
      area,
      houseType,
      floor,
      orientation,
      facilities,
      contact,
      phone, 
      images
    } = req.body;

    console.log('接收到的数据:', req.body);

    // 创建新租房信息
    const housing = new Housing({
      title,
      description,
      rent: price,
      area: size,
      address,
      district: area,
      houseType,
      floor,
      orientation,
      facilities,
      contact,
      phone,
      images: images || [],
      status: 'available'
    });

    await housing.save();

    res.json({
      code: 200,
      message: '创建成功',
      data: housing
    });
  } catch (err) {
    console.error('创建租房信息错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   PUT /api/housing/:id
// @desc    更新租房信息
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price,
      size,
      address, 
      area,
      houseType,
      floor,
      orientation,
      facilities,
      contact,
      phone, 
      images,
      status
    } = req.body;

    // 构建更新对象
    const housingFields = {};
    if (title) housingFields.title = title;
    if (description) housingFields.description = description;
    if (price !== undefined) housingFields.rent = price;
    if (size !== undefined) housingFields.area = size;
    if (address) housingFields.address = address;
    if (area) housingFields.district = area;
    if (houseType) housingFields.houseType = houseType;
    if (floor) housingFields.floor = floor;
    if (orientation) housingFields.orientation = orientation;
    if (facilities) housingFields.facilities = facilities;
    if (contact) housingFields.contact = contact;
    if (images) housingFields.images = images;
    if (phone) housingFields.phone = phone;
    if (status) housingFields.status = status;

    // 查找并更新租房信息
    let housing = await Housing.findById(req.params.id);
    
    if (!housing) {
      return res.status(404).json({
        code: 404,
        message: '未找到该租房信息'
      });
    }

    housing = await Housing.findByIdAndUpdate(
      req.params.id,
      { $set: housingFields },
      { new: true }
    );

    res.json({
      code: 200,
      message: '更新成功',
      data: housing
    });
  } catch (err) {
    console.error('更新租房信息错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// @route   DELETE /api/housing/:id
// @desc    删除租房信息
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // 查找并删除租房信息
    const housing = await Housing.findById(req.params.id);
    
    if (!housing) {
      return res.status(404).json({
        code: 404,
        message: '未找到该租房信息'
      });
    }

    await Housing.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (err) {
    console.error('删除租房信息错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 