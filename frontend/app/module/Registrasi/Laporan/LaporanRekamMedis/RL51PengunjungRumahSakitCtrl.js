define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL51PengunjungRumahSakitCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
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
                var chacePeriode = {
                    0: tglAwal,
                }
                cacheHelper.set('LaporanRl52Ctrl', chacePeriode);

                 medifirstService.get("registrasi/laporan/get-laporan-rl51?"
                    + "tglAwal=" + tglAwal).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            datas[i].kdprov = '24';
                            datas[i].koders = '3404022';
                        }
                        $scope.ambildataexcel = datas;
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

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "LpaoranRL51Pengunjung.xlsx",
                        allPages: true
                    },
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

                        for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                            delete columns[i].width;
                            columns[i].width = 15;
                        }

                        sheet.rows[0].cells[0].background = '#6fde78';
                        sheet.rows[0].cells[0].color = '#000000'; 
                        sheet.rows[0].cells[1].background = '#6fde78'; 
                        sheet.rows[0].cells[1].color = '#000000'; 
                        sheet.rows[0].cells[2].background = '#6fde78'; 
                        sheet.rows[0].cells[2].color = '#000000'; 
                        sheet.rows[0].cells[3].background = '#6fde78'; 
                        sheet.rows[0].cells[3].color = '#000000'; 
                        sheet.rows[0].cells[4].background = '#6fde78'; 
                        sheet.rows[0].cells[4].color = '#000000'; 
                        sheet.rows[0].cells[5].background = '#6fde78'; 
                        sheet.rows[0].cells[5].color = '#000000'; 
                        sheet.rows[0].cells[6].background = '#6fde78'; 
                        sheet.rows[0].cells[6].color = '#000000'; 
                        sheet.rows[0].cells[7].background = '#6fde78'; 
                        sheet.rows[0].cells[7].color = '#000000'; 
                        sheet.rows[0].cells[8].background = '#6fde78'; 
                        sheet.rows[0].cells[8].color = '#000000'; 
                       
                    },
                    columns: [
                        {
                            field: "koders",
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
                            field: "namakota",
                            title: "KAB / KOTA"
                        },
                        {
                            field: "kdprov",
                            title: "KODE PROPINSI"
                        },
                        {
                            field: "no",
                            title: "NO"
                        },
                        {
                            field: "statuspasienfixbanget",
                            title: "JENIS KEGIATAN",
                        },
                        {
                            field: "jumlahkunjungan",
                            title: "JUMLAH"
                        }
                    ]
                })
            };

            $scope.panggil();

            // $scope.columnRL52 = [
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
            //         field: "namakota",
            //         title: "KAB / KOTA"
            //     },
            //     {
            //         field: "kdprov",
            //         title: "KODE PROPINSI"
            //     },
            //     {
            //         field: "no",
            //         title: "NO"
            //     },
            //     {
            //         field: "statuspasienfix",
            //         title: "JENIS KEGIATAN",
            //         template: "<span class='style-center'>{{ statuspasienfix == 'LAMA' ? 'Pengunjung Lama' : 'Pengunjung Baru' }}</span>",
            //     },
            //     {
            //         field: "jumlahkunjungan",
            //         title: "JUMLAH"
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