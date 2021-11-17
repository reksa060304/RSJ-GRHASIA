define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPasienAktifCtrl', ['CacheHelper', '$state', '$q', '$scope', 'DateHelper', 'DataHelper', 'MedifirstService',
		function (cacheHelper, $state, $q, $scope, dateHelper, dataHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.now = new Date();
			$scope.item = {};
			$scope.dataPasienSelected = {};
			showButton();
			FormLoad();

			function FormLoad() {
				// today
				var chacePeriode = cacheHelper.get('DaftarPasienAktif');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split(':');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
				} else {
					$scope.item.periodeAwal = $scope.now;
					$scope.item.periodeAkhir = $scope.now;
				}
				loadCombo()
			}

			function showButton() {
				$scope.showBtnPerbaharui = true;
				$scope.showBtnBayarDeposit = true;
				$scope.showBtnDetail = true;
				$scope.showBtnVerifikasi = true;
			}

			function loadCombo() {
				medifirstService.get('kasir/get-data-combo-kasir').then(function (dat) {
					$scope.listRuangan = dat.data.ruanganri
				});
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal != "null") {
					return moment(tanggal).format('DD-MMM-YYYY');
				}
				else {
					return "-";
				}

			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDaftarPasienPulang = [
				{
					"field": "tanggalMasuk",
					"title": "Tanggal Masuk",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tanggalMasuk #')}}</span>"
				},
				{
					"field": "tanggalPulang",
					"title": "Tanggal Pulang",
					"width": "100px",
					"template": "<span class='style-left'>{{formatTanggal('#: tanggalPulang #')}}</span>"
				},
				{
					"field": "noCm",
					"title": "No RM",
					"width": "150px",
					"template": "<span class='style-center'>#: noCm #</span>"
				},
				{
					"field": "noRegistrasi",
					"title": "No Reg",
					"width": "150px",
					"template": "<span class='style-center'>#: noRegistrasi #</span>"
				},
				{
					"field": "namaPasien",
					"title": "Nama Pasien",
					"width": "200px",
					"template": "<span class='style-left'>#: namaPasien #</span>"
				},
				{
					"field": "namaRuangan",
					"title": "Ruangan",
					"width": "250px",
					"template": "<span class='style-left'>#: namaRuangan #</span>"
				},
				{
					"field": "jenisAsuransi",
					"title": "Jenis Asuransi",
					"width": "150px",
					"template": "<span class='style-center'>#: jenisAsuransi #</span>"
				},
				{
					"field": "status",
					"title": "Status Pasien",
					"width": "150px",
					"template": "<span class='style-center'>#: status #</span>"
				},
				{
					"field": "statusverif",
					"title": "Status",
					"width": "150px",
					"template": "<span class='style-center'>#: statusverif #</span>"
				}
			];

			$scope.BayarDeposit = function () {
				$scope.changePage("PenyetoranDepositKasir"); 
			}


			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}

			$scope.changePage = function (stateName) {
				debugger;
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go(stateName, {
						dataPasien: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;
				$scope.item.ruangan = { namaExternal: "" };
				$scope.SearchData();
			}

			loadData();
			$scope.SearchData = function(){
				loadData();
			}

			//fungsi search data
			
			$scope.SearchEnter = function () {
				loadData()
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
				if ($scope.item.ruangan == undefined) {
					var rg = ""
				} else {
					var rg = "&ruanganId=" + $scope.item.ruangan.id
				}
				if ($scope.item.noReg == undefined) {
					var reg = ""
				} else {
					var reg = "&noReg=" + $scope.item.noReg
				}
				if ($scope.item.nama == undefined) {
					var nm = ""
				} else {
					var nm = "namaPasien=" + $scope.item.nama
				}
				$q.all([
					medifirstService.get("kasir/daftar-pasien-aktif?"
						+ nm + reg + rg
						+ "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir),
				]).then(function (data) {
					if (data[0].statResponse) {
						$scope.isRouteLoading = false;
						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							data: data[0].data,
							pageSize: 20,
							total: data[0].data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										tanggalMasuk: { type: "date" },
										tanggalPulang: { type: "date" }
									}
								}
							}
						});
					}
				});
				var chacePeriode = tglAwal + ":" + tglAkhir;
				cacheHelper.set('DaftarPasienAktif', chacePeriode);
			}

			/*function prosesSearch(kriteriaFilter){
				debugger;
				 var arrFilter = [];
				  for(var i=0; i<kriteriaFilter.length; i++){
						if(kriteriaFilter[i].value != "")
						{
							var obj = {
								field: kriteriaFilter[i].text, 
								operator: kriteriaFilter[i].operator, 
								value: kriteriaFilter[i].value
							};

							arrFilter.push(obj);
						}
				  }

				  var grid = $("#kGrid").data("kendoGrid");
				  grid.dataSource.query({
						page:1,
					pageSize: 10,
					filter:{
					  logic: "and",
					  filters: arrFilter
					 }
				  });
			  }*/
			$scope.Detail = function () {
				$scope.changePage("RincianTagihan");
			}

			$scope.changePage = function (stateName) {
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go(stateName, {
						dataPasien: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.dataPasienSelected = dataPasienSelected;
				}
			}

			$scope.Verifikasi = function () {
				medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {

					if (res.data.noverif != undefined) {
						alert("Sudah dalam penagihan piutang, tidak bisa di Verifikasi!")
						return;
					}
					//POSTING JURNAL
					var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
					var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');;
					$scope.changePage("VerifikasiTagihan");
				})
			}

			$scope.columnGrids = [
				{
				  "field": "no",
				  "title": "No",
				  "width": "45px",
				},
				{
				  "field": "tglstruk",
				  "title": "Tgl Struk",
				  "width": "80px",
				  "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
				},
				{
				  "field": "nostruk",
				  "title": "No Verifikasi",
				  "width": "80px"
				},
				{
				  "field": "petugasverif",
				  "title": "Petugas Verifikasi",
				  "width": "120px"
				},
				{
				  "field": "totalharusdibayar",
				  "title": "Total Harus Bayar",
				  "width": "110px",
				  "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
				},
				{
				  "field": "status",
				  "title": "Status Bayar",
				  "width": "100px",
				}
			  ];
		
			  $scope.data2 = function (dataItem) {
				for (var i = 0; i < dataItem.details.length; i++) {
				  dataItem.details[i].no = i + 1
				}
				return {
				  dataSource: new kendo.data.DataSource({
					data: dataItem.details
				  }),
				  columns: [
					{
					  "field": "no",
					  "title": "No",
					  "width": "45px",
					},
					{
					  "field": "tglsbm",
					  "title": "Tgl Bayar",
					  "width": "80px",
					  "template": "<span class='style-right'>{{formatTanggal('#: tglsbm #', '')}}</span>"
					},
					{
					  "field": "nosbm",
					  "title": "No Bukti Pembayaran",
					  "width": "120px",
					},
					{
					  "field": "carabayar",
					  "title": "Cara Bayar",
					  "width": "100px",
					},
					{
					  "field": "totaldibayar",
					  "title": "Total Bayar",
					  "width": "100px",
					  "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
					},
					{
					  "field": "kasir",
					  "title": "Petugas Kasir",
					  "width": "120px"
					}
				  ]
				}
			  };

			function LoadDataDetailVerif() {
				var NoReg = ''
				if ($scope.NoregDetail != undefined) {
					NoReg = $scope.NoregDetail
				}
				medifirstService.get("tatarekening/get-data-detail-verifikasi?noRegistrasi=" + NoReg).then(function (data) {
					$scope.isRouteLoading = false;
					var data = data.data.data
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						element.no = i + 1;
					}
					$scope.dataGrid = new kendo.data.DataSource({
						data: data,
						pageSize: 200,
						total: data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});

				});
			}

			$scope.DetailVerifikasi = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.NoregDetail = $scope.dataPasienSelected.noRegistrasi;
				$scope.dataGrid = new kendo.data.DataSource({
					data: [],
				});
				LoadDataDetailVerif();
				$scope.detailVerifikasi.center().open();
			}

			$scope.unVerifikasi = function () {
				if ($scope.dataSelected == undefined) {
				  toastr.error('Pilih data dulu')
				  return
				}
		
				if ($scope.dataSelected.noverifikasi != undefined) {
				  toastr.error('Sudah dalam penagihan piutang, tidak bisa di Unverifikasi!')
				  return
				}
		
				if ($scope.dataSelected.nosbmlastfk != undefined) {
				  toastr.error('Data Sudah Dibayar, tidak bisa di Unverifikasi!')
				  return
				}
		
				var objSave = {
				  'noregistrasi': $scope.dataSelected.noregistrasi,
				  'norec_sp': $scope.dataSelected.norec
				}
		
				medifirstService.post('tatarekening/batal-verifikasi-tagihan', objSave).then(function (data) {
				  var datas = data.data.data[0];
				  $scope.NoregDetail = datas.noregistrasi;
				  medifirstService.postLogging('Unverifikasi TataRekening', 'norec strukpelayanan_t', datas.norec,
					'Unverifikasi TataRekening Pada Pasien Dengan Noregistrasi : ' + datas.noregistrasi + ' dengan No Verifikasi : ' + datas.nostruk).then(function (res) {
					  LoadDataDetailVerif();
					})
				})
			  }

			  $scope.Batal = function () {
				$scope.dataGrid = new kendo.data.DataSource({
				  data: [],
				});
				$scope.detailVerifikasi.close();
			  }

			  $scope.klikGrids = function(dataSelected){
					if (dataSelected !=  undefined) {
						$scope.dataSelected = dataSelected;
					}
			  }

			  $scope.saveLogUnverif = function () {
				var objSave = {
				  "noregistrasi": $scope.dataPasienSelected.noRegistrasi
				}
				medifirstService.post('tatarekening/save-log-unverifikasi-tarek', objSave).then(function (e) { })
			  }

			////////////////////// -TAMAT- /////////////////////////
		}
	]);
});