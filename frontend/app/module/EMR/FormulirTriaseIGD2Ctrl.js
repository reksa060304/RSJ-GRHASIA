define(['initialize','Configuration'], function (initialize,configuration) {
    'use strict';
    initialize.controller('FormulirTriaseIGD2Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000403
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            var norecEMR = ''
            $scope.isCetak = false
            $scope.isCetakV = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000403).then(function (e) {
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
                    $scope.cc.nocm + '&emr=' + norecEMR + '&view=true' + '&idemr=' + 3000403,
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



            var a1 = 0, a2=0, a3=0, 
            a4makan=0,a4mandi=0, a4berpakaian=0, 
            a5=0,a6=0, a7makan=0,a7mandi=0, a7berpakaian=0
            $scope.getSkor = function () {
                //Menciderai diri / orang lain
                if ($scope.item.obj[30006318] == true){
                    a1 = 0
                } 
                 else if ($scope.item.obj[30006318] == false) {
                    a1 = 0
                    $scope.item.obj[30006318] = undefined
                }
                
                if ($scope.item.obj[30006319] == true) {
                    a1 = 16
                } 
                 else if ($scope.item.obj[30006319] == false) {
                    a1 = 0
                    $scope.item.obj[30006319] = undefined
                }

                if ($scope.item.obj[30006320] == true){
                    a1 = 34
                } 
                 else if ($scope.item.obj[30006320] == false) {
                    a1 = 0
                    $scope.item.obj[30006320] = undefined
                }

                if ($scope.item.obj[30006321] == true) {
                    a1 = 50
                } 
                 else if ($scope.item.obj[30006321] == false) {
                    a1 = 0
                    $scope.item.obj[30006321] = undefined
                }
                //Komunikasi
                if ($scope.item.obj[30006322] == true) {
                    a2 = 0
                    
                } 
                 else if ($scope.item.obj[30006322] == false) {
                    a2 = 0
                    $scope.item.obj[30006322] = undefined
                }
                if ($scope.item.obj[30006323] == true) {
                    a2 = 14
                } 
                 else if ($scope.item.obj[30006323] == false) {
                    a2 = 0
                    $scope.item.obj[30006323] = undefined
                }
                if ($scope.item.obj[30006324] == true) {
                    a2 = 26
                } 
                 else if ($scope.item.obj[30006324] == false) {
                    a2 = 0
                    $scope.item.obj[30006324] = undefined
                }
                if ($scope.item.obj[30006325] == true) {
                    a2 = 40
                } 
                 else if ($scope.item.obj[30006325] == false) {
                    a2 = 0
                    $scope.item.obj[30006325] = undefined
                }

                //Interaksi Sosial
                if ($scope.item.obj[30006326] == true) {
                    a3 = 0
                } 
                 else if ($scope.item.obj[30006326] == false) {
                    a3 = 0
                    $scope.item.obj[30006326] = undefined
                }
                if ($scope.item.obj[30006327] == true) {
                    a3 = 5
                } 
                 else if ($scope.item.obj[30006327] == false) {
                    a3 = 0
                    $scope.item.obj[30006327] = undefined
                }
                if ($scope.item.obj[30006328] == true) {
                    a3 = 10
                } 
                 else if ($scope.item.obj[30006328] == false) {
                    a3 = 0
                    $scope.item.obj[30006328] = undefined
                }
                if ($scope.item.obj[30006329] == true) {
                    a3 = 15
                } 
                 else if ($scope.item.obj[30006329] == false) {
                    a3 = 0
                    $scope.item.obj[30006329] = undefined
                }
                //Pemenuhan ADL makan
                if ($scope.item.obj[30006330] == true) {
                    a4makan = 0
                } 
                 else if ($scope.item.obj[30006330] == false) {
                    a4makan = 0
                    $scope.item.obj[30006330] = undefined
                }
                if ($scope.item.obj[30006333] == true) {
                    a4makan = 3
                } 
                 else if ($scope.item.obj[30006333] == false) {
                    a4makan = 0
                    $scope.item.obj[30006333] = undefined
                }
                if ($scope.item.obj[30006336] == true) {
                    a4makan = 7
                } 
                 else if ($scope.item.obj[30006336] == false) {
                    a4makan = 0
                    $scope.item.obj[30006336] = undefined
                }
                if ($scope.item.obj[30006339] == true) {
                    a4makan = 10
                } 
                 else if ($scope.item.obj[30006339] == false) {
                    a4makan = 0
                    $scope.item.obj[30006339] = undefined
                }

                //Pemenuhan ADL mandi
                if ($scope.item.obj[30006331] == true) {
                    a4mandi = 0
                } 
                 else if ($scope.item.obj[30006331] == false) {
                    a4mandi = 0
                    $scope.item.obj[30006331] = undefined
                }
                if ($scope.item.obj[30006334] == true) {
                    a4mandi = 3
                } 
                 else if ($scope.item.obj[30006334] == false) {
                    a4mandi = 0
                    $scope.item.obj[30006334] = undefined
                }
                if ($scope.item.obj[30006337] == true) {
                    a4mandi = 7
                } 
                 else if ($scope.item.obj[30006337] == false) {
                    a4mandi = 0
                    $scope.item.obj[30006337] = undefined
                }
                if ($scope.item.obj[30006340] == true) {
                    a4mandi = 10
                } 
                 else if ($scope.item.obj[30006340] == false) {
                    a4mandi = 0
                    $scope.item.obj[30006340] = undefined
                }
                //Pemenuhan ADL Berpakaian
                if ($scope.item.obj[30006332] == true) {
                    a4berpakaian = 0
                } 
                 else if ($scope.item.obj[30006332] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[30006332] = undefined
                }
                if ($scope.item.obj[30006335] == true) {
                    a4berpakaian = 3
                } 
                 else if ($scope.item.obj[30006335] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[30006335] = undefined
                }
                if ($scope.item.obj[30006338] == true) {
                    a4berpakaian = 7
                } 
                 else if ($scope.item.obj[30006338] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[30006338] = undefined
                }
                if ($scope.item.obj[30006341] == true) {
                    a4berpakaian = 10
                } 
                 else if ($scope.item.obj[30006341] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[30006341] = undefined
                }

                //Tidur / istirahat
                if ($scope.item.obj[30006342] == true) {
                    a5 = 0
                } 
                 else if ($scope.item.obj[30006342] == false) {
                    a5 = 0
                    $scope.item.obj[30006342] = undefined
                }
                if ($scope.item.obj[30006343] == true) {
                    a5 = 3
                } 
                 else if ($scope.item.obj[30006343] == false) {
                    a5 = 0
                    $scope.item.obj[30006343] = undefined
                }
                if ($scope.item.obj[30006344] == true) {
                    a5 = 7
                } 
                 else if ($scope.item.obj[30006344] == false) {
                    a5 = 0
                    $scope.item.obj[30006344] = undefined
                }
                if ($scope.item.obj[30006345] == true) {
                    a5 = 10
                } 
                 else if ($scope.item.obj[30006345] == false) {
                    a5 = 0
                    $scope.item.obj[30006345] = undefined
                }

                //Pengobatan Oral / injeksi
                if ($scope.item.obj[30006346] == true) {
                    a6 = 0
                } 
                 else if ($scope.item.obj[30006346] == false) {
                    a6 = 0
                    $scope.item.obj[30006346] = undefined
                }
                if ($scope.item.obj[30006347] == true) {
                    a6 = 3
                } 
                 else if ($scope.item.obj[30006347] == false) {
                    a6 = 0
                    $scope.item.obj[30006347] = undefined
                }
                if ($scope.item.obj[30006348] == true) {
                    a6 = 7
                } 
                 else if ($scope.item.obj[30006348] == false) {
                    a6 = 0
                    $scope.item.obj[30006348] = undefined
                }
                if ($scope.item.obj[30006349] == true) {
                    a6 = 10
                } 
                 else if ($scope.item.obj[30006349] == false) {
                    a6 = 0
                    $scope.item.obj[30006349] = undefined
                }

                //Aktivitas Terjadwal makan
                if ($scope.item.obj[30006350] == true) {
                    a7makan = 0
                }
                
                if($scope.item.obj[30006350] == false) {
                    a7makan = 0
                    $scope.item.obj[30006350] = undefined
                }
                if ($scope.item.obj[30006353] == true) {
                    a7makan = 3
                } 
                 else if ($scope.item.obj[30006353] == false) {
                    a7makan = 0
                    $scope.item.obj[30006353] = undefined
                }
                if ($scope.item.obj[30006356] == true) {
                    a7makan = 7
                } 
                 else if ($scope.item.obj[30006356] == false) {
                    a7makan = 0
                    $scope.item.obj[30006356] = undefined
                }
                if ($scope.item.obj[30006359] == true) {
                    a7makan = 10
                }
                
                if ($scope.item.obj[30006359] == false) {
                    a7makan = 0
                    $scope.item.obj[30006359] = undefined
                }

                //Aktivitas Terjadwal mandi
                if ($scope.item.obj[30006351] == true) {
                    a7mandi = 0
                } 
                 else if ($scope.item.obj[30006351] == false) {
                    a7mandi = 0
                    $scope.item.obj[30006351] = undefined
                }
                if ($scope.item.obj[30006354] == true) {
                    a7mandi = 3
                } 
                 else if ($scope.item.obj[30006354] == false) {
                    a7mandi = 0
                    $scope.item.obj[30006354] = undefined
                }
                if ($scope.item.obj[30006357] == true) {
                    a7mandi = 7
                } 
                 else if ($scope.item.obj[30006357] == false) {
                    a7mandi = 0
                    $scope.item.obj[30006357] = undefined
                }
                if ($scope.item.obj[30006360] == true) {
                    a7mandi = 10
                } 
                 else if ($scope.item.obj[30006360] == false) {
                    a7mandi = 0
                    $scope.item.obj[30006360] = undefined
                }
                //Aktivitas Terjadwal berpakaian
                if ($scope.item.obj[30006352] == true) {
                    a7berpakaian = 0
                } 
                 else if ($scope.item.obj[30006352] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[30006352] = undefined
                }
                if ($scope.item.obj[30006355] == true) {
                    a7berpakaian = 3
                } 
                 else if ($scope.item.obj[30006355] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[30006355] = undefined
                }
                if ($scope.item.obj[30006358] == true) {
                    a7berpakaian = 7
                } 
                 else if ($scope.item.obj[30006358] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[30006358] = undefined
                }
                if ($scope.item.obj[30006361] == true) {
                    a7berpakaian = 10
                } 
                 else if ($scope.item.obj[30006361] == false) {
                    a7berpakaian = 10
                    $scope.item.obj[30006361] = undefined
                }
                // var arrobj = Object.keys($scope.item.obj)
                // var arrSave = []
                // for (var i = arrobj.length - 1; i >= 0; i--) {
                //     if (arrobj[i] == stat.id) {
                //         if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                //             $scope.totalSkor = $scope.totalSkor + parseFloat(stat.skor)
                //             break
                //         } else {
                //             $scope.totalSkor = $scope.totalSkor - parseFloat(stat.skor)
                //             break
                //         }


                //     } else {

                //     }
                // }
                $scope.item.obj[30006362] = parseInt(a1) + parseInt(a2) + parseInt(a3) + parseInt(a4makan) + 
                parseInt(a4mandi) + parseInt(a4berpakaian) + 
                parseInt(a5) + parseInt(a6) + parseInt(a7makan) + parseInt(a7mandi) + parseInt(a7berpakaian)
                if ($scope.item.obj[30006362] >= 120) {
                    $scope.item.obj[30006363] = true
                    $scope.item.obj[30006364] = false
                    $scope.item.obj[30006365] = false
                    $scope.item.obj[30006366] = false
                } else if ($scope.item.obj[30006362] >= 60 && $scope.item.obj[30006362] <= 119) {
                    $scope.item.obj[30006363] = false
                    $scope.item.obj[30006364] = true
                    $scope.item.obj[30006365] = false
                    $scope.item.obj[30006366] = false
                } else if ($scope.item.obj[30006362] >= 31 && $scope.item.obj[30006362] <= 59) {
                    $scope.item.obj[30006363] = false
                    $scope.item.obj[30006364] = false
                    $scope.item.obj[30006365] = true
                    $scope.item.obj[30006366] = false
                } else if ($scope.item.obj[30006362] >= 0 && $scope.item.obj[30006362] <= 30) {
                    $scope.item.obj[30006363] = false
                    $scope.item.obj[30006364] = false
                    $scope.item.obj[30006365] = false
                    $scope.item.obj[30006366] = true
                }
                $scope.totalSkor //+ $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.getKeinginan = function(){
                if ($scope.item.obj[30006316] == true){
                    $scope.item.obj[30006363] = true
                } else{
                    $scope.item.obj[30006363] = false
                }
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
                $scope.item.obj[30006362] = $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
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
                        'Formulir Triase IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }
            $scope.cetakBlade = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }
                // if ($scope.item.obj[3003998] != undefined) {
                //     $scope.listPegawai.add($scope.item.obj[3003998])
                //     $scope.item.pegawai = $scope.item.obj[3003998]
                // }
                // if (pegawai == undefined) {
                //     return
                // }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-triaseigd?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    // '&isttd=true' +
                    // '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd, '_blank');
            }
            $scope.ttdElek = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }

                // var confirm = $mdDialog.confirm()
                //   .title('Info')
                //   .textContent('Yakin mau tanda tangani dokumen ini ? ')
                //   .ariaLabel('Lucky day')
                //   .cancel('Tidak')
                //   .ok('Ya')
                // $mdDialog.show(confirm).then(function () {

                if ($scope.item.obj[3003998] != undefined) {
                    $scope.listPegawai.add($scope.item.obj[3003998])
                    $scope.item.pegawai = $scope.item.obj[3003998]
                }
                $scope.winDialog.center().open()
                // })
            }
            $scope.savePengajuanTTE = function (pegawai) {
                if (pegawai == undefined) {
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                $scope.isRouteLoading = true
                medifirstService.get('report/get-cetak-suratketerangandokter?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    '&isttd=true' +
                    '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd
                ).then(function (e) {
                    if (e.data.status == 201) {
                        toastr.success(e.data.message)
                        $scope.winDialog.close()
                    } else {
                        toastr.error(e.data.message)
                    }
                    $scope.isRouteLoading = false

                })
            }

        }
    ]);
});