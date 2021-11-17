define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DetailRegistrasiCtrl', ['$state', '$q', '$scope', '$window', 'CacheHelper', 'MedifirstService',
		function ($state, $q, $scope, window, cacheHelper, medifirstService) {
			// debugger;
			$scope.now = new Date();

			$scope.cboDokter = false;
			$scope.cboUbahDokter = true;

			$scope.dataParams = JSON.parse($state.params.dataPasien);
			// debugger;
			$scope.showBilling = false;
			//$scope.urlBilling = $sce.trustAsResourceUrl(manageTataRekening.openPageBilling($scope.dataParams.noRegistrasi));

			$scope.item = {};
			$scope.konsul = {}
			$scope.isRouteLoading = false;
			var status = '';
			$scope.listJenisOrder = [{ id: 1, jenisorder: 'Ambulance' }, { id: 2, jenisorder: 'Pemulasaraan Jenazah' }]

			//  manageTataRekening.getDataTableTransaksi("akutansi/get-terakhir-posting", true).then(function(dat){
			//     var tgltgltgltgl = dat.data.data[0].max
			//     $scope.startDateOptions = {
			//         min: new Date(tgltgltgltgl),
			//         max: new Date($scope.now)
			//     };
			// })
			medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
				var tgltgltgltgl = dat.data.mindate[0].max
				var tglkpnaja = dat.data.datedate
				$scope.minDate = new Date(tgltgltgltgl);
				$scope.maxDate = new Date($scope.now);
				$scope.startDateOptions = {
					disableDates: function (date) {
						var disabled = tglkpnaja;
						if (date && disabled.indexOf(date.getDate()) > -1) {
							return true;
						} else {
							return false;
						}
					}
				};
			});
			//$scope.Pegawai=modelItemAkuntansi.getPegawai();

			LoadData();
			$scope.UbahDokter = function () {
				if (!$scope.currentRowData) {
					messageContainer.error('Data belum dipilih')
				} else {
					$scope.cboDokter = true
					$scope.cboUbahDokter = false
				}
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.UbahRekanan = function () {
				$scope.cboRekanan = true
				$scope.cboUbahDokter = false
			}
			$scope.batalRekanan = function () {
				$scope.cboRekanan = false
				$scope.cboUbahDokter = true
			}

			// $scope.listStatus = manageKasir.getStatus();

			$scope.CariNoreg = function () {
				if ($scope.item.noRegistrasi == '') {
					return;
				}
				if ($scope.item.noRegistrasi == '0') {
					return;
				}
				if ($scope.item.noRegistrasi == undefined) {
					return;
				}
				$scope.isRouteLoading = true;

				cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.item.noRegistrasi)
				//add Akomodasi
				var objSave = {
					noregistrasi: $scope.item.noRegistrasi
				}

				medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
					$q.all([
						medifirstService.getServiceArray("tatarekening/get-detail_apd?noregistrasi=" + $scope.item.noRegistrasi),
						medifirstService.getServiceArray("tatarekening/get-combo-detail-regis")
					])
						.then(function (data) {

							if (data[0].statResponse) {
								$scope.item = data[0][0];
								$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
								$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
								$scope.item.Noverifikasi = $scope.item.strukfk;

							}
							if (data[1].statResponse) {
								$scope.listDokter = data[1].dokter;
								$scope.listRuanganDokter = data[1].ruangan;
								$scope.listRekanan = data[1].rekanan;
								$scope.listKelompokPasien = data[1].kelompokpasien;
								$scope.listKelas = data[1].kelas
							}
							$scope.isRouteLoading = false;
						});

				})
				//end akomodasi
				medifirstService.get("tatarekening/get-detail-pasien?noregistrasi=" + $scope.item.noRegistrasi).then(function (e) {
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: e.data
					});
				})

				medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" + chacePeriode).then(function (e) {
					status = e.data.status;
				});
			}
			$scope.TambahObat = function () {
				//             if ($scope.item.Noverifikasi != null) {
				// 	window.messageContainer.error("Data sudah Diverifikasi");
				//                 return;
				// }

				// * Validasi Untuk Sekali Bayar
				// if(status==true){
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar

				var arrStr = {
					0: $scope.item.noCm,
					1: $scope.item.namaPasien,
					2: $scope.item.jenisKelamin,
					3: $scope.item.noRegistrasi,
					4: '-',//$scope.item.umur,
					5: $scope.item.klsid2,//$scope.item.kelas.id,
					6: $scope.item.kelasRawat,//$scope.item.kelas.namakelas,
					7: $scope.item.tglMasuk,
					8: $scope.dataSelected.norec,
					9: '',
					10: $scope.item.namaPenjamin,
					11: $scope.item.jenisPasien,
					12: 0,//$scope.item.beratBadan,
					13: '-'//$scope.item.AlergiYa
				}
				if (arrStr != null) {
					cacheHelper.set('InputResepApotikCtrl', arrStr);
					cacheHelper.set('cachePemakaianOA', arrStr);
					$state.go('InputResepApotik')
				}

			}

			function LoadData() {
				// debugger;
				var chacePeriode = ''
				chacePeriode = cacheHelper.get('AntrianPasienDiperiksaNOREG');
				if (chacePeriode == '') {
					return
				}
				if (chacePeriode == undefined) {
					return
				}

				$scope.isRouteLoading = true;
				//add Akomodasi
				var objSave = {
					noregistrasi: $scope.item.noRegistrasi
				}

				medifirstService.post('tatarekening/save-akomodasi-tea',objSave).then(function (data) {
					$q.all([
						medifirstService.getServiceArray("tatarekening/get-detail_apd?noregistrasi=" + chacePeriode),
						medifirstService.getServiceArray("tatarekening/get-combo-detail-regis")
					])
						.then(function (data) {

							if (data[0].statResponse) {
								$scope.item = data[0][0];
								$scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
								$scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
								$scope.item.Noverifikasi = $scope.item.strukfk;


								// $scope.dataRincianTagihan = new kendo.data.DataSource({
								// 	data: data[0].details
								// });
							}
							if (data[1].statResponse) {
								$scope.listDokter = data[1].dokter;
								$scope.listRuanganDokter = data[1].ruangan;
								$scope.listRekanan = data[1].rekanan;
								$scope.listKelompokPasien = data[1].kelompokpasien;
								$scope.listKelas = data[1].kelas
							}
							$scope.isRouteLoading = false;
						});
				})
				//end akomodasi	
				medifirstService.get("tatarekening/get-detail-pasien?noregistrasi=" + chacePeriode).then(function (e) {
					$scope.TglMeninggal = e.data[0].tglmeninggal
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: e.data
					});
				})
				medifirstService.get("tatarekening/get-data-master").then(function (e) {
					$scope.listJenisPetugas = e.data.JenisPetugasPelaksana;
					$scope.listPetugas = e.data.Pegawai;
					$scope.listRuangan = e.data.Ruangan;
				});
				medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" + chacePeriode).then(function (e) {
					status = e.data.status;
				});

				// manageTataRekening.postData('rensar/post-tindakan-nicu').then(function (e) {

				// });
				//           	medifirstService.get("tatarekening/get-daftar-registrasi-pasien?noReg="+chacePeriode, false).then(function(data) {
				//     $scope.item.Noverifikasi = data.data.nostruk;
				// })

			}



			$scope.dataVOloaded = true;
			$scope.now = new Date();


			$scope.rowNumber = 0;
			$scope.renderNumber = function () {
				return ++$scope.rowNumber;
			}



			$scope.columnRincianTagihan = [
				/*{
					"field": "no",
					"title": "No",
					"width":"50px",
					"template": "<span> {{renderNumber()}} </span>"
				},*/
				{
					"field": "tglregistrasi",
					"title": "Tgl Registrasi",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "150px",
				},
				{
					"field": "namadokter",
					"title": "Dokter",
					"width": "150px",
				},
				{
					"field": "namakelas",
					"title": "Kelas",
					"width": "80px",
				},
				{
					"field": "namakamar",
					"title": "Kamar",
					"width": "80px",
				},
				{
					"field": "nobed",
					"title": "Bed",
					"width": "100px"
				},
				// {
				// 	"field": "israwatgabung",
				// 	"title": "Rawat Gabung",
				// 	"width":"80px"
				// },
				{
					"field": "tglmasuk",
					"title": "Tgl Masuk",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
				},
				{
					"field": "tglkeluar",
					"title": "Tgl Keluar",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
				}
			];



			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.InputTindakan = function () {
				if ($scope.dataSelected == undefined) {
					alert("Pilih pelayanan dahulu!");
					return;
				}
				// if ($scope.dataSelected.nostruklastfk != null 
				// 	&&
				// 	$scope.dataSelected.rpp != null 
				// 	) {
				// 	window.messageContainer.error("Data sudah Diverifikasi");
				//                 return;
				// }

				// * Validasi Untuk Sekali Bayar
				// if(status==true){
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar

				if ($scope.item) {
					$state.go('dashboardpasien.InputBilling', {
						noRec: $scope.currentRowData.norec,
						noAntrianPasien: $scope.currentRowData.norec,
						noRegister: $scope.item.norec_pd
					});
				} else {
					messageContainer.error('Pasien belum di pilih')
				}
			}
			$scope.Detail = function () {
				if ($scope.item.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.item.noRegistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.klik = function (rowClick) {
				$scope.currentRowData = rowClick;
			}

			$scope.DaftarRuangan = function () {
				if ($scope.currentRowData === undefined) {
					messageContainer.error("Pilih data terlebih dahulu");
					return
				} else {

					$scope.konsul.kelas = $scope.listKelas[3]

					$scope.cboDokter = false;
					$scope.cboUbahDokter = false;
					$scope.cboKonsul = true;
					$scope.showUbahTanggal = false;
				}
			}
			$scope.getKelas = function (ruangan) {
				if (ruangan != undefined && ruangan.namaruangan.indexOf('Bedah') > -1) {
					$scope.konsul.kelas = { id: $scope.currentRowData.kelasid, namakelas: $scope.currentRowData.namakelas }
				}
			}
			$scope.simpanKonsul = function () {
				var current = $scope.currentRowData;
				var length = $scope.dataRincianTagihan._data.length + 1;
				var dataKonsul = {
					"asalrujukanfk": current.objectasalrujukanfk,
					"kelasfk": $scope.konsul.kelas.id,//6,//nonKelas current.kelasid,
					"noantrian": length,
					"norec_pd": $scope.item.norec_pd,
					"dokterfk": $scope.konsul.namaDokter.id,
					"objectruangantujuanfk": $scope.konsul.ruangan.id,
					"objectruanganasalfk": current.ruid_asal
				}
				medifirstService.post('tatarekening/save-konsul-keruangan',dataKonsul).then(function (e) {
					LoadData();
					$scope.saveLogKonsul();
					$scope.batalKonsul();

				})
			}
			//#save Log Konsul
			$scope.saveLogKonsul = function () {
				medifirstService.get("sysadmin/logging/save-log-konsul?norec_pd="
					+ $scope.item.norec_pd
					+ "&dokterfk="
					+ $scope.konsul.namaDokter.id
					+ "&kelasfk="
					+ $scope.currentRowData.kelasid
					+ "&objectruangantujuanfk="
					+ $scope.konsul.ruangan.id).then(function (data) {
					})
			}
			$scope.saveLogUbahRekanan = function () {
				medifirstService.get("sysadmin/logging/save-log-ubah-rekanan?norec_pd="
					+ $scope.item.norec_pd
				).then(function (data) {
				})
			}
			//end log
			$scope.batalKonsul = function () {
				$scope.cboUbahDokter = true;
				$scope.cboKonsul = false;

			}
			$scope.simpan = function () {
				var current = $scope.currentRowData;
				var length = $scope.dataRincianTagihan._data.length + 1;
				var updateDokter = {
					"norec_apd": current.norec,
					"objectpegawaifk": $scope.item.namaDokter.id
				}
				medifirstService.post('tatarekening/save-update-dokter_apd',updateDokter).then(function (e) {
					LoadData();
					$scope.batal();
				})
			}
			$scope.simpanRekanan = function () {
				if ($scope.item.kelompokPasien == undefined) {
					window.messageContainer.error("Pilih Kelompok Pasien dahulu!");
					return;
				}
				var rekanan = null
				if ($scope.item.namaRekanan != undefined) {
					rekanan = $scope.item.namaRekanan.id
				}
				var current = $scope.currentRowData;
				var length = $scope.dataRincianTagihan._data.length + 1;
				var updateDokter = {
					"norec_pd": $scope.item.norec_pd,
					"objectrekananfk": rekanan,
					"objectkelompokpasienlastfk": $scope.item.kelompokPasien.id
				}
				medifirstService.post('tatarekening/save-update-rekanan_pd',updateDokter).then(function (e) {
					LoadData();
					$scope.saveLogUbahRekanan();
					$scope.batalRekanan();
				})
			}
			$scope.saveLogging = function (jenis, referensi, noreff, ket) {
				medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
					+ "&referensi=" + referensi
					+ "&noreff=" + noreff
					+ "&keterangan=" + ket
				).then(function (data) {

				})
			}
			$scope.HapusRegistrasi = function () {
				if (!$scope.currentRowData) {
					window.messageContainer.error('Data belum dipilih');
					return;
				} else if ($scope.currentRowData.objectdepartemenfk == 16 || $scope.currentRowData.objectdepartemenfk == 25) {
					window.messageContainer.error('Data Antrian Rawat Inap Tidak Bisa Dihapus, Harap Hubungi IT!');
					return;
				} else {
					var dataJson = {
						norec_apd: $scope.currentRowData.norec
					}
					medifirstService.post('tatarekening/hapus-antrian-pasien',dataJson).then(function (e) {
						if (e.status == 201) {
							$scope.saveLogging('Hapus Konsul', 'norec Pasien Daftar',
								$scope.item.norec_pd, $scope.currentRowData.namaruangan)
						}
						LoadData();
						// $scope.batalKonsul();
					})
				}
			}

			$scope.EditRegistrasi = function () {
				$state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
					noCm: $scope.item.noCm
				});
				var cacheSet = $scope.item.norec_pd
					+ "~" + $scope.item.noRegistrasi
					+ "~" + $scope.dataSelected.norec;
				cacheHelper.set('CacheRegistrasiPasien', cacheSet);
			}
			$scope.InputTindakanBeta = function () {

				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}

				// if ($scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//return;
				// }

				// * Validasi Untuk Sekali Bayar
				// if(status==true){
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar

				if ($scope.item) {
					$state.go('InputTindakan', {
						norecPD: $scope.item.norec_pd,
						norecAPD: $scope.currentRowData.norec,

					});
				} else {
					messageContainer.error('Pasien belum di pilih')
				}
			}

			$scope.PindahPulang = function () {
				if ($scope.item.tglPulang != "Invalid date") {
					toastr.error('Pasien Sudah Di Pulangkan', 'Informasi');
				} else {
					// medifirstService.get("pindahpasien/get-ruangan-last?norec_pd="+$scope.item.norec_pd).then(function (e) {
					//  $scope.item.ruanganLast=e.data.data[0].objectruanganlastfk
					// if ($scope.item.ruanganLast !=undefined){
					medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.item.noRegistrasi
						+ '&namaRuangan=' + $scope.item.lastRuangan).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.item.norec_pd,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.item.ruanganLast
								cacheHelper.set('CachePindah', CachePindah);
							}
						})
					// }
					// })	
				}
			}
			$scope.UbahTanggal = function () {
				if ($scope.currentRowData === undefined) {
					messageContainer.error("Pilih data terlebih dahulu");
				} else {
					$scope.item.tglRegiss = new Date();
					$scope.item.tglMasuks = new Date();
					$scope.item.tglKeluars = new Date();
					$scope.cboDokter = false;
					$scope.cboUbahDokter = false;
					$scope.showUbahTanggal = true;
					$scope.item.cekTglRegis = false;
					$scope.item.cekTglMasuk = false;
					$scope.item.cekTglKeluar = false;
				}
			}
			$scope.batalUbahTanggal = function () {
				$scope.cboUbahDokter = true;
				$scope.showUbahTanggal = false;

			}

			$scope.simpanTanggal = function () {

				var tglregistrasis = "";
				if ($scope.item.cekTglRegis) {
					tglregistrasis = moment($scope.item.tglRegiss).format('YYYY-MM-DD HH:mm:ss')
				}
				var tglmasuks = "";
				if ($scope.item.cekTglMasuk) {
					tglmasuks = moment($scope.item.tglMasuks).format('YYYY-MM-DD HH:mm:ss')
				}
				var tglkeluars = "";
				if ($scope.item.cekTglKeluar) {
					tglkeluars = moment($scope.item.tglKeluars).format('YYYY-MM-DD HH:mm:ss')
				}

				var dataJson = {
					noregistrasi: $scope.item.noRegistrasi,
					norec_pd: $scope.item.norec_pd,
					ruanganasal: $scope.currentRowData.ruid_asal,
					norec_apd: $scope.currentRowData.norec,
					tglregistrasi: tglregistrasis,
					tglmasuk: tglmasuks,
					tglkeluar: tglkeluars
				}
				medifirstService.post('tatarekening/ubah-tgl-detailregistrasi',dataJson).then(function (e) {
					if (e.status = 201) {
						$scope.saveLogging('Ubah Tgl Detail Registrasi', 'norec Antrian Pasien Diperiksa',
							$scope.currentRowData.norec, 'Ubah Tgl di Detail Registrasi pada No Registrasi ' + $scope.item.noRegistrasi)
						LoadData();
						$scope.batalUbahTanggal();
					}
				})

			}


			$scope.orderPenunjang = function () {
				// * Validasi Untuk Sekali Bayar
				//if(status==true){
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar

				if ($scope.currentRowData != undefined) {
					$state.go('OrderPenunjang', {
						norecPD: $scope.item.norec_pd,
						norecAPD: $scope.currentRowData.norec,
					});

				}
			}

			$scope.NonLayanan = function () {
				$scope.popUp.center().open();
			}

			$scope.OrderNonLayanan = function () {
				if ($scope.item.jenisOrder == undefined) {
					window.messageContainer.error("Jenis Order Harus Di isi!");
					return;
				}

				if ($scope.item.jenisOrder.id == 2) {
					if ($scope.TglMeninggal == undefined && $scope.item.tglPulang == undefined || $scope.item.tglPulang == "Invalid date") {
						toastr.error('Pasien Masih Hidup, Tidak Bisa Melakukan Order Jenazah', 'Informasi');
						return
					}

					if ($scope.currentRowData != undefined) {
						$state.go('OrderJenazah', {
							norecPD: $scope.item.norec_pd,
							norecAPD: $scope.currentRowData.norec,
						});
					}
				} else if ($scope.item.jenisOrder.id == 1) {
					if ($scope.currentRowData != undefined) {
						$state.go('OrderAmbulan', {
							norecPD: $scope.item.norec_pd,
							norecAPD: $scope.currentRowData.norec,
						});
					}
				}
			}

			$scope.batalOrder = function () {
				$scope.item.jenisOrder = undefined;
				$scope.popUp.close();
			}

			$scope.rekapBilling = function () {
				var chacePeriode = ''
				chacePeriode = cacheHelper.get('AntrianPasienDiperiksaNOREG');
				if (chacePeriode == '') {
					return
				}
				if (chacePeriode == undefined) {
					return
				}
				var obj = {
					noRegistrasi: chacePeriode
				}

				$state.go('RekapTagihan', {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.InputMutu = function () {

				if ($scope.dataSelected == undefined) {
					window.messageContainer.error("Pilih pelayanan dahulu!");
					return;
				}

				// if ($scope.dataSelected.strukfk != ' / ') {
				// 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
				//return;
				// }

				// * Validasi Untuk Sekali Bayar
				// if(status==true){
				// 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
				//return;
				// }
				// * Validasi Untuk Sekali Bayar

				if ($scope.item) {
					$state.go('InputMutu', {
						norecPD: $scope.item.norec_pd,
						norecAPD: $scope.currentRowData.norec,

					});
				} else {
					messageContainer.error('Pasien belum di pilih')
				}
			}
			//END
		}
	]);
});