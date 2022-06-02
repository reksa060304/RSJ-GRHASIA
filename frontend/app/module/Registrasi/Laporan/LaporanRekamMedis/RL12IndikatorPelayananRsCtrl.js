define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL12IndikatorPelayananRsCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

               medifirstService.get("registrasi/laporan/get-laporan-rl12?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    for(var i = 0; i < data.data.length; i++){
                        data.data[i].koders = '3404022';
                        data.data[i].kdprov = '24';
                        data.data[i].kabkota = 'Kab. Sleman';
                    }
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL1.2_IndikatorPelayananRS.xlsx",
                    allPages: true,

                },
                excelExport: function (e) {
                    var columns = e.workbook.sheets[0].columns;
                    var sheet = e.workbook.sheets[0];
                    for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                        delete columns[i].width;
                        columns[i].width = 200;
                    }

                    for (var i = 0; i < 1; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 2 };
                            $cell["borderRight"] = { color: "#000000", size: 2 };
                            $cell["borderBottom"] = { color: "#000000", size: 2 };
                            $cell["borderLeft"] = { color: "#000000", size: 2 };
                        }
                        console.log(e.workbook.sheets[0].rows.length);
                        console.log(e.workbook.sheets[0].rows[i].cells.length);
                    }

                    sheet.rows[0].cells[0].background = '#6fde78';
                    sheet.rows[0].cells[0].color = '#000000'; 
                    sheet.rows[0].cells[1].background = '#6fde78'; 
                    sheet.rows[0].cells[1].color = '#000000'; 
                    sheet.rows[0].cells[2].background = '#6fde78'; 
                    sheet.rows[0].cells[2].color = '#000000'; 
                    sheet.rows[0].cells[3].background = '#6fde78'; 
                    sheet.rows[0].cells[3].color = '#000000'; 
                    sheet.rows[0].cells[4].background = '#6fde78'; 
                    sheet.rows[0].cells[4].color = '#000000'; 
                    sheet.rows[0].cells[5].background = '#6fde78'; 
                    sheet.rows[0].cells[5].color = '#000000'; 
                    sheet.rows[0].cells[6].background = '#6fde78'; 
                    sheet.rows[0].cells[6].color = '#000000'; 
                    sheet.rows[0].cells[7].background = '#6fde78'; 
                    sheet.rows[0].cells[7].color = '#000000';
                    sheet.rows[0].cells[8].background = '#6fde78'; 
                    sheet.rows[0].cells[8].color = '#000000';
                    sheet.rows[0].cells[9].background = '#6fde78'; 
                    sheet.rows[0].cells[9].color = '#000000';
                    sheet.rows[0].cells[10].background = '#6fde78'; 
                    sheet.rows[0].cells[10].color = '#000000'; 
                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                
                columns: [
                    {
                        field: "koders",
                        title: "Kode RS",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "kdprov",
                        title: "Kode Propinsi",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "kabkota",
                        title: "Kab / Kota",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "tahun",
                        title: "Tahun",
                        width: "120px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "bor",
                        title: "BOR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "alos",
                        title: "LOS",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "bto",
                        title: "BTO",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "toi",
                        title: "TOI",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "ndr",
                        title: "NDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "gdr",
                        title: "GDR",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "hasil",
                        title: "Rata-rata Kunjungan/Hari",
                        width: "120px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },


                ]
            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

        }
    ]);
});