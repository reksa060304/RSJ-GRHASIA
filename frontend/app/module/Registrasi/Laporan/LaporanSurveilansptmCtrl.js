define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSurveilansptmCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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

                medifirstService.get("tatarekening/get-data-surveilans-pasien?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + tempJenisDiagnosa + tempDepartemenId, true).then(function (dat) {

                    $scope.isRouteLoading = false;
                    var datas = dat.data.detail;

                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
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
                    fileName: "Laporan Surverilans.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:V1"];
                    sheet.frozenRows = 4;
                    sheet.name = "Report";

                    var myHeaders = [{

                        value: "Laporan Surveilans",
                        fontSize: 20,
                        textAlign: "center",
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });

                    for (let i = 4; i < 34; i++) {
                        for (let j = 0; j < 22; j++) {
                            sheet.rows[i].cells[j].background = "#ffffff";
                        }
                    }
                    
                    // for (let i = 4; i < 34; i++) {
                    //     for (let j = 3; j < 21; j++) {
                    //         sheet.rows[i].cells[j].background = "#ffffff";
                    //     }
                    // }
                            sheet.rows[4].background = "#000000";

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
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            style: 'text-align: center'
                        },

                    },
                    {
                        "field": "namapenyakit",
                        "title": "Nama Penyakit",
                        "width": "210px",
                    },
                    {
                        "field": "icdx",
                        "title": "ICD X",
                        "width": "60px",
                    },
                    {
                        "title": "Jumlah Kasus Rawat Jalan Menurut Golongan Umur dan Jenis Kelamin",
                        "width": "80px",
                        columns: [
                            {
                                "title": "<1 thn",
                                "width": "40px",
                                columns: [{
                                    field: "lk0",
                                    "title": "L",
                                    "width": "40px",
                                    // template: "#=lk0 == 0 ? '' : lk0#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }, {
                                    "field": "pr0",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr0 == 0 ? '' : pr0#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }]

                            },
                            {
                                "title": "1 - 4 thn",
                                "width": "40px",
                                columns: [{
                                    field: "lk1",
                                    "title": "L",
                                    "width": "40px",
                                    // template: "#=lk1 == 0 ? '' : lk1#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }, {
                                    "field": "pr1",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr1 == 0 ? '' : pr1#",
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
                                    // template: "#=lk2 == 0 ? '' : lk2#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr2",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr2 == 0 ? '' : pr2#",
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
                                    // template: "#=lk3 == 0 ? '' : lk3#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr3",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr3 == 0 ? '' : pr3#",
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
                                    // template: "#=lk4 == 0 ? '' : lk4#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr4",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr4 == 0 ? '' : pr4#",
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
                                    // template: "#=lk5 == 0 ? '' : lk5#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }

                                }, {
                                    "field": "pr5",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr5 == 0 ? '' : pr5#",
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
                                    // template: "#=lk6 == 0 ? '' : lk6#",
                                    attributes: {
                                        style: 'text-align: center'
                                    }
                                }, {
                                    "field": "pr6",
                                    "title": "P",
                                    "width": "40px",
                                    // template: "#=pr6 == 0 ? '' : pr6#",
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
                            // template: "#=lkbr == 0 ? '' : lkbr#",

                            attributes: {
                                style: 'text-align: center'
                            }
                        }, {
                            "field": 'prbr',
                            "title": "P",
                            "width": "40px",
                            // template: "#=prbr == 0 ? '' : prbr#",

                            attributes: {
                                style: 'text-align: center'
                            }
                        }]
                    },
                    {
                        "field": "totalkasusbaru",
                        "title": "Jumlah Kasus Baru(16 + 17)",
                        "width": "40px",
                        // template: "#=totalkasusbaru == 0 ? '' : totalkasusbaru#",
                        attributes: {
                            style: 'text-align: center'
                        }
                    },
                    {
                        "field": "totalkunjungan",
                        "title": "Jumlah Kunjungan",
                        // template: "#=totalkunjungan == 0 ? '' : totalkunjungan#",
                        "width": "40px",
                        attributes: {
                            style: 'text-align: center'
                        },
                        // aggregates: ["sum"],
                        // template: "#: totalkunjungan  #",
                        // footerTemplate: "#: data.totalkunjungan.sum #",

                    },
                    {
                        "field": "meninggal",
                        "title": "Meninggal",
                        // template: "#=meninggal == 0 ? '' : meninggal#",
                        "width": "40px",
                        attributes: {
                            style: 'text-align: center'
                        },
                        // aggregates: ["sum"],
                        // template: "#: totalkunjungan  #",
                        // footerTemplate: "#: data.totalkunjungan.sum #",

                    },
                ],
                rows: [
                    {
                        cells: [
                            {
                                background: "#ffffff",
                            }
                        ]
                    },
                ]
            };
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});