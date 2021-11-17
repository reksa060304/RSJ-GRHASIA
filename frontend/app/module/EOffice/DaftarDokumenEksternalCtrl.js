define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarDokumenEksternalCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            var baseTransaksi = configuration.baseApiBackend;
            $scope.item = {};
            $scope.itemd = {};
            $scope.now = new Date();
            $scope.item.jmlRows = 50;
            $scope.isRouteLoading = false;
            var $statusEditRevisi = ""
            LoadCache();
            loadCombo();

            function LoadCache() {
                $scope.tombol = true;
                $scope.detail = false;
                var chacePeriode = cacheHelper.get('DaftarResepCtrl2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    // init();
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
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarDokumenEksternalCtrl', chacePeriode);
            }

            function loadCombo() {
                medifirstService.get("eoffice/get-combo-input-surat", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var user = medifirstService.getPegawaiLogin();
                    $scope.listUser = [{
                        id: user.id, namaLengkap: user.namaLengkap
                    }]
                    $scope.item.dataUser = $scope.listUser[0];
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                    $scope.item.ruangan = $scope.listRuangan[0];
                    $scope.listTipeSurat = dat.data.tipesurat;
                    $scope.listSifatSurat = dat.data.sifatsurat;
                    $scope.listJenisSurat = dat.data.jenissurat;
                    $scope.listSubJenisSurat = dat.data.subjenissurat;
                    $scope.listJenisArsip = dat.data.jenisarsip;
                    $scope.listStatusBerkas = dat.data.statusberkas;
                    $scope.item.nomorSurat = dat.data.nosurat;                    
                    $scope.listInstalasi = dat.data.instalasi;                   
                    init();
                });

            }

            $scope.cari = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                var petugas = "";
                if ($scope.item.dataUser != undefined) {
                    petugas = "&petugasfk=" + $scope.item.dataUser.id;
                }
                var ruangan = "";
                if ($scope.item.ruangan != undefined) {
                    ruangan = "&idruangan=" + $scope.item.ruangan.id;
                }
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                medifirstService.get("eoffice/get-data-distribusidokumen?"
                    + "&tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + '&jmlRows=' + jmlRows
                    + petugas + ruangan, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
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

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Surat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Surat",
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
                        "width": "45px",
                    },
                    {
                        "field": "tglkirim",
                        "title": "Tgl Kirim",
                        "width": "80px",
                    },
                    {
                        "field": "nokirim",
                        "title": "Nomor Kirim",
                        "width": "140px",
                    },
                    {
                        "field": "nosurat",
                        "title": "Nomor Dokumen",
                        "width": "140px",
                    },
                    {
                        "field": "namasurat",
                        "title": "Nama Dokumen",
                        "width": "140px",
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

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
            }

            $scope.verifikasi = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }

                if ($scope.dataSelected.norec_sv != undefined) {
                    toastr.error("Info, Data Sudah Diverifikasi!")
                    return;
                }

                $scope.popUpDisposisi.center().open();
            }

            function KosongVerfi() {
                $scope.item.instruksi = undefined;
                $scope.item.catatan = undefined;
            }

            $scope.batalVerifDisposisi = function () {
                KosongVerfi();
                $scope.popUpDisposisi.close();
            }

            $scope.saveVerifDisposisi = function () {
                if ($scope.dataSelected.norec_ds == undefined) {
                    toastr.error("Info, Data Tidak Ditemukan!")
                    return;
                }

                if ($scope.item.instruksi == undefined) {
                    toastr.error("Info, Instruksi Belum Diisi!")
                    return;
                }

                if ($scope.item.catatan == undefined) {
                    toastr.error("Info, Catatan Belum Diisi!")
                    return;
                }

                var objSave = {
                    "norec_ds": $scope.dataSelected.norec_ds,
                    "norec_surat": $scope.dataSelected.norec,
                    "instruksi": $scope.item.instruksi,
                    "catatan": $scope.item.instruksi,
                    "idpegawai": $scope.item.dataUser.id
                }

                medifirstService.post('eoffice/save-verif-disposisi', objSave).then(function (e) {
                    KosongVerfi();
                    $scope.popUpDisposisi.close();
                    init();
                });
            }

            $scope.Batalverifikasi = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }

                if ($scope.dataSelected.norec_sv == undefined) {
                    toastr.error("Info, Data Sudah Diverifikasi!");
                    return;
                }

                var objSave = {
                    "norec": $scope.dataSelected.norec_sv
                }

                medifirstService.post('eoffice/batal-verif-disposisi', objSave).then(function (e) {
                    init();
                });
            }

            $scope.detailSurat = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelected == undefined) {
                    $scope.isRouteLoading = false;
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }

                if ($scope.dataSelected.norec != undefined) {
                    medifirstService.get("eoffice/get-daftar-surat?" +
                        "norec=" + $scope.dataSelected.norec + "&kelompok=-"
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            $scope.itemd.tanggalAwal = dat.data.daftar[0].tglsurat
                            $scope.itemd.namaSurat = dat.data.daftar[0].namasurat
                            $scope.itemd.tipeSurat = { id: dat.data.daftar[0].objecttipesuratfk, name: dat.data.daftar[0].tipesurat }
                            $scope.itemd.sifatSurat = { id: dat.data.daftar[0].objectsifatsuratfk, name: dat.data.daftar[0].tipesurat }
                            $scope.itemd.statusBerkas = { id: dat.data.daftar[0].objectstatusberkasfk, name: dat.data.daftar[0].tipesurat }
                            $scope.itemd.jenisSurat = { id: dat.data.daftar[0].objectjenissuratfk, name: dat.data.daftar[0].tipesurat }
                            $scope.itemd.jenisArsip = { id: dat.data.daftar[0].objectjenisarsipfk, name: dat.data.daftar[0].tipesurat }
                            $scope.itemd.jangkaWaktu = dat.data.daftar[0].jangkawaktu
                            $scope.itemd.asalSurat = dat.data.daftar[0].asalsurat
                            $scope.itemd.penerimaSurat = dat.data.daftar[0].penerimasurat
                            $scope.itemd.ruanganPenerima = dat.data.daftar[0].ruanganpenerima
                            $scope.itemd.nomorSurat = dat.data.daftar[0].nosurat
                            $scope.itemd.perihal = dat.data.daftar[0].perihal
                            $scope.itemd.lampiranPerihal = dat.data.daftar[0].lampiranperihal
                            $scope.itemd.instalasi = { id: dat.data.daftar[0].objectdepartemenfk, namadepartemen: dat.data.daftar[0].namadepartemen }
                            $scope.itemd.unitPembuat = dat.data.daftar[0].unitpembuat
                            $scope.itemd.status = { id: dat.data.daftar[0].objectstatusfk, statusediting: dat.data.daftar[0].statusediting }
                            $scope.itemd.revisike = dat.data.daftar[0].revisike
                            $scope.itemd.ketrevisi = dat.data.daftar[0].keteranganrevisi
                            $scope.itemd.wyswyg = dat.data.daftar[0].wyswyg


                            medifirstService.get("eoffice/get-riwayat-surat?" +
                                "nosurat=" + $scope.itemd.nomorSurat
                                , true).then(function (dat) {
                                    $scope.isRouteLoading = false;
                                    for (var i = 0; i < dat.data.daftar.length; i++) {
                                        dat.data.daftar[i].no = i + 1
                                    }
                                    $idloginuser = dat.data.data.userData.id
                                    $scope.dataGridRiwayat = new kendo.data.DataSource({
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

                            medifirstService.get("eoffice/get-template-surat?"
                                , true).then(function (dat) {
                                    $scope.isRouteLoading = false;
                                    for (var i = 0; i < dat.data.daftar.length; i++) {
                                        dat.data.daftar[i].no = i + 1
                                    }
                                    $idloginuser = dat.data.data.userData.id
                                    $scope.dataGridTmp = new kendo.data.DataSource({
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
                    $scope.tombol = false;
                    $scope.detail = true;
                } else {
                    $scope.tombol = false;
                    $scope.detail = true;
                }

            }

            $scope.columnGridRiwayat = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Riwayat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Riwayat",
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
                        "field": "tglrevisi",
                        "title": "Tanggal Revisi",
                        "width": "50px",
                    },
                    {
                        "field": "revisike",
                        "title": "Revisi Ke",
                        "width": "30px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Updated By",
                        "width": "60px",
                    },
                    {
                        "field": "filename",
                        "title": "File",
                        "width": "80px",
                    },
                    {
                        command: [
                            { imageClass: "k-icon k-i-download", text: "Download", click: Download },
                        ], title: "&nbsp;", width: '60px'
                    }
                ]
            };
            $scope.columnGridTmp = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Template.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Template Surat",
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
                        "field": "namasurat",
                        "title": "Nama Dokumen",
                        "width": "60px",
                    },
                    {
                        "field": "tglrevisi",
                        "title": "Tgl Revisi",
                        "width": "60px",
                    },
                    {
                        "field": "filename",
                        "title": "File",
                        "width": "60px",
                    },
                    {
                        command: [
                            { imageClass: "k-icon k-i-download", text: "Download", click: Download },
                        ], title: "&nbsp;", width: '60px'
                    }
                ]
            };

            function Download(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + 'storage/e-office/download?norec=' + dataItem.norec + '&filename=' + dataItem.filename, '_blank');
            }

            $scope.viewDokumen = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if ($scope.dataSelected.filename != null) {
                    str1 = strBACKEND + 'storage/eoffice/dokumen?norec=' + $scope.dataSelected.norec + '&filename=' + $scope.dataSelected.filename
                    window.open(str1, '_blank');
                } else {
                    toastr.error('File tidak ada')
                    return
                }
            }

            $scope.tutupDetail = function () {
                $scope.itemd = {};
                $scope.tombol = true;
                $scope.detail = false;
            }

            //** END OF ALL */
        }
    ]);
});
