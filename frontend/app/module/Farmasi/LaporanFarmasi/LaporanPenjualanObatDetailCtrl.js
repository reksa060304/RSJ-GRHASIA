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
                    $scope.listRuangan = dat.data.ruanganall;
                    $scope.listDataDokter = dat.data.dokter;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listNamaItem = dat.data.produkall;
                    $scope.listRajalRanap = [
                        { id: 1, names: "Rawat Jalan" },
                        { id: 2, names: "Rawat Inap"}
                    ];
                    $scope.listIsObat = [
                        { id: 1, isobat: true },
                        { id: 2, isobat: false}
                    ];
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
                var rajalRanap = "";
                if ($scope.item.rajalRanap != undefined) {
                    rajalRanap = $scope.item.rajalRanap.id
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

                var isobat = "";
                if ($scope.item.isObat != undefined) {
                    isobat = $scope.item.isObat.isobat
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-laporan-penjualan-obat-detail?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&rajalRanap=" + rajalRanap +
                    "&isobat=" + isobat +
                    dok + kp + ru + namaItem + namaItemText + namaPasienText
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        $scope.totaltunai = 0;
                        $scope.totalpenjamin = 0;
                        $scope.totaljumlah = 0;
                        $scope.grandtotal = 0;
                        // console.log(dat.data.daftar);
                        
                        // console.log(sudahbayar);
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            dat.data.daftar[i].totaljumlah = parseFloat(dat.data.daftar[i].totaljumlah) * parseFloat(dat.data.daftar[i].jumlah)
                            dat.data.daftar[i].grandtotal = parseFloat(dat.data.daftar[i].grandtotal) * parseFloat(dat.data.daftar[i].subtotal)
                            var sudahbayar = 'TIDAK ADA STATUS';
                            if(dat.data.daftar[i].tglsbm == null){
                                dat.data.daftar[i].sudahbayar = "BELUM BAYAR";
                            }else{
                                dat.data.daftar[i].sudahbayar = "SUDAH BAYAR";
                            }
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

                var tempNama = "";
                if ($scope.item.namaItem != undefined) {
                  tempNama = "&namaItem=" + $scope.item.namaItem;
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
                {
                    field: "namaproduk",
                    aggregates: [
                        { field: "jumlah", aggregate: 'sum' },
                        { field: "subtotal", aggregate: 'sum' },
                    ]
                }
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
                        value: "Laporan Pengeluaran Obat",
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
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "55px",
                    // },
                    {
                        "field": "tglresep",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        "field": "penginput",
                        "title": "Penginput",
                        "width": "100px",
                    },
                    {
                        // hidden: true,
                        "field": "departemen",
                        "title": "Departemen",
                        "width": "120px",
                        // aggregates: ["count"],
                        // groupHeaderTemplate:" Departemen : #= value #"
                    },
                    {
                        field: "namaruanganpasien",
                        title: "Depo Farmasi",
                        "width": "120px",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Depo Farmasi : #= value # "
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
                    {
                        "field": "rke",
                        "title": "R/",
                        "width": "50px",
                    },                 
                    {
                        "field": "namaproduk",
                        "title": "Nama Item",
                        "width": "120px",
                        groupHeaderTemplate: "#= value #",
                    },
                    
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "120px",
                        footerTemplate: "Total",
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "#: jumlah  #",
                        groupFooterTemplate: "#: data.jumlah.sum  #",
                        footerTemplate: "#: data.jumlah.sum  #"
                    },
                    {
                        "field": "hargajual",
                        "title": "Harga",
                        "width": "100px",
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Harga Discount",
                        "width": "100px",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "#: subtotal  #",
                        groupFooterTemplate: "#: data.subtotal.sum  #",
                        footerTemplate: "#: data.subtotal.sum  #"
                    },
                    {
                        "field": "sudahbayar",
                        "title": "Status Bayar",
                        "width": "100px",
                    },
                    {
                        "title": "Pasien",
                        headerAttributes: { style: "text-align : center" },
                        "columns": [
                            {
                                "field": "noregistrasi",
                                "title": "Noregistrasi",
                                "width": "100px",
                            },
                            {
                                "field": "nocm",
                                "title": "No. RM",
                                "width": "100px",
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "120px",
                                //    footerTemplate: "<span>Total </span>"
                            },
                            {
                                "field": "noidentitas",
                                "title": "NIK",
                                "width": "100px",
                            }
                        ]
                    },
                    {
                        "title": "Dokter",
                        headerAttributes: { style: "text-align : center" },
                        "columns": [
                            {
                                "field": "dokter",
                                "title": "Nama",
                                "width": "100px",
                            },
                            {
                                "field": "noresep",
                                "title": "No. Resep",
                                "width": "100px",
                            }
                        ]
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