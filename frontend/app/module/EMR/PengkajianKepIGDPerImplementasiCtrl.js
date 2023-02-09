define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianKepIGDPerImplementasiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000543
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000543).then(function (e) {

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
                        { "id": 3017702, "nama": "T", "satuan": "mmHg", "type": "textbox" },
                        { "id": 3017703, "nama": "N", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3017704, "nama": "R", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3017705, "nama": "T", "satuan": "°C", "type": "textbox" },
                        { "id": 3017706, "nama": "SaO2", "satuan": "%", "type": "textbox" },
                    ]
                }
            ]
            
            $scope.listSkriningNyeri = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3017707, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 3017708, "nama": "Ada, lokasi dan durasi", "satuan": "", "type": "textbox2", "idd": "3017709" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriNIPS = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3017713, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3017714, "nama": "1-2  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3017715, "nama": "3-4  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3017716, "nama": ">4   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriFlacc = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3017717, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3017718, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3017719, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3017720, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriWong = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3017721, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3017722, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3017723, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3017724, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
             
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 3017960, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 3017961, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 3017962, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 3017963, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
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
                { "id": 3017725, "nama": "0= Tidak Ada Nyeri", "type": "checkbox"},
                { "id": 3017726, "nama": "1 - 2 - 3= Sedikit Nyeri", "type": "checkbox"},
                { "id": 3017727, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                { "id": 3017728, "nama": "5 - 6 - 7= Mengganggu aktivitas", "type": "checkbox"},
                { "id": 3017729, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                { "id": 3017730, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
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
                        { "id": 3017737, "nama": "Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point 1 / 2", "satuan": "", "type": "checkbox" },
                        { "id": 3017738, "nama": "Ada Risiko Jatuh, bila ditemukan salah satu dari point 1 / 2", "satuan": "", "type": "checkbox" },
                        { "id": 3017739, "nama": "Risiko Jatuh Tinggi, bila ditemukan 1 dan 2", "satuan": "", "type": "checkbox" },
                        { "id": 3017740, "nama": "Tindakan : ", "satuan": "", "type": "label2" },
                        { "id": 3017741, "nama": "Edukasi", "satuan": "", "type": "checkbox" },
                        { "id": 3017742, "nama": "Pemberian Tanda Risiko Jatuh", "satuan": "", "type": "checkbox" },
                        { "id": 3017743, "nama": "Pemberian Tempat Duduk Prioritas", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listJalanNafas = [
                {
                    "id": 1, "nama": "Jalan Nafas",
                    "detail": [
                        { "id": 3017744, "nama": "Bebas", "satuan": "", "type": "checkbox" },
                        { "id": 3017745, "nama": "Tersumbat sebagian", "satuan": "", "type": "checkbox" },
                        { "id": 3017746, "nama": "Tersumbat Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPengembanganParu = [
                {
                    "id": 1, "nama": "Pengembangan Paru",
                    "detail": [
                        { "id": 3017747, "nama": "Simetris", "satuan": "", "type": "checkbox" },
                        { "id": 3017748, "nama": "Asimetris", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPolaNafas = [
                {
                    "id": 1, "nama": "Pola Nafas",
                    "detail": [
                        { "id": 3017749, "nama": "Normal/Eupnea", "satuan": "", "type": "checkbox" },
                        { "id": 3017750, "nama": "Bradipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3017751, "nama": "Tachipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3017752, "nama": "Dispnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3017753, "nama": "Apnoe", "satuan": "", "type": "checkbox" },
                        { "id": 3017754, "nama": "Cheynestoke", "satuan": "", "type": "checkbox" },
                        { "id": 3017755, "nama": "Kussmaul", "satuan": "", "type": "checkbox" },
                        { "id": 3017756, "nama": "Biot", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listSuaraNafas = [
                {
                    "id": 1, "nama": "Suara Nafas",
                    "detail": [
                        { "id": 3017757, "nama": "Vesikuler", "satuan": "", "type": "checkbox" },
                        { "id": 3017758, "nama": "Ronchi", "satuan": "", "type": "checkbox" },
                        { "id": 3017759, "nama": "Wheezing", "satuan": "", "type": "checkbox" },
                        { "id": 3017760, "nama": "Stridor", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKulit = [
                {
                    "id": 1, "nama": "Kulit",
                    "detail": [
                        { "id": 3017761, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 3017762, "nama": "Pucat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listWarnaMembran = [
                {
                    "id": 1, "nama": "Warna Membran",
                    "detail": [
                        { "id": 3017763, "nama": "Merah", "satuan": "", "type": "checkbox" },
                        { "id": 3017764, "nama": "Abu-abu", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
           
            $scope.listAkralKulit = [
                {
                    "id": 1, "nama": "Akral Kulit",
                    "detail": [
                        { "id": 3017765, "nama": "Hangat", "satuan": "", "type": "checkbox" },
                        { "id": 3017766, "nama": "Dingin", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMukosa = [
                {
                    "id": 1, "nama": "Mukosa",
                    "detail": [
                        { "id": 3017767, "nama": "Basah", "satuan": "", "type": "checkbox" },
                        { "id": 3017768, "nama": "Kering", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listCRT = [
                {
                    "id": 1, "nama": "Pengisian Kapiler / CRT",
                    "detail": [
                        { "id": 3017769, "nama": "<=2 detik", "satuan": "", "type": "checkbox" },
                        { "id": 3017770, "nama": ">=2 detik", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listNadi = [
                {
                    "id": 1, "nama": "Nadi",
                    "detail": [
                        { "id": 3017771, "nama": "Kuat", "satuan": "", "type": "checkbox" },
                        { "id": 3017772, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listRitme = [
                {
                    "id": 1, "nama": "Ritme",
                    "detail": [
                        { "id": 3017773, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 3017774, "nama": "Tidak teratur", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listGCS = [
                {
                    "id": 1, "nama": "A. GCS ",
                    "detail": [
                        { "id": 3017775, "nama": "GCS :", "satuan": "", "type": "textbox" },
                        { "id": 3017776, "nama": "E :", "satuan": "", "type": "textbox" },
                        { "id": 3017777, "nama": "V :", "satuan": "", "type": "textbox" },
                        { "id": 3017778, "nama": "M :", "satuan": "", "type": "textbox" },
                    ]
                }
            ]
            $scope.listKesadaran = [
                {
                    "id": 1, "nama": "Kesadaran",
                    "detail": [
                        { "id": 3017779, "nama": "Composmentis", "satuan": "", "type": "checkbox" },
                        { "id": 3017780, "nama": "Apatis", "satuan": "", "type": "checkbox" },
                        { "id": 3017781, "nama": "Somnolen", "satuan": "", "type": "checkbox" },
                        { "id": 3017782, "nama": "Stupor", "satuan": "", "type": "checkbox" },
                        { "id": 3017783, "nama": "Delirium", "satuan": "", "type": "checkbox" },
                        { "id": 3017784, "nama": "Coma", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listDataFokus1 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3017785, "nama": "Ada percobaan bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3017786, "nama": "Ada ide bunuh diri / isyarat bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3017787, "nama": "Mengungkapkan keinginan untuk bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3017788, "nama": "Perilaku agresif / amuk", "satuan": "", "type": "checkbox" },
                        { "id": 3017789, "nama": "Melukai diri sendiri / orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3017790, "nama": "Merusak lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3017791, "nama": "Bicara kasar, suara keras, bicara ketus", "satuan": "", "type": "checkbox" },
                        { "id": 3017792, "nama": "Mengancam", "satuan": "", "type": "checkbox" },
                        { "id": 3017793, "nama": "Ada Riwayat / ide perilaku kekerasan", "satuan": "", "type": "checkbox" },
                        { "id": 3017794, "nama": "Tegang", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listHalusinasi = [
                {
                    "id": 1, "nama": "Halusinasi",
                    "detail": [
                        { "id": 3017796, "nama": "Penglihatan", "satuan": "", "type": "checkbox" },
                        { "id": 3017797, "nama": "Pendengaran", "satuan": "", "type": "checkbox" },
                        { "id": 3017798, "nama": "Pengecapan", "satuan": "", "type": "checkbox" },
                        { "id": 3017799, "nama": "Perabaan", "satuan": "", "type": "checkbox" },
                        { "id": 3017800, "nama": "Penciuman", "satuan": "Lainnya", "type": "textbox2", "idd": "3017801" },
                    ]
                }
            ] 
            $scope.listIsiWaham = [
                {
                    "id": 1, "nama": "Mengungkapkan isi waham",
                    "detail": [
                        { "id": 3017803, "nama": "Curiga", "satuan": "", "type": "checkbox" },
                        { "id": 3017804, "nama": "Agama", "satuan": "", "type": "checkbox" },
                        { "id": 3017805, "nama": "Kebesaran", "satuan": "", "type": "checkbox" },
                        { "id": 3017806, "nama": "Nihilistik", "satuan": "", "type": "checkbox" },
                        { "id": 3017807, "nama": "Kejar", "satuan": "", "type": "checkbox" },
                        { "id": 3017808, "nama": "Magic Mistik", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listDataFokus2 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3017809, "nama": "Menunjukan perilaku sesuai isi waham", "satuan": "", "type": "checkbox" },
                        { "id": 3017810, "nama": "Merasa ingin sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3017811, "nama": "Menarik diri", "satuan": "", "type": "checkbox" },
                        { "id": 3017812, "nama": "Menilai diri negatif", "satuan": "", "type": "checkbox" },
                        { "id": 3017813, "nama": "Tidak mampu berbicara atau mendengar", "satuan": "", "type": "checkbox" },
                        { "id": 3017814, "nama": "Merasa khawatir", "satuan": "", "type": "checkbox" },
                        { "id": 3017815, "nama": "Bingung", "satuan": "", "type": "checkbox" },
                        { "id": 3017816, "nama": "Gelisah", "satuan": "", "type": "checkbox" },
                        { "id": 3017817, "nama": "Sulit tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3017818, "nama": "Sulit Konsentrasi", "satuan": "", "type": "checkbox" },
                        { "id": 3017819, "nama": "Gangguan memori", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMenolakPerawatanDiri = [
                {
                    "id": 1, "nama": "Menolak Perawatan Diri",
                    "detail": [
                        { "id": 3017821, "nama": "Mandi", "satuan": "", "type": "checkbox" },
                        { "id": 3017822, "nama": "Berhias", "satuan": "", "type": "checkbox" },
                        { "id": 3017823, "nama": "Makan", "satuan": "", "type": "checkbox" },
                        { "id": 3017824, "nama": "Berpakaian", "satuan": "", "type": "checkbox" },
                        { "id": 3017825, "nama": "Toileting", "satuan": "Lainnya", "type": "textbox2", "idd": "3017826" },
                    ]
                }
            ] 
            $scope.listDataFokus3 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 3017829, "nama": "Batuk tidak efektif / tidak mampu batuk", "satuan": "", "type": "checkbox" },
                        { "id": 3017830, "nama": "Penggunaan otot bantu nafas", "satuan": "", "type": "checkbox" },
                        { "id": 3017831, "nama": "Sianosis", "satuan": "", "type": "checkbox" },
                        { "id": 3017832, "nama": "Hipergilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 3017833, "nama": "Hipogilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 3017834, "nama": "Mengantuk", "satuan": "", "type": "checkbox" },
                        { "id": 3017835, "nama": "Lesu", "satuan": "", "type": "checkbox" },
                        { "id": 3017836, "nama": "Nadi perifer menurun / tidak teraba", "satuan": "", "type": "checkbox" },
                        { "id": 3017837, "nama": "Mengeluh mual dan muntah", "satuan": "", "type": "checkbox" },
                        { "id": 3017838, "nama": "BAB cair > 3 kali / 24 jam", "satuan": "", "type": "checkbox" },
                        { "id": 3017839, "nama": "Turgor kulit menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3017840, "nama": "Volume urin menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3017841, "nama": "Rasa haus meningkat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listStatusKesadaran = [
                {
                    "id": 1, "nama": "Menolak Perawatan Diri",
                    "detail": [
                        { "id": 3017843, "nama": "A", "satuan": "", "type": "checkbox" },
                        { "id": 3017844, "nama": "P", "satuan": "", "type": "checkbox" },
                        { "id": 3017845, "nama": "V", "satuan": "", "type": "checkbox" },
                        { "id": 3017846, "nama": "U", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMasalahUmum = [
                {
                    "id": 1, "nama": "Masalah Keperawatan Umum",
                    "detail": [
                        { "id": 3017850, "nama": "Bersihan jalan nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3017851, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017852, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017853, "nama": "Gangguan ventilasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3017854, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017855, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017856, "nama": "Gangguan sirkulasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3017857, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017858, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017859, "nama": "Pola nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3017860, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017861, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017862, "nama": "Perfusi perifer tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3017863, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017864, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017865, "nama": "Nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 3017866, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017867, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017868, "nama": "Ketidakstabilan gula darah", "satuan": "", "type": "checkbox" },
                        { "id": 3017869, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017870, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017871, "nama": "Gangguan integritas kulit", "satuan": "", "type": "checkbox" },
                        { "id": 3017872, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017873, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017874, "nama": "Hipertemia", "satuan": "", "type": "checkbox" },
                        { "id": 3017875, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017876, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017877, "nama": "Diare", "satuan": "", "type": "checkbox" },
                        { "id": 3017878, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017879, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017880, "nama": "Hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3017881, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017882, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017883, "nama": "Resiko jatuh", "satuan": "", "type": "checkbox" },
                        { "id": 3017884, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017885, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017886, "nama": "Resiko cidera", "satuan": "", "type": "checkbox" },
                        { "id": 3017887, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017888, "nama": "dd", "satuan": "", "type": "textbox" },
                    ]
                }
            ] 
            $scope.listMasalahJiwa = [
                {
                    "id": 1, "nama": "Diagnosis Keperawatan Jiwa",
                    "detail": [
                        { "id": 3017893, "nama": "Perilaku kekerasan", "satuan": "", "type": "checkbox" },
                        { "id": 3017894, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017895, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017896, "nama": "Risiko bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3017897, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017898, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017899, "nama": "Risiko perilaku kekekrasan", "satuan": "", "type": "checkbox" },
                        { "id": 3017900, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017901, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017902, "nama": "Gangguan persepsi sensori", "satuan": "", "type": "checkbox" },
                        { "id": 3017903, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017904, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017905, "nama": "Gangguan proses pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3017906, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017907, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017908, "nama": "Defisit perawatan diri", "type": "checkbox" },
                        { "id": 3017909, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017910, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017911, "nama": "Isolasi sosial", "satuan": "", "type": "checkbox" },
                        { "id": 3017912, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017913, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017914, "nama": "Harga diri rendah", "satuan": "", "type": "checkbox" },
                        { "id": 3017915, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017916, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017917, "nama": "Ansietas", "satuan": "", "type": "checkbox" },
                        { "id": 3017918, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017919, "nama": "dd", "satuan": "", "type": "textbox" },
                        { "id": 3017920, "nama": "Kesiapan peningkatan manajemen kesehatan", "satuan": "", "type": "checkbox" },
                        { "id": 3017921, "nama": "bd", "satuan": "", "type": "textbox" },
                        { "id": 3017922, "nama": "dd", "satuan": "", "type": "textbox" },
                    ]
                }
            ] 
    
          

            $scope.listNutrisionalAnak = [
                {
                    "id": 1 , "nama":" A. Dijawab oleh Tenaga Kesehatan",
                    "detail": [
                        { "id": 3017926, "nama": "", "type": "label" },
                    ]
                },  
                {
                    "id": 1,  "no": 1, "nama":" Apakah ada penyakit yang mendasari dengan risiko malnutrisi atau apakah ada pembedahan besar ?",
                    "detail": [
                        { "id": 3017929, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017930, "nama": "b. Ya", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah Pasien dalam kondisi status gizi buruk berdasarkan pemeriksaan klinis secara subyektif ?",
                    "detail": [
                        { "id": 3017931, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017932, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1 , "nama":" B. Dijawab oleh Pengasuh anak",
                    "detail": [
                        { "id": 1, "nama": "", "type": "label" },
                    ]
                },  
                {
                    "id": 1, "no": 1, "nama": "Apakah hal hal dibawah ini ditemukan pada anak ? a. Diare berlebihan > 5 kali/hari dan atau muntah > 3 kali/hari c. Penurunan asupan makanan selama beberapa hari terakhir d. Intervensi gizi yang sudah ada sebelumnya e. Ketidak cukupan asupan gizi karena sakit",
                    "detail": [
                        { "id": 3017933, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017934, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah ada penurunan berat badan atau tidak adanya penambahan berat badan ( untuk bayi < 1 th) selama beberapa minggu / bulan terakhir ",
                    "detail": [
                        { "id": 3017935, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017936, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 3017939, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017940, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 3017941, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3017942, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3017943, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 3017944, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 3017945, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 3017946, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3017947, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 3017951, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 3017952, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        { "id": 3017953, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 3017954, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        { "id": 3017955, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 3017956, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3001025"},
                    ]
                }
            ]
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3017949, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3017950, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listPerencanaan1 = [
                {
                    "id": 1, "nama": "Perencanaan1",
                    "detail": [
                        { "id": 3017971, "nama": "Kontrol diri membaik", "satuan": "", "type": "checkbox" },
                        { "id": 3017972, "nama": "Persepsi sensori membaik", "satuan": "", "type": "checkbox" },
                        { "id": 3017973, "nama": "Status Orientasi membaik", "satuan": "", "type": "checkbox" },
                        { "id": 3017974, "nama": "Kontrol diri meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017975, "nama": "Keterlibatan sosial meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017976, "nama": "Harga diri meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017977, "nama": "Perawatan diri meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017978, "nama": "Komunikasi verbal meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017979, "nama": "Manajemen kesehatan diri meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3017980, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3017981, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3017982, "nama": "", "satuan": "", "type": "textbox" },
                        
                    ]
                }
            ]
            $scope.listPerencanaan2 = [
                {
                    "id": 1, "nama": "Perencanaan2",
                    "detail": [
                        { "id": 3017984, "nama": "Manajemen keselamatan lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3017985, "nama": "Intervensi krisis", "satuan": "", "type": "checkbox" },
                        { "id": 3017986, "nama": "Manajemen perilaku", "satuan": "", "type": "checkbox" },
                        { "id": 3017987, "nama": "Seklusi", "satuan": "", "type": "checkbox" },
                        { "id": 3017988, "nama": "Pengekangan Fisik", "satuan": "", "type": "checkbox" },
                        { "id": 3017989, "nama": "Pengekangan Kimiawi", "satuan": "", "type": "checkbox" },
                        { "id": 3017990, "nama": "Pemberian obat", "satuan": "", "type": "checkbox" },
                        { "id": 3017991, "nama": "Pencegahan perilaku kekerasan", "satuan": "", "type": "checkbox" },
                        { "id": 3017992, "nama": "Promosi koping", "satuan": "", "type": "checkbox" },
                        { "id": 3017993, "nama": "Dukungan spiritual", "satuan": "", "type": "checkbox" },
                        { "id": 3017994, "nama": "Dukungan pengungkapan perasaan", "satuan": "", "type": "checkbox" },
                        { "id": 3017995, "nama": "Latihan asertif", "satuan": "", "type": "checkbox" },
                        { "id": 3017996, "nama": "Manajemen halusinasi", "satuan": "", "type": "checkbox" },
                        { "id": 3017997, "nama": "Minimalisasi rangsangan", "satuan": "", "type": "checkbox" },
                        { "id": 3017998, "nama": "Manajemen delirium", "satuan": "", "type": "checkbox" },
                        { "id": 3017999, "nama": "Manajemen dimensia", "satuan": "", "type": "checkbox" },
                        { "id": 3018000, "nama": "Manajemen waham", "satuan": "", "type": "checkbox" },
                        { "id": 3018001, "nama": "Orientasi realita", "satuan": "", "type": "checkbox" },
                        { "id": 3018002, "nama": "Manajemen mood", "satuan": "", "type": "checkbox" },
                        { "id": 3018003, "nama": "Pencegahan bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018004, "nama": "Promosi harapan", "satuan": "", "type": "checkbox" },
                        { "id": 3018005, "nama": "Promosi harga diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018006, "nama": "Dukungan emosional", "satuan": "", "type": "checkbox" },
                        { "id": 3018007, "nama": "Promosi sosialisasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018008, "nama": "Manajemen perilaku", "satuan": "", "type": "checkbox" },
                        { "id": 3018009, "nama": "Dukungan perawatan diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018010, "nama": "Dukungan perawatan diri : BAK, BAB", "satuan": "", "type": "checkbox" },
                        { "id": 3018011, "nama": "Dukungan perawatan diri : mandi", "satuan": "", "type": "checkbox" },
                        { "id": 3018012, "nama": "Dukungan perawatan diri : berpakaian dan berhias", "satuan": "", "type": "checkbox" },
                        { "id": 3018013, "nama": "Dukungan perawatan diri : makan dan minum", "satuan": "", "type": "checkbox" },
                        { "id": 3018014, "nama": "Promosi komunikasi : defisit bicara", "satuan": "", "type": "checkbox" },
                        { "id": 3018015, "nama": "Promosi Komunikasi : difisit pendengaran", "satuan": "", "type": "checkbox" },
                        { "id": 3018016, "nama": "Promosi Komunikasi : difisit visual", "satuan": "", "type": "checkbox" },
                        { "id": 3018017, "nama": "Dukungan Pengambilan Keputusan", "satuan": "", "type": "checkbox" },
                        { "id": 3018018, "nama": "Dukungan tanggung jawab terhadap diri sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3018019, "nama": "Edukasi kesehatan", "satuan": "", "type": "checkbox" },
                        { "id": 3018020, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3018021, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018022, "nama": "", "satuan": "", "type": "textbox" },
                        
                    ]
                }
            ]
            $scope.listPerencanaan3 = [
                {
                    "id": 1, "nama": "Perencanaan3",
                    "detail": [
                        { "id": 3018025, "nama": "Membina hubungan saling percaya", "satuan": "", "type": "checkbox" },
                        { "id": 3018026, "nama": "Identifikasi kebutuhan keselamatan", "satuan": "", "type": "checkbox" },
                        { "id": 3018027, "nama": "Monitor kondisi keamanan lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3018028, "nama": "Pengekangan Fisik, seklusi jika perlu", "satuan": "", "type": "checkbox" },
                        { "id": 3018029, "nama": "Kolaborasi dokter untuk pengekanan kimiawi", "satuan": "", "type": "checkbox" },
                        { "id": 3018030, "nama": "Pemberian Obat", "satuan": "", "type": "checkbox" },
                        { "id": 3018031, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018032, "nama": "Monitor vital sign", "satuan": "", "type": "checkbox" },
                        { "id": 3018033, "nama": "Edukasi keluarga tentang", "satuan": "", "type": "checkbox" },
                        { "id": 3018034, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018035, "nama": "Monitor perilaku halusinasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018036, "nama": "Identifikasi karateristik halusinasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018037, "nama": "Manajemen delerium", "satuan": "", "type": "checkbox" },
                        { "id": 3018038, "nama": "Manajemen dimensia", "satuan": "", "type": "checkbox" },
                        { "id": 3018039, "nama": "Sediakan lingkungan teraupetik", "satuan": "", "type": "checkbox" },
                        { "id": 3018040, "nama": "Manajemen waham", "satuan": "", "type": "checkbox" },
                        { "id": 3018041, "nama": "Identifikasi proses pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3018042, "nama": "Identifikasi mood terkait Risiko bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018056, "nama": "Identifikasi perilaku jenis bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018043, "nama": "Meningkatkan promosi harga diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018044, "nama": "Identifikasi kemampuan berinteraksi terhadap orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3018045, "nama": "Berikan umpan balik positif dalam perawatan diri", "satuan": "", "type": "checkbox" },
                        { "id": 3018046, "nama": "Identifikasi harapan untuk mengendalikan perilaku", "satuan": "", "type": "checkbox" },
                        { "id": 3018047, "nama": "Identifikasi kebiasaan perawatan diri sesuai usia", "satuan": "", "type": "checkbox" },
                        { "id": 3018048, "nama": "Identifikasi perilaku emosional dan fisik sebagai bentuk komunikasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018049, "nama": "Identifikasi persepsi mengenai masalah sebagai pemicu konflik", "satuan": "", "type": "checkbox" },
                        { "id": 3018050, "nama": "Motivasi mengungkapkan tujuan perawatan yang diharapkan", "satuan": "", "type": "checkbox" },
                        { "id": 3018051, "nama": "Informasi alternatif solusi secara jelas", "satuan": "", "type": "checkbox" },
                        { "id": 3018052, "nama": "Identifikasi kesiapan menerima informasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018057, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3018058, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018059, "nama": "", "satuan": "", "type": "textbox" },
                        
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
                $scope.item.obj[3017948] = $scope.skorNutrisiDewasa
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
                $scope.item.obj[3017937] = $scope.skorNutrisiAnak
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
                    'PengkajianKepIGDPerImplementasiCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
