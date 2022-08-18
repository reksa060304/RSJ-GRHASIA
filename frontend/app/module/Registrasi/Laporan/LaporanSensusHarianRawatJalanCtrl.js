define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('LaporanSensusHarianRawatJalanCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.now = new Date()
            $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')
            $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59:59')
            $scope.searchData = function () {
                loadData()
            }
            loadData()
            // console.log($scope.item.jenisLaporan);
            function loadData() {
                var tglawal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00')
                var tglakhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59')
                medifirstService.get('laporan/get-data-sensus-harian-rawat-jalan?tglawal=' + tglawal + '&tglakhir='+tglakhir ).then(function (data) {
                    var datas = data.data.data
                    
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

            $scope.opsiGridJumlahPasien = {
                toolbar: ['excel'],
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "tgl",
                        "title": "TGL",
                        "width": "30px"
                    },
                    {
                        // "field": "tahun",
                        "title": "Jenis",
                        "columns":[
                            {
                                "field":"br",
                                "title": "Baru",
                                "width": '40px'
                            },
                            {
                                "field": "lm",
                                "title": "Lama",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Jenis Kelamin",
                        "columns": [
                            {
                                "field": "lk",
                                "title":"Lk",
                                "width": '40px'
                            },
                            {
                                "field": "pr",
                                "title": "Pr",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Umur",
                        "columns": [
                            {
                                "field": "umur1",
                                "title": "0-4",
                                "width": "40px"
                            },
                            {
                                "field": "umur2",
                                "title": "5-14",
                                "width": "40px"
                            },
                            {
                                "field": "umur3",
                                "title": "15-24",
                                "width": "40px"
                            },
                            {
                                "field": "umur4",
                                "title": "25-44",
                                "width": "40px"
                            },
                            {
                                "field": "umur5",
                                "title": "45-64",
                                "width": "40px"
                            },
                            {
                                "field": "umur6",
                                "title": ">64",
                                "width": "40px"
                            }
                        ]
                    },
                    {
                        "title": "Agama",
                        "columns": [{
                                "field": "agama1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "agama2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "agama3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "agama4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "agama5",
                                "title": "5",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Alamat",
                        "columns": [{
                                "field": "alamat1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "alamat2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "alamat3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "alamat4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "alamat5",
                                "title": "5",
                                "width": '40px'
                            },
                            {
                                "field": "alamat6",
                                "title": "6",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Pendidikan",
                        "columns": [{
                                "field": "pendidikan1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan5",
                                "title": "5",
                                "width": '40px'
                            },
                        ]
                    },
                    {
                        "title": "Pekerjaan",
                        "columns": [{
                                "field": "pekerjaan1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan5",
                                "title": "5",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan6",
                                "title": "6",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan7",
                                "title": "7",
                                "width": '40px'
                            }
                        ]
                    },
                ]
            }

        }
    ])
});