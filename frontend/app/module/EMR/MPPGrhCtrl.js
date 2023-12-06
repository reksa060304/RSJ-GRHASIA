define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MPPGrhCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000923
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

               
                $scope.item.obj[3004451]=$scope.cc.namapasien
                $scope.item.obj[3004452]=$scope.cc.nocm
                $scope.item.obj[3004453]=moment($scope.cc.tglLahir).format('DD-MMMM-YYYY ');
                $scope.item.obj[3004454]=$scope.cc.umur
                $scope.item.obj[3004355]=$scope.cc.jeniskelamin
                $scope.item.obj[3004456]=$scope.cc.alamat
                $scope.item.obj[3020301]=$scope.cc.namaruangan
            


                $scope.item.obj[101008]=$scope.now
                $scope.item.obj[101011]=$scope.now
                $scope.item.obj[101012] = { value:peagawaiLogin.id,text:peagawaiLogin.namaLengkap}
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
            $scope.$watch('item.obj[3004009]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if(parseInt($scope.item.obj[3004009]) >= 70 && parseInt($scope.item.obj[3004009]) <= 79){
                          $scope.item.obj[3004010] ='Rendah atau Keterbelakangan mental'
                      }
                      else if(parseInt($scope.item.obj[3004009]) >= 80 && parseInt($scope.item.obj[3004009]) <= 90){
                          $scope.item.obj[3004010] ='Dibawah rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[3004009]) >= 91 && parseInt($scope.item.obj[3004009]) <= 110){
                          $scope.item.obj[3004010] ='Rata-rata' 
                      }
                      else  if(parseInt($scope.item.obj[3004009]) >= 111 && parseInt($scope.item.obj[3004009]) <= 120){
                          $scope.item.obj[3004010] ='Diatas rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[3004009]) >= 121 && parseInt($scope.item.obj[3004009]) <= 130){
                          $scope.item.obj[3004010] ='Superior' 
                      }
                      else if(parseInt($scope.item.obj[3004009]) >130){
                          $scope.item.obj[3004010] ='Sangat superior' 
                      }else $scope.item.obj[3004010] =''
                       
                    }
                })
                $scope.$watch('item.obj[101004]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if(parseInt($scope.item.obj[101004]) >= 130 && parseInt($scope.item.obj[101004]) <= 140){
                          $scope.item.obj[101005] ='Sangat Cerdas'
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 120 && parseInt($scope.item.obj[101004]) <= 129){
                          $scope.item.obj[101005] ='Cerdas' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 110 && parseInt($scope.item.obj[101004]) <= 119){
                          $scope.item.obj[101005] ='Diatas rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 89 && parseInt($scope.item.obj[101004]) <= 109){
                          $scope.item.obj[101005] ='Rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 79 && parseInt($scope.item.obj[101004]) <= 88){
                          $scope.item.obj[101005] ='Dibawah rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 70 && parseInt($scope.item.obj[101004]) <= 78){
                          $scope.item.obj[101005] ='borderline' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 53 && parseInt($scope.item.obj[101004]) <= 69){
                          $scope.item.obj[101005] ='Mental Retardasi Ringan' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 36 && parseInt($scope.item.obj[101004]) <= 52){
                          $scope.item.obj[101005] ='MR Sedang ' 
                      }
                      else if(parseInt($scope.item.obj[101004]) >= 20 && parseInt($scope.item.obj[101004]) <= 35){
                          $scope.item.obj[101005] ='MR Berat' 
                      }
                      else if(parseInt($scope.item.obj[101004]) <19){
                          $scope.item.obj[101005] ='MR sangat berat' 
                      }else
                      $scope.item.obj[101005] =''
                       
                    }
                })
                $scope.$watch('item.obj[101006]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if(parseInt($scope.item.obj[101006]) >= 130 && parseInt($scope.item.obj[101006]) <= 140){
                          $scope.item.obj[101007] ='Sangat Cerdas'
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 120 && parseInt($scope.item.obj[101006]) <= 129){
                          $scope.item.obj[101007] ='Cerdas' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 110 && parseInt($scope.item.obj[101006]) <= 119){
                          $scope.item.obj[101007] ='Diatas rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 89 && parseInt($scope.item.obj[101006]) <= 109){
                          $scope.item.obj[101007] ='Rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 79 && parseInt($scope.item.obj[101006]) <= 88){
                          $scope.item.obj[101007] ='Dibawah rata-rata' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 70 && parseInt($scope.item.obj[101006]) <= 78){
                          $scope.item.obj[101007] ='borderline' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 53 && parseInt($scope.item.obj[101006]) <= 69){
                          $scope.item.obj[101007] ='Mental Retardasi Ringan' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 36 && parseInt($scope.item.obj[101006]) <= 52){
                          $scope.item.obj[101007] ='MR Sedang ' 
                      }
                      else if(parseInt($scope.item.obj[101006]) >= 20 && parseInt($scope.item.obj[101006]) <= 35){
                          $scope.item.obj[101007] ='MR Berat' 
                      }
                      else if(parseInt($scope.item.obj[101006]) <19){
                          $scope.item.obj[101007] ='MR sangat berat' 
                      }else
                      $scope.item.obj[101007] =''
                       
                    }
                })
            $scope.$watch('item.obj[14499]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >=7 && nilai <=11 ) {
                    $scope.item.obj[14500] = true
                    $scope.item.obj[14501] = false
                   
                }
                if (nilai >= 12) {
                    $scope.item.obj[14500] = false
                    $scope.item.obj[14501] = true
                 
                }
                
            })
                
            $scope.listA = [{
                "id": 1,
                "nama": " 1. Risiko tinggi : ",
                "detail": [
                    {
                        "id": 3020307,
                        "nama": "Kematian ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020308,
                        "nama": "Bunuh diri ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020309,
                        "nama": "Readmisi ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020310,
                        "nama": "Lari ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020311,
                        "nama": "Kekerasan seksual ",
                        "type": "checkbox4"
                    }
                ]
            },
            {
                "id": 2,
                "nama": " 2. Risiko masalah pembiayaan :",
                "detail": [
                    {
                        "id": 3020313,
                        "nama": "Tanpa jaminan ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020314,
                        "nama": "Pembayaran belum jelas ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020315,
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
                        "id": 3020317,
                        "nama": "Multidiagnosis ",
                        "type": "checkbox4"
                    },
                    {
                        "id": 3020318,
                        "nama": "Multiprovider (pasien dengan > 3 DPJP)",
                        "type": "checkbox6"
                    },
                  
                ]
            },
            {
                "id": 4,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020319,
                        "nama": " 4. Risiko LOS (Length Of Stay) panjang / LOS > 28 hari",
                        "type": "checkbox123"
                    },
                    
                ]
            },
            {
                "id": 5,
                "nama": " 5. Risiko masalah psikososial : ",
                "detail": [{
                    "id": 3020321,
                    "nama": "Tanpa identitas",
                    "type": "checkbox6"
                },
                {
                    "id": 3020322,
                    "nama": "Kurang support keluarga",
                    "type": "checkbox6"
                }, 
                {
                    "id": 3020323,
                    "nama": "Pasung",
                    "type": "checkbox6"
                }, 
                {
                    "id": 3020324,
                    "nama": "Riwayat dan potensi penelantaran",
                    "type": "checkbox6"
                },                    
                {
                    "id": 3020325,
                    "nama": "Riwayat dropping",
                    "type": "checkbox6"
                },
                
            ]
            },
            {
                "id": 6,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020326,
                        "nama": "  6. Risiko komplain",
                        "type": "checkbox6"
                    },
                    
                ]
            },
            {
                "id": 7,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020327,
                        "nama": "  7. Berpotensi kasus hukum",
                        "type": "checkbox6"
                    },
                    
                ]
            },
            {
                "id": 8,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020328,
                        "nama": " 8. Pasien dirawat di Ruang Intensif > 5 hari",
                        "type": "checkbox6"
                    },
                    
                ]
            },
            {
                "id": 9,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020329,
                        "nama": " 9. Status fungsional rendah, kebutuhan bantuan ADL (Activity Daily Living) yang tinggi",
                        "type": "checkbox123"
                    },
                    
                ]
            },
            {
                "id": 10,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020330,
                        "nama": " 10. Kasus dengan penyakit kronis, katastropik, terminal",
                        "type": "checkbox123"
                    },
                    
                ]
            },
            {
                "id": 11,
                "nama": " ",
                "detail": [
                    {
                        "id": 3020331,
                        "nama": " ",
                        "type": "checkbox6"
                    },
                    {
                        "id": 3020332,
                        "nama": " ",
                        "type": "textbox12"
                    },
                    
                ]
            },
        ]
        $scope.listB = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020335,
                    "nama": "B. Asesmen :",
                    "type": "textarea"
                }
            ]
        }
    ]
        $scope.listC = [{
            "id": 1,
            "nama": "",
            "detail": [
                {
                    "id": 3020339,
                    "nama": "Asuhan pelayanan yang tidak sesuai kebutuhan ",
                    "type": "checkbox12"
                },
                {
                    "id": 3020340,
                    "nama": "Over/under utilisasi pelayanan sesuai standar yang digunakan",
                    "type": "checkbox12"
                },
                {
                    "id": 3020341,
                    "nama": "Ketidak patuhan pasien ",
                    "type": "checkbox12"
                },
                {
                    "id": 3020342,
                    "nama": "Kurang pengetahuan keluarga terhadap penyakit",
                    "type": "checkbox12"
                },
                {
                    "id": 3020343,
                    "nama": "Kurang dukungan keluarga ",
                    "type": "checkbox12"
                },
                {
                    "id": 3020344,
                    "nama": "Penurunan determinasi pasien (tingkat keparahan/komplikasi meningkat) sehubungan penyakit yang diderita",
                    "type": "checkbox12"
                },
                {
                    "id": 3020345,
                    "nama": "Kendala keuangan",
                    "type": "checkbox12"
                },
                {
                    "id": 3020346,
                    "nama": "Masalah rujukan yang tertunda",
                    "type": "checkbox12"
                },
                {
                    "id": 3020347,
                    "nama": "Masalah pemulangan pasien yang tertunda",
                    "type": "checkbox12"
                },
                {
                    "id": 3020348,
                    "nama": "Masalah ketergantungan ADL (Activity Daily Living)",
                    "type": "checkbox12"
                },
                {
                    "id": 3020349,
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
                    "id": 3020350,
                    "nama": " ",
                    "type": "checkbox6"
                },
                {
                    "id": 3020351,
                    "nama": " ",
                    "type": "textbox12"
                },
                
            ]
        },
    ]
        $scope.listD = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020354,
                    "nama": "D. Identifikasi Harapan / Sasaran Pasien ",
                    "type": "textarea"
                }
            ]

        }
    ]
    $scope.listE = [{
        "id": 1,
        "nama": "",
        "detail": [
            {
                "id": 3020356,
                "nama": "Pahami dan pastikan diagnosis, prognosis, kebutuhan asuhan dan sasaran hasil asuhan",
                "type": "checkbox12"
            },
            {
                "id": 3020357,
                "nama": "Rencanakan pemberian informasi pada pasien/keluarga dalam mengambil keputusan",
                "type": "checkbox12"
            },
            {
                "id": 3020358,
                "nama": "Beri asuhan sesuai kebutuhan pasien/keluarga sesuai peraturan yang berlaku ",
                "type": "checkbox12"
            },
            {
                "id": 3020359,
                "nama": "Dorong partisipasi pasien/keluarga dalam asuhan",
                "type": "checkbox12"
            },
            {
                "id": 3020360,
                "nama": "Fasilitasi untuk mengatasi masalah dan konflik ",
                "type": "checkbox12"
            },
            {
                "id": 3020361,
                "nama": "Berikan informasi tentang biaya pelayanan/koordinasi dengan penjamin/penanggung-jawab tentang pembayaran",
                "type": "checkbox12"
            },
            {
                "id": 3020362,
                "nama": "Monitor pembiayaan dan penjaminan pasien",
                "type": "checkbox12"
            },
            {
                "id": 3020363,
                "nama": "Bantu pasien untuk mendapatkan pelayanan kesehatan di tempat lain",
                "type": "checkbox12"
            },
            {
                "id": 3020364,
                "nama": "",
                "type": "checkbox12"
            },
            {
                "id": 3020365,
                "nama": "",
                "type": "textbox12"
            }
        ]
    }
]
        $scope.listPelaksana = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020368,
                    "nama": "Pelaksanaan Perencanaan :",
                    "type": "textarea"
                }
            ]
        }
        ]
        $scope.listMonitoring = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020371,
                    "nama": "Monitoring :",
                    "type": "textarea"
                }
            ]
        }
        ]
        $scope.listIdentifikasi = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020374,
                    "nama": "Identifikasi Masalah - Risiko - Kesempatan :",
                    "type": "textarea"
                }
            ]
        }
        ]
        $scope.listFasilitasi = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020377,
                    "nama": "Fasilitasi, Koordinasi, Komunikasi :",
                    "type": "textarea"
                }
            ]
        }
        ]
        $scope.listKolaborasi = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020380,
                    "nama": "Kolaborasi :",
                    "type": "textarea"
                }
            ]
        }
        ]
        $scope.listAdvokasi = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020383,
                    "nama": "Advokasi :",
                    "type": "textarea"
                }
            ]
        }
        ]
       
        $scope.listHasil = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020386,
                    "nama": "Hasil Pelayanan : ",
                    "type": "textarea"
                }
            ]
        }
        ]
    
        $scope.listTerminasi = [{
            "id": 1,
            "nama": "  ",
            "detail": [
                {
                    "id": 3020389,
                    "nama": "Terminasi MPP :",
                    "type": "textarea"
                }
            ]
        }
        ]
    
            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[14464] = true
                    $scope.item.obj[14465] = false
                    $scope.item.obj[14466] = false
                    $scope.item.obj[14467] = false
                    $scope.item.obj[14468] = false
                    $scope.item.obj[14469] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[14464] = false
                    $scope.item.obj[14465] = true
                    $scope.item.obj[14466] = false
                    $scope.item.obj[14467] = false
                    $scope.item.obj[14468] = false
                    $scope.item.obj[14469] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[14464] = false
                    $scope.item.obj[14465] = false
                    $scope.item.obj[14466] = true
                    $scope.item.obj[14467] = false
                    $scope.item.obj[14468] = false
                    $scope.item.obj[14469] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[14464] = false
                    $scope.item.obj[14465] = false
                    $scope.item.obj[14466] = false
                    $scope.item.obj[14467] = true
                    $scope.item.obj[14468] = false
                    $scope.item.obj[14469] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[14464] = false
                    $scope.item.obj[14465] = false
                    $scope.item.obj[14466] = false
                    $scope.item.obj[14467] = false
                    $scope.item.obj[14468] = true
                    $scope.item.obj[14469] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[14464] = false
                    $scope.item.obj[14465] = false
                    $scope.item.obj[14466] = false
                    $scope.item.obj[14467] = false
                    $scope.item.obj[14468] = false
                    $scope.item.obj[14469] = true
                }

            }
            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }
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
                $scope.item.obj[14499] = $scope.totalSkor4
            }
                // setSkorAkhir($scope.item.obj[3152])
            $scope.totalSkorAses = 0
            $scope.getSkorAsesmen = function (stat, skor) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
                            break
                        } else {
                            $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[5194] = $scope.totalSkorAses
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
                $scope.item.obj[5084] = $scope.totalSkor + $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.skorGizi = 0
            $scope.getSkorGizi= function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorGizi = $scope.skorGizi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorGizi = $scope.skorGizi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[14432] = $scope.skorGizi
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
            $scope.$watch('item.obj[14432]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai < 4 ) {
                    $scope.item.obj[14433] = true
                    $scope.item.obj[14434] = false
                   
                }
                if (nilai >= 4) {
                    $scope.item.obj[14433] = false
                    $scope.item.obj[14434] = true
                 
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
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                console.log(jsonSave);
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                   'MPPGrhCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
               console.log(cacheNomorEMR[0]);
               // return
               if (cacheNomorEMR[0] == '-') {
                   return
               }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-generalconsent?noemr=' + cacheNomorEMR[0] + '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }

        }
    ]);
});