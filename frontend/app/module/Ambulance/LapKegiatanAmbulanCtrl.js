define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LapKegiatanAmbulanCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
        function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.popupExp = {};
            $scope.user = medifirstService.getPegawaiLogin();
            $scope.item.periodeAwal = $scope.now
            $scope.item.periodeAkhir = new Date();
            $scope.item.jmlRows = 50;
            loadData();
            // postIKTvisite()

            if ($scope.user.id === 320261136) {
                $scope.pegawaihungkul = false
                $scope.nonpegawai = true
            } else {
                $scope.pegawaihungkul = true
                $scope.nonpegawai = false
            }
            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }

                $q.all([
                    medifirstService.get("ambulance/laporan-kegiatan-ambulan?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        rm + nm),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data[0].data.length; i++) {
                        data[0].data[i].no = i + 1
                        var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
                        data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr'
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        pageSize: 10,
                        total: data[0].data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });


                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                    }

                    cacheHelper.set('LapKegiatanAmbulanCtrl', chacePeriode);
                });
            };

            var onDataBound = function (e) {
                var columns = e.sender.columns;
                var rows = e.sender.tbody.children();

                for (var j = 0; j < rows.length; j++) {
                    // sisa sekarang
                    var row = $(rows[j]);
                    var dataItem = e.sender.dataItem(row);

                    var unitBpjs = dataItem.get("kelompokpasien");
                    var unitDept = dataItem.get("deptid");
                    var unitPpk = dataItem.get("ppkrujukan");
                    var unitSep = dataItem.get("nosep");

                    var cellSEP = row.children().eq(13);
                    cellSEP.addClass(getNotifSEP(unitBpjs, unitSep, unitDept, unitPpk));

                    var isdiag = dataItem.get("isdiagnosis");
                    var cellDiag = row.children().eq(14);
                    cellDiag.addClass(getNotifDiag(isdiag));

                }
            }
            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
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

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                dataBound: onDataBound,
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Struk",
                        "width": "120px",
                    },
                    {
                        "field": "",
                        "title": "Jenis Kegiatan",
                        "width": "100px"
                    },
                    {
                        "field": "",
                        "title": "Jenis Ambulan",
                        "width": "100px",
                    },
                    {
                        "field": "",
                        "title": "No Plat",
                        "width": "100px",
                    },
                    {
                        "field": "namapersonel",
                        "title": "Nama Personel",
                        "width": "150px",
                    },
                    {
                        "field": "",
                        "title": "Lokasi Tujuan",
                        "width": "150px",
                    },
                    {
                        "field": "",
                        "title": "Jarak Tempuh",
                        "width": "100px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Biaya",
                        "width": "150px",
                    },
                    {
                        "field": "namapasien_klien",
                        "title": "Nama Pasien",
                        "width": "150px",
                    },
                    {
                        "field": "",
                        "title": "Jenis Pasien",
                        "width": "100px",
                    }
                ]
            };
            //** BATAS */
        }
    ]);
});