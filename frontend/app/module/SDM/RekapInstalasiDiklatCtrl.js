define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapInstalasiDiklatCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.tahun = moment(new Date()).format('YYYY')
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.listDokterMulti = [];
            FormLoad();
            LoadData();
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

            $scope.Liststatus = [{
                    id: 1,
                    nama: "Lebih dari 20 Jam"
                },
                {
                    id: 0,
                    nama: "Kurang dari 20 Jam"
                }
            ]

            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.pegawai = medifirstService.getPegawai();
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listStatus = dataCombo.statuspegawai;
                    $scope.listJenisPegawai = dataCombo.jenispegawai;
                    $scope.listKategory = dataCombo.kategorypegawai;
                    $scope.listJenisPetPelaksana = dataCombo.jenispetugaspe;
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokters = data;
                    $scope.selectOptionsDokter = {
                        placeholder: "Pilih Petugas Pelaksana",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
                    };
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                $scope.tahun = moment($scope.item.tahun).format('YYYY')
                LoadData();
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var jenisPetugasPe = "";
                if ($scope.item.JenisPetPelaksana != undefined) {
                    jenisPetugasPe = "jenisPetugasPe=" + $scope.item.JenisPetPelaksana.id;
                }

                var listDokterPemeriksa = ""
                if ($scope.listDokterMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.listDokterMulti.length - 1; i >= 0; i--) {

                        var c = $scope.listDokterMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDokterPemeriksa = a.slice(1, a.length)
                }
                // variable buat count karywan

                var tahun = 'tahun=' + moment($scope.item.tahun).format('YYYY');

                var status = "";
                if ($scope.item.status != undefined) {
                    status = "&status=" + $scope.item.status.id;
                }

                var jan = 0, feb = 0, mar = 0, apr = 0, mei = 0, jun = 0, jul = 0, ags=0, sep=0, okt = 0, nov = 0, des = 0, sum = 0;
                medifirstService.get("diklat/get-laporan-pengguna-total?" + tahun + status).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data;
                    console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        jan += Number(data.data[i].januari)
                        feb += Number(data.data[i].februari)
                        mar += Number(data.data[i].maret)
                        apr += Number(data.data[i].april)
                        mei += Number(data.data[i].mei)
                        jun += Number(data.data[i].juni)
                        jul += Number(data.data[i].juli)
                        ags += Number(data.data[i].agustus)
                        sep += Number(data.data[i].september)
                        okt += Number(data.data[i].oktober)
                        nov += Number(data.data[i].november)
                        des += Number(data.data[i].desember)
                        sum += Number(data.data[i].total)
                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        aggregate: [
                            
                        ],
                        schema: {
                            model: {}
                        }
                    });
                });
                $scope.columnGrid = {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "JamPelatihanKaryawan.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 3;
                        sheet.mergedCells = ["A1:O1","A2:O2","A3:O3"];
                        sheet.name = "sheet 1";

                        var myHeaders = [{
                            value: "REKAP PENGGUNA INSTALASI DIKLATLITBANG",
                            fontSize: 11,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];
                        var myHeaders2 = [{
                            value: "RSJ GRHASIA DAERAH ISTIMEWA YOGYAKARTA",
                            fontSize: 11,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];
                        var myHeaders3 = [{
                            value: "TAHUN 2021",
                            fontSize: 11,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];
                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            // height: 70
                        });
                        sheet.rows.splice(1, 0, {
                            cells: myHeaders2,
                            type: "header",
                            // height: 70
                        });
                        sheet.rows.splice(2, 0, {
                            cells: myHeaders3,
                            type: "header",
                            // height: 70
                        });
                        
                        sheet.rows.splice(100, 0, {
                            cells: [
                                {
                                    value: "Jumlah",
                                    colSpan: 2, textAlign: "center"
                                    },
                                    {value: jan},{value: feb},{value: mar},
                                    {value: apr},{value: mei},{value: jun},
                                    {value: jul},{value: ags},{value: sep},
                                    {value: okt},{value: nov},{value: des},{value: sum, rowSpan: 3, textAlign: "center",verticalAlign: "center"}
                            ],
                            type: "data",
                        });
                        sheet.rows.splice(101, 0, {
                            cells: [
                                {
                                    value: "Per Triwulan",
                                    colSpan: 2, textAlign: "center"
                                    },
                                    {value: jan+feb+mar, colSpan: 3, textAlign: "center"},
                                    {value: apr+ mei+jun, colSpan:3, textAlign: "center"},
                                    {value: jul+ags+sep, colSpan: 3, textAlign: "center"},
                                    {value: okt+nov+ des, colSpan: 3, textAlign: "center"}
                            ],
                            type: "data",
                        });
                        sheet.rows.splice(102, 0, {
                            cells: [
                                {
                                    value: "TOTAL",
                                    colSpan: 2, textAlign: "center"
                                    },
                                    {value: jan+feb+mar+apr+ mei+jun+ jul+ags+sep+ okt+nov+ des, colSpan: 12, textAlign: "center"}
                            ],
                            type: "data",
                        });
                    },
                    selectable: 'row',
                    pageable: true,
                    scrollable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "45px",
                        },
                        {
                            "field": "pelayanan",
                            "title": "Pelayanan",
                            "width": "250px",
                            
                        }, {
                            "field": "januari",
                            "title": "Jan",
                            "width": "40px",
                        }, {
                            "field": "februari",
                            "title": "Feb",
                            "width": "40px",
                        }, {
                            "field": "maret",
                            "title": "Mar",
                            "width": "40px",
                        }, {
                            "field": "april",
                            "title": "Apr",
                            "width": "40px",
                        }, {
                            "field": "mei",
                            "title": "Mei",
                            "width": "40px",
                        }, {
                            "field": "juni",
                            "title": "Juni",
                            "width": "40px",
                        }, {
                            "field": "juli",
                            "title": "Juli",
                            "width": "40px",
                        }, {
                            "field": "agustus",
                            "title": "Agst",
                            "width": "40px",
                        }, {
                            "field": "september",
                            "title": "Sept",
                            "width": "40px",
                        }, {
                            "field": "oktober",
                            "title": "Okt",
                            "width": "40px",
                        }, {
                            "field": "november",
                            "title": "Nov",
                            "width": "40px",
                        }, {
                            "field": "desember",
                            "title": "Des",
                            "width": "40px",
                        }, {
                            "field": "total",
                            "title": "Total",
                            "width": "60px",
                        },
                    ]
                };
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.ListTriwulan = [{
                    id: 1,
                    triwulan: "Ke 1"
                },
                {
                    id: 2,
                    triwulan: "Ke 2"
                },
                {
                    id: 3,
                    triwulan: "Ke 3"
                },
                {
                    id: 4,
                    triwulan: "Ke 4"
                }
            ]

            function LoadDataTW() {
                $scope.isRouteLoading = true;
                var tahun = 'tahun=' + moment($scope.item.tahun).format('YYYY');

                var status = "";
                if ($scope.item.status != undefined) {
                    status = "&status=" + $scope.item.status.id;
                }
                var triwulan = "";
                if ($scope.item.triwulan != undefined) {
                    triwulan = "&triwulan=" + $scope.item.triwulan.id;
                }
                var jan = 0,
                    feb = 0,
                    mar = 0,
                    apr = 0,
                    mei = 0,
                    jun = 0,
                    jul = 0,
                    ags = 0,
                    sep = 0,
                    okt = 0,
                    nov = 0,
                    des = 0,
                    sum = 0;
                medifirstService.get("diklat/get-laporan-pengguna-total-tw?" + tahun + status + triwulan).then(function (data) {
                    var datas = data.data;
                    console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        sum += Number(data.data[i].total)
                        if($scope.item.triwulan.id == 1){
                            console.log(1);
                            jan += Number(data.data[i].satu)
                            feb += Number(data.data[i].dua)
                            mar += Number(data.data[i].tiga)
                        } else if ($scope.item.triwulan.id == 2){
                            apr += Number(data.data[i].satu)
                            mei += Number(data.data[i].dua)
                            jun += Number(data.data[i].tiga)
                        } else if ($scope.item.triwulan.id == 3) {
                            jul += Number(data.data[i].satu)
                            ags += Number(data.data[i].dua)
                            sep += Number(data.data[i].tiga)
                        } else if ($scope.item.triwulan.id == 4) {
                            okt += Number(data.data[i].satu)
                            nov += Number(data.data[i].dua)
                            des += Number(data.data[i].tiga)
                        }
                    }

                    $scope.dataGridTW = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        aggregate: [

                        ],
                        schema: {
                            model: {}
                        }
                    });
                    $scope.isRouteLoading = false;
                });
                if ($scope.item.triwulan.id == 1) {
                    
                    console.log(1);
                    $scope.tw1= true
                    $scope.tw2= false
                    $scope.tw3= false
                    $scope.tw4= false
                    $scope.columnGridTW1 = {
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "rekapInstalasiTW1.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 3;
                            sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                            sheet.name = "Triwulan 1";

                            var myHeaders = [{
                                value: "REKAP PENGGUNA INSTALASI DIKLATLITBANG TRIWULAN I",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders2 = [{
                                value: "RSJ GRHASIA DAERAH ISTIMEWA YOGYAKARTA",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders3 = [{
                                value: "TAHUN " + moment($scope.item.tahun).format('YYYY'),
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            sheet.rows.splice(0, 0, {
                                cells: myHeaders,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(1, 0, {
                                cells: myHeaders2,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(2, 0, {
                                cells: myHeaders3,
                                type: "header",
                                // height: 70
                            });

                            sheet.rows.splice(100, 0, {
                                cells: [{
                                        value: "Jumlah",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: jan
                                    }, {
                                        value: feb
                                    }, {
                                        value: mar
                                    }, {
                                        value: sum,
                                        rowSpan: 2,
                                        textAlign: "center",
                                        verticalAlign: "center"
                                    }
                                ],
                                type: "data",
                            });
                            sheet.rows.splice(101, 0, {
                                cells: [{
                                        value: "TOTAL KESELURUHAN TW I",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: jan + feb + mar,
                                        colSpan: 3,
                                        textAlign: "center"
                                    },

                                ],
                                type: "data",
                            });
                        },
                        selectable: 'row',
                        pageable: true,
                        scrollable: true,
                        columns: [{
                                "field": "no",
                                "title": "No",
                                "width": "45px",
                            },
                            {
                                "field": "pelayanan",
                                "title": "Pelayanan",
                                "width": "250px",

                            }, {
                                "field": "satu",
                                "title": "Januari",
                                "width": "40px",
                            }, {
                                "field": "dua",
                                "title": "Februari",
                                "width": "40px",
                            }, {
                                "field": "tiga",
                                "title": "Maret",
                                "width": "40px",
                            }, {
                                "field": "total",
                                "title": "Total",
                                "width": "60px",
                            },
                        ]
                    };
                } else if ($scope.item.triwulan.id == 2) {
                    $scope.tw1 = false
                    $scope.tw2 = true
                    $scope.tw3 = false
                    $scope.tw4 = false
                    $scope.columnGridTW2 = {
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "rekapInstalasiTW2.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 3;
                            sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                            sheet.name = "Triwulan 1";

                            var myHeaders = [{
                                value: "REKAP PENGGUNA INSTALASI DIKLATLITBANG TRIWULAN II",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders2 = [{
                                value: "RSJ GRHASIA DAERAH ISTIMEWA YOGYAKARTA",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders3 = [{
                                value: "TAHUN " + moment($scope.item.tahun).format('YYYY'),
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            sheet.rows.splice(0, 0, {
                                cells: myHeaders,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(1, 0, {
                                cells: myHeaders2,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(2, 0, {
                                cells: myHeaders3,
                                type: "header",
                                // height: 70
                            });

                            sheet.rows.splice(100, 0, {
                                cells: [{
                                        value: "Jumlah",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: apr
                                    }, {
                                        value: mei
                                    }, {
                                        value: jun
                                    }, {
                                        value: sum,
                                        rowSpan: 2,
                                        textAlign: "center",
                                        verticalAlign: "center"
                                    }
                                ],
                                type: "data",
                            });
                            sheet.rows.splice(101, 0, {
                                cells: [{
                                        value: "TOTAL KESELURUHAN TW II",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: apr + mei + jun,
                                        colSpan: 3,
                                        textAlign: "center"
                                    },

                                ],
                                type: "data",
                            });
                        },
                        selectable: 'row',
                        pageable: true,
                        scrollable: true,
                        columns: [{
                                "field": "no",
                                "title": "No",
                                "width": "45px",
                            },
                            {
                                "field": "pelayanan",
                                "title": "Pelayanan",
                                "width": "250px",

                            }, {
                                "field": "satu",
                                "title": "April",
                                "width": "40px",
                            }, {
                                "field": "dua",
                                "title": "Mei",
                                "width": "40px",
                            }, {
                                "field": "tiga",
                                "title": "Juni",
                                "width": "40px",
                            }, {
                                "field": "total",
                                "title": "Total",
                                "width": "60px",
                            },
                        ]
                    };
                } else if ($scope.item.triwulan.id == 3) {
                    $scope.tw1 = false
                    $scope.tw2 = false
                    $scope.tw3 = true
                    $scope.tw4 = false
                    $scope.columnGridTW3 = {
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "rekapInstalasiTW3.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 3;
                            sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                            sheet.name = "Triwulan 1";

                            var myHeaders = [{
                                value: "REKAP PENGGUNA INSTALASI DIKLATLITBANG TRIWULAN III",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders2 = [{
                                value: "RSJ GRHASIA DAERAH ISTIMEWA YOGYAKARTA",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders3 = [{
                                value: "TAHUN " + moment($scope.item.tahun).format('YYYY'),
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            sheet.rows.splice(0, 0, {
                                cells: myHeaders,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(1, 0, {
                                cells: myHeaders2,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(2, 0, {
                                cells: myHeaders3,
                                type: "header",
                                // height: 70
                            });

                            sheet.rows.splice(100, 0, {
                                cells: [{
                                        value: "Jumlah",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: jul
                                    }, {
                                        value: ags
                                    }, {
                                        value: sep
                                    }, {
                                        value: sum,
                                        rowSpan: 2,
                                        textAlign: "center",
                                        verticalAlign: "center"
                                    }
                                ],
                                type: "data",
                            });
                            sheet.rows.splice(101, 0, {
                                cells: [{
                                        value: "TOTAL KESELURUHAN TW III",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: jul + ags + sep,
                                        colSpan: 3,
                                        textAlign: "center"
                                    },

                                ],
                                type: "data",
                            });
                        },
                        selectable: 'row',
                        pageable: true,
                        scrollable: true,
                        columns: [{
                                "field": "no",
                                "title": "No",
                                "width": "45px",
                            },
                            {
                                "field": "pelayanan",
                                "title": "Pelayanan",
                                "width": "250px",

                            }, {
                                "field": "satu",
                                "title": "Juli",
                                "width": "40px",
                            }, {
                                "field": "dua",
                                "title": "Agustus",
                                "width": "40px",
                            }, {
                                "field": "tiga",
                                "title": "September",
                                "width": "40px",
                            }, {
                                "field": "total",
                                "title": "Total",
                                "width": "60px",
                            },
                        ]
                    };
                } else if ($scope.item.triwulan.id == 4) {
                    $scope.tw1 = false
                    $scope.tw2 = false
                    $scope.tw3 = false
                    $scope.tw4 = true
                    $scope.columnGridTW4 = {
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "rekapInstalasiTW4.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) {
                            var sheet = e.workbook.sheets[0];
                            sheet.frozenRows = 3;
                            sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                            sheet.name = "Triwulan 1";

                            var myHeaders = [{
                                value: "REKAP PENGGUNA INSTALASI DIKLATLITBANG TRIWULAN IV",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders2 = [{
                                value: "RSJ GRHASIA DAERAH ISTIMEWA YOGYAKARTA",
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            var myHeaders3 = [{
                                value: "TAHUN " + moment($scope.item.tahun).format('YYYY'),
                                fontSize: 11,
                                textAlign: "center",
                                background: "#ffffff",
                                // color:"#ffffff"
                            }];
                            sheet.rows.splice(0, 0, {
                                cells: myHeaders,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(1, 0, {
                                cells: myHeaders2,
                                type: "header",
                                // height: 70
                            });
                            sheet.rows.splice(2, 0, {
                                cells: myHeaders3,
                                type: "header",
                                // height: 70
                            });

                            sheet.rows.splice(100, 0, {
                                cells: [{
                                        value: "Jumlah",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: okt
                                    }, {
                                        value: nov
                                    }, {
                                        value: des
                                    }, {
                                        value: sum,
                                        rowSpan: 2,
                                        textAlign: "center",
                                        verticalAlign: "center"
                                    }
                                ],
                                type: "data",
                            });
                            sheet.rows.splice(101, 0, {
                                cells: [{
                                        value: "TOTAL KESELURUHAN TW IV",
                                        colSpan: 2,
                                        textAlign: "center"
                                    },
                                    {
                                        value: okt+nov+des,
                                        colSpan: 3,
                                        textAlign: "center"
                                    },
                                ],
                                type: "data",
                            });
                        },
                        selectable: 'row',
                        pageable: true,
                        scrollable: true,
                        columns: [{
                                "field": "no",
                                "title": "No",
                                "width": "45px",
                            },
                            {
                                "field": "pelayanan",
                                "title": "Pelayanan",
                                "width": "250px",

                            }, {
                                "field": "satu",
                                "title": "Oktober",
                                "width": "40px",
                            }, {
                                "field": "dua",
                                "title": "November",
                                "width": "40px",
                            }, {
                                "field": "tiga",
                                "title": "Desember",
                                "width": "40px",
                            }, {
                                "field": "total",
                                "title": "Total",
                                "width": "60px",
                            },
                        ]
                    };
                }
                
            }
            $scope.Searchtw = function () {
                LoadDataTW()
            }
            //** BATAS SUCI */
        }
        
    ]);
    
});