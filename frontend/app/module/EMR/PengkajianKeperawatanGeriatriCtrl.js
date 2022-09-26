define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianKeperawatanGeriatriCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            // var paramsIndex = $state.params.index ? parseInt($state.params.index) : null;
            //scope.disable
            $scope.item301822 = true
            $scope.item301824 = true
            $scope.item301826 = true
            //end
            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.skor1 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000934
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.listItem = [{
                    id: 301535,
                    inuse: true
                }, 
                {
                    id: 301541
                },
                {
                    id: 301547
                },
                {
                    id: 301553,
                    // nami: 'kangge lima'
                },
                {
                    id: 301559,
                    // nami: 'kangge genep'
                }
            ]
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000934).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                // var listdata1 = []
                var satu = []
                var Dua = []
                var Tiga = []
                var Empat = []
                var Lima = []
                var Enam = []
                var sama = false
                //buat dibikin arraynya
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false
                    if (element.type == 'radio') {
                        // [{"name": "Ya","id": 1,"value": "Ya"},{"name": "Tidak","id": 2,"value": "Tidak"}]
                        element.cbotable = JSON.parse(element.cbotable)
                    }
                    // 1. array 1
                    if (element.kodeexternal == '1') {
                        
                        for (let z = 0; z < satu.length; z++) {
                            const element2 = satu[z];
                            
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
                            satu.push(datax)
                        }
                    }

                    // 1. array 2
                    if (element.kodeexternal == '2') {
                        for (let z = 0; z < Dua.length; z++) {
                            const element2 = Dua[z];
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
                            Dua.push(datax)
                        }
                    }

                    // 1. array 3
                    if (element.kodeexternal == '3') {
                        for (let z = 0; z < Tiga.length; z++) {
                            const element2 = Tiga[z];
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
                            Tiga.push(datax)
                        }
                    }
                    // 1. array 4
                    if (element.kodeexternal == '4') {
                        for (let z = 0; z < Empat.length; z++) {
                            const element2 = Empat[z];
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
                            Empat.push(datax)
                        }
                    }
                    // 1. array 5
                    if (element.kodeexternal == '5') {
                        for (let z = 0; z < Lima.length; z++) {
                            const element2 = Lima[z];
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
                            Lima.push(datax)
                        }
                    }
                    // 1. array 6
                    if (element.kodeexternal == '6') {
                        for (let z = 0; z < Enam.length; z++) {
                            const element2 = Enam[z];
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
                            Enam.push(datax)
                        }
                    }
                }
                // contoh ARRAY langkah 2
                // var gejalaKosongKeun = []
                // for (let k = 0; k < listdata1.length; k++) {
                //     const element = listdata1[k];
                //     for (let l = 0; l < datas.length; l++) {
                //         const element2 = datas[l];
                //         if (element2.namaexternal == element.namaexternal) {
                //             gejalaKosongKeun.push(element2)
                //             element.details = gejalaKosongKeun
                //         } else {
                //             gejalaKosongKeun = []
                //         }
                //     }
                // }
                // $scope.listData1 = listdata1
                
                // scope 1
                var gejalaKosongKeun = []
                for (let k = 0; k < satu.length; k++) {
                    const element = satu[k];
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
                $scope.listSatu = satu

                // scope Dua
                var gejalaKosongKeun = []
                for (let k = 0; k < Dua.length; k++) {
                    const element = Dua[k];
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
                $scope.listDua = Dua
                console.log($scope.listDua);
                // for (let i = $scope.listDua.length+1; i > 0; i--) {
                //     // $scope.no = i
                // }
                $scope.no = 1
                // scope Tiga
                var gejalaKosongKeun = []
                for (let k = 0; k < Tiga.length; k++) {
                    const element = Tiga[k];
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
                $scope.listTiga = Tiga

                // scope Empat
                var gejalaKosongKeun = []
                for (let k = 0; k < Empat.length; k++) {
                    const element = Empat[k];
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
                $scope.listEmpat = Empat
                // scope Lima
                var gejalaKosongKeun = []
                for (let k = 0; k < Lima.length; k++) {
                    const element = Lima[k];
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
                $scope.listLima = Lima

                // scope Enam
                var gejalaKosongKeun = []
                for (let k = 0; k < Enam.length; k++) {
                    const element = Enam[k];
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
                $scope.listEnam = Enam
                // $scope.listAda = [{name: "Ada",id: 1,value: "Ada"},{name: "Tidak",id: 2,value: "Tidak"}]
                // $scope.listYa = [{
                //         name: "Ya",
                //         id: 1,
                //         value: "Ya"
                //     },
                //     {
                //         name: "Tidak",
                //         id: 2,
                //         value: "Tidak"
                //     }
                // ];
                // $scope.listBaik = [{
                //         id: 1,
                //         name: "Baik",
                //         value: "Baik"
                //     },
                //     {
                //         id: 2,
                //         name: "Buruk",
                //         value: "Buruk"
                //     }
                // ];
            })

            // $scope.listRujukan = [{
            //         "id": 1,
            //         "nama": "1. Keluhan Utama",
            //         "detail": [{
            //             "id": 1901600,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 2,
            //         "nama": "2. Pemeriksaan Fisik",
            //         "detail": [{
            //             "id": 1901601,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 8,
            //         "nama": "Diagnosis Keperawatan",
            //         "detail": [{
            //             "id": 1901602,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 9,
            //         "nama": "Perencanaan",
            //         "detail": [{
            //             "id": 1901603,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 10,
            //         "nama": "Implementasi",
            //         "detail": [{
            //             "id": 1901604,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 13,
            //         "nama": "Evaluasi",
            //         "detail": [{
            //             "id": 1901605,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            //     {
            //         "id": 14,
            //         "nama": "RTL",
            //         "detail": [{
            //             "id": 1901606,
            //             "nama": "",
            //             "type": "textarea"
            //         }, ]
            //     },
            // ]
            // $scope.listAda = [
            //     {
            //         name: "Ada",
            //         id: 1,
            //         value: "Ada"
            //     },
            //     {
            //         name: "Tidak",
            //         id: 2,
            //         value: "Tidak"
            //     }
            // ]
            // $scope.listYa = [{
            //         name: "Ya",
            //         id: 1,
            //         value: "Ya"
            //     },
            //     {
            //         name: "Tidak",
            //         id: 2,
            //         value: "Tidak"
            //     }
            // ];
            $scope.listBaik = [{
                    id: 1,
                    name: "Baik",
                    value: "Baik"
                },
                {
                    id: 2,
                    name: "Buruk",
                    value: "Buruk"
                }
            ];
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
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
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                $scope.cc.tglLahir = chacePeriode[18]
                $scope.cc.pekerjaan = chacePeriode[31]
                $scope.cc.tempatLahir = chacePeriode[32]
                $scope.cc.nik = chacePeriode[35]
                $scope.cc.suku = chacePeriode[36]
                $scope.cc.pendidikan = chacePeriode[37]
                $scope.cc.agama = chacePeriode[38]
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
                $scope.aaa = true
                //chace periode
                $scope.item.obj[301501] = $scope.cc.namapasien
                $scope.item.obj[301502] = $scope.cc.nik
                $scope.item.obj[301505] = $scope.cc.jeniskelamin
                $scope.item.obj[301510] = $scope.cc.alamat
                $scope.item.obj[301506] = $scope.cc.suku
                $scope.item.obj[301507] = $scope.cc.pendidikan
                $scope.item.obj[301508] = $scope.cc.agama
                $scope.item.obj[301509] = $scope.cc.pekerjaan
                $scope.item.obj[301504] = $scope.cc.umur
                $scope.item.obj[301503] = $scope.cc.tempatLahir+"/"+ $scope.cc.tglLahir

                //end chace periode
                $scope.item.obj[116062] = $scope.now
                $scope.item.obj[116068] = {
                    text: $scope.cc.namaruangan,
                    value: $scope.cc.objectruanganfk
                }

                $scope.item.obj[116201] = true
                $scope.item.obj[116204] = true
                $scope.item.obj[116207] = true
                $scope.item.obj[116210] = true
                $scope.item.obj[116213] = true
                $scope.item.obj[116216] = true
                $scope.item.obj[116219] = true
                $scope.item.obj[116222] = true

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
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk 
                    // && paramsIndex == dataLoad[i].index
                    ) {
                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 21020553)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 3152)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21020630)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == "textbox2") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 21020553)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 3152)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21020630)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == 'textbox3') {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == 'textbox4') {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == 'radio') {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == 'textbox6') {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox0") {
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
                        if (dataLoad[i].type == "checkbox4") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "checkbox3p") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "checkboxgetadl") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
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
            $scope.$watch('item.obj[301821]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    console.log('y');
                    if ($scope.item.obj[301821] == "Ya") {
                        $scope.item301822 = false
                    }else{
                        $scope.item301822 = true
                    }
                }
            })
            $scope.$watch('item.obj[301823]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    console.log('y');
                    if ($scope.item.obj[301823] == "Ya") {
                        $scope.item301824 = false
                    } else {
                        $scope.item301824 = true
                    }
                }
            })
            $scope.$watch('item.obj[301825]', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    console.log('y');
                    if ($scope.item.obj[301825] == "Ya") {
                        $scope.item301826 = false
                    } else {
                        $scope.item301826 = true
                    }
                }
            })
            $scope.$watch('item.obj[116131]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[21020555] = true
                    $scope.item.obj[21020556] = false
                    $scope.item.obj[21020557] = false
                    $scope.item.obj[21020558] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[21020555] = false
                    $scope.item.obj[21020556] = true
                    $scope.item.obj[21020557] = false
                    $scope.item.obj[21020558] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[21020555] = false
                    $scope.item.obj[21020556] = false
                    $scope.item.obj[21020557] = true
                    $scope.item.obj[21020558] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[21020555] = false
                    $scope.item.obj[21020556] = false
                    $scope.item.obj[21020557] = false
                    $scope.item.obj[21020558] = true
                }
            });
            $scope.getSkorNutrisi = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {}
                }

                $scope.item.obj[21005225] = $scope.skorNutrisi
            }
            $scope.$watch('item.obj[116103]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116103] == true && $scope.item.obj[116108] == true) {
                        $scope.item.obj[116107] = true
                        $scope.item.obj[116106] = false
                    } else if ($scope.item.obj[116103] == true || $scope.item.obj[116108] == true) {
                        $scope.item.obj[116106] = true
                        $scope.item.obj[116107] = false
                        $scope.item.obj[116105] = false
                    }

                }

            })
            $scope.$watch('item.obj[116108]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116103] == true && $scope.item.obj[116108] == true) {
                        $scope.item.obj[116107] = true
                        $scope.item.obj[116106] = false
                        $scope.item.obj[116105] = false
                    } else if ($scope.item.obj[116103] == true || $scope.item.obj[116108] == true) {
                        $scope.item.obj[116106] = true
                        $scope.item.obj[116107] = false
                        $scope.item.obj[116105] = false
                    }

                }

            })
            $scope.$watch('item.obj[116104]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116104] == true && $scope.item.obj[116109] == true) {
                        $scope.item.obj[116105] = true
                        $scope.item.obj[116107] = false
                        $scope.item.obj[116106] = false
                    }

                }

            })
            $scope.$watch('item.obj[116109]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116104] == true && $scope.item.obj[116109] == true) {
                        $scope.item.obj[116105] = true
                        $scope.item.obj[116107] = false
                        $scope.item.obj[116106] = false
                    }

                }

            })
            $scope.$watch('item.obj[116103]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116103] == true) {
                        $scope.item.obj[116104] = false
                    }

                }

            })
            $scope.$watch('item.obj[116104]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116104] == true) {
                        $scope.item.obj[116103] = false
                    }

                }

            })
            $scope.$watch('item.obj[116108]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116108] == true) {
                        $scope.item.obj[116109] = false
                    }

                }

            })
            $scope.$watch('item.obj[116109]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116109] == true) {
                        $scope.item.obj[116108] = false
                    }

                }

            })
            $scope.$watch('item.obj[116063]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116063] != null) {
                        $scope.item.obj[116065] = $scope.cc.namapasien
                        $scope.item.obj[116066] = 'PASIEN'

                    }

                }

            })
            $scope.$watch('item.obj[116111]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116111] != null) {

                        var txtFirstNumberValue = $scope.item.obj[116110];
                        var txtSecondNumberValue = $scope.item.obj[116111];
                        var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));

                        if (result <= 18.4) {
                            $scope.item.obj[116112] = false
                            $scope.item.obj[116113] = false
                            $scope.item.obj[116114] = true
                        }
                        if (result >= 18.5 && result <= 24.9) {
                            $scope.item.obj[116112] = false
                            $scope.item.obj[116113] = true
                            $scope.item.obj[116114] = false
                        }
                        if (result > 25) {
                            $scope.item.obj[116112] = true
                            $scope.item.obj[116113] = false
                            $scope.item.obj[116114] = false
                        }

                    }

                }

            })
            $scope.$watch('item.obj[116110]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[116110] != null) {
                        var txtFirstNumberValue = $scope.item.obj[116110];
                        var txtSecondNumberValue = $scope.item.obj[116111];
                        var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));
                        if (!isNaN(result)) {
                            $scope.item.obj[1] = result;
                        }
                        if (result <= 18.4) {
                            $scope.item.obj[116112] = false
                            $scope.item.obj[116113] = false
                            $scope.item.obj[116114] = true
                        }
                        if (result >= 18.5 && result <= 24.9) {
                            $scope.item.obj[116112] = false
                            $scope.item.obj[116113] = true
                            $scope.item.obj[116114] = false
                        }
                        if (result > 25) {
                            $scope.item.obj[116112] = true
                            $scope.item.obj[116113] = false
                            $scope.item.obj[116114] = false
                        }

                    }

                }

            })
            $scope.skorNutrisi = 0
            // $scope.getSkorNutrisi = function (stat) {
            //     var arrobj = Object.keys($scope.item.obj)
            //     var arrSave = []
            //     for (var i = arrobj.length - 1; i >= 0; i--) {
            //         if (arrobj[i] == stat.id) {
            //             if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
            //                 $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(stat.descNilai)
            //                 break
            //             } else {
            //                 $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(stat.descNilai)
            //                 break
            //             }
            //         } else {
            //         }
            //     }
            //     $scope.item.obj[21020630] = $scope.skorNutrisi
            // }
            $scope.$watch('item.obj[115952]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >= 7 && nilai <= 11) {
                    $scope.item.obj[115953] = true
                    $scope.item.obj[115954] = false

                }
                if (nilai >= 12) {
                    $scope.item.obj[115953] = false
                    $scope.item.obj[115954] = true

                }

            })





            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[21020559] = true
                    $scope.item.obj[21020560] = false
                    $scope.item.obj[21020561] = false
                    $scope.item.obj[21020562] = false
                    $scope.item.obj[21020563] = false
                    $scope.item.obj[21020564] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[21020559] = false
                    $scope.item.obj[21020560] = true
                    $scope.item.obj[21020561] = false
                    $scope.item.obj[21020562] = false
                    $scope.item.obj[21020563] = false
                    $scope.item.obj[21020564] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[21020559] = false
                    $scope.item.obj[21020560] = false
                    $scope.item.obj[21020561] = true
                    $scope.item.obj[21020562] = false
                    $scope.item.obj[21020563] = false
                    $scope.item.obj[21020564] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[21020559] = false
                    $scope.item.obj[21020560] = false
                    $scope.item.obj[21020561] = false
                    $scope.item.obj[21020562] = true
                    $scope.item.obj[21020563] = false
                    $scope.item.obj[21020564] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[21020559] = false
                    $scope.item.obj[21020560] = false
                    $scope.item.obj[21020561] = false
                    $scope.item.obj[21020562] = false
                    $scope.item.obj[21020563] = true
                    $scope.item.obj[21020564] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[21020559] = false
                    $scope.item.obj[21020560] = false
                    $scope.item.obj[21020561] = false
                    $scope.item.obj[21020562] = false
                    $scope.item.obj[21020563] = false
                    $scope.item.obj[21020564] = true
                }

            }
            $scope.getSkor = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    // if (arrobj[i] == stat.id) {
                    //     if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                    //         $scope.totalSkor = $scope.totalSkor + parseFloat(stat.descNilai)
                    //         break
                    //     } else {
                    //         $scope.totalSkor = $scope.totalSkor - parseFloat(stat.descNilai)
                    //         break
                    //     }
                    // } else {
                    // }
                    // if (arrobj[i] == 3019476) {
                        
                    // }
                    // console.log(stat.cbotable.value);
                    if (stat.type == 'checkbox' ||
                        stat.type == 'checkbox3') {
                            console.log('a');
                        if (arrobj[i] == 301973 || arrobj[i] == 301974 || arrobj[i] == 301976 || arrobj[i] == 301977 || arrobj[i] == 301978 || arrobj[i] == 301979 || arrobj[i] == 301980 || arrobj[i] == 301981) {
                            console.log('b');
                            if (arrobj[i] == stat.id) {
                            console.log('c');
                                if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                                    console.log('d');
                                    $scope.skor1 = $scope.skor1 + parseFloat(stat.reportdisplay)
                                    break
                                } else {
                                    console.log('e');

                                    $scope.skor1 = $scope.skor1 - parseFloat(stat.reportdisplay)
                                    break
                                }
                            }
                        }
                    }
                    
                }
                $scope.item.obj[301939] = $scope.skor1
                
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }
            $scope.list =[{"name": "( 0 ) Tidak ada penurunan berat badan","id": 1,"value": "0"},{"name": "( 2 )Tidak yakin / tidak tahu / baju terasa lebih longgar","id": 2,"value": "2"},{"name": "Jika Ya, berapa penurunan BB tersebut","id": 3},]
            $scope.getSkoralegi = function (stat) {
                console.log(stat);
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    
                }
                $scope.item.obj[21020553] = $scope.totalSkor
            }
            
            $scope.getSkorAdl = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.reportdisplay)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.reportdisplay)
                            break
                        }


                    }
                }
                $scope.item.obj[301909] = $scope.totalSkor
            }
            $scope.$watch('item.obj[21020553]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[21020553]) == 0) {
                        $scope.item.obj[21020554] = 'Nyaman'
                    } else if (parseInt($scope.item.obj[21020553]) >= 1 && parseInt($scope.item.obj[21020553]) <= 3) {
                        $scope.item.obj[21020554] = 'Kurang Nyaman'
                    } else if (parseInt($scope.item.obj[21020553]) >= 4 && parseInt($scope.item.obj[21020553]) <= 6) {
                        $scope.item.obj[21020554] = 'Nyeri Sedang'
                    } else if (parseInt($scope.item.obj[21020553]) >= 7 && parseInt($scope.item.obj[21020553]) <= 10) {
                        $scope.item.obj[21020554] = 'Nyeri Berat'
                    } else
                        $scope.item.obj[21020554] = ''

                }
            })
            $scope.getSkor4 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor4 = $scope.totalSkor4 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor4 = $scope.totalSkor4 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[115952] = $scope.totalSkor4
            }
            // setSkorAkhir($scope.item.obj[3152])
            $scope.totalSkorAses = 0
            $scope.getSkorAsesmen = function (stat, skor) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
                            break
                        } else {
                            $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[5194] = $scope.totalSkorAses
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
                $scope.item.obj[5084] = $scope.totalSkor + $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.skorGizi = 0
            $scope.getSkorGizi = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorGizi = $scope.skorGizi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorGizi = $scope.skorGizi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {}
                }
                $scope.item.obj[115928] = $scope.skorGizi
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
            $scope.$watch('item.obj[14432]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai < 4) {
                    $scope.item.obj[14433] = true
                    $scope.item.obj[14434] = false

                }
                if (nilai >= 4) {
                    $scope.item.obj[14433] = false
                    $scope.item.obj[14434] = true

                }
            })
            // $scope.kembali = function () {
            //     $rootScope.showRiwayat()
            // }
            $scope.tambah = function () {
                let details = []
                for (let i = 0; i < $scope.listItem.length; i++) {
                    const element = $scope.listItem[i];
                    if (element.inuse == undefined) {
                        details.push(element.id)
                    }
                }
                if (details.length == 0) {
                    // $rootScope.showCppt2 = true;

                    toastr.info('Isi di Tab Berikutnya')
                    return
                }
                let json = {
                    noemr: nomorEMR,
                    emrfk: $scope.cc.emrfk,
                    details: details
                }
                medifirstService.postNonMessage("emr/get-status-dipake", json).then(function (dat) {
                    let result = dat.data.data
                    for (let j = 0; j < $scope.listItem.length; j++) {
                        const element = $scope.listItem[j];
                        for (let x = 0; x < result.length; x++) {
                            const element2 = result[x];
                            if (element.id == element2.emrdfk) {
                                element.inuse = true
                            }
                        }
                    }

                    for (let j = 0; j < $scope.listItem.length; j++) {
                        const element2 = $scope.listItem[j];
                        if (element2.inuse == undefined) {
                            $scope.item.obj[parseInt(element2.id)] = new Date()
                            saveTosDipake(element2.id)
                            break
                        }
                    }
                })


            }

            function saveTosDipake(id) {
                if (nomorEMR != '-') {
                    let json = {
                        noemr: nomorEMR,
                        emrfk: $scope.cc.emrfk,
                        id: id,
                        value: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    }
                    medifirstService.postNonMessage("emr/save-status-dipake", json).then(function (dat) {})
                }
            }
            $scope.Save = function () {
                // $scope.isRouteLoading = true
                // $scope.isLoadingNoKartu = true;

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
                // $scope.cc.index = $state.params.index
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                toastr.info('EMR akan segera tersimpan. Harap Tunggu!')
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                // $scope.isRouteLoading = false
                // $scope.isLoadingNoKartu = false;
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Asesmen Awal Keperawatan Jiwa Rawat Jalan ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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