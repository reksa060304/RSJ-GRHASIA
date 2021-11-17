define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapPaketToProdukObatCtrl', ['$scope', 'MedifirstService',
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

            medifirstService.get("sysadmin/get-combo-paket").then(function (data) {
                $scope.listPaket = data.data.paketobat
                $scope.listProduk = data.data.produkobat
                $scope.listProdukDefault = data.data.produkobat
                $scope.listsatuanresep = data.data.satuanresep
            })

            function loadData() {

                $scope.isRouteLoading = true;
                var paketId = ""
                if ($scope.item.dataPaket != undefined) {
                    paketId = "&paketId=" + $scope.item.dataPaket.id
                }

                var namaPaket = ""
                if ($scope.item.namaPaketS != undefined) {
                    namaPaket = "&namaPaket=" + $scope.item.namaPaketS
                }

                medifirstService.get("sysadmin/get-paket-obat?"
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
                    "field": "paketId",
                    "title": "Id Paket",
                    "width": "40%"
                },
                {
                    "field": "namapaket",
                    "title": "Nama Paket",
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
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "70px"
                        },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "100px"
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
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px"
                }
            ];

            $scope.MapPaketBaru = function () {
                $scope.showDaftar = false;
                $scope.showInput = true;
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
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
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
                            data.aturanpakai = $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
                            data.ispagi = $scope.item.chkp
                            data.issiang = $scope.item.chks
                            data.issore = $scope.item.chksr
                            data.ismalam = $scope.item.chkm
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jumlah = $scope.item.jumlah
                            data.jumlahobat = $scope.item.jumlah
                            data.keterangan = keterangan
                            data.satuanresepfk = $scope.item.satuanresep != undefined ? $scope.item.satuanresep.id : null
                            data.satuanresep = $scope.item.satuanresep != undefined ? $scope.item.satuanresep.satuanresep : null
                            data2[i] = data;
                            $scope.dataGridR = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        aturanpakai: $scope.item.aturanPakai,
                        aturanpakai: $scope.item.aturanPakai,//+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                        ispagi: $scope.item.chkp,
                        issiang: $scope.item.chks,
                        issore: $scope.item.chksr,
                        ismalam: $scope.item.chkm,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jumlah: $scope.item.jumlah,
                        jumlahobat: $scope.item.jumlah,
                        keterangan: keterangan,
                        satuanresepfk : $scope.item.satuanresep != undefined ? $scope.item.satuanresep.id : null,
                        satuanresep : $scope.item.satuanresep != undefined ? $scope.item.satuanresep.satuanresep : null,
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
                    $scope.item.satuanresep = { id: dataSelectedR.satuanresepfk, satuanresep: dataSelectedR.satuanresep }
                    $scope.item.jumlah = dataSelectedR.jumlah
                    $scope.item.KeteranganPakai = dataSelectedR.keterangan
                    $scope.item.aturanPakai = dataSelectedR.aturanpakai
                    $scope.item.chkp = 0
                    $scope.item.chks = 0
                    $scope.item.chksr = 0
                    $scope.item.chkm = 0
                    let sp = false
                    if (dataSelectedR.ispagi != "0") {
                        sp = true
                        $scope.item.chkp = 1
                    }
                    let ss = false
                    if (dataSelectedR.issiang != "0") {
                        ss = true
                        $scope.item.chks = 1
                    }
                    let sr = false
                    if (dataSelectedR.issore != "0") {
                        sr = true
                        $scope.item.chksr = 1
                    }
                    let sm = false
                    if (dataSelectedR.ismalam != "0") {
                        sm = true
                        $scope.item.chkm = 1
                    }
                    $scope.listDataSigna = [
                        {
                            "id": 1,
                            "nama": "Aturan Pakai",
                            "detail": [
                                { "id": 1, "nama": "P", 'isChecked': sp },
                                { "id": 2, "nama": "S", 'isChecked': ss },
                                { "id": 3, "nama": "Sr", 'isChecked': sr },
                                { "id": 4, "nama": "M", 'isChecked': sm }
                            ]
                        }
                    ];
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

            $scope.batalR = function () {
                Kosongkan();
            }

            $scope.Batal = function () {
                Kosongkan();
            }

            $scope.simpan = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.namaPaket == undefined) {
                    alert("Nama Paket Tidak Boleh Kosong!!")
                    return
                }

                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                var objSave = {
                    idPaket: $scope.idPaket,
                    namapaket: $scope.item.namaPaket,
                    paketobat: data2
                }

                medifirstService.post('sysadmin/save-data-paket-obat', objSave).then(function (e) {
                    $scope.tombolSimpanVis = false;
                    $scope.showDaftar = true;
                    $scope.showInput = false;
                    $scope.isRouteLoading = false;
                    loadData();
                })
            }

            $scope.UbahPaket = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih")
                }
                $scope.idPaket = $scope.dataSelected.paketId;
                $scope.item.namaPaket = $scope.dataSelected.namapaket;
                medifirstService.get("sysadmin/get-paket-obat?paketId="
                    + $scope.idPaket
                ).then(function (data) {
                    var datas = data.data.data[0];
                    data2 = datas.details
                    for (let i = 0; i < data2.length; i++) {
                        const element = data2[i];
                        element.no = i + 1;
                    }
                    $scope.dataGridR = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.showDaftar = false;
                    $scope.showInput = true;
                    $scope.isRouteLoading = false;
                })
            }

            $scope.HapusPaket = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih")
                }

                var objSave = {
                    idPaket: $scope.dataSelected.paketId
                }

                medifirstService.post('sysadmin/delete-data-paket-obat', objSave).then(function (e) {
                    $scope.tombolSimpanVis = false;
                    $scope.showDaftar = true;
                    $scope.showInput = false;
                    $scope.isRouteLoading = false;
                    loadData();
                })
            }

            $scope.Riwayat = function () {
                Kosongkan()
                $scope.showDaftar = true;
                $scope.showInput = false;
                loadData();
            }

            //** BATAS */
        }
    ]);
});