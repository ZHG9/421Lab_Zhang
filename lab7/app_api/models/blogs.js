var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  blogTitle: { type: String, required: true },
  blogText: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
});

module.exports = mongoose.model('Blog', blogSchema);