define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSensusCtrl', ['CacheHelper',  '$scope', 'MedifirstService', 'DateHelper', 
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
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.$watch('item.ruangan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.ruangan != undefined) {
                        var nmR = "";
                        var nmK = "";
                        if ($scope.item.ruangan != undefined) {
                            nmR = 'namaruangan=' + $scope.item.ruangan.namaruangan;
                        }

                        if ($scope.item.kelas != undefined) {
                            nmK = '&idkelas=' + $scope.item.kelas.id;
                        }

                        medifirstService.get("sysadmin/general/view-bed?" + nmR + nmK).then(function (data) {
                            // debugger;
                            var no = 0;
                            var data = data.data
                            for (var i = 0; i < data.length; i++) {
                                no = no + 1;
                                data[i].no = no;
                            }
                            var arrRuang = [];
                            var arrKamar = [];
                            var arrTT = [];
                            var arr = [];
                            var arrayS = {};
                            var arrayK = {};
                            var arrayM = {};
                            var stt = true;
                            for (var i = 0; i < data.length; i++) {
                                arrayM = {
                                    idtempattidur: data[i].idtempattidur,
                                    idruangan: data[i].idruangan,
                                    namaruangan: data[i].namaruangan,
                                    idkamar: data[i].idkamar,
                                    namakamar: data[i].namakamar,
                                    reportdisplay: data[i].reportdisplay,
                                    nomorbed: data[i].nomorbed,
                                    idstatusbed: data[i].idstatusbed,
                                    statusbed: data[i].statusbed
                                };
                                arrTT.push(arrayM)
                            }
                            for (var i = 0; i < data.length; i++) {
                                //kamar
                                stt = true;
                                for (var j = 0; j < arrKamar.length; j++) {
                                    if (data[i].idkamar == arrKamar[j].idkamar) {
                                        arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
                                        if (data[i].idstatusbed == 1) {
                                            arrKamar[j].isi = arrKamar[j].isi + 1;
                                        } else {
                                            arrKamar[j].kosong = arrKamar[j].kosong + 1;
                                        }
                                        stt = false;
                                    }
                                }
                                if (stt == true) {
                                    var arrTTT = [];
                                    for (var j = 0; j < arrTT.length; j++) {
                                        if (arrTT[j].idkamar == data[i].idkamar) {
                                            arrTTT.push(arrTT[j]);
                                        }
                                    }

                                    if (data[i].idstatusbed == 1) {
                                        arrayK = {
                                            idruangan: data[i].idruangan,
                                            idkamar: data[i].idkamar,
                                            namakamar: data[i].namakamar,
                                            idkelas: data[i].idkelas,
                                            namakelas: data[i].namakelas,
                                            qtyBed: 1,
                                            isi: 1,
                                            kosong: 0,
                                            tempattidur: arrTTT
                                        };
                                    } else {
                                        arrayK = {
                                            idruangan: data[i].idruangan,
                                            idkamar: data[i].idkamar,
                                            namakamar: data[i].namakamar,
                                            idkelas: data[i].idkelas,
                                            namakelas: data[i].namakelas,
                                            qtyBed: 1,
                                            isi: 0,
                                            kosong: 1,
                                            tempattidur: arrTTT
                                        };
                                    }
                                    arrKamar.push(arrayK);
                                }


                            }
                            for (var i = 0; i < data.length; i++) {
                                //ruang
                                stt = true;
                                for (var j = 0; j < arrRuang.length; j++) {
                                    if (data[i].idruangan == arrRuang[j].idruangan) {
                                        arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
                                        if (data[i].idstatusbed == 1) {
                                            arrRuang[j].isi = arrRuang[j].isi + 1;
                                        } else {
                                            arrRuang[j].kosong = arrRuang[j].kosong + 1;
                                        }
                                        stt = false;
                                    }
                                }
                                if (stt == true) {
                                    var arrTTT = [];
                                    for (var j = 0; j < arrKamar.length; j++) {
                                        if (arrKamar[j].idruangan == data[i].idruangan) {
                                            arrTTT.push(arrKamar[j]);
                                        }
                                    }
                                    if (data[i].idstatusbed == 1) {
                                        arrayS = {
                                            idruangan: data[i].idruangan,
                                            namaruangan: data[i].namaruangan,
                                            qtyBed: 1,
                                            isi: 1,
                                            kosong: 0,
                                            kamar: arrTTT
                                        };
                                    } else {
                                        arrayS = {
                                            idruangan: data[i].idruangan,
                                            namaruangan: data[i].namaruangan,
                                            qtyBed: 1,
                                            isi: 0,
                                            kosong: 1,
                                            kamar: arrTTT
                                        };
                                    }

                                    arrRuang.push(arrayS);
                                }

                            }
                            $scope.isRouteLoading = false;
                            $scope.dataSource2 = arrRuang;
                            console.log(arrRuang)

                            var ttlKamarIsi = 0
                            var ttlKamarKosong = 0
                            var ttlKamarProsesAdmin = 0
                            var ttlKamarTotal = 0
                            for (var i = arrRuang.length - 1; i >= 0; i--) {
                                var element = arrRuang[i]
                                ttlKamarIsi = ttlKamarIsi + element.isi
                                ttlKamarKosong = ttlKamarKosong + element.kosong
                                ttlKamarTotal = ttlKamarTotal + element.qtyBed

                            }
                            $scope.item.ttlTempatTidur = ttlKamarTotal;
                            $scope.item.ttlTmpatTidurIsi = ttlKamarIsi;
                            $scope.item.ttlTmpatTidurKosong = ttlKamarKosong;

                        });
                    }
                }
            });

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
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
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

             medifirstService.get("registrasi/laporan/get-data-pasien-masuk-ranap?"
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
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

             medifirstService.get("registrasi/laporan/get-data-pasien-keluar-ruangan-ranap?"
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
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

             medifirstService.get("registrasi/laporan/get-data-pasien-pindahan?"
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
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

             medifirstService.get("registrasi/laporan/get-data-pasien-dipindahan?"
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
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
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

             medifirstService.get("registrasi/laporan/get-data-pasien-meninggal?"
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

             medifirstService.get("registrasi/laporan/get-data-pasien-informasi-ruangan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&tglAkhirKemarin=" + tglAkhirKemarin
                    + tempRuanganId + nmK + namapasien + norm).then(function (data) {
                        var data = data.data
                        var datamasuk = data.datamasuk;
                        var dataKemarin = data.datakemarin;
                        var dataAkses = data.dataaskes;
                        var datakeluar = data.datakeluar;
                        var datadipindahkan = data.datadipindahkan;
                        var datapindahan = data.datapindah;
                        var dataminggal = data.datameninggal;

                        var jmlkemarin = 0;
                        var jmlmasuk = 0;
                        var jmlkeluar = 0;
                        var jmlpindah = 0;
                        var jmldipindah = 0;
                        var jmlmeninggal = 0;
                        var jmlsisa = 0;
                        var jmlakses = 0;

                        for (var i = 0; i < datamasuk.length; i++) {
                            jmlmasuk = i + 1;
                        }

                        for (var i = 0; i < dataKemarin.length; i++) {
                            jmlkemarin = i + 1;
                        }

                        for (var i = 0; i < dataAkses.length; i++) {
                            jmlakses = i + 1;
                        }

                        for (var i = 0; i < datakeluar.length; i++) {
                            jmlkeluar = i + 1;
                        }

                        for (var i = 0; i < datapindahan.length; i++) {
                            jmlpindah = i + 1;
                        }

                        for (var i = 0; i < datadipindahkan.length; i++) {
                            jmldipindah = i + 1;
                        }

                        for (var i = 0; i < dataminggal.length; i++) {
                            jmlmeninggal = i + 1;
                        }

                        jmlsisa = (jmlmasuk + jmlkemarin + jmlpindah) - (jmldipindah + jmlmeninggal + jmlkeluar);

                        var datau = {
                            pasienkemarin: jmlkemarin,
                            pasienmasuk: jmlmasuk,
                            pasienkeluar: jmlkeluar,
                            pasiendipindahkan: jmldipindah,
                            pasienpindah: jmlpindah,
                            pasienkeluar: jmlkeluar,
                            pasienmeninggal: jmlmeninggal,
                            pasienakses: jmlakses,
                            pasiensisa: jmlsisa
                        }

                        data3.push(datau);

                        for (var i = data3.length - 1; i >= 0; i--) {
                            data3[i].no = i + 1
                        }

                        $scope.sourceLaporanIn = new kendo.data.DataSource({
                            data: data3,
                            pageSize: 50,
                            total: data3.length,
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

            $scope.columnLaporanIn = {
                toolbar: [
                    "excel",
                ],
                excel: { fileName: "laporanPasienRuangan.xlsx", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pasien Pasien Ruangan",
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

                    {
                        field: "no",
                        title: "No",
                        width: "45px"
                    },
                    {
                        field: "pasienkemarin",
                        title: "Jml Pasien Kemarin",
                        width: "90px",
                    },
                    {
                        field: "pasienmasuk",
                        title: "Jml Pasien Masuk",
                        width: "90px",
                    },
                    {
                        field: "pasienkeluar",
                        title: "Jml Pasien Keluar",
                        width: "90px",
                    },
                    {
                        field: "pasiendipindahkan",
                        title: "Jml Pasien Dipindahkan",
                        width: "90px",
                    },
                    {
                        field: "pasienmeninggal",
                        title: "Jml Pasien Meninggal",
                        width: "90px",
                    },
                    {
                        field: "pasiensisa",
                        title: "Jml Pasien Sisa Hari Ini",
                        width: "90px",
                    },
                    {
                        field: "pasienakses",
                        title: "Jml Pasien Askes",
                        width: "90px",
                    },
                    {
                        field: "pasienpindah",
                        title: "Jml Pasien Pindahan",
                        width: "90px",
                    }
                ]
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});