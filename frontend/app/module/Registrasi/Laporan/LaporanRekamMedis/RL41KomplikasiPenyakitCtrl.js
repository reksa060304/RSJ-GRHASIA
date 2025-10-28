define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL41KomplikasiPenyakitCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            //debugger
            $scope.CariRL315 = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }

             // Ambil tahun saat ini
             const currentYear = new Date().getFullYear();

             // Atur tanggal awal menjadi 1 Januari pada jam 00:00
             const startOfYear = moment(new Date(currentYear, 0, 1, 0, 0)).format('YYYY-MM-DD HH:mm');
 
             // Atur tanggal akhir menjadi akhir hari ini pada jam 23:59
             const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm');
 
             // Set nilai default ke dalam $scope.item
             $scope.item = {
                 tglawal: startOfYear,
                 tglakhir: endOfToday
             };

            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                //   var tempRuanganId = "";
                //   if ($scope.item.ruangan != undefined) {
                //       tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                //   }
                //   var tempDepartemen = "";
                //   if ($scope.item.departement != undefined) {
                //       tempDepartemen = "&idDept=" + $scope.item.departement.id;
                //   }
                //   var tempKelPasienId = "";
                //   if ($scope.item.namaPenjamin != undefined) {
                //       tempKelPasienId = "&kelompokPasien=" + $scope.item.namaPenjamin.id;
                //   }
                //   var tempRekananId = "";
                //   if ($scope.item.institusiAsalPasien != undefined) {
                //       tempRekananId = "&institusiAsalPasien=" + $scope.item.institusiAsalPasien.id;
                //   }  
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRL3_15Ctrl', chacePeriode);

                  medifirstService.get("registrasi/laporan/get-laporan-r41-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                ).then(function (data) {
                    var data = data.data
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataRL315 = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 20,
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

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.gridOptions = {
				toolbar: ["excel"],  // Menambahkan toolbar Excel
				excel: {
                    fileName: "RL 4.1 Kompilasi Penyakit/Morbiditas Pasien Rawat Inap.xlsx",
					allPages: true,  // Ekspor semua halaman, bukan hanya halaman yang terlihat
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;  // Membekukan dua baris pertama
					sheet.mergedCells = ["A1:R1"];  // Menggabungkan sel dari A1 sampai R1
			
					// Menambahkan header kustom ke file Excel
					var myHeaders = [{
						value: "RL 4.1 Kompilasi Penyakit/Morbiditas Pasien Rawat Inap",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
					}];
			
					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				dataSource: {
					data: $scope.dataRL315,  // Menghubungkan data source
					pageSize: 20
				},
				selectable: 'row',
                pageable: true,
				resizable: true,
			};


            $scope.columnRL315 = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "50px",
                    "template": "<span class='style-center'>#: no #</span>",
                    "headerAttributes": { style: "text-align: center; vertical-align: middle; border: 1px solid black;" }
                },
                {
                    field: "kddiagnosa",
                    title: "Kode ICD",
                    headerAttributes: { style: "text-align: center; border: 1px solid black;" }
                },
                {
                    field: "namadiagnosa",
                    title: "Diagnosis Penyakit",
                    headerAttributes: { style: "text-align: center; border: 1px solid black;" }
                },
                {
                    title: "Jumlah Pasien Keluar Hidup dan Mati Menurut Kelompok Umur & Jenis Kelamin",
                    headerAttributes: { style: "text-align: center; border: 1px solid black;" },
                    columns: [
                        {
                            title: "<1 jam",
                            columns: [
                                { field: "l1", title: "L", headerAttributes: { style: "text-align: center;" } },
                                { field: "p1", title: "P", headerAttributes: { style: "text-align: center;" } }
                            ]
                        },
                        {
                            title: "1-23 jam",
                            columns: [
                                { field: "l2", title: "L" },
                                { field: "p2", title: "P" }
                            ]
                        },
                        {
                            title: "1-7 hr",
                            columns: [
                                { field: "l3", title: "L" },
                                { field: "p3", title: "P" }
                            ]
                        },
                        {
                            title: "8-28 hr",
                            columns: [
                                { field: "l4", title: "L" },
                                { field: "p4", title: "P" }
                            ]
                        },
                        {
                            title: "29 hr-<3 bln",
                            columns: [
                                { field: "l5", title: "L" },
                                { field: "p5", title: "P" }
                            ]
                        },
                        {
                            title: "3-<6 bln",
                            columns: [
                                { field: "l6", title: "L" },
                                { field: "p6", title: "P" }
                            ]
                        },
                        {
                            title: "6-11 bln",
                            columns: [
                                { field: "l7", title: "L" },
                                { field: "p7", title: "P" }
                            ]
                        },
                        {
                            title: "1-4 th",
                            columns: [
                                { field: "l8", title: "L" },
                                { field: "p28", title: "P" }
                            ]
                        },
                        {
                            title: "5-9 th",
                            columns: [
                                { field: "l9", title: "L" },
                                { field: "p9", title: "P" }
                            ]
                        },
                        {
                            title: "10-14 th",
                            columns: [
                                { field: "l10", title: "L" },
                                { field: "p10", title: "P" }
                            ]
                        },
                        {
                            title: "15-19 th",
                            columns: [
                                { field: "l11", title: "L" },
                                { field: "p11", title: "P" }
                            ]
                        },
                        {
                            title: "20-24 th",
                            columns: [
                                { field: "l12", title: "L" },
                                { field: "p12", title: "P" }
                            ]
                        },
                        {
                            title: "25-29 th",
                            columns: [
                                { field: "l13", title: "L" },
                                { field: "p13", title: "P" }
                            ]
                        },
                        {
                            title: "30-34 th",
                            columns: [
                                { field: "l14", title: "L" },
                                { field: "p14", title: "P" }
                            ]
                        },
                        {
                            title: "35-39 th",
                            columns: [
                                { field: "l15", title: "L" },
                                { field: "p15", title: "P" }
                            ]
                        },
                        {
                            title: "40-44 th",
                            columns: [
                                { field: "l16", title: "L" },
                                { field: "p16", title: "P" }
                            ]
                        },
                        {
                            title: "45-49 th",
                            columns: [
                                { field: "l17", title: "L" },
                                { field: "p17", title: "P" }
                            ]
                        },
                        {
                            title: "50-54 th",
                            columns: [
                                { field: "l18", title: "L" },
                                { field: "p18", title: "P" }
                            ]
                        },
                        {
                            title: "55-59 th",
                            columns: [
                                { field: "l19", title: "L" },
                                { field: "p19", title: "P" }
                            ]
                        },
                        {
                            title: "60-64 th",
                            columns: [
                                { field: "l20", title: "L" },
                                { field: "p20", title: "P" }
                            ]
                        },
                        {
                            title: "65-69 th",
                            columns: [
                                { field: "l21", title: "L" },
                                { field: "p21", title: "P" }
                            ]
                        },
                        {
                            title: "70-74 th",
                            columns: [
                                { field: "l22", title: "L" },
                                { field: "p22", title: "P" }
                            ]
                        },
                        {
                            title: "75-79 th",
                            columns: [
                                { field: "l25", title: "L" },
                                { field: "p25", title: "P" }
                            ]
                        },
                        {
                            title: "80-84 th",
                            columns: [
                                { field: "l23", title: "L" },
                                { field: "p23", title: "P" }
                            ]
                        },
                        {
                            title: ">85 th",
                            columns: [
                                { field: "l24", title: "L" },
                                { field: "p24", title: "P" }
                            ]
                        },
                    ]
                },
                {
                    title: "Jumlah Pasien Hidup dan Mati Menurut Jenis Kelamin",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            "field": "laki",
                            "title": "Laki-laki"
                        },
                        {
                            "field": "perempuan",
                            "title": "Perempuan"
                        },
                        {
                            field: "total",
                            title: "Total",
                            template: "# if (no <= 10) { # <span style='background-color: lightgreen; display: block; text-align: center;'>#: total #</span> # } else { # #: total # # } #"
                        }
                    ]
                },
                {
                    title: "Jumlah Pasien Keluar Mati",
                    headerAttributes: { style: "text-align : center" },
                    columns: [
                        {
                            "field": "lakidie",
                            "title": "Laki-laki"
                        },
                        {
                            "field": "perempuandie",
                            "title": "Perempuan"
                        },
                        {
                            field: "totaldie",
                            title: "Total",
                            template: "# if (no <= 10) { # <span style='background-color: lightblue; display: block; text-align: center;'>#: totaldie #</span> # } else { # #: totaldie # # } #"
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