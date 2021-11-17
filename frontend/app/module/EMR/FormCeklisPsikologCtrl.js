define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('FormCeklisPsikologCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.muncul = false
            $scope.muncul2 = false
            $scope.muncul3 = false
            $scope.muncul4 = false
            $scope.muncul5 = false
            $scope.muncul6 = false
            $scope.muncul7 = false
            $scope.cc.emrfk = 18004
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            $scope.listYa = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.ListPsi = [
                { name: "1", id: 1 },
                { name: "2", id: 2 },
                { name: "3", id: 3 },
                { name: "4", id: 4 },
                { name: "5", id: 5 },
                { name: "6", id: 6 },
                { name: "7", id: 7 },
                { name: "8", id: 8 },
                { name: "9", id: 9 },
                { name: "10", id: 10 }
            ];
            $scope.listAbdomen = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 18000081, "nama": "Inspeksi", "type": "textbox"},
                        { "id": 18000082, "nama": "Palpasi ", "type": "textbox"},
                        { "id": 18000083, "nama": "Perkusi", "type": "textbox"},
                        { "id": 18000084, "nama": "Auskultasi", "type": "textbox"},
                        
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
                $scope.cc.statuscovidfk = chacePeriode [28]

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
                $scope.item.obj[18000119] = 2;
                $scope.item.obj[18000120] = 2;
                $scope.item.obj[18000121] = 2;
                $scope.item.obj[18000122] = 2;
                $scope.item.obj[18000123] = 2;
                $scope.item.obj[18000124] = 2;
                $scope.item.obj[18000125] = 2;
                $scope.item.obj[18000126] = 2;
                // $scope.item.obj[18000059] = 1
                // $scope.item.obj[18000060] = 1
                // $scope.item.obj[18000061] = 1
                // $scope.item.obj[18000062] = 1
                // var covids = [2 , 3, 4 ,5 , 13]
                // if ( $scope.cc.statuscovidfk == 6) {
                //     $scope.item.obj[18000094] = 2
                // }else if ( covids.includes($scope.cc.statuscovidfk ) ) {
                //     $scope.item.obj[18000094] = 1
                // }
               


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

                      
            $scope.$watch('item.obj[18000112]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000112] >= 6 ){
                          $scope.muncul = true
                          
                      }
                      else {
                            $scope.muncul = false
                        }
                       
                    }

                })
            $scope.$watch('item.obj[18000113]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000113] >= 6 ){
                          $scope.muncul2 = true
                          
                      }
                      else {
                            $scope.muncul2 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000114]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000114] >= 6 ){
                          $scope.muncul3 = true
                          
                      }
                      else {
                            $scope.muncul3 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000115]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000115] >= 6 ){
                          $scope.muncul4 = true
                          
                      }
                      else {
                            $scope.muncul4 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000116]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000116] >= 6 ){
                          $scope.muncul5 = true
                          
                      }
                      else {
                            $scope.muncul5 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000117]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000117] >= 6 ){
                          $scope.muncul6 = true
                          
                      }
                      else {
                            $scope.muncul6 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000118]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000118] >= 6 ){
                          $scope.muncul7 = true
                          
                      }
                      else {
                            $scope.muncul7 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000119]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000119] == 1 ){
                          $scope.muncul8 = true
                          
                      }
                      else {
                            $scope.muncul8 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000120]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000120] == 1 ){
                          $scope.muncul9 = true
                          
                      }
                      else {
                            $scope.muncul9 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000121]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000121] == 1 ){
                          $scope.muncul10 = true
                          
                      }
                      else {
                            $scope.muncul10 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000122]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000122] == 1 ){
                          $scope.muncul11 = true
                          
                      }
                      else {
                            $scope.muncul11 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000123]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000123] == 1 ){
                          $scope.muncul12 = true
                          
                      }
                      else {
                            $scope.muncul12 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000124]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000124] == 1 ){
                          $scope.muncul13 = true
                          
                      }
                      else {
                            $scope.muncul13 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000125]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000125] == 1 ){
                          $scope.muncul14 = true
                          
                      }
                      else {
                            $scope.muncul14 = false
                        }
                       
                    }

                })
                $scope.$watch('item.obj[18000126]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[18000126] == 1 ){
                          $scope.muncul15 = true
                          
                      }
                      else {
                            $scope.muncul15 = false
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
                    'Formulir Psikolog' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                      $scope.cc.norec_emr = e.data.data.noemr
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