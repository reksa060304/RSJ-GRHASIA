define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanPerJenisAnggaranCtrl', ['$scope', '$state', 'MedifirstService', 
        function ($scope, $state, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.pptkaja = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.disterhadapdetail = FontFaceSetLoadEvent
            $scope.item.tglCetak1 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak2 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak3 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak4 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak5 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak6 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak7 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak8 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak9 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglCetak10 = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.jenisanggaranaja = false
            $scope.sumberdanaaja = false
            $scope.subkegiatanaja = false
            $scope.rbadetailaja = false
            $scope.pendapatanperubahanaja = false
            $scope.totalanggaranaja = false
            $scope.spjmonevaja = false
            $scope.konsolidasiaja = false
            $scope.jadwalaja = false
            $scope.cetakaja = false

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listJenisPerubahan = [
                { id: 1, jenisperubahan: "Perubahan" },
                { id: 2, jenisperubahan: "Non Perubahan" },
            ];

            $scope.listJenisRekening = [
                { id: 1, jenisrekening: "Tampilkan Rek RBA" },
                { id: 2, jenisrekening: "Tampilkan Rek Permen"}
            ];

            if($state.params.parameter == '99999'){
                $scope.sumberdanaaja = true
            } else if($state.params.parameter == '88888'){
                $scope.subkegiatanaja = true
            } else if($state.params.parameter == '77777'){
                $scope.rbadetailaja = true
            } else if($state.params.parameter == '66666'){
                $scope.pendapatanperubahanaja = true
            } else if($state.params.parameter == '55555'){
                $scope.totalanggaranaja = true
            } else if($state.params.parameter == '44444'){
                $scope.spjmonevaja = true
            } else if($state.params.parameter == '33333'){
                $scope.konsolidasiaja = true
            } else if($state.params.parameter == '22222'){
                $scope.jadwalaja = true
            } else if($state.params.parameter == '11111'){
                $scope.cetakaja = true
            } else if($state.params.parameter == '00000'){
                $scope.jenisanggaranaja = true
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

            $scope.changeTahap = function () {
                medifirstService.get("perencanaan/get-detail-sub-kegiatan?kegiatan="+$scope.item.kegiatanjadwal.id+"&tahap="+$scope.item.tahapjadwal.id+"&tahun="+moment($scope.item.tahunjadwal).format('YYYY')).then(function (e) {
                    $scope.listSubKegiatan = e.data.data
                });
            }

            $scope.changeKegiatanMonev = function () {
                medifirstService.get("perencanaan/get-detail-sub-kegiatan?kegiatan="+$scope.item.kegiatanmonev.id+"&tahap="+$scope.item.tahapmonev.id+"&tahun="+moment($scope.item.tahunmonev).format('YYYY')).then(function (e) {
                    $scope.listSubKegiatan = e.data.data
                });
            }

            $scope.CetakMonev = function(){

                if ($scope.item.tahunmonev == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.jenisrekeningmonev == undefined){
                    toastr.warning('Jenis Rekening harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.kegiatanmonev == undefined){
                    toastr.warning('Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                if ($scope.item.subkegiatanmonev == undefined){
                    toastr.warning('Sub Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                var tahun = ""
                if ($scope.item.tahunmonev != undefined){
                    tahun = moment($scope.item.tahunmonev).format('YYYY')
                }
                
                if($scope.item.jenisrekeningmonev.id == 2){
                    window.open(baseTransaksi + "report/get-cetak-spj-dan-monev?tahun="+tahun+"&jenisrekening="+$scope.item.jenisrekeningmonev+"&subkegiatan="+$scope.item.kegiatanmonev.id+"&subsubkegiatan="+$scope.item.subkegiatanmonev.id, '_blank');
                } else if($scope.item.jenisrekeningmonev.id == 1){
                    window.open(baseTransaksi + "report/get-cetak-spj-dan-monev-rba?tahun="+tahun+"&jenisrekening="+$scope.item.jenisrekeningmonev+"&subkegiatan="+$scope.item.kegiatanmonev.id+"&subsubkegiatan="+$scope.item.subkegiatanmonev.id, '_blank');
                }
                
                
            }

            $scope.CetakPermen = function(){
                var tahap = ""
                if ($scope.item.tahappermen != undefined) {
                    tahap = $scope.item.tahappermen.id
                }

                var tahun = ""
                if ($scope.item.tahunpermen != undefined) {
                    tahun = $scope.item.tahunpermen
                }

                var subkegiatan = ""
                if ($scope.item.kegiatanpermen != undefined) {
                    subkegiatan = $scope.item.kegiatanpermen.id
                }

                window.open(baseTransaksi + "report/get-cetak-konsolidasi-per-permen?tahap="+tahap+"&subkegiatan="+subkegiatan+"&tahun="+moment(tahun).format('YYYY'), '_blank');
                
            }

            $scope.CetakJadwal = function(){

                var tahap = ""
                if ($scope.item.tahapjadwal != undefined) {
                    tahap = $scope.item.tahapjadwal.id
                }

                var tahun = ""
                if ($scope.item.tahunjadwal != undefined) {
                    tahun = $scope.item.tahunjadwal
                }

                var subkegiatan = ""
                if ($scope.item.kegiatanjadwal != undefined) {
                    subkegiatan = $scope.item.kegiatanjadwal.id
                }

                var subsubkegiatan = ""
                if ($scope.item.subkegiatanjadwal != undefined) {
                    subsubkegiatan = $scope.item.subkegiatanjadwal.id
                }

                window.open(baseTransaksi + "report/get-cetak-angkas-jadwal?tahap="+tahap+"&subkegiatan="+subkegiatan+"&subsubkegiatan="+subsubkegiatan+"&tahun="+moment(tahun).format('YYYY'), '_blank');
                
            }

            $scope.CetakKas = function(){

                var tahap = ""
                if ($scope.item.tahapkas != undefined) {
                    tahap = $scope.item.tahapkas.id
                }

                var tahun = ""
                if ($scope.item.tahunkas != undefined) {
                    tahun = $scope.item.tahunkas
                }

                window.open(baseTransaksi + "report/get-cetak-kas?tahap="+tahap+"&tahun="+moment(tahun).format('YYYY'), '_blank');
                
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
                    window.open(baseTransaksi + "report/get-cetak-per-jenis-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahun).format('YYYY')+"&tglcetak="+moment($scope.item.tglCetak1).format('YYYY-MM-DD HH:mm'), '_blank');
                } else if($scope.item.terhadap != undefined){
                    window.open(baseTransaksi + "report/get-cetak-per-jenis-anggaran-sebelum-sesudah?tahap="+tahap+"&tahun="+moment($scope.item.tahun).format('YYYY') +"&terhadap="+terhadap+"&tglcetak="+moment($scope.item.tglCetak1).format('YYYY-MM-DD HH:mm'), '_blank');
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
                    window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran-sebelum?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY')+"&tglcetak="+moment($scope.item.tglCetak2).format('YYYY-MM-DD HH:mm'), '_blank');
                } else if($scope.item.terhadapmata != undefined || tahap != terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-mata-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunmata).format('YYYY') +"&terhadap="+terhadap+"&tglcetak="+moment($scope.item.tglCetak2).format('YYYY-MM-DD HH:mm'), '_blank');
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
                    window.open(baseTransaksi + "report/get-cetak-rekap-total-anggaran?tahap="+tahap+"&tahun="+moment($scope.item.tahunrekap).format('YYYY')+"&tglcetak="+moment($scope.item.tglCetak6).format('YYYY-MM-DD HH:mm'), '_blank');
                } else if($scope.item.terhadaprekap != undefined || tahap != terhadap){
                    window.open(baseTransaksi + "report/get-cetak-rekap-total-anggaran-sebelum-sesudah?tahap="+tahap+"&tahun="+moment($scope.item.tahunrekap).format('YYYY') +"&terhadap="+terhadap+"&tglcetak="+moment($scope.item.tglCetak6).format('YYYY-MM-DD HH:mm'), '_blank');
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
                    window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran-sebelum?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY')+"&tglcetak="+moment($scope.item.tglCetak3).format('YYYY-MM-DD HH:mm'), '_blank');
                } else if ($scope.item.terhadapSumberDana != undefined || tahap != terhadap) {
                    window.open(baseTransaksi + "report/get-cetak-rekap-SumberDana-anggaran?tahap=" + tahap + "&tahun=" + moment($scope.item.tahunSumberDana).format('YYYY') + "&terhadap=" + terhadap+"&tglcetak="+moment($scope.item.tglCetak3).format('YYYY-MM-DD HH:mm'), '_blank');
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
                    window.open(baseTransaksi + "report/get-cetak-rba-detail-sebelum-sesudah?tahun=" +moment(tahun).format('YYYY')+ "&subsubkegiatan=" + subsubkegiatan + "&tahap="+tahap + "&terhadap="+terhadap+"&tglcetak="+moment($scope.item.tglCetak4).format('YYYY-MM-DD HH:mm'), '_blank');
                } else if($scope.item.terhadapdetail == undefined){
                    window.open(baseTransaksi + "report/get-cetak-rba-detail?tahun=" +moment(tahun).format('YYYY')+ "&subsubkegiatan=" + subsubkegiatan + "&tahap="+tahap+"&tglcetak="+moment($scope.item.tglCetak4).format('YYYY-MM-DD HH:mm'), '_blank');
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

                window.open(baseTransaksi + "report/get-cetak-pendapatan-perubahan?tahun="+moment(tahun).format('YYYY')+"&perubahan="+perubahan+"&tglcetak="+moment($scope.item.tglCetak5).format('YYYY-MM-DD HH:mm'), '_blank');
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