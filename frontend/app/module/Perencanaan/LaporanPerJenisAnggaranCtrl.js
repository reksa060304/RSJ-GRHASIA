define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanPerJenisAnggaranCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listTahap = e.data.tahap
            });


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.CetakData = function(){
                var tahap = ""
                if ($scope.item.tahap != undefined){
                    tahap = $scope.item.tahap.id
                }
                
                var terhadap = 2
                if ($scope.item.terhadap != undefined){
                    terhadap = $scope.item.terhadap.id
                }

                if($scope.item.terhadap == undefined || tahap == terhadap){
                    window.open(baseTransaksi + "report/get-cetak-per-jenis-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahun).format('YYYY'), '_blank');
                } else if($scope.item.terhadap != undefined){
                    window.open(baseTransaksi + "report/get-cetak-per-jenis-anggaran-sebelum-sesudah?tahap="+tahap+"&tahun="+moment($scope.item.tahun).format('YYYY') +"&terhadap="+terhadap, '_blank');
                }
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

        }
    ]);
});