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
            $scope.disterhadapdetail = FontFaceSetLoadEvent

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listJenisPerubahan = [
                { id: 1, jenisperubahan: "Perubahan" },
                { id: 2, jenisperubahan: "Non Perubahan" },
            ];

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listTahap = e.data.tahap
                $scope.listKegiatan = e.data.kegiatancombo
            });

            $scope.changeKegiatan = function () {
                medifirstService.get("perencanaan/get-detail-sub-kegiatan?kegiatan="+$scope.item.kegiatandetail.id+"&tahap="+$scope.item.tahapdetail.id+"&tahun="+moment($scope.item.tahundetail).format('YYYY')).then(function (e) {
                    $scope.listSubKegiatan = e.data.data
                });
            }


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

            $scope.CetakDataMata = function(){
                var tahap = ""
                if ($scope.item.tahapmata != undefined){
                    tahap = $scope.item.tahapmata.id
                }
                
                var terhadap = ""
                if ($scope.item.terhadapmata != undefined){
                    terhadap = $scope.item.terhadapmata.id
                }

                

                if($scope.item.terhadapmata == undefined || tahap == terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran-sebelum?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY'), '_blank');
                } else if($scope.item.terhadapmata != undefined || tahap != terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY') +"&terhadap="+terhadap, '_blank');
                }
            }

            $scope.CetakDataRekap = function(){
                var tahap = ""
                if ($scope.item.tahaprekap != undefined){
                    tahap = $scope.item.tahaprekap.id
                }
                
                var terhadap = ""
                if ($scope.item.terhadaprekap != undefined){
                    terhadap = $scope.item.terhadaprekap.id
                }

                

                if($scope.item.terhadaprekap == undefined || tahap == terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-total-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunrekap).format('YYYY'), '_blank');
                } else if($scope.item.terhadaprekap != undefined || tahap != terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunrekap).format('YYYY') +"&terhadap="+terhadap, '_blank');
                }
            }

            $scope.CetakSumberDana = function(){
                var tahap = ""
                if ($scope.item.tahapSumberDana != undefined) {
                    tahap = $scope.item.tahapSumberDana.id
                }

                var terhadap = ""
                if ($scope.item.terhadapSumberDana != undefined) {
                    terhadap = $scope.item.terhadapSumberDana.id
                }


                if ($scope.item.terhadapSumberDana == undefined || tahap == terhadap) {
                    window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran-sebelum?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY'), '_blank');
                } else if ($scope.item.terhadapSumberDana != undefined || tahap != terhadap) {
                    window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY') + "&terhadap=" + terhadap, '_blank');
                }
            }
            $scope.CetakRBADetail = function(){
                var tahap = ""
                if ($scope.item.tahapdetail != undefined) {
                    tahap = $scope.item.tahapdetail.id
                }

                var terhadap = ""
                if ($scope.item.terhadapdetail != undefined) {
                    terhadap = $scope.item.terhadapdetail.id
                }

                var tahun = ""
                if ($scope.item.tahundetail != undefined) {
                    tahun = $scope.item.tahundetail
                }

                var subsubkegiatan = ""
                if ($scope.item.subkegiatandetail != undefined) {
                    subsubkegiatan = $scope.item.subkegiatandetail.id
                }

                if ($scope.item.terhadapdetail != undefined) {
                    window.open(baseTransaksi + "report/get-cetak-rba-detail-sebelum-sesudah?tahun=" +moment(tahun).format('YYYY')+ "&subsubkegiatan=" + subsubkegiatan + "&tahap="+tahap + "&terhadap="+terhadap, '_blank');
                } else if($scope.item.terhadapdetail == undefined){
                    window.open(baseTransaksi + "report/get-cetak-rba-detail?tahun=" +moment(tahun).format('YYYY')+ "&subsubkegiatan=" + subsubkegiatan + "&tahap="+tahap, '_blank');
                }


                // if ($scope.item.terhadapSumberDana == undefined || tahap == terhadap) {
                //     window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran-sebelum?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY'), '_blank');
                // } else if ($scope.item.terhadapSumberDana != undefined || tahap != terhadap) {
                //     window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY') + "&terhadap=" + terhadap, '_blank');
                // }

                
            }
            $scope.CetakPendapatan = function(){
                // var tahap = ""
                // if ($scope.item.tahapdetail != undefined) {
                //     tahap = $scope.item.tahapdetail.id
                // }

                // var terhadap = ""
                // if ($scope.item.terhadapdetail != undefined) {
                //     terhadap = $scope.item.terhadapdetail.id
                // }

                var tahun = ""
                if ($scope.item.tahunpendapatan != undefined) {
                    tahun = $scope.item.tahunpendapatan
                }

                var perubahan = ""
                if ($scope.item.jenisperubahan != undefined) {
                    perubahan = $scope.item.jenisperubahan.id
                }

                window.open(baseTransaksi + "report/get-cetak-pendapatan-perubahan?tahun="+moment(tahun).format('YYYY')+"&perubahan="+perubahan, '_blank');
            }
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

            $scope.$watch('item.tahapdetail', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    if($scope.item.tahapdetail.id == 1 || $scope.item.tahapdetail.id == 2){
                        $scope.disterhadapdetail = true
                    } else{
                        $scope.disterhadapdetail = false
                    }
                }
            });

        }
    ]);
});