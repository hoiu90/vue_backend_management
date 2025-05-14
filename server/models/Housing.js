const mongoose = require('mongoose');

const HousingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  houseType: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    default: ''
  },
  orientation: {
    type: String,
    default: ''
  },
  facilities: {
    type: [String],
    default: []
  },
  contact: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
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
    enum: ['available', 'rented', 'inactive'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Housing', HousingSchema); 