define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenKeperawatanIGDNonJiwaCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000451
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000451).then(function (e) {

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
                        { "id": 1901302, "nama": "T", "satuan": "mmHg", "type": "textbox" },
                        { "id": 1901303, "nama": "N", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 1901304, "nama": "R", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 1901305, "nama": "T", "satuan": "°C", "type": "textbox" },
                        { "id": 1901306, "nama": "SaO2", "satuan": "%", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSkriningFungsional = [
                {
                    "id": 1,
                    "nama": "Skrining Fungsional",
                    "detail": [
                        {"id": 1901307,"nama": "Alat Bantu","satuan": "","type": "textbox"}, 
                        {"id": 1901308,"nama": "Prothesa","satuan": "","type": "textbox"},
                        {"nama": "ADL","type": "checkbox","details":
                            [
                                {"id": 1901309,"nama": "Mandiri","satuan": "","type": "checkbox"}, 
                                {"id": 1901310,"nama": "Dibantu","satuan": "","type": "checkbox"},
                            ]
                        }
                        
                    ]
                }
            ]
            $scope.listSkriningNyeri = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 1901311, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 1901312, "nama": "Ada, lokasi dan durasi", "satuan": "", "type": "textbox2", "idd": "1901313" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriNIPS = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 1901314, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 1901315, "nama": "1-2  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 1901316, "nama": "3-4  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 1901317, "nama": ">4   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriFlacc = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 1901318, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 1901319, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 1901320, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 1901321, "nama": "7-100   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriWong = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 1901322, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 1901323, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 1901324, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 1901325, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
             
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 1901329, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 1901330, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 1901331, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 1901332, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
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
                { "id": 1901333, "nama": "0= Tidak Ada Nyeri", "type": "checkbox"},
                { "id": 1901334, "nama": "1 - 2 - 3= Sedikit Nyeri", "type": "checkbox"},
                { "id": 1901335, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                { "id": 1901336, "nama": "5 - 6 - 7= Mengganggu aktivitas", "type": "checkbox"},
                { "id": 1901337, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                { "id": 1901338, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
            ]
        }]
            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 1901333, "nama": "Tidak Nyeri", "type": "checkbox" },
                        { "id": 1901334, "nama": "Sedikit Nyeri", "type": "checkbox" },
                        { "id": 1901335, "nama": "Agak Mengganggu", "type": "checkbox" },
                        { "id": 1901336, "nama": "Mengganggu Aktivitas", "type": "checkbox" },
                        { "id": 1901337, "nama": "Sangat Mengganggu", "type": "checkbox" },
                        { "id": 1901338, "nama": "Tak Tertahankan", "type": "checkbox" },
                    ]
                },
            ]


            $scope.listRisikoJatuh = [
                {
                    "id": 1, "nama": "Risiko Jatuh",
                    "detail": [
                        { "id": 1901345, "nama": "Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b", "satuan": "", "type": "checkbox" },
                        { "id": 1901346, "nama": "Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listJalanNafas = [
                {
                    "id": 1, "nama": "Jalan Nafas",
                    "detail": [
                        { "id": 1901347, "nama": "Bebas", "satuan": "", "type": "checkbox" },
                        { "id": 1901348, "nama": "Tersumbat sebagian", "satuan": "", "type": "checkbox" },
                        { "id": 1901349, "nama": "Tersumbat Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPengembanganParu = [
                {
                    "id": 1, "nama": "Pengembangan Paru",
                    "detail": [
                        { "id": 1901350, "nama": "Simetris", "satuan": "", "type": "checkbox" },
                        { "id": 1901351, "nama": "Asimetris", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPolaNafas = [
                {
                    "id": 1, "nama": "Pola Nafas",
                    "detail": [
                        { "id": 1901352, "nama": "Normal/Eupnea", "satuan": "", "type": "checkbox" },
                        { "id": 1901353, "nama": "Bradipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 1901354, "nama": "Tachipnoe", "satuan": "", "type": "checkbox" },
                        { "id": 1901355, "nama": "Dispnoe", "satuan": "", "type": "checkbox" },
                        { "id": 1901356, "nama": "Apnoe", "satuan": "", "type": "checkbox" },
                        { "id": 1901357, "nama": "Cheynestoke", "satuan": "", "type": "checkbox" },
                        { "id": 1901358, "nama": "Kussmaul", "satuan": "", "type": "checkbox" },
                        { "id": 1901359, "nama": "Biot", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
            $scope.listSuaraNafas = [
                {
                    "id": 1, "nama": "Suara Nafas",
                    "detail": [
                        { "id": 1901360, "nama": "Vesikuler", "satuan": "", "type": "checkbox" },
                        { "id": 1901361, "nama": "Ronchi", "satuan": "", "type": "checkbox" },
                        { "id": 1901362, "nama": "Wheezing", "satuan": "", "type": "checkbox" },
                        { "id": 1901363, "nama": "Stridor", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKulit = [
                {
                    "id": 1, "nama": "Kulit",
                    "detail": [
                        { "id": 1901364, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 1901365, "nama": "Pucat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listWarnaMembran = [
                {
                    "id": 1, "nama": "Warna Membran",
                    "detail": [
                        { "id": 1901366, "nama": "Merah", "satuan": "", "type": "checkbox" },
                        { "id": 1901367, "nama": "Abu-abu", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
           
            $scope.listAkralKulit = [
                {
                    "id": 1, "nama": "Akral Kulit",
                    "detail": [
                        { "id": 1901368, "nama": "Hangat", "satuan": "", "type": "checkbox" },
                        { "id": 1901369, "nama": "Dingin", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMukosa = [
                {
                    "id": 1, "nama": "Mukosa",
                    "detail": [
                        { "id": 1901370, "nama": "Basah", "satuan": "", "type": "checkbox" },
                        { "id": 1901371, "nama": "Kering", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listCRT = [
                {
                    "id": 1, "nama": "Pengisian Kapiler / CRT",
                    "detail": [
                        { "id": 1901372, "nama": "<=2 detik", "satuan": "", "type": "checkbox" },
                        { "id": 1901373, "nama": ">=2 detik", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listNadi = [
                {
                    "id": 1, "nama": "Nadi",
                    "detail": [
                        { "id": 1901374, "nama": "Kuat", "satuan": "", "type": "checkbox" },
                        { "id": 1901375, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listRitme = [
                {
                    "id": 1, "nama": "Ritme",
                    "detail": [
                        { "id": 1901376, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 1901377, "nama": "Tidak teratur", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listGCS = [
                {
                    "id": 1, "nama": "A. GCS ",
                    "detail": [
                        { "id": 1901378, "nama": "GCS :", "satuan": "", "type": "textbox" },
                        { "id": 1901379, "nama": "E :", "satuan": "", "type": "textbox" },
                        { "id": 1901380, "nama": "V :", "satuan": "", "type": "textbox" },
                        { "id": 1901381, "nama": "M :", "satuan": "", "type": "textbox" },
                    ]
                }
            ]
            $scope.listKesadaran = [
                {
                    "id": 1, "nama": "Kesadaran",
                    "detail": [
                        { "id": 1901382, "nama": "Composmentis", "satuan": "", "type": "checkbox" },
                        { "id": 1901383, "nama": "Apatis", "satuan": "", "type": "checkbox" },
                        { "id": 1901384, "nama": "Somnolen", "satuan": "", "type": "checkbox" },
                        { "id": 1901385, "nama": "Stupor", "satuan": "", "type": "checkbox" },
                        { "id": 1901386, "nama": "Delirium", "satuan": "", "type": "checkbox" },
                        { "id": 1901387, "nama": "Coma", "satuan": "", "type": "checkbox" }
                    ]
                }
            ] 
        
            $scope.listDataFokus3 = [
                {
                    "id": 1, "nama": "Data Fokus",
                    "detail": [
                        { "id": 1901389, "nama": "Batuk tidak efektif / tidak mampu batuk", "satuan": "", "type": "checkbox" },
                        { "id": 1901390, "nama": "Penggunaan otot bantu nafas", "satuan": "", "type": "checkbox" },
                        { "id": 1901391, "nama": "Sianosis", "satuan": "", "type": "checkbox" },
                        { "id": 1901392, "nama": "Hipergilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 1901393, "nama": "Hipogilkemi", "satuan": "", "type": "checkbox" },
                        { "id": 1901394, "nama": "Mengantuk", "satuan": "", "type": "checkbox" },
                        { "id": 1901395, "nama": "Lesu", "satuan": "", "type": "checkbox" },
                        { "id": 1901396, "nama": "Nadi perifer menurun / tidak teraba", "satuan": "", "type": "checkbox" },
                        { "id": 1901397, "nama": "Mengeluh mual dan muntah", "satuan": "", "type": "checkbox" },
                        { "id": 1901398, "nama": "BAB cair > 3 kali / 24 jam", "satuan": "", "type": "checkbox" },
                        { "id": 1901399, "nama": "Turgor kulit menurun", "satuan": "", "type": "checkbox" },
                        { "id": 1901400, "nama": "Volume urin menurun", "satuan": "", "type": "checkbox" },
                        { "id": 1901401, "nama": "Rasa haus meningkat", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listStatusKesadaran = [
                {
                    "id": 1, "nama": "Menolak Perawatan Diri",
                    "detail": [
                        { "id": 1901403, "nama": "A", "satuan": "", "type": "checkbox" },
                        { "id": 1901404, "nama": "P", "satuan": "", "type": "checkbox" },
                        { "id": 1901405, "nama": "V", "satuan": "", "type": "checkbox" },
                        { "id": 1901406, "nama": "U", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMasalahUmum = [
                {
                    "id": 1, "nama": "Masalah Keperawatan Umum",
                    "detail": [
                        { "id": 1901408, "nama": "Bersihan jalan nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 1901409, "nama": "Gangguan ventilasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 1901410, "nama": "Gangguan sirkulasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 1901411, "nama": "Pola nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 1901412, "nama": "Perfusi perifer tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 1901413, "nama": "Nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 1901414, "nama": "Ketidakstabilan gula darah", "satuan": "", "type": "checkbox" },
                        { "id": 1901415, "nama": "Gangguan integritas kulit", "satuan": "", "type": "checkbox" },
                        { "id": 1901416, "nama": "Hipertemia", "satuan": "", "type": "checkbox" },
                        { "id": 1901417, "nama": "Diare", "satuan": "", "type": "checkbox" },
                        { "id": 1901418, "nama": "Hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 1901419, "nama": "Resiko jatuh", "satuan": "", "type": "checkbox" },
                        { "id": 1901420, "nama": "Resiko cidera", "satuan": "", "type": "checkbox" },
                        { "id": 1901421, "nama": "Nausea", "satuan": "", "type": "checkbox" },
                        { "id": 1901422, "nama": "Penurunan Curah Jantung", "satuan": "", "type": "checkbox" },
                        { "id": 1901423, "nama": "Defisit Nutrisi", "satuan": "", "type": "checkbox" },
                        { "id": 1901424, "nama": "Hipervolemia", "satuan": "", "type": "checkbox" },
                        { "id": 1901425, "nama": "Hipotermia", "satuan": "", "type": "checkbox" },
                        { "id": 1901426, "nama": "Risiko Infeksi", "satuan": "", "type": "checkbox" },
                        { "id": 1901427, "nama": "Inkontinensia urine / vekal", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
          

            $scope.listNutrisionalAnak = [
                {
                    "id": 1,  "no": 1, "nama":" Apakah ada penyakit yang mendasari dengan risiko malnutrisi atau apakah ada pembedahan besar ?",
                    "detail": [
                        { "id": 1901430, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901431, "nama": "b. Ya", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah Pasien dalam kondisi status gizi buruk berdasarkan pemeriksaan klinis secara subyektif ?",
                    "detail": [
                        { "id": 1901432, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901433, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 1, "nama": "Apakah hal hal dibawah ini ditemukan pada anak ? a. Diare berlebihan > 5 kali/hari dan atau muntah > 3 kali/hari c. Penurunan asupan makanan selama beberapa hari terakhir d. Intervensi gizi yang sudah ada sebelumnya e. Ketidak cukupan asupan gizi karena sakit",
                    "detail": [
                        { "id": 1901434, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901435, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah ada penurunan berat badan atau tidak adanya penambahan berat badan ( untuk bayi < 1 th) selama beberapa minggu / bulan terakhir ",
                    "detail": [
                        { "id": 1901436, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901437, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 1901438, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901439, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 1901440, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 1901441, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 1901442, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 1901443, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 1901444, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 1901445, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 1901446, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 1901447, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 1901448, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        {"id": 1901449, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 1901450, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        {"id": 1901451, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 1901452, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "1901453"},
                    ]
                }
            ]
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 1901454, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 1901455, "nama": "Tidak", "satuan": "", "type": "checkbox" },
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
                    $scope.item.obj[1901329] = true
                    $scope.item.obj[1901330] = false
                    $scope.item.obj[1901331] = false
                    $scope.item.obj[1901332] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[1901329] = false
                    $scope.item.obj[1901330] = true   
                    $scope.item.obj[1901331] = false
                    $scope.item.obj[1901332] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[1901329] = false
                    $scope.item.obj[1901330] = false
                    $scope.item.obj[1901331] = true
                    $scope.item.obj[1901332] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[1901329] = false
                    $scope.item.obj[1901330] = false
                    $scope.item.obj[1901331] = false
                    $scope.item.obj[1901332] = true
                }
            });

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[1901333] = true
                    $scope.item.obj[1901334] = false
                    $scope.item.obj[1901335] = false
                    $scope.item.obj[1901336] = false
                    $scope.item.obj[1901337] = false
                    $scope.item.obj[1901338] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[1901333] = false
                    $scope.item.obj[1901334] = true
                    $scope.item.obj[1901335] = false
                    $scope.item.obj[1901336] = false
                    $scope.item.obj[1901337] = false
                    $scope.item.obj[1901338] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[1901333] = false
                    $scope.item.obj[1901334] = false
                    $scope.item.obj[1901335] = true
                    $scope.item.obj[1901336] = false
                    $scope.item.obj[1901337] = false
                    $scope.item.obj[1901338] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[1901333] = false
                    $scope.item.obj[1901334] = false
                    $scope.item.obj[1901335] = false
                    $scope.item.obj[1901336] = true
                    $scope.item.obj[1901337] = false
                    $scope.item.obj[1901338] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[1901333] = false
                    $scope.item.obj[1901334] = false
                    $scope.item.obj[1901335] = false
                    $scope.item.obj[1901336] = false
                    $scope.item.obj[1901337] = true
                    $scope.item.obj[1901338] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[1901333] = false
                    $scope.item.obj[1901334] = false
                    $scope.item.obj[1901335] = false
                    $scope.item.obj[1901336] = false
                    $scope.item.obj[1901337] = false
                    $scope.item.obj[1901338] = true
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
                $scope.item.obj[1901460] = $scope.skorNutrisiDewasa
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
                $scope.item.obj[1901459] = $scope.skorNutrisiAnak
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
                    'AsesmenKeperawatanIGDNonJiwaCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
