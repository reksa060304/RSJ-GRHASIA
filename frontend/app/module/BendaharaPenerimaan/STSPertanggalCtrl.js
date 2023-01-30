define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSPertanggalCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listStatusBayar = [
                { id: 1, names: "Tunai" },
                { id: 2, names: "Transfer"},
                { id: 3, names: "Manual"},
                { id: 3, names: "Tunai & Transfer"},
            ];

            function init() {
                $scope.isRouteLoading = true;

                var bayar = "";
                if ($scope.item.statusBayar != undefined) {
                    bayar = $scope.item.statusBayar.id
                }

                var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
                let thun = tahun.toString();
                let bul=bulan.toString();
                var nosts = '';
                if($scope.item.nosts != undefined){
                    nosts = '&nosts=' + $scope.item.nosts
                }
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get('bendaharapenerimaan/get-sts-pertanggal?bulan='+ bul + "&tahun="+ thun
                + "&bayar="+ bayar + nosts
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlahjiwa: { type: "number" },
                                        jumlahnapza: { type: "number" },
                                        jumlahperiksadokterumum: { type: "number" },
                                        jumlahperiksadoktergigi: { type: "number" },
                                        jumlahperiksadokterpenydalam: { type: "number" },
                                        jumlahperiksadokteranak: { type: "number" },
                                        jumlahperiksadoktersyaraf: { type: "number" },
                                        jumlahperiksadokterelektromedik: { type: "number" },
                                        jumlahperiksadokterigd: { type: "number" },
                                        jumlahdipam: { type: "number" },
                                        jumlahtmpoli: { type: "number" },
                                        jumlahtmigd: { type: "number" },
                                        jumlahtmgigi: { type: "number" },
                                        jumlahobatrajal: { type: "number" },
                                        jumlahkir: { type: "number" },
                                        jumlahpsikolog: { type: "number" },
                                        jumlahlab: { type: "number" },
                                        jumlahtmelektromedik: { type: "number" },
                                        jumlahfisio: { type: "number" },
                                        jumlahradio: { type: "number" },
                                        jumlahdiklat: { type: "number" },
                                        jumlahvip: { type: "number" },
                                        jumlahkelas1: { type: "number" },
                                        jumlahkelasuppi: { type: "number" },
                                        jumlahkelas2: { type: "number" },
                                        jumlahkelas3: { type: "number" },
                                        jumlahobatranap: { type: "number" },
                                        jumlahtmranap: { type: "number" },
                                        jumlahvisite: { type: "number" },
                                        jumlahrehabmental: { type: "number" },
                                        jumlahjenazah: { type: "number" },
                                        jumlahlegalisir: { type: "number" },
                                        jumlahgedungterapi: { type: "number" },
                                        jumlahsewalapangan: { type: "number" },
                                        jumlahgedungdiklat: { type: "number" },
                                        jumlahgrhasiainn: { type: "number" },
                                        jumlahpertanian: { type: "number" },
                                        jumlahkalandra: { type: "number" },
                                        jumlahsewatempatfc: { type: "number" },
                                        jumlahmanekin: { type: "number" },
                                        jumlahsewaambulan: { type: "number" },
                                        jumlahketerampilan: { type: "number" },
                                        jumlahparkir: { type: "number" },
                                        jumlahlainlain: { type: "number" },
                                        jumlahtotal: { type: "number" },

                                        jumlahklaimcovid: { type: "number" },
                                        jumlahjasabank: { type: "number" },
                                        jumlahrajalbpjs: { type: "number" },
                                        jumlahrajaljamkesda: { type: "number" },
                                        jumlahrajaljamkesos: { type: "number" },
                                        jumlahrajalipwl: { type: "number" },
                                        jumlahobatbpjs: { type: "number" },
                                        jumlahobatjamkesda: { type: "number" },
                                        jumlahobatjamkesos: { type: "number" },
                                        jumlahobatipwl: { type: "number" },
                                        jumlahranapbpjs: { type: "number" },
                                        jumlahranapjamkesda: { type: "number" },
                                        jumlahranapjamkesos: { type: "number" },
                                        jumlahranapipwl: { type: "number" },
                                        jumlahcsbpjs: { type: "number" },
                                        jumlahcsjamkesda: { type: "number" },
                                        jumlahcsjamkesos: { type: "number" },

                                        jumlahklaim: { type: "number" },
                                        jumlahadmin: { type: "number" },
                                        jumlahtransfer: { type: "number" },
                                        jumlahnetto: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahjiwa', aggregate: 'sum' },
                                { field: 'jumlahnapza', aggregate: 'sum' },
                                { field: 'jumlahperiksadokterumum', aggregate: 'sum' },
                                { field: 'jumlahperiksadoktergigi', aggregate: 'sum' },
                                { field: 'jumlahperiksadokterpenydalam', aggregate: 'sum' },
                                { field: 'jumlahperiksadokteranak', aggregate: 'sum' },
                                { field: 'jumlahperiksadoktersyaraf', aggregate: 'sum' },
                                { field: 'jumlahperiksadokterelektromedik', aggregate: 'sum' },
                                { field: 'jumlahperiksadokterigd', aggregate: 'sum' },
                                { field: 'jumlahdipam', aggregate: 'sum' },
                                { field: 'jumlahtmpoli', aggregate: 'sum' },
                                { field: 'jumlahtmigd', aggregate: 'sum' },
                                { field: 'jumlahtmgigi', aggregate: 'sum' },
                                { field: 'jumlahobatrajal', aggregate: 'sum' },
                                { field: 'jumlahkir', aggregate: 'sum' },
                                { field: 'jumlahpsikolog', aggregate: 'sum' },
                                { field: 'jumlahlab', aggregate: 'sum' },
                                { field: 'jumlahtmelektromedik', aggregate: 'sum' },
                                { field: 'jumlahfisio', aggregate: 'sum' },
                                { field: 'jumlahradio', aggregate: 'sum' },
                                { field: 'jumlahdiklat', aggregate: 'sum' },
                                { field: 'jumlahvip', aggregate: 'sum' },
                                { field: 'jumlahkelas1', aggregate: 'sum' },
                                { field: 'jumlahkelasuppi', aggregate: 'sum' },
                                { field: 'jumlahkelas2', aggregate: 'sum' },
                                { field: 'jumlahkelas3', aggregate: 'sum' },
                                { field: 'jumlahobatranap', aggregate: 'sum' },
                                { field: 'jumlahtmranap', aggregate: 'sum' },
                                { field: 'jumlahvisite', aggregate: 'sum' },
                                { field: 'jumlahrehabmental', aggregate: 'sum' },
                                { field: 'jumlahjenazah', aggregate: 'sum' },
                                { field: 'jumlahlegalisir', aggregate: 'sum' },
                                { field: 'jumlahgedungterapi', aggregate: 'sum' },
                                { field: 'jumlahsewalapangan', aggregate: 'sum' },
                                { field: 'jumlahgedungdiklat', aggregate: 'sum' },
                                { field: 'jumlahgrhasiainn', aggregate: 'sum' },
                                { field: 'jumlahpertanian', aggregate: 'sum' },
                                { field: 'jumlahkalandra', aggregate: 'sum' },
                                { field: 'jumlahsewatempatfc', aggregate: 'sum' },
                                { field: 'jumlahmanekin', aggregate: 'sum' },
                                { field: 'jumlahsewaambulan', aggregate: 'sum' },
                                { field: 'jumlahketerampilan', aggregate: 'sum' },
                                { field: 'jumlahparkir', aggregate: 'sum' },
                                { field: 'jumlahlainlain', aggregate: 'sum' },
                                { field: 'jumlahtotal', aggregate: 'sum' },

                                { field: 'jumlahklaimcovid', aggregate: 'sum' },
                                { field: 'jumlahjasabank', aggregate: 'sum' },
                                { field: 'jumlahrajalbpjs', aggregate: 'sum' },
                                { field: 'jumlahrajaljamkesda', aggregate: 'sum' },
                                { field: 'jumlahrajaljamkesos', aggregate: 'sum' },
                                { field: 'jumlahrajalipwl', aggregate: 'sum' },
                                { field: 'jumlahobatbpjs', aggregate: 'sum' },
                                { field: 'jumlahobatjamkesda', aggregate: 'sum' },
                                { field: 'jumlahobatjamkesos', aggregate: 'sum' },
                                { field: 'jumlahobatipwl', aggregate: 'sum' },
                                { field: 'jumlahranapbpjs', aggregate: 'sum' },
                                { field: 'jumlahranapjamkesda', aggregate: 'sum' },
                                { field: 'jumlahranapjamkesos', aggregate: 'sum' },
                                { field: 'jumlahranapipwl', aggregate: 'sum' },
                                { field: 'jumlahcsbpjs', aggregate: 'sum' },
                                { field: 'jumlahcsjamkesda', aggregate: 'sum' },
                                { field: 'jumlahcsjamkesos', aggregate: 'sum' },

                                { field: 'jumlahklaim', aggregate: 'sum' },
                                { field: 'jumlahadmin', aggregate: 'sum' },
                                { field: 'jumlahtransfer', aggregate: 'sum' },
                                { field: 'jumlahnetto', aggregate: 'sum' },
                            ]
                        });
                    });
            }

            function FormLoad() {
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
                excel: { fileName: "STSPertanggal.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var bulan = moment($scope.item.bulan).format('MM');
				    var tahun = moment($scope.item.tahun).format('YYYY');
                    sheet.frozenRows = 0;
                    sheet.mergedCells = ["A1:AT1"];
                    sheet.name = "STSPertanggal";
                    var myHeaders = [{
                        value: "STS Pertanggal " + bulan + " "+tahun,
                        fontSize: 14,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "command": [
                            {
                                text: "Detail STS",
                                click: DetailSTS,
                                imageClass: "clinic fa",
                             },
                          ],
                             title: "",
                             width: "120px",
                             
                    },
                    {
                        
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahrajalbpjs",
                        "title": "Rawat Jalan BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajalbpjs #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajalbpjs.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajalbpjs.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajaljamkesda",
                        "title": "Rawat Jalan Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajaljamkesda #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajaljamkesda.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajaljamkesda.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajaljamkesos",
                        "title": "Rawat Jalan Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajaljamkesos #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajaljamkesos.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajaljamkesos.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajalipwl",
                        "title": "Rawat Jalan IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajalipwl #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajalipwl.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrajalipwl.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatbpjs",
                        "title": "Obat-Obatan BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatbpjs #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatbpjs.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatbpjs.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatjamkesda",
                        "title": "Obat-Obatan Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatjamkesda #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatjamkesda.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatjamkesda.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatjamkesos",
                        "title": "Obat-Obatan Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatjamkesos #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatjamkesos.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatjamkesos.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatipwl",
                        "title": "Obat-Obatan IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatipwl #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatipwl.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatipwl.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahjiwa",
                        "title": "Periksa Dokter Jiwa",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjiwa #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjiwa.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjiwa.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahnapza",
                        "title": "Periksa Dokter NAPZA",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnapza #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahnapza.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahnapza.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadokterumum",
                        "title": "Periksa Dokter Umum",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterumum #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterumum.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterumum.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadoktergigi",
                        "title": "Periksa Dokter Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktergigi #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadoktergigi.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadoktergigi.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadokterpenydalam",
                        "title": "Periksa Dokter Penyakit Dalam",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterpenydalam #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterpenydalam.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterpenydalam.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadokteranak",
                        "title": "Periksa Dokter Anak",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokteranak #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokteranak.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokteranak.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadoktersyaraf",
                        "title": "Periksa Dokter Syaraf",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktersyaraf #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadoktersyaraf.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadoktersyaraf.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadokterelektromedik",
                        "title": "Periksa Dokter Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterelektromedik #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterelektromedik.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterelektromedik.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahperiksadokterigd",
                        "title": "Periksa Dokter IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterigd #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterigd.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahperiksadokterigd.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahcsbpjs",
                        "title": "Cost Sharing BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsbpjs #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsbpjs.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsbpjs.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahcsjamkesda",
                        "title": "Cost Sharing Jamkesda Bantul",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsjamkesda #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsjamkesda.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsjamkesda.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahcsjamkesos",
                        "title": "Cost Sharing Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsjamkesos #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsjamkesos.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahcsjamkesos.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahdipam",
                        "title": "DIPAM",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdipam #', 'Rp.')}}</span>",
                        "width": "100px",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahdipam.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahdipam.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtmpoli",
                        "title": "TM Poli",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmpoli #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmpoli.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmpoli.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtmigd",
                        "title": "TM IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmigd #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmigd.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmigd.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtmgigi",
                        "title": "TM Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmgigi #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmgigi.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmgigi.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatrajal",
                        "title": "Obat Rajal",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatrajal #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatrajal.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatrajal.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkir",
                        "title": "KIR",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkir #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkir.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkir.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahpsikolog",
                        "title": "Psikologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpsikolog #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahpsikolog.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahpsikolog.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahlab",
                        "title": "Laboratorium",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlab #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlab.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlab.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtmelektromedik",
                        "title": "Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmelektromedik #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmelektromedik.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmelektromedik.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahfisio",
                        "title": "Fisiotherapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahfisio #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahfisio.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahfisio.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahradio",
                        "title": "Radiologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahradio #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahradio.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahradio.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahdiklat",
                        "title": "Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdiklat #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahdiklat.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahdiklat.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahklaimcovid",
                        "title": "Klaim Covid",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahklaimcovid #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahklaimcovid.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahklaimcovid.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapbpjs",
                        "title": "Rawat Inap BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapbpjs #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapbpjs.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapbpjs.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapjamkesda",
                        "title": "Rawat Inap Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapjamkesda #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapjamkesda.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapjamkesda.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapjamkesos",
                        "title": "Rawat Inap Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapjamkesos #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapjamkesos.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapjamkesos.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapipwl",
                        "title": "Rawat Inap IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapipwl #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapipwl.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahranapipwl.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahvip",
                        "title": "VIP",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvip #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahvip.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahvip.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkelas1",
                        "title": "Kelas I",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas1 #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas1.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas1.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkelasuppi",
                        "title": "UPPI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelasuppi #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelasuppi.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelasuppi.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkelas2",
                        "title": "Kelas II",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas2 #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas2.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas2.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkelas3",
                        "title": "Kelas III",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas3 #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas3.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkelas3.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatranap",
                        "title": "Obat Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatranap #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatranap.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahobatranap.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtmranap",
                        "title": "TM Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmranap #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmranap.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtmranap.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahvisite",
                        "title": "Visite",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvisite #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahvisite.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahvisite.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrehabmental",
                        "title": "Rehab Mental",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrehabmental #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrehabmental.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahrehabmental.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahjenazah",
                        "title": "Perawatan Jenazah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjenazah #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjenazah.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjenazah.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahlegalisir",
                        "title": "Legalisir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlegalisir #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlegalisir.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlegalisir.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahgedungterapi",
                        "title": "Sewa Gedung Terapi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungterapi #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgedungterapi.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgedungterapi.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahsewalapangan",
                        "title": "Sewa Sewa Lapangan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewalapangan #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewalapangan.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewalapangan.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahgedungdiklat",
                        "title": "Sewa Gedung Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungdiklat #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgedungdiklat.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgedungdiklat.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahgrhasiainn",
                        "title": "Sewa Grhasia Inn",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgrhasiainn #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgrhasiainn.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahgrhasiainn.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahpertanian",
                        "title": "Sewa Lahan Pertanian",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpertanian #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahpertanian.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahpertanian.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahkalandra",
                        "title": "Sewa Kalandra",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkalandra #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkalandra.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahkalandra.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahsewatempatfc",
                        "title": "Sewa Tempat Fotokopi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewatempatfc #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewatempatfc.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewatempatfc.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahmanekin",
                        "title": "Sewa Manekin",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahmanekin #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahmanekin.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahmanekin.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahsewaambulan",
                        "title": "Sewa Ambulan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewaambulan #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewaambulan.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahsewaambulan.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahketerampilan",
                        "title": "Work Therapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahketerampilan #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahketerampilan.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahketerampilan.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahparkir",
                        "title": "Parkir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahparkir #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahparkir.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahparkir.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahjasabank",
                        "title": "Jasa Bank",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjasabank #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjasabank.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahjasabank.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahlainlain",
                        "title": "Lain-Lain",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlainlain #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlainlain.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahlainlain.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtotal",
                        "title": "Jumlah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtotal #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtotal.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtotal.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahklaim",
                        "title": "Jumlah Klaim",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahklaim #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahklaim.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahklaim.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahadmin",
                        "title": "Biaya Administrasi Bank",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahadmin #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahadmin.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahadmin.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtransfer",
                        "title": "Biaya Transfer",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtransfer #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtransfer.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahtransfer.sum #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahnetto",
                        "title": "Jumlah Netto",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnetto #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahnetto.sum #', 'Rp.')}}</span>",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jumlahnetto.sum #', 'Rp.')}}</span>"
                    },
                ]
            };


            function DetailSTS(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
                let thun = tahun.toString();
                let bul=bulan.toString();
                let hari = dataItem.tanggal
                medifirstService.get('bendaharapenerimaan/get-deatil-sts-pertanggal?bulan='+ bul + "&tahun="+ thun + "&tgl="+ hari, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                        
                        $scope.dataGridSTS = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    
                                }
                            },
                            aggregate: [
                            ]
                        });
                });

                $scope.popupDetailSTS.center().open()
            }

            $scope.columnGridSTS = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "DetailSTSPertanggal.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 0;
                    sheet.mergedCells = ["A1:AT1"];
                    sheet.name = "DetailSTSPertanggal";
                    var myHeaders = [{
                        value: "Detail STS Pertanggal",
                        fontSize: 14,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nosts",
                        "title": "No STS",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahrajalbpjs",
                        "title": "Rawat Jalan BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajalbpjs #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajaljamkesda",
                        "title": "Rawat Jalan Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajaljamkesda #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajaljamkesos",
                        "title": "Rawat Jalan Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajaljamkesos #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahrajalipwl",
                        "title": "Rawat Jalan IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrajalipwl #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatbpjs",
                        "title": "Obat-Obatan BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatbpjs #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatjamkesda",
                        "title": "Obat-Obatan Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatjamkesda #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatjamkesos",
                        "title": "Obat-Obatan Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatjamkesos #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahobatipwl",
                        "title": "Obat-Obatan IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatipwl #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahjiwa",
                        "title": "Periksa Dokter Jiwa",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjiwa #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahnapza",
                        "title": "Periksa Dokter NAPZA",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnapza #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterumum",
                        "title": "Periksa Dokter Umum",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterumum #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadoktergigi",
                        "title": "Periksa Dokter Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktergigi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterpenydalam",
                        "title": "Periksa Dokter Penyakit Dalam",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterpenydalam #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokteranak",
                        "title": "Periksa Dokter Anak",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokteranak #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadoktersyaraf",
                        "title": "Periksa Dokter Syaraf",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktersyaraf #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterelektromedik",
                        "title": "Periksa Dokter Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterelektromedik #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterigd",
                        "title": "Periksa Dokter IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterigd #', 'Rp.')}}</span>",
                    },
                    
                    {
                        
                        "field": "jumlahcsbpjs",
                        "title": "Cost Sharing BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsbpjs #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahcsjamkesda",
                        "title": "Cost Sharing Jamkesda Bantul",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsjamkesda #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahcsjamkesos",
                        "title": "Cost Sharing Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahcsjamkesos #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahdipam",
                        "title": "DIPAM",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdipam #', 'Rp.')}}</span>",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahtmpoli",
                        "title": "TM Poli",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmpoli #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmigd",
                        "title": "TM IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmigd #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmgigi",
                        "title": "TM Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmgigi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahobatrajal",
                        "title": "Obat Rajal",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatrajal #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkir",
                        "title": "KIR",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahpsikolog",
                        "title": "Psikologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpsikolog #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahlab",
                        "title": "Laboratorium",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlab #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmelektromedik",
                        "title": "Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmelektromedik #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahfisio",
                        "title": "Fisiotherapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahfisio #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahradio",
                        "title": "Radiologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahradio #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahdiklat",
                        "title": "Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdiklat #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahklaimcovid",
                        "title": "Klaim Covid",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahklaimcovid #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapbpjs",
                        "title": "Rawat Inap BPJS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapbpjs #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapjamkesda",
                        "title": "Rawat Inap Jamkesda",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapjamkesda #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapjamkesos",
                        "title": "Rawat Inap Jamkesos",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapjamkesos #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahranapipwl",
                        "title": "Rawat Inap IPWL",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahranapipwl #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahvip",
                        "title": "VIP",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvip #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas1",
                        "title": "Kelas I",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas1 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelasuppi",
                        "title": "UPPI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelasuppi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas2",
                        "title": "Kelas II",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas2 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas3",
                        "title": "Kelas III",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas3 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahobatranap",
                        "title": "Obat Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatranap #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmranap",
                        "title": "TM Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmranap #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahvisite",
                        "title": "Visite",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvisite #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahrehabmental",
                        "title": "Rehab Mental",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrehabmental #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahjenazah",
                        "title": "Perawatan Jenazah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjenazah #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahlegalisir",
                        "title": "Legalisir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlegalisir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgedungterapi",
                        "title": "Sewa Gedung Terapi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungterapi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewalapangan",
                        "title": "Sewa Sewa Lapangan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewalapangan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgedungdiklat",
                        "title": "Sewa Gedung Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungdiklat #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgrhasiainn",
                        "title": "Sewa Grhasia Inn",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgrhasiainn #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahpertanian",
                        "title": "Sewa Lahan Pertanian",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpertanian #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkalandra",
                        "title": "Sewa Kalandra",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkalandra #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewatempatfc",
                        "title": "Sewa Tempat Fotokopi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewatempatfc #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahmanekin",
                        "title": "Sewa Manekin",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahmanekin #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewaambulan",
                        "title": "Sewa Ambulan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewaambulan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahketerampilan",
                        "title": "Work Therapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahketerampilan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahparkir",
                        "title": "Parkir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahparkir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahjasabank",
                        "title": "Jasa Bank",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjasabank #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahlainlain",
                        "title": "Lain-Lain",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlainlain #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtotal",
                        "title": "Jumlah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtotal #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahklaim",
                        "title": "Jumlah Klaim",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahklaim #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahadmin",
                        "title": "Biaya Administrasi Bank",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahadmin #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahtransfer",
                        "title": "Biaya Transfer",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtransfer #', 'Rp.')}}</span>"
                    },
                    {
                        
                        "field": "jumlahnetto",
                        "title": "Jumlah Netto",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnetto #', 'Rp.')}}</span>"
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