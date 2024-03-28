define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RencanaBelanjaCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.now = new Date()
            $scope.item = {}
            $scope.item.totalHarga = 0

            $scope.dataVOloaded = false
            $scope.userLogin = JSON.parse(window.localStorage.getItem('datauserlogin'))
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            $scope.listLoginUserToRuangan = JSON.parse(window.localStorage.getItem('mapLoginUserToRuangan'))
            
            // Tanggal default
            $scope.item.tglPengajuan = moment($scope.now).format('YYYY-MM-DD')
            
            // Tanggal filter
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')

            // State
            $scope.isUpdate = false
            $scope.isRencanaProduk = null

            // data
            $scope.listReverensi = []
            $scope.listSubKegiatanSPJ = []
            $scope.listSatuan = []
            $scope.dataPerencanaan = []

            loadDataCombo()

            // Load data perencanaan
            function loadPerencanaan(){
                $scope.dataVOloaded = true

                const tglAwal = $scope.item.tglAwal
                const tglAkhir = $scope.item.tglAkhir

                medifirstService.get('perencanaan/get-rencana-belanja?' 
                    + 'tglAwal=' + moment(tglAwal).format('YYYY-MM-DD HH:mm:ss')
                    + '&tglAkhir=' + moment(tglAkhir).format('YYY-MM-DD HH:mm:ss')
                    )
                    .then(function(e){
                        let result = e.data
                        
                        // Memberi penomeran
                        for (var i = 0; i < result.length; i++) {
                            result[i].rencana.no = i + 1

                            for (let e = 0; e < result[i].details.length; e++) {
                                result[i].details[e].no = e + 1;

                                if(result[i].details[e].isverifikasi == true){
                                    result[i].details[e].isverifikasi = 'Telah Diverifikasi'
                                }else{
                                    result[i].details[e].isverifikasi = 'Belum verifikasi'
                                }
                            }
                        }
                        
                        // Data ke Grid
                        $scope.dataGridPerencanaan = new kendo.data.DataSource({
                            data: result,
                            pageSize: 100,
                            total: result.length,
                            serverPaging: false,
                        });

                        // Sub Data ke Sub Grid
                        $scope.columnGridDetailPerencanaan = function(dataPerencanaan) {
                            if(dataPerencanaan.details[0].namakegiatan == null){
                                return {
                                    dataSource: new kendo.data.DataSource({
                                        data: dataPerencanaan.details
                                    }),
                                    columns: [
                                        {
                                            "field": "no",
                                            "title": "No",
                                            "width": "45px"
                                        },
                                        {
                                            "field": "namaproduk",
                                            "title": "Nama Produk",
                                        },
                                        {
                                            "field": "qtystok",
                                            "title": "Qty Stock",
                                        },
                                        {
                                            "field": "qtyrencana",
                                            "title": "Qty Pengajuan",
                                        },
                                        {
                                            "field": "qtyverifikasi",
                                            "title": "Qty Verifikasi"
                                        },
                                        {
                                            "field": "hargasatuan",
                                            "title": "Harga Sautan"
                                        },
                                        {
                                            "field": "keteranganlainnya",
                                            "title": "Reverensi"
                                        },
                                        {
                                            "field": "isverifikasi",
                                            "title": "Telah di Verifikasi"
                                        },
                                    ]
                                }
                            }else{
                                return {
                                    dataSource: new kendo.data.DataSource({
                                        data: dataPerencanaan.details
                                    }),
                                    columns: [
                                        {
                                            "field": "no",
                                            "title": "No",
                                            "width": "45px"
                                        },
                                        {
                                            "field": "namakegiatan",
                                            "title": "Nama Kegiatan",
                                        },
                                        {
                                            "field": "qtyrencana",
                                            "title": "Qty Pengajuan",
                                        },
                                        {
                                            "field": "qtyverifikasi",
                                            "title": "Qty Verifikasi"
                                        },
                                        {
                                            "field": "hargasatuan",
                                            "title": "Harga Sautan"
                                        },
                                        {
                                            "field": "keteranganlainnya",
                                            "title": "Reverensi"
                                        },
                                        {
                                            "field": "isverifikasi",
                                            "title": "Telah di Verifikasi"
                                        },
                                    ]
                                }
                            }
                        }

                        $scope.dataVOloaded = false
                    })
            }
            
            // Load data combo
            function loadDataCombo() {
                $scope.item.tahunAnggaran = moment($scope.now).add(1, 'y').format('YYYY')

                $scope.dataVOloaded = true

                medifirstService.get("perencanaan/get-combo-perencanaan-belanja?" 
                    + "idLogin=" + $scope.userLogin.id)
                    .then(function(e){
                        $scope.dataVOloaded = false

                        $scope.listSubSubKegiatanSPJ = e.data.subSubKegiatan
                        $scope.listAsalProduk = e.data.asalProduk
                        $scope.listSatuan = e.data.satuan
                        $scope.listProduk = e.data.dataProdukAll

                    })
                
                loadPerencanaan()
            }

            // Cari filter
            $scope.cari = function(){
                loadPerencanaan()
            }

            // Tambah rencana barang
            $scope.bukaTambahRencanaProduk = function() {
                // Update state
                $scope.isRencanaProduk = true
                $scope.isUpdate = false

                // empty grid data perencanaan
                let data = $scope.dataPerencanaan = []
                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: data
                })
                
                // open popup
                $scope.popupTambahRencanaBelanja.center().open()
            }

            // Tambah rencana kegiatan
            $scope.bukaTambahRencanaKegiatan = function() {
                // Update state
                $scope.isRencanaProduk = false
                $scope.isUpdate = false

                // empty grid data perencanaan
                let data = $scope.dataPerencanaan = []
                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: data
                })
                
                // open popup
                $scope.popupTambahRencanaBelanja.center().open()
            }

            // Handle input harga satuan
            $scope.handleHarga = function(data){
                $scope.item.totalHarga = data * ($scope.item.jumlahRencana ? $scope.item.jumlahRencana : 0)
            }

            // Handle input jumlah rencana
            $scope.handleRencana = function(data){
                $scope.item.totalHarga = data * ($scope.item.hargaSatuan ? $scope.item.hargaSatuan : 0)
            }

            // Tutup popup
            $scope.tutup = function(){
                $scope.isRencanaProduk = null
                $scope.isUpdate = false

                resetForm()

                $scope.popupTambahRencanaBelanja.close()
            }

            // Check stock
            $scope.getSatuan = function(){
                $scope.dataVOloaded = true
                medifirstService.get("perencanaan/get-info-stok-perencanaan?" 
                    + "produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.dataVOloaded = false
                        $scope.item.stokProduk = e.data[0].qtyproduk
                    })
            }

            // Tambah reverensi
            $scope.bukaTambahReverensi = function(){
                $scope.popupTambahReverensi.center().open()
            }

            // Tutup reverensi
            $scope.tutupTambahReverensi = function(){
                $scope.popupTambahReverensi.close()
            }

            // Simpan reverensi
            $scope.tambahReverensi = function(){
                $scope.listReverensi.push($scope.item.reverensi)
                $scope.item.reverensi = null
                $scope.item.listReverensi = $scope.listReverensi.toString()
            }

            // Tambah detail perencanaan
            $scope.tambahPerencanaan = function(){
                
                // Validasi
                if(!$scope.item.produk && $scope.isRencanaProduk){
                    toastr.error('Pilih produk terlebih dahulu')
                    return
                }

                if(!$scope.item.namaKegiatan && ($scope.isRencanaProduk == false)){
                    toastr.error('Masukkan nama kegiatan terlebih dahulu')
                    return
                }

                if($scope.item.jumlahRencana == null || $scope.item.jumlahRencana == undefined){
                    toastr.error('Isi Jumlah Rencana Terlebih Dahulu')
                    return
                }

                if($scope.item.hargaSatuan == null || $scope.item.hargaSatuan == undefined){
                    toastr.error('Isi Harga Terlebih Dahulu')
                    return
                }

                if(!$scope.item.satuan){
                    toastr.error('Pilih Satuan Terlebih Dahulu')
                    return
                }

                if($scope.item.listReverensi == null || $scope.item.listReverensi == undefined){
                    toastr.error('Isi Reverensi Terlebih Dahulu')
                    return
                }

                if($scope.isRencanaProduk){

                    const data = {
                        no: ($scope.dataPerencanaan.length + 1),
                        produk: $scope.item.produk,
                        stokProduk: $scope.item.stokProduk,
                        jumlahRencana: $scope.item.jumlahRencana,
                        hargaSatuan: $scope.item.hargaSatuan,
                        listReverensi: $scope.item.listReverensi,
                        totalHarga: $scope.item.totalHarga,
                        satuan: $scope.item.satuan,
                    }

                    $scope.dataPerencanaan.push(data)
                }else{

                    const data = {
                        no: ($scope.dataPerencanaan.length + 1),
                        namaKegiatan: $scope.item.namaKegiatan,
                        jumlahRencana: $scope.item.jumlahRencana,
                        hargaSatuan: $scope.item.hargaSatuan,
                        listReverensi: $scope.item.listReverensi,
                        totalHarga: $scope.item.totalHarga,
                        satuan: $scope.item.satuan,
                    }

                    $scope.dataPerencanaan.push(data)
                }

                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: $scope.dataPerencanaan,
                    pageSize: 100,
                    total: $scope.dataPerencanaan.length,
                })
                
                // Reset input
                $scope.item.produk = undefined
                $scope.item.stokProduk = null
                $scope.item.listReverensi = null
                $scope.listReverensi = []
                $scope.item.namaKegiatan = null
                $scope.item.jumlahRencana = null
                $scope.item.hargaSatuan = null
                $scope.item.satuan = null
                $scope.item.totalHarga = null

            }

            // Klik grid detail perencanaan
            $scope.klikListPerencanaan = function(dataSelected){
                if(dataSelected != undefined){
                    $scope.selectedListPerencanaan = dataSelected

                }
            }

            // Hapus detail perencanaan
            $scope.hapusListPerencanaan = function(){
                if($scope.selectedListPerencanaan == undefined || $scope.selectedListPerencanaan == null){
                    toastr.error('Pilih Data Terlebih Dahulu')
                    return
                }

                $scope.dataPerencanaan.forEach(function(a, index){
                    // console.log(a.no)
                    if(a.no == $scope.selectedListPerencanaan.no){
                        $scope.dataPerencanaan.splice(index, 1)
                    }

                    $scope.gridDataPerencanaan = new kendo.data.DataSource({
                        data: $scope.dataPerencanaan
                    })
                })

                
            }

            // Simpan perencanaan
            $scope.simpanPerencanaan = function(){

                if($scope.item.subSubKegiatanSPJ == undefined){
                    toastr.error('Pilih Sub Sub Kegiatan Terlebih Dahulu')
                    return false
                }

                if($scope.item.idRuanganLoginUser == undefined){
                    toastr.error('Pilih Ruangan Terlebih Dahulu')
                    return false
                }

                if($scope.dataPerencanaan == undefined || $scope.dataPerencanaan.length <=0){
                    toastr.error('Tambahkan Data Rencana Terlebih Dahulu')
                    return
                }

                if($scope.isUpdate){
                    toastr.error('State Anda Sedang Edit')
                    return
                }

                $scope.dataVOloaded = true
                medifirstService.post('perencanaan/simpan-rencana-belanja', {
                        tgldokumen: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                        idSubSubKegiatan: $scope.item.subSubKegiatanSPJ.id,
                        idLogin: $scope.pegawai.id,
                        idRuangan: $scope.item.idRuanganLoginUser.id,
                        tahunanggaran: $scope.item.tahunAnggaran,
                        dataPerencanaan: $scope.dataPerencanaan
                    }).then(function(e){
                        $scope.dataVOloaded = false
                        
                        // Reset form dan data
                        resetForm()

                        $scope.isUpdate = false

                        // close popup
                        $scope.popupTambahRencanaBelanja.close()

                        loadDataCombo()
                    })
            }

            // Klik grid utama perencanaan
            $scope.klikGrid = function (dataSelected){
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                }
                // console.log($scope.dataSelected.rencana.norec)
            }

            // Hapus data perencanaan
            $scope.hapusData = function(){
                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected.rencana.tglverifikasi){
                    toastr.error("Data sudah divalidasi")
                    return
                }

                $scope.dataVOloaded = true

                medifirstService.post('perencanaan/delete-rencana-belanja', {
                    norec: $scope.dataSelected.rencana.norec
                }).then(function(e){
                    $scope.dataVOloaded = false

                    loadDataCombo()
                })
            }

            // Edit data perencanaan
            $scope.editData = function(){
                $scope.dataPerencanaan = []
                $scope.isUpdate = true

                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected.rencana.tglverifikasi){
                    toastr.error("Data sudah divalidasi")
                    return
                }

                $scope.dataVOloaded = true

                medifirstService.get('perencanaan/edit-rencana-belanja?norec='
                    + $scope.dataSelected.rencana.norec
                    + '&idLogin=' + $scope.userLogin.id)
                    .then(function(e){
                        $scope.dataVOloaded = false
                        
                        let result = e.data

                        if(result.details[0].namakegiatan == null){
                            $scope.isRencanaProduk = true
                        }else{
                            $scope.isRencanaProduk = false
                        }

                        // Popup buka
                        $scope.popupTambahRencanaBelanja.center().open()

                        // Data ke form
                        $scope.item.subSubKegiatanSPJ = result.subsub
                        $scope.item.idRuanganLoginUser = result.ruangan
                        $scope.item.tahunAnggaran = moment(result.tahunanggaran).format('YYYY')

                        result.details.map(function(data, index){

                            // Kondisi jika detail perencanaan menggunakan produk atau kegiatan
                            if(data.namakegiatan == null){

                                const item = {
                                    no: (index + 1),
                                    norec: data.norec,
                                    produk: { id: data.objectprodukfk, namaproduk: data.namaproduk },
                                    stokProduk: data.qtystok,
                                    jumlahRencana: data.qtyrencana,
                                    hargaSatuan: data.hargasatuan,
                                    listReverensi: data.keteranganlainnya,
                                    satuan: data.satuan,
                                    totalHarga: data.totalharga,
                                }
            
                                $scope.dataPerencanaan.push(item)
                            }else{

                                const item = {
                                    no: (index + 1),
                                    norec: data.norec,
                                    namaKegiatan: data.namakegiatan,
                                    jumlahRencana: data.qtyrencana,
                                    hargaSatuan: data.hargasatuan,
                                    listReverensi: data.keteranganlainnya,
                                    satuan: data.satuan,
                                    totalHarga: data.totalharga,
                                }
            
                                $scope.dataPerencanaan.push(item)
                            }
                        })

                        console.log($scope.dataPerencanaan)

                        // Data ke Grid
                        $scope.gridDataPerencanaan = new kendo.data.DataSource({
                            data: $scope.dataPerencanaan
                        })

                    })
            }

            // Update data perencanaan
            $scope.updateData = function(){

                if($scope.dataPerencanaan == undefined || $scope.dataPerencanaan.length <=0){
                    toastr.error('Tambahkan Data Rencana Terlebih Dahulu')
                    return
                }

                if($scope.item.subSubKegiatanSPJ == undefined){
                    toastr.error('Pilih Sub Sub Kegiatan Terlebih Dahulu')
                    return false
                }

                if($scope.item.idRuanganLoginUser == undefined){
                    toastr.error('Pilih Ruangan Terlebih Dahulu')
                    return
                }

                $scope.dataVOloaded = true
                
                medifirstService.post('perencanaan/update-rencana-belanja', {
                    norec: $scope.dataSelected.rencana.norec,
                    tgldokumen: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    idSubSubKegiatan: $scope.item.subSubKegiatanSPJ.id,
                    idLogin: $scope.pegawai.id,
                    idRuangan: $scope.item.idRuanganLoginUser.id,
                    dataPerencanaan: $scope.dataPerencanaan
                }).then(function(e){
                    $scope.dataVOloaded = false
                    
                    // Reset form dan data
                    resetForm()

                    // close popup
                    $scope.popupTambahRencanaBelanja.close()

                    loadDataCombo()
                })

            }

            function resetForm(){

                // Reset data reverensi dan perencanaan
                $scope.listReverensi = []
                $scope.dataPerencanaan = []

                // Reset form
                $scope.item.subSubKegiatanSPJ = undefined
                $scope.item.mataAnggaranSPJ = undefined
                $scope.item.idRuanganLoginUser = undefined
                $scope.item.produk = undefined
                $scope.item.stokProduk = null
                $scope.item.jumlahRencana = null
                $scope.item.listReverensi = null
                $scope.item.hargaSatuan = null
                $scope.item.namaKegiatan = null

                // Reset grid list perencanaan
                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: $scope.dataPerencanaan
                })

            }

            function validation() {
                if($scope.item.tglPengajuan == undefined){
                    toastr.error('Isi Tanggal Pengajuan Terlebih Dahulu')
                    return false
                }

                if($scope.item.subSubKegiatanSPJ == undefined){
                    toastr.error('Pilih Sub Sub Kegiatan Terlebih Dahulu')
                    return false
                }

                if($scope.item.mataAnggaranSPJ == undefined){
                    toastr.error('Pilih Rekening Terlebih Dahulu')
                    return false
                }

                if($scope.item.jumlahRencana == null || $scope.item.jumlahRencana == undefined){
                    toastr.error('Isi Jumlah Rencana Terlebih Dahulu')
                    return false
                }

                if($scope.item.hargaSatuan == null || $scope.item.hargaSatuan == undefined){
                    toastr.error('Isi Harga Terlebih Dahulu')
                    return false
                }

                if($scope.item.listReverensi == null || $scope.item.listReverensi == undefined){
                    toastr.error('Isi Reverensi Terlebih Dahulu')
                    return false
                }

                if($scope.listLoginUserToRuangan == undefined || $scope.listLoginUserToRuangan.length <= 0){
                    toastr.error('Login User Belum di Map ke Ruangan')
                    return false
                }

                if($scope.item.idRuanganLoginUser == undefined){
                    toastr.error('Pilih Ruangan Terlebih Dahulu')
                    return false
                }

                return (true)
            }

            $scope.columnGrid = [
                { "field": "no", "title": "No", "width": "45px", },
                { "field": "produk.namaproduk", "title": "Nama Produk", },
                { "field": "stokProduk", "title": "Stok Produk" },
                { "field": "jumlahRencana", "title": "Jumlah Rencana" },
                { "field": "hargaSatuan", "title": "Harga Satuan"},
                { "field": "satuan.satuanstandar", "title": "Satuan" },
                { "field": "totalHarga", "title": "Total Harga" }, 
                { "field": "listReverensi", "title": "Reverensi" },
            ]

            $scope.columnGridPerencanaan = {
                columns: [
                    {
                        "field": "rencana.no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "rencana.nostruk",
                        "title": "No Struk",
                    },
                    {
                        "field": "rencana.tgldokumen",
                        "title": "Tanggal Pengajuan",
                    },
                    {
                        "field": "rencana.namalengkap",
                        "title": "Nama Pegawai",
                    },
                    {
                        "field": "rencana.namaruangan",
                        "title": "Nama Ruangan",
                    },
                    {
                        "field": "rencana.keterangan",
                        "title": "Sub Sub Kegiatan",
                    },
                ]
            }

            $scope.columnGridRencanaKegiatan = [
                { "field": "no", "title": "No", "width": "45px", },
                { "field": "namaKegiatan", "title": "Nama Kegiatan", },
                { "field": "jumlahRencana", "title": "Jumlah Rencana" },
                { "field": "hargaSatuan", "title": "Harga Satuan"},
                { "field": "satuan.satuanstandar", "title": "Satuan" },
                { "field": "totalHarga", "title": "Total Harga" }, 
                { "field": "listReverensi", "title": "Reverensi" },
            ]

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
        }
    ]);
});