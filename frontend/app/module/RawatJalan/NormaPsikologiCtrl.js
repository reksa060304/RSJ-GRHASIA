define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('NormaPsikologiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            getLoadData()
            $scope.item = {}
            $scope.item.idNormaPsikologi = null;

            function getLoadData() {
                medifirstService.get('psikologi/get-data-psikologi').then(function (data) {
                    var datas = data.data
                    $scope.listJenisNorma = datas.jenisnorma
                    $scope.gridNormaPsikologi = new kendo.data.DataSource({
                        data: datas.normapsikologi
                    });
                    for (let i = 0; i < datas.normapsikologi.length; i++) {
                        // const element = datas[i];
                        datas.normapsikologi[i].no = i + 1
                    }
                })
            }

            $scope.opsiGridNormaPsikologi = {
                toolbar: [{
                    name: "create",
                    text: "Buat Data Master Norma Psikologi",
                    template: '<button ng-click="createMasterNormaPsikologi()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Master Norma Psikologi</button>'
                }],
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
                        "field": "jenisnorma",
                        "title": "Jenis Norma",
                        "width": "50%"
                    },
                    {
                        "field": "umurmin",
                        "title": "Umur Min",
                        "width": "20%"
                    },
                    {
                        "field": "umurmax",
                        "title": "Umur Max",
                        "width": "20%"
                    },
                    {
                        "field": "nilai",
                        "title": "Nilai",
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
            $scope.createMasterNormaPsikologi = function () {
                $scope.popUpDataNormaPsikologi.center().open();
            }

            function Edit(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.umurmin = dataItem.umurmin
                $scope.item.umurmax = dataItem.umurmax
                $scope.item.nilai = dataItem.nilai
                $scope.item.jenisnorma = {
                    id: dataItem.objectjenisnormafk,
                    jenisnorma: dataItem.jenisnorma
                }
                $scope.item.idNormaPsikologi = dataItem.id
                $scope.popUpDataNormaPsikologi.center().open();

            }

            function Hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var objSave = {
                    'iddel': dataItem.id,
                    
                }
                console.log(objSave);
                // return

                medifirstService.post('psikologi/save-master-norma-psikologi', objSave).then(function (data) {
                    getLoadData()
                    $scope.item = {}
                    $scope.item.idNormaPsikologi = null;
                    $scope.popUpDataNormaPsikologi.close()
                })
            }
            $scope.klikGrid = function (dataNormaPsikologi){
                console.log(dataNormaPsikologi);
            }
            $scope.simpanNormaPsikologi = function(){
                var objSave = {
                    'id': $scope.item.idNormaPsikologi,
                    'objectjenisnormafk': $scope.item.jenisnorma.id,
                    'umurmin': $scope.item.umurmin,
                    'umurmax': $scope.item.umurmax,
                    'nilai': $scope.item.nilai,
                }
                console.log(objSave);
                // return
                
                medifirstService.post('psikologi/save-master-norma-psikologi', objSave).then(function (data) {
                    getLoadData()
                    $scope.item = {}
                    $scope.item.idNormaPsikologi= null;
                    $scope.popUpDataNormaPsikologi.close()
                })
            }
            $scope.batalNormaPsikologi = function(){
                $scope.item = {}
                $scope.popUpDataNormaPsikologi.close()
                $scope.item.idNormaPsikologi = ""
            }
        }
    ])
});