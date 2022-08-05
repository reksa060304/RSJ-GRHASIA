define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('PanssEcTableCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglinput = moment($scope.now).format('YYYY-MM-DD 00:00')
            
            loadCombo()
            FormLoad()
            
            
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
                    $scope.isRouteLoading = false;
                    $scope.item = {}
                    FormLoad()
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
            //** BATAS */
        }
    ]);
});