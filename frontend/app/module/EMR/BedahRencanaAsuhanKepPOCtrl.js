define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BedahRencanaAsuhanKepPOCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210021
            $scope.now = new Date()
            var dataLoad = []
  
            $scope.listJenis = [
                { "id": 21020044, "nama": "Lokal", "type": "checkbox" },
                { "id": 21020045, "nama": "Regional", "type": "checkbox" },
                { "id": 21020046, "nama": "Umum", "type": "checkbox" },

            ]
            $scope.listDaily = [
                {
                    "id": 1, "nama": "A. Keadaan Umum",
                    "detail": [
                        { "id": 21020048, "nama": "Ringan", "type": "checkbox" },
                        { "id": 21020049, "nama": "Sedang", "type": "checkbox" },
                        { "id": 21020050, "nama": "Berat", "type": "checkbox" },

                    ]
                },
                {
                    "id": 2, "nama": "B. GCS",
                    "detail": [
                        { "id": 21020051, "nama": "E :", "type": "textbox" },
                        { "id": 21020052, "nama": "V :", "type": "textbox" },
                        { "id": 21020053, "nama": "M :", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "C. Kesadaran",
                    "detail": [
                        { "id": 21020054, "nama": "Compos", "type": "checkbox" },
                        { "id": 21020055, "nama": "Mentis", "type": "checkbox" },
                        { "id": 21020056, "nama": "Apatis", "type": "checkbox" },
                        { "id": 21020057, "nama": "Somnolen", "type": "checkbox" },
                        { "id": 21020058, "nama": "Sopor", "type": "checkbox" },
                        { "id": 21020059, "nama": "Sopor Comateus", "type": "checkbox" },
                        { "id": 21020060, "nama": "Coma", "type": "checkbox" },
                    ]
                },
                {
                    "id": 4, "nama": "D. Status Psikososial",
                    "detail": [
                        { "id": 21020061, "nama": "Tenang", "type": "checkbox" },
                        { "id": 21020062, "nama": "Marah ", "type": "checkbox" },
                        { "id": 21020063, "nama": "Cemas", "type": "checkbox" },
                        { "id": 21020064, "nama": "Kontak Mata Buruk", "type": "checkbox" },
                        { "id": 21020065, "nama": "Wajah Tegang", "type": "checkbox" },
                    ]
                },
                {
                    "id": 4, "nama": "E. Vital Sign",
                    "detail": [
                        { "id": 21020066, "nama": "TD :", "type": "textbox", "satuan": "Mmhg" },
                        { "id": 21020067, "nama": "N :", "type": "textbox", "satuan": "x/mnt" },
                        { "id": 21020068, "nama": "RR :", "type": "textbox", "satuan": "x/mnt" },
                        { "id": 21020069, "nama": "SpO2 :", "type": "textbox", "satuan": "%" },
                    ]
                },

                // ----
                {
                    "id": 5, "nama": "F. ",
                    "detail": [
                        { "id": 21020100, "nama": "BB :", "type": "textbox", "satuan": "Kg" },
                        { "id": 21020101, "nama": "TB :", "type": "textbox", "satuan": "Cm" },
                    ]
                },
                {
                    "id": 6, "nama": "G. Lavament",
                    "detail": [
                        { "id": 21020102, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21020103, "nama": "Ya", "type": "checkbox" },
                        { "id": 21020104, "nama": "Labioschisis", "type": "checkbox" },
                        { "id": 21020105, "nama": "Palatochisis", "type": "checkbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Gigi dan Gusi",
                    "detail": [
                        { "id": 21020106, "nama": "Lengkap", "type": "checkbox" },
                        { "id": 21020107, "nama": "Carier", "type": "checkbox" },
                        { "id": 21020108, "nama": "Tanggal", "type": "checkbox" },
                        { "id": 21020109, "nama": "Gigi Palsu", "type": "checkbox" },
                    ]
                },
                {
                    "id": 8, "nama": "H. Kulit",
                    "detail": [
                        { "id": 21020110, "nama": "Turgor", "type": "checkbox" },
                        { "id": 21020111, "nama": "Elastis", "type": "checkbox" },
                        { "id": 21020112, "nama": "Tidak Elastis", "type": "checkbox" },
                    ]
                },
                {
                    "id": 9, "nama": "Kedaan Kulit",
                    "detail": [
                        { "id": 21020113, "nama": "Lembab", "type": "checkbox" },
                        { "id": 21020114, "nama": "Luka", "type": "checkbox" },
                        { "id": 21020115, "nama": "Posisi", "type": "checkbox" },
                        { "id": 21020116, "nama": "Kemerahan", "type": "checkbox" },
                        { "id": 21020117, "nama": "Kering", "type": "checkbox" },
                        { "id": 21020118, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 10, "nama": "I. Pernapasan",
                    "detail": [
                        { "id": 21020119, "nama": "Suara", "type": "label" },
                        { "id": 21020120, "nama": "Vesikuler", "type": "checkbox" },
                        { "id": 21020121, "nama": "Wheezing", "type": "checkbox" },
                        { "id": 21020122, "nama": "Rales", "type": "checkbox" },
                        { "id": 21020123, "nama": "Ronchi", "type": "checkbox" },
                        { "id": 21020124, "nama": "", "type": "textbox" },
                        { "id": 21020125, "nama": "Irama", "type": "label" },
                        { "id": 21020126, "nama": "Reguler", "type": "checkbox" },
                        { "id": 21020127, "nama": "Ireguler", "type": "checkbox" },
                        { "id": 21020128, "nama": "CRT", "type": "label" },
                        { "id": 21020129, "nama": "< 2 detik", "type": "checkbox" },
                        { "id": 21020130, "nama": "> 2 detik", "type": "checkbox" },
                    ]
                },

                // sasas

            ]
            $scope.listTujuan1 = [
                { "id": 21020070, "nama": "Ventilasi adekuat", "type": "checkbox" },
                { "id": 21020071, "nama": "Suara nafas vesikuler", "type": "checkbox" },
                { "id": 21020072, "nama": "Menunjukkan kemampuan menelan", "type": "checkbox" },
                { "id": 21020073, "nama": "Menunjukkan peningkatan kesadaran ", "type": "checkbox" },

            ]
            $scope.listIntervensi = [
                { "id": 21020074, "nama": "Kaji faktor risiko terjadinya aspirasi", "type": "checkbox" },
                { "id": 21020075, "nama": "Obs. Vital sign terutama pernafasan", "type": "checkbox" },
                { "id": 21020076, "nama": "Lakukan air way manajemen", "type": "checkbox" },
                { "id": 21020077, "nama": "Miringkan kepala pasien bila muntah ", "type": "checkbox" },
                { "id": 21020078, "nama": "Pantau tingkat kesadaran reflex ", "type": "checkbox" },
            ]
            $scope.listImplementasi = [
                { "id": 21020079, "nama": "Mengkaji faktor terjadinya aspirasi", "type": "checkbox" },
                { "id": 21020080, "nama": "Mengobsv. Vital sign terutama pernafasan", "type": "checkbox" },
                { "id": 21020081, "nama": "Melakukan suction jalan nafas", "type": "checkbox" },
                { "id": 21020082, "nama": "Melakukan air way manajemen ", "type": "checkbox" },
                { "id": 21020083, "nama": "Memiringkan kepala pasien saat pasien muntah", "type": "checkbox" },
                { "id": 21020084, "nama": "Memantau tingkat kesadaran ", "type": "checkbox" },
                { "id": 21020085, "nama": "Reflek, batuk, muntah dan kemampuan menelan ", "type": "checkbox" },
                { "id": 21020086, "nama": "Memberikan O2, sesuai intruksi", "type": "checkbox" },
                { "id": 21020086, "nama": "Memberikan obat antiemetik ", "type": "checkbox" },
                { "id": 21020087, "nama": "", "type": "textbox" },
            ]
            $scope.listTujuan2 = [
                { "id": 21020090, "nama": "Tingkat Ansietas menurun ketingkat yang dapat diatasi", "type": "checkbox" },
                { "id": 21020091, "nama": "Pasien kooperatif dan mampu berkonsentrasi", "type": "checkbox" },
                { "id": 21020092, "nama": "Vital sign dalam batas normal", "type": "checkbox" },
            ]
            $scope.listIntervensi2 = [
                { "id": 21020093, "nama": "Kaji tingkat kecemasan pasien Observasi vital sign", "type": "checkbox" },
                { "id": 21020094, "nama": "Jelaskan tindakan pembedahan yang dilakukan", "type": "checkbox" },
            ]
            $scope.listImplementas2 = [
                { "id": 21020095, "nama": "Mengkaji tingkat kecemasan oasien", "type": "checkbox" },
                { "id": 21020096, "nama": "Mengobservasi vital sign", "type": "checkbox" },
                { "id": 21020097, "nama": "Menjelaskan tindakan pembedahan yang akan dilakukan", "type": "checkbox" },
            ]
            $scope.listTujuan3 = [
                { "id": 21020131, "nama": "Keseimbangan intake dan output", "type": "checkbox" },
                { "id": 21020132, "nama": "Kelebihan dan kekurangan cairan", "type": "checkbox" },
                { "id": 21020133, "nama": "Vital sign dalam batas normal", "type": "checkbox" },
            ]
            $scope.listIntervensi3 = [
                { "id": 21020134, "nama": "Kaji Status hidrasi pasien", "type": "checkbox" },
                { "id": 21020135, "nama": "Pantau warna, jumlah, dan frekuensi kehilangan cairan ", "type": "checkbox" },
                { "id": 21020136, "nama": "Monitor vital sign", "type": "checkbox" },
                { "id": 21020137, "nama": "Monitor haluan cairan elektrolit", "type": "checkbox" },

            ]
            $scope.listImplementasi3 = [
                { "id": 21020138, "nama": "Mengkaji status hidrasi pasien", "type": "checkbox" },
                { "id": 21020139, "nama": "Pantau warna, jumlah, dan frekuensi kehilangan darah ", "type": "checkbox" },
                { "id": 21020140, "nama": "Monitor vital sign", "type": "checkbox" },
                { "id": 21020141, "nama": "Monitor haluan cairan elektrolit", "type": "checkbox" }
            ]
            $scope.listTujuan4 = [
                { "id": 21020142, "nama": "Vital sign dalam batas normal", "type": "checkbox" },
                { "id": 21020143, "nama": "Tidak ada tanda-tanda infeksi ", "type": "checkbox" },
            ]
            $scope.listIntervensi4 = [
                { "id": 21020144, "nama": "Pertahankan tehnik aseptik dan antiseptik", "type": "checkbox" },
                { "id": 21020145, "nama": "Pastikan kadaluarsa alat dan sebelum digunakan", "type": "checkbox" },
                { "id": 21020146, "nama": "Pastikan perawat dan dokter melakukan cuci tangan sesuai prosedur", "type": "checkbox" },
               
            ]
            $scope.listImplementasi4 = [
                { "id": 21020147, "nama": "Pertahankan tehnik aseptik dan antiseptik", "type": "checkbox" },
                { "id": 21020148, "nama": "Pastikan kadaluarsa alat dan sebelum digunakan", "type": "checkbox" },
                { "id": 21020149, "nama": "Mempastikan perawat dan dokter melakukan cuci tangan sesuai prosedur", "type": "checkbox" },
            ]
            $scope.listTujuan5 =[]
            $scope.listIntervensi5 = [
                { "id": 21020152, "nama": "Kaji faktor-faktor yang dapat menyebabkan terjadinya cedera", "type": "checkbox" },
                { "id": 21020153, "nama": "Stabilkan tempat tidur pasien maupun meja operasi pada waktu pemindahan pasien", "type": "checkbox" },
                { "id": 21020154, "nama": "Pasang pengaman tempat tidur", "type": "checkbox" },
                { "id": 21020155, "nama": "Kolaborasi perubahan posisi pada ahli anestesi atau operator sesuai kebutuhan", "type": "checkbox" },
            ]
            $scope.listImplementasi5 = [
                { "id": 21020156, "nama": "Mengaji faktor-faktor yang dapat menyebabkan terjadinya cedera", "type": "checkbox" },
                { "id": 21020157, "nama": "Menstabilkan tempat tidur", "type": "checkbox" },
                { "id": 21020158, "nama": "Pasien maupun meja operasi pada waktu pemindahan pasien memasang pengaman tempat tidur", "type": "checkbox" },
                { "id": 21020159, "nama": "Melakukan kolaborasi perubahan posisi pada ahli anestesi atau operator sesuai kebutuhan", "type": "checkbox" },
            ]
            $scope.listTujuan6 = [
                { "id": 21020162, "nama": "Vital sign dalam batas normal", "type": "checkbox" },
                { "id": 21020163, "nama": "Pasien tidak menggigil", "type": "checkbox" },
                { "id": 21020164, "nama": "Tidak terjadi sianosis", "type": "checkbox" },
            ]
            $scope.listIntervensi6 = [
                { "id": 21020165, "nama": "Kaji faktor-faktor yang dapat menyebabkan hipotermi", "type": "checkbox" },
                { "id": 21020166, "nama": "Observasi vital sign", "type": "checkbox" },
                { "id": 21020167, "nama": "Berikan cairan hangat sesuai suhu", "type": "checkbox" },
                { "id": 21020168, "nama": "Berikan penghangat (selimut)", "type": "checkbox" },
                { "id": 21020169, "nama": "Ganti bila duk/linen basah", "type": "checkbox" },
            ]
            $scope.listImplementasi6 = [
                { "id": 21020170, "nama": "Mengkaji faktor-faktor yang dapat menyebabkan hipotermi", "type": "checkbox" },
                { "id": 21020171, "nama": "Observasi vital sign", "type": "checkbox" },
                { "id": 21020172, "nama": "Memberikan cairan hangat sesuai suhu", "type": "checkbox" },
                { "id": 21020173, "nama": "Memberikan penghangat (selimut)", "type": "checkbox" },
                { "id": 21020174, "nama": "Mengganti bila duk/linen basah", "type": "checkbox" },
            ]

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            // medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 210021).then(function (e) {
            //     // debugger
            //     var datas = e.data.kolom4
            //     for (let i = 0; i < datas.length; i++) {
            //         const element = datas[i];
            //         if (element.namaexternal == 's1')
            //             $scope.listData1.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's2')
            //             $scope.listData2.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's3')
            //             $scope.listData3.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's4')
            //             $scope.listData4.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's5')
            //             $scope.listData5.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's6')
            //             $scope.listData6.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's7')
            //             $scope.listData7.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's8')
            //             $scope.listData8.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's9')
            //             $scope.listData9.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's10')
            //             $scope.listData10.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's11')
            //             $scope.listData11.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //         if (element.namaexternal == 's12')
            //             $scope.listData12.push({ id: element.id, skor: element.reportdisplay, nama: element.caption, kodeexternal: element.kodeexternal })
            //     }

            // })
            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

                // // SET RECALL CTRS
                // if (nomorEMR != '-') {
                //     cacheHelper.set('cacheEMR_CTRS', nomorEMR)
                // }
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                                //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                //     $scope.getSkor2(datass)
                                // }
                                if (dataLoad[i].caption != null) {
                                    var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].caption }
                                    // $scope.getSkor(datass)
                                }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                            }
                            // if(dataLoad[i].type == "checkboxtextbox") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                            // }
                            // if(dataLoad[i].type == "textarea") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            // }
                        }

                    }
                })
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
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
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
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'bedah'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    afterSave(e)
                });
            }
            function afterSave(e) {
                $scope.cc.norec_emr = e.data.data.noemr
                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Rencana Asuhan Keperawatan Post Operatif ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                // $rootScope.loadHistoryEMRBedah();
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }

        }
    ]);
});