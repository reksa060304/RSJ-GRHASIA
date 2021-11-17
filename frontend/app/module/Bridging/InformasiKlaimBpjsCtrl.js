define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiKlaimBpjsCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.item.jenispelayanan = 2
			$scope.jmlRujukanKeluar = 0
			var responData = "";
			var data2 = []
			var dataSave = []
			var dataSEPCMG = []
			var dataRow = {}
			$scope.show_btn = true
			loadCombo();
			// loadData();
			// getSisrute()
			// postKunjunganYankes()
			function loadCombo() {

				$scope.listjenispelayanan = [{ id: 1, name: 'Rawat Inap' }, { id: 2, name: 'Rawat Jalan' }]

			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarRegistrasiPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Registrasi Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "noSEP",
							"title": "NOSEP",
							"width": "10%"
						},
						{
							"field": "peserta.nama",
							"title": "Nama Pasien",
							"width": "20%",
							"template": "<span class='style-left'>#: peserta.nama #</span>"
						},
						{
							"field": "Inacbg.nama",
							"title": "Nama Inacbg",
							"width": "20%",
							"template": "<span class='style-center'>#: Inacbg.nama #</span>"
						},
						{
							"field": "peserta.noKartu",
							"title": "Nokartu",
							"width": "150px",
							"template": "<span class='style-left'>#: peserta.noKartu #</span>"
						},
						{
							"field": "peserta.noMR",
							"title": "NOMR",
							"width": "15%",
							"template": "<span class='style-left'>#: peserta.noMR #</span>"
						},
						{
							"field": "poli",
							"title": "Poli",
							"width": "100px",
							"template": "<span class='style-left'>#: poli #</span>"
						},
						{
							"field": "kelasRawat",
							"title": "Kelas Rawat",
							"width": "100px",
							"template": "<span class='style-left'>#: kelasRawat #</span>"
						},
						{
							"field": "status",
							"title": "Staut",
							"width": "100px",
							"template": "<span class='style-left'>#: status #</span>"
						},
						{
							"field": "biaya.byTarifRS",
							"title": "Biaya Tarif RS",
							"width": "100px",
							"template": "<span class='style-right'>{{formatRupiah('#: biaya.byTarifRS #', '')}}</span>",
							// "template": "<span class='style-left'>#: biaya.byTarifRS #</span>"
						},
						{
							"field": "biaya.byPengajuan",
							"title": "Biaya Pengajuan",
							"width": "100px",
							"template": "<span class='style-right'>{{formatRupiah('#: biaya.byPengajuan #', '')}}</span>",
							// "template": "<span class='style-left'>#: biaya.byPengajuan #</span>"
						},
						{
							"field": "biaya.bySetujui",
							"title": "Biaya Setujui",
							"width": "100px",
							"template": "<span class='style-right'>{{formatRupiah('#: biaya.byPengajuan #', '')}}</span>",
							// "template": "<span class='style-left'>#: biaya.byPengajuan #</span>"
						},
						{
							"field": "tglSep",
							"title": "Tanggal SEP",
							"width": "100px",
							"template": "<span class='style-left'>#: tglSep #</span>"
						},
						{
							"field": "tglPulang",
							"title": "Tanggal Pulang",
							"width": "100px",
							"template": "<span class='style-left'>#: tglPulang #</span>"
						}
					]
			};
			$scope.dbklik = function (data) {
				$scope.popupDetail.center().open();
				var jenis_rawat = 1 //ranap
				if (data.deptid != 16) {
					jenis_rawat = 2
				}
				var upgrade_class_ind = 0
				var upgrade_class_class = ''
				var add_payment_pct = 0
				if (data.nokelasdijamin != data.nokelasdaftar) {
					upgrade_class_ind = 1
					upgrade_class_class = data.namakelas
					add_payment_pct = 0
				}
				var discharge_status = 0
				if (data.objectstatuspulangfk == 1 || data.objectstatuspulangfk == 6) {
					discharge_status = 1
				} else if (data.objectstatuspulangfk == 4 || data.objectstatuspulangfk == 5 || data.objectstatuspulangfk == 10 ||
					data.objectstatuspulangfk == 11) {
					discharge_status = 2
				} else if (data.objectstatuspulangfk == 2 || data.objectstatuspulangfk == 8 || data.objectstatuspulangfk == 3) {
					discharge_status = 3
				} else if (data.objectstatuspulangfk == 9) {
					discharge_status = 4
				} else {
					discharge_status = 5
				}


				$scope.item.detail =
					'nomor_sep = ' + data.nosep + '\n' +
					'nomor_kartu = ' + data.nokepesertaan + '\n' +
					'tgl_masuk = ' + data.tglregistrasi + '\n' +
					'tgl_pulang = ' + data.tglpulang + '\n' +
					'jenis_rawat = ' + jenis_rawat + '\n' +
					'kelas_rawat = ' + data.nokelasdaftar + '\n' +
					'adl_sub_acute = null \n' +
					'adl_chronic = null \n' +
					'icu_indikator = null \n' +
					'icu_los = null \n' +
					'ventilator_hour = null \n' +
					'upgrade_class_ind = ' + upgrade_class_ind + '\n' +
					'upgrade_class_class = ' + upgrade_class_class + '\n' +
					'upgrade_class_los = ' + null + '\n' +
					'add_payment_pct = ' + add_payment_pct + '\n' +
					'birth_weight = ' + 0 + '\n' +
					'discharge_status = ' + discharge_status + '\n' +
					'diagnosa = ' + data.icd10 + '\n' +
					'procedure = ' + data.icd9 + '\n' +
					'tarif_rs = ' + data.tarif_rs + '\n' + +
					'tarif_poli_eks = ' + 0 + "\n" +
					'nama_dokter = ' + data.namadokter + "\n" +
					'kode_tarif = ' + 'BP' + "\n" +
					'payor_id = ' + '3' + "\n" +
					'payor_cd = ' + 'JKN' + "\n" +
					'cob_cd = ' + '#' + "\n" +
					'coder_nik = ' + data.codernik
			}
			$scope.tutup = function () {
				$scope.popupDetail.center().close();
			}


			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {

				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}

				if ($scope.item.statusKlaim == undefined) {
					toastr.error('Status Klaim harus di pilih')
					return
				}

				var data = {
					jenispelayanan: jnspelayanan,
					status: $scope.item.statusKlaim.value,
					tglsep: moment($scope.item.periodeAwal).format('YYYY-MM-DD')
				}
				$scope.isRouteLoading = true;
				medifirstService.get("bridging/bpjs/get-monitoring-klaim?tglsep="
					+ data.tglsep
					+ "&jenispelayanan="
					+ data.jenispelayanan
					+ "&status="
					+ data.status
				).then(function (data) {
					$scope.isRouteLoading = false;
					data2 = data.data.response.klaim
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						// data: data.data,
						data: data2,
						pageSize: 10,
						total: data2.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});

					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('InformasiKlaimBpjs', chacePeriode);
				});
			};
			$scope.listStatusKlaim = [{
				"id": 3, "statusklaim": "Proses Verifikasi", "value": 1
			}, {
				"id": 4, "statusklaim": "Pending Verifikasi", "value": 2
			}, {
				"id": 5, "statusklaim": "Klaim", "value": 3
			}];
			$scope.UbahDokter = function () {
				$scope.cboDokter = true
				$scope.cboUbahDokter = false
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.PasienPulang = function () {
				debugger;
				if ($scope.dataPasienSelected.tglpulang != undefined) {
					window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.dataPasienSelected.noregistrasi
						+ '&ruangId=' + $scope.dataPasienSelected.ruanganid).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.dataPasienSelected.norec,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.dataPasienSelected.ruanganid
								cacheHelper.set('CachePindah', CachePindah);
							}

						})

				}
				// var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				// $scope.cbopasienpulang = true
				// $scope.cboUbahDokter=false
				// if ($scope.dataPasienSelected.tglpulang != null){
				// 	$scope.item.tanggalPulang=$scope.dataPasienSelected.tglpulang
				// }else{
				// 	$scope.item.tanggalPulang=tglpulang
				// }				
			}

			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}


			$scope.new_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "new_claim"
						},
						"data": {
							"nomor_kartu": dataSave[i].nomor_kartu,
							"nomor_sep": dataSave[i].nomor_sep,
							"nomor_rm": dataSave[i].nomor_rm,
							"nama_pasien": dataSave[i].nama_pasien,
							"tgl_lahir": dataSave[i].tgl_lahir,
							"gender": dataSave[i].gender
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// LoadData();				
				})
			}

			$scope.new_claim2 = function () {

				$scope.isRouteLoading = true;
				var datass = []
				for (let i = 0; i < data2.length; i++) {
					const element = data2[i];
					datass.push({ noreg: element.norec, namakelas: element.namakelas, nosep: element.nosep, deptid: element.deptid })
				}

				medifirstService.savestatusnaikkelas({ data: datass }).then(function (e) {
					var resp = e.data
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {
						for (var z = resp.length - 1; z >= 0; z--) {
							const element = resp[z];
							if (dataSave[i].nomor_sep == element.nosep) {// $scope.dataPasienSelected.nosep) {
								dt1 = {
									"metadata": {
										"method": "new_claim"
									},
									"data": {
										"nomor_kartu": dataSave[i].nomor_kartu,
										"nomor_sep": dataSave[i].nomor_sep,
										"nomor_rm": dataSave[i].nomor_rm,
										"nama_pasien": dataSave[i].nama_pasien,
										"tgl_lahir": dataSave[i].tgl_lahir,
										"gender": dataSave[i].gender
									}
								}
								dt2.push(dt1)
							}
						}
					}

					var objData = {
						"data": dt2
					}
					// medifirstService.savebridginginacbg(objData).then(function(e){
					for (var i = dataSave.length - 1; i >= 0; i--) {
						for (var z = resp.length - 1; z >= 0; z--) {
							const element = resp[z];
							if (dataSave[i].nomor_sep == element.nosep) {//$scope.dataPasienSelected.nosep) {
								dt1 = {
									"metadata": {
										"method": "set_claim_data",
										"nomor_sep": dataSave[i].nomor_sep
									},
									"data": {
										"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
										"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
										"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
										"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
										"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
										"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
										"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
										"adl_chronic": dataSave[i].adl_chronic,    //"12",    
										"icu_indikator": element.statusrawatintensiv,// resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
										"icu_los": element.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
										"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
										"upgrade_class_ind": element.statusnaikkelas,//dataSave[i].upgrade_class_ind ,    //"1",    
										"upgrade_class_class": element.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
										"upgrade_class_los": element.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
										"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
										"birth_weight": '',//,$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
										"discharge_status": dataSave[i].discharge_status,    //"1",    
										"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
										"procedure": dataSave[i].procedure,    //"81.52#88.38",    
										"tarif_rs": {
											"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
											"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
											"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
											"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
											"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
											"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
											"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
											"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
											"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
											"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
											"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
											"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
											"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
											"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
											"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
											"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
											"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
											"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
										},
										"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
										"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
										"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
										"payor_id": dataSave[i].payor_id,    //"3",    
										"payor_cd": dataSave[i].payor_cd,    //"JKN",    
										"cob_cd": dataSave[i].cob_cd,    //"0001",    
										"coder_nik": dataSave[i].coder_nik    //"123123123123"  
									}
								}
								dt2.push(dt1)
							}
						}
					}

					var objData = {
						"data": dt2
					}
					medifirstService.savebridginginacbg(objData).then(function (e) {
						var dt1 = {}
						var dt2 = []

						for (var i = resp.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1"
								},
								"data": {
									// "nomor_sep": dataSave[i].nomor_sep 
									"nomor_sep": resp[i].nosep// $scope.dataPasienSelected.nosep
								}
							}
							dt2.push(dt1)
						}


						var objData = {
							"data": dt2
						}
						// var totaldijamin = "";
						// var hakkelas = "";
						// var biayanaikkelas = "0";
						medifirstService.savebridginginacbg(objData).then(function (e) {
							// simpan response ke database
							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
							// if(dataSave[0].jenis_rawat==2){
							var proporsiPush = []
							for (let x = 0; x < responData.length; x++) {
								const elementRes = responData[x];
								for (var i = resp.length - 1; i >= 0; i--) {
									const element = resp[i]
									if (elementRes.datarequest.data.nomor_sep == element.nosep) {
										var totaldijamin = "";
										var hakkelas = "";
										var biayanaikkelas = "0";
										if (element.deptid != "16") {
											totaldijamin = elementRes.dataresponse.tarif_alt[2].tarif_inacbg// responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										} else {
											if (elementRes.dataresponse.metadata.code != 400) {
												hakkelas = elementRes.dataresponse.response.kelas
												if (hakkelas == "kelas_1") {
													totaldijamin = elementRes.dataresponse.tarif_alt[0].tarif_inacbg
												} else if (hakkelas == "kelas_2") {
													totaldijamin = elementRes.dataresponse.tarif_alt[1].tarif_inacbg
												} else if (hakkelas == "kelas_3") {
													totaldijamin = elementRes.dataresponse.tarif_alt[2].tarif_inacbg
												}
												// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){

												if (element.statusnaikkelas != '0') {
													biayanaikkelas = elementRes.dataresponse.response.add_payment_amt
													if (biayanaikkelas < 0) {
														biayanaikkelas = 0
													}
												}
											}

										}

										var dataproposi = {
											"noregistrasifk": element.norec_pd,//$scope.dataPasienSelected.norec,
											"totalDijamin": totaldijamin,
											"biayaNaikkelas": biayanaikkelas
										}
										proporsiPush.push(dataproposi)
									}
								}


							}
							medifirstService.saveInformasiTanggungan({ 'proporsi': proporsiPush }).then(function (e) {
								//ini untuk proposional kan utang per tindakan
								var dt1 = {}
								var dt2 = []
								for (var i = resp.length - 1; i >= 0; i--) {
									dt1 = {
										"metadata": {
											"method": "delete_claim"
										},
										"data": {
											"nomor_sep": resp[i].nosep,///$scope.dataPasienSelected.nosep,
											"coder_nik": '123123123123',//dataSave[i].coder_nik   
										}
									}
									dt2.push(dt1)
								}
								$scope.isRouteLoading = false;
								var objData = {
									"data": dt2
								}
								medifirstService.savebridginginacbg(objData).then(function (e) {
									//
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
								})
							})
							loadData()

						})


					})

				})
				// })
			}

			// $scope.new_claim2 = function(){

			// 	$scope.isRouteLoading=true;
			// 	medifirstService.get('inacbg/get-daftar-pasien-statusnaikkelas?noreg='+ $scope.dataPasienSelected.norec
			// 		 	+ '&namakelas=' + $scope.dataPasienSelected.namakelas ).then(function(e){
			// 				 var resp=e.data
			// 				var dt1 ={}
			// 				var dt2 =[]
			// 				for (var i = dataSave.length - 1; i >= 0; i--) {
			// 					if(dataSave[i].nomor_sep==$scope.dataPasienSelected.nosep){
			// 						dt1 = {
			// 							"metadata": {
			// 								"method": "new_claim"
			// 								},
			// 							"data": {
			// 									"nomor_kartu": dataSave[i].nomor_kartu,
			// 									"nomor_sep": dataSave[i].nomor_sep,
			// 									"nomor_rm": dataSave[i].nomor_rm,
			// 									"nama_pasien": dataSave[i].nama_pasien,
			// 									"tgl_lahir": dataSave[i].tgl_lahir,
			// 									"gender": dataSave[i].gender
			// 								}
			// 						}
			// 					dt2.push(dt1)
			// 					}
			// 				}

			// 	var objData = {
			// 		  "data": dt2
			// 		}

			// 	// medifirstService.savebridginginacbg(objData).then(function(e){
			// 		for (var i = dataSave.length - 1; i >= 0; i--) {
			// 			if(dataSave[i].nomor_sep==$scope.dataPasienSelected.nosep){
			// 				dt1 = {    
			// 					"metadata": {     
			// 						"method": "set_claim_data",    
			// 						"nomor_sep": dataSave[i].nomor_sep 
			// 					},
			// 					"data":{
			// 						"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
			// 						"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
			// 						"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
			// 						"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
			// 						"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
			// 						"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
			// 						"adl_sub_acute": dataSave[i].adl_sub_acute ,    //"15",    
			// 						"adl_chronic": dataSave[i].adl_chronic ,    //"12",    
			// 						"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
			// 						"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
			// 						"ventilator_hour": dataSave[i].ventilator_hour ,    //"5",    
			// 						"upgrade_class_ind": resp.statusnaikkelas,//dataSave[i].upgrade_class_ind ,    //"1",    
			// 						"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
			// 						"upgrade_class_los":  resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
			// 						"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
			// 						"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
			// 						"discharge_status": dataSave[i].discharge_status ,    //"1",    
			// 						"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
			// 						"procedure": dataSave[i].procedure,    //"81.52#88.38",    
			// 						"tarif_rs": {      
			// 							"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
			// 							"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
			// 							"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
			// 							"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
			// 							"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
			// 							"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
			// 							"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
			// 							"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
			// 							"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
			// 							"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
			// 							"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
			// 							"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
			// 							"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
			// 							"obat_kronis": dataSave[i].tarif_rs.obat_kronis,      
			// 							"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,    
			// 							"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
			// 							"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
			// 							"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
			// 						},    
			// 						"tarif_poli_eks": dataSave[i].tarif_poli_eks ,    //"100000",    
			// 						"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
			// 						"kode_tarif": dataSave[i].kode_tarif ,    //"AP",    
			// 						"payor_id": dataSave[i].payor_id ,    //"3",    
			// 						"payor_cd": dataSave[i].payor_cd ,    //"JKN",    
			// 						"cob_cd": dataSave[i].cob_cd ,    //"0001",    
			// 						"coder_nik": dataSave[i].coder_nik    //"123123123123"  
			// 					} 
			// 				} 
			// 				dt2.push(dt1)
			// 			}
			// 		}

			// 		var objData = {
			// 			  "data": dt2
			// 			}
			// 		medifirstService.savebridginginacbg(objData).then(function(e){
			// 			var dt1 ={}
			// 	var dt2 =[]

			// 	// for (var i = dataSave.length - 1; i >= 0; i--) {
			// 		dt1 = {
			// 				"metadata": {
			// 					"method": "grouper",
			// 					"stage": "1"
			// 				},
			// 				"data": {
			// 					// "nomor_sep": dataSave[i].nomor_sep 
			// 					"nomor_sep": $scope.dataPasienSelected.nosep
			// 				}
			// 			}
			// 		dt2.push(dt1)
			// 	// }


			// 	var objData = {
			// 		  "data": dt2
			// 		}
			// 	var totaldijamin="";
			// 	var hakkelas="";
			// 	var biayanaikkelas="0";
			// 	medifirstService.savebridginginacbg(objData).then(function(e){
			// 		// simpan response ke database
			// 		responData = e.data.dataresponse;
			// 		toastr.info(responData[0].dataresponse.metadata.message,'INACBG');
			// 		toastr.info(responData[0].dataresponse.response.cbg.description,'INACBG');
			// 		// if(dataSave[0].jenis_rawat==2){
			// 		if($scope.dataPasienSelected.deptid!=16){
			// 			totaldijamin=responData[0].dataresponse.tarif_alt[2].tarif_inacbg
			// 		}else{
			// 			hakkelas=responData[0].dataresponse.response.kelas
			// 			if(hakkelas=="kelas_1"){
			// 				totaldijamin=responData[0].dataresponse.tarif_alt[0].tarif_inacbg
			// 			}else if(hakkelas=="kelas_2"){
			// 				totaldijamin=responData[0].dataresponse.tarif_alt[1].tarif_inacbg
			// 			}else if(hakkelas=="kelas_3"){
			// 				totaldijamin=responData[0].dataresponse.tarif_alt[2].tarif_inacbg
			// 			}
			// 			// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
			// 			if(resp.statusnaikkelas!='0'){
			// 				biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
			// 				if(biayanaikkelas<0){
			// 					biayanaikkelas=0
			// 				}
			// 			}
			// 		}
			// 		var dataproposi={
			// 			"noregistrasifk":$scope.dataPasienSelected.norec,
			// 			"totalDijamin":totaldijamin,
			// 			"biayaNaikkelas":biayanaikkelas
			// 		}
			// 		medifirstService.saveInformasiTanggungan(dataproposi).then(function(e){
			// 			//ini untuk proposional kan utang per tindakan
			// 			var dt1 ={}
			// 			var dt2 =[]
			// 			// for (var i = dataSave.length - 1; i >= 0; i--) {
			// 				dt1 ={   
			// 					"metadata": {      
			// 						"method":"delete_claim"   
			// 					},   
			// 					"data": {      
			// 						"nomor_sep": $scope.dataPasienSelected.nosep,      
			// 						"coder_nik": '123123123123',//dataSave[i].coder_nik   
			// 					} 
			// 				} 
			// 				dt2.push(dt1)
			// 			// }

			// 			var objData = {
			// 				"data": dt2
			// 				}
			// 			medifirstService.savebridginginacbg(objData).then(function(e){
			// 				//
			// 				responData = e.data.dataresponse;
			// 				toastr.info(responData[0].dataresponse.metadata.message,'INACBG');	
			// 			})
			// 		})
			// 		loadData()

			// 	})

			// 			$scope.isRouteLoading=false;			
			// 	})

			// 			 })
			// 	// })
			// }
			$scope.finalprintklaim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": '123123123123',
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response oke saja
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "claim_print"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					medifirstService.savebridginginacbg(objData).then(function (e) {
						// response simpan ke database	
						responData = e.data.dataresponse;
						if (responData[0].dataresponse.metadata.code == 200) {
							const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
							const downloadLink = document.createElement("a");
							var tglprint = moment($scope.now).format('YYYY-MM-DD');
							const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";

							downloadLink.href = linkSource;
							downloadLink.download = fileName;
							downloadLink.click();
						}
						// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					})
				})
			}
			$scope.grouping = function () {
				$scope.isRouteLoading = true;
				if ($scope.dataPasienSelected.deptid != 16) {
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
							dt1 = {
								"metadata": {
									"method": "new_claim"
								},
								"data": {
									"nomor_kartu": dataSave[i].nomor_kartu,
									"nomor_sep": dataSave[i].nomor_sep,
									"nomor_rm": dataSave[i].nomor_rm,
									"nama_pasien": dataSave[i].nama_pasien,
									"tgl_lahir": dataSave[i].tgl_lahir,
									"gender": dataSave[i].gender
								}
							}
							dt2.push(dt1)
						}
					}

					var objData = {
						"data": dt2
					}
					// medifirstService.savebridginginacbg(objData).then(function(e){
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
							dt1 = {
								"metadata": {
									"method": "set_claim_data",
									"nomor_sep": dataSave[i].nomor_sep
								},
								"data": {
									"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
									"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
									"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
									"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
									"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
									"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
									"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
									"adl_chronic": dataSave[i].adl_chronic,    //"12",    
									"icu_indikator": dataSave[i].icu_indikator,    //"1",    
									"icu_los": dataSave[i].icu_los,    //"2",    
									"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
									"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
									"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
									"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
									"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
									"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
									"discharge_status": dataSave[i].discharge_status,    //"1",    
									"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
									"procedure": dataSave[i].procedure,    //"81.52#88.38",    
									"tarif_rs": {
										"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
										"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
										"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
										"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
										"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
										"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
										"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
										"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
										"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
										"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
										"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
										"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
										"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
										"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
										"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
										"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
										"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
										"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
									},
									"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
									"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
									"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
									"payor_id": dataSave[i].payor_id,    //"3",    
									"payor_cd": dataSave[i].payor_cd,    //"JKN",    
									"cob_cd": dataSave[i].cob_cd,    //"0001",    
									"coder_nik": dataSave[i].coder_nik    //"123123123123"  
								}
							}
							dt2.push(dt1)
						}
					}

					var objData = {
						"data": dt2
					}
					medifirstService.savebridginginacbg(objData).then(function (e) {
						var dt1 = {}
						var dt2 = []

						// for (var i = dataSave.length - 1; i >= 0; i--) {
						dt1 = {
							"metadata": {
								"method": "grouper",
								"stage": "1"
							},
							"data": {
								// "nomor_sep": dataSave[i].nomor_sep 
								"nomor_sep": $scope.dataPasienSelected.nosep
							}
						}
						dt2.push(dt1)
						// }


						var objData = {
							"data": dt2
						}
						var totaldijamin = "";
						var hakkelas = "";
						var biayanaikkelas = "0";
						medifirstService.savebridginginacbg(objData).then(function (e) {
							// simpan response ke database
							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
							// if(dataSave[0].jenis_rawat==2){
							if ($scope.dataPasienSelected.deptid != 16) {
								totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
							} else {
								hakkelas = responData[0].dataresponse.response.kelas
								if (hakkelas == "kelas_1") {
									totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
								} else if (hakkelas == "kelas_2") {
									totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
								} else if (hakkelas == "kelas_3") {
									totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
								}
								if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
									biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
									if (biayanaikkelas < 0) {
										biayanaikkelas = 0
									}
								}
							}
							var dataproposi = {
								"noregistrasifk": $scope.dataPasienSelected.norec,
								"totalDijamin": totaldijamin,
								"biayaNaikkelas": biayanaikkelas
							}
							medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
								//ini untuk proposional kan utang per tindakan
							})
							loadData()
							if (responData[0].dataresponse.special_cmg_option.length > 1) {
								toastr.info('Terdeteksi Top-up CMG Options')
								dataSEPCMG = responData[0].datarequest.data.nomor_sep
								var responOptions = responData[0].dataresponse.special_cmg_option
								var spesialDrug = []
								var specialProcedure = []
								var specialProsthesis = []
								var specialInvestigation = []
								for (let i = 0; i < responOptions.length; i++) {
									const element = responOptions[i];
									if (element.type == 'Special Drug') {
										spesialDrug.push(element)
									}
									if (element.type == 'Special Procedure') {
										specialProcedure.push(element)
									}
									if (element.type == 'Special Prosthesis') {
										specialProsthesis.push(element)
									}
									if (element.type == 'Special Investigation') {
										specialInvestigation.push(element)
									}
								}
								$scope.listspecialdrug = spesialDrug
								$scope.listspecialprocedure = specialProcedure
								$scope.listspecialprosthesis = specialProsthesis
								$scope.listspecialinvestigation = specialInvestigation
							}
						})

						$scope.isRouteLoading = false;
					})
				} else {
					medifirstService.get('inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.dataPasienSelected.norec
						+ '&namakelas=' + $scope.dataPasienSelected.namakelas).then(function (e) {
							var resp = e.data
							var dt1 = {}
							var dt2 = []
							for (var i = dataSave.length - 1; i >= 0; i--) {
								if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
									dt1 = {
										"metadata": {
											"method": "new_claim"
										},
										"data": {
											"nomor_kartu": dataSave[i].nomor_kartu,
											"nomor_sep": dataSave[i].nomor_sep,
											"nomor_rm": dataSave[i].nomor_rm,
											"nama_pasien": dataSave[i].nama_pasien,
											"tgl_lahir": dataSave[i].tgl_lahir,
											"gender": dataSave[i].gender
										}
									}
									dt2.push(dt1)
								}
							}

							var objData = {
								"data": dt2
							}
							// medifirstService.savebridginginacbg(objData).then(function(e){
							for (var i = dataSave.length - 1; i >= 0; i--) {
								if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
									dt1 = {
										"metadata": {
											"method": "set_claim_data",
											"nomor_sep": dataSave[i].nomor_sep
										},
										"data": {
											"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
											"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
											"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
											"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
											"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
											"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
											"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
											"adl_chronic": dataSave[i].adl_chronic,    //"12",    
											"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
											"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
											"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
											"upgrade_class_ind": resp.statusnaikkelas,//dataSave[i].upgrade_class_ind ,    //"1",    
											"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
											"upgrade_class_los": resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
											"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
											"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
											"discharge_status": dataSave[i].discharge_status,    //"1",    
											"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
											"procedure": dataSave[i].procedure,    //"81.52#88.38",    
											"tarif_rs": {
												"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
												"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
												"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
												"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
												"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
												"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
												"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
												"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
												"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
												"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
												"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
												"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
												"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
												"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
												"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
												"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
												"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
												"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
											},
											"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
											"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
											"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
											"payor_id": dataSave[i].payor_id,    //"3",    
											"payor_cd": dataSave[i].payor_cd,    //"JKN",    
											"cob_cd": dataSave[i].cob_cd,    //"0001",    
											"coder_nik": dataSave[i].coder_nik    //"123123123123"  
										}
									}
									dt2.push(dt1)
								}
							}

							var objData = {
								"data": dt2
							}
							medifirstService.savebridginginacbg(objData).then(function (e) {
								var dt1 = {}
								var dt2 = []

								// for (var i = dataSave.length - 1; i >= 0; i--) {
								dt1 = {
									"metadata": {
										"method": "grouper",
										"stage": "1"
									},
									"data": {
										// "nomor_sep": dataSave[i].nomor_sep 
										"nomor_sep": $scope.dataPasienSelected.nosep
									}
								}
								dt2.push(dt1)
								// }


								var objData = {
									"data": dt2
								}
								var totaldijamin = "";
								var hakkelas = "";
								var biayanaikkelas = "0";
								medifirstService.savebridginginacbg(objData).then(function (e) {
									// simpan response ke database
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
									toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
									// if(dataSave[0].jenis_rawat==2){
									if ($scope.dataPasienSelected.deptid != 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else {
										hakkelas = responData[0].dataresponse.response.kelas
										if (hakkelas == "kelas_1") {
											totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
										} else if (hakkelas == "kelas_2") {
											totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
										} else if (hakkelas == "kelas_3") {
											totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										}
										// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
										if (resp.statusnaikkelas != '0') {
											biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
											if (biayanaikkelas < 0) {
												biayanaikkelas = 0
											}
										}
									}
									var dataproposi = {
										"noregistrasifk": $scope.dataPasienSelected.norec,
										"totalDijamin": totaldijamin,
										"biayaNaikkelas": biayanaikkelas
									}
									medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
										//ini untuk proposional kan utang per tindakan
									})
									loadData()
									if (responData[0].dataresponse.special_cmg_option.length > 1) {
										toastr.info('Terdeteksi Top-up CMG Options')
										dataSEPCMG = responData[0].datarequest.data.nomor_sep
										var responOptions = responData[0].dataresponse.special_cmg_option
										var spesialDrug = []
										var specialProcedure = []
										var specialProsthesis = []
										var specialInvestigation = []
										for (let i = 0; i < responOptions.length; i++) {
											const element = responOptions[i];
											if (element.type == 'Special Drug') {
												spesialDrug.push(element)
											}
											if (element.type == 'Special Procedure') {
												specialProcedure.push(element)
											}
											if (element.type == 'Special Prosthesis') {
												specialProsthesis.push(element)
											}
											if (element.type == 'Special Investigation') {
												specialInvestigation.push(element)
											}
										}
										$scope.listspecialdrug = spesialDrug
										$scope.listspecialprocedure = specialProcedure
										$scope.listspecialprosthesis = specialProsthesis
										$scope.listspecialinvestigation = specialInvestigation
									}
								})

								$scope.isRouteLoading = false;
							})

						})
				}


			}
			$scope.update_patient = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "update_patient",
								"nomor_rm": dataSave[i].nomor_rm
							},
							"data": {
								"nomor_kartu": dataSave[i].nomor_kartu,
								"nomor_rm": dataSave[i].nomor_rm,
								"nama_pasien": dataSave[i].nama_pasien,
								"tgl_lahir": dataSave[i].tgl_lahir,
								"gender": dataSave[i].gender
							}
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// LoadData();				
				})
			}
			$scope.set_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": dataSave[i].add_payment_pct,    //"35",    
								"birth_weight": dataSave[i].birth_weight,    //"0",    
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": "0",
									"obat_kemoterapi": "0",
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							}
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// LoadData();				
				})
			}

			$scope.grouper_1 = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien Terlebih dahulu!!!')
					return;
				}

				var dt1 = {}
				var dt2 = []

				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "1"
					},
					"data": {
						// "nomor_sep": dataSave[i].nomor_sep 
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }


				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var hakkelas = "";
				var biayanaikkelas = "0";
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.dataPasienSelected.deptid != 16) {
						totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						if (hakkelas == "kelas_1") {
							totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
						} else if (hakkelas == "kelas_2") {
							totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
						} else if (hakkelas == "kelas_3") {
							totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
						}
						if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
							biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
							if (biayanaikkelas < 0) {
								biayanaikkelas = 0
							}
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas
					}
					medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
						//ini untuk proposional kan utang per tindakan
					})
					loadData()
					if (responData[0].dataresponse.special_cmg_option.length > 1) {
						toastr.info('Terdeteksi Top-up CMG Options')
						dataSEPCMG = responData[0].datarequest.data.nomor_sep
						var responOptions = responData[0].dataresponse.special_cmg_option
						var spesialDrug = []
						var specialProcedure = []
						var specialProsthesis = []
						var specialInvestigation = []
						for (let i = 0; i < responOptions.length; i++) {
							const element = responOptions[i];
							if (element.type == 'Special Drug') {
								spesialDrug.push(element)
							}
							if (element.type == 'Special Procedure') {
								specialProcedure.push(element)
							}
							if (element.type == 'Special Prosthesis') {
								specialProsthesis.push(element)
							}
							if (element.type == 'Special Investigation') {
								specialInvestigation.push(element)
							}
						}
						$scope.listspecialdrug = spesialDrug
						$scope.listspecialprocedure = specialProcedure
						$scope.listspecialprosthesis = specialProsthesis
						$scope.listspecialinvestigation = specialInvestigation
					}
				})
			}
			$scope.simpangrouper2 = function () {
				var cmg = "";
				if ($scope.item.specialprocedure != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}
				var dt1 = {}
				var dt2 = []

				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "2"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"special_cmg": cmg//"ambil dari table hasil grouper 1"   
					}
				}
				dt2.push(dt1)




				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var totaldijamina = "";
				var biayanaikkelas = "0";
				var hakkelas = "";
				var cmglength = "";
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					cmglength = responData[0].dataresponse.response.special_cmg
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.dataPasienSelected.deptid != 16) {
						totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
						for (let i = 0; i < cmglength.length; i++) {
							const element = cmglength[i];
							if (element.type == 'Special Drug') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Procedure') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Prosthesis') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Investigation') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
						}
						totaldijamina = responData[0].dataresponse.tarif_alt[2].tarif_sd
						totaldijamin = totaldijamin + totaldijamina
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
						// 	biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
						// }

						biayanaikkelas = Number($scope.dataPasienSelected.biayanaikkelas)
						// biayanaikkelas=biayanaikkelas.toFixed(0);
						if (hakkelas == "kelas_1") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_2") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[1].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_3") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas
					}
					medifirstService.saveproposibridginginacbg(dataproposi).then(function (e) {
						// ini untuk proposional kan utang penjamin per tindakan
					})
					loadData()
				})
			}
			$scope.grouper_2 = function () {
				if (dataSEPCMG == $scope.dataPasienSelected.nosep) {
					$scope.item.specialprocedure = ""
					$scope.item.specialprosthesis = ""
					$scope.item.specialinvestigation = ""
					$scope.item.specialdrug = ""
					$scope.popupCMG.center().open();
				}
				else {
					toastr.error('Pasien ini Bukan Top-up CMG Options!')
				}
				// var dt1 ={}
				// var dt2 =[]
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				// 	dt1 = {   
				// 		"metadata": {      
				// 			"method":"grouper",      
				// 			"stage":"2"   
				// 		},   
				// 		"data": {      
				// 			"nomor_sep":dataSave[i].nomor_sep ,      
				// 			"special_cmg": "ambil dari table hasil grouper 1"   
				// 		} 
				// 	} 
				// 	dt2.push(dt1)
				// }

				// var objData = {
				// 	  "data": dt2
				// 	}
				// medifirstService.savebridginginacbg(objData).then(function(e){
				// 	// simpan response ke database	
				// })
			}
			$scope.claim_final = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": '123123123123',
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.edit_claim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "reedit_claim"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.send_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "send_claim"
						},
						"data": {
							"start_dt": "",//"2016-01-07",      
							"stop_dt": "",//"2016-01-07",      
							"jenis_rawat": "",//"1",      
							"date_type": "",//"2"   
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response simpan ke database			
				})
			}
			$scope.send_claim_individual = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "send_claim_individual"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.claim_print = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_print"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.delete_claim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "delete_claim"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"coder_nik": '123123123123',//dataSave[i].coder_nik   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					//
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}
			$scope.delete_patient = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {

				dt1 = {
					"metadata": {
						"method": "delete_patient"
					},
					"data": {
						"nomor_rm": $scope.dataPasienSelected.noRm,
						"coder_nik": '123123123123'//dataSave[i].coder_nik   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_status = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_status"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_data"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// 			
				})
			}
			$scope.pull_claim2 = function () {
				var dt1 = {}
				var dt2 = []
				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "pull_claim"
					},
					"data": {
						"start_dt": moment($scope.item.periodeAwalPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"stop_dt": moment($scope.item.periodeAkhirPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"jenis_rawat": jnspelayanan//"1"   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						const fileName = "pull_claim" + "_" + tglprint + ".txt";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}
			$scope.pull_claim = function () {
				$scope.popupPull_Claim.center().open();
				// var dt1 ={}
				// var dt2 =[]
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				// 	dt1 = {   
				// 		"metadata": {      
				// 			"method":"pull_claim"   
				// 		},   
				// 		"data": {      
				// 			"start_dt":"",//"2016-01-07",      
				// 			"stop_dt":"",//"2016-01-07",      
				// 			"jenis_rawat":""//"1"   
				// 		} 
				// 	} 
				// 	dt2.push(dt1)
				// }

				// var objData = {
				// 	  "data": dt2
				// 	}
				// medifirstService.savebridginginacbg(objData).then(function(e){
				// 	// 			
				// })
			}
			$scope.search_diagnosis = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_diagnosis"
						},
						"data": {
							"keyword": ""
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// 			
				})
			}
			$scope.search_procedures = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_procedures"
						},
						"data": {
							"keyword": ""
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.savebridginginacbg(objData).then(function (e) {
					// 			
				})
			}
			//debugger
			// $scope.simpantglpulang = function(){
			// 	//debugger
			// 	var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
			// 	var updateTanggal = {
			// 		"noregistrasi": $scope.dataPasienSelected.noregistrasi,
			// 		"tglpulang": tglpulang
			// 	}
			// 	medifirstService.saveupdatetglpulang(updateTanggal).then(function(e){
			// 		LoadData();				
			// 	})	
			// 		$scope.cbopasienpulang=false;
			// 		$scope.cboUbahDokter=true;
			// }

			// $scope.klikGrid = function(dataPasienSelected){
			// 	if (dataPasienSelected != undefined) {
			// 		$scope.item.namaDokter = {id:dataPasienSelected.pgid,namalengkap:dataPasienSelected.namadokter}
			// 	}
			// }
			$scope.simpan = function () {
				debugger;
				var objSave =
				{
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id
				}

				medifirstService.postSaveDokter(objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				medifirstService.saveUpdateDokter(objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				/* update dokter pelayanan pasien yang kosong dokternya */
				var objPost =
				{
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"objectpegawaifk": $scope.item.namaDokter.id
				}
				medifirstService.updateDokterPelPasien(objPost).then(function (e) {

				})
				medifirstService.updateDokterPelPasienNew(objPost).then(function (e) {

				})



			}
			$scope.Detail = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var objSave = {
						noregistrasi: $scope.dataPasienSelected.noregistrasi
					}
					medifirstService.postJurnalAkuntansi(objSave).then(function (data) {

					});
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihanTataRekening', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.DaftarRuangan = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}


					cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
					// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
					$state.go('AntrianPasienDiperiksa', {
						dataPasien: JSON.stringify(obj)
					});
				}
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
			$scope.cetakKartu = function () {
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.tglpulang == undefined) {
					window.messageContainer.error("Pasien Belum Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noReg = "";
				else
					var noReg = $scope.dataPasienSelected.noregistrasi;
				var stt = 'false'
				if (confirm('View Kartu Pulang? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});
			}
			$scope.SuratKontrol = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihanTataRekening', {
						dataPasien: JSON.stringify(obj)
					});
				}

				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noregistrasi = "";
				else

					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

				$state.go('PerjanjianPasien', {
					dataPasien: JSON.stringify(obj)
				});
				// var stt = 'false'
				// if (confirm('View Surat Kontrol? ')){
				//     // Save it!
				//     stt='true';
				// }else {
				//     // Do nothing!
				//     stt='false'
				// }
				// var client = new HttpClient();        
				// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-suratPerjanjianbynocm=1&nocm='+nocm+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
				//     // do something with response
				// });
			}
			$scope.EditSEP = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";

				if ($scope.dataPasienSelected.norec == null) {
					messageContainer.error("Pasien Belum Dipilih!!")
					return;
				}
				if ($scope.dataPasienSelected.kelompokpasien != "BPJS") {
					messageContainer.error("Input SEP hanya untuk pasien BPJS")
					return;
				}
				// if($scope.dataPasienSelected.norec_pa ==null){
				// 	messageContainer.error("Pemakaian Asuransi tidak ada")
				// 	return;
				// }

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
				}

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noSep = $scope.dataPasienSelected.nosep;
				}


				$scope.cboSep = true
				$scope.cboUbahSEP = false
				$scope.cboDokter = false
				$scope.cboUbahDokter = false
			}
			$scope.simpanSep = function () {
				var norec_pa = ""
				if ($scope.dataPasienSelected.norec_pa != undefined)
					norec_pa = $scope.dataPasienSelected.norec_pa
				var updateSep = {
					"norec": $scope.dataPasienSelected.norec,
					"nokepesertaan": $scope.item.noPeserta,
					"nosep": $scope.item.noSep,
					"norec_pa": norec_pa,
					"nocm": $scope.dataPasienSelected.nocm,
				}

				medifirstService.postSaveSepTarek(updateSep).then(function (e) {
					loadData();
					$scope.saveLogInputSep()
				})

				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.saveLogInputSep = function () {
				var jenisLog = 'Input SEP'
				var referensi = 'Norec Pemakaian Asuransi'
				medifirstService.get("logging/save-log-all?jenislog="
					+ jenisLog + "&referensi=" + referensi
					+ "&noreff=" + $scope.dataPasienSelected.norec_pa
					+ "&keterangan=" + $scope.item.noSep
				).then(function (data) {
					$scope.item.noPeserta = "";
					$scope.item.noSep = "";
				})
			}
			//end log
			$scope.batalSep = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";
				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				var arrrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.dataPasienSelected.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					// 4: $scope.dataPasienSelected.umur,
					5: $scope.dataPasienSelected.kelompokpasien,
					6: $scope.dataPasienSelected.tglregistrasi,
					// 7: $scope.dataPasienSelected.norec,
					8: $scope.dataPasienSelected.norec,
					// 9: $scope.dataPasienSelected.objectkelasfk,
					// 10: $scope.dataPasienSelected.namakelas,
					11: $scope.dataPasienSelected.ruanganid,
					12: $scope.dataPasienSelected.namaruangan
				}
				cacheHelper.set('cacheRekamMedis', arrrStr);
				$state.go('ResumeMedisRI')
			}
			function postKunjunganYankes() {
				let status = false
				var tanggal = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('yankes/get-kunjungan?tgl=' + tanggal)
					.then(function (a) {
						var result = a
						if (result.data.list != undefined && result.data.list.length > 0) {
							for (var i = 0; i < result.data.list.length; i++) {
								if (moment(new Date()).format('YYYY-MM-DD') == result.data.list[i].tanggal) {
									status = true
									medifirstService.get('yankes/count-kunjungan-pasien')
										.then(function (d) {
											let datt = d.data
											var jsonSave = {
												"data": {
													"kode_kirim": result.data.list[i].kode,
													"tanggal": moment(new Date()).format('YYYY-MM-DD'),
													"kunjungan_rj": datt.data.rawat_jalan,
													"kunjungan_igd": datt.data.igd,
													"pasien_ri": datt.masihDirawat// result.data.rawat_inap,
												}
											}

											medifirstService.postData('yankes/update-kunjungan', jsonSave)
												.then(function (c) {
													var resp = c.data
													if (resp.kode == 200) {
														toastr.success('Post Bridging Yankes')
													}

												}, error => {
													toastr.error('Post Bridging Yankes Gagal')
												});
										})
									break
								}
							}
						}
						if (status == false) {
							medifirstService.get('yankes/count-kunjungan-pasien')
								.then(function (b) {
									let result = b.data
									var jsonSave = {
										"data": {
											"kode_kirim": null,
											"tanggal": moment(new Date()).format('YYYY-MM-DD'),
											"kunjungan_rj": result.data.rawat_jalan,
											"kunjungan_igd": result.data.igd,
											"pasien_ri": result.masihDirawat// result.data.rawat_inap,
										}
									}

									medifirstService.postData('yankes/insert-kunjungan', jsonSave)
										.then(function (c) {
											var resp = c.data
											if (resp.kode == 200) {
												toastr.success('Post Bridging Yankes')
											}

										}, error => {
											toastr.error('Post Bridging Yankes Gagal')
										});
								})
						}
					})

			}
			function getSisrute() {
				debugger
				var now = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now).then(function (response) {
					$scope.jmlRujukanMasuk = response.data.total
					console.log('rujukan masuk : ' + response.data.total)
				})
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now + '&create=true').then(function (response) {
					$scope.jmlRujukanKeluar = response.data.total
					console.log('rujukan masuk : ' + response.data.total)
				})
			}
			// postRujukanYankes()
			function postRujukanYankes() {
				debugger
				let status = false
				medifirstService.get('yankes/get-rujukan?tgl=' + moment(new Date()).format('YYYY-MM-DD')).then(function (res) {
					var resultData = res.data.list
					if (resultData != undefined && resultData.length > 0) {
						for (var i = 0; i < resultData.length; i++) {
							if (moment(new Date()).format('YYYY-MM-DD') == resultData[i].tanggal) {
								status = true
								var jsonSave = {
									"data": {
										"kode_kirim": resultData[i].kode,
										"tanggal": resultData[i].tanggal,
										"jumlah_rujukan": $scope.jmlRujukanMasuk,
										"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,
									}
								}
								medifirstService.postData('yankes/update-rujukan', jsonSave)
									.then(function (response) {
										console.log('Update Yankes Rujukan')
									}, error => {
									});
								break
							}
						}
					}

					if (status == false) {
						var da = {
							"data": {
								"kode_kirim": null,
								"tanggal": moment(new Date()).format('YYYY-MM-DD'),
								"jumlah_rujukan": $scope.jmlRujukanMasuk,
								"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,

							}
						}

						medifirstService.postData('yankes/insert-rujukan', da)
							.then(function (response) {
								console.log('Insert Yankes Rujukan')
							}, error => {
							});
					}
				})

			}

			// END ################

		}
	]);
});