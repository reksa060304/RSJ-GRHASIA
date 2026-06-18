define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SetupSiklusGiziCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $timeout) {
            $scope.isRouteLoading = false;
            $scope.itemDaftarMenu = {};
            $scope.item = {};
            $scope.itemMappingMenuKeProduk = {}
            $scope.itemSiklus = {}

            $scope.dataSource = new kendo.data.DataSource({
                data: []
            });

            $scope.dataSourceMappingProdukMenu = new kendo.data.DataSource({
                data: []
            });

            $scope.dataSourceSiklus = new kendo.data.DataSource({
                data: [],
            });

            $scope.listSatuan = []
            $scope.listMenuMakanan = []
            $scope.listProduk = []
            $scope.listProdukDefault = []
            $scope.listProdukk = []
            $scope.listMenuMakananMapping = []
            $scope.listMenuMakananMappingDefault = []
            $scope.listSetSiklus = []
            $scope.listSetSiklusProduk = []
            $scope.arrayProdukTemp = []
            var lastProdukDietSiklusId = null
            
            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],
                columns: [
                    {
                        "field": "menumakanan",
                        "title": "Nama Menu",
                        "width": "20px"
                    }, 
                    
                    {
                        "field": "satuan_standar",
                        "title": "Satuan Standar",
                        "width": "20px"
                    }, 
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "20px"
                    }, 
                    {
                        "command": [
                                {
                                text: "Edit",
                                click: editData,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: "Hapus",
                                click: hapusData,
                                imageClass: "k-icon k-delete"
                            }],
                        title: "",
                        width: "20px",
                    }

                ]
            };

            $scope.columnMappingProdukMenu = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="tambahMappingProdukMenu()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],
                columns: [
                    {
                        "field": "menumakanan",
                        "title": "Nama Menu",
                        "width": "20px"
                    }, 
                    
                    {
                        "field": "namaproduk",
                        "title": "Produk Diet",
                        "width": "20px"
                    }, 
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapusDataMapping,
                                imageClass: "k-icon k-delete"
                            }],
                        title: "",
                        width: "20px",
                    }

                ]
            };

            $scope.columnSiklus = {
                selectable: 'row',
                pageable: true,
                toolbar: [
                    {
                        name: "add", text: "Tambah",
                        template: '<button ng-click="tambahSiklus()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                    },

                ],
                columns: [
                    {
                        "field": "siklus",
                        "title": "Siklus",
                        "width": "20px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Produk Diet",
                        "width": "20px"
                    }, 

                    {
                        "field": "menumakanan",
                        "title": "Nama Menu Makanan",
                        "width": "20px"
                    },
                    
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "20px"
                    },

                    
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapusDataSiklus,
                                imageClass: "k-icon k-delete"
                            }],
                        title: "",
                        width: "20px",
                    }

                ]
            };

            function buildQuery(params) {
                return Object.keys(params)
                    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
                    .map(key => key + '=' + encodeURIComponent(params[key]))
                    .join('&');
            }

            function loadCombo() {
               var obj =  {
                    "tableArr": [
                        // {
                        //     "table": "map_produk_to_menumakanan_m",
                        //     "join": [
                        //         {
                        //             "table": "produk_m",
                        //             "on": ["map_produk_to_menumakanan_m.produk_id", "=", "produk_m.id"]
                        //         },
                        //         {
                        //             "table": "menumakanan_m",
                        //             "on": ["map_produk_to_menumakanan_m.menumakanan_id", "=", "menumakanan_m.id"]
                        //         }
                        //     ],
                        //     "select": ["produk_m.namaproduk as produk", "map_produk_to_menumakanan_m.*","menumakanan_m.menumakanan as menumakanan"]
                        // },
                        {
                            "table": "satuanstandar_m"
                        },
                        {
                            "table": "menumakanan_m"
                        },
                        {
                            "table": "produk_m",
                            "where": [
                                {'column':'objectkategoryprodukfk','operator':'=','value':7}
                            ]
                        },
                    ]
                }
                medifirstService.post('sysadmin/master/get-data-combo',obj).then(function (data) {
                    
                    $scope.listSatuan = data.data.satuanstandar_m;
                    $scope.listMenuMakanan = data.data.menumakanan_m;
                    $scope.listProdukDefault = data.data.menumakanan_m;
                    $scope.listProduk = data.data.menumakanan_m;
                    $scope.listProdukk = data.data.produk_m;
                });
            }
            $scope.Search = function () {
                fetchData();
            }
            loadCombo();
            async function fetchData() {
                var params = {
                    menumakanan: $scope.item.namaMenu || "",
                    produk: $scope.item.produk || "",
                    siklus: $scope.item.siklus || "",
                    // nanti bisa tambah:
                    // kategori: $scope.item.kategori,
                    // tanggal: $scope.item.tanggal
                };

                var query = buildQuery(params);
                await medifirstService.get('gizi/get-data-menu-makanan?' + query).then(function (data) {
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        serverPaging: true,
                    });
                })
                await medifirstService.get('gizi/get-data-mapping-produk-menu?' + query).then(function (data) {
                    $scope.dataSourceMappingProdukMenu = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        serverPaging: true,
                    });
                })

                await medifirstService.get('gizi/get-data-siklus-catering?' + query).then(function (data) {
                    $scope.dataSourceSiklus = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 10,
                        serverPaging: true,
                    });
                })
            }
            fetchData();
            $scope.tambah = function () {
                $scope.itemDaftarMenu = {}
                $scope.popUps.center().open();
            }

            $scope.tambahSiklus = function () {
                $scope.itemSiklus = {}
                $scope.listMenuMakananMapping = []
                $scope.listMenuMakananMappingDefault = []
                $scope.listSetSiklusProduk = []
                $scope.listSetSiklus = []
                lastProdukDietSiklusId = null
                $scope.popUpsSiklus.center().open();
            }
            $scope.tambahMappingProdukMenu = function () {
                $scope.arrayProdukTemp = []
                $scope.itemMappingMenuKeProduk = {}
                $scope.popUpsMenuKeProduk.center().open();
            }
            $scope.tutup = function () {
                $scope.itemDaftarMenu = {}
                if ($scope.popUps) $scope.popUps.close();
                if ($scope.popUpsMenuKeProduk) $scope.popUpsMenuKeProduk.close();
                if ($scope.popUpsSiklus) $scope.popUpsSiklus.close();
            }
            function editData(e) {
                e.preventDefault();
                
                // 1. Ambil data dari baris yang diklik
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                
                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }

                // 2. Bungkus dengan $scope.$apply agar UI langsung ter-update
                $scope.$apply(function() {
                    // Reset object jika perlu (opsional)
                    $scope.itemDaftarMenu = {}; 

                    // Mapping data dari grid ke scope
                    $scope.itemDaftarMenu.id = dataItem.id;
                    $scope.itemDaftarMenu.namaMenu = dataItem.menumakanan;
                    
                    // Pastikan field 'satuanstandar' sesuai dengan k-data-text-field di HTML
                    $scope.itemDaftarMenu.satuan = {
                        id: dataItem.satuan_id,
                        satuanstandar: dataItem.satuan_standar
                    };
                    
                    $scope.itemDaftarMenu.keterangan = dataItem.keterangan;
                });

                // 3. Buka popup setelah data dipastikan masuk ke scope
                $scope.popUps.center().open();
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

                medifirstService.delete('gizi/delete-menu-makanan/' + itemDelete.id).then(function (e) {
                    fetchData();
                    loadCombo();
                })

            }

            function hapusDataMapping(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.delete('gizi/delete-mapping-produk-menu/' + itemDelete.id).then(function (e) {
                    fetchData();
                    loadCombo();
                })
            }

            function hapusDataSiklus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return;
                }
                var itemDelete = {
                    "id": dataItem.id
                }

                medifirstService.delete('gizi/delete-siklus-catering/' + itemDelete.id).then(function (e) {
                    fetchData();
                    loadCombo();
                })
            }
            $scope.saveDaftarMenu = function () {

                if (!$scope.itemDaftarMenu.namaMenu) {
                    toastr.error('Menu Makanan harus di isi')
                    return
                }
                if(!$scope.itemDaftarMenu.satuan){
                    toastr.error('Satuan harus di isi')
                    return
                }
                if(!$scope.itemDaftarMenu.keterangan){
                    toastr.error('Keterangan harus di isi')
                    return
                }
                

                var objSave = {
                    "id": $scope.itemDaftarMenu.id != undefined ? $scope.itemDaftarMenu.id : "",
                    "menumakanan": $scope.itemDaftarMenu.namaMenu,
                    "satuan_id": $scope.itemDaftarMenu.satuan != undefined ? $scope.itemDaftarMenu.satuan.id : null,
                    "keterangan": $scope.itemDaftarMenu.keterangan != undefined ? $scope.itemDaftarMenu.keterangan : null,
                }
                medifirstService.post('gizi/save-menu-makanan', objSave).then(function (e) {
                    $scope.itemDaftarMenu = {}
                    $scope.popUps.close();
                    fetchData();
                    loadCombo();

                })

            }
            $scope.saveMappingProdukMenu = async function () {

                if ($scope.itemMappingMenuKeProduk.produkDiet == undefined) {
                    toastr.error('Produk Diet harus di isi')
                    return
                }
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Menu Makanan belum di pilih')
                    return
                }
                var arraySave = []
                for (let i = 0; i < $scope.arrayProdukTemp.length; i++) {
                    const element = $scope.arrayProdukTemp[i];
                    arraySave.push({
                        "menumakanan_id": element.id,
                        "produk_id": $scope.itemMappingMenuKeProduk.produkDiet.id,
                    })
                }
                var objSave = {
                    "data": arraySave
                }
                medifirstService.post('gizi/save-mapping-produk-menu', objSave).then(function (e) {
                    $scope.itemMappingMenuKeProduk = {}
                    $scope.arrayProdukTemp = []
                    $scope.popUpsMenuKeProduk.close();
                    fetchData();
                    loadCombo();
                })
                // await Promise.all(arraySave.map(element => {
                //     return ;
                // })).then(() => {
                    
                // })
                

            }

            $scope.cariProduk = function () {

                if ($scope.itemMappingMenuKeProduk.cariProduk == undefined || $scope.itemMappingMenuKeProduk.cariProduk == "") {
                    $scope.listProduk = $scope.listProdukDefault
                    return
                }

                $scope.listTempProduk = []
                var name = $scope.itemMappingMenuKeProduk.cariProduk.toLowerCase()
                for (let i = 0; i < $scope.listProdukDefault.length; i++) {
                    var arr = $scope.listProdukDefault[i].menumakanan.toLowerCase()
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
                delete $scope.popUpsMenuKeProduk.cariProduk
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
            $scope.pilihMappingMenuMakanan = function (data) {
                console.log(data);
                var produkDietId = data != undefined && data.id != undefined ? data.id : null

                if (lastProdukDietSiklusId == produkDietId) {
                    return
                }
                lastProdukDietSiklusId = produkDietId
                
                if (data != undefined) {
                    medifirstService.get('gizi/get-data-mapping-produk-menu?produk_id=' + data.id).then(function (e) {
                        $scope.listMenuMakananMapping = e.data.data
                        $scope.listMenuMakananMapping.forEach(function (e) {
                            e.checked = true
                        })
                        console.log($scope.listMenuMakananMapping);
                        $scope.listMenuMakananMappingDefault = $scope.listMenuMakananMapping
                        $scope.listSetSiklusProduk = []
                        $scope.listSetSiklus = []
                        
                    })
                } else {
                    $scope.listMenuMakananMapping = []
                    $scope.listMenuMakananMappingDefault = []
                    $scope.listSetSiklusProduk = []
                    $scope.listSetSiklus = []
                }
            }

            function validasiFormSiklus() {
                if($scope.itemSiklus.produkDiet == undefined){
                    toastr.error('Produk Diet harus di isi')
                    return false
                }
                if($scope.itemSiklus.siklus == undefined){
                    toastr.error('Siklus harus di isi')
                    return false
                }
                if($scope.itemSiklus.tanggalAwal == undefined){
                    toastr.error('Tanggal Berlaku Awal harus di isi')
                    return false
                }
                if($scope.itemSiklus.tanggalAkhir == undefined){
                    toastr.error('Tanggal Berlaku Akhir harus di isi')
                    return false
                }

                return true
            }

            function refreshListSetSiklus() {
                if ($scope.listSetSiklusProduk.length == 0) {
                    $scope.listSetSiklus = []
                    return
                }
                if (!validasiFormSiklus()) {
                    return
                }
                
                let start = new Date($scope.itemSiklus.tanggalAwal);
                let end = new Date($scope.itemSiklus.tanggalAkhir);

                if (start > end) {
                    toastr.error('Tanggal Berlaku Akhir harus lebih besar atau sama dengan Tanggal Berlaku Awal')
                    $scope.listSetSiklus = []
                    return
                }

                let listSetSiklus = [];
                let menus = $scope.listSetSiklusProduk;
                
                let i = 0; // index untuk menu

                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

                    let menu = menus[i % menus.length]; // looping menu

                    listSetSiklus.push({
                        "produk_id": $scope.itemSiklus.produkDiet.id,
                        "menumakanan_id": menu.menumakanan_id, // ambil dari list
                        "nama_menu": menu.menumakanan, // opsional biar gampang debug
                        "siklus": $scope.itemSiklus.siklus,
                        "tanggal": new Date(d),
                    });

                    i++;
                }
                $scope.listSetSiklus = listSetSiklus;
                console.log($scope.listSetSiklus);
            }

            $scope.setSiklus = function (data) {
                console.log(data);
                if (!validasiFormSiklus()) {
                    return
                }

                var isSelected = $scope.listSetSiklusProduk.some(function (menu) {
                    return menu.id == data.id
                })

                if (isSelected) {
                    toastr.warning('Menu Makanan sudah dipilih')
                    return
                }

                data.checked = false;
                $scope.listSetSiklusProduk.push(data);
                refreshListSetSiklus();
                
            };

            $scope.hapusMenuSiklus = function (data, index) {
                $scope.listSetSiklusProduk.splice(index, 1)

                $scope.listMenuMakananMappingDefault.forEach(function (menu) {
                    if (menu.id == data.id) {
                        menu.checked = true
                    }
                })

                $scope.listMenuMakananMapping.forEach(function (menu) {
                    if (menu.id == data.id) {
                        menu.checked = true
                    }
                })

                refreshListSetSiklus();
            }

            $scope.resetMappingMenuMakanan = function () {
                $scope.listMenuMakananMapping.forEach(function (e) {
                    e.checked = true
                })
                $scope.listSetSiklusProduk = []
                $scope.listSetSiklus = []
            }
            $scope.cariMenuMakananSiklus = function () {
                if ($scope.itemSiklus.cariProduk == undefined || $scope.itemSiklus.cariProduk == "") {
                    $scope.listMenuMakananMapping = $scope.listMenuMakananMappingDefault
                    return
                }
                $scope.listTempMenuMakananMapping = []
                var name = $scope.itemSiklus.cariProduk.toLowerCase()
                for (let i = 0; i < $scope.listMenuMakananMappingDefault.length; i++) {
                    var arr = $scope.listMenuMakananMappingDefault[i].menumakanan.toLowerCase()
                    if (arr.indexOf(name) != -1) {
                        $scope.listTempMenuMakananMapping.push($scope.listMenuMakananMappingDefault[i])
                    }
                }
                $scope.listMenuMakananMapping = []
                $scope.listMenuMakananMapping = $scope.listTempMenuMakananMapping
            }

            $scope.clearMenuMakananSiklus = function () {
                $scope.itemSiklus.cariProduk = ""
                $scope.listMenuMakananMapping = $scope.listMenuMakananMappingDefault
            }

            $scope.saveSiklus = function () {
                if ($scope.listSetSiklus.length == 0) {
                    toastr.error('Siklus belum di set')
                    return
                }

                var arraySave = []

                for (let i = 0; i < $scope.listSetSiklus.length; i++) {
                    const element = $scope.listSetSiklus[i];

                    let tgl = new Date(element.tanggal);

                    let formattedDate = tgl.getFullYear() + '-' +
                        String(tgl.getMonth() + 1).padStart(2, '0') + '-' +
                        String(tgl.getDate()).padStart(2, '0');

                    arraySave.push({
                        "produk_id": element.produk_id,
                        "menumakanan_id": element.menumakanan_id,
                        "siklus": element.siklus,
                        "tanggal": formattedDate, // ✅ fix di sini
                    })
                }

                var objSave = {
                    "data": arraySave
                }

                medifirstService.post('gizi/save-siklus-catering', objSave).then(function (e) {
                    $scope.itemSiklus = {}
                    $scope.listSetSiklus = []
                    $scope.listSetSiklusProduk = []
                    $scope.popUpsSiklus.close();
                    fetchData();
                    loadCombo();
                });
            }
            // Info Gizi Functions
            function getInfoGizi() {
                medifirstService.get('gizi/get-info-gizi').then(function (data) {
                    if (data.data.data) {
                        var dataInfo = data.data.data;
                        $scope.item.noRekeningPembayaran = dataInfo.noRekPembayaranGizi || "";
                        $scope.item.noHpAdminGizi = dataInfo.noAdminGizi || "";
                    }
                });
            }

            $scope.saveInfoGizi = function () {
                var noRekeningPembayaran = $scope.item.noRekeningPembayaran;
                var noHpAdminGizi = $scope.item.noHpAdminGizi;
                
                if (!noRekeningPembayaran && !noHpAdminGizi) {
                    toastr.error('Minimal satu field harus diisi');
                    return;
                }

                var objSave = [
                    {
                        "namaField": "noRekPembayaranGizi",
                        "nilaiField": noRekeningPembayaran || ""
                    },
                    {
                        "namaField": "noAdminGizi",
                        "nilaiField": noHpAdminGizi || ""
                    }
                ]

                medifirstService.post('gizi/save-info-gizi', {data: objSave}).then(function (e) {
                    toastr.success('Data Info Gizi berhasil disimpan');
                    getInfoGizi();
                }).catch(function (error) {
                    toastr.error('Gagal menyimpan data');
                });
            }

            // Load info gizi when controller initializes
            getInfoGizi();
            // ------------
            //***********************************

        }
    ]);
});
