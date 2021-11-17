define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseUrlData;
    initialize.controller('CpptDinamisDetailCtrl', ['$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, cacheHelper, medifirstService) {

            $scope.item = {};
            $scope.cc = {};
            $scope.show = {};
            var namaEMR = ''
            var nomorEMR = '-'
            $scope.cc.emrfk = $state.params.namaEMR
            $scope.tombolSimpanVis = true;
            $scope.RiwayatCPPTRJLama = false;
            $scope.RiwayatCPPTRJBaru = false;
            $scope.RiwayatCPPTRI = false;
            var dataLoad = [];
            LoadCache();
            FormLoad();
            var pegawaiLogin = medifirstService.getPegawaiLogin()
            $scope.allDisabled = false
            var pegawaiInputDetail  =''
            // nomorEMR = $state.params.nomorEMR   
            $scope.show.obj = [];
            $scope.showbtnadd = [];
            $scope.showbtnremove = [];
            $scope.show.obj[22034963] = true
            $scope.showbtnadd[22034963] = true
            $scope.showbtnremove[22034963] = false
            var emrcppt = [443, 444, 445, 446, 447, 448, 94, 210222];

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
                if (chacePeriode != undefined) {
                    nomorEMR = chacePeriode[0]
                    $scope.cc.norec_emr = nomorEMR
                    $scope.cc.tanggalEmrl = chacePeriode[2]
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
                    if (nomorEMR == '-') {
                        $scope.cc.norec_emr = '-'
                    } else {
                        $scope.cc.norec_emr = nomorEMR
                    }
                }
                loadRiwayat($scope.cc.nocm)
            }

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
                    +'&nama='+ nama,  '_blank');
                }
               
            
               
                   
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
                        "field": "noemr",
                        "title": "No EMR",
                        "width": "15%",
                        attributes: {
                            style: "text-align: center;"
                        } 
                    },
                    {
                        "field": "caption",
                        "title": "Nama EMR",
                        "width": "25%",
                    },
                    {
                        "field": "noregistrasifk",
                        "title": "No Registrasi",
                        "width": "15%",
                        attributes: {
                            style: "text-align: center;"
                        } 
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "25%",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tanggal Registrasi",
                        "width": "10%",
                    }
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
                                }   

                            }
                            if (dataLoadrcppt[i].type == "combobox") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    // $scope.item.rcpptcbo[dataLoadrcppt[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1]   
                                }  
                            }
                    
                            if (dataLoadrcppt[i].type == "combobox3") {
                                var str = dataLoadrcppt[i].value
                                if(str != undefined){
                                    var res = str.split("~");
                                    // $scope.item.rcpptcbo[dataLoadrcppt[i].emrdfk]= {value:res[0],text:res[1]}
                                    $scope.item.rcppt[dataLoadrcppt[i].emrdfk] = res[1]
                                }  
                            }
                        }
                    } 
                    // iemrcppt++;
                    // if (iemrcppt < 6) loadRiwayatCPPTData(noemr, iemrcppt);  
                })
                $scope.isRouteLoading = false;
            }

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
                        
                        if(pegawaiLogin.id!= dataLoad[i].pegawaifk){
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
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
                $scope.show.obj[nextid] = true;
                $scope.showbtnadd[nextid] = true;
                $scope.showbtnremove[nextid] = true;
                $scope.showbtnadd[id] = false;
                $scope.showbtnremove[id] = false;
            }
            $scope.removeobj = function (id, previd) {
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

                if(kelompokUser!= 'dokter' && kelompokUser != 'suster'  && kelompokUser != 'gizi' && kelompokUser != 'apotik' && kelompokUser != 'terapis'){
                    toastr.error('User bukan dokter/suster/gizi/apotik/terapis');
                    return
                }
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
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        $scope.item.title + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })
                    $scope.savePeriksaDokter()
                    $rootScope.loadRiwayat()

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

            // Isian SOAP otomasi terisi tgl/jam, ppa, nama
            $scope.$watch('item.obj[22034963]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034963] !=null && $scope.item.obj[22034964]==undefined){
                        $scope.item.obj[22034961] =$scope.now
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
                        $scope.item.obj[22034969] =$scope.now
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
                        $scope.item.obj[22034977] =$scope.now
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
                        $scope.item.obj[22034985] =$scope.now
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
                        $scope.item.obj[22034993] =$scope.now
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
                        $scope.item.obj[22035001] =$scope.now
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
                        $scope.item.obj[22034967] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034968] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034974]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034974] !=null && $scope.item.obj[22034975]==undefined){
                        $scope.item.obj[22034975] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034976] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034982]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034982] !=null && $scope.item.obj[22034983]==undefined){
                        $scope.item.obj[22034983] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034984] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034990]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034990] !=null && $scope.item.obj[22034991]==undefined){
                        $scope.item.obj[22034991] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22034992] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22034998]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22034998] !=null && $scope.item.obj[22034999]==undefined){
                        $scope.item.obj[22034999] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22035000] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            $scope.$watch('item.obj[22035006]', function(newValue,oldValue){
                if(newValue!=oldValue){
                    if($scope.item.obj[22035006] !=null && $scope.item.obj[22035007]==undefined){
                        $scope.item.obj[22035007] =$scope.now
                        let pegawai = JSON.parse(localStorage.getItem('pegawai'))
                        $scope.listPegawai.add({value: pegawai.id, text: pegawai.namaLengkap})
                        $scope.item.obj[22035008] = { value: pegawai.id, text: pegawai.namaLengkap }
                    }
                }
            })
            // End Isian Review otomasi terisi tgl/jam, nama
        }
    ]);
});