define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL37RadiologiCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper', 
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
              
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRl39Ctrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-rl37?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        var data = data.data
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].kdprov = '24'
                            data.data[i].kabkota = 'Kab. Sleman'
                            data.data[i].koders = '3404022'
                            data.data[i].namars = 'RSJ. Grhasia'
                            data.data[i].tahun = moment($scope.item.tglakhir).format('YYYY');
                        }
                        $scope.isRouteLoading = false;
                        $scope.ambildataexcel = data.data
                        $scope.dataRL52 = new kendo.data.DataSource({
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

            // $scope.panggil = function (cokot) {

                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Laporan RL3.7 Radiologi.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var columns = e.workbook.sheets[0].columns;
                        var sheet = e.workbook.sheets[0];
                        for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                            delete columns[i].width;
                            columns[i].width = 200;
                        }

                        for (var i = 0; i < 1; i++) {
                            var $row = e.workbook.sheets[0].rows[i];
                            for (var j = 0; j < $row.cells.length; j++) {
                                var $cell = $row.cells[j];
                                $cell["borderTop"] = { color: "#000000", size: 2 };
                                $cell["borderRight"] = { color: "#000000", size: 2 };
                                $cell["borderBottom"] = { color: "#000000", size: 2 };
                                $cell["borderLeft"] = { color: "#000000", size: 2 };
                            }
                            console.log(e.workbook.sheets[0].rows.length);
                            console.log(e.workbook.sheets[0].rows[i].cells.length);
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
                    },
                    dataSource: $scope.ambildataexcel,
                    filterable: true,
                    pageable: true,
                    resizable: true,
                    // columnMenu: true,
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
                            title: "NO",
                            width: "80px"
                        },
                        {
                            field: "namaruangan",
                            title: "JENIS KEGIATAN",
                            width: "80px"
                        },
                        {
                            field: "jumlahtotal",
                            title: "JUMLAH",
                            width: "80px"
                        },
                    ]
                })
            // };

            //$scope.panggil();

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

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



        }
    ]);
});