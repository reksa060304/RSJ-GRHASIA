define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('HPPMinatBakatCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3000428
            var dataLoad = []
            // $scope.isCetak = true
            $scope.isCetakV = true
            var norecEMR = ''

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
                if ($scope.cc.jeniskelamin == 'PEREMPUAN'){
                    $scope.cc.jeniskelamin = 2
                }else{
                    $scope.cc.jeniskelamin = 1

                }
                // 2112000076
                medifirstService.get('emr/get-epps-hasil?norec=' + $scope.cc.norec + "&jeniskelamin=" + $scope.cc.jeniskelamin).then(function (data) {
                    var datas = data.data.epps
                    var kraepelin = data.data.kraepelin
                    var ist = data.data.ist
                    if(datas != ""){
                        //ach
                        if (datas[0].ach[0].ach >= 0 && datas[0].ach[0].ach <= 19) {
                            $scope.item.obj[3004207] = true
                        } else if (datas[0].ach[0].ach >= 20 && datas[0].ach[0].ach <= 39) {
                            $scope.item.obj[3004208] = true
                        } else if (datas[0].ach[0].ach >= 40 && datas[0].ach[0].ach <= 59) {
                            $scope.item.obj[3004209] = true
                        } else if (datas[0].ach[0].ach >= 60 && datas[0].ach[0].ach <= 79) {
                            $scope.item.obj[3004210] = true
                        } else if (datas[0].ach[0].ach >= 80 && datas[0].ach[0].ach <= 99) {
                            $scope.item.obj[3004211] = true
                        }
                        //def
                        if (datas[0].def[0].def >= 0 && datas[0].def[0].def <= 19) {
                            $scope.item.obj[3004212] = true
                        } else if (datas[0].def[0].def >= 20 && datas[0].def[0].def <= 39) {
                            $scope.item.obj[3004213] = true
                        } else if (datas[0].def[0].def >= 40 && datas[0].def[0].def <= 59) {
                            $scope.item.obj[3004214] = true
                        } else if (datas[0].def[0].def >= 60 && datas[0].def[0].def <= 79) {
                            $scope.item.obj[3004215] = true
                        } else if (datas[0].def[0].def >= 80 && datas[0].def[0].def <= 99) {
                            $scope.item.obj[3004216] = true
                        }
                        //ord
                        if (datas[0].ord[0].ord >= 0 && datas[0].ord[0].ord <= 19) {
                            $scope.item.obj[3004217] = true
                        } else if (datas[0].ord[0].ord >= 20 && datas[0].ord[0].ord <= 39) {
                            $scope.item.obj[3004218] = true
                        } else if (datas[0].ord[0].ord >= 40 && datas[0].ord[0].ord <= 59) {
                            $scope.item.obj[3004219] = true
                        } else if (datas[0].ord[0].ord >= 60 && datas[0].ord[0].ord <= 79) {
                            $scope.item.obj[3004220] = true
                        } else if (datas[0].ord[0].ord >= 80 && datas[0].ord[0].ord <= 99) {
                            $scope.item.obj[3004221] = true
                        }
                        //exh
                        if (datas[0].exh[0].exh >= 0 && datas[0].exh[0].exh <= 19) {
                            $scope.item.obj[3004222] = true
                        } else if (datas[0].exh[0].exh >= 20 && datas[0].exh[0].exh <= 39) {
                            $scope.item.obj[3004223] = true
                        } else if (datas[0].exh[0].exh >= 40 && datas[0].exh[0].exh <= 59) {
                            $scope.item.obj[3004224] = true
                        } else if (datas[0].exh[0].exh >= 60 && datas[0].exh[0].exh <= 79) {
                            $scope.item.obj[3004225] = true
                        } else if (datas[0].exh[0].exh >= 80 && datas[0].exh[0].exh <= 99) {
                            $scope.item.obj[3004226] = true
                        }
                        //aut
                        if (datas[0].aut[0].aut >= 0 && datas[0].aut[0].aut <= 19) {
                            $scope.item.obj[3004227] = true
                        } else if (datas[0].aut[0].aut >= 20 && datas[0].aut[0].aut <= 39) {
                            $scope.item.obj[3004228] = true
                        } else if (datas[0].aut[0].aut >= 40 && datas[0].aut[0].aut <= 59) {
                            $scope.item.obj[3004229] = true
                        } else if (datas[0].aut[0].aut >= 60 && datas[0].aut[0].aut <= 79) {
                            $scope.item.obj[3004230] = true
                        } else if (datas[0].aut[0].aut >= 80 && datas[0].aut[0].aut <= 99) {
                            $scope.item.obj[3004231] = true
                        }
                        //aff
                        if (datas[0].aff[0].aff >= 0 && datas[0].aff[0].aff <= 19) {
                            $scope.item.obj[3004232] = true
                        } else if (datas[0].aff[0].aff >= 20 && datas[0].aff[0].aff <= 39) {
                            $scope.item.obj[3004233] = true
                        } else if (datas[0].aff[0].aff >= 40 && datas[0].aff[0].aff <= 59) {
                            $scope.item.obj[3004234] = true
                        } else if (datas[0].aff[0].aff >= 60 && datas[0].aff[0].aff <= 79) {
                            $scope.item.obj[3004235] = true
                        } else if (datas[0].aff[0].aff >= 80 && datas[0].aff[0].aff <= 99) {
                            $scope.item.obj[3004236] = true
                        }
                        //int
                        if (datas[0].int[0].int >= 0 && datas[0].int[0].int <= 19) {
                            $scope.item.obj[3004237] = true
                        } else if (datas[0].int[0].int >= 20 && datas[0].int[0].int <= 39) {
                            $scope.item.obj[3004238] = true
                        } else if (datas[0].int[0].int >= 40 && datas[0].int[0].int <= 59) {
                            $scope.item.obj[3004239] = true
                        } else if (datas[0].int[0].int >= 60 && datas[0].int[0].int <= 79) {
                            $scope.item.obj[3004240] = true
                        } else if (datas[0].int[0].int >= 80 && datas[0].int[0].int <= 99) {
                            $scope.item.obj[3004241] = true
                        }
                        //suc
                        if (datas[0].suc[0].suc >= 0 && datas[0].suc[0].suc <= 19) {
                            $scope.item.obj[3004242] = true
                        } else if (datas[0].suc[0].suc >= 20 && datas[0].suc[0].suc <= 39) {
                            $scope.item.obj[3004243] = true
                        } else if (datas[0].suc[0].suc >= 40 && datas[0].suc[0].suc <= 59) {
                            $scope.item.obj[3004244] = true
                        } else if (datas[0].suc[0].suc >= 60 && datas[0].suc[0].suc <= 79) {
                            $scope.item.obj[3004245] = true
                        } else if (datas[0].suc[0].suc >= 80 && datas[0].suc[0].suc <= 99) {
                            $scope.item.obj[3004246] = true
                        }
                        //dom
                        if (datas[0].dom[0].dom >= 0 && datas[0].dom[0].dom <= 19) {
                            $scope.item.obj[3004247] = true
                        } else if (datas[0].dom[0].dom >= 20 && datas[0].dom[0].dom <= 39) {
                            $scope.item.obj[3004248] = true
                        } else if (datas[0].dom[0].dom >= 40 && datas[0].dom[0].dom <= 59) {
                            $scope.item.obj[3004249] = true
                        } else if (datas[0].dom[0].dom >= 60 && datas[0].dom[0].dom <= 79) {
                            $scope.item.obj[3004250] = true
                        } else if (datas[0].dom[0].dom >= 80 && datas[0].dom[0].dom <= 99) {
                            $scope.item.obj[3004251] = true
                        }
                        //aba
                        if (datas[0].aba[0].aba >= 0 && datas[0].aba[0].aba <= 19) {
                            $scope.item.obj[3004252] = true
                        } else if (datas[0].aba[0].aba >= 20 && datas[0].aba[0].aba <= 39) {
                            $scope.item.obj[3004253] = true
                        } else if (datas[0].aba[0].aba >= 40 && datas[0].aba[0].aba <= 59) {
                            $scope.item.obj[3004254] = true
                        } else if (datas[0].aba[0].aba >= 60 && datas[0].aba[0].aba <= 79) {
                            $scope.item.obj[3004255] = true
                        } else if (datas[0].aba[0].aba >= 80 && datas[0].aba[0].aba <= 99) {
                            $scope.item.obj[3004256] = true
                        }
                        //nur
                        if (datas[0].nur[0].nur >= 0 && datas[0].nur[0].nur <= 19) {
                            $scope.item.obj[3004257] = true
                        } else if (datas[0].nur[0].nur >= 20 && datas[0].nur[0].nur <= 39) {
                            $scope.item.obj[3004258] = true
                        } else if (datas[0].nur[0].nur >= 40 && datas[0].nur[0].nur <= 59) {
                            $scope.item.obj[3004259] = true
                        } else if (datas[0].nur[0].nur >= 60 && datas[0].nur[0].nur <= 79) {
                            $scope.item.obj[3004260] = true
                        } else if (datas[0].nur[0].nur >= 80 && datas[0].nur[0].nur <= 99) {
                            $scope.item.obj[3004261] = true
                        }
                        //chg
                        if (datas[0].chg[0].chg >= 0 && datas[0].chg[0].chg <= 19) {
                            $scope.item.obj[3004262] = true
                        } else if (datas[0].chg[0].chg >= 20 && datas[0].chg[0].chg <= 39) {
                            $scope.item.obj[3004263] = true
                        } else if (datas[0].chg[0].chg >= 40 && datas[0].chg[0].chg <= 59) {
                            $scope.item.obj[3004264] = true
                        } else if (datas[0].chg[0].chg >= 60 && datas[0].chg[0].chg <= 79) {
                            $scope.item.obj[3004265] = true
                        } else if (datas[0].chg[0].chg >= 80 && datas[0].chg[0].chg <= 99) {
                            $scope.item.obj[3004266] = true
                        }
                        //end
                        if (datas[0].end[0].end >= 0 && datas[0].end[0].end <= 19) {
                            $scope.item.obj[3004267] = true
                        } else if (datas[0].end[0].end >= 20 && datas[0].end[0].end <= 39) {
                            $scope.item.obj[3004268] = true
                        } else if (datas[0].end[0].end >= 40 && datas[0].end[0].end <= 59) {
                            $scope.item.obj[3004269] = true
                        } else if (datas[0].end[0].end >= 60 && datas[0].end[0].end <= 79) {
                            $scope.item.obj[3004270] = true
                        } else if (datas[0].end[0].end >= 80 && datas[0].end[0].end <= 99) {
                            $scope.item.obj[3004271] = true
                        }
                        //het
                        if (datas[0].het[0].het >= 0 && datas[0].het[0].het <= 19) {
                            $scope.item.obj[3004272] = true
                        } else if (datas[0].het[0].het >= 20 && datas[0].het[0].het <= 39) {
                            $scope.item.obj[3004273] = true
                        } else if (datas[0].het[0].het >= 40 && datas[0].het[0].het <= 59) {
                            $scope.item.obj[3004274] = true
                        } else if (datas[0].het[0].het >= 60 && datas[0].het[0].het <= 79) {
                            $scope.item.obj[3004275] = true
                        } else if (datas[0].het[0].het >= 80 && datas[0].het[0].het <= 99) {
                            $scope.item.obj[3004276] = true
                        }
                        //agg
                        if (datas[0].agg[0].agg >= 0 && datas[0].agg[0].agg <= 19) {
                            $scope.item.obj[3004277] = true
                        } else if (datas[0].agg[0].agg >= 20 && datas[0].agg[0].agg <= 39) {
                            $scope.item.obj[3004278] = true
                        } else if (datas[0].agg[0].agg >= 40 && datas[0].agg[0].agg <= 59) {
                            $scope.item.obj[3004279] = true
                        } else if (datas[0].agg[0].agg >= 60 && datas[0].agg[0].agg <= 79) {
                            $scope.item.obj[3004280] = true
                        } else if (datas[0].agg[0].agg >= 80 && datas[0].agg[0].agg <= 99) {
                            $scope.item.obj[3004281] = true
                        }
                        
                    }
                    if(kraepelin != ""){
                        if (kraepelin[0].hasil == "KS") {
                            $scope.item.obj[3004282] = true
                        } else if (kraepelin[0].hasil == "K") {
                            $scope.item.obj[3004283] = true
                        } else if (kraepelin[0].hasil == "S") {
                            $scope.item.obj[3004284] = true
                        } else if (kraepelin[0].hasil == "B") {
                            $scope.item.obj[3004285] = true
                        } else if (kraepelin[0].hasil == "BS") {
                            $scope.item.obj[3004286] = true
                        }

                        if (kraepelin[1].hasil == "KS") {
                            $scope.item.obj[3004287] = true
                        } else if (kraepelin[1].hasil == "K") {
                            $scope.item.obj[3004288] = true
                        } else if (kraepelin[1].hasil == "S") {
                            $scope.item.obj[3004289] = true
                        } else if (kraepelin[1].hasil == "B") {
                            $scope.item.obj[3004290] = true
                        } else if (kraepelin[1].hasil == "BS") {
                            $scope.item.obj[3004291] = true
                        }

                        if (kraepelin[2].hasil == "KS") {
                            $scope.item.obj[3004292] = true
                        } else if (kraepelin[2].hasil == "K") {
                            $scope.item.obj[3004293] = true
                        } else if (kraepelin[2].hasil == "S") {
                            $scope.item.obj[3004294] = true
                        } else if (kraepelin[2].hasil == "B") {
                            $scope.item.obj[3004295] = true
                        } else if (kraepelin[2].hasil == "BS") {
                            $scope.item.obj[3004296] = true
                        }

                        if (kraepelin[3].hasil == "KS") {
                            $scope.item.obj[3004297] = true
                        } else if (kraepelin[3].hasil == "K") {
                            $scope.item.obj[3004298] = true
                        } else if (kraepelin[3].hasil == "S") {
                            $scope.item.obj[3004299] = true
                        } else if (kraepelin[3].hasil == "B") {
                            $scope.item.obj[3004300] = true
                        } else if (kraepelin[3].hasil == "BS") {
                            $scope.item.obj[3004301] = true
                        }

                        // if (kraepelin[4].hasil == "KS") {
                        //     $scope.item.obj[3004302] = true
                        // } else if (kraepelin[4].hasil == "K") {
                        //     $scope.item.obj[3004303] = true
                        // } else if (kraepelin[4].hasil == "S") {
                        //     $scope.item.obj[3004304] = true
                        // } else if (kraepelin[4].hasil == "B") {
                        //     $scope.item.obj[3004305] = true
                        // } else if (kraepelin[4].hasil == "BS") {
                        //     $scope.item.obj[3004306] = true
                        // }
                    }
                    if(ist != ""){
                        if(ist[0].se_sw <= 80){
                            $scope.item.obj[3004162] = true
                        } else if (ist[0].se_sw <= 94) {
                            $scope.item.obj[3004163] = true
                        } else if (ist[0].se_sw <= 99) {
                            $scope.item.obj[3004164] = true
                        } else if (ist[0].se_sw <= 104) {
                            $scope.item.obj[3004165] = true
                        } else if (ist[0].se_sw <= 118) {
                            $scope.item.obj[3004166] = true
                        }
                        if (ist[0].wa_sw <= 80) {
                            $scope.item.obj[3004167] = true
                        } else if (ist[0].wa_sw <= 94) {
                            $scope.item.obj[3004168] = true
                        } else if (ist[0].wa_sw <= 99) {
                            $scope.item.obj[3004169] = true
                        } else if (ist[0].wa_sw <= 104) {
                            $scope.item.obj[3004170] = true
                        } else if (ist[0].wa_sw <= 118) {
                            $scope.item.obj[3004171] = true
                        }
                        if (ist[0].an_sw <= 80) {
                            $scope.item.obj[3004172] = true
                        } else if (ist[0].an_sw <= 94) {
                            $scope.item.obj[3004173] = true
                        } else if (ist[0].an_sw <= 99) {
                            $scope.item.obj[3004174] = true
                        } else if (ist[0].an_sw <= 104) {
                            $scope.item.obj[3004175] = true
                        } else if (ist[0].an_sw <= 118) {
                            $scope.item.obj[3004176] = true
                        }
                        if (ist[0].ge_sw <= 80) {
                            $scope.item.obj[3004177] = true
                        } else if (ist[0].ge_sw <= 94) {
                            $scope.item.obj[3004178] = true
                        } else if (ist[0].ge_sw <= 99) {
                            $scope.item.obj[3004179] = true
                        } else if (ist[0].ge_sw <= 104) {
                            $scope.item.obj[3004180] = true
                        } else if (ist[0].ge_sw <= 118) {
                            $scope.item.obj[3004181] = true
                        }
                        if (ist[0].me_sw <= 80) {
                            $scope.item.obj[3004182] = true
                        } else if (ist[0].me_sw <= 94) {
                            $scope.item.obj[3004183] = true
                        } else if (ist[0].me_sw <= 99) {
                            $scope.item.obj[3004184] = true
                        } else if (ist[0].me_sw <= 104) {
                            $scope.item.obj[3004185] = true
                        } else if (ist[0].me_sw <= 118) {
                            $scope.item.obj[3004186] = true
                        }
                        if (ist[0].ra_sw <= 80) {
                            $scope.item.obj[3004187] = true
                        } else if (ist[0].ra_sw <= 94) {
                            $scope.item.obj[3004188] = true
                        } else if (ist[0].ra_sw <= 99) {
                            $scope.item.obj[3004189] = true
                        } else if (ist[0].ra_sw <= 104) {
                            $scope.item.obj[3004190] = true
                        } else if (ist[0].ra_sw <= 118) {
                            $scope.item.obj[3004191] = true
                        }
                        if (ist[0].zr_sw <= 80) {
                            $scope.item.obj[3004192] = true
                        } else if (ist[0].zr_sw <= 94) {
                            $scope.item.obj[3004193] = true
                        } else if (ist[0].zr_sw <= 99) {
                            $scope.item.obj[3004194] = true
                        } else if (ist[0].zr_sw <= 104) {
                            $scope.item.obj[3004195] = true
                        } else if (ist[0].zr_sw <= 118) {
                            $scope.item.obj[3004196] = true
                        }
                        if (ist[0].fa_sw <= 80) {
                            $scope.item.obj[3004197] = true
                        } else if (ist[0].fa_sw <= 94) {
                            $scope.item.obj[3004198] = true
                        } else if (ist[0].fa_sw <= 99) {
                            $scope.item.obj[3004199] = true
                        } else if (ist[0].fa_sw <= 104) {
                            $scope.item.obj[3004200] = true
                        } else if (ist[0].fa_sw <= 118) {
                            $scope.item.obj[3004201] = true
                        }

                        if (ist[0].wu_sw <= 80) {
                            $scope.item.obj[3004202] = true
                        } else if (ist[0].wu_sw <= 94) {
                            $scope.item.obj[3004203] = true
                        } else if (ist[0].wu_sw <= 99) {
                            $scope.item.obj[3004204] = true
                        } else if (ist[0].wu_sw <= 104) {
                            $scope.item.obj[3004205] = true
                        } else if (ist[0].wu_sw <= 118) {
                            $scope.item.obj[3004206] = true
                        }
                    }
                })
                $scope.item.obj[3004150]=$scope.cc.nocm
                $scope.item.obj[3004151]=$scope.cc.namapasien
                $scope.item.obj[3004152]=moment($scope.cc.tglLahir).format('DD-MMMM-YYYY ');
                $scope.item.obj[3004153]=$scope.cc.alamat


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
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                   'HPPMinatBakatCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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
                // console.log(cacheNomorEMR);
                var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                console.log(cacheNomorEMR[0]);
                // return
                if (cacheNomorEMR[0] == '-') {return}

                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-surathppminatbakat?noemr=' + cacheNomorEMR[0] + '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }

        }
    ]);
});