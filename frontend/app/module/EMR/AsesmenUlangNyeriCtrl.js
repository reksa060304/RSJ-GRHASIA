define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenUlangNyeriCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            var paramsIndex = $state.params.index ? parseInt($state.params.index) : null;

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000444
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            $scope.listData6 = []
            $scope.listData7 = []
            $scope.listData8 = []
            $scope.listData9 = []
            $scope.listData10 = []

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000444).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga3 = []
                var arrayShiftJaga4 = []
                var arrayShiftJaga5 = []
                var arrayShiftJaga6 = []
                var arrayShiftJaga7 = []
                var arrayShiftJaga8 = []
                var arrayShiftJaga9 = []
                var arrayShiftJaga10 = []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false

                    if (element.kodeexternal == 'ketiga') {
                        for (let z = 0; z < arrayShiftJaga3.length; z++) {
                            const element2 = arrayShiftJaga3[z];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga3.push(datax)
                        }
                    }







                    if (element.kodeexternal == 'keempat') {
                        for (let z = 0; z < arrayShiftJaga4.length; z++) {
                            const element2 = arrayShiftJaga4[z];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga4.push(datax)
                        }
                    }



                    if (element.kodeexternal == 'kelima') {
                        for (let z = 0; z < arrayShiftJaga5.length; z++) {
                            const element2 = arrayShiftJaga5[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga5.push(datax)
                        }
                    }




                    if (element.kodeexternal == 'keenam') {
                        for (let z = 0; z < arrayShiftJaga6.length; z++) {
                            const element2 = arrayShiftJaga6[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga6.push(datax)
                        }
                    }



                    if (element.kodeexternal == 'ketujuh') {
                        for (let z = 0; z < arrayShiftJaga7.length; z++) {
                            const element2 = arrayShiftJaga7[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga7.push(datax)
                        }
                    }


                    $scope.listData7 = arrayShiftJaga7

                    if (element.kodeexternal == 'kedelapan') {
                        for (let z = 0; z < arrayShiftJaga8.length; z++) {
                            const element2 = arrayShiftJaga8[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga8.push(datax)
                        }
                    }



                    if (element.kodeexternal == 'kesembilan') {
                        for (let z = 0; z < arrayShiftJaga9.length; z++) {
                            const element2 = arrayShiftJaga9[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga9.push(datax)
                        }
                    }



                    if (element.kodeexternal == 'kesepuluh') {
                        for (let z = 0; z < arrayShiftJaga10.length; z++) {
                            const element2 = arrayShiftJaga10[z];
                            if (element2.namaexternal == element.namaexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga10.push(datax)
                        }
                    }





                }

                var gejalaKosongKeun3 = []
                for (let k = 0; k < arrayShiftJaga3.length; k++) {
                    const element = arrayShiftJaga3[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun3.push(element2)
                            element.details = gejalaKosongKeun3
                        } else {
                            gejalaKosongKeun3 = []
                        }
                    }
                }
                $scope.listData3 = arrayShiftJaga3

                console.log($scope.listData3)

                var gejalaKosongKeun4 = []
                for (let k = 0; k < arrayShiftJaga4.length; k++) {
                    const element = arrayShiftJaga4[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun4.push(element2)
                            element.details = gejalaKosongKeun4
                        } else {
                            gejalaKosongKeun4 = []
                        }
                    }
                }
                $scope.listPerencanaan1 = [{
                    "id": 1,
                    "nama": "Perencanaan1",
                    "detail": [{
                            "id": 3018436,
                            "nama": "Bersihan jalan meningkat",
                            "satuan": "",
                            "type": "datetime"
                        },
                        {
                            "id": 3018437,
                            "nama": "Ventilasi adekuat",
                            "satuan": "",
                            "type": "datetime"
                        },
                        {
                            "id": 3018438,
                            "nama": "Curah jantung meningkat",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018439,
                            "nama": "Kadar glukosa darah dalam rentang normal",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018440,
                            "nama": "Perfusi perifer meningkat",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018441,
                            "nama": "Nausea menurun",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018442,
                            "nama": "Status nutrisi membaik",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018443,
                            "nama": "Defekasi normal",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018444,
                            "nama": "Integritas kulit",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018445,
                            "nama": "Status cairan membaik ",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018446,
                            "nama": "Suhu dalam rentang normal ",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018447,
                            "nama": "Keseimbangan cairan meningkat",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018448,
                            "nama": "Tingkat nyeri menurun",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018449,
                            "nama": "Kontinensia urine / vekal membaik",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018450,
                            "nama": "Tidak terjadi cidera",
                            "satuan": "",
                            "type": "checkbox"
                        },
                        {
                            "id": 3018451,
                            "nama": "Lainnya",
                            "satuan": "",
                            "type": "textbox"
                        },
                        {
                            "id": 3018452,
                            "nama": "",
                            "satuan": "",
                            "type": "textbox"
                        },
                        {
                            "id": 3018453,
                            "nama": "",
                            "satuan": "",
                            "type": "textbox"
                        },
                        {
                            "id": 3018454,
                            "nama": "",
                            "satuan": "",
                            "type": "textbox"
                        },

                    ]
                }]
                $scope.listData4 = arrayShiftJaga4
                console.log($scope.listData4)

                var gejalaKosongKeun5 = []
                for (let k = 0; k < arrayShiftJaga5.length; k++) {
                    const element = arrayShiftJaga5[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun5.push(element2)
                            element.details = gejalaKosongKeun5
                        } else {
                            gejalaKosongKeun5 = []
                        }
                    }
                }
                $scope.listData5 = arrayShiftJaga5

                var gejalaKosongKeun6 = []
                for (let k = 0; k < arrayShiftJaga6.length; k++) {
                    const element = arrayShiftJaga6[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun6.push(element2)
                            element.details = gejalaKosongKeun6
                        } else {
                            gejalaKosongKeun6 = []
                        }
                    }
                }
                $scope.listData6 = arrayShiftJaga6

                var gejalaKosongKeun7 = []
                for (let k = 0; k < arrayShiftJaga7.length; k++) {
                    const element = arrayShiftJaga7[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun7.push(element2)
                            element.details = gejalaKosongKeun7
                        } else {
                            gejalaKosongKeun7 = []
                        }
                    }
                }

                var gejalaKosongKeun8 = []
                for (let k = 0; k < arrayShiftJaga8.length; k++) {
                    const element = arrayShiftJaga8[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun8.push(element2)
                            element.details = gejalaKosongKeun8
                        } else {
                            gejalaKosongKeun8 = []
                        }
                    }
                }
                $scope.listData8 = arrayShiftJaga8

                var gejalaKosongKeun9 = []
                for (let k = 0; k < arrayShiftJaga9.length; k++) {
                    const element = arrayShiftJaga9[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun9.push(element2)
                            element.details = gejalaKosongKeun9
                        } else {
                            gejalaKosongKeun9 = []
                        }
                    }
                }
                $scope.listData9 = arrayShiftJaga9

                var gejalaKosongKeun10 = []
                for (let k = 0; k < arrayShiftJaga10.length; k++) {
                    const element = arrayShiftJaga10[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun10.push(element2)
                            element.details = gejalaKosongKeun10
                        } else {
                            gejalaKosongKeun10 = []
                        }
                    }
                }
                $scope.listData10 = arrayShiftJaga10
            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
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
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.tglLahir = chacePeriode[18]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + 3000444, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []


                // $scope.item.obj[111056]=$scope.now
                // $scope.item.obj[14563]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                dataLoad = dat.data.data
                // medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=4241&objectidakhir=4246&idemr=147", true).then(function (datas) {
                //     if (datas.data.data.length>0){
                //         if ($scope.item.obj[111061]== undefined) {
                //             $scope.item.obj[111061]=datas.data.data[0].value
                //         }
                //         if ($scope.item.obj[111062]== undefined) {
                //             $scope.item.obj[111062]=datas.data.data[3].value
                //         }
                //         if ($scope.item.obj[111063]==undefined) {
                //             $scope.item.obj[111063]=datas.data.data[4].value
                //         }
                //         if ($scope.item.obj[111064]==undefined) {
                //             $scope.item.obj[111064]=datas.data.data[5].value
                //         }

                //     }
                // })
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk && paramsIndex == dataLoad[i].index) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 115952)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21020955)
                                $scope.totalSkor5 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21030925)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21031111)
                                $scope.SkorNutrisi2 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21031128)
                                $scope.SkorNutrisi3 = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 14464 && dataLoad[i].emrdfk <= 14469 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 14424 && dataLoad[i].emrdfk <= 14431 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorGizi(datass)
                            // }


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
                            if (str != undefined) {
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = {
                                    value: res[0],
                                    text: res[1]
                                }
                            }

                        }
                        // pegawaiInputDetail = dataLoad[i].pegawaifk
                    }

                }
                // if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         // toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         // return
                //     }
                // }

            })





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
                    arrSave.push({
                        id: arrobj[i],
                        values: $scope.item.obj[parseInt(arrobj[i])]
                    })
                }
                $scope.cc.jenisemr = 'asesmen'
                $scope.cc.index = $state.params.index
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
                        'AsesmenUlangNyeriCtrl ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    console.log(cacheHelper.get('cacheNomorEMR'))


                });
            }

        }
    ]);
});