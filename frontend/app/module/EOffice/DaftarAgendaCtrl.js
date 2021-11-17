define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarAgendaCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            var baseTransaksi = configuration.baseApiBackend;
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.jmlRows = 50;
            $scope.isRouteLoading = false;
            $scope.currentPerihal = [];
            $scope.norecDisposisi = "-";
            $scope.listPerihal = [
                {
                    "id": 1,
                    "nama": "",
                    "detail": [
                        { "id": 1, "nama": "Sangat Segera" },
                        { "id": 2, "nama": "Segera" },
                        { "id": 3, "nama": "Biasa" },
                    ]
                }
            ]
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepCtrl2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            $scope.inputSurat = function () {
                $state.go("Dokumen")
                var chacePeriode = {
                    0: '-',
                    1: '',
                    2: '-',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarAgendaCtrl', chacePeriode);
            }

            $scope.disposisi = function () {
                $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih!");
                    return
                }
                $scope.popUpDisposisi.center().open();
                $scope.item.nosurat = $scope.dataSelected.nosurat
                $scope.item.tgl = $scope.dataSelected.tglsurat
                $scope.item.tglterima = $scope.dataSelected.tglsurat
                $scope.item.noagenda = $scope.dataSelected.nosurat
                $scope.item.asalSurat = $scope.dataSelected.asalsurat
                $scope.item.perihal = $scope.dataSelected.perihal
                $scope.item.jenisSurat = { id: $scope.dataSelected.objectjenissuratfk, name: $scope.dataSelected.jenissurat }
                $scope.item.jenisarsip = $scope.dataSelected.jenisarsip
                $scope.item.lampiran = $scope.dataSelected.lampiranperihal
                $scope.item.dariSurat = $scope.dataLogin.namaLengkap
                $scope.item.instruksi = ""
                $scope.item.catatan = ""
                $scope.item.diteruskankepada = ""
                // $scope.item.tgl = $scope.dataSelected.tglsurat
                // $scope.item.noagenda = $scope.dataSelected.nosurat
                // $scope.item.asalSurat = $scope.dataSelected.asalsurat
                // $scope.item.perihal = $scope.dataSelected.perihal
                // $scope.item.jenisSurat = $scope.dataSelected.jenissurat
                // $scope.item.nmDokumen = $scope.dataSelected.namasurat

                // $scope.item.instruksi = ""
                // $scope.item.catatan = ""
                // $scope.item.diteruskankepada = ""
            }

            $scope.addListPerihal = function (bool, data) {
                var index = $scope.addListPerihal.indexOf(data);
                if (_.filter($scope.addListPerihal, {
                    id: data.id
                }).length === 0)
                    $scope.currentPerihal.push(data);
                else {
                    $scope.currentPerihal.splice(index, 1);
                }

            }

            $scope.saveDisposisi = function () {
                $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih!");
                    return
                }
                if ($scope.item.instruksi == undefined) {
                    toastr.error("Instruksi Belum Diisi!");
                    return
                }
                if ($scope.item.diteruskankepada == undefined) {
                    toastr.error("Diteruskan Kepada Belum Diisi!");
                    return
                }                
                var listperihal = null
                var a = ""
                var b = ""                
                for (var i = $scope.currentPerihal.length - 1; i >= 0; i--) {
                    var c = $scope.currentPerihal[i].id
                    b = "," + c
                    a = a + b
                }
                listperihal = a.slice(1, a.length)                
                var objSave = {                    
                    "norec": $scope.norecDisposisi,
                    "nosuratfk": $scope.dataSelected.norec,
                    "norec_head": $scope.dataSelected.norec_head,
                    "catatan": $scope.item.catatan,
                    "hal" : $scope.item.perihal != undefined ? $scope.item.perihal : null,
                    "nosurat" : $scope.item.nosurat != undefined ? $scope.item.nosurat : null,
                    "objectpegawaiasalsuratfk" : $scope.dataLogin.id,
                    "objectsifatsuratfk" : $scope.item.sifatSurat != undefined ? $scope.item.sifatSurat.id : null,
                    "tanggal" : moment($scope.now).format("YYYY-MM-DD HH:mm"),
                    "objectpegawaidisampaikanfk" : $scope.item.diteruskankepada.id,
                    "objectditeruskankefk" : $scope.item.diteruskankepada.id,                                   
                    "diteruskanke": $scope.item.diteruskankepada.namalengkap,
                    "instruksi": $scope.item.instruksi,    
                    "list" : listperihal,
                    "batas" : $scope.item.batas != undefined ? $scope.item.batas : null,                    
                    "dari" : $scope.item.dariSurat,                    
                }
                medifirstService.post('eoffice/save-disposisi', objSave).then(function (e) {
                    $scope.item.catatan = undefined;
                    $scope.item.nosurat = undefined;
                    $scope.item.perihal = undefined;
                    $scope.item.sifatSurat = undefined;
                    $scope.item.diteruskankepada = undefined;
                    $scope.item.instruksi = undefined;
                    $scope.item.batas = undefined;
                    $scope.item.dariSurat = undefined; 
                    $scope.popUpDisposisi.close();                  
                    init()
                });
            }

            $scope.saveDistribusi = function () {
                var objSave = {
                    "nosuratfk": $scope.dataSelected.norec,
                    "objectruanganfk": $scope.item.diteruskankeruang.id
                }
                medifirstService.post('eoffice/save-distribusi', objSave).then(function (e) {
                    init()
                });
            }

            $scope.riwayatDisposisi = function () {
                $scope.popUpRiwayatDisposisi.center().open()

                medifirstService.get("eoffice/get-riwayat-disposisi?" +
                    "nosuratfk=" + $scope.dataSelected.norec_head
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataGridDis = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.distribusi = function () {
                $scope.popUpDistribusi.center().open()
                $scope.item.tgl = $scope.dataSelected.tglsurat
                $scope.item.noagenda = $scope.dataSelected.nosurat
                $scope.item.asalSurat = $scope.dataSelected.asalsurat
                $scope.item.perihal = $scope.dataSelected.perihal
                $scope.item.jenisSurat = $scope.dataSelected.jenissurat
                $scope.item.nmDokumen = $scope.dataSelected.namasurat

                $scope.item.instruksi = ""
                $scope.item.catatan = ""
                $scope.item.diteruskankepada = ""

                medifirstService.get("eoffice/get-riwayat-distribusi?" +
                    "nosuratfk=" + $scope.dataSelected.norec
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataGridDistri = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.detailSurat = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
               
                if ($scope.dataSelected.statverifdir != '✘') {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }
                $state.go("Dokumen")
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'edit',
                    2: $scope.dataSelected.norec_head,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarAgendaCtrl', chacePeriode);
            }

            $scope.revisiSurat = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                               
                if ($scope.dataSelected.statverifdir != "✘") {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }
                $state.go("Dokumen")
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'revisi',
                    2: $scope.dataSelected.norec_head,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarAgendaCtrl', chacePeriode);
            }

            function loadCombo() {
                medifirstService.get("eoffice/get-combo-input-surat", true).then(function (dat) {
                    $scope.listTipeSurat = dat.data.tipesurat;
                    $scope.listSifatSurat = dat.data.sifatsurat;
                    $scope.listJenisSurat = dat.data.jenissurat;
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDiteruskan = data;
                })

                medifirstService.get("eoffice/get-keluser-eoffice").then(function (dat) {
                    $scope.KelompokUser = medifirstService.getKelompokUser();
                    // kelUserDirut
                    var keluser = dat.data;
                    if (keluser.dokumenkontrol == $scope.KelompokUser) {
                        $scope.kelUser = true;
                        $scope.kelUserDirut = false;
                        loadRuanganPart();
                    }else if (keluser.management == $scope.KelompokUser) {
                        $scope.kelUser = false;
                        $scope.kelUserDirut = true;
                        loadRuanganPart();
                    }else {
                        $scope.kelUser = false;
                        $scope.kelUserDirut = false;
                        $scope.listUnitKerja = medifirstService.getMapLoginUserToRuangan();
                        $scope.item.unitKerja = $scope.listUnitKerja[0];
                    }
                    init();
                });
            }

            function loadRuanganPart() {
                medifirstService.getPart("sysadmin/general/get-ruangan-part", true, true, 20).then(function (data) {
                    $scope.listUnitKerja = data;
                });
            }

            $scope.cari = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    rg = "&ruid=" + $scope.item.ruangan.id
                }
                var unitKerja = ""
                if ($scope.item.unitKerja != undefined) {
                    unitKerja = "&unitKerja=" + $scope.item.unitKerja.id
                }
                var tipeSurat = ""
                if ($scope.item.tipeSurat != undefined) {
                    tipeSurat = "&tipeSurat=" + $scope.item.tipeSurat.id
                }
                var jenisSurat = ""
                if ($scope.item.jenisSurat != undefined) {
                    jenisSurat = "&jenisSurat=" + $scope.item.jenisSurat.id
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("eoffice/get-daftar-surat?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noresep=" + $scope.item.noResep +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&kelompok=154" +
                    "&norec=-" +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + unitKerja + tipeSurat + jenisSurat
                    + '&jmlRows=' + jmlRows//+Jra
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            if (dat.data.daftar[i].norec_ds != undefined) {
                                dat.data.daftar[i].statdisposisi = "✔"
                            } else {
                                dat.data.daftar[i].statdisposisi = "✘"
                            }
                            if (dat.data.daftar[i].statverif != undefined) {
                                dat.data.daftar[i].statverif = "✔"
                            } else {
                                dat.data.daftar[i].statverif = "✘"
                            }
                            if (dat.data.daftar[i].statverifdir != undefined) {
                                dat.data.daftar[i].statverifdir = "✔"
                            } else {
                                dat.data.daftar[i].statverifdir = "✘"
                            }                            
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDiteruskan = data
                })
                medifirstService.getPart("sysadmin/general/get-ruangan-part", true, true, 20).then(function (data) {
                    $scope.listDiteruskanKeRuang = data
                })

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarResepCtrl2', chacePeriode);
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
            }

            $scope.hapusDokumen = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                if ($scope.dataSelected.statverif == "✔") {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }
               
                if ($scope.dataSelected.statverifdir == "✔") {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }
                var itemDelete = {
                    "norec": $scope.dataSelected.norec,
                    "namafile": $scope.dataSelected.filename
                }
                medifirstService.post('eoffice/delete-surat', itemDelete).then(function (e) {
                    init();
                })
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.TransaksiPelayanan = function () {
                //debugger;
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec_apd,
                    9: 'resep'
                }
                cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                $state.go('TransaksiPelayananApotik')

                var arrStr2 = {
                    0: $scope.dataSelected.norec
                }
                cacheHelper.set('DaftarResepCtrl', arrStr2);
                $state.go('DaftarResepCtrl')
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Dokumen.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Dokumen",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglsurat",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "nosurat",
                        "title": "Nomor Dokumen",
                        "width": "60px",
                    },
                    {
                        "field": "namasurat",
                        "title": "Nama Dokumen",
                        "width": "60px",
                    },
                    {
                        "field": "revisike",
                        "title": "Revisi Ke",
                        "width": "60px",
                    },
                    {
                        "field": "tglrevisi",
                        "title": "Tgl Revisi",
                        "width": "60px",
                    },
                    {
                        "field": "statusediting",
                        "title": "Status",
                        "width": "60px",
                    },
                    {
                        "field": "statverif",
                        "title": "Verif Dokumen Kontrol",
                        "width": "100px",
                    },
                    {
                        "field": "statverifdir",
                        "title": "Verif Direktur",
                        "width": "100px",
                    },                    
                    {
                        "command": [
                            {
                                text: "View",
                                click: viewSurat,
                                imageClass: "k-icon k-i-download"
                            }
                        ],
                        title: "",
                        width: 80,
                    },
                ]
            };

            function viewSurat(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                const url = baseTransaksi + 'eoffice/save-surat'
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem.filename != null) {
                    str1 = strBACKEND + 'storage/eoffice/dokumen?norec=' + dataItem.norec + '&filename=' + dataItem.filename
                    window.open(str1, '_blank');
                } else {
                    toastr.error('File tidak ada')
                    return
                }
            }


            $scope.columnGridDis = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "RiwayatDisposisi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Riwayat Disposisi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "120px",
                    },
                    {
                        "field": "instruksi",
                        "title": "Instruksi",
                        "width": "120px",
                    },
                    {
                        "field": "catatan",
                        "title": "Catatan",
                        "width": "120px",
                    },
                    {
                        "field": "statusediting",
                        "title": "Status",
                        "width": "120px",
                    },
                    {
                        "field": "tglverifikasi",
                        "title": "Tgl Verifikasi",
                        "width": "120px",
                    },                   
                    {
                        "field": "noverifikasi",
                        "title": "Noverifikasi",
                        "width": "120px",
                    },                    
                    {
                        "command": [                           
                            {
                                text: "Revisi",
                                click: revisiDok,
                                imageClass: "k-icon k-i-pencil"
                            }
                        ],
                        title: "",
                        width: "130px",
                    }
                ]
            };

            function revisiDok(e) {                          
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }                

                if (dataItem.statusediting != "✘") {
                    toastr.error("Data Tidak Bisa Direvisi");
                    return;
                }

                if (dataItem.statverifdir != "✘") {
                    toastr.error("Data Tidak Bisa Direvisi");
                    return;
                }

                $state.go("Dokumen")
                var chacePeriode = {
                    0: dataItem.nosuratfk,
                    1: 'revisi',
                    2: $scope.dataSelected.norec_head,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarAgendaCtrl', chacePeriode);
            }

            $scope.columnGridDistri = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "RiwayatDistribusi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Riwayat Dsitribusi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglkirim",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "120px",
                    },
                    // {
                    //     command: [
                    //         { imageClass: "k-icon k-i-delete", text: "Hapus", click: Hapus },
                    //     ], title: "&nbsp;", width: '60px'
                    // }
                ]
            };

            function Hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var objSave = {
                    "norec": dataItem.norec
                }
                medifirstService.post('eoffice/delete-distribusi', objSave).then(function (e) {
                    medifirstService.get("eoffice/get-riwayat-distribusi?" +
                        "nosuratfk=" + $scope.dataSelected.norec
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.daftar.length; i++) {
                                dat.data.daftar[i].no = i + 1
                            }
                            $scope.dataGridDistri = new kendo.data.DataSource({
                                data: dat.data.daftar,
                                pageSize: 200,
                                total: dat.data.daftar,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                        });
                });
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            $scope.verifikasiDokumen = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                if ($scope.dataSelected.statverif != undefined) {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }

                if ($scope.dataSelected.statverifdir != undefined) {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }

                $state.go("Dokumen")
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'Verifikasi',
                    2: $scope.dataSelected.norec_head,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarAgendaCtrl', chacePeriode);
            }

            $scope.verifikasiDirektur = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                if ($scope.dataSelected.statverif == undefined) {
                    toastr.error("Data Belum Diverifikasi Dokumen Kontrol");
                    return;
                }
                if ($scope.dataSelected.statverifdir != undefined) {
                    toastr.error("Data Sudah Diverifikasi");
                    return;
                }                
                $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
                var objSave = {
                    "norec" : $scope.dataSelected.norec,
                    "norec_head" : $scope.dataSelected.norec_head,
                    "objectpegawaipjawabfk" : $scope.dataLogin.id,
                    "tglverifikasi": moment($scope.now).format('YYYY-MM-DD HH:mm')
                }
                
                medifirstService.post('eoffice/verifikasi-direktur', objSave).then(function (res) {
                    init();                    
                })
            }
            $scope.generateQR = function(){
                 $scope.popUpQR.center().open();
            }
            $scope.generate = function(){
                if(!$scope.item.pegawaiQr){
                    toastr.error('Pilih Pegawai dulu')
                    return
                }
                var authorization = ""
                var arr = document.cookie.split(';')
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                authorization = authorization.split('.')
                let profile = medifirstService.getProfile().id
                let linkQR =  configuration.baseApiBackend+'eoffice/qrcode?id='+$scope.item.pegawaiQr.id
                +'&kdprofile='+profile
                // +'&token='+authorization[0]
                 let qrcodeContainer = document.getElementById("qrcode");
                 qrcodeContainer.innerHTML = "";
                console.log(linkQR)
                 new QRCode(qrcodeContainer, {
                    text: linkQR ,
                    width: 128,
                    height: 128,
                });
                 // var dataURL = document.getElementById('qrcode').toDataURL();

            }
           
               
            $scope.copyQR = function(){
              var imageURL= document.querySelector('#qrcode img').getAttribute("src");
              $('#qrcode img').addClass('image-class');
                  var imageElem = document.querySelector('.image-class');  
                  var range = document.createRange();  
                  range.selectNode(imageElem);  
                  window.getSelection().addRange(range);  

                  try {  
                    // Now that we've selected the anchor text, execute the copy command  
                    var successful = document.execCommand('copy');  
                    var msg = successful ? 'Sukses' : 'Gagal';  
                    toastr.info('Copy QRcode ' + msg);  
                  } catch(err) {  
                    toastr.error('Oops, unable to copy');  
                  }  

                  // Remove the selections - NOTE: Should use
                  // removeRange(range) when it is supported  
                  window.getSelection().removeAllRanges(); 
             
            }
          

            //** BATAS */
        }
    ]);
});
