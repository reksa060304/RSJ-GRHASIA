define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CaraDaftarPasienCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();

            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD')
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD')
                loadData();
            }
          
            function loadData(){
                medifirstService.get('laporan/get-data-cara-daftar?tglAwal=' + moment($scope.item.tglawal).format('YYYY-MM-DD') + "&tglAkhir=" + moment($scope.item.tglakhir).format('YYYY-MM-DD')).then(function (data) {
                    var datas = data.data.data
                    $scope.dataTindakan = new kendo.data.DataSource({
                        data: datas
                    })
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
            $scope.columnTindakan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Jumlah Pasien Cara Bayar" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                // editable: true,
                sortable: true,
                resizable: true,
                groupable: true,
                columns: [
                    {
                        "field": "uraian",
                        "title": "Cara Daftar",
                        "width": "80px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "110px",
                    },
                    
                ],
            };
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});