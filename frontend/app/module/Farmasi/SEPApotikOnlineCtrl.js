define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('SEPApotikOnlineCtrl', ['$scope', '$state', 'MedifirstService',
        function ($scope, $state, medifirstService) {
            $scope.now = new Date();

            $scope.nav = function (state) {
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.sep = {};
            $scope.clearSEP = function () {

                $scope.isRouteLoading = false;
                $scope.sep = {
                    no : '',
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

            $scope.findSEP = function (data) {
                $scope.isRouteLoading = true;
                var data = {
                    no: data.no,
                }
                medifirstService.get("bridging/bpjs/get-sep-apotik-online?nosep="
                    + data.no
                ).then(function (e) {
                    document.getElementById("jsonSEP").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // END KLAIM

            // HISTROI
        }
    ]);
});