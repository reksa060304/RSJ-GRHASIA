define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL31KegiatanRawatInapCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY');

                // var idDiagnosaAwal = "";
                // if ($scope.item.diagnosa1 != undefined) {
                //     idDiagnosaAwal = "&idDiagnosaAwal=" + $scope.item.diagnosa1.kddiagnosa;
                // }
                // var idDiagnosaAkhir = "";
                // if ($scope.item.diagnosa2 != undefined) {
                //     idDiagnosaAkhir = "&idDiagnosaAkhir=" + $scope.item.diagnosa2.kddiagnosa;
                // }


              medifirstService.get("registrasi/laporan/get-laporan-rl31?"
                    + "tglAwal=" + tglAwal

                ).then(function (dat) {
                    var datas = dat.data.data
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].kdprov = '0023';
                        datas[i].year = new Date(tglAwal).getFullYear();
                    }
                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: datas,
                        group: $scope.group,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
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
                    fileName: "RL31RawatInap.xlsx",
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
                    var rows = e.workbook.sheets[0].rows;
                    var sheet = e.workbook.sheets[0];
                    // rows.unshift({
                    //     cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP", background: "#fffff" }]
                    // });
                    var columns = e.workbook.sheets[0].columns;
                    delete columns[0].width;
                    columns[0].width = 10;  //0 1 2 4 5 6 
                    delete columns[1].width;
                    columns[1].width = 15;
                    delete columns[2].width;
                    columns[2].width = 15;
                    delete columns[3].width;
                    columns[3].width = 15;
                    delete columns[4].width;
                    columns[4].width = 10;
                    delete columns[5].width;
                    columns[5].width = 5;

                    for(let i = 6; i <= 20; i++){
                        delete columns[i].width;
                        columns[i].width = 30;
                    }

                    for(let i = 0; i < 1; i++){
                        for(let j = 0; j <= 20; j++){
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
                        field: "koders",
                        title: "KODE RS",
                    },
                    {
                        field: "kdprov",
                        title: "KODE PROPINSI",
                    },
                    {
                        field: "namakota",
                        title: "KAB / KOTA",
                    },
                    {
                        field: "namars",
                        title: "NAMA RS",
                    },
                    {
                        field: "year",
                        title: "TAHUN",
                    },
                    {
                        field: "no",
                        title: "NO",
                    },
                    {
                        field: "pelayanan",
                        title: "JENIS PELAYANAN",
                    },
                    {
                        field: "jumlahpasienawal",
                        title: "PASIEN AWAL TAHUN",
                    },
                    {
                        field: "jumlahpasienmasuk",
                        title: "PASIEN MASUK",
                    },
                    {
                        field: "jumlahpasienhidup",
                        title: "PASIEN KELUAR HIDUP",
                    },
                    {
                        field: "jumlahpasienkurang",
                        title: "< 48 JAM",
                    },
                    {
                        field: "jumlahpasienlebih",
                        title: ">= 48 JAM",
                    },
                    {
                        field: "jumlahlamadirawat",
                        title: "JUMLAH LAMA DIRAWAT",
                    },
                    {
                        field: "jumlahpasienakhir",
                        title: "PASIEN AKHIR TAHUN",
                    },
                    {
                        field: "jumlahhariperawatan",
                        title: "JUMLAH HARI PERAWATAN",
                    },
                    {
                        field: "jumlahvvip",
                        title: "VVIP",
                    },
                    {
                        field: "jumlahvip",
                        title: "VIP",
                    },
                    {
                        field: "jumlahsatu",
                        title: "I",
                    },
                    {
                        field: "jumlahdua",
                        title: "II",
                    },
                    {
                        field: "jumlahtiga",
                        title: "III",
                    },
                    {
                        field: "jumlahkhusus",
                        title: "KELAS KHUSUS",
                    }

                ]

            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }



            // modelItemAkuntansi.getDataTableTransaksi("laporan/get-data-combo-rm", true,true,10).then(function (dat) {
            //      $scope.listDiagnosa = dat.diagnosa;
            //   $scope.item.diganosas = {id:$scope.listDiagnosa[0].id,kddiagnosa:$scope.listDiagnosa[0].kddiagnosa}
            //  });
            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }



        }
    ]);
});