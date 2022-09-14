define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSensusNewCtrl', ['CacheHelper',  '$scope', 'MedifirstService', 'DateHelper', 
        function (cacheHelper,$scope, medifirstService, dateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad();
            $scope.jumlahpasienkemarin = 0;
            $scope.jumlahpasienmasuk = 0;
            $scope.jumlahpasienaskes = 0;
            $scope.jmlpasienmeninggal = 0;
            $scope.jmlpasiendipindahkan = 0;
            $scope.jmlpasienpindah = 0;
            $scope.jmlPasienKeluar = 0;
            var data2 = [];

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
             medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganinap;
                    $scope.listRuanganAsal = dat.data.ruangan;
                    $scope.listKelas = dat.data.kelas;
                });
            }

            function FormLoad() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            // $scope.$watch('item.ruangan', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         if ($scope.item.ruangan != undefined) {
            //             var nmR = "";
            //             var nmK = "";
            //             if ($scope.item.ruangan != undefined) {
            //                 nmR = 'namaruangan=' + $scope.item.ruangan.namaruangan;
            //             }

            //             if ($scope.item.kelas != undefined) {
            //                 nmK = '&idkelas=' + $scope.item.kelas.id;
            //             }

            //             medifirstService.get("sysadmin/general/view-bed?" + nmR + nmK).then(function (data) {
            //                 // debugger;
            //                 var no = 0;
            //                 var data = data.data
            //                 for (var i = 0; i < data.length; i++) {
            //                     no = no + 1;
            //                     data[i].no = no;
            //                 }
            //                 var arrRuang = [];
            //                 var arrKamar = [];
            //                 var arrTT = [];
            //                 var arr = [];
            //                 var arrayS = {};
            //                 var arrayK = {};
            //                 var arrayM = {};
            //                 var stt = true;
            //                 for (var i = 0; i < data.length; i++) {
            //                     arrayM = {
            //                         idtempattidur: data[i].idtempattidur,
            //                         idruangan: data[i].idruangan,
            //                         namaruangan: data[i].namaruangan,
            //                         idkamar: data[i].idkamar,
            //                         namakamar: data[i].namakamar,
            //                         reportdisplay: data[i].reportdisplay,
            //                         nomorbed: data[i].nomorbed,
            //                         idstatusbed: data[i].idstatusbed,
            //                         statusbed: data[i].statusbed
            //                     };
            //                     arrTT.push(arrayM)
            //                 }
            //                 for (var i = 0; i < data.length; i++) {
            //                     //kamar
            //                     stt = true;
            //                     for (var j = 0; j < arrKamar.length; j++) {
            //                         if (data[i].idkamar == arrKamar[j].idkamar) {
            //                             arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
            //                             if (data[i].idstatusbed == 1) {
            //                                 arrKamar[j].isi = arrKamar[j].isi + 1;
            //                             } else {
            //                                 arrKamar[j].kosong = arrKamar[j].kosong + 1;
            //                             }
            //                             stt = false;
            //                         }
            //                     }
            //                     if (stt == true) {
            //                         var arrTTT = [];
            //                         for (var j = 0; j < arrTT.length; j++) {
            //                             if (arrTT[j].idkamar == data[i].idkamar) {
            //                                 arrTTT.push(arrTT[j]);
            //                             }
            //                         }

            //                         if (data[i].idstatusbed == 1) {
            //                             arrayK = {
            //                                 idruangan: data[i].idruangan,
            //                                 idkamar: data[i].idkamar,
            //                                 namakamar: data[i].namakamar,
            //                                 idkelas: data[i].idkelas,
            //                                 namakelas: data[i].namakelas,
            //                                 qtyBed: 1,
            //                                 isi: 1,
            //                                 kosong: 0,
            //                                 tempattidur: arrTTT
            //                             };
            //                         } else {
            //                             arrayK = {
            //                                 idruangan: data[i].idruangan,
            //                                 idkamar: data[i].idkamar,
            //                                 namakamar: data[i].namakamar,
            //                                 idkelas: data[i].idkelas,
            //                                 namakelas: data[i].namakelas,
            //                                 qtyBed: 1,
            //                                 isi: 0,
            //                                 kosong: 1,
            //                                 tempattidur: arrTTT
            //                             };
            //                         }
            //                         arrKamar.push(arrayK);
            //                     }


            //                 }
            //                 for (var i = 0; i < data.length; i++) {
            //                     //ruang
            //                     stt = true;
            //                     for (var j = 0; j < arrRuang.length; j++) {
            //                         if (data[i].idruangan == arrRuang[j].idruangan) {
            //                             arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
            //                             if (data[i].idstatusbed == 1) {
            //                                 arrRuang[j].isi = arrRuang[j].isi + 1;
            //                             } else {
            //                                 arrRuang[j].kosong = arrRuang[j].kosong + 1;
            //                             }
            //                             stt = false;
            //                         }
            //                     }
            //                     if (stt == true) {
            //                         var arrTTT = [];
            //                         for (var j = 0; j < arrKamar.length; j++) {
            //                             if (arrKamar[j].idruangan == data[i].idruangan) {
            //                                 arrTTT.push(arrKamar[j]);
            //                             }
            //                         }
            //                         if (data[i].idstatusbed == 1) {
            //                             arrayS = {
            //                                 idruangan: data[i].idruangan,
            //                                 namaruangan: data[i].namaruangan,
            //                                 qtyBed: 1,
            //                                 isi: 1,
            //                                 kosong: 0,
            //                                 kamar: arrTTT
            //                             };
            //                         } else {
            //                             arrayS = {
            //                                 idruangan: data[i].idruangan,
            //                                 namaruangan: data[i].namaruangan,
            //                                 qtyBed: 1,
            //                                 isi: 0,
            //                                 kosong: 1,
            //                                 kamar: arrTTT
            //                             };
            //                         }

            //                         arrRuang.push(arrayS);
            //                     }

            //                 }
            //                 $scope.isRouteLoading = false;
            //                 $scope.dataSource2 = arrRuang;
            //                 console.log(arrRuang)

            //                 var ttlKamarIsi = 0
            //                 var ttlKamarKosong = 0
            //                 var ttlKamarProsesAdmin = 0
            //                 var ttlKamarTotal = 0
            //                 for (var i = arrRuang.length - 1; i >= 0; i--) {
            //                     var element = arrRuang[i]
            //                     ttlKamarIsi = ttlKamarIsi + element.isi
            //                     ttlKamarKosong = ttlKamarKosong + element.kosong
            //                     ttlKamarTotal = ttlKamarTotal + element.qtyBed

            //                 }
            //                 $scope.item.ttlTempatTidur = ttlKamarTotal;
            //                 $scope.item.ttlTmpatTidurIsi = ttlKamarIsi;
            //                 $scope.item.ttlTmpatTidurKosong = ttlKamarKosong;

            //             });
            //         }
            //     }
            // });

            $scope.SearchData = function () {
                $scope.isRouteLoading = true;
                data2 = []
                getLaporanPasienMasuk();
                getLaporanPasienKeluar();
                getLaporanPasienDipindahan();
                getLaporanPasienPindahan();
                getLaporanPasienMeninggal();
                getLaporanInformasiPasienRuangan();
                getLaporanInformasiPasienRuangan();
                $scope.isRouteLoading = false;
            }

            $scope.ClearData = function () {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.ruangan = undefined
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }

            function getLaporanPasienMasuk() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tglAkhirKemarin = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var ruanganAsal="";
                if ($scope.item.ruanganAsal != undefined) {
                    ruanganAsal = "&ruanganAsal=" + $scope.item.ruanganAsal.id;
                }

                var namapasien="";
                if ($scope.item.namapasien != undefined) {
                    namapasien = "&namapasien=" + $scope.item.namapasien;
                }

                var norm="";
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-masuk-ranap-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId + nmK + ruanganAsal + namapasien + norm ).then(function (data) {
                        var datas = data.data.data
                        var data =data.data.data
                   

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                        }

                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                    })
            }


            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienmasuk.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Masuk Rawat Inap",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "60px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "tglmasuk",
                        title: "Jam Masuk  ",
                        width: "60px",
                        template: "<span class='style-left'>{{formatJam('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "asal",
                        title: "Ruangan Asal",
                        width: "125px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    },
                    {
                        field: "",
                        title: "Keterangan",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienKeluar() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var namapasien="";
                if ($scope.item.namapasien != undefined) {
                    namapasien = "&namapasien=" + $scope.item.namapasien;
                }

                var norm="";
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-keluar-ruangan-ranap-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId + nmK + namapasien + norm).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            var lR = dateHelper.CountAge(new Date(datas[i].tglmasuk), new Date(datas[i].tglkeluar));
                            var lD = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                            if (lR.day == 0) {
                                datas[i].lamarawat = '1 hr';
                            } else {
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                            if (lD.day == 0) {
                                datas[i].haridirawat = '1 hr';
                            } else {
                                datas[i].haridirawat = lD.day + ' hr ';
                            }
                        }

                        $scope.sourceLaporanPK = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                        
                    })
            }

            $scope.columnLaporanPK = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienkeluar.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Keluar Ruangan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglregistrasi",
                        title: "Jam Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglkeluar",
                        title: "Tgl Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                    },
                    {
                        field: "tglkeluar",
                        title: "Jam Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglkeluar #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "statuskeluar",
                        title: "Cara Keluar",
                        width: "120px",
                    },
                    {
                        field: "tambahan",
                        title: "Ini yang Ditambah",
                        width: "120px",
                    },
                    {
                        field: "lamarawat",
                        title: "LD",
                        width: "75px",
                    },
                    {
                        field: "haridirawat",
                        title: "HP",
                        width: "75px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    },
                    {
                        field: "namalengkap",
                        title: "Dokter",
                        width: "120px",
                    },
                    {
                        field: "",
                        title: "Keterangan",
                        width: "120px",
                    }
                ]
            }

            function getLaporanPasienPindahan() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var namapasien="";
                if ($scope.item.namapasien != undefined) {
                    namapasien = "&namapasien=" + $scope.item.namapasien;
                }

                var norm="";
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-pindahan-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId + nmK + namapasien + norm).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglpulang != undefined) {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                                datas[i].lamarawat = lR.day + ' hr ';
                            } else {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                        }
                        $scope.sourceLaporanP = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanP = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienpindahan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pindahan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "tglregistrasi",
                        title: "Jam Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "ruangansblm",
                        title: "Dari Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienDipindahan() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var namapasien="";
                if ($scope.item.namapasien != undefined) {
                    namapasien = "&namapasien=" + $scope.item.namapasien;
                }

                var norm="";
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-dipindahan-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId + nmK + namapasien + norm).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglpulang != undefined) {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                                datas[i].lamarawat = lR.day + ' hr ';
                            } else {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                        }
                        $scope.sourceLaporanDP = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanDP = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasiendipindahkan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pindahan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglmasuk",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "tglmasuk",
                        title: "Jam Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglmasuk #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "ruanganskrng",
                        title: "Ke Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }

            function getLaporanPasienMeninggal() {
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var namapasien="";
                if ($scope.item.namapasien != undefined) {
                    namapasien = "&namapasien=" + $scope.item.namapasien;
                }

                var norm="";
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-meninggal-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId + nmK + namapasien + norm).then(function (data) {
                        var datas = data.data.data;
                        var pasienBlmPlng = 0;
                        var pasienSdhPulang = 0;

                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if (datas[i].tglpulang != undefined) {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date(datas[i].tglpulang));
                                datas[i].lamarawat = lR.day + ' hr ';
                            } else {
                                var lR = dateHelper.CountAge(new Date(datas[i].tglregistrasi), new Date($scope.now));
                                datas[i].lamarawat = lR.day + ' hr ';
                            }
                        }
                        $scope.sourceLaporanPM = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 50,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                    })
            }

            $scope.columnLaporanPM = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanpasienMeninggal.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Meninggal Diruangan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglregistrasi",
                        title: "Jam Masuk  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglmeninggal",
                        title: "Tgl Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"
                    },
                    {
                        field: "tglmeninggal",
                        title: "Jam Keluar  ",
                        width: "80px",
                        template: "<span class='style-left'>{{formatJam('#: tglmeninggal #')}}</span>"
                    },
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "90px",
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "95px",
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "120px",
                    },
                    {
                        field: "statuskeluar",
                        title: "Cara Keluar",
                        width: "120px",
                    },
                    {
                        field: "lamarawat",
                        title: "LD",
                        width: "75px",
                    },
                    {
                        field: "smf",
                        title: "HR",
                        width: "75px",
                    },
                    {
                        field: "kelompokpasien",
                        title: "Tipe Pasien",
                        width: "105px",
                    },
                    {
                        field: "kddiagnosa",
                        title: "Diagnosa",
                        width: "120px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "125px",
                    },
                    {
                        field: "namakelas",
                        title: "Kelas Rawat",
                        width: "105px",
                    },
                    {
                        field: "smf",
                        title: "SMF",
                        width: "75px",
                    }
                ]
            }


            function getLaporanInformasiPasienRuangan() {
                var data3 = [];
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tglAkhirKemarin = moment($scope.item.tglawal).format('YYYY-MM-DD 23:59');
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var nmK = "";
                if ($scope.item.kelas != undefined) {
                    nmK = '&idkelas=' + $scope.item.kelas.id;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: ''
                }
                cacheHelper.set('LaporanSensusRevCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-pasien-informasi-ruangan-new?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhirKemarin=" + tglAkhirKemarin
                    + tempRuanganId + nmK).then(function (data) {
                        var datas = data.data.detail;
                        var jumlahtt = 0;
                        var jumlahhariperawatantt = 0;
                        var jumlahharipulang = 0;
                        var jumlahmeninggallebihdari = 0;
                        var jumlahmeninggal = 0;
                        var jumlahlamadirawat = datas[0].jumlahharidirawat;
                        var persenbor = 0;
                        var persenlos = 0;
                        var persentoi = 0;
                        var persenbto = 0;
                        var persenndr = 0;
                        var persengdr = 0;
                        var tglperiodeawal = '';
                        var tglperiodeakhir = '';
                        var jumlahttruangan = '';

                        $scope.item.losaja = datas[0].jumlahharidirawat;
                        //console.log(jumlahlamadirawat);
                        
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            if($scope.item.ruangan != undefined){
                                jumlahtt = datas[0].jumlahtt;
                            }
                            else{
                                jumlahtt = datas[i].jumlahtt;
                            }
                            if(datas[i].jumlahttruangan != null){
                                jumlahttruangan = datas[i].jumlahttruangan;
                            }
                            if(datas[i].jumlahhariperawatan != null){
                                jumlahhariperawatantt += datas[i].jumlahhariperawatan;
                            }
                            if(datas[i].jumlahpulang != null){
                                jumlahharipulang += datas[i].jumlahpulang;
                            }
                            if(datas[i].jumlahpasienmeninggallebihdari != null){
                                jumlahmeninggallebihdari += datas[i].jumlahpasienmeninggallebihdari;
                            }
                            if(datas[i].jumlahpasienmeninggal != null){
                                jumlahmeninggal += datas[i].jumlahpasienmeninggal;
                            }
                            tglperiodeawal = datas[0].tanggal;
                            tglperiodeakhir = datas[datas.length-1].tanggal;

                        }
                        console.log(jumlahhariperawatantt);
                        console.log(jumlahtt*datas.length);
                        persenbor = jumlahhariperawatantt/(jumlahtt*datas.length)*100;
                        persenlos = jumlahlamadirawat/jumlahharipulang;
                        persentoi = ((jumlahtt*datas.length)-jumlahhariperawatantt)/jumlahharipulang;
                        persenbto = jumlahharipulang/jumlahtt;
                        persenndr = (jumlahmeninggallebihdari/jumlahharipulang)*1000;
                        persengdr = (jumlahmeninggal/jumlahharipulang)*1000;
                        $scope.item.ttlTempatTidur = jumlahtt;
                        $scope.item.ruangan = jumlahttruangan;
                        $scope.item.bortt = persenbor.toFixed(2) + "%";
                        $scope.item.los = persenlos.toFixed(2) + " hari/pasien";
                        $scope.item.toi = persentoi.toFixed(2) + " hari";
                        $scope.item.bto = persenbto.toFixed(2) + " kali";
                        $scope.item.ndr = persenndr.toFixed(2) + " permil";
                        $scope.item.gdr = persengdr.toFixed(2) + " permil";
                        $scope.item.tglperiodeawal = tglperiodeawal;
                        $scope.item.tglperiodeakhir = tglperiodeakhir;


                        $scope.sourceLaporanIn = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 50,
                            // total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlahpasienawal: {type: 'number'},
                                        jumlahpasienpindah: {type: 'number'},
                                        jumlahpasienmasuk: {type: 'number'},
                                        jumlahpasiendipindahkan: {type: 'number'},
                                        jumlahpasienmeninggal: {type: 'number'},
                                        jumlahpasienpulang: {type: 'number'},
                                        jumlahpasienpulangaps: {type: 'number'},
                                        jumlahpasienpulangmelarikandiri: {type: 'number'},
                                        jumlahpasienmeninggalkurangdari: {type: 'number'},
                                        jumlahpasienmeninggallebihdari: {type: 'number'},
                                        jumlahpasienmkhs: {type: 'number'},
                                        jumlahpasienkelassatu: {type: 'number'},
                                        jumlahpasienkelasdua: {type: 'number'},
                                        jumlahpasienkelastiga: {type: 'number'},
                                        jumlahpasienkelasvip: {type: 'number'},
                                        jumlahpasienkelasuppi: {type: 'number'},
                                        jumlahpasienkelasinfeksi: {type: 'number'},
                                        jumlahhariperawatan: {type: 'number'},
                                        jumlahpulang: {type: 'number'},
                                        jumlahsisa: {type: 'number'},
                                        jumlahlamadirawat: {type: 'number'},
                                    }
                                }
                            },
                                aggregate: 
                                [
                                    {
                                        field: 'jumlahpasienawal',
                                        aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienpindah',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasiendipindahkan',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienmeninggal',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienpulang',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienpulangaps',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienpulangmelarikandiri',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienmeninggalkurangdari',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienmeninggallebihdari',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienmkhs',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelassatu',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelasdua',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelastiga',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelasvip',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelasuppi',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienkelasinfeksi',
                                    aggregate: 'sum'
                                    },
                                    {
                                    field: 'jumlahpasienmasuk',
                                    aggregate: 'sum'
                                    },
                                    {
                                        field: 'jumlahhariperawatan',
                                        aggregate: 'sum'
                                    },
                                    {
                                        field: 'jumlahpulang',
                                        aggregate: 'sum'
                                    },
                                    {
                                        field: 'jumlahsisa',
                                        aggregate: 'sum'
                                    },
                                    {
                                        field: 'jumlahlamadirawat',
                                        aggregate: 'sum'
                                    },
                                ]
                            });
                    })
            }

            $scope.columnLaporanIn = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanPasienRuangan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:U1", "A2:U2", "A3:U3", "A4:U4", "A5:U5", "A6:U6"];
                    sheet.name = "Orders";

                    var jumlahtt = $scope.item.ttlTempatTidur;
                    var jumlahttruangan = $scope.item.ruangan;
                    var persenbor = $scope.item.bortt;
                    var persenlos = $scope.item.los;
                    var persentoi = $scope.item.toi;
                    var persenbto = $scope.item.bto;
                    var persenndr = $scope.item.ndr;
                    var persengdr = $scope.item.gdr;
                    var tglperiodeawal =$scope.item.tglperiodeawal;
                    var tglperiodeakhir =$scope.item.tglperiodeakhir;
                    
                    var myHeaders = [{
                        value: "SENSUS HARIAN RAWAT INAP",
                        fontSize: 16,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    
                    var myHeadersSubJudul = [{
                        value: "RSJ. Grhasia",
                        fontSize: 13,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(1, 0, { cells: myHeadersSubJudul, type: "header", height: 25 });
                    
                    var myHeadersPeriode = [{
                        value: "Periode: " + tglperiodeawal + " s/d " + tglperiodeakhir,
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(2, 0, { cells: myHeadersPeriode, type: "header", height: 20 });
                    
                    var myHeadersRuangan = [{
                        value: "Nama Bangsal: " + jumlahttruangan,
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(3, 0, { cells: myHeadersRuangan, type: "header", height: 20 });
                    
                    var myHeadersJumlahTT = [{
                        value: "Jumlah TT:   " + jumlahtt,
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(4, 0, { cells: myHeadersJumlahTT, type: "header", height: 35 });
                    
                    var myHeadersBorLosToi = [{
                        value: "",
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(5, 0, { cells: myHeadersBorLosToi, type: "header", height: 20 });
                    
                    var myHeadersBorLosToi = [{
                        value: "BOR:            " + persenbor + "          LOS:            " + persenlos + "            TOI:            " + persentoi + "            BTO:           " + persenbto + "           NDR:             " + persenndr + "            GDR:            " + persengdr,
                        fontSize: 11,
                        textAlign: "left",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(40, 0, { cells: myHeadersBorLosToi, type: "footer", height: 50 });

                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns:
                [

                    {
                        field: "no",
                        title: "Tanggal",
                        width: "90px",
                        footerTemplate: "Total",
                    },
                    {
                        field: "jumlahpasienawal",
                        title: "Pasien Awal",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienawal  #",
                        groupFooterTemplate: "#: data.jumlahpasienawal.sum #",
                        footerTemplate: "#: data.jumlahpasienawal.sum #",
                    },
                    {
                        field: "jumlahpasienmasuk",
                        title: "Pasien Masuk",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienmasuk  #",
                        footerTemplate: "#: data.jumlahpasienmasuk.sum #",
                    },
                    {
                        field: "jumlahpasienpindah",
                        title: "Pasien Pindah",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienpindah  #",
                        footerTemplate: "#: data.jumlahpasienpindah.sum #",
                    },
                    {
                        field: "jumlahhariperawatan",
                        title: "Hari Perawatan",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahhariperawatan  #",
                        footerTemplate: "#: data.jumlahhariperawatan.sum#",
                    },
                    {
                        field: "jumlahpasiendipindahkan",
                        title: "Pasien Dipindahkan",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasiendipindahkan  #",
                        footerTemplate: "#: data.jumlahpasiendipindahkan.sum #",
                    },
                    {
                        field: "jumlahpasienpulang",
                        title: "Pasien Pulang",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienpulang  #",
                        footerTemplate: "#: data.jumlahpasienpulang.sum #",
                    },
                    {
                        field: "jumlahpasienpulangaps",
                        title: "Pasien Pulang APS (Atas Permintaan Sendiri)",
                        width: "180px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienpulangaps  #",
                        footerTemplate: "#: data.jumlahpasienpulangaps.sum #",
                    },
                    {
                        field: "jumlahpasienpulangmelarikandiri",
                        title: "Melarikan Diri",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienpulangmelarikandiri  #",
                        footerTemplate: "#: data.jumlahpasienpulangmelarikandiri.sum #",
                    },
                    {
                        field: "jumlahpulang",
                        title: "Jumlah Pulang",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpulang  #",
                        footerTemplate: "#: data.jumlahpulang.sum #",
                    },
                    {
                        field: "jumlahsisa",
                        title: "Jumlah Sisa",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahsisa  #",
                        footerTemplate: "#: data.jumlahsisa.sum #",
                    },
                    {
                        field: "jumlahpasienmeninggalkurangdari",
                        title: "Meninggal < 24 Jam",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienmeninggalkurangdari  #",
                        footerTemplate: "#: data.jumlahpasienmeninggalkurangdari.sum #",
                    },
                    {
                        field: "jumlahpasienmeninggallebihdari",
                        title: "Meninggal > 24 Jam",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienmeninggallebihdari  #",
                        footerTemplate: "#: data.jumlahpasienmeninggallebihdari.sum #",
                    },
                    {
                        field: "jumlahpasienmeninggal",
                        title: "Pasien Meninggal",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienmeninggal  #",
                        footerTemplate: "#: data.jumlahpasienmeninggal.sum #",
                    },
                    {
                        field: "jumlahpasienmkhs",
                        title: "Pasien MKHS (Masuk Keluar Hari Sama)",
                        width: "180px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienmkhs  #",
                        footerTemplate: "#: data.jumlahpasienmkhs.sum #",
                    },
                    {
                        field: "jumlahpasienkelassatu",
                        title: "Kelas I",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelassatu  #",
                        footerTemplate: "#: data.jumlahpasienkelassatu.sum #",
                    },
                    {
                        field: "jumlahpasienkelasdua",
                        title: "Kelas II",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelasdua  #",
                        footerTemplate: "#: data.jumlahpasienkelasdua.sum #",
                    },
                    {
                        field: "jumlahpasienkelastiga",
                        title: "Kelas III",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelastiga  #",
                        footerTemplate: "#: data.jumlahpasienkelastiga.sum #",
                    },
                    {
                        field: "jumlahpasienkelasvip",
                        title: "Kelas VIP",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelasvip  #",
                        footerTemplate: "#: data.jumlahpasienkelasvip.sum #",
                    },
                    {
                        field: "jumlahpasienkelasuppi",
                        title: "Kelas UPPI",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelasuppi  #",
                        footerTemplate: "#: data.jumlahpasienkelasuppi.sum #",
                    },
                    {
                        field: "jumlahpasienkelasinfeksi",
                        title: "Kelas Infeksi/TB",
                        width: "90px",
                        aggregates: ["sum"],
                        template: "#: jumlahpasienkelasinfeksi  #",
                        footerTemplate: "#: data.jumlahpasienkelasinfeksi.sum #",
                    }
                ]
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});