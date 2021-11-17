define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapAdministrasiOtomatisCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var idProduk = 0;
            Init();

            function Init() {
                medifirstService.get("sysadmin/general/get-combo-ruangan?departemenfk=16", true).then(function (dat) {
                    $scope.listruanganinap = dat.data;
                });

                medifirstService.get("sysadmin/general/get-jenispel", true).then(function (dat) {
                    $scope.listJenisPelayanan = dat.data;
                });            
            }
            
            $scope.getProduk = function () {
                medifirstService.get("sysadmin/general/get-combo-administrasi?produk=1&objectruanganfk=" + $scope.item.ruanganInap.id, true).then(function (dat) {
                    for (var i = dat.data.listakomodasi.length - 1; i >= 0; i--) {
                        dat.data.listakomodasi[i].no = i + 1
                        if (dat.data.listakomodasi[i].israwatgabung == 1) {
                            dat.data.listakomodasi[i].israwatgabungSS = 'Yes'
                        } else {
                            dat.data.listakomodasi[i].israwatgabungSS = 'No'
                        }
                    }
                    $scope.listpelayanan = dat.data.produk;
                    $scope.listrg = [
                        { id: 1, status: 'Yes' },
                        { id: 2, status: 'No' }
                    ]
                    $scope.dataGrid = dat.data.listakomodasi;
                });
            }


            $scope.klikGrid = function (dataSelected) {
                $scope.item.id = dataSelected.maid
                $scope.item.pelayanan = { id: dataSelected.id, namaproduk: dataSelected.namaproduk }
                $scope.item.jenisPasien = { id: dataSelected.jenispelayananfk, jenispelayanan: dataSelected.jenispelayanan }
                getKomponenHarga()
                if (dataSelected.israwatgabung == '1') {
                    $scope.item.rg = { id: 1, status: 'Yes' }
                } else {

                    $scope.item.rg = { id: 2, status: 'No' }
                }

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.kosongkan = function () {
                kosong();
            }
            function kosong() {
                // $scope.item.satuanstandar_asal = ''
                $scope.item.pelayanan = ''
                $scope.item.rg = ''
                $scope.item.id = ''
                $scope.item.jenisPasien = ''
                $scope.item.hargaTindakan = 0
            }
            $scope.tambahData = function () {
                if ($scope.item.pelayanan == undefined) {
                    alert("Pilih pelayanan!!")
                    return;
                }
                if ($scope.item.ruanganInap == undefined) {
                    alert("Pilih Ruangan!!")
                    return;
                }
                var maid = '';
                if ($scope.item.id != undefined) {
                    maid = $scope.item.id
                }
                var rgg = 'NO';
                if ($scope.item.rg != undefined) {
                    if ($scope.item.rg.status == 'Yes') {
                        rgg = 'YES'
                    } else {
                        rgg = "NO"
                    }
                }
                var objSave = {
                    maid: maid,
                    pelayanan: $scope.item.pelayanan.id,
                    rg: rgg,
                    ruangan: $scope.item.ruanganInap.id,
                    jenispelayanan: $scope.item.jenisPasien.id,
                    status: 'SIMPAN_JANG'
                }
                medifirstService.post('sysadmin/general/save-map-administrasi',objSave).then(function (e) {
                    kosong();
                    medifirstService.get("sysadmin/general/get-combo-administrasi?produk=1&objectruanganfk=" + $scope.item.ruanganInap.id, true).then(function (dat) {
                        for (var i = dat.data.listakomodasi.length - 1; i >= 0; i--) {
                            dat.data.listakomodasi[i].no = i + 1
                            if (dat.data.listakomodasi[i].israwatgabung == 1) {
                                dat.data.listakomodasi[i].israwatgabungSS = 'Yes'
                            } else {
                                dat.data.listakomodasi[i].israwatgabungSS = 'No'
                            }
                        }
                        $scope.dataGrid = dat.data.listakomodasi;
                    });
                })

            }
            $scope.hapusData = function () {
                if ($scope.item.pelayanan == undefined) {
                    alert("Pilih pelayanan!!")
                    return;
                }
                if ($scope.item.ruanganInap == undefined) {
                    alert("Pilih Ruangan!!")
                    return;
                }
                var maid = '';
                if ($scope.item.id != undefined) {
                    maid = $scope.item.id
                }
                var rg = null;
                if ($scope.item.rg != undefined) {
                    if ($scope.item.rg.status = 'Yes') {
                        rg = 1
                    } else {
                        rg = null
                    }
                }
                var objSave = {
                    maid: maid,
                    pelayanan: $scope.item.pelayanan.id,
                    rg: rg,
                    ruangan: $scope.item.ruanganInap.id,
                    jenispelayanan: $scope.item.jenisPasien.id,
                    status: 'HAPUS'
                }
                medifirstService.post('sysadmin/general/save-map-administrasi',objSave).then(function (e) {
                    kosong()
                    medifirstService.get("sysadmin/general/get-combo-administrasi?produk=1&objectruanganfk=" + $scope.item.ruanganInap.id, true).then(function (dat) {
                        for (var i = dat.data.listakomodasi.length - 1; i >= 0; i--) {
                            dat.data.listakomodasi[i].no = i + 1
                            if (dat.data.listakomodasi[i].israwatgabung == 1) {
                                dat.data.listakomodasi[i].israwatgabungSS = 'Yes'
                            } else {
                                dat.data.listakomodasi[i].israwatgabungSS = 'No'
                            }
                        }
                        $scope.dataGrid = dat.data.listakomodasi;
                    });
                })
            }
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Pelayanan",
                    "width": "80px",
                },
                {
                    "field": "jenispelayanan",
                    "title": "Jenis Pelayanan",
                    "width": "80px",
                }
            ];



            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            // $scope.$watch('item.pelayanan', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         getKomponenHarga()
            //     }
            // })
            $scope.getdetailHarga = function(){
                getKomponenHarga()
            }
           
            function getKomponenHarga() {
                $scope.item.hargaTindakan = 0
                $scope.item.jumlah = 0
                $scope.listKomponen = []
                if ($scope.item.pelayanan != undefined) {
                  medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan="
                    + $scope.item.ruanganInap.id
                    + "&idKelas=" + 6
                    + "&idProduk=" + $scope.item.pelayanan.id
                    + "&idJenisPelayanan=" +   $scope.item.jenisPasien.id,
                  ).then(function (dat) {
                    $scope.listKomponen = dat.data.data;
                    $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan 
                    $scope.item.jumlah = 1;
                  })
                }
              }
            //***********************************

        }
    ]);
});
