define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MenuCPPTRawatInapCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'MedifirstService', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, $state, medifirstService, cacheHelper) {
            // $scope.title = "Psikologi";
            // debugger;

            // $scope.activeMenuCPPTRawatInap = 'RekamMedis.AsesmenMedis.MenuCPPTRawatInap.CpptNew';
            $scope.activeMenuCPPTRawatInap = $state.current.name;

            $scope.dataVOloaded = true;
            $rootScope.showMenu = true;
            $rootScope.showMenuDetail = false;

            $scope.cc = {}
            var nomorEMR = '-'
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
            }

            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }

            $rootScope.showCppt2 = false;
            $rootScope.showCppt3 = false;
            $rootScope.showCppt4 = false;
            $rootScope.showCppt5 = false;
            $rootScope.showCppt6 = false;
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=444", true).then(function (dat) {
                if(dat.data.data.length > 0){
                    $rootScope.showCppt2 = true;
                }
            })
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=445", true).then(function (dat) {
                if(dat.data.data.length > 0){
                    $rootScope.showCppt3 = true;
                }
            })
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=446", true).then(function (dat) {
                if(dat.data.data.length > 0){
                    $rootScope.showCppt4 = true;
                }
            })
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=447", true).then(function (dat) {
                if(dat.data.data.length > 0){
                    $rootScope.showCppt5 = true;
                }
            })
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=448", true).then(function (dat) {
                if(dat.data.data.length > 0){
                    $rootScope.showCppt6 = true;
                }
            })
            
            $scope.nav = function (state) {
                $scope.activeMenuCPPTRawatInap = state;
                localStorage.setItem('activeMenuCPPTRawatInap', state);
                $state.go(state, $state.params);
            }
        }
    ]);
});