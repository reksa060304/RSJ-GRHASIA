define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LapPendapatanKegiatanAmbulanCtrl', ['$q', '$scope', 'CacheHelper', 'MedifirstService',
        function ($q, $scope, cacheHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.popupExp = {};
            $scope.user = medifirstService.getPegawaiLogin();
            $scope.item.tahun = new Date(moment($scope.now).format('YYYY'))
            $scope.item.jmlRows = 50;
            loadData();

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
                var tglAwal = moment($scope.item.tahun).startOf('year').format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tahun).endOf('year').format('YYYY-MM-DD HH:mm:ss');

               $q.all([
                   medifirstService.get("ambulance/laporan-pendapatan-kegiatan-ambulance?" +
                       "tglAwal=" + tglAwal +
                       "&tglAkhir=" + tglAkhir),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data[0].data.length; i++) {
                        data[0].data[i].no = i + 1
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        pageSize: 10,
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5
                        },
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    no: { type: "number" },
                                    namajeniskegiatan: { type: "string" },
                                    nopolisi: { type: "string" },
                                    keteranganlainnya: { type: "string" },
                                    namapersonel: { type: "string" },
                                    lokasitujuan: { type: "string" },
                                    jarak: { type: "number" },
                                    hargasatuan: { type: "number" },
                                    namapasien_klien: { type: "string" }
                                }
                            },
                            total: function (response) {
                                return response.length;
                            }
                        },
                        sort: {
                            enabled: true
                        }
                    });


                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                    }

                    cacheHelper.set('LapKegiatanAmbulanCtrl', chacePeriode);
                });
            };

            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanPendapatanKegiatanAmbulan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:C1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Pendapatan Kegiatan Ambulan",
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
                        "width": "30px",
                    },
                    {
                        "field": "bulan",
                        "title": "Bulan",
                        "width": "70px",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    },
                ]
            };

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            //** BATAS */
        }
    ]);
});