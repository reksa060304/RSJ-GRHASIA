define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSummaryCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                 medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganrajal;
                    })

                    medifirstService.get("registrasi/get-data-combo-new", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listJenisPelayanan = data.data.jenispelayanan;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }

                var tempJenPelId = "";
                if ($scope.item.jenisPelayanan != undefined) {
                    tempJenPelId = "&jenisPelayanan=" + $scope.item.jenisPelayanan.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-lap-summary-hambatan-komunikasi?" 
                + "tglAwal=" + tglAwal + "&tglAkhir=" 
                + tglAkhir + tempRuanganId 
                + tempKelPasienId + tempJenPelId).then(function (data) {
                    var data1 = data.data.detail;
                    var totalhambatan = 0;
                    var totaletnis = 0;
                    var totalbahasa = 0;
                    for(var i = 0; i < data1.length; i++){
                        totalhambatan = totalhambatan + data1[i].totalhambatan;
                        totaletnis = totaletnis + data1[i].totaletnis;
                        totalbahasa = totalbahasa + data1[i].totalbahasa;
                    }
                    $scope.totalhambatan = totalhambatan;
                    $scope.totaletnis = totaletnis;
                    $scope.totalbahasa = totalbahasa;
                    $scope.dataSourceGrid = new kendo.data.DataSource({
                        data: data1,
                        allPages:true,
                        pageSize: 30,
                        total: data1.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        },
                        aggregate: [
                            {
                                field: "gangguanpendengaran",
                                aggregate: "sum"
                            }, {
                                field: "gangguanpenglihatan",
                                aggregate: "sum"
                            }, {
                                field: "gangguanbicara",
                                aggregate: "sum"
                            }, {
                                field: "gangguanlainnya",
                                aggregate: "sum"
                            }, {
                                field: "tidakada",
                                aggregate: "sum"
                            }, {
                                field: "daerah",
                                aggregate: "sum"
                            }, {
                                field: "indonesia",
                                aggregate: "sum"
                            }, {
                                field: "asing",
                                aggregate: "sum"
                            }, {
                                field: "isyarat",
                                aggregate: "sum"
                            }, {
                                field: "lainnya1",
                                aggregate: "sum",
                            }, {
                                field: "jawa",
                                aggregate: "sum"
                            }, {
                                field: "sunda",
                                aggregate: "sum"
                            }, {
                                field: "tionhoa",
                                aggregate: "sum"
                            }, {
                                field: "papua",
                                aggregate: "sum"
                            }, {
                                field: "lainnya2",
                                aggregate: "sum"
                            }, {
                                field: "batak",
                                aggregate: "sum",
                            }
                        ],
                    });
                });
                $scope.columnGrid = {
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.mergedCells = ["A1:Q1"];
                        sheet.frozenRows = 3;
                        sheet.name = "Report";
                        var myHeaders = [{
                            value: "Rekap Data Kunjungan Rawat Jalan",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                        }];
                        var total = {
                            value: "TOTAL",

                        };
                        var hambatan = {
                            value: $scope.totalhambatan,
                            colSpan: 5,
                            textAlign: "center"
                        }
                        var etnis = {
                            value: $scope.totaletnis,
                            colSpan: 6,
                            textAlign: "center"
                        }
                        var bahasa = {
                            value: $scope.totalbahasa,
                            colSpan: 5,
                            textAlign: "center"
                        }
                        var kethambatan = {
                            value: "1. Gangguan pendengaran \n2. Gangguan penglihatan \n3. Gangguan bicara \n4. Gangguan lainnya \n5. Tidak ada ",
                            colSpan: 3,
                            verticalAlign: "top",
                            wrap: true
                        }
                        var ketetnis = {
                            value: "1. Jawa \n2. Sunda \n3. Batak \n4. Tionghoa \n5. Papua \n6. Lainnya ",			
                            colSpan: 2,
                            verticalAlign: "top",
                            wrap: true,
                        }
                        var ketbahasa = {
                            value: "1. Daerah \n2. Indonesia \n3. Isyarat \n4. Asing \n5. Lainnya",
                            colSpan: 2,
                            verticalAlign: "top",
                            wrap: true,			

                        }
                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            height: 60
                        });
                        sheet.rows.splice(35, 0, {
                            cells: [total, hambatan, bahasa,etnis ],
                            type: "data"
                        })
                        sheet.rows.splice(36, 0, {
                            cells: [{
                                    value: "Ket : ",
                                    verticalAlign: "top"
                                }, {
                                    value: "Hambatan Komunikasi",
                                    verticalAlign: "top",
                                    wrap: true
                                },
                                kethambatan,
                                {
                                    value: "Etnis",
                                    verticalAlign: "top",
                                }, ketetnis,
                                {
                                    value: "Bahasa",
                                    verticalAlign: "top",
                                }, ketbahasa
                            ],
                            height: 130
                            })
                        //sheet.rows.splice(30, 0, { cells: ttlpasiens, type: "data", height: 40 });

                    },
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "Laporan Rekap Data Kunjungan Demografi.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                        sortable: true,
                        pageable: true,
                        resizable: true,
                    columns: 
                    [

                        {
                            field : "namaruangan",
                            "title": "POLIKLINIK",
                            "width": "100px",
                            footerTemplate: "SUB TOTAL"
                        },
                        {
                            "title": "Hambatan Komunikasi",
                            "width": "200px",
                            headerAttributes: {
                                style: "text-align : center"
                            },
                            "columns": 
                            [{
                                field: "gangguanpendengaran",
                                "title": "1",
                                "width": "75px",
                                aggregates: ["sum"],        
                                 groupFooterTemplate: "#=data.gangguanpendengaran.sum  #",
                                footerTemplate: "#:data.gangguanpendengaran.sum  #"
                            },
                            {
                                field:"gangguanpenglihatan",
                                "title": "2",
                                "width": "75px",
                                aggregates: ["sum"],
                                groupFooterTemplate: "#=data.gangguanpenglihatan.sum  #",
                                footerTemplate: "#:data.gangguanpenglihatan.sum  #"
                            },
                            {
                                field:"gangguanbicara",
                                "title": "3",
                                "width": "75px",
                                aggregates: ["sum"],
                                groupFooterTemplate: "#=data.gangguanbicara.sum  #",
                                footerTemplate: "#:data.gangguanbicara.sum  #"
                            },
                            {
                                field:"gangguanlainnya",
                                "title": "4",
                                "width": "75px",
                                aggregates: ["sum"],
                                groupFooterTemplate: "#=data.gangguanlainnya.sum  #",
                                footerTemplate: "#:data.gangguanlainnya.sum  #"
                            },
                            {
                                field: "tidakada",
                                "title": "5",
                                "width": "75px",
                                aggregates: ["sum"],
                                groupFooterTemplate: "#=data.tidakada.sum  #",
                                footerTemplate: "#:data.tidakada.sum  #"
                            }],
                        },
                        {
                            "title": "Bahasa",
                            "width": "200px",
                            headerAttributes: {
                                style: "text-align : center"
                            },
                            "columns": [{
                                    "field": "daerah",
                                    "title": "1",
                                    "width": "75px",
                                    aggregates: ["sum"],        
                                    groupFooterTemplate: "#=data.daerah.sum  #",
                                    footerTemplate: "#:data.daerah.sum  #"
                                },
                                {
                                    "field": "indonesia",
                                    "title": "2",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.indonesia.sum  #",
                                    footerTemplate: "#:data.indonesia.sum  #"
                                },
                                {
                                    "field": "isyarat",
                                    "title": "3",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.isyarat.sum  #",
                                    footerTemplate: "#:data.isyarat.sum  #"
                                },
                                {
                                    "field":"asing",
                                    "title": "4",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.asing.sum  #",
                                    footerTemplate: "#:data.asing.sum  #"
                                },
                                {
                                    "field": "lainnya1",
                                    "title": "5",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.lainnya1.sum  #",
                                    footerTemplate: "#:data.lainnya1.sum  #"
                                },
                                
                            ],
                        },
                        {
                            "title": "Etnis",
                            "width": "200px",
                            headerAttributes: {
                                style: "text-align : center"
                            },
                            "columns": [{
                                    "field": "jawa",
                                    "title": "1",
                                    "width": "75px",
                                    aggregates: ["sum"],        
                                    groupFooterTemplate: "#=data.jawa.sum  #",
                                    footerTemplate: "#:data.jawa.sum  #"
                                },
                                {
                                    "field": "sunda",
                                    "title": "2",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.sunda.sum  #",
                                    footerTemplate: "#:data.sunda.sum  #"
                                },
                                {
                                    "field": "batak",
                                    "title": "3",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.batak.sum  #",
                                    footerTemplate: "#:data.batak.sum  #"
                                },
                                {
                                    "field": "tionhoa",
                                    "title": "4",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.tionhoa.sum  #",
                                    footerTemplate: "#:data.tionhoa.sum  #"
                                },
                                {
                                    "field": "papua",
                                    "title": "5",
                                    "width": "75px",
                                    aggregates: ["sum"],
                                    groupFooterTemplate: "#=data.papua.sum  #",
                                    footerTemplate: "#:data.papua.sum  #"
                                },
                                {
                                    "field": "lainnya2",
                                    "title": "6",
                                    "width": "75px",
                                    aggregates: ["sum"],        
                                    groupFooterTemplate: "#=data.lainnya2.sum  #",
                                    footerTemplate: "#:data.lainnya2.sum  #"
                                }
                            ],
                        },

                    ]
                }

            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            // $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };
            $scope.columnGridK = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Kunjungan.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:Q1"];
                    sheet.frozenRows = 3;
                    var myHeaders = [{
                        value: "Laporan Rekap Data Kunjungan Demografi Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];
                    sheet.rows.splice(35,0, {cells: myHeaders, type: "header", height: 70});
                    sheet.rows.splice()
                },      
                columns: [
                    
                     {
                        "field": "namaruangan",
                        "title": "Poliklinik",
                        "width": "100px",
                        
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "Baru",
                            "width": "100px",
                            headerAttributes: { style: "text-align : center" },
                            "columns":[
                                {
                                    "field" : "lakibaru",
                                    "title" : "L",
                                    "width": "75px",
                                    // aggregates: ["sum"],        
                                    //  groupFooterTemplate: "#=data.laki.sum  #",
                                    // footerTemplate: "#:data.laki.sum  #"
                                    
                                }, 
                                {
                                    "field" : "wanitabaru",
                                    "title" : "P",
                                    "width": "75px",
                                    // aggregates: ["sum"],
                                    // groupFooterTemplate: "#=data.wanita.sum  #",
                                    // footerTemplate: "#:data.wanita.sum  #"
                                }
                            ]
                        }, {
                            "field" : "Lama",
                            "width": "100px",
                            headerAttributes: { style: "text-align : center" },
                            "columns":[
                                {
                                    "field" : "lakilama",
                                    "title" : "L",
                                    "width": "75px",
                                    // aggregates: ["sum"],        
                                    //  groupFooterTemplate: "#=data.laki.sum  #",
                                    // footerTemplate: "#:data.laki.sum  #"
                                    
                                }, 
                                {
                                    "field" : "wanitalama",
                                    "title" : "P",
                                    "width": "75px",
                                    // aggregates: ["sum"],
                                    // groupFooterTemplate: "#=data.wanita.sum  #",
                                    // footerTemplate: "#:data.wanita.sum  #"
                                }
                            ]
                        }
                        ]
                    }, 
                    {
                        "field": "jml",
                        "title": "Jumlah",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                    },
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                     
                //     {
                //     hidden: true,
                //     field: "namaruangan",
                //     title: "Nama Ruangan",
                //     aggregates: ["count"],
                //     groupHeaderTemplate: "   #= value #    "
                // }

                ]
            }


            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pendidikan.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pendidikan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "pendidikan",
                        "title": "Jenjang Pendidikan",
                        "width": "100px",
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },

                ]
            }

            //  $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };


            $scope.aggregate = [
                {
                    field: "jumlah",
                    aggregate: "sum"
                }
            ]

            $scope.columnGridD = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Daerah.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Daerah)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "namakotakabupaten",
                        "title": "Kabupaten/Kota Madya",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                ]
            }

            $scope.aggregate = [
                {
                    field: "jumlah",
                    aggregate: "sum"
                }
            ]

            $scope.columnGridPek = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pekerjaan.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pekerjaan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },

                ]
            }

            $scope.columnGridUsia = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Jalan - Usia.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Jalan (Usia)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                            "field": "no",
                            "title": "No",
                            "width": "75px",
                            footerTemplate: "Total",
                            attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        } 
                        },
                        {
                            "field": "usia",
                            "title": "Usia",

                        },
                        {
                            "field": "jml",
                            "title": "Jumlah",
                            aggregates: ["sum"],
                            footerTemplate: "#: data.jml.sum #",

                        }
                ]

            }

            $scope.columnGridAg = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "agama",
                        "title": "Agama",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                ]
            }

            $scope.columnGridKjT = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "bulan",
                        "title": "Bulan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                ]
            }



            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
            }
            $scope.ClearData = function(){
                $scope.item.kelompokPasien = undefined;
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.SearchData();
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
            



            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


        }
    ]);
});