define(['initialize', 'Configuration'], function (initialize, configuration) {
	'use strict';
    var baseTransaksi = configuration.baseApiBackend;
	initialize.controller('BKUBendaharaPenerimaanV2Ctrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.isRouteLoading = false;
			var sourceDataGrid = [];
			$scope.dataLogin = medifirstService.getPegawaiLogin();
			$scope.item.tglAwal = new Date();
			$scope.item.tglbku = new Date();
			$scope.item.tglAkhir = new Date();
			$scope.kas = {}
			$scope.bank = {}
			$scope.lampiran = {}
			$scope.kas.periode = new Date()
			// $scope.dataGridSPM = [];
			// $scope.dataGridSTS = [];	
			$scope.dataSelected = {};
			$scope.hidespm = true;
			$scope.hidests = true;
            $scope.hidePengembalianPembayaran = true;
			$scope.isBendaharaPenerimaan = false;
			$scope.isBendaharaPengeluaran = false;
			loadCombo();
			showButton();
			loadData()

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.bulanOption = {
                start: "year",
                depth: "year"
            }


			function showButton() {
				$scope.showBtnTerima = true;
				$scope.showBtnDetail = true;
			};

			function loadCombo() {			
				$scope.listRuangan = medifirstService.getMapLoginUserToRuangan();	
				$scope.item.ruangan = $scope.listRuangan[0].namaruangan
				$scope.listKdPerkiraan = [{ "id": 1, "name": "41112100000000" }, { "id": 2, "name": "4111001" }];
				medifirstService.get('bendaharapenerimaan/get-data-combo-v2').then(function (dat) {
					var dataCombo = dat.data;
					// $scope.listNamaBank = dataCombo.listbank;
					// $scope.listCaraBayar = dataCombo.carabayar;
					// $scope.listnamaBankTransfer = dataCombo.listbankaccount;
					$scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.listTahapKegiatan = dataCombo.tahap;
				});
			};

			function loadData() {
				var tglAwal1 = dateHelper.formatDate($scope.item.tglAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tglAkhir, "YYYY-MM-DD");

				if ($scope.item.kelompokTransaksi != undefined) {
					var jt = $scope.item.kelompokTransaksi.id
				};
				if ($scope.item.noRekening != undefined) {
					var nr = $scope.item.noRekening.nama
				};
				var uraian = ""
				if ($scope.item.uraian != undefined) {
					uraian = $scope.item.uraian
				}
				var keterangan = ""
				if ($scope.item.keterangan != undefined) {
					keterangan = $scope.item.keterangan
				}
				var nosts = ""
				if ($scope.item.nosts != undefined) {
					nosts = $scope.item.nosts
				}
				var nospm = ""
				if ($scope.item.nospm != undefined) {
					nospm = $scope.item.nospm
				}
				$scope.isRouteLoading = true;
				$scope.saldoAkhirRev = 0
				medifirstService.get('bendaharapenerimaan/get-daftar-bkupenerimaan' 
                    + '?tglAwal=' + tglAwal1 + "&tglAkhir=" +
                    tglAkhir1 
                    + "&jenisbukti=" + jt
                    + "&noRekening=" + nr 					
                    + "&uraian=" + uraian
                    + "&keterangan=" + keterangan
                    + "&nosts=" + nosts
			        ).then(function (response) {
                        $scope.isRouteLoading = false;
                        // $scope.saldoLama = response.data.saldolama
                        // $scope.saldoAkhir = response.data.saldoAkhir
                        // $scope.saldoAkhirRev = $scope.formatRupiah($scope.saldoAkhir,'Rp. ');

                        if(response.data?.length > 0){
                            for (var i = 0; i < response.data.length; i++) {
                                response.data[i].no = i + 1
                                response.data[i].nontunai = parseFloat(response.data[i].nontunai)
                                // if (data.data.data[i].penyetor != null)
                                // 	data.data.data[i].kettransaksi = 'a.n ' + data.data.data[i].penyetor
                            }
                        }

                        
                        $scope.dataSource = {
                            data: response.data,
                            _data: response.data,
                            pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: response.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        totalpenerimaan: { type: "number" },
                                        totalpengeluaran: { type: "number" },
                                        saldo: { type: "number" },

                                    }
                                }
                            },
                            aggregate: [

                                { field: 'nontunai', aggregate: 'sum' },
                                { field: 'totalpenerimaan', aggregate: 'sum' },
                                { field: 'totalpengeluaran', aggregate: 'sum' },
                                { field: 'saldo', aggregate: 'sum' },
                            ]
                        };
				});
			};

			function removeRow(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);

				var stt = 'false'
				if (confirm('Hapus data? ')) {
					var itemDelete = {
						"norec": dataItem.norec
					}
					medifirstService.post('bendaharapenerimaan/hapus-bkuV2',itemDelete).then(function (e) {
						if (e.status === 201) {
							loadData();
							// grid.removeRow(row);
						}
					})
				} else {
					// Do nothing!
					stt = 'false'
				}
			}

			$scope.SearchData = function () {
				loadData();
			};

			$scope.$watch('item.caraBayar', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.caraBayarNonTunai = false
					if ($scope.item.caraBayar.caraBayar != "TUNAI") {
						$scope.caraBayarNonTunai = true
					}
				}
			});

			$scope.$watch('item.jumlah', function (newValue, oldValue) {
				if ($scope.item.jumlah !== undefined && $scope.item.jumlah !== null && $scope.item.jumlah !== '') {
				    medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(function (dat) {
					    $scope.item.terbilang = dat.data.terbilang;
					})
				}
			});

			$scope.Terima = function () {
				kosongkan()
				$scope.txtDisable = false
				$scope.penerimaan = true
				$scope.popUpPenerimaan.center().open();
				// Get current actions
				var actions = $scope.popUpPenerimaan.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popUpPenerimaan.setOptions({ actions: actions });
				loadComboPopup()
			};

			$scope.Pengeluaran = function () {
				kosongkan()
				$scope.penerimaan = false
				$scope.txtDisable = false
				$scope.popUpPengeluaran.center().open();
				// Get current actions
				var actions = $scope.popUpPengeluaran.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popUpPengeluaran.setOptions({ actions: actions });
				loadComboPopup()
			};

			$scope.batalPenerimaan = function () {
				kosongkan()
				$scope.popUpPengeluaran.close();
				$scope.popUpPenerimaan.close();
                $scope.penerimaan = false
                $scope.hidespm = true
                $scope.hidests = true
			}

			function loadComboPopup() {
				
				medifirstService.get("bendaharapenerimaan/get-jenis-bukti-bku").then(function (response) {
                    let jenisbukti = []
                    
                    if($scope.penerimaan == true){
                        jenisbukti = response.data.filter(item => item.jenisbukti == 'Surat Tanda Setoran')
                    }else{
                        jenisbukti = response.data.filter(item => item.jenisbukti !== 'Surat Tanda Setoran')
                    }

                    $scope.listJenisBukti = jenisbukti


					// console.log("listJenisBukti:", $scope.listJenisBukti); 
					// console.log("isbendahrapenerimaan:", $scope.isBendaharaPenerimaan); 
					// console.log("isbendahrapengeluaran:", $scope.isBendaharaPengeluaran); 
				});
				
				
				// var ket = ""
				// if ($scope.item.ruangan == "Bendahara Penerimaan") {
				// 	if ($scope.penerimaan == true) {
				// 		ket = "Penerimaan BP"
				// 		medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
				// 			+ ket)
				// 			.then(function (dat) {
				// 				$scope.listJenisTransaksi = dat.data.kelompoktransaksi;
				// 				$scope.listMataAnggaran = dat.data.mataanggaran;
	
				// 			});
				// 	} else {
				// 		ket = "Pengeluaran BP"
				// 		medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
				// 			+ ket)
				// 			.then(function (data) {
				// 				$scope.listJenisTransaksi = data.data.kelompoktransaksi;
				// 				$scope.listMataAnggaran = data.data.mataanggaran;
				// 			});
				// 	}
				// }else{
				// 	if ($scope.penerimaan == true) {
				// 		ket = "Penerimaan BK"
				// 		medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
				// 			+ ket)
				// 			.then(function (dat) {
				// 				$scope.listJenisTransaksi = dat.data.kelompoktransaksi;
				// 				$scope.listMataAnggaran = dat.data.mataanggaran;
	
				// 			});
				// 	} else {
				// 		ket = "Pengeluaran BK"
				// 		medifirstService.get("bendaharapenerimaan/get-data-combo?keterangan="
				// 			+ ket)
				// 			.then(function (data) {
				// 				$scope.listJenisTransaksi = data.data.kelompoktransaksi;
				// 				$scope.listMataAnggaran = data.data.mataanggaran;
				// 			});
				// 	}
				// }
				
			}

			function kosongkan() {
				// $scope.item.tglbku ='';
				$scope.item.keterangan = '';
				$scope.item.ketTransaksi = '';
				$scope.item.kdPerkiraan = '';
				$scope.item.noSTS = '';
				$scope.item.noSPM = '';
				$scope.item.listAsalProduk = '';
				$scope.item.uraian = null;
				$scope.item.jumlah = null;
				$scope.item.jenisTransaksi = undefined;
				$scope.item.terbilang = '';
                $scope.item.itemJenisBukti = null;
                $scope.item.idpendapatan = null;
                $scope.dataSelectedsts = null;
                $scope.dataSelectedspm = null;
                $scope.item.asalProduk = null;
                $scope.norecPengembalianPembayaran = null

			}

			$scope.Detail = function () {
				$scope.txtDisable = false
				// $scope.showBtnSimpan = true
				$scope.showJenisTransaksi1 = true
				$scope.showJenisTransaksi2 = false
				$scope.showCaraBayar1 = true
				$scope.showCaraBayar2 = false
				$scope.showNamaBank1 = true
				$scope.showNamaBank2 = false
				loadComboPopup()
				$scope.listJenisTransaksi = ([{ id: $scope.dataSelected.idJenisTransaksi, kelompokTransaksi: $scope.dataSelected.jenisTransaksi }])

				$scope.item.keterangan = $scope.dataSelected.keterangan
				$scope.item.jumlah = $scope.dataSelected.totalSetor
				$scope.item.jenisTransaksi = { id: $scope.dataSelected.idJenisTransaksi, kelompokTransaksi: $scope.dataSelected.jenisTransaksi }
				$scope.popUpPenerimaan.center().open();

			};

            let dataAwalSTS = []
            let dataAwalSPM = []
		    $scope.$watch('item.itemJenisBukti', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    // untuk SPM
                    if($scope.item.itemJenisBukti.id == 1){
                        $scope.hidespm = false
                        $scope.hidests = true
                        medifirstService.get("bendaharapenerimaan/get-spm").then(function (e) {
                            
                            dataAwalSPM = e.data

                            $scope.dataGridSPM = new kendo.data.DataSource({
                                data:  e.data,
                                pageSize: 10,
                                total: e.data.length,
                                group: $scope.group,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                },
                                aggregate: [
                                ]
                            });
                        });

                    } 

                    // untuk STS
                    if($scope.item.itemJenisBukti.id == 6){
                        $scope.hidespm = true
                        $scope.hidests = false
                        medifirstService.get("bendaharapenerimaan/get-sts-keuangan").then(function (res) {
                            
                            
                            let data = res.data
                            dataAwalSTS = data

                            $scope.dataGridSTS = new kendo.data.DataSource({
                                data:  data,
                                pageSize: 10,
                                total: data.length,
                                group: $scope.group,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                },
                                aggregate: [
                                ]
                            });
                        });
                    }
                    
                    // untuk pengembalian pembayaran
                    if($scope.item.itemJenisBukti.id == 10){
                        $scope.hidespm = true
                        $scope.hidests = true
                        medifirstService.get("bendaharapenerimaan/get-bku-pengembalian-pembayaran").then(function (e) {
                            
                            let dataPengembalianPembayaran = e.data

                            $scope.dataGridPengembalianPembayaran = new kendo.data.DataSource({
                                data:  dataPengembalianPembayaran,
                                pageSize: 10,
                                total: dataPengembalianPembayaran.length,
                                group: $scope.group,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                },
                                aggregate: [
                                ]
                            });
                        });
                    }
                }
            });

			$scope.klikGridsts = function (data) {
				// console.log(data)

				$scope.item.noSTS = data.nosts
				$scope.item.uraian = data.keterangan
				$scope.item.jumlah = data.totalsetoran
                $scope.item.idpendapatan = data.idakunpendapatan
                // console.log($scope.dataGridSTS)
                // console.log($scope.dataSelectedsts)
			}

			$scope.klikGridspm = function (data) {
				// console.log(data)

				$scope.item.asalProduk = {id: data.idasalproduk, asalproduk: data.asalproduk}
				$scope.item.noSPM = data.nospm
				$scope.item.uraian = data.untukpengeluaran
				$scope.item.jumlah = data.nilaispm

                // console.log($scope.dataSelectedspm)

			}

            $scope.klikGridPengembalianPembayaran = function (data){
                $scope.item.uraian = data.keterangan
				$scope.item.jumlah = data.jumlah
                $scope.norecPengembalianPembayaran = data.norec
            }

            $scope.SavePenerimaan = function () {

                // validasi
                if($scope.dataSelectedsts == undefined){
                    toastr.error('Pilih data dulu')
                    return
                }
				if ($scope.item.jumlah == "") {
					toastr.error("Jumlah belum diisi!");
					return;
				}
				if ($scope.item.itemJenisBukti== undefined) {
					toastr.error("Keompok Transaksi belum di pilih!");
					return;
				}
                if ($scope.item.uraian == undefined && $scope.item.uraian == null){
                    toastr.error("Urian harus diisi")
                    return;
                }
                if ($scope.item.asalProduk == undefined && $scope.item.asalProduk == null){
                    toastr.error("Sumber dana harus diisi")
                    return;
                }
				

				var dataObjPost = {};

				dataObjPost = {					
					uraian: $scope.item.uraian,
					tglbku: moment($scope.item.tglbku).format('YYYY-MM-DD HH:mm'),
					nosts: $scope.item.noSTS,
                    norecSTS: $scope.dataSelectedsts.norec,
					totalpenerimaan: $scope.item.jumlah,
                    akunpendapatan: $scope.item.idpendapatan,					
					ispenerimaan: true,	
                    asalproduk: $scope.item.asalProduk.id				
				}

				if ($scope.isBendaharaPengeluaran) {
					dataObjPost.totalpengeluaran = dataObjPost.totalpenerimaan;
					dataObjPost.totalpenerimaan = null;
				}else if ($scope.isBendaharaPenerimaan) {
					dataObjPost.totalPenerimaan = dataObjPost.totalpengeluaran;
					dataObjPost.totalpengeluaran = null;
				}

				medifirstService.post('bendaharapenerimaan/simpan-bkupenerimaanv2', dataObjPost)
                    .then(function (e) {
					    kosongkan();
					    loadData()
                        $scope.popUpPenerimaan.close()

                        // reset data sts
                        $scope.dataGridSTS = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

				    })
			}

            $scope.SavePengeluaran = function() {
                
                // validasi
                if($scope.item.itemJenisBukti.jenisbukti == 'SPM' && $scope.dataSelectedspm == undefined && $scope.dataSelectedspm == null){
                    toastr.error('Pilih data SPM dulu')
                    return
                }
                if($scope.item.itemJenisBukti.jenisbukti == 'Pengembalian Pembayaran' && ($scope.norecPengembalianPembayaran == undefined || $scope.norecPengembalianPembayaran == null)){
                    toastr.error('Pilih data pengembalian pembayaran dulu')
                    return
                }
                if ($scope.item.tglbku == undefined && $scope.item.tglbku == null) {
                    toastr.error("Tanggal bku harus diisi!");
                    return;
                }
                if ($scope.item.itemJenisBukti == undefined) {
                    toastr.error("Keompok Transaksi belum di pilih!");
                    return;
                }
                if ($scope.item.jumlah == "") {
					toastr.error("Jumlah belum diisi!");
					return;
				}
                if ($scope.item.uraian == undefined && $scope.item.uraian == null){
                    toastr.error("Isi uraian dulu")
                    return
                }
                if ($scope.item.itemJenisBukti.jenisbukti == 'SPM' && $scope.item.asalProduk == undefined && $scope.item.asalProduk == null){
                    toastr.error("Sumber dana harus diisi")
                    return;
                }
				

				var dataPengeluaran = {};

				dataPengeluaran = {					
					uraian: $scope.item.uraian,
					tglbku: moment($scope.item.tglbku).format('YYYY-MM-DD HH:mm'),
					nospm: $scope.item.noSPM,
                    norecSPM: $scope.dataSelectedspm ? $scope.dataSelectedspm.norec : null,
					totalpengeluaran: $scope.item.jumlah,
					ispenerimaan: false,
                    asalproduk: $scope.item.asalProduk ? $scope.item.asalProduk.id : null,
                    norecPengembalianPembayaran: $scope.norecPengembalianPembayaran		
				}

				// if ($scope.isBendaharaPengeluaran) {
				// 	dataObjPost.totalpengeluaran = dataObjPost.totalpenerimaan;
				// 	dataObjPost.totalpenerimaan = null;
				// }else if ($scope.isBendaharaPenerimaan) {
				// 	dataObjPost.totalPenerimaan = dataObjPost.totalpengeluaran;
				// 	dataObjPost.totalpengeluaran = null;
				// }

				medifirstService.post('bendaharapenerimaan/simpan-bkupenerimaanv2', dataPengeluaran)
                    .then(function (e) {
					    kosongkan();
					    loadData()
                        $scope.popUpPengeluaran.close()

                        // reset data spm
                        $scope.dataGridSPM = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

                        // reset data pengembalian pembayaran
                        $scope.dataGridPengembalianPembayaran = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

				    })
            }

            $scope.handlePopUpCetak = function() {

                $scope.popUpCetak.center().open()

            }

            $scope.cetakLaporan = function(){

                // validasi
                if($scope.item.tglbkucetak == undefined && $scope.item.tglbkucetak == null){
                    toastr.error('Pilih tanggal bku dulu')
                    return
                }

                if($scope.item.tglcetak == undefined && $scope.item.tglcetak == null){
                    toastr.error('Pilih tanggal cetak dulu')
                    return
                }

                window.open(baseTransaksi + "report/cetak-bkupenerimaanv2" 
                    + "?tglbku=" + moment($scope.item.tglbkucetak).format('YYYY-MM-DD')
                    + "&tglcetak=" + moment($scope.item.tglcetak).format('YYYY-MM-DD'), '_blank')
            }

            $scope.batalCetak = function(){

                $scope.item.tglbkucetak = null
                $scope.item.tglcetak = null

                $scope.popUpCetak.close()

            }

            $scope.handlePopUpCetakSPJ = function() {

                $scope.popUpCetakSPJ.center().open()

            }

            $scope.cetakSPJ = function(){

                // validasi
                if($scope.item.tahapawal == undefined && $scope.item.tahapawal == null){
                    toastr.error('Pilih tahap awal dulu')
                    return
                }

                if($scope.item.tahapakhir == undefined && $scope.item.tahapakhir == null){
                    toastr.error('Pilih tahap akhir dulu')
                    return
                }

                if($scope.item.tglspj == undefined && $scope.item.tglspj == null){
                    toastr.error('Pilih tanggal bku dulu')
                    return
                }

                if($scope.item.tglcetakspj == undefined && $scope.item.tglcetakspj == null){
                    toastr.error('Pilih tanggal cetak dulu')
                    return
                }

                window.open(baseTransaksi + "report/cetak-spjbpv2" 
                    + "?tglbku=" + moment($scope.item.tglspj).format('YYYY-MM-DD')
                    + "&tglcetak=" + moment($scope.item.tglcetakspj).format('YYYY-MM-DD')
                    + "&tahapawal=" + $scope.item.tahapawal.id
                    + "&tahapakhir=" + $scope.item.tahapakhir.id, '_blank')

            }

            $scope.batalCetakSPJ = function(){

                $scope.item.tahapawal = null
                $scope.item.tahapakhir = null
                $scope.item.tglspj = null
                $scope.item.tglcetakspj = null

                $scope.popUpCetakSPJ.close()

            }


            $scope.formatRupiah = function (value, currency) {
				if (value == "undefined" || value == "null") {
					value = 0;
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				} else {
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				}
			};
            
            // cari sts
            $scope.$watch('item.cariSTS', function(newValue, oldValue){
                // console.log($scope.item.cariSTS)
                // console.log($scope.item.cariSTS == '')
                if($scope.item.cariSTS && $scope.item.cariSTS !== ''){
                    
                    let dataHasilCariSTS = []
                    
                    for (let index = 0; index < $scope.dataGridSTS.options.data.length; index++) {
                        let element = $scope.dataGridSTS.options.data[index];

                        if (element.nosts.toLowerCase().includes($scope.item.cariSTS) ) {
                            dataHasilCariSTS.push(element)
                        }else if (element.keterangan.toLowerCase().includes($scope.item.cariSTS)) {
                            dataHasilCariSTS.push(element)
                        }else if(element.totalsetoran.toString().includes($scope.item.cariSTS)){
                            dataHasilCariSTS.push(element)
                        }else if(element.textrekening.includes($scope.item.cariSTS)){
                            dataHasilCariSTS.push(element)
                        }
                    }

                    $scope.dataGridSTS = new kendo.data.DataSource({
                        data:  dataHasilCariSTS,
                        pageSize: 10,
                        total: dataHasilCariSTS.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });

                }

                // jika cari kosong
                if($scope.item.cariSTS == ''){
                    
                    $scope.dataGridSTS = new kendo.data.DataSource({
                        data:  dataAwalSTS,
                        pageSize: 10,
                        total: dataAwalSTS.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                }
            })

            $scope.$watch('item.cariSPM', function(newValue, oldValue){
                
                if($scope.item.cariSPM && $scope.item.cariSPM !== ''){
                    
                    let dataHasilCariSPM = []
                    
                    for (let index = 0; index < $scope.dataGridSPM.options.data.length; index++) {
                        let element = $scope.dataGridSPM.options.data[index];

                        if (element.nospm.toLowerCase().includes($scope.item.cariSPM) ) {
                            dataHasilCariSPM.push(element)
                        }else if (element.untukpengeluaran.toLowerCase().includes($scope.item.cariSPM)) {
                            dataHasilCariSPM.push(element)
                        }else if(element.nilaispm.toString().includes($scope.item.cariSPM)){
                            dataHasilCariSPM.push(element)
                        }
                    }

                    $scope.dataGridSPM = new kendo.data.DataSource({
                        data: dataHasilCariSPM,
                        pageSize: 10,
                        total: dataHasilCariSPM.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });

                }

                // jika cari kosong
                if($scope.item.cariSPM == ''){
                    
                    $scope.dataGridSPM = new kendo.data.DataSource({
                        data:  dataAwalSPM,
                        pageSize: 10,
                        total: dataAwalSPM.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                }
            })

            $scope.columnGrid = {
				toolbar: [
					"excel",
					// {
					// 	name: "penerimaan", text: "Penerimaan",
					// 	template: '<button ng-click="Terima()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Penerimaan</button>'
					// },
					{
						name: "pengeluaran", text: "Pengeluaran",
						template: '<button ng-click="Pengeluaran()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-cancel"></span>Pengeluaran</button>'
					},
					{
						name: "saldoLama", text: "Saldo Lama",
						template: '<button ng-click="" class="k-button k-button-icontext k-grid-upload">Saldo Awal : {{formatRupiah(saldoLama,"Rp. ")}}</button>'
					},
				],
				excel: {
					fileName: "Buku Kas UMUM V2 " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
						+ moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var workbook = e.workbook;
					var sheet = workbook.sheets[0];
					
					var customHeader = [{
						cells: [
							{ value: "LAPORAN BKU V2", fontSize: 20, bold: true, textAlign: "center",}
						],
						height: 30
					}];
					
					sheet.mergedCells = ["A1:G1"];
					
					sheet.rows.splice(0, 0, ...customHeader);
					
					var gridData = e.sender.dataSource.view();
					
					for (var i = 0; i < gridData.length; i++) {
						var dataItem = gridData[i];
						
						var noBukti = dataItem.nospm || dataItem.nosts || '';
						var row = sheet.rows[i + 2]; 
						if (row && row.cells[2]) { 
							row.cells[2].value = noBukti;
						}
					}
					sheet.name = "BKU V2";
				},				
				
				selectable: 'row',
				scrollable: true,
				pageable: true,
				columns: [
						{ 
							field: "no", title: "No", width:"30px", 
						},
						{
							field: "tglbku", title: "Tanggal", width: "100px",
						},
						{
							field: "norekening",
							title: "No. Bukti",
							width: "130px",
						},
						{
							field: "uraianbku", title: "Keterangan Transaksi", width: "150px"
						},
						{
							field: "totalpenerimaan", 
							title: "Penerimaan", 
							width: "180px",
							template: "<span class='style-right'>{{formatRupiah('#: totalpenerimaan #', 'Rp. ')}}</span>",
							aggregates: ["sum"],
							attributes: { style: "text-align:right;" },
							footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalpenerimaan.sum #', '')}}</span>" 
						},
						{
							field: "totalpengeluaran", 
							title: "Pengeluaran", 
							width: "180px",
							template: "<span class='style-right'>{{formatRupiah('#: totalpengeluaran #', 'Rp. ')}}</span>",
							aggregates: ["sum"],
							attributes: { style: "text-align:right;" },
							footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalpengeluaran.sum  #', '')}}</span>" 
						},
						{
							field: "saldo", title: "Saldo", width: "180px",
							template: "<span class='style-right'>{{formatRupiah('#: totalpenerimaan - totalpengeluaran #', 'Rp. ')}}</span>",
							aggregates: ["sum"],
							attributes: { style: "text-align:right;" },
							footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalpenerimaan.sum  - data.totalpengeluaran.sum  #', '')}}</span>"
						},
				
						{
							command: {
								text: "Hapus", width: "40px", align: "center",
								attributes: { align: "center" },
								click: removeRow,
								imageClass: "k-icon k-delete"
							},
							title: "",
							width: "100px",
						}
					],	
						
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
				pageable: {
					messages: {
						display: "Menampilkan {0} - {1} data dari {2} data"
					},
					refresh: true,
					pageSizes: true,
					buttonCount: 5
				}
			};

            $scope.columnGridSTS = {
                sortable: true,
                selectable: true,
                pageable: true,
                toolbar: [
                    {
                        name: "Cari", 
                        text: "cari",
                        template:  '<div class="grid"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Cari"></label></div><div class="grid_4"><input c-text-box type="input" class="k-textbox" ng-model="item.cariSTS" /></div></div>'
                    }
                ],
                columns: [
                    {
                        
                        "field": "nosts",
                        "title": "No. STS",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpenerimaan",
                        "title": "Tanggal Penerimaan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalsetoran",
                        "title": "Total Setoran",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalsetoranpembulatan",
                        "title": "Pembulatan",
                        "width": "100px",
                    },                    
                    {                        
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "100px",
                    },
                    {
                        "field": "textrekening",
                        "title": "Rekening",
                    }
                    
                ]
			};
			
			$scope.columnGridSPM = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                toolbar: [
                    {
                        name: "Cari", 
                        text: "cari",
                        template:  '<div class="grid"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Cari"></label></div><div class="grid_4"><input c-text-box type="input" class="k-textbox" ng-model="item.cariSPM" /></div></div>'
                    }
                ],
                columns: [
                    // {
					// 	"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuSPM($event,2)' />",
					// 	"width": "30px"
					// },
                    {
                        
                        "field": "tglspm",
                        "title": "Tanggal SPM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nospm",
                        "title": "No SPM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "untukpengeluaran",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenisbukti",
                        "title": "Jenis Bukti",
                        "width": "100px",
                    },
                    {
                        
                        "field": "status",
                        "title": "Status",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglsah",
                        "title": "Tanggal Sah",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nilaispm",
                        "title": "Nilai",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: nilaispm #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "noreg",
                        "title": "Noreg",
                        "width": "100px",
                    },
                    {
                        
                        "field": "norec",
                        "title": "Norec",
                        "width": "100px",
                        "hidden": true
                    }

                ]
			};

            $scope.columnGridPengembalianPembayaran = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {"field": "nosbm", "title" : "No SBM"},
					{"field": "tglpengembalian", "title": "Tanggal Pengembalian"},
					{"field": "jumlah", "title": "Jumlah Pengembalian"},
					{"field": "keterangan", "title": "Keterangan Pengembalian"},
                ]
			};

            // #region saldo awal bku
            $scope.handlePopUpSaldoAwal = function(){

                // reset tahun bulan 
                $scope.item.tahunSaldoAwalBKU = null
                $scope.item.bulanSaldoAwalBKU = null
                $scope.item.saldoAwalBKU = null

                // get data saldo awal
                medifirstService.get('bendaharapenerimaan/get-saldoawal-bkubp').then(function(response){

                    let listData = response.data

                    $scope.dataSaldoAwalBKU = new kendo.data.DataSource({
                        data: listData,
                        total: listData.length,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                    });

                })

                $scope.popUpSaldoAwalBKU.open().center()

            }

            $scope.columnSaldoAwalBKU = {
                selectable: 'row',
                scrollable: true,
                pageable: true,
                columns: [
                    { "field": "tahun", "title": "Tahun" },
                    { "field": "bulan", "title": "Bulan" },
                    { "field": "saldoawal", "title": "Saldo Awal" },
                    {
						"command": [
							{ text: "Hapus", click: hapusSaldoAwalBKU, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
                ]
            }

            $scope.simpanSaldoAwalBKU = function(){

                // validasi
                if($scope.item.tahunSaldoAwalBKU == undefined && $scope.item.tahunSaldoAwalBKU == null){
                    toastr.error('Isi tahun dulu')
                    return
                }
                if($scope.item.bulanSaldoAwalBKU == undefined && $scope.item.bulanSaldoAwalBKU == null){
                    toastr.error('Isi bulan dulu')
                    return
                }
                if($scope.item.saldoAwalBKU == undefined && $scope.item.saldoAwalBKU == null){
                    toastr.error('Isi saldo dulu')
                    return
                }

                let dataSave = {
                    tahun: parseInt(moment($scope.item.tahunSaldoAwalBKU).format('YYYY')),
                    bulan: parseInt(moment($scope.item.bulanSaldoAwalBKU).format('MM')),
                    saldoawal: $scope.item.saldoAwalBKU,
                }

                medifirstService.post('bendaharapenerimaan/simpan-saldoawal-bkubp', dataSave).then(function(data){
                    
                    // close popup
                    $scope.popUpSaldoAwalBKU.close()

                    // reset input
                    $scope.item.tahunSaldoAwalBKU = null
                    $scope.item.bulanSaldoAwalBKU = null
                    $scope.item.saldoAwalBKU = null
                })
            }

            function hapusSaldoAwalBKU(e){
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var objSave = {
                    'norec': dataItem.norec
                }
                medifirstService.post('bendaharapenerimaan/hapus-saldoawal-bkubp', objSave).then(function () {
                    
                    // close popup
                    $scope.popUpSaldoAwalBKU.close()

                })

            }
            // #endregion saldo awal bku

			////////////// -TAMAT- ////////////////////

		}
	]);
});