define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL11DataDasarRumahSakitCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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

               medifirstService.get("registrasi/laporan/get-laporan-rl11?" +
                    "tglAwal=" + tglAwal
                ).then(function (data) {
                    // var hasil = data.data.data.filter(element => {
                    //     return element != null;
                    // });
                    console.log(data.data.data);
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data.data,
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
                    $scope.dataExcel = data.data.data;
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

                excel: {
                    fileName: "RL1.1_DataDasarRumahSakit.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var columns = e.workbook.sheets[0].columns;
                    for (var i = 0; i < 1; i++) {
                        for (var j = 0; j < 6; j++) {
                            sheet.rows[i].cells[j].background = '#ffffff';
                        }
                    }

                    for(let i = 0; i <= 5; i++){
                        delete columns[i].width;
                        columns[i].width = 200;
                    }

                    //sheet.rows[0].cells[35].fontWeight = 'bold';

                    for (var i = 3; i < 4; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 3; i < 32; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 5; j < 6; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 31; i < 32; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 3; i < 32; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < 1; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 34; i < 35; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < 2; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 34; i < 50; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 1; j < 2; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 49; i < 50; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < 2; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 34; i < 50; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < 1; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 34; i < 50; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < 1; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 34; i < 43; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 3; j < 6; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 43; i < 44; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 3; j < 4; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 43; i < 44; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 3; j < 6; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 43; i < 44; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 5; j < 6; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                        }
                    }

                    for (var i = 43; i < 44; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 4; j < 5; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                        }
                    }

                    
                },
                columns: [
                    {
                        field: "jumlahkolom1",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom2",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom6",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom3",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom4",
                        title: " ",
                        width: "80px",
                    },
                    {
                        field: "jumlahkolom5",
                        title: " ",
                        width: "80px",
                    }
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