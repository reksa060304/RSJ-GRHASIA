define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkategorianPasienJiwaCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 501
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
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 501).then(function (e) {
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
                    $scope.cc.nocm + '&emr=' + norecEMR + '&view=true' + '&idemr=' + 501,
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
                if ($scope.item.obj[501005] == true){
                    a1 = 0
                } 
                 else if ($scope.item.obj[501005] == false) {
                    a1 = 0
                    $scope.item.obj[501005] = undefined
                }
                
                if ($scope.item.obj[501006] == true) {
                    a1 = 16
                } 
                 else if ($scope.item.obj[501006] == false) {
                    a1 = 0
                    $scope.item.obj[501006] = undefined
                }

                if ($scope.item.obj[501007] == true){
                    a1 = 34
                } 
                 else if ($scope.item.obj[501007] == false) {
                    a1 = 0
                    $scope.item.obj[501007] = undefined
                }

                if ($scope.item.obj[501008] == true) {
                    a1 = 50
                } 
                 else if ($scope.item.obj[501008] == false) {
                    a1 = 0
                    $scope.item.obj[501008] = undefined
                }
                //Komunikasi
                if ($scope.item.obj[501009] == true) {
                    a2 = 0
                    
                } 
                 else if ($scope.item.obj[501009] == false) {
                    a2 = 0
                    $scope.item.obj[501009] = undefined
                }
                if ($scope.item.obj[501010] == true) {
                    a2 = 14
                } 
                 else if ($scope.item.obj[501010] == false) {
                    a2 = 0
                    $scope.item.obj[501010] = undefined
                }
                if ($scope.item.obj[501011] == true) {
                    a2 = 26
                } 
                 else if ($scope.item.obj[501011] == false) {
                    a2 = 0
                    $scope.item.obj[501011] = undefined
                }
                if ($scope.item.obj[501012] == true) {
                    a2 = 40
                } 
                 else if ($scope.item.obj[501012] == false) {
                    a2 = 0
                    $scope.item.obj[501012] = undefined
                }

                //Interaksi Sosial
                if ($scope.item.obj[501013] == true) {
                    a3 = 0
                } 
                 else if ($scope.item.obj[501013] == false) {
                    a3 = 0
                    $scope.item.obj[501013] = undefined
                }
                if ($scope.item.obj[501014] == true) {
                    a3 = 5
                } 
                 else if ($scope.item.obj[501014] == false) {
                    a3 = 0
                    $scope.item.obj[501014] = undefined
                }
                if ($scope.item.obj[501015] == true) {
                    a3 = 10
                } 
                 else if ($scope.item.obj[501015] == false) {
                    a3 = 0
                    $scope.item.obj[501015] = undefined
                }
                if ($scope.item.obj[501016] == true) {
                    a3 = 15
                } 
                 else if ($scope.item.obj[501016] == false) {
                    a3 = 0
                    $scope.item.obj[501016] = undefined
                }
                //Pemenuhan ADL makan
                if ($scope.item.obj[501017] == true) {
                    a4makan = 0
                } 
                 else if ($scope.item.obj[501017] == false) {
                    a4makan = 0
                    $scope.item.obj[501017] = undefined
                }
                if ($scope.item.obj[501020] == true) {
                    a4makan = 3
                } 
                 else if ($scope.item.obj[501020] == false) {
                    a4makan = 0
                    $scope.item.obj[501020] = undefined
                }
                if ($scope.item.obj[501023] == true) {
                    a4makan = 7
                } 
                 else if ($scope.item.obj[501023] == false) {
                    a4makan = 0
                    $scope.item.obj[501023] = undefined
                }
                if ($scope.item.obj[501026] == true) {
                    a4makan = 10
                } 
                 else if ($scope.item.obj[501026] == false) {
                    a4makan = 0
                    $scope.item.obj[501026] = undefined
                }

                //Pemenuhan ADL mandi
                if ($scope.item.obj[501018] == true) {
                    a4mandi = 0
                } 
                 else if ($scope.item.obj[501018] == false) {
                    a4mandi = 0
                    $scope.item.obj[501018] = undefined
                }
                if ($scope.item.obj[501021] == true) {
                    a4mandi = 3
                } 
                 else if ($scope.item.obj[501021] == false) {
                    a4mandi = 0
                    $scope.item.obj[501021] = undefined
                }
                if ($scope.item.obj[501024] == true) {
                    a4mandi = 7
                } 
                 else if ($scope.item.obj[501024] == false) {
                    a4mandi = 0
                    $scope.item.obj[501024] = undefined
                }
                if ($scope.item.obj[501027] == true) {
                    a4mandi = 10
                } 
                 else if ($scope.item.obj[501027] == false) {
                    a4mandi = 0
                    $scope.item.obj[501027] = undefined
                }
                //Pemenuhan ADL Berpakaian
                if ($scope.item.obj[501019] == true) {
                    a4berpakaian = 0
                } 
                 else if ($scope.item.obj[501019] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[501019] = undefined
                }
                if ($scope.item.obj[501022] == true) {
                    a4berpakaian = 3
                } 
                 else if ($scope.item.obj[501022] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[501022] = undefined
                }
                if ($scope.item.obj[501025] == true) {
                    a4berpakaian = 7
                } 
                 else if ($scope.item.obj[501025] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[501025] = undefined
                }
                if ($scope.item.obj[501028] == true) {
                    a4berpakaian = 10
                } 
                 else if ($scope.item.obj[501028] == false) {
                    a4berpakaian = 0
                    $scope.item.obj[501028] = undefined
                }

                //Tidur / istirahat
                if ($scope.item.obj[501029] == true) {
                    a5 = 0
                } 
                 else if ($scope.item.obj[501029] == false) {
                    a5 = 0
                    $scope.item.obj[501029] = undefined
                }
                if ($scope.item.obj[501030] == true) {
                    a5 = 3
                } 
                 else if ($scope.item.obj[501030] == false) {
                    a5 = 0
                    $scope.item.obj[501030] = undefined
                }
                if ($scope.item.obj[501031] == true) {
                    a5 = 7
                } 
                 else if ($scope.item.obj[501031] == false) {
                    a5 = 0
                    $scope.item.obj[501031] = undefined
                }
                if ($scope.item.obj[501032] == true) {
                    a5 = 10
                } 
                 else if ($scope.item.obj[501032] == false) {
                    a5 = 0
                    $scope.item.obj[501032] = undefined
                }

                //Pengobatan Oral / injeksi
                if ($scope.item.obj[501033] == true) {
                    a6 = 0
                } 
                 else if ($scope.item.obj[501033] == false) {
                    a6 = 0
                    $scope.item.obj[501033] = undefined
                }
                if ($scope.item.obj[501034] == true) {
                    a6 = 3
                } 
                 else if ($scope.item.obj[501034] == false) {
                    a6 = 0
                    $scope.item.obj[501034] = undefined
                }
                if ($scope.item.obj[501035] == true) {
                    a6 = 7
                } 
                 else if ($scope.item.obj[501035] == false) {
                    a6 = 0
                    $scope.item.obj[501035] = undefined
                }
                if ($scope.item.obj[501036] == true) {
                    a6 = 10
                } 
                 else if ($scope.item.obj[501036] == false) {
                    a6 = 0
                    $scope.item.obj[501036] = undefined
                }

                //Aktivitas Terjadwal makan
                if ($scope.item.obj[501037] == true) {
                    a7makan = 0
                }
                
                if($scope.item.obj[501037] == false) {
                    a7makan = 0
                    $scope.item.obj[501037] = undefined
                }
                if ($scope.item.obj[501040] == true) {
                    a7makan = 3
                } 
                 else if ($scope.item.obj[501040] == false) {
                    a7makan = 0
                    $scope.item.obj[501040] = undefined
                }
                if ($scope.item.obj[501043] == true) {
                    a7makan = 7
                } 
                 else if ($scope.item.obj[501043] == false) {
                    a7makan = 0
                    $scope.item.obj[501043] = undefined
                }
                if ($scope.item.obj[501046] == true) {
                    a7makan = 10
                }
                
                if ($scope.item.obj[501046] == false) {
                    a7makan = 0
                    $scope.item.obj[501046] = undefined
                }

                //Aktivitas Terjadwal mandi
                if ($scope.item.obj[501038] == true) {
                    a7mandi = 0
                } 
                 else if ($scope.item.obj[501038] == false) {
                    a7mandi = 0
                    $scope.item.obj[501038] = undefined
                }
                if ($scope.item.obj[501041] == true) {
                    a7mandi = 3
                } 
                 else if ($scope.item.obj[501041] == false) {
                    a7mandi = 0
                    $scope.item.obj[501041] = undefined
                }
                if ($scope.item.obj[501044] == true) {
                    a7mandi = 7
                } 
                 else if ($scope.item.obj[501044] == false) {
                    a7mandi = 0
                    $scope.item.obj[501044] = undefined
                }
                if ($scope.item.obj[501047] == true) {
                    a7mandi = 10
                } 
                 else if ($scope.item.obj[501047] == false) {
                    a7mandi = 0
                    $scope.item.obj[501047] = undefined
                }
                //Aktivitas Terjadwal berpakaian
                if ($scope.item.obj[501039] == true) {
                    a7berpakaian = 0
                } 
                 else if ($scope.item.obj[501039] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[501039] = undefined
                }
                if ($scope.item.obj[501042] == true) {
                    a7berpakaian = 3
                } 
                 else if ($scope.item.obj[501042] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[501042] = undefined
                }
                if ($scope.item.obj[501045] == true) {
                    a7berpakaian = 7
                } 
                 else if ($scope.item.obj[501045] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[501045] = undefined
                }
                if ($scope.item.obj[501048] == true) {
                    a7berpakaian = 10
                } 
                 else if ($scope.item.obj[501048] == false) {
                    a7berpakaian = 0
                    $scope.item.obj[501048] = undefined
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
                $scope.item.obj[501049] = parseInt(a1) + parseInt(a2) + parseInt(a3) + parseInt(a4makan) + 
                parseInt(a4mandi) + parseInt(a4berpakaian) + 
                parseInt(a5) + parseInt(a6) + parseInt(a7makan) + parseInt(a7mandi) + parseInt(a7berpakaian)
                if ($scope.item.obj[501049] >= 120) {
                    $scope.item.obj[501050] = true
                    $scope.item.obj[501058] = false
                    $scope.item.obj[501051] = false
                    $scope.item.obj[501052] = false
                } else if ($scope.item.obj[501049] >= 60 && $scope.item.obj[501049] <= 119) {
                    $scope.item.obj[501050] = false
                    $scope.item.obj[501058] = true
                    $scope.item.obj[501051] = false
                    $scope.item.obj[501052] = false
                } else if ($scope.item.obj[501049] >= 31 && $scope.item.obj[501049] <= 59) {
                    $scope.item.obj[501050] = false
                    $scope.item.obj[501058] = false
                    $scope.item.obj[501051] = true
                    $scope.item.obj[501052] = false
                } else if ($scope.item.obj[501049] >= 0 && $scope.item.obj[501049] <= 30) {
                    $scope.item.obj[501050] = false
                    $scope.item.obj[501058] = false
                    $scope.item.obj[501051] = false
                    $scope.item.obj[501052] = true
                }
                $scope.totalSkor //+ $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }



            // $scope.getSkor = function (stat) {

            //     var arrobj = Object.keys($scope.item.obj)
            //     var arrSave = []
            //     for (var i = arrobj.length - 1; i >= 0; i--) {
            //         if (arrobj[i] == stat.id) {
            //             if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
            //                 $scope.totalSkor = $scope.totalSkor + parseFloat(stat.skor)
            //                 break
            //             } else {
            //                 $scope.totalSkor = $scope.totalSkor - parseFloat(stat.skor)
            //                 break
            //             }


            //         } else {

            //         }
            //     }
            //     $scope.item.obj[9084] = $scope.totalSkor //+ $scope.totalSkor2
            //     // setSkorAkhir($scope.item.obj[3152])
            // }
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
                        'PengkategorianPasienJiwaCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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