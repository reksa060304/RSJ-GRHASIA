define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanJasaPelayananDokterCtrl', ['$scope', 'DateHelper', 'MedifirstService',
        function ($scope, DateHelper, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.isLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
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

                var listProduk = ""
				if ($scope.item.listProdukMulti != undefined) {
                    listProduk = $scope.item.listProdukMulti.id;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("farmasi/get-laporan-jasa-pelayanan-dokter?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + "&ProdukArr=" + listProduk
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
                                        hargajual: { type: "number" },
                                        hargajualpelayanan: { type: "number" },
                                        total: { type: "number" },
                                        totalpelayanan: { type: "number" },
                                        totalsaranadanpelayanan: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargajual', aggregate: 'sum' },
                                { field: 'hargajualpelayanan', aggregate: 'sum' },
                                { field: 'total', aggregate: 'sum' },
                                { field: 'totalpelayanan', aggregate: 'sum' },
                                { field: 'totalsaranadanpelayanan', aggregate: 'sum' },
                            ]
                        });   
                        
                        $scope.isRouteLoading = false;
                    });
            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
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
                    fileName: "LaporanJasaPelayananDokter.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:G1", "A2:G2", "A3:G3"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    var akhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "LAPORAN FAKTOR PELAYANAN FARMASI",
                        fontSize: 16,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "Periode " + awal + " sampai dengan "+akhir,
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });

                    var myHeaders = [{
                        value: "",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(2, 0, { cells: myHeaders, type: "header", height: 20 });
                    
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
                        
                        "field": "tglpelayanan",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namapegawaiinput",
                        "title": "Penginput",
                        "width": "100px",
                    },
                    {
                        
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nama",
                        "title": "DPJP",
                        "width": "100px",
                    },
                    {
                        
                        "field": "hargajual",
                        "title": "Jumlah Sarana",
                        "width": "100px",

                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: hargajual #', '')}}",
                        groupFooterTemplate: "#: data.hargajual.sum  #",
                        footerTemplate: "#: data.hargajual.sum  #"
                    },
                    {
                        
                        "field": "hargajualpelayanan",
                        "title": "Jumlah Pelayanan",
                        "width": "100px",

                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: hargajualpelayanan #', '')}}",
                        groupFooterTemplate: "#: data.hargajualpelayanan.sum  #",
                        footerTemplate: "#: data.hargajualpelayanan.sum  #"
                    },
                    {
                        
                        "field": "totaljumlah",
                        "title": "Qty",
                        "width": "100px",
                    },
                    {
                        
                        "field": "total",
                        "title": "Total Sarana",
                        "width": "100px",

                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: total #', '')}}",
                        groupFooterTemplate: "#: data.total.sum  #",
                        footerTemplate: "#: data.total.sum  #"
                    },
                    {
                        
                        "field": "totalpelayanan",
                        "title": "Total Pelayanan",
                        "width": "100px",
                        
                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: totalpelayanan #', '')}}",
                        groupFooterTemplate: "#: data.totalpelayanan.sum  #",
                        footerTemplate: "#: data.totalpelayanan.sum  #"
                    },
                    {
                        
                        "field": "totalsaranadanpelayanan",
                        "title": "Total Sarana dan Pelayanan",
                        "width": "100px",

                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: totalsaranadanpelayanan #', '')}}",
                        groupFooterTemplate: "#: data.totalsaranadanpelayanan.sum  #",
                        footerTemplate: "#: data.totalsaranadanpelayanan.sum  #"
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