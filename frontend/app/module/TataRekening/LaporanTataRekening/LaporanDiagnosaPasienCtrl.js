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
                $scope.item.tglawal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", true).then(function (dat) {                                    
                    $scope.listDepartemen = dat.data.departemen; 
                    $scope.listJenisDiagnosa = dat.data.jenisdiagnosa;                                    
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

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',                        
                }
                cacheHelper.set('LaporanDiagnosaPasienCtrl', chacePeriode);
                medifirstService.get("tatarekening/get-data-diagnosa-pasien?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId + tempRuanganId + tempJenisDiagnosa + tempDiagnosa).then(function (data) {
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
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "LaporanDiagnosaPasien.xlsx", allPages: true, },
                // pdf: { fileName: "RekapPembayaranJasaPelayanan.pdf", allPages: true, },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Pasien",
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

                    { field: "no", title: "No", width: "45px" },
                    {
                        field: "tglregistrasi",
                        title: "Tgl Registrasi",
                        width: "105px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglregistrasi",
                        title: "Jam Registrasi",
                        width: "105px",
                        template: "<span class='style-left'>{{formatJam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        field: "tglpulang",
                        title: "Tgl Pulang",
                        width: "105px",
                        template: "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },  
                    {
                        field: "tglpulang",
                        title: "Jam Pulang",
                        width: "105px",
                        template: "<span class='style-left'>{{formatJam('#: tglpulang #')}}</span>"
                    },                   
                    {
                        field: "nocm",
                        title: "No Rekam Medis",
                        width: "100px"
                    },
                    {
                        field: "noregistrasi",
                        title: "Noregistrasi",
                        width: "105px"
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: "150px"                    
                    },
                    {
                        field: "jeniskelamin",
                        title: "JK",
                        width: "50px"
                    },
                    {
                        field: "umur",
                        title: "Umur",
                        width: "100px"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruang Rawat",
                        width: "140px"                        
                    },
                    {
                        field: "namadokter",
                        title: "Dokter",
                        width: "150px"                    
                    },
                    {
                        field: "jenisdiagnosa",
                        title: "Jenis Diagnosa",
                        width: "100px"                    
                    },
                    {
                        field: "namadiagnosa",
                        title: "Diagnosa",
                        width: "150px"                    
                    },
                    {
                        field: "statuskeluar",
                        title: "Status Keluar",
                        width: "150px"                    
                    },
                    {
                        field: "statuspulang",
                        title: "Status Pulang",
                        width: "150px"                    
                    },
                    {
                        field: "alamatlengkap",
                        title: "Alamat",
                        width: "150px"
                    },
                    {
                        field: "notelepon",
                        title: "No Telepon",
                        width: "100px"
                    }                 
                ] 
            }
////////////////////////////////////////////////////////    END     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});