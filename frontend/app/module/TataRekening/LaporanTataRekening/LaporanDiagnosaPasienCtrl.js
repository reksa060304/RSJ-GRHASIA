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
                // $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                // $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                    
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;
                });
                
                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function(data) {
                    $scope.listDiagnosa = data;
                }); 
                
            }
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

            
            // $scope.getIsiComboRuangan = function () {
            //     var getruangan = "";
            //     if ($scope.item.departemen.id != undefined) {
            //         getruangan = "getruangan=" + $scope.item.departemen.id;
            //     }
            //     medifirstService.get("tatarekening/get-data-combo-daftarregpasienruangan?" + getruangan).then(function (dat) {
                    
            //         $scope.listRuangan = dat.data.ruangan;
            //         console.log($scope.listRuangan)

            //     });

            // }
                              
            $scope.SearchData = function () {            
                LoadDataGrid()             
            }
            $scope.tanggalmasuk = function (data) {
                
                if (data == true) {
                    document.getElementById("tglmasukawal").disabled = false;
                    document.getElementById("tglmasukakhir").disabled = false;

                } else if(data == false){
                    document.getElementById("tglmasukawal").disabled = true;
                    document.getElementById("tglmasukakhir").disabled = true;
                    $scope.item.tglawalmasuk = undefined;
                    $scope.item.tglakhirmasuk = undefined;
                }
            }

            $scope.tanggalpulang = function (data) {
                
                if (data == true) {
                    document.getElementById("tglpulgawal").disabled = false;
                    document.getElementById("tglpulgakhir").disabled = false;
                    $scope.tanggalmasuk.checked = false;
                } else if(data == false){
                    document.getElementById("tglpulgawal").disabled = true;
                    document.getElementById("tglpulgakhir").disabled = true;
                    $scope.item.tglawal = undefined;
                    $scope.item.tglakhir = undefined;
                    
                }
            }
            $scope.ClearData = function (){
                $scope.item.ruangan = undefined;
                $scope.item.departement = undefined
                $scope.item.tglawal = undefined;
                $scope.item.tglakhir = undefined;
                $scope.item.tglawalmasuk = undefined;
                $scope.item.tglakhirmasuk = undefined;
            }

            function LoadDataGrid() {                 
                $scope.isRouteLoading = true;
               
                var tglAwal = "";
                if($scope.item.tglawal != undefined){
                tglAwal = "tglAwal=" + moment($scope.item.tglawal).format('YYYY-MM-DD');
                }
                var tglAkhir = "";
                if($scope.item.tglakhir != undefined){
                var tglAkhir = "&tglAkhir=" + moment($scope.item.tglakhir).format('YYYY-MM-DD');;
                }
                var tglAwalmasuk = "";
                if ($scope.item.tglawalmasuk != undefined) {
                    var tglAwalmasuk = "tglAwalmasuk=" + moment($scope.item.tglawalmasuk).format('YYYY-MM-DD');
                }
                var tglAkhirmasuk = "";
                if ($scope.item.tglakhirmasuk != undefined) {
                    var tglAkhirmasuk = "&tglAkhirmasuk=" + moment($scope.item.tglakhirmasuk).format('YYYY-MM-DD');;
                }
                
                switch ((tglAwal || tglAwalmasuk) && (tglAkhir || tglAkhirmasuk)) {
                    case "":
                    messageContainer.error("Input Tanggal dulu!")
                        break;
                }
                
                // if($scope.item.tglawal == undefined && $scope.item.tglakhir == undefined){
                //     messageContainer.error("Pilih tanggal dulu!")
                    
                // } 
                // if($scope.item.tglawalmasuk == undefined && $scope.item.tglakhirmasuk == undefined){
                //     messageContainer.error("Pilih tanggal dulu!")
                    
                // }
                var tempDepartemenId = "";              
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var dep = "";
                if ($scope.item.departemen != undefined) {
                    dep = "&dep=" + $scope.item.departemen.id;
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
                var tempkodeawal = "";
                if ($scope.item.kodeawal != undefined) {
                    tempkodeawal = "&kodeawal=" + $scope.item.kodeawal;
                }
                var chacePeriode = {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',                        
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                
                medifirstService.get("tatarekening/get-data-diagnosa-pasienjiwa?" 
                +tglAwal
                    +
                    tglAkhir +
                    tglAwalmasuk +
                    tglAkhirmasuk +
                tempDepartemenId + tempRuanganId +
                tempJenisDiagnosa + tempDiagnosa + 
                tempstatusPasien).then(function (data) {
                    var data2 = data.data.data;
                    $scope.isRouteLoading = false;
                    
                    for (var i = 0; i < data2.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSourceGridDiagnosapasienjiwa = new kendo.data.DataSource({
                        data: data2,
                        pageSize: 100,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                        aggregate: [
                            {
                                field: "lk",
                                aggregate: "sum"
                            },
                            {
                                field: "pr",
                                aggregate: "sum"
                            }
                        ]
                    });
                    
                });

                medifirstService.get("tatarekening/get-data-diagnosa-perpasien?" 
                    +tglAwal
                        +
                        tglAkhir +
                        tglAwalmasuk +
                        tglAkhirmasuk +
                    tempDepartemenId +
                    tempRuanganId +
                    tempJenisDiagnosa +
                    tempDiagnosa +
                    tempstatusPasien  
                ).then(function (data) {
            // $scope.departemens = $scope.item.departement.departemen;

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
                        },aggregate: [
                            {
                                field: "count",
                                aggregate: "sum"
                            }  
                        ]

                    });


                });

                
                medifirstService.get("tatarekening/get-data-diagnosa-pasien?"
                    + tglAwal
                    + tglAkhir
                    +tglAwalmasuk
                    +tglAkhirmasuk
                    +tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa + tempstatusPasien + tempkodeawal+dep).then(function (data) {
                        

                    $scope.isRouteLoading = false;                                    
                    var datas = data.data.data;
                    // var counts = data.data.count
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                       
                         datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '                        
                    }
                    // for (let i = 0; i < data.data.count.length; i++) {
                    //      $scope.a = data.data.count[i].a;
                    //      $scope.b = data.data.count[i].b;
                    //         $scope.c = data.data.count[i].c;
                    //         $scope.d = data.data.count[i].d;
                    //         $scope.e = data.data.count[i].e;
                    //         $scope.f = data.data.count[i].f;
                    // }
                    
                    
                    $scope.sourceLaporan = new kendo.data.DataSource({                            
                        data: data.data.data,
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
                excel: { fileName: "Laporan Data Indeks Penyakit.xlsx", allPages: true, },
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

                    
                    
                },
                filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
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
                        field: "tglmasuk",
                        title: "Tgl Masuk",
                        width: "100px"
                    },
                    {
                        field: "tglkeluar",
                        title: "Tgl Keluar",
                        width: "100px"

                    },
                    {
                        field: "lamahari",
                        title: "LOS",
                        width: "50px",
                        template: "#= lamahari == 0 ? ' ' : lamahari # "
                    },
                    {
                        field: "nocm",
                        title: "No RM",
                        width: "70px",
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
                        width: "35px",
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
                    var departemenss = "";
                    if ($scope.item.departement != undefined) {
                        departemenss = $scope.item.departement.departemen;
                    }
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:D1"];
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
                        footerTemplate: "TOTAL: "
                    },
                    {
                        field: "count",
                        title: "Jumlah",
                        width: "50px",
                        aggregates: ["sum"],
                        template: "#: count  #",
                        footerTemplate: "#: data.count.sum #",
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

            $scope.columnGridDiagnosapasienjiwa = {
                toolbar: ["excel",],
                excel: { fileName: "Laporan Diagnosa Pasien Jiwa.xlsx", allPages: true, },
                excelExport: function (e) {
                    var departemenss = "";
                    if ($scope.item.departement != undefined) {
                        departemenss = $scope.item.departement.departemen;
                    }
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:E1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Pasien Jiwa " + departemenss,
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
                filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
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
                        footerTemplate: "TOTAL: "
                    },
                    {
                        // field: "count",
                        title: "Jumlah Pasien Jiwa",
                        width: "50px",
                        columns: [{
                            field: "lk",
                            title: "Laki-Laki",
                            width: "50px",
                            aggregates: ["sum"],
                            template: "#: lk  #",
                            footerTemplate: "#: data.lk.sum #",
                        },
                        {
                            field: "pr",
                            title: "Perempuan",
                            width: "50px",
                            aggregates: ["sum"],
                            template: "#: pr  #",
                            footerTemplate: "#: data.pr.sum #",
                        },
                        ]
                    }
                ]

            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});