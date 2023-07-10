define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RekonsiliasiObatCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            $scope.item = {}
            $scope.itemd = {}
            var nomorEMR = '-'
            var peagawaiLogin = medifirstService.getPegawaiLogin()
            $scope.cc.emrfk = 666
            var dataLoad = []
            var dataAlergi = []
            var dataPO = []
            var dataRO = []
            $scope.isCetakV = true
            var norecEMR = ''
            loadCombo()
            function loadCombo(){
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-resep-emr", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listProdukOrder = dat.data.produkorder;
                });
                medifirstService.get('rawatjalan/get-data-combo-operator').then(function(data){
                    $scope.listRuangan = data.data.ruanganall;

                })
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
                $scope.cc.dokterdpjp = chacePeriode[16];

                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false
            medifirstService.get("farmasi/get-alergi?nocm=" + $scope.header.nocm, true).then(function (dat) {
                $scope.itemd.reaksialergi = dat.data[0].data[0].alergi
            })
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[100500] = moment($scope.header.tglregistrasi).format('YYYY-MM-DD HH:mm')
                // $scope.itemd.tanggalmulai = moment($scope.now).format('YYYY-MM-DD')
                // $scope.itemd.tanggalstop = moment($scope.now).format('YYYY-MM-DD')
                // 
                $scope.item.obj[100508] = $scope.cc.dokterdpjp
                medifirstService.get('emr/get-rekonsiliasi-obat?noemr=' + nomorEMR + "&noregistrasi="+$scope.cc.noregistrasi).then(function (data) {
                    dataAlergi = data.data.reaksialergi
                    for (let i = 0; i < dataAlergi.length; i++) {
                        dataAlergi[i].nomorAlergi = i+1
                    }
                    $scope.dataSourceAlergiGrid = new kendo.data.DataSource({
                        data: dataAlergi,
                    });
                    dataPO = data.data.penggunaanobat
                    for (let i = 0; i < dataPO.length; i++) {
                        dataPO[i].nomorPO = i + 1
                        if(dataPO[i].isresep == true){
                            dataPO[i].resep = "✓"
                            dataPO[i].tanpa = ""
                        }
                        if (dataPO[i].isresep == null) {
                            dataPO[i].resep = ""
                            dataPO[i].tanpa = "✓"
                        }
                    }
                    $scope.dataSourcePOGrid = new kendo.data.DataSource({
                        data: dataPO,
                    });

                    dataRO = data.data.rekonsiliasiobat
                    for (let i = 0; i < dataRO.length; i++) {
                        dataRO[i].nomorro = i + 1
                        if (dataRO[i].islanjutaturansama == true) {
                            dataRO[i].islanjutaturansama = "✓"
                        }
                        if (dataRO[i].isstop == true) {
                            dataRO[i].isstop = "✓"
                        }
                    }
                    $scope.dataSourceROGrid = new kendo.data.DataSource({
                        data: dataRO,
                    });
                })

                // $scope.item.obj[300469] = $scope.cc.namapasien
                // $scope.item.obj[3004701] = $scope.cc.nocm
                // $scope.item.obj[3004453] = moment($scope.cc.tglLahir).format('DD-MMMM-YYYY ');
                // $scope.item.obj[3004700] = $scope.cc.umur
                // $scope.item.obj[3004702] = $scope.cc.jeniskelamin
                // $scope.item.obj[3004703] = $scope.cc.alamat



                // $scope.item.obj[101008] = $scope.now
                // $scope.item.obj[101011] = $scope.now
                // $scope.item.obj[101012] = {
                //     value: peagawaiLogin.id,
                //     text: peagawaiLogin.namaLengkap
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
                            if (dataLoad[i].emrdfk >= 14464 && dataLoad[i].emrdfk <= 14469 && chekedd) {
                                $scope.getSkalaNyeri(1, {
                                    descNilai: dataLoad[i].reportdisplay
                                })
                            }
                            if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                                var datass = {
                                    id: dataLoad[i].emrdfk,
                                    descNilai: dataLoad[i].reportdisplay
                                }
                                $scope.getSkor2(datass)
                            }
                            if (dataLoad[i].emrdfk >= 14424 && dataLoad[i].emrdfk <= 14431 && dataLoad[i].reportdisplay != null) {
                                var datass = {
                                    id: dataLoad[i].emrdfk,
                                    descNilai: dataLoad[i].reportdisplay
                                }
                                $scope.getSkorGizi(datass)
                            }


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
                            $scope.item.obj[dataLoad[i].emrdfk] = {
                                value: res[0],
                                text: res[1]
                            }

                        }
                    }

                }
            })
            $scope.$watch('item.obj[3004009]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[3004009]) >= 70 && parseInt($scope.item.obj[3004009]) <= 79) {
                        $scope.item.obj[3004010] = 'Rendah atau Keterbelakangan mental'
                    } else if (parseInt($scope.item.obj[3004009]) >= 80 && parseInt($scope.item.obj[3004009]) <= 90) {
                        $scope.item.obj[3004010] = 'Dibawah rata-rata'
                    } else if (parseInt($scope.item.obj[3004009]) >= 91 && parseInt($scope.item.obj[3004009]) <= 110) {
                        $scope.item.obj[3004010] = 'Rata-rata'
                    } else if (parseInt($scope.item.obj[3004009]) >= 111 && parseInt($scope.item.obj[3004009]) <= 120) {
                        $scope.item.obj[3004010] = 'Diatas rata-rata'
                    } else if (parseInt($scope.item.obj[3004009]) >= 121 && parseInt($scope.item.obj[3004009]) <= 130) {
                        $scope.item.obj[3004010] = 'Superior'
                    } else if (parseInt($scope.item.obj[3004009]) > 130) {
                        $scope.item.obj[3004010] = 'Sangat superior'
                    } else $scope.item.obj[3004010] = ''

                }
            })
            $scope.$watch('item.obj[101004]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[101004]) >= 130 && parseInt($scope.item.obj[101004]) <= 140) {
                        $scope.item.obj[101005] = 'Sangat Cerdas'
                    } else if (parseInt($scope.item.obj[101004]) >= 120 && parseInt($scope.item.obj[101004]) <= 129) {
                        $scope.item.obj[101005] = 'Cerdas'
                    } else if (parseInt($scope.item.obj[101004]) >= 110 && parseInt($scope.item.obj[101004]) <= 119) {
                        $scope.item.obj[101005] = 'Diatas rata-rata'
                    } else if (parseInt($scope.item.obj[101004]) >= 89 && parseInt($scope.item.obj[101004]) <= 109) {
                        $scope.item.obj[101005] = 'Rata-rata'
                    } else if (parseInt($scope.item.obj[101004]) >= 79 && parseInt($scope.item.obj[101004]) <= 88) {
                        $scope.item.obj[101005] = 'Dibawah rata-rata'
                    } else if (parseInt($scope.item.obj[101004]) >= 70 && parseInt($scope.item.obj[101004]) <= 78) {
                        $scope.item.obj[101005] = 'borderline'
                    } else if (parseInt($scope.item.obj[101004]) >= 53 && parseInt($scope.item.obj[101004]) <= 69) {
                        $scope.item.obj[101005] = 'Mental Retardasi Ringan'
                    } else if (parseInt($scope.item.obj[101004]) >= 36 && parseInt($scope.item.obj[101004]) <= 52) {
                        $scope.item.obj[101005] = 'MR Sedang '
                    } else if (parseInt($scope.item.obj[101004]) >= 20 && parseInt($scope.item.obj[101004]) <= 35) {
                        $scope.item.obj[101005] = 'MR Berat'
                    } else if (parseInt($scope.item.obj[101004]) < 19) {
                        $scope.item.obj[101005] = 'MR sangat berat'
                    } else
                        $scope.item.obj[101005] = ''

                }
            })
            $scope.$watch('item.obj[101006]', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    if (parseInt($scope.item.obj[101006]) >= 130 && parseInt($scope.item.obj[101006]) <= 140) {
                        $scope.item.obj[101007] = 'Sangat Cerdas'
                    } else if (parseInt($scope.item.obj[101006]) >= 120 && parseInt($scope.item.obj[101006]) <= 129) {
                        $scope.item.obj[101007] = 'Cerdas'
                    } else if (parseInt($scope.item.obj[101006]) >= 110 && parseInt($scope.item.obj[101006]) <= 119) {
                        $scope.item.obj[101007] = 'Diatas rata-rata'
                    } else if (parseInt($scope.item.obj[101006]) >= 89 && parseInt($scope.item.obj[101006]) <= 109) {
                        $scope.item.obj[101007] = 'Rata-rata'
                    } else if (parseInt($scope.item.obj[101006]) >= 79 && parseInt($scope.item.obj[101006]) <= 88) {
                        $scope.item.obj[101007] = 'Dibawah rata-rata'
                    } else if (parseInt($scope.item.obj[101006]) >= 70 && parseInt($scope.item.obj[101006]) <= 78) {
                        $scope.item.obj[101007] = 'borderline'
                    } else if (parseInt($scope.item.obj[101006]) >= 53 && parseInt($scope.item.obj[101006]) <= 69) {
                        $scope.item.obj[101007] = 'Mental Retardasi Ringan'
                    } else if (parseInt($scope.item.obj[101006]) >= 36 && parseInt($scope.item.obj[101006]) <= 52) {
                        $scope.item.obj[101007] = 'MR Sedang '
                    } else if (parseInt($scope.item.obj[101006]) >= 20 && parseInt($scope.item.obj[101006]) <= 35) {
                        $scope.item.obj[101007] = 'MR Berat'
                    } else if (parseInt($scope.item.obj[101006]) < 19) {
                        $scope.item.obj[101007] = 'MR sangat berat'
                    } else
                        $scope.item.obj[101007] = ''

                }
            })
            $scope.$watch('item.obj[14499]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >= 7 && nilai <= 11) {
                    $scope.item.obj[14500] = true
                    $scope.item.obj[14501] = false

                }
                if (nilai >= 12) {
                    $scope.item.obj[14500] = false
                    $scope.item.obj[14501] = true

                }

            })


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
            $scope.getSkorGizi = function (stat) {
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
                    } else {}
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


                if (nilai < 4) {
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
                $scope.tombolSimpanVis = false
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({
                        id: arrobj[i],
                        values: $scope.item.obj[parseInt(arrobj[i])]
                    })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'RencanaIntegrasiAsuhanCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    var objSaveRO = {
                        noregistrasi: $scope.cc.noregistrasi,
                        noemr: e.data.data.noemr,
                        dataalergi: dataAlergi,
                        datapo: dataPO,
                        dataro: dataRO
                    }
                    medifirstService.post('farmasi/save-rekonsiliasi-obat', objSaveRO).then(function(data){
                        console.log(data);
                        $scope.tombolSimpanVis = true

                    })

                });
            }
            $scope.createData = function () {
                console.log(dataAlergi.length);

                $scope.item.norecAlergi = undefined;
                $scope.noAlergi = undefined
                // $scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD 00:00')
                // $scope.item.pegawai = {
                //     text: medifirstService.getPegawaiLogin().namaLengkap,
                //     value: medifirstService.getPegawaiLogin().id
                // }
                // if (dataCakem.length > 0) {
                //     $scope.item.evaluasi = dataCakem[dataCakem.length - 1].evaluasi
                // }
                $scope.popUpLembarRekon.center().open()
            }
            $scope.columnAlergiGrid = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="createData()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "nomorAlergi",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "objectprodukfk",
                        "title": "Nama obat/suplemen/herbal/tradisional",
                        "width": "80px",
                    },
                    {
                        "field": "reaksialergi",
                        "title": "Reaksi Alergi",
                        "width": "120px",
                    },
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapus,
                                imageClass: "k-icon k-i-delete"
                            },
                        ],
                        title: "",
                        width: "150px",
                    }
                ]
            }
            $scope.columnPOGrid = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="createDataPO()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "nomorPO",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama obat/suplemen/herbal/tradisional",
                        "width": "120px",
                    },
                    // {
                    //     "field": "obatlain",
                    //     "title": "Obat Lain",
                    //     "width": "70px",
                    // },
                    {
                        "title": "Jenis Obat",
                        "width": "120px",
                        "columns": [
                            {
                                "field": "resep",
                                "title": "Resep",
                                "width": "30px",
                            },
                            {
                                "field": "tanpa",
                                "title": "Tanpa",
                                "width": "30px",
                            },
                        ]
                    },
                    {
                        "title": "Tanggal",
                        "width": "120px",
                        "columns": [{
                                "field": "tanggalmulai",
                                "title": "Mulai",
                                "width": "70px",
                            },
                            {
                                "field": "tanggalstop",
                                "title": "Stop",
                                "width": "70px",
                            },
                        ]
                    },
                    
                    {
                        "field": "rute",
                        "title": "Rute",
                        "width": "70px",
                    },
                    {
                        "field": "frekuensi",
                        "title": "Aturan Pakai",
                        "width": "70px",
                    },
                    {
                        "field": "indikasi",
                        "title": "Indikasi",
                        "width": "70px",
                    },
                    {
                        "field": "statusobat",
                        "title": "Status Obat Saat Admisi",
                        "width": "40px",
                    },
                    {
                        "field": "perubahanaturan",
                        "title": "Perubahan Aturan Pakai",
                        "width": "120px",
                    },
                    {
                        "command": [
                            {
                                text: "Ubah",
                                click: editPO,
                                imageClass: "k-icon k-i-delete"
                            },
                            {
                            text: "Hapus",
                            click: hapusPO,
                            imageClass: "k-icon k-i-delete"
                        }, ],
                        title: "",
                        width: "150px",
                    }
                ]
            }
            $scope.columnROGrid = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="createDataRO()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "field": "nomorro",
                        "title": "No",
                        "width": "50px",
                    }, 
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Unit",
                        "width": "80px",
                    }, 
                    {
                        "field": "namaproduk",
                        "title": "Nama obat/suplemen/herbal/tradisional",
                        "width": "80px",
                    },
                    {
                        "field": "rute",
                        "title": "Rute",
                        "width": "30px",
                    }, 
                    {
                        "field": "aturanpakai",
                        "title": "Aturan Pakai",
                        "width": "30px",
                    },
                    {
                        "title": "Tindak Lanjut oleh DPJP",
                        "width": "120px",
                        "columns": [{
                                "field": "statusobat",
                                "title": "Status Obat",
                                "width": "40px",
                            },
                            {
                                "field": "perubahanaturanpakai",
                                "title": "Perubahan Aturan Pakai",
                                "width": "40px",
                            },
                        ]
                    },
                    {
                        "field": "namalengkap",
                        "title": "Tanda Tangan Apoteker",
                        "width": "80px",
                    },
                    
                    {
                        "command": [
                            {
                                text: "Ubah",
                                click: editRO,
                                imageClass: "k-icon k-i-delete"
                            }, 
                            {
                            text: "Hapus",
                            click: hapusRO,
                            imageClass: "k-icon k-i-delete"
                        }, ],
                        title: "#",
                        width: "50px",
                    }
                ]
            }
            function hapus(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataAlergi.length - 1; i >= 0; i--) {
                    if (dataAlergi[i].no == dataItem.no) {
                        dataAlergi.splice(i, 1);
                    }
                }
                console.log(dataItem);
                var itemDelete = {
                    "norec": dataItem.norec,
                    "case": "Alergi"
                }
                medifirstService.post('farmasi/delete-rekonsiliasi-obat', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }
            function editPO(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                console.log(dataItem);
                $scope.itemd.obatPO = {
                    id: dataItem.objectprodukfk,
                    namaproduk: dataItem.namaproduk
                }
                
                if (dataItem.obatlain != null && dataItem.obatlain != "") {
                    $scope.itemd.rslain = true
                    $scope.itemd.obatlain = dataItem.obatlain
                }
                $scope.norecPO = dataItem.norec
                $scope.nomorPO = dataItem.nomorPO
                $scope.itemd.resep = dataItem.resep == "✓" ? true : null;
                $scope.itemd.tanpa = dataItem.resep == "✓" ? null : true;
                $scope.itemd.tanggalmulai = new Date(dataItem.tanggalmulai)
                $scope.itemd.tanggalstop = new Date(dataItem.tanggalstop)
                $scope.itemd.rutePO = dataItem.rute
                $scope.itemd.frekuensiPO = dataItem.frekuensi
                $scope.itemd.indikasiPO = dataItem.indikasi
                if (dataItem.statusobat == "L"){
                    $scope.itemd.LPO = true
                } else if (dataItem.statusobat == "H"){
                    $scope.itemd.HPO = true
                }else{
                    $scope.itemd.TPO = true
                }
                $scope.itemd.aturanpakai = dataItem.perubahanaturan
                $scope.popUpLembarPenggunaanObat.center().open()
            }
            function hapusPO(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataAlergi.length - 1; i >= 0; i--) {
                    if (dataAlergi[i].no == dataItem.no) {
                        dataAlergi.splice(i, 1);
                    }
                }
                console.log(dataItem);
                var itemDelete = {
                    "norec": dataItem.norec,
                    "case": "PO"
                }
                medifirstService.post('farmasi/delete-rekonsiliasi-obat', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }
            function editRO(e) {
                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data

                })
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                console.log(dataItem);

                $scope.itemd.tanggalRO = new Date(dataItem.tanggal)
                $scope.itemd.namaruangan = {
                    id: dataItem.objectruanganfk,
                    namaruangan: dataItem.namaruangan
                }
                $scope.noRO = dataItem.nomorro
                $scope.itemd.obatRO = {
                    id: dataItem.objectprodukfk,
                    namaproduk: dataItem.namaproduk
                }
                if (dataItem.obatlain != null && dataItem.obatlain != "") {
                    $scope.itemd.rslain = true
                    $scope.itemd.dosisRO = dataItem.obatlain
                }
                // if (dataItem.obatlain != null && dataItem.obatlain != "") {
                //     $scope.itemd.rslain = true
                //     $scope.itemd.obatlain = dataItem.obatlain
                // }
                $scope.norecRO = dataItem.norec
                // $scope.nomorRO = dataItem.nomorRO
                $scope.itemd.rute = dataItem.rute;
                $scope.itemd.aturanpakai = dataItem.aturanpakai;
                if (dataItem.statusobat == "L") {
                    $scope.itemd.LPO = true
                } else if (dataItem.statusobat == "H") {
                    $scope.itemd.HPO = true
                } else {
                    $scope.itemd.TPO = true
                }
                $scope.itemd.perubahanaturanpakai = dataItem.perubahanaturanpakai
                $scope.itemd.apotekerRO = {
                    value: dataItem.objectpegawaifk,
                    text: dataItem.namalengkap
                }
                $scope.popUpLembarRekonsiliasiObat.center().open()
            }
            function hapusRO(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (var i = dataAlergi.length - 1; i >= 0; i--) {
                    if (dataAlergi[i].no == dataItem.no) {
                        dataAlergi.splice(i, 1);
                    }
                }
                console.log(dataItem);
                var itemDelete = {
                    "norec": dataItem.norec,
                    "case": "RO"
                }
                medifirstService.post('farmasi/delete-rekonsiliasi-obat', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        grid.removeRow(row);
                    }
                })
            }
            $scope.SaveAlergi = function(){
                var data = {}
                var nomorAlergi = 0
                if ($scope.dataSourceAlergiGrid == undefined) {
                    nomorAlergi = 1
                } else {
                    nomorAlergi = dataAlergi.length + 1
                }
                if($scope.norecAlergi != undefined){

                }else{
                    data = {
                        norec: "",
                        nomorAlergi: nomorAlergi,
                        namaproduk: $scope.itemd.obat,
                        objectprodukfk: $scope.itemd.obat,
                        reaksialergi: $scope.itemd.reaksialergi
                    }
                    dataAlergi.push(data)
                    $scope.dataSourceAlergiGrid = new kendo.data.DataSource({
                        data: dataAlergi,
                    });
                    $scope.itemd = {}
                    console.log(dataAlergi);
                }
            }
            $scope.SavePO = function () {
                var data = {}
                var nomorPO = 0
                var namaproduk = ""
                var objectprodukfk = null
                if ($scope.itemd.obatPO != undefined) {
                    namaproduk = $scope.itemd.obatPO.namaproduk
                    objectprodukfk = $scope.itemd.obatPO.id
                }
                var obatlain= ""
                if ($scope.itemd.obatlain != undefined) {
                    namaproduk = $scope.itemd.obatlain
                    obatlain = $scope.itemd.obatlain
                }
                var dosis = ""
                if ($scope.itemd.dosisPO != undefined) {
                    dosis = $scope.itemd.dosisPO
                }
                var tglawal = null
                if ($scope.itemd.tanggalmulai != undefined) {
                    tglawal = moment($scope.itemd.tanggalmulai).format("YYYY-MM-DD")
                }
                var tglstop = null
                if ($scope.itemd.tanggalstop != undefined) {
                    tglstop = moment($scope.itemd.tanggalstop).format("YYYY-MM-DD")
                }
                if ($scope.dataSourcePOGrid == undefined) {
                    nomorPO = 1
                } else {
                    nomorPO = dataPO.length + 1
                }
                if ($scope.nomorPO != undefined) {
                    for (var i = dataPO.length - 1; i >= 0; i--) {
                        if (dataPO[i].nomorPO == $scope.nomorPO) {
                            data.nomorPO = $scope.nomorPO
                            data.norec = $scope.norecPO
                            data.namaproduk = namaproduk
                            data.obatlain= obatlain
                            data.objectprodukfk= objectprodukfk
                            data.resep= $scope.itemd.resep == true ? "✓" : ""
                            data.tanpa= $scope.itemd.tanpa == true ? "✓" : ""
                            data.tanggalmulai= tglawal
                            data.tanggalstop= tglstop
                            data.rute= $scope.itemd.rutePO
                            data.frekuensi= $scope.itemd.frekuensiPO != undefined ? $scope.itemd.frekuensiPO : null
                            data.indikasi= $scope.itemd.indikasiPO != undefined ? $scope.itemd.indikasiPO : null
                            data.statusobat= $scope.itemd.LPO == true ? "L" : $scope.itemd.TPO == true ? "T" : $scope.itemd.HPO == true ? "H" : ""
                            data.perubahanaturan= $scope.itemd.aturanpakai != undefined ? $scope.itemd.aturanpakai : null
                            dataPO[i] = data;
                            $scope.dataSourcePOGrid = new kendo.data.DataSource({
                                data: dataPO,
                            });
                            console.log(dataPO);
                            $scope.itemd = {}
                            $scope.norecPO = ""
                        }
                    }
                } else {
                    
                    data = {
                        norec: $scope.norecPO,
                        nomorPO: nomorPO,
                        namaproduk: namaproduk,
                        obatlain: obatlain,
                        objectprodukfk: objectprodukfk,
                        resep: $scope.itemd.resep == true ? "✓": "",
                        tanpa: $scope.itemd.tanpa == true ? "✓": "",
                        tanggalmulai: tglawal,
                        tanggalstop: tglstop,
                        // dosis: dosis,
                        rute: $scope.itemd.rutePO,
                        frekuensi: $scope.itemd.frekuensiPO != undefined ? $scope.itemd.frekuensiPO : null,
                        indikasi: $scope.itemd.indikasiPO != undefined ? $scope.itemd.indikasiPO : null,
                        statusobat: $scope.itemd.LPO == true ? "L" : $scope.itemd.TPO == true ? "T" : $scope.itemd.HPO == true ? "H": "",
                        perubahanaturan: $scope.itemd.aturanpakai != undefined ? $scope.itemd.aturanpakai : null
                    }
                    dataPO.push(data)
                    $scope.dataSourcePOGrid = new kendo.data.DataSource({
                        data: dataPO,
                    });
                    console.log(dataPO);
                    $scope.itemd = {}
                    $scope.norecPO = ""
                }
            }
            $scope.createDataPO = function(){
                $scope.itemd.tanggalmulai = new Date()
                $scope.itemd.tanggalstop = new Date()
                $scope.norecPO = "";
                $scope.noPO = undefined
                $scope.popUpLembarPenggunaanObat.center().open()
            }

            $scope.createDataRO = function () {
                $scope.itemd.tanggalRO = new Date()
                $scope.norecRO = "";
                $scope.noRO = undefined
                $scope.popUpLembarRekonsiliasiObat.center().open()
            }
            $scope.SaveRO = function () {
                var obatlain = ""
                var objectprodukfk = null
                var namaobat = ""
                if ($scope.itemd.dosisRO != undefined) {
                    obatlain = $scope.itemd.dosisRO
                    namaobat = $scope.itemd.dosisRO
                }
                if ($scope.itemd.obatRO != undefined) {
                    namaobat = $scope.itemd.obatRO.namaproduk
                    objectprodukfk = $scope.itemd.obatRO.id
                }
                var rute = null
                if ($scope.itemd.rute!= undefined){
                    rute = $scope.itemd.rute
                }
                var aturanpakai = null
                if ($scope.itemd.aturanpakai != undefined) {
                    aturanpakai = $scope.itemd.aturanpakai
                }
                var perubahanaturanpakai = null
                if ($scope.itemd.perubahanaturanpakai != undefined) {
                    perubahanaturanpakai = $scope.itemd.perubahanaturanpakai
                }
                var data = {}
                var nomorRO = 0;
                if ($scope.dataSourceROGrid == undefined) {
                    nomorRO = 1
                } else {
                    nomorRO = dataRO.length + 1
                }
                if ($scope.noRO != undefined) {
                    for (var i = dataRO.length - 1; i >= 0; i--) {
                        if (dataRO[i].nomorro == $scope.noRO) {
                            data.norec = $scope.norecRO
                            data.nomorro = $scope.noRO
                            data.tanggal = moment($scope.itemd.tanggalRO).format('YYYY-MM-DD')
                            data.namaruangan = $scope.itemd.namaruangan.namaruangan
                            data.objectruanganfk = $scope.itemd.namaruangan.id

                            data.namaproduk = namaobat
                            data.obatlain = obatlain
                            data.objectprodukfk = objectprodukfk
                            
                            data.rute = rute
                            data.aturanpakai = aturanpakai
                            data.perubahanaturanpakai = perubahanaturanpakai
                            data.objectpegawaifk = $scope.itemd.apotekerRO.value
                            data.namalengkap = $scope.itemd.apotekerRO.text
                            data.statusobat = $scope.itemd.LPO == true ? "L" : $scope.itemd.TPO == true ? "T" : $scope.itemd.HPO == true ? "H" : ""
                            dataRO[i] = data;
                            $scope.dataSourceROGrid = new kendo.data.DataSource({
                                data: dataRO,
                            });
                            console.log(dataRO);
                            $scope.itemd = {}
                        }
                    }
                } else {
                    data = {
                        nomorro: nomorRO,
                        norec: $scope.norecRO,
                        tanggal: moment($scope.itemd.tanggalRO).format('YYYY-MM-DD'),
                        namaruangan: $scope.itemd.namaruangan.namaruangan,
                        objectruanganfk: $scope.itemd.namaruangan.id,
                        namaproduk: namaobat,
                        objectprodukfk: objectprodukfk,
                        rute: rute,
                        obatlain: obatlain,
                        aturanpakai: aturanpakai,
                        statusobat: $scope.itemd.LPO == true ? "L" : $scope.itemd.TPO == true ? "T" : $scope.itemd.HPO == true ? "H" : "",
                        perubahanaturanpakai: perubahanaturanpakai,
                        namalengkap: $scope.itemd.apotekerRO.text,
                        objectpegawaifk: $scope.itemd.apotekerRO.value
                    }
                    dataRO.push(data)
                    $scope.dataSourceROGrid = new kendo.data.DataSource({
                        data: dataRO,
                    });
                    console.log(dataRO);
                    $scope.itemd.obatRO = undefined
                    $scope.itemd.rute = undefined
                    $scope.itemd.aturanpakai = undefined
                    $scope.itemd.LPO = undefined
                    $scope.itemd.TPO = undefined
                    $scope.itemd.HPO = undefined
                    $scope.itemd.perubahanaturanpakai = undefined
                    // $scope.itemd.apotekerRO = undefined
                }
            }
            $scope.Batal = function(){
                $scope.itemd = {}
                $scope.popUpLembarPenggunaanObat.close()
                $scope.popUpLembarRekon.close()
                $scope.popUpLembarRekonsiliasiObat.close()
            }
            $scope.$watch('itemd.rslain', function (newValue, oldValue) {
                if ($scope.itemd.rslain == true) {
                    $scope.rslain = false
                } else if ($scope.itemd.rslain != true) {
                    $scope.rslain = true
                }
            })
            $scope.cetakBlade = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }
                // if ($scope.item.obj[3003998] != undefined) {
                //     $scope.listPegawai.add($scope.item.obj[3003998])
                //     $scope.item.pegawai = $scope.item.obj[3003998]
                // }
                // if (pegawai == undefined) {
                //     return
                // }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-rekon?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    // '&isttd=true' +
                    // '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd, '_blank');
            }
        }
    ]);
});