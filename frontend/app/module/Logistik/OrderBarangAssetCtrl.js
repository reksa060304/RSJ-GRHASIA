define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('OrderBarangAssetCtrl', ['$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
        function ($scope, cacheHelper, $mdDialog, medifirstService) {
            $scope.isRouteLoading = false
            $scope.item = {
                jumlah: 1,
            };
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglorder = new Date();
            $scope.isEdit = false;
            $scope.isAdd = true;
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
            $scope.disabledRuangan = true;
            ComboLoad();
            LoadCache();
            // init();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('OrderBarangAssetCtrl');
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
                    cacheHelper.set('OrderBarangAssetCtrl', chacePeriode);
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
                            $scope.disabledRuangan = true;
                            $scope.item.jeniskirim = { id: data_ih.data.head.jeniskirimfk, jenis: data_ih.data.head.jeniskirim }
                            $scope.item.tglorder = data_ih.data.head.tglorder
                            $scope.item.keterangan = data_ih.data.head.keteranganorder
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
                } else {
                    $scope.disabledRuangan = false;
                }
            }

            $scope.CetakAh = function () {
                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai2 = $scope.item.DataPegawai.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatanPenyerah != undefined) {
                    jabatan3 = $scope.item.DataJabatanPenyerah.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawaiPenyerah != undefined) {
                    pegawai3 = $scope.item.DataPegawaiPenyerah.id;
                }

                var jabatan4 = ''
                if ($scope.item.DataJabatanPenerima != undefined) {
                    jabatan4 = $scope.item.DataJabatanPenerima.namajabatan;
                }

                var pegawai4 = ''
                if ($scope.item.DataPegawaiPenerima != undefined) {
                    pegawai4 = $scope.item.DataPegawaiPenerima.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-order=1&nores=' + norecCetak + '&pegawaiMegetahui=' + pegawai1 + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1 + '&jabatanMeminta=' + jabatan2
                    + '&pegawaiPenyerah=' + pegawai3 + '&pegawaiPenerima=' + pegawai4
                    + '&jabatanPenyerah=' + jabatan3 + '&jabatanPenerima=' + jabatan4
                    + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
            }

            function ComboLoad() {
                $scope.isRouteLoading = true
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    var response = dat.data;
                    $scope.listDataJabatan = dataCombo.jabatan;
                    $scope.item.noOrder = dataCombo.spb
                    $scope.item.sn = dataCombo.SN
                    // $scope.listPenulisResep = dat.data.penulisresep;
                    console.log(medifirstService.getMapLoginUserToRuangan());
                    $scope.listRuangan = dataCombo.ruanganall;
                    $scope.listJenisKirim = [{ id: 1, jenis: 'Amprahan' }, { id: 2, jenis: 'Transfer' }]
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.ListRuanganAset = response.ruanganaset;
                    $scope.listProdukAsset = dataCombo.produkasset;
                    $scope.listRuanganTujuan = dataCombo.ruanganGudang;
                    pegawaiUser = dataCombo.detaillogin[0];
                    if (medifirstService.getMapLoginUserToRuangan()[0] != undefined) {
                        $scope.item.ruangan = {
                            id: medifirstService.getMapLoginUserToRuangan()[0].id,
                            namaruangan: medifirstService.getMapLoginUserToRuangan()[0].namaruangan
                        }
                    }
                    // $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.jeniskirim = { id: 2, jenis: 'Transfer' }
                    $scope.isRouteLoading = false
                });
                
                // medifirstService.get('sysadmin/master/get-combo-master').then(function(data){
                //     var datas = data.data
                //     $scope.listRuanganAset = datas.ruanganaset
                // })

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            $scope.columnGridTransfer = [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "100px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "100px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Pemesan",
                    "width": "70px",
                },
                {
                    "field": "qtyorder",
                    "title": "Qty order",
                    "width": "70px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty kirim",
                    "width": "70px",
                },

            ];

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if (!$scope.item.jumlah || $scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return
                }
                if (!$scope.item.produk) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }

                var data = {}

                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.noorder = $scope.item.noorder
                            data.tglorder = $scope.item.tglorder
                            data.jeniskirim = $scope.item.jeniskirim
                            data.ruanganpemesanfk = $scope.item.ruangan.id
                            data.ruanganpemesan = $scope.item.ruangan.namaruangan
                            data.ruangantujuanfk = $scope.item.ruanganTujuan.id
                            data.ruangantujuan = $scope.item.ruanganTujuan.namaruangan
                            data.ruanganasalprodukfk = $scope.item.produk.objectruanganposisicurrentfk
                            data.ruanganasalproduk = $scope.item.produk.ruangansekarang
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.jumlah = $scope.item.jumlah
                            data.keterangan = $scope.item.keterangan
                            data2[i] = data
                            break
                        }
                    }
                } else {
                    data.no = data2.length + 1
                    data.noorder = $scope.item.noorder
                    data.tglorder = $scope.item.tglorder
                    data.jeniskirim = $scope.item.jeniskirim
                    data.ruanganpemesanfk = $scope.item.ruangan.id
                    data.ruanganpemesan = $scope.item.ruangan.namaruangan
                    data.ruangantujuanfk = $scope.item.ruanganTujuan.id
                    data.ruangantujuan = $scope.item.ruanganTujuan.namaruangan
                    data.ruanganasalprodukfk = $scope.item.produk.objectruanganposisicurrentfk
                    data.ruanganasalproduk = $scope.item.produk.ruangansekarang
                    data.produkfk = $scope.item.produk.id
                    data.namaproduk = $scope.item.produk.namaproduk
                    data.jumlah = $scope.item.jumlah
                    data.keterangan = $scope.item.keterangan
                    data2.push(data)
                }

                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                })

                Kosongkan()
            }

            $scope.klikGrid = function (dataSelected) {
                $scope.isEdit = true;
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listProdukAsset.length - 1; i >= 0; i--) {
                    if ($scope.listProdukAsset[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProdukAsset[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}                
                $scope.item.jumlah = dataSelected.jumlah
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
                $scope.item.jumlah = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.isEdit = false;
                $scope.isAdd = true;
            }
            $scope.batal = function () {
                Kosongkan()
            }




            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Daftar Order Barang" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var tanggal = moment($scope.now).format('DD-MMM-YYYY');

                    sheet.mergedCells = ["A1:H1", "A2:H2"];
                    sheet.name = "Order Barang";

                    sheet.rows[0].cells[0].background = '#ffffff'; 
                    sheet.rows[0].cells[0].color = '#000000';
                    sheet.rows[0].cells[0].textAlign = 'center';
                    sheet.rows[0].cells[1].background = '#ffffff'; 
                    sheet.rows[0].cells[1].color = '#000000';
                    sheet.rows[0].cells[1].textAlign = 'center'; 
                    sheet.rows[0].cells[2].background = '#ffffff'; 
                    sheet.rows[0].cells[2].color = '#000000';
                    sheet.rows[0].cells[2].textAlign = 'center'; 
                    sheet.rows[0].cells[3].background = '#ffffff'; 
                    sheet.rows[0].cells[3].color = '#000000';
                    sheet.rows[0].cells[3].textAlign = 'center'; 
                    sheet.rows[0].cells[4].background = '#ffffff'; 
                    sheet.rows[0].cells[4].color = '#000000';
                    sheet.rows[0].cells[4].textAlign = 'center';
                    sheet.rows[0].cells[5].background = '#ffffff'; 
                    sheet.rows[0].cells[5].color = '#000000';
                    sheet.rows[0].cells[5].textAlign = 'center';
                    sheet.rows[0].cells[6].background = '#ffffff'; 
                    sheet.rows[0].cells[6].color = '#000000';
                    sheet.rows[0].cells[6].textAlign = 'center';
                    sheet.rows[0].cells[7].background = '#ffffff'; 
                    sheet.rows[0].cells[7].color = '#000000';
                    sheet.rows[0].cells[7].textAlign = 'center';

                    for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                        console.log(e.workbook.sheets[0].rows.length);
                        console.log(e.workbook.sheets[0].rows[i].cells.length);
                    }

                    var columns = e.workbook.sheets[0].columns;
                    delete columns[0].width;
                    columns[0].width = 50;
                    delete columns[1].width;
                    columns[1].width = 150;
                    delete columns[2].width;
                    columns[2].width = 100;
                    delete columns[3].width;
                    columns[3].width = 200;
                    delete columns[4].width;
                    columns[4].width = 300;
                    delete columns[5].width;
                    columns[5].width = 100;
                    delete columns[6].width;
                    columns[6].width = 100;
                    delete columns[7].width;
                    columns[7].width = 100;

                    // var sheetbor = spreadsheet.activeSheet();
                    // sheetbor.range("A10:H70").border = "black";

                    var myHeaders = [{
                        value: "Order Barang " + tanggal,
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 15 });
                },

                selectable: 'row',
                scrollable: true,
                pageable: true,  
                columns: [
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
                    // {
                    //     "field": "kdproduk",
                    //     "title": "Kode Sirs",
                    //     "width": "70px",
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "200px",
                    },
                    // {
                    //     "field": "satuanstandar",
                    //     "title": "Satuan",
                    //     "width": "80px",
                    // },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "70px",
                    },
                    // {
                    //     "field": "ruanganasalproduk",
                    //     "title": "Ruangan Asal Produk",
                    //     "width": "100px",
                    // },
                    {
                        "field": "ruanganpemesan",
                        "title": "Ruangan Pemesan",
                        "width": "100px",
                    },
                    {
                        "field": "ruangantujuan",
                        "title": "Ruangan Tujuan",
                        "width": "100px",
                    },
                ]

            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.simpan = function () {
                if (!$scope.item.ruangan) {
                    alert("Pilih Ruanganan Pengirim!!")
                    return
                }
                if (!$scope.item.ruanganTujuan) {
                    alert("Pilih Ruanganan Tujuan!!")
                    return
                }
                if (!$scope.item.jeniskirim) {
                    alert("Pilih Jenis Kiriman!!")
                    return
                }
                if (!$scope.item.keterangan) {
                    alert("keterangan Tidak Boleh Kosong!!")
                    return
                }
                if (data2.length === 0) {
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
                    $scope.SaveOrder()
                })
            }

            $scope.SaveOrder = function () {
                $scope.saveShow = false
                var keterangan = 'Order Barang Asset'
                if ($scope.item.keterangan) keterangan = $scope.item.keterangan

                var strukorder = {
                    norecorder: norecOrder,
                    noorder: $scope.item.noorder,
                    pegawaiorderfk: pegawaiUser.id,
                    ruanganfk: $scope.item.ruangan.id,
                    ruangantujuanfk: $scope.item.ruanganTujuan.id,
                    jenispermintaanfk: $scope.item.jeniskirim.id,
                    keteranganorder: keterangan,
                    qtyjenisproduk: data2.length,
                    tglorder: moment($scope.item.tglorder).format('YYYY-MM-DD HH:mm:ss')
                }

                var details = []
                for (var i = 0; i < data2.length; i++) {
                    var item = data2[i]
                    details.push({
                        noorder: $scope.item.noorder,
                        tglorder: $scope.item.tglorder,
                        jeniskirim: $scope.item.jeniskirim,
                        ruanganpemesanfk: $scope.item.ruangan.id,
                        ruanganpemesan: $scope.item.ruangan.namaruangan,
                        ruangantujuanfk: $scope.item.ruanganTujuan.id,
                        ruangantujuan: $scope.item.ruanganTujuan.namaruangan,
                        ruanganasalprodukfk: item.objectruanganposisicurrentfk,
                        ruanganasalproduk: item.ruangansekarang,
                        produkfk: item.produkfk,
                        namaproduk: item.namaproduk,
                        jumlah: item.jumlah,
                        keterangan: item.keterangan
                    })
                }

                var objSave = {
                    strukorder: strukorder,
                    details: details
                }
                console.log('Details:', data2)

                medifirstService.post('logistik/save-order-barang-asset', objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim
                    norecCetak = $scope.item.noKirim
                    window.history.back();
                    Kosongkan()
                    // $scope.popUp.center().open()
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

            $scope.gridOptionsProdukAset = {
                selectable: "row",
                pageable: true,
                scrollable: true,
                sortable: true,
                columns: $scope.columnGridProdukAset,
                dataSource: $scope.dataGridProdukAset,
                change: function(e) {
                    const grid = e.sender
                    const selected = grid.dataItem(grid.select())
                    $scope.$apply(() => {
                        $scope.click(selected)
                    })
                }
            }

            $scope.click = function (dataSelectedProdukAset) {
                let data = {}

                data.no = $scope.item.no
                // data.produkfk = dataSelectedProdukAset.objectprodukfk
                data.namaproduk = dataSelectedProdukAset.namaproduk
                // data.ruanganfk = dataSelectedProdukAset.objectruanganposisicurrentfk
                data.namaruangan = dataSelectedProdukAset.namaruangan
                // data.jumlah = $scope.item.jumlah
                if (!dataSelectedProdukAset) return

                $scope.dataGridProdukAset = new kendo.data.DataSource({
                    data: [{
                        no: 1,
                        namaproduk: dataSelectedProdukAset.namaproduk,
                        namaruangan: dataSelectedProdukAset.namaruangan
                    }]
                })
            }

            $scope.columnGridProdukAset = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Produk",
                    "width": "100px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
            ];

            function cekProdukSama() {
                if ($scope.isEdit == false) {
                    if (data2.length > 0) {
                        for (let i = 0; i < data2.length; i++) {
                            const element = data2[i];
                            if ($scope.item.produk.id == element.produkfk && $scope.item.jumlah == element.jumlah) {
                                window.messageContainer.error('Produk ' + element.namaproduk + ', tidak bisa menambahkan produk yang sama !')
                                $scope.isAdd = false;
                                // $scope.saveShow = false;
                                return;
                            }
                        }
                    }
                } else {
                    $scope.isEdit = false;
                    $scope.isAdd = true;
                }
            }
            $scope.KlikGrids = function (dataSelected) {
                $scope.item.no = dataSelected.no
                $scope.item.produk = {
                    id: dataSelected.produkfk,
                    namaproduk: dataSelected.namaproduk,
                    objectprodukfk: dataSelected.produkfk,
                    objectruanganposisicurrentfk: dataSelected.objectruanganposisicurrentfk || dataSelected.ruanganasalprodukfk,
                    ruangansekarang: dataSelected.ruanganasalproduk || '-',
                    jumlah : dataSelected.qtyproduk
                }

                $scope.item.namaProduks = dataSelected.namaproduk + ' - ' + (dataSelected.ruanganasalproduk || '-')
            }

            $scope.$watch('item.produk', function(newVal) {
                if (!newVal || !newVal.id) return

                $scope.item.namaProduks = newVal.namaproduk

                // Filter semua data yang memiliki produk yang sama
                const filtered = $scope.listProdukAsset.filter(item =>
                    item.objectprodukfk === newVal.objectprodukfk
                )

                // Tambahkan nomor urut
                filtered.forEach((item, index) => {
                    item.no = index + 1
                    item.namaproduk = item.namaproduk || newVal.namaproduk
                    item.namaruangan = item.ruangansekarang || '-'
                })

                $scope.dataGridProdukAset = new kendo.data.DataSource({
                    data: filtered,
                    pageSize: 5
                })
            })


            function sendNotification(e) {
                var body = {
                    norec: e.norec,
                    judul: 'Order Barang Baru #' + e.noorder,
                    jenis: 'Barang Logistik',
                    pesanNotifikasi: '',
                    idRuanganAsal: e.objectruanganfk,
                    idRuanganTujuan: e.objectruangantujuanfk,
                    ruanganAsal: $scope.item.ruangan.namaruangan,
                    ruanganTujuan: $scope.item.ruanganTujuan.namaruangan,
                    kelompokUser: null, //medifirstService.getKelompokUser()
                    idKelompokUser: null,
                    idPegawai: medifirstService.getPegawai().id,
                    dataArray: [],
                    urlForm: 'DaftarOrderBarang',
                    params: {
                        noOrder: e.noorder
                    },
                    namaFungsiFrontEnd: null,
                    tgl: e.tglorder,
                    tgl_string: dateHelper.getTanggalJamFormatted(e.tglorder),
                }
                medifirstService.sendSocket("sendNotification", body);
            }
            //** BATAS */           
        }
    ]);
});

