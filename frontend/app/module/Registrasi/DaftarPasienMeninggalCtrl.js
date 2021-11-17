
define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('DaftarPasienMeninggalCtrl', ['MedifirstService', '$scope',
        function (medifirstService, $scope) {
            $scope.title = "Daftar Pasien Meninggal";
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
                medifirstService.get("registrasi/get-daftar-pasien-meninggal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + reg
                    + rm
                    + nama).then(function (e) {
                        $scope.isRouteLoading = false;

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            pageable: true,
                            pageSize: 1000,
                            total: e.data.data.length,
                            serverPaging: false,
                            // group: {
                            //     field: "tglmeninggal",
                            //     aggregates: [{
                            //         field: "noregistrasi",
                            //         aggregate: "count"
                            //     }, {
                            //         field: "namapasien",
                            //         aggregate: "count"
                            //     }]
                            // }
                        });
                    })

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.mainGridOptions = {
                columns: [
                    {
                        field: "tglmeninggal",
                        title: "Tgl Meninggal",
                        template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"

                    },
                    {
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
                        field: "penyebabkematian",
                        title: "Penyebab Kematian"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan Terakhir"
                    }
                ],
                selectable: "row",
                sortable: true
            }
        }
    ]);

});