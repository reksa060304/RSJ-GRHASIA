define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPenungguCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.listIndentitas = [
                {id:1,namaindentitas:'KTP'},
                {id:2,namaindentitas:'SIM'},
                {id:3,namaindentitas:'RESI'},
            ];
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('cachePerawatan');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function loadCombo() {
                medifirstService.get("humas/get-daftar-combo", false).then(function (data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listRuangan = data.data.ruangan3;
                    $scope.listHubungan = data.data.hubungan;
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var np = ""
                if ($scope.item.namaPengunjung != undefined) {
                    var np = "&namapengunjung=" + $scope.item.namaPengunjung
                }
                var nm = ""
                if ($scope.item.namaPengunjung != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var alm = ""
                if ($scope.item.alamat != undefined) {
                    var alm = "&alamat=" + $scope.item.alamat
                }

                medifirstService.get("humas/get-lap-penunggu?" +
                    tglAwal + tglAkhir + rg + rm + reg + kp + np + alm + nm, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';

                        }

                        var result = dat.data.data
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: result,
                            
                            pageSize: 200
                        });

                        // $scope.listDataPasien = new kendo.data.DataSource({
                        //     data: data
                        // });
                        // $scope.listDataPasien.fetch(function (e) {
                        //     var temp = [];
                        //     for (var key in this._data) {
                        //         if (this._data.hasOwnProperty(key)) {
                        //             var element = this._data[key];
                        //             if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                        //                 temp.push(element);
                        //         }
                        //     }
                        //     $scope.listPasien = temp;
                        //     cacheHelper.set('tempData', temp);
                        // });
                    });

            }

            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                }
                cacheHelper.set('cachePerawatan', chacePeriode);
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {fileName: "DaftarPasienDalamPerawatan.xlsx",allPages: true},
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Laporan Pasien Dalam Perawatan",
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
                        "width": "15px",
                    },
                    {
                        "field": "tgltunggu",
                        "title": "Tgl",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "50px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "50px",
                    },
                    {
                        "field": "namakamar",
                        "title": "Kamar",
                        "width": "30px",
                    },
                    {
                        "field": "namapenunggu",
                        "title": "Namapenunggu",
                        "width": "50px",
                    },
                    {
                        "field": "hubungankeluarga",
                        "title": "Hub.Pasien",
                        "width": "50px",
                    },
                    {
                        "field": "identitas",
                        "title": "Identitas",
                        "width": "50px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Petugas",
                        "width": "50px",
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "150px",
                    }
                    
                ]
            };

            $scope.KartuPenunggu = function () {
                if ($scope.item.norec == undefined){
                    alert("Data Belum Dipilih!!");
                    return;
                }
                   
                $scope.winDialogss.center().open();
            }

            $scope.klikGrid = function (item) {
                if ($scope.item.norec == undefined){
                    $scope.item.norec = item.norec
                }
            }

            $scope.simpanPenunggu = function (){
                var tglsekarang = new Date($scope.now)
                var tglAkhir = moment(tglsekarang).format('YYYY-MM-DD HH:mm:ss');
                debugger;
                var data = {
                    "norec": $scope.item.norec,
                    "identitas": $scope.item.indentitas.namaindentitas,
                    "hubungankeluarga": $scope.item.hubunganKeluarga.id,
                    "keterangan": $scope.item.keterangan,
                    "tgltunggu": tglAkhir,
                    "namapenunggu": $scope.item.namapenunggu
                }

                medifirstService.post('humas/save-penunggu-pasien', data).then(function (e) {
                    $scope.item.keterangan = ""
                    $scope.item.namapenunggu = ""
                    $scope.winDialogss.center().close();
                })

            }

/////////////////////////////////////////////////////////////////////       END         ///////////////////////////////////////////////////////
        }
    ]);
});
