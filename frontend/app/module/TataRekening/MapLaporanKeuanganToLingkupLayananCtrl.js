define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapLaporanKeuanganToLingkupLayananCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            var idProduk = 0;
            Init();
            LoadData();

            function Init() {
                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDataDepartemen = data;
                });                

                medifirstService.get("sysadmin/general/get-lingkuppelayanan", true).then(function (dat) {
                    $scope.listLingkupPelayanan = dat.data;
                });

                medifirstService.getPart("sysadmin/general/get-produk", true, true, 20).then(function (data) {
                    $scope.listpelayanan = data;
                });
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.Departemen != undefined) {
                    var ins = "&objectdepartemenfk=" + $scope.item.Departemen.value
                }
                var rg = ""
                if ($scope.item.pelayanan != undefined) {
                    var rg = "&produkfk=" + $scope.item.pelayanan.id
                }
                var kp = ""
                if ($scope.item.LingkupLayanan != undefined) {
                    var kp = "&lingkuppelayananfk=" + $scope.item.LingkupLayanan.id
                }

                medifirstService.get("sysadmin/general/get-data-maplingkuppelayanan?" + ins + rg + kp, true).then(function (data) {
                    $scope.isRouteLoading = false;
                    var data = data.data.listmap
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = 1 + i; 
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data,
                        pageSize: 200,
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

            $scope.findData = function(){
                LoadData();
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
                $scope.item.id = dataSelected.maid
                $scope.item.pelayanan = { id: dataSelected.produkfk, namaproduk: dataSelected.namaproduk };
                $scope.item.LingkupLayanan = { id: dataSelected.lingkuppelayananfk, lingkuppelayanan: dataSelected.lingkuppelayanan };
                $scope.item.Departemen = { id: dataSelected.objectdepartemenfk, namadepartemen: dataSelected.namadepartemen };
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.kosongkan = function () {
                kosong();
            }

            function kosong() {
                $scope.item.Departemen = undefined;
                $scope.item.LingkupLayanan = undefined;
                $scope.item.id = ''
                $scope.item.pelayanan = undefined;
            }

            $scope.tambahData = function () {
                if ($scope.item.pelayanan == undefined) {
                    alert("Pilih Pelayanan!!")
                    return;
                }

                if ($scope.item.LingkupLayanan == undefined) {
                    alert("Pilih Lingkup Pelayanan!!")
                    return;
                }

                var maid = '';
                if ($scope.item.id != undefined) {
                    maid = $scope.item.id
                }

                var objSave = {
                    maid: maid,
                    pelayanan: $scope.item.pelayanan.id,
                    departemen: $scope.item.Departemen != undefined ? $scope.item.Departemen.value : null,
                    lingkuppelayananfk: $scope.item.LingkupLayanan.id,
                    status: 'SIMPAN_JANG'
                }

                medifirstService.post('sysadmin/general/save-map-laporankeuanganlingkuppelayanan', objSave).then(function (e) {
                    kosong();
                    LoadData();
                })

            }

            $scope.hapusData = function () {
                if ($scope.item.pelayanan == undefined) {
                    alert("Pilih pelayanan!!")
                    return;
                }                
                var maid = '';
                if ($scope.item.id != undefined) {
                    maid = $scope.item.id
                }
               
                var objSave = {
                    maid: maid,
                    pelayanan: $scope.item.pelayanan.id,
                    departemen: $scope.item.Departemen != undefined ? $scope.item.Departemen.value : null,
                    lingkuppelayananfk: $scope.item.LingkupLayanan.id,                   
                    status: 'HAPUS'
                }

                medifirstService.post('sysadmin/general/save-map-laporankeuanganlingkuppelayanan', objSave).then(function (e) {
                    kosong();
                    LoadData();
                })
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaproduk",
                    "title": "Pelayanan",
                    "width": "80px",
                },
                {
                    "field": "lingkuppelayanan",
                    "title": "Lingkup Pelayanan",
                    "width": "80px",
                },
                {
                    "field": "namadepartemen",
                    "title": "Departemen",
                    "width": "80px",
                }
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.getdetailHarga = function () {
                getKomponenHarga()
            }

            //** BATAS SUCI */
        }
    ]);
});
