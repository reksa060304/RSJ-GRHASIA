define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseUrlData;
    initialize.controller('SbarDetailCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService','$mdDialog', '$q', '$sce', '$timeout', "$ocLazyLoad",
        function ($rootScope, $scope, $state, cacheHelper, medifirstService, $mdDialog, $q, $sce, $timeout, $ocLazyLoad) {

            $scope.item = {};
            $scope.cc = {};
            $scope.show = {};
            $scope.isIframeLoading = false;
            var namaEMR = ''
            var nomorEMR = '-'
            var norecEMR = ''
            $scope.cc.emrfk = $state.params.namaEMR ? parseInt($state.params.namaEMR, 10) : 435;
            $scope.tombolSimpanVis = true;
            $scope.RiwayatSbarBaru = false;
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
            $scope.item.obj = [];
            $scope.item.obj2 = [];
            $scope.show.obj = [];

            $scope.showbtnadd = [];
            $scope.showbtnremove = [];
            $scope.show.obj[22034963] = true
            $scope.showbtnadd[22034963] = true
            $scope.showbtnremove[22034963] = false

            $scope.listDataSbar = [
                {
                    "id": 22034963, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034961, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034962, "nama": "ppa", "type": "ppa" },
                        { "id": 22034963, "id2": 22034964, "nama": "soap", "type": "soap" },
                        { "id": 22034966, "id2": 22034967, "id3": 22034968, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034971, "nama": "Baris dua",
                    "detail": [
                        { "id": 22034969, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034970, "nama": "ppa", "type": "ppa" },
                        { "id": 22034971, "id2": 22034972, "nama": "soap", "type": "soap" },
                        { "id": 22034974, "id2": 22034975, "id3": 22034976, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034979, "nama": "Baris tiga",
                    "detail": [
                        { "id": 22034977, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034978, "nama": "ppa", "type": "ppa" },
                        { "id": 22034979, "id2": 22034980, "nama": "soap", "type": "soap" },
                        { "id": 22034982, "id2": 22034983, "id3": 22034984, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034987, "nama": "Baris empat",
                    "detail": [
                        { "id": 22034985, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034986, "nama": "ppa", "type": "ppa" },
                        { "id": 22034987, "id2": 22034988, "nama": "soap", "type": "soap" },
                        { "id": 22034990, "id2": 22034991, "id3": 22034992, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034995, "nama": "Baris lima",
                    "detail": [
                        { "id": 22034993, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034994, "nama": "ppa", "type": "ppa" },
                        { "id": 22034995, "id2": 22034996, "nama": "soap", "type": "soap" },
                        { "id": 22034998, "id2": 22034999, "id3": 22035000, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22035003, "nama": "Baris enam",
                    "detail": [
                        { "id": 22035001, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22035002, "nama": "ppa", "type": "ppa" },
                        { "id": 22035003, "id2": 22035004, "nama": "soap", "type": "soap" },
                        { "id": 22035006, "id2": 22035007, "id3": 22035008, "nama": "review", "type": "review" },
                    ]
                }
            ];
            
            function LoadCache() {
                var chacePeriode = cacheHelper.get('cacheNomorEMR');
                var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
                if (cacheNoREC != undefined) {
                    norecEMR = cacheNoREC[1] || (chacePeriode ? chacePeriode[1] : undefined);
                }
                if (chacePeriode != undefined) {
                    nomorEMR = chacePeriode[0]
                    $scope.cc.norec_emr = nomorEMR
                    $scope.cc.tanggalEmrl = chacePeriode[2]
                    if (chacePeriode[1] && chacePeriode[1] != '-') {
                        norecEMR = chacePeriode[1];
                        $scope.currentNorecEMR = chacePeriode[1];
                    }
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
                    $scope.norecAPD = chacePeriode[7]
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
            }

            function loadRiwayat(params) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-emr-transaksi?nocm=" + params + "&jenisEmr=sbar", true).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.dataGridRiwayatSbar = new kendo.data.DataSource({
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

            $scope.columnGridRiwayatSbar = {
                selectable: 'row',
                pageable: true,
                columns:[
                    {
                        "field": "noemr",
                        "title": "#",
                        "width": "90px",
                        "template": "<em class=\"k-button k-button-icon k-secondary\" style=\"margin: 2px 3px; padding: 4px 7px; display: inline-block;\" ng-click=\"selectGrid(dataItem)\" title=\"History\"> <span class=\"k-sprite fa fa-history\"></span></em>" +
                                    "<em class=\"k-button k-button-icon k-primary\" style=\"margin: 2px 3px; padding: 4px 7px; display: inline-block;\" ng-click=\"cetakGrid(dataItem)\" title=\"Cetak\"> <span class=\"k-sprite fa fa-print\"></span></em>",
                        attributes: {
                            style: "text-align: center;"
                        } 
                    },
                    {
                        "field": "tglemr",
                        "title": "Tanggal EMR",
                        "width": "15%",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "25%",
                    },
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
                        "width": "15%",
                    }
                ]
            }

            $scope.selectGrid = function(data){
                var noemr = data.noemr
                loadRiwayatCPPTData(noemr);
                $scope.RiwayatSbarBaru = true;
                
                var actions = $scope.popUps.options.actions;
                if (actions.indexOf("Close") > -1) {
                    actions.splice(actions.indexOf("Close"), 1);
                }
                $scope.popUps.setOptions({ actions : actions });
                $scope.popUps.center().open();
            }

            $scope.cetakGrid = function (dataItem) {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local ? local.id : 30;
                var norecEMR = dataItem.norec;
                var nama = medifirstService.getPegawaiLogin().namaLengkap;
                if (!norecEMR) return;
                var norecApd = $scope.norecAPD || $scope.cc.norec || '';

                window.open(config.baseApiBackend + 'report/cetak-catatan-sbar?nocm='
                    + $scope.cc.nocm + '&norec_apd=' + norecApd + '&emr=' + norecEMR
                    + '&emrfk=' + $scope.cc.emrfk
                    + '&kdprofile=' + profile
                    + '&nama=' + encodeURIComponent(nama), '_blank');
            }

            function loadRiwayatCPPTData(noemr)
            {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + noemr + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.rcppt = []
                    var dataLoadrcppt = dat.data.data

                    for (var i = 0; i <= dataLoadrcppt.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoadrcppt[i].emrfk) {

                            if (dataLoadrcppt[i].type == "textbox") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = dataLoadrcppt[i].value
                            }
                            if (dataLoadrcppt[i].type == "datetime") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = new Date(dataLoadrcppt[i].value)
                            }
                            if (dataLoadrcppt[i].type == "textarea") {
                                $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = dataLoadrcppt[i].value
                            }
                            if (dataLoadrcppt[i].type == "combobox") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1] ? res[1] : res[0];
                                }  
                            }
                        }
                    } 
                    $scope.isRouteLoading = false;
                })
            }

            function loadRiwayatCPPTDataEdit(noemr, objectIds) {
                $scope.isRouteLoading = true;
                var q = "emr/get-emr-transaksi-detail-edit?noemr=" + encodeURIComponent(noemr) +
                        "&emrfk=" + $scope.cc.emrfk;

                if (angular.isArray(objectIds) && objectIds.length) {
                    q += "&objectid=" + objectIds.join(",");
                }

                medifirstService.get(q, true).then(function (res) {
                    var rows = (res.data && res.data.data) ? res.data.data : [];

                    rows.forEach(function (r) { r.__date = new Date(r.tgl); });
                    rows.sort(function (a, b) { return a.__date - b.__date; });

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

                    function parseValue(row) {
                        var t = row.type;
                        if (t === 'datetime' || t === 'datetime2' || t === 'time' || t === 'date') {
                            var d = new Date(row.value);
                            return isNaN(d) ? null : d;
                        }
                        if ((t === 'combobox' || t === 'combobox2' || t === 'combobox3') &&
                            typeof row.value === 'string' && row.value.indexOf('~') >= 0) {
                            return row.value.split('~')[1];
                        }
                        return row.value;
                    }

                    groups.forEach(function(g){
                        g.items.sort(function(a,b){ return a.__date - b.__date; });
                    });

                    groups.reverse();
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

            $scope.openHistoryFromFormEdit = function (rowId) {
                var row = $scope.listDataSbar.find(function (r) { return r.id === rowId; });
                if (!row) return;

                var ids = [];
                row.detail.forEach(function (col) {
                    [col.id, col.id2, col.id3].forEach(function (x) { if (x) ids.push(x); });
                });

                var allData = Array.from(new Set(ids)).sort(function (a, b) { return a - b; });

                var emrfkNow = parseInt($scope.cc.emrfk, 10);
                var noemrNow = (nomorEMR && nomorEMR !== '-') ? nomorEMR : null;

                if (!emrfkNow) { toastr.warning('EMR aktif tidak dikenali'); return; }
                if (!noemrNow) { toastr.warning('Belum ada EMR tersimpan…'); return; }

                $scope.selectGridEdit({ emrid: emrfkNow, noemr: noemrNow, objectIds: allData });
            };

            $scope.selectGridEdit = function (data) {
                var emrfk = data.emrid;
                var noemr = data.noemr;
                var objectIds = data.objectIds || null;

                loadRiwayatCPPTDataEdit(noemr, objectIds);

                $scope.RiwayatSbarBaru = true;

                var actions = $scope.popUpsEdit.options.actions;
                if (actions.indexOf("Close") > -1) {
                    actions.splice(actions.indexOf("Close"), 1);
                }
                $scope.popUpsEdit.setOptions({ actions: actions });
                $scope.popUpsEdit.center().open();
            };

            $scope.tutupcppt = function () {
                $scope.popUps.close();
            }
            $scope.tutupcpptedit = function () {
                $scope.popUpsEdit.close();
            }

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                $scope.listJenisPegawai = data;
            });

            var chekedd = false;
                   
            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[22034963] = "S : \n\nB : \n\nA : \n\nR : "

                let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                for (let i = 0; i < $scope.listDataSbar.length; i++) {
                    for (let j = 0; j < $scope.listDataSbar[i].detail.length; j++) {
                        if ($scope.listDataSbar[i].detail[j].type == "review" && pegawai.jenisPegawai.jenispegawai == "Perawat") {
                            $scope.item.obj2[$scope.listDataSbar[i].detail[j].id] = true;
                        }
                    }
                }
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
                        }
                        
                        var owner = dataLoad[i].pegawaifk
                        if (pegawaiLogin.id != owner) {
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        } else {
                            $scope.item.obj2[dataLoad[i].emrdfk] = false
                        }
                    }
                }
                
                var lastelement = '';
                for (let l = 0; l < $scope.listDataSbar.length; l++) {
                    const element =  $scope.listDataSbar[l];
                    const value = $scope.item.obj[element.id];
                    if(value != undefined && value != "" && value != null) {
                        $scope.show.obj[element.id] = true
                        $scope.showbtnadd[element.id] = false
                        $scope.showbtnremove[element.id] = false
                        lastelement = element.id
                    }
                }
                if (lastelement != '') {
                    $scope.showbtnadd[lastelement] = true;
                }
            })

            $scope.addobj = function (id, nextid) {
                $scope.item.obj[nextid] = "S : \n\nB : \n\nA : \n\nR : "
                for (let i = 0; i < $scope.listDataSbar.length; i++) {
                    if ($scope.listDataSbar[i].id == nextid){
                        for (let j = 0; j < $scope.listDataSbar[i].detail.length; j++) {
                            if ($scope.listDataSbar[i].detail[j].type == 'tgl/jam') {
                                $scope.item.obj[$scope.listDataSbar[i].detail[j].id] = new Date()
                            }
                        }
                    }
                }
                $scope.show.obj[nextid] = true;
                $scope.showbtnadd[nextid] = true;
                $scope.showbtnremove[nextid] = true;
                $scope.showbtnadd[id] = false;
                $scope.showbtnremove[id] = false;
            }

            $scope.removeobj = function (id, previd) {
                for (let i = 0; i < $scope.listDataSbar.length; i++) {
                    if ($scope.listDataSbar[i].id == id) {
                        delete $scope.item.obj[$scope.listDataSbar[i].id];
                        for (let j = 0; j < $scope.listDataSbar[i].detail.length; j++) {
                            let d = $scope.listDataSbar[i].detail[j];
                            if (d.id) delete $scope.item.obj[d.id];
                            if (d.id2) delete $scope.item.obj[d.id2];
                            if (d.id3) delete $scope.item.obj[d.id3];
                        }
                    }
                }
                $scope.show.obj[id] = false;
                $scope.showbtnadd[id] = false;
                $scope.showbtnremove[id] = false;
                $scope.showbtnadd[previd] = true;
                $scope.showbtnremove[previd] = true;
            }

            $scope.kembali = function () {
                $rootScope.showRiwayat()
                $state.go('RekamMedis.SbarDinamis')
            }

            $scope.Save = function () {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []

                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] != "" && arrobj[i] != "null")
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'sbar'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis-cppt-rajal', jsonSave).then(function (e) {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('SBAR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                        .ariaLabel('Confirm')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        // callback if needed
                    })
                    var realNorec = e.data.norecEMR || (e.data.data ? e.data.data.norec : undefined);
                    var realNoEmr = e.data.data ? e.data.data.noemr : nomorEMR;

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', realNorec,
                        'SBAR Komunikasi Efektif' + ' dengan No EMR - ' + realNoEmr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    
                    $rootScope.loadRiwayat()

                    var arrStr = {
                        0: realNoEmr,
                        1: realNorec
                    }
                    nomorEMR = realNoEmr
                    $scope.currentNorecEMR = realNorec;
                    FormLoad()
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            $scope.cetak = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local ? local.id : 30;
                var currentEMR = $scope.currentNorecEMR;

                if ((!currentEMR || currentEMR === '-') && $scope.dataGridRiwayatSbar) {
                    var gridData = $scope.dataGridRiwayatSbar.data();
                    if (gridData && gridData.length > 0) {
                        var match = gridData.find(function (r) { return r.noemr === nomorEMR; });
                        if (match && match.norec) {
                            currentEMR = match.norec;
                        } else if (gridData[0].norec) {
                            currentEMR = gridData[0].norec;
                        }
                    }
                }

                var nama = medifirstService.getPegawaiLogin().namaLengkap;
                if (!currentEMR || currentEMR === '-') {
                    toastr.error('Simpan data terlebih dahulu sebelum dicetak');
                    return;
                }

                var norecApd = $scope.norecAPD || $scope.cc.norec || '';

                window.open(config.baseApiBackend + 'report/cetak-catatan-sbar?nocm='
                    + $scope.cc.nocm + '&norec_apd=' + norecApd + '&emr=' + currentEMR
                    + '&emrfk=' + $scope.cc.emrfk
                    + '&kdprofile=' + profile
                    + '&nama=' + encodeURIComponent(nama), '_blank');
            }

            // Watches to auto fill Date/PPA when SBAR/review are filled
            $scope.$watch('item.obj[22034963]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034963] !=null && $scope.item.obj[22034964]==undefined){
                        $scope.item.obj[22034961] = new Date()
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034962] = { value: pegawai.jenisPegawai.id, text: pegawai.jenisPegawai.jenispegawai }
                        $scope.item.obj[22034964] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034971]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034971] !=null && $scope.item.obj[22034972]==undefined){
                        $scope.item.obj[22034969] = new Date()
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
                        $scope.item.obj[22034977] = new Date()
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
                        $scope.item.obj[22034985] = new Date()
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
                        $scope.item.obj[22034993] = new Date()
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
            
        }
    ]);
});
