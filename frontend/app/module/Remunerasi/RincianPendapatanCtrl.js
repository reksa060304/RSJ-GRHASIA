define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RincianPendapatanCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};           
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            $scope.item.tahun = new Date()
            LoadCache();
            loadCombo();
             $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "yyyy",
                }
            }
            function LoadCache() {
                var chacePeriode = cacheHelper.get('RincianPendapatanCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }
            function loadCombo() {
                // medifirstService.getDataTableTransaksi("logistik/get-datacombo_dp", true).then(function(dat){
                //     pegawaiUser = dat.data.datalogin
                // });
                // $scope.listJenisRacikan = [{id:1,jenisracikan:'Puyer'}]
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }      
                var tglAwal = ''
                   var tglAkhir = ''
         
                // var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                let tahun = moment($scope.item.tahun).format('YYYY');
                // $scope.item.tglAwal
                medifirstService.get("remunerasi/get-rincian-pendapatan?tahun=" +tahun
                   +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                    
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data,
                            pageSize: 12,
                            total: dat.data.length,
                            serverPaging: false,
                             schema: {
                                    model: {
                                        fields: {
                                            umum: { type: "number" },
                                            sktm: { type: "number" },
                                            bpjs: { type: "number" },
                                            jasaraharja: { type: "number" },
                                            diklat: { type: "number" },
                                            mcu: { type: "number" },
                                            covid: { type: "number" },
                                            lainlain: { type: "number" },
                                            jasagiro: { type: "number" },
                                            
                                        }
                                    }
                                },
                                aggregate: [
                                    { field: 'umum', aggregate: 'sum' },
                                    { field: 'sktm', aggregate: 'sum' },
                                    { field: 'bpjs', aggregate: 'sum' },
                                    { field: 'jasaraharja', aggregate: 'sum' },
                                    { field: 'diklat', aggregate: 'sum' },
                                    { field: 'mcu', aggregate: 'sum' },
                                    { field: 'covid', aggregate: 'sum' },
                                    { field: 'lainlain', aggregate: 'sum' },
                                    { field: 'jasagiro', aggregate: 'sum' }
                                    

                                ]
                        });
                        pegawaiUser = dat.data.datalogin
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('RincianPendapatanCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
              $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel"
                ],
                excel: {
                    fileName: "RincianAnggaran.xlsx",
                    allPages: true
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "RincianAnggaran",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 20 });
                },
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "20px",
                // },
                {
                    "field": "blnstr",
                    "title": "Bulan",
                    headerAttributes: { style: "text-align : center" },
                    "width": "100px",
                },
                {
                    "field": "",
                    "title": "Pendapatan Lain-lain",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            field: "umum",
                            title: "UMUM",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: umum #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.umum.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                         },
                        {
                            field: "bpjs",
                            title: "BPJS",
                            width: "120px",
                             headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: bpjs #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.bpjs.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "sktm",
                            title: "SKTM",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: sktm #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.sktm.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "jasaraharja",
                            title: "JASARAHARJA",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: jasaraharja #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasaraharja.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "diklat",
                            title: "PENDIDIKAN DAN PELATIHAN",
                            width: "120px",
                             headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: diklat #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.diklat.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "mcu",
                            title: "MCU",
                            width: "120px",
                          headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: mcu #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.mcu.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "covid",
                            title: "COVID",
                            width: "120px",
                             headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: covid #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.covid.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "lainlain",
                            title: "LAIN-LAIN",
                            width: "120px",
                             headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: lainlain #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.lainlain.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        }

                    ]
                },
                {
                    "field": "",
                    "title": "Lain-lain Pendapatan Yang Sah",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            field: "jasagiro",
                            title: "JASA GIRO",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: jasagiro #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasagiro.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                        {
                            field: "jasagiro",
                            title: "DENDA ATAU SUSULAN BPJS",
                            width: "120px",
                            headerAttributes: { style: "text-align : center" },
                           "template": "<span class='style-right'>{{formatRupiah('#: jasagiro #', '')}}</span>",
                            attributes: { style: "text-align:right;" },
                            aggregates: ["sum"],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasagiro.sum #', '')}}</span>",
                            footerAttributes: { style: "text-align: right;" }
                        },
                    ]
                }                
            ]}
            
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
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
                    
            //* BATAS SUCI *//
        }
    ]);
});
