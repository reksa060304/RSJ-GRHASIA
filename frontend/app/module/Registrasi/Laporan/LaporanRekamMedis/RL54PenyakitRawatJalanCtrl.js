define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL54PenyakitRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            //debugger
            $scope.CariRL54 = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }
            LoadCombo()
            function LoadCombo(){
                medifirstService.get("registrasi/laporan/get-combo-mapping-rl?").then(function (data) {
                    $scope.listRuangan = data.data.ruanganrajal;
                });
            }


            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempRuanganId = "";
                  if ($scope.item.ruangan != undefined) {
                      tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                  }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRL_54Ctrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-rl54?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                ).then(function (dat) {
                    var datas = dat.data.data
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].kdprov = '0023';
                    }
                    //   debugger
                    $scope.ambildataexcel = datas;
                    $scope.panggil($scope.ambildataexcel);
                    $scope.dataRL54 = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: datas.length,
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
                        fileName: "LaporanRL5410BesarPenyakitRawatjalan.xlsx",
                        allPages: true
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    resizable: true,
                    sortable: true,
                    // reorderable: true,
                    // filterable: true,
                    pageable: true,
                    excelExport: function (e) {
                        var rows = e.workbook.sheets[0].rows;
                        var sheet = e.workbook.sheets[0];
                        // rows.unshift({
                        //     cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP", background: "#fffff" }]
                        // });
                        var columns = e.workbook.sheets[0].columns;
                        delete columns[0].width;
                        columns[0].width = 10;  //0 1 2 4 5 6 
                        delete columns[1].width;
                        columns[1].width = 15;
                        delete columns[2].width;
                        columns[2].width = 10;
                        delete columns[3].width;
                        columns[3].width = 10;
                        delete columns[4].width;
                        columns[4].width = 10;
                        delete columns[5].width;
                        columns[5].width = 10;
                        delete columns[6].width;
                        columns[6].width = 5;
                        delete columns[7].width;
                        columns[7].width = 10;
                        delete columns[8].width;
                        columns[8].width = 10;
                        delete columns[9].width;
                        columns[9].width = 50;
                        delete columns[10].width;
                        columns[10].width = 50;
                        delete columns[11].width;
                        columns[11].width = 50;
                        delete columns[12].width;
                        columns[12].width = 50;

                        for(let i = 0; i < 1; i++){
                            for(let j = 0; j <= 12; j++){
                                sheet.rows[i].cells[j].background = '#ffffff';
                                sheet.rows[i].cells[j].color = '#000000';
                                sheet.rows[i].cells[j].textAlign = 'center';
                            }
                            sheet.rows[0].height = 50;
                        }
    
                        for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                            var $row = e.workbook.sheets[0].rows[i];
                            for (var j = 0; j < $row.cells.length; j++) {
                                var $cell = $row.cells[j];
                                $cell["borderTop"] = { color: "#000000", size: 1 };
                                $cell["borderRight"] = { color: "#000000", size: 1 };
                                $cell["borderBottom"] = { color: "#000000", size: 1 };
                                $cell["borderLeft"] = { color: "#000000", size: 1 };
                            }
                        }
                       
                    },
                    // groupable: true,
                    // columnMenu: true,
                    // resizable: true,
                    columns: [
                        {
                            field: "kdprov",
                            title: "KODE PROPINSI"
                        },
                        {
                            field: "namakota",
                            title: "KAB / KOTA"
                        },
                        {
                            field: "idprofile",
                            title: "KODE RS"
                        },
                        {
                            field: "namalengkap",
                            title: "NAMA RS"
                        },
                        {
                            field: "month",
                            title: "BULAN"
                        },
                        {
                            field: "year",
                            title: "TAHUN"
                        },
                        {
                            field: "no",
                            title: "NO. URUT"
                        },
                        {
                            field: "nodaftarterperinci",
                            title: "KODE ICD 10"
                        },
                        {
                            field: "golongansebabpenyakit",
                            title: "DESKRIPSI"
                        },
                        {
                            field: "jumlahbarul",
                            title: "KASUS BARU MENURUT JENIS KELAMIN LK"
                        },
                        {
                            field: "jumlahbarup",
                            title: "KASUS BARU MENURUT JENIS KELAMIN PR"
                        },
                        {
                            field: "totalall",
                            title: "JUMLAH KASUS BARU (4 + 5)"
                        },
                        {
                            field: "jumlahkunjungan",
                            title: "JUMLAH KUNJUNGAN"
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

            $scope.createColumn = function () {
                var list = [
                    {
                        "field": "jumlahLKH",
                        "title": "LK"
                    },
                    {
                        "field": "jumlahPRH",
                        "title": "LP"
                    }
                ];

                return list;
            };

            $scope.columndataRL54 = [

                {
                    "field": "kddiagnosa",
                    "title": "KODE ICD 10",
                    "width": "150px",
                    "align": "center"
                },
                {
                    "field": "namadiagnosa",
                    "title": "<center>DESKRIPSI</center>",
                    "width": "150px"
                },
                {
                    title: "<center>KASUS BARU MENURUT JENIS KELAMIN</center>",
                    columns: $scope.createColumn()

                },
                {
                    "field": "total",
                    "title": "Jumlah Kausu Baru (4+5)"
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah Kunjungan",
                    "width": "180px"
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

            //   manageTataRekening.getDataTableTransaksi("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
            //       $scope.listDepartemen = data.data.departemen;
            //       $scope.listKelompokPasien = data.data.kelompokpasien;
            //   })

            //   $scope.getIsiComboRuangan = function(){
            //       $scope.listRuangan = $scope.item.departement.ruangan
            //   }

            
            $scope.$watch('item.namaPenjamin', function (e) {
                //debugger
                if (e === undefined) return;
                findPasien.getDataRekanan(e.id).then(function (data) {
                    $scope.sourceDataRekanan = data.data.data.listData;
                    $scope.item.institusiAsalPasien = $scope.sourceDataRekanan;
                });
                if (e.id == 5 || e.id == 3) {
                    $scope.Perusahaan = true
                } else {
                    $scope.Perusahaan = false
                    $scope.item.institusiAsalPasien = ""
                }
            })

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