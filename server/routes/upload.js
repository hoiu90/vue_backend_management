const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// @route   POST /api/upload/image
// @desc    上传单张图片
// @access  Private
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择要上传的图片'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      code: 200,
      message: '上传成功',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (err) {
    console.error('上传图片错误:', err.message);
    res.status(500).json({
      code: 500,
      message: err.message || '上传失败'
    });
  }
});

// @route   POST /api/upload/images
// @desc    上传多张图片
// @access  Private
router.post('/images', auth, upload.array('images', 9), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '请选择要上传的图片'
      });
    }

    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));

    res.json({
      code: 200,
      message: '上传成功',
      data: imageUrls
    });
  } catch (err) {
    console.error('上传多张图片错误:', err.message);
    res.status(500).json({
      code: 500,
      message: err.message || '上传失败'
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    删除图片
// @access  Private
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        code: 200,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '文件不存在'
      });
    }
  } catch (err) {
    console.error('删除图片错误:', err.message);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

module.exports = router; 