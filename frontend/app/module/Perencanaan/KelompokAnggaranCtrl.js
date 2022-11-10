define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('KelompokAnggaranCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
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
            $scope.norecpengembalian = ''
            $scope.pengembalianawal = 0
            $scope.konsolidasi = false;
            $scope.diskonsolidasi5 = true
            var DataKegiatan= [];
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
            var ListSubSubKegiatan = []
            var ListMataAnggaran = []
            var buttonhide = true
            $scope.dispanjar = false
            $scope.norecspj = ''
            $scope.hidespj = true
            $scope.hidekeuangan = true
            $scope.subsubketerangan = ''
            $scope.spjaja = false
            $scope.sppaja = false
            $scope.spmaja = false
            $scope.panjaraja = false
            $scope.semuaanggaran = false
            $scope.disidpegawai = false
            $scope.dispptkspj = false
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
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglVerifSPJ = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglPanjar = moment($scope.now).format('YYYY-MM-DD');
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

            $scope.listDiv = [
                { id: 0, div: "Urusan Pemerintahan" },
                { id: 1, div: "Program" },
                { id: 2, div: "Kegiatan" },
                { id: 3, div: "Sub Kegiatan" },
                { id: 4, div: "Sub Sub Kegiatan" },
            ];

            $scope.listDivKonsolidasi = [
                { id: 1, div: "Div: 1" },
                { id: 2, div: "Div: 2" },
                { id: 3, div: "Div: 3" },
                { id: 4, div: "Div: 4" },
            ];

            $scope.listTahapKegiatan = [
                { id: 100, tahap: "Semua Kegiatan" },
                { id: 1, tahap: "Indikatif Murni ~ 4" },
                { id: 2, tahap: "Murni Definitif ~ 0" },
                { id: 3, tahap: "Pergeseran APBD ~ 2" },
                { id: 4, tahap: "Pergeseran APBD ~ 5" },
                { id: 5, tahap: "Pegeseran BLUD ~ 3" },
                { id: 6, tahap: "Perubahan APBD ~ 1" },
            ];

            medifirstService.get("perencanaan/get-data-combo-pajak").then(function (e) {
                $scope.listJenisPajak = e.data.data
            })

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listJenisBelanja = e.data.jenisbelanja
                $scope.listJenisAnggaran = e.data.jenisanggaran
                $scope.listDirektur = e.data.direktur
                $scope.listTahap = e.data.tahap
                $scope.listAsalProduk = e.data.asalproduk
                $scope.listKonsolidasi2 = e.data.konsolidasi2
                //$scope.listSubSubKegiatan = e.data.kegiatansubsub
                $scope.listKegiatanCombo = e.data.kegiatancombo
                $scope.listKegiatanComboakhir = e.data.kegiatancombo
                $scope.dataSourcePanjarPengembalian = e.data.panjar
                $scope.dataSourceSPP = e.data.spp
                $scope.dataSourceCariSPM = e.data.carispm
                $scope.dataSourceSPD = e.data.spd
                $scope.listKonsolidasi5 = e.data.konsolidasi5
                $scope.listKonsolidasi4 = e.data.konsolidasi4
                $scope.listKonsolidasi3 = e.data.konso3
                $scope.dataSourcePermenKelima = e.data.konsolidasikelima
                $scope.dataSourcePermenKeempat = e.data.konsolidasikeempat
            });

            
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.groupmataanggaran = [
                {
                    field: "kegiatan"
                },
            ];
            loadDataGrid();
            function loadDataGrid() {
                $scope.isRouteLoading = true;

                var idpegawai = '';
                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                console.log($scope.pegawaiLogin)
                if($scope.pegawaiLogin.jenisPegawai.jenispegawai == "PenanggungJawab" || ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" && $scope.pegawaiLogin.id != 320263)){
                    idpegawai = $scope.pegawaiLogin.id
                    $scope.disidpegawai = true
                    $scope.idpegawailogin = $scope.pegawaiLogin.id
                    $scope.namapegawailogin = $scope.pegawaiLogin.namaLengkap
                    
                }
                if($state.params.parameter == '77777'){
                    $scope.spjaja = true
                } else if($state.params.parameter == '99999'){
                    $scope.panjaraja = true
                } else if($state.params.parameter == '88888'){
                    $scope.sppaja = true
                } else if($state.params.parameter == '66666'){
                    $scope.spmaja = true
                } else if($state.params.parameter == '55555'){
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
                
                LoadSPJ()
                medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')+"&idpegawai=" + idpegawai).then(function (e) {
                    $scope.isRouteLoading = false
                    
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
                    if($scope.item.tahun == null){
                        $scope.item.tahun = e.data.setting[0].tahunanggaran
                    }
                    if($scope.item.tahunkas == null){
                        $scope.item.tahunkas = e.data.setting[0].tahunanggaran
                    }
                    $scope.item.objectkepalabludfk = {id: e.data.setting[0].objectkepalabludfk, namalengkap: e.data.setting[0].namalengkap }
                    $scope.item.objecttahapaktivfk = {id: e.data.setting[0].objecttahapaktivfk, tahap: e.data.setting[0].tahap }
                    $scope.item.searchtahap = {id: e.data.setting[0].objecttahapaktivfk, tahap: e.data.setting[0].tahap }
                    if($scope.item.searchtahapkeg == undefined){
                        $scope.item.searchtahapkeg = {id: e.data.setting[0].objecttahapaktivfk, tahap: e.data.setting[0].tahap }
                    }
                    $scope.item.nomornpwp = e.data.setting[0].nomornpwp

                    $scope.idtahap = e.data.setting[0].objecttahapaktivfk

                    var div = ''
                    if($scope.item.searchdivkeg != undefined){
                        div = $scope.item.searchdivkeg.id
                    }
                    
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.item.tahun).format('YYYY')+"&idpegawai=" + idpegawai + "&tahapaktif=" + $scope.item.searchtahapkeg.id + "&div=" + div).then(function (e) {
                        DataKegiatan = e.data.kegiatan
                        $scope.dataSourceKegiatan = e.data.kegiatan
                    })

                    var kegiatanGrid = $("#kegGrid").data("kendoGrid"); // get the grid widget
                    if($scope.idpegawailogin != ''){
                        kegiatanGrid.hideColumn(7);
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
                medifirstService.getPart('perencanaan/get-datacombo-part-rekanan', true, true, 20).then(function (data) {
                    $scope.listPihakKetiga = data
                })

                
            }    

            function loadDataSPM() {
                medifirstService.get("perencanaan/get-data-spm?nospp="+$scope.item.nosppspm).then(function (e) {
                    $scope.dataSourceSPM = e.data.data
                })
            };
            
            // $scope.popupEntry.center().open();
            $scope.MappingRek = function(){
                medifirstService.get("perencanaan/get-data-rba-belum").then(function (e) {
                    $scope.dataSourceRBABelum = e.data.data
                })
                $scope.popupMappingPermen.center().open()
            }

            $scope.$watch('item.div', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.div.id == 4){
                        $scope.disdiv = false
                    } else{
                        $scope.disdiv = true
                    }
                }
            });

            $scope.$watch('item.mappingrek', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-rba-belum?permen="+$scope.item.mappingrek.id).then(function (e) {
                        $scope.dataSourceRBASudah = e.data.detail
                    })
                }
            });

            $scope.$watch('item.subkegiatanpanjar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo?tahunawal="+e.data.setting[0].tahunanggaran+"&tahap="+e.data.setting[0].objecttahapaktivfk+"&subkegiatan="+$scope.item.subkegiatanpanjar.id).then(function (e) {
                            $scope.listSubSubKegiatanPanjarSPJ = e.data.kegiatansubsub
                        });
                    })
                }
            });

            $scope.$watch('item.subsubkegiatanpanjar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?idsubsub="+$scope.item.subsubkegiatanpanjar.id).then(function (e) {
                        $scope.listMataAnggaranPanjarSPJ = e.data.mataanggarancombo
                    });
                }
            });

            $scope.$watch('item.darirekeningpanjar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                        medifirstService.get("perencanaan/get-total-keterangan?tahap=" +e.data.setting[0].objecttahapaktivfk + "&subsubkegiatan=" + $scope.item.subsubkegiatanpanjar.id + "&rekening=" + $scope.item.darirekeningpanjar.kodemataanggaran).then(function (e) {
                            $scope.totalketerangan = e.data.data[0].totalketerangan
                            $scope.totalrealisasidetail = e.data.detail[0].totalrealisasidetail
                            if(e.data.panjar.length > 0){
                                $scope.panjar = e.data.panjar[0].jumlah
                                $scope.pengembalian = e.data.panjar[0].jumlahpengembalian
                                $scope.item.sisaAnggaranPanjar = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail)
                            }else if(e.data.panjar.length == 0){
                                $scope.item.sisaAnggaranPanjar = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail)
                            }
                            
                            //console.log($scope.item.sisaAnggaranspj)
                        })
                    })

                    
                }
            });


            $scope.$watch('item.subKegiatanSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo?tahunawal="+e.data.setting[0].tahunanggaran+"&tahap="+e.data.setting[0].objecttahapaktivfk+"&subkegiatan="+$scope.item.subKegiatanSPJ.id).then(function (e) {
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

            
            $scope.$watch('item.digit4', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    let kodeArr = $scope.item.digit4.text.split(" - ");
                    console.log(kodeArr)
                    $scope.item.kodedigit4 = kodeArr[0]+"."
                }
            });
            $scope.$watch('item.digit3', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    let kodeArr = $scope.item.digit3.text.split(" - ");
                    console.log(kodeArr)
                    $scope.item.kodedigit3 = kodeArr[0]+"."
                }
            });
            $scope.$watch('item.divkonsolidasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    idpegawai = $scope.pegawaiLogin.id
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')+"&idpegawai=" + idpegawai + "&div=" + $scope.item.divkonsolidasi.id).then(function (e) {
                        console.log(e.data.mataanggaran)
                        $scope.dataSourceMataAnggaran = e.data.mataanggaran
                    });
                }
            });

            
            function copy(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var objSave =
                    {
                        idanggaran: dataItem.id,
                        idpermen: $scope.item.mappingrek.id,
                    }

                    medifirstService.post('perencanaan/copy-permen', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-rba-belum?permen="+$scope.item.mappingrek.id).then(function (e) {
                            $scope.dataSourceRBABelum = e.data.data
                            $scope.dataSourceRBASudah = e.data.detail
                        })
                        
                    }, function (error) {
                
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
            $scope.Tambah = function(){
                $scope.item.id = ''
                $scope.popupTambah.center().open()
            }
            $scope.SuratPengantarSPM = function(){
                console.log($scope.dataSPM)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPM.nilaispm).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-pengantar-spm?norec="+$scope.dataSPM.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.SuratPengantarSPP = function(){
                console.log($scope.dataSPP)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPP.nilaispp).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-pengantar-spp?norec="+$scope.dataSPP.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.SuratPertanggungjawabanSPM = function(){
                console.log($scope.dataSPM)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPM.nilaispm).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-pertanggungjawaban-spm?norec="+$scope.dataSPM.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.SuratRincianSPM = function(){
                console.log($scope.dataSPM)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPM.nilaispm).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-rincian-spm?norec="+$scope.dataSPM.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.SuratPertanggungjawabanSPP = function(){
                console.log($scope.dataSPP)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPP.nilaispp).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-ringkasan-spp?norec="+$scope.dataSPP.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.SuratRincianSPP = function(){
                console.log($scope.dataSPP)
                medifirstService.get("sysadmin/general/get-terbilang/" + $scope.dataSPP.nilaispp).then(
                    function (dat) {
                        window.open(baseTransaksi + "report/get-cetak-rincian-spp?norec="+$scope.dataSPP.norec+"&terbilang="+dat.data.terbilang, '_blank');
                    }
                );
                
            }
            $scope.TambahSPP = function(){
                $scope.listJenisBukti = [
                    { id: 1, jenisbukti: "UP" },
                ];
                $scope.listBulan = [
                    { id: 1, bulan: "Januari" },
                    { id: 2, bulan: "Februari" },
                    { id: 3, bulan: "Maret" },
                    { id: 4, bulan: "April" },
                    { id: 5, bulan: "Mei" },
                    { id: 6, bulan: "Juni" },
                    { id: 7, bulan: "Juli" },
                    { id: 8, bulan: "Agustus" },
                    { id: 9, bulan: "September" },
                    { id: 10, bulan: "Oktober" },
                    { id: 11, bulan: "November" },
                    { id: 12, bulan: "Desember" },
                ];
                $scope.item.itemJenisBukti = { id: 1, jenisbukti: "UP" }
                $scope.item.radioStatusSPP = "Diterima"
                $scope.item.nospp = ''
                $scope.item.dasarPengeluaran = ''
                $scope.item.nospd = ''
                $scope.item.tglSPP = undefined
                $scope.item.itemBulan = undefined
                $scope.item.untukPengeluaran = ''
                $scope.item.tglSah = undefined
                $scope.item.nilaispp = ''
                $scope.popupSPP.center().open()
                
            }
            $scope.TambahSPD = function(){
                $scope.popupSPD.center().open()
                
            }
            $scope.CariSPD = function(){
                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.dataSourceCariSPD = e.data.carispd
                });
                $scope.popupCariSPD.center().open()
                
            }
            $scope.TambahMT = function(){
                $scope.item.id = ''
                $scope.item.kodeAddMT = undefined
                $scope.item.keteranganAdd = undefined
                $scope.jeniskode = true
                $scope.item.jenisanggaran = undefined
                $scope.konsolidasi= true
                $scope.item.konsolidasi2 = undefined
                $scope.item.konsolidasi3 = undefined
                $scope.item.konsolidasi4 = undefined
                $scope.item.konsolidasi5 = undefined
                $scope.popupTambahMT.center().open()
            }
            $scope.TambahPengembalian = function(){
                $scope.popupPengembalian.center().open()
            }
            function deleteKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                var objSave =
                    {
                        id: dataItem.id,
                        div: dataItem.div,
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    }, function (error) {
    
                    })
                })

                
            }
            function editKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                console.log(dataItem)
                $scope.norecrcntotalanggaran = dataItem.norec 
                medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.norecrcntotalanggaran).then(function (e) {
                    var total = 0
                    if(e.data.data.length == 0){
                        $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                        $scope.rcn.paguAnggaran = 0
                    } else{
                        total = e.data.data[0].total
                        $scope.rcn.totalAnggaran = formatRupiah(total, "Rp. ")
                        $scope.rcn.paguAnggaran = 0
                    }

                    $scope.item.targetKinerjaMasukan = formatRupiah(dataItem.targetmasuk, "Rp. ")
                    
				})
                

                

                medifirstService.get("perencanaan/get-jenis-belanja?kegiatan=" + dataItem.id).then(function (e) {
                    if(e.data.data.length == 0){
                        $scope.item.jenisbelanja = null
                    } else{
                        $scope.item.jenisbelanja = {id:e.data.data[0].id, jenisbelanja:e.data.data[0].jenisbelanja}
                    }
                    
				})

                // medifirstService.get("perencanaan/get-total-keterangan?tahap=" +e.data.setting[0].objecttahapaktivfk + "&subsubkegiatan=" + $scope.item.subSubKegiatanSPJ.id).then(function (e) {
                //     $scope.totalketerangan = e.data.data[0].totalketerangan
                //     $scope.totalrealisasidetail = e.data.detail[0].totalrealisasidetail
                //     $scope.totalpanjar = e.data.panjar[0].panjar
                //     $scope.item.sisaAnggaranSPJ = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail) 
                //     //- parseInt($scope.totalpanjar)
                //     //console.log($scope.item.sisaAnggaranspj)
				// })

                
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                $scope.item.id = dataItem.id
                $scope.item.subsubketerangan = dataItem.id
                //console.log($scope.item.subsubketerangan)
                console.log(dataItem)
                let kodeArr = dataItem.kode.split(" ");
                let kodeArr2 = kodeArr[0].split(".");
                let a1 = kodeArr2[0] + '.' + kodeArr2[1]
                let b1 = kodeArr2[2]
                let c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                let d1 = kodeArr2[5]  

                console.log(a1)
                console.log(b1)
                console.log(c1)
                console.log(d1)
                if(dataItem.div == 0){
                    $scope.item.urusandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupUrusan.center().open()
                    // a1 = kodeArr2[0] + '.' + kodeArr2[1]
                    $scope.item.kode = a1
                    //$scope.jeniskode = false;
                    
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4)
                    // $scope.item.kode = dataItem.kode.substring(5,7)
                }
                else if(dataItem.div == 1){
                    $scope.item.programdiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupProgram.center().open()
                    // a1 = kodeArr2[0] + '.' + kodeArr2[1]
                    $scope.item.kodeHead = a1
                //    b1 = kodeArr2[2]
                    $scope.item.kode = b1
                    //$scope.jeniskode = false;
                    
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4)
                    // $scope.item.kode = dataItem.kode.substring(5,7)
                }else if(dataItem.div == 2){
                    $scope.item.detaildiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupKegiatan.center().open();
                    $scope.item.kodeHead = a1 + '.' + b1
                    // c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                    $scope.item.kode = c1
                    // $scope.item.kodeHead =dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7)
                    // $scope.item.kode = dataItem.kode.substring(8,12)
                }else if(dataItem.div == 3){
                    $scope.item.subkegiatandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.popupSubKegiatan.center().open();
                    $scope.item.kodeHead =  a1 +'.'+ b1 +'.'+c1
                    // d1 = kodeArr2[5]  
                    $scope.item.kode = d1 
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)
                    // $scope.item.kode = dataItem.kode.substring(13,15)
                }else if(dataItem.div == 4){
                    
                    console.log(dataItem)
                    $scope.idkegiatananggaran = dataItem.id
                    buttonhide = false
                    $scope.item.subsubkegiatandiv = {div: dataItem.namakelompok, id: dataItem.div}
                    $scope.item.urusanPemerintahan = dataItem.kodeurusan + ' ' + dataItem.keteranganurusan
                    $scope.item.program = dataItem.kodeprogram + ' ' + dataItem.keteranganprogram
                    $scope.item.kegiatan = dataItem.kodekegiatan + ' ' + dataItem.keterangankegiatan
                    $scope.item.subKegiatan = dataItem.kodesubkegiatan + ' ' + dataItem.keterangansubkegiatan
                    
                    for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                        let element = $scope.dataSourceKegiatan[index];
                        if(element.kode == a1 +'.'+ b1 +'.'+ c1+'.'+ d1){
                            //$scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                        }
                        $scope.item.kode4 = a1 +'.'+ b1 +'.'+ c1+'.'+ d1
                    }
                    let TotalAnggaran = 0;
                    
                    $scope.item.subSubKegiatankode = kodeArr[0]//dataItem.kode//.substring(16) 
                    $scope.item.subSubKegiatan =  dataItem.keterangan
                    $scope.item.thnAnggaran = moment(dataItem.tahun).format('YYYY') 
                    $scope.item.pptktext = dataItem.namalengkap
                    
                    $scope.item.tahapdetail = {id: $scope.item.searchtahapkeg.id, tahap: $scope.item.searchtahapkeg.tahap}

                    $scope.rcn.judulKegiatan =  dataItem.keterangan

                    //$scope.item.tolokUkurMasukan = dataItem.indikatormasuk
                    $scope.item.tolokUkurMasukan = 'Dana'
                    // $scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")//dataItem.targetmasuk
                    $scope.item.tolokUkurKeluaran = dataItem.indikatorkeluaran
                    $scope.item.targetKinerjaKeluaran = dataItem.targetkeluaran
                    $scope.item.tolokUkurHasil = dataItem.indikatorhasil
                    $scope.item.targetKinerjaHasil = dataItem.targethasil
                    $scope.popupSubSubKegiatan.center().open();  
                }
                
                $scope.item.keterangan = dataItem.keterangan
                $scope.item.div = dataItem.div
                LoadTotalKeterangan()
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
                $scope.item.konsolidasi3 = undefined
                $scope.item.konsolidasi2 = undefined
                $scope.item.konsolidasi4 = undefined
                //console.log(dataItem)
                
                var yangdicount = dataItem.kodemataanggaran
                //console.log(yangdicount)
                var count = occurrences(yangdicount, ".");
                //console.log(count)

                if(count == 2){
                    $scope.jeniskode = false;
                } else{
                    $scope.jeniskode = true;
                }

                console.log(count)
                

                
                if (dataItem.kodemataanggaran.match(/I.*/) && count == 4){
                    $scope.konsolidasi = false;
                } else if (dataItem.kodemataanggaran.match(/III.*/) && count == 3){
                    $scope.konsolidasi = false;
                } else{
                    $scope.konsolidasi = true;
                }

                console.log($scope.konsolidasi)

                $scope.item.id = dataItem.id
                $scope.item.kodeAddMT = dataItem.kodemataanggaran
                $scope.item.keteranganAddMT = dataItem.namamataanggaran
                $scope.item.keteranganAdd = dataItem.namamataanggaran
                $scope.item.radioPencairan = dataItem.objectcarabayarfk
                $scope.item.konsolidasi5 = {id: dataItem.idmap, mataanggaranpermen: dataItem.mataanggaranpermen} 

                //console.log($scope.item.radioPencairan)

                medifirstService.get("perencanaan/get-jenis-angagran?id="+dataItem.id).then(function (e) {
                    //console.log(e.data.data.length)
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
                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD'));
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

                console.log(dataItem)
                
                let totalAnggaran = 0;
                // let dataGridAlokasi = DataTabKeteranganBelanja
                // DataTabKeteranganBelanja = $scope.dataSourceKeteranganBelanja._data
                DataTabKeteranganBelanja =[]
                dataAlokasi2222 =[]
                for (let x = 0; x < $scope.dataSourceDetailKeteranganBelanja.options.data.length; x++) {
                    var el = $scope.dataSourceDetailKeteranganBelanja.options.data[x]
                    console.log(el)
                    if (el.kodemataanggaran == dataItem.kodemataanggaran && el.keterangan == dataItem.keterangan) {
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

            $scope.columnSPP = {
                columns:[
                    {
                        "command": [
                              {
                                 text: "Input SPM",
                                 click: inputSPM,
                                 imageClass: "clinic fa"
                              },
                              {
                                text: "Detail",
                                click: DetailSPP,
                                imageClass: "clinic fa"
                             },
                          ],
                             title: "",
                             width: "60px",
                    },
                {
                    "field": "nospp",
                    "title": "No SPP",
                    "width": "80px"
                },
                {
                    "field": "asalproduk",
                    "title": "Sumber Dana",
                    "width": "80px"
                },
                {
                    "field": "jenisbukti",
                    "title": "Jenis Bukti",
                    "width": "80px"
                },
                {
                    "field": "dasarpengeluaran",
                    "title": "Dasar Pengeluaran",
                    "width": "80px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "nospd",
                    "title": "SPD",
                    "width": "80px"
                },
                {
                    "field": "tglspp",
                    "title": "Tgl SPP",
                    "width": "80px"
                },
                {
                    "field": "bulan",
                    "title": "Bulan",
                    "width": "80px"
                },
                {
                    "field": "pengeluaran",
                    "title": "Untuk Pengeluaran",
                    "width": "80px"
                },
                {
                    "field": "tglsah",
                    "title": "Tgl Sah",
                    "width": "80px"
                },
                {
                    "field": "nilaispp",
                    "title": "Nilai SPP",
                    "width": "80px"
                },
                {
                    "command": [
                          {
                            text: "Delete",
                            click: DeleteSPP,
                            imageClass: "clinic fa",
                         },
                      ],
                         title: "",
                         
                         width: "60px",
                         
                },
            ]}

            $scope.columnSPM = {
                columns:[
                {
                    "field": "nospm",
                    "title": "No SPM",
                    "width": "80px"
                },
                {
                    "field": "asalproduk",
                    "title": "Sumber Dana",
                    "width": "80px"
                },
                {
                    "field": "jenisbukti",
                    "title": "Jenis Bukti",
                    "width": "80px"
                },
                {
                    "field": "untukpengeluaran",
                    "title": "Untuk",
                    "width": "80px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "nospp",
                    "title": "No SPP",
                    "width": "80px"
                },
                {
                    "field": "tglspm",
                    "title": "Tgl SPM",
                    "width": "80px"
                },
                {
                    "field": "tglsah",
                    "title": "Tgl Sah",
                    "width": "80px"
                },
                {
                    "field": "nilaispm",
                    "title": "Nilai SPM",
                    "width": "80px"
                },
                {
                    "field": "noreg",
                    "title": "No Reg",
                    "width": "80px"
                },
                {
                    "command": [
                          {
                            text: "Delete",
                            click: DeleteSPM,
                            imageClass: "clinic fa",
                         },
                      ],
                         title: "",
                         
                         width: "60px",
                         
                },
            ]}

            $scope.columnCariSPM = {
                columns:[
                {
                    "field": "nospm",
                    "title": "No SPM",
                    "width": "80px"
                },
                {
                    "field": "asalproduk",
                    "title": "Sumber Dana",
                    "width": "80px"
                },
                {
                    "field": "jenisbukti",
                    "title": "Jenis Bukti",
                    "width": "80px"
                },
                {
                    "field": "untukpengeluaran",
                    "title": "Untuk",
                    "width": "80px"
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "nospp",
                    "title": "No SPP",
                    "width": "80px"
                },
                {
                    "field": "tglspm",
                    "title": "Tgl SPM",
                    "width": "80px"
                },
                {
                    "field": "tglsah",
                    "title": "Tgl Sah",
                    "width": "80px"
                },
                {
                    "field": "nilaispm",
                    "title": "Nilai SPM",
                    "width": "80px"
                },
                {
                    "field": "noreg",
                    "title": "No Reg",
                    "width": "80px"
                },
                {
                    "command": [
                        {
                            text: "Detail",
                            click: DetailSPM,
                            imageClass: "clinic fa",
                         },
                        {
                            text: "Delete",
                            click: DeleteSPM,
                            imageClass: "clinic fa",
                        },
                      ],
                         title: "",
                         
                         width: "60px",
                         
                },
            ]}

            $scope.columnSPD = {
                columns:[
                {
                    "field": "nospd",
                    "title": "No SPD",
                    "width": "80px"
                },
                {
                    "field": "tglspd",
                    "title": "Tgl SPD",
                    "width": "80px"
                },
                {
                    "field": "asalproduk",
                    "title": "Sumber Dana",
                    "width": "80px"
                },
                {
                    "field": "nilaispd",
                    "title": "Nilai SPD",
                    "width": "80px"
                },
                {
                    "field": "nospp",
                    "title": "No SPP",
                    "width": "80px",
                    //template: $("#status-template").html()
                },
                {
                    "command": [
                          {
                             text: "Pilih",
                             click: PilihSPD,
                             imageClass: "clinic fa",
                             visible: function(dataItem) { return dataItem.nospp }
                          },
                          {
                            text: "Delete",
                            click: DeleteSPD,
                            imageClass: "clinic fa",
                         },
                      ],
                         title: "",
                         
                         width: "60px",
                         
                },
            ]}

            $scope.columnCariSPD = {
                columns:[
                {
                    "field": "nospd",
                    "title": "No SPD",
                    "width": "80px"
                },
                {
                    "field": "tglspd",
                    "title": "Tgl SPD",
                    "width": "80px"
                },
                {
                    "field": "nilaispd",
                    "title": "Nilai SPD",
                    "width": "80px"
                },
                {
                    "command": [
                          {
                             text: "Pilih",
                             click: PilihSPD,
                             imageClass: "clinic fa"
                          },
                      ],
                         title: "",
                         width: "60px",
                },
            ]}
            
            $scope.columnKegiatan = {
				toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-hide="disidpegawai" ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
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
                             click: deleteKegiatanT,
                             imageClass: "clinic fa"
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
            $scope.columnPanjar = {
                columns:[
                {
                    "field": "nopanjar",
                    "title": "Nomor Panjar",
                },
                {
                    "field": "uraian",
                    "title": "Uraian Panjar",
                },
                {
                    "field": "tglpanjar",
                    "title": "Tanggal",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                },
                {
                    "field": "jenispanjar",
                    "title": "Jenis Panjar",
                },
                {
                    "field": "jumlahpengembalian",
                    "title": "Jml Pengembalian",
                },
                {
                    "field": "sumberpanjar",
                    "title": "Sumber Panjar",
                },
                {
                    "command": [
                          {
                            text: "Delete",
                            click: DeletePanjar,
                            imageClass: "clinic fa",
                         },
                      ],
                         title: "",
                         
                         width: "60px",
                         
                },
            ]};
            $scope.columnPengembalian = {
                columns:[
                {
                    "field": "tglpengembalian",
                    "title": "Tgl Pengembalian",
                },
                {
                    "field": "nopengembalian",
                    "title": "No Pengembalian",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                },
                {
                    "field": "subkegiatan",
                    "title": "Sub Kegiatan",
                },
                {
                    "field": "subsubkegiatan",
                    "title": "Sub Sub Kegiatan",
                },
                {
                    "field": "kodemataanggaran",
                    "title": "Kode Mata Anggaran",
                },
                {
                    "field": "jumlahpengembalian",
                    "title": "Jml Pengembalian",
                },
                {
                    "command": [
                          {
                            text: "Delete",
                            click: DeletePengembalian,
                            imageClass: "clinic fa",
                         },
                      ],
                         title: "",
                         
                         width: "60px",
                         
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
            $scope.columnPanjarAktif = {
                columns:[
                {
                    
                    "field": "nopanjar",
                    "title": "Nomor Panjar",
                },
                {
                    "field": "uraian",
                    "title": "Uraian Panjar",
                },
                {
                    "field": "tglpanjar",
                    "title": "Tanggal",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                },
                {
                    "field": "jenispanjar",
                    "title": "Jenis Panjar",
                },
                {
                    "field": "jumlahpengembalian",
                    "title": "Jml Pengembalian",
                },
                {
                    "field": "sumberpanjar",
                    "title": "Sumber Panjar",
                },
                {
                    "command": [
                          {
                             text: "Pilih",
                             click: PilihPanjar,
                             imageClass: "clinic fa"
                          },
                      ],
                         title: "",
                         width: "60px",
                },
                ],
                
            };
            $scope.columnPanjarPengembalian = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahPanjarVerif()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                ],
                columns:[
                {
                    "command": [
                            {
                                text: "Pengembalian",
                                click: PengembalianPanjar,
                                imageClass: "clinic fa"
                            },
                        ],
                            title: "",
                            width: "150px",
                },
                {
                    
                    "field": "norec",
                    "hidden": true
                },
                {
                    
                    "field": "nopanjar",
                    "title": "Nomor Panjar",
                },
                {
                    "field": "uraian",
                    "title": "Uraian Panjar",
                },
                {
                    "field": "tglpanjar",
                    "title": "Tanggal",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                },
                {
                    "field": "jenispanjar",
                    "title": "Jenis Panjar",
                },
                {
                    "field": "jumlahpengembalian",
                    "title": "Jml Pengembalian",
                },
                {
                    "field": "norealisasi",
                    "title": "No SPJ",
                },
                {
                    "field": "jumlahspj",
                    "title": "Jml SPJ",
                },
                {
                    "field": "sumberpanjar",
                    "title": "Sumber Panjar",
                },
                {
                    "field": "idmataanggaran",
                    "title": "",
                    "hidden": true,
                },
                {
                    "field": "kodemataanggaran",
                    "title": "",
                    "hidden": true,
                },
                {
                    "field": "idsubkegiatan",
                    "title": "",
                    "hidden": true,
                },
                {
                    "field": "subkegiatan",
                    "title": "",
                    "hidden": true,
                },
                {
                    "field": "idsubsubkegiatan",
                    "title": "",
                    "hidden": true,
                },
                {
                    "field": "subsubkegiatan",
                    "title": "",
                    "hidden": true,
                },
                
                ],
                
            };
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

            $scope.$watch('item.konsolidasi2', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?konsolidasi2="+$scope.item.konsolidasi2.id).then(function (e) {
                        $scope.listKonsolidasi3 = e.data.konsolidasi3
                    });
                    
                }
            });

            

            

            $scope.$watch('item.subsubkegiatanangkas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-rincian-kegiatan?id="+$scope.item.subsubkegiatanangkas.norec).then(function (e) {
                        $scope.item.urusanPemerintahan = e.data.data[0].kodeurusan + ' ' + e.data.data[0].keteranganurusan
                        $scope.item.program = e.data.data[0].kodeprogram + ' ' + e.data.data[0].keteranganprogram
                        $scope.item.kegiatan = e.data.data[0].kodekegiatan + ' ' + e.data.data[0].keterangankegiatan
                        $scope.item.subKegiatan = e.data.data[0].kodesubkegiatan + ' ' + e.data.data[0].keterangansubkegiatan
                        $scope.idkegiatanangkas = e.data.data[0].id
                        $scope.kodesubsubkegiatanangkas = e.data.data[0].kodesubsubkegiatan
                    });
                    
                }
            });

            
            


            $scope.$watch('item.mataAnggaranSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                        medifirstService.get("perencanaan/get-total-keterangan?tahap=" +e.data.setting[0].objecttahapaktivfk + "&subsubkegiatan=" + $scope.item.subSubKegiatanSPJ.id + "&rekening=" + $scope.item.mataAnggaranSPJ.kodemataanggaran).then(function (e) {
                            $scope.totalketerangan = e.data.data[0].totalketerangan
                            $scope.totalrealisasidetail = e.data.detail[0].totalrealisasidetail
                            if(e.data.panjar.length > 0){
                                $scope.panjar = e.data.panjar[0].jumlah
                                $scope.pengembalian = e.data.panjar[0].jumlahpengembalian
                                $scope.item.sisaAnggaranSPJ = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail)
                            }else if(e.data.panjar.length == 0){
                                $scope.item.sisaAnggaranSPJ = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail)
                            }
                            
                            //console.log($scope.item.sisaAnggaranspj)
                        })
                    })

                    
                }
            });

            $scope.$watch('item.subSubKegiatanSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')+"&idsubsub="+$scope.item.subSubKegiatanSPJ.id).then(function (e) {
                        $scope.listMataAnggaranSPJ = e.data.mataanggarancombo
                        //console.log($scope.listMataAnggaranSPJ)
                    })
                }
            });

            $scope.$watch('item.jmlSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.subTotalSPJ = $scope.item.jmlSPJ*$scope.item.hargaSatuanSPJ
                }
            });

            $scope.$watch('item.hargaSatuanSPJ', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.subTotalSPJ = $scope.item.jmlSPJ*$scope.item.hargaSatuanSPJ
                }
            });

            $scope.$watch('item.tahapdetail', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.tahapdetail != undefined || $scope.item.tahapdetail != null){
                        $scope.inputtahap = false
                    }
                }
            });
            
            $scope.$watch('item.radioPencairan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    //console.log($scope.item.radioPencairan)
                    if($scope.item.radioPencairan == 2){
                        $scope.dispanjar = false
                    } else{
                        $scope.dispanjar = true
                    }
                }
            });

            $scope.$watch('item.radioPencairanVerifikasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    //console.log($scope.item.radioPencairan)
                    if($scope.item.radioPencairan == 2){
                        $scope.dispanjar = false
                    } else{
                        $scope.dispanjar = true
                    }
                }
            });

            $scope.$watch('item.kodeAddMT', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    var yangdicount = $scope.item.kodeAddMT
                    //console.log(yangdicount)
                    var count = occurrences(yangdicount, ".");
                    //console.log(count)

                    if(count == 2){
                        $scope.jeniskode = false;
                    } else{
                        $scope.jeniskode = true;
                    }

                    if (yangdicount.match(/I.*/) && count == 4){
                        $scope.konsolidasi = false;
                    } else if (yangdicount.match(/III.*/) && count == 3){
                        $scope.konsolidasi = false;
                    } else{
                        $scope.konsolidasi = true;
                    }
                }
            });

            $scope.$watch('item.hargaSatuanKT', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    $scope.item.subTotalKT = $scope.item.hargaSatuanKT*$scope.item.jmlKT
                    //console.log($scope.item.subTotalKT)
                }
            });

            $scope.$watch('item.jmlKT', function (newValue, oldValue) {
                if (newValue != oldValue) {

                    $scope.item.subTotalKT = $scope.item.hargaSatuanKT*$scope.item.jmlKT
                    //console.log($scope.item.subTotalKT)
                }
            });

            // $scope.$watch('item.tahapawal', function (newValue, oldValue) {
            //     if (newValue != oldValue) {
                    
            //     }
            // });

            $scope.CariSettingTahap = function () {
                medifirstService.get("perencanaan/get-data-combo?tahap="+$scope.item.tahapawal.id+"&tahunawal="+moment($scope.item.tahunawal).format('YYYY')+"&subkegiatan="+$scope.item.subkegiatantransfer.id).then(function (e) {
                    $scope.listSubSubKegiatan = e.data.kegiatansubsub
                    $scope.arrayProdukTemp = []
                    if ($scope.listSubSubKegiatan.length > 0) {
                        for (let i = 0; i < $scope.listSubSubKegiatan.length; i++) {
                            const element = $scope.listSubSubKegiatan[i];
                            element.isChecked = false
                        }
                    }
                });
            }

            $scope.CariSPJ = function () {
                LoadSPJ()
            }

            $scope.CariKeteranganPerubahan = function () {
                medifirstService.get("perencanaan/get-data-combo?idmataanggaran="+$scope.item.combomataanggaran.id+"&tahapaktif="+$scope.item.objecttahappemindahan.id).then(function (e) {
                    
                    $scope.listKeteranganPerubahan = e.data.keteranganperubahan
                    $scope.arrayProdukTemp = []
                    if ($scope.listKeteranganPerubahan.length > 0) {
                        for (let i = 0; i < $scope.listKeteranganPerubahan.length; i++) {
                            const element = $scope.listKeteranganPerubahan[i];
                            element.isChecked = false
                        }
                    }
                });
            }
            
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

            $scope.$watch('item.combokegiatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?subsubkegiatan="+$scope.item.combokegiatan.kode).then(function (e) {
                        $scope.listSubSubKegiatanCombo = e.data.kegiatansubsubcombo
                    });
                }
            });

            $scope.$watch('item.combokegiatanakhir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?subsubkegiatan="+$scope.item.combokegiatanakhir.kode).then(function (e) {
                        $scope.listSubSubKegiatanComboakhir = e.data.kegiatansubsubcombo
                    });
                }
            });

            $scope.$watch('item.combosubsubkegiatan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-data-combo?idsubsub="+$scope.item.combosubsubkegiatan.id).then(function (e) {
                        $scope.listMataAnggaranCombo = e.data.mataanggarancombo
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
                console.log(totalAlokasi)
                console.log(parseFloat($scope.item.bln1))
                console.log(parseFloat($scope.item.bln2))
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
                let bln12 = 0
                if($scope.item.bln12 != undefined){
                    bln12 = $scope.item.bln12
                }
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
                                                    parseFloat(bln11) +
                                                        parseFloat(bln12)
                $scope.item.totalBulanAlokasiDetail = $scope.item.totalBulanAlokasiDetail.toFixed(2)
                $scope.item.kurangAlokasiDetail = totalAlokasi - parseFloat($scope.item.totalBulanAlokasiDetail)
                $scope.item.kurangAlokasiDetail = $scope.item.kurangAlokasiDetail.toFixed(2)
            }
            

            $scope.$watch('item.searchMata', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataMataAnggaran.length; index++) {
                        let element = DataMataAnggaran[index];
                        if (element.namamataanggaran.toLowerCase().match(newValue.toLowerCase())) {
                            data.push(element)
                        }else if (element.kodemataanggaran.toLowerCase().match(newValue.toLowerCase())) {
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

            $scope.$watch('item.isCekAdaAnggaranSaja', function (newValue, oldValue) {
                if (newValue != oldValue) {

                            var idpegawai = ''
                            $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                            idpegawai = $scope.pegawaiLogin.id
                            
                            
                            medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&cek=" + $scope.item.isCekAdaAnggaranSaja+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                                DataTotalMataAnggaran = e.data.data
                                $scope.listAsalProduk = e.data.asalproduk
                                $scope.dataSourceDetailMT = new kendo.data.DataSource({
                                    data: DataTotalMataAnggaran
                                });
                            });
                }
            });

            $scope.$watch('item.searchKeteranganBelanja', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    console.log($scope.dataSearchSourceKeteranganBelanja)
                    var data = []
                    for (let index = 0; index < $scope.dataSearchSourceKeteranganBelanja.options.data.length; index++) {
                        let element = $scope.dataSearchSourceKeteranganBelanja.options.data[index];
                        console.log(element)
                        if (element.mataanggaran.toLowerCase().match(newValue.toLowerCase())) {
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
                var tahuns = null
                if($scope.item.tahuntambahkegiatan != undefined){
                    tahuns = moment($scope.item.tahuntambahkegiatan).format('YYYY')
                }
                var objSave =
                    {
                        id: '',
                        kode: $scope.item.kodeAdd,
                        keterangan: $scope.item.keteranganAdd,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: tahuns,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: $scope.item.div.id
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
                        $scope.dataSourceKegiatan = e.data.kegiatan
                    })
                    $scope.item.searchdivkeg = { id: 4, div: "Sub Sub Kegiatan" }
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

            $scope.SimpanSPP = function(){
                var objSave =
                    {
                        norec: $scope.norecspp,
                        nospp: $scope.item.nospp,
                        jenisbukti: $scope.item.itemJenisBukti.jenisbukti,
                        dasarpengeluaran: $scope.item.dasarPengeluaran,
                        statusspp: $scope.item.radioStatusSPP,
                        nospd: $scope.item.nospd,
                        tglspp: $scope.item.tglSPP,
                        bulan: $scope.item.itemBulan.bulan,
                        pengeluaran: $scope.item.untukPengeluaran,
                        tglsah: $scope.item.tglSah,
                        nilaispp: $scope.item.nilaispp,
                        objectasalprodukfk: $scope.item.sumberDanaSPP.id,
                    }

                    medifirstService.post('perencanaan/save-spp', objSave).then(function (e) {
                       
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceSPP = e.data.spp
                        });
                        $scope.popupSPP.center().close()
                    }, function (error) {
                
                    })
                
            }

            $scope.SimpanSPM = function(){
                var objSave =
                    {
                        norec: $scope.norecspm,
                        nospm: $scope.item.nospm,
                        jenisbukti: $scope.item.itemJenisBuktiSPM.jenisbukti,
                        untukpengeluaran: $scope.item.untuk,
                        status: $scope.item.radioStatusSPM,
                        nospp: $scope.item.nosppspm,
                        tglspm: $scope.item.tglSPM,
                        tglsah: $scope.item.tglSahSPM,
                        nilaispm: $scope.item.nilaispm,
                        noreg: $scope.item.noreg,
                        objectasalprodukfk: $scope.item.sumberDanaSPM.id,
                    }

                    console.log(objSave)

                    medifirstService.post('perencanaan/save-spm', objSave).then(function (e) {
                        loadDataSPM();
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceCariSPM = e.data.carispm
                        });
                    }, function (error) {
                
                    })
                
            }

            $scope.SimpanPengembalianPanjar = function(){
                var objSave =
                    {
                        norec: $scope.norecpengembalian,
                        tglpengembalian: $scope.item.tglPengembalian,
                        keterangan: $scope.item.keteranganpengembalian,
                        jumlahpengembalian: $scope.item.jumlahpengembalianpanjar,
                        norecpanjar: $scope.item.norecpengembalian,
                        idsubkegiatan: $scope.subkegiatanpengembalian,
                        idsubsubkegiatan: $scope.subsubkegiatanpengembalian,
                        idmataanggaran: $scope.rekeningpengembalian,
                    }


                    if($scope.norecpengembalian == ''){
                        medifirstService.get("perencanaan/get-sisa-panjar?panjar=" + $scope.item.norecpengembalian ).then(function (e) {
                            console.log(e.data.jumlah[0].jumlah)
                            console.log(e.data.totalbelanja[0].totalbelanja)
                            console.log(e.data.pengembalian[0].jumlahpengembalian)
                            if((parseInt(e.data.jumlah[0].jumlah) - parseInt(e.data.totalbelanja[0].totalbelanja) - parseInt(e.data.pengembalian[0].jumlahpengembalian)) >= parseInt($scope.item.jumlahpengembalianpanjar)){
                                medifirstService.post('perencanaan/save-pengembalian', objSave).then(function (e) {
                                    medifirstService.get("perencanaan/get-pengembalian-panjar?norec="+$scope.item.norecpengembalian).then(function (e) {
                                        $scope.dataSourcePengembalian = e.data.data
                                    })
                                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                                        
                                        $scope.dataSourcePanjarPengembalian = e.data.panjar
                                    });
                                }, function (error) {
                            
                                })
                            } else{
                                toastr.error('Total Pengembalian melebihi sisa panjar', 'Informasi');
                                return
                            }
                        })
                    } else{
                        medifirstService.get("perencanaan/get-sisa-panjar?panjar=" + $scope.item.norecpengembalian ).then(function (e) {
                            console.log(e.data.jumlah[0].jumlah)
                            console.log(e.data.totalbelanja[0].totalbelanja)
                            console.log(e.data.pengembalian[0].jumlahpengembalian)
                            if((parseInt(e.data.jumlah[0].jumlah) - parseInt(e.data.totalbelanja[0].totalbelanja) - parseInt(e.data.pengembalian[0].jumlahpengembalian) + parseInt($scope.pengembalianawal)) >= parseInt($scope.item.jumlahpengembalianpanjar)){
                                medifirstService.post('perencanaan/save-pengembalian', objSave).then(function (e) {
                                    medifirstService.get("perencanaan/get-pengembalian-panjar?norec="+$scope.item.norecpengembalian).then(function (e) {
                                        $scope.dataSourcePengembalian = e.data.data
                                    })
                                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                                        
                                        $scope.dataSourcePanjarPengembalian = e.data.panjar
                                    });
                                }, function (error) {
                            
                                })
                            } else{
                                toastr.error('Total Pengembalian melebihi sisa panjar', 'Informasi');
                                return
                            }
                        })
                    }
            }

            $scope.SimpanSPD = function(){
                var objSave =
                    {
                        nospd: $scope.item.nospd,
                        tglspd: $scope.item.tglSPD,
                        nilaispd: $scope.item.nilaispd,
                        objectasalprodukfk: $scope.item.sumberDanaSPD.id,
                        norec: $scope.norecspd,
                    }

                    medifirstService.post('perencanaan/save-spd', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceSPD = e.data.spd
                        });
                        
                    }, function (error) {
                
                    })
                
            }

            $scope.SimpanPengembalian = function(){
                var objSave =
                {
                    norec: $scope.item.norecpengembalian,
                    uangpengembalian: $scope.item.uangpengembalian,
                }
                medifirstService.get("perencanaan/get-sisa-panjar?panjar=" + $scope.item.norecpengembalian ).then(function (e) {
                    if((parseInt(e.data.jumlah[0].jumlah) - parseInt(e.data.totalbelanja[0].totalbelanja) - parseInt(e.data.pengembalian[0].jumlahpengembalian)) >= $scope.item.uangpengembalian){
                        medifirstService.post('perencanaan/save-pengembalian-spj', objSave).then(function (e) {
                            loadDataGrid();
                        }, function (error) {
                    
                        })
                    } else{
                        toastr.error('Total Pengembalian melebihi sisa panjar', 'Informasi');
                        return
                    }
                })
                
            }

            $scope.SimpanPanjar = function(){
                var objSave =
                    {
                        norec: $scope.norecpanjar,
                        tglPanjar: $scope.item.tglPanjar,
                        sumberPanjar: $scope.item.sumberPanjar,
                        uraianPanjar: $scope.item.uraianPanjar,
                        jumlahpanjar: $scope.item.jumlahpanjar,
                        idbill: $scope.item.idbill,
                        ntpn: $scope.item.ntpn,
                        idbillpph: $scope.item.idbillpph,
                        ntpnpph: $scope.item.ntpnpph,
                        objectjenispphfk: $scope.item.jenispajak.id,
                        pph: $scope.item.pphpanjar,
                        ppn: $scope.item.ppnpanjar,
                        subkegiatan: $scope.item.subkegiatanpanjar.id,
                        subsusbkegiatan: $scope.item.subsubkegiatanpanjar.id,
                        mataanggaran: $scope.item.darirekeningpanjar.kodemataanggaran,
                    }
                    medifirstService.post('perencanaan/save-panjar', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-daftar-panjar"
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            var datas = dat.data.data
                            //console.log(datas)
                            for(var i = 0; i < dat.data.data.length; i++){
                                dat.data.data[i].no = i+1
                            }
                            $scope.dataSourcePanjar = new kendo.data.DataSource({
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
                    }, function (error) {
            
                    })
                
            }


            $scope.SimpanVerifikasiSPJ = function(){
                
                var objSave =
                    {
                        tglverif: $scope.item.tglVerifSPJ,
                        statusverif: $scope.item.radioVerifikasi,
                        keterangan: $scope.item.keteranganVerif,
                        carabayar: $scope.item.radioPencairanVerifikasi,
                        jumlahdibayarverif: $scope.item.jumlahdibayarSPJ,
                        norec: $scope.norecverif,
                        norecpanjar: $scope.norecpanjar,
                    }
                    
                    medifirstService.post('perencanaan/save-verif-spj', objSave).then(function (e) {
                        loadDataGrid();
                        $scope.popupVerifSPJ.center().close()
                    }, function (error) {
                
                    })
                
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
    
                        var idpegawai = ''
                        $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                        //console.log($scope.pegawaiLogin)
                        if($scope.pegawaiLogin.jenisPegawai.jenispegawai == "PenanggungJawab" || ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" && $scope.pegawaiLogin.id != 320263)){
                            idpegawai = $scope.pegawaiLogin.id
                        }
                        
                        
                        medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&mataanggaran="+$scope.kodemataanggaranalokasi+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                            
                            $scope.item.totalbulanan = formatRupiah(e.data.alokasimataanggaran[0].totalbulanan, "Rp. ")
                            let selisih = 0
                            selisih = $scope.totalanggaranperalokasi - e.data.alokasimataanggaran[0].totalbulanan
                            $scope.item.selisihanggaran = formatRupiah(selisih, "Rp. ")
                        })
                    //$scope.popupAlokasiKeteranganBelanja.center().close()
                }, function (error) {

                })
            }

            $scope.findData = function () {
                var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    //console.log($scope.pegawaiLogin)
                    if($scope.pegawaiLogin.jenisPegawai.jenispegawai == "PenanggungJawab" || ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" && $scope.pegawaiLogin.id != 320263)){
                        idpegawai = $scope.pegawaiLogin.id
                    }
                    if($state.params.parameter == '77777'){
                        $scope.spjaja = true
                    } else if($state.params.parameter == '99999'){
                        $scope.panjaraja = true
                    } else if($state.params.parameter == '88888'){
                        $scope.sppaja = true
                    } else if($state.params.parameter == '66666'){
                        $scope.spmaja = true
                    } else if($state.params.parameter == '55555'){
                        $scope.semuaanggaran = true
                    }

                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.tahunkas).format('YYYY')+"&tahap="+$scope.item.searchtahap.id+"&idpegawai="+idpegawai).then(function (e) {
                        DataTotalMataAnggaran = e.data.data
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: DataTotalMataAnggaran
                        });
                        DataTabKeteranganBelanja  = [];//e.data.keteranganbelanja
                        // let DataInsertAlokasi = [];
                        console.log(e.data.keteranganbelanja)
                        let dataAlokasi =  e.data.alokasi;
                        for (let index = 0; index < e.data.keteranganbelanja.length; index++) {
                            let element = e.data.keteranganbelanja[index];
                            for (let aa = 0; aa < dataAlokasi.length; aa++) {
                                let alokasielement = dataAlokasi[aa];
                                for (let bb = 0; bb < alokasielement.length; bb++) {
                                    let elementbb = alokasielement[bb];
                                    if(elementbb.kodemataanggaran == element.kodemataanggaran){
                                        if(elementbb.bulanint == 1){
                                            elementbb.jan = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 2){
                                            elementbb.feb = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 3){
                                            elementbb.mar = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 4){
                                            elementbb.apr = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 5){
                                            elementbb.mei = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 6){
                                            elementbb.jun = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 7){
                                            elementbb.jul = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 8){
                                            elementbb.agt = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 9){
                                            elementbb.sep = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 10){
                                            elementbb.okt = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 11){
                                            elementbb.nov = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 12){
                                            elementbb.des = elementbb.nilai
                                        }

                                        elementbb.subtotal=element.subtotal
                                    }
                                    DataTabKeteranganBelanja .push(elementbb)
                                }
                                
                            }
                            // DataInsertAlokasi.push(element)
                            
                        }
                        // DataTabKeteranganBelanja = DataInsertAlokasi
                        // $scope.item.dataKeteranganBelanja = DataInsertAlokasi
                        $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.alokasimataanggaran,
                            group: $scope.groupmataanggaran,
                        });

                        $scope.dataSearchSourceKeteranganBelanja = $scope.dataSourceKeteranganBelanja

                        $scope.dataSourceDetailKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.detailalokasimataanggaran,
                        });
                        
                    })
                // $scope.popupDokter.center().open();
            }
            
           
            function LoadTotalKeterangan(){
                var idpegawai = ''
                    $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                    //console.log($scope.pegawaiLogin)
                    if($scope.pegawaiLogin.jenisPegawai.jenispegawai == "PenanggungJawab" || ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" && $scope.pegawaiLogin.id != 320263)){
                        idpegawai = $scope.pegawaiLogin.id
                    }
                    if($state.params.parameter == '77777'){
                        $scope.spjaja = true
                    } else if($state.params.parameter == '99999'){
                        $scope.panjaraja = true
                    } else if($state.params.parameter == '88888'){
                        $scope.sppaja = true
                    } else if($state.params.parameter == '66666'){
                        $scope.spmaja = true
                    } else if($state.params.parameter == '55555'){
                        $scope.semuaanggaran = true
                    }

                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahun="+moment($scope.item.thnAnggaran).format('YYYY')+"&tahap="+$scope.item.tahapdetail.id+"&idpegawai="+idpegawai+"&cek=" + $scope.item.isCekAdaAnggaranSaja+"&noreckegiatan=" + $scope.idkegiatananggaran).then(function (e) {
                        DataTotalMataAnggaran = e.data.data
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.dataSourceDetailMT = new kendo.data.DataSource({
                            data: DataTotalMataAnggaran
                        });
                        DataTabKeteranganBelanja  = [];//e.data.keteranganbelanja
                        // let DataInsertAlokasi = [];
                        console.log(e.data.keteranganbelanja)
                        let dataAlokasi =  e.data.alokasi;
                        for (let index = 0; index < e.data.keteranganbelanja.length; index++) {
                            let element = e.data.keteranganbelanja[index];
                            for (let aa = 0; aa < dataAlokasi.length; aa++) {
                                let alokasielement = dataAlokasi[aa];
                                for (let bb = 0; bb < alokasielement.length; bb++) {
                                    let elementbb = alokasielement[bb];
                                    if(elementbb.kodemataanggaran == element.kodemataanggaran){
                                        if(elementbb.bulanint == 1){
                                            elementbb.jan = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 2){
                                            elementbb.feb = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 3){
                                            elementbb.mar = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 4){
                                            elementbb.apr = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 5){
                                            elementbb.mei = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 6){
                                            elementbb.jun = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 7){
                                            elementbb.jul = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 8){
                                            elementbb.agt = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 9){
                                            elementbb.sep = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 10){
                                            elementbb.okt = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 11){
                                            elementbb.nov = elementbb.nilai
                                        }
                                        if(elementbb.bulanint == 12){
                                            elementbb.des = elementbb.nilai
                                        }

                                        elementbb.subtotal=element.subtotal
                                    }
                                    DataTabKeteranganBelanja .push(elementbb)
                                }
                                
                            }
                            // DataInsertAlokasi.push(element)
                            
                        }
                        // DataTabKeteranganBelanja = DataInsertAlokasi
                        // $scope.item.dataKeteranganBelanja = DataInsertAlokasi
                        $scope.dataSourceKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.alokasimataanggaran,
                            group: $scope.groupmataanggaran,
                        });

                        $scope.dataSearchSourceKeteranganBelanja = $scope.dataSourceKeteranganBelanja

                        $scope.dataSourceDetailKeteranganBelanja = new kendo.data.DataSource({
                            data: e.data.detailalokasimataanggaran,
                        });
                        
                    })
            }
            function LoadSPJ(){
                var tglawal = moment($scope.item.tglawal).format('YYYY-MM-DD');
                var tglakhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                
                medifirstService.get("perencanaan/get-spj?tglAwal="+tglawal+"&tglAkhir="+tglakhir+"&idpegawai="+$scope.idpegawailogin).then(function (e) {
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
            $scope.SettingTahap = function(){
                medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                    $scope.listSubKegiatanTransfer = e.data.subkegiatantransfer
                });
                
                $scope.popupTambahTahap.center().open()
            }

            $scope.DataPermenDigitKelima = function(){
                $scope.popupPermenKelima.center().open()
            }

            $scope.DataPermenDigitKeempat = function(){
                $scope.popupPermenKeempat.center().open()
            }

            $scope.PemindahanKeterangan = function(){
                
                $scope.popupPerubahan.center().open()
            }

            $scope.EntryAngkas = function(){
                $scope.item.urusanPemerintahan = ''
                $scope.item.organisasi = ''
                $scope.item.program = ''
                $scope.item.kegiatan = ''
                $scope.item.jenisbelanja = undefined
                $scope.item.pptktext = ''
                $scope.item.savepptk = ''
                $scope.item.subKegiatan = ''
                $scope.item.tolokUkurMasukan = ''
                $scope.item.targetKinerjaMasukan = ''
                $scope.item.tolokUkurKeluaran = ''
                $scope.item.targetKinerjaKeluaran = ''
                $scope.item.tolokUkurHasil = ''
                $scope.item.targetKinerjaHasil = ''
                $scope.item.tolokUkurMasukan = 'Dana'
                $scope.item.subsubkegiatandiv = { id: 4, div: "Sub Sub Kegiatan" }
                $scope.item.organisasi = '1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY'
                $scope.item.thnAnggaran = moment($scope.item.tahun).format('YYYY') 
                $scope.item.tahap = {id: $scope.item.searchtahapkeg.id, tahap: $scope.item.searchtahapkeg.tahap}
                $scope.popupAngkas.center().open()
            }

            $scope.ceklisOne = function (bool, data) {
                console.log(data)
                console.log($scope.listSubSubKegiatan)
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

            $scope.SaveSettingTahap = function () {
                if ($scope.arrayProdukTemp.length == 0) {
                    toastr.error('Data belum di pilih')
                    return
                }

                var objSave = {
                    "details": $scope.arrayProdukTemp,
                    "tahapawal": $scope.item.tahapawal,
                    "tahapakhir": $scope.item.tahapakhir,
                    "tahunakhir": moment($scope.item.tahunakhir).format('YYYY'),
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-setting-tahap', objSave).then(function (e) {
                    $scope.popupTambahTahap.center().close()
                    loadDataGrid();

                    $scope.arrayProdukTemp = []

                })

            }

            $scope.SavePermenKelima = function () {
                var id = 0
                if($scope.item.digit4 != undefined){
                    id = $scope.item.digit4.id
                }

                var objSave = {
                    "norec": $scope.norecpermenkelima,
                    "kode": $scope.item.kodedigit5,
                    "nama": $scope.item.namadigit5,
                    "keempatfk": id,
                }
                // return
                medifirstService.post('perencanaan/save-permen-kelima', objSave).then(function (e) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        $scope.dataSourcePermenKelima = e.data.konsolidasikelima
                    });
                })

            }

            $scope.SavePermenKeempat = function () {
                var id = 0
                if($scope.item.digit3 != undefined){
                    id = $scope.item.digit3.id
                }

                var objSave = {
                    "norec": $scope.norecpermenkeempat,
                    "kode": $scope.item.kodedigit41,
                    "nama": $scope.item.namadigit41,
                    "ketigafk": id,
                }
                // return
                medifirstService.post('perencanaan/save-permen-keempat', objSave).then(function (e) {
                    medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                        $scope.dataSourcePermenKeempat = e.data.konsolidasikeempat
                    });
                })

            }

            $scope.BaruPermenKelima = function () {

                $scope.item.digit4 = undefined
                $scope.item.kodedigit5= ''
                $scope.item.namadigit5= ''
                $scope.item.kodedigit4= ''
            }

            $scope.BaruPermenKeempat = function () {

                $scope.item.digit3 = undefined
                $scope.item.kodedigit41= ''
                $scope.item.namadigit41= ''
                $scope.item.kodedigit3= ''
            }


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
                        div: $scope.item.programdiv.id
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupProgram.center().close()
                }, function (error) {

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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                    $scope.popupUrusan.center().close()
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupProgram.center().close()
                    }, function (error) {
    
                    })
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupUrusan.center().close()
                    }, function (error) {
    
                    })
                })

                
            }
            $scope.HapusPopUpSubSubKegiatan = function(){
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupSubSubKegiatan.center().close()
                    }, function (error) {
    
                    })
                })

                
                
            }
            $scope.HapusPopUpTambahMT = function(){
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
                    medifirstService.post('perencanaan/delete-mata-anggaran', objSave).then(function (e) {
                        loadDataGrid();
                        $scope.popupTambahMT.center().close()
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
                            $scope.dataSourceKegiatan = e.data.kegiatan
                        })
                        $scope.popupSubKegiatan.center().close()
                    }, function (error) {
    
                    })
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

                //if()

                var objSave =
                    {
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
                        $scope.dataSourceKegiatan = e.data.kegiatan
                    })
                    
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
                    {
                        "field": "mataanggaranpermen",
                        "title": "Mata Anggaran Permen",
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

            $scope.columnRBABelum = {
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true, 
                columns:[
                    {
                        "command": [
                              {
                                 text: "Copy",
                                 click: copy,
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
                ]
            };

            $scope.columnPermenKelima = {
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true, 
                columns:[
                    {
                        "field": "kode",
                        "title": "Kode Rek",
                        "width": "80px"
                    },
                    {
                        "field": "mataanggaranpermen",
                        "title": "Nama Rekening",
                        "width": "200px"
                    },
                    {
                        "field": "kodeup",
                        "title": "Kode Up",
                        "width": "80px"
                    },
                    {
                        "field": "namaup",
                        "title": "Nama Up",
                        "width": "200px"
                    },
                    {
                        "command": [{
                            text: "Delete",
                            click: DeletePermenKelima,
                            
                        }, ],
                        title: "",
                        width: "40px",
                    },
                ]
            };

            $scope.columnPermenKeempat = {
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true, 
                columns:[
                    {
                        "field": "kode",
                        "title": "Kode Rek",
                        "width": "80px"
                    },
                    {
                        "field": "mataanggaranpermen",
                        "title": "Nama Rekening",
                        "width": "200px"
                    },
                    {
                        "field": "kodeup",
                        "title": "Kode Up",
                        "width": "80px"
                    },
                    {
                        "field": "namaup",
                        "title": "Nama Up",
                        "width": "200px"
                    },
                    {
                        "command": [{
                            text: "Delete",
                            click: DeletePermenKeempat,
                            
                        }, ],
                        title: "",
                        width: "40px",
                    },
                ]
            };

            $scope.columnRBASudah = {
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true, 
                columns:[
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
                ]
            };

            $scope.columnMataAnggaranPermen = {
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true, 
                columns:[
                    {
                        "field": "id",
                        "title": "Id",
                        "width": "50px"
                    },
                    {
                        "field": "kode",
                        "title": "Kode",
                        "width": "80px"
                    },
                    {
                        "field": "mataanggaranpermen",
                        "title": "Mata Anggaran Permen",
                        "width": "200px"
                    },
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
                                width: "100px",
                    },
                    {
                        "command": [
                              {
                                text: "Verifikasi",
                                click: verifSPJ,
                                imageClass: "clinic fa",
                              },
                              {
                                text: "Batal",
                                click: batalVerifSPJ,
                                imageClass: "clinic fa",
                              },
                          ],
                             title: "",
                             width: "100px",
                    },
                    {
                        "field": "mataanggaran",
                        "title": "Kode Rekening",
                        "width": "200px",
                        // hidden: true
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
                        "width": "130px",
                        // hidden: true,
                    },
                    {
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "200px",
                        // hidden: true
                    },
                    {
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "70px",
                        // hidden: true
                    },
                    {
                        "field": "bendahara",
                        "title": "Bendahara",
                        "width": "200px",
                        // hidden: true
                    },
                    {
                        "field": "penerima",
                        "title": "Penerima",
                        "width": "200px",
                        // hidden: true
                    },
                    {
                        "field": "pihakketiga",
                        "title": "Nama Pihak Ketiga",
                        "width": "150px",
                        // hidden: true
                    },
                    {
                        "field": "tglverif",
                        "title": "Tgl Verif",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "command": [
                              {
                                 text: "Delete",
                                 click: deleteDetailSPJ,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "100px",
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

                var jenisanggaran = null
                if ($scope.item.jenisanggaran != undefined) {
                    jenisanggaran = $scope.item.jenisanggaran.id
                }

                var konsolidasi5 = null
                if ($scope.item.konsolidasi5 != undefined) {
                    konsolidasi5 = $scope.item.konsolidasi5.id
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
                        mataanggaranpermenfk: konsolidasi5,
                    }
                medifirstService.post('perencanaan/save-mata-anggaran', objSave).then(function (e) {
                    $scope.item.jenisanggaran = undefined
                    $scope.item.konsolidasi5 = undefined
                    $scope.item.konsolidasi4 = undefined
                    $scope.item.konsolidasi3 = undefined
                    $scope.item.konsolidasi2 = undefined
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
                             width: "100px",
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
                        command: [{
                            text: "Hapus",
                            click: HapusRincianKas
                        }],
                        title: "",
                        width: "100px",
                    }
                ]
            };
            function HapusRincianKas(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                //console.log(dataItem);
                // return 
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

                    
                    medifirstService.post('anggaran/delete-anggaran-kas', itemDelete).then(function (e) {

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
            $scope.columnDetailSPJ = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-hide="dispptkspj" ng-click="TambahRincianBelanjaSPJ()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editDetailRincianBelanjaSPJ,
                                 imageClass: "clinic fa",
                              },
                              {
                                text: " ",
                                click: deleteDetailRincianBelanjaSPJ,
                                imageClass: "clinic fa fa-trash",
                             },
                          ],
                             title: "",
                             width: "100px",
                    },
                    {
                        "field": "nourut",
                        "title": "No. Urut",
                        "width": "100px"
                    },
                    {
                        "field": "uraian",
                        "title": "Keterangan",
                        "width": "200px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml",
                        "width": "150px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "100px"
                    },
                    {
                        "field": "harga",
                        "title": "Harga Satuan",
                        "width": "200px",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "200px",
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Item Rincian",
                        "width": "200px"
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
                    $scope.subtotalgakilang = dataMataAnggaranSelected
                    console.log($scope.subtotalgakilang)
                    let kodeArr = dataMataAnggaranSelected.kodemataanggaran.split(".");
                    let a1 = kodeArr[0] 
                    let b1 = kodeArr[1]
                    let c1 = kodeArr[2] 
                    let cek = 'III.'
                    // console.log(a1)
                    // console.log(b1)
                    // console.log(c1)
                    let myRega1 = new RegExp(a1 + ".*")
                    let myRegb1 = new RegExp(a1 + '.' + b1 + ".*")
                    let myRegc1 = new RegExp(a1 + '.' + b1 + '.' + c1 + ".*")
                    console.log(myRega1)
                    console.log(myRegb1)
                    console.log(myRegc1)
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
                    // DataKeteranganBelanja = e.data.data
                    // $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                    //     data: DataKeteranganBelanja
                    // });

                    if($scope.idkegiatanangkas != 0){
                        $scope.item.id = $scope.idkegiatanangkas
                    } else{
                        $scope.item.id = $scope.item.id
                    }

                    let TotalAnggaran = 0;
                    medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id+"&idmataanggaran="+$scope.rcn.idmataanggaran).then(function (e) {
                        DataKeteranganBelanja = e.data.data
                        $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                            data: DataKeteranganBelanja
                        });
                        for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                            let element = DataKeteranganBelanja[index];
                            TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                        }
                        TotalAnggaran = parseFloat(TotalAnggaran)
                        // $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                        // $scope.rcn.totalAnggaran = formatRupiah(TotalAnggaran, "Rp. ")
                        //$scope.rcn.sisaAnggaran = formatRupiah(TotalAnggaran - 0, "Rp. ")
                        //$scope.item.targetKinerjaMasukan = formatRupiah(TotalAnggaran, "Rp. ")
                        
                    })

                    // $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                    // $scope.rcn.totalAnggaran = formatRupiah(dataMataAnggaranSelected.total, "Rp. ")
                    // $scope.rcn.sisaAnggaran = formatRupiah(dataMataAnggaranSelected.total - 0, "Rp. ")

                    var rincianGrid = $("#rincianGrids").data("kendoGrid"); // get the grid widget
                    if($scope.idpegawailogin != ''){
                        rincianGrid.hideColumn(8);
                    }
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
                        objectasalprodukfk: $idasalproduk,
                        idtahap: $scope.item.tahapdetail.id,
                        tahap: $scope.item.tahapdetail.tahap,
                    }

                medifirstService.get("perencanaan/get-lock-entry-spj?subsubkegiatan="+$scope.item.id+"&tahap="+$scope.item.searchtahap.id).then(function (e) {
                    if(e.data.data[0].islockrba == true){
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
                            medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id+"&idmataanggaran="+$scope.rcn.idmataanggaran).then(function (e) {
                                DataKeteranganBelanja = e.data.data
                                $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                                    data: DataKeteranganBelanja
                                });
                                for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                                    let element = DataKeteranganBelanja[index];
                                    TotalAnggaran = TotalAnggaran + parseFloat(element.subtotal)
                                }
                                TotalAnggaran = parseFloat(TotalAnggaran)
                                medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.norecrcntotalanggaran).then(function (e) {
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
                                    });
                                });
                            $scope.popupTambahKeteranganBelanja.center().close()
                        }, function (error) {
        
                        })
                    }
                });
                
            }
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.TambahPihakKetiga = function(){
                $scope.idrekanan = ''
                $scope.item.namapihakketiga = ''
                $scope.PihakKetiga.center().open()
            }

            $scope.SavePihakKetiga = function () {
                var objSave = {
                    "id": $scope.idrekanan,
                    "namarekanan": $scope.item.namapihakketiga,
                    "npwp": $scope.item.npwp,
                    "alamat": $scope.item.alamat,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-pihak-ketiga', objSave).then(function (e) {
                    $scope.PihakKetiga.center().close()
                    init();
                })

            }

            $scope.TambahKeterangan = function(){

                if($scope.idkegiatanangkas != 0){
                    $scope.item.id = $scope.idkegiatanangkas
                } else{
                    $scope.item.id = $scope.item.id
                }
                medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id+"&idmataanggaran="+$scope.rcn.idmataanggaran).then(function (e) {
                    DataKeteranganBelanja = e.data.data
                    $scope.item.noUrutKT = DataKeteranganBelanja.length + 1
                })
                
                $scope.item.keteranganKT = ''
                $scope.item.jmlKT = ''
                $scope.item.hargaSatuanKT = ''
                $scope.item.subTotalKT = ''
                $scope.item.satuanKT = ''

                $scope.item.norecKT = ''
                $scope.popupTambahKeteranganBelanja.center().open()
            }

            $scope.TambahPanjar = function(){
                $scope.tambahpanjarspj = true
                $scope.item.sisaAnggaranPanjar = $scope.item.sisaAnggaranSPJ

                medifirstService.get("perencanaan/get-daftar-panjar"
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePanjar = new kendo.data.DataSource({
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
                
                $scope.item.subkegiatanpanjar = {id: $scope.item.subKegiatanSPJ.id, keterangan: $scope.item.subKegiatanSPJ.keterangan}
                $scope.item.subsubkegiatanpanjar = {id: $scope.item.subSubKegiatanSPJ.id, keterangan: $scope.item.subSubKegiatanSPJ.keterangan}
                $scope.item.darirekeningpanjar = {kodemataanggaran: $scope.item.mataAnggaranSPJ.kodemataanggaran, namamataanggaran: $scope.item.mataAnggaranSPJ.namamataanggaran}
                $scope.popupPanjar.center().open() 
            }

            $scope.TambahPanjarVerifSPJ = function(){
                $scope.tambahpanjarspj = true
                $scope.item.sisaAnggaranPanjar = $scope.item.sisaAnggaranSPJ

                medifirstService.get("perencanaan/get-daftar-panjar"
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePanjar = new kendo.data.DataSource({
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
                
                $scope.item.subkegiatanpanjar = $scope.subkegiatanverif
                $scope.item.subsubkegiatanpanjar = $scope.subsubkegiatanverif
                $scope.item.darirekeningpanjar = $scope.mataanggaranverif
                $scope.popupPanjar.center().open() 
            }

            $scope.CariPanjarVerifSPJ = function(){

                medifirstService.get("perencanaan/get-daftar-panjar-aktif?kodemataanggaran="+$scope.mataanggaranverif.kodemataanggaran
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePanjarAktif = new kendo.data.DataSource({
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
                $scope.popupPanjarAktif.center().open()
            }


            $scope.TambahPPTK = function(){
                medifirstService.get("perencanaan/get-daftar-pptk"
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

                if($scope.item.subSubKegiatankode != undefined && $scope.item.subSubKegiatankode != '' && $scope.item.namasubsubpptk != undefined && $scope.item.namasubsubpptk != ''){
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
                $scope.item.pptktext = ''
                $scope.item.savepptk = null
            }

            $scope.CetakSPJ = function(){
                //console.log($scope.item.isCetakLampiran)
                //console.log($scope.norecspj)
                if($scope.item.isCetakLampiran == true){
                    medifirstService.get("sysadmin/general/get-terbilang-tidak-bulat/" + $scope.item.jumlahSPJ).then(
                        function (dat) {
                            //console.log(dat.data.terbilang)
                            window.open(baseTransaksi + "report/get-cetak-spj?norec="+$scope.norecspj+"&terbilang="+dat.data.terbilang+"&sumberdana="+$scope.item.sumberDanaSPJ.id, '_blank');
                            
                        }
                    );
                } else if ($scope.item.isCetakLampiran == undefined){
                    medifirstService.get("sysadmin/general/get-terbilang-tidak-bulat/" + $scope.item.jumlahSPJ).then(
                        function (dat) {
                            //console.log(dat.data.terbilang)
                            window.open(baseTransaksi + "report/get-cetak-spj-satu-lampiran?norec="+$scope.norecspj+"&terbilang="+dat.data.terbilang+"&sumberdana="+$scope.item.sumberDanaSPJ.id, '_blank');
                            
                        }
                    );
                }
            }

            $scope.CariPanjar = function(){

                medifirstService.get("perencanaan/get-daftar-panjar-aktif?kodemataanggaran="+$scope.item.mataAnggaranSPJ.kodemataanggaran
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePanjarAktif = new kendo.data.DataSource({
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
                $scope.popupPanjarAktif.center().open()
            }

            $scope.CariPanjarVerif = function(){
                $scope.popupPanjarAktif.center().open()
            }
            
            $scope.TambahSPJ = function(){
                console.log($scope.dispptkspj)

                if($scope.idpegawailogin != ''){
                    $scope.dispptk = true
                } else{
                    $scope.dispptk = false
                }
                
                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD'));
                
                $scope.listSubKegiatanSPJ = [];
                ListSubKegiatan = [];
                for (let index = 0; index < DataKegiatan.length; index++) {
                    const element =  DataKegiatan[index];
                    if(element.div == 3){
                        ListSubKegiatan.push({'id':element.id,'keterangan' :element.kode + ' ' + element.keterangan,'kode' :element.kode})
                    }
                }

                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.listSubKegiatanSPJ = e.data.kegiatancombo
                })
                
                // $scope.listSubKegiatanSPJ = ListSubKegiatan
                $scope.item.subKegiatanSPJ = ""
                $scope.item.subSubKegiatanSPJ = ""
                $scope.item.mataAnggaranSPJ = ""
                $scope.item.sumberDanaSPJ =""
                $scope.item.sisaAnggaranSPJ=0
                $scope.item.panjar=0
                $scope.item.dasarKontraktualSPJ = ""

                $scope.item.jumlahSPJ = 0
                $scope.item.pph =0
                $scope.item.ppn = 0
                $scope.item.bendaharaSPJ = ""
                $scope.item.penerimaSPJ = ""
                $scope.item.pihakKetigaSPJ = ""
                $scope.item.radioPencairan = 1
                $scope.totalspjawal = $scope.item.jumlahSPJ

                // medifirstService.get("perencanaan/get-data-combo?tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                //     medifirstService.get("perencanaan/get-total-keterangan?tahap=" +e.data.setting[0].objecttahapaktivfk + "&subsubkegiatan=" + $scope.item.subSubKegiatanSPJ.id).then(function (e) {
                //         $scope.totalketerangan = e.data.data[0].totalketerangan
                //         $scope.totalrealisasidetail = e.data.detail[0].totalrealisasidetail
                //         $scope.totalpanjar = e.data.panjar[0].panjar
                //         $scope.item.sisaAnggaranSPJ = parseInt($scope.totalketerangan) - parseInt($scope.totalrealisasidetail) 
                //         //- parseInt($scope.totalpanjar)
                //         //console.log($scope.item.sisaAnggaranspj)
                //     })
                // })

                $scope.popupTambahSPJ.center().open()
            }
            $scope.TambahPanjarVerif = function(){
                //$scope.item.sisaAnggaranPanjar = $scope.item.sisaAnggaranSPJ
                $scope.tambahpanjarspj = false

                medifirstService.get("perencanaan/get-daftar-panjar"
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.data
                        //console.log(datas)
                        for(var i = 0; i < dat.data.data.length; i++){
                            dat.data.data[i].no = i+1
                        }
                        $scope.dataSourcePanjar = new kendo.data.DataSource({
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

                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.listSubKegiatanPanjarSPJ = e.data.kegiatancombo
                })
                $scope.popupPanjar.center().open()
            }
            $scope.changeCboPilihSubKegiatanSPJ = function () {
                if( $scope.item.subKegiatanSPJ == undefined){
                    return
                }
                console.log(DataKegiatan)
                let newArr = []
                for (let index = 0; index < DataKegiatan.length; index++) {
                    const element = DataKegiatan[index];
                    if(element.div == 4){
                        if($scope.namapegawailogin == ''){
                            if( element.kode.match($scope.item.subKegiatanSPJ.kode)){
                                newArr.push(element)
                            }
                        } else if($scope.namapegawailogin != ''){
                            if( element.kode.match($scope.item.subKegiatanSPJ.kode) && element.namalengkap.match($scope.namapegawailogin)){
                                newArr.push(element)
                            }
                        }
                        
                    }
                   
                }
                $scope.listSubSubKegiatanSPJ = [];
                $scope.listSubSubKegiatanSPJ = newArr
            }
            $scope.findKegiatan = function () {
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
                    $scope.dataSourceKegiatan = e.data.kegiatan
                })
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
                //$scope.listMataAnggaranSPJ = ListMataAnggaran
                
            }
            $scope.changeCboPilihNoRekening = function () {
                if( $scope.item.mataAnggaranSPJ == undefined){
                    return
                }
                console.log($scope.item.mataAnggaranSPJ)
                //$scope.item.sisaAnggaranSPJ = formatRupiah($scope.item.mataAnggaranSPJ.subtotal, "Rp. ")
                var tahap = $scope.item.searchtahapkeg.id
                $scope.item.sisaAnggaranSPJ2 = $scope.item.mataAnggaranSPJ.subtotal
                medifirstService.get("perencanaan/get-total-mata-anggaran?tahap="+tahap+"&kegiatan="+$scope.item.subSubKegiatanSPJ.id+"&mataanggaran="+$scope.item.mataAnggaranSPJ.kodemataanggaran).then(function (e) {
                    $scope.listAsalProduk = e.data.asalproduk
                    if(e.data.asal.length != 0){
                        $scope.item.sumberDanaSPJ = {id: e.data.asal[0].id, asalproduk: e.data.asal[0].asalproduk}
                    } else{
                        $scope.item.sumberDanaSPJ = undefined
                    }
                    
                });
                //$scope.listAsalProduk = [ $scope.item.mataAnggaranSPJ.asalproduk]
                
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

                medifirstService.get("perencanaan/get-data-combo-item-rincian?kegiatan="+$scope.item.subSubKegiatanSPJ.id+"&mataanggaran="+$scope.item.mataAnggaranSPJ.kodemataanggaran).then(function (e) {
                    $scope.listItemRincian = e.data.data
                    //console.log($scope.listItemRincian)
                })
                $scope.popupTambahDetailSPJ.center().open()
            }
            $scope.SimpanPopUpRincianBelanjaSPJ = function(){
                if($scope.item.itemRincian != undefined){
                    if($scope.item.SPJstatusTambah == 'new'){
                        // let nourut = DataDetailSPJ.length + 1
                        if($scope.item.subTotalSPJ > $scope.item.sisaAnggaranSPJ){
                            toastr.error('Subtotal yang diinput melebihi sisa anggaran', 'Informasi');
                            return
                        }
                        else{
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
                            //console.log(DataDetailSPJ)
                            let NewTotal = 0;
                            for (let index = 0; index < DataDetailSPJ.length; index++) {
                                const element = DataDetailSPJ[index];
                                NewTotal +=parseFloat(DataDetailSPJ[index].subtotal)
                            }
                            $scope.item.jumlahSPJ = NewTotal
                            $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
                            
                            $scope.item.sisaAnggaranSPJ -= $scope.item.subTotalSPJ
                        }
                        $scope.popupTambahDetailSPJ.center().close()
                    }else{
                        if($scope.subtotalbelanjasebelum < $scope.item.subTotalSPJ && (($scope.item.subTotalSPJ - $scope.subtotalbelanjasebelum) > $scope.item.sisaAnggaranSPJ)){
                            toastr.error('Subtotal yang diinput melebihi sisa anggaran', 'Informasi');
                            return
                        } else{
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
                            //console.log(DataDetailSPJ)
                            let NewTotal = 0;
                            for (let index = 0; index < DataDetailSPJ.length; index++) {
                                const element = DataDetailSPJ[index];
                                NewTotal += parseFloat(DataDetailSPJ[index].subtotal)
                            }
                            $scope.item.jumlahSPJ = NewTotal
                            $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
                            if($scope.subtotalbelanjasebelum > $scope.item.subTotalSPJ){
                                $scope.item.sisaAnggaranSPJ += ($scope.subtotalbelanjasebelum - $scope.item.subTotalSPJ)
                            } else if($scope.subtotalbelanjasebelum < $scope.item.subTotalSPJ){
                                $scope.item.sisaAnggaranSPJ -= ($scope.item.subTotalSPJ - $scope.subtotalbelanjasebelum)
                            }
                        }
                        
                        
                        $scope.popupTambahDetailSPJ.center().close()
                    }
                    
                }
            }
            function editDetailRincianBelanjaSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                //console.log(dataItem)
                
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
                $scope.subtotalbelanjasebelum = dataItem.subtotal
                
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
                //console.log(dataItem)
                var datasave =
                    {
                        norec :  dataItem.norec,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-rincian-belanja',datasave).then(function (e) {
                        $scope.item.sisaAnggaranSPJ += dataItem.subtotal
                    }, function (error) {
    
                    })
                })

                
                // DataDetailSPJ.push(dataAddSPJ)
                // let newARr = []
                // let a  = 0
                // for (let index = 0; index < DataDetailSPJ.length; index++) {
                //     if(DataDetailSPJ[index].nourut != dataItem.nourut){
                //         a++
                //         DataDetailSPJ[index].nourut = a
                //         newARr.push(DataDetailSPJ[index])
                //     }
                // }
                // $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                //     data: newARr
                // });
                // DataDetailSPJ = newARr
                // //console.log(DataDetailSPJ)
                // let NewTotal = 0;
                // for (let index = 0; index < DataDetailSPJ.length; index++) {
                //     const element = DataDetailSPJ[index];
                //     NewTotal += parseFloat(DataDetailSPJ[index].subtotal)
                // }
                // $scope.item.jumlahSPJ = NewTotal
                // $scope.item.jumlahtotalspjRP =formatRupiah(NewTotal, "Rp. ") 
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
                if($scope.item.bendaharaSPJ == undefined){
                    return
                }
                if($scope.item.penerimaSPJ == undefined){
                    return
                }
                
                


                var datasave =
                    {
                        norec :  $scope.norecverif,
                        tglrealisasi:  moment($scope.item.tglSPJ).format('YYYY-MM-DD'),
                        status: null,
                        totalbelanja:  $scope.item.jumlahSPJ,
                        rekananfk:  $scope.item.pihakKetigaSPJ.id,
                        deskripsi:  $scope.item.dasarKontraktualSPJ,
                        objectkegiatanfk:  $scope.item.subSubKegiatanSPJ.id,
                        objectmataanggaranfk:  $scope.item.mataAnggaranSPJ.kodemataanggaran,
                        bendaharafk:  $scope.item.bendaharaSPJ.value,
                        penerimafk:  $scope.item.penerimaSPJ.value,
                        pph:  $scope.item.pph,
                        ppn:  $scope.item.ppn,
                        realisasidetail: DataDetailSPJ,
                        objectcarabayarfk: parseInt($scope.item.radioPencairan),
                        norecpanjar:  $scope.norecpanjar
                    }

                medifirstService.get("perencanaan/get-lock-entry-spj?subsubkegiatan=" + $scope.item.subSubKegiatanSPJ.id ).then(function (e) {
                    if(e.data.data[0].islock == true){
                        toastr.error('Entry SPJ Sudah Dilock, Silahkan Hubungi Admin Untuk Unlock', 'Informasi');
                        return
                    } else{
                        medifirstService.get("perencanaan/get-lock-entry-spj-perrekening?mataanggaran=" + $scope.item.mataAnggaranSPJ.kodemataanggaran +"&subsubkegiatan=" + $scope.item.subSubKegiatanSPJ.id).then(function (e) {
                            if(e.data.data[0].islock == true){
                                toastr.error('Entry SPJ Sudah Dilock, Silahkan Hubungi Admin Untuk Unlock', 'Informasi');
                                return
                            } else{

                                if($scope.norecpanjar != ''){
                                    medifirstService.get("perencanaan/get-sisa-panjar?panjar=" + $scope.norecpanjar ).then(function (e) {
                                        if(((parseInt(e.data.jumlah[0].jumlah) - parseInt(e.data.totalbelanja[0].totalbelanja) - parseInt(e.data.pengembalian[0].jumlahpengembalian)) + $scope.totalspjawal) >= $scope.item.jumlahSPJ){
                                            medifirstService.get("perencanaan/get-penjagaan-verif-spj?norec=" + $scope.norecverif ).then(function (e) {
                                    
                                                if(e.data.detail.length == 0){
                                                        var cek = 123;
                                                }
                                                 else if(e.data.detail.length > 0){
                                                    if(e.data.detail[0].tglverif != null){
                                                        var cek = 234;
                                                    } else{
                                                        var cek = 123;
                                                    }
                                                }
                                          
                                                //console.log(cek);
                                          
                                                if(cek == 234){
                                                    messageContainer.error("Data yang sudah diverif tidak bisa diubah");
                                                } else if (cek == 123){
                                                    medifirstService.post('perencanaan/save-realisasi-spj',datasave).then(function (e) {
                                                        loadDataGrid();
                                                        $scope.popupTambahSPJ.center().close()
                                                    }, function (error) {
                                    
                                                    })
                                                }
                                            });
                                        } else{
                                            toastr.error('Total SPJ melebihi sisa panjar', 'Informasi');
                                            return
                                        }
                                    });
                                } else{
                                    medifirstService.get("perencanaan/get-penjagaan-verif-spj?norec=" + $scope.norecverif ).then(function (e) {
                                    
                                        if(e.data.detail.length == 0){
                                                var cek = 123;
                                        }
                                         else if(e.data.detail.length > 0){
                                            if(e.data.detail[0].tglverif != null){
                                                var cek = 234;
                                            } else{
                                                var cek = 123;
                                            }
                                        }
                                  
                                        //console.log(cek);
                                  
                                        if(cek == 234){
                                            messageContainer.error("Data yang sudah diverif tidak bisa diubah");
                                        } else if (cek == 123){
                                            medifirstService.post('perencanaan/save-realisasi-spj',datasave).then(function (e) {
                                                loadDataGrid();
                                                $scope.popupTambahSPJ.center().close()
                                            }, function (error) {
                            
                                            })
                                        }
                                    });
                                }

                            }
                        });
                    }
                });
            }
            function editDetailSPJ(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listBendahara = data
                    $scope.listPenerima = data
                })

                $scope.norecspj = dataItem.norec
                console.log(dataItem)

                if($scope.idpegawailogin != ''){
                    $scope.dispptk = true
                } else{
                    $scope.dispptk = false
                }

                medifirstService.get("perencanaan/get-one-panjar?norec=" +dataItem.norec).then(function (e) {
                    $scope.item.panjar = e.data.data[0].jumlah
                    //console.log($scope.item.panjar)
				})

                // if($scope.item.radioPencairan == 2){
                //     dispanjar = false
                // }
                
                if(dataItem.tglverif != null && $scope.idpegawailogin != ''){
                    $scope.dispptkspj = true
                    var kenGrid = $("#kGridDetail").data("kendoGrid");
                    kenGrid.hideColumn(0);
                } else{
                    $scope.dispptkspj = false
                    var kenGrid = $("#kGridDetail").data("kendoGrid");
                    kenGrid.showColumn(0);
                }

                let kegiatanArr = dataItem.kegiatan.split("~");
                let mataAnggaranArr = dataItem.mataanggaran.split("~");
                let kodeArr =kegiatanArr[0].split(" ");
                $scope.norecverif = dataItem.norec
                editDetailSPJ

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
                $scope.listSubKegiatanSPJ = [{id: dataItem.kodesubkegiatan,keterangan: dataItem.keterangansubkegiatan}] 
                $scope.item.subKegiatanSPJ = {id: dataItem.kodesubkegiatan,keterangan: dataItem.keterangansubkegiatan}
                

                $scope.item.tglSPJ =  new Date(moment($scope.now).format('YYYY-MM-DD'));

                $scope.listSubSubKegiatanSPJ =[{id: dataItem.objectkegiatanfk,keterangan: dataItem.kegiatan}] 
                $scope.item.subSubKegiatanSPJ =  {id: dataItem.objectkegiatanfk,keterangan: dataItem.kegiatan}

                medifirstService.get("perencanaan/get-kodemataanggaran?namamataanggaran=" +mataAnggaranArr[1]).then(function (e) {
                    $scope.listMataAnggaranSPJ = [{kodemataanggaran: e.data.data[0].kodemataanggaran, namamataanggaran: dataItem.mataanggaran}]
                    $scope.item.mataAnggaranSPJ = {kodemataanggaran: e.data.data[0].kodemataanggaran, namamataanggaran: dataItem.mataanggaran}
                    //console.log($scope.item.mataAnggaranSPJ)

                    var tahap = $scope.item.searchtahapkeg.id
                    medifirstService.get("perencanaan/get-total-mata-anggaran?tahap="+tahap+"&kegiatan="+$scope.item.subSubKegiatanSPJ.id+"&mataanggaran="+e.data.data[0].kodemataanggaran).then(function (e) {
                        $scope.listAsalProduk = e.data.asalproduk
                        if(e.data.asal.length != 0){
                            $scope.item.sumberDanaSPJ = {id: e.data.asal[0].id, asalproduk: e.data.asal[0].asalproduk}
                        } else{
                            $scope.item.sumberDanaSPJ = undefined
                        }
                        
                    });
				})
                
                // $scope.item.sumberDanaSPJ
                // $scope.item.sisaAnggaranSPJ
                // $scope.item.panjar
                $scope.item.dasarKontraktualSPJ = dataItem.deskripsi
                medifirstService.get("perencanaan/get-total-belanja?norec=" +dataItem.norec).then(function (e) {
                    $scope.item.jumlahSPJ = e.data.data[0].total
				})
                
                $scope.item.radioPencairan = dataItem.objectcarabayarfk
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
                    //console.log(element)
                    if(element.strukrealisasifk == dataItem.norec){
                        for (let i = 0; i < element.data.length; i++) {
                            element.data[i].nourut = i+1
                        }
                        newArr.push(element.data)
                    }
                }
                
                DataDetailSPJ = []
                DataDetailSPJ = newArr[0]
                $scope.dataSourceDetailSPJ = new kendo.data.DataSource({
                    data: DataDetailSPJ
                });
                $scope.totalspjawal = $scope.item.jumlahSPJ

                
                
                $scope.popupTambahSPJ.center().open()
            }

            function verifSPJ(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                $scope.item.jumlahdibayarSPJ = dataItem.totalbelanja
                $scope.item.radioPencairanVerifikasi = dataItem.objectcarabayarfk
                $scope.norecverif = dataItem.norec    
                
                
                $scope.subkegiatanverif = {id: dataItem.idsubkegiatan, keterangan: dataItem.keterangansubkegiatan}
                $scope.subsubkegiatanverif = {id: dataItem.idsubsubkegiatan, keterangan: dataItem.subsubkegiatan}
                $scope.mataanggaranverif = {kodemataanggaran: dataItem.kodemataanggaran, namamataanggaran: dataItem.namamataanggaran}
                $scope.popupVerifSPJ.center().open()
            }

            function PilihPanjar(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)
                //console.log($scope.norecverif)
                
                $scope.jumlahpanjar = dataItem.jumlah
                medifirstService.get('perencanaan/save-panjar-spj?nopanjar='+dataItem.nopanjar).then(function (e) {
                    $scope.norecpanjar = e.data.data[0].norec
                }, function (error) {
            
                })
                //console.log($scope.norecpanjar)
                $scope.item.panjar = dataItem.jumlah
                $scope.popupPanjarAktif.center().close()
            }

            function PilihSPD(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)
                $scope.item.nospd = dataItem.nospd
                
                $scope.popupCariSPD.center().close()
            }

            function DeleteSPD(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.norec,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-spd', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceSPD = e.data.spd
                        });
                    }, function (error) {
                
                    })
                })
            }

            function DeleteSPM(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.norec,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-spm', objSave).then(function (e) {
                        loadDataSPM();
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceCariSPM = e.data.carispm
                        });
                    }, function (error) {
                
                    })
                })
            }

            function DeleteSPP(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.norec,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-spp', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourceSPP = e.data.spp
                        });
                    }, function (error) {
                
                    })
                })
            }

            function DeletePermenKelima(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.id,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-permen-kelima', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourcePermenKelima = e.data.konsolidasikelima
                        });
                    }, function (error) {
                
                    })
                })
            }

            function DeletePermenKeempat(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.id,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-permen-keempat', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                            $scope.dataSourcePermenKeempat = e.data.konsolidasikeempat
                        });
                    }, function (error) {
                
                    })
                })
            }

            function DeletePanjar(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.norec,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-panjar', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-daftar-panjar"
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            var datas = dat.data.data
                            //console.log(datas)
                            for(var i = 0; i < dat.data.data.length; i++){
                                dat.data.data[i].no = i+1
                            }
                            $scope.dataSourcePanjar = new kendo.data.DataSource({
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
                    }, function (error) {
                
                    })
                })
            }

            function DeletePengembalian(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                //console.log(dataItem)

                var objSave =
                    {
                        norec: dataItem.norec,
                    }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-pengembalian', objSave).then(function (e) {
                        medifirstService.get("perencanaan/get-pengembalian-panjar?norec="+$scope.item.norecpengembalian ).then(function (e) {
                            $scope.dataSourcePengembalian = e.data.data
                        })
                        medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                                        
                            $scope.dataSourcePanjarPengembalian = e.data.panjar
                        });
                    }, function (error) {
                
                    })
                })
            }

            function deleteDetailSPJ(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                var objSave =
                    {
                        norec: dataItem.norec,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin menghapus data ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/delete-spj', objSave).then(function (e) {
                        loadDataGrid();
                    }, function (error) {
                
                    })
                })

                
            }

            function inputSPM(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                $scope.listJenisBukti = [
                    { id: 1, jenisbukti: "UP" },
                ];
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.item.nosppspm = dataItem.nospp
                $scope.item.tglsppspm = dataItem.tglspp
                $scope.item.tglSahSPM = dataItem.tglspp
                $scope.item.nospm = ''
                $scope.item.untuk = ''
                $scope.item.noreg = ''
                $scope.item.tglSPM = undefined
                $scope.item.nilaispm = dataItem.nilaispp
                $scope.item.itemJenisBuktiSPM = { id: 1, jenisbukti: "UP" }
                $scope.item.radioStatusSPM = "Diterima"
                loadDataSPM()
                $scope.popupSPM.center().open()
            }

            function PengembalianPanjar(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})

                
                $scope.popupPengembalian.center().open()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("perencanaan/get-pengembalian-panjar?norec="+dataItem.norec).then(function (e) {
                    $scope.dataSourcePengembalian = e.data.data
				})
                //console.log(dataItem)
                $scope.item.tglPengembalian = dataItem.tglpanjar
                $scope.item.sumberpengembalian = dataItem.sumberpanjar
                $scope.item.subkegiatanpengembalian = dataItem.subkegiatan
                $scope.item.subsubkegiatanpengembalian = dataItem.subsubkegiatan
                $scope.item.rekeningpengembalian = dataItem.kodemataanggaran
                $scope.item.norecpengembalian = dataItem.norec

                $scope.subkegiatanpengembalian = dataItem.idsubkegiatan
                $scope.subsubkegiatanpengembalian = dataItem.idsubsubkegiatan
                $scope.rekeningpengembalian = dataItem.idmataanggaran
            }

            
            function batalVerifSPJ(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.norecverif = dataItem.norec
                var objSave =
                    {
                        norec: $scope.norecverif,
                    }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin ingin batal verif ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('perencanaan/batal-verif-spj', objSave).then(function (e) {
                        loadDataGrid();
                    }, function (error) {
                
                    })
                })

                
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

            $scope.klikSPD = function (dataSPDSelected) {
                if (dataSPDSelected != undefined) {
                    $scope.norecspd = dataSPDSelected.norec
                    $scope.item.nospd = dataSPDSelected.nospd
                    $scope.item.nilaispd = dataSPDSelected.nilaispd
                    $scope.item.tglSPD = dataSPDSelected.tglspd
                    $scope.item.sumberDanaSPD = {id: dataSPDSelected.idasalproduk, asalproduk: dataSPDSelected.asalproduk}
                }
            }

            $scope.klikPermenKelima = function (dataPermenKelimaSelected) {
                if (dataPermenKelimaSelected != undefined) {
                    console.log(dataPermenKelimaSelected)
                    $scope.norecpermenkelima = dataPermenKelimaSelected.id
                    $scope.item.kodedigit4 = dataPermenKelimaSelected.kodeup+'.'
                    $scope.item.kodedigit5 = dataPermenKelimaSelected.kode
                    $scope.item.namadigit5 = dataPermenKelimaSelected.mataanggaranpermen
                }
            }

            $scope.klikPermenKeempat = function (dataPermenKeempatSelected) {
                if (dataPermenKeempatSelected != undefined) {
                    console.log(dataPermenKeempatSelected)
                    $scope.norecpermenkeempat = dataPermenKeempatSelected.id
                    $scope.item.kodedigit3 = dataPermenKeempatSelected.kodeup+'.'
                    $scope.item.kodedigit41 = dataPermenKeempatSelected.kode
                    $scope.item.namadigit41 = dataPermenKeempatSelected.mataanggaranpermen
                }
            }

            $scope.klikPanjar = function (dataPanjarSelected) {
                if (dataPanjarSelected != undefined) {
                    console.log(dataPanjarSelected)
                    $scope.norecpanjar = dataPanjarSelected.norec
                    $scope.item.tglPanjar = dataPanjarSelected.tglpanjar
                    $scope.item.sumberPanjar = dataPanjarSelected.sumberpanjar
                    $scope.item.uraianPanjar = dataPanjarSelected.uraian
                    $scope.item.jumlahpanjar = dataPanjarSelected.jumlah
                    $scope.item.idbill = dataPanjarSelected.idbill
                    $scope.item.ntpn = dataPanjarSelected.ntpn
                    $scope.item.idbillpph = dataPanjarSelected.idbillpph
                    $scope.item.ntpnpph = dataPanjarSelected.ntpnpph
                    $scope.item.pphpanjar = dataPanjarSelected.pph
                    $scope.item.ppnpanjar = dataPanjarSelected.ppn
                    $scope.item.jenispajak = {id: dataPanjarSelected.idpajak, jenispajak: dataPanjarSelected.jenispajak}
                    $scope.item.subkegiatanpanjar = {id: dataPanjarSelected.idsubkegiatan, keterangan: dataPanjarSelected.keterangansubkegiatan}
                    $scope.item.subsubkegiatanpanjar = {id: dataPanjarSelected.idsubsubkegiatan, keterangan: dataPanjarSelected.keterangansubsubkegiatan}
                    $scope.item.darirekeningpanjar = {kodemataanggaran: dataPanjarSelected.kodemataanggaran, namamataanggaran: dataPanjarSelected.namamataanggaran}
                    console.log($scope.norecpanjar)
                }
            }

            $scope.klikPengembalian = function (dataPengembalianSelected) {
                if (dataPengembalianSelected != undefined) {
                    console.log(dataPengembalianSelected)
                    $scope.norecpengembalian = dataPengembalianSelected.norec
                    $scope.item.tglPengembalian = dataPengembalianSelected.tglpengembalian
                    $scope.item.jumlahpengembalianpanjar = dataPengembalianSelected.jumlahpengembalian
                    $scope.pengembalianawal = dataPengembalianSelected.jumlahpengembalian
                    $scope.item.keteranganpengembalian = dataPengembalianSelected.keterangan
                }
            }

            $scope.klikSPPSPM = function (dataSPPSelected) {
                if (dataSPPSelected != undefined) {
                    $scope.dataSPP = dataSPPSelected
                }
            }

            $scope.klikSPMFix = function (dataSPMSelected) {
                if (dataSPMSelected != undefined) {
                    $scope.dataSPM = dataSPMSelected
                }
            }

            $scope.klikSPM = function (dataSPMSelected) {
                if (dataSPMSelected != undefined) {
                    console.log(dataSPMSelected)
                    $scope.norecspm = dataSPMSelected.norec
                    $scope.item.nospm = dataSPMSelected.nospm
                    if(dataSPMSelected.jenisbukti != null){
                        $scope.item.itemJenisBuktiSPM = { id: 1, jenisbukti: "UP" }
                    } else{
                        $scope.item.itemJenisBuktiSPM = {}
                    }
                    $scope.item.untuk = dataSPMSelected.untukpengeluaran
                    $scope.item.radioStatusSPM = dataSPMSelected.status
                    $scope.item.noreg = dataSPMSelected.noreg
                    $scope.item.tglSPM = dataSPMSelected.tglspm
                    $scope.item.nosppspm = dataSPMSelected.nospp
                    $scope.item.tglsppspm = dataSPMSelected.tglspm
                    $scope.item.tglSahSPM = dataSPMSelected.tglsah
                    $scope.item.nilaispm = dataSPMSelected.nilaispm
                    $scope.item.sumberDanaSPM = {id: dataSPMSelected.idasalproduk, asalproduk: dataSPMSelected.asalproduk}
                }
            }

            function DetailSPM(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem != undefined) {
                    console.log(dataItem)
                    $scope.norecspm = dataItem.norec
                    $scope.item.nospm = dataItem.nospm
                    if(dataItem.jenisbukti != null){
                        $scope.item.itemJenisBuktiSPM = { id: 1, jenisbukti: "UP" }
                    } else{
                        $scope.item.itemJenisBuktiSPM = {}
                    }
                    $scope.item.untuk = dataItem.untukpengeluaran
                    $scope.item.radioStatusSPM = dataItem.status
                    $scope.item.noreg = dataItem.noreg
                    $scope.item.tglSPM = dataItem.tglspm
                    $scope.item.nosppspm = dataItem.nospp
                    $scope.item.tglsppspm = dataItem.tglspp
                    $scope.item.tglSahSPM = dataItem.tglsah
                    $scope.item.nilaispm = dataItem.nilaispm

                    $scope.hidetabspm = true
                    $scope.item.sumberDanaSPM = {id: dataItem.idasalproduk, asalproduk: dataItem.asalproduk}

                    $scope.popupSPM.center().open()
                }
            }

            function DetailSPP(e) {
                e.preventDefault();
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem != undefined) {
                    console.log(dataItem)

                    $scope.listJenisBukti = [
                        { id: 1, jenisbukti: "UP" },
                    ];
                    $scope.listBulan = [
                        { id: 1, bulan: "Januari" },
                        { id: 2, bulan: "Februari" },
                        { id: 3, bulan: "Maret" },
                        { id: 4, bulan: "April" },
                        { id: 5, bulan: "Mei" },
                        { id: 6, bulan: "Juni" },
                        { id: 7, bulan: "Juli" },
                        { id: 8, bulan: "Agustus" },
                        { id: 9, bulan: "September" },
                        { id: 10, bulan: "Oktober" },
                        { id: 11, bulan: "November" },
                        { id: 12, bulan: "Desember" },
                    ];


                    $scope.norecspp = dataItem.norec
                    $scope.item.nospp = dataItem.nospp
                    if(dataItem.jenisbukti != null){
                        $scope.item.itemJenisBukti = { id: 1, jenisbukti: "UP" }
                    } else{
                        $scope.item.itemJenisBukti = {}
                    }
                    $scope.item.dasarPengeluaran = dataItem.dasarpengeluaran
                    $scope.item.radioStatusSPP = dataItem.status
                    $scope.item.nospd = dataItem.nospd
                    $scope.item.tglSPP = dataItem.tglspp

                    if(dataItem.bulan == "Januari"){
                        $scope.item.itemBulan = { id: 1, bulan: "Januari" }    
                    } else if(dataItem.bulan == "Februari"){
                        $scope.item.itemBulan = { id: 2, bulan: "Februari" }    
                    } else if(dataItem.bulan == "Maret"){
                        $scope.item.itemBulan = { id: 3, bulan: "Maret" }   
                    } else if(dataItem.bulan == "April"){
                        $scope.item.itemBulan = { id: 4, bulan: "April" }   
                    } else if(dataItem.bulan == "Mei"){
                        $scope.item.itemBulan = { id: 5, bulan: "Mei" } 
                    } else if(dataItem.bulan == "Juni"){
                        $scope.item.itemBulan = { id: 6, bulan: "Juni" }
                    } else if(dataItem.bulan == "Juli"){
                        $scope.item.itemBulan = { id: 7, bulan: "Juli" }
                    } else if(dataItem.bulan == "Agustus"){
                        $scope.item.itemBulan = { id: 8, bulan: "Agustus" }
                    } else if(dataItem.bulan == "September"){
                        $scope.item.itemBulan = { id: 9, bulan: "September" }
                    } else if(dataItem.bulan == "Oktober"){
                        $scope.item.itemBulan = { id: 10, bulan: "Oktober" }
                    } else if(dataItem.bulan == "November"){
                        $scope.item.itemBulan = { id: 11, bulan: "November" }
                    } else if(dataItem.bulan == "Desember"){
                        $scope.item.itemBulan = { id: 12, bulan: "Desember" }
                    }


                    $scope.item.untukPengeluaran = dataItem.pengeluaran
                    $scope.item.tglSah = dataItem.tglsah
                    $scope.item.nilaispp = dataItem.nilaispp
                    $scope.item.sumberDanaSPP = {id: dataItem.idasalproduk, asalproduk: dataItem.asalproduk}
                    $scope.popupSPP.center().open()
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
                $scope.dataSourceRincianAnggaran = []
                $scope.item.isCekAdaAnggaranSaja = false
                if($scope.item.subsubkegiatanangkas != undefined){
                    LoadTotalKeterangan()
                    $scope.norecrcntotalanggaran = $scope.item.subsubkegiatanangkas.norec 
                    medifirstService.get("perencanaan/get-total-anggaran-rcn?kegiatan=" + $scope.norecrcntotalanggaran).then(function (e) {
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
            function HapusAnggaranKas(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                //console.log(dataItem)
                // return 
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
                    medifirstService.post('anggaran/delete-anggaran-kas', itemDelete).then(function (e) {
                        LoadTotalKeterangan()
                        loadDataGrid();
                    })
                })
            }









            /////////////////////////////////////////////////////////////////////
        }
    ]);
});