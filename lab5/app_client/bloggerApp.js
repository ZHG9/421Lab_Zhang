// Define the AngularJS module and include the ngRoute module for routing
var app = angular.module('bloggerApp', ['ngRoute']);

// Configure routes using the $routeProvider
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blogList', {
            templateUrl: 'blogList.html',
            controller: 'BlogListController',
            controllerAs: 'vm'
        })
        .when('/blogAdd', {
            templateUrl: 'blogAdd.html',
            controller: 'BlogAddController',
            controllerAs: 'vm'
        })
        .when('/blogEdit/:blogid', {
            templateUrl: 'blogEdit.html',
            controller: 'BlogEditController',
            controllerAs: 'vm'
        })
        .when('/blogDelete/:blogid', {
            templateUrl: 'blogDelete.html',
            controller: 'BlogDeleteController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Service for interacting with the blog API
app.service('BlogService', ['$http', function($http) {
    var apiBaseUrl = '/api/blogs';

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog);
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog);
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId);
    };
}]);

// HomeController
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Zhang Chen Blog Site';
    vm.message = 'Welcome to my blog site.';
}]);

// BlogListController
app.controller('BlogListController', ['BlogService', function(BlogService) {
    var vm = this;
    vm.message = ''; // Initialize an empty message

    BlogService.listBlogs().then(function(response) {
        if (!Array.isArray(response.data) || !response.data.length) {
            // If the response does not contain an array or the array is empty,
            // set a 'no blogs' message
            vm.message = 'No blogs to display. Add one above.';
        } else {
            // If there are blogs, assign them to vm.blogs
            vm.blogs = response.data;
        }
    }, function(error) {
        // In case of an error, set an error message
        vm.message = 'Error fetching blogs';
    });
}]);

// BlogAddController
app.controller('BlogAddController', ['BlogService', '$location', function(BlogService, $location) {
    var vm = this;
    vm.blog = {};
    vm.addBlog = function() {
        BlogService.addBlog(vm.blog).then(function() {
            $location.path('/blogList');
        }, function(error) {
            vm.message = 'Error adding blog';
        });
    };
}]);

// BlogEditController
app.controller('BlogEditController', ['$routeParams', 'BlogService', '$location', function($routeParams, BlogService, $location) {
    var vm = this;
    vm.blogId = $routeParams.blogid;
    BlogService.getBlog(vm.blogId).then(function(response) {
        vm.blog = response.data;
    }, function(error) {
        vm.message = 'Error fetching blog';
    });
    vm.updateBlog = function() {
        BlogService.updateBlog(vm.blogId, vm.blog).then(function() {
            $location.path('/blogList');
        }, function(error) {
            vm.message = 'Error updating blog';
        });
    };
}]);

// BlogDeleteController
app.controller('BlogDeleteController', ['$routeParams', 'BlogService', '$location', function($routeParams, BlogService, $location) {
    var vm = this;
    vm.blogId = $routeParams.blogid;
    BlogService.getBlog(vm.blogId).then(function(response) {
        vm.blog = response.data;
    }, function(error) {
        vm.message = 'Error fetching blog';
    });
    vm.deleteBlog = function() {
        BlogService.deleteBlog(vm.blogId).then(function() {
            $location.path('/blogList');
        }, function(error) {
            vm.message = 'Error deleting blog';
        });
    };
}]);
