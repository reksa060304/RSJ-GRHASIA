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
                    var totaljumlahdoafix = 0;
                    for(var i = 0; i < data.data.length; i++){

                        if(data.data[i].namaruangan != 'TOTAL'){
                            data.data[i].no = i + 1;
                        } else{
                            data.data[i].no = 99;
                        }

                        data.data[i].kdprov = '24'
                        data.data[i].kabkota = 'Kab. Sleman'
                        data.data[i].koders = '3404022'
                        data.data[i].namars = 'RSJ. Grhasia'
                        data.data[i].tahun = moment($scope.item.tglakhir).format('YYYY');

                        totaljumlahrujukanfix += parseInt(data.data[i].jumlahrujukanfix)
                        totaljumlahnonrujukanfix += parseInt(data.data[i].jumlahnonrujukanfix)
                        totaljumlahdirawatfix += parseInt(data.data[i].jumlahdirawatfix)
                        totaljumlahdirujukfix += parseInt(data.data[i].jumlahdirujukfix)
                        totaljumlahpulangfix += parseInt(data.data[i].jumlahpulangfix)
                        totaljumlahmeninggalfix += parseInt(data.data[i].jumlahmeninggalfix)
                        totaljumlahdoafix += parseInt(data.data[i].jumlahdoafix)

                        if(data.data[i].namaruangan == 'TOTAL'){
                            data.data[i].jumlahrujukanfix = totaljumlahrujukanfix 
                            data.data[i].jumlahnonrujukanfix = totaljumlahnonrujukanfix 
                            data.data[i].jumlahdirawatfix = totaljumlahdirawatfix 
                            data.data[i].jumlahdirujukfix = totaljumlahdirujukfix 
                            data.data[i].jumlahpulangfix = totaljumlahpulangfix 
                            data.data[i].jumlahmeninggalfix = totaljumlahmeninggalfix 
                            data.data[i].jumlahdoafix = totaljumlahdoafix 
                        }
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
                    var columns = e.workbook.sheets[0].columns;
                    var sheet = e.workbook.sheets[0];
                    console.log(sheet.rows.length)
                    sheet.rows[0].cells[0].background = '#6fde78';
                    sheet.rows[0].cells[0].color = '#000000'; 
                    sheet.rows[0].cells[1].background = '#6fde78'; 
                    sheet.rows[0].cells[1].color = '#000000'; 
                    sheet.rows[0].cells[2].background = '#6fde78'; 
                    sheet.rows[0].cells[2].color = '#000000'; 
                    sheet.rows[0].cells[3].background = '#6fde78'; 
                    sheet.rows[0].cells[3].color = '#000000'; 
                    sheet.rows[0].cells[4].background = '#6fde78'; 
                    sheet.rows[0].cells[4].color = '#000000'; 
                    sheet.rows[0].cells[5].background = '#6fde78'; 
                    sheet.rows[0].cells[5].color = '#000000'; 
                    sheet.rows[0].cells[6].background = '#6fde78'; 
                    sheet.rows[0].cells[6].color = '#000000'; 
                    sheet.rows[0].cells[7].background = '#6fde78'; 
                    sheet.rows[0].cells[7].color = '#000000';
                    sheet.rows[0].cells[8].background = '#6fde78'; 
                    sheet.rows[0].cells[8].color = '#000000';
                    sheet.rows[0].cells[9].background = '#6fde78'; 
                    sheet.rows[0].cells[9].color = '#000000';
                    sheet.rows[0].cells[10].background = '#6fde78'; 
                    sheet.rows[0].cells[10].color = '#000000';
                    sheet.rows[1].cells[0].background = '#6fde78'; 
                    sheet.rows[1].cells[0].color = '#000000';
                    sheet.rows[1].cells[1].background = '#6fde78'; 
                    sheet.rows[1].cells[1].color = '#000000';
                    sheet.rows[1].cells[2].background = '#6fde78'; 
                    sheet.rows[1].cells[2].color = '#000000';
                    sheet.rows[1].cells[3].background = '#6fde78'; 
                    sheet.rows[1].cells[3].color = '#000000';
                    sheet.rows[1].cells[4].background = '#6fde78'; 
                    sheet.rows[1].cells[4].color = '#000000';
                    for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                        delete columns[i].width;
                        columns[i].width = 100;
                    }

                    
                    
                },
                columns: [
                    {
                        field: "kdprov",
                        title: "KODE PROPINSI",
                        width: "80px"
                    },
                    {
                        field: "kabkota",
                        title: "KAB / KOTA",
                        width: "80px"
                    },
                    {
                        field: "koders",
                        title: "KODE RS",
                        width: "80px"
                    },
                    {
                        field: "namars",
                        title: "NAMA RS",
                        width: "80px"
                    },
                    {
                        field: "tahun",
                        title: "TAHUN",
                        width: "80px"
                    },
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
                        field: "jumlahdoafix",
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