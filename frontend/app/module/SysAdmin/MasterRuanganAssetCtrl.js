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
            $scope.idKamar = "";
            $scope.idTempatTidur = "";
            $scope.idRiwayatKamar = "";
            loadCombo()
            loadData()
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
                })
            }
            $scope.cariFilter = function(){
                loadData()
            }
            function loadData() {
                loadCombo()
                var status = undefined;
                if ($scope.item.Status != undefined){
                    status = "status="+ $scope.item.Status.id
                } else if ($scope.item.Status == undefined){
                    status = "status=" + true
                }
                var ruangan = '';
                if($scope.itemRuangan.namaRuangan != undefined){
                    ruangan = "&ruangan="+ $scope.itemRuangan.namaRuangan.id
                }
                var kamar = '';
                if ($scope.item.namaKamar != undefined)
                    kamar = "&kamar="+ $scope.item.namaKamar.id

                medifirstService.get('sysadmin/master/get-data-ruangan-aset?' + status + ruangan).then(function (data) {
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
                        field: "idruangan",
                        title: "Id Ruangan",
                        width: "50px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
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
                    "id": dataItem.idruangan,
                    "status": 1 //'t'
                }
                // console.log(objSave);
                // return
                medifirstService.post('sysadmin/master/save-statusenabled-ruangan', objSave).then(function (e) {
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
                medifirstService.post('sysadmin/master/save-statusenabled-ruangan', objSave).then(function (e) {
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
                $scope.itemRuangan.departemen = {
                    id: $scope.dataRuanganSelected.iddepartemen, namadepartemen: $scope.dataRuanganSelected.namadepartemen 
                }
                $scope.itemRuangan.kodeInternal = $scope.dataRuanganSelected.kdinternal
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
                    "itemRuangan.namaRuangan|ng-model|Nama Ruangan",
                    
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idRuangan,
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

           
        }
    ]);
});
