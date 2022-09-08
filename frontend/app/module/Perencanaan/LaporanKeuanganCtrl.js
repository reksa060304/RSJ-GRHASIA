define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanKeuanganCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglcetak = moment($scope.now).format('YYYY-mm-dd');
            $scope.item.tahun = moment($scope.now).format('YYYY')
            $scope.item.tahunbku = moment($scope.now).format('YYYY')
            $scope.item.tahunangkas = moment($scope.now).format('YYYY')
            $scope.hide = false

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.listJenisRekening = [
                { id: 1, jenisrekening: "Tampilkan Rek RBA" },
                { id: 2, jenisrekening: "Tampilkan Rek Permen"}
            ];

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listTahap = e.data.tahap
                $scope.listAsalProduk = e.data.asalproduk
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.CetakData = function(){

                if ($scope.item.tahun == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.jenisrekening == undefined){
                    toastr.warning('Jenis Rekening harus diisi', 'Informasi');
                    return
                }

                var tahun = ""
                if ($scope.item.tahun != undefined){
                    tahun = moment($scope.item.tahun).format('YYYY')
                }
                
                var asalproduk = ""
                if ($scope.item.asalproduk != undefined){
                    asalproduk = $scope.item.asalproduk.id
                }

                

                if($scope.item.jenisrekening.id == 1){
                    window.open(baseTransaksi + "report/get-cetak-keuangan-per-rekening?tahun="+tahun+"&asalproduk="+asalproduk, '_blank');
                } else if($scope.item.jenisrekening.id == 2){
                    window.open(baseTransaksi + "report/get-cetak-keuangan-per-rekening-permen?tahun="+tahun+"&asalproduk="+asalproduk, '_blank');
                }
            }

            $scope.CetakDataMata = function(){

                if ($scope.item.tahunangkas == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulan1 == undefined){
                    toastr.warning('Bulan awal harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulan2 == undefined){
                    toastr.warning('Bulan akhir harus diisi', 'Informasi');
                    return
                }

                var tahunangkas = ""
                if ($scope.item.tahunangkas != undefined){
                    tahunangkas = moment($scope.item.tahunangkas).format('YYYY')
                }
                
                var asalprodukangkas = ""
                if ($scope.item.asalprodukangkas != undefined){
                    asalprodukangkas = $scope.item.asalprodukangkas.id
                }

                var bulanawal = ""
                if ($scope.item.bulan1 != undefined){
                    bulanawal = moment($scope.item.bulan1).format('MM')
                }

                var bulanakhir = ""
                if ($scope.item.bulan2 != undefined){
                    bulanakhir = moment($scope.item.bulan2).format('MM')
                }

                window.open(baseTransaksi + "report/get-cetak-persandingan-angkas-penyerapan?tahunangkas=" + tahunangkas + "&asalprodukangkas=" + asalprodukangkas + "&bulanawal=" + bulanawal + "&bulanakhir=" + bulanakhir , '_blank');

                // if($scope.item.terhadapmata == undefined || tahap == terhadap){
                //     window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran-sebelum?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY'), '_blank');
                // } else if($scope.item.terhadapmata != undefined || tahap != terhadap){
                //     window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY') +"&terhadap="+terhadap, '_blank');
                // }
            }

            $scope.CetakPertanggungjawaban = function(){

                if ($scope.item.tahunpertanggungjawaban == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanpertanggungjawaban == undefined){
                    toastr.warning('Bulan awal harus diisi', 'Informasi');
                    return
                }

                var tahunpertanggungjawaban = ""
                if ($scope.item.tahunpertanggungjawaban != undefined){
                    tahunpertanggungjawaban = moment($scope.item.tahunpertanggungjawaban).format('YYYY')
                }

                var bulanpertanggungjawaban = ""
                if ($scope.item.bulanpertanggungjawaban != undefined){
                    bulanpertanggungjawaban = moment($scope.item.bulanpertanggungjawaban).format('MM')
                }

                window.open(baseTransaksi + "report/get-cetak-pertanggungjawaban-bendahara?tahun="+tahunpertanggungjawaban+"&bulan="+bulanpertanggungjawaban, '_blank');
            }

            $scope.CetakBKU = function(){

                if ($scope.item.tahunbku == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanbku == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetak == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                var tahunbku = ""
                if ($scope.item.tahunbku != undefined){
                    tahunbku = moment($scope.item.tahunbku).format('YYYY')
                }

                var bulanbku = ""
                if ($scope.item.bulanbku != undefined){
                    bulanbku = moment($scope.item.bulanbku).format('MM')
                }

                var tglcetak = ""
                if ($scope.item.tglcetak != undefined){
                    tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD')
                }

                window.open(baseTransaksi + "report/get-cetak-bku?tahunbku=" + tahunbku + "&bulanbku=" + bulanbku + "&tglcetak=" + tglcetak, '_blank');
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