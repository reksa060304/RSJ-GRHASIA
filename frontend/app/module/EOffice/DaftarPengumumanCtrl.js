define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPengumumanCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {

            // initialize.controller('DaftarResepCtrl', ['$q', '$rootScope', '$scope', 'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.jmlRows = 50;
            $scope.isRouteLoading = false;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepCtrl2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    // init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            $scope.inputSurat = function(){
                $state.go("SuratMasuk")
                var chacePeriode = {
                    0: '-',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('SuratMasukCtrl', chacePeriode);
            }
            $scope.disposisi = function(){
                 $scope.popUpDisposisi.center().open()
            }
            $scope.riwayatDisposisi = function(){
                $scope.popUpRiwayatDisposisi.center().open()
            }
            $scope.detailSurat = function(){
                 $state.go("SuratMasuk")
                 var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('SuratMasukCtrl', chacePeriode);
            }
            function loadCombo() {
                init()
                // medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                //     $scope.listDepartemen = dat.data.departemen;
                //     $scope.listKelompokPasien = dat.data.kelompokpasien;
                //     $scope.listRuanganDepo = dat.data.ruanganfarmasi;
                // });
                // $scope.listJenisRacikan = [{ id: 1, jenisracikan: 'Puyer' }]
            }
            $scope.cari  = function(){
                init()
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var farmasi = ""
                if ($scope.item.ruanganDepo != undefined) {
                    var farmasi = "&IdFarmasi=" + $scope.item.ruanganDepo.id
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
                    "&norec=-"  +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + farmasi 
                    + '&jmlRows=' + jmlRows//+Jra
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.daftar[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
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

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
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
                columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglsurat",
                        "title": "Tgl Pengumuman",
                        "width": "50px",
                    },
                    {
                        "field": "nosurat",
                        "title": "Isi Pengumuman",
                        "width": "600px",
                    }
                ]                   
            };
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
                columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tgl",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "namapegawai",
                        "title": "Nama Pegawai",
                        "width": "120px",
                    }
                ]                   
            };
            
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl) {
                //debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }
            //***********************************

        }
    ]);
});
