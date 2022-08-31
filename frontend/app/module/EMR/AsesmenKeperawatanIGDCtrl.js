define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenKeperawatanIGDCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.skorNutrisiDewasa = 0
            $scope.skorNutrisiAnak = 0
            $scope.SkorSkalaFlacc = [];
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000407
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000407).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga= []
                var arrayShiftJaga2 = []
                var arrayShiftJaga3= []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false

                    // ARRAY GEJALA
                    if (element.kodeexternal == 'nyeri') {
                        for (let z = 0; z < arrayShiftJaga.length; z++) {
                            const element2 = arrayShiftJaga[z];
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
                            arrayShiftJaga.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'nyeri2') {
                        for (let z = 0; z < arrayShiftJaga2.length; z++) {
                            const element2 = arrayShiftJaga2[z];
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
                            arrayShiftJaga2.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                }
                // ARRAY GEJALA
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga.length; k++) {
                    const element = arrayShiftJaga[k];
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
                $scope.listData1 = arrayShiftJaga
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga2.length; k++) {
                    const element = arrayShiftJaga2[k];
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
                $scope.listData2 = arrayShiftJaga2
            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
            }
            

            $scope.listStatusFisik = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 3000825, "nama": "T", "satuan": "mmHg", "type": "textbox" },
                        { "id": 3000826, "nama": "N", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3000827, "nama": "R", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3000828, "nama": "T", "satuan": "°C", "type": "textbox" },
                        { "id": 3000829, "nama": "SaO2", "satuan": "%", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSkriningFungsional = [
                {
                    "id": 1,
                    "nama": "Skrining Fungsional",
                    "detail": [{
                            "id": 3001032,
                            "nama": "Alat Bantu",
                            "satuan": "",
                            "type": "textbox"
                        }, {
                            "id": 3001033,
                            "nama": "Prothesa",
                            "satuan": "",
                            "type": "textbox"
                        },
                        {
                            "nama": "ADL",
                            "type": "checkbox",
                            "details":[
                                {
                                    "id": 3001034,
                                    "nama": "Mandiri",
                                    "satuan": "",
                                    "type": "checkbox"
                                }, {
                                    "id": 3001035,
                                    "nama": "Dibantu",
                                    "satuan": "",
                                    "type": "checkbox"
                                },
                            ]
                        }
                        
                    ]
                }
            ]
            $scope.listSkriningNyeri = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3000830, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 3000831, "nama": "Ada, lokasi dan durasi", "satuan": "", "type": "textbox2", "idd": "3000832" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriNIPS = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3000836, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3000837, "nama": "1-2  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3000838, "nama": "3-4  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3000839, "nama": ">4   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriFlacc = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3000840, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3000841, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3000842, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3000843, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriWong = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3000844, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3000845, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3000846, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3000847, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
             
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 3001028, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 3001029, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 3001030, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 3001031, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
                ]
            }
        ]
        $scope.listNyeriAnak = [
            {
                "id": 10, "nama": "Hurts", "detail": [
                { "id": 111161, "nama": "Tidak Nyeri","nama1": "0", "descNilai": 0 },
                { "id": 111162, "nama": "Sedikit Nyeri", "nama1": "1 2 3", "descNilai": 2 }, 
                { "id": 111163, "nama": "Agak mengganggu", "nama1": "4", "descNilai": 4 },
                { "id": 111164, "nama": "Mengganggu Aktivitas","nama1": "5 6 7",  "descNilai": 6}, 
                { "id": 111165, "nama": "Sangat mengganggu", "nama1": "8", "descNilai": 8 },
                { "id": 111166, "nama": "Tak tertahankan", "nama1": "9 10",  "descNilai": 10 }
            ]
            }
        ]

        $scope.listSkorWong = [{
            "id": 9, "nama": "Score ",
            "detail": [
                { "id": 3000848, "nama": "0= Tidak Ada Nyeri", "type": "checkbox"},
                { "id": 3000849, "nama": "1 - 2 - 3= Sedikit Nyeri", "type": "checkbox"},
                { "id": 3000850, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                { "id": 3000851, "nama": "5 - 6 - 7= Mengganggu aktivitas", "type": "checkbox"},
                { "id": 3000852, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                { "id": 3000853, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
            ]
        }]
            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 3000848, "nama": "Tidak Nyeri", "type": "checkbox" },
                        { "id": 3000849, "nama": "Sedikit Nyeri", "type": "checkbox" },
                        { "id": 3000850, "nama": "Agak Mengganggu", "type": "checkbox" },
                        { "id": 3000851, "nama": "Mengganggu Aktivitas", "type": "checkbox" },
                        { "id": 3000852, "nama": "Sangat Mengganggu", "type": "checkbox" },
                        { "id": 3000853, "nama": "Tak Tertahankan", "type": "checkbox" },
                    ]
                },
            ]


            $scope.listRisikoJatuh = [
                {
                    "id": 1, "nama": "Risiko Jatuh",
                    "detail": [
                        { "id": 3000860, "nama": "Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listJalanNafas = [
                {
                    "id": 1, "nama": "Jalan Nafas",
                    "detail": [
                        { "id": 3000862, "nama": "Bebas", "satuan": "", "type": "checkbox" },
                        { "id": 3000863, "nama": "Tersumbat sebagian", "satuan": "", "type": "checkbox" },
                        { "id": 3000864, "nama": "Tersumbat Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPengembanganParu = [
                {
                    "id": 1, "nama": "Pengembangan Paru",
                    "detail": [
                        { "id": 3000865, "nama": "Simetris", "satuan": "", "type": "checkbox" },
                        { "id": 3000866, "nama": "Asimetris", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPolaNafas = [
                {
                    "id": 1, "nama": "Pola Nafas",
                    "detail": [
                        { "id": 3000867, "nama": "Normal/Eupnea", "satuan": "", "type": "checkbox" },
                        { "id": 3000868, "nama": "Bradipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3000869, "nama": "Tachipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3000870, "nama": "Dispnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3000871, "nama": "Apnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3000872, "nama": "Cheynestoke", "satuan": "", "type": "checkbox" },
                        { "id": 3000873, "nama": "Kussmaul", "satuan": "", "type": "checkbox" },
                        { "id": 3000874, "nama": "Biot", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listSuaraNafas = [
                {
                    "id": 1, "nama": "Suara Nafas",
                    "detail": [
                        { "id": 3000875, "nama": "Vesikuler", "satuan": "", "type": "checkbox" },
                        { "id": 3000876, "nama": "Ronchi", "satuan": "", "type": "checkbox" },
                        { "id": 3000877, "nama": "Wheezing", "satuan": "", "type": "checkbox" },
                        { "id": 3000878, "nama": "Stridor", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKulit = [
                {
                    "id": 1, "nama": "Kulit",
                    "detail": [
                        { "id": 3000879, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 3000880, "nama": "Pucat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listWarnaMembran = [
                {
                    "id": 1, "nama": "Warna Membran",
                    "detail": [
                        { "id": 3000881, "nama": "Merah", "satuan": "", "type": "checkbox" },
                        { "id": 3000882, "nama": "Abu-abu", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
           
            $scope.listAkralKulit = [
                {
                    "id": 1, "nama": "Akral Kulit",
                    "detail": [
                        { "id": 3000883, "nama": "Hangat", "satuan": "", "type": "checkbox" },
                        { "id": 3000884, "nama": "Dingin", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMukosa = [
                {
                    "id": 1, "nama": "Mukosa",
                    "detail": [
                        { "id": 3000885, "nama": "Basah", "satuan": "", "type": "checkbox" },
                        { "id": 3000886, "nama": "Kering", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listCRT = [
                {
                    "id": 1, "nama": "Pengisian Kapiler / CRT",
                    "detail": [
                        { "id": 3000887, "nama": "<=2 detik", "satuan": "", "type": "checkbox" },
                        { "id": 3000888, "nama": ">=2 detik", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listNadi = [
                {
                    "id": 1, "nama": "Nadi",
                    "detail": [
                        { "id": 3000889, "nama": "Kuat", "satuan": "", "type": "checkbox" },
                        { "id": 3000890, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listRitme = [
                {
                    "id": 1, "nama": "Ritme",
                    "detail": [
                        { "id": 3000891, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 3000892, "nama": "Tidak teratur", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listGCS = [
                {
                    "id": 1, "nama": "A. GCS ",
                    "detail": [
                        { "id": 3000893, "nama": "GCS :", "satuan": "", "type": "textbox" },
                        { "id": 3000894, "nama": "E :", "satuan": "", "type": "textbox" },
                        { "id": 3000895, "nama": "V :", "satuan": "", "type": "textbox" },
                        { "id": 3000896, "nama": "M :", "satuan": "", "type": "textbox" },
                    ]
                }
            ]
            $scope.listKesadaran = [
                {
                    "id": 1, "nama": "Kesadaran",
                    "detail": [
                        { "id": 3000897, "nama": "Composmentis", "satuan": "", "type": "checkbox" },
                        { "id": 3000898, "nama": "Apatis", "satuan": "", "type": "checkbox" },
                        { "id": 3000899, "nama": "Somnolen", "satuan": "", "type": "checkbox" },
                        { "id": 3000900, "nama": "Stupor", "satuan": "", "type": "checkbox" },
                        { "id": 3000901, "nama": "Delirium", "satuan": "", "type": "checkbox" },
                        { "id": 3000902, "nama": "Coma", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listDataFokus1 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3000903, "nama": "Ada percobaan bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3000904, "nama": "Ada ide bunuh diri / isyarat bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3000905, "nama": "Mengungkapkan keinginan untuk bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3000906, "nama": "Perilaku agresif / amuk", "satuan": "", "type": "checkbox" },
                        { "id": 3000907, "nama": "Melukai diri sendiri / orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3000908, "nama": "Merusak lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3000909, "nama": "Bicara kasar, suara keras, bicara ketus", "satuan": "", "type": "checkbox" },
                        { "id": 3000910, "nama": "Mengancam", "satuan": "", "type": "checkbox" },
                        { "id": 3000911, "nama": "Ada Riwayat / ide perilaku kekerasan", "satuan": "", "type": "checkbox" },
                        { "id": 3000912, "nama": "Tegang", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listHalusinasi = [
                {
                    "id": 1, "nama": "Halusinasi",
                    "detail": [
                        { "id": 3000914, "nama": "Penglihatan", "satuan": "", "type": "checkbox" },
                        { "id": 3000915, "nama": "Pendengaran", "satuan": "", "type": "checkbox" },
                        { "id": 3000916, "nama": "Pengecapan", "satuan": "", "type": "checkbox" },
                        { "id": 3000917, "nama": "Perabaan", "satuan": "", "type": "checkbox" },
                        { "id": 3000918, "nama": "Penciuman", "satuan": "Lainnya", "type": "textbox2", "idd": "3000919" },
                    ]
                }
            ] 
            $scope.listIsiWaham = [
                {
                    "id": 1, "nama": "Mengungkapkan isi waham",
                    "detail": [
                        { "id": 3000921, "nama": "Curiga", "satuan": "", "type": "checkbox" },
                        { "id": 3000922, "nama": "Agama", "satuan": "", "type": "checkbox" },
                        { "id": 3000923, "nama": "Kebesaran", "satuan": "", "type": "checkbox" },
                        { "id": 3000924, "nama": "Nihilistik", "satuan": "", "type": "checkbox" },
                        { "id": 3000925, "nama": "Kejar", "satuan": "", "type": "checkbox" },
                        { "id": 3000926, "nama": "Magic Mistik", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listDataFokus2 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3000927, "nama": "Menunjukan perilaku sesuai isi waham", "satuan": "", "type": "checkbox" },
                        { "id": 3000928, "nama": "Merasa ingin sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3000929, "nama": "Menarik diri", "satuan": "", "type": "checkbox" },
                        { "id": 3000930, "nama": "Menilai diri negatif", "satuan": "", "type": "checkbox" },
                        { "id": 3000931, "nama": "Tidak mampu berbicara atau mendengar", "satuan": "", "type": "checkbox" },
                        { "id": 3000932, "nama": "Merasa khawatir", "satuan": "", "type": "checkbox" },
                        { "id": 3000933, "nama": "Bingung", "satuan": "", "type": "checkbox" },
                        { "id": 3000934, "nama": "Gelisah", "satuan": "", "type": "checkbox" },
                        { "id": 3000935, "nama": "Sulit tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3000936, "nama": "Sulit Konsentrasi", "satuan": "", "type": "checkbox" },
                        { "id": 3000937, "nama": "Gangguan memori", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMenolakPerawatanDiri = [
                {
                    "id": 1, "nama": "Menolak Perawatan Diri",
                    "detail": [
                        { "id": 3000939, "nama": "Mandi", "satuan": "", "type": "checkbox" },
                        { "id": 3000940, "nama": "Berhias", "satuan": "", "type": "checkbox" },
                        { "id": 3000941, "nama": "Makan", "satuan": "", "type": "checkbox" },
                        { "id": 3000942, "nama": "Berpakaian", "satuan": "", "type": "checkbox" },
                        { "id": 3000943, "nama": "Toileting", "satuan": "Lainnya", "type": "textbox2", "idd": "3000944" },
                    ]
                }
            ] 
            $scope.listDataFokus3 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3000947, "nama": "Batuk tidak efektif / tidak mampu batuk", "satuan": "", "type": "checkbox" },
                        { "id": 3000948, "nama": "Penggunaan otot bantu nafas", "satuan": "", "type": "checkbox" },
                        { "id": 3000949, "nama": "Sianosis", "satuan": "", "type": "checkbox" },
                        { "id": 3000950, "nama": "Hipergilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 3000951, "nama": "Hipogilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 3000952, "nama": "Mengantuk", "satuan": "", "type": "checkbox" },
                        { "id": 3000953, "nama": "Lesu", "satuan": "", "type": "checkbox" },
                        { "id": 3000954, "nama": "Nadi perifer menurun / tidak teraba", "satuan": "", "type": "checkbox" },
                        { "id": 3000955, "nama": "Mengeluh mual dan muntah", "satuan": "", "type": "checkbox" },
                        { "id": 3000956, "nama": "BAB cair > 3 kali / 24 jam", "satuan": "", "type": "checkbox" },
                        { "id": 3000957, "nama": "Turgor kulit menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3000958, "nama": "Volume urin menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3000959, "nama": "Rasa haus meningkat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listStatusKesadaran = [
                {
                    "id": 1, "nama": "Menolak Perawatan Diri",
                    "detail": [
                        { "id": 3000961, "nama": "A", "satuan": "", "type": "checkbox" },
                        { "id": 3000962, "nama": "P", "satuan": "", "type": "checkbox" },
                        { "id": 3000963, "nama": "V", "satuan": "", "type": "checkbox" },
                        { "id": 3000964, "nama": "U", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMasalahUmum = [
                {
                    "id": 1, "nama": "Masalah Keperawatan Umum",
                    "detail": [
                        { "id": 3000968, "nama": "Bersihan jalan nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3000969, "nama": "Gangguan ventilasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3000970, "nama": "Gangguan sirkulasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3000971, "nama": "Pola nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3000972, "nama": "Perfusi perifer tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3000973, "nama": "Nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 3000974, "nama": "Ketidakstabilan gula darah", "satuan": "", "type": "checkbox" },
                        { "id": 3000975, "nama": "Gangguan integritas kulit", "satuan": "", "type": "checkbox" },
                        { "id": 3000976, "nama": "Hipertemia", "satuan": "", "type": "checkbox" },
                        { "id": 3000977, "nama": "Diare", "satuan": "", "type": "checkbox" },
                        { "id": 3000978, "nama": "Hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3000979, "nama": "Resiko jatuh", "satuan": "", "type": "checkbox" },
                        { "id": 3000980, "nama": "Resiko cidera", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMasalahJiwa = [
                {
                    "id": 1, "nama": "Masalah Keperawatan Jiwa",
                    "detail": [
                        { "id": 3000983, "nama": "Perilaku kekerasan", "satuan": "", "type": "checkbox" },
                        { "id": 3000984, "nama": "Risiko bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3000985, "nama": "Risiko perilaku kekekrasan", "satuan": "", "type": "checkbox" },
                        { "id": 3000986, "nama": "Gangguan persepsi sensori", "satuan": "", "type": "checkbox" },
                        { "id": 3000987, "nama": "Gangguan proses pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3000988, "nama": "Defisit perawatan diri", "type": "checkbox" },
                        { "id": 3000989, "nama": "Isolasi sosial", "satuan": "", "type": "checkbox" },
                        { "id": 3000990, "nama": "Harga diri rendah", "satuan": "", "type": "checkbox" },
                        { "id": 3000991, "nama": "Ansietas", "satuan": "", "type": "checkbox" },
                        { "id": 3000992, "nama": "Kesiapan peningkatan manajemen kesehatan", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
    
          

            $scope.listNutrisionalAnak = [
                {
                    "id": 1,  "no": 1, "nama":" Apakah ada penyakit yang mendasari dengan risiko malnutrisi atau apakah ada pembedahan besar ?",
                    "detail": [
                        { "id": 3000997, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3000998, "nama": "b. Ya", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah Pasien dalam kondisi status gizi buruk berdasarkan pemeriksaan klinis secara subyektif ?",
                    "detail": [
                        { "id": 3000999, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3001000, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 1, "nama": "Apakah hal hal dibawah ini ditemukan pada anak ? a. Diare berlebihan > 5 kali/hari dan atau muntah > 3 kali/hari c. Penurunan asupan makanan selama beberapa hari terakhir d. Intervensi gizi yang sudah ada sebelumnya e. Ketidak cukupan asupan gizi karena sakit",
                    "detail": [
                        { "id": 3001001, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3001002, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah ada penurunan berat badan atau tidak adanya penambahan berat badan ( untuk bayi < 1 th) selama beberapa minggu / bulan terakhir ",
                    "detail": [
                        { "id": 3001003, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3001004, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 3001007, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3001008, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 3001009, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3001010, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3001011, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 3001012, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 3001013, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 3001014, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3001015, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 3001019, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 3001020, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        {"id": 3001021, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 3001022, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        {"id": 3001023, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 3001024, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3001025"},
                    ]
                }
            ]
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3001017, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3001018, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]

           
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
            var chekedd = false;

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[116062]=$scope.now
                $scope.item.obj[116068]={text:$scope.cc.namaruangan,value: $scope.cc.objectruanganfk}

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
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if(dataLoad[i].emrdfk == 115952)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 3152)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 115928)
                                $scope.skorGizi = parseFloat(dataLoad[i].value)
                               
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiDewasa(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }

                            
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
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
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
            $scope.$watch('item.obj[116131]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[3001028] = true
                    $scope.item.obj[3001029] = false
                    $scope.item.obj[3001030] = false
                    $scope.item.obj[3001031] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[3001028] = false
                    $scope.item.obj[3001029] = true   
                    $scope.item.obj[3001030] = false
                    $scope.item.obj[3001031] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[3001028] = false
                    $scope.item.obj[3001029] = false
                    $scope.item.obj[3001030] = true
                    $scope.item.obj[3001031] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[3001028] = false
                    $scope.item.obj[3001029] = false
                    $scope.item.obj[3001030] = false
                    $scope.item.obj[3001031] = true
                }
            });

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[3000848] = true
                    $scope.item.obj[3000849] = false
                    $scope.item.obj[3000850] = false
                    $scope.item.obj[3000851] = false
                    $scope.item.obj[3000852] = false
                    $scope.item.obj[3000853] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[3000848] = false
                    $scope.item.obj[3000849] = true
                    $scope.item.obj[3000850] = false
                    $scope.item.obj[3000851] = false
                    $scope.item.obj[3000852] = false
                    $scope.item.obj[3000853] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[3000848] = false
                    $scope.item.obj[3000849] = false
                    $scope.item.obj[3000850] = true
                    $scope.item.obj[3000851] = false
                    $scope.item.obj[3000852] = false
                    $scope.item.obj[3000853] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[3000848] = false
                    $scope.item.obj[3000849] = false
                    $scope.item.obj[3000850] = false
                    $scope.item.obj[3000851] = true
                    $scope.item.obj[3000852] = false
                    $scope.item.obj[3000853] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[3000848] = false
                    $scope.item.obj[3000849] = false
                    $scope.item.obj[3000850] = false
                    $scope.item.obj[3000851] = false
                    $scope.item.obj[3000852] = true
                    $scope.item.obj[3000853] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[3000848] = false
                    $scope.item.obj[3000849] = false
                    $scope.item.obj[3000850] = false
                    $scope.item.obj[3000851] = false
                    $scope.item.obj[3000852] = false
                    $scope.item.obj[3000853] = true
                }

            }
            
            $scope.$watch('item.obj[116103]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true && $scope.item.obj[116108]== true){
                          $scope.item.obj[116107] = true
                          $scope.item.obj[116106]= false
                      }else if ($scope.item.obj[116103] ==true || $scope.item.obj[116108] ==true  ) {
                        $scope.item.obj[116106]= true
                        $scope.item.obj[116107]= false
                        $scope.item.obj[116105]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116108]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true && $scope.item.obj[116108]== true){
                          $scope.item.obj[116107] = true
                          $scope.item.obj[116106]= false
                          $scope.item.obj[116105]= false
                      }else if ($scope.item.obj[116103] ==true || $scope.item.obj[116108] ==true  ) {
                        $scope.item.obj[116106]= true
                        $scope.item.obj[116107]= false
                        $scope.item.obj[116105]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116104]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true && $scope.item.obj[116109]== true){
                          $scope.item.obj[116105] = true
                          $scope.item.obj[116107]= false
                          $scope.item.obj[116106]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116109]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true && $scope.item.obj[116109]== true){
                          $scope.item.obj[116105] = true
                          $scope.item.obj[116107]= false
                          $scope.item.obj[116106]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116103]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true){
                          $scope.item.obj[116104] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116104]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true){
                          $scope.item.obj[116103] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116108]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116108] ==true){
                          $scope.item.obj[116109] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116109]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116109] ==true){
                          $scope.item.obj[116108] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116063]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116063] !=null ){
                          $scope.item.obj[116065] = $scope.cc.namapasien
                          $scope.item.obj[116066] = 'PASIEN'
                          
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116111]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116111] !=null ){

                                  var txtFirstNumberValue =  $scope.item.obj[116110];
                                  var txtSecondNumberValue =  $scope.item.obj[116111];
                                  var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));

                            if (result <= 18.4) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = true
                            }
                            if (result >= 18.5 && result <=24.9) {
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
            $scope.$watch('item.obj[116110]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116110] !=null ){
                                  var txtFirstNumberValue =  $scope.item.obj[116110];
                                  var txtSecondNumberValue =  $scope.item.obj[116111];
                                  var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));
                                  if (!isNaN(result)) {
                                     $scope.item.obj[1] = result;
                            }
                             if (result <= 18.4) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = true
                            }
                            if (result >= 18.5 && result <=24.9) {
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
                
            $scope.SkorSkalaFlacc[21008224] = 0;
            $scope.SkorSkalaFlacc[21008229] = 0;
            $scope.SkorSkalaFlacc[21008234] = 0;
            $scope.SkorSkalaFlacc[21008239] = 0;
            $scope.SkorSkalaFlacc[21008244] = 0;
            $scope.getSkorSkalaFlacc = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorSkalaFlacc[jawab.target] = $scope.SkorSkalaFlacc[jawab.target] + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorSkalaFlacc[jawab.target] = $scope.SkorSkalaFlacc[jawab.target] - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[jawab.target] = $scope.SkorSkalaFlacc[jawab.target]
                setSkor();
            }


            function setSkor()
            {
                var nilai1 = $scope.SkorSkalaFlacc[21008224]
                var nilai2 = $scope.SkorSkalaFlacc[21008229]
                var nilai3 = $scope.SkorSkalaFlacc[21008234]
                var nilai4 = $scope.SkorSkalaFlacc[21008239]
                var nilai5 = $scope.SkorSkalaFlacc[21008244]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4 + nilai5
                $scope.item.obj[21008245] = total;
                
            }
   
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
                    } else {
                    }
                }

                $scope.item.obj[21008395] = $scope.skorNutrisi
            }
            $scope.$watch('item.obj[115952]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >=7 && nilai <=11 ) {
                    $scope.item.obj[115953] = true
                    $scope.item.obj[115954] = false
                   
                }
                if (nilai >= 12) {
                    $scope.item.obj[115953] = false
                    $scope.item.obj[115954] = true
                 
                }
                
            })


            
                

           

            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }
            $scope.getSkoralegi = function (stat) {

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
                $scope.item.obj[21000092] = $scope.totalSkor
            }
            $scope.$watch('item.obj[115855]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if(parseInt($scope.item.obj[21000092]) == 0 ){
                          $scope.item.obj[21000093] ='Nyaman'
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 1 && parseInt($scope.item.obj[21000092]) <= 3){
                          $scope.item.obj[21000093] ='Kurang Nyaman' 
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 4 && parseInt($scope.item.obj[21000092]) <= 6){
                          $scope.item.obj[21000093] ='Nyeri Sedang' 
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 7 && parseInt($scope.item.obj[21000092]) <= 10){
                          $scope.item.obj[21000093] ='Nyeri Berat' 
                      }
                      else
                      $scope.item.obj[21000093] =''
                       
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
            $scope.skorNutrisiDewasa = 0
            $scope.getSkorNutrisiDewasa = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisiDewasa = $scope.skorNutrisiDewasa + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisiDewasa = $scope.skorNutrisiDewasa - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[3001016] = $scope.skorNutrisiDewasa
            }

            $scope.skorNutrisiAnak = 0
            $scope.getSkorNutrisiAnak = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisiAnak = $scope.skorNutrisiAnak + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisiAnak = $scope.skorNutrisiAnak - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[3001005] = $scope.skorNutrisiAnak
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
            $scope.getSkorGizi= function (stat) {
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
                    } else {
                    }
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


                if (nilai < 4 ) {
                    $scope.item.obj[14433] = true
                    $scope.item.obj[14434] = false
                   
                }
                if (nilai >= 4) {
                    $scope.item.obj[14433] = false
                    $scope.item.obj[14434] = true
                 
                }
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
                    'AsesmenKeperawatanIGDCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
