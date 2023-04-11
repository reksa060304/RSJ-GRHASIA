define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('InputResepApotikOrderV2Ctrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$mdDialog','DateHelper',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $mdDialog, dateHelper) {
            var norecAPD = $state.params.noRec;
            $scope.item = {};
            
            $scope.hideSimpan = false
            $scope.isRouteLoading = false
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.item.tglresep = $scope.now;
            $scope.item.tglresepAkhir = $scope.now;
            $scope.riwayatForm = false
            $scope.riwayatFormResep = false
            $scope.disabledRuangan = false;
            $scope.inputObatOrder = true
            $scope.item.nilaiKonversi = 0
            $scope.item.totalSubTotal = 0
            $scope.item.stok = 0
            $scope.item.hargaSatuan = 0
            $scope.item.total = 0
            $scope.showTombol = false
            $scope.norecOrder = ''
            $scope.showNonRacikan = false
            $scope.tglkadaluarsa = undefined;
            $scope.item.jumlah = null
            $scope.item.dosis = undefined;
            $scope.item.satuannya = undefined;
            $scope.stokproduk = 0
            var statusTambah = true
            var norec_apd = '';
            var norec_pd = '';
            var nocm_str = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            $scope.currentAturanPakai = []
            var hrg1 = 0
            var hrgsdk = 0
            var diffDays = 1
            var date1 = new Date($scope.item.tglresep);
            var date2 = new Date($scope.item.tglresepAkhir);
            diffDays = date2.getDate() - date1.getDate();
            diffDays = diffDays + 1
            $scope.kAngka = diffDays
            var detail = ''
            $scope.butPaket = false;
            $scope.item.aturanPakai = "";
            var dataPaket = [];
            $scope.item.noRuang = 0;
            $scope.copynoresep = ""
            $scope.rke = ''
            $scope.listJumlah =  [
                { "jml": 7 },
                { "jml": 14 },
                { "jml": 15 },
                { "jml": 30 },
                { "jml": 60 },
                { "jml": 90 },
                { "jml": 120 },
            ]
            LoadCacheHelper();
            function LoadCacheHelper() {
                
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1))//new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                });
                var chacePeriode = cacheHelper.get('InputResepApotikOrderV2Ctrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.item.ceklisNoRegis = chacePeriode[13]
                    $scope.item.departemen = chacePeriode[19]
                    $scope.item.jenispelayanan = chacePeriode[20]
                    $scope.item.dokterdpjp = chacePeriode[16]
                    $scope.item.iddpjp = chacePeriode[17]
                    $scope.item.kpid = chacePeriode[21]
                    $scope.item.noreservasi = chacePeriode[30]
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    //** */
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                }

                var cacheNoRuang = cacheHelper.get('noRuangInputResep');
                if (cacheNoRuang != undefined) {
                    $scope.item.noRuang = cacheNoRuang
                }
            }

            $scope.getCheckResepPulang = function(checkResepPulang){                
                if (checkResepPulang != undefined) {                             
                    $scope.checkResepPulang = checkResepPulang
                }
            }
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            init();
            function LoadCache() {
                //  var chacePeriode = cacheHelper.get('InputResepApotikOrderCtrl');
                //  if(chacePeriode != undefined){
                //     //var arrPeriode = chacePeriode.split(':');
                //     $scope.item.nocm = chacePeriode[0]
                //     $scope.item.namaPasien = chacePeriode[1]
                //     $scope.item.jenisKelamin = chacePeriode[2]
                //     $scope.item.noRegistrasi = chacePeriode[3]

                //     $scope.item.umur = chacePeriode[4]

                //     $scope.listKelas =([{id:chacePeriode[5],namakelas:chacePeriode[6]}]) 
                //     $scope.item.kelas ={id:chacePeriode[5],namakelas:chacePeriode[6]} 
                //     $scope.item.tglregistrasi = chacePeriode[7]
                //     norec_apd = chacePeriode[8]

                //     $scope.item.tglAwal =  new Date($scope.now);
                //     $scope.item.resep = '-';

                //     init()
                // }else{

                // }
            }
            function init() {
                // debugger;
                $scope.isRouteLoading = true;
                
                medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    // $scope.listPenulisResep = dat.data.penulisresep;
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listRuangan.splice(5);
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produk;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    // $scope.listProdukOrder = dat.data.produkorder;
                    $scope.listProdukOrder = dat.data.produkorderlebih;
                    $scope.listsatuanresep = dat.data.satuanresep;
                    $scope.listsatuanStandar = dat.data.satuanstandar;
                    // $scope.listRoute = dat.data.route;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    $scope.item.ruangan = {id:94, namaruangan:'FARMASI'};
                    
                    $scope.item.jenisKemasan = dat.data.jeniskemasan[1];

                    if($scope.item.penulisResep.jenispegawai.id != 1){
                        $scope.hideSimpan =true;
                    }
                });
              
                // medifirstService.get('emr/get-pegawai-parts?id=' + medifirstService.getPegawaiLogin().id).then(function (e) {
                //     $scope.listPenulisResep.add(e.data[0])
                //     $scope.item.penulisResep = e.data[0]// { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                // })
                // medifirstService.get("get-data-login", true).then(function (dat) {
                // var penulis = []
                // penulis.push({id:medifirstService.getPegawaiLogin().id,namalengkap:medifirstService.getPegawaiLogin().namaLengkap})
                // $scope.listPenulisResep = penulis
                // $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
                // });
                var $riwayat = ''
                if ($scope.item.ceklisNoRegis == true) {
                    loadRiwayat('noReg=' + $scope.item.noregistrasi)
                    loadOrder('noreg=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('nocm=' + $scope.item.noMr)
                    loadOrder('nocm=' + $scope.item.noMr)
                }

                medifirstService.get("farmasi/get-alergi?nocm=" + $scope.item.noMr, true).then(function(dat){
                    $scope.item.alergi = dat.data[0].data[0].alergi
                })
                
                // medifirstService.get("emr/get-daftar-detail-order?" + $riwayat).then(function (e) {
                //     for (var i = e.data.length - 1; i >= 0; i--) {
                //         e.data[i].no = i + 1                        
                //         if (e.data[i].reseppulang == 1) {
                //             e.data[i].cekreseppulang = "✔"                            
                //         }else{
                //             e.data[i].cekreseppulang = "-"
                //         }
                //     }
                //     $scope.dataGridRiwayat = new kendo.data.DataSource({
                //         data: e.data,
                //         pageSize: 10
                //     });


                // });
                medifirstService.get('emr/get-daftar-obat-sering-diresepkan').then(function (e) {
                    var array = e.data.data
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        element.no = i + 1
                    }

                    $scope.dataGridResepExist = new kendo.data.DataSource({
                        data: array,
                        pageSize: 10
                    });


                });
            }

            medifirstService.getPart('emr/get-pegawai-parts', true, 10).then(function (e) {
                $scope.listPenulisResep = e

                $scope.item.penulisResep = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap , jenispegawai: medifirstService.getPegawaiLogin().jenisPegawai};
                if ($scope.item.penulisResep.jenispegawai.id == 1){
                    $scope.showProdukOrder = true
                    $scope.showProduk = false
                }else{
                    $scope.item.penulisResep = {id: $scope.item.iddpjp, namalengkap: $scope.item.dokterdpjp};
                    $scope.showProdukOrder = false
                    $scope.showProduk = true
                }
            })
           
            $scope.getSatuan = function () {
                if($scope.item.produk.id == undefined)return

                if($scope.item.alergi != undefined){
                    let kodeArr = $scope.item.alergi.split(",");

                    for(var i = 0; i < kodeArr.length; i++){
                        if ($scope.item.produk.namaproduk.toLowerCase().match(kodeArr[i].toLowerCase().replace(' ', '')) && $scope.item.alergi.length > 2) {
                            toastr.error('Pasien Alergi Terhadap Obat Tersebut', 'Peringatan')
                            return
                        }
                    }
                }
                for (let i = 0; i < $scope.listJenisRacikan.length; i++) {
                    if ($scope.item.produk.ssid == $scope.listJenisRacikan[i].objectsatuanstandarfk) {
                        $scope.item.jenisRacikan = $scope.listJenisRacikan[i]
                    }
                }
                medifirstService.get("emr/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        $scope.stokproduk = e.data.infostok[0].qtyproduk
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
                GETKONVERSI()
            }
            function GETKONVERSI() {
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                //$scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     //alert("Pilih asal terlebih dahulu!!")
                //     return;
                // }
                statusTambah = false
                $scope.isRouteLoading = false;
                dataProdukDetail = []
                medifirstService.get("emr/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    // "&ruanganfk=" + $scope.item.ruangan.id + 
                    "&kpid=" + $scope.item.kpid, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        if (dat.data.kekuatan == 0) {
                            dat.data.kekuatan = 1
                        } else{
                            dat.data.kekuatan = dat.data.kekuatan
                        }
                        if ($scope.item.jenisKemasan.id == 2 && $scope.dataSelected == undefined) {
                            $scope.item.dosis = dat.data.kekuatan
                        }
                        $scope.item.kekuatan = dat.data.kekuatan
                        $scope.item.sediaan = dat.data.sediaan
                        if(dataProdukDetail.length >0)
                            $scope.tglkadaluarsa = moment(dataProdukDetail[0].tglkadaluarsa).format('YYYY-MM-DD HH:mm');
                            $scope.item.satuannya = dataProdukDetail[0].satuan
                            // $scope.item.dosis =$scope.dataSelected.dosis
                        // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)
                        if ($scope.dataSelected != undefined ){      
                            $scope.item.satuannya = $scope.dataSelected.satuandosis
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                            // $scope.item.satuan = {ssid:$scope.dataSelected.satuanstandarfk,satuanstandar:$scope.dataSelected.satuanstandar}
                            // $scope.item.stok = $scope.dataSelected.jmlstok //* $scope.item.nilaiKonversi 
                            $scope.item.jumlah = $scope.dataSelected.jumlah
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.dosis =$scope.dataSelected.dosis

                            // $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.total = $scope.dataSelected.total
                            if($scope.item.kekuatan != undefined && $scope.item.kekuatan != 0) {
                                $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                            }
                            // $scope.addListAturanPakai()
                        }
                        statusTambah = true
                        gettotal();
                    });
            }
            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        // $scope.item.hargadiskon =0//hrgsdk * parseFloat(newValue)
                        $scope.item.total = 0// parseFloat(newValue) * 
                        // (hrg1-hrgsdk)
                    // }
                }
            });
            $scope.$watch('item.rke', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.rke != $scope.item.rke){
                        $scope.item.jumlahxmakan = null
                    }
                }
            });
            $scope.$watch('item.hari', function (newValue, oldValue) {
                if (newValue != oldValue) {
                        $scope.item.jumlah = parseInt($scope.item.hari) * parseFloat($scope.item.dosisperhari)*parseInt($scope.item.aturanpakaitxt.slice(0, -2))
                    
                }
            });
            $scope.$watch('item.dosisperhari', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.hari != undefined){
                        $scope.item.jumlah = parseInt($scope.item.hari) * parseFloat($scope.item.dosisperhari)*parseInt($scope.item.aturanpakaitxt.slice(0, -2))
                    }
                }
            });
            $scope.$watch('item.aturanpakaitxt', function (newValue, oldValue) {
                if (newValue != oldValue) {
                            if($scope.item.jenisKemasan.jeniskemasan == 'Non Racikan'){
                                if($scope.item.hari != undefined){
                                    $scope.item.jumlah = parseInt($scope.item.hari) * parseFloat($scope.item.dosisperhari)*parseInt($scope.item.aturanpakaitxt.slice(0, -2))
                                } 
                            } 

                }
                let kodeArr = $scope.item.aturanpakaitxt.split("x");
                let kodeket = $scope.item.KeteranganPakai.split("-");
                if ($scope.item.chkp == 1) {
                    kodeket[0] = kodeArr[1]
                }
                if ($scope.item.chks == 1) {
                    kodeket[1] = kodeArr[1]

                }
                if ($scope.item.chksr == 1) {
                    // $scope.item.chksr = kodeArr[1]
                    kodeket[2] = kodeArr[1]

                }
                if ($scope.item.chkm == 1) {
                    kodeket[3] = kodeArr[1]
                }

                // $scope.item.aturanpakaitxt = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1' 
                // if (jml == 0) {
                //     $scope.item.aturanpakaitxt = ''
                // }
                $scope.item.KeteranganPakai = kodeket.join('-')
                // $scope.item.KeteranganPakai = $scope.item.chkp + "-" + $scope.item.chks + "-" + $scope.item.chkm
            });
            $scope.$watch('item.tglresep', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var date1 = new Date($scope.item.tglresep);
                    var date2 = new Date($scope.item.tglresepAkhir);
                    var Difference_In_Time = date2.getTime() - date1.getTime();
                    diffDays = date2.getDate() - date1.getDate();
                    // diffDays = diffDays + 1
                    // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    // $scope.kAngka = Difference_In_Days//diffDays

                    // perubahan helmi
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    $scope.kAngka = Difference_In_Days + 1//diffDays
                    diffDays = Difference_In_Days + 1
                }
            });
            $scope.$watch('item.tglresepAkhir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var date1 = new Date($scope.item.tglresep);
                    var date2 = new Date($scope.item.tglresepAkhir);
                    var Difference_In_Time = date2.getTime() - date1.getTime();
                    diffDays = date2.getDate() - date1.getDate();
                    // diffDays = diffDays + 1
                    // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    // $scope.kAngka = Difference_In_Days//diffDays

                    // perubahan helmi
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    $scope.kAngka = Difference_In_Days + 1//diffDays
                    diffDays = Difference_In_Days + 1
                }
            });
            $scope.$watch('item.jumlahxmakan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                    // }
                }
            });
            $scope.$watch('item.dosis', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                       // $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                    // }
                }
            });
            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Racikan') {
                        $scope.showRacikanDose = true
                    } else {
                        $scope.showRacikanDose = false
                    }
                }
            });
            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Non Racikan') {
                        $scope.showNonRacikan = true
                    } else {
                        $scope.showNonRacikan = false
                    }
                }
            });

            
            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.jmlCheckbox == newValue){
                        $scope.item.jmlCheckbox = newValue
                    }else{
                       $scope.item.jmlCheckbox  = null 
                    }
                    gettotal()
                }
            });
             $scope.$watch('item.jmlCheckbox', function (newValue, oldValue) {
                if (newValue != oldValue) {
                     $scope.item.jumlah = parseFloat(newValue)
                }
            });
            

            function gettotal() {
                // if ($scope.item.stok == 0) {
                //     $scope.item.jumlah = 1
                

                //     return;
                // }
                // var tarifJasa = 0
                // var qty20 = 0
                // if ($scope.item.jenisKemasan.id == 2) {
                //     tarifJasa = 800
                // }
                // if ($scope.item.jenisKemasan.id == 1) {
                //     qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
                //     if (parseFloat($scope.item.jumlah) % 20 == 0) {
                //         qty20 = qty20 
                //     }else{
                //         qty20 = qty20 + 1
                //     }

                //     tarifJasa = 800 * qty20
                // }

                var ada = false;
                for (var i = 0; i < dataProdukDetail.length; i++) {
                    ada = false
                    if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) >0){// <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                        hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
                        $scope.item.hargaSatuan = parseFloat(hrg1)
                        $scope.item.total = parseFloat((parseFloat($scope.item.jumlah) * (hrg1)))//+tarifJasa
                        noTerima = dataProdukDetail[i].norec
                        ada = true;
                        break;
                    }
                }
                if (ada == false) {
                    $scope.item.hargaSatuan = 0
                    $scope.item.total = 0

                    noTerima = ''
                }
                if ($scope.item.jumlah == 0) {
                    $scope.item.hargaSatuan = 0
                }
                // if ($scope.item.stok > 0) {
                //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                // }
            }
            $scope.hapus1 = function () {
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
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
                            // $scope.item.totalSubTotal=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            $scope.item.totalSubTotal = subTotal
                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if($scope.item.alergi != undefined){
                    let kodeArr = $scope.item.alergi.split(",");

                    for(var i = 0; i < kodeArr.length; i++){
                        if ($scope.item.produk.namaproduk.toLowerCase().match(kodeArr[i].toLowerCase().replace(' ', '')) && $scope.item.alergi.length > 2) {
                            toastr.error('Pasien Alergi Terhadap Obat Tersebut', 'Peringatan')
                            return
                        }
                    }
                }

                if($scope.item.alergi != undefined){
                    if ($scope.item.produk.namaproduk.toLowerCase().match($scope.item.alergi.toLowerCase()) && $scope.item.alergi.length > 2) {
                        toastr.error('Pasien Alergi Terhadap Obat Tersebut', 'Peringatan')
                        return
                    }
                }

                if(statusTambah == false){
                    return
                }
                if ($scope.dataGridRiwayat != undefined && $scope.norecOrder == '' && $scope.item.ruangan.id == 94) {
                    if ($scope.dataGridRiwayat._data.length > 0) {
                        var orderanDepoRajal = []
                        for (let i = 0; i < $scope.dataGridRiwayat._data.length; i++) {
                            const element = $scope.dataGridRiwayat._data[i];
                            if (element.namaruangan == 'DEPO RAJAL') {
                                orderanDepoRajal.push(element)
                            }
                        }
                        if (orderanDepoRajal.length > 0) {
                            toastr.error('Hanya Bisa Order Satu Kali !', 'Peringatan')
                            return
                        }
                    }
                }
                if ($scope.isSelesaiPeriksa == true) {
                    toastr.error("Data Sudah Diclosing!");
                    return;
                }
                // if ($scope.item.statusVerif == true) {
                //     toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //     return;
                // }
                if ($scope.item.jumlah == NaN || $scope.item.jumlah == undefined || $scope.item.jumlah == '') {
                    alert("Jumlah harus di isi!")
                    return;
                }

                if(parseFloat($scope.item.jumlah) > $scope.stok && $scope.item.jenisKemasan.id == 2){
                    alert("Jumlah obat melebihi stok yang tersisa, stok tersisa: " + $scope.stok)
                    return;
                }
                // if ($scope.item.stok == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined || $scope.item.jenisKemasan == '') {
                    alert("Pilih Jenis Layanan Resep terlebih dahulu!!")
                    return;
                }
                if ($scope.item.produk == undefined || $scope.item.produk == '') {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.aturanpakaitxt == undefined || $scope.item.aturanpakaitxt == '') {
                    alert("Aturan Pakai Belum diisi!!")
                    return;
                }
                if ($scope.item.rke == undefined || $scope.item.rke == '') {
                    alert("R/ Belum diisi!!")
                    return;
                }
                if ($scope.item.jenisRacikan == undefined || $scope.item.jenisRacikan == '') {
                    alert("Sediaan Obat Belum diisi!!")
                    return;
                }
                if ($scope.item.dosis == undefined || $scope.item.dosis == '') {
                    alert("Sediaan Belum diisi!!")
                    return;
                }
                if ($scope.item.KeteranganPakai == undefined || $scope.item.KeteranganPakai == '') {
                    alert("Keterangan Belum diisi!!")
                    return;
                }
                if ($scope.item.satuannya == undefined || $scope.item.satuannya == '') {
                    alert("Satuan Dosis Belum diisi!!")
                    return;
                }

                let isOutOfStok = false
                // if ($scope.item.stok < $scope.item.jumlah) {
                //     // alert("Stok tidak cukup!!")
                //     // return;
                //     if (confirm('Stok tidak cukup, lanjutkan ?')) {
                //         isOutOfStok =true
                   
                //     } else {
                //       return
                //     }
                // }
                var KetPakai = "";
                if ($scope.item.KeteranganPakai) {
                    KetPakai = $scope.item.KeteranganPakai;
                }

                

                var jumlahmakan = "";
                if ($scope.item.jumlahxmakan != undefined) {
                    jumlahmakan = $scope.item.jumlahxmakan;
                } else {
                    jumlahmakan = null;
                } 

                

                var dosis = $scope.item.dosis
                var jRacikan = null
                var namajRacikan = null
                if ($scope.item.jenisRacikan != undefined) {
                    jRacikan = $scope.item.jenisRacikan.id
                    namajRacikan = $scope.item.jenisRacikan.jenisracikan
                }
                
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                var qtyobat = 0
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    qtyobat = ($scope.item.dosis/$scope.item.kekuatan)*$scope.item.jumlah
                }else{
                    qtyobat
                }

                var data = {};
                                $scope.disabledRuangan = true;
                                if ($scope.item.no != undefined) {
                                    for (var i = data2.length - 1; i >= 0; i--) {
                                        if (data2[i].no == $scope.item.no) {
                                            data.no = $scope.item.no

                                            data.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                            //data.tglregistrasi = $scope.item.tglregistrasi
                                            data.generik = null
                                            data.hargajual = $scope.item.hargaSatuan
                                            data.jenisobatfk = jRacikan
                                            //data.kelasfk = $scope.item.kelas.id
                                            data.stock = $scope.item.stok
                                            data.harganetto = $scope.item.hargaSatuan
                                            data.nostrukterimafk = noTerima
                                            data.ruanganfk = $scope.item.ruangan.id
                                            data.kekuatan = $scope.item.kekuatan
                                            data.rke = $scope.item.rke
                                            data.jeniskemasanfk = $scope.item.jenisKemasan.id
                                            data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                            data.aturanpakaifk = 0//$scope.item.aturanPakai.id
                                            data.aturanpakai = $scope.item.aturanpakaitxt//aturanPakai.name
                                            data.ispagi = $scope.item.chkp
                                            data.issiang = $scope.item.chks
                                            data.issore = $scope.item.chksr
                                            data.ismalam = $scope.item.chkm
                                            data.asalprodukfk = 0//$scope.item.asal.id
                                            data.asalproduk = ''//$scope.item.asal.asalproduk
                                            data.produkfk = $scope.item.produk.id
                                            data.namaproduk = $scope.item.produk.namaproduk
                                            data.nilaikonversi = 1
                                            data.satuanstandarfk = $scope.item.jenisRacikan.id
                                            data.satuanstandar = $scope.item.jenisRacikan.jenisracikan
                                            data.satuanviewfk = $scope.item.jenisRacikan.id
                                            data.satuanview = $scope.item.jenisRacikan.jenisracikan
                                            data.jmlstok = $scope.item.stok
                                            data.jumlah = $scope.item.jumlah
                                            data.hargasatuan = $scope.item.hargaSatuan
                                            data.hargadiscount = 0
                                            data.total = $scope.item.total
                                            data.dosis = dosis
                                            data.jumlahxmakan = jumlahmakan
                                            data.keterangan = KetPakai,
                                            data.tglkadaluarsa = $scope.tglkadaluarsa != undefined ? $scope.tglkadaluarsa : null,
                                            data.isoutofstok = isOutOfStok,
                                            data.satuandosis = $scope.item.satuannya,
                                            data2[i] = data;
                                            $scope.dataGrid = new kendo.data.DataSource({
                                                data: data2,
                                                group: $scope.group
                                            });

                                        }
                                    }

                                } else {
                                    data = {
                                        no: nomor,
                                        generik: null,
                                        hargajual: $scope.item.hargaSatuan,
                                        jenisobatfk: jRacikan,
                                        //kelasfk:$scope.item.kelas.id,
                                        stock: $scope.item.stok,
                                        harganetto: $scope.item.hargaSatuan,
                                        nostrukterimafk: noTerima,
                                        ruanganfk: $scope.item.ruangan.id,//£££
                                        kekuatan: $scope.item.kekuatan,
                                        rke: $scope.item.rke,
                                        jeniskemasanfk: $scope.item.jenisKemasan.id,
                                        jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                                        aturanpakaifk: 0,//$scope.item.aturanPakai.id,
                                        aturanpakai: $scope.item.aturanpakaitxt,//aturanPakai.name,
                                        ispagi: $scope.item.chkp,
                                        issiang: $scope.item.chks,
                                        issore: $scope.item.chksr,
                                        ismalam: $scope.item.chkm,
                                        asalprodukfk: 0,//$scope.item.asal.id,
                                        asalproduk: '',//$scope.item.asal.asalproduk,
                                        produkfk: $scope.item.produk.id,
                                        namaproduk: $scope.item.produk.namaproduk,
                                        nilaikonversi: 1,
                                        satuanstandarfk: $scope.item.jenisRacikan.id,
                                        satuanstandar: $scope.item.jenisRacikan.jenisracikan,
                                        satuanviewfk: $scope.item.jenisRacikan.id,
                                        satuanview: $scope.item.jenisRacikan.jenisracikan,
                                        jmlstok: $scope.item.stok,
                                        jumlah: $scope.item.jumlah,
                                        hargasatuan: $scope.item.hargaSatuan,
                                        hargadiscount: 0,
                                        total: $scope.item.total,
                                        dosis: dosis,
                                        jumlahxmakan: jumlahmakan,
                                        keterangan: KetPakai,
                                        tglkadaluarsa : $scope.tglkadaluarsa != undefined ? $scope.tglkadaluarsa : null,
                                        isoutofstok : isOutOfStok,
                                        satuandosis : $scope.item.satuannya
                                    }
                                    data2.push(data)
                                    // $scope.dataGrid.add($scope.dataSelected)
                                    $scope.dataGrid = new kendo.data.DataSource({
                                        data: data2,
                                        group: $scope.group
                                    });
                                    var subTotal = 0;
                                    for (var i = data2.length - 1; i >= 0; i--) {
                                        subTotal = subTotal + parseFloat(data2[i].total)
                                    }
                                    $scope.item.totalSubTotal = subTotal
                                }
                                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                                }
                                Kosongkan();
                                clear();

                $scope.rke = $scope.item.rke
            }

            $scope.group = [
                {
                    field: "rke",
                }
            ]

            $scope.klikGrid = function (dataSelected) {
                if(statusTambah == false)
                return
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                $scope.item.rke = dataSelected.rke
                if(dataSelected.jenisobatfk!=null){
                    medifirstService.get("emr/get-jenis-obat?jrid=" + dataSelected.jenisobatfk, true).then(function (JR) {
                        $scope.item.jenisRacikan = { id: JR.data.data[0].id, jenisracikan: JR.data.data[0].jenisracikan }
                    });
                }
                $scope.item.jumlah = dataSelected.jumlah
                $scope.item.jenisKemasan = { id: dataSelected.jeniskemasanfk, jeniskemasan: dataSelected.jeniskemasan }
                $scope.item.satuanresep = { id: dataSelected.satuanresepfk, satuanresep: dataSelected.satuanresep }
                $scope.item.satuan = { ssid: dataSelected.satuanstandarfk, satuanstandar: dataSelected.satuanstandar }
                $scope.item.jumlahxmakan = dataSelected.jumlahxmakan
                $scope.item.dosis = dataSelected.dosis
                $scope.item.aturanPakai = { id: dataSelected.aturanpakaifk, name: dataSelected.aturanpakai }
                $scope.item.aturanpakaitxt = dataSelected.aturanpakai
                $scope.item.KeteranganPakai = dataSelected.keterangan
                $scope.item.satuannya = dataSelected.satuandosis
                $scope.currentAturanPakai = []

                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                // let sp = dataSelected.ispagi
                // let ss = dataSelected.issiang
                // let sm = dataSelected.ismalam
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
                $scope.item.asal = { id: dataSelected.asalprodukfk, asalproduk: dataSelected.asalproduk }
                for (var i = $scope.listProdukOrder.length - 1; i >= 0; i--) {
                    if ($scope.listProdukOrder[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProdukOrder[i]
                        break;
                    }
                }
                $scope.item.KeteranganPakai = $scope.item.chkp + "-" + $scope.item.chks + "-"+ $scope.item.chksr+"-" + $scope.item.chkm
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                GETKONVERSI()

            }
            function Kosongkan() {
                
                $scope.item.produk = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.no = undefined
                $scope.item.dosis = undefined
                $scope.item.jumlah = $scope.item.jenisKemasan.id == 1 ? $scope.item.jumlah : null
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.satuanresep = undefined;
                $scope.item.kekuatan = ''
                $scope.item.satuannya = undefined
                
                $scope.item.KeteranganPakai = $scope.item.jenisKemasan.id == 1 ? $scope.item.KeteranganPakai : '';
                if ($scope.item.jenisKemasan.id != 1) {
                    $scope.item.aturanpakaitxt = ''
                    $scope.item.chkp = 0
                    $scope.item.chks = 0
                    $scope.item.chksr = 0
                    $scope.item.chkm = 0
                    $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "P" ,'isChecked':false},
                            { "id": 2, "nama": "S" ,'isChecked':false},
                            { "id": 3, "nama": "Sr" ,'isChecked':false},
                            { "id": 4, "nama": "M" ,'isChecked':false}                      
                        ]
                    }
                ];
                }
            }
            function clear() {
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.jenisRacikan = ''
                }

                // $scope.item.aturanPakai = ''
                // $scope.item.aturanpakaitxt = ''
            }
            function cleargrid() {
                for (var i = 0; i < data2.length; i++) {
                    data2.splice(i, 1);

                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    $scope.item.totalSubTotal = subTotal
                }
            }
            $scope.batal1 = function () {
                Kosongkan();
                clear();
            }
            $scope.batal = function () {
                $scope.disabledRuangan = false
                Kosongkan();
                clear();
                cleargrid();
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "100px",
                    "hidden": true
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "100px",
                    groupFooterTemplate: " ",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Jenis Layanan Resep",
                    "width": "70px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Obat / Alkes",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Sediaan",
                    "width": "200px",
                },
                {
                    "field": "dosis",
                    "title": "Dosis",
                    "width": "75px",
                },
                {
                    "field": "satuandosis",
                    "title": "Satuan",
                    "width": "100px"
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                    "width": "75px",
                },
                {
                    "field": "aturanpakai",
                    "title": "Signa",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "200px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "Tgl Exp",
                    "width": "90px",                   
                }
            ];
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "50px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "width": "50px",
                },
                 {
                    "field": "isambilobat",
                    "title": "Resep Di Ambil Di RS",
                    "width": "50px",
                }
            ];
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        group: $scope.group
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                            groupFooterTemplate: " "
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Layanan Resep",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Nama Obat / Alkes",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Dosis",
                            width: "100px"
                        },
                        {
                            field: "dosis",
                            title: "Sediaan",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Jumlah",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Signa",
                            width: "100px"
                        },
                        {
                            field: "keterangan",
                            title: "Keterangan",
                            width: "100px"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Exp",
                            "width": "90px",                   
                        }
                    ]
                };
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.save = function () {
                if ($scope.dataGridRiwayat != undefined && $scope.dataGridRiwayat._data.length > 0 && $scope.norecOrder == '' && $scope.item.ruangan.id == 94) {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Order Resep sudah dilakukan, Apakah ingin order lagi ?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('OK')
                    $mdDialog.show(confirm).then(function () {
                        $scope.simpan();
                    })
                } else {
                    $scope.simpan();
                }

            }
            function sendNotification(e) {
                var body = {
                    norec: e.noresep.norec,
                    judul: 'Ada order baru #' + e.noresep.noorder,
                    jenis: e.noresep.keteranganorder,
                    pesanNotifikasi: '',
                    idRuanganAsal: e.noresep.objectruanganfk,
                    idRuanganTujuan: e.noresep.objectruangantujuanfk,
                    ruanganAsal: $scope.header.namaruangan,
                    ruanganTujuan: $scope.item.ruangan.namaruangan,
                    kelompokUser: null, //medifirstService.getKelompokUser()
                    idKelompokUser: null,
                    idPegawai: medifirstService.getPegawai().id,
                    dataArray: [],
                    urlForm: 'ResepElektronik',
                    params: {
                        noOrder: e.noresep.noorder
                    },
                    namaFungsiFrontEnd: null,
                    tgl: e.noresep.tglorder,
                    tgl_string: dateHelper.getTanggalJamFormatted(e.noresep.tglorder),
                }
                medifirstService.sendSocket("sendNotification", body);
            }
            $scope.simpan = function () {
                $scope.isRouteLoading = true
                $scope.hideSimpan = true
                if (data2.length == 0) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return
                }
                if (diffDays < 1) {
                    alert("Tanggal Akhir tidak boleh lebih kecil!!")
                    return
                }

                if ($scope.item.noRuang == undefined) {
                    alert("Nomor Ruangan Tidak Boleh Kosong!!")
                    return
                }

                var checkRP = 0;
                if ($scope.checkResepPulang == true) {
                    checkRP = 1;
                }

                var dataalergi =  null
                if($scope.item.alergi != undefined){
                    dataalergi = $scope.item.alergi
                }

                var tglResepHari = ''
                var objSaves = [];
                for (var i = diffDays - 1; i >= 0; i--) {
                    var someDate = moment($scope.item.tglresep).toDate();//new Date(moment($scope.item.tglresep).format('YYYY-MM-DD hh:mm:ss'));
                    var numberOfDaysToAdd = i;
                    tglResepHari = moment(someDate.setDate(someDate.getDate() + numberOfDaysToAdd)).format('YYYY-MM-DD hh:mm:ss');

                    var strukorder = {
                        norec: $scope.norecOrder,
                        tglresep: tglResepHari,//moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss'),
                        penulisresepfk: $scope.item.penulisResep.id,
                        ruanganfk: $scope.item.ruangan.id,
                        noregistrasifk: norec_apd,
                        qtyproduk: $scope.dataGrid._data.length,
                        noruangan: $scope.item.noRuang != undefined ? $scope.item.noRuang : null,
                        isreseppulang: checkRP,
                        iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                        alergi: dataalergi,
                        nocm: $scope.header.nocm,
                    }
                    var objSave = {
                        strukorder: strukorder,
                        orderfarmasi: data2
                    }
                    objSaves.push(objSave);
                }

                
                // $scope.hideSimpan =true
                medifirstService.post('emr/simpan-order-pelayananobatfarmasi',{data: objSaves}).then(function (e) {
                $scope.hideSimpan = false
                $scope.isRouteLoading = false
                    sendNotification(e.data)
                    $scope.item.resep == undefined
                    $scope.norecOrder = ''
                    if($scope.copynoresep == ''){
                        medifirstService.postLogging('Order Resep', 'Norec strukresep_t', e.data.noresep.norec,
                        'Order Resep No Order - ' + e.data.noresep.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })
                    } else if($scope.copynoresep != ''){
                        medifirstService.postLogging('Order Resep', 'Norec strukresep_t', e.data.noresep.norec,
                        'Order Resep No Order - ' + e.data.noresep.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi+ ' dari copy no resep ' + $scope.copynoresep).then(function (res) {
                        })
                    }

                    var objSave = {
                        // data: data2,
                        norec_apd: norec_apd,
                    }
                    medifirstService.post('emr/farmasi-save-preview', objSave).then(function () {
                        // window.open(config.baseApiBackend + "report/cetak-preview-order?norec_apd=" + norec_apd);
                    })
                    // $scope.item.resep = e.data.noresep.noorder
                    //  $scope.hideSimpan =false
                    
                    $scope.copynoresep = ''
                    init();
                    $scope.batal();
                    $scope.disabledRuangan = false
                    if ($scope.item.noRuang != undefined)
                        cacheHelper.set('noRuangInputResep', $scope.item.noRuang)

                    let params = $scope.item.noregistrasi
                    if ($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi != 'Kios-K') {
                        params = $scope.item.noreservasi
                    }
                    saveAntrol(params, norec_pd)
                },
                function (err) {
                    $scope.hideSimpan = false
                    $scope.isRouteLoading = false
                });
                
                
            }

            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.riwayatFormResep = false
                $scope.inputObatOrder = false;
            }
            function loadOrder(params){
                medifirstService.get("emr/get-daftar-detail-order?" + params, true).then(function (e) {
                    for (var i = e.data.length - 1; i >= 0; i--) {
                        e.data[i].no = i + 1                        
                        if (e.data[i].reseppulang == 1) {
                            e.data[i].cekreseppulang = "✔"                            
                        }else{
                            e.data[i].cekreseppulang = "-"
                        }
                         if (e.data[i].isambilobat == true) {
                            e.data[i].isambilobat = "✔"                            
                        }else{
                            e.data[i].isambilobat = "✘"
                        }

                        if (e.data[i].cito == true) {
                            e.data[i].cito = "✔"                            
                        }else{
                            e.data[i].cito = "✘"
                        }
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data,
                        pageSize: 10
                    });


                });
            }
            function loadRiwayat(params) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-transaksi-pelayanan-resep-elektronik?" + params, true).then(function (dat) {
                    let group = [];          
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].nilaikonversi = 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if ( dat.data[i].reseppulang == true) {
                                dat.data[i].cekreseppulang = '✔'
                            }else{
                                dat.data[i].cekreseppulang = '-'
                            }

                            if ( dat.data[i].cito == true) {
                                dat.data[i].cito = '✔'
                            }else{
                                dat.data[i].cito = '-'
                            }
                        }

                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,     
                                    cito: array[i].cito,                                 
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridResep = group
                    $scope.isRouteLoading = false;
                });
                // $scope.riwayatForm = false
                // $scope.riwayatFormResep = true
                // $scope.inputObatOrder = false;
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noReg=' + $scope.item.noregistrasi)
                    loadOrder('noreg=' + $scope.item.noregistrasi)
                } else {
                    loadRiwayat('nocm=' + $scope.item.noMr)
                    loadOrder('nocm=' + $scope.item.noMr)
                }
            }
            // $scope.riwayatResep = function () {
            //     $scope.isRouteLoading = true;
            //     medifirstService.get("emr/get-transaksi-pelayanan-resep-elektronik?noReg=" + $scope.item.noregistrasi
            //     // nocm=" + $scope.item.noMr
            //         // + "&noregistrasifk=" + norec_apd
            //         , true).then(function (dat) {
            //             let group = [];
            //             if (dat.statResponse == true) {
            //                 for (var i = 0; i < dat.data.length; i++) {
            //                     dat.data[i].no = i + 1                                
            //                     dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount));
            //                     dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa);
            //                     if (dat.data[i].reseppulang == '1') {
            //                         dat.data[i].cekreseppulang = "✔"
            //                     }else{
            //                         dat.data[i].cekreseppulang = "-"
            //                     }

            //                     if ( dat.data[i].cito == true) {
            //                         dat.data[i].cito = '✔'
            //                     }else{
            //                         dat.data[i].cito = '-'
            //                     }
            //                 }
            //                 var array = dat.data;
            //                 let sama = false

            //                 for (let i in array) {
            //                     array[i].count = 1
            //                     sama = false
            //                     for (let x in group) {
            //                         if (group[x].noresep == array[i].noresep) {
            //                             sama = true;
            //                             group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

            //                         }
            //                     }
            //                     if (sama == false) {
            //                         var dataDetail0 = [];
            //                         for (var f = 0; f < array.length; f++) {
            //                             if (array[i].noresep == array[f].noresep) {
            //                                 dataDetail0.push(array[f]);
            //                             };
            //                         }
            //                         let result = {
            //                             noregistrasi: array[i].noregistrasi,
            //                             tglpelayanan: array[i].tglpelayanan,
            //                             noresep: array[i].noresep,
            //                             aturanpakai: array[i].aturanpakai,
            //                             namaruangandepo: array[i].namaruangandepo,
            //                             namaruangan: array[i].namaruangan,
            //                             dokter: array[i].dokter,
            //                             count: array[i].count,
            //                             cekreseppulang : array[i].cekreseppulang,
            //                             cito: array[i].cito, 
            //                             details: dataDetail0
            //                         }
            //                         group.push(result)
            //                     }
            //                 }
            //             }

            //             $scope.dataGridResep = group
            //             console.log(group)
            //             $scope.isRouteLoading = false;
            //         });
            //     $scope.riwayatForm = false
            //     $scope.riwayatFormResep = true
            //     $scope.inputObatOrder = false;
            // }
            $scope.columnGridResep = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                     "template": "<span class='style-center'>#: cekreseppulang #</span>"
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "width": "90px",
                     "template": "<span class='style-center'>#: cito #</span>"
                }
            ];

            $scope.data2 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        group: $scope.group
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                            groupFooterTemplate: " "
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Layanan Resep",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Nama Obat / Alkes",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Sediaan",
                            width: "100px"
                        },
                        {
                            field: "dosis",
                            title: "Dosis",
                            width: "100px"
                        },
                        {
                            field: "satuandosis",
                            title: "Satuan",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Jumlah",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Signa",
                            width: "100px"
                        },
                        {
                            field: "keterangan",
                            title: "Keterangan",
                            width: "100px"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Exp",
                            "width": "90px",                   
                        }
                    ]
                }
            };
            $scope.newOrder = function () {
                $scope.riwayatFormResep = false
                $scope.riwayatForm = false
                $scope.inputObatOrder = true;
            }
            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl');
                cacheHelper.set('InputResepApotikOrderV2Ctrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl')

                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('InputResepApotikOrderV2Ctrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
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
            $scope.editOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }


                medifirstService.get("farmasi/get-penjagaan-order-sudah-verif?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                    if (dat.data[0].data[0].statusorder == 5) {
                        messageContainer.error('Tidak bisa di edit sudah di verifikasi');
                    } else if (dat.data[0].data[0].statusorder == 0 || dat.data[0].data[0].statusorder == null) {
                        medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            $scope.norecOrder = $scope.dataSelectedRiwayat.norec_order
                            $scope.item.resep = $scope.dataSelectedRiwayat.noorder
                            $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                            $scope.disabledRuangan = true;
                            $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                            $scope.item.tglresep = new Date(dat.data.strukorder.tglorder)
                            $scope.item.tglresepAkhir = new Date(dat.data.strukorder.tglorder)
                            if ($scope.dataSelectedRiwayat.reseppulang == "✔") {
                                $scope.checkResepPulang = true;
                            }else{
                                $scope.checkResepPulang = false;
                            }
        
                            if ($scope.dataSelectedRiwayat.cito == "✔") {
                                $scope.item.iscito = true;
                            }else{
                                $scope.item.iscito = false;
                            }
                            
                            data2 = dat.data.orderpelayanan
                            for (var i = data2.length - 1; i >= 0; i--) {
        
        
        
                                data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                data2[i].tglregistrasi = $scope.item.tglregistrasi
        
                                data2[i].kelasfk = $scope.item.kelas.id
                                data2[i].keterangan = data2[i].catatandokter
                                data2[i].jumlahxmakan = null
                            }
        
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2,
                                group: $scope.group
                            });
        
        
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = subTotal
                            $scope.riwayatFormResep = false
                            $scope.riwayatForm = false
                            $scope.inputObatOrder = true;
                        });
                    }
                });
            }

            $scope.preview = function (){
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                window.open(config.baseApiBackend + "report/cetak-detail-order?noorder=" + $scope.dataSelectedRiwayat.noorder);

                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                });
            }

            $scope.reOrder = function (){
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                medifirstService.get("emr/get-detail-order?noorder=" + $scope.dataSelectedRiwayat.noorder, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.norecOrder = ''
                    $scope.item.resep = $scope.dataSelectedRiwayat.noorder
                    $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                    // $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                    $scope.item.tglresep = new Date($scope.item.tglresep);
                    $scope.item.tglresepAkhir = new Date($scope.item.tglresepAkhir);
                    if ($scope.dataSelectedRiwayat.cekreseppulang == "✔") {
                        $scope.checkResepPulang = true;
                    }else{
                        $scope.checkResepPulang = false;
                    }

                    if ($scope.dataSelectedRiwayat.cito == "✔") {
                        $scope.item.iscito = true;
                    }else{
                        $scope.item.iscito = false;
                    }
                    
                    data2 = dat.data.orderpelayanan
                    for (var i = data2.length - 1; i >= 0; i--) {



                        data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                        data2[i].tglregistrasi = $scope.item.tglregistrasi

                        data2[i].kelasfk = $scope.item.kelas.id
                        data2[i].keterangan = data2[i].catatandokter
                        data2[i].jumlahxmakan = null
                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group
                    });


                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = subTotal
                    $scope.riwayatFormResep = false
                    $scope.riwayatForm = false
                    $scope.inputObatOrder = true;
                });
            }
            $scope.reOrderResep = function (){
                if ($scope.dataSelectedResep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }


                if ($scope.dataSelectedResep.cito == "✔") {
                    $scope.item.iscito = true;
                }else{
                    $scope.item.iscito = false;
                }

                $scope.copynoresep = $scope.dataSelectedResep.noresep
                for (let j = 0; j < $scope.dataSelectedResep.details.length; j++) {
                    $scope.isRouteLoading = true;
                    dataProdukDetail = []
                    $scope.dataSelectedResep.details[j].jumlahxmakan = null
                    medifirstService.get("emr/get-produkdetail?" +
                        "produkfk=" + $scope.dataSelectedResep.details[j].produkfk +
                        "&ruanganfk=" + $scope.item.ruangan.id +
                        "&kpid=" + $scope.item.kpid, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        $scope.dataSelectedResep.details[j].jmlstok = dat.data.jmlstok
                        $scope.dataSelectedResep.details[j].ruanganfk = $scope.item.ruangan.id
                        
                    });
                    medifirstService.get("emr/get-jenis-obat?jrid=" + $scope.dataSelectedResep.details[j].jenisobatfk, true).then(function (JR) {
                        $scope.dataSelectedResep.details[j].satuanstandarfk = JR.data.data[0].id
                        $scope.dataSelectedResep.details[j].satuanviewfk = $scope.dataSelectedResep.details[j].satuanstandarfk
                        $scope.dataSelectedResep.details[j].satuanview = $scope.dataSelectedResep.details[j].satuanstandar
                    });
                }
                medifirstService.get("farmasi/get-detail-order-resep?noresep=" + $scope.dataSelectedResep.noresep + "&kpid=" + $scope.item.kpid, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var nama = 'Laras'
                    var jumlah = 0;
                    var no = 0;
                    for(var i=0; i<dat.data.data.length; i++){

                            if(i  == 0){
                                jumlah = 0;
                                jumlah = parseInt(dat.data.data[i]['stock']);
                            }
                            else if(dat.data.data[i]['namaproduk'] != dat.data.data[i-1]['namaproduk']){
                                jumlah = 0;
                                jumlah = parseInt(dat.data.data[i]['stock']);
                            }
                            else if(dat.data.data[i]['namaproduk'] == dat.data.data[i-1]['namaproduk']){
                                jumlah += parseInt(dat.data.data[i]['stock']);
                                dat.data.data[i]['stock'] = jumlah;
                                dat.data.data[i]['jmlstok'] = jumlah;
                                dat.data.data.splice(i-1, 1);
                            } 
                         
                            //nama = dat.data.data[i]['namaproduk'];
                        }

                    for(var x=0; x<dat.data.data.length; x++){
                        dat.data.data[x].no = x+1
                    }

                    

                    data2 = $scope.dataSelectedResep.details
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        group: $scope.group
                    });
                });
            }
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
                
                $scope.item.aturanpakaitxt = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1' 
                if (jml == 0) {
                    $scope.item.aturanpakaitxt = ''
                }
                $scope.item.KeteranganPakai = $scope.item.chkp + "-" + $scope.item.chks + "-" + $scope.item.chksr + "-" + $scope.item.chkm
            }
            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) return
                if ($scope.dataSelectedRiwayat.statusorder != "Menunggu") {
                    toastr.error('Tidak bisa di Hapus sudah di verifikasi')
                    return
                }
                var stt = '';
                if (confirm('Yakin Mau Menghapus data? ')) {
                    stt = 'true';
                } else {
                    return;
                }
                medifirstService.post('emr/hapus-order-pelayananobatfarmasi', { norec: $scope.dataSelectedRiwayat.norec_order }).then(function (e) {
                    init();
                })
            }
            $scope.columnGridResepExist = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Produk",
                    "width": "100px",
                },

            ];
            $scope.klikExist = function (dataSelectedResepExist) {
                var dataProduk = []
                for (var i = $scope.listProdukOrder.length - 1; i >= 0; i--) {
                    if ($scope.listProdukOrder[i].id == dataSelectedResepExist.id) {
                        dataProduk = $scope.listProdukOrder[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk
                $scope.getSatuan()
            }

            $scope.columnGridSsS = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20%"
                },
                {
                    "field": "namapaket",
                    "title": "Nama Paket",
                    "width": "40%"
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

        $scope.PaketObat = function () {
            if ($scope.item.ruangan == undefined) {
                toastr.error("Ruangan Masih Kosong");
                return;
            }

            dataPaket=[]
            medifirstService.get("sysadmin/get-paket-obat?").then(function (data) {
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
                $scope.popUpPaketObat.center().open();
            })
        }

        $scope.BatalPaket = function () {
            dataPaket =[];
            $scope.dataSource = new kendo.data.DataSource({
                data: [],
            });
            $scope.popUpPaketObat.close();
        }

        $scope.klikGridSsS = function (dataSelectedSsS) {
            $scope.butPaket = false;
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
                        dataProdukDetail = []
                        medifirstService.get("farmasi/get-produkdetail?" +
                            "produkfk=" + element.produkfk +
                            "&ruanganfk=" + $scope.item.ruangan.id, true).then(function (dat) {
                                dataProdukDetail = dat.data.detail[0];
                                var nilaiKonversi = 1;
                                datas = datas + 1;
                                var stok = dat.data.jmlstok / nilaiKonversi
                                var kekuatan = dat.data.kekuatan
                                var sediaan = dat.data.sediaan
                                if (parseFloat(stok) < parseFloat(element.qty)) {
                                    toastr.error("Stok untuk obat " + element.namaproduk + " kurang dari stok ruangan")
                                    return;
                                }
                                var nomor = 0
                                if (dataPaket == undefined) {
                                    nomor = 1
                                } else {
                                    nomor = dataPaket.length + 1
                                }
                                let ispagi =1
                                if (element.ispagi == false){
                                    ispagi=0
                                }
                                let issiang=1
                                if (element.issiang == false) {
                                    issiang =0
                                }
                                let issore=1
                                if (element.issore == false) {
                                    issore =0
                                }
                                let ismalam=1
                                if  (element.ismalam == false){
                                    ismalam=0
                                }
                                var data = {
                                    no: nomor,
                                    noregistrasifk: norec_apd,
                                    tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                                    generik: null,
                                    hargajual: String(dataProdukDetail.hargajual),
                                    jenisobatfk: jRacikan,
                                    kelasfk: $scope.item.kelas.id,
                                    stock: String(stok),
                                    harganetto: String(dataProdukDetail.hargajual),
                                    nostrukterimafk: dataProdukDetail.nostrukterimafk,
                                    ruanganfk: $scope.item.ruangan.id,
                                    rke: nomor,
                                    jeniskemasanfk: 2,
                                    jeniskemasan: "Non Racikan",
                                    aturanpakai: element.aturanpakai,
                                    ispagi: ispagi,
                                    issiang: issiang,
                                    issore: issore,
                                    ismalam: ismalam,
                                    routefk: null,
                                    route: null,
                                    asalprodukfk: dataProdukDetail.objectasalprodukfk,
                                    asalproduk: dataProdukDetail.asalproduk,
                                    produkfk: element.produkfk,
                                    namaproduk: element.namaproduk,
                                    nilaikonversi: nilaiKonversi,
                                    satuanstandarfk: element.objectsatuanstandarfk,
                                    satuanstandar: element.satuanstandar,
                                    satuanviewfk: element.objectsatuanstandarfk,
                                    satuanview: element.satuanstandar,
                                    jmlstok: String(stok),
                                    jumlah: element.qty,
                                    jumlahobat: String(element.qty),
                                    dosis: 1,
                                    hargasatuan: String(dataProdukDetail.hargajual),
                                    hargadiscount: String(0),
                                    total: (parseFloat(element.qty)*parseFloat(dataProdukDetail.hargajual)),
                                    jmldosis: String(element.qty) + '/' + String(1) + '/' + String(kekuatan),
                                    jasa: 0,
                                    keterangan: element.keterangan
                                }
                                dataPaket.push(data);
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
            $scope.popUpPaketObat.close();
            if (dataPaket == undefined) {
                toastr.error("data Belum Dipilih");
                return;
            }
            // data2.push(dataPaket)
            data2 = dataPaket
            $scope.dataGrid = new kendo.data.DataSource({
                data: dataPaket
            });
            var subTotal = 0;
            for (var i = dataPaket.length - 1; i >= 0; i--) {
                subTotal = subTotal + parseFloat(dataPaket[i].total)
            }
            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

            // if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
            //     $scope.item.rke = parseFloat($scope.item.rke) + 1
            // }
            // if ($scope.consis == 1) {
            //     $scope.statusConsis = true;
            // }
            // 26  0   t       jasa produksi non steril
            // 27  0   t       jasa pelayanan TPN
            // 28  0   t       jasa pelayanan handling cytotoxic
            // 29  0   t       jasa pelayanan IV Admixture
            // 30  0   t       jasa pelayanan Repacking obat injeksi
            // strStatus= $scope.item.produk.id

            Kosongkan()

            $scope.butPaket = false
            racikan = ''
            // statusTambah = false
        }
        function saveAntrol(param, norec_pd) {
            var data = {
                "url": "antrean/updatewaktu",
                "jenis": "antrean",
                "method": "POST",
                "data": {
                    "kodebooking": param,
                    "taskid": 5, //Waktu mulai farmasi
                    "waktu": new Date().getTime()
                }
            }
            saveMonitoringTaksId(norec_pd, 5, new Date().getTime(), false)
            medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (e) {
                if (e.data.metaData.code == 200) {
                    saveMonitoringTaksId(norec_pd, 5, new Date().getTime(), true)
                } else {
                    repeatSendTaskId(norec_pd, 5)
                }
            })
        }
        
        function saveMonitoringTaksId(noregistrasifk, taskid, waktu, statuskirim) {
            var json = {
                "noregistrasifk": noregistrasifk,
                "taskid": taskid,
                "waktu": waktu,
                "statuskirim": statuskirim
            }
            medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(function (e) {})
        }

        function repeatSendTaskId(norec_pd, taskid) {
            medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(function (e) {
                var data = {
                    "url": "antrean/add",
                    "jenis": "antrean",
                    "method": "POST",
                    "data": e.data
                }
                medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
                    // simpan log
                    medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
                        e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
                        JSON.stringify(data) + ' | ' + JSON.stringify(x.data))

                    // mengabil data catatan task id dari 1 - 4
                    medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
                        updateWaktuId(res, e.data.kodebooking, norec_pd)
                    })
                })
            })
        }
        async function updateWaktuId(res, kodebooking, norec_pd) {
            for (let i = 0; i < res.data.length; i++) {
                const element = res.data[i];
                var data = {
                    "url": "antrean/updatewaktu",
                    "jenis": "antrean",
                    "method": "POST",
                    "data": {
                        "kodebooking": kodebooking,
                        "taskid": element.taskid,
                        "waktu": parseInt(element.waktu)
                    }
                }
                await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                    if (e.data.metaData.code == 200) {
                        await saveMonitoringTaksId(norec_pd, element.taskid, parseInt(element.waktu), true);
                    }
                })
            }
        }
        $scope.gantiJR = function(data){
            if(data == 2){
                $scope.item.jumlah = null
                $scope.item.KeteranganPakai = ''
            }
        }

        $scope.printPreview = function(){
            if(data2 == ""){
                toastr.error('Isi dulu resep sebelum preview')
                return
            }
            var objSave = {
                data: data2,
                norec_apd: norec_apd,
            }
            medifirstService.post('emr/farmasi-save-preview', objSave).then(function(){
                window.open(config.baseApiBackend + "report/cetak-preview-order?norec_apd=" + norec_apd);
            })
        }
           //** BATAS SUCI */
        }
    ]);
});

