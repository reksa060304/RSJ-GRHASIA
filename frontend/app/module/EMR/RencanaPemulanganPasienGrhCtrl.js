define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RencanaPemulanganPasienGrhCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000528
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            var norecEMR = ''
            $scope.isCetak = true

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000528).then(function (e) {
                // debugger
                var datas = e.data.kolom1
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    if (element.namaexternal == 'gaduh')
                        $scope.listData1.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'permusuhan')
                        $scope.listData2.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'ketegangan')
                        $scope.listData3.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'tidakkoperatif')
                        $scope.listData4.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'impuls')
                        $scope.listData5.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                }

            })
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if (cacheNoREC != undefined) {
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
            }
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-pansssingkat&id=' +
                    $scope.cc.nocm + '&emr=' + norecEMR + '&view=true' + '&idemr=' + 501,
                    function (response) {
                        // do something with response
                    });
            }

            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

                if (nomorEMR != '-') {
                    cacheHelper.set('cacheEMR_PANEC', nomorEMR)
                }
                $scope.totalSkor = 0
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[9085] = $scope.now
                    $scope.item.obj[9086] = {
                        value: $scope.cc.iddpjp,
                        text: $scope.cc.dokterdpjp
                    }
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if (dataLoad[i].emrdfk == '9084')
                                    $scope.totalSkor = parseFloat(dataLoad[i].value)
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
                                // // if (dataLoad[i].reportdisplay != null) {
                                // //     var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                // //     $scope.getSkor(datass)
                                // }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }

                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = {
                                    value: res[0],
                                    text: res[1]
                                }

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
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }

            $scope.listPendampinganRumah = [  
                {
                    "id" : 2, "nama": "Kebutuhan pendampingan selama di rumah :",
                    "detail": [
                        {"id": 3013704, "nama": "Keluarga","type": "checkbox"},
                        {"id": 3013705, "nama": "Dokter","type": "checkbox"},
                        { "id": 3013706, "nama": "Tenaga Kesehatan lainnya", "satuan": "", "type": "textbox2", "idd":  "3013707"},
                        {"id": 3013708, "nama": "Kader Kesehatan","type": "checkbox"},
                        { "id": 3013709, "nama": "Lainnya", "satuan": "", "type": "textbox2", "idd":  "3013710"},
                    ]
                }
            ]
            $scope.listTransportasi = [  
                {
                    "id" : 2, "nama": "Transportasi pulang :",
                    "detail": [
                        {"id": 3013711, "nama": "Kendaraan Pribadi","type": "checkbox"},
                        {"id": 3013712, "nama": "Ambulance","type": "checkbox"},
                        { "id": 3013713, "nama": "Kendaraan lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013714"},
                    ]
                }
            ]
            $scope.listBerkelanjutan = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013715, "nama": "RSUD","type": "checkbox"},
                        {"id": 3013716, "nama": "Puskesmas","type": "checkbox"},
                        {"id": 3013717, "nama": "Panti / Rumah Singgah","type": "checkbox"},
                        {"id": 3013718, "nama": "Dokter Keluarga / Dokter Praktek","type": "checkbox"},
                        { "id": 3013719, "nama": "Lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013720"},
                    ]
                }
            ]
            $scope.listHarihari = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013721, "nama": "Mandiri","type": "checkbox"},
                        {"id": 3013722, "nama": "Bantuan","type": "checkbox"},
                        {"id": 3013723, "nama": "Tergantung","type": "checkbox"},
                    ]
                }
            ]
            $scope.listOrangMerawat = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013724, "nama": "Orang Tua","type": "checkbox"},
                        {"id": 3013725, "nama": "Anak","type": "checkbox"},
                        {"id": 3013726, "nama": "Saudara","type": "checkbox"},
                        { "id": 3013727, "nama": "Lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013728"},
                      
                    ]
                }
            ]
            $scope.listObat = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013729, "nama": "Mandiri","type": "checkbox"},
                        {"id": 3013730, "nama": "Bantuan","type": "checkbox"},
                        {"id": 3013731, "nama": "Tergantung","type": "checkbox"},
                    ]
                }
            ]
          
            $scope.listKeputusan = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013732, "nama": "Mandiri","type": "checkbox"},
                        {"id": 3013733, "nama": "Bantuan","type": "checkbox"},
                        {"id": 3013734, "nama": "Tergantung","type": "checkbox"},
                    ]
                }
            ]
            $scope.listSosialisasi = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013735, "nama": "Mandiri","type": "checkbox"},
                        {"id": 3013736, "nama": "Bantuan","type": "checkbox"},
                        {"id": 3013737, "nama": "Tergantung","type": "checkbox"},
                    ]
                }
            ]
            $scope.listKronis = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013738, "nama": "Konsultasi kepada tim nyeri","type": "checkbox"},
                        {"id": 3013739, "nama": "Penanganan Nyeri mandiri","type": "checkbox"},
                        {"id": 3013740, "nama": "Edukasi tentang obat-obatan nyeri","type": "checkbox"},
                        { "id": 3013741, "nama": "Lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013742"},
                    ]
                }
            ]
            $scope.listRujuke = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        { "id": 3013743, "nama": "Rujuk ke :", "satuan": "", "type": "textbox2", "idd":  "3013744"},
                        { "id": 3013745, "nama": "Konsultasi kepada :", "satuan": "", "type": "textbox2", "idd":  "3013746"},
                    ]
                }
            ]
            $scope.listDampak = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013747, "nama": "Membutuhkan anggota gerak palsu","type": "checkbox"},
                        {"id": 3013748, "nama": "Membutuhkan alat bantu gerak (kursi roda,tongkat,dll)","type": "checkbox"},
                        {"id": 3013749, "nama": "Membutuhkan alat bantu medis","type": "checkbox"},
                        {"id": 3013750, "nama": "Terapi wicara","type": "checkbox"},
                        {"id": 3013751, "nama": "Rehabilitasi medik","type": "checkbox"},
                        { "id": 3013752, "nama": "Lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013753"},
                    ]
                }
            ]
            $scope.listDiet = [  
                {
                    "id" : 2, "nama": "",
                    "detail": [
                        {"id": 3013754, "nama": "Konsul Gizi","type": "checkbox"},
                        {"id": 3013755, "nama": "Penggunaan alat bantu makan khusus","type": "checkbox"},
                        { "id": 3013756, "nama": "Lainnya :", "satuan": "", "type": "textbox2", "idd":  "3013757"},
                    ]
                }
            ]

            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.skor)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.skor)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[9084] = $scope.totalSkor //+ $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
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
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
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

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            $scope.Batal = function () {
                $scope.item.obj = []
                $scope.item.obj2 = []
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
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
                        'RencanaPemulanganPasienGrhCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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