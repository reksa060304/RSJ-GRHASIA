define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PasienTanpaPelayananCtrl', ['CacheHelper', '$mdDialog', '$state', '$scope', 'MedifirstService',
      function (cacheHelper, $mdDialog, $state, $scope, medifirstService) {
            $scope.title = "Pasien 24 Jam Tanpa Pelayanan Selain Registrasi";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };

            $scope.batalregistrasi = function () {
                console.log($scope.dataPasienBatal)
                console.log($scope.dataPasienBatal.options.data)
        
                if ($scope.dataPasienBatal == []) {
                    toastr.error('Data Kosong ')
                    return
                }

                var objSave = {
                    data: $scope.dataPasienBatal.options.data
                }

                medifirstService.post('registrasi/save-pasien-batal-registrasi', objSave).then(function (e) { 
                    $scope.findData()
                })
                
            }

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
                medifirstService.get("registrasi/get-pasien-batal-registrasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir
                    + reg
                    + rm
                    + nama).then(function (e) {
                        $scope.isRouteLoading = false;
                        console.log(e.data.data)

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            pageSize: 200,
                            total: e.data.data.length,
                            serverPaging: false,
                            schema: {
                              model: {
                                fields: {
                                }
                              }
                            },
                            aggregate: [
                            ]
                          });
                    })

            }
            $scope.findData();
            $scope.mainGridOptions = {
                columns: [{
                    field: "tglregistrasi",
                    title: "Tgl Registrasi",
                }, {
                    field: "jumlahpelayanan",
                    title: "Jumlah Pelayanan"
                }, {
                    field: "namaproduk",
                    title: "Nama Pelayanan"
                }, {
                    field: "biaya",
                    title: "Biaya",
                }, {
                    field: "kelompokpasien",
                    title: "Kelompok Pasien",
                }, {
                    field: "nocm",
                    title: "No RM"
                }, {
                    field: "noregistrasi",
                    title: "No Registrasi"
                }, {
                    field: "namapasien",
                    title: "Nama Pasien"
                },
                {
                    field: "namaruangan",
                    title: "Ruangan"
                }],
                selectable: "row",
                sortable: true
            }
        }
    ]);

});