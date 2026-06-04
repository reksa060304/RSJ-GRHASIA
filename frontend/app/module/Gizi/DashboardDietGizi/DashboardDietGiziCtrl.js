define(['initialize', 'Configuration'], function (initialize, config) {
	'use strict';
	initialize.controller('DashboardDietGiziCtrl', ['$scope', 'MedifirstService', '$http',
		function ($scope, medifirstService, $http) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00'));
			$scope.item.periodeAkhir = new Date(moment(new Date()).format('YYYY-MM-DD 23:59'));
			$scope.isRouteLoading = false;
			$scope.isSavingBukti = false;
			$scope.pop = {};
			$scope.listPegawai = []

			loadData();

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');

				var noorder = $scope.item.noOrder ? '&noorder=' + $scope.item.noOrder : '';
				var norm = $scope.item.noRm ? '&norm=' + $scope.item.noRm : '';
				var nama = $scope.item.nama ? '&nama=' + $scope.item.nama : '';

				medifirstService.get('gizi/telemedicine/get-order-diet-verified?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + noorder + norm + nama)
					.then(function (data) {
						var result = data.data.data || [];
						result = buildMenuRows(result);
						$scope.sourceGrid = new kendo.data.DataSource({
							data: result,
							pageSize: 10,
							total: result.length,
							serverPaging: false,
						});
						$scope.isRouteLoading = false;
					}).catch(function (error) {
						$scope.isRouteLoading = false;
						toastr.error('Gagal memuat daftar diet gizi yang sudah diverifikasi');
					});
			}

			$scope.SearchData = function () { loadData(); };

			$scope.formatTanggal = function (tanggal) {
				if (!tanggal) return '-';
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			};

			$scope.formatRupiah = function (value) {
				value = value || 0;
				return parseFloat(value).toLocaleString('id-ID');
			};

			$scope.statusTemplate = function (status) {
				if (status == 'DISIAPKAN') {
					return '<span class="status-disiapkan">Sedang Disiapkan</span>';
				}
				if (status == 'SIAP') {
					return '<span class="status-siap">Makanan Siap Diambil</span>';
				}
				return '<span class="status-verifikasi">Sudah Diverifikasi</span>';
			};

			$scope.columnGrid = [
				{ field: "no", title: "No", width: "40px" },
				{ field: "noorder", title: "Kode Transaksi", width: "130px" },
				{ field: "nocm", title: "No RM", width: "90px" },
				{ field: "namapasien", title: "Nama Pemesan", width: "150px" },
				{ field: "nohp", title: "No. Telepon", width: "110px" },
				{ field: "tglorder", title: "Tgl Order", width: "120px", template: "<span>{{formatTanggal('#: tglorder #')}}</span>" },
				{ field: "tglmenu", title: "Tgl Menu", width: "120px", template: "<span>{{formatTanggal('#: tglmenu #')}}</span>" },
				{ field: "menumakanan", title: "Menu Makanan", width: "150px" },
				{ field: "namaproduk", title: "Produk", width: "160px" },
				{ field: "jumlah", title: "Jumlah", width: "60px", attributes: { style: "text-align:right" } },
				{ field: "hargasatuan", title: "Harga", width: "90px", attributes: { style: "text-align:right" }, template: "<span>{{formatRupiah('#: hargasatuan || 0 #')}}</span>" },
				{ field: "total", title: "Total", width: "90px", attributes: { style: "text-align:right" }, template: "<span>{{formatRupiah('#: total || 0 #')}}</span>" },
				{
					field: "status",
					title: "Status",
					width: "100px"
				},
				{
					title: "Aksi",
					width: "350px",
					template: function (dataItem) {
						console.log(dataItem);

						var btn = '';
						if (!dataItem.tgl_disiapkan) {
							btn = '<button class="k-button" ng-click="updateStatus(dataItem, \'DISIAPKAN\', \'Status diubah: Sedang Disiapkan\')">Sedang Disiapkan</button> ';
						} else if (!dataItem.tgl_siap_ambil) {
							btn = '<button class="k-button" ng-click="updateStatus(dataItem, \'SIAP\', \'Status diubah: Siap Diambil\')">Siap Diambil</button> ';
						} else if (!dataItem.tgl_verifikasi) {
							btn = '<button class="k-button" ng-click="popUpAmbilFunc(dataItem)">Pengambilan / Penyerahan</button> ';
						}
						return btn;
					},
				}

			];

			$scope.terimaOrder = function (dataItem) {
				console.log(dataItem);

				if (!dataItem) {
					toastr.error('Pilih data dulu');
					return;
				}
				$scope.pop = {
					noorder: dataItem.noorder,
					menumakanan: dataItem.menumakanan,
					norec_so: dataItem.strukorderfk,
					norec_op: dataItem.strukpelayananfk,
					norec: dataItem.norec
				};
				var fileInput = document.getElementById('fileBuktiBayar');
				if (fileInput) {
					fileInput.value = '';
				}
				$scope.popUpBuktiBayar.center().open();
			};

			$scope.batalBuktiBayar = function () {
				$scope.pop = {};
				$scope.popUpBuktiBayar.close();
			};

			$scope.saveBuktiBayar = function () {
				var file = document.getElementById('fileBuktiBayar').files[0];
				if (!file) { toastr.error('Pilih file bukti bayar'); return; }
				var formData = new FormData();
				formData.append('file', file);
				formData.append('norec', $scope.pop.norec || '');
				$scope.isSavingBukti = true;
				postFormData('gizi/telemedicine/upload-bukti-bayar', formData).then(function () {
					$scope.isSavingBukti = false;
					toastr.success('Bukti bayar berhasil diupload');
					$scope.popUpBuktiBayar.close();
					loadData();
				}, function () {
					$scope.isSavingBukti = false;
					toastr.error('Upload bukti bayar gagal');
				});
			};

			$scope.sedangDisiapkan = function (dataItem) {
				updateStatus(dataItem, 'DISIAPKAN', 'Status diubah: Sedang Disiapkan');
			};

			$scope.makananSiap = function (dataItem) {
				updateStatus(dataItem, 'SIAP', 'Status diubah: Makanan Siap Diambil');
			};

			$scope.updateStatus = function (dataItem, status, message) {
				if (!dataItem) {
					toastr.error('Pilih data dulu');
					return;
				}
				medifirstService.post('gizi/telemedicine/update-status-order', {
					norec: dataItem.norec,
					status: status,
					objectpegawaifk: dataItem.pegawai?.id
				})
					.then(function () {
						toastr.success(message);
						loadData();
					}, function () {
						toastr.error('Gagal mengubah status order');
					});
			}

			function buildMenuRows(data) {
				var rows = [];
				for (var i = 0; i < data.length; i++) {
					var order = data[i];
					var details = order.details || [];
					if (details.length == 0) {
						rows.push(buildRow(order, {}, rows.length + 1));
						continue;
					}
					for (var j = 0; j < details.length; j++) {
						rows.push(buildRow(order, details[j], rows.length + 1));
					}
				}
				return rows;
			}

			function buildRow(order, detail, no) {
				var jumlah = order.jumlah || 0;
				var harga = order.hargasatuan || 0;
				return {
					no: no,
					norec_so: order.strukorderfk,
					norec_sp: order.strukpelayananfk,
					norec: order.norec,
					noorder: order.noorder,
					nocm: order.nocm,
					namapasien: order.namapasien,
					nohp: order.nohp,
					alamatlengkap: order.alamatlengkap,
					tglorder: order.tglorder,
					tglmenu: order.tanggal,
					menumakanan: order.menumakanan || '-',
					namaproduk: order.namaproduk || '-',
					jumlah: jumlah,
					hargasatuan: harga,
					total: order.total || (jumlah * harga),
					status: order.status,
					tgl_disiapkan: order.tgl_disiapkan,
					tgl_siap_ambil: order.tgl_siap_ambil,
					tgl_verifikasi: order.tgl_verifikasi
				};
			}

			function postFormData(url, formData) {
				return $http({
					method: 'POST',
					url: config.baseApiBackend + url,
					headers: {
						'Content-Type': undefined,
						'X-AUTH-TOKEN': getAuthorization()
					},
					transformRequest: angular.identity,
					data: formData
				});
			}

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

			$scope.popUpAmbilFunc = function (dataItem) {
				$scope.pop = {
					noorder: dataItem.noorder,
					menumakanan: dataItem.menumakanan,
					norec_so: dataItem.strukorderfk,
					norec_op: dataItem.strukpelayananfk,
					norec: dataItem.norec
				};
				$scope.popUpAmbil.center().open();
			}
			function loadCombo() {
				var obj = {
					"tableArr": [
						{
							"table": "pegawai_m",
							"where": [
								{ 'column': 'statusenabled', 'operator': '=', 'value': true }
							]
						},
					]
				}
				medifirstService.post('sysadmin/master/get-data-combo', obj).then(function (data) {

					$scope.listPegawai = data.data.pegawai_m;
				});
			}
			loadCombo()

		}
	]);
});
