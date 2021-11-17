define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapKelompokAlatSterilCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.item.jmlRow = 100;
            $scope.arrayProdukTemp = []
            $scope.isRouteLoading = false;
            $scope.showDaftar = true;
            $scope.showInput = false;
            $scope.tombolSimpanVis = true;
            $scope.idPaket = '';
            var data2 = [];
            loadData();

            $scope.listDataSigna = [
                {
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [
                        { "id": 1, "nama": "P", 'isChecked': false },
                        { "id": 2, "nama": "S", 'isChecked': false },
                        { "id": 3, "nama": "Sr", 'isChecked': false },
                        { "id": 4, "nama": "M", 'isChecked': false }
                    ]
                }
            ];
            $scope.currentAturanPakai = []
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0

            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }
                $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1'
                if (jml == 0) {
                    $scope.item.aturanPakai = ''
                }
            }

            $scope.Search = function () {
                loadData()
            }

            $scope.Clear = function () {
                $scope.item = {
                    jmlRow: 100
                }
                $scope.popUp = {}
                loadData()
            }

            $scope.SearchEnter = function () {
                loadData()
            }

            medifirstService.get("sterilisasi/get-data-combo-steril").then(function (data) {
                // $scope.listPaket = data.data.paketobat
                $scope.listProduk = data.data.produk
                $scope.listKelompokAlat = data.data.kelompokalat
                // $scope.listProdukDefault = data.data.produkobat
                // $scope.listsatuanresep = data.data.satuanresep
            })

            function loadData() {

                $scope.isRouteLoading = true;
                var paketId = ""
                if ($scope.item.dataKelompokAlat != undefined) {
                    paketId = "&paketId=" + $scope.item.dataKelompokAlat.id
                }

                var namaPaket = ""
                if ($scope.item.namaPaketS != undefined) {
                    namaPaket = "&namaPaket=" + $scope.item.namaPaketS
                }

                medifirstService.get("sterilisasi/get-data-kelompokalat?"
                    + paketId
                    + namaPaket
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        // group: ,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                })
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
            }

            $scope.getSatuan = function () {
                if ($scope.item.produk != undefined) {
                    $scope.listSatuan = [{ id: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }]
                    $scope.item.satuan = { id: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar };
                }
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }

            $scope.getProdukByPaket = function (paket) {
                $scope.arrayProdukTemp = []
                medifirstService.get("sysadmin/get-mapping-paket?paketId=" + paket.id).then(function (e) {

                    var data = []
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        data.push({ id: element.objectprodukfk, namaproduk: element.namaproduk })

                    }
                    $scope.listProduk = []

                    $scope.arrayProdukTemp = data
                    $scope.listProduk = $scope.listProdukDefault
                    if ($scope.arrayProdukTemp.length > 0) {
                        for (let i = 0; i < $scope.listProduk.length; i++) {
                            const element = $scope.listProduk[i];
                            element.isChecked = false
                            for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                                const elements = $scope.arrayProdukTemp[j];
                                if (element.id == elements.id) {
                                    element.isChecked = true
                                    element.style = "bold-produk"
                                }
                            }
                        }
                    }
                })
            }

            $scope.columnGridSsS = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20%"
                },
                {
                    "field": "kelompokAlatId",
                    "title": "Id Kelompok",
                    "width": "40%"
                },
                {
                    "field": "namakelompokalat",
                    "title": "Nama Kelompok",
                    "width": "40%"
                }
            ]

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),

                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qty",
                            "title": "Qty",
                            "width": "30px",
                        }
                    ]
                }
            };

            // $scope.Tambah = function () {
            //     $scope.arrayProdukTemp = []
            //     $scope.popUps.center().open();
            // }

            $scope.columnGridR = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                }               
            ];

            $scope.MapPaketBaru = function () {
                $scope.item.NamaKelompok = undefined;
                $scope.item.produk = undefined;
                $scope.item.jumlah = undefined;
                $scope.item.satuan = undefined;
                $scope.dataGridR = new kendo.data.DataSource({
                    data: []
                });
                $scope.dataGridR = undefined;
                data2 = [];
                $scope.popupKelompokAlat.center().open();                
            }

            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                // $scope.item.dosis=1
                $scope.item.jumlahxmakan = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.dataSelectedR = undefined
                $scope.dataSelected = undefined
                $scope.item.satuanresep = undefined
            }

            $scope.tambah = function () {
                var nomor = 0
                if ($scope.dataGridR == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                if ($scope.item.jumlah == undefined || $scope.item.jumlah == 0) {
                    alert("Qty Alat Tidak Boleh Kosong Atau 0!!")
                    return;
                }

                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;

                }

                var keterangan = null;
                if ($scope.item.KeteranganPakai != undefined) {
                    keterangan = $scope.item.KeteranganPakai;
                }

                $scope.disabledRuangan = true;
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no                           
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jumlah = $scope.item.jumlah
                            data.jumlahobat = $scope.item.jumlah                                                    
                            data2[i] = data;
                            $scope.dataGridR = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                } else {
                    data = {
                        no: nomor,                        
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jumlah: $scope.item.jumlah,
                        jumlahobat: $scope.item.jumlah,                        
                    }
                    data2.push(data)
                    $scope.dataGridR = new kendo.data.DataSource({
                        data: data2
                    });
                    Kosongkan()
                }
            }

            $scope.klikGridR = function (dataSelectedR) {
                if (dataSelectedR != undefined) {
                    $scope.item.no = dataSelectedR.no
                    $scope.item.produk = { id: dataSelectedR.produkfk, namaproduk: dataSelectedR.namaproduk }
                    $scope.item.satuan = { id: dataSelectedR.objectsatuanstandarfk, satuanstandar: dataSelectedR.satuanstandar }                    
                    $scope.item.jumlah = dataSelectedR.jumlah
                }                    
            }

            $scope.hapus = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1

                            }
                            $scope.dataGridR = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.isRouteLoading = false;
                        }
                    }
                }
                Kosongkan()
            }

            $scope.batalKelompok = function(){
                $scope.item.NamaKelompok = undefined;
                $scope.item.produk = undefined;
                $scope.item.jumlah = undefined;
                $scope.item.satuan = undefined;
                $scope.dataGridR = new kendo.data.DataSource({
                    data: []
                });
                $scope.dataGridR = undefined;
                data2 = [];
                $scope.popupKelompokAlat.close();
            }

            $scope.batalR = function () {
                Kosongkan();
            }

            $scope.Batal = function () {
                Kosongkan();
            }

            $scope.Simpan = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.NamaKelompok == undefined) {
                    alert("Nama Kelompok Tidak Boleh Kosong!!")
                    return
                }

                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                var objSave = {
                    idPaket: $scope.idPaket,
                    namakelompok: $scope.item.NamaKelompok,
                    details: data2
                }

                medifirstService.post('sterilisasi/save-Kelompok-alat-sterilisasi', objSave).then(function (e) {                    
                    $scope.isRouteLoading = false;
                    $scope.item.NamaKelompok = undefined;
                    $scope.item.produk = undefined;
                    $scope.item.jumlah = undefined;
                    $scope.item.satuan = undefined;                    
                    $scope.dataGridR = new kendo.data.DataSource({
                        data: []
                    });
                    $scope.dataGridR = undefined;
                    data2 = [];
                    $scope.popupKelompokAlat.close();
                    loadData();
                })
            }

            $scope.UbahPaket = function () {
                data2 =[];
                $scope.isRouteLoading = true;
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih")
                }
                $scope.idPaket = $scope.dataSelected.kelompokAlatId;
                $scope.item.NamaKelompok = $scope.dataSelected.namakelompokalat;
                data2 = $scope.dataSelected.details
                    for (let i = 0; i < data2.length; i++) {
                        const element = data2[i];
                        element.no = i + 1;
                    }
                    $scope.dataGridR = new kendo.data.DataSource({
                        data: data2
                    });
                $scope.isRouteLoading = false;
                $scope.popupKelompokAlat.center().open();                
            }

            $scope.HapusPaket = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih")
                }

                var objSave = {
                    idPaket: $scope.dataSelected.kelompokAlatId
                }

                medifirstService.post('sterilisasi/delete-Kelompok-alat-sterilisasi', objSave).then(function (e) {                    
                    $scope.isRouteLoading = false;
                    loadData();
                })
            }            
            //** BATAS */
        }
    ]);
});