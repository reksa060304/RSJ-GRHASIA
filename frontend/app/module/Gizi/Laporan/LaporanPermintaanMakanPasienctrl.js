define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPermintaanMakanPasienCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
                var ruangan = '';
                if ($scope.item.ruangan != undefined){
                    ruangan = "&ruangan=" + $scope.item.ruangan.id
                }
                console.log(tgl,tahun, bulan);
                medifirstService.get("gizi/get-laporan-permintaan-makanpasien?"+bulan+tahun+ruangan)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data.data
                        $scope.sourceGrid = new kendo.data.DataSource({
                            data: result,
                            pageSize: 20,
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
                    fileName: "Data Permintaan Makan Pasien Perjenis Diet" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
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
                        "field": "jenisdiet",
                        "title": "Makanan",
                        "width": "80px",
                    },
                    {
                        "field": "a1",
                        "title": "1",
                        "width": "30px",
                    },
                    {
                        "field": "a2",
                        "title": "2",
                        "width": "30px",
                    }, {
                        "field": "a3",
                        "title": "3",
                        "width": "30px",
                    }, {
                        "field": "a4",
                        "title": "4",
                        "width": "30px",
                    }, {
                        "field": "a5",
                        "title": "5",
                        "width": "30px",
                    }, {
                        "field": "a6",
                        "title": "6",
                        "width": "30px",
                    }, {
                        "field": "a7",
                        "title": "7",
                        "width": "30px",
                    }, {
                        "field": "a8",
                        "title": "8",
                        "width": "30px",
                    }, {
                        "field": "a9",
                        "title": "9",
                        "width": "30px",
                    }, {
                        "field": "a10",
                        "title": "10",
                        "width": "30px",
                    }, {
                        "field": "a11",
                        "title": "11",
                        "width": "30px",
                    }, {
                        "field": "a12",
                        "title": "12",
                        "width": "30px",
                    }, {
                        "field": "a13",
                        "title": "13",
                        "width": "30px",
                    }, {
                        "field": "a14",
                        "title": "14",
                        "width": "30px",
                    }, {
                        "field": "a15",
                        "title": "15",
                        "width": "30px",
                    }, {
                        "field": "a16",
                        "title": "16",
                        "width": "30px",
                    }, {
                        "field": "a17",
                        "title": "17",
                        "width": "30px",
                    }, {
                        "field": "a18",
                        "title": "18",
                        "width": "30px",
                    }, {
                        "field": "a19",
                        "title": "19",
                        "width": "30px",
                    }, {
                        "field": "a20",
                        "title": "20",
                        "width": "30px",
                    }, {
                        "field": "a21",
                        "title": "21",
                        "width": "30px",
                    }, {
                        "field": "a22",
                        "title": "22",
                        "width": "30px",
                    }, {
                        "field": "a23",
                        "title": "23",
                        "width": "30px",
                    }, {
                        "field": "a24",
                        "title": "24",
                        "width": "30px",
                    }, {
                        "field": "a25",
                        "title": "25",
                        "width": "30px",
                    }, {
                        "field": "a26",
                        "title": "26",
                        "width": "30px",
                    }, {
                        "field": "a27",
                        "title": "27",
                        "width": "30px",
                    }, {
                        "field": "a28",
                        "title": "28",
                        "width": "30px",
                    }, {
                        "field": "a29",
                        "title": "29",
                        "width": "30px",
                    }, {
                        "field": "a30",
                        "title": "30",
                        "width": "30px",
                    }, {
                        "field": "a31",
                        "title": "31",
                        "width": "30px",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "50px",
                    }
                ]
            };

            /*END */


        }
    ]);
});