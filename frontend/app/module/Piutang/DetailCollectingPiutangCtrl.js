define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DetailCollectingPiutangCtrl', ['$state', '$scope', 'MedifirstService',
		function ($state, $scope, medifirstService) {
			$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
			$scope.dataParam = $state.params.dataCollect;		
			var strFilter = "";
			var arrFilter = "";
			var noPostingC = "";
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			if ($scope.dataParam != undefined) {				
				$scope.dataParams = JSON.parse($scope.dataParam);
				var strFilter = $scope.dataParams.dataCollect;
				var arrFilter = strFilter.split('~');
				var noPostingC = arrFilter[0];
			}
			
			FormLoad()

			function FormLoad() {				
				medifirstService.get("piutang/collected-piutang-layanan/" + noPostingC).then(function (data) {
					var datas = data.data
					$scope.dataSource = new kendo.data.DataSource({
						data: datas,
						total: datas.length,
						group: [
							{ field: "jenisPasien" },
							{ field: "namarekanan" }
						]
					});
					// $scope.dataSource = data;
					for (var i = 0; i < datas.length; i++) {
						datas[i].sisa = parseFloat(datas[i].tarifinacbgs) - parseFloat(datas[i].totalBayar);
						// data[i].totalKlaimBPJS = parseFloat(data[i].tarifselisihklaim)- parseFloat(data[i].totalKlaim);
					}
					if (datas != undefined) {
						$scope.item.noCollect = datas[0].noPosting;
						$scope.item.namaCollector = datas[0].collector;
						$scope.item.tglCollect = datas[0].tglPosting;
					};
					//debugger;
					var ttlPasien = 0;
					var ttlKlaim = 0;
					for (var i = 0; i < datas.length; i++) {
						ttlPasien = ttlPasien + 1;
						ttlKlaim = ttlKlaim + parseFloat(datas[i].sisa);
					};
					$scope.item.totalPasien = ttlPasien;

					// $scope.item.totalKlaim = ttlKlaim
					$scope.item.totalKlaim = 'Rp. ' + parseFloat(ttlKlaim).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
				});
			}


			$scope.BatalCollect = function () {
				var stt = 'false'
				if (confirm('Batalkan collecting? ')) {
					// Save it!
					medifirstService.get("piutang/batal-collected-piutang-layanan?noposting=" + noPostingC).then(function (data) {

					})
					$state.go('DaftarCollectingPiutang');
				} else {
					// Do nothing!
					stt = 'false'
				}
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			}

			$scope.columCollecting = [
				{
					"field": "tglTransaksi",
					"title": "Tgl Registrasi"
				},
				{
					"field": "noRegistrasi",
					"title": "No Registrasi"
				},
				{
					"field": "namaPasien",
					"title": "Nama Pasien"
				},
				{
					"field": "totalKlaim",
					"title": "Total Verif",
					"template": "<span class='style-right'>{{formatRupiah('#: totalKlaim #', 'Rp.')}}</span>"
				},
				{
					"field": "tarifinacbgs",
					"title": "Total Klaim",
					"template": "<span class='style-right'>{{formatRupiah('#: tarifinacbgs #', 'Rp.')}}</span>"
				},
				{
					"field": "tarifselisihklaim",
					"title": "Selisih Klaim",
					"template": "<span class='style-right'>{{formatRupiah('#: tarifselisihklaim #', 'Rp.')}}</span>"
				},
				{
					"field": "totalBayar",
					"title": "Total Bayar",
					"template": "<span class='style-right'>{{formatRupiah('#: totalBayar #', 'Rp.')}}</span>"
				},
				{
					"field": "sisa",
					"title": "Sisa Piutang",
					"template": "<span class='style-right'>{{formatRupiah('#: sisa #', 'Rp.')}}</span>"
				},
				{
					"field": "keterangan",
					"title": "Keterangan"
				},
				{
					"field": "status",
					"title": "Status"
				}
			];

			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columCollecting,
				editable: "popup",
				selectable: "row",
				scrollable: false
			};

			$scope.Back = function () {
				$state.go('DaftarCollectingPiutang');
			};

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

			$scope.BayarTagihan = function () {
				$scope.changePage("PembayaranPiutangKasir");
			}

			$scope.changePage = function (stateName) {
				var obj = {
					noPosting: noPostingC
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.CetakTagihan = function () {
				var stt = 'false'
				if (confirm('View Tagihan? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-LaporanTagihanPenjamin=1&noposting=' + $scope.item.noCollect + '&login=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});

			};

			$scope.CetakKwitansi = function () {
				var stt = 'false'
				if (confirm('View Tagihan? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-kwitansiPiutang=1&noposting=' + $scope.item.noCollect + '&login=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});

			};

			$scope.CetakSuratTagihan = function () {
				var stt = 'false'
				if (confirm('View Tagihan? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-LaporanTagihanPenjaminSurat=1&noposting=' + $scope.item.noCollect + '&login=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});

			};			
			////////////////////////////////////////////////////////////////
		}
	]);
});