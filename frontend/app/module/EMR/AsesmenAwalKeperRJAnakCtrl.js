define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperRJAnakCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 21036
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
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 21036).then(function (e) {

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
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002340, "nama": "Suhu", "satuan": "°C", "type": "textbox" },
                        { "id": 21002341, "nama": "BB", "satuan": "gr/Kg", "type": "textbox" },
                        { "id": 21002342, "nama": "Panjang/Tinggi Badan", "satuan": "Cm", "type": "textbox" },
                    ]
                }
            ]

            $scope.listStatusBio = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 21002343, "nama": "Pola Malan :", "satuan": "x/hari", "type": "textbox" },
                        { "id": 21002344, "nama": "Pola Minum :", "satuan": "cc/hari", "type": "textbox" },
                        { "id": 21002345, "nama": "BAK :", "satuan": "x/hari", "type": "textbox" },
                        { "id": 21002346, "nama": "BAB :", "satuan": "x/hari", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "nama": "Status Mental dan Tingkah laku", "type": "label" },
                        { "id": 21002347, "nama": "Gembira, tenang, koperatif", "type": "checkbox" },
                        { "id": 21002348, "nama": "Ketakutan, agresif, hiperaktif", "type": "checkbox" },
                        { "id": 21002349, "nama": "Gelisah, murung dan cengeng", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "nama": "Yang mengasuh", "type": "label" },
                        { "id": 21002350, "nama": "Orang tua", "type": "checkbox" },
                        { "id": 21002351, "nama": "Nenek / kakek", "type": "checkbox" },
                        { "id": 21002352, "nama": "Pembantu", "type": "checkbox" },
                        { "id": 21002353, "nama": "Keluarga lain", "type": "checkbox" },
                        { "id": 21002354, "nama": "Panti asuhan", "type": "checkbox" },
                        { "nama": "Jenis Sekolah", "type": "label" },
                        { "id": 21002355, "nama": "Sekolah Umum", "type": "checkbox" },
                        { "id": 21002356, "nama": "Sekolah Berasrama", "type": "checkbox" },
                        { "id": 21002357, "nama": "Tidak Sekolah", "type": "checkbox" },
                        { "id": 21002358, "nama": "Alamat Rumah", "type": "textbox" },
                        { "id": 21002359, "nama": "No. Telepon", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Spriritual dan Kulturasi",
                    "detail": [
                        { "nama": "Agama", "type": "label" },
                        { "id": 21002360, "nama": "Islam", "type": "checkbox" },
                        { "id": 21002361, "nama": "Protestan", "type": "checkbox" },
                        { "id": 21002362, "nama": "Katolik", "type": "checkbox" },
                        { "id": 21002363, "nama": "Hindu", "type": "checkbox" },
                        { "id": 21002364, "nama": "Budha", "type": "checkbox" },
                        { "id": 21002365, "nama": "Konghucu", "type": "checkbox" },
                        { "id": 21002366, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002367, "nama": "", "type": "textbox" },
                        { "nama": "Kegiatan Spiritual dan nilai nilai kepercayaan yang dilakukan", "type": "label" },
                        { "id": 21002368, "nama": "Ada, Sebutkan", "type": "checkbox" },
                        { "id": 21002369, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 21002370, "nama": "", "type": "textbox" },
                        { "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 21002371, "nama": "Indonesia", "type": "checkbox" },
                        { "id": 21002372, "nama": "Inggris", "type": "checkbox" },
                        { "id": 21002373, "nama": "Daerah", "type": "checkbox" },
                        { "id": 21002374, "nama": "Lain-lain", "type": "textbox" },
                    ]
                },
            ]

            $scope.listStatusEkonomi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Cara Pembayaran", "type": "label" },
                        { "id": 21002375, "nama": "Pribadi", "type": "checkbox" },
                        { "id": 21002376, "nama": "Perusahaan", "type": "checkbox" },
                        { "id": 21002377, "nama": "Asuransi", "type": "checkbox" },
                        { "nama": "Pekerjaan orang tua", "type": "label" },
                        { "id": 21002378, "nama": "Wiraswasta", "type": "checkbox" },
                        { "id": 21002379, "nama": "Pegawai Negeri", "type": "checkbox" },
                        { "id": 21002380, "nama": "Pegawai Swasta", "type": "checkbox" },
                        { "id": 21002381, "nama": "Tidak Bekerja", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatanPasien = [
                {
                    "id": 1, "nama": "Riwayat Penyakit Saat Ini",
                    "detail": [
                        { "id": 21002382, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Operasi yang pernah dialami",
                    "detail": [
                        { "id": 21002383, "nama": "Jenis, Kapan, Komplikasi yang ada", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Riwayat Perinatal",
                    "detail": [
                        { "nama": "Lama Kehamilan", "type": "label" },
                        { "id": 21002384, "nama": "Kurang Bulan", "type": "checkbox" },
                        { "id": 21002385, "nama": "Cukup Bulan", "type": "checkbox" },
                        { "id": 21002386, "nama": "Lebih Bulan", "type": "checkbox" },
                        { "nama": "Riwayat Persalinan", "type": "label" },
                        { "id": 21002387, "nama": "Spontan", "type": "checkbox" },
                        { "id": 21002388, "nama": "Sectio", "type": "checkbox" },
                        { "id": 21002389, "nama": "Vaccum Extraksi", "type": "checkbox" },
                        { "id": 21002390, "nama": "Forcef Extraksi", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Riwayat Tumbuh Kembang",
                    "detail": [
                        { "id": 21002391, "nama": "Berat Badan Saat Lahir", "satuan": "Gram", "type": "textbox2" },
                        { "id": 21002392, "nama": "Susu Formula Mulai", "satuan": "Bln/Thn", "type": "textbox2" },
                        { "id": 21002393, "nama": "Tinggi Badan", "satuan": "Cm", "type": "textbox2" },
                        { "id": 21002394, "nama": "Makanan Tambahan", "satuan": "", "type": "textbox2" },
                        { "id": 21002395, "nama": "ASI Sampai Umur", "satuan": "Bln/Thn", "type": "textbox2" },
                        { "id": 21002396, "nama": "Keluhan Tumbuh Kembang", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Riwayat Imunisasi",
                    "detail": [
                        { "id": 21002397, "nama": "Hep BI", "type": "checkbox2" },
                        { "id": 21002398, "nama": "Hep BII", "type": "checkbox2" },
                        { "id": 21002399, "nama": "Hep BIII", "type": "checkbox2" },
                        { "id": 21002400, "nama": "Hep BIV", "type": "checkbox2" },
                        { "id": 21002401, "nama": "Hep BV", "type": "checkbox2" },
                        { "id": 21002402, "nama": "DPT I", "type": "checkbox2" },
                        { "id": 21002403, "nama": "DPT II", "type": "checkbox2" },
                        { "id": 21002404, "nama": "DPT III", "type": "checkbox2" },
                        { "id": 21002405, "nama": "MMR", "type": "checkbox2" },
                        { "id": 21002406, "nama": "Campak", "type": "checkbox2" },
                        { "id": 21002407, "nama": "BCG", "type": "checkbox2" },
                        { "id": 21002408, "nama": "BCG I", "type": "checkbox2" },
                        { "id": 21002409, "nama": "BCG II", "type": "checkbox2" },
                        { "id": 21002410, "nama": "Boster III", "type": "checkbox2" },
                        { "id": 21002411, "nama": "Varilix", "type": "checkbox2" },
                        { "id": 21002412, "nama": "Polio I", "type": "checkbox2" },
                        { "id": 21002413, "nama": "Polio II", "type": "checkbox2" },
                        { "id": 21002414, "nama": "Polio III", "type": "checkbox2" },
                        { "id": 21002415, "nama": "Boster I", "type": "checkbox2" },
                        { "id": 21002416, "nama": "Boster II", "type": "checkbox2" },
                        { "id": 21002417, "nama": "Boster III", "type": "checkbox2" },
                        { "id": 21002418, "nama": "HIB I", "type": "checkbox2" },
                        { "id": 21002419, "nama": "HIB II", "type": "checkbox2" },
                        { "id": 21002420, "nama": "HIB III", "type": "checkbox2" },
                        { "id": 21002421, "nama": "HIB IV", "type": "checkbox2" },
                        { "id": 21002422, "nama": "HIB IV", "type": "checkbox2" },
                    ]
                },
            ]

            $scope.listRiwayatAlergi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002423, "nama": "Ya, Sebutkan :", "type": "checkbox" },
                        { "id": 21002424, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002425, "nama": "", "type": "textbox" },
                        { "id": 21002426, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "checkbox2" },
                        { "id": 21002427, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002428, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
                        { "id": 21002429, "nama": "1 - 3 = Nyeri Ringan", "type": "checkbox" },
                        { "id": 21002430, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
                        { "id": 21002431, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listSkalaFlacc = [
                {
                    "id": 1, "nama": "Wajah",
                    "detail": [
                        { "id": 21002432, "nama": "Tersenyum/tidak ada ekspresi khusus", "descNilai": "0", "target":"21002435", "type": "checkbox" },
                        { "id": 21002433, "nama": "Terkadang meringis/menarik diri", "descNilai": "1", "target":"21002435", "type": "checkbox" },
                        { "id": 21002434, "nama": "Sering menggetarkan dagu mengatupkan rahang", "descNilai": "2", "target":"21002435", "type": "checkbox" },
                        { "id": 21002435, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kaki",
                    "detail": [
                        { "id": 21002436, "nama": "Gerakan normal/relaksasi", "descNilai": "0", "target":"21002439", "type": "checkbox" },
                        { "id": 21002437, "nama": "Tidak tenang/tegang", "descNilai": "1", "target":"21002439", "type": "checkbox" },
                        { "id": 21002438, "nama": "Kaki dibuat menendang/menarik diri", "descNilai": "2", "target":"21002439", "type": "checkbox" },
                        { "id": 21002439, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Aktivitas",
                    "detail": [
                        { "id": 21002440, "nama": "Tidur posisi normal, mudah bergerak", "descNilai": "0", "target":"21002443", "type": "checkbox" },
                        { "id": 21002441, "nama": "Gerakan menggeliat, berguling, kaku", "descNilai": "1", "target":"21002443", "type": "checkbox" },
                        { "id": 21002442, "nama": "Melengkungkan punggung/kaki/menghentak", "descNilai": "2", "target":"21002443", "type": "checkbox" },
                        { "id": 21002443, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Menangis",
                    "detail": [
                        { "id": 21002444, "nama": "Tidak menangis (bangun/tidur)", "descNilai": "0", "target":"21002447", "type": "checkbox" },
                        { "id": 21002445, "nama": "Mengerang, merengek-rengek", "descNilai": "1", "target":"21002447", "type": "checkbox" },
                        { "id": 21002446, "nama": "Menangis terus menerus, terhisak, menjerit", "descNilai": "2", "target":"21002447", "type": "checkbox" },
                        { "id": 21002447, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bersuara",
                    "detail": [
                        { "id": 21002448, "nama": "Bersuara, normal, tenang", "descNilai": "0", "target":"21002451", "type": "checkbox" },
                        { "id": 21002449, "nama": "Tenang bila dipeluk, digendong atau diajak bicara", "descNilai": "1", "target":"21002451", "type": "checkbox" },
                        { "id": 21002450, "nama": "Kaki dibuat menendang/menarik diri", "descNilai": "2", "target":"21002451", "type": "checkbox" },
                        { "id": 21002451, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPenilaianNyeri = [
                {
                    "id": 1, "nama": "Penilaian Nyeri",
                    "detail": [
                        { "nama": "Provokatif", "type": "label" },
                        { "id": 21002453, "nama": "Ruda paksa", "type": "checkbox" },
                        { "id": 21002454, "nama": "Benturan", "type": "checkbox" },
                        { "id": 21002455, "nama": "Sayatan", "type": "checkbox" },
                        { "id": 21002456, "nama": "dll", "type": "textbox" },
                        { "nama": "Quality", "type": "label" },
                        { "id": 21002457, "nama": "Tertusuk", "type": "checkbox" },
                        { "id": 21002458, "nama": "Tertekan/tertindih", "type": "checkbox" },
                        { "id": 21002459, "nama": "Diiris-iris", "type": "checkbox" },
                        { "id": 21002460, "nama": "dll", "type": "textbox" },
                        { "nama": "Regional", "type": "label" },
                        { "id": 21002461, "nama": "Lokasi", "type": "checkbox1" },
                        { "id": 21002462, "nama": "", "type": "textbox" },
                        { "nama": "Menjalar", "type": "label" },
                        { "id": 21002463, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002464, "nama": "Ya, Ke :", "type": "checkbox2" },
                        { "id": 21002465, "nama": "", "type": "textbox" },
                        { "nama": "Scala", "type": "label" },
                        { "id": 21002466, "nama": "", "type": "textbox" },
                        { "nama": "Time", "type": "label" },
                        { "id": 21002467, "nama": "Jarang", "type": "checkbox" },
                        { "id": 21002468, "nama": "Hilang timbul", "type": "checkbox" },
                        { "id": 21002469, "nama": "Terus menerus", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPengkajian = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "A", "type": "label" },
                        { "nama": "Cara Bejalan Pasien (salah satu atau lebih) <br> 1. Tidak seimbang/sempoyongan/limbung <br> 2. Jalan dengan menggunakan alat bantu (kruk, tripot, kursi roda, orang lain)", "type": "label" },
                        { "id": 21002470, "nama": "", "type": "checkbox" },
                        { "id": 21002471, "nama": "", "type": "checkbox" },

                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "B", "type": "label" },
                        { "nama": "Menopang saat akan duduk : tampak memegang pinggiran kursi atau meja/benda lain sebagai penopang saat akan duduk.", "type": "label" },
                        { "id": 21002472, "nama": "", "type": "checkbox" },
                        { "id": 21002473, "nama": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listHasil = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak Beresiko", "type": "label" },
                        { "nama": "Tidak ditemukan A & B", "type": "label" },
                        { "id": 21002474, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Risiko Rendah", "type": "label" },
                        { "nama": "Ditemukan salah satu A/B", "type": "label" },
                        { "id": 21002475, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Risiko tinggi", "type": "label" },
                        { "nama": "Ditemukan A & B", "type": "label" },
                        { "id": 21002476, "nama": "", "type": "textarea" },
                    ]
                },
                
            ]
            $scope.listTindakan = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak beresiko", "type": "label" },
                        { "nama": "Tidak ada tindakan", "type": "label" },
                        { "id": 21002477, "nama": "", "type": "checkbox" },
                        { "id": 21002478, "nama": "", "type": "checkbox" },
                        { "id": 21002479, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Resiko rendah", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002480, "nama": "", "type": "checkbox" },
                        { "id": 21002481, "nama": "", "type": "checkbox" },
                        { "id": 21002482, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Resiko tinggi", "type": "label" },
                        { "nama": "Pasang pita/stiker resiko jatuh", "type": "label" },
                        { "id": 21002483, "nama": "", "type": "checkbox" },
                        { "id": 21002484, "nama": "", "type": "checkbox" },
                        { "id": 21002485, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 21002486, "nama": "", "type": "checkbox" },
                        { "id": 21002487, "nama": "", "type": "checkbox" },
                        { "id": 21002488, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listAssementFungsional = [
                {
                    "id": 1, "nama": "Sensorik",
                    "detail": [
                        { "nama": "Penglihatan", "type": "label" },
                        { "id": 21002489, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002490, "nama": "Kabur", "type": "checkbox" },
                        { "id": 21002491, "nama": "Kacamata", "type": "checkbox" },
                        { "id": 21002492, "nama": "Lensa kotak", "type": "checkbox" },
                        { "nama": "Penciuman", "type": "label" },
                        { "id": 21002493, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002494, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pendengaran", "type": "label" },
                        { "id": 21002495, "nama": "Normal", "type": "checkbox" },
                        { "id": 21002496, "nama": "Tuli kanan/kiri", "type": "checkbox" },
                        { "id": 21002497, "nama": "Alat bantu dengan kanan/kiri", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif",
                    "detail": [
                        { "id": 21002498, "nama": "Orientasi penuh", "type": "checkbox" },
                        { "id": 21002499, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 21002500, "nama": "Bingung", "type": "checkbox" },
                        { "id": 21002501, "nama": "Tidak dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Motorik",
                    "detail": [
                        { "nama": "Aktifitas sehari-hari", "type": "label" },
                        { "id": 21002502, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 21002503, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 21002504, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 21002505, "nama": "Ketergantungan Total", "type": "checkbox" },
                        { "nama": "Berjalan", "type": "label" },
                        { "id": 21002506, "nama": "Tidak ada kesulitan", "type": "checkbox" },
                        { "id": 21002507, "nama": "Perlu bantuan", "type": "checkbox" },
                        { "id": 21002508, "nama": "Sering Jatuh", "type": "checkbox" },
                        { "id": 21002509, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah ada penurunan berat badan yang tidak diinginkan selama 6 bulan terakhir ?",
                    "detail": [
                        { "id": 21002510, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002511, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "(Tanda: ukuran baju atau celana menjadi lebih longgar)", "type": "label" },
                        { "id": 21002512, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 21002513, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 21002514, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 21002515, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah asupan makan menurun yang dikarenakan adanya penurunan nafsu makan/kesulitan menerima makan ?",
                    "detail": [
                        { "id": 21002516, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21002517, "nama": "Tidak yakin", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listKebutuhanEdukasi = [
                {
                    "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                    "detail": [
                        { "id": 21002519, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002520, "nama": "Ya", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Jika ya, sebutkan hambatan (bisa dipilih lebih dari satu) :",
                    "detail": [
                        { "id": 21002521, "nama": "Pendengaran", "type": "checkbox" },
                        { "id": 21002522, "nama": "Penglihatan", "type": "checkbox" },
                        { "id": 21002523, "nama": "Kognitif", "type": "checkbox" },
                        { "id": 21002524, "nama": "Fisik", "type": "checkbox" },
                        { "id": 21002525, "nama": "Budaya", "type": "checkbox" },
                        { "id": 21002526, "nama": "Agama", "type": "checkbox" },
                        { "id": 21002527, "nama": "Emosi", "type": "checkbox" },
                        { "id": 21002528, "nama": "Bahasa", "type": "checkbox" },
                        { "id": 21002529, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21002530, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Dibutuhkan penerjemah",
                    "detail": [
                        { "id": 21002531, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21002532, "nama": "Ya, jika ya sebutkan", "type": "checkbox" },
                        { "id": 21002533, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Kebutuhan pembelajaran pasien (pilih topik pembelajaran pada kotak yang tersedia)",
                    "detail": [
                        { "id": 21002534, "nama": "Diagnosa & Manajemen", "type": "checkbox" },
                        { "id": 21002535, "nama": "Obat-obtan", "type": "checkbox" },
                        { "id": 21002536, "nama": "Perawatan Luka", "type": "checkbox" },
                        { "id": 21002537, "nama": "Rehabilitasi", "type": "checkbox" },
                        { "id": 21002538, "nama": "Manajemen nyeri", "type": "checkbox" },
                        { "id": 21002539, "nama": "Diet dan nutrisi", "type": "checkbox" },
                        { "id": 21002540, "nama": "Lain-lainnya", "type": "checkbox" },
                        { "id": 21002541, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerencanaanPulang = [
                {
                    "id": 1, "nama": "Kriteria Discharge Planning :",
                    "detail": [
                        { "nama": "A. Keterbatasan mobilitas", "type": "label" },
                        { "id": 21002542, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002543, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "B. Perawatan atau pengobatan lanjutan", "type": "label" },
                        { "id": 21002544, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002545, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "C. Bantuan untuk melakukan aktifitas sehari-hari", "type": "label" },
                        { "id": 21002546, "nama": "Ya", "type": "checkbox" },
                        { "id": 21002547, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bila salah satu jawaban 'Ya' dari kriteria perencanaan pulang diatas, maka akan dilanjutkan dengan perencanaan pulang sebagai berikut :",
                    "detail": [
                        { "nama": "A. Kontrol", "type": "label" },
                        { "id": 21002548, "nama": "Waktu", "type": "textbox2" },
                        { "id": 21002549, "nama": "Tempat", "type": "textbox2" },
                        { "id": 21002550, "nama": "B. Lanjutan perawat di rumah (pemasangan NGT dll)", "type": "textbox" },
                        { "id": 21002551, "nama": "C. Aturan diit/nutrisi", "type": "textbox" },
                        { "id": 21002552, "nama": "D. Obat-obatan yang masih diminum dan jumlahnya", "type": "textbox" },
                        { "id": 21002553, "nama": "E. Aktifitas dan istirahat", "type": "textbox" },
                        { "id": 21002554, "nama": "F. Data penungjang yang dibawa pulang (Hasil Lab, Foto thorax, EKG, dll)", "type": "textbox" },
                    ]
                },
            ]

            $scope.listTindakan15 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002558, "nama": "", "type": "datetime" },
                        { "id": 21002559, "nama": "", "type": "textbox" },
                        { "id": 21002560, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002561, "nama": "", "type": "datetime" },
                        { "id": 21002562, "nama": "", "type": "textbox" },
                        { "id": 21002563, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002564, "nama": "", "type": "datetime" },
                        { "id": 21002565, "nama": "", "type": "textbox" },
                        { "id": 21002566, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21002567, "nama": "", "type": "datetime" },
                        { "id": 21002568, "nama": "", "type": "textbox" },
                        { "id": 21002569, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listNamaPengkaji = [
                {
                    "id": 1, "nama": "Tanggal & Jam",
                    "detail": [
                        { "id": 21002570, "nama": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Nama Perawat",
                    "detail": [
                        { "id": 21002571, "nama": "", "type": "combobox" },
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

                $scope.item.obj[21002518] = $scope.skorNutrisi
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
                    'AsesmenAwalKeperRJAnakCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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