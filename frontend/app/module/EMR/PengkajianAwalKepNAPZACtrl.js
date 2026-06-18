define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('PengkajianAwalKepNAPZACtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.totalSkor3 = 0
            $scope.totalSkor5 = 0
            $scope.totalSkor6 = 0
            $scope.totaladl = 0
            $scope.skorNutrisiAnak = 0
            $scope.skorNutrisiDewasa = 0
            $scope.totalGziDewasa = 0
            $scope.cc = {}
            var nomorEMR = '-'
            var noregEMR = ''
            $scope.cc.emrfk = 3000553
            $scope.isCetakV = true;
            $scope.now = new Date()
            var dataLoad = []
            var dataDump = [];
            var norecEMR = ''
            $scope.isCetak = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
             })
            medifirstService.getPart('emr/get-datacombo-part-kelas', true, true, 20).then(function (data) {
                $scope.listKelas = data

             })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
            
             })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000553  ).then(function (e) {

                var datas = e.data.kolom4
                dataDump = datas;
                var detail = []
                var arrayAskep=[]
                var arrayAskep2=[]
                var arrayAskep3=[]
                var arrayAskep4=[]
                var arrayAskep5=[]

                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false

                    // ARRAY GEJALA
                    if (element.kodeexternal == 'No') {
                        for (let z = 0; z < arrayAskep.length; z++) {
                            const element2 = arrayAskep[z];
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
                            arrayAskep.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'No2') {
                        for (let z = 0; z < arrayAskep2.length; z++) {
                            const element2 = arrayAskep2[z];
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
                            arrayAskep2.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'No3') {
                        for (let z = 0; z < arrayAskep3.length; z++) {
                            const element2 = arrayAskep3[z];
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
                            arrayAskep3.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                     // ARRAY GEJALA
                    if (element.kodeexternal == 'No4') {
                        for (let z = 0; z < arrayAskep4.length; z++) {
                            const element2 = arrayAskep4[z];
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
                            arrayAskep4.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'mencaaari') {
                        for (let z = 0; z < arrayAskep5.length; z++) {
                            const element2 = arrayAskep5[z];
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
                            arrayAskep5.push(datax)
                        }
                    }


                }
                // ARRAY GEJALA
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayAskep.length; k++) {
                    const element = arrayAskep[k];
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
                $scope.listData1 = arrayAskep
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayAskep2.length; k++) {
                    const element = arrayAskep2[k];
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
                $scope.listData2 = arrayAskep2
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayAskep3.length; k++) {
                    const element = arrayAskep3[k];
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
                $scope.listData3 = arrayAskep3
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayAskep4.length; k++) {
                    const element = arrayAskep4[k];
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
                $scope.listData4 = arrayAskep4
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayAskep5.length; k++) {
                    const element = arrayAskep5[k];
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
                $scope.listData5 = arrayAskep5
                console.log($scope.listData5);


                

               

                


            })
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                noregEMR = cacheNomorEMR[2]
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
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cpk&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }

            var chekedd = false
            loadDiagnosa();
            function loadDiagnosa() {
                $scope.isRouteLoading = true;
                var param =""
                if($scope.item.isNoRegis == true)
                   param = "noReg=" + $scope.item.noregistrasi;
                else
                  param = "noCm=" + $scope.item.noMr;
              
                medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg?"
                    + param
                ).then(function (data) {
                    // $scope.isRouteLoading = false;
                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });
                });
            }
            $scope.listBarthel = [
                {
                    "id": 1, "nama": "Personal Hygiene",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100350, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100351, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100352, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 2, "nama": "Mandi",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100353, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100354, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100355, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 3, "nama": "Makan",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100356, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100357, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100358, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 4, "nama": "Toileting",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100359, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100360, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100361, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 5, "nama": "Menaiki tangga",
                    "detail": [
                       {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100362, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100363, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100364, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 6, "nama": "Memakai pakaian",
                    "detail": [
                       {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100365, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100366, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100367, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 7, "nama": "BAB",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100368, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100369, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100370, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 8, "nama": "BAK",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100371, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100372, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100373, baris : 1 }]
                        },

                    ]
                },
                {
                    "id": 9, "nama": "Ambulasi",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100374, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100375, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100376, baris : 1 }]
                        },
                    ]
                },
                {
                    "id": 10, "nama": "Tansfer Kursi-TT",
                    "detail": [
                        {
                            "id": 1, "nama": "Dibantu penuh", "descNilai": "0", "ket": 1,
                            "detail": [{ id: 36100377, baris : 1 }]
                        },
                        {
                            "id": 2, "nama": "Kadang-kadang tak terkendali", "descNilai": "1", "ket": 1,
                            "detail": [{ id: 36100378, baris : 1 }]
                        },
                        {
                            "id": 3, "nama": "Mandiri", "descNilai": "2", "ket": 1,
                            "detail": [{ id: 36100379, baris : 1 }]
                        },
                    ]
                },
            ]
            

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah terdapat penyakit atau keadaan ( lihat daftar) yang mengakibatkan pasienberisiko malnutrisi, atau apakah pasien rencana operasi mayor ?",
                    "detail": [
                        { "id": 36100341, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 36100342, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 2, "no": 2, "nama": "Berdasarkan penilaian klinis, apakah pasien berstatus gizi kurang / buruk ?",
                    "detail": [
                        { "id": 36100343, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 36100344, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 3,"no": 3, "nama": "Berdasarkan penilaian klinis, apakah pasien berstatus gizi kurang / buruk ?",
                    "detail": [
                        { "id": 36100345, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 36100346, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 4,"no": 4, "nama": "Apakah terdapat penurunan berat badan (untuk bayi < 1 tahun; berat badan tidaknaik ) selama beberapa bulan terakhir?",
                    "detail": [
                        { "id": 36100347, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 36100348, "nama": "Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]
            $scope.listNutrisionalAnak = [
                {
                    "id": 1 , "nama":" A. Dijawab oleh Tenaga Kesehatan",
                    "detail": [
                        { "id": 1, "nama": "", "type": "label" },
                    ]
                },  
                {
                    "id": 1,  "no": 1, "nama":" Apakah ada penyakit yang mendasari dengan risiko malnutrisi atau apakah ada pembedahan besar ?",
                    "detail": [
                        { "id": 3018961, "nama": "a. Tidak ", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018962, "nama": "b. Ya", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 2,  "no": 2, "nama":" Apakah pasien dalam kondisi status gizi buruk berdasarkan pemeriksaan klinis secara subyektif ?",
                    "detail": [
                        { "id": 3018963, "nama": "a. Tidak ", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018964, "nama": "b. Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1 , "nama":" B. Dijawab oleh Pengasuh Anak",
                     
                    "detail": [
                        { "id": 1, "nama": "", "type": "label" },
                    ]
                },  
                {
                    "id": 1 ,"no": "1", "nama":" Apakah hal-hal dibawah ini ditemukan pada anak ?",
                     
                    "detail": [
                        { "id": 1, "nama": "", "type": "label" },
                    ]
                },  
                {
                    "id": 1 , "nama":"a. Diare berlebihan >5 kali/hari dan atau muntah >3 kali/har",
                    "detail": [
                        { "id": 1, "nama": "","type": "label" },
                    ]
                }, 
                {
                    "id": 1 , "nama":"b. Penurunan asupan makanan selama beberapa hari terakhir",
                    "detail": [
                        { "id": 3018965, "nama": "a. Tidak ", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018966, "nama": "b. Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                }, 
                {
                    "id": 1 ,"nama":"c. Intervensi gizi yang sudah ada sebelumnya",
                    "detail": [
                        { "id": 1, "nama": "", "type": "label" },
                    ]
                },
                {
                    "id": 1 , "nama":"d. Ketidakcukupan asupan gizi karena sakit",
                    "detail": [
                        { "id": 1, "nama": "","type": "label" },
                    ]
                },  
                {
                    "id": 2,  "no": 2, "nama":" Apakah ada penurunan berat badan atau tidak adanya penambahan berat badan ( untuk bayi <1 tahun ) selama beberapa minggu / bulan terakhir ?",
                    "detail": [
                        { "id": 3018967, "nama": "a. Tidak ", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018968, "nama": "b. Ya", "descNilai" : "1", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listNutrisionalDewasa = [
                {
                    "id": 1, "no": 1, "nama": "Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?",
                    "detail": [
                        { "id": 3018979, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018980, "nama": "b. Ragu", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?", "type": "label" },
                        { "id": 3018981, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 3018982, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 3018983, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 3018984, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                        { "id": 3018985, "nama": "Ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?",
                    "detail": [
                        { "id": 3018986, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 3018987, "nama": "Ragu-ragu", "descNilai" : "2", "type": "checkbox" },
                    ]
                },
            ]
            
            $scope.listDiagnosaKhusus = [
                {
                    "id": 1, "nama": "Skrining Nyeri",
                    "detail": [
                        { "id": 3018989, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3018990, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]

            $scope.listSkriningGiziDewasa = [
                {
                    "id": 1, "nama": "Skrining Gizi Dewasa",
                    "detail": [
                        { "id": 3018991, "nama": "DM", "satuan": "", "type": "checkbox" },
                        { "id": 3018992, "nama": "Hipertensi", "satuan": "", "type": "checkbox" },
                        { "id": 3018993, "nama": "Geriatri", "satuan": "", "type": "checkbox" },
                        { "id": 3018994, "nama": "Infeksi TB", "satuan": "", "type": "checkbox" },
                        { "id": 3018995, "nama": "Infeksi Hepatitis", "satuan": "", "type": "checkbox" },
                        { "id": 3018996, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3018767"},
                    ]
                }
            ]
          
            $scope.listSkriningGiziMNA = [
                {
                    "id": 1, "no": "A", "nama": "Apakah asupan makanan berkurang selama 3 bulan terakhir?",
                    "detail": [
                        { "id": 3019658, "nama": "0 = Asupan makanan sangat berkurang", "descNilai": 0 },
                        { "id": 3019659, "nama": "1 = Asupan makanan agak berkurang", "descNilai": 1 },
                        { "id": 3019660, "nama": "2 = Asupan makanan tidak berkurang", "descNilai": 2 }
                    ]
                },
                {
                    "id": 2, "no": "B", "nama": "Berat badan turun selama 3 bulan terakhir?",
                    "detail": [
                        { "id": 3019662, "nama": "0 = Berat badan turun lebih dari 3 kg", "descNilai": 0 },
                        { "id": 3019663, "nama": "1 = Tidak tahu", "descNilai": 1 },
                        { "id": 3019664, "nama": "2 = Berat badan turun antara 1 hingga 3 kg", "descNilai": 2 },
                        { "id": 3019665, "nama": "3 = Berat badan tidak turun", "descNilai": 3 }
                    ]
                },
                {
                    "id": 3, "no": "C", "nama": "Pergerakan atau Mobilitas?",
                    "detail": [
                        { "id": 3019667, "nama": "0 = Terbatas di tempat tidur atau kursi", "descNilai": 0 },
                        { "id": 3019668, "nama": "1 = Mampu bangun dari tempat tidur/kursi, tapi tidak bisa keluar", "descNilai": 1 },
                        { "id": 3019669, "nama": "2 = Dapat bepergian ke luar rumah", "descNilai": 2 }
                    ]
                },
                {
                    "id": 4, "no": "D", "nama": "Mengalami tekanan psikologis atau penyakit akut (3 bln terakhir)?",
                    "detail": [
                        { "id": 3019671, "nama": "0 = Ya", "descNilai": 0 },
                        { "id": 3019672, "nama": "2 = Tidak", "descNilai": 2 }
                    ]
                },
                {
                    "id": 5, "no": "E", "nama": "Gangguan neuropsikologis",
                    "detail": [
                        { "id": 3019674, "nama": "0 = Demensia berat atau depresi", "descNilai": 0 },
                        { "id": 3019675, "nama": "1 = Demensia ringan", "descNilai": 1 },
                        { "id": 3019676, "nama": "2 = Tidak ada gangguan psikologis", "descNilai": 2 }
                    ]
                },
                {
                    "id": 6, "no": "F1", "nama": "Indeks Massa Tubuh (IMT)",
                    "detail": [
                        { "id": 3019678, "nama": "0 = IMT kurang dari 19", "descNilai": 0 },
                        { "id": 3019679, "nama": "1 = IMT 19 hingga kurang dari 21", "descNilai": 1 },
                        { "id": 3019680, "nama": "2 = IMT 21 hingga kurang dari 23", "descNilai": 2 },
                        { "id": 3019681, "nama": "3 = IMT 23 atau lebih besar", "descNilai": 3 }
                    ]
                },
                {
                    "id": 7, "no": "F2", "nama": "Lingkar lengan atas (LiLA) - Jika IMT tidak dapat diukur",
                    "detail": [
                        { "id": 3019683, "nama": "0,0 = LiLA kurang dari 21", "descNilai": 0.0 },
                        { "id": 3019684, "nama": "0,5 = LiLA 21 hingga 22", "descNilai": 0.5 },
                        { "id": 3019685, "nama": "1,0 = LiLA lebih dari 22", "descNilai": 1.0 }
                    ]
                }
            ];

          
            $scope.listHumpty2 = [

                {
                    "id": 1, "nama": "Mempunyai riwayat jatuh , baru atau dlm 3 bulan terakhir",
                    "detail": [
                        { "id": 36100765, "nama": "Ya", "descNilai": "25" },
                        { "id": 36100766, "nama": "Tidak", "descNilai": "0" },
                    ]
                },
                {
                    "id": 2, "nama": "Diagnosis sekunder > dari 1",
                    "detail": [
                        { "id": 36100767, "nama": "Ya", "descNilai": "15" },
                        { "id": 36100768, "nama": "Tidak", "descNilai": "0" },
                    ]
                },
                {
                    "id": 3, "nama": "Ambulasi(berjalan)",
                    "detail": [
                        { "id": 36100769, "nama": "bedrest/dibantu perawat", "descNilai": "0" },
                        { "id": 36100770, "nama": "Penyangga/tongkat/walker/therepot/kursi roda", "descNilai": "15" },
                        { "id": 36100771, "nama": "Mencengkram furniture", "descNilai": "30" },

                    ]
                },
                {
                    "id": 4, "nama": "Terpasang IV line / pemberian heparin/Obat lain yg digunakan mempunyai efeksamping jatuh",
                    "detail": [
                        { "id": 36100772, "nama": "Ya", "descNilai": "20" },
                        { "id": 36100773, "nama": "Tidak", "descNilai": "0" },

                    ]
                },
                 {
                    "id": 5, "nama": "Cara Berjalan / Berpindah",
                    "detail": [
                        { "id": 36100774, "nama": "Normal / Bed Rest /Imobilisasi", "descNilai": "0" },
                        { "id": 36100775, "nama": "Kelelahan Dan Lemah ", "descNilai": "10" },
                        { "id": 36100776, "nama": "Keterbatasan /Terganggu ", "descNilai": "20" },
                        

                    ]
                },


                {
                    "id": 6, "nama": "Status Mental",
                    "detail": [
                        { "id": 36100778, "nama": "Normal/ Sesuai Kemampuan Diri", "descNilai": "0" },
                        { "id": 36100779, "nama": "Lupa / Keterbatasan Diri/ PenurunanKesedaran", "descNilai": "15" },
                        ]
                },

               
               

            ]
            $scope.listHumpty = [

                {
                    "id": 1, "nama": "Mata",
                    "detail": [
                        { "id": 33100267, "nama": "Terbuka Spontan", "descNilai": "4" },
                        { "id": 33100268, "nama": "Terbuka saat diperintah/dipanggil", "descNilai": "3" },
                        { "id": 33100269, "nama": "Terbuka terhadap rangsangan nyeri", "descNilai": "2" },
                        { "id": 33100270, "nama": "Tidak Merespon", "descNilai": "1" },
                    ]
                },

                {
                    "id": 2, "nama": "Verbal",
                    "detail": [
                        { "id": 33100271, "nama": "Orientasi baik", "descNilai": "5" },
                        { "id": 33100272, "nama": "Disoreintasi/bingung", "descNilai": "4" },
                        { "id": 33100273, "nama": "Jawaban tidak  sesuai", "descNilai": "3" },
                        { "id": 33100274, "nama": "Suara yang tidak dapat dimengerti (erangan,teriakan)", "descNilai": "2" },
                        { "id": 33100275, "nama": "Tidak Merespon", "descNilai": "1" },

                    ]
                },

                {
                    "id": 3, "nama": "Pergerakan",
                    "detail": [
                        { "id": 33100276, "nama": "Mengikuti diperintah", "descNilai": "6" },
                        { "id": 33100277, "nama": "Melokalisasi nyeri", "descNilai": "5" },
                        { "id": 33100278, "nama": "Menarik diri(withdrawn) dari rangsang nyeri", "descNilai": "4" },
                        { "id": 33100279, "nama": "Fleksi abnormal anggota gerak terhadap rangsang", "descNilai": "3" },
                        { "id": 33100280, "nama": "Ekstensi abnormal anggota gerak terhadap rangsang", "descNilai": "2" },
                        { "id": 33100281, "nama": "Tidak Merespon", "descNilai": "1" },
                    ]
                    
                },
            ]
            $scope.listADL = [

                {
                    "id": 1, "nama": "Makan/Memakai Baju",
                    "detail": [
                        { "id": 33100296, "nama": "75% dibantu", "descNilai": "3" },
                        { "id": 33100297, "nama": "50% dibantu", "descNilai": "2" },
                        { "id": 33100298, "nama": "25% dibantu", "descNilai": "1" },
                        { "id": 33100299, "nama": "Mandiri", "descNilai": "0" },
                    ]
                },

                {
                    "id": 2, "nama": "Berjalan",
                    "detail": [
                        { "id": 33100300, "nama": "75% dibantu", "descNilai": "3" },
                        { "id": 33100301, "nama": "50% dibantu", "descNilai": "2" },
                        { "id": 33100302, "nama": "25% dibantu", "descNilai": "1" },
                        { "id": 33100303, "nama": "Mandiri", "descNilai": "0" },

                    ]
                },

                {
                    "id": 3, "nama": "Mandi",
                    "detail": [
                        { "id": 33100304, "nama": "75% dibantu", "descNilai": "3" },
                        { "id": 33100305, "nama": "50% dibantu", "descNilai": "2" },
                        { "id": 33100306, "nama": "25% dibantu", "descNilai": "1" },
                        { "id": 33100307, "nama": "Mandiri", "descNilai": "0" },
                    ]
                    
                },
            ]
            $scope.listADL2 = [

                {
                    "id": 1, "nama": "Apakah pasien memiliki status nutrisi kurang atau buruk secara klinis (kurus/ sangat kurus,mata cekung,wajah tampak tua,edema,rambut tipis dan jarang, otot lengan dan paha tipis,iga gambang,perut kempes,bokong tipis/kisut)?",
                    "detail": [
                        { "id": 33100365, "nama": "Ya", "descNilai": "1","type":"checkbox"  },
                        { "id": 33100366, "nama": "Tidak", "descNilai": "0","type":"checkbox"  },
                    
                    ]
                },
                
                {
                    "id": 2, "nama": "Apakah terdapat penurunan berat badan selama satu bulan terakhir? Untuk bayi < 1 tahun berat badan tidak naik selama 3 bulan terakhir Bila menjawab tidak tahu, dianggap ya (1)",
                    "detail": [
                        { "id": 33100367, "nama": "Ya", "descNilai": "1","type":"checkbox"  },
                        { "id": 33100368, "nama": "Tidak", "descNilai": "0","type":"checkbox"  },
                    ]
                },
                {
                    "id": 3, "nama": "Apakah terdapat salah satu dari kondisi berikut : a.  Diare Profus ( > 5 kali/hari dan/ atau muntah ( >3 kali/ hari) b.  Asupan makan berkurang selama 1 minggu terakhir",
                    "detail": [
                        { "id": 33100369, "nama": "Ya", "descNilai": "1","type":"checkbox"  },
                        { "id": 33100370, "nama": "Tidak", "descNilai": "0","type":"checkbox"  },,
                    ]
                },
                {
                    "id": 4, "nama": "Apakah terdapat penyakit dasar atau keadaan yang mengakibatkan pasien beresiko mengalami malnurisi : ",
                    "detail": [
                        { "id": 33100371, "nama": "Ya", "descNilai": "1","type":"checkbox"  },
                        { "id": 33100372, "nama": "Tidak", "descNilai": "0","type":"checkbox"  },
                    ]
                },

                
            ]
            $scope.listNorton = [

                {
                    "id": 1, "nama": "Kondisi Fisik",
                    "detail": [
                        { "id": 31410454, "nama": "Baik", "descNilai": "4" },
                        { "id": 31410455, "nama": "Cukup", "descNilai": "3" },
                        { "id": 31410456, "nama": "Buruk", "descNilai": "2" },
                        { "id": 31410457, "nama": "Sangat Buruk", "descNilai": "1" },
                    ]
                },

                {
                    "id": 2, "nama": "Kondisi Mental",
                    "detail": [
                        { "id": 31410458, "nama": "Kompos Mentis", "descNilai": "4" },
                        { "id": 31410459, "nama": "Apatis", "descNilai": "3" },
                        { "id": 31410460, "nama": "Delirium", "descNilai": "2" },
                        { "id": 31410461, "nama": "Stupor", "descNilai": "1" },

                    ]
                },

                {
                    "id": 3, "nama": "Aktifitas",
                    "detail": [
                        { "id": 31410462, "nama": "Mandiri", "descNilai": "4" },
                        { "id": 31410463, "nama": "Dipapah", "descNilai": "3" },
                        { "id": 31410464, "nama": "Kursi Roda", "descNilai": "2" },
                        { "id": 31410465, "nama": "Tirah Baring", "descNilai": "1" },
                    ]
                    
                },

                {
                    "id": 4, "nama": "Mobilitas",
                    "detail": [
                        { "id": 31410466, "nama": "Baik", "descNilai": "4" },
                        { "id": 31410467, "nama": "Agak Terbatas", "descNilai": "3" },
                        { "id": 31410468, "nama": "Sangat Terbatas", "descNilai": "2" },
                        { "id": 31410469, "nama": "Imobilisasi", "descNilai": "1" },

                    ]
                },
                {
                    "id": 5, "nama": "Inkkontenesia",
                    "detail": [
                        { "id": 31410470, "nama": "Tidak", "descNilai": "4" },
                        { "id": 31410471, "nama": "Terkadang", "descNilai": "3" },
                        { "id": 31410472, "nama": "Sering", "descNilai": "2" },
                        { "id": 31410473, "nama": "Selalu", "descNilai": "1" },


                    ]
                },
                // {
                //     "id": 6, "nama": "Respon terhadap :Pembedahan/sedasi/anestesi, penggunaan medikamentosa",
                //     "detail": [
                //         { "id": 80526, "nama": "Dalam 24 jam ", "descNilai": "3" },
                //         { "id": 80527, "nama": "Dalam 48 jam", "descNilai": "2" },
                //         { "id": 80528, "nama": "> 48 jam/tidak mengalami perbedaan/sedasi/anestesi", "descNilai": "1" },

                //     ]
                // },
                // {
                //     "id": 7, "nama": "Penggunaan medikamentosa",
                //     "detail": [
                //         { "id": 80529, "nama": "penggunaan multiple, sedatif, obat hipnosis, harbiturat, fanotiazin, anti depresan, pencahar, diuretik, narkosa", "descNilai": "3" },
                //         { "id": 80530, "nama": "penggunaan salah satu obat diatas", "descNilai": "2" },
                //         { "id": 80531, "nama": "penggunaan medikasi lainnya atau tidak ada medikasi", "descNilai": "1" },

                //     ]
                // },
            ]


            $scope.listRiwayatKesehatan = [
                
                {
                    "id": 7, "nama": "Keluhan Nyeri ",
                    "detail": [
                        { "id": 7606, "nama": "Tidak Ada", "type": "checkbox" },
                        { "id": 7607, "nama": "Ada , lokasi :", "type": "checkbox" },
                        { "id": 7608, "nama": "Ada , jelaskan :", "type": "textbox" },
                    ]
                },
            ]
            $scope.listSkorNRC = [{
                "id": 8, "nama": "Score ",
                "detail": [
                    { "id": 3016562, "nama": "0", "type": "checkbox", "ket": "= Tidak Nyeri" },
                    { "id": 3016563, "nama": "1 - 3", "type": "checkbox", "ket": "= Nyeri Ringan" },
                    { "id": 3016564, "nama": "4 - 6", "type": "checkbox", "ket": "= Nyeri Sedang" },
                    { "id": 3016565, "nama": "7 - 10", "type": "checkbox", "ket": "= Nyeri Berat" },
                ]
            }]
            $scope.listNyeriAnak = [
                {
                    "id": 10, "nama": "Hurts", "detail": [
                    { "id": 3018912, "nama": "Tidak Nyeri","nama1": "0", "descNilai": 0 },
                    { "id": 3018913, "nama": "Sedikit Nyeri", "nama1": "1 2 3", "descNilai": 2 }, 
                    { "id": 3018914, "nama": "Agak mengganggu", "nama1": "4", "descNilai": 4 },
                    { "id": 3018915, "nama": "Mengganggu Aktivitas","nama1": "5 6 7",  "descNilai": 6}, 
                    { "id": 3018916, "nama": "Sangat mengganggu", "nama1": "8", "descNilai": 8 },
                    { "id": 3018917, "nama": "Tak tertahankan", "nama1": "9 10",  "descNilai": 10 }
                ]
                }
            ]
    
            $scope.listSkorWong = [{
                "id": 9, "nama": "Score ",
                "detail": [
                    { "id": 3018918, "nama": "0 = Tidak Ada Nyeri", "type": "checkbox"},
                    { "id": 3018919, "nama": "1 - 2 - 3 = Sedikit Nyeri", "type": "checkbox"},
                    { "id": 3018920, "nama": "4 = Agak mengganggu", "type": "checkbox" },
                    { "id": 3018921, "nama": "5 - 6 - 7 = Mengganggu aktivitas", "type": "checkbox"},
                    { "id": 3018922, "nama": "8 = Sangat mengganggu", "type": "checkbox"},
                    { "id": 3018923, "nama": "9 - 10 = Tak Tertahankan", "type": "checkbox", },
                ]
            }]
                $scope.listScoreGambar = [
                    {
                        "id": 1, "nama": "",
                        "detail": [
                            { "id": 3015224, "nama": "Tidak Nyeri", "type": "checkbox" },
                            { "id": 3015225, "nama": "Sedikit Nyeri", "type": "checkbox" },
                            { "id": 3015226, "nama": "Agak Mengganggu", "type": "checkbox" },
                            { "id": 3015227, "nama": "Mengganggu Aktivitas", "type": "checkbox" },
                            { "id": 3015228, "nama": "Sangat Mengganggu", "type": "checkbox" },
                            { "id": 3015229, "nama": "Tak Tertahankan", "type": "checkbox" },
                        ]
                    },
                ]
    
            $scope.listMorse = [

                {
                    "id": 1, "nama": "Riwayat pasien : Apakah pasien pernah jatuh dalam 3 bulan terakhir?",
                    "detail": [
                        { "id": 33100309, "nama": "Tidak", "descNilai": "0" },
                        { "id": 33100310, "nama": "Ya", "descNilai": "25" },
                    ]
                },

                {
                    "id": 2, "nama": "Diagnosa Sekunder : Apakah pasien memiliki lebih dari satu penyakit?",
                    "detail": [
                        { "id": 33100311, "nama": "Tidak", "descNilai": "0" },
                        { "id": 33100312, "nama": "Ya", "descNilai": "15" },
                    ]
                },

                {
                    "id": 3, "nama": "Alat Bantu Jalan",
                    "detail": [
                        { "id": 33100313, "nama": "Bed rest dibantu perawat", "descNilai": "0" },
                        { "id": 33100314, "nama": "Kruk/tongkat/walker", "descNilai": "15" },
                        { "id": 33100315, "nama": "Berpegangan pada benda-benda disekitar", "descNilai": "30" },

                    ]
                },

                {
                    "id": 4, "nama": "Terapi Intravena : Apakah saat ini pasien terpasang infus?",
                    "detail": [
                        { "id": 33100316, "nama": "Tidak", "descNilai": "0" },
                        { "id": 33100317, "nama": "Ya", "descNilai": "20" },

                    ]
                },
                {
                    "id": 5, "nama": "Gaya berjalan/cara  berpindah",
                    "detail": [
                        { "id": 33100318, "nama": "Normal/Bed rest/immobile(tidak dapat bergerak sendiri", "descNilai": "0" },
                        { "id": 33100319, "nama": "Kruk/tongkat/walker", "descNilai": "15" },
                        { "id": 33100320, "nama": "Berpegangan pada benda-benda disekitar", "descNilai": "30" },


                    ]
                },
                {
                    "id": 6, "nama": "Status Mental",
                    "detail": [
                        { "id": 33100321, "nama": "pasien Menyadari kondisinya", "descNilai": "0" },
                        { "id": 33100322, "nama": "Pasien mengalami keterbatasan daya ingat", "descNilai": "15" },

                    ]
                },

            ]
            $scope.listPerencanaan1 = [
                {
                    "id": 1, "nama": "Perencanaan1",
                    "detail": [
                        { "id": 3018436, "nama": "Bersihan jalan meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3018437, "nama": "Ventilasi adekuat", "satuan": "", "type": "checkbox" },
                        { "id": 3018438, "nama": "Curah jantung meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3018439, "nama": "Kadar glukosa darah dalam rentang normal", "satuan": "", "type": "checkbox" },
                        { "id": 3018440, "nama": "Perfusi perifer meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3018441, "nama": "Nausea menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3018442, "nama": "Status nutrisi membaik", "satuan": "", "type": "checkbox" },
                        { "id": 3018443, "nama": "Defekasi normal", "satuan": "", "type": "checkbox" },
                        { "id": 3018444, "nama": "Integritas kulit", "satuan": "", "type": "checkbox" },
                        { "id": 3018445, "nama": "Status cairan membaik ", "satuan": "", "type": "checkbox" },
                        { "id": 3018446, "nama": "Suhu dalam rentang normal ", "satuan": "", "type": "checkbox" },
                        { "id": 3018447, "nama": "Keseimbangan cairan meningkat", "satuan": "", "type": "checkbox" },
                        { "id": 3018448, "nama": "Tingkat nyeri menurun", "satuan": "", "type": "checkbox" },
                        { "id": 3018449, "nama": "Kontinensia urine / vekal membaik", "satuan": "", "type": "checkbox" },
                        { "id": 3018450, "nama": "Tidak terjadi cidera", "satuan": "", "type": "checkbox" },
                        { "id": 3018451, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3018452, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018453, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018454, "nama": "", "satuan": "", "type": "textbox" },
                        
                    ]
                }
            ]
            $scope.listPerencanaan2 = [
                {
                    "id": 1, "nama": "Perencanaan2",
                    "detail": [
                        { "id": 3018456, "nama": "Latihan batuk efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3018457, "nama": "Manajemen jalan nafas", "satuan": "", "type": "checkbox" },
                        { "id": 3018458, "nama": "Pemantauan respirasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018459, "nama": "Manajemen ashma", "satuan": "", "type": "checkbox" },
                        { "id": 3018460, "nama": "Edukasi keluarga tentang ", "satuan": "", "type": "checkbox" },
                        { "id": 3018461, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018462, "nama": "Edukasi pasien tentang", "satuan": "", "type": "checkbox" },
                        { "id": 3018463, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018464, "nama": "Dukungan Ventilasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018465, "nama": "Perawatan Jantung", "satuan": "", "type": "checkbox" },
                        { "id": 3018466, "nama": "Resusitasi jantung paru", "satuan": "", "type": "checkbox" },
                        { "id": 3018467, "nama": "Manajemen hiperglikemi", "satuan": "", "type": "checkbox" },
                        { "id": 3018468, "nama": "Manajemen hipoglikemi", "satuan": "", "type": "checkbox" },
                        { "id": 3018469, "nama": "Perawatan sirkulasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018470, "nama": "Manajemen mual", "satuan": "", "type": "checkbox" },
                        { "id": 3018471, "nama": "Manajemen muntah", "satuan": "", "type": "checkbox" },
                        { "id": 3018472, "nama": "Manajemen nutrisi", "satuan": "", "type": "checkbox" },
                        { "id": 3018473, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018474, "nama": "Manajemen diare", "satuan": "", "type": "checkbox" },
                        { "id": 3018475, "nama": "Pemantauan cairan", "satuan": "", "type": "checkbox" },
                        { "id": 3018476, "nama": "Perawatan luka", "satuan": "", "type": "checkbox" },
                        { "id": 3018477, "nama": "Penjahitan luka", "satuan": "", "type": "checkbox" },
                        { "id": 3018478, "nama": "Manajemen kesehatan lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3018479, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018480, "nama": "Manajemen kejang", "satuan": "", "type": "checkbox" },
                        { "id": 3018481, "nama": "Manajemen hipovolemia / syok hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3018482, "nama": "Manajemen hipertermi / hipotermia", "satuan": "", "type": "checkbox" },
                        { "id": 3018483, "nama": "Manajemen hipervolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3018484, "nama": "Manajemen nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 3018485, "nama": "Pemberian analgetik", "satuan": "", "type": "checkbox" },
                        { "id": 3018486, "nama": "Terapi relaxasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018487, "nama": "Manajemen inkontinensia urine / vekal", "satuan": "", "type": "checkbox" },
                        { "id": 3018488, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3018489, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018490, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018491, "nama": "", "satuan": "", "type": "textbox" },
                        
                        
                    ]
                }
            ]
            $scope.listPerencanaan3 = [
                {
                    "id": 1, "nama": "Perencanaan3",
                    "detail": [
                        { "id": 3018494, "nama": "Latihan batuk efektif", "satuan": "", "type": "checkbox" },
                        { "id": 3018495, "nama": "Manajemen jalan nafas", "satuan": "", "type": "checkbox" },
                        { "id": 3018496, "nama": "Pemantauan respirasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018497, "nama": "Manajemen ashma", "satuan": "", "type": "checkbox" },
                        { "id": 3018498, "nama": "Edukasi keluarga tentang ", "satuan": "", "type": "checkbox" },
                        { "id": 3018499, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018500, "nama": "Edukasi pasien tentang", "satuan": "", "type": "checkbox" },
                        { "id": 3018501, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018502, "nama": "Dukungan Ventilasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018503, "nama": "Perawatan Jantung", "satuan": "", "type": "checkbox" },
                        { "id": 3018504, "nama": "Resusitasi jantung paru", "satuan": "", "type": "checkbox" },
                        { "id": 3018505, "nama": "Manajemen hiperglikemi", "satuan": "", "type": "checkbox" },
                        { "id": 3018506, "nama": "Manajemen hipoglikemi", "satuan": "", "type": "checkbox" },
                        { "id": 3018507, "nama": "Perawatan sirkulasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018508, "nama": "Manajemen mual", "satuan": "", "type": "checkbox" },
                        { "id": 3018509, "nama": "Manajemen muntah", "satuan": "", "type": "checkbox" },
                        { "id": 3018510, "nama": "Manajemen nutrisi", "satuan": "", "type": "checkbox" },
                        { "id": 3018511, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018512, "nama": "Manajemen diare", "satuan": "", "type": "checkbox" },
                        { "id": 3018513, "nama": "Pemantauan cairan", "satuan": "", "type": "checkbox" },
                        { "id": 3018514, "nama": "Perawatan luka", "satuan": "", "type": "checkbox" },
                        { "id": 3018515, "nama": "Penjahitan luka", "satuan": "", "type": "checkbox" },
                        { "id": 3018516, "nama": "Manajemen kesehatan lingkungan", "satuan": "", "type": "checkbox" },
                        { "id": 3018517, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018518, "nama": "Manajemen kejang", "satuan": "", "type": "checkbox" },
                        { "id": 3018519, "nama": "Manajemen hipovolemia / syok hipovolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3018520, "nama": "Manajemen hipertermi / hipotermia", "satuan": "", "type": "checkbox" },
                        { "id": 3018521, "nama": "Manajemen hipervolemia", "satuan": "", "type": "checkbox" },
                        { "id": 3018522, "nama": "Manajemen nyeri", "satuan": "", "type": "checkbox" },
                        { "id": 3018523, "nama": "Pemberian analgetik", "satuan": "", "type": "checkbox" },
                        { "id": 3018524, "nama": "Terapi relaxasi", "satuan": "", "type": "checkbox" },
                        { "id": 3018525, "nama": "Manajemen inkontinensia urine / vekal", "satuan": "", "type": "checkbox" },
                        { "id": 3018526, "nama": "Lainnya", "satuan": "", "type": "textbox" },
                        { "id": 3018527, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018528, "nama": "", "satuan": "", "type": "textbox" },
                        { "id": 3018529, "nama": "", "satuan": "", "type": "textbox" },
                        
                    ]
                }
            ]
           
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
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
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                    noregEMR = $scope.cc.noregistrasi
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {                
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[31300216] = { value: $scope.cc.iddpjp , text:  $scope.cc.dokterdpjp }
                // $scope.item.obj[13305] = { value: $scope.cc.objectruanganfk , text:  $scope.cc.namaruangan }
                // $scope.item.obj[13306] = { value: $scope.cc.objectkelasfk , text:  $scope.cc.namakelas }
                $scope.item.obj[3019600] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                dataLoad = dat.data.data                                      

                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                              if(dataLoad[i].emrdfk == 36100777)
                                $scope.totalSkor2 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 33100323)
                                $scope.totalSkor3 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 33100282)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 31410474)
                                $scope.totalSkor5 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 33100308)
                                $scope.totaladl = parseFloat(dataLoad[i].value)
                            if(dataLoad[i].emrdfk == 36100349)
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)
                            if(dataLoad[i].emrdfk == 33100373)
                                $scope.totalGziDewasa = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  36100380)
                                $scope.totalSkorAses =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016809)
                                $scope.skorNutrisiAnak =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016822)
                            $scope.skorNutrisiDewasa =parseFloat( dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textbox2") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk ==  3016809)
                            $scope.skorNutrisiAnak =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016822)
                            $scope.skorNutrisiDewasa =parseFloat( dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textbox3") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk ==  3016809)
                            $scope.skorNutrisiAnak =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016822)
                            $scope.skorNutrisiDewasa =parseFloat( dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textbox12") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk ==  3016809)
                            $scope.skorNutrisiAnak =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016822)
                            $scope.skorNutrisiDewasa =parseFloat( dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textboxr") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk ==  3016809)
                            $scope.skorNutrisiAnak =parseFloat( dataLoad[i].value)
                            if (dataLoad[i].emrdfk ==  3016822)
                            $scope.skorNutrisiDewasa =parseFloat( dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                           // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                             //   $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            //}
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.skorNutrisiDewasa(datass)
                            }
                            


                        }
                        if (dataLoad[i].type == "checkbox2") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                           // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                             //   $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            //}
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.skorNutrisiDewasa(datass)
                            }
                            


                        }
                        if (dataLoad[i].type == "checkbox4") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                           // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                             //   $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            //}
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.skorNutrisiDewasa(datass)
                            }
                            


                        }
                        if (dataLoad[i].type == "checkbo") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                         //   $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                          //  if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                           //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                          //  }
                            


                        }
                        if (dataLoad[i].type == "checkbox6") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                           // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                             //   $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            //}
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.skorNutrisiDewasa(datass)
                            }
                            


                        }
                        if (dataLoad[i].type == "checkbox12") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                           // if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                             //   $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            //}
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisiAnak(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.skorNutrisiDewasa(datass)
                            }
                            


                        }
                        if (dataLoad[i].type == "checkbo") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                         //   $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                          //  if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                           //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                          //  }
                            


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
                        if (dataLoad[i].type == "textarea2") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                    }

                }
                $scope.getSkorMNA();
            })
            $scope.skorMNA = 0;
            $scope.getSkorMNA = function (stat, detail) {
                if (stat && detail) {
                    if ($scope.item.obj[stat.id]) {
                        for (var i = 0; i < detail.length; i++) {
                            if (detail[i].id != stat.id) {
                                $scope.item.obj[detail[i].id] = false;
                            }
                        }
                    }
                }

                // hitung total score
                var total = 0;
                if ($scope.listSkriningGiziMNA) {
                    for (var i = 0; i < $scope.listSkriningGiziMNA.length; i++) {
                        var question = $scope.listSkriningGiziMNA[i];
                        for (var j = 0; j < question.detail.length; j++) {
                            var option = question.detail[j];
                            if ($scope.item.obj[option.id] === true) {
                                var nilai = parseFloat(option.descNilai) || 0;
                                total += nilai;
                            }
                        }
                    }
                }
                
                $scope.skorMNA = total;
                $scope.item.obj[3019686] = total.toString();
            };

            $scope.skorNutrisi = 0
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

                $scope.item.obj[36100349] = $scope.skorNutrisi
            }
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
                $scope.item.obj[3018975] = $scope.skorNutrisiAnak
            }
          
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
                $scope.item.obj[3018988] = $scope.skorNutrisiDewasa
            }
            $scope.getSkorAsesmen = function(stat,skor){
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)

                            }
                            if (stat.baris == 2) {
                                $scope.totalSkorAses2 = $scope.totalSkorAses2 + parseFloat(skor.descNilai)

                            }
                            break
                        }
                        if ($scope.item.obj[parseFloat(arrobj[i])] == false) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)

                            }
                            if (stat.baris == 2) {
                                $scope.totalSkorAses2 = $scope.totalSkorAses2 - parseFloat(skor.descNilai)

                            }
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[36100380] = $scope.totalSkorAses 
            }
            $scope.totalSkorAses =0
            //skor morse
            $scope.$watch('item.obj[33100323]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai <=24 ) {
                    $scope.item.obj[33100324] = true
                    $scope.item.obj[33100325] = false
                    $scope.item.obj[33100326] = false
                   
                }
                if (nilai >= 25 && nilai <=50) {
                    $scope.item.obj[33100324] = false
                    $scope.item.obj[33100325] = true
                    $scope.item.obj[33100326] = false
                 
                }
                if (nilai >50 ) {
                    $scope.item.obj[33100324] = false
                    $scope.item.obj[33100325] = false
                    $scope.item.obj[33100326] = true
                 
                }
                
            });
            $scope.getSkor3 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor3 = $scope.totalSkor3 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor3 = $scope.totalSkor3 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[33100323] = $scope.totalSkor3
                // setSkorAkhir($scope.item.obj[3152])
            }
            //end skor mores
            //skorglasgow
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
                $scope.item.obj[33100282] = $scope.totalSkor4
            }
            $scope.$watch('item.obj[33100282]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >=13 && nilai <=15 ) {
                    $scope.item.obj[33100283] = true
                    $scope.item.obj[33100284] = false
                    $scope.item.obj[33100285] = false
                   
                }
                if (nilai >=9 && nilai <=12) {
                    $scope.item.obj[33100283] = false
                    $scope.item.obj[33100284] = true
                    $scope.item.obj[33100285] = false
                 
                }
                if (nilai >=3 && nilai <=8) {
                    $scope.item.obj[33100283] = false
                    $scope.item.obj[33100284] = false
                    $scope.item.obj[33100285] = true
                 
                }
                
            })
            //end glasgow

            $scope.getSkor5 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor5 = $scope.totalSkor5 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor5 = $scope.totalSkor5 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[31410474] = $scope.totalSkor5
            }
            $scope.getGziDewasa = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalGziDewasa = $scope.totalGziDewasa + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalGziDewasa = $scope.totalGziDewasa - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[33100373] = $scope.totalGziDewasa
            }
            

            $scope.getadl = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totaladl = $scope.totaladl + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totaladl = $scope.totaladl - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[33100308] = $scope.totaladl
            }
            //skor humpty
            $scope.$watch('item.obj[33100353]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)

                if (nilai <7 ) {
                    $scope.item.obj[33100350] = true
                    $scope.item.obj[33100351] = false
                    $scope.item.obj[33100352] = false
                }
                if (nilai >=7 && nilai <=11 ) {
                    $scope.item.obj[33100350] = false
                    $scope.item.obj[33100351] = true
                    $scope.item.obj[33100352] = false
                   
                }
                if (nilai >= 12) {
                    $scope.item.obj[33100350] = false
                    $scope.item.obj[33100351] = false
                    $scope.item.obj[33100352] = true
                 
                }

                
            })
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
                $scope.item.obj[36100777] = $scope.totalSkor2
            }
            //end skor humpty

             $scope.$watch('item.obj[3016561]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)

                if (nilai == 0) {
                    $scope.item.obj[3016562] = true
                    $scope.item.obj[3016563] = false
                    $scope.item.obj[3016564] = false
                    $scope.item.obj[3016565] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[3016562] = false
                    $scope.item.obj[3016563] = true
                    $scope.item.obj[3016564] = false
                    $scope.item.obj[3016565] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[3016562] = false
                    $scope.item.obj[3016563] = false
                    $scope.item.obj[3016564] = true
                    $scope.item.obj[3016565] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[3016562] = false
                    $scope.item.obj[3016563] = false
                    $scope.item.obj[3016564] = false
                    $scope.item.obj[3016565] = true
                }
            });
             $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[3018918] = true
                    $scope.item.obj[3018919] = false
                    $scope.item.obj[3018920] = false
                    $scope.item.obj[3018921] = false
                    $scope.item.obj[3018922] = false
                    $scope.item.obj[3018923] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[3018918] = false
                    $scope.item.obj[3018919] = true
                    $scope.item.obj[3018920] = false
                    $scope.item.obj[3018921] = false
                    $scope.item.obj[3018922] = false
                    $scope.item.obj[3018923] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[3018918] = false
                    $scope.item.obj[3018919] = false
                    $scope.item.obj[3018920] = true
                    $scope.item.obj[3018921] = false
                    $scope.item.obj[3018922] = false
                    $scope.item.obj[3018923] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[3018918] = false
                    $scope.item.obj[3018919] = false
                    $scope.item.obj[3018920] = false
                    $scope.item.obj[3018921] = true
                    $scope.item.obj[3018922] = false
                    $scope.item.obj[3018923] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[3018918] = false
                    $scope.item.obj[3018919] = false
                    $scope.item.obj[3018920] = false
                    $scope.item.obj[3018921] = false
                    $scope.item.obj[3018922] = true
                    $scope.item.obj[3018923] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[3018918] = false
                    $scope.item.obj[3018919] = false
                    $scope.item.obj[3018920] = false
                    $scope.item.obj[3018921] = false
                    $scope.item.obj[3018922] = false
                    $scope.item.obj[3018923] = true
                }

            }
             
            $scope.$watch('item.obj[7589]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[7590] = true
                    $scope.item.obj[7591] = false
                    $scope.item.obj[7592] = false
                    $scope.item.obj[7593] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[7590] = false
                    $scope.item.obj[7591] = true
                    $scope.item.obj[7592] = false
                    $scope.item.obj[7593] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[7590] = false
                    $scope.item.obj[7591] = false
                    $scope.item.obj[7592] = true
                    $scope.item.obj[7593] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[7590] = false
                    $scope.item.obj[7591] = false
                    $scope.item.obj[7592] = false
                    $scope.item.obj[7593] = true
                }
            });

            
        
            
            

            $scope.Batal =function(){
                $scope.item.obj=[]
            }
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

                    $rootScope.loadRiwayat()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'PengkajianAwalKepNAPZACtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    $scope.cc.norec_emr = e.data.data.noemr
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }
            $scope.cetakBlade = function(){
                if (norecEMR == '') return
            
              var local =JSON.parse(localStorage.getItem('profile')) 
              var nama = medifirstService.getPegawaiLogin().namaLengkap
          
               window.open(config.baseApiBackend + 'report/cetak-asesmen-keperawatan-inap?nocm='
                   + $scope.cc.nocm + '&norec_apd='+  $scope.cc.norec +'&emr=' + norecEMR
                   + '&emrfk='+  $scope.cc.emrfk
                   +'&kdprofile='+local.id 
                   +'&nama='+nama,  '_blank');
            } 

        }
    ]);
});