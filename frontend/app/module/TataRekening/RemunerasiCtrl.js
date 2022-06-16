define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RemunerasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, medifirstService, $timeout) {
			$scope.item = {};
			$scope.iteminput = {};
			$scope.now = new Date();
			$scope.item.tglmasuk = moment($scope.now).format('YYYY-MM-DD');
			$scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD');
			// var tgl = dateHelper.getDaysofMonth()
			// console.log(tgl);
			 $scope.monthUngkul = {
			 	start: "year",
			 	depth: "year"
			 }
			 $scope.yearUngkul = {
			 	start: "decade",
			 	depth: "decade"
			 }
			$scope.item.jumlahRows = 50;
            $scope.dataRemun = [];
			var norec = "";
				loadData()

			$scope.SearchData = function () {
				loadData()
			}
			function loadData(){
				var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
				console.log(bulan);
				console.log(tahun);
				medifirstService.get('remunerasi/get-daftar-remunerasi-pegawaiv2?bulan='+ bulan + "&tahun="+ tahun).then(function (e) {
					console.log(e.data.data);
					$scope.dataSource = new kendo.data.DataSource({
						data: e.data.data,
						pageSize: 10,
						total: e.data.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								
								}
							}
						}
					});
				})
			}
			$scope.ubahDataIndex = function () {
			console.log($scope.current.namalengkap);
				if ($scope.current == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.item.iki = $scope.current.iki;
				$scope.item.iku = $scope.current.iku;
				$scope.item.prosen = $scope.current.prosen;
				$scope.item.grade = $scope.current.grade;
				$scope.item.mk = $scope.current.mk;
				$scope.item.point_tt = $scope.current.point_tt;

				$scope.item.pegawai = {
					idpegawai: $scope.current.idpegawai,
					namalengkap: $scope.current.namalengkap
				}
				$scope.popupDetailIndex.center().open();
				
			}

			$scope.inputDataIndex = function () {
				console.log($scope.current.namalengkap);
				if ($scope.current == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				
				$scope.iteminput.pegawai = {
					idpegawai: $scope.current.idpegawai,
					namalengkap: $scope.current.namalengkap
				}
				$scope.popupInputDetailIndex.center().open();

			}
			$scope.batal = function () {
				$scope.current = undefined
				$scope.popupDetailIndex.close();
				$scope.item = {}
			}
			$scope.batalinput = function () {
				$scope.current = undefined
				$scope.popupInputDetailIndex.close();
				$scope.iteminput = {}
			}

			$scope.save = function () {
				let json = {
					'norec': norec,
					'idpegawai': $scope.item.pegawai.idpegawai,
					'tglmasuk': $scope.item.tglmasuk != undefined ? moment($scope.item.tglmasuk).format('YYYY-MM-DD') : null,
					'iki': $scope.item.iki != undefined ? $scope.item.iki : null,
					'iku': $scope.item.iku != undefined ? $scope.item.iku : null,
					'prosen': $scope.item.prosen != undefined ? $scope.item.prosen : null,
					'grade': $scope.item.grade != undefined ? $scope.item.grade : null,
					'mk': $scope.item.mk != undefined ? $scope.item.mk : null,
					'point_tt': $scope.item.point_tt != undefined ? $scope.item.point_tt : null,
				}
				console.log(json);
				medifirstService.post('remunerasi/save-index-pegawaiv2', json).then(function (e) {
					// medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
					// 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
					// 	$scope.itm.pegawai.namalengkap).then(function (res) {})
					loadData()
					$scope.batal()

				})

			}
			$scope.postingGrade = function () {
				medifirstService.get('get/save-posting-grade').then(function (e) {
					loadData()
					$scope.batal()

				})

			}
			$scope.postingMK = function () {
				let json = {
					'bulan' : moment($scope.item.bulan).format('M'),
				}
				console.log(json);
				medifirstService.post('get/save-posting-mk', json).then(function (e) {
					loadData()
				})

			}
			$scope.saveInput = function () {
				let json = {
					'norec': "",
					'idpegawai': $scope.iteminput.pegawai.idpegawai,
					'tglmasuk': $scope.iteminput.tglmasuk != undefined ? moment($scope.iteminput.tglmasuk).format('YYYY-MM-DD') : null,
					'iki': $scope.iteminput.iki != undefined ? $scope.iteminput.iki : null,
					'iku': $scope.iteminput.iku != undefined ? $scope.iteminput.iku : null,
					'prosen': $scope.iteminput.prosen != undefined ? $scope.iteminput.prosen : null,
					'grade': $scope.iteminput.grade != undefined ? $scope.iteminput.grade : null,
					'mk': $scope.iteminput.mk != undefined ? $scope.iteminput.mk : null,
					'point_tt': $scope.iteminput.point_tt != undefined ? $scope.iteminput.point_tt : null,
				}
				console.log(json);
				medifirstService.post('remunerasi/save-index-pegawaiv2', json).then(function (e) {
					// medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
					// 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
					// 	$scope.itm.pegawai.namalengkap).then(function (res) {})
					loadData()
					$scope.batalinput()

				})

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

		

			$scope.klik = function (current) {
				console.log(current);
				norec=current.norec
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
                                        loadData()
                                        // $scope.isEdit = true;
                                        // // data.data.detail.forEach(function(x){
                                        // //     x.stokReal = x.qtyProduk;
                                        // // })
                                        // $scope.btnTombol = data.data.save_cmd
                                        // $scope.dataSource = new kendo.data.DataSource({
                                        //     data: data.data.detail,
                                        //     schema: {
                                        //         model: {
                                        //             fields: {
                                                        
                                        //             }
                                        //         }
                                        //     },
                                        //     // pageSize: 20,
                                        //     change: function (e) {
                                        //         console.log("change :" + e.action);
                                        //         if (e.field && e.action === "itemchange") {
                                        //             //debugger;
                                        //             //$scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        //             // if ($scope.current.selisih<0)
                                        //             //     $scope.current.selisih = $scope.current.selisih*=-1;
                                        //             $scope.dataRemun.fetch();
                                        //         }
                                        //     }

                                            
                                        // });
                                        // console.log($scope.dataRemun)
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
