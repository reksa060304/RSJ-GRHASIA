define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SeleksiRehabilitasiSosialCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            var isNotClick = true;
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000523
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
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000523).then(function (e) {
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

            $scope.listAspekSosial = [  
                {
                    "id" : 1, "nama": "1. Pendidikan",
                    "detail": [
                        {"id": 3012900, "nama": "SD","type": "checkbox"},
                        {"id": 3012901, "nama": "SMP","type": "checkbox"},
                        {"id": 3012902, "nama": "SMA","type": "checkbox"},
                        {"id": 3012903, "nama": "Kuliah","type": "checkbox"},
                        {"id": 3012904, "nama": "Tidak pernah Sekolah","type": "checkbox"},
                    ]
                },
                {
                    "id" : 2, "nama": "2. Status Kelulusan Pendidikan",
                    "detail": [
                        {"id": 3012905, "nama": "Lulus","type": "checkbox"},
                        {"id": 3012906, "nama": "Tidak Lulus","type": "checkbox"},
                    ]
                },
                {
                    "id" : 3, "nama": "3. Pekerjaan",
                    "detail": [
                        {"id": 3012907, "nama": "Belum","type": "checkbox"},
                        {"id": 3012908, "nama": "Sudah","type": "checkbox"},
                        {"id": 3012909, "nama": "Jenis Pekerjaan","type": "textbox"},
                    ]
                },
                {
                    "id" : 4, "nama": "4. Ketrampilan yang dimiliki",
                    "detail": [
                        {"id": 3012910, "nama": "Bertani","type": "checkbox"},
                        {"id": 3012911, "nama": "Menjahit","type": "checkbox"},
                        {"id": 3012912, "nama": "Boga","type": "checkbox"},
                        {"id": 3012913, "nama": "Pertukangan","type": "checkbox"},
                        {"id": 3012914, "nama": "Lainnya","type": "textbox"},
                    ]
                },
                {
                    "id" : 5, "nama": "5. Sosok lekat di keluarga ",
                    "detail": [
                        {"id": 3012915, "nama": "Ayah","type": "checkbox"},
                        {"id": 3012916, "nama": "Ibu","type": "checkbox"},
                        {"id": 3012917, "nama": "Istri/Suami","type": "checkbox"},
                        {"id": 3012918, "nama": "Anak","type": "checkbox"},
                        {"id": 3012919, "nama": "Lainnya","type": "textbox"},
                    ]
                },
                {
                    "id" : 6, "nama": "6. Suku",
                    "detail": [
                        {"id": 3012920, "nama": "Jawa","type": "checkbox"},
                        {"id": 3012921, "nama": "Lainnya","type": "textbox"},
                    ]
                },
                {
                    "id" : 7, "nama": "7. Permasalahan Psikosial",
                    "detail": [
                        {"id": 3012922, "nama": "Dihina","type": "checkbox"},
                        {"id": 3012923, "nama": "Dikucilkan","type": "checkbox"},
                        {"id": 3012924, "nama": "Dikurung","type": "checkbox"},
                        {"id": 3012925, "nama": "Dipasung","type": "checkbox"},
                        {"id": 3012926, "nama": "Konflik Keluarga","type": "checkbox"},
                        {"id": 3012927, "nama": "Lainnya,","type": "textbox"},
                    ]
                },


            ]
            $scope.listRekomendasi = [  
                {
                    "id" : 1, "nama": " (1) Terapi Okupasi (centang pilihan)",
                    "detail": [
                        {"id": 3013004, "nama": "Manajemen emosi","type": "checkbox"},
                        {"id": 3013005, "nama": "Keterampilan Sosial (komunikasi)","type": "checkbox"},
                        {"id": 3013006, "nama": "ADL","type": "checkbox"},
                        {"id": 3013007, "nama": "Lainnya,","type": "textbox"}
                    ]
                },
                {
                    "id" : 1, "nama": "(2) Latihan Kerja (centang pilihan)",
                    "detail": [
                        {"id": 3013008, "nama": "ketrampilan","type": "checkbox"},
                        {"id": 3013009, "nama": "Pertukangan","type": "checkbox"},
                        {"id": 3013010, "nama": "Pertanian","type": "checkbox"},
                        {"id": 3013011, "nama": "Boga","type": "checkbox"},
                        {"id": 3013012, "nama": "Lainnya","type": "textbox"},
                    ]
                },
                {
                    "id" : 1, "nama": "(3) Lolos Seleksi",
                    "detail": [
                        {"id": 3013013, "nama": "Ya","type": "checkbox"},
                        {"id": 3013014, "nama": "Tidak","type": "checkbox"},
                    ]
                },
                {
                    "id" : 1, "nama": "(4) Pasien Menolak",
                    "detail": [
                        {"id": 3013015, "nama": "Ya","type": "checkbox"},
                        {"id": 3013016, "nama": "Tidak","type": "checkbox"},
                    ]
                },
            ]



            $scope.GCSKuantitatif = function ()
            {
                //jumlah1
                let tgl1 = parseInt($scope.item.obj[3002212]) || 0;
                let tgl2 = parseInt($scope.item.obj[3002248]) || 0;
                let tgl3 = parseInt($scope.item.obj[3002284]) || 0;
                let tgl4 = parseInt($scope.item.obj[3002320]) || 0;
                let tgl5 = parseInt($scope.item.obj[3002356]) || 0;
                let tgl6 = parseInt($scope.item.obj[3002392]) || 0;
                let tgl7 = parseInt($scope.item.obj[3002428]) || 0;
                let jumlah1 =  tgl1+tgl2+tgl3+tgl4+tgl5+tgl6+tgl7;
                $scope.item.obj[3002464] = jumlah1;


                //jumlah2

                let tgl11 = parseInt($scope.item.obj[3002213]) || 0;
                let tgl12 = parseInt($scope.item.obj[3002249]) || 0;
                let tgl13 = parseInt($scope.item.obj[3002285]) || 0;
                let tgl14 = parseInt($scope.item.obj[3002321]) || 0;
                let tgl15 = parseInt($scope.item.obj[3002357]) || 0;
                let tgl16 = parseInt($scope.item.obj[3002393]) || 0;
                let tgl17 = parseInt($scope.item.obj[3002429]) || 0;
                let jumlah2 =  tgl11+tgl12+tgl13+tgl14+tgl15+tgl16+ tgl17;
                $scope.item.obj[3002465] = jumlah2;

                 //jumlah3

                 let tgl21 = parseInt($scope.item.obj[3002214]) || 0;
                 let tgl22 = parseInt($scope.item.obj[3002250]) || 0;
                 let tgl23 = parseInt($scope.item.obj[3002286]) || 0;
                 let tgl24 = parseInt($scope.item.obj[3002322]) || 0;
                 let tgl25 = parseInt($scope.item.obj[3002358]) || 0;
                 let tgl26 = parseInt($scope.item.obj[3002394]) || 0;
                 let tgl27 = parseInt($scope.item.obj[3002430]) || 0;
                 let jumlah3 =  tgl21+tgl22+tgl23+tgl24+tgl25+tgl26+tgl27;
                 $scope.item.obj[3002466] = jumlah3;

                  //jumlah4
                 
                 let tgl31 = parseInt($scope.item.obj[3002215]) || 0;
                 let tgl32 = parseInt($scope.item.obj[3002251]) || 0;
                 let tgl33 = parseInt($scope.item.obj[3002287]) || 0;
                 let tgl34 = parseInt($scope.item.obj[3002323]) || 0;
                 let tgl35 = parseInt($scope.item.obj[3002359]) || 0;
                 let tgl36 = parseInt($scope.item.obj[3002395]) || 0;
                 let tgl37 = parseInt($scope.item.obj[3002431]) || 0;
                 let jumlah4 =  tgl31+tgl32+tgl33+tgl34+tgl35+tgl36+tgl37;
                 $scope.item.obj[3002467] = jumlah4;

                 //jumlah5

                 let tgl41 = parseInt($scope.item.obj[3002216]) || 0;
                 let tgl42 = parseInt($scope.item.obj[3002252]) || 0;
                 let tgl43 = parseInt($scope.item.obj[3002288]) || 0;
                 let tgl44 = parseInt($scope.item.obj[3002324]) || 0;
                 let tgl45 = parseInt($scope.item.obj[3002360]) || 0;
                 let tgl46 = parseInt($scope.item.obj[3002396]) || 0;
                 let tgl47 = parseInt($scope.item.obj[3002432]) || 0;
                 let jumlah5 =  tgl41+tgl42+tgl43+tgl44+tgl45+tgl46+tgl47;
                 $scope.item.obj[3002468] = jumlah5;

                //jumlah6

                   let tgl51 = parseInt($scope.item.obj[3002217]) || 0;
                   let tgl52 = parseInt($scope.item.obj[3002253]) || 0;
                   let tgl53 = parseInt($scope.item.obj[3002289]) || 0;
                   let tgl54 = parseInt($scope.item.obj[3002325]) || 0;
                   let tgl55 = parseInt($scope.item.obj[3002361]) || 0;
                   let tgl56 = parseInt($scope.item.obj[3002397]) || 0;
                   let tgl57 = parseInt($scope.item.obj[3002433]) || 0;
                   let jumlah6 =  tgl51+tgl52+tgl53+tgl54+tgl55+tgl56+tgl57;
                   $scope.item.obj[3002469] = jumlah6;

                //jumlah7

                    let tgl61 = parseInt($scope.item.obj[3002218]) || 0;
                    let tgl62 = parseInt($scope.item.obj[3002254]) || 0;
                    let tgl63 = parseInt($scope.item.obj[3002290]) || 0;
                    let tgl64 = parseInt($scope.item.obj[3002326]) || 0;
                    let tgl65 = parseInt($scope.item.obj[3002362]) || 0;
                    let tgl66 = parseInt($scope.item.obj[3002398]) || 0;
                    let tgl67 = parseInt($scope.item.obj[3002434]) || 0;
                     let jumlah7 =  tgl61+tgl62+tgl63+tgl64+tgl65+tgl66+tgl67;
                  $scope.item.obj[3002470] = jumlah7

                //jumlah8

                   let tgl71 = parseInt($scope.item.obj[3002219]) || 0;
                   let tgl72 = parseInt($scope.item.obj[3002255]) || 0;
                   let tgl73 = parseInt($scope.item.obj[3002291]) || 0;
                   let tgl74 = parseInt($scope.item.obj[3002327]) || 0;
                   let tgl75 = parseInt($scope.item.obj[3002363]) || 0;
                   let tgl76 = parseInt($scope.item.obj[3002399]) || 0;
                   let tgl77 = parseInt($scope.item.obj[3002435]) || 0;
                    let jumlah8 =  tgl71+tgl72+tgl73+tgl74+tgl75+tgl76+tgl77;
                 $scope.item.obj[3002471] = jumlah8


                   //jumlah9
                let tgl81 = parseInt($scope.item.obj[3002220]) || 0;
                let tgl82 = parseInt($scope.item.obj[3002256]) || 0;
                let tgl83 = parseInt($scope.item.obj[3002292]) || 0;
                let tgl84 = parseInt($scope.item.obj[3002328]) || 0;
                let tgl85 = parseInt($scope.item.obj[3002364]) || 0;
                let tgl86 = parseInt($scope.item.obj[3002400]) || 0;
                let tgl87 = parseInt($scope.item.obj[3002436]) || 0;
                let jumlah9 =  tgl81+tgl82+tgl83+tgl84+tgl85+tgl86+tgl87;
                $scope.item.obj[3002472] = jumlah9;


                //jumlah10

                let tgl91 = parseInt($scope.item.obj[3002221]) || 0;
                let tgl92 = parseInt($scope.item.obj[3002257]) || 0;
                let tgl93 = parseInt($scope.item.obj[3002293]) || 0;
                let tgl94 = parseInt($scope.item.obj[3002329]) || 0;
                let tgl95 = parseInt($scope.item.obj[3002365]) || 0;
                let tgl96 = parseInt($scope.item.obj[3002401]) || 0;
                let tgl97 = parseInt($scope.item.obj[3002437]) || 0;
                let jumlah10 =  tgl91+tgl92+tgl93+tgl94+tgl95+tgl96+ tgl97;
                $scope.item.obj[3002473] = jumlah10;

                 //jumlah11

                 let tgl101 = parseInt($scope.item.obj[3002222]) || 0;
                 let tgl102 = parseInt($scope.item.obj[3002258]) || 0;
                 let tgl103 = parseInt($scope.item.obj[3002294]) || 0;
                 let tgl104 = parseInt($scope.item.obj[3002330]) || 0;
                 let tgl105 = parseInt($scope.item.obj[3002366]) || 0;
                 let tgl106 = parseInt($scope.item.obj[3002402]) || 0;
                 let tgl107 = parseInt($scope.item.obj[3002438]) || 0;
                 let jumlah11 =  tgl101+tgl102+tgl103+tgl104+tgl105+tgl106+tgl107;
                 $scope.item.obj[3002474] = jumlah11;

                  //jumlah12
                 
                 let tgl111 = parseInt($scope.item.obj[3002223]) || 0;
                 let tgl112 = parseInt($scope.item.obj[3002259]) || 0;
                 let tgl113 = parseInt($scope.item.obj[3002295]) || 0;
                 let tgl114 = parseInt($scope.item.obj[3002331]) || 0;
                 let tgl115 = parseInt($scope.item.obj[3002367]) || 0;
                 let tgl116 = parseInt($scope.item.obj[3002403]) || 0;
                 let tgl117 = parseInt($scope.item.obj[3002439]) || 0;
                 let jumlah12 =  tgl111+tgl112+tgl113+tgl114+tgl115+tgl116+tgl117;
                 $scope.item.obj[3002475] = jumlah12;

                 //jumlah13

                 let tgl121 = parseInt($scope.item.obj[3002224]) || 0;
                 let tgl122 = parseInt($scope.item.obj[3002260]) || 0;
                 let tgl123 = parseInt($scope.item.obj[3002296]) || 0;
                 let tgl124 = parseInt($scope.item.obj[3002332]) || 0;
                 let tgl125 = parseInt($scope.item.obj[3002368]) || 0;
                 let tgl126 = parseInt($scope.item.obj[3002404]) || 0;
                 let tgl127 = parseInt($scope.item.obj[3002440]) || 0;
                 let jumlah13 =  tgl121+tgl122+tgl123+tgl124+tgl125+tgl126+tgl127;
                 $scope.item.obj[3002476] = jumlah13;

                //jumlah14

                   let tgl131 = parseInt($scope.item.obj[3002225]) || 0;
                   let tgl132 = parseInt($scope.item.obj[3002261]) || 0;
                   let tgl133 = parseInt($scope.item.obj[3002297]) || 0;
                   let tgl134 = parseInt($scope.item.obj[3002333]) || 0;
                   let tgl135 = parseInt($scope.item.obj[3002369]) || 0;
                   let tgl136 = parseInt($scope.item.obj[3002405]) || 0;
                   let tgl137 = parseInt($scope.item.obj[3002441]) || 0;
                   let jumlah14 =  tgl131+tgl132+tgl133+tgl134+tgl135+tgl136+tgl137;
                   $scope.item.obj[3002477] = jumlah14;

                //jumlah15

                    let tgl141 = parseInt($scope.item.obj[3002226]) || 0;
                    let tgl142 = parseInt($scope.item.obj[3002262]) || 0;
                    let tgl143 = parseInt($scope.item.obj[3002298]) || 0;
                    let tgl144 = parseInt($scope.item.obj[3002334]) || 0;
                    let tgl145 = parseInt($scope.item.obj[3002370]) || 0;
                    let tgl146 = parseInt($scope.item.obj[3002406]) || 0;
                    let tgl147 = parseInt($scope.item.obj[3002442]) || 0;
                     let jumlah15 =  tgl141+tgl142+tgl143+tgl144+tgl145+tgl146+tgl147;
                  $scope.item.obj[3002478] = jumlah15

                //jumlah16

                   let tgl151 = parseInt($scope.item.obj[3002227]) || 0;
                   let tgl152 = parseInt($scope.item.obj[3002263]) || 0;
                   let tgl153 = parseInt($scope.item.obj[3002299]) || 0;
                   let tgl154 = parseInt($scope.item.obj[3002335]) || 0;
                   let tgl155 = parseInt($scope.item.obj[3002371]) || 0;
                   let tgl156 = parseInt($scope.item.obj[3002407]) || 0;
                   let tgl157 = parseInt($scope.item.obj[3002443]) || 0;
                    let jumlah16 =  tgl151+tgl152+tgl153+tgl154+tgl155+tgl156+tgl157;
                 $scope.item.obj[3002479] = jumlah16


                    //jumlah17

                    let tgl161 = parseInt($scope.item.obj[3002228]) || 0;
                    let tgl162 = parseInt($scope.item.obj[3002264]) || 0;
                    let tgl163 = parseInt($scope.item.obj[3002300]) || 0;
                    let tgl164 = parseInt($scope.item.obj[3002336]) || 0;
                    let tgl165 = parseInt($scope.item.obj[3002372]) || 0;
                    let tgl166 = parseInt($scope.item.obj[3002408]) || 0;
                    let tgl167 = parseInt($scope.item.obj[3002444]) || 0;
                     let jumlah17 =  tgl161+tgl162+tgl163+tgl164+tgl165+tgl166+tgl167;
                  $scope.item.obj[3002480] = jumlah17

                //jumlah18

                   let tgl171 = parseInt($scope.item.obj[3002229]) || 0;
                   let tgl172 = parseInt($scope.item.obj[3002265]) || 0;
                   let tgl173 = parseInt($scope.item.obj[3002301]) || 0;
                   let tgl174 = parseInt($scope.item.obj[3002337]) || 0;
                   let tgl175 = parseInt($scope.item.obj[3002373]) || 0;
                   let tgl176 = parseInt($scope.item.obj[3002409]) || 0;
                   let tgl177 = parseInt($scope.item.obj[3002445]) || 0;
                    let jumlah18 =  tgl171+tgl172+tgl173+tgl174+tgl175+tgl176+tgl177;
                 $scope.item.obj[3002481] = jumlah18

                 
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
                        'SeleksiRehabilitasiSosialCtrl' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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