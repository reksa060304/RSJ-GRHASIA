define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('LaporanJumlahPasienCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.searchData = function(){
                loadData()
            }
            loadData()
            // console.log($scope.item.jenisLaporan);
            function loadData(){
                var jenislaporan = ""
                if($scope.item.jenisLaporan != undefined){
                    jenislaporan = "&jenislaporan=" + $scope.item.jenisLaporan.id
                }
                var jenispasien = ""
                if ($scope.item.jenisPasien != undefined) {
                    jenispasien = "&jenispasien=" + $scope.item.jenisPasien.id
                }
                medifirstService.get('laporan/get-data-jumlah-pasien?'+jenislaporan+jenispasien).then(function(data){
                    var datas = data.data.data
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        
                    }
                    $scope.gridJumlahPasien = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: datas.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }
            $scope.listJenisLaporan = [
                {
                    'id': 1,
                    'jenislaporan': 'Rawat Jalan'
                },
                {
                    'id': 2,
                    'jenislaporan': 'Rawat Inap'
                }
            ]
            $scope.listJenisPasien = [
                {
                    id: 1,
                    jenispasien: 'Jiwa'
                },
                {
                    id:2,
                    jenispasien: 'Non Jiwa'
                },
                {
                    id:3,
                    jenispasien: 'Napza'
                }
            ]
            $scope.opsiGridJumlahPasien = {
                toolbar: ['excel'],
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No"
                    },
                    {
                        "field": "tahun",
                        "title": "Tahun"
                    },
                    {
                        "field": "jumlahpasien",
                        "title": "Jumlah Pasien"
                    }
                ]
            }
            
        }
    ])
});