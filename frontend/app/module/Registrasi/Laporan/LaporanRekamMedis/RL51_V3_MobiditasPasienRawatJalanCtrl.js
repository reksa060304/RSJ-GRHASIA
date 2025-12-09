define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL51_V3_MobiditasPasienRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
			$scope.item.tglakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:00'));
            $scope.item.jmlRows = 600;

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;


                medifirstService.get("registrasi/laporan/get-laporan-rl51new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir

                ).then(function (dat) {
                    var datas = dat.data.detail
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].kdprov = '32prop';
                        datas[i].kdrs = '3215146';
                        datas[i].year = new Date(tglAwal).getFullYear();
                    }
                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: datas,
                        group: $scope.group,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                        }
                    });

                    $scope.dataExcel = datas;
                })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }




            // $scope.group = {
            //     field: "pendudukdki",
            //     aggregates: [{
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }, {
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }]
            // };
            // $scope.aggregate = [{
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }, {
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }]
            // var record = 0;
            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL5.1 DATA KEADAAN MORBIDITAS PASIEN RAWAT JALAN" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + " - " + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                // groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT JALAN", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        field: "no",
                        title: "No. Urut",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "70px"
                    },
                    {
                        field: "kddiagnosa",
                        title: "Kode ICD",
                        width: "100px",
                        template: "<span class='style-center'>#: kddiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosis Penyakit",
                        width: "150px",
                        template: "<span class='style-center'>#: namadiagnosa #</span>",
                        // headerAttributes: { style: "text-align : center" },
                    },
                    {
                        title: "Jumlah Pasien Hidup dan Mati menurut Golongan Umur & Jenis Kelamin",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {

                                title: "< 1 Jam",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlahkurang1jaml",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlahkurang1jamp",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "1 - 23 Jam",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlahkurang23jaml",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlahkurang23jamp",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "1 - 7 Hari",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah17hl",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah17hp",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "8 - 28 Hari",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah828hl",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah828hp",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "29 Hari - <3 Bulan",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah293l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah293p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "3 - <6 Bulan",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah36l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah36p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {
                                title: "6 - 11 Bulan",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah611l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah611p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "1 - 4 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah14l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah14p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {
                                title: "5 - 9 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah59l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah59p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {
                                title: "10 - 14 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah1014l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah1014p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "15 - 19 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah1519l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah1519p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {
                                title: "20 - 24 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah2024l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah2024p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "25 - 29 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah2529l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah2529p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "30 - 34 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah3034l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah3034p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "35 - 39 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah3539l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah3539p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "40 - 44 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah4044l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah4044p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "45 - 49 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah4549l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah4549p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "50 - 54 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah5054l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah5054p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "55 - 59 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah5559l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah5559p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "60 - 64 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah6064l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah6064p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "65 - 69 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah6569l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah6569p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "70 - 74 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah7074l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah7074p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "75 - 79 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah7579l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah7579p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "80 - 84 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah8084l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah8084p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                            {

                                title: "≥ 85 Tahun",
                                headerAttributes: { style: "text-align : center" },
                                columns:
                                    [
                                        {
                                            field: "jumlah85l",
                                            title: "L",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        },
                                        {
                                            field: "jumlah85p",
                                            title: "P",
                                            width: "40px",
                                            headerAttributes: { style: "text-align : center" }
                                        }
                                    ]
                            },
                        ]
                    },

                    {
                        title: "Jumlah Pasien Hidup dan Mati Menurut Jenis Kelamin",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "hiduplaki",
                                title: "LK",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "hidupperempuan",
                                title: "PR",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "jumlahhiduppl",
                                title: "T",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
                    },
                    {
                        title: "Jumlah Pasien Keluar Mati",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "matilaki",
                                title: "LK",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "matiperempuan",
                                title: "PR",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "matipl",
                                title: "T",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
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