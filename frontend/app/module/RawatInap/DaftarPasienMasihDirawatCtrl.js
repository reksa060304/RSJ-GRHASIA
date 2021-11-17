define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienMasihDirawatCtrl', ['MedifirstService', 'CacheHelper', '$state', '$q', '$scope', 'DateHelper', '$mdDialog', 'ModelItem',
		function (medifirstService, cacheHelper, $state, $q, $scope, DateHelper, $mdDialog, ModelItem) {

			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			var data2 = [];
			var dataInap = [];
			$scope.tombolSimpanBatalPindah = true
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
			$scope.item.periodeAkhir = $scope.now;

			$scope.item.jmlRows = 100
			LoadCache();
			loadData()
			loadCombo()

			function LoadCache() {
				var chacePeriode = cacheHelper.get('cacheDaftarMasihDirawat');
				if (chacePeriode != undefined) {
					$scope.item.ruangan = chacePeriode[0]
					if (chacePeriode[1] != '')
						$scope.item.jmlRows = chacePeriode[1]
					if (chacePeriode[2] != '')
						$scope.item.noRm = chacePeriode[2]

					loadData()
				}
				else {
					loadData()
				}
			}
			function loadCombo() {
				medifirstService.get("rawatinap/get-combo-pasien-masih-dirawat", false).then(function (data) {
					// $scope.listDepartemen = data.data.departemen;
					// $scope.listKelompokPasien = data.data.kelompokpasien;
					var data = data.data
					$scope.listRuangan = data.ruanganRi
					var datasu = data;
					$scope.item.kdPelayananRanap = datasu.kddeptlayananranap.nilaifield;
					$scope.item.kdPelayananOk = datasu.kddeptlayananok.nilaifield;
					$scope.sourceJenisDiagnosisPrimer = datasu.jenisdiagnosa;
					$scope.item.jenisDiagnosis = { id: datasu.jenisdiagnosa[1].id, jenisdiagnosa:datasu.jenisdiagnosa[1].jenisdiagnosa };
					
				})
				// modelItemAkuntansi.getDataGeneric("ruangan", false).then(function(data) {
				// 	$scope.listRuangan = data;
				// })
			}


			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			var onDataBound = function () {
				$('td').each(function () {
					if ($(this).text() == '28 Hari') { $(this).addClass('red') }
				})
			}
			$scope.columnDaftarPasienPulang = {
				scrollable: true,
				dataBound: onDataBound,
				columns: [
					{
						"field": "tglregistrasi",
						"title": "Tgl Registrasi",
						"width": "130px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
					},

					{
						"field": "nocm",
						"title": "No RM",
						"width": "80px",
						"template": "<span class='style-center'>#: nocm #</span>"
					},
					{
						"field": "noregistrasi",
						"title": "No Registrasi",
						"width": "100px",
						"template": "<span class='style-center'>#: noregistrasi #</span>"
					},
					{
						"field": "nobpjs",
						"title": "No BPJS",
						"width": "100px",
						"template": "<span class='style-center'>#: nobpjs #</span>"
					},
					{
						"field": "namapasien",
						"title": "Nama Pasien",
						"width": "200px",
						"template": "<span class='style-left'>#: namapasien #</span>"
					},
					{
						"field": "alamatlengkap",
						"title": "Alamat",
						"width": "300px",
						"template": "<span class='style-center'>#: alamatlengkap #</span>"
					},
					{
						"field": "umur",
						"title": "Umur",
						"width": "150px",
						"template": "<span class='style-left'>#: umur #</span>"
					},
					{
						"field": "namadokter",
						"title": "Dokter",
						"width": "150px",
						// "template": "<span class='style-left'>#: namadokter #</span>"
						"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
					},
					{
						"field": "jeniskelamin",
						"title": "JK",
						"width": "80px",
						"template": "<span class='style-left'>#: jeniskelamin #</span>"
					},
					{
						"field": "namaruangan",
						"title": "Ruangan",
						"width": "150px",
						"template": "<span class='style-left'>#: namaruangan #</span>"
					},
					{
						"field": "namakamar",
						"title": "Kamar",
						"width": "100px",
						"template": '# if( namakamar==null) {# - # } else {# #= namakamar # #} #'
					},
					{
						"field": "namabed",
						"title": "Bed",
						"width": "80px",
						"template": '# if( namabed==null) {# - # } else {# #= namabed # #} #'
					},
					{
						"field": "namakelas",
						"title": "Kelas",
						"width": "80px",
						"template": "<span class='style-left'>#:  namakelas #</span>"
					},
					{
						"field": "kelompokpasien",
						"title": "Tipe Pembayaran",
						"width": "150px",
						"template": "<span class='style-center'>#: kelompokpasien #</span>"
					},
					{
						"field": "lamarawat",
						"title": "Lama Rawat",
						"width": "100px",
						"template": "<span class='style-center'>#: lamarawat #</span>"
					}
				]
			}

			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}



			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;
				$scope.item.ruangan = { namaExternal: "" };
				$scope.SearchData();
			}

			//fungsi search data
			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');
				var tempRuanganArr = {}
				if ($scope.item.ruangan == undefined) {
					var rg = ""
				} else {
					var rg = "&ruanganId=" + $scope.item.ruangan.id
					tempRuanganArr = { id: $scope.item.ruangan.id, namaruangan: $scope.item.ruangan.namaruangan }
				}
				if ($scope.item.noReg == undefined) {
					var reg = ""
					var tempNoREG = ""
				} else {
					var reg = "&noReg=" + $scope.item.noReg
					var tempNoREG = $scope.item.noReg
				}
				if ($scope.item.noRm == undefined) {
					var rm = ""
					var tempRM = ""
				} else {
					var rm = "&noRm=" + $scope.item.noRm
					var tempRM = $scope.item.noRm
				}
				if ($scope.item.nama == undefined) {
					var nm = ""
				} else {
					var nm = "namaPasien=" + $scope.item.nama
				}

				var jmlRow = ""
				if ($scope.item.jmlRows != undefined) {
					jmlRow = $scope.item.jmlRows
				}
				var chacePeriode = {
					0: tempRuanganArr,
					1: jmlRow,
					2: tempRM

				}
				cacheHelper.set('cacheDaftarMasihDirawat', chacePeriode);

				$scope.isRouteLoading = true;

				medifirstService.get("rawatinap/get-daftar-pasien-masih-dirawat?"
					+ nm + reg + rg + rm + "&jmlRow=" + jmlRow
					// + "&tglAwal="+ tglAwal +"&tglAkhir="+ tglAkhir

				).then(function (data) {
					if (data.statResponse) {
						var data = data.data
						for (var i = 0; i < data.data.length; i++) {
							// data.data[i].no = i+1
							var tanggal = $scope.now;
							var tanggalLahir = new Date(data.data[i].tgllahir);
							var umur = DateHelper.CountAge(tanggalLahir, tanggal);
							data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

						}
						$scope.isRouteLoading = false;
						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							data: data.data,
							pageSize: 10,
							total: data.data.length,
							serverPaging: false,


						});
					} else {
						$scope.isRouteLoading = false;
					}


				});
				// var chacePeriode = tglAwal + ":" + tglAkhir;
				// cacheHelper.set('DaftarPasienAktif', chacePeriode);
			}


			$scope.pindah = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('rawatinap/get-antrian-pasien-diperiksa?noreg=' + $scope.dataPasienSelected.noregistrasi
						+ '&ruangId=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.dataPasienSelected.norec_pd,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.dataPasienSelected.ruanganid
								cacheHelper.set('CachePindah', CachePindah);
							}

						})

				}
			}

			$scope.DaftarRuangan = function () {

				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}


					cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
					// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
					$state.go('DetailRegistrasi', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			$scope.BatalRanap = function () {
				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Pasien Dahulu!");
					return;
				}

				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Apakah Anda Yakin Akan Membatalkan Pelayanan Rawat Inap Pasien Ini?')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					HapusRanap();
				})

				//                		}
				// // });			  	
				// }
			}

			function HapusRanap() {
				var objSave = {
					data: $scope.dataPasienSelected
				}
				$scope.tombolBatalRanap = true
				$scope.isRouteLoading = true
				medifirstService.post('rawatinap/save-batal-rawat-inap', objSave).then(function (e) {
					$scope.tombolBatalRanap = false
					$scope.isRouteLoading = false

					loadData();
				}, function (error) {
					$scope.tombolBatalRanap = false
				});

			}
			$scope.batalPindah = function () {
				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Pasien Dahulu!");
					return;
				}
				$scope.tombolSimpanBatalPindah = false
				medifirstService.post('rawatinap/save-batal-pindah-ruangan', $scope.dataPasienSelected).then(function (e) {
					loadData();
					$scope.tombolSimpanBatalPindah = true
				}, function (error) {
					$scope.tombolSimpanBatalPindah = true
				});
			}
			$scope.terimaKamar = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.listNoBed = []
				$scope.listKamar = []

				delete $scope.item.kamar
				delete $scope.item.nomorTempatTidur
				getKamar($scope.dataPasienSelected.objectruanganlastfk, $scope.dataPasienSelected.objectkelasfk)

				// $scope.item.kamar = {id:$scope.dataPasienSelected.objectkamarfk,namakamar: $scope.dataPasienSelected.namakamar  }
				// $scope.item.nomorTempatTidur = {id:$scope.dataPasienSelected.nobed,reportdisplay: $scope.dataPasienSelected.namabed  }
				$scope.winDialog.center().open()
			}
			$scope.$watch('item.kamar', function (e) {
				if (e === undefined) return;
				var kamarId = $scope.item.kamar.id;
				medifirstService.get("registrasi/get-nobedbykamar?idKamar=" + kamarId)
					.then(function (a) {
						if ($scope.item.rawatGabung) {
							$scope.listNoBed = a.data.bed;
						} else {
							$scope.listNoBed = _.filter(a.data.bed, function (v) {
								return v.statusbed === "KOSONG";
							})
						}
					})
			});
			function getKamar(ruanganId, kelasId) {
				if (ruanganId == undefined && kelasId == undefined) return;
				var kelasIds = "idKelas=" + kelasId
				var ruanganIds = "&idRuangan=" + ruanganId
				medifirstService.get("registrasi/get-kamarbyruangankelas?" + kelasIds + ruanganIds)
					.then(function (b) {
						if ($scope.item.rawatGabung) {
							$scope.listKamar = b.data.kamar;
						} else {
							$scope.listKamar = b.data.kamar;
							// $scope.listKamar = _.filter(b.data.kamar, function (v) {
							// 	return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
							// })
						}
					});
			}
			$scope.simpanKamar = function () {
				var json = {
					'norec_pd': $scope.dataPasienSelected.norec_pd,
					'ruanganlastfk': $scope.dataPasienSelected.objectruanganlastfk,
					'objectkamarfk': $scope.item.kamar.id,
					'nobed': $scope.item.nomorTempatTidur.id,
					'nobedasal': $scope.dataPasienSelected.nobed,

				}
				medifirstService.post("rawatinap/update-kamar", json)
					.then(function (b) {
						delete $scope.item.kamar
						delete $scope.item.nomorTempatTidur

						loadData()
						$scope.winDialog.close()

					});
			}
			$scope.tutup = function () {
				delete $scope.item.kamar
				delete $scope.item.nomorTempatTidur
				$scope.winDialog.close()
			}
			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			$scope.labelpasien = function () {
				// if($scope.item != undefined){
				//     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
				//     window.open(fixUrlLaporan, '', 'width=800,height=600')
				// }
				$scope.dats = {
					qty: 1
				}
				$scope.dialogCetakLabel.center().open();
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
			$scope.pilihQty = function (data) {
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {
					var qty = data.qty;
					var qtyhasil = data.qty * 2;
					if (qty !== undefined) {
						// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
						// window.open(fixUrlLaporan, '', 'width=800,height=600')
						//cetakan langsung service VB6 by grh

						//##save identifikasi label pasien
						medifirstService.get("registrasi/identifikasi-label?norec_pd="
							+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil
						).then(function (data) {
							var datas = data.data;
						})
						//##end

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
							// do something with response
						});

					}
					$scope.dialogCetakLabel.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			};


			$scope.GelangPasien = function () {
				var stt = 'false'
				if (confirm('View Lembar Gelang Pasien? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=' + stt + '&qty=' + 1, function (response) {
					// do something with response
				});
			}
			medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
				$scope.sourceDiagnosisPrimer = data;
			});
			$scope.RMK = function () {
				if($scope.dataPasienSelected == undefined){
					toastr.error('Pilih data dulu')
					return
				}
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				delete  $scope.item.diagnosisPrimer
				delete  $scope.item.keteranganDiagnosis
				// if ($scope.dataPasienSelected.noregistrasi != undefined) {
				getDiagnosaRMK(norReg)
				// }
			}

			function getDiagnosaRMK(norReg){
				medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?"
						+ norReg
						).then(function (data) {

							var datas = data.data.datas[0];
							if (datas != undefined && datas != null) {
								if (datas.jenisdiagnosa != null) {
									$scope.sourceDiagnosisPrimer.add({
										id: datas.id,
										jenisdiagnosa: datas.jenisdiagnosa,
										kddiagnosa: datas.kddiagnosa,
										ketdiagnosis: datas.ketdiagnosis,
										keterangan: datas.keterangan,
										namadiagnosa: datas.namadiagnosa,
										norec_apd: datas.norec_apd,
										norec_detaildpasien: datas.norec_detaildpasien,
										norec_diagnosapasien: datas.norec_diagnosapasien,
										noregistrasi: datas.noregistrasi
									})
								}

								$scope.item.norec_apd = datas.norec_apd;
								$scope.item.keteranganDiagnosis = datas.keterangan;
								$scope.item.diagnosisPrimer = {
									id: datas.id,
									kddiagnosa: datas.kddiagnosa,
									namadiagnosa: datas.namadiagnosa
								}
							}

							$scope.icd10.center().open();
						});

			}
			$scope.cetakRMK = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?"
					+ norReg
				).then(function (data) {
					var dataDiagnosa = data.data.datas[0]

					if ($scope.item.jenisDiagnosis == undefined) {
						alert("Pilih Jenis Diagnosa terlebih dahulu!!")
						return
					}
					if ($scope.item.diagnosisPrimer == undefined) {
						alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
						return
					}

					var norecDiagnosaPasien = "";
					if (dataDiagnosa != undefined) {
						norecDiagnosaPasien = dataDiagnosa.norec_diagnosapasien;
					}

					var keterangan = "";
					if ($scope.item.keteranganDiagnosis == undefined) {
						keterangan = "-"
					}
					else {
						keterangan = $scope.item.keteranganDiagnosis;
					}


					$scope.now = new Date();
					var detaildiagnosapasien = {
						norec_dp: norecDiagnosaPasien,
						noregistrasifk: dataDiagnosa.norec_apd,
						objectdiagnosafk: $scope.item.diagnosisPrimer.id,
						objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
						tglpendaftaran: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
						tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
						keterangan: keterangan
					}
					medifirstService.post('registrasi/daftar-registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
						$scope.item.keteranganDiagnosis = "";
						$scope.item.diagnosisPrimer = "";
						loadData()
						$scope.icd10.close();

						//##save identifikasi rmk
						medifirstService.get("registrasi/identifikasi-rmk?norec_pd="
							+ $scope.dataPasienSelected.norec 
						).then(function (data) {
							var datas = data.data;
						})
						//##end 

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + dataDiagnosa.norec_apd + '&umur=' + $scope.dataPasienSelected.umur + '&view=false', function (response) {
						});
						// $scope.cetakBro();
					})
				});



			}
			$scope.batalCetakRMK = function () {
				$scope.item.keteranganDiagnosis = "";
				$scope.item.diagnosisPrimer = "";
				$scope.icd10.close();
			}


			$scope.cetakRMK = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?"
					+ norReg
				).then(function (data) {
					var dataDiagnosa = data.data.datas[0]

					// if ($scope.item.jenisDiagnosis == undefined) {
					// 	alert("Pilih Jenis Diagnosa terlebih dahulu!!")
					// 	return
					// }
					// if ($scope.item.diagnosisPrimer == undefined) {
					// 	alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
					// 	return
					// }

					var norecDiagnosaPasien = "";
					if (dataDiagnosa != undefined) {
						norecDiagnosaPasien = dataDiagnosa.norec_diagnosapasien;
					}

					var keterangan = "";
					if ($scope.item.keteranganDiagnosis == undefined) {
						keterangan = "-"
					}
					else {
						keterangan = $scope.item.keteranganDiagnosis;
					}


					$scope.now = new Date();
					// var detaildiagnosapasien = {
					// 	// norec_dp: norecDiagnosaPasien,
					// 	noregistrasifk: dataDiagnosa.norec_apd,
					// 	objectdiagnosafk: $scope.item.diagnosisPrimer.id,
					// 	objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
					// 	tglpendaftaran: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
					// 	tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
					// 	keterangan: keterangan
					// }
					// medifirstService.post('registrasi/daftar-registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
					// 	$scope.item.keteranganDiagnosis = "";
					// 	$scope.item.diagnosisPrimer = "";
					// 	loadData()
					// 	$scope.icd10.close();

					// 	//##save identifikasi rmk
					// 	medifirstService.get("registrasi/identifikasi-rmk?norec_pd="
					// 		+ $scope.dataPasienSelected.norec 
					// 	).then(function (data) {
					// 		var datas = data.data;
					// 	})
						//##end 

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + dataDiagnosa.norec_apd + '&umur=' + $scope.dataPasienSelected.umur + '&view=false', function (response) {
						});
						// $scope.cetakBro();
					// })
				});
			}

			////////////////////// -TAMAT- /////////////////////////
		}
	]);
});