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
            $scope.listSubSubKegiatanTransfer = []
            $scope.listsubSubKegiatan = []
            $scope.listMataAnggaran = []
            $scope.dataPerencanaan = []
            $scope.listReverensi = []
            $scope.listPrioritas = []
            $scope.listSatuan = []
            $scope.listVerifikasi = [
                { name: "Disetujui", value: 1 }, 
                { name: "Ditolak", value: 2 },
                { name: "Diskusi", value: 3 }
            ]
            $scope.listTahapKegiatan = []

            loadDataCombo()

            function loadPerencanaan(){
                $scope.dataVOloaded = true

                const tglAwal = $scope.item.tglAwal
                const tglAkhir = $scope.item.tglAkhir

                var status = '';
                if ($scope.item.statusverif != undefined && $scope.item.statusverif != null) {
                    status = '&statusverif=' + $scope.item.statusverif.value
                }
                medifirstService.get('perencanaan/get-rencana-belanja?' 
                    + 'tglAwal=' + moment(tglAwal).format('YYYY-MM-DD HH:mm:ss')
                    + '&tglAkhir=' + moment(tglAkhir).format('YYY-MM-DD HH:mm:ss')
                    + status)
                    .then(function(e){
                        let result = e.data
                        
                        result.map(function(item, index){
                            item.rencana.no = index + 1

                            item.details.map(function(detail, indexDetail){
                                detail.no = indexDetail + 1
                               
                                let cari = $scope.listVerifikasi.find(item => item.value == detail.statusverif)

                                if(cari){
                                    detail.statusverif = cari.name
                                }else{
                                    detail.statusverif = 'Belum verifikasi'
                                }
                            })
                        })
                        
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
                                            "title": "Referensi"
                                        },
                                        {
                                            "field": "statusverif",
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
                                            "title": "Referensi"
                                        },
                                        {
                                            "field": "statusverif",
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

                // Get combo perencanaan
                medifirstService.get('rba/get-combo-rba')
                    .then(function(response){
                    
                        $scope.listTahapKegiatan = response.data.tahapAnggaran
                        
                        // Memilih tahap indikatif 1
                        $scope.item.tahap =  $scope.listTahapKegiatan[0]
        
                        medifirstService.get('perencanaan/get-combo-perencanaan-belanja?'
                            +'idLogin=' + $scope.userLogin.id)
                            .then(function(e){
        
                                $scope.dataVOloaded = false
        
                                $scope.listSubSubKegiatan = e.data.subSubKegiatan
                                $scope.listAsalProduk = e.data.asalProduk
                                $scope.listProduk = e.data.dataProdukAll
                                $scope.listPrioritas = e.data.prioritas
                                $scope.listSatuan = e.data.satuan
                                $scope.listMataAnggaran = e.data.mataanggarancombo
                                
                                loadPerencanaan()
                            })
                        
                        
                    })

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

                if($scope.dataSelected == undefined || $scope.dataSelected == null){
                    toastr.error("Pilih Data Terlebih Dahulu")
                    return
                }

                // let verif = $scope.dataSelected.details.filter(item => item.statusverif !== "Belum verifikasi")
                // if(verif.length > 0){
                //     toastr.error("Sudah ada data yang diverifikasi")
                //     return
                // }
                
                // validasi jika sudah diverifikasi
                if($scope.dataSelected.rencana.tglverifikasi !== null || $scope.dataSelected.rencana.objectpegawaiveriffk !== null){
                    toastr.error("Sudah ada data yang diverifikasi")
                    return
                }


                $scope.dataVOloaded = true
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
                        
                        // // Get mata anggaran berdasarkan sub sub
                        // medifirstService.get('perencanaan/get-data-combo?' 
                        //     + 'idsubsub=' + $scope.dataSelected.rencana.objectsubkegiatanfk)
                        //     .then(function (e) {
                        //         $scope.dataVOloaded = false
                                
                        //         $scope.listMataAnggaranSPJ = e.data.mataanggarancombo

                        //     })

                        // Buka popup
                        $scope.popupTambahRencanaBelanja.center().open()

                        // Data ke form
                        $scope.item.tglPengajuan = moment(result.tgldokumen).format('YYYY-MM-DD')
                        $scope.item.subSubKegiatan = result.subsub
                        $scope.item.idRuanganLoginUser = result.ruangan
                        $scope.item.tahunAnggaran = moment(result.tahunanggaran).format('YYYY')
                        $scope.item.keterangan = result.keteranganp
                        
                        // prioritas
                        let prioritas = null
                        $scope.listPrioritas.map(function(item){
                            if(item.id == result.objectprioritasfk){
                                prioritas = item
                            }
                        })
                        $scope.item.prioritas = prioritas

                        result.details.map(function(data, index){
                            let mataanggaran = null
                            $scope.listMataAnggaran.map(function(ma){
                                if(ma.id == data.objectmataanggaranfk){
                                    mataanggaran = ma
                                }
                            })

                            let statusverif = null
                            $scope.listVerifikasi.map(function(sv){
                                if(sv.value == data.statusverif){
                                    statusverif = sv
                                }
                            })

                            let sumberdana = null
                            $scope.listAsalProduk.map(function(ap){
                                if(ap.id == data.objectasalprodukfk){
                                    sumberdana = ap
                                }
                            })

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
                                    keterangandetail: data.keterangandetail,
                                    satuanstandar: data.satuanstandar,

                                    // mataanggaran
                                    mataAnggaran: data.objectmataanggaranfk ? mataanggaran : null,
                                    statusverif: data.statusverif ? statusverif : 0,
                                    jumlahVerifikasi: data.qtyverifikasi ? data.qtyverifikasi : 0,
                                    sumberdana: data.objectasalprodukfk ? sumberdana : null,
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
                                    keterangandetail: data.keterangandetail,
                                    satuanstandar: data.satuanstandar,

                                    // mata anggaran
                                    mataAnggaran: data.objectmataanggaranfk ? mataanggaran : null,
                                    statusverif: data.statusverif ? statusverif : 0,
                                    jumlahVerifikasi: data.qtyverifikasi ? data.qtyverifikasi : 0,
                                    sumberdana: data.objectasalprodukfk ? sumberdana : null,
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

                    // console.log($scope.selectedListPerencanaan)

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

                    if($scope.selectedListPerencanaan.jumlahVerifikasi){
                        $scope.item.jumlahVerifikasi = parseInt($scope.selectedListPerencanaan.jumlahVerifikasi)
                        $scope.handleJmlVerifikasi(parseInt($scope.selectedListPerencanaan.jumlahVerifikasi))
                    }

                    if($scope.selectedListPerencanaan.mataAnggaran){
                        $scope.item.mataAnggaran = $scope.selectedListPerencanaan.mataAnggaran
                    }

                    if($scope.selectedListPerencanaan.statusverif){
                        $scope.item.statusVerif = $scope.selectedListPerencanaan.statusverif
                    }

                    if($scope.selectedListPerencanaan.sumberdana){
                        $scope.item.asalproduk = $scope.selectedListPerencanaan.sumberdana
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

                if(!$scope.item.asalproduk){
                    toastr.error('Pilih Sumber dana Terlebih Dahulu')
                    return
                }

                if(!$scope.item.statusVerif){
                    toastr.error('Pilih Status Verifikasi Terlebih Dahulu')
                    return
                }

                // if($scope.item.keterangandetail == undefined || $scope.item.keterangandetail == null){
                //     toastr.error('Isi Detail rencana terlebih dahulu')
                //     return
                // }

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
                        data.statusverif = $scope.item.statusVerif
                        data.sumberdana = $scope.item.asalproduk
                        data.tahunanggaran = $scope.item.tahunAnggaran
                        // data.keterangandetail = $scope.item.keterangandetail
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

                // if($scope.item.asalproduk == undefined || $scope.item.asalproduk == null){
                //     toastr.error('Pilih Asal Produk Terlebih Dahulu')
                //     return
                // }

                if ($scope.item.statusVerif!= null && $scope.item.statusVerif != undefined) {
                    toastr.error('Data sudah di Verifikasi, tidak bisa verifikasi ulang');
                    return;
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

                console.log({
                    norec: $scope.dataSelected.rencana.norec,
                    idLogin: $scope.pegawai.id,
                    idKegiatan: $scope.item.subSubKegiatan.id,
                    idTahap: $scope.item.tahap.id,
                    // idAsalProduk: $scope.item.asalproduk.id,
                    tglVerifikasi: $scope.item.tglVerifikasi,
                    dataPerencanaan: $scope.dataPerencanaan,
                    idPrioritas: $scope.item.prioritas.id,
                })

                // Memverifikasi
                medifirstService.post('perencanaan/verifikasi-rencana-belanja', {
                        norec: $scope.dataSelected.rencana.norec,
                        idLogin: $scope.pegawai.id,
                        idKegiatan: $scope.item.subSubKegiatan.id,
                        idTahap: $scope.item.tahap.id,
                        // idAsalProduk: $scope.item.asalproduk.id,
                        tglVerifikasi: $scope.item.tglVerifikasi,
                        dataPerencanaan: $scope.dataPerencanaan,
                        idPrioritas: $scope.item.prioritas.id,
                        keterangan:  $scope.item.keterangan
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
                $scope.item.tahapawal = $scope.listTahapKegiatan[0]
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
                
                if($scope.item.subsubkegiatanTransfer == undefined || $scope.item.subsubkegiatanTransfer == null){
                    toastr.error('Pilih sub sub kegiatan terlebih dahulu')
                    return
                }

                if($scope.item.asalprodukTransfer == undefined || $scope.item.asalprodukTransfer == null){
                    toastr.error('Pilih sumber dana terlebih dahulu')
                    return
                }

                if($scope.item.tahapawal == undefined || $scope.item.tahapawal == null){
                    toastr.error('Pilih tahap awal terlebih dahulu')
                    return
                }

                if($scope.item.tahunawal == undefined || $scope.item.tahunawal == null){
                    toastr.error('Pilih tahun awal terlebih dahulu')
                    return
                }

                let mataanggaran = '';
                if($scope.item.mataAnggaranTransfer !== undefined && $scope.item.mataAnggaranTransfer !== null){
                    mataanggaran = "&mataanggaran=" + $scope.item.mataAnggaranTransfer.id
                }
                
                $scope.dataVOloaded = true

                // Cari sub kegiatan
                medifirstService.get("rba/getSubSubRBA?" 
                    + "tahap=" + $scope.item.tahapawal.id 
                    + "&tahunawal=" + moment($scope.item.tahunawal).format('YYYY') 
                    + "&subsubkegiatan=" + $scope.item.subsubkegiatanTransfer.id
                    + mataanggaran)
                    .then(function (e) {
                        $scope.dataVOloaded = false
                        
                        let result = e.data.map((item, index) => ({...item, no: index + 1}))

                        // console.log(result)

                        // $scope.listSubSubKegiatanTransfer = e.data

                        // $scope.arrayProdukTemp = []
                        // if ($scope.listSubSubKegiatanTransfer.length > 0) {
                        //     for (let i = 0; i < $scope.listSubSubKegiatanTransfer.length; i++) {
                        //         const element = $scope.listSubSubKegiatanTransfer[i];
                        //         element.isChecked = false
                        //     }
                        // }

                        $scope.gridDataTransfer = new kendo.data.DataSource({
                            data: result,
                            pageSize: 100,
                            total: e.data.length,
                            serverPaging: false,
                        }) 


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
                    $scope.listSubSubKegiatan = []
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
                $scope.item.keterangandetail = null
                $scope.item.asalproduk = null
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
                    { field: "stokProduk", title: "Stok Produk", width: "70px" },
                    { field: "jumlahRencana", title: "Jumlah Rencana", width: "70px" },
                    { field: "jumlahVerifikasi", title: "Jumlah Verifikasi", width: "70px" },
                    { field: "satuan.satuanstandar", title: "Satuan", width: "80px" },
                    { field: "hargaSatuan", title: "Harga Satuan", width: "80px" },
                    { field: "totalHarga", title: "Total Harga", width: "100px" }, 
                    { field: "listReverensi", title: "Referensi" },
                    { field: "mataAnggaran?.namaanggaran", title: "Rekening" },
                    { field: "sumberdana?.asalproduk", title: "Sumber dana" }
                    // { field: "keterangandetail", title: "Detail Rencana" }
                ]
            }

            $scope.columnGridPerencanaan = {
                toolbar: [

                        "excel",
                    
                        ],
                    
                        excel: {
                    
                            fileName: "DaftarVerifikasiBelanja.xlsx",
                    
                            allPages: true,
                    
                            },
                    
                        excelExport: function(e){
                    
                        var sheet = e.workbook.sheets[0];
                    
                        sheet.frozenRows = 2;
                    
                        sheet.mergedCells = ["A1:K1"];
                    
                        sheet.name = "Daftar Verifikasi";
                    
                      
                        var myHeaders = [{
                    
                            value:"Daftar Verifikasi Belanja",
                    
                            fontSize: 20,
                    
                            textAlign: "center",
                    
                            background:"#ffffff",
                    
                        // color:"#ffffff"
                    
                        }];
                    
                      sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                    
                    },
                columns: [
                    {
                        field: 'rencana.norec', 
                        title: "Tool",
                        template: '<button ng-click="hapusRencana(dataItem.rencana.norec)" class="k-button k-button-icontext k-grid-upload">Hapus</button> <button ng-click="batalverifikasi(dataItem.rencana.norec)" class="k-button k-button-icontext k-grid-upload">Batal Verif</button>',
                    },
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
                { field: "listReverensi", title: "Referensi" },
                { field: "mataAnggaran?.namaanggaran", title: "Rekening" },
                { field: "sumberdana?.asalproduk", title: "Sumber dana" }
            ]

            $scope.columnTransfer = {
                columns: [
                    { field: "no", title: "No", width: "45px" },
                    { field: "nostruk", title: "No struk" },
                    { field: "namaproduk", title: "Nama Produk" },
                    { field: "namakegiatan", title: "Nama Kegiatan" },
                    { field: "qtystok", title: "Stok Produk" },
                    { field: "qtyrencana", title: "Jumlah Rencana", width: "70px" },
                    { field: "qtyverifikasi", title: "Jumlah Verifikasi", width: "70px" },
                    { field: "hargasatuan", title: "Harga Satuan", width: "80px" },
                    { field: "totalharga", title: "Total Harga", width: "100px" }, 
                    { field: "referensi", title: "Referensi" },
                    { field: "rekening", title: "Rekening" },
                    { field: "asalproduk", title: "Sumber Dana" },
                ]
            }
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.cariDariList = function(list, id){
                let hasil = null
                list.map(function (item) {
                    if (item.id == id) {
                        hasil = item
                    }
                })

                return hasil
            }

            $scope.bundleTransfer = function(){
                
                //check jika digrid ada data
                if($scope.gridDataTransfer.options.data.length == 0){
                    toastr.error("Belum ada data yang ditransfer")
                    return
                }

                if($scope.item.mataAnggaranTransfer == undefined && $scope.item.mataAnggaranTransfer == null){
                    toastr.error("Harus memilih rekening dulu")
                    return
                }
                
                // console.log($scope.gridDataTransfer)

                $scope.totalBundle = 0;

                $scope.gridDataTransfer.options.data.map(function(item){
                    $scope.totalBundle += parseFloat(item.totalharga)
                })

                $scope.popupTransferBundle.center().open()
            }

            $scope.batalBundle = function(){
                $scope.item.keterangantransferbundle = null
                $scope.item.hargasatuantransferbundle = null
                $scope.item.jumlahtransferbundle = null
                $scope.item.subtotaltransferbundle = null
                $scope.item.satuantransferbundle = null
                $scope.totalBundle = 0

                $scope.popupTransferBundle.close()
            }

            $scope.simpanBundle = function(){
                // validasi
                if($scope.item.keterangantransferbundle !== undefined && $scope.item.keterangantransferbundle == null){
                    toastr.error("Isi keterangan terlebih dahulu ")
                    return
                }
                if($scope.item.hargasatuantransferbundle !== undefined && $scope.item.hargasatuantransferbundle == null){
                    toastr.error("Isi harga satuan terlebih dahulu ")
                    return
                }
                if($scope.item.jumlahtransferbundle !== undefined && $scope.item.jumlahtransferbundle == null){
                    toastr.error("Isi jumlah terlebih dahulu ")
                    return
                }
                if($scope.item.subtotaltransferbundle !== undefined && $scope.item.subtotaltransferbundle == null){
                    toastr.error("Isi subtotal terlebih dahulu ")
                    return
                }
                if($scope.item.satuantransferbundle !== undefined && $scope.item.satuantransferbundle == null){
                    toastr.error("Isi subtotal terlebih dahulu ")
                    return
                }
                if($scope.item.tahapakhirbundle !== undefined && $scope.item.tahapakhirbundle == null){
                    toastr.error("Isi tahap terlebih dahulu ")
                    return
                }

                // ambil norec setiap detail
                // untuk nanti diupdate istransfer
                let dataDetail = $scope.gridDataTransfer.options.data

                let objSaveBundle = {
                    objectkegiatanfk: dataDetail[0].idsubsubkegiatan,
                    objectmataanggaranfk: dataDetail[0].idmataanggaran,
                    objectasalprodukfk: dataDetail[0].idasalproduk,
                    
                    tahapawal: dataDetail[0].idtahap,
                    tahapakhir: $scope.item.tahapakhirbundle.id,
                    tahuntransfer: dataDetail[0].tahunanggaran,

                    keteranganbelanja: $scope.item.keterangantransferbundle,
                    hargasatuan: $scope.item.hargasatuantransferbundle,
                    juml: $scope.item.jumlahtransferbundle,
                    subtotal: $scope.item.subtotaltransferbundle,
                    satuan: $scope.item.satuantransferbundle,
                    
                    details: dataDetail
                }

                medifirstService.post('perencanaan/simpan-transfer', objSaveBundle).then(function (e) {
                    $scope.cariTransferAnggaran()

                    // reset
                    $scope.item.keterangantransferbundle = null
                    $scope.item.hargasatuantransferbundle = null
                    $scope.item.jumlahtransferbundle = null
                    $scope.item.subtotaltransferbundle = null
                    $scope.item.satuantransferbundle = null
                    $scope.item.tahapakhirbundle = null

                    $scope.popupTransferBundle.close()
                })

            }

            $scope.transferSatuan = function(data){
                console.log(data)
                // $scope.totalSatuan = 0;
                // $scope.dataSatuan = null;

                // medifirstService.get('perencanaan/get-detail-rencana-bynorec' 
                //     + '?norec=' + data).then(function(result){
                //         // console.log(result)
                //         $scope.totalSatuan = result.data[0].totalharga
                //         $scope.dataSatuan = result.data

                //         $scope.popupTransferSatuan.center().open()
                //     })

            }

            $scope.batalSatuan = function(){
                $scope.item.keterangantransfersatuan = null
                $scope.item.hargasatuantransfersatuan = null
                $scope.item.jumlahtransfersatuan = null
                $scope.item.subtotaltransfersatuan = null
                $scope.item.satuantransfersatuan = null
                $scope.totalBundle = 0

                $scope.popupBundleTransfer.close()
            }

            $scope.simpanSatuan = function(){
                
                // ambil data dari grid
                let dataDetail = $scope.gridDataTransfer.options.data

                console.log(dataDetail)
                let objSaveBundle = {
                    objectkegiatanfk: dataDetail[0].idsubsubkegiatan,
                    tahapakhir: dataDetail[0].idtahap,
                    tahuntransfer: dataDetail[0].tahunanggaran,
                    details: dataDetail
                }

                medifirstService.post('perencanaan/simpan-transfer-satuan', objSaveBundle).then(function (e) {
                    $scope.cariTransferAnggaran()

                    // reset
                    $scope.item.keterangantransferbundle = null
                    $scope.item.hargasatuantransferbundle = null
                    $scope.item.jumlahtransferbundle = null
                    $scope.item.subtotaltransferbundle = null
                    $scope.item.satuantransferbundle = null
                    $scope.item.tahapakhirbundle = null

                    $scope.popupTransferBundle.close()
                })
            
                
            }

            $scope.hapusRencana = function(data){
                // console.log(data)
                
                // dapatkan data yang dipilih
                let selected = null
                $scope.dataGridPerencanaan.options.data.map(function(item){

                    if(item.rencana.norec == data){
                        selected = item
                    }

                });
                // console.log(selected)

                // validasi cek apakah detail sudah ada yang diverifikasi
                let verif = selected.details.filter(item => item.statusverif !== "Belum verifikasi")
                if(verif.length > 0){
                    toastr.error("Sudah ada data yang diverifikasi")
                    return
                }

                // validasi cek apakah detail sudah ada yang ditransfer
                let transfer = selected.details.filter(item => item.istransfer == false)
                if(verif.length > 0){
                    toastr.error("Sudah ada data yang ditransfer")
                    return
                }

                medifirstService.post('perencanaan/delete-rencana-belanja', {
                    norec: data
                    }).then(function(e){
                        $scope.dataVOloaded = false

                        loadDataCombo()
                    })

            }

            $scope.batalverifikasi = function(data){
                // dapatkan data yang dipilih
                let selected = null
                $scope.dataGridPerencanaan.options.data.map(function(item){

                    if(item.rencana.norec == data){
                        selected = item
                    }

                });

                // cek apakah sudah diverifikasi
                if(selected.rencana.tglverifikasi == null || selected.rencana.objectpegawaiveriffk == null){
                    toastr.error("Belum ada data yang diverifikasi")
                    return
                }

                // cek apakah detail sudah ada yang ditransfer
                let transfer = selected.details.filter(item => item.istransfer == true)
                if(transfer.length > 0){
                    toastr.error("Sudah ada data yang ditransfer")
                    return
                }

                medifirstService.post('perencanaan/batal-verifikasi-rencana', {
                    norec: data
                    }).then(function(e){
                        $scope.dataVOloaded = false

                        loadDataCombo()
                    })
            }
            
            // ---------------------------------------------------------------

        }
        
    ]);
});