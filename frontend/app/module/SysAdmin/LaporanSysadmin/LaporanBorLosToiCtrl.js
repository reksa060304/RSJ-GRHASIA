define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanBorLosToiCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            $scope.item = {}
            $scope.now = new Date();
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD')
            FormLoad();
            LoadCombo()
            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganinap;
                    $scope.listRuanganAsal = dat.data.ruangan;
                    $scope.listKelas = dat.data.kelas;
                });
            }
            function FormLoad() {
                $scope.isRouteLoading = false;
                // $scope.now = new Date();
                // $scope.date = new Date();
                $scope.dataSelected = {};
                // $scope.item = {};
                loadData();
            }
            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }
            $scope.SearchData = function(){
                FormLoad();
            }
            function loadData() {
                $scope.isRouteLoading = true
                var ruangan = "";
                if($scope.item.ruangan !=undefined){
                    ruangan = "&ruangan=" + $scope.item.ruangan.id
                }
                medifirstService.get('pdti/dashboard-ranap?tglawal=' + moment($scope.item.tglawal).format('YYYY-MM-DD') + '&tglakhir=' + moment($scope.item.tglakhir).format('YYYY-MM-DD')+ruangan).then(function (data) {
                var datas = data.data[0]
                $scope.item.ttlTempatTidur = datas.jumlahtt
                $scope.item.bortt = datas.bor.toFixed(2) + "%"
                $scope.item.los = datas.alos.toFixed(2) + " hari/pasien";
                $scope.item.losaja = datas.los + " hari";
                $scope.item.toi = datas.toi.toFixed(2) + " hari";
                $scope.item.bto = datas.bto.toFixed(2) + " kali";
                $scope.item.ndr = datas.ndr.toFixed(2) + " permil";
                $scope.item.gdr = datas.gdr.toFixed(2) + " permil";
                $scope.isRouteLoading = false
                })
            }

            

            $scope.SearchData = function () {
                loadData()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }
            
            
            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});