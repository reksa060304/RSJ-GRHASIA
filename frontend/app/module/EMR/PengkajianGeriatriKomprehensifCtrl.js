define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianGeriatriKomprehensifCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$mdDialog',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {

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
            $scope.cc.emrfk = 3000921
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.listTanggal = []
            $scope.listBB = []
            $scope.listEnergi = []
            $scope.listProtein = []
            $scope.listCairan = []
            $scope.listFisikKlinis = []
            $scope.listBiokimia = []
            $scope.listPerubahanDiet = []
            $scope.listKarbohidrat = []
            $scope.listLemak = []
            $scope.now = new Date()
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + $scope.cc.emrfk).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga = []
                var arrayShiftJaga2 = []
                var arrayShiftJaga3 = []
                var arrayShiftJaga4 = []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false
                    if(element.kodeexternal == 'listnorton'){
                        for (let z = 0; z < arrayShiftJaga3.length; z++) {
                            const element2 = arrayShiftJaga3[z];
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
                                id: element.id,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga3.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listeuroqol') {
                        for (let z = 0; z < arrayShiftJaga4.length; z++) {
                            const element2 = arrayShiftJaga4[z];
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
                                id: element.id,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                style: element.style,
                                type: element.type,

                            }
                            arrayShiftJaga4.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata') {
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
                    if (element.kodeexternal == 'baker') {
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
                $scope.listBaker = arrayShiftJaga2
                
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga3.length; k++) {
                    const element = arrayShiftJaga3[k];
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
                $scope.listNorton = arrayShiftJaga3

                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga4.length; k++) {
                    const element = arrayShiftJaga4[k];
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
                $scope.listEuroqol = arrayShiftJaga4
                
            })
            $scope.listSkorWong = [{
                "id": 9, "nama": "Score ",
                "detail": [
                    { "id": 310108, "nama": "0 = Tidak Ada Nyeri", "type": "checkbox"},
                    { "id": 310109, "nama": "1 - 2 - 3 = Sedikit Nyeri", "type": "checkbox"},
                    { "id": 310110, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                    { "id": 310111, "nama": "5 - 6 - 7 = Mengganggu aktivitas", "type": "checkbox"},
                    { "id": 310112, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                    { "id": 310113, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
                ]
            }]
            $scope.listNyeriAnak = [
                {
                    "id": 10, "nama": "Hurts", "detail": [
                    { "id": 310102, "nama": "Tidak Nyeri","nama1": "0", "descNilai": 0 },
                    { "id": 310103, "nama": "Sedikit Nyeri", "nama1": "1 2 3", "descNilai": 2 }, 
                    { "id": 310104, "nama": "Agak mengganggu", "nama1": "4", "descNilai": 4 },
                    { "id": 310105, "nama": "Mengganggu Aktivitas","nama1": "5 6 7",  "descNilai": 6}, 
                    { "id": 310106, "nama": "Sangat mengganggu", "nama1": "8", "descNilai": 8 },
                    { "id": 310107, "nama": "Tak tertahankan", "nama1": "9 10",  "descNilai": 10 }
                ]
                }
            ]
            $scope.listRadio = [{
                "name": "Ya",
                "id": 1,
                "value": "Ya"
            }, {
                "name": "Tidak",
                "id": 2,
                "value": "Tidak"
            }]
            $scope.listBarthel = [{
                    "id": 1,
                    "nama": "Mengendalikan Rangsang BAB",
                    "detail": [{
                            "id": 1,
                            "nama": "Tidak terkendali/tak teratur (perlu pencahar)",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310035,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Kadang-kadang tak terkendali",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310036,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Terkendali teratur",
                            "descNilai": "2",
                            "ket": 1,
                            "detail": [{
                                id: 310037,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "Mengendalikan Rangsang BAK",
                    "detail": [{
                            "id": 1,
                            "nama": "Tak terkendali pakai kateter",
                            "descNilai": "0",
                            "detail": [{
                                id: 310038,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Kadang-kadang tak terkendali (hanya 1 kali / 24 jam)",
                            "descNilai": "1",
                            "detail": [{
                                id: 310039,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Mandiri",
                            "descNilai": "2",
                            "detail": [{
                                id: 310040,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "Membersihkan diri (mencuci wajah, menyikat rambut, mencukur kumis, sikat gigi)",
                    "detail": [{
                            "id": 1,
                            "nama": "Butuh pertolongan orang lain",
                            "descNilai": "0",
                            "detail": [{
                                id: 310041,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mandiri",
                            "descNilai": "1",
                            "detail": [{
                                id: 310042,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 4,
                    "nama": "Penggunaan WC (keluar masuk WC, melepas/memakai celana, cebok, menyiram)",
                    "detail": [{
                            "id": 1,
                            "nama": "Butuh pertolongan orang lain",
                            "descNilai": "0",
                            "detail": [{
                                id: 310043,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Perlu pertolongan beberapa kegiatan tetapi dapat mengerjakan sendiri beberapa kegiatan yang lain",
                            "descNilai": "1",
                            "detail": [{
                                id: 310044,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Mandiri",
                            "descNilai": "2",
                            "detail": [{
                                id: 310045,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 5,
                    "nama": "Makan minum (jika makan harus berupapotongan, dianggap dibantu)",
                    "detail": [{
                            "id": 1,
                            "nama": "Tidak mampu",
                            "descNilai": "0",
                            "detail": [{
                                id: 310046,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Perlu ditolong memotong makanan",
                            "descNilai": "1",
                            "detail": [{
                                id: 310047,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Mandiri",
                            "descNilai": "2",
                            "detail": [{
                                id: 310048,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 6,
                    "nama": "Bergerak dari kursi roda ke tempat tidur dan sebaliknya(termasuk duduk di tempat tidur)",
                    "detail": [{
                            "id": 1,
                            "nama": "Tidak mampu",
                            "descNilai": "0",
                            "detail": [{
                                id: 310049,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Perlu banyak bantuan untuk bisa duduk (2 orang)",
                            "descNilai": "1",
                            "detail": [{
                                id: 310050,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Bantuan minimal 1 orang",
                            "descNilai": "2",
                            "detail": [{
                                id: 310051,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Mandiri",
                            "descNilai": "3",
                            "detail": [{
                                id: 310052,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 7,
                    "nama": "Berjalan di tempat rata (atau jika tidak bisa berjalan, menjalankan kursi roda) ",
                    "detail": [{
                            "id": 1,
                            "nama": "Tidak mampu",
                            "descNilai": "0",
                            "detail": [{
                                id: 310053,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Bisa (pindah) dengan kursi ",
                            "descNilai": "1",
                            "detail": [{
                                id: 310054,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Berjalan dengan bantuan 1 orang",
                            "descNilai": "2",
                            "detail": [{
                                id: 310055,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Mandiri",
                            "descNilai": "3",
                            "detail": [{
                                id: 310056,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 8,
                    "nama": "Berpakaian (termasuk memasang tali sepatu, mengencangkan sabuk) ",
                    "detail": [{
                            "id": 1,
                            "nama": "Tergantung orang lain",
                            "descNilai": "0",
                            "detail": [{
                                id: 310057,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Sebagian dibantu (misal mengancingkan baju)",
                            "descNilai": "1",
                            "detail": [{
                                id: 310058,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Mandiri",
                            "descNilai": "2",
                            "detail": [{
                                id: 310059,
                                baris: 1
                            }]
                        },

                    ]
                },
                {
                    "id": 9,
                    "nama": "Naik turun tangga",
                    "detail": [{
                            "id": 1,
                            "nama": "Tidak Mampu",
                            "descNilai": "0",
                            "detail": [{
                                id: 310060,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Butuh Pertolongan",
                            "descNilai": "1",
                            "detail": [{
                                id: 310061,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Mandiri",
                            "descNilai": "2",
                            "detail": [{
                                id: 310062,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 10,
                    "nama": "Mandi",
                    "detail": [{
                            "id": 1,
                            "nama": "Tergantung orang lain ",
                            "descNilai": "0",
                            "detail": [{
                                id: 310063,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mandiri",
                            "descNilai": "1",
                            "detail": [{
                                id: 310064,
                                baris: 1
                            }]
                        },
                    ]
                },
            ]
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 310114, "nama": "0", "type": "checkbox", "ket": "= Tidak Nyeri" },
                    { "id": 310115, "nama": "1 - 3", "type": "checkbox", "ket": "= Nyeri Ringan" },
                    { "id": 310116, "nama": "4 - 6", "type": "checkbox", "ket": "= Nyeri Sedang" },
                    { "id": 310117, "nama": "7 - 10", "type": "checkbox", "ket": "= Nyeri Berat" },
                ]
            }]
            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ? Jika Ya, berapa banyak atau berapa kg anda kehilangan BB",
                    "detail": [
                        { "id": 310157, "nama": "a. Tidak(skor 0)", "descNilai" : "0", "type": "checkbox" },
                        { "id": 310158, "nama": "b. ragu (skor 2)", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "nama": "a. 1 - 5kg",
                    "detail": [
                        { "id": 310159, "nama": "1", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "nama": "b. 6 - 10kg",
                    "detail": [{
                        "id": 310160,
                        "nama": "2",
                        "descNilai": "2",
                        "type": "checkbox"
                    }, ]
                },
                {
                    "nama": "c. 11 - 15kg",
                    "detail": [{
                        "id": 310161,
                        "nama": "3",
                        "descNilai": "3",
                        "type": "checkbox"
                    }, ]
                },
                {
                    "nama": "d. > 15kg",
                    "detail": [{
                        "id": 310162,
                        "nama": "4",
                        "descNilai": "4",
                        "type": "checkbox"
                    }, ]
                },
                {
                    "nama": "e. Ragu - ragu",
                    "detail": [{
                        "id": 310163,
                        "nama": "2",
                        "descNilai": "2",
                        "type": "checkbox"
                    }, ]
                },
                {
                    "id": 2, "no": 2, "nama": "Apakah Anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah / menelan?",
                    "detail": [
                        { "id": 310164, "nama": "a. Tidak(skor 0)", "descNilai" : "0", "type": "checkbox" },
                        { "id": 310165, "nama": "b. ragu (skor 2)", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listmmse = [
                {
                    "id": 1,
                    "nama": "ORIENTASI",
                    "detail": [{
                            "id": 1,
                            "nama": "Sekarang (tahun), (musim), (bulan), (tanggal), hari apa ?",
                            "max": 5,
                            "detail": [{
                                id: 310172,
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Kita berada dimana ? (negara), (propinsi), (kota), (gedung), (ruang),(tanyakan pada responden)",
                            "max": 5,
                            "detail": [{
                                id: 310173,
                            }]
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "REGISTRASI",
                    "detail": [{
                            "id": 3,
                            "nama": "Pemeriksa menyebut 3 benda yang berbeda kelompoknya selang 1 detik (misal apel, uang, meja), responden diminta mengulanginya. Nilai 1 untuk tiap nama benda yang benar. Ulangi sampai responden dapat menyebut-kan dengan benar dan catat jumlah pengulangan",
                            "max": 4,
                            "detail": [{
                                id: 310174,
                            }]
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "ATENSI DAN KALKULASI",
                    "detail": [{
                        "id": 4,
                        "nama": "Pengurangan 100 dengan 7 secara berurutan. Nilai 1 untuk tiap jawaban yang benar.Hentikan setelah 5 jawaban.Atau responden diminta mengeja terbalik kata“ W A H Y U”(nilai diberi pada huruf yang benar sebelum kesalahan; misalnya uyahw = 2 nilai) ",
                        "max": 5,
                        "detail": [{
                            id: 310175,
                        }]
                    }, ]
                },
                {
                    "id": 4,
                    "nama": "MENGINGAT KEMBALI (RECALL)",
                    "detail": [{
                        "id": 5,
                        "nama": "Responden diminta menyebut kembali 3 nama benda di atas",
                        "max": 3,
                        "detail": [{
                            id: 310176,
                        }]
                    }, ]
                },
                {
                    "id": 5,
                    "nama": "BAHASA",
                    "detail": [{
                        "id": 6,
                        "nama": "Responden diminta menyebutkan nama benda yang ditunjukkan (perlihat-kan pensil dan jam tangan)",
                        "max": 2,
                        "detail": [{
                            id: 310177,
                        }]
                    }, {
                        "id": 7,
                        "nama": "Responden diminta mengulang kalimat : “tanpa kalau dan atau tetapi”",
                        "max": 1,
                        "detail": [{
                            id: 310178,
                        }]
                    },
                    {
                        "id": 8,
                        "nama": "Responden diminta melakukan perintah : “Ambil kertas ini dengan tangan anda, lipatlah menjadi dua dan letakkan di lantai”. ",
                        "max": 3,
                        "detail": [{
                            id: 310179,
                        }]
                    },
                    {
                        "id": 9,
                        "nama": "Responden diminta membaca dan melakukan yang dibacanya :“ Pejamkanlah mata anda” ", 
                        "max": 1,
                        "detail": [{
                            id: 310180,
                        }]
                    },
                    {
                        "id": 10,
                        "nama": "Responden diminta menulis sebuah kalimat secara spontan",
                        "max": 1,
                        "detail": [{
                            id: 310181,
                        }]
                    },
                    {
                        "id": 11,
                        "nama": "Responden diminta menyalin gambar",
                        "max": 1,
                        "detail": [{
                            id: 310182,
                        }]
                    },
                ]
                },
            ]
            $scope.listgds = [
                {
                    "id": 1,
                    "nama": "Apakah anda pada dasarnya puas dengan kehidupan anda ?",
                    "detail":[
                        {
                            "id": 310191,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310192,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 2,
                    "nama": "Apakah anda sudah meninggalkan banyak kegiatan dan minat/kesenangan anda ?",
                    "detail": [{
                            "id": 310193,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310194,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 3,
                    "nama": "Apakah anda merasa kehidupan anda hampa ?",
                    "detail": [{
                            "id": 310195,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310196,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 4,
                    "nama": "Apakah anda sering merasa bosan ?",
                    "detail": [{
                            "id": 310197,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310198,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 5,
                    "nama": "Apakah anda mempunyai semangat baik setiap saat ?",
                    "detail": [{
                            "id": 310199,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310200,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 6,
                    "nama": "Apakah anda takut sesuatu yang buruk akan terjadi pada anda ?",
                    "detail": [{
                            "id": 310201,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310202,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 7,
                    "nama": "Apakah anda merasa bahagia pada sebagian besar hidup anda ?",
                    "detail": [{
                            "id": 310203,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310204,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 8,
                    "nama": "Apakah anda sering merasa tidak berdaya ?",
                    "detail": [{
                            "id": 310205,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310206,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 9,
                    "nama": "Apakah anda kebih senang tinggal di rumah daripada pergi ke luar dan mengerjakan sesuatu hal yang baru ? ",
                    "detail": [{
                            "id": 310207,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310208,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 10,
                    "nama": "Apakah anda merasa mempunyai banyak masalah dengan daya ingat anda dibandingkan kebanyakan orang ? ",
                    "detail": [{
                            "id": 310209,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310210,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 11,
                    "nama": "Apakah anda pikir hidup anda sekarang ini menyenangkan ?",
                    "detail": [{
                            "id": 310211,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310212,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 12,
                    "nama": "Apakah anda merasa tidak berharga seperti perasaan anda saat kini ?",
                    "detail": [{
                            "id": 310213,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310214,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 13,
                    "nama": "Apakah anda merasa penuh semangat ?",
                    "detail": [{
                            "id": 310215,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310216,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 14,
                    "nama": "Apakah anda merasa bahwa keadaan anda tidak ada harapan ?",
                    "detail": [{
                            "id": 310217,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310218,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 15,
                    "nama": "Apakah anda pikir bahwa orang lain lebih baik keadaannya dari anda ?",
                    "detail": [{
                            "id": 310219,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310220,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                }
            ]


$scope.listeuroqol = [
                {
                    "id": 1,
                    "nama": "1. MOBILITAS",
                    "detail": [{
                            "id": 1,
                            "nama": "Saya tidak mempunyai masalah untuk berjalan",
                            "detail": [{
                                id: 310224,
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Saya ada masalah untuk berjalan",
                            "detail": [{
                                id: 310225,
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Saya hanya mampu berbaring",
                            "detail": [{
                                id: 310226,
                            }]
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "2. PERAWATAN DIRI SENDIRI",
                    "detail": [{
                            "id": 1,
                            "nama": "Saya tidak mempunyai kesulitan dalam perawatan diri sendiri",
                            "detail": [{
                                id: 310228,
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Saya mengalami kesulitan untuk membasuh badan, mandi atau berpakaian",
                            "detail": [{
                                id: 310229,
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Saya tidak mampu membasuh badan, mandi atau berpakaian sendiri",
                            "detail": [{
                                id: 310230,
                            }]
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "3. AKTIVITAS SEHARI-HARI (misalnya pekerjaan rumah tangga, aktivitas keluarga, bersantai)",
                    "detail": [{
                        "id": 1,
                        "nama": "Saya tak mempunyai kesulitan dalam melaksanakan kegiatan sehari-hari",
                        "max": 5,
                        "detail": [{
                            id: 310232,
                        }]
                    },
                    {
                        "id": 2,
                        "nama": "Saya mempunyai keterbatasan dalam melaksanakan kegiatan sehari-hari",
                        "detail": [{
                            id: 310233,
                        }]
                    },
                    {
                        "id": 3,
                        "nama": "Saya tak mampu melaksanakan kegiatan sehari-hari",
                        "detail": [{
                            id: 310234,
                        }]
                    },
                 ]
                },
                {
                    "id": 4,
                    "nama": "4. RASA NYERI / TAK NYAMAN",
                    "detail": [{
                        "id": 1,
                        "nama": "Saya tidak mempunyai keluhan rasa nyeri atau rasa tak nyaman",
                        "max": 3,
                        "detail": [{
                            id: 310236,
                        }]
                    },
                    {
                        "id": 2,
                        "nama": "Saya suka merasakan agak nyeri atau agak kurang nyaman",
                        "detail": [{
                            id: 310237,
                        }]
                    },
                    {
                        "id": 3,
                        "nama": "Saya menderita karena keluhan rasa nyeri atau tidak nyaman",
                        "detail": [{
                            id: 310238,
                        }]
                    }, ]
                },
                {
                    "id": 5,
                    "nama": "5. RASA CEMAS / DEPRESI",
                    "detail": [{
                        "id": 1,
                        "nama": "Saya tidak merasa cemas/gelisah atau depresi (jiwa tertekan)",
                        "max": 2,
                        "detail": [{
                            id: 310240,
                        }]
                    }, {
                        "id": 2,
                        "nama": "Saya suka merasa agak cemas atau depresi",
                        "max": 1,
                        "detail": [{
                            id: 310241,
                        }]
                    },
                    {
                        "id": 3,
                        "nama": "Saya merasa sangat cemas atau sangat depresi",
                        "max": 3,
                        "detail": [{
                            id: 310242,
                        }]
                    },
                ]
                },
            ]
            $scope.listgds = [
                {
                    "id": 1,
                    "nama": "Apakah anda pada dasarnya puas dengan kehidupan anda ?",
                    "detail":[
                        {
                            "id": 310191,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310192,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 2,
                    "nama": "Apakah anda sudah meninggalkan banyak kegiatan dan minat/kesenangan anda ?",
                    "detail": [{
                            "id": 310193,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310194,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 3,
                    "nama": "Apakah anda merasa kehidupan anda hampa ?",
                    "detail": [{
                            "id": 310195,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310196,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 4,
                    "nama": "Apakah anda sering merasa bosan ?",
                    "detail": [{
                            "id": 310197,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310198,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 5,
                    "nama": "Apakah anda mempunyai semangat baik setiap saat ?",
                    "detail": [{
                            "id": 310199,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310200,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 6,
                    "nama": "Apakah anda takut sesuatu yang buruk akan terjadi pada anda ?",
                    "detail": [{
                            "id": 310201,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310202,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 7,
                    "nama": "Apakah anda merasa bahagia pada sebagian besar hidup anda ?",
                    "detail": [{
                            "id": 310203,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310204,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 8,
                    "nama": "Apakah anda sering merasa tidak berdaya ?",
                    "detail": [{
                            "id": 310205,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310206,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 9,
                    "nama": "Apakah anda kebih senang tinggal di rumah daripada pergi ke luar dan mengerjakan sesuatu hal yang baru ? ",
                    "detail": [{
                            "id": 310207,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310208,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 10,
                    "nama": "Apakah anda merasa mempunyai banyak masalah dengan daya ingat anda dibandingkan kebanyakan orang ? ",
                    "detail": [{
                            "id": 310209,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310210,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 11,
                    "nama": "Apakah anda pikir hidup anda sekarang ini menyenangkan ?",
                    "detail": [{
                            "id": 310211,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310212,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 12,
                    "nama": "Apakah anda merasa tidak berharga seperti perasaan anda saat kini ?",
                    "detail": [{
                            "id": 310213,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310214,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 13,
                    "nama": "Apakah anda merasa penuh semangat ?",
                    "detail": [{
                            "id": 310215,
                            "nama": "YA",
                            "descNilai": "0",
                            "style":""
                        },
                        {
                            "id": 310216,
                            "nama": "TIDAK",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        }
                    ]
                },
                {
                    "id": 14,
                    "nama": "Apakah anda merasa bahwa keadaan anda tidak ada harapan ?",
                    "detail": [{
                            "id": 310217,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310218,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                },
                {
                    "id": 15,
                    "nama": "Apakah anda pikir bahwa orang lain lebih baik keadaannya dari anda ?",
                    "detail": [{
                            "id": 310219,
                            "nama": "YA",
                            "descNilai": "1",
                            "style":"font-weight:bold"
                        },
                        {
                            "id": 310220,
                            "nama": "TIDAK",
                            "descNilai": "0",
                            "style":""
                        }
                    ]
                }
            ]

            $scope.SkorNorton = 0;
            $scope.getSkorNorton = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
console.log(jawab)
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorNorton = $scope.SkorNorton + parseFloat(jawab.reportdisplay)
                            break
                        } else {
                            $scope.SkorNorton = $scope.SkorNorton - parseFloat(jawab.reportdisplay)
                            break
                        }
                    } else {}
                }

                $scope.item.obj[310155] = $scope.SkorNorton
                // setSkorNorton()
            }
            $scope.SkorGDS = 0;
            $scope.getSkorGDS = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []

                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorGDS = $scope.SkorGDS + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorGDS = $scope.SkorGDS - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {}
                }

                $scope.item.obj[310221] = $scope.SkorGDS
                // setSkorNorton()
            }
            $scope.SkorMMSE = 0;
            $scope.getSkorMMSE = function (jawabss,jawab)
{
    //jumlah1
    let tgl1 = parseInt($scope.item.obj[310172]) || 0;
    let tgl2 = parseInt($scope.item.obj[310173]) || 0;
    let tgl3 = parseInt($scope.item.obj[310174]) || 0;
    let tgl4 = parseInt($scope.item.obj[310175]) || 0;
    let tgl5 = parseInt($scope.item.obj[310176]) || 0;
    let tgl6 = parseInt($scope.item.obj[310177]) || 0;
    let tgl7 = parseInt($scope.item.obj[310178]) || 0;
    let tgl8 = parseInt($scope.item.obj[310179]) || 0;
    let tgl9 = parseInt($scope.item.obj[310180]) || 0;
    let tgl10 = parseInt($scope.item.obj[310181]) || 0;
    let tgl11 = parseInt($scope.item.obj[310182]) || 0;
    let jumlah1 =  tgl1+tgl2+tgl3+tgl4+tgl5+tgl6+tgl7+tgl8+tgl9+tgl10+tgl11;
    $scope.item.obj[310183] = jumlah1;
}

// $scope.SkorEuroqol = 0;
// $scope.getSkorEuroqol = function (jawabss,jawab)
// {
// //jumlah1
// let tgl1 = parseInt($scope.item.obj[310224]) || 0;
// let tgl2 = parseInt($scope.item.obj[310225]) || 0;
// let tgl3 = parseInt($scope.item.obj[310226]) || 0;
// let tgl4 = parseInt($scope.item.obj[310228]) || 0;
// let tgl5 = parseInt($scope.item.obj[310229]) || 0;
// let tgl6 = parseInt($scope.item.obj[310230]) || 0;
// let tgl7 = parseInt($scope.item.obj[310232]) || 0;
// let tgl8 = parseInt($scope.item.obj[310233]) || 0;
// let tgl9 = parseInt($scope.item.obj[310234]) || 0;
// let tgl10 = parseInt($scope.item.obj[310236]) || 0;
// let tgl11 = parseInt($scope.item.obj[310237]) || 0;
// let tgl12 = parseInt($scope.item.obj[310238]) || 0;
// let tgl13 = parseInt($scope.item.obj[310240]) || 0;
// let tgl14 = parseInt($scope.item.obj[310241]) || 0;
// let tgl15 = parseInt($scope.item.obj[310242]) || 0;
// let jumlah2 =  tgl1+tgl2+tgl3+tgl4+tgl5+tgl6+tgl7+tgl8+tgl9+tgl10+tgl11+tgl12+tgl13+tgl14+tgl15;
// $scope.item.obj[310243] = jumlah2;
// }
//             // $scope.SkorMMSE = 0;
            // $scope.getSkorMMSE = function (jawabss,jawab) {
                
            //     $scope.SkorMMSE = parseFloat($scope.item.obj[310172]) + parseFloat($scope.item.obj[310173]) +
            //         parseFloat($scope.item.obj[310174]) + parseFloat($scope.item.obj[310175]) + parseFloat($scope.item.obj[310176]) + parseFloat($scope.item.obj[310177]) +
            //         parseFloat($scope.item.obj[310178]) + parseFloat($scope.item.obj[310179]) + parseFloat($scope.item.obj[310180]) +
            //         parseFloat($scope.item.obj[310181]) + parseFloat($scope.item.obj[310182])

            //     $scope.item.obj[310183] = $scope.SkorMMSE
            //     // setSkorNorton()
            // }
            $scope.skorNutrisi = 0;
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

                $scope.item.obj[310166] = $scope.skorNutrisi
            }

                        function setSkorNorton() {
                            var nilai1 = $scope.SkorNorton[22035532]
                            var nilai2 = $scope.SkorNorton[22035538]
                            var nilai3 = $scope.SkorNorton[22035544]
                            var nilai4 = $scope.SkorNorton[22035550]

                            var total = nilai1 + nilai2 + nilai3 + nilai4
                            $scope.item.obj[22035551] = total;

                        }
            $scope.$watch('item.obj[3016561]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)

                if (nilai == 0) {
                    $scope.item.obj[310114] = true
                    $scope.item.obj[310115] = false
                    $scope.item.obj[310116] = false
                    $scope.item.obj[310117] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[310114] = false
                    $scope.item.obj[310115] = true
                    $scope.item.obj[310116] = false
                    $scope.item.obj[310117] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[310114] = false
                    $scope.item.obj[310115] = false
                    $scope.item.obj[310116] = true
                    $scope.item.obj[310117] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[310114] = false
                    $scope.item.obj[310115] = false
                    $scope.item.obj[310116] = false
                    $scope.item.obj[310117] = true
                }
            });
            $scope.listLawton = [{
                    "id": 1,
                    "nama": "Dapat menggunakan telepon",
                    "detail": [{
                            "id": 1,
                            "nama": "Mengoperasikan telepon sendiri dan mencari dan menghubungi nomor",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310067,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Menghubungi beberapa nomor yang diketahui",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310068,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Menjawab telepon tetapi tidak menghubungi",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310069,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Tidak bisa menggunakan telepon sama sekali",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310070,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "Mampu pergi ke suatu tempat",
                    "detail": [{
                            "id": 1,
                            "nama": "Berpergian sendiri menggunakan kendaraan umum atau menyetir sendiri",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310071,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mengatur perjalanan sendiri",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310072,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Perjalanan menggunakan transportasi umum jika ada yang menyertai",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310073,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Tidak melakukan perjalanan sama sekali",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310074,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "Dapat berbelanja",
                    "detail": [{
                            "id": 1,
                            "nama": "Mengatur semua kebutuhan belanja sendiri",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310075,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Perlu bantuan untuk mengantar belanja",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310076,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Sama sekali tidak mampu belanja",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310077,
                                baris: 1
                            }]
                        },
                        
                    ]
                },
                {
                    "id": 4,
                    "nama": "Dapat menyiapkan makanan",
                    "detail": [{
                            "id": 1,
                            "nama": "Merencanakan, menyiapkan dan menghidangkan makanan",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310078,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Menyiapkan makanan jika sudah tersedia bahan makanan",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310079,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Menyiapkan makanan tetapi tidak mengatur diet yang cukup",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310080,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Perlu disiapkan dan dilayani",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310081,
                                baris: 1
                            }]
                        },

                    ]
                },
                {
                    "id": 5,
                    "nama": "Dapat melakukan pekerjaan rumah tangga",
                    "detail": [{
                            "id": 1,
                            "nama": "Merawat rumah sendiri atau bantuan kadang-kadang",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310082,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mengerjakan pekerjaan ringan sehari-hari (merapikan tempat tidur, mencuci piring)",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310083,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Perlu bantuan untuk semua perawatan rumah sehari-hari",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310084,
                                baris: 1
                            }]
                        },
                        {
                            "id": 4,
                            "nama": "Tidak berpartisipasi dalam perawatan rumah",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310085,
                                baris: 1
                            }]
                        },
                    ]
                },
                {
                    "id": 6,
                    "nama": "Dapat mencuci pakaian",
                    "detail": [{
                            "id": 1,
                            "nama": "Mencuci semua pakaian sendiri",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310086,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mencuci pakaian yang kecil",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310087,
                                baris: 1
                            }]
                        },
                        {
                            "id": 3,
                            "nama": "Semua pakaian dicuci oleh orang lain",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310088,
                                baris: 1
                            }]
                        },
                        
                    ]
                },
                {
                    "id": 7,
                    "nama": "Dapat mengatur obat-obatan",
                    "detail": [{
                            "id": 1,
                            "nama": "Meminum obat secara tepat dosis dan waktu tanpa bantuan",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310089,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Tidak mampu menyiapkan obat sendiri",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310090,
                                baris: 1
                            }]
                        },
                        

                    ]
                },
                {
                    "id": 8,
                    "nama": "Dapat mengatur keuangan",
                    "detail": [{
                            "id": 1,
                            "nama": "Mengatur masalah finansial (tagihan, pergi ke bank)",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310091,
                                baris: 1
                            }]
                        },
                        {
                            "id": 2,
                            "nama": "Mengatur pengeluaran sehari-hari, tapi perlu bantuan untuk ke bank untuk transaksi penting",
                            "descNilai": "1",
                            "ket": 1,
                            "detail": [{
                                id: 310092,
                                baris: 1
                            }]
                        }, 
                        {
                            "id": 3,
                            "nama": "Tidak mampu mengambil keputusan finansial atau memegang uang",
                            "descNilai": "0",
                            "ket": 1,
                            "detail": [{
                                id: 310093,
                                baris: 1
                            }]
                        },
                    ]
                }
                
            ]
            $scope.listPenata = [{
                "id": 1, "nama": "Score ",
                "detail": [
                    { "id": 310276, "nama": "", "type": "textarea2"},
                    { "id": 310277, "nama": "", "type": "textarea2"},
                ]
            }]

            $scope.listIntegrasiAsuhan = [
                {
                    "id": 1, "nama": "Integrasi Asuhan",
                    "detail": [
                        { "id": 310279, "nama": "Dokter", "type": "checkboxtextbox","idd":310280},
                        { "id": 310281, "nama": "Perawat", "type": "checkboxtextbox","idd":310282}, 
                        { "id": 310283, "nama": "PPA lain", "type": "checkboxtextbox","idd":310284},
                    ]
                }
            ]
            $scope.listPemulanganPasien = [
                {
                    "id": 1, "nama": "Rencana Pemulangan Pasien",
                    "detail": [
                        { "id": 310287, "nama": "Pulang, konsultasi selesai", "type": "checkboxtextbox","idd":310288},
                        { "id": 310289, "nama": "Pulang, kontrol ulang", "type": "checkboxtextbox","idd":310290}, 
                        { "id": 310291, "nama": "Rujuk ke", "type": "checkboxtextbox","idd":310292},
                        { "id": 310293, "nama": "", "type": "checkboxtextbox","idd":310294},
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

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                medifirstService.get("emr/get-emr-otomatisvitalsign?emrfk=147"+"&noregistrasi="+$scope.cc.noregistrasi).then(function (dat) {
                    var datas = dat.data.data2
                    $scope.isRouteLoading = false
                    if(datas.length> 0){
                        $scope.item.obj[310026]= datas[0].td
                        $scope.item.obj[310027]= datas[0].nadi
                        $scope.item.obj[310029]= datas[0].suhu
                        $scope.item.obj[310028]= datas[0].pernapasan
                        $scope.item.obj[310031]= datas[0].bb
                        $scope.item.obj[310030]= datas[0].tb


                    }
                    
                    
    
                })
                $scope.item.obj[116062] = $scope.now
                let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                if(pegawai.jenisPegawai.jenispegawai == 'Dokter'){
                    $scope.item.obj[310286] = {
                        value: medifirstService.getPegawaiLogin().id,
                        text: medifirstService.getPegawaiLogin().namaLengkap
                    }
                }
                if(pegawai.jenisPegawai.jenispegawai == 'Perawat'){
                    $scope.item.obj[310296] = {
                        value: medifirstService.getPegawaiLogin().id,
                        text: medifirstService.getPegawaiLogin().namaLengkap
                    }
                }

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

                $scope.item.obj[310297] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                // $scope.item.obj[310296] = {
                //     value: medifirstService.getPegawaiLogin().id,
                //     text: medifirstService.getPegawaiLogin().namaLengkap
                // }
                // $scope.item.obj[310286] = {
                //     value: medifirstService.getPegawaiLogin().id,
                //     text: medifirstService.getPegawaiLogin().namaLengkap
                // }

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
                            if (dataLoad[i].emrdfk == 21030370)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21030335)
                                $scope.totalSkor5 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 20816)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == "textbox3") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 21030370)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21030335)
                                $scope.totalSkor5 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 20816)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

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
                        if (dataLoad[i].type == "checkbox2") {
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
                        if (dataLoad[i].type == "radio") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "textarea2") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "textarea3") {
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

            $scope.GCSKuantitatif = function () {
                let e = parseInt($scope.item.obj[21030166]) || 0;
                let v = parseInt($scope.item.obj[21030167]) || 0;
                let m = parseInt($scope.item.obj[21030168]) || 0;
                let hasil = e + v + m;
                console.log(hasil);
                if (hasil >= 14 && hasil <= 15) {
                    $scope.item.obj[21009273] = hasil + " Compos mentis";
                } else if (hasil >= 12 && hasil <= 13) {
                    $scope.item.obj[21009273] = hasil + " Apatis";
                } else if (hasil >= 11 && hasil <= 12) {
                    $scope.item.obj[21009273] = hasil + " Somnolent";
                } else if (hasil >= 8 && hasil <= 10) {
                    $scope.item.obj[21009273] = hasil + " Stupor";
                } else if (hasil < 5) {
                    $scope.item.obj[21009273] = hasil + " Koma";
                } else {
                    $scope.item.obj[21009273] = "";
                }
            }

            $scope.MaxGCSValue = function (e, id) {
                switch (id) {
                    case 21030166:
                        if (e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52)
                            e.preventDefault()
                        break;
                    case 21030167:
                        if (e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53)
                            e.preventDefault()
                        break;
                    case 21030168:
                        if (e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53 && e.which !== 54)
                            e.preventDefault()
                        break;
                }
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
                $scope.item.obj[21030370] = $scope.totalSkor
            }
            $scope.totalSkor5 = 0
            $scope.getSkor5 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor5 = $scope.totalSkor5 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor5 = $scope.totalSkor5 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[21030335] = $scope.totalSkor5
            }
            $scope.$watch('item.obj[116131]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[21030296] = true
                    $scope.item.obj[21030297] = false
                    $scope.item.obj[21030298] = false
                    $scope.item.obj[21030299] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[21030296] = false
                    $scope.item.obj[21030297] = true
                    $scope.item.obj[21030298] = false
                    $scope.item.obj[21030299] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[21030296] = false
                    $scope.item.obj[21030297] = false
                    $scope.item.obj[21030298] = true
                    $scope.item.obj[21030299] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[21030296] = false
                    $scope.item.obj[21030297] = false
                    $scope.item.obj[21030298] = false
                    $scope.item.obj[21030299] = true
                }
            });
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
            $scope.$watch('item.obj[21030335]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[21030335] == 0 || $scope.item.obj[21030335] <= 24) {
                        $scope.item.obj[21030336] = true
                        $scope.item.obj[21030337] = false
                        $scope.item.obj[21030338] = false
                    }
                    if ($scope.item.obj[21030335] >= 25 || $scope.item.obj[21030335] <= 44) {
                        $scope.item.obj[21030336] = false
                        $scope.item.obj[21030337] = true
                        $scope.item.obj[21030338] = false
                    }
                    if ($scope.item.obj[21030335] >= 45) {
                        $scope.item.obj[21030336] = false
                        $scope.item.obj[21030337] = false
                        $scope.item.obj[21030338] = true
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
                    $scope.item.obj[21030300] = true
                    $scope.item.obj[21030301] = false
                    $scope.item.obj[21030302] = false
                    $scope.item.obj[21030303] = false
                    $scope.item.obj[21030304] = false
                    $scope.item.obj[21030305] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[21030300] = false
                    $scope.item.obj[21030301] = true
                    $scope.item.obj[21030302] = false
                    $scope.item.obj[21030303] = false
                    $scope.item.obj[21030304] = false
                    $scope.item.obj[21030305] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[21030300] = false
                    $scope.item.obj[21030301] = false
                    $scope.item.obj[21030302] = true
                    $scope.item.obj[21030303] = false
                    $scope.item.obj[21030304] = false
                    $scope.item.obj[21030305] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[21030300] = false
                    $scope.item.obj[21030301] = false
                    $scope.item.obj[21030302] = false
                    $scope.item.obj[21030303] = true
                    $scope.item.obj[21030304] = false
                    $scope.item.obj[21030305] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[21030300] = false
                    $scope.item.obj[21030301] = false
                    $scope.item.obj[21030302] = false
                    $scope.item.obj[21030303] = false
                    $scope.item.obj[21030304] = true
                    $scope.item.obj[21030305] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[21030300] = false
                    $scope.item.obj[21030301] = false
                    $scope.item.obj[21030302] = false
                    $scope.item.obj[21030303] = false
                    $scope.item.obj[21030304] = false
                    $scope.item.obj[21030305] = true
                }

            }

            $scope.$watch('item.obj[21000092]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[21000092]) == 0) {
                        $scope.item.obj[21000093] = 'Nyaman'
                    } else if (parseInt($scope.item.obj[21000092]) >= 1 && parseInt($scope.item.obj[21000092]) <= 3) {
                        $scope.item.obj[21000093] = 'Kurang Nyaman'
                    } else if (parseInt($scope.item.obj[21000092]) >= 4 && parseInt($scope.item.obj[21000092]) <= 6) {
                        $scope.item.obj[21000093] = 'Nyeri Sedang'
                    } else if (parseInt($scope.item.obj[21000092]) >= 7 && parseInt($scope.item.obj[21000092]) <= 10) {
                        $scope.item.obj[21000093] = 'Nyeri Berat'
                    } else
                        $scope.item.obj[21000093] = ''

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
                $scope.totalSkorAses1 = 0
            $scope.getSkorAsesmen = function (stat, skor) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses1 = $scope.totalSkorAses1 + parseFloat(skor.descNilai)

                            }
                            
                            break
                        }
                        if ($scope.item.obj[parseFloat(arrobj[i])] == false) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses1 = $scope.totalSkorAses1 - parseFloat(skor.descNilai)

                            }
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[310065] = $scope.totalSkorAses1
            }
                $scope.totalSkorAses = 0
            $scope.getSkorAsesmenLawton = function (stat, skor) {
                console.log(stat, skor);
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
                            }
                            
                            break
                        }
                        if ($scope.item.obj[parseFloat(arrobj[i])] == false) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)

                            }
                            
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[310094] = $scope.totalSkorAses
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
            $scope.$watch('item.obj[310098]', function (nilai) {
                console.log(nilai);

                if (nilai != undefined && nilai != null && nilai != "") {
                    $scope.item.obj2[310098] = true
                } else {
                    $scope.item.obj2[310098] = false
                }
            })
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
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            // $scope.listScoreGambar = [
            //     {
            //         "id": 1, "nama": "",
            //         "detail": [
            //             { "id": 5046, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
            //             { "id": 5047, "nama": "1 - 3 = Sedikit Nyeri", "type": "checkbox" },
            //             { "id": 5048, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
            //             { "id": 5049, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
            //         ]
            //     },
            // ]
            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[310108] = true
                    $scope.item.obj[310109] = false
                    $scope.item.obj[310110] = false
                    $scope.item.obj[310111] = false
                    $scope.item.obj[310112] = false
                    $scope.item.obj[310113] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[310108] = false
                    $scope.item.obj[310109] = true
                    $scope.item.obj[310110] = false
                    $scope.item.obj[310111] = false
                    $scope.item.obj[310112] = false
                    $scope.item.obj[310113] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[310108] = false
                    $scope.item.obj[310109] = false
                    $scope.item.obj[310110] = true
                    $scope.item.obj[310111] = false
                    $scope.item.obj[310112] = false
                    $scope.item.obj[310113] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[310108] = false
                    $scope.item.obj[310109] = false
                    $scope.item.obj[310110] = false
                    $scope.item.obj[310111] = true
                    $scope.item.obj[310112] = false
                    $scope.item.obj[310113] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[310108] = false
                    $scope.item.obj[310109] = false
                    $scope.item.obj[310110] = false
                    $scope.item.obj[310111] = false
                    $scope.item.obj[310112] = true
                    $scope.item.obj[310113] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[310108] = false
                    $scope.item.obj[310109] = false
                    $scope.item.obj[310110] = false
                    $scope.item.obj[310111] = false
                    $scope.item.obj[310112] = false
                    $scope.item.obj[310113] = true
                }

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
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .textContent('EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                    .ariaLabel('Lucky day')
                    .cancel('')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'RM.06.09 Pengkajian Geriatri Komprehensif' + ' dengan No EMR - ' + e.data.data.noemr + 'Sudah klik ya pada EMR No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                })
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'RM.06.09 Pengkajian Geriatri Komprehensif' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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