define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BedahDuranteAnestesiCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, cacheHelper, medifirstService) {

            $scope.item = {};
            $scope.cc = {};
            var namaEMR = ''
            var nomorEMR = ''
            $scope.tombolSimpanVis = true
            var dataLoad = []
            var sesiesSuhu = []
            var seriesNadi = []
            var seriesRR = []
            var seriesSis = []
            var seriesDis = []
            var categories = []
            var datasArr = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            $scope.listData6 = []
            $scope.listData7 = []
            $scope.listData8 = []
            $scope.listData9 = []
            $scope.listData10 = []
            $scope.listData11 = []
            $scope.listData12 = []
            $scope.listData13 = []
            $scope.listData14 = []
            $scope.listTanggal = []
            $scope.listTanggal2 = []
            let emr_fk = 210027
            $scope.cc.emrfk = emr_fk
            // nomorEMR = $state.params.nomorEMR
            nomorEMR = '-'
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
            }
            // 21021952
            if (nomorEMR == '-') {
                medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + emr_fk).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.title = e.data.title
                    $scope.item.classgrid = e.data.classgrid

                    $scope.cc.emrfk = emr_fk
                    $scope.item.objcbo = []
                    setMasterTable(e)
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
                //  medifirstService.get("emr/get-emr-transaksi-detail?noemr="+$state.params.nomorEMR, true).then(function(dat){
                medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + emr_fk).then(function (e) {
                    $scope.listData = e.data
                    $scope.item.title = e.data.title
                    $scope.item.classgrid = e.data.classgrid

                    $scope.cc.emrfk = emr_fk

                    $scope.item.objcbo = []
                  
                    setMasterTable(e)
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
                                    $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                                    // $scope.item.obj[dataLoad[i].emrdfk] = moment(new Date(dataLoad[i].value)).format('HH:mm');//new Date(dataLoad[i].value)
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
                                    // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                                }
                            }

                        }
                    })



                });
            }




            function setMasterTable(e){
                datasArr = e.data.kolom4
                var datas = e.data.kolom4
                var detail = []
                var array1 = []
                var array2 = []
                var array3 = []
                var array4 = []
                var array5 = []
                var array6 = []
                var array7 = []
                var array8 = []
                var array9 = []
                var array10 = []
                var array11 = []
                var array12 = []
                var array13 = []
                var array14 = []
                var sama = false
                for (let i = 0; i < datas.length; i++) {

                    const element = datas[i];
                    if (element.id >= 21021952) {
                        sama = false
                        if (element.type == 'time') {
                            $scope.listTanggal.push({ id: element.id })
                        }
                        if (element.kodeexternal == 'date2') {
                            $scope.listTanggal2.push({ id: element.id })
                        }
                        // ARRAY GEJALA
                        if (element.kodeexternal == '1') {
                            for (let z = 0; z < array1.length; z++) {
                                const element2 = array1[z];
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
                                array1.push(datax)
                            }
                        }// ARRAY GEJALA

                        // ARRAY GEJALA
                        if (element.kodeexternal == '2') {
                            for (let z = 0; z < array2.length; z++) {
                                const element2 = array2[z];
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
                                array2.push(datax)
                            }
                        }// 2

                        // ARRAY GEJALA
                        if (element.kodeexternal == '3') {
                            for (let z = 0; z < array3.length; z++) {
                                const element2 = array3[z];
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
                                array3.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '4') {
                            for (let z = 0; z < array4.length; z++) {
                                const element2 = array4[z];
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
                                array4.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '5') {
                            for (let z = 0; z < array5.length; z++) {
                                const element2 = array5[z];
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
                                array5.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '6') {
                            for (let z = 0; z < array6.length; z++) {
                                const element2 = array6[z];
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
                                array6.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '7') {
                            for (let z = 0; z < array7.length; z++) {
                                const element2 = array7[z];
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
                                array7.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '8') {
                            for (let z = 0; z < array8.length; z++) {
                                const element2 = array8[z];
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
                                array8.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '9') {
                            for (let z = 0; z < array9.length; z++) {
                                const element2 = array9[z];
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
                                array9.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '10') {
                            for (let z = 0; z < array10.length; z++) {
                                const element2 = array10[z];
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
                                array10.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '11') {
                            for (let z = 0; z < array11.length; z++) {
                                const element2 = array11[z];
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
                                array11.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '12') {
                            for (let z = 0; z < array12.length; z++) {
                                const element2 = array12[z];
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
                                array12.push(datax)
                            }
                        }// 2
                        // ARRAY GEJALA
                        if (element.kodeexternal == '13') {
                            for (let z = 0; z < array13.length; z++) {
                                const element2 = array13[z];
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
                                array13.push(datax)
                            }
                        }// 2

                        // ARRAY GEJALA
                        if (element.kodeexternal == '14') {
                            for (let z = 0; z < array14.length; z++) {
                                const element2 = array14[z];
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
                                array14.push(datax)
                            }
                        }// 2


                    }
                    // ARRAY GEJALA
                    var array1Kos = []
                    for (let k = 0; k < array1.length; k++) {
                        const element = array1[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array1Kos.push(element2)
                                element.details = array1Kos
                            } else {
                                array1Kos = []
                            }
                        }
                    }
                    $scope.listData1 = array1

                    // 2
                    var array2Kos = []
                    for (let k = 0; k < array2.length; k++) {
                        const element = array2[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array2Kos.push(element2)
                                element.details = array2Kos
                            } else {
                                array2Kos = []
                            }
                        }
                    }
                    $scope.listData2 = array2

                    // 3
                    var array3Kos = []
                    for (let k = 0; k < array3.length; k++) {
                        const element = array3[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array3Kos.push(element2)
                                element.details = array3Kos
                            } else {
                                array3Kos = []
                            }
                        }
                    }
                    $scope.listData3 = array3

                    // 4
                    var array4Kos = []
                    for (let k = 0; k < array4.length; k++) {
                        const element = array4[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array4Kos.push(element2)
                                element.details = array4Kos
                            } else {
                                array4Kos = []
                            }
                        }
                    }
                    $scope.listData4 = array4

                    // 5
                    var array5Kos = []
                    for (let k = 0; k < array5.length; k++) {
                        const element = array5[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array5Kos.push(element2)
                                element.details = array5Kos
                            } else {
                                array5Kos = []
                            }
                        }
                    }
                    $scope.listData5 = array5

                    // 6
                    var array6Kos = []
                    for (let k = 0; k < array6.length; k++) {
                        const element = array6[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array6Kos.push(element2)
                                element.details = array6Kos
                            } else {
                                array6Kos = []
                            }
                        }
                    }
                    $scope.listData6 = array6

                    // 7
                    var array7Kos = []
                    for (let k = 0; k < array7.length; k++) {
                        const element = array7[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array7Kos.push(element2)
                                element.details = array7Kos
                            } else {
                                array7Kos = []
                            }
                        }
                    }
                    $scope.listData7 = array7

                    // 8
                    var array8Kos = []
                    for (let k = 0; k < array8.length; k++) {
                        const element = array8[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array8Kos.push(element2)
                                element.details = array8Kos
                            } else {
                                array8Kos = []
                            }
                        }
                    }
                    $scope.listData8 = array8


                    // 9
                    var array9Kos = []
                    for (let k = 0; k < array9.length; k++) {
                        const element = array9[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array9Kos.push(element2)
                                element.details = array9Kos
                            } else {
                                array9Kos = []
                            }
                        }
                    }
                    $scope.listData9 = array9

                    // 10
                    var array10Kos = []
                    for (let k = 0; k < array10.length; k++) {
                        const element = array10[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array10Kos.push(element2)
                                element.details = array10Kos
                            } else {
                                array10Kos = []
                            }
                        }
                    }
                    $scope.listData10 = array10


                    // 11
                    var array11Kos = []
                    for (let k = 0; k < array11.length; k++) {
                        const element = array11[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array11Kos.push(element2)
                                element.details = array11Kos
                            } else {
                                array11Kos = []
                            }
                        }
                    }
                    $scope.listData11 = array11

                    // 12
                    var array12Kos = []
                    for (let k = 0; k < array12.length; k++) {
                        const element = array12[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array12Kos.push(element2)
                                element.details = array12Kos
                            } else {
                                array12Kos = []
                            }
                        }
                    }
                    $scope.listData12 = array12

                    // 13
                    var array13Kos = []
                    for (let k = 0; k < array13.length; k++) {
                        const element = array13[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array13Kos.push(element2)
                                element.details = array13Kos
                            } else {
                                array13Kos = []
                            }
                        }
                    }
                    $scope.listData13 = array13

                    // 14
                    var array14Kos = []
                    for (let k = 0; k < array14.length; k++) {
                        const element = array14[k];
                        for (let l = 0; l < datas.length; l++) {
                            const element2 = datas[l];
                            if (element2.namaexternal == element.namaexternal) {
                                array14Kos.push(element2)
                                element.details = array14Kos
                            } else {
                                array14Kos = []
                            }
                        }
                    }
                    $scope.listData14 = array14


                }
                for (var i = e.data.kolom4.length - 1; i >= 0; i--) {
                    if (e.data.kolom4[i].id >= 21021952) {
                        e.data.kolom4.splice(i, 1)
                    }
                }

                console.clear()
                console.log($scope.listData10)
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
                    for (let i = 0; i < arrobj.length; i++) {
                        var datatime = parseFloat(arrobj[i])
                        if( datatime >= 21021953 && datatime <= 21021987 || datatime >= 21022001 && datatime <= 21022035 || datatime >= 21022049 && datatime <= 21022083 || datatime >= 21022097 && datatime <= 21022131 || datatime >= 21022145 && datatime <= 21022179)
                        {
                            let date = new Date($scope.item.obj[parseFloat(arrobj[i])])
                            if(date != undefined){
                                date = date.getTime()
                            }
                            if (isNaN(date)) {  // d.valueOf() could also work
                               // date is not valid
                             } else {
                              $scope.item.obj[parseFloat(arrobj[i])] = new Date($scope.item.obj[parseFloat(arrobj[i])])
                             }
                        }
                    }
                    afterSave(e)
                });
            }
            function afterSave(e) {
                $scope.cc.norec_emr = e.data.data.noemr
                medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Durante Anestesi ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                // $rootScope.loadHistoryEMRBedah();
                var arrStr = {
                    0: e.data.data.noemr
                }
                cacheHelper.set('cacheNomorEMR', arrStr);
            }


        }
    ]);
});