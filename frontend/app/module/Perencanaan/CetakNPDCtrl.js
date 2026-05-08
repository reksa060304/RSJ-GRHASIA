define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('CetakNPDCtrl', ['$scope', '$state', 'MedifirstService', '$timeout',
        function ($scope, $state, medifirstService, $timeout) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $timeout(function() {
                $scope.isRouteLoading = false;
            }, 1000);
            console.log('CetakNPDCtrl loaded');
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.tahun = $scope.now;
            $scope.item.tglCetak = $scope.now;
            $scope.item.tglLunas = $scope.now;
            $scope.item.tglPertanggungjawaban = $scope.now;
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listJenisRekening = [
                { id: 1, jenisrekening: "Tampilkan Rek RBA" },
                { id: 2, jenisrekening: "Tampilkan Rek Permen"}
            ];

            $scope.listBulan = [
                { id: 1, nama: "Januari" },
                { id: 2, nama: "Februari" },
                { id: 3, nama: "Maret" },
                { id: 4, nama: "April" },
                { id: 5, nama: "Mei" },
                { id: 6, nama: "Juni" },
                { id: 7, nama: "Juli" },
                { id: 8, nama: "Agustus" },
                { id: 9, nama: "September" },
                { id: 10, nama: "Oktober" },
                { id: 11, nama: "November" },
                { id: 12, nama: "Desember" }
            ];

            // Set default bulan ke bulan sekarang
            var bulanSekarang = $scope.now.getMonth() + 1; // getMonth() = 0-based
            $scope.item.bulan = $scope.listBulan.find(function(b) { return b.id === bulanSekarang; });

            loadDataCombo()
            function loadDataCombo() {
                var idpegawai = medifirstService.getPegawaiLogin().id;
                medifirstService.get("perencanaan/get-data-combo?&idpegawai=" + idpegawai).then(function (e) {
                    $scope.listPegawai = e.data.pegawai
                    medifirstService.get("anggaran/get-combo-anggaran").then(function (res) {
                        $scope.listTahap = res.data.tahap
                        $scope.listKegiatanV2 = res.data.divsubsubKg
                        $scope.listAsalProduk = res.data.asalproduk
                        $scope.isRouteLoading = false;
                    }, function (error) {
                        $scope.isRouteLoading = false;
                    });
                }, function (error) {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.changeSubKegiatan = function () {
                if ($scope.item.subkegiatan == undefined) return;
                var tahapId = ""
                if ($scope.item.tahap != undefined) {
                    tahapId = $scope.item.tahap.id
                }
                medifirstService.get("anggaran/get-subsubkegiatan" 
                    + "?subkegiatan=" + $scope.item.subkegiatan.id 
                    + "&tahap=" + tahapId 
                    + "&tahun=" + moment($scope.item.tahun).format('YYYY') 
                    ).then(function (e) {
                    $scope.listSubSubKegiatan = e.data
                });
            }

            $scope.CetakNPD = function(){
                if ($scope.item.tahun == undefined){
                    toastr.warning('Tahun harus diisi', 'Informasi');
                    return
                }
                if ($scope.item.tahap == undefined){
                    toastr.warning('Tahap dipilih dulu', 'Informasi');
                    return
                }
                if ($scope.item.jenisrekening == undefined){
                    toastr.warning('Jenis Rekening harus diisi', 'Informasi');
                    return
                }
                if ($scope.item.subkegiatan == undefined){
                    toastr.warning('Sub Kegiatan harus diisi', 'Informasi');
                    return
                }
                if ($scope.item.subsubkegiatan == undefined){
                    toastr.warning('Sub Sub Kegiatan harus diisi', 'Informasi');
                    return
                }

                var tahun = moment($scope.item.tahun).format('YYYY')
                var asalproduk = ""
                if($scope.item.asalproduk !== undefined && $scope.item.asalproduk !== null){
                    asalproduk = "&asalproduk=" + $scope.item.asalproduk.id
                }
                
                var tahap = "&tahap=" + $scope.item.tahap.id
                var bulan = ""
                if ($scope.item.bulan != undefined){
                    bulan = "&bulan=" + $scope.item.bulan.id
                }

                var tglCetak = "&tglcetak=" + moment($scope.item.tglCetak).format('YYYY-MM-DD')
                var tglLunas = "&tgllunas=" + moment($scope.item.tglLunas).format('YYYY-MM-DD')
                var tglPJ = "&tglpj=" + moment($scope.item.tglPertanggungjawaban).format('YYYY-MM-DD')
                var idpelaksana = ""
                if ($scope.item.pelaksana != undefined) {
                    idpelaksana = "&idpelaksana=" + $scope.item.pelaksana.id
                }

                window.open(baseTransaksi + "report/get-cetak-npd?tahun="+tahun+"&jenisrekening="+$scope.item.jenisrekening.id+"&subkegiatan="+$scope.item.subkegiatan.id+"&subsubkegiatan="+$scope.item.subsubkegiatan.id+tahap+asalproduk+bulan+tglCetak+tglLunas+tglPJ+idpelaksana, '_blank');
            }
        }
    ]);
});
