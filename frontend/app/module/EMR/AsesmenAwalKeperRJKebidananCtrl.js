define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperRJKebidananCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorSkalaFlacc = [];
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 21035
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
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 21035).then(function (e) {

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
            
            $scope.listRiwayatKesehatan1 = [
                {
                    "id": 1, "nama": "A. Penyakit yang pernah diderita :",
                    "detail": [
                        { "id": 21002643, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Riwayat pengobatan saat di rumah :",
                    "detail": [
                        { "id": 21002644, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                        { "id": 21002645, "nama": "Ya", "satuan": "", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatanTabel = [
                {
                    "id": 1, "nama": "1",
                    "detail": [
                        { "id": 21002646, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002647, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002648, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002649, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002650, "nama": "", "satuan": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "2",
                    "detail": [
                        { "id": 21002651, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002652, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002653, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002654, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002655, "nama": "", "satuan": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "3",
                    "detail": [
                        { "id": 21002656, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002657, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002658, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002659, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002660, "nama": "", "satuan": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "4",
                    "detail": [
                        { "id": 21002661, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002662, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002663, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002664, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002665, "nama": "", "satuan": "", "type": "datetime" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatan2 = [
                {
                    "id": 1, "nama": "C. Operasi yang pernah dialami, (Jenis, kapan, komplikasi yang ada) :",
                    "detail": [
                        { "id": 21002666, "nama": "", "satuan": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Faktor keturunan Gemeli :",
                    "detail": [
                        { "id": 21002667, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                        { "id": 21002668, "nama": "Ya", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "E. Riwayat penyakit herediter :",
                    "detail": [
                        { "id": 21002669, "nama": "Tidak ada", "satuan": "", "type": "checkbox" },
                        { "id": 21002670, "nama": "Ada, Jelaskan", "satuan": "", "type": "checkbox2" },
                        { "id": 21002671, "nama": "", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "F. Riwayat penyakit dalam keluarga saat ini :",
                    "detail": [
                        { "id": 21002672, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "G. Ketergantungan terhadap",
                    "detail": [
                        { "id": 21002673, "nama": "Obat obatan", "satuan": "", "type": "checkbox2" },
                        { "id": 21002674, "nama": "Rokok", "satuan": "", "type": "checkbox2" },
                        { "id": 21002675, "nama": "Alkohol", "satuan": "", "type": "checkbox2" },
                        { "id": 21002676, "nama": "", "satuan": "", "type": "checkbox1" },
                        { "id": 21002677, "nama": "", "satuan": "", "type": "textbox2" },
                        { "id": 21002678, "nama": "Tidak ada Jelaskan", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "H. Riwayat pekerjaan (apakah berhubungan dengan zat - zat berbahaya) :",
                    "detail": [
                        { "id": 21002679, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                        { "id": 21002680, "nama": "Ya, Jelaskan", "satuan": "", "type": "checkbox2" },
                        { "id": 21002681, "nama": "", "satuan": "", "type": "textbox2" },
                    ]
                },
            ]

            $scope.listRiwayatKehamilan = [
                {
                    "id": 1, "nama": "1",
                    "detail": [
                        { "id": 21002682, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002683, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002684, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002685, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002686, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002687, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "2",
                    "detail": [
                        { "id": 21002688, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002689, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002690, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002691, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002692, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002693, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "3",
                    "detail": [
                        { "id": 21002694, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002695, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002696, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002697, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002698, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002699, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "4",
                    "detail": [
                        { "id": 21002700, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002701, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002702, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002703, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002704, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002705, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "5",
                    "detail": [
                        { "id": 21002706, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002707, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002708, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002709, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002710, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21002711, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listRiwayatObstetri = [
                {
                    "id": 1, "nama": "A. Menarche :",
                    "detail": [
                        { "id": 21002712, "nama": "Umur", "satuan": "tahun", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Menstruasi",
                    "detail": [
                        { "id": 21002713, "nama": "Teratur, Siklus", "satuan": "", "type": "checkbox2" },
                        { "id": 21002714, "nama": "", "satuan": "hari", "type": "textbox2" },
                        { "id": 21002715, "nama": "Tidak Teratur, Siklus", "satuan": "", "type": "checkbox2" },
                        { "id": 21002716, "nama": "", "satuan": "hari", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Sakit saat menstruasi",
                    "detail": [
                        { "id": 21002717, "nama": "Tidak", "satuan": "tahun", "type": "checkbox" },
                        { "id": 21002718, "nama": "Ya", "satuan": "tahun", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002719, "nama": "Menikah yang ke", "satuan": "kali", "type": "textbox2" },
                        { "id": 21002720, "nama": "Lama pernikahan", "satuan": "bulan/tahun", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002721, "nama": "Kontrasepsi yang pernah digunakan", "satuan": "", "type": "textbox2" },
                        { "id": 21002722, "nama": "Lamanya", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Riwayat Imunisasi",
                    "detail": [
                        { "id": 21002723, "nama": "TT 1", "satuan": "tahun", "type": "checkbox" },
                        { "id": 21002724, "nama": "TT 2", "satuan": "tahun", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listDataKehamilanSekarang = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002725, "nama": "G", "satuan": "", "type": "textbox2" },
                        { "id": 21002726, "nama": "P", "satuan": "", "type": "textbox2" },
                        { "id": 21002727, "nama": "A", "satuan": "", "type": "textbox2" },
                        { "id": 21002728, "nama": "Hari Pertama Haid Terakhir", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Tanggal harapan lahir",
                    "detail": [
                        { "id": 21002729, "nama": "", "satuan": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Keluhan yang dirasakan selama hamil ini",
                    "detail": [
                        { "id": 21002730, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPemeriksaanFisik = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002731, "nama": "Keadaan Umum", "satuan": "", "type": "textbox2" },
                        { "id": 21002732, "nama": "Kesadaran", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002733, "nama": "Berat Badan", "satuan": "kg", "type": "textbox2" },
                        { "id": 21002734, "nama": "Tinggi Badan", "satuan": "cm", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002735, "nama": "Suhu", "satuan": "°C", "type": "textbox2" },
                        { "id": 21002736, "nama": "Tekanan Darah", "satuan": "mmHg", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002737, "nama": "Nadi", "satuan": "x/menit", "type": "textbox2" },
                        { "id": 21002738, "nama": "Teratur", "satuan": "", "type": "checkbox2" },
                        { "id": 21002739, "nama": "Tidak Teratur", "satuan": "", "type": "checkbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002740, "nama": "Pernafasan", "satuan": "x/menit", "type": "textbox2" },
                        { "id": 21002741, "nama": "Teratur", "satuan": "", "type": "checkbox2" },
                        { "id": 21002742, "nama": "Tidak Teratur", "satuan": "", "type": "checkbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Nyeri", "type": "label" },
                        { "id": 21002743, "nama": "Tidak", "satuan": "", "type": "checkbox2" },
                        { "id": 21002744, "nama": "Ya, Score", "satuan": "", "type": "checkbox2" },
                        { "id": 21002745, "nama": "", "satuan": "", "type": "textbox2" },
                    ]
                },
            ]

            $scope.listStatusBio = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 21002746, "nama": "Pola Malan :", "satuan": "x/hari", "type": "textbox" },
                        { "id": 21002747, "nama": "Pola Minum :", "satuan": "cc/hari", "type": "textbox" },
                        { "id": 21002748, "nama": "BAK :", "satuan": "x/hari", "type": "textbox" },
                        { "id": 21002749, "nama": "BAB :", "satuan": "x/hari", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "id": 21002750, "nama": "Cemas", "type": "checkbox" },
                        { "id": 21002751, "nama": "Takut", "type": "checkbox" },
                        { "id": 21002752, "nama": "Marah", "type": "checkbox" },
                        { "id": 21002753, "nama": "Sedih", "type": "checkbox" },
                        { "id": 21002754, "nama": "Kecendrungan bunuh diri", "type": "checkbox" },
                        { "id": 21002755, "nama": "dll", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "nama": "Pekerjaan", "type": "label" },
                        { "id": 21002756, "nama": "Wiraswasta", "type": "checkbox" },
                        { "id": 21002757, "nama": "Pegawai Negeri", "type": "checkbox" },
                        { "id": 21002758, "nama": "Pegawai Swasta", "type": "checkbox" },
                        { "id": 21002759, "nama": "Tidak Bekerja", "type": "checkbox" },
                        { "id": 21002760, "nama": "Siswa/Mahasiswa", "type": "checkbox" },
                        { "id": 21002761, "nama": "Pensiun", "type": "checkbox" },
                        { "id": 21002762, "nama": "Alamat Rumah", "type": "textbox" },
                        { "id": 21002763, "nama": "No. Telepon", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Spriritual dan Kulturasi",
                    "detail": [
                        { "nama": "Agama", "type": "label" },
                        { "id": 21002764, "nama": "Islam", "type": "checkbox" },
                        { "id": 21002765, "nama": "Protestan", "type": "checkbox" },
                        { "id": 21002766, "nama": "Katolik", "type": "checkbox" },
                        { "id": 21002767, "nama": "Hindu", "type": "checkbox" },
                        { "id": 21002768, "nama": "Budha", "type": "checkbox" },
                        { "id": 21002769, "nama": "Konghucu", "type": "checkbox" },
                        { "id": 21002770, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002771, "nama": "", "type": "textbox" },
                        { "nama": "Kegiatan Spiritual dan nilai nilai kepercayaan yang dilakukan", "type": "label" },
                        { "id": 21002772, "nama": "Ada, Sebutkan", "type": "checkbox" },
                        { "id": 21002773, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 21002774, "nama": "", "type": "textbox" },
                        { "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 21002775, "nama": "Indonesia", "type": "checkbox" },
                        { "id": 21002776, "nama": "Inggris", "type": "checkbox" },
                        { "id": 21002777, "nama": "Daerah", "type": "checkbox" },
                        { "id": 21002778, "nama": "Lain-lain", "type": "textbox" },
                    ]
                },
            ]

            $scope.listStatusEkonomi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Cara Pembayaran", "type": "label" },
                        { "id": 21002779, "nama": "Pribadi", "type": "checkbox" },
                        { "id": 21002780, "nama": "Perusahaan", "type": "checkbox" },
                        { "id": 21002781, "nama": "Asuransi", "type": "checkbox" },
                        { "nama": "Pendapatan", "type": "label" },
                        { "id": 21002782, "nama": "UMR /rp", "type": "checkbox" },
                        { "id": 21002783, "nama": "UMR s/d 5 juta rp", "type": "checkbox" },
                        { "id": 21002784, "nama": "5 s/d 10 juta rp", "type": "checkbox" },
                        { "id": 21002785, "nama": "10 s/d 15 juta rp", "type": "checkbox" },
                        { "id": 21002786, "nama": "> 15 juta rp", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatAlergi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002787, "nama": "Ya, Sebutkan :", "type": "checkbox" },
                        { "id": 21002788, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002789, "nama": "", "type": "textbox" },
                        { "id": 21002790, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "checkbox2" },
                        { "id": 21002791, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002792, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
                        { "id": 21002793, "nama": "1 - 3 = Nyeri Ringan", "type": "checkbox" },
                        { "id": 21002794, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
                        { "id": 21002795, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPenilaianNyeri = [
                {
                    "id": 1, "nama": "Penilaian Nyeri",
                    "detail": [
                        { "nama": "Provokatif", "type": "label" },
                        { "id": 21002796, "nama": "Ruda paksa", "type": "checkbox" },
                        { "id": 21002797, "nama": "Benturan", "type": "checkbox" },
                        { "id": 21002798, "nama": "Sayatan", "type": "checkbox" },
                        { "id": 21002799, "nama": "dll", "type": "textbox" },
                        { "nama": "Quality", "type": "label" },
                        { "id": 21002800, "nama": "Tertusuk", "type": "checkbox" },
                        { "id": 21002801, "nama": "Tertekan/tertindih", "type": "checkbox" },
                        { "id": 21002802, "nama": "Diiris-iris", "type": "checkbox" },
                        { "id": 21002803, "nama": "dll", "type": "textbox" },
                        { "nama": "Regional", "type": "label" },
                        { "id": 21002804, "nama": "Lokasi", "type": "checkbox1" },
                        { "id": 21002805, "nama": "", "type": "textbox" },
                        { "nama": "Menjalar", "type": "label" },
                        { "id": 21002806, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002807, "nama": "Ya, Ke :", "type": "checkbox2" },
                        { "id": 21002808, "nama": "", "type": "textbox" },
                        { "nama": "Scala", "type": "label" },
                        { "id": 21002809, "nama": "", "type": "textbox" },
                        { "nama": "Time", "type": "label" },
                        { "id": 21002810, "nama": "Jarang", "type": "checkbox" },
                        { "id": 21002811, "nama": "Hilang timbul", "type": "checkbox" },
                        { "id": 21002812, "nama": "Terus menerus", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPengkajian = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "A", "type": "label" },
                        { "nama": "Cara Bejalan Pasien (salah satu atau lebih) <br> 1. Tidak seimbang/sempoyongan/limbung <br> 2. Jalan dengan menggunakan alat bantu (kruk, tripot, kursi roda, orang lain)", "type": "label" },
                        { "id": 21002813, "nama": "", "type": "checkbox" },
                        { "id": 21002814, "nama": "", "type": "checkbox" },

                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "B", "type": "label" },
                        { "nama": "Menopang saat akan duduk : tampak memegang pinggiran kursi atau meja/benda lain sebagai penopang saat akan duduk.", "type": "label" },
                        { "id": 21002815, "nama": "", "type": "checkbox" },
                        { "id": 21002816, "nama": "", "type": "checkbox" },
                    ]
                }
            ]

            $scope.listHasil = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak Beresiko", "type": "label" },
                        { "nama": "Tidak ditemukan A & B", "type": "label" },
                        { "id": 21002817, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Risiko Rendah", "type": "label" },
                        { "nama": "Ditemukan salah satu A/B", "type": "label" },
                        { "id": 21002818, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Risiko tinggi", "type": "label" },
                        { "nama": "Ditemukan A & B", "type": "label" },
                        { "id": 21002819, "nama": "", "type": "textarea" },
                    ]
                },
                
            ]

            $scope.listTindakan = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak beresiko", "type": "label" },
                        { "nama": "Tidak ada tindakan", "type": "label" },
                        { "id": 21002820, "nama": "", "type": "checkbox" },
                        { "id": 21002821, "nama": "", "type": "checkbox" },
                        { "id": 21002822, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Resiko rendah", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002823, "nama": "", "type": "checkbox" },
                        { "id": 21002824, "nama": "", "type": "checkbox" },
                        { "id": 21002825, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Resiko tinggi", "type": "label" },
                        { "nama": "Pasang pita/stiker resiko jatuh", "type": "label" },
                        { "id": 21002826, "nama": "", "type": "checkbox" },
                        { "id": 21002827, "nama": "", "type": "checkbox" },
                        { "id": 21002828, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002829, "nama": "", "type": "checkbox" },
                        { "id": 21002830, "nama": "", "type": "checkbox" },
                        { "id": 21002831, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listAssementFungsional = [
                {
                    "id": 1, "nama": "Sensorik",
                    "detail": [
                        { "nama": "Penglihatan", "type": "label" },
                        { "id": 21002832, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002833, "nama": "Kabur", "type": "checkbox" },
                        { "id": 21002834, "nama": "Kacamata", "type": "checkbox" },
                        { "id": 21002835, "nama": "Lensa kotak", "type": "checkbox" },
                        { "nama": "Penciuman", "type": "label" },
                        { "id": 21002836, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002837, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pendengaran", "type": "label" },
                        { "id": 21002838, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002839, "nama": "Tuli kanan/kiri", "type": "checkbox" },
                        { "id": 21002840, "nama": "Alat bantu dengan kanan/kiri", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif",
                    "detail": [
                        { "id": 21002841, "nama": "Orientasi penuh", "type": "checkbox" },
                        { "id": 21002842, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 21002843, "nama": "Bingung", "type": "checkbox" },
                        { "id": 21002844, "nama": "Tidak dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Motorik",
                    "detail": [
                        { "nama": "Aktifitas sehari-hari", "type": "label" },
                        { "id": 21002845, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 21002846, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 21002847, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 21002848, "nama": "Ketergantungan Total", "type": "checkbox" },
                        { "nama": "Berjalan", "type": "label" },
                        { "id": 21002849, "nama": "Tidak ada kesulitan", "type": "checkbox" },
                        { "id": 21002850, "nama": "Perlu bantuan", "type": "checkbox" },
                        { "id": 21002851, "nama": "Sering Jatuh", "type": "checkbox" },
                        { "id": 21002852, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah ada penurunan berat badan yang tidak diinginkan selama 6 bulan terakhir ?",
                    "detail": [
                        { "id": 21002853, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002854, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "(Tanda: ukuran baju atau celana menjadi lebih longgar)", "type": "label" },
                        { "id": 21002855, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 21002856, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 21002857, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 21002858, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah asupan makan menurun yang dikarenakan adanya penurunan nafsu makan/kesulitan menerima makan ?",
                    "detail": [
                        { "id": 21002859, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002860, "nama": "Tidak yakin", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listKebutuhanEdukasi = [
                {
                    "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                    "detail": [
                        { "id": 21002862, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002863, "nama": "Ya", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Jika ya, sebutkan hambatan (bisa dipilih lebih dari satu) :",
                    "detail": [
                        { "id": 21002864, "nama": "Pendengaran", "type": "checkbox" },
                        { "id": 21002865, "nama": "Penglihatan", "type": "checkbox" },
                        { "id": 21002866, "nama": "Kognitif", "type": "checkbox" },
                        { "id": 21002867, "nama": "Fisik", "type": "checkbox" },
                        { "id": 21002868, "nama": "Budaya", "type": "checkbox" },
                        { "id": 21002869, "nama": "Agama", "type": "checkbox" },
                        { "id": 21002870, "nama": "Emosi", "type": "checkbox" },
                        { "id": 21002871, "nama": "Bahasa", "type": "checkbox" },
                        { "id": 21002872, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002873, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Dibutuhkan penerjemah",
                    "detail": [
                        { "id": 21002874, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002875, "nama": "Ya, jika ya sebutkan", "type": "checkbox" },
                        { "id": 21002876, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Kebutuhan pembelajaran pasien (pilih topik pembelajaran pada kotak yang tersedia)",
                    "detail": [
                        { "id": 21002877, "nama": "Diagnosa & Manajemen", "type": "checkbox" },
                        { "id": 21002878, "nama": "Obat-obtan", "type": "checkbox" },
                        { "id": 21002879, "nama": "Perawatan Luka", "type": "checkbox" },
                        { "id": 21002880, "nama": "Rehabilitasi", "type": "checkbox" },
                        { "id": 21002881, "nama": "Manajemen nyeri", "type": "checkbox" },
                        { "id": 21002882, "nama": "Diet dan nutrisi", "type": "checkbox" },
                        { "id": 21002883, "nama": "Lain-lainnya", "type": "checkbox" },
                        { "id": 21002884, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerencanaanPulang = [
                {
                    "id": 1, "nama": "Kriteria Discharge Planning :",
                    "detail": [
                        { "nama": "A. Umur > 65", "type": "label" },
                        { "id": 21002885, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002886, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "B. Keterbatasan mobilitas", "type": "label" },
                        { "id": 21002887, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002888, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "C. Perawatan atau pengobatan lanjutan", "type": "label" },
                        { "id": 21002889, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002890, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "D. Bantuan untuk melakukan aktifitas sehari - hari", "type": "label" },
                        { "id": 21002891, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002892, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bila salah satu jawaban 'Ya' dari kriteria perencanaan pulang diatas, maka akan dilanjutkan dengan perencanaan pulang sebagai berikut :",
                    "detail": [
                        { "id": 21002893, "nama": "Perawatan diri (mandi, BAB, BAK)", "type": "checkbox2" },
                        { "id": 21002894, "nama": "Latihan fisik lanjutan", "type": "checkbox2" },
                        { "id": 21002895, "nama": "Pemantauan pemberian obat", "type": "checkbox2" },
                        { "id": 21002896, "nama": "Pendampingan tenaga khusus di rumah", "type": "checkbox2" },
                        { "id": 21002897, "nama": "Pemantauan diet", "type": "checkbox2" },
                        { "id": 21002898, "nama": "Bantuan medis/perawat di rumah (home care)", "type": "checkbox2" },
                        { "id": 21002899, "nama": "Perawatan luka", "type": "checkbox2" },
                        { "id": 21002900, "nama": "Bantuan untuk melakukan aktifitas fisik (kursi roda, alat bantu jalan)", "type": "checkbox2" },
                    ]
                },
            ]

            $scope.listTindakan18 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002904, "nama": "", "type": "datetime" },
                        { "id": 21002905, "nama": "", "type": "textbox" },
                        { "id": 21002906, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002907, "nama": "", "type": "datetime" },
                        { "id": 21002908, "nama": "", "type": "textbox" },
                        { "id": 21002909, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002910, "nama": "", "type": "datetime" },
                        { "id": 21002911, "nama": "", "type": "textbox" },
                        { "id": 21002912, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002913, "nama": "", "type": "datetime" },
                        { "id": 21002914, "nama": "", "type": "textbox" },
                        { "id": 21002915, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listNamaPengkaji = [
                {
                    "id": 1, "nama": "Tanggal & Jam",
                    "detail": [
                        { "id": 21002916, "nama": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Nama Perawat",
                    "detail": [
                        { "id": 21002917, "nama": "", "type": "combobox" },
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
                
            $scope.SkorSkalaFlacc[21002435] = 0;
            $scope.SkorSkalaFlacc[21002439] = 0;
            $scope.SkorSkalaFlacc[21002443] = 0;
            $scope.SkorSkalaFlacc[21002447] = 0;
            $scope.SkorSkalaFlacc[21002451] = 0;
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
                var nilai1 = $scope.SkorSkalaFlacc[21002435]
                var nilai2 = $scope.SkorSkalaFlacc[21002439]
                var nilai3 = $scope.SkorSkalaFlacc[21002443]
                var nilai4 = $scope.SkorSkalaFlacc[21002447]
                var nilai5 = $scope.SkorSkalaFlacc[21002451]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4 + nilai5
                $scope.item.obj[21002452] = total;
                
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

                $scope.item.obj[21002861] = $scope.skorNutrisi
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
                    'AsesmenAwalKeperRJKebidananCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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