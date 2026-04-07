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
                    for (let x = 0; x < $scope.listJenisPelayanan.length; x++) {
                        const element = $scope.listJenisPelayanan[x];
                        if(element.jenispelayanan.toLowerCase().indexOf('reguler') > -1){
                            $scope.item.jenisPasien = element 
                            getKomponenHarga()
                            break
                        }
                    }
                  
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
                $scope.item.tipe = dataSelected.statuspasien
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
                // $scope.item.jenisPasien = ''
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
                    statuspasien: $scope.item.tipe? $scope.item.tipe : null,
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
                },
                {
                    "field": "statuspasien",
                    "title": "Jenis Pasien",
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
            // BAGIAN PENUNJANG
            $scope.itemPenunjang = {};
            var dataGridAllPenunjang = [];

            $scope.listTipePenunjang = [
                { id: 3, name: 'Laboratorium' },
                { id: 27, name: 'Radiologi' }
            ];

            medifirstService.get("sysadmin/general/get-combo-administrasi-penunjang", true).then(function (dat) {
                $scope.listRuanganAsalPenunjang = dat.data.ruangan;
            });

            $scope.onChangeRuanganAsalPenunjang = function () {
                $scope.itemPenunjang.tipePenunjang = undefined;
                $scope.itemPenunjang.ruanganTujuan = undefined;
                $scope.itemPenunjang.produk = undefined;
                $scope.itemPenunjang.hargaTindakan = 0;
                $scope.itemPenunjang.maid = undefined;
                $scope.listRuanganTujuanPenunjang = [];
                $scope.listProdukPenunjang = [];
                $scope.dataGridPenunjang = new kendo.data.DataSource({ data: [] });
                dataGridAllPenunjang = [];
                loadProdukDanMappingPenunjang();
            };

            $scope.onChangeTipePenunjang = function () {
                $scope.itemPenunjang.ruanganTujuan = undefined;
                $scope.itemPenunjang.produk = undefined;
                $scope.itemPenunjang.hargaTindakan = 0;
                $scope.itemPenunjang.maid = undefined;
                $scope.listRuanganTujuanPenunjang = [];
                $scope.listProdukPenunjang = [];

                if (!$scope.itemPenunjang.tipePenunjang) {
                    loadProdukDanMappingPenunjang();
                    return;
                }
                var idTipe = $scope.itemPenunjang.tipePenunjang.id ? $scope.itemPenunjang.tipePenunjang.id : $scope.itemPenunjang.tipePenunjang;

                medifirstService.get(
                    "sysadmin/general/get-combo-administrasi-penunjang?departemenfk=" + idTipe,
                    true
                ).then(function (dat) {
                    $scope.listRuanganTujuanPenunjang = dat.data.ruangan;
                });
                loadProdukDanMappingPenunjang();
            };

            $scope.onChangeRuanganPenunjang = function () {
                $scope.itemPenunjang.produk = undefined;
                $scope.itemPenunjang.hargaTindakan = 0;
                $scope.itemPenunjang.maid = undefined;
                $scope.listProdukPenunjang = [];
                loadProdukDanMappingPenunjang();
            };

            function loadProdukDanMappingPenunjang() {
                if (!$scope.itemPenunjang.ruanganAsal || !$scope.itemPenunjang.ruanganAsal.id) return;

                var idTipe = $scope.itemPenunjang.tipePenunjang ? ($scope.itemPenunjang.tipePenunjang.id ? $scope.itemPenunjang.tipePenunjang.id : $scope.itemPenunjang.tipePenunjang) : "";
                var params = "ruanganasal=" + $scope.itemPenunjang.ruanganAsal.id;
                
                if ($scope.itemPenunjang.ruanganTujuan) {
                    params += "&ruanganpenunjang=" + $scope.itemPenunjang.ruanganTujuan.id;
                }

                medifirstService.get(
                    "sysadmin/general/get-combo-administrasi-penunjang?" + params,
                    true
                ).then(function (dat) {
                    if ($scope.itemPenunjang.ruanganTujuan && $scope.itemPenunjang.ruanganTujuan.id) {
                        $scope.listProdukPenunjang = dat.data.produk;
                    } else {
                        $scope.listProdukPenunjang = [];
                    }

                    var list = dat.data.listmapping || [];
                    for (var i = list.length - 1; i >= 0; i--) {
                        list[i].no = i + 1;
                    }
                    dataGridAllPenunjang = list;
                    $scope.searchFilterPenunjang = { namaproduk: '', jenispelayanan: '' };
                    $scope.dataGridPenunjang = new kendo.data.DataSource({ data: list, pageSize: 10 });
                });
            }

            $scope.tambahDataPenunjang = function () {
                if (!$scope.itemPenunjang.ruanganAsal) {
                    alert("Pilih Ruangan Asal terlebih dahulu!");
                    return;
                }
                if (!$scope.itemPenunjang.tipePenunjang) {
                    alert("Pilih Tipe Penunjang terlebih dahulu!");
                    return;
                }
                if (!$scope.itemPenunjang.ruanganTujuan || !$scope.itemPenunjang.ruanganTujuan.id) {
                    alert("Pilih Ruangan Penunjang terlebih dahulu!");
                    return;
                }
                if (!$scope.itemPenunjang.produk || !$scope.itemPenunjang.produk.id) {
                    alert("Pilih Produk / Tindakan terlebih dahulu!");
                    return;
                }
                if (!$scope.itemPenunjang.jenisPelayanan || !$scope.itemPenunjang.jenisPelayanan.id) {
                    alert("Pilih Jenis Pelayanan terlebih dahulu!");
                    return;
                }

                $scope.isSavingPenunjang = true;

                var objSave = {
                    maid: $scope.itemPenunjang.maid || '',
                    pelayanan: $scope.itemPenunjang.produk.id,
                    ruanganasal: $scope.itemPenunjang.ruanganAsal.id,
                    ruanganpenunjang: $scope.itemPenunjang.ruanganTujuan.id,
                    jenispelayanan: $scope.itemPenunjang.jenisPelayanan.id,
                    statuspasien: $scope.itemPenunjang.tipe || null,
                    status: 'SIMPAN_JANG'
                };

                medifirstService.post('sysadmin/general/save-map-administrasi-penunjang', objSave).then(function (e) {
                    $scope.isSavingPenunjang = false;
                    $scope.kosongkanPenunjang();
                    loadProdukDanMappingPenunjang();
                }, function(err) {
                    $scope.isSavingPenunjang = false;
                });
            };

            $scope.hapusDataPenunjang = function () {
                if (!$scope.itemPenunjang.maid) {
                    alert("Pilih data yang akan dihapus dari tabel!");
                    return;
                }

                var r = confirm("Yakin ingin menghapus mapping ini?");
                if (r == true) {
                    $scope.isSavingPenunjang = true;
                    var objSave = {
                        maid: $scope.itemPenunjang.maid,
                        pelayanan: $scope.itemPenunjang.produk ? $scope.itemPenunjang.produk.id : '',
                        ruanganasal: $scope.itemPenunjang.ruanganAsal ? $scope.itemPenunjang.ruanganAsal.id : '',
                        ruanganpenunjang: $scope.itemPenunjang.ruanganTujuan ? $scope.itemPenunjang.ruanganTujuan.id : '',
                        jenispelayanan: $scope.itemPenunjang.jenisPelayanan ? $scope.itemPenunjang.jenisPelayanan.id : '',
                        status: 'HAPUS'
                    };

                    medifirstService.post('sysadmin/general/save-map-administrasi-penunjang', objSave).then(function (e) {
                        $scope.isSavingPenunjang = false;
                        $scope.kosongkanPenunjang();
                        loadProdukDanMappingPenunjang();
                    }, function(err) {
                        $scope.isSavingPenunjang = false;
                    });
                }
            };

            $scope.kosongkanPenunjang = function () {
                $scope.itemPenunjang.maid = undefined;
                $scope.itemPenunjang.produk = undefined;
                $scope.itemPenunjang.hargaTindakan = 0;
            };

            $scope.klikGridPenunjang = function (dataSelected) {
                if (!dataSelected) return;

                $scope.itemPenunjang.maid = dataSelected.maid;
                
                // 1. Set Ruangan Asal
                if (dataSelected.objectruanganfk) {
                    $scope.itemPenunjang.ruanganAsal = { 
                        id: dataSelected.objectruanganfk, 
                        namaruangan: dataSelected.namaruangan_asal 
                    };
                }

                // 2. Set Tipe Penunjang (Lab/Rad)
                var defTipe = null;
                if (dataSelected.objectkamarfk) {
                    medifirstService.get("sysadmin/general/get-combo-administrasi-penunjang?idRuanganTujuan=" + dataSelected.objectkamarfk, true).then(function(resDet){
                        var deptId = resDet.data.ruangan && resDet.data.ruangan.length > 0 ? resDet.data.ruangan[0].objectdepartemenfk : null;
                        
                        if (deptId == 3 || deptId == 27) {
                            $scope.itemPenunjang.tipePenunjang = $scope.listTipePenunjang.find(function(x){ return x.id == deptId; });
                        }

                        medifirstService.get("sysadmin/general/get-combo-administrasi-penunjang?departemenfk=" + (deptId || ""), true).then(function (dat) {
                            $scope.listRuanganTujuanPenunjang = dat.data.ruangan;
                            $scope.itemPenunjang.ruanganTujuan = { 
                                id: dataSelected.objectkamarfk, 
                                namaruangan: dataSelected.namaruangan_tujuan 
                            };

                            var params = "ruanganasal=" + dataSelected.objectruanganfk
                                       + "&ruanganpenunjang=" + dataSelected.objectkamarfk;

                            medifirstService.get("sysadmin/general/get-combo-administrasi-penunjang?" + params, true).then(function (dat2) {
                                $scope.listProdukPenunjang = dat2.data.produk;
                                $scope.itemPenunjang.produk = { 
                                    id: dataSelected.produkfk, 
                                    namaproduk: dataSelected.namaproduk 
                                };                              
                       
                                $scope.itemPenunjang.jenisPelayanan = { 
                                    id: dataSelected.jenispelayananfk, 
                                    jenispelayanan: dataSelected.jenispelayanan 
                                };
                                $scope.itemPenunjang.tipe = dataSelected.statuspasien;
                                
                                $scope.getdetailHargaPenunjang();
                            });
                        });
                    });
                }
            };

            $scope.applySearchFilterPenunjang = function () {
                var namaProduk = $scope.searchFilterPenunjang.namaproduk ? $scope.searchFilterPenunjang.namaproduk.toLowerCase() : '';
                var jenisPel = $scope.searchFilterPenunjang.jenispelayanan ? $scope.searchFilterPenunjang.jenispelayanan.toLowerCase() : '';

                var filteredData = dataGridAllPenunjang.filter(function (item) {
                    var matchProduk = item.namaproduk ? item.namaproduk.toLowerCase().indexOf(namaProduk) !== -1 : false;
                    var matchJenis = item.jenispelayanan ? item.jenispelayanan.toLowerCase().indexOf(jenisPel) !== -1 : false;
                    return matchProduk && matchJenis;
                });

                $scope.dataGridPenunjang = new kendo.data.DataSource({ data: filteredData, pageSize: 10 });
            };

            $scope.resetSearchPenunjang = function () {
                $scope.searchFilterPenunjang = { namaproduk: '', jenispelayanan: '' };
                var list = dataGridAllPenunjang || [];
                for (var i = 0; i < list.length; i++) {
                    list[i].no = i + 1;
                }
                $scope.dataGridPenunjang = new kendo.data.DataSource({ data: list, pageSize: 10 });
            };

            $scope.getdetailHargaPenunjang = function () {
                $scope.itemPenunjang.hargaTindakan = 0;
                
                if ($scope.itemPenunjang.produk && $scope.itemPenunjang.ruanganTujuan && $scope.itemPenunjang.jenisPelayanan) {
                    medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan="
                        + $scope.itemPenunjang.ruanganTujuan.id
                        + "&idKelas=6"  // Non-kelas
                        + "&idProduk=" + $scope.itemPenunjang.produk.id
                        + "&idJenisPelayanan=" + $scope.itemPenunjang.jenisPelayanan.id
                    ).then(function (dat) {
                        if (dat.data.data2 && dat.data.data2.length > 0) {
                            $scope.itemPenunjang.hargaTindakan = dat.data.data2[0].hargasatuan;
                        }
                    });
                }
            };

            $scope.columnGridPenunjang = [
                { field: "no", title: "No", width: "40px" },
                { field: "namaruangan_asal", title: "Ruangan Asal", width: "150px" },
                { field: "namaruangan_tujuan", title: "Ruangan Penunjang", width: "150px" },
                { field: "namaproduk", title: "Produk / Tindakan", width: "200px" },
                { field: "jenispelayanan", title: "Jenis Pelayanan", width: "120px" },
                { field: "statuspasien", title: "Jenis Pasien", width: "80px" }
            ];
            // END PENUNJANG

            //***********************************

        }
    ]);
});
