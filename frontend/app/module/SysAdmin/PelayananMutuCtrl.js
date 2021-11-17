define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PelayananMutuCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
        function ($rootScope, $scope, medifirstService, $window, $timeout) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.isRouteLoading = false;
            loadData();
            $scope.Search = function () {
                loadData()
            }

            $scope.Clear = function () {
                delete $scope.item.id
                delete $scope.item.kodePelayananMutu
                delete $scope.item.PelayananMutu
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var id = ""
                if ($scope.item.id != undefined) {
                    id = "&id=" + $scope.item.id
                }
                var kdPelayananMutu = ""
                if ($scope.item.kdPelayananMutu != undefined) {
                    kdPelayananMutu = "&kdPelayananMutu=" + $scope.item.kdPelayananMutu
                }
                var PelayananMutu = ""
                if ($scope.item.PelayananMutu != undefined) {
                    PelayananMutu = "&PelayananMutu=" + $scope.item.PelayananMutu
                }
                medifirstService.get("sysadmin/master/get-daftar-pelayananmutu?"
                    + kdPelayananMutu + PelayananMutu + id).then(function (data) {
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
                    "field": "kdpelmutu",
                    "title": "<h3 align=center>Kode Pelayanan</h3>",
                    "width": "80px"
                },
                {
                    "field": "pelayananmutu",
                    "title": "<h3 align=center>Pelayanan Mutu</h3>",
                    "width": "150px"
                },
                {
                    "field": "statusenabled",
                    "title": "<h3 align=center>Status</h3>",
                    "width": "100px"
                },
                {
                    "command": [{
                        text: "Non Aktif",
                        click: hapusData,
                        imageClass: "k-icon k-delete"
                    },
                    {
                        text: "Aktif",
                        click: Aktif,
                        imageClass: "k-icon k-i-pencil"
                    },
                    {
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
                if ($scope.popUp.PelayananMutu == undefined || $scope.popUp.PelayananMutu == "") {
                    toastr.warning("Pelayanan Mutu Belum Diisi !!!");
                    return;
                }
                var id = ""
                if ($scope.popUp.id != undefined)
                    id = $scope.popUp.id

                var kodePelayananMutu = ""
                if ($scope.popUp.kodePelayananMutu != undefined)
                kodePelayananMutu = $scope.popUp.kodePelayananMutu

                var PelayananMutu = ""
                if ($scope.popUp.PelayananMutu != undefined)
                PelayananMutu = $scope.popUp.PelayananMutu                

                var objSave = {
                    "id": id,
                    "kdpelmutu": kodePelayananMutu,
                    "pelayananmutu": PelayananMutu,                   
                }
                medifirstService.post("sysadmin/master/save-pelayananmutu", objSave).then(function (res) {
                    loadData();
                    $scope.Clear();
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

                medifirstService.post('sysadmin/master/delete-pelayananmutu', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })
            }

            function Aktif(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.post('sysadmin/master/aktif-pelayananmutu', itemDelete).then(function (e) {
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
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                medifirstService.get("sysadmin/master/get-daftar-jenisdiet?id=" + dataItem.id).then(function (e) {

                })
                $scope.popUp.id = dataItem.id
                $scope.popUp.kodePelayananMutu = dataItem.kdpelmutu
                $scope.popUp.PelayananMutu = dataItem.pelayananmutu                
                $scope.popUp.center().open();
            }

            $scope.tutup = function () {
                $scope.popUp.close();
            }

            //** BATAS SUCI */
        }
    ]);
});

