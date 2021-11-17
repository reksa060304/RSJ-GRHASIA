define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapRuanganToPelayananMutuCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.item.jmlRow = 100;
            $scope.arrayProdukTemp = []
            $scope.isRouteLoading = false;

            loadData();
            $scope.Search = function () {
                loadData()
            }
            $scope.Clear = function () {
                $scope.item = {
                    jmlRow: 100
                }
                $scope.popUp = {}

                loadData()

            }
            $scope.SearchEnter = function () {
                loadData()
            }
            medifirstService.get("sysadmin/get-combo-pelayananmutu").then(function (data) {
                $scope.listRuangan = data.data.listruangan;
                $scope.listRuangans = data.data.listruangan;
                $scope.listPelayananMutu = data.data.pelayananmutu;
                $scope.listDepartemen = data.data.listdepartemen;
            })

            function loadData() {
                $scope.isRouteLoading = true;
                var PelayananMutu = ""
                if ($scope.item.PelayananMutu != undefined) {
                    PelayananMutu = "&PelayananMutu=" + $scope.item.PelayananMutu.id
                }
                var idRuangan = ""
                if ($scope.item.Ruangan != undefined) {
                    idRuangan = "&idRuangan=" + $scope.item.Ruangan.id
                }

                medifirstService.get("sysadmin/get-mapping-ruanganpelayananmutu?"+ PelayananMutu+ idRuangan).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    // $scope.listDiagnosaKep = data.data.data
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
                        pageSize: 20,
                        total: data.length,
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

            $scope.getPelayananMutuByRuangan = function (pelayananmutu) {
                $scope.arrayProdukTemp = []
                medifirstService.get("sysadmin/get-mapping-ruanganpelayananmutu?objectpelayananmutufk="
                    + pelayananmutu.id).then(function (e) {
                        var data = []
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            data.push({ id: element.objectpelayananmutufk, pelayananmutu: element.pelayananmutu })
                        }
                        $scope.listRuangans = $scope.listRuangan
                        $scope.arrayProdukTemp = []
                        // $scope.listRuangans = $scope.listRuangan
                        if (data.length > 0) {
                            for (let i = 0; i < $scope.listRuangans.length; i++) {
                                const element = $scope.listRuangans[i];
                                element.isChecked = false
                                for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                                    const elements = $scope.arrayProdukTemp[j];
                                    if (element.id == elements.id) {
                                        element.isChecked = true
                                        element.style = "bold-produk"
                                    }
                                }
                            }
                        }
                    })

            }

            $scope.group = {
                field: "pelayananmutu",
            };
            $scope.selectedData = [];
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrids").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.id == dataItem.id;
                    });
                    if (result.length == 0) {
                        $scope.selectedData.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData.length; i++)
                            if ($scope.selectedData[i].id === dataItem.id) {
                                $scope.selectedData.splice(i, 1);
                                break;
                            }
                        $scope.selectedData.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData.length; i++)
                        if ($scope.selectedData[i].id === dataItem.id) {
                            $scope.selectedData.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },
                    {
                        name: "delete", text: "Hapus",
                        template: '<button ng-click="hapusData()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-cancel"></span>Hapus</button>'
                    },
                ],
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                        "width": "2%",
                        "title": "✔"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "40%"
                    },
                    {

                        "field": "pelayananmutu",
                        "title": "Pelayananmutu",
                        "width": "50%"
                    },
                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                $scope.popUps.center().open();
            }

            $scope.save = function () {
                // $scope.arrayProdukTemp = []
                if ($scope.popUp.PelayananMutu == undefined) {
                    toastr.error('Pelayanan Mutu Belum Dipilih')
                    return
                }               
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Produk belum di pilih')
                    return
                }               
                var objSave = {
                    "pelayananmutu": $scope.popUp.PelayananMutu.id,                  
                    "details": $scope.arrayProdukTemp
                }
                medifirstService.post('sysadmin/save-map-ruangan-to-pelayananmutu', objSave).then(function (e) {
                    loadData();
                    $scope.arrayProdukTemp = []
                    $scope.listRuangans = $scope.listRuangan
                    $scope.arrayKelasCek = []
                    $scope.Clear();
                })
            }

            $scope.hapusData = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data yang mau dihapus')
                    return
                }
                var data = []
                for (let i = 0; i < $scope.selectedData.length; i++) {
                    const element = $scope.selectedData[i];
                    data.push({id:element.id})
                }
                var itemDelete = {
                    "data": data
                }
                medifirstService.post('sysadmin/delete-map-ruangan-to-pelayananmutu', itemDelete).then(function (e) {
                    loadData();
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

                medifirstService.post('sysadmin/delete-map-ruangan-to-pelayananmutu', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })
            }

            $scope.tutup = function () {
                for (let i = 0; i < $scope.listRuangans.length; i++) {
                    const element = $scope.listRuangans[i];
                    element.isChecked = false
                }
                $scope.arrayProdukTemp = []
                $scope.popUps.close();
            }

            $scope.cekAll = function (bool) {
                $scope.arrayProdukTemp = []
                if (bool) {
                    $scope.listRuangans.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrayProdukTemp.push(e)
                    })
                } else {
                    $scope.listRuangans.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrayProdukTemp = []
                    })
                }
                console.log($scope.arrayProdukTemp)
            }

            $scope.cariRuangan = function () {
                if ($scope.popUp.cariRuangan == undefined || $scope.popUp.cariRuangan == "") {
                    $scope.listRuangans = $scope.listRuangan
                    return
                }

                $scope.listTempProduk = []
                var name = $scope.popUp.cariRuangan.toLowerCase()
                for (let i = 0; i < $scope.listRuangans.length; i++) {
                    var arr = $scope.listRuangans[i].namaruangan.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempProduk.push($scope.listRuangans[i])
                    }
                }
                $scope.listRuangans = []
                $scope.listRuangans = $scope.listTempProduk
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listRuangans.length; i++) {
                        const element = $scope.listRuangans[i];
                        element.isChecked = false
                        for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                            const elements = $scope.arrayProdukTemp[j];
                            if (element.id == elements.id) {
                                element.isChecked = true
                            }
                        }
                    }
                }

            }

            $scope.clearRuangan = function () {
                delete $scope.popUp.cariProduk
                $scope.listRuangans = []
                $scope.listRuangans = $scope.listRuangan
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listRuangans.length; i++) {
                        const element = $scope.listRuangans[i];
                        element.isChecked = false
                        for (let j = 0; j < $scope.arrayProdukTemp.length; j++) {
                            const elements = $scope.arrayProdukTemp[j];
                            if (element.id == elements.id) {
                                element.isChecked = true
                            }
                        }
                    }
                }
            }
           
            $scope.ceklisOne = function (bool, data) {
                if (bool) {
                    $scope.listRuangans.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                    })
                } else {
                    $scope.listRuangans.forEach(function (e) {
                        if (data.id== e.id && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                    })
                }
                // }
                console.log($scope.arrayProdukTemp)
            }
            
            //** BATAS SUCI */
        }
    ]);
});