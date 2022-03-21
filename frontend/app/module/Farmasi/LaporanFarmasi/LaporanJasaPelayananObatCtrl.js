define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanJasaPelayananObatCtrl', ['$scope', 'DateHelper', 'MedifirstService',
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
                    $scope.dataLogin = medifirstService.getPegawaiLogin();
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            
            function init() {
                $scope.isRouteLoading = true;
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    dok = "&dokid=" + $scope.item.dokter.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("farmasi/get-laporan-jasa-pelayanan-obat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempDepartemen
                    + dok
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
                                        jumlahhargasarana: { type: "number" },
                                        jumlahhargapelayanan: { type: "number" },
                                        jumlahpertanggal: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahhargasarana', aggregate: 'sum' },
                                { field: 'jumlahhargapelayanan', aggregate: 'sum' },
                                { field: 'jumlahpertanggal', aggregate: 'sum' },
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
                    fileName: "LaporanJasaPelayananResep.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1", "A2:J2", "A3:J3"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    var akhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "LAPORAN JASA PELAYANAN OBAT",
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
                        "title": "Nama Pelayanan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "instalasi",
                        "title": "Ruangan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namalengkap",
                        "title": "DPJP",
                        "width": "100px",
                    },
                    {
                        
                        "field": "hargasarana",
                        "title": "Jasa Sarana",
                        "width": "100px",
                        template: "{{formatRupiah('#: hargasarana #', '')}}"
                    },
                    {
                        
                        "field": "hargapelayanan",
                        "title": "Jasa Pelayanan",
                        "width": "100px",
                        template: "{{formatRupiah('#: hargapelayanan #', '')}}"
                    },
                    {
                        
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "100px",
                        footerTemplate: "Total"
                    },
                    {
                        
                        "field": "jumlahhargasarana",
                        "title": "Total Sarana",
                        "width": "100px",
                        
                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: jumlahhargasarana #', '')}}",
                        groupFooterTemplate: "#: data.jumlahhargasarana.sum  #",
                        footerTemplate: "#: data.jumlahhargasarana.sum  #"
                    },
                    {
                        
                        "field": "jumlahhargapelayanan",
                        "title": "Total Pelayanan",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: jumlahhargapelayanan #', '')}}",
                        groupFooterTemplate: "#: data.jumlahhargapelayanan.sum  #",
                        footerTemplate: "#: data.jumlahhargapelayanan.sum  #"
                    },
                    {
                        
                        // "field": "totalpertanggal",
                        "title": "Total / Tanggal",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "{{formatRupiah('#: jumlahpertanggal #', '')}}",
                        groupFooterTemplate: "#: data.jumlahpertanggal.sum  #",
                        footerTemplate: "#: data.jumlahpertanggal.sum  #"
                    },
                    {
                        
                        "field": "pegawaiinput",
                        "title": "Penginput",
                        "width": "100px",
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