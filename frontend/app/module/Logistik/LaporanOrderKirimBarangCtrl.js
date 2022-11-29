define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanOrderKirimBarangCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm');
            LoadCombo()

            function LoadCombo(){
                medifirstService.get("logistik/get-combo-logistik?", true).then(function (dat) {                                                   
                    $scope.listNoOrder = dat.data.noorder;
                });
            }

            function init() {
                $scope.isRouteLoading = true;

                var noorder = ''
                if($scope.item.noorder != undefined && $scope.item.noorder != ''){
                    noorder = $scope.item.noorder.noorder
                }
                
                var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                console.log($scope.item.tglAkhir)
                medifirstService.get("logistik/get-rekap-order-kirim-barang?" +
                    "tglAwal=" + tglawal +
                    "&tglAkhir=" + tglakhir +
                    "&noorder=" + noorder
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 150,
                            total: datas.length,
                            serverPaging: false, 
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                        
                    });
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.cetakBlade = function () {
                var noorder = ''
                if($scope.item.noorder != undefined && $scope.item.noorder != ''){
                    noorder = $scope.item.noorder.noorder
                }
                
                var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                window.open(baseTransaksi + "report/get-rekap-order-kirim-barang-cetak?" +
                "tglAwal=" + tglawal +
                "&tglAkhir=" + tglakhir +
                "&noorder=" + noorder, '_blank');
            }
            
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    
                    {
                        name: "excel", text: "Cetak"
                    }
                    
                ],
                excel: {
                    fileName: "LaporanOrderKirimBarang.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:D1", "A2:D2"];
                    sheet.name = "Orders";
                    var tahun = moment($scope.item.tglAwal).format('YYYY');
                    var periode = moment($scope.item.tglAwal).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "LAPORAN REKAP ORDER DAN KIRIM BARANG",
                        fontSize: 15,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });

                    var columns = e.workbook.sheets[0].columns;
                    delete columns[2].width;
                    columns[2].width = 15;
                    delete columns[2].width;
                    columns[2].width = 10;

                    delete columns[3].width;
                    columns[3].width = 15;


                    
                },
                selectable: 'row',
                pageable: true,
                scrollable: false,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                    }, 
                    {
                        "field": "ruanganorder",
                        "title": "Ruangan Order",
                    }, 
                    {
                        "field": "ruangankirim",
                        "title": "Ruangan Kirim",
                    }, 
                    {
                        "field": "tglorder",
                        "title": "Tgl Order",
                    },
                    {
                        "field": "tglkirim",
                        "title": "Tgl Kirim",
                    },
                    {
                        "field": "jumlahorder",
                        "title": "Qty Order",
                    },
                    {
                        "field": "jumlahkirim",
                        "title": "Qty Kirim",
                    },
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatNumber = function (value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
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
            //***********************************
        }
    ]);
});
