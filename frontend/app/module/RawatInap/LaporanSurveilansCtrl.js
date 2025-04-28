define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';

    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('LaporanSurveilansCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper', '$http', '$state',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, dateHelper, $http, $state) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;

            $scope.monthOption = {
                start: "year",
                depth: "year"
            }

            FormLoad();

            var dataLoad = []

            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;

                //Tanggal Default
                $scope.item.tglawal = moment($scope.now).format('YYYY-MM-01 00:00');
                $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawaiLogin();

                medifirstService.get("rawatinap/get-combo-surveilan", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listPasien = dat.data.kelompokpasien;

                });

                // get master surveilans
                medifirstService.get("verif-hais/get-combo-verif-hais", true).then(async function (dat) {
                    $scope.isRouteLoading = false;
                    var data = dat.data
                    
                    renderColumn(data);

                    LoadData()

                })

            }

            function renderColumn(data) {
                setColumnDefault();
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    var header = $scope.columndinamis.map(function(e) { return e.title; }).indexOf(element.jenisbundle);
                    // console.log(header)
                    if(header > -1) {
                        var item = 
                        {
                            field: `w${element.id}`, 
                            title: element.namabundle, 
                            width: 150,
                            template: `# if(w${element.id}=='1') {# ✔ # } else {# - #} #`,
                            headerAttributes: { style: "text-align : center" },
                        }
                        // console.log(item);
                        $scope.columndinamis[header].columns.push(item);
                    } else {
                        var item = 
                        { 
                            field: '', 
                            title: element.jenisbundle,
                            // width: 100,
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    field: `w${element.id}`, 
                                    title: element.namabundle, 
                                    width: 150,
                                    template: `# if(w${element.id}=='1') {# ✔ # } else {# - #} #`,
                                    headerAttributes: { style: "text-align : center" },
                                }
                            ]
                        }
                        $scope.columndinamis.push(item);
                    }
                }
               
                creategrid();
            }

            function setColumnDefault() {
                $scope.columndinamis = [
                    
                    {
                        field: 'tglformat',
                        title: "TANGGAL",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'no',
                        title: "NO",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'namapasien',
                        title: "NAMA PASIEN",
                        width: 150,
                        locked: true,
                    },
                    {
                        field: 'namaruangan',
                        title: "Ruangan",
                        width: 150,
                        locked: true,
                    },
                    {
                        field: 'tirahbaring',
                        title: "Tirah Baring",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'keterangan',
                        title: "Keterangan",
                        width: 150,
                        locked: true,
                    },
                    {
                        field: 'obatantibiotik',
                        title: "Obat Anti Biotik",
                        width: 150,
                        locked: true,
                    },
                    // {
                    //     field: "jeniskelamin",
                    //     title: "JENIS KELAMIN",
                    //     locked: true,
                    // },
                    // {
                    //     field: "suhu",
                    //     title: "SUHU",
                    //     locked: true
                    // },
                    // {
                    //     field: "umur",
                    //     title: "UMUR",
                    //     locked: true,
                    // },
                    // {
                    //     field: "diagnosa",
                    //     title: "DIAGNOSA MEDIS",
                    //     locked: true,
                    // }
                ]
            }

            function creategrid () {
                $("#grid").empty();
                $("#grid").kendoGrid({
                    dataSource: {
                        data: dataLoad,
                        pageSize: dataLoad.length
                    },
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    pageable: true,
                    scrollable: true,
                    editable: true,
                    selectable: "single",
                    columns: $scope.columndinamis
                }).data("kendoGrid");
            }

            function LoadData() {

                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }


                // var chacePeriode = {
                //     0: tglAwal,
                //     1: tglAkhir
                // }
                // cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
                // medifirstService.get("rawatinap/get-data-surveilans?"
                //     + "tglAwal=" + tglAwal
                //     + "&tglAkhir=" + tglAkhir
                //     + tempDepartemenId
                //     + tempRuanganId
                //     + tempKelPasienId).then(function (data) {
                //         $scope.isLoadingData = false;
                //         var datas = data.data.data;
                //         $scope.sourceLaporan = new kendo.data.DataSource({
                //             data: datas,
                //             pageSize: 10,
                //             total: data.length,
                //             serverPaging: false,
                //             schema: {
                //                 model: {
                //                     fields: {
                //                     }
                //                 }
                //             }
                //         });
                //     })

                // diambil dari surveilan hais
                medifirstService.get("verif-hais/get-bundlehaisv2" 
                    + "?tglawal=" + tglAwal
                    + "&tglakhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId)
                    .then(function(res){
                        
                        for (let i = 0; i < res.data.dataHais.length; i++) {
                            const element = res.data.dataHais[i];
                            element.no = i+1
                            element.tglformat = $scope.formatTanggal(element.tglpemeriksaan);
                        }

                        dataLoad = res.data.dataHais;
                        creategrid()

                    })
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                LoadData();
            }

            // $scope.laporanBundleHais = function(){
            //     if(!$scope.item.tglawal) {
            //         toastr.error("Harap pilih tanggal awal terlebih dahulu !");
            //         return
            //     }

            //     if(!$scope.item.tglakhir) {
            //         toastr.error("Harap pilih tanggal akhir terlebih dahulu !");
            //         return
            //     }

            //     if(!$scope.item.ruangan){
            //         toastr.error("Harap pilih ruangan terlebih dahulu !");
            //         return
            //     }

            //     var profile = JSON.parse(localStorage.getItem('profile'));

            //     window.open(baseTransaksi
            //         + 'verif-hais/laporan-bundle-hais'
            //         + '?tglawal=' + moment($scope.item.tglawal).format("YYYY-MM-DD")
            //         + '&tglakhir=' + moment($scope.item.tglakhir).format("YYYY-MM-DD")
            //         + '&objectruanganfk=' + $scope.item.ruangan.id
            //         + '&kdprofile=' + profile.id)
            // }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            // $scope.Perbaharui = function () {
            //     $scope.ClearSearch();
            // }

            // $scope.ClearSearch = function () {
            //     $scope.item = {};
            //     $scope.item.tglawal = $scope.now;
            //     $scope.item.tglakhir = $scope.now;
            //     $scope.Search();
            // }

            // $scope.columnLaporan = {
            //     toolbar: ["excel"],
            //     excel: {
            //         fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
            //         allPages: true,
            //     },
            //     selectable: 'row',
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "tglsurveilans",
            //             "title": "Tgl Surveilans",
            //             "width": "150px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>"
            //         },
            //         {
            //             "field": "namapasien",
            //             "title": "Nama Pasien",
            //             "width": "180px",

            //         },
            //         {
            //             "field": "detail",
            //             "title": "Tindakan",
            //             "columns": [
            //                 {"field": "detail.urincateter", "title" : "Urin Carteter"},
            //                 {"field": "detail.infus", "title" : "Intravena perifer/infus"},
            //                 {"field": "detail.ngt", "title" : "NGT"},
            //                 {"field": "detail.oksigen", "title" : "OKSIGEN"},
            //             ]
            //         }
                    
            //     ]
            // };

            $scope.cetakLaporanBulanan = function(){
                $scope.popUpCetakLaporanBulanan.center().open()
            }

            $scope.batalCetakBulanan = function(){
                // reset tgl cetak
                $scope.item.tglCetakBulanan = ''
                $scope.item.departementCetak = null
                $scope.item.ruanganCetak = null

                $scope.popUpCetakLaporanBulanan.close()
            }

            $scope.getIsiComboRuanganCetak = function () {
                $scope.listRuanganCetak = $scope.item.departementCetak.ruangan
            }

            $scope.cetakLaporanSurveilansBulanan = function(){

                // validasi
                if(!$scope.item.tglCetakBulanan){
                    toastr.error('Pilih tanggal dulu')
                    return
                }

                if(!$scope.item.ruanganCetak){
                    toastr.error('Pilih ruangan dulu')
                    return
                }

                window.open(baseTransaksi + "report/laporan-bundle-hais-bulanan" 
                    + "?tglcetak=" + moment($scope.item.tglCetakBulanan).format('YYYY-MM-DD')
                    + "&objectruanganfk=" + $scope.item.ruanganCetak.id, '_blank');

            }

            // #region cetak harian
            $scope.cetakLaporanHarian = function(){
                $scope.popUpCetakLaporanHarian.center().open()
            }

            $scope.batalCetakHarian = function(){
                // reset tgl cetak
                $scope.item.tglCetakHarian = ''
                $scope.item.departementCetakHarian = null
                $scope.item.ruanganCetakHarian = null

                $scope.popUpCetakLaporanHarian.close()
            }

            $scope.getIsiComboRuanganCetakHarian = function () {
                $scope.listRuanganCetakHarian = $scope.item.departementCetakHarian.ruangan
            }

            $scope.cetakLaporanSurveilansHarian = function(){
                // validasi
                if(!$scope.item.tglCetakHarian){
                    toastr.error('Pilih tanggal dulu')
                    return
                }

                if(!$scope.item.ruanganCetakHarian){
                    toastr.error('Pilih ruangan dulu')
                    return
                }

                window.open(baseTransaksi + "report/laporan-bundle-hais-harian" 
                    + "?tglcetak=" + moment($scope.item.tglCetakHarian).format('YYYY-MM-DD')
                    + "&objectruanganfk=" + $scope.item.ruanganCetakHarian.id, '_blank');
            }

            // #endregion cetak harian

            // $scope.columnLaporanHarian = {
            //     toolbar: ["excel"],
            //     excel: {
            //         fileName: "Data Surveilans Harian" + moment($scope.now).format('DD/MMM/YYYY') + ".xls",
            //         allPages: true,
            //     },
            //     selectable: 'row',
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "no",
            //             "title": "No",
            //             "width": "45px"
            //         },
            //         {
            //             "field": "tglsurveilans",
            //             "title": "Tgl Surveilans",
            //             "width": "90px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglsurveilans #')}}</span>"
            //         },
            //         {
            //             "field": "nocm",
            //             "title": "No RM",
            //             "width": "100px",
            //             "template": "<span class='style-center'>#: nocm #</span>"
            //         },
            //         {
            //             "field": "namapasien",
            //             "title": "Nama Pasien",
            //             "width": "180px",

            //         },
            //         {
            //             "field": "umur",
            //             "title": "U",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "jk",
            //             "title": "JK",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "namadiagnosa",
            //             "title": "Dx Medis",
            //             "width": "100px"
            //         },
            //         {
            //             "title": "Tindakan",
            //             "columns": [
            //                 {
            //                     "field": "ett",
            //                     "title": "ETT",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "cvl",
            //                     "title": "CVL",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "ivl",
            //                     "title": "IVL",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "uc",
            //                     "title": "UC",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "op",
            //                     "title": "OP",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "tb",
            //                     "title": "TB",
            //                     "width": "75px"
            //                 }
            //             ]
            //         },
            //         {
            //             "title": "Infeksi RS",
            //             "columns": [
            //                 {
            //                     "field": "PHLEBITIS",
            //                     "title": "ISK",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "DIARE",
            //                     "title": "IDO",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "ISK",
            //                     "title": "Phlebitis",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "iadp",
            //                     "title": "IADP",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "vap",
            //                     "title": "VAP",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "dekubitus",
            //                     "title": "Dekubitus",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "hap",
            //                     "title": "HAP",
            //                     "width": "75px"
            //                 }
            //             ]
            //         },
            //         {
            //             "field": "hasilkultur",
            //             "title": "Hasil Kultur",
            //             "width": "115px"
            //         },
            //         {
            //             "field": "namaproduk",
            //             "title": "Antibiotik",
            //             "width": "115px"
            //         }
            //     ]
            // };

            // $scope.columnLaporanIDO = {
            //     toolbar: ["excel"],
            //     excel: {
            //         fileName: "Data Surveilans Harian" + moment($scope.now).format('DD/MMM/YYYY') + ".xls",
            //         allPages: true,
            //     },
            //     selectable: 'row',
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "no",
            //             "title": "No",
            //             "width": "45px"
            //         },
            //         {
            //             "field": "namapasien",
            //             "title": "Nama Pasien",
            //             "width": "180px",

            //         },
            //         {
            //             "field": "noregistrasi",
            //             "title": "Noregistrasi",
            //             "width": "100px",
            //             "template": "<span class='style-center'>#:  #</span>"
            //         },
            //         {
            //             "field": "tglmasuk",
            //             "title": "Tgl Masuk",
            //             "width": "90px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
            //         },
            //         {
            //             "field": "tglkeluar",
            //             "title": "Tgl Keluar",
            //             "width": "90px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
            //         },
            //         {
            //             "field": "namadiagnosa",
            //             "title": "Dx Medis",
            //             "width": "115px"
            //         },
            //         {
            //             "field": "namaproduk",
            //             "title": "Tindakan",
            //             "width": "115px"
            //         },
            //         {
            //             "title": "Jenis Operasi",
            //             "columns": [
            //                 {
            //                     "field": "bersih",
            //                     "title": "B",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "bersihkotor",
            //                     "title": "BK",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "kotor",
            //                     "title": "K",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "kotortercemar",
            //                     "title": "KTR",
            //                     "width": "75px"
            //                 }
            //             ]
            //         },
            //         {
            //             "field": "scoresatu",
            //             "title": "Score",
            //             "width": "75px"
            //         },
            //         {
            //             "title": "ASA Klasifikasi",
            //             "columns": [
            //                 {
            //                     "field": "satu",
            //                     "title": "1",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "dua",
            //                     "title": "2",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "tiga",
            //                     "title": "3",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "empat",
            //                     "title": "4",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "lima",
            //                     "title": "5",
            //                     "width": "75px"
            //                 }
            //             ]
            //         },
            //         {
            //             "field": "scoredua",
            //             "title": "Score",
            //             "width": "75px"
            //         },
            //         {
            //             "title": "T Time",
            //             "columns": [
            //                 {
            //                     "field": "scoretiganol",
            //                     "title": "<",
            //                     "width": "75px"
            //                 },
            //                 {
            //                     "field": "scoretigasatu",
            //                     "title": ">",
            //                     "width": "75px"
            //                 }
            //             ]
            //         },
            //         {
            //             "field": "",
            //             "title": "Score",
            //             "width": "75px"
            //         },
            //         {
            //             "field": "totalscore",
            //             "title": "Total Score",
            //             "width": "75px"
            //         },
            //         {
            //             "field": "hasilkultur",
            //             "title": "Hasil Kultur",
            //             "width": "115px"
            //         },
            //         {
            //             "field": "statusimplant",
            //             "title": "Implant",
            //             "width": "115px"
            //         }
            //     ]
            // };

            // $scope.surveilans_Harian = function () {
            //     $scope.isRouteLoading = true;
            //     var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
            //     var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

            //     var tempDepartemenId = "";
            //     if ($scope.item.departement != undefined) {
            //         tempDepartemenId = "&idDept=" + $scope.item.departement.id;
            //     }
            //     var tempRuanganId = "";
            //     if ($scope.item.ruangan != undefined) {
            //         tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
            //     }

            //     var tempKelPasienId = "";
            //     if ($scope.item.KelompokPasien != undefined) {
            //         tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
            //     }


            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir
            //     }
            //     cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
            //     medifirstService.get("rawatinap/get-data-harian-surveilans?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir
            //         + tempDepartemenId
            //         + tempRuanganId
            //         + tempKelPasienId).then(function (data) {
            //             $scope.isLoadingData = false;
            //             var datas = data.data.data;
            //             var data2 = [];
            //             for (var i = datas.length - 1; i >= 0; i--) {
            //                 datas[i].no = i + 1
            //                 var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
            //                 var bln = umur.month,
            //                     thn = umur.year,
            //                     day = umur.day
            //                 datas[i].umur = thn + 'thn ' + bln + 'bln ' + day + 'hr ';
            //             }
            //             $scope.sourceLaporanHarian = new kendo.data.DataSource({
            //                 data: datas,
            //                 pageSize: 10,
            //                 total: data.length,
            //                 serverPaging: false,
            //                 schema: {
            //                     model: {
            //                         fields: {
            //                         }
            //                     }
            //                 }
            //             });
            //             $scope.popup_Harian.center().open();
            //         })

            // }

            // $scope.surveilans_IDO = function () {
            //     $scope.isRouteLoading = true;
            //     var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
            //     var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

            //     var tempDepartemenId = "";
            //     if ($scope.item.departement != undefined) {
            //         tempDepartemenId = "&idDept=" + $scope.item.departement.id;
            //     }
            //     var tempRuanganId = "";
            //     if ($scope.item.ruangan != undefined) {
            //         tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
            //     }

            //     var tempKelPasienId = "";
            //     if ($scope.item.KelompokPasien != undefined) {
            //         tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
            //     }


            //     var chacePeriode = {
            //         0: tglAwal,
            //         1: tglAkhir
            //     }
            //     cacheHelper.set('LaporanSurveilansCtrl', chacePeriode);
            //     medifirstService.get("rawatinap/get-data-ido-surveilans?"
            //         + "tglAwal=" + tglAwal
            //         + "&tglAkhir=" + tglAkhir
            //         + tempDepartemenId
            //         + tempRuanganId
            //         + tempKelPasienId).then(function (data) {
            //             $scope.isLoadingData = false;
            //             var datas = data.data.data;
            //             for (var i = datas.length - 1; i >= 0; i--) {
            //                 datas[i].no = i + 1
            //                 if (datas[i].jenisoperasi == 'BERSIH') {
            //                     datas[i].bersih = 0
            //                     datas[i].scoresatu = 0
            //                 } else if (datas[i].jenisoperasi == 'BERSIH KOTOR') {
            //                     datas[i].bersihkotor = 0
            //                     datas[i].scoresatu = 0
            //                 } else if (datas[i].jenisoperasi == 'KOTOR') {
            //                     datas[i].kotor = 1
            //                     datas[i].scoresatu = 1
            //                 } else if (datas[i].jenisoperasi == 'KOTOR TERCEMAR') {
            //                     datas[i].kotortercemar = 1
            //                     datas[i].scoresatu = 1
            //                 }

            //                 if (datas[i].asascore == '1') {
            //                     datas[i].satu = 0
            //                     datas[i].scoredua = 0
            //                 } else if (datas[i].asascore == '2') {
            //                     datas[i].dua = 0
            //                     datas[i].scoredua = 0
            //                 } else if (datas[i].asascore == '3') {
            //                     datas[i].tiga =
            //                         datas[i].scoredua = 1
            //                 } else if (datas[i].asascore == '4') {
            //                     datas[i].empat = 1
            //                     datas[i].scoredua = 1
            //                 } else if (datas[i].asascore == '5') {
            //                     datas[i].lima = 1
            //                     datas[i].scoredua = 1
            //                 }

            //                 if (datas[i].implant == 1) {
            //                     datas[i].statusimplant = 'terpasang'
            //                 } else {
            //                     datas[i].statusimplant = '-'
            //                 }

            //                 if (datas[i].scoresatu == 0 && datas[i].scoredua == 0) {
            //                     datas[i].scoretiganol == 0
            //                 } else {
            //                     datas[i].scoretigasatu == 0
            //                 }

            //                 if (datas[i].scoresatu == 0 && datas[i].scoredua == 0 && datas[i].scoretiganol == 0) {
            //                     datas[i].totalscore = 0
            //                 } else if (datas[i].scoresatu == 1 && datas[i].scoredua == 1 && datas[i].scoretigasatu == 1) {
            //                     datas[i].totalscore = 1
            //                 }

            //             }

            //             $scope.sourceLaporanIDO = new kendo.data.DataSource({
            //                 data: datas,
            //                 pageSize: 10,
            //                 total: data.length,
            //                 serverPaging: false,
            //                 schema: {
            //                     model: {
            //                         fields: {
            //                         }
            //                     }
            //                 }
            //             });
            //             $scope.popup_Ido.center().open();
            //         })
            // }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        }
    ]);
});