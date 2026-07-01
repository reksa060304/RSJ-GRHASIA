define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';

    initialize.controller('FREPGangguanJiwaDenganKomorbidHipertensiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

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
            var norecEMR = "";
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3003045
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.lainnya2 = true
            $scope.lainnya1 = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            var cacheNomorEMR = cacheHelper.get("cacheNomorEMR");
            var cacheNoREC = cacheHelper.get("cacheNOREC_EMR");
            if (cacheNoREC != undefined) {
                norecEMR = cacheNomorEMR[1];
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0];
                norecEMR = cacheNomorEMR[1];
                $scope.cc.norec_emr = nomorEMR;
            }
            $scope.listHubunganPasien = [
                {value: 1, text: 'Diri Sendiri'},
                {value: 2, text: 'Suami'},
                {value: 3, text: 'Istri'},
                {value: 4, text: 'Ayah'},
                {value: 5, text: 'Ibu'},
                {value: 6, text: 'Anak'},
                {value: 7, text: 'Pengampu'},
                {value: 8, text: 'Lainnya'},
            ]

            $scope.listTerhadapPasien = [
                {value: 1, text: 'Saya'},
                {value: 2, text: 'Suami'},
                {value: 3, text: 'Istri'},
                {value: 4, text: 'Ayah'},
                {value: 5, text: 'Ibu'},
                {value: 6, text: 'Anak'},
                {value: 7, text: 'Lain-Lain'},
            ]

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            $scope.listJenisKelamin = [
                {value: 1, text: 'Laki-Laki'},
                {value: 2, text: 'Perempuan'},
            ]

            $scope.toggleJenisKelamin = function (kode) {
                if (kode === 1901306003 && $scope.item.obj[1901306003]) {
                    $scope.item.obj[1901306004] = false;
                }
                if (kode === 1901306004 && $scope.item.obj[1901306004]) {
                    $scope.item.obj[1901306003] = false;
                }
            }

            $scope.$watch('item.obj[1901307060]', function(newValue,oldValue){
                if(newValue!=oldValue){
            
                  if($scope.item.obj[1901307060].value == 8){
                    $scope.lainnya1 = false
                  }else {
                    $scope.lainnya1 = true
                  }
                   
                }

            })

            $scope.$watch('item.obj[1901307090]', function(newValue,oldValue){
                if(newValue!=oldValue){
            
                  if($scope.item.obj[1901307090].value == 7){
                    $scope.lainnya2 = false
                  }else {
                    $scope.lainnya2 = true
                  }
                   
                }

            })

            $scope.$watch('item.obj[1901307000]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    $scope.item.obj[1901307180] = $scope.item.obj[1901307000]
                }

            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
            }   
            
            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            console.log(chacePeriode)
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

            $scope.textInputs = [3014250, 7890444, 3014252, 3014253];
            $scope.datetimeInputs = [3014254];
            $scope.comboboxInputs = [1901307170];
            $scope.checkboxInputs = [1901306003, 1901306004];
            $scope.textareaInputs = [
                1901306001, 1901306002, 1901306005, 1901306006
            ];

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[116062]=$scope.now
                // $scope.item.obj[116068]={text:$scope.cc.namaruangan,value: $scope.cc.objectruanganfk}
                $scope.item.obj[1901306000] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                $scope.item.obj[1901307160] = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                $scope.item.obj[1901306001]=$scope.cc.namapasien
                $scope.item.obj[1901306002]=$scope.cc.umur
                $scope.item.obj[1901307140]=$scope.cc.nocm
                if($scope.cc.jeniskelamin == 'LAKI-LAKI'){
                    $scope.item.obj[1901306003]=true
                } else {
                    $scope.item.obj[1901306004]=true
                }

                $scope.item.obj[1901307210]=$scope.cc.namapasien
                $scope.item.obj[1901307220]=$scope.cc.nocm
                

                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                    var emrdfk = dataLoad[i].emrdfk;

                    if ($scope.textInputs.includes(emrdfk)) {
                        $scope.item.obj[emrdfk] = dataLoad[i].value;
                    } else if ($scope.datetimeInputs.includes(emrdfk)) {
                        $scope.item.obj[emrdfk] = new Date(dataLoad[i].value);
                    } else if ($scope.comboboxInputs.includes(emrdfk)) {
                        var str = dataLoad[i].value;
                        if (str != undefined) {
                        var res = str.split("~");
                        $scope.item.obj[emrdfk] = { value: res[0], text: res[1] };
                        }
                    } else if ($scope.textareaInputs.includes(emrdfk)) {
                        $scope.item.obj[emrdfk] = dataLoad[i].value;
                    } else if ($scope.checkboxInputs.includes(emrdfk)) {
                        $scope.item.obj[emrdfk] = dataLoad[i].value;
                        chekedd = false;
                        if (dataLoad[i].value == "1") {
                            chekedd = true;
                        }
                        $scope.item.obj[dataLoad[i].emrdfk] = chekedd;

                    } else {
                        // Fallback to original type-based assignment for other types
                        if (dataLoad[i].type == "textbox") {
                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                        }
                        if (dataLoad[i].type == "checkbox") {
                        chekedd = false;
                        if (dataLoad[i].value == "1") {
                            chekedd = true;
                        }
                        $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
                        }

                        if (dataLoad[i].type == "datetime") {
                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                            dataLoad[i].value,
                        );
                        }
                        if (dataLoad[i].type == "datetime2") {
                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                            dataLoad[i].value,
                        );
                        }
                        if (dataLoad[i].type == "time") {
                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                            dataLoad[i].value,
                        );
                        }
                        if (dataLoad[i].type == "date") {
                        $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                            dataLoad[i].value,
                        );
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                        $scope.item.obj2[dataLoad[i].emrdfk] = true;
                        }
                        if (dataLoad[i].type == "checkboxtextarea") {
                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                        $scope.item.obj2[dataLoad[i].emrdfk] = true;
                        }
                        if (dataLoad[i].type == "textarea") {
                        $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                        }
                        if (dataLoad[i].type == "combobox2") {
                        var str = dataLoad[i].value;
                        if (str != undefined) {
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = {
                            value: res[0],
                            text: res[1],
                            };
                        }
                        }
                        if (dataLoad[i].type == "combobox") {
                        var str = dataLoad[i].value;
                        if (str != undefined) {
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = {
                            value: res[0],
                            text: res[1],
                            };
                        }
                        }

                        if (dataLoad[i].type == "combobox3") {
                        var str = dataLoad[i].value;
                        if (str != undefined) {
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = {
                            value: res[0],
                            text: res[1],
                            };
                        }
                        }
                    }
                    }
                }

            })

            $scope.kembali = function () {
                try {
                    var $mdDialog = angular.element(document.body).injector().get('$mdDialog');
                    if ($mdDialog && jQuery('md-dialog').length > 0) {
                        $mdDialog.hide();
                        return;
                    }
                } catch (e) {
                    console.error(e);
                }
                $rootScope.showRiwayat();
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
                    if(norecEMR == '-' || norecEMR == null || norecEMR == ''){
                        norecEMR = e.data.norecEMR
                        nomorEMR = e.data.data.noemr
                    }

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'FormulirPelayananKerohanianCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.cetakBlade = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                // var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-surat-man?nocm=' + $scope.cc.nocm +
                    '&emr=' + norecEMR +
                    '&noemr=' + nomorEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&blade=' + 'fred-hipertensi-dom', '_blank');
                    
            }

        }
        
    ]);
});
