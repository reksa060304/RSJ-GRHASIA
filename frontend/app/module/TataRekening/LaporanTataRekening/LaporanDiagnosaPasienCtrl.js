define(['initialize'], function (initialize) {
'use strict';
    initialize.controller('LaporanDiagnosaPasienCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
        function (cacheHelper, $scope, dateHelper, medifirstService) {

            FormLoad();   
            function FormLoad(){
                
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                $scope.date = new Date();
                $scope.dataSelected = {};
                $scope.item = {}; 
                LoadCombo();
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }
            
            function LoadCombo(){
                $scope.StatusPasien = [{
                    "id": 1,
                    'statuspasien': 'LAMA',
                }, {
                    "id": 2,
                    'statuspasien': 'BARU',
                }]
                $scope.listDepartemen = [{
                        "id": 1,
                        "departemen": 'Rawat Inap'
                    },
                    {
                        "id": 2,
                        "departemen": 'Rawat Jalan'
                    },
                ]
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                    
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                });
                
                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                }); 
            }
            
            
            $scope.getIsiComboRuangan = function () {
                var getruangan = "";
                if ($scope.item.departement.id != undefined) {
                    getruangan = "getruangan=" + $scope.item.departement.id;
                }
                medifirstService.get("tatarekening/get-data-combo-daftarregpasienruangan?" + getruangan).then(function (dat) {
                    
                    $scope.listRuangan = dat.data.ruangan;

                });

            }
                              
            $scope.SearchData = function () {            
                LoadDataGrid()             
            }

            $scope.ClearData = function (){
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            function LoadDataGrid() {                 
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;            

                var tempDepartemenId = "";              
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
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
                var tempstatusPasien = ""
                if ($scope.item.StatuspasieN != undefined) {
                    tempstatusPasien = "&statusPasien=" + $scope.item.StatuspasieN.statuspasien;
                }                                                        
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',                        
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                
                medifirstService.get("tatarekening/get-data-diagnosa-perpasien?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempDepartemenId +
                    tempRuanganId +
                    tempJenisDiagnosa +
                    tempDiagnosa +
                    tempstatusPasien
                ).then(function (data) {
            $scope.departemens = $scope.item.departement.departemen;

                    $scope.isRouteLoading = false;
                    var dataa = data.data.data;
                    for (var i = 0; i < dataa.length; i++) {
                        dataa[i].no = i + 1;
                    }
                    $scope.dataSourceGridDiagnosapasien = new kendo.data.DataSource({
                        data: dataa,
                        pageSize: 50,
                        total: dataa.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                
                            }
                        },

                    });


                });

                
                medifirstService.get("tatarekening/get-data-diagnosa-pasien?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempstatusPasien).then(function (data) {
                        

                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                       
                         datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '                        
                    }
                    for (let i = 0; i < data.data.count.length; i++) {
                         $scope.a = data.data.count[i].a;
                         $scope.b = data.data.count[i].b;
                            $scope.c = data.data.count[i].c;
                            $scope.d = data.data.count[i].d;
                            $scope.e = data.data.count[i].e;
                            $scope.f = data.data.count[i].f;
                    }
                    
                    
                    $scope.sourceLaporan = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                        
                        aggregate: [{
                            field: "jenisdiagnosa",
                            aggregate: "count"
                        }],
                        

                    });
                })
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }

            $scope.columnLaporan = {
                toolbar: ["excel",],
                excel: { fileName: "LaporanDiagnosaPasien.xlsx", allPages: true, },
                excelExport: function (e) {
                    var departemens = "";
                    if ($scope.item.departement != undefined) {
                        departemens = $scope.item.departement.departemen;
                    } 
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Data Indeks Penyakit " + departemens,
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });

                    var jenisdiagnosa = [{
                        value: "Jenis Diagnosa",
                        fontSize: 11,
                        background: "#ffffff",
                    }]

                    sheet.rows.splice(2999, 0, {
                        cells: jenisdiagnosa,
                        type: "header",
                        height: 30
                    });

                    var a = [{
                        value: " Primary / Utama : " + $scope.a,
                    }]
                    sheet.rows.splice(3000,0, {
                        cells: a,
                        type: "header",
                        height: 20 
                    })
                    var b = [{
                        value: " Secondary : " + $scope.b,
                    }]
                    sheet.rows.splice(3001, 0, {
                        cells: b,
                        type: "header",
                        height: 20
                    })
                    var c = [{
                        value: " Diagnosa Pra Bedah : " + $scope.c,
                    }]
                    sheet.rows.splice(3002, 0, {
                        cells: c,
                        type: "header",
                        height: 20
                    })
                    var d = [{
                        value: " Diagnosa Pasca Bedah : " + $scope.d,
                    }]
                    sheet.rows.splice(3003, 0, {
                        cells: d,
                        type: "header",
                        height: 20
                    })
                    var e = [{
                        value: " Diagnosa Awal : " + $scope.e,
                    }]
                    sheet.rows.splice(3004, 0, {
                        cells: e,
                        type: "header",
                        height: 20
                    })
                    var f = [{
                        value: " - : " + $scope.f,
                    }]
                    sheet.rows.splice(3005, 0, {
                        cells: f,
                        type: "header",
                        height: 20
                    })
                    
                },
                groupable: true,
                filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
                // dataBound: function (e) {
                //     $('.k-pager-wrap').append('<span style="padding-left: 50px; color:red; font-weight:bold;"> Hello world </span>');
                // },
                selectable: "row",
                columns: [  
                    {
                        field: "no",
                        title: "No",
                        width: "40px",
                    },
                    {
                        field: "nocm",
                        title: "No RM",
                        width: "100px",
                    },
                    {
                        field: "jenisdiagnosa",
                        title: "Jenis Diagnosa",
                        width: "100px",
                        aggregates: ["count"], footerTemplate: "Total Diagnosa: #=count#",                     },
                    {
                        field: "kddiagnosa",
                        title: "ICD-X",
                        width: "50px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "150px"
                    },
                    {
                        field: "ttl",
                        title: "Tempat Tgl Lahir",
                        width: "105px",
                    },
                    {
                        field: "jeniskelamin",
                        title: "JK",
                        width: "40px",

                    },  
                    {
                        field: "umurs",
                        title: "Umur",
                        width: "50px",
                    },
                    {
                        field: "pendidikan",
                        title: "Pendidikan",
                        width: "80px",
                    },
                    {
                        field: "alamatlengkap",
                        title: "Alamat",
                        width: "150px"
                    }
                ],
                
                    
            }




            $scope.columnGridDiagnosapasien = {
                toolbar: ["excel",],
                excel: { fileName: "Laporan Diagnosa Per-Pasien.xlsx", allPages: true, },
                excelExport: function (e) {
                    var departemenss
                    if ($scope.item.departement != undefined) {
                        departemenss = $scope.item.departement.departemen;
                    }
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Per-pasien " + departemenss,
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                groupable: false,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px",
                    },
                    {
                        field: "kddiagnosa",
                        title: "Kode",
                        width: "40px",
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "570px",
                    },
                    {
                        field: "count",
                        title: "Jumlah",
                        width: "50px",
                    },
                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});