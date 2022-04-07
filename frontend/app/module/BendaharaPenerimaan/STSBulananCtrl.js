define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSBulananCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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
                var bulan = ""
                if ($scope.item.bulan != undefined) {
                    bulan = $scope.item.bulan.id
                }

                tglAwal = moment(tglAwal).format('YYYY-MM-DD 00:00');
                tglAkhir = moment(tglAkhir).format('YYYY-MM-DD 00:00');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-sts-bulanan?" 
                 + "&bulan=" + bulan
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
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });                                             
                    });
            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
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
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        
                        "field": "tglpenerimaan",
                        "title": "Tgl Penerimaan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kdrekening",
                        "title": "Kode Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nomer",
                        "title": "Nomer",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalvol",
                        "title": "Vol",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalkolom1",
                        "title": "Jumlah 1",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalkolom2",
                        "title": "Jumlah 2",
                        "width": "100px",
                    }
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});