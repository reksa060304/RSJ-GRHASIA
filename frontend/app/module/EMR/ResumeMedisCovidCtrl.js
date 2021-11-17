define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ResumeMedisCovidCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 17007
            $scope.muncul = false
            $scope.isCetak = true;
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
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
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000313, "nama": "Keluhan Utama", "type": "textarea"},
                        { "id": 17000314, "nama": "Riwayat Penyakit", "type": "textarea"},
                        { "id": 17000315, "nama": "Alergi Obat", "type": "textarea"},
                    ]
                }
            ]
            $scope.listCaraMasuk = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000316,"id2" : 17000317,  "nama": "Diagnosa Masuk", "type": "textbox","phd": "ICD10"},
                    ]
                },
                {
                    "id": 1, "nama": "Diagnosa Keluar",
                    "detail": [
                        
                        { "id": 17000318,"id2" : 17000319,  "nama": "1. ", "type": "textbox","phd": "ICD10"},
                        { "id": 17000320,"id2" : 17000321,  "nama": "2. ", "type": "textbox","phd": "ICD10"},
                    ]
                }
            ]
            $scope.listCaraMasuk2 = [
                {
                    "id": 1, "nama": "Tindakan Medis",
                    "detail": [
                        
                        { "id": 17000322,"id2" : 17000323,  "nama": "1. Diagnosa Utama", "type": "textbox","phd": "ICD 9 CM"},
                        { "id": 17000324,"id2" : 17000325,  "nama": "2. Diagnosa Sekunder", "type": "textbox","phd": "ICD 9 CM"},
                    ]
                }
            ]
            $scope.listRiwayatKes = [
                {
                    "id": 1, "nama": "Pemeriksaan Penunjang (Laboratorium, Radiologi, Dan Lain-Lain)",
                    "detail": [
                        { "id": 17000329, "nama": "1.", "type": "textarea"},
                        { "id": 17000330, "nama": "2.", "type": "textarea"},
                        { "id": 17000331, "nama": "3.", "type": "textarea"},
                    ]
                }
            ]
            $scope.listTandaVital = [
                {
                    "id": 1, "nama": "Kondisi Pulang/Rujuk",
                    "detail": [
                        { "id": 17000332, "nama": "Keadaan Umum :", "type": "textarea", "satuan" : "mmHg"},
                        { "id": 17000333, "nama": "Kesadaran", "type": "textarea", "satuan" : "mmHg"},
                    ]
                },
                {
                    "id": 1, "nama": "Tanda Vital",
                    "detail": [
                        
                        { "id": 17000334, "nama": "TD", "type": "textbox", "satuan" : "mmHg"},
                        { "id": 17000335, "nama": "Nadi", "type": "textbox", "satuan" : "x/mnt"},
                        { "id": 17000336, "nama": "Suhu", "type": "textbox", "satuan" : "C"},
                        { "id": 17000337, "nama": "RR", "type": "textbox", "satuan" : "x/mnt"},
                    ]
                }
            ]
            $scope.listDataPsiSO = [
                {
                    "id": 1, "nama": "Sosiologi",
                    "detail": [
                        
                        { "id": 17000338, "nama": "Pulang Atas Persetujuan Dokter", "type": "checkbox"},
                        { "id": 17000339, "nama": "Atas Permintaan Pasien", "type": "checkbox"},
                        { "id": 17000340, "nama": "Dirujuk Ke", "type": "checkbox"},
                        { "id": 17000341, "nama": "", "type": "textbox"},
                        { "id": 17000342, "nama": "Meninggal, pada", "type": "checkbox"},
                        { "id": 17000343, "nama": "", "type": "datetime"},
                        { "id": 17000344, "nama": "Lain-lain", "type": "checkbox"},
                        { "id": 17000345, "nama": "", "type": "textbox"},
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
                // $scope.item.obj[17000097]=$scope.cc.namapasien
                // $scope.item.obj[17000098] = $scope.cc.peker
                // $scope.item.obj[17000099] = $scope.cc.nohp
                // $scope.item.obj[17000100] = $scope.cc.alamatlengkap
               


                dataLoad = dat.data.data
                medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=17000103&objectidakhir=17000103&idemr=17002", true).then(function (datas) {
                    if (datas.data.data.length>0){
                        if ($scope.item.obj[17000313] == undefined) {
                            $scope.item.obj[17000313]=datas.data.data[0].value
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
                    'Resume Medis' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                  
                     $rootScope.loadRiwayat()
                     var arrStr = {
                         0: e.data.data.noemr
                     }
                     cacheHelper.set('cacheNomorEMR', arrStr);
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