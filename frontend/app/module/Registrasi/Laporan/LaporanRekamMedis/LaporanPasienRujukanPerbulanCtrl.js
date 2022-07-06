define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('LaporanPasienRujukanPerbulanCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tahun = moment($scope.item.tahun).format('YYYY');

               medifirstService.get("registrasi/laporan/get-laporan-pasien-rujukan-perbulan?"
               + "tahun=" + tahun
                ).then(function (e) {
                    var datas = e.data.data
                    for(var i = 0; i<datas.length; i++){
                        datas[i].no = i+1
                    }
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.dataExcel = datas;
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

                excel: {
                    fileName: "RL1.3_TempatTidur.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    var columns = e.workbook.sheets[0].columns;
                    var sheet = e.workbook.sheets[0];
                    console.log(sheet.rows.length)
                    for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                        delete columns[i].width;
                        columns[i].width = 100;
                    }

                    delete columns[0].width;
                    columns[0].width = 60;
                    delete columns[1].width;
                    columns[1].width = 200;

                    
                    
                },
                columns: [
                    {
                        field: "no",
                        title: "NO",
                        width: "80px"
                    },
                    {
                        field: "namaruangan",
                        title: "PELAYANAN",
                        width: "250px"
                    },
                    {
                        title: "JANUARI",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanjanuari",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanjanuari",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "FEBRUARI",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanfebruari",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanfebruari",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "MARET",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanmaret",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanmaret",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "APRIL",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanapril",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanapril",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "MEI",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanmei",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanmei",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "JUNI",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanjuni",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanjuni",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "JULI",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanjuli",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanjuli",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "AGUSTUS",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanagustus",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanagustus",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "SEPTEMBER",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanseptember",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanseptember",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "OKTOBER",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanoktober",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanoktober",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "NOVEMBER",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukannovember",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukannovember",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },
                    {
                        title: "DESEMBER",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukandesember",
                                title: "RUJUKAN",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukandesember",
                                title: "NON RUJUKAN",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

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