define(['initialize'], function (initialize) {
'use strict';
    initialize.controller('LaporanPendapatanPelayananDiklitbangCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();   
            function FormLoad(){
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {}; 
                LoadCombo();
                LoadDataGrid();
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }
                 
            $scope.SearchData = function () {            
                LoadDataGrid()             
            }

            $scope.ClearData = function (){
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function LoadDataGrid() {                 
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;            

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,                     
                }
                cacheHelper.set('LaporanPendapatanPelayananDiklitbangCtrl', chacePeriode);
                medifirstService.get("kasir/get-data-lap-non-layanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].sd = 's.d.'
                    }
                    $scope.dataLaporan = new kendo.data.DataSource({                            
                        data: data.data,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: { 
                                fields: {
                                    totaldibayar: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "totaldibayar", aggregate:"sum"},
                        ]
                    });
                })
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            // $scope.aggregate = [
            //     {
            //         field: "totalharusdibayar",
            //         aggregate: "sum"
            //     },
            //     {
            //         field: "jasa",
            //         aggregate: "sum"
            //     }
            // ]



            $scope.columnLaporan = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "Rekapitulasi Pendapatan Pelayanan SUB BAG DIKLITBANG.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekapitulasi Pendapatan Pelayanan SUB BAG DIKLITBANG",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [  

                    { "field": "no", "title": "No", "width": "45px",footerTemplate: "Total" },
                    {
                        "field": "tglsbm",
                        "title": "Tanggal",
                        "width": "105px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglsbm #')}}</span>",
                        
                    },
                    

                    {
                        "field": "nosbm",
                        "title": "No SBM",
                        "width": "150px"
                    },
                    {
                        "field": "institusipendidikan",
                        "title": "Pelayanan Diklat",
                        "width": "150px"                    
                    },
                    {
                        // "field": "tglsbm",
                        "title": "Periode",
                        "width": "105px",
                        "columns": [{
                                "field": "tanggalmulai",
                                "title": "Mulai",
                                "width": "105px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tanggalmulai #')}}</span>",
                            },
                            {
                                "field": "sd",
                                "title": "s.d.",
                                "width": "30px"
                            },
                            {
                                "field": "tanggalselesai",
                                "title": "Mulai",
                                "width": "105px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tanggalselesai #')}}</span>",
                            },
                        ]

                    },
                    {
                        "field": "totaldibayar",
                        "title": "Jumlah",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
                         aggregates: ["sum"],
                        footerTemplate: "#: data.totaldibayar.sum #",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totaldibayar.sum #', 'Rp.')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    
                ] 
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});