define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPenjualanObatDetailCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listDataDokter = dat.data.dokter;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                    // init();
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    dok = "&dokid=" + $scope.item.dokter.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kp = "&kpid=" + $scope.item.kelompokPasien.id
                }
                var ru = ""
                if ($scope.item.ruangan != undefined) {
                    ru = "&ruid=" + $scope.item.ruangan.id
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var namaproduk = "";
                if ($scope.item.namaProduk != undefined) {
                    namaproduk = $scope.item.namaProduk
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("farmasi/get-laporan-penjualan-obat-detail?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&namaproduk=" + namaproduk +
                    dok + kp + ru
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        $scope.sumtotalhargajual = 0;
                        $scope.sumtotalhargabeli = 0;
                        $scope.sumtotalhargajualdiskon = 0;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            $scope.sumtotalhargajual= $scope.sumtotalhargajual + parseFloat(dat.data.daftar[i].totalhargajual)
                            $scope.sumtotalhargabeli= $scope.sumtotalhargabeli + parseFloat(dat.data.daftar[i].totalhargabeli)
                            $scope.sumtotalhargajualdiskon= $scope.sumtotalhargajualdiskon + parseFloat(dat.data.daftar[i].totalhargajualdiskon)
                            
                        }

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.daftar.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        totalhargajual: { type: "number" },
                                        totalhargabeli: { type: "number" },
                                        totalhargajualdiskon: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'totalhargajual', aggregate: 'sum' },
                                { field: 'totalhargabeli', aggregate: 'sum' },
                                { field: 'totalhargajualdiskon', aggregate: 'sum' },
                            ]
                        });                                             
                    });

                // var chacePeriode = {
                //     0: tglAwal,
                //     1: tglAkhir,
                //     2: '',
                //     3: '',
                //     4: '',
                //     5: '',
                //     6: ''
                // }
                // cacheHelper.set('DaftarResepCtrl2', chacePeriode);
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

            $scope.CetakLapDetail = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId
                    + '&strIdPegawai=' + tempDokterId + '&view=' + stt, function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapRekap = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId
                    + '&strIdPegawai=' + tempDokterId + '&view=' + stt, function (response) {
                        // do something with response

                    });
            }


            $scope.CetakLapBhpDetail = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat BHP? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat-Bhp=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId
                    + '&strIdPegawai=' + tempDokterId + '&view=' + stt, function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapBhpRekap = function () {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat BHP? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat-Bhp=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId
                    + '&strIdPegawai=' + tempDokterId + '&view=' + stt, function (response) {
                        // do something with response

                    });
            }

            $scope.CetakLapApotik = function () {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }

                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }

                var stt = 'false'
                if (confirm('View Laporan Kwitansi Apotik? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-KwitansiApotik=' + $scope.namaLengkap + '&tglAwal=' + tglAwal
                    + '&tglAkhir=' + tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId
                    + '&strIdPegawai=' + tempDokterId + '&view=' + stt, function (response) {
                    });
            }


            $scope.group = [
                // {
                //     field: "totalhargajual",
                //     aggregates: [
                //         {
                //             field: "namtotalhargajualaobat",
                //             aggregate: "sum"
                //         }
                //     ]
                // }
                // ,
                // {
                //     field: "gudang",
                //     aggregates: [
                //         {
                //             field: "gudang",
                //             aggregate: "count"
                //         }
                //     ]
                // },
                // {
                //     field: "user",
                //     aggregates: [
                //         {
                //             field: "user",
                //             aggregate: "count"
                //         }
                //     ]
                // }
            ];
            // {
            //     field: "gudang",
            //     aggregates: [
            //         {
            //             field: "gudang",
            //             aggregate: "count"
            //         }
            //     ]
            // },
            // {
            //     field: "user",
            //     aggregates: [
            //         {
            //             field: "user",
            //             aggregate: "count"
            //         }
            //     ]
            // }
            // $scope.aggregate = [
            //     {
            //         field: "departemen",
            //         aggregate: "count"
            //     }, 
            //     {
            //         field: "gudang",
            //         aggregate: "count"
            //     }, {
            //         field: "user",
            //         aggregate: "count"
            //     }
            // ]

            // $scope.image = {src:"images/asset/logo-medifirst2000.png"};

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
                    sheet.frozenRows = 4;
                    sheet.mergedCells = ["A1:I1", "A2:I2", "A3:I3", "A4:I4"];
                    sheet.name = "Report";
                    sheet.layout = "Landscape";

                    var myHeaders = [{
                        value: "LAPORAN PENJUALAN OBAT RAWAT JALAN",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 25 });

                    var mySecondHeaders = [{
                        value: "RSJ. GRHASIA",
                        fontSize: 10,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: mySecondHeaders, type: "header", height: 20 });

                    var myThirdHeaders = [{
                        value: "Jln. Kaliurang Km 17, Pakembinangun, Pakem, Sleman, Prop. DIY. Telp. (0274) 895297, 895142, 895143",
                        fontSize: 9,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(2, 0, { cells: myThirdHeaders, type: "header", height: 15 });

                    var tglAwalTemp = moment($scope.item.tglAwal).format('DD/MM/YYYY');
                    var tglAkhirTemp = moment($scope.item.tglAkhir).format('DD/MM/YYYY');
                    var myFourthHeaders = [{
                        value: "Periode: " + tglAwalTemp+" s/d "+tglAkhirTemp,
                        fontSize: 9,
                        textAlign: "left",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(3, 0, { cells: myFourthHeaders, type: "header", height: 15 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "namaobat",
                        "title": "Item Transaksi",
                        "width": "120px"
                    },
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "55px",
                    // },
                    {
                        
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                        template: "<span class='style-right'>{{formatTanggal('#: tanggal #', '')}}</span>"
                    },
                    {
                        // hidden: true,
                        "field": "qty",
                        "title": "Qty",
                        "width": "60px",
                        // aggregates: ["count"],
                        // groupHeaderTemplate:" Departemen : #= value #"
                    },
                    {
                        hidden: true,
                        field: "gudang",
                        title: "Gudang",
                        "width": "120px",
                        aggregates: ["count"],
                        groupHeaderTemplate: " Gudang : #= value # "
                    },
                    // {
                    //     hidden: true,
                    //     field: "user",
                    //     title: "User",
                    //     "width": "120px",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: " User : #= value # "
                    // },
                    // {
                    //     "field": "user",
                    //     "title": "User",
                    //     "width": "120px",
                    //     // aggregates: ["sum"],
                    //     // template: "<span class='style-right'>{{formatRupiah('#: tunai  #', '')}}",
                    //     // groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}",
                    //     // footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}"
                    // },                   
                    
                    // {
                    //     "field": "norm",
                    //     "title": "No. RM",
                    //     "width": "120px",
                    // },
                    {
                        "field": "harganetto",
                        "title": "Harga Beli Satuan",
                        "width": "120px",
                    },
                    {
                        "field": "hargajual",
                        "title": "Harga Jual Satuan",
                        "width": "120px",
                        footerTemplate: "Total"
                    },
                    
                    // /
                    {
                        "field": "totalhargabeli",
                        "title": "Total Harga Beli",
                        "width": "120px",
                        aggregates: ["sum"],
                        template: "#: totalhargabeli  #",
                        groupFooterTemplate: "#: data.totalhargabeli.sum  #",
                        footerTemplate: "#: data.totalhargabeli.sum  #"
                    },
                    {
                        "field": "totalhargajual",
                        "title": "Total  Harga Jual",
                        "width": "120px",
                        aggregates: ["sum"],
                        template: "#: totalhargajual  #",
                        groupFooterTemplate: "#: data.totalhargajual.sum  #",
                        footerTemplate: "#: data.totalhargajual.sum  #"
                    },
                    {
                        "field": "persendiskon",
                        "title": "%",
                        "width": "80px",
                    },
                    {
                        "field": "totalhargajualdiskon",
                        "title": "Total Harga Jual Diskon",
                        "width": "120px",
                        aggregates: ["sum"],
                        template: "#: totalhargajualdiskon  #",
                        groupFooterTemplate: "#: data.totalhargajualdiskon.sum  #",
                        footerTemplate: "#: data.totalhargajualdiskon.sum  #"
                    }
                    // {
                    //     "title": "Pasien",
                    //     headerAttributes: { style: "text-align : center" },
                    //     "columns": [
                    //         {
                    //             "field": "noregistrasi",
                    //             "title": "Noregistrasi",
                    //             "width": "100px",
                    //         },
                    //         {
                    //             "field": "nocm",
                    //             "title": "No. RM",
                    //             "width": "100px",
                    //         },
                    //         {
                    //             "field": "namapasien",
                    //             "title": "Nama Pasien",
                    //             "width": "120px",
                                //    footerTemplate: "<span>Total </span>"
                    //         },
                    //     ]
                    // },
                    // {
                    //     "title": "Dokter",
                    //     headerAttributes: { style: "text-align : center" },
                    //     "columns": [
                    //         {
                    //             "field": "dokter",
                    //             "title": "Nama",
                    //             "width": "100px",
                    //         },
                    //         {
                    //             "field": "noresep",
                    //             "title": "No. Resep",
                    //             "width": "100px",
                    //         }
                    //     ]
                    // },
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});