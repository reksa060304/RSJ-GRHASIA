define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenMedisRJCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            var nomorEMR = '-'
            $scope.cc.emrfk = 227
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
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 227).then(function (e) {

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
            $scope.listRujukan = [
                {
                    "id": 1, "nama": "Anamnesa",
                    "detail": [
                        { "id": 21000019, "nama": "Auto anamnesa ", "type": "checkbox" },
                        { "id": 21000020, "nama": "Allo anamnesa ", "type": "checkbox" },
                        { "id": 21000021, "nama": "Keluarga ", "type": "checkbox2" },
                        { "id": 21000022, "nama": "Penerjemah bahasa", "type": "checkbox2" },
                        { "id": 21000023, "nama": "Orang lain ", "type": "checkbox2" },
                        { "id": 21000024, "nama": "Nama :", "type": "textbox" },
                        { "id": 21000025, "nama": "Hubungan :", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Cara Masuk",
                    "detail": [
                        { "id": 21000026, "nama": "Jalan tanpa bantuan ", "type": "checkbox3" },
                        { "id": 21000027, "nama": "Jalan dengan bantuan", "type": "checkbox3" },
                        { "id": 21000028, "nama": "Tempat tidur dorong", "type": "checkbox3" },
                        { "id": 21000029, "nama": "Lain-lain", "type": "textbox" }
                    ]
                },
                {
                    "id": 1, "nama": "Asal Masuk",
                    "detail": [
                        { "id": 21000030, "nama": "Non Rujukan", "type": "checkbox3" },
                        { "id": 21000031, "nama": "Rujukan", "type": "checkbox3" },
                    ]
                },
                {
                    "id": 1, "nama": "Alasan Masuk",
                    "detail": [
                        { "id": 21000032, "nama": "", "type": "textarea" },
                    ]
                },
            ]
            $scope.listRujukan2 = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 21000043, "nama": "Pola Makan : ","satuan" : "x/hari", "type": "textbox2" },
                        { "id": 21000044, "nama": "Pola minum : ","satuan" : "cc/hari", "type": "textbox2" },
                        { "id": 21000045, "nama": "BAK : ","satuan" : "x/hari", "type": "textbox2" },
                        { "id": 21000046, "nama": "BAB : ","satuan" : "x/hari", "type": "textbox2" },
                        // { "id": 116064, "nama": "Pola Minum ","satuan" : "cc/hari", "type": "textbox2" },
                        // { "id": 116065, "nama": "BAK ","satuan" : "x/hari", "type": "textbox2" },
                        // { "id": 116066, "nama": "BAB","satuan" : "x/hari", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "id": 21000047, "nama": "Cemas","satuan" : "x/hari", "type": "checkbox3" },
                        { "id": 21000048, "nama": "Takut ","satuan" : "cc/hari", "type": "checkbox3" },
                        { "id": 21000049, "nama": "Marah ","satuan" : "x/hari", "type": "checkbox3" },
                        { "id": 21000050, "nama": "Sedih ","satuan" : "x/hari", "type": "checkbox3" },
                        { "id": 21000051, "nama": "Kecenderugan Bunuh diri ","satuan" : "x/hari", "type": "checkbox3" },
                        { "id": 21000052, "nama": "dll :", "type": "textbox" },
                        // { "id": 116064, "nama": "Pola Minum ","satuan" : "cc/hari", "type": "textbox2" },
                        // { "id": 116065, "nama": "BAK ","satuan" : "x/hari", "type": "textbox2" },
                        // { "id": 116066, "nama": "BAB","satuan" : "x/hari", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "id": 21000053, "nama": "Wiraswasta", "type": "checkbox3" },
                        { "id": 21000054, "nama": "Pegawai Negeri", "type": "checkbox3" },
                        { "id": 21000055, "nama": "Pegawai Swasta", "type": "checkbox3" },
                        { "id": 21000056, "nama": "Tidak bekerja", "type": "checkbox3" },
                        { "id": 21000057, "nama": "Siswa/Mahasiswa", "type": "checkbox3" },
                        { "id": 21000058, "nama": "Pensiun", "type": "checkbox3" },
                        { "id": 21000059, "nama": "Alamat Rumah", "type": "textarea" },
                        { "id": 21000060, "nama": "No.Telp", "type": "textarea" },    
                        // { "id": 116064, "nama": "Pola Minum ","satuan" : "cc/hari", "type": "textbox2" },
                        // { "id": 116065, "nama": "BAK ","satuan" : "x/hari", "type": "textbox2" },
                        // { "id": 116066, "nama": "BAB","satuan" : "x/hari", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Spiritual dan Kultural",
                    "detail": [
                        { "id": 2121212, "nama": "agama", "type": "label" },
                        { "id": 21000061, "nama": "Islam", "type": "checkbox3" },
                        { "id": 21000062, "nama": "Protestan", "type": "checkbox3" },
                        { "id": 21000063, "nama": "Hindu", "type": "checkbox3" },
                        { "id": 21000064, "nama": "Khatolik", "type": "checkbox3" },
                        { "id": 21000065, "nama": "Budha", "type": "checkbox3" },
                        { "id": 21000066, "nama": "Konghucu", "type": "checkbox3" },
                        { "id": 21000067, "nama": "Lain-lain", "type": "textbox" }, 
                        { "id": 21212121, "nama": "Kegiatan Spiritual dan nilai-nilai Kepercayaan ", "type": "label" },
                        { "id": 21000068, "nama": "Ada", "type": "checkbox3" },
                        { "id": 21000069, "nama": "Tidak Ada", "type": "checkbox3" }, 
                        { "id": 21000070, "nama": "Sebutkan", "type": "textbox" }, 
                        { "id": 21212121, "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 21000071, "nama": "Indonesia", "type": "checkbox3" },
                        { "id": 21000072, "nama": "Inggris", "type": "checkbox3" }, 
                        { "id": 21000073, "nama": "Daerah", "type": "checkbox3" }, 
                        { "id": 21000074, "nama": "Lain-lain", "type": "textbox" },  
                        // { "id": 116064, "nama": "Pola Minum ","satuan" : "cc/hari", "type": "textbox2" },
                        // { "id": 116065, "nama": "BAK ","satuan" : "x/hari", "type": "textbox2" },
                        // { "id": 116066, "nama": "BAB","satuan" : "x/hari", "type": "textbox2" },
                    ]
                },
            ]
            $scope.listRujukan3 = [
                {
                    "id": 1, "nama": "Cara Pembayaran",
                    "detail": [
                        { "id": 21000075, "nama": "Pribadi ", "type": "checkbox3" },
                        { "id": 21000076, "nama": "Perusahaan", "type": "checkbox3" },
                        { "id": 21000077, "nama": "Asuransi ", "type": "checkbox3" },
                    ]
                },
                {
                    "id": 1, "nama": "Pendapatan",
                    "detail": [
                        { "id": 21000078, "nama": "UMR", "type": "checkbox2" },
                        { "id": 21000079, "nama": "UMR s/d 5 juta rp", "type": "checkbox2" },
                        { "id": 21000080, "nama": "5 s/d 10 juta rp", "type": "checkbox2" },
                        { "id": 21000081, "nama": "10 s/d 15 juta rp", "type": "checkbox2" },
                        { "id": 21000082, "nama": "> 15 juta rp", "type": "checkbox2" }
                    ]
                },
                {
                    "id": 1, "nama": "Asal Masuk",
                    "detail": [
                        { "id": 21000083, "nama": "Non Rujukan", "type": "checkbox3" },
                        { "id": 21000084, "nama": "Rujukan", "type": "checkbox3" },
                    ]
                },
                {
                    "id": 1, "nama": "Alasan Masuk",
                    "detail": [
                        { "id": 21000085, "nama": "", "type": "textarea" },
                    ]
                },
            ]
            $scope.listKonsep5 = [
                {
                    "id": 1, "nama": "4. Riwayat Alergi",
                    "detail": [
                        { "id": 21000088, "nama": "Ya", "type": "checkbox" }, 
                        { "id": 21000089, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21000090, "nama": "Sebutan", "type": "textbox" }, 
                        { "id": 21000091, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "textbox" },                 
                    ]
                }
            ]
            $scope.listNyeri3 = [{
                "id": 1, "nama": "Provokatif",
                "detail": [
                    { "id": 21000104, "nama": "Ruda Paksa", "type": "checkbox" },
                    { "id": 21000105, "nama": "Benturan", "type": "checkbox" },
                    { "id": 21000106, "nama": "Sayatan", "type": "checkbox" },
                    { "id": 21000107, "nama": "dll", "type": "textbox" },
                ]
            },
            {
                "id": 1, "nama": "Quality",
                "detail": [
                    { "id": 21000108, "nama": "Tertusuk", "type": "checkbox" },
                    { "id": 21000109, "nama": "Tertekan/Tertindih", "type": "checkbox" },
                    { "id": 21000110, "nama": "Diiris-iris", "type": "checkbox" },
                    { "id": 21000111, "nama": "dll", "type": "textbox" },
                ]
            },
            {
                "id": 1, "nama": "menjalar",
                "detail": [
                    { "id": 21000112, "nama": "Ya", "type": "checkbox" },
                    { "id": 21000113, "nama": "Tidak", "type": "checkbox" },
                    { "id": 21000114, "nama": "ke :", "type": "textbox" },
                ]
            },
            {
                "id": 1, "nama": "Scala",
                "detail": [
                    { "id": 21000115, "nama": "ke :", "type": "textbox" },
                ]
            },
            {
                "id": 1, "nama": "Time",
                "detail": [
                    { "id": 21000116, "nama": "Jarang", "type": "checkbox" },
                    { "id": 21000117, "nama": "Hilang/Timbul", "type": "checkbox" },
                    { "id": 21000118, "nama": "Terus-Menerus", "type": "checkbox" },
                ]
            }
            ]
            $scope.listStatusFungsional = [
                {
                    "id": 1, "nama": "Penglihatan :",
                    "detail": [
                        { "id": 21000139, "nama": "Normal ", "type": "checkbox" },
                        { "id": 21000140, "nama": "Kabur ", "type": "checkbox" },
                        { "id": 21000141, "nama": "Kacamata ", "type": "checkbox" },
                        { "id": 21000142, "nama": "Lensa Kontak ", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Penciuman :",
                    "detail": [
                        { "id": 21000143, "nama": "Normal ", "type": "checkbox" },
                        { "id": 21000144, "nama": "Tidak ", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Pendenganran :",
                    "detail": [
                        { "id": 21000145, "nama": "Normal ", "type": "checkbox" },
                        { "id": 21000146, "nama": "Tuli Kanan/Kiri ", "type": "checkbox" },
                        { "id": 21000147, "nama": "Alat Bantu dengan kanan/kiri ", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif :",
                    "detail": [
                        { "id": 21000148, "nama": "Orientasi penuh ", "type": "checkbox" },
                        { "id": 21000149, "nama": "Bingung", "type": "checkbox" },
                        { "id": 21000150, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 21000151, "nama": "Tidak Dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Aktifitas Sehari-hari :",
                    "detail": [
                        { "id": 21000152, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 21000153, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 21000155, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 21000154, "nama": "Ketergantungan Total", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Berjalan :",
                    "detail": [
                        { "id": 21000156, "nama": "Tidak Ada Kesulitan", "type": "checkbox" },
                        { "id": 21000157, "nama": "Perlu Bantuan", "type": "checkbox" },
                        { "id": 21000158, "nama": "Sering Jatuh ", "type": "checkbox" },
                        { "id": 21000159, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listRiwayatPerkembangan = [
                {
                    "id": 1, "nama": "1. Status Pekerjaan",
                    "detail": [
                        { "id": 116090, "nama": "Tidak Bekerja ", "type": "checkbox" },
                        { "id": 116091, "nama": "Bekerja", "type": "checkbox" },
                        { "id": 116092, "nama": "Sebutkan ", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "2. Status Pernikahan",
                    "detail": [
                        { "id": 116093, "nama": "Belum Menikah ", "type": "checkbox" },
                        { "id": 116094, "nama": "Menikah", "type": "checkbox" },
                        { "id": 116095, "nama": "Cerai/Pisah Meninggal ", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "3. Hubungan dengan anggota keluarga atau orang lain",
                    "detail": [
                        { "id": 116096, "nama": "Baik, Harmonis ", "type": "checkbox" },
                        { "id": 116097, "nama": "Tidak Baik", "type": "checkbox" },
                        { "id": 116098, "nama": "Sebutkan ", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "4. Ganggaun Psikologis",
                    "detail": [
                        { "id": 116099, "nama": "Tidak ada ", "type": "checkbox" },
                        { "id": 116100, "nama": "Cemas/Depresi/Marah", "type": "checkbox" },
                        { "id": 116101, "nama": "Lainnya ", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Nilai dan Kepercayaan",
                    "detail": [
                        { "id": 116102, "nama": "", "type": "textarea" },
                    ]
                }
            ] 
            $scope.listRiwayatPerkembangan2 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 116110, "nama": "BB ", "type": "textbox" },
                        { "id": 116111, "nama": "TB ", "type": "textbox" },
                    
                    ]
                },
                {
                    "id": 1, "nama": "Status Gizi",
                    "detail": [
                        { "id": 116112, "nama": "Overweight ", "type": "checkbox" },
                        { "id": 116113, "nama": "Baik", "type": "checkbox" },
                        { "id": 116114, "nama": "Kurang ", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listGizi = [

                {
                    "id": 1, "nama": "Apakah pasien tampak kurus",
                    "detail": [
                        { "id": 115920, "nama": "a. Tidak", "descNilai": "0" },
                        { "id": 115921, "nama": "b. Ya", "descNilai": "1" },
                    ]
                },
                {
                    "id": 2, "nama": "Apakah terdapat penurunan BB selama 1 bulan terakhir ( Berdasarkan penilaian objektif data BB bila ada/ penilaian seubjektif dari orang tua Pasien atau untuk bayi =< 1 tahun BB tidak naik selama3 bulan terakhir ) ",
                    "detail": [
                        { "id": 115922, "nama": "a. Tidak", "descNilai": "0" },
                        { "id": 115923, "nama": "b. Ya", "descNilai": "1" }
                    ]
                
                },
                {
                    "id": 3, "nama": "Apakah terdapat salah satu dari kondisi berikut?Diare >=5 kali/hari dan atau muntah >=3 kali/hari dalam seminggu terakhir, Asupan makananberkurang selama 1 minggu terakhir",
                    "detail": [
                        { "id": 115924, "nama": "a. Tidak", "descNilai": "0" },
                        { "id": 115925, "nama": "b. Ya", "descNilai": "1" },
                    ]
                },
                {
                    "id": 4, "nama": "Apakah terdapat Penyakit, keadaan yang mengakibatkan pasien beresiko  mengalami malnutrisi",
                    "detail": [
                        { "id": 115926, "nama": "a. Tidak", "descNilai": "0" },
                        { "id": 115927, "nama": "b. Ya", "descNilai": "2" },
                    ]
                },
            ]
            $scope.listHumpty = [

                {
                    "id": 1, "nama": "Usia",
                    "detail": [
                        { "id": 115929, "nama": "< 3 tahun", "descNilai": "4" },
                        { "id": 115930, "nama": "3-7 tahun", "descNilai": "3" },
                        { "id": 115931, "nama": "8-13 tahun", "descNilai": "2" },
                        { "id": 115932, "nama": "> 13 tahun", "descNilai": "1" },
                    ]
                },

                {
                    "id": 2, "nama": "Jenis kelamin",
                    "detail": [
                        { "id": 115933, "nama": "Laki-laki", "descNilai": "2" },
                        { "id": 115934, "nama": "Perempuan", "descNilai": "1" },
                    ]
                },

                {
                    "id": 3, "nama": "Diagnosis",
                    "detail": [
                        { "id": 115935, "nama": "Kelainan Neurologi", "descNilai": "4" },
                        { "id": 115936, "nama": "Perubahan dalam Oksigenasi (Masalah saluran pernafasan, dehidrasi, anemia, anoreksia, sinkop, Sakit Kepala, dll)", "descNilai": "3" },
                        { "id": 115937, "nama": "Gangguan perilaku / psikiatri", "descNilai": "2" },
                        { "id": 115938, "nama": "Diagnosis lainnya", "descNilai": "1" },
                    ]
                    
                },

                {
                    "id": 4, "nama": "Gangguan/kognitif",
                    "detail": [
                        { "id": 115939, "nama": "Tidak menyadari keterbatasan dirinya", "descNilai": "3" },
                        { "id": 115940, "nama": "Lupa keterbatasannya", "descNilai": "2" },
                        { "id": 115941, "nama": "Orientasi baik terhadap diri sendiri", "descNilai": "1" },

                    ]
                },
                {
                    "id": 5, "nama": "Faktor lingkungan",
                    "detail": [
                        { "id": 115942, "nama": "Riwayat jatuh-bayi diletakan ditempat tidur dewasa", "descNilai": "4" },
                        { "id": 115943, "nama": "Pasien Menggunakan Alat bantu/bayi diletakan dalam tempat tidur bayi/perabot rumah", "descNilai": "3" },
                        { "id": 115944, "nama": "Pasien diletakan ditempat tidur", "descNilai": "2" },
                        { "id": 115945, "nama": "Area diluar rumah sakit", "descNilai": "1" },


                    ]
                },
                {
                    "id": 6, "nama": "Respon terhadap : Pembedahan/sedasi/anestesi, penggunaan medikamentosa",
                    "detail": [
                        { "id": 115946, "nama": "Dalam 24 jam ", "descNilai": "3" },
                        { "id": 115947, "nama": "Dalam 48 jam", "descNilai": "2" },
                        { "id": 115948, "nama": "> 48 jam/tidak mengalami perbedaan/sedasi/anestesi", "descNilai": "1" },

                    ]
                },
                {
                    "id": 7, "nama": "Penggunaan medikamentosa",
                    "detail": [
                        { "id": 115949, "nama": "penggunaan multiple, sedatif, obat hipnosis, harbiturat, fanotiazin, anti depresan, pencahar, diuretik, narkosa", "descNilai": "3" },
                        { "id": 115950, "nama": "penggunaan salah satu obat diatas", "descNilai": "2" },
                        { "id": 115951, "nama": "penggunaan medikasi lainnya atau tidak ada medikasi", "descNilai": "1" },

                    ]
                },



            ]
            $scope.listNyeri = [{
                "id": 1, "nama": "Nyeri Hilang",
                "detail": [
                    { "id": 21000119, "nama": "Minum Obat ", "type": "checkbox" },

                    { "id": 21000120, "nama": "Istirahat ", "type": "checkbox" },
                    { "id": 21000121, "nama": "Mendengar Musik ", "type": "checkbox" },
                    { "id": 21000122, "nama": "Ubah posisi tidur ", "type": "checkbox" },
                    { "id": 21000123, "nama": "Lain-lain ", "type": "checkbox" },
                    { "id": 21000124, "nama": " ", "type": "textbox" },
                    
                ]
            }
            ]
             $scope.listNyeri2 = [{
                "id": 1, "nama": "Pasien berisiko maltrunisi tinggid rujuk ke Ahli Gizi :",
                "detail": [
                    { "id": 111132, "nama": "Tidak ", "type": "checkbox" },

                    { "id": 111133, "nama": "Ya ", "type": "checkbox" },
                    
                ]
            }
            ]

            $scope.listNyeri4 = [
            {
                "id": 1, "nama": "Kebutuhan Privasi Pasien",
                "detail": [
                    { "id": 116146, "nama": "Ya ", "type": "checkbox" },

                    { "id": 116147, "nama": "Pengobatan ", "type": "checkbox" },
                    { "id": 116148, "nama": "Kondisi Penyakit ", "type": "checkbox" },
                    { "id": 116149, "nama": "Transportasi ", "type": "checkbox" },
                    { "id": 116150, "nama": "Lain-lain ", "type": "checkbox" },
                    { "id": 116151, "nama": " ", "type": "textbox" },
                    
                ]
            },
            {
                "id": 1, "nama": "",
                "detail": [
                    { "id": 116152, "nama": "Keinginan waktu / tempat khusus saat wawancara dan tindakan ", "type": "checkbox" },
                    { "id": 116153, "nama": " ", "type": "textbox" },
                    
                ]
            }
            ]
            $scope.listNyeri5 = [
            {
                "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                "detail": [
                    { "id": 21000170, "nama": "Tidak ", "type": "checkbox" },
                    { "id": 21000171, "nama": "Ya ", "type": "checkbox" },
                ]
            },
            {
                "id": 1, "nama": "B. Jika Ya,sebutkan hambatanya( bisa dilingkari lebih dari satu)",
                "detail": [
                    { "id": 21000172, "nama": "Pendenganran ", "type": "checkbox" },
                    { "id": 21000173, "nama": "Penglihatan ", "type": "checkbox" },
                    { "id": 21000174, "nama": "Kognitif ", "type": "checkbox" },
                    { "id": 21000175, "nama": "Fisik ", "type": "checkbox" },
                    { "id": 21000176, "nama": "Budaya ", "type": "checkbox" },
                    { "id": 21000177, "nama": "Agama ", "type": "checkbox" },
                    { "id": 21000178, "nama": "Emosi ", "type": "checkbox" },
                    { "id": 21000179, "nama": "Bahasa ", "type": "checkbox" },
                    { "id": 21000180, "nama": "Lainnya ", "type": "textbox" },
                ]
            },
            {
                "id": 1, "nama": "C. Perlu Penerjemah",
                "detail": [
                    { "id": 21000181, "nama": "Ya ", "type": "checkbox" },
                    { "id": 21000182, "nama": "Tidak ", "type": "checkbox" },
                    { "id": 21000183, "nama": "Sebutkan ", "type": "textbox" },
                    
                ]
            },
            {
                "id": 1, "nama": "D. Kebutuhan Pembelajaran Pasien (Pilih Topik Pembelajaran pada kotak yang tersedia)",
                "detail": [
                    { "id": 21000184, "nama": "Diagnosa & Manajemen ", "type": "checkbox2" },
                    { "id": 21000185, "nama": "Obat-obatan ", "type": "checkbox2" },
                    { "id": 21000186, "nama": "Perawatan Luka ", "type": "checkbox2" },
                    { "id": 21000187, "nama": "Rehabilitasi ", "type": "checkbox2" },
                    { "id": 21000188, "nama": "Manajemen nyeri ", "type": "checkbox2" },
                    { "id": 21000189, "nama": "Diet & Nutrisi ", "type": "checkbox2" },
                    { "id": 21000190, "nama": "Lain-lain  : ", "type": "textbox" },
                ]
            }             
            ]
            $scope.listNyeri6 = [{
                "id": 1, "nama": "Kriteria Discharge Planning :",
                "detail": [
                ]
            },
            {
                "id": 1, "nama": "A. Umur > 65 tahun",
                "detail": [
                    { "id": 21000191, "nama": "ya  ", "type": "checkbox" },
                    { "id": 21000192, "nama": "tidak ", "type": "checkbox" },
                ]
            },
            {
                "id": 1, "nama": "B. Keterbatasan mobilitas",
                "detail": [
                    { "id": 21000193, "nama": "ya  ", "type": "checkbox" },
                    { "id": 21000194, "nama": "tidak ", "type": "checkbox" },
                ]
            },
            {
                "id": 1, "nama": "C. Perawatan dan Pengobatan lanjutan",
                "detail": [
                    { "id": 21000195, "nama": "ya  ", "type": "checkbox" },
                    { "id": 21000196, "nama": "tidak ", "type": "checkbox" },
                ]
            },
            {
                "id": 1, "nama": "D. Bantuan untuk melakukan Aktifitas sehari-hari",
                "detail": [
                    { "id": 21000197, "nama": "ya  ", "type": "checkbox" },
                    { "id": 21000198, "nama": "tidak ", "type": "checkbox" },
                ]
            },
            {
                "id": 1, "nama": "Bila salah satu Jawaban Ya, maka lakukan Prencanaan lanjutan",
                "detail": [
                    { "id": 21000199, "nama": "Perawatan diri (Mandi, BAK,BAB)  ", "type": "checkbox" },
                    { "id": 21000200, "nama": "Pemantauan pemberian obat ", "type": "checkbox" },
                    { "id": 21000201, "nama": "Pemantauan diet ", "type": "checkbox" },
                    { "id": 21000202, "nama": "Perawatan Luka ", "type": "checkbox" },
                    { "id": 21000203, "nama": "Latihan Fisik Lanjutan ", "type": "checkbox" },
                    { "id": 21000204, "nama": "Pendampingan tenaga khusus dirumah ", "type": "checkbox" },
                    { "id": 21000205, "nama": "Bantuan medis/perawatan di rumah (Homecare) ", "type": "checkbox" },
                    { "id": 21000206, "nama": "Bantuan untuk melakukan Aktifitas fisik (kursi roda, alat bantu jalan) ", "type": "checkbox" },

                ]
            }
            ]
            $scope.listRumah = [{
                "id": 1, "nama": "Rumah Orang Tua:",
                "detail": [
                    { "id": 111112, "nama": "Rumah Sendiri ", "type": "checkbox" },
                    { "id": 111113, "nama": "Sewa/Kontrak ", "type": "checkbox" },
                    { "id": 111114, "nama": "Lainnya  : ", "type": "textbox" },
                ]
            }
            ]
            $scope.listPekerjaanOT = [{
                "id": 1, "nama": "Pekerjaan Orang Tua:",
                "detail": [
                    { "id": 111115, "nama": "PNS/TNI/POLRI", "type": "checkbox" },
                    { "id": 111116, "nama": "Swasta", "type": "checkbox" },
                    { "id": 111117, "nama": "Lainnya", "type": "textbox" },
                    
                    
                ]
            }
            ]
            $scope.listKonsep = [
                {
                    "id": 1, "nama": "1. Gangguan Psikologis",
                    "detail": [
                        { "id": 115980, "nama": "Tidak Ada", "type": "checkbox" },
                        { "id": 115981, "nama": "Cemas/Depresi/Marah", "type": "checkbox" },
                        { "id": 115982, "nama": "Lainnya", "type": "textbox" },
                                           
                    ]
                },
                {
                    "id": 2, "nama": "2.Nilai Dan Kepercayaan",
                    "detail": [
                        { "id": 115983, "nama": "", "type": "textarea" },
                        
            
                    ]
                },
                {
                    "id": 3, "nama": "3. Pendidikan",
                    "detail": [
                        { "id": 115984, "nama": "", "type": "textarea" },
                        
            
                    ]
                }
            ]
            $scope.listKonsep2 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 115985, "nama": "Ya", "type": "checkbox" },
                        { "id": 115986, "nama": "Pengobatan", "type": "checkbox" },
                        { "id": 115987, "nama": "Transportasi", "type": "checkbox" },
                        { "id": 115988, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 115989, "nama": "", "type": "textbox" },
                        { "id": 115990, "nama": "Keinginan waktu / tempat khusus saat wawancara dan tindakan", "type": "checkbox" },
                        { "id": 115991, "nama": "", "type": "textbox" },

                                           
                    ]
                }
            ]
            $scope.listKonsep3 = [
                {
                    "id": 1, "nama": "Kebutuhan Edukasi",
                    "detail": [
                        { "id": 115992, "nama": "Ya", "type": "checkbox" },
                        { "id": 115993, "nama": "Tidak", "type": "checkbox" },               
                    ]
                },
                {
                    "id": 1, "nama": "Bahasa sehari-hari",
                    "detail": [
                        { "id": 115994, "nama": "", "type": "textbox" },
                                      
                    ]
                },
                {
                    "id": 1, "nama": "Perlu Penerjemah",
                    "detail": [
                        { "id": 115995, "nama": "Ya", "type": "checkbox" },
                        { "id": 115996, "nama": "Tidak", "type": "checkbox" },
                                      
                    ]
                },
                {
                    "id": 1, "nama": "Hambatan Emosional & Motivasi",
                    "detail": [
                        { "id": 115997, "nama": "Ya", "type": "checkbox" },
                        { "id": 115998, "nama": "Tidak", "type": "checkbox" },
                        { "id": 115999, "nama": "", "type": "textbox" },

                                      
                    ]
                },
                {
                    "id": 1, "nama": "Keterbatasan Fisik & Kognitif",
                    "detail": [
                        { "id": 111198, "nama": "Ya", "type": "checkbox" },
                        { "id": 111198, "nama": "Tidak", "type": "checkbox" },
                        { "id": 111198, "nama": "", "type": "textbox" },            
                    ]
                },
                {
                    "id": 1, "nama": "Kesediaan Pasien / Keluarga untuk menerima informasi",
                    "detail": [
                        { "id": 111198, "nama": "Ya", "type": "checkbox" },
                        { "id": 111198, "nama": "Tidak", "type": "checkbox" },       
                    ]
                },
                {
                    "id": 1, "nama": "Kesediaan Pasien / Keluarga untuk menerima informasi",
                    "detail": [
                        { "id": 111198, "nama": "Ya", "type": "checkbox" },
                        { "id": 111198, "nama": "Tidak", "type": "checkbox" },       
                    ]
                },
                {
                    "id": 1, "nama": "Cara Edukasi yang disukai",
                    "detail": [
                        { "id": 111198, "nama": "Diskusi", "type": "checkbox" },
                        { "id": 111198, "nama": "Konseling", "type": "checkbox" },
                        { "id": 111198, "nama": "Demo", "type": "checkbox" },
                        { "id": 111198, "nama": "Brosur/leaflet", "type": "checkbox" },        
                    ]
                },
                {
                    "id": 1, "nama": "Potensial Kebutuhan Edukasi",
                    "detail": [
                        { "id": 111198, "nama": "Proses penyakit, Diagnosa", "type": "checkbox" },
                        { "id": 111198, "nama": "Diet & Nutrisi", "type": "checkbox" },
                        { "id": 111198, "nama": "Pengobatan", "type": "checkbox" },
                        { "id": 111198, "nama": "Pelayanan Keperawatan", "type": "checkbox" }, 
                        { "id": 111198, "nama": "Terapi/Obat", "type": "checkbox" }, 
                        { "id": 111198, "nama": "Lainnya", "type": "textbox" },        
                    ]
                }
            ]
            $scope.listKonsep4 = [
                {
                    "id": 1, "nama": "1. Riwayat Kesehatan Sekarang",
                    "detail": [
                        { "id": 116178, "nama": "", "type": "textarea" },                  
                    ]
                },
                {
                    "id": 1, "nama": "2. Penyakit Dahulu",
                    "detail": [
                        { "id": 116179, "nama": "Tidak", "type": "checkbox" },
                        { "id": 116180, "nama": "Ya, sebutkan", "type": "checkbox" },
                        { "id": 116181, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "3. Pengobatan",
                    "detail": [
                        { "id": 116182, "nama": "Belum", "type": "checkbox" },
                        { "id": 116183, "nama": "Sudah (termasuk obat yang digunakan 1 bulan terakhir)", "type": "checkbox" }
                    ]
                }
            ]
            

            
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 21000094, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 21000095, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 21000096, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 21000097, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
                ]
            }]
            $scope.listSkorWong = [{
                "id": 9, "nama": "Score ",
                "detail": [
                    { "id": 21000098, "nama": "0 - 1= Tidak Ada Nyeri", "type": "checkbox"},
                    { "id": 21000099, "nama": "2 - 3= Sedikit Nyeri", "type": "checkbox"},
                    { "id": 21000100, "nama": "4 - 5= Cukup Nyeri", "type": "checkbox" },
                    { "id": 21000101, "nama": "6 - 7= Lumayan Nyeri", "type": "checkbox"},
                    { "id": 21000102, "nama": "8 - 9= Sangat Nyeri", "type": "checkbox"},
                    { "id": 21000103, "nama": "10= Amat Sangat Nyeri", "type": "checkbox", },
                ]
            }]
            $scope.listNyeriAnak = [
                {
                    "id": 10, "nama": "Hurts", "detail": [
                    { "id": 111161, "nama": "No Hurt", "descNilai": 0 },
                    { "id": 111162, "nama": "Hurts Little Bit", "descNilai": 2 }, 
                    { "id": 111163, "nama": "Hurts Little More", "descNilai": 4 },
                    { "id": 111164, "nama": "Hurts Even More", "descNilai": 6 }, 
                    { "id": 111165, "nama": "Hurts Whole Lot", "descNilai": 8 },
                    { "id": 111166, "nama": "Hurts whorts", "descNilai": 10 }]
                }
            ]
            

            $scope.listEdmon1 = [
                {
                    "id": 1, "nama": "USIA",
                    "detail": [
                        { "id": 5053, "nama": "< 50 Tahun", "descNilai": "8" },
                        { "id": 5054, "nama": "50-79 Tahun", "descNilai": "10" },
                        { "id": 5056, "nama": ">= 80 Tahun", "descNilai": "26" },

                    ]
                },
                {
                    "id": 2, "nama": "STATUS MENTAL",
                    "detail": [
                        { "id": 5057, "nama": "Sadar penuh/Orientasi baik sepanjang waktu", "descNilai": "-4" },
                        { "id": 5058, "nama": "Agitasi / Cemas", "descNilai": "12" },
                        { "id": 5059, "nama": "Keadaan bingung", "descNilai": "13" },
                        { "id": 5060, "nama": "Bingung / Disoreintasi", "descNilai": "14" },

                    ]
                },
                {
                    "id": 3, "nama": "ELIMINASI",
                    "detail": [
                        { "id": 5061, "nama": "Mandiri mampu mengontrol rectum dan vesica urinaria", "descNilai": "8" },
                        { "id": 5062, "nama": "Kateter / ostomi", "descNilai": "12" },
                        { "id": 5063, "nama": "Eliminasi dengan bantuan", "descNilai": "10" },
                        { "id": 5064, "nama": "Gangguan eliminasi (Inkontinensia, nocturna,Frekuensi)", "descNilai": "12" },
                        { "id": 5065, "nama": "inkontinensia tapi mampu bergerak mandiri", "descNilai": "12" },

                    ]
                },
                {
                    "id": 4, "nama": "OBAT",
                    "detail": [
                        { "id": 5066, "nama": "Tanpa obat", "descNilai": "10" },
                        { "id": 5067, "nama": "Obat Jantung", "descNilai": "10" },
                        { "id": 5068, "nama": "Obat psikotropik (termasuk benzodiazepine Anti depresan)", "descNilai": "8" },
                        { "id": 5069, "nama": "Mengalami peningkatan dosis obat tersebut dan/atau diberikan bilamana perlu, diterima dalam 24 jam terakhir", "descNilai": "12" },


                    ]
                },
                {
                    "id": 5, "nama": "DIAGNOSIS",
                    "detail": [
                        { "id": 5070, "nama": "Gangguan bipolar / Skizoaafektif", "descNilai": "10" },
                        { "id": 5071, "nama": "Gangguan penyalahgunaan zat/alkohol", "descNilai": "10" },
                        { "id": 5072, "nama": "Gangguan depresi mayor", "descNilai": "8" },
                        { "id": 5073, "nama": "Delirium / demensia", "descNilai": "12" },

                    ]
                },



            ]

            $scope.listEdmon2 = [

                {
                    "id": 6, "nama": "AMBULASI / KESEIMBANGAN",
                    "detail": [
                        { "id": 5074, "nama": "Mandiri / langkah mantap", "descNilai": "7" },
                        { "id": 5075, "nama": "Menggunakan alat bantu", "descNilai": "8" },
                        { "id": 5076, "nama": "Vertigo / hipotensi ortostatik / lemah", "descNilai": "10" },
                        { "id": 5077, "nama": "Langkah tidak mantap, membutuhkan Bantuan,sadar akan ketidakmampuannya", "descNilai": "8" },
                        { "id": 5078, "nama": "Langkah tidak mantap, namun tidak menyadari keterbatasannya", "descNilai": "15" },

                    ]
                },

                {
                    "id": 7, "nama": "NUTRISI",
                    "detail": [
                        { "id": 5079, "nama": "Asupan makanan dan cairan dalam 24 jam terakhir sangat sedikit", "descNilai": "12" },
                        { "id": 5080, "nama": "Tidak ada gangguan nafsu makan", "descNilai": "0" },

                    ]
                },

                {
                    "id": 8, "nama": "GANGGUAN TIDUR",
                    "detail": [
                        { "id": 5081, "nama": "Tidak ada gangguan tidur", "descNilai": "8" },
                        { "id": 5082, "nama": "Ada gangguan tidur yang dilaporkan oleh pasien, keluarga dan staf", "descNilai": "12" },

                    ]
                },

                {
                    "id": 9, "nama": "RIWAYAT JATUH",
                    "detail": [
                        { "id": 5083, "nama": "Tidak ada riwayat jatuh", "descNilai": "8" },
                        { "id": 5084, "nama": "Riwayat jatuh dalan 3 bulan terakhir", "descNilai": "14" },

                    ]
                },

            ]
            $scope.listNutrisi = [

                {
                    "id": 1, "nama": "Penurunan Berat Badan yang tidak diinginkan dalam 6 bulan terakhir",
                    "detail": [
                        { "id": 21000160, "nama": "a. Tidak ada penurunan berat badan", "descNilai": "0" },
                        { "id": 21000161, "nama": "b. Tidak yakin / tidak tahu / terasa baju lebih longgar", "descNilai": "2" },
                        { "id": 21000162, "nama": "c. Penurunan : > 1 - 5 kg", "descNilai": "1" },
                        { "id": 21000163, "nama": "               > 6 - 10 kg", "descNilai": "2" },
                        { "id": 21000164, "nama": "               > 11 - 15 kg", "descNilai": "3" },
                        { "id": 21000165, "nama": "               > 15 kg", "descNilai": "4" },
                        { "id": 21000166, "nama": "  Tidak tahu berapa penurunan berat badan", "descNilai": "2" },
                    ]
                },
                {
                    "id": 2, "nama": "Asupan Makan Berkurang karena tidak nafsu makan",
                    "detail": [
                        { "id": 21000167, "nama": "a. Tidak", "descNilai": "0" },
                        { "id": 21000168, "nama": "b. Ya", "descNilai": "1" }
                    ]
                },
            ]
            $scope.listPasienDiagKhusus = [{
                "id": 1, "nama": "Pasien dengan diagnosa khusus :",
                "detail": [
                    { "id": 5097, "nama": "Tidak", "type": "checkbox" },
                    { "id": 5098, "nama": "Ya, sebutkan", "type": "checkbox" },
                    { "id": 5099, "nama": "", "type": "textbox" },
                ]
            },
            {
                "id": 2, "nama": "Dilaporkan ke Dokter Bila skor >= 2 dan atau pasien dengan diagnosis / kondisi khusus :",
                "detail": [
                    { "id": 5100, "nama": "Tidak", "type": "checkbox" },
                    { "id": 5101, "nama": "Ya, pukul", "type": "checkbox" },
                    { "id": 5102, "nama": "", "type": "textbox" },
                ]
            }
            ]
            $scope.listPsiko = [{
                "id": 1, "nama": "Status Emosi",
                "detail": [
                    { "id": 5103, "nama": "Kooperatif", "type": "checkbox" },
                    { "id": 5104, "nama": "Cemas", "type": "checkbox" },
                    { "id": 5105, "nama": "Depresi", "type": "checkbox" },
                ]
            },
            {
                "id": 2, "nama": "Status Pernikahan",
                "detail": [
                    { "id": 5106, "nama": "Menikah", "type": "checkbox" },
                    { "id": 5107, "nama": "Belum menikah ", "type": "checkbox" },
                    { "id": 5108, "nama": "Janda Duda", "type": "checkbox" },
                ]
            },
            {
                "id": 3, "nama": "Keluarga",
                "detail": [
                    { "id": 5109, "nama": "Tinggal Sendiri", "type": "checkbox" },
                    { "id": 5110, "nama": "Tinggal dengan keluarga ", "type": "checkbox" },

                ]
            },
            {
                "id": 4, "nama": "Penelantaran ",
                "detail": [
                    { "id": 5111, "nama": "Ya ", "type": "checkbox" },
                    { "id": 5112, "nama": "Tidak ", "type": "checkbox" },

                ]
            },
            {
                "id": 5, "nama": "Keluarga terdekat ",
                "detail": [
                    { "id": 5113, "nama": "Ayah/ Ibu", "type": "checkbox" },
                    { "id": 5114, "nama": "Adik / Kakak ", "type": "checkbox" },
                    { "id": 5115, "nama": "Lainnya ...", "type": "checkbox" },
                    { "id": 5116, "nama": " .. ", "type": "textbox" },
                ]
            },
            {
                "id": 6, "nama": "Bahasa Sehari-hari ",
                "detail": [
                    { "id": 5117, "nama": "Indonesia", "type": "checkbox" },
                    { "id": 5118, "nama": "Jawa ", "type": "checkbox" },
                    { "id": 5119, "nama": "Lainnya ...", "type": "checkbox" },
                    { "id": 5120, "nama": " .. ", "type": "textbox" },
                ]
            },
            ]

            $scope.listSosial = [{
                "id": 1, "nama": "Sosial. Ada yang menunggu",
                "detail": [
                    { "id": 5124, "nama": "Tidak", "type": "checkbox" },
                    { "id": 5125, "nama": "Ya ...", "type": "checkbox" },
                    { "id": 5126, "nama": "", "type": "textbox" },
                ]
            },
            {
                "id": 2, "nama": "Ekonomi. Ada yang bertanggungjawab",
                "detail": [
                    { "id": 5127, "nama": "Tidak", "type": "checkbox" },
                    { "id": 5128, "nama": "Ya ...", "type": "checkbox" },
                    { "id": 5129, "nama": "", "type": "textbox" },
                ]
            },
            {
                "id": 3, "nama": "KEBUTUHAN EDUKASI",
                "detail": [
                    { "id": 5130, "nama": "Tidak ", "type": "checkbox" },
                    { "id": 5131, "nama": "Iya, sebutkan ... ", "type": "checkbox" },
                    { "id": 5132, "nama": "", "type": "textbox" },
                ]
            },
            {
                "id": 4, "nama": "PERENCANAAN PEMULANGAN PASIEN ",
                "detail": [
                    { "id": 5133, "nama": "Tidak ", "type": "checkbox" },
                    { "id": 5134, "nama": "Iya, sebutkan ... ", "type": "checkbox" },
                    { "id": 5135, "nama": "", "type": "textbox" },
                ]
            },

            ]

            $scope.listBarthel = [
                {
                    "id": 1, "nama": "Mengendalikan Rangsang delekasi",
                    "detail": [
                        {
                            "id": 1, "nama": "Tidak terkendali tak teratur (perlu bantuan)", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 5136 }, { id: 5137 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 5138 }, { id: 5139 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 5140 }, { id: 5141 }]
                        },
                    ]
                },
                {
                    "id": 2, "nama": "Mengendalikan Rangsang berkemih",
                    "detail": [
                        { "id": 1, "nama": "Tak terkendali pakai kateter", "descNilai": "0", "detail": [{ id: 5142 }, { id: 5143 }] },
                        { "id": 2, "nama": "Kadang-kadang tak terkendali (1x24 jam)", "descNilai": "1", "detail": [{ id: 5144 }, { id: 5145 }] },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5146 }, { id: 5147 }] },
                    ]
                },
                {
                    "id": 3, "nama": "Membersihkan diri ( cuci muka, sisir rambur, sikat gigi)",
                    "detail": [
                        { "id": 1, "nama": "Butuh pertolongan orang lain", "descNilai": "0", "detail": [{ id: 5148 }, { id: 5149 }] },
                        { "id": 2, "nama": "Mandiri", "descNilai": "1", "detail": [{ id: 5150 }, { id: 5151 }] },
                    ]
                },
                {
                    "id": 4, "nama": "Penggunaan jamban (masuk, keluar)",
                    "detail": [
                        { "id": 1, "nama": "Tergantung pertolongan orang lain", "descNilai": "0", "detail": [{ id: 5152 }, { id: 5153 }] },
                        {
                            "id": 2, "nama": "Perlu pertolongan beberapa kegiatan tetapi dapat mengerjakan sendiri pada kegiatan yang lain", "descNilai": "1",
                            "detail": [{ id: 5154 }, { id: 5155 }]
                        },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5156 }, { id: 5157 }] },
                    ]
                },
                {
                    "id": 5, "nama": "Makan",
                    "detail": [
                        { "id": 1, "nama": "Tidak mampu", "descNilai": "0", "detail": [{ id: 5158 }, { id: 5159 }] },
                        { "id": 2, "nama": "Perlu ditolong  memotong makanan", "descNilai": "1", "detail": [{ id: 5160 }, { id: 5161 }] },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5162 }, { id: 5163 }] },
                    ]
                },
                {
                    "id": 6, "nama": "Berubah sikap dari berbaring ke duduk",
                    "detail": [
                        { "id": 1, "nama": "Perlu banyak bantuan untuk bisa duduk (2 org)", "descNilai": "0", "detail": [{ id: 5164 }, { id: 5165 }] },
                        { "id": 2, "nama": "Bantuan minimal 2 org", "descNilai": "1", "detail": [{ id: 5166 }, { id: 5167 }] },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5168 }, { id: 5169 }] },
                    ]
                },
                {
                    "id": 7, "nama": "Berpindah / berjalan",
                    "detail": [
                        { "id": 1, "nama": "Tidak mampu", "descNilai": "0", "detail": [{ id: 5170 }, { id: 5171 }] },
                        { "id": 2, "nama": "Bisa (pindah) dengan kursi ", "descNilai": "1", "detail": [{ id: 5172 }, { id: 5173 }] },
                        { "id": 3, "nama": "Berjalan dengan bantuan 1 orang", "descNilai": "2", "detail": [{ id: 5174 }, { id: 5175 }] },
                        { "id": 4, "nama": "Mandiri", "descNilai": "3", "detail": [{ id: 5176 }, { id: 5177 }] },
                    ]
                },
                {
                    "id": 8, "nama": "Memakai Baju",
                    "detail": [
                        { "id": 1, "nama": "Tergantung orang lain", "descNilai": "0", "detail": [{ id: 5178 }, { id: 5179 }] },
                        { "id": 2, "nama": "Sebagian dibantu (misal mengancingkan baju)", "descNilai": "1", "detail": [{ id: 5180 }, { id: 5181 }] },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5182 }, { id: 5183 }] },

                    ]
                },
                {
                    "id": 9, "nama": "Naik turun tangga ",
                    "detail": [
                        { "id": 1, "nama": "Tidak Mampu", "descNilai": "0", "detail": [{ id: 5184 }, { id: 5185 }] },
                        { "id": 2, "nama": "Butuh Pertolongan orang lain", "descNilai": "1", "detail": [{ id: 5186 }, { id: 5187 }] },
                        { "id": 3, "nama": "Mandiri", "descNilai": "2", "detail": [{ id: 5188 }, { id: 5189 }] },
                    ]
                },
                {
                    "id": 10, "nama": "Mandi",
                    "detail": [
                        { "id": 1, "nama": "Tergantung orang lain ", "descNilai": "0", "detail": [{ id: 5190 }, { id: 5191 }] },
                        { "id": 2, "nama": "Mandiri", "descNilai": "1", "detail": [{ id: 5192 }, { id: 5193 }] },
                    ]
                },
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
                        }

                        if (dataLoad[i].type == "radio") {
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
                    } else {
                    }
                }
                $scope.item.obj[21000169] = $scope.skorNutrisi
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
                $scope.cc.jenisemr = 'pengkajiannew'
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
                    'AsesmenMedisRJCtrk ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekTidakAlergi = false;
                } else if (data === false || data === undefined) {
                    $scope.cekTidakAlergi = true;
                } else {
                    return;
                }
            }

        }
    ]);
});