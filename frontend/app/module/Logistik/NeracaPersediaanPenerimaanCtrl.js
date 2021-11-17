define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('NeracaPersediaanPenerimaanCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            var details = [];
            var details2 = [];
            var details3 = [];
            var details4 = [];
            var details5 = [];
            var details6 = [];
            var details7 = [];
            var details8 = [];
            var detailsAll = [];
            var x = [];
            $scope.selectedJenisProduk = []
            $scope.selectedDetailJenis = []
            LoadCache();
            $scope.item.neraca = false;
            var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
            var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
            $scope.selectOptionsDetailJenis = {
                // placeholder: "Pilih Detail Jenis Produk...",
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };

            medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                $scope.listNamaBarang = data;
            });

            function LoadCache() {
                $scope.item.bulan = $scope.now;
                medifirstService.get("logistik-stok/get-data-stock-flow", true).then(function (dat) {
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                    $scope.listJenisProduk = dat.data.jenisproduk
                    $scope.listDetailJenis = dat.data.detailjenisproduk
                    var chacePeriode = cacheHelper.get('NeracaPersediaanCtrl');
                    if (chacePeriode != undefined) {
                        $scope.item.tglAwal = new Date(chacePeriode[0]);
                        $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    }
                    else {
                        $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                        // $scope.item.tglAkhir = $scope.now;
                        $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                        // init();
                    }
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var listDetailJenis = ""
                if ($scope.selectedDetailJenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.selectedDetailJenis.length - 1; i >= 0; i--) {
                        var c = $scope.selectedDetailJenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDetailJenis = a.slice(1, a.length)
                }

                var nmproduk = ""
                if ($scope.item.nmProduk != undefined) {
                    nmproduk = "&nmproduk=" + $scope.item.nmProduk
                }

                var idRuangan = ""
                if ($scope.item.ruangan != undefined) {
                    idRuangan = "&idRuangan=" + $scope.item.ruangan.id
                }

                var ttlsaldoawal = 0
                var ttlpenerimaan = 0
                var ttlpengeluaran = 0
                var ttlsaldoakhir = 0
                var date = new Date($scope.item.bulan);
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var tglAwal = moment(firstDay).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment(lastDay).format('YYYY-MM-DD 23:59');
                var tglawalsaldo = moment(lastDay).format('YYYY-MM-DD 00:00');
                var tglakhirsaldo = moment(lastDay).format('YYYY-MM-DD 23:59');
                var bulanini = parseFloat(moment($scope.item.bulan).format('MM.YYYY'))
                var lalu = parseFloat(moment($scope.item.bulan).format('M'));
                var bulanlalu = ""
                if (lalu.length > 1) {
                    bulanlalu = lalu + "." + moment($scope.now).format('YYYY');
                } else {
                    bulanlalu = "0" + lalu + "." + moment($scope.now).format('YYYY');
                }
                var bln = moment($scope.item.bulan).format('MM.YYYY');
                medifirstService.get("logistik-stok/get-data-laporan-persediaan-perpenerimaan?" +
                    "&blnLalu=" + bulanlalu +
                    "&tglawal=" + tglAwal +
                    "&tglakhir=" + tglAkhir +
                    "&tglawalsaldo=" + tglawalsaldo +
                    "&tglakhirsaldo=" + tglakhirsaldo +
                    "&djp=" + listDetailJenis +
                    nmproduk + idRuangan, true).then(function (dat) {
                        var datas = dat.data.data
                        for (let i = 0; i < datas.length; i++) {
                            const element = datas[i];
                            element.no = i + 1
                        }
                        // $scope.item.ttlsaldoawal = parseFloat(ttlsaldoawal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpenerimaan = parseFloat(ttlpenerimaan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlpengeluaran = parseFloat(ttlpengeluaran).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // $scope.item.ttlsaldoakhir = parseFloat(ttlsaldoakhir).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");                        
                        $scope.dataGrid = {
                            data: datas,
                            pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: datas.length,
                            schema: {
                                model: {
                                    fields: {
                                        hargasatuan: { type: "number" },
                                        totalrpsaldoawal: { type: "number" },
                                        hargaterima: { type: "number" },
                                        totalhargaterima: { type: "number" },
                                        hargakeluar: { type: "number" },
                                        totalhargakeluar: { type: "number" },
                                        hargasaldoakhir: { type: "number" },
                                        totalrpsaldoakhir: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [

                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'totalrpsaldoawal', aggregate: 'sum' },
                                { field: 'hargaterima', aggregate: 'sum' },
                                { field: 'totalhargaterima', aggregate: 'sum' },
                                { field: 'hargakeluar', aggregate: 'sum' },
                                { field: 'totalhargakeluar', aggregate: 'sum' },
                                { field: 'hargasaldoakhir', aggregate: 'sum' },
                                { field: 'totalrpsaldoakhir', aggregate: 'sum' },
                            ]
                        };
                        $scope.dataExcel = datas;
                        $scope.isRouteLoading = false;
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('NeracaPersediaanPenerimaanCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.cariPopUp = function () {
                console.log($scope.selectedJenisProduk)
                init();
                $scope.popUpCari.close()
            }

            $scope.batal = function () {
                $scope.popUpCari.close()
            }

            $scope.Neraca = function () {
                // debugger;
                if ($scope.item.neraca == true) {
                    $scope.item.ruangan = ''

                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Persediaan Per Penerimaan" + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + '-' + moment($scope.item.tglAkhir).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var rows = e.workbook.sheets[0].rows;

                    // var sheet = e.workbook.sheets[0];
                    for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                        var row = sheet.rows[rowIndex];
                        for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                            //whatever you want to do with cells
                        }
                        if (row.cells[5] != undefined) {
                            row.cells[5].format = "#,##0";
                        }
                        if (row.cells[6] != undefined) {
                            row.cells[6].format = "#,##0";
                        }
                        if (row.cells[8] != undefined) {
                            row.cells[8].format = "#,##0";
                        }
                        if (row.cells[9] != undefined) {
                            row.cells[9].format = "#,##0";
                        }
                        if (row.cells[11] != undefined) {
                            row.cells[11].format = "#,##0";
                        }
                        if (row.cells[12] != undefined) {
                            row.cells[12].format = "#,##0";
                        }
                        if (row.cells[14] != undefined) {
                            row.cells[14].format = "#,##0";
                        }
                        if (row.cells[15] != undefined) {
                            row.cells[15].format = "#,##0";
                        }
                    }
                    for (var ri = 0; ri < rows.length; ri++) {
                        var row = rows[ri];

                        if (row.type == "group-footer" || row.type == "footer") {
                            for (var ci = 0; ci < row.cells.length; ci++) {
                                var cell = row.cells[ci];
                                row.cells[6].format = "#,##0.00";
                                row.cells[9].format = "#,##0.00";
                                row.cells[12].format = "#,##0.00";
                                row.cells[15].format = "#,##0.00";

                                if (cell.value) {
                                    if (cell.value.indexOf('Rp.') > -1) {
                                        cell.value = cell.value.replace("Rp. {{formatRupiah('", '')
                                        cell.value = cell.value.replace("', '')}}", '')
                                    }
                                    // Use jQuery.fn.text to remove the HTML and get only the text
                                    cell.value = $(cell.value).text();
                                    // Set the alignment
                                    cell.hAlign = "right";
                                }
                            }
                        }
                    }

                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "LAPORAN PERSEDIAAN PER PENERIMAAN",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "45px",
                        Template: "<span class='style-center'>#: no #</span>",
                    },
                    // {
                    //     field: "noterima",
                    //     title: "No Penerimaan",
                    //     width: "180px",
                    //     Template: "<span class='style-center'>#: noterima #</span>",
                    // },
                    {
                        field: "id",
                        title: "Kode",
                        width: "80px",
                        Template: "<span class='style-center'>#: id #</span>",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Barang",
                        width: "320px",
                        Template: "<span class='style-center'>#: namaproduk #</span>",
                    },
                    {
                        field: "satuanstandar",
                        title: "Satuan",
                        width: "80px",
                        Template: "<span class='style-center'>#: satuanstandar #</span>",
                        footerTemplate: "<span class='style-right'></span>"
                    },
                    {
                        field: "asalproduk",
                        title: "Asal Produk",
                        width: "150px",
                        Template: "<span class='style-center'>#: asalproduk #</span>",
                        footerTemplate: "<span class='style-right'></span>"
                    },
                    {
                        title: "Saldo Awal",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "saldoawal",
                                title: "Jumlah",
                                width: "70px",
                                template: "<span class='style-right'>{{formatRupiah('#: saldoawal #', '')}}</span>"
                            },
                            {
                                field: "hargasatuan",
                                title: "Harga Satuan",
                                width: "120px",
                                template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                            },
                            {
                                field: "totalrpsaldoawal",
                                title: "Total Harga",
                                width: "150px",
                                template: "<span class='style-right'>{{formatRupiah('#: totalrpsaldoawal #', '')}}</span>",
                                aggregates: ["sum"],
                                attributes: { style: "text-align:right;" },
                                footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalrpsaldoawal.sum  #', '')}}</span>"
                            },
                        ]
                    },
                    {
                        title: "Jumlah Penerimaan/Pengadaan",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "qtyterima",
                                title: "Jumlah",
                                width: "70px",
                                template: "<span class='style-right'>{{formatRupiah('#: qtyterima #', '')}}</span>"
                            },
                            {
                                field: "hargaterima",
                                title: "Harga Satuan",
                                width: "120px",
                                template: "<span class='style-right'>{{formatRupiah('#: hargaterima #', '')}}</span>"
                            },
                            {
                                field: "totalhargaterima",
                                title: "Total Harga",
                                width: "150px",
                                template: "<span class='style-right'>{{formatRupiah('#: totalhargaterima #', '')}}</span>",
                                aggregates: ["sum"],
                                attributes: { style: "text-align:right;" },
                                footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalhargaterima.sum  #', '')}}</span>"
                            },
                        ]
                    },
                    {
                        title: "Jumlah Pengeluaran",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "qtykeluar",
                                title: "Jumlah",
                                width: "70px",
                                template: "<span class='style-right'>{{formatRupiah('#: qtykeluar #', '')}}</span>"
                            },
                            {
                                field: "hargakeluar",
                                title: "Harga Satuan",
                                width: "120px",
                                template: "<span class='style-right'>{{formatRupiah('#: hargakeluar #', '')}}</span>"
                            },
                            {
                                field: "totalhargakeluar",
                                title: "Total Harga",
                                width: "150px",
                                template: "<span class='style-right'>{{formatRupiah('#: totalhargakeluar #', '')}}</span>",
                                aggregates: ["sum"],
                                attributes: { style: "text-align:right;" },
                                footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalhargakeluar.sum  #', '')}}</span>"
                            },
                        ]
                    },
                    {
                        title: "Sisa Stok",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "saldoakhir",
                                title: "Jumlah",
                                width: "70px",
                                template: "<span class='style-right'>{{formatRupiah('#: saldoakhir #', '')}}</span>"
                            },
                            {
                                field: "hargasaldoakhir",
                                title: "Harga Satuan",
                                width: "120px",
                                template: "<span class='style-right'>{{formatRupiah('#: hargasaldoakhir #', '')}}</span>"
                            },
                            {
                                field: "totalrpsaldoakhir",
                                title: "Total Harga",
                                width: "150px",
                                template: "<span class='style-right'>{{formatRupiah('#: totalrpsaldoakhir #', '')}}</span>",
                                aggregates: ["sum"],
                                attributes: { style: "text-align:right;" },
                                footerTemplate: "<span class='style-right'>Rp. {{formatRupiah('#: data.totalrpsaldoakhir.sum  #', '')}}</span>"
                            },
                        ]
                    }
                ],
            };

            $scope.ClosingSaldo = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Data Ruangan Belum Dipilih!");
                    return;
                }
                var date = new Date($scope.item.bulan);
                var tglAwal = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment(new Date(date.getFullYear(), date.getMonth(), + 1, 0)).format('YYYY-MM-DD 23:59');
                var bln = moment($scope.item.bulan).format('MM.YYYY');
                if (details.length > 0) {
                    $scope.isRouteLoading = false;
                    var objSave = {
                        'tglawal': tglAwal,
                        'tglakhir': tglAkhir,
                        'bulan': bln,
                        'ruanganfk': $scope.item.ruangan.id,
                        'details': details,
                    }

                    medifirstService.post('logistik/save-closing-persediaan-2021', objSave).then(function (e) {
                        init();
                    });
                } else {
                    $scope.isRouteLoading = false;
                    toastr.error("Data Tidak Ditemukan!");
                    return;
                }

            };

            //** BATAS */
        }
    ]);
});
