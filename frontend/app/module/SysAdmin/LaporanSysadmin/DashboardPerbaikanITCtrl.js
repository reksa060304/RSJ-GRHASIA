define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DashboardPerbaikanITCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();

            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                LoadCombo();
                loadData();
            }
            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }
            function loadData() {
                $scope.item
                medifirstService.get('pdti/load-data-dashboard?tglawal='+ moment($scope.item.tglawal).format('YYYY-MM-DD 00:00')+'&tglakhir='+ moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59')).then(function(data){
                    $scope.card = data.data.card
                    for (let i = 0; i < $scope.card.length; i++) {
                        console.log($scope.card[i][0].id);
                        if($scope.card[i][0].id == null){
                            $scope.card[i][0].color = '#ffffff'
                            $scope.card[i][0].colorhead = '#e2e2e2'
                        }
                        if ($scope.card[i][0].id == 3) {
                            $scope.card[i][0].color = '#ff0000'
                            $scope.card[i][0].colorhead = '#cb0000'

                        }
                        if ($scope.card[i][0].id == 15) {
                            $scope.card[i][0].color = '#fffc00'
                            $scope.card[i][0].colorhead = '#ccca00'

                        }
                        if ($scope.card[i][0].id == 1) {
                            $scope.card[i][0].color = '#01ff00'
                            $scope.card[i][0].colorhead = '#01bd00'

                        }
                    }
                })
            }
            function LoadCombo() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');

                $scope.listDepartemen = [{
                        id: 1,
                        departemen: "Instalasi Rawat Jalan"
                    },
                    {
                        id: 2,
                        departemen: "Instalasi Rawat Inap"
                    }
                ];
                medifirstService.get('ipsrs/get-combo-pegawai-perbaikan').then(function (data) {
                    var datas = data.data
                    $scope.listObjekPerbaikan = datas.objekperbaikan
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