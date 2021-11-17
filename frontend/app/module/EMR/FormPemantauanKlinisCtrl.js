define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormPemantauanKlinisCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 18008
            var dataLoad = []
            $scope.item.objcbo = []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            $scope.listYaTidak = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 },
            ];


            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
            }

            // var chacePeriode = cacheHelper.get('cacheHeader');
            // if (chacePeriode != undefined) {

            //     chacePeriode.umur = dateHelper.CountAge(new Date(chacePeriode.tgllahir), new Date());
            //     var bln = chacePeriode.umur.month,
            //         thn = chacePeriode.umur.year,
            //         day = chacePeriode.umur.day


            //     chacePeriode.umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
            //     $scope.cc.nocm = chacePeriode.nocm
            //     $scope.cc.namapasien = chacePeriode.namapasien;
            //     $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
            //     $scope.cc.tgllahir = chacePeriode.tgllahir;
            //     $scope.cc.umur = chacePeriode.umur;
            //     $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
            //     $scope.cc.notelepon = chacePeriode.notelepon;

            // }
            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                $scope.cc.alamatlengkap = chacePeriode[15]
                $scope.cc.noidentitas = chacePeriode[19]
                $scope.cc.namaibu = chacePeriode[20]
                $scope.cc.tgllahir = chacePeriode[18]
                $scope.cc.peker = chacePeriode[21]
                $scope.cc.idpeker = chacePeriode[22]
                $scope.cc.nohp = chacePeriode[23]
                $scope.cc.penanggungjawab = chacePeriode[24]
                $scope.cc.hubungankeluargapj = chacePeriode[25]
                $scope.cc.alamatrmh = chacePeriode[26]
                $scope.cc.teleponpenanggungjawab = chacePeriode[27]
                $scope.cc.statuscovidfk = chacePeriode[28]

                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[18000140] = $scope.cc.noidentitas
                $scope.item.obj[18000141] = $scope.cc.tgllahir
                $scope.item.obj[18000143] = $scope.cc.nohp
                $scope.item.obj[18000144] = $scope.cc.peker
                $scope.item.obj[18000145] = new Date()
                // var covids = [2, 3, 4, 5, 13]
                // if ($scope.cc.statuscovidfk == 6) {
                //     $scope.item.obj[18000094] = 2
                // } else if (covids.includes($scope.cc.statuscovidfk)) {
                //     $scope.item.obj[18000094] = 1
                // }



                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "radio") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                    }

                }
            })

            $scope.$watch('item.obj[18000094]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.obj[18000094] == 2) {
                        $scope.listDiagnosa.add({ value: 923390, text: 'U07.1 COVID-19, virus identified' })
                        $scope.item.obj[18000095] = { value: 923390, text: 'U07.1 COVID-19, virus identified' }
                    }
                }
            })

            function SaveDiagnosa() {
                if ($scope.item.obj[18000094] == 2) {
                    if ($scope.item.obj[18000095].value == 923390) {
                        medifirstService.get("emr/get-diagnosapasienbynoreg?noReg="
                            + $scope.cc.noregistrasi + "&norec_apd=" + $scope.cc.norec).then(function (data) {
                                var tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                                var dataICD10 = data.data.datas;
                                var datas = [];
                                var norec_diagnosapasien = "";
                                if (dataICD10.length < 1) {
                                    datas = {
                                        norec_dp: norec_diagnosapasien,
                                        noregistrasifk: $scope.cc.norec,
                                        tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                                        objectdiagnosafk: $scope.item.obj[18000095].value,
                                        objectjenisdiagnosafk: 1,
                                        tglinputdiagnosa: tglinput,
                                        keterangan: null,
                                        kasusbaru: null,
                                        kasuslama: null
                                    }
                                } else {
                                    if (dataICD10[0].norec_diagnosapasien != undefined) {
                                        norec_diagnosapasien = dataICD10[0].norec_diagnosapasien
                                    }
                                    datas = {
                                        norec_dp: norec_diagnosapasien,
                                        noregistrasifk: $scope.cc.norec,
                                        tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                                        objectdiagnosafk: $scope.item.obj[18000095].value,
                                        objectjenisdiagnosafk: 1,
                                        tglinputdiagnosa: tglinput,
                                        keterangan: null,
                                        kasusbaru: null,
                                        kasuslama: null
                                    }
                                }

                                var objSave = {
                                    detaildiagnosapasien: datas,
                                }
                                medifirstService.post('emr/save-diagnosa-pasien', objSave).then(function (e) {

                                })
                            });
                    }
                }
            }

            function PindahPulang() {
                if ($scope.item.obj[18000109] == 2 || $scope.item.obj[18000109] == 3) {
                    medifirstService.get("rawatinap/get-ruangan-last?norec_pd=" + $scope.cc.norec_pd).then(function (a) {
                        $scope.item.ruanganLast = a.data.data[0].objectruanganlastfk
                        if ($scope.item.ruanganLast != undefined) {
                            $state.go('PindahPulangPasien', {
                                norecPD: $scope.cc.norec_pd,
                                norecAPD: $scope.cc.norec
                            });
                            var CachePindah = $scope.item.ruanganLast
                            cacheHelper.set('CachePindah', CachePindah);
                        }
                    })
                }
            }

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'klinis'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'FormPemantauanKlinis' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    $scope.cc.norec_emr = e.data.data.noemr
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    SaveDiagnosa();
                    saveKetKlinis($scope.cc.norec_pd)
                    // PindahPulang();
                });
            }
            function  saveKetKlinis(norecpd) {
                var status = 'HIJAU'
                var arrobj = Object.keys($scope.item.obj)

                for (var i = arrobj.length - 1; i >= 0; i--) {
                  // if (arrobj[i] == '18000151' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                  //   status = 'MERAH'
                  //   break;
                  // } else {
                  if(arrobj[i] == '18000232' && $scope.item.obj[parseInt(arrobj[i])] == 1){
                      status = 'HIJAU'
                      break
                  }
                    if (arrobj[i] == '18000153' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000158' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000157' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000156' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000155' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000154' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000150' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000149' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000148' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                      status = 'KUNING'
                      // break;
                    }
                    if (arrobj[i] == '18000151' && $scope.item.obj[parseInt(arrobj[i])] == 1) {
                        status = 'MERAH'
                        break;
                      }
                  // }
                }

                let json = {
                  norec: norecpd,
                  sttaus: status,
                }
                medifirstService.post('emr/update-ket-klinis', json).then(function (e) {
               
                })

              }
            //**  BATAS */    
        }
    ]);
});