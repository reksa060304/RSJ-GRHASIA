define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RekapPanjarDetailCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};

            loadDataCombo()

            // load data panjar
            function loadData(){

                let kegiatan = ''
                if($scope.item.kegiatansubsubpanjar !== undefined && $scope.item.kegiatansubsubpanjar !== null){
                    kegiatan = '?subsubkegiatan=' + $scope.item.kegiatansubsubpanjar.kodesubsubkegiatan
                }

                let mataanggaran = ''
                if($scope.item.mataanggaran !== undefined && $scope.item.mataanggaran !== null){
                    mataanggaran = '&mataanggaran=' + $scope.item.mataanggaran.kodemataanggaran
                }

                let asalproduk = ''
                if($scope.item.asalproduk !== undefined && $scope.item.asalproduk !== null){
                    asalproduk = '&asalproduk=' + $scope.item.asalproduk.id
                }

                let cari = ''
                if($scope.item.caripanjar !== undefined && $scope.item.caripanjar !== null){
                    cari = '&cari=' + $scope.item.caripanjar
                }

                medifirstService.get("perencanaan/get-rekap-panjar-detail" 
                    + kegiatan
                    + mataanggaran
                    + asalproduk
                    + cari)
                    .then(function (e) {
                        
                        let resdata = e.data

                        $scope.dataSourcePanjar = new kendo.data.DataSource({
                            data: resdata,
                            pageSize: 20,
                            total: resdata.length,
                        })
                    });

            }

            // load data combo
            function loadDataCombo(){

                let pegawai = medifirstService.getPegawaiLogin();
                let idpegawai = pegawai.id

                medifirstService.get("perencanaan/get-data-combo?&idpegawai=" + idpegawai).then(function (e) {
                    $scope.listAsalProduk = e.data.asalproduk
                    $scope.listSubSubKegiatanPanjar = e.data.kegiatansubsubspj
                    $scope.listMataAnggaran = e.data.mataanggarancombodiv

                    loadData()

                });

            }


            $scope.CariPanjar = function(){
                loadData()
            }

            $scope.columnPanjar = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanRekapDetailSPJ.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1", "A2:J2"];
                    sheet.name = "SPJ";
                
                    var myHeaders = [{
                        value: "LAPORAN REKAP DETAIL PANJAR",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    
                    var selectedSubKegiatan = $scope.item.kegiatansubsubpanjar ? $scope.item.kegiatansubsubpanjar.keterangansubsubkegiatan || "" : "";
                    var kodesubsubkegiatan = $scope.item.kegiatansubsubpanjar.kodesubsubkegiatan || "";

                    function extractNamaKegiatan(kegiatan) {
                        var parts = kegiatan.split('-');
                        if (parts.length > 1) {
                            var nama = parts.slice(-1).join(' ').trim();
                            return nama ? nama : "Sub Kegiatan tidak tersedia";
                        }
                        return "Sub Kegiatan tidak tersedia";
                    }
                
                    var namaKegiatan = extractNamaKegiatan(selectedSubKegiatan);
                
                    var subKegiatanValue = "Rekening: " + kodesubsubkegiatan + " | Sub Kegiatan: " + namaKegiatan;
                
                    var subKegiatanHeader = [{
                        value: subKegiatanValue,
                        fontSize: 16,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    sheet.rows.splice(1, 0, { cells: subKegiatanHeader, type: "header", height: 50 });
                },                
                   
                selectable: 'row',
                scrollable: true,
                pageable: true,
                columns: [
                
                    {
                        "field": "nopanjar",
                        "title": "Nomor Panjar",
                    },
                    {
                        "field": "jumlahpanjar",
                        "title": "Jumlah Panjar",
                    },
                    {
                        "field": "uraian",
                        "title": "Uraian Panjar",
                    },
                    {
                        "field": "jumlahspj",
                        "title": "Jumlah SPJ",
                    },
                    {
                        "field": "jumlahpengembalian",
                        "title": "Jumlah Pengembalian Panjar",
                    },
                    {
                        "field": "textkegiatan",
                        "title": "Kegiatan",
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                    },
                ]
            }

        }
        
    ]);
});