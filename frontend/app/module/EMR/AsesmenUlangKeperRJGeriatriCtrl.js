define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenUlangKeperRJGeriatriCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorNorton = []
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 21034
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 21034).then(function (e) {

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
            
            $scope.listStatusFisik = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 21001879, "nama": "Suhu", "satuan": "°C", "type": "textbox" },
                        { "id": 21001880, "nama": "Nadi", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 21001881, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 21001882, "nama": "Tidak Teratur ", "satuan": "", "type": "checkbox" },
                        { "id": 21001883, "nama": "Kuat", "satuan": "", "type": "checkbox" },
                        { "id": 21001884, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                        { "id": 21001885, "nama": "Tekanan Darah", "satuan": "mmHg", "type": "textbox2" },
                        { "id": 21001886, "nama": "Pernafasan", "satuan": "x/mnt", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Kesadaran",
                    "detail": [
                        { "nama": "GCS", "satuan": "", "type": "label" },
                        { "id": 21001887, "nama": "E", "satuan": "", "type": "textboxgcs" },
                        { "id": 21001888, "nama": "V", "satuan": "", "type": "textboxgcs" },
                        { "id": 21001889, "nama": "M", "satuan": "", "type": "textboxgcs" },
                        { "id": 21009270, "nama": "Skor", "satuan": "", "type": "textboxskorgcs" },
                        { "nama": "Refleks Cahaya", "satuan": "", "type": "label" },
                        { "id": 21001890, "nama": "ka", "satuan": "", "type": "textbox" },
                        { "id": 21001891, "nama": "ki", "satuan": "", "type": "textbox" },
                        { "nama": "Ukuran Pupil", "satuan": "", "type": "label" },
                        { "id": 21001892, "nama": "ka", "satuan": "mm", "type": "textbox" },
                        { "id": 21001893, "nama": "ki", "satuan": "mm", "type": "textbox" },
                        { "id": 21001894, "nama": "ESPO2", "satuan": "", "type": "textbox2" },
                        { "id": 21001895, "nama": "EWS", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Rambut Kepala",
                    "detail": [
                        { "id": 21001896, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 21001897, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 21001898, "nama": "Kusam", "satuan": "", "type": "checkbox" },
                        { "id": 21001899, "nama": "Rontok", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Mata",
                    "detail": [
                        { "id": 21001900, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001901, "nama": "Sklera ikterik", "satuan": "", "type": "checkbox" },
                        { "id": 21001902, "nama": "Bersekret", "satuan": "", "type": "checkbox" },
                        { "id": 21001903, "nama": "Konjungtivita anemis", "satuan": "", "type": "checkbox" },
                        { "id": 21001904, "nama": "Katarak", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "E. Hidung",
                    "detail": [
                        { "id": 21001905, "nama": "Tidak Bermasalah", "satuan": "", "type": "checkbox" },
                        { "id": 21001906, "nama": "Tersumbat", "satuan": "", "type": "checkbox" },
                        { "id": 21001907, "nama": "Secret (+)", "satuan": "", "type": "checkbox" },
                        { "id": 21001908, "nama": "Epistaksis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "F. Mulut",
                    "detail": [
                        { "id": 21001909, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 21001910, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 21001911, "nama": "Berbau", "satuan": "", "type": "checkbox" },
                        { "id": 21001912, "nama": "Mokusa kering", "satuan": "", "type": "checkbox" },
                        { "id": 21001913, "nama": "Stomatitis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bibir",
                    "detail": [
                        { "id": 21001914, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001915, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 21001916, "nama": "Sumbing", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Lidah",
                    "detail": [
                        { "id": 21001917, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 21001918, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 21001919, "nama": "Hiperemik", "satuan": "", "type": "checkbox" },
                        { "id": 21001920, "nama": "Putih", "satuan": "", "type": "checkbox" },
                        { "id": 21001921, "nama": "Kering", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Gigi",
                    "detail": [
                        { "id": 21001922, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 21001923, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 21001924, "nama": "Ompong", "satuan": "", "type": "checkbox" },
                        { "id": 21001925, "nama": "Kawat gigi", "satuan": "", "type": "checkbox" },
                        { "id": 21001926, "nama": "Gigi palsu", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "G. Telingan",
                    "detail": [
                        { "id": 21001927, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 21001928, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 21001929, "nama": "Otitis media", "satuan": "", "type": "checkbox" },
                        { "id": 21001930, "nama": "Tinitus", "satuan": "", "type": "checkbox" },
                        { "id": 21001931, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "H. Leher",
                    "detail": [
                        { "id": 21001932, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001933, "nama": "Ada benjolan", "satuan": "", "type": "checkbox" },
                        { "id": 21001934, "nama": "Kaku duduk", "satuan": "", "type": "checkbox" },
                        { "id": 21001935, "nama": "Trecheostomi", "satuan": "", "type": "checkbox" },
                        { "id": 21001936, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "I. Dada",
                    "detail": [
                        { "id": 21001937, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001938, "nama": "Bentuk Asimetris", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Payudara",
                    "detail": [
                        { "id": 21001939, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001940, "nama": "Ada Benjolan, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 21001941, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "J. Recpirasi",
                    "detail": [
                        { "id": 21001942, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001943, "nama": "Dyspnea", "satuan": "", "type": "checkbox" },
                        { "id": 21001944, "nama": "Ronchi", "satuan": "", "type": "checkbox" },
                        { "id": 21001945, "nama": "Wheezing", "satuan": "", "type": "checkbox" },
                        { "id": 21001946, "nama": "Cyanosis", "satuan": "", "type": "checkbox" },
                        { "id": 21001947, "nama": "Nyeri saat nafas", "satuan": "", "type": "checkbox" },
                        { "id": 21001948, "nama": "Retraksi Dada", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Batuk",
                    "detail": [
                        { "id": 21001949, "nama": "Tidak ada", "satuan": "", "type": "checkbox" },
                        { "id": 21001950, "nama": "Ada", "satuan": "", "type": "checkbox" },
                        { "id": 21001951, "nama": "Tidak produktif", "satuan": "", "type": "checkbox" },
                        { "id": 21001952, "nama": "Produktif warna :", "satuan": "", "type": "checkbox" },
                        { "id": 21001953, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "K. Sirkulasi",
                    "detail": [
                        { "id": 21001954, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001955, "nama": "Pusing", "satuan": "", "type": "checkbox" },
                        { "id": 21001956, "nama": "Sakit Kepala", "satuan": "", "type": "checkbox" },
                        { "id": 21001957, "nama": "Syncope", "satuan": "", "type": "checkbox" },
                        { "id": 21001958, "nama": "Palpitasi", "satuan": "", "type": "checkbox" },
                        { "id": 21001959, "nama": "Cyanosis", "satuan": "", "type": "checkbox" },
                        { "id": 21001960, "nama": "Nyeri Dada", "satuan": "", "type": "checkbox" },
                        { "id": 21001961, "nama": "Nyeri ditungkai/Betis", "satuan": "", "type": "checkbox" },
                        { "id": 21001962, "nama": "Baal/Numbness", "satuan": "", "type": "checkbox" },
                        { "id": 21001963, "nama": "Edema Lokasi :", "satuan": "", "type": "checkbox" },
                        { "id": 21001964, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Capilari refill",
                    "detail": [
                        { "id": 21001965, "nama": "Baik", "satuan": "", "type": "checkbox" },
                        { "id": 21001966, "nama": "Lambat", "satuan": "", "type": "checkbox" },
                        { "id": 21001967, "nama": "<= 2 detik", "satuan": "", "type": "checkbox" },
                        { "id": 21001968, "nama": ">= 2 detik", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Ekstremitas",
                    "detail": [
                        { "id": 21001969, "nama": "Hangat", "satuan": "", "type": "checkbox" },
                        { "id": 21001970, "nama": "Dingin", "satuan": "", "type": "checkbox" },
                        { "id": 21001971, "nama": "Basah", "satuan": "", "type": "checkbox" },
                        { "id": 21001972, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 21001973, "nama": "dll", "satuan": "", "type": "checkbox" },
                        { "nama": "ex : Fraktur Combustio", "satuan": "", "type": "label2" },
                    ]
                },
                {
                    "id": 1, "nama": "L. Gastrointastinal",
                    "detail": [
                        { "id": 21001974, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21001975, "nama": "Kembung", "satuan": "", "type": "checkbox" },
                        { "id": 21001976, "nama": "Asites", "satuan": "", "type": "checkbox" },
                        { "id": 21001977, "nama": "Defans muscular", "satuan": "", "type": "checkbox" },
                        { "id": 21001978, "nama": "Mual", "satuan": "", "type": "checkbox" },
                        { "id": 21001979, "nama": "Muntah", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Benjolan/Massa",
                    "detail": [
                        { "id": 21001980, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 21001981, "nama": "Ada, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 21001982, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Defakasi",
                    "detail": [
                        { "id": 21001983, "nama": "Frekuensi : ", "satuan": "", "type": "checkbox" },
                        { "id": 21001984, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Terakhir Defakasi",
                    "detail": [
                        { "id": 21001985, "nama": "", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Konstipasi",
                    "detail": [
                        { "id": 21001986, "nama": "Tidak ", "satuan": "", "type": "checkbox" },
                        { "id": 21001987, "nama": "Ya, ", "satuan": "", "type": "checkbox" },
                        { "id": 21001988, "nama": "Pemakaian Obat Pencahar", "satuan": "", "type": "checkbox" },
                        { "id": 21001989, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "M. Kulit",
                    "detail": [
                        { "id": 21001990, "nama": "Utuh", "satuan": "", "type": "checkbox" },
                        { "id": 21001991, "nama": "Memar", "satuan": "", "type": "checkbox" },
                        { "id": 21001992, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 21001993, "nama": "Lembab", "satuan": "", "type": "checkbox" },
                        { "id": 21001994, "nama": "Bersisik", "satuan": "", "type": "checkbox" },
                        { "id": 21001995, "nama": "Peechiae", "satuan": "", "type": "checkbox" },
                        { "id": 21001996, "nama": "Pucat", "satuan": "", "type": "checkbox" },
                        { "id": 21001997, "nama": "Ikterik", "satuan": "", "type": "checkbox" },
                        { "id": 21001998, "nama": "Kemerahan", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Luka Gangren",
                    "detail": [
                        { "id": 21001999, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 21002000, "nama": "Ada, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 21002001, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Turgor",
                    "detail": [
                        { "id": 21002002, "nama": "Baik", "satuan": "", "type": "checkbox" },
                        { "id": 21002003, "nama": "Sedang", "satuan": "", "type": "checkbox" },
                        { "id": 21002004, "nama": "Jelek", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "N. Urinari",
                    "detail": [
                        { "id": 21002005, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21002006, "nama": "Inkontinensia", "satuan": "", "type": "checkbox" },
                        { "id": 21002007, "nama": "Dysuria", "satuan": "", "type": "checkbox" },
                        { "id": 21002008, "nama": "Nocturia", "satuan": "", "type": "checkbox" },
                        { "id": 21002009, "nama": "Retensi", "satuan": "", "type": "checkbox" },
                        { "id": 21002010, "nama": "Hematuni", "satuan": "", "type": "checkbox" },
                        { "id": 21002011, "nama": "Pyuria", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "O. Muskulo-skelatal",
                    "detail": [
                        { "id": 21002012, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21002013, "nama": "Skoliosis", "satuan": "", "type": "checkbox" },
                        { "id": 21002014, "nama": "Lordosis", "satuan": "", "type": "checkbox" },
                        { "id": 21002015, "nama": "Kiposis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "P. Abdomen",
                    "detail": [
                        { "id": 21002016, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21002017, "nama": "Benjolan/Masa", "satuan": "", "type": "checkbox" },
                        { "id": 21002018, "nama": "Nyeri Tekan/Lepas/Ketuk", "satuan": "", "type": "checkbox" },
                        { "id": 21002019, "nama": "Jejas", "satuan": "", "type": "checkbox" },
                        { "id": 21002020, "nama": "Luka", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Q. Genitalia",
                    "detail": [
                        { "id": 21002021, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 21002022, "nama": "Benjolan/Masa", "satuan": "", "type": "checkbox" },
                        { "id": 21002023, "nama": "Luka", "satuan": "", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listStatusBio = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 21002024, "nama": "Pola Malan :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 21002025, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },
                        { "id": 21002026, "nama": "Pola Minum :", "satuan": "cc/hari", "type": "textbox1" },
                        { "id": 21002027, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },
                        { "id": 21002028, "nama": "BAK :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 21002029, "nama": "Terakhir jam :", "satuan": "", "type": "textbox2" },
                        { "id": 21002030, "nama": "Warna", "satuan": "", "type": "textbox2" },
                        { "id": 21002031, "nama": "BAB :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 21002032, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },

                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "id": 21002033, "nama": "Cemas", "type": "checkbox" },
                        { "id": 21002034, "nama": "Takut", "type": "checkbox" },
                        { "id": 21002035, "nama": "Marah", "type": "checkbox" },
                        { "id": 21002036, "nama": "Sedih", "type": "checkbox" },
                        { "id": 21002037, "nama": "Kecenderungan bunuh diri", "type": "checkbox" },
                        { "id": 21002038, "nama": "dll", "type": "textbox" },
                        { "nama": "Status Mental", "type": "label" },
                        { "id": 21002039, "nama": "Kooperatif", "type": "checkbox" },
                        { "id": 21002040, "nama": "Tidak Kooperatif", "type": "checkbox" },
                        { "id": 21002041, "nama": "Gelisah atau delirum dan berontak", "type": "checkbox" },
                        { "id": 21002042, "nama": "Ketidakmampuan dalam mengikuti perintah", "type": "checkbox" },
                        { "nama": "Restrain", "type": "label" },
                        { "id": 21002043, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002044, "nama": "Ya, Lakukan Pengkajian Restrain", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "id": 21002045, "nama": "Pekerjaan :", "type": "textbox1" },
                        { "id": 21002046, "nama": "Kegiatan Sekarang :", "type": "textbox1" },
                        { "id": 21002047, "nama": "Nama Orang Terdekat :", "type": "textbox1" },
                        { "id": 21002048, "nama": "Orang yang tinggal serumah :", "type": "textbox1" },
                        { "id": 21002049, "nama": "Jumlah Anak :", "type": "textbox2" },
                        { "id": 21002050, "nama": "Jumlah Cucu :", "type": "textbox2" },
                        { "id": 21002051, "nama": "Jumlah Cicit :", "type": "textbox2" },
                        { "id": 21002052, "nama": "Alamat Rumah :", "type": "textbox" },
                        { "id": 21002053, "nama": "No. Telepon :", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Spriritual dan Kulturasi",
                    "detail": [
                        { "nama": "Agama", "type": "label" },
                        { "id": 21002054, "nama": "Islam", "type": "checkbox" },
                        { "id": 21002055, "nama": "Protestan", "type": "checkbox" },
                        { "id": 21002056, "nama": "Katolik", "type": "checkbox" },
                        { "id": 21002057, "nama": "Hindu", "type": "checkbox" },
                        { "id": 21002058, "nama": "Budha", "type": "checkbox" },
                        { "id": 21002059, "nama": "Konghucu", "type": "checkbox" },
                        { "id": 21002060, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002061, "nama": "", "type": "textbox" },
                        { "nama": "Kegiatan Spiritual dan nilai nilai kepercayaan yang dilakukan", "type": "label" },
                        { "id": 21002062, "nama": "Ada, Sebutkan", "type": "checkbox" },
                        { "id": 21002063, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 21002064, "nama": "", "type": "textbox" },
                        { "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 21002065, "nama": "Indonesia", "type": "checkbox" },
                        { "id": 21002066, "nama": "Inggris", "type": "checkbox" },
                        { "id": 21002067, "nama": "Daerah", "type": "checkbox" },
                        { "id": 21002068, "nama": "Lain-lain", "type": "textbox" },
                    ]
                },
            ]

            $scope.listStatusEkonomi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Cara Pembayaran", "type": "label" },
                        { "id": 21002069, "nama": "Pribadi", "type": "checkbox" },
                        { "id": 21002070, "nama": "Perusahaan", "type": "checkbox" },
                        { "id": 21002071, "nama": "Asuransi", "type": "checkbox" },
                        { "nama": "Pendapatan", "type": "label" },
                        { "id": 21002072, "nama": "UMR/rp", "type": "checkbox" },
                        { "id": 21002073, "nama": "UMR s/d 5 juta rp", "type": "checkbox" },
                        { "id": 21002074, "nama": "5 s/d 10 juta rp", "type": "checkbox" },
                        { "id": 21002075, "nama": "10 s/d 15 juta rp", "type": "checkbox" },
                        { "id": 21002076, "nama": "> 15 juta rp", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatanPasien = [
                {
                    "id": 1, "nama": "A. Pernah dirawat",
                    "detail": [
                        { "id": 21002077, "nama": "Ya", "type": "checkbox1" },
                        { "id": 21002078, "nama": "Kapan", "type": "textbox" },
                        { "id": 21002079, "nama": "Diagnosa", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002080, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Apakah anda pernah mendapat obat pengencer darah (aspirin, warfarin, plavix)",
                    "detail": [
                        { "id": 21002081, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002082, "nama": "Ya, Kapan dihentikan ?", "type": "checkbox" },
                        { "id": 21002083, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Apakah akhir-kahir ini Anda berpegian ke daerah Endemic Malaria (Lombok, NTT, Irian Jaya)",
                    "detail": [
                        { "id": 21002084, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002085, "nama": "Ya, Kapan", "type": "checkbox2" },
                        { "id": 21002086, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Riwayat Kemoterapi",
                    "detail": [
                        { "id": 21002087, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002088, "nama": "Ya, Kapan", "type": "checkbox2" },
                        { "id": 21002089, "nama": "", "type": "textbox" },
                        { "id": 21002090, "nama": "", "satuan":"kali", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "E. Riwayat Ketergantungan",
                    "detail": [
                        { "id": 21002091, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002092, "nama": "Ada, berupa :", "type": "checkbox2" },
                        { "id": 21002093, "nama": "Obat-obatan", "type": "checkbox" },
                        { "id": 21002094, "nama": "Rokok", "type": "checkbox" },
                        { "id": 21002095, "nama": "Alkohol", "type": "checkbox" },
                        { "id": 21002096, "nama": "Sebutkan", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "F. Riwayat Pembedahan/Pemblusan",
                    "detail": [
                        { "nama": "Pernahkah Pasien dioperasi", "type": "label" },
                        { "id": 21002097, "nama": "Tidak Ada", "type": "checkbox2" },
                        { "id": 21002098, "nama": "", "type": "textbox" },
                        { "id": 21002099, "nama": "Operasi", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002100, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pernahkah ada masalah dengan operasi/pembiusan Pasien", "type": "label" },
                        { "id": 21002101, "nama": "Ya, Sebutkan", "type": "checkbox2" },
                        { "id": 21002102, "nama": "", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002103, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "G. Penyakit Jantung & Pembuluh Darah",
                    "detail": [
                        { "id": 21002104, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002105, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002106, "nama": "Infrak", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002107, "nama": "Gangguan Irama Jantung, Pacemaker", "type": "checkbox" },
                        { "id": 21002108, "nama": "Ya", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 21002109, "nama": "Hypertensi", "type": "checkbox" },
                        { "id": 21002110, "nama": "Stroke/CVA", "type": "checkbox" },
                        { "id": 21002111, "nama": "Deep Vein Thrombosis", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002112, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002113, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "H. Penyakit Saluran Pernapasan",
                    "detail": [
                        { "id": 21002114, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002115, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002116, "nama": "Asthma", "type": "checkbox2" },
                        { "id": 21002117, "nama": "TBC", "type": "checkbox2" },
                        { "id": 21002118, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002119, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "I. Penyakit Infeksi",
                    "detail": [
                        { "id": 21002120, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002121, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002122, "nama": "Typhus", "type": "checkbox" },
                        { "id": 21002123, "nama": "Gastro Enteritis", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002124, "nama": "Hepatitis", "type": "checkbox2" },
                        { "id": 21002125, "nama": "A", "type": "checkbox1" },
                        { "id": 21002126, "nama": "B", "type": "checkbox1" },
                        { "id": 21002127, "nama": "C", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 21002128, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002129, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "J. Penyakit Endokrin",
                    "detail": [
                        { "id": 21002130, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002131, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002132, "nama": "Diabetes Melitus", "type": "checkbox2" },
                        { "id": 21002133, "nama": "Tyroid", "type": "checkbox2" },
                        { "id": 21002134, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002135, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "K. Penyakit Ginjal & Saluran Kencing",
                    "detail": [
                        { "id": 21002136, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002137, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002138, "nama": "Penyakit Ginjal", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002139, "nama": "On Dialysis, AV Shunt", "type": "checkbox" },
                        { "id": 21002140, "nama": "Ya", "type": "checkbox1" },
                        { "id": 21002141, "nama": "Tidak", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 21002142, "nama": "Batu Ureter", "type": "checkbox" },
                        { "id": 21002143, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002144, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "L. Penyakit Hematologi",
                    "detail": [
                        { "id": 21002145, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002146, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002147, "nama": "Gangguan Pendarahan", "type": "checkbox" },
                        { "id": 21002148, "nama": "Mudah Hematom", "type": "checkbox" },
                        { "nama": "Pernahkah menerima transfusi", "type": "label" },
                        { "id": 21002149, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002150, "nama": "Ya, Reaksi", "type": "checkbox2" },
                        { "id": 21002151, "nama": "", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002152, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002153, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "M. Lain - lain",
                    "detail": [
                        { "id": 21002154, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 21002155, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 21002156, "nama": "Hemoroid", "type": "checkbox" },
                        { "id": 21002157, "nama": "Stoma", "type": "checkbox" },
                        { "id": 21002158, "nama": "Melena", "type": "checkbox" },
                        { "id": 21002159, "nama": "Hematemesis", "type": "checkbox" },
                        { "id": 21002160, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002161, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listRiwayatAlergi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002162, "nama": "Ya, Sebutkan :", "type": "checkbox" },
                        { "id": 21002163, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002164, "nama": "", "type": "textbox" },
                        { "id": 21002165, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "checkbox2" },
                        { "id": 21002166, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002167, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
                        { "id": 21002168, "nama": "1 - 3 = Nyeri Ringan", "type": "checkbox" },
                        { "id": 21002169, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
                        { "id": 21002170, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPenilaianNyeri = [
                {
                    "id": 1, "nama": "Penilaian Nyeri",
                    "detail": [
                        { "nama": "Provokatif", "type": "label" },
                        { "id": 21002171, "nama": "Ruda paksa", "type": "checkbox" },
                        { "id": 21002172, "nama": "Benturan", "type": "checkbox" },
                        { "id": 21002173, "nama": "Sayatan", "type": "checkbox" },
                        { "id": 21002174, "nama": "dll", "type": "textbox" },
                        { "nama": "Quality", "type": "label" },
                        { "id": 21002175, "nama": "Tertusuk", "type": "checkbox" },
                        { "id": 21002176, "nama": "Tertekan/tertindih", "type": "checkbox" },
                        { "id": 21002177, "nama": "Diiris-iris", "type": "checkbox" },
                        { "id": 21002178, "nama": "dll", "type": "textbox" },
                        { "nama": "Regional", "type": "label" },
                        { "id": 21002179, "nama": "Lokasi", "type": "checkbox1" },
                        { "id": 21002180, "nama": "", "type": "textbox" },
                        { "nama": "Menjalar", "type": "label" },
                        { "id": 21002181, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002182, "nama": "Ya, Ke :", "type": "checkbox2" },
                        { "id": 21002183, "nama": "", "type": "textbox" },
                        { "nama": "Scala", "type": "label" },
                        { "id": 21002184, "nama": "", "type": "textbox" },
                        { "nama": "Time", "type": "label" },
                        { "id": 21002185, "nama": "Jarang", "type": "checkbox" },
                        { "id": 21002186, "nama": "Hilang timbul", "type": "checkbox" },
                        { "id": 21002187, "nama": "Terus menerus", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPengkajian = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "A", "type": "label" },
                        { "nama": "Cara Bejalan Pasien (salah satu atau lebih) <br> 1. Tidak seimbang/sempoyongan/limbung <br> 2. Jalan dengan menggunakan alat bantu (kruk, tripot, kursi roda, orang lain)", "type": "label" },
                        { "id": 21002188, "nama": "", "type": "checkbox" },
                        { "id": 21002189, "nama": "", "type": "checkbox" },

                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "B", "type": "label" },
                        { "nama": "Menopang saat akan duduk : tampak memegang pinggiran kursi atau meja/benda lain sebagai penopang saat akan duduk.", "type": "label" },
                        { "id": 21002190, "nama": "", "type": "checkbox" },
                        { "id": 21002191, "nama": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listHasil = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak Beresiko", "type": "label" },
                        { "nama": "Tidak ditemukan A & B", "type": "label" },
                        { "id": 21002192, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Risiko Rendah", "type": "label" },
                        { "nama": "Ditemukan salah satu A/B", "type": "label" },
                        { "id": 21002193, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Risiko tinggi", "type": "label" },
                        { "nama": "Ditemukan A & B", "type": "label" },
                        { "id": 21002194, "nama": "", "type": "textarea" },
                    ]
                },
                
            ]
            $scope.listTindakan = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak beresiko", "type": "label" },
                        { "nama": "Tidak ada tindakan", "type": "label" },
                        { "id": 21002195, "nama": "", "type": "checkbox" },
                        { "id": 21002196, "nama": "", "type": "checkbox" },
                        { "id": 21002197, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Resiko rendah", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002198, "nama": "", "type": "checkbox" },
                        { "id": 21002199, "nama": "", "type": "checkbox" },
                        { "id": 21002200, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Resiko tinggi", "type": "label" },
                        { "nama": "Pasang pita/stiker resiko jatuh", "type": "label" },
                        { "id": 21002201, "nama": "", "type": "checkbox" },
                        { "id": 21002202, "nama": "", "type": "checkbox" },
                        { "id": 21002203, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002204, "nama": "", "type": "checkbox" },
                        { "id": 21002205, "nama": "", "type": "checkbox" },
                        { "id": 21002206, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listAssementFungsional = [
                {
                    "id": 1, "nama": "Sensorik",
                    "detail": [
                        { "nama": "Penglihatan", "type": "label" },
                        { "id": 21002207, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002208, "nama": "Kabur", "type": "checkbox" },
                        { "id": 21002209, "nama": "Kacamata", "type": "checkbox" },
                        { "id": 21002210, "nama": "Lensa kotak", "type": "checkbox" },
                        { "nama": "Penciuman", "type": "label" },
                        { "id": 21002211, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002212, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pendengaran", "type": "label" },
                        { "id": 21002213, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002214, "nama": "Tuli kanan/kiri", "type": "checkbox" },
                        { "id": 21002215, "nama": "Alat bantu dengan kanan/kiri", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif",
                    "detail": [
                        { "id": 21002216, "nama": "Orientasi penuh", "type": "checkbox" },
                        { "id": 21002217, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 21002218, "nama": "Bingung", "type": "checkbox" },
                        { "id": 21002219, "nama": "Tidak dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Motorik",
                    "detail": [
                        { "nama": "Aktifitas sehari-hari", "type": "label" },
                        { "id": 21002220, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 21002221, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 21002222, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 21002223, "nama": "Ketergantungan Total", "type": "checkbox" },
                        { "nama": "Berjalan", "type": "label" },
                        { "id": 21002224, "nama": "Tidak ada kesulitan", "type": "checkbox" },
                        { "id": 21002225, "nama": "Perlu bantuan", "type": "checkbox" },
                        { "id": 21002226, "nama": "Sering Jatuh", "type": "checkbox" },
                        { "id": 21002227, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah ada penurunan berat badan yang tidak diinginkan selama 6 bulan terakhir ?",
                    "detail": [
                        { "id": 21002228, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002229, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "(Tanda: ukuran baju atau celana menjadi lebih longgar)", "type": "label" },
                        { "id": 21002230, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 21002231, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 21002232, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 21002233, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah asupan makan menurun yang dikarenakan adanya penurunan nafsu makan/kesulitan menerima makan ?",
                    "detail": [
                        { "id": 21002234, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002235, "nama": "Tidak yakin", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNorton = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "1", "type": "label" },
                        { "nama": "Baik", "type": "label" },
                        { "id": 21002237, "nama": "", "descNilai": "1", "target": "21002242", "type": "checkbox" },
                        { "nama": "Waspada", "type": "label" },
                        { "id": 21002238, "nama": "", "descNilai": "1", "target": "21002242", "type": "checkbox" },
                        { "nama": "Ambulasi baik", "type": "label" },
                        { "id": 21002239, "nama": "", "descNilai": "1", "target": "21002242", "type": "checkbox" },
                        { "nama": "Penuh", "type": "label" },
                        { "id": 21002240, "nama": "", "descNilai": "1", "target": "21002242", "type": "checkbox" },
                        { "nama": "Kontinen", "type": "label" },
                        { "id": 21002241, "nama": "", "descNilai": "1", "target": "21002242", "type": "checkbox" },
                        { "id": 21002242, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "2", "type": "label" },
                        { "nama": "Cukup", "type": "label" },
                        { "id": 21002243, "nama": "", "descNilai": "2", "target": "21002248", "type": "checkbox" },
                        { "nama": "Apatis", "type": "label" },
                        { "id": 21002244, "nama": "", "descNilai": "2", "target": "21002248", "type": "checkbox" },
                        { "nama": "Perlu bantuan", "type": "label" },
                        { "id": 21002245, "nama": "", "descNilai": "2", "target": "21002248", "type": "checkbox" },
                        { "nama": "Terbatas", "type": "label" },
                        { "id": 21002246, "nama": "", "descNilai": "2", "target": "21002248", "type": "checkbox" },
                        { "nama": "Kadang inkontinen", "type": "label" },
                        { "id": 21002247, "nama": "", "descNilai": "2", "target": "21002248", "type": "checkbox" },
                        { "id": 21002248, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "3", "type": "label" },
                        { "nama": "Lemah", "type": "label" },
                        { "id": 21002249, "nama": "", "descNilai": "3", "target": "21002254", "type": "checkbox" },
                        { "nama": "Bingun", "type": "label" },
                        { "id": 21002250, "nama": "", "descNilai": "3", "target": "21002254", "type": "checkbox" },
                        { "nama": "Tidak bisa pindah bed", "type": "label" },
                        { "id": 21002251, "nama": "", "descNilai": "3", "target": "21002254", "type": "checkbox" },
                        { "nama": "Sangat Terbatas", "type": "label" },
                        { "id": 21002252, "nama": "", "descNilai": "3", "target": "21002254", "type": "checkbox" },
                        { "nama": "Inkontinen BAK", "type": "label" },
                        { "id": 21002253, "nama": "", "descNilai": "3", "target": "21002254", "type": "checkbox" },
                        { "id": 21002254, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "4", "type": "label" },
                        { "nama": "Sangat lemah", "type": "label" },
                        { "id": 21002255, "nama": "", "descNilai": "4", "target": "21002260", "type": "checkbox" },
                        { "nama": "Tak sadar", "type": "label" },
                        { "id": 21002256, "nama": "", "descNilai": "4", "target": "21002260", "type": "checkbox" },
                        { "nama": "Tidak bergerak", "type": "label" },
                        { "id": 21002257, "nama": "", "descNilai": "4", "target": "21002260", "type": "checkbox" },
                        { "nama": "Imobilisasi", "type": "label" },
                        { "id": 21002258, "nama": "", "descNilai": "4", "target": "21002260", "type": "checkbox" },
                        { "nama": "Inkontinen BAB & BAK", "type": "label" },
                        { "id": 21002259, "nama": "", "descNilai": "4", "target": "21002260", "type": "checkbox" },
                        { "id": 21002260, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listKebutuhanEdukasi = [
                {
                    "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                    "detail": [
                        { "id": 21002262, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002263, "nama": "Ya", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Jika ya, sebutkan hambatan (bisa dipilih lebih dari satu) :",
                    "detail": [
                        { "id": 21002264, "nama": "Pendengaran", "type": "checkbox" },
                        { "id": 21002265, "nama": "Penglihatan", "type": "checkbox" },
                        { "id": 21002266, "nama": "Kognitif", "type": "checkbox" },
                        { "id": 21002267, "nama": "Fisik", "type": "checkbox" },
                        { "id": 21002268, "nama": "Budaya", "type": "checkbox" },
                        { "id": 21002269, "nama": "Agama", "type": "checkbox" },
                        { "id": 21002270, "nama": "Emosi", "type": "checkbox" },
                        { "id": 21002271, "nama": "Bahasa", "type": "checkbox" },
                        { "id": 21002272, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002273, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Dibutuhkan penerjemah",
                    "detail": [
                        { "id": 21002274, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002275, "nama": "Ya, jika ya sebutkan", "type": "checkbox" },
                        { "id": 21002276, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Kebutuhan pembelajaran pasien (pilih topik pembelajaran pada kotak yang tersedia)",
                    "detail": [
                        { "id": 21002277, "nama": "Diagnosa & Manajemen", "type": "checkbox" },
                        { "id": 21002278, "nama": "Obat-obtan", "type": "checkbox" },
                        { "id": 21002279, "nama": "Perawatan Luka", "type": "checkbox" },
                        { "id": 21002280, "nama": "Rehabilitasi", "type": "checkbox" },
                        { "id": 21002281, "nama": "Manajemen nyeri", "type": "checkbox" },
                        { "id": 21002282, "nama": "Diet dan nutrisi", "type": "checkbox" },
                        { "id": 21002283, "nama": "Lain-lainnya", "type": "checkbox" },
                        { "id": 21002284, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerencanaanPulang = [
                {
                    "id": 1, "nama": "Kriteria Discharge Planning :",
                    "detail": [
                        { "nama": "A. Umur > 65 tahun", "type": "label" },
                        { "id": 21002285, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002286, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "B. Keterbatasan mobilitas", "type": "label" },
                        { "id": 21002287, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002288, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "C. Perawatan atau pengobatan lanjutan", "type": "label" },
                        { "id": 21002289, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002290, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "D. Bantuan untuk melakukan aktifitas sehari-hari", "type": "label" },
                        { "id": 21002291, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002292, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bila salah satu jawaban 'Ya' dari kriteria perencanaan pulang diatas, maka akan dilanjutkan dengan perencanaan pulang sebagai berikut :",
                    "detail": [
                        { "id": 21002293, "nama": "Perawatan diri (mandi, BAB, BAK)", "type": "checkbox2" },
                        { "id": 21002294, "nama": "Latihan fisik lanjutan", "type": "checkbox2" },
                        { "id": 21002295, "nama": "Pemantauan pemberian obat", "type": "checkbox2" },
                        { "id": 21002296, "nama": "Pendampingan tenaga khusus di rumah", "type": "checkbox2" },
                        { "id": 21002297, "nama": "Pemantauan diet", "type": "checkbox2" },
                        { "id": 21002298, "nama": "Bantuan medis/perawat di rumah (home care)", "type": "checkbox2" },
                        { "id": 21002299, "nama": "Perawatan luka", "type": "checkbox2" },
                        { "id": 21002300, "nama": "Bantuan untuk melakukan aktifitas fisik (kursi roda, alat bantu jalan)", "type": "checkbox2" },
                    ]
                },
            ]

            $scope.listDiagnosaKeperatawan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002302, "nama": "Nyeri", "type": "checkbox" },
                        { "id": 21002303, "nama": "Suhu Tubuh", "type": "checkbox" },
                        { "id": 21002304, "nama": "Prefusi Jaringan", "type": "checkbox" },
                        { "id": 21002305, "nama": "Pola Tidur", "type": "checkbox" },
                        { "id": 21002306, "nama": "Eliminasi", "type": "checkbox" },
                        { "id": 21002307, "nama": "Konflik Peran", "type": "checkbox" },
                        { "id": 21002308, "nama": "Mobilitas/Aktivitas", "type": "checkbox" },
                        { "id": 21002309, "nama": "Pengetahuan/Komunikasi", "type": "checkbox" },
                        { "id": 21002310, "nama": "Jalan Nafas/Pertukaran Gas", "type": "checkbox" },
                        { "id": 21002311, "nama": "Integrasi Kulit", "type": "checkbox" },
                        { "id": 21002312, "nama": "Keseimbangan Cairan dan Elektrolit", "type": "checkbox" },
                        { "id": 21002313, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 21002314, "nama": "", "type": "textbox" },
                        { "id": 21002315, "nama": "Sensori Persepsi", "type": "checkbox" },
                        { "id": 21002316, "nama": "Cemas", "type": "checkbox" },
                        { "id": 21002317, "nama": "Resti Infeksi", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Data Penunjang",
                    "detail": [
                        { "id": 21002318, "nama": "Lab", "type": "checkbox" },
                        { "id": 21002319, "nama": "Radiologi", "type": "checkbox" },
                        { "id": 21002320, "nama": "EKG", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNamaPengkaji = [
                {
                    "id": 1, "nama": "Tanggal & Jam",
                    "detail": [
                        { "id": 21002321, "nama": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Nama Perawat",
                    "detail": [
                        { "id": 21002322, "nama": "", "type": "combobox" },
                    ]
                }
            ]

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

            // // RESEP OBAT
            // $scope.columnGrid = [
            //     {
            //         "field": "no",
            //         "title": "No",
            //         "width": "30px",
            //     },
            //     {
            //         "field": "namaruangandepo",
            //         "title": "Depo",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "namaproduk",
            //         "title": "Deskripsi",
            //         "width": "200px",
            //     },
            //     {
            //         "field": "jumlah",
            //         "title": "Qty",
            //         "width": "40px",
            //     },
            //     {
            //         "field": "dosis",
            //         "title": "Dosis",
            //         "width": "40px",
            //     },
            //     // {
            //     //     "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
            //     //     "width": 40
            //     // },
            //     // {
            //     //     "field": "tglpelayanan",
            //     //     "title": "Tgl Pelayanan",
            //     //     "width": "90px",
            //     // },
            //     // {
            //     //     "field": "noregistrasi",
            //     //     "title": "No.Registrasi",
            //     //     "width": "100px",
            //     // },
            //     // {
            //     //     "field": "noresep",
            //     //     "title": "No.Resep",
            //     //     "width": "100px",
            //     // },
            //     // {
            //     //     "field": "rke",
            //     //     "title": "R/ke",
            //     //     "width": "30px",
            //     // },
            //     // {
            //     //     "field": "jeniskemasan",
            //     //     "title": "Kemasan",
            //     //     "width": "80px",
            //     // },
            //     // {
            //     //     "field": "satuanstandar",
            //     //     "title": "Satuan",
            //     //     "width": "80px",
            //     // },
            //     // {
            //     //     "field": "hargasatuan",
            //     //     "title": "Harga Satuan",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "hargadiscount",
            //     //     "title": "Harga Discount",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "jasa",
            //     //     "title": "Jasa",
            //     //     "width": "70px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "total",
            //     //     "title": "Total",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "nostruk",
            //     //     "title": "No Struk",
            //     //     "width": "100px"
            //     // }
            // ];

            // medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.cc.noregistrasi).then(function (dat) {
            //     $scope.isRouteLoading = false;
            //     for (var i = 0; i < dat.data.length; i++) {
            //         dat.data[i].no = i + 1
            //         dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //         dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //     }
            //     $scope.dataGrid = dat.data;

            // });


            // // END RESEPOBAT


            // // DIAGNOSA
            // medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
            //     $scope.listDiagnosaTindakan = data;
            // });
            // medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
            //     $scope.listDiagnosa = data;
            // });
            // medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
            //     $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
            // });

            
            // // ICD 10
            // function validasiIcd10() {
            //     var listRawRequired = [
            //         "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
            //         "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
            //     ]
            //     var isValid = ModelItem.setValidation($scope, listRawRequired);
            //     if (isValid.status) {
            //         var norec_diagnosapasien = "";
            //         var tglinput = "";
            //         if ($scope.dataIcd10Selected != undefined) {
            //             norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
            //             tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
            //         } else {
            //             tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
            //         }
            //         var keterangan = "";
            //         if ($scope.item.keterangan == undefined) {
            //             keterangan = "-"
            //         }
            //         else {
            //             keterangan = $scope.item.keterangan
            //         }

            //         $scope.now = new Date();
            //         var data = {
            //             norec_dp: norec_diagnosapasien,
            //             noregistrasifk: $scope.cc.norec,
            //             tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //             objectdiagnosafk: $scope.item.diagnosa.id,
            //             objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
            //             tglinputdiagnosa: tglinput,
            //             keterangan: keterangan,
            //             kasusbaru: $scope.item.kasusbaru,
            //             kasuslama: $scope.item.kasuslama
            //         }
            //         $scope.objSave = {
            //             detaildiagnosapasien: data,
            //         }
            //     } else {
            //         ModelItem.showMessages(isValid.messages)
            //     }
            // }


            // $scope.saveIcd10 = function () {
            //     if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //         toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //         return
            //     }
            //     validasiIcd10();
            //     console.log(JSON.stringify($scope.objSave));
            //     medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {
            //         $scope.savePeriksaDokter()
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr
            //         ).then(function (res) {
            //         })
            //         delete $scope.item.jenisDiagnosis;
            //         delete $scope.item.diagnosa;
            //         delete $scope.item.keterangan;
            //         delete $scope.dataIcd10Selected;
            //         loadDiagnosa()
            //     })
            // }


            // $scope.savePeriksaDokter=  function(){debugger
            //     var kelompokUser = medifirstService.getKelompokUser()
            //     // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
            //     if(kelompokUser== 'dokter' ){
            //         var data ={
            //             "norec_apd" :$scope.cc.norec,
            //             "kelompokUser" : kelompokUser
            //         }

            //         medifirstService.postNonMessage('rawatjalan/save-periksa',data)
            //         .then(function (res) {

            //         })
            //     }
            // }

            // $scope.deleteIcd10 = function () {
            //     if ($scope.item.diagnosa == undefined) {
            //         alert("Pilih data yang mau di hapus!!")
            //         return
            //     }
            //     debugger
            //     var diagnosa = {
            //         norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
            //     }
            //     debugger
            //     var objDelete =
            //     {
            //         diagnosa: diagnosa,
            //     }
            //     debugger
            //     medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
            //     debugger
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
            //             'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.jenisDiagnosis;
            //         delete $scope.item.diagnosa;
            //         delete $scope.item.keterangan;
            //         delete $scope.dataIcd10Selected
            //         loadDiagnosa()


            //     })
            // }

            // // ICD 9
            // function validasi() {
            //     var listRawRequired = [
            //         "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
            //     ]
            //     var isValid = ModelItem.setValidation($scope, listRawRequired);
            //     if (isValid.status) {debugger
            //         var norec_diagnosapasien = "";
            //         if ($scope.dataIcd9Selected != undefined) {
            //             norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
            //         }
            //         var ketTindakans = "";
            //         if ($scope.item.ketTindakan != undefined) {
            //             ketTindakans = $scope.item.ketTindakan
            //         }
            //         var data = {
            //             norec_dp: norec_diagnosapasien,
            //             objectpasienfk: $scope.cc.norec,
            //             tglpendaftaran: $scope.item.tglRegistrasi,
            //             objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
            //             keterangantindakan: ketTindakans
            //         }

            //         $scope.objSave =
            //             {
            //                 detaildiagnosatindakanpasien: data,
            //             }
            //     } else {debugger
            //         ModelItem.showMessages(isValid.messages)
            //     }
            // }
            // $scope.saveIcd9 = function () {
            //      if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //         toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //         return
            //     }
            //     validasi();
            //     debugger
            //     console.log(JSON.stringify($scope.objSave));
            //     medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.diagnosaTindakan;
            //         delete $scope.item.ketTindakan;
            //         delete $scope.dataIcd9Selected;
            //         loadDiagnosa()
            //     })
            // }
            // $scope.deleteIcd9 = function () {
            //     if ($scope.item.diagnosaTindakan == undefined) {
            //         alert("Pilih data yang mau di hapus!!")
            //         return
            //     }
            //     var diagnosa = {
            //         norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
            //     }
            //     var objDelete =
            //     {
            //         diagnosa: diagnosa,
            //     }
            //     medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
            //             'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.diagnosaTindakan;
            //         delete $scope.item.ketTindakan;
            //         delete $scope.dataIcd9Selected
            //         loadDiagnosa()

            //     })
            // }



            // $scope.batal = function () {
            //     delete $scope.item.diagnosaTindakan;
            //     delete $scope.item.ketTindakan;
            //     delete $scope.item.jenisDiagnosis;
            //     delete $scope.item.diagnosa;
            //     delete $scope.item.keterangan;
            // }

            // loadDiagnosa();
            // function loadDiagnosa() {
            //     $scope.isRouteLoading = true;
            //     var param =""
            //     if($scope.item.isNoRegis == true)
            //        param = "noReg=" + $scope.item.noregistrasi;
            //     else
            //       param = "noCm=" + $scope.item.noMr;
              
            //     medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
            //         + param
            //     ).then(function (data) {
            //         $scope.isRouteLoading = false;
            //         var dataICD9 = data.data.datas;
            //         $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            //             data: dataICD9,
            //             pageSize: 10
            //         });
            //     });

            //     medifirstService.get("emr/get-diagnosapasienbynoreg?"
            //         + param
            //     ).then(function (data) {
            //         // $scope.isRouteLoading = false;
            //         var dataICD10 = data.data.datas;
            //         $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
            //             data: dataICD10,
            //             pageSize: 10
            //         });
            //     });
            // }



            // $scope.columnDiagnosaIcd9 = [{
            //     "title": "No",
            //     "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
            //     // "width": "30px"
            // }, 
            // {
            //     "field": "noregistrasi",
            //     "title": "No Registrasi",
            //     // "width": "100px"
            // }, {
            //     "field": "kddiagnosatindakan",
            //     "title": "Kode ICD 9",
            //     // "width": "100px"
            // }, {
            //     "field": "namadiagnosatindakan",
            //     "title": "Nama ICD 9",
            //     // "width": "300px"
            // }, {
            //     "field": "keterangantindakan",
            //     "title": "Keterangan",
            //     // "width": "200px"
            // }, {
            //     "field": "namaruangan",
            //     "title": "Ruangan",
            //     // "width": "200px"
            // },
            // {
            //     "field": "namalengkap",
            //     "title": "Penginput",
            //     // "width": "200px"
            // },
            // {
            //     "field": "tglinputdiagnosa",
            //     "title": "Tgl Input",
            //     // "width": "200px"
            // }];
            // $scope.columnDiagnosaIcd10 = [{
            //     "title": "No",
            //     "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
            //     // "width": "30px"
            // }, 
            // {
            //     "field": "noregistrasi",
            //     "title": "No Registrasi",
            //     // "width": "100px"
            // },{
            //     "field": "jenisdiagnosa",
            //     "title": "Jenis Diagnosis",
            //     // "width": "150px"
            // }, {
            //     "field": "kddiagnosa",
            //     "title": "Kode ICD 10",
            //     // "width": "100px"
            // }, {
            //     "field": "namadiagnosa",
            //     "title": "Nama ICD 10",
            //     // "width": "300px"
            // }, {
            //     "field": "keterangan",
            //     "title": "Keterangan",
            //     // "width": "200px"
            // }, {
            //     "field": "namaruangan",
            //     "title": "Ruangan",
            //     // "width": "150px"
            // },
            // {
            //     "field": "namalengkap",
            //     "title": "Penginput",
            //     // "width": "200px"
            // },
            // {
            //     "field": "tglinputdiagnosa",
            //     "title": "Tgl Input",
            //     // "width": "200px"
            // }];

            // // END DIAGNOSA




            // // TINDAKAN

            // // getTindakan

            // medifirstService.get("rawatjalan/get-tindakan?noReg=" + $scope.cc.noregistrasi).then(function (res){

            //     for (var i = 0; i < res.data.length; i++) {
            //         res.data[i].no = i + 1
            //     }
            //     $scope.dataTindakan = res.data;

            // });

            // $scope.columnDataTindakan =
            //     [
            //         {
            //             "field": "no",
            //             "title": "No",
            //             "width": "40px",
            //         },
            //         {
            //             "field": "namaproduk",
            //             "title": "Nama Pelayanan",
            //             "width": "200px",
            //         },
            //         {
            //             "field": "jumlah",
            //             "title": "Jumlah",
            //             "width": "200px",
            //         },
            //         {
            //             "field": "harganetto",
            //             "title": "Harga",
            //             "width": "200px",
            //         },
            //     ];
            // // END TINDAKAN

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
                    $scope.item.obj[116121] = true
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = true   
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = true
                    $scope.item.obj[116124] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = true
                }
            });
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
                
            $scope.SkorNorton[21002242] = 0;
            $scope.SkorNorton[21002248] = 0;
            $scope.SkorNorton[21002254] = 0;
            $scope.SkorNorton[21002260] = 0;
            $scope.getSkorNorton = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorNorton[jawab.target] = $scope.SkorNorton[jawab.target] + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorNorton[jawab.target] = $scope.SkorNorton[jawab.target] - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[jawab.target] = $scope.SkorNorton[jawab.target]
                setSkorNorton()
            }

            function setSkorNorton()
            {
                var nilai1 = $scope.SkorNorton[21002242]
                var nilai2 = $scope.SkorNorton[21002248]
                var nilai3 = $scope.SkorNorton[21002254]
                var nilai4 = $scope.SkorNorton[21002260]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4
                $scope.item.obj[21002572] = total;
                
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

                $scope.item.obj[21002236] = $scope.skorNutrisi
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


            
                

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[116125] = true
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = true
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = true
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = true
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = true
                    $scope.item.obj[116130] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = true
                }

            }

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

            $scope.GCSKuantitatif = function ()
            {
                let e = parseInt($scope.item.obj[21001887]) || 0;
                let v = parseInt($scope.item.obj[21001888]) || 0;
                let m = parseInt($scope.item.obj[21001889]) || 0;
                let hasil =  e + v + m;
                
                if(hasil >= 14 && hasil <=15)
                {
                    $scope.item.obj[21009270] = hasil + " Compos mentis";
                } else if(hasil >= 12 && hasil <= 13)
                {
                    $scope.item.obj[21009270] = hasil + " Apatis";
                } else if(hasil >= 11 && hasil <= 12)
                {
                    $scope.item.obj[21009270] = hasil + " Somnolent";
                }else if(hasil >= 8 && hasil <= 10)
                {
                    $scope.item.obj[21009270] = hasil + " Stupor";
                }else if(hasil < 5)
                {
                    $scope.item.obj[21009270] = hasil + " Koma";
                }else
                {
                    $scope.item.obj[21009270] = "";
                }
            }

            $scope.MaxGCSValue = function (e, id) {
                switch (id)
                {
                    case 21001887:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52)
                            e.preventDefault()
                        break;
                    case 21001888:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53)
                            e.preventDefault()
                        break;
                    case 21001889:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53 && e.which !== 54)
                            e.preventDefault()
                        break;
                }
            }

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
                    'AsesmenUlangKeperRJGeriatriCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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