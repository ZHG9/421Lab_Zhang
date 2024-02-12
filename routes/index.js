var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlContact = require('../controllers/blog);

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/blog', ctrlBlog.bolg);

module.exports = router;    

