
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanLinenKotorCtrl', ['$scope', 'DateHelper', 'MedifirstService', '$timeout',
        function ($scope, dateHelper, medifirstService, $timeout) {
            $scope.titleButton = 'Input Jadwal'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.popup = {}
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var data2 = []
            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.monthOnly = {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                };
                LoadCombo();
            }
            medifirstService

            function LoadCombo() {
                medifirstService.get("laundry/get-combo-laundry", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganall
                });
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.cari = function () {
                if ($scope.item.qBulan == undefined) {
                    toastr.error('Bulan Harus di isi')
                    return
                }
                var bln = ''
                if ($scope.item.qBulan != undefined) {
                    bln = moment($scope.item.qBulan).format('YYYY-MM')
                }
                var ruanganId = ''
                if ($scope.item.ruangan != undefined) {
                    ruanganId = '&ruanganId=' + $scope.item.ruangan.id
                }
                $scope.isRouteLoading = true
                data2 = []

                // generateTable()
                medifirstService.get('laundry/get-data-laporan-linen-kotor?bulan=' + bln + ruanganId).then(function (e) {
                    $scope.isRouteLoading = false
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    var dataBack = e.data.data

                    $scope.dataSourceGrid = new kendo.data.DataSource({
                        data: dataBack,
                        batch: true,
                        schema: {
                            model: {
                            }
                        }
                    });
                }, function error() {
                    $scope.isRouteLoading = false
                })

            }

            $scope.mainGridOptions = {
                pageable: true,

                excel: {
                    fileName: "Laporan-Linen-Bersih-" + moment($scope.item.qBulan).format('YYYY-MM') + ".xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "Laporan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                columns: [

                    {
                        field: "no",
                        title: "No",
                        width: "50px",
                        template: "<span class='style-center'>#= no #</span>",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "120px"
                    },
                    {
                        field: "namaproduk",
                        title: "Produk",
                        width: "120px"
                    },
                    {
                        title: "Tanggal",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "tgl01",
                                title: "1",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl01 #</span>",
                            },
                            {
                                field: "tgl02",
                                title: "2",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl02 #</span>",
                            },
                            {
                                field: "tgl03",
                                title: "3",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl03 #</span>",
                            },
                            {
                                field: "tgl04",
                                title: "4",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl04 #</span>",
                            },
                            {
                                field: "tgl05",
                                title: "5",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl05 #</span>",
                            },
                            {
                                field: "tgl06",
                                title: "6",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl06 #</span>",
                            },
                            {
                                field: "tgl07",
                                title: "7",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl07 #</span>",
                            },
                            {
                                field: "tgl08",
                                title: "8",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl08 #</span>",
                            },
                            {
                                field: "tgl09",
                                title: "9",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl09 #</span>",
                            },
                            {
                                field: "tgl10",
                                title: "10",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl10 #</span>",
                            },
                            {
                                field: "tgl11",
                                title: "11",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl11 #</span>",
                            },
                            {
                                field: "tgl12",
                                title: "12",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl12 #</span>",
                            },
                            {
                                field: "tgl13",
                                title: "13",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl13 #</span>",
                            },
                            {
                                field: "tgl14",
                                title: "14",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl14 #</span>",
                            },
                            {
                                field: "tgl15",
                                title: "15",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl15 #</span>",
                            },
                            {
                                field: "tgl16",
                                title: "16",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl16 #</span>",
                            },
                            {
                                field: "tgl17",
                                title: "17",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl17 #</span>",
                            },
                            {
                                field: "tgl18",
                                title: "18",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl18 #</span>",
                            },
                            {
                                field: "tgl19",
                                title: "19",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl19 #</span>",
                            },
                            {
                                field: "tgl20",
                                title: "20",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl20 #</span>",
                            },
                            {
                                field: "tgl20",
                                title: "20",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl20 #</span>",
                            },
                            {
                                field: "tgl21",
                                title: "21",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl21 #</span>",
                            },
                            {
                                field: "tgl22",
                                title: "22",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl22 #</span>",
                            },
                            {
                                field: "tgl23",
                                title: "23",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl23 #</span>",
                            },
                            {
                                field: "tgl24",
                                title: "24",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl24 #</span>",
                            },
                            {
                                field: "tgl25",
                                title: "25",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl25 #</span>",
                            },
                            {
                                field: "tgl26",
                                title: "26",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl26 #</span>",
                            },
                            {
                                field: "tgl27",
                                title: "27",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl27 #</span>",
                            },
                            {
                                field: "tgl28",
                                title: "28",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl28 #</span>",
                            },
                            {
                                field: "tgl29",
                                title: "29",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl29 #</span>",
                            },
                            {
                                field: "tgl30",
                                title: "30",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl30 #</span>",
                            },
                            {
                                field: "tgl31",
                                title: "31",
                                width: "50px",
                                headerAttributes: { style: "text-align : center" },
                                template: "<span class='style-center'>#= tgl31 #</span>",
                            },
                        ]
                    },
                    {
                        field: "jumlah",
                        title: "Jumlah/Lembar",
                        width: "80px"
                    },
                    {
                        field: "jumlahkg",
                        title: "Jumlah/Kg",
                        width: "80px"
                    },
                    {
                        field: "estimasikg",
                        title: "Estimasi Kg",
                        width: "80px"
                    },
                ],
                selectable: "cell",
                sortable: true
            }

            var getMonths = function (startDate, endDate) {
                var resultList = [];
                var date = new Date(startDate);
                var endDate = new Date(endDate);
                var hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
                var monthNameList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

                while (date <= endDate) {
                    // var _hari = date.getDay();
                    // var hari = hari[_hari]
                    var stringDate = hariList[date.getDay()] + ', ' + date.getDate() + ' ' + monthNameList[date.getMonth()] + " " + date.getFullYear();

                    //get first and last day of month
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                    resultList.push({
                        str: stringDate,
                        first: firstDay,
                        tglabsen: moment(date).format('YYYY-MM-DD'),
                        last: lastDay,
                    });
                    date.setDate(date.getDate() + 1);
                }
                return resultList;
            }
            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-'
            }

            $scope.cariDokter = function () {
                $scope.listTempDokter = []
                if ($scope.item.cariDokter != undefined) {
                    var textbox = $scope.item.cariDokter.toLowerCase()
                    for (let i = 0; i < $scope.listDokterCari.length; i++) {
                        var arr = $scope.listDokterCari[i].namalengkap.toLowerCase()
                        if (arr.indexOf(textbox) != -1) {
                            $scope.listTempDokter.push($scope.listDokterCari[i])
                        }
                    }
                    $scope.listDokter = []
                    $scope.listDokter = $scope.listTempDokter
                }
                if ($scope.item.cariDokter == "" || $scope.item.cariDokter == undefined)
                    $scope.listDokter = $scope.listDokterCari
            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            $scope.createColumn = function () {
                var year = parseInt(moment($scope.item.bulan).format("Y"))
                var month = parseInt(moment($scope.item.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;
            }

            $scope.addDokter = function (bool, data) {
                var index = $scope.arrDokter.indexOf(data);
                if (_.filter($scope.arrDokter, {
                    id: data.id
                }).length === 0 && bool)

                    $scope.arrDokter.push(data);
                else
                    $scope.arrDokter.splice(index, 1);
            }

            $scope.onDataBound = function (e) {
                var grid = $("#kGrid").data("kendoGrid");

                $(grid.tbody).on("dblclick", "td", function (e) {
                    // if (e.currentTarget.innerText === "") return; // disable show popup on empty cell date value
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    var row = $(this).closest("tr");
                    var selectedData = grid.dataItem(row);

                    if (colIdx >= 1) {
                        if (e.currentTarget.innerText == '')
                            e.currentTarget.innerText = '✔'
                        else
                            e.currentTarget.innerText = ''
                        // if (selectedData == undefined) break
                        var colDateIdx = colIdx - 1;
                        var colName = $('#kGrid tr').eq(1).find('th').eq(colDateIdx).text();

                        if (colName.length === 1) {
                            colName = "0" + colName;
                        }
                        if (colName.length <= 2) {
                            // show detail on date cell click only
                            var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;
                            // dataARR.push(date)
                            // selectedData.listTgl.push(date)
                            $scope.pushKeArray(selectedData.id, selectedData.namalengkap, selectedData.listTgl, date, e.currentTarget.innerText);
                        }
                    }
                });
            }

            var timeoutPromise;
            $scope.$watch('item.cariDokters', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal)
                    }
                }, 500)
            })

            $scope.cariDokterGrid = function () {
                applyFilter("namalengkap", $scope.item.cariDokters)
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }

            /////////////////////////////// // ///////
        }
    ]);

});