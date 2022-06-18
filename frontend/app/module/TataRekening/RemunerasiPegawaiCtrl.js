define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RemunerasiPegawaiCtrl', ['$scope', '$state', 'CacheHelper', '$mdDialog', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, $mdDialog, medifirstService, $timeout) {
			$scope.isRouteLoading = false
			$scope.item = {};
			$scope.iteminput = {};
			$scope.now = new Date();
			$scope.noposting = '';
			$scope.disposting = false;
			$scope.posting = false;
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
				$scope.isRouteLoading = true
				var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
				var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
				
				medifirstService.get('tatarekening/get-daftar-remun-pegawai-fix?tglawal='+ tglawal + "&tglakhir="+ tglakhir).then(function (e) {
					$scope.isRouteLoading = false
					if(e.data.data[0].tglverif != null){
                        $scope.disposting = true;
                        $scope.posting = false;
                    } else if(e.data.data[0].tglverif == null){
                        $scope.disposting = false;
                        $scope.posting = true;
                    }
					
					$scope.noposting = e.data.data[0].noposting
					console.log($scope.noposting)
					console.log(e.data.data[0].tglverif)
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
			$scope.batalverif = function(){
			$scope.isRouteLoading = true
				let json = {
					'noposting': $scope.noposting,
				}
				console.log(json)
				medifirstService.post('get/save-unverif-remun', json).then(function (e) {
					loadData()
					$scope.isRouteLoading = false
				})
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

                                    medifirstService.post('tatarekening/save-dana-ffs', objSave).then(function (data) {
                                        loadData()
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

            });

			$scope.postingTotalBersih = function () {
				let json = {
					'noposting' : $scope.noposting,
				}
				console.log(json)
				medifirstService.post('get/save-posting-total-bersih', json).then(function (e) {
					loadData()

				})

			}

			$scope.verif = function () {
			$scope.isRouteLoading = true
				let json = {
					'noposting' : $scope.noposting,
				}
				console.log(json)
				medifirstService.post('get/save-verif-remun', json).then(function (e) {
					$scope.isRouteLoading = false
					loadData()

				})

			}

			$scope.klik = function (current) {
				console.log(current);
				norec=current.norec
			}
			$scope.columnProduk = [
				{
					"field": "namalengkap",
					"title": "Nama Pegawai",
                    "width": '200px',			
				},
				{
					"field": "idpegawai",
					"title": "Kd Pegawai",
                    "width": '200px',			
				},
				{
					"field": "uangp1",
					"title": "Uang P1",
                    "width": '200px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangp1 #', 'Rp.')}}</span>",
				},
				{
					"field": "uangiki",
					"title": "Uang IKI",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangiki #', 'Rp.')}}</span>",
				},
				{
					"field": "uangiku",
					"title": "Uang IKU",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangiku #', 'Rp.')}}</span>",
				},
				{
					"field": "uangtt",
					"title": "Uang TT",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangtt #', 'Rp.')}}</span>",
				},
				{
					"field": "uangjtl",
					"title": "Uang JTL",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangjtl #', 'Rp.')}}</span>",
				},
				{
					"field": "uangstruk",
					"title": "Uang Struk",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangstruk #', 'Rp.')}}</span>",
				},
				{
					"field": "uangp3",
					"title": "Uang P3",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangp3 #', 'Rp.')}}</span>",
				},
				{
					"field": "uangffs",
					"title": "Uang FFS",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangffs #', 'Rp.')}}</span>",
				},
				{
					"field": "uangdiklat",
					"title": "Uang Diklat",
					"width": '150px',
					"template": "<span class='style-right'>{{formatRupiah('#: uangdiklat #', 'Rp.')}}</span>",
				},
				{
					"field": "totalkotor",
					"title": "Total Kotor",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: totalkotor #', 'Rp.')}}</span>",
				},
				{
					"field": "totalpajak",
					"title": "Total Pajak",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: totalpajak #', 'Rp.')}}</span>",
				},
				{
					"field": "totalbersih",
					"title": "Total Bersih",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: totalbersih #', 'Rp.')}}</span>",
				},
                {
					"field": "noposting",
					"title": "No Posting",
                    "width": '150px',
				},
				{
					"field": "tglverif",
					"title": "Tgl Verif",
                    "width": '150px',
				},
			];
			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columnProduk,
				editable: "popup",
				selectable: "row",
				scrollable: true,
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

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
		}
	]);
});
