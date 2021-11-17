define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarVirtualAccountCtrl', ['$state', '$mdDialog', '$q', '$scope', 'CacheHelper', 'MedifirstService',
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
				cacheHelper.set('DaftarVirtualAccountCtrl', chacePeriode);
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

				$q.all([
					medifirstService.get("kasir/data-virtual-account?"
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
							if(element.cumulative_payment_amount== null){
								element.cumulative_payment_amount =0
							}
							if(element.status=='callback'){
								element.status ='Lunas'
							}
							else if(element.status==null){
								element.status ='-'
							}
							if(element.payment_amount == null){
								element.payment_amount =0
							}
							

						}

			
						$scope.dataDaftarPenerimaan = new kendo.data.DataSource({
							data: result,
							// group: $scope.group,
							// pageSize: 50,
							total: result.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										cumulative_payment_amount: { type: "number" },
										payment_amount: { type: "number" },
									}
								}
							},
							aggregate: [
								{ field: 'cumulative_payment_amount', aggregate: 'sum' },
								{ field: 'payment_amount', aggregate: 'sum' },
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

				var chacePeriode = cacheHelper.get('DaftarVirtualAccountCtrl');
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
  		var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == '-') { $(this).addClass('red') }
                    if ($(this).text() == 'Lunas') { $(this).addClass('green') }
                    if ($(this).text() == 'Di Panggil Dokter') { $(this).addClass('blue') }
                    if ($(this).text() == 'Online') { $(this).addClass('koneng') }

                })
            }
			$scope.columnDaftarPenerimaan = {
				sortable: true,
				pageable: true,
				selectable: "row",
				dataBound: onDataBound,
                columns: [
					{
						"field": "no",
						"title": "No",
						"template": "<span class='style-center'>#: no #</span>",
						"width": "45px"
					},
					{
						"field": "virtual_account",
						"title": "Virtual Account",
						"template": "<span class='style-center'>#: virtual_account #</span>",
						"width": "100px"
					},
					
					{
						"field": "datetime_created",
						"title": "Tanggal",
						"template": "<span class='style-center'>#: datetime_created #</span>",
						"width": "75px"
					},
					{
						"field": "namapasien",
						"title": "Nama",
						"template": "<span class='style-left'>#: namapasien #</span>",
						"width": "100px"
					},
					{
						"field": "nocm",
						"title": "No RM",
						"template": "<span class='style-left'>#: nocm #</span>",
						"width": "80px"
					},
					{
						"field": "noregistrasi",
						"title": "No Registrasi",
						"template": "<span class='style-left'>#: noregistrasi #</span>",
						"width": "80px"
					},
					{
						"field": "datetime_payment",
						"title": "Tgl Bayar",
						"template": '# if( datetime_payment==null) {# - # } else {# #= datetime_payment # #} #',
						"width": "80px"
					},
					{
						"field": "datetime_expired",
						"title": "Tgl Expired",
						"template": "<span class='style-left'>#: datetime_expired #</span>",
						"width": "80px"
					},
					{
						"field": "status",
						"title": "Status",
						"template": "<span class='style-center'>#: status #</span>",
						"width": "70px",
						groupFooterTemplate: "Jumlah",
						footerTemplate: "Total Penerimaan"
					},
					{
						"field": "payment_amount",
						"title": "Total Penerimaan",
						"template": "<span class='style-right'>{{formatRupiah('#: payment_amount #', 'Rp.')}}</span>",
						"width": "85px",
						aggregates: ["sum"],
						footerTemplate: "#: data.payment_amount.sum #",
						footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.payment_amount.sum #', 'Rp.')}}</span>",
						footerAttributes: { style: "text-align: right;" }
					},
					{
						"field": "kasir",
						"title": "Kasir",
						"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #',
						"width": "80px"
					},
					{
						"field": "trx_id",
						"title": "Transfer ID",
						"template": "<span class='style-center'>#: trx_id #</span>",
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
				// medifirstService.post('sysadmin/general/save-jurnal-pembayaran_tagihan', objSave).then(function (data) { });
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
		    var today = new Date();
   			var jam =today.setHours(today.getHours() + 2);
				 
			$scope.bri = {
				institutionCode: 'J104408',
				brivaNo: '77777',
				tipe:'create',
				expiredDate : new Date(jam),
				tglAwal:new Date(),
				tglAkhir : new Date(),
				tglAwalTime: new Date(moment(new Date()).format('YYYY-MM-DD 00:00')),
				tglAkhirTime: new Date(moment(new Date()).format('YYYY-MM-DD 23:59'))
			}
			$scope.va = {}
			$scope.briva = function (){
				$scope.popUp2.center().open()
			}

			$scope.batal = function(){
				$scope.popUp2.close()
				var today = new Date();
   				var jam =today.setHours(today.getHours() + 2);
				$scope.bri = {
					institutionCode: 'J104408',
					brivaNo: '77777',
					tipe:'create',
					expiredDate : new Date(jam),
					tglAwal:new Date(),
					tglAkhir : new Date(),
					tglAwalTime: new Date(moment(new Date()).format('YYYY-MM-DD 00:00')),
					tglAkhirTime: new Date(moment(new Date()).format('YYYY-MM-DD 23:59'))
				}
				$scope.va = {}
			}
			$scope.isRouteLoading =false
			$scope.saveBRI = function(){
				  $scope.isSave = true
				  let json = {
						"institutionCode": $scope.bri.institutionCode?$scope.bri.institutionCode:null,
						"brivaNo": $scope.bri.brivaNo?$scope.bri.brivaNo:null,
						"custCode":  $scope.bri.custCode?$scope.bri.custCode:null,
						"nama":$scope.bri.nama?$scope.bri.nama:null,
						"amount": $scope.bri.amount?$scope.bri.amount:null,
						"keterangan": $scope.bri.keterangan ?$scope.bri.keterangan:null,
						"expiredDate": $scope.bri.expiredDate ? moment($scope.bri.expiredDate).format('YYYY-MM-DD HH:mm:ss') : null,
					}
					$scope.isRouteLoading = true
			        medifirstService.postNonMessage('bri/va/'+ $scope.bri.tipe+'-end-point', json).then(function (e) {
			          if (e.data.responseCode == '00') {
			          
			            toastr.success(e.data.responseDescription, 'Info')
			            
			          } else {
			            toastr.error(e.data.errDesc, 'Info')
			          }

			          $scope.isSave = false
			          $scope.isRouteLoading = false
			        }, function (error) {
			          $scope.isRouteLoading = false
			          $scope.isSave = false
			        })

			}
			$scope.findDP = function(){
				$scope.showVA =false
				$scope.isRouteLoading = true
				medifirstService.get('bri/va/get?institutionCode='+$scope.bri.institutionCode
				 	+'&brivaNo='+ $scope.bri.brivaNo+'&custCode='+
				 	$scope.bri.custCode).then(function (e) {
				 			$scope.isRouteLoading = false
				 		if (e.data.responseCode == '00') {
			          		$scope.showVA =true
			          		$scope.va.get = e.data.data
			           		toastr.success(e.data.responseDescription, 'Info')
				            
				          } else {
				            toastr.error(e.data.errDesc, 'Info')
				          }
				 })
			}

			$scope.getStatusBayar = function(){
				$scope.isRouteLoading = true
				$scope.showVA =false
				medifirstService.get('bri/va/get-status-bayar?institutionCode='+$scope.bri.institutionCode
				 	+'&brivaNo='+ $scope.bri.brivaNo+'&custCode='+
				 	$scope.bri.custCode).then(function (e) {
				 			$scope.isRouteLoading = false
				 		if (e.data.responseCode == '00') {
			           		toastr.success(e.data.responseDescription +', Status Bayar : '+ e.data.data.statusBayar, 'Info')
				            
				          } else {
				            toastr.error(e.data.errDesc, 'Info')
				          }
				 })

			}
			$scope.updateStatusBayar = function(){
				 $scope.isSave = true
				  let json = {
						"institutionCode": $scope.bri.institutionCode?$scope.bri.institutionCode:null,
						"brivaNo": $scope.bri.brivaNo?$scope.bri.brivaNo:null,
						"custCode":  $scope.bri.custCode?$scope.bri.custCode:null,
						"statusBayar":$scope.bri.statusBayar?$scope.bri.statusBayar:null,
						
					}
					$scope.isRouteLoading = true
			        medifirstService.postNonMessage('bri/va/update-status-bayar', json).then(function (e) {
			          if (e.data.responseCode == '00') {
			          
			            toastr.success(e.data.responseDescription, 'Info')
			           
			          } else {
			            toastr.error(e.data.errDesc, 'Info')
			          }

			          $scope.isSave = false
			          $scope.isRouteLoading = false
			        }, function (error) {
			          $scope.isRouteLoading = false
			          $scope.isSave = false
			        })
			}
			 $scope.findReportDate = function () {
		        $scope.isRouteLoading = true
		        $scope.dsDate = new kendo.data.DataSource({
		                data: [],
		                pageSize: 10,
		                serverPaging: false,
		              });

		        medifirstService.get('bri/va/get-report-date?institutionCode='
		        	+ $scope.bri.institutionCode
		        	+'&brivaNo='+$scope.bri.brivaNo
		        	+ '&tglAwal='+moment($scope.bri.tglAwal).format("YYYYMMDD")
		        	+ '&tglAkhir='+moment($scope.bri.tglAkhir).format("YYYYMMDD")
		        	).then(function (e) {
		            $scope.isRouteLoading = false
		            if (e.data.responseCode == '00') {
		              let data = e.data.data
		             	for (var i = 0; i < data.length; i++) {
		             		const elemet = data[i]
		             		elemet.nova = elemet.brivaNo+elemet.custCode
		             	}
		              $scope.dsDate = new kendo.data.DataSource({
		                data: data,
		                pageSize: 10,
		                total: data,
		                serverPaging: false,
		              });

		            } else {
		              toastr.error(e.data.errDesc, 'Info')
		            }
		          })
		      }
		       $scope.findReportTime = function () {
		       	 $scope.dsDate = new kendo.data.DataSource({
		                data: [],
		                pageSize: 10,
		                serverPaging: false,
		              });
		        $scope.isRouteLoading = true
		        medifirstService.get('bri/va/get-report-time?institutionCode='
		        	+ $scope.bri.institutionCode
		        	+'&brivaNo='+$scope.bri.brivaNo
		        	+ '&tglAwal='+moment($scope.bri.tglAwalTime).format("YYYY-MM-DD HH:mm")
		        	+ '&tglAkhir='+moment($scope.bri.tglAkhirTime).format("YYYY-MM-DD HH:mm")
		        	).then(function (e) {
		            $scope.isRouteLoading = false
		            if (e.data.responseCode == '00') {
		              let data = e.data.data
		             	for (var i = 0; i < data.length; i++) {
		             		const elemet = data[i]
		             		elemet.nova = elemet.brivaNo+elemet.custCode
		             	}
		              $scope.dsTime = new kendo.data.DataSource({
		                data: data,
		                pageSize: 10,
		                total: data,
		                serverPaging: false,
		              });

		            } else {
		              toastr.error(e.data.errDesc, 'Info')
		            }
		          })
		      }
		      $scope.columnDate = [
			        {
			          "field": "nova",
			          "title": "No Virtual Account"
			        },
			        {
			          "field": "nama",
			          "title": "Nama"
			        },
			        {
			          "field": "keterangan",
			          "title": "Ket"
			        },
			        {
			          "field": "amount",
			          "title": "Amount"
			        },
			        {
			          "field": "paymentDate",
			          "title": "Payment Date"
			        },
			        {
			          "field": "tellerid",
			          "title": "Teller ID"
			        },
			        {
			          "field": "no_rek",
			          "title": "No Rekening"
			        },
			      ];
			      $scope.columnTime= [
			        {
			          "field": "nova",
			          "title": "No Virtual Account"
			        },
			        {
			          "field": "nama",
			          "title": "Nama"
			        },
			        {
			          "field": "keterangan",
			          "title": "Ket"
			        },
			        {
			          "field": "amount",
			          "title": "Amount"
			        },
			        {
			          "field": "paymentDate",
			          "title": "Payment Date"
			        },
			        {
			          "field": "tellerid",
			          "title": "Teller ID"
			        },
			        {
			          "field": "no_rek",
			          "title": "No Rekening"
			        },
			        {
			          "field": "trxID",
			          "title": "Trx ID"
			        },
			         {
			          "field": "channel",
			          "title": "Channel"
			        },
			      ];

			$scope.listBilling =[
				{id:'o',type:'Open payment'},
				{id:'c',type:'Fixed payment'},
				{id:'i',type:'Installment/partial payment'},
				{id:'m',type:'Minimum payment'},
				{id:'n',type:'Open minimum payment'},
				{id:'x',type:'Open maximum payment'},
			]
			$scope.bni = { 
				billing_type: 	$scope.listBilling[1],
				datetime_expired : new Date(jam),
				type:'createbilling',
			}
			medifirstService.get('sysadmin/settingdatafixed/get/client_id_BNI').then(function (dat) {
          		$scope.bni.client_id= dat.data
            })

			$scope.bniVA = function (){
				$scope.popUp3.center().open()
			}
			$scope.saveBNI = function(){
				  $scope.isSave = true
				  var url =''
				  if($scope.bni.type == undefined)return
				  if($scope.bni.type== 'createbilling'){
				  	url ='create-billing'
				  }
				  if($scope.bni.type== 'createbillingsms'){
				  	url ='create-billing-sms'
				  }
				   if($scope.bni.type== 'updatebilling'){
				  	url ='update-transaction'
				  }

				  let json = {
					    "type": $scope.bni.type,
					    "client_id": $scope.bni.client_id? $scope.bni.client_id: "",
					    "trx_id": $scope.bni.trx_id? $scope.bni.trx_id: "",
					    "trx_amount":$scope.bni.trx_amount? $scope.bni.trx_amount: "",
					    "billing_type":$scope.bni.billing_type? $scope.bni.billing_type.id: "",
					    "customer_name": $scope.bni.customer_name? $scope.bni.customer_name: "",
					    "customer_email": $scope.bni.customer_email? $scope.bni.customer_email: "",
					    "customer_phone":$scope.bni.customer_phone? $scope.bni.customer_phone: "",
					    "virtual_account": $scope.bni.virtual_account? $scope.bni.virtual_account: "",
					    "datetime_expired": $scope.bni.datetime_expired? 
					    moment($scope.bni.datetime_expired).format('YYYY-MM-DDTHH:mm:ss')+'+07:00': "",
					    "description": $scope.bni.description? $scope.bni.description: "",
					}
					$scope.isRouteLoading = true
			        medifirstService.postNonMessage('bni/'+url, json).then(function (e) {
			          if (e.data.status == '000') {
			          
			            toastr.success(e.data.message, 'Info')
			            
			          } else {
			            toastr.error(e.data.message, 'Info')
			          }

			          $scope.isSave = false
			          $scope.isRouteLoading = false
			        }, function (error) {
			          $scope.isRouteLoading = false
			          $scope.isSave = false
			        })

			}
			$scope.findVABNI = function(){
				$scope.showVABNI =false
				$scope.isRouteLoading = true
				let json ={
					"type": "inquirybilling",
				    "client_id":  $scope.bni.client_id? $scope.bni.client_id: "",
				    "trx_id":  $scope.bni.trx_id? $scope.bni.trx_id: "",
				}
				$scope.vabni ={}
				medifirstService.postNonMessage('bni/inquiry-billing',json).then(function (e) {
				 	  $scope.isRouteLoading = false
			 		  if (e.data.status == '000') {
		          		$scope.showVABNI =true
		          		$scope.vabni = e.data.data
		           		toastr.success(e.data.message, 'Info')
			            
			          } else {
			            toastr.error(e.data.message, 'Info')
			          }
				 })
			}
			$scope.checkCallback = function(){
				if($scope.bni.virtual_account== undefined){
					toastr.error('No VA harus di isi ', 'Info')
					return
				}
				$scope.isRouteLoading = true
				let json = {
					"virtual_account":  $scope.bni.virtual_account,
				}
				medifirstService.postNonMessage('bni/check-callback',json).then(function (e) {
				 	  $scope.isRouteLoading = false
			 		  if (e.data.data != undefined) {
		          		$scope.showVABNI = true
		          		let jsonss={
		          			'client_id': e.data.client_id,
			          		'data':e.data.data
			          	}
		          		medifirstService.postNonMessage('bni/callback-payment',jsonss).then(function (z) {
		          			  if (z.data.status == '000') {
		          			  	toastr.success('Sukses Callback Notifikasi Pembayaran', 'Info')
		          			  }else{
		          			  	toastr.error(z.data.message, 'Info')
		          			  }
		          		})
			            
			          } else {
			            toastr.error('Data Tidak ditemukan', 'Info')
			          }
				 })
			}
			$scope.batalBNI = function(){
				$scope.popUp3.close()
				var today = new Date();
				$scope.vabni ={}
   				var jam =today.setHours(today.getHours() + 2);
				$scope.bni = { 
					billing_type: 	$scope.listBilling[1],
					datetime_expired : new Date(jam),
					type:'createbilling',
				}
			
			}

			//** BATAS */
		}
	]);
});