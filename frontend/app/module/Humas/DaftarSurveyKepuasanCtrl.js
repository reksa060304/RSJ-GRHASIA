define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarSurveyKepuasanCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            LoadCache();
          medifirstService.get("humas/get-combo-survey").then(function (dat) {$scope.listParam = dat.data.parameterkepuasa})
         
            function LoadCache() {
                var chacePeriode = cacheHelper.get('cachePerawatan');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00');
                    $scope.item.tglAkhir =  moment($scope.now).format('YYYY-MM-DD 23:59:00');
                    init();
                }
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = "tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
             
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var statusId = ''
                if($scope.item.status!= undefined){
                    statusId = "&statusId=" + $scope.item.status.id
                }
                medifirstService.get("humas/get-daftar-survey-puas?" +
                    tglAwal + tglAkhir +nm  +statusId, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            var elem =dat.data.data[i]
                            elem.no = i + 1
                            if(elem.objectparameterkepuasanfk == 1){
                                elem.emoji = '😄'//'😀'
                            }
                             if(elem.objectparameterkepuasanfk == 2){
                                elem.emoji = '😊'
                            }
                             if(elem.objectparameterkepuasanfk == 3){
                                elem.emoji = '😐';
                            }
                             if(elem.objectparameterkepuasanfk == 4){
                                elem.emoji = '😣';
                            }
                          

                        }

                        var result = dat.data.data
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: result,
                            
                            pageSize: 200
                        });

                        // $scope.listDataPasien = new kendo.data.DataSource({
                        //     data: data
                        // });
                        // $scope.listDataPasien.fetch(function (e) {
                        //     var temp = [];
                        //     for (var key in this._data) {
                        //         if (this._data.hasOwnProperty(key)) {
                        //             var element = this._data[key];
                        //             if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                        //                 temp.push(element);
                        //         }
                        //     }
                        //     $scope.listPasien = temp;
                        //     cacheHelper.set('tempData', temp);
                        // });
                    });

            }

            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                }
                cacheHelper.set('cachePerawatan', chacePeriode);
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {fileName: "SurveyKepuasan.xlsx",allPages: true},
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Survey Kepuasan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "5%",
                    },
                    {
                        "field": "tglsurvey",
                        "title": "Tgl Survey",
                        "width": "30%",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglsurvey #')}}</span>"
                    },
                      {
                        "field": "namalengkap",
                        "title": "Nama Pengisi",
                        "width": "30%",
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "30%",
                    },
                     {
                        "field": "emoji",
                        "title": "Survey",
                         "template": "<span style='font-size:27px;text-align:center;'>#: emoji #</span>"
                       // "template": '# if( isdiagnosis==true) {# &#128516 # } else {# - #} #'
                    },
                  

                   
                    
                ]
            };
/////////////////////////////////////////////////////////////////////       END         ///////////////////////////////////////////////////////
        }
    ]);
});
