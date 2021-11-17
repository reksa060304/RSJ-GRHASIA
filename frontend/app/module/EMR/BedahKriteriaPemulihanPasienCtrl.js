define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BedahKriteriaPemulihanPasienCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210028
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.isCetak = true
            var norecEMR = ''
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
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-awal-perawat-igd&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-diagnosa-jiwa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })

            $scope.listData1 = [

                {
                    "id": 1, "nama": "Aktivitas Motorik",
                    "detail": [
                        { "id": 21020180, "nama": "Gerakan Penuh Tungkal", "descNilai": "1" },
                        { "id": 21020181, "nama": "Tak mampu ekstensi Tungkai", "descNilai": "2" },
                        { "id": 21020182, "nama": "Tak mampu fleksi lutut", "descNilai": "3" },
                        { "id": 21020183, "nama": "Tak mampu fleksi pergelangan kaki", "descNilai": "4" },

                    ]
                },

            ]
            $scope.listData2 = [{
                "id": 1, "nama": " ",
                "detail": [
                    { "id": 21020185, "nama": "Pasien cemas atau agitasi atau keduanya", "descNilai": "1" },
                    { "id": 21020186, "nama": "Pasien Koopera?f, terorientasi dan tenang", "descNilai": "2" },
                    { "id": 21020187, "nama": "Pasien hanya berespon terhadap perintah", "descNilai": "3" },
                    { "id": 21020188, "nama": "Respon penuh terhadap sentuhan glabela ringan", "descNilai": "4" },
                    { "id": 21020189, "nama": "Respon lambat terhadap sentuhan glabela ringan", "descNilai": "5" },
                    { "id": 21020190, "nama": "Tidak ada respon", "descNilai": "6" },
                ]
            }]
            $scope.listData3 = [
                {
                    "id": 1, "nama": "Kesadaran",
                    "detail": [
                        { "id": 21020192, "nama": "Sadar Penuh", "descNilai": "2" },
                        { "id": 21020193, "nama": "Bangun jika dipanggil", "descNilai": "1" },
                        { "id": 21020194, "nama": "Belum respon", "descNilai": "0" },
                    ]
                },
                {
                    "id": 2, "nama": "Respirasi",
                    "detail": [
                        { "id": 21020195, "nama": "Batuk/menangis", "descNilai": "2" },
                        { "id": 21020196, "nama": "Berusaha bernafas", "descNilai": "1" },
                        { "id": 21020197, "nama": "Perlu bantuan bernafas", "descNilai": "0" }
                    ]
                },
                {
                    "id": 3, "nama": "Aktifitas Motorik",
                    "detail": [
                        { "id": 21020198, "nama": "Gerakan beraturan", "descNilai": "2" },
                        { "id": 21020199, "nama": "Gerakan Tanpa tujuan", "descNilai": "1" },
                        { "id": 21020200, "nama": "Tidak bergerak", "descNilai": "0" }
                    ]
                },
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
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }

            var chekedd = false
            $scope.totalSkorAses = 0
            $scope.totalSkorAses2 = 0
            $scope.totalSkor2 = 0

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
            
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if (dataLoad[i].emrdfk == '21020184')
                                $scope.skorNutrisi = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == '21020191')
                                $scope.skorRamsay = parseFloat(dataLoad[i].value)
                            if (dataLoad[i].emrdfk == '21020201')
                                $scope.skorSteward = parseFloat(dataLoad[i].value)

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
                            if (str != undefined) {
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                            }

                        }
                        pegawaiInputDetail = dataLoad[i].pegawaifk
                    }

                }
                //  if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         // toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         // return
                //     }
                // }
            })
          
           
        
            $scope.skorNutrisi = 0
            $scope.getSkorBromage = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[21020184] = $scope.skorNutrisi
            }
            $scope.skorRamsay = 0
            $scope.getSkorRamsay = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorRamsay = $scope.skorRamsay + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorRamsay = $scope.skorRamsay - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[21020191] = $scope.skorRamsay
            }
            $scope.skorSteward = 0
            $scope.getSkorSte = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorSteward = $scope.skorSteward + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorSteward = $scope.skorSteward - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[21020201] = $scope.skorSteward
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
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'bedah'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    afterSave(e)
                });
            }
            function afterSave(e) {
                $scope.cc.norec_emr = e.data.data.noemr
                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Rencana Asuhan Keperawatan Post Operatif ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                // $rootScope.loadHistoryEMRBedah();
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }

        }
    ]);
    initialize.directive('disableContents', function () {
        return {
            compile: function (tElem, tAttrs) {
                var inputs = tElem.find('input');
                var inputsArea = tElem.find('textarea');
                inputs.attr('ng-disabled', tAttrs['disableContents']);
                inputsArea.attr('ng-disabled', tAttrs['disableContents']);
                for (var i = 0; i < inputs.length; i++) {
                }
            }
        }
    });
});