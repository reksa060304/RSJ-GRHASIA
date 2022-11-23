define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('laporanTindakanPPACtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();

            function FormLoad() {
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {};
                LoadCombo();
                LoadDataGrid()
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo() {
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                });

                $scope.listDepartemen = [{
                        id: 1,
                        departemen: "Instalasi Rawat Jalan"
                    },
                    {
                        id: 2,
                        departemen: "Instalasi Rawat Inap"
                    }
                ];

                medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
                if($scope.item.departement.id == 2){
                    $scope.akomodasi = true
                    $scope.listAkomodasi = [
                        {id: 1,
                        akomodasi: "Total Gabungan"},
                        {
                            id: 2,
                            akomodasi: "Akomodasi Saja"
                        },
                        {
                            id: 3,
                            akomodasi: "Tanpa Akomodasi"
                        }
                    ]
                } else{
                    $scope.akomodasi = false
                }
            }

            $scope.SearchData = function () {
                LoadDataGrid()
            }

            $scope.ClearData = function () {
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            function LoadDataGrid() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59');;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempCaraBayarId = "";
                if ($scope.item.kelompokpasien != undefined) {
                    tempCaraBayarId = "&idCaraBayar=" + $scope.item.kelompokpasien.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                }
                var tempDiagnosa = ""
                if ($scope.item.Diagnosa != undefined) {
                    tempDiagnosa = "&idDiagnosa=" + $scope.item.Diagnosa.id;
                }
                var dokter = ''
                if ($scope.item.dokter != undefined) {
                    dokter = "&dokter="+ $scope.item.dokter.id
                }
                var akomodasi = ''
                if ($scope.item.akomodasi != undefined) {
                    akomodasi = "&akomodasi=" + $scope.item.akomodasi.id
                }
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-laporan-tindakan-ppa?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + dokter + tempDepartemenId + akomodasi).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 50,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    sarana: {
                                        type: 'number'
                                    },
                                    pelayanan: {
                                        type: 'number'
                                    },
                                }
                            }
                        },
                        aggregate: [
                            {
                                field: 'sarana',
                                aggregate: 'sum'
                            },
                            {
                                field: 'pelayanan',
                                aggregate: 'sum'
                            },
                        ]
                    });
                })

                
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.columnLaporan = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanTindakanPPA.xlsx",
                    allPages: true,
                },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                    sheet.name = "sheet 1";
                    var dep = ''
                    if ($scope.item.departement != undefined && $scope.item.departement.id == 1) {
                        dep = "Rawat Jalan"
                    } else if ($scope.item.departement != undefined && $scope.item.departement.id == 2) {
                        dep = "Rawat Inap"
                    }
                    var myHeaders = [{
                        value: "Data Tindakan " + dep,
                        fontSize: 17,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    var myHeaders2 = [{
                        value: "RSJ. GRHASIA",
                        fontSize: 17,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    var dokter = '-'
                    if($scope.item.dokter != undefined){
                        dokter = $scope.item.dokter.namalengkap
                    }
                    var myHeaders3 = [{
                        value: "Dokter/Operator : "+ dokter,
                        fontSize: 12,
                        textAlign: "left",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 35
                    });
                    sheet.rows.splice(1, 0, {
                        cells: myHeaders2,
                        type: "header",
                        height: 30
                    });
                    sheet.rows.splice(2, 0, {
                        cells: myHeaders3,
                        type: "data",
                        height: 20
                    });

                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [

                    {
                        field: "no",
                        title: "No",
                        width: "20px"
                    },
                    {
                        field: "tglpelayanan",
                        title: "Tanggal Pelayanan",
                        width: "100px",
                    },
                    {
                        field: "nocm",
                        title: "No RM",
                        width: "100px",
                    },
                    {
                        field: "namaproduk",
                        title: "Nama Tindakan",
                        width: "100px",
                        footerTemplate: "Jumlah Total",
                    },
                    {
                        field: "sarana",
                        title: "Jasa Sarana",
                        width: "100px",
                        aggregates: ["sum"],
                        template: "#: sarana  #",
                        footerTemplate: "#: data.sarana.sum #",
                    },
                    {
                        field: "pelayanan",
                        title: "Jasa Pelayanan",
                        width: "100px",
                        aggregates: ["sum"],
                        template: "#: pelayanan  #",
                        footerTemplate: "#: data.pelayanan.sum #",
                    }
                ]
            }

            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});