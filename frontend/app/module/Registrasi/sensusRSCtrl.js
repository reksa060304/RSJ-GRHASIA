define([
    'initialize',
    // 'dependency'
],
function (initialize, factory) {
    'use strict';
    initialize.controller('sensusRSCtrl', ['$scope','MedifirstService', function ($scope,medifirstService) {
        $scope.item = {}
            $scope.isRouteLoading = false
        $scope.yearUngkul = {
            start: "decade",
            depth: "decade"
        }

        $scope.monthUngkul = {
            start: "year",
            depth: "year"
        }
        $scope.cariFilter = function(){
            dataLoad()
        }
        $scope.savePosting = function(){
            postLoad()

        }
        function postLoad(){
            $scope.isRouteLoading = true
            medifirstService.get('registrasi/get-pasienawal-rs?bulan=' + moment($scope.item.bulan).format('MM') + "&tahun=" + moment($scope.item.tahun).format('YYYY')).then(function (data) {
                medifirstService.post('registrasi/post-pasienawal-rs',data.data).then(function(){
                    $scope.isRouteLoading = false

                    dataLoad()
                })
            })
        }
        function dataLoad() {
            $scope.isRouteLoading = true

            medifirstService.get('registrasi/get-laporan-sensus-rs?bulan='+moment($scope.item.bulan).format('MM')+ "&tahun="+ moment($scope.item.tahun).format('YYYY')).then(function(data){
                var datas = data.data.data
                var sumhariperawatan = 0;
                var sumlos = 0;
                var sumjumlahpasienkeluarrs = 0
                var sumpasienlbh48 = 0
                var sumjumlahpasienmeninggal = 0
                var jumlahtt = data.data.jumlahtt[0].totalperperiode
                $scope.item.ttlTempatTidur = jumlahtt
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sumhariperawatan += element.hariperawatan
                    sumlos += element.los
                    sumjumlahpasienkeluarrs += element.jumlahpasienkeluarrs
                    sumjumlahpasienmeninggal += element.jumlahpasienmeninggal
                    sumpasienlbh48 += element.pasienlbh48
                }
                $scope.item.bortt = (sumhariperawatan / ($scope.item.ttlTempatTidur * datas.length)* 100).toFixed(2) + '%'
                $scope.item.los = ((sumlos/sumjumlahpasienkeluarrs)).toFixed(2)
                $scope.item.toi = ((($scope.item.ttlTempatTidur*datas.length) - sumhariperawatan)/sumjumlahpasienkeluarrs).toFixed(2)
                $scope.item.bto = (sumjumlahpasienkeluarrs/datas.length).toFixed(2)
                $scope.item.ndr = (sumpasienlbh48 / sumjumlahpasienkeluarrs).toFixed(2) + 'permil'
                $scope.item.gdr = (sumjumlahpasienmeninggal / sumjumlahpasienkeluarrs).toFixed(2) + 'permil'
                $scope.dataSourcePendidikan = new kendo.data.DataSource({
                    data: datas,
                    schema: {
                        model: {},
                    },
                });
            $scope.isRouteLoading = false

            })
        }
        $scope.columnProduk = [{
                "title": "Tanggal",
                "width": "50px",
                "columns": [
                    {
                        "title": "1",
                        "field": "tgl"
                    }
                ]
            },
            {
                "title": "Pasien Awal",
                "width": "50px",
                "columns": [{
                    "title": "2",
                    "field": "pasienawal"
                }]
            },
            {
                "title": "Pasien Masuk",
                "width": "50px",
                "columns": [{
                    "title": "3",
                    "field": "pasienmasuk",
                }]
            },
            {
                "title": "Jumlah(2 + 3)",
                "width": "50px",
                "columns": [{
                    "title": "4",
                    "field": "jumlah",
                }]
            },
            {
                "title": "APS",
                "width": "50px",
                "columns": [{
                    "title": "5",
                    "field": "pasienaps",
                }]
            },
            {
                "title": "Atas persetujuan Dokter",
                "width": "50px",
                "columns": [{
                    "title": "6",
                    "field": "pasienapd",
                }]
            },
            {
                "title": "Dirujuk",
                "width": "50px",
                "columns": [{
                    "title": "7",
                    "field": "pasienrujuk",
                }]
            },
            {
                "title": "Lari",
                "width": "50px",
                "columns": [{
                    "title": "8",
                    "field": "pasienlari",
                }]
            },
            {
                "title": "Dropping",
                "width": "50px",
                "columns": [{
                    "title": "9",
                    "field": "pasiendropping",
                }]
            },
            {
                "title": "Jumlah  pasien pulang(5+6+7+8+9)",
                "width": "50px",
                "columns": [{
                    "title": "10",
                    "field": "jumlahpasienpulang",
                }]
            },
            {
                "title": "Mati <= 48 Jam",
                "width": "50px",
                "columns": [{
                    "title": "11",
                    "field": "pasienkrg48",
                }]
            },
            {
                "title": "Mati >= 48 Jam",
                "width": "50px",
                "columns": [{
                    "title": "12",
                    "field": "pasienlbh48",
                }]
            },
            {
                "title": "Jumlah  pasien meninggal(11 + 12)",
                "width": "50px",
                "columns": [{
                    "title": "13",
                    "field": "jumlahpasienmeninggal",
                }]
            },
            {
                "title": "Jumlah Pasien Keluar RS(10+13)",
                "width": "50px",
                "columns": [{
                    "title": "14",
                    "field": "jumlahpasienkeluarrs",
                }]
            },
            {
                "title": "Jumlah Sisa Pasien(4-14)",
                "width": "50px",
                "columns": [{
                    "title": "15",
                    "field": "jumlahsisapasien",
                }]
            },
            {
                "title": "Pasien MKHS",
                "width": "50px",
                "columns": [{
                    "title": "16",
                    "field": "pasienmkhs",
                }]
            },
            {
                "title": "Hari Perawatan(15 + 16)",
                "width": "50px",
                "columns": [{
                    "title": "17",
                    "field": "hariperawatan",
                }]
            },
            {
                "title": "Lama Dirawat",
                "width": "50px",
                "columns": [{
                    "title": "18",
                    "field": "los",
                }]
            },
        ];

        $scope.columnPendidikan = {
            pageable: true,
            columns: $scope.columnProduk,
            selectable: "row",
            scrollable: true,
            
            toolbar: [
                "excel",
            ],
            excel: {
                fileName: "SensusV3RS.xlsx",
                allPages: true,
            },
            excelExport: function (e) {
                var sheet = e.workbook.sheets[0];
                // sheet.name = "Master Produk";
            }
        };
    }])
});