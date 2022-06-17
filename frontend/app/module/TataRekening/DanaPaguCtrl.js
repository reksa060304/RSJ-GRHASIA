define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DanaPaguCtrl', ['$scope', '$state', 'CacheHelper', '$mdDialog', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, $mdDialog, medifirstService, $timeout) {
			$scope.item = {};
			$scope.iteminput = {};
			$scope.now = new Date();
            $scope.disposting = false;
            $scope.posting = false;
            $scope.tanggalv = '';
			
			// var tgl = dateHelper.getDaysofMonth()
			// console.log(tgl);

            medifirstService.get('tatarekening/get-combo-detail-regis').then(function (e) {
                $scope.listPegawai = e.data.pegawai
            })

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
            $scope.SearchDiklat = function () {
                	var bulan = moment($scope.item.buland).format('MM');
                	var tahun = moment($scope.item.tahund).format('YYYY');
                	console.log(bulan);
                	console.log(tahun);
                    medifirstService.get('tatarekening/get-daftar-dana-diklatsum?bulan=' + bulan + "&tahun=" + tahun).then(function (e) {
                        $scope.item.diklat = e.data.data[0].pagudiklat;
                    })
            }
			function loadData(){
				var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
				console.log(bulan);
				console.log(tahun);
				medifirstService.get('tatarekening/get-daftar-dana-pagu?bulan='+ bulan + "&tahun="+ tahun).then(function (e) {
					
                    if(e.data.data.length > 0){
                        if(e.data.data[0].tglverif != null){
                            $scope.disposting = true;
                            $scope.tanggalv = e.data.data[0].tglverif
                        } else if(e.data.data[0].tglverif == null){
                            $scope.disposting = false;
                        }
                    } else{
                        $scope.disposting = false;
                    }
                    
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
				$scope.popupDetailIndex.center().open();
				
			}
            $scope.bagip3 = function () {
				$scope.popupP3Index.center().open();
				medifirstService.get('tatarekening/get-sisa-dana-p3?bulan='+ moment($scope.item.bulan).format('MM') + "&tahun=" + moment($scope.item.tahun).format('YYYY')).then(function (e) {
                    $scope.item.danap3 = e.data.data
                })
			}
			$scope.batal = function () {
				$scope.current = undefined
				$scope.popupDetailIndex.close();
				$scope.item = {}
			}

            $scope.batalp3 = function () {
				$scope.current = undefined
				$scope.popupP3Index.close();
				$scope.item = {}
			}

			$scope.save = function () {
				// if(moment($scope.item.periode).format('MM') == moment($scope.tanggalv).format('MM') && moment($scope.item.periode).format('YYYY') == moment($scope.tanggalv).format('YYYY')){
                //     toastr.error('Dana pada bulan tersebut sudah diverif')
                // } else{
                    medifirstService.get('tatarekening/get-daftar-dana-pagu?periodebulan='+ moment($scope.item.periode).format('YYYY-MM-DD') ).then(function (e) {
                        if(e.data.data.length > 0){
                            $scope.popupDetailIndex.close();
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Pada Bulan Tersebut Dana Pagu sudah diinput apakah mau input kembali?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                //$scope.SaveKirim();
                                let json = {
                                    'dana': $scope.item.dana,
                                    'diklat': $scope.item.diklat,
                                    'periode': moment($scope.item.periode).format('YYYY-MM-DD'),
                                }
                                medifirstService.post('tatarekening/save-dana-pagu', json).then(function (e) {
                                    // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                                    // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                                    // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                                    
                                    loadData()
                                    $scope.batal()
                
                                })
                            })
                        } else {
                            let json = {
                                'dana': $scope.item.dana,
                                'diklat': $scope.item.diklat,
                                'periode': moment($scope.item.periode).format('YYYY-MM-DD'),
                            }
                            medifirstService.post('tatarekening/save-dana-pagu', json).then(function (e) {
                                // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                                // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                                // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                                
                                loadData()
                                $scope.batal()
            
                            })
                        }
                    });
                // }
			}


            $scope.savep3 = function () {
				

                medifirstService.get('tatarekening/get-daftar-p3-pegawai-fix?bulan='+ moment($scope.item.bulan).format('MM') + "&tahun=" + moment($scope.item.tahun).format('YYYY') + "&pegawai=" + $scope.item.pegawai.id ).then(function (e) {
                    if(e.data.data.length > 0){
                        $scope.popupP3Index.close();
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Pada Bulan Tersebut P3 Pegawai sudah disetting apakah mau setting kembali?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            //$scope.SaveKirim();
                            let json = {
                                'jumlah': $scope.item.jumlahp3,
                                'pegawai': $scope.item.pegawai.id,
                                'sisa': $scope.item.danap3,
                                'bulan' : moment($scope.item.bulan).format('MM'),
				                'tahun' : moment($scope.item.tahun).format('YYYY'),
                            }
                            console.log(json)
                            if($scope.item.jumlahp3 > $scope.item.danap3){
                                toastr.error('Jumlah P3 Lebih Besar Dari Dana P3 Yang Tersisa')
                            } else{
                                medifirstService.post('tatarekening/save-dana-p3', json).then(function (e) {
                                    // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                                    // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                                    // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                                    
                                    loadData()
                                    $scope.popupP3Index.close();
                
                                })
                            }
                        })
                    } else {
                        let json = {
                            'jumlah': $scope.item.jumlahp3,
                            'pegawai': $scope.item.pegawai.id,
                            'sisa': $scope.item.danap3,
                            'bulan' : moment($scope.item.bulan).format('MM'),
				            'tahun' : moment($scope.item.tahun).format('YYYY'),
                        }

                        if($scope.item.jumlahp3 > $scope.item.danap3){
                            toastr.error('Jumlah P3 Lebih Besar Dari Dana P3 Yang Tersisa')
                        } else{
                            medifirstService.post('tatarekening/save-dana-p3', json).then(function (e) {
                                // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                                // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                                // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                                
                                loadData()
                                $scope.popupP3Index.close();
            
                            })
                        }
                        
                    }
                });
                
                        
				
				

			}

            $scope.postingUang = function () {
				
                medifirstService.get('tatarekening/get-daftar-remun-pegawai-fix?bulan='+ moment($scope.item.bulan).format('MM') + "&tahun=" + + moment($scope.item.tahun).format('YYYY') ).then(function (e) {
                    if(e.data.data.length > 0){
                        $scope.popupDetailIndex.close();
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Pada Bulan Tersebut Remun Pegawai sudah diposting apakah mau posting kembali?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            let json = {
                                'bulan': moment($scope.item.bulan).format('MM'),
                                'tahun': moment($scope.item.tahun).format('YYYY'),
                            }
                            //$scope.SaveKirim();
                            medifirstService.post('tatarekening/save-dana-remun', json).then(function (e) {
                                // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                                // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                                // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                                
                                loadData()
                                
            
                            })
                        })
                    } else {
                        let json = {
                                'bulan': moment($scope.item.bulan).format('MM'),
                                'tahun': moment($scope.item.tahun).format('YYYY'),
                            }
                        medifirstService.post('tatarekening/save-dana-remun', json).then(function (e) {
                            
                            // medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                            // 	'Perubahan index dari  ' + e.data.idx.totalindex + ' menjadi ' + e.data.total + ' pada Pegawai ' +
                            // 	$scope.itm.pegawai.namalengkap).then(function (res) {})
                            
                            loadData()
                            
        
                        })
                    }
                });
			}
		

			$scope.klik = function (current) {
				console.log(current);
				norec=current.norec
			}
			$scope.columnProduk = [
				{
					"field": "dana",
					"title": "DANA",
                    "template": "<span class='style-right'>{{formatRupiah('#: dana #', 'Rp.')}}</span>",			
				},
				{
					"field": "diklat",
					"title": "DIKLAT",
                    "template": "<span class='style-right'>{{formatRupiah('#: diklat #', 'Rp.')}}</span>",
				},
				{
					"field": "p1",
					"title": "P1",
                    "template": "<span class='style-right'>{{formatRupiah('#: p1 #', 'Rp.')}}</span>",
				},
				{
					"field": "iki",
					"title": "IKI",
                    "template": "<span class='style-right'>{{formatRupiah('#: iki #', 'Rp.')}}</span>",
				},
				{
					"field": "iku",
					"title": "IKU",
                    "template": "<span class='style-right'>{{formatRupiah('#: iku #', 'Rp.')}}</span>",
				},
				{
					"field": "tt",
					"title": "PointTT",
                    "template": "<span class='style-right'>{{formatRupiah('#: tt #', 'Rp.')}}</span>",
				},
				{
					"field": "ffs",
					"title": "FFS",
                    "template": "<span class='style-right'>{{formatRupiah('#: ffs #', 'Rp.')}}</span>",
				},
                {
					"field": "struk",
					"title": "STRUK",
                    "template": "<span class='style-right'>{{formatRupiah('#: struk #', 'Rp.')}}</span>",
				},
                {
					"field": "jtl",
					"title": "JTL",
                    "template": "<span class='style-right'>{{formatRupiah('#: jtl #', 'Rp.')}}</span>",
				},			
                {
					"field": "p3",
					"title": "P3",
                    "template": "<span class='style-right'>{{formatRupiah('#: p3 #', 'Rp.')}}</span>",
				},
                {
					"field": "pirp1",
					"title": "PIR P1",
				},
                {
					"field": "piriki",
                    "template": "<span class='style-right'>{{formatRupiah('#: p3 #', 'Rp.')}}</span>",
					"title": "PIR IKI",
				},
                {
					"field": "piriku",
					"title": "PIR IKU",
                    "template": "<span class='style-right'>{{formatRupiah('#: piriku #', 'Rp.')}}</span>",
				},
				{
					"field": "pirtt",
					"title": "PIR TT",
                    "template": "<span class='style-right'>{{formatRupiah('#: pirtt #', 'Rp.')}}</span>",
				},
				{
					"field": "pirstruk",
					"title": "PIR Struk",
                    "template": "<span class='style-right'>{{formatRupiah('#: pirstruk #', 'Rp.')}}</span>",
				},
				{
					"field": "pirjtl",
					"title": "PIR JTL",
                    "template": "<span class='style-right'>{{formatRupiah('#: pirjtl #', 'Rp.')}}</span>",
				},
                {
					"field": "tglverif",
					"title": "Tgl Verif",
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
			$scope.KelBPJS = function () {
				$state.go('KelompokProdukBPJS')
			}

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
