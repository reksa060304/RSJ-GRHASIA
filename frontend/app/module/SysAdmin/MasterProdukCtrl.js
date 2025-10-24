define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterProdukCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, medifirstService, $timeout) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.jumlahRows = 50;
			$scope.item.jenisProdukDetail = [];

			loadCombo();

			var init = function () {
				var chace = cacheHelper.get('MasterProdukCtrl');
				if (chace != undefined) {
					var arrPeriode = chace.split('~');
					
					if (arrPeriode[1] != 'undefined') {
						$scope.item.Status = arrPeriode[1];
					}
					if (arrPeriode[0] != 'undefined') {
						$scope.item.jenisProdukDetail = arrPeriode[0];
					}

					$scope.item.Status = {id:true,status:'True'}
					// $scope.item.jenisProdukDetail = [
					// 	{ "id": 474, "nama": "Obat", "no" : 1 },
					// 	{ "id": 1365, "nama": "Analgesic", "no" : 3 }, 
					// 	{ "id": 1847, "nama": "Psikotropika", "no" : 4 }, 
					// 	{ "id": 1598, "nama": "NARKOTIKA", "no" : 5 }, 
					// 	{ "id": 1597, "nama": "OBAT KERAS", "no" : 6 }, 
					// 	{ "id": 522, "nama": "HEMATOLOGI", "no" : 7 },
					// 	{ "id": 1444, "nama": "Antibiotika", "no" : 8 },
					// 	{ "id": 167, "nama": "Antelmintik", "no" : 9 },
					// 	{ "id": 1450, "nama": "Anti Hipertensi", "no" : 10 },
					// 	{ "id": 1318, "nama": "Barang Umum", "no" : 11 },
					// 	{ "id": 1479, "nama": "Cetakan", "no" : 12 },
					// 	{ "id": 1556, "nama": "-", "no" : 13 },
					// 	{ "id": 1346, "nama": "Alkes", "no" : 14 }, 
					// ];
					
					
					loadData()
				} else {
					loadData()
				}
				//loadData()
			}
			

			init();
			

			$scope.cariFilter = function () {
				
				loadData()
			}

			$scope.selectDetailJenisProduk = {
				placeholder: "Pilih Detail Jenis Produk...",
				dataTextField: "nama",
				dataValueField: "id",
				// dataSource:{
				//     data: $scope.listRuangan
				// },
				autoBind: false,

			};
			
			function searchProdukFilter(status,jmlRows){
				var strFilter ="";
				if(status === undefined){
					//strFilter = "";
				}else{
					strFilter = strFilter + "&status=" + status.id;
				}
				if(jmlRows === undefined){

				}else{
					strFilter = strFilter + "&jmlRows=" + jmlRows;
				}
				return strFilter;
			}
			function loadCombo(){
				$scope.listStatus = [{id:true,status:'True'},{id:false,status:'False'}];
				medifirstService.getPart("sysadmin/master/get-data-produk?test=true" + searchProdukFilter($scope.item.Status,$scope.item.jumlahRows), true, true, 20).then(function (data) {
					$scope.listProduk = data;
				});
				$scope.listJenisProdukDetail = [
							{ "id": 474, "nama": "Obat", "no" : 1 },
							{ "id": 1365, "nama": "Analgesic", "no" : 3 }, 
							{ "id": 1847, "nama": "Psikotropika", "no" : 4 }, 
							{ "id": 1598, "nama": "NARKOTIKA", "no" : 5 }, 
							{ "id": 1597, "nama": "OBAT KERAS", "no" : 6 }, 
							{ "id": 522, "nama": "HEMATOLOGI", "no" : 7 },
							{ "id": 1444, "nama": "Antibiotika", "no" : 8 },
							{ "id": 167, "nama": "Antelmintik", "no" : 9 },
							{ "id": 1450, "nama": "Anti Hipertensi", "no" : 10 },
							{ "id": 1318, "nama": "Barang Umum", "no" : 11 },
							{ "id": 1479, "nama": "Cetakan", "no" : 12 },
							{ "id": 1556, "nama": "-", "no" : 13 },
							{ "id": 1346, "nama": "Alkes", "no" : 14 }, 
				];

			}

			medifirstService.getPart("sysadmin/master/get-data-produk?test=true" + searchProdukFilter($scope.item.Status,$scope.item.jumlahRows), true, true, 20).then(function (data) {
				$scope.listProduk = data;
			});

			// var timeoutPromise;
			// $scope.$watch('item.jenisProdukDetail', function (newVal, oldVal) {
			// 	$timeout.cancel(timeoutPromise);
			// 	timeoutPromise = $timeout(function () {
			// 		if (newVal != oldVal) {
			// 			loadData("jenisProdukDetail", newVal)
			// 		}
			// 	}, 500)
			// })
					

			function loadData() {
				var kode, kodeintern, kdBarcode, kdBmn, NamaProduk, idProduk, jmlRows,status;
				if ($scope.item.kdProdukScr === undefined || $scope.item.kdProdukScr == null) {
					kode = "";
				} else {
					kode = $scope.item.kdProdukScr
				}
				if ($scope.item.kdProdukInternScr === undefined || $scope.item.kdProdukInternScr == null) {
					kodeintern = "";
				} else {
					kodeintern = $scope.item.kdProdukInternScr
				}
				if ($scope.item.kdBarcodeScr === undefined  || $scope.item.kdBarcodeScr == null) {
					kdBarcode = "";
				} else {
					kdBarcode = $scope.item.kdBarcodeScr
				}
				if ($scope.item.kodeBmnScr === undefined || $scope.item.kodeBmnScr == null) {
					kdBmn = "";
				} else {
					kdBmn = $scope.item.kodeBmnScr
				}
				if ($scope.item.namaProdukScr === undefined || $scope.item.namaProdukScr == null) {
					NamaProduk = "";
				} else {
					NamaProduk = $scope.item.namaProdukScr
				}
				if($scope.item.produk === undefined || $scope.item.produk == null){
					idProduk = "";

				}else{
					idProduk = '&idProduk=' + $scope.item.produk.id;

				}

				if ($scope.item.jumlahRows === undefined || $scope.item.jumlahRows == null) {
					jmlRows = "";
				} else {
					jmlRows = '&jmlRows=' + $scope.item.jumlahRows;
				}
				var cachestatus = ''
				if ($scope.item.Status === undefined || $scope.item.Status == null) {
					status = "";
				} else {
					status = '&status=' + $scope.item.Status.id;
					cachestatus = {id:$scope.item.Status.id,status:$scope.item.Status.status}
				}

				// var jenisproduk = ''
				// if ($scope.item.jenisProdukDetail != undefined && $scope.item.jenisProdukDetail != null && $scope.item.jenisProdukDetail != '') {
				// 	jenisproduk = $scope.item.jenisProdukDetail;
				// }

				var listJenis = ""
				if ($scope.item.jenisProdukDetail.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.jenisProdukDetail.length - 1; i >= 0; i--) {

						var c = $scope.item.jenisProdukDetail[i].id
						b = "," + c
						a = a + b
					}
					listJenis = a.slice(1, a.length)
                }

				var chacePeriode = {
                    0: listJenis,
					1: status,
                }
                cacheHelper.set('MasterProdukCtrl', chacePeriode);


				medifirstService.get('sysadmin/master/get-data-produk?kdProduk=' + kode
					+ '&kdInternal=' + kodeintern
					+ '&kdBarcode=' + kdBarcode
					+ '&kdBmn=' + kdBmn
					//+ '&detailjenisproduk=' + jenisproduk
					+ "&JenisArr=" + listJenis
					+ '&nmProduk=' + NamaProduk + jmlRows + status + idProduk).then(function (e) {
						for (var i = 0; i < e.data.length; i++) {
							e.data[i].no = i + 1
						}
						$scope.dataSource = new kendo.data.DataSource({
							data: e.data,

							schema: {
								model: {
									id: "id",
									fields: {
										kdproduk: { editable: false, type: "number" },
										kdbarcode: { editable: false, type: "number" },
										deskripsiproduk: { editable: false, type: "string" },
										namaproduk: { editable: false, type: "string" }
									}
								},
								
							},
							pageSize: 20,
						});
					})
				var chacePeriode = $scope.item.kdProdukScr + "~" + $scope.item.namaProdukScr + "~" + $scope.item.kdProdukInternScr
					+ "~" + $scope.item.kdBarcodeScr + "~" + $scope.item.kodeBmnScr;
				cacheHelper.set('MasterProdukCtrl', chacePeriode);
			}

			$scope.klik = function (current) {
				current = $scope.current;
				$scope.item.idx = current.id;
			}

			function disableData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": 0//'f'
				}
				medifirstService.post('sysadmin/master/save-statusenabled-produk', objSave).then(function (e) {
					init();
				})
			};

			function enableData(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": 1//'t'
				}
				medifirstService.post('sysadmin/master/save-statusenabled-produk', objSave).then(function (e) {
					init();
				})
			};
			function disableRetriksi(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": 0//'f'
				}
				medifirstService.post('sysadmin/master/save-status-retriksi-produk', objSave).then(function (e) {
					init();
				})
			};

			function enableRetriksi(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var objSave = {
					"id": dataItem.id,
					"status": 1//'t'
				}
				medifirstService.post('sysadmin/master/save-status-retriksi-produk', objSave).then(function (e) {
					init();
				})
			};

			// function removeDuplicates(items, field) {
			// 	if(field.indexOf(".") > 0){
			// 	  field = field.substring(0, field.indexOf("."));
			// 	}
			// 	var getter = function(item){return item[field]},
			// 		result = [],
			// 		index = 0,
			// 		seen = {};
	
			// 	while (index < items.length) {
			// 	  var item = items[index++],
			// 		  text = getter(item);
			// 	  if(field === "detailjenisproduk"){
			// 		text = text.detailjenisproduk;
			// 	  }
	
			// 	  if(text !== undefined && text !== null && !seen.hasOwnProperty(text)){
			// 		result.push(item);
			// 		seen[text] = true;
			// 	  }
			// 	}
	
			// 	return result;
			//   }

			$scope.edit = function () {
				if ($scope.item.idx == undefined) {
					alert("Pilih 1 Data Untuk di edit!!")
				} else {
					$state.go("InputProduk", { idx: $scope.item.idx })
				}
			}

			$scope.tambah = function () {
				$state.go("InputProduk")
			}				

			$scope.columnProduk = [
				{
					"field": "no",
					"title": "<h3 align=center>No.<h3>",
					"width": "48px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						style: "text-align: center;"
					}                        					
				},
				{
					"field": "id",
					"title": "<h3 align=center>Id Produk<h3>",
					"width": "60px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}   
				},
				{
					"field": "statusenabled",
					"title": "<h3 align=center>Status Enabled<h3>",
					"width": "45px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}					
				},
				{
					"field": "namaproduk",
					"title": "<h3 align=center>Nama Produk<h3>",
					"width": "300px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}					
				},
				{
					"field": "kdproduk",
					"title": "<h3 align=center>Kd Produk<h3>",
					"width": "100px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}					
				},
				{
					"field": "kdbarcode",
					"title": "<h3 align=center>kd Barcode<h3>",
					"width": "100px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					}				
				},
				{
					"field": "detailjenisproduk",
					"title": "<h3 align=center>Detail Jenis<h3>",
					"width": "150px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					},
					filterable: { multi: true, search: true, required: true, dataSource: $scope.dataSource },					
				},
				{
					"field": "status_retriksi",
					"title": "<h3 align=center>Status Retriksi<h3>",
					"width": "150px",
					"filterable": false,
					attributes: {
						"class": "table-cell",
						// style: "text-align: center;"
					},
					filterable: { multi: true, search: true, required: true, dataSource: $scope.dataSource },					
				},			
				{
					"command": [
						{ text: "Enable", click: enableData, imageClass: "k-icon k-i-pencil", className: "btn-enabled", },
						{ text: "Disable", click: disableData, imageClass: "k-icon k-delete", className: "btn-disabled", },
						{ text: "Enable Retriksi", click: enableRetriksi, imageClass: "k-icon k-i-pencil", className: "btn-enabled", },
						{ text: "Disable Retriksi", click: disableRetriksi, imageClass: "k-icon k-delete", className: "btn-disabled", },
					],
					title: "<h3 align=center>Command<h3>",
					width: "280px",
				}				
			];
			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columnProduk,
				editable: "popup",
				selectable: "row",
				scrollable: false,
				filterable: true,
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

                ],
                excel: {
                    fileName: "MasterProduk.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    //sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Master Produk";

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
			$scope.KelBPJS = function () {
				$state.go('KelompokProdukBPJS')
			}
		}
	]);
});
