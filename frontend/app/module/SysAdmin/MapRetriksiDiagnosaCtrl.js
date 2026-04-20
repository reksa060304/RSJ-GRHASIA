define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapRetriksiDiagnosaCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.item.jmlRow = 100;
            $scope.arrayEMRTemp = []
            $scope.isRouteLoading = false;

            loadData();
            loadCombo();
            $scope.Search = function () {
                loadData()
                loadCombo();
            }
            $scope.Clear = function () {
                $scope.item = {
                    jmlRow: 100
                }
                $scope.popUp = {}

                loadData()
                loadCombo();

            }
            $scope.SearchEnter = function () {
                loadData()
                loadCombo();
            }
            

            function loadCombo() {
				medifirstService.get("sysadmin/get-combo-retriksi", false).then(function (data) {
                $scope.listDepartemen = data.data.produk;
                // $scope.listRuangan = data.data.diagnosa;
                $scope.listEMR = data.data.produk;
                $scope.listEMRDefault = data.data.produk;
                });

                medifirstService.getPart("sysadmin/get-combo-retriksi-diagnosa", true, true, 20).then(function (data) {
                        $scope.listRuangan = data;
                });
			}

            function loadData() {
                $scope.isRouteLoading = true;

                var departemenId = ""
                if ($scope.item.departemen != undefined) {
                    departemenId = "produkid=" + $scope.item.departemen.id
                }

                var ruanganId = ""
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&diagnosaid=" + $scope.item.ruangan.id
                }

                var ket = ""
                if ($scope.item.ketpakai != undefined) {
                    ket = "&ketpakai=" + $scope.item.ketpakai
                }
                
                medifirstService.get("sysadmin/get-retriksi-diagnosa?"
                    + departemenId
                    + ruanganId
                    + ket
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
            $scope.getEMRByRuangan = function (ruangan) {
                if ($scope.popUp.departemen == undefined) {
                    toastr.error('Departement belum dipilih')
                    return
                }

                $scope.arrayEMRTemp = []
                medifirstService.get("sysadmin/get-mapping-emr?departemenId=" + $scope.popUp.departemen.id
                    +"&ruanganId="+ ruangan.id).then(function (e) {

                        var data = []
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            data.push({ id: element.emrfk, caption: element.caption })

                        }
                        $scope.listEMR = []

                        $scope.arrayEMRTemp = data
                        $scope.listEMR = $scope.listEMRDefault
                        if ($scope.arrayEMRTemp.length > 0) {
                            for (let i = 0; i < $scope.listEMR.length; i++) {
                                const element = $scope.listEMR[i];
                                element.isChecked = false
                                for (let j = 0; j < $scope.arrayEMRTemp.length; j++) {
                                    const elements = $scope.arrayEMRTemp[j];
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
                field: "namadiagnosa",

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
                    {
                        name: "excel", text: "Export Excel",
                    }
                ],
                excel: {
                    fileName: "Data Map Retriksi Obat To Diagnosa_" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                        "width": "5%",
                        "title": "✔",
                        "attributes": { class: "text-center" },
                    },
                    {
                        "field": "namadiagnosa",
                        "title": "Diagnosa",
                        "width": "30%"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "30%"
                    },
                    {

                        "field": "keteranganpakai",
                        "title": "Ket_Pakai",
                        "width": "30%"
                    },
                ]
            };

            $scope.Tambah = function () {
                $scope.arrayEMRTemp = []
                $scope.popUps.center().open();
            }
            $scope.save = function () {

                if ($scope.popUp.ruangan == undefined) {
                    toastr.error('Diagnosa belum dipilih')
                    return
                }
                debugger
                if ($scope.popUp.ketpakai == undefined) {
                    toastr.error('Keterangan belum diisi')
                    return
                }

                if ($scope.arrayEMRTemp.length == 0) {
                    toastr.error('EMR belum di pilih')
                    return
                }

                var objSave = {
                    "ketpakai": $scope.popUp.ketpakai,
                    "diagnosaId": $scope.popUp.ruangan == undefined ? null : $scope.popUp.ruangan.id,
                    "details": $scope.arrayEMRTemp
                }
                medifirstService.post('sysadmin/save-retriksi-diagnosa', objSave).then(function (e) {
                    loadData();

                    $scope.Clear();
                    $scope.clearEMR();
                    $scope.arrayEMRTemp = []
                    $scope.listEMR = $scope.listEMRDefault
                    $scope.popUps.close();

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
                medifirstService.post('sysadmin/delete-retriksi-diagnosa', itemDelete).then(function (e) {

                    loadData();

                })
            }

            $scope.tutup = function () {
                for (let i = 0; i < $scope.listEMR.length; i++) {
                    const element = $scope.listEMR[i];
                    element.isChecked = false

                }
                $scope.arrayEMRTemp = []
                $scope.popUp.cekAll = false
                $scope.popUps.close();
            }

            $scope.cekAll = function (bool) {
                $scope.arrayEMRTemp = []
                if (bool) {
                    $scope.listEMR.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrayEMRTemp.push(e)
                    })
                } else {
                    $scope.listEMR.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrayEMRTemp = []
                    })
                }
                console.log($scope.arrayEMRTemp)
            }
            $scope.cariEMR = function () {

                if ($scope.popUp.cariEMR == undefined || $scope.popUp.cariEMR == "") {
                    $scope.listEMR = $scope.listEMRDefault
                    return
                }

                $scope.listTempEMR = []
                var name = $scope.popUp.cariEMR.toLowerCase()
                for (let i = 0; i < $scope.listEMRDefault.length; i++) {
                    var arr = $scope.listEMRDefault[i].namaproduk.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempEMR.push($scope.listEMRDefault[i])
                    }
                }
                $scope.listEMR = []
                $scope.listEMR = $scope.listTempEMR
                if ($scope.arrayEMRTemp.length > 0) {
                    for (let i = 0; i < $scope.listEMR.length; i++) {
                        const element = $scope.listEMR[i];
                        element.isChecked = false
                        for (let j = 0; j < $scope.arrayEMRTemp.length; j++) {
                            const elements = $scope.arrayEMRTemp[j];
                            if (element.id == elements.id) {
                                element.isChecked = true
                            }
                        }
                    }
                }

            }
            $scope.clearEMR = function () {
                delete $scope.popUp.cariEMR
                // $scope.listEMR = []
                // $scope.listEMR = $scope.listEMRDefault
                if ($scope.arrayEMRTemp.length > 0) {
                    for (let i = 0; i < $scope.arrayEMRTemp.length; i++) {
                        const element = $scope.arrayEMRTemp[i];
                        element.isChecked = false
                        // const element = $scope.listEMR[i];
                        // element.isChecked = false
                        // for (let j = 0; j < $scope.arrayEMRTemp.length; j++) {
                        //     const elements = $scope.arrayEMRTemp[j];
                        //     if (element.id == elements.id) {
                        //         element.isChecked = true
                        //     }
                        // }
                    }
                }
            }
            // $scope.ceklisOne = function (bool, data) {
            //     var index = $scope.arrayEMRTemp.indexOf(data);
            //     if (_.filter($scope.arrayEMRTemp, {
            //         id: data.id
            //     }).length === 0 && bool)

            //         $scope.arrayEMRTemp.push(data);
            //     else
            //         $scope.arrayEMRTemp.splice(index, 1);
            //     // }
            // }
            $scope.ceklisOne = function (bool, data) {
                if (bool) {
                    $scope.listEMR.forEach(function (e) {
                        if (data.id == e.id && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayEMRTemp.splice(e, 1);

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayEMRTemp.push(e)

                        }
                    })
                } else {
                    $scope.listEMR.forEach(function (e) {
                        if (data.id== e.id && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayEMRTemp.push(e)

                        }
                        if (data.id == e.id && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayEMRTemp.splice(e, 1);

                        }
                    })
                }

                // }
                // console.log($scope.arrayEMRTemp)
            }

             /***Upload Excel */
            $("#upload").kendoUpload({
                localization: {
                    "select": "Pilih File Excel..."
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name;
                    if (!stringFile.toLowerCase().includes("data map retriksi obat to diagnosa".toLowerCase())) {
                        toastr.info('Data Map Retriksi Obat To Diagnosa.xlsx', 'Contoh Nama File');
                        toastr.error('Nama File Tidak Sesuai', 'Info');
                        return;
                    }

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
                                    // Here is your object
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    console.log(XL_row_object);
                                    var objSave =
                                    {
                                        data: XL_row_object,
                                        excel: true
                                    }

                                    medifirstService.post('sysadmin/save-retriksi-diagnosa', objSave).then(function (data) {
                                       loadData();
                                    })
                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            })
            /***END Upload Excel */
            

        }
    ]);
});