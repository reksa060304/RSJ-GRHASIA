define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KelompokAnggaranCtrl', ['$scope', '$mdDialog','MedifirstService',
        function ($scope, $mdDialog, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataAnggaranSelected = {};
            $scope.jeniskode = true;
            var DataKegiatan= [];
            var DataMataAnggaran= [];
            var DataTotalMataAnggaran = [];
            var DataKeteranganBelanja = [];
            var DataTabKeteranganBelanja = [];
            var dataAlokasi2222 = []
            var DataSPJ = []
            var DataDetailSPJ = []
            var DataDetailSPJALL = []
            var ListSubKegiatan = []
            var ListSubSubKegiatan = []
            var ListMataAnggaran = []

            $scope.rcn = {};
            $scope.rcn.mataAnggaranlv1 = ""
            $scope.rcn.mataAnggaranlv2 = ""
            $scope.rcn.mataAnggaranlv3 = ""
            $scope.rcn.totallv1 = ""
            $scope.rcn.totallv2 = ""
            $scope.rcn.totallv3 = ""

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listJenisAnggaran = e.data.jenisanggaran
                $scope.listDirektur = e.data.direktur
                $scope.listTahap = e.data.tahap
            });
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.groupmataanggaran = [
                // {
                //     field: "kegiatan"
                // },
                {
                    field: "mataanggaran"
                }
            ];
            loadDataGrid();
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                // medifirstService.get("perencanaan/get-total-mata-anggaran").then(function (e) {
                //     DataTotalMataAnggaran = e.data.data
                //     $scope.listAsalProduk = e.data.asalproduk
                //     $scope.dataSourceDetailMT = new kendo.data.DataSource({
                //         data: DataTotalMataAnggaran
                //     });
                //     DataTabKeteranganBelanja  = e.data.keteranganbelanja
                //     for (let index = 0; index < e.data.keteranganbelanja.length; index++) {
                //         let element = e.data.keteranganbelanja[index];
                //         element.idid = index+1;
                //     }
                //     $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                //         data: DataTabKeteranganBelanja,
                //         group: $scope.group
                //     });
                    
                // })
                LoadTotalKeterangan()
                LoadSPJ()
                medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.dataSourceKegiatan = e.data.kegiatan
                    $scope.dataSourceSetting = e.data.setting
                    // $scope.dataSourceDetailMT = e.data.mataanggaran
                    DataKegiatan = e.data.kegiatan
                    DataMataAnggaran = e.data.mataanggaran
                    $scope.dataSourceMataAnggaran = e.data.mataanggaran
                    $scope.item.namapemda = e.data.setting[0].namapemda
                    $scope.item.kepaladaerah = e.data.setting[0].kepaladaerah
                    $scope.item.namakepaladaerah = e.data.setting[0].namakepaladaerah
                    $scope.item.namasekda = e.data.setting[0].namasekda
                    $scope.item.nipsekda = e.data.setting[0].nipsekda
                    $scope.item.namappkd = e.data.setting[0].namappkd
                    $scope.item.nipppkd = e.data.setting[0].nipppkd
                    $scope.item.pengelolakeuanganblud = e.data.setting[0].pengelolakeuanganblud
                    $scope.item.nipkepalablud = e.data.setting[0].nipkepalablud
                    $scope.item.alamat = e.data.setting[0].alamat
                    $scope.item.kota = e.data.setting[0].kota
                    $scope.item.telepon = e.data.setting[0].telepon
                    $scope.item.faximile = e.data.setting[0].faximile
                    $scope.item.tahunanggaran = e.data.setting[0].tahunanggaran
                    $scope.item.objectkepalabludfk = {id: e.data.setting[0].objectkepalabludfk, namalengkap: e.data.setting[0].namalengkap }
                    $scope.item.objecttahapaktivfk = {id: e.data.setting[0].objecttahapaktivfk, tahap: e.data.setting[0].tahap }
                    $scope.item.nomornpwp = e.data.setting[0].nomornpwp
                    // for (let index = 0; index < e.data.keterangan.length; index++) {
                    //     let element = e.data.keterangan[index];
                    //     if(element.namafield == "namaPemda"){
                    //        $scope.item.namaPemda = element.nilaifield
                    //     }
                    //     if(element.namafield == "kepalaDaerah"){
                    //        $scope.item.kepalaDaerah  = element.nilaifield
                    //     }
                    //     if(element.namafield == "namaKepalaDaerah"){
                    //        $scope.item.namaKepalaDaerah  = element.nilaifield
                    //     }
                    //     if(element.namafield == "namaSekda"){
                    //        $scope.item.namaSekda  = element.nilaifield
                    //     }
                    //     if(element.namafield == "nipSekda"){
                    //        $scope.item.nipSekda  = element.nilaifield
                    //     }
                    //     if(element.namafield == "namaPpkd"){
                    //        $scope.item.namaPpkd  = element.nilaifield
                    //     }
                    //     if(element.namafield == "nipPpkd"){
                    //        $scope.item.nipPpkd  = element.nilaifield
                    //     }
                    //     if(element.namafield == "pengelolaKeuanganBlud"){
                    //        $scope.item.pengelolaKeuanganBlud  = element.nilaifield
                    //        $scope.item.organisasi  = element.nilaifield
                    //     }
                    //     if(element.namafield == "namaKepalaBlud"){
                    //        $scope.item.namaKepalaBlud  = element.nilaifield
                    //     }
                    //     if(element.namafield == "alamat"){
                    //        $scope.item.alamat  = element.nilaifield
                    //     }
                    //     if(element.namafield == "kota"){
                    //        $scope.item.kota  = element.nilaifield
                    //     }
                    //     if(element.namafield == "telepon"){
                    //        $scope.item.telepon  = element.nilaifield
                    //     }
                    //     if(element.namafield == "faximile"){
                    //        $scope.item.faximile  = element.nilaifield
                    //     }
                    //     if(element.namafield == "tahunAnggaran"){
                    //        $scope.item.tahunAnggaran  = element.nilaifield
                    //     }
                    //     if(element.namafield == "tahapAktiv"){
                    //        $scope.item.tahapAktiv  = element.nilaifield
                    //     }
                    //     if(element.namafield == "nomorNpwp"){
                    //        $scope.item.nomorNpwp = element.nilaifield
                    //     }

                    // }
                    
                    
                   
                })
                
                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listBendahara = data
                    $scope.listPenerima = data
                })
                medifirstService.getPart('perencanaan/get-datacombo-part-rekanan', true, true, 20).then(function (data) {
                    $scope.listPihakKetiga = data
                })
            }    
            
            // $scope.popupEntry.center().open();
            $scope.addKegiatan = function(){
                $scope.popupKegiatan.center().open();
            }
            $scope.addSubKegiatan = function(){
                $scope.popupSubKegiatan.center().open();
            }
            $scope.addSubSubKegiatan = function(){
                $scope.popupSubSubKegiatan.center().open();
            }
            $scope.addProgram = function(){
                $scope.popupProgram.center().open();
            }
            $scope.Tambah = function(){
                $scope.item.id = ''
                $scope.popupTambah.center().open()
            }
            $scope.TambahMT = function(){
                $scope.item.id = ''
                $scope.popupTambahMT.center().open()
            }
            function editKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                $scope.item.id = dataItem.id
                let kodeArr = dataItem.kode.split(" ");
                let kodeArr2 = kodeArr[0].split(".");
                let a1 = kodeArr2[0] + '.' + kodeArr2[1]
                let b1 = kodeArr2[2]
                let c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                let d1 = kodeArr2[5]  
                if(dataItem.div == 1){
                    $scope.popupProgram.center().open()
                    // a1 = kodeArr2[0] + '.' + kodeArr2[1]
                    $scope.item.kodeHead = a1
                //    b1 = kodeArr2[2]
                    $scope.item.kode = b1
                    //$scope.jeniskode = false;
                    
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4)
                    // $scope.item.kode = dataItem.kode.substring(5,7)
                }else if(dataItem.div == 2){
                    $scope.popupKegiatan.center().open();
                    $scope.item.kodeHead = a1 + '.' + b1
                    // c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                    $scope.item.kode = c1
                    // $scope.item.kodeHead =dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7)
                    // $scope.item.kode = dataItem.kode.substring(8,12)
                }else if(dataItem.div == 3){
                    $scope.popupSubKegiatan.center().open();
                    $scope.item.kodeHead =  a1 +'.'+ b1 +'.'+c1
                    // d1 = kodeArr2[5]  
                    $scope.item.kode = d1 
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)
                    // $scope.item.kode = dataItem.kode.substring(13,15)
                }else if(dataItem.div == 4){
                    $scope.popupSubSubKegiatan.center().open();  
                    for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                        let element = $scope.dataSourceKegiatan[index];
                        if(element.kode == a1){
                            $scope.item.urusanPemerintahan = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 + '.' + b1){
                            $scope.item.program = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 +'.'+ b1 +'.'+ c1){
                            $scope.item.kegiatan = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 +'.'+ b1 +'.'+ c1+'.'+ d1){
                            $scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                        }
                        $scope.item.kode4 = a1 +'.'+ b1 +'.'+ c1+'.'+ d1
                        // if(element.kode == dataItem.kode.substring(0,4)){
                        //     $scope.item.urusanPemerintahan = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7)){
                        //     $scope.item.program = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)){
                        //     $scope.item.kegiatan = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12) + '.' + dataItem.kode.substring(13,15)){
                        //     $scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                        // }
                        
                    }
                    let TotalAnggaran = 0;
                    medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id).then(function (e) {
                        DataKeteranganBelanja = e.data.data
                        $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                            data: DataKeteranganBelanja
                        });
                        for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                            let element = DataKeteranganBelanja[index];
                            TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                        }
                        TotalAnggaran = parseFloat(TotalAnggaran)
                        $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                        $scope.rcn.totalAnggaran = formatRupiah(TotalAnggaran, "Rp. ")
                        $scope.rcn.sisaAnggaran = formatRupiah(TotalAnggaran - 0, "Rp. ")
                        $scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")
                        
                    })
                    $scope.item.subSubKegiatankode = kodeArr[1]//dataItem.kode//.substring(16) 
                    $scope.item.subSubKegiatan =  dataItem.keterangan
                    $scope.item.thnAnggaran = dataItem.tahun
                    $scope.item.tahap = dataItem.tahap
                    $scope.item.thpid = dataItem.thpid

                    $scope.rcn.judulKegiatan =  dataItem.keterangan

                    $scope.item.tolokUkurMasukan = dataItem.indikatormasuk
                    // $scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")//dataItem.targetmasuk
                    $scope.item.tolokUkurKeluaran = dataItem.indikatorkeluaran
                    $scope.item.targetKinerjaKeluaran = dataItem.targetkeluaran
                    $scope.item.tolokUkurHasil = dataItem.indikatorhasil
                    $scope.item.targetKinerjaHasil = dataItem.targethasil
                }
                
                $scope.item.keterangan = dataItem.keterangan
                $scope.item.div = dataItem.div
            }
            function occurrences(string, subString, allowOverlapping) {

                string += "";
                subString += "";
                if (subString.length <= 0) return (string.length + 1);
            
                var n = 0,
                    pos = 0,
                    step = allowOverlapping ? 1 : subString.length;
            
                while (true) {
                    pos = string.indexOf(subString, pos);
                    if (pos >= 0) {
                        ++n;
                        pos += step;
                    } else break;
                }
                return n;
            }
            function editMataT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var yangdicount = dataItem.kodemataanggaran
                console.log(yangdicount)
                var count = occurrences(yangdicount, ".");
                console.log(count)

                if(count == 2){
                    $scope.jeniskode = false;
                } else{
                    $scope.jeniskode = true;
                }
                
                $scope.item.id = dataItem.id
                $scope.item.kodeAddMT = dataItem.kodemataanggaran
                $scope.item.keteranganAddMT = dataItem.namamataanggaran
                

                medifirstService.get("perencanaan/get-jenis-angagran?id="+dataItem.id).then(function (e) {
                    console.log(e.data.data.length)
                    if(e.data.data.length == 0){
                        $scope.item.jenisanggaran = null
                    } else{
                        $scope.item.jenisanggaran = e.data.data[0]
                    }
				})

                $scope.popupTambahMT.center().open();
            }
            function editDetailRincianBelanjaSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                // $scope.item.id = dataItem.id
                // $scope.item.kodeAddMT = dataItem.kodemataanggaran
                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                $scope.popupTambahSPJ.center().open();
            }
            $scope.bagiarataAlokasiDetail = function() {
                let totalAnggaran = parseFloat($scope.item.alokasiSubtotal)
                let blnrata = totalAnggaran/12

                blnrata = blnrata.toFixed(2)

                $scope.item.bln1 = blnrata
                $scope.item.bln2 = blnrata
                $scope.item.bln3 = blnrata
                $scope.item.bln4 = blnrata
                $scope.item.bln5 = blnrata
                $scope.item.bln6 = blnrata
                $scope.item.bln7 = blnrata
                $scope.item.bln8 = blnrata
                $scope.item.bln9 = blnrata
                $scope.item.bln10 = blnrata
                $scope.item.bln11 = blnrata
                $scope.item.bln12 = blnrata
            }
            $scope.SimpanPopUpDetailAlokasi = function() {
                // $scope.dataSourceAlokasiAnggaran = $scope.listKeteranganBelanja
                for (let index = 0; index < dataAlokasi2222.length; index++) {
                    let element = dataAlokasi2222[index];
                    if(dataAlokasi2222[index].norec == $scope.item.alokasinorecDetail){
                        dataAlokasi2222[index].jan = $scope.item.bln1
                        dataAlokasi2222[index].feb = $scope.item.bln2
                        dataAlokasi2222[index].mar = $scope.item.bln3
                        dataAlokasi2222[index].apr = $scope.item.bln4
                        dataAlokasi2222[index].mei = $scope.item.bln5
                        dataAlokasi2222[index].jun = $scope.item.bln6
                        dataAlokasi2222[index].jul = $scope.item.bln7
                        dataAlokasi2222[index].agt = $scope.item.bln8
                        dataAlokasi2222[index].sep = $scope.item.bln9
                        dataAlokasi2222[index].okt = $scope.item.bln10
                        dataAlokasi2222[index].nov = $scope.item.bln11
                        dataAlokasi2222[index].des = $scope.item.bln12
                    }
                }
                // $scope.dataSourceAlokasiAnggaran = $scope.listKeteranganBelanja
                $scope.dataSourceAlokasiAnggaran = new kendo.data.DataSource({
                    data:  dataAlokasi2222
                });
                $scope.popupDetailAlokasi.center().close();
            }
            function alokasiBelanja(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                let totalAnggaran = 0;
                // let dataGridAlokasi = DataTabKeteranganBelanja
                // DataTabKeteranganBelanja = $scope.dataSourceKeteranganBelanja._data
                DataTabKeteranganBelanja =[]
                dataAlokasi2222 =[]
                for (let x = 0; x < $scope.dataSourceKeteranganBelanja._data.length; x++) {
                    var el = $scope.dataSourceKeteranganBelanja._data[x]
                   
                    if (el.mataanggaran.match(dataItem.mataanggaran)) {
                        el.subtotalRP = formatRupiah(el.subtotal, "Rp. ")
                     
                        totalAnggaran = totalAnggaran + parseFloat(el.subtotal)
                
                        dataAlokasi2222.push({
                            "norec": el.norec,
                            "kdprofile":el.kdprofile,
                            "statusenabled":el.statusenabled,
                            "objectkegiatanfk":el.objectkegiatanfk,
                            "objectmataanggaranfk":el.objectmataanggaranfk,
                            "keteranganbelanja": el.keteranganbelanja,
                            "nourut": el.nourut,
                            "jml": el.jml,
                            "hargasatuan":el.hargasatuan,
                            "subtotal": el.subtotal,
                            "satuan": el.satuan,
                            "objectasalprodukfk":el.objectasalprodukfk,
                            "mataanggaran": el.mataanggaran,
                            "kegiatan":el.kegiatan,
                            "asalproduk":el.asalproduk,
                            "kodemataanggaran": el.kodemataanggaran,
                            "namamataanggaran": el.namamataanggaran,
                            "kode": el.kode,
                            "keterangan":  el.keterangan,
                            "tahun": el.tahun,
                            "tahap": el.tahap,
                            "agt": el.agt,
                            "jan": el.jan,
                            "feb": el.feb,
                            "mar": el.mar,
                            "apr": el.apr,
                            "mei": el.mei,
                            "jun": el.jun,
                            "jul": el.jul,
                            "sep": el.sep,
                            "okt": el.okt,
                            "nov": el.nov,
                            "des": el.des,
                            "subtotalRP":  el.subtotalRP,
                        })
                    }
                }
                // dataAlokasi2222 = []
                // for (let index = 0; index < DataTabKeteranganBelanja.length; index++) {
                //     let element = DataTabKeteranganBelanja[index];
                //     if (element.mataanggaran.match(dataItem.mataanggaran)) {
                //         element.subtotalRP = formatRupiah(element.subtotal, "Rp. ")
                //         dataAlokasi2222.push(element)
                //         totalAnggaran = totalAnggaran + parseFloat(element.subtotal)
                //     }
                // }
                $scope.dataSourceAlokasiAnggaran = new kendo.data.DataSource({
                    data:  dataAlokasi2222
                });

                let subKegiatanStr = ''
                let kodeArr = dataItem.kode.split(" ");
                for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                    let element = $scope.dataSourceKegiatan[index];
                    if (element.kode.match(kodeArr[0]) && element.div == 3) {
                        subKegiatanStr = element.kode + ' ' + element.keterangan
                    }
                }
                $scope.item.thnAnggaran = dataItem.tahun
                $scope.item.tahap = dataItem.tahap
                $scope.item.subKegiatan = subKegiatanStr
                $scope.item.subSubKegiatan = kodeArr[1] + dataItem.kegiatan
                $scope.item.mataanggaran = dataItem.mataanggaran
                $scope.item.totalanggaran = formatRupiah(totalAnggaran, "Rp. ")
                $scope.item.totalbulanan = 0
                $scope.item.selisihanggaran = 0
                $scope.popupAlokasiKeteranganBelanja.center().open();
            }
            function editDetailMT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                $scope.item.norecKT = dataItem.norec
                $scope.item.keteranganKT = dataItem.keteranganbelanja
                $scope.item.noUrutKT = dataItem.nourut
                $scope.item.jmlKT = dataItem.jml
                $scope.item.hargaSatuanKT = dataItem.hargasatuan
                $scope.item.subTotalKT = dataItem.subtotal
                $scope.item.satuanKT = dataItem.satuan
                $scope.item.sumberDanaKT = {id:dataItem.objectasalprodukfk,asalproduk:dataItem.asalproduk}
                $scope.rcn.idmataanggaran = dataItem.objectmataanggaranfk
                $scope.popupTambahKeteranganBelanja.center().open();
            }
            function DetailAlokasi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                $scope.item.alokasinorecDetail = dataItem.norec
                $scope.item.alokasiKeteranganBelanja = dataItem.keteranganbelanja
                $scope.item.alokasiSubtotal = dataItem.subtotal
                $scope.item.AnggaranAlokasiDetail = dataItem.subtotalRP
                $scope.item.bln1 = dataItem.jan
                $scope.item.bln2 = dataItem.feb
                $scope.item.bln3 = dataItem.mar
                $scope.item.bln4 = dataItem.apr
                $scope.item.bln5 = dataItem.mei
                $scope.item.bln6 = dataItem.jun
                $scope.item.bln7 = dataItem.jul
                $scope.item.bln8 = dataItem.agt
                $scope.item.bln9 = dataItem.sep
                $scope.item.bln10 = dataItem.okt
                $scope.item.bln11 = dataItem.nov
                $scope.item.bln12 = dataItem.des
                $scope.popupDetailAlokasi.center().open();
                
                
            }
            
            
           $scope.klikKegiatan = function(dataKegiatanSelected){
                
            }
            
            $scope.columnKegiatan = {
				toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.search" /></div></div>'
                    }
                ],
                columns:[
                {
                  "command": [
                        {
                           text: "Detail",
                           click: editKegiatanT,
                           imageClass: "clinic fa"
                        },
                    ],
                       title: "",
                       width: "30px",
                },
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "30px"
                // },
                {
                    "field": "kode",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "250px"
                },
                {
                    "field": "tahun",
                    "title": "Tahun Angaran",
                    "width": "80px"
                },
                {
                    "field": "tahap",
                    "title": "Tahap",
                    "width": "100px"
                },
                {
                    "field": "targetmasuk",
                    "title": "Target Kinerja",
                    "width": "100px"
                },
                {
                    "field": "namakelompok",
                    "title": "div",
                    "width": "80px"
                }
            ]};
            $scope.columnSetting = {
                columns:[
                {
                    "field": "tahunanggaran",
                    "title": "Tahun Anggaran",
                },
                {
                    "field": "namapemda",
                    "title": "Nama Pemda",
                },
                {
                    "field": "kepaladaerah",
                    "title": "Kepala Daerah",
                },
                {
                    "field": "namakepaladaerah",
                    "title": "Nama Kepala Daerah",
                },
                {
                    "field": "namasekda",
                    "title": "Nama Sekda",
                },
                {
                    "field": "nipsekda",
                    "title": "NIP Sekda",
                },
                {
                    "field": "namappkd",
                    "title": "Nama PPKD",
                },
                {
                    "field": "nipppkd",
                    "title": "NIP PPKD",
                },
                {
                    "field": "pengelolakeuanganblud",
                    "title": "Pengelola Keuangan BLUD",
                },
                {
                    "field": "namalengkap",
                    "title": "Nama Kepala BLUD",
                },
                {
                    "field": "nipkepalablud",
                    "title": "NIP Kepala BLUD",
                },
                {
                    "field": "alamat",
                    "title": "Alamat",
                },
                {
                    "field": "kota",
                    "title": "Kota",
                },
                {
                    "field": "telepon",
                    "title": "Telepon",
                },
                {
                    "field": "faximile",
                    "title": "Faximile",
                },
                {
                    "field": "tahap",
                    "title": "Tahap Aktif",
                },
                {
                    "field": "nomornpwp",
                    "title": "Nomor NPWP",
                },
            ]};
            $scope.columnAlokasiAnggaran = {
				// toolbar:[
                //     {
                //         name: "add", 
                //         text: "Tambah",
                //         template: '<div class="grid_2"><button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                //     },
                //     {
                //         name: "ads", 
                //         text: "asd",
                //         template: '<div class="grid_6"></div>'
                //     },
                //     {
                //         name: "src", 
                //         text: "src",
                //         template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.search" /></div></div>'
                //     }
                // ],
                columns:[
                {
                  "command": [
                        {
                           text: "Detail",
                           click: DetailAlokasi,
                           imageClass: "clinic fa"
                        },
                    ],
                       title: "",
                       width: "30px",
                },
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "30px"
                // },
                {
                    "field": "keteranganbelanja",
                    "title": "Nama Biaya",
                    "width": "100px"
                },
                {
                    "field": "subtotal",
                    "title": "Anggaran",
                    "width": "40px",
                    "template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                },
                {
                    "field": "jan",
                    "title": "Jan",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: jan #', '')}}</span>",
                },
                {
                    "field": "feb",
                    "title": "Feb",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: feb #', '')}}</span>",
                },
                {
                    "field": "mar",
                    "title": "Mar",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: mar #', '')}}</span>",
                },
                {
                    "field": "apr",
                    "title": "Apr",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: apr #', '')}}</span>",
                },
                {
                    "field": "mei",
                    "title": "Mei",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: mei #', '')}}</span>",
                },
                {
                    "field": "jun",
                    "title": "Jun",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: jun #', '')}}</span>",
                },
                {
                    "field": "jul",
                    "title": "Jul",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: jul #', '')}}</span>",
                },
                {
                    "field": "agt",
                    "title": "Agt",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: agt #', '')}}</span>",
                },
                {
                    "field": "sep",
                    "title": "Sep",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: sep #', '')}}</span>",
                },
                {
                    "field": "okt",
                    "title": "Okt",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: okt #', '')}}</span>",
                },
                {
                    "field": "nov",
                    "title": "Nov",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: nov #', '')}}</span>",
                },
                {
                    "field": "des",
                    "title": "Des",
                    "width": "30px",
                    // "template": "<span class='style-right'>{{formatRupiah2('#: des #', '')}}</span>",
                }
            ]};
            $scope.$watch('item.search', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataKegiatan.length; index++) {
                        let element = DataKegiatan[index];
                        if (element.keterangan.match($scope.item.search)) {
                            data.push(element)
                        }else if (element.kode.match($scope.item.search)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceKegiatan = new kendo.data.DataSource({
                        data: data
                    });
                }
            });

            $scope.$watch('item.kodeAddMT', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    var yangdicount = $scope.item.kodeAddMT
                    console.log(yangdicount)
                    var count = occurrences(yangdicount, ".");
                    console.log(count)

                    if(count == 2){
                        $scope.jeniskode = false;
                    } else{
                        $scope.jeniskode = true;
                    }
                }
            });
            
            $scope.$watch('item.searchSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataSPJ.length; index++) {
                        let element = DataSPJ[index];
                        if (element.mataanggaran.match($scope.item.searchSPJ)) {
                            data.push(element)
                        }else if (element.norealisasi.match($scope.item.searchSPJ)) {
                            data.push(element)
                        }else if (element.deskripsi.match($scope.item.searchSPJ)) {
                            data.push(element)
                        }else if (element.pihakketiga.match($scope.item.searchSPJ)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceSPJ = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            
            $scope.$watch('item.bln1', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln2', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln3', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln4', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln5', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln6', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln7', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln8', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln9', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln10', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln11', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });
            $scope.$watch('item.bln12', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    watchBulan(newValue)
                }
            });

            function watchBulan(newValue){
                let totalAlokasi = $scope.item.alokasiSubtotal
                $scope.item.totalBulanAlokasiDetail = parseFloat($scope.item.bln1) + 
                parseFloat($scope.item.bln2) +
                    parseFloat($scope.item.bln3) +
                        parseFloat($scope.item.bln4) +
                            parseFloat($scope.item.bln5) +
                                parseFloat($scope.item.bln6) +
                                    parseFloat($scope.item.bln7) +
                                        parseFloat($scope.item.bln8) +
                                            parseFloat($scope.item.bln9) +
                                                parseFloat($scope.item.bln10) +
                                                    parseFloat($scope.item.bln11) +
                                                        parseFloat($scope.item.bln12)
                $scope.item.totalBulanAlokasiDetail = $scope.item.totalBulanAlokasiDetail.toFixed(2)
                $scope.item.kurangAlokasiDetail = totalAlokasi - parseFloat($scope.item.totalBulanAlokasiDetail)
                $scope.item.kurangAlokasiDetail = $scope.item.kurangAlokasiDetail.toFixed(2)
            }
            

            $scope.$watch('item.searchMata', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataMataAnggaran.length; index++) {
                        let element = DataMataAnggaran[index];
                        if (element.namamataanggaran.match(newValue)) {
                            data.push(element)
                        }else if (element.kodemataanggaran.match(newValue)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceMataAnggaran = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            
            $scope.$watch('item.searchMataMT', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
                        let element = DataTotalMataAnggaran[index];
                        if (element.namamataanggaran.match(newValue)) {
                            data.push(element)
                        }else if (element.kodemataanggaran.match(newValue)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceDetailMT = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            $scope.$watch('item.searchKeteranganBelanja', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataTabKeteranganBelanja.length; index++) {
                        let element = DataTabKeteranganBelanja[index];
                        if (element.mataanggaran.match(newValue)) {
                            data.push(element)
                        }else if (element.kegiatan.match(newValue)) {
                            data.push(element)
                        }else if (element.keteranganbelanja.match(newValue)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            $scope.SimpanPopUpTambah = function(){
                var jmlkode = $scope.item.kodeAdd.length
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
                var objSave =
                    {
                        id: '',
                        kode: $scope.item.kodeAdd,
                        keterangan: $scope.item.keteranganAdd,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupTambah.center().close()
                }, function (error) {

                })
            }
            
            $scope.SimpanSetting = function(){
                var objSave =
                    {
                        namapemda: $scope.item.namapemda,
                        kepaladaerah: $scope.item.kepaladaerah,
                        namakepaladaerah: $scope.item.namakepaladaerah,
                        namasekda: $scope.item.namasekda,
                        nipsekda: $scope.item.nipsekda,
                        namappkd: $scope.item.namappkd,
                        nipppkd: $scope.item.nipppkd,
                        pengelolakeuanganblud: $scope.item.pengelolakeuanganblud,
                        nipkepalablud: $scope.item.nipkepalablud,
                        alamat: $scope.item.alamat,
                        kota: $scope.item.kota,
                        telepon: $scope.item.telepon,
                        faximile: $scope.item.faximile,
                        tahunanggaran: $scope.item.tahunanggaran,
                        objectkepalabludfk: $scope.item.objectkepalabludfk.id,
                        objecttahapaktivfk: $scope.item.objecttahapaktivfk.id,
                        namatahap: $scope.item.objecttahapaktivfk.tahap,
                        nomornpwp: $scope.item.nomornpwp,
                    }

                    medifirstService.get('perencanaan/get-penjagaan-setting-anggaran?tahunanggaran='+ $scope.item.tahunanggaran ).then(function (e) {
                        if(e.data.data.length > 0){
                            var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Pada Tahun Tersebut Sudah Ada Setting Anggaran Ingin Lanjut Simpan?')
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                medifirstService.post('perencanaan/save-setting-anggaran', objSave).then(function (e) {
                                    medifirstService.post('sysadmin/logging/save-log-simpan-setting-anggaran', objSave).then(function (data) {
                                        loadDataGrid();
                                    })
                                }, function (error) {
                
                                })
                            })
                        } else{
                            medifirstService.post('perencanaan/save-setting-anggaran', objSave).then(function (e) {
                                medifirstService.post('sysadmin/logging/save-log-simpan-setting-anggaran', objSave).then(function (data) {
                                    loadDataGrid();
                                })
                            }, function (error) {
            
                            })
                        }
                    });
                
            }

            $scope.SimpanPopUpAlokasi = function() {
                var objSave = [];
                for (let index = 0; index < dataAlokasi2222.length; index++) {
                    let element = dataAlokasi2222[index];
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 1,nilai: element.jan
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 2,nilai: element.feb
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 3,nilai: element.mar
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 4,nilai: element.apr
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 5,nilai: element.mei
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 6,nilai: element.jun
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 7,nilai: element.jul
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 8,nilai: element.agt
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 9,nilai: element.sep
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 10,nilai: element.okt
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 11,nilai: element.nov
                    });
                    objSave.push({
                        norec: '',keteranganbelanjafk: element.norec,
                        bulanint: 12,nilai: element.des
                    });
                }
                

                var datasave =
                    {
                        data: objSave
                    }
                medifirstService.post('perencanaan/save-alokasi-keterangan-belanja',datasave).then(function (e) {
                    LoadTotalKeterangan();
                    $scope.popupAlokasiKeteranganBelanja.center().close()
                }, function (error) {

                })
            }
            
           
            function LoadTotalKeterangan(){
                medifirstService.get("perencanaan/get-total-mata-anggaran").then(function (e) {
                    DataTotalMataAnggaran = e.data.data
                    $scope.listAsalProduk = e.data.asalproduk
                    $scope.dataSourceDetailMT = new kendo.data.DataSource({
                        data: DataTotalMataAnggaran
                    });
                    DataTabKeteranganBelanja  = [];//e.data.keteranganbelanja
                    // let DataInsertAlokasi = [];
                    let dataAlokasi =  e.data.alokasi;
                    for (let index = 0; index < e.data.keteranganbelanja.length; index++) {
                        let element = e.data.keteranganbelanja[index];
                        for (let aa = 0; aa < dataAlokasi.length; aa++) {
                            let alokasielement = dataAlokasi[aa];
                            for (let bb = 0; bb < alokasielement.length; bb++) {
                                let elementbb = alokasielement[bb];
                                if(elementbb.keteranganbelanjafk == element.norec){
                                    if(elementbb.bulanint == 1){
                                        element.jan = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 2){
                                        element.feb = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 3){
                                        element.mar = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 4){
                                        element.apr = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 5){
                                        element.mei = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 6){
                                        element.jun = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 7){
                                        element.jul = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 8){
                                        element.agt = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 9){
                                        element.sep = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 10){
                                        element.okt = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 11){
                                        element.nov = elementbb.nilai
                                    }
                                    if(elementbb.bulanint == 12){
                                        element.des = elementbb.nilai
                                    }
                                }
                            }
                            
                        }
                        // DataInsertAlokasi.push(element)
                        DataTabKeteranganBelanja .push(element)
                    }
                    // DataTabKeteranganBelanja = DataInsertAlokasi
                    // $scope.item.dataKeteranganBelanja = DataInsertAlokasi
                    $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                        data: DataTabKeteranganBelanja,
                        group: $scope.groupmataanggaran
                    });
                    
                })
            }
            function LoadSPJ(){
                medifirstService.get("perencanaan/get-spj").then(function (e) {
                    DataSPJ = e.data.data
                    DataDetailSPJALL = e.data.detail
                    $scope.dataSourceSPJ = new kendo.data.DataSource({
                        data: DataSPJ,
                        group: $scope.groupmataanggaran
                    });
                    
                })
            }
            $scope.BagiRata = function(){
                let SubTotal = 0
                let datdatdatdad = []
                for (let index = 0; index < dataAlokasi2222.length; index++) {
                    let element = dataAlokasi2222[index];
                    SubTotal = parseFloat(element.subtotal) / 12
                    dataAlokasi2222[index].jan = SubTotal
                    dataAlokasi2222[index].feb = SubTotal
                    dataAlokasi2222[index].mar = SubTotal
                    dataAlokasi2222[index].apr = SubTotal
                    dataAlokasi2222[index].mei = SubTotal
                    dataAlokasi2222[index].jun = SubTotal
                    dataAlokasi2222[index].jul = SubTotal
                    dataAlokasi2222[index].agt = SubTotal
                    dataAlokasi2222[index].sep = SubTotal
                    dataAlokasi2222[index].okt = SubTotal
                    dataAlokasi2222[index].nov = SubTotal
                    dataAlokasi2222[index].des = SubTotal
                }
                $scope.dataSourceAlokasiAnggaran = new kendo.data.DataSource({
                    data:  dataAlokasi2222
                });
            }
            $scope.SimpanPopUpProgram = function(){
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
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupProgram.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpKegiatan = function(){
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
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpSubKegiatan = function(){
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
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupSubKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpSubSubKegiatan = function(){
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
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kode4 + ' ' + $scope.item.subSubKegiatankode,
                        keterangan: $scope.item.subSubKegiatan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: $scope.item.thnAnggaran,
                        tahap: $scope.item.thpid,
                        indikatormasuk: $scope.item.tolokUkurMasukan,
                        indikatorkeluaran:  $scope.item.tolokUkurKeluaran,
                        indikatorhasil:  $scope.item.tolokUkurHasil,
                        targetmasuk:  $scope.item.targetKinerjaMasukan,
                        targetkeluaran:  $scope.item.targetKinerjaKeluaran,
                        targethasil:  $scope.item.targetKinerjaHasil,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupSubSubKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.columnMataAnggaran = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahMT()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchMata" /></div></div>'
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editMataT,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                      },
                    {
                        "field": "id",
                        "title": "Id",
                        "width": "50px"
                    },
                    {
                        "field": "kodemataanggaran",
                        "title": "Kode",
                        "width": "80px"
                    },
                    {
                        "field": "namamataanggaran",
                        "title": "Mata Anggaran",
                        "width": "200px"
                    },
                    // {
                    //     "field": "kodeexternal",
                    //     "title": "Kode External",
                    //     "width": "80px"
                    // },
                    // {
                    //     "field": "namaexternal",
                    //     "title": "Nama External",
                    //     "width": "200px"
                    // }
                ]
            };
            
            $scope.columnKeteranganBelanja = {
                toolbar:[
                    // {
                    //     name: "add", 
                    //     text: "Tambah",
                    //     template: '<div class="grid_2"><button ng-click="TambahMT()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    // },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_8"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchKeteranganBelanja" /></div></div>'
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
                                 text: "Alokasi",
                                 click: alokasiBelanja,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                    },
                    {
                        "field": "mataanggaran",
                        "title": "Kode Rekening",
                        "width": "100px",
                        hidden: true
                    },
                    {
                        "field": "kegiatan",
                        "title": "Kegiatan",
                        "width": "100px",
                        hidden: true
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Keterangan",
                        "width": "80px"
                    },
                    {
                        "field": "jml",
                        "title": "Jumlah",
                        "width": "30px",
						"template": "<span class='style-right'>{{('#: jml #')}}</span>",
                        hidden: true,
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "50px",
                        hidden: true
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
						"template": "<span class='style-right'>{{formatRupiah2('#: hargasatuan #', '')}}</span>",
                        hidden: true,
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "40px",
						"template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                    },
                    {
                        "field": "jan",
                        "title": "Jan",
                        "width": "40px"
                    },
                    {
                        "field": "feb",
                        "title": "Feb",
                        "width": "40px"
                    },
                    {
                        "field": "mar",
                        "title": "Mar",
                        "width": "40px"
                    },
                    {
                        "field": "apr",
                        "title": "Apr",
                        "width": "40px"
                    },
                    {
                        "field": "mei",
                        "title": "Mei",
                        "width": "40px"
                    },
                    {
                        "field": "jun",
                        "title": "Juni",
                        "width": "40px"
                    },
                    {
                        "field": "jul",
                        "title": "Juli",
                        "width": "40px"
                    },
                    {
                        "field": "agt",
                        "title": "Agst",
                        "width": "40px"
                    },
                    {
                        "field": "sep",
                        "title": "Sep",
                        "width": "40px"
                    },
                    {
                        "field": "okt",
                        "title": "Okt",
                        "width": "40px"
                    },
                    {
                        "field": "nov",
                        "title": "Nov",
                        "width": "40px"
                    },
                    {
                        "field": "des",
                        "title": "Des",
                        "width": "40px"
                    }
                ]
            };
            $scope.columnSPJ = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahSPJ()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchSPJ" /></div></div>'
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
                                 click: editDetailSPJ,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                    },
                    {
                        "field": "mataanggaran",
                        "title": "Kode Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "kegiatan",
                        "title": "Kegiatan",
                        "width": "100px",
                        hidden: true
                    },
                    {
                        "field": "norealisasi",
                        "title": "No SPJ",
                        "width": "60px",
                        // hidden: true
                    },
                    {
                        "field": "deskripsi",
                        "title": "Dasar Kontraktual",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "totalbelanja",
                        "title": "Total Belanja",
                        "width": "60px",
						"template": "<span class='style-right'>{{formatRupiah2('#: totalbelanja #', '')}}</span>",
                        // hidden: true,
                    },
                    {
                        "field": "bendahara",
                        "title": "Bendahara",
                        "width": "70px",
                        // hidden: true
                    },
                    {
                        "field": "penerima",
                        "title": "Penerima",
                        "width": "70px",
                        // hidden: true
                    },
                    {
                        "field": "pihakketiga",
                        "title": "Nama Pihak Ketiga",
                        "width": "100px",
                        // hidden: true
                    },
                ]
            };
            
            $scope.SimpanPopUpTambahMT = function(){
                var jmlkode = $scope.item.kodeAddMT.length
                var divS = 0;
                var IDD = undefined

                if($scope.item.id == undefined){
                    IDD = ''
                }else{
                    IDD = $scope.item.id
                }
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

                var jenisanggaran = ""
                if ($scope.item.jenisanggaran.id != undefined) {
                    jenisanggaran = $scope.item.jenisanggaran.id
                }

                
                var objSave =
                    {
                        id: IDD,
                        reportdisplay: null,
                        kodemataanggaran: $scope.item.kodeAddMT,
                        namamataanggaran: $scope.item.keteranganAdd,
                        jenisanggaran: jenisanggaran,
                        keterangan: null,
                        kodeexternal: null,
                        namaexternal: null,
                    }
                medifirstService.post('perencanaan/save-mata-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupTambahMT.center().close()
                }, function (error) {

                })
            }
            
            $scope.columnRincianAnggaran = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahKeterangan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_6" style="margin-top: 10px;margin-left: -80px;">{{rcn.mataAnggaranDipilih}}</div>'
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editDetailMT,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                    },
                    {
                        "field": "nourut",
                        "title": "No. Urut",
                        "width": "30px"
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Keterangan",
                        "width": "100px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml",
                        "width": "40px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "50px"
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
						"template": "<span class='style-right'>{{formatRupiah2('#: hargasatuan #', '')}}</span>",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "50px",
						"template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px"
                    }
                ]
            };
            $scope.columnDetailSPJ = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahRincianBelanjaSPJ()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editDetailRincianBelanjaSPJ,
                                 imageClass: "clinic fa"
                              },
                              {
                                text: " ",
                                click: deleteDetailRincianBelanjaSPJ,
                                imageClass: "clinic fa fa-trash"
                             },
                          ],
                             title: "",
                             width: "44px",
                    },
                    {
                        "field": "nourut",
                        "title": "No. Urut",
                        "width": "30px"
                    },
                    {
                        "field": "uraian",
                        "title": "Keterangan",
                        "width": "100px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml",
                        "width": "40px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "50px"
                    },
                    {
                        "field": "harga",
                        "title": "Harga Satuan",
                        "width": "50px",
						"template": "<span class='style-right'>{{formatRupiah2('#: harga #', '')}}</span>",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "50px",
						"template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Item Rincian",
                        "width": "100px"
                    }
                ]
            };
            $scope.columnDetailMT = {
                toolbar:[
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_1" style="margin-top: 10px;">' +
                                        '<label c-label item="item" c-label-text="Search"></label>' +
                                    '</div>' +
                                    '<div class="grid_4">'+
                                        '<input c-text-box type="input" class="k-textbox" ng-model="item.searchMataMT" /></div>' +
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
            };
            $scope.formatRupiah2 = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}


            $scope.saveHead = function () {
                var kdHead = ""
                if ($scope.item.kodeHead != undefined)
                    kdHead = $scope.item.kodeHead

                var namaHead = ""
                if ($scope.item.namaHead != undefined) {
                    namaHead = $scope.item.namaHead
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Head harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalHead != undefined)
                    kdExtern = $scope.item.kodeExternalHead

                var namaExtern = ""
                if ($scope.item.namaExternalHead != undefined)
                    namaExtern = $scope.item.namaExternalHead

                var id = ""
                if ($scope.idHead != undefined)
                    id = $scope.idHead

                var jsonSave = {
                    "id": id,
                    "kdkelompokhead": kdHead,
                    "kelompokhead": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-head-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelPertama = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokPertama != undefined)
                    kdHead = $scope.item.kodeKelompokPertama

                var namaHead = ""
                if ($scope.item.namaKelompokPertama != undefined) {
                    namaHead = $scope.item.namaKelompokPertama
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Pertama harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalPertama != undefined)
                    kdExtern = $scope.item.kodeExternalPertama

                var namaExtern = ""
                if ($scope.item.namaExternalPertama != undefined)
                    namaExtern = $scope.item.namaExternalPertama

                var id = ""
                if ($scope.idPertama != undefined)
                    id = $scope.idPertama
                var jsonSave = {
                    "id": id,
                    "kdchildpertama": kdHead,
                    "childpertama": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-pertama-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKedua = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKedua != undefined)
                    kdHead = $scope.item.kodeKelompokKedua

                var namaHead = ""
                if ($scope.item.namaKelompokKedua != undefined) {
                    namaHead = $scope.item.namaKelompokKedua
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Kedua harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKedua != undefined)
                    kdExtern = $scope.item.kodeExternalKedua

                var namaExtern = ""
                if ($scope.item.namaExternalKedua != undefined)
                    namaExtern = $scope.item.namaExternalKedua

                var id = ""
                if ($scope.idKedua != undefined)
                    id = $scope.idKedua

                var jsonSave = {
                    "id": id,
                    "kdchildkedua": kdHead,
                    "childkedua": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-kedua-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKetiga = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKetiga != undefined)
                    kdHead = $scope.item.kodeKelompokKetiga

                var namaHead = ""
                if ($scope.item.namaKelompokKetiga != undefined) {
                    namaHead = $scope.item.namaKelompokKetiga
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Ketiga harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKetiga != undefined)
                    kdExtern = $scope.item.kodeExternalKetiga

                var namaExtern = ""
                if ($scope.item.namaExternalKetiga != undefined)
                    namaExtern = $scope.item.namaExternalKetiga

                var id = ""
                if ($scope.idKetiga != undefined)
                    id = $scope.idKetiga

                var jsonSave = {
                    "id": id,
                    "kdchildketiga": kdHead,
                    "childketiga": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-ketiga-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKeempat = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKeempat != undefined)
                    kdHead = $scope.item.kodeKelompokKeempat

                var namaHead = ""
                if ($scope.item.namaKelompokKeempat != undefined) {
                    namaHead = $scope.item.namaKelompokKeempat
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Keempat harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKeempat != undefined)
                    kdExtern = $scope.item.kodeExternalKeempat

                var namaExtern = ""
                if ($scope.item.namaExternalKeempat != undefined)
                    namaExtern = $scope.item.namaExternalKeempat

                var id = ""
                if ($scope.idKeempat != undefined)
                    id = $scope.idKeempat

                var jsonSave = {
                    "id": id,
                    "kdchildkeempat": kdHead,
                    "childkeempat": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-keempat-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }

          $scope.saveKel = function (id) {

              if(id == 5){
                   var jsonSave = {
                    "kelompok" :5,      
                    "id": $scope.idLima != undefined? $scope.idLima : '',
                    "kdkelompok": $scope.item.kodeKelompokLima != undefined?$scope.item.kodeKelompokLima :null,
                    "namakelompok": $scope.item.namaKelompokLima != undefined?$scope.item.namaKelompokLima :null,
                    "kodeexternal":  $scope.item.kodeExternalLima != undefined?$scope.item.kodeExternalLima :null,
                    "namaexternal":    $scope.item.namaExternalLima != undefined?$scope.item.namaExternalLima :null,
                }
              }
               if(id == 6){
                 var jsonSave = {
                      "kelompok" :6,      
                    "id":  $scope.idEnam != undefined? $scope.idEnam : '',
                    "kdkelompok": $scope.item.kodeKelompokEnam != undefined?$scope.item.kodeKelompokEnam :null,
                    "namakelompok": $scope.item.namaKelompokEnam != undefined?$scope.item.namaKelompokEnam :null,
                    "kodeexternal":  $scope.item.kodeExternalEnam != undefined?$scope.item.kodeExternalEnam :null,
                    "namaexternal":    $scope.item.namaExternalEnam != undefined?$scope.item.namaExternalEnam :null,
                }
               }
              
               
                medifirstService.post('perencanaan/save-kel-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }

            $scope.batal = function () {
                $scope.item = {};
                $scope.idHead = ""
                $scope.idPertama = ""
                $scope.idKedua = ""
                $scope.idKetiga = ""
                $scope.idKeempat = ""

            }
            $scope.klikDetailMT = function (dataMataAnggaranSelected) {
                if (dataMataAnggaranSelected != undefined) {
                    
                    let kodeArr = dataMataAnggaranSelected.kodemataanggaran.split(".");
                    let a1 = kodeArr[0] 
                    let b1 = kodeArr[1]
                    let c1 = kodeArr[2] 
                    let d1 = dataMataAnggaranSelected.kodemataanggaran
                    for (let index = 0; index < DataMataAnggaran.length; index++) {
                        let element = DataMataAnggaran[index];
                        if(element.kodemataanggaran == a1){
                            $scope.rcn.mataAnggaranlv1 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv1 = formatRupiah(element.total, "Rp. ")
                        }
                        if(element.kodemataanggaran == a1 + '.' + b1){
                            $scope.rcn.mataAnggaranlv2 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv2 = formatRupiah(element.total, "Rp. ")
                        }
                        if(element.kodemataanggaran == a1 + '.' + b1 + '.' + c1){
                            $scope.rcn.mataAnggaranlv3 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv3 = formatRupiah(element.total, "Rp. ")
                        }
                    }
                    $scope.rcn.mataAnggaranDipilih= dataMataAnggaranSelected.kodemataanggaran + " " + dataMataAnggaranSelected.namamataanggaran
                    $scope.rcn.idmataanggaran = dataMataAnggaranSelected.id 
                    // DataKeteranganBelanja = e.data.data
                    // $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                    //     data: DataKeteranganBelanja
                    // });

                    var data = []
                    for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                        let element = DataKeteranganBelanja[index];
                        if (element.kodemataanggaran.match(dataMataAnggaranSelected.kodemataanggaran)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                        data: data
                    });

                    // $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                    // $scope.rcn.totalAnggaran = formatRupiah(dataMataAnggaranSelected.total, "Rp. ")
                    // $scope.rcn.sisaAnggaran = formatRupiah(dataMataAnggaranSelected.total - 0, "Rp. ")
                }
            }
            //perencanaan/save-keterangan-belanja
            $scope.SimpanPopUpAddKeterangan = function(){
                var $idasalproduk = 0;
                if($scope.item.sumberDanaKT != undefined){
                    $idasalproduk = $scope.item.sumberDanaKT.id;
                }
                var norecKT = ''
                if($scope.item.norecKT != ''){
                    norecKT = $scope.item.norecKT
                }
                var objSave =
                    {
                        norec: norecKT,
                        objectkegiatanfk: $scope.item.id,
                        objectmataanggaranfk: $scope.rcn.idmataanggaran,
                        keteranganbelanja: $scope.item.keteranganKT,
                        nourut: $scope.item.noUrutKT,
                        jml: $scope.item.jmlKT,
                        hargasatuan: $scope.item.hargaSatuanKT,
                        subtotal: $scope.item.subTotalKT,
                        satuan: $scope.item.satuanKT,
                        objectasalprodukfk: $idasalproduk
                    }
                medifirstService.post('perencanaan/save-keterangan-belanja', objSave).then(function (e) {
                    
                    let TotalAnggaran = 0;
                    medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id).then(function (e) {
                        DataKeteranganBelanja = e.data.data
                        $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                            data: DataKeteranganBelanja
                        });
                        for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                            let element = DataKeteranganBelanja[index];
                            TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                        }
                        TotalAnggaran = parseFloat(TotalAnggaran)
                        $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                        $scope.rcn.totalAnggaran = formatRupiah(TotalAnggaran, "Rp. ")
                        $scope.rcn.sisaAnggaran = formatRupiah(TotalAnggaran - 0, "Rp. ")
                        $scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")
                        
                    })
                    // medifirstService.get("perencanaan/get-total-mata-anggaran").then(function (e) {
                    //     DataTotalMataAnggaran = e.data.data
                    //     $scope.listAsalProduk = e.data.asalproduk
                    //     $scope.dataSourceDetailMT = new kendo.data.DataSource({
                    //         data: DataTotalMataAnggaran
                    //     });
                    //     DataTabKeteranganBelanja  = e.data.keteranganbelanja
                    //     $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                    //         data: DataTabKeteranganBelanja,
                    //         group: $scope.group
                    //     });
                        
                    // })
                    LoadTotalKeterangan()
                    $scope.popupTambahKeteranganBelanja.center().close()
                }, function (error) {

                })
            }
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.TambahKeterangan = function(){
                $scope.item.noUrutKT = DataKeteranganBelanja.length + 1
                $scope.item.keteranganKT = ''
                $scope.item.jmlKT = ''
                $scope.item.hargaSatuanKT = ''
                $scope.item.subTotalKT = ''
                $scope.item.satuanKT = ''

                $scope.item.norecKT = ''
                $scope.popupTambahKeteranganBelanja.center().open()
            }
            
            $scope.TambahSPJ = function(){
                
                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                
                $scope.listSubKegiatanSPJ = [];
                ListSubKegiatan = [];
                for (let index = 0; index < DataKegiatan.length; index++) {
                    const element =  DataKegiatan[index];
                    if(element.div == 3){
                        ListSubKegiatan.push({'id':element.id,'keterangan' :element.kode + ' ' + element.keterangan,'kode' :element.kode})
                    }
                }
                
                $scope.listSubKegiatanSPJ = ListSubKegiatan
                $scope.item.subKegiatanSPJ = ""
                $scope.item.subSubKegiatanSPJ = ""
                $scope.item.mataAnggaranSPJ = ""
                $scope.item.sumberDanaSPJ =""
                $scope.item.sisaAnggaranSPJ=0
                $scope.item.panjar=0
                $scope.item.dasarKontraktualSPJ = ""

                $scope.item.jumlahSPJ = ""
                $scope.item.pph =0
                $scope.item.ppn = 0
                $scope.item.bendaharaSPJ = ""
                $scope.item.penerimaSPJ = ""
                $scope.item.pihakKetigaSPJ = ""

                $scope.popupTambahSPJ.center().open()
            }
            $scope.changeCboPilihSubKegiatanSPJ = function () {
                if( $scope.item.subKegiatanSPJ == undefined){
                    return
                }
                let newArr = []
                for (let index = 0; index < DataKegiatan.length; index++) {
                    const element = DataKegiatan[index];
                    if(element.div == 4){
                        if( element.kode.match($scope.item.subKegiatanSPJ.kode)){
                            newArr.push(element)
                        }
                    }
                   
                }
                $scope.listSubSubKegiatanSPJ = [];
                $scope.listSubSubKegiatanSPJ = newArr
            }
            $scope.changeCboPilihSubSubKegiatanSPJ = function(){
                if( $scope.item.subSubKegiatanSPJ == undefined){
                    return
                }
                let SbbTOTAL = 0;
                let arrAsal = {};
                $scope.listMataAnggaranSPJ = [];
                ListMataAnggaran = [];
                let SSama = false;
                for (let aa = 0; aa < DataTabKeteranganBelanja.length; aa++) {
                    const elementAA = DataTabKeteranganBelanja[aa];
                    if($scope.item.subSubKegiatanSPJ.kode == elementAA.kode ){
                        SSama = false
                        for (let index = 0; index < ListMataAnggaran.length; index++) {
                            const element = ListMataAnggaran[index];
                            if(element.kodemataanggaran == elementAA.kodemataanggaran){
                                element.subtotal = parseFloat(element.subtotal) + parseFloat(elementAA.subtotal)
                                SSama = true
                            }
                        }
                        if(SSama == false){
                            SbbTOTAL =  parseFloat(elementAA.subtotal)
                            arrAsal =  {'id':elementAA.objectasalprodukfk,'asalproduk':elementAA.asalproduk}
                            ListMataAnggaran.push({
                                'namamataanggaran' :elementAA.kodemataanggaran + ' ' + elementAA.namamataanggaran,
                                'kodemataanggaran' :elementAA.kodemataanggaran,
                                'subtotal' : SbbTOTAL,
                                'asalproduk': arrAsal
                            })
                        }
                    }
                }
                $scope.listMataAnggaranSPJ = ListMataAnggaran
            }
            $scope.changeCboPilihNoRekening = function () {
                if( $scope.item.mataAnggaranSPJ == undefined){
                    return
                }
                $scope.item.sisaAnggaranSPJ = formatRupiah($scope.item.mataAnggaranSPJ.subtotal, "Rp. ")
                $scope.item.sisaAnggaranSPJ2 = $scope.item.mataAnggaranSPJ.subtotal
                $scope.listAsalProduk = [ $scope.item.mataAnggaranSPJ.asalproduk]
                $scope.item.sumberDanaSPJ = $scope.item.mataAnggaranSPJ.asalproduk
            }
            $scope.TambahRincianBelanjaSPJ = function(){
                if( $scope.item.mataAnggaranSPJ ==  undefined){
                    return
                }
                $scope.item.noUrutSPJ = DataDetailSPJ.length + 1
                $scope.item.keteranganSPJ = ''
                $scope.item.jmlSPJ = ''
                $scope.item.satuanSPJ = ''
                $scope.item.hargaSatuanSPJ = ''
                $scope.item.subTotalSPJ = ''
                $scope.item.SPJstatusTambah = 'new'
                
                // DataKeteranganBelanja
                let itemRincianList = [];
                for (let index = 0; index < DataTabKeteranganBelanja.length; index++) {
                    const element = DataTabKeteranganBelanja[index];
                    if (element.kodemataanggaran == $scope.item.mataAnggaranSPJ.kodemataanggaran){
                        itemRincianList.push(element)
                    }
                }
                $scope.listItemRincian = itemRincianList
                $scope.popupTambahDetailSPJ.center().open()
            }
            $scope.SimpanPopUpRincianBelanjaSPJ = function(){
                if($scope.item.itemRincian != undefined){
                    if($scope.item.SPJstatusTambah == 'new'){
                        // let nourut = DataDetailSPJ.length + 1
                        let dataAddSPJ = {
                            nourut : $scope.item.noUrutSPJ,
                            uraian : $scope.item.keteranganSPJ,
                            jml : $scope.item.jmlSPJ,
                            satuan : $scope.item.satuanSPJ,
                            harga : $scope.item.hargaSatuanSPJ,
                            subtotal : $scope.item.subTotalSPJ,
                            keteranganbelanjafk : $scope.item.itemRincian.norec,
                            keteranganbelanja :$scope.item.itemRincian.keteranganbelanja
                        }
                        DataDetailSPJ.push(dataAddSPJ)
                        $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                            data: DataDetailSPJ
                        });
                        let NewTotal = 0;
                        for (let index = 0; index < DataDetailSPJ.length; index++) {
                            const element = DataDetailSPJ[index];
                            NewTotal =parseFloat(NewTotal) +parseFloat(DataDetailSPJ[index].subtotal)
                        }
                        $scope.item.jumlahSPJ = NewTotal
                        $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
                        $scope.popupTambahDetailSPJ.center().close()
                    }else{
                        for (let index = 0; index < DataDetailSPJ.length; index++) {
                            const element = DataDetailSPJ[index];
                            if(element.nourut == $scope.item.noUrutSPJ ){
                                element.uraian = $scope.item.keteranganSPJ
                                element.jml = $scope.item.jmlSPJ
                                element.satuan = $scope.item.satuanSPJ
                                element.harga = $scope.item.hargaSatuanSPJ
                                element.subtotal = $scope.item.subTotalSPJ
                                element.keteranganbelanjafk = $scope.item.itemRincian.norec
                                element.keteranganbelanja = $scope.item.itemRincian.keteranganbelanja
                            }
                        }
                        $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                            data: DataDetailSPJ
                        });
                        let NewTotal = 0;
                        for (let index = 0; index < DataDetailSPJ.length; index++) {
                            const element = DataDetailSPJ[index];
                            NewTotal =parseFloat(NewTotal) +parseFloat(DataDetailSPJ[index].subtotal)
                        }
                        $scope.item.jumlahSPJ = NewTotal
                        $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
                        $scope.popupTambahDetailSPJ.center().close()
                    }
                    
                }
            }
            function editDetailRincianBelanjaSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                if( $scope.item.mataAnggaranSPJ ==  undefined){
                    return
                }
                $scope.item.noUrutSPJ =dataItem.nourut
                $scope.item.keteranganSPJ = dataItem.uraian
                $scope.item.jmlSPJ = dataItem.jml
                $scope.item.satuanSPJ = dataItem.satuan
                $scope.item.hargaSatuanSPJ =dataItem.harga
                $scope.item.subTotalSPJ =dataItem.subtotal
                $scope.item.SPJstatusTambah = 'luama'
                
                // DataKeteranganBelanja
                let itemRincianList = [];
                for (let index = 0; index < DataTabKeteranganBelanja.length; index++) {
                    const element = DataTabKeteranganBelanja[index];
                    if (element.kodemataanggaran == $scope.item.mataAnggaranSPJ.kodemataanggaran){
                        itemRincianList.push(element)
                    }
                }
                $scope.listItemRincian = itemRincianList
                $scope.item.itemRincian = {keteranganbelanjafk:dataItem.keteranganbelanjafk,keteranganbelanja:dataItem.keteranganbelanja}
                $scope.popupTambahDetailSPJ.center().open()
            }
            function deleteDetailRincianBelanjaSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                if( $scope.item.mataAnggaranSPJ ==  undefined){
                    return
                }
                // DataDetailSPJ.push(dataAddSPJ)
                let newARr = []
                let a  = 0
                for (let index = 0; index < DataDetailSPJ.length; index++) {
                    if(DataDetailSPJ[index].nourut != dataItem.nourut){
                        a++
                        DataDetailSPJ[index].nourut = a
                        newARr.push(DataDetailSPJ[index])
                    }
                }
                $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                    data: newARr
                });
                DataDetailSPJ = newARr
                
                let NewTotal = 0;
                for (let index = 0; index < DataDetailSPJ.length; index++) {
                    const element = DataDetailSPJ[index];
                    NewTotal =parseFloat(NewTotal) +parseFloat(DataDetailSPJ[index].subtotal)
                }
                $scope.item.jumlahSPJ = NewTotal
                $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
            }
            $scope.SimpanPopUpDetailSPJ = function() {
                if($scope.item.pihakKetigaSPJ == undefined){
                    return
                }
                if($scope.item.subSubKegiatanSPJ == undefined){
                    return
                }
                if($scope.item.mataAnggaranSPJ == undefined){
                    return
                }
                let idAnggaran = 0;
                for (let index = 0; index < DataMataAnggaran.length; index++) {
                    const element = DataMataAnggaran[index];
                    if(element.kodemataanggaran == $scope.item.mataAnggaranSPJ.kodemataanggaran ){
                        idAnggaran = element.id
                    }
                }
                var datasave =
                    {
                        norec : '',
                        tglrealisasi:  moment($scope.item.tglSPJ).format('YYYY-MM-DD HH:mm:ss'),
                        status: null,
                        totalbelanja:  $scope.item.jumlahSPJ,
                        objectcarabayarfk: null,
                        rekananfk:  $scope.item.pihakKetigaSPJ.id,
                        deskripsi:  $scope.item.dasarKontraktualSPJ,
                        objectkegiatanfk:  $scope.item.subSubKegiatanSPJ.id,
                        objectmataanggaranfk:  idAnggaran,
                        bendaharafk:  $scope.item.bendaharaSPJ.value,
                        penerimafk:  $scope.item.penerimaSPJ.value,
                        pph:  $scope.item.pph,
                        ppn:  $scope.item.ppn,
                        realisasidetail: DataDetailSPJ
                    }
                medifirstService.post('perencanaan/save-realisasi-spj',datasave).then(function (e) {
                    LoadSPJ()
                    $scope.popupTambahSPJ.center().close()
                }, function (error) {

                })
            }
            function editDetailSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                let kegiatanArr = dataItem.kegiatan.split("~");
                let mataAnggaranArr = dataItem.mataanggaran.split("~");
                let kodeArr =kegiatanArr[0].split(" ");

                $scope.listSubKegiatanSPJ = [];
                ListSubKegiatan = [];
                let SPJSubKegiatan ={}
                for (let index = 0; index < DataKegiatan.length; index++) {
                    const element =  DataKegiatan[index];
                    if(element.div == 3){
                        ListSubKegiatan.push({'id':element.id,'keterangan' :element.kode + ' ' + element.keterangan,'kode' :element.kode})
                    }
                    if(kodeArr[0] == element.kode){
                        SPJSubKegiatan= {'id':element.id,'keterangan' :element.kode + ' ' + element.keterangan,'kode' :element.kode}
                    }
                }
                $scope.listSubKegiatanSPJ = ListSubKegiatan
                $scope.item.subKegiatanSPJ = SPJSubKegiatan


                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));

                $scope.listSubSubKegiatanSPJ =[{id: dataItem.objectkegiatanfk,keterangan: dataItem.kegiatan}] 
                $scope.item.subSubKegiatanSPJ =  {id: dataItem.objectkegiatanfk,keterangan: dataItem.kegiatan}

                $scope.listMataAnggaranSPJ = [{kodemataanggaran: dataItem.objectkegiatanfk,namamataanggaran: dataItem.mataanggaran}]
                $scope.item.mataAnggaranSPJ = {kodemataanggaran: dataItem.objectkegiatanfk,namamataanggaran: dataItem.mataanggaran}
                // $scope.item.sumberDanaSPJ
                // $scope.item.sisaAnggaranSPJ
                // $scope.item.panjar
                $scope.item.dasarKontraktualSPJ = dataItem.deskripsi

                $scope.item.jumlahSPJ = dataItem.totalbelanja
                $scope.item.pph = dataItem.pph
                $scope.item.ppn = dataItem.ppn
                
                $scope.listBendahara = [{value:dataItem.bendaharafk,text:dataItem.bendahara}]
                $scope.item.bendaharaSPJ = {value:dataItem.bendaharafk,text:dataItem.bendahara}

                $scope.listPenerima = [{value:dataItem.bendaharafk,text:dataItem.bendahara}]
                $scope.item.penerimaSPJ =  {value:dataItem.penerimafk,text:dataItem.penerima}

                $scope.listPihakKetiga = [{id:dataItem.rekananfk,namarekanan:dataItem.pihakketiga}]
                $scope.item.pihakKetigaSPJ = {id:dataItem.rekananfk,namarekanan:dataItem.pihakketiga}

                let newArr = []
                for (let index = 0; index < DataDetailSPJALL.length; index++) {
                    const element = DataDetailSPJALL[index];
                    if(element.strukrealisasifk == dataItem.norec){
                        // element.nourut = index+1
                        newArr.push(element.data)
                    }
                }
                DataDetailSPJ = []
                DataDetailSPJ = newArr[0]
                $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                    data: DataDetailSPJ
                });
                
                $scope.popupTambahSPJ.center().open()
            }

            $scope.klik = function (dataHeadSelected) {
                if (dataHeadSelected != undefined) {
                    $scope.idHead = dataHeadSelected.id
                    $scope.item.kodeHead = dataHeadSelected.kdkelompokhead
                    $scope.item.namaHead = dataHeadSelected.kelompokhead
                    $scope.item.kodeExternalHead = dataHeadSelected.kodeexternal
                    $scope.item.namaExternalHead = dataHeadSelected.namaexternal
                }
            }
            

             $scope.hapusKelompok = function (kode) {
                        var id = ''
                        if(kode == 5){
                            id = $scope.idLima
                        }
                         if(kode == 6){
                            id = $scope.idEnam
                        }

                        if(id == '')return
                    var itemDelete = {
                        "id":id ,
                        "kelompok": kode,
                    }
                    medifirstService.post('perencanaan/delete-kel-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idBerapa = ""
                        $scope.batal()
                    })
                
            }
            $scope.hapusHead = function () {
                if ($scope.idHead == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idHead,
                    }
                    medifirstService.post('perencanaan/delete-kel-head-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idHead = ""
                        $scope.batal()
                    })
                }
            }
            
            $scope.nextSubSubKegiatan = function () {
                $scope.popupRincianAnggaran.center().open()
                // medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id).then(function (e) {
                //     DataKeteranganBelanja = e.data.data
                //     $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                //         data: DataKeteranganBelanja
                //     });
                //     let TotalAnggaran = 0;
                //     for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                //         let element = DataKeteranganBelanja[index];
                //         TotalAnggaran = TotalAnggaran + element.subtotal
                //     }
                //     $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                //     $scope.rcn.totalAnggaran = formatRupiah(TotalAnggaran, "Rp. ")
                //     $scope.rcn.sisaAnggaran = formatRupiah(TotalAnggaran - 0, "Rp. ")
                    
                // })
            }









            /////////////////////////////////////////////////////////////////////
        }
    ]);
});