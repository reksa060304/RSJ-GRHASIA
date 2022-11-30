define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterRuanganRawatInapCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout','ModelItem', '$mdDialog',
        function ($scope, $state, cacheHelper, medifirstService, $timeout, ModelItem, $mdDialog) {
            $scope.item = {};
            $scope.itemRuangan = {}
            $scope.itemKamar = {}
            $scope.itemTempatTidur = {}
            $scope.now = new Date();
            $scope.item.jumlahRows = 50;
            $scope.item.jenisProdukDetail = [];
            $scope.idRuangan = "";
            $scope.idKamar = "";
            $scope.idTempatTidur = "";
            loadCombo()
            loadData()
            function loadCombo(){
                $scope.listStatus = [{id:true,status:'True'},{id:false,status:'False'}];
                medifirstService.get('sysadmin/master/get-combo-master').then(function(data){
                    var datas = data.data
                    $scope.listDepartemen = datas.departemen
                    $scope.listRuangan = datas.ruangan
                    $scope.listRuanganKamar = datas.ruangantrue
                    $scope.listKelas = datas.kelas
                    $scope.listKamar = datas.kamarall
                    $scope.cacheRuangan = datas.ruangan
                })
            }
            $scope.cariFilter = function(){
                loadData()
            }
            function loadData() {
                loadCombo()
                var status = undefined;
                if ($scope.item.Status != undefined){
                    status = "status="+ $scope.item.Status.id
                } else if ($scope.item.Status == undefined){
                    status = "status=" + true
                }
                var ruangan = '';
                if($scope.itemRuangan.namaRuangan != undefined){
                    ruangan = "&ruangan="+ $scope.itemRuangan.namaRuangan.id
                }
                var kamar = '';
                if ($scope.item.namaKamar != undefined)
                    kamar = "&kamar="+ $scope.item.namaKamar.id

                medifirstService.get('sysadmin/master/get-data-ruangan?' + status + ruangan).then(function (data) {
                    var datas  = data.data
                    for (var i = 0; i < datas.ruangan.length; i++) {
                        datas.ruangan[i].no = i + 1
                    }

                    $scope.dataRuangan = new kendo.data.DataSource({
                        data: datas.ruangan,
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                }
                            },
                        },
                        pageSize: 20,
                    });
                })
                medifirstService.get('sysadmin/master/get-data-kamar?' + status +kamar).then(function (data) {
                    var datas = data.data
                    for (var i = 0; i < datas.kamar.length; i++) {
                        datas.kamar[i].no = i + 1
                    }

                    $scope.dataKamar = new kendo.data.DataSource({
                        data: datas.kamar,
                        schema: {
                            model: {
                                id: "id",
                                fields: {}
                            },
                        },
                        pageSize: 20,
                    });
                })
                $scope.group = [{
                            field: "namaproduk",
                            aggregates: [{
                                    field: "jumlah",
                                    aggregate: 'sum'
                                },
                                {
                                    field: "subtotal",
                                    aggregate: 'sum'
                                },
                            ]
                        }]
                medifirstService.get('sysadmin/master/get-data-tempattidur?' + status +kamar+ruangan).then(function (data) {
                    var datas = data.data
                    for (var i = 0; i < datas.tempattidur.length; i++) {
                        datas.tempattidur[i].no = i + 1
                    }

                    $scope.dataTempatTidur = new kendo.data.DataSource({
                        data: datas.tempattidur,
                        group: {
                            field: "namakamar",
                            // aggregates: [{
                            //         field: "jumlah",
                            //         aggregate: 'sum'
                            //     },
                            //     {
                            //         field: "subtotal",
                            //         aggregate: 'sum'
                            //     },
                            // ]
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {}
                            },
                        },
                        pageSize: 20,
                    });
                })
            }
            //UNTUK TAB RUANGAN
            $scope.columnRuangan = {
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "idruangan",
                        title: "Id Ruangan",
                        width: "50px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namaruangan",
                        title: "Nama Ruangan",
                        width: "100px"
                    },
                    {
                        "command": [{
                                text: "Enable",
                                click: enableDataRuangan,
                                imageClass: "k-icon k-i-pencil",
                                className: "btn-enabled",
                            },
                            {
                                text: "Disable",
                                click: disableDataRuangan,
                                imageClass: "k-icon k-delete",
                                className: "btn-disabled",
                            },
                        ],
                        title: "Command",
                        width: "180px",
                    }
                ]
            }
             $scope.getRuangan = function(data){
                $scope.GetRuangan = data
            }
            function enableDataRuangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idruangan,
                    "status": 1 //'t'
                }
                // console.log(objSave);
                // return
                medifirstService.post('sysadmin/master/save-statusenabled-ruangan', objSave).then(function (e) {
                    // init();
                    loadData()
                })
            };
            function disableDataRuangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idruangan,
                    "status": 0 //'f'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-ruangan', objSave).then(function (e) {
                    loadData()
                })
            };
            $scope.tambahRuangan = function(){
                $scope.popUpDataRuangan.center().open()
            }
            $scope.editRuangan = function () {
                if ($scope.dataRuanganSelected == undefined){
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.itemRuangan.namaRuangan = $scope.dataRuanganSelected.namaruangan
                $scope.itemRuangan.departemen = {
                    id: $scope.dataRuanganSelected.iddepartemen, namadepartemen: $scope.dataRuanganSelected.namadepartemen 
                }
                $scope.itemRuangan.kodeInternal = $scope.dataRuanganSelected.kdinternal
                $scope.idRuangan = $scope.dataRuanganSelected.idruangan
                $scope.popUpDataRuangan.center().open()
            }
            $scope.hapusRuangan = function(){
                if ($scope.dataRuanganSelected == undefined) {
                    toastr.error('Data Ruangan Belum dipilih')
                    return
                }
                $scope.idRuangan = $scope.dataRuanganSelected.idruangan
                var data = {
                    id: $scope.idRuangan,
                }
                var objSave = {
                    data: data,
                    method: "delete"
                }
                medifirstService.post('sysadmin/master/save-data-ruangan', objSave).then(function () {
                    $scope.itemRuangan = {}
                    loadData()
                    $scope.idRuangan = ""
                })
                $scope.popUpDataRuangan.close();
            }
            $scope.simpanDataRuangan = function(){
                var listRawRequired = [
                    "itemRuangan.namaRuangan|ng-model|Nama Ruangan",
                    "itemRuangan.departemen|k-ng-model|Departemen",
                    // "itemRuangan.kodeInternal|ng-model|Kode Internal",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idRuangan,
                        namaruangan: $scope.itemRuangan.namaRuangan,
                        objectdepartemenfk: $scope.itemRuangan.departemen.id,
                        kdinternal: $scope.itemRuangan.kodeInternal
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-ruangan', objSave).then(function () {
                        $scope.itemRuangan = {}
                        $scope.idRuangan = ""
                        loadData()
                        loadCombo()
                    })
                    $scope.popUpDataRuangan.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
                
            }
            $scope.batalDataRuangan = function(){
                $scope.itemRuangan = {}
                $scope.idRuangan = ""
                $scope.popUpDataRuangan.close()
            }
            //END TAB RUANGAN



            //UNTUK TAB KAMAR

            $scope.columnKamar = {
                columnMenu: true,
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "idkamar",
                        title: "Id Kamar",
                        width: "50px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namakamar",
                        title: "Nama Kamar",
                        width: "100px"
                    },
                    {
                        field: "namakelas",
                        title: "Kelas",
                        width: "100px"
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "100px"
                    },
                    {
                        field: "qtybed",
                        title: "Qty",
                        width: "100px"
                    },
                    {
                        field: "jumlakamarisi",
                        title: "Jumlah Isi",
                        width: "100px"
                    },
                    {
                        field: "jumlakamarkosong",
                        title: "Jumlah Kosong",
                        width: "100px"
                    },
                    {
                        "command": [{
                                text: "Enable",
                                click: enableDataKamar,
                                imageClass: "k-icon k-i-pencil",
                                className: "btn-enabled",
                            },
                            {
                                text: "Disable",
                                click: disableDataKamar,
                                imageClass: "k-icon k-delete",
                                className: "btn-disabled",
                            },
                        ],
                        title: "Command",
                        width: "180px",
                    }
                ]
            }
            function enableDataKamar(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idkamar,
                    "status": 1 //'t'
                }
                // console.log(objSave);
                // return
                medifirstService.post('sysadmin/master/save-statusenabled-kamar', objSave).then(function (e) {
                    // init();
                    loadData()
                })
            };

            function disableDataKamar(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };

                var objSave = {
                    "id": dataItem.idkamar,
                    "status": 0 //'f'
                }
                medifirstService.post('sysadmin/master/save-statusenabled-kamar', objSave).then(function (e) {
                    loadData()
                })
            };
            $scope.tambahKamar = function(){
                $scope.itemKamar.jumlahKamarKosong = 0
                $scope.itemKamar.jumlahKamarIsi = 0
                $scope.popUpDataKamar.center().open()
            }
            $scope.simpanDataKamar = function () {
                var listRawRequired = [
                    "itemKamar.namaKamar|ng-model|Nama Kamar",
                    "itemKamar.kelas|k-ng-model|Kelas",
                    "itemKamar.ruangan|k-ng-model|Ruangan",
                    "itemKamar.qtybed|ng-model|Jumlah Bed",
                    "itemKamar.jumlahKamarIsi|ng-model|Jumlah Kamar Isi",
                    "itemKamar.jumlahKamarKosong|ng-model|Jumlah Kamar Kosong",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var data = {
                        id: $scope.idKamar,
                        objectkelasfk: $scope.itemKamar.kelas.id,
                        objectruanganfk: $scope.itemKamar.ruangan.id,
                        namakamar: $scope.itemKamar.namaKamar,
                        qtybed: $scope.itemKamar.qtybed,
                        jumlahkamarisi: $scope.itemKamar.jumlahKamarIsi,
                        jumlahkamarkosong: $scope.itemKamar.jumlahKamarKosong,
                    }
                    var objSave = {
                        data: data,
                        method: "post"
                    }
                    medifirstService.post('sysadmin/master/save-data-kamar', objSave).then(function () {
                        $scope.itemKamar = {}
                        $scope.idKamar = ""
                        loadData()
                    })
                    $scope.popUpDataKamar.close();
                } else {
                    ModelItem.showMessages(isValid.messages);
                }

            }
            $scope.batalDataKamar = function(){
                $scope.itemKamar = {}
                $scope.idKamar = ""
                $scope.popUpDataKamar.close()
            }
            $scope.editKamar = function(){
                if ($scope.dataKamarSelected == undefined) {
                    toastr.error('Data Kamar Belum dipilih')
                    return
                }
                $scope.itemKamar.namaKamar = $scope.dataKamarSelected.namakamar
                $scope.itemKamar.kelas = {
                    id: $scope.dataKamarSelected.objectkelasfk, namakelas: $scope.dataKamarSelected.namakelas
                }
                $scope.itemKamar.ruangan = {
                    id: $scope.dataKamarSelected.objectruanganfk, namaruangan: $scope.dataKamarSelected.namaruangan
                }
                $scope.itemKamar.qtybed = $scope.dataKamarSelected.qtybed
                $scope.itemKamar.jumlahKamarIsi = $scope.dataKamarSelected.jumlakamarisi
                $scope.itemKamar.jumlahKamarKosong = $scope.dataKamarSelected.jumlakamarkosong
                $scope.idKamar = $scope.dataKamarSelected.idkamar
                $scope.popUpDataKamar.center().open()
            }
            $scope.hapusKamar = function(){
                if ($scope.dataKamarSelected == undefined) {
                    toastr.error('Data Kamar Belum dipilih')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus kamar ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                $mdDialog.show(confirm).then(function () {
                    $scope.idKamar = $scope.dataKamarSelected.idkamar
                    var data = {
                        id: $scope.idKamar,
                    }
                    var objSave = {
                        data: data,
                        method: "delete"
                    }
                    medifirstService.post('sysadmin/master/save-data-kamar', objSave).then(function () {
                        $scope.itemKamar = {}
                        loadData()
                        $scope.idKamar = ""
                    })
                    $scope.popUpDataKamar.close();
                })
                
            }
            //end kamar

            //TEMPAT TIDUR
            $scope.listStatusBed = [
                {id: 1, statusbed:'ISI'},
                {id: 2, statusbed:'KOSONG'},
            ]
            $scope.columnTempatTidur = {
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "idtempattidur",
                        title: "Id Tempat Tidur",
                        width: "50px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namakamar",
                        title: "Nama Kamar",
                        width: "100px"
                    },
                    {
                        field: "reportdisplay",
                        title: "Nomor Bed",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Status Bed",
                        width: "100px"
                    },
                    // {
                    //     "command": [{
                    //             text: "Enable",
                    //             click: enableDataKamar,
                    //             imageClass: "k-icon k-i-pencil",
                    //             className: "btn-enabled",
                    //         },
                    //         {
                    //             text: "Disable",
                    //             click: disableDataKamar,
                    //             imageClass: "k-icon k-delete",
                    //             className: "btn-disabled",
                    //         },
                    //     ],
                    //     title: "Command",
                    //     width: "180px",
                    // }
                ]
            }
            $scope.tambahTempatTidur = function(){
                $scope.popUpDataTempatTidur.center().open()
            }
            $scope.getIsiComboKamar = function(){
                $scope.listKamarRuangan = $scope.itemTempatTidur.ruangan.kamar
            }
            $scope.getIsiQtyBed = function(){
                medifirstService.get('sysadmin/master/get-data-qtybed?kamar='+ $scope.itemTempatTidur.kamar.id).then(function(data){
                    var datas = data.data.data
                    console.log(datas.length);
                $scope.itemTempatTidur.qtybed = datas.length
                })
            }
            $scope.simpanDataTempatTidur = function(){
                var listRawRequired = [
                    "itemTempatTidur.nomorBed|ng-model|Nomor Bed",
                    "itemTempatTidur.statusBed|k-ng-model|Status Bed",
                    "itemTempatTidur.ruangan|k-ng-model|Ruangan",
                    "itemTempatTidur.kamar|k-ng-model|Kamar",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                var nomorbed = 0
                if($scope.itemTempatTidur.qtybed != 0){
                    nomorbed = $scope.itemTempatTidur.qtybed
                }
                if (isValid.status) {
                    console.log($scope.idTempatTidur, $scope.itemTempatTidur.kamar.qtybed, $scope.itemTempatTidur.qtybed);
                    var bandingqty = $scope.itemTempatTidur.qtybed < $scope.itemTempatTidur.kamar.qtybed
                    var tambahbed = 1;
                    if($scope.idTempatTidur != ""){
                        bandingqty = true
                        tambahbed = 0
                    }
                    if (bandingqty) {
                        var data = {
                            id: $scope.idTempatTidur,
                            objectkamarfk: $scope.itemTempatTidur.kamar.id,
                            objectstatusbedfk: $scope.itemTempatTidur.statusBed.id,
                            nomorbed: nomorbed+tambahbed,
                            reportdisplay: $scope.itemTempatTidur.nomorBed
                        }
                        var objSave = {
                            data: data,
                            method: "post"
                        }
                        console.log(objSave);
                        // return
                        medifirstService.post('sysadmin/master/save-data-tempattidur', objSave).then(function () {
                            $scope.itemTempatTidur = {}
                            $scope.idTempatTidur = ""
                            loadData()
                            loadCombo()
                        })
                        $scope.popUpDataTempatTidur.close();
                    }else{
                        toastr.error('Jumlah Bed Kamar '+$scope.itemTempatTidur.kamar.namakamar+' sudah terisi!')
                        return
                    }
                    
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }
            $scope.batalDataTempatTidur = function(){
                $scope.idTempatTidur = ""
                $scope.itemTempatTidur = {}
                $scope.popUpDataTempatTidur.close()
            }
            $scope.editTempatTidur = function(){
                if ($scope.dataTempatTidurSelected == undefined) {
                    toastr.error('Data Tempat Tidur Belum dipilih')
                    return
                }
                medifirstService.get('sysadmin/master/get-data-qtybed?kamar=' + $scope.dataTempatTidurSelected.objectkamarfk).then(function (data) {
                    var datas = data.data.data
                    $scope.itemTempatTidur.qtybed = datas.length
                })
                $scope.itemTempatTidur.kamar = {
                    id: $scope.dataTempatTidurSelected.objectkamarfk,
                    namakamar: $scope.dataTempatTidurSelected.namakamar,
                    qtybed: $scope.dataTempatTidurSelected.qtybed,
                }
                $scope.itemTempatTidur.ruangan = {
                    id: $scope.dataTempatTidurSelected.objectruanganfk,
                    namaruangan: $scope.dataTempatTidurSelected.namaruangan
                }
                $scope.itemTempatTidur.nomorBed = $scope.dataTempatTidurSelected.reportdisplay
                $scope.itemTempatTidur.statusBed = {
                    id: $scope.dataTempatTidurSelected.objectstatusbedfk,
                    statusbed: $scope.dataTempatTidurSelected.statusbed
                }
                $scope.idTempatTidur = $scope.dataTempatTidurSelected.idtempattidur
                $scope.popUpDataTempatTidur.center().open()
            }
            $scope.hapusTempatTidur = function(){
                if ($scope.dataTempatTidurSelected == undefined) {
                    toastr.error('Data Tempat Tidur Belum dipilih')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus Bed ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                $mdDialog.show(confirm).then(function () {
                    $scope.idTempatTidur = $scope.dataTempatTidurSelected.idtempattidur
                    var data = {
                        id: $scope.idTempatTidur,
                        objectstatusbedfk: $scope.dataTempatTidurSelected.objectstatusbedfk
                    }
                    var objSave = {
                        data: data,
                        method: "delete"
                    }
                    medifirstService.post('sysadmin/master/save-data-tempattidur', objSave).then(function () {
                        $scope.itemTempatTidur = {}
                        loadData()
                        $scope.idTempatTidur = ""
                    })
                    $scope.popUpDataKamar.close();
                })
            }
            //END TEMPAT TIDUR
            //RIWAYAT KAMAR
            $scope.columnRiwayatKamar = {
                reorderable: true,
                resizable: true,
                pageable: true,
                groupable: true,
                scrollable: true,
                selectable: "row",
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px"
                    },
                    {
                        field: "statusenabled",
                        title: "Status enabled",
                        width: "40px"
                    },
                    {
                        field: "namakamar",
                        title: "Ruangan",
                        width: "100px"
                    },
                    {
                        field: "reportdisplay",
                        title: "Kamar",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Kelas",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Jumlah TT",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Jumlah TTL",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Jumlah TTP",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "NO SK",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Keterangan",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Tanggal Dokumen",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Tanggal Mulai",
                        width: "100px"
                    },
                    {
                        field: "statusbed",
                        title: "Tanggal Akhir",
                        width: "100px"
                    },
                    // {
                    //     "command": [{
                    //             text: "Enable",
                    //             click: enableDataKamar,
                    //             imageClass: "k-icon k-i-pencil",
                    //             className: "btn-enabled",
                    //         },
                    //         {
                    //             text: "Disable",
                    //             click: disableDataKamar,
                    //             imageClass: "k-icon k-delete",
                    //             className: "btn-disabled",
                    //         },
                    //     ],
                    //     title: "Command",
                    //     width: "180px",
                    // }
                ]
            }


            // END RIWAYAT KAMAR
        }
    ]);
});
