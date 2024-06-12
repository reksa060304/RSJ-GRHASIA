define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('MasterPendapatanCtrl', ['$scope', '$mdDialog', 'MedifirstService','$timeout','ModelItem',
        function ($scope, $mdDialog, medifirstService, $timeout, ModelItem) {
            $scope.item = {}
            $scope.id = null;
            $scope.itemRincian = {}
            $scope.now = new Date();
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            var norec= "";
            LoadCombo()
            LoadData()
            function LoadCombo(){
                console.log($scope.dataSelected)
                medifirstService.get('anggaran/load-combo-master-pendapatan').then(function(data){
                    var datas = data.data
                    $scope.listLevel = datas.level
                    $scope.listakunlev1 = datas.akunlev1
                    $scope.listUraianPendapatan = datas.akun
                    for (let i = 0; i < datas.akun.length; i++) {
                        datas.akun[i].no = i+1;
                        
                    }
                    $scope.dataSourceRincianPendapatan = new kendo.data.DataSource({
                        data: datas.akun,
                        pageSize: 150,
                        total: datas.akun.length,
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
                        "title": "Nama Rekening",
                        "width": "60px",
                        // hidden: true
                    },
                    {
                        "field": "head",
                        "title": "Head Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                   
                   
                    {
						"command": [
							// { text: "Edit", click: EditRincian, imageClass: "k-icon k-i-pencil" },
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
                $scope.popupTambahRincianPendapatan.center().open()
            }
           
            $scope.simpanRincian = function(){
                
                if ($scope.item.namarekening == undefined) {
                    alert("Nama Rekening Wajib di Isi!!")
                    return
                }
                if ($scope.item.kodeakun == undefined) {
                    alert("Kode Rekening Wajib di Isi!!")
                    return
                }
                var headfk = "";
                if ($scope.item.level.id == 6) {
                    headfk = $scope.item.level1.id;
                } else if ($scope.item.level.id == 7) {
                    headfk = $scope.item.level2.id;
                } else if ($scope.item.level.id == 8) {
                    headfk = $scope.item.level3.id;
                } else if ($scope.item.level.id == 9) {
                    headfk = $scope.item.level4.id;
                } else if ($scope.item.level.id == 10) {
                    headfk = $scope.item.level5.id;
                } else if ($scope.item.level.id == 11) {
                    headfk = $scope.item.level6.id;
                } else if ($scope.item.level.id == 12) {
                    headfk = $scope.item.level7.id;
                } else {
                    headfk = null; // Optional: Handle the case where none of the above conditions are met
                }
                
                var data = {
                    'id':  $scope.id,
                    'level' : $scope.item.level.id,
                    'headfk': headfk,
                    'namarekening' : $scope.item.namarekening,
                    'kodeakun' : $scope.item.kodeakun,
                    'statusenabled' : true,                       
                }
                var objSave = {
                    data: data,
                    method: "post"
                }
                // var objSave = {
                //     'id': id,
                //     'level' : $scope.item.level.id,
                //     'headfk': headfk,
                //     'namarekening' : item.namarekening,
                //     'statusenabled' : true,
                    
                // }
                medifirstService.post('anggaran/save-master-pendapatan', objSave).then(function(data){
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
       
            $scope.resetFilters = function () {
                var gridData = $("#kGrids").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
                $scope.filteredData = [];
            };

         
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

            $scope.handleMasterPendapatan = function(data){
                // console.log(data)
				medifirstService.get('anggaran/get-master-pendapatan'
                    +'?headfk='+data.id 
                    ).then(function(data){

                        console.log(data)
					$scope.masterAssetOption = data.data
					$scope.currentAsset.push()
				});
			}
            // BATASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
        }
    ])
})
        
