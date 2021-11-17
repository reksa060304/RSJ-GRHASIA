define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPemeriksaanPACtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function ($scope, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.item.jmlRow = 50
            loadCombo();

            function loadCombo() {
                $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                medifirstService.get("radiologi/get-combo", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listDataJenisKelamin = dat.data.jeniskelamin;
                    $scope.listGolDarah = dat.data.golongandarah;
                });


            }

            function init() {
                // var kp = ""
                // if ($scope.item.kelompokPasien != undefined) {
                //     var kp = "&kelId=" + $scope.item.kelompokPasien.id
                // }
                var pa = ""
                if ($scope.item.noPA != undefined) {
                    pa = "&nopa=" + $scope.item.noPA
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    nm = "&namapasien=" + $scope.item.namaPasien
                }
                // var jmlRow = ""
                // if ($scope.item.jmlRow != undefined) {
                //     jmlRow = "&jmlRow=" + $scope.item.jmlRow
                // }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                $scope.isRouteLoading = true;
                medifirstService.get("laboratorium/get-lap-pemeriksaan-pa?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    pa +
                    rm +
                    nm
                    , true).then(function (dat) {
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data,
                            pageSize: 10,
                            total: dat.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                        $scope.isRouteLoading = false;
                    });
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPemeriksaanPA();
            }

            $scope.CariLapPemeriksaanPA = function () {
                init();
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienPenunjang', chacePeriode);
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                    $scope.noRekamMedis = dataSelected.nocm;
                }
            }

            $scope.TransaksiPelayanan = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.ruid,
                    11: $scope.dataSelected.norec_pd,
                    12: "",//nor
                    13: $scope.dataSelected.kelompokpasien,
                    18: $scope.dataSelected.nostruklastfk,
                    19: $scope.dataSelected.golongandarah
                }
                cacheHelper.set('RincianTagihanPenunjang', arrStr);
                $state.go('RincianTagihanPenunjang')
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [
                {
                    "field": "nomor",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "nocm",
                    "title": "No. MR",
                    "width": "70px",
                },
                {
                    "field": "nomorpa",
                    "title": "No. PA",
                    "width": "80px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "jk",
                    "title": "Jenis Kelamin",
                    "width": "70px",
                },
                {
                    "field": "topografi",
                    "title": "Topografi",
                    "width": "70px",
                },
                {
                    "field": "morfologi",
                    "title": "Morfologi",
                    "width": "70px",
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Asal", //dokter pengirim
                    "width": "70px",
                },
                {
                    "field": "namaruangan",
                    "title": "Bagian Asal", //ruangan
                    "width": "70px",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Daftar", //ruangan
                    "width": "70px",
                },
                {
                    "field": "namaproduk",
                    "title": "Jenis Pemeriksaan", //tindakan
                    "width": "70px",
                },
                {
                    "field": "diagnosisklinik",
                    "title": "Diagnosis Klinik", //ruangan
                    "width": "70px",
                },
                {
                    "field": "jaringanasal",
                    "title": "Asal Jaringan", //ruangan
                    "width": "70px",
                },
                {
                    "field": "kesimpulan",
                    "title": "Kesimpulan PA",
                    "width": "70px",
                },
                {
                    "field": "dokter_pa",
                    "title": "Dokter PA",
                    "width": "70px",
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "100px",
                },
                {
                    "field": "hargajual",
                    "title": "Harga Tindakan",
                    "width": "100px",
                }
                // {
                //     "field": "golongandarah",
                //     "title": "Gol Darah",
                //     "width": "50px",
                // },
                // {
                //     "field": "tgllahir",
                //     "title": "Tgl Lahir",
                //     "width" : "100px"
                // },
                // {
                //     "field": "namarekanan",
                //     "title": "namarekanan",
                //     "width" : "100px"//,
                //     //"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                // },
                // {
                //     "field": "namakelas",
                //     "title": "Nama Kelas",
                //     "width": "80px",
                // },
                // {
                //     "field": "tglmasuk",
                //     "title": "Tgl Masuk",
                //     "width": "100px",
                // },
                // {
                //     "field": "tglpulang",
                //     "title": "Tgl Pulang",
                //     "width" : "100px",
                // }
                // {
                //     "field": "tglregistrasi",
                //     "title": "Tgl Registrasi",
                //     "width": "100px",
                // },
                // {
                //     "field": "tglpulang",
                //     "title": "Tgl Pulang",
                //     "width": "100px",
                // },
                // {
                //     "field": "alamatlengkap",
                //     "title": "Alamat",
                //     "width": "100px",
                // }
            ];
            // $scope.mainGroupOptionsLapPemeriksaanPA = { 
            //     pageable: true,
            //     columns: $scope.dataGrid,
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

            $scope.Rincian = function () {

            }
            $scope.pengkajianMedis = function () {
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.kelompokpasien,
                    6: $scope.dataSelected.tglregistrasi,
                    7: $scope.dataSelected.norec_apd,
                    8: $scope.dataSelected.norec_pd,
                    9: $scope.dataSelected.klid,
                    10: $scope.dataSelected.namakelas,
                    11: $scope.dataSelected.ruid,
                    12: $scope.dataSelected.namaruangan + '`'
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis', {
                    norecAPD: $scope.dataSelected.norec_apd,
                    noRec: $scope.dataSelected.norec_apd
                })
            }
            //***********************************

            $scope.mainGroupOptionsLapPemeriksaanPA = {
                toolbar: [
                    "excel"
                ],
                excel: {
                    fileName: "LaporanPemeriksaanPA.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.name = "Orders";
                    sheet.mergedCells = ["A1:L1"];

                    var myHeaders = [{
                        value: "Laporan Pemeriksaan Patologi Anatomi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: {
                    // pageSize: 5,
                    // previousNext: false,
                    messages: {
                        display: "Showing {0} - {1} from {2} data items",
                    },
                },
                columns: $scope.columnPenerimaanSemuaKasir,
                // dataSource:$scope.dataSourceLaporanLayanan,            
                selectable: true,
                refresh: true,
                scrollable: false,
                // dataSource: $scope.dataSourceLaporanLayanan2,
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                    showIndexes: true,
                },
            };
        }
    ]);
});
