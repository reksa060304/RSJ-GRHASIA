define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RincianObyekPenerimaanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

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
                var bulan = moment($scope.item.bulan).format('MM');

                tglAwal = moment(tglAwal).format('YYYY-MM-DD 00:00');
                tglAkhir = moment(tglAkhir).format('YYYY-MM-DD 00:00');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-perincian-obyek-penerimaan?" 
                 + "&tahun=" + tahun
                 + "&bulan=" + bulan
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;

                        $scope.item.target = dat.data.target[0].jumlahpendapatan
                        var total = 0
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                            total += parseInt(dat.data.detail[i].totalfix)
                        }
                        $scope.item.total = total
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        totalfix: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'totalfix', aggregate: 'sum' },
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
                excel: { fileName: "PerincianObyekPenerimaan.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.name = "Perincian Obyek Penerimaan";
                    var tahun = moment($scope.item.tahun).format('YYYY');
                    var bulan = moment($scope.item.bulan).format('MMMM');
                    var d = new Date(moment($scope.item.tahun).format('YYYY'), moment($scope.item.bulan).format('MM'), 0);
                    var dfix = moment(d).format('DD MMMM YYYY')

                    sheet.rows.splice(0, 0, {
                        cells: [{value:"SKPD", colSpan: 1},{value:": RS JIWA GRHASIA", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(1, 0, {
                        cells: [{value:"KODE REKENING", colSpan: 1},{value:": 4.1.4.16.01", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(2, 0, {
                        cells: [{value:"NAMA REKENING", colSpan: 1},{value:": PENDAPATAN USAHA BLUD", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(3, 0, {
                        cells: [{value:"JUMLAH ANGGARAN", colSpan: 1},{value:": "+$scope.item.target, colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(4, 0, {
                        cells: [{value:"TAHUN ANGGARAN", colSpan: 1},{value:": "+tahun, colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(5, 0, {
                        cells: [{value:"BULAN", colSpan: 1},{value:": "+bulan, colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(6, 0, { cells: myHeaders, type: "header", height: 20 });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(300, 0, {
                        cells: [{value:"", colSpan: 2}, {value:"Jumlah bulan ini tanggal " + dfix, colSpan: 2},{value:$scope.item.total, colSpan: 1, textAlign: "left"}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(301, 0, {
                        cells: [{value:"", colSpan: 2}, {value:"Jumlah s.d tanggal yang lalu", colSpan: 2},{value:"", colSpan: 1, textAlign: "left"}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(302, 0, {
                        cells: [{value:"", colSpan: 2}, {value:"Jumlah s.d bulan ini tanggal " + dfix, colSpan: 2},{value:$scope.item.total, colSpan: 1, textAlign: "left"}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(303, 0, { cells: myHeaders, type: "header", height: 30 });
                    
                    sheet.rows.splice(304, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Mengetahui:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"Yogyakarta, " + tahun,colSpan: 1, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(305, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Pimpinan BLUD:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"Bendahara Penerima",colSpan: 1, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    var myHeaders = [{
                        value: " ",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(306, 0, { cells: myHeaders, type: "header", height: 100 });

                    sheet.rows.splice(307, 0, {
                        cells: [{value:"", colSpan: 1},{value:"dr. AKHMAD AKHADI S. MPH", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"SURI HERLINA PRATIWI, S.KM, M.PH" + tahun,colSpan: 1, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(308, 0, {
                        cells: [{value:"", colSpan: 1},{value:"NIP. 19680714 200012 1 002", colSpan: 1, textAlign: "center"},{value:"", colSpan: 1},{value:"NIP. 19860422 201101 2 013" + tahun,colSpan: 1, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });
                    
                    

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "no",
                        "title": "NO",
                        "width": "100px",
                    },
                    {
                        "title": "NO. BKU",
                        "field": "nobku",
                        "width": "100px",
                    },
                    {
                        
                        "field": "date",
                        "title": "TANGGAL PENERIMAAN",
                        "width": "100px",
                        footerTemplate: "JUMLAH"
                    },
                    {
                        
                        "field": "nosts",
                        "title": "NO. STS",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalfix",
                        "title": "JUMLAH (Rp.)",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalfix #', '')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.totalfix.sum #', '')}}</span>",
                        footerTemplate: "#: data.totalfix.sum #"
                    },
                ]
            };

            $scope.naiveRound = function (num, decimalPlaces = 0) {
                var p = Math.pow(10, decimalPlaces);
                var result = Math.round(num * p) / p
                if(result != NaN){
                    result = Math.round(num * p) / p
                } else{
                    result = 0
                }
                return result;
            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});