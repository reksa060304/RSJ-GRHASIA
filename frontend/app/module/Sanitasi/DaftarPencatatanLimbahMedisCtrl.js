define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPencatatanLimbahMedisCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.itemInput = {};
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.norecTransaksi = '';
            $scope.Transaksi = undefined;
            LoadCache();
            loadCombo();

            function LoadCache() {
                $scope.item.tglPelayanan = new moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.item.periodeAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.periodeAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');               
            }

            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                    $scope.listdataRekanan = data;
                });

                medifirstService.get("sanitasi/get-combo-sanitasi").then(function (data) {
                    var dataCombo = data.data;
                    $scope.listdataRuangan = dataCombo.rawatsanitasi
                });
            }

            function dataPL (){
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var Rekananid = ''
                if ($scope.item.dataRekanan != undefined) {
                    Rekananid = "&Rekananid=" + $scope.item.dataRekanan.id;
                }
                medifirstService.get("sanitasi/get-data-pengangkutan-limbah?" 
                + "tglAwal=" + tglAwal 
                + "&tglAkhir=" + tglAkhir + Rekananid).then(function (d) {
                    $scope.isRouteLoading = false;
                    var data = d.data.data
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = i + 1;
                    }
                    $scope.dataPengankutanLimbah = new kendo.data.DataSource({
						data: data,
						pageSize: 10,
						total: data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
                });
            }

            $scope.SearchDataPL = function () {
                dataPL ()
            }

            $scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return ''
				else
					return moment(tanggal).format('DD-MMM-YYYY');
			}

            $scope.optionPengankutanLimbah = {
                toolbar: [
                    {
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="addDataPl()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'

                    },
                    "excel",
                ],
                excel: {
                    fileName: "DataPengakutanLimbahMedis.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "User";

                    var myHeaders = [{
                        value: "Daftar Pengangkutan Limbah Medis",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "PT Pengangkut",
                        "width": "150px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "title": "Jumlah Limbah (KG)",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jmlpadat",
                                title: "Padat",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jmltajam",
                                title: "Tajam",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            }
                        ]

                    },
                ],
            };

            function dataPPAL (){
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');                
                medifirstService.get("sanitasi/get-data-pencatatan-air-limbah?" 
                + "tglAwal=" + tglAwal 
                + "&tglAkhir=" + tglAkhir).then(function (d) {
                    $scope.isRouteLoading = false;
                    var data = d.data.data
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = i + 1;
                    }
                    $scope.dataPPAL = new kendo.data.DataSource({
						data: data,
						pageSize: 10,
						total: data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
                });
            }

            $scope.SearchDataPPAL = function(){
                dataPPAL ();
            }

            $scope.optionPPAL = {
                toolbar: [
                    {
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="addDataPPAL()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'

                    },
                    "excel",
                ],
                excel: {
                    fileName: "DataPencatatanPengelolaanAirLimbah.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "User";

                    var myHeaders = [{
                        value: "Daftar Pencatatan Pengelolaan Air Limbah",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "title": "Pemeriksaan Parameter",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "flowmeterinlet",
                                title: "Flow Meter Inlet",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "debetharianinlet",
                                title: "Debet Harian Inlet",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "flowmeteroutlet",
                                title: "Flow Meter Outlet",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "debetharianoutlet",
                                title: "Debet Harian Outlet",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "phbakumutu",
                                title: "Ph (Baku Mutu 6-9)",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "temperaturbakumutu",
                                title: "Temperatur (Baku Mutu 30)",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            }
                        ]

                    },
                ],
            };

            function dataPDAB (){
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var Ruanganid = ''
                if ($scope.item.dataRuangan != undefined) {
                    Ruanganid = "&Ruanganid=" + $scope.item.dataRuangan.id;
                }             
                medifirstService.get("sanitasi/get-data-pencatatan-air-bersih?" 
                + "tglAwal=" + tglAwal 
                + "&tglAkhir=" + tglAkhir + Ruanganid).then(function (d) {
                    $scope.isRouteLoading = false;
                    var data = d.data.data
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = i + 1;
                    }
                    $scope.dataPDAB = new kendo.data.DataSource({
						data: data,
						pageSize: 10,
						total: data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
                });
            }

            $scope.SearchDataPDAB = function(){
                dataPDAB ();
            }

            $scope.optionPDAB = {
                toolbar: [
                    {
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="addDataPDAB()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'

                    },
                    "excel",
                ],
                excel: {
                    fileName: "DataPencatatanDebitAirBersih.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "User";
                    var myHeaders = [{
                        value: "Daftar Pencatatan Debit Air Bersih",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ground",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "title": "Pemeriksaan Parameter Debet (M)",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jmlflowmeter",
                                title: "Jumlah Yang Tertera Pada Flowmeter",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jmlperhari",
                                title: "Jumlah Pemakaian Per Hari",
                                width: "120px",
                                headerAttributes: { style: "text-align : center" }
                            },                            
                        ]

                    },
                ],
            };

            $scope.klPL = function (selectPL) {
                if (selectPL != undefined) {
                    $scope.selectPL = selectPL;
                    $scope.norecTransaksi = selectPL.norec;
                }
            }

            $scope.klPPAL = function (selectPPAL) {
                if (selectPPAL != undefined) {
                    $scope.selectPPAL = selectPPAL;
                    $scope.norecTransaksi = selectPPAL.norec;
                }
            }

            $scope.klPDAB = function (selectPDAB) {
                if (selectPDAB != undefined) {
                    $scope.selectPDAB = selectPDAB;
                    $scope.norecTransaksi = selectPDAB.norec;
                }
            }

            function KosongkanData() {
                $scope.norecTransaksi = '';
                // $scope.Transaksi = undefined;
                $scope.item.tglPelayanan = new moment($scope.now).format('YYYY-MM-DD HH:mm');
                $scope.itemInput = {};
            }

            $scope.customClicked = function () {
                KosongkanData()
                $scope.dialogPopup.close();
            }

            $scope.batalPermohonan = function () {
                KosongkanData()
            }

            $scope.addDataPl = function () {
                $scope.PengkangkutLimbah = true;
                $scope.PengelolaanAirLimbah = false;
                $scope.PengelolaanAirBersih = false;
                $scope.Transaksi = "Pengangkutan Limbah"
                $scope.dialogPopup.center().open();
            }

            $scope.editPl = function(){
                if ($scope.selectPL == undefined) {
                    toastr.error("Data Belum Dipilih !!!");
                    return;
                }

                $scope.norecTransaksi = $scope.selectPL.norec;
                $scope.Transaksi = $scope.selectPL.jenispelayanan;
                $scope.item.tglPelayanan = moment($scope.selectPL.tanggal).format('YYYY-MM-DD HH:mm');
                $scope.itemInput.dataRekanan  = {id:$scope.selectPL.rekananfk, namarekanan:$scope.selectPL.namarekanan};    
                $scope.itemInput.jmlLimbahPadat = $scope.selectPL.jmlpadat;
                $scope.itemInput.jmlLimbahTajam = $scope.selectPL.jmltajam;
                $scope.PengkangkutLimbah = true;
                $scope.PengelolaanAirLimbah = false;
                $scope.PengelolaanAirBersih = false;
                $scope.dialogPopup.center().open();
            }

            $scope.addDataPPAL = function () {
                
                $scope.PengkangkutLimbah = false;
                $scope.PengelolaanAirLimbah = true;
                $scope.PengelolaanAirBersih = false;
                $scope.Transaksi = "Pencatatan Pengelolaan Air Limbah"
                $scope.dialogPopup.center().open();
            }

            $scope.editPPAL = function(){
                if ($scope.selectPPAL == undefined) {
                    toastr.error("Data Belum Dipilih !!!");
                    return;
                }
                $scope.norecTransaksi = $scope.selectPPAL.norec;
                $scope.Transaksi = $scope.selectPPAL.jenispelayanan;
                $scope.item.tglPelayanan = moment($scope.selectPPAL.tanggal).format('YYYY-MM-DD HH:mm');                   
                $scope.itemInput.flowMeterInlet = $scope.selectPPAL.flowmeterinlet
                $scope.itemInput.flowMeterOutlet = $scope.selectPPAL.flowmeteroutlet
                $scope.itemInput.DebetHarianInlet = $scope.selectPPAL.debetharianinlet
                $scope.itemInput.DebetHarianOutlet = $scope.selectPPAL.debetharianoutlet
                $scope.itemInput.jmlPh = $scope.selectPPAL.phbakumutu
                $scope.itemInput.JmlTemperature = $scope.selectPPAL.temperaturbakumutu
                $scope.PengkangkutLimbah = false;
                $scope.PengelolaanAirLimbah = true;
                $scope.PengelolaanAirBersih = false;                
                $scope.dialogPopup.center().open();
            }            

            $scope.addDataPDAB = function () {
                $scope.PengkangkutLimbah = false;
                $scope.PengelolaanAirLimbah = false;
                $scope.PengelolaanAirBersih = true;
                $scope.Transaksi = "Pencatatan Debit Air Bersih"
                $scope.dialogPopup.center().open();
            }

            $scope.editPDAB = function(){
                if ($scope.selectPDAB == undefined) {
                    toastr.error("Data Belum Dipilih !!!");
                    return;
                }
                $scope.norecTransaksi = $scope.selectPDAB.norec;
                $scope.Transaksi = $scope.selectPDAB.jenispelayanan;
                $scope.item.tglPelayanan = moment($scope.selectPDAB.tanggal).format('YYYY-MM-DD HH:mm'); 
                $scope.itemInput.JumlahYangTerteraPadaFlowMeter = $scope.selectPDAB.jmlflowmeter;
                $scope.itemInput.JumlahPemakaianPerHari = $scope.selectPDAB.jmlperhari;   
                $scope.itemInput.dataRuangan  = {id:$scope.selectPDAB.ruanganfk, namaruangan:$scope.selectPDAB.namaruangan};               
                $scope.PengkangkutLimbah = false;
                $scope.PengelolaanAirLimbah = false;
                $scope.PengelolaanAirBersih = true;               
                $scope.dialogPopup.center().open();
            }

            $scope.hapusPermohonan = function () {
                if ($scope.norecTransaksi == undefined || $scope.norecTransaksi == '') {
                    toastr.error("Data Belum Dipilih !!!")
                    return;
                }

                var objSave = {
                    norec : $scope.norecTransaksi
                }

                medifirstService.post('sanitasi/hapus-pelayananlimbah-sanitasi', objSave).then(function (e) {
                    dataPL ();
                    dataPPAL ();
                    dataPDAB ();
                    KosongkanData();
                    $scope.dialogPopup.close();                    
                })
            }

            $scope.savePermohonan = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.Transaksi == undefined) {
                    toastr.error("Jenis Transaksi Masih Kosong !!!")
                    return;
                }

                if ($scope.item.tglPelayanan == undefined || $scope.tglPelayanan == 'Invalide Date') {
                    toastr.error("Tanggal Masih Kosong Masih Kosong !!!")
                    return;
                }

                var objSave = {
                    'norec': $scope.norecTransaksi,
                    'pegawaifk': user.id,
                    'jenispelayanan': $scope.Transaksi,
                    'tanggal': moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                    'rekananfk': $scope.itemInput.dataRekanan != undefined ? $scope.itemInput.dataRekanan.id : null,
                    'ruanganfk': $scope.itemInput.dataRuangan != undefined ? $scope.itemInput.dataRuangan.id : null,
                    'jmlpadat': $scope.itemInput.jmlLimbahPadat != undefined ? parseFloat($scope.itemInput.jmlLimbahPadat) : null,
                    'jmltajam': $scope.itemInput.jmlLimbahTajam != undefined ? parseFloat($scope.itemInput.jmlLimbahTajam) : null,
                    'flowmeterinlet': $scope.itemInput.flowMeterInlet != undefined ? parseFloat($scope.itemInput.flowMeterInlet) : null,
                    'flowmeteroutlet': $scope.itemInput.flowMeterOutlet != undefined ? parseFloat($scope.itemInput.flowMeterOutlet) : null,
                    'debetharianinlet': $scope.itemInput.DebetHarianInlet != undefined ? parseFloat($scope.itemInput.DebetHarianInlet) : null,
                    'debetharianoutlet': $scope.itemInput.DebetHarianOutlet != undefined ? parseFloat($scope.itemInput.DebetHarianOutlet) : null,
                    'phbakumutu': $scope.itemInput.jmlPh != undefined ? parseFloat($scope.itemInput.jmlPh) : null,
                    'temperaturbakumutu': $scope.itemInput.JmlTemperature != undefined ? parseFloat($scope.itemInput.JmlTemperature) : null,
                    'jmlflowmeter': $scope.itemInput.JumlahYangTerteraPadaFlowMeter != undefined ? parseFloat($scope.itemInput.JumlahYangTerteraPadaFlowMeter) : null,
                    'jmlperhari': $scope.itemInput.JumlahPemakaianPerHari != undefined ? parseFloat($scope.itemInput.JumlahPemakaianPerHari) : null,
                }

                medifirstService.post('sanitasi/save-pengelolaan-limbah', objSave).then(function (e) {
                    dataPL ();
                    dataPPAL ();
                    dataPDAB ();
                    KosongkanData();
                    $scope.dialogPopup.close();                    
                })
            }

            //***********************************
        }
    ]);
});
