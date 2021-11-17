define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SlottingKioskCtrl', ['$scope', 'MedifirstService','$timeout',
		function ($scope, medifirstService,$timeout) {
			$scope.item = {};
			$scope.popUp = {
				hari :[]
			}
			$scope.isRouteLoading = false;
			FormLoad()
			loadData();
			loadData2()
			$scope.selectOptionsHari = {
                placeholder: "Pilih Hari...",
                dataTextField: "namahari",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,                       
            }; 
			function FormLoad(){
				medifirstService.get("sysadmin/master/get-combo-kios").then(function (dat) {
					$scope.listRuangan = dat.data.ruanganrajal
					$scope.listJenis = dat.data.jenis
					$scope.listHari = dat.data.hari;
				})
			}

			$scope.Search = function () {
				loadData()
			}
			$scope.Search2 = function () {
				loadData2()
			}

			$scope.Clear = function () {
				$scope.item = {}
				$scope.popUp = {
					hari:[]
				}			
				loadData()				
			}		
			$scope.Clear2 = function () {
				$scope.item = {}
				$scope.popUp = {}			
				loadData2()				
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

				medifirstService.get("kiosk/get-slotting-kiosk?"
					+ ruang
					+ quota
					+ id
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: data.data.data,
						group:{
			                field: "namaruangan",
			            },
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}
			function loadData2() {
				$scope.isRouteLoading = true;
				
				var jenis = ""
				if ($scope.item.jenis != undefined) {
					jenis = "&jenis=" + $scope.item.jenis
				}
				var deskripsi = ""
				if ($scope.item.deskripsi != undefined) {
					deskripsi = "&deskripsi=" + $scope.item.deskripsi
				}

				medifirstService.get("sysadmin/master/get-setting-kios?"
					+ jenis
					+ deskripsi
				
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.data.length; i++) {
						data.data.data[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource2 = new kendo.data.DataSource({
						data: data.data.data,
						
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}

			$scope.columnGrid = {
				selectable: 'row',
				pageable: true,
				groupable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "60%"
				},
				{
					"field": "hari",
					"title": "Hari",
					"width": "30%"
				}, {
					"field": "jambuka",
					"title": "Jam Buka",
					"width": "20%"
				}, {

					"field": "jamtutup",
					"title": "Jam Tutup",
					"width": "20%"
				},
				{

					"field": "quota",
					"title": "Kuota",
					"width": "10%"
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
					width: "15%",
				}

				]
			};
			$scope.columnGrid2 = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="Tambah2()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "jenis",
					"title": "Jenis",
					"width": "30%"
				}, 
				// {
				// 	"field": "deskripsi",
				// 	"title": "Deskripsi",
				// 	"width": "50%"
				// },
				{
					"command": [{
						text: "Edit",
						click: editData2,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData2,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "15%",
				}

				]
			};

			$scope.Tambah = function () {
				$scope.popUp = {hari : []}
				$scope.popUps.center().open();
			}
			$scope.Tambah2 = function () {
				delete $scope.popUp.deskripsi
				delete $scope.popUp.deskripsi
				$scope.popUps2.center().open();
			}
			$scope.save = function () {
				var id = ""
				if ($scope.popUp.id != undefined)
					id = $scope.popUp.id


				if ($scope.popUp.ruangan == undefined) {
					toastr.error('Ruangan harus di isi')
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
				if($scope.popUp.hari != undefined && $scope.popUp.hari.length != 0){
					var a = ""
                    var b = ""
                    for (var i = 0; i < $scope.popUp.hari.length; i++){
                    	if (i == $scope.popUp.hari.length - 1){
                    		listHari += $scope.popUp.hari[i].namahari
                    	} else {
                    		listHari += $scope.popUp.hari[i].namahari + ", "
                    	}
                    }
				}


				var objSave = {
					"id": id,
					"objectruanganfk": $scope.popUp.ruangan.id,
					"jambuka": moment($scope.popUp.jamBuka).format('HH:mm') ,
					"jamtutup": moment($scope.popUp.jamTutup).format('HH:mm') ,
					"quota": $scope.popUp.quota ,
					"hari": listHari!=''&& listHari!=undefined?listHari:null ,

				}
				medifirstService.post('kiosk/save-slotting-kiosk',objSave).then(function (e) {
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

				medifirstService.post( 'kiosk/delete-slotting-kiosk',itemDelete).then(function (e) {
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
				medifirstService.get("kiosk/get-slotting-kiosk?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUp.id = dataItem.id
				$scope.nows= new Date()

				$scope.popUp.ruangan = {id:dataItem.idruangan,namaruangan: dataItem.namaruangan}
				if(dataItem.jambuka)
				$scope.popUp.jamBuka = new Date( moment(	$scope.nows).format('YYYY-MM-DD') +' '+ dataItem.jambuka)
				if(dataItem.jamtutup)
				$scope.popUp.jamTutup = new Date(  moment(	$scope.nows).format('YYYY-MM-DD') +' '+dataItem.jamtutup)
				$scope.popUp.quota =parseInt( dataItem.quota)

				if (dataItem.hari) {
						$scope.popUp.hari =[]
						let split =dataItem.hari.split(',')
						if(split.length>0){
							for (var i = 0; i < split.length; i++) {
								const elem =	split[i]
								for (var z = 0; z < $scope.listHari.length; z++) {
									const elem2 = $scope.listHari[z]
									if(elem.indexOf( elem2.namahari)> -1){
										$scope.popUp.hari.push(elem2)
										break
									}
								}
							}
						}
					}
				$scope.popUps.center().open();

			}
			function hapusData2(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var itemDelete = {
					"norec": dataItem.norec
				}

				medifirstService.post( 'sysadmin/kiosk/delete-setting-kios',itemDelete).then(function (e) {
					if (e.status === 201) {
						loadData2();
						grid.removeRow(row);
					}
				})

			}
			function editData2(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				medifirstService.get("kiosk/get-slotting-kiosk?id=" + dataItem.id).then(function (e) {

				})
				$scope.popUp.norec = dataItem.norec
				$scope.popUp.jenis = {id:dataItem.informasifk,jenis: dataItem.jenis}
			
				$scope.popUp.deskripsi =dataItem.deskripsi
				$scope.popUps2.center().open();

			}
			$scope.save2 = function(){
				if ($scope.popUp.jenis == undefined) {
					toastr.error('Jenis harus di isi')
					return
				}
				if ($scope.popUp.deskripsi == undefined) {
					toastr.error('Deskripsi harus di isi')
					return
				}
			

				var objSave = {
					"norec": $scope.popUp.norec != undefined?$scope.popUp.norec :'',
					"informasifk": $scope.popUp.jenis.id,
					"deskripsi": $scope.popUp.deskripsi ,

				}
				medifirstService.post('sysadmin/master/save-setting-kiosk',objSave).then(function(e){
					loadData2()
					$scope.Clear2()
				})
			}

			$scope.tutup = function () {
				$scope.popUp = {}
				$scope.popUps.close();
		
			}
			$scope.tutup2 = function () {
				$scope.popUp = {}
				$scope.popUps2.close();
			}
			
			$scope.optionEdit = {
				tools: [
					"bold",
					"italic",
					"underline",
					"strikethrough",
					"justifyLeft",
					"justifyCenter",
					"justifyRight",
					"justifyFull",
					"insertUnorderedList",
					"insertOrderedList",
					"indent",
					"outdent",
					"createLink",
					"unlink",
					"insertImage",
					"insertFile",
					"subscript",
					"superscript",
					"tableWizard",
					"createTable",
					"addRowAbove",
					"addRowBelow",
					"addColumnLeft",
					"addColumnRight",
					"deleteRow",
					"deleteColumn",
					"mergeCellsHorizontally",
					"mergeCellsVertically",
					"splitCellHorizontally",
					"splitCellVertically",
					"viewHtml",
					"formatting",
					"cleanFormatting",
					"copyFormat",
					"applyFormat",
					"foreColor",
					"backColor",
					"print"],
				resizable: {
					content: true,
					toolbar: true
				}

			};
			$scope.onTabChanges = function(idx){
				if(idx==2){
					loadDataSisa()
				}
			}
			function loadDataSisa() {
				$scope.isRouteLoading = true;
			
			
				var ruang = ""
				if ($scope.item.namaRuangan3 != undefined) {
					ruang =  $scope.item.namaRuangan3
				}
				

				medifirstService.get("kiosk/get-ruangan?namaruangan="+ruang
					
				).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.data.length; i++) {
						data.data[i].no = i + 1
					}
					// $scope.listDiagnosaKep = data.data.data
					$scope.dataSource3 = new kendo.data.DataSource({
						data: data.data,
						// group:{
			   //              field: "namaruangan",
			   //          },
						pageSize: 10,
						// total: data.data.data.length,
						serverPaging: true,


					});
				})
			}
			$scope.columnGrid3 = {
				selectable: 'row',
				pageable: true,
				groupable: true,
				
				columns: [{
					"field": "no",
					"title": "No",
					"width": "5%",
					"attributes": { align: "center" }

				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width": "60%"
				},
				
				{

					"field": "quota",
					"title": "Kuota",
					"width": "10%"
				},
				// {
// 
				// 	"field": "tedaftar",
				// 	"title": "Tedaftar",
				// 	"width": "10%"
				// },
				{

					"field": "sisa",
					"title": "Sisa ",
					"width": "10%"
				},
				

				]
			};
			$scope.Search3 = function(){
				loadDataSisa()
			
			}
				var timeoutPromise;
			$scope.$watch('item.namaRuangan3', function (newVal, oldVal) {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(function () {
					if (newVal && newVal !== oldVal) {
						applyFilter("namaruangan", newVal)
					}
				}, 500)
			})
			function applyFilter(filterField, filterValue) {
				var dataGrid = $("#kGrids3").data("kendoGrid");
				var currFilterObject = dataGrid.dataSource.filter();
				var currentFilters = currFilterObject ? currFilterObject.filters : [];

				if (currentFilters && currentFilters.length > 0) {
					for (var i = 0; i < currentFilters.length; i++) {
						if (currentFilters[i].field == filterField) {
							currentFilters.splice(i, 1);
							break;
						}
					}
				}

				if (filterValue.id) {
					currentFilters.push({
						field: filterField,
						operator: "eq",
						value: filterValue.id
					});
				} else {
					currentFilters.push({
						field: filterField,
						operator: "contains",
						value: filterValue
					})
				}

				dataGrid.dataSource.filter({
					logic: "and",
					filters: currentFilters
				})
			}
			$scope.resetFilter = function () {
				var dataGrid = $("#kGrids3").data("kendoGrid");
				dataGrid.dataSource.filter({});
				$scope.item.namaRuangan3 = undefined;
			}

			//ennd evaluaso

		}
	]);
});


