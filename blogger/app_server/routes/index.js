var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/blogList', ctrlBlog.list);
router.get('/blogAdd', ctrlBlog.add);

router.get('/blogEdit', ctrlBlog.edit);
router.get('/blogDelete', ctrlBlog.delete);


module.exports = router; 


