define(['initialize','Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('MasterDataPendidikanCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
                function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
                    getLoadData()
                    $scope.item = {}
                    var idPendidikan = "";

                    function getLoadData(){
                        medifirstService.get('sdm/get-data-master-pendidikan').then(function(data){
                            var datas = data.data.data
                            $scope.gridPendidikan = new kendo.data.DataSource({
                                data: datas
                            });
                            for (let i = 0; i < datas.length; i++) {
                                // const element = datas[i];
                                datas[i].no = i+1
                            }
                        })
                    }

                    $scope.opsiGridPendidikan = {
                        toolbar: [
                            {
                                name: "create",
                                text: "Buat Data Master Pendidikan",
                                template: '<button ng-click="createMasterPendidikan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Master Pendidikan</button>'
                            }
                        ],
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        selectable: 'row',
                        columns: [{
                                "field": "no",
                                "title": "No",
                                "width": "5%"
                            },
                            {
                                "field": "pendidikanpegawai",
                                "title": "Pendidikan",
                                "width": "50%"
                            },
                            {
                                "field": "kategorifk",
                                "title": "Kategori Pendidikan",
                                "width": "20%"
                            },
                            // {
                            //     "field": "subkategorifk",
                            //     "title": "Sub Kategori Pendidikan",
                            //     "width": "20%"
                            // },
                            {
                                "command": [{
                                        text: "Edit",
                                        click: Edit,
                                        imageClass: "k-icon k-i-pencil"
                                    },
                                    {
                                        text: "Hapus",
                                        click: Hapus,
                                        imageClass: "k-icon k-i-delete"
                                    },
                                ],
                                title: "",
                                width: "185px",
                            }
                        ]
                    }
                    $scope.createMasterPendidikan= function(){
                        $scope.popUpDataPendidikan.center().open();
                    }
                    function Edit(e){
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        if (dataItem == undefined) {
                            alert("Data Belum Dipilih!")
                            return;
                        };
                        $scope.item.pendidikanPegawai = dataItem.pendidikanpegawai
                        idPendidikan = dataItem.id
                       $scope.popUpDataPendidikan.center().open();

                    }
                    function Hapus(e){
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        if (dataItem == undefined) {
                            alert("Data Belum Dipilih!")
                            return;
                        };
                        if (dataItem.kategorifk != null || dataItem.subkategorifk != null){
                            alert("Data ini untuk keperluan RL, Tidak bisa dihapus!")
                            return;
                        }
                        idPendidikan = dataItem.id
                        var objSave = {
                            'hapus': 'oke',
                            'idDelete': idPendidikan,
                        }
                        medifirstService.post('sdm/save-master-pendidikan-pegawai', objSave).then(function () {
                            getLoadData()
                            $scope.item = {}
                            idPendidikan = "";
                        })
                    }
                    $scope.tambahPendidikanPegawai = function(){
                        var objSave = {
                            'id': idPendidikan,
                            'pendidikanpegawai': $scope.item.pendidikanPegawai
                        }
                        medifirstService.post('sdm/save-master-pendidikan-pegawai', objSave).then(function(){
                            getLoadData()
                            $scope.item = {}
                        })
                        $scope.popUpDataPendidikan.close()
                    }
                }
            ])
});