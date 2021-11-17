
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('DaftarPembatalanPasienCtrl', ['MedifirstService', '$scope',
        function (medifirstService, $scope) {
            $scope.title = "Daftar Pembatalan Pasien";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                medifirstService.get("registrasi/get-daftar-pasienbatal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + reg
                    + rm
                    + nama).then(function (e) {
                        $scope.isRouteLoading = false;

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            group: {
                                field: "tanggalpembatalan",
                                aggregates: [{
                                    field: "pembatal",
                                    aggregate: "count"
                                }, {
                                    field: "namalengkap",
                                    aggregate: "count"
                                }]
                            }
                        });
                    })

            }
            $scope.findData();
            $scope.mainGridOptions = {
                columns: [{
                    field: "norec_br",
                    title: " ",
                    hidden: true
                }, {
                    field: "noantrian",
                    title: "Antrian"
                }, {
                    field: "tanggalpembatalan",
                    title: "Tanggal"
                }, {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false
                },
                {
                    field: "nocm",
                    title: "No Rm",
                    hidden: false
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien"
                },
                {
                    field: "namaruangan",
                    title: "Ruangan"
                },
                {
                    field: "pembatal",
                    title: "Pembatal"
                }, {
                    field: "namalengkap",
                    title: "Pegawai"
                }, {
                    field: "alasanpembatalan",
                    title: "Alasan Pembatalan"
                }],
                selectable: "row",
                sortable: true
            }
        }
    ]);

});