define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPemakaianStokRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPemakaianStokRuanganCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function loadCombo() {
                $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
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
                    ruid = "&ruanganid=" + $scope.item.ruangan.id

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-pemakaian-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    nostruk + ket + ruid
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
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
                    fileName: "DaftarPemakaianStokRuangan.xlsx",
                    allPages: true,
                },
                excelExport: function(e) {
                var sheet = e.workbook.sheets[0];
                sheet.rows = []; // hapus sheet default
                sheet.name = "Pemakaian Ruangan";
                sheet.frozenRows = 1;

                // Header judul besar
                var titleRow = {
                    cells: [
                        { value: "Daftar Pemakaian Stok Ruangan", colSpan: 6, textAlign: "center", fontSize: 18, bold: true }
                    ],
                    type: "header",
                    height: 30
                };

                // Data main
                var data =  e.data;

                // Tambahkan header utama
                sheet.rows.push(titleRow);
                sheet.rows.push({
                        cells: [
                            { value: "No", bold: true },
                            { value: "Tanggal", bold: true },
                            { value: "No Pemakaian", bold: true },
                            { value: "Keterangan", bold: true },
                            { value: "Ruangan", bold: true },
                            { value: "Pegawai", bold: true },
                            { value: "Total", bold: true }
                        ],
                        type: "header",
                        height: 25
                    });

                // Loop grup data
                data.forEach(function(group) {
                    // Baris header grup
                    sheet.rows.push({
                        cells: [
                            { value: group.no },
                            { value: group.tglstruk },
                            { value: group.nostruk },
                            { value: group.keterangan },
                            { value: group.namaruangan },
                            { value: group.namapegawai },
                            { value: group.total }
                        ],
                        bold: true,
                        background: "#f5f5f5"
                    });

                    // Header kolom
                    sheet.rows.push({
                        cells: [
                            { value: "-", bold: true },
                            { value: "Deskripsi", bold: true },
                            { value: "Satuan", bold: true },
                            { value: "Qty", bold: true },
                            { value: "Harga Satuan", bold: true },
                            { value: "Total", bold: true }
                        ]
                    });

                    // Detail item
                    group.details.forEach(function(item) {
                        sheet.rows.push({
                            cells: [
                                { value: '' },
                                { value: item.namaproduk },
                                { value: item.satuanstandar },
                                { value: item.qtyproduk },
                                { value: item.hargasatuan },
                                { value: group.total }
                            ]
                        });
                    });

                    // Baris kosong antar grup
                    sheet.rows.push({ cells: [] });
                });
            },
                scrollable: true,
                columns: [
          
                {
                    "field": "no",
                    "title": "No",
                    "width": "25px",
                },
                {
                    "field": "tglstruk",
                    "title": "Tanggal",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Pemakaian",
                    "width": "80px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "120px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "60px",
                },
                {
                    "field": "namapegawai",
                    "title": "Pegawai",
                    "width": "100px",
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                }
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
            //***********************************
        }
    ]);
});
