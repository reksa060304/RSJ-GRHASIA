define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('PengembalianBelanjaCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.now = new Date()
            $scope.item = {}
            $scope.item.totalHarga = 0

            $scope.dataVOloaded = false
            $scope.userLogin = JSON.parse(window.localStorage.getItem('datauserlogin'))
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            
            // Tanggal filter
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')

            $scope.listStatusSPJ = [
                { id: 0, status: "Semua" },
                { id: 1, status: "Belum Verifikasi" },
                { id: 2, status: "Revisi" },
                { id: 3, status: "Sudah Verifikasi" },
            ];

            $scope.spjDipilih = null
            $scope.selectedPengembalian = null

            loadCombo()

            function loadData(){
                medifirstService.get("perencanaan/get-pengembalian-belanja" 
                    + "?tglAwal=" + $scope.item.tglAwal
                    + "&tglAkhir=" + $scope.item.tglAkhir).then(function (e) {
                    // console.log(e.data)

                    let result = e.data.map((item, index) => ({...item, no: index + 1}))

                    $scope.dataGridPengembalian = {
                        data: result,
                        total: result.length,
                    }
                });
            }

            function loadCombo() {
                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.listTahap = e.data.tahap
                    $scope.listAsalProduk = e.data.asalproduk
                    $scope.listKegiatan = e.data.kegiatansubsubspj
                    $scope.listMataAnggaran = e.data.mataanggarancombodiv

                    loadData()
                });
            }

            $scope.cari = function(){
                $scope.item.tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm')
                $scope.item.tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm')

                loadData()
            }


            $scope.tambahPengembalian = function(){

                $scope.selectedPengembalian = null;

                $scope.popUpTambahPengembalian.center().open()

            }

            $scope.cariSPJ = function(){
                
                var sub = ''
                if ($scope.item.subsubkegiatan != undefined) { 
                    sub = $scope.item.subsubkegiatan.id
                }
                
                let mataanggaran = ""
                if($scope.item.mataanggaran !== undefined && $scope.item.mataanggaran !== null){
                    mataanggaran = "&mataanggaran=" + $scope.item.mataanggaran.id
                }

                var asalproduk = ''
                if ($scope.item.asalproduk != undefined) { 
                    asalproduk = $scope.item.asalproduk.id
                }

                var stat=''
                if($scope.item.statusspj != undefined){
                    stat = $scope.item.statusspj.id
                }

                let cari = ""
                if($scope.item.carispj !== undefined && $scope.item.carispj !== null){
                    cari = "&cari=" + $scope.item.carispj
                }
                
                medifirstService.get("perencanaan/get-rekap-spj-detail" 
                    + "?status=" + stat
                    + "&subkegiatan=" + sub
                    + "&asalproduk=" + asalproduk
                    + mataanggaran
                    + cari
                ).then(function (e) {
                    
                    let DataSPJ = e.data.data
                    let DataDetailSPJALL = e.data.detail
                    $scope.dataGridSPJ = new kendo.data.DataSource({
                        data: DataSPJ,
                        // group: $scope.groupmataanggaran,
                    });

                })

            }

            $scope.pilihSPJ = function(norec){
                // console.log(norec)
                $scope.spjDipilih = null

                medifirstService.get("perencanaan/get-spj-bynorec?norec=" + norec)
                    .then(function (response) {
                        // console.log(response.data)

                        $scope.spjDipilih = response.data[0]

                        $scope.popUpEntryPengembalian.center().open()
                    });

            }

            $scope.simpanPengembalian = function(){
                
                let objSave = {
                    norec_pengembalian: $scope.selectedPengembalian,
                    norec_spj: $scope.spjDipilih.norec,
                    keteranganpengembalian: $scope.item.keteranganpengembalian,
                    totalpengembalian: $scope.item.totalpengembalian,
                    tanggal: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                }
                // console.log(objSave)

                $scope.dataVOloaded = true
                medifirstService.post("perencanaan/simpan-pengembalian", objSave)
                    .then(function (response) {
                        // console.log(response.data)

                        $scope.item.keteranganpengembalian = null
                        $scope.item.totalpengembalian = null

                        $scope.popUpEntryPengembalian.close()

                        loadData()

                        $scope.dataVOloaded = false
                        
                    });
            }

            $scope.batalPengembalian = function(){
                $scope.item.keteranganpengembalian = null
                $scope.item.totalpengembalian = null

                $scope.popUpEntryPengembalian.close()
            }

            $scope.editPengembalian = function(data){
                // console.log(data)
                
                $scope.dataVOloaded = true
                medifirstService.get("perencanaan/get-pengembalian-belanja-bynorec?norec=" + data)
                    .then(function (response) {
                        $scope.dataVOloaded = false


                        $scope.spjDipilih = response.data[0]
                        $scope.item.keteranganpengembalian = response.data[0].keterangan
                        $scope.item.totalpengembalian = parseFloat(response.data[0].totalpengembalian)
                        $scope.selectedPengembalian = response.data[0].norec

                        $scope.popUpEntryPengembalian.center().open()
                    });

            }

            $scope.deletePengembalian = function(data){
                // console.log(data)

                $scope.dataVOloaded = true
                medifirstService.post("perencanaan/hapus-pengembalian-belanja?norec=" + data)
                    .then(function (response) {
                        // console.log(response.data)

                        loadData();
                        $scope.dataVOloaded = false
                    });

            }


            $scope.columnGridPengembalian = {
                columns: [
                    {
                        field: 'norec',
                        title: 'tool',
                        template: '<button ng-click="editPengembalian(dataItem.norec)" class="k-button k-button-icontext k-grid-upload">Edit</button><button ng-click="deletePengembalian(dataItem.norec)" class="k-button k-button-icontext k-grid-upload">Hapus</button>',
                        width: '200px',
                    },
                    { field: 'no', title: 'No', width: "75px" },
                    { field: 'norealisasi', title: 'No SPJ' },
                    { field: 'keterangan', title: 'Keterangan Pengembalian' },
                    { field: 'totalpengembalian', title: 'Total Pengembalian' }
                ]
            }

            var onDataBound = function (e) {
                var kendoGrid = $("#kGridsSPJ").data("kendoGrid"); // get the grid widget
                
                var rows = e.sender.element.find("tbody tr"); // get all rows
                for (let i = 0; i < rows.length; i++) {
                    // const element = rows[i];
                    var row = rows[i];
                    var status = kendoGrid.dataItem(row).status;
                    //console.log(status);
                    if (status == "Revisi") {
                        $(row.cells[1]).addClass("koneng");
                        $(row.cells[2]).addClass("koneng");
                        $(row.cells[3]).addClass("koneng");
                        $(row.cells[4]).addClass("koneng");
                        $(row.cells[5]).addClass("koneng");
                        $(row.cells[6]).addClass("koneng");
                        $(row.cells[7]).addClass("koneng");
                        $(row.cells[8]).addClass("koneng");
                        $(row.cells[9]).addClass("koneng");
                        $(row.cells[10]).addClass("koneng");
                        $(row.cells[11]).addClass("koneng");
                        $(row.cells[12]).addClass("koneng");
                        $(row.cells[13]).addClass("koneng");
                        $(row.cells[14]).addClass("koneng");
                    } else if (status == "Sudah Diverifikasi") {
                        // $(row.cells[0]).addClass("green");
                        $(row.cells[1]).addClass("green");
                        $(row.cells[2]).addClass("green");
                        $(row.cells[3]).addClass("green");
                        $(row.cells[4]).addClass("green");
                        $(row.cells[5]).addClass("green");
                        $(row.cells[6]).addClass("green");
                        $(row.cells[7]).addClass("green");
                        $(row.cells[8]).addClass("green");
                        $(row.cells[9]).addClass("green");
                        $(row.cells[10]).addClass("green");
                        $(row.cells[11]).addClass("green");
                        $(row.cells[12]).addClass("green");
                        $(row.cells[13]).addClass("green");
                        $(row.cells[14]).addClass("green");
                    }

                }
            }
            $scope.columnSPJ = {
                dataBound: onDataBound,
                selectable: 'row',
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'norec', 
                        title: "Tool",
                        template: '<button ng-click="pilihSPJ(dataItem.norec)" class="k-button k-button-icontext k-grid-upload">Pengembalian</button>',
                    },
                    { "field": "tglrealisasi", "title": "Tgl SPJ" },
                    { "field": "mataanggaran", "title": "Mata Anggaran" },
                    { "field": "norealisasi", "title": "No SPJ" },
                    { "field": "asalproduk", "title": "Sumber Dana" },
                    { "field": "totalbelanja", "title": "Total Belanja" },
                    { "field": "uraian", "title": "Uraian" },
                    { "field": "pph", "title": "PPh", "width": "70px" },
                    { "field": "ppn",  "title": "PPN", "width": "70px" },
                    { "field": "penerima", "title": "Penerima" },
                    { "field": "pihakketiga", "title": "Nama Pihak Ketiga"},
                    { "field": "status", "title": "Verifikasi" },
                ]
            };
            
        }
    ]);
});