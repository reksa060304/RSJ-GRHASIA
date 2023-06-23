define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanStokRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.gudang = true
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPemakaianStokRuanganCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    // init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
                    // init();
                }
            }

            function loadCombo() {
                $scope.listLaporan = [
                    {
                        id: 1,
                        laporan: 'Pemakaian Stok Ruangan'
                    },
                    {
                        id: 2,
                        laporan: 'Gudang to Ruangan'
                    },
                ]
                medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                    $scope.listRuang = data

                })
                $scope.listRuanganGudang = medifirstService.getMapLoginUserToRuangan();
            }

            function init() {
                $scope.isRouteLoading = true;
                var nostruk = ""
                if ($scope.item.nostruk != undefined)
                    nostruk = "&nostruk=" + $scope.item.nostruk
                var ket = ""
                if ($scope.item.keterangan != undefined)
                    ket = "&keterangan=" + $scope.item.keterangan
                var ruid = ""
                if ($scope.item.ruangan != undefined)
                    ruid = "&ruanganid=" + $scope.item.ruangan.value
                var gudang = ""
                if ($scope.item.gudang != undefined)
                    gudang = "&gudangid=" + $scope.item.gudang.id

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-stok-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    nostruk + ket + ruid + gudang
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageSize: 10,
                            total: dat.data.length,
                            serverPaging: false,
                        })
                        pegawaiUser = dat.data.datalogin
                    });
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPemakaianStokRuanganCtrl', chacePeriode);
            }

            $scope.addPemakaian = function () {
                $state.go("PemakaianStokRuangan")
            }
            $scope.cariFilter = function () {
                if ($scope.item.gudang == undefined) {
                    toastr.error('Ruangan Gudang tidak boleh kosong')
                    return
                }
                if($scope.item.ruangan == undefined) {
                    toastr.error('Ruangan tidak boleh kosong')
                    return
                }
                init();
            }

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.CetakBukti = function () {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpermintaanbarang=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }

            $scope.editPemakaian = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu', 'Error')
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditPemakaian',
                    2: '',
                    3: '',
                    4: $scope.dataSelected,
                    5: '',
                    6: ''
                }
                cacheHelper.set('PemakaianStokRuanganCtrl', chacePeriode);
                $state.go('PemakaianStokRuangan')
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "laporanstokruangan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Laporan Stok " +$scope.item.ruangan.text + " RS Jiwa Grhasia",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                columns: [
          
                {
                    "field": "no",
                    "title": "No",
                    "width": "25px",
                },
                {
                    "field": "namaproduk",
                    "title": "Uraian Jenis Persediaan",
                    "width": "100px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "50px",
                },
                {
                    "title": "Stok Masuk",
                    "columns": [
                        {
                            "field": "saldomasuk",
                            "title": "Jumlah Masuk",
                            "width": "70px",

                        },
                        {
                            "field": "harganetto1",
                            "title": "Nilai Faktur",
                            "width": "70px",
                        },
                    ]
                },
                {
                    "title": "Stok Keluar",
                    "columns": [{
                            "field": "saldokeluar",
                            "title": "Jumlah Keluar",
                            "width": "70px",
                        },
                        {
                            "field": "harganetto1",
                            "title": "Jumlah Harga",
                            "width": "70px",
                        },
                        {
                            "field": "saldokeluargudang",
                            "title": "Jumlah Keluar Gudang",
                            "width": "70px",
                        },
                    ]
                },
                {
                    "title": "Stok Akhir",
                    "columns": [{
                            "title": "Jumlah",
                            "columns": [
                                {
                                    "field": "saldoakhirgudang",
                                    "title": "Gudang",
                                    "width": "70px",
                                },
                                {
                                    "field": "saldoakhir",
                                    "title": "Ruangan",
                                    "width": "70px",
                                },
                                {
                                    "field": "totalakhir",
                                    "title":"TOTAL",
                                    "width": "70px",
                                }
                            ]
                        },
                        {
                            "field": "harganetto1",
                            "title": "Harga Satuan",
                            "width": "70px",
                        },
                        {
                            "field": "jumlahharga",
                            "title": "Jumlah Harga",
                            "width": "70px",
                        }
                    ]
                },
            ]
        }

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "50px"
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "20px",
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn '// + bln + ' bln'
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

            $scope.hapusPemakaian = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu', 'Error')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin mau menghapus data ini !? ')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')
                $mdDialog.show(confirm).then(function () {
                    $scope.Hapus($scope.dataSelected.norec);

                })
            }

            $scope.Hapus = function (norecSP) {
                var data = {
                    "nostruk": norecSP,
                }
                medifirstService.post('logistik/delete-pemakaian-ruangan', data).then(function (e) {
                    init()
                })

            }
            $scope.$watch('item.laporan', function (newValue, oldValue) {
                if ($scope.item.laporan.id == 1) {
                    $scope.gudang = true
                } else {
                    $scope.gudang = false
                }
            })
            //***********************************
        }
    ]);
});
