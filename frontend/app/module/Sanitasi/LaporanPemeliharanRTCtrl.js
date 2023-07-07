define([
    'initialize',
    'Configuration'
],
function (initialize, Configuration) {
    'use strict';
    initialize.controller('LaporanPemeliharanRTCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
    function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {
        $scope.item = {}
        $scope.isRouteLoading = false
        $scope.item.tglawal = new Date()
        $scope.item.tglakhir = new Date()

        loadData()
        function loadData(){
            $scope.isRouteLoading = true
            medifirstService.get('laporan/rumahtangga?tglawal=' + moment($scope.item.tglawal).format('YYYY-MM-DD') + '&tglakhir='+ moment($scope.item.tglakhir).format('YYYY-MM-DD')).then(function(data){
                var datas = data.data.data
                for (let i = 0; i < datas.length; i++) {
                    datas[i].no = i + 1
                }
                $scope.dataTindakan = new kendo.data.DataSource({
                    data: datas,
                })
            $scope.isRouteLoading = false
            })
        }

        $scope.CariData = function(){
        loadData()

        }
        $scope.columnTindakan = {
            toolbar: ["excel"],
            excel: {
                fileName: "Pemeliharaan RS Jiwa Grhasia" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
                    moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                allPages: true,
            },
            selectable: 'row',
            pageable: true,
            sortable: true,
            resizable: true,
            groupable: true,
            columns: [{
                    "field": "no",
                    "title": "NO",
                    "width": "110px",
                },
                {
                    "field": "startdate",
                    "title": "TANGGAL",
                    "width": "80px",
                },
                {
                    "field": "namaruangan",
                    "title": "UNIT KERJA",
                    "width": "110px",
                },
                {
                    "field": "reportdisplay",
                    "title": "JENIS BARANG",
                    "width": "200px",
                },
                {
                    "field": "merk",
                    "title": "NAMA BARANG",
                    "width": "200px",
                },
                {
                    "field": "rincianexecuteplanning_askep",
                    "title": "JENIS KERUSAKAN",
                    "width": "200px",
                },
                {
                    "field": "jumlah",
                    "title": "JUMLAH BARANG",
                    "width": "80px",
                },
                {
                    "field": "biaya",
                    "title": "BIAYA",
                    "width": "200px",
                },
                {
                    "field": "keterangan",
                    "title": "KETERANGAN",
                    "width": "200px",
                },
            ],
        };
    }])
});