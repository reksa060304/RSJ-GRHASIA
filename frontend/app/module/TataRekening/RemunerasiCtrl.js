define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RemunerasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, medifirstService, $timeout) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.jumlahRows = 50;
            $scope.dataRemun = [];

			//loadCombo();

			// var init = function () {
			// 	var chace = cacheHelper.get('MasterProdukCtrl');
			// 	if (chace != undefined) {
			// 		var arrPeriode = chace.split('~');
					
			// 		if (arrPeriode[1] != 'undefined') {
			// 			$scope.item.Status = arrPeriode[1];
			// 		}
			// 		if (arrPeriode[0] != 'undefined') {
			// 			$scope.item.jenisProdukDetail = arrPeriode[0];
			// 		}

			// 		$scope.item.Status = {id:true,status:'True'}
			// 		$scope.item.jenisProdukDetail = [
			// 			{ "id": 474, "nama": "Obat", "no" : 1 },
			// 			{ "id": 1365, "nama": "Analgesic", "no" : 3 }, 
			// 			{ "id": 1847, "nama": "Psikotropika", "no" : 4 }, 
			// 			{ "id": 1598, "nama": "NARKOTIKA", "no" : 5 }, 
			// 			{ "id": 1597, "nama": "OBAT KERAS", "no" : 6 }, 
			// 			{ "id": 522, "nama": "HEMATOLOGI", "no" : 7 },
			// 			{ "id": 1444, "nama": "Antibiotika", "no" : 8 },
			// 			{ "id": 167, "nama": "Antelmintik", "no" : 9 },
			// 			{ "id": 1450, "nama": "Anti Hipertensi", "no" : 10 },
			// 			{ "id": 1318, "nama": "Barang Umum", "no" : 11 },
			// 			{ "id": 1479, "nama": "Cetakan", "no" : 12 },
			// 			{ "id": 1556, "nama": "-", "no" : 13 },
			// 			{ "id": 1346, "nama": "Alkes", "no" : 14 }, 
			// 		];
					
					
			// 		loadData()
			// 	} else {
			// 		loadData()
			// 	}
			// 	//loadData()
			// }
			

			//init();
			

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
			
			// function searchProdukFilter(status,jmlRows){
			// 	var strFilter ="";
			// 	if(status === undefined){
			// 		//strFilter = "";
			// 	}else{
			// 		strFilter = strFilter + "&status=" + status.id;
			// 	}
			// 	if(jmlRows === undefined){

			// 	}else{
			// 		strFilter = strFilter + "&jmlRows=" + jmlRows;
			// 	}
			// 	return strFilter;
			// }
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

			// medifirstService.getPart("sysadmin/master/get-data-produk?test=true" + searchProdukFilter($scope.item.Status,$scope.item.jumlahRows), true, true, 20).then(function (data) {
			// 	$scope.listProduk = data;
			// });

			// var timeoutPromise;
			// $scope.$watch('item.jenisProdukDetail', function (newVal, oldVal) {
			// 	$timeout.cancel(timeoutPromise);
			// 	timeoutPromise = $timeout(function () {
			// 		if (newVal != oldVal) {
			// 			loadData("jenisProdukDetail", newVal)
			// 		}
			// 	}, 500)
			// })
					

			// function loadData() {
			// 	var kode, kodeintern, kdBarcode, kdBmn, NamaProduk, idProduk, jmlRows,status;
			// 	if ($scope.item.kdProdukScr === undefined || $scope.item.kdProdukScr == null) {
			// 		kode = "";
			// 	} else {
			// 		kode = $scope.item.kdProdukScr
			// 	}
			// 	if ($scope.item.kdProdukInternScr === undefined || $scope.item.kdProdukInternScr == null) {
			// 		kodeintern = "";
			// 	} else {
			// 		kodeintern = $scope.item.kdProdukInternScr
			// 	}
			// 	if ($scope.item.kdBarcodeScr === undefined  || $scope.item.kdBarcodeScr == null) {
			// 		kdBarcode = "";
			// 	} else {
			// 		kdBarcode = $scope.item.kdBarcodeScr
			// 	}
			// 	if ($scope.item.kodeBmnScr === undefined || $scope.item.kodeBmnScr == null) {
			// 		kdBmn = "";
			// 	} else {
			// 		kdBmn = $scope.item.kodeBmnScr
			// 	}
			// 	if ($scope.item.namaProdukScr === undefined || $scope.item.namaProdukScr == null) {
			// 		NamaProduk = "";
			// 	} else {
			// 		NamaProduk = $scope.item.namaProdukScr
			// 	}
			// 	if($scope.item.produk === undefined || $scope.item.produk == null){
			// 		idProduk = "";

			// 	}else{
			// 		idProduk = '&idProduk=' + $scope.item.produk.id;

			// 	}

			// 	if ($scope.item.jumlahRows === undefined || $scope.item.jumlahRows == null) {
			// 		jmlRows = "";
			// 	} else {
			// 		jmlRows = '&jmlRows=' + $scope.item.jumlahRows;
			// 	}
			// 	var cachestatus = ''
			// 	if ($scope.item.Status === undefined || $scope.item.Status == null) {
			// 		status = "";
			// 	} else {
			// 		status = '&status=' + $scope.item.Status.id;
			// 		cachestatus = {id:$scope.item.Status.id,status:$scope.item.Status.status}
			// 	}

			// 	// var jenisproduk = ''
			// 	// if ($scope.item.jenisProdukDetail != undefined && $scope.item.jenisProdukDetail != null && $scope.item.jenisProdukDetail != '') {
			// 	// 	jenisproduk = $scope.item.jenisProdukDetail;
			// 	// }

			// 	var listJenis = ""
			// 	if ($scope.item.jenisProdukDetail.length != 0) {
			// 		var a = ""
			// 		var b = ""
			// 		for (var i = $scope.item.jenisProdukDetail.length - 1; i >= 0; i--) {

			// 			var c = $scope.item.jenisProdukDetail[i].id
			// 			b = "," + c
			// 			a = a + b
			// 		}
			// 		listJenis = a.slice(1, a.length)
            //     }

			// 	var chacePeriode = {
            //         0: listJenis,
			// 		1: status,
            //     }
            //     cacheHelper.set('MasterProdukCtrl', chacePeriode);


			// 	medifirstService.get('sysadmin/master/get-data-produk?kdProduk=' + kode
			// 		+ '&kdInternal=' + kodeintern
			// 		+ '&kdBarcode=' + kdBarcode
			// 		+ '&kdBmn=' + kdBmn
			// 		//+ '&detailjenisproduk=' + jenisproduk
			// 		+ "&JenisArr=" + listJenis
			// 		+ '&nmProduk=' + NamaProduk + jmlRows + status + idProduk).then(function (e) {
			// 			for (var i = 0; i < e.data.length; i++) {
			// 				e.data[i].no = i + 1
			// 			}
			// 			$scope.dataSource = new kendo.data.DataSource({
			// 				data: e.data,

			// 				schema: {
			// 					model: {
			// 						id: "id",
			// 						fields: {
			// 							kdproduk: { editable: false, type: "number" },
			// 							kdbarcode: { editable: false, type: "number" },
			// 							deskripsiproduk: { editable: false, type: "string" },
			// 							namaproduk: { editable: false, type: "string" }
			// 						}
			// 					},
								
			// 				},
			// 				pageSize: 20,
			// 			});
			// 		})
			// 	var chacePeriode = $scope.item.kdProdukScr + "~" + $scope.item.namaProdukScr + "~" + $scope.item.kdProdukInternScr
			// 		+ "~" + $scope.item.kdBarcodeScr + "~" + $scope.item.kodeBmnScr;
			// 	cacheHelper.set('MasterProdukCtrl', chacePeriode);
			// }

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

			// $scope.edit = function () {
			// 	if ($scope.item.idx == undefined) {
			// 		alert("Pilih 1 Data Untuk di edit!!")
			// 	} else {
			// 		$state.go("InputProduk", { idx: $scope.item.idx })
			// 	}
			// }

			// $scope.tambah = function () {
			// 	$state.go("InputProduk")
			// }				

			$scope.columnProduk = [
				{
					"field": "namalengkap",
					"title": "Nama Pegawai",
                    "width": '150px'			
				},
				{
					"field": "iki",
					"title": "IKI",
                    "width": '150px'
				},
				{
					"field": "iku",
					"title": "IKU",
                    "width": '150px'
				},
				{
					"field": "prosen",
					"title": "Prosen",
                    "width": '150px'
				},
				{
					"field": "grade",
					"title": "Grade",
                    "width": '150px'
				},
				{
					"field": "mk",
					"title": "MK",
                    "width": '150px'
				},
				{
					"field": "point_tt",
					"title": "Point TT",
                    "width": '150px'
				},
                {
					"field": "tglinput",
					"title": "Tanggal Input",
                    "width": '150px'
				},			
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

            $("#upload").kendoUpload({
                localization: {
                    "select": "Import"
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name
                    var strFile = stringFile.split('.')
                    var nmFileArr = strFile[0].split('_')
                    // if (nmFileArr[1] != undefined && nmFileArr[2] != undefined && nmFileArr[3] != undefined) {
                    //     $scope.item.tanggal = new Date(moment(nmFileArr[1]).format('YYYY-MM-DD HH:mm'));
                    //     $scope.item.ruangan = { id: nmFileArr[2], namaruangan: nmFileArr[3] }
                    // } else {
                    //     toastr.info('SO_Tgl_KodeRuangan_NamaRuangan.xls', 'Contoh Nama File');
                    //     toastr.error('Nama File Tidak Sesuai', 'Info');

                    //     return;
                    // }

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
                                    // Here is your object
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    console.log(XL_row_object);
                                    var objSave =
                                    {
                                        data: XL_row_object,
                                        // ruanganfk: $scope.item.ruangan.id
                                    }

                                    console.log(XL_row_object)

                                    medifirstService.post('tatarekening/save-poin-remun', objSave).then(function (data) {
                                        $scope.isEdit = true;
                                        // data.data.detail.forEach(function(x){
                                        //     x.stokReal = x.qtyProduk;
                                        // })
                                        $scope.btnTombol = data.data.save_cmd
                                        $scope.dataSource = new kendo.data.DataSource({
                                            data: data.data.detail,
                                            schema: {
                                                model: {
                                                    fields: {
                                                        
                                                    }
                                                }
                                            },
                                            // pageSize: 20,
                                            change: function (e) {
                                                console.log("change :" + e.action);
                                                if (e.field && e.action === "itemchange") {
                                                    //debugger;
                                                    //$scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                                    // if ($scope.current.selisih<0)
                                                    //     $scope.current.selisih = $scope.current.selisih*=-1;
                                                    $scope.dataRemun.fetch();
                                                }
                                            }

                                            
                                        });
                                        console.log($scope.dataRemun)
                                    })
                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            })
		}
	]);
});
