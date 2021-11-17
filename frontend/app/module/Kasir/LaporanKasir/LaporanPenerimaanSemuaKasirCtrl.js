define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LaporanPenerimaanSemuaKasirCtrl', ['CacheHelper', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, $http, $state, medifirstService) {            
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};                        
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            
            medifirstService.get("kasir/get-data-combo-kasir", true).then(function (dat) {
                $scope.listDepartemen = dat.data.departemen;
                $scope.listPegawaiKasir = dat.data.datakasir;             
                $scope.dataLogin = medifirstService.getPegawaiLogin();
            });

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.CariLapPenerimaanSemuaKasir = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                $scope.item.total = 0
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempKasirId = "";
                if ($scope.item.namaKasir != undefined) {
                    tempKasirId = "&idKasir=" + $scope.item.namaKasir.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                medifirstService.get("kasir/get-data-lap-penerimaan-semua-kasir?"
                        + "tglAwal=" + tglAwal
                        + "&tglAkhir=" + tglAkhir
                        + tempKasirId
                        + tempRuanganId).then(function (dat) {
                    // console.log(dat);
                    for (let i = 0; i < dat.data.length; i++) {
                        $scope.item.total = $scope.item.total + parseInt(dat.data[i].totalpenerimaan)
                    }
                    $scope.dataPenerimaanSemuaKasir = new kendo.data.DataSource({
                        data: dat.data,
                        pageSize: 10,
                        total: dat.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });
                cacheHelper.set('LaporanPenerimaanSemuaKasirCtrl', chacePeriode);
                $scope.isRouteLoading = false;
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                //debugger;
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnPenerimaanSemuaKasir = [
                {
                    "field": "namapenerima",
                    "title": "Nama Penerima",
                    "width": "120px"
                },
                {
                    "field": "totalpenerimaan",
                    "title": "Total Penerimaan",
                    "width": "100px",
                    "template": "<span class='style-right'>Rp. {{formatRupiah('#: totalpenerimaan #','')}}</span>",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "150px",
                }
            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPenerimaanSemuaKasir();
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            
            $scope.CetakLaporanPenerimaanSemuaKasir = function () {
                var tempKasirId = "";
                if ($scope.item.namaKasir != undefined) {
                    tempKasirId = "&idKasir=" + $scope.item.namaKasir.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                
                    var profile  = 21
                    var local =JSON.parse(localStorage.getItem('profile')) 
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if(local!= null)
                        profile =local.id;
                    window.open(config.baseApiBackend + "kasir/cetak-pdf-lap-penerimaan-semua-kasir?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempKasirId
                    + tempRuanganId
                    + "&kdProfile=" + profile,  '_blank');
            }
            
            $scope.mainGroupOptionsLapPenerimaanSemuaKasir = {
                toolbar: [
                    "excel",
                    {
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="CetakLaporanPenerimaanSemuaKasir()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-pdf"></span>Export to PDF</button>'
                    }
                    ],
                    excel: {
                        fileName: "LaporanPenerimaanSemuaKasir.xlsx",
                        allPages: true,
                    },
                    pdf: {

                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.name = "Orders";
                        sheet.mergedCells = ["A1:C1"];

                        var myHeaders = [{
                            value:"Laporan Penerimaan Semua Kasir",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                pageable: {
                    // pageSize: 5,
                    // previousNext: false,
                    messages: {
                        display: "Showing {0} - {1} from {2} data items",
                    },
                },
                columns: $scope.columnPenerimaanSemuaKasir,
                // dataSource:$scope.dataSourceLaporanLayanan,            
                selectable: true,
                refresh: true,
                scrollable: false,
                // dataSource: $scope.dataSourceLaporanLayanan2,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },
            };
        }

    ]);
});