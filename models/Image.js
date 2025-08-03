const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  filename: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Image', ImageSchema);
