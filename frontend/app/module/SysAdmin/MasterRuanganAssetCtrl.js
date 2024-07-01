define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganAssetCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout','ModelItem', '$mdDialog',
        function ($scope, $state, cacheHelper, medifirstService, $timeout, ModelItem, $mdDialog) {
            $scope.item = {};
            $scope.itemRuangan = {}
            $scope.itemKamar = {}
            $scope.itemTempatTidur = {}
            $scope.itemRiwayatKamar = {}
            $scope.now = new Date();
            $scope.item.jumlahRows = 50;
            $scope.item.jenisProdukDetail = [];
            $scope.idRuangan = "";
            $scope.idGedung = "";
            $scope.idLantai = "";
            $scope.idKamar = "";
            $scope.idTempatTidur = "";
            $scope.idRiwayatKamar = "";
            // loadCombo()
            // loadData()
            function loadCombo(){
                $scope.listStatus = [{id:true,status:'True'},{id:false,status:'False'}];
                medifirstService.get('sysadmin/master/get-combo-master').then(function(data){
                    var datas = data.data
                    $scope.listDepartemen = datas.departemen
                    $scope.listRuangan = datas.ruangan
                    $scope.listRuanganKamar = datas.ruangantrue
                    $scope.listKelas = datas.kelas
                    $scope.listKamar = datas.kamarall
                    $scope.cacheRuangan = datas.ruangan
                    $scope.listRuanganAset = datas.ruanganaset
                    $scope.listGedungAset = datas.gedungaset
                    $scope.listLantaiAset = datas.lantai
                })
            }
            $scope.onTabChanges = function (e) {
                if (e == 1) {
                    loadDataGedung()
                } else if (e == 2) {
                    loadDataLantai()
                } else {
                    loadData()
                }
            }

            $scope.cariFilter = function(){
                loadData()
            }
            $scope.cariFilterGedung = function(){
                loadDataGedung()
            }
            function loadData() {
                loadCombo()
                var status = undefined;
                if ($scope.item.Status != undefined){
                    status = "status="+ $scope.item.Status.id
                } else if ($scope.item.Status == undefined){
                    status = "status=" + true
                }
                

                var gedung = ''
                if($scope.item.ruanganGedung != undefined){
                    gedung = "&gedung="+ $scope.item.ruanganGedung.id
                }
                var lantai = ''
                if($scope.item.ruanganLantai != undefined){
                    lantai = "&lantai="+ $scope.item.ruanganLantai.id
                }

                var ruangan = ""
				if ($scope.item.namaRuangan != undefined) {
					var ruangan = "&ruangan=" + $scope.item.namaRuangan
				}


                medifirstService.get('sysadmin/master/get-data-ruangan-aset?' + status + gedung + lantai + ruangan).then(function (data) {
                    var datas  = data.data
                    for (var i = 0; i < datas.ruangan.length; i++) {
                        datas.ruangan[i].no = i + 1
                    }

                    $scope.dataRuangan = new kendo.data.DataSource({
                        data: datas.ruangan,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                }
                            },
                        },
                        pageSize: 20,
                    });
                })
               
               
            
            }
            //UNTUK TAB RUANGAN
            $scope.columnRuangan = {
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                  
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namagedung",
                        title: "Nama Gedung",
                        width: "100px"
                    },
                    {
                        field: "lantai",
                        title: "Lantai",
                        width: "100px"
                    },
                    {
                        field: "namaruangan",
                        title: "Nama Ruangan",
                        width: "100px"
                    },
                    {
                        "command": [{
                                text: "Enable",
                                click: enableDataRuangan,
                                imageClass: "k-icon k-i-pencil",
                                className: "btn-enabled",
                            },
                            {
                                text: "Disable",
                                click: disableDataRuangan,
                                imageClass: "k-icon k-delete",
                                className: "btn-disabled",
                            },
                        ],
                        title: "Command",
                        width: "180px",
                    }
                ]
            }
             $scope.getRuangan = function(data){
                $scope.GetRuangan = data
            }
            function enableDataRuangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idgedung,
                    "status": 1 //'t'
                }
                // console.log(objSave);
                // return
                medifirstService.post('sysadmin/master/save-statusenabled-ruanganaset', objSave).then(function (e) {
                    // init();
                    loadData()
                })
            };
            function disableDataRuangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idruangan,
                    "status": 0 //'f'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-ruanganaset', objSave).then(function (e) {
                    loadData()
                })
            };
            $scope.tambahRuangan = function(){
                $scope.popUpDataRuangan.center().open()
            }
            $scope.editRuangan = function () {
                if ($scope.dataRuanganSelected == undefined){
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.itemRuangan.namaRuangan = $scope.dataRuanganSelected.namaruangan
                $scope.itemRuangan.Lantai = {
                    id: $scope.dataRuanganSelected.objectlantaifk, lantai: $scope.dataRuanganSelected.lantai 
                }
                $scope.idRuangan = $scope.dataRuanganSelected.idruangan
                $scope.popUpDataRuangan.center().open()
            }
            $scope.hapusRuangan = function(){
                if ($scope.dataRuanganSelected == undefined) {
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.idRuangan = $scope.dataRuanganSelected.idruangan
                var data = {
                    id: $scope.idRuangan,
                }
                var objSave = {
                    data: data,
                    method: "delete"
                }
                medifirstService.post('sysadmin/master/save-data-ruangan-aset', objSave).then(function () {
                    $scope.itemRuangan = {}
                    loadData()
                    $scope.idRuangan = ""
                })
                $scope.popUpDataRuangan.close();
            }
            $scope.simpanDataRuangan = function(){
                var listRawRequired = [
                    "itemRuangan.Lantai|ng-model|Lantai Belum Diisi",
                    "itemRuangan.namaRuangan|ng-model|Nama Ruangan",
                    
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idRuangan,
                        objectlantaifk: $scope.itemRuangan.Lantai.id,
                        namaruangan: $scope.itemRuangan.namaRuangan,                        
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-ruangan-aset', objSave).then(function () {
                        $scope.itemRuangan = {}
                        $scope.idRuangan = ""
                        loadData()
                        loadCombo()
                    })
                    $scope.popUpDataRuangan.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
                
            }
            $scope.batalDataRuangan = function(){
                $scope.itemRuangan = {}
                $scope.idRuangan = ""
                $scope.popUpDataRuangan.close()
            }
            //END TAB RUANGAN

            //Awal gedung
            function loadDataGedung() {
                loadCombo()
                var status = undefined;
                if ($scope.item.StatusGedung != undefined){
                    status = "status="+ $scope.item.StatusGedung.id
                } else if ($scope.item.StatusGedung == undefined){
                    status = "status=" + true
                }
                var gedung = '';
                if($scope.item.namaGedung != undefined){
                    gedung = "&ruangan="+ $scope.item.namaGedung.id
                }
                var kamar = '';
                if ($scope.item.namaKamar != undefined)
                    kamar = "&kamar="+ $scope.item.namaKamar.id

                medifirstService.get('sysadmin/master/get-data-gedung-aset?' + status + gedung).then(function (data) {
                    var datas  = data.data
                    for (var i = 0; i < datas.ruangan.length; i++) {
                        datas.ruangan[i].no = i + 1
                    }

                    $scope.dataGedung = new kendo.data.DataSource({
                        data: datas.ruangan,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                }
                            },
                        },
                        pageSize: 20,
                    });
                })
               
               
            
            }

            $scope.columnGedung = {
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "idgedung",
                        title: "Id Ruangan",
                        width: "50px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namagedung",
                        title: "Nama Ruangan",
                        width: "100px"
                    },
                    {
                        "command": [{
                                text: "Enable",
                                click: enableDataGedung,
                                imageClass: "k-icon k-i-pencil",
                                className: "btn-enabled",
                            },
                            {
                                text: "Disable",
                                click: disableDataGedung,
                                imageClass: "k-icon k-delete",
                                className: "btn-disabled",
                            },
                        ],
                        title: "Command",
                        width: "180px",
                    }
                ]
            }

            $scope.editGedung = function () {
                if ($scope.dataSelectGedung == undefined){
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.item.gedungEdit = $scope.dataSelectGedung.namagedung                
                $scope.idGedung = $scope.dataSelectGedung.idgedung
                $scope.popUpDataGedung.center().open()
            }
            $scope.hapusGedung = function(){
                if ($scope.dataSelectGedung == undefined) {
                    toastr.error('Data Gedung Belum dipilih')
                    return
                }
                $scope.idGedung = $scope.dataSelectGedung.idgedung
                var data = {
                    id: $scope.idGedung,
                }
                var objSave = {
                    data: data,
                    method: "delete"
                }
                medifirstService.post('sysadmin/master/save-data-gedung-aset', objSave).then(function () {
                    $scope.item = {}
                    $scope.iGedung = ""
                    loadData()
                    
                })
                $scope.popUpDataRuangan.close();
            }

            function enableDataGedung(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idgedung,
                    "status": 1 //'t'
                }
                // console.log(objSave);
                // return
                medifirstService.post('sysadmin/master/save-statusenabled-gedung', objSave).then(function (e) {
                    // init();
                    loadData()
                })
            };
            function disableDataGedung(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idgedung,
                    "status": 0 //'f'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-gedung', objSave).then(function (e) {
                    loadData()
                })
            };

            $scope.simpanDataGedung = function(){
                var listRawRequired = [
                    "item.gedungEdit|ng-model|Nama Gedung",
                    
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idGedung,
                        namagedung: $scope.item.gedungEdit,
                        method: "post"                        
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-gedung-aset', objSave).then(function () {
                        $scope.item = {}
                        $scope.idGedung = ""
                        loadDataGedung()
                        // loadCombo()
                    })
                    $scope.popUpDataGedung.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
                
            }
            $scope.batalDataGedung = function(){
                $scope.item = {}
                $scope.idGedung = ""
            } 
            $scope.tambahGedung = function(){
                $scope.popUpDataGedung.center().open()
            }
            //Akhir

            //Awal Lantai
            $scope.cariFilterLantai = function(){
                loadDataLantai()
            }
            function loadDataLantai() {
                loadCombo()
                var status = undefined;
                if ($scope.item.StatusGedung != undefined){
                    status = "status="+ $scope.item.StatusGedung.id
                } else if ($scope.item.StatusGedung == undefined){
                    status = "status=" + true
                }
                var gedung = '';
                if($scope.item.namaGedung != undefined){
                    gedung = "&ruangan="+ $scope.item.namaGedung.id
                }
                var Lantai = ""
				if ($scope.item.namaLantai != undefined) {
					var Lantai = "&Lantai=" + $scope.item.namaLantai
				}
             

                medifirstService.get('sysadmin/master/get-data-lantai-aset?' + status + gedung + Lantai).then(function (data) {
                    var datas  = data.data
                    for (var i = 0; i < datas.ruangan.length; i++) {
                        datas.ruangan[i].no = i + 1
                    }

                    $scope.dataLantai = new kendo.data.DataSource({
                        data: datas.ruangan,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                }
                            },
                        },
                        pageSize: 20,
                    });
                })
               
               
            
            }

            $scope.columnLantai = {
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px"
                    },                   
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namagedung",
                        title: "Nama Ruangan",
                        width: "100px"
                    },
                    {
                        field: "lantai",
                        title: "Nama Lantai",
                        width: "100px"
                    },
                    {
                        "command": [{
                                text: "Enable",
                                click: enableDataLantai,
                                imageClass: "k-icon k-i-pencil",
                                className: "btn-enabled",
                            },
                            {
                                text: "Disable",
                                click: disableDataLantai,
                                imageClass: "k-icon k-delete",
                                className: "btn-disabled",
                            },
                        ],
                        title: "Command",
                        width: "180px",
                    }
                ]
            }

            $scope.editLantai = function () {
                if ($scope.dataSelectLantai == undefined){
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.idLantai = $scope.dataSelectLantai.idlantai 
                $scope.item.Lantai = $scope.dataSelectLantai.lantai 
                if ($scope.dataSelectLantai.objectgedungasetfk != null) {
                    $scope.item.namaGedungLantai = { id: $scope.dataSelectLantai.objectgedungasetfk, namagedung: $scope.dataSelectLantai.namagedung }
                }
                $scope.popUpDataLantai.center().open()
            }
            $scope.hapusLantai = function(){
                if ($scope.dataSelectLantai == undefined) {
                    toastr.error('Data Gedung Belum dipilih')
                    return
                }
                $scope.idLantai = $scope.dataSelectLantai.idlantai
                var data = {
                    id: $scope.idLantai,
                }
                var objSave = {
                    data: data,
                    method: "delete"
                }
                medifirstService.post('sysadmin/master/save-data-lantai-aset', objSave).then(function () {
                    $scope.item = {}
                    $scope.idLantai = ""
                    loadDataLantai()
                    
                })
                $scope.popUpDataLantai.close();
            }

            function enableDataLantai(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idlantai,
                    "status": 1 //'t'
                }
               
                medifirstService.post('sysadmin/master/save-statusenabled-lantai', objSave).then(function (e) {
                    
                    loadDataLantai()
                })
            };
            function disableDataLantai(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idlantai,
                    "status": 0 //'f'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-lantai', objSave).then(function (e) {
                    loadDataLantai()
                })
            };

            $scope.simpanDataLantai = function(){
                var listRawRequired = [
                    "item.namaGedungLantai|ng-model|Nama Gedung",
                    "item.Lantai|ng-model|Nama Latai",
                    
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idLantai,
                        objectgedungasetfk: $scope.item.namaGedungLantai.id,
                        lantai: $scope.item.Lantai,
                        method: "post"                        
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-lantai-aset', objSave).then(function () {
                        $scope.item = {}
                        $scope.idLantai = ""
                        loadDataLantai()
                        // loadCombo()
                    })
                    $scope.popUpDataLantai.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
                
            }
            $scope.batalDataLantai = function(){
                $scope.item = {}
                $scope.idLantai = ""
            } 
            $scope.tambahLantai = function(){
                $scope.popUpDataLantai.center().open()
            }
            //Akhir
           
        }
    ]);
});
