define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperawatanRawatInapNonJiwaCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000457
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000455).then(function (e) {

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
                    if (element.kodeexternal == 'shiftjaga2') {
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


            $scope.listRujukan = [
                {
                    "id": 1,
                    "nama": "Tanggal dan Jam",
                    "detail": [{
                        "id": 1901301451,
                        "nama": "",
                        "type": "datetime"
                    }, ]
                },
                {
                    "id": 1,
                    "nama": "1. Keluhan / Alasan Masuk",
                    "detail": [{
                        "id": 1901301452,
                        "nama": "",
                        "type": "textarea"
                    }, ]
                },
                {
                    "id": 2,
                    "nama": "2. Faktor Predisposisi",
                    "detail": [{
                        "id": 1901301453,
                        "nama": "Gangguan jiwa di masa lalu",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301454,
                        "nama": "Introvert",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301455,
                        "nama": "Konflik dengan lingkungan",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301456,
                        "nama": "Genetik",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301457,
                        "nama": "Pola asuh",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301458,
                        "nama": "Konflik dalam pekerjaan",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301459,
                        "nama": "Trauma kepala",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301460,
                        "nama": "Kegagalan tumbuh kembang",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301461,
                        "nama": "Konflik keluarga",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301646,
                        "nama": "Kejang",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301462,
                        "nama": "Pengalaman traumatis",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301463,
                        "nama": "Konflik pendidikan",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301464,
                        "nama": "Riwayat konsumsi minuman keras",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301465,
                        "nama": "Konflik perkawinan",
                        "type": "checkbox"
                    }, {
                        "id": 1901301466,
                        "nama": "Riwayat penyalahgunaan NAPZA",
                        "type": "checkbox"
                    },
                    {
                        "id": 1901301467,
                        "nama": "",
                        "type": "checkboxtextbox",
                        "idd": 1901301468,
                    },
                    {
                        "id": 1901301469,
                        "nama": "",
                        "type": "checkboxtextbox",
                        "idd": 1901301470,
                    },
                    {
                        "id": 1901301471,
                        "nama": "",
                        "type": "checkboxtextbox",
                        "idd": 1901301472,
                    },
                    
                 ]
                },
                {
                    "id": 3,
                    "nama": "3. Faktor Presipitasi",
                    "detail": [{
                        "id": 1901301473,
                        "nama": "",
                        "type": "textarea"
                    }, ]
                },
                {
                    "id": 4,
                    "nama": "4. Pemeriksaan Fisik",
                    "detail": [{
                            "id": 1901301474,
                            "nama": "TD :",
                            "type": "textbox3",
                            
                        },
                        {
                            "id": 1901301475,
                            "nama": "N :",
                            "type": "textbox3",
                        },
                        {
                            "id": 1901301476,
                            "nama": "S :",
                            "type": "textbox3",
                        },
                        {
                            "id": 1901301477,
                            "nama": "R :",
                            "type": "textbox3",
                        },
                        {
                            "id": 1901301478,
                            "nama": "Kondisi Fisik Jelaskan",
                            "type": "textarea",
                        },

                    ]
                },
                {
                    "id": 5,
                    "nama": "SKALA NYERI",
                    "detail": [{
                        "id": 116131,
                        "nama": "",
                        "type": "slider",
                        "detail": [
                            {
                                "id": 1901301479,
                                "nama": "0 Tidak Nyeri",
                                "type": "checkbox",
                            },
                            {
                                "id": 1901301480,
                                "nama": "1-3 Ringan",
                                "type": "checkbox",
                            },
                            {
                                "id": 1901301481,
                                "nama": "4-6 Sedang",
                                "type": "checkbox",
                            },
                            {
                                "id": 1901301482,
                                "nama": "7-10 Berat",
                                "type": "checkbox",
                            }
                        ]
                    }, 
                    {
                        "id": 116132,
                        "nama": "",
                        "type": "image",
                        "detail": [
                            {
                                "id": 1901301483,
                                "nama": "Tidak Nyeri",
                                "type": "checkbox",
                                "descNilai": "0"
                            },
                            {
                                "id": 1901301484,
                                "nama": "Sedikit Nyeri",
                                "type": "checkbox",
                                "descNilai": "1"

                            },
                            {
                                "id": 1901301485,
                                "nama": "Agak Mengganggu",
                                "type": "checkbox",
                                "descNilai": "2"

                            },
                            {
                                "id": 1901301486,
                                "nama": "Mengganggu Aktivitas",
                                "type": "checkbox",
                                "descNilai": "3"

                            },
                            {
                                "id": 1901301487,
                                "nama": "Sangat Mengganggu",
                                "type": "checkbox",
                                "descNilai": "4"

                            },
                            {
                                "id": 1901301488,
                                "nama": "Tak Tertahankan",
                                "type": "checkbox",
                                "descNilai": "5"

                            }
                        ]
                    },
                    {
                        "id": 116133,
                        "nama": "",
                        "type": "imagecheckbox",
                        "detail": [{
                                "id": 1901301483,
                                "nama": "Tidak Nyeri",
                                "type": "checkbox",
                                "descNilai": "0"
                            },
                            {
                                "id": 1901301484,
                                "nama": "Sedikit Nyeri",
                                "type": "checkbox",
                                "descNilai": "1"
                            },
                            {
                                "id": 1901301485,
                                "nama": "Agak Mengganggu",
                                "type": "checkbox",
                                "descNilai": "2"
                            },
                            {
                                "id": 1901301486,
                                "nama": "Mengganggu Aktivitas",
                                "type": "checkbox",
                                "descNilai": "3"
                            },
                            {
                                "id": 1901301487,
                                "nama": "Sangat Mengganggu",
                                "type": "checkbox",
                                "descNilai": "4"
                            },
                            {
                                "id": 1901301488,
                                "nama": "Tak Tertahankan",
                                "type": "checkbox",
                                "descNilai": "5"
                            }
                        ]
                    },
                    {
                        "id": 116133,
                        "nama": "",
                        "type": "textboxLDF",
                        "detail": [{
                                "id": 1901301489,
                                "nama": "Lokasi",
                                "type": "checkbox",
                            },
                            {
                                "id": 1901301490,
                                "nama": "Durasi",
                                "type": "checkbox",
                            },
                            {
                                "id": 1901301491,
                                "nama": "Frekuensi",
                                "type": "checkbox",
                            },
                        ]
                    }
                ]
                },
                {
                    "id": 6,
                    "nama":"PENILAIAN RISIKO JATUH",
                    "detail":[
                        {
                            "id": 1,
                            "nama":"MORSE (Dewasa)",
                            "type": "penilaianrisikojatuh",
                            "detail": [
                                {
                                    "id": 1901301492,
                                    "nama": "Tidak ada risiko jatuh : 0 - 24",
                                    "type": "checkbox"
                                },
                                {
                                    "id": 1901301493,
                                    "nama": "Risiko jatuh rendah : 25 - 44",
                                    "type": "checkbox"
                                },
                                {
                                    "id": 1901301494,
                                    "nama": "Risiko jatuh tinggi : >= 45",
                                    "type": "checkbox"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "nama": "HUMPTY DUMTY (Anak)",
                            "type": "penilaianrisikojatuh",
                            "detail": [
                                {
                                    "id": 1901301495,
                                    "nama": "Risiko jatuh rendah : 7 - 11",
                                    "type": "checkbox"
                                },
                                {
                                    "id": 1901301496,
                                    "nama": "Risiko jatuh tinggi : >= 12",
                                    "type": "checkbox"
                                }
                            ]
                        }
                    ]
                },
                
                
            ]
            $scope.listRujukan2 = [
                {
                    "id": 1,
                    "nama": "5. Kebutuhan Tidur",
                    "detail": [
                        {
                            "id": 1901301520,
                            "nama": "Tidak ada gangguan",
                            "type":"checkbox"
                        },
                        {
                            "id": 1901301521,
                            "nama": "Sering terjaga",
                            "type": "checkbox"
                        },
                        {
                            "id": 1901301522,
                            "nama": "Perubahan pola tidur",
                            "type": "checkbox"
                        },
                        {
                            "id": 1901301523,
                            "nama": "tidur malam pukul : ",
                            "type": "checkboxtime",
                            "idd": 1901301524,
                            "iddd": 1901301525
                        },
                        {
                            "id": 1901301526,
                            "nama": "tidur siang pukul :",
                            "type": "checkboxtime",
                            "idd": 1901301527,
                            "iddd": 1901301528
                        },
                        {
                            "id": 1901301529,
                            "nama": "Kesulitan memulai tidur",
                            "type": "checkbox"
                        },
                        {
                            "id": 1901301530,
                            "nama": "Ketidakpuasan tidur",
                            "type": "checkbox"
                        },
                        {
                            "id": 1901301531,
                            "nama": "Jelaskan",
                            "type": "checkboxtextbox",
                            "idd": 1901301532
                        }
                    ]
                }
            ]
            $scope.listPerawatanDiri = [
                {
                    "id": 1,
                    "nama": "6. Perawatan Mandi",
                    "detail": [
                        {
                        "id": 1,
                        "nama": "a. Mandi",
                        "detail": [{
                                "id": 1901301533,
                                "nama": "Mandiri",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301534,
                                "nama": "Bantuan Minimal",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301535,
                                "nama": "Bantuan Total",
                                "type": "checkbox"
                            }
                        ]
                    }, {
                        "id": 1,
                        "nama": "b. Toileting / eliminasi",
                        "detail": [{
                                "id": 1901301536,
                                "nama": "Mandiri",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301537,
                                "nama": "Bantuan Minimal",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301538,
                                "nama": "Bantuan Total",
                                "type": "checkbox"
                            }
                        ]
                    }, {
                        "id": 1,
                        "nama": "c. Berpakaian",
                        "detail": [{
                                "id": 1901301539,
                                "nama": "Mandiri",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301540,
                                "nama": "Bantuan Minimal",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301541,
                                "nama": "Bantuan Total",
                                "type": "checkbox"
                            }
                        ]
                    }, {
                        "id": 1,
                        "nama": "d. Makan",
                        "detail": [{
                                "id": 1901301542,
                                "nama": "Mandiri",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301543,
                                "nama": "Bantuan Minimal",
                                "type": "checkbox"
                            },
                            {
                                "id": 1901301544,
                                "nama": "Bantuan Total",
                                "type": "checkbox"
                            }
                        ]
                    }]
                }
            ]
            $scope.listMinumObat = [
                {
                    id:1,
                    nama: "7. Minum Obat",
                    detail: [
                        {
                            id: 1901301545,
                            nama: "Teratur",
                            type: "checkbox"
                        },
                        {
                            id: 1901301546,
                            nama: "Tidak Teratur",
                            type: "checkbox"
                        },
                        {
                            id: 1901301547,
                            nama: "Tidak minum",
                            type: "checkbox"
                        },
                        {
                            id: 1901301548,
                            nama: "Belum pernah berobat",
                            type: "checkbox"
                        },
                        {
                            id: 1901301647,
                            nama: "jelaskan",
                            type: "checkboxtextbox",
                            idd: 1901301648
                        }
                    ]
                }
            ]
            $scope.listKonsepDiri = [
                {
                    id:1,
                    nama: "8. Konsep Diri",
                    detail: [
                        {
                            id:1,
                            nama:"a. Gambaran diri / body image",
                            detail: [
                                { id: 1901301549, nama:"Mengungkapkan kecacatan", type:'checkbox'},
                                { id: 1901301550, nama:"Kehilangan bagian tubuh", type:'checkbox'},
                                { id: 1901301551, nama:"Fungsi atau struktur tubuh berubah atau hilang", type:'checkbox'},
                                { id: 1901301552, nama:"Jelaskan", type:'checkboxtextbox', idd:1901301553},
                            ]
                        },
                        {
                            id:1,
                            nama:"b. Identitas / identity",
                            detail: [
                                { id: 1901301554, nama:"Menolak dirinya sesuai jenis kelamin", type:'checkbox'},
                                { id: 1901301555, nama:"Penampilan tidak sesuai jenis kelamin", type:'checkbox'},
                                { id: 1901301556, nama:"Jelaskan", type:'checkboxtextbox', idd:1901301557},
                            ]
                        },
                        {
                            id:1,
                            nama:"c. Peran / role",
                            detail: [
                                { id: 1901301558, nama:"Overload peran", type:'checkbox'},
                                { id: 1901301559, nama:"Perubahan peran", type:'checkbox'},
                                { id: 1901301560, nama:"Transisi peran karena sakit", type:'checkbox'},
                                { id: 1901301561, nama:"Konflik peran", type:'checkbox'},
                                { id: 1901301562, nama:"Keraguan Peran", type:'checkbox'},
                                { id: 1901301563, nama:"Jelaskan", type:'checkboxtextbox', idd:1901301564},
                            ]
                        },
                        {
                            id:1,
                            nama:"d. Ideal diri / self ideal",
                            detail: [
                                { id: 1901301565, nama:"Masa depan suram", type:'checkbox'},
                                { id: 1901301566, nama:"Terserah pada nasib", type:'checkbox'},
                                { id: 1901301567, nama:"Tidak memiliki harapan", type:'checkbox'},
                                { id: 1901301568, nama:"Enggan membicarakan masa depan", type:'checkbox'},
                                { id: 1901301569, nama:"Jelaskan", type:'checkboxtextbox', idd:1901301570},
                            ]
                        },
                        {
                            id:1,
                            nama: "e. Harga diri / self esteem",
                            detail: [
                                { id: 1901301571, nama:"Menilai diri negative ( misal : tidak berguna )", type:'checkbox'},
                                { id: 1901301572, nama:"Merasa malu / bersalah", type:'checkbox'},
                                { id: 1901301573, nama:"Merasa tidak mampu melakukan apapun", type:'checkbox'},
                                { id: 1901301574, nama:"Meremehkan kemampuan mengatasi masalah", type:'checkbox'},
                                { id: 1901301575, nama:"Merasa tidak memiliki kelebihan atau kemampuan positif", type:'checkbox'},
                                { id: 1901301576, nama:"Melebih-lebihkan penilaian negatif tentang diri sendiri", type:'checkbox'},
                                { id: 1901301577, nama:"Menolak penilaian positif diri sendiri", type:'checkbox'},
                                { id: 1901301578, nama:"Jelaskan", type:'checkboxtextbox', idd:1901301579},
                            ]
                        },
                    ]
                }
            ]
            $scope.listSosialisasi = [
                {
                    id:1,
                    nama: '9. Sosilisasi',
                    detail: [
                        {id:1901301580, nama:'Menarik diri', type:'checkbox'},
                        {id:1901301581, nama:'Berperan aktif', type:'checkbox'},
                        {id:1901301582, nama:'Perilaku tidak dapat diterima lingkungan', type:'checkbox'},
                        {id:1901301583, nama:'tidak puas dalam hubungan sosial', type:'checkbox'},
                        {id:1901301584, nama:'Merasa berbeda dengan orang lain', type:'checkbox'},
                        {id:1901301585, nama:'Tidak percaya diri saat berhadapan dengan orang lain', type:'checkbox'},
                        {id:1901301586, nama:'Riwayat ditolak lingkungan sosial', type:'checkbox'},
                        {id:1901301587, nama:'Merasa ingin sendiri', type:'checkbox'},
                        {id:1901301588, nama:'Merasa tidak nyaman / aman dilingkungan sosial', type:'checkbox'},
                        {id:1901301589, nama:'Tidak berminat / menolak interaksi dengan orang lain', type:'checkbox'},

                    ]
                }
            ]
            $scope.listKebutuhanSpiritual = [
                {
                    id:1,
                    nama: '10. Kebutuhan Spritual',
                    detail: [
                        {
                            id: 1901301590,
                            nama: "a. Nilai dan keyakinan yang dianut",
                            type: "textbox",
                        },
                        {
                            id: 1901301591,
                            nama: "b. Kegiatan ibadah di rumah",
                            type: "textbox",
                        }
                    ]
                }
            ]
            $scope.listMekanismeKopingIndividu = [
                {
                    id:1,
                    nama: 'Adaptif',
                    detail: [
                        {
                            id:1901301592,
                            nama: 'Mampu menyelesaikan masalah',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301593,
                            nama: 'Bicara dengan orang lain',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301594,
                            nama: 'Aktifitas Konstruktif',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301595,
                            nama: 'Teknik relaksasi',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301596,
                            nama: 'Olahraga',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301597,
                            nama: 'Jelaskan',
                            type: 'checkboxtextbox',
                            idd: 1901301598
                        }
                    ]
                },
                {
                    id:1,
                    nama: 'Meladaptif',
                    detail: [
                        {
                            id: 1901301599,
                            nama: "Menciderai diri dan orang lain",
                            type: 'checkbox'
                        },
                        {
                            id: 1901301600,
                            nama: 'Mengindar',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301601,
                            nama: 'Bekerja berlebihan',
                            type: 'checkbox'
                        }
                    ]
                }
            ]
            $scope.listKeluarga = [
                {
                    id:1, 
                    nama:'12. Keluarga',
                    detail: [
                        {
                            id:1901301602,
                            nama: 'Tidak memahami masalah kesehatan pasien',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301603,
                            nama: 'Peningkatan gejala pada pasien',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301604,
                            nama: 'Kegagalan mengurangi faktor risiko kekambuhan',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301605,
                            nama: 'Penolakan keluarga terhadap pasien',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301606,
                            nama: 'Kurang perhatian pada penyakit pasien',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301607,
                            nama: 'Ketidaktertarikan keluarga terhadap penyakit pasien dan perawatannya',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301608,
                            nama: 'Mengungkapkan keuslitan dalam melakukan perawatan',
                            type: 'checkbox'
                        },
                        {
                            id: 1901301609,
                            nama: 'Jelaskan',
                            type: 'checkboxtextbox',
                            idd: 1901301610
                        }
                    ]
                }
            ]
            $scope.listKebutuhanPerencanaanPulang = [
                {
                    id:1,
                    nama: '13. Kebutuhan Perencanaan Pulang',
                    detail: [
                        {
                            id:1,
                            nama: 'a. Kegiatan dalam rumah',
                            detail: [
                                {
                                    "id": 1,
                                    "nama": "1. Menyiapkan Makanan",
                                    "detail": [{
                                            "id": 1901301611,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301612,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301613,
                                            "nama": "Bantuan Total",
                                            "type": "checkbox"
                                        }
                                    ]
                                },
                                {
                                    "id": 1,
                                    "nama": "2. Perawatan Kesehatan",
                                    "detail": [{
                                            "id": 1901301614,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301615,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301616,
                                            "nama": "Bantuan Total",
                                            "type": "checkbox"
                                        }
                                    ]
                                },
                                {
                                    "id": 1,
                                    "nama": "3. Merawat Pakaian",
                                    "detail": [{
                                            "id": 1901301617,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301618,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301619,
                                            "nama": "Bantuan Total",
                                            "type": "checkbox"
                                        }
                                    ]
                                },
                                {
                                    "id": 1,
                                    "nama": "4. Merawat tempat tinggal",
                                    "detail": [{
                                            "id": 1901301620,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301621,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301622,
                                            "nama": "Bantuan Total",
                                            "type": "checkbox"
                                        }
                                    ]
                                },
                            ]
                        },
                        {
                            id: 2,
                            nama: 'b. Kegiatan diluar rumah',
                            detail: [{
                                    "id": 1,
                                    "nama": "1. Mengelola keuangan",
                                    "detail": [{
                                            "id": 1901301623,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301624,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301625,
                                            "nama": "Bantuan Total",
                                            "type": "checkbox"
                                        }
                                    ]
                                },
                                {
                                    "id": 1,
                                    "nama": "2. Melakukan transportasi",
                                    "detail": [{
                                            "id": 1901301626,
                                            "nama": "Mandiri",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301627,
                                            "nama": "Bantuan Minimal",
                                            "type": "checkbox"
                                        },
                                        {
                                            "id": 1901301628,
                                            "nama": "Jelaskan",
                                            "type": "checkboxtextbox",
                                            idd: 1901301629
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
            $scope.listMasalahKeperawatan = [
                {
                    id:1,
                    nama: 'MASALAH KEPERAWATAN',
                    detail: [
                        {
                            id:1,
                            nama: 'Masalah Keperawatan Umum',
                            detail: [
                                {
                                    id:1901301630,
                                    nama:'Bersihan jalan tidak efektif',
                                    type: 'checkbox'
                                },
                                {
                                    id:1901301631,
                                    nama: 'Gangguan ventilasi spontan',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301632,
                                    nama: 'Gangguan sirkulasi spontan',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301633,
                                    nama: 'Pola nafas tidak efektif',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301634,
                                    nama: 'Nyeri',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301635,
                                    nama: 'Ketidakstabilan gula darah',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301636,
                                    nama: 'Gangguan integritas kulit',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301637,
                                    nama: 'Hipertermia',
                                    type: 'checkbox'
                                }, 
                                {
                                    id: 1901301638,
                                    nama: 'Diare',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301639,
                                    nama: 'Hipovolemia',
                                    type: 'checkbox'
                                },
                                {
                                    id: 1901301640,
                                    nama: '',
                                    type: 'checkboxtextbox',
                                    idd: 1901301641
                                },
                                {
                                    id: 1901301642,
                                    nama: '',
                                    type: 'checkboxtextbox',
                                    idd: 1901301643
                                }
                            ]
                        }
                    ]
                }
            ]
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

        

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
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

                dataLoad = dat.data.data
            
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        if (dataLoad[i].type == 'radio' && dataLoad[i].emrdfk == 1901301512) {
                            $scope.item.obj[1901301512] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == 'radio' && dataLoad[i].emrdfk == 1901301518) {
                            $scope.item.obj[1901301518] = dataLoad[i].value

                        }
                        console.log($scope.item.obj[1901301512], $scope.item.obj[1901301518]);
                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == 21020553)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 3152)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == 21020630)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)

                        }
                        if (dataLoad[i].type == "checkbox") {
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
                $scope.item.obj[21020553] = $scope.totalSkor
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