var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Setup routes to pages */

// Show a list of blogs with options to edit or delete
router.get('/', ctrlHome.home); 
router.get('/blogList', ctrlBlog.list);

// Add a new blog
router.get('/blogAdd', ctrlBlog.add); 
router.post('/blogAdd', ctrlBlog.create); 

// Edit an existing blog and save it
router.get('/blogEdit/:blogid', ctrlBlog.edit);
router.post('/blogEdit/:blogid', ctrlBlog.doEdit); 

// Delete an existing blog (or cancel deletion)
router.get('/blogDelete/:blogid', ctrlBlog.delete); 
router.post('/blogDelete/:blogid', ctrlBlog.doDelete); 


module.exports = router;

