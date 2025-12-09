define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL43_V3_10BesarKematianPenyakitPasienRawatInapCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
			$scope.item.tglakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
            $scope.item.jmlRows = 600;

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;


                medifirstService.get("registrasi/laporan/get-laporan-rl43?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir

                ).then(function (dat) {
                    var datas = dat.data.detail
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].year = new Date(tglAwal).getFullYear();
                    }
                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: datas,
                        group: $scope.group,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                        }
                    });

                    $scope.dataExcel = datas;
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
                // , "pdf"],

                excel: {
                    fileName: "RL 4.3 - 10 Besar Kematian Penyakit Pasien Rawat Inap" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + " - " + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
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
                // groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "RL 4.3 - 10 Besar Kematian Penyakit Pasien Rawat Inap", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        field: "no",
                        title: "No. Urut",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "70px"
                    },
                    {
                        field: "kddiagnosa",
                        title: "Kode ICD",
                        width: "100px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namadiagnosa",
                        title: "Kelompok Diagnosis Penyakit",
                        width: "150px",
                        template: "<span class='style-center'>#: namadiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        title: "Jumlah Pasien Hidup dan Mati Menurut Jenis Kelamin",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "hiduplaki",
                                title: "LK",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "hidupperempuan",
                                title: "PR",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "jumlahhiduppl",
                                title: "T",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
                    },
                    {
                        title: "Jumlah Pasien Keluar Mati",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "matilaki",
                                title: "LK",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "matiperempuan",
                                title: "PR",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "matipl",
                                title: "T",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
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