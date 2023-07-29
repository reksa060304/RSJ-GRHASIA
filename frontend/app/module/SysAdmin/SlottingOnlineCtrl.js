define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SlottingOnlineCtrl', ['$scope', 'MedifirstService',
		function ($scope, medifirstService) {
			$scope.item = {};
			$scope.popUp = {}
			$scope.popUp.HariAwal = [];
			$scope.selectOptionsHari = {
                placeholder: "Pilih Hari...",
                dataTextField: "namahari",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,                       
            }; 
			$scope.isRouteLoading = false;
			FormLoad()
			loadData();
			
			function FormLoad() {
				medifirstService.get("reservasionline/get-combo-reservasi").then(function (dat) {
					$scope.listRuangan = dat.data.ruanganrajal
					$scope.listHari = dat.data.hari
					$scope.listDokter = dat.data.dokter
				})
			}

			$scope.Search = function () {
				loadData()
			}

			$scope.Clear = function () {
				// $scope.item = {
			
				// }
				$scope.popUp = {
					HariAwal : []
				}
				loadData()
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var id = ""
				if ($scope.item.id != undefined) {
					id = "id=" + $scope.item.id
				}
				var ruang = ""
				if ($scope.item.namaRuangan != undefined) {
					ruang = "&namaRuangan=" + $scope.item.namaRuangan
				}
				var quota = ""
				if ($scope.item.quota != undefined) {
					quota = "&quota=" + $scope.item.quota
				}
				var dokter = ""
				if ($scope.item.Qdokter != undefined) {
					dokter = "&dokter=" + $scope.item.Qdokter
				}

				medifirstService.get("reservasionline/get-daftar-slotting?"
					+ ruang
					+ quota
					+ id
					+ dokter
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: data.data.data,
						pageSize: 10,
						group: [
							{ field: "namaruangan" }
						],
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}

			$scope.columnGrid = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns: [
					// 	{
					// 	"field": "no",
					// 	"title": "No",
					// 	"width": "5%",
					// 	"attributes": { align: "center" }

					// },
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"width": "220px",
						"hidden": true
					}, {
						"field": "namalengkap",
						"title": "Dokter",
						"width": "220px"
					}, {
						"field": "hari",
						"title": "Hari",
						"width": "220px"
					}, {
						"field": "jambuka",
						"title": "Jam Buka",
						"width": "100px"
					}, {

						"field": "jamtutup",
						"title": "Jam Tutup",
						"width": "100px"
					},
					{

						"field": "quota",
						"title": "Kuota",
						"width": "100px"
					},
					{
						"command": [{
							text: "Edit",
							click: editData,
							imageClass: "k-icon k-i-pencil"
						},
						{
							text: "Hapus",
							click: hapusData,
							imageClass: "k-icon k-delete"
						}],
						title: "",
						width: "120px",
					}

				]
			};

			$scope.Tambah = function () {
				$scope.popUps.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id


				if ($scope.popUp.ruangan == undefined) {
					toastr.error('Ruangan harus di isi')
					return
				}
				if ($scope.popUp.dokterInput == undefined) {
					toastr.error('Dokter harus di isi')
					return
				}
				if ($scope.popUp.quota == undefined) {
					toastr.error('Quota harus di isi')
					return
				}
				if ($scope.popUp.jamBuka == undefined) {
					toastr.error('Jam Buka harus di isi')
					return
				}
				if ($scope.popUp.jamTutup == undefined) {
					toastr.error('Jam Tutup harus di isi')
					return
				}
				var listHari = '';
				if($scope.popUp.HariAwal.length != 0){
					var a = ""
                    var b = ""
                    for (var i = 0; i < $scope.popUp.HariAwal.length; i++){
                    	if (i == $scope.popUp.HariAwal.length - 1){
                    		listHari += $scope.popUp.HariAwal[i].namahari
                    	} else {
                    		listHari += $scope.popUp.HariAwal[i].namahari + ", "
                    	}
                    }
				}


				var objSave = {
					"id": id,
					"objectruanganfk": $scope.popUp.ruangan.id,
					"jambuka": moment($scope.popUp.jamBuka).format('HH:mm'),
					"jamtutup": moment($scope.popUp.jamTutup).format('HH:mm'),
					"quota": $scope.popUp.quota,
					"hari": listHari != undefined ? listHari : null,
					"objectpegawaifk": $scope.popUp.dokterInput.id,
					"tanggalcutiawal": $scope.popUp.CutiBuka != undefined ? $scope.popUp.CutiBuka : null,
					"tanggalcutiakhir": $scope.popUp.CutiTutup != undefined ? $scope.popUp.CutiTutup : null,
				}
				$scope.isSave = true
				medifirstService.post('reservasionline/save-slotting', objSave).then(function (e) {
					$scope.isSave = false
					loadData();
					$scope.Clear();
				},function(error){
					$scope.isSave = false
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

				medifirstService.post('reservasionline/delete-slotting', itemDelete).then(function (e) {
					if (e.status === 201) {
						loadData();
						grid.removeRow(row);
					}
				})

			}
			function editData(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				// medifirstService.post("reservasionline/get-daftar-slotting?id=" + dataItem.id).then(function (e) {

				// })
				$scope.popUp.id = dataItem.id
				$scope.nows = new Date()
				if (dataItem.hari) {
					$scope.popUp.HariAwal = []
					let split = dataItem.hari.split(',')
					if (split.length > 0) {
						for (var i = 0; i < split.length; i++) {
							const elem = split[i]
							for (var z = 0; z < $scope.listHari.length; z++) {
								const elem2 = $scope.listHari[z]
								if (elem.indexOf(elem2.namahari) > -1) {
									$scope.popUp.HariAwal.push(elem2)
									break
								}
							}
						}
					}
				}
				$scope.popUp.ruangan = { id: dataItem.idruangan, namaruangan: dataItem.namaruangan }
				$scope.popUp.dokterInput = { id: dataItem.objectpegawaifk, namalengkap: dataItem.namalengkap };
				if (dataItem.jambuka != undefined) {
					$scope.popUp.jamBuka = new Date(moment(new Date()).format('YYYY-MM-DD '+dataItem.jambuka));
				}
				if (dataItem.jamtutup != undefined) {
					$scope.popUp.jamTutup = new Date(moment(new Date()).format('YYYY-MM-DD '+ dataItem.jamtutup));
				}
				if (dataItem.tanggalcutiawal != undefined) {
					$scope.popUp.CutiBuka = new Date(dataItem.tanggalcutiawal);
				}
				if (dataItem.tanggalcutiakhir != undefined) {
					$scope.popUp.CutiTutup = new Date(dataItem.tanggalcutiakhir);
				}
				$scope.popUp.quota = dataItem.quota? parseInt(dataItem.quota):0
				$scope.popUps.center().open();

			}

			$scope.tutup = function () {
				$scope.popUps.close();

			}
			// intervensi


			//ennd evaluaso

		}
	]);
});

