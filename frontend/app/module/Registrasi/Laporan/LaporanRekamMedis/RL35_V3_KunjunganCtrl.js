define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL35_V3_KunjunganCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
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

                // var idDiagnosaAwal = "";
                // if ($scope.item.diagnosa1 != undefined) {
                //     idDiagnosaAwal = "&idDiagnosaAwal=" + $scope.item.diagnosa1.kddiagnosa;
                // }
                // var idDiagnosaAkhir = "";
                // if ($scope.item.diagnosa2 != undefined) {
                //     idDiagnosaAkhir = "&idDiagnosaAkhir=" + $scope.item.diagnosa2.kddiagnosa;
                // }


                medifirstService.get("registrasi/laporan/get-laporan-rl35-v3?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir

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
                        pageSize: 100,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    $scope.dataExcel = data.data;
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




            // $scope.group = {
            //     field: "pendudukdki",
            //     aggregates: [{
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }, {
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }]
            // };
            // $scope.aggregate = [{
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }, {
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }]
            // var record = 0;
            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL3.5 Kunjungan" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + " - " + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Formulis RL 3.2", background: "#fffff" }]

                    });
                },
                columns: [
                    {
                        field: "no",
                        title: "NO",
                      },
                      {
                        field: "ruang",
                        title: "JENIS KEGIATAN",
                      },
                      {
                        title: "Kunjungan Pasien Dalam Kab/Kota",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlah_dlm_l",
                                title: "Laki-laki",
                                // width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlah_dlm_p",
                                title: "Perempuan",
                                // width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
                      },
                      {
                        title: "Kunjungan Pasien Luar Kab/Kota",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlah_luar_l",
                                title: "Laki-laki",
                                // width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlah_luar_p",
                                title: "Perempuan",
                                // width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
                      },
                      {
                        field: "jumlah",
                        title: "TOTAL",
                      },
                    // {
                    //     title: "DOA",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns: [
                    //         {
                    //             field: "doal",
                    //             title: "Laki-laki",
                    //             width: "60px",
                    //             headerAttributes: { style: "text-align : center" }
                    //         },
                    //         {
                    //             field: "doap",
                    //             title: "Perempuan",
                    //             width: "60px",
                    //             headerAttributes: { style: "text-align : center" },
                    //         },

                    //     ]
                    // },
                    // {
                    //     title: "LUKA-LUKA",
                    //     headerAttributes: { style: "text-align : center" },
                    //     columns: [
                    //         {
                    //             field: "lukal",
                    //             title: "Laki-laki",
                    //             width: "60px",
                    //             headerAttributes: { style: "text-align : center" }
                    //         },
                    //         {
                    //             field: "lukap",
                    //             title: "Perempuan",
                    //             width: "60px",
                    //             headerAttributes: { style: "text-align : center" },
                    //         },

                    //     ]
                    // },
                    // // {
                    // //     field: "mati",
                    // //     title: "MATI DI IGD",
                    // //     width: "80px",
                    // //     headerAttributes: { style: "text-align : center" },
                    // // },
                    // {
                    //     field: "tidakgawatdarurat",
                    //     title: "False Emergency",
                    //     width: "80px",
                    //     headerAttributes: { style: "text-align : center" },
                    // }

                ]

            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }



            // modelItemAkuntansi.getDataTableTransaksi("laporan/get-data-combo-rm", true,true,10).then(function (dat) {
            //      $scope.listDiagnosa = dat.diagnosa;
            //   $scope.item.diganosas = {id:$scope.listDiagnosa[0].id,kddiagnosa:$scope.listDiagnosa[0].kddiagnosa}
            //  });
            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }



        }
    ]);
});