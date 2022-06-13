define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL38LaboratoriumCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper', 
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

                medifirstService.get("registrasi/laporan/get-laporan-rl38?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        var data = data.data
                        var j = 0;
                        var k = 0;
                        var l = 0;
                        var m = 0;
                        var n = 0;
                        var o = 0;
                        var p = 0;
                        var q = 0;
                        var r = 0;
                        var s = 0;
                        var t = 0;
                        var u = 0;
                        var v = 0;
                        var w = 0;
                        var x = 0;
                        var length = data.data.length - 1
                        var tot = 0
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].kdprov = '24'
                            data.data[i].kabkota = 'Kab. Sleman'
                            data.data[i].koders = '3404022'
                            data.data[i].namars = 'RSJ. Grhasia'
                            data.data[i].tahun = moment($scope.item.tglakhir).format('YYYY');
                            tot += data.data[i].jumlahtotal
                        }

                        data.data[0].no = "1";
                        data.data[1].no = "1.1";
                        data.data[10].no = "1.2";
                        data.data[17].no = "1.3";
                        data.data[21].no = "1.4";
                        data.data[26].no = "1.5";
                        data.data[49].no = "1.6";
                        data.data[58].no = "2";
                        data.data[59].no = "2.1";
                        data.data[81].no = "2.2";
                        data.data[87].no = "2.3";
                        data.data[97].no = "2.4";
                        data.data[114].no = "2.5";
                        data.data[136].no = "2.6";
                        data.data[143].no = "2.7";
                        data.data[153].no = "2.8";
                        data.data[186].no = "2.9";
                        data.data[length].no = 99
                        data.data[length].jumlahtotal = tot

                        for(i = 2; i <= 9; i++){
                            j++
                            data.data[i].no = "1.1."+j
                        }

                        for(i = 11; i <= 16; i++){
                            k++
                            data.data[i].no = "1.2."+k
                        }

                        for(i = 18; i <= 20; i++){
                            l++
                            data.data[i].no = "1.3."+l
                        }

                        for(i = 22; i <= 25; i++){
                            m++
                            data.data[i].no = "1.4."+m
                        }

                        for(i = 27; i <= 48; i++){
                            n++
                            data.data[i].no = "1.5."+n
                        }

                        for(i = 50; i <= 57; i++){
                            o++
                            data.data[i].no = "1.6."+o
                        }

                        for(i = 60; i <= 80; i++){
                            p++
                            data.data[i].no = "2.1."+p
                        }

                        for(i = 82; i <= 86; i++){
                            q++
                            data.data[i].no = "2.2."+q
                        }

                        for(i = 88; i <= 96; i++){
                            r++
                            data.data[i].no = "2.3."+r
                        }

                        for(i = 98; i <= 113; i++){
                            s++
                            data.data[i].no = "2.4."+s
                        }

                        for(i = 115; i <= 135; i++){
                            t++
                            data.data[i].no = "2.5."+t
                        }

                        for(i = 137; i <= 142; i++){
                            u++
                            data.data[i].no = "2.6."+u
                        }

                        for(i = 144; i <= 152; i++){
                            v++
                            data.data[i].no = "2.7."+v
                        }

                        for(i = 154; i <= 185; i++){
                            w++
                            data.data[i].no = "2.8."+w
                        }

                        for(i = 187; i <= 200; i++){
                            x++
                            data.data[i].no = "2.9."+x
                        }

                        console.log(data.data.no);

                        $scope.isRouteLoading = false;
                        $scope.ambildataexcel = data.data;
                        $scope.panggil($scope.ambildataexcel);
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

            $scope.panggil = function (cokot) {
                $("#kGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Laporan RL3.8 Laboratorium.xlsx",
                        allPages: true
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
            };
            

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnRL52 = [

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
            ];

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