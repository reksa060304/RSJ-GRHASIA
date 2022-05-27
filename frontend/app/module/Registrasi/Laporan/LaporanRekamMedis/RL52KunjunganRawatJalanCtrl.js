define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL52KunjunganRawatJalanCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.CariRegistrasiPasien = function () {
                $scope.isRouteLoading = true;
                LoadData()
            }

            function LoadData() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY');
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }
                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    if ($scope.item.kelompokPasien.kelompokpasien == 'Non BPJS') {
                        tempKelPasienId = "&kelompokPasien=153"
                    } else {
                        tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                    }
                }
                var chacePeriode = {
                    0: tglAwal,
                }
                cacheHelper.set('LaporanRl52Ctrl', chacePeriode);

                 medifirstService.get("registrasi/laporan/get-laporan-rl52?"
                    + "tglAwal=" + tglAwal).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            datas[i].kdprov = '24';
                            datas[i].koders = '3404022';
                            datas[i].year = new Date(tglAwal).getFullYear();
                        }
                        $scope.ambildataexcel = datas;
                        $scope.panggil($scope.ambildataexcel);
                        $scope.dataRL52 = new kendo.data.DataSource({
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
                        fileName: "LaporanRL52KunjunganRawatJalan.xlsx",
                        allPages: true
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    pageable: true,
                    resizable: true,
                    // columnMenu: true,
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
    
                        for(let i = 0; i < 1; i++){
                            for(let j = 0; j <= 8; j++){
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
                    columns: [
                        {
                            field: "koders",
                            title: "KODE RS"
                        },
                        {
                            field: "namars",
                            title: "NAMA RS"
                        },
                        {
                            field: "hasilbulan",
                            title: "BULAN"
                        },
                        {
                            field: "year",
                            title: "TAHUN"
                        },
                        {
                            field: "namakota",
                            title: "KAB / KOTA"
                        },
                        {
                            field: "kdprov",
                            title: "KODE PROVINSI"
                        },
                        {
                            field: "no",
                            title: "NO URUT"
                        },
                        {
                            field: "hasilnama",
                            title: "JENIS KEGIATAN"
                        },
                        {
                            field: "jumlah",
                            title: "JUMLAH"
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

            // $scope.columnRL52 = [
            //     {
            //         field: "kdprov",
            //         title: "KODE PROPINSI"
            //     },
            //     {
            //         field: "kabkota",
            //         title: "KAB / KOTA"
            //     },
            //     {
            //         field: "idprofile",
            //         title: "KODE RS"
            //     },
            //     {
            //         field: "namalengkap",
            //         title: "NAMA RS"
            //     },
            //     {
            //         field: "month",
            //         title: "BULAN"
            //     },
            //     {
            //         field: "year",
            //         title: "TAHUN"
            //     },
            //     {
            //         field: "no",
            //         title: "NO. URUT"
            //     },
            //     {
            //         field: "nodaftarterperinci",
            //         title: "KODE ICD 10"
            //     },
            //     {
            //         field: "golongansebabpenyakit",
            //         title: "DESKRIPSI"
            //     },
            //     {
            //         field: "jumlahhml",
            //         title: "PASIEN KELUAR HIDUP MENURUT JENIS KELAMIN LK"
            //     },
            //     {
            //         field: "jumlahhmp",
            //         title: "PASIEN KELUAR HIDUP MENURUT JENIS KELAMIN PR"
            //     },
            //     {
            //         field: "jumlahml",
            //         title: "PASIEN KELUAR MATI MENURUT JK LK"
            //     },
            //     {
            //         field: "jumlahmp",
            //         title: "PASIEN KELUAR MATI MENURUT JK PR"
            //     },
            //     {
            //         field: "totalall",
            //         title: "TOTAL ALL"
            //     }
            // ];

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariRegistrasiPasien();
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
    
            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {
           
                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listKelompokPasien = dat.data.kelompokpasien;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
            });
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }
            $scope.$watch('item.namaPenjamin', function (e) {

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