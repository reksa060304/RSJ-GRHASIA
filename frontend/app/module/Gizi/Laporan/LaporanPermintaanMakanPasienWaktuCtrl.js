define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPermintaanMakanPasienWaktuCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            // $scope.dataPasienSelected = {};

            $scope.isRouteLoading = false;
            var dataMenuSiklus = [];
            var data2 = [];
            var addDataDetail = [];

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            loadCombo();
            loadData()

            function loadCombo() {
                var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
                if (chacePeriode != undefined) {

                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }

                medifirstService.get("gizi/get-combo", false).then(function (data) {
                    $scope.listKelas = data.data.kelas;
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listJenisDiet = data.data.jenisdiet;
                    $scope.optJenisDiet = {
                        placeholder: "Pilih Jenis Diet...",
                        dataTextField: "jenisdiet",
                        dataValueField: "id",
                        autoBind: false,
                    };
                    $scope.listKategoriDiet = data.data.kategorydiet;
                    $scope.listJenisWaktu = data.data.jeniswaktu;
                    $scope.listMenu = data.data.produk;
                    loadData();
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatTanggalNoTime = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function () {
                loadData()
            }

            function loadData() {
                var tgl = moment($scope.item.bulan).format('YYYY-MM-01')
                var bulan = "bulan=" + moment($scope.item.bulan).format('MM');
                var tahun = "&tahun=" + moment($scope.item.tahun).format('YYYY');
                console.log(tgl, tahun, bulan);
                var tglAwal = "periode=" + moment($scope.item.periodeAwal).format('YYYY-MM-DD')
                medifirstService.get("gizi/get-laporan-permintaan-makanpasien-waktu?" + tglAwal)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data.data
                        $scope.sourceGrid = new kendo.data.DataSource({
                            data: result,
                            pageSize: 40,
                            total: result.length,
                            serverPaging: false,


                        });
                        $scope.selectedOnCheck = [];
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });

            };
            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Detail Tindakan Layanan" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                sortable: true,
                resizable: true,
                groupable: true,
                scrollable: true,
                columns: [
                    {
                        "field": "jenisdiet",
                        "title": "Makanan",
                        "width": "80px",
                    },
                    {
                        // "field": "jenisdiet",
                        "title": "Pagi",
                        "width": "80px",
                        "columns": [
                            {
                                "field": "vip1",
                                "title": "VIP",
                                "width": "80px",
                            }, {
                                "field": "k11",
                                "title": "K1",
                                "width": "80px",
                            }, {
                                "field": "k21",
                                "title": "K2",
                                "width": "80px",
                            }, {
                                "field": "k31",
                                "title": "K3",
                                "width": "80px",
                            }, {
                                "field": "arimbi1",
                                "title": "Arimbi",
                                "width": "80px",
                            }, {
                                "field": "bima1",
                                "title": "Bima",
                                "width": "80px",
                            }, {
                                "field": "drupadi1",
                                "title": "Drupadi",
                                "width": "80px",
                            }, {
                                "field": "kresna1",
                                "title": "Kresna",
                                "width": "80px",
                            }, {
                                "field": "yudistira1",
                                "title": "Yudistira",
                                "width": "80px",
                            }, {
                                "field": "jumlah1",
                                "title": "Jumlah",
                                "width": "80px",
                            }
                        ]
                    },
                    {
                        // "field": "jenisdiet",
                        "title": "Siang",
                        "width": "80px",
                        "columns": [{
                                "field": "vip2",
                                "title": "VIP",
                                "width": "80px",
                            }, {
                                "field": "k12",
                                "title": "K1",
                                "width": "80px",
                            }, {
                                "field": "k22",
                                "title": "K2",
                                "width": "80px",
                            }, {
                                "field": "k32",
                                "title": "K3",
                                "width": "80px",
                            }, {
                                "field": "arimbi2",
                                "title": "Arimbi",
                                "width": "80px",
                            }, {
                                "field": "bima2",
                                "title": "Bima",
                                "width": "80px",
                            }, {
                                "field": "drupadi2",
                                "title": "Drupadi",
                                "width": "80px",
                            }, {
                                "field": "kresna2",
                                "title": "Kresna",
                                "width": "80px",
                            }, {
                                "field": "yudistira2",
                                "title": "Yudistira",
                                "width": "80px",
                            }, {
                                "field": "jumlah2",
                                "title": "Jumlah",
                                "width": "80px",
                            }]
                    },
                    {
                        // "field": "jenisdiet",
                        "title": "Sore",
                        "width": "80px",
                        "columns": [{
                                "field": "vip3",
                                "title": "VIP",
                                "width": "80px",
                            }, {
                                "field": "k13",
                                "title": "K1",
                                "width": "80px",
                            }, {
                                "field": "k23",
                                "title": "K2",
                                "width": "80px",
                            }, {
                                "field": "k33",
                                "title": "K3",
                                "width": "80px",
                            }, {
                                "field": "arimbi3",
                                "title": "Arimbi",
                                "width": "80px",
                            }, {
                                "field": "bima3",
                                "title": "Bima",
                                "width": "80px",
                            }, {
                                "field": "drupadi3",
                                "title": "Drupadi",
                                "width": "80px",
                            }, {
                                "field": "kresna3",
                                "title": "Kresna",
                                "width": "80px",
                            }, {
                                "field": "yudistira3",
                                "title": "Yudistira",
                                "width": "80px",
                            }, {
                                "field": "jumlah3",
                                "title": "Jumlah",
                                "width": "80px",
                            }
                        ]
                    },
                    {
                        // "field": "jenisdiet",
                        "title": "Hari",
                        "width": "80px",
                        "columns": [{
                                "field": "vip4",
                                "title": "VIP",
                                "width": "80px",
                            }, {
                                "field": "k14",
                                "title": "K1",
                                "width": "80px",
                            }, {
                                "field": "k24",
                                "title": "K2",
                                "width": "80px",
                            }, {
                                "field": "k34",
                                "title": "K3",
                                "width": "80px",
                            }, {
                                "field": "arimbi4",
                                "title": "Arimbi",
                                "width": "80px",
                            }, {
                                "field": "bima4",
                                "title": "Bima",
                                "width": "80px",
                            }, {
                                "field": "drupadi4",
                                "title": "Drupadi",
                                "width": "80px",
                            }, {
                                "field": "kresna4",
                                "title": "Kresna",
                                "width": "80px",
                            }, {
                                "field": "yudistira4",
                                "title": "Yudistira",
                                "width": "80px",
                            }, {
                                "field": "jumlah4",
                                "title": "Jumlah",
                                "width": "80px",
                            }
                        ]
                    },
                ]
            };

            /*END */


        }
    ]);
});