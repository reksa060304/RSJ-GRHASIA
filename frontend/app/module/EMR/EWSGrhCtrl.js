define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('EWSGrhCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            var paramsIndex = $state.params.index ? parseInt($state.params.index) : null;

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3001900
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            $scope.listData6 = []
            $scope.listData7 = []
            $scope.listSkor = []
            $scope.listNama = []
            $scope.listParaf = []
            $scope.listGDS = []
            $scope.listSkorNyeri = []
            $scope.listUrinOutput = []
            $scope.loading = true

            $scope.listTanggal = []
            $scope.listJam = []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function (data) {
                $scope.listDokter = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3001900).then(function (e) {
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
                var arrayGejala = []
                var arrayGejalaNeg = []
                var arraySkala = []
                var arrayTekananDaarah = []
                var arrayLaju = []
                var arrayKesadaran = []
                var arraySuhu = []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false
                    if (element.kodeexternal == 'tanggal') {
                        $scope.listTanggal.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'jam') {
                        $scope.listJam.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'skor') {
                        $scope.listSkor.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'nama') {
                        $scope.listNama.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'paraf') {
                        $scope.listParaf.push({ id: element.id, cbotable: element.cbotable })
                    }
                    if (element.kodeexternal == 'gds') {
                        $scope.listGDS.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'skornyeri') {
                        $scope.listSkorNyeri.push({ id: element.id })
                    }
                    if (element.kodeexternal == 'urinoutput') {
                        $scope.listUrinOutput.push({ id: element.id })
                    }
                    
                   
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'lajurespirasi') {
                        for (let z = 0; z < arrayGejala.length; z++) {
                            const element2 = arrayGejala[z];
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
                            arrayGejala.push(datax)
                        }
                    }
                    //END ARRAY GEJALA

                    // ARRAY GEJALA 
                    if (element.kodeexternal == 'saturasi') {
                        for (let z = 0; z < arrayGejalaNeg.length; z++) {
                            const element2 = arrayGejalaNeg[z];
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
                            arrayGejalaNeg.push(datax)
                        }
                    }
                    //END ARRAY GEJALA


                    // ARRAY GEJALA 
                    if (element.kodeexternal == 'suplemen') {
                        for (let z = 0; z < arraySkala.length; z++) {
                            const element2 = arraySkala[z];
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
                            arraySkala.push(datax)
                        }
                    }
                    //END ARRAY GEJALA

                    // ARRAY tekanandarah 
                    if (element.kodeexternal == 'tekanandarah') {
                        for (let z = 0; z < arrayTekananDaarah.length; z++) {
                            const element2 = arrayTekananDaarah[z];
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
                            arrayTekananDaarah.push(datax)
                        }
                    }
                    //END ARRAY tekanandarah

                    // ARRAY laju 
                    if (element.kodeexternal == 'laju') {
                        for (let z = 0; z < arrayLaju.length; z++) {
                            const element2 = arrayLaju[z];
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
                            arrayLaju.push(datax)
                        }
                    }
                    //END ARRAY laju

                    // ARRAY arrayKesadaran 
                    if (element.kodeexternal == 'kesadaran') {
                        for (let z = 0; z < arrayKesadaran.length; z++) {
                            const element2 = arrayKesadaran[z];
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
                            arrayKesadaran.push(datax)
                        }
                    }
                    //END ARRAY 

                    // ARRAY suhu 
                    if (element.kodeexternal == 'suhu') {
                        for (let z = 0; z < arraySuhu.length; z++) {
                            const element2 = arraySuhu[z];
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
                            arraySuhu.push(datax)
                        }
                    }
                    //END ARRAY suhu
                }

                // ARRAY GEJALA
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayGejala.length; k++) {
                    const element = arrayGejala[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listData1 = arrayGejala

                // ARRAY GEJALA
                var gejalaKosongKeun2 = []
                for (let k = 0; k < arrayGejalaNeg.length; k++) {
                    const element = arrayGejalaNeg[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun2.push(element2)
                            element.details = gejalaKosongKeun2
                        } else {
                            gejalaKosongKeun2 = []
                        }
                    }
                }
                $scope.listData2 = arrayGejalaNeg
                //END ARRAY GEJALA

                var gejalaKosongKeun3 = []
                for (let k = 0; k < arraySkala.length; k++) {
                    const element = arraySkala[k];
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
                $scope.listData3 = arraySkala
                //END ARRAY GEJALA

                //END ARRAY GEJALA

                var gejalaKosongKeun4 = []
                for (let k = 0; k < arrayTekananDaarah.length; k++) {
                    const element = arrayTekananDaarah[k];
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
                $scope.listData4 = arrayTekananDaarah
                //END ARRAY GEJALA

                var gejalaKosongKeun5 = []
                for (let k = 0; k < arrayLaju.length; k++) {
                    const element = arrayLaju[k];
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
                $scope.listData5 = arrayLaju

                var gejalaKosongKeun6 = []
                for (let k = 0; k < arrayKesadaran.length; k++) {
                    const element = arrayKesadaran[k];
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
                $scope.listData6 = arrayKesadaran


                var gejalaKosongKeun7 = []
                for (let k = 0; k < arraySuhu.length; k++) {
                    const element = arraySuhu[k];
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
                $scope.listData7 = arraySuhu
            })
            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

              
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[310981]={ text: $scope.cc.dokterdpjp, value: $scope.cc.iddpjp }
                    $scope.item.obj[310983]={text: $scope.cc.namaruangan, value: $scope.cc.objectruanganfk}
                    
                    
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                    
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk && paramsIndex == dataLoad[i].index) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if (dataLoad[i].emrdfk=='17380') 
                                $scope.skor1 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310960') 
                                    $scope.skor2 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310962') 
                                    $scope.skor3 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310963') 
                                    $scope.skor4 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310964') 
                                    $scope.skor5 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310965') 
                                    $scope.skor6 =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='310966') 
                                    $scope.skor7 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17387') 
                                //     $scope.skor8 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17388') 
                                //     $scope.skor9 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17389') 
                                //     $scope.skor10 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17390') 
                                //     $scope.skor11 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17391') 
                                //     $scope.skor12 =parseFloat( dataLoad[i].value)
                                // if (dataLoad[i].emrdfk=='17392') 
                                //     $scope.skor13 =parseFloat( dataLoad[i].value)
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
                                    // var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                    // $scope.getSkor(datass)
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
                        // console.log($scope.item.obj[310974]);


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


            // $scope.skor1 = 0
            // $scope.skor2 = 0
            // $scope.skor3 = 0
            // $scope.skor4 = 0
            // $scope.skor5 = 0
            // $scope.skor6 = 0
            // $scope.skor7 = 0
            // // $scope.skor8 = 0
            // // $scope.skor9 = 0
            // // $scope.skor10 = 0
            // // $scope.skor11 = 0
            // // $scope.skor12 = 0
            // $scope.skor13 = 0
            $scope.skor11 = 0
                $scope.skor21 = 0
                $scope.skor31 = 0
                $scope.skor41 = 0
                $scope.skor51 = 0
                $scope.skor61 = 0
                $scope.skor12 = 0
                $scope.skor22 = 0
                $scope.skor32 = 0
                $scope.skor42 = 0
                $scope.skor52 = 0
                $scope.skor62 = 0
                $scope.skor13 = 0
                $scope.skor23 = 0
                $scope.skor33 = 0
                $scope.skor43 = 0
                $scope.skor53 = 0
                $scope.skor63 = 0
                $scope.skor14 = 0
                $scope.skor24 = 0
                $scope.skor34 = 0
                $scope.skor44 = 0
                $scope.skor54 = 0
                $scope.skor64 = 0
                $scope.skor15 = 0
                $scope.skor25 = 0
                $scope.skor35 = 0
                $scope.skor45 = 0
                $scope.skor55 = 0
                $scope.skor65 = 0
                $scope.skor16 = 0
                $scope.skor26 = 0
                $scope.skor36 = 0
                $scope.skor46 = 0
                $scope.skor56 = 0
                $scope.skor66 = 0
                $scope.skor17 = 0
                $scope.skor27 = 0
                $scope.skor37 = 0
                $scope.skor47 = 0
                $scope.skor57 = 0
                $scope.skor67 = 0
            $scope.getSkor = function (stat) {
                
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        console.log($scope.item.obj[parseFloat(arrobj[i])]);
                        if ($scope.item.obj[parseFloat(arrobj[i])] != undefined && $scope.item.obj[parseFloat(arrobj[i])] != "") {
                            if(stat.kodeexternal == 'lajurespirasi'){
                                if (stat.satuan == 1){
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8){
                                        $scope.skor11 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11){
                                        $scope.skor11 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor11 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor11 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor11 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 2) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8) {
                                        $scope.skor21 = 3
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11) {
                                        $scope.skor21 = 1
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor21 = 0
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor21 = 2
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor21 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 3) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8) {
                                        $scope.skor31 = 3
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11) {
                                        $scope.skor31 = 1
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor31 = 0
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor31 = 2
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor31 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 4) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8) {
                                        $scope.skor41 = 3
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11) {
                                        $scope.skor41 = 1
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor41 = 0
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor41 = 2
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor41 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 5) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8) {
                                        $scope.skor51 = 3
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11) {
                                        $scope.skor51 = 1
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor51 = 0
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor51 = 2
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor51 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 6) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 6 && $scope.item.obj[parseFloat(arrobj[i])] <= 8) {
                                        $scope.skor61 = 3
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 9 && $scope.item.obj[parseFloat(arrobj[i])] <= 11) {
                                        $scope.skor61 = 1
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 12 && $scope.item.obj[parseFloat(arrobj[i])] <= 20) {
                                        $scope.skor61 = 0
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 21 && $scope.item.obj[parseFloat(arrobj[i])] <= 24) {
                                        $scope.skor61 = 2
                                    } else if ($scope.item.obj[parseFloat(arrobj[i])] >= 25 && $scope.item.obj[parseFloat(arrobj[i])] <= 34) {
                                        $scope.skor61 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                            }
                            if(stat.kodeexternal == 'saturasi'){
                                if (stat.satuan == 1){
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor12 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor12 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor12 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor12 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 2) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor22 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor22 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor22 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor22 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 3) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor32 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor32 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor32 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor32 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 4) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor42 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor42 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor42 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor42 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 5) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor52 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor52 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor52 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor52 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 6) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 96){
                                        $scope.skor62 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 94 && $scope.item.obj[parseFloat(arrobj[i])] <= 95){
                                        $scope.skor62 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 92 && $scope.item.obj[parseFloat(arrobj[i])] <= 93) {
                                        $scope.skor62 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] <= 91) {
                                        $scope.skor62 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                            }
                            if(stat.kodeexternal == 'tekanandarah'){
                                if (stat.satuan == 1){
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor13 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor13 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor13 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor13 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor13 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor13 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 2) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor23 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor23 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor23 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor23 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor23 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor23 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 3) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor33 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor33 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor33 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor33 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor33 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor33 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 4) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor43 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor43 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor43 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor43 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor43 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor43 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 5) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor53 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor53 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor53 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor53 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor53 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor53 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 6) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] > 220){
                                        $scope.skor63 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 181 && $scope.item.obj[parseFloat(arrobj[i])] <= 220){
                                        $scope.skor63 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 180) {
                                        $scope.skor63 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor63 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 91 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor63 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 71 && $scope.item.obj[parseFloat(arrobj[i])] <= 90) {
                                        $scope.skor63 = 3
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                            }
                            if(stat.kodeexternal == 'laju'){
                                if (stat.satuan == 1){
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor14 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor14 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor14 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor14 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor14 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 2) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor24 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor24 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor24 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor24 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor24 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 3) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor34 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor34 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor34 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor34 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor34 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 4) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor44 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor44 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor44 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor44 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor44 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 5) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor54 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor54 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor54 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor54 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor54 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 6) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] >= 131 && $scope.item.obj[parseFloat(arrobj[i])] <= 150){
                                        $scope.skor64 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 111 && $scope.item.obj[parseFloat(arrobj[i])] <= 130){
                                        $scope.skor64 = 2
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 101 && $scope.item.obj[parseFloat(arrobj[i])] <= 110) {
                                        $scope.skor64 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 51 && $scope.item.obj[parseFloat(arrobj[i])] <= 100) {
                                        $scope.skor64 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 40 && $scope.item.obj[parseFloat(arrobj[i])] <= 50) {
                                        $scope.skor64 = 1
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                            }
                            if(stat.kodeexternal == 'suhu'){
                                if (stat.satuan == 1){
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor15 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor15 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor15 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor15 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor15 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 2) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor25 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor25 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor25 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor25 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor25 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 3) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor35 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor35 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor35 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor35 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor35 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 4) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor45 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor45 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor45 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor45 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor45 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 5) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor55 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor55 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor55 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor55 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor55 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                                if (stat.satuan == 6) {
                                    if ($scope.item.obj[parseFloat(arrobj[i])] <= 35){
                                        $scope.skor56 = 3
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 35.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 36){
                                        $scope.skor56 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 36.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 38) {
                                        $scope.skor56 = 0
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] >= 38.1 && $scope.item.obj[parseFloat(arrobj[i])] <= 39) {
                                        $scope.skor56 = 1
                                    }else if ($scope.item.obj[parseFloat(arrobj[i])] > 39) {
                                        $scope.skor56 = 2
                                    }
                                    // if ($scope.item.obj[parseFloat(arrobj[i])] >= 35) {
                                    //     $scope.skor11 = 0
                                    //     $scope.item.obj2[parseFloat(arrobj[i])] = false
                                    // }
                                }
                            }
                            if(stat.kodeexternal =='suplemen'){
                                if (stat.satuan == 1) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor16 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor16 = 0
                                    }
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor26 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor26 = 0
                                    }
                                   
                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor36 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor36 = 0
                                    }
                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor46 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor46 = 0
                                    }
                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor56 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor56 = 0
                                    }
                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == 'Ada (L/menit)'){
                                        $scope.skor66 = 2
                                    }
                                    if (stat.namaexternal == 'Tidak Ada'){
                                        $scope.skor66 = 0
                                    }
                                }
                            }
                            if(stat.kodeexternal =='kesadaran'){
                                if (stat.satuan == 1) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor17 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor17 = 0
                                    }
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor27 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor27 = 0
                                    }
                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor37 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor37 = 0
                                    }
                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor47 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor47 = 0
                                    }
                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor57 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor57 = 0
                                    }
                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == 'Nyeri/Verbal'){
                                        $scope.skor67 = 3
                                    }
                                    if (stat.namaexternal == 'Sadar'){
                                        $scope.skor67 = 0
                                    }
                                }
                            }
                        } 

                        else if($scope.item.obj[parseFloat(arrobj[i])] == undefined || $scope.item.obj[parseFloat(arrobj[i])] == "" ){
                            if (stat.kodeexternal == 'lajurespirasi') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '6 -8') {
                                        console.log($scope.item.obj[parseFloat(arrobj[i])]);
                                        $scope.skor11 = 0
                                    } else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor11 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor11 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor11 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $scope.skor11 = 0
                                    }
                                    
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '6 -8') {
                                        $scope.skor21 = 0
                                    }else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor21 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor21 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor21 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $scope.skor21 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '6 -8') {
                                        $scope.skor31 = 0
                                    }else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor31 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor31 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor31 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $elsescope.skor31 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '6 -8') {
                                        $scope.skor41 = 0
                                    }else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor41 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor41 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor41 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $scope.skor41 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '6 -8') {
                                        $scope.skor51 = 0
                                    }else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor51 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor51 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor51 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $scope.skor51 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '6 -8') {
                                        $scope.skor61 = 0
                                    }else
                                    if (stat.namaexternal == '9 - 11') {
                                        $scope.skor61 = 0
                                    }else
                                    if (stat.namaexternal == '12 - 20') {
                                        $scope.skor61 = 0
                                    }else
                                    if (stat.namaexternal == '21 - 24') {
                                        $scope.skor61 = 0
                                    }else
                                    if (stat.namaexternal == '25 - 34') {
                                        $scope.skor61 = 0
                                    }

                                }
                            }
                            if (stat.kodeexternal == 'saturasi') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor12 = 0
                                    }else
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor12 = 0
                                    }else
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor12 = 0
                                    }else
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor12 = 0
                                    }
                                   
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor22 = 0
                                    }else
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor22 = 0
                                    }else
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor22 = 0
                                    }else
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor22 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor32 = 0
                                    }
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor32 = 0
                                    }
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor32 = 0
                                    }
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor32 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor42 = 0
                                    }
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor42 = 0
                                    }
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor42 = 0
                                    }
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor42 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor52 = 0
                                    }
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor52 = 0
                                    }
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor52 = 0
                                    }
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor52 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '>= 96') {
                                        $scope.skor62 = 0
                                    }
                                    if (stat.namaexternal == '94 - 95') {
                                        $scope.skor62 = 0
                                    }
                                    if (stat.namaexternal == '92 - 93') {
                                        $scope.skor62 = 0
                                    }
                                    if (stat.namaexternal == '<= 91') {
                                        $scope.skor62 = 0
                                    }

                                }
                            }
                            if (stat.kodeexternal == 'tekanandarah') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor13 = 0
                                    }
                                   
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor23 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor33 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor43 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor53 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor63 = 0
                                    }

                                }
                            }
                            if (stat.kodeexternal == 'tekanandarah') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor13 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor13 = 0
                                    }
                                   
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor23 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor23 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor33 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor33 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor43 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor43 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor53 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor53 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '> 220') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '181 - 220') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '111 - 180') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '91 - 100') {
                                        $scope.skor63 = 0
                                    }
                                    if (stat.namaexternal == '71 - 90') {
                                        $scope.skor63 = 0
                                    }

                                }
                            }
                            if (stat.kodeexternal == 'laju') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor14 = 0
                                    } else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor14 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110 ') {
                                    console.log($scope.item.obj[parseFloat(arrobj[i])]);

                                        $scope.skor14 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor14 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor14 = 0
                                    }
                                   
                                   
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor24 = 0
                                    }else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor24 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor24 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor24 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor24 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor34 = 0
                                    }else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor34 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor34 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor34 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor34 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor44 = 0
                                    }else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor44 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor44 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor44 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor44 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor54 = 0
                                    }else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor54 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor54 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor54 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor54 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '131 - 150') {
                                        $scope.skor64 = 0
                                    }else
                                    if (stat.namaexternal == '111 - 130') {
                                        $scope.skor64 = 0
                                    }else
                                    if (stat.namaexternal == '101 - 110') {
                                        $scope.skor64 = 0
                                    }else
                                    if (stat.namaexternal == '51 - 100') {
                                        $scope.skor64 = 0
                                    }else
                                    if (stat.namaexternal == '40 - 50') {
                                        $scope.skor64 = 0
                                    }

                                }
                            }
                            if (stat.kodeexternal == 'suhu') {
                                if (stat.satuan == 1){
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor15 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor15 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor15 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor15 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor15 = 0
                                    }
                                   
                                   
                                }
                                if (stat.satuan == 2) {
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor25 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor25 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor25 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor25 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor25 = 0
                                    }

                                }
                                if (stat.satuan == 3) {
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor35 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor35 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor35 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor35 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor35 = 0
                                    }

                                }
                                if (stat.satuan == 4) {
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor45 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor45 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor45 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor45 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor45 = 0
                                    }

                                }
                                if (stat.satuan == 5) {
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor55 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor55 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor55 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor55 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor55 = 0
                                    }

                                }
                                if (stat.satuan == 6) {
                                    if (stat.namaexternal == '<= 35') {
                                        $scope.skor65 = 0
                                    }else
                                    if (stat.namaexternal == '35.1 - 36') {
                                        $scope.skor65 = 0
                                    }else
                                    if (stat.namaexternal == '36.1 - 38') {
                                        $scope.skor65 = 0
                                    }else
                                    if (stat.namaexternal == '38.1 - 39') {
                                        $scope.skor65 = 0
                                    }else
                                    if (stat.namaexternal == '> 39') {
                                        $scope.skor65 = 0
                                    }

                                }
                            }
                            if(stat.kodeexternal =='suplemen'){
                                $scope.skor16 = 0
                                $scope.skor26 = 0
                                $scope.skor36 = 0
                                $scope.skor46 = 0
                                $scope.skor56 = 0
                                $scope.skor66 = 0
                            }
                            if(stat.kodeexternal =='kesadaran'){
                                $scope.skor17 = 0
                                $scope.skor27 = 0
                                $scope.skor37 = 0
                                $scope.skor47 = 0
                                $scope.skor57 = 0
                                $scope.skor67 = 0
                            }
                            
                        }
                    }
                }
                console.log(parseFloat($scope.skor11) , parseFloat($scope.skor12) , parseFloat($scope.skor13) , parseFloat($scope.skor14) , parseFloat($scope.skor15)               );
                $scope.item.obj[310960] = parseFloat($scope.skor11) + parseFloat($scope.skor12) + parseFloat($scope.skor13) + parseFloat($scope.skor14) + parseFloat($scope.skor15) + parseFloat($scope.skor16) + parseFloat($scope.skor17)
                $scope.item.obj[310961] = parseFloat($scope.skor21) + parseFloat($scope.skor22) + parseFloat($scope.skor23) + parseFloat($scope.skor24) + parseFloat($scope.skor25) + parseFloat($scope.skor26) + parseFloat($scope.skor27)
                $scope.item.obj[310962] = parseFloat($scope.skor31) + parseFloat($scope.skor32) + parseFloat($scope.skor33) + parseFloat($scope.skor34) + parseFloat($scope.skor35) + parseFloat($scope.skor36) + parseFloat($scope.skor37)
                $scope.item.obj[310963] = parseFloat($scope.skor41) + parseFloat($scope.skor42) + parseFloat($scope.skor43) + parseFloat($scope.skor44) + parseFloat($scope.skor45) + parseFloat($scope.skor46) + parseFloat($scope.skor47)
                $scope.item.obj[310964] = parseFloat($scope.skor51) + parseFloat($scope.skor52) + parseFloat($scope.skor53) + parseFloat($scope.skor54) + parseFloat($scope.skor55) + parseFloat($scope.skor56) + parseFloat($scope.skor57)
                $scope.item.obj[310965] = parseFloat($scope.skor61) + parseFloat($scope.skor62) + parseFloat($scope.skor63) + parseFloat($scope.skor64) + parseFloat($scope.skor65) + parseFloat($scope.skor66) + parseFloat($scope.skor67)
                $scope.item.obj[310966] = $scope.skor71
                // $scope.item.obj[17391] = $scope.skor12
                $scope.item.obj[17392] = $scope.skor13
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
                    'EWS Grhasia ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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