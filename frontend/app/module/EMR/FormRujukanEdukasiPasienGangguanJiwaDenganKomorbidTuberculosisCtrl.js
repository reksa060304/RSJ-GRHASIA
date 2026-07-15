define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';

    initialize.controller('FormRujukanEdukasiPasienGangguanJiwaDenganKomorbidTuberculosisCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.isTTD_E = true

            medifirstService.get('bsre-esign/get-combo').then(function (data) {
                $scope.listPegawaiCombo = data.data.pegawai
            })

            $scope.listPage = [
                {id:1,page:'Halaman 1'},
                {id:2,page:'Halaman 2'},
                {id:3,page:'Halaman 3'},
                {id:4,page:'Halaman 4'},
                {id:5,page:'Halaman 5'},
                {id:6,page:'Halaman 6'},
                {id:7,page:'Halaman 7'},
                {id:8,page:'Halaman 8'},
                {id:9,page:'Halaman 9'},
                {id:10,page:'Halaman 10'},
                {id:11,page:'Halaman 11'},
                {id:12,page:'Halaman 12'},
            ]
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
            $scope.cc.emrfk = 3003047
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
            $scope.datetimeInputs = [3014254, 1901306000, 1901307160];
            $scope.comboboxInputs = [1901307170];
            $scope.checkboxInputs = [1901306003, 1901306004];
            $scope.textareaInputs = [
                1901306001, 1901306002, 1901306005, 1901306006
            ];

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[116062]=$scope.now
                $scope.item.obj[116068]={text:$scope.cc.namaruangan,value: $scope.cc.objectruanganfk}

                // Default tanggal masuk dan tanggal bawah
                $scope.item.obj[1901306000] = $scope.cc.tglregistrasi ? new Date($scope.cc.tglregistrasi) : $scope.now;
                $scope.item.obj[1901307160] = $scope.now;

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

                // Ambil diagnosa (1901306005) dari CPPT rawat inap terakhir isian dokter bagian A
                var hasDiagnosa = dataLoad.some(function (d) { return d.emrdfk == 1901306005; });
                if (!hasDiagnosa) {
                    var normToUse = $scope.cc.nocm || $scope.noCM;
                    medifirstService.get("emr/daftar-riwayat-registrasi?norm=" + normToUse).then(function (resReg) {
                        var ranapRegs = [];
                        if (resReg && resReg.data && resReg.data.daftar) {
                            ranapRegs = resReg.data.daftar.filter(function (reg) {
                                return parseInt(reg.statusinap) == 1;
                            }).map(function (reg) {
                                return reg.noregistrasi;
                            });
                        }
                        if (ranapRegs.length > 0) {
                            medifirstService.get("emr/get-emr-cppt?nocm=" + normToUse).then(function (resCppt) {
                                if (resCppt && resCppt.data && resCppt.data.data) {
                                    var cpptList = resCppt.data.data;
                                    var filtered = cpptList.filter(function (c) {
                                        var isDokter = c.jenisppa && c.jenisppa.toLowerCase().indexOf('dokter') > -1;
                                        var isRanap = ranapRegs.indexOf(c.noregistrasi) > -1;
                                        return isDokter && isRanap;
                                    });
                                    if (filtered.length > 0) {
                                        var latestCppt = filtered[filtered.length - 1];
                                        if (latestCppt.soap) {
                                            var match = latestCppt.soap.match(/(?:^|\n)\s*A\s*:\s*([\s\S]*?)(?=(?:\n\s*[P]\s*:|$))/i);
                                            if (match && match[1]) {
                                                $scope.item.obj[1901306005] = match[1].trim();
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                // Ambil resep terakhir dari order farmasi untuk Riwayat Perawatan (1901306006)
                var hasPengobatan = dataLoad.some(function (d) { return d.emrdfk == 1901306006; });
                if (!hasPengobatan) {
                    var normToUse = $scope.cc.nocm || $scope.noCM;
                    medifirstService.get("emr/get-daftar-detail-order?nocm=" + normToUse).then(function (resOrder) {
                        if (resOrder && resOrder.data && resOrder.data.length > 0) {
                            var orders = resOrder.data;
                            var targetOrder = null;
                            
                            // Kondisi 1: Yang terakhir + resep pulang
                            for (var idx = 0; idx < orders.length; idx++) {
                                if (orders[idx].reseppulang == 1 || orders[idx].reseppulang === true) {
                                    targetOrder = orders[idx];
                                    break;
                                }
                            }
                            
                            // Kondisi 2: Jika tidak ketemu, yang terakhir saja (indeks 0 karena terurut desc)
                            if (!targetOrder) {
                                targetOrder = orders[0];
                            }
                            
                            if (targetOrder && targetOrder.details && targetOrder.details.length > 0) {
                                var details = targetOrder.details;
                                var nonracikList = [];
                                var racikMap = {};
                                
                                for (var k = 0; k < details.length; k++) {
                                    var item = details[k];
                                    if (item.jeniskemasan && item.jeniskemasan.toLowerCase().indexOf('racik') > -1 && item.jeniskemasan.toLowerCase().indexOf('non') === -1) {
                                        // Racikan
                                        if (!racikMap[item.rke]) {
                                            racikMap[item.rke] = {
                                                drugs: []
                                            };
                                        }
                                        racikMap[item.rke].drugs.push(item.namaproduk);
                                    } else {
                                        // Non Racikan
                                        nonracikList.push(item.namaproduk);
                                    }
                                }
                                
                                var lines = [];
                                if (nonracikList.length > 0) {
                                    for (var a = 0; a < nonracikList.length; a++) {
                                        lines.push((a + 1) + ". " + nonracikList[a]);
                                    }
                                }
                                
                                var racikKeys = Object.keys(racikMap);
                                if (racikKeys.length > 0) {
                                    var startIdx = nonracikList.length + 1;
                                    for (var b = 0; b < racikKeys.length; b++) {
                                        var rKey = racikKeys[b];
                                        var rInfo = racikMap[rKey];
                                        lines.push((startIdx + b) + ". " + rInfo.drugs.join(" + "));
                                    }
                                }
                                
                                $scope.item.obj[1901306006] = lines.join("\n");
                            }
                        }
                    });
                }

                // Teks otomatis Puskesmas [kecamatan] pada field Puskesmas Tujuan (1901307000)
                var hasPuskesmas = dataLoad.some(function (d) { return d.emrdfk == 1901307000; });
                if (!hasPuskesmas) {
                    var normToUse = $scope.cc.nocm || $scope.noCM;
                    medifirstService.get("registrasi/get-pasien-by-nocm-riwayat-regis?noCm=" + normToUse).then(function (resPsn) {
                        var kecamatan = "";
                        if (resPsn && resPsn.data && resPsn.data.datas) {
                            var pData = resPsn.data.datas;
                            kecamatan = pData.namakecamatan || pData.kecamatan;
                        }
                        
                        // Fallback jika database kecamatan kosong, parse dari alamatlengkap
                        if (!kecamatan) {
                            var alamat = $scope.cc.alamat;
                            if (alamat) {
                                var matchKec = alamat.match(/(?:kec\.|kecamatan)\s+([a-zA-Z\s\-]+?)(?=\s*(?:,|kab\.|kabupaten|kota|prov\.|provinsi|$|\d|sleman|bantul|gunung\s*kidul|gunungkidul|kulon\s*progo|kulonprogo|yogyakarta|jogja|jogjakarta))/i);
                                if (matchKec && matchKec[1]) {
                                    kecamatan = matchKec[1].replace(/(?:kabupaten|kab\.|kota|provinsi|prov\.)/i, "").trim();
                                }
                            }
                        }
                        
                        if (kecamatan) {
                            kecamatan = kecamatan.replace(/\w\S*/g, function(txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                            $scope.item.obj[1901307000] = "Puskesmas " + kecamatan;
                        }
                    });
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
                    norecEMR = e.data.norecEMR;
                    nomorEMR = e.data.data.noemr;
                    $scope.cc.norec_emr = e.data.data.noemr;

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.norecEMR,  
                    'FormRujukanEdukasiPasienGangguanJiwaDenganKomorbidTuberculosisCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        0: e.data.data.noemr,
                        1: e.data.norecEMR
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    cacheHelper.set('cacheNOREC_EMR', e.data.norecEMR);
                });
            }

            $scope.changeTTD = function (e) {
                $scope.item.nik = e.noidentitas
            }

            $scope.cekUser = function () {
                if ($scope.item.nik == undefined) {
                    toastr.warning('Pilih pegawai dahulu!')
                    return
                }
                $scope.isRouteLoading = true
                medifirstService.get('bsre-esign/cek-status-user/' + $scope.item.nik).then(function (e) {
                    $scope.isRouteLoading = false
                    if (e.data.status == 200) {
                        toastr.info(e.data.message)
                    } else {
                        toastr.error(e.data.message)
                    }
                })
            }

            $scope.lihatDok = function () {
                var local = JSON.parse(localStorage.getItem('profile'))
                window.open(config.baseApiBackend + 'report/cetak-rujukan-edukasi-pasien-dengan-komorbid-tuberculosis?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&noemr=' + nomorEMR +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&umur=' + $scope.item.umurDay +
                    '&jeniskelamin=' + $scope.cc.jeniskelamin,
                '_blank',
                );
            }

            $scope.batal = function () {
                $scope.popUpTTD.close()
            }

            $scope.ttdElek = function () {
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }

                if ($scope.item.obj[1901307170] != undefined) {
                    $scope.listPegawai.add($scope.item.obj[1901307170])
                    $scope.item.pegawai = $scope.item.obj[1901307170]
                }
                $scope.winDialog.center().open()
            }

            $scope.savePengajuanTTE = function (pegawai) {
                if (pegawai == undefined) {
                    toastr.error('Pilih pegawai dulu')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                $scope.isRouteLoading = true
                medifirstService.get('report/cetak-rujukan-edukasi-pasien-dengan-komorbid-tuberculosis?nocm=' + $scope.cc.nocm +
                    '&norec_apd=' + $scope.cc.norec +
                    '&noemr=' + nomorEMR +
                    '&emr=' + norecEMR +
                    '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama +
                    '&isttd=' + $scope.isTTD_E +
                    '&pegawaittd=' + pegawai.value +
                    '&noregistrasi=' + $scope.cc.noregistrasi +
                    '&norec_pd=' + $scope.cc.norec_pd +
                    "&umur=" + $scope.item.umurDay +
                    "&jeniskelamin=" + $scope.cc.jeniskelamin
                ).then(function (e) {
                    $scope.isRouteLoading = false
                    if (e.data.status == 201) {
                        toastr.success(e.data.message)
                        $scope.winDialog.close();

                        var selectedPegawai = $scope.listPegawaiCombo.find(function (item) {
                            return item.id === pegawai.value;
                        });

                        if (selectedPegawai) {
                            $scope.item.pegawaiSign = selectedPegawai;
                            $scope.item.nik = selectedPegawai.noidentitas;
                        } else {
                            $scope.item.pegawaiSign = { id: pegawai.value, namalengkap: pegawai.text };
                            $scope.item.nik = '';
                        }

                        $scope.item.namadokumen = e.data.dokumen.namadokumen;
                        $scope.item.nomoremr = e.data.dokumen.nomoremr;
                        $scope.item.reason = e.data.dokumen.deskripsi;
                        $scope.item.page = { id: 1, page: '1' };
                        $scope.item.norec = e.data.dokumen.id;

                        $scope.popUpTTD.center().open();
                    } else {
                        toastr.error(e.data.message)
                    }
                })
            }

            $scope.SaveUpdate = function () {
                if ($scope.item.passphrase == undefined || $scope.item.passphrase == '') {
                    toastr.warning('Pass Phrase belum diisi!')
                    return
                }
                var body = {
                    norec: $scope.item.norec,
                    passphrase: $scope.item.passphrase,
                    nik: $scope.item.nik,
                    reason: $scope.item.reason,
                    page: $scope.item.page.page,
                    iduser: medifirstService.getPegawaiLogin().id,
                }
                $scope.isRouteLoading = true
                medifirstService.post('bsre-esign/save-ttd-pengajuan', body).then(function (e) {
                    $scope.isRouteLoading = false
                    if (e.data.status == 201) {
                        toastr.success(e.data.message)
                        $scope.popUpTTD.close()
                    } else {
                        toastr.error(e.data.message)
                    }
                })
            }

            $scope.cetakBlade = function () {
                if (norecEMR == "") return;

                var local = JSON.parse(localStorage.getItem("profile"));
                var nama = medifirstService.getPegawaiLogin().namaLengkap;
                var pegawaittd = ''
                if ($scope.item.obj[1901307170] != undefined) {
                    pegawaittd = $scope.item.obj[1901307170].value
                }

                window.open(config.baseApiBackend + "report/cetak-rujukan-edukasi-pasien-dengan-komorbid-tuberculosis?nocm=" + $scope.cc.nocm +
                    "&norec_apd=" + $scope.cc.norec +
                    "&emr=" + norecEMR +
                    "&emrfk=" + $scope.cc.emrfk +
                    "&kdprofile=" + local.id +
                    "&nama=" + nama +
                    "&noregistrasi=" + $scope.cc.noregistrasi +
                    "&umur=" + $scope.item.umurDay +
                    "&pegawaittd=" + pegawaittd +
                    "&jeniskelamin=" + $scope.cc.jeniskelamin,
                "_blank",
                );
            };

        }
        
    ]);
});
