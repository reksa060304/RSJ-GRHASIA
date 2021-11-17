define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarTilikPraOperasiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 210016
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
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 210016).then(function (e) {

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

            $scope.listStatusPasien = [
                {
                    "id": 1, "no": 1, "nama": "Status Pasien",
                    "detail": [
                        { "id": 21040372, "type": "checkbox", "nama": "Ada" },
                        { "id": 21040373, "type": "checkbox", "nama": "Tunda Medis" },
                        { "id": 21040374, "type": "checkbox", "nama": "Tunda Non Medis" },
                    ]
                },
                {
                    "id": 1, "no": 1, "nama": "Identifikasi",
                    "detail": [
                        { "id": 21040375, "type": "checkbox", "nama": "Tepasang" },
                        { "id": 21040376, "type": "checkbox", "nama": "Tidak Terpasang" },
                    ]
                },
                {
                    "id": 1, "no": 1, "nama": "Klasifikasi Operasi",
                    "detail": [
                        { "id": 21040377, "type": "checkbox", "nama": "Bersih" },
                        { "id": 21040378, "type": "checkbox", "nama": "Kotor" },
                        { "id": 21040379, "type": "checkbox", "nama": "Bersih terkontaminasi" },
                    ]
                },
            ]

            $scope.listPraOperasi = [
                {
                    "id": 1, "no": 1, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Status Pasien (ruangan & poliklinik)", "type": "label" },
                        { "id": 21001207, "nama": "", "type": "checkbox" },
                        { "id": 21001208, "nama": "", "type": "checkbox" },
                        { "id": 21001209, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Informed consent (Bedah & Anestesi)", "type": "label" },
                        { "id": 21001210, "nama": "", "type": "checkbox" },
                        { "id": 21001211, "nama": "", "type": "checkbox" },
                        { "id": 21001212, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 3, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Gelang Identitas Terpasang", "type": "label" },
                        { "id": 21001213, "nama": "", "type": "checkbox" },
                        { "id": 21001214, "nama": "", "type": "checkbox" },
                        { "id": 21001215, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 4, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Penyakit Dalam", "type": "label" },
                        { "id": 21001216, "nama": "", "type": "checkbox" },
                        { "id": 21001217, "nama": "", "type": "checkbox" },
                        { "id": 21001218, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 5, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Paru", "type": "label" },
                        { "id": 21001219, "nama": "", "type": "checkbox" },
                        { "id": 21001220, "nama": "", "type": "checkbox" },
                        { "id": 21001221, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 6, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Anak", "type": "label" },
                        { "id": 21001222, "nama": "", "type": "checkbox" },
                        { "id": 21001223, "nama": "", "type": "checkbox" },
                        { "id": 21001224, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 7, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Anestesi", "type": "label" },
                        { "id": 21001225, "nama": "", "type": "checkbox" },
                        { "id": 21001226, "nama": "", "type": "checkbox" },
                        { "id": 21001227, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 8, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Kardiologi", "type": "label" },
                        { "id": 21001228, "nama": "", "type": "checkbox" },
                        { "id": 21001229, "nama": "", "type": "checkbox" },
                        { "id": 21001230, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 9, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Syaraf", "type": "label" },
                        { "id": 21001231, "nama": "", "type": "checkbox" },
                        { "id": 21001232, "nama": "", "type": "checkbox" },
                        { "id": 21001233, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 10, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Konsul Spesialis lain :", "type": "label" },
                        { "id": 21001234, "nama": "", "type": "checkbox" },
                        { "id": 21001235, "nama": "", "type": "checkbox" },
                        { "id": 21001236, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 11, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Golongan Darah & Darah Tersedia", "type": "label" },
                        { "id": 21001237, "nama": "", "type": "checkbox" },
                        { "id": 21001238, "nama": "", "type": "checkbox" },
                        { "id": 21001239, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 12, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Hasil Laboratorium", "type": "label" },
                        { "id": 21001240, "nama": "", "type": "checkbox" },
                        { "id": 21001241, "nama": "", "type": "checkbox" },
                        { "id": 21001242, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 13, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Hasil Radiologi, USG, CT Scan, MRI", "type": "label" },
                        { "id": 21001243, "nama": "", "type": "checkbox" },
                        { "id": 21001244, "nama": "", "type": "checkbox" },
                        { "id": 21001245, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 14, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Hasil ECHO", "type": "label" },
                        { "id": 21001246, "nama": "", "type": "checkbox" },
                        { "id": 21001247, "nama": "", "type": "checkbox" },
                        { "id": 21001248, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 15, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Puasa", "type": "label" },
                        { "id": 21001249, "nama": "", "type": "checkbox" },
                        { "id": 21001250, "nama": "", "type": "checkbox" },
                        { "id": 21001251, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 16, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Huknah", "type": "label" },
                        { "id": 21001252, "nama": "", "type": "checkbox" },
                        { "id": 21001253, "nama": "", "type": "checkbox" },
                        { "id": 21001254, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 17, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Kebersihan pasien", "type": "label" },
                        { "id": 21001255, "nama": "", "type": "checkbox" },
                        { "id": 21001256, "nama": "", "type": "checkbox" },
                        { "id": 21001257, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 18, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Area operasi dicukur sesuai kebutuhan", "type": "label" },
                        { "id": 21001258, "nama": "", "type": "checkbox" },
                        { "id": 21001259, "nama": "", "type": "checkbox" },
                        { "id": 21001260, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 19, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Accesories telah dilepas", "type": "label" },
                        { "id": 21001261, "nama": "", "type": "checkbox" },
                        { "id": 21001262, "nama": "", "type": "checkbox" },
                        { "id": 21001263, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 20, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Penandaan (Mark Side)", "type": "label" },
                        { "id": 21001264, "nama": "", "type": "checkbox" },
                        { "id": 21001265, "nama": "", "type": "checkbox" },
                        { "id": 21001266, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 21, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Infuse", "type": "label" },
                        { "id": 21001267, "nama": "", "type": "checkbox" },
                        { "id": 21001268, "nama": "", "type": "checkbox" },
                        { "id": 21001269, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 22, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Kateter", "type": "label" },
                        { "id": 21001270, "nama": "", "type": "checkbox" },
                        { "id": 21001271, "nama": "", "type": "checkbox" },
                        { "id": 21001272, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 23, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Alat Khusus/Implant tersedia", "type": "label" },
                        { "id": 21001273, "nama": "", "type": "checkbox" },
                        { "id": 21001274, "nama": "", "type": "checkbox" },
                        { "id": 21001275, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 24, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Pesanan ICU tersedia", "type": "label" },
                        { "id": 21001276, "nama": "", "type": "checkbox" },
                        { "id": 21001277, "nama": "", "type": "checkbox" },
                        { "id": 21001278, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 25, "nama": "",
                    "detail": [
                        { "id": 21001661, "nama": "", "type": "textbox" },
                        { "id": 21001279, "nama": "", "type": "checkbox" },
                        { "id": 21001280, "nama": "", "type": "checkbox" },
                        { "id": 21001281, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 26, "nama": "",
                    "detail": [
                        { "id": 21001662, "nama": "", "type": "textbox" },
                        { "id": 21001282, "nama": "", "type": "checkbox" },
                        { "id": 21001283, "nama": "", "type": "checkbox" },
                        { "id": 21001284, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 27, "nama": "",
                    "detail": [
                        { "id": 21001663, "nama": "", "type": "textbox" },
                        { "id": 21001285, "nama": "", "type": "checkbox" },
                        { "id": 21001286, "nama": "", "type": "checkbox" },
                        { "id": 21001287, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 28, "nama": "",
                    "detail": [
                        { "id": 21001664, "nama": "", "type": "textbox" },
                        { "id": 21001288, "nama": "", "type": "checkbox" },
                        { "id": 21001289, "nama": "", "type": "checkbox" },
                        { "id": 21001290, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 29, "nama": "",
                    "detail": [
                        { "id": 21001665, "nama": "", "type": "textbox" },
                        { "id": 21001291, "nama": "", "type": "checkbox" },
                        { "id": 21001292, "nama": "", "type": "checkbox" },
                        { "id": 21001293, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 30, "nama": "",
                    "detail": [
                        { "id": 21001666, "nama": "", "type": "textbox" },
                        { "id": 21001294, "nama": "", "type": "checkbox" },
                        { "id": 21001295, "nama": "", "type": "checkbox" },
                        { "id": 21001296, "nama": "", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNama1 = [
                {
                    "id": 1, "nama": "Perawat RI",
                    "detail": [
                        { "id": 21001298, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat Pre Med",
                    "detail": [
                        { "id": 21001299, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat OK",
                    "detail": [
                        { "id": 21001300, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listNama2 = [
                {
                    "id": 1, "nama": "Penata Anestesi",
                    "detail": [
                        { "id": 21001301, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat RR",
                    "detail": [
                        { "id": 21001302, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat RI",
                    "detail": [
                        { "id": 21001303, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listPemberianObat = [
                {
                    "id": 1, "nama": "Antibiotik",
                    "detail": [
                        { "id": 21001667, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001668, "nama": "Jam", "type": "time" },
                        { "id": 21001669, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001670, "nama": "Jam", "type": "time" },
                        { "id": 21001671, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001672, "nama": "Jam", "type": "time" },
                    ]
                },
                {
                    "id": 1, "nama": "Lain - lain",
                    "detail": [
                        { "id": 21001673, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001674, "nama": "Jam", "type": "time" },
                        { "id": 21001675, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001676, "nama": "Jam", "type": "time" },
                        { "id": 21001677, "nama": "", "satuan": "Cc/mg", "type": "textbox" },
                        { "id": 21001678, "nama": "Jam", "type": "time" },
                    ]
                },
            ]

            $scope.listBahanAlatObat = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21001679, "nama": "1.", "satuan": "", "type": "textbox" },
                        { "id": 21001680, "nama": "8.", "satuan": "", "type": "textbox" },
                        { "id": 21001681, "nama": "2.", "satuan": "", "type": "textbox" },
                        { "id": 21001682, "nama": "9.", "satuan": "", "type": "textbox" },
                        { "id": 21001683, "nama": "3.", "satuan": "", "type": "textbox" },
                        { "id": 21001684, "nama": "10.", "satuan": "", "type": "textbox" },
                        { "id": 21001685, "nama": "4.", "satuan": "", "type": "textbox" },
                        { "id": 21001686, "nama": "11.", "satuan": "", "type": "textbox" },
                        { "id": 21001687, "nama": "5.", "satuan": "", "type": "textbox" },
                        { "id": 21001688, "nama": "12.", "satuan": "", "type": "textbox" },
                        { "id": 21001689, "nama": "6.", "satuan": "", "type": "textbox" },
                        { "id": 21001690, "nama": "13.", "satuan": "", "type": "textbox" },
                        { "id": 21001691, "nama": "7.", "satuan": "", "type": "textbox" },
                        { "id": 21001692, "nama": "14.", "satuan": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerincianBahan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "1.", "satuan": "", "type": "label" },
                        { "id": 21001693, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001694, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001695, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 2, "nama": "8.", "satuan": "", "type": "label" },
                        { "id": 21001696, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001697, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001698, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 3, "nama": "2.", "satuan": "", "type": "label" },
                        { "id": 21001699, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001700, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001701, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 4, "nama": "9.", "satuan": "", "type": "label" },
                        { "id": 21001702, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001703, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001704, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 5, "nama": "3.", "satuan": "", "type": "label" },
                        { "id": 21001705, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001706, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001707, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 6, "nama": "10.", "satuan": "", "type": "label" },
                        { "id": 21001708, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001709, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001710, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 7, "nama": "4.", "satuan": "", "type": "label" },
                        { "id": 21001711, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001712, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001713, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 8, "nama": "11.", "satuan": "", "type": "label" },
                        { "id": 21001714, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001715, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001716, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 9, "nama": "5.", "satuan": "", "type": "label" },
                        { "id": 21001717, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001718, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001719, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 10, "nama": "12.", "satuan": "", "type": "label" },
                        { "id": 21001720, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001721, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001722, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 11, "nama": "6.", "satuan": "", "type": "label" },
                        { "id": 21001723, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001724, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001725, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 12, "nama": "13.", "satuan": "", "type": "label" },
                        { "id": 21001726, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001727, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001728, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 13, "nama": "7.", "satuan": "", "type": "label" },
                        { "id": 21001729, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001730, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001731, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 14, "nama": "14.", "satuan": "", "type": "label" },
                        { "id": 21001732, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001733, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 21001734, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPaskaOperasi = [
                {
                    "id": 1, "no": 1, "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Alderete Score", "type": "label" },
                        { "id": 21001735, "nama": "", "type": "checkbox" },
                        { "id": 21001736, "nama": "", "type": "checkbox" },
                        { "id": 21001737, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "",
                    "detail": [
                        { "id": 2, "nama": "Status Pasien", "type": "label" },
                        { "id": 21001738, "nama": "", "type": "checkbox" },
                        { "id": 21001739, "nama": "", "type": "checkbox" },
                        { "id": 21001740, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 3, "nama": "",
                    "detail": [
                        { "id": 3, "nama": "Laporan Operasi", "type": "label" },
                        { "id": 21001741, "nama": "", "type": "checkbox" },
                        { "id": 21001742, "nama": "", "type": "checkbox" },
                        { "id": 21001743, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 4, "nama": "",
                    "detail": [
                        { "id": 4, "nama": "Laporan Anestesi", "type": "label" },
                        { "id": 21001744, "nama": "", "type": "checkbox" },
                        { "id": 21001745, "nama": "", "type": "checkbox" },
                        { "id": 21001746, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 5, "nama": "",
                    "detail": [
                        { "id": 5, "nama": "Resep", "type": "label" },
                        { "id": 21001747, "nama": "", "type": "checkbox" },
                        { "id": 21001748, "nama": "", "type": "checkbox" },
                        { "id": 21001749, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 6, "nama": "",
                    "detail": [
                        { "id": 6, "nama": "Ringkasan Pulang", "type": "label" },
                        { "id": 21001750, "nama": "", "type": "checkbox" },
                        { "id": 21001751, "nama": "", "type": "checkbox" },
                        { "id": 21001752, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 7, "nama": "",
                    "detail": [
                        { "id": 7, "nama": "Form. Pemeriksaan PA", "type": "label" },
                        { "id": 21001753, "nama": "", "type": "checkbox" },
                        { "id": 21001754, "nama": "", "type": "checkbox" },
                        { "id": 21001755, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 8, "nama": "",
                    "detail": [
                        { "id": 8, "nama": "Bahan Spesimen : Kultur, PA", "type": "label" },
                        { "id": 21001756, "nama": "", "type": "checkbox" },
                        { "id": 21001757, "nama": "", "type": "checkbox" },
                        { "id": 21001758, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 9, "nama": "",
                    "detail": [
                        { "id": 9, "nama": "Hasil Radiologi, USG, CT Scan, MRI", "type": "label" },
                        { "id": 21001759, "nama": "", "type": "checkbox" },
                        { "id": 21001760, "nama": "", "type": "checkbox" },
                        { "id": 21001761, "nama": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 10, "nama": "",
                    "detail": [
                        { "id": 21001762, "nama": "", "type": "textbox" },
                        { "id": 21001763, "nama": "", "type": "checkbox" },
                        { "id": 21001764, "nama": "", "type": "checkbox" },
                        { "id": 21001765, "nama": "", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPaskaOperasiNama = [
                {
                    "id": 1, "nama": "Perawat OK",
                    "detail": [
                        { "id": 21001767, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat RR",
                    "detail": [
                        { "id": 21001768, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Perawat RI",
                    "detail": [
                        { "id": 21001769, "nama": "", "type": "combobox" },
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
                // $scope.item.obj[116062]=$scope.now
                // $scope.item.obj[116068]={text:$scope.cc.namaruangan,value: $scope.cc.objectruanganfk}

                // $scope.item.obj[116201] = true
                // $scope.item.obj[116204] = true
                // $scope.item.obj[116207] = true
                // $scope.item.obj[116210] = true
                // $scope.item.obj[116213] = true
                // $scope.item.obj[116216] = true
                // $scope.item.obj[116219] = true
                // $scope.item.obj[116222] = true

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

                $scope.item.obj[21000506] = $scope.skorMorse
            }
               
            $scope.getSkorNutrisi = function (id, descNilai) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[21000420] = $scope.skorNutrisi
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
                $scope.cc.jenisemr = 'bedah'
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
                    'DaftarTilikPraOperasiCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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