define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRujukanTransdataCtrl', ['$q', '$scope', 'ModelItem', 'DateHelper', 'CacheHelper', '$state', 'MedifirstService',
        function ($q, $scope, ModelItem, dateHelper, cacheHelper, $state, medifirstService) {
            $scope.item = {};
            $scope.now = new Date();
            // $scope.item.tglRujukan = new Date();
            $scope.isRouteLoading = false;

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'))

            LoadData()

            function LoadData() {
                $scope.isRouteLoading = true;

                // var tglRujukan = ""
                // if ($scope.item.tglRujukan != undefined) {
                //     tglRujukan = moment($scope.item.tglRujukan).format('YYYY-MM-DD')
                // }

                var noRujukan = "";
                if ($scope.item.noRujukan != undefined) {
                    noRujukan = $scope.item.noRujukan
                }
                var namaPasien = "";
                if ($scope.item.namaPasien == true) {
                    namaPasien = $scope.item.namaPasien
                }

                medifirstService.get("registrasi/get-daftar-rujukan?"
                    + "norujukan=" + noRujukan
                    + "&namapasien=" + namaPasien
                ).then(function (dat) {
                    var data = dat.data.rujukan
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = i + 1
                    }
                    $scope.isRouteLoading = false;
                    $scope.sourceGrid = new kendo.data.DataSource({
                        data: data,
                        // group: $scope.group,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }

                    });
                })
            }

            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var status = kendoGrid.dataItem(row).status;
                    if (status !=null) {
                        $(row.cells).addClass("green");
                    } else {
                        $(row.cells).addClass("red");

                    }
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.mainGridOptions = {
                scrollable: true,
                dataBound: onDataBound,
                columns: [
                    { field: "no", title: "No", width: "30px" },
                    {
                        field: "tglrujukan", title: "Tgl Rujuk ", width: "100px", "template": "<span class='style-left'>{{formatTanggal('#: tglrujukan #')}}</span>"
                    },
                    { field: "norujukan", title: "No Rujukan", width: "100px" },
                    { field: "asalrujukan", title: "Asal Rujukan", width: "100px" },
                    { field: "norm", title: "No RM", width: "100px" },
                    { field: "namapasien", title: "Nama Pasien", width: "200px" },
                    { field: "tgllahir", title: "Tgl Lahir", width: "100px", "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>" },
                    { field: "namadiagnosa", title: "Keluhan /Diagnosa", width: "250px" },
                    { field: "status", title: "Status", width: "80px" },
                    {
                        "command": [
                            // { text: "Edit", click: edit, imageClass: "k-icon k-i-pencil" },
                            // { text: "Jawab", click: jawabRujukan, imageClass: "k-icon k-i-download" },
                            { text: "Registrasi", click: registrasi, imageClass: "k-icon k-i-search" },
                        ],
                        title: "",
                        width: "90px",
                    }
                ]
            };
            function registrasi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (moment(dataItem.tglrujukan).format('DD-MMM-YYYY') != moment($scope.now).format('DD-MMM-YYYY')) {
                    toastr.error("Tanggal Rujukan Tidak Sesuai Dengan Tanggal Sekarang");
                    return;
                }                                
                if (dataItem) {
                    cacheHelper.set('CacheRegistrasiPasien', undefined);
                    cacheHelper.set('CacheRegisOnline', undefined);
                    cacheHelper.set('cacheRujukanTransdata', undefined)
                    var tgllahir = moment(new Date(dataItem.tgllahir)).format('YYYY-MM-DD')
                    medifirstService.get("registrasi/get-pasien?tglLahir=" + tgllahir
                        + "&nik=" + dataItem.nik
                        + "&namaPasien=" + dataItem.namapasien).then(function (data) {
                            cacheHelper.set('cacheRujukanTransdata', dataItem)
                            if (data.data.daftar.length == 0) {

                                $state.go('RegistrasiPasienBaru', {
                                    noRec: 0,
                                    idPasien: 0,
                                    departemen: 0,
                                });
                            } else {

                                $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                                    noCm: data.data.daftar[0].nocm
                                });
                            }

                        })

                }
            }
            function detail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem) {
                    cacheHelper.set('cacheEditRujukan', dataItem);
                    cacheHelper.set('cacheRujukan', 'masuk');
                    $state.go('RujukanKeluar')
                }
            }
            function edit(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem) {
                    cacheHelper.set('cacheEditRujukan', dataItem);
                    $state.go('RujukanKeluar')
                }
            }

            function jawabRujukan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                // if (dataItem.RUJUKAN.FASKES_ASAL.NAMA.indexOf('RSAB Harapan Kita') > -1) {
                //     toastr.error('Jawab Rujukan hanya untuk merespon rujukan yang masuk !', 'Error')
                //     return
                // }
                $scope.noRujukanSelect = dataItem.RUJUKAN.NOMOR
                $scope.winJawabRujukan.center().open()
            }
            function batalRujuk(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var json = {
                    "PETUGAS": {
                        "NIK": $scope.dataLogin.noIdentitas,
                        "NAMA": $scope.dataLogin.namaLengkap
                    }
                }
                var data = {
                    "data": json
                }
                medifirstService.putNonMessage('bridging/sisrute/rujukan/batal?nomor=' + dataItem.RUJUKAN.NOMOR, data).then(function (res) {
                    if (res.data.success == true) {
                        toastr.success(res.data.detail + ' No. ' + dataItem.RUJUKAN.NOMOR, 'Success')
                        LoadData()
                    }

                })
            }
            $scope.SearchData = function () {
                LoadData();
            }
            $scope.reset = function () {
                delete $scope.item.tglRujukan
                delete $scope.item.noRujukan
                delete $scope.item.create
            }
            $scope.batalJawabRujukan = function () {
                delete $scope.item.petugas
                delete $scope.item.keterangan
                delete $scope.item.status
            }
            $scope.saveJawabRujukan = function () {
                var json = {
                    "DITERIMA": $scope.item.status.id,
                    "KETERANGAN": $scope.item.keterangan,
                    "PETUGAS": {
                        "NIK": $scope.item.petugas.noidentitas,
                        "NAMA": $scope.item.petugas.namalengkap
                    }
                }
                var data = {
                    "data": json
                }
                medifirstService.putNonMessage('bridging/sisrute/rujukan/jawab?nomor=' + $scope.noRujukanSelect, data).then(function (res) {
                    if (res.data.success == true)
                        toastr.success(res.data.detail, 'Success')
                })
            }
        }
    ]);
});