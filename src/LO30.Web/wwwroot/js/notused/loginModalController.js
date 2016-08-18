'use strict';


// from http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html
// todo...jwt..https://github.com/auth0-blog/angularjs-jwt-authentication-tutorial

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('loginModalController', function ($scope, UsersApi) {

  this.cancel = $scope.$dismiss;

  this.submit = function (email, password) {
    UsersApi.login(email, password).then(function (user) {
      $scope.$close(user);
    });
  };

});