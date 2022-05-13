define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanJasaPelayananTICtrl', ['$scope', 'DateHelper', 'MedifirstService',
        function ($scope, DateHelper, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.isLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listDataDokter = data.data.dokter;
                    $scope.listProduk = data.data.produkobat;
                    $scope.dataLogin = medifirstService.getPegawaiLogin();
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            
            function init() {
                $scope.isRouteLoading = true;
                
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("farmasi/get-laporan-jasa-pelayanan-it?"
                    ).then(function (dat) {
                        
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        });   
                        
                        $scope.isRouteLoading = false;
                    });
            }

            function FormLoad() {
                LoadCombo();
                init();
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.dokter = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.group = [
            ];

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanJasaPelayananIT.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:E1", "A2:E2"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "LAPORAN JASA PELAYANAN IT",
                        fontSize: 16,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 60 });

                    
                    var myHeaders = [{
                        value: "",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });
                    
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },
                    {
                        
                        "field": "harga",
                        "title": "Jasa Pelayanan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpasien",
                        "title": "Qty",
                        "width": "100px",
                    },
                    {
                        
                        "field": "total",
                        "title": "Total Jasa Pelayanan",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: total #', '')}}",
                        groupFooterTemplate: "#: data.total.sum  #",
                        footerTemplate: "#: data.total.sum  #"
                    }
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});