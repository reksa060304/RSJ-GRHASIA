define(['initialize'], function (initialize) {
    'use strict';
    // initialize.controller('PindahPulangPasienCtrl', ['$q', '$rootScope', '$scope', '$mdDialog', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'FindPasien', 'ManagePasien', 'ManageServicePhp',
    //     function($q, $rootScope, $scope,  $mdDialog, ModelItem, $state, cacheHelper, dateHelper, FindPasien, ManagePasien, manageServicePhp) {
    initialize.controller('PindahPulangPasienCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.isNext = true;
            var responData = '';
            var norecOrder = '';
            var norecRpp = ''
            $scope.PenyebabKematianManual = false;
            $scope.cacheruanganLast = {};
            $scope.now = new Date();
            $scope.currentNorecPD = $state.params.norecPD;
            // $scope.item.pasien.norec_apd = $state.params.norecAPD;
            $scope.doneLoad = $rootScope.doneLoad;
            $rootScope.isOpen = true;
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm",    //set drop down time format to 24 hours
            };
            $scope.item.tglKeluar = $scope.now;
            $scope.item.tglRencanaKeluar = $scope.now;
            $scope.item.tglMeninggal = $scope.now;
            $scope.listKamar = []
            $scope.listNoBed = []
            firstLoad();
            getdataCombo();
            $scope.noCM = $state.params.noCM;
            $rootScope.showMenu = false;
            $rootScope.showMenuDetail = false;

            function getdataCombo() {

                medifirstService.get("rawatinap/get-combo-pindahpasien")
                    .then(function (e) {
                        for (var i = 0; i < e.data.statuskeluar.length; i++) {
                            e.data.statuskeluar[i].id = parseInt(e.data.statuskeluar[i].id)
                        }

                        $scope.listStatusKeluar = e.data.statuskeluar;
                        $scope.listKondisiPasien = e.data.kondisipasien;
                        // $scope.listKelas=e.data.kelas; 
                        $scope.listStatusPulang = e.data.statuspulang;
                        $scope.listRuangan = e.data.ruanganinap;
                        // $scope.listKamar=e.data.kamar; 
                        $scope.listHubunganKel = e.data.hubungankeluarga;
                        $scope.listPenyebabKematian = e.data.penyebabkematian;

                    })
            }
            function firstLoad() {
                $scope.isRouteLoading = true;
                // var objectruanganlastfk='';
                //  var CachePindah = cacheHelper.get('CachePindah');
                //  if(CachePindah != undefined){
                //     objectruanganlastfk = CachePindah;
                //     $scope.cacheruanganLast=objectruanganlastfk;
                medifirstService.get("rawatinap/get-pasien-bynorec?norec_pd="
                    + $state.params.norecPD
                    + "&norec_apd="
                    + $state.params.norecAPD)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data[0];
                    })

                medifirstService.get("rawatinap/get-nosep-by-norec-pd?norec_pd=" + $state.params.norecPD).then(function (e) {
                    $scope.item.noSep = e.data.nosep;
                })


                //   }
            }

            $scope.pilihRuangan = function (id) {
                var ruanganId = id;
                medifirstService.get("rawatinap/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        $scope.listKelas = dat.data.kelas;
                    });
            }

            $scope.$watch('item.penyebabKematian', function (e) {
                if (e === undefined) return;
                if ($scope.item.penyebabKematian.penyebabkematian == "LAINNYA") {
                    $scope.PenyebabKematianManual = true;
                } else {
                    // $scope.item.penyebabKematian = undefined;
                    $scope.PenyebabKematianManual = false;
                }
            });

            $scope.$watch('item.kelas', function (e) {
                if (e === undefined) return;
                var kelasId = "idKelas=" + $scope.item.kelas.id;
                var ruanganId = "&idRuangan=" + $scope.item.ruangan.id;
                medifirstService.get("registrasi/get-kamarbyruangankelas?" + kelasId + ruanganId)
                    .then(function (b) {
                        $scope.listKamar = b.data.kamar
                        // $scope.listKamar = _.filter(b.data.kamar, function(v) {
                        //     return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                        // })
                    });
            });
            $scope.$watch('item.kamar', function (e) {
                if (e === undefined) return;
                var kamarId = $scope.item.kamar.id;
                medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function (a) {
                        $scope.listNoBed = _.filter(a.data.bed, function (v) {
                            return v.statusbed === "KOSONG";
                        })
                    })
            });

            $scope.Save = function () {


                if (!$scope.item.statusKeluar) {
                    messageContainer.error('Status keluar belum di pilih');
                    return;
                } else if ($scope.item.statusKeluar.id === 2) {
                    $scope.SavePindah()
                } else {
                    if ($scope.item.pasien.objectkelompokpasienlastfk == 11) {
                        messageContainer.error('Status masih rencana rawat');
                        return;
                    }
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Pastikan PELAYANAN sudah di Input semua ! Lanjut Simpan? ')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        var objAkomodasi = {
                            noregistrasi: $scope.item.pasien.noregistrasi
                        }
                        medifirstService.post('rawatinap/save-akomodasi-tea', objAkomodasi).then(function (data) {

                        })
                        $scope.SavePulang();


                    })

                }
            }
            $scope.SavePindah = function () {
                var statusKeluarId = "";
                if ($scope.item.statusKeluar != undefined) {
                    statusKeluarId = $scope.item.statusKeluar.id;
                }

                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id;
                }
                var kelasId = "";
                if ($scope.item.kelas != undefined) {
                    kelasId = $scope.item.kelas.id;
                }
                var kamarIds = null;
                if ($scope.item.kamar != undefined) {
                    kamarIds = $scope.item.kamar.id;
                }

                var nomorTempatTidurs = null;
                if ($scope.item.nomorTempatTidur != undefined) {
                    nomorTempatTidurs = $scope.item.nomorTempatTidur.id;
                }

                var dokterId = "";
                if ($scope.item.dokter != undefined) {
                    dokterId = $scope.item.dokter.id;
                }

                var keterangans = "";
                if ($scope.item.keteranganLainnya != undefined) {
                    keterangans = $scope.item.keteranganLainnya;
                }
                var hubungankeluargaId = "";
                if ($scope.item.hubunganKeluarga != undefined) {
                    hubungankeluargaId = $scope.item.hubunganKeluarga.id;
                }
                var kondisiKeluarId = "";
                if ($scope.item.kondisipasien != undefined) {
                    kondisiKeluarId = $scope.item.kondisipasien.id;
                }
                var penyebabkematianId = "";
                if ($scope.item.penyebabKematian != undefined) {
                    penyebabkematianId = $scope.item.penyebabKematian.id;
                }

                var statusPulangId = "";
                if ($scope.item.statusPulang != undefined) {
                    statusPulangId = $scope.item.statusPulang.id;
                }

                var strukorder = {
                    norecorder: norecOrder,
                    norecrpp: norecRpp,
                    tglorder: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                }

                var pasiendaftar = {
                    tglregistrasi: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    tglregistrasidate: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD'),
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    objectruanganasalfk: $scope.item.pasien.objectruanganlastfk,
                    objectruanganlastfk: ruanganId,
                    objectkelasfk: kelasId,
                    objecthubungankeluargaambilpasienfk: hubungankeluargaId,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    norec_pd: $scope.currentNorecPD,
                    objectkelompokpasienlastfk: $scope.item.pasien.objectkelompokpasienlastfk,
                    nocmfk: $scope.item.pasien.nocmfk,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    statuspasien: $scope.item.pasien.statuspasien,


                }
                var antrianpasiendiperiksa = {
                    tglregistrasi: moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectruanganasalfk: $scope.item.pasien.objectruanganlastfk,
                    objectruanganlastfk: ruanganId,
                    objectkelasfk: kelasId,
                    objectkamarfk: kamarIds,
                    nobed: nomorTempatTidurs,
                    tglmasuk: moment($scope.item.tglRencanaKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    // israwatgabung:  $scope.model.rawatGabung === true ? 1 : 0,
                    objectasalrujukanfk: $scope.item.pasien.objectasalrujukanfk,
                    norec_apd: $scope.item.pasien.norec_apd,
                    keteranganpindah: keterangans,
                    israwatgabung: $scope.item.rawatGabung === true ? 1 : 0,
                }

                var objSave = {
                    strukorder: strukorder,
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }

                // manageServicePhp.saveOrderPindahPasien(objSave).then(function (e) {
                //     $scope.resultAPD=e.data.dataAPD;
                //     responData=e.data;
                //     $scope.isSimpan = true;
                //     $scope.isBatal = true;
                //     $scope.isNext=false;                                             
                // })

                medifirstService.post('rawatinap/save-pindah-pasien', objSave).then(function (e) {
                    $scope.resultAPD = e.data.dataAPD;
                    responData = e.data;
                    $scope.isSimpan = true;
                    $scope.isBatal = true;
                    $scope.isNext = false;
                    //##save Logging user
                    medifirstService.get("sysadmin/logging/save-log-pindah-ruangan?norec_apd="
                        + $scope.resultAPD.norec
                    ).then(function (data) {
                        window.history.back();
                    })
                    medifirstService.postNonMessage('bridging/bpjs/aplicaresws/update-tt-by-ruangan', { 'idruangan': $scope.item.pasien.objectruanganlastfk, 'idkelas': $scope.item.pasien.objectkelasfk }).then(function (xx) { })

                    medifirstService.postNonMessage('bridging/bpjs/aplicaresws/update-tt-by-ruangan', { 'idruangan': ruanganId, 'idkelas': kelasId }).then(function (xx) { })
                    //##end                                         
                })

            }

            $scope.SavePulang = function () {

                // debugger;

                var statusKeluarId = null;
                if ($scope.item.statusKeluar != undefined) {
                    statusKeluarId = $scope.item.statusKeluar.id;
                }

                var ruanganId = null;
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id;
                }

                var hubungankeluargaId = null;
                var hubunganKeluarga = null;
                if ($scope.item.hubunganKeluarga != undefined) {
                    hubungankeluargaId = $scope.item.hubunganKeluarga.id;
                    hubunganKeluarga = $scope.item.hubunganKeluarga.hubungankeluarga;
                }
                var kondisiKeluarId = null;
                var kondisiKeluar = null;
                if ($scope.item.kondisiKeluar != undefined) {
                    kondisiKeluarId = $scope.item.kondisiKeluar.id;
                    kondisiKeluar = $scope.item.kondisiKeluar.kondisipasien
                }
                var PenyebabKematianText = ""
                if ($scope.item.PenyebabKematianText != undefined) {
                    PenyebabKematianText = $scope.item.PenyebabKematianText
                }
                var penyebabkematianId = null;
                if ($scope.item.penyebabKematian != undefined) {
                    penyebabkematianId = $scope.item.penyebabKematian.id;
                }
                var statusPulangId = null;
                if ($scope.item.statusPulang != undefined) {
                    statusPulangId = $scope.item.statusPulang.id;
                }
                var namaPembawaPulang = null;
                if ($scope.item.namaPembawaPulang != undefined) {
                    namaPembawaPulang = $scope.item.namaPembawaPulang;
                }

                var strukorder = {
                    norecorder: norecOrder,
                    norecrpp: norecRpp,
                    tglorder: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                }

                var pasiendaftar = {
                    namalengkapambilpasien: namaPembawaPulang,
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    objectruanganlastfk: ruanganId,
                    objecthubungankeluargaambilpasienfk: hubungankeluargaId,
                    objectkondisipasienfk: kondisiKeluarId,
                    objectpenyebabkematianfk: penyebabkematianId,
                    objectstatuskeluarfk: statusKeluarId,
                    objectstatuspulangfk: statusPulangId,
                    tglmeninggal: moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm:ss'),
                    // tglpulang: moment($scope.item.tglRencanaKeluar).format('YYYY-MM-DD hh:mm:ss'), #yg egi
                    tglpulang: moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss'),
                    norec_pd: $scope.currentNorecPD,
                    objectstatuskeluarrencanafk: statusKeluarId,
                    nocmfk: $scope.item.pasien.nocmfk,
                    keteranganpulang: "Pulang dengan kondisi : " + kondisiKeluar,
                    keterangankematian: PenyebabKematianText

                }
                var antrianpasiendiperiksa = {
                    objectruanganlastfk: $scope.item.pasien.objectruanganlastfk,
                    norec_apd: $scope.item.pasien.norec_apd,

                }
                var objSave = {
                    strukorder: strukorder,
                    pasiendaftar: pasiendaftar,
                    antrianpasiendiperiksa: antrianpasiendiperiksa
                }


                // if (statusKeluarId != 5) {
                //     manageServicePhp.saveOrderPulangPasien(objSave).then(function (e) {
                //         $scope.resultAPD=e.data.dataAPD;
                //         responData=e.data;
                //         $scope.isSimpan = true;
                //         $scope.isBatal = true;
                //         $scope.isNext=false;                                             
                //     });
                // }


                medifirstService.post('rawatinap/save-pulang-pasien', objSave).then(function (e) {
                    if ($scope.item.pasien.israwatinap == 'true' &&  ($scope.item.pasien.kelompokpasien.indexOf('BPJS') > -1 || $scope.item.pasien.kelompokpasien.toUpperCase().indexOf('JKN') > -1 || $scope.item.pasien.kelompokpasien.toUpperCase().indexOf('KEMENKES') > -1)
                        && $scope.item.statusKeluar.id == 1) {
                        $scope.setTglPulangBridging()
                    }
                    // $scope.resultAPD=e.data.dataAPD;
                    responData = e.data;
                    $scope.isSimpan = true;
                    $scope.isBatal = true;
                    $scope.isNext = false;
                    //##save Logging user
                    medifirstService.get("sysadmin/logging/save-log-pulang-pasien?norec_pd="
                        + $scope.currentNorecPD
                    ).then(function (data) {
                        window.history.back();
                    })

                    medifirstService.postNonMessage('bridging/bpjs/aplicaresws/update-tt-by-ruangan', { 'idruangan': $scope.item.pasien.objectruanganlastfk, 'idkelas': $scope.item.pasien.objectkelasfk }).then(function (xx) { })
                    //##end         

                })

            }
            $scope.setTglPulangBridging = function () {
                if($scope.item.noSep == "" || $scope.item.noSep == undefined) return
                let statusPulang = ""
                if ($scope.item.statusPulang != undefined) {
                    statusPulang = $scope.item.statusPulang.kodeexternal
                }
                let noSuratMeninggal = ""
                if (statusPulang == 4) {
                    noSuratMeninggal = $scope.item.pasien.noregistrasi
                }
                let json = {
                    "url": "SEP/2.0/updtglplg",
                    "method": "PUT",
                    "data": {
                        "request": {
                            "t_sep": {
                                "noSep": $scope.item.noSep,
                                "statusPulang": statusPulang,
                                "noSuratMeninggal": noSuratMeninggal,
                                "tglMeninggal": statusPulang == 4 ? moment($scope.item.tglMeninggal).format('YYYY-MM-DD') : "",
                                "tglPulang": new moment(moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD'),
                                "noLPManual": "",
                                "user": medifirstService.getPegawaiLogin().namaLengkap
                            }
                        }
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData != '200') {
                        var dateGenerate = {
                            'data': {
                                "request":
                                {
                                    "t_sep":
                                    {
                                        "noSep": $scope.item.noSep,
                                        "tglPulang": new moment(moment($scope.item.tglKeluar).format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD'),
                                        "user": medifirstService.getPegawaiLogin().namaLengkap
                                    }
                                }

                            }
                        }
                        medifirstService.put('bridging/bpjs/update-tglpulang', dateGenerate).then(function (e) {
                            toastr.info(e.data.metaData.message, 'Set Tgl Pulang BPJS')
                        }).then(function () {

                        });
                    }
                    toastr.info(e.data.metaData.message, 'Set Tgl Pulang BPJS')
                }).then(function () {

                });
            }
            $scope.cekRawatGabung = function (bool) {
                if (bool === true) {
                    if ($scope.item.pasien.id_ibu != undefined) {
                        medifirstService.get("rawatinap/get-kamar-ruangan-ibu?id_ibu=" + $scope.item.pasien.id_ibu
                            + "&nocm=" + $scope.item.pasien.nocm)
                            .then(function (dat) {
                                if (dat.data.length > 0) {
                                    $scope.listKamar = []
                                    $scope.listNoBed = []
                                    $scope.ruanganIbu = dat.data[0];
                                    $scope.listKamar.push({ id: dat.data[0].objectkamarfk, namakamar: dat.data[0].namakamar })
                                    $scope.listNoBed.push({ id: dat.data[0].nobed, reportdisplay: dat.data[0].tempattidur })
                                    $scope.item.ruangan = { id: dat.data[0].objectruanganlastfk, namaruangan: dat.data[0].namaruangan }
                                    $scope.item.kelas = { id: dat.data[0].kelasfk, namakelas: dat.data[0].namakelas }
                                    $scope.item.kamar = { id: dat.data[0].objectkamarfk, namakamar: dat.data[0].namakamar }
                                    $scope.item.nomorTempatTidur = { id: dat.data[0].nobed, reportdisplay: dat.data[0].tempattidur }

                                }

                            })

                    }
                }
            }

            $scope.Back = function () {
                window.history.back()
            }
            $scope.getKondisiKeluar = function(){
                if ($scope.item.statusPulang.id == 9) {
                    $scope.listKondisiPasien = [
                        {
                            id: 5,
                            kondisipasien: "Meninggal < 48 jam"
                        },
                        {
                            id: 6,
                            kondisipasien: "Meninggal > 48 jam"
                        }
                    ]
                }else{
                    $scope.listKondisiPasien = [{
                            "id": 9,
                            "kondisipasien": "Belum Sembuh"
                        },
                        // {
                        //     "id": 5,
                        //     "kondisipasien": "Meninggal < 48 jam"
                        // },
                        // {
                        //     "id": 6,
                        //     "kondisipasien": "Meninggal > 48 jam"
                        // },
                        {
                            "id": 10,
                            "kondisipasien": "Perbaikan"
                        },
                        {
                            "id": 8,
                            "kondisipasien": "Sembuh"
                        }
                    ]
                }
            }
            // $scope.$watch('item.statusPulang', function (e) {
                
            // })
            //End
        }
    ]);
});