define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPermintaanMakanPasienBangsalCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
                // var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
                // if (chacePeriode != undefined) {

                //     var arrPeriode = chacePeriode.split('~');
                //     $scope.item.periodeAwal = new Date(arrPeriode[0]);
                //     $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                //     $scope.item.tglpulang = new Date(arrPeriode[2]);
                // } else {
                //     $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                //     $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                //     $scope.item.tglpulang = $scope.now;
                // }

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
                var bulan = "bulan="+moment($scope.item.bulan).format('MM');
                var tahun = "&tahun="+moment($scope.item.tahun).format('YYYY');
                console.log(tgl,tahun, bulan);
                medifirstService.get("gizi/get-laporan-permintaan-makanpasien-bangsal?"+bulan+tahun)
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
                        // var chacePeriode = tglAwal + "~" + tglAkhir;
                        // cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });

            };
            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Permintaan Makan Pasien Rekap Bangsal" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                sortable: true,
                resizable: true,
                groupable: true,
                scrollable: true,
                columns: 
                    [{
                        "field": "tglmenu",
                        "title": "Tgl",
                        "width": "80px",
                    },
                    {
                        "title": "Nama Bangsal",
                        "width": "80px",
                        "columns": [
                            {
                                "field": "vip",
                                "title": "VIP"
                            },
                            {
                                "field": "kelas_1",
                                "title": "K1"
                            },
                            {
                                "field": "kelas_2",
                                "title": "K2"
                            },
                            {
                                "field": "kelas_3",
                                "title": "K3"
                            },
                            {
                                "field": "arimbi",
                                "title": "Arimbi"
                            },
                            {
                                "field": "bima",
                                "title": "Bima"
                            },
                            {
                                "field": "drupadi",
                                "title": "Drupadi"
                            },
                            {
                                "field": "kresna",
                                "title": "Kresna"
                            },
                            {
                                "field": "yudistira",
                                "title": "Yudistira"
                            }
                        ]
                    },
                    {
                        "field":"jumlah",
                        "title":"Jumlah"
                    }
                ]
            };

            /*END */


        }
    ]);
});