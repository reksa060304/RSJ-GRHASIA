define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarRegistrasiPasien_BankDarahCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService', 'ModelItem',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService, ModelItem) {
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.tombolSimpanVis = true;
			loadCombo();
			// loadData();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasien_BankDarahCtrl');
				if (chacePeriode != undefined) {
					////debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);

				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = $scope.now;

				}

				medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					// $scope.item.instalasi = {id:3,departemen:"Instalasi Laboratorium",ruangan:data.data.departemen[14].ruangan}
					$scope.listRuangan = $scope.item.instalasi.ruangan
					// $scope.item.ruangan = {id:41,ruangan:"BANK DARAH"}
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;

					loadData()
				})
			}

			$scope.getIsiComboRuangan = function () {
				// if ($scope.item.instalasi.departemen == "Instalasi Laboratorium" ) {
				// 	$scope.listRuangan = ({id: 41, ruangan: "BANK DARAH"})
				// }else{
					$scope.listRuangan = $scope.item.instalasi.ruangan
				// }
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = [
				{
					"field": "tglregistrasi",
					"title": "Tgl Registrasi",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
				},
				{
					"field": "noregistrasi",
					"title": "NoReg",
					"width": "80px"
				},
				{
					"field": "nocm",
					"title": "NoRM",
					"width": "80px",
					"template": "<span class='style-center'>#: nocm #</span>"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien",
					"width": "150px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
				{
					"field": "namadokter",
					"title": "Nama Dokter",
					"width": "150px",
					"template": "<span class='style-left'>#: namadokter #</span>"
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien",
					"width": "100px",
					"template": "<span class='style-left'>#: kelompokpasien #</span>"
				},
				{
					"field": "tglpulang",
					"title": "Tgl Pulang",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
				},
				{
					"field": "statuspasien",
					"title": "Status",
					"width": "80px",
					"template": "<span class='style-center'>#: statuspasien #</span>"
				},
				{
					"field": "nostruk",
					"title": "NoStrukVerif",
					"width": "100px",
					"template": "<span class='style-center'>#: nostruk #</span>"
				},
				{
					"field": "nosbm",
					"title": "NoSBM",
					"width": "100px",
					"template": "<span class='style-center'>#: nosbm #</span>"
				},
				{
					"field": "kasir",
					"title": "Kasir",
					"width": "100px",
					"template": "<span class='style-left'>#: kasir #</span>"
				}
			];

			$scope.SearchData = function () {
				loadData()
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}
				var rm = ""
				if ($scope.item.noRm != undefined) {
					var reg = "&norm=" + $scope.item.noRm
				}
				var nm = ""
				if ($scope.item.nama != undefined) {
					var nm = "&nama=" + $scope.item.nama
				}
				var ins = ""
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
				}
				var rg = ""
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
				}
				var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}


				$q.all([
					medifirstService.get("tatarekening/get-daftar-registrasi-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					$scope.dataDaftarPasienPulang = data[0].data;
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasien_BankDarahCtrl', chacePeriode);
				});

			};
			$scope.UbahDokter = function () {
				$scope.cboDokter = true
				$scope.cboUbahDokter = false
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.PasienPulang = function () {
				$scope.cbopasienpulang = true
				$scope.cboUbahDokter = false
				if ($scope.dataPasienSelected.tglpulang != null) {
					$scope.item.tanggalPulang = $scope.dataPasienSelected.tglpulang
				} else {
					$scope.item.tanggalPulang = $scope.now
				}
			}
			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}
			$scope.simpantglpulang = function () {
				var updateTanggal = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"tglpulang": $scope.item.tanggalPulang
				}
				manageTataRekening.saveupdatetglpulang(updateTanggal).then(function (e) {
					LoadData();

				})
				$scope.cbopasienpulang = false;
				$scope.cboUbahDokter = true;
			}

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
				}
			}
			$scope.simpan = function () {
				var objSave =
				{
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id
				}
				manageTataRekening.postSaveDokter(objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})
			}
			$scope.Detail = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihanTataRekening', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.DaftarRuangan = function () {
				debugger;
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

			$scope.transaksiPelayanan = function () {
				$scope.listRuanganApd = medifirstService.getMapLoginUserToRuangan();
				$scope.item.ruanganAntrian = $scope.listRuanganApd[0];
				$scope.popupAntrians.center().open();
			}

			$scope.showRincian = function () {
				// $scope.item.ruanganAntrian.id = 610
				medifirstService.get("sysadmin/general/get-apd-general?noregistrasi="
					+ $scope.dataPasienSelected.noregistrasi
				).then(function (data) {
					$scope.daftarApd = data.data.ruangan;
					if ($scope.daftarApd.length > 0) {
						var status = false
						var norec_apd = ''
						for (var i = 0; i < $scope.daftarApd.length; i++) {
							status = false
							if ($scope.daftarApd[i].id == 610){//$scope.item.ruanganAntrian.id) {
								status = true
								norec_apd = $scope.daftarApd[i].norec_apd
								break
							}
						}
						if (status == true) {
							$scope.lihatRincian(norec_apd)
						} else {
							$scope.saveKonsul()
						}
					}
				})
			}

			$scope.saveKonsul = function (argument) {
				$scope.tombolSimpanVis = false;
				var dataKonsul = {
					"asalrujukanfk": 5, //datang sendiri
					"norec_pd": $scope.dataPasienSelected.norec,
					"dokterfk": $scope.item.dokter,
					"objectruangantujuanfk": 610,//$scope.item.ruanganAntrian.id,
					"objectruanganasalfk": $scope.dataPasienSelected.objectruanganlastfk,
					"tglregistrasidate": moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD'),
				}
				medifirstService.post('laboratorium/save-apd-darah', dataKonsul).then(function (e) {
					$scope.tombolSimpanVis = true;
					var norec_apd = e.data.data.norec
					//debugger;
					var arrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.objectkelasfk,
						6: $scope.dataPasienSelected.namakelas,
						7: $scope.dataPasienSelected.tglregistrasi,
						8: norec_apd,//NOREC ANTRIAN
						9: $scope.dataPasienSelected.namaruangan,
						10: $scope.dataPasienSelected.objectruanganlastfk,
						11: $scope.dataPasienSelected.norec,
						12: $scope.dataPasienSelected.ruanganid,//nor
						13: $scope.dataPasienSelected.kelompokpasien,
						14: $scope.dataPasienSelected.pgid,
						15: 610,//$scope.item.ruanganAntrian.id,
						16: 0,//$scope.item.ruanganAntrian.objectdepartemenfk,
						17: $scope.dataPasienSelected.rekanan,
						18: $scope.dataPasienSelected.idjenispelayanan,
						19: $scope.dataPasienSelected.jenispelayanan
					}
					cacheHelper.set('RincianPelayananDarahCtrl', arrStr);
					$state.go('RincianPelayananDarah')

				}, function (error) {
					$scope.tombolSimpanVis = true;
				})
			}

			$scope.lihatRincian = function (norec_apd) {
				var idKelas = 0;
				var namaKelas = '';
				if ($scope.dataPasienSelected.objectkelasfk != 6) {
					idKelas = 6;
					namaKelas = "Non Kelas";
				} else {
					idKelas = $scope.dataPasienSelected.objectkelasfk;
					namaKelas = $scope.dataPasienSelected.namakelas;
				}				
				var arrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.dataPasienSelected.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					4: $scope.dataPasienSelected.umur,
					5: idKelas,//$scope.dataPasienSelected.objectkelasfk,
					6: namaKelas,//$scope.dataPasienSelected.namakelas,
					7: $scope.dataPasienSelected.tglregistrasi,
					8: norec_apd,//NOREC ANTRIAN
					9: $scope.dataPasienSelected.namaruangan,
					10: $scope.dataPasienSelected.objectruanganlastfk,
					11: $scope.dataPasienSelected.norec,
					12: $scope.dataPasienSelected.ruanganid,//nor
					13: $scope.dataPasienSelected.kelompokpasien,
					14: $scope.dataPasienSelected.pgid,
					15: 610,//$scope.item.ruanganAntrian.id,
					16: 0,//$scope.item.ruanganAntrian.objectdepartemenfk,
					17: $scope.dataPasienSelected.rekanan,
					18: $scope.dataPasienSelected.idjenispelayanan,
					19: $scope.dataPasienSelected.jenispelayanan
				}
				cacheHelper.set('RincianPelayananDarahCtrl', arrStr);
				$state.go('RincianPelayananDarah')
			}

			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			$scope.cetakLabel = function () {
				// if($scope.item != undefined){
				//     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
				//     window.open(fixUrlLaporan, '', 'width=800,height=600')
				// }
				$scope.dats = {
					qty: 0
				}
				$scope.dialogCetakLabel.center().open();
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

			//** BATAS */
		}
	]);
});