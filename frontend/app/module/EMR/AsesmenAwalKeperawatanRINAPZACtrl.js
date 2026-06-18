define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperawatanRINAPZACtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000506
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000506).then(function (e) {

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
                        { "id": 3010301, "nama": "Tekanan darah", "satuan": "mmHg", "type": "textbox" },
                        { "id": 3010302, "nama": "Frekuensi nadi", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3010303, "nama": "Suhu", "satuan": "°C", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSkriningFungsional = [
                {
                    "id": 1,
                    "nama": "Skrining Fungsional",
                    "detail": [{
                            "id": 3010304,
                            "nama": "Alat Bantu",
                            "satuan": "",
                            "type": "textbox"
                        }, {
                            "id": 3010305,
                            "nama": "Prothesa",
                            "satuan": "",
                            "type": "textbox"
                        },
                        {
                            "nama": "ADL",
                            "type": "checkbox",
                            "details":[
                                {
                                    "id": 3010306,
                                    "nama": "Mandiri",
                                    "satuan": "",
                                    "type": "checkbox"
                                }, {
                                    "id": 3010307,
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
                        { "id": 3010308, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 3010309, "nama": "Ada, lokasi dan durasi", "satuan": "", "type": "textbox2", "idd": "3010310" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriNIPS = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3010313, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3010314, "nama": "1-2  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3010315, "nama": "3-4  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3010316, "nama": ">4   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriFlacc = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3010318, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3010319, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3010320, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3010321, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listAsesmenNyeriWong = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3010323, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3010324, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3010325, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3010326, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
             
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 3010327, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 3010328, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 3010329, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 3010330, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
                ]
            }
        ]
        $scope.listNyeriAnak = [
            {
                "id": 10, "nama": "Hurts", "detail": [
                { "id": 3010331, "nama": "Tidak Nyeri","nama1": "0", "descNilai": 0 },
                { "id": 3010332, "nama": "Sedikit Nyeri", "nama1": "1 2 3", "descNilai": 2 }, 
                { "id": 3010333, "nama": "Agak mengganggu", "nama1": "4", "descNilai": 4 },
                { "id": 3010334, "nama": "Mengganggu Aktivitas","nama1": "5 6 7",  "descNilai": 6}, 
                { "id": 3010335, "nama": "Sangat mengganggu", "nama1": "8", "descNilai": 8 },
                { "id": 3010335, "nama": "Tak tertahankan", "nama1": "9 10",  "descNilai": 10 }
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


            $scope.listAnak = [
                {
                    "id": 1, "nama": "humty dumpty anak",
                    "detail": [
                        { "id": 3010352, "nama": "Ringan", "satuan": "", "type": "checkbox" },
                        { "id": 3010353, "nama": "Sedang", "satuan": "", "type": "checkbox" },
                        { "id": 3010354, "nama": "Tinggi", "satuan": "", "type": "checkbox" },
                        { "id": 3010355, "nama": "Tidak (<=90)", "satuan": "", "type": "checkbox" },
                        { "id": 3010356, "nama": "Berisiko(>=90)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listDewasa = [
                {
                    "id": 1, "nama": "Morse dewasa",
                    "detail": [
                        { "id": 3010372, "nama": "Ringan", "satuan": "", "type": "checkbox" },
                        { "id": 3010373, "nama": "Sedang", "satuan": "", "type": "checkbox" },
                        { "id": 3010374, "nama": "Tinggi", "satuan": "", "type": "checkbox" },
                        { "id": 3010375, "nama": "Tidak (<=90)", "satuan": "", "type": "checkbox" },
                        { "id": 3010376, "nama": "Berisiko(>=90)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listJiwa = [
                {
                    "id": 1, "nama": "Edmoson Jiwa",
                    "detail": [
                        { "id": 3010396, "nama": "Ringan", "satuan": "", "type": "checkbox" },
                        { "id": 3010397, "nama": "Sedang", "satuan": "", "type": "checkbox" },
                        { "id": 3010398, "nama": "Tinggi", "satuan": "", "type": "checkbox" },
                        { "id": 3010399, "nama": "Tidak (<=90)", "satuan": "", "type": "checkbox" },
                        { "id": 3010400, "nama": "Berisiko(>=90)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listRisikoAnak = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 3000860, "nama": "Umur", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Jenis Kelamin", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Diagnosa", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Gangguan Kognitif", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Faktor Lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3000861, "nama": "Respon terhadap Operasi/Sedasi/Anestasi", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listEtiologi = [
                {
                    "id": 1, "nama": "Etiologi Penggunaan Zat",
                    "detail": [
                        { "id": 3010512, "nama": "Diajak teman", "satuan": "", "type": "checkbox" },
                        { "id": 3010513, "nama": "Dipaksa teman", "satuan": "", "type": "checkbox" },
                        { "id": 3010514, "nama": "Coba coba", "satuan": "", "type": "checkbox" },
                        { "id": 3010515, "nama": "Lainnya", "satuan": "Lainnya", "type": "textbox2", "idd": "3010516" },
                    ]
                }
            ] 

            // ============================================================
            // SKRINING GIZI MNA - GERIATRI (USIA > 60 TAHUN)
            // ID Range: 3010672 - 3010702
            // ============================================================
            $scope.listSkriningGiziMNA = [
                {
                    "no": "A",
                    "nama": "Apakah asupan makanan berkurang selama 3 bulan terakhir?",
                    "detail": [
                        { "id": 3010672, "nama": "0 = Asupan makanan sangat berkurang", "descNilai": 0 },
                        { "id": 3010673, "nama": "1 = Asupan makanan agak berkurang", "descNilai": 1 },
                        { "id": 3010674, "nama": "2 = Asupan makanan tidak berkurang", "descNilai": 2 }
                    ]
                },
                {
                    "no": "B",
                    "nama": "Berat badan turun selama 3 bulan terakhir?",
                    "detail": [
                        { "id": 3010675, "nama": "0 = Berat badan turun lebih dari 3 kg", "descNilai": 0 },
                        { "id": 3010676, "nama": "1 = Tidak tahu", "descNilai": 1 },
                        { "id": 3010677, "nama": "2 = Berat badan turun antara 1 hingga 3 kg", "descNilai": 2 },
                        { "id": 3010678, "nama": "3 = Berat badan tidak turun", "descNilai": 3 }
                    ]
                },
                {
                    "no": "C",
                    "nama": "Pergerakan atau Mobilitas?",
                    "detail": [
                        { "id": 3010679, "nama": "0 = Terbatas di tempat tidur atau kursi", "descNilai": 0 },
                        { "id": 3010680, "nama": "1 = Mampu bangun dari tempat tidur/kursi, tapi tidak bisa keluar", "descNilai": 1 },
                        { "id": 3010681, "nama": "2 = Dapat bepergian ke luar rumah", "descNilai": 2 }
                    ]
                },
                {
                    "no": "D",
                    "nama": "Mengalami tekanan psikologis atau penyakit akut (3 bln terakhir)?",
                    "detail": [
                        { "id": 3010682, "nama": "0 = Ya", "descNilai": 0 },
                        { "id": 3010683, "nama": "2 = Tidak", "descNilai": 2 }
                    ]
                },
                {
                    "no": "E",
                    "nama": "Gangguan neuropsikologis",
                    "detail": [
                        { "id": 3010684, "nama": "0 = Demensia berat atau depresi", "descNilai": 0 },
                        { "id": 3010685, "nama": "1 = Demensia ringan", "descNilai": 1 },
                        { "id": 3010686, "nama": "2 = Tidak ada gangguan psikologis", "descNilai": 2 }
                    ]
                },
                {
                    "no": "F1",
                    "nama": "Indeks Massa Tubuh (IMT)",
                    "detail": [
                        { "id": 3010687, "nama": "0 = IMT kurang dari 19", "descNilai": 0 },
                        { "id": 3010688, "nama": "1 = IMT 19 hingga kurang dari 21", "descNilai": 1 },
                        { "id": 3010689, "nama": "2 = IMT 21 hingga kurang dari 23", "descNilai": 2 },
                        { "id": 3010690, "nama": "3 = IMT 23 atau lebih besar", "descNilai": 3 }
                    ]
                },
                {
                    "no": "F2",
                    "nama": "Lingkar lengan atas (LiLA) - Jika IMT tidak dapat diukur",
                    "detail": [
                        { "id": 3010691, "nama": "0,0 = LiLA kurang dari 21", "descNilai": 0 },
                        { "id": 3010692, "nama": "0,5 = LiLA 21 hingga 22", "descNilai": 0.5 },
                        { "id": 3010693, "nama": "1,0 = LiLA lebih dari 22", "descNilai": 1 }
                    ]
                }
            ];

            $scope.getSkorMNA = function (opsi, detailOpsi) {
                // 1. Terapkan Single Selection (Mutual Exclusivity)
                for (var i = 0; i < detailOpsi.length; i++) {
                    if (detailOpsi[i].id !== opsi.id) {
                        $scope.item.obj[detailOpsi[i].id] = false;
                    }
                }
                // 2. Hitung Total Skor dari semua pertanyaan
                var totalSkor = 0;
                for (var a = 0; a < $scope.listSkriningGiziMNA.length; a++) {
                    var pertanyaan = $scope.listSkriningGiziMNA[a];
                    for (var b = 0; b < pertanyaan.detail.length; b++) {
                        var pilihan = pertanyaan.detail[b];
                        if ($scope.item.obj[pilihan.id] === true) {
                            totalSkor += parseFloat(pilihan.descNilai);
                        }
                    }
                }
                // 3. Simpan total skor ke model database (ID 3010702)
                $scope.item.obj[3010702] = totalSkor;
            };
            // ============================================================
            // END SKRINING GIZI MNA
            // ============================================================

            $scope.listRiwayatRehab = [
                {
                    "id": 1, "nama": "Riwayat Rehabilitasi sebelumnya",
                    "detail": [
                        { "id": 3010519, "nama": "Ya", "satuan": "Lainnya", "type": "textbox2", "idd": "3010520" },
                        { "id": 3010521, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            
            $scope.listRiwayatOverDosis = [
                {
                    "id": 1, "nama": "Riwayat Over Dosis",
                    "detail": [
                        { "id": 3010522, "nama": "Ya", "satuan": "Lainnya", "type": "textbox2", "idd": "3010523" },
                        { "id": 3010524, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listStatusFisik = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 3000825, "nama": "Tekanan darah", "satuan": "mmHg", "type": "textbox" },
                        { "id": 3000826, "nama": "Frekuensi nadi", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3000828, "nama": "Suhu", "satuan": "°C", "type": "textbox" },
                    ]
                }
            ]
            $scope.listPengukuranVital = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 3010543, "nama": "TD", "satuan": "mmHg", "type": "textbox" },
                        { "id": 3010544, "nama": "N", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 3010545, "nama": "S", "satuan": "°C", "type": "textbox" },
                        { "id": 3010546, "nama": "P", "satuan": "x/mnt", "type": "textbox"},
                    ]
                }
            ]
            $scope.listUkur = [
                {
                    "id": 1, "nama": "Ukur",
                    "detail": [
                        { "id": 3010547, "nama": "TB", "satuan": "cm", "type": "textbox" },
                        { "id": 3010548, "nama": "BB", "satuan": "kg", "type": "textbox" },
                    ]
                }
            ]
            $scope.listKeluhanFisik = [
                {
                    "id": 1, "nama": "Keluhan Fisik",
                    "detail": [
                        { "id": 3010549, "nama": "Sakit kepala", "satuan": "", "type": "checkbox" },
                        { "id": 3010550, "nama": "Mulut kering", "satuan": "", "type": "checkbox" },
                        { "id": 3010551, "nama": "Kesadaran menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3010552, "nama": "Merasa panas dingin", "satuan": "", "type": "checkbox" },
                        { "id": 3010553, "nama": "Mengantuk/banyak tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3010554, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                        { "id": 3010555, "nama": "Nyeri pada otot sendi/tulang", "satuan": "", "type": "checkbox" },
                        { "id": 3010556, "nama": "Mual Muntah", "satuan": "", "type": "checkbox" },
                        { "id": 3010557, "nama": "Insomnia", "satuan": "", "type": "checkbox" },
                        { "id": 3010558, "nama": "Diare", "satuan": "", "type": "checkbox" },
                        { "id": 3010559, "nama": "Jalan sempoyongan", "satuan": "", "type": "checkbox" },
                        { "id": 3010560, "nama": "Konstipasi", "satuan": "", "type": "checkbox" },
                        { "id": 3010561, "nama": "Nafsu makan menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3010562, "nama": "Mata berair", "satuan": "", "type": "checkbox" },
                        { "id": 3010563, "nama": "Tremor pada ekstremitas", "satuan": "", "type": "checkbox" },
                        { "id": 3010564, "nama": "Hidung berair", "satuan": "", "type": "checkbox" },
                        { "id": 3010565, "nama": "Bicara cadel", "satuan": "", "type": "checkbox" },
                        { "id": 3010566, "nama": "Bulu roma berdiri", "satuan": "", "type": "checkbox" },
                        { "id": 3010567, "nama": "Berkeringat banyak", "satuan": "", "type": "checkbox" },
                        { "id": 3010568, "nama": "Denyut jantung cepat", "satuan": "", "type": "checkbox" },
                        { "id": 3010569, "nama": "Kesadaran menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3010570, "nama": "Kram perut", "satuan": "", "type": "checkbox" },
                        { "id": 3010571, "nama": "Nafsu makan meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3010572, "nama": "Batuk", "satuan": "", "type": "checkbox" },
                        { "id": 3010573, "nama": "Pupil melebar", "satuan": "", "type": "checkbox" },
                        { "id": 3010574, "nama": "Sesak nafas", "satuan": "", "type": "checkbox" },
                        { "id": 3010575, "nama": "Hematuri", "satuan": "", "type": "checkbox" },
                        { "id": 3010576, "nama": "Anuria", "satuan": "", "type": "checkbox" },
                        { "id": 3010577, "nama": "Lainnya", "satuan": "Lainnya", "type": "textbox2", "idd": "3010578" },
                    ]
                }
            ] 
            $scope.listTinggal = [
                {
                    "id": 1, "nama": "Tinggal",
                    "detail": [
                        { "id": 3010580, "nama": "Dengan Keluarga", "satuan": "", "type": "checkbox" },
                        { "id": 3010581, "nama": "Sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3010582, "nama": "Dengan teman", "satuan": "", "type": "checkbox" },
                        { "id": 3010583, "nama": "Lainnya", "satuan": "Lainnya", "type": "textbox2", "idd": "3010584" },
                    ]
                }
            ] 
            $scope.listMenggunakanNAPZA = [
                {
                    "id": 1, "nama": "Adakah anggota keluarga yang menggunakan NAPZA",
                    "detail": [
                        { "id": 3010585, "nama": "Ada, Yaitu", "satuan": "Lainnya", "type": "textbox2", "idd": "3010586" },
                        { "id": 3010587, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPsikososial = [
                {
                    "id": 1, "nama": "Riwayat masalah ",
                    "detail": [
                        { "id": 3010588, "nama": "Masalah sekolah", "satuan": "", "type": "textbox",'idd':3010669 },
                        { "id": 3010589, "nama": "Masalah Pekerjaan", "satuan": "", "type": "textbox",'idd':3010670 },
                        { "id": 3010590, "nama": "Konflik Sosial", "satuan": "", "type": "textbox",'idd':3010671 },
                    ]
                }
            ] 
            $scope.listMotorik = [
                {
                    "id": 1, "nama": "Status Motorik",
                    "detail": [
                        { "id": 3010591, "nama": "Tenang", "satuan": "", "type": "checkbox" },
                        { "id": 3010592, "nama": "Tegang", "satuan": "", "type": "checkbox" },
                        { "id": 3010593, "nama": "Gelisah", "satuan": "", "type": "checkbox" },
                        { "id": 3010594, "nama": "Lain-lain :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010595" },
                    ]
                }
            ] 
            $scope.listPerasaan = [
                {
                    "id": 1, "nama": "Alam Perasaan",
                    "detail": [
                        { "id": 3010596, "nama": "Sedih", "satuan": "", "type": "checkbox" },
                        { "id": 3010597, "nama": "Gembira", "satuan": "", "type": "checkbox" },
                        { "id": 3010598, "nama": "Khawatir", "satuan": "", "type": "checkbox" },
                        { "id": 3010599, "nama": "Putus asa", "satuan": "", "type": "checkbox" },
                        { "id": 3010600, "nama": "Lain-lain :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010601" },
                    ]
                }
            ] 
           
            $scope.listAfek = [
                {
                    "id": 1, "nama": "Afek",
                    "detail": [
                        { "id": 3010602, "nama": "Sesuai", "satuan": "", "type": "checkbox" },
                        { "id": 3010603, "nama": "Datar", "satuan": "", "type": "checkbox" },
                        { "id": 3010604, "nama": "Tumpul", "satuan": "", "type": "checkbox" },
                        { "id": 3010605, "nama": "Tidak sesuai", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKonsepDiri = [
                {
                    "id": 1, "nama": "Konsep Diri",
                    "detail": [
                        { "id": 3010606, "nama": "Gambaran diri :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010607" },
                        { "id": 3010608, "nama": "Peran :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010609" },
                        { "id": 3010610, "nama": "Identitas :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010611" },
                        { "id": 3010612, "nama": "Ideal diri :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010613" },
                        { "id": 3010614, "nama": "Harga Diri :", "satuan": "Lainnya", "type": "textbox2", "idd": "3010615" },
                    ]
                }
            ]
            $scope.listInteraksi = [
                {
                    "id": 1, "nama": "Interaksi selama wawancara",
                    "detail": [
                        { "id": 3010616, "nama": "Kooperatif", "satuan": "", "type": "checkbox" },
                        { "id": 3010617, "nama": "Tidak kooperatif", "satuan": "", "type": "checkbox" },
                        { "id": 3010618, "nama": "Kontak mata", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listHalusinasi = [
                {
                    "id": 1, "nama": "Persepsi Halusinasi",
                    "detail": [
                        { "id": 3010619, "nama": "Ada, Yaitu", "satuan": "Lainnya", "type": "textbox2", "idd": "3010620" },
                        { "id": 3010621, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listProsesPikir = [
                {
                    "id": 1, "nama": "Proses pikir",
                    "detail": [
                        { "id": 3010622, "nama": "Ada, Yaitu", "satuan": "Lainnya", "type": "textbox2", "idd": "3010623" },
                        { "id": 3010624, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listIsiPikir = [
                {
                    "id": 1, "nama": "Isi Pikir",
                    "detail": [
                        { "id": 3010625, "nama": "Ada, Yaitu", "satuan": "Lainnya", "type": "textbox2", "idd": 3010626 },
                        { "id": 3010627, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listTingkatKesadaran = [
                {
                    "id": 1, "nama": "Tingkat Kesadaran",
                    "detail": [
                        { "id": 3010628, "nama": "Disorientasi", "satuan": "", "type": "checkbox" },
                        { "id": 3010629, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listGangguanMemori = [
                {
                    "id": 1, "nama": "Gangguan Memori dan Konsentrasi",
                    "detail": [
                        { "id": 3010630, "nama": "Ada, Yaitu", "satuan": "Lainnya", "type": "textbox2", "idd": "3010631" },
                        { "id": 3010632, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listPenilaian = [
                {
                    "id": 1, "nama": "Kemampuan Penilaian",
                    "detail": [
                        { "id": 3010633, "nama": "Ringan", "satuan": "", "type": "checkbox" },
                        { "id": 3010634, "nama": "Bermakna", "satuan": "", "type": "checkbox" },
                        { "id": 3010635, "nama": "Jelaskan", "satuan": "Lainnya", "type": "textbox2", "idd": "3010636" },
                    ]
                }
            ] 
            $scope.listDayaTilik = [
                {
                    "id": 1, "nama": "Daya Tilik Diri",
                    "detail": [
                        { "id": 3010637, "nama": "Mengingkari penyakit yang didera", "satuan": "", "type": "checkbox" },
                        { "id": 3010638, "nama": "Menyalahkan hal hal yang diluar dirinya", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKoping = [
                {
                    "id": 1, "nama": "Mekanisme Koping",
                    "detail": [
                        { "id": 3010639, "nama": "Adaptif", "satuan": "", "type": "checkbox" },
                        { "id": 3010640, "nama": "Mal Adaptif", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKebutuhanPulang = [
                {
                    "id": 1, "nama": "Kebutuhan Perencanaan Pulang",
                    "detail": [
                        { "id": 3010641, "nama": "Pengetahuan Keluarga", "satuan": "", "type": "checkbox" },
                        { "id": 3010642, "nama": "Penyebab pemakaian zat adiktif", "satuan": "", "type": "checkbox" },
                        { "id": 3010643, "nama": "Akibat pemakaian zat adiktif", "satuan": "", "type": "checkbox" },
                        { "id": 3010644, "nama": "Faktor pencetus pemakaian kembali", "satuan": "", "type": "checkbox" },
                        { "id": 3010645, "nama": "Komplikasi akibat pemakaian zat adiktif", "satuan": "", "type": "checkbox" },
                        { "id": 3010646, "nama": "Obat obatan / terapi medis", "satuan": "", "type": "checkbox" },
                        { "id": 3010647, "nama": "Koping adaptif", "satuan": "", "type": "checkbox" },
                        { "id": 3010648, "nama": "Cara mengatasi sugesti craving", "satuan": "", "type": "checkbox" },
                        { "id": 3010649, "nama": "Sistem pendukung kesembuhan ", "satuan": "", "type": "checkbox" },
                        { "id": 3010650, "nama": "Jelaskan", "satuan": "Lainnya", "type": "textbox2", "idd": "3010651" },
                       
                    ]
                }
            ] 
            $scope.listAspekMedik = [
                {
                    "id": 1, "nama": "Aspek Medik",
                    "detail": [
                        { "id": 3000918, "nama": "Diagnosa Medis :", "satuan": "Lainnya", "type": "textbox2", "idd": "3000919" },
                        { "id": 3000918, "nama": "Terapi Medik :", "satuan": "Lainnya", "type": "textbox2", "idd": "3000919" },
                    ]
                }
            ] 
            $scope.listDiagnosaKeperawatan = [
                {
                    "id": 1, "nama": "Daftar Diagnosa keperawatan",
                    "detail": [
                        { "id": 3010663, "nama": "1. ", "satuan": "", "type": "textbox" },
                        { "id": 3010664, "nama": "2. ", "satuan": "", "type": "textbox" },
                        { "id": 3010665, "nama": "3. ", "satuan": "", "type": "textbox" },
                        { "id": 3010666, "nama": "4. ", "satuan": "", "type": "textbox" },
                        { "id": 3010667, "nama": "5. ", "satuan": "", "type": "textbox" },
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
                    "id": 1,  "no": 1, "nama":"Nafsu Makan",
                    "detail": [
                        { "id": 3010403, "nama": "a. Nafsu makan baik", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010404, "nama": "b. Intake makanan kurang/sisa makanan < 1/2 porsi ", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3010405, "nama": "c. Tidak ada nafsu makan > 24 jam ", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Kemampuan untuk makan",
                    "detail": [
                        { "id": 3010406, "nama": "a. Tidak ada kesulitan makan, tidak diare/muntah", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010407, "nama": "b. Ada masalah makan, sering muntah, diare ringan", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3010408, "nama": "c. Butuh bantuan makan, muntah sedang, diare 1-2 kali sehari", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3010409, "nama": "d. Tidak dapat makan secara oral, disfagia, muntah berat diare 2 kali sehari", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 3, "nama": "Faktor stress",
                    "detail": [
                        { "id": 3010410, "nama": "a. Tidak ada", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010411, "nama": "b. Pembedahan ringan atau ada infeksi", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3010412, "nama": "c. Penyakit kronik, gastrointestinal, inflamatory bowel disease", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3010413, "nama": "d. Luka bakar, patah tulang, sepsis, penyakit malignancy", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 4, "nama": "Persentil BB",
                    "detail": [
                        { "id": 3010414, "nama": "a. BB/TB sesuai standar", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010415, "nama": "b. 90 - 99% BB/TB", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3010416, "nama": "c. 80 - 90% BB/TB", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3010417, "nama": "d. < 79% BB/TB", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 3010419, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010420, "nama": "b. Ragu ragu", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 3010421, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3010422, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3010423, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 3010424, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 3010425, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 3010426, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3010427, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 3010431, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 3010432, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        { "id": 3010433, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 3010434, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        { "id": 3010435, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 3010436, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3010437"},
                    ]
                }
            ]
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3010429, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3010430, "nama": "Tidak", "satuan": "", "type": "checkbox" },
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
                        if(dataLoad[i].type == 'textbox2'){
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
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
                    $scope.item.obj[3010327] = true
                    $scope.item.obj[3010328] = false
                    $scope.item.obj[3010329] = false
                    $scope.item.obj[3010330] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[3010327] = false
                    $scope.item.obj[3010328] = true   
                    $scope.item.obj[3010329] = false
                    $scope.item.obj[3010330] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[3010327] = false
                    $scope.item.obj[3010328] = false
                    $scope.item.obj[3010329] = true
                    $scope.item.obj[3010330] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[3010327] = false
                    $scope.item.obj[3010328] = false
                    $scope.item.obj[3010329] = false
                    $scope.item.obj[3010330] = true
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

                $scope.item.obj[3010418] = $scope.skorNutrisi
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
                $scope.item.obj[3010428] = $scope.skorNutrisiDewasa
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
                $scope.item.obj[3010418] = $scope.skorNutrisiAnak
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
                //jumlah1
                let tgl1 = parseInt($scope.item.obj[3010338]) || 0;
                let tgl2 = parseInt($scope.item.obj[3010340]) || 0;
                let tgl3 = parseInt($scope.item.obj[3010342]) || 0;
                let tgl4 = parseInt($scope.item.obj[3010344]) || 0;
                let tgl5 = parseInt($scope.item.obj[3010346]) || 0;
                let tgl6 = parseInt($scope.item.obj[3010348]) || 0;
                let tgl7 = parseInt($scope.item.obj[3010350]) || 0;
                let jumlah1 =  tgl1+tgl2+tgl3+tgl4+tgl5+tgl6+tgl7;
                $scope.item.obj[3010351] = jumlah1;

                let tgl8 = parseInt($scope.item.obj[3010358]) || 0;
                let tgl9 = parseInt($scope.item.obj[3010360]) || 0;
                let tgl10 = parseInt($scope.item.obj[3010362]) || 0;
                let tgl11 = parseInt($scope.item.obj[3010364]) || 0;
                let tgl12 = parseInt($scope.item.obj[3010366]) || 0;
                let tgl13 = parseInt($scope.item.obj[3010368]) || 0;
                let tgl14 = parseInt($scope.item.obj[3010370]) || 0;
                let jumlah2 =  tgl8+tgl9+tgl10+tgl11+tgl12+tgl13+tgl14;
                $scope.item.obj[3010371] = jumlah2;

                let tgl16 = parseInt($scope.item.obj[3010378]) || 0;
                let tgl17 = parseInt($scope.item.obj[3010380]) || 0;
                let tgl18 = parseInt($scope.item.obj[3010382]) || 0;
                let tgl19 = parseInt($scope.item.obj[3010384]) || 0;
                let tgl20 = parseInt($scope.item.obj[3010386]) || 0;
                let tgl21 = parseInt($scope.item.obj[3010388]) || 0;
                let tgl22 = parseInt($scope.item.obj[3010390]) || 0;
                let tgl23 = parseInt($scope.item.obj[3010392]) || 0;
                let tgl24 = parseInt($scope.item.obj[3010394]) || 0;
                let jumlah3 =  tgl16+tgl17+tgl18+tgl19+tgl20+tgl21+tgl22+tgl23+tgl24;
                $scope.item.obj[3010395] = jumlah3;
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
                toastr.info('EMR akan segera tersimpan. Harap tunggu!')
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'AsesmenAwalKeperawatanRINAPZACtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
