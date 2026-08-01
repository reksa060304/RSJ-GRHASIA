define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('SbarDinamisCtrl', ['$mdDialog', '$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($mdDialog, $q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            $scope.buatBaru = true
            $scope.hapusButton = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.buatBaru = false;
                $scope.hapusButton = false;
            }
            
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            var myVar = 0
            var detail = ''
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var paramSearch =''
            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    if ($scope.header.DataNoregis == true) {
                        paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                    } else {
                        paramSearch ='nocm=' + $scope.item.noMr
                    }
                    init()
                }
            }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                    init()
                }
                else {
                    paramSearch ='nocm=' + $scope.item.noMr
                    init()
                }
            }
            function init() {
                $scope.isRouteLoading = true
                medifirstService.get("emr/get-emr-transaksi?"+paramSearch+ "&jenisEmr=sbar", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });

                $scope.PegawaiLogin2 = JSON.parse(localStorage.getItem('pegawai'))
            }
            
            medifirstService.get("rawatjalan/get-dokters-combos", false).then(function(data) {
                $scope.listDokter = data.data.dokter;
            });
            
            var tipe = ''
            $scope.verif = function(){
                if ($scope.dataSelected == undefined)
                    return
                tipe = 'verif'
                $scope.item.pilihDokter='';
                $scope.winDialogss.center().open();
            }
            $scope.notif = function(){
                if ($scope.dataSelected == undefined)
                    return
                tipe = 'notif'
                $scope.item.pilihDokter='';
                $scope.winDialogss.center().open();
            }
            $scope.simpanDokter = function() {
                var tmpData = {
                    norec: $scope.dataSelected.norec,
                    iddokter: $scope.item.pilihDokter.id,
                    tipe: tipe
                }
                medifirstService.post('emr/save-verif-cppt-dokter',tmpData).then(function(e){
                    $scope.winDialogss.close();
                    init();
                    $scope.item.pilihDokter='';
                });
            }
            
            $scope.back = function () {
                $scope.myVar = 1
                $scope.showRiwayatEMR = false
            }
            $rootScope.showRiwayat = function () {
                $scope.showRiwayatEMR = false
            }
            $rootScope.loadRiwayat = function () {
                init()
            }
            
            $scope.$watch(function () {
                return $state.current.name;
            }, function (newVal) {
                if (newVal && newVal !== 'RekamMedis.SbarDinamis') {
                    $scope.showRiwayatEMR = true;
                    $scope.myVar = 2;
                } else {
                    $scope.showRiwayatEMR = false;
                }
            });

            $scope.Lihat = function () {
                if ($scope.dataSelected == undefined)
                    return
                $scope.showRiwayatEMR = true
                $scope.myVar = 2
                var noemr2 = '-'
                if ($scope.dataSelected != undefined) {
                    noemr2 = $scope.dataSelected.noemr
                }
                $state.go("RekamMedis.SbarDinamis.SbarDetail", {
                    namaEMR: 435,
                    nomorEMR: noemr2
                });

                var arrStr = {
                    0: noemr2,
                    1: $scope.dataSelected ? $scope.dataSelected.norec : '-'
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }
            
            $scope.hapus = function(){
                if($scope.dataSelected == undefined){
                    toastr.error('pilih data dulu')
                    return
                } else {
                    var confirm = $mdDialog.confirm()
						.title('Informasi')
						.textContent('Apakah Anda yakin ingin menghapus data ini ?')
						.ok('Ya')
						.cancel('Tidak')
					$mdDialog.show(confirm).then(function () {
						medifirstService.post('emr/hapus-emr-transaksi',{norec:$scope.dataSelected.norec ,emrfk:$scope.dataSelected.emrfk }).then(function(e){
                            init()
                            medifirstService.postLogging('Hapus Catatan Klinik', 'norec emrpasien_t', $scope.dataSelected.norec,
                            'Hapus No EMR - ' + $scope.dataSelected.noemr + ' pada No Registrasi  '
                            + $scope.item.noregistrasi + ' - Pasien : ' + $scope.item.namaPasien).then(function (res) {
                            })
                            $scope.dataSelected = undefined
                        })
					});
                }
            }
            
            $scope.create = function () {
                $scope.showRiwayatEMR = true
                $scope.myVar = 2
                var noemr2 = '-'
                $state.go("RekamMedis.SbarDinamis.SbarDetail", {
                    namaEMR: 435,
                    nomorEMR: noemr2
                });
                var arrStr = {
                    0: noemr2
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }

            $scope.cetak = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local ? local.id : 30;
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data terlebih dahulu untuk dicetak');
                    return;
                }
                var norecEMR = $scope.dataSelected.norec;
                var nama = medifirstService.getPegawaiLogin().namaLengkap;
                if (!norecEMR) return;

                window.open(config.baseApiBackend + 'report/cetak-catatan-sbar?nocm='
                    + $scope.item.noMr + '&norec_apd=' + norec_apd + '&emr=' + norecEMR
                    + '&emrfk=' + $scope.dataSelected.emrfk
                    + '&kdprofile=' + profile
                    + '&nama=' + encodeURIComponent(nama), '_blank');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "tglemr",
                        "title": "Tgl EMR",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                    },
                    {
                        "field": "noemr",
                        "title": "No EMR",
                        "width": "80px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pegawai",
                        "width": "150px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "100px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasifk",
                        "title": "No Registrasi",
                        "width": "80px",
                    }
                ]
            };
          
            $scope.back = function () {
                window.history.back();
            }
        
            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }
            
            $scope.batal = function () {
                $scope.item.layanan = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
            }

            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }
        }
    ]);
});
