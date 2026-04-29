define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('KategoryProdukDietCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
		function ($rootScope, $scope, medifirstService, $window, $timeout) {
			$scope.item = {};
			$scope.popUp = {};
			$scope.isRouteLoading = false;

			//loadCombo();
			loadData();
			$scope.Search = function () {
				loadData()
			}
			$scope.Clear = function () {
				delete $scope.item.id
				delete $scope.item.kategoryProdukDiet
				// delete $scope.item.kategoryProduk
				delete $scope.popUp.id
				delete $scope.popUp.kategoryProdukDiet
				// delete $scope.popUp.kategoryProduk
				delete $scope.popUp.jumlah
				delete $scope.popUp.keterangan
			

			}


			function loadCombo() {
				medifirstService.get("sysadmin/master/get-kategory-produk-catering"
				).then(function (e) {
					$scope.listKategoryProduk = e.data
				})

			}
			function loadData() {
				$scope.isRouteLoading = true;
				var id = ""
				if ($scope.item.id != undefined) {
					id = "&id=" + $scope.item.id
				}
				var kategoryProdukDiet = ""
				if ($scope.item.kategoryProdukDiet != undefined) {
					kategoryProdukDiet = "&produkDiet=" + $scope.item.kategoryProdukDiet
				}
				// var katProduk = ""
				// if ($scope.item.kategoryProduk != undefined) {
				// 	katProduk = "&kategoryProdukId=" + $scope.item.kategoryProduk.id
				// }
				medifirstService.get("sysadmin/master/get-daftar-kategoryprodukdiet?"
					+ kategoryProdukDiet
					// + katProduk
					+ id).then(function (data) {
						$scope.isRouteLoading = false;
						for (var i = 0; i < data.data.data.length; i++) {
							data.data.data[i].no = i + 1
						}
						$scope.dataSource = new kendo.data.DataSource({
							data: data.data.data,
							pageSize: 10,
							serverPaging: true,


						});



					})
			}
			$scope.columnGrid = {
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],


				columns: [{
					"field": "no",
					"title": "<h3 align=center>No</h3>",
					"width": "23px",
					"attributes": { align: "center" }

				},
				{
					"field": "id",
					"title": "<h3 align=center>ID</h3>",
					"width": "50px"
				},
				{
					"field": "namaproduk",
					"title": "<h3 align=center>Produk Diet</h3>",
					"width": "150px"
				},
				// {
				// 	"field": "kategoryproduk",
				// 	"title": "<h3 align=center>Kategory Produk</h3>",
				// 	"width": "100px"
				// },
					{
					"field": "qproduk",
					"title": "<h3 align=center>Jumlah</h3>",
					"width": "50px"
				},
					{
					"field": "keterangan",
					"title": "<h3 align=center>Keterangan</h3>",
					"width": "150px"
				},
				{
					"command": [{
						text: "Hapus",
						click: hapusData,
						imageClass: "k-icon k-delete"
					}, {
						text: "Edit",
						click: editData,
						imageClass: "k-icon k-i-pencil"
					}],
					title: "",
					width: "130px",
				}

				]
			};

			$scope.Tambah = function () {
				delete $scope.item.id
				delete $scope.item.kategoryProdukDiet
				// delete $scope.item.kategoryProduk
				delete $scope.popUp.id
				delete $scope.popUp.kategoryProdukDiet
				// delete $scope.popUp.kategoryProduk
				delete $scope.popUp.jumlah
				delete $scope.popUp.keterangan
				$scope.popUp.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id

				var kategoryProdukDiet = ""
				if ($scope.popUp.kategoryProdukDiet != undefined)
					kategoryProdukDiet = $scope.popUp.kategoryProdukDiet

				// var kategoryProdukId = null
				// if ($scope.popUp.kategoryProduk != undefined)
				// 	kategoryProdukId = $scope.popUp.kategoryProduk.id

				var jumlah = 0
				if ($scope.popUp.jumlah != undefined)
					jumlah = $scope.popUp.jumlah

				var keterangan = ""
				if ($scope.popUp.keterangan != undefined)
					keterangan = $scope.popUp.keterangan

				var objSave = {
					"id": id,
					"namaexternal": kategoryProdukDiet,
					"namaproduk": kategoryProdukDiet,
					"statusenabled": true,
					"reportdisplay": kategoryProdukDiet,
					"keterangan": keterangan,
					"jumlah": parseInt(jumlah),
					// "objectkategoryprodukfk": kategoryProdukId,
				}
				medifirstService.post('sysadmin/master/save-kategoryprodukdiet',objSave).then(function (res) {
					loadData();
					$scope.Clear();
				})

			}


			function hapusData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post('sysadmin/master/delete-kategoryprodukdiet',itemDelete).then(function (res) {
					if (res.status === 201) {
						loadData();
						grid.removeRow(row);
					}
				})

			}
			function editData(e) {
				$scope.Clear();
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
			
				$scope.popUp.id = dataItem.id
				$scope.popUp.kategoryProdukDiet = dataItem.namaproduk
				$scope.popUp.jumlah = dataItem.qproduk
				$scope.popUp.keterangan = dataItem.keterangan
				// if (dataItem.objectkategoryprodukfk != null) {
				// 	$scope.popUp.kategoryProduk = { id: dataItem.objectkategoryprodukfk, kategoryproduk: dataItem.kategoryproduk }
				// }


				$scope.popUp.center().open();

			}

			$scope.tutup = function () {
				$scope.popUp.close();

			}

		}
	]);
});

