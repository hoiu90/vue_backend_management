const mongoose = require('mongoose');

const ErrandSchema = new mongoose.Schema({
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
  area: {
    type: String,
    required: true
  },
  serviceType: {
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
    enum: ['active', 'completed', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Errand', ErrandSchema); 