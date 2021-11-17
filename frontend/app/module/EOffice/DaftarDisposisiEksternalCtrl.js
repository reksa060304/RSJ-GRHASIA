define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarDisposisiEksternalCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            var baseTransaksi = configuration.baseApiBackend;
            $scope.item = {};
            $scope.itemd = {};
            $scope.now = new Date();
            $scope.item.jmlRows = 50;
            $scope.isRouteLoading = false;
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
                    init();
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
                cacheHelper.set('DaftarDisposisiEksternalCtrl', chacePeriode);
            }

            function loadCombo() {
                medifirstService.get("eoffice/get-combo-input-surat", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var user = medifirstService.getPegawaiLogin();
                    $scope.listUser = [{
                        id: user.id, namaLengkap: user.namaLengkap
                    }]
                    $scope.item.dataUser = $scope.listUser[0];
                    init();
                    $scope.listTipeSurat = dat.data.tipesurat;
                    $scope.listSifatSurat = dat.data.sifatsurat;
                    $scope.listJenisSurat = dat.data.jenissurat;
                    $scope.listJenisArsip = dat.data.jenisarsip;
                    $scope.listStatusBerkas = dat.data.statusberkas;
                    $scope.listStatus = dat.data.statusediting;
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
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
                medifirstService.get("eoffice/get-data-disposisi?"
                    + "&tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + '&jmlRows=' + jmlRows
                    + petugas, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.daftar[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
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
                        "field": "tanggal",
                        "title": "Tgl Disposisi",
                        "width": "80px",
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
                        "field": "instruksi",
                        "title": "Intruksi",
                        "width": "100px",
                    },
                    {
                        "field": "catatan",
                        "title": "Catatan",
                        "width": "100px",
                    },
                    {
                        "field": "noverifikasi",
                        "title": "Verifikasi",
                        "width": "100px",
                    }
                ]
            };

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

                if ($scope.item.status == undefined) {
                    toastr.error("Info, Status Dokumen Belum Diisi!")
                    return;
                }

                var objSave = {
                    "norec_ds": $scope.dataSelected.norec_ds,
                    "norec_surat": $scope.dataSelected.norec,
                    "instruksi": $scope.item.instruksi,
                    "catatan": $scope.item.instruksi,
                    "idpegawai": $scope.item.dataUser.id,
                    "status": $scope.item.status.id
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
                    medifirstService.get("eoffice/get-detail-daftar-surat?" +
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
                        });
                    $scope.tombol = false;
                    $scope.detail = true;
                }else{
                    $scope.tombol = false;
                    $scope.detail = true;
                }

            }

            $scope.viewDokumen = function(){
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
