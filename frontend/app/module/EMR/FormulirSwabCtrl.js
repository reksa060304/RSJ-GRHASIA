define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormulirSwabCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 17008
            $scope.muncul = false
            $scope.gasla = false
            $scope.munculin = false
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            $scope.listYa = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listRS = [
                { name: "Rumah Sakit", id: 1 },
                { name: "Dinas Kesehatan", id: 2 }
            ];
            $scope.listReaktif = [
                { name: "Non Reaktif", id: 1 },
                { name: "Reaktif", id: 2 }
            ];
            $scope.listNegatif= [
                { name: "Negatif", id: 1 },
                { name: "Positif", id: 2 }
            ];
            $scope.listRawat= [
                { name: "Pulang", id: 1 },
                { name: "Dirawat", id: 2 },
                { name: "Meninggal", id: 3 }
            ];
            $scope.listStatusMasuk = [
                {
                    "id": 1, "nama": "Status Masuk",
                    "detail": [
                        
                        { "id": 17000244, "nama": "Kunjungan pertama", "type": "datetime"},
                        { "id": 17000245, "nama": "Rumah Sakit :", "type": "textbox"},
                        { "id": 17000246, "nama": "Kunjungan kedua :", "type": "datetime"},
                        { "id": 17000247, "nama": "Rumah Sakit :", "type": "textbox"},
                        { "id": 17000248, "nama": "Kunjungan ketiga :", "type": "datetime"},
                        { "id": 17000249, "nama": "Rumah Sakit :", "type": "textbox"},
                    ]
                }
            ]
            $scope.listCaraMasuk = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000232, "nama": "Nama", "type": "textbox"},
                        { "id": 17000233, "nama": "No Rekam Medis", "type": "textbox"},
                        { "id": 17000234, "nama": "Tanggal Lahir", "type": "textbox"},
                        { "id": 17000235, "nama": "Usia", "type": "textbox"},
                        { "id": 17000236, "nama": "jenis kelamin", "type": "textbox"},
                        { "id": 17000237, "nama": "NIK", "type": "textbox"},
                        { "id": 17000238, "nama": "Lama Perawatan ", "type": "textbox", "ph":"Hari"},
                        { "id": 17000239, "nama": "Bila wanita, apakah sedang hamil atau pasca melahirkan?", "type": "textbox", "ph":"Ya/Tidak"},
                        { "id": 17000240, "nama": "Alamat", "type": "textbox"},
                        { "id": 17000241, "nama": "No telepon ", "type": "textbox", "ph":"Hari"},
                        { "id": 17000242, "nama": "NIK", "type": "textbox"},
                        { "id": 17000243, "nama": "Nama Kepala Keluarga", "type": "textbox"},
                    ]
                }
            ]
            $scope.listTandaGejala = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000251, "nama": "Panas atau Riwayat Panas > = 38°C ", "type": "radio"},
                        { "id": 17000252, "nama": "Batuk ", "type": "radio"},
                        { "id": 17000253, "nama": "Sakit Tengorokan ", "type": "radio"},
                        { "id": 17000254, "nama": "Sesak Napas", "type": "radio"},
                        { "id": 17000255, "nama": "Pilek  ", "type": "radio"},
                        { "id": 17000256, "nama": "Lesu", "type": "radio"},
                        { "id": 17000257, "nama": "Sakit kepala   ", "type": "radio"},
                        { "id": 17000258, "nama": "Tanda pneumonia ", "type": "radio"},
                        { "id": 17000259, "nama": "Diare   ", "type": "radio"},
                        { "id": 17000260, "nama": "Mual/Muntah", "type": "radio"},
                    ]
                }
            ]
            $scope.listJikaya = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000264, "nama": "lekosit", "type": "textbox","ph" : "/ul"},
                        { "id": 17000265, "nama": "Limposit", "type": "textbox","ph": "%"},
                        { "id": 17000266, "nama": "Trombosit ", "type": "textbox","ph" : "/ul"},
                    ]
                }
            ]
            
            $scope.listSwab = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        
                        { "id": 17000269, "nama": "Swab Ke Berapa", "type": "textbox"},
                        { "id": 17000270, "nama": "Hasil Swab Terakhir", "type": "textbox"},
                        { "id": 17000271, "nama": "Tanggal Swab terakhir", "type": "datetime"},
                    ]
                }
            ]
            $scope.listPengambilan= [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000275, "nama": "Serum / serologis", "type": "radio"},
                        { "id": 17000276, "nama": "Tanggal diambil ", "type": "datetime"},
                        { "id": 17000277, "nama": "Usap nasofaring  ", "type": "radio"},
                        { "id": 17000278, "nama": "Tanggal diambil", "type": "datetime"},
                        { "id": 17000279, "nama": "Usap orofaring ", "type": "radio"},
                        { "id": 17000280, "nama": "Tanggal diambil", "type": "datetime"},
                        { "id": 17000281, "nama": "Sputum", "type": "radio"},
                        { "id": 17000282, "nama": "Tanggal diambil", "type": "datetime"},
                        { "id": 17000283, "nama": "Lainnya (sebutkan)", "type": "radio"},
                        { "id": 17000284, "nama": "Tanggal diambil", "type": "datetime"},
                    ]
                }
            ]
            $scope.listPenyakitKomor = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 17000304, "nama": "Penyakit kardiovaskular / Hypertensi  ", "type": "radio"},
                        { "id": 17000305, "nama": "Diabetes Mellitus ", "type": "radio"},
                        { "id": 17000306, "nama": "Liver", "type": "radio"},
                        { "id": 17000307, "nama": "Kronik Neurologi atau Neuromuskular", "type": "radio"},
                        { "id": 17000308, "nama": "Immunodefisiensi / HIV ", "type": "radio"},
                        { "id": 17000309, "nama": "Penyakit Paru Kronik", "type": "radio"},
                        { "id": 17000310, "nama": "Penyakit Ginjal ", "type": "radio"},
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
             
               $scope.item.obj[17000232]=$scope.cc.namapasien
               $scope.item.obj[17000233]=$scope.cc.nocm
               $scope.item.obj[17000240]=$scope.cc.alamatlengkap
               $scope.item.obj[17000234]=$scope.cc.tgllahir
               $scope.item.obj[17000237]=$scope.cc.noidentitas
               $scope.item.obj[17000241]=$scope.cc.nohp
               $scope.item.obj[17000235]=$scope.cc.umur
               $scope.item.obj[17000236]=$scope.cc.jeniskelamin
               
               
               


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
            $scope.$watch('item.obj[17000263]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[17000263] == "1" ){
                          $scope.muncul = true
                          
                      }
                      else {
                            $scope.muncul = false
                        }
                       
                    }

                })
            $scope.$watch('item.obj[17000285]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[17000285] == "1" ){
                          $scope.gasla = true
                          
                      }
                      else {
                            $scope.gasla = false
                        }
                       
                    }

                })
            $scope.$watch('item.obj[17000290]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[17000290] == "1" ){
                          $scope.munculin = true
                          
                      }
                      else {
                            $scope.munculin = false
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
                    'FormulirSwab' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                  
                     $rootScope.loadRiwayat()
                     var arrStr = {
                         0: e.data.data.noemr
                     }
                     cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});