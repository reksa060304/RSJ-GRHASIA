define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseUrlData;
    initialize.controller('CpptDinamisDetailCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService','$mdDialog', '$q', '$sce', '$timeout', "$ocLazyLoad",
        function ($rootScope, $scope, $state, cacheHelper, medifirstService, $mdDialog, $q, $sce, $timeout, $ocLazyLoad) {

            $scope.item = {};
            $scope.cc = {};
            $scope.show = {};
            $scope.isIframeLoading = false;
            var namaEMR = ''
            var nomorEMR = '-'
            $scope.cc.emrfk = $state.params.namaEMR
            $scope.tombolSimpanVis = true;
            $scope.RiwayatCPPTRJLama = false;
            $scope.RiwayatCPPTRJBaru = false;
            $scope.RiwayatCPPTRI = false;
            $scope.norecAPD = $state.params.noRec
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            var dataLoad = [];
            LoadCache();
            FormLoad();
            var pegawaiLogin = medifirstService.getPegawaiLogin()
            $scope.allDisabled = false
            var pegawaiInputDetail  =''
            // nomorEMR = $state.params.nomorEMR   
            $scope.item.obj = [];
            $scope.item.obj2 = [];
            $scope.show.obj = [];
            $scope.iframeLoaded = function (el) {
                var iframe = el || document.getElementById('iframeCetak');
                if (!iframe) return;
                var isAboutBlank = false;
                try {
                    if (iframe.src === 'about:blank' || (iframe.contentWindow && iframe.contentWindow.location.href.indexOf('about:blank') > -1)) {
                        isAboutBlank = true;
                    }
                } catch (secError) {
                    isAboutBlank = false;
                }
                if (isAboutBlank) return;
                $timeout(function () {
                    $scope.isIframeLoading = false;
                });
                // blok klik kanan
                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    var blockMenu = function (e) { e.preventDefault(); return false; };
                    iframeDoc.addEventListener('contextmenu', blockMenu);
                    if (iframeDoc.body) iframeDoc.body.addEventListener('contextmenu', blockMenu);
                    iframeDoc.addEventListener('keydown', function(e) {
                        if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 80 || e.keyCode === 74 || e.keyCode === 85)) {
                            e.preventDefault();
                            return false;
                        }
                    });
                } catch (e) {
                    
                }
            }

            var blockKeys = function (e) {
                // Block Ctrl+S, Ctrl+P, Ctrl+J, Ctrl+U
                if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 80 || e.keyCode === 74 || e.keyCode === 85)) {
                    e.preventDefault();
                    return false;
                }
            };

            $scope.iframeHeight = 1500;
            
            function onScrollContainer() {
                var container = document.getElementById('cetakScrollContainer');
                if (container) {
                    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 600) {
                        $scope.$apply(function() {
                            $scope.iframeHeight += 3000;
                        });
                    }
                }
            }

            $scope.onOpenPopupCetak = function () {
                $scope.iframeHeight = 1500;
                window.addEventListener('keydown', blockKeys);
                $timeout(function() {
                    var container = document.getElementById('cetakScrollContainer');
                    if (container) {
                        container.addEventListener('scroll', onScrollContainer);
                    }
                }, 500);
            }

            $scope.onClosePopupCetak = function () {
                $scope.isIframeLoading = false;
                $scope.cetakanUrl = $sce.trustAsResourceUrl("about:blank");
                window.removeEventListener('keydown', blockKeys);
                var container = document.getElementById('cetakScrollContainer');
                if (container) {
                    container.removeEventListener('scroll', onScrollContainer);
                }
                $scope.iframeHeight = 1500;
            }
            $scope.showbtnadd = [];
            $scope.showbtnremove = [];
            $scope.show.obj[22034963] = true
            $scope.showbtnadd[22034963] = true
            $scope.showbtnremove[22034963] = false
            var emrcppt = [443, 444, 445, 446, 447, 448, 94, 210222];
            var norecEMR = ''
            $scope.listDataCppt = [
                {
                    "id": 22034963, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034961, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034962, "nama": "ppa", "type": "ppa" },
                        { "id": 22034963, "id2": 22034964, "nama": "soap", "type": "soap" },
                        { "id": 22034965, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034966, "id2": 22034967, "id3": 22034968, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034971, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034969, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034970, "nama": "ppa", "type": "ppa" },
                        { "id": 22034971, "id2": 22034972, "nama": "soap", "type": "soap" },
                        { "id": 22034973, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034974, "id2": 22034975, "id3": 22034976, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034979, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034977, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034978, "nama": "ppa", "type": "ppa" },
                        { "id": 22034979, "id2": 22034980, "nama": "soap", "type": "soap" },
                        { "id": 22034981, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034982, "id2": 22034983, "id3": 22034984, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034987, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034985, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034986, "nama": "ppa", "type": "ppa" },
                        { "id": 22034987, "id2": 22034988, "nama": "soap", "type": "soap" },
                        { "id": 22034989, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034990, "id2": 22034991, "id3": 22034992, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034995, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034993, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034994, "nama": "ppa", "type": "ppa" },
                        { "id": 22034995, "id2": 22034996, "nama": "soap", "type": "soap" },
                        { "id": 22034997, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034998, "id2": 22034999, "id3": 22035000, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22035003, "nama": "Baris satu",
                    "detail": [
                        { "id": 22035001, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22035002, "nama": "ppa", "type": "ppa" },
                        { "id": 22035003, "id2": 22035004, "nama": "soap", "type": "soap" },
                        { "id": 22035005, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22035006, "id2": 22035007, "id3": 22035008, "nama": "review", "type": "review" },
                    ]
                }
            ]
            $scope.listDataCpptLama = [
                {
                    "id": 1, "nama": "Vital Sign",
                    "detail": [
                        { "id": 7001, "nama": "Tekanan Darah", "type": "textbox", "satuan": "mmHg" },
                        { "id": 7002, "nama": "Tinggi Badan", "type": "textbox", "satuan": "Cm" },
                        { "id": 7003, "nama": "Berat Badan", "type": "textbox", "satuan": "Kg" },
                        { "id": 7004, "nama": "Suhu", "type": "textbox", "satuan": "C" },
                        { "id": 7005, "nama": "Nadi", "type": "textbox", "satuan": "x/menit" },
                        { "id": 7006, "nama": "Pernapasan", "type": "textbox", "satuan": "x/menit" },
                    ]
                },
                {
                    "id": 2, "nama": "SOAP RAWAT JALAN",
                    "detail": [
                        { "id": 4248, "nama": "S", "type": "textarea", "satuan": "" },
                        { "id": 4249, "nama": "O", "type": "textarea", "satuan": "" },
                        { "id": 4250, "nama": "A", "type": "textarea", "satuan": "" },
                        { "id": 4251, "nama": "P", "type": "textarea", "satuan": "" },
                        { "id": 5236, "nama": "Intruksi", "type": "textarea", "satuan": "" },
                    ]
                }
            ]
            
            function LoadCache() {
                // nomorEMR = '-'
                var chacePeriode = cacheHelper.get('cacheNomorEMR');
                var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
                if (cacheNoREC != undefined) {
                    norecEMR = chacePeriode[1]
                }
                if (chacePeriode != undefined) {
                    nomorEMR = chacePeriode[0]
                    $scope.cc.norec_emr = nomorEMR
                    $scope.cc.tanggalEmrl = chacePeriode[2]
                    norecEMR = chacePeriode[1]
                }
            }

            function FormLoad() {

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
                    $scope.cc.noreservasi = chacePeriode[30]
                    if (nomorEMR == '-') {
                        $scope.cc.norec_emr = '-'
                    } else {
                        $scope.cc.norec_emr = nomorEMR
                    }
                }
                loadRiwayat($scope.cc.nocm);
                //load settingan url
                medifirstService.get("sysadmin/settingdatafixed/get/MappingCetakEmr").then(function (res) {
                    if (res.data && res.data.value) {
                        $scope.dbReportMappingStr = res.data.value;
                    }
                });
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                console.log('State change to: ' + toState.name);
                if (toState.name.indexOf('EMR') > -1 || toParams.namaEMR) {
                    toastr.info('Memuat form...', 'Informasi');
                    $scope.isRouteLoading = true;
                    if ($scope.item) {
                        $scope.item.obj = [];
                    }
                }
            });

            function loadRiwayat(params) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-riwayatcppt-rajalranap?nocm=" + params, true).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.dataGridRiwayatCPPT = new kendo.data.DataSource({
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
            }
            $scope.cetakEMR = function(e){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
          
                var norecEMR = e.norec
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var id_nama = medifirstService.getPegawaiLogin().id
                if (norecEMR == '') return
               
            
                if(e.emrid == 443){
                    window.open(config.baseApiBackend + 'report/cetak-cppt-ranap?nocm='
                    + $scope.cc.nocm + '&norec_apd='+  $scope.cc.norec +'&emr=' + norecEMR
                    + '&emrfk='+  e.emrid
                    +'&kdprofile='+local.id 
                    +'&nama='+nama,  '_blank');
                }else{
                    window.open(config.baseApiBackend + 'report/cetak-catatan-klinik?nocm='
                    + $scope.cc.nocm + '&norec_apd='+ $scope.cc.norec+'&emr=' + norecEMR
                    + '&emrfk='+  e.emrid
                    +'&kdprofile='+ profile
                    +'&nama=' + nama + '&id=' + id_nama,
                    +  '_blank');
                }
               
            
               
                   
            }

            $scope.cetakdetailEMR = function (e) {
                if (!e) return;
                var dataToPrint = {
                    emrfk: e.emrid ? e.emrid : e.emrfk,
                    norec_emr: e.norec ? e.norec : e.norec_emr,
                    caption: e.caption ? e.caption : e.reportdisplay,
                    nocm: e.nocm ? e.nocm : $scope.cc.nocm,
                    norec_apd: e.norec_apd ? e.norec_apd : $scope.cc.norec,
                    norec_pd: e.norec_pd ? e.norec_pd : $scope.cc.norec_pd,
                    noregistrasi: e.noregistrasi ? e.noregistrasi : $scope.cc.noregistrasi
                };
                $scope.detailEMR(dataToPrint);
            }
            
            $scope.columnGridRiwayatCPPT = {
                selectable: 'row',
                pageable: true,
                columns:[
                    {
                        "field": "noemr",
                        "title": "#",
                        "width": "5%",
                        "template": "<em class=\"k-button k-button-icon  k-secondary\" style=\"margin: 3px;padding-left: .4em;padding-right: .4em; margin-left: -3px;\" ng-click=\"cetakEMR(dataItem)\"> <span class=\"k-sprite fa fa-print\" title=\"Cetak\" style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\"></span></em> "+
                        "<em class=\"k-button k-button-icon  k-secondary\" style=\"margin: 3px;padding-left: .4em;padding-right: .4em; margin-left: -3px;\" ng-click=\"selectGrid(dataItem)\"> <span class=\"k-sprite fa fa-history\" title=\"History\" style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\"></span></em>",
                        attributes: {
                            style: "text-align: center;"
                        } 
                    },
                    {
                        "field": "tglemr",
                        "title": "Tanggal EMR",
                        "width": "10%",
                    },
                    {
                        "field": "caption",
                        "title": "Nama EMR",
                        "width": "25%",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "25%",
                    },
                    // {
                    //     "field": "noregistrasifk",
                    //     "title": "No Registrasi",
                    //     "width": "15%",
                    //     attributes: {
                    //         style: "text-align: center;"
                    //     } 
                    // },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "25%",
                    },
                    {
                        "field": "noemr",
                        "title": "No EMR",
                        "width": "15%",
                        attributes: {
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tanggal Registrasi",
                        "width": "10%",
                    },
                    // {
                    //     "field": "noemr",
                    //     "title": "TTD Elektronik",
                    //     "width": "10%",
                    //     "template": "<em class=\"k-button k-button-icon  k-secondary\" style=\"margin: 3px;padding-left: .4em;padding-right: .4em; margin-left: -3px;\" ng-click=\"ttdElek(dataItem)\"> <span class=\"k-sprite fa fa-print\" title=\"Cetak\" style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\"></span></em> "
                    //         ,
                    //     attributes: {
                    //         style: "text-align: center;"
                    //     }
                    // },
                ]
            }
            $scope.selectGrid = function(data){
             
                var emrfk = data.emrid
                var noemr = data.noemr
                switch(emrfk)
                {
                    case 94:
                        loadRiwayatCPPTData(noemr, 6);
                        $scope.RiwayatCPPTRJLama = true;
                        $scope.RiwayatCPPTRJBaru = false;
                        $scope.RiwayatCPPTRI = false;
                        break;
                    case 210222:
                        loadRiwayatCPPTData(noemr, 7);
                        $scope.RiwayatCPPTRJBaru = true;
                        $scope.RiwayatCPPTRJLama = false;
                        $scope.RiwayatCPPTRI = false;
                        break;
                    default:
                        loadRiwayatCPPTData(noemr, 0);
                        $scope.HtmlCppt = true;
                        $scope.hiddennoemr = noemr;
                        $scope.RiwayatCPPTRI = true;
                        $scope.RiwayatCPPTRJBaru = false;
                        $scope.RiwayatCPPTRJLama = false;
                }
                var actions = $scope.popUps.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.popUps.setOptions({ actions : actions });
                $scope.popUps.center().open();
            }
            $scope.selectGridEdit = function(data){
                console.log('data edit', data);
             
                var emrfk = data.emrid
                var noemr = data.noemr
                var emrdfk = data.emrdfk
                switch(emrfk)
                {
                    case 94:
                        loadRiwayatCPPTDataEdit(noemr, 6);
                        $scope.RiwayatCPPTRJLama = true;
                        $scope.RiwayatCPPTRJBaru = false;
                        $scope.RiwayatCPPTRI = false;
                        break;
                    case 210222:
                        loadRiwayatCPPTDataEdit(noemr, 7);
                        $scope.RiwayatCPPTRJBaru = true;
                        $scope.RiwayatCPPTRJLama = false;
                        $scope.RiwayatCPPTRI = false;
                        break;
                    default:
                        loadRiwayatCPPTDataEdit(noemr, 0);
                        $scope.HtmlCppt = true;
                        $scope.hiddennoemr = noemr;
                        $scope.RiwayatCPPTRI = true;
                        $scope.RiwayatCPPTRJBaru = false;
                        $scope.RiwayatCPPTRJLama = false;
                }
                var actions = $scope.popUpsEdit.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.popUpsEdit.setOptions({ actions : actions });
                $scope.popUpsEdit.center().open();
            }
            $scope.onSelectionGrid = function (kendoEvent) {
                var grid = kendoEvent.sender;
                var selectedData = grid.dataItem(grid.select());

                // var data = selectedData
                // var emrfk = data.emrid
                // var noemr = data.noemr
                // switch(emrfk)
                // {
                //     case 94:
                //         loadRiwayatCPPTData(noemr, 6);
                //         $scope.RiwayatCPPTRJLama = true;
                //         $scope.RiwayatCPPTRJBaru = false;
                //         $scope.RiwayatCPPTRI = false;
                //         break;
                //     case 210222:
                //         loadRiwayatCPPTData(noemr, 7);
                //         $scope.RiwayatCPPTRJBaru = true;
                //         $scope.RiwayatCPPTRJLama = false;
                //         $scope.RiwayatCPPTRI = false;
                //         break;
                //     default:
                //         loadRiwayatCPPTData(noemr, 0);
                //         $scope.HtmlCppt = true;
                //         $scope.hiddennoemr = noemr;
                //         $scope.RiwayatCPPTRI = true;
                //         $scope.RiwayatCPPTRJBaru = false;
                //         $scope.RiwayatCPPTRJLama = false;
                // }
                // var actions = $scope.popUps.options.actions;
                // actions.splice(actions.indexOf("Close"), 1);
                // // Set the new options
                // $scope.popUps.setOptions({ actions : actions });
                // $scope.popUps.center().open();
            }

            function loadRiwayatCPPTData(noemr, iemrcppt)
            {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + noemr + "&emrfk=" + emrcppt[iemrcppt], true).then(function (dat) {
                    $scope.item.rcppt = []
                    var dataLoadrcppt = dat.data.data

                    // for (let i = 0; i < dataLoadrcppt.length; i++) {
                    //     const element = dataLoadrcppt[i];
                    //     element.nourut = parseInt(element.nourut)
                    // }
                    // dataLoadrcppt.sort(function (a, b) {
                    //     if (a.nourut < b.nourut) { return -1; }
                    //     if (a.nourut > b.nourut) { return 1; }
                    //     return 0;
                    // })

                    for (var i = 0; i <= dataLoadrcppt.length - 1; i++) {
                        if (parseFloat(emrcppt[iemrcppt]) == dataLoadrcppt[i].emrfk) {

                            if (dataLoadrcppt[i].type == "textbox") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = dataLoadrcppt[i].value
                            }
                            if (dataLoadrcppt[i].type == "datetime") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = new Date(dataLoadrcppt[i].value)
                            }
                            if (dataLoadrcppt[i].type == "datetime2") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = new Date(dataLoadrcppt[i].value)
                            }
                            if (dataLoadrcppt[i].type == "time") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = new Date(dataLoadrcppt[i].value)
                            }
                            if (dataLoadrcppt[i].type == "date") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = new Date(dataLoadrcppt[i].value)
                            }
                            if (dataLoadrcppt[i].type == "textarea") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = dataLoadrcppt[i].value
                            }
                            if (dataLoadrcppt[i].type == "combobox2") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1]
                                    // $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = { value: res[0], text: res[1] }
                                }   

                            }
                            if (dataLoadrcppt[i].type == "combobox") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    // $scope.item.rcpptcbo[dataLoadrcppt[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1]   
                                    // $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = { value: res[0], text: res[1] }
                                }  
                            }
                    
                            if (dataLoadrcppt[i].type == "combobox3") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    // $scope.item.rcpptcbo[dataLoadrcppt[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1]
                                    // $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = { value: res[0], text: res[1] }
                                }  
                            }
                        }
                    } 
                    // iemrcppt++;
                    // if (iemrcppt < 6) loadRiwayatCPPTData(noemr, iemrcppt);  
                })
                $scope.isRouteLoading = false;
            }
            // NOTE: emrcppt = [443, 444, 445, 446, 447, 448, 94, 210222]

            function loadRiwayatCPPTDataEdit(noemr, iemrcppt, objectIds) {
                $scope.isRouteLoading = true;

                var emrfk = emrcppt[iemrcppt];
                if (emrfk == null) {
                    toastr.error('EMR form tidak dikenali');
                    $scope.isRouteLoading = false;
                    return;
                }

                // build URL + kirim banyak id lewat objectid=1,2,3
                var q = "emr/get-emr-transaksi-detail-edit?noemr=" + encodeURIComponent(noemr) +
                        "&emrfk=" + emrfk;

                if (angular.isArray(objectIds) && objectIds.length) {
                    q += "&objectid=" + objectIds.join(",");
                }

                // debug: pastikan URL benar
                console.log('GET:', q);

                medifirstService.get(q, true).then(function (res) {
                    var rows = (res.data && res.data.data) ? res.data.data : [];

                    // 1) urutkan berdasarkan waktu
                    rows.forEach(function (r) { r.__date = new Date(r.tgl); });
                    rows.sort(function (a, b) { return a.__date - b.__date; });

                    // 2) kelompokkan per snapshot (<= 90 detik dianggap satu batch)
                    var SNAP_WINDOW_MS = 90 * 1000;
                    var groups = [], curr = null;

                    for (var i = 0; i < rows.length; i++) {
                    var r = rows[i];
                    if (!curr) {
                        curr = { start: r.__date, items: [r] };
                        groups.push(curr);
                    } else {
                        var diff = r.__date - curr.start;
                        if (diff <= SNAP_WINDOW_MS) curr.items.push(r);
                        else {
                        curr = { start: r.__date, items: [r] };
                        groups.push(curr);
                        }
                    }
                    }

                    // 3) normalisasi value
                    function parseValue(row) {
                    var t = row.type;
                    if (t === 'datetime' || t === 'datetime2' || t === 'time' || t === 'date') {
                        var d = new Date(row.value);
                        return isNaN(d) ? null : d;
                    }
                    if ((t === 'combobox' || t === 'combobox2' || t === 'combobox3') &&
                        typeof row.value === 'string' && row.value.indexOf('~') >= 0) {
                        return row.value.split('~')[1]; // ambil label teks
                    }
                    return row.value;
                    }

                    // (opsional) urut isi tiap group (mis. tetap naik di dalam satu snapshot)
                    groups.forEach(function(g){
                    g.items.sort(function(a,b){ return a.__date - b.__date; });
                    });

                    // === KUNCI: balik urutan grup agar terbaru -> terlama ===
                    groups.reverse();
                    // 4) bangun snapshot: { emrdfk: value, ... }
                    $scope.item.rcpptEdits = groups.map(function (g) {
                    var snap = {};
                    g.items.forEach(function (r) {
                        snap[r.emrdfk] = parseValue(r);
                    });
                    return snap;
                    });

                    $scope.isRouteLoading = false;
                }, function () {
                    $scope.isRouteLoading = false;
                });
            }

            // tombol History di baris form: kumpulkan id2/id3 lalu panggil selectGridEdit
            $scope.openHistoryFromFormEdit = function (rowId) {
                var row = $scope.listDataCppt.find(function (r) { return r.id === rowId; });
                if (!row) return;

                var ids = [];
                row.detail.forEach(function (col) {
                    [col.id, col.id2, col.id3].forEach(function (x) { if (x) ids.push(x); });
                });

                // unik + urut
                var allData = Array.from(new Set(ids)).sort(function (a, b) { return a - b; });

                var emrfkNow = parseInt($scope.cc.emrfk, 10);
                var noemrNow = (nomorEMR && nomorEMR !== '-') ? nomorEMR : null;

                if (!emrfkNow) { toastr.warning('EMR aktif tidak dikenali'); return; }
                if (!noemrNow) { toastr.warning('Belum ada EMR tersimpan…'); return; }

                // teruskan ke flow selectGridEdit, bawa objectIds
                $scope.selectGridEdit({ emrid: emrfkNow, noemr: noemrNow, objectIds: allData });
            };

            // mapping emrfk -> index emrcppt, lalu muat data edit dgn objectIds
            $scope.selectGridEdit = function (data) {
                var emrfk = data.emrid;
                var noemr = data.noemr;
                var objectIds = data.objectIds || null;

                var iemrcppt = emrcppt.indexOf(emrfk);
                if (iemrcppt < 0) {
                    toastr.error('emrfk tidak ada di daftar emrcppt');
                    return;
                }

                loadRiwayatCPPTDataEdit(noemr, iemrcppt, objectIds);

                // tampilkan panel sesuai jenis
                if (emrfk === 94) {
                    $scope.RiwayatCPPTRJLama = true;  $scope.RiwayatCPPTRJBaru = false; $scope.RiwayatCPPTRI = false;
                } else if (emrfk === 210222) {
                    $scope.RiwayatCPPTRJBaru = true;  $scope.RiwayatCPPTRJLama = false; $scope.RiwayatCPPTRI = false;
                } else {
                    $scope.HtmlCppt = true; $scope.hiddennoemr = noemr;
                    $scope.RiwayatCPPTRI = true; $scope.RiwayatCPPTRJBaru = false; $scope.RiwayatCPPTRJLama = false;
                }

                var actions = $scope.popUpsEdit.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpsEdit.setOptions({ actions: actions });
                $scope.popUpsEdit.center().open();
            };

            $scope.Cpptnav = function (iemrcppt) {
                var noemr = $scope.hiddennoemr
                switch(iemrcppt){
                    case 0:
                        $scope.HtmlCppt = true;
                        $scope.HtmlCppt2 = false;
                        $scope.HtmlCppt3 = false;
                        $scope.HtmlCppt4 = false;
                        $scope.HtmlCppt5 = false;
                        $scope.HtmlCppt6 = false;
                        break;
                    case 1:
                        $scope.HtmlCppt = false;
                        $scope.HtmlCppt2 = true;
                        $scope.HtmlCppt3 = false;
                        $scope.HtmlCppt4 = false;
                        $scope.HtmlCppt5 = false;
                        $scope.HtmlCppt6 = false;
                        break;
                    case 2:
                        $scope.HtmlCppt = false;
                        $scope.HtmlCppt2 = false;
                        $scope.HtmlCppt3 = true;
                        $scope.HtmlCppt4 = false;
                        $scope.HtmlCppt5 = false;
                        $scope.HtmlCppt6 = false;
                        break;
                    case 3:
                        $scope.HtmlCppt = false;
                        $scope.HtmlCppt2 = false;
                        $scope.HtmlCppt3 = false;
                        $scope.HtmlCppt4 = true;
                        $scope.HtmlCppt5 = false;
                        $scope.HtmlCppt6 = false;
                        break;
                    case 4:
                        $scope.HtmlCppt = false;
                        $scope.HtmlCppt2 = false;
                        $scope.HtmlCppt3 = false;
                        $scope.HtmlCppt4 = false;
                        $scope.HtmlCppt5 = true;
                        $scope.HtmlCppt6 = false;
                        break;
                    case 5:
                        $scope.HtmlCppt = false;
                        $scope.HtmlCppt2 = false;
                        $scope.HtmlCppt3 = false;
                        $scope.HtmlCppt4 = false;
                        $scope.HtmlCppt5 = false;
                        $scope.HtmlCppt6 = true;
                        break;
                }
                loadRiwayatCPPTData(noemr, iemrcppt)
            }

            $scope.tutupcppt = function () {
                $scope.HtmlCppt = false;
                $scope.HtmlCppt2 = false;
                $scope.HtmlCppt3 = false;
                $scope.HtmlCppt4 = false;
                $scope.HtmlCppt5 = false;
                $scope.HtmlCppt6 = false;
                $scope.popUps.close();
            }
            $scope.tutupcpptedit = function () {
                $scope.HtmlCppt = false;
                $scope.HtmlCppt2 = false;
                $scope.HtmlCppt3 = false;
                $scope.HtmlCppt4 = false;
                $scope.HtmlCppt5 = false;
                $scope.HtmlCppt6 = false;
                $scope.popUpsEdit.close();
            }

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                $scope.listJenisPegawai = data;
            });

            var chekedd = false
                   
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                    $scope.item.obj[22034963] = "S : \n\nO : \n\nA : \n\nP : "

                // console.log($scope.listDataCppt);
                let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                for (let i = 0; i < $scope.listDataCppt.length; i++) {
                    for (let j = 0; j < $scope.listDataCppt[i].detail.length; j++) {
                        // console.log($scope.listDataCppt[i].detail[j].type, pegawai.jenisPegawai.jenispegawai);
                        if ($scope.listDataCppt[i].detail[j].type == "review" && pegawai.jenisPegawai.jenispegawai == "Perawat") {
                            $scope.item.obj2[$scope.listDataCppt[i].detail[j].id] = true
                            $scope.item.obj2[$scope.listDataCppt[i].detail[j].id2] = true
                            $scope.item.obj2[$scope.listDataCppt[i].detail[j].id3] = true
                            // $scope.item.obj[$scope.listDataCppt[i].detail[j].id] = "S \n o \n"

                        }
                    }
                }
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
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                        pegawaiInputDetail = dataLoad[i].pegawaifk
                        var owner = dataLoad[i].pegawaifk
                        console.log ('pegawailogin',pegawaiLogin.id)
                        console.log ('owner ',owner)
                        if (pegawaiLogin.id != owner) {
                                $scope.item.obj2[dataLoad[i].emrdfk] = true
                            } else {
                                $scope.item.obj2[dataLoad[i].emrdfk] = false
                            }
                    }

                }
                
                var lastelement = '';
                for (let l = 0; l < $scope.listDataCppt.length; l++) {
                    const element =  $scope.listDataCppt[l];
                    const value = $scope.item.obj[element.id];
                    if(value != undefined) {
                        $scope.show.obj[element.id] = true
                        $scope.showbtnadd[element.id] = false
                        $scope.showbtnremove[element.id] = false
                        lastelement = element.id
                    }
                }
                $scope.showbtnadd[lastelement] = true
            })
            // if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
            //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
            //         $scope.allDisabled =true
            //         toastr.warning('Hanya Bisa melihat data','Peringatan')
            //         return
            //     }
            // }

            $scope.addobj = function (id, nextid) {
                // $scope.item.rcppt[nextid] = "S \n o \n"
                    $scope.item.obj[nextid] = "S : \n\nO : \n\nA : \n\nP : "
                    // cacheHelper.set('buatSOAP', $scope.item.obj[nextid])
                    // $scope.item.buatdiagnosa = cacheHelper.set('buatSOAP', $scope.item.obj[nextid])
                // console.log($scope.listDataCppt);
                for (let i = 0; i < $scope.listDataCppt.length; i++) {
                    if ($scope.listDataCppt[i].id == nextid){
                        for (let j = 0; j < $scope.listDataCppt[i].detail.length; j++) {
                            if ($scope.listDataCppt[i].detail[j].type == 'tgl/jam') {
                                $scope.item.obj[$scope.listDataCppt[i].detail[j].id] = undefined
                                $scope.item.obj[$scope.listDataCppt[i].detail[j].id] = new Date()
                            }
                        }
                    }
                    
                }
                // console.log(id, nextid);
                $scope.show.obj[nextid] = true;
                $scope.showbtnadd[nextid] = true;
                $scope.showbtnremove[nextid] = true;
                $scope.showbtnadd[id] = false;
                $scope.showbtnremove[id] = false;
            }
            $scope.removeobj = function (id, previd) {
                $scope.item.obj[id] = ""
                // console.log(id, previd);
                for (let i = 0; i < $scope.listDataCppt.length; i++) {
                    if ($scope.listDataCppt[i].id == id) {
                        for (let j = 0; j < $scope.listDataCppt[i].detail.length; j++) {
                            if ($scope.listDataCppt[i].detail[j].type == 'tgl/jam') {
                                $scope.item.obj[$scope.listDataCppt[i].detail[j].id] = undefined
                            }
                        }
                    }

                }
                $scope.show.obj[id] = false;
                $scope.showbtnadd[id] = false
                $scope.showbtnremove[id] = false;
                $scope.showbtnadd[previd] = true;
                $scope.showbtnremove[previd] = true;
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
            
            $scope.savePeriksaDokter =  function(){
                
                var kelompokUser = medifirstService.getKelompokUser()
                // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                if(kelompokUser == 'dokter' ){
                    var data ={
                    "norec_apd" : $scope.cc.norec,
                    "kelompokUser" : kelompokUser
                }
                medifirstService.postNonMessage('rawatjalan/save-periksa',data)
                .then(function (res) {

                })
                }
            }

            $scope.Save = function () {
                var kelompokUser = medifirstService.getKelompokUser()
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []

                // if(kelompokUser!= 'dokter' && kelompokUser != 'suster'  && kelompokUser != 'gizi' && kelompokUser != 'apotik' && kelompokUser != 'terapis'){
                //     toastr.error('User bukan dokter/suster/gizi/apotik/terapis');
                //     return
                // }
                // if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         return
                //     }
                // }
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] != "" && arrobj[i] != "null")
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'cppt'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave//$scope.item.obj
                }
                medifirstService.post('emr/save-emr-dinamis-cppt-rajal', jsonSave).then(function (e) {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('CPPT SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        $scope.iCare();
                    })
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    // if(kelompokUser == 'dokter') {
                        let params = $scope.cc.noregistrasi
                        if ($scope.cc.noreservasi != undefined && $scope.cc.noreservasi != '' && $scope.cc.noreservasi != 'Kios-K') {
                            params = $scope.cc.noreservasi
                        }
                        saveAntrol(5, params, $scope.cc.norec_pd)
                    // }
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'CPPT Rawat Jalan' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    $scope.savePeriksaDokter()
                    $rootScope.loadRiwayat()

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    nomorEMR = e.data.data.noemr
                    FormLoad()
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            // Isian SOAP otomasi terisi tgl/jam, ppa, nama
            $scope.$watch('item.obj[22034963]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034963] !=null && $scope.item.obj[22034964]==undefined){
                        $scope.item.obj[22034961] =new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034962] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034964] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }

                }
            })
            // $scope.$on('diagnosis', function (event, newData) {
            //     // $scope.sharedData = newData;
            //     var data = $scope.item.obj[22034963]; // data yang ingin dipecahkan
            //     // var dataArray = data.split("\n");
            //     var s = data.match(/S : (.*?)\n/)[1]
            //     var o = data.match(/O : (.*?)\n/)[1]
            //     var a = data.match(/A : (.*?)\n/)[1]
            //     // var p = data.match(/P : (.*?)''/)[1]
            //     console.log(a);
            //     var aa = '',bb = '' 
            //         var cc = []
            //     for (var i = newData.length - 1; i >= 0; i--) {
            //         cc.push(newData[i].kddiagnosa)
            //         // bb = "," + cc
            //     }
            //     aa = cc.join(', ')
            //     a = aa
            //     $scope.item.obj[22034963] = "S : " + s + "\n\n" + "O : " + o + "\n\n" + "A : " + a + "\n\n" + "P : "
            // });
            $scope.$watch('item.obj[22034971]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034971] !=null && $scope.item.obj[22034972]==undefined){
                        $scope.item.obj[22034969] =new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034970] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034972] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034979]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034979] !=null && $scope.item.obj[22034980]==undefined){
                        $scope.item.obj[22034977] =new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034978] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034980] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034987]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034987] !=null && $scope.item.obj[22034988]==undefined){
                        $scope.item.obj[22034985] =new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034986] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034988] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034995]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034995] !=null && $scope.item.obj[22034996]==undefined){
                        $scope.item.obj[22034993] =new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034994] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034996] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22035003]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22035003] !=null && $scope.item.obj[22035004]==undefined){
                        $scope.item.obj[22035001] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22035002] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22035004] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            // End Isian SOAP otomasi terisi tgl/jam, ppa, nama

            // Isian Review otomasi terisi tgl/jam, nama
            $scope.$watch('item.obj[22034966]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034966] !=null && $scope.item.obj[22034967]==undefined){
                        $scope.item.obj[22034967] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034968] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034974]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034974] !=null && $scope.item.obj[22034975]==undefined){
                        $scope.item.obj[22034975] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034976] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034982]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034982] !=null && $scope.item.obj[22034983]==undefined){
                        $scope.item.obj[22034983] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034984] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034990]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034990] !=null && $scope.item.obj[22034991]==undefined){
                        $scope.item.obj[22034991] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034992] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034998]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034998] !=null && $scope.item.obj[22034999]==undefined){
                        $scope.item.obj[22034999] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22035000] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22035006]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22035006] !=null && $scope.item.obj[22035007]==undefined){
                        $scope.item.obj[22035007] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22035008] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            }) 
            $scope.norecSaveTTE = ''
            $scope.ttdElek = function (e) {
                var norecEMR = e.norec
                $scope.norecSaveTTE = e.norec
                $scope.emridSaveTTE = e.emrid
                if (norecEMR == '') {
                    toastr.error('Dokumen belum pernah di isi')
                    return
                }

                $scope.item.pegawai = {
                    text: medifirstService.getPegawaiLogin().namaLengkap,
                    value: medifirstService.getPegawaiLogin().id
                }
                $scope.winDialog.center().open()
                // })
            }
            $scope.savePengajuanTTE = function (pegawai) {
                if (pegawai == undefined) {
                    toastr.error('Pegawai penanda tangan tidak boleh kosong')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                $scope.isRouteLoading = true
                if ($scope.emridSaveTTE == 210222) {
                    medifirstService.get('report/cetak-catatan-klinik?nocm=' + $scope.cc.nocm +
                        '&norec_apd=' + $scope.cc.norec +
                        '&emr=' + $scope.norecSaveTTE +
                        '&emrfk=' + $scope.emridSaveTTE +
                        '&kdprofile=' + local.id +
                        '&nama=' + nama +
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
            $scope.eResep = function(){
                $scope.isRouteLoading = true
                medifirstService.get("emr/get-data-cppt-rajal?norec_apd=" + $scope.norecAPD).then(function (data) {                 
                    var datas = data.data;    
                    if (datas.dataresep == "" ) {
                        $scope.item.Resep = "Belum buat Resep pada menu Resep Elektronik";
                    }
                    if (datas.dataresep != undefined) {
                        var resep = datas.dataresep.replace(/~/g, "\n");
                        $scope.item.Resep = resep;
                    }
                    $scope.isRouteLoading = false
                    $scope.winResep.center().open()

                })
                // medifirstService.get("emr/get-daftar-detail-order?noreg=" + $scope.cc.noregistrasi, true).then(function (e) {
                // });

            }
            $scope.selectGridsssssss = function (data) {
                // const element = document.getElementById('myButton');
                const textToCopy = data;

                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                toastr.success('Sudah dicopy')
                $scope.winResep.close()

            }
            // End Isian Review otomasi terisi tgl/jam, nama

            function saveAntrol(taskid, param, norec_pd) {
                var data = {
                   "url": "antrean/updatewaktu",
                   "jenis": "antrean",
                   "method": "POST",
                   "data":                                                 
                   {
                      "kodebooking": param,
                      "taskid": taskid, //Waktu layan poli
                      "waktu": new Date().getTime()  
                   }
               }
                saveMonitoringTaksId(norec_pd, taskid, new Date().getTime(), false)
                medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        saveMonitoringTaksId(norec_pd, taskid, new Date().getTime(), true)
                    } else {
                        repeatSendTaskId(norec_pd, taskid)
                    }
                })
            }
            function saveMonitoringTaksId(noregistrasifk, taskid, waktu, statuskirim) {
                var json = {
                    "noregistrasifk": noregistrasifk,
                    "taskid": taskid,
                    "waktu": waktu,
                    "statuskirim": statuskirim
                }
                medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(function (e) {})
            }
            function repeatSendTaskId(norec_pd, taskid) {
                medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(function (e) {
                    if (e.data.nohp == null) {
                        e.data.nohp = "000000000000"
                    } else {
                        e.data.nohp = e.data.nohp.trim()
                    }
                    var data = {
                        "url": "antrean/add",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": e.data
                    }
                    medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
                        // simpan log
                        medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
                            e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
                            JSON.stringify(data) + ' | ' + JSON.stringify(x.data))

                        // mengabil data catatan task id dari 1 - 4
                        medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
                            updateWaktuId(res, e.data.kodebooking, norec_pd)
                        })
                    })
                })
            }
            async function updateWaktuId(res, kodebooking, norec_pd) {
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    var data = {
                        "url": "antrean/updatewaktu",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": {
                            "kodebooking": kodebooking,
                            "taskid": element.taskid,
                            "waktu": parseInt(element.waktu)
                        }
                    }
                    await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                        if (e.data.metaData.code == 200) {
                            await saveMonitoringTaksId(norec_pd, element.taskid, parseInt(element.waktu), true);
                        }
                    })
                }
            }
            $scope.iCare = function () {
                if ($scope.header.nobpjs == undefined) {
                    toastr.warning("Pasien tidak tidak memiliki No. BPJS", "Peringatan")
                    return
                }
                if ($scope.header.nosep == undefined) {
                    toastr.warning("Pasien tidak tidak memiliki SEP", "Peringatan")
                    return
                }
                $scope.isRouteLoading = false;
                var json = {
                    "url": `SEP/${$scope.header.nosep}`,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code === "200") {
                        $scope.dataSep = e.data.response;
                        $scope.item.dpjpSurkon = $scope.dataSep.dpjp.nmDPJP;
                        $scope.item.kodedpjpSurkon = $scope.dataSep.dpjp.kdDPJP;
                    } else {
                        window.messageContainer.error("Sep tidak ditemukan !");
                        return
                    }

                    var dpjpLayan = $scope.item.kodedpjpSurkon
                    let Send = {
                        "url": "api/rs/validate",
                        "method": "POST",
                        "jenis": "i-care",
                        "data": {
                            "param": $scope.header.nobpjs,
                            "kodedokter": dpjpLayan ? parseInt(dpjpLayan) : null
                        }
                    }
                    // medifirstService.postNonMessage("bridging/bpjs/tools", Send).then(function (e) {
                    //     if (e.data.metaData.code == "200") {
                    //         window.open(e.data.response.url, "_blank")
                    //     } else {
                    //         window.messageContainer.error(e.data.metaData.message);
                    //     }
                    // })
                })
            }

            $scope.riwayatPengkajian = function () {
                $scope.loadRiwayatEMR();
            }

            $scope.dataSourceRiwayatEMR = new kendo.data.DataSource({
                data: [],
                pageSize: 10,
                serverPaging: false
            });

            $scope.loadRiwayatEMR = function () {
                var nocm = $scope.cc.nocm || '';
                var url = 'emr/get-emr-transaksi-detail-form-new?nocm=' + encodeURIComponent(nocm) + '&jenisEmr=asesmen';

                medifirstService.get(url, true).then(function (e) {
                    var res = e.data ? e.data : e;                    
                    if (res.mappingCetak) {
                        $scope.dbReportMappingStr = res.mappingCetak;
                    }
                    
                    var flattenedData = [];
                    
                    var rawData = [];
                    if (res && Array.isArray(res.data)) {
                        rawData = res.data;
                    }
                    // data mentah
                    rawData.forEach(function (parent) {
                        if (parent.details && Array.isArray(parent.details)) {
                            parent.details.forEach(function (detail) {
                                flattenedData.push({
                                    tglregistrasi: parent.tglregistrasi,
                                    noregistrasi: parent.noregistrasi,
                                    caption: detail.namaform,
                                    norec_emr: parent.norec,
                                    emrfk: detail.emrfk,
                                    norec_apd: parent.norec_apd,
                                    urlform: detail.reportdisplay,
                                    nocm: parent.nocm,
                                    norec_pd: parent.norec_pd
                                });
                            });
                        }
                    });

                    // Tambahkan nomor urut
                    for (var i = 0; i < flattenedData.length; i++) {
                        flattenedData[i].no = i + 1;
                    }

                    $scope.dataSourceRiwayatEMR.data(flattenedData);
                    $scope.popupRiwayatEMR.center().open();
                }, function () {
                    toastr.error('Gagal memuat riwayat EMR');
                });
            }

            $scope.columnRiwayatEMR = [
                { 
                    "title": "No", 
                    "width": "50px",
                    "template": "<span class='style-center'>#: (data.no) ? data.no : '' #</span>"
                },
                { "field": "tglregistrasi", "title": "Tgl Registrasi", "width": "130px",
                  "template": "#= kendo.toString(new Date(tglregistrasi), 'dd-MM-yyyy HH:mm') #" },
                { "field": "noregistrasi", "title": "No Registrasi", "width": "120px" },
                { "field": "caption", "title": "Nama Formulir", "width": "250px" }
                //{ "field": "verifikator", "title": "Verifikator", "width": "150px" }
            ];

            $scope.detailEMR = function (data) {
                if (!data) {
                    toastr.error('Pilih data terlebih dahulu');
                    return;
                }
                var reportMapping = {};
                // gabungkan mapping emr dari setting data fixed
                if ($scope.dbReportMappingStr) {
                    try {
                        // Format JSON: {"443":{"url":"abc","isBackend":true}}
                        var fromDb = JSON.parse($scope.dbReportMappingStr);
                        for (var key in fromDb) { reportMapping[key] = fromDb[key]; }
                    } catch (err) {
                        // format string: ID:URL:isBackend,ID:URL... (isBackend 1=true, 0=false)
                        var pairs = $scope.dbReportMappingStr.split(',');
                        pairs.forEach(function(pair) {
                            var parts = pair.split(':');
                            if (parts.length >= 2) {
                                reportMapping[parts[0].trim()] = {
                                    url: parts[1].trim(),
                                    isBackend: parts[2] ? (parts[2].trim() == '1' || parts[2].trim() == 'true') : true
                                };
                            }
                        });
                    }
                }

                var local = JSON.parse(localStorage.getItem('profile'));
                var loginPegawai = medifirstService.getPegawaiLogin();
                var nama = loginPegawai ? loginPegawai.namaLengkap : 'Admin';
                var kdProfile = (local && local.id) ? local.id : 30;
                
                var url = "";
                var baseUrlApp = window.location.href.split('#')[0];
                // ambil mapping data
                var configEMR = data.emrfk ? reportMapping[data.emrfk.toString()] : null;
                var finalUrlForm = configEMR ? configEMR.url : data.urlform;

                // console.log('DetailEMR Clicked:', {
                //     emrfk: data.emrfk,
                //     caption: data.caption,
                //     configFound: configEMR,
                //     finalUrlForm: finalUrlForm
                // });

                if (!finalUrlForm && data.caption && data.caption.indexOf('CPPT') > -1) {
                    finalUrlForm = 'get-cetak-cmrm05';
                }

                var isReportBackend = (configEMR && configEMR.isBackend) || (finalUrlForm && (
                    finalUrlForm.indexOf('cetak') > -1 || 
                    finalUrlForm.indexOf('get-cetak') > -1
                ));

                // ekseskusi sesuai jenis
                if (isReportBackend && finalUrlForm) {
                    var reportPath = finalUrlForm;
                    if (reportPath.indexOf('report/') === 0) {
                        reportPath = reportPath.replace('report/', '');
                    }
                    if (reportPath.indexOf('/') === 0) {
                        reportPath = reportPath.substring(1);
                    }
                    
                    var queryParams = {
                        nocm: data.nocm ? data.nocm.trim() : '',
                        norec_apd: (data.norec_apd || data.noregistrasi || '').trim(),
                        emr: data.norec_emr ? data.norec_emr.trim() : '',
                        emrfk: data.emrfk || '',
                        kdprofile: kdProfile,
                        nama: encodeURIComponent(nama ? nama.trim() : 'Admin'),
                        noregistrasi: data.noregistrasi ? data.noregistrasi.trim() : '',
                        norec_pd: data.norec_pd ? data.norec_pd.trim() : ''
                    };

                    var queryString = Object.keys(queryParams).map(function(key) {
                        return key + '=' + queryParams[key];
                    }).join('&');

                    url = config.baseApiBackend + 'report/' + reportPath + '?' + queryString + '#toolbar=0&navpanes=0';
                    
                    console.info('Opening Backend Print Popup:', url);
                    $scope.isIframeLoading = true;
                    $scope.titleCetak = 'Cetak ' + (data.caption || 'Dokumen EMR');
                    
                    $timeout(function() {
                        if ($scope.popUpsCetak) {
                            $scope.popUpsCetak.title($scope.titleCetak);
                            $scope.popUpsCetak.center().open();
                            
                            $scope.cetakanUrl = $sce.trustAsResourceUrl("about:blank");
                            $timeout(function() {
                                $scope.cetakanUrl = $sce.trustAsResourceUrl(url);
                            }, 500);
                        }
                    });

                } else if (finalUrlForm && finalUrlForm != "") {
                    url = baseUrlApp + "#/" + finalUrlForm +
                        "?noCM=" + (data.nocm || '') +
                        "&norecSatu=" + (data.norec_apd || '') +
                        "&norec_emr=" + (data.norec_emr || '') +
                        "&emrfk=" + (data.emrfk || '');
                    
                    console.info('Redirecting to Frontend State:', url);
                    window.open(url, '_blank');

                } else {
                    //cetakan belum di mapping
                    toastr.warning('Cetak EMR ini belum tersedia karena belum ada template cetakan yang dikonfigurasi.');
                }
            }
            
            function showPRMRJDialog() {
                        $mdDialog
                        .show({
                            templateUrl: "../app/module/EMR/PRMRJDialog.html",
                            controller: "PRMRJCtrl",
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            locals: {
                            isPopupPRMRJ: true
                            },
                        })
                        .finally(function () {
                            // dialog closed
                        });
                }

            $scope.openPRMRJ = function () {
                    // Tampilkan indikator loading
                    var loadingToast = document.createElement('div');
                    loadingToast.id = 'integrasi-loading-toast';
                    loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Form Integrasi Asuhan...';
                    loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
                    document.body.appendChild(loadingToast);

                    function removeToast() {
                    var t = document.getElementById('integrasi-loading-toast');
                    if (t) t.parentNode.removeChild(t);
                    }

                    // Sync cache nomorEMR agar PRMRJCtrl membaca EMR yang sedang aktif
                    // sehingga data tersimpan terhubung ke EMR yang sama (bukan norec_emr: "-")
                    if (nomorEMR && nomorEMR !== '-') {
                    var arrStr = cacheHelper.get('cacheNomorEMR') || {};
                    arrStr[0] = nomorEMR;
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    }

                    // Collect active CPPT SOAP data
                    var cpptSoapData = [];
                    var cpptRows = [
                        { soapId: 22034963, dateId: 22034961, ppaId: 22034964 },
                        { soapId: 22034971, dateId: 22034969, ppaId: 22034972 },
                        { soapId: 22034979, dateId: 22034977, ppaId: 22034980 },
                        { soapId: 22034987, dateId: 22034985, ppaId: 22034988 },
                        { soapId: 22034995, dateId: 22034993, ppaId: 22034996 },
                        { soapId: 22035003, dateId: 22035001, ppaId: 22035004 }
                    ];
                    
                    cpptRows.forEach(function(row) {
                        var soapText = $scope.item.obj[row.soapId];
                        if (soapText && soapText.replace(/\s/g, "") !== "" && soapText.replace(/\s/g, "") !== "S::O::A::P:") {
                            var dateVal = $scope.item.obj[row.dateId];
                            var ppaVal = $scope.item.obj[row.ppaId];
                            cpptSoapData.push({
                                soapText: soapText,
                                date: dateVal,
                                ppa: ppaVal
                            });
                        }
                    });
                    
                    if (cpptSoapData.length > 0) {
                        cacheHelper.set('cpptSoapData', cpptSoapData);
                    } else {
                        cacheHelper.set('cpptSoapData', undefined);
                    }

                    require(
                    ["app/module/EMR/PRMRJCtrl"],
                    function () {
                        // Wajib inject ke Angular runtime terlebih dahulu (sama seperti routing.js)
                        $ocLazyLoad.inject('myApp').then(function () {
                        removeToast();
                        showPRMRJDialog();
                        }, function() {
                        removeToast();
                        showPRMRJDialog();
                        });
                    },
                    function (err) {
                        removeToast();
                        var confirm = $mdDialog
                        .confirm()
                        .title("Informasi")
                        .textContent("Gagal memuat Form Integrasi Asuhan. Silakan muat ulang halaman.")
                        .ariaLabel("Informasi")
                        .ok("OK");
                        $mdDialog.show(confirm);
                    }
                    );
                };

                $scope.openRujukanEdukasi = function () {
                    var nocm = $scope.cc.nocm || '';
                    var noregistrasi = $scope.cc.noregistrasi || '';

                    // Robust fallback jika cc belum terisi di scope induk
                    if (!nocm || !noregistrasi) {
                        var cacheRM = cacheHelper.get('cacheRekamMedis');
                        if (cacheRM) {
                            if (!nocm) nocm = cacheRM[0] || '';
                            if (!noregistrasi) noregistrasi = cacheRM[3] || '';
                        }
                    }

                    console.log('openRujukanEdukasi - nocm:', nocm, 'noregistrasi:', noregistrasi);

                    $scope.isRouteLoading = true;
                    var url = 'emr/get-emr-transaksi-detail-form-new?nocm=' + encodeURIComponent(nocm) + '&jenisEmr=asesmen';

                    var p1 = medifirstService.get(url, true);
                    var p2 = medifirstService.get("sysadmin/settingdatafixed/get/FormRujukanEdukasiConfig").then(function (res) {
                        return res;
                    }, function () {
                        return null;
                    });

                    $q.all([p1, p2]).then(function (results) {
                        $scope.isRouteLoading = false;
                        var res = results[0].data ? results[0].data : results[0];
                        var rawData = (res && Array.isArray(res.data)) ? res.data : [];
                        console.log('openRujukanEdukasi - rawData:', rawData);

                        var resConfig = results[1];
                        var formsConfig = null;
                        if (resConfig && resConfig.data) {
                            try {
                                var val = typeof resConfig.data === 'string' ? resConfig.data : (resConfig.data.value || resConfig.data);
                                if (typeof val === 'string' && val.trim() !== '') {
                                    formsConfig = JSON.parse(val);
                                } else if (Array.isArray(val)) {
                                    formsConfig = val;
                                }
                            } catch (e) {
                                console.error('Error parsing FormRujukanEdukasiConfig:', e);
                            }
                        }

                        if (!formsConfig || !Array.isArray(formsConfig) || formsConfig.length === 0) {
                            toastr.warning('Formulir Rujukan Edukasi belum dikonfigurasi di data fixed!');
                            return;
                        }

                        formsConfig.forEach(function (form) {
                            form.status = false;
                            form.noemr = '-';
                            form.norec = undefined;
                            form.tglemr = undefined;

                            for (var i = 0; i < rawData.length; i++) {
                                var parent = rawData[i];
                                
                                // Cocokkan registrasi dengan membandingkan properti alternatif (misal: noregistrasi, noregistrasifk)
                                var parentNoReg = parent.noregistrasi || parent.noregistrasifk || parent.noregistrasi_fk;
                                if (parentNoReg && noregistrasi) {
                                    if (String(parentNoReg).trim() != String(noregistrasi).trim()) {
                                        continue;
                                    }
                                }

                                // 1. Cocokkan emrfk langsung di level parent
                                if (parent.emrfk && parseInt(parent.emrfk) === form.id) {
                                    form.status = true;
                                    form.noemr = parent.noemr || parent.norec || '-';
                                    form.norec = parent.norec;
                                    form.tglemr = parent.tglemr;
                                }
                                // 2. Jika tidak cocok di parent, cek di details (fallback)
                                else if (parent.details && Array.isArray(parent.details)) {
                                    for (var j = 0; j < parent.details.length; j++) {
                                        if (parseInt(parent.details[j].emrfk) === form.id) {
                                            form.status = true;
                                            form.noemr = parent.noemr || parent.norec || '-';
                                            form.norec = parent.norec;
                                            form.tglemr = parent.tglemr;
                                            break;
                                        }
                                    }
                                }
                                if (form.status) break;
                            }
                        });
                        console.log('openRujukanEdukasi - formsConfig mapped:', formsConfig);

                        $mdDialog.show({
                            templateUrl: "../app/module/EMR/FormRujukanEdukasiListDialog.html",
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            controller: ['$scope', '$mdDialog', 'rujukansData', function ($scopeDialog, $mdDialog, rujukansData) {
                                $scopeDialog.rujukanEdukasiForms = rujukansData;
                                $scopeDialog.tutupDialog = function () {
                                    $mdDialog.hide();
                                };
                                $scopeDialog.isiForm = function (form) {
                                    $mdDialog.hide(form);
                                };
                            }],
                            locals: {
                                rujukansData: formsConfig
                            }
                        }).then(function (selectedForm) {
                            if (selectedForm) {
                                openRujukanEdukasiFormPopup(selectedForm);
                            }
                        });

                    }, function () {
                        $scope.isRouteLoading = false;
                        toastr.error('Gagal memuat data Rujukan Edukasi');
                    });
                };

                function openRujukanEdukasiFormPopup(form) {
                    var arrStr = { 0: form.noemr, 1: form.norec };
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    cacheHelper.set('cacheNOREC_EMR', arrStr);

                    // Tampilkan indikator loading
                    var loadingToast = document.createElement('div');
                    loadingToast.id = 'rujukan-loading-toast';
                    loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Form...';
                    loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
                    document.body.appendChild(loadingToast);

                    function removeToast() {
                        var t = document.getElementById('rujukan-loading-toast');
                        if (t) t.parentNode.removeChild(t);
                    }

                    require([form.controller], function () {
                        $ocLazyLoad.inject('myApp').then(function () {
                            removeToast();
                            showActualEmrDialog();
                        }, function () {
                            removeToast();
                            showActualEmrDialog();
                        });
                    }, function (err) {
                        removeToast();
                        console.error(err);
                        toastr.error('Gagal memuat file controller: ' + form.controller);
                    });

                    function showActualEmrDialog() {
                        var dialogScope = $rootScope.$new();
                        dialogScope.item = { obj: [], obj2: [] };
                        dialogScope.cc = {};
                        dialogScope.templateUrl = '../app/module/EMR/' + form.template;
                        dialogScope.formTitle = form.title;

                        $mdDialog.show({
                            templateUrl: '../app/module/EMR/FormRujukanEdukasiDialog.html',
                            controller: form.controller,
                            scope: dialogScope,
                            preserveScope: true,
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            fullscreen: true
                        }).finally(function () {
                            // Re-open list dialog
                            $scope.openRujukanEdukasi();
                        });
                    }
                }

                $scope.openPengkajian = function () {
                    var nocm = $scope.cc.nocm || '';
                    var noregistrasi = $scope.cc.noregistrasi || '';

                    // Robust fallback jika cc belum terisi di scope induk
                    if (!nocm || !noregistrasi) {
                        var cacheRM = cacheHelper.get('cacheRekamMedis');
                        if (cacheRM) {
                            if (!nocm) nocm = cacheRM[0] || '';
                            if (!noregistrasi) noregistrasi = cacheRM[3] || '';
                        }
                    }

                    console.log('openPengkajian - nocm:', nocm, 'noregistrasi:', noregistrasi);

                    $scope.isRouteLoading = true;
                    var url = 'emr/get-emr-transaksi-detail-form-new?nocm=' + encodeURIComponent(nocm) + '&jenisEmr=asesmen';

                    var p1 = medifirstService.get(url, true);
                    var p2 = medifirstService.get("sysadmin/settingdatafixed/get/FormulirPengkajianConfig").then(function (res) {
                        return res;
                    }, function () {
                        return null;
                    });

                    $q.all([p1, p2]).then(function (results) {
                        $scope.isRouteLoading = false;
                        var res = results[0].data ? results[0].data : results[0];
                        var rawData = (res && Array.isArray(res.data)) ? res.data : [];
                        console.log('openPengkajian - rawData:', rawData);

                        var resConfig = results[1];
                        var formsConfig = null;
                        if (resConfig && resConfig.data) {
                            try {
                                var val = typeof resConfig.data === 'string' ? resConfig.data : (resConfig.data.value || resConfig.data);
                                if (typeof val === 'string' && val.trim() !== '') {
                                    formsConfig = JSON.parse(val);
                                } else if (Array.isArray(val)) {
                                    formsConfig = val;
                                }
                            } catch (e) {
                                console.error('Error parsing FormulirPengkajianConfig:', e);
                            }
                        }

                        if (!formsConfig || !Array.isArray(formsConfig) || formsConfig.length === 0) {
                            toastr.warning('Formulir Pengkajian belum dikonfigurasi di data fixed!');
                            return;
                        }

                        formsConfig.forEach(function (form) {
                            form.status = false;
                            form.noemr = '-';
                            form.norec = undefined;
                            form.tglemr = undefined;

                            for (var i = 0; i < rawData.length; i++) {
                                var parent = rawData[i];
                                
                                // Cocokkan registrasi dengan membandingkan properti alternatif (misal: noregistrasi, noregistrasifk)
                                var parentNoReg = parent.noregistrasi || parent.noregistrasifk || parent.noregistrasi_fk;
                                if (parentNoReg && noregistrasi) {
                                    if (String(parentNoReg).trim() != String(noregistrasi).trim()) {
                                        continue;
                                    }
                                }

                                // 1. Cocokkan emrfk langsung di level parent
                                if (parent.emrfk && parseInt(parent.emrfk) === form.id) {
                                    form.status = true;
                                    form.noemr = parent.noemr || parent.norec || '-';
                                    form.norec = parent.norec;
                                    form.tglemr = parent.tglemr;
                                }
                                // 2. Jika tidak cocok di parent, cek di details (fallback)
                                else if (parent.details && Array.isArray(parent.details)) {
                                    for (var j = 0; j < parent.details.length; j++) {
                                        if (parseInt(parent.details[j].emrfk) === form.id) {
                                            form.status = true;
                                            form.noemr = parent.noemr || parent.norec || '-';
                                            form.norec = parent.norec;
                                            form.tglemr = parent.tglemr;
                                            break;
                                        }
                                    }
                                }
                                if (form.status) break;
                            }
                        });
                        console.log('openPengkajian - formsConfig mapped:', formsConfig);

                        $mdDialog.show({
                            templateUrl: "../app/module/EMR/FormPengkajianListDialog.html",
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            controller: ['$scope', '$mdDialog', 'pengkajiansData', function ($scopeDialog, $mdDialog, pengkajiansData) {
                                $scopeDialog.pengkajianForms = pengkajiansData;
                                $scopeDialog.tutupDialog = function () {
                                    $mdDialog.hide();
                                };
                                $scopeDialog.isiForm = function (form) {
                                    $mdDialog.hide(form);
                                };
                            }],
                            locals: {
                                pengkajiansData: formsConfig
                            }
                        }).then(function (selectedForm) {
                            if (selectedForm) {
                                openPengkajianFormPopup(selectedForm);
                            }
                        });

                    }, function () {
                        $scope.isRouteLoading = false;
                        toastr.error('Gagal memuat data Pengkajian');
                    });
                };

                function openPengkajianFormPopup(form) {
                    var arrStr = { 0: form.noemr, 1: form.norec };
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    cacheHelper.set('cacheNOREC_EMR', arrStr);

                    // Tampilkan indikator loading
                    var loadingToast = document.createElement('div');
                    loadingToast.id = 'pengkajian-loading-toast';
                    loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Form...';
                    loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
                    document.body.appendChild(loadingToast);

                    function removeToast() {
                        var t = document.getElementById('pengkajian-loading-toast');
                        if (t) t.parentNode.removeChild(t);
                    }



                    require([form.controller], function () {
                        $ocLazyLoad.inject('myApp').then(function () {
                            removeToast();
                            showActualPengkajianEmrDialog();
                        }, function () {
                            removeToast();
                            showActualPengkajianEmrDialog();
                        });
                    }, function (err) {
                        removeToast();
                        console.error(err);
                        toastr.error('Gagal memuat file controller: ' + form.controller);
                    });

                    function showActualPengkajianEmrDialog() {
                        var dialogScope = $rootScope.$new();
                        dialogScope.item = { obj: [], obj2: [] };
                        dialogScope.cc = {};
                        dialogScope.templateUrl = '../app/module/EMR/' + form.template;
                        dialogScope.formTitle = form.title;
                        Object.defineProperty(dialogScope, 'kembali', {
                            configurable: true,
                            enumerable: true,
                            get: function () {
                                return function () {
                                    $mdDialog.hide();
                                };
                            },
                            set: function (val) {
                            }
                        });

                        $mdDialog.show({
                            templateUrl: '../app/module/EMR/FormPengkajianDialog.html',
                            controller: form.controller,
                            scope: dialogScope,
                            preserveScope: true,
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            fullscreen: true,
                            locals: {
                                isPopupPRMRJ: (form.id === 210051)
                            }
                        }).finally(function () {
                            // Re-open list dialog
                            $scope.openPengkajian();
                        });
                    }
                }

                $scope.tutupDialog = function() {
                    $mdDialog.hide();
                }

            //batas
        }

        
        
    ]);
});