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
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })

        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);


// Service for interacting with the blog API
app.service('BlogService', ['$http', 'authentication', function($http, authentication) {
    var apiBaseUrl = '/api/blogs';

    // Function to construct authorization headers
    var Headers = function() {
        var token = authentication.getToken();
        if (token) {
            return { headers: { Authorization: 'Bearer ' + token } };
        } else {
            return {};
        }
    };

    // Public service methods
    this.listBlogs = function() {
        // Listing blogs might not require authentication
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        if (!authentication.isLoggedIn()) {
          throw new Error('User is not logged in.');
        }
        const currentUser = authentication.currentUser();
        blog.author = {
          name: currentUser.name,
          email: currentUser.email
        };
        return $http.post(apiBaseUrl, blog, Headers());
    };

    this.getBlog = function(blogId) {
        // Getting a specific blog might not require authentication
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        // Updating a blog requires authentication
        return $http.put(apiBaseUrl + '/' + blogId, blog, Headers());
    };

    this.deleteBlog = function(blogId) {
        // Deleting a blog requires authentication
        return $http.delete(apiBaseUrl + '/' + blogId, Headers());
    };
}]);

// HomeController
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Zhang Chen Blog Site';
    vm.message = 'Welcome to my blog site.';
}]);

// BlogListController
app.controller('BlogListController', ['BlogService', 'authentication', function(BlogService, authentication) {
    var vm = this;
    vm.message = '';
    vm.isLoggedIn = authentication.isLoggedIn;
    vm.currentUserEmail = vm.isLoggedIn() ? authentication.currentUser().email : '';

    vm.loadBlogs = function() {
        BlogService.listBlogs().then(function(response) {
            vm.blogs = response.data.map(function(blog) {
                blog.isAuthor = vm.isLoggedIn() && vm.currentUserEmail === blog.author.email;
                return blog;
            });

            if (vm.blogs.length === 0) {
                vm.message = 'No blogs to display.';
            }
        }, function(error) {
            vm.message = 'Error fetching blogs: ';
        });
    };

    if (vm.isLoggedIn()) {
        vm.loadBlogs(); // Load blogs only if the user is logged in
    } else {
        vm.message = 'Please log in to see the blog posts.';
    }
}]);


// BlogAddController
app.controller('BlogAddController', ['BlogService', '$location', 'authentication', function(BlogService, $location, authentication) {
    var vm = this;
    vm.blog = {};

    vm.addBlog = function() {
        if (!authentication.isLoggedIn()) {
            vm.message = 'You must be logged in to add a blog.';
            return;
        }

        BlogService.addBlog(vm.blog).then(function() {
            $location.path('/blogList');
        }, function(error) {
            vm.message = 'Error adding blog';
        });
    };
}]);


// BlogEditController
app.controller('BlogEditController', ['$routeParams', 'BlogService', '$location', 'authentication', function($routeParams, BlogService, $location, authentication) {
    var vm = this;
    vm.blogId = $routeParams.blogid;

    if (!authentication.isLoggedIn()) {
        $location.path('/login');
        return;
    }

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
app.controller('BlogDeleteController', ['$routeParams', 'BlogService', '$location', 'authentication', function($routeParams, BlogService, $location, authentication) {
    var vm = this;
    vm.blogId = $routeParams.blogid;

    if (!authentication.isLoggedIn()) {
        $location.path('/login');
        return;
    }

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
