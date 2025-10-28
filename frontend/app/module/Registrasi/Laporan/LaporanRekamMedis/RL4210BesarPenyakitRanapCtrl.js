define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL4210BesarPenyakitRanapCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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

                  medifirstService.get("registrasi/laporan/get-laporan-rl42-new?"
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
                    fileName: "RL 4.2 10 Besar Penyakit Rawat Inap.xlsx",
					allPages: true,  // Ekspor semua halaman, bukan hanya halaman yang terlihat
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;  // Membekukan dua baris pertama
					sheet.mergedCells = ["A1:R1"];  // Menggabungkan sel dari A1 sampai R1
			
					// Menambahkan header kustom ke file Excel
					var myHeaders = [{
						value: "RL 4.2 10 Besar Penyakit Rawat Inap",
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
                    "template": "<span class='style-center'>#: no #</span>"
                },
                {
                    field: "kddiagnosa",
                    title: "Kelompok ICD-10"
                },
                {
                    field: "namadiagnosa",
                    title: "Kelompok Diagnosis Penyakit"
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