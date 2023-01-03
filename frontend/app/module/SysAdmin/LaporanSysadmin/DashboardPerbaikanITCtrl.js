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
                    for (let i = 0; i < $scope.card.length; i++) {
                        console.log($scope.card[i][0].id);
                        // if($scope.card[i][0].id == null){
                        //     $scope.card[i][0].color = '#ffffff'
                        //     $scope.card[i][0].colorhead = '#e2e2e2'
                        // }
                        if ($scope.card[i][0].id == 3) {
                            $scope.card[i][0].color = '#ff0000'
                            $scope.card[i][0].colorhead = '#cb0000'

                        }
                        if ($scope.card[i][0].id == 15) {
                            $scope.card[i][0].color = '#fffc00'
                            $scope.card[i][0].colorhead = '#ccca00'

                        }
                        if ($scope.card[i][0].id == 1) {
                            $scope.card[i][0].color = '#01ff00'
                            $scope.card[i][0].colorhead = '#01bd00'

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
                                template: "#= category #: \n #= value#%"
                            }
                        },
                        series: [{
                            type: "pie",
                            startAngle: 150,
                            data: $scope.pie
                        }],
                        tooltip: {
                            visible: true,
                            format: "{0}%"
                        }
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
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});