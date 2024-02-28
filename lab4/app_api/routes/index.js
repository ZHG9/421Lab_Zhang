var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blogs');


// Return a list of blogs
router.get('/blogs', ctrlBlog.blogList);

// Return a single blog given an ID
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);

// Add a blog
router.post('/blogs', ctrlBlog.blogCreate);

// Update a blog given an ID
router.put('/blogs/:blogid', ctrlBlog.blogUpdateOne);

// Delete a blog given an ID
router.delete('/blogs/:blogid', ctrlBlog.blogDeleteOne);

module.exports = router;


