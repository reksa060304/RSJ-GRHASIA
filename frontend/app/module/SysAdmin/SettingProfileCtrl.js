define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SettingProfileCtrl', ['$scope', '$mdDialog', 'MedifirstService', 'CacheHelper', '$state',
        function ($scope, $mdDialog, medifirstService, cacheHelper, $state) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.shwProfile = false;
            $scope.shwLogin = true;
            FormLoad();            

            function FormLoad() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/get-list-combo", true).then(function (dat) {                    
                    $scope.PassTea = dat.data.pass;
                    $scope.isRouteLoading = false;
                    var chacePeriode = cacheHelper.get('SettingProfileCtrl');
				    if (chacePeriode != undefined) {
                        if (chacePeriode[0] == $scope.PassTea) {
                            $scope.shwProfile = true;
                            $scope.shwLogin = false;
                            loadData();
                        }else{
                            $scope.shwProfile = false;
                            $scope.shwLogin = true;
                        }
                    }
                })
            }            

            function LanjutKan(){
                if ($scope.item.kataKunciPass == $scope.PassTea) {
                    $scope.shwProfile = true;
                    $scope.shwLogin = false;
                    loadData();
                    var chacePeriode = {
						0: $scope.item.kataKunciPass,
						1: '',
						2: '',
						3: '',					
					}
					cacheHelper.set('SettingProfileCtrl', chacePeriode);
                } else if ($scope.item.kataKunciPass == undefined) {
                    toastr.error("Password Belum Diisi !!!")                    
                }else{
                    toastr.error("Password Salah Anda Tidak Bisa Akses Menu Ini !!!")                    
                }
            }

            $scope.Lanjut = function(){
                LanjutKan();
            }

            $scope.LanjutMenu = function () {
                LanjutKan();
            }

            $scope.search = function () {
                loadData()
            }

            $scope.clear = function () {
                clearItemSearch()
                loadData()
            }

            function clearItemSearch() {
                delete $scope.filterKeterangan
                delete $scope.filterNama
                delete $scope.filterNilai
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var ketFungsi = "";
                if ($scope.filterKeterangan != undefined) {
                    ketFungsi = "&namaProfile=" + $scope.filterKeterangan
                }
                var namaFild = "";
                if ($scope.filterAlamat != undefined) {
                    namaFild = "&alamatlengkap=" + $scope.filterAlamat
                }

                var nilaiField = "";
                if ($scope.filterNilai != undefined) {
                    nilaiField = "&idJenisProfile=" + $scope.filterNilai
                }
                medifirstService.get("sysadmin/get-data-profile?"
                    + nilaiField
                    + ketFungsi
                    + namaFild).then(function (data) {
                        let array = data.data.profile
                        $scope.isRouteLoading = false;
                        if (array.length > 0) {
                            $scope.item.status = []
                            $scope.listGrid = []
                            for (let i = 0; i < array.length; i++) {
                                var data = array[i];
                                data.no = i + 1;
                                if (data.statusenabled == 1) {
                                    data.statusenabled = true;
                                } else {
                                    data.statusenabled = false;
                                }
                                // let datas = []
                                // $scope.listGrid.push(array[i])
                                // datas.push(array[i].statusenabled)
                                // $scope.item.status[array[i].id] = array[i].statusenable                                
                            }
                        }

                        $scope.isRouteLoading = false;
                        $scope.dataSource = new kendo.data.DataSource({
                            data: array,
                            pageSize: 10,
                            total: array.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        statusenabled: { type: "boolean" },
                                    }
                                }
                            }
                        });
                    }, function (error) {
                        $scope.isRouteLoading = false;
                    })
            }

            $scope.columnProduk = [
                {
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "idprofile",
                    "title": "<h3 align=center>Id Profile<h3>",
                    "width": "60px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "statusenabled",
                    "title": "<h3 align=center>Status Enabled<h3>",
                    "width": "45px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "namaprofile",
                    "title": "<h3 align=center>Profile<h3>",
                    "width": "300px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "jenisprofile",
                    "title": "<h3 align=center>Jenis Profile<h3>",
                    "width": "100px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "alamatlengkap",
                    "title": "<h3 align=center>Alamat<h3>",
                    "width": "300px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "website",
                    "title": "<h3 align=center>Website<h3>",
                    "width": "150px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "field": "gambarlogo",
                    "title": "<h3 align=center>Logo<h3>",
                    "width": "100px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        // style: "text-align: center;"
                    }
                },
                {
                    "command": [
                        { text: "Enable ", click: enableData, imageClass: "k-icon k-update", className: "btn-enabled", },
                        { text: "Disable", click: disableData, imageClass: "k-icon k-delete", className: "btn-disabled", },
                        { text: "Edit   ", click: EditData, imageClass: "k-icon k-i-pencil", className: "btn-edit", },
                    ],
                    title: "<h3 align=center><h3>",
                    width: "200px",
                }
            ];


            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr");
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var statusenabled = kendoGrid.dataItem(row).statusenabled;
                    if (statusenabled == false) {                      
                        $(row.cells).addClass("red");
                    }else if (statusenabled == true) {
                        $(row.cells).addClass("green");
                    }
                }
                // $('td').each(function () {
                //     if ($(this).text() == 'false') { $(row.cells).addClass('red') }
                //     if ($(this).text() == 'true') { $(row.cells).addClass('green') }
                // })
            }

            $scope.mainGridOptions = {
                // toolbar: [
                //     {
                //         name: "create", text: "Tambah",
                //         template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                //     }
                // ],
                pageable: true,
                columns: $scope.columnProduk,
                editable: "popup",
                selectable: "row",
                scrollable: false,
                dataBound: onDataBound,
            };

            function disableData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Akan Merubah Status Data Menjadi Disable?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var objSave = {
                        "id": dataItem.idprofile,
                        "status": 0//'f'
                    }
                    medifirstService.post('sysadmin/save-statusenabled-profile', objSave).then(function (e) {
                        loadData();
                    })
                })
            };

            function enableData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Akan Merubah Status Data Menjadi Enable?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var objSave = {
                        "id": dataItem.idprofile,
                        "status": 1//'t'
                    }
                    medifirstService.post('sysadmin/save-statusenabled-profile', objSave).then(function (e) {
                        loadData();
                    })
                })
            };

            function EditData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    toastr.error("Data Belum Dipilih!")
                    return;
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Akan Merubah Data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var chacePeriode = {
                        0: dataItem.idprofile,
                        1: 'EditProfile',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('DataProfileCtrl', chacePeriode);
                    $state.go('DataProfile')
                })
            };

            $scope.add = function () {
                $scope.item = {}
                $scope.dialogPopup.center().open()
            }

            $scope.batal = function () {
                $scope.dialogPopup.close()
            }

            $scope.Tambah = function(){            
                var chacePeriode = {
                    0: '',
                    1: 'InputProfile',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DataProfileCtrl', chacePeriode);
                $state.go('DataProfile')
            }

            $scope.save = function () {
                if ($scope.item.namaField == undefined) {
                    toastr.error("Nama Field harus di isi!")
                    return
                }
                if ($scope.item.nilaiField == undefined) {
                    toastr.error("Nilai Field harus di isi!")
                    return
                }

                var id = "";
                if ($scope.item.id != undefined) {
                    id = $scope.item.id
                }

                var ketFungsi = "";
                if ($scope.item.ketFungsi != undefined) {
                    ketFungsi = $scope.item.ketFungsi
                }

                var tabelRelasi = "";
                if ($scope.item.tabelRelasi != undefined)
                    tabelRelasi = $scope.item.tabelRelasi

                var typeField = "";
                if ($scope.item.typeField != undefined) {
                    typeField = $scope.item.typeField
                }

                var ket = "";
                if ($scope.item.keteranganFungsi != undefined) {
                    ket = $scope.item.keteranganFungsi
                }
                var data = {
                    "iddatafixed": id,
                    "namafield": $scope.item.namaField,
                    "nilai": $scope.item.nilaiField,
                    "tabelrelasi": tabelRelasi,
                    "kodeexternal": null,
                    "namaexternal": null,
                    "reportdisplay": null,
                    "fieldkeytabelrelasi": null,
                    "fieldreportdisplaytabelrelasi": null,
                    "keteranganfungsi": ketFungsi,
                    "typefield": typeField,
                }

                var objSave =
                {
                    datafixed: data
                }

                medifirstService.post('sysadmin/settingdatafixed/post-settingdatafixe', objSave).then(function (e) {
                    loadData()
                    $scope.item = {};

                });
            }
        }
    ]);
});
