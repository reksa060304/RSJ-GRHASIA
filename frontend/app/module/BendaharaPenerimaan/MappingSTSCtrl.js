define(['initialize', 'Configuration'], function(initialize, configuration) {
    'use strict';
    initialize.controller('MappingSTSCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper',
        function($q, $rootScope, $scope, MedifirstService, $state, CacheHelper) {
            $scope.dataVOloaded = true;
            $scope.item = {
                kelompokPasien: [],
                ruangan: [],
                kelas: [],
                produk: []
            };
            $scope.isAdding = false;
            $scope.isEditing = false;
            $scope.selectedType = 1; // Default Tipe 1
            $scope.selectedTypeLabel = "General";
            $scope.selectedTabIndex = 0; // Default index md-tabs

            $scope.selectTab = function(index) {
                $scope.selectedType = index;
                $scope.selectedTypeLabel = index == 1 ? "General" : (index == 2 ? "Produk Spesifik" : "Non-Layanan");
                $scope.cancel();
            };

            $scope.$watch('selectedTabIndex', function(newVal, oldVal) {
                if (newVal !== undefined) {
                    $scope.selectedType = newVal + 1;
                    $scope.selectedTypeLabel = $scope.selectedType == 1 ? "General" : ($scope.selectedType == 2 ? "Produk Spesifik" : "Non-Layanan");
                    // Only reset form if tab actually changed (not initial load) and not in edit/add mode
                    if (newVal !== oldVal && !$scope.isEditing && !$scope.isAdding) {
                        $scope.cancel();
                    }
                }
            });

            $scope.multiSelectOptions = {
                dataTextField: "text",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.isRouteLoading = false;
            
            var init = function() {
                $scope.isRouteLoading = true;
                $q.all([loadCombo(), loadData()]).then(function() {
                    $scope.isRouteLoading = false;
                });
            };

            var loadCombo = function() {
                var deferred = $q.defer();
                MedifirstService.get("bendaharapenerimaan/get-combo-mapping-bku").then(function(res) {
                    $scope.listRekening = res.data.rekening;
                    $scope.listRuangan = res.data.ruangan;
                    $scope.listKelompokPasien = res.data.kelompokpasien;
                    $scope.listKelas = res.data.kelas;
                    $scope.listProduk = res.data.produk;
                    deferred.resolve();
                }, function() { deferred.reject(); });
                return deferred.promise;
            };

            var loadData = function() {
                var deferred = $q.defer();
                MedifirstService.get("bendaharapenerimaan/get-mapping-bku").then(function(res) {
                    $scope.dataSourceTipe1 = new kendo.data.DataSource({
                        data: res.data.tipe1,
                        pageSize: 10
                    });
                    $scope.dataSourceTipe2 = new kendo.data.DataSource({
                        data: res.data.tipe2,
                        pageSize: 10
                    });
                    $scope.dataSourceTipe3 = new kendo.data.DataSource({
                        data: res.data.tipe3,
                        pageSize: 10
                    });
                    deferred.resolve();
                }, function() { deferred.reject(); });
                return deferred.promise;
            };

            init();

            var gridCommon = {
                selectable: "row",
                pageable: true,
                editable: false,
                columns: [
                    { field: "koderekening", title: "Kode Rekening", width: "120px" },
                    { field: "namarekening", title: "Nama Rekening", width: "200px" }
                ]
            };

            $scope.gridTipe1 = {
                selectable: gridCommon.selectable,
                pageable: gridCommon.pageable,
                columns: [
                    gridCommon.columns[0],
                    gridCommon.columns[1],
                    { field: "objectkelompokpasienfk_names", title: "Kelompok Pasien", width: "150px" },
                    { field: "objectruanganfk_names", title: "Ruangan", width: "200px" },
                    { field: "objectkelasfk_names", title: "Kelas", width: "100px" },
                    { field: "isobat", title: "Obat?", width: "70px", template: "#= isobat == 't' ? 'Ya' : '-' #" },
                    {
                        command: [
                            { text: "Edit", click: editData },
                            { text: "Hapus", click: deleteData }
                        ], title: "", width: "160px"
                    }
                ]
            };

            $scope.gridTipe2 = {
                selectable: gridCommon.selectable,
                pageable: gridCommon.pageable,
                columns: [
                    gridCommon.columns[0],
                    gridCommon.columns[1],
                    { field: "objectprodukfk_names", title: "Produk", width: "300px" },
                    {
                        command: [
                            { text: "Edit", click: editData },
                            { text: "Hapus", click: deleteData }
                        ], title: "", width: "160px"
                    }
                ]
            };

            $scope.gridTipe3 = {
                selectable: gridCommon.selectable,
                pageable: gridCommon.pageable,
                columns: [
                    gridCommon.columns[0],
                    gridCommon.columns[1],
                    { field: "objectprodukfk_names", title: "Produk", width: "300px" },
                    {
                        command: [
                            { text: "Edit", click: editData },
                            { text: "Hapus", click: deleteData }
                        ], title: "", width: "160px"
                    }
                ]
            };

            function editData(e) {
                e.preventDefault();
                var grid = this;
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                $scope.$apply(function() {
                    $scope.isEditing = true;
                    $scope.isAdding = false;
                    $scope.item = {
                        id: dataItem.id,
                        rekening: { id: dataItem.objectakunpendapatanfk, text: dataItem.koderekening + ' - ' + dataItem.namarekening },
                        kelompokPasien: [],
                        ruangan: [],
                        kelas: [],
                        produk: [],
                        isObat: false
                    };
                    
                    if ($scope.selectedType == 1) {
                        // Map IDs to full objects from source lists
                        var kpIds = dataItem.objectkelompokpasienfk_array || [];
                        var ruanganIds = dataItem.objectruanganfk_array || [];
                        var kelasIds = dataItem.objectkelasfk_array || [];
                        
                        $scope.item.kelompokPasien = $scope.listKelompokPasien.filter(function(x) {
                            return kpIds.indexOf(String(x.id)) !== -1 || kpIds.indexOf(x.id) !== -1;
                        });
                        $scope.item.ruangan = $scope.listRuangan.filter(function(x) {
                            return ruanganIds.indexOf(String(x.id)) !== -1 || ruanganIds.indexOf(x.id) !== -1;
                        });
                        $scope.item.kelas = $scope.listKelas.filter(function(x) {
                            return kelasIds.indexOf(String(x.id)) !== -1 || kelasIds.indexOf(x.id) !== -1;
                        });
                        $scope.item.isObat = dataItem.isobat == 't';
                    } else {
                        // Map IDs to full objects from listProduk
                        var produkIds = dataItem.objectprodukfk_array || [];
                        $scope.item.produk = $scope.listProduk.filter(function(x) {
                            return produkIds.indexOf(String(x.id)) !== -1 || produkIds.indexOf(x.id) !== -1;
                        });
                    }
                });
            }

            function deleteData(e) {
                e.preventDefault();
                var grid = this;
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                if (confirm("Hapus mapping ini?")) {
                    var objSave = {
                        type: $scope.selectedType,
                        id: dataItem.id
                    };
                    $scope.isRouteLoading = true;
                    MedifirstService.post("bendaharapenerimaan/delete-mapping-bku", objSave).then(function() {
                        loadData().then(function() {
                            $scope.isRouteLoading = false;
                        });
                    });
                }
            }

            $scope.add = function() {
                $scope.isAdding = true;
                $scope.isEditing = false;
                $scope.item = {
                    kelompokPasien: [],
                    ruangan: [],
                    kelas: [],
                    produk: []
                };
            };

            $scope.cancel = function() {
                $scope.isAdding = false;
                $scope.isEditing = false;
                $scope.item = {
                    kelompokPasien: [],
                    ruangan: [],
                    kelas: [],
                    produk: []
                };
            };

            $scope.save = function() {
                if (!$scope.item.rekening) {
                    window.messageContainer.error("Rekening harus diisi");
                    return;
                }

                var dataPost = {
                    id: $scope.item.id,
                    objectakunpendapatanfk: $scope.item.rekening.id
                };

                if ($scope.selectedType == 1) {
                    dataPost.objectkelompokpasienfk = ($scope.item.kelompokPasien || []).map(function(x) { return x.id; });
                    dataPost.objectruanganfk = ($scope.item.ruangan || []).map(function(x) { return x.id; });
                    dataPost.objectkelasfk = ($scope.item.kelas || []).map(function(x) { return x.id; });
                    dataPost.isobat = $scope.item.isObat ? 't' : null;
                } else {
                    dataPost.objectprodukfk = ($scope.item.produk || []).map(function(x) { return x.id; });
                }

                var objSave = {
                    type: $scope.selectedType,
                    data: dataPost
                };

                $scope.isRouteLoading = true;
                MedifirstService.post("bendaharapenerimaan/save-mapping-bku", objSave).then(function() {
                    $scope.cancel();
                    loadData().then(function() {
                        $scope.isRouteLoading = false;
                    });
                });
            };
        }
    ]);
});


