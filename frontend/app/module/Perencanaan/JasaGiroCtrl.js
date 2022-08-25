define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JasaGiroCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.norecjasgir = ''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-jasgir?awal="+awal+"&akhir="+akhir).then(function (e) {
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: e.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: e.data.data.length,
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


            $scope.TambahJasgir = function(){
                $scope.norecjasgir = ''
                $scope.item.nojasgir = ''
                $scope.item.uraianjasagiro = ''
                $scope.item.jumlahpemasukan = 0
                $scope.item.jumlahpengeluaran = 0
                $scope.item.tglpemasukan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.item.tglpengeluaran = moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                $scope.norecjasgir = $scope.dataSelected.norec
                $scope.item.nojasgir = $scope.dataSelected.nojasagiro
                $scope.item.uraianjasagiro = $scope.dataSelected.uraianjasagiro
                $scope.item.tglpemasukan = $scope.dataSelected.tglpemasukan
                $scope.item.jumlahpemasukan = $scope.dataSelected.jumlahpemasukan
                $scope.item.tglpengeluaran = $scope.dataSelected.tglpengeluaran
                $scope.item.jumlahpengeluaran = $scope.dataSelected.jumlahpengeluaran
                $scope.popupTambahJasgir.center().open()
            }

            function FormLoad() {
                init()
            }
            

            $scope.$watch('item.itembulan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-spj-to-lpj?bulan="+$scope.item.itembulan.id+"&tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                        
                        $scope.dataGridLPJ = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlahdibayarverif: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahdibayarverif', aggregate: 'sum' },
                            ]
                        });
                    });
                    
                }
            });

            $scope.SaveJasgir = function () {
                var objSave = {
                    "norec": $scope.norecjasgir,
                    "uraianjasgir": $scope.item.uraianjasagiro,
                    "tglpemasukan": moment($scope.item.tglpemasukan).format('YYYY-MM-DD HH:mm'),
                    "jumlahpemasukan": $scope.item.jumlahpemasukan,
                    "tglpengeluaran": moment($scope.item.tglpengeluaran).format('YYYY-MM-DD HH:mm'),
                    "jumlahpengeluaran": $scope.item.jumlahpengeluaran,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-jasgir', objSave).then(function (e) {
                    $scope.popupTambahJasgir.center().close()
                    init();
                })

            }

            $scope.HapusJasgir = function () {
                var objSave = {
                    "norec": $scope.dataSelected.norec,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-jasgir', objSave).then(function (e) {
                    init();
                })

            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
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
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nojasagiro",
                        "title": "Nomor",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraianjasagiro",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpemasukan",
                        "title": "Tanggal Masuk",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpemasukan",
                        "title": "Jumlah Masuk",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpengeluaran",
                        "title": "Tanggal Keluar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpengeluaran",
                        "title": "Jumlah Keluar",
                        "width": "100px",
                    },
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});