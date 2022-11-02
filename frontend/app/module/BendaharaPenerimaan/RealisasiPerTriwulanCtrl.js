define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RealisasiPerTriwulanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }


            medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                var dataCombo = data.data;
                $scope.listBulan = dataCombo.bulan;

            });

            function init() {
                $scope.isRouteLoading = true;

                var tglAwal =""
                var tglAkhir = ""
                var bulan = ""
                if ($scope.item.bulan != undefined) {
                    bulan = $scope.item.bulan.id
                }

                var tahun = moment($scope.item.tahun).format('YYYY');

                tglAwal = moment(tglAwal).format('YYYY-MM-DD 00:00');
                tglAkhir = moment(tglAkhir).format('YYYY-MM-DD 00:00');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-sts-per-triwulan?" 
                 + "&tahun=" + tahun
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                            if(dat.data.detail[i].mainuraian == 'PENDAPATAN USAHA BLUD'){
                                dat.data.detail[i].kdrekening = '4.1.4.16.01'
                            } else if(dat.data.detail[i].mainuraian == 'JASA LAYANAN RUMAH SAKIT'){
                                dat.data.detail[i].kdrekening = '01'
                            } else if(dat.data.detail[i].mainuraian == 'PENUNJANG'){
                                dat.data.detail[i].kdrekening = '02'
                            } else if(dat.data.detail[i].mainuraian == 'RAWAT INAP'){
                                dat.data.detail[i].kdrekening = '03'
                            } else if(dat.data.detail[i].mainuraian == 'LAIN-LAIN PENDAPATAN BLUD YANG SAH'){
                                dat.data.detail[i].kdrekening = '04'
                            }
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    });
            }

            function FormLoad() {
                $scope.item.tahun = moment($scope.now).format('YYYY');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.namaProduk = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
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

            $scope.group = [
            ];
            

            $scope.columnGrid = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "STSBulanan.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 0;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "STSBulanan";
                    var tahun = moment($scope.item.tahun).format('YYYY');
                    var myHeaders = [{
                        value: "REALISASI PENERIMAAN PER TRIWULAN TH. " + tahun,
                        fontSize: 16,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });
                    var columns = e.workbook.sheets[0].columns;
                    columns[1]. width = 350;

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(99, 0, { cells: myHeaders, type: "header", height: 30 });
                    
                    sheet.rows.splice(100, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Mengetahui:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"Yogyakarta, " + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(101, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Pimpinan BLUD:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"Bendahara Penerima",colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(102, 0, { cells: myHeaders, type: "header", height: 100 });

                    sheet.rows.splice(103, 0, {
                        cells: [{value:"", colSpan: 1},{value:"dr. AKHMAD AKHADI S. MPH", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"SURI HERLINA PRATIWI, S.KM, M.PH" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(104, 0, {
                        cells: [{value:"", colSpan: 1},{value:"NIP. 19680714 200012 1 002", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"NIP. 19860422 201101 2 013" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });
                    
                    

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "kdrekening",
                        "title": "Kode Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "mainuraian",
                        "title": "URAIAN",
                        "width": "200px",
                    },
                    {
                        
                        "field": "jumlahtarget",
                        "title": "TARGET",
                        "width": "100px",
                    },
                    {
                        "title": "Realisasi Penerimaan",
                        "width": "400px",
                        columns: [
                            {
                                "field": 'jumlahtriwulan1',
                                "title": "TRIWULAN I",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: jumlahtriwulan1 #', 'Rp.')}}</span>",
                            },
                            {
                                "field": 'jumlahtriwulan1',
                                "title": "TRIWULAN II",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: jumlahtriwulan2 #', 'Rp.')}}</span>",

                            },
                            {
                                "field": 'jumlahtriwulan1',
                                "title": "TRIWULAN III",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: jumlahtriwulan3 #', 'Rp.')}}</span>",

                            },
                            {
                                "field": 'jumlahtriwulan1',
                                "title": "TRIWULAN IV",
                                "width": "100px",
                                "template": "<span class='style-right'>{{formatRupiah('#: jumlahtriwulan4 #', 'Rp.')}}</span>",

                            },
                        ]
                    },
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});