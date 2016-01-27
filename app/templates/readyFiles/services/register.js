(function (){
  'use strict';

  /* jshint latedef:nofunc */

  /**
   * @ngdoc service
   * @name app.registerService
   * @description
   * # registerService
   * A factory to register users and save their credentials. Eventually log them in too.
   */
    angular.module('app')
    .factory('registerService', function (authService, apiService){
        var service = {
          register: register
        };

        return service;

        function register(user){
            var credentials = {
                email: user.email,
                password: user.password
            };
            return apiService.post('register', user, {key: 'user'})
            .then(loginUser);

            function loginUser() {
                return authService.login({email:credentials.email, password:credentials.password});
            }
        }
    });

})();
