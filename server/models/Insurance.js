const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverage: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insurance', InsuranceSchema); 