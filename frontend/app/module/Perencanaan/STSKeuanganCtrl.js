define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSKeuanganCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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
            $scope.norecsts = ''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listAsalProduk = e.data.asalproduk
                $scope.listSubKegiatanPanjarSPJ = e.data.kegiatancombo
            });

            $scope.$watch('item.subkegiatanpanjar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo?tahunawal="+e.data.setting[0].tahunanggaran+"&tahap="+e.data.setting[0].objecttahapaktivfk+"&subkegiatan="+$scope.item.subkegiatanpanjar.id).then(function (e) {
                            $scope.listSubSubKegiatanPanjarSPJ = e.data.kegiatansubsub
                        });
                    })
                }
            });

            $scope.$watch('item.subsubkegiatanpanjar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?idsubsub="+$scope.item.subsubkegiatanpanjar.id).then(function (e) {
                        $scope.listMataAnggaranPanjarSPJ = e.data.mataanggarancombo
                    });
                }
            });

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-sts-keuangan?awal="+awal+"&akhir="+akhir).then(function (e) {
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
                $scope.norecsts = ''
                $scope.item.nojasgir = ''
                $scope.item.uraianjasagiro = ''
                $scope.item.jumlahpemasukan = 0
                $scope.item.jumlahpengeluaran = 0
                $scope.item.tglpemasukan = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglpengeluaran = moment($scope.now).format('YYYY-MM-DD');
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                console.log($scope.dataSelected)
                $scope.norecsts = $scope.dataSelected.norec
                $scope.item.uraiansts = $scope.dataSelected.uraiansts
                $scope.item.nosts = $scope.dataSelected.nosts
                $scope.item.tglsts = $scope.dataSelected.tglsts
                $scope.item.nilaists = $scope.dataSelected.nilaists
                $scope.item.subkegiatanpanjar = {id: $scope.dataSelected.idsubkegiatan, keterangan: $scope.dataSelected.keterangansubkegiatan}
                $scope.item.subsubkegiatanpanjar = {id: $scope.dataSelected.idsubsubkegiatan, keterangan: $scope.dataSelected.keterangansubsubkegiatan}
                $scope.item.darirekeningpanjar = {id: $scope.dataSelected.idmataanggaran, namamataanggaran: $scope.dataSelected.namamataanggaran}
                $scope.item.sumberDana = {id: $scope.dataSelected.idsumberdana, asalproduk: $scope.dataSelected.asalproduk}
                $scope.popupTambahJasgir.center().open()
            }

            function FormLoad() {
                init()
            }


            $scope.$watch('item.jumlahpemasukan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahpengeluaran = $scope.item.jumlahpemasukan
                }
            });

            $scope.SaveJasgir = function () {
                var objSave = {
                    "norec": $scope.norecsts,
                    "uraiansts": $scope.item.uraiansts,
                    "nosts": $scope.item.nosts,
                    "tglsts": moment($scope.item.tglsts).format('YYYY-MM-DD'),
                    "nilaists": $scope.item.nilaists,
                    "objectsubkegiatanfk": $scope.item.subkegiatanpanjar.id,
                    "objectsubsubkegiatanfk": $scope.item.subsubkegiatanpanjar.id,
                    "objectmataanggaranfk": $scope.item.darirekeningpanjar.id,
                    "objectsumberdanafk": $scope.item.sumberDana.id,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-sts-keuangan', objSave).then(function (e) {
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
                medifirstService.post('perencanaan/delete-sts-keuangan', objSave).then(function (e) {
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
                        
                        "field": "tglsts",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nosts",
                        "title": "No STS",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraiansts",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subkegiatan",
                        "title": "Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subsubkegiatan",
                        "title": "Sub Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "mataanggaran",
                        "title": "Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nilaists",
                        "title": "Nilai STS",
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