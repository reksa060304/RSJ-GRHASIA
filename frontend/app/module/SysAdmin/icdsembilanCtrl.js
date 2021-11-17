define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('icdsembilanCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
		function ($rootScope, $scope, medifirstService, $window, $timeout) {
			$scope.item = {};
			$scope.popUp = {};
			$scope.isRouteLoading = false;

			// loadCombo();
			loadData();
			$scope.Search = function () {
				loadData()
			}
			$scope.Clear = function () {
				delete $scope.item.id
				delete $scope.item.kddiagnosa
				delete $scope.item.namadiagnosa
				delete $scope.popUp.id
				delete $scope.popUp.kodeJenisDiet
				delete $scope.popUp.jenisDiet
				delete $scope.popUp.kelompokProduk
				delete $scope.popUp.Keterangan


			}


			// function loadCombo() {
			// 	medifirstService.get("sysadmin/master/get-kelompok-produk"
			// 	).then(function (e) {
			// 		$scope.listKelompokProduk = e.data
			// 	})

			// }
			
			function loadData() {
				$scope.isRouteLoading = true;
				
				var kddiagnosa = ""
				if ($scope.item.kddiagnosa != undefined) {
					kddiagnosa = "&kddiagnosa=" + $scope.item.kddiagnosa
				}
				var namadiagnosa = ""
				if ($scope.item.namadiagnosa != undefined) {
					namadiagnosa = "&namadiagnosa=" + $scope.item.namadiagnosa
				}
				
				medifirstService.get("sysadmin/master/get-daftar-icdsembilan?"
					+ kddiagnosa
					+ namadiagnosa
					).then(function (data) {
						$scope.isRouteLoading = false;
						for (var i = 0; i < data.data.data.length; i++) {
							data.data.data[i].no = i + 1
						}
						$scope.dataSource = new kendo.data.DataSource({
							data: data.data.data,
							pageSize: 10,
							// total: data.data.data.length,
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
				}, {
					"field": "kddiagnosatindakan",
					"title": "<h3 align=center>Kode Diagnosa</h3>",
					"width": "80px"
				}, {
					"field": "namadiagnosatindakan",
					"title": "<h3 align=center>Nama Diagnosa</h3>",
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
				$scope.popUp.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id

				var kddiagnosa = ""
				if ($scope.popUp.kddiagnosa != undefined)
					kddiagnosa = $scope.popUp.kddiagnosa

				var namadiagnosa = ""
				if ($scope.popUp.namadiagnosa != undefined)
					namadiagnosa = $scope.popUp.namadiagnosa


				var objSave = {
					"id": id,
					"kddiagnosa": kddiagnosa,
					"namadiagnosa": namadiagnosa,
				}
				medifirstService.post("sysadmin/master/save-saveIcdSembilan", objSave).then(function (res) {
					loadData();
					$scope.Clear();
				})

			}

			// $scope.klikGrid= function(dataSelected){
			// 	// $scope.popUp.id =dataSelected.id
			// 	// $scope.popUp.kdJenisDiet =dataSelected.kdjenisdiet
			// 	// $scope.popUp.jenisDiet= dataSelected.jenisidiet
			// 	// $scope.popUp.kelompokProduk={id:dataSelected.objectkelompokprodukfk,kelompokproduk:dataSelected.kelompokproduk}
			// 	// $scope.popUp.Keterangan= dataSelected.keterangan


			// }




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

				medifirstService.post('sysadmin/master/delete-diagnosa-sembilan', itemDelete).then(function (e) {
					if (e.status === 201) {
						loadData();
						grid.removeRow(row);
					}
				})

			}
			function editData(e) {
				$scope.Clear();
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				medifirstService.get("sysadmin/master/get-daftar-icdsembilan?id=" + dataItem.id).then(function (e) {

				})

				$scope.popUp.id = dataItem.id
				$scope.popUp.kddiagnosa = dataItem.kddiagnosatindakan
				$scope.popUp.namadiagnosa = dataItem.namadiagnosatindakan
				$scope.popUp.center().open();

			}

			$scope.tutup = function () {
				$scope.popUp.close();

			}

		}
	]);
});

