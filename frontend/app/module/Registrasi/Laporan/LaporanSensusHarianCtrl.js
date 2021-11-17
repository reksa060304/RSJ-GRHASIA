define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSensusHarianCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};            
            $scope.isRouteLoading = false;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');

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
            
            $scope.cetakLap = function () {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));				
				var stt = 'false'
				if (confirm('View Laporan Sensus Harian Rawat Inap? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-sensusharianranap=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
                });
            }
            //** BATAS SUCI */
        }
    ]);
}); 