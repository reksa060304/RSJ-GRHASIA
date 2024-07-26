define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RincianPendapatanCtrl', ['$scope', '$mdDialog', 'MedifirstService','$timeout','ModelItem',
        function ($scope, $mdDialog, medifirstService, $timeout, ModelItem) {
            $scope.item = {}
            $scope.itemRincian = {}
            $scope.now = new Date();
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            var norec = "";
            $scope.listTahapKegiatan = []
            LoadCombo()
            // LoadData()
            function LoadCombo() {
                
                console.log($scope.dataSelected)
                medifirstService.get('anggaran/load-combo-rincian-pendapatan').then(function(data){
                    var datas = data.data
                    $scope.listTahapKegiatan = datas.tahapanggaran
                    $scope.listSumberPendapatan = datas.sumberpendapatan
                    $scope.listUraianPendapatan = datas.uraianpendapatan
                    $scope.listAkun = datas.akun
                    $scope.listTarget = datas.targetpendapatan
                    for (let i = 0; i < datas.targetpendapatan.length; i++) {
                        datas.targetpendapatan[i].no = i+1;
                        
                    }
                    $scope.dataSourceRincianPendapatan = new kendo.data.DataSource({
                        data: datas.targetpendapatan,
                        pageSize: 150,
                        total: datas.targetpendapatan.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                    });
                })
            }
            function LoadData(){
                medifirstService.get('anggaran/load-data-rincian-pendapatan')
            }
            $scope.columnRincianPendapatan = {
                toolbar: [{
                        name: "add",
                        text: "Tambah",
                        template: '<div class="grid_1"><button ng-click="TambahRincian()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'
                    },
                    // {
                    //     name: "edit",
                    //     text: "Edit",
                    //     template: '<div class="grid_1"><button ng-click="Edit()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-edit"></span>Edit</button></div>'
                    // },
                ],
                
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "Nomor",
                        "width": "30px",
                        // hidden: true
                    },
                    {
                        "field": "koderekening",
                        "title": "Kode Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "namarekening",
                        "title": "Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "uraian",
                        "title": "Keterangan",
                        "width": "60px",
                        // hidden: true
                    },
                    {
                        "field": "jumlahpendapatan",
                        "title": "Target",
                        "width": "60px",
                        // hidden: true
                    },
                    {
                        "field": "tahun",
                        "title": "Tahun",
                        "width": "100px",
                        // hidden: true
                    },
                  
                   
                    {
						"command": [
							{ text: "Edit", click: EditRincian, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: Hapus, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
                    
                ]
            };
            $scope.TambahRincian = function (){
                var tahun = moment($scope.now).format('YYYY');
                $scope.itemRincian ={}
                $scope.itemRincian.tglinput = moment($scope.now).format('YYYY-MM-DD')
                $scope.dataSelected = undefined
                console.log($scope.dataSelected)
                $scope.itemRincian.norec = undefined
                // $scope.popupTambahRincianPendapatan.center().open()
                $scope.popupTambahRencanaPendapatan.center().open()
            }
            $scope.perubahan = function(data){
                if (data == true) {
                    $scope.itemRincian.nonPerubahan = undefined
                } 
            }

            $scope.nonPerubahan = function(data){
                 if (data == true) {
                     $scope.itemRincian.perubahan = undefined
                 }
            }
            $scope.perubahans = function (data) {
                if (data == true) {
                    $scope.item.nonPerubahans = undefined
                }
            }

            $scope.nonPerubahans = function (data) {
                if (data == true) {
                    $scope.item.perubahans = undefined
                }
            }
            $scope.simpanRincian = function(){
                console.log($scope.dataSelected)
                var tahun = $scope.itemRincian.tahun;
                var perubahan = "";
                if ($scope.itemRincian.perubahan == true) {
                    perubahan = true
                } 
                if($scope.itemRincian.nonPerubahan == true){
                    perubahan = false
                }
                norec = ''
                if($scope.itemRincian.norec != undefined){
                    norec = $scope.itemRincian.norec
                }
                var akun = ''
                if($scope.itemPendapatan.Akun != undefined){
                    akun = $scope.itemPendapatan.Akun.id
                }
                var objSave = {
                    'norec': norec,
                    'tglinput': $scope.itemRincian.tglinput,
                    'tahun': tahun,
                    'objectasalprodukfk': $scope.itemRincian.sumberPendapatan.id,
                    'uraianpendapatan': $scope.itemRincian.uraianPendapatan,
                    'jumlahpendapatan': $scope.itemRincian.jumlahPendapatan,
                    'keterangan': $scope.itemRincian.keterangan,
                    'objecturaianpendapatanfk':akun,
                    'objectakunpendapatanfk': $scope.itemPendapatan.Akun.id,
                    'isperubahan': perubahan
                }
                medifirstService.post('anggaran/save-rincian-pendapatan', objSave).then(function(data){
                    console.log(data);
                    $scope.popupTambahRincianPendapatan.close()
                    $scope.itemRincian = {}
                    LoadCombo()
                    $scope.dataSelected = {}
                    // norec = ""
                    console.log(norec);
                })
                console.log(objSave);
            }
            $scope.batalRincian = function(){
                $scope.popupTambahRincianPendapatan.close()
                $scope.itemRincian = {}
            }
            $scope.$watch('item.tahun', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tahun != undefined) {
                        var tahun = "tahun=" + moment($scope.item.tahun).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-combo-mapping-sts?"+tahun, true).then(function (dat) {
                        $scope.listUraianPendapatan = dat.data.uraianpendapatan
                    });
                }
            });
            $scope.$watch('itemRincian.tahun', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.itemRincian.tahun != undefined) {
                        var tahun = "tahun=" + moment($scope.itemRincian.tahun).format('YYYY')
                    }
                    medifirstService.get("registrasi/laporan/get-combo-mapping-sts?"+tahun, true).then(function (dat) {
                        $scope.listUraianPendapatan = dat.data.uraianpendapatan
                    });
                }
            });
            var timeoutPromise;
            $scope.$watch('item.sumberPendapatan', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("objectasalprodukfk", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.uraianPendapatan', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("objecturaianpendapatanfk", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.perubahans', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("isperubahan", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.nonPerubahans', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("isperubahan", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.tahun', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("tahun", newVal);
                    }
                }, 500)
            });
            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrids").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];
                console.log(filterField, filterValue);
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }
                if (filterField === "objectasalprodukfk" ) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                }
                if (filterField === "objecturaianpendapatanfk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                }
                if (filterField === "isperubahan") {
                    if ($scope.item.perubahans == true) {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: true
                        });
                    }
                    if ($scope.item.nonPerubahans == true) {
                        currentFilters.push({
                            field: filterField,
                            operator: "eq",
                            value: false
                        });
                    }
                }
                if (filterField === "tahun") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: moment(filterValue).format('YYYY')
                        
                    });
                    console.log(currentFilters);
                }
                
                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
                var allData = dataGrid.dataSource.data();
                var params = dataGrid.dataSource.filter();
                var query = new kendo.data.Query(allData);
                $scope.filteredData = query.filter(params).data;
            }
            $scope.resetFilters = function () {
                var gridData = $("#kGrids").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
                $scope.filteredData = [];
            };

            // $scope.Edit=function(){
            //     if ($scope.dataSelected == undefined) {
            //         alert("Data Belum Dipilih!")
            //         return;
            //     };
            //     console.log($scope.dataSelected)
            //     $scope.itemRincian.tglinput = moment($scope.dataSelected.tglinput).format('YYYY-MM-DD')
            //     $scope.itemRincian.tahun = $scope.dataSelected.tahun
            //     $scope.itemRincian.sumberPendapatan = {id:$scope.dataSelected.objectasalprodukfk,namaexternal:$scope.dataSelected.namaexternal}
            //     $scope.itemRincian.uraianpendapatans = {id:$scope.dataSelected.objecturaianpendapatanfk,uraianpendapatan:$scope.dataSelected.uraianpendapatan}
            //     $scope.itemRincian.uraianPendapatan = $scope.dataSelected.uraian
            //     $scope.itemRincian.jumlahPendapatan = $scope.dataSelected.jumlahpendapatan
            //     $scope.itemRincian.keterangan = $scope.dataSelected.keterangan
            //     if($scope.dataSelected.isperubahan == true){
            //         $scope.itemRincian.perubahan = true
            //         $scope.itemRincian.nonPerubahan = false
            //     }else{
            //         $scope.itemRincian.perubahan = false
            //         $scope.itemRincian.nonPerubahan = true
            //     }
            //     $scope.popupTambahRincianPendapatan.center().open()
                
            // }
            function EditRincian(e){
                e.preventDefault();
                console.log(e.preventDefault())
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
                console.log(dataItem.tahun)
                console.log(moment(dataItem.tahun).format('YYYY'))

                $scope.itemRincian.tglinput = moment(dataItem.tglinput).format('YYYY-MM-DD')
                $scope.itemRincian.tahun = dataItem.tahun
                $scope.itemRincian.sumberPendapatan = {id:dataItem.objectasalprodukfk,namaexternal:dataItem.namaexternal}
                $scope.itemRincian.uraianpendapatans = {id:dataItem.objecturaianpendapatanfk,uraianpendapatan:dataItem.uraianpendapatan}
                $scope.itemRincian.uraianPendapatan = dataItem.uraian
                $scope.itemRincian.jumlahPendapatan = parseFloat(dataItem.jumlahpendapatan)
                $scope.itemRincian.keterangan = dataItem.keterangan
                $scope.itemRincian.norec = dataItem.norec
                if(dataItem.isperubahan == true){
                    $scope.itemRincian.perubahan = true
                    $scope.itemRincian.nonPerubahan = false
                }else{
                    $scope.itemRincian.perubahan = false
                    $scope.itemRincian.nonPerubahan = true
                }


                $scope.popupTambahRincianPendapatan.center().open()
                
            }
            function Hapus(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem.norec);
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus item ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');

                $mdDialog.show(confirm).then(function () {
                    
                    var objSave = {
                        'norec': dataItem.norec
                    }
                    medifirstService.post('anggaran/hapus-rincian-pendapatan', objSave).then(function () {
                        LoadCombo()
                        $scope.dataSelected = {}
                        // console.log(norec);
                    })

                })
                
            }

            $scope.simpanPendapatan = function(){
                console.log($scope.dataSelected)
                var tahun = $scope.itemRincian.tahun;
                
           //tambahain validasi
                norec = ''
                if($scope.itemRincian.norec != undefined){
                    norec = $scope.itemRincian.norec
                }
                var akun = ''
                if($scope.itemPendapatan.Akun != undefined){
                    akun = $scope.itemPendapatan.Akun.id
                }
                var objSave = {
                    'norec': norec,
                    'tglinput': $scope.itemRincian.tglinput,
                    'tahun': tahun,
                    'objectasalprodukfk': null,
                    'uraianpendapatan': $scope.itemPendapatan.uraianPendapatan,
                    'jumlahpendapatan': $scope.itemPendapatan.jumlahPendapatan,                    
                    'objecturaianpendapatanfk':null,
                    'keterangan':null,
                    // 'objectakunpendapatanfk': $scope.itemPendapatan.jumlahPendapatan,
                    'objecttahapfk' : $scope.item.tahap.id,
                    'isperubahan': false,
                }
                medifirstService.post('anggaran/save-rincian-pendapatan', objSave).then(function(data){
                    console.log(data);
                    $scope.popupTambahRencanaPendapatan.close()
                    $scope.itemRincian = {}
                    $scope.itemPendapatan = {}
                    LoadCombo()
                    $scope.dataSelected = {}
                    // norec = ""
                    console.log(norec);
                })
                console.log(objSave);
            }
            // BATASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
        }
    ])
})
        
