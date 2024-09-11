define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend; 
    var baseUrlJasper = config.urlJasper;
    initialize.controller('CatatanKlinikNewCtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper','$rootScope','$mdDialog',
        function ($q, $scope, ModelItem, $state, medifirstService, $timeout, cacheHelper,$rootScope, $mdDialog) {
            $scope.isRouteLoading = false;
            $scope.now = new Date()
            $scope.item = {
                tglresume: $scope.now
            } // set defined object

            $scope.item.periodeAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
            $scope.item.periodeAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');

            $scope.filter = {}
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            $scope.datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'))           
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
           
            if( kelompokUser[1] == 'ITI'){
                $scope.ukcol = 100
            }else{
                $scope.ukcol = 0
            };
            var paramSearch =''
            var param =''
            var statusCPPT =''
            var noCPPT =''
            var RiwayatA = '';
            var RiwayatP = '';
            var TextAreaA = '';
            var TextAreaP = '';
            var CPPTASSESMENT = [];
            var CPPTPLAN = [];
            $scope.lblcpptdokterS = "Subjective";
            $scope.lblcpptdokterO = "Objective";
            $scope.lblcpptdokterA = "Assesment";
            $scope.lblcpptdokterP = "Plan";
            $scope.showInstruksi = true;
            $scope.showDPJP = false;
            var iscomptdg = false;
            var iscompttd = false;
            var dataDetail2 = [];
            var UrlViewerPACS = ""
            medifirstService.get('sysadmin/settingdatafixed/get/UrlViewerPACS').then(function (dat) {
                UrlViewerPACS = dat.data
            })
            var getCache = cacheHelper.get('cacheRekamMedis')
            $scope.tglcppt = true
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.norecPd = getCache[8]
                $scope.norecAPD = getCache[7]
                $scope.noregistrasi = getCache[3]
                $scope.kelasasalfk = getCache[9]
                $scope.item.ruanganAsal = { id: getCache[11], namaruangan: getCache[12], iseksekutif: getCache[28], spesialis: getCache[27]  }
                $scope.objectkelompokpasienlastfk = getCache[21]
                $scope.objectdepartemenfk = getCache[19]
                $scope.header.DataNoregis = getCache[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    if ($scope.header.DataNoregis == true) {
                        paramSearch = 'noregistrasi=' + $scope.noregistrasi
                        param = "noReg=" + $scope.noregistrasi;
                    } else {
                        paramSearch ='nocm=' + $scope.nocm
                        param = "noCm=" + $scope.nocm;
                    }
                $scope.item.tglRegistrasi = getCache[6];
            }
            $scope.resumeOpt = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah CPPT</button>'
                },],
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    // { field: "nocppt", title: "No", width: 40 },
                    { field: "tglasesmen", title: "Tanggal", width: 120,
                        template: function(dataItem) {
                        var value = dataItem.status; 
                        var value2 = dataItem.tglasesmen;// Ambil nilai dari kolom 's'
                        var cellColor = "white"; // Warna default sel
            
                        if (value === "Ubah") {
                            cellColor = "Yellow"; // Ganti warna sel menjadi kuning
                        } 
                        return '<div style="font-weight: bold; color:black;background-color: ' + cellColor + ';">' + value2 + '</div>';
                        }
                    },
                    { field: "jenispegawai", title: "Pemberi Asuhan", width: 120},
                    { field: "namalengkap", title: "Petugas", width: 120},
                    { field: "s", title: "Subject", width: 120},
                    { field: "o", title: "Objective", width: 120},
                    { field: "a", title: "Assesment", width: 120},
                    { field: "p", title: "Plan", width: 120},
                    { field: "intruksi", title: "Intruksi", width: 120},
                    { field: "riviewdpjp", title: "Rivew DPJP", width: 120},
                    { field: "penerima", title: "Penerima", width: 120},
                    { field: "jenisdokumen", title: "Jenis Dokumen", width: 100,
                        template: function(dataItem) {
                            var value = dataItem.jenisdokumen; // Ambil nilai dari kolom 's'
                            var cellColor = "white"; // Warna default sel
                
                            if (value === "SBAR") {
                                cellColor = "yellow"; // Ganti warna sel menjadi kuning
                            } else if (value === "Nilai Kritis") {
                                cellColor = "lightgreen"; // Ganti warna sel menjadi hijau
                            }
                            return '<div style="font-weight: bold; color: rgba(0,0,0,0.87); background-color: ' + cellColor + ';">' + value + '</div>';
                        }
                    },
                    {  width: 200,
                        command: [
                      
                    { text: "Cetak", click: cetak },
                    { text: "Terima", click: terima },
                    { name: "edit", text: "Edit", click: editData },
                    { name: "Lihat", text: "Lihat", click: lihatData },
                    { text: "Instruksi", click: instruksi },
                    { text: "Review", click: jawab },
                    // { name: "Hapus", text: "Hapus", click: hapuscppt },
                    
                    ] },
                    { width: $scope.ukcol,
                        command: [
                    { name: "Hapus", text: "Hapus", click: hapuscppt },
                    { name: "RTerima", text: "Reset Penerima",  click: ResetPenerima },
                    
                    ] }
                ],
            };
            
            $scope.inputBaru = function () {
                if (kelompokUser[1] == 'dokter') {
                    medifirstService.get("emr/get-data-perawatan?norec_apd=" + $scope.norecAPD +"&norec_pd=" + $scope.norecPd).then(function (data) { 
                        clear()
                        var datas = data.data;
                        var isfind = false;
                        $scope.item.assesment = '';
                        $scope.item.assesmentft = '';
                        $scope.item.plan = '';
                        $scope.item.planft = '';
                        if(datas.cpptdokter.length > 0){
                            for(var i = 0; i < datas.cpptdokter.length; i++){
                                if(datas.cpptdokter[i].pegawaifk == $scope.pegawaiLogin.id){
                                    isfind = true;
                                    if (datas.cpptdokter[i].a.length > 0) {
                                        TextAreaA = datas.cpptdokter[i].a.replace("(A) ","");
                                        $scope.item.assesmentft = datas.cpptdokter[i].a.replace("(A) ","");
                                        displayken(CPPTASSESMENT, 'assesment');
                                    } 
                                    if (datas.cpptdokter[i].p.length > 0) {
                                        TextAreaP = datas.cpptdokter[i].p.replace("(P) ","").replace("(R) ","");
                                        $scope.item.planft = datas.cpptdokter[i].p.replace("(P) ","").replace("(R) ","");
                                        displayken2(CPPTPLAN, 'plan');
                                    }
                                    var dxdata = []
                                    if (datas.cpptdokter[i].a.length > 0 && datas.cpptdokter[i].a.indexOf(' # ')>=0) {
                                        var resdata = datas.cpptdokter[i].a.split(' # ');
                                        TextAreaA = resdata[0].replace("(A) ","");
                                        $scope.item.assesmentft = resdata[0].replace("(A) ","");
                                        displayken(CPPTASSESMENT, 'assesment');
                                    }                
                                    if (datas.cpptdokter[i].p.length > 0 && datas.cpptdokter[i].p.indexOf(' # ')>=0) {
                                        var resdata = datas.cpptdokter[i].p.split(' # ');
                                        TextAreaP = resdata[0].replace("(P) ","").replace("(R) ","");
                                        $scope.item.planft = resdata[0].replace("(P) ","").replace("(R) ","");
                                        displayken2(CPPTPLAN, 'plan');
                                        
                                    }
                                    break;
                                }
                            }
                        }
                        if(datas.cpptdokter.length <= 0 || isfind == false){
                            if ($scope.objectdepartemenfk == 16 || $scope.objectdepartemenfk == 66 || $scope.objectdepartemenfk == 67){
                                var emrfk = 440006
                                var kodeex_anamesis = 1000325
                                var kodeex_plan = [1000317, 1000318, 1000319, 1000320, 1000321]
                            }
                            if (emrfk != undefined){
                                medifirstService.get("emr/get-emr-by-noreg?emrfk=" + emrfk + "&noreg=" + $scope.noregistrasi).then(function (data) {
                                    var datas = data.data.data;
                                    var arrplan = [];
                                    for (let i = 0; i < datas.length; i++) {
                                        if (datas[i].emrdfk == kodeex_anamesis){
                                            TextAreaA = datas[i].value;
                                            $scope.item.assesmentft = datas[i].value;
                                            displayken(CPPTASSESMENT, 'assesment');
                                        }
                                        if (kodeex_plan.includes(datas[i].emrdfk)){
                                            arrplan.push(datas[i].value);
                                            TextAreaP = arrplan.join(", ");
                                            $scope.item.planft = arrplan.join(", ");
                                            displayken(CPPTPLAN, 'plan');
                                        }
                                    }
                                })
                            }
                        }
                        loadDiagnosaicd10();
                        loadDiagnosaicd9();
                        $scope.item.namadokter = { id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap }
                        // $scope.item.pegawaipemberiasuhan = { id: dataLogin.id, namalengkap: dataLogin.namaLengkap }
                        var dataLogin = medifirstService.getPegawaiLogin();
                        $scope.item.jenisdokumen = { id: 1, nama: 'CPPT'};
                        $scope.listJenisDiagnosa = [{"id": 1,"jenisDiagnosa": "Primary / utama"},{"id": 13,"jenisDiagnosa": "Diagnosa Sekunder/komplikasi"},{"id": 14,"jenisDiagnosa": "Komorbid"}]
                        $scope.item.tglpemberi = $scope.now;
                        $scope.item.pemberiasuhan = { id: dataLogin.jenisPegawai.id, jenispegawai: dataLogin.jenisPegawai.jenispegawai }
                        $scope.item.pegawaipemberiasuhan = { value: dataLogin.id, text: dataLogin.namaLengkap }
                        statusCPPT = "Baru"
                        $scope.lblcpptdokterS = "Subjective";
                        $scope.lblcpptdokterO = "Objective";
                        $scope.lblcpptdokterA = "Assesment";
                        $scope.lblcpptdokterP = "Plan";
                        $scope.item.islabelA = false;
                        $scope.item.islabelP = false;
                        noCPPT = undefined
                        $scope.isRouteLoading = false;
                        $scope.popUpCPPTDokter.center().open()
                    })
                }else{
                    // $scope.item.pegawaipemberiasuhan = { id: dataLogin.id, namalengkap: dataLogin.namaLengkap }
                    clear()
                    var dataLogin = medifirstService.getPegawaiLogin();
                    $scope.item.tglpemberi = $scope.now;
                    $scope.item.pemberiasuhan = { id: dataLogin.jenisPegawai.id, jenispegawai: dataLogin.jenisPegawai.jenispegawai }
                    $scope.item.pegawaipemberiasuhan = { value: dataLogin.id, text: dataLogin.namaLengkap }
                    statusCPPT = "Baru"
                    noCPPT = undefined
                    $scope.popUp.center().open()
                    $scope.showInstruksi = false;
                }
            }
            $scope.batal = function () {
                $scope.popUp.close()
            }
            $scope.batalcpptdokter = function () {
                clear();
                $scope.popUpCPPTDokter.close()
            }
            $scope.batalLihat = function () {
                $scope.dataRiwayatCPPT = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpLihat.close()
            }
            $scope.batalInstruksi = function () {
                $scope.popUpInstruksi.close()
            }
            $scope.batalHapusCppt = function () {
                $scope.popUpHapus.close()
            }
            init();

            function hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var objectdepartemenfk = "";
                var spesialisawal = "";
                var spesialistujuan = "";
                var spesialissama = false;
                for (let i = 0; i < $scope.listRuangan.length; i++) {
                    const element = $scope.listRuangan[i];
                    if(element.id == dataItem.objectruanganfk) {
                        spesialisawal = element.spesialis
                    }
                    if(element.id == dataItem.objectruangantujuanfk) {
                        objectdepartemenfk = element.objectdepartemenfk
                        spesialistujuan = element.spesialis
                    }
                }
                if(spesialisawal == spesialistujuan){
                    spesialissama = true
                }
                var itemDelete = {
                    "norec": dataItem.norec,
                    "objectkelompokpasienlastfk": $scope.objectkelompokpasienlastfk,
                    "objectdepartemenfk": objectdepartemenfk,
                    "isspesialissama": spesialissama,
                }

                medifirstService.post( 'emr/disabled-konsultasi',itemDelete).then(function (e) {
                    if (e.status == 201) {
                        init()
                    }
                })

            }

            
            function jawab(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.item.norec = dataItem.norec
                var dataLogin = medifirstService.getPegawaiLogin();
                $scope.item.tglpemberi = $scope.now;
                $scope.item.tglcppt = dataItem.tglasesmen;
                $scope.item.DPJP = { id: dataLogin.id, namalengkap: dataLogin.namaLengkap }
                $scope.item.tglReview  = $scope.now;
                $scope.item.review  = dataItem.keteranganlainnya
                $scope.item.jenisdokumenfk = dataItem.objectjenisdokumenfk
                $scope.popUpJawab.center().open()            
            }
            $scope.SaveJawab = function(){
                // if ($scope.item.jawaban == undefined) {
                //     toastr.error("Jawaban Belum di isi!")
                //     return
                // }
                var objSave = {
                    norec_cp: $scope.item.norec,
                    review : $scope.item.review,
                    pegawaireviewfk: $scope.item.DPJP.id,
                    tglreview: moment($scope.item.tglReview).format('YYYY-MM-DD HH:mm:ss'),
                    tglcppt: moment($scope.item.tglcppt).format('YYYY-MM-DD'),
                    norec_pd: $scope.norecPd,
                    jenisdokumenfk: $scope.item.jenisdokumenfk,
                    jenis : 'review'
                }
                console.log(objSave)
                medifirstService.post( 'emr/update-cppt-new',objSave).then(function (e) {
                    clear()
                    init();
                    $scope.popUpJawab.close()
                    
                });
            }
            $scope.SaveHapusCppt = function(){
                if ($scope.item.pelapor == undefined) {
                    toastr.error("Pelapor Belum di isi!")
                    return
                }
                if ($scope.item.hapuscppt == undefined) {
                    toastr.error("Alasan Belum di isi!")
                    return
                }
                var objSave = {
                    norec_cp: $scope.item.norec,
                    alasanhapus : $scope.item.hapuscppt,
                    pelapor : $scope.item.pelapor.value,
                    tglhapus: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    // tglcppt: moment($scope.item.tglcppt).format('YYYY-MM-DD'),
                    norec_pd: $scope.norecPd,
                    user : $scope.pegawaiLogin.namaLengkap,
                    jenis : 'hapus'
                }

                medifirstService.post( 'emr/update-cppt-new',objSave).then(function (e) {
                    clear()
                    init();
                    $scope.popUpHapus.close()
                    
                });
            }

            $scope.SaveInstruksi = function(){
                // if ($scope.item.jawaban == undefined) {
                //     toastr.error("Jawaban Belum di isi!")
                //     return
                // }
             
                var objSave = {
                    norec_cp: $scope.item.norec,
                    instruksi : $scope.item.instruksi,
                    pegawaiinstruksifk: $scope.item.DPJPinstruksi.value,
                    tglinstruksi: moment($scope.item.tglInstruksi).format('YYYY-MM-DD HH:mm:ss'),
                    tglcppt: moment($scope.item.tglcppt).format('YYYY-MM-DD'),
                    norec_pd: $scope.norecPd,
                    jenis : 'instruksi'
                }
                medifirstService.post( 'emr/update-cppt-new',objSave).then(function (e) {
                    clear()
                    init();
                    $scope.popUpJawab.close()
                    
                });
            }
            function editData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                
                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                if(kelompokUser[1] == 'dokter'){
                    $scope.item.norec = dataItem.norec
                    $scope.item.subject = dataItem.s
                    $scope.item.object = dataItem.o
                    $scope.item.intruksi = dataItem.intruksi     
                    $scope.item.pemberiasuhan = { id: dataItem.objectjenispegawaifk, jenispegawai: dataItem.jenispegawai }
                    $scope.item.ruanganAsal = { id: dataItem.ruanganfk, namaruangan: dataItem.namaruangan }
                    $scope.item.pegawaipemberiasuhan = { value: dataItem.pegawaifk, text: dataItem.namalengkap }
                    $scope.item.jenisdokumen = { id: dataItem.objectjenisdokumenfk, nama: dataItem.jenisdokumen }            
                    $scope.item.tglpemberi = dataItem.tglasesmen;
                    $scope.item.jenisdokumen = { id: dataItem.objectjenisdokumenfk, nama: dataItem.jenisdokumen } 
                    noCPPT = dataItem.nocppt
                    statusCPPT = 'Ubah'

                    if (dataItem.a.length > 0 && dataItem.a.indexOf(' # ')>=0) {
                        var resdata = dataItem.a.split(' # ');
                        TextAreaA = resdata[0];
                        $scope.item.assesmentft = resdata[0];
                        displayken(CPPTASSESMENT, 'assesment');
                    }else{
                        // $scope.item.assesment = dataItem.a
                        TextAreaA = dataItem.a;
                        $scope.item.assesmentft = dataItem.a;
                        displayken(CPPTASSESMENT, 'assesment');
                    }
                    if (dataItem.p.length > 0 && dataItem.p.indexOf(' # ')>=0) {
                        var resdata = dataItem.p.split(' # ');
                        TextAreaP = resdata[0];
                        $scope.item.planft = resdata[0];
                        displayken2(CPPTPLAN, 'plan');
                    }else{
                        // $scope.item.plan = dataItem.p   
                        TextAreaP = dataItem.p;
                        $scope.item.planft = dataItem.p;
                        displayken2(CPPTPLAN, 'plan');   
                    }
                    
                    loadDiagnosaicd10();
                    loadDiagnosaicd9();

                    $scope.isRouteLoading = false;
                    $scope.popUpCPPTDokter.center().open();
                }
                else{
                    if(dataItem.jenisdokumen == 'CPPT'){
                        $scope.showDPJP = false;
                        $scope.showPenunjang = false;
                        $scope.showInstruksi = true;
                    }else if(dataItem.jenisdokumen == 'SBAR'){
                        $scope.showDPJP = true;
                        $scope.showPenunjang = false;
                        $scope.showInstruksi = false;
                    }else{
                        $scope.showDPJP = true;
                        $scope.showPenunjang = true;
                        $scope.showInstruksi = false;
                    }
                    $scope.item.norec = dataItem.norec
                    $scope.item.subject = dataItem.s
                    $scope.item.object = dataItem.o
                    $scope.item.assesment = dataItem.a
                    $scope.item.intruksi = dataItem.intruksi
                    $scope.item.plan = dataItem.p                
                    $scope.item.pemberiasuhan = { id: dataItem.objectjenispegawaifk, jenispegawai: dataItem.jenispegawai }
                    $scope.item.ruanganAsal = { id: dataItem.ruanganfk, namaruangan: dataItem.namaruangan }
                    $scope.item.pegawaipemberiasuhan = { value: dataItem.pegawaifk, text: dataItem.namalengkap }
                    $scope.item.jenisdokumen = { id: dataItem.objectjenisdokumenfk, nama: dataItem.jenisdokumen }            
                    $scope.item.tglpemberi = dataItem.tglasesmen;
                    $scope.item.jenisdokumen = { id: dataItem.objectjenisdokumenfk, nama: dataItem.jenisdokumen } 
                    $scope.item.dpjpkonsulan = { value: dataItem.dpjpkonsulan, text: dataItem.namadpjpkonsulan }
                    $scope.item.PegawaiPenunjang = { value: dataItem.perawatpenunjang, text: dataItem.namapp }
                    noCPPT  = dataItem.nocppt
                    statusCPPT = 'Ubah'     
                    $scope.popUp.center().open()
                }

            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.noregistrasi
                    param = "noReg=" + $scope.noregistrasi;
                }
                else {
                    paramSearch ='nocm=' + $scope.nocm
                    param = "noCm=" + $scope.nocm;
                    init()
                }
            }

            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get( "emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listJenisPegawai = e.data.jenispegawai
                    $scope.listRuangan = e.data.ruangkonsulnonpenunjang; //e.data.ruangankonsul
                    $scope.listjenispegawai = e.data.jenispegawai;
                })

                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                    $scope.listPegawaiPenunjang = data;
                })
                medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function(data) {
                    $scope.listDokter = data
                    $scope.listPegawaidpjp = data;
                })
                $scope.listJenisDokumen = [
                    { id: 1, nama: 'CPPT'},
                    { id: 2, nama: 'SBAR'},
                    { id: 7, nama: 'Nilai Kritis'}
                ]
                $scope.listJenisDokumenDokter = [
                    { id: 1, nama: 'CPPT'},
                    { id: 2, nama: 'SBAR'},
                ]
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });
                $q.all([
                     medifirstService.get( "emr/get-cppt-new?" + paramSearch + '&noregistrasifk=' + $scope.norecPd )
                ]).then(function (res) {
                    if (res[0].statResponse) {
                        var result = res[0].data.data
                        if (result.length > 0) {
                            for (let index = 0; index < result.length; index++) {
                                result[index].no = index + 1
                                result[index].riviewdpjp =  (result[index].riview == null ? '' :  result[index].riview) + ' - ' +  (result[index].namariview == null ? '' : result[index].namariview)
                            }
                        }

                        $scope.sourceResume = new kendo.data.DataSource({
                            data: result,
                            pageSize: 20,
                        });
                    }

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })


            };

            $scope.checkboxClicked = function (dat) {
                if ($scope.item.kasusbaru == true) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }

            $scope.checkboxClicked2 = function (dat) {
                if ($scope.item.kasuslama == false) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }

            function validasi() {
                var listRawRequired = [
                    "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    if ($scope.dataIcd9Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                    }
                    var ketTindakans = "";
                    if ($scope.item.ketTindakan != undefined) {
                        ketTindakans = $scope.item.ketTindakan
                    }
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        objectpasienfk: $scope.norecAPD,
                        tglpendaftaran: $scope.item.tglRegistrasi,
                        objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                        keterangantindakan: ketTindakans,
                        noregistrasi: $scope.noregistrasi
                    }

                    $scope.objSave =
                        {
                            detaildiagnosatindakanpasien: data,
                        }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-"
                    }
                    else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.norecAPD,
                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama,
                        noregistrasi: $scope.noregistrasi
                    }

                    $scope.objSave =
                        {
                            detaildiagnosapasien: data,
                        }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            function Kosongkan() {
                delete $scope.item.keterangan;
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosa;
                delete $scope.item.kasusbaru;
                delete $scope.item.kasuslama;
                delete $scope.dataIcd10Selected;
            }
      
            $scope.batalIcd10 = function () {
                Kosongkan();
            }
      
            $scope.deleteIcd10 = function (){
                // $scope.dataIcd10Selected;
                // if ($scope.dataIcd10Selected.no != undefined) {
                //     for (var i = CPPTASSESMENT.length - 1; i >= 0; i--) {
                //         if (CPPTASSESMENT[i].no == $scope.dataIcd10Selected.no) {
                //             CPPTASSESMENT.splice(i, 1);
                //             for (var j = CPPTASSESMENT.length - 1; j >= 0; j--) {
                //                 CPPTASSESMENT[j].no = j + 1
                //             }
                //             $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                //                 data: CPPTASSESMENT
                //             });
                //         }
                //     }      
                // }
                // displayken(CPPTASSESMENT, 'assesment');
                // Kosongkan()
                $scope.isRouteLoading = true;
                if ($scope.dataIcd10Selected == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + ' - ' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.noregistrasi
                        + '/ ' + $scope.nocm

                    ).then(function (res) {
                    })
                    $scope.isRouteLoading = false;                    
                    Kosongkan();
                    loadDiagnosaicd10();
                })
            }
      
            $scope.saveIcd10 = function () {
                if ($scope.item.keterangan != undefined && ($scope.item.jenisDiagnosis == undefined || $scope.item.jenisDiagnosis == null)) {
                    if($scope.item.keterangan.length > 0 && ($scope.item.jenisDiagnosis == undefined || $scope.item.jenisDiagnosis == null)){
                        alert("Jika mengisi Keterang Diagnosa Awal Mohon Inputkan Jenis Diagnosis")
                        return;
                    }
                }
                if ($scope.item.keterangan != undefined && ($scope.item.diagnosa == undefined || $scope.item.diagnosa == null)) {
                    if($scope.item.keterangan.length > 0 && ($scope.item.diagnosa == undefined || $scope.item.diagnosa == null)){
                        alert("Jika mengisi Keterang Diagnosa Awal Mohon Inputkan Kode Diagnosis dengan tanda - - -")
                        return;
                    }
                }
                if ($scope.item.jenisDiagnosis == undefined || $scope.item.jenisDiagnosis == null) {
                    if($scope.item.keterangan == undefined){
                        alert("Inputkan Jenis Diagnosis terlebih dahulu!!")
                        return;
                    }
                    else if($scope.item.keterangan != undefined){if($scope.item.keterangan.length <= 0){alert("Inputkan Jenis Diagnosis terlebih dahulu!!");return;}}
                }
                if ($scope.item.diagnosa == undefined || $scope.item.diagnosa == null) {
                    if($scope.item.keterangan == undefined){
                        alert("Inputkan Kode Diagnosis terlebih dahulu!!")
                        return;
                    }
                    else if($scope.item.keterangan != undefined){if($scope.item.keterangan.length <= 0){alert("Inputkan Kode Diagnosis terlebih dahulu!!");return;}}
                }
                // if($scope.item.kasusbaru == undefined && $scope.item.kasuslama == undefined){
                //     alert("Inputkan Jenis Kasus terlebih dahulu!!")
                //     return;
                // }
                validatedx();
            }

            function validatedx(){
                if($scope.item.jenisDiagnosis.id == 1){
                    for(var i = 0; i < CPPTASSESMENT.length; i++){
                        if(CPPTASSESMENT[i].objectjenisdiagnosafk == 1){
                            alert("Jenis Diagnosa Primary/Utama Sudah Diinputkan!!")
                            return;
                        }
                    }
                }
                for(var i = 0; i < CPPTASSESMENT.length; i++){
                    if($scope.item.diagnosa.id == CPPTASSESMENT[i].id){
                        alert("Kode Diagnosa Sudah Diinputkan!!")
                        return;
                    }
                }
                lanjuttambah();
            }
      
            function lanjuttambah() {
                $scope.isRouteLoading = true;
                var norec_diagnosapasien = undefined;
                var nomor = 0
                if ($scope.dataSourceDiagnosaIcd10 == undefined) {
                    nomor = 1;
                } else {
                    nomor = CPPTASSESMENT.length + 1;
                }
                var data = {};
                data = {
                    no: nomor,
                    objectdiagnosafk: $scope.item.diagnosa!=undefined?$scope.item.diagnosa.id:'',
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis!=undefined?$scope.item.jenisDiagnosis.id:'',
                    jenisdiagnosa: $scope.item.jenisDiagnosis!=undefined?$scope.item.jenisDiagnosis.jenisDiagnosa:'',
                    kddiagnosa: $scope.item.diagnosa!=undefined?$scope.item.diagnosa.kdDiagnosa:'',
                    namadiagnosa: $scope.item.diagnosa!=undefined?$scope.item.diagnosa.namaDiagnosa:'',
                    kodenama: $scope.item.diagnosa!=undefined?$scope.item.diagnosa.kodeNama:'',
                    keterangan: $scope.item.keterangan!=undefined?$scope.item.keterangan:'',
                    norec_dp: norec_diagnosapasien!=undefined?norec_diagnosapasien:'',
                    noregistrasifk: $scope.norecAPD,
                    tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    objectdiagnosafk: $scope.item.diagnosa!=undefined?$scope.item.diagnosa.id:'',
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis!=undefined?$scope.item.jenisDiagnosis.id:'',
                    kasusbaru: $scope.item.kasusbaru,
                    kasuslama: $scope.item.kasuslama,
                    noregistrasi: $scope.noregistrasi,
                    tglinputdiagnosa: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
                }
                $scope.objSave = {
                    detaildiagnosapasien: data,
                }
                medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 Utama dari emr pengkajian awal IGD ( ' + data.kodenama + ' )' + ' No Registrasi ' + $scope.noregistrasi
                        + '/ ' + $scope.nocm
                    ).then(function (res) {
                    })
                    $scope.isRouteLoading = false;
                    loadDiagnosaicd10();
                    Kosongkan();
                })
            }

            function loadDiagnosaicd10() {
                medifirstService.get("emr/get-diagnosapasienbynoreg?" + param).then(function (data) {
                    CPPTASSESMENT = data.data.datas;
                    if(CPPTASSESMENT.length>0){
                        $scope.item.chkicd10 = true;
                    }else{
                        $scope.item.chkicd10 = false;
                    }
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: CPPTASSESMENT,
                        pageSize: 5
                    });
                    displayken(CPPTASSESMENT, 'assesment');
                });
            }

            function loadDiagnosaicd9() {
                medifirstService.get("emr/get-diagnosapasienbynoregicd9?" + param).then(function (data) {
                    CPPTPLAN = data.data.datas;
                    if(CPPTPLAN.length>0){
                        $scope.item.chkicd9 = true;
                    }else{
                        $scope.item.chkicd9 = false;
                    }                    
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: CPPTPLAN,
                        pageSize: 5
                    });
                    displayken2(CPPTPLAN, 'plan')
                });
            }

            function Kosongkan2() {
                delete $scope.item.ketTindakan;
                delete $scope.item.diagnosaTindakan;
                delete $scope.dataIcd9Selected;
            }
      
            $scope.batalIcd9 = function () {
                Kosongkan2();
            }
      
            $scope.deleteIcd9 = function (){
                // $scope.dataIcd9Selected;
                // if ($scope.dataIcd9Selected.no != undefined) {
                //     for (var i = CPPTPLAN.length - 1; i >= 0; i--) {
                //         if (CPPTPLAN[i].no == $scope.dataIcd9Selected.no) {
                //             CPPTPLAN.splice(i, 1);
                //             for (var j = CPPTPLAN.length - 1; j >= 0; j--) {
                //                 CPPTPLAN[j].no = j + 1
                //             }
                //             $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                //                 data: CPPTPLAN
                //             });
                //         }
                //     }      
                // }
                // displayken2(CPPTPLAN, 'plan');
                // Kosongkan2()
                $scope.isRouteLoading = true;
                if ($scope.dataIcd9Selected == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + ' - ' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.noregistrasi
                        + '/ ' + $scope.nocm

                    ).then(function (res) {
                    })
                    $scope.isRouteLoading = false;
                    Kosongkan2();
                    loadDiagnosaicd9();
                })
            }
      
            $scope.saveIcd9 = function () {
                if ($scope.item.ketTindakan != undefined && ($scope.item.diagnosaTindakan == undefined || $scope.item.diagnosaTindakan == null)) {
                    if($scope.item.ketTindakan.length > 0 && ($scope.item.diagnosaTindakan == undefined || $scope.item.diagnosaTindakan == null)){
                        alert("Jika mengisi Keterang Keterangan Tindakan Mohon Inputkan Jenis Diagnosis dengan tanda - - -")
                        return;
                    }
                }
                if ($scope.item.diagnosaTindakan == undefined || $scope.item.diagnosaTindakan == null) {
                    if($scope.item.ketTindakan == undefined){
                        alert("Inputkan Kode Tindakan terlebih dahulu!!")
                        return;
                    }
                    else if($scope.item.ketTindakan != undefined){if($scope.item.ketTindakan.length <= 0){alert("Inputkan Kode Tindakan terlebih dahulu!!");return;}}
                }
                validatetd();
            }

            function validatetd(){
                for(var i = 0; i < CPPTPLAN.length; i++){
                    if($scope.item.diagnosaTindakan.id == CPPTPLAN[i].id){
                        alert("Tindakan Sudah Diinputkan!!")
                        return;
                    }
                }
                lanjuttambah2();
            }
      
            function lanjuttambah2() {
                $scope.isRouteLoading = true;
                var norec_diagnosapasien = undefined;
                var nomor = 0
                if ($scope.dataSourceDiagnosaIcd9 == undefined) {
                    nomor = 1;
                } else {
                    nomor = CPPTPLAN.length + 1;
                }
                var data = {};
                data = {
                    no: nomor,
                    objectdiagnosatindakanfk: $scope.item.diagnosaTindakan!=undefined?$scope.item.diagnosaTindakan.id:'',
                    kddiagnosatindakan: $scope.item.diagnosaTindakan!=undefined?$scope.item.diagnosaTindakan.kdDiagnosaTindakan:'',
                    namadiagnosatindakan: $scope.item.diagnosaTindakan!=undefined?$scope.item.diagnosaTindakan.namaDiagnosaTindakan:'',
                    kodenama: $scope.item.diagnosaTindakan!=undefined?$scope.item.diagnosaTindakan.kodeNama:'',
                    keterangantindakan: $scope.item.ketTindakan!=undefined?$scope.item.ketTindakan:'',
                    norec_dp: norec_diagnosapasien!=undefined?norec_diagnosapasien:'',
                    objectpasienfk: $scope.norecAPD,
                    tglpendaftaran: moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                    noregistrasi: $scope.noregistrasi,
                    tglinputdiagnosa: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
                }
                $scope.objSave = {
                    detaildiagnosatindakanpasien: data,
                }
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                    'Input Diagnosis ICD 9 ( ' + data.kodenama + ' )' + ' No Registrasi ' + $scope.noregistrasi
                        + '/ ' + $scope.nocm
                    ).then(function (res) {
                    })
                    $scope.isRouteLoading = false;
                    loadDiagnosaicd9();
                    Kosongkan2();
                })
            }

            function displayken(data, item) {
                var namaproduk = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if(element.kddiagnosa === "-"){
                        namaproduk.push(element.keterangan);
                    }else{
                        namaproduk.push(element.kddiagnosa + " - " + element.namadiagnosa);
                    }                    
                }
                $scope.item[item] = RiwayatA.length>0?namaproduk.length<=0?RiwayatA:RiwayatA + ' # ' + namaproduk.join(", "):namaproduk.join(", ");
                $scope.item[item] = TextAreaA.length>0?$scope.item[item]<=0?TextAreaA:TextAreaA + ' # ' + $scope.item[item]:$scope.item[item];
            }

            function displayken2(data, item) {
                var namaproduk = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if(element.kddiagnosatindakan === "-"){
                        namaproduk.push(element.keterangantindakan);
                    }else{
                        namaproduk.push(element.kddiagnosatindakan + " - " + element.diagnosatindakan);
                    }
                    
                }
                $scope.item[item] = RiwayatP.length>0?namaproduk.length<=0?RiwayatP:RiwayatP + ' # ' + namaproduk.join(", "):namaproduk.join(", ");
                $scope.item[item] = TextAreaP.length>0?$scope.item[item]<=0?TextAreaP:TextAreaP + ' # ' + $scope.item[item]:$scope.item[item];
            }

            $scope.$watch("item.assesmentft", function (nilai) {
                if (nilai == undefined) return;
                TextAreaA = nilai;
                displayken(CPPTASSESMENT, 'assesment');
            });

            $scope.$watch("item.planft", function (nilai) {
                if (nilai == undefined) return;
                TextAreaP = nilai;
                displayken2(CPPTPLAN, 'plan');
            });

            $scope.$watch("item.tranfusi", function (nilai) {
                if (nilai == undefined) return;
                if (isNaN(nilai)){
                    $scope.item.tranfusi = nilai.slice(0, -1);
                    alert("Harap inputkan Angka bukan Huruf");
                    return;
                }
            });

            $scope.columnDiagnosaIcd9 = [
                {
                    "title": "No",
                    "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                    "width": "20px"
                }, 
                // {
                //     "field": "noregistrasi",
                //     "title": "No Registrasi",
                //     "width": "100px"
                // }, 
                {
                    "field": "kddiagnosatindakan",
                    "title": "Kode ICD 9",
                    "width": "50px"
                }, 
                {
                    "field": "namadiagnosatindakan",
                    "title": "Nama ICD 9",
                    "width": "100px"
                }, 
                {
                    "field": "keterangantindakan",
                    "title": "Keterangan",
                    "width": "50px"
                }, 
                // {
                //     "field": "namaruangan",
                //     "title": "Ruangan",
                //     "width": "200px"
                // },
                // {
                //     "field": "namalengkap",
                //     "title": "Penginput",
                //     "width": "200px"
                // },
                // {
                //     "field": "tglinputdiagnosa",
                //     "title": "Tgl Input",
                //     "width": "200px"
                // }
            ];

            $scope.columnDiagnosaIcd10 = [
                {
                    "title": "No",
                    "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                    "width": "20px"
                }, 
                // {
                //     "field": "noregistrasi",
                //     "title": "No Registrasi",
                //     "width": "33px"
                // },
                {
                    "field": "jenisdiagnosa",
                    "title": "Jenis Diagnosis",
                    "width": "50px"
                }, 
                {
                    "field": "kddiagnosa",
                    "title": "Kode ICD 10",
                    "width": "50px"
                }, 
                {
                    "field": "namadiagnosa",
                    "title": "Nama ICD 10",
                    "width": "100px"
                }, 
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "50px"
                }, 
                // {
                //     "field": "namaruangan",
                //     "title": "Ruangan",
                //     "width": "50px"
                // },
                // {
                //     "field": "namalengkap",
                //     "title": "Penginput",
                //     "width": "66px"
                // },
                // {
                //     "field": "tglinputdiagnosa",
                //     "title": "Tgl Input",
                //     "width": "50px"
                // }
            ];

            $scope.Save = function (data) {
                if ($scope.item.jenisdokumen == undefined) {
                    toastr.error("Pilih Jenis Dokumen terlebih dahulu!")
                    return
                }
               
                let subject = '';
                let object = '';
                let assesment = '';
                let plan = '';
                
                if ($scope.item.jenisdokumen.nama !== "CPPT") { 
                    if (statusCPPT == "Baru") {
                        subject = "(S) ".concat  ($scope.item.subject != undefined ? $scope.item.subject : '');
                        object = "(B) ".concat  ($scope.item.object != undefined ? $scope.item.object : '');
                        assesment = "(A) ".concat  ($scope.item.assesment != undefined ? $scope.item.assesment : '');
                        plan = "(R) ".concat  ( $scope.item.plan != undefined ? $scope.item.plan : '');
                    }
                    else{
                        subject = $scope.item.subject != undefined ? $scope.item.subject : '';
                        object = $scope.item.object != undefined ? $scope.item.object : '';
                        assesment = $scope.item.assesment != undefined ? $scope.item.assesment : '';
                        plan = $scope.item.plan != undefined ? $scope.item.plan : '';
                    }                    
                     
                } else { 
                    if (statusCPPT == "Baru") {
                        subject = "(S) ".concat  ($scope.item.subject != undefined ? $scope.item.subject : '');
                        object = "(O) ".concat ($scope.item.object != undefined ? $scope.item.object : '');
                        assesment = "(A) ".concat  ($scope.item.assesment != undefined ? $scope.item.assesment : '');
                        plan = "(P) ".concat  ($scope.item.plan != undefined ? $scope.item.plan : '');
                     }
                    else{
                        subject = $scope.item.subject != undefined ? $scope.item.subject : '';
                        object = $scope.item.object != undefined ? $scope.item.object : '';
                        assesment = $scope.item.assesment != undefined ? $scope.item.assesment : '';
                        plan = $scope.item.plan != undefined ? $scope.item.plan : '';
                    }
                }

                var objSave = {
                    
                    norec_cppt: $scope.item.norec != undefined ? $scope.item.norec : '',
                    norec_riwayat: $scope.item.norecR != undefined ? $scope.item.norecR : '',                    
                    norec_pd: $scope.norecPd,
                    norec_apd: $scope.norecAPD,
                    subject: subject, //+ $scope.item.subject != undefined ? $scope.item.subject : '',
                    object: object,//$scope.item.object != undefined ? $scope.item.object : '',
                    assesment: assesment,//$scope.item.assesment != undefined ? $scope.item.assesment : '',
                    intruksi: $scope.item.intruksi != undefined ? $scope.item.intruksi : '',
                    plan: plan,//$scope.item.plan != undefined ? $scope.item.plan : '',
                    pemberiasuhan: $scope.item.pemberiasuhan.id,
                    objectjenisdokumenfk : $scope.item.jenisdokumen.id,
                    pegawaipemberiasuhan: $scope.item.pegawaipemberiasuhan.value,
                    tglinput: moment($scope.item.tglpemberi).format('YYYY-MM-DD HH:mm:ss'),
                    status : statusCPPT,
                    nocppt : noCPPT,
                    dpjp: $scope.item.dpjpkonsulan != undefined ? $scope.item.dpjpkonsulan.value : null,
                    PerawatPenunjang: $scope.item.PegawaiPenunjang != undefined ? $scope.item.PegawaiPenunjang.value : null,
                    
                }
               
            //   console.log(objSave)
            //   return;
                medifirstService.post( 'emr/post-cppt-new',objSave).then(function (e) {
                    clear()
                    $scope.popUp.close()
                    init();
                    // medifirstService.postLogging('Konsultasi', 'Norec strukorder_t', e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                    // })
                });
            };

            $scope.Savecpptdokter = function (data) {
                if ($scope.item.jenisdokumen == undefined) {
                    toastr.error("Pilih Jenis Dokumen terlebih dahulu!")
                    return
                }
                $scope.isRouteLoading = true;
                LanjutSimpanCPPTDokter();
                // // Proses Save Diagnosa
                // var arrdg = [];
                // var countdg = 0;
                // iscomptdg = false;
                // if (CPPTASSESMENT.length > 0) {
                //     for (var i = 0; i < CPPTASSESMENT.length; i++){
                //         CPPTASSESMENT[i].tglinputdiagnosa = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
                //         $scope.objSave = {
                //             detaildiagnosapasien: CPPTASSESMENT[i],
                //         }
                //         arrdg.push({idx: i, id: CPPTASSESMENT[i].objectdiagnosafk})
                //         medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {
                //             for(var z = 0; z < arrdg.length; z++){
                //                 if(e.data.diagnosa.id == CPPTASSESMENT[z].objectdiagnosafk){
                //                     CPPTASSESMENT[z].norec_dp = e.data.data.norec;
                //                     medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                //                         'Input Diagnosis ICD 10 Utama dari emr pengkajian awal IGD ( ' + CPPTASSESMENT[z].kodenama + ' )' + ' No Registrasi ' + $scope.noregistrasi
                //                         + '/ ' + $scope.nocm
                //                     ).then(function (res) {
                //                     })
                //                     countdg++;
                //                     if(countdg == arrdg.length){iscomptdg=true;ValidateData();}
                //                     break;
                //                 }
                //             }  
                //         })
                //     }
                // }

                // // Proses Save Tindakan
                // var arrtd = [];
                // var counttd = 0;
                // iscompttd = false;
                // if (CPPTPLAN.length > 0) {
                //     for (var i = 0; i < CPPTPLAN.length; i++){
                //         CPPTPLAN[i].tglinputdiagnosa = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
                //         $scope.objSave = {
                //             detaildiagnosatindakanpasien: CPPTPLAN[i],
                //         }
                //         arrtd.push({idx: i, id: CPPTPLAN[i].objectdiagnosatindakanfk})
                //         medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {
                //             for(var z = 0; z < arrtd.length; z++){
                //                 if(e.data.diagnosatindakan.id == CPPTPLAN[z].objectdiagnosatindakanfk){
                //                     CPPTPLAN[z].norec_dp = e.data.data.norec;
                //                     medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                //                     'Input Diagnosis ICD 9 ( ' + CPPTPLAN[z].kodenama + ' )' + ' No Registrasi ' + $scope.noregistrasi
                //                         + '/ ' + $scope.nocm
                //                     ).then(function (res) {
                //                     })
                //                     counttd++;
                //                     if(counttd == arrtd.length){iscompttd=true;ValidateData();}
                //                     break;
                //                 }
                //             }  
                //         })
                //     }
                // }
                // if(CPPTASSESMENT.length <= 0 && CPPTPLAN.length <= 0){
                //     ValidateData();
                // }
            };

            function ValidateData() {
                if((CPPTASSESMENT.length > 0 && iscomptdg == true) && (CPPTPLAN.length > 0 && iscompttd == true)){
                    LanjutSimpanCPPTDokter();
                }else if((CPPTPLAN.length <= 0) && (CPPTASSESMENT.length > 0 && iscomptdg == true)){
                    LanjutSimpanCPPTDokter();
                }else if((CPPTASSESMENT.length <= 0) && (CPPTPLAN.length > 0 && iscompttd == true)){
                    LanjutSimpanCPPTDokter();
                }else if((CPPTASSESMENT.length <= 0) && (CPPTPLAN.length <= 0)){
                    LanjutSimpanCPPTDokter();
                }
            }

            function LanjutSimpanCPPTDokter() {

                let subject = '';
                let object = '';
                let assesment = '';
                let plan = '';
                
                if ($scope.item.jenisdokumen.nama !== "CPPT") { 
                    if (statusCPPT == "Baru") {
                        subject = "(S) ".concat  ($scope.item.subject != undefined ? $scope.item.subject : '');
                        object = "(B) ".concat  ($scope.item.object != undefined ? $scope.item.object : '');
                        assesment = "(A) ".concat  ($scope.item.assesment != undefined ? $scope.item.assesment : '');
                        plan = "(R) ".concat  ( $scope.item.plan != undefined ? $scope.item.plan : '');
                    }
                    else{
                        subject = $scope.item.subject != undefined ? $scope.item.subject : '';
                        object = $scope.item.object != undefined ? $scope.item.object : '';
                        assesment = $scope.item.assesment != undefined ? $scope.item.assesment : '';
                        plan = $scope.item.plan != undefined ? $scope.item.plan : '';
                    }                    
                     
                } else { 
                    if (statusCPPT == "Baru") {
                        subject = "(S) ".concat  ($scope.item.subject != undefined ? $scope.item.subject : '');
                        object = "(O) ".concat ($scope.item.object != undefined ? $scope.item.object : '');
                        assesment = "(A) ".concat  ($scope.item.assesment != undefined ? $scope.item.assesment : '');
                        plan = "(P) ".concat  ($scope.item.plan != undefined ? $scope.item.plan : '');
                     }
                    else{
                        subject = $scope.item.subject != undefined ? $scope.item.subject : '';
                        object = $scope.item.object != undefined ? $scope.item.object : '';
                        assesment = $scope.item.assesment != undefined ? $scope.item.assesment : '';
                        plan = $scope.item.plan != undefined ? $scope.item.plan : '';
                    }
                }

                var objSave = {
                    
                    norec_cppt: $scope.item.norec != undefined ? $scope.item.norec : '',
                    norec_riwayat: $scope.item.norecR != undefined ? $scope.item.norecR : '',                    
                    norec_pd: $scope.norecPd,
                    norec_apd: $scope.norecAPD,
                    subject: subject, //+ $scope.item.subject != undefined ? $scope.item.subject : '',
                    object: object,//$scope.item.object != undefined ? $scope.item.object : '',
                    assesment: assesment,//$scope.item.assesment != undefined ? $scope.item.assesment : '',
                    intruksi: $scope.item.intruksi != undefined ? $scope.item.intruksi : '',
                    plan: plan,//$scope.item.plan != undefined ? $scope.item.plan : '',
                    pemberiasuhan: $scope.item.pemberiasuhan.id,
                    objectjenisdokumenfk : $scope.item.jenisdokumen.id,
                    pegawaipemberiasuhan: $scope.item.pegawaipemberiasuhan.value,
                    tglinput: moment($scope.item.tglpemberi).format('YYYY-MM-DD HH:mm:ss'),
                    status : statusCPPT,
                    nocppt : noCPPT,
                    tranfusi : $scope.item.tranfusi != undefined ? $scope.item.tranfusi : null,
                    // soapjson : JSON.stringify({
                    //     s:[],
                    //     o:[],
                    //     a:CPPTASSESMENT,
                    //     p:CPPTPLAN
                    // })
                }

                medifirstService.post( 'emr/post-cppt-new',objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    if ($scope.item.chkresep) {
                        var confirm = $mdDialog.confirm()
                            .title('Informasi')
                            .textContent('Apakah ingin membuat Resep ?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            $state.go("RekamMedis.InputResepApotikOrderRev");
                        })
                    } 
                    clear()
                    $scope.popUpCPPTDokter.close()
                    init();
                });
            }

            function terima(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                // let pegawaifk=''
                // let tglterima =''
                // let norec_cp =''
                var dataLogin = medifirstService.getPegawaiLogin();
                var objSave = {                
                    pegawaifk : dataLogin.id,
                    tglterima : $scope.now,
                    norec_cp : dataItem.norec,
                    jenis : 'terima'
                }
                medifirstService.post( 'emr/update-cppt-new',objSave).then(function (e) {
                    clear()
                    init();
                });

            }

            function hapuscppt(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                $scope.item.norec = dataItem.norec
                $scope.popUpHapus.center().open()
                console.log(dataItem)
            }

            function ResetPenerima(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var dataLogin = medifirstService.getPegawaiLogin();
                var objSave = {                
                    pegawaifk : dataLogin.namaLengkap,
                    tglreset : $scope.now,
                    norec_cp : dataItem.norec,
                    jenis : 'RPenerima'
                }
                medifirstService.post( 'emr/update-cppt-new',objSave).then(function (e) {
                    clear()
                    init();
                });


            }

            function instruksi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.item.norec = dataItem.norec
                var dataLogin = medifirstService.getPegawaiLogin();
                $scope.item.DPJPinstruksi = { vallue: dataLogin.id, text: dataLogin.namaLengkap }
                $scope.item.tglInstruksi = $scope.now;
                $scope.item.tglcppt = dataItem.tglasesmen;
                $scope.item.instruksi =dataItem.intruksi
                $scope.popUpInstruksi.center().open()
            }

            function clear() {
                delete $scope.item.norec
                delete $scope.item.subject
                delete $scope.item.keterangan
                delete $scope.item.object
                delete $scope.item.assesment
                delete $scope.item.assesmentft
                delete $scope.item.intruksi
                delete $scope.item.plan
                delete $scope.item.planft
                delete $scope.item.pemberiasuhan
                delete $scope.item.pegawaipemberiasuhan
                delete $scope.item.tglpemberi
                delete $scope.item.chkicd9
                delete $scope.item.chkicd10
                delete $scope.item.chkresep
                delete $scope.item.chktranfusi
                delete $scope.item.tranfusi
                delete $scope.item.dpjpkonsulan
                delete $scope.item.PegawaiPenunjang

                TextAreaA = '';
                TextAreaP = '';
                RiwayatA = '';
                RiwayatP = '';
                CPPTASSESMENT = [];
                $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                    data: CPPTASSESMENT
                });
                CPPTPLAN = [];
                $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                    data: CPPTPLAN
                });
            }
            function categoryDropDownEditor(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "jenisJabatan",
                        dataValueField: "id",
                        dataSource: $scope.listJenisJabatan
                    });
            }
            var timeoutPromise;
            $scope.$watch('filter.ruanganAsal', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("objectruanganfk", newVal)
                }
            })
            $scope.$watch('filter.ruanganTujuan', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("objectruangantujuanfk", newVal)
                }
            })
            $scope.$watch('filter.dokter', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("pegawaifk", newVal)
                }
            })

            $scope.$watch('filter.keterangan', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("keteranganorder", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridResume").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter = function () {
                var dataGrid = $("#gridResume").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.filter = {}
            }
            function cetak(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.item.noregistrasifk = dataItem.noregistrasifk
                let tglAwal = moment(dataItem.tglasesmen).format('YYYY-MM-DD 00:00');
                let tglAkhir = moment(dataItem.tglasesmen).format('YYYY-MM-DD 23:59');                
                $scope.item.noregistrasifk = dataItem.noregistrasifk  
                    window.open(config.baseApiBackend + 'report/cetak-cppt-new-tgl?noregistrasi='
                    + $scope.item.noregistrasifk + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir ,  '_blank');
               

            }
            
            $scope.cetakNoreg = function() {
                    window.open(config.baseApiBackend + 'report/cetak-cppt-new?noregistrasi='
                    + $scope.norecPd,  '_blank');
            };
    
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.cari = function () {
                $scope.isRouteLoading = true
                // debugger;
                
                var asuhanId = ''
                if ($scope.item.Pemeberiasuhan != undefined) {
                    asuhanId = $scope.item.Pemeberiasuhan.id
                }
                

                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                // $q.all([
                    medifirstService.get('emr/get-cppt-new?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&asuhanId=' +  asuhanId 
               + '&noregistrasifk=' + $scope.norecPd// $scope.noregistrasi
                    // medifirstService.get( "emr/get-cppt-new?" + paramSearch 
                    )
            //    ])
               .then(function (res) {
                
                       var result = res.data.data
               
                       $scope.isRouteLoading = false
                       $scope.sourceResume = new kendo.data.DataSource({
                           data: result,
                           pageSize: 20,
                       });
           
               }
               )
        
               
            };
            $scope.getlabel2 = function () {
                if ($scope.item.jenisdokumen.nama === "CPPT") { 
                    $scope.item.islabelA = false;
                    $scope.item.islabelP = false;
                    $scope.lblcpptdokterS = "Subjective";
                    $scope.lblcpptdokterO = "Objective";
                    $scope.lblcpptdokterA = "Assesment";
                    $scope.lblcpptdokterP = "Plan";
                } else {  
                    $scope.item.islabelA = true;
                    $scope.item.islabelP = true;
                    $scope.lblcpptdokterS = "Situation";
                    $scope.lblcpptdokterO = "Background";
                    $scope.lblcpptdokterA = "Assessment";
                    $scope.lblcpptdokterP = "Recommendation";
                }
            }

            $scope.getlabel = function () {
            
                var s = document.getElementById("labelS"); 
                var o = document.getElementById("labelO");
                var a = document.getElementById("labelA");
                var p = document.getElementById("labelP");
                  
                // if ($scope.item.jenisdokumen.nama === "SBAR") { 
                //     s.innerHTML = "Situation";
                //     o.innerHTML = "Background"; 
                //     a.innerHTML = "Assessment"; 
                //     p.innerHTML = "Recommendation";  
                // } else { 
                //     s.innerHTML = "Subjective";                     
                //     o.innerHTML = "Objective"; 
                //     a.innerHTML = "Assesment"; 
                //     p.innerHTML = "Planing"; 
                // } 
                if ($scope.item.jenisdokumen.nama === "CPPT") { 
                    s.innerHTML = "Subjective";                     
                    o.innerHTML = "Objective"; 
                    a.innerHTML = "Assesment"; 
                    p.innerHTML = "Planing"; 
                    $scope.showInstruksi = true; 
                    $scope.showDPJP = false;
                    $scope.showPenunjang = false;
                } else if($scope.item.jenisdokumen.nama === "SBAR") {   
                    s.innerHTML = "Situation";
                    o.innerHTML = "Background"; 
                    a.innerHTML = "Assessment"; 
                    p.innerHTML = "Recommendation";
                    $scope.showInstruksi = false;
                    $scope.showDPJP = true;
                    $scope.showPenunjang = false;
                } else {   
                    s.innerHTML = "Situation";
                    o.innerHTML = "Background"; 
                    a.innerHTML = "Assessment"; 
                    p.innerHTML = "Recommendation";
                    $scope.showInstruksi = false;
                    $scope.showDPJP = true;
                    $scope.showPenunjang = true;
                } 
            }

            $scope.columnRiwayatCPPT = {               
                
                columns: [
                    {
                        "field": "tglinput",
                        "title": "Tanggal",
                        "width": "80px",
                     
                    },
                    {
                        "field": "jenispegawai",
                        "title": "Pemberi Asuhan",
                        "width": "90px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Petugas",
                        "width": "80px",
                        
                    },
                    {
                        "field": "s",
                        "title": "Subject",
                        "width": "100px",
                
                    },
                    {
                        "field": "o",
                        "title": "Object",
                        "width": "100px",
                     
                    },
                    {
                        "field": "a",
                        "title": "Asesment",
                        "width": "100px",
                      
                    },
                    {
                        "field": "p",
                        "title": "Plan",
                        "width": "130px"
     
                    },
                    {
                        "field": "intruksi",
                        "title": "Intruksi",
                        "width": "150px",
                     
                    },
                    {
                        "field": "riview",
                        "title": "Riview DPJP",
                        "width": "80px",
                    },
                    
                ]
            };

            function lihatData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                noCPPT = dataItem.nocppt
                
                loadDataRiwayatCPPT();
                $scope.popUpLihat.center().open();
                var actions = $scope.popUpLihat.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpLihat.setOptions({ actions: actions });
                $scope.popUpLihat.center().open()

            };

            function loadDataRiwayatCPPT() {           
                
  
                dataDetail2 = []   
                medifirstService.get("emr/get-cppt-new-nocppt?nocppt=" + noCPPT).then(function (dat) {
                    $scope.isRouteLoading = false;                  
                                    
                    var dRiwayatReg = dat.data.data;
                    if (dRiwayatReg != undefined) {
                        for (var i = dRiwayatReg.length - 1; i >= 0; i--) {
                            dataDetail2.push(dRiwayatReg[i])
                        }
                    }
                  
                    for (var i = 0; i < dataDetail2.length; i++) {
                        dataDetail2[i].no = i + 1                           
                    } 
                    // console.log(dataDetail2);
                    $scope.dataRiwayatCPPT = new kendo.data.DataSource({
                        data: dataDetail2,
                        pageSize: 10,
                        total: dataDetail2.length,
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
            //region lab mikro
            $scope.RiwayatLabmikro = function (){
                $scope.isRouteLoading = true
                medifirstService.get("emr/get-berkas-pasien?noregistrasi=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.dataGridRiwayatLabmikro = new kendo.data.DataSource({
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
                $scope.popUpHasilLabMikro.center().open()
            }
            $scope.columnGridRiwayatLabmikro = {
                selectable: 'row',
                pageable: true,
                columns:
                    [ 
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "10%",
                        },
                        {
                            "field": "tglemr",
                            "title": "Tgl Upload",
                            "width": "10%",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "namafile",
                            "title": "Nama File",
                            "width": "50%",
                        },
                        {
                            "command": [
                                { text: "Lihat", click: LihatBerkas },
                                // { text: "Hapus", click: HapusBerkas }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }
            function LihatBerkas(e){
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
            $scope.RiwayatLabpk = function () {
                $scope.popUpRiwayatLabpk.center().open();
            }
            $scope.RiwayatLabpa = function () {
                $scope.popUpRiwayatLabpa.center().open();
            }
            //region Get Riwayat Radiologi
            $scope.RiwayatRad = function () {
                medifirstService.get('emr/get-riwayat-order-radiologi?noregistrasi=' + $scope.noregistrasi).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }

                    for (var i = 0; i < e.data.daftar.length; i++) {
                        let details = e.data.daftar[i].details;
                        let risorder = e.data.daftar[i].risorder;
                        for (let yy = 0; yy < details.length; yy++) {
                            for (let zz = 0; zz < risorder.length; zz++) {
                                if (details[yy].norecopfk === risorder[zz].norec_op_fk) {
                                    e.data.daftar[i].details[yy].radiologiId = risorder[zz].patient_id + '-' + risorder[zz].order_cnt
                                }
                            }
                        }
                    }

                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
                $scope.popUpHasilRad.center().open()
            }
            //region Get Hasil Lab PK & PA
            // medifirstService.get("emr/get-hasil-lab?noregistrasi=" + $scope.noregistrasi).then(function (data) {
            //     var datas = data.data;
            //     $scope.dataGridRiwayatLabpk = new kendo.data.DataSource({
            //       data: datas.labpk,
            //     });
            //     $scope.dataGridRiwayatLabpa = new kendo.data.DataSource({
            //         data: datas.labpa,
            //     });
            // });
            //region Tabel Lab PK
            $scope.columnGridRiwayatLabpk = {
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClickRiwayatLabpk($event)' />",
                        "width": 40
                    },
                    { field: "test_nm", title: "Nama Tindakan", width: 170 },
                    { field: "result_value", title: "Hasil", width: 50 },
                    { field: "ref_range", title: "Range", width: 70 },
                    { field: "request_dt", title: "Tgl Periksa", width: 70 },
                ],
            };
            //region Tabel Lab PA
            $scope.columnGridRiwayatLanpa = {
                selectable: "row",
                pageable: true,
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClickRiwayatLabpa($event)' />",
                        "width": 40
                    },
                    { field: "jenis", title: "Jenis", width: 250 },
                    { field: "kesimpulan", title: "Kesimpulan", width: 250 },
                    { field: "makroskopik", title: "Makroskopik", width: 250 },
                    { field: "mikroskopik", title: "Mikroskopik", width: 250 },
                    { field: "tglvalidation", title: "Tgl Validasi", width: 250 },
                ],
            };
            //region Tabel Radiologi
            $scope.columnGridRiwayat = [
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                    "width": "70px",
                }
            ];

            $scope.detailGridOptions = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                    if (dataItem.details[i].pathhasilbridging != null && dataItem.details[i].pathhasilbridging != undefined && dataItem.details[i].pathhasilbridging != '') {
                        dataItem.details[i].expertise = "✔";
                        // ✅
                        // ✔ expertise
                    } else {
                        dataItem.details[i].expertise = "✘";
                        // ✘
                        // ❎
                    }

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "expertise",
                            title: "Expertise",
                            width: "100px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        },
                        {
                            "command": [{
                                text: "Expertise",
                                click: experTise2,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: "Lihat Hasil",
                                click: hasilRadPhilip,
                                imageClass: "k-icon k-i-download"
                            }
                            ],
                            title: "",
                            width: "150px",
                        }]
                };
            };

            function experTise2(e) {
                e.preventDefault();

                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);

                if (dataItem.expertise === "✘") {
                    toastr.error('Belum ada Expertise!', 'Peringatan')
                } else {
                    var UrlBackend = config.baseApiBackend.replace('service/medifirst2000/', 'service/')
                    window.open(UrlBackend + dataItem.pathhasilbridging, "_blank");
                }
            }
            var hasilRadPhilip = function (e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);

                if (dataItem.accession_num === dataItem.noorder) {
                    toastr.warning('Hasil belum ada', 'Peringatan')
                } else {
                    window.open(UrlViewerPACS + dataItem.accession_num, "_blank");
                }
            };

            //region onclick
            $scope.onClickRiwayatLabpk = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridPK").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
        
                if (checked) {
                    if($scope.item.object == undefined || $scope.item.object == '') {
                        $scope.item.object = dataItem.test_nm + "(" + dataItem.result_value + ")"
                    } else {
                        $scope.item.object = $scope.item.object + ", " + dataItem.test_nm + "(" + dataItem.result_value + ")"
                    }
                    row.addClass("k-state-selected");
                } 
            }

        }
    ]);
});