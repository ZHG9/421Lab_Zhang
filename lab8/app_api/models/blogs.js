var mongoose = require('mongoose');

// Define a Comment Schema
var commentSchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  message: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

// Extend the Blog Schema
var blogSchema = new mongoose.Schema({
  blogTitle: { type: String, required: true },
  blogText: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  comments: [commentSchema], 
  rating: { 
    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Blog', blogSchema);
