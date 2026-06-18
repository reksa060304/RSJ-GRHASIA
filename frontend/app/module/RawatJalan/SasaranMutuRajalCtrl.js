define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('SasaranMutuRajalCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q', 
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            
            $scope.title = "Sasaran Mutu Rawat Jalan";
            $scope.dataVOloaded = true;
            $scope.item = {};
            $scope.now = new Date();

            LoadCache();

            function LoadCache() {
                medifirstService.get("rawatjalan/get-combo-sasaran-mutu-rajal", false).then(function(data) {
                    $scope.listUnitLayanan = data.data.ruangan;
                });
                
                var chacePeriode = cacheHelper.get('SasaranMutuRajalCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);
                    LoadData();
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                    LoadData();
                }
            }

            function timestrToSec(timestr) {
                var parts = timestr.split(":");
                return (parts[0] * 3600) + (parts[1] * 60) + (+parts[2]);
            }
            
            function pad(num) {
                if (num < 10) {
                    return "0" + num;
                } else {
                    return "" + num;
                }
            }
            
            function formatTime(seconds) {
                return [
                    pad(Math.floor(seconds / 3600)),
                    pad(Math.floor(seconds / 60) % 60),
                    pad(seconds % 60)
                ].join(":");
            }

            function LoadData() {
                var ru = '';
                if ($scope.item.unitLayanan != undefined) {
                    ru = $scope.item.unitLayanan.id;
                }
                
                $scope.listRekap = [
                    { nama: "Standar Waktu Tunggu", nilai: "\u2264 60", satuan: "menit" },
                    { nama: "Jumlah Pasien", nilai: 0, satuan: "Pasien" },
                    { nama: "Memenuhi Standar (\u2264 60 menit)", nilai: 0, satuan: "Pasien" },
                    { nama: "Melebihi Standar (> 60 menit)", nilai: 0, satuan: "Pasien" },
                    { nama: "Persentase Memenuhi Standar", nilai: 0, satuan: "%" },
                    { nama: "Rata-rata Waktu Tunggu", nilai: "00:00:00", satuan: "HH:MM:SS" },
                    { nama: "Persentase Melebihi Standar", nilai: 0, satuan: "%" }
                ];
                
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');
                
                medifirstService.get("rawatjalan/get-data-sasaran-mutu-rajal?tglAwal=" + tglAwal + '&tglAkhir=' + tglAkhir + '&ruanganId=' + ru, false).then(function(data) {
                    $scope.dataGrid = data.data.data;
                    var listData = data.data.data,
                        jmlPasien = 0,
                        jmlPasienMasuk = 0,
                        jmlPasienLebih = 0,
                        persentaseMasuk = 0,
                        persentaseLebih = 0,
                        totalDetik = 0,
                        avgWaktuTunggu = "00:00:00";
                    
                    for (var i = 0; i < listData.length; i++) {
                        if (listData[i].waktulayanan == undefined || listData[i].waktulayanan == "") {
                            // Skip if wait time is empty
                        } else {
                            jmlPasien++;
                            totalDetik += timestrToSec(listData[i].waktulayanan);
                            if (listData[i].menit_tunggu <= 60) {
                                jmlPasienMasuk++;
                            } else {
                                jmlPasienLebih++;
                            }
                        }
                    }

                    if (jmlPasien > 0) {
                        persentaseMasuk = Math.round((jmlPasienMasuk / jmlPasien) * 10000) / 100;
                        persentaseLebih = Math.round((jmlPasienLebih / jmlPasien) * 10000) / 100;
                        avgWaktuTunggu = formatTime(Math.round(totalDetik / jmlPasien));
                    }
                    
                    $scope.listRekap = [
                        { nama: "Standar Waktu Tunggu", nilai: "\u2264 60", satuan: "menit" },
                        { nama: "Jumlah Pasien", nilai: jmlPasien, satuan: "Pasien" },
                        { nama: "Memenuhi Standar (\u2264 60 menit)", nilai: jmlPasienMasuk, satuan: "Pasien" },
                        { nama: "Melebihi Standar (> 60 menit)", nilai: jmlPasienLebih, satuan: "Pasien" },
                        { nama: "Persentase Memenuhi Standar", nilai: persentaseMasuk, satuan: "%" },
                        { nama: "Rata-rata Waktu Tunggu", nilai: avgWaktuTunggu, satuan: "HH:MM:SS" },
                        { nama: "Persentase Melebihi Standar", nilai: persentaseLebih, satuan: "%" }
                    ];
                });

                var chacePeriode = { 
                    0: tglAwal,
                    1: tglAkhir
                };
                cacheHelper.set('SasaranMutuRajalCtrl', chacePeriode);
            }
                
            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "SasaranMutuRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "SasaranMutuRawatJalan";

                    var myHeaders = [{
                        value: "Sasaran Mutu Pelayanan Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "noregistrasi",
                        "title": "No. Registrasi",
                        "width": "120px"
                    }, {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "200px"
                    }, {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "150px"
                    }, {
                        "field": "tglcheckin",
                        "title": "Waktu Check-in",
                        "width": "160px"
                    }, {
                        "field": "tgldipanggildokter",
                        "title": "Waktu Dipanggil",
                        "width": "160px"
                    }, {
                        "field": "waktulayanan",
                        "title": "Waktu Layanan",
                        "width": "150px"
                    }, {
                        "field": "menit_tunggu",
                        "title": "Tunggu (Menit)",
                        "width": "120px",
                        "attributes": { "style": "text-align: center;" },
                        "headerAttributes": { "style": "text-align: center;" }
                    }
                ]
            };

            $scope.Cari = function() {
                LoadData();
            };
        }
    ]);
});
