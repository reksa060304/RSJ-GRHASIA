define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RencanaBelanjaCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.now = new Date()
            $scope.item = {}
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
            $scope.dataPerencanaan = []
            $scope.listSubKegiatanSPJ = []
            $scope.listMataAnggaranSPJ = []

            loadDataCombo()

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
            
            function loadDataCombo() {
                $scope.dataVOloaded = true

                medifirstService.get('perencanaan/get-combo-perencanaan-belanja?idLogin='
                    + $scope.userLogin.id)
                    .then(function(e){
                        $scope.dataVOloaded = false

                        $scope.listSubSubKegiatanSPJ = e.data.subSubKegiatan
                        $scope.listAsalProduk = e.data.asalProduk
                        $scope.listProduk = e.data.dataProdukAll
                    })
                
                loadPerencanaan()
            }

            /**
             * Tombol cari filter
             */
            $scope.cari = function(){
                loadPerencanaan()
            }

            /**
             * Tombol Tambah Rencana Produk
             */
            $scope.bukaTambahRencanaProduk = function() {
                // Update state
                $scope.isRencanaProduk = true
                
                $scope.popupTambahRencanaBelanja.center().open()
            }

            /**
             * Tombol Tambah Rencana Kegiatan
             */
            $scope.bukaTambahRencanaKegiatan = function() {
                // Update state
                $scope.isRencanaProduk = false
                
                $scope.popupTambahRencanaBelanja.center().open()
            }

            /**
             * Tutup modal/pop up
             */
            $scope.tutup = function(){
                $scope.isRencanaProduk = null

                resetForm()

                $scope.popupTambahRencanaBelanja.close()
            }

            /**
             * Ketika Sub Kegiatan dipilih
             */
            $scope.$watch('item.subSubKegiatanSPJ', function (newValue, oldValue) {
                // $scope.dataVOloaded = true
                if (newValue != oldValue) {
                    medifirstService.get('perencanaan/get-data-combo?idsubsub='+$scope.item.subSubKegiatanSPJ.id).then(function (e) {
                        // $scope.dataVOloaded = false
                        
                        $scope.listMataAnggaranSPJ = e.data.mataanggarancombo
                    });
                }
            });

            /**
             * Cari stock barang
             */
            $scope.getSatuan = function(){
                $scope.dataVOloaded = true
                medifirstService.get("perencanaan/get-info-stok-perencanaan?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        $scope.dataVOloaded = false
                        $scope.item.stokProduk = e.data[0].qtyproduk
                    })
            }

            /**
             * Klik tombol tambah reverensi reverensi
             */
            $scope.bukaTambahReverensi = function(){
                $scope.popupTambahReverensi.center().open()
            }

            /**
             * Klik tutup reverensi
             */
            $scope.tutupTambahReverensi = function(){
                $scope.popupTambahReverensi.close()
            }

            /**
             * Klik simpan reverensi
             */
            $scope.tambahReverensi = function(){
                $scope.listReverensi.push($scope.item.reverensi)
                $scope.item.reverensi = null
                $scope.item.listReverensi = $scope.listReverensi.toString()
            }

            /**
             * Klik tambah rencana
             */
            $scope.tambahPerencanaan = function(){
                
                validation()

                if($scope.isRencanaProduk ){
                    if($scope.item.produk == undefined ){
                        toastr.error('Pilih Produk Terlebih Dahulu')
                        return false
                    }

                    const data = {
                        no: ($scope.dataPerencanaan.length + 1),
                        produk: $scope.item.produk,
                        stokProduk: $scope.item.stokProduk,
                        jumlahRencana: $scope.item.jumlahRencana,
                        hargaSatuan: $scope.item.hargaSatuan,
                        listReverensi: $scope.item.listReverensi
                    }

                    $scope.dataPerencanaan.push(data)
                }else{
                    if($scope.item.namaKegiatan == null ){
                        toastr.error('Masukan Nama Kegiatan Terlebih Dahulu')
                        return false
                    }

                    const data = {
                        no: ($scope.dataPerencanaan.length + 1),
                        namaKegiatan: $scope.item.namaKegiatan,
                        jumlahRencana: $scope.item.jumlahRencana,
                        hargaSatuan: $scope.item.hargaSatuan,
                        listReverensi: $scope.item.listReverensi
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

            }

            /**
             * Klik Grid Detail Perencanaan
             */
            $scope.klikListPerencanaan = function(dataSelected){
                if(dataSelected != undefined){
                    $scope.selectedListPerencanaan = dataSelected

                }
            }

            /**
             * Hapus List Detail Perencanaan
             */
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

            /**
             * Simpan Data Rencana dan Detailnya
             */
            $scope.simpanPerencanaan = function(){
                
                if($scope.dataPerencanaan == undefined || $scope.dataPerencanaan.length <=0){
                    toastr.error('Tambahkan Data Rencana Terlebih Dahulu')
                    return
                }

                if($scope.isUpdate){
                    toastr.error('State Anda Sedang Update')
                    return
                }

                $scope.dataVOloaded = true
                medifirstService.post('perencanaan/simpan-rencana-belanja', {
                        tgldokumen: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                        idSubSubKegiatan: $scope.item.subSubKegiatanSPJ.id,
                        idMataAnggaran: $scope.item.mataAnggaranSPJ.id,
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

            /**
             * Klik Data Rencana di Grid Utama
             */
            $scope.klikGrid = function (dataSelected){
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                }
                // console.log($scope.dataSelected.rencana.norec)
            }

            /**
             * Hapus Data Rencana di Grid Utama
             */
            $scope.hapusData = function(){
                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
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

            /**
             * Edit Data Rencana di Grid Utama
             */
            $scope.editData = function(){
                                
                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected !== null){
                    toastr.error("Data Yang Dipilih Sudah Terverifikasi")
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
                        $scope.item.mataAnggaranSPJ = result.mataanggaran
                        $scope.item.idRuanganLoginUser = result.ruangan

                        result.details.forEach(function(data, index){

                            // Kondisi jika detail perencanaan menggunakan produk atau kegiatan
                            if(data.namakegiatan == null){

                                const item = {
                                    no: (index + 1),
                                    norec: data.norec,
                                    produk: { id: data.objectprodukfk, namaproduk: data.namaproduk },
                                    stokProduk: data.qtystok,
                                    jumlahRencana: data.qtyrencana,
                                    hargaSatuan: data.hargasatuan,
                                    listReverensi: data.keteranganlainnya
                                }
            
                                $scope.dataPerencanaan.push(item)
                            }else{

                                const item = {
                                    no: (index + 1),
                                    norec: data.norec,
                                    namaKegiatan: data.namakegiatan,
                                    jumlahRencana: data.qtyrencana,
                                    hargaSatuan: data.hargasatuan,
                                    listReverensi: data.keteranganlainnya
                                }
            
                                $scope.dataPerencanaan.push(item)
                            }
                        })

                        // Data ke Grid
                        $scope.gridDataPerencanaan = new kendo.data.DataSource({
                            data: $scope.dataPerencanaan
                        })

                    })
            }

            /**
             * Update Data Rencan di Grid Utama
             */
            $scope.updateData = function(){

                $scope.dataVOloaded = true

                if($scope.dataPerencanaan == undefined || $scope.dataPerencanaan.length <=0){
                    toastr.error('Tambahkan Data Rencana Terlebih Dahulu')
                    $scope.dataVOloaded = false
                    return
                }

                if($scope.item.idRuanganLoginUser == undefined){
                    toastr.error('Pilih Ruangan Terlebih Dahulu')
                    $scope.dataVOloaded = false
                    return
                }


                medifirstService.post('perencanaan/update-rencana-belanja', {
                    norec: $scope.dataSelected.rencana.norec,
                    tgldokumen: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    idSubSubKegiatan: $scope.item.subSubKegiatanSPJ.id,
                    idMataAnggaran: $scope.item.mataAnggaranSPJ.id,
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

            $scope.columnGrid = [
                { "field": "no", "title": "No", "width": "45px", },
                { "field": "produk.namaproduk", "title": "Nama Produk", },
                { "field": "stokProduk", "title": "Stok Produk" },
                { "field": "jumlahRencana", "title": "Jumlah Rencana" },
                { "field": "hargaSatuan", "title": "Harga Satuan"}, 
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
                    {
                        "field": "rencana.matanggaran",
                        "title": "Sumber Dana"
                    }
                ]
            }

            $scope.columnGridRencanaKegiatan = [
                { "field": "no", "title": "No", "width": "45px", },
                { "field": "namaKegiatan", "title": "Nama Kegiatan", },
                { "field": "jumlahRencana", "title": "Jumlah Rencana" },
                { "field": "hargaSatuan", "title": "Harga Satuan"}, 
                { "field": "listReverensi", "title": "Reverensi" },
            ]

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
        }
    ]);
});