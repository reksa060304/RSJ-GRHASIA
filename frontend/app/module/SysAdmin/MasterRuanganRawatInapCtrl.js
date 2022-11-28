define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganRawatInapCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout','ModelItem',
        function ($scope, $state, cacheHelper, medifirstService, $timeout, ModelItem) {
            $scope.item = {};
            $scope.itemRuangan = {}
            $scope.now = new Date();
            $scope.item.jumlahRows = 50;
            $scope.item.jenisProdukDetail = [];
            $scope.idRuangan = "";
            loadCombo()
            loadData()
            function loadCombo(){
                $scope.listStatus = [{id:true,status:'True'},{id:false,status:'False'}];
                medifirstService.get('sysadmin/master/get-combo-master').then(function(data){
                    var datas = data.data
                    $scope.listDepartemen = datas.departemen
                })
            }
            $scope.cariFilter = function(){
                loadData()
            }
            function loadData() {
                var status = undefined;
                if ($scope.item.Status != undefined){
                    status = "status="+ $scope.item.Status.id
                } else if ($scope.item.Status == undefined){
                    status = "status=" + true
                }
                medifirstService.get('sysadmin/master/get-data-ruangan?'+ status).then(function (data) {
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
                                // click: disableData,
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
                console.log(data);
            }
            function enableDataRuangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.id,
                    "status": 1 //'t'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-produk', objSave).then(function (e) {
                    init();
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
                medifirstService.post('sysadmin/master/save-data-ruangan', objSave).then(function () {
                    $scope.itemRuangan = {}
                    loadData()
                    $scope.idRuangan = ""
                })
                $scope.popUpDataRuangan.close();
            }
            $scope.simpanDataRuangan = function(){
                var listRawRequired = [
                    "itemRuangan.namaRuangan|ng-model|Nama Ruangan",
                    "itemRuangan.departemen|k-ng-model|Departemen",
                    // "itemRuangan.kodeInternal|ng-model|Kode Internal",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idRuangan,
                        namaruangan: $scope.itemRuangan.namaRuangan,
                        objectdepartemenfk: $scope.itemRuangan.departemen.id,
                        kdinternal: $scope.itemRuangan.kodeInternal
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-ruangan', objSave).then(function () {
                        $scope.itemRuangan = {}
                        $scope.idRuangan = ""
                        loadData()
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
            
        }
    ]);
});
