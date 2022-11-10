define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JumlahPemeriksaanPerDetailPemeriksaanCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.item.listKelompokPasienMulti = []

            
            

            loadData()
            $scope.SearchData = function () {
                loadData()
            }

            $scope.SearchEnter = function () {
                loadData()
            }

            $scope.SearchNoRm = function () {
                loadData()
            }

            $scope.SearchTglLahir = function () {
                loadData()
            }

            loadData()

            function loadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MM-YYYY HH:mm');
                
                medifirstService.get("laboratorium/get-jumlah-detailpemeriksaan?tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir )
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < data.data.data.length; i++) {
                            data.data.data[i].no = i + 1
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.data,
                            // group: $scope.group,
                            pageSize: 100,
                            total: data.data.data.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }

                        });
                    });

            };
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanJumlahPemeriksaanLaboratorium.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:C1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Jumlah Detail Pemeriksaan Laboratorium",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "detailpemeriksaan",
                        "title": "Detail Pemeriksaan",
                        "width": "150px",
                    },
                    {
                        "field": "count",
                        "title": "Jumlah",
                        "width": "50px",
                    },
                ]
            };

            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});