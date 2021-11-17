define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRawatInapCtrl', ['CacheHelper', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, $http, $state, medifirstService) {
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.isRouteLoading = false;
            medifirstService.get("kasir/get-data-combo-kasir", true).then(function (dat) {
                $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                $scope.listPegawaiKasir = dat.data.datakasir;
                $scope.listKelompokPasien = dat.data.kelompokpasien;
                $scope.dataLogin = medifirstService.getPegawaiLogin();
            });
            
            medifirstService.get("kasir/get-data-combo-ruangan", true).then(function (dat) {
                $scope.listRuanganRanap = dat.data.ruangan_ranap;
                $scope.listRuanganRajal = dat.data.ruangan_rajal;
            });

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }
            
            $scope.CariLapPenerimaanKasirRanap = function () {
                LoadDataRanap()
            }

            $scope.CariLapPenerimaanKasirRajal = function () {
                LoadDataRajal()
            }

            function LoadDataRanap() {                
                $scope.isRouteLoading = true;
                var jenisPelayanan = "";
                if ($scope.item.jenispelayanan != undefined) {
                    jenisPelayanan = $scope.item.jenispelayanan.id;
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuangan = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuangan = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var kelompokPasien = "";
                if ($scope.item.kelompokpasien != undefined) {
                    kelompokPasien = "&kelPasien=" + $scope.item.kelompokpasien.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRawatInapCtrl', chacePeriode);

                $scope.item.totalranap = 0;
                $scope.laporanPenerimaanPerusahaan == false
                medifirstService.get("kasir/get-laporan-jaspel-ranap-rajal?"
                    + "jenisPelayanan=" + jenisPelayanan
                    + "&tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&idDept=16"
                    + tempRuangan
                    + kelompokPasien
                ).then(function (data) {
                     $scope.isRouteLoading = false;
                     $scope.item.totalranap  = 0
                    for (let i = 0; i < data.data.data.length; i++) {
                        if(data.data.data[i].total_all)
                        $scope.item.totalranap = $scope.item.totalranap + parseFloat(data.data.data[i].total_all);
                    }
                    $scope.dataLaporanRanap = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        total: data.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    tglMasuk: { type: "date" },
                                    tglPulang: { type: "date" }
                                }
                            }
                        }
                    });
                })
            }
            
            function LoadDataRajal() {                
                $scope.isRouteLoading = true;
                var jenisPelayanan = "";
                if ($scope.item.jenispelayanan != undefined) {
                    jenisPelayanan = $scope.item.jenispelayanan.id;
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuangan = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuangan = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var kelompokPasien = "";
                if ($scope.item.kelompokpasien != undefined) {
                    kelompokPasien = "&kelPasien=" + $scope.item.kelompokpasien.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRawatInapCtrl', chacePeriode);

                $scope.item.totalrajal = 0;
                $scope.laporanPenerimaanPerusahaan == false
                medifirstService.get("kasir/get-laporan-jaspel-ranap-rajal?"
                    + "jenisPelayanan=" + jenisPelayanan
                    + "&tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&idDept=18"
                    + tempRuangan
                    + kelompokPasien
                ).then(function (data) {
                     $scope.isRouteLoading = false;
                     $scope.item.totalrajal  = 0
                    for (let i = 0; i < data.data.data.length; i++) {
                        if(data.data.data[i].total_all)
                        $scope.item.totalrajal = $scope.item.totalrajal + parseFloat(data.data.data[i].total_all);
                    }
                    $scope.dataLaporanRajal = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        total: data.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    tglMasuk: { type: "date" },
                                    tglPulang: { type: "date" }
                                }
                            }
                        }
                    });
                })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                //debugger;
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnLaporanRanap = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "60px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Transaksi",
                    "width": "120px",
                    "template": "<span class='style-center'>#: noregistrasi #</span>"
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tanggal",
                    "width": "180px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "120px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "180px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Terakhir",
                    "width": "120px"
                },
                // {
                //     "field": "ruanganasal",
                //     "title": "Ruangan Asal",
                //     "width": "120px"
                // },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "180px"
                },
                {
                    "field": "tipe",
                    "title": "Tipe",
                    "width": "120px"
                },
                {
                    "field": "obat",
                    "title": "Obat",
                    "width": "180px",
                },
                {
                    "field": "totalobat",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalobat #','')}}</span>",
                },
                {
                    "field": "tindakan",
                    "title": "Nama Tindakan",
                    "width": "180px",
                },
                {
                    "field": "qtytindakan",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaltindakan",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_tindakan",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_tindakan",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "lab",
                    "title": "LAB",
                    "width": "180px",
                },
                {
                    "field": "qtylab",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totallab",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_lab",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_lab",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "radiologi",
                    "title": "RAD",
                    "width": "180px",
                },
                {
                    "field": "qtyradiologi",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totalradiologi",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_rad",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_rad",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "askep",
                    "title": "ASKEP",
                    "width": "180px",
                },
                {
                    "field": "qtyaskep",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totalaskep",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_askep",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_askep",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "dokterumum",
                    "title": "Dokter Umum",
                    "width": "180px",
                },
                {
                    "field": "qtydokterumum",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaldokterumum",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_dokterumum",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_dokterumum",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "dokterspe",
                    "title": "Dokter Spesialis",
                    "width": "180px",
                },
                {
                    "field": "qtydokterspe",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaldokterspe",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_dokterspe",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_dokterspe",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "operasi",
                    "title": "Operasi",
                    "wifth": "120px"
                },
                {
                    "field": "dokteroperasi",
                    "title": "Dokter",
                    "wifth": "120px"
                },
                {
                    "field": "qtyoperasi",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaloperasi",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_operasi",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_operasi",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "oxygen",
                    "title": "Oxygen",
                    "width": "180px",
                },
                {
                    "field": "qtyoxygen",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaloxygen",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_oxygen",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_oxygen",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "ruang",
                    "title": "Ruang",
                    "wifth": "120px"
                },
                {
                    "field": "qtyruang",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totalruang",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_ruang",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_ruang",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "adm",
                    "title": "ADM",
                    "width": "180px",
                },
                {
                    "field": "qtyadm",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaladm",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_adm",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_adm",
                    "title": "Total JP",
                    "width": "180px",
                },
                {
                    "field": "dpjputama",
                    "title": "DPJP Utama All",
                    "width": "180px",
                },
                {
                    "field": "total_all",
                    "title": "Total RS All",
                    "width": "180px",
                },
                {
                    "field": "nosep",
                    "title": "No. SEP",
                    "width": "180px",
                    "template": "<span class='style-center'>#: nosep #</span>"
                },
                {
                    "field": "dokter_pemeriksa",
                    "title": "Dokter Tindakan",
                    "width": "180px",
                },
            ];

            $scope.columnLaporanRajal = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "60px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Transaksi",
                    "width": "120px",
                    "template": "<span class='style-center'>#: noregistrasi #</span>"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tanggal",
                    "width": "180px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "nocm",
                    "title": "No RM",
                    "width": "120px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "180px"
                },
                {
                    "field": "namaruangan",
                    "title": "Poli",
                    "width": "120px"
                },
                {
                    "field": "dokter_pemeriksa",
                    "title": "Dokter",
                    "width": "180px"
                },
                {
                    "field": "tipe",
                    "title": "Tipe",
                    "width": "120px"
                },
                {
                    "field": "obat",
                    "title": "Obat",
                    "width": "180px",
                },
                {
                    "field": "totalobat",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalobat #','')}}</span>",
                },
                {
                    "field": "tindakan",
                    "title": "Nama Tindakan",
                    "width": "180px",
                },
                {
                    "field": "qtytindakan",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totaltindakan",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_tindakan",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_tindakan",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "pendaftaran",
                    "title": "Pendaftaran",
                    "width": "180px",
                },
                {
                    "field": "qty_pendaftaran",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "total_pendaftaran",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_pendaftaran",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_pendaftaran",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "lab",
                    "title": "LAB",
                    "width": "180px",
                },
                {
                    "field": "qtylab",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totallab",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_lab",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_lab",
                    "title": "Total JP",
                    "width": "180px",
                },
                // =========================
                {
                    "field": "radiologi",
                    "title": "RAD",
                    "width": "180px",
                },
                {
                    "field": "qtyradiologi",
                    "title": "QTY",
                    "width": "100px",
                },
                {
                    "field": "totalradiologi",
                    "title": "Total",
                    "width": "180px",
                },
                {
                    "field": "js_rad",
                    "title": "Total JS",
                    "width": "180px",
                },
                {
                    "field": "jp_rad",
                    "title": "Total JP",
                    "width": "180px",
                },
                {
                    "field": "dpjputama",
                    "title": "DPJP Utama All",
                    "width": "180px",
                },
                {
                    "field": "total_all",
                    "title": "Total RS All",
                    "width": "180px",
                },
                {
                    "field": "nosep",
                    "title": "No. SEP",
                    "width": "180px",
                    "template": "<span class='style-center'>#: nosep #</span>"
                },
            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.mainGroupOptionsLapRanap = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarLaporanRanap.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    // sheet.mergedCells = ["A1:BI1"];
                    sheet.name = "Rawat Inap";

                    // var myHeaders = [{
                    //     value: "Daftar Laporan Rawat Inap",
                    //     fontSize: 20,
                    //     textAlign: "center",
                    //     background: "#ffffff"
                    // }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: {
                    messages: {
                        display: "Showing {0} - {1} from {2} data items",
                    },
                },
                columns: $scope.columnLaporanRanap,            
                selectable: true,
                refresh: true,
                scrollable: true,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },
            };

            
            $scope.mainGroupOptionsLapRajal = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarLaporanRajal.xlsx",
                    allPages: true,
                },
                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    // sheet.mergedCells = ["A1:BI1"];
                    sheet.name = "Rawat Jalan";

                    // var myHeaders = [{
                    //     value: "Daftar Laporan Rawat Inap",
                    //     fontSize: 20,
                    //     textAlign: "center",
                    //     background: "#ffffff"
                    // }];

                    // sheetrows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: {
                    // pageSize: 5,
                    // previousNext: false,
                    messages: {
                        display: "Showing {0} - {1} from {2} data items",
                    },
                },
                columns: $scope.columnLaporanRajal,
                // dataSource:$scope.dataSourceLaporanLayanan,            
                selectable: true,
                refresh: true,
                scrollable: true,
                // dataSource: $scope.dataSourceLaporanLayanan2,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },
            };

            // Clear Kriteria Search
            $scope.ClearSearchRanap = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPenerimaanKasirRanap();
            }
            $scope.ClearSearchRajal = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPenerimaanKasirRajal();
            }
        }
    ]);
});