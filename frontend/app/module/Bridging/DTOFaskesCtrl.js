define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DTOFaskesCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService, $mdDialog) {
            $scope.now = new Date();
            $scope.isSave = true;
            $scope.itemsave = {}
            $scope.item = {}
            $scope.item.start = 1
            $scope.item.limit = 10

            $scope.isRouteLoading = false;
            $scope.isShowPotensi = true;
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            medifirstService.get("bridging/newallrecord/list-lokasi/20000/1").then(function (e) {
                var data = []
                for (let i = 0; i < e.data.data.length; i++) {
                    const element = e.data.data[i];
                    if(element.kode.length == 4) {
                        data.push(element)
                    }
                }
                $scope.listkabkot = data

            })
            loadFaskes();

            $scope.cari = function () {
                loadFaskes()
            }

            function loadFaskes() {
                var start = 1
                if ($scope.item.start != undefined) {
                    start = $scope.item.start
                }
                var limit = 10
                if ($scope.item.limit != undefined) {
                    limit = $scope.item.limit
                }
                $scope.isRouteLoading = true
                medifirstService.get(`bridging/newallrecord/list-faskes/${limit}/${start}`).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.data != undefined && e.data.data != null) {
                        for (var i = 0; i < e.data.data.length; i++) {
                            e.data.data[i].no = i + 1
                        }
                        $scope.dataSourceBrid = new kendo.data.DataSource({
                            data: e.data.data,
                            pageSize: 10,
                            serverPaging: false,


                        });
                    } else {
                        toastr.info("Gagal memuat data.", 'Info')
                    }
                })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(new Date(tanggal)).format("DD MMM YYYY HH:mm")
            }
            $scope.columnGridBrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "faskes_kode",
                    "title": "Kode Faskes",
                    "width": "50px",
                },
                {
                    "field": "faskes_nama",
                    "title": "Nama Faskes",
                    "width": "80px",
                },
                {
                    "field": "kabkot_nama",
                    "title": "Kabupaten/Kota",
                    "width": "50px",
                }, {

                    "field": "provinsi_nama",
                    "title": "Provinsi",
                    "width": "100px",
                },
                {
                    "command": [
                        { text: "Detail", click: DetailFaskes },
                    ],
                    title: "#",
                    width: "10%",
                }
            ]
            function DetailFaskes(e) 
            {
                $scope.isRouteLoading = true;
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get(`bridging/newallrecord/detail-faskes/${dataItem.id}`).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.listDataDetails = e.data.data;
                    $scope.popupDetail.center().open()
                })
            }
            $scope.tutup = function () {
                $scope.popupDetail.close()

            }
            $scope.klikGrid = function(dataSelected){
                $scope.dataSelected = dataSelected;
            }
            $scope.tambah = function (){
                $scope.itemsave = {};
                $scope.isSave = true;
                $scope.popUpTambah.center().open()
            }
            $scope.ubah = function (){
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data yang mau diubah')
                    return
                }
                medifirstService.get(`bridging/newallrecord/detail-faskes/${$scope.dataSelected.id}`).then(function (e) {
                    var data = e.data.data;
                    var textkabkot = ""
                    for (let i = 0; i < $scope.listkabkot.length; i++) {
                        if($scope.listkabkot[i].kode == data.kabkot_kode) {
                            textkabkot = $scope.listkabkot[i].nama
                            break;
                        }
                    }

                    $scope.itemsave.faskes_id = data.id
                    $scope.itemsave.kodefaskes = data.kode
                    $scope.itemsave.namafaskes = data.nama
                    $scope.itemsave.kabkot = { kode: data.kabkot_kode, nama: textkabkot }
                    $scope.itemsave.namapj = data.nama_pj
                    $scope.itemsave.telepon = data.telepon
                    $scope.itemsave.email = data.email
                    $scope.itemsave.lat = data.lat
                    $scope.itemsave.long = data.lon

                    $scope.isSave = false;
                    $scope.popUpTambah.center().open()
                })
            }
            $scope.hapus = function (){
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent(`Yakin mau menghapus data faskes ${$scope.dataSelected.faskes_nama} ?`)
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var objDelete = {
                        "data": {
                            "faskes_id":$scope.dataSelected.id
                        }
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/newallrecord/delete-faskes", objDelete).then(function (e) {
                        toastr.success(e.data.status);
                        loadFaskes()
                        $scope.batal();
                    })
                })
            }
            $scope.save = function () {
                if ($scope.itemsave.kodefaskes == undefined) {
                    toastr.error('Kode Faskes harus diisi')
                    return
                }
                if ($scope.itemsave.namafaskes == undefined) {
                    toastr.error('Nama Faskes harus diisi')
                    return
                }
                if ($scope.itemsave.kabkot == undefined) {
                    toastr.error('Kabupaten / Kota harus diisi')
                    return
                }

                var objSave = {
                    "data": {
                        "kode": $scope.itemsave.kodefaskes,
                        "nama": $scope.itemsave.namafaskes,
                        "kabkot_kode": $scope.itemsave.kabkot.kode,
                        "nama_pj": $scope.itemsave.namapj,
                        "telepon": $scope.itemsave.telepon,
                        "email": $scope.itemsave.email,
                        "lat": $scope.itemsave.lat,
                        "lon": $scope.itemsave.long,
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/newallrecord/add-faskes", objSave).then(function (e) {
                    toastr.success(e.data.status);
                    loadFaskes()
                    $scope.batal();
                })
            }
            $scope.update = function () {
                if ($scope.itemsave.kodefaskes == undefined) {
                    toastr.error('Kode Faskes harus diisi')
                    return
                }
                if ($scope.itemsave.namafaskes == undefined) {
                    toastr.error('Nama Faskes harus diisi')
                    return
                }
                if ($scope.itemsave.kabkot == undefined) {
                    toastr.error('Kabupaten / Kota harus diisi')
                    return
                }

                var objSave = {
                    "data": {
                        "faskes_id":$scope.itemsave.faskes_id,
                        "kode": $scope.itemsave.kodefaskes,
                        "nama": $scope.itemsave.namafaskes,
                        "kabkot_kode": $scope.itemsave.kabkot.kode,
                        "nama_pj": $scope.itemsave.namapj,
                        "telepon": $scope.itemsave.telepon,
                        "email": $scope.itemsave.email,
                        "lat": $scope.itemsave.lat,
                        "lon": $scope.itemsave.long,
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/newallrecord/update-faskes", objSave).then(function (e) {
                    toastr.success(e.data.status);
                    loadFaskes()
                    $scope.batal();
                })
            }
            $scope.batal = function () {
                $scope.isRouteLoading = false;
                $scope.itemsave = {};
                $scope.popUpTambah.close();
            }
        }
    ]);
});