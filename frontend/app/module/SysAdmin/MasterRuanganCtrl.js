define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
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
                delete $scope.item.kdRuangan          
                delete $scope.item.namaRuangan
                delete $scope.item.Departemen
                delete $scope.popUp.id
                delete $scope.popUp.Ruangan
                delete $scope.popUp.Departemen
                delete $scope.popUp.namaEksternal
            }


            function loadCombo() {
                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listdataDepartemen = data;
                });
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var id = ""
                if ($scope.item.id != undefined) {
                    id = "&id=" + $scope.item.id
                }
                var kdRuangan = ""
                if ($scope.item.kdRuangan != undefined) {
                    kdRuangan = "&kdRuangan=" + $scope.item.kdRuangan
                }
                var namaRuangan = ""
                if ($scope.item.namaRuangan != undefined) {
                    namaRuangan = "&namaRuangan=" + $scope.item.namaRuangan
                }
                var idDept = ""
                if ($scope.item.Departemen != undefined) {
                    idDept = "&idDept=" + $scope.item.Departemen.id
                }
                medifirstService.get("sysadmin/master/get-daftar-master-ruangan?"
                    + kdRuangan
                    + namaRuangan
                    + idDept
                    + id).then(function (data) {
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


                columns: [{
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
                // {
                // 	"field": "kdkategorydiet",
                // 	"title": "<h3 align=center>Kode Kategory Diet</h3>",
                // 	"width": "80px"
                // },
                {
                    "field": "namaexternal",
                    "title": "<h3 align=center>Nama Eksternal</h3>",
                    "width": "80px"
                },
                {
                    "field": "namaruangan",
                    "title": "<h3 align=center>Nama Ruangan</h3>",
                    "width": "150px"
                },
                {
                    "field": "namadepartemen",
                    "title": "<h3 align=center>Departemen</h3>",
                    "width": "100px"
                },
                {
                    "command": [{
                        text: "Hapus",
                        click: hapusData,
                        imageClass: "k-icon k-delete"
                    }, {
                        text: "Edit",
                        click: editData,
                        imageClass: "k-icon k-i-pencil"
                    }],
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

                var namaRuangan = ""
                if ($scope.popUp.Ruangan != undefined)
                namaRuangan = $scope.popUp.Ruangan


                var idDept = null
                if ($scope.popUp.Departemen != undefined)
                idDept = $scope.popUp.Departemen.value

                var objSave = {
                    "id": id,
                    // "kdkategorydiet" :kodeKategoryDiet,
                    "namaexternal": namaEksternal,
                    "namaruangan": namaRuangan,
                    "objectdepartemenfk": idDept,
                }
                medifirstService.post('sysadmin/master/save-data-master-ruangan', objSave).then(function (res) {
                    loadData();
                    $scope.Clear();
                })

            }

            // $scope.klikGrid= function(dataSelected){
            // 	// $scope.popUp.id =dataSelected.id
            // 	// $scope.popUp.kdJenisDiet =dataSelected.kdjenisdiet
            // 	// $scope.popUp.jenisDiet= dataSelected.jenisidiet
            // 	// $scope.popUp.kelompokProduk={id:dataSelected.objectkelompokprodukfk,kelompokproduk:dataSelected.kelompokproduk}
            // 	// $scope.popUp.Keterangan= dataSelected.keterangan


            // }

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

                medifirstService.post('sysadmin/master/delete-data-master-ruangan', itemDelete).then(function (res) {
                    if (e.status === 201) {
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
                medifirstService.get("sysadmin/master/get-daftar-master-ruangan?id=" + dataItem.id).then(function (e) {

                })
                $scope.popUp.id = dataItem.id                
                $scope.popUp.Ruangan = dataItem.namaruangan
                $scope.popUp.namaEksternal = dataItem.namaexternal
                if (dataItem.objectdepartemenfk != null) {
                    $scope.popUp.Departemen = { value: dataItem.objectdepartemenfk, namadepartemen: dataItem.namadepartemen }
                }


                $scope.popUp.center().open();

            }

            $scope.tutup = function () {
                $scope.popUp.close();

            }

        }
    ]);
});

