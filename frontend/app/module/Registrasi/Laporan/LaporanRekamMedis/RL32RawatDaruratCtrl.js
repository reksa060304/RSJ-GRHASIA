define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL32RawatDaruratCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

               medifirstService.get("registrasi/laporan/get-laporan-rl32?"
               + "tglAwal=" + tglAwal
               + "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    var totaljumlahrujukanfix = 0;
                    var totaljumlahnonrujukanfix = 0;
                    var totaljumlahdirawatfix = 0;
                    var totaljumlahdirujukfix = 0;
                    var totaljumlahpulangfix = 0;
                    var totaljumlahmeninggalfix = 0;
                    for(var i = 0; i < data.data.length; i++){

                        if(data.data[i].namaruangan != 'TOTAL'){
                            data.data[i].no = i + 1;
                        } else{
                            data.data[i].no = 99;
                        }

                        totaljumlahrujukanfix += parseInt(data.data[i].jumlahrujukanfix)
                        totaljumlahnonrujukanfix += parseInt(data.data[i].jumlahnonrujukanfix)
                        totaljumlahdirawatfix += parseInt(data.data[i].jumlahdirawatfix)
                        totaljumlahdirujukfix += parseInt(data.data[i].jumlahdirujukfix)
                        totaljumlahpulangfix += parseInt(data.data[i].jumlahpulangfix)
                        totaljumlahmeninggalfix += parseInt(data.data[i].jumlahmeninggalfix)

                        if(data.data[i].namaruangan == 'TOTAL'){
                            data.data[i].jumlahrujukanfix = totaljumlahrujukanfix 
                            data.data[i].jumlahnonrujukanfix = totaljumlahnonrujukanfix 
                            data.data[i].jumlahdirawatfix = totaljumlahdirawatfix 
                            data.data[i].jumlahdirujukfix = totaljumlahdirujukfix 
                            data.data[i].jumlahpulangfix = totaljumlahpulangfix 
                            data.data[i].jumlahmeninggalfix = totaljumlahmeninggalfix 
                        }

                        data.data[i].doa = '0';
                    }
                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data,
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
                    $scope.dataExcel = data.data;
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
                    fileName: "RL1.3_TempatTidur.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "RL1.3_TempatTidur",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [
                    {
                        field: "no",
                        title: "No. Urut",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "40px",
                    },
                    {
                        field: "namaruangan",
                        title: "Jenis Pelayanan",
                        width: "120px",
                        template: "<span class='style-center'>#: namaruangan #</span>",
                    },
                    {
                        title: "Total Pasien",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahrujukanfix",
                                title: "Rujukan",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahnonrujukanfix",
                                title: "Non",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            }

                        ]
                    },

                    {
                        title: "Tindakan Lanjut Pelayanan",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "jumlahdirawatfix",
                                title: "Dirawat",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "jumlahdirujukfix",
                                title: "Dirujuk",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "jumlahpulangfix",
                                title: "Pulang",
                                width: "60px",
                                headerAttributes: { style: "text-align : center" },
                            },

                        ]
                    },
                    {
                        field: "jumlahmeninggalfix",
                        title: "Mati di IGD",
                        width: "80px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        field: "doa",
                        title: "DOA",
                        width: "80px",
                        headerAttributes: { style: "text-align : center" },
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