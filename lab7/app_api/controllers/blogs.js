var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// Helper function for error handling
var handleError = function(res, err) {
  sendJSONresponse(res, 400, err);
};

// Controller for listing all blogs
module.exports.blogList = function(req, res) {
  Blog.find().exec()
    .then(results => sendJSONresponse(res, 200, results))
    .catch(err => handleError(res, err));
};

// Controller for reading one blog
module.exports.blogReadOne = function(req, res) {
  if (req.params && req.params.blogid) {
    Blog.findById(req.params.blogid).exec()
      .then(blog => blog ? sendJSONresponse(res, 200, blog) : sendJSONresponse(res, 404, { "message": "blogid not found" }))
      .catch(err => handleError(res, err));
  } else {
    sendJSONresponse(res, 404, { "message": "No blogid in request" });
  }
};

// Controller for creating a new blog
module.exports.blogCreate = function(req, res) {
  if (!req.body.blogTitle || !req.body.blogText) {
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return;
  }

  Blog.create({
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    author: {
      name: req.body.author.name,
      email: req.body.author.email
    }
  })
  .then(blog => sendJSONresponse(res, 201, blog))
  .catch(err => handleError(res, err));
};

// Controller for updating one blog
module.exports.blogUpdateOne = function(req, res) {
  if (!req.params.blogid) {
    sendJSONresponse(res, 404, { "message": "Not found, blogid is required" });
    return;
  }

  Blog.findById(req.params.blogid).exec()
    .then(blog => {
      if (!blog) {
        sendJSONresponse(res, 404, { "message": "blogid not found" });
        return;
      }

      blog.blogTitle = req.body.blogTitle || blog.blogTitle;
      blog.blogText = req.body.blogText || blog.blogText;
      return blog.save();
    })
    .then(blog => sendJSONresponse(res, 200, blog))
    .catch(err => handleError(res, err));
};

// Controller for deleting one blog
module.exports.blogDeleteOne = function(req, res) {
  Blog.findByIdAndDelete(req.params.blogid).exec()
    .then(blog => {
      if (!blog) {
        sendJSONresponse(res, 404, { "message": "Blog not found" });
      } else {
        sendJSONresponse(res, 204, null);
      }
    })
    .catch(err => handleError(res, err));
};
