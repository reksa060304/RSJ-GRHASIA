define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormPDRCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 18006
            var dataLoad = []
            $scope.item.objcbo = []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            $scope.listWarnaUrine = [
                { name: "Very Good", id: 1 },
                { name: "Good", id: 2 },
                { name: "Fair", id: 3 },
                { name: "Light Dehydrated", id: 4 },
                { name: "Dehydrated", id: 5 },
                { name: "Very Dehdrated", id: 6 },
                { name: "Severe Dehdrated", id: 7 }
            ];

            
            $scope.listGejala = [
                {
                    "id": 1, "nama": "",
                    "detail": [

                        { "id": 18000039, "nama": "Demam", "type": "checkbox" },
                        { "id": 18000040, "nama": "Batuk Kering", "type": "checkbox" },
                        { "id": 18000041, "nama": "Batuk Berdahak", "type": "checkbox" },
                        { "id": 18000042, "nama": "Sakit Tenggorokan", "type": "checkbox" },
                        { "id": 18000043, "nama": "Pilek", "type": "checkbox" },
                        { "id": 18000044, "nama": "Sesak Napas", "type": "checkbox" },
                        { "id": 18000045, "nama": "Gangguan Penciuman ", "type": "checkbox" },
                        { "id": 18000046, "nama": "Gangguan Pengecapan?", "type": "checkbox" },
                        { "id": 18000047, "nama": "Mulut Kering", "type": "checkbox" },
                        { "id": 18000048, "nama": "Nyeri Otot ", "type": "checkbox" },
                        { "id": 18000049, "nama": "Nyeri Sendi", "type": "checkbox" },
                        { "id": 18000050, "nama": "Lelah", "type": "checkbox" },
                        { "id": 18000051, "nama": "Pusing Atau Sakit Kepala", "type": "checkbox" },
                        { "id": 18000052, "nama": "Nyeri Perut ", "type": "checkbox" },
                        { "id": 18000053, "nama": "Kulit Kemerahan", "type": "checkbox" },
                        { "id": 18000054, "nama": "Mual Muntah", "type": "checkbox" },
                        { "id": 18000055, "nama": "Diare", "type": "checkbox" },
                        { "id": 18000056, "nama": "Tidak Ada Gejala", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listAbdomen = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 18000081, "nama": "Inspeksi", "type": "textbox" },
                        { "id": 18000082, "nama": "Palpasi ", "type": "textbox" },
                        { "id": 18000083, "nama": "Perkusi", "type": "textbox" },
                        { "id": 18000084, "nama": "Auskultasi", "type": "textbox" },

                    ]
                }
            ]

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
                // $scope.item.obj[18000059] = 1
                // $scope.item.obj[18000060] = 1
                // $scope.item.obj[18000061] = 1
                // $scope.item.obj[18000062] = 
                $scope.item.obj[18000133]=$scope.now
                $scope.item.obj[18000135]=$scope.now
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
                            if (dataLoad[i].emrdfk >= 5046 && dataLoad[i].emrdfk <= 5051 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


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
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'pdr'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Formulir Poli UMUM' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    $scope.cc.norec_emr = e.data.data.noemr
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    SaveDiagnosa();
                    // PindahPulang();
                });
            }
            //**  BATAS */    
        }
    ]);
});