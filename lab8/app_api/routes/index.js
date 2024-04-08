var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 

var auth = jwt({   
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlog = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');  // Lab 6

/* Setup routes to API URLs */

// Return a list of blogs
router.get('/blogs', ctrlBlog.blogList);

// Return a single blog given an ID
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);

// Add a blog
router.post('/blogs', auth, ctrlBlog.blogCreate); // Lab 6 - added auth param

// Update a blog given an ID
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne); // Lab 6 - added auth param

// Delete a blog given an ID
router.delete('/blogs/:blogid', auth, ctrlBlog.blogDeleteOne); // Lab 6 - added auth param

// Register & Login
router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6

// Comments
router.post('/blogs/:blogid/comments', auth, ctrlBlog.addComment);
// In your routes file
router.delete('/blogs/:blogid/comments/:commentid', auth, ctrlBlog.deleteComment);


// Ratings
router.post('/blogs/:blogid/rating', auth, ctrlBlog.updateRating);


module.exports = router;


