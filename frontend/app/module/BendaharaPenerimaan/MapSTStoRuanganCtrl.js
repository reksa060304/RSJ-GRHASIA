define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapSTStoRuanganCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var dataPost = [];
            $scope.dataSelected = {};
            $scope.norec = ''
            $scope.hidedepar = true
            $scope.item.tahuncari = moment($scope.now).format('YYYY');

            loadCombo()
            loadProduk()

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listJenisProduk = [
                { id: 1, jenisproduk: "Obat" },
            ];

            function loadCombo() {
                if ($scope.item.tahuncari != undefined) {
                    var tahun = "tahun=" + moment($scope.item.tahuncari).format('YYYY')
                }
                medifirstService.get("registrasi/laporan/get-combo-mapping-sts?" +tahun, true).then(function (dat) {
                    $scope.listUraianPendapatan = dat.data.uraianpendapatan
                    $scope.listdataruangan = dat.data.ruanganall
                });

                medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                    $scope.listRuangan = data.data.ruangan;
                });

                medifirstService.get("registrasi/laporan/get-mapping-sts?", true).then(function (dat) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1

                        }
                        $scope.dataGrid = dat.data;

                    });

                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                });
            }

            function loadProduk() {
                medifirstService.getPart("registrasi/laporan/get-produk-mapping-rl", true, true, 20).then(function (data) {
                    $scope.listproduk = data;
                });
            }

            $scope.Hapus = function () {
                var objDelete = { data: $scope.dataSelected, }

                medifirstService.post('registrasi/laporan/delete-mapping-sts-to-ruangan',objDelete).then(function (e) {
                    if ($scope.item.uraianpendapatan != undefined) {
                        var idUraian = "idUraian=" + $scope.item.uraianpendapatan.id
                    }
                    if ($scope.item.tahuncari != undefined) {
                        var tahun = "&tahun=" + moment($scope.item.tahuncari).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-sts?"
                        + idUraian +tahun, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                })
            }

            $scope.CopyMappingan = function () {
                $scope.popupCopyUraian.center().open()
            }

            $scope.SaveCopyPendapatan = function () {
                var objSave = {
                    "tahundari": moment($scope.item.tahundari).format('YYYY'),
                    "tahunke": moment($scope.item.tahunke).format('YYYY'),
                }
                console.log(objSave);
                // return
                medifirstService.post('registrasi/laporan/save-mapping-sts-to-ruangan-copy', objSave).then(function (e) {
                    $scope.popupCopyUraian.center().close()
                    if ($scope.item.uraianpendapatan != undefined) {
                        var idUraian = "idUraian=" + $scope.item.uraianpendapatan.id
                    }
                    if ($scope.item.tahuncari != undefined) {
                        var tahun = "&tahun=" + moment($scope.item.tahuncari).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-sts?"
                        + idUraian + tahun, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                })

            }

            $scope.Simpan = function () {

                if ($scope.item.uraianpendapatan == undefined) {
                    alert("Pilih Uraian STS terlebih dahulu!!")
                    return
                }
                var produk = null
                if ($scope.item.Produk != undefined) {
                    produk = $scope.item.Produk.idproduk
                } 

                var ruangan = null
                if ($scope.item.ruangan != undefined) {
                    ruangan = $scope.item.ruangan.id
                } 

                var jenisproduk = null
                if ($scope.item.jenisproduk != undefined) {
                    jenisproduk = $scope.item.jenisproduk.id
                } 

                var departemen = null
                if ($scope.item.departemen != undefined) {
                    departemen = $scope.item.departemen.id
                } 

                var mappingproduktolaporanrl = {
                    norec: $scope.norec,
                    objecturaianpendapatanfk: $scope.item.uraianpendapatan.id,
                    jenisprodukfk: jenisproduk,
                    departemenfk: departemen,
                    produkfk: produk,
                    ruanganfk: ruangan,
                }
                
                medifirstService.post('registrasi/laporan/save-mapping-sts-to-ruangan',mappingproduktolaporanrl).then(function (e) {
                    if ($scope.item.uraianpendapatan != undefined) {
                        var idUraian = "idUraian=" + $scope.item.uraianpendapatan.id
                    }
                    if ($scope.item.tahuncari != undefined) {
                        var tahun = "&tahun=" + moment($scope.item.tahuncari).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-sts?"
                        + idUraian + tahun, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                })

            }

            $scope.$watch('item.tahuncari', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tahuncari != undefined) {
                        var tahun = "tahun=" + moment($scope.item.tahuncari).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-combo-mapping-sts?"+tahun, true).then(function (dat) {
                        $scope.listUraianPendapatan = dat.data.uraianpendapatan
                    });
                }
            });

            $scope.$watch('item.uraianpendapatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.uraianpendapatan != undefined) {
                        var idUraian = "idUraian=" + $scope.item.uraianpendapatan.id
                    }
                    if ($scope.item.tahuncari != undefined) {
                        var tahun = "&tahun=" + moment($scope.item.tahuncari).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-sts?"
                        + idUraian + tahun, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                }
            });

            $scope.$watch('item.jenisproduk', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.jenisproduk != undefined){
                        $scope.hidedepar = false
                    } else{
                        $scope.hidedepar = true
                    }
                }
            });

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tahun",
                    "title": "Tahun",
                    "width": "100px",
                },
                {
                    "field": "uraianpendapatan",
                    "title": "Uraian STS",
                    "width": "100px",
                },
                {
                    "field": "namaproduk",
                    "title": "Pelayanan",
                    "width": "100px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namadepartemen",
                    "title": "Departemen",
                    "width": "100px",
                }
            ];
        }
    ]);
});