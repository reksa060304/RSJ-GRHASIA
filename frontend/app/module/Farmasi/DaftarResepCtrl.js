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

            //***********************************

        }
    ]);
});
