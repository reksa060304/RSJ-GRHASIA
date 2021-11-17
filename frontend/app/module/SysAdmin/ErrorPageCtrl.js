define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ErrorPageCtrl', ['$scope', '$state', 'CacheHelper',
        function ($scope, $state, cacheHelper) {
            $scope.back = function(){
                $state.go('home')
            }
        }
    ])
})