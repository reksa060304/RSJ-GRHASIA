define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL13_V3_KetersediaanTempatTidurCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

            medifirstService.get("registrasi/laporan/get-laporan-rl1_3-v3?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir

                ).then(function (response) {
                    var data = response.data
                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: data,
                        group: $scope.group,
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

                    $scope.dataExcel = data;
                })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $("#kGrid").kendoGrid({
                toolbar: ["excel"],

                excel: {
                    fileName: "RL34RekapitulasiPengunjung.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Rekapitulasi Pengunjung", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        field: "namakelas",
                        title: "Kelas Tempat Tidur",
                        width: "25%",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namaruang",
                        title: "Ruangan",
                        width: "25%",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "tersedia",
                        title: "Jumlah Tempat Tidur Tersedia",
                        width: "25%",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "terpakai",
                        title: "Jumlah Tempat Tidur Terpakai",
                        width: "25%",
                        headerAttributes: { style: "text-align : center" },
                    },
                ]

            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

        }
    ]);
});