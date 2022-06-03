define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL31TempatTidurCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM');

               medifirstService.get("registrasi/laporan/get-laporan-rl13?" +
                    "tglAwal=" + tglAwal
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
                    fileName: "RL1.3_TempatTidur.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
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
                    sheet.rows[0].cells[11].background = '#6fde78'; 
                    sheet.rows[0].cells[11].color = '#000000'; 
                },
                columns: [
                    // {
                    //     field: "no",
                    //     title: "NO",
                    //     Template: "<span class='style-center'>#: no #</span>",
                    //     width: "40px"
                    // },
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
                        field: "year",
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
                        field: "pelayanan",
                        title: "Jenis Pelayanan",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "totaltt",
                        title: "Jumlah TT",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelasvvip",
                        title: "VVIP",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelasvip",
                        title: "VIP",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelassatu",
                        title: "I",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelasdua",
                        title: "II",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelastiga",
                        title: "III",
                        width: "80px",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "jumlahkelaskhusus",
                        title: "Kelas Khusus",
                        width: "80px",
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