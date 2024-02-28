var request = require('request'); 

var apiOptions = {
  server: 'http://3.15.14.115:80' 
};


var _renderListPage = function (req, res, responseBody) {
  var message;
  // Check if the responseBody is an array and has content
  if (!(Array.isArray(responseBody) && responseBody.length)) {
    // If responseBody is empty or not an array, set 'no blogs' message
    message = 'No blogs to display. Add one above.';
  }
  res.render('blogList', {
    title: 'Blog list',
    blogs: responseBody,
    message: message 
  });
};

// Error handling
var _showError = function (req, res, status) {
  res.render('error', {
    message: 'Error ' + status,
    error: {
      status: status,
      stack: 'Oops! Something went wrong.'
    }
  });
};


// a) Show a list of blogs
module.exports.list = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (err) {
        _showError(req, res, 500);
      } else if (response.statusCode === 200) {
        _renderListPage(req, res, body);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

// b) Add a new blog
module.exports.add = function(req, res) {
  res.render('blogAdd', { title: 'Add Blog' });
};


module.exports.create = function(req, res) {
  var requestOptions, path, postdata;
  path = '/api/blogs';
  postdata = {
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };
  if (!postdata.blogTitle || !postdata.blogText) {
    res.redirect('/blogAdd');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/blogList');
        } else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};


// c) Edit an existing blog
module.exports.edit = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.blogid;
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
  };
  request(requestOptions, function(err, response, body) {
    if (err || response.statusCode !== 200) {
      _showError(req, res, err ? 500 : response.statusCode);
    } else {
      res.render('blogEdit', {
        title: 'Edit Blog',
        blog: body 
      });
    }
  });
};


module.exports.doEdit = function(req, res) {
  var requestOptions, path, postdata;
  path = '/api/blogs/' + req.params.blogid;
  postdata = {
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: postdata
  };
  if (!postdata.blogTitle || !postdata.blogText) {
    res.redirect('/blogEdit/' + req.params.blogid);
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 200) {
          res.redirect('/blogList');
        } else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

// d) Delete an existing blog
module.exports.delete = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.blogid;
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
  };
  request(requestOptions, function(err, response, body) {
    if (err) {
      _showError(req, res, 500);
    } else if (response.statusCode === 200) {
      res.render('blogDelete', {
        title: 'Delete Blog',
        blog: body
      });
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}

module.exports.doDelete = function(req, res) {
  var requestOptions, path;
  path = '/api/blogs/' + req.params.blogid;
  requestOptions = {
    url: apiOptions.server + path,
    method: 'DELETE', 
    json: {}
  };
  request(
    requestOptions,
    function(err, response) {
      if (err || response.statusCode !== 204) {
        _showError(req, res, err ? 500 : response.statusCode);
      } else {
        res.redirect('/blogList');
      }
    }
  );
};