define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('GrafikBarberJohnsonCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');;

               medifirstService.get("registrasi/laporan/get-grafik-barber-johnson?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var datas = data.data
                    createChart();
                    $(document).on('bind', "kendo:skinChange", createChart);

                    function createChart() {
                        new Chart($("#myChart"), {
                            type: 'scatter',
                            data: {
                                labels: ["Daerah Efisien", "Daerah Efisien", "BOR", "BTO", "TOI, ALOS"],
                                datasets: [{// 'line' dataset default does not affect this dataset since it's a 'scatter'
                                    label: 'Daerah Efisien',
                                    data: [{x:0, y:0},{x:2.5, y:7.5}],
                                    showLine: true,
                                    fill: false,
                                    borderColor: 'red',
                                    pointStyle: 'line',
                                }, {// 'line' dataset default does not affect this dataset since it's a 'scatter'
                                    label: 'Daerah Efisien',
                                    data: [{x:1, y:datas[0].ybto + 5}, {x:1, y:0}],
                                    showLine: true,
                                    mode: "vertical",
                                    fill: true,
                                    borderColor: 'red',
                                    pointStyle: 'line',
                                },{// 'line' dataset default does not affect this dataset since it's a 'scatter'
                                    label: 'Daerah Efisien',
                                    data: [{x:2.5, y:datas[0].ybto + 5}, {x:2.5, y:0}],
                                    showLine: true,
                                    mode: "vertical",
                                    fill: '-1',
                                    borderColor: 'red',
                                    pointStyle: 'line',
                                }, {// 'line' dataset default does not affect this dataset since it's a 'scatter'
                                    label: 'BOR',
                                    data: [{x:0, y:0},{x:(datas[0].ybto/datas[0].xbor)*datas[0].xbor, y:(datas[0].ybto/datas[0].ybor)*datas[0].ybor}],
                                    showLine: true,
                                    fill: false,
                                    borderColor: 'black',
                                    pointStyle: 'line',
                                }, {
                                    label: 'BTO',
                                    data: [{x:0, y:datas[0].ybto}, {y:0, x:datas[0].ybto}],
                                    showLine: true,
                                    fill: false,
                                    borderColor: 'green',
                                    pointStyle: 'line',
                                }, 
                                // {// 'line' dataset default does not affect this dataset since it's a 'scatter'
                                //     label: 'TOI, ALOS',
                                //     data: [{x:0, y:0},{x:datas[0].xtoi, y:datas[0].yalos}],
                                //     showLine: true,
                                //     fill: false,
                                //     borderColor: 'blue',
                                //     pointStyle: 'line',
                                // }
                            ]
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    labels: {
                                       usePointStyle: true,
                                       fontSize: 15,
                                       fontColor: "black",
                                    }
                                },tooltips: {
                                    mode: 'nearest',
                                    intersect: true
                                  }
                            }
                            
                        });
                    }
                    $scope.isRouteLoading = false;
                })
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

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