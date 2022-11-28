define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSRingkasCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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
                medifirstService.get("bendaharapenerimaan/get-sts-ringkas?tahun=" + tahun
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
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
                    sheet.mergedCells = ["A1:O1"];
                    sheet.name = "STSBulanan";
                    var tahun = moment($scope.item.tahun).format('YYYY');
                    var myHeaders = [{
                        value: "SPJ PENDAPATAN PER BULAN TH. " + tahun,
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
                        cells: [{value:"", colSpan: 1},{value:"Mengetahui:", colSpan: 2, textAlign: "center"},{value:"", colSpan: 8},{value:"Yogyakarta, " + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(101, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Pimpinan BLUD:", colSpan: 2, textAlign: "center"},{value:"", colSpan: 8},{value:"Bendahara Penerima",colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
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
                        cells: [{value:"", colSpan: 1},{value:"dr. AKHMAD AKHADI S. MPH", colSpan: 2, textAlign: "center"},{value:"", colSpan: 8},{value:"SURI HERLINA PRATIWI, S.KM, M.PH" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(104, 0, {
                        cells: [{value:"", colSpan: 1},{value:"NIP. 19680714 200012 1 002", colSpan: 2, textAlign: "center"},{value:"", colSpan: 8},{value:"NIP. 19860422 201101 2 013" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });
                    
                    for(var j = 2; j<= 92; j++){
                        for(var i = 0; i<=14; i++){
                            sheet.rows[2].cells[i].background = "#ffffff";
                            sheet.rows[2].cells[i].color = "#000000";
                            sheet.rows[2].cells[i].textAlign = 'center';
                        }
                    }

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "mainuraian",
                        "title": "URAIAN",
                        "width": "250px",
                    },
                    {
                        
                        "field": "jumlahjanuari",
                        "title": "JANUARI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjanuari #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahfebruari",
                        "title": "FEBRUARI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahfebruari #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahmaret",
                        "title": "MARET",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahmaret #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahapril",
                        "title": "APRIL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahapril #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahmei",
                        "title": "MEI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahmei #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahjuni",
                        "title": "JUNI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjuni #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahjuli",
                        "title": "JULI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjuli #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahagustus",
                        "title": "AGUSTUS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahagustus #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahseptember",
                        "title": "SEPTEMBER",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahseptember #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahoktober",
                        "title": "OKTOBER",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahoktober #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahnovember",
                        "title": "NOVEMBER",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnovember #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahdesember",
                        "title": "DESEMBER",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdesember #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahrealisasi",
                        "title": "REALISASI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrealisasi #', 'Rp.')}}</span>",
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