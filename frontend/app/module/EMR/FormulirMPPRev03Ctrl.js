define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('FormulirMPPRev03Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            var peagawaiLogin = medifirstService.getPegawaiLogin()
            $scope.cc.emrfk = 3003053
            var dataLoad = []
            // $scope.isCetak = true
            $scope.isCetakV = true
            var norecEMR = ''
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
                
            })
            medifirstService.getPart('emr/get-datacombo-metode', true, true, 20).then(function (data) {
                $scope.listMetode = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
            
             })
             medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })

            $scope.listDataIar = [
                { id: 1, tanggalId: 1901310148, iarId: 1901310149, ttdId: 1901310150 },
                { id: 2, tanggalId: 1901310151, iarId: 1901310152, ttdId: 1901310153 },
                { id: 3, tanggalId: 1901310154, iarId: 1901310155, ttdId: 1901310156 },
                { id: 4, tanggalId: 1901310157, iarId: 1901310158, ttdId: 1901310159 },
                { id: 5, tanggalId: 1901310160, iarId: 1901310161, ttdId: 1901310162 },
                { id: 6, tanggalId: 1901310163, iarId: 1901310164, ttdId: 1901310165 }
            ]
            $scope.showIar = { obj: [] }
            $scope.showbtnaddIar = []
            $scope.showbtnremoveIar = []

            function hasIarValue(value) {
                if (value === null || value === undefined) return false
                if (typeof value === 'string') return value.trim() !== ''
                if (typeof value === 'object') return value.value !== undefined && value.value !== null && value.value !== ''
                return true
            }

            function resetIarVisibility() {
                for (var i = 0; i < $scope.listDataIar.length; i++) {
                    var rowId = $scope.listDataIar[i].id
                    $scope.showIar.obj[rowId] = false
                    $scope.showbtnaddIar[rowId] = false
                    $scope.showbtnremoveIar[rowId] = false
                }
            }

            $scope.initIarRows = function () {
                resetIarVisibility()
                var firstRow = $scope.listDataIar[0]
                $scope.showIar.obj[firstRow.id] = true
                $scope.showbtnaddIar[firstRow.id] = true
                $scope.showbtnremoveIar[firstRow.id] = false
            }

            $scope.syncIarRowsFromData = function () {
                resetIarVisibility()

                var lastVisibleIndex = 0
                for (var i = 0; i < $scope.listDataIar.length; i++) {
                    var row = $scope.listDataIar[i]
                    if (
                        hasIarValue($scope.item.obj[row.tanggalId]) ||
                        hasIarValue($scope.item.obj[row.iarId]) ||
                        hasIarValue($scope.item.obj[row.ttdId])
                    ) {
                        lastVisibleIndex = i
                    }
                }

                for (var j = 0; j <= lastVisibleIndex; j++) {
                    var visibleRowId = $scope.listDataIar[j].id
                    $scope.showIar.obj[visibleRowId] = true
                }

                var activeRow = $scope.listDataIar[lastVisibleIndex]
                $scope.showbtnaddIar[activeRow.id] = lastVisibleIndex < ($scope.listDataIar.length - 1)
                $scope.showbtnremoveIar[activeRow.id] = lastVisibleIndex > 0
            }

            $scope.addIarRow = function (currentRow, nextRow) {
                if (!nextRow) return

                $scope.showIar.obj[nextRow.id] = true
                $scope.showbtnaddIar[currentRow.id] = false
                $scope.showbtnremoveIar[currentRow.id] = false
                $scope.showbtnaddIar[nextRow.id] = true
                $scope.showbtnremoveIar[nextRow.id] = true
            }

            $scope.removeIarRow = function (currentRow, prevRow) {
                if (!prevRow) return

                $scope.item.obj[currentRow.tanggalId] = null
                $scope.item.obj[currentRow.iarId] = ''
                $scope.item.obj[currentRow.ttdId] = null

                $scope.showIar.obj[currentRow.id] = false
                $scope.showbtnaddIar[currentRow.id] = false
                $scope.showbtnremoveIar[currentRow.id] = false
                $scope.showbtnaddIar[prevRow.id] = true
                $scope.showbtnremoveIar[prevRow.id] = prevRow.id !== $scope.listDataIar[0].id
            }

            $scope.initIarRows()
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
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
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hpp-wisc&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
            
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
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
                $scope.cc.tglLahir = chacePeriode[18]
                $scope.cc.alamat = chacePeriode[15]
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

                if (chacePeriode != undefined) {
                    if (chacePeriode[6] != undefined && chacePeriode[6] != '') {
                        $scope.item.obj[1901310064] = new Date(chacePeriode[6])
                    }
                    if (chacePeriode[12] != undefined && chacePeriode[12] != '') {
                        $scope.item.obj[1901310065] = chacePeriode[12]
                    }
                    if (chacePeriode[16] != undefined && chacePeriode[17] != undefined) {
                        $scope.item.obj[1901310067] = {
                            value: chacePeriode[17],
                            text: chacePeriode[16]
                        }
                    }
                }

                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        if (dataLoad[i].emrdfk == 1901310120) {
                            dataLoad[i].type = "textarea";
                        }

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            if (dataLoad[i].emrdfk >= 14464 && dataLoad[i].emrdfk <= 14469 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 14424 && dataLoad[i].emrdfk <= 14431 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorGizi(datass)
                            }


                        }
                        if (dataLoad[i].type == "checkbox4") {
                            chekedd = false
                            if (dataLoad[i].value == true) {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            


                        }
                        if (dataLoad[i].type == "checkbox6") {
                            chekedd = false
                            if (dataLoad[i].value == true) {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            


                        }
                        if (dataLoad[i].type == "checkbox123") {
                            chekedd = false
                            if (dataLoad[i].value == true) {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            


                        }
                        if (dataLoad[i].type == "checkbox12") {
                            chekedd = false
                            if (dataLoad[i].value == true) {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            


                        }
                        if (dataLoad[i].type == "checkbox_num") {
                            chekedd = false
                            if (dataLoad[i].value == true || dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "textbox10") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox1") {
                            chekedd = false
                            if (dataLoad[i].value == true || dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "checkbox2") {
                            chekedd = false
                            if (dataLoad[i].value == true || dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }
                        if (dataLoad[i].type == "textbox11" || dataLoad[i].type == "textbox12") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                    }

                }

                }

                $scope.syncIarRowsFromData()
            })

            $scope.listA = [
                {
                    "id": 1,
                    "nama": " 1. Risiko tinggi : ",
                    "detail": [
                        {
                            "id": 1901310071,
                            "nama": "Kematian",
                            "type": "checkbox2"
                        },
                        {
                            "id": 1901310072,
                            "nama": "Lari",
                            "type": "checkbox2"
                        },
                        {
                            "id": 1901310073,
                            "nama": "Bunuh diri",
                            "type": "checkbox2"
                        },
                        {
                            "id": 1901310074,
                            "nama": "Kekerasan seksual",
                            "type": "checkbox2"
                        },
                        {
                            "id": 1901310075,
                            "nama": "Readmisi",
                            "type": "checkbox2"
                        }
                    ]
                },
                {
                    "id": 2,
                    "nama": " 2. Risiko masalah pembiayaan :",
                    "detail": [
                        {
                            "id": 1901310077,
                            "nama": "Tanpa jaminan ",
                            "type": "checkbox4"
                        },
                        {
                            "id": 1901310078,
                            "nama": "Pembayaran belum jelas ",
                            "type": "checkbox4"
                        },
                        {
                            "id": 1901310079,
                            "nama": "Minimal coverage ",
                            "type": "checkbox4"
                        },
                    ]
                },
                {
                    "id": 3,
                    "nama": " 3. Kasus kompleks : ",
                    "detail": [
                        {
                            "id": 1901310081,
                            "nama": "Multidiagnosis ",
                            "type": "checkbox4"
                        },
                        {
                            "id": 1901310082,
                            "nama": "Multiprovider (pasien dengan \u2265 3 DPJP)",
                            "type": "checkbox6"
                        },
                    
                    ]
                },
                {
                    "id": 4,
                    "nama": " ",
                    "detail": [
                        {
                            "id": 1901310083,
                            "nama": "Rawat inap melebihi rata rata lama dirawat/LOS (Length Of Stay) LOS \u2265 28 hari",
                            "prefix": "4. ",
                            "type": "checkbox_num"
                        },
                        
                    ]
                },
                {
                    "id": 5,
                    "nama": " 5. Risiko masalah psikososial : ",
                    "detail": [
                        {
                            "id": 1901310085,
                            "nama": "Tanpa identitas",
                            "type": "checkbox4"
                        },
                        {
                            "id": 1901310086,
                            "nama": "Riwayat dropping",
                            "type": "checkbox4"
                        }, 
                        {
                            "id": 1901310087,
                            "nama": "Riwayat dan risiko penelantaran",
                            "type": "checkbox4"
                        }, 
                        {
                            "id": 1901310088,
                            "nama": "Riwayat Pasung",
                            "type": "checkbox4"
                        },                    
                        {
                            "id": 1901310089,
                            "nama": "Kurang support keluarga",
                            "type": "checkbox4"
                        },
                    
                    ]
                },
                {
                    "id": 6,
                    "nama": " ",
                    "detail": [
                        {
                            "id": 1901310090,
                            "nama": "Risiko komplain",
                            "prefix": "6. ",
                            "type": "checkbox_num"
                        },
                        
                    ]
                },
                {
                    "id": 7,
                    "nama": " ",
                    "detail": [
                        {
                            "id": 1901310091,
                            "nama": "Berpotensi kasus hukum",
                            "prefix": "7. ",
                            "type": "checkbox_num"
                        },
                        
                    ]
                },
                {
                    "id": 8,
                    "nama": " ",
                    "detail": [
                        {
                            "id": 1901310092,
                            "nama": "Pasien dirawat di Ruang Intensif > 5 hari",
                            "prefix": "8. ",
                            "type": "checkbox_num"
                        },
                        
                    ]
                },
                {
                    "id": 9,
                    "nama": " ",
                    "detail": [
                        {
                            "id": 1901310093,
                            "nama": "Status fungsional rendah, kebutuhan bantuan ADL (Activity Daily Living) yang tinggi",
                            "prefix": "9. ",
                            "type": "checkbox_num"
                        },
                        
                    ]
                },
                {
                    "id": 10,
                    "nama": " 10. Kasus dengan penyakit kronis, katastropik, terminal",
                    "detail": [
                        {
                            "id": 1901310094,
                            "nama": "",
                            "type": "checkbox1"
                        },
                        {
                            "id": 1901310096,
                            "nama": "",
                            "type": "textbox10",
                            "placeholder": ".........................................................................................................."
                        }
                    ]
                },
        ]
        $scope.listB = [
            {
                "id": 1,
                "nama": "  ",
                "detail": [
                    {
                        "id": 1901310099,
                        "nama": "B. Asesmen Awal :",
                        "type": "textarea"
                    }
                ]
            }
        ]
        $scope.listC = [
            {
                "id": 1,
                "nama": "  ",
                "detail": [
                    {
                        "id": 1901310118,
                        "nama": "C. Asesmen Manajemen Pelayanan Pasien :",
                        "type": "textarea"
                    }
                ]
            }
        ]
        $scope.listD = [
            {
                "id": 1,
                "nama": "D. Identifikasi Masalah dan Kesempatan :",
                "detail": [
                    {
                        "id": 1901310103,
                        "nama": "Asuhan pelayanan yang tidak sesuai kebutuhan ",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310104,
                        "nama": "Over/under utilisasi pelayanan sesuai standar yang digunakan",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310105,
                        "nama": "Ketidak patuhan pasien ",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310106,
                        "nama": "Kurang pengetahuan keluarga terhadap penyakit",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310107,
                        "nama": "Kurang dukungan keluarga ",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310108,
                        "nama": "Penurunan determinasi pasien (tingkat keparahan/komplikasi meningkat) sehubungan penyakit yang diderita",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310109,
                        "nama": "Kendala keuangan",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310110,
                        "nama": "Masalah rujukan yang tertunda",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310111,
                        "nama": "Masalah pemulangan pasien yang tertunda",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310112,
                        "nama": "Masalah ketergantungan ADL (Activity Daily Living)",
                        "type": "checkbox12"
                    },
                    {
                        "id": 1901310113,
                        "nama": "Kondisi pasien belum memenuhi kriteria untuk dirawat di Ruang Maintenance",
                        "type": "checkbox12"
                    },
                ]
            },
            {
                "id": 11,
                "nama": " ",
                "detail": [
                    {
                        "id": 1901310114,
                        "nama": "",
                        "type": "checkbox1"
                    },
                    {
                        "id": 1901310115,
                        "nama": "",
                        "type": "textbox10",
                        "placeholder": ".........................................................................................................."
                    },
                ]
            },
        ]
    $scope.listE = [
        {
            "id": 1,
            "nama": "E. Perencanaan Manajemen Pelayanan Pasien",
            "detail": [
                {
                    "id": 1901310120,
                    "nama": "Utilisasi/Mutu asuhan",
                    "type": "textarea"
                },
                {
                    "id": 1901310141,
                    "nama": "Koordinasi :",
                    "type": "textarea"
                },
                {
                    "id": 1901310144,
                    "nama": "Kolaborasi :",
                    "type": "textarea"
                },
                {
                    "id": 1901310147,
                    "nama": "Advokasi:",
                    "type": "textarea"
                },
                {
                    "id": 1901310138,
                    "nama": "Edukasi :",
                    "type": "textarea"
                }
            ]
        }
    ]
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }

                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                   'RM 29.02.Rev03 Formulir Manajer Pelayanan Pasien (MPP)' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.cetakBlade = function () {
               var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
              
                if (cacheNomorEMR[0] == '-') {
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-mpp?noemr=' + cacheNomorEMR[0] + '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }

        }
    ]);
});