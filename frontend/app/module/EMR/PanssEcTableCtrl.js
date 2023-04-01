define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('PanssEcTableCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglinput = moment($scope.now).format('YYYY-MM-DD 00:00')
            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorSkalaFlacc = [];
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000449
            var dataLoad = []
            var pegawaiInputDetail = ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            loadCombo()
            FormLoad()
            $scope.item.obj = []
            
            console.log(medifirstService.getPegawaiLogin());
            function loadCombo(){
                
            }
            function FormLoad() {
                $scope.isRouteLoading = true;
                
                medifirstService.get('sdm/get-data-pegawai-all-sdm').then(function (data) {
                    $scope.listPegawai = data
                })
                medifirstService.get("emr/get-lembar-panss-ec?norec_apd=" + $state.params.noRec).then(function (data) {
                   var datas = data.data.data;
                $scope.isRouteLoading = false;

                //    console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    datas[i].no = i+1
                }
                   $scope.dataSourceGrid = new kendo.data.DataSource({
                       data: datas,
                       pageSize: 10
                   });
                });
            }


            $scope.SearchData = function () {
                FormLoad()
            }
            $scope.columnGrid = {
                toolbar: [{
					name: "create",
					text: "Tambah PANSS EC",
					template: '<button ng-click="createPanssEc()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah PANSS EC</button>'
				}],
                // excel: {
                //     fileName: "Laporan Pengunjung Pemeriksaan.xlsx",
                //     allPages: true,
                // },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //     sheet.frozenRows = 2;

                //     sheet.mergedCells = ["A1:I1"];

                //     var myHeaders = [{
                //         value: "Laporan Rekap Data Kunjungan Rawat Jalan",
                //         fontSize: 20,
                //         textAlign: "center",
                //         background: "#ffffff",
                //         // color:"#ffffff"
                //     }];
                //     sheet.rows.splice(0, 0, {
                //         cells: myHeaders,
                //         type: "header",
                //         height: 70
                //     });
                // },
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        "field": "tglinput",
                        "title": "TANGGAL",
                        "width": "100px",
                    },
                    {
                        "title": "NILAI",
                        "columns": [
                            {
                                "field": "p4",
                                "title": "P4 <br>GADUH GELISAH",
                                "width": "50px",
                            }, {
                                "field": "p7",
                                "title": "P7 <br>PERMUSUHAN",
                                "width": "50px",
                                // template: "<span class='style-left'>{{formatTanggal('#: tgltmt #')}}</span>"
                            }, {
                                "field": "g4",
                                "title": "G4 <br>KETEGANGAN",
                                "width": "50px",
                            }, {
                                "field": "g8",
                                "title": "G8 <br>KETIDAK KOOPERATIFAN",
                                "width": "50px",
                            }, {
                                "field": "g14",
                                "title": "G14 <br> PENGENDALIAN IMPULS YANG BURUK",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: gajiakhir #', '')}}</span>"
                            }, {
                                "field": "jumlah",
                                "title": "Jumlah",
                                "width": "100px",
                                // "template": "<span class='style-right'>{{formatRupiah('#: gajibaru #', '')}}</span>"
                            }
                        ]
                    },
                    {
                        "field": "namalengkap",
                        "title": "DOKTER",
                        "width": "100px",
                    },
                    {
                        "command": [{
                                text: "Edit",
                                click: edit,
                                imageClass: "k-icon k-i-pencil"
                            },
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
            function edit(e){
                e.preventDefault();
                // e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.objectpegawaifk != medifirstService.getPegawaiLogin().id) {
                    toastr.error('Tidak bisa diubah')
                    return
                }
                console.log(dataItem);
                $scope.item.norec = dataItem.norec;
                $scope.item.p4 = dataItem.p4;
                $scope.item.p7 = dataItem.p7;
                $scope.item.g4 = dataItem.g4;
                $scope.item.g8 = dataItem.g8;
                $scope.item.g14 = dataItem.g14;
                $scope.item.jumlah = dataItem.jumlah;
                $scope.item.tglinput = moment(dataItem.tglinput).format('YYYY-MM-DD 00:00')
                $scope.item.pegawai = {
                    namalengkap: dataItem.namalengkap,
                    id: dataItem.objectpegawaifk
                }
                $scope.popUpLembarPanssEc.center().open()

            }
            function hapus(e){

                e.preventDefault();
                // e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.objectpegawaifk != medifirstService.getPegawaiLogin().id) {
						toastr.error('Tidak bisa dihapus')
                    return
                }
                var objSave = {
                    'norec_del': dataItem.norec
                }
                medifirstService.post('emr/save-lembar-panss-ec', objSave).then(function (data) {
                    $scope.isRouteLoading = false;
                    $scope.item = {}
                    FormLoad()
                    $scope.popUpLembarPanssEc.close()
                })
            }
            $scope.createPanssEc = function(){
                $scope.item.norec = "";      
                $scope.item.tglinput = moment($scope.now).format('YYYY-MM-DD 00:00')
                $scope.item.pegawai = {
                    namalengkap: medifirstService.getPegawaiLogin().namaLengkap,
                    id: medifirstService.getPegawaiLogin().id
                }                
                $scope.popUpLembarPanssEc.center().open()
            }
            $scope.simpanPanssEc = function(){
                $scope.isRouteLoading = true;
                var objSave = {
                    'norec': $scope.item.norec,
                    'p4': $scope.item.p4,
                    'p7': $scope.item.p7,
                    'g4': $scope.item.g4,
                    'g8': $scope.item.g8,
                    'g14': $scope.item.g14,
                    'jumlah': $scope.item.jumlah,
                    'objectpegawaifk': $scope.item.pegawai.id,
                    'tglinput': moment($scope.item.tglinput).format('YYYY-MM-DD'),
                    'norec_apd': $state.params.noRec
                }
                console.log(objSave);
                medifirstService.post('emr/save-lembar-panss-ec', objSave).then(function(data){
                    
                    $scope.item.obj[9187] = 'Data Masuk'
                    var arrobj = Object.keys($scope.item.obj)
                    var arrSave = []
                    for (var i = arrobj.length - 1; i >= 0; i--) {
                        if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                            $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                        // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
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
                            'Lembar Panss EC ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                            $scope.cc.noregistrasi).then(function (res) {})

                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        cacheHelper.set('cacheNomorEMR', arrStr);
                    });
                    $scope.isRouteLoading = false;
                    $scope.item = {}
                    FormLoad()
                    // $scope.save()
                    $scope.popUpLembarPanssEc.close()
                })
            }
            $scope.batalSimpanPanssEc = function(){
                $scope.item = {}
                $scope.popUpLembarPanssEc.close()
            }
            $scope.getJumlah = function(){
                var p4=0,
                    p7=0,
                    g4=0,
                    g8=0,
                    g14=0;

                if ($scope.item.p4 != undefined) {
                    p4 = $scope.item.p4
                }
                if ($scope.item.p7 != undefined) {
                    p7 = $scope.item.p7
                }
                if ($scope.item.g4 != undefined) {
                    g4 = $scope.item.g4
                }
                if ($scope.item.g8 != undefined) {
                    g8 = $scope.item.g8
                }
                if ($scope.item.g14 != undefined) {
                    g14 = $scope.item.g14
                }
                $scope.item.jumlah = p4+p7+g4+g8+g14
            }
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
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
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.tglLahir = chacePeriode[18]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                // $scope.item.obj2 = []
                // $scope.item.obj[116062] = $scope.now
                // $scope.item.obj[116068] = {
                //     text: $scope.cc.namaruangan,
                //     value: $scope.cc.objectruanganfk
                // }

                // $scope.item.obj[116201] = true
                // $scope.item.obj[116204] = true
                // $scope.item.obj[116207] = true
                // $scope.item.obj[116210] = true
                // $scope.item.obj[116213] = true
                // $scope.item.obj[116216] = true
                // $scope.item.obj[116219] = true
                // $scope.item.obj[116222] = true

                // $scope.item.obj[111056]=$scope.now
                // $scope.item.obj[14563]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                dataLoad = dat.data.data
                // medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=4241&objectidakhir=4246&idemr=147", true).then(function (datas) {
                //     if (datas.data.data.length>0){
                //         if ($scope.item.obj[111061]== undefined) {
                //             $scope.item.obj[111061]=datas.data.data[0].value
                //         }
                //         if ($scope.item.obj[111062]== undefined) {
                //             $scope.item.obj[111062]=datas.data.data[3].value
                //         }
                //         if ($scope.item.obj[111063]==undefined) {
                //             $scope.item.obj[111063]=datas.data.data[4].value
                //         }
                //         if ($scope.item.obj[111064]==undefined) {
                //             $scope.item.obj[111064]=datas.data.data[5].value
                //         }

                //     }
                // })
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 14464 && dataLoad[i].emrdfk <= 14469 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 14424 && dataLoad[i].emrdfk <= 14431 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorGizi(datass)
                            // }


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
                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if (str != undefined) {
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = {
                                    value: res[0],
                                    text: res[1]
                                }
                            }

                        }
                        // pegawaiInputDetail = dataLoad[i].pegawaifk
                    }

                }
                // if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         // toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         // return
                //     }
                // }

            })
            $scope.Save = function () {
                
            }
            //** BATAS */
        }
    ]);
});