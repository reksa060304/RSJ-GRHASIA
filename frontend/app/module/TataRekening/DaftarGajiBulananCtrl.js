define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarGajiBulananCtrl', ['$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService', 'ModelItem', '$state',
		function ($q, $scope, cacheHelper, dateHelper, medifirstService, ModelItem, $state) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.item.tglBayar = new Date();
			$scope.item.tahun = new Date();
			// $scope.dataPasienSelected = {};			
			$scope.isRouteLoading = false;
			$scope.itemGaji = {};
			$scope.show1 = false;
			$scope.bni = {}
			var dataKomponenGajiAdd = [];
			var dataKomponenGajiAdd2 = [];
			$scope.show2 = false;
			var tagihan = 0;
			var noRECC = "";
			var judul = "";
			var dariSini = "";
			var nosbk = "";

			var sisautang = 0;
			$scope.listStatus = [
				{ id: 3, namaExternal: "SEMUA" },
				{ id: 1, namaExternal: "LUNAS" },
				{ id: 2, namaExternal: "BELUM LUNAS" }
			];
			$scope.item.status = $scope.listStatus[0];
			var dataDaftarPasienPulang = [];
			var data2 = [];
			loadCombo();
			loadData();

			function loadCombo() {
				var chacePeriode = cacheHelper.get('GajiPegawaiCtrl');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = $scope.now;
					$scope.item.tglpulang = $scope.now;
				}

				medifirstService.get("sdm/get-combo-gaji-peg", false).then(function (dat) {
					var datas = dat.data;
					$scope.listDataCaraBayar = datas.carabayar;
					$scope.item.caraBayar = { "id": 1, "caraBayar": "TUNAI" }
					$scope.listUraianTransaksi = datas.kelompoktransaksi;
					for (var i = 0; i < $scope.listUraianTransaksi.length; i++) {
						const element = $scope.listUraianTransaksi[i]
						if (element.id == datas.kdkelompoktransaksigaji) {
							$scope.item.uraianTransaksi = element
							break
						}
					}
				})
				// medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
				// 	$scope.listDepartemen = data.data.departemen;
				// 	$scope.listKelompokPasien = data.data.kelompokpasien;
				// 	$scope.listDokter = data.data.dokter;
				// 	$scope.listDokter2 = data.data.dokter;
				// 	$scope.listBulan = data.data.bulan;
				// 	// $scope.item.bulan = {id: data.data.bulan[0].id, namabulan: data.data.bulan[0].namabulan}
				// })				
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				if (value == 'null') {
					value = 0
				}
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

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
				var bulan = ""
				if ($scope.item.bulan != undefined) {
					bulan = $scope.item.bulan.id
					if (bulan == 1) {
						var tglperiodeAwal = new Date().getFullYear() - 1 + '-' + $scope.item.bulan.periodeawal + ' 00:00';
						var tglperiodeAkhir = new Date().getFullYear() + '-' + $scope.item.bulan.periodeakhir + ' 23:59';
					} else if (bulan != 1) {
						var tglperiodeAwal = new Date().getFullYear() + '-' + $scope.item.bulan.periodeawal + '00:00';
						var tglperiodeAkhir = new Date().getFullYear() + '-' + $scope.item.bulan.periodeakhir + '23:59';
					} else {

					}
				}

				var tglperiodeAwal = moment(tglperiodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglperiodeAkhir = moment(tglperiodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var tahun = ""
				if ($scope.item.tahun != undefined) {
					tahun = "&tahun=" + moment($scope.item.tahun).format('YYYY');
				}
				var tempStatus = "";
				if ($scope.item.status != undefined) {
					tempStatus = "&status=" + $scope.item.status.namaExternal;
					if ($scope.item.status.namaExternal == "SEMUA") {
						tempStatus = "";
					}
				}

				$q.all([
					medifirstService.get("sdm/get-daftar-gaji?" + tahun + tempStatus),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					var tot = 0;
					var dat = data[0].data.data
					for (var i = 0; i < dat.length; i++) {
						dat[i].no = i + 1;
						var det = dat[i].detail;
						if (det) {
							for (var j = 0; j < det.length; j++) {
								tot = parseFloat(tot) + parseFloat(det[j].nilai);
							}
							dat[i].total = tot;
							tot = 0;
						}
					}
					$scope.dataDaftarPasienPulang = dat;
				});

			};
			$scope.columnDaftarPasienPulang = [
				{
					"field": "no",
					"title": "No",
					"width": "30px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "nonhistori",
					"title": "No Histori",
					"width": "80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "namabulan",
					"title": "Bulan",
					"width": "100px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "tahun",
					"title": "Tahun",
					"width": "80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "periode",
					"title": "Periode",
					"width": "80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "total",
					"title": "Total Gaji",
					"width": "80px",
					"template": "<span class='style-center'>{{formatRupiah('#: total #', 'Rp.')}}</span>"
				},
				{
					"field": "tglsbk",
					"title": "Tgl Bayar",
					"width": "80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "nosbk",
					"title": "No Bayar",
					"width": "80px",
				},
				{
					"field": "totaldibayar",
					"title": "DiBayar",
					"width": "80px",
					"template": "<span class='style-center'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>"
				},
			];
			function test(e) {
				e.preventDefault();
				$scope.dataPasienSelected = this.dataItem($(e.currentTarget).closest("tr"));
				if ($scope.dataPasienSelected == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.itemGaji.komponengaji = $scope.dataPasienSelected.komponengaji;
				$scope.itemGaji.nilai = $scope.dataPasienSelected.nilai;
				$scope.popUpGaji.center().open();
			}

			function struk(e) {

			}

			function bayar(e) {
				e.preventDefault();
				var dataBayar = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataBayar == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				if (dataBayar.total == 0 || isNaN(dataBayar.total)) {
					alert("Total Belum Ada!")
					return;
				}
				var detailz = [];
				var data = [];
				for (var i = 0; i < dataBayar.detail.length; i++) {
					data = {
						"komponengaji": dataBayar.detail[i].objectkomponengajifk,
						"kdkomponen": dataBayar.detail[i].kdkomponen,
						"nilai": dataBayar.detail[i].nilai
					}
					detailz.push(data)
				}
				var dataKabeh = {
					"tglsekarang": new Date(moment($scope.now).format('YYYY-MM-DD hh:mm:ss')),
					"total": dataBayar.total,
					"pegawai": dataBayar.id,
					"detail": detailz,
				}

				medifirstService.post('sdm/save-gaji', dataKabeh).then(function (e) {

				})

			}

			$scope.tambahNilaiGaji = function () {
				var listRawRequired = [
					"itemGaji.nilai|k-ng-model|Nilai Gaji",
				];
				// var test = $scope.dataPasienSelected;
				var temp = 0;
				var total = 0;
				if ($scope.dataPasienSelected.total != undefined) {
					total = $scope.dataPasienSelected.total;
				}
				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if ($scope.dataDaftarPasienPulang.length == undefined) {
					$scope.dataDaftarPasienPulang = $scope.dataDaftarPasienPulang.options.data;
				}
				if (isValid.status) {
					for (var i = 0; i < $scope.dataDaftarPasienPulang.length; i++) {
						var data = $scope.dataDaftarPasienPulang[i];
						if (data.id == $scope.dataPasienSelected.objectpegawaifk) {
							for (var j = 0; j < data.detail.length; j++) {
								if (data.detail[j].norec == $scope.dataPasienSelected.norec) {
									data.detail[j].nilai = $scope.itemGaji.nilai;
								}
								if (data.detail[j].kdkomponen == '+') {
									temp = parseFloat(temp) + parseFloat(data.detail[j].nilai);
								} else {
									temp = parseFloat(temp) - parseFloat(data.detail[j].nilai);
								}
							}
						}
						total = parseFloat(total) + parseFloat(temp);
						$scope.dataDaftarPasienPulang[i].total = total;
						total = 0;
						temp = 0;
					}
				}
				var data = $scope.dataDaftarPasienPulang;
				$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
					data: data
				});
				$scope.popUpGaji.center().close();
			}

			$scope.yearHungkul = {
				start: "decade",
				depth: "decade"
			}

			$scope.PenggajianBaru = function () {
				gajiBaru()
			}

			function gajiBaru() {
				cacheHelper.set('GajiBulan', undefined);
				$state.go('GajiPegawai');
			}

			$scope.klikGrid = function (dataPasienSelected) {
				// loadCombo();
				// $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
				// $scope.item.periodeAkhir = $scope.now;
				$scope.dataPasienSelected = dataPasienSelected;
			}

			$scope.DetailPenggajian = function () {
				if ($scope.dataPasienSelected.norec == null) {
					window.messageContainer.error("Pilih Data Dahulu!")
					return
				}
				// debugger;
				var arrStr = {
					0: $scope.dataPasienSelected.tahun,
					1: $scope.dataPasienSelected.bulanfk,
					2: $scope.dataPasienSelected.periodeawalgaji,
					3: $scope.dataPasienSelected.periodeakhirgaji,
					4: $scope.dataPasienSelected.norec,
				}
				cacheHelper.set('GajiBulan', arrStr);
				$state.go('GajiPegawai')
			}
			$scope.bayarGaji = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				tagihan = parseFloat($scope.dataPasienSelected.total);
				if (tagihan - parseFloat($scope.dataPasienSelected.totaldibayar) == 0) {
					toastr.info('Sudah Lunas')
					return
				}
				$scope.item.deskripsiTransaksi = 'Pembayaran Gaji periode ' + $scope.dataPasienSelected.periode + ' thn ' +
					$scope.dataPasienSelected.tahun
				noRECC = $scope.dataPasienSelected.norec;
				$scope.item.subTotal = "Rp. " + parseFloat($scope.dataPasienSelected.total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");//arrPeriode[6];
				medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataPasienSelected.total).then(
					function (dat) {
						$scope.item.terbilang = dat.data.terbilang;
					})


				sisautang = $scope.dataPasienSelected.totalsisahutang != null ? parseFloat($scope.dataPasienSelected.totalsisahutang) : 0;
				if (sisautang != 0) {
					$scope.item.totalBayar = tagihan - sisautang
				} else {
					$scope.item.totalBayar = tagihan - parseFloat($scope.dataPasienSelected.totaldibayar)
				}


				$scope.popUp3.center().open()
			}
			$scope.$watch('item.caraBayar', function (newValue, oldValue) {
				if (newValue != undefined && newValue.caraBayar == "TUNAI") {
					$scope.show1 = false;
					$scope.show2 = false;
				}
				else {
					$scope.show1 = true;
					$scope.show2 = true;
				}
			});

			$scope.$watch('item.totalBayar', function (newValue, oldValue) {
				if (newValue != "" && newValue != undefined) {

					medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
						function (dat) {
							$scope.item.tebilangBayar = dat.data.terbilang;
						})
				}
			});

			$scope.Bayar = function () {
				if ($scope.item.caraBayar == undefined) {
					alert("Cara Bayar belum dipilih!");
					return;
				}
				if ($scope.item.uraianTransaksi == undefined) {
					alert("uraian Transaksi belum dipilih!");
					return;
				}
				if ($scope.item.totalBayar == undefined || $scope.item.totalBayar == "" || $scope.item.totalBayar == 0) {
					alert("Total Bayar belum diisi!");
					return;
				}

				var namaBankRkn = ""
				if ($scope.item.namaBankRkn != undefined) {
					namaBankRkn = $scope.item.namaBankRkn
				}

				var noRekeningRkn = ""
				if ($scope.item.noRekeningRkn != undefined) {
					noRekeningRkn = $scope.item.noRekeningRkn
				}

				var namaPemilikRekeningRkn = ""
				if ($scope.item.namaPemilikRekeningRkn != undefined) {
					namaPemilikRekeningRkn = $scope.item.namaPemilikRekeningRkn
				}

				var namaBank = ""
				if ($scope.item.namaBank != undefined) {
					namaBank = $scope.item.namaBank
				}

				var noRekening = ""
				if ($scope.item.noRekening != undefined) {
					noRekeningRkn = $scope.item.noRekening
				}

				var namaPemilikRekening = ""
				if ($scope.item.namaPemilikRekening != undefined) {
					namaPemilikRekeningRkn = $scope.item.namaPemilikRekening
				}

				var sbk = {
					nosbk: nosbk,
					carabayar: $scope.item.caraBayar.id,
					kelompoktransaksi: $scope.item.uraianTransaksi.id,
					keteranganlainnya: $scope.item.deskripsiTransaksi,
					tagihan: tagihan,
					totalbayar: parseFloat($scope.item.totalBayar),
					tglsbk: moment($scope.item.tglBayar).format('YYYY-MM-DD HH:mm:ss'),
					bankrekanan: namaBankRkn,
					rekeningrekanan: noRekeningRkn,
					pemilikrekanan: namaPemilikRekeningRkn,
					bank: namaBank,
					rekening: noRekening,
					pemilik: namaPemilikRekening,
					sisautang: sisautang,
					nostruk: noRECC,
					keterangan: $scope.item.deskripsiTransaksi,
					ketbayar: 'Pembayaran Gaji Pegawai'
				}

				var objSave = {
					sbk: sbk
				}
				$scope.isSave = true;
				medifirstService.post('sdm/simpan-data-pembayaran-gaji', objSave).then(function (e) {
					$scope.isSave = false;

					$scope.Back()
				}, function (error) {
					$scope.isSave = false;
				})
			}

			$scope.Back = function () {
				$scope.popUp3.close()
				loadData()
			}
			$scope.fund = {}
			$scope.opsiGridKomponenGajiAdd = {

				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "10%"
					},
					{
						"field": "NoReferral",
						"title": "No Referral",
						"width": "40%"
					},
					{
						"field": "sourceAccount",
						"title": "Sumber Akun",
						"width": "20%"
					},
					{
						"field": "beneficiaryAccount",
						"title": "Akun Penerima",
						"width": "20%"
					},
					{
						"field": "amount",
						"title": "Total",
						"width": "20%"
					},
					{
						"field": "FeeType",
						"title": "Fee Type",
						"width": "20%"
					},
					{
						"field": "transactionDateTime",
						"title": "Date",
						"width": "20%"
					},
					{
						"field": "remark",
						"title": "Remark",
						"width": "20%"
					},
					{
						"command": [
							{ text: "Edit", click: EditKomponenAdd, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusKomponenAdd, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "200px",
					}
				]
			}
			$scope.opsiGridKomponenGajiAdd2 = {

				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "10%"
					},
					{
						"field": "sourceAccount",
						"title": "Sumber Akun",
						"width": "20%"
					},
					{
						"field": "beneficiaryAccount",
						"title": "Akun Penerima",
						"width": "20%"
					},
					{
						"field": "amount",
						"title": "Total",
						"width": "20%"
					},
					{
						"field": "transactionDateTime",
						"title": "Date",
						"width": "20%"
					},
					{
						"field": "remark",
						"title": "Remark",
						"width": "20%"
					},
					{
						"command": [
							{ text: "Edit", click: EditKomponenAdd2, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusKomponenAdd2, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "200px",
					}
				]
			}
			$scope.FundBRI = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu');
					return
				}


				medifirstService.get('sdm/get-gaji-perpegawai?norec=' + $scope.dataPasienSelected.norec).then(function (e) {
					let response = e.data.data
					if (response.length > 0) {
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							element.no = i + 1
							element.FeeType = 'OUR'
							element.remark = 'Pembayaran Gaji ' + element.namalengkap
							element.transactionDateTime = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
							element.NoReferral = $scope.dataPasienSelected.nonhistori + '/' + element.idpegawai
							element.sourceAccount = e.data.norekbri
							element.beneficiaryAccount = element.nomorrekening
						}
						$scope.gridKomponenGajiAdd = new kendo.data.DataSource({
							data: response
						});
						dataKomponenGajiAdd = response


					}
					$scope.popUpFund.center().open()

				})

				// initPopFund()
				// $scope.fund.remark = 'Transfer ke Pegawai '+ $scope.dataPasienSelected.namarekanan
				// $scope.fund.amount = parseFloat($scope.dataPasienSelected.subtotal)
				// $scope.fund.NoReferral = $scope.dataPasienSelected.nostruk
				// $scope.popUpFund.center().open()
			}
			$scope.bniDirect = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu');
					return
				}

				medifirstService.get('sdm/get-gaji-perpegawai?norec=' + $scope.dataPasienSelected.norec).then(function (e) {
					let response = e.data.data
					if (response.length > 0) {
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							element.no = i + 1
							element.remark = 'Pembayaran Gaji ' + element.namalengkap
							element.transactionDateTime = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
							element.sourceAccount = e.data.norekbni
							element.beneficiaryAccount = element.nomorrekening
						}
						$scope.gridKomponenGajiAdd2 = new kendo.data.DataSource({
							data: response
						});

						dataKomponenGajiAdd2 = response
					}
					$scope.norekBNI = e.data.norekbni
					$scope.popUPDirect.center().open()
				})
			}

			function initPopFund() {
				$scope.fund = {}
				$scope.fund.transactionDateTime = new Date()
				$scope.fund.FeeType = 'OUR'
				if ($scope.dataPasienSelected.date_fund != null)
					$scope.fund.transactionDateCari = new Date($scope.dataPasienSelected.date_fund)
				if ($scope.dataPasienSelected.sourceaccount != null)
					$scope.fund.sourceAccount = $scope.dataPasienSelected.sourceaccount
				if ($scope.dataPasienSelected.beneficiaryaccount != null)
					$scope.fund.beneficiaryAccount = $scope.dataPasienSelected.beneficiaryaccount
				if ($scope.dataPasienSelected.noreferral_fund != null)
					$scope.fund.noReferral = $scope.dataPasienSelected.noreferral_fund

			}
			function initPopDirect() {
				$scope.bni = {}
				$scope.bni.transactionDateTime = new Date()
				$scope.bni.FeeType = 'OUR'
				if ($scope.dataPasienSelected.date_fund != null)
					$scope.bni.transactionDateCari = new Date($scope.dataPasienSelected.date_fund)
				if ($scope.dataPasienSelected.sourceaccount != null)
					$scope.bni.sourceAccount = $scope.dataPasienSelected.sourceaccount
				if ($scope.dataPasienSelected.beneficiaryaccount != null)
					$scope.bni.beneficiaryAccount = $scope.dataPasienSelected.beneficiaryaccount
				if ($scope.dataPasienSelected.noreferral_fund != null)
					$scope.bni.noReferral = $scope.dataPasienSelected.noreferral_fund

			}
			$scope.batalFund = function () {
				initPopFund()
				$scope.popUpFund.close()
			}
			$scope.batalDirect = function () {
				initPopDirect()
				$scope.popUPDirect.close()
			}
			var noSBKK = ''

			$scope.saveBNIDirectArr = function () {
				$scope.isSave = true
				let status = false
				let json = []
				for (var i = 0; i < dataKomponenGajiAdd2.length; i++) {
					const element = dataKomponenGajiAdd2[i]
					json.push({
						// "NoReferral": element.NoReferral,
						"sourceAccount": element.sourceAccount,
						"beneficiaryAccount": element.beneficiaryAccount,
						"amount": element.amount,
						// "FeeType": element.FeeType,
						"transactionDateTime": element.transactionDateTime,
						"remark": element.remark,
					})
					$scope.isRouteLoading = true

				}
				medifirstService.postNonMessage('bni/direct-gaji',
					{
						'data': json,
						'nohistori': $scope.dataPasienSelected.nonhistori
					}
				).then(function (e) {
					// if (e.data.responseCode == '0200') {
					// 	toastr.success(e.data.responseDescription, 'Info')
					// } else {
					// 	status = false
					// 	toastr.error(e.data.errorDescription, 'Info')
					// }
					$scope.bayarBNILokal()
					$scope.isSave = false
					$scope.isRouteLoading = false
				}, function (error) {
					$scope.isRouteLoading = false
					$scope.isSave = false
				})


			}
			$scope.bayarBNILokal = function () {
				let json = {
					"sbk":
					{
						"nosbk": noSBKK,
						"carabayar": 10,
						"kelompoktransaksi": 107,
						"keteranganlainnya": "Pembayaran Gaji",
						"tagihan": parseFloat($scope.dataPasienSelected.total),
						"totalbayar": parseFloat($scope.dataPasienSelected.total),
						"tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
						"bankrekanan": "BNI",
						"rekeningrekanan": $scope.norekBNI,
						"pemilikrekanan": "",
						"bank": 'BNI',
						"rekening": "",
						"pemilik": "",
						"sisautang": parseFloat($scope.dataPasienSelected.total),
						"nostruk": $scope.dataPasienSelected.norec,
						"keterangan": "Pembayaran BNI Direct Gaji ",
					},
					"detail": dataKomponenGajiAdd2
				}

				medifirstService.post('sdm/simpan-bayar-gaji-detail', json).then(function (e) {
					noSBKK = e.data.norecsbk
					$scope.popUPDirect.close()
					init()
				})


			}
			$scope.saveTransferFundArr = function () {
				$scope.isSave = true
				let status = false
				for (var i = 0; i < dataKomponenGajiAdd.length; i++) {
					const element = dataKomponenGajiAdd[i]
					let json = {
						"NoReferral": element.NoReferral,
						"sourceAccount": element.sourceAccount,
						"beneficiaryAccount": element.beneficiaryAccount,
						"amount": element.amount,
						"FeeType": element.FeeType,
						"transactionDateTime": element.transactionDateTime,
						"remark": element.remark,
					}
					$scope.isRouteLoading = true
					medifirstService.postNonMessage('bri/fund/transfer', json).then(function (e) {
						if (e.data.responseCode == '0200') {
							toastr.success(e.data.responseDescription, 'Info')
						} else {
							status = false
							toastr.error(e.data.errorDescription, 'Info')
						}

						$scope.isSave = false
						$scope.isRouteLoading = false
					}, function (error) {
						$scope.isRouteLoading = false
						$scope.isSave = false
					})
				}
				$scope.bayarFundLokal(true)

				// if(status){
				// 	$scope.bayarFundLokal()
				// }

			}
			$scope.saveTransferFund = function () {
				$scope.isSave = true
				let json = {
					"NoReferral": $scope.fund.NoReferral,
					"sourceAccount": $scope.fund.sourceAccount,
					"beneficiaryAccount": $scope.fund.beneficiaryAccount,
					"amount": $scope.fund.amount,
					"FeeType": $scope.fund.FeeType,
					"transactionDateTime": moment($scope.fund.transactionDateTime).format('DD-MM-YYYY HH:mm:ss'),
					"remark": $scope.fund.remark,
				}
				$scope.isRouteLoading = true
				medifirstService.postNonMessage('bri/fund/transfer', json).then(function (e) {
					if (e.data.responseCode == '0200') {
						toastr.success(e.data.responseDescription, 'Info')
						$scope.bayarFundLokal(json)
						$scope.popUpFund.close()
					} else {
						toastr.error(e.data.errorDescription, 'Info')
					}

					$scope.isSave = false
					$scope.isRouteLoading = false
				}, function (error) {
					$scope.isRouteLoading = false
					$scope.isSave = false
				})
			}
			$scope.bayarFundLokal = function (data) {

				let json = {
					"sbk":
					{
						"nosbk": noSBKK,
						"carabayar": 8,//SCF BRI
						"kelompoktransaksi": 107,
						"keteranganlainnya": "Pembayaran Gaji",
						"tagihan": parseFloat($scope.dataPasienSelected.total),
						"totalbayar": parseFloat($scope.dataPasienSelected.total),
						"tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
						"bankrekanan": "BANK RAKYAT INDONESIA",
						"rekeningrekanan": "888801000157508",
						"pemilikrekanan": "",
						"bank": "BANK RAKYAT INDONESIA",
						"rekening": "",
						"pemilik": "",
						"sisautang": parseFloat($scope.dataPasienSelected.total),
						"nostruk": $scope.dataPasienSelected.norec,
						"keterangan": "Pembayaran Fund Transfer BRI ",
					},
					"detail": dataKomponenGajiAdd
				}

				medifirstService.post('sdm/simpan-bayar-gaji-detail', json).then(function (e) {
					noSBKK = e.data.norecsbk
					$scope.popUpFund.close()
					init()
				})


			}
			$scope.transferStatusFund = function () {
				$scope.isRouteLoading = true
				$scope.showStatusFund = false
				medifirstService.postNonMessage('bri/fund/check-transfer-status',
					{
						"noReferral": $scope.fund.noReferral,
						"transactionDate": moment($scope.fund.transactionDateCari).format('DD-MM-YYYY')
					}
				).then(function (e) {
					$scope.isRouteLoading = false

					if (e.data.responseCode == '0300') {
						$scope.showStatusFund = true
						$scope.fund.data = e.data.data
						toastr.info(e.data.responseDescription, 'Info')
					} else {
						$scope.showStatusFund = false
						toastr.error(e.data.responseDescription, 'Info')
					}
				})
			}
			$scope.validasiAccount = function () {
				$scope.isRouteLoading = true
				$scope.showValidasi = false
				medifirstService.postNonMessage('bri/fund/validasi-account',
					{
						"sourceAccount": $scope.fund.sourceAccount,
						"beneficiaryAccount": $scope.fund.beneficiaryAccount
					}
				).then(function (e) {
					$scope.isRouteLoading = false

					if (e.data.responseCode == '0100') {
						$scope.showValidasi = true
						$scope.fund.Data = e.data.Data
						toastr.info(e.data.responseDescription, 'Info')
					} else {
						$scope.showValidasi = false
						toastr.error(e.data.responseDescription, 'Info')
					}
				})
			}

			$scope.batalKomponenAdd = function () {
				ClearDataKomponenAdd();
				$scope.popUpKomponenGajiAdd.close();
			}
			function ClearDataKomponenAdd() {
				$scope.itemKomponenAdd = {};
			};

			$scope.tambahKomponenAdd = function () {
				var listRawRequired = [
					"itemKomponenAdd.NoReferral|ng-model|No Referral",
					"itemKomponenAdd.sourceAccount|ng-model|Sumber Akun ",
					"itemKomponenAdd.beneficiaryAccount|ng-model|Akun Penerima ",
					"itemKomponenAdd.amount|ng-model|amount",
					"itemKomponenAdd.FeeType|ng-model|FeeType ",
					"itemKomponenAdd.transactionDateTime|ng-model|transactionDateTime ",
					"itemKomponenAdd.remark|ng-model| Remark ",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {

					var data = {};
					if ($scope.item.nomorId != undefined) {
						for (var i = dataKomponenGajiAdd.length - 1; i >= 0; i--) {
							if (dataKomponenGajiAdd[i].no == $scope.item.nomorId) {
								data.no = $scope.item.nomorId,
									data.NoReferral = $scope.itemKomponenAdd.NoReferral,
									data.sourceAccount = $scope.itemKomponenAdd.sourceAccount,
									data.beneficiaryAccount = $scope.itemKomponenAdd.beneficiaryAccount,
									data.transactionDateTime = moment($scope.itemKomponenAdd.transactionDateTime).format('DD-MM-YYYY HH:mm:ss'),
									data.amount = $scope.itemKomponenAdd.amount,
									data.FeeType = $scope.itemKomponenAdd.FeeType,
									data.remark = $scope.itemKomponenAdd.remark,
									data.idpegawai = $scope.itemKomponenAdd.idpegawai,

									dataKomponenGajiAdd[i] = data;
								$scope.gridKomponenGajiAdd = new kendo.data.DataSource({
									data: dataKomponenGajiAdd
								});
							}
						}

					}
					ClearDataKomponenAdd();
					$scope.popUpKomponenGajiAdd.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
			$scope.itemKomponenAdd = {}
			function EditKomponenAdd(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.nomorId = dataItem.no;
				$scope.itemKomponenAdd.NoReferral = dataItem.NoReferral;
				$scope.itemKomponenAdd.sourceAccount = dataItem.sourceAccount;
				$scope.itemKomponenAdd.beneficiaryAccount = dataItem.beneficiaryAccount;
				$scope.itemKomponenAdd.transactionDateTime = new Date();
				$scope.itemKomponenAdd.amount = dataItem.amount;
				$scope.itemKomponenAdd.FeeType = dataItem.FeeType;
				$scope.itemKomponenAdd.remark = dataItem.remark;
				$scope.itemKomponenAdd.idpegawai = dataItem.idpegawai;

				$scope.popUpKomponenGajiAdd.center().open();
			}
			function HapusKomponenAdd(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataKomponenGajiAdd.length - 1; i >= 0; i--) {
					if (dataKomponenGajiAdd[i].no == dataItem.no) {
						dataKomponenGajiAdd.splice(i, 1);
					}
				}
				grid.removeRow(row);
			}



			$scope.batalKomponenAdd2 = function () {
				ClearDataKomponenAdd2();
				$scope.popUpKomponenGajiAdd2.close();
			}
			function ClearDataKomponenAdd2() {
				$scope.itemKomponenAdd2 = {};
			};

			$scope.tambahKomponenAdd2 = function () {
				var listRawRequired = [
					"itemKomponenAdd2.sourceAccount|ng-model|Sumber Akun ",
					"itemKomponenAdd2.beneficiaryAccount|ng-model|Akun Penerima ",
					"itemKomponenAdd2.amount|ng-model|amount",
					// "itemKomponenAdd2.FeeType|ng-model|FeeType ",
					"itemKomponenAdd2.transactionDateTime|ng-model|transactionDateTime ",
					"itemKomponenAdd2.remark|ng-model| Remark ",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {

					var data = {};
					if ($scope.item.nomorId2 != undefined) {
						for (var i = dataKomponenGajiAdd2.length - 1; i >= 0; i--) {
							if (dataKomponenGajiAdd2[i].no == $scope.item.nomorId2) {
								data.no = $scope.item.nomorId2,
									// data.NoReferral = $scope.itemKomponenAdd.NoReferral,
									data.sourceAccount = $scope.itemKomponenAdd2.sourceAccount,
									data.beneficiaryAccount = $scope.itemKomponenAdd2.beneficiaryAccount,
									data.transactionDateTime = moment($scope.itemKomponenAdd2.transactionDateTime).format('DD-MM-YYYY HH:mm:ss'),
									data.amount = $scope.itemKomponenAdd2.amount,
									// data.FeeType = $scope.itemKomponenAdd2.FeeType,
									data.remark = $scope.itemKomponenAdd2.remark,
									data.idpegawai = $scope.itemKomponenAdd2.idpegawai,

									dataKomponenGajiAdd2[i] = data;
								$scope.gridKomponenGajiAdd2 = new kendo.data.DataSource({
									data: dataKomponenGajiAdd2
								});
							}
						}

					}
					ClearDataKomponenAdd2();
					$scope.popUpKomponenGajiAdd2.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
			$scope.itemKomponenAdd = {}
			$scope.itemKomponenAdd2 = {}
			function EditKomponenAdd2(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.nomorId2 = dataItem.no;
				// $scope.itemKomponenAdd.NoReferral = dataItem.NoReferral;
				$scope.itemKomponenAdd2.sourceAccount = dataItem.sourceAccount;
				$scope.itemKomponenAdd2.beneficiaryAccount = dataItem.beneficiaryAccount;
				$scope.itemKomponenAdd2.transactionDateTime = new Date();
				$scope.itemKomponenAdd2.amount = dataItem.amount;
				// $scope.itemKomponenAdd.FeeType = dataItem.FeeType;
				$scope.itemKomponenAdd2.remark = dataItem.remark;
				$scope.itemKomponenAdd2.idpegawai = dataItem.idpegawai;

				$scope.popUpKomponenGajiAdd2.center().open();
			}
			function HapusKomponenAdd2(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataKomponenGajiAdd2.length - 1; i >= 0; i--) {
					if (dataKomponenGajiAdd2[i].no == dataItem.no) {
						dataKomponenGajiAdd2.splice(i, 1);
					}
				}
				grid.removeRow(row);
			}
			$scope.openMenu = function ($mdOpenMenu,e){
				$mdOpenMenu(e);
			}

		}
	]);
});