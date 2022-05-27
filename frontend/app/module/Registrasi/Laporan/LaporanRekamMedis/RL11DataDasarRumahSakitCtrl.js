define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL11DataDasarRumahSakitCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM');

               medifirstService.get("registrasi/laporan/get-laporan-rl11?" +
                    "tglAwal=" + tglAwal
                ).then(function (data) {
                    // var datas = []
                    // datas.jumlahkolom1 = []
                    // datas.jumlahkolom2 = []
                    // datas.jumlahkolom4 = []
                    // datas.jumlahkolom5 = []
                    // datas.jumlahkolom6 = []
                    // for(var i = 0; i < data.data.data[0].kolom1.length; i++){
                    //     datas.jumlahkolom1[i] = data.data.data[0].kolom1[i]
                    // }
                    // for(var i = 0; i < data.data.data[0].kolom2.length; i++){
                    //     datas.jumlahkolom2[i] = data.data.data[0].kolom2[i]
                    // }
                    // for(var i = 0; i < data.data.data[0].kolom4.length; i++){
                    //     datas.jumlahkolom4[i] = data.data.data[0].kolom4[i]
                    // }
                    // for(var i = 0; i < data.data.data[0].kolom5.length; i++){
                    //     datas.jumlahkolom5[i] = data.data.data[0].kolom5[i]
                    // }
                    // for(var i = 0; i < data.data.data[0].kolom6.length; i++){
                    //     datas.jumlahkolom6[i] = data.data.data[0].kolom6[i]
                    // }
                    console.log(data.data);
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data,
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

                excel: {
                    fileName: "RL1.1_DataDasarRumahSakit.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "RL1.1_DataDasarRumahSakit",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    }
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