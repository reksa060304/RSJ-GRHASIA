define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TransferPasienRadiologiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            
            $scope.item = {};
            $scope.item.obj = {};
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true;
            $scope.noRecPap = cacheHelper.get('noRecPap');
            
            var EMR_ID_TRANSFER_RADIOLOGI = 3003034;
            $scope.emrid = EMR_ID_TRANSFER_RADIOLOGI;

            $scope.cc = {};
            $scope.cc.emrfk = EMR_ID_TRANSFER_RADIOLOGI;
            $scope.cc.norec_emr = '-';

            var nomorEMR = '-';
            var norecEMR = '-';
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined && cacheNomorEMR !== '') {
                nomorEMR = cacheNomorEMR[0] ? cacheNomorEMR[0] : cacheNomorEMR;
                norecEMR = cacheNomorEMR[1] ? cacheNomorEMR[1] : '-';
                $scope.cc.norec_emr = nomorEMR;
            }

            var cacheRekamMedis = cacheHelper.get('cacheRekamMedis');
            if (cacheRekamMedis != undefined) {
                $scope.cc.nocm         = cacheRekamMedis[0];
                $scope.cc.namapasien   = cacheRekamMedis[1];
                $scope.cc.jeniskelamin = cacheRekamMedis[2];
                $scope.cc.noregistrasi = cacheRekamMedis[3];
                $scope.cc.umur         = cacheRekamMedis[4];
                $scope.cc.kelompokpasien = cacheRekamMedis[5];
                $scope.cc.tglregistrasi  = cacheRekamMedis[6];
                $scope.cc.norec        = cacheRekamMedis[7];
                $scope.cc.norec_pd     = cacheRekamMedis[8];
                $scope.cc.namakelas    = cacheRekamMedis[10];
                $scope.cc.namaruangan  = cacheRekamMedis[12];
            }

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data;
            });

            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data;
            });

            
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + EMR_ID_TRANSFER_RADIOLOGI).then(function (e) {
                if(!e.data) return;
                
                var datas = [];
                if (e.data.kolom1) datas = datas.concat(e.data.kolom1);
                if (e.data.kolom2) datas = datas.concat(e.data.kolom2);
                if (e.data.kolom3) datas = datas.concat(e.data.kolom3);
                if (e.data.kolom4) datas = datas.concat(e.data.kolom4);

                if (datas.length == 0) return;

                for (var i = 0; i < datas.length; i++) {
                    var type = datas[i].type ? datas[i].type.toLowerCase() : "";
                    if (type == "date" || type == "datetime" || type == "time") {
                        $scope.item.obj[datas[i].id] = new Date();
                    }
                }

                var arrSituation = [];
                var arrBackground = [];
                var arrAssessment = [];
                var arrRecommendation = [];
                var arrTtd = [];
                
                // Helper untuk grouping Parent-Child berdasarkan kodeexternal
                function groupDataByKode(kodeTarget, arrayTarget) {
                    var sama = false;
                    for (var i = 0; i < datas.length; i++) {
                        var element = datas[i];
                        sama = false;
                        if (element.kodeexternal == kodeTarget) {
                            for (var z = 0; z < arrayTarget.length; z++) {
                                var element2 = arrayTarget[z];
                                if (element2.namaexternal == element.namaexternal) {
                                    element2.details.push(element);
                                    sama = true;
                                }
                            }
                            if (sama == false) {
                                var datax = {
                                    caption: element.caption,
                                    cbotable: element.cbotable,
                                    details: [element],
                                    emrfk: element.emrfk,
                                    headfk: element.headfk,
                                    id: element.id,
                                    kdprofile: element.kdprofile,
                                    kodeexternal: element.kodeexternal,
                                    namaemr: element.namaemr,
                                    namaexternal: element.namaexternal,
                                    nourut: element.nourut,
                                    reportdisplay: element.reportdisplay,
                                    satuan: element.satuan,
                                    statusenabled: element.statusenabled,
                                    style: element.style,
                                    type: element.type,
                                };
                                arrayTarget.push(datax);
                            }
                        }
                    }
                }

                groupDataByKode('s_situation', arrSituation);
                groupDataByKode('b_background', arrBackground);
                groupDataByKode('a_assessment', arrAssessment);
                groupDataByKode('r_recommendation', arrRecommendation);
                groupDataByKode('ttd_petugas', arrTtd);
                groupDataByKode('ttd_penerima', arrTtd);

                $scope.listSituation = arrSituation;
                $scope.listBackground = arrBackground;
                $scope.listAssessment = arrAssessment;
                $scope.listRecommendation = arrRecommendation;
                $scope.listTtd = arrTtd;

                loadData();
            });

            function loadData() {
                var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                var nomorEMR = '-';
                var norecEMR = '-';
                if (cacheNomorEMR != undefined && cacheNomorEMR !== '') {
                    nomorEMR = cacheNomorEMR[0] ? cacheNomorEMR[0] : cacheNomorEMR;
                    norecEMR = cacheNomorEMR[1] ? cacheNomorEMR[1] : '-';
                    $scope.cc.norec_emr = nomorEMR;
                }

                if (nomorEMR != '-') {
                    medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&norec=" + norecEMR + "&emrfk=" + $scope.emrid).then(function (e) {
                        var dataLoad = e.data.data;
                        if (dataLoad && dataLoad.length > 0) {
                            $scope.cc.norec_emr = dataLoad[0].emrpasienfk;
                            
                            for (var i = 0; i < dataLoad.length; i++) {
                                var value = dataLoad[i].value;
                                var fieldId = dataLoad[i].emrdfk;
                                var type = dataLoad[i].type;

                                if (type == "textbox" || type == "textarea") {
                                    $scope.item.obj[fieldId] = value;
                                }
                                else if (type == "checkbox") {
                                    $scope.item.obj[fieldId] = (value == '1' || value == 'true' || value == true);
                                }
                                else if (type == "datetime" || type == "time" || type == "date") {
                                    if (value && value !== "" && value !== "Invalid date") {
                                        $scope.item.obj[fieldId] = new Date(value);
                                    }
                                }
                                else if (type == "combobox") {
                                    if (value) {
                                        var res = value.split("~");
                                        $scope.item.obj[fieldId] = { 
                                            value: res[0], 
                                            text: res[1]
                                        };
                                    }
                                }
                            }
                        }
                    });
                }
            });

            $scope.Save = function () {
                var arrSave = [];
                var arrobj = Object.keys($scope.item.obj);
                for (var i = 0; i < arrobj.length; i++) {
                    var elementId = arrobj[i];
                    var itemValue = $scope.item.obj[elementId];

                    if (itemValue instanceof Date) {
                        itemValue = moment(itemValue).format('YYYY-MM-DD HH:mm');
                    }

                    if (itemValue != null && itemValue !== "") {
                        if (typeof itemValue === 'object') {
                            var val = itemValue.id || itemValue.value || "";
                            var txt = itemValue.text || itemValue.namalengkap || itemValue.namaLengkap || itemValue.namaruangan || itemValue.name || "";
                            
                            if (val !== "") {
                                arrSave.push({ id: elementId, values: val + "~" + txt });
                            } else {
                                arrSave.push({ id: elementId, values: itemValue });
                            }
                        } else if (typeof itemValue === 'boolean') {
                            arrSave.push({ id: elementId, values: itemValue ? "1" : "0" });
                        } else {
                            arrSave.push({ id: elementId, values: itemValue });
                        }
                    }
                }

                var cc = $scope.cc;
                cc.emrfk = $scope.emrid;
                cc.jenisemr = 'asesmen';

                var jsonData = {
                    head: cc,
                    data: arrSave
                };

                $scope.tombolSimpanVis = false;
                medifirstService.post('emr/save-emr-dinamis', jsonData).then(function (e) {
                    $scope.cc.norec_emr = e.data.data.noemr;
                    $scope.item.obj = {};
                    $scope.item.obj2 = {};
                    $scope.tombolSimpanVis = true;

                    // Update cache agar data bisa di-load kembali
                    var arrStr = { 0: e.data.data.noemr, 1: e.data.data.norec };
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    cacheHelper.set('cacheNOREC_EMR', arrStr);

                    loadData();

                    if ($rootScope.loadRiwayat) $rootScope.loadRiwayat();
                }, function (error) {
                    $scope.tombolSimpanVis = true;
                });
            };

            $scope.Kembali = function () {
                window.history.back();
            };

        }
    ]);
});
