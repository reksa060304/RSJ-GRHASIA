define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuEWSBidanCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, $state, cacheHelper) {
            // $scope.title = "Psikologi";
            // debugger;

            $scope.activeMenuEWSBidan = 'RekamMedis.AsesmenMedis.MenuEWSBidan.SkorEWSBidan';
            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;
            $scope.nav = function (state) {
                $scope.activeMenuEWSBidan = state;
                localStorage.setItem('activeMenuEWSBidan', state);
                $state.go(state, $state.params);
            }
        }
    ]);
});