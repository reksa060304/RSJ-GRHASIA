define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PenerimaanStokDarahCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, $mdDialog, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglTerima = new Date();
            $scope.item.tglFaktur = new Date();
            $scope.item.TglJatuhTempo = new Date();
            $scope.item.tglKK = new Date();
            $scope.item.tglAwal = new Date();
            $scope.item.tglUsulan = new Date();
            $scope.item.tahun = moment($scope.now).format('YYYY');
            $scope.isRouteLoading = false;
            var NorecCetak = '';
            $scope.kaskecilShow = false;
            var noOrder = '';
            var pegawaiUser = {}
            var norec_Realisasi = '';
            var norec_RealisasiKontrak = '';
            var norecRR = '';
            var keltrans = '';
            var verifikasifk = '';
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var NoOrderFk = undefined;
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var nilai = 0
            var kelTrans = '';
            var qty = 0
            var hrgsatuan = 0
            var ppn = 0
            var hargadiskon = 0
            var ppnprs = 0
            var hargadiskonprs = 0
            var sppb = '';
            var ttlTotal = 0;
            var ttlDiskon = 0;
            var ttlPpn = 0;
            var grandTotal = 0;
            var norecTerima = ''
            var norecSPPB = ''
            var loadSPK = 'tidak'
            var loadSPPB = 'tidak'
            var loadSPPBDetail = 'tidak'
            var dataIN = '';
            var subTtlSetelahDiskon = 0
            var urlKirimBarangElogistic=''
            var profile =JSON.parse(localStorage.getItem('profile'))
            var kdProfileELogistic=profile.kodeexternal
            $scope.disableSppb = false;
            $scope.isPenerimaanElogistic =false
            loadSettingDataFixed()
            ComboLoad()
            LoadCache();

            function loadSettingDataFixed(){
                medifirstService.get('sysadmin/settingdatafixed/get/urlKirimBarangElogistic').then(function (dat) {
                    urlKirimBarangElogistic = dat.data

                })
            }

            function LoadCache() {
                // $scope.item.noTerima = 'RS/' + moment(new Date()).format('YYMM')+'____'
                // $scope.item.noBuktiKK = '____' + '/KK/' + moment(new Date()).format('MM/YY')
                var chacePeriode = cacheHelper.get('PenerimaanBarangSuplierCtrl');
                if (chacePeriode != undefined) {
                    norecTerima = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    norecSPPB = chacePeriode[2]
                    dataIN = chacePeriode[3]

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
                    cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
                $scope.item.DataJabatan1 = undefined;
                $scope.item.DataPegawai1 = undefined;
                $scope.item.DataJabatan2 = undefined;
                $scope.item.DataPegawai2 = undefined;
                $scope.item.DataJabatan3 = undefined;
                $scope.item.DataPegawai3 = undefined;
                window.history.back();
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan3 != undefined) {
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawai3 != undefined) {
                    pegawai3 = $scope.item.DataPegawai3.id;
                }


                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing! NorecCetak
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + NorecCetak + '&pegawaiPenerima=' + pegawai2 + '&pegawaiPenyerahan=' + pegawai1 + '&pegawaiMengetahui=' + pegawai3
                    + '&jabatanPenerima=' + jabatan2 + '&jabatanPenyerahan=' + jabatan1 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + pegawaiUser.namalengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
                // window.history.back(); 
                $scope.saveShow = false;
            }

            function ComboLoad() {

                medifirstService.get('logistik/get-combo-logistik').then(function (dat) {
                    $scope.listDataJabatan = dat.data.jabatan;
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });
            }

            $scope.getProduk = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                })

            }

            $scope.Generate = function (data) {

                if (data === true) {
                    var AsalPro = ''
                    if ($scope.item.asalproduk != undefined) {
                        AsalPro = $scope.item.asalproduk.id
                    }
                    medifirstService.get("logistik/get-nomor-terima?asalproduk=" + AsalPro, true).then(function (dat) {
                        var datas = dat.data
                        if (datas.noStruk != "") {
                            $scope.item.noTerima = datas.noStruk
                        } else {
                            $scope.item.noTerima = ""
                        }

                        if (datas.noBuktiKK != "") {
                            $scope.item.noBuktiKK = datas.noBuktiKK
                        } else {
                            $scope.item.noBuktiKK = ""
                        }
                    })
                } else {
                    $scope.item.noTerima = '';
                    $scope.item.noBuktiKK = '';
                }
            };

            $scope.Generate1 = function (data) {

                if (data === true) {
                    var AsalPro = ''
                    if ($scope.item.asalproduk != undefined) {
                        AsalPro = $scope.item.asalproduk.id
                    }
                    medifirstService.get("logistik/get-nomor-terima?asalproduk=" + AsalPro, true).then(function (dat) {
                        var datas = dat.data
                        if (datas.noStruk != "") {
                            $scope.item.noTerima = datas.noStruk
                        } else {
                            $scope.item.noTerima = ""
                        }

                        if (datas.noBuktiKK != "") {
                            $scope.item.noBuktiKK = datas.noBuktiKK
                        } else {
                            $scope.item.noBuktiKK = ""
                        }
                    })
                } else {
                    $scope.item.noTerima = '';
                    $scope.item.noBuktiKK = '';
                }
            };

            function init() {
                $scope.isRouteLoading =true
                medifirstService.get('logistik/get-combo-logistik').then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listKelompokProduk = dataCombo.kelompokproduk;
                    $scope.item.kelompokproduk = { id: 11, kelompokproduk: 'Pelayanan Bank Darah' }
                    $scope.item.namaRekanan = { id: 581174, namarekanan: 'Palang Merah Indonesia (PMI)' }
                    $scope.item.asalproduk = { id: 8, asalProduk: 'PMI' }
                    $scope.listmataAnggaran = dataCombo.mataanggaran;
                    $scope.listKoordinator = dataCombo.jenisusulan;
                    $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' };
                    $scope.listRuangan = dataCombo.ruangan;
                    $scope.listRuanganKK = dataCombo.ruangan;
                    $scope.listPegawai = dataCombo.detaillogin;
                    // $scope.listRekanan = dataCombo.rekanan;    
                    pegawaiUser = dataCombo.detaillogin[0];
                    $scope.listAsalBarang = dataCombo.asalproduk;
                    // $scope.listProduk = dat.data.produk;                   
                    medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                        $scope.listProduk = dat.data.produk;
                    });
                    medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                        $scope.listPegawaiPembuat = data;
                        $scope.listpegawaiKK = data;
                    });
                    medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                        $scope.listRekanan = data;
                    });
                    $scope.item.ruanganPenerima = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.ruanganKK = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                    $scope.item.pegawaiPenerima = { id: $scope.listPegawai[0].id, namalengkap: $scope.listPegawai[0].namalengkap }
                    if (noOrder != '') {
                        $scope.isRouteLoading = true;
                        if (noOrder == 'EditTerima') {
                            $scope.disableSppb = true;
                            medifirstService.get("logistik/get-detail-penerimaan?norec=" + norecTerima, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                NoOrderFk = data_ih.data.detailterima.noorderfk
                                $scope.item.noTerima = data_ih.data.detailterima.nostruk
                                $scope.item.noUsulan = data_ih.data.detailterima.nousulan
                                $scope.item.noOrder = data_ih.data.detailterima.nosppb
                                $scope.item.noKontrak = data_ih.data.detailterima.nokontrak
                                $scope.item.tglTerima = moment(data_ih.data.detailterima.tglstruk).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglstruk
                                $scope.item.tglUsulan = data_ih.data.detailterima.tglrealisasi
                                $scope.item.tglAwal = data_ih.data.detailterima.tgldokumen
                                $scope.item.ketTerima = data_ih.data.detailterima.keteranganambil
                                $scope.item.namaPengadaan = data_ih.data.detailterima.namapengadaan
                                $scope.item.keterangan1 = data_ih.data.detailterima.keteranganlainnya
                                $scope.item.tahun = moment(data_ih.data.detailterima.tglstruk).format('YYYY');
                                $scope.item.kelompokproduk = { id: data_ih.data.pelayananPasien[0].kpid, kelompokproduk: data_ih.data.pelayananPasien[0].kelompokproduk }
                                $scope.item.asalproduk = { id: data_ih.data.pelayananPasien[0].asalprodukfk, asalProduk: data_ih.data.pelayananPasien[0].asalproduk }
                                $scope.item.ruanganPenerima = { id: data_ih.data.detailterima.id, namaruangan: data_ih.data.detailterima.namaruangan }
                                $scope.item.pegawaiPenerima = { id: data_ih.data.detailterima.pgid, namalengkap: data_ih.data.detailterima.namalengkap }
                                $scope.item.pegawaiPembuat = { id: data_ih.data.detailterima.objectpegawaipenanggungjawabfk, namalengkap: data_ih.data.detailterima.penanggungjawab }
                                $scope.item.tglFaktur = moment(data_ih.data.detailterima.tglfaktur).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglfaktur
                                $scope.item.noFaktur = data_ih.data.detailterima.nofaktur
                                $scope.item.namaRekanan = { id: data_ih.data.detailterima.objectrekananfk, namarekanan: data_ih.data.detailterima.namarekanan }
                                norec_Realisasi = data_ih.data.detailterima.norecrealisasi;
                                $scope.item.mataAnggaran = { norec: data_ih.data.detailterima.mataanggranid, mataanggaran: data_ih.data.detailterima.namamataanggaran }
                                $scope.item.TglJatuhTempo = moment(data_ih.data.detailterima.tgljatuhtempo).format('DD-MM-YYYY HH:mm');
                                kelTrans = 35
                                data2 = data_ih.data.pelayananPasien
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });
                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "120px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "50px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "ppn",
                                    "title": "Ppn",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Harga Discount",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                },
                                {
                                    "field": "nobatch",
                                    "title": "No Batch",
                                    "width": "50px",
                                },
                                {
                                    "field": "tglkadaluarsa",
                                    "title": "Tgl Kadaluarsa",
                                    "width": "100px",
                                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                                }
                            ];

                        }
                        if (noOrder == 'SPPB') {
                            $scope.disableSppb = true;
                            $scope.isUnitt = true;
                            loadSPPB = 'ya'
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "120px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlahterima",
                                    "title": "Sdh Terima",
                                    "width": "60px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "50px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "ppn",
                                    "title": "Ppn",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Harga Discount",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                },
                                {
                                    "field": "nobatch",
                                    "title": "No Batch",
                                    "width": "50px",
                                },
                                {
                                    "field": "tglkadaluarsa",
                                    "title": "Tgl Kadaluarsa",
                                    "width": "100px",
                                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                                }
                            ];
                            $scope.isRouteLoading = true;
                            medifirstService.get("logistik/get-detail-sppb?norecOrder=" + norecSPPB, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                sppb = data_ih.data.detail.norec;
                                $scope.item.noOrder = data_ih.data.detail.noorder
                                $scope.item.tglAwal = data_ih.data.detail.tglorder
                                $scope.item.keterangan1 = data_ih.data.detail.keterangan
                                $scope.listPegawaiPembuat = [{ id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }]
                                $scope.item.pegawaiPembuat = { id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }
                                $scope.item.koordinator = { id: data_ih.data.detail.jenisusulanfk, jenisusulan: data_ih.data.detail.koordinator } //{id:1,jenisusulan:'Medis'} 
                                $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                                $scope.item.noUsulan = data_ih.data.detail.nousulan
                                $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                                $scope.item.noKontrak = data_ih.data.detail.nokontrak
                                $scope.item.tahun = data_ih.data.detail.tahunusulan
                                kelTrans = 35;
                                noOrder = data_ih.data.detail.objectstrukfk;
                                if (data_ih.data.detail.norecrealisasi != undefined) {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasi;
                                } else {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasisppb;
                                }
                                // norec_Realisasi=data_ih.data.detail.norecrealisasi;
                                $scope.item.namaRekanan = { id: data_ih.data.detail.rekanansalesfk, namarekanan: data_ih.data.detail.namarekanansales }
                                if (data_ih.data.detail.mataanggranid != undefined) {
                                    $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.mataanggaran }
                                } else {
                                    $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranfk, mataanggaran: data_ih.data.detail.mataanggaransppb }
                                }

                                $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalProduk: data_ih.data.details[0].asalproduk }
                                data2 = data_ih.data.details
                                if (data2 != undefined) {
                                    $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalProduk: data_ih.data.details[0].asalproduk }
                                }
                                var subnyaTotal = 0;
                                var subTotal = 0;
                                var ppn = 0;
                                var discount = 0;
                                var totTpnn = 0;
                                var hargappn = 0;
                                var total = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    total = (parseFloat(data2[i].hargasatuan) * (data2[i].qtyprodukkonfirmasi))
                                    data2[i].total = total
                                }
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });
                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;
                                nilai = 1;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    if (data2[i].nilaikonversi == null) {
                                        data2[i].nilaikonversi = nilai;
                                    }
                                    ttlTotal = ttlTotal + parseFloat(data2[i].total)
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].qtyprodukkonfirmasi))
                                    ttlPpn = ttlPpn + ((parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].qtyprodukkonfirmasi)) * (parseFloat(data2[i].ppn) / 100))

                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                        if (noOrder == 'SPK') {
                            $scope.disableSppb = true;
                            $scope.isRouteLoading = true;
                            loadSPK = 'ya'
                            $scope.isUnitt = true;
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "120px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlahspk",
                                    "title": "Qty SPK",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlahterima",
                                    "title": "Sdh Terima",
                                    "width": "60px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "50px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "ppn",
                                    "title": "Ppn",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Harga Discount",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                },
                                {
                                    "field": "nobatch",
                                    "title": "No Batch",
                                    "width": "50px",
                                },
                                {
                                    "field": "tglkadaluarsa",
                                    "title": "Tgl Kadaluarsa",
                                    "width": "100px",
                                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                                }
                            ];
                            medifirstService.get("logistik/get-detail-spk?norecOrder=" + norecSPPB, true).then(function (data_ih) {
                                debugger;
                                $scope.isRouteLoading = false;
                                $scope.item.noOrder = data_ih.data.detail.nokontrak
                                $scope.item.tglAwal = data_ih.data.detail.tglorder
                                $scope.item.keterangan1 = data_ih.data.detail.keterangan
                                $scope.listPegawaiPembuat = [{ id: data_ih.data.detail.pegawaimengetahuiid, namalengkap: data_ih.data.detail.pegawaimengetahui }]
                                $scope.item.pegawaiPembuat = { id: data_ih.data.detail.penanggungjawabid, namalengkap: data_ih.data.detail.penanggungjawab }
                                // $scope.listKoordinator=[{id:1,namaKoordinator:'Medis'}]
                                // $scope.item.koordinator={id:1,namaKoordinator:'Medis'} 
                                $scope.item.noKontrak = data_ih.data.detail.kontrak
                                $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                                $scope.item.noUsulan = data_ih.data.detail.nousulan
                                // $scope.item.namaPengadaan=data_ih.data.detail.namapengadaan
                                $scope.item.namaPengadaan = data_ih.data.detail.keteranganlainnya
                                // $scope.item.noKontrak=data_ih.data.detail.nokontrak
                                $scope.item.tahun = data_ih.data.detail.tahunusulan
                                kelTrans = 35;
                                noOrder = data_ih.data.detail.objectstrukfk;
                                if (data_ih.data.detail.norecrealisasi != undefined) {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasi;
                                } else {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasikontrak;
                                }

                                if (data_ih.data.detail.mataanggranid != undefined) {
                                    $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.namamataanggaran }
                                } else {
                                    $scope.item.mataAnggaran = $scope.item.mataAnggaran = { norec: data_ih.data.detail.objectmataanggaranfk, mataanggaran: data_ih.data.detail.objectmataanggaranfk }
                                }

                                $scope.item.namaRekanan = { id: data_ih.data.detail.rekananid, namarekanan: data_ih.data.detail.namarekanan }
                                $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalProduk: data_ih.data.details[0].asalproduk }
                                $scope.item.tahun = moment($scope.now).format('YYYY');
                                data2 = data_ih.data.details
                                var subnyaTotal = 0;
                                var subTotal = 0;
                                var ppn = 0;
                                var discount = 0;
                                var totTpnn = 0;
                                var hargappn = 0;
                                var total = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    total = (parseFloat(data2[i].hargasatuan) * (data2[i].qtyprodukkonfirmasi))
                                    data2[i].total = total
                                }
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });
                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;
                                nilai = 1;
                                var qty = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    if (data2[i].nilaikonversi == null) {
                                        data2[i].nilaikonversi = nilai;
                                    }
                                    if (data2[i].qtyprodukkonfirmasi == undefined) {
                                        qty = data2[i].jumlah
                                    }else{
                                        qty = data2[i].qtyprodukkonfirmasi
                                    }
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan)*parseFloat(qty))//ttlTotal + parseFloat(data2[i].total)
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(qty))
                                    // ttlPpn = ttlPpn + ((parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].qtyprodukkonfirmasi)) * (parseFloat(data2[i].ppn) / 100))
                                    ttlPpn = ttlPpn + (parseFloat(qty)*parseFloat(data2[i].ppn));
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                        if (noOrder == 'SPPBDetail') {
                            $scope.disableSppb = true;
                            $scope.isUnitt = true;
                            loadSPPBDetail = 'ya'
                            $scope.columnGrid = [
                                {
                                    "field": "no",
                                    "title": "No",
                                    "width": "30px",
                                },
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "120px",
                                },
                                {
                                    "field": "satuanstandar",
                                    "title": "Satuan",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlahterima",
                                    "title": "Sdh Terima",
                                    "width": "60px",
                                },
                                {
                                    "field": "jumlah",
                                    "title": "Qty",
                                    "width": "50px",
                                },
                                {
                                    "field": "hargasatuan",
                                    "title": "Harga Satuan",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                                },
                                {
                                    "field": "ppn",
                                    "title": "Ppn",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                                },
                                {
                                    "field": "hargadiscount",
                                    "title": "Harga Discount",
                                    "width": "70px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                                },
                                {
                                    "field": "total",
                                    "title": "SubTotal",
                                    "width": "100px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                                },
                                {
                                    "field": "nobatch",
                                    "title": "No Batch",
                                    "width": "50px",
                                },
                                {
                                    "field": "tglkadaluarsa",
                                    "title": "Tgl Kadaluarsa",
                                    "width": "100px",
                                    "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                                }
                            ];
                            $scope.isRouteLoading = true;
                            medifirstService.get("logistik/get-detail-sppb-peritem?norecOrder=" + norecSPPB + "&produkfk=" + dataIN, true).then(function (data_ih) {
                                //
                                $scope.isRouteLoading = false;
                                sppb = data_ih.data.detail.norec;
                                $scope.item.noOrder = data_ih.data.detail.noorder
                                $scope.item.tglAwal = data_ih.data.detail.tglorder
                                $scope.item.keterangan1 = data_ih.data.detail.keterangan
                                $scope.listPegawaiPembuat = [{ id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }]
                                $scope.item.pegawaiPembuat = { id: data_ih.data.detail.petugasid, namalengkap: data_ih.data.detail.petugas }
                                $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                                $scope.item.noUsulan = data_ih.data.detail.nousulan
                                $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                                $scope.item.noKontrak = data_ih.data.detail.nokontrak
                                $scope.item.tahun = data_ih.data.detail.tahunusulan
                                kelTrans = 35;
                                noOrder = data_ih.data.detail.objectstrukfk;
                                if (data_ih.data.detail.norecrealisasi != undefined) {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasi;
                                } else {
                                    norec_Realisasi = data_ih.data.detail.norecrealisasisppb;
                                }
                                // norec_Realisasi=data_ih.data.detail.norecrealisasi;
                                $scope.item.namaRekanan = { id: data_ih.data.detail.rekanansalesfk, namarekanan: data_ih.data.detail.namarekanansales }
                                if (data_ih.data.detail.mataanggranid != undefined) {
                                    $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.mataanggaran }
                                } else {
                                    $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranfk, mataanggaran: data_ih.data.detail.mataanggaransppb }
                                }

                                $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalProduk: data_ih.data.details[0].asalproduk }
                                data2 = data_ih.data.details
                                if (data2 != undefined) {
                                    $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalProduk: data_ih.data.details[0].asalproduk }
                                }
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });
                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;
                                nilai = 1;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    if (data2[i].nilaikonversi == null) {
                                        data2[i].nilaikonversi = nilai;
                                    }
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].qtyprodukkonfirmasi))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].qtyprodukkonfirmasi))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].qtyprodukkonfirmasi))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                    } else {
                        $scope.columnGrid = [
                            {
                                "field": "no",
                                "title": "No",
                                "width": "30px",
                            },
                            {
                                "field": "namaproduk",
                                "title": "Nama Produk",
                                "width": "120px",
                            },
                            {
                                "field": "satuanstandar",
                                "title": "Satuan",
                                "width": "50px",
                            },
                            {
                                "field": "jumlah",
                                "title": "Qty",
                                "width": "50px",
                            },
                            {
                                "field": "hargasatuan",
                                "title": "Harga Satuan",
                                "width": "70px",
                                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                            },
                            {
                                "field": "ppn",
                                "title": "Ppn",
                                "width": "70px",
                                "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                            },
                            {
                                "field": "hargadiscount",
                                "title": "Harga Discount",
                                "width": "70px",
                                "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                            },
                            {
                                "field": "total",
                                "title": "SubTotal",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                            },
                            {
                                "field": "nobatch",
                                "title": "No Batch",
                                "width": "50px",
                            },
                            {
                                "field": "tglkadaluarsa",
                                "title": "Tgl Kadaluarsa",
                                "width": "100px",
                                "template": "<span class='style-center'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                            }
                        ];
                    }
                     $scope.isRouteLoading =false
                });

            }
            $scope.getChangeAP = function () {
                if ($scope.item.asalproduk.asalProduk == "Kas Kecil") {
                    $scope.kaskecilShow = true
                } else {
                    $scope.kaskecilShow = false
                }

            }
            $scope.getSatuan = function () {
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
                $scope.item.jumlah = 0;
                $scope.item.hargaSatuan = 0;
                // $scope.item.ppn = 0;
                $scope.item.ppnpersen = 0;
                $scope.item.hargaDiskon = 0;
                $scope.item.hargaDiskonPersen = 0;
                $scope.item.subTotaltxt = 0;

                // $scope.item.keterangan = '-';
                $scope.item.keterangan = $scope.item.produk.spesifikasi;
                $scope.item.nobatch = '-';
                $scope.item.tglkadaluarsa = new Date();
                // if ($scope.item.ruangan == undefined) {
                //     //alert("Pilih Ruangan terlebih dahulu!!")
                //     return;
                // }
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        $scope.item.jumlah = 0
                        $scope.item.hargaSatuan = dat.data.detail[0].harga
                    });
            }

            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        $scope.item.jumlah = 0
                        $scope.item.hargaSatuan = dat.data.detail[0].hargapenerimaan
                    });
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

            $scope.$watch('item.noTerima', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    medifirstService.get("logistik/get-nomor-struk?NoSPK=" + $scope.item.noTerima, true).then(function (data_ih) {
                        var datas = data_ih.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            if (datas[i].nostruk == $scope.item.noTerima && noOrder != 'EditTerima') {
                                alert("No Terima Tidak Boleh Sama!")
                                // $scope.item.noTerima = "";
                                break
                            }
                        }
                        // if (datas == $scope.item.hps) {

                        // }
                    })

                }
            });

            $scope.$watch('item.noFaktur', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    medifirstService.get("logistik/get-nomor-faktur?NoSPK=" + $scope.item.noFaktur, true).then(function (data_ih) {
                        var datas = data_ih.data;
                        for (var i = datas.length - 1; i >= 0; i--) {
                            if (datas[i].nofaktur == $scope.item.noFaktur && noOrder != 'EditTerima') {
                                alert("No Terima Tidak Boleh Sama!")
                                // $scope.item.noFaktur = "";
                                break
                            }
                        }
                        // if (datas == $scope.item.hps) {

                        // }
                    })

                }
            });

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotaltxt = qty*(hrgsatuan+ppn-hargadiskon)

                    qty = parseFloat($scope.item.jumlah)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    ppn = parseFloat($scope.item.ppn)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    subTtlSetelahDiskon = (qty * hrgsatuan) - hargadiskon
                    $scope.item.subTotaltxt = subTtlSetelahDiskon + ppn
                }
            });

            $scope.$watch('item.hargaSatuan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotaltxt = qty*(hrgsatuan+ppn-hargadiskon)
                    qty = parseFloat($scope.item.jumlah)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    ppn = parseFloat($scope.item.ppn)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    subTtlSetelahDiskon = (qty * hrgsatuan) - hargadiskon
                    $scope.item.subTotaltxt = subTtlSetelahDiskon + ppn
                }
            });

            $scope.$watch('item.ppn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    ppn = parseFloat($scope.item.ppn)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    subTtlSetelahDiskon = (qty * hrgsatuan) - hargadiskon
                    $scope.item.subTotaltxt = subTtlSetelahDiskon + ppn
                }
            });

            $scope.$watch('item.hargaDiskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)
                    hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    ppn = parseFloat($scope.item.ppn)
                    hargadiskon = parseFloat($scope.item.hargaDiskon)
                    subTtlSetelahDiskon = (qty * hrgsatuan) - hargadiskon
                    $scope.item.subTotaltxt = subTtlSetelahDiskon + ppn
                }
            });

            $scope.$watch('item.ppnpersen', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // $scope.item.ppn = (parseFloat($scope.item.ppnpersen)*parseFloat($scope.item.hargaSatuan))/100
                    var qtys = parseFloat($scope.item.jumlah)
                    var hrgsatuans = parseFloat($scope.item.hargaSatuan)

                    var hargadiskons = parseFloat($scope.item.hargaDiskon)
                    var subTtlSetelahDiskons = (qtys * hrgsatuans) - hargadiskons
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * parseFloat(subTtlSetelahDiskons)) / 100
                }
            });

            $scope.$watch('item.hargaDiskonPersen', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.hargaDiskon = (parseFloat($scope.item.hargaDiskonPersen) * (parseFloat($scope.item.hargaSatuan) * parseFloat($scope.item.jumlah))) / 100
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {

                // if ($scope.item.subTotaltxt == 0) {
                //     alert("SubTotal harus di isi!")
                //     return;
                // }
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
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
                if ($scope.item.asalproduk == undefined) {
                    alert("Pilih Sumber Dana Dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if (loadSPK == 'ya') {
                    if ($scope.item.no != undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            // if (parseFloat($scope.item.jumlah) > data2[i].jumlah) {
                            //         alert("Qty terima tidak boleh melebihi qty yang diajukan!!!")
                            //         return;
                            //     }
                            // var ppnu = 0;
                            // var ppnu = parseFloat(dataSelected.hargasatuan)/parseFloat(dataSelected.ppn)
                            if (data2[i].no == $scope.item.no) {

                                data.no = $scope.item.no
                                data.hargasatuan = String($scope.item.hargaSatuan)
                                data.ruanganfk = $scope.item.ruanganPenerima.id
                                data.asalprodukfk = $scope.item.asalproduk.id
                                data.asalproduk = $scope.item.asalproduk.asalProduk
                                data.produkfk = $scope.item.produk.id
                                data.namaproduk = $scope.item.produk.namaproduk
                                data.nilaikonversi = $scope.item.nilaiKonversi
                                data.satuanstandarfk = $scope.item.satuan.ssid
                                data.satuanstandar = $scope.item.satuan.satuanstandar
                                data.satuanviewfk = $scope.item.satuan.ssid
                                data.satuanview = $scope.item.satuan.satuanstandar
                                data.jumlahspk = data2[i].jumlahspk
                                data.jumlahterima = data2[i].jumlahterima
                                data.jumlah = $scope.item.jumlah
                                data.hargadiscount = String($scope.item.hargaDiskon)
                                data.persendiscount = String($scope.item.hargaDiskonPersen)
                                data.ppn = String($scope.item.ppn)
                                data.persenppn = String($scope.item.ppnpersen)
                                data.total = $scope.item.subTotaltxt
                                data.keterangan = $scope.item.keterangan
                                data.nobatch = $scope.item.nobatch
                                data.tglkadaluarsa = $scope.item.tglkadaluarsa

                                data2[i] = data;
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });

                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            }
                            // break;
                        }

                    } else {
                        data = {
                            no: nomor,
                            hargasatuan: String($scope.item.hargaSatuan),
                            ruanganfk: $scope.item.ruanganPenerima.id,
                            asalprodukfk: $scope.item.asalproduk.id,
                            asalproduk: $scope.item.asalproduk.asalProduk,
                            produkfk: $scope.item.produk.id,
                            namaproduk: $scope.item.produk.namaproduk,
                            nilaikonversi: $scope.item.nilaiKonversi,
                            satuanstandarfk: $scope.item.satuan.ssid,
                            satuanstandar: $scope.item.satuan.satuanstandar,
                            satuanviewfk: $scope.item.satuan.ssid,
                            satuanview: $scope.item.satuan.satuanstandar,
                            jumlahspk: 0,
                            jumlahterima: 0,
                            jumlah: $scope.item.jumlah,
                            hargadiscount: String($scope.item.hargaDiskon),
                            persendiscount: String($scope.item.hargaDiskonPersen),
                            ppn: String($scope.item.ppn),
                            persenppn: String($scope.item.ppnpersen),
                            total: $scope.item.subTotaltxt,
                            keterangan: $scope.item.keterangan,
                            nobatch: $scope.item.nobatch,
                            tglkadaluarsa: $scope.item.tglkadaluarsa
                        }
                        data2.push(data)
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });

                        ttlTotal = 0;
                        ttlDiskon = 0;
                        ttlPpn = 0;
                        grandTotal = 0;

                        for (var i = data2.length - 1; i >= 0; i--) {
                            ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                            ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                            ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                        }
                        $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        grandTotal = ttlTotal + ttlPpn - ttlDiskon
                        $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    }
                } else if (loadSPPB == 'ya') {
                    if ($scope.item.no != undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            // if (parseFloat($scope.item.jumlah) > data2[i].jumlah) {
                            //        alert("Qty terima tidak boleh melebihi qty yang diajukan!!!")
                            //        return;
                            //    }
                            if (data2[i].no == $scope.item.no) {
                                data.no = $scope.item.no
                                data.hargasatuan = String($scope.item.hargaSatuan)
                                data.ruanganfk = $scope.item.ruanganPenerima.id
                                data.asalprodukfk = $scope.item.asalproduk.id
                                data.asalproduk = $scope.item.asalproduk.asalProduk
                                data.produkfk = $scope.item.produk.id
                                data.namaproduk = $scope.item.produk.namaproduk
                                data.nilaikonversi = $scope.item.nilaiKonversi
                                data.satuanstandarfk = $scope.item.satuan.ssid
                                data.satuanstandar = $scope.item.satuan.satuanstandar
                                data.satuanviewfk = $scope.item.satuan.ssid
                                data.satuanview = $scope.item.satuan.satuanstandar
                                data.jumlahsppb = data2[i].jumlahsppb
                                data.jumlahterima = data2[i].jumlahterima
                                data.jumlah = $scope.item.jumlah
                                data.hargadiscount = String($scope.item.hargaDiskon)
                                data.persendiscount = String($scope.item.hargaDiskonPersen)
                                data.ppn = String($scope.item.ppn)
                                data.persenppn = String($scope.item.ppnpersen)
                                data.total = $scope.item.subTotaltxt
                                data.keterangan = $scope.item.keterangan
                                data.nobatch = $scope.item.nobatch
                                data.tglkadaluarsa = $scope.item.tglkadaluarsa

                                data2[i] = data;
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });

                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            }
                            // break;
                        }
                    } else {
                        data = {
                            no: nomor,
                            hargasatuan: String($scope.item.hargaSatuan),
                            ruanganfk: $scope.item.ruanganPenerima.id,
                            asalprodukfk: $scope.item.asalproduk.id,
                            asalproduk: $scope.item.asalproduk.asalProduk,
                            produkfk: $scope.item.produk.id,
                            namaproduk: $scope.item.produk.namaproduk,
                            nilaikonversi: $scope.item.nilaiKonversi,
                            satuanstandarfk: $scope.item.satuan.ssid,
                            satuanstandar: $scope.item.satuan.satuanstandar,
                            satuanviewfk: $scope.item.satuan.ssid,
                            satuanview: $scope.item.satuan.satuanstandar,
                            jumlahsppb: 0,
                            jumlahterima: 0,
                            jumlah: $scope.item.jumlah,
                            hargadiscount: String($scope.item.hargaDiskon),
                            persendiscount: String($scope.item.hargaDiskonPersen),
                            ppn: String($scope.item.ppn),
                            persenppn: String($scope.item.ppnpersen),
                            total: $scope.item.subTotaltxt,
                            keterangan: $scope.item.keterangan,
                            nobatch: $scope.item.nobatch,
                            tglkadaluarsa: $scope.item.tglkadaluarsa
                        }
                        data2.push(data)
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });

                        ttlTotal = 0;
                        ttlDiskon = 0;
                        ttlPpn = 0;
                        grandTotal = 0;

                        for (var i = data2.length - 1; i >= 0; i--) {
                            ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                            ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                            ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                        }
                        $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        grandTotal = ttlTotal + ttlPpn - ttlDiskon
                        $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    }
                } else if (loadSPPBDetail == 'ya') {
                    if ($scope.item.no != undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            // if (parseFloat($scope.item.jumlah) > data2[i].jumlah) {
                            //         alert("Qty terima tidak boleh melebihi qty yang diajukan!!!")
                            //         return;
                            //     }
                            if (data2[i].no == $scope.item.no) {
                                data.no = $scope.item.no
                                data.hargasatuan = String($scope.item.hargaSatuan)
                                data.ruanganfk = $scope.item.ruanganPenerima.id
                                data.asalprodukfk = $scope.item.asalproduk.id
                                data.asalproduk = $scope.item.asalproduk.asalProduk
                                data.produkfk = $scope.item.produk.id
                                data.namaproduk = $scope.item.produk.namaproduk
                                data.nilaikonversi = $scope.item.nilaiKonversi
                                data.satuanstandarfk = $scope.item.satuan.ssid
                                data.satuanstandar = $scope.item.satuan.satuanstandar
                                data.satuanviewfk = $scope.item.satuan.ssid
                                data.satuanview = $scope.item.satuan.satuanstandar
                                data.jumlahsppb = data2[i].jumlahsppb
                                data.jumlahterima = data2[i].jumlahterima
                                data.jumlah = $scope.item.jumlah
                                data.hargadiscount = String($scope.item.hargaDiskon)
                                data.persendiscount = String($scope.item.hargaDiskonPersen)
                                data.ppn = String($scope.item.ppn)
                                data.persenppn = String($scope.item.ppnpersen)
                                data.total = $scope.item.subTotaltxt
                                data.keterangan = $scope.item.keterangan
                                data.nobatch = $scope.item.nobatch
                                data.tglkadaluarsa = $scope.item.tglkadaluarsa

                                data2[i] = data;
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });

                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            }
                            // break;
                        }
                    } else {
                        data = {
                            no: nomor,
                            hargasatuan: String($scope.item.hargaSatuan),
                            ruanganfk: $scope.item.ruanganPenerima.id,
                            asalprodukfk: $scope.item.asalproduk.id,
                            asalproduk: $scope.item.asalproduk.asalProduk,
                            produkfk: $scope.item.produk.id,
                            namaproduk: $scope.item.produk.namaproduk,
                            nilaikonversi: $scope.item.nilaiKonversi,
                            satuanstandarfk: $scope.item.satuan.ssid,
                            satuanstandar: $scope.item.satuan.satuanstandar,
                            satuanviewfk: $scope.item.satuan.ssid,
                            satuanview: $scope.item.satuan.satuanstandar,
                            jumlahsppb: 0,
                            jumlahterima: 0,
                            jumlah: $scope.item.jumlah,
                            hargadiscount: String($scope.item.hargaDiskon),
                            persendiscount: String($scope.item.hargaDiskonPersen),
                            ppn: String($scope.item.ppn),
                            persenppn: String($scope.item.ppnpersen),
                            total: $scope.item.subTotaltxt,
                            keterangan: $scope.item.keterangan,
                            nobatch: $scope.item.nobatch,
                            tglkadaluarsa: $scope.item.tglkadaluarsa
                        }
                        data2.push(data)
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });

                        ttlTotal = 0;
                        ttlDiskon = 0;
                        ttlPpn = 0;
                        grandTotal = 0;

                        for (var i = data2.length - 1; i >= 0; i--) {
                            ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                            ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                            ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                        }
                        $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        grandTotal = ttlTotal + ttlPpn - ttlDiskon
                        $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    }
                } else {
                    if ($scope.item.no != undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].no == $scope.item.no) {
                                data.no = $scope.item.no
                                data.hargasatuan = String($scope.item.hargaSatuan)
                                data.ruanganfk = $scope.item.ruanganPenerima.id
                                data.asalprodukfk = $scope.item.asalproduk.id
                                data.asalproduk = $scope.item.asalproduk.asalProduk
                                data.produkfk = $scope.item.produk.id
                                data.namaproduk = $scope.item.produk.namaproduk
                                data.nilaikonversi = $scope.item.nilaiKonversi
                                data.satuanstandarfk = $scope.item.satuan.ssid
                                data.satuanstandar = $scope.item.satuan.satuanstandar
                                data.satuanviewfk = $scope.item.satuan.ssid
                                data.satuanview = $scope.item.satuan.satuanstandar
                                data.jumlah = $scope.item.jumlah
                                data.hargadiscount = String($scope.item.hargaDiskon)
                                data.persendiscount = String($scope.item.hargaDiskonPersen)
                                data.ppn = String($scope.item.ppn)
                                data.persenppn = String($scope.item.ppnpersen)
                                data.total = $scope.item.subTotaltxt
                                data.keterangan = $scope.item.keterangan
                                data.nobatch = $scope.item.nobatch
                                data.tglkadaluarsa = $scope.item.tglkadaluarsa

                                data2[i] = data;
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2,
                                    group: $scope.group,
                                    pageSize: 100,
                                    total: data2.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                        }
                                    }
                                });

                                ttlTotal = 0;
                                ttlDiskon = 0;
                                ttlPpn = 0;
                                grandTotal = 0;

                                for (var i = data2.length - 1; i >= 0; i--) {
                                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount))//* parseFloat(data2[i].jumlah))
                                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn))//* parseFloat(data2[i].jumlah))
                                }
                                $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                                $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                                grandTotal = ttlTotal + ttlPpn - ttlDiskon
                                $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            }
                            // break;
                        }

                    } else {
                        data = {
                            no: nomor,
                            hargasatuan: String($scope.item.hargaSatuan),
                            ruanganfk: $scope.item.ruanganPenerima.id,
                            asalprodukfk: $scope.item.asalproduk.id,
                            asalproduk: $scope.item.asalproduk.asalProduk,
                            produkfk: $scope.item.produk.id,
                            namaproduk: $scope.item.produk.namaproduk,
                            nilaikonversi: $scope.item.nilaiKonversi,
                            satuanstandarfk: $scope.item.satuan.ssid,
                            satuanstandar: $scope.item.satuan.satuanstandar,
                            satuanviewfk: $scope.item.satuan.ssid,
                            satuanview: $scope.item.satuan.satuanstandar,
                            jumlah: $scope.item.jumlah,
                            hargadiscount: String($scope.item.hargaDiskon),
                            persendiscount: String($scope.item.hargaDiskonPersen),
                            ppn: String($scope.item.ppn),
                            persenppn: String($scope.item.ppnpersen),
                            total: $scope.item.subTotaltxt,
                            keterangan: $scope.item.keterangan,
                            nobatch: $scope.item.nobatch,
                            tglkadaluarsa: $scope.item.tglkadaluarsa
                        }
                        data2.push(data)
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });

                        ttlTotal = 0;
                        ttlDiskon = 0;
                        ttlPpn = 0;
                        grandTotal = 0;

                        for (var i = data2.length - 1; i >= 0; i--) {
                            ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                            ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount))//* parseFloat(data2[i].jumlah))
                            ttlPpn = ttlPpn + (parseFloat(data2[i].ppn))//* parseFloat(data2[i].jumlah))
                        }
                        $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        grandTotal = ttlTotal + ttlPpn - ttlDiskon
                        $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    }
                }
                Kosongkan()
                racikan = ''
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,

                $scope.item.no = dataSelected.no
                // $scope.item.rke = dataSelected.rke
                // $scope.item.jenisKemasan = {id:dataSelected.jeniskemasanfk,jeniskemasan:dataSelected.jeniskemasan}
                // $scope.item.aturanPakai = {id:dataSelected.aturanpakaifk,name:dataSelected.aturanpakai}
                // $scope.item.route = {id:dataSelected.routefk,name:dataSelected.route}
                // if (dataSelected.asalprodukfk != 0) {
                //     $scope.item.asal = {id:dataSelected.asalprodukfk,asalproduk:dataSelected.asalproduk}    
                // }
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                $scope.listSatuan = [{ ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }]//dataProduk.konversisatuan
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 


                $scope.item.jumlah = dataSelected.jumlah
                $scope.item.hargaSatuan = dataSelected.hargasatuan
                var qtys = parseFloat(dataSelected.jumlah)
                var hrgsatuans = parseFloat(dataSelected.hargasatuan)
                var hargadiskons = parseFloat(dataSelected.hargadiscount)
                var subTtlSetelahDiskons = (qtys * hrgsatuans) - hargadiskons

                if (dataSelected.persenppn == 0 && dataSelected.ppn == "10") {
                    $scope.item.ppnpersen = dataSelected.ppn

                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * subTtlSetelahDiskons) / 100
                } else if (dataSelected.persenppn == "10") {

                    $scope.item.ppnpersen = dataSelected.persenppn
                    $scope.item.ppn = (parseFloat($scope.item.ppnpersen) * subTtlSetelahDiskons) / 100
                } else if (dataSelected.ppn != "10" && dataSelected.ppn != 0) {
                    var ppnu = 0;
                    var ppnu = (parseFloat(dataSelected.ppn) / subTtlSetelahDiskons) * 100
                    $scope.item.ppn = dataSelected.ppn
                    $scope.item.ppnpersen = ppnu;
                    //                 $scope.item.ppn = (parseFloat($scope.item.ppnpersen)*parseFloat(dataSelected.hargasatuan))/100
                } else {
                    // var ppnu = parseFloat(dataSelected.hargasatuan)/parseFloat(dataSelected.ppn)
                    $scope.item.ppnpersen = 0
                    $scope.item.ppn = 0
                }

                // $scope.item.ppn = dataSelected.ppn
                $scope.item.hargaDiskon = dataSelected.hargadiscount
                $scope.item.hargaDiskonPersen = dataSelected.persendiscount
                $scope.item.keterangan = dataSelected.keterangan
                $scope.item.nobatch = dataSelected.nobatch
                $scope.item.tglkadaluarsa = dataSelected.tglkadaluarsa
                // GETKONVERSI(dataSelected.jumlah)
                if (dataSelected.nilaikonversi == null) {
                    $scope.item.nilaiKonversi = 1;
                } else {
                    $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                }
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }


                // $scope.item.jumlah = dataSelected.jumlah
                // $scope.item.hargaSatuan = dataSelected.hargasatuan
                // $scope.item.hargadiskon = dataSelected.hargadiscount
                // $scope.item.total = dataSelected.total
            }
            function Kosongkan() {
                $scope.item.produk = ''
                // $scope.item.asal =''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.hargaSatuan = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.ppn = 0
                $scope.item.hargaDiskon = 0
                $scope.item.subTotaltxt = 0
            }
            $scope.batal = function () {
                Kosongkan()
                // $scope.popUp.center().open();
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                window.history.back();
                //$scope.popUp.center().open();
            }

            $scope.SavePenerimaan = function () {
                if($scope.isPenerimaanElogistic==true){
                    for (var i = 0; i < data2.length; i++) {
                        var elem =data2[i]
                        elem.ruanganfk = $scope.item.ruanganPenerima.id
                    }
                }
                $scope.saveShow = false;
                var rkk = null
                if ($scope.item.ruanganKK != undefined) {
                    rkk = $scope.item.ruanganKK.id
                }
                var tglkk = null
                if ($scope.item.tglKK != undefined) {
                    tglkk = $scope.item.tglKK
                }
                var pegkk = null
                if ($scope.item.pegawaiKK != undefined) {
                    pegkk = $scope.item.pegawaiKK.id
                }
                var nokontrak = "-"
                if ($scope.item.noKontrak != undefined) {
                    nokontrak = $scope.item.noKontrak
                }
                var kelTrans = ""
                if (kelTrans == '') {
                    kelTrans = 35;
                }
                var usulan = "-"
                if ($scope.item.noUsulan != undefined) {
                    usulan = $scope.item.noUsulan
                }

                var norecOrder = null;
                if (norecTerima == '' && norecSPPB == '') {
                    norecOrder = null;
                } else if (norecTerima == undefined && norecSPPB == undefined) {
                    norecOrder = null;
                } else if (norecSPPB != undefined && norecSPPB != "") {
                    norecOrder = norecSPPB;
                } else if (norecTerima != undefined && norecTerima != "") {
                    norecOrder = NoOrderFk;
                }

                var jenisusulan = null;
                var jenisusulanfk = null;
                if ($scope.item.koordinator != undefined) {
                    jenisusulan = $scope.item.koordinator.jenisusulan;
                    jenisusulanfk = $scope.item.koordinator.id;
                }

                var mataanggaran = '';
                if ($scope.item.mataAnggaran != undefined) {
                    mataanggaran = $scope.item.mataAnggaran.norec
                }
                var ketTerima = '';
                if ($scope.item.ketTerima != undefined) {
                    ketTerima = $scope.item.ketTerima
                }
                var namapengadaan = '-';
                if ($scope.item.namaPengadaan != undefined) {
                    namapengadaan = $scope.item.namaPengadaan
                }
                var pegawaiPembuat = 1;
                if ($scope.item.pegawaiPembuat != undefined) {
                    pegawaiPembuat = $scope.item.pegawaiPembuat.id
                }
                var noOrder = '-';
                if ($scope.item.noOrder != undefined) {
                    noOrder = $scope.item.noOrder
                }

                var struk = {
                    nostruk: norecTerima,
                    noorder: noOrder,
                    rekananfk: $scope.item.namaRekanan.id,
                    namarekanan: $scope.item.namaRekanan.namarekanan,
                    ruanganfk: $scope.item.ruanganPenerima.id,
                    nokontrak: nokontrak,
                    nofaktur: $scope.item.noFaktur,
                    tglfaktur:$scope.item.tglFaktur, //moment($scope.item.tglFaktur).format('YYYY-MM-DD HH:mm'),
                    tglstruk: $scope.item.tglTerima, //moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    tglorder: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm'),
                    tglrealisasi: $scope.item.tglTerima,//moment($scope.item.tglTerima).format('YYYY-MM-DD HH:mm'),
                    tglkontrak: moment($scope.item.tglUsulan).format('YYYY-MM-DD HH:mm'),
                    objectpegawaipenanggungjawabfk: pegawaiPembuat,
                    pegawaimenerimafk: $scope.item.pegawaiPenerima.id,
                    namapegawaipenerima: $scope.item.pegawaiPenerima.namalengkap,
                    qtyproduk: data2.length,
                    totalharusdibayar: grandTotal,
                    totalppn: ttlPpn,
                    totaldiscount: ttlDiskon,
                    totalhargasatuan: ttlTotal,
                    asalproduk: parseFloat($scope.item.asalproduk.id),
                    ruanganfkKK: rkk,
                    tglKK: tglkk,
                    pegawaifkKK: pegkk,
                    norecsppb: norecSPPB,
                    kelompoktranskasi: kelTrans,
                    norecrealisasi: norec_Realisasi,
                    nousulan: usulan,
                    // norec:norec,
                    objectmataanggaranfk: mataanggaran,
                    noterima: $scope.item.noTerima,
                    noBuktiKK: $scope.item.noBuktiKK,
                    ketterima: ketTerima,
                    jenisusulan: jenisusulan,
                    jenisusulanfk: jenisusulanfk,
                    namapengadaan: namapengadaan,
                    norecOrder: norecOrder,
                    tgljatuhtempo: $scope.item.TglJatuhTempo,//moment($scope.item.TglJatuhTempo).format('YYYY-MM-DD HH:mm'),
                }
                var objSave = {
                    struk: struk,
                    details: data2
                }

                medifirstService.post('logistik/save-data-penerimaan', objSave).then(function (e) {
                    NorecCetak = e.data.data.norec
                    var forSave = {
                        struk: struk,
                        norec: NorecCetak,
                        details: data2
                    }
                    if($scope.isPenerimaanElogistic){
                        objSave.struk.kdprofile = kdProfileELogistic//JSON.parse(localStorage.getItem('profile'))
                        medifirstService.postCustomHeader(urlKirimBarangElogistic+'verifikasi-penerimaan', objSave).then(function (e) {
                           $scope.isPenerimaanElogistic =false
                          
                        })
                    }

                 
                },function error(e){
                    $scope.isPenerimaanElogistic =true
                })
            }

            $scope.simpan = function () {
                if ($scope.item.noTerima == undefined) {
                    alert("No Terima Tidak Boleh Kosong!!")
                    return
                }
                if ($scope.item.asalproduk == undefined) {
                    alert("Pilih Asal Produk!!")
                    return
                }
                if ($scope.item.ruanganPenerima == undefined) {
                    alert("Pilih Ruangan Penerima!!")
                    return
                }
                if ($scope.item.pegawaiPenerima == undefined) {
                    alert("Pilih Pegawai Penerima!!")
                    return
                }
                if ($scope.item.tglFaktur == undefined) {
                    alert("Pilih Tanggal Faktur!!")
                    return
                }
                if ($scope.item.noFaktur == undefined) {
                    alert("No Faktur Kosong!!")
                    return
                }
                if ($scope.item.namaRekanan == undefined) {
                    alert("Pilih Nama Rekanan!!")
                    return
                }
                if ($scope.item.noTerima == undefined) {
                    alert("No Terima Kosong!!")
                    return
                }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                if ($scope.item.TglJatuhTempo == undefined || $scope.item.TglJatuhTempo == "") {
                    alert("Tgl Jatuh Tempo Tidak Boleh Kosong!!")
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Menyimpan Data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.SavePenerimaan();
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

            $scope.hapus = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                // if ($scope.item.jenisKemasan == undefined) {
                //     alert("Pilih Jenis Kemasan terlebih dahulu!!")
                //     return;
                // }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            data2.splice(i, 1);

                            // var subTotal = 0 ;
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            //     data2[i].no = i+1
                            // }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            // $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            var ttlTotal = 0;
                            var ttlDiskon = 0;
                            var ttlPpn = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                            }
                            $scope.item.total = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            var grandTotal = 0;
                            grandTotal = ttlTotal + ttlPpn - ttlDiskon
                            $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.loadELogistik = function(){
                  if($scope.item.noFaktur == undefined)return
                    $scope.isPenerimaanElogistic =false
                        data2=[]
                    // http://localhost:8200/service/e-logistik/get-detail-penerimaan?kdprofile=35&nofaktur=FT-20020000010
                  medifirstService.getCustomHeader(urlKirimBarangElogistic+'get-detail-penerimaan?kdprofile='+kdProfileELogistic+'&nofaktur='+$scope.item.noFaktur).then(function(data_ih){
                            // NoOrderFk = data_ih.data.detailterima.noorderfk
                            if(data_ih.data.length == 0){
                                toastr.error('Penerimaan Tidak ada')
                                return
                            }
                            $scope.item.noTerima = data_ih.data.detailterima.nostruk
                            $scope.item.noUsulan = data_ih.data.detailterima.nousulan
                            $scope.item.noOrder = data_ih.data.detailterima.nosppb
                            $scope.item.noKontrak = data_ih.data.detailterima.nokontrak
                            $scope.item.tglTerima = moment(data_ih.data.detailterima.tglstruk).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglstruk
                            $scope.item.tglUsulan = data_ih.data.detailterima.tglrealisasi
                            $scope.item.tglAwal = data_ih.data.detailterima.tgldokumen
                            $scope.item.ketTerima = data_ih.data.detailterima.keteranganambil
                            $scope.item.namaPengadaan = data_ih.data.detailterima.namapengadaan
                            $scope.item.keterangan1 = data_ih.data.detailterima.keteranganlainnya
                            $scope.item.tahun = moment(data_ih.data.detailterima.tglstruk).format('YYYY');
                            // $scope.item.kelompokproduk = { id: data_ih.data.pelayananPasien[0].kpid, kelompokproduk: data_ih.data.pelayananPasien[0].kelompokproduk }
                            // $scope.item.asalproduk = { id: data_ih.data.pelayananPasien[0].asalprodukfk, asalProduk: data_ih.data.pelayananPasien[0].asalproduk }
                            // $scope.item.ruanganPenerima = { id: data_ih.data.detailterima.id, namaruangan: data_ih.data.detailterima.namaruangan }
                            // $scope.item.pegawaiPenerima = { id: data_ih.data.detailterima.pgid, namalengkap: data_ih.data.detailterima.namalengkap }
                            // $scope.item.pegawaiPembuat = { id: data_ih.data.detailterima.objectpegawaipenanggungjawabfk, namalengkap: data_ih.data.detailterima.penanggungjawab }
                            $scope.item.tglFaktur = moment(data_ih.data.detailterima.tglfaktur).format('DD-MM-YYYY HH:mm');//data_ih.data.detailterima.tglfaktur
                            $scope.item.noFaktur = data_ih.data.detailterima.nofaktur
                            $scope.listRekanan.add({ id: data_ih.data.detailterima.idsuplier, namarekanan: data_ih.data.detailterima.namarekanan })
                            $scope.item.namaRekanan ={ id: data_ih.data.detailterima.idsuplier, namarekanan: data_ih.data.detailterima.namarekanan } 
                            // norec_Realisasi = data_ih.data.detailterima.norecrealisasi;
                            // $scope.item.mataAnggaran = { norec: data_ih.data.detailterima.mataanggranid, mataanggaran: data_ih.data.detailterima.namamataanggaran }
                            $scope.item.TglJatuhTempo = moment(data_ih.data.detailterima.tgljatuhtempo).format('DD-MM-YYYY HH:mm');
                            kelTrans = 35
                            data2 = data_ih.data.pelayananPasien
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                group: $scope.group,
                                pageSize: 100,
                                total: data2.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                    }
                                }
                            });
                            ttlTotal = 0;
                            ttlDiskon = 0;
                            ttlPpn = 0;
                            grandTotal = 0;

                            for (var i = data2.length - 1; i >= 0; i--) {
                                ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].jumlah))
                                ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].jumlah))
                                ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].jumlah))
                            }
                            $scope.item.total = parseFloat(ttlTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(ttlDiskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ttlPpn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                            grandTotal = ttlTotal + ttlPpn - ttlDiskon
                            $scope.item.grandTotal = parseFloat(grandTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.isPenerimaanElogistic =true
                    })
            }
            $scope.loadComboProduk = function () {
                medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                    $scope.listProduk = dat.data.produk;
                  
                });
            }

            $scope.KlikFakturOtomatis = function (data) {
                if (data === true) {
                    /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
                    var asalproduk = '';
                    if ($scope.item.asalproduk != undefined) {
                        asalproduk = $scope.item.asalproduk.asalProduk
                    }
                    var nows = moment(new Date()).format('MM-YY')
                    if (asalproduk.indexOf('Badan Layanan') > -1 || asalproduk == '')
                        $scope.item.noFaktur = 'PB/' + nows + '/APT/____'
                    else if (asalproduk.indexOf('Hibah') > -1)
                        $scope.item.noFaktur = 'PB/' + nows + '/BG/____'
                    else if (asalproduk.indexOf('Kas Kecil') > -1)
                        $scope.item.noFaktur = 'PB/' + nows + '/KK/____'

                } else {
                    delete $scope.item.noFaktur
                }
            };
            //***********************************
        }
    ]);
});
