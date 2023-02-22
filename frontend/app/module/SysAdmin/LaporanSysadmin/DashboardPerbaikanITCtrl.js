define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DashboardPerbaikanITCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();

            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                LoadCombo();
                loadData();
            }
            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }
            function loadData() {
                medifirstService.get('pdti/load-data-dashboard?tglawal='+ moment($scope.item.tglawal).format('YYYY-MM-DD 00:00')+'&tglakhir='+ moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59')).then(function(data){
                    $scope.card = data.data.card
                    $scope.pie = data.data.pie
                    $scope.series = data.data.series
                    $scope.belumdikerjakan = 0
                    $scope.progress = 0
                    $scope.selesai = 0
                    $scope.usulanpenghapusan = 0
                    for (let i = 0; i < $scope.card.length; i++) {
                        if($scope.card[i].id == 3){
                            $scope.belumdikerjakan += 1 
                        }
                        if ($scope.card[i].id == 15) {
                            $scope.progress += 1
                        }
                        if ($scope.card[i].id == 1) {
                            $scope.selesai += 1
                        }
                        if ($scope.card[i].jenispekerjaan == 10) {
                            $scope.usulanpenghapusan += 1

                        }
                    }
                    $("#chart").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            background: ""
                        },
                        seriesDefaults: {
                            labels: {
                                visible: true,
                                background: "transparent",
                                template: "#= category #: \n #= value #"
                            }
                        },
                        series: [{
                            type: "pie",
                            startAngle: 150,
                            data: $scope.pie
                        }],
                        tooltip: {
                            visible: true,
                            // format: "{0}%"
                        }
                    });
                    $("#bar").kendoChart({
                        
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: "column"
                        },
                        series: $scope.series,
                        seriesColors: ["#cd1533", "#d43851", "#dc5c71", "#e47f8f", "#eba1ad",
                            "#009bd7", "#26aadd", "#4db9e3", "#73c8e9", "#99d7ef"
                        ],
                        valueAxis: {
                            labels: {
                                template: "#= kendo.format('{0:N0}', value) #"
                            },
                            line: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            categories: ["januari", "Februari","Maret", "April", "Mei", "Juni","Juli","Agustus","September","Oktober","November","Desember"],
                            majorGridLines: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true,
                            template: "#= series.name # : #= value#"
                        },
                       
                    });
                })
            }
            function LoadCombo() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');

               
                medifirstService.get('ipsrs/get-combo-pegawai-perbaikan').then(function (data) {
                    var datas = data.data
                    $scope.listObjekPerbaikan = datas.objekperbaikan
                })
            }

            $scope.SearchData = function () {
                loadData()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }
            $(".export-img").on('click', function () {
                var chart = $("#chart").getKendoChart();
                chart.exportImage().done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "pie.png",
                        // proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
            });
            $(".export-imgs").on('click', function () {
                var chart = $("#bar").getKendoChart();
                chart.exportImage().done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "bar.png",
                        // proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
            });
            $scope.DataDetail = function(data){
                var datas = []
                if(data == 1){
                    for (let i = 0; i < $scope.card.length; i++) {
                        if ($scope.card[i].statuspekerjaan == 'Belum Dikerjakan') {
                            datas.push($scope.card[i])
                            
                        }
                    }
                }
                if (data == 2) {
                    for (let i = 0; i < $scope.card.length; i++) {
                        if ($scope.card[i].statuspekerjaan == 'Progress') {
                            datas.push($scope.card[i])

                        }
                    }
                }

                if (data == 3) {
                    for (let i = 0; i < $scope.card.length; i++) {
                        if ($scope.card[i].statuspekerjaan == 'Selesai') {
                            datas.push($scope.card[i])

                        }
                    }
                }

                if (data == 4) {
                    for (let i = 0; i < $scope.card.length; i++) {
                        if ($scope.card[i].jenispekerjaan == 10) {
                            datas.push($scope.card[i])
                        }
                    }
                }

                $scope.dataSource = new kendo.data.DataSource({
                    data: datas
                })
                console.log(datas);
                $scope.popUpDetail.center().open()
            }
            $scope.columnGridSsS = [
                {
                    "field": "namalengkap",
                    "title": "Pengorder Perbaikan",
                    "width": "40%"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "40%"
                },
                {
                    "field": "jeniskerusakan",
                    "title": "Jenis Kerusakan",
                    "width": "40%"
                },
                {
                    "field": "klasifikasiperbaikan",
                    "title": "Klasifikasi Perbaikan",
                    "width": "40%"
                }
            ]
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});