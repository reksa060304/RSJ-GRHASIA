define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RencanaAsuhanGiziRawatInapCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000549
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            var norecEMR = ''
            $scope.isCetak = true

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000549).then(function (e) {
                // debugger
                var datas = e.data.kolom1
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    if (element.namaexternal == 'gaduh')
                        $scope.listData1.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'permusuhan')
                        $scope.listData2.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'ketegangan')
                        $scope.listData3.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'tidakkoperatif')
                        $scope.listData4.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'impuls')
                        $scope.listData5.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                }

            })
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if (cacheNoREC != undefined) {
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
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
            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-pansssingkat&id=' +
                    $scope.cc.nocm + '&emr=' + norecEMR + '&view=true' + '&idemr=' + 3000407,
                    function (response) {
                        // do something with response
                    });
            }

            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

                if (nomorEMR != '-') {
                    cacheHelper.set('cacheEMR_PANEC', nomorEMR)
                }
                $scope.totalSkor = 0
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[9085] = $scope.now
                    $scope.item.obj[3019846] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    $scope.item.obj[3019847] = {
                        value: medifirstService.getPegawaiLogin().id,
                        text: medifirstService.getPegawaiLogin().namaLengkap
                    }
    
                    $scope.item.obj[9086] = {
                        value: $scope.cc.iddpjp,
                        text: $scope.cc.dokterdpjp
                    }
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if (dataLoad[i].emrdfk == '9084')
                                    $scope.totalSkor = parseFloat(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                                //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                //     $scope.getSkor2(datass)
                                // }
                                // // if (dataLoad[i].reportdisplay != null) {
                                // //     var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                // //     $scope.getSkor(datass)
                                // }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = {
                                    value: res[0],
                                    text: res[1]
                                }

                            }
                            // if(dataLoad[i].type == "checkboxtextbox") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                            // }
                            // if(dataLoad[i].type == "textarea") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            // }
                        }

                    }
                })
            }

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
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }



            $scope.listMasalah = [
                {
                    "id" : 1, "nama": "",
                    "detail": [
                        {"id": 3019800, "nama": "Tidak ada masalah gizi ","satuan": "cm","type": "checkbox"},
                        {"id": 3019802, "nama": "Status Gizi ","satuan": "kg","type": "checkbox"},
                        {"id": 3019803, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019804, "nama": "Biokimia","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019805, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019806, "nama": "Fisik Klinis","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019807, "nama": "","type": "textarea"},
                        {"id": 3019808, "nama": "Asupan Makan","type": "checkbox"},
                        {"id": 3019809,"nama": "","type": "textarea"},
                    ]
                }
            ]
            $scope.listDiagnosaGizi = [
                {
                    "id" : 1, "nama": "",
                    "detail": [
                        {"id": 3019810, "nama": "NO - 1.1 Tidak ada diagnosa gizi saat ini ","satuan": "cm","type": "checkbox"},
                        {"id": 3019811, "nama": "NI - 2.1 Ketidakseimbangan asupan oral","satuan": "kg","type": "checkbox"},
                        {"id": 3019812, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019813, "nama": "NI - 2.9 Daya terima makan terbatas","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019814, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019815, "nama": "NI - 5.1 Peningkatan kebutuhan","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019816, "nama": "","type": "textarea"},
                        {"id": 3019817, "nama": "NI - 5.3 Penurunan kebutuhan","type": "checkbox"},
                        {"id": 3019818, "nama": "","type": "textarea"},
                        {"id": 3019819, "nama": "NC - 1.1 Kesulitan menelan","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019820, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019821, "nama": "NC - 1.2 Kesulitan mengunyah","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019822, "nama": "","type": "textarea"},
                        {"id": 3019823, "nama": "NC - 1.4 Gangguan GIT","type": "checkbox"},
                        {"id": 3019824, "nama": "","type": "textarea"},
                        {"id": 3019825, "nama": "NC - 2.2 Perubahan nilai Laboratorium","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019826, "nama": "","satuan": "m","type": "textarea"},
                        {"id": 3019827, "nama": "NC - 3.1 Underweight","satuan": "kg/m²","type": "checkbox"},
                        {"id": 3019828, "nama": "","type": "textarea"},
                        {"id": 3019829, "nama": "NC - 3.3 Obesitas","type": "checkbox"},
                        {"id": 3019830, "nama": "","type": "textarea"},
                        {"id": 3019831, "nama": "NC - 4.1 Malnutrisi","type": "checkbox"},
                        {"id": 3019832, "nama": "","type": "textarea"},
                        {"id": 3019833, "nama": "Lain - lain","type": "checkbox"},
                        {"id": 3019834, "nama": "","type": "textarea"},
                    ]
                }
            ]
            $scope.listIntervensiGizi = [
                {
                    "id" : 1, "nama": "",
                    "detail": [
                        {"id": 3019835, "nama": "Tujuan Diet","type": "textarea"},
                    ]
                },
                {
                    "id" : 2, "nama": "Kebutuhan zat gizi",
                    "detail": [
                        {"id": 3019837, "nama": "Energi ","satuan": "Kka/hr","type": "textbox2"},
                        {"id": 3019838, "nama": "Protein","satuan": "gram/hr","type": "textbox2"},
                        {"id": 3019839, "nama": "Lemak","satuan": "gram/hr","type": "textbox2"},
                        {"id": 3019840, "nama": "KH","satuan": "gram/hr","type": "textbox2"},
                    ]
                },
                {
                    "id" : 3, "nama": "",
                    "detail": [
                        {"id": 3019841, "nama": "Diet","type": "textarea2"},
                        {"id": 3019842, "nama": "Bentuk Diet","type": "textarea2"},
                        {"id": 3019843, "nama": "Rute Diet","type": "textarea2"},
                        {"id": 3019844, "nama": "Frekuensi Diet","type": "textarea2"},
                    ]
                },
            ]
            $scope.listDia
            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.skor)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.skor)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[9084] = $scope.totalSkor //+ $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.getSkor2 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor2 = $scope.totalSkor2 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor2 = $scope.totalSkor2 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }

            function setSkorAkhir(total) {

                if (total < 7) {
                    $scope.item.obj[3149] = true
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = false
                }

                if (total >= 7 && total <= 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = true
                    $scope.item.obj[3151] = false
                }

                if (total > 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = true
                }



            }

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            $scope.Batal = function () {
                $scope.item.obj = []
                $scope.item.obj2 = []
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({
                        id: arrobj[i],
                        values: $scope.item.obj[parseInt(arrobj[i])]
                    })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'RencanaAsuhanGiziRawatInapCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});