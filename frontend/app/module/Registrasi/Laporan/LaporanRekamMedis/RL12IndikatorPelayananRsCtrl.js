define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL12IndikatorPelayananRsCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

               medifirstService.get("registrasi/laporan/get-laporan-rl12?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(data.data[i].tglLahir);
                        var umurzz = DateHelper.CountAge(tanggalLahir, tanggal);
                        data.data[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                    }
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL1.2_IndikatorPelayananRS.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "RL 1.2 Indikator Pelayanan Rumah Sakit",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    // {
                    //     field: "no",
                    //     title: "NO",
                    //     Template: "<span class='style-center'>#: no #</span>",
                    //     width: "40px"
                    // },
                    {
                        field: "tahun",
                        title: "Tahun",
                        width: "120px",
                        template: "<span class='style-center'>#: jenis_spesialisasi #</span>",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "BOR",
                        title: "BOR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "LOS",
                        title: "LOS",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "BTO",
                        title: "BTO",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "TOI",
                        title: "TOI",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "NDR",
                        title: "NDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "GDR",
                        title: "GDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "ratarataperhari",
                        title: "Rata-rata Kunjungan/Hari",
                        width: "120px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
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