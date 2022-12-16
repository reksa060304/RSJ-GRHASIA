define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('LaporanKlaimDiagnosaCtrl', ['$state', '$q', '$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
		function ($state, $q, $scope, cacheHelper, $mdDialog, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.isRouteLoading = false;
			$scope.dataPasienSelected = {};
			$scope.listStatus = [
				{ id: 1, namaExternal: "Klaim" },
				{ id: 2, namaExternal: "Tidak Klaim" }
			];
			$scope.item.status = $scope.listStatus[0];
			$scope.item.awalPeriode = $scope.now;
			$scope.item.akhirPeriode = $scope.now;
			$scope.cboDefault = true;
			$scope.cboRekanan = false;
			$scope.dataLogin = medifirstService.getUserLogin();
			$scope.pegawaiLogin = medifirstService.getPegawaiLogin();
			$scope.item.totalklaim=0
            $scope.item.jmlRows = 50
			var DataTotalMataAnggaran = [];
			loadCombo();
			loadData();

			$scope.batalRekanan = function () {
				$scope.cboRekanan = false
				$scope.cboDefault = true
			}

			$scope.tagihan = function () {
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			function loadCombo() {
				var chacePeriode = cacheHelper.get('chachePiutang');
				if (chacePeriode != undefined) {
					$scope.item.awalPeriode = new Date(chacePeriode[0]);;
					$scope.item.akhirPeriode = new Date(chacePeriode[1]);
				} else {
					$scope.item.awalPeriode = $scope.now
					$scope.item.akhirPeriode = $scope.now
				}

                medifirstService.getPart("sysadmin/general/get-datacombo-rekanan-kelompokpasien-group", true, true, 20).then(function (data) {
					$scope.listKelompokPasien = data;
				});
			}

			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}


			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDataPasienPiutang = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarKlaimPasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:E1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Daftar Klaim Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
					{
						"field": "kddiagnosa",
						"title": "Kode Diagnosa",
						"width": "150px",
					},
                    {
						"field": "namadiagnosa",
						"title": "Nama Diagnosa",
						"width": "100px",
					},
					{
						"field": "totaltarifrs",
						"title": "Total Tarif RS",
						"width": "100px",
                        template: "<span class='style-right'>{{formatRupiah('#: totaltarifrs #', '')}}</span>",
					},
					{
						"field": "totalsetujui",
						"title": "Total Klaim",
						"width": "150px",
                        template: "<span class='style-right'>{{formatRupiah('#: totalsetujui #', '')}}</span>",
					}
				]
			};

			function generateFlagTemplate(field){
				if (field== true)
					return "<input type='checkbox' class='checkbox style-center' ng-checked='true' />";
				else
					return "<input type='checkbox' class='checkbox style-center' ng-checked='false' />";
			}
			$scope.Cetak = function () {

			}

			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}

			$scope.changePage = function (stateName) {
				if ($scope.dataPasienSelected.id != undefined) {
					$state.go(stateName, {
						dataPasien: JSON.stringify($scope.dataPasienSelected)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.awalPeriode = $scope.now;
				$scope.item.akhirPeriode = $scope.now;
				$scope.SearchData();
			}
			//PENGECEKAN UNTUK DATA/PARAMETER KOSONG
			function undefinedChecker(data) {
				var temp = "";

				if (!_.isUndefined(data)) {
					temp = data;
				}
				return temp;
			}
			function undefinedCheckerObject(data) {
				var temp = "";

				if (!_.isUndefined(data)) {
					temp = data.id;
				}
				return temp;
			}
			//fungsi search data
			$scope.SearchData = function () {
				loadData();
			}
			function loadData() {
				//debugger;
				$scope.isRouteLoading = true;
				var tglAkhir = moment($scope.item.akhirPeriode).format('YYYY-MM-DD');
				var tglAwal = moment($scope.item.awalPeriode).format('YYYY-MM-DD');

                // var kelompokpasien = "";
				// if ($scope.item.kelompokpasien != undefined) {
				// 	kelompokpasien = $scope.item.kelompokpasien.kelompokpasienfix
				// }

                var row = "";
				if ($scope.item.jmlRows != undefined) {
					row = $scope.item.jmlRows
				}
                
				$q.all([
					medifirstService.get("tatarekening/daftar-rekap-klaim-diagnosa?"
						+ "&tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
                        + "&row=" + row),
				]).then(function (e) {
					$scope.isRouteLoading = false;
					var dataPasien = e[0].data.data;
					console.log(e[0].data.data)
						for (var i = 0; i < dataPasien.length; i++) {
							dataPasien[i].no = i+1;
						}
                        
						$scope.dataPasienPiutang = new kendo.data.DataSource({
							data: dataPasien,
							pageSize: 10,
							total: dataPasien.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								},
                                aggregate: [
                                ]
							}
						});
						var chacePeriode = {
							0: tglAwal,
							1: tglAkhir,

						}
				});
			}

			var HttpClient = function () {
				this.get = function (aUrl, aCallback) {
					var anHttpRequest = new XMLHttpRequest();
					anHttpRequest.onreadystatechange = function () {
						if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
							aCallback(anHttpRequest.responseText);
					}

					anHttpRequest.open("GET", aUrl, true);
					anHttpRequest.send(null);
				}
			}

			$scope.CetakSurat = function () {				
				if ($scope.dataPasienSelected.noRegistrasi == undefined) {
					alert("data belum di pilih !!!")
				} else if ($scope.dataPasienSelected.jenisPasisen == "BPJS") {
					alert("Piih jenis pasien asuransi lain atau perusahaan")
				} else {
					var noreg = $scope.dataPasienSelected.noRegistrasi
					var stt = 'false'
					if (confirm('View Surat? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-LaporanTagihanSuratPasien=1&norec=' + noreg + '&view=' + stt, function (response) {
						// do something with response
					});
				}

			}
			$scope.CetakKwitansi = function () {				
				if ($scope.dataPasienSelected.noRegistrasi == undefined) {
					alert("data belum di pilih !!!")
				} else if ($scope.dataPasienSelected.jenisPasisen == "BPJS") {
					alert("Piih jenis pasien asuransi lain atau perusahaan")
				} else {
					var noreg = $scope.dataPasienSelected.noRegistrasi
					var stt = 'false'
					if (confirm('View Kwitansi? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-kwitansiPiutangPasien=1&norec=' + noreg + '&view=' + stt, function (response) {
						// do something with response
					});
				}

			}

		}
	]);
});