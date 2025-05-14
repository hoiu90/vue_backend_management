const mongoose = require('mongoose');

const ExpressSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  receiverPhone: {
    type: String,
    required: true
  },
  pickupTime: {
    type: Date,
    default: Date.now
  },
  itemInfo: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  sendMethod: {
    type: String,
    enum: ['pickup', 'self'],
    default: 'pickup'
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  openid: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Express', ExpressSchema); 