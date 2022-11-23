define(['initialize'], function (initialize) {
'use strict';
    initialize.controller('LaporanTop10DiagnosisCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService', 
        function (cacheHelper, $scope, dateHelper, medifirstService) {
            FormLoad();   
            function FormLoad(){
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

            function LoadCombo(){
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                    
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;                                    
                });

                // $scope.listDepartemen = [
                //     { id: 1, departemen: "Instalasi Rawat Jalan" },
                //     { id: 2, departemen: "Instalasi Rawat Inap"}
                // ];

                medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					$scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDepartemen = data.data.deptrirj
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-icd10", true, true, 10).then(function(data) {
                     $scope.listDiagnosa = data;
                }); 
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan                
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
                var tempjenispasien = ""
                if ($scope.item.jenispasien != undefined) {
                    tempjenispasien = "&idjenispasien=" + $scope.item.jenispasien.id;
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
                medifirstService.get("registrasi/laporan/get-laporan-topten-diagnosa?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempCaraBayarId + tempRuanganId + tempjenispasien).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;                       
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {                                
                            }
                        }
                    });
                })

                medifirstService.get("registrasi/laporan/get-laporan-topten-diagnosa-9?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempCaraBayarId + tempRuanganId).then(function (data) {
                    $scope.isRouteLoading = false;                                    
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;                       
                    }
                    $scope.sourceLaporan9 = new kendo.data.DataSource({                            
                        data: datas,
                        group: $scope.group,
                        pageSize: 100,                       
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {                                
                            }
                        }
                    });
                })
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            $scope.listJenisPasien = [{
                    id: 1,
                    jenispasien: 'Jiwa'
                },
                {
                    id: 2,
                    jenispasien: 'Non Jiwa'
                },
            ]
            $scope.columnLaporan = {
                toolbar: [
                    "excel", 
                ],
                excel: { fileName: "LaporanDiagnosaPasienTop10.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Data 10 Besar Data Penyakit Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [  

                    { field: "no", title: "No", width: "20px" },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "200px",
                    },
                    {
                        field: "kddiagnosa",
                        title: "ICD X",
                        width: "55px",
                    },
                    {
                        field: "kasusbarulk",
                        title: "Kasus Baru Laki-Laki",
                        width: "50px"
                    },
                    {
                        field: "kasusbarup",
                        title: "Kasus Baru Perempuan",
                        width: "50px"
                    },
                    {
                        field: "kasus45",
                        title: "Kasus(4+5)",
                        width: "50px"
                    },                   
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "50px"
                    }              
                ] 
            }

            $scope.columnLaporan9 = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanDiagnosaPasienICDIX.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Pasien ICD IX",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [  

                    { field: "no", title: "No", width: "20px" },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "200px",
                    },
                    {
                        field: "kddiagnosa",
                        title: "ICD IX",
                        width: "55px",
                    },                   
                    {
                        field: "jumlah",
                        title: "Jumlah",
                        width: "50px"
                    }              
                ] 
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});