define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengelompokkanTarifCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }


            medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                var dataCombo = data.data;
                $scope.listBulan = dataCombo.bulan;

            });

            function init() {
                $scope.isRouteLoading = true;

                var tglAwal =""
                var tglAkhir = ""

                tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                medifirstService.get("bendaharapenerimaan/get-pengelompokkan-tarif?" 
                 + "&tglAwal=" + tglAwal
                 + "&tglAkhir=" + tglAkhir
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        pendapatan: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'pendapatan', aggregate: 'sum' },
                            ]
                        });
                    });
            }

            function FormLoad() {
                $scope.item.tahun = moment($scope.now).format('YYYY');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.namaProduk = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.group = [
            ];
            

            $scope.columnGrid = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanPengelompokkanPendapatanPerTarif.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.name = "Report";

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "no",
                        "title": "No",
                        "width": "100px",
                    },
                    {
                        "title": "Jenis Layanan",
                        "field": "namaproduk",
                        "width": "200px",
                    },
                    {
                        
                        "field": "tarif",
                        "title": "Tarif",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: tarif #', '')}}</span>",
                        footerTemplate: "JUMLAH"
                    },
                    {
                        
                        "field": "pendapatan",
                        "title": "Pendapatan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: pendapatan #', '')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.pendapatan.sum #', '')}}</span>",
                        footerTemplate: "#: data.pendapatan.sum #"
                    },
                ]
            };

            $scope.naiveRound = function (num, decimalPlaces = 0) {
                var p = Math.pow(10, decimalPlaces);
                var result = Math.round(num * p) / p
                if(result != NaN){
                    result = Math.round(num * p) / p
                } else{
                    result = 0
                }
                return result;
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});