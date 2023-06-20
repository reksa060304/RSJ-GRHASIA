define(['initialize','Configuration'], function (initialize,configuration) {
    'use strict';
    initialize.controller('MenuAnalisisFormulirCtrl', ['$q', '$rootScope', '$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, DateHelper,cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.dataLoad = ''
            loadCombo()

            var cache = cacheHelper.get('cacheRMelektronik');
            if(cache != undefined){
                console.log(cache);
                $scope.item.nocm = cache[0]
                $scope.item.noregistrasi = cache[3]
                $scope.item.norec_apd = cache[7]
                $scope.item.norec_pd = cache[8]
                
            }
           

            $rootScope.getRekamMedisCheck = function (bool) {
                console.log(bool);
                if(bool){
                    $scope.dataLoad = "noreg="+$scope.item.noregistrasi
                }else{
                    $scope.dataLoad = "nocm="+$scope.item.nocm
                }
                loadData()
            }
            function loadCombo() {
                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data

                })
            }
            loadData()

            function loadData(){
                var noreg = ''
                if($scope.dataLoad == ''){
                    noreg = "noreg=" + $scope.item.noregistrasi
                }
                $scope.isRouteLoading = true
                medifirstService.get('rme/analisis-rme?'+ $scope.dataLoad+noreg).then(function(data){
                    var datas = data.data.data
                    $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    })
                $scope.isRouteLoading = false
                })
            }
            $scope.columnRiwayatRegistrasi = {
                columns: [
                    {
                        "field": "caption",
                        "title": "No Formulir"
                    },
                    {
                        "field": "isanalis",
                        "title": "Analisis"
                    },
                    {
                        "field": "islengkap",
                        "title": "Lengkap"
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan"
                    },
                    {
                        "field": "verifikator",
                        "title": "Verifikator"
                    }
                ]
            }
            $scope.doubleKlikGrid = function (data) {
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                window.open(configuration.baseApiBackend + data.urlform+'?nocm=' + $scope.item.nocm +
                    '&norec_apd=' + $scope.item.norec_apd +
                    '&emr=' + data.norec_emr +
                    '&emrfk=' + data.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    // '&isttd=true' +
                    // '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.item.noregistrasi +
                    '&norec_pd=' + $scope.item.norec_pd, '_blank')
            }
            $scope.rekamMedisElektronik = function () {
                    window.open("/app/#/RekamMedis/" + $scope.item.norec_apd + "/VitalSign")
                //     $state.go('RekamMedis.VitalSign', {
                //         noRec: $scope.item.norec_apd
                
                // })
            }
            $scope.isisan = function(method){
                if($scope.dataPasienSelected == undefined){
                    toastr.error('Pilih data dulu!!!')
                    return
                }
                var objSave = {
                    method: method,
                    emrfk: $scope.dataPasienSelected.emrfk,
                    noemr: $scope.dataPasienSelected.noemr,
                    norec_em: $scope.dataPasienSelected.norec_emr
                }
                $scope.isRouteLoading = true
                medifirstService.post('emr/save-menu-analis', objSave).then(function(){
                $scope.isRouteLoading = false
                    loadData()
                })
            }
            $scope.popup = function(data){
                $scope.keterangan = false
                $scope.verifikator = false
                if(data == 'verifikator'){
                    $scope.item.verifikator = {
                        text: medifirstService.getPegawaiLogin().namaLengkap,
                        value: medifirstService.getPegawaiLogin().id,
                    }
                    $scope.verifikator = true
                    $scope.keterangan = false
                    $scope.item.keterangan = undefined
                }else{
                    $scope.item.verifikator = undefined
                    $scope.keterangan = true
                    $scope.verifikator = false

                }
                $scope.popupuyy.center().open()
            }
            $scope.simpanaja = function(){
                
                if ($scope.keterangan == true){
                    $scope.isRouteLoading = true
                    var objSave = {
                        keterangan: $scope.item.keterangan,
                        emrfk: $scope.dataPasienSelected.emrfk,
                        noemr: $scope.dataPasienSelected.noemr,
                        norec_em: $scope.dataPasienSelected.norec_emr
                    }
                    medifirstService.post('emr/save-kedua', objSave).then(function(){
                    $scope.isRouteLoading = false
                        loadData()
                $scope.popupuyy.close()
                    })
                }else{
                    var objSave = {
                        verifikator: $scope.item.verifikator.value+
                        "~"+$scope.item.verifikator.text,
                        emrfk: $scope.dataPasienSelected.emrfk,
                        noemr: $scope.dataPasienSelected.noemr,
                        norec_em: $scope.dataPasienSelected.norec_emr
                    }
                    medifirstService.post('emr/save-kedua', objSave).then(function () {
                    $scope.isRouteLoading = false
                        loadData()
                    $scope.popupuyy.close()

                    })
                }
            }
            $scope.kembali = function(){
                window.history.back();

            }
            $scope.openriwayat = function(){
                $scope.isRouteLoading = true
                if($scope.dataPasienSelected == undefined){
                    toastr.error('pilih data dahulu')
                    return
                }
                medifirstService.get('emr/data-riwayat-emr?noemr='+$scope.dataPasienSelected.noemr+ "&emrfk="+$scope.dataPasienSelected.emrfk)
                .then(function(data){
                    var datas = data.data.data
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i+1
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        }
                    });
                $scope.isRouteLoading = false
                $scope.item.namaemr = $scope.dataPasienSelected.caption
                $scope.popupriwayat.center().open()
                })
                
            }

            $scope.mainGridOptions = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                    },
                    {
                        "field": "caption",
                        "title": "Kolom",
                    },
                    {
                        "field": "emrdfk",
                        "title": "id"
                    },
                ]
            }

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "tgl",
                            "title": "Tanggal",
                            "width": "70px",
                        },
                        {
                            "field": "namalengkap",
                            "title": "Pegawai",
                            "width": "70px",
                        },
                        {
                            "field": "value",
                            "title": "Value",
                            "width": "100px",
                        },
                    ]
                }
            };
            //** BATAS */
        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1