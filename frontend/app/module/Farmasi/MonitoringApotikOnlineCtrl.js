define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MonitoringApotikOnlineCtrl', ['$scope', '$state', 'MedifirstService',
        function ($scope, $state, medifirstService) {
            $scope.now = new Date();

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.nav = function (state) {
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.histori = {}
            $scope.kunjungan = {};
            $scope.klaim = {};
            $scope.raharja = {}
            $scope.clear = function () {

                $scope.isRouteLoading = false;
                $scope.klaim = {
                    bulan : moment($scope.now).format('MM'),
				    tahun : moment($scope.now).format('YYYY')
                };
            };
            $scope.isShowPembuatanSep = false;
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            $scope.showApproval = function () {
                $scope.isShowApproval = !$scope.isShowApproval;
            }
            $scope.showTglPulang = function () {
                $scope.isShowTglPulang = !$scope.isShowTglPulang;
            }
            $scope.showIntegrasi = function () {
                $scope.isShowIntegrasi = !$scope.isShowIntegrasi;
            }
            $scope.clear();

            $scope.listStatusKlaim = [{
                "id": 0, "nama": "Belum Verifikasi"
            }, {
                "id": 1, "nama": "Sudah Verifikasi"
            }];

            $scope.listJenisObat = [{
                "id": 0, "nama": "Semua"
            }, {
                "id": 1, "nama": "Obat PRB"
            }, {
                "id": 2, "nama": "Obat Kronis Blm Stabil"
            }, {
                "id": 3, "nama": "Obat Kemoterapi"
            }
            ];

            $scope.findKlaim = function (data) {
                $scope.isRouteLoading = true;
                var data = {
                    status: data.statusKlaim.id,
                    jenisobat: data.jenisobat.id,
                    bulan: parseInt(new moment(data.bulan).format('MM')),
                    tahun: new moment(data.tahun).format('YYYY')
                }
                medifirstService.get("bridging/bpjs/get-monitoring-klaim-apotik-online?bulan="
                    + data.bulan
                    + "&tahun="
                    + data.tahun
                    + "&status="
                    + data.status
                    + "&jenisobat="
                    + data.jenisobat
                ).then(function (e) {
                    document.getElementById("jsonKlaim").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // END KLAIM

            // HISTROI
            $scope.findHistori = function (data) {
                $scope.isRouteLoading = true;

                medifirstService.get("bridging/bpjs/get-monitoring-historipelayanan-peserta?noKartu="
                    + data.noKartu
                    + "&tglMulai="
                    + moment(data.tglAwal).format('YYYY-MMDD')
                    + "&tglAkhir="
                    + moment(data.tglAkhir).format('YYYY-MMDD')
                ).then(function (e) {
                    document.getElementById("jsonHistori").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // RAHARJA

            // HISTROI
            $scope.findRaharja = function (data) {
                $scope.isRouteLoading = true;

                medifirstService.get("bridging/bpjs/get-monitoring-klaim-jasaraharja?tglMulai="
                    + moment(data.tglAwal).format('YYYY-MMDD')
                    + "&tglAkhir="
                    + moment(data.tglAkhir).format('YYYY-MMDD')
                ).then(function (e) {
                    document.getElementById("jsonRaharja").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
        }
    ]);
});