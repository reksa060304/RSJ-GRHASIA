define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganRawatInapCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout','ModelItem',
        function ($scope, $state, cacheHelper, medifirstService, $timeout, ModelItem) {
            $scope.item = {};
            $scope.itemRuangan = {}
            $scope.now = new Date();
            $scope.item.jumlahRows = 50;
            $scope.item.jenisProdukDetail = [];
            loadCombo()
            loadData()
            function loadCombo(){
                medifirstService.get('sysadmin/master/get-combo-master').then(function(data){
                    var datas = data.data
                    $scope.listDepartemen = datas.departemen
                })
            }
            function loadData() {
                medifirstService.get('sysadmin/master/get-data-ruangan').then(function (data) {
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
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "id",
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
                                // click: enableData,
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
            $scope.tambahRuangan = function(){
                $scope.popUpDataRuangan.center().open()
            }
            $scope.simpanDataRuangan = function(){
                var listRawRequired = [
                    "itemRuangan.namaRuangan|ng-model|Nama Ruangan",
                    "itemRuangan.departemen|k-ng-model|Departemen",
                    "itemRuangan.kodeInternal|ng-model|Kode Internal",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var data = {
                        namaruangan: $scope.itemRuangan.namaRuangan,
                        objectdepartemenfk: $scope.itemRuangan.departemen.id,
                        kdinternal: $scope.itemRuangan.kodeInternal
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-ruangan', objSave).then(function () {
                        loadData()
                    })
                    $scope.popUpDataKeluarga.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
                
            }
        }
    ]);
});
