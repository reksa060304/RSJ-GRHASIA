define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRekapInsidenInternalCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.showFilter = false;
            $scope.tglMeninggal = '';
            var norecInsiden = '';
            $scope.selectedOnCheck = [];
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            $scope.listVerifikasi = [
                { id: 1, nama: "Sudah Verifikasi", stat: true, },
                { id: 2, nama: "Belum Verifikasi", stat: false, },
            ]
            loadCombo();
            loadFirst();
            loadData();

            function loadCombo() {
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuangan = data;
                });
            }

            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarRekapInsidenInternalCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.id
                }

                var statusverif = ""
                if ($scope.item.statusverif != undefined) {
                    statusverif = "&statusverif=" + $scope.item.statusverif.stat
                }

                var norm = ""
                if ($scope.item.noRm != undefined) {
                    norm = "&norm=" + $scope.item.noRm
                }

                var namapasien = ""
                if ($scope.item.nama != undefined) {
                    namapasien = "&namapasien=" + $scope.item.nama
                }

                medifirstService.get("pmkp/get-data-insiden-internal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    namaruangan
                    +statusverif
                    +norm
                    +namapasien).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
							doto[i].statCheckbox = false
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: doto,
                            pageSize: 50,
                            total: doto.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // jumlah: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                // { field: 'jumlah', aggregate: 'sum' },
                            ]
                        })
                    });

                var chacePeriode = $scope.item.periodeAwal + "~" +$scope.item.periodeAkhir
                cacheHelper.set('DaftarRekapInsidenInternalCtrl', chacePeriode);
            };

            $scope.SearchData = function () {
                loadData();
            }

            $scope.group = {
                field: "jeniskeselamatan",
                aggregates: [{
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }, {
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "jeniskeselamatan",
                aggregate: "count"
            }, {
                field: "jeniskeselamatan",
                aggregate: "count"
            }]
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarLaporanInsidenInternal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Insiden Internal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                // dataBound: onDataBound,
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "60px",
                    },
                    {
                        "field": "tglinsiden",
                        "title": "Tgl Insiden",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "220px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "220px",
                    },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "220px",
                    },
                    {
                        "field": "keselamatan",
                        "title": "Keselamatan",
                        "width": "220px",
                    },
                    {
                        hidden: true,
                        field: "jeniskeselamatan",
                        title: "Jenis Keselamatan",
                        aggregates: ["count"],
                        // groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    },
                    {
                        "field": "statusverif",
                        "title": "Status Verif",
                        "width":"60px",
                        "template": '# if( statusverif==true) {# Sudah Verifikasi # } else {# Belum Verifikasi #} #'
                    },
                ]
            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            //** BATAS SUCI */                    
        }
    ]);
});