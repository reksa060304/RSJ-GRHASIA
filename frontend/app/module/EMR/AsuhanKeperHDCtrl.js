define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsuhanKeperHDCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.skorMorse = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210014
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
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 210014).then(function (e) {

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

            $scope.listIntervensiKeperawatan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21000971, "nama": "Monitor berat badan, intake out put", "type": "checkbox2" },
                        { "id": 21000972, "nama": "Atur posisi pasien agar ventilasi acle kuat", "type": "checkbox2" },
                        { "id": 21000973, "nama": "Berikan terapi oksigen sesuai kebutuhan", "type": "checkbox2" },
                        { "id": 21000974, "nama": "Observasi pasien (Monitor vital sign) dan mesin", "type": "checkbox2" },
                        { "id": 21000975, "nama": "Bila pasien muntah hipotensi (mual, muntah, keringat dingin, pusing), kram, hipoglikemi berikut cairan sesuai SPO.", "type": "checkbox2" },
                        { "id": 21000976, "nama": "Hentikan HD sesuai indikasi", "type": "checkbox2" },
                        { "id": 21000977, "nama": "Kaji kemampuan pasien mendapatkan nutrisi yand dibutuhkan", "type": "checkbox2" },
                        { "id": 21000978, "nama": "Posisikan supinasi dengan elevasi kepada 30 dan elevasi kaki", "type": "checkbox2" },
                        { "id": 21000979, "nama": "PENKES: diit, AV-Shunt,", "type": "checkbox2" },
                        { "id": 21000980, "nama": "", "statuan": "", "type": "textbox" },
                        { "id": 21000981, "nama": "Monitor tanda dan gejala infeksi (lokal dan sistematik)", "type": "checkbox2" },
                        { "id": 21000982, "nama": "Ganti balutan luka sesuai dengan prosedur", "type": "checkbox2" },
                        { "id": 21000983, "nama": "Monitor tanda dan gejala hipoglikemi", "type": "checkbox2" },
                        { "id": 21000984, "nama": "Lakukan teknik distraksi, relaksasi", "type": "checkbox2" },
                        { "id": 21000985, "nama": "", "statuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Intervensi Kolaborasi",
                    "detail": [
                        { "id": 21000986, "nama": "Program HD", "type": "checkbox" },
                        { "id": 21000987, "nama": "Transfusi darah", "type": "checkbox" },
                        { "id": 21000988, "nama": "Kolaborasi diit", "type": "checkbox" },
                        { "id": 21000989, "nama": "Pemberian Ca Gluconas", "type": "checkbox" },
                        { "id": 21000990, "nama": "Pemberian Antipirenik", "type": "checkbox" },
                        { "id": 21000991, "nama": "Pemberian Analgetik", "type": "checkbox" },
                        { "id": 21000992, "nama": "Pemberian Erytropoetin", "type": "checkbox" },
                        { "id": 21000993, "nama": "Pemberian preparat besi", "type": "checkbox" },
                        { "id": 21000994, "nama": "Obat-obatan emergensi", "type": "checkbox" },
                        { "id": 21000995, "nama": "Pemberian Antibiotik", "type": "checkbox" },
                        { "id": 21000996, "nama": "", "type": "textbox" },
                    ]
                },
                
            ]

            $scope.ResepHD1kiri = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21000997, "nama": "Inisiasi", "type": "checkbox" },
                        { "id": 21000998, "nama": "Akut", "type": "checkbox" },
                        { "id": 21000999, "nama": "Rutin", "type": "checkbox" },
                        { "id": 21001000, "nama": "Pre-Op", "type": "checkbox" },
                        { "id": 21001001, "nama": "SLED", "type": "checkbox" },
                        { "id": 21001002, "nama": "", "type": "checkbox" },
                        { "id": 21001003, "nama": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001004, "nama": "HD", "satuan":"jam", "type": "textbox" },
                        { "id": 21001005, "nama": "QB", "satuan":"ml/mnt", "type": "textbox" },
                        { "id": 21001006, "nama": "QD", "satuan":"ml/mnt", "type": "textbox" },
                        { "id": 21001007, "nama": "UF Goal", "satuan":"ml", "type": "textbox" },
                    ]
                },
            ]

            $scope.ResepHD2kanan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001008, "nama": "Bicarbonat", "type": "checkbox" },
                        { "id": 21001009, "nama": "Condacdivity", "type": "checkbox" },
                        { "id": 21001010, "nama": "Temperatur", "type": "checkbox" },
                    ]
                },
            ]

            $scope.ResepHD2BB = [
                {
                    "id": 1, "nama": "Resep HD",
                    "detail": [
                        { "id": 21001011, "nama": "NA", "type": "checkbox" },
                        { "id": 21001012, "nama": "", "type": "textbox2" },
                        { "id": 21001013, "nama": "UF", "type": "checkbox" },
                        { "id": 21001014, "nama": "", "type": "textbox2" },
                        { "id": 21001015, "nama": "Bicarbonat", "type": "checkbox" },
                        { "id": 21001016, "nama": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Berat Badan",
                    "detail": [
                        { "id": 21001017, "nama": "pre HD", "satuan":"kg", "type": "textbox" },
                        { "id": 21001018, "nama": "BB Post HD yang lalu", "satuan":"kg", "type": "textbox" },
                        { "id": 21001019, "nama": "BB Kering", "satuan":"kg", "type": "textbox" },
                        { "id": 21001020, "nama": "BB Post HD", "satuan":"kg", "type": "textbox" },
                    ]
                },
            ]

            $scope.Heparinisasi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001021, "nama": "Dosis sirkulasi", "type": "checkbox" },
                        { "id": 21001022, "nama": "", "satuan": "iu", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001023, "nama": "Dosis Awal", "type": "checkbox" },
                        { "id": 21001024, "nama": "", "satuan": "iu", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001025, "nama": "Dosis Maintenance Continues", "type": "checkbox" },
                        { "id": 21001026, "nama": "", "satuan": "iu/jam", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001027, "nama": "Dosis Maintenance Intermitten", "type": "checkbox" },
                        { "id": 21001028, "nama": "", "satuan": "iu/jam", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001029, "nama": "LMWH", "type": "checkbox" },
                        { "id": 21001030, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001031, "nama": "Tanpa Heparin, penyebab", "type": "checkbox" },
                        { "id": 21001032, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001033, "nama": "Program bilas NaCI 0,9% 100% cc/jam/1/2 jam", "type": "checkbox" },
                    ]
                },
            ]

            $scope.TindakanKeper1 = [
                {
                    "id": 1, "nama": "Pre-HD",
                    "detail": [
                        { "id": 21001036, "nama": "", "type": "time" },
                        { "id": 21001037, "nama": "", "type": "textbox" },
                        { "id": 21001038, "nama": "", "type": "textbox" },
                        { "id": 21001039, "nama": "", "type": "textbox" },
                        { "id": 21001040, "nama": "", "type": "textbox" },
                        { "id": 21001041, "nama": "", "type": "textbox" },
                        { "id": 21001042, "nama": "", "type": "textbox" },
                        { "id": 21001043, "nama": "", "type": "textbox" },
                        { "id": 21001044, "nama": "", "type": "textbox" },
                        { "id": 21001045, "nama": "", "type": "textbox" },
                        { "id": 21001046, "nama": "", "type": "textbox" },
                        { "id": 21001047, "nama": "", "type": "textbox" },
                        { "id": 21001048, "nama": "", "type": "textbox" },
                        { "id": 21001049, "nama": "", "type": "textarea" },
                        { "id": 21001050, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.TindakanKeper2 = [
                {
                    "id": 1, "nama": "Intra HD",
                    "detail": [
                        { "id": 21001051, "nama": "", "type": "time" },
                        { "id": 21001052, "nama": "", "type": "textbox" },
                        { "id": 21001053, "nama": "", "type": "textbox" },
                        { "id": 21001054, "nama": "", "type": "textbox" },
                        { "id": 21001055, "nama": "", "type": "textbox" },
                        { "id": 21001056, "nama": "", "type": "textbox" },
                        { "id": 21001057, "nama": "", "type": "textbox" },
                        { "id": 21001058, "nama": "", "type": "textbox" },
                        { "id": 21001059, "nama": "", "type": "textbox" },
                        { "id": 21001060, "nama": "", "type": "textbox" },
                        { "id": 21001061, "nama": "", "type": "textbox" },
                        { "id": 21001062, "nama": "", "type": "textbox" },
                        { "id": 21001063, "nama": "", "type": "textbox" },
                        { "id": 21001064, "nama": "", "type": "textarea" },
                        { "id": 21001065, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001066, "nama": "", "type": "time" },
                        { "id": 21001067, "nama": "", "type": "textbox" },
                        { "id": 21001068, "nama": "", "type": "textbox" },
                        { "id": 21001069, "nama": "", "type": "textbox" },
                        { "id": 21001070, "nama": "", "type": "textbox" },
                        { "id": 21001071, "nama": "", "type": "textbox" },
                        { "id": 21001072, "nama": "", "type": "textbox" },
                        { "id": 21001073, "nama": "", "type": "textbox" },
                        { "id": 21001074, "nama": "", "type": "textbox" },
                        { "id": 21001075, "nama": "", "type": "textbox" },
                        { "id": 21001076, "nama": "", "type": "textbox" },
                        { "id": 21001077, "nama": "", "type": "textbox" },
                        { "id": 21001078, "nama": "", "type": "textbox" },
                        { "id": 21001079, "nama": "", "type": "textarea" },
                        { "id": 21001080, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001081, "nama": "", "type": "time" },
                        { "id": 21001082, "nama": "", "type": "textbox" },
                        { "id": 21001083, "nama": "", "type": "textbox" },
                        { "id": 21001084, "nama": "", "type": "textbox" },
                        { "id": 21001085, "nama": "", "type": "textbox" },
                        { "id": 21001086, "nama": "", "type": "textbox" },
                        { "id": 21001087, "nama": "", "type": "textbox" },
                        { "id": 21001088, "nama": "", "type": "textbox" },
                        { "id": 21001089, "nama": "", "type": "textbox" },
                        { "id": 21001090, "nama": "", "type": "textbox" },
                        { "id": 21001091, "nama": "", "type": "textbox" },
                        { "id": 21001092, "nama": "", "type": "textbox" },
                        { "id": 21001093, "nama": "", "type": "textbox" },
                        { "id": 21001094, "nama": "", "type": "textarea" },
                        { "id": 21001095, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001096, "nama": "", "type": "time" },
                        { "id": 21001097, "nama": "", "type": "textbox" },
                        { "id": 21001098, "nama": "", "type": "textbox" },
                        { "id": 21001099, "nama": "", "type": "textbox" },
                        { "id": 21001100, "nama": "", "type": "textbox" },
                        { "id": 21001101, "nama": "", "type": "textbox" },
                        { "id": 21001102, "nama": "", "type": "textbox" },
                        { "id": 21001103, "nama": "", "type": "textbox" },
                        { "id": 21001104, "nama": "", "type": "textbox" },
                        { "id": 21001105, "nama": "", "type": "textbox" },
                        { "id": 21001106, "nama": "", "type": "textbox" },
                        { "id": 21001107, "nama": "", "type": "textbox" },
                        { "id": 21001108, "nama": "", "type": "textbox" },
                        { "id": 21001109, "nama": "", "type": "textarea" },
                        { "id": 21001110, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001111, "nama": "", "type": "time" },
                        { "id": 21001112, "nama": "", "type": "textbox" },
                        { "id": 21001113, "nama": "", "type": "textbox" },
                        { "id": 21001114, "nama": "", "type": "textbox" },
                        { "id": 21001115, "nama": "", "type": "textbox" },
                        { "id": 21001116, "nama": "", "type": "textbox" },
                        { "id": 21001117, "nama": "", "type": "textbox" },
                        { "id": 21001118, "nama": "", "type": "textbox" },
                        { "id": 21001119, "nama": "", "type": "textbox" },
                        { "id": 21001120, "nama": "", "type": "textbox" },
                        { "id": 21001121, "nama": "", "type": "textbox" },
                        { "id": 21001122, "nama": "", "type": "textbox" },
                        { "id": 21001123, "nama": "", "type": "textbox" },
                        { "id": 21001124, "nama": "", "type": "textarea" },
                        { "id": 21001125, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001126, "nama": "", "type": "time" },
                        { "id": 21001127, "nama": "", "type": "textbox" },
                        { "id": 21001128, "nama": "", "type": "textbox" },
                        { "id": 21001129, "nama": "", "type": "textbox" },
                        { "id": 21001130, "nama": "", "type": "textbox" },
                        { "id": 21001131, "nama": "", "type": "textbox" },
                        { "id": 21001132, "nama": "", "type": "textbox" },
                        { "id": 21001133, "nama": "", "type": "textbox" },
                        { "id": 21001134, "nama": "", "type": "textbox" },
                        { "id": 21001135, "nama": "", "type": "textbox" },
                        { "id": 21001136, "nama": "", "type": "textbox" },
                        { "id": 21001137, "nama": "", "type": "textbox" },
                        { "id": 21001138, "nama": "", "type": "textbox" },
                        { "id": 21001139, "nama": "", "type": "textarea" },
                        { "id": 21001140, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001141, "nama": "", "type": "time" },
                        { "id": 21001142, "nama": "", "type": "textbox" },
                        { "id": 21001143, "nama": "", "type": "textbox" },
                        { "id": 21001144, "nama": "", "type": "textbox" },
                        { "id": 21001145, "nama": "", "type": "textbox" },
                        { "id": 21001146, "nama": "", "type": "textbox" },
                        { "id": 21001147, "nama": "", "type": "textbox" },
                        { "id": 21001148, "nama": "", "type": "textbox" },
                        { "id": 21001149, "nama": "", "type": "textbox" },
                        { "id": 21001150, "nama": "", "type": "textbox" },
                        { "id": 21001151, "nama": "", "type": "textbox" },
                        { "id": 21001152, "nama": "", "type": "textbox" },
                        { "id": 21001153, "nama": "", "type": "textbox" },
                        { "id": 21001154, "nama": "", "type": "textarea" },
                        { "id": 21001155, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.TindakanKeper3 = [
                {
                    "id": 1, "nama": "Post HD",
                    "detail": [
                        { "id": 21001156, "nama": "", "type": "time" },
                        { "id": 21001157, "nama": "", "type": "textbox" },
                        { "id": 21001158, "nama": "", "type": "textbox" },
                        { "id": 21001159, "nama": "", "type": "textbox" },
                        { "id": 21001160, "nama": "", "type": "textbox" },
                        { "id": 21001161, "nama": "", "type": "textbox" },
                        { "id": 21001162, "nama": "", "type": "textbox" },
                        { "id": 21001163, "nama": "", "type": "textbox" },
                        { "id": 21001164, "nama": "", "type": "textbox" },
                        { "id": 21001165, "nama": "", "type": "textbox" },
                        { "id": 21001166, "nama": "", "type": "textbox" },
                        { "id": 21001167, "nama": "", "type": "textbox" },
                        { "id": 21001168, "nama": "", "type": "textbox" },
                        { "id": 21001169, "nama": "", "type": "textarea" },
                        { "id": 21001170, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listPenyulitHD = [
                {
                    "id": 1, "nama": "Penyulit selama HD :",
                    "detail": [
                        { "id": 21001171, "nama": "Masalah Akses", "type": "checkbox" },
                        { "id": 21001172, "nama": "Pendarahan", "type": "checkbox" },
                        { "id": 21001173, "nama": "First use syndrom", "type": "checkbox" },
                        { "id": 21001174, "nama": "Sakit Kepala", "type": "checkbox" },
                        { "id": 21001175, "nama": "Mual & Muntah", "type": "checkbox" },
                        { "id": 21001176, "nama": "Kram otot", "type": "checkbox" },
                        { "id": 21001177, "nama": "Hiperkalemia", "type": "checkbox" },
                        { "id": 21001178, "nama": "Hipotensi", "type": "checkbox" },
                        { "id": 21001179, "nama": "Hipertensi", "type": "checkbox" },
                        { "id": 21001180, "nama": "Nyari Data", "type": "checkbox" },
                        { "id": 21001181, "nama": "Aritmia", "type": "checkbox" },
                        { "id": 21001182, "nama": "Gatal-gatal", "type": "checkbox" },
                        { "id": 21001183, "nama": "Demam", "type": "checkbox" },
                        { "id": 21001184, "nama": "Miggigil/dingin", "type": "checkbox" },
                        { "id": 21001185, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21001186, "nama": "", "type": "textbox" },
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
            
            $scope.getSkorMorse = function (id, descNilai) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorMorse = $scope.skorMorse + parseFloat(descNilai)
                            break
                        } else {
                            $scope.skorMorse = $scope.skorMorse - parseFloat(descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[21000935] = $scope.skorMorse
            }
               
            $scope.$watch('item.obj[21000935]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai < 25 ) {
                    $scope.item.obj[21000936] = true
                    $scope.item.obj[21000937] = false
                    $scope.item.obj[21000938] = false
                   
                }
                if (nilai >= 25 && nilai <= 45) {
                    $scope.item.obj[21000936] = false
                    $scope.item.obj[21000937] = true
                    $scope.item.obj[21000938] = false
                 
                }
                if (nilai > 45) {
                    $scope.item.obj[21000936] = false
                    $scope.item.obj[21000937] = false
                    $scope.item.obj[21000938] = true
                 
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
                $scope.cc.jenisemr = 'Hemodialisa'
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
                    'AsuhanKeperHDCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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