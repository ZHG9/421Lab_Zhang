module.exports.list = function(req, res){

  const blogEntries = [
    {
      blogTitle: 'First Blog Post',
      blogText: 'This is the content of the first blog post.',
      createdOn: new Date()
    },
    {
      blogTitle: 'Second Blog Post',
      blogText: 'This is the content of the second blog post.',
      createdOn: new Date()
    },
    {
      blogTitle: 'Third Blog Post',
      blogText: 'This is the content of the third blog post.',
      createdOn: new Date()
    }
  ];

  res.render('blogList', {
    title: 'Blog List',
    blogs: blogEntries 
  });
};

module.exports.add = function(req, res){
  res.render('blogAdd', { title: 'Add Blog' });
};
module.exports.edit = function(req, res){
  res.render('blogEdit', { title: 'Edit Blog' });
};
module.exports.delete = function(req, res){
  res.render('blogDelete', { title: 'Delete Blog' });
};
