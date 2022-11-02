define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanAkuntansiCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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

            $scope.listTglBKU = [
                { id: 1, tanggal: 1 },
                { id: 2, tanggal: 2},
                { id: 3, tanggal: 3 },
                { id: 4, tanggal: 4},
                { id: 5, tanggal: 5 },
                { id: 6, tanggal: 6},
                { id: 7, tanggal: 7 },
                { id: 8, tanggal: 8},
                { id: 9, tanggal:  9},
                { id: 10, tanggal: 10},
                { id: 11, tanggal: 11 },
                { id: 12, tanggal: 12},
                { id: 13, tanggal: 13 },
                { id: 14, tanggal: 14},
                { id: 15, tanggal: 15 },
                { id: 16, tanggal: 16},
                { id: 17, tanggal: 17 },
                { id: 18, tanggal: 18},
                { id: 19, tanggal: 19 },
                { id: 20, tanggal: 20},
                { id: 21, tanggal: 21 },
                { id: 22, tanggal: 22},
                { id: 23, tanggal: 23 },
                { id: 24, tanggal: 24},
                { id: 25, tanggal: 25 },
                { id: 26, tanggal: 26},
                { id: 27, tanggal: 27 },
                { id: 28, tanggal: 28},
                { id: 29, tanggal: 29 },
                { id: 30, tanggal: 30},
                { id: 31, tanggal: 31 },
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

            $scope.CetakLOS = function(){

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

            $scope.CetakLO = function(){

                if ($scope.item.tahun == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                var tahun = ""
                if ($scope.item.tahun != undefined){
                    tahun = moment($scope.item.tahun).format('YYYY')
                }
                
                window.open(baseTransaksi + "report/get-cetak-lo?tahun="+tahun, '_blank');
                
            }

            $scope.CetakNeraca = function(){

                if ($scope.item.tahunneraca == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                var tahun = ""
                if ($scope.item.tahunneraca != undefined){
                    tahun = moment($scope.item.tahunneraca).format('YYYY')
                }
                
                window.open(baseTransaksi + "report/get-cetak-neraca?tahun="+tahun, '_blank');
                
            }

            $scope.CetakLRA = function(){

                if ($scope.item.tahunlra == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                var tahun = ""
                if ($scope.item.tahunlra != undefined){
                    tahun = moment($scope.item.tahunlra).format('YYYY')
                }
                
                window.open(baseTransaksi + "report/get-cetak-lra?tahun="+tahun, '_blank');
                
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

            $scope.CetakBKUReal = function(){

                if ($scope.item.tahuncetakbku == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulancetakbku == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetakbku == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                var tahunbku = ""
                if ($scope.item.tahuncetakbku != undefined){
                    tahunbku = moment($scope.item.tahuncetakbku).format('YYYY')
                }

                var bulanbku = ""
                if ($scope.item.bulancetakbku != undefined){
                    bulanbku = moment($scope.item.bulancetakbku).format('MM')
                }

                var tglcetak = ""
                if ($scope.item.tglcetakbku != undefined){
                    tglcetak = moment($scope.item.tglcetakbku).format('YYYY-MM-DD')
                }

                window.open(baseTransaksi + "report/get-cetak-bku-real?tahunbku=" + tahunbku + "&bulanbku=" + bulanbku + "&tglcetak=" + tglcetak, '_blank');
            }

            $scope.CetakKas = function(){

                if ($scope.item.tahunkas == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulankas == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglkas == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                var tahunbku = ""
                if ($scope.item.tahunkas != undefined){
                    tahunbku = moment($scope.item.tahunkas).format('YYYY')
                }

                var bulanbku = ""
                if ($scope.item.bulankas != undefined){
                    bulanbku = moment($scope.item.bulankas).format('MM')
                }

                var tglcetak = ""
                if ($scope.item.tglkas != undefined){
                    tglcetak = moment($scope.item.tglkas).format('YYYY-MM-DD')
                }

                window.open(baseTransaksi + "report/get-register-penutupan-kas?tahun=" + tahunbku + "&bulan=" + bulanbku + "&tglcetak=" + tglcetak, '_blank');
            }

            $scope.CetakBukuPanjar = function(){

                if ($scope.item.tahunpanjar == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanpanjar == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetakpanjar == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                var tahunpanjar = ""
                if ($scope.item.tahunpanjar != undefined){
                    tahunpanjar = moment($scope.item.tahunpanjar).format('YYYY')
                }

                var bulanpanjar = ""
                if ($scope.item.bulanpanjar != undefined){
                    bulanpanjar = moment($scope.item.bulanpanjar).format('MM')
                }

                var tglcetakpanjar = ""
                if ($scope.item.tglcetakpanjar != undefined){
                    tglcetakpanjar = moment($scope.item.tglcetakpanjar).format('YYYY-MM-DD')
                }

                window.open(baseTransaksi + "report/get-cetak-buku-panjar?tahunpanjar=" + tahunpanjar + "&bulanpanjar=" + bulanpanjar + "&tglcetakpanjar=" + tglcetakpanjar, '_blank');
            }

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listTahap = e.data.tahap
                $scope.listKegiatan = e.data.kegiatancombo
            });

            $scope.changeKegiatan = function () {
                medifirstService.get("perencanaan/get-detail-sub-kegiatan?kegiatan="+$scope.item.kegiatandetail.id+"&tahap="+$scope.item.tahapdetail.id+"&tahun="+moment($scope.item.tahundetail).format('YYYY')).then(function (e) {
                    $scope.listSubKegiatan = e.data.data
                });
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