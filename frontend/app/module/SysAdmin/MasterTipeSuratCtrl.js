define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterTipeSuratCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
        function ($rootScope, $scope, medifirstService, $window, $timeout) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.isRouteLoading = false;

            loadCombo();
            loadData();
            $scope.Search = function () {
                loadData()
            }
            $scope.Clear = function () {
                delete $scope.item.id
                delete $scope.item.kdTipeSurat
                delete $scope.item.namaTipeSurat
                delete $scope.popUp.id
                delete $scope.popUp.namaTipeSurat
                delete $scope.popUp.namaEksternal
            }

            function loadCombo() {
                // medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                //     $scope.listdataDepartemen = data;
                // });
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var id = ""
                if ($scope.item.id != undefined) {
                    id = "&id=" + $scope.item.id
                }
                var kdTipeSurat = ""
                if ($scope.item.kdTipeSurat != undefined) {
                    kdTipeSurat = "&kdTipeSurat=" + $scope.item.kdTipeSurat
                }
                var namaTipeSurat = ""
                if ($scope.item.namaTipeSurat != undefined) {
                    namaTipeSurat = "&namaTipeSurat=" + $scope.item.namaTipeSurat
                }
                medifirstService.get("sysadmin/master/get-daftar-master-tipesurat?"
                    + kdTipeSurat + namaTipeSurat + id).then(function (data) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < data.data.data.length; i++) {
                            data.data.data[i].no = i + 1
                        }

                        $scope.dataSource = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                            // total: data.data.data.length,
                            serverPaging: true,
                        });
                    })
            }

            $scope.columnGrid = {
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],

                columns: [
                    {
                        "field": "no",
                        "title": "<h3 align=center>No</h3>",
                        "width": "23px",
                        "attributes": { align: "center" }

                    },
                    {
                        "field": "id",
                        "title": "<h3 align=center>ID</h3>",
                        "width": "50px"
                    },
                    {
                        "field": "statusenabled",
                        "title": "<h3 align=center>Statusenabled</h3>",
                        "width": "80px"
                    },
                    {
                        "field": "namaexternal",
                        "title": "<h3 align=center>Nama Eksternal</h3>",
                        "width": "80px"
                    },
                    {
                        "field": "name",
                        "title": "<h3 align=center>Nama Tipe Surat</h3>",
                        "width": "150px"
                    },
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapusData,
                                imageClass: "k-icon k-delete"
                            },
                            {
                                text: "Edit",
                                click: editData,
                                imageClass: "k-icon k-i-pencil"
                            }
                        ],
                        title: "",
                        width: "130px",
                    }

                ]
            };

            $scope.Tambah = function () {
                $scope.popUp.center().open();
            }

            $scope.save = function () {
                var id = ""
                if ($scope.popUp.id != undefined)
                    id = $scope.popUp.id

                var namaEksternal = ""
                if ($scope.popUp.namaEksternal != undefined)
                    namaEksternal = $scope.popUp.namaEksternal

                var namaTipeSurat = ""
                if ($scope.popUp.namaTipeSurat != undefined)
                    namaTipeSurat = $scope.popUp.namaTipeSurat

                var objSave = {
                    "id": id,
                    // "kdkategorydiet" :kodeKategoryDiet,
                    "namaexternal": namaEksternal,
                    "name": namaTipeSurat,
                }
                medifirstService.post('sysadmin/master/save-data-master-tipesurat', objSave).then(function (res) {
                    loadData();
                    $scope.Clear();
                    $scope.popUp.close();
                })

            }

            function hapusData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.post('sysadmin/master/delete-data-master-tipesurat', itemDelete).then(function (res) {
                    if (res.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })
            }

            function editData(e) {
                $scope.Clear();
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                medifirstService.get("sysadmin/master/get-daftar-master-tipesurat?id=" + dataItem.id).then(function (e) {

                })
                $scope.popUp.id = dataItem.id
                $scope.popUp.namaTipeSurat = dataItem.name
                $scope.popUp.namaEksternal = dataItem.namaexternal
                $scope.popUp.center().open();
            }

            $scope.tutup = function () {
                $scope.popUp.close();

            }
            //** BATAS */
        }
    ]);
});

