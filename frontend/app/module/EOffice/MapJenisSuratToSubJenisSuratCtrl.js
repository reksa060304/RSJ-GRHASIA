define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapJenisSuratToSubJenisSuratCtrl', ['$scope', 'MedifirstService',
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
            medifirstService.get("eoffice/get-data-combo-mapping").then(function (data) {
                $scope.listSubJenisSurat = data.data.subjenissurat;
                $scope.listJenisSurat = data.data.jenissurat;                
            })

            function loadData() {
                $scope.isRouteLoading = true;

                var JenisSurat = ""
                if ($scope.item.JenisSurat != undefined) {
                    JenisSurat = "&JenisSurat=" + $scope.item.JenisSurat.id
                }
                var subJenisSurat = ""
                if ($scope.item.subJenisSurat != undefined) {
                    subJenisSurat = "&jenisubJenisSuratsSurat=" + $scope.item.subJenisSurat
                }

                medifirstService.get("eoffice/get-data-mapping-jenissurat?"
                    + JenisSurat
                    + subJenisSurat

                ).then(function (data) {
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

            $scope.getProdukByPaket = function (paket) {
                $scope.arrayProdukTemp = []
                medifirstService.get("eoffice/get-data-mapping-jenissurat?JenisSurat="
                    + paket.id).then(function (e) {
                        var data = []
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            data.push({ id: element.subjenissuratfk, subjenissurat: element.subjenissurat })
                        }
                        $scope.listProduk = []
                        $scope.arrayProdukTemp = data
                        $scope.listProduk = $scope.listSubJenisSurat
                        if ($scope.arrayProdukTemp.length > 0) {
                            for (let i = 0; i < $scope.listProduk.length; i++) {
                                const element = $scope.listProduk[i];
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
                field: "jenissurat",
            };
            $scope.selectedData = [];
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrids").data("kendoGrid"),
                    dataItem = grid.dataItem(row);                
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
                        "width": "10%",
                        "title": "✔"
                    },
                    {
                        "field": "jenissurat",
                        "title": "Jenis Surat",
                        "width": "60%"
                    },
                    {
                        "field": "subjenissurat",
                        "title": "Sub Jenis Surat",
                        "width": "80%"
                    },                
                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                $scope.popUps.center().open();
            }

            $scope.save = function () {
                if ($scope.popUp.jenisSurat == undefined) {
                    toastr.error('Nama Paket belum dipilih')
                    return
                }               
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Produk belum di pilih')
                    return
                }
                var objSave = {
                    "jenisSuratId": $scope.popUp.jenisSurat.id,                   
                    "details": $scope.arrayProdukTemp
                }
                medifirstService.post('eoffice/save-mapping-jenissurat', objSave).then(function (e) {
                    loadData();
                    $scope.arrayProdukTemp = []
                    $scope.listSubJenisSurat = $scope.listSubJenisSurat
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
                medifirstService.post('eoffice/delete-mapping-jenissurat', itemDelete).then(function (e) {
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

                medifirstService.post('eoffice/delete-mapping-jenissurat', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })
            }

            $scope.tutup = function () {
                for (let i = 0; i < $scope.listSubJenisSurat.length; i++) {
                    const element = $scope.listSubJenisSurat[i];
                    element.isChecked = false
                }
                $scope.arrayProdukTemp = []
                $scope.popUps.close();
            }

            $scope.cekAll = function (bool) {
                $scope.arrayProdukTemp = []
                if (bool) {
                    $scope.listSubJenisSurat.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrayProdukTemp.push(e)
                    })
                } else {
                    $scope.listSubJenisSurat.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrayProdukTemp = []
                    })
                }
                console.log($scope.arrayProdukTemp)
            }

            $scope.cariSubJenisSurat = function () {
                if ($scope.popUp.cariSubJenisSurat == undefined || $scope.popUp.cariSubJenisSurat == "") {
                    $scope.listSubJenisSurat = $scope.listProdukDefault
                    return
                }

                $scope.listTempProduk = []
                var name = $scope.popUp.cariSubJenisSurat.toLowerCase()
                for (let i = 0; i < $scope.listSubJenisSurat.length; i++) {
                    var arr = $scope.listSubJenisSurat[i].subjenissurat.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempProduk.push($scope.listSubJenisSurat[i])
                    }
                }
                $scope.listSubJenisSurat = []
                $scope.listSubJenisSurat = $scope.listTempProduk
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listSubJenisSurat.length; i++) {
                        const element = $scope.listSubJenisSurat[i];
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

            $scope.clearSubJenisSurat = function () {
                delete $scope.popUp.cariSubJenisSurat
                $scope.listProduk = []
                $scope.listProduk = $scope.listSubJenisSurat
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listSubJenisSurat.length; i++) {
                        const element = $scope.listSubJenisSurat[i];
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
                    $scope.listProduk.forEach(function (e) {
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
                    $scope.listProduk.forEach(function (e) {
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

                console.log($scope.arrayProdukTemp)
            }

            $scope.arrayKelasCek = []
            $scope.ceklisOneKelas = function (bool, data) {
                if (bool) {
                    $scope.listKelas.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayKelasCek.splice(e, 1);
                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayKelasCek.push(e)
                        }
                    })
                } else {
                    $scope.listKelas.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayKelasCek.push(e)

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayKelasCek.splice(e, 1);

                        }
                    })
                }
                console.log($scope.arrayKelasCek)
            }
            

            //** BATAS */
        }
    ]);
});