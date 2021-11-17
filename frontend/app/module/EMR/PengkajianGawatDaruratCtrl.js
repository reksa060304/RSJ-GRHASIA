define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PengkajianGawatDaruratCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 17002
            $scope.muncul = false
            $scope.isCetak = true;
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-jenis', true, true, 10).then(function (data) {
                $scope.listJenisDiagnosa = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.getPart('emr/get-datacombo-part-covid', true, true, 20).then(function (data) {
                $scope.listStatusCovid = data
            })
            $scope.listYa = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listReaktif = [
                { name: "Non Reaktif", id: 1 },
                { name: "Reaktif", id: 2 }
            ];
            $scope.listNegatif= [
                { name: "Negatif", id: 1 },
                { name: "Positif", id: 2 }
            ];
            $scope.listAda= [
                { name: "Ada", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listStatusMasuk = [
                {
                    "id": 1, "nama": "Status Masuk",
                    "detail": [
                        
                        { "id": 17000089, "nama": "Kontak Erat", "type": "checkbox"},
                        { "id": 17000090, "nama": "Suspek", "type": "checkbox"},
                        { "id": 17000091, "nama": "Probable", "type": "checkbox"},
                        { "id": 17000092, "nama": "Konfirmasi", "type": "checkbox"},
                    ]
                }
            ]
            $scope.listCaraMasuk = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000097, "nama": "Nama", "type": "textbox"},
                        { "id": 17000098, "nama": "Pekerjaan", "type": "textbox"},
                        { "id": 17000099, "nama": "No.telp", "type": "textbox"},
                        { "id": 17000100, "nama": "Alamat", "type": "textbox2"}
                    ]
                }
            ]
            $scope.listRiwayatKes = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000104, "nama": "Riwayat Kesehatan Saat Ini", "type": "textarea"},
                        { "id": 17000105, "nama": "Riwayat Kesehatan Yang Lalu dan Riwayat Kesehatan Keluarga", "type": "textarea"},
                        { "id": 17000106, "nama": "Riwayat Alergi", "type": "textarea"},
                    ]
                }
            ]
            $scope.listTandaVital = [
                {
                    "id": 1, "nama": "A. Tanda-tanda vital :",
                    "detail": [
                        
                        { "id": 17000211, "nama": "TD", "type": "textbox", "satuan" : "mmHg"},
                        { "id": 17000212, "nama": "Nadi", "type": "textbox", "satuan" : "x/mnt"},
                        { "id": 17000213, "nama": "BB", "type": "textbox", "satuan" : "kg"},
                        { "id": 17000214, "nama": "Suhu", "type": "textbox", "satuan" : "C"},
                        { "id": 17000215, "nama": "RR", "type": "textbox", "satuan" : "x/mnt"},
                        { "id": 17000216, "nama": "TB", "type": "textbox", "satuan" : "cm"},
                    ]
                },
                {
                    "id": 1, "nama": "B. Kesadaran :",
                    "detail": [
                        
                        { "id": 17000217, "nama": "CM", "type": "checkbox"},
                        { "id": 17000218, "nama": "Apatis", "type": "checkbox"},
                        { "id": 17000219, "nama": "Somnolent", "type": "checkbox"},
                        { "id": 17000220, "nama": "Soporus", "type": "checkbox"},
                        { "id": 17000224, "nama": "Coma", "type": "checkbox"},
                        { "id": 17000225, "nama": "GCS", "type": "checkbox"},
                        { "id": 17000226, "nama": "Lainnya", "type": "textbox"},
                    ]
                }
            ]
            $scope.listDataPsiSO = [
                {
                    "id": 1, "nama": "Sosiologi",
                    "detail": [
                        
                        { "id": 17000107, "nama": "TAK", "type": "checkbox"},
                        { "id": 17000108, "nama": "Komunikasi", "type": "checkbox"},
                        { "id": 17000109, "nama": "Menarik Diri", "type": "checkbox"},
                    ]
                },
                {
                    "id": 1, "nama": "Psikologi",
                    "detail": [
                        
                        { "id": 17000110, "nama": "TAK", "type": "checkbox"},
                        { "id": 17000111, "nama": "Gelisah", "type": "checkbox"},
                        { "id": 17000112, "nama": "Takut", "type": "checkbox"},
                        { "id": 17000113, "nama": "Sedih", "type": "checkbox"},
                        { "id": 17000114, "nama": "Rendah diri", "type": "checkbox"},
                        { "id": 17000115, "nama": "Acuh", "type": "checkbox"},
                        { "id": 17000116, "nama": "Hyperaktif", "type": "checkbox"},
                        { "id": 17000117, "nama": "Marah", "type": "checkbox"},
                        { "id": 17000118, "nama": "Mudah Tersinggung", "type": "checkbox"},
                    ]
                }
            ]
            $scope.listGejala = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 18000243, "nama": "Demam", "type": "checkbox"},
                        { "id": 18000244, "nama": "Batuk Kering", "type": "checkbox"},
                        { "id": 18000245, "nama": "Batuk Berdahak", "type": "checkbox"},
                        { "id": 18000246, "nama": "Sakit Tenggorokan", "type": "checkbox"},
                        { "id": 18000247, "nama": "Pilek", "type": "checkbox"},
                        { "id": 18000248, "nama": "Sesak Napas", "type": "checkbox"},
                        { "id": 18000249, "nama": "Gangguan Penciuman ", "type": "checkbox"},
                        { "id": 18000250, "nama": "Gangguan Pengecapan?", "type": "checkbox"},
                        { "id": 18000251, "nama": "Mulut Kering", "type": "checkbox"},
                        { "id": 18000252, "nama": "Nyeri Otot ", "type": "checkbox"},
                        { "id": 18000253, "nama": "Nyeri Sendi", "type": "checkbox"},
                        { "id": 18000254, "nama": "Lelah", "type": "checkbox"},
                        { "id": 18000255, "nama": "Pusing Atau Sakit Kepala", "type": "checkbox"},
                        { "id": 18000256, "nama": "Nyeri Perut ", "type": "checkbox"},
                        { "id": 18000257, "nama": "Kulit Kemerahan", "type": "checkbox"},
                        { "id": 18000258, "nama": "Mual Muntah", "type": "checkbox"},
                        { "id": 18000259, "nama": "Diare", "type": "checkbox"},
                        { "id": 18000260, "nama": "Tidak Ada Gejala", "type": "checkbox"},
                    ]
                }
            ]
            $scope.listDiagnosa = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000119, "nama": "A.", "type": "textarea"},
                        { "id": 17000120, "nama": "B.", "type": "textarea"},
                        { "id": 17000121, "nama": "C.", "type": "textarea"},
                    ]
                }
            ]
            $scope.listPenunjang = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000122, "nama": "A.", "type": "textarea"},
                        { "id": 17000123, "nama": "B.", "type": "textarea"},
                        { "id": 17000124, "nama": "C.", "type": "textarea"},
                        { "id": 17000125, "nama": "D.", "type": "textarea"},
                        { "id": 17000126, "nama": "E.", "type": "textarea"},
                        { "id": 17000127, "nama": "F.", "type": "textarea"},
                    ]
                }
            ]
            $scope.listIntruksi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000128, "nama": "", "type": "textarea"},
                        // { "id": 17000129, "nama": "B.", "type": "textarea"},
                        // { "id": 17000130, "nama": "C.", "type": "textarea"},
                        // { "id": 17000130, "nama": "D.", "type": "textarea"},
                        // { "id": 17000130, "nama": "E.", "type": "textarea"},
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
                $scope.cc.alamatlengkap = chacePeriode[15]
                $scope.cc.noidentitas = chacePeriode[19]
                $scope.cc.namaibu = chacePeriode[20]
                $scope.cc.tgllahir = chacePeriode [18]
                $scope.cc.peker = chacePeriode[21]
                $scope.cc.idpeker = chacePeriode [22]
                $scope.cc.nohp = chacePeriode [23]
                $scope.cc.penanggungjawab = chacePeriode [24]
                $scope.cc.hubungankeluargapj = chacePeriode[25]
                $scope.cc.alamatrmh = chacePeriode [26]
                $scope.cc.teleponpenanggungjawab = chacePeriode [27]
                $scope.cc.asalrujukan = chacePeriode [32]

                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false
           if(nomorEMR!='-'){
               cacheHelper.set('cacheEMR_TRIASE_PRIMER_UMUM', nomorEMR)
           }
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[17000097]=$scope.cc.namapasien
                $scope.item.obj[17000098] = $scope.cc.peker
                $scope.item.obj[17000099] = $scope.cc.nohp
                $scope.item.obj[17000100] = $scope.cc.alamatlengkap
                $scope.item.obj[17000088] = $scope.cc.asalrujukan
               


                dataLoad = dat.data.data
                medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=17000061&objectidakhir=17000066&idemr=17001", true).then(function (datas) {
                    if (datas.data.data.length>0){
                        if ($scope.item.obj[17000093] == undefined) {
                            $scope.item.obj[17000093]=datas.data.data[0].value
                        }
                        if ($scope.item.obj[17000094] == undefined) {
                            $scope.item.obj[17000094]=datas.data.data[1].value
                        }

                    }
                })
                 medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=17000067&objectidakhir=17000072&idemr=17001", true).then(function (datas) {
                    if (datas.data.data.length>0){
                        if ($scope.item.obj[17000095] == undefined) {
                            $scope.item.obj[17000095]=datas.data.data[0].value
                        }
                        if ($scope.item.obj[17000096] == undefined) {
                            $scope.item.obj[17000096]=datas.data.data[1].value
                        }

                    }
                })
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
                            if (dataLoad[i].emrdfk >= 5046 && dataLoad[i].emrdfk <= 5051 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


                        }
                        if (dataLoad[i].type == "radio") {
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
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                    }

                }
            })
            $scope.$watch('item.obj[17000101]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[17000101] == "1" ){
                          $scope.muncul = true
                          
                      }
                      else {
                            $scope.muncul = false
                        }
                       
                    }

                })
            
            function saveStatusCo ()  {
                if ($scope.item.obj[18000275]== undefined) {
                    toastr.error("Status Belum Dipilih!")
                    return;
                }
                medifirstService.post('registrasi/save-status-covid',
                    {
                        noregistrasi:  $scope.cc.noregistrasi,
                        statuscovidfk: $scope.item.obj[18000275].value,
                        statuscovid: $scope.item.obj[18000275].text
                    })
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
                $scope.cc.jenisemr = 'covid'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'PengkajianGawatDarurat' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                  
                     $rootScope.loadRiwayat()
                     var arrStr = {
                         0: e.data.data.noemr
                     }
                     cacheHelper.set('cacheNomorEMR', arrStr);
                     saveStatusCo();
                });
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
                if (nomorEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-pengkajian-igd-covid&id=' + $scope.cc.nocm + '&noregistrasi=' + $scope.cc.noregistrasi + '&emr=' + nomorEMR + '&view=true', function (response) {
                    // do something with response
                });
            }

            //** BATAS */

        }
    ]);
});