define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarJamPelatihanKaryawanCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
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

            $scope.Liststatus = [
                {
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
              
                var tahun = 'tahun='+moment($scope.item.tahun).format('YYYY');

                var status = "";
                if ($scope.item.status != undefined) {
                    status = "&status=" + $scope.item.status.id;
                }
                    
                var sumakujanuari = 0,sumakufebruari = 0,sumakumaret = 0,sumakuapril = 0,sumakumei = 0,sumakujuni =0,
                sumakujuli = 0,sumakuagustus = 0,sumakuseptember = 0,sumakuoktober = 0,sumakunovember = 0,sumakudesember = 0
                var count = 0;
                medifirstService.get("sdm/get-datajampelatihan-pegawai?"+ tahun+status).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.data;
                    count = data.data.count.length;
                    console.log(count);
                    console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        // sumakufebruari += datas[i].akufebruari
                        // sumakumaret += datas[i].akumaret
                        // sumakuapril += datas[i].akuapril
                        // sumakumei += datas[i].akumei
                        // sumakujuni += datas[i].akujuni
                        // sumakujuli += datas[i].akujuli
                        // sumakuagustus += datas[i].akuagustus
                        // sumakuseptember += datas[i].akuseptember
                        // sumakuoktober += datas[i].akuoktober
                        if (datas[i].akujanuari >= 20) {
                            sumakujanuari += 1
                        }
                        if(datas[i].akufebruari >= 20){
                            sumakufebruari += 1
                        }
                        if(datas[i].akumaret >= 20){
                            sumakumaret += 1
                        }
                        if(datas[i].akuapril >= 20){
                            sumakuapril += 1
                        }
                        if(datas[i].akumei >= 20){
                            sumakumei += 1
                        }
                        if(datas[i].akujuni >= 20){
                            sumakujuni += 1
                        }
                        if(datas[i].akujuli >= 20){
                            sumakujuli += 1
                        }
                        if(datas[i].akuagustus >= 20){
                            sumakuagustus += 1
                        }
                        if(datas[i].akuseptember >= 20){
                            sumakuseptember += 1
                        }
                        if(datas[i].akuoktober >= 20){
                            sumakuoktober += 1
                        }
                        if(datas[i].akunovember >= 20){
                            sumakunovember += 1
                        }
                        if(datas[i].akudesember >= 20){
                            sumakudesember += 1
                        }

                    }
                    
                    console.log(sumakujanuari,sumakufebruari,sumakumaret,sumakuapril,sumakumei,sumakujuni,sumakujuli,sumakuagustus,sumakuseptember,sumakuoktober,sumakunovember,sumakudesember);
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        aggregate: [
                            // {field: "januari",aggregate: "sum"},
                            // {field: "februari",aggregate: "sum"},
                            // {field: "maret",aggregate: "sum"},
                            // {field: "april",aggregate: "sum"},
                            // {field: "mei",aggregate: "sum"},
                            // {field: "juni",aggregate: "sum"},
                            // {field: "juli",aggregate: "sum"},
                            // {field: "agustus",aggregate: "sum"},
                            // {field: "september",aggregate: "sum"},
                            // {field: "oktober",aggregate: "sum"},
                            // {field: "november",aggregate: "sum"},
                            // {field: "desember",aggregate: "sum"},
                            // {field: "jumlah",aggregate: "sum"},
                            // {field: "lebih20jam",aggregate: "sum"},
                            // {field: "kurang20jam",aggregate: "sum"},
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
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:AA1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "RATA - RATA JAM PELATIHAN KARYAWAN",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                            // color:"#ffffff"
                        }];
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                        sheet.rows.splice(3000, 0, {
                            cells: [{
                                        value: ""
                                    }, {
                                        value: "Data pegawai > 20 jam",}, {value: "",}, 
                            {value: "",
                                // colSpan: 2,verticalAlign: "top",
                            }, {value: sumakujanuari,}, {},{value:sumakufebruari},{}, {value: sumakumaret},{},{value: sumakuapril},{},{value: sumakumei},{},{value: sumakujuni},
                            {},{value: sumakujuli},{},{value: sumakuagustus},{},{value: sumakuseptember},{},{value: sumakuoktober},{},{value: sumakunovember},
                            {},{value: sumakudesember}],
                            type: "data",
                        });
                        sheet.rows.splice(3001, 0, {
                            cells: [{
                                    value: ""
                                }, {
                                    value: "Total Akumulasi Karyawan > 20 jam / jumlah karyawan *100%",
                                }, {
                                    value: "",
                                },{
                                    value: "",
                                    // colSpan: 2,verticalAlign: "top",
                                }, {
                                    value: ((sumakujanuari / count) * 100).toFixed(2) + "%",
                                }, {}, {
                                    value: ((sumakufebruari / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakumaret / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakuapril / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakumei / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakujuni / count) * 100).toFixed(2) + "%"
                                },
                                {}, {
                                    value: ((sumakujuli / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakuagustus / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakuseptember / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakuoktober / count) * 100).toFixed(2) + "%"
                                }, {}, {
                                    value: ((sumakunovember / count) * 100).toFixed(2) + "%"
                                },
                                {}, {
                                    value: ((sumakudesember / count) * 100).toFixed(2) + "%"
                                }
                            ],
                            type: "data",
                        });
                    },
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "45px",

                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama Karyawan",
                            "width": "100px",
                        },
                        {
                            "field": "nippns",
                            "title": "NIP PNS/PTT/BLUD/OS",
                            "width": "100px",
                        },
                        {
                            "title": "JAM PELATIHAN KARYAWAN",
                            "columns": [{
                                    "field": "jumlahjanuari",
                                    "title": "Jan",
                                    "width": "50px",
                                    columns: [{
                                        field: "januari",
                                        title: "SUM Jan",
                                        "width": "50px",
                                    }, {
                                        field: "akujanuari",
                                        title: "AK Jan",
                                        "width": "50px",

                                    }]
                                },
                                {
                                    // "field": "jumlahfebruari",
                                    "title": "Feb",
                                    "width": "50px",
                                    columns: [{
                                        field: "februari",
                                        title: "SUM Feb",
                                        "width": "50px",

                                    }, {
                                        field: "akufebruari",
                                        title: "AK Feb",
                                        "width": "50px",

                                    }]
                               
                                },
                                {
                                    // "field": "jumlahmaret",
                                    "title": "Mar",
                                    "width": "50px",
                                    columns: [{
                                        field: "maret",
                                        title: "SUM Mar",
                                        "width": "50px",

                                    }, {
                                        field: "akumaret",
                                        title: "AK Mar",
                                        "width": "50px",

                                    }]
                                    
                                },
                                {
                                    "title": "Apr",
                                    "width": "50px",
                                    columns: [{
                                        field: "april",
                                        title: "SUM Apr",
                                        "width": "50px",
                                    }, {
                                        field: "akuapril",
                                        title: "AK Apr",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Mei",
                                    "width": "50px",
                                    columns: [{
                                        field: "mei",
                                        title: "SUM Mei",
                                        "width": "50px",
                                    }, {
                                        field: "akumei",
                                        title: "AK Mei",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Jun",
                                    "width": "50px",
                                    columns: [{
                                        field: "juni",
                                        title: "SUM Jun",
                                        "width": "50px",
                                    }, {
                                        field: "akujuni",
                                        title: "AK Jun",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Jul",
                                    "width": "50px",
                                    columns: [{
                                        field: "juli",
                                        title: "SUM Jul",
                                        "width": "50px",
                                    }, {
                                        field: "akujuli",
                                        title: "AK Jul",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Ags",
                                    "width": "50px",
                                    columns: [{
                                        field: "agustus",
                                        title: "SUM Ags",
                                        "width": "50px",
                                    }, {
                                        field: "akuagustus",
                                        title: "AK Ags",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Sep",
                                    "width": "50px",
                                    columns: [{
                                        field: "september",
                                        title: "SUM Sep",
                                        "width": "50px",
                                    }, {
                                        field: "akuseptember",
                                        title: "AK Sep",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Okt",
                                    "width": "50px",
                                    columns: [{
                                        field: "oktober",
                                        title: "SUM Okt",
                                        "width": "50px",
                                    }, {
                                        field: "akuoktober",
                                        title: "AK Okt",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Nov",
                                    "width": "50px",
                                    columns: [{
                                        field: "november",
                                        title: "SUM Nov",
                                        "width": "50px",
                                    }, {
                                        field: "akunovember",
                                        title: "AK Nov",
                                        "width": "50px",
                                    }]
                                },
                                {
                                    "title": "Des",
                                    "width": "50px",
                                    columns: [{
                                        field: "desember",
                                        title: "SUM Des",
                                        "width": "50px",
                                    }, {
                                        field: "akudesember",
                                        title: "AK Des",
                                        "width": "50px",
                                    }]
                                },
                            ]
                        },
                        // {
                        //     "field": "lebih20jam",
                        //     "title": "> / = 20 jam",
                        //     "width": "50px",
                        //     aggregates: ["sum"],
                        //     template: "#: lebih20jam == null ? 0 : lebih20jam  #",
                        //     footerTemplate: "#: data.lebih20jam.sum == null ? 0 : data.lebih20jam.sum #",
                        // },

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

            

            // $scope.data2 = function (dataItem) {
            //     for (var i = 0; i < dataItem.details.length; i++) {
            //         // dataItem.details[i].statCheckbox = false;
            //         dataItem.details[i].no = i + 1
            //     }
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [{
            //                 "field": "no",
            //                 "title": "No",
            //                 "width": "25px",
            //             },
            //             {
            //                 "field": "nippns",
            //                 "title": "Komponen Harga",
            //                 "width": "120px",
            //             },
            //             {
            //                 "field": "namalengkap",
            //                 "title": "Harga",
            //                 "width": "100px",
            //                 "template": "<span class='style-right'>#: hargasatuan #</span>"
            //             }
            //         ]
            //     }
            // };
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            //** BATAS SUCI */
        }
    ]);
});