define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('VerifikasiRencanaCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.now = new Date()
            $scope.item = {}
            $scope.dataVOloaded = false
            $scope.userLogin = JSON.parse(window.localStorage.getItem('datauserlogin'))
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            $scope.listLoginUserToRuangan = JSON.parse(window.localStorage.getItem('mapLoginUserToRuangan'))
            
            // Tanggal default
            $scope.item.tglPengajuan = moment($scope.now).format('YYYY-MM-DD')
            $scope.item.tglVerifikasi = moment($scope.now).format('YYYY-MM-DD')
            
            // Tanggal filter
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00')
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
            
            // State
            $scope.isUbahDetail = false
            $scope.isRencanaProduk = null

            // Data
            $scope.listSubKegiatanSPJ = []
            $scope.listMataAnggaranSPJ = []
            $scope.dataPerencanaan = []
            $scope.listReverensi = []
            $scope.listPrioritas = []
            $scope.listTahapKegiatan = [
                { id: 100, tahap: "Semua Kegiatan" },
                { id: 1, tahap: "Indikatif Murni" },
                { id: 2, tahap: "Murni Definitif" },
                { id: 4, tahap: "Pergeseran 1" },
                { id: 3, tahap: "Pergeseran 2" },
                { id: 5, tahap: "Pegeseran 3" },
                { id: 6, tahap: "Perubahan" },
            ];

            loadDataCombo()

            function loadPerencanaan(){
                $scope.dataVOloaded = true

                const tglAwal = $scope.item.tglAwal
                const tglAkhir = $scope.item.tglAkhir

                medifirstService.get('perencanaan/get-rencana-belanja?' 
                    + 'tglAwal=' + moment(tglAwal).format('YYYY-MM-DD HH:mm:ss')
                    + '&tglAkhir=' + moment(tglAkhir).format('YYY-MM-DD HH:mm:ss'))
                    .then(function(e){
                        let result = e.data
                        
                        for (var i = 0; i < result.length; i++) {
                            result[i].rencana.no = i + 1

                            for (let e = 0; e < result[i].details.length; e++) {
                                result[i].details[e].no = e + 1;

                                if(result[i].details[e].isverifikasi == true){
                                    result[i].details[e].isverifikasi = 'Telah Diverifikasi'
                                }else{
                                    result[i].details[e].isverifikasi = 'Ditolak verifikasi'
                                }
                            }
                        }
                        
                        $scope.dataGridPerencanaan = new kendo.data.DataSource({
                            data: result,
                            pageSize: 100,
                            total: result.length,
                            serverPaging: false,
                        });

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

                // Memilih item array ke 2
                $scope.item.tahap =  $scope.listTahapKegiatan[1]

                medifirstService.get('perencanaan/get-combo-perencanaan-belanja?idLogin='
                    + $scope.userLogin.id)
                    .then(function(e){

                        $scope.dataVOloaded = false

                        $scope.listSubSubKegiatanSPJ = e.data.subSubKegiatan
                        $scope.listAsalProduk = e.data.asalProduk
                        $scope.listProduk = e.data.dataProdukAll
                        $scope.listPrioritas = e.data.prioritas
                    })
                
                loadPerencanaan()
            }

            /**
             * Cari filter
             */
            $scope.cari = function(){
                loadPerencanaan()
            }

            /**
             * Klik Data Rencana di Grid Utama
             */
            $scope.klikGrid = function (dataSelected){
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected

                    // console.log($scope.dataSelected.rencana)
                }
            }

            /**
             * Popup verifikasi
             */
            $scope.verifikasiData = function(){
                // Kosongkan data perencanaan dulu
                $scope.dataPerencanaan = []

                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected.rencana.tglverifikasi !== null){
                    toastr.error("Data Yang Dipilih Sudah Terverifikasi")
                    return
                }

                medifirstService.get('perencanaan/edit-rencana-belanja?norec='
                    + $scope.dataSelected.rencana.norec)
                    .then(function(e){
                        $scope.dataVOloaded = false
                        let result = e.data

                        if(result.details[0].namakegiatan == null){
                            $scope.isRencanaProduk = true
                        }else{
                            $scope.isRencanaProduk = false
                        }
                        
                        // Buka popup
                        $scope.popupTambahRencanaBelanja.center().open()

                        // Data ke form
                        $scope.item.tglPengajuan = result.tgldokumen
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

                            // Update grid
                            $scope.gridDataPerencanaan = new kendo.data.DataSource({
                                data: $scope.dataPerencanaan
                            })
                        })
                    })

            }

            $scope.tutup = function(){
                $scope.isRencanaProduk = null

                resetFormVerifikasi()

                // Kosongkan data perencanaaan
                $scope.dataPerencanaan = []

                // Reset form
                $scope.item.prioritas = undefined
                $scope.item.asalproduk = undefined

                $scope.popupTambahRencanaBelanja.close()
            }

            /**
             * Mengetahui stock jika input produk berubah
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
             * Klik tambah rencana
             */
            $scope.tambahPerencanaan = function(){
                
                validation()

                const data = {
                    no: ($scope.dataPerencanaan.length + 1),
                    produk: $scope.item.produk,
                    stokProduk: $scope.item.stokProduk,
                    jumlahRencana: $scope.item.jumlahRencana,
                    listReverensi: $scope.item.listReverensi
                }

                $scope.dataPerencanaan.push(data)
                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: $scope.dataPerencanaan
                })
                
                $scope.item.produk = undefined
                $scope.item.stokProduk = null
                $scope.item.listReverensi = null
                $scope.listReverensi = []
                $scope.item.jumlahRencana = null

                console.log($scope.dataPerencanaan)
            }

            /**
             * Klik Grid Detail Perencanaan
             */
            $scope.klikListPerencanaan = function(dataSelected){
                if(dataSelected != undefined){

                    // Simpan data yang dipilih kedalam variabel
                    $scope.selectedListPerencanaan = dataSelected

                    // Ubah state
                    $scope.isUbahDetail = true

                    // Maskkan reverensi dari data yang dipilh kedalam variabel
                    $scope.listReverensi = $scope.selectedListPerencanaan.listReverensi.split(',')

                    // Masukkan data yang dipilih kedalam input
                    $scope.item.stokProduk = $scope.selectedListPerencanaan.stokProduk
                    $scope.item.jumlahRencana = parseInt($scope.selectedListPerencanaan.jumlahRencana)
                    $scope.item.listReverensi = $scope.selectedListPerencanaan.listReverensi
                    $scope.item.hargaSatuan = parseInt($scope.selectedListPerencanaan.hargaSatuan)
                    
                    if(dataSelected.namaKegiatan == null){
                        $scope.item.produk = $scope.selectedListPerencanaan.produk
                    }else{
                        $scope.item.namaKegiatan = $scope.selectedListPerencanaan.namaKegiatan
                    }
                    // console.log(dataSelected)
                }
            }

            /**
             * Ubah Detail Perencanaan
             */
            $scope.ubahDetail = function(){
                if($scope.selectedListPerencanaan == undefined || $scope.selectedListPerencanaan == null){
                    toastr.error('Pilih Data Terlebih Dahulu')
                    return
                }

                if($scope.item.jumlahVerifikasi == undefined || $scope.item.jumlahVerifikasi == null){
                    toastr.error('Isi jumlah verifikasi Terlebih Dahulu')
                    return
                }

                $scope.dataPerencanaan.forEach(function(data, index){
                    if(data.no == $scope.selectedListPerencanaan.no){
                        if(data.namaKegiatan == null){
                            data.produk = $scope.item.produk
                            data.stokProduk = $scope.item.stokProduk
                        }else{
                            data.namaKegiatan = $scope.item.namaKegiatan
                        }
                        data.jumlahRencana = $scope.item.jumlahRencana
                        data.jumlahVerifikasi = $scope.item.jumlahVerifikasi
                        data.hargaSatuan = $scope.item.hargaSatuan
                        data.listReverensi = $scope.item.listReverensi
                    }
                })

                // reset form
                resetFormVerifikasi()

                // update gridnya
                $scope.gridDataPerencanaan = new kendo.data.DataSource({
                    data: $scope.dataPerencanaan
                })

                // Ubah state
                $scope.isUbahDetail = false

                console.log($scope.dataPerencanaan)
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

                resetFormVerifikasi()
                
            }

            /**
             * Simpan Data Rencana dan Detailnya
             */
            $scope.verifikasiPerencanaan = function(){
                
                if($scope.dataPerencanaan == undefined || $scope.dataPerencanaan.length <=0){
                    toastr.error('Tambahkan Data Rencana Terlebih Dahulu')
                    return
                }

                if($scope.item.prioritas == undefined || $scope.item.prioritas == null){
                    toastr.error('Pilih Prioritas Terlebih Dahulu')
                    return
                }

                if($scope.item.asalproduk == undefined || $scope.item.asalproduk == null){
                    toastr.error('Pilih Asal Produk Terlebih Dahulu')
                    return
                }

                if($scope.dataPerencanaan[0].jumlahVerifikasi == undefined || $scope.dataPerencanaan[0].jumlahVerifikasi == null){
                    toastr.error('Isi Jumlah Verifikasi Terlebih Dahulu')
                    return
                }

                $scope.dataVOloaded = true

                // Memverifikasi
                medifirstService.post('perencanaan/verifikasi-rencana-belanja', {
                        norec: $scope.dataSelected.rencana.norec,
                        idLogin: $scope.pegawai.id,
                        idKegiatan: $scope.item.subSubKegiatanSPJ.id,
                        idMataAnggaran: $scope.item.mataAnggaranSPJ.id,
                        idTahap: $scope.item.tahap.id,
                        idAsalProduk: $scope.item.asalproduk.id,
                        tglVerifikasi: $scope.item.tglVerifikasi,
                        dataPerencanaan: $scope.dataPerencanaan,
                        idPrioritas: $scope.item.prioritas.id,
                    }).then(function(e){
                        $scope.dataVOloaded = false
                        
                        // Tutup popup
                        $scope.popupTambahRencanaBelanja.close()

                        // Load data baru
                        loadDataCombo()
                    })
            }

            $scope.columnGrid = [
                { "field": "no", "title": "No", },
                { "field": "produk.namaproduk", "title": "Nama Produk", },
                { "field": "stokProduk", "title": "Stok Produk" },
                { "field": "jumlahRencana", "title": "Jumlah Rencana" },
                { "field": "jumlahVerifikasi", "title": "Jumlah Verifikasi" },
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
                { "field": "jumlahVerifikasi", "title": "Jumlah Verifikasi" },
                { "field": "listReverensi", "title": "Reverensi" },
            ]

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

                if($scope.item.produk == undefined ){
                    toastr.error('Pilih Produk Terlebih Dahulu')
                    return false
                }

                if($scope.item.jumlahRencana == null || $scope.item.jumlahRencana == undefined){
                    toastr.error('Isi Jumlah Rencana Terlebih Dahulu')
                    return false
                }

                if($scope.item.jumlahVerifikasi == null || $scope.item.jumlahVerifikasi == undefined){
                    toastr.error('Isi Jumlah Verifikasi Terlebih Dahulu')
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

            function resetFormVerifikasi(){

                // Reset data reverensi dan perencanaan
                $scope.listReverensi = []

                $scope.isUbahDetail = false

                // Reset form
                $scope.item.produk = undefined
                $scope.item.namaKegiatan = null
                $scope.item.stokProduk = null
                $scope.item.jumlahRencana = null
                $scope.item.jumlahVerifikasi = null
                $scope.item.hargaSatuan = null
                $scope.item.listReverensi = null

            }

            // ---------------------- dalam pengembangan ---------------------------------
            $scope.sandingkan = function(){

                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected.rencana.tglverifikasi == null){
                    toastr.error("Data Yang Dipilih Belum Terverifikasi")
                    return
                }

                $scope.dataVOloaded = true

                medifirstService.get('perencanaan/sandingkan-data?norec='+$scope.dataSelected.rencana.norec, true).then(function(e){
                    
                    $scope.dataVOloaded = false

                    // result
                    const result = e.data

                    $scope.popupTambahRencanaBelanja.center().open()

                    if(result.details[0].namakegiatan == null){
                        $scope.isRencanaProduk = true
                    }else{
                        $scope.isRencanaProduk = false
                    }

                    // update state
                    $scope.isSandingkan = true

                    // Data ke form
                    $scope.item.tglPengajuan = moment(result.tgldokumen).format('YYYY-MM-DD')
                    $scope.item.tglPengajuan = moment(result.tglverifikasi).format('YYYY-MM-DD')
                    $scope.item.subSubKegiatanSPJ = result.objectKegiatan
                    $scope.item.mataAnggaranSPJ = result.objectMataAnggaran
                    $scope.item.idRuanganLoginUser = result.objectRuangan
                    $scope.item.prioritas = result.objectPrioritas

                    result.details.forEach(function(data, index){
                        // Kondisi jika detail perencanaan menggunakan produk atau kegiatan
                        if(data.namakegiatan == null){

                            const item = {
                                no: (index + 1),
                                norec: data.norec_detail,
                                produk: data.produk,
                                stokProduk: data.qtystok,
                                jumlahRencana: data.qtyrencana,
                                hargaSatuan: data.hargasatuan,
                                listReverensi: data.keteranganlainnya
                            }
        
                            $scope.dataPerencanaan.push(item)
                        }else{

                            const item = {
                                no: (index + 1),
                                norec: data.norec_detail,
                                namaKegiatan: data.namakegiatan,
                                jumlahRencana: data.qtyrencana,
                                hargaSatuan: data.hargasatuan,
                                listReverensi: data.keteranganlainnya
                            }
        
                            $scope.dataPerencanaan.push(item)
                        }

                        // Update grid
                        $scope.gridDataPerencanaan = new kendo.data.DataSource({
                            data: $scope.dataPerencanaan
                        })
                    })
                    
                })

            }

            $scope.bukaKirim = function(){

            }            
        }
    ]);
});