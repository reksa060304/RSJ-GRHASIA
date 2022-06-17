define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RemunTagihanDiklatCtrl', ['$scope', '$state', 'CacheHelper', '$mdDialog', 'MedifirstService', '$timeout',
        function ($scope, $state, cacheHelper, $mdDialog, medifirstService, $timeout) {
            $scope.item = {};
                $scope.isRouteLoading = false
            $scope.iteminput = {};
            $scope.now = new Date();

            // var tgl = dateHelper.getDaysofMonth()
            // console.log(tgl);
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.item.jumlahRows = 50;

            $scope.dataRemun = [];
            var norec = "";
            // loadData()

            $scope.SearchData = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true
                var bulan = moment($scope.item.bulan).format('MM');
                var tahun = moment($scope.item.tahun).format('YYYY')
                console.log(bulan, tahun);
                medifirstService.get('tatarekening/get-daftar-remun-diklat?bulan=' + bulan + "&tahun=" + tahun).then(function (e) {
                $scope.isRouteLoading = false

                    console.log(e.data.data);
                    $scope.data = {}
                    $scope.data = e.data.data
                    $scope.datasum = e.data.datasum
                    $scope.dataSource = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 10,
                        total: e.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                })

            }


            $scope.klik = function (current) {
                console.log(current);
                norec = current.norec
            }
            $scope.columnProduk = [{
                    "field": "namapegawai",
                    "title": "Nama Pegawai",
                    "width": '200px',
                },
                {
                    "field": "tglstruk",
                    "title": "TGL Struk",
                    "width": '200px',
                },
                {
                    "field": "jenisperan",
                    "title": "Jenis Peran",
                    "width": '150px',
                },
                {
                    "field": "tagihan",
                    "title": "Tagihan",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: tagihan #', 'Rp.')}}</span>",

                },
                {
                    "field": "pembilang",
                    "title": "Penerimaan",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: pembilang #', 'Rp.')}}</span>",
                },
                {
                    "field": "equ",
                    "title": "Equivalen",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: equ #', 'Rp.')}}</span>",
                },
               
            ];
            $scope.postingTotalBersih = function () {
                console.log($scope.data);
                 var bulan = moment($scope.item.bulan).format('MM');
                 var tahun = moment($scope.item.tahun).format('YYYY')
                var objSave = {
                    bulan: bulan,
                    tahun: tahun,
                    data: $scope.datasum
                }
                medifirstService.post('tatarekening/save-remun-diklat', objSave).then(function(){

                })
            }
            $scope.mainGridOptions = {
                pageable: true,
                columns: $scope.columnProduk,
                editable: "popup",
                selectable: "row",
                scrollable: false,
                // filterMenuInit: function (e){
                // var grid = e.sender;
                // e.container.data("kendoPopup").bind("open", function() {

                // 	$scope.dataSource.sort({field: e.field, dir: "asc"});


                // 	var filter = e.sender.dataSource.filter();

                // 	var query = new kendo.data.Query(grid.dataSource.data());
                // 	var data = query.filter(filter).data;

                // 	var uniqueDsResult = removeDuplicates(data, e.field);


                // 	$scope.dataSource.data(uniqueDsResult);


                // })
                // },
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "MasterProduk.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    //sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Master Produk";

                    // var myHeaders = [{
                    //     value: "Master Produk",
                    //     fontSize: 20,
                    //     textAlign: "center",
                    //     background: "#ffffff",
                    //     // color:"#ffffff"
                    // }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
        }
    ]);
});
