define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('GrafikaCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;

            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $(".export-pdf").on('click',function () {
                var chart = $("#chart").getKendoChart();
                chart.exportPDF({
                    paperSize: "auto",
                    margin: {
                        left: "1cm",
                        top: "1cm",
                        right: "1cm",
                        bottom: "1cm"
                    }
                }).done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "chart.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
            });

            $(".export-img").on('click', function () {
                var chart = $("#chart").getKendoChart();
                chart.exportImage().done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "chart.png",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
            });


            $scope.SearchData = function () {
                init()
            }

            function LoadCombo() {
                medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {

                    // $scope.listPegawai = dat.data.dokter;
                    $scope.listDepartement = dat.data.departemen;
                    // $scope.listPegawaiKasir = dat.data.kasir;
                    //$scope.dataLogin = dat.data.datalogin[0];
                    $scope.listPasien = dat.data.kelompokpasien;
                    // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                    // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
                });
                $scope.getIsiComboRuangan = function () {
                    $scope.listRuangan = $scope.item.departemen.ruangan
                }
                $scope.listDepartemen = [{
                        "id": 1,
                        "departemen": 'Rawat Inap'
                    },
                    {
                        "id": 2,
                        "departemen": 'Rawat Jalan'
                    },
                ]
                var tahun = 'tahun=' + moment($scope.item.tahun).format('YYYY');


                medifirstService.get("registrasi/get-data-grafik?" + tahun).then(function (dat) {
                    createChart();
                    $(document).on('bind', "kendo:skinChange", createChart);

                    function createChart() {
                        $("#chart").kendoChart({
                            
                            valueAxes: [{
                                title: {
                                    text: "Jumlah Kunjungan"
                                },
                                min: 0,

                            }],
                            legend: {
                                position: "right",
                                labels: {
                                    font: "12px 'DejaVu Sans'"
                                }
                            },

                            seriesDefaults: {
                                labels: {
                                    visible: true,
                                }
                            },
                            series: [{
                                    type: "column",
                                    data: [dat.data.data[0].januari, dat.data.data[0].februari, dat.data.data[0].maret, dat.data.data[0].april, dat.data.data[0].mei, dat.data.data[0].juni, dat.data.data[0].juli, dat.data.data[0].agustus, dat.data.data[0].september, dat.data.data[0].oktober, dat.data.data[0].november, dat.data.data[0].desember],
                                    color: "#41abf2",
                                }


                            ],
                            categoryAxis: {
                                categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                // Align the first two value axes to the left
                                // and the last two to the right.
                                //
                                // Right alignment is done by specifying a
                                // crossing value greater than or equal to
                                // the number of categories.
                                axisCrossingValues: [0, 0, 10, 10]
                            },
                            tooltip: {
                                visible: true,

                            }


                        });
                    }
                });

            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.$watch('cari.tahun', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    newVal = moment(newVal).format('YYYY')
                    oldVal = moment(oldVal).format('YYYY')
                    if (newVal != oldVal) {
                        applyFilter("tahuns", newVal)
                    }
                }, 500)
            })

            function init() {

                var tahun = '';
                var tanggalawal = '';
                var tanggalakhir = '';
                var departemen = '';
                var ruangan = '';
                var jenislaporan = '';
                if ($scope.item.tglawal != undefined && $scope.item.tglakhir != undefined) {
                    tanggalawal = 'tglawal=' + moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                    tanggalakhir = '&tglakhir=' + moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');
                }
                tahun = 'tahun=' + moment($scope.now).format('YYYY');
                if ($scope.item.tahun != undefined) {
                    tahun = 'tahun=' + moment($scope.item.tahun).format('YYYY');
                }
                if ($scope.item.tahun && $scope.item.tglawal && $scope.item.tglakhir) {
                    window.messageContainer.error("Mohon Untuk Tidak Mengisi Tanggal dan Tahun Secara Bersamaan");
                    return
                }
                if ($scope.item.jenislaporan != undefined) {
                    jenislaporan = '&jenislaporan=' + $scope.item.jenislaporan.id;
                }
                if ($scope.item.departemen != undefined) {
                    departemen = '&departemen=' + $scope.item.departemen.id;
                }
                if ($scope.item.ruangan != undefined) {
                    ruangan = '&ruangan=' + $scope.item.ruangan.id;
                }
                    
                

                
                medifirstService.get("registrasi/get-data-grafik?" + tahun + tanggalawal + tanggalakhir + jenislaporan+departemen+ruangan).then(function (dat) {
                    createChart();
                    $(document).on('bind', "kendo:skinChange", createChart);

                    function createChart() {
                        $("#chart").kendoChart({
                            title: {
                                text: "GRAFIK FLUKTUASI DATA KUNJUNGAN RAWAT JALAN",
                                font: "bold 20px 'Arial'",
                            },
                            valueAxes: [{
                                title: {
                                    text: "Jumlah Kunjungan"
                                },
                                min: 0
                            }],
                            legend: {
                                position: "right",
                                labels: {
                                    font: "12px 'DejaVu Sans'"
                                }
                            },

                            seriesDefaults: {
                                labels: {
                                    visible: true,
                                }
                            },
                            series: [{
                                    type: "column",
                                    color: "#41abf2",
                                    data: [dat.data.data[0].januari, dat.data.data[0].februari, dat.data.data[0].maret, dat.data.data[0].april, dat.data.data[0].mei, dat.data.data[0].juni, dat.data.data[0].juli, dat.data.data[0].agustus, dat.data.data[0].september, dat.data.data[0].oktober, dat.data.data[0].november, dat.data.data[0].desember]
                                },


                            ],
                            categoryAxis: {
                                categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                                // Align the first two value axes to the left
                                // and the last two to the right.
                                //
                                // Right alignment is done by specifying a
                                // crossing value greater than or equal to
                                // the number of categories.
                                axisCrossingValues: [0, 0, 10, 10]
                            },
                            tooltip: {
                                visible: true,

                            }


                        });
                    }
                });

            }

            function FormLoad() {
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglawal = undefined;
                $scope.item.tglakhir = undefined;
                $scope.item.tahun = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }


            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});