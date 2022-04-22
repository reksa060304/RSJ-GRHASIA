define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenRisikoPerilakuKekerasanCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000411
            $scope.now = new Date()
            var dataLoad = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            var norecEMR = ''
            $scope.isCetak = true

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000411).then(function (e) {
                // debugger
                var datas = e.data.kolom1
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    if (element.namaexternal == 'gaduh')
                        $scope.listData1.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'permusuhan')
                        $scope.listData2.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'ketegangan')
                        $scope.listData3.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'tidakkoperatif')
                        $scope.listData4.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                    if (element.namaexternal == 'impuls')
                        $scope.listData5.push({
                            id: element.id,
                            skor: element.reportdisplay,
                            nama: element.caption,
                            kodeexternal: element.kodeexternal
                        })
                }

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


            $scope.GCSKuantitatif = function ()
            {
                //jumlah1
                let tgl1 = parseInt($scope.item.obj[3001516]) || 0;
                let tgl2 = parseInt($scope.item.obj[3001532]) || 0;
                let tgl3 = parseInt($scope.item.obj[3001548]) || 0;
                let tgl4 = parseInt($scope.item.obj[3001564]) || 0;
                let tgl5 = parseInt($scope.item.obj[3001580]) || 0;
                let tgl6 = parseInt($scope.item.obj[3001596]) || 0;
                let tgl7 = parseInt($scope.item.obj[3001612]) || 0;
                let tgl8 = parseInt($scope.item.obj[3001628]) || 0;
                let jumlah1 =  tgl1+tgl2+tgl3+tgl4+tgl5+tgl6+tgl7+tgl8;
                $scope.item.obj[3001644] = jumlah1;


                //jumlah2

                let tgl11 = parseInt($scope.item.obj[3001517]) || 0;
                let tgl12 = parseInt($scope.item.obj[3001533]) || 0;
                let tgl13 = parseInt($scope.item.obj[3001549]) || 0;
                let tgl14 = parseInt($scope.item.obj[3001565]) || 0;
                let tgl15 = parseInt($scope.item.obj[3001581]) || 0;
                let tgl16 = parseInt($scope.item.obj[3001597]) || 0;
                let tgl17 = parseInt($scope.item.obj[3001613]) || 0;
                let tgl18 = parseInt($scope.item.obj[3001629]) || 0;
                let jumlah2 =  tgl11+tgl12+tgl13+tgl14+tgl15+tgl16+ tgl17+tgl18;
                $scope.item.obj[3001645] = jumlah2;

                 //jumlah3

                 let tgl21 = parseInt($scope.item.obj[3001518]) || 0;
                 let tgl22 = parseInt($scope.item.obj[3001534]) || 0;
                 let tgl23 = parseInt($scope.item.obj[3001550]) || 0;
                 let tgl24 = parseInt($scope.item.obj[3001566]) || 0;
                 let tgl25 = parseInt($scope.item.obj[3001582]) || 0;
                 let tgl26 = parseInt($scope.item.obj[3001598]) || 0;
                 let tgl27 = parseInt($scope.item.obj[3001614]) || 0;
                 let tgl28 = parseInt($scope.item.obj[3001630]) || 0;
                 let jumlah3 =  tgl21+tgl22+tgl23+tgl24+tgl25+tgl26+tgl27+tgl28;
                 $scope.item.obj[3001646] = jumlah3;

                  //jumlah4
                 
                 let tgl31 = parseInt($scope.item.obj[3001519]) || 0;
                 let tgl32 = parseInt($scope.item.obj[3001535]) || 0;
                 let tgl33 = parseInt($scope.item.obj[3001551]) || 0;
                 let tgl34 = parseInt($scope.item.obj[3001567]) || 0;
                 let tgl35 = parseInt($scope.item.obj[3001583]) || 0;
                 let tgl36 = parseInt($scope.item.obj[3001599]) || 0;
                 let tgl37 = parseInt($scope.item.obj[3001615]) || 0;
                 let tgl38 = parseInt($scope.item.obj[3001631]) || 0;
                 let jumlah4 =  tgl31+tgl32+tgl33+tgl34+tgl35+tgl36+tgl37+tgl38;
                 $scope.item.obj[3001647] = jumlah4;

                 //jumlah5

                 let tgl41 = parseInt($scope.item.obj[3001520]) || 0;
                 let tgl42 = parseInt($scope.item.obj[3001536]) || 0;
                 let tgl43 = parseInt($scope.item.obj[3001552]) || 0;
                 let tgl44 = parseInt($scope.item.obj[3001568]) || 0;
                 let tgl45 = parseInt($scope.item.obj[3001584]) || 0;
                 let tgl46 = parseInt($scope.item.obj[3001600]) || 0;
                 let tgl47 = parseInt($scope.item.obj[3001616]) || 0;
                 let tgl48 = parseInt($scope.item.obj[3001632]) || 0;
                 let jumlah5 =  tgl41+tgl42+tgl43+tgl44+tgl45+tgl46+tgl47+tgl48;
                 $scope.item.obj[3001648] = jumlah5;

                //jumlah6

                   let tgl51 = parseInt($scope.item.obj[3001521]) || 0;
                   let tgl52 = parseInt($scope.item.obj[3001537]) || 0;
                   let tgl53 = parseInt($scope.item.obj[3001553]) || 0;
                   let tgl54 = parseInt($scope.item.obj[3001569]) || 0;
                   let tgl55 = parseInt($scope.item.obj[3001585]) || 0;
                   let tgl56 = parseInt($scope.item.obj[3001601]) || 0;
                   let tgl57 = parseInt($scope.item.obj[3001617]) || 0;
                   let tgl58 = parseInt($scope.item.obj[3001633]) || 0;
                   let jumlah6 =  tgl51+tgl52+tgl53+tgl54+tgl55+tgl56+tgl57+tgl58;
                   $scope.item.obj[3001649] = jumlah6;

                //jumlah7

                    let tgl61 = parseInt($scope.item.obj[3001522]) || 0;
                    let tgl62 = parseInt($scope.item.obj[3001538]) || 0;
                    let tgl63 = parseInt($scope.item.obj[3001554]) || 0;
                    let tgl64 = parseInt($scope.item.obj[3001570]) || 0;
                    let tgl65 = parseInt($scope.item.obj[3001586]) || 0;
                    let tgl66 = parseInt($scope.item.obj[3001602]) || 0;
                    let tgl67 = parseInt($scope.item.obj[3001618]) || 0;
                    let tgl68 = parseInt($scope.item.obj[3001634]) || 0;
                     let jumlah7 =  tgl61+tgl62+tgl63+tgl64+tgl65+tgl66+tgl67+tgl68;
                  $scope.item.obj[3001650] = jumlah7

                //jumlah8

                   let tgl71 = parseInt($scope.item.obj[3001523]) || 0;
                   let tgl72 = parseInt($scope.item.obj[3001539]) || 0;
                   let tgl73 = parseInt($scope.item.obj[3001555]) || 0;
                   let tgl74 = parseInt($scope.item.obj[3001571]) || 0;
                   let tgl75 = parseInt($scope.item.obj[3001587]) || 0;
                   let tgl76 = parseInt($scope.item.obj[3001603]) || 0;
                   let tgl77 = parseInt($scope.item.obj[3001619]) || 0;
                   let tgl78 = parseInt($scope.item.obj[3001635]) || 0;
                    let jumlah8 =  tgl71+tgl72+tgl73+tgl74+tgl75+tgl76+tgl77+tgl78;
                 $scope.item.obj[3001651] = jumlah8


                   //jumlah9
                let tgl81 = parseInt($scope.item.obj[3001524]) || 0;
                let tgl82 = parseInt($scope.item.obj[3001540]) || 0;
                let tgl83 = parseInt($scope.item.obj[3001556]) || 0;
                let tgl84 = parseInt($scope.item.obj[3001572]) || 0;
                let tgl85 = parseInt($scope.item.obj[3001588]) || 0;
                let tgl86 = parseInt($scope.item.obj[3001604]) || 0;
                let tgl87 = parseInt($scope.item.obj[3001620]) || 0;
                let tgl88 = parseInt($scope.item.obj[3001636]) || 0;
                let jumlah9 =  tgl81+tgl82+tgl83+tgl84+tgl85+tgl86+tgl87+tgl88;
                $scope.item.obj[3001652] = jumlah9;


                //jumlah10

                let tgl91 = parseInt($scope.item.obj[3001525]) || 0;
                let tgl92 = parseInt($scope.item.obj[3001541]) || 0;
                let tgl93 = parseInt($scope.item.obj[3001557]) || 0;
                let tgl94 = parseInt($scope.item.obj[3001573]) || 0;
                let tgl95 = parseInt($scope.item.obj[3001589]) || 0;
                let tgl96 = parseInt($scope.item.obj[3001605]) || 0;
                let tgl97 = parseInt($scope.item.obj[3001621]) || 0;
                let tgl98 = parseInt($scope.item.obj[3001637]) || 0;
                let jumlah10 =  tgl91+tgl92+tgl93+tgl94+tgl95+tgl96+ tgl97+tgl98;
                $scope.item.obj[3001653] = jumlah10;

                 //jumlah11

                 let tgl101 = parseInt($scope.item.obj[3001526]) || 0;
                 let tgl102 = parseInt($scope.item.obj[3001542]) || 0;
                 let tgl103 = parseInt($scope.item.obj[3001558]) || 0;
                 let tgl104 = parseInt($scope.item.obj[3001574]) || 0;
                 let tgl105 = parseInt($scope.item.obj[3001590]) || 0;
                 let tgl106 = parseInt($scope.item.obj[3001606]) || 0;
                 let tgl107 = parseInt($scope.item.obj[3001622]) || 0;
                 let tgl108 = parseInt($scope.item.obj[3001638]) || 0;
                 let jumlah11 =  tgl101+tgl102+tgl103+tgl104+tgl105+tgl106+tgl107+tgl108;
                 $scope.item.obj[3001654] = jumlah11;

                  //jumlah12
                 
                 let tgl111 = parseInt($scope.item.obj[3001527]) || 0;
                 let tgl112 = parseInt($scope.item.obj[3001543]) || 0;
                 let tgl113 = parseInt($scope.item.obj[3001559]) || 0;
                 let tgl114 = parseInt($scope.item.obj[3001575]) || 0;
                 let tgl115 = parseInt($scope.item.obj[3001591]) || 0;
                 let tgl116 = parseInt($scope.item.obj[3001607]) || 0;
                 let tgl117 = parseInt($scope.item.obj[3001623]) || 0;
                 let tgl118 = parseInt($scope.item.obj[3001639]) || 0;
                 let jumlah12 =  tgl111+tgl112+tgl113+tgl114+tgl115+tgl116+tgl117+tgl118;
                 $scope.item.obj[3001655] = jumlah12;

                 //jumlah13

                 let tgl121 = parseInt($scope.item.obj[3001528]) || 0;
                 let tgl122 = parseInt($scope.item.obj[3001544]) || 0;
                 let tgl123 = parseInt($scope.item.obj[3001560]) || 0;
                 let tgl124 = parseInt($scope.item.obj[3001576]) || 0;
                 let tgl125 = parseInt($scope.item.obj[3001592]) || 0;
                 let tgl126 = parseInt($scope.item.obj[3001608]) || 0;
                 let tgl127 = parseInt($scope.item.obj[3001624]) || 0;
                 let tgl128 = parseInt($scope.item.obj[3001640]) || 0;
                 let jumlah13 =  tgl121+tgl122+tgl123+tgl124+tgl125+tgl126+tgl127+tgl128;
                 $scope.item.obj[3001656] = jumlah13;

                //jumlah14

                   let tgl131 = parseInt($scope.item.obj[3001529]) || 0;
                   let tgl132 = parseInt($scope.item.obj[3001545]) || 0;
                   let tgl133 = parseInt($scope.item.obj[3001561]) || 0;
                   let tgl134 = parseInt($scope.item.obj[3001577]) || 0;
                   let tgl135 = parseInt($scope.item.obj[3001593]) || 0;
                   let tgl136 = parseInt($scope.item.obj[3001609]) || 0;
                   let tgl137 = parseInt($scope.item.obj[3001625]) || 0;
                   let tgl138 = parseInt($scope.item.obj[3001641]) || 0;
                   let jumlah14 =  tgl131+tgl132+tgl133+tgl134+tgl135+tgl136+tgl137+tgl138;
                   $scope.item.obj[3001657] = jumlah14;

                //jumlah15

                    let tgl141 = parseInt($scope.item.obj[3001530]) || 0;
                    let tgl142 = parseInt($scope.item.obj[3001546]) || 0;
                    let tgl143 = parseInt($scope.item.obj[3001562]) || 0;
                    let tgl144 = parseInt($scope.item.obj[3001578]) || 0;
                    let tgl145 = parseInt($scope.item.obj[3001594]) || 0;
                    let tgl146 = parseInt($scope.item.obj[3001610]) || 0;
                    let tgl147 = parseInt($scope.item.obj[3001626]) || 0;
                    let tgl148 = parseInt($scope.item.obj[3001642]) || 0;
                     let jumlah15 =  tgl141+tgl142+tgl143+tgl144+tgl145+tgl146+tgl147+tgl148;
                  $scope.item.obj[3001658] = jumlah15

                //jumlah16

                   let tgl151 = parseInt($scope.item.obj[3001531]) || 0;
                   let tgl152 = parseInt($scope.item.obj[3001547]) || 0;
                   let tgl153 = parseInt($scope.item.obj[3001563]) || 0;
                   let tgl154 = parseInt($scope.item.obj[3001579]) || 0;
                   let tgl155 = parseInt($scope.item.obj[3001595]) || 0;
                   let tgl156 = parseInt($scope.item.obj[3001611]) || 0;
                   let tgl157 = parseInt($scope.item.obj[3001627]) || 0;
                   let tgl158 = parseInt($scope.item.obj[3001643]) || 0;
                    let jumlah16 =  tgl151+tgl152+tgl153+tgl154+tgl155+tgl156+tgl157+tgl158;
                 $scope.item.obj[3001659] = jumlah16

                 
            }
            
            


            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-pansssingkat&id=' +
                    $scope.cc.nocm + '&emr=' + norecEMR + '&view=true' + '&idemr=' + 501,
                    function (response) {
                        // do something with response
                    });
            }

            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR

                if (nomorEMR != '-') {
                    cacheHelper.set('cacheEMR_PANEC', nomorEMR)
                }
                $scope.totalSkor = 0
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[9085] = $scope.now
                    $scope.item.obj[9086] = {
                        value: $scope.cc.iddpjp,
                        text: $scope.cc.dokterdpjp
                    }
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if (dataLoad[i].emrdfk == '9084')
                                    $scope.totalSkor = parseFloat(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                                //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                //     $scope.getSkor2(datass)
                                // }
                                // // if (dataLoad[i].reportdisplay != null) {
                                // //     var datass = { id: dataLoad[i].emrdfk, skor: dataLoad[i].reportdisplay }
                                // //     $scope.getSkor(datass)
                                // }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
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
                            // if(dataLoad[i].type == "checkboxtextbox") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                            // }
                            // if(dataLoad[i].type == "textarea") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            // }
                        }

                    }
                })
            }

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




            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.skor)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.skor)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[9084] = $scope.totalSkor //+ $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
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
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
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

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            $scope.Batal = function () {
                $scope.item.obj = []
                $scope.item.obj2 = []
            }

            $scope.Save = function () {

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
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'AsesmenRisikoPerilakuKekerasanCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});