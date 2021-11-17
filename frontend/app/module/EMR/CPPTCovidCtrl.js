define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CPPTCovidCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 17003
            
            var dataLoad = []
            $scope.item.objcbo= []
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
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
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data

            
                for (let i = 0; i < dataLoad.length; i++) {
                    const element = dataLoad[i];
                    if(element.kdprofile ==JSON.parse(localStorage.getItem('profile')).id ){
                        $scope.item.obj[111468]=$scope.cc.tglregistrasi
                        $scope.item.obj[111469]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                        $scope.item.obj[111470]={ value: $scope.cc.objectruanganfk, text: $scope.cc.namaruangan }
                        $scope.item.obj[111471]={ value: $scope.cc.objectkelasfk, text: $scope.cc.namakelas }
                   
                    }
                  
                    // element.nourut = parseInt(element.nourut)
                }
                // dataLoad.sort(function (a, b) {
                //     if (a.nourut < b.nourut) { return -1; }
                //     if (a.nourut > b.nourut) { return 1; }
                //     return 0;
                // })
                // console.log(dataLoad)
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
                            if (dataLoad[i].emrdfk >= 7590 && dataLoad[i].emrdfk <= 7593 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            


                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "datetime2") {
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
                        if (dataLoad[i].type == "checkboxtextarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox2") {
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
                   
                        if (dataLoad[i].type == "combobox3") {
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
                // setTimeout(function(){medifirstService.setDisableAllInputElement()  }, 2000);
            })
            // $scope.$watch('item.obj[17000137]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000137] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000136] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000138] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000140]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000140] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000139] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000141] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000143]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000143] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000142] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000144] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000146]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000146] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000145] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000147] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000149]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000149] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000148] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000150] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000152]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000152] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000151] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000153] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000155]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000155] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000154] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000156] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000158]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000158] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000157] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000159] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000161]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000161] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000160] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000162] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })
            // $scope.$watch('item.obj[17000164]', function(newValue,oldValue){
            //     if(newValue!=oldValue){
            
            //       if($scope.item.obj[17000164] !=null && $scope.item.obj[111587]==undefined){
            //         $scope.item.obj[17000163] =$scope.now
            //           let pegawai = JSON.parse(localStorage.getItem('pegawai'))
            //           $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
            //           $scope.item.obj[17000165] = { value: pegawai.id, text: pegawai.namaLengkap }

            //       }
                  

                   
            //     }
            // })          

           
            

            $scope.Batal =function(){
                $scope.item.obj=[]
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                
                // $scope.item.obj[111351] ={ value:$scope.idpegawai1,text:$scope.namapegawai1}
                // $scope.item.obj[111359] ={ value:$scope.idpegawai2,text:$scope.namapegawai2}
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'covid'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    $rootScope.loadRiwayat()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'CPPTCovid' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    // var arrStr = {
                    //     0: e.data.data.noemr
                    // }
                    // cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});