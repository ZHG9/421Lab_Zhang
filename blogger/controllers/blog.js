module.exports.list = function(req, res){
  res.render('blogList', { title: 'Blog List' });
};

module.exports.add = function(req, res){
  res.render('blogAdd', { title: 'Add Blog' });
};
