define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('DaftarBarangInvestasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.bukanLogistik = true;
            $scope.now = new Date();
            $scope.item = {};
            LoadDataCombo();

            function LoadCache() {
                // $scope.item.namarekanan = undefined
                var chacePeriode = cacheHelper.get('DaftarBarangInvestasiCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD HH:ii:ss'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD HH:ii:ss'));
                    LoadData();
                }
            }

            function LoadDataCombo() {
                var DataRuanganAll = [];
                var chacePeriode = cacheHelper.get('DaftarBarangInvestasiCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.Awal = new Date(arrPeriode[0]);
                    $scope.item.Akhir = new Date(arrPeriode[1]);

                } else {

                    $scope.item.Awal = $scope.now;
                    $scope.item.Akhir = $scope.now;
                }

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.sourceDetailJenis = dataCombo.detailjenisproduk
                });
                // $scope.sourceRuangan = medifirstService.getMapLoginUserToRuangan();
                // if ($scope.sourceRuangan != undefined) {
                //     $scope.item.ruangan = {id:$scope.sourceRuangan[0].id,namaruangan:$scope.sourceRuangan[0].namaruangan};
                // }else{
                medifirstService.get("sysadmin/general/get-combo-ruangan-general").then(function (dat) {
                    $scope.sourceDepartemen = dat.data.departemen;
                });
                //}

                // Load pegawai_m
                medifirstService.get('sysadmin/master/get-daftar-master-pegawai').then(function(data){
                    $scope.listPegawai = data.data
                })

                LoadData();
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD hh:mm:ss');

                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&ruangancurrenfk=" + $scope.item.ruangan.id
                }
                // var kdproduk="";
                // if ($scope.item.produk !== undefined) {
                //     kdproduk = "&kdproduk=" +$scope.item.produk.id;
                // }
                var kdDetailJenis = "";
                if ($scope.item.DetailJenis != undefined) {
                    kdDetailJenis = "&kdDetailJenis=" + $scope.item.DetailJenis.id;
                }
                var namaproduk = "";
                if ($scope.item.NamaProduk != undefined) {
                    namaproduk = "&namaproduk=" + $scope.item.NamaProduk;
                }
                medifirstService.get("logistik/get-daftar-asset?"
                    +"tglAwal="+tglAwal
                    +"&tglAkhir="+tglAkhir
                    + ruanganId + kdDetailJenis + namaproduk, true).then(function (dat) {
                        //debugger
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }

                        $scope.sourceBarang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                        // var chacePeriode = tglAwal + "~" + tglAkhir;
                        // cacheHelper.set('DaftarBarangInvestasiCtrl', chacePeriode);

                    });
            };

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "50px",
                    // filterable: false
                },
                {
                    "field": "noregisteraset",
                    "title": "No Aset"
                },
                {
                    "field": "kdbmn",
                    "title": "Kode BMN"
                },
                {
                    "field": "namaproduk",
                    "title": "Nama Barang"
                },
                {
                    "field": "spesifikasi",
                    "title": "Spesifikasi"
                },
                {
                    "field": "jenisaset",
                    "title": "Jenis Asset"
                },
                {
                    "field": "qtyprodukaset",
                    "title": "Qty Asset"
                },
                {
                    "field": "ruangancurrent",
                    "title": "Ruangan"
                },
                {
                    "field": "asalproduk",
                    "title": "SumberDana"
                }
            ]

            // };
            // manageSarpras.getOrderList("anggaran/get-ruangan", true).then(function(e){
            //     $scope.item.ruangan = e.data.data;
            // console.log(JSON.stringify($scope.item.ruangan));

            // manageSarpras.getListAset($scope.item.ruangan.id, '', '').then(function(dat) {
            //     $scope.sourceBarang = new kendo.data.DataSource({
            //         data: dat.data.data
            //     });
            // });
            // //debugger;
            // });

            $scope.Search = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Pilih Ruangan terlebih dahulu!!!')
                    return
                }

                if($scope.item.tglAwal == undefined){
                    toastr.error('Pilih Periode tanggal terlebih dahulu')
                    return
                }
                LoadData();
                // var ruanganId, awal, akhir, periode;
                // if ($scope.item.ruangan !== undefined) {
                //     ruanganId = $scope.item.ruangan.id;
                // }else {
                //     ruanganId = '';
                // }
                // if (!$scope.item.awal !== undefined) {
                //     awal = DateHelper.getPeriodeFormatted($scope.item.awal);
                // }else {
                //     awal = '';
                // }
                // if (!$scope.item.akhir !== undefined) {
                //     akhir = DateHelper.getPeriodeFormatted($scope.item.akhir);
                // }else {
                //     akhir = '';
                // }
                // periode = "&periodeAwal=" + awal + "&periodeAhir=" + akhir;

                // manageSarpras.getListAset(ruanganId, awal, akhir).then(function(dat) {
                //     $scope.sourceBarang = new kendo.data.DataSource({
                //         data: dat.data.data
                //     });
                ////debugger;
                // });
            };

            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }

            $scope.DetailAsset = function () {
                //debugger;
                if ($scope.dataSelected == undefined) {
                    alert("Data Asset Belum Dipilih!!")
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'InputDetailAsset',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('MasterBarangInvestasiCtrl', chacePeriode);
                $state.go('MasterBarangInvestasi');
            }

            $scope.KirimAsset = function () {
                debugger;
                if ($scope.dataSelected == undefined) {
                    alert("Data Asset Belum Dipilih!!")
                    return
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'KirimBarangAsset',
                    2: $scope.dataSelected.noregisteraset,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangAsetCtrl', chacePeriode);
                $state.go('KirimBarangAset');
            }

            $scope.getIsiComboRuangan = function () {
                $scope.sourceRuangan = $scope.item.departemen.ruangan
            }

            $scope.Cetak = function(){

                if($scope.item.tglAwal == undefined){
                    toastr.error('Periode Tanggal perlu dipilih')
                    return
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend 
                    + "report/cetak-daftar-barang-asset?" 
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kodeprofile=" + profile)

                medifirstService.get("report/cetak-daftar-barang-asset?"
                        +"tglAwal="+tglAwal
                        +"&tglAkhir="+tglAkhir)
                    .then(function (dat) {
                        console.log(dat)
                });
            }

            $scope.confirmCetakKartuInventaris = function(){
                $scope.popUp.center().open();
            }

            $scope.batalCetakKartuInventaris = function(){
                $scope.popUp.close()
                $scope.item.kepala = undefined
                $scope.item.penanggungjawab = undefined
            }
            
            $scope.cetakKartuInventaris = function(){
                if($scope.item.ruangan == undefined){
                    toastr.error('Ruangan Perlu dipilih')
                    return
                }

                if($scope.item.tglAwal == undefined){
                    toastr.error('Periode Tanggal perlu dipilih')
                    return
                }

                if($scope.item.kepala == undefined){
                    toastr.error('Kepala Perlu dipilih')
                    return
                }
                if($scope.item.penanggungjawab == undefined){
                    toastr.error('Penanggung Jawab Perlu dipilih')
                    return
                }

                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend 
                    + "report/cetak-kartu-inventaris-ruangan?"
                    + "kodeprofile=" + profile
                    + "&ruangancurrenfk=" + $scope.item.ruangan.id
                    + "&idkepala=" + $scope.item.kepala.id
                    + "&idpenanggung=" + $scope.item.penanggungjawab.id
                )
                
            }

            $scope.cetakKIBB = function(){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend
                    + "report/cetak-kibb?"
                    + "kdprofile=" + profile
                )
            }
        }
    ])
})