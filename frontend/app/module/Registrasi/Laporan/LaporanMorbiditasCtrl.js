define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanMorbiditasCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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


            function LoadCombo() {
                $scope.listDepartemen = [{
                        "id": 1,
                        "departemen": 'Rawat Inap'
                    },
                    {
                        "id": 2,
                        "departemen": 'Rawat Jalan'
                    },
                ]
                // medifirstService.get("registrasi/get-datacombo-sensus?", true).then(function (dat) {
                //     $scope.listRuangan = dat.data.ruanganfarmasi;
                //     $scope.listDataDokter = dat.data.dokter;
                //     $scope.listKelompokPasien = dat.data.kelompokpasien;
                //     $scope.namaLengkap = medifirstService.getPegawaiLogin();
                // });
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {

                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                });
                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
            }

            function init() {
                var tempJenisDiagnosa = ""
                if ($scope.item.JenisDiagnosa != undefined) {
                    tempJenisDiagnosa = "&idJenisDiagnosa=" + $scope.item.JenisDiagnosa.id;
                }
                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');

                medifirstService.get("tatarekening/get-data-morbiditas-pasien?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + tempJenisDiagnosa + tempDepartemenId, true).then(function (dat) {

                    $scope.isRouteLoading = true;
                    var data2 = dat.data.data;
                    
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1;
                    }

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        },
                        pageSize: 200,
                        serverPaging: false,
                        aggregate: [{
                            field: "totalkunjungan",
                            aggregate: "sum"
                        }]
                    });
                });

                // var json = {
                //     'nama': 'yogs',
                //     'slsms':sdsds
                // }
                // medifirstService.poat('fsfs',jdon).then(function(e){
                //     $scope.listRuangan = e.data.dstsr
                // })



            }

            function FormLoad() {

                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
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

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Morbiditas.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:S1"];
                    sheet.frozenRows = 4;
                    sheet.name = "Report";

                    var myHeaders = [{

                        value: "Laporan Morbiditas",
                        fontSize: 20,
                        textAlign: "center",
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });

                },
                // filterable: true,
                // columnMenu: true,
                // reorderable: true,
                resizable: true,
                // groupable: true,
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No. Urut",
                        "width": "40px",
                        attributes: {
                            style: 'text-align: center'
                        },

                    },
                    {
                        "field": "kddiagnosa",
                        "title": "Kode Diagnosa",
                        "width": "70px",
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Nama Diagnosa Penyakit",
                        "width": "150px",
                        "footerTemplate": "Total",
                    },
                    {
                        "title": "Jumlah Pasien Kasus Menurut Golongan Umur & Sex",
                        "width": "80px",
                        columns: [{
                                "title": "1 - 4 thn",
                                "width": "40px",
                                columns: [{
                                    field: "lk1",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }, {
                                    "field": "pr1",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }]

                            },
                            {
                                "title": "5 - 14 thn",
                                "width": "40px",
                                columns: [{
                                    "field": "lk2",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr2",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }]

                            },
                            {
                                "title": "15 - 24 thn",
                                "width": "40px",
                                columns: [{
                                    "field": "lk3",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr3",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }]

                            },
                            {
                                "title": "25 - 44 thn",
                                "width": "40px",
                                columns: [{
                                    "field": "lk4",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr4",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }]

                            },
                            {
                                "title": "45 - 64 thn",
                                "width": "40px",
                                columns: [{
                                    "field": "lk5",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr5",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }]

                            },
                            {
                                "title": "> 65 thn",
                                "width": "40px",
                                columns: [{
                                    "field": "lk6",
                                    "title": "L",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }, {
                                    "field": "pr6",
                                    "title": "P",
                                    "width": "40px",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }]
                            },
                        ]
                    },
                    {
                        "title": "Kasus Baru menurut jenis Kelamin",
                        columns: [{
                            "field": 'lkbr',
                            "title": "L",
                            "width": "40px",
                            attributes: {
                                style: 'text-align: center'
                            }
                        }, {
                            "field": 'prbr',
                            "title": "P",
                            "width": "40px",
                            attributes: {
                                style: 'text-align: center'
                            }
                        }]
                    },
                    {
                        "field": "totalkasusbaru",
                        "title": "Jumlah Kasus Baru(16 + 17)",
                        "width": "40px",
                        attributes: {
                            style: 'text-align: center'
                        }
                    },
                    {
                        "field": "totalkunjungan",
                        "title": "Jumlah Kunjungan",
                        "width": "40px",
                        attributes: {
                            style: 'text-align: center'
                        },
                        aggregates: ["sum"],
                        template: "#: totalkunjungan  #",
                        footerTemplate: "#: data.totalkunjungan.sum #",

                    }

                ]
            };
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});