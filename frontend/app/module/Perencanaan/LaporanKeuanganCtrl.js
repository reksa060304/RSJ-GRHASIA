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

            $scope.CetakPajak = function(){

                if ($scope.item.tahunpajak == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanpajak == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglpajak == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.asalprodukpajak == undefined){
                    toastr.warning('Sumber dana harus diisi', 'Informasi');
                    return
                }

                var tahunpajak = ""
                if ($scope.item.tahunpajak != undefined){
                    tahunpajak = moment($scope.item.tahunpajak).format('YYYY')
                }

                var bulanpajak = ""
                if ($scope.item.bulanpajak != undefined){
                    bulanpajak = moment($scope.item.bulanpajak).format('MM')
                }

                var tglcepajak = ""
                if ($scope.item.tglpajak != undefined){
                    tglcepajak = moment($scope.item.tglpajak).format('YYYY-MM-DD')
                }

                var sumberdanapajak = ""
                if ($scope.item.asalprodukpajak != undefined){
                    sumberdanapajak = $scope.item.asalprodukpajak.id
                }

                window.open(baseTransaksi + "report/get-cetak-buku-pajak?tahun=" + tahunpajak + "&bulan=" + bulanpajak + "&tglcetak=" + tglcepajak + "&sumberdana=" + sumberdanapajak, '_blank');
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

                if ($scope.item.asalprodukkas == undefined){
                    toastr.warning('Sumber dana harus diisi', 'Informasi');
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

                var sumberdanakas = ""
                if ($scope.item.asalprodukkas != undefined){
                    sumberdanakas = $scope.item.asalprodukkas.id
                }

                window.open(baseTransaksi + "report/get-register-penutupan-kas?tahun=" + tahunbku + "&bulan=" + bulanbku + "&tglcetak=" + tglcetak + "&sumberdana=" + sumberdanakas, '_blank');
            }

            $scope.CetakSP = function(){

                if ($scope.item.tahunsp == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulansp == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetaksp == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                var tahunsp = ""
                if ($scope.item.tahunsp != undefined){
                    tahunsp = moment($scope.item.tahunsp).format('YYYY')
                }

                var bulansp = ""
                if ($scope.item.bulansp != undefined){
                    bulansp = moment($scope.item.bulansp).format('MM')
                }

                var tglcetaksp = ""
                if ($scope.item.tglcetaksp != undefined){
                    tglcetaksp = moment($scope.item.tglcetaksp).format('YYYY-MM-DD')
                }


                window.open(baseTransaksi + "report/get-cetak-sp3bp?tahun=" + tahunsp + "&bulan=" + bulansp + "&tglcetak=" + tglcetaksp, '_blank');
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

            $scope.CetakFungsional = function(){

                var tglcetakfungsional = ""
                if ($scope.item.tglcetakfungsional != undefined){
                    tglcetakfungsional = moment($scope.item.tglcetakfungsional).format('YYYY-MM-DD')
                }

                var tglbkufungsional = ""
                if ($scope.item.tglbkufungsional != undefined){
                    tglbkufungsional = moment($scope.item.tglbkufungsional).format('YYYY-MM-DD')
                }

                window.open(baseTransaksi + "report/get-cetak-fungsional?tglcetak=" + tglcetakfungsional + "&tglbku=" + tglbkufungsional, '_blank');
            }

            $scope.CetakRO = function(){

                if ($scope.item.tahunro == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanro == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetakro == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.subkegiatanro == undefined){
                    toastr.warning('Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.subsubkegiatanro == undefined){
                    toastr.warning('Sub Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.mataanggaranro == undefined){
                    toastr.warning('Mata Anggaran harus diisi', 'Informasi');
                    return
                }

                var tahunro = ""
                if ($scope.item.tahunro != undefined){
                    tahunro = moment($scope.item.tahunro).format('YYYY')
                }

                var bulanro = ""
                if ($scope.item.bulanro != undefined){
                    bulanro = moment($scope.item.bulanro).format('MM')
                }

                var tglcetakro = ""
                if ($scope.item.tglcetakro != undefined){
                    tglcetakro = moment($scope.item.tglcetakro).format('YYYY-MM-DD')
                }

                var idsubsubkegiatan = ""
                if ($scope.item.subsubkegiatanro != undefined){
                    idsubsubkegiatan = $scope.item.subsubkegiatanro.idsubsubkegiatan
                }

                var idmataanggaran = ""
                if ($scope.item.mataanggaranro != undefined){
                    idmataanggaran = $scope.item.mataanggaranro.id
                }

                window.open(baseTransaksi + "report/get-cetak-ro?tahun="+tahunro+"&bulan="+bulanro+"&tglcetak="+tglcetakro+"&idsubsubkegiatan="+idsubsubkegiatan+"&idmataanggaran="+idmataanggaran, '_blank');
            }

            $scope.CetakRK = function(){

                if ($scope.item.tahunrk == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.bulanrk == undefined){
                    toastr.warning('Bulan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.tglcetakrk == undefined){
                    toastr.warning('Tgl cetak harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.subkegiatanrk == undefined){
                    toastr.warning('Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.subsubkegiatanrk == undefined){
                    toastr.warning('Sub Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                var tahunrk = ""
                if ($scope.item.tahunrk != undefined){
                    tahunrk = moment($scope.item.tahunrk).format('YYYY')
                }

                var bulanrk = ""
                if ($scope.item.bulanrk != undefined){
                    bulanrk = moment($scope.item.bulanrk).format('MM')
                }

                var tglcetakrk = ""
                if ($scope.item.tglcetakrk != undefined){
                    tglcetakrk = moment($scope.item.tglcetakrk).format('YYYY-MM-DD')
                }

                var idsubsubkegiatanrk = ""
                if ($scope.item.subsubkegiatanrk != undefined){
                    idsubsubkegiatanrk = $scope.item.subsubkegiatanrk.idsubsubkegiatan
                }

                window.open(baseTransaksi + "report/get-cetak-rk?tahun="+tahunrk+"&bulan="+bulanrk+"&tglcetak="+tglcetakrk+"&idsubsubkegiatan="+idsubsubkegiatanrk, '_blank');
            }

            $scope.$watch('item.subkegiatanro', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo?tahunawal="+moment($scope.item.tahunro).format('YYYY')+"&tahap="+e.data.setting[0].objecttahapaktivfk+"&subkegiatan="+$scope.item.subkegiatanro.id).then(function (e) {
                            $scope.listSubSubKegiatanRO = e.data.kegiatansubsub
                        });
                    })
                }
            });

            $scope.$watch('item.subkegiatanrk', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo?tahunawal="+moment($scope.item.tahunrk).format('YYYY')+"&tahap="+e.data.setting[0].objecttahapaktivfk+"&subkegiatan="+$scope.item.subkegiatanrk.id).then(function (e) {
                            $scope.listSubSubKegiatanRK = e.data.kegiatansubsub
                        });
                    })
                }
            });

            $scope.$watch('item.subsubkegiatanro', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.item.tahunro).format('YYYY')+"&idsubsub="+$scope.item.subsubkegiatanro.id).then(function (e) {
                        $scope.listMataAnggaranRO = e.data.mataanggarancombo
                    })
                }
            });

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