define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PenyetoranPajakV2Ctrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = moment($scope.now).format('YYYY-01-01');
            $scope.item.tglakhir = $scope.now;
            
            
            $scope.item.totalsetoran = 0
            $scope.listPemungutanPajak = []
            $scope.listRincianPenyetoranPajak = []
            $scope.norecPenyetoran = null

            loadData()
            function loadData(){

                let tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD')
                let tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD')

                medifirstService.get("pajak/get-penyetoranpajakv2" 
                    + "?tglawal=" + tglawal
                    + "&tglakhir=" + tglakhir)
                    .then(function (e) {
                        
                        let dataPenyetoran = e.data

                        $scope.dataGridPenyetoranPajak = new kendo.data.DataSource({
                            data: dataPenyetoran,
                            pageSize: 100,
                            total: dataPenyetoran.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

                    })

            }

            $scope.cariFilter = function(){
                loadData()
            }

            $scope.tambahPenyetoranPajak = function(){

                // reset
                $scope.norecPenyetoran = null
                $scope.item.idbill = ''
                $scope.item.tglpenyetoran = ''
                $scope.item.uraian = ''
                $scope.item.totalsetoran = 0
                
                $scope.listRincianPenyetoranPajak = []
                $scope.dataGridRincianPenyetoran = new kendo.data.DataSource({
                    data: $scope.listRincianPenyetoranPajak,
                    pageSize: 100,
                    total: $scope.listRincianPenyetoranPajak.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                    aggregate: [
                    ]
                });

                $scope.popupTambahPenyetoranPajak.center().open()

            }

            $scope.tambahRincian = function (){

                // reset
                $scope.item.pemungutanPajak = ''
                $scope.item.nomorpemungutanpajak = ''
                $scope.item.nomorbkupemungutanpajak = ''
                $scope.item.uraianpemungutanpajak = ''
                $scope.item.uraianbkupemungutanpajak = ''
                $scope.item.tglpemungutanpajak = ''
                $scope.item.totalpemungutanpajak = ''
                $scope.item.totalsetorandetail = ''

                // get data pemungutan pajak yang sudah dibku dan belum di setor pajak
                medifirstService.get("pajak/get-bkupemungutanpajaksetor").then(function (res) {
                    
                    let dataPemungutan = res.data

                    $scope.listPemungutanPajak = dataPemungutan

                });

                $scope.popupTambahRincianPenyetoranPajak.center().open()

            }

            $scope.$watch('item.pemungutanPajak', function (newValue, oldValue) {
                
                if($scope.item.pemungutanPajak){
                    $scope.item.nomorpemungutanpajak = $scope.item.pemungutanPajak.nopajak
                    $scope.item.nomorbkupemungutanpajak = $scope.item.pemungutanPajak.nobku
                    $scope.item.uraianpemungutanpajak = $scope.item.pemungutanPajak.uraianpajak
                    $scope.item.uraianbkupemungutanpajak = $scope.item.pemungutanPajak.uraianbku
                    $scope.item.tglpemungutanpajak = new Date($scope.item.pemungutanPajak.tglpajak)
                    $scope.item.totalpemungutanpajak = $scope.item.pemungutanPajak.jumlahpajak
                    $scope.item.jenispajak = $scope.item.pemungutanPajak.namaexternal
                }

            });

            $scope.simpanRincian = function(){

                // validasi
                if($scope.item.pemungutanPajak == undefined || $scope.item.pemungutanPajak == null || $scope.item.pemungutanPajak == ''){
                    toastr.error('Pilih Pemungutan dulu')
                    return
                }
                if($scope.item.totalsetorandetail == undefined || $scope.item.totalsetorandetail == null || $scope.item.totalsetorandetail == ''){
                    toastr.error('Isi total setoran dulu')
                    return
                }
                // validasi cek pemungutan sudah di tambah rinci
                let cek = $scope.listRincianPenyetoranPajak.filter(item => item.objectpemungutanpajakfk == $scope.item.pemungutanPajak.norec)
                if(cek.length > 0){
                    toastr.error("Sudah ada data yang diinput")
                    return
                }

                // simpan rincian
                let objRincian = {
                    nopajak: $scope.item.pemungutanPajak.nopajak,
                    tglpajak: $scope.item.pemungutanPajak.tglpajak,
                    uraianpajak: $scope.item.pemungutanPajak.uraianpajak,
                    jumlahpajak: $scope.item.pemungutanPajak.jumlahpajak,
                    nobku: $scope.item.pemungutanPajak.nobku,
                    objectpemungutanpajakfk: $scope.item.pemungutanPajak.norec,
                    setoran: $scope.item.totalsetorandetail,
                    jenispajak: $scope.item.pemungutanPajak.namaexternal,
                }

                // update grid rincian
                $scope.listRincianPenyetoranPajak.push(objRincian)

                console.log($scope.listRincianPenyetoranPajak)

                $scope.dataGridRincianPenyetoran = new kendo.data.DataSource({
                    data: $scope.listRincianPenyetoranPajak,
                    pageSize: 100,
                    total: $scope.listRincianPenyetoranPajak.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                    aggregate: [
                    ]
                });

                // update total setoran
                $scope.item.totalsetoran += $scope.item.totalsetorandetail

                // reset 
                $scope.item.pemungutanPajak = ''
                $scope.item.nomorpemungutanpajak = ''
                $scope.item.nomorbkupemungutanpajak = ''
                $scope.item.uraianpemungutanpajak = ''
                $scope.item.uraianbkupemungutanpajak = ''
                $scope.item.tglpemungutanpajak = ''
                $scope.item.totalpemungutanpajak = ''
                $scope.item.totalsetorandetail = ''

                // close popup
                $scope.popupTambahRincianPenyetoranPajak.close()

            }

            $scope.hapusRincianPenyetoran = function(data){

                // console.log($scope.listRincianPenyetoranPajak)

                let filter = $scope.listRincianPenyetoranPajak.filter(item => item.objectpemungutanpajakfk !== data)
                
                // update grid
                $scope.listRincianPenyetoranPajak = filter
                
                // console.log($scope.listRincianPenyetoranPajak)

                $scope.dataGridRincianPenyetoran = new kendo.data.DataSource({
                    data: $scope.listRincianPenyetoranPajak,
                    pageSize: 100,
                    total: $scope.listRincianPenyetoranPajak.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                    aggregate: [
                    ]
                });

                // update total setoran
                $scope.item.totalsetoran = 0
                if($scope.listRincianPenyetoranPajak.length > 0){
                    $scope.listRincianPenyetoranPajak.map((item) => ($scope.item.totalsetoran += parseFloat(item.setoran)))
                }


            }

            $scope.simpanPenyetoranPajak = function(){

                // validasi
                if($scope.item.idbill == undefined || $scope.item.idbill == null){
                    toastr.error('Isi id bill dulu')
                    return
                }

                if($scope.item.tglpenyetoran == undefined || $scope.item.tglpenyetoran == null){
                    toastr.error('Isi tanggal penyetoran dulu')
                    return
                }

                if($scope.item.totalsetoran == undefined || $scope.item.totalsetoran == null){
                    toastr.error('Isi total setoran dulu')
                    return
                }

                if($scope.listRincianPenyetoranPajak.length <= 0){
                    toastr.error('Entry rincian dulu')
                    return
                }

                let dataSave = {
                    norecPenyetoran: $scope.norecPenyetoran,
                    idbill: $scope.item.idbill,
                    tglpenyetoran: moment($scope.item.tglpenyetoran).format('YYYY-MM-DD'),
                    uraian: $scope.item.uraian,
                    totalsetoran: $scope.item.totalsetoran,
                    rincian: $scope.listRincianPenyetoranPajak
                }

                // console.log(dataSave)
                medifirstService.post('pajak/simpan-penyetoranpajakv2', dataSave).then(function (e) {

                    $scope.popupTambahPenyetoranPajak.close()

                    loadData()

                })

            }

            function hapusPenyetoranPajak(e){
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                
                // cek bku
                if(dataItem.objectbkufk !== null){
                    toastr.error('Sudah dibkukan');
                    return
                }

                let dataSave = {
                    norec: dataItem.norec
                }

                medifirstService.post('pajak/hapus-penyetoranpajakv2', dataSave).then(function (e) {

                    loadData()

                })

            }

            function editPenyetoranPajak(e){
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                if(dataItem.objectbkufk !== null){
                    toastr.error('Sudah dibkukan')
                    return
                }

                // console.log(dataItem)
                $scope.norecPenyetoran = dataItem.norec

                // open popup
                $scope.popupTambahPenyetoranPajak.center().open()

                // data ke form
                $scope.item.idbill = dataItem.idbillppn
                $scope.item.tglpenyetoran = new Date(dataItem.tglppn)
                $scope.item.uraian = dataItem.uraianpajak
                $scope.item.totalsetoran = parseFloat(dataItem.ppn)

                $scope.listRincianPenyetoranPajak = dataItem.detail
                $scope.dataGridRincianPenyetoran = new kendo.data.DataSource({
                    data: $scope.listRincianPenyetoranPajak,
                    pageSize: 100,
                    total: $scope.listRincianPenyetoranPajak.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    },
                    aggregate: [
                    ]
                });

            }

            $scope.columnGridRincianPenyetoran = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "field": "objectpemungutanpajakfk",
                        "title": "Delete",
                        "template": '<button ng-click="hapusRincianPenyetoran(dataItem.objectpemungutanpajakfk)" class="k-button k-button-icontext k-grid-upload">Hapus</button>'
                    },
                    {
                        "field": "setoran",
                        "title": "Total Setoran",
                    },
                    {
                        "field": "nopajak",
                        "title": "Nomor Pajak",
                    },
                    {
                        
                        "field": "tglpajak",
                        "title": "Tanggal Pemungutan",
                    },
                    {
                        
                        "field": "uraianpajak",
                        "title": "Uraian",
                    },
                    {
                        
                        "field": "jumlahpajak",
                        "title": "Jumlah Pajak",
                    },
                    {
                        
                        "field": "nobku",
                        "title": "No. BKU",
                    },
                ]
            }

            $scope.columnGridPenyetoranPajak = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nopajak",
                        "title": "Nomor Pajak",
                    },
                    {
                        
                        "field": "idbillppn",
                        "title": "ID Bill",
                    },
                    {
                        
                        "field": "tglppn",
                        "title": "Tanggal Penyetoran",
                    },
                    {
                        
                        "field": "uraianpajak",
                        "title": "Uraian",
                    },
                    {
                        
                        "field": "ppn",
                        "title": "Total setoran",
                    },
                    {
                        "command": [
                            {
                                text: "Hapus",
                                click: hapusPenyetoranPajak,
                                imageClass: "clinic fa",
                            },
                            {
                                text: "Edit",
                                click: editPenyetoranPajak,
                                imageClass: "clinic fa",
                            },
                        ],
                        title: "Action",
                             
                    },
                ]
            };
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});