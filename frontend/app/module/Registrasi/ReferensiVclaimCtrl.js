define(['initialize', 'Configuration'], function (initialize, configuration) {
  'use strict';
  initialize.controller('ReferensiVclaimCtrl', ['$scope', '$state', 'MedifirstService',
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

          $scope.poli = {};

          $scope.clearPoli = function () {

              $scope.isRouteLoading = false;
              $scope.poli = {
                  poli : '',
              };
          };

          $scope.setting = {};

          $scope.clearSetting = function () {

              $scope.isRouteLoading = false;
              $scope.setting = {
                  kode : '',
              };
          };

          $scope.obat = {};
          $scope.obat.tglresep = moment($scope.now).format('YYYY-MM-DD')

          $scope.clearObat = function () {

              $scope.isRouteLoading = false;
              $scope.obat = {
                  kode : '',
                  tglresep : moment($scope.now).format('YYYY-MM-DD'),
                  filter : '',
              };
          };

          $scope.faskes = {};

          $scope.clearFaskes = function () {

              $scope.isRouteLoading = false;
              $scope.faskes = {
                  nama : '',
                  jenisfaskes : undefined,
              };
          };

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
              "id": 1, "nama": "Obat PRB"
          }, {
              "id": 2, "nama": "Obat Kronis Blm Stabil"
          }, {
              "id": 3, "nama": "Obat Kemoterapi"
          }
          ];

          $scope.listJenisFaskes = [{
            "id": 1, "nama": "Faskes 1"
          }, {
              "id": 2, "nama": " Faskes 2/RS"
          }
          ];

          medifirstService.get("bridging/bpjs/get-daftar-obat-dpho").then(function (e) {
                  document.getElementById("jsonKlaim").innerHTML = JSON.stringify(e.data, undefined, 4);
              }).then(function () {
                  $scope.isRouteLoading = false;
              });

          medifirstService.get("bridging/bpjs/get-daftar-spesialistik").then(function (e) {
                document.getElementById("jsonSpesialis").innerHTML = JSON.stringify(e.data, undefined, 4);
            }).then(function () {
                $scope.isRouteLoading = false;
            });
          
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

          $scope.findPoli = function (data) {
            $scope.isRouteLoading = true;
            var data = {
                poli: data.poli,
            }
            medifirstService.get("bridging/bpjs/get-poli-apotik-online?poli="
                + data.poli
            ).then(function (e) {
                document.getElementById("jsonPoli").innerHTML = JSON.stringify(e.data, undefined, 4);
            }).then(function () {
                $scope.isRouteLoading = false;
            });
          }

          $scope.findSetting = function (data) {
            $scope.isRouteLoading = true;
            var data = {
                kode: data.kode,
            }
            medifirstService.get("bridging/bpjs/get-setting-apotik-online?kode="
                + data.kode
            ).then(function (e) {
                document.getElementById("jsonSetting").innerHTML = JSON.stringify(e.data, undefined, 4);
            }).then(function () {
                $scope.isRouteLoading = false;
            });
          }

          $scope.findFaskes = function (data) {
            $scope.isRouteLoading = true;
            var data = {
                nama: data.nama,
                id: data.jenisfaskes.id,
            }
            medifirstService.get("bridging/bpjs/get-faskes-apotik-online?nama="
                + data.nama
                + "&id=" + data.id
            ).then(function (e) {
                document.getElementById("jsonFaskes").innerHTML = JSON.stringify(e.data, undefined, 4);
            }).then(function () {
                $scope.isRouteLoading = false;
            });
          }

          $scope.findObat = function (data) {
            $scope.isRouteLoading = true;
            var data = {
                kode: data.kode.id,
                tglresep: moment(data.tglresep).format('YYYY-MM-DD'),
                filter: data.filter,
            }
            medifirstService.get("bridging/bpjs/get-obat-apotik-online?kode="
                + data.kode
                + "&tglresep=" + data.tglresep
                + "&filter=" + data.filter
            ).then(function (e) {
                document.getElementById("jsonObat").innerHTML = JSON.stringify(e.data, undefined, 4);
            }).then(function () {
                $scope.isRouteLoading = false;
            });
          }
      }
  ]);
});