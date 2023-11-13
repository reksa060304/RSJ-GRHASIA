define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('SuratKeteranganGawatDaruratCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$mdDialog',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorSkalaFlacc = [];
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.isCetakV = true;
            $scope.cc = {}
            var nomorEMR = '-'
            var norecEMR = ''
            var namaFile = ''
            $scope.now = new Date();
            $scope.cc.emrfk = 3000999
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.isTTD_E = true


            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if (cacheNoREC != undefined) {
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
            }
            
            var chacePeriode = cacheHelper.get('cacheRekamMedis');

            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.tglLahir = chacePeriode[18]
                $scope.cc.gawean = chacePeriode[31]
                $scope.cc.tempatLahir = chacePeriode[32]

                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false;
            medifirstService.get("emr/get-emr-transaksi-detail2?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
                if(dataLoad.length > 0){

                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                            
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if(dataLoad[i].emrdfk == 115952)
                                    $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                                  if(dataLoad[i].emrdfk == 3152)
                                    $scope.totalSkor = parseFloat(dataLoad[i].value)
                                  if(dataLoad[i].emrdfk == 115928)
                                    $scope.skorGizi = parseFloat(dataLoad[i].value)
                                   
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd   
    
                            }
    
                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "time") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
    
                            if (dataLoad[i].type == "checkboxtextbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                $scope.item.obj2[dataLoad[i].emrdfk] = true
                            }
                            if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                                }
    
                            }
                            // pegawaiInputDetail = dataLoad[i].pegawaifk
                            norecEMR = dataLoad[0].norec_p
                            nomorEMR = dataLoad[0].emrpasienfk
                        }
    
                    }                        

                        }
                        else
                        {
                            norecEMR = ''
                            $scope.item.obj[190130801] = $scope.cc.namapasien
                            $scope.item.obj[190130802] = $scope.cc.nocm
                            $scope.item.obj[190130803] = $scope.cc.jeniskelamin
                            $scope.item.obj[190130804] = $scope.cc.umur
                            $scope.item.obj[190130805] = $scope.cc.alamat
                            $scope.item.obj[190130806] = $scope.cc.tglregistrasi
                            // $scope.item.obj[190130807] = $scope.cc.diagnosa
                            $scope.item.obj[190130808] = moment($scope.now).format('YYYY-MM-DD HH:mm')
                            $scope.item.obj[190130809] = {
                                value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp
                            }  
                            // $scope.item.obj[190130809] = {
                            //     value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap
                            // }  
                            medifirstService.get('emr/get-emr-to-emr-v2?emrfk=' + $scope.cc.emrfk + "&noregistrasi=" + $scope.cc.noregistrasi).then(function (data) {
                                var datasku = data.data.data
                                $scope.isRouteLoading = false
                                for (let j = 0; j < datasku.length; j++) {
                                    if (datasku[j].type == 'textbox') {
                                        // $scope.item.diagnosa = datasku[j].value
                                        //$scope.item.obj[datasku[j].idtujuan] = datasku[j].value
                                        $scope.item.obj[190130807] = datasku[j].value
                                    }
                                }
                            })
                        }


            })

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {})
                 
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    // e.data.data.norec
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', norecEMR,  
                    'SuratKeteranganDirawatInapCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        // 0: e.data.data.noemr
                         0: e.data.data.norec
                    }
                    // norecEMR =e.data.data.noemr
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    //  norecEMR = e.data.data.noemr
                     //cacheHelper.set('cacheNOREC_EMR', arrStr);
                     medifirstService.get("emr/get-emr-transaksi-detail2?noemr=" + e.data.data.noemr + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                        dataLoad = dat.data.data
                        if(dataLoad.length > 0){
                            for (var i = 0; i <= dataLoad.length - 1; i++) {
                                $scope.isRouteLoading = true;
                                norecEMR = dataLoad[0].norec_p
                                nomorEMR = dataLoad[0].emrpasienfk
                            }
                            $scope.isRouteLoading = false;
                        }
                        else{
                            norecEMR = ''
                        }
                     })

                });
            }


            $scope.cetakBlade = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }
                // if ($scope.item.obj[3003998] != undefined) {
                //     $scope.listPegawai.add($scope.item.obj[3003998])
                //     $scope.item.pegawai = $scope.item.obj[3003998]
                // }
                // if (pegawai == undefined) {
                //     return
                // }

                // var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                // var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
                // if (cacheNoREC != undefined) {
                //     norecEMR = cacheNomorEMR[1]
                // }
                // if (cacheNomorEMR != undefined) {
                //     nomorEMR = cacheNomorEMR[0]
                //     norecEMR = cacheNomorEMR[1]
                //     $scope.cc.norec_emr = nomorEMR
                // }
                // if (cacheNomorEMR != undefined) {
                //     nomorEMR = cacheNomorEMR[0]
                //     $scope.cc.norec_emr = nomorEMR
                //     $scope.cc.tanggalEmrl = cacheNomorEMR[2]
                // }
    
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                //CEK UNTUK MEMILIH CETAK DARI FILE INI ATAU DARI FILE TTE JIKA SUDAH DI VERIF TTE OLEH DOKTER
                medifirstService.get("emr/cek_ttd_bsre_emr?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk + "&norec_pd=" + $scope.cc.norec_pd + "&noregistrasi=" + $scope.cc.noregistrasi, true).then(function (dat) {
                    dataLoad = dat.data.data
                    if(dataLoad.length > 0){
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            namaFile = dataLoad[0].file
                        }
                        window.open(baseTransaksi.replace('service/medifirst2000/', '') + "service/storage_path?path=" + namaFile
                        + "&mimetype=application/pdf");
                        }
                    else{
                        namaFile = ''
                        window.open(configuration.baseApiBackend + 'report/get-cetak-suratketerangangawatdarurat?nocm=' + $scope.cc.nocm +
                        '&norec_apd=' + $scope.cc.norec +
                        '&emr=' + norecEMR +
                        '&emrfk=' + $scope.cc.emrfk +
                        '&kdprofile=' + local.id +
                        '&nama=' + nama +
                        '&namaemr=' + nomorEMR +
                        '&noregistrasi=' + $scope.cc.noregistrasi +
                        '&norec_pd=' + $scope.cc.norec_pd, '_blank');
                        }
                    })
                 //SAMPAI SINI
                if(namaFile=='') {
                    // window.open(configuration.baseApiBackend + 'report/get-cetak-suratketerangangawatdarurat?nocm=' + $scope.cc.nocm +
                    // '&norec_apd=' + $scope.cc.norec +
                    // '&emr=' + norecEMR +
                    // '&emrfk=' + $scope.cc.emrfk +
                    // '&kdprofile=' + local.id +
                    // '&nama=' + nama +
                    // '&namaemr=' + nomorEMR +
                    // '&noregistrasi=' + $scope.cc.noregistrasi +
                    // '&norec_pd=' + $scope.cc.norec_pd, '_blank');
                }
                else {
                    // window.open(baseTransaksi.replace('service/medifirst2000/', '') + "service/storage_path?path=" + namaFile
                    // + "&mimetype=application/pdf");
                }
            }

            $scope.ttdElek = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }

                // var confirm = $mdDialog.confirm()
                //   .title('Info')
                //   .textContent('Yakin mau tanda tangani dokumen ini ? ')
                //   .ariaLabel('Lucky day')
                //   .cancel('Tidak')
                //   .ok('Ya')
                // $mdDialog.show(confirm).then(function () {

                if ($scope.item.obj[190130809] != undefined) {
                    $scope.listPegawai.add($scope.item.obj[190130809])
                    $scope.item.pegawai = $scope.item.obj[190130809]
                }
                $scope.winDialog.center().open()
                // })
            }
            $scope.savePengajuanTTE = function (pegawai) {
                if (pegawai == undefined) {
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                $scope.isRouteLoading = true
                medifirstService.get('report/get-cetak-suratketerangangawatdarurat?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    '&namaemr=' + nomorEMR +
                    '&isttd=true' +
                    '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd
                ).then(function (e) {
                    if (e.data.status == 201) {
                        toastr.success(e.data.message)
                        $scope.winDialog.close()
                    } else {
                        toastr.error(e.data.message)
                    }
                    $scope.isRouteLoading = false

                })
            }
        }
        
    ]);
});
