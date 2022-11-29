define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapRLtoKontenCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var dataPost = [];
            $scope.dataSelected = {};

            loadCombo()

            function loadCombo() {

                medifirstService.get("registrasi/laporan/get-combo-mapping-rl", true).then(function (dat) {
                    // $scope.listProduk = dat.data.produk
                    $scope.listKelompok = dat.data.kelompokLaporan
                    $scope.listCaraBayar = dat.data.caraBayar
                    $scope.listjenislaporan = dat.data.jenisLaporan
                    $scope.listdataruangan = dat.data.ruanganall
                    // $scope.listproduk = dat.data.produk
                });

                medifirstService.get("registrasi/laporan/get-mapping-rl?", true).then(function (dat) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            // $scope.item.Produk = {idproduk:dat.data[i].idproduk,namaproduk:dat.data[i].namaproduk}

                        }
                        $scope.dataGrid = dat.data;

                    });
            }

            $scope.Hapus = function () {
                var objDelete = { data: $scope.dataSelected, }

                medifirstService.post('registrasi/laporan/delete-mapping-rl-to-konten',objDelete).then(function (e) {
                    if ($scope.item.jenislaporan != undefined) {
                        var idJenisLaporan = "idJenisLaporan=" + $scope.item.jenislaporan.id
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-rl?"
                        + idJenisLaporan, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                // $scope.item.Produk = {idproduk:dat.data[i].idproduk,namaproduk:dat.data[i].namaproduk}
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                    
                    delete $scope.item.kelompok;
                    delete $scope.item.norec;
                })
            }

            $scope.Simpan = function () {

                if ($scope.item.jenislaporan == undefined) {
                    alert("Pilih Laporan RL terlebih dahulu!!")
                    return
                }
                if ($scope.item.kelompok == undefined) {
                    alert("Pilih Konten terlebih dahulu!!")
                    return
                }
                var jenislaporan = ""
                if ($scope.item.jenislaporan != undefined) {
                    jenislaporan = $scope.item.jenislaporan.id
                } 

                var kelompok = ""
                if ($scope.item.kelompok != undefined) {
                    kelompok = $scope.item.kelompok.id
                } 
                
                var norec = "";
                if ($scope.item.norec != undefined) {
                    norec = $scope.item.norec
                }

                var mappingproduktolaporanrl = {
                    norec: norec,
                    objectjenislaporanfk: jenislaporan,
                    objectkelompokkontenfk: kelompok,
                }
                
                medifirstService.post('registrasi/laporan/save-mapping-rl-to-konten',mappingproduktolaporanrl).then(function (e) {
                    if ($scope.item.jenislaporan != undefined) {
                        var idJenisLaporan = "idJenisLaporan=" + $scope.item.jenislaporan.id
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-rl?"
                        + idJenisLaporan, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                // $scope.item.Produk = {idproduk:dat.data[i].idproduk,namaproduk:dat.data[i].namaproduk}
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });


                    delete $scope.item.kelompok;
                    delete $scope.item.norec;
                })

            }

            $scope.$watch('item.jenislaporan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.jenislaporan != undefined) {
                        var idJenisLaporan = "idJenisLaporan=" + $scope.item.jenislaporan.id
                    }
                    medifirstService.get("registrasi/laporan/get-mapping-rl?"
                        + idJenisLaporan, true).then(function (dat) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                // $scope.item.Produk = {idproduk:dat.data[i].idproduk,namaproduk:dat.data[i].namaproduk}
    
                            }
                            $scope.dataGrid = dat.data;
    
                        });
                }
            });

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "jenislaporan",
                    "title": "Laporan RL",
                    "width": "100px",
                },
                {
                    "field": "kelompoklaporan",
                    "title": "Konten",
                    "width": "100px",
                }
            ];
        }
    ]);
});