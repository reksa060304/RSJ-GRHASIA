define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanBorLosToiCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();

            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                loadData();
            }
            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function loadData() {
                medifirstService.get('pdti/dashboard-ranap?tglawal=' + moment($scope.item.tglawal).format('YYYY-MM-DD') + '&tglakhir=' + moment($scope.item.tglakhir).format('YYYY-MM-DD')).then(function (data) {
                   
                })
            }

            

            $scope.SearchData = function () {
                loadData()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }
            
            
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});