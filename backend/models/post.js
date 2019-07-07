const mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

