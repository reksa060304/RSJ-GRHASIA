define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL315CaraBayarCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            //debugger
            $scope.CariRL53 = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }


            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRL3_15Ctrl', chacePeriode);

                  medifirstService.get("registrasi/laporan/get-laporan-rl315?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    var totalpasienranapjpk = 0;
                    var totalpasienranapjld = 0;
                    var totalpasienrajal = 0;
                    var totalpasienrajallab = 0;
                    var totalpasienrajalrad = 0;
                    var totalpasienrajallain = 0;
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].kdprov = '24'
                        data.data[i].kabkota = 'Kab. Sleman'
                        data.data[i].koders = '3404022'
                        data.data[i].namars = 'RSJ. Grhasia'
                        data.data[i].tahun = moment($scope.item.tglakhir).format('YYYY');
                        totalpasienranapjpk += data.data[i].pasienranapjpk;
                        totalpasienranapjld += data.data[i].pasienranapjld;
                        totalpasienrajal += data.data[i].pasienrajal;
                        totalpasienrajallab += data.data[i].pasienrajallab;
                        totalpasienrajalrad += data.data[i].pasienrajalrad;
                        totalpasienrajallain += data.data[i].pasienrajallain;
                    }
                    data.data[9].pasienranapjpk = totalpasienranapjpk
                    data.data[9].pasienranapjld = totalpasienranapjld
                    data.data[9].pasienrajal = totalpasienrajal
                    data.data[9].pasienrajallab = totalpasienrajallab
                    data.data[9].pasienrajalrad = totalpasienrajalrad
                    data.data[9].pasienrajallain = totalpasienrajallain
                    data.data[0].no = 1
                    data.data[1].no = 2
                    data.data[2].no = 2.1
                    data.data[3].no = 2.2
                    data.data[4].no = 3
                    data.data[5].no = 4
                    data.data[6].no = 4.1
                    data.data[7].no = 4.2
                    data.data[8].no = 4.3
                    data.data[9].no = 99
                    $scope.isRouteLoading = false;
                    $scope.ambildataexcel = data.data;
                    $scope.panggil($scope.ambildataexcel);
                    $scope.dataRL53 = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });


                })
            }
            $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Cara Bayar.xlsx",
                        filterable: true,
                        allPages: true,
                    },
                    dataSource: $scope.ambildataexcel,
                    // filterable: true,
                    resizable: true,
                    sortable: true,
                    pageable: true,
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
                            title: "No",
                            Template: "<span class='style-center'>#: no #</span>",
                            width: "70px"
                        },
                        {
                            field: "carabayar",
                            title: "CARA PEMBAYARAN",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "PASIEN RAWAT INAP",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "pasienranapjpk",
                                    "title": "JUMLAH PASIEN KELUAR"

                                },
                                {
                                    "field": "pasienranapjld",
                                    "title": "JUMLAH LAMA DIRAWAT"
                                }
                            ]
                        },
                        {
                            field: "pasienrajal",
                            title: "JUMLAH PASIEN RAWAT JALAN",
                            headerAttributes: { style: "text-align : center" },
                        },
                        {
                            title: "JUMLAH PASIEN RAWAT JALAN",
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    "field": "pasienrajallab",
                                    "title": "LABORATORIUM"
                                },
                                {
                                    "field": "pasienrajalrad",
                                    "title": "RADIOLOGI"
                                },
                                {
                                    "field": "pasienrajallain",
                                    "title": "LAIN-LAIN"
                                }
                            ]
                        }
                    ]
                })
            };

            $scope.panggil();

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.columndataRL53 = [
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
                    title: "No",
                    Template: "<span class='style-center'>#: no #</span>",
                    width: "70px"
                },
                {
                    field: "carabayar",
                    title: "CARA PEMBAYARAN",
                    headerAttributes: { style: "text-align : center" },
                },
                {
                    title: "PASIEN RAWAT INAP",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            "field": "pasienranapjpk",
                            "title": "JUMLAH PASIEN KELUAR"

                        },
                        {
                            "field": "pasienranapjld",
                            "title": "JUMLAH LAMA DIRAWAT"
                        }
                    ]
                },
                {
                    field: "pasienrajal",
                    title: "JUMLAH PASIEN RAWAT JALAN",
                    headerAttributes: { style: "text-align : center" },
                },
                {
                    title: "JUMLAH PASIEN RAWAT JALAN",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            "field": "pasienrajallab",
                            "title": "LABORATORIUM"
                        },
                        {
                            "field": "pasienrajalrad",
                            "title": "RADIOLOGI"
                        },
                        {
                            "field": "pasienrajallain",
                            "title": "LAIN-LAIN"
                        }
                    ]
                }
            ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPasienPulang();
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
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,namaRuangan").then(function(dat) {
            // $scope.listRuangan = dat.data;
      

            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function(dat) {
            // $scope.listPasien = dat.data;
            // });
            // manageLogistikPhp.getDataTableTransaksi("kasir/laporan-penerimaan-kasir-datacombo", true).then(function(dat){
            //     //debugger
            //     //$scope.listPegawai = dat.data.dataDokter;
            //     $scope.listRuangan = dat.data.dataruangan;
            //     //$scope.listPegawaiKasir = dat.data.datakasir;
            //     //$scope.dataLogin = dat.data.datalogin[0];
            //     $scope.listKelompokPasien = dat.data.datakelompokpasien;
            // });
        
            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [
                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }
            ];


            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 12:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            //excel
            var myApp = angular.module("myApp", []);
            myApp.factory('Excel', function ($window) {
                var uri = 'data:application/vnd.ms-excel;base64,',
                    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                    base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
                    format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
                return {
                    tableToExcel: function (tableId, worksheetName) {
                        var table = $(tableId),
                            ctx = { worksheet: worksheetName, table: table.html() },
                            href = uri + base64(format(template, ctx));
                        return href;
                    }
                };
            })
                .controller('MyCtrl', function (Excel, $timeout, $scope) {
                    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
                        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
                        $timeout(function () { location.href = exportHref; }, 100); // trigger download
                    }
                });


            $scope.Cetak = function () {
                // if($scope.item.format == undefined){
                // 	alert('format file harus dipilih terlebih dahulu !!!')
                // }
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                if ($scope.item.namaPenjamin == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.namaPenjamin.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.institusiAsalPasien == undefined || $scope.item.institusiAsalPasien.id == undefined)
                    var perusahaan = "";
                else
                    var perusahaan = $scope.item.institusiAsalPasien.id;
                var stt = 'false'
                if (confirm('View Laporan Pasien Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdDepartement=' + departement + '&strIdRuangan=' + ruangan + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&strIdPerusahaan=' + perusahaan + '&view=' + stt, function (response) {
                    // do something with response
                });
                // if(client.status==0){
                //     if($scope.item.format == undefined){
                //         alert('format file harus dipilih terlebih dahulu !!!');
                //     }else{
                //         var urlLaporan = ReportPelayanan.open('preporting/lapPelayananPasien?startDate=''+tglawal+'+tglawal+'&tglAkhir='+tglakhir+'&strIdRuangan='+ruangan+'&strIdDepartement='+departement+'&strIdKelompokPasien='+kelompokPasien+'&strIdDokter='+namaPegawai+'&format='+$scope.item.format.format);
                //         window.open(urlLaporan, '_blank');
                //     }
                // }   
            }

        }
    ]);
});