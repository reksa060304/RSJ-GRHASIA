define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperawatanRIGrhCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000437
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000437 ).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga= []
                var arrayShiftJaga2 = []
                var arrayShiftJaga3= []
                var listKeperawatanJiwa = []
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
                    //ARRAY LISTKEPERAWATANJIWA
                    if (element.kodeexternal == 'listkeperawatanjiwa') {
                        for (let z = 0; z < listKeperawatanJiwa.length; z++) {
                            const element2 = listKeperawatanJiwa[z];
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
                            listKeperawatanJiwa.push(datax)
                        }
                    }
                    //END ARRAY LIST KEPERAWATAN JIWA
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
                //LIST KEPERAWATAN JIWA
                var gejalaKosongKeun = []
                for (let k = 0; k < listKeperawatanJiwa.length; k++) {
                    const element = listKeperawatanJiwa[k];
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
                $scope.listKeperawatanJiwa = gejalaKosongKeun
                console.log($scope.listKeperawatanJiwa);
            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
            }
            
            $scope.listFP1 = [
                {
                    "id": 1, "nama": "Faktor Predisposisi 1",
                    "detail": [
                        { "id": 3004782, "nama": "Gangguan Jiwa di masa lalu", "satuan": "", "type": "checkbox" },
                        { "id": 3004783, "nama": "Introvet", "satuan": "", "type": "checkbox" },
                        { "id": 3004784, "nama": "Konflik dengan lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3004785, "nama": "Genetik", "satuan": "", "type": "checkbox" },
                        { "id": 3004786, "nama": "Pola Asuh", "satuan": "", "type": "checkbox" },
                        { "id": 3004787, "nama": "Konflik dalam pekerjaan", "satuan": "", "type": "checkbox" },
                        { "id": 3004788, "nama": "Trauma kepala", "satuan": "", "type": "checkbox" },
                        { "id": 3004789, "nama": "Kegagalan tumbuh kembang", "satuan": "", "type": "checkbox" },
                        { "id": 3004790, "nama": "Konflik keluarga", "satuan": "", "type": "checkbox" },
                        { "id": 3004791, "nama": "Kejang", "satuan": "", "type": "checkbox" },
                        { "id": 3004792, "nama": "Pengalaman traumatis", "satuan": "", "type": "checkbox" },
                        { "id": 3004793, "nama": "Konflik pendidikan", "satuan": "", "type": "checkbox" },
                        { "id": 3004794, "nama": "Riwayat konsumsi minuman keras", "satuan": "", "type": "checkbox" },
                        { "id": 3004795, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004796"},
                        { "id": 3004797, "nama": "Konflik perkawinan", "satuan": "", "type": "checkbox" },
                        { "id": 3004798, "nama": "Riwayat penyalagunaan NAPZA", "satuan": "", "type": "checkbox" },
                        { "id": 3004799, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004800"},
                        { "id": 3004801, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004802"},
                    ]
                }
            ] 

              
            $scope.listPenampilan = [
                {
                    "id": 1, "nama": "a. Penampilan",
                    "detail": [
                        { "id": 3004804, "nama": "Rapi / bersih", "satuan": "", "type": "checkbox" },
                        { "id": 3004805, "nama": "Pakaian tidak sesuai", "satuan": "", "type": "checkbox" },
                        { "id": 3004806, "nama": "Tidak rapi / kotor", "satuan": "", "type": "checkbox" },
                        { "id": 3004807, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004808"},
                    ]
                }
            ] 
            $scope.listPembicaraan = [
                {
                    "id": 1, "nama": "b. Pembicaraan",
                    "detail": [
                        { "id": 3004809, "nama": "Koheren", "satuan": "", "type": "checkbox" },
                        { "id": 3004810, "nama": "Irrelevan", "satuan": "", "type": "checkbox" },
                        { "id": 3004811, "nama": "Logorhoe", "satuan": "", "type": "checkbox" },
                        { "id": 3004812, "nama": "Mutisme", "satuan": "", "type": "checkbox" },
                        { "id": 3004813, "nama": "Gagap", "satuan": "", "type": "checkbox" },
                        { "id": 3004814, "nama": "Cepat", "satuan": "", "type": "checkbox" },
                        { "id": 3004815, "nama": "Tidak mau memulai", "satuan": "", "type": "checkbox" },
                        { "id": 3004816, "nama": "Inkoherensi", "satuan": "", "type": "checkbox" },
                        { "id": 3004817, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004818"},
                    ]
                }
            ] 

            $scope.listAktivitasMotorik = [
                {
                    "id": 1, "nama": "c. Aktivitas Motorik",
                    "detail": [
                        { "id": 3004819, "nama": "Normoaktif", "satuan": "", "type": "checkbox" },
                        { "id": 3004820, "nama": "Agitasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004821, "nama": "Lesu", "satuan": "", "type": "checkbox" },
                        { "id": 3004822, "nama": "Gelisah", "satuan": "", "type": "checkbox" },
                        { "id": 3004823, "nama": "Tegang", "satuan": "", "type": "checkbox" },
                        { "id": 3004824, "nama": "Tremor", "satuan": "", "type": "checkbox" },
                        { "id": 3004825, "nama": "Grimansen", "satuan": "", "type": "checkbox" },
                        { "id": 3004826, "nama": "TIK", "satuan": "", "type": "checkbox" },
                        { "id": 3004827, "nama": "Implusif", "satuan": "", "type": "checkbox" },
                        { "id": 3004828, "nama": "Agresif", "satuan": "", "type": "checkbox" },
                        { "id": 3004829, "nama": "Bizare", "satuan": "", "type": "checkbox" },
                        { "id": 3004830, "nama": "Komplusif", "satuan": "", "type": "checkbox" },
                        { "id": 3004831, "nama": "Negativisme", "satuan": "", "type": "checkbox" },
                        { "id": 3004832, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004833"},
                    ]
                }
            ] 

            $scope.listAfek = [
                {
                    "id": 1, "nama": "c. Afek",
                    "detail": [
                        { "id": 3004834, "nama": "Sesuai", "satuan": "", "type": "checkbox" },
                        { "id": 3004835, "nama": "Tumpul", "satuan": "", "type": "checkbox" },
                        { "id": 3004836, "nama": "Tidak sesuai", "satuan": "", "type": "checkbox" },
                        { "id": 3004837, "nama": "Labil", "satuan": "", "type": "checkbox" },
                        { "id": 3004838, "nama": "Datar", "satuan": "", "type": "checkbox" },
                        { "id": 3004839, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004840"},
                    ]
                }
            ] 
            $scope.listInteraksiWawancara = [
                {
                    "id": 1, "nama": "e. Interaksi selama wawancara",
                    "detail": [
                        { "id": 3004841, "nama": "Kooperatif", "satuan": "", "type": "checkbox" },
                        { "id": 3004842, "nama": "Bermusuhan", "satuan": "", "type": "checkbox" },
                        { "id": 3004843, "nama": "Tidak Kooperatif", "satuan": "", "type": "checkbox" },
                        { "id": 3004844, "nama": "Curiga", "satuan": "", "type": "checkbox" },
                        { "id": 3004845, "nama": "Mudah tersinggung", "satuan": "", "type": "checkbox" },
                        { "id": 3004846, "nama": "Defensif", "satuan": "", "type": "checkbox" },
                        { "id": 3004847, "nama": "Kontak mata kurang", "satuan": "", "type": "checkbox" },
                        { "id": 3004848, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004849"},
                    ]
                }
            ] 
            $scope.listPersepsi = [
                {
                    "id": 1, "nama": "f. Persepsi",
                    "detail": [
                        { "id": 3004850, "nama": "Tidak ditemukan Kelainan", "satuan": "", "type": "checkbox" },
                        { "id": 3004851, "nama": "Halusinasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004852, "nama": "Ilusi", "satuan": "", "type": "checkbox" },
                        { "id": 3004853, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004854"},
                    ]
                }
            ] 
            $scope.listAlamPerasaan = [
                {
                    "id": 1, "nama": "e. Alam Perasaan",
                    "detail": [
                        { "id": 3004855, "nama": "Tidak ada kelainan", "satuan": "", "type": "checkbox" },
                        { "id": 3004856, "nama": "Sedih", "satuan": "", "type": "checkbox" },
                        { "id": 3004857, "nama": "Kecemasan", "satuan": "", "type": "checkbox" },
                        { "id": 3004858, "nama": "Putus asa", "satuan": "", "type": "checkbox" },
                        { "id": 3004859, "nama": "Khawatir", "satuan": "", "type": "checkbox" },
                        { "id": 3004860, "nama": "Takut", "satuan": "", "type": "checkbox" },
                        { "id": 3004861, "nama": "Gembira berlebihan", "satuan": "", "type": "checkbox" },
                        { "id": 3004862, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004863"},
                    ]
                }
            ] 
            $scope.listProsesPikir = [
                {
                    "id": 1, "nama": "h. Proses Pikir",
                    "detail": [
                        { "id": 3004864, "nama": "Tidak ada kelainan", "satuan": "", "type": "checkbox" },
                        { "id": 3004865, "nama": "Sirkumtansial", "satuan": "", "type": "checkbox" },
                        { "id": 3004866, "nama": "Preservasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004867, "nama": "Non Realistik", "satuan": "", "type": "checkbox" },
                        { "id": 3004868, "nama": "Tangensial", "satuan": "", "type": "checkbox" },
                        { "id": 3004869, "nama": "Bloking", "satuan": "", "type": "checkbox" },
                        { "id": 3004870, "nama": "Realistik", "satuan": "", "type": "checkbox" },
                        { "id": 3004871, "nama": "Autistik", "satuan": "", "type": "checkbox" },
                        { "id": 3004872, "nama": "Flight of idea", "satuan": "", "type": "checkbox" },
                        { "id": 3004873, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004874"},
                    ]
                }
            ] 
             
            $scope.listWaham = [
                {
                    "id": 1, "nama": "i. Isi Pikir (waham)",
                    "detail": [
                        { "id": 3004875, "nama": "Tidak ada waham", "satuan": "", "type": "checkbox" },
                        { "id": 3004876, "nama": "Agama", "satuan": "", "type": "checkbox" },
                        { "id": 3004877, "nama": "Nihilstik", "satuan": "", "type": "checkbox" },
                        { "id": 3004878, "nama": "Kendali Pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3004879, "nama": "Somatis", "satuan": "", "type": "checkbox" },
                        { "id": 3004880, "nama": "Curiga", "satuan": "", "type": "checkbox" },
                        { "id": 3004881, "nama": "Kebesaran", "satuan": "", "type": "checkbox" },
                        { "id": 3004882, "nama": "Sisip Pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3004883, "nama": "Siar Pikir", "satuan": "", "type": "checkbox" },
                        { "id": 3004884, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004885"},
                    ]
                }
            ] 

            $scope.listTingkatKesadaran = [
                {
                    "id": 1, "nama": "j. Tingkat kesadaran",
                    "detail": [
                        { "id": 3004886, "nama": "Composmetis", "satuan": "", "type": "checkbox" },
                        { "id": 3004887, "nama": "Sedasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004888, "nama": "Bingung orientasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004889, "nama": "Stupor", "satuan": "", "type": "checkbox" },
                        { "id": 3004890, "nama": "Orientasi baik", "satuan": "", "type": "checkbox" },
                        { "id": 3004891, "nama": "Disorientasi tempat", "satuan": "", "type": "checkbox" },
                        { "id": 3004892, "nama": "Disorientasi waktu", "satuan": "", "type": "checkbox" },
                        { "id": 3004893, "nama": "Disorientasi orang", "satuan": "", "type": "checkbox" },
                        { "id": 3004894, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004895"},
                    ]
                }
            ] 

            $scope.listMemori = [
                {
                    "id": 1, "nama": "k. Memori",
                    "detail": [
                        { "id": 3004896, "nama": "Gangguan daya ingat jangka panjang", "satuan": "", "type": "checkbox" },
                        { "id": 3004897, "nama": "Gangguan daya ingat jangka pendek", "satuan": "", "type": "checkbox" },
                        { "id": 3004898, "nama": "Gangguan daya ingat saat ini", "satuan": "", "type": "checkbox" },
                        { "id": 3004899, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004900"},
                    ]
                }
            ] 
            $scope.listTingkatKonsentrasi = [
                {
                    "id": 1, "nama": "l. Tingkat Konsentrasi dan berhitung",
                    "detail": [
                        { "id": 3004901, "nama": "Mudah beralih", "satuan": "", "type": "checkbox" },
                        { "id": 3004902, "nama": "Tidak mampu konsentrasi", "satuan": "", "type": "checkbox" },
                        { "id": 3004903, "nama": "Tidak mampu berhitung sederhana", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listKemampuanPenilaian = [
                {
                    "id": 1, "nama": "m. Kemampuan Penilaian",
                    "detail": [
                        { "id": 3004904, "nama": "Gangguan Ringan", "satuan": "", "type": "checkbox" },
                        { "id": 3004905, "nama": "Gangguan bermakna", "satuan": "", "type": "checkbox" },
                        { "id": 3004906, "nama": "Lain-lain, Jelaskan", "satuan": "", "type": "textbox2", "idd":  "3004907"},
                    ]
                }
            ] 

            
            $scope.listDayaTilik = [
                {
                    "id": 1, "nama": "n Daya Tilik Diri",
                    "detail": [
                        { "id": 3004908, "nama": "Menyadari penyakitnya", "satuan": "", "type": "checkbox" },
                        { "id": 3004909, "nama": "Mengingkari penyakit yang diderita", "satuan": "", "type": "checkbox" },
                        { "id": 3004910, "nama": "Menyalahkan hal-hal yang diluar dirinya", "satuan": "", "type": "checkbox" },
                        { "id": 3004911, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004912"},
                    ]
                }
            ] 

            $scope.listBunuhDiri = [
                {
                    "id": 1, "nama": "Skrining Risiko Bunuh Diri",
                    "detail": [
                        { "id": 3004913, "nama": "Ada percobaan bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3004914, "nama": "Ada ide bunuh diri / isyarat bunuh diri", "satuan": "", "type": "checkbox" },
                        { "id": 3004915, "nama": "Mengungkapkan keinginan bunuh diri", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listStatusFisik = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 3004916, "nama": "TD", "satuan": "", "type": "textbox" },
                        { "id": 3004917, "nama": "N", "satuan": "", "type": "textbox" },
                        { "id": 3004918, "nama": "S", "satuan": "", "type": "textbox" },
                        { "id": 3004919, "nama": "R", "satuan": "", "type": "textbox" },
                        { "id": 3004920, "nama": "Jelaskan", "satuan": "", "type": "textbox" },
                       
                    ]
                }
            ]
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 3004921, "nama": "0= Tidak Nyeri", "type": "checkbox" },
                    { "id": 3004922, "nama": "1 - 3= Nyeri Ringan", "type": "checkbox"},
                    { "id": 3004923, "nama": "4 - 6= Nyeri Sedang", "type": "checkbox" },
                    { "id": 3004924, "nama": "7 - 10= Nyeri Berat", "type": "checkbox"},
                ]
            }
        ]

            $scope.listAsesmenNyeriWong = [
                {
                    "id": 1, "nama": "Asesmen Nyeri",
                    "detail": [
                        { "id": 3004925, "nama": "0    (Tidak Nyeri)", "satuan": "", "type": "checkbox" },
                        { "id": 3004926, "nama": "1-3  (Ringan)", "satuan": "", "type": "checkbox" },
                        { "id": 3004927, "nama": "4-6  (Sedang)", "satuan": "", "type": "checkbox" },
                        { "id": 3004928, "nama": "7-10   (Berat)", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
             
           
        $scope.listNyeriAnak = [
            {
                "id": 10, "nama": "Hurts", "detail": [
                { "id": 3004929, "nama": "Tidak Nyeri","nama1": "0", "descNilai": 0 },
                { "id": 3004930, "nama": "Sedikit Nyeri", "nama1": "1 2 3", "descNilai": 2 }, 
                { "id": 3004931, "nama": "Agak mengganggu", "nama1": "4", "descNilai": 4 },
                { "id": 3004932, "nama": "Mengganggu Aktivitas","nama1": "5 6 7",  "descNilai": 6}, 
                { "id": 3004933, "nama": "Sangat mengganggu", "nama1": "8", "descNilai": 8 },
                { "id": 3004934, "nama": "Tak tertahankan", "nama1": "9 10",  "descNilai": 10 }
            ]
            }
        ]

        $scope.listSkorWong = [{
            "id": 9, "nama": "Score ",
            "detail": [
                { "id": 3004935, "nama": "0= Tidak Ada Nyeri", "type": "checkbox"},
                { "id": 3004936, "nama": "1 - 2 - 3= Sedikit Nyeri", "type": "checkbox"},
                { "id": 3004937, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                { "id": 3004938, "nama": "5 - 6 - 7= Mengganggu aktivitas", "type": "checkbox"},
                { "id": 3004939, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                { "id": 3004940, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
            ]
        }]
            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 3004941, "nama": "Tidak Nyeri", "type": "checkbox" },
                        { "id": 3004942, "nama": "Sedikit Nyeri", "type": "checkbox" },
                        { "id": 3004943, "nama": "Agak Mengganggu", "type": "checkbox" },
                        { "id": 3004944, "nama": "Mengganggu Aktivitas", "type": "checkbox" },
                        { "id": 3004945, "nama": "Sangat Mengganggu", "type": "checkbox" },
                        { "id": 3004946, "nama": "Tak Tertahankan", "type": "checkbox" },
                    ]
                },
            ]


            $scope.listRisikoJatuh = [
                {
                    "id": 1, "nama": "Risiko Jatuh",
                    "detail": [
                        { "id": 3004950, "nama": "Risiko jatuh >=90", "satuan": "", "type": "checkbox" },
                        { "id": 3004951, "nama": "Tidak risiko jatuh < 90", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

          
            $scope.listNutrisionalAnak = [
                {
                    "id": 1,  "no": 1, "nama":" Nafsu Makan",
                    "detail": [
                        { "id": 3004954, "nama": "a. Nafsu makan baik", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004955, "nama": "b. Intake makanan kurang/sisa makanan <= 1/2 porsi", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3004956, "nama": "c. Tidak ada nafsu makan > 24 jam", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Kemampuan untuk makan",
                    "detail": [
                        { "id": 3004957, "nama": "a. Tidak ada kesulitan makan, tidak diare/muntah", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004958, "nama": "b. Ada masalah makan, sering muntah, diare ringan", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3004959, "nama": "c. Butuh bantuan makan, muntah sedang, diare 1-2 kali sehari", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3004960, "nama": "d. Tidak dapat makan secara oral, disfagia, muntah berat, diare 2 kali sehari", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 3, "nama": "Faktor stres",
                    "detail": [
                        { "id": 3004961, "nama": "a. Tidak ada", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004962, "nama": "b. Pembedahan ringan attau ada infeksi", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3004963, "nama": "c. Penyakit kronik, gastrointestinal, inflamatory bowel disease", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3004964, "nama": "d. Luka bakar, patah tulang, sepsis, penyakit malignancy", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 4, "nama": "Persentil BB",
                    "detail": [
                        { "id": 3004965, "nama": "a. BB/TB sesuai standar", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004966, "nama": "b. 90 - 99% BB/TB", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3004967, "nama": "c. 80 - 90% BB/TB", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3004968, "nama": "d. < 79% BB/TB", "descNilai" : "3", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 3004970, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004971, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 3004972, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3004973, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3004974, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 3004975, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 3004976, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 3004977, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3004978, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3004980, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3004981, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]

            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 3004982, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 3004983, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        { "id": 3004984, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 3004985, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        { "id": 3004986, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 3004987, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004988"},
                    ]
                }
            ]
          
            $scope.listKebutuhanTidur = [
                {
                    "id": 1, "nama": "7. Kebutuhan Tidur",
                    "detail": [
                        { "id": 3004989, "nama": "Tidak ada Gangguan", "satuan": "", "type": "checkbox" },
                        { "id": 3004990, "nama": "Sering terjaga", "satuan": "", "type": "checkbox" },
                        { "id": 3004991, "nama": "Kesulitan memulai tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3004992, "nama": "Perubahan pola tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3004993, "nama": "Ketidakpuasan tidur", "satuan": "", "type": "checkbox" },
                        { "id": 3004994, "nama": "Tidur malam pukul (brp s/d brp?)", "satuan": "", "type": "textbox2", "idd":  "3004995"},
                        { "id": 3004996, "nama": "Tidur siang pukul (brp s/d brp?)", "satuan": "", "type": "textbox2", "idd":  "3004997"},
                        { "id": 3004998, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3004999"},
                    ]
                }
            ] 

            $scope.listMandi = [
                {
                    "id": 1, "nama": "a. Mandi",
                    "detail": [
                        { "id": 3005000, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005001, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005002, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listToileting = [
                {
                    "id": 1, "nama": "b. Toileting",
                    "detail": [
                        { "id": 3005003, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005004, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005005, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            
            $scope.listBerpakaian = [
                {
                    "id": 1, "nama": "c. Berpakaian",
                    "detail": [
                        { "id": 3005006, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005007, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005008, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listMakan = [
                {
                    "id": 1, "nama": "d. Makan",
                    "detail": [
                        { "id": 3005009, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005010, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005011, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listMinumObat = [
                {
                    "id": 1, "nama": "9. Minum Obat",
                    "detail": [
                        { "id": 3005012, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 3005013, "nama": "Tidak teratus", "satuan": "", "type": "checkbox" },
                        { "id": 3005014, "nama": "Tidak Minum", "satuan": "", "type": "checkbox" },
                        { "id": 3005015, "nama": "Belum pernah berobat", "satuan": "", "type": "checkbox" },
                        { "id": 3005016, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005017"},
                    ]
                }
            ] 

            $scope.listGambaranDiri = [
                {
                    "id": 1, "nama": "a. Gambaran Diri",
                    "detail": [
                        { "id": 3005018, "nama": "Mengungkapkan kecacatan", "satuan": "", "type": "checkbox" },
                        { "id": 3005019, "nama": "Kehilangan bagian tubuh", "satuan": "", "type": "checkbox" },
                        { "id": 3005020, "nama": "Fungsi atau struktur tubuh berubah atau hilang", "satuan": "", "type": "checkbox" },
                        { "id": 3005021, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005022"},
                    ]
                }
            ] 

            $scope.listIdentitas = [
                {
                    "id": 1, "nama": "b. Identitas",
                    "detail": [
                        { "id": 3005023, "nama": "Menolak dirinya sesuai jenis kelamin", "satuan": "", "type": "checkbox" },
                        { "id": 3005024, "nama": "Penampilan tidak sesuai jenis kelamin", "satuan": "", "type": "checkbox" },
                        { "id": 3005025, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005026"},
                    ]
                }
            ] 

            $scope.listPeran = [
                {
                    "id": 1, "nama": "c. Peran",
                    "detail": [
                        { "id": 3005027, "nama": "Overload Peran", "satuan": "", "type": "checkbox" },
                        { "id": 3005028, "nama": "Perubahan peran", "satuan": "", "type": "checkbox" },
                        { "id": 3005029, "nama": "Transisi peran karena sakit", "satuan": "", "type": "checkbox" },
                        { "id": 3005030, "nama": "Konflik Peran", "satuan": "", "type": "checkbox" },
                        { "id": 3005031, "nama": "Keraguan Peran", "satuan": "", "type": "checkbox" },
                        { "id": 3005032, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005033"},
                    ]
                }
            ] 

            $scope.listIdealDiri = [
                {
                    "id": 1, "nama": "d. Ideal Diri",
                    "detail": [
                        { "id": 3005034, "nama": "Masa depan suram", "satuan": "", "type": "checkbox" },
                        { "id": 3005035, "nama": "Terserah pada nasib", "satuan": "", "type": "checkbox" },
                        { "id": 3005036, "nama": "Tidak memiliki harapan", "satuan": "", "type": "checkbox" },
                        { "id": 3005037, "nama": "Enggan membicarakan masa depan", "satuan": "", "type": "checkbox" },
                        { "id": 3005038, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005039"},
                    ]
                }
            ] 

            $scope.listHargaDiri = [
                {
                    "id": 1, "nama": "d. Harga Diri",
                    "detail": [
                        { "id": 3005040, "nama": "Menilai diri negatif", "satuan": "", "type": "checkbox" },
                        { "id": 3005041, "nama": "Merasa malu / bersalah", "satuan": "", "type": "checkbox" },
                        { "id": 3005042, "nama": "Merasa tidak mampu melakukan apapun", "satuan": "", "type": "checkbox" },
                        { "id": 3005043, "nama": "Meremehkan kemampuan mengatasi masalah", "satuan": "", "type": "checkbox" },
                        { "id": 3005044, "nama": "Merasa tidak memiliki kelebihan atau kemampuan positif", "satuan": "", "type": "checkbox" },
                        { "id": 3005045, "nama": "Melebih lebihkan penilaian negatif tentang diri sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005046, "nama": "Menolak penilalian positif diri sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005047, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005048"},
                    ]
                }
            ] 

            $scope.listSosialisasi = [
                {
                    "id": 1, "nama": "11. Sosisalisasi",
                    "detail": [
                        { "id": 3005049, "nama": "Menarik diri", "satuan": "", "type": "checkbox" },
                        { "id": 3005050, "nama": "Berperan aktif", "satuan": "", "type": "checkbox" },
                        { "id": 3005051, "nama": "Perilaku tidak dapat diterima lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3005052, "nama": "Tidak puas dalam hubungan sosial", "satuan": "", "type": "checkbox" },
                        { "id": 3005053, "nama": "Merasa berbeda dengan orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3000854, "nama": "Tidak percaya diri saat berhadapan dengan orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3000855, "nama": "Riwayat ditolak lingkungan sosial", "satuan": "", "type": "checkbox" },
                        { "id": 3005056, "nama": "Merasa ingin sendiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005057, "nama": "Merasa tidak nyaman / aman di lingkungan sosial", "satuan": "", "type": "checkbox" },
                        { "id": 3005058, "nama": "Tidak berminat / menolak interaksi dengan orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3005059, "nama": "Lainnya, Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005060"},
                    ]
                }
            ] 

            $scope.listSpiritual = [
                {
                    "id": 1, "nama": "11. Sosisalisasi",
                    "detail": [
                       
                        { "id": 3005061, "nama": "a. Nilai dan keyakinan yang dianut", "satuan": "", "type": "checkbox" },
                        { "id": 3005064, "nama": "b. Kegiatan ibadah dirumah", "satuan": "", "type": "checkbox" },
                        { "id": 3005062, "nama": "Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005063"},
                        { "id": 3005065, "nama": "Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005066"},
                    ]
                }
            ] 

            $scope.listAdaptif = [
                {
                    "id": 1, "nama": "Adaptif",
                    "detail": [
                       
                        { "id": 3005067, "nama": "Mampu menyelesaikan masalah", "satuan": "", "type": "checkbox" },
                        { "id": 3005068, "nama": "Bicara dengan orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3005069, "nama": "Aktifitas Kontruktif", "satuan": "", "type": "checkbox" },
                        { "id": 3005070, "nama": "Teknik relaksasi", "satuan": "", "type": "checkbox" },
                        { "id": 3005071, "nama": "Olahraga", "satuan": "", "type": "checkbox" },
                        { "id": 3005072, "nama": "Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005073"},
                    ]
                }
            ] 
            
            $scope.listMaladaptif = [
                {
                    "id": 1, "nama": "Maladaptif",
                    "detail": [
                       
                        { "id": 3005074, "nama": "Menciderai diri dan orang lain", "satuan": "", "type": "checkbox" },
                        { "id": 3005075, "nama": "Menghindar", "satuan": "", "type": "checkbox" },
                        { "id": 3005076, "nama": "Bekerja berlebihan", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listKeluarga = [
                {
                    "id": 1, "nama": "14. Keluarga",
                    "detail": [
                       
                        { "id": 3005077, "nama": "Tidak memahami masalah kesehatan pasien", "satuan": "", "type": "checkbox" },
                        { "id": 3005078, "nama": "Peningkatan gejala pada pasien", "satuan": "", "type": "checkbox" },
                        { "id": 3005079, "nama": "Kegagalan mengurangi faktor risiko kekambuhan", "satuan": "", "type": "checkbox" },
                        { "id": 3005080, "nama": "Penolakan keluarga terhadap pasien", "satuan": "", "type": "checkbox" },
                        { "id": 3005081, "nama": "Kurang perhatian pada penyakit pasien", "satuan": "", "type": "checkbox" },
                        { "id": 3005082, "nama": "Ketidak tertarikan keluarga terhadap penyakit pasien dan perawatannya", "satuan": "", "type": "checkbox" },
                        { "id": 3005083, "nama": "Mengungkapkan kesulitan dalam melakukan perawatan terhadap pasien", "satuan": "", "type": "checkbox" },
                        { "id": 3005084, "nama": "Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005085"},
                    ]
                }
            ] 
           
            $scope.listMakanan = [
                {
                    "id": 1, "nama": "1. Makanan",
                    "detail": [
                        { "id": 3005086, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005087, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005088, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
            $scope.listKesehatan = [
                {
                    "id": 1, "nama": "2. Kesehatan",
                    "detail": [
                        { "id": 3005089, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005090, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005091, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listPakaian = [
                {
                    "id": 1, "nama": "3. Pakaian",
                    "detail": [
                        { "id": 3005092, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005093, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005094, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listTempatTinggal = [
                {
                    "id": 1, "nama": "4. Tempat tinggal",
                    "detail": [
                        { "id": 3005095, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005096, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005097, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listUang = [
                {
                    "id": 1, "nama": "1. Mengelola Uang",
                    "detail": [
                        { "id": 3005098, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005099, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005100, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 

            $scope.listTransportasi = [
                {
                    "id": 1, "nama": "1. Melakukan transportasi",
                    "detail": [
                        { "id": 3005101, "nama": "Mandiri", "satuan": "", "type": "checkbox" },
                        { "id": 3005102, "nama": "Bantuan minimal", "satuan": "", "type": "checkbox" },
                        { "id": 3005103, "nama": "Bantuan Total", "satuan": "", "type": "checkbox" },
                        { "id": 3005104, "nama": "Jelaskan  ", "satuan": "", "type": "textbox2", "idd":  "3005105"},
                    ]
                }
            ] 
           
            $scope.listKeperawatanUmum = [
                {
                    "id": 1, "nama": "Masalah Keperawatan Umum",
                    "detail": [
                        { "id": 3005106, "nama": "Bersihan jalan nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3005107, "nama": "Gangguan ventilasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3005108, "nama": "Gangguan sirkulasi spontan", "satuan": "", "type": "checkbox" },
                        { "id": 3005109, "nama": "Pola nafas tidak efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3005110, "nama": "Nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 3005111, "nama": "Ketidakstabilan gula darah", "satuan": "", "type": "checkbox" },
                        { "id": 3005112, "nama": "Gangguan integritas kulit", "satuan": "", "type": "checkbox" },
                        { "id": 3005113, "nama": "Hipertermia", "satuan": "", "type": "checkbox" },
                        { "id": 3005114, "nama": "Diare", "satuan": "", "type": "checkbox" },
                        { "id": 3005115, "nama": "Hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3005116, "nama": "Lainnya", "satuan": "", "type": "textbox2", "idd":  "3005117"},
                        { "id": 3005118, "nama": "Lainnya", "satuan": "", "type": "textbox2", "idd":  "3005119"},
                    ]
                }
            ] 


            // $scope.listKeperawatanJiwa = [
            //     {
            //         "id": 1, "nama": "Masalah Keperawatan Jiwa",
            //         "detail": [
            //             { "id": 3005120, "nama": "Perilaku kekerasan", "satuan": "", "type": "checkbox" },
            //             { "id": 3005121, "nama": "Risiko bunuh diri", "satuan": "", "type": "checkbox" },
            //             { "id": 3005122, "nama": "Risiko perilaku kekerasan", "satuan": "", "type": "checkbox" },
            //             { "id": 3005123, "nama": "Gangguan persepsi sensori", "satuan": "", "type": "checkbox" },
            //             { "id": 3005124, "nama": "Gangguan proses Pikir", "satuan": "", "type": "checkbox" },
            //             { "id": 3005125, "nama": "Defisit perawatan diri", "satuan": "", "type": "checkbox" },
            //             { "id": 3005126, "nama": "Isolasi sosial", "satuan": "", "type": "checkbox" },
            //             { "id": 3005127, "nama": "Harga diri rendah", "satuan": "", "type": "checkbox" },
            //             { "id": 3005128, "nama": "Ansietas", "satuan": "", "type": "checkbox" },
            //             { "id": 3005129, "nama": "Berduka", "satuan": "", "type": "checkbox" },
            //             { "id": 3005130, "nama": "Gangguan memori", "satuan": "", "type": "checkbox" },
            //             { "id": 3005131, "nama": "Deprivasi tidur", "satuan": "", "type": "checkbox" },
            //             { "id": 3005132, "nama": "Manajemen kesehatan keluarga tidak efektif", "satuan": "", "type": "checkbox" },
            //             { "id": 3005133, "nama": "Ketidakmampuan koping keluarga", "satuan": "", "type": "checkbox" },
            //             { "id": 3005134, "nama": "Lainnya", "satuan": "", "type": "textbox2", "idd":  "3005135"},
            //             { "id": 3005136, "nama": "Lainnya", "satuan": "", "type": "textbox2", "idd":  "3005137"},
            //         ]
            //     }
            // ] 
           
           
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
            $scope.$watch('item.obj[3005139]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[3004921] = true
                    $scope.item.obj[3004922] = false
                    $scope.item.obj[3004923] = false
                    $scope.item.obj[3004924] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[3004921] = false
                    $scope.item.obj[3004922] = true
                    $scope.item.obj[3004923] = false
                    $scope.item.obj[3004924] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[3004921] = false
                    $scope.item.obj[3004922] = false
                    $scope.item.obj[3004923] = true
                    $scope.item.obj[3004924] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[3004921] = false
                    $scope.item.obj[3004922] = false
                    $scope.item.obj[3004923] = false
                    $scope.item.obj[3004924] = true
                }
            });

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[3004935] = true
                    $scope.item.obj[3004936] = false
                    $scope.item.obj[3004937] = false
                    $scope.item.obj[3004938] = false
                    $scope.item.obj[3004939] = false
                    $scope.item.obj[3004940] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[3004935] = false
                    $scope.item.obj[3004936] = true
                    $scope.item.obj[3004937] = false
                    $scope.item.obj[3004938] = false
                    $scope.item.obj[3004939] = false
                    $scope.item.obj[3004940] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[3004935] = false
                    $scope.item.obj[3004936] = false
                    $scope.item.obj[3004937] = true
                    $scope.item.obj[3004938] = false
                    $scope.item.obj[3004939] = false
                    $scope.item.obj[3004940] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[3004935] = false
                    $scope.item.obj[3004936] = false
                    $scope.item.obj[3004937] = false
                    $scope.item.obj[3004938] = true
                    $scope.item.obj[3004939] = false
                    $scope.item.obj[3004940] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[3004935] = false
                    $scope.item.obj[3004936] = false
                    $scope.item.obj[3004937] = false
                    $scope.item.obj[3004938] = false
                    $scope.item.obj[3004939] = true
                    $scope.item.obj[3004940] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[3004935] = false
                    $scope.item.obj[3004936] = false
                    $scope.item.obj[3004937] = false
                    $scope.item.obj[3004938] = false
                    $scope.item.obj[3004939] = false
                    $scope.item.obj[3004940] = true
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
                $scope.item.obj[3004979] = $scope.skorNutrisiDewasa
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
                $scope.item.obj[3004969] = $scope.skorNutrisiAnak
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
                    'AsesmenAwalKeperawatanRIGrhCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
