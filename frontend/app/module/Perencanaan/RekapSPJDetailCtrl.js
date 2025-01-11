define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';   
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RekapSPJDetailCtrl', ['$scope', 'CacheHelper', '$state', '$mdDialog','MedifirstService',
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
            var DataMataAnggaranCombo= [];
            var DataTotalMataAnggaran = [];
            var DataKeteranganBelanja = [];
            var DataTabKeteranganBelanja = [];
            var dataAlokasi2222 = []
            var DataSPJ = []
            var DataDetailSPJ = []
            var DataDetailSPJALL = []
            var ListSubKegiatan = []
            var ListSubSubKegiatanspj = []
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

                    medifirstService.get("perencanaan/get-data-combo?&idpegawai=" + idpegawai).then(function (e) {
                        $scope.listJenisBelanja = e.data.jenisbelanja
                        $scope.listJenisAnggaran = e.data.jenisanggaran
                        $scope.listDirektur = e.data.direktur
                        $scope.listTahap = e.data.tahap
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.listKonsolidasi2 = e.data.konsolidasi2
                        $scope.listKegiatanCombo = e.data.kegiatancombo
                        $scope.listKegiatanComboakhir = e.data.kegiatancombo
                        $scope.dataSourcePermenKelima = e.data.konsolidasikelima
                        $scope.dataSourcePermenKeempat = e.data.konsolidasikeempat
                        $scope.listMataAnggaran = e.data.mataanggarancombodiv

                        // get subsubkegiatan
                        medifirstService.get("anggaran/get-subsubkegiatan?&idpegawai=" + idpegawai).then(function (res) {

                            $scope.listSubSubKegiatanspj = res.data

                        })

                    });
                })
                
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            

            loadDataGrid();
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                $scope.item.statusspj = [{ id: 0, status: "Semua" }]
                var idpegawai = '';
                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                medifirstService.get('anggaran/pj-rba?id=' + medifirstService.getPegawaiLogin().id).then(function (data) {
                    $scope.item.ispj = data.data[0].ispj
                    if ($scope.item.ispj == true) {
                        console.log('testttt');
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
                    cacheLoad()
                    LoadSPJ()

                    var thn = moment($scope.now).format('YYYY')
                    var tglsppawal = ""
                    var tglsppakhir = ""
                    if ($scope.item.tglSPPawalSearch != undefined && $scope.item.tglSPPakhirSearch != undefined) {
                        tglsppawal = "&tglsppawal=" + moment($scope.item.tglSPPawalSearch).format('YYYY-MM-DD')
                        tglsppakhir = "&tglsppakhir=" + moment($scope.item.tglSPPakhirSearch).format('YYYY-MM-DD')
                        thn = moment($scope.item.tglSPPawalSearch).format('YYYY')
                    }
                    if ($scope.item.tahunawal != undefined) {
                        thn = moment($scope.item.tahunawal).format('YYYY')
                    }
                    medifirstService.get("perencanaan/get-data-combo?tahun=" + thn + "&idpegawai=" + idpegawai + tglsppawal + tglsppakhir).then(function (e) {
                        
                        $scope.isRouteLoading = false
                        $scope.dataSourceSPP = e.data.spp
                        $scope.dataSourceCariSPM = e.data.carispm

                        $scope.dataSourceSetting = e.data.setting
                        $scope.listSubSubKegiatanAngkas = e.data.subsubkegiatanangkas
                        // $scope.dataSourceDetailMT = e.data.mataanggaran
                        DataMataAnggaran = e.data.mataanggaran
                        DataMataAnggaranCombo = e.data.mataanggarancombo
                        $scope.dataSourceMataAnggaran = e.data.mataanggaran
                        $scope.dataSourceMataAnggaranPermen = new kendo.data.DataSource({
                            data: e.data.mataanggaranpermen,
                            pageSize: 15,
                            total: e.data.mataanggaranpermen.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });
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
                        if ($scope.item.tahun == null) {
                            $scope.item.tahun = e.data.setting[0].tahunanggaran
                        }
                        if ($scope.item.tahunkas == null) {
                            $scope.item.tahunkas = e.data.setting[0].tahunanggaran
                        }
                        $scope.item.objectkepalabludfk = {
                            id: e.data.setting[0].objectkepalabludfk,
                            namalengkap: e.data.setting[0].namalengkap
                        }
                        $scope.item.objecttahapaktivfk = {
                            id: e.data.setting[0].objecttahapaktivfk,
                            tahap: e.data.setting[0].tahap
                        }
                        $scope.item.searchtahap = {
                            id: e.data.setting[0].objecttahapaktivfk,
                            tahap: e.data.setting[0].tahap
                        }
                        if ($scope.item.searchtahapkeg == undefined) {
                            $scope.item.searchtahapkeg = {
                                id: e.data.setting[0].objecttahapaktivfk,
                                tahap: e.data.setting[0].tahap
                            }
                        }
                        $scope.item.nomornpwp = e.data.setting[0].nomornpwp

                        $scope.idtahap = e.data.setting[0].objecttahapaktivfk

                        var div = ''
                        if ($scope.item.searchdivkeg != undefined) {
                            div = $scope.item.searchdivkeg.id
                        }

                        medifirstService.get("perencanaan/get-data-combo?tahun=" + moment($scope.item.tahun).format('YYYY') + "&idpegawai=" + idpegawai + "&tahapaktif=" + $scope.item.searchtahapkeg.id + "&div=" + div + "&lockdiv=true").then(function (e) {
                            
                            
                            DataKegiatan = e.data.kegiatan

                            defaultspj = e.data.bendahara[0]

                            //console.log(defaultspj)

                            for (let i = 0; i < DataKegiatan.length; i++) {
                                DataKegiatan[i].statCheckbox = false
                            }
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })

                        var kegiatanGrid = $("#kegGrid").data("kendoGrid"); // get the grid widget
                        console.log($scope.idpegawailogin)
                        console.log(kegiatanGrid)
                        if ($scope.idpegawailogin != '' && kegiatanGrid != null) {
                            console.log('kehide');
                            kegiatanGrid.hideColumn(7);
                            kegiatanGrid.hideColumn(9);
                        }

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
                    

                })
                
                
            }


            $scope.$watch('item.subKegiatanSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo" 
                            + "?tahunawal="+e.data.setting[0].tahunanggaran 
                            + "&tahap="+e.data.setting[0].objecttahapaktivfk 
                            + "&subkegiatan="+$scope.item.subKegiatanSPJ.id
                            + "&idpegawai=" + medifirstService.getPegawaiLogin().id).then(function (e) {
                            $scope.listSubSubKegiatanSPJ = e.data.kegiatansubsub
                        });
                    })
                }
            });

            $scope.$watch('item.subSubKegiatanSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?idsubsub="+$scope.item.subSubKegiatanSPJ.id).then(function (e) {
                        $scope.listMataAnggaranSPJ = e.data.mataanggarancombo
                    });
                }
            });

            $scope.handleSumberDana = function () {
                // $scope.dataVOloaded = true

                if($scope.item.subSubKegiatanSPJ == undefined || $scope.item.subSubKegiatanSPJ == null){
                    toastr.error('Pilih sub sub kegiatan terlebih dahulu')
                    return
                }

                if($scope.item.mataAnggaranSPJ == undefined || $scope.item.mataAnggaranSPJ == null){
                    toastr.error('Pilih rekening terlebih dahulu')
                    return
                }

                if($scope.item.sumberDanaSPJ == undefined || $scope.item.sumberDanaSPJ == null){
                    toastr.error('Pilih rekening terlebih dahulu')
                    return
                }

                medifirstService.get("perencanaan/get-total-sisa-anggaran" 
                    + "?kegiatan=" + $scope.item.subSubKegiatanSPJ.id
                    + "&mataanggaran=" + $scope.item.mataAnggaranSPJ.id
                    + "&sumberdana=" + $scope.item.sumberDanaSPJ.id)
                    .then(function (e) {
                        // $scope.dataVOloaded = false

                        $scope.item.sisaAnggaranSPJ = e.data
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

            $scope.CariSPJ = function () {
                $scope.isRouteLoading = true
                LoadSPJ()
            }
            
            
            $scope.$watch('item.searchSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataSPJ.length; index++) {
                        let element = DataSPJ[index];
                        if (element.mataanggaran.match($scope.item.searchSPJ) && element.mataanggaran != null) {
                            data.push(element)
                        } else if (element.norealisasi.match($scope.item.searchSPJ) && element.norealisasi != null) {
                            data.push(element)
                        } else if (element.totalbelanja.match($scope.item.searchSPJ) && element.totalbelanja != null) {
                            data.push(element)
                        }
                            console.log(element.pihakketiga);
                    }
                    $scope.dataSourceSPJ = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            
            function cacheLoad(){
                var chaceSPJ = cacheHelper.get('SPJ')
                // console.log(chaceSPJ);
                if (chaceSPJ != undefined) {
                    $scope.item.statusspj = chaceSPJ[0]
                }
            }
            function LoadSPJ(){
                $scope.isRouteLoading = true

                // var chace = cacheHelper.get('KelompokAnggaranCtrl');
                // console.log(chace)
                // if (chace != undefined) {
                //     var tglawal = moment(chace[0]).format('YYYY-MM-DD');
                //     var tglakhir = moment(chace[1]).format('YYYY-MM-DD');
                // } else{
                //     var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                //     var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // }

                var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');

                var stat=''
                if($scope.item.statusspj != undefined){
                    stat = $scope.item.statusspj.id
                }

                var sub = ''
                if ($scope.item.kegiatansubsubspj != undefined) { 
                    sub = $scope.item.kegiatansubsubspj.id
                }

                var asalproduk = ''
                if ($scope.item.asalproduk != undefined) { 
                    asalproduk = $scope.item.asalproduk.id
                }

                let mataanggaran = ""
                if($scope.item.mataanggaran !== undefined && $scope.item.mataanggaran !== null){
                    mataanggaran = "&mataanggaran=" + $scope.item.mataanggaran.id
                }

                let cari = ""
                if($scope.item.carispj !== undefined && $scope.item.carispj !== null){
                    cari = "&cari=" + $scope.item.carispj
                }
                
                medifirstService.get("anggaran/get-spj?tglAwal=" + tglawal
                    + "&tglAkhir=" + tglakhir
                    + "&status=" + stat
                    + "&subsubkegiatan=" + sub
                    + "&asalproduk=" + asalproduk
                    + mataanggaran
                    + cari
                ).then(function (e) {
                    DataSPJ = e.data.data
                    DataDetailSPJALL = e.data.detail
                    $scope.dataSourceSPJ = new kendo.data.DataSource({
                        data: DataSPJ,
                        // group: $scope.groupmataanggaran,
                    });
                    var arr = {
                        0: $scope.item.statusspj
                    }
                    cacheHelper.set('SPJ', arr)
                $scope.isRouteLoading = false

                })
            }
    
            $scope.klikSPJ = function (dataSPJSelected) {
                //console.log(dataSPJSelected);
            }
            var onDataBound = function (e) {
                var kendoGrid = $("#kGridsSPJ").data("kendoGrid"); // get the grid widget
                if($scope.idpegawailogin != ''){
                    kendoGrid.hideColumn(1);
                }
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
                        $(row.cells[0]).addClass("green");
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
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanRekapDetailSPJ.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:J1", "A2:J2"];
                    sheet.name = "SPJ";
                
                    var myHeaders = [{
                        value: "LAPORAN REKAP DETAIL SPJ",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    
                    var selectedSubKegiatan = $scope.item.kegiatansubsubspj ? $scope.item.kegiatansubsubspj.keterangansubsubkegiatan || "" : "";
                    var kodesubsubkegiatan = $scope.item.kegiatansubsubspj.kodesubsubkegiatan || "";

                    function extractNamaKegiatan(kegiatan) {
                        var parts = kegiatan.split('-');
                        if (parts.length > 1) {
                            var nama = parts.slice(-1).join(' ').trim();
                            return nama ? nama : "Sub Kegiatan tidak tersedia";
                        }
                        return "Sub Kegiatan tidak tersedia";
                    }
                
                    var namaKegiatan = extractNamaKegiatan(selectedSubKegiatan);
                
                    var subKegiatanValue = "Rekening: " + kodesubsubkegiatan + " | Sub Kegiatan: " + namaKegiatan;
                
                    var subKegiatanHeader = [{
                        value: subKegiatanValue,
                        fontSize: 16,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                    sheet.rows.splice(1, 0, { cells: subKegiatanHeader, type: "header", height: 50 });
                },                
                   
                selectable: 'row',
                scrollable: true,
                pageable: true,
                columns: [
                
                    {
                        "field": "tglrealisasi",
                        "title": "Tgl SPJ",
                        "width": "100px",
                    },
                    {
                        "field": "mataanggaran",
                        "title": "Kode Rekening",
                        "width": "200px",
                    },
                    {
                        "field": "kegiatan",
                        "title": "Kegiatan",
                        "width": "200px",
                        hidden: true
                    },
                    {
                        "field": "norealisasi",
                        "title": "No SPJ",
                        "width": "100px",
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        "field": "deskripsi",
                        "title": "Dasar Kontraktual",
                        "width": "100px",
                        hidden: true
                    },
                    {
                        "field": "totalbelanja",
                        "title": "Total Belanja",
                        "width": "130px",
                    },
                    {
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "200px",
                    },
                    {
                        "field": "pph",
                        "title": "PPh",
                        "width": "70px",
                    },
                    {
                        "field": "ppn",
                        "title": "PPN",
                        "width": "70px",
                    },
                    {
                        "field": "penerima",
                        "title": "Penerima",
                        "width": "200px",
                    },
                    {
                        "field": "pihakketiga",
                        "title": "Nama Pihak Ketiga",
                        "width": "150px",
                    },
                    // {
                    //     "field": "keterangan",
                    //     "title": "Keterangan",
                    //     "width": "200px",
                    //     //hidden: true
                    // },
                    {
                        "field": "status",
                        "title": "Verifikasi",
                        "width": "200px",
                        //hidden: true
                    },
                    // Tambahkan kolom baru di grid untuk "Sub Kegiatan"
                    // {
                    //     "field": "subKegiatan",
                    //     "title": "Sub Kegiatan",
                    //     "width": "150px",
                    // }
                ]
            };
            
            
            $scope.formatRupiah2 = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
            
            
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            
            $scope.getDataPegawai = function(data){
                medifirstService.get('get-nip-pns?id='+ data).then(function(dat){
                    console.log(dat);
                    $scope.item.namapihakketiga = $scope.item.pegawaipihakketiga.text
                    $scope.item.npwp = dat.data.nippns
                })
            }
        }
    ]);
});