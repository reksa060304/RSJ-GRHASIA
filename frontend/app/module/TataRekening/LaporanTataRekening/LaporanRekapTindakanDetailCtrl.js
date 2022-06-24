define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapTindakanDetailCtrl', ['$scope', 'DateHelper', 'MedifirstService',
        function ($scope, DateHelper, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.isLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm');
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
				if ($scope.item.namaProdukScr != undefined) {
                    listProduk = $scope.item.namaProdukScr;
                }

                var departemen = ""
				if ($scope.item.departemen != undefined) {
                    departemen = $scope.item.departemen.id;
                }

                var ruangan = ""
				if ($scope.item.ruangan != undefined) {
                    ruangan = $scope.item.ruangan.id;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("tatarekening/get-laporan-rekap-tindakan-detail?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&departemen=" + departemen +
                    "&ruangan=" + ruangan +
                    "&namaproduk=" + listProduk
                    ).then(function (dat) {
                        
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
                        
                        $scope.isRouteLoading = false;
                    });
            }

            function FormLoad() {
                LoadCombo();
            }

            $scope.ClearData = function () {
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

            $scope.group = {
                field: "namaproduk",
                aggregates: [{
                    field: "namaproduk",
                    aggregate: "count"
                }]
            };

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanRekapTindakanDetail.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:N1", "A2:N2", "A3:N3"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    var akhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "LAPORAN REKAP TINDAKAN DETAIL",
                        fontSize: 16,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "Periode " + awal + " s/d " + akhir,
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
                    },
                    {
                        
                        "field": "nocm",
                        "title": "No RM",
                    },
                    {
                        
                        "field": "tglperiksa",
                        "title": "Tgl Pelayanan",
                    },
                    {
                        
                        "field": "namaproduk",
                        "title": "Tindakan",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    },
                    {
                        
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        
                    },
                    {
                        
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                    },
                    {
                        
                        "field": "alamatlengkap",
                        "title": "Alamat",
                    },
                    {
                        
                        "field": "namadesakelurahan",
                        "title": "Desa / Kelurahan",
                    },
                    {
                        
                        "field": "kecamatan",
                        "title": "Kecamatan",
                    },
                    {
                        
                        "field": "namakotakabupaten",
                        "title": "Kota / Kabupaten",
                    },
                    {
                        
                        "field": "namaruangan",
                        "title": "Ruangan",
                    },
                    {
                        
                        "field": "dokter",
                        "title": "DPJP",
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