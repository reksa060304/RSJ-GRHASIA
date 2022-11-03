define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapitulasiPendapatanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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
                medifirstService.get("bendaharapenerimaan/get-rekapitulasi-pendapatan?" 
                 + "&tahun=" + tahun
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                            if(dat.data.detail[i].jumlahjasagiro == null){
                                dat.data.detail[i].jumlahjasagiro = 0
                            }
                            if(dat.data.detail[i].jumlahdiklat == null){
                                dat.data.detail[i].jumlahdiklat = 0
                            }
                            if(dat.data.detail[i].jumlahbpjs == null){
                                dat.data.detail[i].jumlahbpjs = 0
                            }
                            if(dat.data.detail[i].jumlahipwl == null){
                                dat.data.detail[i].jumlahipwl = 0
                            }
                            if(dat.data.detail[i].jumlahjamkesos == null){
                                dat.data.detail[i].jumlahjamkesos = 0
                            }
                            if(dat.data.detail[i].jumlahjamkesda == null){
                                dat.data.detail[i].jumlahjamkesda = 0
                            }
                            if(dat.data.detail[i].jumlahrajal == null){
                                dat.data.detail[i].jumlahrajal = 0
                            }
                            if(dat.data.detail[i].jumlahranap == null){
                                dat.data.detail[i].jumlahranap = 0
                            }
                            if(dat.data.detail[i].klaimcovid == null){
                                dat.data.detail[i].klaimcovid = 0
                            }
                            if(dat.data.detail[i].jumlahlainlain == null){
                                dat.data.detail[i].jumlahlainlain = 0
                            }

                            dat.data.detail[i].total = parseInt(dat.data.detail[i].jumlahjasagiro) + parseInt(dat.data.detail[i].jumlahdiklat) + parseInt(dat.data.detail[i].jumlahbpjs) +
                            parseInt(dat.data.detail[i].jumlahipwl) + parseInt(dat.data.detail[i].jumlahjamkesos) + parseInt(dat.data.detail[i].jumlahjamkesda) +
                            parseInt(dat.data.detail[i].jumlahrajal) + parseInt(dat.data.detail[i].jumlahranap) + parseInt(dat.data.detail[i].jumlahlainlain)
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
                                        jumlahjasagiro: { type: "number" },
                                        jumlahdiklat: { type: "number" },
                                        jumlahbpjs: { type: "number" },
                                        jumlahipwl: { type: "number" },
                                        jumlahjamkesos: { type: "number" },
                                        jumlahjamkesda: { type: "number" },
                                        jumlahrajal: { type: "number" },
                                        jumlahranap: { type: "number" },
                                        klaimcovid: { type: "number" },
                                        total: { type: "number" },
                                        jumlahlainlain: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahjasagiro', aggregate: 'sum' },
                                { field: 'jumlahdiklat', aggregate: 'sum' },
                                { field: 'jumlahbpjs', aggregate: 'sum' },
                                { field: 'jumlahipwl', aggregate: 'sum' },
                                { field: 'jumlahjamkesos', aggregate: 'sum' },
                                { field: 'jumlahjamkesda', aggregate: 'sum' },
                                { field: 'jumlahrajal', aggregate: 'sum' },
                                { field: 'jumlahranap', aggregate: 'sum' },
                                { field: 'klaimcovid', aggregate: 'sum' },
                                { field: 'total', aggregate: 'sum' },
                                { field: 'jumlahlainlain', aggregate: 'sum' },
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
                excel: { fileName: "RekapitulasiPendapatanJasaLayanan.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 0;
                    sheet.mergedCells = ["A1:W1"];
                    sheet.name = "STSBulanan";
                    var tahun = moment($scope.item.tahun).format('YYYY');
                    var myHeaders = [{
                        value: "REKAPITULASI PENDAPATAN JASA LAYANAN TH. " + tahun,
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
                        cells: [{value:"", colSpan: 1},{value:"Mengetahui:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 18},{value:"Yogyakarta, " + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(101, 0, {
                        cells: [{value:"", colSpan: 1},{value:"Pimpinan BLUD:", colSpan: 1, textAlign: "center"},{value:"", colSpan: 18},{value:"Bendahara Penerima",colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
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
                        cells: [{value:"", colSpan: 1},{value:"dr. AKHMAD AKHADI S. MPH", colSpan: 1, textAlign: "center"},{value:"", colSpan: 18},{value:"SURI HERLINA PRATIWI, S.KM, M.PH" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(104, 0, {
                        cells: [{value:"", colSpan: 1},{value:"NIP. 19680714 200012 1 002", colSpan: 1, textAlign: "center"},{value:"", colSpan: 18},{value:"NIP. 19860422 201101 2 013" + tahun,colSpan: 3, textAlign: "center"},{value:"", colSpan: 1}],
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
                        
                        "field": "bulan",
                        "title": "BULAN",
                        "width": "100px",
                        footerTemplate: "JUMLAH"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahrajal/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahrajal.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "RAJAL UMUM",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajal #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajal.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahrajal.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahranap/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahranap.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahranap",
                        "title": "RANAP UMUM",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranap #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranap.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahranap.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahjasagiro/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahjasagiro.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahjasagiro",
                        "title": "JASA GIRO",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjasagiro #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjasagiro.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahjasagiro.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahipwl/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahipwl.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahipwl",
                        "title": "NAPZA IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahipwl #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahipwl.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahipwl.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahdiklat/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahdiklat.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahdiklat",
                        "title": "DIKLAT",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdiklat #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahdiklat.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahdiklat.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahbpjs/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahbpjs.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahbpjs",
                        "title": "BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahbpjs #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahbpjs.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahbpjs.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((klaimcovid/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.klaimcovid.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "klaimcovid",
                        "title": "KLAIM COVID",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: klaimcovid #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.klaimcovid.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.klaimcovid.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahlainlain/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahlainlain.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahlainlain",
                        "title": "PENDAPATAN LAIN LAIN",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlainlain #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlainlain.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahlainlain.sum #"
                    },
                    {
                        
                        "field": "jumlahrajal",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahjamkesos/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahjamkesos.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahjamkesos",
                        "title": "JAMKESOS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjamkesos #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjamkesos.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahjamkesos.sum #"
                    },
                    {
                        
                        "field": "jumlahjamkesda",
                        "title": "%",
                        "width": "100px",
                        "template": "<span class='style-right'>{{ naiveRound('#: ((jumlahjamkesda/total)*100) #', 2) }}</span>",
                        footerTemplate: "#: ((data.jumlahjamkesda.sum/data.total.sum)*100) #"
                    },
                    {
                        
                        "field": "jumlahjamkesda",
                        "title": "JAMKESDA",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjamkesda #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjamkesda.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.jumlahjamkesda.sum #"
                    },
                    {
                        
                        "field": "total",
                        "title": "JUMLAH",
                        "width": "100px",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
                        footerTemplate: "#: data.total.sum #"
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