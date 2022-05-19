define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanDiklatKaryawanCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
                // $scope.isRouteLoading = true
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.item.listKasirMulti = [];
            $scope.item.listKasirMultis = [];
            $scope.isRouteLoading = false;
            $scope.item.periode=moment($scope.now).format('YYYY');
            $scope.item.month=moment($scope.now).format('MM');
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            loadCombo()

            function loadCombo() {
                $scope.isRouteLoading = true
                medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {

                    // $scope.listPegawai = dat.data.dokter;
                    $scope.listDepartement = dat.data.departemen;
                    // $scope.listPegawaiKasir = dat.data.kasir;
                    //$scope.dataLogin = dat.data.datalogin[0];
                    $scope.listPasien = dat.data.kelompokpasien;
                    // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                    // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
                });
                $scope.getIsiComboRuangan = function () {
                    $scope.listRuangans = $scope.item.departemen.ruangan
                }
                medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {

                    $scope.listKelompokPasien = data.data.kelompokpasien;


                });
                // medifirstService.get("registrasi/laporan/get-combo-box-laporan-pengunjung")
                //     .then(function (data) {
                //         $scope.listRuangans = data.data.ruangan
                //         $scope.listDokter = data.data.dokter
                //     })
                // 
                medifirstService.get("sysadmin/general/get-combo-address")
                    .then(function (data) {
                        $scope.listKotaKabupaten = data.data.kotakabupaten
                    })
            }
            loadFirst()
             $scope.monthungkul = {
                 start: "year",
                 depth: "year"
             }
             $scope.yearUngkul = {
                 start: "decade",
                 depth: "decade"
             }
            function loadFirst() {
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM');
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }
            loadData()

            function loadData() {
                console.log(moment($scope.item.periode).format('YYYY'));
                console.log(moment($scope.item.month).format('MM'));
                $scope.isRouteLoading = true;
               
                var  tahun = "&tahun="+moment($scope.item.periode).format('YYYY');
                var bulan = "bulan="+ moment($scope.item.month).format('MM');
                console.log(bulan,tahun);
                medifirstService.get("sdm/get-datalaporan-diklat?"+ bulan + tahun)
                    .then(function (data) {
                        
                        $scope.isRouteLoading = false;
                        // console.log(data.data.eksternal);
                        $scope.dataSourceGridPelatihanInternal = new kendo.data.DataSource({
                            data: data.data.internal,
                            group: $scope.group,
                            pageSize: 10,
                            total: data.data.internal.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });

                        $scope.dataSourcePelatihanEksternal = new kendo.data.DataSource({
                            data: data.data.eksternal,
                            pageSize: 50,
                            total: data.data.eksternal.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });

            };

            $scope.columnGridPelatihanInternal = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanDataBulananPengirimanPesertaPengirimanPelatihanInternal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;

                    sheet.mergedCells = ["A1:F1"];

                    var myHeaders = [{
                        value: "Laporan Data Bulanan Pengiriman Peserta Pengiriman Pelatihan Internal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "NAMA",
                        "width": "100px",
                    },
                    {
                        "field": "nippns",
                        "title": "NIP",
                        "width": "70px",
                    },
                    {
                        "field": "jenispelatihan",
                        "title": "JENIS PELATIHAN",
                        "width": "100px",
                    },
                    // {
                    //     "field": "penyelenggara",
                    //     "title": "PENYELENGGARA",
                    //     "width": "100px",
                    // },
                    {
                        field: "waktu",
                        "title": "WAKTU",
                        "width": "100px",
                    },
                    {
                        "field": "jumlahjam",
                        "title": "JUMLAH JAM",
                        "width": "70px",
                    },
                ]
            }



            $scope.columnGridPelatihanEksternal = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanDataBulananPengirimanPesertaPengirimanPelatihanEksternal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;

                    sheet.mergedCells = ["A1:I1"];

                    var myHeaders = [{
                        value: "Laporan Data Bulanan Pengiriman Peserta Pengiriman Pelatihan Eksternal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "NAMA",
                        "width": "100px",
                    },
                    {
                        "field": "nippns",
                        "title": "NIP",
                        "width": "70px",
                    },
                    {
                        "field": "unitkerja",
                        "title": "UNIT KERJA",
                        "width": "70px",
                    },
                    {
                        "field": "jenispelatihan",
                        "title": "JENIS PELATIHAN",
                        "width": "100px",
                    },
                    {
                        "field": "penyelenggara",
                        "title": "PENYELENGGARA",
                        "width": "100px",
                    },
                    {
                        field: "waktu",
                        "title": "WAKTU",
                        "width": "100px",
                    },
                    {
                        "field": "lokasipelatihan",
                        "title": "TEMPAT",
                        "width": "100px",
                    },
                    {
                        "field": "jumlahjam",
                        "title": "JUMLAH JAM",
                        "width": "70px",
                    }, 
                    {
                        "field": "biayadiklat",
                        "title": "BIAYA DIKLAT",
                        "width": "70px",
                    },
                    {
                        "field": "biayasppd",
                        "title": "BIAYA SPPD",
                        "width": "70px",
                    },
                    {
                        "field": "jumlahbiaya",
                        "title": "JUMLAH BIAYA",
                        "width": "70px",
                    },
                    {
                        "field": "waktusosialisasi",
                        "title": "WAKTU SOSIALISASI",
                        "width": "100px",
                    }
                ]
            }

            $scope.columnGridGabungan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarKunjunganPasienPemeriksaan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Kunjungan Pasien Per Pemeriksaan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "tglregistrasi",
                        "title": "NO",
                        "width": "50px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "NAMA",
                        "width": "50px",
                        "template": "<span class='style-left'>{{formatJam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "NIP",
                        "width": "50px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "noantrian",
                        "title": "JABATAN",
                        "width": "30px",
                        "template": "<span class='style-center'>#: noantrian #</span>"

                    },
                    {
                        "field": "namapasien",
                        "title": "JENIS PELATIHAN",
                        "width": "100px",
                        "template": "<span class='style-center'>#: namapasien #</span>"
                    },
                    {
                        "field": "reportdisplay",
                        "title": "TEMPAT",
                        "width": "50px",
                        // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "umur",
                        "title": "WAKTU",
                        "width": "50px",
                        columns: [{
                            "title":"Tgl"
                        },{
                            "title": "Bulan"
                        },]
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "JAM PELAKSANAAN",
                        "width": "50px",
                    },
                    // {
                    //     "field": "namaruangan",
                    //     "title": "Poliklinik",
                    //     "width": "140px",
                    // },
                    {
                        "field": "namalengkap",
                        "title": "JML JAM",
                        "width": "50px",
                    },
                    {
                        "field": "status",
                        "title": "TOTAL JAM",
                        "width": "50px",
                    },
                    
                ]
            };

            $scope.columnGridranap = {
                toolbar: [
                    "excel"
                ],
                excel: {
                    fileName: "DaftarKunjunganRANAP.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";
                    // sheet.rows[0].cells[0].background = "#ffffff";
                    var myHeaders = [{
                        value: "Laporan Rekap Data Kunjungan Rawat Inap",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }]
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "noranap",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        field: "nocm",
                        title: "NO RM",
                        width: "70px",
                    },
                    {
                        field: "namapasien",
                        title: "NAMA PASIEN",
                        width: "160px",
                    },
                    {
                        field: "alamatlengkap",
                        title: "ALAMAT",
                        width: "280px",
                    },
                    {
                        field: "jenisjiwa",
                        title: "JENIS",
                        width: "50px",
                    },
                    {
                        field: "namaruangan",
                        title: "BANGSAL",
                        width: "100px",
                    },
                    {
                        field: "namakelas",
                        title: "KELAS",
                        width: "70px",
                    },
                    // {
                    //     field:"namalengkap",
                    //     title : "DOKTER",
                    //     width: "70px",
                    // },
                    {
                        field: "tglmasuk",
                        title: "TGL MASUK",
                        width: "50px",
                    },
                    {
                        field: "tglkeluar",
                        title: "TGL KELUAR",
                        width: "125px",
                    },
                    {
                        field: "lamahari",
                        title: "LAMA HARI",
                        width: "125px",
                    },
                    {
                        field: "statuskeluar",
                        title: "CARA KELUAR",
                        width: "125px",
                    },
                    {
                        "field": "kondisipasien",
                        title: "KEADAAN",
                        width: "140px",
                    },
                    {
                        "field": "kelompokpasien",
                        title: "CARA BAYAR",
                        width: "200px",
                    }
                ]

            }
            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
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

            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }

            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }

            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })

            $scope.RegistrasiPasien = function () {
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }


                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }

            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.HapusPasien = function () {
                if ($scope.idPasien != undefined) {
                    var item = {
                        idpasien: $scope.idPasien
                    }

                    medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }


            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    }
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({
                    actions: actions
                });
            }

            $scope.TutupPopUp = function () {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                        tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }

            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }
            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }
            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });

            $scope.CetakView = function () {
                var user = medifirstService.getPegawaiLogin();
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');

                var ruanganId = ""
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }

                var dokter = ""
                if ($scope.item.dokter != undefined) {
                    dokter = $scope.item.dokter.id
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-laporan-kunjungan=' + user.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir +
                    '&dokter=' + dokter + '&ruanganId=' + ruanganId + '&view=true',
                    function (response) {});
            }

            //** BATAS */
        }
    ]);
});