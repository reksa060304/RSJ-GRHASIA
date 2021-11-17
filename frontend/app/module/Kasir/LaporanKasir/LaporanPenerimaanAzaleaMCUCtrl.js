define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('LaporanPenerimaanAzaleaMCUCtrl', ['$state', '$mdDialog', '$q', '$scope', 'CacheHelper', 'MedifirstService',
		function ($state, $mdDialog, $q, $scope, cacheHelper, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.dataSbnSelected = {};
			$scope.btn_1 = false;
			$scope.btn_0 = true;
			var NRG = "";
			var dataLogin = {};
			var dataPegawai = [];
			$scope.pegawai = medifirstService.getPegawaiLogin();
			$scope.item.listKasirMulti = []
			loadCombo();

			// loadData();


			function loadData() {
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				var chacePeriode = tglAwal + "~" + tglAkhir//+":"+$scope.item.noFaktur+":"+$scope.item.NamaSupplier;
				cacheHelper.set('DaftarPenerimaanKasirCtrl', chacePeriode);
				var Skasir = "";
				if ($scope.item.kasir != undefined) {
					Skasir = $scope.item.kasir.id;
				}

				var ScaraBayar = "";
				if ($scope.item.caraBayar != undefined) {
					ScaraBayar = $scope.item.caraBayar.id;
				}

				var SkelompokTransaksi = "";
				if ($scope.item.kelompokTransaksi != undefined) {
					SkelompokTransaksi = $scope.item.kelompokTransaksi.id;
				}
				var Sins = "";
				if ($scope.item.ins != undefined) {
					Sins = $scope.item.ins.id;
				}
				var SnoSbm = $scope.item.nosbm;

				var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
				}

				var jenispelayanan = ""
				if ($scope.item.jenisPelayanan != undefined) {
					jenispelayanan = $scope.item.jenisPelayanan.id;
				}

				$q.all([
					medifirstService.get("kasir/data-daftar-sbm?"
						+ "dateStartTglSbm=" + tglAwal
						+ "&dateEndTglSbm=" + tglAkhir
						+ "&idPegawai=" + Skasir
						+ "&ins=" + Sins
						+ "&idCaraBayar=" + ScaraBayar
						+ "&idKelTransaksi=" + SkelompokTransaksi
						+ "&nosbm=" + SnoSbm
						+ "&nocm=" + $scope.item.norm
						+ "&nama=" + $scope.item.nama
						+ "&desk=" + $scope.item.desk
						+ "&KasirArr=" + listKasir
						+ "&JenisPelayanan=" +jenispelayanan
					)
				]).then(function (data) {
					var cash = 0;
					var debit = 0;
					var kredit = 0;
					var donasi = 0;
					var trf = 0;
					var mix = 0;

					if (data[0].statResponse) {
						var result = data[0].data//.data.result;
						for (var x = 0; x < result.length; x++) {

							var element = result[x];
							element.no = x + 1;
							element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
							if (element.nocm == null) {
								element.nocm = '-'
							}
							if (element.namapasien == null) {
								element.namapasien = '-'
							}
							if (element.namapasien_klien == null) {
								element.namapasien_klien = '-'
							}
							element.namapasien = element.nocm + ' ' + element.namapasien
							if (element.namaruangan == null) {
								element.namaruangan = "-"
							}
							if (element.noClosing != null) {
								element.status = "Setor";
							} else {
								element.status = "Belum Setor";
							}

							if (element.caraBayar == "TUNAI") {
								cash = parseFloat(element.totalPenerimaan) + cash;
							};

							if (element.caraBayar == "KARTU DEBIT") {
								debit = parseFloat(element.totalPenerimaan) + debit;
							}

							if (element.caraBayar == "KARTU KREDIT") {
								kredit = parseFloat(element.totalPenerimaan) + kredit;
							};

							if (element.caraBayar == "TRANSFER BANK") {
								trf = parseFloat(element.totalPenerimaan) + trf;
							}

							if (element.caraBayar == "DONASI") {
								donasi = parseFloat(element.totalPenerimaan) + donasi;
							};

							if (element.caraBayar == "MIX") {
								mix = parseFloat(element.totalPenerimaan) + mix;
							}

						}

						$scope.item.totalCash = "Rp. " + parseFloat(cash).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.item.totalDebit = "Rp. " + parseFloat(debit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.item.totalKredit = "Rp. " + parseFloat(kredit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.item.totalDonasi = "Rp. " + parseFloat(donasi).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.item.totalMix = "Rp. " + parseFloat(mix).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.item.totalTrf = "Rp. " + parseFloat(trf).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						$scope.dataDaftarPenerimaan = new kendo.data.DataSource({
							data: result,
							// group: $scope.group,
							// pageSize: 50,
							total: result.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										totalPenerimaan: { type: "number" }
									}
								}
							},
							aggregate: [
								{ field: 'totalPenerimaan', aggregate: 'sum' },
							]
						});
					}
				});
			}

			function loadCombo() {
				$scope.item.totalCash = 0;
				$scope.item.totalDebit = 0;
				$scope.item.totalKredit = 0;
				$scope.item.totalDonasi = 0;
				$scope.item.totalMix = 0;
				$scope.item.totalTrf = 0;

				var chacePeriode = cacheHelper.get('DaftarPenerimaanKasirCtrl');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
				} else {
					$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');//$scope.now;
					$scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');//$scope.now;

				}

				medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
					$scope.listKasir = dat.data.datakasir;
					$scope.selectOptionsKasir = {
						placeholder: "Pilih Kasir...",
						dataTextField: "namalengkap",
						dataValueField: "id",
						// dataSource:{
						//     data: $scope.listRuangan
						// },
						autoBind: false,

					};
					$scope.listInstalasi = dat.data.dataInstalasi;
					$scope.listKelompokTransaksi = dat.data.dataKP;
					$scope.listCaraBayar = dat.data.dataCB;
					$scope.listJenisPelayanan = [
						{id: 1, jenisPelayanan: "MCU"},
						{id: 2, jenisPelayanan: "Azalea"}
					]
					dataLogin = dat.data.datalogin;
					dataPegawai = dat.data.datapegawai;
					if (dataPegawai != undefined) {
						// $scope.item.kasir = { id: dataPegawai.objectpegawaifk, namalengkap: dataPegawai.namalengkap };
						$scope.item.listKasirMulti = [
							{ id: dataPegawai.objectpegawaifk, namalengkap: dataPegawai.namalengkap }
						]
					}
					loadData();
				});
			}

			$scope.klik = function (dataSbnSelected) {
				if (dataSbnSelected != undefined) {
					$scope.dataSbnSelected = dataSbnSelected;
				}
			};

			$scope.SearchEnter = function () {
				loadData()
			}

			$scope.aggregate = [
				{
					field: "totalPenerimaan",
					aggregate: "sum"
				}
			]

			$scope.columnDaftarPenerimaan = {
				sortable: true,
				pageable: true,
				selectable: "row",
				columns: [
					{
						"field": "no",
						"title": "No",
						"template": "<span class='style-center'>#: no #</span>",
						"width": "45px"
					},
					{
						"field": "noSbm",
						"title": "NoSbm",
						"template": "<span class='style-center'>#: noSbm #</span>",
						"width": "65px"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"template": "<span class='style-left'>#: namaruangan #</span>",
						"width": "100px"
					},
					{
						"field": "tglSbm",
						"title": "Tanggal",
						"template": "<span class='style-center'>#: tglSbm #</span>",
						"width": "75px"
					},
					{
						"field": "namapasien",
						"title": "Nama",
						"template": "<span class='style-left'>#: namapasien #</span>",
						"width": "80px"
					},
					{
						"field": "namapasien_klien",
						"title": "Deskripsi",
						"template": "<span class='style-left'>#: namapasien_klien #</span>",
						"width": "80px"
					},
					{
						"field": "keterangan",
						"title": "Keterangan",
						"template": "<span class='style-left'>#: keterangan #</span>",
						"width": "80px"
					},
					{
						"field": "caraBayar",
						"title": "Cara Bayar",
						"template": "<span class='style-center'>#: caraBayar #</span>",
						"width": "70px",
						groupFooterTemplate: "Jumlah",
						footerTemplate: "Total Penerimaan"
					},
					{
						"field": "totalPenerimaan",
						"title": "Total Penerimaan",
						"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",
						"width": "85px",
						aggregates: ["sum"],
						footerTemplate: "#: data.totalPenerimaan.sum #",
						footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalPenerimaan.sum #', 'Rp.')}}</span>",
						footerAttributes: { style: "text-align: right;" }
					},
					{
						"field": "namaPenerima",
						"title": "Kasir",
						"template": "<span class='style-center'>#: namaPenerima #</span>",
						"width": "80px"
					},
					{
						"field": "status",
						"title": "Status",
						"template": "<span class='style-center'>#: status #</span>",
						"width": "50px"
					}
				]
			}

			$scope.CetakReg = function () {

				if ($scope.dataSbnSelected.noSbm == undefined) {
					var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
						"transaksi belum dipilih", "Ok");
					$mdDialog.show(alertDialog).then(function () {
					});
				}
				else {
					switch ($scope.dataSbnSelected.keterangan) {
						case "Pembayaran Tagihan Pasien":
							var stt = 'false'
							if (confirm('View Kwitansi? ')) {
								// Save it!
								stt = 'true';
							} else {
								// Do nothing!
								stt = 'false'
							}
							var sudahTerimaDari = ''
							if ($scope.item.STD != undefined) {
								sudahTerimaDari = $scope.item.STD
							}
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
								// do something with response
							});

							break;
						case "Pembayaran Tagihan Non Layanan":
							var stt = 'false'
							if (confirm('View Kwitansi? ')) {
								// Save it!
								stt = 'true';
							} else {
								// Do nothing!
								stt = 'false'
							}
							var sudahTerimaDari = ''
							if ($scope.item.STD != undefined) {
								sudahTerimaDari = $scope.item.STD
							}
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
								// do something with response
							});

							break;
						case "Pembayaran Deposit Pasien":
							var stt = 'false'
							if (confirm('View Kwitansi? ')) {
								// Save it!
								stt = 'true';
							} else {
								// Do nothing!
								stt = 'false'
							}
							var sudahTerimaDari = ''
							if ($scope.item.STD != undefined) {
								sudahTerimaDari = $scope.item.STD
							}
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=DEPOSIT' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
								// do something with response
							});

							break;
						case "Pengembalian Deposit Pasien":
							var stt = 'false'
							if (confirm('View Kwitansi? ')) {
								// Save it!
								stt = 'true';
							} else {
								// Do nothing!
								stt = 'false'
							}
							var sudahTerimaDari = ''
							if ($scope.item.STD != undefined) {
								sudahTerimaDari = $scope.item.STD
							}
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=KEMBALIDEPOSIT' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
								// do something with response
							});

							break;

						case "Pembayaran Cicilan Tagihan Pasien":
							var stt = 'false'
							if (confirm('View Kwitansi? ')) {
								// Save it!
								stt = 'true';
							} else {
								// Do nothing!
								stt = 'false'
							}
							var sudahTerimaDari = ''
							if ($scope.item.STD != undefined) {
								sudahTerimaDari = $scope.item.STD
							}
							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=CICILANTAGIHAN' + $scope.dataSbnSelected.noSbm + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {
								// do something with response
							});

							break;
					}

				}
			}

			$scope.CetakKwL = function () {

				if ($scope.dataSbnSelected == undefined) {
					toastr.warning('Data Belum Dipilih, Peringatan!');
					return;
				}
				switch ($scope.dataSbnSelected.keterangan) {
					case "Pembayaran Tagihan Pasien":
						var stt = 'false'
						if (confirm('View Kwitansi Layanan? ')) {
							// Save it!
							stt = 'true';
						} else {
							// Do nothing!
							stt = 'false'
						}
						var sudahTerimaDari = ''
						if ($scope.item.STD != undefined) {
							sudahTerimaDari = $scope.item.STD
						}
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataSbnSelected.norec_sp + '&strKeterangan=' + $scope.dataSbnSelected.keterangan + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&strIdRuangan=-&view=' + stt, function (response) {
							// do something with response
						});
						break;
					case "Pembayaran Tagihan Non Layanan":
						var stt = 'false'
						if (confirm('View Kwitansi Layanan? ')) {
							// Save it!
							stt = 'true';
						} else {
							// Do nothing!
							stt = 'false'
						}
						var sudahTerimaDari = ''
						if ($scope.item.STD != undefined) {
							sudahTerimaDari = $scope.item.STD
						}
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataSbnSelected.norec_sp + '&strKeterangan=' + $scope.dataSbnSelected.keterangan + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&strIdRuangan=-&view=' + stt, function (response) {
							// do something with response
						});
						break;
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

			$scope.Cetak = function () {
				if ($scope.dataSbnSelected.noSbm == undefined) {

					var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
						"transaksi belum dipilih", "Ok");

					$mdDialog.show(alertDialog).then(function () {

					});
				}
				else {
					switch ($scope.dataSbnSelected.keterangan) {
						case "Pembayaran Tagihan Pasien":

							var obj = {
								noRegistrasi: [$scope.dataSbnSelected.noSbm],
								backPage: "DaftarPenerimaanKasir"
							}

							$state.go("CetakDokumenKasir", {
								dataPasien: JSON.stringify(obj)
							});
							break;
						case "Pembayaran Tagihan Non Layanan":
							var obj = {
								noRegistrasi: [$scope.dataSbnSelected.noSbm],
								backPage: 'DaftarPenerimaanKasir',
								jenis: 'PembayaranTagihanNonLayananKasir'
							}

							$state.go("CetakKwitansi", {
								dataPasien: JSON.stringify(obj)
							});
							break;
						case "DaftarNonLayananKasir":
							var obj = {
								noRegistrasi: [$scope.dataSbnSelected.noSbm],
								backPage: 'DaftarPenerimaanKasir',
								jenis: 'DaftarNonLayananKasir'
							}

							$state.go("CetakKwitansi", {
								dataPasien: JSON.stringify(obj)
							});
							break;
						case "DaftarPenjualanApotekKasir/terimaUmum":
						// $state.go("DaftarPenjualanApotekKasir",{dataFilter: "terimaUmum"});
						// break;
						case "DaftarPenjualanApotekKasir/obatBebas":
						// $state.go("DaftarPenjualanApotekKasir",{dataFilter: "obatBebas"});
						// break;
						case "Pembayaran Deposit Pasien":
							var obj = {
								noRegistrasi: [$scope.dataSbnSelected.noSbm],
								backPage: 'DaftarPenerimaanKasir',
								jenis: 'PenyetoranDepositKasir'
							}

							$state.go("CetakKwitansi", {
								dataPasien: JSON.stringify(obj)
							});
							break;
						case "Pembayaran Cicilan Tagihan Pasien":
							var obj = {
								noRegistrasi: [$scope.dataSbnSelected.noSbm],
								backPage: 'DaftarPenerimaanKasir',
								jenis: 'PembayaranPiutangKasir'
							}

							$state.go("CetakKwitansi", {
								dataPasien: JSON.stringify(obj)
							});
							break;
					}
				}
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.SearchData = function () {
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');
				var objSave = {
					tglAwal: tglAwal,
					tglAkhir: tglAkhir
				}
				medifirstService.post('sysadmin/general/save-jurnal-pembayaran_tagihan', objSave).then(function (data) { });
				loadData();
			}

			$scope.HapusSBM = function () {
				if ($scope.dataSbnSelected.status != 'Setor') {
					var stt = 'true';
					if (confirm('Batalkan pembayaran ? ')) {
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					if (stt == 'true') {
						var isDeposit = '';
						if ($scope.dataSbnSelected.keterangan == 'Pembayaran Deposit Pasien')
							isDeposit = true
						else
							isDeposit = false

						var objSave = {
							norec_sp: $scope.dataSbnSelected.norec_sp,
							noregistrasi: $scope.dataSbnSelected.noregistrasi,
							isdeposit: isDeposit
						}
						medifirstService.post('kasir/save-batal-bayar', objSave).then(function (data) {
							// jurnal bataal bayar
							var dataSave = {
								"nosbm": $scope.dataSbnSelected.noSbm,
							}
							medifirstService.post('sysadmin/general/hapus-jurnal-pembayarantagihan', dataSave).then(function (e) {

							})
							// end jurnal batal bayar
							$scope.saveLogBatalBayar();
							loadData();

						});
					}
				} else {
					alert('Sudah di setor tidak dapat di batalkan!')
				}
			}

			//*log Batal Bayar
			$scope.saveLogBatalBayar = function () {
				var objSave = {
					"noregistrasi": $scope.dataSbnSelected.noregistrasi,
					"nosbm": $scope.dataSbnSelected.noSbm
				}

				medifirstService.post('kasir/save-log-batal-bayar', objSave).then(function (e) {
				})
			}
			//*endlog Batal Bayar*

			$scope.ubahCarabayar = function () {
				if ($scope.dataSbnSelected.status != 'Setor') {
					$scope.btn_0 = false;
					$scope.btn_1 = true;
				} else {
					alert('Sudah di setor tidak dapat di batalkan!')
				}

			}

			$scope.saveCarabayar = function () {
				var stt = 'true';
				if (confirm('Ubah cara bayar ? ')) {
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				if (stt == 'true') {
					var objSave = {
						norec_sbm: $scope.dataSbnSelected.noRec,
						idCaraBayar: $scope.item.caraBayar1.id
					}
					medifirstService.post('kasir/save-ubah-cara-bayar', objSave).then(function (data) {
						loadData();
						$scope.btn_0 = true;
						$scope.btn_1 = false;
					});
				}
			}

			$scope.batal = function () {
				$scope.btn_0 = true;
				$scope.btn_1 = false;
			}

			$scope.CetakLaporanKasir = function () {
				var user = medifirstService.getPegawaiLogin();
				var dokter = ''
				var Sins = "";
				if ($scope.item.ins != undefined) {
					Sins = $scope.item.ins.id;
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				var idPegawai = ''
				if ($scope.item.kasir != undefined) {
					idPegawai = $scope.item.kasir.id
				}
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + user.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				});
			}

			$scope.CetakLaporanKasirDetail = function () {
				var dokter = ''
				var Sins = "";
				if ($scope.item.ins != undefined) {
					Sins = $scope.item.ins.id;
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				var idPegawai = ''
				if ($scope.item.kasir != undefined) {
					idPegawai = $scope.item.kasir.id
				}
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-apd=' + dataLogin.userData.namauser + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				});
			}

			$scope.CetakLaporanKasirPendaftaran = function () {
				var user = medifirstService.getPegawaiLogin();
				var dokter = ''
				// var Sins = "";
				// if ($scope.item.ins != undefined) {
				// 	Sins = $scope.item.ins.id;
				// }
				var ruanganId = ''
				if ($scope.item.ins != undefined) {
					ruanganId = $scope.item.ins.id
				}				
				var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
				}
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pendaftarankonsul=' + user.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
					+ '&idPegawai=' + listKasir + '&idDept=' + ruanganId + '&view=true', function (response) {
					});
			}

			$scope.CetakLaporanTindakanPoli = function () {
				var user = medifirstService.getPegawaiLogin();
				var dokter = ''
				var Sins = "";
				if ($scope.item.ins != undefined) {
					Sins = $scope.item.ins.id;
				}
				var ruanganId = ''
				if ($scope.item.ins != undefined) {
					ruanganId = $scope.item.ins.id
				}

				var idPegawai = ''
				if ($scope.item.kasir != undefined) {
					idPegawai = $scope.item.kasir.id
				}

				var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
				}

				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-tindakanpoli=' + user.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir
					+ '&idPegawai=' + listKasir + '&idDept=' + ruanganId + '&view=true', function (response) {
					});
			}

			//** BATAS */
		}
	]);
});