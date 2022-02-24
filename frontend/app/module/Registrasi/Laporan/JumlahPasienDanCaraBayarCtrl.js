define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('JumlahPasienDanCaraBayarCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
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
                        $scope.listRuangans=data.data.ruanganrajal
                    })

                    medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = false;
                var tahun = moment($scope.item.tahun).format('YYYY');


                var chacePeriode = {
                    0: tahun,

                }
                cacheHelper.set('TargetDanRealisasiKunjunganCtrl', chacePeriode);


                    medifirstService.get("registrasi/laporan/get-data-lap-jumlah-pasien-cara?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridP ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                            {field: "januari", aggregate:"sum"},
                            {field: "februari", aggregate:"sum"},
                            {field: "maret", aggregate:"sum"},
                            {field: "april", aggregate:"sum"},
                            {field: "mei", aggregate:"sum"},
                            {field: "juni", aggregate:"sum"},
                            {field: "juli", aggregate:"sum"},
                            {field: "agustus", aggregate:"sum"},
                            {field: "september", aggregate:"sum"},
                            {field: "oktober", aggregate:"sum"},
                            {field: "november", aggregate:"sum"},
                            {field: "desember", aggregate:"sum"},

                        ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-jumlah-pasien-cara-igd?"
                    + "tahun=" + tahun).then(function (data) {
                        var datas =data.data;
                        console.log(datas)
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.dataSourceGridQ ={
                            data: data.data,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    total: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "total", aggregate:"sum"},
                            {field: "januari", aggregate:"sum"},
                            {field: "februari", aggregate:"sum"},
                            {field: "maret", aggregate:"sum"},
                            {field: "april", aggregate:"sum"},
                            {field: "mei", aggregate:"sum"},
                            {field: "juni", aggregate:"sum"},
                            {field: "juli", aggregate:"sum"},
                            {field: "agustus", aggregate:"sum"},
                            {field: "september", aggregate:"sum"},
                            {field: "oktober", aggregate:"sum"},
                            {field: "november", aggregate:"sum"},
                            {field: "desember", aggregate:"sum"},
                        ]


                        }
                        // $scope.isRouteLoading = false;
                    })




            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    },
                ]
            };


            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Indikator Pelayanan Tahun.xlsx",
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
                        cells: [{ value: "Indikator Pelayanan Tahun", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "ket",
                        "title": "Keterangan",
                        "width": "200px",
                    },
                    {
                        "title": "Bulan",
                        "width": "200px",
                        
                        "columns":
                        [{
                                "field": "januari",
                                "title": "Januari",
                            },
                            {
                                "field": "februari",
                                "title": "Februari",
                            },
                            {
                                "field": "maret",
                                "title": "Maret",
                            },
                            {
                                "field": "april",
                                "title": "April",
                            },
                            {
                                "field": "mei",
                                "title": "Mei",
                            },
                            {
                                "field": "juni",
                                "title": "Juni",
                            },
                            {
                                "field": "juli",
                                "title": "Juli",
                            },
                            {
                                "field": "agustus",
                                "title": "Agustus",
                            },
                            {
                                "field": "september",
                                "title": "September",
                            },
                            {
                                "field": "oktober",
                                "title": "Oktober",
                            },
                            {
                                "field": "november",
                                "title": "November",
                            },
                            {
                                "field": "desember",
                                "title": "Desember",
                            }
                        ],

                    }

                ]
            }

            $scope.columnGridQ = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Indikator Pelayanan Tahun.xlsx",
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
                        cells: [{ value: "Indikator Pelayanan Tahun", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "ket",
                        "title": "Keterangan",
                        "width": "200px"
                    },
                    {
                        "title": "Bulan",
                        "width": "200px",

                        "columns":
                        [{
                                "field": "januari",
                                "title": "Januari",
                                aggregates: ["sum"],
                                template: "#: januari  #",
                                footerTemplate: "#: data.januari.sum #",
                            },
                            {
                                "field": "februari",
                                "title": "Februari",
                                aggregates: ["sum"],
                                template: "#: februari  #",
                                footerTemplate: "#: data.februari.sum #",
                            },
                            {
                                "field": "maret",
                                "title": "Maret",
                                aggregates: ["sum"],
                                template: "#: maret  #",
                                footerTemplate: "#: data.maret.sum #",
                            },
                            {
                                "field": "april",
                                "title": "April",
                                aggregates: ["sum"],
                                template: "#: april  #",
                                footerTemplate: "#: data.april.sum #",
                            },
                            {
                                "field": "mei",
                                "title": "Mei",
                                aggregates: ["sum"],
                                template: "#: mei  #",
                                footerTemplate: "#: data.mei.sum #",


                            },
                            {
                                "field": "juni",
                                "title": "Juni",
                                aggregates: ["sum"],
                                template: "#: juni  #",
                                footerTemplate: "#: data.juni.sum #",
                            },
                            {
                                "field": "juli",
                                "title": "Juli",
                                aggregates: ["sum"],
                                template: "#: juli  #",
                                footerTemplate: "#: data.juli.sum #",
                            },
                            {
                                "field": "agustus",
                                "title": "Agustus",
                                aggregates: ["sum"],
                                template: "#: agustus  #",
                                footerTemplate: "#: data.agustus.sum #",
                            },
                            {
                                "field": "september",
                                "title": "September",
                                aggregates: ["sum"],
                                template: "#: september  #",
                                footerTemplate: "#: data.september.sum #",
                            },
                            {
                                "field": "oktober",
                                "title": "Oktober",
                                aggregates: ["sum"],
                                template: "#: oktober  #",
                                footerTemplate: "#: data.oktober.sum #",
                            },
                            {
                                "field": "november",
                                "title": "November",
                                aggregates: ["sum"],
                                template: "#: november  #",
                                footerTemplate: "#: data.november.sum #",
                            },
                            {
                                "field": "desember",
                                "title": "Desember",
                                aggregates: ["sum"],
                                template: "#: desember  #",
                                footerTemplate: "#: data.desember.sum #",
                            }
                        ],

                    }

                ]
            }




            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.$watch('cari.tahun', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    newVal = moment(newVal).format('YYYY')
                    oldVal = moment(oldVal).format('YYYY')
                    if (newVal != oldVal) {
                        applyFilter("tahuns", newVal)
                    }
                }, 500)
            })



            
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