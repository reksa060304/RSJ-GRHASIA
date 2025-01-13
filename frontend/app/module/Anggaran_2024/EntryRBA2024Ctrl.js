define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('EntryRBA2024Ctrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
        function ($scope, cacheHelper, $state, $mdDialog, medifirstService) {
            
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataAnggaranSelected = {};
            $scope.dataSourceSPP = [];
            $scope.jeniskode = true;
            $scope.inputtahap = true
            $scope.norecpermenkelima = ''
            $scope.norecpermenkeempat = ''
            $scope.norecpanjar = ''
            $scope.norecspd = ''
            $scope.norecspm = ''
            $scope.norecspp = ''
            $scope.norecpanjar = ''
            $scope.passrba = true
            $scope.norecspjpanjar = ''
            $scope.norecpengembalian = ''
            $scope.pengembalianawal = 0
            $scope.konsolidasi = false;
            $scope.diskonsolidasi5 = true
            var DataKegiatan= [];
            $scope.selectedData2 = []
            var DataMataAnggaran= [];

            var DataTotalMataAnggaran = [];
            var DataKeteranganBelanja = [];
            var DataTabKeteranganBelanja = [];
            var dataAlokasi2222 = []

            var ListSubKegiatan = []
            var ListSubSubKegiatan = []
            var ListMataAnggaran = []
            var buttonhide = true
            $scope.dispanjar = false
            $scope.norecspj = ''
            $scope.hidespj = true
            $scope.hidekeuangan = true
            $scope.subsubketerangan = ''
            $scope.spjaja = false
            $scope.spjajas = false
            $scope.sppaja = false
            $scope.spmaja = false
            $scope.panjaraja = false
            $scope.semuaanggaran = false
            $scope.disidpegawai = false
            $scope.dispptkspj = false
            $scope.settingaja = false
            $scope.mataanggaranaja = false
            $scope.mataanggaranpermenaja = false
            $scope.rbaaja = false
            $scope.angkasaja = false
            $scope.hidemap=true
            
            $scope.rcn = {};
            $scope.rcn.mataAnggaranlv1 = ""
            $scope.rcn.mataAnggaranlv2 = ""
            $scope.rcn.mataAnggaranlv3 = ""
            $scope.rcn.totallv1 = ""
            $scope.rcn.totallv2 = ""
            $scope.rcn.totallv3 = ""
            $scope.norecverif = ""
            $scope.idtahap;
            $scope.hidetabspm = false
            $scope.item.tahun = null
            $scope.item.tahunkas = null
            $scope.item.tglawal = moment().startOf('month').format('YYYY-MM-DD');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglVerifSPJ = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglPanjar = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglSPPawalSearch = moment().startOf('month').format('YYYY-MM-DD');
            $scope.item.tglSPPakhirSearch = moment($scope.now).format('YYYY-MM-DD')
            $scope.totalketerangan = 0;
            $scope.totalrealisasidetail = 0;
            $scope.totalpanjar = 0;
            $scope.subtotalbelanjasebelum = 0;
            $scope.item.jumlahSPJ = 0
            $scope.totalspjawal = 0
            $scope.norecrcntotalanggaran = ''
            $scope.subtotalgakilang = [];
            $scope.idkegiatanangkas = 0
            $scope.kodesubsubkegiatanangkas = ''
            $scope.dataSourceDetailKeteranganBelanja = []
            $scope.dataSearchSourceKeteranganBelanja= []
            $scope.totalanggaranperalokasi = 0;
            $scope.kodemataanggaranalokasi = ''
            $scope.idpegawailogin = ''
            $scope.namapegawailogin = ''
            $scope.verifpanjar = true
            $scope.tambahpanjarspj = false
            $scope.idkegiatananggaran = ''
            $scope.disdiv = true
            $scope.disdivprog = true
            $scope.disdivkg = true
            $scope.disdivsubkg = true
            $scope.disdivsubsubkg = true
            $scope.dispptk = false
            $scope.dataSPP = []
            $scope.dataSPM = []
            $scope.jumlahspjdipilih = 0
            $scope.jumlahpanjardipilih = 0
            $scope.jumlahpengembaliandipilih = 0
            $scope.item.jumlahspjdipilih = 0
            $scope.item.jumlahpanjardipilih = 0
            $scope.item.jumlahpengembaliandipilih = 0
            $scope.datasave = {}
            $scope.selectedData2 = [];
            $scope.selectedData3 = [];
            $scope.item.ispj = false

            var defaultspj = null
            
            $scope.listDiv = [
                { id: 0, div: "Urusan Pemerintahan" },
                { id: 1, div: "Program" },
                { id: 2, div: "Kegiatan" },
                { id: 3, div: "Sub Kegiatan" },
                { id: 4, div: "Sub Sub Kegiatan" },
            ];

            $scope.listStatusSPJ = [
                { id: 0, status: "Semua" },
                { id: 1, status: "Belum Verifikasi" },
                { id: 2, status: "Revisi" },
                { id: 3, status: "Sudah Verifikasi" },
            ];

            $scope.listDivKonsolidasi = [
                { id: 1, div: "Div: 1" },
                { id: 2, div: "Div: 2" },
                { id: 3, div: "Div: 3" },
                { id: 4, div: "Div: 4" },
            ];

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.groupmataanggaran = [
                {
                    field: "kegiatan"
                },
            ];

            $scope.listPihakKetiga = []

            loadDataCombo()
            function loadDataCombo() {
                medifirstService.get('anggaran/pj-rba?id=' + medifirstService.getPegawaiLogin().id).then(function (data) {
                    $scope.item.ispj = data.data[0].ispj
                    var idpegawai = '';
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'

                    if ($scope.item.ispj == true) {
                        idpegawai = $scope.pegawaiLogin.id
                        $scope.disidpegawai = true
                        $scope.idpegawailogin = $scope.pegawaiLogin.id
                        $scope.namapegawailogin = $scope.pegawaiLogin.namaLengkap

                    }
                    
                    medifirstService.get("anggaran/get-combo-anggaran", true).then(function (dat) {
                        var dataCombo = dat.data;
                        $scope.listDataDiv = dataCombo.divkegiatan;
                        $scope.listDataJabatan = dataCombo.jabatan;
                        $scope.listDataDivUsulan = dataCombo.divprog;
                        $scope.listDataDivProg = dataCombo.divKg;
                        $scope.listDataDivSubkg = dataCombo.divsubKg;
                        $scope.listDataDivSubsubkg = dataCombo.divsubsubKg;
                        $scope.listTahap = dataCombo.tahap;
                        $scope.listJenisBelanja = dataCombo.jenisbelanja;
                        $scope.listAsalProduk = dataCombo.asalproduk
                        $scope.listKegiatanCombo = dataCombo.divsubsubKg
                        // $scope.listTahapKegiatan = dataCombo.tahap

                        // tahap sesuai setting anggaran
                        $scope.item.searchtahapkeg = {
                            id: dataCombo.setting[0].objecttahapaktivfk,
                            tahap: dataCombo.setting[0].tahap
                        }

                        $scope.listTahap.map(function(item){
                            if(item.id == dataCombo.setting[0].objecttahapaktivfk){
                                $scope.item.searchtahapAngkas = item
                            }
                        })

                        // ambil tahun sesuai setting
                        $scope.item.tahun = moment(dataCombo.setting[0].tahunanggaran).format('YYYY'),
                        $scope.item.tahunkas = moment(dataCombo.setting[0].tahunanggaran).format('YYYY'),

                        medifirstService.getPart('perencanaan/get-datacombo-part-rekanan', true, true, 20).then(function (data) {
                            $scope.listPihakKetiga = data
                        })
            
                        medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                            $scope.ListDataPegawai = data;
                        });

                        loadDataGrid();

                    });
                })
                
            }
            
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                $scope.item.statusspj = [{ id: 0, status: "Semua" }]
                var idpegawai = '';
                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                medifirstService.get('anggaran/pj-rba?id=' + medifirstService.getPegawaiLogin().id).then(function (data) {
                    $scope.item.ispj = data.data[0].ispj
                    if ($scope.item.ispj == true) {
                        idpegawai = $scope.pegawaiLogin.id
                        $scope.disidpegawai = true
                        $scope.idpegawailogin = $scope.pegawaiLogin.id
                        $scope.namapegawailogin = $scope.pegawaiLogin.namaLengkap

                    }
                    if ($state.params.parameter == '77777') {
                        $scope.spjaja = true
                    } else if ($state.params.parameter == '33333') {
                        $scope.spjpengembalian = true
                    } else if ($state.params.parameter == '99999') {
                        $scope.panjaraja = true
                    } else if ($state.params.parameter == '88888') {
                        $scope.sppaja = true
                    } else if ($state.params.parameter == '66666') {
                        $scope.spmaja = true
                    } else if ($state.params.parameter == '55555') {
                        $scope.semuaanggaran = true
                    } else if ($state.params.parameter == '44444') {
                        $scope.spjajas = true
                    } else if ($state.params.parameter == '56565') {
                        $scope.settingaja = true
                        $scope.semuaanggaran = true
                    } else if ($state.params.parameter == '78787') {
                        $scope.mataanggaranaja = true
                        $scope.semuaanggaran = true
                    } else if ($state.params.parameter == '67676') {
                        $scope.mataanggaranpermenaja = true
                        $scope.semuaanggaran = true
                    } else if ($state.params.parameter == '12121') {
                        $scope.rbaaja = true
                        $scope.semuaanggaran = true
                    } else if ($state.params.parameter == '23232') {
                        $scope.angkasaja = true
                        $scope.semuaanggaran = true
                    }
                    //console.log($scope.hidespj)
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

                    var div = ''
                    if($scope.item.searchdivkeg != undefined){
                        div = $scope.item.searchdivkeg.id
                    }

                    // jika ada tahap cari sesuai tahap
                    let tahap = ''
                    if($scope.item.searchtahapkeg !== undefined && $scope.item.searchtahapkeg !== null){
                        tahap = '&tahap=' + $scope.item.searchtahapkeg.id
                    }

                    // jika ispj di pegawai true maka munculkan kegiatan berdasarkan pptk
                    let pegawai = ''
                    if($scope.item.ispj == true){
                        pegawai = '&pegawai=' + $scope.idpegawailogin
                    }

                    let tahun = ''
                    if($scope.item.tahun !== undefined && $scope.item.tahun !== null){
                        tahun = '&tahun=' + $scope.item.tahun
                    }


                    // medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                    medifirstService.get("anggaran/get-daftar-master-kegiatanRBA?div=" + div + tahap + pegawai + tahun).then(function (e) {
                        DataKegiatan = e.data.kegiatan
                        for (let i = 0; i < DataKegiatan.length; i++) {
                            DataKegiatan[i].statCheckbox = false
                        }
                        $scope.dataSourceKegiatan = e.data.kegiatan
                    })

                    medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                        $scope.listBendahara = data
                        $scope.listPenerima = data
                    })
                    

                })
                
                
            }    

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
            
            // #region entry rba
            $scope.findKegiatan = function () {
                var div = ''
                if($scope.item.searchdivkeg != undefined){
                    div = $scope.item.searchdivkeg.id
                }

                var thn = ''
                if($scope.item.tahun != undefined){
                    thn = '&tahun=' + moment($scope.item.tahun).format('YYYY')
                }

                var thp = ''
                if($scope.item.searchtahapkeg != undefined){
                    thp = '&tahap=' + $scope.item.searchtahapkeg.id
                }

                medifirstService.get("anggaran/get-daftar-master-kegiatanRBA" 
                    + "?div=" + div 
                    + thn + thp).then(function (e) {
                    DataKegiatan = e.data.kegiatan
                    for (let i = 0; i < DataKegiatan.length; i++) {
                        DataKegiatan[i].statCheckbox = false
                    }
                    $scope.dataSourceKegiatan = e.data.kegiatan
                })
            }

            $scope.Tambah = function(){
                $scope.item.id = ''
                $scope.popupTambah.center().open()
            }

            $scope.simpanKegiatan = function(){

                // validasi
                if($scope.item.subKegiatanEntry == undefined && $scope.item.subKegiatanEntry == null){
                    toastr.error('Pilih Sub Kegiatan Dulu')
                    return
                }

                if($scope.item.kodeSubSubKegiaatanEntry == undefined && $scope.item.kodeSubSubKegiaatanEntry == null){
                    toastr.error('Isi kode subsub kegiatan dulu')
                    return
                }

                if($scope.item.keteranganSubSubKegiaatanEntry == undefined && $scope.item.keteranganSubSubKegiaatanEntry == null){
                    toastr.error('Isi nama subsub kegiatan dulu')
                    return
                }

                if($scope.item.tahuntambahkegiatan == undefined && $scope.item.tahuntambahkegiatan == null){
                    toastr.error('Isi tahun dulu')
                    return
                }

                if($scope.item.tahaptambah == undefined && $scope.item.tahaptambah == null){
                    toastr.error('Pilih tahap dulu')
                    return
                }

                if($scope.item.pptktambah == undefined && $scope.item.pptktambah == null){
                    toastr.error('Pilih PPTK dulu')
                    return
                }

                if($scope.item.jenisbelanjatambah == undefined && $scope.item.jenisbelanjatambah == null){
                    toastr.error('Pilih Jenis belanja dulu')
                    return
                }

                let objSave = {
                    objectsubkegitan: $scope.item.subKegiatanEntry.id,
                    kode: $scope.item.kodeSubSubKegiaatanEntry,
                    keterangan: $scope.item.keteranganSubSubKegiaatanEntry,
                    tahun: moment($scope.item.tahuntambahkegiatan).format('YYYY'),
                    tahap: $scope.item.tahaptambah.id,
                    pptk: $scope.item.pptktambah.id,
                    jenisbelanja: $scope.item.jenisbelanjatambah.id
                }

                medifirstService.post('anggaran/save-entry-kegiatantransaksi', objSave)
                    .then(function (e) {
                        
                        loadDataGrid()

                    })
            }

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

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSourceKegiatan;
                // console.log(tempData);
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedData2 = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        console.log(tempData[i]);
                        tempData[i].statCheckbox = true;
                        $scope.selectedData2.push(tempData[i])
                    }
                }
                reloaddataSourceGrid1(tempData);
            }

            function reloaddataSourceGrid1(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                var grid = $('#kegGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.selectRow = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kegGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                // console.log(dataItem);
                if (checked) {
                    dataItem.statCheckbox = true;
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].kode == dataItem.kode) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    $scope.selectedData2.push(dataItem);
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox = false;
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].kode == dataItem.kode) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
                // console.log($scope.selectedData2);
            }

            $scope.norecTransaksi = null;
            function editKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                $scope.norecTransaksi = dataItem.norec
                // medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				// })
                
                $scope.norecrcntotalanggaran = dataItem.norec 
                $scope.datakegiatanbro = dataItem
                
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                $scope.item.id = dataItem.idsubsubkegiatan
                $scope.item.subsubketerangan = dataItem.id
                //console.log($scope.item.subsubketerangan)
                console.log(dataItem)
                let kodeArr = dataItem.kode.split(" ");
                let kodeArr2 = kodeArr[0].split(".");
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
                    $scope.popupKegiatan.center().open();
                    $scope.item.kodeHead = a1 + '.' + b1
                    $scope.item.kode = c1
                }else if(dataItem.div == 3){
                    $scope.item.subkegiatandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupSubKegiatan.center().open();
                    $scope.item.kodeHead =  a1 +'.'+ b1 +'.'+c1
                    // d1 = kodeArr2[5]  
                    $scope.item.kode = d1 
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)
                    // $scope.item.kode = dataItem.kode.substring(13,15)
                }else if(dataItem.div == 4){
                    
                    medifirstService.get("anggaran/get-detail-kegiatan?norec=" + dataItem.norec).then(function (e) {
                        
                        $scope.idkegiatananggaran = dataItem.id
                        buttonhide = false
                        $scope.item.subsubkegiatandiv = {div: dataItem.div, id: dataItem.namadiv}
                        $scope.item.urusanPemerintahan = e.data.kegiatan[0].kode_urusan + ' ' + e.data.kegiatan[0].ket_urusan
                        $scope.item.program = e.data.kegiatan[0].kode_program + ' ' + e.data.kegiatan[0].ket_program
                        $scope.item.kegiatan = e.data.kegiatan[0].kode_kegiatan + ' ' + e.data.kegiatan[0].ket_kegiatan
                        $scope.item.subKegiatan = e.data.kegiatan[0].kode_subkegiatan + ' ' + e.data.kegiatan[0].ket_subkegiatan
                        
                        for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                            let element = $scope.dataSourceKegiatan[index];
                            if(element.kode == a1 +'.'+ b1 +'.'+ c1+'.'+ d1){
                                //$scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                            }
                            $scope.item.kode4 = a1 +'.'+ b1 +'.'+ c1+'.'+ d1
                        }
                        let TotalAnggaran = dataItem.targetmasuk;
                        
                        $scope.item.subSubKegiatankode = kodeArr[0]//dataItem.kode//.substring(16) 
                        $scope.item.subSubKegiatan =  dataItem.keterangan
                        $scope.item.thnAnggaran = moment(dataItem.tahun).format('YYYY') 
                        $scope.item.pptktext = dataItem.namalengkap
                        $scope.item.jenisbelanja = {id:e.data.jenisbelanja[0].id, jenisbelanja:e.data.jenisbelanja[0].jenisbelanja}
                        // $scope.item.jenisbelanja = {id:e.data.jenisbelanja[0].id, jenisbelanja:e.data.jenisbelanja[0].jenisbelanja}
                        // $scope.item.tahapdetail = {id: e.data.tahap[0].id, tahap: e.data.tahap[0].tahap}
                        $scope.listTahap.map(function(item){
                            if(item.id == e.data.kegiatan[0].idtahap){
                                $scope.item.tahapdetail = item
                            }
                        })

                        $scope.rcn.judulKegiatan =  dataItem.keterangan
                        $scope.item.norec = dataItem.norec
                        $scope.item.idpptkpopupkegiatan = dataItem.idpptk 
                        //$scope.item.tolokUkurMasukan = dataItem.indikatormasuk
                        $scope.item.tolokUkurMasukan = 'Dana'
                        // $scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")//dataItem.targetmasuk
                        $scope.item.targetKinerjaMasukan = dataItem.targetmasuk
                        $scope.item.tolokUkurKeluaran = dataItem.indikatorkeluaran
                        $scope.item.targetKinerjaKeluaran = dataItem.targetkeluaran
                        $scope.item.tolokUkurHasil = dataItem.indikatorhasil
                        $scope.item.targetKinerjaHasil = dataItem.targethasil
                        $scope.popupSubSubKegiatan.center().open();  
                    })
                    
                }
                
                $scope.item.keterangan = dataItem.keterangan
                $scope.item.div = dataItem.div
            }

            function deleteKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                var objSave =
                    {
                        norec: dataItem.norec,
                        div: dataItem.div,
                    }
                if(dataItem.islockrba == true){
                    toastr.error('Sudah dilock!')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('anggaran/delete-transaksianggaran', objSave).then(function (e) {
                        
                        loadDataGrid()

                    })
                })
                
            }

            $scope.hapusCentang = function () {
                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    // const element = $scope.selectedData2[i];
                    if ($scope.selectedData2[i].islockrba == true){
                        toastr.error('Pada keterangan ' + $scope.selectedData2[i].keterangan+ ' sudah dilock!')
                        return
                    }
                }

                // console.log($scope.selectedData2)

                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus Kegiatan yang dicentang?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                $mdDialog.show(confirm).then(function () {
                    var objSave = {
                        data: $scope.selectedData2,
                        div: $scope.item.div.id
                    }
                    medifirstService.post('anggaran/delete-kegiatan-anggaran-centang', objSave).then(function (e) {
                        loadDataGrid()
                    })

                })
                
            }

            $scope.SimpanPopUpSubSubKegiatan = function(){
                
                var idtahap = null
                var tahap = null
                if($scope.item.tahapdetail.id != undefined && $scope.item.tahapdetail.id != '' && $scope.item.tahapdetail.id != [] && $scope.item.tahapdetail.id != null){
                    idtahap = $scope.item.tahapdetail.id
                    tahap = $scope.item.tahapdetail.tahap
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

                //if()

                var objSave = {
                    norec: $scope.item.norec,
                    tahun: $scope.item.thnAnggaran,
                    idtahap: idtahap,
                    // tahap: tahap,
                    jenisbelanja: $scope.item.jenisbelanja.id,
                    indikatormasuk: $scope.item.tolokUkurMasukan,
                    indikatorkeluaran:  $scope.item.tolokUkurKeluaran,
                    indikatorhasil:  $scope.item.tolokUkurHasil,
                    targetmasuk:  $scope.item.targetKinerjaMasukan == undefined ? 0 : $scope.item.targetKinerjaMasukan,
                    targetkeluaran:  $scope.item.targetKinerjaKeluaran,
                    targethasil:  $scope.item.targetKinerjaHasil,
                    pptk:  $scope.item.savepptk == undefined ? $scope.item.idpptkpopupkegiatan : $scope.item.savepptk,
                    // div: $scope.item.subsubkegiatandiv.div
                }

                medifirstService.post('anggaran/save-kegiatan-transaksi-anggaran', objSave).then(function (e) {
                })

                var div = ''
                if($scope.item.searchdivkeg != undefined){
                    div = $scope.item.searchdivkeg.id
                }
                
                medifirstService.get("anggaran/get-daftar-master-kegiatanRBA?div=" + div).then(function (e) {
                    DataKegiatan = e.data.kegiatan
                    for (let i = 0; i < DataKegiatan.length; i++) {
                        DataKegiatan[i].statCheckbox = false
                    }
                    $scope.dataSourceKegiatan = e.data.kegiatan
                })
                
                $scope.popupSubSubKegiatan.center().close()
            }

            $scope.HapusPopUpSubSubKegiatan = function(){
                // console.log($scope.datakegiatanbro);
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }
                var objSave =
                    {
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
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-rincian-kegiatan-anggaran', objSave).then(function (e) {
                        var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupSubSubKegiatan.center().close()
                    }, function (error) {
    
                    })
                })

                
                
            }

            $scope.nextSubSubKegiatan = function () {
                $scope.dataSourceRincianAnggaran = []
                $scope.item.isCekAdaAnggaranSaja = false
                
                $scope.norecrcntotalanggaran = $scope.item.norec 
                medifirstService.get("anggaran/get-total-anggaran-rcn?norec=" + $scope.norecrcntotalanggaran)
                    .then(function (e) {
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


                medifirstService.get("anggaran/get-total-mataanggaran-transaksi" 
                    + "?norec_transakianggaran=" + $scope.norecTransaksi)
                    .then(function(response) {
                        

                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: response.data.mataanggaran
                        });
                    })
                
                $scope.popupRincianAnggaran.center().open()
                
            }

            $scope.$watch('item.isCekAdaAnggaranSaja', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id
                    
                    medifirstService.get("anggaran/get-total-mataanggaran-transaksi" 
                        + "?norec_transakianggaran=" + $scope.norecTransaksi
                        + "&cek=" + $scope.item.isCekAdaAnggaranSaja)
                        .then(function(response) {

                            $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                data: response.data.mataanggaran
                            });
                        })
                }
            });

            $scope.$watch('item.searchMataMT', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
                        let element = DataTotalMataAnggaran[index];
                        let namasearch = element.namamataanggaran.toLowerCase()
                        let kodesearch = element.kodemataanggaran.toLowerCase()
                        if (namasearch.match(newValue.toLowerCase())) {
                            data.push(element)
                        }else if (kodesearch.match(newValue.toLowerCase())) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceDetailMT = new kendo.data.DataSource({
                        data: data
                    });
                }
            });

            $scope.klikDetailMT = function (dataMataAnggaranSelected) {
                if (dataMataAnggaranSelected != undefined) {
                    $scope.subtotalgakilang = dataMataAnggaranSelected
                    console.log($scope.subtotalgakilang)
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
                                console.log(element.total)
                            }
                        } else if(a1 == 'II'){
                            if(element.kodemataanggaran.match(myRega1) && !element.kodemataanggaran.match(/III.*/)){
                                $scope.rcn.mataAnggaranlv1 = a1
                                $scope.rcn.totallv1 += parseInt(element.total)
                                console.log(element.total)
                            }
                        } else if(a1 == 'III'){
                            if(element.kodemataanggaran.match(myRega1)){
                                $scope.rcn.mataAnggaranlv1 = a1
                                $scope.rcn.totallv1 += parseInt(element.total)
                                console.log(element.total)
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
                    medifirstService.get("anggaran/get-keterangan-belanja" 
                        + "?norec=" + $scope.item.norec 
                        + "&idmataanggaran=" + dataMataAnggaranSelected.idmataanggaran
                        + "&tahun=" + $scope.item.tahun)
                        .then(function (e) {
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
                medifirstService.get("anggaran/get-keterangan-belanja?norec=" + $scope.item.norec+"&idmataanggaran="+$scope.rcn.idmataanggaran).then(function (e) {
                    DataKeteranganBelanja = e.data.data
                    $scope.item.noUrutKT = DataKeteranganBelanja.length + 1
                })
                $scope.nourut = 0
                $scope.item.keteranganKT = ''
                $scope.item.jmlKT = ''
                $scope.item.hargaSatuanKT = ''
                $scope.item.subTotalKT = ''
                $scope.item.satuanKT = ''

                $scope.item.norecKT = ''
                $scope.popupTambahKeteranganBelanja.center().open()
            }

            var isCheckAll2 = false
            $scope.selectUnselectAllRow2 = function () {
                var tempData = $scope.dataSourceRincianAnggaran._data;
                console.log(tempData);
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

                console.log($scope.selectedData3)
                reloaddataSourceGrid2(tempData);
            }

            $scope.selectRow2 = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#rincianGrids").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                console.log(dataItem);
                if (checked) {
                    dataItem.statCheckbox2 = true;
                    for (var i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norec == dataItem.norec) {
                            $scope.selectedData3.splice(i, 1);
                            break;
                        }
                    $scope.selectedData3.push(dataItem);
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox2 = false;
                    for (var i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norec == dataItem.norec) {
                            $scope.selectedData3.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
                console.log($scope.selectedData3);
            }

            function reloaddataSourceGrid2(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                var grid = $('#rincianGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.hapusCentang2 = function(){
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }

                // validasi jika sudah ada nilai spj maka tidak bisa dihapus
                let dataPunyaSPJ = []
                $scope.selectedData3.map(function(item){
                    if(item.jumlahspj > 0){
                        dataPunyaSPJ.push(item)
                    }
                })

                if(dataPunyaSPJ.length > 0){
                    toastr.error("Rincian sudah ada SPJ")
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus centangan rincian anggaran?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                $mdDialog.show(confirm).then(function () {
                    var itemDelete = {
                        "data": $scope.selectedData3
                    }


                    medifirstService.post('anggaran/delete-anggaran-kass', itemDelete).then(function (e) {
                        $scope.selectedData3 = []
                        medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                            var total = 0
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


                    var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id

                })
            }

            function editDetailMT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                $scope.nourut = true
                $scope.item.norecKT = dataItem.norec
                $scope.item.keteranganKT = dataItem.keteranganbelanja
                $scope.item.noUrutKT = dataItem.nourut
                $scope.item.jmlKT = dataItem.jml
                $scope.item.hargaSatuanKT = dataItem.hargasatuan
                $scope.item.subTotalKT = dataItem.subtotal
                $scope.item.satuanKT = dataItem.satuan
                $scope.item.sumberDanaKT = {id:dataItem.objectasalprodukfk,asalproduk:dataItem.asalproduk}
                $scope.rcn.idmataanggaran = dataItem.objectmataanggaranfk
                $scope.item.password = dataItem.password
                $scope.item.passwordbenar = undefined
                $scope.item.jumlahspjEntryRBA = dataItem.jumlahspj

                $scope.popupTambahKeteranganBelanja.center().open();
            }

            $scope.$watch('item.hargaSatuanKT', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.hargaSatuanKT.includes(',') ) {
                        console.log('ada komanya');
                        $scope.item.hargaSatuanKT = $scope.item.hargaSatuanKT.replace(',', '.');
                        // $scope.item.hargaSatuanKT = parseFloat($scope.item.hargaSatuanKT.join('.'))
                    }else{
                        $scope.item.subTotalKT = $scope.item.hargaSatuanKT
                    }
                    
                    $scope.item.subTotalKT = $scope.item.hargaSatuanKT*$scope.item.jmlKT
                    $scope.item.subTotalKTText = $scope.item.subTotalKT.toLocaleString('id-ID')
                    //console.log($scope.item.subTotalKT)
                }
            });

            $scope.$watch('item.jmlKT', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.jmlKT.includes(',')) {
                        $scope.item.jmlKT = $scope.item.jmlKT.replace(',', '.')
                    } else {
                        $scope.item.jmlKT = $scope.item.jmlKT
                    }
                    $scope.item.subTotalKT = $scope.item.hargaSatuanKT*$scope.item.jmlKT
                    $scope.item.subTotalKTText = $scope.item.subTotalKT.toLocaleString('id-ID')
                    //console.log($scope.item.subTotalKT)
                }
            });

            $scope.SimpanPopUpAddKeterangan = function(){
                var $idasalproduk = 0;
                if($scope.item.sumberDanaKT != undefined){
                    $idasalproduk = $scope.item.sumberDanaKT.id;
                }
                var norecKT = ''
                if($scope.item.norecKT != ''){
                    norecKT = $scope.item.norecKT
                }
                var pass = null
                if($scope.item.password != '' && $scope.item.password != undefined){
                    pass = $scope.item.password
                }
                if ($scope.item.sumberDanaKT == undefined){
                    toastr.error('Sumber Dana Tidak Boleh Kosong!')
                    return
                }
                
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }

                // jika subtotal kurang dari spj maka tolak
                if($scope.item.subTotalKT < $scope.item.jumlahspjEntryRBA){
                    toastr.error('Subtotal tidak boleh kurang dari spj')
                    return
                }

                var objSave ={
                    norec: norecKT,
                    objectkegiatanfk: $scope.item.id,
                    objectmataanggaranfk: $scope.rcn.idmataanggaran,
                    keteranganbelanja: $scope.item.keteranganKT,
                    nourut: $scope.item.noUrutKT,
                    jml: $scope.item.jmlKT,
                    hargasatuan: $scope.item.hargaSatuanKT,
                    subtotal: $scope.item.subTotalKT,
                    satuan: $scope.item.satuanKT,
                    objectasalprodukfk: $idasalproduk,
                    idtahap: $scope.item.tahapdetail.id,
                    tahap: $scope.item.tahapdetail.tahap,
                    password: pass,
                    objecttransaksifk: $scope.item.norec
                }

                medifirstService.post('anggaran/save-keterangan-belanja', objSave).then(function (e) {
                    
                    $scope.norecrcntotalanggaran = $scope.item.norec 
                    medifirstService.get("anggaran/get-total-anggaran-rcn?norec=" + $scope.norecrcntotalanggaran)
                        .then(function (e) {
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


                    medifirstService.get("anggaran/get-total-mataanggaran-transaksi" 
                        + "?norec_transakianggaran=" + $scope.norecTransaksi
                        + "&cek=" + $scope.item.isCekAdaAnggaranSaja)
                        .then(function(response) {

                            $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                data: response.data.mataanggaran
                            });
                        })
                    
                    $scope.popupTambahKeteranganBelanja.center().close()
                })
                
            }

            function HapusRincianKas(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                
                // jika sudah dilock
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }

                // Jika item belanja sudah ada spj maka tolak
                if(dataItem.jumlahspj > 0){
                    toastr.error('Rincian sudah ada SPJ')
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda yakin ingin menghapus " + dataItem.keteranganbelanja + "?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                
                $mdDialog.show(confirm).then(function () {
                    var itemDelete = {
                        "norec": dataItem.norec
                    }

                    medifirstService.post('anggaran/delete-anggaran-kas', itemDelete)
                        .then(function (e) {

                            medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.idkegiatananggaran).then(function (e) {
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

                            if($scope.idkegiatanangkas != 0){
                                $scope.item.id = $scope.idkegiatanangkas
                            } else{
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
                                
                        
                    var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id
                    
                    console.log($scope.item.isCekAdaAnggaranSaja)
                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&cek=" + $scope.item.isCekAdaAnggaranSaja+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                        DataTotalMataAnggaran = e.data.data
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: DataTotalMataAnggaran
                        });
                    });
                                    
                })
            }
            // #endregion

            
            // #region pptk
            $scope.TambahPPTK = function(){
                
                medifirstService.get("anggaran/get-daftar-pptk?norec=" + $scope.item.norec + "&tahun=" + $scope.item.thnAnggaran
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePPTK = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 150,
                            total: datas.length,
                            serverPaging: false, 
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                        });
                        
                    });
                    console.log($scope.item.subSubKegiatankode,);
                if($scope.item.subSubKegiatankode != undefined && $scope.item.subSubKegiatankode != ''){
                    $scope.item.kodesubsubpptk = $scope.item.subSubKegiatankode
                    $scope.item.namasubsubpptk = $scope.item.subSubKegiatan
                } else if($scope.item.subsubkegiatanangkas != undefined){
                    $scope.item.kodesubsubpptk = $scope.item.subsubkegiatanangkas.kode
                    $scope.item.namasubsubpptk = $scope.item.subsubkegiatanangkas.keterangan
                }
                
                $scope.popupPPTK.center().open()
            }

            $scope.SimpanPPTK = function(){
                $scope.item.savepptk = $scope.item.pptk.value
                $scope.item.pptktext = $scope.item.pptk.text
                //console.log($scope.item.pptk.value)
                $scope.popupPPTK.center().close()
            }

            $scope.DeletePPTK = function(){
                if ($scope.datakegiatanbro.islockrba == true) {
                    toastr.error('Sudah dilock!')
                    return
                }
                $scope.item.pptktext = ''
                $scope.item.savepptk = null
            }
            // #endregion pptk


            // #region transfer rba
            $scope.SettingTahap = function(){
                
                medifirstService.get("anggaran/get-combo-anggaran", true).then(function (dat) {
                    var dataCombo = dat.data;
                    
                    $scope.listSubKegiatanTransfer = dataCombo.divsubsubKg

                });
                
                $scope.popupTambahTahap.center().open()
            
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

                // }
                //console.log($scope.arrayProdukTemp)
            }

            $scope.CariSettingTahap = function () {

                // validasi
                if($scope.item.tahapawal == undefined && $scope.item.tahapawal == null){
                    toastr.error('Pilih tahap awal dulu')
                    return
                }

                if($scope.item.tahunawal == undefined && $scope.item.tahunawal == null){
                    toastr.error('Pilih tahun awal dulu')
                    return
                }

                if($scope.item.subkegiatantransfer == undefined && $scope.item.subkegiatantransfer == null){
                    toastr.error('Pilih subkegiatan dulu')
                    return
                }

                medifirstService.get("anggaran/get-subsubkegiatan-transfer?tahap="+$scope.item.tahapawal.id+"&tahunawal="+moment($scope.item.tahunawal).format('YYYY')+"&subkegiatan="+$scope.item.subkegiatantransfer.id).then(function (e) {
                    $scope.listSubSubKegiatan = e.data
                    $scope.arrayProdukTemp = []
                    if ($scope.listSubSubKegiatan.length > 0) {
                        for (let i = 0; i < $scope.listSubSubKegiatan.length; i++) {
                            const element = $scope.listSubSubKegiatan[i];
                            element.isChecked = false
                        }
                    }
                });
            }

            $scope.SaveSettingTahap = function () {
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Data belum di pilih')
                    return
                }

                var objSave = {
                    "details": $scope.arrayProdukTemp,
                    "tgltransfer": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    "tahapawal": $scope.item.tahapawal,
                    "tahapakhir": $scope.item.tahapakhir,
                    "tahunawal": moment($scope.item.tahunawal).format('YYYY'),
                    "tahunakhir": moment($scope.item.tahunakhir).format('YYYY'),
                }
                
                console.log(objSave)
                
                medifirstService.post('anggaran/save-subsubkegiatan-transfer', objSave).then(function (e) {
                    $scope.popupTambahTahap.center().close()
                    loadDataGrid();

                    $scope.arrayProdukTemp = []

                })

            }
            // #endregion
            

            // #region pemindatah keterangan belanja
            $scope.PemindahanKeterangan = function(){
                
                $scope.popupPerubahan.center().open()
            }

            $scope.$watch('item.tahapdetail', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.tahapdetail != undefined || $scope.item.tahapdetail != null){
                        $scope.inputtahap = false
                    }
                }
            });

            $scope.CariKeteranganPerubahan = function () {
                // medifirstService.get("perencanaan/get-data-combo?idmataanggaran="+$scope.item.combomataanggaran.id+"&tahapaktif="+$scope.item.objecttahappemindahan.id).then(function (e) {
                    
                //     $scope.listKeteranganPerubahan = e.data.keteranganperubahan
                //     $scope.arrayProdukTemp = []
                //     if ($scope.listKeteranganPerubahan.length > 0) {
                //         for (let i = 0; i < $scope.listKeteranganPerubahan.length; i++) {
                //             const element = $scope.listKeteranganPerubahan[i];
                //             element.isChecked = false
                //         }
                //     }
                // });

                medifirstService.get("anggaran/get-keteranganbelanja-pindahrincian" 
                    + "?mataanggaran="+$scope.item.combomataanggaran.id
                    + "&tahap="+$scope.item.objecttahappemindahan.id
                    + "&tahun="+moment($scope.item.tahun).format('YYYY')
                    + "&subsubkegiatan"+$scope.item.combosubsubkegiatan.idsubsubkegiatan
                    ).then(function (e) {
                    
                        $scope.listKeteranganPerubahan = e.data
                        $scope.arrayProdukTemp = []
                        if ($scope.listKeteranganPerubahan.length > 0) {
                            for (let i = 0; i < $scope.listKeteranganPerubahan.length; i++) {
                                const element = $scope.listKeteranganPerubahan[i];
                                element.isChecked = false
                            }
                        }
                    });
            }

            $scope.ceklisOneCombo = function (bool, data) {
                //console.log(bool)
                if (bool) {
                    $scope.listKeteranganPerubahan.forEach(function (e) {
                        if (data.norec == e.norec && bool == e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                        if (data.norec == e.norec && bool != e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                    })
                } else {
                    $scope.listKeteranganPerubahan.forEach(function (e) {
                        if (data.norec == e.norec && bool == e.isChecked) {
                            e.isChecked = true
                            $scope.arrayProdukTemp.push(e)

                        }
                        if (data.norec == e.norec && bool != e.isChecked) {
                            e.isChecked = false
                            $scope.arrayProdukTemp.splice(e, 1);

                        }
                    })
                }

                // }
                //console.log($scope.arrayProdukTemp)
            }

            $scope.$watch('item.combokegiatanakhir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?subsubkegiatan="+$scope.item.combokegiatanakhir.kode).then(function (e) {
                        $scope.listSubSubKegiatanComboakhir = e.data.kegiatansubsubcombo
                    });
                }
            });

            $scope.$watch('item.combosubsubkegiatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // medifirstService.get("perencanaan/get-data-combo?idsubsub="+$scope.item.combosubsubkegiatan.id).then(function (e) {
                    //     $scope.listMataAnggaranCombo = e.data.mataanggarancombo
                    // });

                    medifirstService.get("anggaran/get-mataanggaran-pindahrincian" 
                        + "?subsubkegiatan="+$scope.item.combosubsubkegiatan.idsubsubkegiatan
                        + "&tahun="+moment($scope.item.tahun).format('YYYY')
                        + "&tahap="+$scope.item.objecttahappemindahan.id)
                        .then(function (e) {
                            $scope.listMataAnggaranCombo = e.data
                        });
                }
            });

            $scope.PerubahanKeterangan = function () {
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Data belum di pilih')
                    return
                }

                var objSave = {
                    "details": $scope.arrayProdukTemp,
                    "idkegiatan": $scope.item.combosubsubkegiatanakhir.id,
                }
                //console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-perubahan-keterangan', objSave).then(function (e) {
                    $scope.popupPerubahan.center().close()
                    loadDataGrid();

                    $scope.arrayProdukTemp = []

                })

            }
            // #endregion

            
            // #region angkas
            var onDataBoundAngkas = function (e) {
                var kendoGrid = $("#kGridAngkas").data("kendoGrid");
                var rows = e.sender.element.find("tbody tr"); // get all rows
                for (let i = 0; i < rows.length; i++) {
                    // const element = rows[i];
                    var row = rows[i];
                    var subtotal = kendoGrid.dataItem(row).subtotal;
                    var totalbulanan = kendoGrid.dataItem(row).totalbulanan;
                    //console.log(status);
                    if (subtotal !=  totalbulanan) {
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
                        $(row.cells[15]).addClass("koneng");
                        $(row.cells[16]).addClass("koneng");
                    }
                }
            }

            function loadDataAngkas(){

                let pegawai = ''
                if ($scope.item.ispj == true) {
                    $scope.idpegawailogin = $scope.pegawaiLogin.id
                    pegawai = "&idpegawai=" + $scope.idpegawailogin
                }

                let subkegiatan = ""
                if($scope.item.combokegiatan){
                    subkegiatan = "&subkegiatan=" + $scope.item.combokegiatan.id
                }

                let subsubkegiatan = ""
                if($scope.item.combosubsubkegiatan){
                    subsubkegiatan = "&subsubkegiatan=" + $scope.item.combosubsubkegiatan.id
                }

                // jika ada sumberdana maka filter sumberdana
                let asalProdukAngkas = ''
                if($scope.item.searchAsalProdukAngkas !== undefined && $scope.item.searchAsalProdukAngkas !== null){
                    asalProdukAngkas = "&asalproduk=" + $scope.item.searchAsalProdukAngkas.id
                }

                medifirstService.get("anggaran/get-data-angkas" 
                    + "?tahun=" + moment($scope.item.tahunkas).format('YYYY') 
                    + "&tahap=" + $scope.item.searchtahapAngkas.id 
                    + pegawai
                    + subkegiatan 
                    + subsubkegiatan
                    + asalProdukAngkas)
                    .then(function (e) {

                        $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.alokasimataanggaran,
                            group: $scope.groupmataanggaran,
                        });

                        $scope.dataSearchSourceKeteranganBelanja = $scope.dataSourceKeteranganBelanja

                        $scope.dataSourceDetailKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.detailalokasimataanggaran
                    });

                })
            }

            $scope.$watch('item.combokegiatan', function (newValue, oldValue) {
                if($scope.item.combokegiatan){
                    medifirstService.get("anggaran/get-subsubkegiatan"
                        + "?subkegiatan=" +$scope.item.combokegiatan.id
                        + "&idpegawai=" + medifirstService.getPegawaiLogin().id)
                        .then(function (e) {
                            $scope.listSubSubKegiatanCombo = e.data
                        });

                }
            });

            $scope.$watch('item.searchKeteranganBelanja', function (newValue, oldValue) {
                if ($scope.item.searchKeteranganBelanja) {
                    // console.log($scope.dataSearchSourceKeteranganBelanja)
                    var data = []
                    for (let index = 0; index < $scope.dataSearchSourceKeteranganBelanja.options.data.length; index++) {
                        let element = $scope.dataSearchSourceKeteranganBelanja.options.data[index];
                        // console.log(element)
                        if (element.mataanggaran.toLowerCase().match(newValue.toLowerCase())) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                        data: data,
                        length: data.length
                    });
                }
            });

            $scope.findData = function () {                
                loadDataAngkas()
            }

            function alokasiBelanja(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                let totalAnggaran = 0;
                
                dataAlokasi2222 =[]
                for (let x = 0; x < $scope.dataSourceDetailKeteranganBelanja.options.data.length; x++) {
                    var el = $scope.dataSourceDetailKeteranganBelanja.options.data[x]
                    
                    // jika mata anggaran dan kegiatan sama
                    if (el.kodemataanggaran == dataItem.kodemataanggaran && el.kodesubsubkegiatan == dataItem.kodesubsubkegiatan) {
                        el.subtotalRP = formatRupiah(el.subtotal, "Rp. ")
                     
                        totalAnggaran = totalAnggaran + parseFloat(el.subtotal)
                
                        dataAlokasi2222.push({
                            "norec": el.norec,
                            "kdprofile":el.kdprofile,
                            "statusenabled":el.statusenabled,
                            "objectkegiatanfk":el.idsubsubkegiatan,
                            "objectmataanggaranfk":el.idmataanggaran,
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
                            "kode": el.kodesubsubkegiatan,
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
                            "islockangkas": dataItem.islockangkas
                        })
                    }
                }
                
                $scope.dataSourceAlokasiAnggaran = new kendo.data.DataSource({
                    data:  dataAlokasi2222,
                    length: dataAlokasi2222.length
                });

                
                $scope.item.thnAnggaran = dataItem.tahun
                $scope.item.tahap = dataItem.tahap
                $scope.item.subKegiatan = dataItem.kodesubkegiatan+' - '+dataItem.keterangansubkegiatan
                $scope.item.subSubKegiatan = dataItem.kode+' - '+dataItem.keterangan
                $scope.item.mataanggaran = dataItem.mataanggaran
                $scope.totalanggaranperalokasi = totalAnggaran
                $scope.item.totalanggaran = formatRupiah(totalAnggaran, "Rp. ")
                $scope.item.totalbulanan = formatRupiah(dataItem.totalbulanan, "Rp. ")
                $scope.kodemataanggaranalokasi = dataItem.kodemataanggaran
                
                let selisih = 0
                selisih = totalAnggaran - dataItem.totalbulanan
                $scope.item.selisihanggaran = formatRupiah(selisih, "Rp. ")

                $scope.popupAlokasiKeteranganBelanja.center().open();
            }

            function DetailAlokasi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if(dataItem.islockangkas == true){
                    toastr.error('Angkas Sudah Dilock')
                    return
                }

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

            $scope.BagiRata = function(){
                let SubTotal = 0
                let datdatdatdad = []
                for (let index = 0; index < dataAlokasi2222.length; index++) {
                    let element = dataAlokasi2222[index];
                    // SubTotal = parseFloat(element.subtotal) / 12
                    // dataAlokasi2222[index].jan = SubTotal
                    // dataAlokasi2222[index].feb = SubTotal
                    // dataAlokasi2222[index].mar = SubTotal
                    // dataAlokasi2222[index].apr = SubTotal
                    // dataAlokasi2222[index].mei = SubTotal
                    // dataAlokasi2222[index].jun = SubTotal
                    // dataAlokasi2222[index].jul = SubTotal
                    // dataAlokasi2222[index].agt = SubTotal
                    // dataAlokasi2222[index].sep = SubTotal
                    // dataAlokasi2222[index].okt = SubTotal
                    // dataAlokasi2222[index].nov = SubTotal
                    // dataAlokasi2222[index].des = SubTotal

                    if(parseFloat(element.subtotal) % 12 == 0){
                        let blnrata = parseFloat(element.subtotal)/12
    
                        blnrata = blnrata.toFixed(2)
    
                        dataAlokasi2222[index].jan = blnrata
                        dataAlokasi2222[index].feb = blnrata
                        dataAlokasi2222[index].mar = blnrata
                        dataAlokasi2222[index].apr = blnrata
                        dataAlokasi2222[index].mei = blnrata
                        dataAlokasi2222[index].jun = blnrata
                        dataAlokasi2222[index].jul = blnrata
                        dataAlokasi2222[index].agt = blnrata
                        dataAlokasi2222[index].sep = blnrata
                        dataAlokasi2222[index].okt = blnrata
                        dataAlokasi2222[index].nov = blnrata
                        dataAlokasi2222[index].des = blnrata
    
                    } else{
    
                        let blnrata = parseFloat(element.subtotal)/12
    
                        blnrata = Math.floor(blnrata)
    
                        dataAlokasi2222[index].jan = blnrata
                        dataAlokasi2222[index].feb = blnrata
                        dataAlokasi2222[index].mar = blnrata
                        dataAlokasi2222[index].apr = blnrata
                        dataAlokasi2222[index].mei = blnrata
                        dataAlokasi2222[index].jun = blnrata
                        dataAlokasi2222[index].jul = blnrata
                        dataAlokasi2222[index].agt = blnrata
                        dataAlokasi2222[index].sep = blnrata
                        dataAlokasi2222[index].okt = blnrata
                        dataAlokasi2222[index].nov = blnrata
                        dataAlokasi2222[index].des = (parseFloat(element.subtotal) - (11*blnrata)).toFixed(0)
                    }
                }
                $scope.dataSourceAlokasiAnggaran = new kendo.data.DataSource({
                    data:  dataAlokasi2222
                });
            }

            $scope.SimpanPopUpAlokasi = function() {
                
                // check jika angkas sudah dilock
                let isLockAngkas = dataAlokasi2222.every(function(item){
                    return item.islockangkas == true
                })

                if(isLockAngkas){
                    toastr.error('Angkas sudah dilock')
                    return
                }

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
                    //LoadTotalKeterangan();
                    $scope.findData();
    
                        var idpegawai = ''
                        $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                        //console.log($scope.pegawaiLogin)
                        // console.log($scope.item.ispj)
                        medifirstService.get('anggaran/pj-rba?id=' + medifirstService.getPegawaiLogin().id).then(function (data) {
                            $scope.item.ispj = data.data[0].ispj
                            if ($scope.item.ispj == true) {
                                idpegawai = $scope.pegawaiLogin.id
                            }

                            var subkegiatan = '';
                            var subsubkegiatan = '';
                            if ($scope.item.combokegiatan != undefined) {
                                subkegiatan = '&subkegiatan=' + $scope.item.combokegiatan.kode
                            }
                            if ($scope.item.combosubsubkegiatan != undefined) {
                                subsubkegiatan = '&subsubkegiatan=' + $scope.item.combosubsubkegiatan.kode
                            }

                            medifirstService.get("perencanaan/get-total-mata-anggaran?tahun=" + moment($scope.item.thnAnggaran).format('YYYY') + "&tahap=" + $scope.item.tahapdetail.id + "&idpegawai=" + idpegawai + "&mataanggaran=" + $scope.kodemataanggaranalokasi + "&noreckegiatan=" + $scope.idkegiatananggaran + subkegiatan + subsubkegiatan).then(function (e) {

                                $scope.item.totalbulanan = formatRupiah(e.data.alokasimataanggaran[0].totalbulanan, "Rp. ")
                                let selisih = 0
                                selisih = $scope.totalanggaranperalokasi - e.data.alokasimataanggaran[0].totalbulanan
                                $scope.item.selisihanggaran = formatRupiah(selisih, "Rp. ")

                            })
                            $scope.popupAlokasiKeteranganBelanja.center().close()
                        })

                        
                }, function (error) {

                })
            }

            $scope.bagiarataAlokasiDetail = function() {
                let totalAnggaran = parseFloat($scope.item.alokasiSubtotal)
                

                if(totalAnggaran % 12 == 0){
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

                } else{

                    let blnrata = totalAnggaran/12

                    blnrata = Math.floor(blnrata)

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
                    $scope.item.bln12 = (totalAnggaran - (11*blnrata)).toFixed(0)
                }

                
            }

            function watchBulan(newValue){
                let totalAlokasi = $scope.item.alokasiSubtotal
                let bln1 = 0
                if($scope.item.bln1 != undefined){
                    bln1 = $scope.item.bln1
                }
                let bln2 = 0
                if($scope.item.bln2 != undefined){
                    bln2 = $scope.item.bln2
                }
                let bln3 = 0
                if($scope.item.bln3 != undefined){
                    bln3 = $scope.item.bln3
                }
                let bln4 = 0
                if($scope.item.bln4 != undefined){
                    bln4 = $scope.item.bln4
                }
                let bln5 = 0
                if($scope.item.bln5 != undefined){
                    bln5 = $scope.item.bln5
                }
                let bln6 = 0
                if($scope.item.bln6 != undefined){
                    bln6 = $scope.item.bln6
                }
                let bln7 = 0
                if($scope.item.bln7 != undefined){
                    bln7 = $scope.item.bln7
                }
                let bln8 = 0
                if($scope.item.bln8 != undefined){
                    bln8 = $scope.item.bln8
                }
                let bln9 = 0
                if($scope.item.bln9 != undefined){
                    bln9 = $scope.item.bln9
                }
                let bln10 = 0
                if($scope.item.bln10 != undefined){
                    bln10 = $scope.item.bln10
                }
                let bln11 = 0
                if($scope.item.bln11 != undefined){
                    bln11 = $scope.item.bln11
                }
                // let bln12 = 0
                // if($scope.item.bln12 != undefined){
                //     bln12 = $scope.item.bln12
                // }
                $scope.item.totalBulanAlokasiDetail = parseFloat(bln1) + 
                parseFloat(bln2) +
                    parseFloat(bln3) +
                        parseFloat(bln4) +
                            parseFloat(bln5) +
                                parseFloat(bln6) +
                                    parseFloat(bln7) +
                                        parseFloat(bln8) +
                                            parseFloat(bln9) +
                                                parseFloat(bln10) +
                                                    parseFloat(bln11) 
                                                    // +
                                                        // parseFloat(bln12)
                $scope.item.totalBulanAlokasiDetail = $scope.item.totalBulanAlokasiDetail.toFixed(2)
                $scope.item.kurangAlokasiDetail = totalAlokasi - parseFloat($scope.item.totalBulanAlokasiDetail)
                $scope.item.kurangAlokasiDetail = $scope.item.kurangAlokasiDetail.toFixed(2)
                $scope.item.bln12 = parseFloat(bln1) +
                    parseFloat(bln2) +
                    parseFloat(bln3) +
                    parseFloat(bln4) +
                    parseFloat(bln5) +
                    parseFloat(bln6) +
                    parseFloat(bln7) +
                    parseFloat(bln8) +
                    parseFloat(bln9) +
                    parseFloat(bln10) +
                    parseFloat(bln11) 
                $scope.item.bln12 = totalAlokasi - parseFloat($scope.item.totalBulanAlokasiDetail)
                $scope.item.bln12 = $scope.item.bln12.toFixed(2)

                $scope.item.totalJanDes = parseFloat(bln1) +
                    parseFloat(bln2) +
                    parseFloat(bln3) +
                    parseFloat(bln4) +
                    parseFloat(bln5) +
                    parseFloat(bln6) +
                    parseFloat(bln7) +
                    parseFloat(bln8) +
                    parseFloat(bln9) +
                    parseFloat(bln10) +
                    parseFloat(bln11) + parseFloat($scope.item.bln12)
            }

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
            // $scope.$watch('item.bln12', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
            //         // watchBulan(newValue)
            //         if($scope.item.bln12 < 0){
            //             console.log('kurang lurrr');
            //             $scope.item.bln12.classList.add('koneng');
            //         }
            //     }
            // });

            $scope.SimpanPopUpDetailAlokasi = function() {
                if ($scope.item.bln12 < 0) {
                    toastr.error('Tidak boleh kurang dari 0')
                    return
                }
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
            // #endregion


            $scope.SimpanPopUpTambah = function(){
                // var jmlkode = $scope.item.kodeAdd.length
                // var divS = 0;
                // if(jmlkode == 7){
                //     divS = 1
                // }else 
                // if(jmlkode == 12){
                //     divS = 2
                // }else if(jmlkode == 15){
                //     divS = 3
                // }else if(jmlkode > 15){
                //     divS = 4
                // }
                var tahuns = null
                if($scope.item.tahuntambahkegiatan != undefined){
                    tahuns = moment($scope.item.tahuntambahkegiatan).format('YYYY')
                }
                // var jenisbelanja = null
                // if($scope.item.jenisbelanjatambah != undefined){
                //     jenisbelanja = $scope.item.jenisbelanjatambah.id
                // }
                var objSave =
                    {
                        norec: '',
                        objectkegiatanfk: $scope.item.div.id,
                        tahun: tahuns,

                        objectpptkfk: $scope.item.pptktambah.value,
                        objecttahapfk: $scope.item.tahaptambah.id,
                        objectjenisbelanjafk: $scope.item.jenisbelanjatambah.id,
                        // kodeexternal: null,
                        // namaexternal: null,
                        // reportdisplay: null,
                        // tahun: tahuns,
                        // tahap: $scope.item.tahaptambah!= undefined ? $scope.item.tahaptambah.id : null,
                        // indikatormasuk: null,
                        // indikatorkeluaran: null,
                        // indikatorhasil: null,
                        // targetmasuk: null,
                        // targetkeluaran: null,
                        // targethasil: null,
                        // div: $scope.item.div.id,
                        // pptk: $scope.item.pptktambah != undefined ? $scope.item.pptktambah.value : null,
                        // jenisbelanja: jenisbelanja
                    }
                medifirstService.post('anggaran/save-entry-rbav2', objSave).then(function (e) {
                    var div = ''
                    if($scope.item.searchdivkeg != undefined){
                        div = $scope.item.searchdivkeg.id
                    }

                    // var thn = ''
                    // if($scope.item.tahun != undefined){
                    //     thn = moment($scope.item.tahun).format('YYYY')
                    // }

                    // var thp = ''
                    // if($scope.item.searchtahapkeg != undefined){
                    //     thp = $scope.item.searchtahapkeg.id
                    // }

                    // medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                    medifirstService.get("anggaran/get-daftar-master-kegiatanRBA?div=" + div).then(function (e) {
                        DataKegiatan = e.data.kegiatan
                        for (let i = 0; i < DataKegiatan.length; i++) {
                            DataKegiatan[i].statCheckbox = false
                        }
                        $scope.dataSourceKegiatan = e.data.kegiatan
                    })
                    // $scope.item.searchdivkeg = { id: 4, div: "Sub Sub Kegiatan" }
                    $scope.popupTambah.center().close()
                })
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
                        // kodeexternal: null,
                        // namaexternal: null,
                        // reportdisplay: null,
                        // tahun: null,
                        // tahap: null,
                        // indikatormasuk: null,
                        // indikatorkeluaran: null,
                        // indikatorhasil: null,
                        // targetmasuk: null,
                        // targetkeluaran: null,
                        // targethasil: null,
                        div: $scope.item.programdiv.id
                    }
                medifirstService.post('anggaran/save-kegiatan-anggaran', objSave).then(function (e) {
                    var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupProgram.center().close()
                }, function (error) {

                })
            }

            $scope.HapusPopUpProgram = function(){
                var objSave =
                    {
                        id: $scope.item.id,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-kegiatan-anggaran', objSave).then(function (e) {
                        var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupProgram.center().close()
                    }, function (error) {
    
                    })
                })

                
            }

            $scope.SimpanPopUpUrusan = function(){
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
                        kode: $scope.item.kode,
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
                        div: $scope.item.urusandiv.id
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupUrusan.center().close()
                }, function (error) {

                })
            }

            $scope.HapusPopUpUrusan = function(){
                var objSave =
                    {
                        id: $scope.item.id,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-kegiatan-anggaran', objSave).then(function (e) {
                        var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupUrusan.center().close()
                    }, function (error) {
    
                    })
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
                        div: $scope.item.detaildiv.id
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupKegiatan.center().close()
                }, function (error) {

                })
            }

            $scope.HapusPopUpKegiatan = function(){
                var objSave =
                    {
                        id: $scope.item.id,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-kegiatan-anggaran', objSave).then(function (e) {
                        var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupKegiatan.center().close()
                    }, function (error) {
    
                    })
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
                        div: $scope.item.subkegiatandiv.id
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupSubKegiatan.center().close()
                }, function (error) {

                })
            }

            $scope.HapusPopUpSubKegiatan = function(){
                var objSave =
                    {
                        id: $scope.item.id,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-kegiatan-anggaran', objSave).then(function (e) {
                        var div = ''
                        if($scope.item.searchdivkeg != undefined){
                            div = $scope.item.searchdivkeg.id
                        }

                        var thn = ''
                        if($scope.item.tahun != undefined){
                            thn = moment($scope.item.tahun).format('YYYY')
                        }

                        var thp = ''
                        if($scope.item.searchtahapkeg != undefined){
                            thp = $scope.item.searchtahapkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun="+thn+"&idpegawai=" + $scope.idpegawailogin + "&tahapaktif=" + thp + "&div=" + div).then(function (e) {
                            DataKegiatan = e.data.kegiatan
                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupSubKegiatan.center().close()
                    }, function (error) {
    
                    })
                })

                
            }

            $scope.columnKegiatan = {
				toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_1"><button ng-hide="disidpegawai" ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    }, 
                    {
                        name: "add",
                        text: "Hapus yang dicentang",
                        template: '<div class="grid_2"><button ng-hide="disidpegawai" ng-click="hapusCentang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Hapus yang dicentang</button></div>'
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
                           click: editKegiatanT,
                           imageClass: "clinic fa"
                        },
                    ],
                       title: "",
                       width: "130px",
                },
                {
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow($event)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow($event)' />" +
                        "# } #",
                    width: "30px"
                },
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "30px"
                // },
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
                    "title": "Tahap Anggaran",
                    "width": "100px"
                },
                {
                    "field": "tahun",
                    "title": "Tahun Anggaran",
                    "width": "100px"
                },
                {
                    "field": "targetkinerja",
                    "title": "Target Kinerja",
                    "width": "150px"
                },
                {
                    "field": "namadiv",
                    "title": "Div",
                    "width": "200px"
                },
                {
                    "command": [
                          {
                             text: "Delete",
                             click: deleteKegiatanT,
                             imageClass: "clinic fa",
                          },
                      ],
                         title: "",
                         width: "100px",
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
            
            $scope.columnPPTK = {
                columns:[
                {
                    "field": "no",
                    "title": "No",
                },
                {
                    "field": "kode",
                    "title": "Kode Sub Sub Kegiatan",
                },
                {
                    "field": "keterangan",
                    "title": "Nama Sub Sub Kegiatan",
                },
                {
                    "field": "namalengkap",
                    "title": "PPTK",
                }
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
                dataBound: onDataBoundAngkas,
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
                        "title": "Rekening",
                        "width": "100px",
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
                        "width": "40px",
                    },
                    {
                        "field": "feb",
                        "title": "Feb",
                        "width": "40px",
                    },
                    {
                        "field": "mar",
                        "title": "Mar",
                        "width": "40px",
                    },
                    {
                        "field": "apr",
                        "title": "Apr",
                        "width": "40px",
                    },
                    {
                        "field": "mei",
                        "title": "Mei",
                        "width": "40px",
                    },
                    {
                        "field": "jun",
                        "title": "Juni",
                        "width": "40px",
                    },
                    {
                        "field": "jul",
                        "title": "Juli",
                        "width": "40px",
                    },
                    {
                        "field": "agt",
                        "title": "Agst",
                        "width": "40px",
                    },
                    {
                        "field": "sep",
                        "title": "Sep",
                        "width": "40px",
                    },
                    {
                        "field": "okt",
                        "title": "Okt",
                        "width": "40px",
                    },
                    {
                        "field": "nov",
                        "title": "Nov",
                        "width": "40px",
                    },
                    {
                        "field": "des",
                        "title": "Des",
                        "width": "40px",
                    },
                    {
                        "field": "totalbulanan",
                        "title": "Total Bulanan",
                        "width": "40px",
                        "template": "<span class='style-right'>{{formatRupiah2('#: totalbulanan #', '')}}</span>",
                    },
                    // {
                    //     "command": [{
                    //         text: "Hapus",
                    //         click: HapusAnggaranKas,
                            
                    //     }, ],
                    //     title: "",
                    //     width: "40px",
                    // },
                ]
            };
            
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
                        template: '<div class="grid_2"><button ng-click="hapusCentang2()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Hapus yang dicentang</button></div>'
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
                                 click: editDetailMT,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "100px",
                    },
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow2()' />",
                        template: "# if (statCheckbox2) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' />" +
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
                        "field": "jml",
                        "title": "Jml",
                        "width": "140px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "150px"
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
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "200px"
                    },
                    {
                        "field": "jumlahspj",
                        "title": "Jumlah SPJ",
                        "width": "150px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jumlahspj #', '')}}</span>",
                    },
                    {
                        command: [{
                            text: "Hapus",
                            click: HapusRincianKas
                        }],
                        title: "",
                        width: "100px",
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
            };
            
            $scope.formatRupiah2 = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
            
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
            
            $scope.getDataPegawai = function(data){
                medifirstService.get('get-nip-pns?id='+ data).then(function(dat){
                    console.log(dat);
                    $scope.item.namapihakketiga = $scope.item.pegawaipihakketiga.text
                    $scope.item.npwp = dat.data.nippns
                })
            }

            /////////////////////////////////////////////////////////////////////
        }
    ]);
});