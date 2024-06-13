define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuIndexCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.activeMenuTransfer = $state.current.name + $state.params.index;
            console.log($scope.activeMenuTransfer);
            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;
            let incrementIdx = 1
            $scope.lisIndex = [{
                index: incrementIdx,
                url: $state.current.name
            }]
            var nomorEMR = '-'
            var EMRFK = $state.params.idEMR;
            console.log("Menu Index"+$state.current.name, $state.params.idEMR, $state.params.index);
            $scope.URLFORM = $state.current.name;
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                loadPage(nomorEMR, EMRFK)
            }

            $scope.nav = function (state, index) {
                $scope.activeMenuTransfer = $state.current.name + index.toString();
                localStorage.setItem('activeMenuTransfer', state);
                $state.go($state.current.name, {
                    index: index,
                    idEMR: EMRFK
                });
                //  $state.go( state, {
                //     index: index,
                //     idEMR: EMRFK
                // });
            }
            $rootScope.tabIndex = function (tipe) {
                if (tipe == '+') {
                    $scope.lisIndex.push({
                        index: $scope.lisIndex.length + 1,
                        url: $state.current.name
                    })
                } else {
                    $scope.lisIndex.splice($scope.lisIndex.length - 1, 1)
                }

            }

            function loadPage(nomorEMR, EMRFK) {
                medifirstService.get("emr/get-emr-transaksi-detail-index?noemr=" + nomorEMR + "&emrfk=" + EMRFK, true).then(function (dat) {
                    if(dat.data.data.length > 0){
                        $scope.lisIndex = []
                        dat.data.data.map(function(item){
                            if(item.index !== null){
                                $scope.lisIndex.push({
                                    index: parseInt(item.index),
                                    url: $state.current.name
                                })
                            }
                        })
                    }else{
                        $scope.lisIndex = []
                        $scope.lisIndex = [{
                            index: 1,
                            url: $state.current.name
                        }]
                    }
                })
            }
            $rootScope.loadEMRTab = function (EMRFK) {
                loadPage(nomorEMR, EMRFK)
            }
        }
    ]);
});