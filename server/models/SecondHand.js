const mongoose = require('mongoose');

const SecondHandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  openid: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SecondHand', SecondHandSchema); 