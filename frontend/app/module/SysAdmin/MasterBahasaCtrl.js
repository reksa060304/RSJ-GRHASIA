define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterBahasaCtrl', ['$scope', '$state', 'ModelItem', '$http', 'CacheHelper', '$mdDialog', 'MedifirstService',
		function ($scope, $state, modelItem, $http, cacheHelper, $mdDialog, medifirstService) {
			$scope.item = {};
			$scope.popUp = {};
            $scope.isRouteLoading = false;
			LoadData();

			$scope.TambahBahasa = function() {
				$scope.id = undefined
				$scope.popUps.center().open()

			};

			$scope.tutupBahasa = function() {
				$scope.popUps.close()
			};

			$scope.SimpanBahasa = function() {
				var id = '';	
				if($scope.id != undefined){
					id = $scope.id
				}
				if($scope.popUp.bahasa == undefined){
					toastr.error('Nama bahasa wajib diisi')
					return
				}	
				var data = {
					id: id,
					bahasa: $scope.popUp.bahasa
				}
				var data2 = {

				}
				var objSave = {
					data: data,
					detailBahasa: data2
				}
				medifirstService.post('sysadmin/master/save-bahasa', objSave).then(function(){
					LoadData()
				})

			};

			$scope.cariMasterBahasa = function() {
				LoadData()
            }

			function LoadData() {
                $scope.isRouteLoading = true;
                // medifirstService.get("sysadmin/master/get-data-master-bahasa?id=" + dataItem.id).then(function (e) {

				// })
				//console.log('ppppp');
                var bahasa = ""
                if ($scope.item.namaBahasa != undefined) {
                    bahasa = "&bahasa=" + $scope.item.namaBahasa
                }
                // medifirstService.get("sysadmin/master/get-data-master-bahasa?bahasa=" + $scope.item.namaBahasa).then(function(dataBahasa){
				medifirstService.get("sysadmin/master/get-data-master-bahasa?"
                    + bahasa).then(function (dataBahasa) {
					$scope.isRouteLoading = false;
					var datas = dataBahasa.data.bahasa

					$scope.dataSourceBahasa = new kendo.data.DataSource({
						data: datas,

						// schema: {
						// 	model: {
						// 		id: "id",
						// 		fields: {
						// 			kdproduk: { editable: false, type: "number" },
						// 			kdbarcode: { editable: false, type: "number" },
						// 			deskripsiproduk: { editable: false, type: "string" },
						// 			namaproduk: { editable: false, type: "string" }
						// 		}
						// 	},
							
						// },
						// pageSize: 20,
					});
				})
				
			}

			$scope.columnBahasa = [
				{
					"field": "id",
					"title": "<h3 align=center>ID<h3>",
					"width": "48px",
					// "filterable": false,
					// attributes: {
					// 	"class": "table-cell",
					// 	style: "text-align: center;"
					// }                        					
				},
				{
					"field": "bahasa",
					"title": "<h3 align=center>Nama Bahasa<h3>",
					"width": "60px",
					// "filterable": false,
					// attributes: {
					// 	"class": "table-cell",
					// 	// style: "text-align: center;"
					// }   
				},
				{
					"field": "statusenabled",
					"title": "<h3 align=center>Status Enabled<h3>",
					"width": "45px",
					// "filterable": false,
					// attributes: {
					// 	"class": "table-cell",
					// 	// style: "text-align: center;"
					// }					
				},
				{
					"command":
					[
						{
							text: "Edit",
							click: editMaster,
							imageClass: "k-icon k-edit",
							className: "btn-edit"

						},
						{
							text: "Hapus",
							click: hapusMaster,
							imageClass: "k-icon k-delete",
							className: "btn-disabled"

						}
					],
					title: "",
					width: "180px",
				},
			];

            $scope.Clear = function () {
                delete $scope.id
                delete $scope.popUp.bahasa
            }

			function editMaster(e){
                $scope.Clear();
				e.preventDefault();
				// var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				// var dataItem = this.dataItem("tr");
                medifirstService.get("sysadmin/master/get-data-master-bahasa?id=" + dataItem.id).then(function (e) {

				})
			   $scope.id = dataItem.id
				$scope.popUp.bahasa = dataItem.bahasa
				$scope.popUps.center().open()
			}

			function hapusMaster(e){
					e.preventDefault();
					var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
					if (!dataItem) {
						toastr.error("Data Tidak Ditemukan");
						return;
					}
					var itemDelete = {
						"id": dataItem.id
					}
	
					var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
					medifirstService.post('sysadmin/master/delete-master-bahasa', itemDelete).then(function (e) {
						if (e.status === 201) {
							LoadData();
							grid.removeRow(row);
						}
					})
				})
			}
	
			$scope.gridOptionBahasa = {
				pageable: true,
				columns: $scope.columnBahasa,
				editable: "popup",
				selectable: "row",
				scrollable: false,
				filterable: false,
				// filterMenuInit: function (e){
				// var grid = e.sender;
				// e.container.data("kendoPopup").bind("open", function() {

				// 	$scope.dataSource.sort({field: e.field, dir: "asc"});


				// 	var filter = e.sender.dataSource.filter();

				// 	var query = new kendo.data.Query(grid.dataSource.data());
				// 	var data = query.filter(filter).data;

				// 	var uniqueDsResult = removeDuplicates(data, e.field);


				// 	$scope.dataSource.data(uniqueDsResult);


				// })
				// },
				toolbar: [
                    "excel",
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="TambahBahasa()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},
					{
						name: "print", text: "Print",
						template: '<button ng-click="PrintBahasa()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-print"></span>Print</button>'
					},

                ],
                excel: {
                    fileName: "MasterBahasa.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    //sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Master Bahasa";

                    // var myHeaders = [{
                    //     value: "Master Produk",
                    //     fontSize: 20,
                    //     textAlign: "center",
                    //     background: "#ffffff",
                    //     // color:"#ffffff"
                    // }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                }				
			};

						
		}

			////////////////////////////////////////////////////////////////////	END		/////////////////////////////////////////////////////////////////////////
		
	]);
});
