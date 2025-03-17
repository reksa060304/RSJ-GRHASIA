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

                    medifirstService.get("anggaran/get-combo-anggaran?&idpegawai=" + idpegawai).then(function (e) {
                        $scope.listAsalProduk = e.data.asalproduk
                        $scope.listMataAnggaran = e.data.mataanggaran

                        $scope.item.tahunspj = moment(e.data.setting[0].tahunanggaran).format('YYYY')

                        // get subsubkegiatan
                        medifirstService.get("anggaran/get-subsubkegiatan?&idpegawai=" + idpegawai).then(function (res) {

                            $scope.listSubSubKegiatanspj = res.data

                            LoadSPJ();


                        })

                    });
                })
                
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
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

                let tahunSPJ = ""
                if($scope.item.tahunspj !== undefined && $scope.item.tahunspj !== null){
                    tahunSPJ = "&tahun=" + moment($scope.item.tahunspj).format('YYYY')
                }
                
                medifirstService.get("anggaran/get-spj?tglAwal=" + tglawal
                    + "&tglAkhir=" + tglakhir
                    + "&status=" + stat
                    + "&subsubkegiatan=" + sub
                    + "&asalproduk=" + asalproduk
                    + mataanggaran
                    + cari
                    + tahunSPJ
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
                    
                    var selectedSubKegiatan = ($scope.item.kegiatansubsubspj !== undefined && $scope.item.kegiatansubsubspj !== null) ? $scope.item.kegiatansubsubspj.namakegiatan : "";
                    var kodesubsubkegiatan = ($scope.item.kegiatansubsubspj !== undefined && $scope.item.kegiatansubsubspj !== null) ? $scope.item.kegiatansubsubspj.kodekegiatan : "";

                    // function extractNamaKegiatan(kegiatan) {
                    //     var parts = kegiatan.split('-');
                    //     if (parts.length > 1) {
                    //         var nama = parts.slice(-1).join(' ').trim();
                    //         return nama ? nama : "Sub Kegiatan tidak tersedia";
                    //     }
                    //     return "Sub Kegiatan tidak tersedia";
                    // }
                
                    // var namaKegiatan = extractNamaKegiatan(selectedSubKegiatan);
                    var namaKegiatan = selectedSubKegiatan
                
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
                        "width": "150px",
                        //hidden: true
                    },
                    {
                        "field": "tglbku",
                        "title": "Tanggal BKU",
                        "width": "150px",
                    }
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