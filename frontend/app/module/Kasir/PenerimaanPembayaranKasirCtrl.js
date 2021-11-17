define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('PenerimaanPembayaranKasirCtrl', ['$mdDialog', '$state', '$q', '$scope', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, medifirstService) {
			$scope.dataParams = JSON.parse($state.params.dataPasien);
			$scope.now = new Date();
			$scope.showCC = false;
			$scope.item = {};
			$scope.dataPrevPage = {};
			$scope.defaultPage = "";
			var buttonDisabled = false;
			var dataPegawai = [];
			$scope.dataDaftarBayarSelected = {};
			$scope.daftarBayar = new kendo.data.DataSource({
				data: []
			});
			$scope.listCetakan = [
				{ id: 1, nama: "Kwitansi" },
				{ id: 2, nama: "Kwitansi Layanan" },
			]
			FormLoad();
			showButton();

			function showButton() {
				$scope.showBtnSimpan = true;
				$scope.showBtnKembali = true;
				$scope.showBtnCetak = true;
			}

			function FormLoad() {
				//#############	
				medifirstService.get('kasir/get-data-combo-kasir').then(function (dat) {
					dataPegawai = dat.data.datakasir;
					if (dataPegawai != undefined) {
						$scope.item.kasir = dataPegawai.namalengkap;
					} else {
						$scope.item.kasir = "";
					}
				});
			}

			$scope.columnDaftarBayar = [
				{
					"field": "caraBayar",
					"title": "Cara Bayar",
					"width": "200px",
					"template": "<span class='style-left'>#: caraBayar #</span>"
				},
				{
					"field": "nominal",
					"title": "Nominal",
					"width": "50px",
					"template": "<span class='style-right'>{{formatRupiah('#: nominal #', 'Rp.')}}</span>"
				},
				{
					"width": "50px",
					"title": "Action",
					"template": "<span class='style-center'><button class='btnHapus' ng-click='hapusDataBayar()'>Hapus</button></span>"
				},

			];

			$scope.detailGridOptions = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.detailPembayaran
					}),
					columns: [{
						field: "noKartu",
						title: "No. Kartu"
					},
					{
						field: "namaKartu",
						title: "Nama Kartu"
					},
					{
						field: "jenisKartu.namaExternal",
						title: "Jenis Kartu"
					}]
				};
			};

			$scope.tambahCaraBayar = function () {
				var listRawRequired = [
					"item.caraBayar|k-ng-model|Cara bayar",
					"item.nominal|ng-model|Nominal"
				]

				var isValid = medifirstService.setValidation($scope, listRawRequired);

				if (isValid.status) {
					var tempDataCaraBayar = {
						"id": $scope.item.caraBayar.id,
						"caraBayar": $scope.item.caraBayar.namaExternal,
						"nominal": $scope.item.nominal
					}

					if ($scope.showCC) {
						tempDataCaraBayar.detailPembayaran = [{
							"noKartu": $scope.item.noKartu,
							"namaKartu": $scope.item.namaKartu,
							"jenisKartu": $scope.item.jenisKartu
						}]

						$scope.item.noKartu = "";
						$scope.item.namaKartu = "";
						$scope.item.jenisKartu = "";
					}
					else {
						tempDataCaraBayar.detailPembayaran = [{}]
					}


					var isExist = _.find($scope.daftarBayar._data, function (dataExist) { return dataExist.id == tempDataCaraBayar.id; });

					if (isExist == undefined) {
						$scope.daftarBayar.add(tempDataCaraBayar);
						$scope.item.totalFixBayar = 0;
						for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
							$scope.item.totalFixBayar = parseFloat($scope.item.totalFixBayar) + parseFloat($scope.daftarBayar._data[i].nominal);
						}

						$scope.item.nominal = $scope.setDefaultNominal();

					}
					else {
						var confirm = $mdDialog.confirm()
							.title('Peringatan!')
							.textContent('Metode pembayaran ' + tempDataCaraBayar.caraBayar + " sudah ada")
							.ariaLabel('Lucky day')
							.ok('Ok')

						$mdDialog.show(confirm).then(function () {

						});
					}
				}
				else {
					medifirstService.showMessages(isValid.messages);
				}
			}

			$scope.setDefaultNominal = function () {
				return $scope.item.jumlahBayarFix - $scope.item.totalFixBayar;
			}

			$scope.hapusDataBayar = function () {
				if ($scope.dataDaftarBayarSelected) {
					if (this.dataItem.id != $scope.dataDaftarBayarSelected.id) {
						var confirm = $mdDialog.confirm()
							.title('Peringatan!')
							.textContent('Silahkan pilih baris data terlebih dahulu')
							.ariaLabel('Lucky day')
							.ok('Ok')

						$mdDialog.show(confirm).then(function () {

						});
					}
					else {
						var isExist = _.find($scope.daftarBayar._data, function (dataExist) { return dataExist.id == $scope.dataDaftarBayarSelected.id; });
						if (isExist != undefined) {
							$scope.daftarBayar.remove(isExist);
							$scope.item.totalFixBayar = 0;
							for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
								$scope.item.totalFixBayar = parseInt($scope.item.totalFixBayar) + parseInt($scope.daftarBayar._data[i].nominal);
							}

							$scope.item.nominal = $scope.setDefaultNominal();
						}
					}
				}
			}




			var urlGetDataDetail = "";
			switch ($scope.dataParams.pageFrom) {
				case "PembayaranTagihanLayananKasir":
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanPasien",
					}
					$scope.defaultPage = "DaftarPasienPulang";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;
				case "PembayaranTagihanNonLayananKasir":					
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanNonLayanan",
					}
					$scope.defaultPage = "DaftarNonLayananKasir";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;
				case "InputTagihanNonLayanan":					
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanNonLayanan",
					}
					$scope.defaultPage = "DaftarNonLayananKasir";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;
				case "DaftarNonLayananKasir":					
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanNonLayanan",
					}
					$scope.defaultPage = "DaftarNonLayananKasir";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;
				case "DaftarPenjualanApotekKasir/terimaUmum":				
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanNonLayanan",
					}
					$scope.defaultPage = "DaftarPenjualanApotekKasir/terimaUmum";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;

				case "DaftarPenjualanApotekKasir/obatBebas":					
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "tagihanNonLayanan",
					}
					$scope.defaultPage = "DaftarPenjualanApotekKasir/obatBebas";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
					break;
				case "PenyetoranDepositKasir":
					$scope.dataPrevPage = {
						noRegistrasi: $scope.dataParams.noRegistrasi,
						tipePembayaran: "depositPasien",
						jumlahBayar: $scope.dataParams.jumlahBayar
					}
					$scope.defaultPage = "DaftarPasienAktif";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRegistrasi=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=depositPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
					break;
				case "PenyetoranDepositKasirKembali":
					$scope.dataPrevPage = {
						noRegistrasi: $scope.dataParams.noRegistrasi,
						tipePembayaran: "PenyetoranDepositKasirKembali",
						jumlahBayar: $scope.dataParams.jumlahBayar
					}
					$scope.defaultPage = "DaftarPasienAktif";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRegistrasi=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=depositPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
					break;
				case "PembayaranPiutangKasir":
					$scope.dataPrevPage = {
						noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
						tipePembayaran: "cicilanPasien",
						jumlahBayar: $scope.dataParams.jumlahBayar,						
					}
					//$scope.defaultPage = "DaftarPasienPulangKasir";
					$scope.defaultPage = "DaftarPiutangKasir";
					urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=cicilanPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
					break;
			}

			$q.all([
				medifirstService.get(urlGetDataDetail),
				medifirstService.get('kasir/get-data-combo-kasir'),
			])
				.then(function (data) {

					if (data[0].statResponse) {
						$scope.item = data[0].data;
						$scope.item.biayaAdministrasi = 0;
						$scope.item.diskon = 0;
						$scope.item.totalTagihan = $scope.item.jumlahBayar;
						$scope.item.jumlahBayarFix = ($scope.item.totalTagihan - $scope.item.diskon) + $scope.item.biayaAdministrasi;
						$scope.item.totalFixBayar = 0
						$scope.item.nominal = $scope.setDefaultNominal();
					}

					if (data[1].statResponse) {
						$scope.listJenisKartu = data[1].data.jeniskartu;
						$scope.listCaraBayar = data[1].data.carabayar
					}
					$scope.item.TglBayar = moment($scope.now).format('YYYY-MM-DD HH:mm')
				});

			$scope.$watch('item.jumlahBayarFix', function (newValue, oldValue) {
				if (newValue < 0) {
					newValue = (newValue) * -1
				}
				medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
					function (dat) {
						$scope.item.terbilang = dat.data.terbilang;
					})
			});

			$scope.Save = function () {
				$scope.showBtnSimpan = false;

				var listRawRequired = [
					"item.biayaAdministrasi|ng-model|Administrasi",
					"item.diskon|ng-model|Diskon",
					"item.jumlahBayarFix|ng-model|Jumlah bayar"
				];
				var isValid = medifirstService.setValidation($scope, listRawRequired);

				if (isValid.status) {
					if ($scope.item.jumlahBayarFix != $scope.item.totalFixBayar) {
						var confirm = $mdDialog.confirm()
							.title('Peringatan!')
							.textContent('jumlah yang dibayarkan tidak sesuai dengan total tagihan')
							.ariaLabel('Lucky day')
							.ok('Ok')

						$mdDialog.show(confirm).then(function () {

						});
					}
					else {
						var dataObjPost = {};

						dataObjPost = {
							parameterTambahan: $scope.dataPrevPage,
							noRec: $scope.item.noRec,
							jumlahBayar: $scope.item.jumlahBayarFix,
							biayaAdministrasi: $scope.item.biayaAdministrasi,
							diskon: $scope.item.diskon,
							tglsbm: moment($scope.item.TglBayar).format('YYYY-MM-DD HH:mm'),
							pembayaran: []
						}

						var arrObjPembayaran = [];
						for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
							var objPembayaran = {};

							if ($scope.daftarBayar._data[i].detailPembayaran[0].noKartu != undefined) {
								objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

								objPembayaran.caraBayar = {
									id: $scope.daftarBayar._data[i].id,
									caraBayar: $scope.daftarBayar._data[i].caraBayar
								};

								var jenisKartu = {
									id: $scope.daftarBayar._data[i].detailPembayaran[0].jenisKartu.id
								}

								objPembayaran.detailBank = {
									noKartu: $scope.daftarBayar._data[i].detailPembayaran[0].noKartu,
									namaKartu: $scope.daftarBayar._data[i].detailPembayaran[0].namaKartu,
									jenisKartu: jenisKartu
								}
							}
							else {

								objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

								objPembayaran.caraBayar = {
									id: $scope.daftarBayar._data[i].id,
									caraBayar: $scope.daftarBayar._data[i].caraBayar
								};

							}
							arrObjPembayaran.push(objPembayaran);
						}
						dataObjPost.pembayaran = arrObjPembayaran;
						medifirstService.cekEnableDisableButton(buttonDisabled);
						buttonDisabled = true;
						var virtual = false
						for (var i = 0; i < arrObjPembayaran.length; i++) {
							var el = arrObjPembayaran[i]
							if(el.caraBayar.caraBayar =='VIRTUAL ACCOUNT BNI'){
								saveVirtual(dataObjPost)
								virtual = true
								break
							}
						}
						if(virtual == true)return


						medifirstService.post('kasir/simpan-data-pembayaran', dataObjPost)
							.then(function (e) {

								var nosbm = {
									"nosbm": e.data.noSBM
								}
								$scope.item.noSbmBayar = e.data.noSBM[0]
								$scope.saveLogging('Pembayaran Tagihan', 'NoRegistrasi Pasien Daftar',
									e.data.noReg, 'Pembayaran Tagihan No SBM - ' + $scope.item.noSbmBayar + ' pada No Registrasi ' + e.data.noReg)
								// save jurnal pembayaran 
								medifirstService.post('sysadmin/general/save-jurnal-pembayarantagihan', nosbm).then(function (res) {

								})
								// end jurnal pembayaran 

								$scope.showBtnSimpan = false;
								medifirstService.cekEnableDisableButton(buttonDisabled);
								buttonDisabled = false;
								// CetakKwL();		
								$scope.noSBM = e.data.noSBM;
								$scope.noReg = e.data.noReg;
								// $scope.showPageCetak(e.data.noSBM, e.data.noReg);
								$scope.popUpCetakanKwitansi.center().open();
							}, function () {
								medifirstService.cekEnableDisableButton(buttonDisabled);
								buttonDisabled = false;
							});
					}
				}
				else {
					medifirstService.showMessages(isValid.messages);
				}


			}
			var dataVir ={}
			function saveVirtual(dataObjPost){
				dataVir ={}
				dataVir = dataObjPost
				$scope.popUpNo.center().open()
			}
			$scope.saveVirtual = function(nohp){
			    dataVir.nohp = nohp
				medifirstService.post('kasir/simpan-data-pembayaran-virtual', dataVir)
					.then(function (e) {
						$state.go('DaftarVirtualAccount')
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
			//*endlog Batal Bayar*

			$scope.Cetak = function () {

			}

			$scope.Kembali = function () {

				switch ($scope.dataParams.pageFrom) {
					case "PembayaranTagihanLayananKasir":
						if ($scope.showBtnSimpan) {
							$scope.changePage("PembayaranTagihanLayananKasir");
						}
						else {
							$state.go("DaftarPasienPulang", {});
						}
						break;
					case "PembayaranTagihanNonLayananKasir":
						$scope.changePage("PembayaranTagihanNonLayananKasir");
						break;
					case "InputTagihanNonLayanan":
						$scope.changePage("InputTagihanNonLayanan");
						break;
					case "DaftarNonLayananKasir":
						$scope.changePage("DaftarNonLayananKasir");
						break;
					case "DaftarPenjualanApotekKasir/terimaUmum":
						$state.go("DaftarPenjualanApotekKasir", { dataFilter: "terimaUmum" });
						break;
					case "DaftarPenjualanApotekKasir/obatBebas":
						$state.go("DaftarPenjualanApotekKasir", { dataFilter: "obatBebas" });
						break;
					case "PenyetoranDepositKasir":
						$scope.changePage("PenyetoranDepositKasir");
						break;
					case "PenyetoranDepositKasirKembali":
						$scope.changePage("PenyetoranDepositKasirKembali");
						break;
					case "PembayaranPiutangKasir":
						if ($scope.showBtnSimpan) {
							$scope.changePage("PembayaranPiutangKasir");
						}
						else {
							$state.go("DaftarPiutangKasir", {});
						}
						break;
				}
			}

			$scope.changePage = function (stateName) {
				var obj = {
					noRegistrasi: $scope.dataParams.noRegistrasi
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}


			$scope.$watch('item.biayaAdministrasi', function (newValue, oldValue) {
				$scope.item.jumlahBayarFix = ($scope.item.totalTagihan - $scope.item.diskon) + parseInt(newValue);
			});

			$scope.$watch('item.diskon', function (newValue, oldValue) {
				$scope.item.jumlahBayarFix = ($scope.item.totalTagihan - newValue) + parseInt($scope.item.biayaAdministrasi);
			});

			$scope.$watch('item.caraBayar', function (newValue, oldValue) {
				if (newValue != undefined && newValue.namaExternal == "KARTU KREDIT") {
					$scope.showCC = true;
				}
				else {
					$scope.showCC = false;
				}
			});

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

			function CetakKwL() {
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataParams.noRegistrasi + '&strIdPegawai=' + $scope.item.kasir + '&strIdRuangan=-&view=false', function (response) {
					// do something with response
				});
			}

			$scope.showPageCetak = function (noSBM, noReg) {
				switch ($scope.dataParams.pageFrom) {
					case "PembayaranTagihanLayananKasir":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						iydeeVegawhai = medifirstService.getPegawaiLogin();
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noReg + $scope.dataParams.noRegistrasi + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function (response) {
							// do something with response
						});
						$state.go('DaftarPasienPulang');
						break;
					case "PembayaranTagihanNonLayananKasir":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						iydeeVegawhai = medifirstService.getPegawaiLogin();
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function (response) {
							// do something with response
						});
						break;
					case "InputTagihanNonLayanan":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						iydeeVegawhai = medifirstService.getPegawaiLogin();
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function (response) {
							// do something with response
						});
						break;
					case "DaftarNonLayananKasir":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						iydeeVegawhai = medifirstService.getPegawaiLogin();;
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function (response) {
							// do something with response
						});
						break;
					case "DaftarPenjualanApotekKasir/terimaUmum":
						var obj = {
							noRegistrasi: noSBM,
							backPage: $scope.defaultPage,
							jenis: $scope.dataParams.pageFrom,
							noREG: noReg
						}

						$state.go("CetakKwitansi", {
							dataPasien: JSON.stringify(obj)
						});
						break;
					case "DaftarPenjualanApotekKasir/obatBebas":
						var obj = {
							noRegistrasi: noSBM,
							backPage: $scope.defaultPage,
							jenis: $scope.dataParams.pageFrom,
							noREG: noReg
						}

						$state.go("CetakKwitansi", {
							dataPasien: JSON.stringify(obj)
						});
						break;
					case "PenyetoranDepositKasir":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						iydeeVegawhai = medifirstService.getPegawaiLogin();
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=DEPOSIT' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function (response) {
							// do something with response
						});
						$state.go('DaftarPasienAktif');
						break;
					case "PembayaranPiutangKasir":
						var obj = {
							noRegistrasi: noSBM,
							backPage: $scope.defaultPage,
							jenis: $scope.dataParams.pageFrom,
							noREG: noReg
						}

						$state.go("CetakKwitansi", {
							dataPasien: JSON.stringify(obj)
						});
						break;
					case "PenyetoranDepositKasirKembali":
						var sudahTerimaDari = ''
						if ($scope.item.terimaDari != undefined) {
							sudahTerimaDari = $scope.item.terimaDari
						}
						var iydeeVegawhai = "";
						// manageKasir.getDataTableTransaksi("get-data-login", true).then(function(dat){
						// 	iydeeVegawhai = dat.data[0].namalengkap;

						// })
						iydeeVegawhai = medifirstService.getPegawaiLogin();
						//  		var client = new HttpClient();
						// client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi='+$scope.dataParams.noRegistrasi+'&idPegawai='+iydeeVegawhai+'&STD='+sudahTerimaDari+'&view=false', function(response) {
						//     // do something with response
						// });
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2-kembali-deposit=1&noregistrasi=KEMBALIDEPOSIT' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false&noregistrasi=' + $scope.dataParams.noRegistrasi, function (response) {
							// do something with response
						});
						$state.go('DaftarPasienPulang');
						break;
				}

			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.cetakEMR = function () {
				var user = medifirstService.getPegawaiLogin();
				if ($scope.item.cetakanKasir == undefined) {
					toastr.warning("Pilih cetakan yg akan dicetak terlebih dahulu");
					return;
				}

				if ($scope.item.cetakanKasir.id == 1) {
					$scope.showPageCetak($scope.noSBM, $scope.noReg);
					// $state.go("DaftarPasienPulang", {});
				}

				if ($scope.item.cetakanKasir.id == 2) {
					switch ($scope.dataParams.pageFrom) {
						case "PembayaranTagihanLayananKasir":
							$scope.keterangan = 'Pembayaran Tagihan Pasien'
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataParams.noRegistrasi + '&strKeterangan=' + $scope.keterangan + '&strIdPegawai=' + user.namaLengkap + '&strIdRuangan=-&view=false', function (response) {
								// do something with response
							});
							break;
						case "DaftarNonLayananKasir":
							$scope.keterangan = 'Pembayaran Tagihan Non Layanan'
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataParams.noRegistrasi + '&strKeterangan=' + $scope.keterangan + '&strIdPegawai=' + user.namaLengkap + '&strIdRuangan=-&view=false', function (response) {
								// do something with response
							});
							break;
					}
				}
				
				$scope.item.cetakanKasir = undefined;
				$scope.popUpCetakanKwitansi.close();
				$state.go("DaftarPasienPulang", {});
			}

			$scope.Cetak = function(){
				$scope.popUpCetakanKwitansi.center().open();
			}

			//** BATAS */
		}
	]);
});