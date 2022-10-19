define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JurnalPenutupanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = '2022-01-01';
            $scope.item.tglakhir = $scope.now;
            $scope.norecjurnal = ''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            medifirstService.getPart("akuntansi/get-data-combo-coa-part", true, true, 20).then(function (data) {
                $scope.listAkun = data;
            })

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-jurnalp?awal="+awal+"&akhir="+akhir).then(function (e) {
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
                $scope.item.tglpemasukan = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglpengeluaran = moment($scope.now).format('YYYY-MM-DD');
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                $scope.norecjurnal = $scope.dataSelected.norec
                $scope.item.nojurnal = $scope.dataSelected.nojurnal
                $scope.item.keteranganjurnal = $scope.dataSelected.keteranganjurnal
                $scope.item.tgljurnal = $scope.dataSelected.tgljurnal
                $scope.item.debet = $scope.dataSelected.debet
                $scope.item.kredit = $scope.dataSelected.kredit
                $scope.item.kdAkun = {id: $scope.dataSelected.idakun, namaaccount: $scope.dataSelected.namaakun}
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


            $scope.$watch('item.jumlahpemasukan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahpengeluaran = $scope.item.jumlahpemasukan
                }
            });

            $scope.SaveJasgir = function () {
                var objSave = {
                    "norec": $scope.norecjurnal,
                    "keteranganjurnal": $scope.item.keteranganjurnal,
                    "tgljurnal": moment($scope.item.tgljurnal).format('YYYY-MM-DD'),
                    "debet": $scope.item.debet,
                    "kredit": $scope.item.kredit,
                    "nojurnal": $scope.item.nojurnal,
                    "kdakun" :  $scope.item.kdAkun.id
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-jurnalp', objSave).then(function (e) {
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
                medifirstService.post('perencanaan/delete-jurnal', objSave).then(function (e) {
                    init();
                })

            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD');
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
                        
                        "field": "nojurnal",
                        "title": "Nomor",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kdakun",
                        "title": "Kode Akun",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namaakun",
                        "title": "Nama Akun",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tgljurnal",
                        "title": "Tanggal Retur",
                        "width": "100px",
                    },
                    {
                        
                        "field": "keteranganjurnal",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "debet",
                        "title": "Debet",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kredit",
                        "title": "Kredit",
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