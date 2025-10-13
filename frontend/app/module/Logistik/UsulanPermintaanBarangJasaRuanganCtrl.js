define(['initialize', 'Configuration'], function (initialize,configuration) {    
    'use strict';
    initialize.controller('UsulanPermintaanBarangJasaRuanganCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
    function ($scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.saveShow = true;
            $scope.item.tglDibutuhkan = new Date();
            $scope.item.tglUsulan = new Date();
            $scope.item.tglKebutuhan = new Date();
            // $scope.item.tglJatuhTempo = new Date();
            var baseTransaksi = configuration.baseApiBackend;
            var profile = JSON.parse(localStorage.getItem('profile'))
            $scope.isRouteLoading = false;
            var BulanRomawi = '';
            var norecRealisasi = '';
            var noOrder = '';
            var norecResep = '';
            var data2 = [];
            var TotTotal = 0;
            var Totdiskon = 0;
            var TotPpn = 0;
            var grandtotal = 0;
            var qty = 0
            var hrgsatuan = 0
            var ppn = 0
            var hargadiskon = 0;
            var subtotal = 0;
            var subTtlSetelahDiskon = 0;
            $scope.isEdit = false;
            $scope.isAdd = true;
            LoadCombo();      
    
            function LoadCombo(){
                $scope.isRouteLoading = true;
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listProduk = data;
                });
    
                medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                    $scope.listRekanan = data;
                });

                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawaiS = data
                })
                
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {                    
                    $scope.isRouteLoading = false;
                    var dataCombo = dat.data;
                    var dataPegawai = medifirstService.getPegawaiLogin();
                    $scope.listKoordinator = dataCombo.jenisusulan;
                    $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' };
                    $scope.listUnitPengusul = medifirstService.getMapLoginUserToRuangan();                    
                    $scope.listPegawai = [{id: dataPegawai.id, namalengkap: dataPegawai.namaLengkap}];
                    $scope.item.penanggungjawab = {id: dataPegawai.id, namalengkap: dataPegawai.namaLengkap};
                    $scope.item.ruanganPengusul = { id: $scope.listUnitPengusul[0].id, namaruangan: $scope.listUnitPengusul[0].namaruangan };
                    $scope.listUnitTujuan = dataCombo.ruanganall;
                    $scope.listAsalBarang = dataCombo.asalproduk;
                    $scope.listmataAnggaran = dataCombo.mataanggaran;
                    $scope.listKelompokProduk = dataCombo.kelompokproduk;
                    $scope.listKlmpokBarang = dataCombo.kelompokbarang;
                    $scope.listPegawaiMengetahui = dataCombo.pegawaiMengetahuiPO;
                    // $scope.listKlmpokBarang =
                    // [
                    //     { id: 1, kelompokbarang: 'Reagen' },
                    //     { id: 2, kelompokbarang: 'Obat' },
                    //     { id: 3, kelompokbarang: 'Alkes' },
                    //     { id: 4, kelompokbarang: 'Alat Medis' },
                    //     { id: 5, kelompokbarang: 'Barang Umum' },
                    //     { id: 6, kelompokbarang: 'Pekerjaan' },
                    // ]
                    BulanRomawi = dataCombo.bulanromawi;
                    
                    LoadCache();
                });                
            }
    
            // init();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('UsulanPermintaanBarangJasaRuanganCtrl');
                if (chacePeriode != undefined) {
                    norecResep = chacePeriode[0]
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
                    cacheHelper.set('UsulanPermintaanBarangJasaRuanganCtrl', chacePeriode);
                } else {
                    init()
                }
            }
            // $scope.Generate = function (data) {
            //     if (data === true) {
            //         /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
            //         var Usulan = '';
            //         if ($scope.item.KlmpokBarang != undefined) {
            //             Usulan = $scope.item.KlmpokBarang.kelompokbarang
            //         }
            //         var nows = moment(new Date()).format('YY')
            //         if (Usulan.indexOf('Reagen') > -1 || Usulan == '')
            //             $scope.item.noUsulan = '____/' + 'IF-01/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Obat') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-02/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Alkes') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-03/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Alat Medis') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-04/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Barang Umum') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-06/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Pekerjaan') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-07/' + BulanRomawi + '/' + nows
    
            //     } else {
            //         delete $scope.item.noUsulan
            //     }
            // };
    
            // $scope.newGenerate = function (data) {
            //     if (data === true) {
            //         /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
            //         var Usulan = '';
            //         if ($scope.item.KlmpokBarang != undefined) {
            //             Usulan = $scope.item.KlmpokBarang.kelompokbarang
            //         }
            //         var nows = moment(new Date()).format('YY')
            //         if (Usulan.indexOf('Reagen') > -1 || Usulan == '')
            //             $scope.item.noUsulan = '____/' + 'IF-01/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Obat') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-02/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Alkes') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-03/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Alat Medik') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-04/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Barang Umum') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-06/' + BulanRomawi + '/' + nows
            //         else if (Usulan.indexOf('Pekerjaan') > -1)
            //             $scope.item.noUsulan = '____/' + 'IF-07/' + BulanRomawi + '/' + nows
    
            //     } else {
            //         delete $scope.item.noUsulan
            //     }
            // };
    
    
            function init() {               
                if (noOrder != '') {
                    if (noOrder == 'EditTerima') {
                        medifirstService.get("logistik/get-data-detail-usulan?norecOrder=" + norecResep, true).then(function (data_ih) {
                            $scope.item.noOrder = data_ih.data.detail.noorder
                            $scope.item.tglAwal = data_ih.data.detail.tglorder
                            $scope.item.keterangan = data_ih.data.detail.keterangan
                            $scope.item.penanggungjawab = {
                                id: data_ih.data.detail.petugasid,
                                namalengkap: data_ih.data.detail.petugas
                            }
                            $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' }
                            $scope.item.tglUsulan = data_ih.data.detail.tglorder
                            $scope.item.noUsulan = data_ih.data.detail.nousulan
                            $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                            $scope.item.noKontrak = data_ih.data.detail.nokontrak
                            $scope.item.tahun = data_ih.data.detail.tahunusulan
                            $scope.item.alamatSupl = data_ih.data.detail.alamat
                            $scope.item.telpSupl = data_ih.data.detail.telp
                            $scope.item.suplier = { id: data_ih.data.detail.namarekananid, namarekanan: data_ih.data.detail.namarekanan }
                            $scope.item.keteranganUsulan = data_ih.data.detail.keterangan;
                            $scope.item.tglJatuhTempo =  data_ih.data.detail.tglrencana;
                            norecRealisasi = data_ih.data.detail.norecrealisasi;
                            $scope.item.ruanganPengusul = { id: data_ih.data.detail.idunitpengusul, namaruangan: data_ih.data.detail.unitpengusul }
                            $scope.item.ruanganTujuan = { id: data_ih.data.detail.idunittujuan, namaruangan: data_ih.data.detail.unittujuan }
                            // $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.mataanggaran };
                            // $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalproduk: data_ih.data.details[0].asalproduk };
                            $scope.item.kelompokproduk = { id : data_ih.data.detail.kelompokprodukfk, kelompokproduk: data_ih.data.detail.kelompokproduk }
                            $scope.item.namaRekanan = { id: data_ih.data.detail.objectrekananfk, namarekanan: data_ih.data.detail.namarekanansales }
                            // if(data_ih.data.detail.objectrekananfk){
                            //    $scope.listRekanan.add({id: data_ih.data.detail.objectrekananfk, namarekanan: data_ih.data.detail.namarekanansales}); 
                            //    $scope.item.namaRekanan = {id: data_ih.data.detail.objectrekananfk, namarekanan: data_ih.data.detail.namarekanansales}
                            // }
                            
                            
                            $scope.item.penanggungjawab = {
                                id: data_ih.data.detail.petugasid,
                                namalengkap: data_ih.data.detail.petugas
                            }
                            $scope.item.mengetahui = {
                                text: data_ih.data.detail.petugasmengetahui,
                                value: data_ih.data.detail.petugasmengetahuiid
                            }
                            // if (data_ih.data.detail != undefined) {
                            //     $scope.listPegawai.add({
                            //         alamat: data_ih.data.detail.alamat,
                            //         keterangan: data_ih.data.detail.keterangan,
                            //         koordinator: data_ih.data.detail.koordinator,
                            //         namapengadaan: data_ih.data.detail.namapengadaan,
                            //         namarekanan: data_ih.data.detail.namarekanan,
                            //         namarekananid: data_ih.data.detail.namarekananid,
                            //         nippns: data_ih.data.detail.nippns,
                            //         nokontrak: data_ih.data.detail.nokontrak,
                            //         noorder: data_ih.data.detail.noorder,
                            //         norec: data_ih.data.detail.norec,
                            //         nousulan: data_ih.data.detail.nousulan,
                            //         petugas: data_ih.data.detail.petugas,
                            //         petugasid: data_ih.data.detail.petugasid,
                            //         keterangan: data_ih.data.detail.keterangan,
                            //         petugasmengetahui: data_ih.data.detail.petugasmengetahui,
                            //         petugasmengetahuiid: data_ih.data.detail.petugasmengetahuiid,
                            //         tahunusulan: data_ih.data.detail.tahunusulan,
                            //         telp: data_ih.data.detail.telp,
                            //         tglorder: data_ih.data.detail.tglorder,
                            //         tglusulan: data_ih.data.detail.tglusulan,
                            //         totalhargasatuan: data_ih.data.detail.totalhargasatuan,
                            //         nipps: data_ih.data.detail.nipps
                            //     })
                            //     $scope.item.mengetahui = { id: data_ih.data.detail.petugasmengetahuiid, namalengkap: data_ih.data.detail.petugasmengetahui };
                            //     $scope.item.nip = data_ih.data.detail.nippns
                            // } else {
                            //     $scope.item.mengetahui = '';
                            // }
                            data2 = data_ih.data.details
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
    
                            var subTotal = 0;
                            var ppn = 0;
                            var diskon = 0;
                            var TotalAll = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
                                ppn = ppn + parseFloat(data2[i].ppn)
                                diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            TotalAll = subTotal - diskon + ppn;
                            $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(TotalAll))
                            TotTotal = parseFloat(subTotal)
                            Totdiskon = parseFloat(diskon)
                            TotPpn = parseFloat(ppn)
                            grandtotal= parseFloat(TotalAll)                        
                        });
                    } else if (noOrder == 'AjukanKembali') {
                        medifirstService.get("logistik/get-data-detail-usulan?norecOrder=" + norecResep, true).then(function (data_ih) {
                            $scope.item.tglAwal = data_ih.data.detail.tglorder
                            $scope.item.keterangan = data_ih.data.detail.keterangan
                            $scope.item.penanggungjawab = {
                                id: data_ih.data.detail.petugasid,
                                namalengkap: data_ih.data.detail.petugas
                            }
                            $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' }
                            $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                            $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                            $scope.item.noKontrak = data_ih.data.detail.nokontrak
                            $scope.item.tahun = data_ih.data.detail.tahunusulan
                            $scope.item.alamatSupl = data_ih.data.detail.alamat
                            $scope.item.telpSupl = data_ih.data.detail.telp
                            $scope.item.suplier = { id: data_ih.data.detail.namarekananid, namarekanan: data_ih.data.detail.namarekanan }
                            $scope.item.keteranganUsulan = data_ih.data.detail.keterangan;
                            $scope.item.ruanganPengusul = { id: data_ih.data.detail.idunitpengusul, namaruangan: data_ih.data.detail.unitpengusul }
                            $scope.item.ruanganTujuan = { id: data_ih.data.detail.idunittujuan, namaruangan: data_ih.data.detail.unittujuan }
                            $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.mataanggaran };
                            $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalproduk: data_ih.data.details[0].asalproduk }
                            if (data_ih.data.detail != undefined) {
                                $scope.listPegawai.add({
                                    alamat: data_ih.data.detail.alamat,
                                    keterangan: data_ih.data.detail.keterangan,
                                    koordinator: data_ih.data.detail.koordinator,
                                    namapengadaan: data_ih.data.detail.namapengadaan,
                                    namarekanan: data_ih.data.detail.namarekanan,
                                    namarekananid: data_ih.data.detail.namarekananid,
                                    nippns: data_ih.data.detail.nippns,
                                    nokontrak: data_ih.data.detail.nokontrak,
                                    noorder: data_ih.data.detail.noorder,
                                    norec: data_ih.data.detail.norec,
                                    nousulan: data_ih.data.detail.nousulan,
                                    petugas: data_ih.data.detail.petugas,
                                    petugasid: data_ih.data.detail.petugasid,
                                    keterangan: data_ih.data.detail.keterangan,
                                    petugasmengetahui: data_ih.data.detail.petugasmengetahui,
                                    petugasmengetahuiid: data_ih.data.detail.petugasmengetahuiid,
                                    tahunusulan: data_ih.data.detail.tahunusulan,
                                    telp: data_ih.data.detail.telp,
                                    tglorder: data_ih.data.detail.tglorder,
                                    tglusulan: data_ih.data.detail.tglusulan,
                                    totalhargasatuan: data_ih.data.detail.totalhargasatuan,
                                    nipps: data_ih.data.detail.nipps
                                })
                                $scope.item.mengetahui = { id: data_ih.data.detail.petugasmengetahuiid, namalengkap: data_ih.data.detail.petugasmengetahui };
                                $scope.item.nip = data_ih.data.detail.nippns
                            } else {
                                $scope.item.mengetahui = '';
                            }
    
    
                            data2 = data_ih.data.details
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
    
                            var subTotal = 0;
                            var ppn = 0;
                            var diskon = 0;
                            var TotalAll = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
                                ppn = ppn + parseFloat(data2[i].ppn)
                                diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            TotalAll = subTotal - diskon + ppn
                            $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(TotalAll))
                            TotTotal = parseFloat(subTotal)
                            Totdiskon = parseFloat(diskon)
                            TotPpn = parseFloat(ppn)
                            grandtotal= parseFloat(TotalAll)
                            norecResep = '';
                        });
                    } if (noOrder == 'UsulanDariRencana') {
                        medifirstService.get("logistik/get-data-detail-rencana-usulan?norecOrder=" + norecResep, true).then(function (data_ih) {
                            norecResep = '';
                            norecRealisasi = '';
                            $scope.item.noOrder = data_ih.data.detail.noorder
                            $scope.item.tglAwal = data_ih.data.detail.tglorder
                            $scope.item.keterangan = data_ih.data.detail.keterangan
                            $scope.item.penanggungjawab = {
                                id: data_ih.data.detail.petugasid,
                                namalengkap: data_ih.data.detail.petugas
                            }
                            $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' }
                            $scope.item.tglUsulan = data_ih.data.detail.tglusulan
                            $scope.item.noUsulan = data_ih.data.detail.nousulan
                            $scope.item.namaPengadaan = data_ih.data.detail.namapengadaan
                            $scope.item.noKontrak = data_ih.data.detail.nokontrak
                            $scope.item.tahun = data_ih.data.detail.tahunusulan
                            $scope.item.alamatSupl = data_ih.data.detail.alamat
                            $scope.item.telpSupl = data_ih.data.detail.telp
                            $scope.item.suplier = { id: data_ih.data.detail.namarekananid, namarekanan: data_ih.data.detail.namarekanan }
                            $scope.item.keteranganUsulan = data_ih.data.detail.keterangan;
                            //norecRealisasi=data_ih.data.detail.norecrealisasi;
                            $scope.item.ruanganPengusul = { id: data_ih.data.detail.idunitpengusul, namaruangan: data_ih.data.detail.unitpengusul }
                            $scope.item.ruanganTujuan = { id: data_ih.data.detail.idunittujuan, namaruangan: data_ih.data.detail.unittujuan }
                            $scope.item.mataAnggaran = { norec: data_ih.data.detail.mataanggranid, mataanggaran: data_ih.data.detail.mataanggaran };
                            $scope.item.asalproduk = { id: data_ih.data.details[0].asalprodukfk, asalproduk: data_ih.data.details[0].asalproduk }
                            for (const element of $scope.listKlmpokBarang) {
                                if (element.id == data_ih.data.detail.objectkelompokbarangfk) {
                                    $scope.item.KlmpokBarang = { id: element.id, kelompokbarang: element.kelompokbarang } 
                                }
                            }
    
                            if (data_ih.data.detail != undefined) {
                                // $scope.listPegawai.add({
                                //     alamat: data_ih.data.detail.alamat,
                                //     keterangan: data_ih.data.detail.keterangan,
                                //     koordinator: data_ih.data.detail.koordinator,
                                //     namapengadaan: data_ih.data.detail.namapengadaan,
                                //     namarekanan: data_ih.data.detail.namarekanan,
                                //     namarekananid: data_ih.data.detail.namarekananid,
                                //     nippns: data_ih.data.detail.nippns,
                                //     nokontrak: data_ih.data.detail.nokontrak,
                                //     noorder: data_ih.data.detail.noorder,
                                //     norec: data_ih.data.detail.norec,
                                //     nousulan: data_ih.data.detail.nousulan,
                                //     petugas: data_ih.data.detail.petugas,
                                //     petugasid: data_ih.data.detail.petugasid,
                                //     keterangan: data_ih.data.detail.keterangan,
                                //     petugasmengetahui: data_ih.data.detail.petugasmengetahui,
                                //     petugasmengetahuiid: data_ih.data.detail.petugasmengetahuiid,
                                //     tahunusulan: data_ih.data.detail.tahunusulan,
                                //     telp: data_ih.data.detail.telp,
                                //     tglorder: data_ih.data.detail.tglorder,
                                //     tglusulan: data_ih.data.detail.tglusulan,
                                //     totalhargasatuan: data_ih.data.detail.totalhargasatuan,
                                //     nipps: data_ih.data.detail.nipps
                                // })
                                $scope.listPegawai.push({ id: data_ih.data.detail.petugasmengetahuiid, namalengkap: data_ih.data.detail.petugasmengetahui })
                                $scope.item.mengetahui = { id: data_ih.data.detail.petugasmengetahuiid, namalengkap: data_ih.data.detail.petugasmengetahui };
                                $scope.item.nip = data_ih.data.detail.nippns
                                $scope.item.norecrencana = data_ih.data.detail.norec
                            } else {
                                $scope.item.mengetahui = '';
                            }
    
                            data2 = data_ih.data.details
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
    
                            var subTotal = 0;
                            var ppn = 0;
                            var diskon = 0;
                            var TotalAll = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
                                ppn = ppn + parseFloat(data2[i].ppn)
                                diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            TotalAll = subTotal - diskon + ppn
                            $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(TotalAll))
                            TotTotal = parseFloat(subTotal)
                            Totdiskon = parseFloat(diskon)
                            TotPpn = parseFloat(ppn)
                            grandtotal= parseFloat(TotalAll)
    
                        });
                    }
                }
            }
    
            $scope.getKodeUsulan = function () {
                $scope.item.noUsulan = $scope.item.ruanganPengusul.kodeUsulan
            }
            $scope.getNip_pns = function () {
                $scope.item.nip = $scope.item.mengetahui.nip_pns
            }
            $scope.saldoAnggaran = function () {
                $scope.item.saldoAnggaran = parseFloat($scope.item.mataAnggaran.saldoawalblu).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                $scope.item.saldoAnggaranRM = parseFloat($scope.item.mataAnggaran.saldoawalrm).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.getSatuan = function () {
                GETKONVERSI(0)
            }
            function GETKONVERSI(jml) {
                if (!$scope.item.produk || $scope.item.produk === "") {
                    return;
                }

                // Ambil konversi satuan, jika tidak ada isi dengan default satuan produk
                $scope.listSatuan = $scope.item.produk.konversisatuan || [];
                if ($scope.listSatuan.length === 0) {
                    $scope.listSatuan = [{
                        ssid: $scope.item.produk.ssid,
                        satuanstandar: $scope.item.produk.satuanstandar
                    }];
                }

                // Set satuan saat ini
                $scope.item.satuan = {
                    ssid: $scope.item.produk.ssid,
                    satuanstandar: $scope.item.produk.satuanstandar
                };

                // Jika belum pilih data sebelumnya, reset nilai ke default
                if (!$scope.dataSelected) {
                    $scope.item.ppnpersen = 0;
                    $scope.item.hargaDiskon = 0;
                    $scope.item.hargaDiskonPersen = 0;
                    $scope.item.ppn = 0;
                    $scope.item.subTotal = 0;
                    $scope.item.hargaSatuan = 0;
                    $scope.item.jumlah = 0;
                }

                $scope.item.nilaiKonversi = 1;
                $scope.item.spesifikasi = $scope.item.produk.spesifikasi || "-";

                // Ambil harga produk berdasarkan ruangan
                medifirstService.get("logistik/get-data-harga?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true)
                    .then(function (dat) {
                        var detail = dat.data.detail;

                        if (detail && detail.length > 0) {
                            var hargaDetail = detail[0];

                            if (jml !== 0) {
                                // Jika jumlah sudah diisi, pertahankan harga yang ada
                                // Tidak ubah harga
                            } else {
                                // Jika jumlah belum diisi, ambil dari API
                                $scope.item.hargaSatuan = parseFloat(hargaDetail.harga) || 0;
                                // $scope.item.hargaDiskonPersen = parseFloat(hargaDetail.persendiscount) || 0;
                                // $scope.item.ppnpersen = parseFloat(hargaDetail.persenppn) || 0;
                                $scope.item.hargaDiskonPersen = Math.round(parseFloat(hargaDetail.persendiscount) || 0);
                                // $scope.item.ppnpersen = Math.round(parseFloat(hargaDetail.persenppn) || 0);
                                $scope.item.ppnpersen = Math.round(parseFloat(hargaDetail.persenppn) || 0);
                            }
                        }
                    });
            }
            // function GETKONVERSI(jml) {
            //     if ($scope.item.produk == undefined) {
            //         return
            //     }
            //     if ($scope.item.produk == "") {
            //         return
            //     }
            //     $scope.listSatuan = $scope.item.produk.konversisatuan
            //     if ($scope.listSatuan.length == 0) {
            //         $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
            //     }
            //     $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
            //     if ($scope.dataSelected == undefined) {
            //         $scope.item.ppnpersen = 0;
            //         $scope.item.hargaDiskon = 0;
            //         $scope.item.hargaDiskonPersen = 0;
            //         $scope.item.ppn = 0;
            //         $scope.item.subTotal = 0;
            //         $scope.item.hargaSatuan = 0;
            //         $scope.item.jumlah = 0;
            //     }
            //     $scope.item.nilaiKonversi = 1          
            //     $scope.item.spesifikasi = $scope.item.produk.spesifikasi;
                
            //     medifirstService.get("logistik/get-data-harga?" +
            //         "produkfk=" + $scope.item.produk.id +
            //         "&ruanganfk=50", true).then(function (dat) {
            //             var dataProdukDetail = dat.data.detail;
            //             if (jml != 0) {
            //                 $scope.item.hargaSatuan = $scope.item.hargaSatuan
            //             } else {
            //                 $scope.item.hargaSatuan = dat.data.detail[0].harga
            //                 $scope.item.hargaDiskonPersen = dat.data.detail[0].persendiscount
            //                 $scope.item.ppnpersen = dat.data.detail[0].persenppn
            //             }
            //         });

            //     // medifirstService.get("logistik/get-data-harga-po?" +
            //     //     "produkfk=" + $scope.item.produk.id +
            //     //     "&ruanganfk=50", true).then(function (dat) {
            //     //         var dataProdukDetail = dat.data.detail;
            //     //         if (jml != 0) {
            //     //             $scope.item.hargaSatuan = $scope.item.hargaSatuan
            //     //             $scope.item.hargaDiskonPersen = dat.data.detail[0].persendiscount
            //     //             $scope.item.ppnpersen = dat.data.detail[0].persenppn
            //     //         } else {
            //     //             $scope.item.hargaSatuan = dat.data.detail[0].harga
            //     //             $scope.item.hargaDiskonPersen = dat.data.detail[0].persendiscount
            //     //             $scope.item.ppnpersen = dat.data.detail[0].persenppn
            //     //         }
            //     //     });
            // }
    
            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
                // medifirstService.get("logistik/get-data-harga?" +
                //     "produkfk=" + $scope.item.produk.id +
                //     "&ruanganfk=50", true).then(function (dat) {
                //         dataProdukDetail = dat.data.detail;
                //         if (jml != undefined) {
                //             $scope.item.hargaSatuan = 0
                //         } else {
                //             $scope.item.hargaSatuan = dat.data.detail[0].hargapenerimaan
                //         }
                //     });
                medifirstService.get("logistik/get-data-harga-po?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=50", true).then(function (dat) {
                        dataProdukDetail = dat.data.detail;
                        if (jml != undefined) {
                            $scope.item.hargaSatuan = 0
                        } else {
                            $scope.item.hargaSatuan       = dat.data.detail[0].hargapenerimaan;
                            $scope.item.hargaDiskonPersen = Math.round(dat.data.detail[0].persendiscount || 0);
                            $scope.item.ppnpersen         = Math.round(dat.data.detail[0].persenppn || 0);
                        }
                    });
            }
    
            // $scope.$watch('item.noUsulan', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
    
            //         medifirstService.get("logistik/get-nomor-usulan?NoSPK=" + $scope.item.noUsulan, true).then(function (data_ih) {
            //             var datas = data_ih.data;
            //             for (var i = datas.length - 1; i >= 0; i--) {
            //                 if (datas[i].noorder == $scope.item.noUsulan) {
            //                     alert("No Terima Tidak Boleh Sama!")
            //                     break
            //                 }
            //             }
            //         })
    
            //     }
            // });
    
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                // if (newValue != oldValue  ) {
                //     if ($scope.item.stok > 0) {
                //         $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                //         $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                //         $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                //         $scope.item.hargadiskon = 0 //hrgsdk * parseFloat(newValue)
                //         $scope.item.total = 0// parseFloat(newValue) * 
                //                // (hrg1-hrgsdk)
                //     }
                // }
            });
            $scope.hitung=function(){
                qty = parseFloat($scope.item.jumlah)                
                hrgsatuan = qty * parseFloat($scope.item.hargaSatuan);
                hargadiskon = 0;
                if ( parseFloat($scope.item.hargaDiskon) != 0 ||  parseFloat($scope.item.hargaDiskonPersen) != 0) {
                    $scope.item.hargaDiskon = (( parseFloat($scope.item.hargaSatuan) *  parseFloat($scope.item.hargaDiskonPersen))/ 100);
                    hargadiskon = qty * parseFloat($scope.item.hargaDiskon);
                }
                ppn = 0;
                if ( parseFloat($scope.item.ppn) != 0 ||  parseFloat($scope.item.ppnpersen) != 0) {                    
                    ppn = ((parseFloat(hrgsatuan) - parseFloat(hargadiskon))*parseFloat($scope.item.ppnpersen))/100; //* (parseFloat($scope.item.ppnpersen))/100);// * qty;
                    $scope.item.ppn = (((parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon)) * (parseFloat($scope.item.ppnpersen))/100))*qty;
                }                                     
                subtotal = hrgsatuan - hargadiskon  + ppn
                $scope.item.subTotal = subtotal;  
            }
            $scope.$watch('item.suplier', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.alamatSupl = $scope.item.suplier.alamatlengkap
                    $scope.item.telpSupl = 'Telp. ' + $scope.item.suplier.telepon + ' Fax. ' + $scope.item.suplier.faksimile
                }
            });
            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)                
                    hrgsatuan = qty * parseFloat($scope.item.hargaSatuan);
                    hargadiskon = 0;
                    if ( parseFloat($scope.item.hargaDiskon) != 0 ||  parseFloat($scope.item.hargaDiskonPersen) != 0) {
                        $scope.item.hargaDiskon = (( parseFloat($scope.item.hargaSatuan) *  parseFloat($scope.item.hargaDiskonPersen))/ 100);
                        hargadiskon = qty * parseFloat($scope.item.hargaDiskon);
                    }
                    ppn = 0;
                    if ( parseFloat($scope.item.ppn) != 0 ||  parseFloat($scope.item.ppnpersen) != 0) {                    
                        ppn = ((parseFloat(hrgsatuan) - parseFloat(hargadiskon))*parseFloat($scope.item.ppnpersen))/100; //* (parseFloat($scope.item.ppnpersen))/100);// * qty;
                        $scope.item.ppn = (((parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon)) * (parseFloat($scope.item.ppnpersen))/100))*qty;
                    }                                     
                    subtotal = hrgsatuan - hargadiskon  + ppn
                    $scope.item.subTotal = subtotal;            
                }
            });
            $scope.$watch('item.hargaSatuan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotal = qty * (hrgsatuan + ppn - hargadiskon)
                    hrgsatuan = qty * parseFloat($scope.item.hargaSatuan);
                    hargadiskon = 0;
                    if ( parseFloat($scope.item.hargaDiskon) != 0 ||  parseFloat($scope.item.hargaDiskonPersen) != 0) {
                        $scope.item.hargaDiskon = (( parseFloat($scope.item.hargaSatuan) *  parseFloat($scope.item.hargaDiskonPersen))/ 100);
                        hargadiskon = qty * parseFloat($scope.item.hargaDiskon);
                    }
                    ppn = 0;
                    if ( parseFloat($scope.item.ppn) != 0 ||  parseFloat($scope.item.ppnpersen) != 0) {                    
                        ppn = ((parseFloat(hrgsatuan) - parseFloat(hargadiskon))*parseFloat($scope.item.ppnpersen))/100;
                        $scope.item.ppn = ((parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon)) * (parseFloat($scope.item.ppnpersen))/100)*qty;
                    }                              
                    subtotal = hrgsatuan - hargadiskon  + ppn
                    $scope.item.subTotal = subtotal;
                }
            });
            $scope.$watch('item.hargaDiskonPersen', function (nv, ov) {
            if (nv !== ov) {
                var p = Math.round(parseFloat($scope.item.hargaDiskonPersen) || 0);
                $scope.item.hargaDiskonPersen = p; // set balik supaya tanpa desimal
                $scope.item.hargaDiskon = (p * parseFloat($scope.item.hargaSatuan || 0)) / 100;
            }
            });

            $scope.$watch('item.ppn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)                
                    // ppn = parseFloat($scope.item.ppn)
                    // if ($scope.item.ppnpersen != undefined && parseFloat($scope.item.ppnpersen) != 0 )  {
                    //     $scope.item.ppnpersen = $scope.item.ppnpersen;
                    // }else{
                    //     $scope.item.ppnpersen = hrgsatuan / ppn;
                    // }
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotal = qty * (hrgsatuan + ppn - hargadiskon)
                    hrgsatuan = qty * parseFloat($scope.item.hargaSatuan);
                    hargadiskon = 0;
                    if ( parseFloat($scope.item.hargaDiskon) != 0 ||  parseFloat($scope.item.hargaDiskonPersen) != 0) {
                        $scope.item.hargaDiskon = (( parseFloat($scope.item.hargaSatuan) *  parseFloat($scope.item.hargaDiskonPersen))/ 100);
                        hargadiskon = qty * parseFloat($scope.item.hargaDiskon);
                    }
                    ppn = 0;
                    if ( parseFloat($scope.item.ppn) != 0 ||  parseFloat($scope.item.ppnpersen) != 0) {                    
                        ppn = ((parseFloat(hrgsatuan) - parseFloat(hargadiskon))*parseFloat($scope.item.ppnpersen))/100;
                        $scope.item.ppn = ((parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon)) * (parseFloat($scope.item.ppnpersen))/100)*qty;
                    }                              
                    subtotal = hrgsatuan - hargadiskon  + ppn
                    $scope.item.subTotal = subtotal;
                }
            });
            $scope.$watch('item.ppnpersen', function (nv, ov) {
                if (nv !== ov) {
                    var p = Math.round(parseFloat($scope.item.ppnpersen) || 0);
                    $scope.item.ppnpersen = p; // set balik supaya tanpa desimal
                    $scope.item.ppn = (p * (parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon))) / 100;
                }
            });

            $scope.$watch('item.hargaDiskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    qty = parseFloat($scope.item.jumlah)
                    // hrgsatuan = parseFloat($scope.item.hargaSatuan)
                    // ppn = parseFloat($scope.item.ppn)
                    // hargadiskon = parseFloat($scope.item.hargaDiskon)
                    // $scope.item.subTotal = qty * (hrgsatuan + ppn - hargadiskon)
                    hrgsatuan = qty * parseFloat($scope.item.hargaSatuan);
                    hargadiskon = 0;
                    hargadiskon = 0;
                    if (parseFloat($scope.item.hargaDiskon) != 0 ||  parseFloat($scope.item.hargaDiskonPersen) != 0) {
                        $scope.item.hargaDiskon = ((parseFloat($scope.item.hargaSatuan) *  parseFloat($scope.item.hargaDiskonPersen))/ 100);
                        hargadiskon = qty * parseFloat($scope.item.hargaDiskon);
                    }
                    ppn = 0;
                    if ( parseFloat($scope.item.ppn) != 0 ||  parseFloat($scope.item.ppnpersen) != 0) {                    
                        ppn = ((parseFloat(hrgsatuan) - parseFloat(hargadiskon))*parseFloat($scope.item.ppnpersen))/100;
                        $scope.item.ppn = ((parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargaDiskon)) * (parseFloat($scope.item.ppnpersen))/100)*qty;
                    }                             
                    subtotal = hrgsatuan - hargadiskon  + ppn 
                    $scope.item.subTotal = subtotal;
                }
            });
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
    
            $scope.tambah = function () {
                // for (var i = data2.length - 1; i >= 0; i--) {
                //     if (data2[i].produkfk == $scope.item.produk.id) {
                //         alert("Produk Tidak Boleh Sama!!")
                //         return;
                //     }
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
                var spesifikasi = "-";
                if ($scope.item.spesifikasi != undefined) {
                    spesifikasi = $scope.item.spesifikasi;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var asalproduk = null;
                var asalprodukfk = null;
                if ($scope.item.asalproduk != undefined) {
                    asalproduk = $scope.item.asalproduk.asalproduk
                    asalprodukfk = $scope.item.asalproduk.id
                }
                cekProdukSama();
                if ($scope.isAdd == false) {
                    return
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.hargajual = null
                            data.jenisobatfk = null
                            data.stock = null
                            data.harganetto = null
                            data.nostrukterimafk = null
                            data.ruanganfk = null
                            data.kdproduk = $scope.item.produk.kdproduk
                            data.asalprodukfk = asalprodukfk
                            data.asalproduk = asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = null
                            data.jumlah = $scope.item.jumlah
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargaDiskon)
                            // data.persendiscount = String($scope.item.hargaDiskonPersen)
                            data.persendiscount = String(Math.round($scope.item.hargaDiskonPersen || 0));
                            data.ppn = String($scope.item.ppn)
                            // data.persenppn = String($scope.item.ppnpersen)
                            data.persenppn = String(Math.round($scope.item.ppnpersen || 0));
                            data.total = $scope.item.subTotal
                            data.tglkebutuhan = $scope.item.tglKebutuhan
                            data.kdproduk = $scope.item.produk.kdproduk
                            data.spesifikasi = spesifikasi
    
                            data2[i] = data;
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
    
                            var subTotal = 0;
                            var ppn = 0;
                            var diskon = 0;
                            var TotalAll = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
                                ppn = ppn + parseFloat(data2[i].ppn)
                                diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            TotalAll = subTotal - diskon + ppn
                            $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.terbilang = terbilang(parseFloat(TotalAll))
                            TotTotal = parseFloat(subTotal)
                            Totdiskon = parseFloat(diskon)
                            TotPpn = parseFloat(ppn)
                            grandtotal= parseFloat(TotalAll)
                        }
                        // break;
                    }
    
                } else {
                    data = {
                        no: nomor,
                        hargajual: null,
                        jenisobatfk: null,
                        stock: null,
                        harganetto: null,
                        nostrukterimafk: null,
                        ruanganfk: null,
                        asalprodukfk: asalprodukfk,
                        asalproduk: asalproduk,
                        kdproduk: $scope.item.produk.kdproduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: null,
                        jumlah: $scope.item.jumlah,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargaDiskon),
                        // persendiscount: String($scope.item.hargaDiskonPersen),
                        persendiscount: String(Math.round($scope.item.hargaDiskonPersen || 0)),
                        ppn: String($scope.item.ppn),
                        // persenppn: String($scope.item.ppnpersen),
                        persenppn: String(Math.round($scope.item.ppnpersen || 0)),
                        total: $scope.item.subTotal,
                        tglkebutuhan: $scope.item.tglKebutuhan,
                        kdproduk: $scope.item.produk.kdproduk,
                        spesifikasi: spesifikasi
                    }
    
                    data2.push(data)
    
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    var subTotal = 0;
                    var ppn = 0;
                    var diskon = 0;
                    var TotalAll = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
                        ppn = ppn + parseFloat(data2[i].ppn)
                        diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    TotalAll = subTotal - diskon + ppn
                    $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    $scope.item.terbilang = terbilang(parseFloat(TotalAll))
                    TotTotal = parseFloat(subTotal)
                    Totdiskon = parseFloat(diskon)
                    TotPpn = parseFloat(ppn)
                    grandtotal= parseFloat(TotalAll)
                }
                Kosongkan()
                // racikan = ''
            }

            // $scope.tambah = function () {
            //     // for (var i = data2.length - 1; i >= 0; i--) {
            //     //     if (data2[i].produkfk == $scope.item.produk.id) {
            //     //         alert("Produk Tidak Boleh Sama!!")
            //     //         return;
            //     //     }
            //     // }
            //     if ($scope.item.jumlah == 0) {
            //         alert("Jumlah harus di isi!")
            //         return;
            //     }
    
            //     if ($scope.item.produk == undefined) {
            //         alert("Pilih Produk terlebih dahulu!!")
            //         return;
            //     }
            //     if ($scope.item.satuan == undefined) {
            //         alert("Pilih Satuan terlebih dahulu!!")
            //         return;
            //     }
            //     var spesifikasi = "-";
            //     if ($scope.item.spesifikasi != undefined) {
            //         spesifikasi = $scope.item.spesifikasi;
            //     }
            //     var nomor = 0
            //     if ($scope.dataGrid == undefined) {
            //         nomor = 1
            //     } else {
            //         nomor = data2.length + 1
            //     }
            //     var asalproduk = null;
            //     var asalprodukfk = null;
            //     if ($scope.item.asalproduk != undefined) {
            //         asalproduk = $scope.item.asalproduk.asalproduk
            //         asalprodukfk = $scope.item.asalproduk.id
            //     }
            //     cekProdukSama();
            //     if ($scope.isAdd == false) {
            //         return
            //     }
            //     var data = {};
            //     if ($scope.item.no != undefined) {
            //         for (var i = data2.length - 1; i >= 0; i--) {
            //             if (data2[i].no == $scope.item.no) {
            //                 data.no = $scope.item.no
            //                 data.hargajual = null
            //                 data.jenisobatfk = null
            //                 data.stock = null
            //                 data.harganetto = null
            //                 data.nostrukterimafk = null
            //                 data.ruanganfk = null
            //                 data.kdproduk = $scope.item.produk.kdproduk
            //                 data.asalprodukfk = asalprodukfk
            //                 data.asalproduk = asalproduk
            //                 data.produkfk = $scope.item.produk.id
            //                 data.namaproduk = $scope.item.produk.namaproduk
            //                 data.nilaikonversi = $scope.item.nilaiKonversi
            //                 data.satuanstandarfk = $scope.item.satuan.ssid
            //                 data.satuanstandar = $scope.item.satuan.satuanstandar
            //                 data.satuanviewfk = $scope.item.satuan.ssid
            //                 data.satuanview = $scope.item.satuan.satuanstandar
            //                 data.jmlstok = null
            //                 data.jumlah = $scope.item.jumlah
            //                 data.hargasatuan = String($scope.item.hargaSatuan)
            //                 data.hargadiscount = String($scope.item.hargaDiskon)
            //                 data.persendiscount = String($scope.item.hargaDiskonPersen)
            //                 data.ppn = String($scope.item.ppn)
            //                 data.persenppn = String($scope.item.ppnpersen)
            //                 data.total = $scope.item.subTotal
            //                 data.tglkebutuhan = $scope.item.tglKebutuhan
            //                 data.kdproduk = $scope.item.produk.kdproduk
            //                 data.spesifikasi = spesifikasi
    
            //                 data2[i] = data;
            //                 $scope.dataGrid = new kendo.data.DataSource({
            //                     data: data2
            //                 });
    
            //                 var subTotal = 0;
            //                 var ppn = 0;
            //                 var diskon = 0;
            //                 var TotalAll = 0;
            //                 for (var i = data2.length - 1; i >= 0; i--) {
            //                     subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
            //                     ppn = ppn + parseFloat(data2[i].ppn)
            //                     diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
            //                 }
            //                 $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //                 $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //                 $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //                 TotalAll = subTotal - diskon + ppn
            //                 $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //                 $scope.item.terbilang = terbilang(parseFloat(TotalAll))
            //                 TotTotal = parseFloat(subTotal)
            //                 Totdiskon = parseFloat(diskon)
            //                 TotPpn = parseFloat(ppn)
            //                 grandtotal= parseFloat(TotalAll)
            //             }
            //             // break;
            //         }
    
            //     } else {
            //         data = {
            //             no: nomor,
            //             hargajual: null,
            //             jenisobatfk: null,
            //             stock: null,
            //             harganetto: null,
            //             nostrukterimafk: null,
            //             ruanganfk: null,
            //             asalprodukfk: asalprodukfk,
            //             asalproduk: asalproduk,
            //             kdproduk: $scope.item.produk.kdproduk,
            //             produkfk: $scope.item.produk.id,
            //             namaproduk: $scope.item.produk.namaproduk,
            //             nilaikonversi: $scope.item.nilaiKonversi,
            //             satuanstandarfk: $scope.item.satuan.ssid,
            //             satuanstandar: $scope.item.satuan.satuanstandar,
            //             satuanviewfk: $scope.item.satuan.ssid,
            //             satuanview: $scope.item.satuan.satuanstandar,
            //             jmlstok: null,
            //             jumlah: $scope.item.jumlah,
            //             hargasatuan: String($scope.item.hargaSatuan),
            //             hargadiscount: String($scope.item.hargaDiskon),
            //             persendiscount: String($scope.item.hargaDiskonPersen),
            //             ppn: String($scope.item.ppn),
            //             persenppn: String($scope.item.ppnpersen),
            //             total: $scope.item.subTotal,
            //             tglkebutuhan: $scope.item.tglKebutuhan,
            //             kdproduk: $scope.item.produk.kdproduk,
            //             spesifikasi: spesifikasi
            //         }
    
            //         data2.push(data)
    
            //         $scope.dataGrid = new kendo.data.DataSource({
            //             data: data2
            //         });
            //         var subTotal = 0;
            //         var ppn = 0;
            //         var diskon = 0;
            //         var TotalAll = 0;
            //         for (var i = data2.length - 1; i >= 0; i--) {
            //             subTotal = subTotal + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargasatuan))
            //             ppn = ppn + parseFloat(data2[i].ppn)
            //             diskon = diskon + (parseFloat(data2[i].jumlah) * parseFloat(data2[i].hargadiscount))
            //         }
            //         $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //         $scope.item.totalDiskon = parseFloat(diskon).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //         $scope.item.totalPpn = parseFloat(ppn).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //         TotalAll = subTotal - diskon + ppn
            //         $scope.item.totalIniLoh = parseFloat(TotalAll).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
            //         $scope.item.terbilang = terbilang(parseFloat(TotalAll))
            //         TotTotal = parseFloat(subTotal)
            //         Totdiskon = parseFloat(diskon)
            //         TotPpn = parseFloat(ppn)
            //         grandtotal= parseFloat(TotalAll)
            //     }
            //     Kosongkan()
            //     // racikan = ''
            // }
    
            $scope.klikGrid = function (dataSelected) {
                $scope.isEdit = true;
                $scope.dataSelected = dataSelected;
                $scope.item.no = dataSelected.no;

                medifirstService.get("logistik/get-combo-barang-logistik?namaproduk=" + dataSelected.namaproduk, true, true, 20)
                    .then(function (data) {
                        $scope.listProduk.add(data.data[0]);
                        $scope.item.produk = data.data[0];
                        $scope.item.jumlah = dataSelected.jumlah || 0;
                        $scope.item.nilaiKonversi = dataSelected.nilaikonversi || 1;

                        $scope.item.satuan = {
                            ssid: dataSelected.satuanstandarfk,
                            satuanstandar: dataSelected.satuanstandar
                        };

                        var qtys = parseFloat(dataSelected.jumlah) || 0;
                        var hargasatuan = parseFloat(dataSelected.hargasatuan) || 0;
                        var hargadiskon = parseFloat(dataSelected.hargadiscount) || 0;
                        var subtotal = hargasatuan * qtys - hargadiskon * qtys;

                        // Diskon %
                        if (hargadiskon > 0 && (dataSelected.persendiscount == null || parseFloat(dataSelected.persendiscount) === 0)) {
                        $scope.item.hargaDiskonPersen = (hargasatuan !== 0)
                            ? Math.round((hargadiskon / hargasatuan) * 100)
                            : 0;
                        } else if (!isNaN(parseFloat(dataSelected.persendiscount))) {
                        $scope.item.hargaDiskonPersen = Math.round(parseFloat(dataSelected.persendiscount));
                        } else {
                        $scope.item.hargaDiskonPersen = 0;
                        }
                        // Hitung PPN Persen (dibulatkan)
                        var ppn = parseFloat(dataSelected.ppn) || 0;
                        var subtotals = parseFloat(dataSelected.subtotals) || 0;

                        if ((dataSelected.persenppn == null || parseFloat(dataSelected.persenppn) === 0) && ppn !== 0) {
                        $scope.item.ppnpersen = Math.round((subtotals / ppn) * 100); // tetap pakai rasio yang kamu pakai sebelumnya, tapi dibulatkan
                        } else {
                        $scope.item.ppnpersen = Math.round(parseFloat(dataSelected.persenppn) || 0);
                        }
                        // Set field lain
                        $scope.item.hargaSatuan = hargasatuan;
                        $scope.item.hargaDiskon = hargadiskon;
                        $scope.item.ppn = ppn;
                        $scope.item.subTotal = parseFloat(dataSelected.total) || subtotal;
                        $scope.item.tglKebutuhan = dataSelected.tglkebutuhan || null;
                        $scope.item.spesifikasi = dataSelected.spesifikasi || '-';

                        GETKONVERSI(qtys);
                    });
            };
    
            function Kosongkan() {
                $scope.item.produk = ''
                $scope.item.spesifikasi = ''
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.ppn = 0
                $scope.item.hargaDiskon = 0
                $scope.item.ppnpersen = 0
                $scope.item.hargaDiskonPersen = 0
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
                    "field": "tglkebutuhan",
                    "title": "Tgl Kebutuhan",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglkebutuhan #')}}</span>"
                },
                {
                    "field": "produkfk",
                    "title": "Kode Barang",
                    "width": "100px",
                },
                // {
                //     "field": "kdproduk",
                //     "title": "Kode Barang Internal",
                //     "width": "100px",
                // },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "200px",
                },
                {
                    "field": "spesifikasi",
                    "title": "Spesifikasi",
                    "width": "150px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "70px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "ppn",
                    "title": "Harga Ppn",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: ppn #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Diskon",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "SubTotal",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                }
            ];
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }
    
            $scope.simpan = function () {
                // if ($scope.item.asalproduk == undefined) {
                //     alert("Pilih Asal Produk!!")
                //     return
                // }
                // if ($scope.item.noUsulan == undefined) {
                //     alert("No Usulan Tidak Boleh Kosong!!")
                //     return
                // }
                // if ($scope.item.koordinator == undefined) {
                //     alert("Pilih Koordinator!!")
                //     return
                // }
                if ($scope.item.penanggungjawab == undefined) {
                    alert("Pilih Pegawai penanggung jawab!!")
                    return
                }
                if ($scope.item.mengetahui == undefined) {
                    alert("Pilih Pegawai yang Mengetahui PO!!")
                    return
                }
                // if ($scope.item.mengetahui == undefined) {
                //     alert("Pilih Pegawai yang mengetahui!!")
                //     return
                // }
                if ($scope.item.ruanganTujuan == undefined) {
                    alert("Pilih ruangan tujuan!!")
                    return
                }
                if ($scope.item.ruanganPengusul == undefined) {
                    alert("Pilih Unit Pengusul!!")
                    return
                }
                // if ($scope.item.keteranganUsulan == undefined) {
                //     alert("Isi Jenis Usulan!!")
                //     return
                // }
                if ($scope.item.tglUsulan == undefined) {
                    alert("Pilih Tgl Usulan!!")
                    return
                }
                if ($scope.item.tglDibutuhkan == undefined) {
                    alert("Isi tgl Dibutuhkan!!")
                    return
                }
                if ($scope.item.tglJatuhTempo == undefined) {
                    alert("Isi tgl Jatuh Tempo!!")
                    return
                }
                // if ($scope.item.namaRekanan == undefined) {
                //     alert("Pilih Supplier!!")
                //     return
                // }
                var rekananId = null;
                var rekananNama = null;
                if ($scope.item.namaRekanan && typeof $scope.item.namaRekanan === 'object') {
                    rekananId   = $scope.item.namaRekanan.id || null;
                    rekananNama = $scope.item.namaRekanan.namarekanan || null;
                } else if ($scope.item.suplier && typeof $scope.item.suplier === 'object') {
                    rekananId   = $scope.item.suplier.id || null;
                    rekananNama = $scope.item.suplier.namarekanan || null;
                }
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
    
                var strAlamat = '';
                if ($scope.item.alamatSupl != undefined) {
                    strAlamat = $scope.item.alamatSupl
                }
                var qtyHari = 0;
                if ($scope.item.jmlHari != undefined) {
                    qtyHari = $scope.item.jmlHari
                }
                var mataanggaran = null;
                if ($scope.item.mataAnggaran && $scope.item.mataAnggaran.id != null) {
                    mataanggaran = $scope.item.mataAnggaran.id;  // kirim ID (number)
                }
                var asalproduk = null;
                if ($scope.item.asalproduk != undefined) {
                    asalproduk = parseFloat($scope.item.asalproduk.id)
                }
    
                var strukorder = {
                    noUsulan: $scope.item.noUsulan,
                    // keteranganorder: $scope.item.keteranganUsulan,
                    qtyjenisproduk: data2.length,
                    tglUsulan: moment($scope.item.tglUsulan).format('YYYY-MM-DD HH:mm:ss'),
                    tglDibutuhkan: moment($scope.item.tglDibutuhkan).format('YYYY-MM-DD HH:mm:ss'),
                    tgljatuhtempo: moment($scope.item.tglJatuhTempo).format('YYYY-MM-DD HH:mm:ss'),
                    koordinator: $scope.item.koordinator.jenisusulan,
                    // nousulan: $scope.item.noUsulan,
                    ruanganfkPengusul: $scope.item.ruanganPengusul.id,
                    ruanganfkTujuan: $scope.item.ruanganTujuan.id,
                    penanggungjawabfk: $scope.item.penanggungjawab.id,
                    mengetahuifk: $scope.item.mengetahui.value,
                    // objectrekananfk: $scope.item.namaRekanan.id,
                    // nipPns: $scope.item.nip,
                    // total: TotTotal,
                    norec: norecResep,
                    // ppn: TotPpn,
                    objectmataanggaranfk: mataanggaran,
                    norecrealisasi: norecRealisasi,
                    asalproduk: asalproduk,
                    kelompokbarangfk: $scope.item.kelompokproduk != undefined?$scope.item.kelompokproduk.id :null,
                    kelompokbarang: $scope.item.kelompokproduk != undefined?$scope.item.kelompokproduk.kelompokproduk :null,
                    totalharga: TotTotal,
                    totaldiskon: Totdiskon,
                    totalppn: TotPpn,
                    grandtotal: grandtotal,
                    // rekanan: $scope.item.namaRekanan != undefined?$scope.item.namaRekanan.id :null,
                    // rekanan: $scope.item.namaRekanan.id,
                    // namarekanan: $scope.item.namaRekanan.namarekanan,
                    objectrekananfk: $scope.item.namaRekanan != undefined?$scope.item.namaRekanan.id :null,
                    rekanan: rekananId,                 // pastikan key tetap ada meskipun null
                    namarekanan: rekananNama,           // pastikan key tetap ada meskipun null
                    keteranganorder: $scope.item.keterangan,
                    norecusulan: $scope.item.norecrencana != undefined ? $scope.item.norecrencana : null
                }
                var objSave = {
                    strukorder: strukorder,
                    rekananfk: rekananId,
                    details: data2
                }
    
                medifirstService.post('logistik/save-data-usulan-permintaan-barang-ruangan',objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim.norec
                    var stt = 'false'
                    if (confirm('View Cetak Usulan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    window.open(baseTransaksi + "report/cetak-bukti-usulan-barang?norec=" + $scope.item.noKirim + "&kdprofile=" + profile.id);                    
                    // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpermintaanbarang=1&norec=' + $scope.item.noKirim + '&view=true', function (response) {                        
                    // });
                    window.history.back();
                    $scope.saveShow = false;
                    Kosongkan();
                })
    
                // $state.go("TransaksiPelayananApotik")
    
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
    
                // racikan = ''
            }
            $scope.hapus = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
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
    
            function terbilang(bilangan) {
                bilangan = String(bilangan);
                var angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
                var kata = new Array('', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan');
                var tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun');
    
                var panjang_bilangan = bilangan.length;
    
                /* pengujian panjang bilangan */
                if (panjang_bilangan > 15) {
                    kaLimat = "Diluar Batas";
                    return kaLimat;
                }
    
                /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
                var i = 0
                var j = 0
    
                for (i = 1; i <= panjang_bilangan; i++) {
                    angka[i] = bilangan.substr(-(i), 1);
                }
    
                i = 1;
                j = 0;
                var kaLimat = "";
                var subkaLimat = "";
                kaLimat = "";
    
    
                /* mulai proses iterasi terhadap array angka */
                while (i <= panjang_bilangan) {
    
                    subkaLimat = "";
                    var kata1 = "";
                    var kata2 = "";
                    var kata3 = "";
    
                    /* untuk Ratusan */
                    if (angka[i + 2] != "0") {
                        if (angka[i + 2] == "1") {
                            kata1 = "Seratus";
                        } else {
                            kata1 = kata[angka[i + 2]] + " Ratus";
                        }
                    }
    
                    /* untuk Puluhan atau Belasan */
                    if (angka[i + 1] != "0") {
                        if (angka[i + 1] == "1") {
                            if (angka[i] == "0") {
                                kata2 = "Sepuluh";
                            } else if (angka[i] == "1") {
                                kata2 = "Sebelas";
                            } else {
                                kata2 = kata[angka[i]] + " Belas";
                            }
                        } else {
                            kata2 = kata[angka[i + 1]] + " Puluh";
                        }
                    }
    
                    /* untuk Satuan */
                    if (angka[i] != "0") {
                        if (angka[i + 1] != "1") {
                            kata3 = kata[angka[i]];
                        }
                    }
    
                    /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
                    if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
                        subkaLimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
                    }
    
                    /* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
                    kaLimat = subkaLimat + kaLimat;
                    i = i + 3;
                    j = j + 1;
    
                }
    
                /* mengganti Satu Ribu jadi Seribu jika diperlukan */
                if ((angka[5] == "0") && (angka[6] == "0")) {
                    kaLimat = kaLimat.replace("Satu Ribu", "Seribu");
                }
    
                return kaLimat + "Rupiah";
            }
    
            function cekProdukSama() {
                if ($scope.isEdit == false) {
                    if (data2.length > 0) {
                        for (let i = 0; i < data2.length; i++) {
                            const element = data2[i];
                            if ($scope.item.produk.id == element.produkfk) {
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
    
            //***********************************
            }
        ]);
    });
    