define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormMiniTriaseCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 18001
            
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            $scope.listYa = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listTK__OLD = [
                { name: "Normal", id: 1 },
                { name: "Hipertensi gr I", id: 2 },
                { name: "Hipertensi gr II", id: 3 },
                { name: "Krisis Hipertensi", id: 4 }
            ];
            $scope.listTK = [
                { name: "Normal (91-129/61-84 mmHg)", id: 1 },
                { name: "Pre Hipertensi (130-139/85-89 mmHg)", id: 2 },
                { name: "Hipertensi grade I (140-159/90-99 mmHg", id: 3 },
                { name: "Hipertensi grade II (160-179/100-109 mmHg", id: 4 },
                { name: "Krisis Hipertensi (>=180/>=110 mmHg)", id: 5 },
                { name: "Hipertensi (<=90/<=60 mmHg)", id: 6 }
            ];
            $scope.listNadi= [
                { name: "Normal(60-100 x/m)", id: 1 },
                { name: "BradiKardia (<60 x/m)", id: 2 },
                { name: "TachyKardia (>100 x/m)", id: 3 },
            ];
            $scope.listPelayanan= [
                { name: "Lanjut Rawat Tower 4 / Tower 5", id: 1 },
                { name: "Pindah Rawat Tower 6", id: 2 },
                { name: "Rujuk Kefaskes lain", id: 3 }
            ];
            $scope.listSuhu = [
                { name: "Normal ( <37,5 °C)", id: 1 },
                { name: "Demam ( ≥37,5 °C)", id: 2 }
            ];
            $scope.listSpo = [
                { name: "Normal ( ≥ 95 %)", id: 1 },
                { name: "Hipoksia ( < 94 %)", id: 2 }
            ];
            $scope.listPsikologi= [
                { name: "Normal", id: 1 },
                { name: "Gelisah", id: 2 },
                { name: "Acuh", id: 3 },
                { name: "Hiperaktif", id: 4 }
            ];
            $scope.listSosiologi= [
                { name: "Normal", id: 1 },
                { name: "Menarik diri", id: 2 },
            ];
            $scope.listDiagnosa= [
                { name: "Konfirmasi Positif Simtomatik", id: 1 },
                { name: "Konfirmasi Positif Asimtomatik", id: 2 },
            ];
            $scope.listGejala = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 18000001, "nama": "Demam", "type": "checkbox"},
                        { "id": 18000002, "nama": "Batuk Kering", "type": "checkbox"},
                        { "id": 18000003, "nama": "Batuk Berdahak", "type": "checkbox"},
                        { "id": 18000004, "nama": "Sakit Tenggorokan", "type": "checkbox"},
                        { "id": 18000005, "nama": "Pilek", "type": "checkbox"},
                        { "id": 18000006, "nama": "Sesak Napas", "type": "checkbox"},
                        { "id": 18000007, "nama": "Gangguan Penciuman ", "type": "checkbox"},
                        { "id": 18000008, "nama": "Gangguan Pengecapan?", "type": "checkbox"},
                        { "id": 18000009, "nama": "Mulut Kering", "type": "checkbox"},
                        { "id": 18000010, "nama": "Nyeri Otot ", "type": "checkbox"},
                        { "id": 18000011, "nama": "Nyeri Sendi", "type": "checkbox"},
                        { "id": 18000012, "nama": "Lelah", "type": "checkbox"},
                        { "id": 18000013, "nama": "Pusing Atau Sakit Kepala", "type": "checkbox"},
                        { "id": 18000014, "nama": "Nyeri Perut ", "type": "checkbox"},
                        { "id": 18000015, "nama": "Kulit Kemerahan", "type": "checkbox"},
                        { "id": 18000016, "nama": "Mual Muntah", "type": "checkbox"},
                        { "id": 18000017, "nama": "Diare", "type": "checkbox"},
                        { "id": 18000018, "nama": "Tidak Ada Gejala", "type": "checkbox"},
                    ]
                }
            ]
            $scope.listKomorbid = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 18000019, "nama": "Hipertensi", "type": "checkbox"},
                        { "id": 18000020, "nama": "Penyakit Jantung", "type": "checkbox"},
                        { "id": 18000021, "nama": "Penyakit paru Kronis", "type": "checkbox"},
                        { "id": 18000022, "nama": "Diabetes", "type": "checkbox"},
                        { "id": 18000023, "nama": "Kanker", "type": "checkbox"},
                        { "id": 18000024, "nama": "HIV", "type": "checkbox"},
                        { "id": 18000025, "nama": "Asma", "type": "checkbox"},
                        { "id": 18000026, "nama": "Diare", "type": "checkbox"},
                        { "id": 18000027, "nama": "dll", "type": "checkbox"},
                        { "id": 18000028, "nama": "Tidak Ada Komorbid", "type": "checkbox"},
                        { "id": 1800001, "nama": "TBC,", "type": "checkbox"},
                        { "id": 1800002, "nama": "Gangguan Napas lain", "type": "checkbox"},
                        { "id": 1800003, "nama": "Penyat Hati", "type": "checkbox"},
                        { "id": 1800004, "nama": "Gangguan Imun,", "type": "checkbox"},
                        { "id": 1800005, "nama": "Hamil", "type": "checkbox"},
                        { "id": 1800006, "nama": "Penyakit Ginjal", "type": "checkbox"},
                        { "id": 1800007, "nama": "Penyakit Paru ,", "type": "checkbox"},
                        { "id": 1800008, "nama": "Obstruktiv Kronis", "type": "checkbox"},
                        { "id": 1800009, "nama": "DM", "type": "checkbox"},
                        { "id": 1800010, "nama": "Tidak teridentifikasi", "type": "checkbox"}
                        
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
                $scope.cc.tgllahir = chacePeriode [18]
                $scope.cc.peker = chacePeriode[21]
                $scope.cc.idpeker = chacePeriode [22]
                $scope.cc.nohp = chacePeriode [23]
                $scope.cc.penanggungjawab = chacePeriode [24]
                $scope.cc.hubungankeluargapj = chacePeriode[25]
                $scope.cc.alamatrmh = chacePeriode [26]
                $scope.cc.teleponpenanggungjawab = chacePeriode [27]
                $scope.cc.statuscovidfk = chacePeriode [28]

                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false
           // if(nomorEMR!='-'){
           //     cacheHelper.set('cacheEMR_TRIASE_PRIMER_UMUM', nomorEMR)
           // }
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[17000097]=$scope.cc.namapasien
                // $scope.item.obj[17000098] = $scope.cc.peker
                // $scope.item.obj[17000099] = $scope.cc.nohp
                $scope.item.obj[18000033] = 1
                $scope.item.obj[18000034] = 1
                $scope.item.obj[18000029] = 1
                $scope.item.obj[18000030] = 1
                $scope.item.obj[18000031] = 1
                $scope.item.obj[18000032] = 1
                var covids = [2 , 3, 4 ,5 , 13]
                if ( $scope.cc.statuscovidfk == 6) {
                    $scope.item.obj[18000038] = 2
                }else if ( covids.includes($scope.cc.statuscovidfk ) ) {
                    $scope.item.obj[18000038] = 1
                }


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
                            // if (dataLoad[i].emrdfk >= 5046 && dataLoad[i].emrdfk <= 5051 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorNutrisi(datass)
                            // }


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
            
            
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            function PindahPulang() {
                if ($scope.item.obj[18000111] == 2 || $scope.item.obj[18000111] == 3) {
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

            $scope.$watch('item.obj[18000038]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.obj[18000038] == 2 || $scope.item.obj[18000038] == "2") {
                        $scope.item.objDiagnosa = { value: 923390, text: 'U07.1 COVID-19, virus identified' }
                        // $scope.item.obj[18000095] = { value: 923390, text: 'U07.1 COVID-19, virus identified' }
                    }
                }
            })

            function SaveDiagnosa() {
                if ($scope.item.obj[18000038] == 2 || $scope.item.obj[18000038] == "2") {
                    if ($scope.item.objDiagnosa.value == 923390) {
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
                                        objectdiagnosafk: $scope.item.objDiagnosa.value,
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
                                        objectdiagnosafk: $scope.item.objDiagnosa.value,
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

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'covid'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    $scope.cc.norec_emr = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'Formulir triase mini' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                  
                     $rootScope.loadRiwayat()
                     var arrStr = {
                         0: e.data.data.noemr
                     }
                     cacheHelper.set('cacheNomorEMR', arrStr);
                     SaveDiagnosa();
                     PindahPulang();
                });
            }

        }
    ]);
});