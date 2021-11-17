define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuCairanInfusCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, $state, cacheHelper) {
            // $scope.title = "Psikologi";
            // debugger;

            $scope.activeMenuCairanInfus = 'RekamMedis.AsesmenMedis.MenuCairanInfus.CatatanPemakaianCairanInfus';
            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;
            $scope.nav = function (state) {
                $scope.activeMenuCairanInfus = state;
                localStorage.setItem('activeMenuCairanInfus', state);
                $state.go(state, $state.params);
            }
        }
    ]);
});