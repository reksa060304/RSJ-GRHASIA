define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SettingPasswordAutorisasiCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$timeout', 'DateHelper',
        function ($q, $rootScope, $scope, medifirstService, $timeout, DateHelper) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.new = {};
            $scope.now = new Date();
            $scope.item.endDateLogin = $scope.now;
            $scope.item.idlogin = '';
            $scope.isRouteLoading = false;
            $scope.new.jmlRows = 50;
            loadNewUser()

            $scope.optionGridNewUser = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="addNewUser()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "25px",
                    },
                    {
                        "field": "namaautorisasi",
                        "title": "Nama Autorisasi",
                        "width": "150px",
                    },
                    {
                        "field": "keteranganfungsi",
                        "title": "Keterangan Fungsi",
                        "width": "250px",
                    },
                    {
                        "field": "kelompok",
                        "title": "Kelompok",
                        "width": "150px",
                    },
                    {
                        command: [
                            { name: "edit", text: "Edit", click: editNewUser },
                            { text: "Ubah Password", click: editPassCode, imageClass: "k-icon k-edit" },
                            { text: "Hapus", click: hapusNewUser, imageClass: "k-icon k-delete" }
                        ], title: "&nbsp;", width: "100px",
                    }
                ],
            };

            function loadNewUser() {
                var keteranganFungsi = ""
                if ($scope.new.cariKetFungsi != undefined) {
                    var keteranganFungsi = "&keteranganFungsi=" + $scope.new.cariKetFungsi
                }
                var namaAutorisasi = ""
                if ($scope.new.cariNamaAuth != undefined) {
                    var namaAutorisasi = "&namaAutorisasi=" + $scope.new.cariNamaAuth
                }
                var KelompokAutorisasi = ""
                if ($scope.new.cariKelAuth != undefined) {
                    var KelompokAutorisasi = "&KelompokAutorisasi=" + $scope.new.cariKelAuth
                }
                var jmlRow = ""
                if ($scope.new.jmlRows != undefined) {
                    jmlRow = "&jmlRows=" + $scope.new.jmlRows
                }

                medifirstService.get('sysadmin/menu/get-data-auth-password?'
                    + keteranganFungsi
                    + namaAutorisasi
                    + KelompokAutorisasi
                    + jmlRow
                ).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        e.data.data[i].no = i + 1;
                    }
                    $scope.sourceNewUser = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 20,
                        total: e.data.data,
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

            $scope.reset = function () {
                loadNewUser();
            }

            $scope.addNewUser = function () {
                $scope.item.idlogin = '';
                $scope.dialogPopup.center().open()
            }

            $scope.saveNewUser = function () {
                if ($scope.item.keteranganFungsi == undefined) {
                    toastr.error('Keterangan Fungsi Harus di isi', 'Error')
                    return
                }
                if ($scope.item.namaAutorisasi == undefined) {
                    toastr.error('Nama Autorisasi Harus di isi', 'Error')
                    return
                }
                if ($scope.item.kataKunciPass == undefined) {
                    toastr.error('Kata Kunci Harus di isi', 'Error')
                    return
                }
                if ($scope.item.kataKunciConfirm == undefined) {
                    toastr.error('Kata Kunci Ulang Harus di isi', 'Error')
                    return
                }
                if ($scope.item.kataKunciPass != $scope.item.kataKunciConfirm) {
                    toastr.error('Kata kunci tidak sama', 'Error')
                    return
                }
                var objSave = {
                    'id': $scope.item.idlogin,
                    'keteranganfungsi': $scope.item.keteranganFungsi,
                    'passcode': $scope.item.kataKunciPass,
                    'namaautorisasi': $scope.item.namaAutorisasi,
                    'kelompok': $scope.item.KelompokAutorisasi != undefined ? $scope.item.KelompokAutorisasi : null,
                }
                medifirstService.post('sysadmin/menu/save-auth-password', objSave).then(function (e) {
                    $scope.item.idlogin = ''
                    delete $scope.item.keteranganFungsi;
                    delete $scope.item.kataKunciPass;
                    delete $scope.item.kataKunciConfirm;
                    delete $scope.item.namaAutorisasi;
                    delete $scope.item.KelompokAutorisasi;
                    $scope.dialogPopup.close();
                    loadNewUser();
                })
            }

            function hapusNewUser(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                var objSave = {
                    'id': dataItem.id,
                }
                medifirstService.post('sysadmin/menu/delete-auth-password', objSave).then(function (e) {
                    loadNewUser()
                }, function (error) {
                    toastr.error(JSON.stringify(error), 'Error')
                })
            }

            function editNewUser(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.isEdit = true
                medifirstService.get('sysadmin/menu/get-data-auth-password?idAuth=' + dataItem.id).then(function (e) { })
                $scope.item.idlogin = dataItem.id
                $scope.item.keteranganFungsi = dataItem.keteranganfungsi;
                $scope.item.namaAutorisasi = dataItem.namaautorisasi;
                $scope.item.KelompokAutorisasi = dataItem.kelompok;
                $scope.dialogPopup.center().open();
            }

            function editPassCode(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.isEdit = true
                medifirstService.get('sysadmin/menu/get-data-auth-password?idAuth=' + dataItem.id).then(function (e) { })
                $scope.item.idlogin = dataItem.id;
                $scope.dialogGantiPass.center().open();
            }

            $scope.batalNewUser = function () {
                $scope.item.idlogin = ''
                delete $scope.item.keteranganFungsi;
                delete $scope.item.kataKunciPass;
                delete $scope.item.kataKunciConfirm;
                delete $scope.item.namaAutorisasi;
                delete $scope.item.KelompokAutorisasi;
                $scope.dialogPopup.close();
            }

            $scope.batalGantiPass = function () {
                $scope.item.idlogin = '';
                delete $scope.item.kataKunci;
                delete $scope.item.kataKunciFix;
                $scope.dialogGantiPass.close()
            }

            $scope.saveGantiPass = function () {
                if ($scope.item.idlogin == undefined) {
                    toastr.error('Data Tidak Ditemukan', 'Error')
                    return
                }
                if ($scope.item.kataKunci == undefined) {
                    toastr.error('Kata Kunci Harus di isi', 'Error')
                    return
                }
                if ($scope.item.kataKunciFix == undefined) {
                    toastr.error('Kata Kunci Ulang Harus di isi', 'Error')
                    return
                }
                if ($scope.item.kataKunci != $scope.item.kataKunciFix) {
                    toastr.error('Kata kunci tidak sama', 'Error')
                    return
                }

                var objSave = {
                    'id': $scope.item.idlogin,                    
                    'passcode': $scope.item.kataKunci,
                }

                medifirstService.post('sysadmin/menu/update-auth-password', objSave).then(function (e) {                    
                    $scope.item.idlogin = '';
                    delete $scope.item.kataKunci;
                    delete $scope.item.kataKunciFix;
                    $scope.dialogGantiPass.close()
                    loadNewUser();
                })
            }
            // **  BATAS */
        }
    ]);
});