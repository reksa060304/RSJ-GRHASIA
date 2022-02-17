define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKegiatanPelayananResepCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                    $scope.listRajalRanap = [
                        { id: 1, names: "Rawat Jalan" },
                        { id: 2, names: "Rawat Inap"}
                    ];
                    // init();
                });
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');

                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kp = "&kpid=" + $scope.item.kelompokPasien.id
                }

                var rajalRanap = "";
                if ($scope.item.rajalRanap != undefined) {
                    rajalRanap = $scope.item.rajalRanap.id
                }

                medifirstService.get("farmasi/get-laporan-kegiatan-pelayanan-resep?" +
                    "tglAwal=" + tglAwal + kp + rajalRanap
                    , true).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.detail;

                        if(datas.length === 1){
                            datas.length = 2;
                            datas[1]={};
                            datas[1].jumlahtotalrkedecember = 0;
                            datas[1].jumlahtotalrkeapril = 0;
                            datas[1].jumlahtotalrkeaugust = 0;
                            datas[1].jumlahtotalrkefebruary = 0;
                            datas[1].jumlahtotalrkejanuary = 0;
                            datas[1].jumlahtotalrkejuly = 0;
                            datas[1].jumlahtotalrkejune = 0;
                            datas[1].jumlahtotalrkemarch = 0;
                            datas[1].jumlahtotalrkemay = 0;
                            datas[1].jumlahtotalrkenovember = 0;
                            datas[1].jumlahtotalrkeoctober = 0;
                            datas[1].jumlahtotalrkeseptember = 0;
                            datas[1].jumlahtotalresepdecember = 0;
                            datas[1].jumlahtotalresepapril = 0;
                            datas[1].jumlahtotalresepaugust = 0;
                            datas[1].jumlahtotalresepfebruary = 0;
                            datas[1].jumlahtotalresepjanuary = 0;
                            datas[1].jumlahtotalresepjuly = 0;
                            datas[1].jumlahtotalresepjune = 0;
                            datas[1].jumlahtotalresepmarch = 0;
                            datas[1].jumlahtotalresepmay = 0;
                            datas[1].jumlahtotalresepnovember = 0;
                            datas[1].jumlahtotalresepoctober = 0;
                            datas[1].jumlahtotalresepseptember = 0;
                            datas[1].totalresep = 0;
                            datas[1].totalrke = 0;
                        }
                        
                        for (var i = 0; i < datas.length; i++) {
                            datas[0].kategori = 'R/';
                            datas[1].kategori = 'Lembar';
                            datas[0].no = '1';
                            datas[1].no = '2';
                            if(datas[i].jumlahtotalrkejanuary != 0){
                                datas[0].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalrkejanuary;
                            }
                            if(datas[i].jumlahtotalrkefebruary != 0){
                                datas[0].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalrkefebruary;
                            }
                            if(datas[i].jumlahtotalresepjanuary != 0){
                                datas[1].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalresepjanuary;
                            }
                            if(datas[i].jumlahtotalresepfebruary != 0){
                                datas[1].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalresepfebruary;
                            }
                            if(datas[i].jumlahtotalrkemarch != 0){
                                datas[0].jumlahtotalrkemarchfix = datas[i].jumlahtotalrkemarch;
                            }
                            if(datas[i].jumlahtotalresepmarch != 0){
                                datas[1].jumlahtotalrkemarchfix = datas[i].jumlahtotalresepmarch;
                            }
                            if(datas[i].jumlahtotalrkeapril != 0){
                                datas[0].jumlahtotalrkeaprilfix = datas[i].jumlahtotalrkeapril;
                            }
                            if(datas[i].jumlahtotalresepapril != 0){
                                datas[1].jumlahtotalrkeaprilfix = datas[i].jumlahtotalresepapril;
                            }
                            if(datas[i].jumlahtotalrkemay != 0){
                                datas[0].jumlahtotalrkemayfix = datas[i].jumlahtotalrkemay;
                            }
                            if(datas[i].jumlahtotalresepmay != 0){
                                datas[1].jumlahtotalrkemayfix = datas[i].jumlahtotalresepmay;
                            }
                            if(datas[i].jumlahtotalrkejune != 0){
                                datas[0].jumlahtotalrkejunefix = datas[i].jumlahtotalrkejune;
                            }
                            if(datas[i].jumlahtotalresepjune != 0){
                                datas[1].jumlahtotalrkejunefix = datas[i].jumlahtotalresepjune;
                            }
                            if(datas[i].jumlahtotalrkejuly != 0){
                                datas[0].jumlahtotalrkejulyfix = datas[i].jumlahtotalrkejuly;
                            }
                            if(datas[i].jumlahtotalresepjuly != 0){
                                datas[1].jumlahtotalrkejulyfix = datas[i].jumlahtotalresepjuly;
                            }
                            if(datas[i].jumlahtotalrkeaugust != 0){
                                datas[0].jumlahtotalrkeaugustfix = datas[i].jumlahtotalrkeaugust;
                            }
                            if(datas[i].jumlahtotalresepaugust != 0){
                                datas[1].jumlahtotalrkeaugustfix = datas[i].jumlahtotalresepaugust;
                            }
                            if(datas[i].jumlahtotalrkeseptember != 0){
                                datas[0].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalrkeseptember;
                            }
                            if(datas[i].jumlahtotalresepseptember != 0){
                                datas[1].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalresepseptember;
                            }
                            if(datas[i].jumlahtotalrkeoctober != 0){
                                datas[0].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalrkeoctober;
                            }
                            if(datas[i].jumlahtotalresepoctober != 0){
                                datas[1].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalresepoctober;
                            }
                            if(datas[i].jumlahtotalrkenovember != 0){
                                datas[0].jumlahtotalrkenovemberfix = datas[i].jumlahtotalrkenovember;
                            }
                            if(datas[i].jumlahtotalresepnovember != 0){
                                datas[1].jumlahtotalrkenovemberfix = datas[i].jumlahtotalresepnovember;
                            }
                            if(datas[i].jumlahtotalrkedecember != 0){
                                datas[0].jumlahtotalrkedecemberfix = datas[i].jumlahtotalrkedecember;
                            }
                            if(datas[i].jumlahtotalresepdecember != 0){
                                datas[1].jumlahtotalrkedecemberfix = datas[i].jumlahtotalresepdecember;
                            }
                            
                            datas[0].total = datas[datas.length-1].totalrke;
                            datas[1].total = datas[datas.length-1].totalresep;
                        }

                        if(datas.length == 2){
                            datas[0].total = datas[0].totalrke;
                            datas[1].total = datas[0].totalresep;
                        }

                        datas.length = 2;
                        
                        console.log(datas.length);

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });                                             
                    });
            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.kelompokPasien = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            };

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanKegiatanPelayananResep.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:O1"];
                    sheet.name = "Report";
                    sheet.layout = "Landscape";

                    var myHeaders = [{
                        value: "LAPORAN KEGIATAN PELAYANAN RESEP",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 25 });

                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                    },
                    {
                        "field": "kategori",
                        "title": "Kategori",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahtotalrkejanuaryfix",
                        "title": "Januari",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkefebruaryfix",
                        "title": "Februari",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkemarchfix",
                        "title": "Maret",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkeaprilfix",
                        "title": "April",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkemayfix",
                        "title": "Mei",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkejunefix",
                        "title": "Juni",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkejulyfix",
                        "title": "Juli",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkeaugustfix",
                        "title": "Agustus",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkeseptemberfix",
                        "title": "September",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkeoctoberfix",
                        "title": "Oktober",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkenovemberfix",
                        "title": "November",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahtotalrkedecemberfix",
                        "title": "Desember",
                        "width": "120px",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "120px",
                    }
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});