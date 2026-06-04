define(['initialize', 'Configuration'], function (initialize, config) {
	'use strict';
	initialize.controller('OrderGiziTelemedicineCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService', '$http',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService, $http) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.isRouteLoading = false;
			$scope.listProduk = []
			$scope.listMenu = []
			$scope.popUp = {};
			loadCombo();

			function loadCombo() {
				var cachePeriode = cacheHelper.get('cacheOrderGiziTelemedicine');
				if (cachePeriode != undefined) {
					var arrPeriode = cachePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
				}

				var obj = {
					"tableArr": [
						{ "table": "menumakanan_m" },
						{
							"table": "produk_m",
							"where": [
								{ 'column': 'objectkategoryprodukfk', 'operator': '=', 'value': 7 }
							]
						}
					]
				};
				medifirstService.post('sysadmin/master/get-data-combo', obj).then(function (data) {
					console.log(data);

					$scope.listProduk = data.data.produk_m;
					$scope.listMenu = data.data.menumakanan_m;
					loadData();
				});
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			};

			$scope.SearchData = function () {
				loadData();
			};

			$scope.data2 = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details
					}),
					columns: [
						{ "field": "tanggal", "title": "Tanggal Menu", "width": "40px" },
						{ "field": "namaproduk", "title": "Nama Produk", "width": "200px" },
						{ "field": "menumakanan", "title": "Nama Menu", "width": "200px" },
						{ "field": "jumlah", "title": "Jumlah", "width": "60px" },
						{ "field": "hargasatuan", "title": "Harga Satuan", "width": "60px" },
						{ "field": "total", "title": "Subtotal", "width": "60px" },
					]
				};
			};

			$scope.klikDetail = function (dataItem) {
				$scope.dataSelected2 = dataItem;
			};

			function loadData() {
				$scope.dataPasienSelected = {}
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');

				var reg = $scope.item.noReg != undefined ? "&noreg=" + $scope.item.noReg : "";
				var rm = $scope.item.noRm != undefined ? "&norm=" + $scope.item.noRm : "";
				var nm = $scope.item.nama != undefined ? "&nama=" + $scope.item.nama : "";
				var noorder = $scope.item.noOrder != undefined ? "&noorder=" + $scope.item.noOrder : "";
				var produkId = $scope.item.produk != undefined ? "&produkId=" + $scope.item.produk.id : "";
				var menuId = $scope.item.menuMakanan != undefined ? "&menuId=" + $scope.item.menuMakanan.id : "";

				medifirstService.get("gizi/telemedicine/get-order-diet?" +
					"tglAwal=" + tglAwal +
					"&tglAkhir=" + tglAkhir +
					reg + rm + nm + noorder + produkId + menuId)
					.then(function (data) {
						$scope.isRouteLoading = false;
						var result = data.data.data;
						for (var i = 0; i < result.length; i++) {
							result[i].no = i + 1;
						}
						$scope.sourceGrid = new kendo.data.DataSource({
							data: result,
							pageSize: 10,
							total: result.length,
							serverPaging: false,
						});
						$scope.selectedOnCheck = [];
						cacheHelper.set('cacheOrderGiziTelemedicine', tglAwal + "~" + tglAkhir);
					});
			}

			$scope.columnGrid = [

				{ "field": "no", "title": "No", "width": "40px" },
				{ "field": "noorder", "title": "Kode Transaksi", "width": "130px" },
				{ "field": "nocm", "title": "NOCM", "width": "130px" },
				{ "field": "namapasien", "title": "Nama Pemesan", "width": "150px" },
				{ "field": "nohp", "title": "Nomor Telepon", "width": "120px" },
				{ "field": "alamatlengkap", "title": "Alamat", "width": "200px" },
				{ "field": "status", "title": "Status", "width": "90px" },
				{
					title: "Aksi",
					width: "350px",
					template: function (dataItem) {
						var btn = '';

						if (dataItem.status == "ORDER") {
							btn += '<button class="k-button" ng-click="verifikasi(dataItem)">Verifikasi</button> ';
							btn += '<button class="k-button" ng-click="batalOrder(dataItem)">Batal Order</button> ';
						} else {
							if (dataItem.bukti_bayar) {
								btn += '<button class="k-button" ng-click="lihatBuktiBayar(dataItem)">Lihat Bukti Bayar</button>';
							} else if (!dataItem.bukti_bayar) {
								btn += '<button class="k-button" ng-click="openBuktiBayar(dataItem)">Upload Bukti Bayar</button> ';
							}
						}

						return btn;
					}
				}
			];

			$scope.pop = {};
			$scope.pop.jenisDiet = [];

			$scope.verifikasi = function (dataItem) {

				if (dataItem == undefined) {
					toastr.error('Pilih data dulu');
					return;
				}
				var obj = {
					"norec": "",
					"norec_so": dataItem.norec_so,
					"kelompoktransaksifk": 8,
					"keteranganlainnya": "-",
					"namapasien_klien": dataItem.namapasien,
					"notelp_klien": dataItem.nohp,
					"tglstruk": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					"totalharusdibayar": dataItem.totalharusdibayar || 0,
					"details": dataItem.details.map(function (item, index) {
						return {
							"no": index + 1,
							"norec_siklus": item.norec,
							"id": item.produk_id,
							"namaproduk": item.namaproduk,
							"jumlah": item.jumlah,
							"qtyoranglast": 1,
							"harga": item.hargasatuan,
							"keterangan": item.menumakanan + " " + item.tanggal,
							"nopolisi": "",
							"jeniskegiatan": "",
							"totalK": item.total
						}
					}),
					"nopolisi": "",
					"jeniskegiatan": "",
					"petugaspelayananambulan": [],
					"nocm_klien": dataItem.nocm
				};


				medifirstService.post('gizi/telemedicine/verifikasi-order-diet', obj)
					.then(function (response) {
						toastr.success('Verifikasi order berhasil');
						loadData();
					})
					.catch(function (error) {
						toastr.error('Verifikasi order gagal: ' + (error.statusText || error));
					});
			};
			$scope.batalOrder = function (dataItem) {
				if (!dataItem) {
					toastr.error('Pilih data dulu');
					return;
				}
				var obj = {
					"norec": dataItem.norec_so
				};
				medifirstService.post('gizi/telemedicine/batal-order-diet', obj)
					.then(function () {
						toastr.success('Batal order berhasil');
						loadData();
					})
					.catch(function (error) {
						toastr.error('Batal order gagal: ' + (error.statusText || error));
					});
			};


			$scope.batalVerifikasi = function () {
				if (!$scope.dataPasienSelected) {
					toastr.error('Pilih data dulu');
					return;
				}
				if ($scope.dataPasienSelected.status != 'VERIFIKASI') {
					toastr.error('Data belum berstatus VERIFIKASI');
					return;
				}
				var obj = {
					"norec_so": $scope.dataPasienSelected.norec_so
				};
				medifirstService.post('gizi/telemedicine/batal-verifikasi-order-diet', obj)
					.then(function (response) {
						toastr.success('Batal verifikasi berhasil');
						loadData();
					})
					.catch(function (error) {
						toastr.error('Batal verifikasi gagal: ' + (error.statusText || error));
					});
			};

			// $scope.EditOrder = function () {
			// 	if ($scope.dataPasienSelected == undefined) {
			// 		toastr.error('Pilih data dulu');
			// 		return;
			// 	}
			// 	var select = $scope.dataPasienSelected;
			// 	select.tglmenu = new Date(select.tglmenu);
			// 	$scope.pop = select;
			// 	$scope.pop.jenisDiet = [];
			// 	$scope.pop.jenisWaktu = { id: select.objectjeniswaktufk, jeniswaktu: select.jeniswaktu };
			// 	if (select.jenisdiet && select.jenisdiet.length > 0) {
			// 		for (var i = 0; i < select.jenisdiet.length; i++) {
			// 			$scope.pop.jenisDiet.push({ id: select.jenisdiet[i].id, jenisdiet: select.jenisdiet[i].jenisdiet });
			// 		}
			// 	}
			// 	$scope.pop.kategoriDiet = { id: select.objectkategorydietfk, kategorydiet: select.kategorydiet };
			// 	$scope.pop.keterangan = select.keteranganlainnya;
			// 	$scope.pop.pengorder = select.pegawaiorder;
			// 	$scope.popUpOrder.center().open();
			// };

			// $scope.saveEditOrder = function () {
			// 	if (!$scope.pop.jenisDiet || $scope.pop.jenisDiet.length == 0) {
			// 		toastr.error('Jenis Diet belum di pilih !');
			// 		return;
			// 	}
			// 	if ($scope.pop.kategoriDiet == undefined) {
			// 		toastr.error('Kategori Diet belum di pilih !');
			// 		return;
			// 	}
			// 	if ($scope.pop.jenisWaktu == undefined) {
			// 		toastr.error('Jenis Waktu belum di pilih');
			// 		return;
			// 	}

			// 	var jenisDiet = "";
			// 	var a = "";
			// 	for (var i = $scope.pop.jenisDiet.length - 1; i >= 0; i--) {
			// 		a = a + "," + $scope.pop.jenisDiet[i].id;
			// 	}
			// 	jenisDiet = a.slice(1);

			// 	$scope.tombolSimpanVis = true;
			// 	var objSave = {
			// 		'strukorder': {
			// 			"norec": $scope.pop.norec_so,
			// 			"tglmenu": moment($scope.pop.tglmenu).format('YYYY-MM-DD HH:mm'),
			// 		},
			// 		'orderpelayanan': {
			// 			"norec": $scope.pop.norec_op,
			// 			"objectjeniswaktufk": $scope.pop.jenisWaktu.id,
			// 			"objectkategorydietfk": $scope.pop.kategoriDiet.id,
			// 			"keterangan": $scope.pop.keterangan || '',
			// 			"objectjenisdietfk": jenisDiet,
			// 		}
			// 	};

			// 	medifirstService.post('gizi/update-peritem-order', objSave).then(function () {
			// 		$scope.tombolSimpanVis = false;
			// 		$scope.pop = {};
			// 		$scope.popUpOrder.close();
			// 		loadData();
			// 	}, function () {
			// 		$scope.tombolSimpanVis = false;
			// 	});
			// };

			// $scope.batalEdit = function () {
			// 	$scope.pop = {};
			// 	$scope.pop.jenisDiet = [];
			// 	$scope.popUpOrder.close();
			// };

			$scope.hapusOrder = function () {
				if ($scope.selectedOnCheck.length == 0) {
					toastr.error('Ceklis data dulu');
					return;
				}
				for (var i = 0; i < $scope.selectedOnCheck.length; i++) {
					if ($scope.selectedOnCheck[i].strukkirimfk != null) {
						toastr.error('Tidak bisa hapus data yang sudah dikirim');
						return;
					}
				}
				var data = { 'orderpelayanan': $scope.selectedOnCheck };
				medifirstService.post('gizi/hapus-peritem-order', data).then(function () {
					$scope.selectedOnCheck = [];
					loadData();
				});
			};

			$scope.cetakLabel = function () {
				if (!$scope.selectedOnCheck || $scope.selectedOnCheck.length === 0) {
					toastr.error('Pilih data terlebih dahulu');
					return;
				}
				var listNorec = $scope.selectedOnCheck
					.filter(function (item) { return item.norec_so; })
					.map(function (item) { return item.norec_so; });
				var url = config.baseApiBackend + "gizi/cetak-label-gizi?norec=" + listNorec.join(',');
				window.open(url, '_blank');
			};

			$scope.closeDialog = function () {
				$mdDialog.cancel();
			};

			$scope.isImageFile = function (filePath) {
				if (!filePath) return false;
				var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
				var path = filePath;
				if (path.indexOf('?file=') !== -1) {
					path = path.split('?file=').pop();
				}
				var extension = path.split('.').pop().toLowerCase();
				return imageExtensions.indexOf(extension) !== -1;
			};

			$scope.downloadBuktiBayar = function (filePath) {
				if (!filePath) {
					toastr.error('File tidak ditemukan');
					return;
				}
				var url = filePath;
				if (url.indexOf('http') === -1) {
					url = config.baseApiBackend + filePath;
				}
				window.open(url, '_blank');
			};

			$scope.openBuktiBayar = function (dataItem) {
				$scope.popUpBuktiBayar.center().open();
				console.log(dataItem);

				if (!dataItem) {
					toastr.error('Pilih data dulu');
					return;
				}
				$scope.popUp = {
					noorder: dataItem.noorder,
					norec: dataItem.norec_so,
					details: dataItem.details
				};
				var fileInput = document.getElementById('fileBuktiBayar');
				if (fileInput) {
					fileInput.value = '';
				}
			};

			$scope.batalBuktiBayar = function () {
				$scope.popUp = {};
				$scope.popUpBuktiBayar.close();
			};
			function getAuthorization() {
				var authorization = '';
				var arr = document.cookie.split(';');
				for (var i = 0; i < arr.length; i++) {
					var element = arr[i].split('=');
					if (element[0].indexOf('authorization') > -1) {
						authorization = element[1];
					}
				}
				return authorization;
			}
			// function postFormData(url, formData) {
			// 	return ;
			// }
			$scope.saveBuktiBayar = function () {
				var file = document.getElementById('fileBuktiBayar').files[0];
				if (!file) { toastr.error('Pilih file bukti bayar'); return; }
				var formData = new FormData();
				formData.append('file', file);
				formData.append('norec', $scope.popUp.norec || '');
				$scope.isSavingBukti = true;
				fetch(config.baseApiBackend + 'gizi/telemedicine/upload-bukti-bayar', {
					method: 'POST',
					body: formData,
					headers: {
						'X-AUTH-TOKEN': getAuthorization()
					}
				}).then(function (res) {
					$scope.isSavingBukti = false;
					toastr.success('Bukti bayar berhasil diupload');
					$scope.popUpBuktiBayar.close();
					loadData();
				}, function (err) {
					$scope.isSavingBukti = false;
					toastr.error('Upload bukti bayar gagal');
				});
			};
		}
	]);
});
