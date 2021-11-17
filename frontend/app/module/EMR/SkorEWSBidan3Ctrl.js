define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SkorEWSBidan3Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210120
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            $scope.listData6 = []
            $scope.listData7 = []
            $scope.listData8 = []
            $scope.listData9 = []
            $scope.listData10 = []
            $scope.listData11 = []
            $scope.listSkor = []
            $scope.loading = true

            $scope.listTanggal = []
            $scope.listJam = []
            medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function (data) {
                $scope.listDokter = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })           
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 210120).then(function (e) {
                // debugger
                // $scope.isRouteLoading = false
                //   var datas = e.data.kolom1
                //     for (let i = 0; i <  datas.length; i++) {
                //         const element =datas[i];
                //         if (element.namaexternal == 'kebahayaan')
                //             $scope.listData1.push({ id: element.id, skor: element.reportdisplay, nama: element.caption })
                //         if (element.namaexternal == 'sistempendukung')
                //             $scope.listData2.push({ id: element.id, skor: element.reportdisplay, nama: element.caption })
                //         if (element.namaexternal == 'kemampuanbekerja')
                //             $scope.listData3.push({ id: element.id, skor: element.reportdisplay, nama: element.caption })
                //     }
                var datas = e.data.kolom4
                var detail = []
                var arrayLajuRespirasi = []
                var arraySaturasi = []
                var arraySuplemen = []
                var arrayTemperatur = []
                var arraySistolik = []
                var arrayDiastol = []
                var arrayLajuDetak = []
                var arrayKesadaran = []
                var arrayNyeri = []
                var arrayDischarge = []
                var arrayProteinuria = []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false
                    if (element.kodeexternal == 'tanggal') {
                        $scope.listTanggal.push({ id: element.id, type: element.type })
                    }
                    if (element.kodeexternal == 'jam') {
                        $scope.listJam.push({ id: element.id, type: element.type })
                    }
                    if (element.kodeexternal == 'skor') {
                        $scope.listSkor.push({ id: element.id, type: element.type })
                    }
                    // arrayLajuRespirasi
                    if (element.kodeexternal == 'lajurespirasi') {
                        for (let z = 0; z < arrayLajuRespirasi.length; z++) {
                            const element2 = arrayLajuRespirasi[z];
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
                            arrayLajuRespirasi.push(datax)
                        }
                    }
                    //END arrayLajuRespirasi

                    // arraySaturasi 
                    if (element.kodeexternal == 'saturasi') {
                        for (let z = 0; z < arraySaturasi.length; z++) {
                            const element2 = arraySaturasi[z];
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
                            arraySaturasi.push(datax)
                        }
                    }
                    //END arraySaturasi


                    // arraySuplemen 
                    if (element.kodeexternal == 'suplemen') {
                        for (let z = 0; z < arraySuplemen.length; z++) {
                            const element2 = arraySuplemen[z];
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
                            arraySuplemen.push(datax)
                        }
                    }
                    //END arraySuplemen

                    // arrayTemperatur
                    if (element.kodeexternal == 'temperatur') {
                        for (let z = 0; z < arrayTemperatur.length; z++) {
                            const element2 = arrayTemperatur[z];
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
                            arrayTemperatur.push(datax)
                        }
                    }
                    //END arrayTemperatur

                    // arraySistolik 
                    if (element.kodeexternal == 'sistolik') {
                        for (let z = 0; z < arraySistolik.length; z++) {
                            const element2 = arraySistolik[z];
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
                            arraySistolik.push(datax)
                        }
                    }
                    //END arraySistolik

                    // arrayDiastol 
                    if (element.kodeexternal == 'diastol') {
                        for (let z = 0; z < arrayDiastol.length; z++) {
                            const element2 = arrayDiastol[z];
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
                            arrayDiastol.push(datax)
                        }
                    }
                    //END arrayDiastol 

                    // arrayLajuDetak 
                    if (element.kodeexternal == 'lajudetak') {
                        for (let z = 0; z < arrayLajuDetak.length; z++) {
                            const element2 = arrayLajuDetak[z];
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
                            arrayLajuDetak.push(datax)
                        }
                    }
                    //END arrayLajuDetak

                    // arrayKesadaran 
                    if (element.kodeexternal == 'kesadaran') {
                        for (let z = 0; z < arrayKesadaran.length; z++) {
                            const element2 = arrayKesadaran[z];
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
                            arrayKesadaran.push(datax)
                        }
                    }
                    //END arrayKesadaran

                    // arrayNyeri 
                    if (element.kodeexternal == 'nyeri') {
                        for (let z = 0; z < arrayNyeri.length; z++) {
                            const element2 = arrayNyeri[z];
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
                            arrayNyeri.push(datax)
                        }
                    }
                    //END arrayNyeri

                    // arrayDischarge 
                    if (element.kodeexternal == 'discharge') {
                        for (let z = 0; z < arrayDischarge.length; z++) {
                            const element2 = arrayDischarge[z];
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
                            arrayDischarge.push(datax)
                        }
                    }
                    //END arrayDischarge
                    
                    // arrayProteinuria 
                    if (element.kodeexternal == 'proteinuria') {
                        for (let z = 0; z < arrayProteinuria.length; z++) {
                            const element2 = arrayProteinuria[z];
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
                            arrayProteinuria.push(datax)
                        }
                    }
                    //END arrayProteinuria
                }

                // ARRAY GEJALA
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayLajuRespirasi.length; k++) {
                    const element = arrayLajuRespirasi[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listData1 = arrayLajuRespirasi

                // ARRAY GEJALA
                var gejalaKosongKeun2 = []
                for (let k = 0; k < arraySaturasi.length; k++) {
                    const element = arraySaturasi[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun2.push(element2)
                            element.details = gejalaKosongKeun2
                        } else {
                            gejalaKosongKeun2 = []
                        }
                    }
                }
                $scope.listData2 = arraySaturasi
                //END ARRAY GEJALA

                var gejalaKosongKeun3 = []
                for (let k = 0; k < arraySuplemen.length; k++) {
                    const element = arraySuplemen[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun3.push(element2)
                            element.details = gejalaKosongKeun3
                        } else {
                            gejalaKosongKeun3 = []
                        }
                    }
                }
                $scope.listData3 = arraySuplemen
                //END ARRAY GEJALA

                //END ARRAY GEJALA

                var gejalaKosongKeun4 = []
                for (let k = 0; k < arrayTemperatur.length; k++) {
                    const element = arrayTemperatur[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun4.push(element2)
                            element.details = gejalaKosongKeun4
                        } else {
                            gejalaKosongKeun4 = []
                        }
                    }
                }
                $scope.listData4 = arrayTemperatur
                //END ARRAY GEJALA

                var gejalaKosongKeun5 = []
                for (let k = 0; k < arraySistolik.length; k++) {
                    const element = arraySistolik[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun5.push(element2)
                            element.details = gejalaKosongKeun5
                        } else {
                            gejalaKosongKeun5 = []
                        }
                    }
                }
                $scope.listData5 = arraySistolik

                var gejalaKosongKeun6 = []
                for (let k = 0; k < arrayDiastol.length; k++) {
                    const element = arrayDiastol[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun6.push(element2)
                            element.details = gejalaKosongKeun6
                        } else {
                            gejalaKosongKeun6 = []
                        }
                    }
                }
                $scope.listData6 = arrayDiastol

                var gejalaKosongKeun7 = []
                for (let k = 0; k < arrayLajuDetak.length; k++) {
                    const element = arrayLajuDetak[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun7.push(element2)
                            element.details = gejalaKosongKeun7
                        } else {
                            gejalaKosongKeun7 = []
                        }
                    }
                }
                $scope.listData7 = arrayLajuDetak

                var gejalaKosongKeun8 = []
                for (let k = 0; k < arrayKesadaran.length; k++) {
                    const element = arrayKesadaran[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun8.push(element2)
                            element.details = gejalaKosongKeun8
                        } else {
                            gejalaKosongKeun8 = []
                        }
                    }
                }
                $scope.listData8 = arrayKesadaran

                var gejalaKosongKeun9 = []
                for (let k = 0; k < arrayNyeri.length; k++) {
                    const element = arrayNyeri[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun9.push(element2)
                            element.details = gejalaKosongKeun9
                        } else {
                            gejalaKosongKeun9 = []
                        }
                    }
                }
                $scope.listData9 = arrayNyeri

                var gejalaKosongKeun10 = []
                for (let k = 0; k < arrayDischarge.length; k++) {
                    const element = arrayDischarge[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun10.push(element2)
                            element.details = gejalaKosongKeun10
                        } else {
                            gejalaKosongKeun10 = []
                        }
                    }
                }
                $scope.listData10 = arrayDischarge

                var gejalaKosongKeun11 = []
                for (let k = 0; k < arrayProteinuria.length; k++) {
                    const element = arrayProteinuria[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun11.push(element2)
                            element.details = gejalaKosongKeun11
                        } else {
                            gejalaKosongKeun11 = []
                        }
                    }
                }
                $scope.listData11 = arrayProteinuria

                console.log($scope.listJam);
            })
            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

              
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[206476]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                    $scope.item.obj[206478]={text: $scope.cc.namaruangan, value: $scope.cc.objectruanganfk}
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
                                // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                                //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                //     $scope.getSkor2(datass)
                                // }
                                if (dataLoad[i].reportdisplay != null) {
                                    var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                    $scope.getSkor(datass)
                                }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
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
            // medifirstService.get('emr/get-data-dg-primary/' + $scope.cc.noregistrasi, true, true, 20).then(function (data) {                
            //     var datas = data.data[0]
            //     $scope.item.obj[206477] = {id:datas.id, text:datas.namadiagnosa}
            // })  
            
            $scope.skor1 = 0
            $scope.skor2 = 0
            $scope.skor3 = 0
            $scope.skor4 = 0
            $scope.skor5 = 0
            $scope.skor6 = 0
            $scope.skor7 = 0
            $scope.skor8 = 0
            $scope.skor9 = 0
            $scope.skor10 = 0
            $scope.skor11 = 0
            $scope.skor12 = 0
            $scope.skor13 = 0
            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        // if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            if (stat.reportdisplay == null)
                                break
                            if (stat.satuan == 1)
                                $scope.skor1 = $scope.skor1 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 2)
                                $scope.skor2 = $scope.skor2 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 3)
                                $scope.skor3 = $scope.skor3 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 4)
                                $scope.skor4 = $scope.skor4 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 5)
                                $scope.skor5 = $scope.skor5 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 6)
                                $scope.skor6 = $scope.skor6 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 7)
                                $scope.skor7 = $scope.skor7 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 8)
                                $scope.skor8 = $scope.skor8 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 9)
                                $scope.skor9 = $scope.skor9 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 10)
                                $scope.skor10 = $scope.skor10 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 11)
                                $scope.skor11 = $scope.skor11 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 12)
                                $scope.skor12 = $scope.skor12 + parseFloat(stat.reportdisplay)
                            if (stat.satuan == 13)
                                $scope.skor13 = $scope.skor13 + parseFloat(stat.reportdisplay)
                            break
                        } 

                    //     else {
                    //         if (stat.reportdisplay == null)
                    //             break
                    //         if (stat.satuan == 1)
                    //             $scope.skor1 = $scope.skor1 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 2)
                    //             $scope.skor2 = $scope.skor2 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 3)
                    //             $scope.skor3 = $scope.skor3 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 4)
                    //             $scope.skor4 = $scope.skor4 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 5)
                    //             $scope.skor5 = $scope.skor5 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 6)
                    //             $scope.skor6 = $scope.skor6 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 7)
                    //             $scope.skor7 = $scope.skor7 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 8)
                    //             $scope.skor8 = $scope.skor8 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 9)
                    //             $scope.skor9 = $scope.skor9 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 10)
                    //             $scope.skor10 = $scope.skor10 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 11)
                    //             $scope.skor11 = $scope.skor11 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 12)
                    //             $scope.skor12 = $scope.skor12 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 13)
                    //             $scope.skor13 = $scope.skor13 - parseFloat(stat.reportdisplay)
                    //     }
                    // }
                }
                // if $scope.skor1=0 
                    
                        // if($scope.skor1  != 0){
                        //      $scope.item.obj[206437] = $scope.skor1
                        // }
                        // if($scope.skor2  != 0){
                        //      $scope.item.obj[206438] = $scope.skor2
                        // }
                    
                $scope.item.obj[22026818] = $scope.skor1
                $scope.item.obj[22026819] = $scope.skor2
                $scope.item.obj[22026820] = $scope.skor3
                $scope.item.obj[22026821] = $scope.skor4
                $scope.item.obj[22026822] = $scope.skor5
                $scope.item.obj[22026823] = $scope.skor6
                $scope.item.obj[22026824] = $scope.skor7
                $scope.item.obj[22026825] = $scope.skor8
                $scope.item.obj[22026826] = $scope.skor9
                $scope.item.obj[22026827] = $scope.skor10
                $scope.item.obj[22026828] = $scope.skor11
                $scope.item.obj[22026829] = $scope.skor12
                $scope.item.obj[22026830] = $scope.skor13
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

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
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
                    'Skor Early Warning System Bidan ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});