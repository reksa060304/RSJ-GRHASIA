define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapKelompokPenghasilCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.item = {};
            $scope.popUp = {};
            $scope.item.jmlRow = 100;
            $scope.arrayProdukTemp = []
            $scope.isRouteLoading = false;
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);
            $scope.item.tglAwal = firstDay
            $scope.item.tglAkhir = lastDay
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
            medifirstService.get("remunerasi/get-combo-mapping-kelompok").then(function (data) {
                $scope.listRuangan = data.data.ruangan
                $scope.listProduk = data.data.pegawai
                $scope.listProdukDefault = data.data.pegawai
            })

            function loadData() {
                $scope.isRouteLoading = true;

                var paketId = ""
                if ($scope.item.qPegawai != undefined) {
                    paketId = "&pegawai=" + $scope.item.qPegawai
                }
                var namaProduk = ""
                if ($scope.item.qRuangan != undefined) {
                    namaProduk = "&ruangId=" + $scope.item.qRuangan.id
                }
                var tglAwal = ""
                if ($scope.item.tglAwal != undefined) {
                    tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD')
                }
                var tglAkhir = ""
                if ($scope.item.tglAkhir != undefined) {
                    tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD')
                }
                var jmlRow = ""
                if ($scope.item.jmlRow != undefined) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }
                medifirstService.get("remunerasi/get-mapping-kelompok?"
                    + paketId
                    + namaProduk
                    + tglAwal
                    + tglAkhir
                    + jmlRow
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
            $scope.$watch('popUp.namaRuangan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.getProdukByPaket()
                }
            });
            $scope.$watch('popUp.tglAwal', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.getProdukByPaket()
                }
            });
            $scope.$watch('popUp.tglAkhir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.getProdukByPaket()
                }
            });
            $scope.getProdukByPaket = function () {
                $scope.arrayProdukTemp = []
                if ($scope.popUp.namaRuangan == undefined) return

                if ($scope.popUp.tglAwal == undefined) return
                var tglAwal = "&tglAwal=" + moment($scope.popUp.tglAwal).format('YYYY-MM-DD')

                if ($scope.popUp.tglAkhir == undefined) return
                var tglAkhir = "&tglAkhir=" + moment($scope.popUp.tglAkhir).format('YYYY-MM-DD')

                medifirstService.get("remunerasi/get-mapping-kelompok?ruangId="
                    + $scope.popUp.namaRuangan.id
                    + tglAwal
                    + tglAkhir).then(function (e) {

                        // $scope.listTempProduk = []
                        // var name = $scope.popUp.cariProduk.toLowerCase()
                        // for (let i = 0; i < $scope.listProdukDefault.length; i++) {
                        //     var arr = $scope.listProdukDefault[i].namaproduk.toLowerCase()
                        //     if (arr.indexOf(name) != -1) {
                        //         $scope.listTempProduk.push($scope.listProdukDefault[i])
                        //     }
                        // }
                        var data = []
                        for (let i = 0; i < e.data.data.length; i++) {
                            const element = e.data.data[i];
                            data.push({ id: element.objectpegawaifk, namalengkap: element.namalengkap })

                        }
                        $scope.listProduk = []

                        $scope.arrayProdukTemp = data
                        $scope.listProduk = $scope.listProdukDefault
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
                            $scope.listProduk.sort(function (a, b) {
                                if (a.isChecked < b.isChecked) { return 1; }
                                if (a.isChecked > b.isChecked) { return -1; }
                                return 0;
                            })

                        }
                    })

            }

            $scope.group = {
                field: "namaruangan",

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
                        "width": "30px",
                        "title": "✔"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "200px"
                    },
                    {

                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "200px"
                    },
                    {

                        "field": "tglawal",
                        "title": "Dari",
                        "width": "100px"
                    },
                    {

                        "field": "tglakhir",
                        "title": "Sampai",
                        "width": "100px"
                    },
                    // {
                    //     "command": [

                    //         {
                    //             text: "Hapus",
                    //             click: hapusData,
                    //             imageClass: "k-icon k-delete"
                    //         }],
                    //     title: "",
                    //     width: "20px",
                    // }

                ]
            };

            $scope.Tambah = function () {
                $scope.arrayProdukTemp = []
                if ($scope.listProduk.length > 0) {
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
                        element.isChecked = false
                    }
                }
                $scope.popUps.center().open();
            }
            $scope.save = function () {

                if ($scope.popUp.namaRuangan == undefined) {
                    toastr.error('Nama Paket belum dipilih')
                    return
                }
                if ($scope.popUp.tglAwal == undefined) {
                    toastr.error('Periode Awal belum dipilih')
                    return
                }
                if ($scope.popUp.tglAkhir == undefined) {
                    toastr.error('Periode Akhir belum dipilih')
                    return
                }
                // if ($scope.popUp.jenisDiet == undefined) {
                //     toastr.error('Jenis Diet belum di pilih')
                //     return
                // }
                // if ($scope.popUp.jensiWaktu == undefined) {
                //     toastr.error('Jenis Waktu belum di pilih')
                //     return
                // }
                // if ($scope.arrayKelasCek.length == 0) {
                //     toastr.error('Kelas belum di pilih')
                //     return
                // }
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Pegawai belum di pilih')
                    return
                }
                // var arraySave = []
                // for (let i = 0; i < $scope.arrayProdukTemp.length; i++) {
                //     const element = $scope.arrayProdukTemp[i];
                //     for (let j = 0; j < $scope.arrayKelasCek.length; j++) {
                //         const elements = $scope.arrayKelasCek[j];
                //         arraySave.push({
                //             "produkfk": element.id,
                //             "kelasfk": elements.id
                //         })
                //     }
                // }
                // console.log(arraySave)
                // return

                var objSave = {
                    "ruanganId": $scope.popUp.namaRuangan.id,
                    "tglawal": moment($scope.popUp.tglAwal).format('YYYY-MM-DD'),
                    "tglakhir": moment($scope.popUp.tglAkhir).format('YYYY-MM-DD'),
                    "details": $scope.arrayProdukTemp
                }
                medifirstService.post('remunerasi/save-map-kelompok', objSave).then(function (e) {
                    $scope.popUps.close();
                    loadData();

                    $scope.arrayProdukTemp = []
                    $scope.listProduk = $scope.listProdukDefault
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
                    data.push({ id: element.id })
                }
                var itemDelete = {
                    "data": data
                }
                medifirstService.post('remunerasi/delete-map-kelompok', itemDelete).then(function (e) {

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

                managePhp.postData2('remunerasi/delete-map-kelompok', itemDelete).then(function (e) {
                    if (e.status === 201) {
                        loadData();
                        grid.removeRow(row);
                    }
                })

            }

            $scope.tutup = function () {
                for (let i = 0; i < $scope.listProduk.length; i++) {
                    const element = $scope.listProduk[i];
                    element.isChecked = false

                }
                $scope.arrayProdukTemp = []
                $scope.popUps.close();
            }

            $scope.cekAll = function (bool) {
                $scope.arrayProdukTemp = []
                if (bool) {
                    $scope.listProduk.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrayProdukTemp.push(e)
                    })
                } else {
                    $scope.listProduk.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrayProdukTemp = []
                    })
                }
                console.log($scope.arrayProdukTemp)
            }
            $scope.cariProduk = function () {

                if ($scope.popUp.cariProduk == undefined || $scope.popUp.cariProduk == "") {
                    $scope.listProduk = $scope.listProdukDefault
                    return
                }

                $scope.listTempProduk = []
                var name = $scope.popUp.cariProduk.toLowerCase()
                for (let i = 0; i < $scope.listProdukDefault.length; i++) {
                    var arr = $scope.listProdukDefault[i].namalengkap.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempProduk.push($scope.listProdukDefault[i])
                    }
                }
                $scope.listProduk = []
                $scope.listProduk = $scope.listTempProduk
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
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
            $scope.clearProduk = function () {
                delete $scope.popUp.cariProduk
                $scope.listProduk = []
                $scope.listProduk = $scope.listProdukDefault
                if ($scope.arrayProdukTemp.length > 0) {
                    for (let i = 0; i < $scope.listProduk.length; i++) {
                        const element = $scope.listProduk[i];
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
            // $scope.ceklisOne = function (bool, data) {
            //     var index = $scope.arrayProdukTemp.indexOf(data);
            //     if (_.filter($scope.arrayProdukTemp, {
            //         id: data.id
            //     }).length === 0 && bool)

            //         $scope.arrayProdukTemp.push(data);
            //     else
            //         $scope.arrayProdukTemp.splice(index, 1);
            //     // }
            // }
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
                        if (data.id == e.id && bool == e.isChecked) {
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

                // }
                console.log($scope.arrayKelasCek)
            }
            // intervensi

        }
    ]);
});