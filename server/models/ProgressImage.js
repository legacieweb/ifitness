const mongoose = require('mongoose');

const ProgressImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageData: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: 'Progress',
  },
  label: {
    type: String,
    default: '',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('ProgressImage', ProgressImageSchema);
