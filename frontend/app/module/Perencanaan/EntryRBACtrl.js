define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('EntryRBACtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog', 'MedifirstService',
        // function ($scope, $state, $mdDialog, medifirstService) {
        //     $state.go("KelompokAnggaran", {
        //         parameter: '12121'
        //     })
            
        //     /////////////////////////////////////////////////////////////////////
        // }

        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.dataVOloaded = false
            $scope.item = {}
            $scope.rcn = {}
            $scope.now = new Date()
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            $scope.disdiv = true

            $scope.item.tahun = $scope.now
            $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
            
            $scope.dataRBASelected = null
            $scope.item.tahap = null
            $scope.item.div = null

            let buttonhide = true
            let DataTotalMataAnggaran = []
            let DataTabKeteranganBelanja = []
            let DataKeteranganBelanja = []
            let isCheckAll = false
            let DataKegiatanAll = []

            $scope.listDiv = []
            $scope.listTahapKegiatan = []
            $scope.listSubKegiatanTransfer = []
            $scope.listRBA = []
            $scope.listPenerima = []
            $scope.selectedData2 = []

            $scope.idkegiatan = null

            loadDataCombo()

            // Load data combo RBA
            function loadDataCombo() {
                
                $scope.dataVOloaded = true

                medifirstService.get('rba/get-combo-rba')
                    .then(function(response){
                    
                        $scope.listDiv = response.data.kelompokAnggaran
                        $scope.listTahapKegiatan = response.data.tahapAnggaran

                        $scope.item.div = $scope.listDiv[4]
                        $scope.item.tahap =  $scope.listTahapKegiatan[0]
                        
                        DataKegiatanAll = response.data.kegiatanAnggaranAll.map(data => { return {...data, keteranganGabung: `${data.kode} - ${data.keterangan}` } })

                        loadKegiatan()

                        medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20)
                            .then(function (data) {
                                $scope.listBendahara = data
                                $scope.listPenerima = data
                            })
                    })

            }

            // Load kegiatan RBA
            function loadKegiatan(){
                $scope.dataVOloaded = true

                medifirstService.get("rba/get-data-rba?" 
                    + "tahun="+ moment($scope.item.tahun).format('YYYY')
                    + "&tahapaktif=" + $scope.item.tahap.id 
                    + "&div=" + $scope.item.div.id 
                    + "&lockdiv=true")
                    .then(function (e) {
                        $scope.dataVOloaded = false

                        $scope.listJenisBelanja = e.data.jenisbelanja
                        $scope.listRBA = e.data.kegiatan
                        for (let i = 0; i < $scope.listRBA.length; i++) {
                            $scope.listRBA[i].statCheckbox = false
                        }
                        $scope.dataSourceKegiatan = $scope.listRBA

                        // reloadGridKegiatanRBA($scope.listRBA)
                    })
            }

            /**
             * ------------------ DOMAIN KEGIATAN RBA ------------------ 
             */

            //  Cari filter
            $scope.cariKegiatan = function () {
                loadKegiatan()
            }

            // Klik tombol tambah di grid
            $scope.tambahKA = function(){
                resetInputTambahKegiatan()
                $scope.item.id = ''
                $scope.popupTambah.center().open()
            }

            $scope.$watch('item.divInput', function (data) {

                $scope.listHeadKegiatan = []
                $scope.item.headKegiatan = null

                if(data){
                    if(data.id === 4){
                        $scope.disdiv = false
                        $scope.hideHeadKegiatan = false
    
                        DataKegiatanAll.map(function(item){
                            if(item.div === 3){
                                // kegiatanDiv3.push(item)
                                $scope.listHeadKegiatan.push(item)
                            }
                        })
                    }else if(data.id === 3){
                        $scope.disdiv = true
                        $scope.hideHeadKegiatan = false
    
                        DataKegiatanAll.map(function(item){
                            if(item.div === 2){
                                // kegiatanDiv2.push(item)
                                $scope.listHeadKegiatan.push(item)
    
                            }
                        })
                    }else if(data.id == 2){
                        $scope.disdiv = true
                        $scope.hideHeadKegiatan = false
                        
                        DataKegiatanAll.map(function(item){
                            if(item.div === 1){
                                // kegiatanDiv1.push(item)
                                $scope.listHeadKegiatan.push(item)
                            }
                        })
                    }else{
                        $scope.disdiv = true
    
                        $scope.hideHeadKegiatan = true
                    }
                }
            })

            // Simpan Kegiatan
            $scope.simpanKegiatan = function(){
                if(!$scope.item.divInput){
                    toastr.error('Pilih Div Terlebih Dahulu')
                    return
                }

                if(!$scope.item.headKegiatan){
                    toastr.error('Pilih Head Kegiatan Terlebih Dahulu')
                    return
                }

                if($scope.disdiv == false && !$scope.item.tahunAdd){
                    toastr.error('Isi Tahun Terlebih Dahulu')
                    return
                }

                if($scope.disdiv == false && !$scope.item.pptkAdd){
                    toastr.error('Pilih PPTK Terlebih Dahulu')
                    return
                }

                if($scope.disdiv == false && !$scope.item.jenisbelanjaAdd){
                    toastr.error('Pilih Jenis Belanja Terlebih Dahulu')
                    return
                }

                if(!$scope.item.kodeAdd){
                    toastr.error('Isi Kode Terlebih Dahulu')
                    return
                }

                if(!$scope.item.keteranganAdd){
                    toastr.error('Isi Keterangan Terlebih Dahulu')
                    return
                }

                let jmlkode = $scope.item.kodeAdd.length

                let divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }

                let tahun = null
                if($scope.item.tahunAdd != undefined){
                    tahun = moment($scope.item.tahunAdd).format('YYYY')
                }

                let jenisbelanja = null
                if($scope.item.jenisbelanjaAdd != undefined){
                    jenisbelanja = $scope.item.jenisbelanjaAdd.id
                }

                let objSave = {
                    kode: $scope.item.kodeAdd,
                    keterangan: $scope.item.keteranganAdd,
                    kodeexternal: null,
                    namaexternal: null,
                    reportdisplay: null,
                    tahun: tahun,
                    indikatormasuk: null,
                    indikatorkeluaran: null,
                    indikatorhasil: null,
                    targetmasuk: null,
                    targetkeluaran: null,
                    targethasil: null,
                    div: $scope.item.divInput.id,
                    headfk: $scope.item.headKegiatan !== undefined ? $scope.item.headKegiatan.id : null,
                    pptk: $scope.item.pptkAdd != undefined ? $scope.item.pptkAdd.value : null,
                    jenisbelanja: jenisbelanja
                }

                $scope.dataVOloaded = true
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave)
                    .then(function (e) {
                        resetInputTambahKegiatan()

                        loadKegiatan()

                        $scope.popupTambah.center().close()
                    })
            }

            // Batal Kegiatan
            $scope.batalKegiatan = function(){
                // Reset input
                resetInputTambahKegiatan()

                $scope.popupTambah.close()
            }

            // Checkbox semua grid kegiatan RBA
            $scope.selectUnselectSemuaKegiatan = function () {

                var tempData = $scope.dataSourceKegiatan;

                if (isCheckAll) {
                    isCheckAll = false
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false
                        $scope.selectedData2 = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true
                        $scope.selectedData2.push(tempData[i])
                    }
                }

                reloadGridKegiatanRBA(tempData)

            }

            // Checkbox row grid kegiatan RBA
            $scope.selectRowKegiatan = function (e) {
                let element = $(e.currentTarget);
                let checked = element.is(':checked')
                let row = element.closest('tr')
                let grid = $("#kegGrid").data("kendoGrid")
                let dataItem = grid.dataItem(row)
                
                if (checked) {
                    dataItem.statCheckbox = true;
                    for (let i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].kode == dataItem.kode) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    $scope.selectedData2.push(dataItem);
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].kode == dataItem.kode) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }

                console.log($scope.selectedData2)
            }

            // Hapus kegiatan anggaran yang dipilih
            $scope.hapusKegiatanCentang = function () {
                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    // const element = $scope.selectedData2[i];
                    if ($scope.selectedData2[i].islockrba == true){
                        toastr.error('Pada keterangan ' + $scope.selectedData2[i].keterangan+ ' sudah dilock!')
                        return
                    }
                }

                let confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus Kegiatan yang dicentang?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok')

                $mdDialog.show(confirm).then(function () {
                    let objSave = {
                        data: $scope.selectedData2,
                        div: $scope.item.div.id
                    }

                    medifirstService.post('perencanaan/delete-kegiatan-anggaran-centang', objSave)
                        .then(function (e) {

                            loadKegiatan()
                            
                        })

                })
                
            }

            // Klik tombol next di popup detail
            $scope.nextSubSubKegiatan = function () {
                $scope.dataSourceRincianAnggaran = []
                $scope.item.isCekAdaAnggaranSaja = false
                if($scope.item.subsubkegiatanangkas != undefined){
                    LoadTotalKeterangan()
                    $scope.norecrcntotalanggaran = $scope.item.subsubkegiatanangkas.norec 
                    
                    $scope.dataVOloaded = true
                    
                    medifirstService.get("perencanaan/get-total-anggaran-rcn" 
                        +"?kegiatan=" + $scope.norecrcntotalanggaran)
                        .then(function (e) {
                            $scope.dataVOloaded = false

                            var total = 0
                            if(e.data.data.length == 0){
                                $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                $scope.rcn.paguAnggaran = 0
                            } else{
                                total = e.data.data[0].total
                                $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                $scope.rcn.paguAnggaran = 0
                            }

                            $scope.item.targetKinerjaMasukan = formatRupiah(total, "Rp. ")
                        
                        })
                }
                
                $scope.popupRincianAnggaran.center().open()
            }

            // Klik tombol simpan di popup detail
            $scope.SimpanPopUpSubSubKegiatan = function(){
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }
                var jmlkode = $scope.item.kodeHead + '.' + $scope.item.kode
                jmlkode = jmlkode.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var idtahap = null
                var tahap = null
                if($scope.item.tahap != undefined && $scope.item.tahap != '' && $scope.item.tahap != [] && $scope.item.tahap != null){
                    idtahap = $scope.item.tahap.id
                    tahap = $scope.item.tahap.tahap
                }

                var kodesubsubkegiatan = null
                var subsubkegiatan = null
                if($scope.kodesubsubkegiatanangkas != ''){
                    kodesubsubkegiatan = $scope.kodesubsubkegiatanangkas
                } else{
                    kodesubsubkegiatan = $scope.item.subSubKegiatankode
                }

                if($scope.item.subsubkegiatanangkas != undefined){
                    subsubkegiatan = $scope.item.subsubkegiatanangkas.keterangan
                } else{
                    subsubkegiatan = $scope.item.subSubKegiatan
                }

                var objSave = {
                    id: $scope.item.id,
                    kode: kodesubsubkegiatan,
                    keterangan: subsubkegiatan,
                    kodeexternal: null,
                    namaexternal: null,
                    reportdisplay: null,
                    tahun: $scope.item.thnAnggaran,
                    idtahap: idtahap,
                    tahap: tahap,
                    jenisbelanja: $scope.item.jenisbelanja.id,
                    indikatormasuk: $scope.item.tolokUkurMasukan,
                    indikatorkeluaran:  $scope.item.tolokUkurKeluaran,
                    indikatorhasil:  $scope.item.tolokUkurHasil,
                    targetmasuk:  $scope.item.targetKinerjaMasukan,
                    targetkeluaran:  $scope.item.targetKinerjaKeluaran,
                    targethasil:  $scope.item.targetKinerjaHasil,
                    pptk:  $scope.item.savepptk,
                    div: $scope.item.subsubkegiatandiv.id
                }

                $scope.dataVOloaded = true

                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave)
                    .then(function (e) {

                        $scope.dataVOloaded = false

                        loadKegiatan()
                    })
            }

            // Klik tombol hapus di popup detail
            $scope.HapusPopUpSubSubKegiatan = function(){
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }

                var objSave = {
                    tahap: $scope.item.tahap.id,
                    pengurangan: $scope.item.targetKinerjaMasukan,
                    id: $scope.item.id,
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')

                $scope.dataVOloaded = true
                
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-rincian-kegiatan-anggaran', objSave)
                        .then(function (e) {

                            $scope.dataVOloaded = false

                            loadKegiatan()
                        })
                })
            }

            // Klik tombol detail di grid
            function detailKegiatanAnggaran(e) {
                e.preventDefault()
                
                $scope.dataVOloaded = true
                // Data row grid
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"))
                // console.log(dataItem)
                
                $scope.norecrcntotalanggaran = dataItem.norec 
                $scope.datakegiatanbro = dataItem

                $scope.rcn.totalAnggaran = formatRupiah(dataItem.targetmasuk, "Rp. ")
                $scope.rcn.paguAnggaran = 0
                $scope.item.targetKinerjaMasukan = formatRupiah(dataItem.targetmasuk, "Rp. ")

                $scope.idkegiatan = dataItem.id

                $scope.item.savepptk = dataItem.objectpptkfk != null ? dataItem.objectpptkfk : null

                medifirstService.get("perencanaan/get-jenis-belanja?kegiatan=" 
                    + dataItem.id).then(function (e) {
                        $scope.dataVOloaded = false

                        if(e.data.data.length == 0){
                            $scope.item.jenisbelanja = null
                        } else{
                            $scope.item.jenisbelanja = {id:e.data.data[0].id, jenisbelanja:e.data.data[0].jenisbelanja}
                        }
                        
                    })
                
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                $scope.item.id = dataItem.id
                $scope.item.subsubketerangan = dataItem.id
                
                let kodeArr = dataItem.kode.split(" ")
                let kodeArr2 = kodeArr[0].split(".")
                let a1 = kodeArr2[0] + '.' + kodeArr2[1]
                let b1 = kodeArr2[2]
                let c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                let d1 = kodeArr2[5]  

                if(dataItem.div == 0){
                    $scope.item.urusandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupUrusan.center().open()
                    $scope.item.kode = a1
                }
                else if(dataItem.div == 1){
                    $scope.item.programdiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupProgram.center().open()
                    $scope.item.kodeHead = a1
                    $scope.item.kode = b1
                    
                }else if(dataItem.div == 2){
                    $scope.item.detaildiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupKegiatan.center().open()
                    $scope.item.kodeHead = a1 + '.' + b1
                    $scope.item.kode = c1

                }else if(dataItem.div == 3){
                    $scope.item.subkegiatandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupSubKegiatan.center().open()
                    $scope.item.kodeHead =  a1 +'.'+ b1 +'.'+c1
                    $scope.item.kode = d1 

                }else if(dataItem.div == 4){
                    $scope.idkegiatananggaran = dataItem.id
                    buttonhide = false
                    $scope.item.subsubkegiatandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.item.urusanPemerintahan = dataItem.kodeurusan + ' ' + dataItem.keteranganurusan
                    $scope.item.program = dataItem.kodeprogram + ' ' + dataItem.keteranganprogram
                    $scope.item.kegiatan = dataItem.kodekegiatan + ' ' + dataItem.keterangankegiatan
                    $scope.item.subKegiatan = dataItem.kodesubkegiatan + ' ' + dataItem.keterangansubkegiatan
                    
                    for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                        let element = $scope.dataSourceKegiatan[index]
                        
                        $scope.item.kode4 = a1 +'.'+ b1 +'.'+ c1+'.'+ d1
                    }

                    let TotalAnggaran = 0
                    
                    $scope.item.subSubKegiatankode = kodeArr[0]
                    $scope.item.subSubKegiatan =  dataItem.keterangan
                    $scope.item.thnAnggaran = dataItem.tahun
                    $scope.item.pptktext = dataItem.namalengkap
                    
                    $scope.item.tahapdetail = {id: $scope.item.tahap.id, tahap: $scope.item.tahap.tahap}

                    $scope.item.tolokUkurMasukan = 'Dana'
                    $scope.item.tolokUkurKeluaran = dataItem.indikatorkeluaran
                    $scope.item.targetKinerjaKeluaran = dataItem.targetkeluaran
                    $scope.item.tolokUkurHasil = dataItem.indikatorhasil
                    $scope.item.targetKinerjaHasil = dataItem.targethasil
                    $scope.popupSubSubKegiatan.center().open() 
                }
                
                $scope.item.keterangan = dataItem.keterangan
                $scope.item.div = dataItem.div
                LoadTotalKeterangan()
            }

            // Klik tombol delete di grid
            function hapusKegiatanRow(e) {
                e.preventDefault();

                let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                
                let objSave = {
                    id: dataItem.id,
                    div: dataItem.div,
                }

                if(dataItem.islockrba == true){
                    toastr.error('Sudah dilock!')
                    return
                }

                let confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-kegiatan-anggaran', objSave)
                        .then(function (e) {

                            loadKegiatan()
                        
                        })
                })
            }

            // Reset input ketika tambah kegiatan RBA
            function resetInputTambahKegiatan(){
                $scope.disdiv = true
                $scope.item.divInput = null
                $scope.item.headKegiatan = null
                $scope.item.tahunAdd = null
                $scope.item.pptkAdd = null
                $scope.item.jenisbelanjaAdd = null
                $scope.item.kodeAdd = null
                $scope.item.keteranganAdd = null
            }

            // Reload grid kegiatan RBA
            function reloadGridKegiatanRBA(ds) {
                // $scope.dataSourceKegiatan = ds

                let newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                let grid = $('#kegGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            function LoadTotalKeterangan(){
                var idpegawai = ''
                $scope.pegawaiLogin = medifirstService.getPegawaiLogin()
                
                medifirstService.get('anggaran/pj-rba?id=' + medifirstService.getPegawaiLogin().id).then(function (data) {
                    $scope.item.ispj = data.data[0].ispj
                    
                    if ($scope.item.ispj == true) {
                        idpegawai = $scope.pegawaiLogin.id
                    }
                    
                    $scope.rbaaja = true
                    $scope.semuaanggaran = true
                    
                    $scope.dataVOloaded = true
                    medifirstService.get("perencanaan/get-total-mata-anggaran" 
                        + "?tahun=" + $scope.item.thnAnggaran 
                        + "&tahap=" + $scope.item.tahapdetail.id 
                        + "&idpegawai=" + idpegawai 
                        + "&cek=" + $scope.item.isCekAdaAnggaranSaja 
                        + "&noreckegiatan=" + $scope.idkegiatananggaran)
                        .then(function (e) {
                            $scope.dataVOloaded = false

                            DataTotalMataAnggaran = e.data.data
                            $scope.listAsalProduk = e.data.asalproduk
                            $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                data: DataTotalMataAnggaran
                            })

                            DataTabKeteranganBelanja = []
                            // let DataInsertAlokasi = [];
                            // console.log(e.data.keteranganbelanja)
                            let dataAlokasi = e.data.alokasi
                            for (let index = 0; index < e.data.keteranganbelanja.length; index++) {
                                let element = e.data.keteranganbelanja[index];
                                for (let aa = 0; aa < dataAlokasi.length; aa++) {
                                    let alokasielement = dataAlokasi[aa];
                                    for (let bb = 0; bb < alokasielement.length; bb++) {
                                        let elementbb = alokasielement[bb];
                                        if (elementbb.kodemataanggaran == element.kodemataanggaran) {
                                            if (elementbb.bulanint == 1) {
                                                elementbb.jan = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 2) {
                                                elementbb.feb = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 3) {
                                                elementbb.mar = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 4) {
                                                elementbb.apr = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 5) {
                                                elementbb.mei = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 6) {
                                                elementbb.jun = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 7) {
                                                elementbb.jul = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 8) {
                                                elementbb.agt = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 9) {
                                                elementbb.sep = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 10) {
                                                elementbb.okt = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 11) {
                                                elementbb.nov = elementbb.nilai
                                            }
                                            if (elementbb.bulanint == 12) {
                                                elementbb.des = elementbb.nilai
                                            }

                                            elementbb.subtotal = element.subtotal
                                        }
                                        DataTabKeteranganBelanja.push(elementbb)
                                    }

                                }
                                // DataInsertAlokasi.push(element)

                            }
                            
                            $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                                data: e.data.alokasimataanggaran,
                                group: $scope.groupmataanggaran,

                            });

                            $scope.dataSearchSourceKeteranganBelanja = $scope.dataSourceKeteranganBelanja

                            $scope.dataSourceDetailKeteranganBelanja = new kendo.data.DataSource({
                                data: e.data.detailalokasimataanggaran,
                            });

                        })
                })
                    
            }


            /**
             * ------------------ DOMAIN MATA ANGGARAN ------------------
             */
            // Cek tampilkan yang ada saldonya
            $scope.$watch('item.isCekAdaAnggaranSaja', function (newValue, oldValue) {
                $scope.dataVOloaded = true
                
                if (newValue != oldValue) {

                    var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id
                    
                    medifirstService.get("perencanaan/get-total-mata-anggaran" 
                        + "?tahun=" + moment($scope.now).format('YYYY')
                        + "&tahap=" + $scope.item.tahapdetail.id 
                        + "&idpegawai=" + idpegawai
                        + "&cek=" + $scope.item.isCekAdaAnggaranSaja
                        + "&noreckegiatan=" + $scope.idkegiatananggaran)
                        .then(function (e) {
                            $scope.dataVOloaded = false

                            DataTotalMataAnggaran = e.data.data
                            $scope.listAsalProduk = e.data.asalproduk
                            $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                data: DataTotalMataAnggaran
                            })
                        })
                }
            })

            // Klik grid detail mata anggaran
            $scope.klikGridMataAnggaran = function (dataMataAnggaranSelected) {
                if (dataMataAnggaranSelected != undefined) {
                    $scope.subtotalgakilang = dataMataAnggaranSelected
                    // console.log($scope.subtotalgakilang)
                    let kodeArr = dataMataAnggaranSelected.kodemataanggaran.split(".");
                    let a1 = kodeArr[0] 
                    let b1 = kodeArr[1]
                    let c1 = kodeArr[2] 
                    let cek = 'III.'
                    
                    let myRega1 = new RegExp(a1 + ".*")
                    let myRegb1 = new RegExp(a1 + '.' + b1 + ".*")
                    let myRegc1 = new RegExp(a1 + '.' + b1 + '.' + c1 + ".*")
                    
                    let d1 = dataMataAnggaranSelected.kodemataanggaran
                    $scope.rcn.totallv1 = 0
                    $scope.rcn.totallv2 = 0
                    $scope.rcn.totallv3 = 0
                    for (let index = 0; index < $scope.dataSourceDetailMT._data.length; index++) {
                        let element = $scope.dataSourceDetailMT._data[index];
                        if(a1 == 'I'){
                            if(element.kodemataanggaran.match(myRega1) && !element.kodemataanggaran.match(/III.*/) && !element.kodemataanggaran.match(/II.*/)){
                                $scope.rcn.mataAnggaranlv1 = a1
                                $scope.rcn.totallv1 += parseInt(element.total)
                                // console.log(element.total)
                            }
                        } else if(a1 == 'II'){
                            if(element.kodemataanggaran.match(myRega1) && !element.kodemataanggaran.match(/III.*/)){
                                $scope.rcn.mataAnggaranlv1 = a1
                                $scope.rcn.totallv1 += parseInt(element.total)
                                // console.log(element.total)
                            }
                        } else if(a1 == 'III'){
                            if(element.kodemataanggaran.match(myRega1)){
                                $scope.rcn.mataAnggaranlv1 = a1
                                $scope.rcn.totallv1 += parseInt(element.total)
                                // console.log(element.total)
                            }
                        }
                        
                        if(element.kodemataanggaran.match(myRegb1)){
                            $scope.rcn.mataAnggaranlv2 = a1 + '.' + b1
                            $scope.rcn.totallv2 += parseInt(element.total)
                        }
                        if(element.kodemataanggaran.match(myRegc1)){
                            $scope.rcn.mataAnggaranlv3 = a1 + '.' + b1 + '.' + c1
                            $scope.rcn.totallv3 += parseInt(element.total)
                            //console.log(element.total)
                        }
                    }
                    $scope.rcn.totallv3 = formatRupiah($scope.rcn.totallv3, "Rp. ")
                    $scope.rcn.totallv2 = formatRupiah($scope.rcn.totallv2, "Rp. ")
                    $scope.rcn.totallv1 = formatRupiah($scope.rcn.totallv1, "Rp. ")
                    $scope.rcn.mataAnggaranDipilih= dataMataAnggaranSelected.kodemataanggaran + " " + dataMataAnggaranSelected.namamataanggaran
                    $scope.rcn.idmataanggaran = dataMataAnggaranSelected.id 

                    if($scope.idkegiatanangkas != 0){
                        $scope.item.id = $scope.idkegiatanangkas
                    } else{
                        $scope.item.id = $scope.item.id
                    }

                    let TotalAnggaran = 0;

                    $scope.dataVOloaded = true
                    medifirstService.get("perencanaan/get-keterangan-belanja" 
                        + "?objectkegiatanfk=" + $scope.idkegiatan 
                        + "&idmataanggaran=" + $scope.rcn.idmataanggaran)
                        .then(function (e) {
                            $scope.dataVOloaded = false
                            
                            DataKeteranganBelanja = e.data.data
                            $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                                data: DataKeteranganBelanja
                            });
                            for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                                let element = DataKeteranganBelanja[index];
                                DataKeteranganBelanja[index].statCheckbox2 = false
                                TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                            }
                            TotalAnggaran = parseFloat(TotalAnggaran)
                            
                        })

                    var rincianGrid = $("#rincianGrids").data("kendoGrid"); // get the grid widget
                    if($scope.idpegawailogin != ''){
                        rincianGrid.hideColumn(8);
                    }
                }
            }


            /**
             * ------------------ DOMAIN KETERANGAN BELANJA ------------------
             */
            $scope.$watch('item.hargaSatuanKT', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.hargaSatuanKT.includes(',') ) {
                        console.log('ada komanya');
                        $scope.item.hargaSatuanKT = $scope.item.hargaSatuanKT.replace(',', '.')
                        // $scope.item.hargaSatuanKT = parseFloat($scope.item.hargaSatuanKT.join('.'))
                    }else{
                        $scope.item.subTotalKT = $scope.item.hargaSatuanKT
                    }
                    
                    $scope.item.subTotalKT = $scope.item.hargaSatuanKT*$scope.item.jmlKT
                    $scope.item.subTotalKTText = $scope.item.subTotalKT.toLocaleString('id-ID')
                    //console.log($scope.item.subTotalKT)
                }
            })

            $scope.$watch('item.jmlKT', function (value) {
                
                $scope.item.subTotalKT = $scope.item.hargaSatuanKT*value
                $scope.item.subTotalKTText = $scope.item.subTotalKT.toLocaleString('id-ID')
                    //console.log($scope.item.subTotalKT)
            })

            $scope.TambahKeterangan = function(){
                if ($scope.dataDetailMTSelected == undefined){
                    toastr.error('Pilih dulu mata anggaran')
                    return
                }
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }
                if($scope.idkegiatanangkas != 0){
                    $scope.item.id = $scope.idkegiatanangkas
                } else{
                    $scope.item.id = $scope.item.id
                }
                medifirstService.get("perencanaan/get-keterangan-belanja" 
                    + "?objectkegiatanfk=" + $scope.idkegiatananggaran
                    + "&idmataanggaran=" + $scope.rcn.idmataanggaran)
                    .then(function (e) {
                        DataKeteranganBelanja = e.data.data
                        $scope.item.noUrutKT = DataKeteranganBelanja[DataKeteranganBelanja.length-1].nourut + 1
                    })
                $scope.nourut = false
                $scope.item.keteranganKT = ''
                $scope.item.jmlKT = ''
                $scope.item.hargaSatuanKT = ''
                $scope.item.subTotalKT = ''
                $scope.item.satuanKT = ''

                $scope.item.norecKT = ''
                $scope.popupTambahKeteranganBelanja.center().open()
            }

            $scope.simpanTambahKeteranganBelanja = function(){
                var $idasalproduk = 0;
                
                if(!$scope.item.keteranganKT){
                    toastr.error('Isi Keterangan Belanja Terlebih Dahulu')
                    return
                }

                if(!$scope.item.jmlKT){
                    toastr.error('Isi Jumlah Keterangan Belanja Terlebih Dahulu')
                    return
                }

                if(!$scope.item.satuanKT){
                    toastr.error('Isi Satuan Keterangan Belanja Terlebih Dahulu')
                    return
                }

                if(!$scope.item.hargaSatuanKT){
                    toastr.error('Isi Harga Satuan Keterangan Belanja Terlebih Dahulu')
                    return
                }

                if(!$scope.item.sumberDanaKT){
                    toastr.error('Pilih Sumber Dana Terlebih Dahulu')
                    return
                }

                var norecKT = ''
                if($scope.item.norecKT != ''){
                    norecKT = $scope.item.norecKT
                }

                // if($scope.item.sumberDanaKT != undefined){
                //     $idasalproduk = $scope.item.sumberDanaKT.id;
                // }

                // var pass = null
                // if($scope.item.password != '' && $scope.item.password != undefined){
                //     pass = $scope.item.password
                // }

                // if ($scope.item.sumberDanaKT == undefined){
                //     toastr.error('Sumber Dana Tidak Boleh Kosong!')
                //     return
                // }

                // if ($scope.datakegiatanbro.islockrba == true) {
                //     toastr.error('Sudah dilock!')
                //     return
                // }

                var objSave = {
                    norec: norecKT,
                    objectkegiatanfk: $scope.idkegiatan,
                    objectmataanggaranfk: $scope.rcn.idmataanggaran,
                    keteranganbelanja: $scope.item.keteranganKT,
                    nourut: $scope.item.noUrutKT,
                    jml: $scope.item.jmlKT,
                    hargasatuan: $scope.item.hargaSatuanKT,
                    subtotal: $scope.item.subTotalKT,
                    satuan: $scope.item.satuanKT,
                    objectasalprodukfk: $scope.item.sumberDanaKT.id,
                    idtahap: $scope.item.tahapdetail.id,
                    tahap: $scope.item.tahapdetail.tahap,
                    password: $scope.item.password ? $scope.item.password : null,
                }

                // console.log(objSave)

                medifirstService.get("perencanaan/get-lock-entry-spj" 
                    + "?subsubkegiatan=" + $scope.idkegiatananggaran 
                    + "&tahap="+ $scope.item.tahap.id)
                    .then(function (e) {
                        var datas = e.data.data
                        if(datas.length >0 && datas[0].islockrba == true){
                            toastr.error('Entry SPJ Sudah Dilock, Silahkan Hubungi Admin Untuk Unlock', 'Informasi');
                            return
                        } else{
                            medifirstService.post('perencanaan/save-keterangan-belanja', objSave).then(function (e) {
                        
                                if($scope.idkegiatanangkas != 0){
                                    $scope.item.id = $scope.idkegiatanangkas
                                } else{
                                    $scope.item.id = $scope.item.id
                                }

                                let TotalAnggaran = 0;
                                medifirstService.get("perencanaan/get-keterangan-belanja" 
                                    + "?objectkegiatanfk=" + $scope.idkegiatananggaran 
                                    + "&idmataanggaran=" + $scope.rcn.idmataanggaran)
                                    .then(function (e) {
                                        DataKeteranganBelanja = e.data.data
                                        $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                                            data: DataKeteranganBelanja
                                        })

                                        for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                                            let element = DataKeteranganBelanja[index];
                                            DataKeteranganBelanja[index].statCheckbox2 = false
                                            TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                                        }

                                        TotalAnggaran = parseFloat(TotalAnggaran)
                                        medifirstService.get("perencanaan/get-total-anggaran-rcn" 
                                            + "?kegiatan=" + $scope.norecrcntotalanggaran)
                                            .then(function (e) {
                                                let total = 0

                                                if(e.data.data.length == 0){
                                                    $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                                    $scope.rcn.paguAnggaran = 0
                                                } else{
                                                    total = e.data.data[0].total
                                                    $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                                    $scope.rcn.paguAnggaran = 0
                                                }
                    
                                                $scope.item.targetKinerjaMasukan = formatRupiah(total, "Rp. ")
                                            })
                                    })

                                LoadTotalKeterangan()
            
                                var idpegawai = ''
                                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                                idpegawai = $scope.pegawaiLogin.id
        
                                medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&cek=" + $scope.item.isCekAdaAnggaranSaja+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                                    DataTotalMataAnggaran = e.data.data
                                    $scope.listAsalProduk = e.data.asalproduk
                                    $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                        data: DataTotalMataAnggaran
                                    })
                                })

                                $scope.popupTambahKeteranganBelanja.close()
                            })
                        }
                    });
                
            }

            $scope.selectUnselectSemuaKeteranganBelanja = function () {
                var tempData = $scope.dataSourceRincianAnggaran._data;

                if (isCheckAll2) {
                    isCheckAll2 = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox2 = false;
                        $scope.selectedData3 = []
                    }
                } else {
                    isCheckAll2 = true;
                    for (var i = 0; i < tempData.length; i++) {
                        console.log(tempData[i]);
                        tempData[i].statCheckbox2 = true;
                        $scope.selectedData3.push(tempData[i])
                    }
                }

                reloadGridKeteranganBelanja(tempData);
            }

            $scope.selectRowKeteranganBelanja = function (e) {
                let element = $(e.currentTarget);
                let checked = element.is(':checked')
                let row = element.closest('tr')
                let grid = $("#rincianGrids").data("kendoGrid")
                let dataItem = grid.dataItem(row)
                
                if (checked) {
                    dataItem.statCheckbox2 = true;
                    for (let i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norec == dataItem.norec) {
                            $scope.selectedData3.splice(i, 1)
                            break
                        }
                    $scope.selectedData3.push(dataItem);
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox2 = false;
                    for (let i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norec == dataItem.norec) {
                            $scope.selectedData3.splice(i, 1);
                            break
                        }
                    row.removeClass("k-state-selected")
                }
            }

            $scope.hapusKeteranganBelanjaCentang = function(){
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }
                let confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus centangan rincian anggaran?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                $mdDialog.show(confirm).then(function () {
                    let itemDelete = {
                        "data": $scope.selectedData3
                    }

                    $scope.dataVOloaded = true
                    
                    medifirstService.post('anggaran/delete-anggaran-kass', itemDelete).then(function (e) {
                        $scope.dataVOloaded = false
                        
                        
                        $scope.selectedData3 = []
                        medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                            let total = 0
                            if (e.data.data.length == 0) {
                                $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                $scope.rcn.paguAnggaran = 0
                            } else {
                                total = e.data.data[0].total
                                $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                $scope.rcn.paguAnggaran = 0
                            }

                            $scope.item.targetKinerjaMasukan = formatRupiah(total, "Rp. ")

                        })

                        if ($scope.idkegiatanangkas != 0) {
                            $scope.item.id = $scope.idkegiatanangkas
                        } else {
                            $scope.item.id = $scope.item.id
                        }

                        medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id + "&idmataanggaran=" + $scope.rcn.idmataanggaran).then(function (e) {
                            DataKeteranganBelanja = e.data.data
                            $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                                data: DataKeteranganBelanja
                            });
                            for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                                let element = DataKeteranganBelanja[index];
                                DataKeteranganBelanja[index].statCheckbox2 = false
                                TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                            }
                            TotalAnggaran = parseFloat(TotalAnggaran)
                        })
                    });


                    let idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id

                    console.log($scope.item.isCekAdaAnggaranSaja)
                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahun=" + moment($scope.item.thnAnggaran).format('YYYY') + "&tahap=" + $scope.item.tahapdetail.id + "&idpegawai=" + idpegawai + "&cek=" + $scope.item.isCekAdaAnggaranSaja + "&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                        DataTotalMataAnggaran = e.data.data
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: DataTotalMataAnggaran
                        });
                    });

                })
            }

            function HapusKeteranganBelanjaRow(e){
                e.preventDefault();

                let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                //console.log(dataItem);
                // return 
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }

                let confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus " + dataItem.keteranganbelanja + "?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok')
                
                $mdDialog.show(confirm).then(function () {
                    let itemDelete = {
                        "norec": dataItem.norec
                    }

                    $scope.dataVOloaded = true
                    medifirstService.post('anggaran/delete-anggaran-kas', itemDelete).then(function (e) {

                        medifirstService.get("perencanaan/get-total-anggaran-rcn" 
                            + "?kegiatan=" + $scope.idkegiatananggaran)
                            .then(function (e) {
                                let total = 0
                                if(e.data.data.length == 0){
                                    $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                    $scope.rcn.paguAnggaran = 0
                                } else{
                                    total = e.data.data[0].total
                                    $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                                    $scope.rcn.paguAnggaran = 0
                                }

                                $scope.item.targetKinerjaMasukan = formatRupiah(total, "Rp. ")
                                
                            })

                        if($scope.idkegiatanangkas != 0){
                            $scope.item.id = $scope.idkegiatanangkas
                        } else{
                            $scope.item.id = $scope.item.id
                        }

                        medifirstService.get("perencanaan/get-keterangan-belanja" 
                            + "?objectkegiatanfk=" + $scope.idkegiatan 
                            + "&idmataanggaran=" + $scope.rcn.idmataanggaran)
                            .then(function (e) {
                                DataKeteranganBelanja = e.data.data
                                $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                                    data: DataKeteranganBelanja
                                })

                                for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                                    let element = DataKeteranganBelanja[index];
                                    DataKeteranganBelanja[index].statCheckbox2 = false
                                    TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                                }

                                TotalAnggaran = parseFloat(TotalAnggaran)
                            })

                        $scope.dataVOloaded = false

                    });
                                
                        
                    let idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id
                    
                    $scope.dataVOloaded = true

                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&cek=" + $scope.item.isCekAdaAnggaranSaja+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                        $scope.dataVOloaded = false
                        
                        DataTotalMataAnggaran = e.data.data
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: DataTotalMataAnggaran
                        });
                    })
                                    
                })
            }

            function reloadGridKeteranganBelanja(ds) {
                let newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                let grid = $('#rincianGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
            }

            function detailKeteranganBelanja(e)  {
                e.preventDefault()

                let dataItem = this.dataItem($(e.currentTarget).closest("tr"))

                console.log(dataItem)

                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                $scope.nourut = true
                $scope.item.norecKT = dataItem.norec
                $scope.item.keteranganKT = dataItem.keteranganbelanja
                $scope.item.noUrutKT = dataItem.nourut
                $scope.item.jmlKT = parseInt(dataItem.jml)
                $scope.item.hargaSatuanKT = dataItem.hargasatuan
                $scope.item.subTotalKT = dataItem.subtotal
                $scope.item.satuanKT = dataItem.satuan
                $scope.item.sumberDanaKT = {id:dataItem.objectasalprodukfk,asalproduk:dataItem.asalproduk}
                $scope.rcn.idmataanggaran = dataItem.objectmataanggaranfk
                $scope.item.password = dataItem.password
                $scope.item.passwordbenar = undefined

                $scope.popupTambahKeteranganBelanja.center().open()
                
            }

            
            /**
             * ------------------ DOMAIN TRANSFER ANGGARAN ------------------
             */
            // Klik tombol transfer/copy anggaran
            $scope.showTransferAnggaran = function(){
                $scope.dataVOloaded = true

                medifirstService.get("perencanaan/get-data-combo?" 
                    + "tahun=" +moment($scope.now).format('YYYY'))
                    .then(function (e) {
                        $scope.dataVOloaded = false

                        $scope.listSubKegiatanTransfer = e.data.subkegiatantransfer

                        $scope.popupTransferAnggaran.center().open()

                    })
            }

            // Klik tombol cari di popup transfer anggaran
            $scope.cariTransferAnggaran = function () {

                if(!$scope.item.tahapawal){
                    toastr.error('Pilih Tahap Awal Terlebih Dahulu')
                    return
                }

                if(!$scope.item.tahunawal){
                    toastr.error('Pilih Tahun Awal Terlebih Dahulu')
                    return
                }

                if(!$scope.item.subkegiatantransfer){
                    toastr.error('Pilih Sub Kegiatan Terlebih Dahulu')
                    return
                }

                $scope.dataVOloaded = true

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

            // Klik checklist sub sub
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

            // Klik tombol simpan di popup transfer anggaran
            $scope.simpanTransferAnggaran = function () {
                if (!$scope.arrayProdukTemp || $scope.arrayProdukTemp.length == 0) {
                    toastr.error('Data belum di pilih')
                    return
                }

                if($scope.item.tahapawal.id === $scope.item.tahapakhir.id && moment($scope.item.tahunawal).format('YYYY') === moment($scope.item.tahunakhir).format('YYYY')){
                    toastr.error('Harus ada yang beda')
                    return
                }

                if($scope.item.tahapakhir){
                    toastr.error('Pilih Tahap Akhir Terlebih Dahulu')
                    return
                }

                if($scope.item.tahunakhir){
                    toastr.error('Pilih Tahun Akhir Terlebih Dahulu')
                    return
                }

                let objSave = {
                    "details": $scope.arrayProdukTemp,
                    "tahapawal": $scope.item.tahapawal,
                    "tahapakhir": $scope.item.tahapakhir,
                    "tahunakhir": moment($scope.item.tahunakhir).format('YYYY'),
                    "tgltransfer": moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }

                $scope.dataVOloaded = true

                medifirstService.post('perencanaan/save-setting-tahap', objSave).then(function (e) {
                    $scope.dataVOloaded = false

                    $scope.popupTransferAnggaran.close()
                    
                    loadDataGrid();

                    $scope.arrayProdukTemp = []
                })

            }

            
            /**
             * ------------------ DOMAIN HELPER ------------------
             */
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            
            $scope.formatRupiah2 = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

            $scope.columnKegiatan = {
				toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_1"><button ng-hide="disidpegawai" ng-click="tambahKA()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    }, 
                    {
                        name: "add",
                        text: "Hapus yang dicentang",
                        template: '<div class="grid_2"><button ng-hide="disidpegawai" ng-click="hapusKegiatanCentang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Hapus yang dicentang</button></div>'
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_5"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.search" /></div></div>'
                    }
                ],
                selectable: 'row',
                scrollable: true,
                
                pageable: true,
                groupable: true,
                columns:[
                {
                  "command": [
                        {
                           text: "Detail",
                           click: detailKegiatanAnggaran,
                           imageClass: "clinic fa"
                        },
                    ],
                       title: "",
                       width: "130px",
                },
                {
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectSemuaKegiatan()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRowKegiatan($event)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRowKegiatan($event)' />" +
                        "# } #",
                    width: "30px"
                },
                {
                    "field": "kode",
                    "title": "Kode",
                    "width": "200px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "400px"
                },
                {
                    "field": "namalengkap",
                    "title": "PPTK",
                    "width": "250px"
                },
                {
                    "field": "tahap",
                    "title": "Tahap Angaran",
                    "width": "100px"
                },
                {
                    "field": "tahun",
                    "title": "Tahun Angaran",
                    "width": "100px"
                },
                {
                    "field": "targetmasuk",
                    "title": "Target Kinerja",
                    "width": "150px",
                    "template": "<span class='style-right'>{{formatRupiah2('#: targetmasuk #', 'Rp. ')}}</span>",
                },
                {
                    "field": "namakelompok",
                    "title": "div",
                    "width": "200px"
                },
                {
                    "command": [
                          {
                             text: "Delete",
                             click: hapusKegiatanRow,
                             imageClass: "clinic fa",
                          },
                      ],
                         title: "",
                         width: "100px",
                }
            ]}

            $scope.columnMataAnggaran = {
                toolbar:[
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_1" style="margin-top: 10px;">' +
                                        '<label c-label item="item" c-label-text="Search"></label>' +
                                    '</div>' +
                                    '<div class="grid_4">'+
                                        '<input c-text-box type="input" class="k-textbox" ng-model="item.searchMataMT" /></div>' +
                                    '</div>' +
                                    '<div class="grid_7" style="margin-top:10px;">'+
                                        '<input type="checkbox" class="k-checkbox" id="isCekAdaAnggaranSaja" ng-model="item.isCekAdaAnggaranSaja" >' +
                                        '<label class="k-checkbox-label" for="isCekAdaAnggaranSaja">Cukup tampilkan yang ada anggaran nya saja</label>' +
                                    '</div>' 
                                    
                    }
                    
                ],
                columns:[
                    {
                        "field": "kodemataanggaran",
                        "title": "Kode rek.",
                        "width": "80px"
                    },
                    {
                        "field": "namamataanggaran",
                        "title": "Nama Rekening",
                        "width": "120px"
                    },
                    {
                        "field": "total",
                        "title": "Sub Total",
                        "width": "80px",
						"template": "<span class='style-right'>{{formatRupiah2('#: total #', '')}}</span>",
                    }
                ]
            }

            $scope.columnRincianAnggaran = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_1"><button ng-click="TambahKeterangan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "add",
                        text: "Hapus yang dicentang",
                        template: '<div class="grid_2"><button ng-click="hapusKeteranganBelanjaCentang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Hapus yang dicentang</button></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_5" style="margin-top: 10px;margin-left: -50px;">{{rcn.mataAnggaranDipilih}}</div>'
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: detailKeteranganBelanja,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "100px",
                    },
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectSemuaKeteranganBelanja()' />",
                        template: "# if (statCheckbox2) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRowKeteranganBelanja($event)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRowKeteranganBelanja($event)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "nourut",
                        "title": "No. Urut",
                        "width": "130px"
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Keterangan",
                        "width": "200px"
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                    },
                    {
                        "field": "jml",
                        "title": "Jml",
                        "width": "140px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "150px",
						"template": "<span class='style-right'>{{formatRupiah2('#: hargasatuan #', '')}}</span>",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "150px",
						"template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                    },
                    {
                        command: [{
                            text: "Hapus",
                            click: HapusKeteranganBelanjaRow
                        }],
                        title: "",
                        width: "100px",
                    }
                ]
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
        }
    ]);
});