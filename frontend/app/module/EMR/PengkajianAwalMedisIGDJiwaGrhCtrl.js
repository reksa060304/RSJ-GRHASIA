define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('PengkajianAwalMedisIGDJiwaGrhCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            $scope.isCetakV = true
            $scope.isRouteLoading = false
            var nomorEMR = '-'
            var norecEMR = ''

            $scope.cc.emrfk = 3000922
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.now = new Date()
            // $scope.item.obj[120001] = new Date()
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000922).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga = []
                var arrayShiftJaga2 = []
                var arrayShiftJaga3 = []
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
                    if (element.kodeexternal == 'kedua') {
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
            // cek data type di htmlnya yaaa, kenapa bisa beda2. tinggal edit2 aja
            $scope.listRiwayatPenyakit = [{
                    "id": 1,
                    "nama": "A. Diperoleh Dari : ",
                    "detail": [
                        {
                            "id": 310303,
                            "nama": "1. Nama ",
                            "type": "textbox6"
                        },
                        {
                            "id": 310304,
                            "nama": "hubungan dengan penderita ",
                            "type": "textbox6"
                        },
                        {
                            "id": 310305,
                            "nama": "2. Nama",
                            "type": "textbox6"
                        },
                        {
                            "id": 310306,
                            "nama": "hubungan dengan penderita ",
                            "type": "textbox6"
                        }
                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Keluhan Utama / Keluhan Saat Ini ",
                    "detail": [{
                            "id": 310307,
                            "nama": "",
                            "type": "textarea12"
                        }
                    ]
                },
                {
                    "id": 3,
                    "nama": "C. Awal Perubahan Tingkah Laku / Peningkatan Gejala Sejak : ",
                    "detail": [{
                            "id": 310308,
                            "nama": "",
                            "type": "textarea12"
                        },
                    ]
                },
                {
                    "id": 4,
                    "nama": "D. Gejala Yang DItunjukkan : ",
                    "detail": [{
                        "id": 310309,
                        "nama": "",
                        "type": "textarea12"
                    }, ]
                },
                {
                    "id": 5,
                    "nama": "E. Riwayat Gangguan Jiwa Sebelumnya : ",
                    "detail": [{
                        "id": 310310,
                        "nama": "Pernah",
                        "type": "checkbox6"
                    },
                    {
                        "id": 310311,
                        "nama": "TIdak Pernah",
                        "type": "checkbox6"
                    },                    
                    {
                        "id": 310312,
                        "nama": "Pertama kali (Kapan) : ",
                        "type": "textbox12"
                    },
                    {
                        "id": 310313,
                        "nama": "Berapa kali : ",
                        "type": "textbox12"
                    },
                    {
                        "id": 310314,
                        "nama": "Pernah Sembuh: ",
                        "type": "label0"
                    },
                    {
                        "id": 310315,
                        "nama": "Pernah",
                        "type": "checkbox6"
                    },
                    {
                        "id": 310316,
                        "nama": "Tidak Pernah",
                        "type": "checkbox6"
                    },
                    {
                        "id": 310317,
                        "nama": "Berobat Jalan : ",
                        "type": "label0"
                    },
                    {
                        "id": 310318,
                        "nama": "Teratur",
                        "type": "checkbox4"
                    },
                    {
                        "id": 310319,
                        "nama": "Tidak Teratur",
                        "type": "checkbox4"
                    },
                    {
                        "id": 310320,
                        "nama": "Tidak Pernah",
                        "type": "checkbox4"
                    },
                ]
                },
                {
                    "id": 6,
                    "nama": "F. Riwayat Penggunaan Obat",
                    "detail": [{
                        "id": 310596,
                        "nama": "Obat yang rutin dikonsumsi :",
                        "type": "textarea13"
                    },
                    {
                        "id": 310597,
                        "nama": "Obat yang digunakan sekarang :",
                        "type": "textarea13"
                    },
                  
                ]
                },
                {
                    "id": 7,
                    "nama": "G. Faktor Psikologis (Stresor Psikososial Ekonomi) Yang Mendahului (satu tahun terakhir) : ",
                    "detail": [{
                        "id": 310321,
                        "nama": "Tidak Ada",
                        "type": "checkbox6"
                    },
                    {
                        "id": 310322,
                        "nama": "Tidak Jelas",
                        "type": "checkbox6"
                    },
                    {
                        "id": 310323,
                        "nama": "Ada Yaitu",
                        "type": "checkbox12"
                    },
                    {
                        "id": 310324,
                        "nama": "",
                        "type": "textbox12"
                    },
                ]
                },
                {
                    "id": 8,
                    "nama": "H. Faktor Organis Yang Mendahului / Kapan : ",
                    "detail": [{
                        "id": 310325,
                        "nama": "Tidak Ada",
                        "type": "checkbox12"
                    }, 
                    {
                        "id": 310326,
                        "nama": "Kejang",
                        "type": "checkbox3"
                    },
                    {
                        "id": 310327,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 310328,
                        "nama": "Panas",
                        "type": "checkbox3"
                    },
                    {
                        "id": 310329,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 310330,
                        "nama": "Keracunan",
                        "type": "checkbox3"
                    },
                    {
                        "id": 310331,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 310332,
                        "nama": "Trauma Kepala",
                        "type": "checkbox3"
                    },
                    {
                        "id": 310333,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    // {
                    //     "id": 310332,
                    //     "nama": "Disangkal",
                    //     "type": "checkbox3"
                    // }, {
                    //     "id": 310333,
                    //     "nama": "",
                    //     "type": "textbox8",
                    //     "placeholder": "kapan"
                    // },
                    {
                        "id": 310334,
                        "nama": "Lainnya",
                        "type": "textbox12"
                    },
                    {
                        "id": 310335,
                        "nama": "",
                        "type": "textbox",
                        "placeholder": "kapan"
                    },
                    ]
                },
                {
                    "id": 9,
                    "nama": "I. Riwayat Penyakit Fisik : ",
                    "detail": [{
                        "id": 310336,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 10,
                    "nama": "J. Riwayat Alergi : ",
                    "detail": [{
                        "id": 310337,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 11,
                    "nama": "K. Kepribadian Sebelum Sakit : ",
                    "detail": [{
                        "id": 310338,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 12,
                    "nama": "L. Riwayat Gangguan Jiwa Dalam Keluarga : ",
                    "detail": [{
                        "id": 310339,
                        "nama": "Ada, Hubungan Keluarga",
                        "type": "checkbox3",
                    },
                    {
                        "id": 310340,
                        "nama": "",
                        "type": "textbox6",
                        "placeholder": "keterangan"
                    },
                    {
                        "id": 310341,
                        "nama": "Tidak Ada",
                        "type": "checkbox12"
                    },
                    {
                        "id": 310342,
                        "nama": "Tidak Ada Keterangan",
                        "type": "checkbox12"
                    },
                ]
                },
                {
                    "id": 13,
                    "nama": "M. Silsilah Keluarga : ",
                    "detail": [{
                        "id": 310343,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
            ]
            $scope.listRiwayatPribadi = [{
                    "id": 1,
                    "nama": "A. Riwayat Kelahiran : ",
                    "detail": [{
                            "id": 310344,
                            "nama": "a. Umur ibu waktu melahirkan : ",
                            "type": "textbox12",
                            "no": 1
                        },
                        {
                            "id": 310345,
                            "nama": "b. Kesehatan jiwa ibu waktu hamil : ",
                            "type": "label0",
                            "no": 2

                        },
                        {
                            "id": 310346,
                            "nama": "Sehat",
                            "type": "checkbox6",
                            "no": 3
                        },
                        {
                            "id": 310347,
                            "nama": "Tidak ",
                            "type": "checkbox6",
                            "no": 4
                        },
                        {
                            "id": 310348,
                            "nama": "c. Kesehatan fisik ibu waktu hamil : ",
                            "type": "label0",
                            "no": 5
                        },
                        {
                            "id": 310349,
                            "nama": "Sehat ",
                            "type": "checkbox6",
                            "no": 6
                        },
                        {
                            "id": 310350,
                            "nama": "Tidak ",
                            "type": "checkbox6",
                            "no": 7
                        },
                        {
                            "id": 310351,
                            "nama": "d. Kehamilan dikehendaki : ",
                            "type": "label0",
                            "no": 8
                        },
                        {
                            "id": 310352,
                            "nama": "ya ",
                            "type": "checkbox6",
                            "no": 9
                        },
                        {
                            "id": 310353,
                            "nama": "tidak ",
                            "type": "checkbox6",
                            "no": 10
                        },
                        {
                            "id": 310354,
                            "nama": "e. Persalinan :  ",
                            "type": "label0",
                            "no": 11
                        },
                        {
                            "id": 310355,
                            "nama": "normal ",
                            "type": "checkbox6",
                            "no": 12
                        },
                        {
                            "id": 310356,
                            "nama": "tidak ",
                            "type": "checkbox6",
                            "no": 13
                        },
                        {
                            "id": 310357,
                            "nama": "f. Berat badan waktu lahir : ",
                            "type": "textbox6",
                            "satuan": "gram",
                            "no": 14
                        },
                        
                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Latar Belakang Perkembangan Mental : ",
                    "detail": [{
                        "id": 310358,
                        "nama": "Dibesarkan dalam lingkungan : ",
                        "type": "label0",
                        "no": 1
                        
                    },
                    {
                        "id": 310359,
                        "nama": "a. Orang tua kandung sejak umur",
                        "type": "textbox6",
                        "no": 2
                    },
                    {
                        "id": 310360,
                        "nama": "sampai umur",
                        "type": "textbox6",
                        "no": 3
                    },
                    {
                        "id": 310361,
                        "nama": "b. ",
                        "type": "textbox4",
                        "no": 4
                    },
                    {
                        "id": 310362,
                        "nama": "sejak umur",
                        "type": "textbox4",
                        "no": 5
                    },
                    {
                        "id": 310363,
                        "nama": "sampai umur",
                        "type": "textbox4",
                        "no": 6
                    },
                    {
                        "id": 310609,
                        "nama": "c. ",
                        "type": "textbox4",
                        "no": 7
                    }, {
                        "id": 310610,
                        "nama": "sejak umur",
                        "type": "textbox4",
                        "no": 8
                    }, {
                        "id": 310611,
                        "nama": "sampai umur",
                        "type": "textbox4",
                        "no": 9
                    },
                    {
                        "id": 310612,
                        "nama": "d. ",
                        "type": "textbox4",
                        "no": 10
                    }, {
                        "id": 310613,
                        "nama": "sejak umur",
                        "type": "textbox4",
                        "no": 11
                    }, {
                        "id": 310614,
                        "nama": "sampai umur",
                        "type": "textbox4",
                        "no": 12
                    },
                    {
                        "id": 310615,
                        "nama": "e. ",
                        "type": "textbox4",
                        "no": 13
                    }, {
                        "id": 310616,
                        "nama": "sejak umur",
                        "type": "textbox4",
                        "no": 14
                    }, {
                        "id": 310617,
                        "nama": "sampai umur",
                        "type": "textbox4",
                        "no": 15
                    },
                    {
                        "id": 310364,
                        "nama": "Cara mengasuh anak : ",
                        "type": "label0",
                        "no": 16
                    },
                    {
                        "id": 310365,
                        "nama": "Otoriter",
                        "type": "checkbox3",
                        "no": 17
                    },
                    {
                        "id": 310366,
                        "nama": "Demokratis",
                        "type": "checkbox3",
                        "no": 18
                    },
                    {
                        "id": 310367,
                        "nama": "Dimanja",
                        "type": "checkbox3",
                        "no": 19
                    },
                    {
                        "id": 310368,
                        "nama": "Kurang Diperhatikan",
                        "type": "checkbox3",
                        "no": 20
                    },
                    {
                        "id": 310628,
                        "nama": "Lain-lain",
                        "type": "textbox4",
                        "no": 21
                    },
                ]
                },
                {
                    "id": 3,
                    "nama": "C. Riwayat Perkembangan awal : ",
                    "detail": [{
                        "id": 310369,
                        "nama": "Tidak Ada Kelainan",
                        "type": "checkbox12",
                        "no": 21
                    },
                    {
                        "id": 310370,
                        "nama": "Lain-lain",
                        "type": "checkbox12",
                        "no": 22
                    },
                    {
                        "id": 310371,
                        "nama": "",
                        "type": "textbox12",
                        "no": 23
                    },
                ]
                },
                {
                    "id": 4,
                    "nama": "D. Riwayat Pendidikan Terakhir : ",
                    "detail": [{
                            "id": 310372,
                            "nama": "SD, Lulus",
                            "type": "checkbox6",
                            "no": 24
                        },
                        {
                            "id": 310373,
                            "nama": "SD, Tidak",
                            "type": "checkbox6",
                            "no": 25
                        },
                        {
                            "id": 310374,
                            "nama": "SLTP, Lulus",
                            "type": "checkbox6",
                            "no": 26
                        },
                        {
                            "id": 310375,
                            "nama": "SLTP, Tidak",
                            "type": "checkbox6",
                            "no": 27
                        },
                        {
                            "id": 310376,
                            "nama": "SLTA, Lulus",
                            "type": "checkbox6",
                            "no": 28
                        }, 
                        {
                            "id": 310377,
                            "nama": "SLTA, Tidak",
                            "type": "checkbox6",
                            "no": 29
                        },
                        {
                            "id": 310378,
                            "nama": "Perguruan Tinggi, Lulus",
                            "type": "checkbox6",
                            "no": 30
                        }, 
                        {
                            "id": 310379,
                            "nama": "Perguruan Tinggi, Tidak",
                            "type": "checkbox6",
                            "no": 31
                        },
                        {
                            "id": 310380,
                            "nama": "Kecerdasan",
                            "type": "label0",
                            "no": 32
                        },
                        {
                            "id": 310381,
                            "nama": "Tinggi",
                            "type": "checkbox4",
                            "no": 33
                        },
                        {
                            "id": 310382,
                            "nama": "Cukup",
                            "type": "checkbox4",
                            "no": 34
                        },
                        {
                            "id": 310383,
                            "nama": "Kurang",
                            "type": "checkbox4",
                            "no": 35
                        },
                        {
                            "id": 310384,
                            "nama": "Kegemaran",
                            "type": "textbox12",
                            "no": 36
                        },
                        // {
                        //     "id": 120084,
                        //     "nama": "Kegemaran",
                        //     "type ": "textbox6"
                        // },
                ]
                },
                {
                    "id": 5,
                    "nama": "E. Riwayat Pekerjaan : ",
                    "detail": [{
                            "id": 310385,
                            "nama": "",
                            "type": "textarea12",
                            "no": 37
                        }
                    ]
                },
                {
                    "id": 6,
                    "nama": "F. Sikap Dan Kegiatan Dalam Bidang Modal Spiritual : ",
                    "detail": [{
                        "id": 310386,
                        "nama": "Kegiatan ibadah : ",
                        "type": "textbox12",
                        "no": 38
                    },
                    {
                        "id": 310387,
                        "nama": "Nilai - nilai yang bertentangan dengan kebutuhan kesehatan : ",
                        "type": "textbox12",
                        "no": 39
                    },
                    {
                        "id": 310388,
                        "nama": "Meminta pelayanan kerohanian (lakukan kolaborasi dengan petugas kerohanian) : ",
                        "type": "label0",
                        "no": 40
                    },
                    {
                        "id": 310389,
                        "nama": "Tidak",
                        "type": "checkbox6",
                        "no": 41
                    },
                    {
                        "id": 310390,
                        "nama": "Ya",
                        "type": "checkbox6",
                        "no": 42
                    },
                ]
                },
                {
                    "id": 7,
                    "nama": "G. Riwayat Perkawinan : ",
                    "detail": [{
                        "id": 310391,
                        "nama": "",
                        "type": "textarea12",
                        "no": 43
                    }]
                },
                {
                    "id": 8,
                    "nama": "H. Kehidupan emosional : ",
                    "detail": [{
                        "id": 310392,
                        "nama": "Mantap(stable)",
                        "type": "checkbox3",
                        "no": 44
                    },
                    {
                        "id": 310393,
                        "nama": "Cemas",
                        "type": "checkbox3",
                        "no": 45
                    },
                    {
                        "id": 310394,
                        "nama": "Gembira",
                        "type": "checkbox3",
                        "no": 46
                    },
                    {
                        "id": 310395,
                        "nama": "Sikap Terbuka",
                        "type": "checkbox3",
                        "no": 47
                    },
                    {
                        "id": 310396,
                        "nama": "Optimis",
                        "type": "checkbox3",
                        "no": 48
                    },
                    {
                        "id": 310397,
                        "nama": "Mudah tersinggung",
                        "type": "checkbox3",
                        "no": 49
                    },
                    {
                        "id": 310398,
                        "nama": "Sedih",
                        "type": "checkbox3",
                        "no": 50
                    },
                    {
                        "id": 310399,
                        "nama": "Pesimis",
                        "type": "checkbox3",
                        "no": 51
                    },
                    {
                        "id": 310400,
                        "nama": "Tegang",
                        "type": "checkbox3",
                        "no": 52
                    },
                    {
                        "id": 310401,
                        "nama": "Apatik",
                        "type": "checkbox3",
                        "no": 53
                    },
                    {
                        "id": 310402,
                        "nama": "Lain-lain : ",
                        "type": "textbox6",
                        "no": 54
                    }
                ]
                },
                {
                    "id": 9,
                    "nama": "I. Hubungan Sosial : ",
                    "detail": [{
                        "id": 310403,
                        "nama": "Dengan keluarga : ",
                        "type": "textbox12",
                        "no": 55
                    },
                    {
                        "id": 310404,
                        "nama": "Dengan Tetangga : ",
                        "type": "textbox12",
                        "no": 56
                    },
                    {
                        "id": 310405,
                        "nama": "Dengan Teman : ",
                        "type": "textbox12",
                        "no": 57
                    },
                    {
                        "id": 310406,
                        "nama": "Dalam Pekerjaan : ",
                        "type": "textbox12",
                        "no": 58
                    },
                    {
                        "id": 310407,
                        "nama": "Sikap Keluarga terhadap penderita : ",
                        "type": "textbox12",
                        "no": 59
                    },
                ]
                },
                {
                    "id": 10,
                    "nama": "J. Kebiasaan : ",
                    "detail": [{
                        "id": 310408,
                        "nama": "Merokok",
                        "type": "checkbox12",
                        "no": 60
                    }, {
                        "id": 310619,
                        "nama": "",
                        "type": "textbox12",
                        "no": 61
                    },
                    {
                        "id": 310409,
                        "nama": "Minuman Keras",
                        "type": "checkbox12",
                        "no": 62
                    }, 
                    {
                        "id": 310620,
                        "nama": "",
                        "type": "textbox12",
                        "no": 63
                    },
                    {
                        "id": 310410,
                        "nama": "Obat-obatan",
                        "type": "checkbox12",
                        "no": 64,
                    },
                    {
                        "id": 310621,
                        "nama": "",
                        "type": "textbox12",
                        "no": 65
                    },
                    {
                        "id": 310626,
                        "nama": "Lain-lain",
                        "type": "checkbox12",
                        "no": 66,
                    }, {
                        "id": 310627,
                        "nama": "",
                        "type": "textbox12",
                        "no": 67
                    },
                ]
                },
                {
                    "id": 11,
                    "nama": "K. Lain - lain : ",
                    "detail": [{
                            "id": 310411,
                            "nama": "Pengalaman Militer : ",
                            "type": "textbox12",
                            "no": 66
                        },
                        {
                            "id": 310412,
                            "nama": "Urusan dengan Polisi : ",
                            "type": "textbox12",
                            "no": 67
                        },
                    ]
                },
            ]

            $scope.listPemeriksaanFisik = [{
                    "id": 1,
                    "nama": "A. Vital Sign : ",
                    "detail": [{
                            "id": 310413,
                            "nama": "Tekanan Darah : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 310414,
                            "nama": "Nadi : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 310415,
                            "nama": "Suhu : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 310416,
                            "nama": "Respirasi :  ",
                            "type": "textbox3"
                        },
                        {
                            "id": 310608,
                            "nama": "Saturasi :  ",
                            "type": "textbox3"
                        },

                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Status Generalis dan Neurologis : ",
                    "detail": [{
                            "id": 310417,
                            "nama": "",
                            "type": "textarea12"
                        },
                        
                    ]
                },
            ]

            $scope.listPemeriksaanPsikiatri = [{
                    "id": 1,
                    "nama": "A. Kesan Umum : ",
                    "detail": [{
                            "id": 310418,
                            "nama": "",
                            "type": "textarea12"
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Kesadaran ",
                    "detail": [{
                            "id": 310419,
                            "nama": "Kualitatif : ",
                            "type": "label0"
                        },
                        {
                            "id": 310420,
                            "nama": "Komposmentis",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310421,
                            "nama": "Sopor",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310422,
                            "nama": "Confuse",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310423,
                            "nama": "Absence",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310424,
                            "nama": "Apatis",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310425,
                            "nama": "Pre Coma",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310426,
                            "nama": "Kesadaran berkabut",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310427,
                            "nama": "Somnolent",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310428,
                            "nama": "Coma",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310429,
                            "nama": "Delirium",
                            "type": "checkbox3"
                        },
                        {
                            "id": 310430,
                            "nama": "Lain - lain : ",
                            "type": "textbox6"
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "C. Orientasi : ",
                    "detail": [{
                        "id": 310431,
                        "nama": "Orang",
                        "type": "textbox6"
                    },
                    {
                        "id": 310432,
                        "nama": "Tempat",
                        "type": "textbox6"
                    },
                    {
                        "id": 310433,
                        "nama": "Waktu",
                        "type": "textbox6"
                    },
                    {
                        "id": 310434,
                        "nama": "Situasi",
                        "type": "textbox6"
                    },
                
                ]
                },
                {
                    "id": 4,
                    "nama": "D. Sikap Dan Tingkah Laku : ",
                    "detail": [
                        {"id": 310435, "nama": "Dalam batas normal", "type": "checkbox12"},
                        {"id": 310436, "nama": "Hipoaktif", "type": "checkbox12"},
                        {"id": 310437, "nama": "Disaktif : ", "type": "checkbox12"},
                        {"id": 310438, "nama": "Bizar", "type": "checkbox2ml"},
                        {"id": 310439, "nama": "Ekhopraksi", "type": "checkbox3"},
                        {"id": 310440, "nama": "Fleksibilitas serea", "type": "checkbox3"},
                        {"id": 310441, "nama": "Kompulsif", "type": "checkbox3"},
                        {"id": 310442, "nama": "Stereotipi", "type": "checkbox2ml"},
                        {"id": 310443, "nama": "Automasi perintah", "type": "checkbox3"},
                        {"id": 310444, "nama": "Negativisme", "type": "checkbox3"},
                        {"id": 310445, "nama": "Katelpsi", "type": "checkbox3"},
                        {"id": 310446, "nama": "Stupor", "type": "checkbox2ml"},
                        {"id": 310447, "nama": "Impulsif", "type": "checkbox3"},
                        {"id": 310448, "nama": "Lain - lain : ", "type": "textbox6"},
                        {"id": 310449, "nama": "Hiperaktif : ", "type": "checkbox12"},
                        {"id": 310450, "nama": "Agitasi", "type": "checkbox2ml"},
                        {"id": 310451, "nama": "Agresivitas", "type": "checkbox3"},
                        {"id": 310452, "nama": "gaduh gelisah", "type": "checkbox3"},
                        {"id": 310453, "nama": "Lain - lain : ", "type": "textbox6"},
                    ]
                },
                {
                    "id": 5,
                    "nama": "E. Proses Pikir : ",
                    "detail": [
                        {"id": 310454, "nama": "Bentuk pikir : ", "type": "label0"},
                        {"id": 310455, "nama": "Realistis", "type": "checkbox4"},
                        {"id": 310456, "nama": "Non realistis : ", "type": "checkbox4"},
                        {"id": 310457, "nama": "Dereistrik", "type": "checkbox4"},
                        {"id": 310458, "nama": "Autistik", "type": "checkbox4"},
                        {"id": 310459, "nama": "Gangguan pikiran formal", "type": "checkbox4"},
                        {"id": 310460, "nama": "Kompulsif", "type": "checkbox4"},
                        {"id": 310461, "nama": "Isi Pikir", "type": "label0"},
                        {"id": 310462, "nama": "Tidak ada Kelainan", "type": "checkbox3"},
                        {"id": 310463, "nama": "Waham Sexual", "type": "checkbox3"},
                        {"id": 310464, "nama": "Waham sisi pikir", "type": "checkbox3"},
                        {"id": 310465, "nama": "Phobi", "type": "checkbox3"},
                        {"id": 310466, "nama": "Waham kejar", "type": "checkbox3"},
                        {"id": 310467, "nama": "Waham berdosa", "type": "checkbox3"},
                        {"id": 310468, "nama": "Waham sedot pikir", "type": "checkbox3"},
                        {"id": 310469, "nama": "obsesi", "type": "checkbox3"},
                        {"id": 310470, "nama": "Waham diancam", "type": "checkbox3"},
                        {"id": 310471, "nama": "waham rendah diri", "type": "checkbox3"},
                        {"id": 310472, "nama": "waham kendali pikir", "type": "checkbox3"},
                        {"id": 310473, "nama": "idea of reference", "type": "checkbox3"},
                        {"id": 310474, "nama": "Waham curiga", "type": "checkbox3"},
                        {"id": 310475, "nama": "waham hipokondri", "type": "checkbox3"},
                        {"id": 310476, "nama": "waham siar pikir", "type": "checkbox3"},
                        {"id": 310477, "nama": "Waham cemburu", "type": "checkbox3"},
                        {"id": 310478, "nama": "Waham kebesaran", "type": "checkbox3"},
                        {"id": 310479, "nama": "Waham magik mistik", "type": "checkbox3"},
                        {"id": 310480, "nama": "lain - lain : ", "type": "textbox6"},
                        {"id": 310481, "nama": "Progresi Pikir Kualitatif : ", "type": "label0"},
                        {"id": 310482, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 310483, "nama": "Neologisme", "type": "checkbox3"},
                        {"id": 310484, "nama": "Sirkumstansial", "type": "checkbox3"},
                        {"id": 310485, "nama": "Gagap", "type": "checkbox3"},
                        {"id": 310486, "nama": "Perseverasi", "type": "checkbox3"},
                        {"id": 310487, "nama": "inkoherensi", "type": "checkbox3"},
                        {"id": 310488, "nama": "Tangensial", "type": "checkbox3"},
                        {"id": 310489, "nama": "Verbegerasi", "type": "checkbox3"},
                        {"id": 310490, "nama": "Asosiasi longgar", "type": "checkbox3"},
                        {"id": 310491, "nama": "Flight of ideas", "type": "checkbox3"},
                        {"id": 310492, "nama": "Ekolali", "type": "checkbox3"},
                        {"id": 310493, "nama": "Irelevansi", "type": "checkbox3"},
                        {"id": 310494, "nama": "Flight into mysticsm", "type": "checkbox3"},
                        {"id": 310495, "nama": "Lain - lain :", "type": "textbox6"},
                        {"id": 310496, "nama": "Progresi Pikir Kuantitatif : ", "type": "label0"},
                        {"id": 310497, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 310498, "nama": "Logore", "type": "checkbox3"},
                        {"id": 310499, "nama": "Reming", "type": "checkbox3"},
                        {"id": 310500, "nama": "Bloking", "type": "checkbox3"},
                        {"id": 310533, "nama": "Mutisme", "type": "checkbox3"},
                        {"id": 310534, "nama": "Lain-lain : ", "type": "textbox6"},
                        
                    ]
                },
                {
                    "id": 6,
                    "nama": "F. Mood : ",
                    "detail": [
                        {"id": 310501, "nama": "Tidak ada kelainan", "type": "checkbox4"},
                        {"id": 310502, "nama": "Sedih", "type": "checkbox4"},
                        {"id": 310503, "nama": "Marah", "type": "checkbox4"},
                        {"id": 310504, "nama": "Curiga", "type": "checkbox4"},
                        {"id": 310505, "nama": "Gembira", "type": "checkbox4"},
                        {"id": 310506, "nama": "Lain - lain : ", "type": "textbox4"},
                    ]
                },
                {
                    "id": 7,
                    "nama": "G. Afek : ",
                    "detail": [
                        {"id": 310507, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 310508, "nama": "Euforia", "type": "checkbox3"},
                        {"id": 310509, "nama": "Takut", "type": "checkbox3"},
                        {"id": 310510, "nama": "Curiga", "type": "checkbox3"},
                        {"id": 310511, "nama": "Menyempit", "type": "checkbox3"},
                        {"id": 310512, "nama": "Elasi", "type": "checkbox3"},
                        {"id": 310513, "nama": "Susah", "type": "checkbox3"},
                        {"id": 310514, "nama": "Tumpul", "type": "checkbox3"},
                        {"id": 310515, "nama": "Ekstase", "type": "checkbox3"},
                        {"id": 310516, "nama": "Inappropriate", "type": "checkbox3"},
                        {"id": 310517, "nama": "Datar", "type": "checkbox3"},
                        {"id": 310518, "nama": "Panik", "type": "checkbox3"},
                        {"id": 310519, "nama": "Labil", "type": "checkbox3"},
                        {"id": 310520, "nama": "indifferent", "type": "checkbox3"},
                        {"id": 310521, "nama": "Tension", "type": "checkbox3"},
                        {"id": 310522, "nama": "Cemas", "type": "checkbox3"},
                        {"id": 310523, "nama": "Lain - lain : ", "type": "textbox6"},
                    ]
                },
                {
                    "id": 8,
                    "nama": "H. Gangguan Persepsi : ",
                    "detail": [
                        {"id": 310524, "nama": "Halusinasi dengar", "type": "checkbox3"},
                        {"id": 310525, "nama": "Halusinasi penglihatan", "type": "checkbox3"},
                        {"id": 310526, "nama": "Halusinasi peraba", "type": "checkbox3"},
                        {"id": 310527, "nama": "Halusinasi pengecap", "type": "checkbox3"},
                        {"id": 310528, "nama": "Halusinasi pembauan", "type": "checkbox3"},
                        {"id": 310529, "nama": "Halusinasi sexual", "type": "checkbox3"},
                        {"id": 310530, "nama": "ilusi", "type": "checkbox3"},
                        // {"id": 310531, "nama": "Tumpul", "type": "checkbox3"},
                        {"id": 310532, "nama": "Lain-lain : ", "type": "textbox6"},
                        // 120234
                    ]
                },
                {
                    "id": 9,
                    "nama": "I. Gangguan Memori : ",
                    "detail": [
                        {"id": 120235, "nama": "Ada", "type": "textbox6"},
                        {"id": 120236, "nama": "Tidak ada", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 10,
                    "nama": "J. Gangguan Intelegensi : ",
                    "detail": [
                        {"id": 310535, "nama": "Ada", "type": "textbox6"},
                        {"id": 310538, "nama": "Tidak ada", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 11,
                    "nama": "K. Hubungan Jiwa : ",
                    "detail": [
                        {"id": 310539, "nama": "Sukar", "type": "checkbox6"},
                        {"id": 310540, "nama": "Mudah", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 12,
                    "nama": "L. Perhatian : ",
                    "detail": [
                        {"id": 310541, "nama": "Sukar ditarik sukar dicantum", "type": "checkbox6"},
                        {"id": 310542, "nama": "Sukar ditarik mudah dicantum", "type": "checkbox6"},
                        {"id": 310543, "nama": "Mudah ditarik sukar dicantum", "type": "checkbox6"},
                        {"id": 310544, "nama": "mudah ditarik mudah dicantum", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 13,
                    "nama": "M. Insight : ",
                    "detail": [
                        {"id": 310545, "nama": "Derajat", "type": "label0"},
                        {"id": 310546, "nama": "1", "type": "checkbox1"},
                        {"id": 310547, "nama": "2", "type": "checkbox1"},
                        {"id": 310548, "nama": "3", "type": "checkbox1"},
                        {"id": 310549, "nama": "4", "type": "checkbox1"},
                        {"id": 310550, "nama": "5", "type": "checkbox1"},
                        {"id": 310551, "nama": "6", "type": "checkbox1"},
                        {"id": 310552, "nama": "Baik", "type": "checkbox3"},
                        {"id": 310553, "nama": "Jelek", "type": "checkbox3"},
                    ]
                },
            ]

            $scope.listHasilPemeriksaanPenunjang = [{
                    "id": 1,
                    "nama": "",
                    "detail": [
                        { "id": 310554, "nama": "a. Laboratorium : ", "type": "textbox12" },
                        { "id": 310555, "nama": "b. Radiologi : ", "type": "textbox12" },
                        { "id": 310556, "nama": "c. EKG : ", "type": "textbox12" },
                        { "id": 310557, "nama": "d. EEG : ", "type": "textbox12" },
                        { "id": 310558, "nama": "e. Lain-lain : ", "type": "label0" },
                        { "id": 310559, "nama": "MMSE", "type": "checkbox3" },
                        { "id": 310560, "nama": "PANSS-EC", "type": "checkbox3" },
                        { "id": 310561, "nama": "HRSD", "type": "checkbox3" },
                        { "id": 310562, "nama": "HRSA", "type": "checkbox3" },
                        { "id": 310604, "nama": "", "type": "textbox3" },
                        { "id": 310605, "nama": "", "type": "textbox3" },
                        { "id": 310606, "nama": "", "type": "textbox3" },
                        { "id": 310607, "nama": "", "type": "textbox3" },
                    ]
                },
            ]

            $scope.listDiagnosis = [{
                    "id": 1,
                    "nama": "",
                    "detail": [
                        { "id": 310563, "nama": "AKSIS I : ", "type": "textbox12" },
                        { "id": 310564, "nama": "AKSIS II : ", "type": "textbox12" },
                        { "id": 310565, "nama": "AKSIS III : ", "type": "textbox12" },
                        { "id": 310566, "nama": "AKSIS IV : ", "type": "textbox12" },
                        { "id": 310567, "nama": "AKSIS V : GAF Scale", "type": "textbox12" },
                    ]
                },
            ]
            $scope.listMasalahKeperawatan = [{
                "id": 1,
                "nama": "",
                "detail": [
                    { "id": 310603, "nama": " ", "type": "textareabold" },
                    
                ]
            },
        ]
        $scope.listPenatalaksanaan = [{
            "id": 1,
            "nama": "",
            "detail": [
                { "id": 310568, "nama": " ", "type": "textareabold" },
                
            ]
        },
    ]
    $scope.listAsuhan = [
        {
            "id": 3,
            "nama": "INTEGRASI ASUHAN",
            "detail6": [
                { "id": 310583, "nama": "Dokter :", "type": "checkboxtextbox3" },
                //12084
                { "id": 310585, "nama": "Perawat :", "type": "checkboxtextbox4" },
                //120286
                { "id": 310587, "nama": "PPA lain : ", "type": "checkboxtextbox5" },
                // 120288
                { "id": 310589, "nama": "Catatan / Notasi DPJP", "type": "textbox12" },
                { "id": 310590, "nama": "Paraf DPJP : ", "type": "combobox6right" },
            ]
        },
    ]

            $scope.listPenatalaksanaan2 = [{
                    "id": 1,
                    "nama": "Keadaan Waktu Keluar :",
                    "detail": [
                        { "id": 310569, "nama": " ", "type": "textarea12" },
                    ]
                },
                {
                    "id": 2,
                    "nama": "Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada : ",
                    "detail": [
                        { "id": 310598, "nama": "Pasien", "type": "checkbox12" },
                        { "id": 310599, "nama": "Keluarga pasien,", "type": "checkbox12" },
                        { "id": 310600, "nama": "Nama : ", "type": "textbox12" },
                        { "id": 310601, "nama": "Hubungan dengan Pasien :", "type": "textbox12" },
                        { "id": 310602, "nama": "Lainnya :", "type": "textbox12" },

                        //120282

                    ]
                },
                
                {
                    "id": 3,
                    "nama": "RENCANA PEMULANGAN PASIEN : ",
                    "detail": [
                        { "id": 310575, "nama": "Pulang : ", "type": "checkbox12" },
                        { "id": 310576, "nama": "Konsultasi Selesai", "type": "checkbox3" },
                        { "id": 310577, "nama": "Kontrol Ulang :", "type": "checkbox3" },
                        { "id": 310578, "nama": "", "type": "textbox6", "satuan":"hari" },
                        { "id": 310579, "nama": "Rujuk ke : ", "type": "checkbox12" },
                        { "id": 310580, "nama": "", "type": "textbox12" },
                        { "id": 310618, "nama": "Lainnya : ", "type": "textbox12" },
                       
                        //120282

                    ]
                },
                
                
            ]

            $scope.listakhir = [
                {
                    "id": 4,
                    "nama": "",
                    "detail6": [
                        { "id": 310591, "nama": "Selesai pemeriksaan, Pukul : ", "type": "time" },
                        { "id": 310592, "nama": "Penanggung Jawab Pasien ", "type": "label06" },
                        { "id": 310593, "nama": "Dokter Pemeriksa/DPJP", "type": "label06" },
                        { "id": 310594, "nama": "", "type": "textbox6" },
                        { "id": 310595, "nama": "", "type": "combobox" },
                    ]
                },
                
            ]

            

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

          

            
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[310622] = $scope.now
                $scope.item.obj[310623] = $scope.now
                // $scope.item.obj[310624] = $scope.now
                // $scope.item.obj[310625] = $scope.now
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
                $scope.item.obj[310301] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                $scope.item.obj[120291] = moment($scope.now).format('HH:mm')

                $scope.item.obj[310595] = {
                    value: medifirstService.getPegawaiLogin().id,
                    text: medifirstService.getPegawaiLogin().namaLengkap
                }
                
                dataLoad = dat.data.data

                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 21008669)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21030766)
                                $scope.totalSkor5 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21008720)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21008753)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == "textbox6") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd

                        }
                        
                        if (dataLoad[i].type == "checkbox12") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd

                        }
                        if (dataLoad[i].type == "checkbox2") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd

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
                                $scope.item.obj[dataLoad[i].emrdfk] = {
                                    value: res[0],
                                    text: res[1]
                                }
                            }
                        }
                    }
                }
            })
            
            $scope.GCSKuantitatif = function () {
                let e = parseInt($scope.item.obj[21008563]) || 0;
                let v = parseInt($scope.item.obj[21008564]) || 0;
                let m = parseInt($scope.item.obj[21008565]) || 0;
                let hasil = e + v + m;
                console.log(hasil);
                if (hasil >= 14 && hasil <= 15) {
                    $scope.item.obj[21009268] = hasil + " Compos mentis";
                } else if (hasil >= 12 && hasil <= 13) {
                    $scope.item.obj[21009268] = hasil + " Apatis";
                } else if (hasil >= 11 && hasil <= 12) {
                    $scope.item.obj[21009268] = hasil + " Somnolent";
                } else if (hasil >= 8 && hasil <= 10) {
                    $scope.item.obj[21009268] = hasil + " Stupor";
                } else if (hasil < 5) {
                    $scope.item.obj[21009268] = hasil + " Koma";
                } else {
                    $scope.item.obj[21009268] = "";
                }
            }

            $scope.MaxGCSValue = function (e, id) {
                switch (id) {
                    case 21008563:
                        if (e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52)
                            e.preventDefault()
                        break;
                    case 21008564:
                        if (e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53)
                            e.preventDefault()
                        break;
                    case 21008565:
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
                $scope.item.obj[21008669] = $scope.totalSkor
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
                $scope.item.obj[21030766] = $scope.totalSkor5
            }
            $scope.$watch('item.obj[116131]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[21031405] = true
                    $scope.item.obj[21031406] = false
                    $scope.item.obj[21031407] = false
                    $scope.item.obj[21031408] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[21031405] = false
                    $scope.item.obj[21031406] = true
                    $scope.item.obj[21031407] = false
                    $scope.item.obj[21031408] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[21031405] = false
                    $scope.item.obj[21031406] = false
                    $scope.item.obj[21031407] = true
                    $scope.item.obj[21031408] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[21031405] = false
                    $scope.item.obj[21031406] = false
                    $scope.item.obj[21031407] = false
                    $scope.item.obj[21031408] = true
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
            $scope.$watch('item.obj[21008720]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if ($scope.item.obj[21008720] >= 7 || $scope.item.obj[21008720] <= 11) {
                        $scope.item.obj[21008721] = true
                        $scope.item.obj[21008722] = false
                        // $scope.item.obj[21031456]= false
                    }
                    if ($scope.item.obj[21008720] >= 12) {
                        $scope.item.obj[21008721] = false
                        $scope.item.obj[21008722] = true
                        // $scope.item.obj[21031456]= fals
                    }
                    //  if($scope.item.obj[21008720] >= 45 ){
                    //     $scope.item.obj[21008721] = false
                    //     $scope.item.obj[21008722]= false
                    //     // $scope.item.obj[21031456]= true
                    // }

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
            $scope.getSkorNutrisi = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {}
                }
                $scope.item.obj[21008753] = $scope.skorNutrisi
            }
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
                    $scope.item.obj[21031409] = true
                    $scope.item.obj[21031410] = false
                    $scope.item.obj[21031411] = false
                    $scope.item.obj[21031412] = false
                    $scope.item.obj[21031413] = false
                    $scope.item.obj[21031414] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[21031409] = false
                    $scope.item.obj[21031410] = true
                    $scope.item.obj[21031411] = false
                    $scope.item.obj[21031412] = false
                    $scope.item.obj[21031413] = false
                    $scope.item.obj[21031414] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[21031409] = false
                    $scope.item.obj[21031410] = false
                    $scope.item.obj[21031411] = true
                    $scope.item.obj[21031412] = false
                    $scope.item.obj[21031413] = false
                    $scope.item.obj[21031414] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[21031409] = false
                    $scope.item.obj[21031410] = false
                    $scope.item.obj[21031411] = false
                    $scope.item.obj[21031412] = true
                    $scope.item.obj[21031413] = false
                    $scope.item.obj[21031414] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[21031409] = false
                    $scope.item.obj[21031410] = false
                    $scope.item.obj[21031411] = false
                    $scope.item.obj[21031412] = false
                    $scope.item.obj[21031413] = true
                    $scope.item.obj[21031414] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[21031409] = false
                    $scope.item.obj[21031410] = false
                    $scope.item.obj[21031411] = false
                    $scope.item.obj[21031412] = false
                    $scope.item.obj[21031413] = false
                    $scope.item.obj[21031414] = true
                }

            }

            $scope.$watch('item.obj[21008669]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[21008669]) == 0) {
                        $scope.item.obj[21008670] = 'Nyaman'
                    } else if (parseInt($scope.item.obj[21008669]) >= 1 && parseInt($scope.item.obj[21008669]) <= 3) {
                        $scope.item.obj[21008670] = 'Kurang Nyaman'
                    } else if (parseInt($scope.item.obj[21008669]) >= 4 && parseInt($scope.item.obj[21008669]) <= 6) {
                        $scope.item.obj[21008670] = 'Nyeri Sedang'
                    } else if (parseInt($scope.item.obj[21008669]) >= 7 && parseInt($scope.item.obj[21008669]) <= 10) {
                        $scope.item.obj[21008670] = 'Nyeri Berat'
                    } else
                        $scope.item.obj[21008670] = ''

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
                $scope.item.obj[21008720] = $scope.totalSkor4
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
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                $scope.isRouteLoading = true
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

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'PengkajianAwalMedisIGDJiwaGrhCtrl ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                    $scope.isRouteLoading = false
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.cetakBlade = function(){
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }
                // if ($scope.item.obj[3003998] != undefined) {
                //     $scope.listPegawai.add($scope.item.obj[3003998])
                //     $scope.item.pegawai = $scope.item.obj[3003998]
                // }
                // if (pegawai == undefined) {
                //     return
                // }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-cmrm05?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    // '&isttd=true' +
                    // '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd, '_blank');
            }

        }
    ]);
});