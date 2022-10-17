define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapResepCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.listJenisKemasan = [
                { id: 1, jeniskemasan: "Racikan" },
                { id: 2, jeniskemasan: "Non Racikan"}
            ];

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listNamaItem = dat.data.produkall;
                });

                medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
                    $scope.listCaraBayar = dat.data.dataCB;
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kp = "&kpid=" + $scope.item.kelompokPasien.id
                }
                var cb = ""
                if ($scope.item.caraBayar != undefined) {
                    cb = "&cbid=" + $scope.item.caraBayar.id
                }
                var jk = ""
                if ($scope.item.jeniskemasan != undefined) {
                    jk = "&jkid=" + $scope.item.jeniskemasan.id
                }
                var namaItem = "";
                if ($scope.item.namaItem != undefined) {
                  namaItem = "&namaItem=" + $scope.item.namaItem.id;
                }
                var namaItemText="";
                
                var namaItemText = "";
                if ($scope.item.namaItemText != undefined) {
                  namaItemText = "&namaItemText=" + $scope.item.namaItemText;
                }

                var namaPasienText="";
                
                var namaPasienText = "";
                if ($scope.item.namaPasienText != undefined) {
                  namaPasienText = "&namaPasienText=" + $scope.item.namaPasienText;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-laporan-rekap-resep-perhari?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    kp + namaItem + namaItemText + namaPasienText + cb + jk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        // console.log(dat.data.daftar);

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.daftar.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlah: { type: "number" },
                                        subtotal: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlah', aggregate: 'sum' },
                                { field: 'subtotal', aggregate: 'sum' },
                            ]
                        });                                             
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
                $scope.item.kelompokPasien = undefined;
                $scope.item.dokter = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
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
                    fileName: "LaporanPengeluaranObat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Laporan Rekap Resep Per Hari",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "tglresep",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kelompok Pasien",
                        "width": "100px",
                    },
                    {
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "100px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "120px",
                    },  
                    {
                        "field": "jeniskemasan",
                        "title": "Jenis Kemasan",
                        "width": "100px",
                    },                 
                    {
                        "field": "keteranganpakai",
                        "title": "Keterangan Racikan",
                        "width": "120px",
                    },
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});