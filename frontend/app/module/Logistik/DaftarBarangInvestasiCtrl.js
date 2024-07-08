define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('DaftarBarangInvestasiCtrl', ['$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.bukanLogistik = true;
            $scope.now = new Date();
            $scope.item = {};
            LoadDataCombo();
            
            $scope.checkAll = false;
            $scope.selectedAsset = []

            function LoadCache() {
                // $scope.item.namarekanan = undefined
                var chacePeriode = cacheHelper.get('DaftarBarangInvestasiCtrl');
                if (chacePeriode != undefined) {
                    // $scope.item.tglAwal = new Date(chacePeriode[0]);
                    // $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    // $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD HH:ii:ss'));
                    // $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD HH:ii:ss'));
                    LoadData();
                }
            }

            function LoadDataCombo() {
                var DataRuanganAll = [];
                var chacePeriode = cacheHelper.get('DaftarBarangInvestasiCtrl');
                // if (chacePeriode != undefined) {
                //     var arrPeriode = chacePeriode.split('~');
                //     $scope.item.Awal = new Date(arrPeriode[0]);
                //     $scope.item.Akhir = new Date(arrPeriode[1]);

                // } else {

                //     $scope.item.Awal = $scope.now;
                //     $scope.item.Akhir = $scope.now;
                // }

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.sourceDetailJenis = dataCombo.detailjenisproduk
                    $scope.listKelompokAset = dataCombo.kelompokaset
                });
                // $scope.sourceRuangan = medifirstService.getMapLoginUserToRuangan();
                // if ($scope.sourceRuangan != undefined) {
                //     $scope.item.ruangan = {id:$scope.sourceRuangan[0].id,namaruangan:$scope.sourceRuangan[0].namaruangan};
                // }else{
                medifirstService.get("sysadmin/general/get-combo-ruangan-general").then(function (dat) {
                    $scope.sourceDepartemen = dat.data.departemen;
                    $scope.sourceRuanganAset = dat.data.ruangan;
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

                // clear seleksi checkbox
                $scope.selectedAsset = []
                
                var tglAwal = $scope.item.tglAwal == undefined ? '' : moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss');
                var tglAkhir = $scope.item.tglAkhir == undefined ? '' : moment($scope.item.tglAkhir).format('YYYY-MM-DD hh:mm:ss');
                
                var ruanganId = "";
                if ($scope.item.ruangan != undefined) {
                    ruanganId = "&ruangancurrenfk=" + $scope.item.ruangan.id
                }

                var kelompokAsset = ""
                if($scope.item.kelompokaset !== undefined){
                    kelompokAsset = "&kelompokaset=" + $scope.item.kelompokaset?.id
                }

                var namaproduk = "";
                if ($scope.item.NamaProduk != undefined) {
                    namaproduk = "&namaproduk=" + $scope.item.NamaProduk;
                }

                medifirstService.get("logistik/get-daftar-asset?"
                    +"tglAwal="+tglAwal
                    +"&tglAkhir="+tglAkhir
                    + ruanganId 
                    + namaproduk
                    + kelompokAsset).then(function (dat) {
                        //debugger
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].norec = datas[i].norec.trim()
                            datas[i].no = i + 1
                            datas[i].statCheckbox = false
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

            $scope.Search = function () {
                // if ($scope.item.ruangan == undefined) {
                //     toastr.error('Pilih Ruangan terlebih dahulu!!!')
                //     return
                // }

                // if($scope.item.tglAwal == undefined){
                //     toastr.error('Pilih Periode tanggal terlebih dahulu')
                //     return
                // }
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
                    + "report/cetak-daftar-barang-asset" 
                    + "?tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kodeprofile=" + profile)
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

                // if($scope.item.tglAwal == undefined){
                //     toastr.error('Periode Tanggal perlu dipilih')
                //     return
                // }

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
                
                $scope.popUp.close()
                $scope.item.kepala = null
                $scope.item.penanggungjawab = null
                
            }

            $scope.cetakKIBB = function(){
                // var local = JSON.parse(localStorage.getItem('profile'));
                // var profile = local.id;

                // window.open(config.baseApiBackend
                //     + "report/cetak-kibb?"
                //     + "kdprofile=" + profile
                // )
                $scope.popUpCetakKelompokAset.open().center()
            }

            $scope.batalCetakKelompokAset = function() {

                $scope.popUpCetakKelompokAset.close()
                $scope.item.selectedKelompokAset = null

            }

            $scope.cetakKelompokAset = function() {

                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                if($scope.item.selectedKelompokAset == null || $scope.item.selectedKelompokAset == undefined){
                    toastr.error("Pilih Kelompok Asset Terlebih Dahulu")
                    return
                }

                window.open(config.baseApiBackend
                    + "report/cetak-kibb?"
                    + "kdprofile=" + profile
                    + "&kelompokaset=" + $scope.item.selectedKelompokAset.id
                )

                $scope.popUpCetakKelompokAset.close()
                $scope.item.selectedKelompokAset = null

            }

            $scope.cetakKIBC = function(){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend
                    + "report/cetak-kibc?"
                    + "kdprofile=" + profile
                )
            }
            
            $scope.cetakKIBD = function(){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend
                    + "report/cetak-kibd?"
                    + "kdprofile=" + profile
                )
            }

            $scope.cetakPilihan = function() {
                if($scope.selectedAsset == null || $scope.selectedAsset.length == 0){
                    toastr.error('Pilih Data Dulu')
                    return
                }
                
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;

                window.open(config.baseApiBackend
                    + "report/cetak-label-pilihan"
                    + "?kodeprofile=" + profile
                    + "&norec=" + $scope.selectedAsset
                )
            }

            $scope.selectRowAsset = function(dataItem){
                let index = $scope.selectedAsset.indexOf(dataItem?.norec)
                
                if(index > -1){
                    $scope.selectedAsset.splice(index, 1)
                }else{
                    $scope.selectedAsset.push(dataItem?.norec)
                }

                // console.log($scope.selectedAsset)
            }

            $scope.selectAllAsset = function(){
                let data = $scope.sourceBarang._data

                if($scope.checkAll == false){
                    $scope.selectedAsset = []

                    data.forEach(function(data){
                        $scope.selectedAsset.push(data?.norec)
                    })

                    $scope.checkAll = true
                }else{
                    $scope.selectedAsset = []

                    $scope.checkAll = false
                }

                // console.log($scope.selectedAsset)
            }

            $scope.columnGrid = [
                {
                    title: "<input type='checkbox' ng-checked='checkAll' ng-click='selectAllAsset()' />",
                    template: '<input type="checkbox" ng-checked="checkAll" ng-click="selectRowAsset(dataItem)" />',
                    width: "60px"
                },
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
        }
    ])
})