define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BundleHaisCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'ModelItem', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, ModelItem, medifirstService, ) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.visSimpan = true;
            var norecTransaksi = undefined;
            var jenisBundle = undefined;
            var norec_apd = '';
            var norec_pd = '';
            var nocm_str = '';
            var myVar = 0;
            var myVarD = 0;
            var detail = '';
            var dataIAD = [];
            var dataISK = [];
            var dataVAP = [];
            var dataIDO = [];
            var dataPHLEBITIS = [];
            var noRegistrasi = '';
            var nocm_str = '';
            LoadCacheHelper();           

            function LoadCacheHelper() {
                $scope.isRouteLoading = true; 
                $scope.item.tglInput = $scope.now;
                $scope.listPetugas = [{ id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap }];
                $scope.item.Petugas = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };           
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {                    
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    noRegistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                }
                $scope.isRouteLoading = false;
                init();
                firstLoad();           
            }

            function init() {

                // tes get laporan
                // medifirstService.get("emr/get-data-trans-bundlehais-laporan-phlebitis?norec_pd=" + norec_pd, true).then(function (dat) {
                //     console.log(dat)
                // });

                medifirstService.get("emr/get-data-trans-bundlehais?norec_pd=" + norec_pd, true).then(function (dat) {
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });                        
            }

            function loadIAD(){
                $scope.isRouteLoading = true;
                medifirstService.get('sysadmin/general/get-data-master-bundlehai-iad').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataBundle = data.data;
                    for (var i = dataBundle.length - 1; i >= 0; i--) {
                        // dataBundle[i].no = i + 1;
                        dataBundle[i].statusiya = false;
                        dataBundle[i].statustidak = false;
                    }
                    dataIAD = dataBundle;
                    $scope.dataSource1 = new kendo.data.DataSource({
                        data: dataIAD,
                        group: $scope.group,
                        pageSize: dataIAD.length,
                        total: dataIAD.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }                        
                    });
                })
            }

            function loadISK(){
                $scope.isRouteLoading = true;
                medifirstService.get('sysadmin/general/get-data-master-bundlehai?jenis=ISK').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataBundle = data.data;
                    for (var i = dataBundle.length - 1; i >= 0; i--) {
                        // dataBundle[i].no = i + 1;
                        dataBundle[i].statusiya = false;
                        dataBundle[i].statustidak = false;
                    }
                    dataISK = dataBundle;
                    $scope.dataSource2 = new kendo.data.DataSource({
                        data: dataISK,                        
                        pageSize: dataISK.length,
                        total: dataISK.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }                        
                    });
                })
            }

            function loadVAP(){
                $scope.isRouteLoading = true;
                medifirstService.get('sysadmin/general/get-data-master-bundlehai?jenis=VAP').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataBundle = data.data;
                    for (var i = dataBundle.length - 1; i >= 0; i--) {
                        // dataBundle[i].no = i + 1;
                        dataBundle[i].statusiya = false;
                        dataBundle[i].statustidak = false;
                    }
                    dataVAP = dataBundle;
                    $scope.dataSource3 = new kendo.data.DataSource({
                        data: dataVAP,                        
                        pageSize: dataVAP.length,
                        total: dataVAP.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }                        
                    });
                })
            }

            function loadIDO(){
                $scope.isRouteLoading = true;
                medifirstService.get('sysadmin/general/get-data-master-bundlehai?jenis=IDO').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataBundle = data.data;
                    for (var i = dataBundle.length - 1; i >= 0; i--) {
                        // dataBundle[i].no = i + 1;
                        dataBundle[i].statusiya = false;
                        dataBundle[i].statustidak = false;
                    }
                    dataIDO = dataBundle;
                    $scope.dataSource4 = new kendo.data.DataSource({
                        data: dataIDO,
                        group: $scope.group2,
                        pageSize: dataIDO.length,
                        total: dataIDO.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }                        
                    });
                })
            }

            function loadPHLEBITIS(){
                $scope.isRouteLoading = true;
                medifirstService.get('sysadmin/general/get-data-master-bundlehai?jenis=PHLEBITIS').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataBundle = data.data;
                    for (var i = dataBundle.length - 1; i >= 0; i--) {
                        // dataBundle[i].no = i + 1;
                        dataBundle[i].statusiya = false;
                        dataBundle[i].statustidak = false;
                    }
                    dataPHLEBITIS = dataBundle;
                    $scope.dataSource5 = new kendo.data.DataSource({
                        data: dataPHLEBITIS,                        
                        pageSize: dataPHLEBITIS.length,
                        total: dataPHLEBITIS.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }                        
                    });
                })
            }

            function firstLoad(){
                loadIAD();
                loadISK();
                loadVAP();
                loadIDO();
                loadPHLEBITIS();          
            }

            function ClearAll(){
                $scope.item.tglInput = $scope.now;
                firstLoad();
            }

            $scope.createNew = function () {
                ClearAll();
                $scope.myVar = 2    
                $scope.listPetugas = [{ id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap }];
                $scope.item.Petugas = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };                       
            }

            $scope.klikGrid = function(dataSelected){
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
            }

            $scope.Lihat = function () {
                if ($scope.dataSelected != undefined) {
                    norecTransaksi = $scope.dataSelected.norec;
                    jenisBundle = $scope.dataSelected.jenisbundle;
                    $scope.item.tglInput = moment($scope.dataSelected.tglpemeriksaan).format('YYYY-MM-DD HH:mm');
                    $scope.listPetugas = [{id: $scope.dataSelected.petugsafk, namalengkap: $scope.dataSelected.namalengkap}];
                    $scope.item.Petugas = {id: $scope.dataSelected.petugsafk, namalengkap: $scope.dataSelected.namalengkap};
                    LoadHistory();
                } else {
                    window.messageContainer.error("Data Belum Dipilih!");
                    return;
                }                
            }

            $scope.hapusData = function(){
                if ($scope.dataSelected != undefined) {
                    $scope.isRouteLoading = true;
                    $scope.visSimpan = false;

                    var objSave = {
                        norec : $scope.dataSelected.norec
                    }

                    medifirstService.post('emr/hapus-emr-bundlehai', objSave).then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.visSimpan = true;
                        init();
                    }, function (error) {
                        $scope.isRouteLoading = false;
                        $scope.visSimpan = true;
                    });

                } else {
                    window.messageContainer.error("Data Belum Dipilih!");
                    return;
                }  
            }

            function LoadHistory(){
                medifirstService.get("emr/get-data-trans-bundlehais-detail?norec=" + norecTransaksi + "&jenis=" + jenisBundle, true).then(function (dat) {
                    var datas = dat.data;
                    if (jenisBundle == "IAD") {
                        $scope.item.norecIAD = norecTransaksi;
                        $scope.myVar = 2;
                        $scope.myVarD = 0;
                        dataIAD = datas;
                        $scope.dataSource1 = new kendo.data.DataSource({
                            data: dataIAD,
                            group: $scope.group,
                            pageSize: dataIAD.length,
                            total: dataIAD.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }                        
                        });
                    }else if (jenisBundle == "ISK") {
                        $scope.item.norecISK = norecTransaksi;
                        $scope.myVar = 2;
                        $scope.myVarD = 1;
                        dataISK = datas;
                        $scope.dataSource2 = new kendo.data.DataSource({
                            data: dataISK,
                            group: $scope.group,
                            pageSize: dataISK.length,
                            total: dataISK.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }                        
                        });
                    }else if (jenisBundle == "VAP") {
                        $scope.item.norecVAP = norecTransaksi;
                        $scope.myVar = 2;
                        $scope.myVarD = 2;                        
                        dataVAP = datas;
                        $scope.dataSource3 = new kendo.data.DataSource({
                            data: dataVAP,                        
                            pageSize: dataVAP.length,
                            total: dataVAP.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }                        
                        });
                    }else if (jenisBundle == "IDO") {
                        $scope.item.norecIDO = norecTransaksi;
                        $scope.myVar = 2;
                        $scope.myVarD = 3;
                        dataIDO = datas;
                        $scope.dataSource4 = new kendo.data.DataSource({
                            data: dataIDO,
                            group: $scope.group2,
                            pageSize: dataIDO.length,
                            total: dataIDO.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }                        
                        });
                    }else if (jenisBundle == "PHLEBITIS") {
                        $scope.item.norecPHLEBITIS = norecTransaksi;
                        $scope.myVar = 2;
                        $scope.myVarD = 4;                        
                        dataPHLEBITIS = datas;
                        $scope.dataSource5 = new kendo.data.DataSource({
                            data: dataPHLEBITIS,                        
                            pageSize: dataPHLEBITIS.length,
                            total: dataPHLEBITIS.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }                        
                        });
                    }              
                })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            
            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        {
                            "field": "tglpemeriksaan",
                            "title": "Tgl Input",
                            "width": "85px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglpemeriksaan #')}}</span>"
                        },
                        {
                            "field": "notransaksi",
                            "title": "Notransaksi",
                            "width": "85px"
                        },
                        {
                            "field": "jenisbundle",
                            "title": "Jenis BundleHai",
                            "width": "120px"
                        }                        
                    ]
            };

            $scope.group = {
                field: "kelompok",
                aggregates: [
                    {
                        field: "kelompok",
                        aggregate: "count"
                    }, 
                    {
                        field: "kelompok",
                        aggregate: "count"
                    }
                ]
            };

            $scope.column1 = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        // {
                        //     "field": "no",
                        //     "title": "No",
                        //     "width": "60px",                            
                        // },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "150px"
                        },
                        {
                            "title": "Ya",
                            template: "# if (statusiya) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa1(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa1(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                        {
                            "title": "Tidak",
                            template: "# if (statustidak) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak1(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak1(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                    ]
            };

            $scope.column2 = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        // {
                        //     "field": "no",
                        //     "title": "No",
                        //     "width": "60px",                            
                        // },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "150px"
                        },
                        {
                            "title": "Ya",
                            template: "# if (statusiya) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa2(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa2(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                        {
                            "title": "Tidak",
                            template: "# if (statustidak) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak2(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak2(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                    ]
            };

            $scope.column3 = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        // {
                        //     "field": "no",
                        //     "title": "No",
                        //     "width": "60px",                            
                        // },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "150px"
                        },
                        {
                            "title": "Ya",
                            template: "# if (statusiya) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa3(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa3(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                        {
                            "title": "Tidak",
                            template: "# if (statustidak) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak3(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak3(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                    ]
            };

            $scope.group2 = {
                field: "kelompok",
                aggregates: [
                    {
                        field: "kelompok",
                        aggregate: "count"
                    }, 
                    {
                        field: "kelompok",
                        aggregate: "count"
                    }
                ]
            };

            $scope.column4 = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        // {
                        //     "field": "no",
                        //     "title": "No",
                        //     "width": "60px",                            
                        // },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "150px"
                        },
                        {
                            "title": "Ya",
                            template: "# if (statusiya) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa4(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa4(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                        {
                            "title": "Tidak",
                            template: "# if (statustidak) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak4(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak4(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                    ]
            };

            $scope.column5 = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        // {
                        //     "field": "no",
                        //     "title": "No",
                        //     "width": "60px",                            
                        // },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "150px"
                        },
                        {
                            "title": "Ya",
                            template: "# if (statusiya) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa5(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowYa5(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                        {
                            "title": "Tidak",
                            template: "# if (statustidak) { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak5(dataItem)' checked />" +
                                "# } else { #" +
                                "<input type='checkbox' class='checkbox' ng-click='selectRowTidak5(dataItem)' />" +
                                "# } #",
                            width: "50px"
                        },
                    ]
            };

            $scope.selectRowYa1 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource1._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statusiya) {
                    dataSelect.statusiya = false;
                }
                else {
                    dataSelect.statusiya = true;
                }
            }

            $scope.selectRowTidak1 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource1._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statustidak) {
                    dataSelect.statustidak = false;
                }
                else {
                    dataSelect.statustidak = true;
                }
            }

            $scope.selectRowYa2 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource2._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statusiya) {
                    dataSelect.statusiya = false;
                }
                else {
                    dataSelect.statusiya = true;
                }
            }

            $scope.selectRowTidak2 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource2._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statustidak) {
                    dataSelect.statustidak = false;
                }
                else {
                    dataSelect.statustidak = true;
                }
            }

            $scope.selectRowYa3 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource3._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statusiya) {
                    dataSelect.statusiya = false;
                }
                else {
                    dataSelect.statusiya = true;
                }
            }

            $scope.selectRowTidak3 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource3._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statustidak) {
                    dataSelect.statustidak = false;
                }
                else {
                    dataSelect.statustidak = true;
                }
            }

            $scope.selectRowYa4 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource4._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statusiya) {
                    dataSelect.statusiya = false;
                }
                else {
                    dataSelect.statusiya = true;
                }
            }

            $scope.selectRowTidak4 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource4._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statustidak) {
                    dataSelect.statustidak = false;
                }
                else {
                    dataSelect.statustidak = true;
                }
            }

            $scope.selectRowYa5 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource5._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statusiya) {
                    dataSelect.statusiya = false;
                }
                else {
                    dataSelect.statusiya = true;
                }
            }

            $scope.selectRowTidak5 = function (dataItem) {
                var dataSelect = _.find($scope.dataSource5._data, function (data) {
                    return data.idbundle == dataItem.idbundle;
                });
                if (dataSelect.statustidak) {
                    dataSelect.statustidak = false;
                }
                else {
                    dataSelect.statustidak = true;
                }
            }

            $scope.BatalIAD = function(){
                $scope.item.norecIAD = undefined;
                loadIAD();
            }

            $scope.SimpanIAD = function(){
                $scope.isRouteLoading = true;
                $scope.visSimpan = false;
                var objSave = {
                    norec : $scope.item.norecIAD != undefined ? $scope.item.norecIAD : "",
                    tanggal : moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    petugas : $scope.item.Petugas.id,
                    norec_pd : norec_pd,
                    norec_apd : norec_apd,
                    jenis : "IAD",
                    detail : $scope.dataSource1._data
                }
                medifirstService.post('emr/save-emr-bundlehai', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                    init();
                }, function (error) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                });
            }

            $scope.BatalISK = function(){
                $scope.item.norecISK = undefined;
                loadISK();
            }

            $scope.SimpanISK = function(){
                $scope.isRouteLoading = true;
                $scope.visSimpan = false;
                var objSave = {
                    norec : $scope.item.norecISK != undefined ? $scope.item.norecISK : "",
                    tanggal : moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    petugas : $scope.item.Petugas.id,
                    norec_pd : norec_pd,
                    norec_apd : norec_apd,
                    jenis : "ISK",
                    detail : $scope.dataSource2._data
                }
                medifirstService.post('emr/save-emr-bundlehai', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                    init();
                }, function (error) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                });
            }

            $scope.BatalVAP = function(){
                $scope.item.norecVAP = undefined;
                loadVAP();
            }

            $scope.SimpanVAP = function(){
                $scope.isRouteLoading = true;
                $scope.visSimpan = false;
                var objSave = {
                    norec : $scope.item.norecVAP != undefined ? $scope.item.norecVAP : "",
                    tanggal : moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    petugas : $scope.item.Petugas.id,
                    norec_pd : norec_pd,
                    norec_apd : norec_apd,
                    jenis : "VAP",
                    detail : $scope.dataSource3._data
                }
                medifirstService.post('emr/save-emr-bundlehai', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                    init();
                }, function (error) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                });
            }

            $scope.BatalIDO = function(){
                $scope.item.norecIDO = undefined;
                loadIDO();
            }

            $scope.SimpanIDO = function(){
                $scope.isRouteLoading = true;
                $scope.visSimpan = false;
                var objSave = {
                    norec : $scope.item.norecIDO != undefined ? $scope.item.norecIDO : "",
                    tanggal : moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    petugas : $scope.item.Petugas.id,
                    norec_pd : norec_pd,
                    norec_apd : norec_apd,
                    jenis : "IDO",
                    detail : $scope.dataSource4._data
                }
                medifirstService.post('emr/save-emr-bundlehai', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                    init();
                }, function (error) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                });
            }

            $scope.BatalPHLEBITIS = function(){
                $scope.item.norecPHLEBITIS = undefined;
                loadPHLEBITIS();
            }

            $scope.SimpanPHLEBITIS = function(){
                $scope.isRouteLoading = true;
                $scope.visSimpan = false;
                var objSave = {
                    norec : $scope.item.norecPHLEBITIS != undefined ? $scope.item.norecPHLEBITIS : "",
                    tanggal : moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    petugas : $scope.item.Petugas.id,
                    norec_pd : norec_pd,
                    norec_apd : norec_apd,
                    jenis : "PHLEBITIS",
                    detail : $scope.dataSource5._data
                }
                medifirstService.post('emr/save-emr-bundlehai', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                    init();
                }, function (error) {
                    $scope.isRouteLoading = false;
                    $scope.visSimpan = true;
                });
            }

            //** Batas */
        }
    ]);
});