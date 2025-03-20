define([
    'initialize',
    // 'dependency'
],
function (initialize) {
    'use strict';
    initialize.controller('sensusBangsalCtrl', ['$scope', 'MedifirstService', function ($scope, medifirstService) {
        $scope.item = {}
        $scope.isRouteLoading = false
        comboLoad()
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
        function comboLoad() {
            medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (dat) {
                $scope.listRuangan = dat.data.ruanganinap;
                $scope.listRuanganAsal = dat.data.ruangan;
                $scope.listKelas = dat.data.kelas;
            });
        }
        function postLoad(){
            $scope.isRouteLoading = true
            medifirstService.get('registrasi/get-pasienawal-bangsal?bulan=' + moment($scope.item.bulan).format('MM') + "&tahun=" + moment($scope.item.tahun).format('YYYY') + "&ruangan="+ $scope.item.ruangan.id).then(function (data) {
                medifirstService.post('registrasi/post-pasienawal-bangsal',data.data).then(function(){
                    $scope.isRouteLoading = false

                    dataLoad()
                })
            })
        }
        function dataLoad() {
            $scope.isRouteLoading = true

            medifirstService.get('registrasi/get-laporan-sensus-bangsal?bulan='+moment($scope.item.bulan).format('MM')+ "&tahun="+ moment($scope.item.tahun).format('YYYY')+"&ruangan="+$scope.item.ruangan.id).then(function(data){
                var datas = data.data.data
                var sumhariperawatan = 0;
                var sumlos = 0;
                var sumjumlahpasienkeluarrs = 0
                var sumjumlahpasienkeluar = 0
                var sumpasienlbh48 = 0
                var sumjumlahpasienmeninggal = 0
                var jumlahtt = data.data.jumlahtt[0].totalperperiode
                $scope.item.ttlTempatTidur = jumlahtt
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sumhariperawatan += element.hariperawatan
                    sumlos += element.los
                    sumjumlahpasienkeluarrs += element.jumlahpasienkeluarrs
                    sumjumlahpasienkeluar += element.jumlahpasienkeluar
                    sumjumlahpasienmeninggal += element.jumlahpasienmeninggal
                    sumpasienlbh48 += element.pasienlbh48
                    // element.lamadirawat = element.pasiendipindahkan + element.jumlahpasienkeluarrs + element.pasienmkhs
                }
                console.log(sumlos)
                console.log(sumjumlahpasienkeluarrs)
                console.log(sumjumlahpasienkeluar)
                $scope.item.bortt = '0%'
                $scope.item.los = '0'
                $scope.item.toi = '0'
                $scope.item.bto = '0'
                $scope.item.ndr = '0 permil'
                $scope.item.gdr = '0 permil'

                if (sumhariperawatan > 0) {
                    $scope.item.bortt = (sumhariperawatan / ($scope.item.ttlTempatTidur * datas.length)* 100).toFixed(2) + '%'
                }
                if (sumjumlahpasienkeluarrs ||  sumjumlahpasienkeluar > 0) {                    
                    $scope.item.los = ((sumlos / sumjumlahpasienkeluar)).toFixed(2)             
                    $scope.item.toi = ((($scope.item.ttlTempatTidur*datas.length) - sumhariperawatan)/sumjumlahpasienkeluar).toFixed(2)
                    $scope.item.bto = (sumjumlahpasienkeluarrs/datas.length).toFixed(2)
                    $scope.item.ndr = (sumpasienlbh48 / sumjumlahpasienkeluarrs).toFixed(2) + 'permil'
                    $scope.item.gdr = (sumjumlahpasienmeninggal / sumjumlahpasienkeluarrs).toFixed(2) + 'permil'
                }
                $scope.dataSourcePendidikan = new kendo.data.DataSource({
                    data: datas,
                    schema: {
                        model: {},
                    },
                });
            $scope.isRouteLoading = false

            })
        }
        $scope.columnProduk = [            
            {
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
                "title": "Pasien Pindahan",
                "width": "50px",
                "columns": [{
                    "title": "4",
                    "field": "pasienpindahan",
                }]
            },
            {
                "title": "Jumlah(2 + 3 + 4)",
                "width": "50px",
                "columns": [{
                    "title": "5",
                    "field": "jumlah",
                }]
            },
            {
                "title": "Dipindahkan Ke Wisma Lain",
                "width": "50px",
                "columns": [{
                    "title": "6",
                    "field": "pasiendipindahkan",
                }]
            },
            {
                "title": "Pulang APS",
                "width": "50px",
                "columns": [{
                    "title": "7",
                    "field": "pasienaps",
                }]
            },
            {
                "title": "Pulang (Atas Persetujuan Dokter)",
                "width": "50px",
                "columns": [{
                    "title": "8",
                    "field": "pasienapd",
                }]
            },
            {
                "title": "Pulang (Dirujuk)",
                "width": "50px",
                "columns": [{
                    "title": "9",
                    "field": "pasienrujuk",
                }]
            },
            {
                "title": "Pulang (Melarikan Diri)",
                "width": "50px",
                "columns": [{
                    "title": "10",
                    "field": "pasienlari",
                }]
            },
            {
                "title": "Pulang (Dropping)",
                "width": "50px",
                "columns": [{
                    "title": "11",
                    "field": "pasiendropping",
                }]
            },
            {
                "title": "Jumlah pasien pulang  (7+8+9+10+11)",
                "width": "50px",
                "columns": [{
                    "title": "12",
                    "field": "jumlahpasienpulang",
                }]
            },
            {
                "title": "Mati <= 48 Jam",
                "width": "50px",
                "columns": [{
                    "title": "13",
                    "field": "pasienkrg48",
                }]
            },
            {
                "title": "Mati >= 48 Jam",
                "width": "50px",
                "columns": [{
                    "title": "14",
                    "field": "pasienlbh48",
                }]
            },
            {
                "title": "Jumlah pasien meninggal(13 + 14)",
                "width": "50px",
                "columns": [{
                    "title": "15",
                    "field": "jumlahpasienmeninggal",
                }]
            },
            {
                "title": "Jumlah Pasien Keluar RS (12+15)",
                "width": "50px",
                "columns": [{
                    "title": "16",
                    "field": "jumlahpasienkeluarrs",
                }]
            },
            {
                "title": "Total Jumlah Pasien Keluar (6+16)",
                "width": "50px",
                "columns": [{
                    "title": "17",
                    "field": "jumlahpasienkeluar",
                }]
            },
            {
                "title": "Jumlah Sisa Pasien   (5-17)",
                "width": "50px",
                "columns": [{
                    "title": "18",
                    "field": "jumlahsisapasien",
                }]
            },
            {
                "title": "Pasien MKHS",
                "width": "50px",
                "columns": [{
                    "title": "19",
                    "field": "pasienmkhs",
                }]
            },
            {
                "title": "Hari Perawatan (18 + 19)",
                "width": "50px",
                "columns": [{
                    "title": "20",
                    "field": "hariperawatan",
                }]
            },
            {
                "title": "Lama Dirawat",
                "width": "50px",
                "columns": [{
                    "title": "21",
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