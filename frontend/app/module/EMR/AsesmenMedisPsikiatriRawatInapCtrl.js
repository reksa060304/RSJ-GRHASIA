define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenMedisPsikiatriRawatInapCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.isRouteLoading = false
            var nomorEMR = '-'
            $scope.cc.emrfk = 777
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
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 777).then(function (e) {

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
                            "id": 120003,
                            "nama": "1. Nama ",
                            "type": "textbox6"
                        },
                        {
                            "id": 120004,
                            "nama": "hubungan dengan penderita ",
                            "type": "textbox6"
                        },
                        {
                            "id": 120005,
                            "nama": "2. Nama",
                            "type": "textbox6"
                        },
                        {
                            "id": 120006,
                            "nama": "hubungan dengan penderita ",
                            "type": "textbox6"
                        }
                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Keluhan Utama / Keluhan Saat Ini ",
                    "detail": [{
                            "id": 120007,
                            "nama": "",
                            "type": "textarea12"
                        }
                    ]
                },
                {
                    "id": 3,
                    "nama": "C. Awal Perubahan Tingkah Laku / Peningkatan Gejala Sejak : ",
                    "detail": [{
                            "id": 120008,
                            "nama": "",
                            "type": "textarea12"
                        },
                    ]
                },
                {
                    "id": 4,
                    "nama": "D. Gejala Yang DItunjukkan : ",
                    "detail": [{
                        "id": 120009,
                        "nama": "",
                        "type": "textarea12"
                    }, ]
                },
                {
                    "id": 5,
                    "nama": "E. Riwayat Gangguan Jiwa Sebelumnya : ",
                    "detail": [{
                        "id": 120010,
                        "nama": "Pernah",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120011,
                        "nama": "TIdak Pernah",
                        "type": "checkbox12"
                    },                    
                    {
                        "id": 120012,
                        "nama": "Pertama kali (Kapan) : ",
                        "type": "textbox12"
                    },
                    {
                        "id": 120013,
                        "nama": "Berapa kali : ",
                        "type": "textbox12"
                    },
                    {
                        "id": 120014,
                        "nama": "Pernah Sembuh: ",
                        "type": "label0"
                    },
                    {
                        "id": 120015,
                        "nama": "Pernah",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120016,
                        "nama": "Tidak Pernah",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120017,
                        "nama": "Berobat Jalan : ",
                        "type": "label0"
                    },
                    {
                        "id": 120018,
                        "nama": "Teratur",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120019,
                        "nama": "Tidak Teratur",
                        "type": "checkbox4"
                    },
                    {
                        "id": 120020,
                        "nama": "Tidak Pernah",
                        "type": "checkbox4"
                    },
                ]
                },
                {
                    "id": 6,
                    "nama": "F. Riwayat Penggunaan Obat",
                    "detail": [{
                        "id": 120296,
                        "nama": "Obat yang rutin dikonsumsi :",
                        "type": "textarea13"
                    },
                    {
                        "id": 120297,
                        "nama": "Obat yang digunakan sekarang :",
                        "type": "textarea13"
                    },
                  
                ]
                },
                {
                    "id": 7,
                    "nama": "G. Faktor Psikologis (Stresor Psikososial Ekonomi) Yang Mendahului (satu tahun terakhir) : ",
                    "detail": [{
                        "id": 120021,
                        "nama": "Tidak Ada",
                        "type": "checkbox6"
                    },
                    {
                        "id": 120022,
                        "nama": "Tidak Jelas",
                        "type": "checkbox6"
                    },
                    {
                        "id": 120023,
                        "nama": "Ada Yaitu",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120024,
                        "nama": "",
                        "type": "textbox12"
                    },
                ]
                },
                {
                    "id": 8,
                    "nama": "H. Faktor Organis Yang Mendahului / Kapan : ",
                    "detail": [{
                        "id": 120025,
                        "nama": "Tidak Ada",
                        "type": "checkbox12"
                    }, 
                    {
                        "id": 120026,
                        "nama": "Kejang",
                        "type": "checkbox3"
                    },
                    {
                        "id": 120027,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 120028,
                        "nama": "Panas",
                        "type": "checkbox3"
                    },
                    {
                        "id": 120029,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 120030,
                        "nama": "Keracunan",
                        "type": "checkbox3"
                    },
                    {
                        "id": 120031,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 120032,
                        "nama": "Trauma Kepala",
                        "type": "checkbox3"
                    },
                    {
                        "id": 120033,
                        "nama": "",
                        "type": "textbox8",
                        "placeholder": "kapan"
                    },
                    {
                        "id": 120034,
                        "nama": "Lainnya",
                        "type": "textbox12"
                    },
                    {
                        "id": 120035,
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
                        "id": 120036,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 10,
                    "nama": "J. Riwayat Alergi : ",
                    "detail": [{
                        "id": 120037,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 11,
                    "nama": "K. Kepribadian Sebelum Sakit : ",
                    "detail": [{
                        "id": 120038,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
                {
                    "id": 12,
                    "nama": "L. Riwayat Gangguan Jiwa Dalam Keluarga : ",
                    "detail": [{
                        "id": 120039,
                        "nama": "Ada, Hubungan Keluarga",
                        "type": "checkbox3",
                    },
                    {
                        "id": 120040,
                        "nama": "",
                        "type": "textbox6",
                        "placeholder": "keterangan"
                    },
                    {
                        "id": 120041,
                        "nama": "Tidak Ada",
                        "type": "checkbox12"
                    },
                    {
                        "id": 120042,
                        "nama": "Tidak Ada Keterangan",
                        "type": "checkbox12"
                    },
                ]
                },
                {
                    "id": 13,
                    "nama": "M. Silsilah Keluarga : ",
                    "detail": [{
                        "id": 120043,
                        "nama": "",
                        "type": "textarea12"
                    }]
                },
            ]
            $scope.listRiwayatPribadi = [{
                "id": 1,
                "nama": "A. Riwayat Kelahiran : ",
                "detail": [{
                        "id": 120044,
                        "no": 1,
                        "nama": "a. Umur ibu waktu melahirkan : ",
                        "type": "textbox12"
                    },
                    {
                        "no": 2,
                        "id": 120045,
                        "nama": "b. Kesehatan jiwa ibu waktu hamil : ",
                        "type": "label0"
                    },
                    {
                        "id": 120046,
                        "nama": "Sehat",
                        "type": "checkbox6",
                        "no": 3,
                    },
                    {
                        "id": 120047,
                        "nama": "Tidak ",
                        "type": "checkbox6",
                        "no": 4,
                    },
                    {
                        "id": 120048,
                        "nama": "c. Kesehatan fisik ibu waktu hamil : ",
                        "type": "label0",
                        "no": 5,
                    },
                    {
                        "id": 120049,
                        "nama": "Sehat ",
                        "type": "checkbox6",
                        "no": 6,
                    },
                    {
                        "id": 120050,
                        "nama": "Tidak ",
                        "type": "checkbox6",
                        "no": 7
                    },
                    {
                        "id": 120051,
                        "nama": "d. Kehamilan dikehendaki : ",
                        "type": "label0",
                        "no": 8
                    },
                    {
                        "id": 120052,
                        "nama": "ya ",
                        "type": "checkbox6",
                        "no": 9
                    },
                    {
                        "id": 120053,
                        "nama": "tidak ",
                        "type": "checkbox6",
                        "no": 10
                    },
                    {
                        "id": 120054,
                        "nama": "e. Persalinan :  ",
                        "type": "label0",
                        "no": 11
                    },
                    {
                        "id": 120055,
                        "nama": "normal ",
                        "type": "checkbox6",
                        "no": 12
                    },
                    {
                        "id": 120056,
                        "nama": "tidak ",
                        "type": "checkbox6",
                        "no": 13
                    },
                    {
                        "id": 120057,
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
                    "id": 120058,
                    "nama": "Dibesarkan dalam lingkungan : ",
                    "type": "label0",
                    "no": 1
                },
                {
                    "id": 120059,
                    "nama": "a. Orang tua kandung sejak umur",
                    "type": "textbox6",
                    "no": 2
                },
                {
                    "id": 120060,
                    "nama": "sampai umur",
                    "type": "textbox6",
                    "no": 3
                },
                {
                    "id": 120061,
                    "nama": "b. ",
                    "type": "textbox4",
                    "no": 4
                },
                {
                    "id": 120062,
                    "nama": "sejak umur",
                    "type": "textbox4",
                    "no": 5
                },
                {
                    "id": 120063,
                    "nama": "sampai umur",
                    "type": "textbox4",
                    "no": 6
                },
                {
                    "id": 120310,
                    "nama": "c. ",
                    "type": "textbox4",
                    "no": 7
                }, {
                    "id": 120311,
                    "nama": "sejak umur",
                    "type": "textbox4",
                    "no": 8
                }, {
                    "id": 120312,
                    "nama": "sampai umur",
                    "type": "textbox4",
                    "no": 9
                },
                {
                    "id": 120313,
                    "nama": "d. ",
                    "type": "textbox4",
                    "no": 10
                }, {
                    "id": 120314,
                    "nama": "sejak umur",
                    "type": "textbox4",
                    "no": 11
                }, {
                    "id": 120315,
                    "nama": "sampai umur",
                    "type": "textbox4",
                    "no": 12
                },
                {
                    "id": 120316,
                    "nama": "e. ",
                    "type": "textbox4",
                    "no": 13
                }, {
                    "id": 120317,
                    "nama": "sejak umur",
                    "type": "textbox4",
                    "no": 14
                }, {
                    "id": 120318,
                    "nama": "sampai umur",
                    "type": "textbox4",
                    "no": 15
                },
                {
                    "id": 120064,
                    "nama": "Cara mengasuh anak : ",
                    "type": "label0",
                    "no": 16
                },
                {
                    "id": 120065,
                    "nama": "Otoriter",
                    "type": "checkbox3",
                    "no": 17
                },
                {
                    "id": 120066,
                    "nama": "Demokratis",
                    "type": "checkbox3",
                    "no": 18
                },
                {
                    "id": 120067,
                    "nama": "Dimanja",
                    "type": "checkbox3",
                    "no": 19
                },
                {
                    "id": 120068,
                    "nama": "Kurang Diperhatikan",
                    "type": "checkbox3",
                    "no": 20
                },
                {
                    "id": 120328,
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
                    "id": 120069,
                    "nama": "Tidak Ada Kelainan",
                    "type": "checkbox12",
                    "no": 21
                },
                {
                    "id": 120070,
                    "nama": "Lain-lain",
                    "type": "checkbox12",
                    "no": 22
                },
                {
                    "id": 120071,
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
                        "id": 120072,
                        "nama": "SD, Lulus",
                        "type": "checkbox6",
                        "no": 24
                    },
                    {
                        "id": 120073,
                        "nama": "SD, Tidak",
                        "type": "checkbox6",
                        "no": 25
                    },
                    {
                        "id": 120074,
                        "nama": "SLTP, Lulus",
                        "type": "checkbox6",
                        "no": 26
                    },
                    {
                        "id": 120075,
                        "nama": "SLTP, Tidak",
                        "type": "checkbox6",
                        "no": 27
                    },
                    {
                        "id": 120076,
                        "nama": "SLTA, Lulus",
                        "type": "checkbox6",
                        "no": 28
                    }, 
                    {
                        "id": 120077,
                        "nama": "SLTA, Tidak",
                        "type": "checkbox6",
                        "no": 29
                    },
                    {
                        "id": 120078,
                        "nama": "Perguruan Tinggi, Lulus",
                        "type": "checkbox6",
                        "no": 30
                    }, 
                    {
                        "id": 120079,
                        "nama": "Perguruan Tinggi, Tidak",
                        "type": "checkbox6",
                        "no": 31
                    },
                    {
                        "id": 120080,
                        "nama": "Kecerdasan",
                        "type": "label0",
                        "no": 32
                    },
                    {
                        "id": 120081,
                        "nama": "Tinggi",
                        "type": "checkbox4",
                        "no": 33
                    },
                    {
                        "id": 120082,
                        "nama": "Cukup",
                        "type": "checkbox4",
                        "no": 34
                    },
                    {
                        "id": 120083,
                        "nama": "Kurang",
                        "type": "checkbox4",
                        "no": 35
                    },
                    {
                        "id": 120084,
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
                        "id": 120085,
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
                    "id": 120086,
                    "nama": "Kegiatan ibadah : ",
                    "type": "textbox12",
                    "no": 38
                },
                {
                    "id": 120087,
                    "nama": "Nilai - nilai yang bertentangan dengan kebutuhan kesehatan : ",
                    "type": "textbox12",
                    "no": 39
                },
                {
                    "id": 120088,
                    "nama": "Meminta pelayanan kerohanian (lakukan kolaborasi dengan petugas kerohanian) : ",
                    "type": "label0",
                    "no": 40
                },
                {
                    "id": 120089,
                    "nama": "Tidak",
                    "type": "checkbox6",
                    "no": 41
                },
                {
                    "id": 120090,
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
                    "id": 120091,
                    "nama": "",
                    "type": "textarea12",
                    "no": 43
                }]
            },
            {
                "id": 8,
                "nama": "H. Kehidupan emosional : ",
                "detail": [{
                    "id": 120092,
                    "nama": "Mantap(stable)",
                    "type": "checkbox3",
                    "no": 44
                },
                {
                    "id": 120093,
                    "nama": "Cemas",
                    "type": "checkbox3",
                    "no": 45
                },
                {
                    "id": 120094,
                    "nama": "Gembira",
                    "type": "checkbox3",
                    "no": 46
                },
                {
                    "id": 120095,
                    "nama": "Sikap Terbuka",
                    "type": "checkbox3",
                    "no": 47
                },
                {
                    "id": 120096,
                    "nama": "Optimis",
                    "type": "checkbox3",
                    "no": 48
                },
                {
                    "id": 120097,
                    "nama": "Mudah tersinggung",
                    "type": "checkbox3",
                    "no": 49
                },
                {
                    "id": 120098,
                    "nama": "Sedih",
                    "type": "checkbox3",
                    "no": 50
                },
                {
                    "id": 120099,
                    "nama": "Pesimis",
                    "type": "checkbox3",
                    "no": 51
                },
                {
                    "id": 120100,
                    "nama": "Tegang",
                    "type": "checkbox3",
                    "no": 52
                },
                {
                    "id": 120101,
                    "nama": "Apatik",
                    "type": "checkbox3",
                    "no": 53
                },
                {
                    "id": 120102,
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
                    "id": 120103,
                    "nama": "Dengan keluarga : ",
                    "type": "textbox12"  ,
                    "no": 55
                },
                {
                    "id": 120104,
                    "nama": "Dengan Tetangga : ",
                    "type": "textbox12",
                    "no": 56
                },
                {
                    "id": 120105,
                    "nama": "Dengan Teman : ",
                    "type": "textbox12",
                    "no": 57
                },
                {
                    "id": 120106,
                    "nama": "Dalam Pekerjaan : ",
                    "type": "textbox12",
                    "no": 58
                },
                {
                    "id": 120107,
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
                    "id": 120108,
                    "nama": "Merokok",
                    "type": "checkbox12",
                    "no": 60
                },
                {
                    "id": 120319,
                    "nama": "",
                    "type": "textbox12",
                    "no": 61
                },
                {
                    "id": 120109,
                    "nama": "Minuman Keras",
                    "type": "checkbox12",
                    "no": 62
                },
                {
                    "id": 120320,
                    "nama": "",
                    "type": "textbox12",
                    "no": 63
                },
                {
                    "id": 120110,
                    "nama": "Obat-obatan",
                    "type": "checkbox12",
                    "no": 64
                },
                {
                    "id": 120321,
                    "nama": "",
                    "type": "textbox12",
                    "no": 65
                },
                {
                    "id": 120122,
                    "nama": "Lain-lain",
                    "type": "checkbox12",
                    "no": 66
                }, {
                    "id": 120323,
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
                        "id": 120111,
                        "nama": "Pengalaman Militer : ",
                        "type": "textbox12",
                        "no": 63
                    },
                    {
                        "id": 120112,
                        "nama": "Urusan dengan Polisi : ",
                        "type": "textbox12",
                        "no": 64
                    },
                ]
            },
        ]

            $scope.listPemeriksaanFisik = [{
                    "id": 1,
                    "nama": "A. Vital Sign : ",
                    "detail": [{
                            "id": 120113,
                            "nama": "Tekanan Darah : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 120114,
                            "nama": "Nadi : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 120115,
                            "nama": "Suhu : ",
                            "type": "textbox3"
                        },
                        {
                            "id": 120116,
                            "nama": "Respirasi :  ",
                            "type": "textbox3"
                        },
                        {
                            "id": 120309,
                            "nama": "Saturasi :  ",
                            "type": "textbox3"
                        },

                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Status Generalis dan Neurologis : ",
                    "detail": [{
                            "id": 120117,
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
                            "id": 120118,
                            "nama": "",
                            "type": "textarea12"
                        },
                    ]
                },
                {
                    "id": 2,
                    "nama": "B. Kesadaran ",
                    "detail": [{
                            "id": 120119,
                            "nama": "Kualitatif : ",
                            "type": "label0"
                        },
                        {
                            "id": 120120,
                            "nama": "Komposmentis",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120121,
                            "nama": "Sopor",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120122,
                            "nama": "Confuse",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120123,
                            "nama": "Absence",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120124,
                            "nama": "Apatis",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120125,
                            "nama": "Pre Coma",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120126,
                            "nama": "Kesadaran berkabut",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120127,
                            "nama": "Somnolent",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120128,
                            "nama": "Coma",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120129,
                            "nama": "Delirium",
                            "type": "checkbox3"
                        },
                        {
                            "id": 120130,
                            "nama": "Lain - lain : ",
                            "type": "textbox6"
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": "C. Orientasi : ",
                    "detail": [{
                        "id": 120131,
                        "nama": "Orang",
                        "type": "textbox6"
                    },
                    {
                        "id": 120132,
                        "nama": "Tempat",
                        "type": "textbox6"
                    },
                    {
                        "id": 120133,
                        "nama": "Waktu",
                        "type": "textbox6"
                    },
                    {
                        "id": 120134,
                        "nama": "Situasi",
                        "type": "textbox6"
                    },
                
                ]
                },
                {
                    "id": 4,
                    "nama": "D. Sikap Dan Tingkah Laku : ",
                    "detail": [
                        {"id": 120135, "nama": "Dalam batas normal", "type": "checkbox12"},
                        {"id": 120136, "nama": "Hipoaktif", "type": "checkbox12"},
                        {"id": 120137, "nama": "Disaktif : ", "type": "checkbox12"},
                        {"id": 120138, "nama": "Bizar", "type": "checkbox2ml"},
                        {"id": 120139, "nama": "Ekhopraksi", "type": "checkbox3"},
                        {"id": 120140, "nama": "Fleksibilitas serea", "type": "checkbox3"},
                        {"id": 120141, "nama": "Kompulsif", "type": "checkbox3"},
                        {"id": 120142, "nama": "Stereotipi", "type": "checkbox2ml"},
                        {"id": 120143, "nama": "Automasi perintah", "type": "checkbox3"},
                        {"id": 120144, "nama": "Negativisme", "type": "checkbox3"},
                        {"id": 120145, "nama": "Katelpsi", "type": "checkbox3"},
                        {"id": 120146, "nama": "Stupor", "type": "checkbox2ml"},
                        {"id": 120147, "nama": "Impulsif", "type": "checkbox3"},
                        {"id": 120148, "nama": "Lain - lain : ", "type": "textbox6"},
                        {"id": 120149, "nama": "Hiperaktif : ", "type": "checkbox12"},
                        {"id": 120150, "nama": "Agitasi", "type": "checkbox2ml"},
                        {"id": 120151, "nama": "Agresivitas", "type": "checkbox3"},
                        {"id": 120152, "nama": "gaduh gelisah", "type": "checkbox3"},
                        {"id": 120153, "nama": "Lain - lain : ", "type": "textbox6"},
                    ]
                },
                {
                    "id": 5,
                    "nama": "E. Proses Pikir : ",
                    "detail": [
                        {"id": 120154, "nama": "Bentuk pikir : ", "type": "label0"},
                        {"id": 120155, "nama": "Realistis", "type": "checkbox4"},
                        {"id": 120156, "nama": "Non realistis : ", "type": "checkbox4"},
                        {"id": 120157, "nama": "Dereistrik", "type": "checkbox4"},
                        {"id": 120158, "nama": "Autistik", "type": "checkbox4"},
                        {"id": 120159, "nama": "Gangguan pikiran formal", "type": "checkbox4"},
                        {"id": 120160, "nama": "Kompulsif", "type": "checkbox4"},
                        {"id": 120161, "nama": "Isi Pikir", "type": "label0"},
                        {"id": 120162, "nama": "Tidak ada Kelainan", "type": "checkbox3"},
                        {"id": 120163, "nama": "Waham Sexual", "type": "checkbox3"},
                        {"id": 120164, "nama": "Waham sisi pikir", "type": "checkbox3"},
                        {"id": 120165, "nama": "Phobi", "type": "checkbox3"},
                        {"id": 120166, "nama": "Waham kejar", "type": "checkbox3"},
                        {"id": 120167, "nama": "Waham berdosa", "type": "checkbox3"},
                        {"id": 120168, "nama": "Waham sedot pikir", "type": "checkbox3"},
                        {"id": 120169, "nama": "obsesi", "type": "checkbox3"},
                        {"id": 120170, "nama": "Waham diancam", "type": "checkbox3"},
                        {"id": 120171, "nama": "waham rendah diri", "type": "checkbox3"},
                        {"id": 120172, "nama": "waham kendali pikir", "type": "checkbox3"},
                        {"id": 120173, "nama": "idea of reference", "type": "checkbox3"},
                        {"id": 120174, "nama": "Waham curiga", "type": "checkbox3"},
                        {"id": 120175, "nama": "waham hipokondri", "type": "checkbox3"},
                        {"id": 120176, "nama": "waham siar pikir", "type": "checkbox3"},
                        {"id": 120177, "nama": "Waham cemburu", "type": "checkbox3"},
                        {"id": 120178, "nama": "Waham kebesaran", "type": "checkbox3"},
                        {"id": 120179, "nama": "Waham magik mistik", "type": "checkbox3"},
                        {"id": 120180, "nama": "lain - lain : ", "type": "textbox6"},
                        {"id": 120181, "nama": "Progresi Pikir Kualitatif : ", "type": "label0"},
                        {"id": 120182, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 120183, "nama": "Neologisme", "type": "checkbox3"},
                        {"id": 120184, "nama": "Sirkumstansial", "type": "checkbox3"},
                        {"id": 120185, "nama": "Gagap", "type": "checkbox3"},
                        {"id": 120186, "nama": "Perseverasi", "type": "checkbox3"},
                        {"id": 120187, "nama": "inkoherensi", "type": "checkbox3"},
                        {"id": 120188, "nama": "Tangensial", "type": "checkbox3"},
                        {"id": 120189, "nama": "Verbegerasi", "type": "checkbox3"},
                        {"id": 120190, "nama": "Asosiasi longgar", "type": "checkbox3"},
                        {"id": 120191, "nama": "Flight of ideas", "type": "checkbox3"},
                        {"id": 120192, "nama": "Ekolali", "type": "checkbox3"},
                        {"id": 120193, "nama": "Irelevansi", "type": "checkbox3"},
                        {"id": 120194, "nama": "Flight into mysticsm", "type": "checkbox3"},
                        {"id": 120195, "nama": "Lain - lain :", "type": "textbox6"},
                        {"id": 120196, "nama": "Progresi Pikir Kuantitatif : ", "type": "label0"},
                        {"id": 120197, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 120198, "nama": "Logore", "type": "checkbox3"},
                        {"id": 120199, "nama": "Reming", "type": "checkbox3"},
                        {"id": 120200, "nama": "Bloking", "type": "checkbox3"},
                        {"id": 120233, "nama": "Mutisme", "type": "checkbox3"},
                        {"id": 120234, "nama": "Lain-lain : ", "type": "textbox6"},
                        
                    ]
                },
                {
                    "id": 6,
                    "nama": "F. Mood : ",
                    "detail": [
                        {"id": 120201, "nama": "Tidak ada kelainan", "type": "checkbox4"},
                        {"id": 120202, "nama": "Sedih", "type": "checkbox4"},
                        {"id": 120203, "nama": "Marah", "type": "checkbox4"},
                        {"id": 120204, "nama": "Curiga", "type": "checkbox4"},
                        {"id": 120205, "nama": "Gembira", "type": "checkbox4"},
                        {"id": 120206, "nama": "Lain - lain : ", "type": "textbox4"},
                    ]
                },
                {
                    "id": 7,
                    "nama": "G. Afek : ",
                    "detail": [
                        {"id": 120207, "nama": "Tidak ada kelainan", "type": "checkbox3"},
                        {"id": 120208, "nama": "Euforia", "type": "checkbox3"},
                        {"id": 120209, "nama": "Takut", "type": "checkbox3"},
                        {"id": 120210, "nama": "Curiga", "type": "checkbox3"},
                        {"id": 120211, "nama": "Menyempit", "type": "checkbox3"},
                        {"id": 120212, "nama": "Elasi", "type": "checkbox3"},
                        {"id": 120213, "nama": "Susah", "type": "checkbox3"},
                        {"id": 120214, "nama": "Tumpul", "type": "checkbox3"},
                        {"id": 120215, "nama": "Ekstase", "type": "checkbox3"},
                        {"id": 120216, "nama": "Inappropriate", "type": "checkbox3"},
                        {"id": 120217, "nama": "Datar", "type": "checkbox3"},
                        {"id": 120218, "nama": "Panik", "type": "checkbox3"},
                        {"id": 120219, "nama": "Labil", "type": "checkbox3"},
                        {"id": 120220, "nama": "indifferent", "type": "checkbox3"},
                        {"id": 120221, "nama": "Tension", "type": "checkbox3"},
                        {"id": 120222, "nama": "Cemas", "type": "checkbox3"},
                        {"id": 120223, "nama": "Lain - lain : ", "type": "textbox6"},
                    ]
                },
                {
                    "id": 8,
                    "nama": "H. Gangguan Persepsi : ",
                    "detail": [
                        {"id": 120224, "nama": "Halusinasi dengar", "type": "checkbox3"},
                        {"id": 120225, "nama": "Halusinasi penglihatan", "type": "checkbox3"},
                        {"id": 120226, "nama": "Halusinasi peraba", "type": "checkbox3"},
                        {"id": 120227, "nama": "Halusinasi pengecap", "type": "checkbox3"},
                        {"id": 120228, "nama": "Halusinasi pembauan", "type": "checkbox3"},
                        {"id": 120229, "nama": "Halusinasi sexual", "type": "checkbox3"},
                        {"id": 120230, "nama": "ilusi", "type": "checkbox3"},
                        // {"id": 120231, "nama": "Tumpul", "type": "checkbox3"},
                        {"id": 120232, "nama": "Lain-lain : ", "type": "textbox6"},
                        // 120234
                    ]
                },
                {
                    "id": 9,
                    "nama": "I. Gangguan Memori : ",
                    "detail": [
                        {"id": 119998, "nama": "Ada", "type": "checkbox12"},
                        {"id": 120236, "nama": "Tidak ada", "type": "checkbox6"},
                        {"id": 120235, "nama": "", "type": "textbox6"},
                        
                    ]
                },
                {
                    "id": 10,
                    "nama": "J. Gangguan Intelegensi : ",
                    "detail": [
                        {"id": 119999, "nama": "Ada", "type": "checkbox12"},
                        {"id": 120238, "nama": "Tidak ada", "type": "checkbox6"},
                        {"id": 120237, "nama": "", "type": "textbox6"},
                        
                    ]
                },
                {
                    "id": 11,
                    "nama": "K. Hubungan Jiwa : ",
                    "detail": [
                        {"id": 120239, "nama": "Sukar", "type": "checkbox6"},
                        {"id": 120240, "nama": "Mudah", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 12,
                    "nama": "L. Perhatian : ",
                    "detail": [
                        {"id": 120241, "nama": "Sukar ditarik sukar dicantum", "type": "checkbox6"},
                        {"id": 120242, "nama": "Sukar ditarik mudah dicantum", "type": "checkbox6"},
                        {"id": 120243, "nama": "Mudah ditarik sukar dicantum", "type": "checkbox6"},
                        {"id": 120244, "nama": "mudah ditarik mudah dicantum", "type": "checkbox6"},
                    ]
                },
                {
                    "id": 13,
                    "nama": "M. Insight : ",
                    "detail": [
                        {"id": 120245, "nama": "Derajat", "type": "label0"},
                        {"id": 120246, "nama": "1", "type": "checkbox1"},
                        {"id": 120247, "nama": "2", "type": "checkbox1"},
                        {"id": 120248, "nama": "3", "type": "checkbox1"},
                        {"id": 120249, "nama": "4", "type": "checkbox1"},
                        {"id": 120250, "nama": "5", "type": "checkbox1"},
                        {"id": 120251, "nama": "6", "type": "checkbox1"},
                        {"id": 120252, "nama": "Baik", "type": "checkbox3"},
                        {"id": 120253, "nama": "Jelek", "type": "checkbox3"},
                    ]
                },
            ]

            $scope.listHasilPemeriksaanPenunjang = [{
                    "id": 1,
                    "nama": "",
                    "detail": [
                        { "id": 120254, "nama": "a. Laboratorium : ", "type": "textbox12" },
                        { "id": 120255, "nama": "b. Radiologi : ", "type": "textbox12" },
                        { "id": 120256, "nama": "c. EKG : ", "type": "textbox12" },
                        { "id": 120257, "nama": "d. EEG : ", "type": "textbox12" },
                        { "id": 120258, "nama": "e. Lain-lain : ", "type": "label0" },
                        { "id": 120259, "nama": "MMSE", "type": "checkbox3" },
                        { "id": 120260, "nama": "PANSS-EC", "type": "checkbox3" },
                        { "id": 120261, "nama": "HRSD", "type": "checkbox3" },
                        { "id": 120262, "nama": "HRSA", "type": "checkbox3" },
                        { "id": 120305, "nama": "", "type": "textbox3" },
                        { "id": 120306, "nama": "", "type": "textbox3" },
                        { "id": 120307, "nama": "", "type": "textbox3" },
                        { "id": 120308, "nama": "", "type": "textbox3" },
                    ]
                },
            ]

            $scope.listDiagnosis = [{
                    "id": 1,
                    "nama": "",
                    "detail": [
                        { "id": 120263, "nama": "AKSIS I : ", "type": "textbox12" },
                        { "id": 120264, "nama": "AKSIS II : ", "type": "textbox12" },
                        { "id": 120265, "nama": "AKSIS III : ", "type": "textbox12" },
                        { "id": 120266, "nama": "AKSIS IV : ", "type": "textbox12" },
                        { "id": 120267, "nama": "AKSIS V : GAF Scale", "type": "textbox12" },
                    ]
                },
            ]
            $scope.listMasalahKeperawatan = [{
                "id": 1,
                "nama": "",
                "detail": [
                    { "id": 120304, "nama": " ", "type": "textareabold" },
                    
                ]
            },
        ]
        $scope.listPenatalaksanaan = [{
            "id": 1,
            "nama": "",
            "detail": [
                { "id": 120268, "nama": " ", "type": "textareabold" },
                
            ]
        },
    ]
    $scope.listAsuhan = [
        {
            "id": 3,
            "nama": "INTEGRASI ASUHAN",
            "detail6": [
                { "id": 120283, "nama": "Dokter :", "type": "checkboxtextbox3" },
                //12084
                { "id": 120285, "nama": "Perawat :", "type": "checkboxtextbox4" },
                //120286
                { "id": 120287, "nama": "PPA lain : ", "type": "checkboxtextbox5" },
                // 120288
                { "id": 120289, "nama": "Catatan / Notasi DPJP", "type": "textbox12" },
                { "id": 120290, "nama": "Paraf DPJP : ", "type": "combobox6right" },
            ]
        },
    ]

            $scope.listPenatalaksanaan2 = [{
                    "id": 1,
                    "nama": "Prioritas Pelayanan :",
                    "detail": [
                        { "id": 120269, "nama": " ", "type": "label0" },
                        { "id": 120270, "nama": "Preventif", "type": "checkbox3" },
                        { "id": 120271, "nama": "Kuratif", "type": "checkbox3" },
                        { "id": 120272, "nama": "Rehabilitatif", "type": "checkbox3" },
                        { "id": 120273, "nama": "Palitatif", "type": "checkbox3" },
                    ]
                },
                {
                    "id": 2,
                    "nama": "Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada : ",
                    "detail": [
                        { "id": 120298, "nama": "Pasien", "type": "checkbox12" },
                        { "id": 120299, "nama": "Keluarga pasien,", "type": "checkbox12" },
                        { "id": 120300, "nama": "Nama : ", "type": "textbox12" },
                        { "id": 120301, "nama": "Hubungan dengan Pasien :", "type": "textbox12" },
                        { "id": 120302, "nama": "Lainnya :", "type": "textbox12" },

                        //120282

                    ]
                },
                
                {
                    "id": 3,
                    "nama": "RENCANA PEMULANGAN PASIEN : ",
                    "detail": [
                        { "id": 120275, "nama": "1. Estimasi lama perawatan : ", "type": "textbox6", "satuan": " hari" },
                        { "id": 120276, "nama": "2. Kebutuhan pendampingan selama dirumah : ", "type": "label0" },
                        { "id": 120277, "nama": "Keluarga", "type": "checkbox12" },
                        { "id": 120278, "nama": "Dokter", "type": "checkbox12" },
                        { "id": 120279, "nama": "Tenaga Kesehatan lainnya : ", "type": "textbox12" },
                        { "id": 120280, "nama": "Lainnya : ", "type": "textbox12" },
                       
                        //120282

                    ]
                },
                
                
            ]

            $scope.listakhir = [
                
                {
                    "id": 4,
                    "nama": "",
                    "detail6": [
                        { "id": 120291, "nama": "Selesai pemeriksaan, Pukul : ", "type": "time" },
                        { "id": 120292, "nama": "Penanggung Jawab Pasien ", "type": "label06" },
                        { "id": 120293, "nama": "Dokter Pemeriksa/DPJP", "type": "label06" },
                        { "id": 120294, "nama": "", "type": "textbox6" },
                        { "id": 120295, "nama": "", "type": "combobox" },
                    ]
                },
                
            ]
            

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

          

            
            loadValidasi()
            function loadValidasi(){
                $scope.isRouteLoading = true
                medifirstService.get('emr/get-validasi-emr?noemr=' + nomorEMR + '&emrfk=' + $scope.cc.emrfk).then(function (data) {
                    var datas = data.data.data;
                    console.log(datas.length);
                    if (datas.length > 0) {
                    $scope.isRouteLoading = false
                    medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                        $scope.listPegawai = data
            })
                        medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                            $scope.item.obj = []
                            $scope.item.obj2 = []
                            medifirstService.get("emr/get-emr-to-emr?noemr="+ nomorEMR + "&emrfk=3000004").then(function (dat) {
                                var datas = dat.data.data
                                $scope.isRouteLoading = false
                                for (let i = 0; i < datas.length; i++) {
                                    if(datas[i].type == 'textbox'){
                                        $scope.item.obj[datas[i].idtujuan]= datas[i].value   
                                    }    
                                    if (datas[i].type == "checkbox") {
                                        if (datas[i].value == "1") {
                                            $scope.item.obj[datas[i].idtujuan] = datas[i].value 
                                            console.log(datas[i].type);
                                        }
                                    }       
                                    if (datas[i].type == "textarea") {
                                        $scope.item.obj[datas[i].idtujuan] = datas[i].value
                                    }                         
                                }
                                
                                
                
                            })
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
                            $scope.item.obj[120001] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                            $scope.item.obj[120291] = new Date($scope.now)

                            $scope.item.obj[120295] = {
                                value: medifirstService.getPegawaiLogin().id,
                                text: medifirstService.getPegawaiLogin().namaLengkap
                            }
                            $scope.item.obj[120290] = {
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
                                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(moment($scope.now).format('YYYY-MM-DD') + ' ' + dataLoad[i].value)
                                        console.log($scope.item.obj[dataLoad[i].emrdfk]);
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
                                    if (dataLoad[i].type == "combobox6right") {
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
                    } else {
                        medifirstService.get("emr/get-emr-otomatis?noemr=" + nomorEMR + "&emrfk=3000922" + "&emrid=" + $scope.cc.emrfk).then(function (data) {
                            var datas = data.data.data
                            $scope.isRouteLoading = false
                            $scope.item.obj = []
                            $scope.item.obj2 = []
                            medifirstService.get("emr/get-emr-to-emr?noemr="+ nomorEMR + "&emrfk=3000004").then(function (dat) {
                                var datas = dat.data.data
                                $scope.isRouteLoading = false
                                for (let i = 0; i < datas.length; i++) {
                                    if(datas[i].type == 'textbox'){
                                        $scope.item.obj[datas[i].idtujuan]= datas[i].value   
                                    }    
                                    if (datas[i].type == "checkbox") {
                                        if (datas[i].value == "1") {
                                            $scope.item.obj[datas[i].idtujuan] = datas[i].value 
                                            console.log(datas[i].type);
                                        }
                                    }       
                                    if (datas[i].type == "textarea") {
                                        $scope.item.obj[datas[i].idtujuan] = datas[i].value
                                    }                         
                                }
                                
                                
                
                            })
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
                            $scope.item.obj[120001] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                            $scope.item.obj[120291] = new Date($scope.now)

                            $scope.item.obj[120295] = {
                                value: medifirstService.getPegawaiLogin().id,
                                text: medifirstService.getPegawaiLogin().namaLengkap
                            }
                            
                            for (let i = 0; i < datas.length; i++) {
                                if (datas[i].type == "textarea") {
                                    $scope.item.obj[datas[i].id] = datas[i].value
                                }
                                if (datas[i].type == "combobox") {
                                    var str = datas[i].value
                                    if (str != undefined) {
                                        var res = str.split("~");
                                        $scope.item.obj[datas[i].id] = {
                                            value: res[0],
                                            text: res[1]
                                        }
                                    }
                                }
                                if (datas[i].type == "checkbox") {
                                    if (datas[i].value == "1") {
                                        $scope.item.obj[datas[i].id] = true
                                        console.log(datas[i].type);
                                    }
                                }
                                if (datas[i].type == "radio") {
                                        // $scope.item.obj[datas[i].id] = true

                                    if (datas[i].value == "1" && datas[i].id == 120246) {
                                        $scope.item.obj[120246] = true
                                    }
                                    if (datas[i].value == "2" && datas[i].id == 120247) {
                                        $scope.item.obj[120247] = true
                                    }
                                    if (datas[i].value == "3") {
                                        $scope.item.obj[120248] = true
                                    }
                                    if (datas[i].value == "4") {
                                        $scope.item.obj[120249] = true
                                    }
                                    if (datas[i].value == "5") {
                                        $scope.item.obj[120250] = true
                                    }
                                    if (datas[i].value == "6") {
                                        $scope.item.obj[120251] = true
                                    }
                                    if (datas[i].value == "1" && datas[i].id == 120252) {
                                        $scope.item.obj[120252] = true
                                    }
                                    if (datas[i].value == "2" && datas[i].id == 120253) {
                                        $scope.item.obj[120253] = true
                                    }
                                }
                                if (datas[i].type == "textbox") {
                                    $scope.item.obj[datas[i].id] = datas[i].value
                                }

                            }

                        })
                    }

                })
            }
            
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
                        'AsesmenMedisPsikiatriRawatInapCtrl ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                    $scope.isRouteLoading = false
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});