define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapTindakanCtrl', ['$scope', 'DateHelper', 'MedifirstService',
        function ($scope, DateHelper, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.isLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listDataDokter = data.data.dokter;
                    $scope.listProduk = data.data.produkobat;
                    $scope.dataLogin = medifirstService.getPegawaiLogin();
                });

                medifirstService.get("sysadmin/master/get-data-combo-master", true).then(function (dat) {
                    $scope.listDepartement = dat.data.departemen;
                });

                $scope.listRajalRanap = [
                    {
                        id: 1,
                        nama: "Instalasi Rawat Jalan"
                    }, {
                        id: 2,
                        nama: "Instalasi Rawat Inap"
                    }
                ]
            }

            $scope.RuanganToDepartement = function () {
                $scope.listruangan = $scope.item.departemen.ruangan                
            }
            
            function init() {
                $scope.isRouteLoading = true;

                var listProduk = ""
				if ($scope.item.listProdukMulti != undefined) {
                    listProduk = $scope.item.listProdukMulti.id;
                }

                var rajalranap = ""
				if ($scope.item.rajalranap != undefined) {
                    rajalranap = $scope.item.rajalranap.id;
                }

                var asalrujukan = ""
				if ($scope.item.asalrujukan != undefined) {
                    asalrujukan = $scope.item.asalrujukan.id;
                }

                var departemen = ""
				if ($scope.item.departemen != undefined) {
                    departemen = $scope.item.departemen.id;
                }

                var ruangan = ""
				if ($scope.item.ruangan != undefined) {
                    ruangan = $scope.item.ruangan.id;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("tatarekening/get-laporan-rekap-tindakan?" +
                    "tglAwal=" + tglAwal +
                    "&rajalranap=" + rajalranap +
                    "&departemen=" + departemen +
                    "&asalrujukan=" + asalrujukan +
                    "&ruangan=" + ruangan
                    ).then(function (dat) {
                        
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;

                            if(dat.data.detail[i].jumlahjanuari == null){
                                dat.data.detail[i].jumlahjanuari = 0
                            } else {
                                dat.data.detail[i].jumlahjanuari = dat.data.detail[i].jumlahjanuari
                            }

                            if(dat.data.detail[i].jumlahfebruari == null){
                                dat.data.detail[i].jumlahfebruari = 0
                            } else {
                                dat.data.detail[i].jumlahfebruari = dat.data.detail[i].jumlahfebruari
                            }

                            if(dat.data.detail[i].jumlahmaret == null){
                                dat.data.detail[i].jumlahmaret = 0
                            } else {
                                dat.data.detail[i].jumlahmaret = dat.data.detail[i].jumlahmaret
                            }

                            if(dat.data.detail[i].jumlahapril == null){
                                dat.data.detail[i].jumlahapril = 0
                            } else {
                                dat.data.detail[i].jumlahapril = dat.data.detail[i].jumlahapril
                            }

                            if(dat.data.detail[i].jumlahmei == null){
                                dat.data.detail[i].jumlahmei = 0
                            } else {
                                dat.data.detail[i].jumlahmei = dat.data.detail[i].jumlahmei
                            }

                            if(dat.data.detail[i].jumlahjuni == null){
                                dat.data.detail[i].jumlahjuni = 0
                            } else {
                                dat.data.detail[i].jumlahjuni = dat.data.detail[i].jumlahjuni
                            }

                            if(dat.data.detail[i].jumlahjuli == null){
                                dat.data.detail[i].jumlahjuli = 0
                            } else {
                                dat.data.detail[i].jumlahjuli = dat.data.detail[i].jumlahjuli
                            }

                            if(dat.data.detail[i].jumlahagustus == null){
                                dat.data.detail[i].jumlahagustus = 0
                            } else {
                                dat.data.detail[i].jumlahagustus = dat.data.detail[i].jumlahagustus
                            }

                            if(dat.data.detail[i].jumlahseptember == null){
                                dat.data.detail[i].jumlahseptember = 0
                            } else {
                                dat.data.detail[i].jumlahseptember = dat.data.detail[i].jumlahseptember
                            }

                            if(dat.data.detail[i].jumlahoktober == null){
                                dat.data.detail[i].jumlahoktober = 0
                            } else {
                                dat.data.detail[i].jumlahoktober = dat.data.detail[i].jumlahoktober
                            }

                            if(dat.data.detail[i].jumlahnovember == null){
                                dat.data.detail[i].jumlahnovember = 0
                            } else {
                                dat.data.detail[i].jumlahnovember = dat.data.detail[i].jumlahnovember
                            }

                            if(dat.data.detail[i].jumlahdesember == null){
                                dat.data.detail[i].jumlahdesember = 0
                            } else {
                                dat.data.detail[i].jumlahdesember = dat.data.detail[i].jumlahdesember
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
                                        jumlahjanuari: { type: "number" },
                                        jumlahfebruari: { type: "number" },
                                        jumlahmaret: { type: "number" },
                                        jumlahapril: { type: "number" },
                                        jumlahmei: { type: "number" },
                                        jumlahjuni: { type: "number" },
                                        jumlahjuli: { type: "number" },
                                        jumlahagustus: { type: "number" },
                                        jumlahseptember: { type: "number" },
                                        jumlahoktober: { type: "number" },
                                        jumlahnovember: { type: "number" },
                                        jumlahdesember: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahjanuari', aggregate: 'sum' },
                                { field: 'jumlahfebruari', aggregate: 'sum' },
                                { field: 'jumlahmaret', aggregate: 'sum' },
                                { field: 'jumlahapril', aggregate: 'sum' },
                                { field: 'jumlahmei', aggregate: 'sum' },
                                { field: 'jumlahjuni', aggregate: 'sum' },
                                { field: 'jumlahjuli', aggregate: 'sum' },
                                { field: 'jumlahagustus', aggregate: 'sum' },
                                { field: 'jumlahseptember', aggregate: 'sum' },
                                { field: 'jumlahoktober', aggregate: 'sum' },
                                { field: 'jumlahnovember', aggregate: 'sum' },
                                { field: 'jumlahdesember', aggregate: 'sum' },
                            ]
                        });   
                        
                        $scope.isRouteLoading = false;
                    });
            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY');
                $scope.item.ruangan = undefined;
                $scope.item.dokter = undefined;
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
                excel: {
                    fileName: "LaporanRekapTindakan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:N1", "A2:N2", "A3:N3"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY');

                    var myHeaders = [{
                        value: "LAPORAN REKAP TINDAKAN",
                        fontSize: 16,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "Periode " + awal,
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });

                    var myHeaders = [{
                        value: "",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(2, 0, { cells: myHeaders, type: "header", height: 20 });
                    
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        
                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "200px",
                    },
                    {
                        
                        "field": "jumlahjanuari",
                        "title": "Januari",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahjanuari.sum  #",
                        footerTemplate: "#: data.jumlahjanuari.sum  #"
                    },
                    {
                        
                        "field": "jumlahfebruari",
                        "title": "Februari",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahfebruari.sum  #",
                        footerTemplate: "#: data.jumlahfebruari.sum  #"
                    },
                    {
                        
                        "field": "jumlahmaret",
                        "title": "Maret",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahmaret.sum  #",
                        footerTemplate: "#: data.jumlahmaret.sum  #"
                    },
                    {
                        
                        "field": "jumlahapril",
                        "title": "April",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahapril.sum  #",
                        footerTemplate: "#: data.jumlahapril.sum  #"
                    },
                    {
                        
                        "field": "jumlahmei",
                        "title": "Mei",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahmei.sum  #",
                        footerTemplate: "#: data.jumlahmei.sum  #"
                    },
                    {
                        
                        "field": "jumlahjuni",
                        "title": "Juni",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahjuni.sum  #",
                        footerTemplate: "#: data.jumlahjuni.sum  #"
                    },
                    {
                        
                        "field": "jumlahjuli",
                        "title": "Juli",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahjuli.sum  #",
                        footerTemplate: "#: data.jumlahjuli.sum  #"
                    },
                    {
                        
                        "field": "jumlahagustus",
                        "title": "Agustus",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahagustus.sum  #",
                        footerTemplate: "#: data.jumlahagustus.sum  #"
                    },
                    {
                        
                        "field": "jumlahseptember",
                        "title": "September",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahseptember.sum  #",
                        footerTemplate: "#: data.jumlahseptember.sum  #"
                    },
                    {
                        
                        "field": "jumlahoktober",
                        "title": "Oktober",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahoktober.sum  #",
                        footerTemplate: "#: data.jumlahoktober.sum  #"
                    },
                    {
                        
                        "field": "jumlahnovember",
                        "title": "November",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahnovember.sum  #",
                        footerTemplate: "#: data.jumlahnovember.sum  #"
                    },
                    {
                        
                        "field": "jumlahdesember",
                        "title": "Desember",
                        "width": "100px",

                        aggregates: ["sum"],
                        groupFooterTemplate: "#: data.jumlahdesember.sum  #",
                        footerTemplate: "#: data.jumlahdesember.sum  #"
                    },
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});