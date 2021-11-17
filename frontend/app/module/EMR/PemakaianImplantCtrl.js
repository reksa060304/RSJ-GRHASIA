define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PemakaianImplantCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            $scope.item.objImg =[]
            var img = "../app/images/svg/no-image.svg"
          
            $scope.item.objImg[21007773] = img 
            $scope.item.objImg[21007774] = img
            $scope.item.objImg[21007775] = img
            $scope.item.objImg[21007776] = img
            $scope.item.objImg[21007777] = img
            $scope.item.objImg[21007778] = img
            $scope.item.objImg[21007779] = img
            $scope.item.objImg[21007780] = img
            $scope.item.objImg[21007781] = img
            $scope.item.objImg[21007782] = img
            var nomorEMR = '-'
            var emrfk_ =210054
            $scope.cc.emrfk = emrfk_
            var dataLoad = []
             $scope.isCetak = true
            var norecEMR = ''
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
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
             $scope.listDaily = [
                {
                    "id": 1, "nama": "Alergi",
                    "detail": [
                        { "id": 21023118, "nama": "Tidak Ada", "type": "checkbox" },
                        { "id": 21023119, "nama": "Ada, yaitu : ", "type": "checkbox" },
                        { "id": 21023120, "nama": "", "type": "textbox" },
                    ]
                },
                
            ]
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
             })
            medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function (data) {
                $scope.listDokter = data

             })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
            
             })
  
           medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            
             })  
            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
            });
            
    

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
                          

                        }

                    }

                }
            })
            medifirstService.get("emr/get-emr-transaksi-detail-img?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                // $scope.item.objImg =[]
                var dataImg = dat.data.data
                for (var i = 0; i <= dataImg.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataImg[i].emrfk) {
                        $scope.item.objImg[dataImg[i].emrdfk] = dataImg[i].image
                      }

                }
            })
        
               
            $scope.onSelect1 = function (e) {
                var idImg ='preview1'
                var id= 21007773
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect2 = function (e) {
                var idImg ='preview2'
                var id= 21007774
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            $scope.onSelect3 = function (e) {
                var idImg ='preview3'
                var id= 21007775
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            $scope.onSelect4 = function (e) {
                var idImg ='preview4'
                var id= 21007776
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            $scope.onSelect5 = function (e) {
                var idImg ='preview5'
                var id= 21007777
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect6 = function (e) {
                var idImg ='preview6'
                var id= 21007778
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect7 = function (e) {
                var idImg ='preview7'
                var id= 21007779
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect8 = function (e) {
                var idImg ='preview8'
                var id= 21007780
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect9 = function (e) {
                var idImg ='preview9'
                var id= 21007781
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
             $scope.onSelect10 = function (e) {
                var idImg ='preview10'
                var id= 21007782
                $("#"+idImg).empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                           $scope.item.objImg[id] = readerEvt.target.result;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#"+idImg));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }



            $scope.Batal =function(){
                $scope.item.obj=[]
                $scope.item.objImg=[]
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
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                var arrobjImg = Object.keys($scope.item.objImg)
                var arrSaveImg = []
                for (var i = arrobjImg.length - 1; i >= 0; i--) {
                    arrSaveImg.push({ id: arrobjImg[i], values: $scope.item.objImg[parseInt(arrobjImg[i])] })
                }
                $scope.cc.jenisemr = 'bedah'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave,
                    dataimg: arrSaveImg
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                   
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'Pemakaian Implant ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    $scope.cc.norec_emr = e.data.data.noemr
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                //    $rootScope.loadHistoryEMRBedah();
                });
            }

        }
    ]);
});