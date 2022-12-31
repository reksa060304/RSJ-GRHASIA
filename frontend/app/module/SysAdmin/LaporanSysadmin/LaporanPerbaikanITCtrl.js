define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPerbaikanITCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
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
                // medifirstService.get("pdti/laporan-perbaikan-it?tglawal="+$scope.item.tglawal).then(function (dat) {
                //     $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                // });

                $scope.listDepartemen = [{
                        id: 1,
                        departemen: "Instalasi Rawat Jalan"
                    },
                    {
                        id: 2,
                        departemen: "Instalasi Rawat Inap"
                    }
                ];
                medifirstService.get('ipsrs/get-combo-pegawai-perbaikan').then(function(data){
                    var datas = data.data
                    $scope.listObjekPerbaikan = datas.objekperbaikan
                })
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
                if ($scope.item.departement.id == 2) {
                    $scope.akomodasi = true
                    $scope.listAkomodasi = [{
                            id: 1,
                            akomodasi: "Total Gabungan"
                        },
                        {
                            id: 2,
                            akomodasi: "Akomodasi Saja"
                        },
                        {
                            id: 3,
                            akomodasi: "Tanpa Akomodasi"
                        }
                    ]
                } else {
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

                var objekperbaikan = ''
                if ($scope.item.objekperbaikan != undefined) {
                    objekperbaikan = "&objekperbaikan=" + $scope.item.objekperbaikan.id
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
                medifirstService.get("pdti/laporan-perbaikan-it?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + objekperbaikan).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        var respon = ''
                        if (datas[i].startdate != null) {
                            var diff2 = Math.abs(new Date(datas[i].tglplanning) - new Date(datas[i].tglverif))
                            // respon = Math.floor(((diff2 / 1000) / 60) / 60) + " jam " + Math.floor(Math.floor((diff2 / 1000) / 60) - Math.floor(Math.floor(((diff2 / 1000) / 60) / 60) * 60)) + " menit";
                            var jam = Math.floor(((diff2 / 1000) / 60) / 60)
                            respon = jam * 60 + Math.floor(Math.floor((diff2 / 1000) / 60) - Math.floor(Math.floor(((diff2 / 1000) / 60) / 60) * 60))
                            // console.log(jam * 60);
                        }
                        var durasi = ''
                        if (datas[i].duedate != null) {
                            var diff = Math.abs(new Date(datas[i].duedate) - new Date(datas[i].startdate))
                            // durasi = Math.floor(((diff / 1000) / 60) / 60) + " jam " + Math.floor(Math.floor((diff / 1000) / 60) - Math.floor(Math.floor(((diff / 1000) / 60) / 60) * 60)) + " menit"
                            var jam = Math.floor(((diff / 1000) / 60) / 60)
                            durasi = jam * 60 + Math.floor(Math.floor((diff / 1000) / 60) - Math.floor(Math.floor(((diff / 1000) / 60) / 60) * 60))
                        }
                        datas[i].respon = respon
                        datas[i].durasi = durasi
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 50,
                        total: datas.length,
                        serverPaging: false,
                        // schema: {
                        //     model: {
                        //         fields: {
                        //             sarana: {
                        //                 type: 'number'
                        //             },
                        //             pelayanan: {
                        //                 type: 'number'
                        //             },
                        //         }
                        //     }
                        // },
                        // aggregate: [{
                        //         field: 'sarana',
                        //         aggregate: 'sum'
                        //     },
                        //     {
                        //         field: 'pelayanan',
                        //         aggregate: 'sum'
                        //     },
                        // ]
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
                    fileName: "LaporanPerbaikanIT.xlsx",
                    allPages: true,
                },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:M1", "A2:M2", "A3:M3"];
                    sheet.name = "sheet 1";
                    var myHeaders = [{
                        value: "Laporan Perbaikan IT",
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

                    var myHeaders3 = [{
                        value: "Periode " + moment($scope.item.tglawal).format('YYYY-MM-DD') + " S/D " + moment($scope.item.tglakhir).format('YYYY-MM-DD'),
                        fontSize: 12,
                        textAlign: "center",
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
                        type: "header",
                        height: 30
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
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "100px",
                    },
                    {
                        field: "namalengkap",
                        title: "Pelapor",
                        width: "115px",
                    },
                    {
                        field: "rincianexecuteplanning_askep",
                        title: "Laporan Kerusakan",
                        width: "100px",
                    },
                    {
                        field: "tglplanning",
                        title: "Tgl Diterima",
                        width: "100px",
                    },
                    {
                        field: "tglverif",
                        title: "Tgl Direspon",
                        width: "100px",
                    },
                    {
                        field: "respon",
                        title: "Respon Time",
                        width: "100px",
                    },
                    {
                        field: "startdate",
                        title: "Tgl Mulai",
                        width: "100px",
                    },
                    {
                        field: "duedate",
                        title: "Tgl Selesai",
                        width: "100px",
                    },
                    {
                        field: "durasi",
                        title: "Respon Pengerjaan",
                        width: "100px",
                    },
                    {
                        field: "jeniskerusakan",
                        title: "Jenis Kerusakan",
                        width: "100px",
                    },
                    {
                        field: "jenisalat",
                        title: "Jenis Perbaikan",
                        width: "100px",
                    },
                    {
                        field: "statuspekerjaan",
                        title: "Status",
                        width: "100px",
                    }
                ]
            }

            ////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});