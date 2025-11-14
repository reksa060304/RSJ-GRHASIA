define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL5310BesarKunjunganPenyakitRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);
            
            var satuBulanLalu = new Date();
            satuBulanLalu.setMonth(satuBulanLalu.getMonth() - 1);
            
            $scope.item.tglawal = DateHelper.getDateTimeFormatted3(satuBulanLalu) + " 00:00";
            $scope.item.tglakhir = tanggals + " 12:59";
            
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            
            

            LoadCombo();
            function LoadCombo(){
                medifirstService.get("registrasi/laporan/get-combo-mapping-rl?").then(function (data) {
                    $scope.listRuangan = data.data.ruanganrajal;
                });
            }

            LoadData();

            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuanganId = "";
                    if ($scope.item.ruangan != undefined) {
                        tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                    }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRL_55Ctrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-rl53-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                ).then(function (data) {
                    var data = data.data
                    
                    $scope.isRouteLoading = false;

                    //   debugger
                    $scope.ambildataexcel = data.data;
                    $scope.panggil($scope.ambildataexcel);
                    $scope.dataRL55 = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });


                })
            }

            $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "RL55.xlsx",
                        filterable: true,
                        allPages: true,
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    resizable: true,
                    sortable: true,
                    // reorderable: true,
                    // filterable: true,
                    pageable: true,
                    // groupable: true,
                    // columnMenu: true,
                    // resizable: true,
                    columns: [

                        {
                            field: "kelompok_icd10",
                            title: "KELOMPOK ICD 10",
                            width: "120px",
                            template: "<span class='style-center'>#: kelompok_icd10 #</span>",
                            headerAttributes: { style: "text-align : center" },
                            rows: [
                                {
                                    cells: [
                                        {
                                            value: "Border",
                                            borderTop: { color: "#ff0000", size: 3 }
                                        }]
                                }
                            ]

                        },
                        {
                            field: "namadiagnosa",
                            title: "KELOMPOK DIAGNOSA",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "KASUS BARU MENURUT JENIS KELAMIN",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "jumlahL",
                                    "title": "Laki-laki",
                                    width: "80px",
                                },
                                {
                                    "field": "jumlahP",
                                    "title": "Perempuan",
                                    width: "80px",
                                }
                            ]

                        },
                        {
                            field: "total_kasus_baru",
                            title: "JUMLAH KASUS BARU",
                            width: "80px",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "JUMLAH KUNJUNGAN MENURUT JENIS KELAMIN",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "jumlah_kunjunganL",
                                    "title": "Laki-laki",
                                    width: "80px",
                                },
                                {
                                    "field": "jumlah_kunjunganP",
                                    "title": "Perempuan",
                                    width: "80px",
                                }
                            ]

                        },
                        {
                            field: "total_kunjungan",
                            title: "Jumlah Kunjungan",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                        }
                    ]
                })
            };

            $scope.panggil();

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
            }

            $scope.CariRL55 = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
        }
    ])
})