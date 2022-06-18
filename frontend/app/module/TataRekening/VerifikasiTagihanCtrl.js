define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('VerifikasiTagihanCtrl', ['$state', '$q', '$scope', 'MedifirstService', '$mdDialog',
		function ($state, $q, $scope, medifirstService, $mdDialog) {
			$scope.isRouteLoading = false;
			$scope.now = new Date();
			$scope.nowFormated = moment($scope.now).format('DD-MM-YYYY');
			$scope.pageCetak = false;
			$scope.showKelengkapanDokumen = false;
			$scope.item = {};
			$scope.tombolSaveIlang = true;
			$scope.dataParams = JSON.parse($state.params.dataPasien);
			$scope.passDefault = undefined;
			var dataLayanan = [];
			var totbll = 0
			var totbyy = 0
			var dataResep = [];
			var data3 = [];
			var verifTotal = 0;
			var norec_pd = '';
			var strRUanganFilter = '';
			var ruangaan2 = {};
			var dataLogin = {};
			var KelompokUser = {};
			var dataTampil = '';
			var dibayar = 0;
			var DataRespone = [];
			var isVerifAll = false;
			var checklisteuy = false
			var arrayMultiPenjamin = [];
			var multiPenjaminFix = []
			$scope.item.iurbayar = undefined;
			FormLoad();

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.formatTanggal = function (tanggal) {

				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatTanggalAjah = function (tanggal) {

				return moment(tanggal).format('DD-MMM-YYYY');
			}

			function FormLoad() {
				$scope.isRouteLoading = true;
				$scope.diskonTotal = false;
				LoadCombo();
				$scope.HilangGridSatu = true;
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: []
				});
				$scope.dataRincianTagihan1 = new kendo.data.DataSource({
					data: []
				});
				$scope.isRouteLoading = true;
				init();
				// loadDataResep();
				// $scope.isRouteLoading=false;
			}

			function LoadCombo() {
				medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataParams.noRegistrasi).then(function (e) {
					dataLogin = e.data.datalogin;
					KelompokUser = e.data.kelompokuser;
					$scope.listRuangAPD = e.data.listRuangan
					$scope.passDefault = e.data.pass
				});
			}

			function init() {
				$q.all([
					medifirstService.get("tatarekening/verifikasi-tagihan2?noRegister=" + $scope.dataParams.noRegistrasi)
				]).then(function (data) {
					DataRespone = data[0]
					if (data[0].statResponse) {
						// $scope.item = data[0];
						$scope.item = data[0].data;
						$scope.item.cekMultiPenjamin = false
						$scope.item.multiPenjamin = []
						$scope.item.jumlahBayar = 0;
						$scope.item.billing = 0;
						if (data[0].data.deposit != undefined) {
							$scope.item.deposit = data[0].data.deposit;
						} else {
							$scope.item.deposit = 0;
						}

						if (data[0].data.needDokument) {
							$scope.showKelengkapanDokumen = true;
							$scope.dataKelengkapanDokumen = new kendo.data.DataSource({
								data: data[0].data.dokuments
							});
						}

						$scope.showTtlKlaim = true
						$scope.showTtlKlaim2 = true
					}
				});

				dataLayanan = [];
				dataResep = [];
				$q.all([
					medifirstService.get("tatarekening/detail-tagihan-verifikasi?noRegister=" + $scope.dataParams.noRegistrasi)
				])
					.then(function (data2) {

						if (data2[0].statResponse) {
							dataLayanan = [];
							dataResep = [];
							var dibayar = 0
							verifTotal = 0
							var nourutlayanan = 0
							var nourutresep = 0
							for (var i = data2[0].data.details.length - 1; i >= 0; i--) {
								if (data2[0].data.details[i].strukfk != null) {
									if (data2[0].data.details[i].strukfk == " / ") {
										data2[0].data.details[i].statCheckbox = false;
									} else if ($scope.item.jenisPasien == 'BPJS' || $scope.item.jenisPasien == 'BPJS Non PBI ' || $scope.item.jenisPasien == 'BPJS PBI') {
										data2[0].data.details[i].statCheckbox = true;
									} else {
										data2[0].data.details[i].statCheckbox = true;
									}

									if (data2[0].data.details[i].strukfk.length > 20) {
										dibayar = dibayar + data2[0].data.details[i].total
									}
									if (data2[0].data.details[i].strukfk.length < 20 && data2[0].data.details[i].strukfk.length > 5) {
										verifTotal = verifTotal + data2[0].data.details[i].total
									}
								}
								if (data2[0].data.details[i].strukfk == " / ") {
									if (data2[0].data.details[i].aturanpakai == null) {
										nourutlayanan = nourutlayanan + 1
										data2[0].data.details[i].no = nourutlayanan
										// dataLayanan[] = data[0].details[i]
										dataLayanan.push(data2[0].data.details[i])
									} else {
										nourutresep = nourutresep + nourutresep
										data2[0].data.details[i].no = nourutresep
										dataResep.push(data2[0].data.details[i])
										// dataResep[] = data[0].details[i]
									}
								}
							}

							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: dataLayanan,//details,
								group: [
									//{field: "ruanganTindakan"}
								],
								// pageSize: 20,

								// pageSize: 10,
							});
							$scope.dataRincianTagihan1 = new kendo.data.DataSource({
								data: dataResep,//details,
								group: [
									//{field: "ruanganTindakan"}
								],
								// pageSize: 20,

								// pageSize: 10,
							});
							$scope.item.ruang2 = ruangaan2
							$scope.isRouteLoading = false;

						}
						// $scope.isRouteLoading=false;
					});

				// dataTampil = 'resep'
				// if (dataResep.length !=0) {
				// 	$scope.dataRincianTagihan = new kendo.data.DataSource({
				// 		data: dataResep,//data[0].details,
				//          		pageSize: 20,
				// 		group: [
				//                      //{field: "ruanganTindakan"}
				//                  ],
				//              	// pageSize: 10,
				// 	});
				// 	$scope.isRouteLoading=false;
				// 	return
				// }else{
				// 	// $scope.isRouteLoading=true;				
				// 	$scope.selectedData =[];
				// 	$scope.selectedData2 =[];
				// 	$scope.dataRincianTagihan1 = new kendo.data.DataSource({
				// 		data: [],//data[0].details,
				//          		pageSize: 20,
				// 		group: [
				//                      //{field: "ruanganTindakan"}
				//                  ],
				//              	// pageSize: 10,
				// 	});

				// 	$q.all([
				// 		modelItemAkuntansi.getDataTableTransaksi("tatarekening/detail-tagihan-verifikasi/"+ $scope.dataParams.noRegistrasi + '?jenisdata=resep')
				// 		])
				// 	.then(function(data3) {
				// 		//debugger
				// 		var datas = data3.data;
				// 		if (data3[0].statResponse){
				// 			dataResep=[];
				// 			dibayar=0
				// 			verifTotal=0
				// 			var nourutlayanan = 0
				// 			var nourutresep = 0
				// 			$scope.isRouteLoading = false;
				// 			for (var i = data3[0].details.length - 1; i >= 0; i--) {
				// 				if (data3[0].details[i].strukfk != null) {

				// 					if (data3[0].details[i].strukfk == " / ") {
				// 						data3[0].details[i].statCheckbox =false ;
				// 					}else if ($scope.item.jenisPasien == 'BPJS') {
				// 						data3[0].details[i].statCheckbox = true;
				// 					}else{
				// 						data3[0].details[i].statCheckbox = true;
				// 					}	

				// 					if (data3[0].details[i].strukfk.length > 20 ) {
				// 						dibayar=dibayar+data3[0].details[i].total
				// 					}
				// 					if (data3[0].details[i].strukfk.length < 20 && data3[0].details[i].strukfk.length > 5 ) {
				// 						verifTotal=verifTotal+data3[0].details[i].total
				// 					}
				// 				}
				// 				if (data3[0].details[i].strukfk == " / ") {
				// 					if (data3[0].details[i].aturanpakai == null) {
				// 						nourutlayanan = nourutlayanan + 1
				// 						data3[0].details[i].no  = nourutlayanan
				// 						// dataLayanan[] = data[0].details[i]
				// 						dataLayanan.push(data3[0].details[i])
				// 					}else{
				// 						nourutresep = nourutresep + nourutresep
				// 						data3[0].details[i].no  = nourutresep
				// 						dataResep.push(data3[0].details[i])
				// 						// dataResep[] = data[0].details[i]
				// 					}
				// 				}

				// 			}							
				// 			$scope.dataRincianTagihan1 = new kendo.data.DataSource({
				// 				data: dataResep,//data[0].details,
				//                     		pageSize: 20,
				// 				group: [
				//                           //{field: "ruanganTindakan"}
				//                       ],
				//                      	// pageSize: 10,
				// 			});
				// 			$scope.item.ruang2= ruangaan2							
				// 		}else{
				// 			$scope.isRouteLoading=false;
				// 		}


				// 	});
				// }								
			}

			$scope.checkboxClicked = function (dat) {
				let jml723 = 0
				if (dat) {
					$scope.item.datachecklist = []
					for (var i = 0; i < dataLayanan.length; i++) {
						$scope.item.datachecklist.push(dataLayanan[i])
					}

					for (var i = 0; i < dataResep.length; i++) {
						$scope.item.datachecklist.push(dataResep[i])
					}
					var tol = 0
					for (var i = 0; i < $scope.item.datachecklist.length; i++) {
						if ($scope.item.datachecklist[i].iskronis == true) {
							jml723 = (parseFloat($scope.item.datachecklist[i].total) / 30) * 7 + jml723
						}
						tol = parseFloat($scope.item.datachecklist[i].total) + tol

					}
					$scope.item.jumlahBayar = tol - parseFloat($scope.item.deposit)
					$scope.item.billing = tol
					if ($scope.item.jenisPasien == 'BPJS' || $scope.item.jenisPasien == 'BPJS Non PBI' 
					|| $scope.item.jenisPasien == 'BPJS PBI' || $scope.item.jenisPasien == 'BPJS KELAS I' || $scope.item.jenisPasien == 'BPJS KELAS II' 
					|| $scope.item.jenisPasien == 'BPJS KELAS III' || $scope.item.jenisPasien == 'BPJS KELAS III PBI' 
					|| $scope.item.jenisPasien == 'BPJS KELAS III NON PBI (Mandiri)' || $scope.item.jenisPasien == 'Jamkesos' 
					|| $scope.item.jenisPasien == 'Jamkesda'
					|| $scope.item.jenisPasien == 'IPWL') {
						// if ($scope.item.jenisPasien == 'BPJS' || $scope.item.jenisPasien == 'BPJS Non PBI' || $scope.item.jenisPasien == 'BPJS PBI') {
						$scope.item.totalKlaim = tol;//- jml723;
					} else {
						$scope.item.totalKlaim = 0;
					}
				} else {
					$scope.item.datachecklist = []
					$scope.item.jumlahBayar = 0
					$scope.item.billing = 0
					$scope.item.totalKlaim = 0
				}


				checklisteuy = true
				$scope.dataRincianTagihan = new kendo.data.DataSource({
					data: dataLayanan,//details,
					group: [
						//{field: "ruanganTindakan"}
					],
					// pageSize: 20,

					// pageSize: 10,
				});
				$scope.dataRincianTagihan1 = new kendo.data.DataSource({
					data: dataResep,//details,
					group: [
						//{field: "ruanganTindakan"}
					],
					// pageSize: 20,

					// pageSize: 10,
				});

				// $scope.item.datachecklist = $scope.selectedData2
				// if(dat == true){
				// 	$scope.isRouteLoading=true;
				// 	isVerifAll = true;
				// 	if (DataRespone != undefined) {
				// 		$scope.HilangGridSatu=false;
				// 		$scope.item.billing=DataRespone.jumlahBayarNew;
				// 		$scope.item.jumlahBayar=DataRespone.jumlahBayarNew;
				// 		$scope.item.deposit=DataRespone.deposit;
				// 		if(DataRespone.jenisPasien == "BPJS"){
				// 			$scope.item.totalKlaim = DataRespone.jumlahBayarNew;
				// 			$scope.showTtlKlaim2=true;
				// 		}else if(DataRespone.jenisPasien == "Umum/Pribadi"){
				// 			$scope.item.totalKlaim = 0;
				// 			$scope.showTtlKlaim2=false;
				// 		}else{
				// 			$scope.item.totalKlaim = 0;
				// 			$scope.showTtlKlaim2=true;
				// 		}
				// 		$scope.isRouteLoading=false;
				// 	}
				// }else{
				// 	$scope.isRouteLoading=true;				
				// 	if (DataRespone != undefined) {
				// 		$scope.HilangGridSatu=true;
				// 		if (isVerifAll == true) {
				// 			$scope.item.billing=0;
				// 			$scope.item.jumlahBayar=0;
				// 			$scope.item.deposit=0;
				// 			$scope.item.totalKlaim = 0;
				// 			$scope.showTtlKlaim2=false;
				// 			// isVerifAll=;
				// 		}else{
				// 			isVerifAll=false;
				// 			init();
				// 			loadDataResep();
				// 		}
				// 		$scope.isRouteLoading=false;
				// 	}
				// }       				
				//             if ($scope.item.kasuslama == false) {
				//                 $scope.item.kasusbaru = true
				//                 $scope.item.kasuslama = false 
				//             }else{
				//                 $scope.item.kasusbaru = false
				//                 $scope.item.kasuslama = true
				//             }
			}


			// function loadDataResep(){
			// 	dataTampil = 'resep'
			// 	if (dataResep.length !=0) {
			// 		$scope.dataRincianTagihan = new kendo.data.DataSource({
			// 			data: dataResep,//data[0].details,
			//           		pageSize: 20,
			// 			group: [
			//                       //{field: "ruanganTindakan"}
			//                   ],
			//               	// pageSize: 10,
			// 		});
			// 		return
			// 	}

			// 	// $scope.isRouteLoading=true;

			// 	$scope.selectedData =[];
			// 	$scope.selectedData2 =[];
			// 	$scope.dataRincianTagihan1 = new kendo.data.DataSource({
			// 		data: [],//data[0].details,
			//          		pageSize: 20,
			// 		group: [
			//                      //{field: "ruanganTindakan"}
			//                  ],
			//              	// pageSize: 10,
			// 	});

			// 		$q.all([
			// 			modelItemAkuntansi.getDataTableTransaksi("tatarekening/detail-tagihan-verifikasi/"+ $scope.dataParams.noRegistrasi + '?jenisdata=resep')
			// 			])
			// 		.then(function(data) {

			// 			if (data[0].statResponse){
			// 				dataResep=[];
			// 				dibayar=0
			// 				verifTotal=0
			// 				var nourutlayanan = 0
			// 				var nourutresep = 0
			// 				for (var i = data[0].details.length - 1; i >= 0; i--) {
			// 					if (data[0].details[i].strukfk != null) {

			// 						if (data[0].details[i].strukfk == " / ") {
			// 							data[0].details[i].statCheckbox =false ;
			// 						}else if ($scope.item.jenisPasien == 'BPJS') {
			// 							data[0].details[i].statCheckbox = true;
			// 						}else{
			// 							data[0].details[i].statCheckbox = true;
			// 						}	

			// 						if (data[0].details[i].strukfk.length > 20 ) {
			// 							dibayar=dibayar+data[0].details[i].total
			// 						}
			// 						if (data[0].details[i].strukfk.length < 20 && data[0].details[i].strukfk.length > 5 ) {
			// 							verifTotal=verifTotal+data[0].details[i].total
			// 						}
			// 					}
			// 					if (data[0].details[i].strukfk == " / ") {
			// 						if (data[0].details[i].aturanpakai == null) {
			// 							nourutlayanan = nourutlayanan + 1
			// 							data[0].details[i].no  = nourutlayanan
			// 							// dataLayanan[] = data[0].details[i]
			// 							dataLayanan.push(data[0].details[i])
			// 						}else{
			// 							nourutresep = nourutresep + nourutresep
			// 							data[0].details[i].no  = nourutresep
			// 							dataResep.push(data[0].details[i])
			// 							// dataResep[] = data[0].details[i]
			// 						}
			// 					}

			// 				}							

			// 				$scope.dataRincianTagihan1 = new kendo.data.DataSource({
			// 					data: dataResep,//data[0].details,
			//                      		pageSize: 20,
			// 					group: [
			//                            //{field: "ruanganTindakan"}
			//                        ],
			//                       	// pageSize: 10,
			// 				});
			// 				$scope.item.ruang2= ruangaan2

			// 			}


			// 		});
			// }


			$scope.selectedData2 = [];
			$scope.onClickSatu = function (e, param) {
				var tol = 0;

				var element = $(e.currentTarget);
				if (param == 1) {
					var checked = element.is(':checked')
					var row = element.closest('tr')
					var grid = $("#kGrids").data("kendoGrid")
				} else {
					var checked = element.is(':checked')
					var row = element.closest('tr')
					var grid = $("#kGrid").data("kendoGrid")

				}
				var dataItem = grid.dataItem(row);



				// $scope.selectedData[dataItem.noRec] = checked;
				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.norec == dataItem.norec;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].norec === dataItem.norec) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].norec === dataItem.norec) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

				if ($scope.selectedData2.length != 0) {
					let jml723 = 0
					for (var i = 0; i < $scope.selectedData2.length; i++) {
						if ($scope.selectedData2[i].iskronis == true) {
							jml723 = (parseFloat($scope.selectedData2[i].total) / 30) * 7
						}
						tol = parseFloat($scope.selectedData2[i].total) + tol
						$scope.item.jumlahBayar = tol
						$scope.item.billing = tol
						if ($scope.item.jenisPasien == 'BPJS' || $scope.item.jenisPasien == 'BPJS Non PBI ' || $scope.item.jenisPasien == 'BPJS PBI') {
							$scope.item.totalKlaim = tol - jml723;
						} else {
							$scope.item.totalKlaim = 0;
						}
					}
				} else {
					$scope.item.jumlahBayar = tol;
					$scope.item.billing = tol;
					$scope.item.totalKlaim = tol;
				}

				$scope.item.jumlahBayar = parseFloat($scope.item.jumlahBayar) - parseFloat($scope.item.deposit)
				$scope.item.datachecklist = $scope.selectedData2
				console.log($scope.selectedData2)
			}

			$scope.columnRincianTagihan = {
				selectable: "multiple",
				columns: [
					{
						// "title": "<input type='checkbox' class='checkbox' ng-click='selectAll($event,1)' />",
						"template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event,1)' ng-checked='checklisteuy'/>",
						width: "30px"
					},
					{
						"field": "tglPelayanan",
						"title": "Tanggal",
						"width": "100px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
						// "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
					},
					{
						"field": "namaPelayanan",
						"title": "Nama Pelayanan",
						"width": "200px",
					},
					{
						"field": "kelasTindakan",
						"title": "Kelas",
						"width": "100px",
					},
					{
						"field": "dokter",
						"title": "Dokter",
						"width": "170px",
					},
					{
						"field": "ruanganTindakan",
						"title": "Ruangan",
						"width": "200px",
					},
					{
						"field": "jumlah",
						"title": "Qty",
						"width": "50px",
						"template": "<span class='style-right'>#: jumlah #</span>"
					},
					{
						"field": "harga",
						"title": "Harga",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
					},
					{
						"field": "diskon",
						"title": "Harga Diskon",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
					},
					{
						"field": "jasa",
						"title": "Jasa",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
					},
					{
						"field": "total",
						"title": "Total",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
					},
					{
						"field": "statuscito",
						"title": "Status Cito",
						"width": "80px",
						"attributes": { class: "text-center" },
					},
					{
						"field": "strukfk",
						"title": "NoStruk/NoSbm",
						"width": "120px"
					}
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
			}

			$scope.columnRincianTagihan1 = {
				columns: [
					{
						// "title": "<input type='checkbox' class='checkbox' ng-click='selectAll(2)' />",
						"template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event,2)' />",
						width: "30px"
					},
					{
						"field": "tglPelayanan",
						"title": "Tanggal",
						"width": "100px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
						// "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
					},
					{
						"field": "namaPelayanan",
						"title": "Nama Pelayanan",
						"width": "200px",
					},
					{
						"field": "kelasTindakan",
						"title": "Kelas",
						"width": "100px",
					},
					{
						"field": "dokter",
						"title": "Dokter",
						"width": "170px",
					},
					{
						"field": "ruanganTindakan",
						"title": "Ruangan",
						"width": "200px",
					},
					{
						"field": "jumlah",
						"title": "Qty",
						"width": "50px",
						"template": "<span class='style-right'>#: jumlah #</span>"
					},
					{
						"field": "harga",
						"title": "Harga",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
					},
					{
						"field": "diskon",
						"title": "Harga Diskon",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
					},
					{
						"field": "jasa",
						"title": "Jasa",
						"width": "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
					},
					{
						"field": "total",
						"title": "Total",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
					},
					{
						"field": "statuscito",
						"title": "Status Cito",
						"width": "80px",
						"attributes": { class: "text-center" },
					},
					{
						"field": "strukfk",
						"title": "NoStruk/NoSbm",
						"width": "120px"
					}
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
			}

			// function showButton(){
			// 	$scope.showBtnSimpan = true;
			// 	$scope.showBtnKembali = true;
			// 	// $scope.showBtnCetak = true;
			// }
			// showButton();

			$scope.Cetak = function () {
				$scope.pageCetak = true;
				$scope.showBtnCetak = false;
				$scope.showBtnSimpan = false;

				$scope.totalBayarFormated = formatRupiah($scope.item.jumlahBayar, "Rp.");
			}
			$scope.DetailTagihan = function () {
				var obj = {
					noRegistrasi: $scope.dataParams.noRegistrasi
				}

				$state.go("RincianTagihan", {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.Save = function () {
				// if (isVerifAll == true) {
				// 	SaveAll()
				// }else{
				if ($scope.item.cekDiskonTotal == 1) {
					$scope.popUpPwd.open().center();
				} else {
					savePIlih();
				}
				// }
			}

			function SaveAll() {
				$scope.tombolSaveIlang = false;
				var listRawRequired = [
					"item.totalKlaim|ng-model|Total klaim",
				];

				var isValid = medifirstService.setValidation($scope, listRawRequired);

				if (isValid.status) {
					medifirstService.post('tatarekening/simpan-verifikasi-tagihan/', $scope.item)
						.then(function (e) {
							$scope.SaveLogUser();
							window.history.back();
							$scope.tombolSaveIlang = true;
						}, function () {

						});
				}
				else {
					medifirstService.showMessages(isValid.messages);
				}
			}
			function syncTransdata() {

				medifirstService.postNonMessage('tatarekening/sync-trandata-new', { noregistrasi: $scope.item.noRegistrasi }).then(function (e) {
					// $scope.isRouteLoading = false
				}, function (err) {
					// $scope.isRouteLoading = false
				})
			}
			function savePIlih() {
				$scope.isRouteLoading = false;
				$scope.tombolSaveIlang = false;
				var listRawRequired = [
					"item.totalKlaim|ng-model|Total klaim",
				];

				var isValid = medifirstService.setValidation($scope, listRawRequired);
				var objSave = {
					"data": $scope.item,
				}
				medifirstService.post('tatarekening/simpan-verifikasi-tagihan-tatarekening', objSave).then(function (e) {
					$scope.tombolSaveIlang = true;
					// syncTransdata()
					$scope.SaveLogUser();
					// window.history.back();
					var kelompokUser = medifirstService.getKelompokUser()
					if (parseFloat($scope.item.jumlahBayar) > 0 && kelompokUser == 'kasir') {
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('Apakah anda mau melanjutkan ke Pembayaran ?')
							.ariaLabel('Lucky day')
							.cancel('Batal')
							.ok('Ok')
						$mdDialog.show(confirm).then(function () {
							var obj = {
								noRegistrasi: e.data.result.norec
							}

							$state.go("PembayaranTagihanLayananKasir", {
								dataPasien: JSON.stringify(obj)
							});
						})

					} else {
						window.history.back();
					}

				}, function (error) {
					$scope.tombolSaveIlang = true;
				});
			}

			$scope.SaveLogUser = function () {
				medifirstService.get("sysadmin/logging/save-log-verifikasi-tarek?noregistrasi="
					+ $scope.item.noRegistrasi).then(function (data) { })
			}
			$scope.Back = function () {
				if ($scope.pageCetak) {
					$scope.pageCetak = false;
					// $scope.showBtnCetak = true;
					$scope.showBtnSimpan = true;
				}
				else {
					window.history.back()
				}
			}

			$scope.dataKelengkapanDokumen = new kendo.data.DataSource({
				data: []
			});
			$scope.columnKelengkapanDokumen = [
				{
					"field": "No",
					"title": "No"
				},
				{
					"field": "Check",
					"title": "Check"
				},
				{
					"field": "Nama",
					"title": "Nama"
				},
				{
					"field": "Dokumen",
					"title": "Dokumen"
				}
			];

			//create pdf kwintans pembayaran
			$scope.getPDF = function (selector) {
				kendo.drawing.drawDOM($(selector)).then(function (group) {
					kendo.drawing.pdf.saveAs(group, "Kwintansi-Pembayaran-" + $scope.nowFormated + ".pdf");
				});
			}

			function formatRupiah(value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.$watch('item.totalKlaim', function (newValue, oldValue) {
				$scope.item.jumlahBayar = $scope.item.billing - newValue - $scope.item.deposit;
			});

			$scope.CariFilterRuanganLayanan = function () {
				$scope.isRouteLoading = true;

				strRUanganFilter = '';
				if ($scope.item.ruang2 != null) {
					strRUanganFilter = '&idruangan=' + $scope.item.ruang2.id
					ruangaan2 = { id: $scope.item.ruang2.id, namaruangan: $scope.item.ruang2.namaruangan }
				} else {
					ruangaan2 = {}
				}


				$scope.selectedData = [];

				dataLayanan = [];
				dataResep = [];
				$q.all([
					medifirstService.get("tatarekening/detail-tagihan-verifikasi?noRegister=" + $scope.item.noRegistrasi + strRUanganFilter)
				])
					.then(function (data) {

						if (data[0].statResponse) {
							dataLayanan = [];
							dataResep = [];
							var dibayar = 0
							verifTotal = 0
							var nourutlayanan = 0
							var nourutresep = 0
							for (var i = data[0].data.details.length - 1; i >= 0; i--) {
								if (data[0].data.details[i].strukfk != null) {
									if (data[0].data.details[i].strukfk.length > 20) {
										dibayar = dibayar + data[0].data.details[i].total
									}
									if (data[0].data.details[i].strukfk.length < 20 && data[0].data.details[i].strukfk.length > 5) {
										verifTotal = verifTotal + data[0].data.details[i].total
									}
								}
								if (data[0].data.details[i].strukfk == " / ") {
									if (data[0].data.details[i].aturanpakai == null) {
										nourutlayanan = nourutlayanan + 1
										data[0].data.details[i].no = nourutlayanan
										// dataLayanan[] = data[0].details[i]
										dataLayanan.push(data[0].data.details[i])
									} else {
										nourutresep = nourutresep + nourutresep
										data[0].data.details[i].no = nourutresep
										dataResep.push(data[0].data.details[i])
										// dataResep[] = data[0].details[i]
									}
								}
							}

							$scope.dataRincianTagihan = new kendo.data.DataSource({
								data: dataLayanan,//details,
								group: [
									//{field: "ruanganTindakan"}
								],
								// pageSize: 20,

								// pageSize: 10,
							});
							$scope.dataRincianTagihan1 = new kendo.data.DataSource({
								data: dataResep,//details,
								group: [
									//{field: "ruanganTindakan"}
								],
								// pageSize: 20,

								// pageSize: 10,
							});
							$scope.item.ruang2 = ruangaan2
						}
						$scope.isRouteLoading = false;

					});
			}

			$scope.rekapTagihan = function () {

				var obj = {
					noRegistrasi: $scope.dataParams.noRegistrasi
				}

				$state.go('RekapTagihan', {
					dataPasien: JSON.stringify(obj)
				});
			}
			$scope.multi = {}
			$scope.klikMultiPenjamin = function (e) {
				if ($scope.item.billing == 0) {
					toastr.error('Ceklis Verifikasi dlu')
					return
				}
				if (e == true) {
					medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function (data) {
						$scope.listKelompokPasien = data.data.kelompokpasien;
						for (var i = 0; i < $scope.listKelompokPasien.length; i++) {
							if ($scope.listKelompokPasien[i].kelompokpasien == $scope.item.jenisPasien) {
								$scope.multi.kelompokPasien = $scope.listKelompokPasien[i]
								break
							}
						}

					})
					$scope.multi.totalKlaim = parseFloat($scope.item.billing)
					$scope.item.multiPenjamin = undefined
					$scope.popUpMulti.center().open()
				}
			}

			$scope.klikDiskonTotal = function (e) {
				if (e == true) {
					if ($scope.item.billing == 0) {
						toastr.error('Ceklis Verifikasi dlu')
						$scope.item.cekDiskonTotal = 0;
						return
					}
					$scope.diskonTotal = true;
					$scope.item.diskonTotalPersen = 0;
					$scope.item.diskonTotal = 0;
					$scope.item.kataKunciPass = undefined;
				} else {
					$scope.diskonTotal = false;
					$scope.item.diskonTotalPersen = undefined;
					$scope.item.diskonTotal = undefined;
					$scope.item.kataKunciPass = undefined;
				}

			}

			$scope.$watch('multi.kelompokPasien', function (e) {
				if (e === undefined) return;
				medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
					.then(function (z) {
						$scope.listRekanan = z.data.rekanan;
						if (e.kelompokpasien == 'Umum/Pribadi') {
							$scope.multi.rekanan = '';
						}
						else if ($scope.item.jenisPasien == 'BPJS' || $scope.item.jenisPasien == 'BPJS Non PBI ' || $scope.item.jenisPasien == 'BPJS PBI') {
							$scope.multi.rekanan = { id: $scope.listRekanan[0].id, namarekanan: $scope.listRekanan[0].namarekanan };
						} else {
							$scope.multi.rekanan = undefined
						}

					})
			});

			$scope.columnPenjamin = {
				sortable: true,
				// pageable: true,
				selectable: "row",
				pageable: true,
				columns: [
					{
						field: "no",
						title: "No",
						width: "30px",

					},
					{
						field: "kelompokpasien",
						title: "Jenis",
						width: "100px",

					},
					{
						field: "namarekanan",
						title: "Penjamin",
						width: "200px",
						// footerTemplate: "Total",
					},
					{
						field: "klaim",
						title: "Total Klaim",
						width: "100px",
						"template": "<span class='style-right'>{{formatRupiah('#: klaim #', '')}}</span>",
						attributes: { style: "text-align:right;" },
						// aggregates: ["sum"],
						// footerTemplate: "<span > {{formatRupiah('#:data.klaim.sum  #', '')}}</span>"

					}
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				},
			};
			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			$scope.addPenjamin = function () {

				if ($scope.multi.kelompokPasien == undefined) {
					toastr.error("Pilih jenis pasien");
					return;
				}
				if ($scope.multi.rekanan == undefined) {
					toastr.error("Pilih penjamin");
					return;
				}

				var nomor = 0
				if ($scope.dataSourcePenjamin == undefined) {
					nomor = 1
				} else {
					nomor = arrayMultiPenjamin.length + 1
				}
				if (arrayMultiPenjamin.length > 0) {
					var total = 0
					for (var i = 0; i < arrayMultiPenjamin.length; i++) {
						total = parseFloat(arrayMultiPenjamin[i].klaim) + total
					}
					if (total > parseFloat($scope.item.billing)) {
						toastr.error('Total klaim harus sama dengan Total Tagihan')
						return
					}
				}
				var data = {};
				if ($scope.multi.no != undefined) {
					for (var i = arrayMultiPenjamin.length - 1; i >= 0; i--) {
						if (arrayMultiPenjamin[i].no == $scope.multi.no) {
							data.no = $scope.multi.no

							data.kelompokpasienfk = $scope.multi.kelompokPasien.id
							data.kelompokpasien = $scope.multi.kelompokPasien.kelompokpasien
							data.klaim = parseFloat($scope.multi.totalKlaim)
							data.rekananfk = $scope.multi.rekanan.id
							data.namarekanan = $scope.multi.rekanan.namarekanan

							arrayMultiPenjamin[i] = data;
							$scope.dataSourcePenjamin = new kendo.data.DataSource({
								data: arrayMultiPenjamin,
								serverPaging: false,
								pageSize: 10,
								// schema: {
								// 	model: {
								// 		fields: {
								// 			kelompokpasien: { type: "string" },
								// 			klaim: { type: "number" },
								// 			namarekanan: { type: "string" },
								// 		}
								// 	}
								// }, aggregate: [
								// 	{ field: 'klaim', aggregate: 'sum' },

								// ]
							});
						}
					}

				} else {
					data = {
						no: nomor,
						kelompokpasienfk: $scope.multi.kelompokPasien.id,
						kelompokpasien: $scope.multi.kelompokPasien.kelompokpasien,
						klaim: parseFloat($scope.multi.totalKlaim),
						rekananfk: $scope.multi.rekanan.id,
						namarekanan: $scope.multi.rekanan.namarekanan,
					}
					arrayMultiPenjamin.push(data)

					$scope.dataSourcePenjamin = new kendo.data.DataSource({
						data: arrayMultiPenjamin,
						serverPaging: false,
						pageSize: 10,
						// schema: {
						// 	model: {
						// 		fields: {
						// 			kelompokpasien: { type: "string" },
						// 			klaim: { type: "number" },
						// 			namarekanan: { type: "string" },
						// 		}
						// 	}
						// }, aggregate: [
						// 	{ field: 'klaim', aggregate: 'sum' },

						// ]
					});


				}

				$scope.multi.totalFixClaim = 0;
				$scope.multi.totalFixClaimRp = 0;
				for (var i = 0; i < arrayMultiPenjamin.length; i++) {
					$scope.multi.totalFixClaim = parseFloat($scope.multi.totalFixClaim) + parseFloat(arrayMultiPenjamin[i].klaim);
					$scope.multi.totalFixClaimRp = $scope.formatRupiah($scope.multi.totalFixClaim, '')
				}

				$scope.multi.totalKlaim = $scope.item.billing - $scope.multi.totalFixClaim;
				$scope.batalPenjamin();
			}
			$scope.klikPenjamin = function (dataPenjaminSelect) {
				var dataKelompok = [];
				var dataRekanan = [];
				//no:no,
				$scope.multi.no = dataPenjaminSelect.no
				for (var i = $scope.listKelompokPasien.length - 1; i >= 0; i--) {
					if ($scope.listKelompokPasien[i].id == dataPenjaminSelect.kelompokpasienfk) {
						dataKelompok = $scope.listKelompokPasien[i]
						break;
					}
				}

				for (var i = $scope.listRekanan.length - 1; i >= 0; i--) {
					if ($scope.listRekanan[i].id == dataPenjaminSelect.rekananfk) {
						dataRekanan = $scope.listRekanan[i]
						break;
					}
				}
				$scope.multi.kelompokPasien = dataKelompok;
				$scope.multi.rekanan = dataRekanan;
				$scope.multi.totalKlaim = dataPenjaminSelect.klaim

			}
			$scope.hapusPenjamin = function () {
				if ($scope.dataPenjaminSelect == undefined) {
					toastr.error("Pilih data dulu!")
					return;
				}

				var nomor = 0
				if ($scope.dataSourcePenjamin == undefined) {
					nomor = 1
				} else {
					nomor = arrayMultiPenjamin.length + 1
				}
				var data = {};
				if ($scope.multi.no != undefined) {
					for (var i = arrayMultiPenjamin.length - 1; i >= 0; i--) {
						if (arrayMultiPenjamin[i].no == $scope.multi.no) {
							arrayMultiPenjamin.splice(i, 1);
							for (var i = arrayMultiPenjamin.length - 1; i >= 0; i--) {
								arrayMultiPenjamin[i].no = i + 1
							}

							$scope.dataSourcePenjamin = new kendo.data.DataSource({
								data: arrayMultiPenjamin,
								serverPaging: false,
								pageSize: 10,
								// schema: {
								// 	model: {
								// 		fields: {
								// 			kelompokpasien: { type: "string" },
								// 			klaim: { type: "number" },
								// 			namarekanan: { type: "string" },
								// 		}
								// 	}
								// }, aggregate: [
								// 	{ field: 'klaim', aggregate: 'sum' },

								// ]
							});
						}
					}

				}
				$scope.batalPenjamin();
			}
			$scope.batalPenjamin = function () {

				$scope.multi.kelompokPasien = undefined
				$scope.multi.rekanan = ''
				// delete $scope.multi.totalKlaim
				$scope.multi.no = undefined

			}
			$scope.saveMulti = function () {
				$scope.item.multiPenjamin = arrayMultiPenjamin
				$scope.item.totalKlaim = $scope.multi.totalFixClaim
				$scope.popUpMulti.close()
			}
			$scope.tutupMulti = function () {

				$scope.multi.kelompokPasien = undefined
				$scope.multi.rekanan = ''
				delete $scope.multi.totalKlaim
				$scope.multi.no = undefined
				$scope.dataSourcePenjamin = new kendo.data.DataSource({
					data: []
				});
				$scope.item.cekMultiPenjamin = false
				$scope.multi.totalFixClaim = 0;
				$scope.multi.totalFixClaimRp = 0;
				$scope.item.multiPenjamin = []
				arrayMultiPenjamin = []
				$scope.popUpMulti.close()


			}
			$scope.$watch('item.filter', function (newValue, oldValue) {
				var layananFilter = [];
				var txtnaonwelah = '';

				if ($scope.selectedTab != 1) {

					for (var i = dataLayanan.length - 1; i >= 0; i--) {
						txtnaonwelah = ' ' + dataLayanan[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								layananFilter.push(dataLayanan[i])
							}
						}

					}
					if ($scope.item.filter == '') {
						layananFilter = dataLayanan
					}
					$scope.dataRincianTagihan = new kendo.data.DataSource({
						data: layananFilter,
						// pageSize: 20,
						group: [
							//{field: "ruanganTindakan"}
						],
					});
				} else {
					var resepFilter = [];
					for (var i = dataResep.length - 1; i >= 0; i--) {
						txtnaonwelah = ' ' + dataResep[i].namaPelayanan;
						txtnaonwelah = txtnaonwelah.toUpperCase()
						if (txtnaonwelah != null) {
							if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
								resepFilter.push(dataResep[i])
							}
						}

					}
					if ($scope.item.filter == '') {
						resepFilter = dataResep
					}
					$scope.dataRincianTagihan1 = new kendo.data.DataSource({
						data: resepFilter,
						// pageSize: 20,
						group: [
							//{field: "ruanganTindakan"}
						],
					});
				}

			});

			$scope.$watch('iur.totalKelasAwal', function (e) {
				$scope.iur.totaldiKlaim = 0;
				$scope.iur.totalSelisih = 0;
				if (e === undefined) return;
				var total = 0;				
				var totkelasDown = e;				
				var totKelasUp = 0;
				if ($scope.iur.totalKelasAkhir != undefined) {
					totKelasUp = $scope.iur.totalKelasAkhir;
				}
				total = parseFloat(totKelasUp) - parseFloat(totkelasDown);				
				$scope.iur.totaldiKlaim = parseFloat($scope.iur.totaldiBayar) - total;
				$scope.iur.totalSelisih = total
			});

			$scope.$watch('iur.totalKelasAkhir', function (e) {
				$scope.iur.totaldiKlaim = 0;
				$scope.iur.totalSelisih = 0;
				if (e === undefined) return;
				var totKelasUp = e;
				var total = 0;				
				var totkelasDown = 0;
				if ($scope.iur.totalKelasAwal != undefined) {
					totkelasDown = $scope.iur.totalKelasAwal;
				}								
				total = parseFloat(totKelasUp) - parseFloat(totkelasDown);				
				$scope.iur.totaldiKlaim = parseFloat($scope.iur.totaldiBayar) - total;
				$scope.iur.totalSelisih = total
			});

			$scope.BatalSimpanDiskon = function () {
				$scope.diskonTotal = false;
				$scope.item.diskonTotalPersen = undefined;
				$scope.item.diskonTotal = undefined;
				$scope.item.kataKunciPass = undefined;
				$scope.popUpPwd.close();
			}

			$scope.lanjutVerifikasi = function () {
				$scope.isRouteLoading = true;
				if ($scope.item.billing == 0) {
					toastr.error('Ceklis Verifikasi dlu')
					$scope.isRouteLoading = false;
					return
				}
				if ($scope.item.diskonTotalPersen == 0 || $scope.item.diskonTotalPersen == undefined) {
					toastr.error('Diskon Masih Kosong')
					$scope.isRouteLoading = false;
					return
				}
				if ($scope.item.diskonTotal == 0 || $scope.item.diskonTotal == undefined) {
					toastr.error('Diskon Masih Kosong')
					$scope.isRouteLoading = false;
					return
				}
				if ($scope.item.kataKunciPass != $scope.passDefault) {
					alert('Kata kunci / password salah')
					$scope.item.kataKunciPass = undefined;
					$scope.isRouteLoading = false;
					return
				}
				$scope.item.kataKunciPass = undefined;
				$scope.item.kataKunciConfirm = undefined;
				$scope.popUpPwd.close();
				savePIlih();
			}

			
			$scope.getNilaiPersenDiskon = function () {
				$scope.item.diskonTotal = 0;
				if ($scope.item.diskonTotalPersen > 0) {
					var diskon = (parseFloat($scope.item.billing) * parseFloat($scope.item.diskonTotalPersen)) / 100
					$scope.item.diskonTotal = diskon;
					$scope.item.jumlahBayar = parseFloat($scope.item.billing) - parseFloat($scope.item.diskonTotal);
				}
			}

			$scope.getTotalDiskon = function () {
				$scope.item.diskonTotalPersen = 0;
				if ($scope.item.diskonTotal > 0) {
					var diskon = (parseFloat($scope.item.diskonTotal)*100) / parseFloat($scope.item.billing)					
					$scope.item.diskonTotalPersen = diskon;					
					$scope.item.jumlahBayar = parseFloat($scope.item.billing) - parseFloat($scope.item.diskonTotal);
				}
			}
			// $scope.$watch('item.diskonTotalPersen', function (newValue, oldValue) {
			// 	if (newValue != oldValue) {
			// 		if ($scope.item.diskonTotalPersen > 0) {
			// 			var diskon = (parseFloat($scope.item.billing) * parseFloat($scope.item.diskonTotalPersen)) / 100
			// 			$scope.item.diskonTotal = diskon;
			// 		}
			// 	}
			// });

			// $scope.$watch('item.diskonTotal', function (newValue, oldValue) {
			// 	if (newValue != oldValue) {
			// 		if ($scope.item.diskonTotal > 0) {
			// 			var diskon = parseFloat($scope.item.billing) / parseFloat($scope.item.diskonTotal)
			// 			if ($scope.item.diskonTotalPersen == 0 || $scope.item.diskonTotalPersen == undefined || $scope.item.diskonTotalPersen != diskon) {
			// 				$scope.item.diskonTotalPersen = diskon;
			// 			}
			// 			$scope.item.jumlahBayar = parseFloat($scope.item.billing) - parseFloat($scope.item.diskonTotal);
			// 		}
			// 	}
			// });
			$scope.iur = {}
			$scope.klikIurBayar = function (e) {
				if ($scope.item.noRegistrasi == undefined) {
					toastr.error('Data Tidak Ditemukan !')
					return
				}

				if ($scope.item.billing == 0) {
					toastr.error('Ceklis Verifikasi Dahulu !')
					return
				}

				if (e == true) {
					medifirstService.get("tatarekening/get-data-kelas-antrianpasien?Noreg=" + $scope.item.noRegistrasi
						, false).then(function (data) {
							var datas = data.data;
							if (datas != undefined) {
								$scope.listkelas = datas.datakelas;
								$scope.listkelasNaik = datas.datakelas; //datakelas;
							}
							$scope.iur.totaldiBayar = parseFloat($scope.item.billing);
							$scope.iur.totaldiKlaim = parseFloat($scope.item.totalKlaim);
							$scope.popUpIur.center().open()
						})
				}

			}

			$scope.saveIur = function () {
				if ($scope.iur.kelasAwal == undefined) {
					toastr.error("Kelas Awal Harus Diisi");
					return;
				}
				if ($scope.iur.kelasTujuan == undefined) {
					toastr.error("Kelas Tujuan Harus Diisi");
					return;
				}
				if ($scope.iur.kelasAwal.id == $scope.iur.kelasTujuan.id) {
					toastr.error("Kelas Awal dan Kelas Tujuan Tidak Boleh Sama");
					return;
				}
				if ($scope.iur.totalKelasAwal == undefined) {
					toastr.error("Total Tagihan Kelas Awal Harus Diisi");
					return;
				}
				if ($scope.iur.totalKelasAwal == undefined) {
					toastr.error("Total Tagihan Kelas Akhir Harus Diisi");
					return;
				}
				if ($scope.iur.totalSelisih == undefined) {
					toastr.error("Selisih Masih Kosong Diisi");
					return;
				}
				var iurbayar = {
					"idkelasawal" : $scope.iur.kelasAwal.id,
					"idkelasakhir" : $scope.iur.kelasTujuan.id,
					"tagihankelasawal" : parseFloat($scope.iur.totalKelasAwal),
					"tagihankelasakhir" : parseFloat($scope.iur.totalKelasAkhir),
					"selisih" : parseFloat($scope.iur.totalSelisih),
					"klaim" : parseFloat($scope.iur.totaldiKlaim),
				}
				$scope.item.iurbayar = iurbayar;
				$scope.item.totalKlaim = $scope.iur.totaldiKlaim
				$scope.popUpIur.close()
			}

			$scope.tutupIur = function () {
				$scope.item.iurbayar = undefined;
				$scope.iur = {};
				$scope.popUpIur.close()
			}

			//** BATAS */
		}
	]);
});