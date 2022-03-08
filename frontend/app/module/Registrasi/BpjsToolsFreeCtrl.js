define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BpjsToolsFreeCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService) {
            $scope.isRouteLoading = true;
            $scope.clear = function () {
                $scope.item = {};
                $scope.item.identitas = $scope.dataCheckbox[0];
                $scope.isRouteLoading = false;
            };
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

            $scope.dataCheckbox = [
                { "id": 'GET', "name": "GET" },
                { "id": 'POST', "name": "POST" },
                { "id": 'PUT', "name": "PUT" },
                { "id": 'DELETE', "name": "DELETE" },

            ];
            $scope.clear();
            $scope.findData = function () {
                var data = null
                if ($scope.item.method.id == 'GET') {
                    data = $scope.item.data = null
                } else {
                    data = JSON.parse($scope.item.data)
                }
                let json = {
                    "url": $scope.item.url,
                    "method": $scope.item.method.id,
                    "data": data
                }
                $scope.isRouteLoading = true
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

        }
    ]);
});