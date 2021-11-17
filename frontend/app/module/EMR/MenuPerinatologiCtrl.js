define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuPerinatologiCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, $state, cacheHelper) {
            // $scope.title = "Psikologi";
            // debugger;

            $scope.activeMenuPerinatologi = 'RekamMedis.AsesmenMedis.MenuPerinatologi.CatatanGrafikPerinatologi';
            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;
            $scope.nav = function (state) {
                $scope.activeMenuPerinatologi = state;
                localStorage.setItem('activeMenuPerinatologi', state);
                $state.go(state, $state.params);
            }
        }
    ]);
});