define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPasienMutasiCtrl', ['$scope', 'ModelItem', '$state', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem', 'MedifirstService',
        function ($scope, modelItem, $state, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem, medifirstService) {
            $scope.now = new Date();
            $scope.currentNoCm = $state.params.noCm;
            $scope.currentNorec = $state.params.noRec;
            $scope.currentNorecAntrian = $state.params.noRecAntrian;
            var responData = '';
            var norecPD = '';
            var noRegistrasis = '';
            var norecAPD = '';
            var noCM = '';
            $scope.isSimpanAsuransi = true;
            $scope.isNext = true;
            $scope.item = {};
            $scope.item.tglRegistrasi = $scope.now;
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            $scope.model.tglPelayanan = $scope.now;
            loadCache();
            GetCombo();

            function GetCombo() {
                medifirstService.get('registrasi/daftar-antrian-pasien/get-combo').then(function (e) {
                    $scope.listJenisDiagnosa = e.data.jenisdiagnosa
                })

                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
                    $scope.listDataPegawai = e;
                });

                medifirstService.getPart("registrasi/daftar-antrian-pasien/get-diagnosa", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }

            function loadCache() {
                var noregistrasiCache = cacheHelper.get('cacheNoRegMutasi')
                if (noregistrasiCache != undefined) {
                    noRegistrasis = noregistrasiCache
                } else {
                    cacheHelper.set('cacheNoRegMutasi', undefined)
                    noRegistrasis = ''
                }
            }

            // $scope.model.rawatInap = true;
            // $scope.cekRawatInap($scope.model.rawatInap);

            medifirstService.get("registrasi/get-data-combo-new", true)
                .then(function (dat) {
                    $scope.listJenisPelayanan = dat.data.jenispelayanan;
                    $scope.listKelas = dat.data.kelas;

                    $scope.listAsalRujukan = dat.data.asalrujukan;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    // $scope.listDokter = dat.data.dokter;
                    $scope.listRuangan = dat.data.ruanganranap;

                    $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                    $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                    // $scope.sourceRekanan= dat.data.rekanan;
                    $scope.sourceKelasDitanggung = dat.data.kelas;
                    $scope.sourceAsalRujukan = dat.data.asalrujukan;
                    $scope.model.namaPenjamin = { id: dat.data.kelompokpasien[1].id, kelompokpasien: dat.data.kelompokpasien[1].kelompokpasien }
                    // $scope.model.institusiAsalPasien={id:dat.data.rekanan[689].id,namarekanan:dat.data.rekanan[689].namarekanan}
                    $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                    $scope.model.asalRujukan = { id: dat.data.asalrujukan[3].id, asalrujukan: dat.data.asalrujukan[3].asalrujukan }
                });
            medifirstService.getPart('registrasi/get-dokter-part', true, 10).then(function (e) {
                $scope.listDokter = e;
            })

            loadPertama();
            function loadPertama() {
                var cachePasienDaftar = cacheHelper.get('CacheRegistrasiPasien');
                if (cachePasienDaftar != undefined) {
                    var arrPasienDaftar = cachePasienDaftar.split('~');
                    norecPD = arrPasienDaftar[0];
                    noRegistrasis = arrPasienDaftar[1];
                    norecAPD = arrPasienDaftar[2];

                    $scope.cacheNorecPD = norecPD;
                    $scope.cacheNorecAPD = norecAPD;
                    $scope.cacheNoRegistrasi = noRegistrasis;
                    medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + $scope.cacheNorecPD + "&norecAPD="
                        // manageServicePhp.getDataTableTransaksi("registrasipasien/get-pasien-bynorec/"+ $scope.cacheNorecPD+"/"
                        + $scope.cacheNorecAPD)
                        .then(function (his) {
                            var his = his.data
                            // $scope.item.tglRegistrasi = his.data.data[0].tglregistrasi,
                            $scope.item.ruangan = {
                                id: his.data[0].objectruanganlastfk,
                                namaruangan: his.data[0].namaruangan,
                            }
                            $scope.item.kelas = { id: his.data[0].objectkelasfk, namakelas: his.data[0].namakelas }
                            $scope.listKamar = ([{ id: his.data[0].objectkamarfk, namakamar: his.data[0].namakamar }])
                            $scope.item.kamar = { id: his.data[0].objectkamarfk, namakamar: his.data[0].namakamar }
                            $scope.listNoBed = ([{ id: his.data[0].objecttempattidurfk, reportdisplay: his.data[0].reportdisplay }])
                            $scope.item.nomorTempatTidur = { id: his.data[0].objecttempattidurfk, reportdisplay: his.data[0].reportdisplay }
                            $scope.item.asalRujukan = { id: his.data[0].objectasalrujukanfk, asalrujukan: his.data[0].asalrujukan }
                            $scope.item.kelompokPasien = { id: his.data[0].objectkelompokpasienlastfk, kelompokpasien: his.data[0].kelompokpasien }
                            $scope.item.rekanan = { id: his.data[0].objectrekananfk, namarekanan: his.data[0].namarekanan }
                            // $scope.listJenisPelayanan =([ {id:parseInt(his.data[0].objectjenispelayananfk),jenispelayanan:his.data[0].jenispelayanan}])
                            // $scope.item.jenisPasien = {id:parseInt(his.data[0].objectjenispelayananfk),jenispelayanan:his.data[0].jenispelayanan}      
                            $scope.item.dokter = { id: his.data[0].objectpegawaifk, namalengkap: his.data[0].dokter }

                            $scope.isInputAsuransi = true;
                            $scope.isNext = false;
                            $scope.isBatal = true;
                            $scope.isReport = true;
                            $scope.isReportPendaftaran = true;

                            $scope.isReportRawatInap = true;

                            $scope.isSimpan = true;
                            $scope.isAsuransi = true;
                        });

                } else
                    getPasienByNorecPD();


                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-pasienbynocm?noCm=" + $scope.currentNoCm)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data.data[0];
                        if (e.data.data[0].foto == null)
                            $scope.item.pasien.foto = "../app/images/avatar.jpg"
                        var now = new Date();
                        var umur = dateHelper.CountAge(new Date($scope.item.pasien.tgllahir), now);
                        $scope.item.pasien.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        $scope.item.nocmfk = e.data.data[0].nocmfk;

                    });


            };
            function getPasienByNorecPD() {
                medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + $scope.currentNorec + "&norecAPD=" + $scope.currentNorecAntrian)
                    .then(function (his) {
                        $scope.item.historyPasien = his.data.data[0];


                    });
            }

            $scope.$watch('model.rawatInap', function (data) {
                if (!data) return;
                $scope.cekRawatInap(data);
            })

            $scope.pilihRuangan = function (id) {
                // get ruangan with condition (rawat jalan or rawat inap)
                // if ($scope.model.rawatInap === true) {
                var ruanganId = id;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        $scope.listKelas = dat.data.kelas;

                    });
                // }
            }
            $scope.$watch('item.kelas', function (e) {
                if (e === undefined) return;
                var kelasId = "idKelas=" + $scope.item.kelas.id;
                var ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                medifirstService.get("registrasi/get-kamarbyruangankelas?" + kelasId + ruanganId)
                    .then(function (b) {

                        if ($scope.model.rawatGabung) {
                            $scope.listKamar = b.data.kamar;
                        } else {
                            $scope.listKamar = _.filter(b.data.kamar, function (v) {
                                return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                            })
                        }
                    });
            });
            $scope.$watch('item.kamar', function (e) {
                if (e === undefined) return;
                var kamarId = $scope.item.kamar.id;
                medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function (a) {
                        if ($scope.model.rawatGabung) {
                            $scope.listNoBed = a.data.bed;
                        } else {
                            $scope.listNoBed = _.filter(a.data.bed, function (v) {
                                return v.statusbed === "KOSONG";
                            })
                        }
                    })
            });



            $scope.$watch('item.kelompokPasien', function (e) {
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.listRekanan = z.data.rekanan;
                        if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.item.rekanan = '';
                            $scope.nonUmum = false;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                        }
                        else if (e.kelompokpasien == 'BPJS') {
                            $scope.item.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[1].id, jenispelayanan: $scope.listJenisPelayanan[1].jenispelayanan }

                        }
                        else {
                            $scope.nonUmum = true;
                            $scope.item.jenisPasien = { id: $scope.listJenisPelayanan[0].id, jenispelayanan: $scope.listJenisPelayanan[0].jenispelayanan }
                            // $scope.item.rekanan='';

                        }

                    })
            });

            $scope.ListAsuransi = [
                { "id": "1", "name": "No. SEP Otomatis" }
            ];


            $scope.noCm = $state.params.noCm;
            $scope.cekRawatGabung = function (data) {
                // opsi untuk pasien bayi
                // apakah pasien bayi satu ruangan dengan ibunya (true/false) ?
                $scope.model.rawatGabung = data;
            }
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm",	//set date format
                timeFormat: "HH:mm",		//set drop down time format to 24 hours
            };
            // $scope.jenisPasiens = [{
            //     id: 1, name: "Reguler"
            // }, {
            //     id: 2, name: "Eksekutif"
            // }]
            $scope.pegawai = modelItem.getPegawai();

            $scope.listPasien = [];
            $scope.doneLoad = $rootScope.doneLoad;
            $scope.showFind = true;
            $scope.showTindakan = false;
            $scope.dataModelGrid = [];

            $scope.Save = function () {

                $scope.SimpanRegistrasi();

            }

            $scope.SimpanRegistrasi = function () {
                if ($scope.item.kelas == undefined) {
                    toastr.error('Kelas harus di isi')
                    return
                }

                var kelasId = "";
                if ($scope.item.kelas == undefined) {
                    kelasId = null;
                } else
                    kelasId = $scope.item.kelas.id;

                var rekananId = null;
                if ($scope.item.rekanan != undefined)
                    rekananId = $scope.item.rekanan.id;

                var dokterId = null;
                if ($scope.item.dokter != undefined)
                    dokterId = $scope.item.dokter.id;



                var kamarIds = "";
                if ($scope.item.kamar == undefined) {
                    kamarIds = null;
                } else
                    kamarIds = $scope.item.kamar.id;


                var nomorTempatTidurs = "";
                if ($scope.item.nomorTempatTidur == undefined) {
                    nomorTempatTidurs = null;
                } else
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;




                var jenisPel = "";
                if ($scope.item.jenisPasien != undefined)
                    jenisPel = $scope.item.jenisPasien.id
                else {
                    messageContainer.error("Jenis Pelayanan Harus Di isi")
                    return
                }

                var tmpData = {
                    "pegawai": {
                        "id": dokterId
                    },
                    // "isRegistrasiLengkap": item.isRegistrasiLengkap,
                    // "isOnSiteService": item.isOnSiteService,
                    "tglRegistrasi": new moment($scope.item.tglRegistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    "jenisPelayanan": jenisPel,
                    "kelompokPasien": {
                        "id": $scope.item.kelompokPasien.id
                    },
                    "ruangan": {
                        "id": $scope.item.ruangan.id
                        // "departemenId": item.ruangan.departemenId
                    },
                    "pasien": {
                        "id": $scope.item.nocmfk,
                        "pasienDaftar": {
                            "noRec": $scope.currentNorec
                        },
                        "noCm": $scope.item.pasien.nocm
                    },

                    // "noRecAntrianPasien": $scope.dataAdmisi.registrasiPelayananPasien.noRec,
                    "noRecAntrianPasien": $scope.currentNorecAntrian,
                    // "tglRegistrasi":  $scope.item.pasien.tglDaftar,
                    "tglRegisDateOnly": new moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                    "objectruanganasalfk": $scope.item.historyPasien.objectruanganlastfk,
                    "objectrekananfk": rekananId,
                    "asalRujukan": {
                        "id": $scope.item.historyPasien.objectasalrujukanfk
                    },
                    "kelas": {
                        "id": kelasId
                    },
                    "kamar": {
                        "id": kamarIds
                    },
                    "nomorTempatTidur": {
                        "id": nomorTempatTidurs
                    },
                    "status": "pindah Kamar",
                    "noRecPasienDaftar": $scope.currentNorec,
                    "statusPasien": $scope.item.historyPasien.statuspasien,

                }
                $scope.isSimpan = true;
                medifirstService.post('registrasi/simpan-mutasi-pasien', tmpData).then(function (e) {
                    $scope.resultAPD = e.data.data;
                    responData = e.data;
                    $scope.resultPD = e.data.data;
                    $scope.model.noRegistrasi = e.data.data.noregistrasi;
                    $scope.model.norec_apd = e.data.data.norec;


                    //##log Pasien Daftar
                    // medifirstService.get("sysadmin/logging/save-log-pendaftaran-pasien?norec_pd="
                    //     +   $scope.resultAPD.norec ).then(function (x) {
                    //     })
                    medifirstService.postLogging('Mutasi Rawat Inap', 'norec pasiendaftar_t', $scope.currentNorec,
                        'Mutasi Rawat Inap ' + ' dengan No Registrasi - ' + noRegistrasis + ' ke Ruangan '
                        + $scope.item.ruangan.namaruangan).then(function (res) {
                        })
                    medifirstService.post('registrasi/update-sep-igd', { norec: $scope.currentNorec }).then(function (z) { })
                    //## end log    

                    var cachePasienDaftar = $scope.currentNorec
                        + "~" + $scope.item.historyPasien.noregistrasi
                        + "~" + $scope.resultAPD.norec;
                    // + "~" + $scope.currentNoCm;
                    cacheHelper.set('CacheRegistrasiPasien', cachePasienDaftar);
                    if ($scope.item.asalRujukan != undefined) {
                        var asalRujukan = { id: "2", asalrujukan: "Rumah sakit" }
                        cacheHelper.set('cacheAsalRujukan', asalRujukan);
                    }


                    if (e.data.status == 201) {
                        $scope.isSimpan = true;
                        $scope.isNext = false;
                        $scope.isBatal = true;
                        $scope.isReport = true;
                        $scope.isReportPendaftaran = true;
                        $scope.isReportRawatInap = true;
                        $scope.isInputAsuransi = true;
                        $scope.isAsuransi = false;
                        $scope.model.generateNoSEP = false;
                    }
                    if ($scope.item.kelompokPasien.kelompokpasien.indexOf('BPJS') > -1) {
                        if (norecPD == '') {

                            $scope.inputPemakaianAsuransi();
                        }
                    } else {
                        window.history.back();
                    }
                      medifirstService.postNonMessage('bridging/bpjs/aplicaresws/update-tt-by-ruangan' ,{'idruangan':$scope.item.ruangan.id,'idkelas':kelasId}).then(function(xx){})

                }, function (error) {
                    // throw error;
                    $scope.isSimpan = false;
                    $scope.isBatal = false;
                })
            }

            $scope.model.generateNoSEP = false;



            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetakLabel = function (tempNoCm) {
                $scope.dats = {
                    qty: 0
                }
                $scope.winDialog.center().open();
            }
            $scope.pilihQty = function (data) {
                var listRawRequired = [
                    "dats.qty|k-ng-model|kuantiti"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var qty = data.qty;
                    if (qty !== undefined) {
                        // var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $state.params.noRegistrasi + "&qty=" + qty);
                        // window.open(fixUrlLaporan, '', 'width=800,height=600')

                        //cetakan langsung service VB6 by grh
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.cacheNoRegistrasi + '&view=false&qty=' + qty, function (response) {
                            // do something with response
                        });

                    }
                    $scope.winDialog.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };

            $scope.cetak = function () {
                if ($scope.model.rawatInap == true) {
                    messageContainer.error("Cetak Antrian hanya untuk rawat jalan")
                    return
                }
                // cetak antrian
                // window.location = configuration.urlPrinting + "registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec + "&X-AUTH-TOKEN=" + modelItem.getAuthorize()
                // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/antrianPasienDiperiksa?noRec=" + tempNoRec);
                //     window.open(fixUrlLaporan, '', 'width=800,height=600')

                //cetakan langsung service VB 6 by grh   
                var client = new HttpClient();

                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    // do something with response
                });

            }
            $scope.cetakGelang = function () {
                if ($scope.item != undefined) {
                    var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/gelangPasien?id=" + $scope.item.pasien.nocmfk);
                    window.open(fixUrlLaporan, '_blank')
                }
            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=' + $scope.cacheNoRegistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.CetakSumList = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + tempNoCm + "&tglRegistrasi=" + new moment(new Date()).format('DD-MM-YYYY'));
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.currentNoCm + '&view=false', function (response) {
                        // do something with response
                    });

                }

            }
            $scope.cetakSEP = function () {
                if ($scope.cacheNoRegistrasi != undefined && $scope.item.kelompokPasien.kelompokpasien !== "Umum/Pribadi") {
                    // var noSep = e.data.data === null ? "2423432" : e.data.data;
                    // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.tracerBon = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $state.params.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }
            $scope.cetakKartu = function () {
                if ($scope.item != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')
                    //cetakan langsung service VB 6 by grh   
                    var client = new HttpClient();
                    // debugger;             
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.item.pasien.nocmfk + '&view=false', function (response) {
                        // do something with response
                    });

                }
            }
            $scope.sourceJenisDiagnosisPrimer = [{
                "statusEnabled": true, "namaExternal": "Diagnosa Awal", "kdProfile": 0, "qJenisDiagnosa": 5,
                "reportDisplay": "Diagnosa Pasca Bedah", "jenisDiagnosa": "Diagnosa Awal", "id": 5, "kodeExternal": "05", "kdJenisDiagnosa": 5, "noRec": "5                               "
            }]

            $scope.cetakBro = function () {               
                var NomorRm = $scope.item.pasien.nocm;
                var kelompokPasien = $scope.item.kelompokPasien.kelompokpasien
                var pegawai = medifirstService.getPegawai();
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.currentNorec + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.item.pasien.umur + '&petugas=' + pegawai.namalengkap + '&view=false', function (response) {
                });
            }
            $scope.cetakRMK = function () {
                var norReg = ""
                if ($scope != undefined) {
                    norReg = "noReg=" + $scope.cacheNoRegistrasi;
                }
                // manageServicePhp.getDataTableTransaksi("operator/get-data-diagnosa-pasien?"
                //     + norReg
                // ).then(function (data) {
                // var dataDiagnosa = data.data.datas[0]

                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }

                var keterangan = "";
                if ($scope.item.keteranganDiagnosis == undefined) {
                    keterangan = "-"
                }
                else {
                    keterangan = $scope.item.keteranganDiagnosis;
                }


                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: "",
                    noregistrasifk: $scope.cacheNorecAPD,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglpendaftaran: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();

                    $scope.cetakBro();
                })
                // });
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
            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                $scope.sourceDiagnosa = data;

            });

            $scope.inputPemakaianAsuransi = function () {
                medifirstService.post('registrasi/update-sep-igd', { 'norec': $scope.currentNorec }).then(function (e) {
                    if ($scope.resultPD != undefined) {
                        $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                            norecPD: $scope.currentNorec,
                            norecAPD: $scope.resultAPD.norec,
                        });
                        var cacheSet = undefined;
                        cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                    }
                    else {
                        $state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
                            norecPD: $scope.currentNorec,
                            norecAPD: $scope.cacheNorecAPD,
                        });
                        var cacheSet = undefined;
                        cacheHelper.set('CachePemakaianAsuransi', cacheSet);
                    }
                })

            }

            $scope.inputTindakan = function () {
                if ($scope.resultPD != undefined) {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.currentNorec,
                        norecAPD: $scope.model.norec_apd

                    });
                }
                else {
                    $state.go('InputTindakanPendaftaran', {
                        norecPD: $scope.cacheNorecPD,
                        norecAPD: $scope.cacheNorecAPD

                    });
                }
            }

            $scope.find = function () {
                $state.go('RegistrasiPasienLama');
            }

            $scope.ringkasanInOut = function () {
                if ($scope.item != undefined) {
                    medifirstService.get("registrasi/daftar-antrian-pasien/get-data-diagnosa-pasien?noReg="
                        + $scope.cacheNoRegistrasi
                    ).then(function (r) {
                        debugger
                        if (r.data.datas.length > 0 && r.data.datas[0].norec_diagnosapasien != null) {
                            $scope.item.norec_apd = r.data.datas[0].norec_apd
                            $scope.cetakBro();
                        } else {
                            $scope.item.jenisDiagnosis = $scope.listJenisDiagnosa[4];
                            $scope.icd10.center().open();
                        }
                    })
                }
            }

            $scope.cetakRMK = function () {
                var norReg = ""
                if ($scope != undefined) {
                    norReg = "noReg=" + $scope.cacheNoRegistrasi;
                }

                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }

                var keterangan = "";
                if ($scope.item.keteranganDiagnosis == undefined) {
                    keterangan = "-"
                } else {
                    keterangan = $scope.item.keteranganDiagnosis;
                }

                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: "",
                    noregistrasifk: $scope.cacheNorecAPD,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglpendaftaran: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
                }
                medifirstService.post('registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
                    $scope.item.keteranganDiagnosis = "";
                    $scope.item.diagnosisPrimer = "";
                    // loadData()
                    $scope.icd10.close();
                    $scope.cetakBro();
                })
            }

            $scope.cetakBro = function () {
                var NomorRm = $scope.item.pasien.nocm;
                var kelompokPasien = $scope.item.kelompokPasien.kelompokpasien
                var pegawai = medifirstService.getPegawai();
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + $scope.cacheNorecAPD + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.item.pasien.umur + '&petugas=' + pegawai.namalengkap + '&view=false', function (response) {
                });
            }

            $scope.cetakGelang = function () {
                var stt = 'false'
                if (confirm('View Lembar Rawat Inap? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.cacheNoRegistrasi + '&view=' + stt + '&qty=' + 1, function (response) {
                        // do something with response
                    });
                }
            }

            $scope.cetakGelangBayi = function () {
                var stt = 'false'
                if (confirm('View Lembar Rawat Inap? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien-bayi=1&norec=' + $scope.cacheNoRegistrasi + '&view=' + stt + '&qty=' + 1, function (response) {
                        // do something with response
                    });
                }
            }

            //** BATAS */
        }
    ]);
});