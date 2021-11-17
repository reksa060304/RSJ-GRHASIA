define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderAlatSterilCtrl', ['$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
        function ($scope, cacheHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglAwal = new Date();
            var pegawaiUser = {}
            var norecCetak = '';
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var norecOrder = '';
            var dataPaket = [];
            $scope.listJenisKirim = [{ id: 2, jenis: 'Transfer' }]
            $scope.item.Keterangan = "Order Barang Steril"
            ComboLoad();
            LoadCache();
            // init();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('OrderAlatSterilCtrl');
                if (chacePeriode != undefined) {
                    norecOrder = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('OrderAlatSterilCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                if (noOrder != '') {
                    if (noOrder == 'EditOrder') {
                        medifirstService.get("logistik/get-detail-order-barang-ruangan?norecOrder=" + norecOrder, true).then(function (data_ih) {
                            $scope.isRouteLoading = false;
                            $scope.item.noOrder = data_ih.data.head.noorder
                            $scope.item.ruangan = { id: data_ih.data.head.objectruanganasalfk, namaruangan: data_ih.data.head.namaruanganasal }
                            $scope.item.ruanganTujuan = { id: data_ih.data.head.objectruangantujuanfk, namaruangan: data_ih.data.head.namaruangantujuan }
                            $scope.item.jenisKirim = { id: data_ih.data.head.jeniskirimfk, jenis: data_ih.data.head.jeniskirim }
                            $scope.item.tglAwal = data_ih.data.head.tglorder
                            $scope.item.Keterangan = data_ih.data.head.keteranganorder
                            data2 = data_ih.data.detail
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        });
                    }
                }
            }            

            function ComboLoad() {

                medifirstService.get("sterilisasi/get-data-combo-steril", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listDataJabatan = dataCombo.jabatan;
                    // $scope.listPenulisResep = dat.data.penulisresep;
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();                   
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.listProduk = dataCombo.produk;
                    $scope.listRuanganTujuan = dataCombo.ruangancssd;
                    $scope.item.ruanganTujuan = $scope.listRuanganTujuan [0];
                    pegawaiUser = medifirstService.getPegawaiLogin(); //dataCombo.detaillogin[0];
                    $scope.item.ruangan = $scope.listRuangan[0];
                    $scope.item.jenisKirim = $scope.listJenisKirim[0];//{ id: 2, jenis: 'Transfer' }
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            $scope.getSatuan = function () {
                /* info stok all ruangan */
                medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        for (var i = 0; i < e.data.infostok.length; i++) {
                            e.data.infostok[i].no = i + 1
                        }
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        })
                    })
                /* end info stok all ruangan */
                GETKONVERSI(0)
            }

            function GETKONVERSI(jml) {
                if ($scope.item.produk == undefined) {
                    return
                }
                if ($scope.item.produk == "") {
                    return
                }
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     //alert("Pilih asal terlebih dahulu!!")
                //     return;
                // }
                medifirstService.get("logistik/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruanganTujuan.id, true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        $scope.item.jumlah = jml
                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }

            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.total = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    }
                }
            });

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    // if ($scope.item.jenisKemasan == undefined) {
                    //     return
                    // }
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        //alert('Stok kosong')

                        return;
                    }
                    var ada = false;
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                        if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                            hrg1 = parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi)
                            hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                            $scope.item.hargaSatuan = hrg1
                            $scope.item.hargadiskon = hrgsdk
                            $scope.item.total = parseFloat($scope.item.jumlah) * (hrg1 - hrgsdk)
                            noTerima = dataProdukDetail[i].norec
                            $scope.item.asal = { id: dataProdukDetail[i].objectasalprodukfk, asalproduk: dataProdukDetail[i].asalproduk }
                            ada = true;
                            break;
                        }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.total = 0

                        noTerima = ''
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                    }
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                if (parseFloat($scope.item.stok) == 0) {
                    alert("Stok tidak ada!")
                    return;
                }
                // if ($scope.item.jenisKemasan == undefined) {
                //     alert("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    alert("Jumlah blm di isi!!")
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
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.hargajual = String($scope.item.hargaSatuan)
                            data.jenisobatfk = null
                            data.stock = String($scope.item.stok)
                            data.harganetto = String($scope.item.hargaSatuan)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.kdproduk = $scope.item.produk.kdsirs
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = String($scope.item.stok)
                            data.jumlah = $scope.item.jumlah
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargadiskon)
                            data.total = $scope.item.total

                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        hargajual: String($scope.item.hargaSatuan),
                        jenisobatfk: null,
                        stock: String($scope.item.stok),
                        harganetto: String($scope.item.hargaSatuan),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,//£££                        
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        kdproduk: $scope.item.produk.kdsirs,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: String($scope.item.stok),
                        jumlah: $scope.item.jumlah,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargadiskon),
                        total: $scope.item.total
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                // if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                //     $scope.item.rke = parseFloat($scope.item.rke) + 1
                // }
                Kosongkan()
                racikan = ''
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}                
                $scope.item.jumlah = 0
                GETKONVERSI(dataSelected.jumlah)
                $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }
            }
            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
            }
            $scope.batal = function () {
                Kosongkan()
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "produkfk",
                    "title": "Kode Produk",
                    "width": "70px",
                },
                {
                    "field": "kdproduk",
                    "title": "Kode Sirs",
                    "width": "70px",
                },
                {
                    "field": "asalproduk",
                    "title": "Asal Produk",
                    "width": "100px",
                },
                {
                    "field": "namaproduk",
                    "title": "Produk",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jmlstok",
                    "title": "Stok",
                    "width": "70px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "70px",
                }
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.SaveOrder = function () {
                $scope.saveShow = false;
                var keterangan = 'Order Barang';
                if ($scope.item.Keterangan != undefined || $scope.item.Keterangan != '') {
                    keterangan = $scope.item.Keterangan
                }
                var strukorder = {
                    norecorder: norecOrder,
                    pegawaiorderfk: pegawaiUser.id,
                    ruanganfk: $scope.item.ruangan.id,
                    ruangantujuanfk: $scope.item.ruanganTujuan.id,
                    jenispermintaanfk: $scope.item.jenisKirim.id,
                    keteranganorder: keterangan,
                    qtyjenisproduk: data2.length,
                    tglorder: moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss'),
                }
                var objSave =
                {
                    strukorder: strukorder,
                    details: data2
                }
                medifirstService.post('logistik/save-order-barang-ruangan', objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim
                    norecCetak = $scope.item.noKirim;
                    Kosongkan();
                    $scope.popUp.center().open();
                })
            }

            $scope.simpan = function () {
                if ($scope.item.ruangan == undefined) {
                    alert("Pilih Ruanganan Pengirim!!")
                    return
                }
                if ($scope.item.ruanganTujuan == undefined) {
                    alert("Pilih Ruanganan Tujuan!!")
                    return
                }
                if ($scope.item.jenisKirim == undefined) {
                    alert("Pilih Jenis Kiriman!!")
                    return
                }
                if ($scope.item.Keterangan == undefined) {
                    alert("Keterangan Tidak Boleh Kosong!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah anda yakin akan order Barang?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.SaveOrder();
                })
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

            $scope.BatalR = function () {
                $scope.showInputObat = true
                $scope.showRacikan = false
                $scope.item.jenisKemasan = ''
                racikan = ''
            }

            $scope.hapus = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                if ($scope.item.total == 0) {
                    alert("Stok tidak ada harus di isi!")
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
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }
                }
                Kosongkan()
            }

            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width": "50px",
                }

            ];

            $scope.columnGridSsS = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20%"
                },
                {
                    "field": "namakelompokalat",
                    "title": "Nama Set",
                    "width": "100%"
                }
            ]

            $scope.data2s = function (dataItem) {
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
                    ]
                }
            };

            $scope.BatalPaket = function(){
                dataPaket = [];
                $scope.dataSource = new kendo.data.DataSource({
                    data: [],
                });
                $scope.popUpSetAlat.close();
            }

            $scope.setAlat = function () {                
                dataPaket = []
                medifirstService.get("sterilisasi/get-data-kelompokalat?").then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
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
                    $scope.popUpSetAlat.center().open();
                })
            }

            $scope.klikGridSsS = function (dataSelectedSsS) {
                $scope.isRouteLoading = true;
                dataPaket = [];
                if (dataSelectedSsS != undefined) {
                    $scope.dataSelectedSsS = dataSelectedSsS
                    var KetPakai = "";
                    if ($scope.item.KeteranganPakai) {
                        KetPakai = $scope.item.KeteranganPakai;
                    }

                    var jRacikan = null
                    if ($scope.item.jenisRacikan != undefined) {
                        jRacikan = $scope.item.jenisRacikan.id
                    }
                    var dosis = 1;
                    var datas = 0;
                    for (let i = 0; i < $scope.dataSelectedSsS.details.length; i++) {
                        $scope.isRouteLoading = true;
                        const element = $scope.dataSelectedSsS.details[i];
                        if (element.produkfk != undefined) {
                            medifirstService.get("farmasi/get-produkdetail?" +
                                "produkfk=" + element.produkfk +
                                "&ruanganfk=" + $scope.item.ruanganTujuan.id, true).then(function (dat) {
                                    dataProdukDetail = dat.data.detail[0];
                                    var nilaiKonversi = 1;
                                    datas = datas + 1;
                                    var stok = dat.data.jmlstok / nilaiKonversi
                                    var kekuatan = dat.data.kekuatan
                                    var sediaan = dat.data.sediaan
                                    if (parseFloat(stok) < parseFloat(element.qty)) {
                                        toastr.error("Stok untuk alat " + element.namaproduk + " kurang dari stok ruangan")
                                        return;
                                    }
                                    var nomor = 0
                                    if (data2 == undefined) {
                                        nomor = 1
                                    } else {
                                        nomor = data2.length + 1
                                    }                                   
                                    var data = {
                                        no: nomor,
                                        hargajual: String(dataProdukDetail.hargajual),
                                        stock: String($scope.item.stok),
                                        harganetto: String(dataProdukDetail.hargajual),
                                        nostrukterimafk: noTerima,
                                        ruanganfk: $scope.item.ruangan.id,//£££                       
                                        asalprodukfk: dataProdukDetail.objectasalprodukfk,
                                        asalproduk: dataProdukDetail.asalproduk,
                                        produkfk: element.produkfk,
                                        namaproduk: element.namaproduk,
                                        nilaikonversi: nilaiKonversi,
                                        kdproduk: element.produkfk,                                        
                                        satuanstandarfk: element.objectsatuanstandarfk,
                                        satuanstandar: element.satuanstandar,
                                        satuanviewfk: element.objectsatuanstandarfk,
                                        satuanview: element.satuanstandar,
                                        jmlstok: String(stok),
                                        jumlah: element.qty,                                        
                                        qtyorder: 0,
                                        hargasatuan: String(dataProdukDetail.hargajual),
                                        hargadiscount: String(0),
                                        total: (parseFloat(element.qty) * parseFloat(dataProdukDetail.hargajual)),                                                                               
                                    }
                                    dataPaket.push(data);                                    
                                    data2.push(data)
                                    $scope.isRouteLoading = false;
                                    if (datas == $scope.dataSelectedSsS.details.length) {
                                        $scope.butPaket = true
                                    }
                                });
                        }
                    }
                }
            }

            $scope.tambahPaket = function () {
                $scope.butPaket = false;
                $scope.popUpSetAlat.close();
                if (dataPaket == undefined) {
                    toastr.error("data Belum Dipilih");
                    return;
                }                              
                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                });
                                
                Kosongkan()
                $scope.butPaket = false
                // statusTambah = false
            }

            ////////////////////////////////////////           
        }
    ]);
});

