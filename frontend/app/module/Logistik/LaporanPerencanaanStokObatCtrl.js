define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPerencanaanStokObatCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm');

            function init() {
                $scope.isRouteLoading = true;
                
                var periode = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var kebutuhan = parseInt($scope.item.kebutuhan);
                medifirstService.get("logistik/get-perencanaan-kebutuhan?" +
                    "periode=" + periode +
                    "&kebutuhan=" + kebutuhan
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 1500,
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
            
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanPerencanaanStokObat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1", "A2:I2"];
                    sheet.name = "Orders";
                    var tahun = moment($scope.item.tglAwal).format('YYYY');
                    var periode = moment($scope.item.tglAwal).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "LAPORAN STOK OBAT INSTALASI FARMASI RSJ GRHASIA TAHUN "+tahun,
                        fontSize: 15,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "Periode: "+periode,
                        fontSize: 15,
                        textAlign: "left",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(2, 0, { cells: myHeaders, type: "header", height: 20 });

                    var columns = e.workbook.sheets[0].columns;
                    delete columns[2].width;
                    columns[2].width = 10;

                    delete columns[3].width;
                    columns[3].width = 15;
                    delete columns[4].width;
                    columns[4].width = 15;
                    delete columns[5].width;
                    columns[5].width = 15;
                    delete columns[6].width;
                    columns[6].width = 15;
                    delete columns[7].width;
                    columns[7].width = 15;
                    delete columns[8].width;
                    columns[8].width = 15;


                    
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
                        "title": "Uraian Jenis Persediaan",
                        "headerTemplate": "<span class='style-center'>Uraian Jenis Persediaan</span>",
                        columns: [
                            {
                                field: "namaproduk",
                                title: "Nama Obat",
                            },
                        ],
                    }, 
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                    },
                    {
                        "title": "Stok Keluar",
                        "headerTemplate": "<span class='style-center'>Stok Keluar</span>",
                        columns: [
                            {
                                "field": "jumlahbulankesatu",
                                "title": "Bulan I",
                            },
                            {
                                "field": "jumlahbulankedua",
                                "title": "Bulan II",
                            },
                            {
                                "field": "jumlahbulanketiga",
                                "title": "Bulan III",
                            },
                            {
                                "field": "jumlahbulankeempat",
                                "title": "Bulan IV",
                            },
                        ],
                    },
                    {
                        "field": "stokakhir",
                        "title": "Stok Akhir",
                    },
                    {
                        "field": "jumlahkebutuhan",
                        "title": "Kebutuhan",
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
