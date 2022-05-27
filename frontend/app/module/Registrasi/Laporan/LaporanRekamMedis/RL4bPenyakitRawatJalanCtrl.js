define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL4bPenyakitRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY');

                // var idDiagnosaAwal = "";
                // if ($scope.item.diagnosa1 != undefined) {
                //     idDiagnosaAwal = "&idDiagnosaAwal=" + $scope.item.diagnosa1.kddiagnosa;
                // }
                // var idDiagnosaAkhir = "";
                // if ($scope.item.diagnosa2 != undefined) {
                //     idDiagnosaAkhir = "&idDiagnosaAkhir=" + $scope.item.diagnosa2.kddiagnosa;
                // }


                  medifirstService.get("registrasi/laporan/get-laporan-rl4b?"
                    + "tglAwal=" + tglAwal
                ).then(function (dat) {
                    var datas = dat.data.detail
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].kdprov = '24';
                        datas[i].koders = '3404022';
                        datas[i].year = new Date(tglAwal).getFullYear();
                    }
                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: datas,
                        group: $scope.group,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlahumur0hs6hl: { type: "number" },
                                    jumlahumur0hs6hp: { type: "number" },
                                    jumlahumur7hs28hl: { type: "number" },
                                    jumlahumur7hs28hp: { type: "number" },
                                    jumlahumur29hs1tl: { type: "number" },
                                    jumlahumur29hs1tp: { type: "number" },
                                    jumlahumur2ts4tl: { type: "number" },
                                    jumlahumur2ts4tp: { type: "number" },
                                    jumlahumur5ts14tl: { type: "number" },
                                    jumlahumur5ts14tp: { type: "number" },
                                    jumlahumur15ts24tl: { type: "number" },
                                    jumlahumur15ts24tp: { type: "number" },
                                    jumlahumur25ts44tl: { type: "number" },
                                    jumlahumur25ts44tp: { type: "number" },
                                    jumlahumur45ts64tl: { type: "number" },
                                    jumlahumur45ts64tp: { type: "number" },
                                    jumlahumurlebih64l: { type: "number" },
                                    jumlahumurlebih64p: { type: "number" },
                                    jumlahpasienkeluarhml: { type: "number" },
                                    jumlahpasienkeluarhmp: { type: "number" },
                                    totalpasienkeluarhm: { type: "number" },
                                    jumlahpasienkeluarmati: { type: "number" },
                                }
                            }
                        },aggregate: [
                            { field: 'jumlahumur0hs6hl', aggregate: 'sum' },
                            { field: 'jumlahumur0hs6hp', aggregate: 'sum' },
                            { field: 'jumlahumur7hs28hl', aggregate: 'sum' },
                            { field: 'jumlahumur7hs28hp', aggregate: 'sum' },
                            { field: 'jumlahumur29hs1tl', aggregate: 'sum' },
                            { field: 'jumlahumur29hs1tp', aggregate: 'sum' },
                            { field: 'jumlahumur2ts4tl', aggregate: 'sum' },
                            { field: 'jumlahumur2ts4tp', aggregate: 'sum' },
                            { field: 'jumlahumur5ts14tl', aggregate: 'sum' },
                            { field: 'jumlahumur5ts14tp', aggregate: 'sum' },
                            { field: 'jumlahumur15ts24tl', aggregate: 'sum' },
                            { field: 'jumlahumur15ts24tp', aggregate: 'sum' },
                            { field: 'jumlahumur25ts44tl', aggregate: 'sum' },
                            { field: 'jumlahumur25ts44tp', aggregate: 'sum' },
                            { field: 'jumlahumur45ts64tl', aggregate: 'sum' },
                            { field: 'jumlahumur45ts64tp', aggregate: 'sum' },
                            { field: 'jumlahumurlebih64l', aggregate: 'sum' },
                            { field: 'jumlahumurlebih64p', aggregate: 'sum' },
                            { field: 'jumlahpasienkeluarhml', aggregate: 'sum' },
                            { field: 'jumlahpasienkeluarhmp', aggregate: 'sum' },
                            { field: 'totalpasienkeluarhm', aggregate: 'sum' },
                            { field: 'jumlahpasienkeluarmati', aggregate: 'sum' },
                        ]
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




   
            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL4BRawatJalan.xlsx",
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
                    var sheet = e.workbook.sheets[0];
                    // rows.unshift({
                    //     cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP", background: "#fffff" }]
                    // });
                    var columns = e.workbook.sheets[0].columns;
                    delete columns[0].width;
                    columns[0].width = 100;  //0 1 2 4 5 6 
                    delete columns[1].width;
                    columns[1].width = 100;
                    delete columns[2].width;
                    columns[2].width = 100;
                    delete columns[3].width;
                    columns[3].width = 150;
                    delete columns[4].width;
                    columns[4].width = 75;
                    delete columns[5].width;
                    columns[5].width = 75;
                    delete columns[6].width;
                    columns[6].width = 75;
                    delete columns[7].width;
                    columns[7].width = 180;
                    delete columns[8].width;
                    columns[8].width = 250;
                    for(let i = 9; i <= 30; i++){
                        delete columns[i].width;
                        columns[i].width = 500;
                    }

                    for(let i = 0; i < 1; i++){
                        for(let j = 0; j <= 30; j++){
                            sheet.rows[i].cells[j].background = '#ffffff';
                            sheet.rows[i].cells[j].color = '#000000';
                            sheet.rows[i].cells[j].textAlign = 'center';
                        }
                        sheet.rows[0].height = 50;
                    }

                    for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                    }
                   
                },
                columns: [
                    {
                        field: "kdprov",
                        title: "Kode Propinsi",
                        width: "150px"
                    },
                    {
                        field: "namakota",
                        title: "KAB / KOTA",
                        width: "150px"
                    },
                    {
                        field: "koders",
                        title: "KODE RS",
                        width: "150px"
                    },
                    {
                        field: "namalengkap",
                        title: "NAMA RS",
                        width: "150px"
                    },
                    {
                        field: "year",
                        title: "TAHUN",
                        width: "150px"
                    },
                    {
                        field: "no",
                        title: "NO URUT",
                        width: "150px"
                    },
                    {
                        field: "nodtd",
                        title: "NO DTD",
                        width: "150px"
                    },
                    {
                        field: "nodaftarterperinci",
                        title: "NO DAFTAR TERPERINCI",
                        width: "150px"
                    },
                    {
                        field: "golongansebabpenyakit",
                        title: "GOLONGAN SEBAB PENYAKIT",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur0hs6hl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & JSEX_0-<=6hr_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur0hs6hp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & JSEX_0-<=6hr_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur7hs28hl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>6-<=28hr_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur7hs28hp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>6-<=28hr_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur29hs1tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>28hr-<=1th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur29hs1tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>28hr-<=1th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur2ts4tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>1-<=4th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur2ts4tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>1-<=4th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur5ts14tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>4-<=14th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur5ts14tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>4-<=14th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur15ts24tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>14-<=24th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur15ts24tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>14-<=24th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur25ts44tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>24-<=44th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur25ts44tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>24-<=44th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur45ts64tl",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>44-<=64th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumur45ts64tp",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>44-<=64th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahumurlebih64l",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>64th_L",
                        width: "150px"
                    },
                    {
                        field: "jumlahumurlebih64p",
                        title: "JMLH PAS. YG HIDUP & MATI MENURUT GOL UMUR & SEX_>64th_P",
                        width: "150px"
                    },
                    {
                        field: "jumlahpasienkeluarhml",
                        title: "PASIEN KELUAR (HIDUP & MATI) MENURUT JENIS KELAMIN_LK",
                        width: "150px"
                    },
                    {
                        field: "jumlahpasienkeluarhmp",
                        title: "PASIEN KELUAR (HIDUP & MATI) MENURUT JENIS KELAMIN_PR",
                        width: "150px"
                    },
                    {
                        field: "totalpasienkeluarhm",
                        title: "JUMLAH PASIEN KELUAR HIDUP & MATI (23 + 24)",
                        width: "150px"
                    },
                    {
                        field: "jumlahpasienkeluarmati",
                        title: "JUMLAH PASIEN KELUAR MATI",
                        width: "150px"
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