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
            $scope.listSubKegiatanTransfer = []
            $scope.listSubKegiatanSPJ = []
            $scope.listMataAnggaranSPJ = []
            $scope.dataPerencanaan = []
            $scope.listReverensi = []
            $scope.listPrioritas = []
            $scope.listSatuan = []
            $scope.listVerifikasi = [{ name: "Ya", value: 1 }, { name: "Tidak", value: 0 }]
            $scope.listTahapKegiatan = [
                { id: 100, tahap: "Semua Kegiatan" },
                { id: 1, tahap: "Indikatif 1" },
                { id: 2, tahap: "Murni Definitif" },
                { id: 4, tahap: "Pergeseran 1" },
                { id: 3, tahap: "Pergeseran 2" },
                { id: 5, tahap: "Pegeseran 3" },
                { id: 6, tahap: "Perubahan" },
                { id: 7, tahap: "Indikatif 2" },
            ]

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

                // Memilih tahap indikatif 1
                $scope.item.tahap =  $scope.listTahapKegiatan[1]

                medifirstService.get('perencanaan/get-combo-perencanaan-belanja?'
                    +'idLogin=' + $scope.userLogin.id)
                    .then(function(e){

                        $scope.dataVOloaded = false

                        $scope.listSubSubKegiatanSPJ = e.data.subSubKegiatan
                        $scope.listAsalProduk = e.data.asalProduk
                        $scope.listProduk = e.data.dataProdukAll
                        $scope.listPrioritas = e.data.prioritas
                        $scope.listSatuan = e.data.satuan
                    })
                
                loadPerencanaan()
            }

            // Tombol cari filter
            $scope.cari = function(){
                loadPerencanaan()
            }

            // Klik grid perencanaan utama
            $scope.klikGrid = function (dataSelected){
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected

                }
            }

            // Klik tombol verifikasi
            $scope.verifikasiData = function(){
                // Kosongkan data dulu
                $scope.dataPerencanaan = []
                $scope.listMataAnggaranSPJ = []

                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                if($scope.dataSelected.rencana.tglverifikasi !== null){
                    toastr.error("Data Yang Dipilih Sudah Terverifikasi")
                    return
                }

                $scope.dataVOloaded = true
                medifirstService.get('perencanaan/edit-rencana-belanja?norec='
                    + $scope.dataSelected.rencana.norec)
                    .then(function(e){
                        // $scope.dataVOloaded = false
                        let result = e.data

                        if(result.details[0].namakegiatan == null){
                            $scope.isRencanaProduk = true
                        }else{
                            $scope.isRencanaProduk = false
                        }
                        
                        // Get mata anggaran berdasarkan sub sub
                        medifirstService.get('perencanaan/get-data-combo?' 
                            + 'idsubsub=' + $scope.dataSelected.rencana.objectsubkegiatanfk)
                            .then(function (e) {
                                $scope.dataVOloaded = false
                                
                                $scope.listMataAnggaranSPJ = e.data.mataanggarancombo

                            })

                        // Buka popup
                        $scope.popupTambahRencanaBelanja.center().open()

                        // Data ke form
                        $scope.item.tglPengajuan = result.tgldokumen
                        $scope.item.subSubKegiatanSPJ = result.subsub
                        $scope.item.idRuanganLoginUser = result.ruangan
                        $scope.item.tahunAnggaran = moment(result.tahunanggaran).format('YYYY')
                        
                        result.details.map(function(data, index){
                            // Kondisi jika detail perencanaan menggunakan produk atau kegiatan
                            if(data.namakegiatan == null){
                                $scope.isRencanaProduk = true

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
                                    mataAnggaran: null
                                }
            
                                $scope.dataPerencanaan.push(item)
                            }else{

                                $scope.isRencanaProduk = false

                                const item = {
                                    no: (index + 1),
                                    norec: data.norec,
                                    namaKegiatan: data.namakegiatan,
                                    jumlahRencana: data.qtyrencana,
                                    hargaSatuan: data.hargasatuan,
                                    listReverensi: data.keteranganlainnya,
                                    satuan: data.satuan,
                                    totalHarga: data.totalharga,
                                    mataAnggaran: null
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

            // Klik tombol tutup di popup verifikasi
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

            // Klik grid detail perencanaan
            $scope.klikListPerencanaan = function(dataSelected){
                if(dataSelected != undefined){

                    // Simpan data yang dipilih kedalam variabel
                    $scope.selectedListPerencanaan = dataSelected

                    // Ubah state
                    $scope.isUbahDetail = true

                    // Maskkan reverensi dari data yang dipilh kedalam variabel
                    if($scope.selectedListPerencanaan.listReverensi){
                        $scope.listReverensi = $scope.selectedListPerencanaan.listReverensi.split(',')
                    }

                    // Masukkan data yang dipilih kedalam input
                    $scope.item.stokProduk = $scope.selectedListPerencanaan.stokProduk
                    $scope.item.jumlahRencana = parseInt($scope.selectedListPerencanaan.jumlahRencana)
                    $scope.item.listReverensi = $scope.selectedListPerencanaan.listReverensi
                    $scope.item.hargaSatuan = parseInt($scope.selectedListPerencanaan.hargaSatuan)
                    $scope.item.satuan = $scope.selectedListPerencanaan.satuan

                    if($scope.isRencanaProduk == true){
                        $scope.item.produk = $scope.selectedListPerencanaan.produk
                    }else{
                        $scope.item.namaKegiatan = $scope.selectedListPerencanaan.namaKegiatan
                    }
                }
            }

            // Klik tombol verifikasi
            $scope.ubahDetail = function(){
                if($scope.selectedListPerencanaan == undefined || $scope.selectedListPerencanaan == null){
                    toastr.error('Pilih Data Terlebih Dahulu')
                    return
                }

                if($scope.item.jumlahVerifikasi == undefined || $scope.item.jumlahVerifikasi == null){
                    toastr.error('Isi Jumlah Verifikasi Terlebih Dahulu')
                    return
                }

                if(!$scope.item.mataAnggaran){
                    toastr.error('Pilih Rekening Terlebih Dahulu')
                    return
                }

                if(!$scope.item.statusVerif){
                    toastr.error('Pilih Status Verifikasi Terlebih Dahulu')
                    return
                }

                // ubah data
                $scope.dataPerencanaan.map(function(data, index){
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
                        data.totalHarga = $scope.item.totalHarga
                        data.satuan = $scope.item.satuan
                        data.mataAnggaran = $scope.item.mataAnggaran
                        data.isVerifikasi = $scope.item.statusVerif
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

            }

            // Klik tombol validasi
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

                $scope.dataPerencanaan.map(function(data, index){
                    if(data.jumlahVerifikasi == undefined || data.jumlahVerifikasi == null){
                        toastr.error('Isi Jumlah Verifikasi Terlebih Dahulu')
                        return false
                    }
                    if(!data.mataAnggaran){
                        toastr.error('Pilih Mata Anggaran Terlebih Dahulu')
                        return false
                    }
                })

                // console.log({
                //     norec: $scope.dataSelected.rencana.norec,
                //     idLogin: $scope.pegawai.id,
                //     idKegiatan: $scope.item.subSubKegiatanSPJ.id,
                //     idTahap: $scope.item.tahap.id,
                //     idAsalProduk: $scope.item.asalproduk.id,
                //     tglVerifikasi: $scope.item.tglVerifikasi,
                //     dataPerencanaan: $scope.dataPerencanaan,
                //     idPrioritas: $scope.item.prioritas.id,
                // })

                // Memverifikasi
                medifirstService.post('perencanaan/verifikasi-rencana-belanja', {
                        norec: $scope.dataSelected.rencana.norec,
                        idLogin: $scope.pegawai.id,
                        idKegiatan: $scope.item.subSubKegiatanSPJ.id,
                        idTahap: $scope.item.tahap.id,
                        idAsalProduk: $scope.item.asalproduk.id,
                        tglVerifikasi: $scope.item.tglVerifikasi,
                        dataPerencanaan: $scope.dataPerencanaan,
                        idPrioritas: $scope.item.prioritas.id,
                    }).then(function(e){
                        
                        // Tutup popup
                        $scope.popupTambahRencanaBelanja.close()

                        // Load data baru
                        loadDataCombo()
                    })
            }

            // Klik tombol transfer anggaran
            $scope.klikTransfer = function(){
                $scope.dataVOloaded = true

                medifirstService.get("perencanaan/get-data-combo?" 
                    + "tahun=" +moment($scope.now).format('YYYY'))
                    .then(function (e) {
                        $scope.dataVOloaded = false

                        $scope.listSubKegiatanTransfer = e.data.subkegiatantransfer

                        $scope.popupTransferAnggaran.center().open()

                    })
            }

            // Klik tombol cari transfer anggaran
            $scope.cariTransferAnggaran = function(){
                
                if($scope.item.tahapawal == undefined || $scope.item.tahapawal == null){
                    toastr.error('Pilih tahap awal terlebih dahulu')
                    return
                }

                if($scope.item.tahunawal == undefined || $scope.item.tahunawal == null){
                    toastr.error('Pilih tahun awal terlebih dahulu')
                    return
                }

                if($scope.item.subkegiatantransfer == undefined || $scope.item.subkegiatantransfer == null){
                    toastr.error('Pilih sub sub kegiatan terlebih dahulu')
                    return
                }
                
                $scope.dataVOloaded = true

                // Cari sub kegiatan
                medifirstService.get("perencanaan/get-data-combo?" 
                    + "tahap=" + $scope.item.tahapawal.id 
                    + "&tahunawal=" + moment($scope.item.tahunawal).format('YYYY') 
                    + "&subkegiatan=" + $scope.item.subkegiatantransfer.id)
                    .then(function (e) {
                        $scope.dataVOloaded = false

                        $scope.listSubSubKegiatan = e.data.kegiatansubsub
                        $scope.arrayProdukTemp = []
                        if ($scope.listSubSubKegiatan.length > 0) {
                            for (let i = 0; i < $scope.listSubSubKegiatan.length; i++) {
                                const element = $scope.listSubSubKegiatan[i];
                                element.isChecked = false
                            }
                        }
                    })
            }
            
            $scope.ceklisOne = function (bool, data) {
                if (bool) {
                    $scope.listSubSubKegiatan.forEach(function (e) {
                        if (data.idsubsubkegiatan == e.idsubsubkegiatan && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                        if (data.idsubsubkegiatan == e.idsubsubkegiatan && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                    })
                } else {
                    $scope.listSubSubKegiatan.forEach(function (e) {
                        if (data.idsubsubkegiatan == e.idsubsubkegiatan && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                        if (data.idsubsubkegiatan == e.idsubsubkegiatan && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                    })
                }
            }

            // Klik simpan transfer
            $scope.SaveSettingTahap = function () {
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Data belum di pilih')
                    return
                }

                if($scope.item.tahapakhir == undefined || $scope.item.tahapakhir == null){
                    toastr.error('Pilih tahap akhir terlebhih dahulu')
                    return
                }

                if($scope.item.tahunakhir == undefined || $scope.item.tahunakhir == null){
                    toastr.error('Pilih tahun akhir terlebih dahulu')
                    return
                }

                var objSave = {
                    "details": $scope.arrayProdukTemp,
                    "tahapawal": $scope.item.tahapawal,
                    "tahapakhir": $scope.item.tahapakhir,
                    "tahunakhir": moment($scope.item.tahunakhir).format('YYYY'),
                    "tglbuat": moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }

                // console.log(objSave)

                medifirstService.post('perencanaan/transfer-verifikasi-rencana', objSave).then(function (e) {
                    $scope.arrayProdukTemp = []

                    $scope.popupTransferAnggaran.center().close()
                    
                    // loadDataGrid();

                    // Reset input
                    $scope.item.tahapawal = null
                    $scope.item.tahunawal = null
                    item.subkegiatantransfer = null
                    $scope.arrayProdukTemp = []
                    $scope.item.tahapakhir = null
                    $scope.item.tahunakhir = null
                })

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
                $scope.item.satuan = null
                $scope.item.totalHarga = null
                $scope.item.mataAnggaran = null
                $scope.item.statusVerif = null

            }

            $scope.handleHargaSatuan = function(data){
                $scope.item.totalHarga = data * ($scope.item.jumlahRencana ? $scope.item.jumlahRencana : 0)
            }

            $scope.handleJmlVerifikasi = function(data){
                $scope.item.totalHarga = data * ($scope.item.hargaSatuan ? $scope.item.hargaSatuan : 0)
            }

            $scope.columnGrid = {
                columns: [
                    { field: "no", title: "No", width: "45px" },
                    { field: "produk.namaproduk", title: "Nama Produk" },
                    { field: "stokProduk", title: "Stok Produk" },
                    { field: "jumlahRencana", title: "Jumlah Rencana", width: "70px" },
                    { field: "jumlahVerifikasi", title: "Jumlah Verifikasi", width: "70px" },
                    { field: "satuan.satuanstandar", title: "Satuan", width: "80px" },
                    { field: "hargaSatuan", title: "Harga Satuan", width: "80px" },
                    { field: "totalHarga", title: "Total Harga", width: "100px" }, 
                    { field: "listReverensi", title: "Reverensi" },
                    { field: "mataAnggaran?.text", title: "Rekening" },
                ]
            }

            $scope.columnGridPerencanaan = {
                columns: [
                    { field: "rencana.no", title: "No", width: "45px", },
                    { field: "rencana.nostruk", title: "No Struk", },
                    { field: "rencana.tgldokumen", title: "Tanggal Pengajuan", },
                    { field: "rencana.namalengkap", title: "Nama Pegawai", },
                    { field: "rencana.namaruangan", title: "Nama Ruangan", },
                    { field: "rencana.keterangan", title: "Sub Sub Kegiatan", },
                ]
            }

            $scope.columnGridRencanaKegiatan = [
                { field: "no", title: "No", width: "45px" },
                { field: "namaKegiatan", title: "Nama Kegiatan" },
                { field: "jumlahRencana", title: "Jumlah Rencana", width: "70px" },
                { field: "jumlahVerifikasi", title: "Jumlah Verifikasi", width: "70px" },
                { field: "satuan.satuanstandar", title: "Satuan", width: "80px" },
                { field: "hargaSatuan", title: "Harga Satuan", width: "80px" },
                { field: "totalHarga", title: "Total Harga", width: "100px" }, 
                { field: "listReverensi", title: "Reverensi" },
                { field: "mataAnggaran?.text", title: "Rekening" }
            ]
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
        }
    ]);
});