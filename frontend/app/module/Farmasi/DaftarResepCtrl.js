define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarResepCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {

            // initialize.controller('DaftarResepCtrl', ['$q', '$rootScope', '$scope', 'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};            
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.jmlRows = 100;
            $scope.isRouteLoading = false;
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            // LoadCache();
            var produkDef = []
            var jenisPelayananId = ''
            var norec_apd = '';
            var norec_pd = '';
            loadCombo();
            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listRuanganDepo = dat.data.ruanganfarmasi;
                    LoadCache();
                });
                $scope.listJenisRacikan = [{ id: 1, jenisracikan: 'Puyer' }]
            }
            $scope.clearFilter  = function(){
                cacheHelper.set('DaftarResepCtrl2', undefined);
                $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');                
                $scope.item.instalasi = null;                               
                $scope.item.ruangan = null;                
                $scope.item.ruanganDepo = null;  
                $scope.item.jmlRows = 100;
                $scope.item.noReg = "";
                $scope.item.noMr = "";
                $scope.item.namaPasien = "";
                $scope.item.noResep = "";
                init()
            }
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepCtrl2');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        //$scope.listDepartemen = [chacePeriode[2]]
                        $scope.item.instalasi = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.listRuangan = [chacePeriode[3]]
                        $scope.item.ruangan = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        //$scope.item.listKelompokPasien = [chacePeriode[4]]
                        $scope.item.kelompokPasien = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.item.noReg = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.item.noMr = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.namaPasien = chacePeriode[7]
                    }

                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }
            
            $scope.cariEnter  = function(){
                init()
            }
            
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                var tempInstalasi = [];
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                    tempInstalasi = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }
                var rg = ""
                var tempRuangan = [];
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                    tempRuangan = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }

                
                var farmasi = ""
                if ($scope.item.ruanganDepo != undefined) {
                    var farmasi = "&IdFarmasi=" + $scope.item.ruanganDepo.id
                }
                var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}

                var kp = ""
                var tempKelompokPasien = [];
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kpid=" + $scope.item.kelompokPasien.id
                    tempKelompokPasien = { id: $scope.item.kelompokPasien.id, kelompokpasien: $scope.item.kelompokPasien.kelompokpasien }
                }

                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    tempNoReg = $scope.item.noReg;
                }

                var tempnoMr = "";
                if ($scope.item.noMr != undefined) {
                    tempnoMr = $scope.item.noMr;
                }

                var tempNamaPasien = "";
                if ($scope.item.namaPasien != undefined) {
                    tempNamaPasien = $scope.item.namaPasien;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-daftar-resep?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noresep=" + $scope.item.noResep +
                    "&noregistrasi=" + $scope.item.noReg +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien + ins + rg + farmasi 
                    + '&jmlRows=' + jmlRows//+Jra
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.daftar[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });                        
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: tempInstalasi,
                    3: tempRuangan,
                    4: tempKelompokPasien,
                    5: tempNoReg,
                    6: tempnoMr,
                    7: tempNamaPasien
                }
                cacheHelper.set('DaftarResepCtrl2', chacePeriode);


                
            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.TransaksiPelayanan = function () {
                //debugger;
                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.klid,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec_apd,
                    9: 'resep',
                    10: $scope.dataSelected.tgllahir,
                }
                cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                $state.go('TransaksiPelayananApotik')

                var arrStr2 = {
                    0: $scope.dataSelected.norec
                }
                cacheHelper.set('DaftarResepCtrl', arrStr2);
                $state.go('DaftarResepCtrl')
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarResepPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Resep Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Resep",
                        "width": "50px",
                    },
                    {
                        "field": "noresep",
                        "title": "NoResep",
                        "width": "60px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "60px",
                    },
                    {
                        "field": "nocm",
                        "title": "No MR",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "100px",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pembayaran",
                        "width": "80px",
                    },
                    
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px"
                    },
                    {
                        "field": "namaruanganapotik",
                        "title": "Apotik",
                        "width": "70px",
                    },
                    {
                        "field": "closingkasir",
                        "title": "Closing Kasir",
                        "width": "100px",
                    }
                ]					
			};
            
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
            function itungUsia(tgl) {
                //debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }

            $scope.inputTindakan = function () {
                if($scope.item.ruanganAntrian == undefined)return
                medifirstService.get("radiologi/get-apd?noregistrasi="
                    + $scope.dataSelected.noregistrasi
                ).then(function (data) {
                    $scope.daftarApd = data.data.ruangan;
                    if ($scope.daftarApd.length > 0) {
                        var status = false
                        var norec_apd = ''
                        for (var i = 0; i < $scope.daftarApd.length; i++) {
                            status = false
                            if ($scope.daftarApd[i].id == $scope.item.ruanganAntrian.id) {
                                status = true
                                norec_apd = $scope.daftarApd[i].norec_apd
                                break
                            }
                        }
                        if (status == true) {
                            $scope.showTindakan(norec_apd)
                        } else {
                            $scope.saveAPD()
                        }
                    }
                })
            }
            $scope.detailTagihan = function () {
                 if($scope.dataSelected== undefined){
                    toastr.error('Pilih data dulu')
                    return
                }
                var obj = {
                    noRegistrasi: $scope.dataSelected.noregistrasi
                }

                $state.go('RincianTagihan', {
                    dataPasien: JSON.stringify(obj)
                });
                
            }
            $scope.saveAPD = function (argument) {
                $scope.tombolSimpanVis = true;
                var dataKonsul = {
                    "asalrujukanfk": 5, //datang sendiri
                    "norec_pd": $scope.dataSelected.norec_pd,
                    "dokterfk": $scope.dataSelected.pgid,
                    "objectruangantujuanfk": $scope.item.ruanganAntrian.id,
                    "objectruanganasalfk": $scope.dataSelected.ruid,
                    "objectkelasfk": $scope.dataSelected.klid,
                    "tglregistrasidate":moment($scope.dataSelected.tglregistrasi).format('YYYY-MM-DD')
                }
                medifirstService.post('radiologi/save-apd', dataKonsul).then(function (e) {
                    $scope.tombolSimpanVis = false;
                    var norec_apd = e.data.data.norec
                   
                    $scope.showTindakan(norec_apd)

                }, function (error) {
                    $scope.tombolSimpanVis = true;
                })
            }
            $scope.showTindakan = function (norec_apd) {
                cacheHelper.set('norec_resep_qwertyuio',$scope.dataSelected.norec);
                $state.go('InputTindakan', {
                    norecPD: $scope.dataSelected.norec_pd,
                    norecAPD: norec_apd,

                });
               
            }
            $scope.showPop =  function () {
                 cacheHelper.set('norec_resep_qwertyuio',undefined);
                 if($scope.dataSelected== undefined){
                    toastr.error('Pilih data dulu')
                    return
                }

                medifirstService.get("sysadmin/general/get-status-close/" + $scope.dataSelected.noregistrasi, false).then(function (rese) {
                    if (rese.data.status == true) {
                        toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                        $scope.isSelesaiPeriksa = true
                        return
                    } else {
                        $scope.listRuanganApd = []

                        $scope.listRuanganApd = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                        $scope.item.ruanganAntrian = $scope.listRuanganApd[0]
                        $scope.popupAntrians.center().open()

                    }
                })
            }

            function loadRiwayat(params) {

                medifirstService.get('emr/get-riwayat-order-penunjang?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }
            // console.log($rootScope.getRekamMedisCheck());
            $rootScope.getRekamMedisCheck = function (bool) {

                if (bool) {
                    loadRiwayat('noregistrasi=' + $scope.dataSelected.noregistrasi)
                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }

            $scope.hasil = function (criteria) {
                //buat lab
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                })
                medifirstService.get("emr/get-combo-penunjang?departemenfk=3", true).then(function (dat) {

                    $scope.item.ruanganAsal = $scope.item.namaRuangan
                    $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    $scope.item.ruangantujuan = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan,
                        ipaddress: dat.data.ruangantujuan[0].ipaddress != undefined ? dat.data.ruangantujuan[0].ipaddress : null
                    }
                    $scope.getProduk($scope.item.ruangantujuan)
                    // // $scope.listLayanan = dat.data.produk;
                    // namaRuanganFk = dat.data.data[0].objectruanganfk
                    // norec_pd = dat.data.data[0].noregistrasifk
                });
                // medifirstService.get("get-detail-login", true).then(function (dat) {
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()
                // });
                // console.log($scope.dataSelected);
                if ($scope.dataSelected.noregistrasi != undefined) {
                    loadRiwayat('noregistrasi=' + $scope.dataSelected.noregistrasi)

                } else {
                    loadRiwayat('NoCM=' + $scope.dataSelected.nocm)

                }

                $scope.popUpHasilRad.center().open()
            }
            
            $scope.tutup = function () {
                $scope.popUpHasilRad.close()
            }
            $scope.lihatHasilLab = function () {
                if ($scope.dataHasilRad == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                // var arrStr = {
                //     0: $scope.dataSelected.nocm,
                //     1: $scope.dataSelected.namapasien,
                //     2: $scope.resDataAPD.jeniskelamin,
                //     3: $scope.dataSelected.noregistrasi,
                //     4: $scope.dataSelected.umur,
                //     5: $scope.dataSelected.kelompokpasien,
                //     6: $scope.dataSelected.tglregistrasi,
                //     7: $scope.resDataAPD.norec_apd,
                //     8: $scope.dataSelected.norec_pd,
                //     9: $scope.resDataAPD.idkelas,
                //     10: $scope.resDataAPD.namakelas,
                //     11: $scope.resDataAPD.objectruanganfk,
                //     12: $scope.resDataAPD.namaruangan + '`',
                //     13: '',
                //     14: null,
                //     15: [],
                // }

                // cacheHelper.set('chaceHasilLab2', arrStr);
                $state.go('HasilLaboratorium', {
                    // norecPd: $scope.dataHasilRad.norecpd,
                    noOrder: $scope.dataHasilRad.noorder,
                    // norecApd: $scope.resDataAPD.norec_apd,
                })

            }
            $scope.HasilExpertise = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                $scope.sourceExpRad = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });

                var tanggal = $scope.now;
                var tanggalLahir = new Date($scope.dataSelected.tgllahir);
                var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                $scope.dataSelected.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
                $scope.popupExp = $scope.dataSelected
                medifirstService.get('registrasi/daftar-registrasi/get-daftar-expertise-rad?noregistrasi=' +
                    $scope.dataSelected.noregistrasi).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }
                    $scope.isRouteLoading = false
                    $scope.sourceExpRad = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });
                });
                $scope.popUpExpRad.center().open();
            }
            $scope.tutupExp = function () {
                HapusExp();
            }
            function HapusExp() {
                $scope.popupExp = {}
                $scope.sourceExpRad = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                $scope.popUpExpRad.close();
            }
            $scope.columnExpRad = [{
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tanggal",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "120px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                }
            ];
            $scope.lihatHasilExpertasi = function () {
                if ($scope.dataExpRad == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = $scope.dataExpRad.namaproduk
                $scope.item.dokters = $scope.dataExpRad.namalengkap
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataExpRad.norec_pp + '&idproduk=' + $scope.dataExpRad.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        $scope.norecHasilRadiologi = e.data[0].norec
                        $scope.item.nofoto = e.data[0].nofoto
                        $scope.item.tglInput = new Date(e.data[0].tanggal)
                        $scope.item.dokter = {
                            id: e.data[0].pegawaifk,
                            namalengkap: e.data[0].namalengkap
                        }
                        $scope.item.keterangan = e.data[0].keterangan.replace(/~/g, "\n")
                    }
                    $scope.popUpEkpertise.center().open();
                })

                medifirstService.get('radiologi/get-ekspertise?norec_pp=' + $scope.dataExpRad.norec_pp).then(function (e) {
                    if (e.data.status) {
                        if (e.data.data.list.length > 0) {
                            $scope.cekhasilrad = false;
                            $scope.listNamaGambar = e.data.data.list;
                            $scope.itemimg.gambar = {
                                norec: e.data.data.list[0].norec,
                                filename: e.data.data.list[0].filename
                            }
                            $scope.itemimg.keterangan = e.data.data.list[0].keterangan
                            var temp = e.data.data.list[0].filename.slice(0, e.data.data.list[0].filename.indexOf('.'))
                            $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
                        }
                    } else {
                        $scope.cekhasilrad = true;
                        $scope.itemimg.img = "./images/noimage.png"
                        window.messageContainer.error("Belum ada Ekspertise");
                    }
                }).error(function (err) {
                    $scope.item.img = "./images/noimage.png"
                });
            }
            

            $scope.columnGridRiwayat = [{
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },

                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                    "width": "70px",
                }
            ];
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };

            //get produk ruangan
            $scope.getProduk = function (ruangan) {
                $scope.listProdukCek = []
                $scope.item.layanan = []
                produkDef = []
                medifirstService.get("sysadmin/general/get-tindakan-with-details?idRuangan=" +
                        ruangan.id +
                        "&idKelas=" +
                        $scope.item.idKelas

                        +
                        "&idJenisPelayanan=" +
                        jenisPelayananId +
                        "&isLabRad=true")
                    .then(function (x) {
                        $scope.listProdukCek = x.data.details
                        produkDef = x.data.details
                        // $scope.listLayanan = x;
                        // $scope.item.layanan = '';
                        // $scope.item.hargaTindakan = '';
                        //    $scope.isRouteLoading = false;

                    })
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            // var jenisPelayananId = ''
            // var namaRuanganFk = ''
            // LoadCacheHelper();

            // function LoadCacheHelper() {
            //     // debugger;
            //     var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
            //     if (chacePeriode != undefined) {
            //         //var arrPeriode = chacePeriode.split(':');
            //         $scope.item.noMr = chacePeriode[0]
            //         nocm_str = chacePeriode[0]
            //         $scope.item.namaPasien = chacePeriode[1]
            //         $scope.item.jenisKelamin = chacePeriode[2]
            //         $scope.item.noregistrasi = chacePeriode[3]
            //         $scope.item.umur = chacePeriode[4]
            //         $scope.item.kelompokPasien = chacePeriode[5]
            //         $scope.item.tglRegistrasi = chacePeriode[6]
            //         norec_apd = chacePeriode[7]
            //         norec_pd = chacePeriode[8]
            //         $scope.item.idKelas = chacePeriode[9]
            //         $scope.item.kelas = chacePeriode[10]
            //         $scope.item.idRuangan = chacePeriode[11]
            //         namaRuanganFk = chacePeriode[11]
            //         $scope.item.namaRuangan = chacePeriode[12]
            //         $scope.header.DataNoregis = chacePeriode[13]
            //         $scope.jeniskelaminfk = chacePeriode[22]
            //         $scope.tgllahirpasien = chacePeriode[18]
            //         // if ($scope.header.DataNoregis == undefined) {
            //         //     $scope.header.DataNoregis = false;
            //         // }
            //         if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
            //             $scope.showTombol = true
            //         }
            //         // medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
            //         //     $scope.item.noregistrasi, true).then(function (dat) {
            //         //         $scope.item.statusVerif = dat.data.status
            //         //     });
            //         //  ** cek status closing
            //         medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
            //             if (rese.data.status == true) {
            //                 toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
            //                 $scope.isSelesaiPeriksa = true
            //             }
            //         })
            //         medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + norec_pd).then(function (e) {
            //             jenisPelayananId = e.data.jenispelayanan
            //             init()
            //         })
            //         //** */
            //     }

            // }
            $scope.LihatHasil = function (data) {
                // debugger;
                console.log($scope.dataSelectedRiwayat);
                console.log($scope.dataSelected);
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                cacheHelper.set('hideHasilLab', undefined);
                console.log($scope.dataSelected.objectjeniskelaminfk);
                if ($scope.dataSelected.norec_apd != null) {
                    var arrStr = {
                        0: $scope.dataSelected.nocm,
                        1: $scope.dataSelected.namapasien,
                        2: $scope.dataSelected.jeniskelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.dataSelected.umur,
                        5: $scope.dataSelected.kelompokpasien,
                        6: $scope.dataSelected.tglregistrasi,
                        7: $scope.dataSelected.norec_apd,
                        8: $scope.dataSelected.norec_pd,
                        9: $scope.item.idKelas,
                        10: $scope.item.kelas,
                        11: $scope.dataSelected.objectruanganfk,
                        12: '',
                        13: $scope.dataSelected.tgllahir,
                        14: $scope.dataSelectedRiwayat.objectjeniskelaminfk,
                        15: [],
                        16: $scope.dataSelectedRiwayat.norec
                        // 16: $scope.dataGrid._data[i].tglpelayanan ,
                    }
                    console.log(arrStr);
                    cacheHelper.set('hideHasilLab', true);
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    // $state.go('HasilLaboratoriumRev', {
                    //     norecPd: norec_pd,
                    //     norecApd: norec_apd,
                    //     norecPP: dataCetakFix
                    // SGFzaWxMYWJvcmF0b3JpdW1SZXY=

                    // })
                    // window.open("/app/#/SGFzaWxMYWJvcmF0b3JpdW0=/"+ $scope.dataSelectedRiwayat.noorder)
                    window.open("/app/#/SGFzaWxMYWJvcmF0b3JpdW1SZXY=/" + $scope.dataSelected.norec_pd + "/" + $scope.dataSelected.norec_apd)
                    // $state.go('HasilLaboratorium', {
                    //     noOrder: $scope.dataSelectedRiwayat.noorder,
                    //     // norecApd: norec_apd,
                    //     // norecPP: dataCetakFix
                    // })
                    // if(urlHasilVansLab ==''){
                    //     toastr.error('Periksa Setting Data Fixed VANS LAB ')
                    //     return
                    // }
                    // $window.open(urlHasilVansLab +  $scope.dataSelectedRiwayat.noorder, "_blank");
                    // var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                    // cacheHelper.set('chaceHasilLab', arrStr);
                    // $state.go('HasilLaboratorium', {
                    //     norecPd: $scope.dataSelectedRiwayat.norecpd,
                    //     noOrder: $scope.dataSelectedRiwayat.noorder,
                    //     norecApd: norec_apd,
                    // })
                }

            }

            //***********************************

        }
    ]);
});
