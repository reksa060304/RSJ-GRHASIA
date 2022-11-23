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
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:C1"];
                    sheet.name = "Orders";
                    var jenispasien = ''
                    if($scope.item.jenisPasien != undefined){
                        jenispasien = $scope.item.jenisPasien.jenispasien
                    }
                    var myHeaders = [{
                        value: "Jumlah Pasien Rawat Jalan Per Tahun",
                        fontSize: 14,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 35
                    });
                    var myFooters = [{
                        value: "Keterangan : " + jenispasien,
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                        colSpan: 3
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(100, 0, {
                        cells: myFooters,
                        type: "header",
                        height: 35
                    });
                },
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