define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DuranteAnestesiVitalCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, cacheHelper, medifirstService) {

            $scope.item = {};
            $scope.cc = {};
            var nomorEMR = ''
            $scope.tombolSimpanVis = true
            var dataLoad = []
            let emrfk_ = 210043
            var sesiesSuhu = []
            var seriesNadi = []
            var seriesSO2 = []
            var seriesRR = []
            var seriesSis = []
            var seriesDis = []
            var categories = []
            $scope.cc.emrfk = emrfk_

            nomorEMR = '-'
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
            }
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listTanggal = []
            $scope.listTanggal2 = []
            if (nomorEMR == '-') {
                medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + emrfk_).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.title = e.data.title
                    $scope.item.classgrid = e.data.classgrid

                    $scope.cc.emrfk = emrfk_
                    $scope.item.objcbo = []

                    var datas = e.data.kolom4

                    var detail = []
                    var arrayAskep = []
                    var arrayAskep2 = []
                    var arrayParenteral = []
                    var arrayParenteral2 = []
                    var sama = false
                    for (let i = 0; i < datas.length; i++) {

                        const element = datas[i];
                        if (element.id >= 21022624) {
                            sama = false
                            if (element.type == 'time') {
                                $scope.listTanggal.push({ id: element.id })
                            }
                            if (element.kodeexternal == 'date2') {
                                $scope.listTanggal2.push({ id: element.id })
                            }
                            // ARRAY GEJALA
                            if (element.kodeexternal == 'pernafasan') {
                                for (let z = 0; z < arrayAskep.length; z++) {
                                    const element2 = arrayAskep[z];
                                    if (element2.namaexternal == element.namaexternal) {
                                        detail.push(element)
                                        element2.details = detail
                                        sama = true
                                    }
                                }
                                if (sama == false) {
                                    var datax = {
                                        caption: element.caption,
                                        cbotable: element.cbotable,
                                        child: [],
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

                                    }
                                    arrayAskep.push(datax)
                                }
                            }// ARRAY GEJALA



                        }
                        // ARRAY GEJALA
                        var gejalaKosongKeun = []
                        for (let k = 0; k < arrayAskep.length; k++) {
                            const element = arrayAskep[k];
                            for (let l = 0; l < datas.length; l++) {
                                const element2 = datas[l];
                                if (element2.namaexternal == element.namaexternal) {
                                    gejalaKosongKeun.push(element2)
                                    element.details = gejalaKosongKeun
                                } else {
                                    gejalaKosongKeun = []
                                }
                            }
                        }
                        $scope.listData1 = arrayAskep
                    }
                    for (var i = e.data.kolom4.length - 1; i >= 0; i--) {
                        if (e.data.kolom4[i].id >= 21022624) {
                            e.data.kolom4.splice(i, 1)
                        }
                    }
                    for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                        if (e.data.kolom1[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom1[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }

                    for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                        if (e.data.kolom2[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom2[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                        if (e.data.kolom3[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom3.child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom3[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }

                })
            } else {
                var chekedd = false
                medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + emrfk_).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.title = e.data.title
                    $scope.item.classgrid = e.data.classgrid

                    $scope.cc.emrfk = emrfk_

                    var datas = e.data.kolom4

                    var detail = []
                    var arrayAskep = []
                    var arrayAskep2 = []
                    var arrayParenteral = []
                    var arrayParenteral2 = []
                    var sama = false
                    for (let i = 0; i < datas.length; i++) {

                        const element = datas[i];
                        if (element.id >= 21022624) {
                            sama = false
                            if (element.type == 'time') {
                                $scope.listTanggal.push({ id: element.id })
                            }
                            if (element.kodeexternal == 'date2') {
                                $scope.listTanggal2.push({ id: element.id })
                            }
                            // ARRAY GEJALA
                            if (element.kodeexternal == 'pernafasan') {
                                for (let z = 0; z < arrayAskep.length; z++) {
                                    const element2 = arrayAskep[z];
                                    if (element2.namaexternal == element.namaexternal) {
                                        detail.push(element)
                                        element2.details = detail
                                        sama = true
                                    }
                                }
                                if (sama == false) {
                                    var datax = {
                                        caption: element.caption,
                                        cbotable: element.cbotable,
                                        child: [],
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

                                    }
                                    arrayAskep.push(datax)
                                }
                            }// ARRAY GEJALA



                        }
                        // ARRAY GEJALA
                        var gejalaKosongKeun = []
                        for (let k = 0; k < arrayAskep.length; k++) {
                            const element = arrayAskep[k];
                            for (let l = 0; l < datas.length; l++) {
                                const element2 = datas[l];
                                if (element2.namaexternal == element.namaexternal) {
                                    gejalaKosongKeun.push(element2)
                                    element.details = gejalaKosongKeun
                                } else {
                                    gejalaKosongKeun = []
                                }
                            }
                        }
                        $scope.listData1 = arrayAskep
                    }

                    $scope.item.objcbo = []
                    for (var i = e.data.kolom4.length - 1; i >= 0; i--) {
                        if (e.data.kolom4[i].id >= 21022624) {
                            e.data.kolom4.splice(i, 1)
                        }
                    }
                    for (var i = e.data.kolom1.length - 1; i >= 0; i--) {
                        if (e.data.kolom1[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom1[i].id, e.data.kolom1[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom1[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom1[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom1[i].child[ii].id, e.data.kolom1[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    for (var i = e.data.kolom2.length - 1; i >= 0; i--) {
                        if (e.data.kolom2[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom2[i].id, e.data.kolom2[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom2[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom2[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom2[i].child[ii].id, e.data.kolom2[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    for (var i = e.data.kolom3.length - 1; i >= 0; i--) {
                        if (e.data.kolom3[i].cbotable != null) {
                            medifirstService.getPart2(e.data.kolom3[i].id, e.data.kolom3[i].cbotable, true, true, 20).then(function (data) {
                                $scope.item.objcbo[data.options.idididid] = data
                            })
                        }
                        for (var ii = e.data.kolom3[i].child.length - 1; ii >= 0; ii--) {
                            if (e.data.kolom3[i].child[ii].cbotable != null) {
                                medifirstService.getPart2(e.data.kolom3[i].child[ii].id, e.data.kolom3[i].child[ii].cbotable, true, true, 20).then(function (data) {
                                    $scope.item.objcbo[data.options.idididid] = data
                                })
                            }
                        }
                    }
                    medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                        $scope.item.obj = []
                        $scope.item.obj2 = []
                        dataLoad = dat.data.data
                        for (var i = 0; i <= dataLoad.length - 1; i++) {
                            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                                if (dataLoad[i].type == "textbox") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                }
                                if (dataLoad[i].type == "checkbox") {
                                    chekedd = false
                                    if (dataLoad[i].value == '1') {
                                        chekedd = true
                                    }
                                    $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                }

                                if (dataLoad[i].type == "datetime") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD HH:mm:ss');//new Date(dataLoad[i].value)
                                }
                                if (dataLoad[i].type == "time") {
                                    // if (dataLoad[i].value.length == 5) {
                                    //     var date = moment(new Date()).format('YYYY-MM-DD')
                                    //     $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(date + ' ' + dataLoad[i].value)).format('HH:mm');//new Date(dataLoad[i].value)
                                    // } else {
                                    $scope.item.obj[dataLoad[i].emrdfk] =new Date(dataLoad[i].value);// moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD HH:mm');//new Date(dataLoad[i].value)
                                    // }
                                }
                                if (dataLoad[i].type == "date") {
                                    $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('YYYY-MM-DD');//new Date(dataLoad[i].value)
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
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                                }
                            }

                        }
                        categories = []
                        var arrobj = Object.keys($scope.item.obj)
                        for (let ii = 0; ii < arrobj.length; ii++) {
                            if (parseInt(arrobj[ii]) >= 21022624 && parseInt(arrobj[ii]) <= 21022671) {
                                if ($scope.item.obj[parseFloat(arrobj[ii])] instanceof Date) {
                                    categories.push(moment($scope.item.obj[parseFloat(arrobj[ii])]).format('HH:mm'))
                                } else {
                                    var date = moment(new Date()).format('YYYY-MM-DD')
                                    categories.push(moment(date + ' ' + $scope.item.obj[parseFloat(arrobj[ii])]).format('HH:mm'))
                                }
                            }
                        }
                        var arrobj = Object.keys($scope.item.obj)

                        for (var i = arrobj.length - 1; i >= 0; i--) {

                            for (let y = 0; y < 47; y++) {
                                if (arrobj[i] == 21022672 + y && arrobj[i] != '')
                                    sesiesSuhu[y] = $scope.item.obj[parseFloat(arrobj[i])]
                            }
                            for (let y = 0; y < 47; y++) {
                                if (arrobj[i] == 21022768 + y && arrobj[i] != '')
                                    seriesNadi[y] = $scope.item.obj[parseFloat(arrobj[i])]
                            }
                            for (let y = 0; y < 47; y++) {
                                if (arrobj[i] == 22034782 + y && arrobj[i] != '')
                                    seriesSO2[y] = $scope.item.obj[parseFloat(arrobj[i])]
                            }
                            for (let y = 0; y < 47; y++) {
                                if (arrobj[i] == 21022720 + y && arrobj[i] != '')
                                    seriesRR[y] = $scope.item.obj[parseFloat(arrobj[i])]
                            }

                            for (let y = 0; y < 47; y++) {
                                if (arrobj[i] == 21022816 + y && arrobj[i] != '') {
                                    var td = $scope.item.obj[parseFloat(arrobj[i])]
                                    td = td.split('/')
                                    if (td.length == 2) {
                                        seriesSis[y] = td[0]
                                        seriesDis[y] = td[1]
                                    }
                                }
                            }
                        }


                        for (let x = 0; x < sesiesSuhu.length; x++) {
                            if (!isNaN(parseFloat(sesiesSuhu[x])))
                                sesiesSuhu[x] = parseFloat(sesiesSuhu[x])

                        }
                        for (let x = 0; x < seriesNadi.length; x++) {
                            if (!isNaN(parseInt(seriesNadi[x])))
                                seriesNadi[x] = parseInt(seriesNadi[x])

                        }
                        for (let x = 0; x < seriesSO2.length; x++) {
                            if (!isNaN(parseInt(seriesSO2[x])))
                                seriesSO2[x] = parseInt(seriesSO2[x])

                        }
                        for (let x = 0; x < seriesRR.length; x++) {
                            if (!isNaN(parseInt(seriesRR[x])))
                                seriesRR[x] = parseInt(seriesRR[x])

                        }
                        for (let x = 0; x < seriesSis.length; x++) {
                            if (!isNaN(parseInt(seriesSis[x])))
                                seriesSis[x] = parseInt(seriesSis[x])
                        }
                        for (let x = 0; x < seriesDis.length; x++) {
                            if (!isNaN(parseInt(seriesDis[x])))
                                seriesDis[x] = parseInt(seriesDis[x])
                        }
                        loadChart()
                        loadChart2()
                    })

                });
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
                if (nomorEMR == '') {
                    $scope.cc.norec_emr = ''
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }


            $scope.txt_change = function (index) {
                $scope.item.txt[index] = "asdasdad"
            };
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'bedah'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    afterSave(e)
                    var arrobj = Object.keys($scope.item.obj)
                    categories = []

                    for (let i = 0; i < arrobj.length; i++) {
                        if (arrobj[i] >= 21022624 && arrobj[i] <= 21022671) {
                            $scope.item.obj[parseFloat(arrobj[i])] = new Date($scope.item.obj[parseFloat(arrobj[i])])
                            // if ($scope.item.obj[parseFloat(arrobj[i])] instanceof Date) {
                            categories.push(moment($scope.item.obj[parseFloat(arrobj[i])]).format('HH:mm'))
                            // }else{
                            //     categories.push(moment(new Date($scope.item.obj[parseFloat(arrobj[i])])).format('HH:mm'))
                            // }
                        }
                    }
                    for (var i = arrobj.length - 1; i >= 0; i--) {

                        for (let z = 0; z < 47; z++) {
                            if (arrobj[i] == 21022672 + z && arrobj[i] != '')
                                sesiesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 47; z++) {
                            if (arrobj[i] == 21022768 + z && arrobj[i] != '')
                                seriesNadi[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 47; z++) {
                            if (arrobj[i] == 22034782 + z && arrobj[i] != '')
                                seriesSO2[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 47; z++) {
                            if (arrobj[i] == 21022720 + z && arrobj[i] != '')
                                seriesRR[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        }
                        for (let z = 0; z < 47; z++) {
                            if (arrobj[i] == 21022816 + z && arrobj[i] != '') {
                                var td = $scope.item.obj[parseFloat(arrobj[i])]
                                td = td.split('/')
                                if (td.length == 2) {
                                    seriesSis[z] = td[0]
                                    seriesDis[z] = td[1]
                                }

                            }
                        }

                    }
                    for (let x = 0; x < sesiesSuhu.length; x++) {
                        if (!isNaN(parseFloat(sesiesSuhu[x])))
                            sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                    }
                    for (let x = 0; x < seriesNadi.length; x++) {
                        if (!isNaN(parseInt(seriesNadi[x])))
                            seriesNadi[x] = parseInt(seriesNadi[x])
                    }
                    for (let x = 0; x < seriesSO2.length; x++) {
                        if (!isNaN(parseInt(seriesSO2[x])))
                            seriesSO2[x] = parseInt(seriesSO2[x])
                    }
                    for (let x = 0; x < seriesRR.length; x++) {
                        if (!isNaN(parseInt(seriesRR[x])))
                            seriesRR[x] = parseInt(seriesRR[x])
                    }
                    for (let x = 0; x < seriesSis.length; x++) {
                        if (!isNaN(parseInt(seriesSis[x])))
                            seriesSis[x] = parseInt(seriesSis[x])
                    }
                    for (let x = 0; x < seriesDis.length; x++) {
                        if (!isNaN(parseInt(seriesDis[x])))
                            seriesDis[x] = parseInt(seriesDis[x])
                    }
                    loadChart()
                    loadChart2()
                });
            }
            function afterSave(e) {
                $scope.cc.norec_emr = e.data.data.noemr
                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Durante Anestesi Tanda Vita;l' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                // $rootScope.loadHistoryEMRBedah();
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }
            loadChart()
            function loadChart() {
                for (var i = sesiesSuhu.length - 1; i >= 0; i--) {
                    const element = sesiesSuhu[i]
                    if (element == '') {
                        sesiesSuhu.splice(i, 1)
                    }
                }
                for (var i = seriesRR.length - 1; i >= 0; i--) {
                    const element = seriesRR[i]
                    if (element == '') {
                        seriesRR.splice(i, 1)
                    }
                }
                for (var i = seriesNadi.length - 1; i >= 0; i--) {
                    const element = seriesNadi[i]
                    if (element == '') {
                        seriesNadi.splice(i, 1)
                    }
                }
                for (var i = seriesSO2.length - 1; i >= 0; i--) {
                    const element = seriesSO2[i]
                    if (element == '') {
                        seriesSO2.splice(i, 1)
                    }
                }
                Highcharts.chart('container', {

                    title: {
                        text: 'Grafik Tanda Vital'
                    },

                    subtitle: {
                        text: ''
                    },

                    yAxis: {
                        title: {
                            text: 'Jumlah'
                        }
                    },

                    xAxis: {
                        title: {
                            text: 'Waktu'
                        },
                        categories: categories,
                        crosshair: true
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            cursor: 'pointer',

                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.y;
                                }
                            },
                            showInLegend: true
                        }
                    },

                    series: [{
                        name: 'Suhu',
                        data: sesiesSuhu,
                        color: '#faf452'
                    }, {
                        name: 'Pernafasan',
                        data: seriesRR,
                        color: '#f242f5'
                    }, {
                        name: 'Nadi',
                        data: seriesNadi,
                        color: '#42f55a'
                    }, {
                        name: 'Saturasi O2',
                        data: seriesSO2,
                        color: '#41abf2'
                    },
                        //  {
                        //     name: 'Sistole',
                        //     data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                        // },
                        // {
                        //     name: 'Diastole',
                        //     data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                        // }
                    ],

                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }

                });
            }
            loadChart2()
            function loadChart2() {
                for (var i = seriesDis.length - 1; i >= 0; i--) {
                    const element = seriesDis[i]
                    if (element == '') {
                        seriesDis.splice(i, 1)
                    }
                }
                for (var i = seriesSis.length - 1; i >= 0; i--) {
                    const element = seriesSis[i]
                    if (element == '') {
                        seriesSis.splice(i, 1)
                    }
                }
                Highcharts.chart('container2', {

                    title: {
                        text: 'Grafik Tekanan Darah'
                    },

                    subtitle: {
                        text: ''
                    },

                    yAxis: {
                        title: {
                            text: 'Jumlah'
                        }
                    },

                    xAxis: {
                        title: {
                            text: 'Waktu'
                        },
                        categories: categories,
                        crosshair: true
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            cursor: 'pointer',

                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.y;
                                }
                            },
                            showInLegend: true
                        }
                    },

                    series: [{
                        name: 'Sistolik',
                        data: seriesSis,
                        color: "#fc1303"
                    }, {
                        name: 'Diastolik',
                        data: seriesDis,
                        color: "#03a9fc"
                    },
                    ],

                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }

                });
            }


        }
    ]);
});