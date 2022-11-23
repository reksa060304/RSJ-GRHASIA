define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('LaporanSensusHarianRawatJalanCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.now = new Date()
            $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')
            $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59:59')
            $scope.searchData = function () {
                loadData()
            }
            loadData()
            // console.log($scope.item.jenisLaporan);
            function loadData() {
                $scope.totalpasienbaru = 0
                $scope.totalpasienlama = 0
                $scope.ttljklk = 0
                $scope.ttljkpr = 0
                $scope.ttlumur1 = 0
                $scope.ttlumur2 = 0
                $scope.ttlumur3 = 0
                $scope.ttlumur4 = 0
                $scope.ttlumur5 = 0
                $scope.ttlumur6 = 0
                $scope.ttlagama1 = 0
                $scope.ttlagama2 = 0
                $scope.ttlagama3 = 0
                $scope.ttlagama4 = 0
                $scope.ttlagama5 = 0
                $scope.ttlalamat1 = 0
                $scope.ttlalamat2 = 0
                $scope.ttlalamat3 = 0
                $scope.ttlalamat4 = 0
                $scope.ttlalamat5 = 0
                $scope.ttlalamat6 = 0
                $scope.ttlpendidikan1 = 0
                $scope.ttlpendidikan2 = 0
                $scope.ttlpendidikan3 = 0
                $scope.ttlpendidikan4 = 0
                $scope.ttlpendidikan5 = 0
                $scope.ttlpekerjaan1 = 0
                $scope.ttlpekerjaan2 = 0
                $scope.ttlpekerjaan3 = 0
                $scope.ttlpekerjaan4 = 0
                $scope.ttlpekerjaan5 = 0
                $scope.ttlpekerjaan6 = 0
                $scope.ttlpekerjaan7 = 0
                var tglawal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00')
                var tglakhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59')
                medifirstService.get('laporan/get-data-sensus-harian-rawat-jalan?tglawal=' + tglawal + '&tglakhir='+tglakhir ).then(function (data) {
                    var datas = data.data.data
                    for (let i = 0; i < datas.length; i++) {
                        $scope.totalpasienbaru += datas[i].br
                        $scope.totalpasienlama += datas[i].lm
                        $scope.ttljklk += datas[i].lk
                        $scope.ttljkpr += datas[i].pr
                        $scope.ttlumur1 += datas[i].umur1
                        $scope.ttlumur2 += datas[i].umur2
                        $scope.ttlumur3 += datas[i].umur3
                        $scope.ttlumur4 += datas[i].umur4
                        $scope.ttlumur5 += datas[i].umur5
                        $scope.ttlumur6 += datas[i].umur6
                        $scope.ttlagama1 += datas[i].agama1
                        $scope.ttlagama2 += datas[i].agama2
                        $scope.ttlagama3 += datas[i].agama3
                        $scope.ttlagama4 += datas[i].agama4
                        $scope.ttlagama5 += datas[i].agama5
                        $scope.ttlalamat1 += datas[i].alamat1
                        $scope.ttlalamat2 += datas[i].alamat2
                        $scope.ttlalamat3 += datas[i].alamat3
                        $scope.ttlalamat4 += datas[i].alamat4
                        $scope.ttlalamat5 += datas[i].alamat5
                        $scope.ttlalamat6 += datas[i].alamat6
                        
                        $scope.ttlpendidikan1 += datas[i].pendidikan1
                        $scope.ttlpendidikan2 += datas[i].pendidikan2
                        $scope.ttlpendidikan3 += datas[i].pendidikan3
                        $scope.ttlpendidikan4 += datas[i].pendidikan4
                        $scope.ttlpendidikan5 += datas[i].pendidikan5
                        $scope.ttlpekerjaan1 += datas[i].pekerjaan1
                        $scope.ttlpekerjaan2 += datas[i].pekerjaan2
                        $scope.ttlpekerjaan3 += datas[i].pekerjaan3
                        $scope.ttlpekerjaan4 += datas[i].pekerjaan4
                        $scope.ttlpekerjaan5 += datas[i].pekerjaan5
                        $scope.ttlpekerjaan6 += datas[i].pekerjaan6
                        $scope.ttlpekerjaan7 += datas[i].pekerjaan7
                    }
                    $scope.ttlpasien = $scope.totalpasienbaru+$scope.totalpasienlama
                    $scope.ttljk = $scope.ttljklk+$scope.ttljkpr
                    $scope.ttlumur = $scope.ttlumur1 + $scope.ttlumur2 + $scope.ttlumur3 + $scope.ttlumur4 + $scope.ttlumur5 + $scope.ttlumur6
                    $scope.ttlalamat = $scope.ttlalamat1 + $scope.ttlalamat2 + $scope.ttlalamat3 + $scope.ttlalamat4 + $scope.ttlalamat5 + $scope.ttlalamat6
                    $scope.ttlpekerjaan = $scope.ttlpekerjaan1 + $scope.ttlpekerjaan2 + $scope.ttlpekerjaan3 + $scope.ttlpekerjaan4 + $scope.ttlpekerjaan5 + $scope.ttlpekerjaan6 + $scope.ttlpekerjaan7
                    $scope.ttlagama = $scope.ttlagama1 + $scope.ttlagama2 + $scope.ttlagama3 + $scope.ttlagama4 + $scope.ttlagama5
                    $scope.ttlpendidikan = $scope.ttlpendidikan1 + $scope.ttlpendidikan2 + $scope.ttlpendidikan3 + $scope.ttlpendidikan4 + $scope.ttlpendidikan5
                    $scope.gridJumlahPasien = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: datas.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }

            $scope.opsiGridJumlahPasien = {
                toolbar: ['excel'],
                excel: {
                        fileName: "SensusHarianRawatJalan.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.mergedCells = ["A1:AI1"];
                        sheet.frozenRows = 3;
                        sheet.name = "Report";
                        var myHeaders = [{
                            value: "Laporan Sensus Harian Rawat Jalan",
                            fontSize: 20,
                            textAlign: "center",
                            background: "#ffffff",
                        }];
                        var total = {
                            value: "Total",

                        };

                        var ttlpasien = {
                            value: $scope.ttlpasien,
                            textAlign: "center",
                            colSpan: 2,

                        };

                        var ttljk = {
                            value: $scope.ttljk,
                            textAlign: "center",
                            colSpan: 2,

                        };
                        var ttlumur = {
                            value: $scope.ttlumur,
                            textAlign: "center",
                            colSpan: 6,
                        };
                        var ttlagama = {
                            value: $scope.ttlagama,
                            textAlign: "center",
                            colSpan: 5,
                        };
                        var ttlamat = {
                            value: $scope.ttlalamat,
                            textAlign: "center",
                            colSpan: 6,
                        };
                        var ttlpendidikan = {
                            value: $scope.ttlpendidikan,
                            textAlign: "center",
                            colSpan: 5,
                        };
                        var ttlpekerjaan = {
                            value: $scope.ttlpekerjaan,
                            textAlign: "center",
                            colSpan: 7,
                        };

                        var ketagama = {
                            value: "1. Islam \n2. Kristen \n3. Katholik \n4. Hindu \n5. Budha",
                            wrap: true,
                            colSpan: 3,
                            verticalAlign: "top"
                        };

                        var ketalamat = {
                            value: "1. Yogyakarta  \n2. Bantul  \n3. Kulon Progo \n4. Gunung Kidul \n5. Sleman \n6. Luar DIY",
                            wrap: true,
                            colSpan: 3,
                            verticalAlign: "top"
                        };
                        var ketpendidikan = {
                            value: "1. TS / TK \n 2. SD \n 3. SLTP \n 4. SLTA \n 5. D1 - S3 ",
                            wrap: true,
                            colSpan: 3,
                            verticalAlign: "top"
                        };
                        var ketpekerjaan = {
                            value: "1. Tani \n2. Buruh  \n3. Pegawai Negri Sipil  \n4. ABRI / POLRI  \n5. Karyawan Swasta \n 6. Tak kerja \n 7. Pelajar / Mahasiswa ",
                            wrap: true,
                            colSpan: 5,
                            verticalAlign: "top"
                        };
                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            height: 60
                        });
                        sheet.rows.splice(100, 0, {
                            cells: [total, ttlpasien, ttljk, ttlumur, ttlagama, ttlamat, ttlpendidikan, ttlpekerjaan],
                            type: "data",
                        });
                        sheet.rows.splice(106, 0, {
                            cells: [{
                                value: " "
                            }, {
                                value: "Keterangan : ",
                                colSpan: 2,
                                verticalAlign: "top",
                            }, {
                                value: "Agama :",
                                colSpan: 2,
                                verticalAlign: "top",
                            }, ketagama, {
                                value: "Alamat : ",
                                colSpan: 2,
                                verticalAlign: "top",
                            }, ketalamat, {
                                value: "Pendidikan :",
                                colSpan: 2,
                                verticalAlign: "top",
                            }, ketpendidikan, {
                                value: "Pekerjaan",
                                colSpan: 2,
                                verticalAlign: "top"
                            }, ketpekerjaan],
                            type: "data",
                            height: 150,

                        });
                        //sheet.rows.splice(30, 0, { cells: ttlpasiens, type: "data", height: 40 });

                    },
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "tgl",
                        "title": "TGL",
                        "width": "30px"
                    },
                    {
                        // "field": "tahun",
                        "title": "Jenis Pasien",
                        "columns":[
                            {
                                "field":"br",
                                "title": "Baru",
                                "width": '40px'
                            },
                            {
                                "field": "lm",
                                "title": "Lama",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Jenis Kelamin",
                        "columns": [
                            {
                                "field": "lk",
                                "title":"Lk",
                                "width": '40px'
                            },
                            {
                                "field": "pr",
                                "title": "Pr",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Umur",
                        "columns": [
                            {
                                "field": "umur1",
                                "title": "0-4",
                                "width": "40px"
                            },
                            {
                                "field": "umur2",
                                "title": "5-14",
                                "width": "40px"
                            },
                            {
                                "field": "umur3",
                                "title": "15-24",
                                "width": "40px"
                            },
                            {
                                "field": "umur4",
                                "title": "25-44",
                                "width": "40px"
                            },
                            {
                                "field": "umur5",
                                "title": "45-64",
                                "width": "40px"
                            },
                            {
                                "field": "umur6",
                                "title": ">64",
                                "width": "40px"
                            }
                        ]
                    },
                    {
                        "title": "Agama",
                        "columns": [{
                                "field": "agama1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "agama2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "agama3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "agama4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "agama5",
                                "title": "5",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Alamat",
                        "columns": [{
                                "field": "alamat1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "alamat2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "alamat3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "alamat4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "alamat5",
                                "title": "5",
                                "width": '40px'
                            },
                            {
                                "field": "alamat6",
                                "title": "6",
                                "width": '40px'
                            }
                        ]
                    },
                    {
                        "title": "Pendidikan",
                        "columns": [{
                                "field": "pendidikan1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "pendidikan5",
                                "title": "5",
                                "width": '40px'
                            },
                        ]
                    },
                    {
                        "title": "Pekerjaan",
                        "columns": [{
                                "field": "pekerjaan1",
                                "title": "1",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan2",
                                "title": "2",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan3",
                                "title": "3",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan4",
                                "title": "4",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan5",
                                "title": "5",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan6",
                                "title": "6",
                                "width": '40px'
                            },
                            {
                                "field": "pekerjaan7",
                                "title": "7",
                                "width": '40px'
                            }
                        ]
                    },
                ]
            }

        }
    ])
});