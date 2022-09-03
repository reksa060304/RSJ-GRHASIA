define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarPasienPsikologiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.itemKraepelin = {}
            $scope.itemIST = {}

            $scope.nomorIST = ""
            $scope.nomorcfit = ""
            $scope.nomorKreapelin
            $scope.getNorma = 0
            $scope.totalSkor = 0
            $scope.totalSkorB = 0
            $scope.jumlah = 0;
            $scope.avdev = 0;
            $scope.mean = 0;
            $scope.salkos = 0;
            $scope.hanker = 0;
            $scope.salah = 0;
            $scope.skip = 0;
            $scope.itemIST.nilai = 0;
            //norma ist
            $scope.itemIST.se = 0
            $scope.itemIST.wa = 0
            $scope.itemIST.an = 0
            $scope.itemIST.ge = 0
            $scope.itemIST.me = 0
            $scope.itemIST.ra = 0
            $scope.itemIST.zr = 0
            $scope.itemIST.fa = 0
            $scope.itemIST.wu = 0
            var nilaiD = 0
            // $scope.item.idNormaPsikologi = null;
            $scope.now = new Date();
            var dataPsikologi = [];
            var dataKraepelin = [];
            var dataHasilKraepelin = [];
            var dataIST = [];
            var kunJawIST = []
            var dataNormaIST = []
            var dataBuatHasilIST = []
            var norec = "";
            var norecKraepelin = "";
            var norecIST = "";
            var norecISTDetail = "";
            
            $scope.item.periodeAwal = moment($scope.now).format("YYYY-MM-DD 00:00:00")
            $scope.item.periodeAkhir = moment($scope.now).format("YYYY-MM-DD 23:59:59")
            var cacheDataPsikologi = cacheHelper.get('DaftarPasienPsikologiCtrl');
            if (cacheDataPsikologi != undefined) {
                $scope.item.periodeAwal = moment(cacheDataPsikologi[0]).format('YYYY-MM-DD 00:00:00')
                $scope.item.periodeAkhir = moment(cacheDataPsikologi[1]).format('YYYY-MM-DD 23:59:59')
                if (cacheDataPsikologi[2] != "") {
                    $scope.item.noregistrasi = cacheDataPsikologi[2]
                }
            }
            loadCombo()
            getLoadData()
            $scope.SearchData = function(){
                getLoadData()
            }
            function loadCombo() {
                $scope.listPendidikan = [
                    {
                        id: 1,
                        pendidikan: "SMA IPS"
                    },
                    {
                        id: 2,
                        pendidikan: "SMA IPA"
                    },
                    {
                        id: 3,
                        pendidikan: "D3 IPS"
                    },
                    {
                        id: 4,
                        pendidikan: "D3 IPA"
                    },
                    {
                        id: 5,
                        pendidikan: "SARJANA IPS"
                    },
                    {
                        id: 6,
                        pendidikan: "SARJANA IPA"
                    }
                ]
                $scope.listCfit = [{
                    idcfit: 1,
                    cfit: "A"
                }, {
                    idcfit: 2,
                    cfit: "B"
                }]

                $scope.listTest = [{
                        idtest: 1,
                        test: "Test 1"
                    },
                    {
                        idtest: 2,
                        test: "Test 2"
                    },
                    {
                        idtest: 3,
                        test: "Test 3"
                    },
                    {
                        idtest: 4,
                        test: "Test 4"
                    }
                ]
                medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                    $scope.listRuanganBatal = data.data.ruanganall;
                    $scope.item.PegawaiLogin = data.data.pegawaiLogin;
                    // $scope.listRuanganApd = data.data.ruanganall;
                    $scope.listPembatalan = data.data.pembatalan;
                    $scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
                    $scope.item.jenisDiagnosis = {
                        id: data.data.jenisdiagnosa[1].id,
                        jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa
                    };
                    $scope.listJenisPel = data.data.jenispelayanan;
                    $scope.listJenislabel = [{
                        id: 1,
                        jenislabel: "Label Besar"
                    }, {
                        id: 2,
                        jenislabel: "Label Kecil"
                    }];
                });

                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
                    $scope.listDataPegawai = e;
                })
                medifirstService.get('psikologi/kunci-jawaban-ist').then(function (data) {
                    kunJawIST = data.data.data

                    
                })
            }
            $scope.cfit = function () {
                $scope.item.nomor = 1
            }
            $scope.test = function () {
                $scope.item.nomor = 1
            }
            $scope.klikGridd = function(dataDaftarHasil){
                $scope.nomorcfit = dataDaftarHasil.nomor
                norec = dataDaftarHasil.norec
                if (dataDaftarHasil.cfit == 'A'){
                    $scope.item.cfit = {
                        idcfit: 1,
                        cfit: 'A'
                    }
                } else if (dataDaftarHasil.cfit == 'B' ){
                    $scope.item.cfit = {
                        idcfit: 2,
                        cfit: 'B'
                    }
                }

                if(dataDaftarHasil.test == 'Test 1'){
                    $scope.item.test ={
                        idtest:1,
                        test: 'Test 1' 
                    }
                } else if (dataDaftarHasil.test == 'Test 2') {
                    $scope.item.test = {
                        idtest: 2,
                        test: 'Test 2'
                    }
                } else if (dataDaftarHasil.test == 'Test 3') {
                    $scope.item.test = {
                        idtest: 3,
                        test: 'Test 3'
                    }
                } else if (dataDaftarHasil.test == 'Test 4') {
                    $scope.item.test = {
                        idtest: 4,
                        test: 'Test 4'
                    }
                }
                $scope.item.nomor = dataDaftarHasil.nomor
                $scope.item.jawaban = dataDaftarHasil.jawaban
                console.log(dataDaftarHasil);
            } 
            $scope.jawaban = function () {
                console.log($scope.item.test.test);
                if($scope.item.test.test == 'Test 1' && $scope.item.nomor > 13){
                    toastr.error('NOMOR Test 1 MAX')
                    return
                } 
                if ($scope.item.test.test == 'Test 2' && $scope.item.nomor > 14) {
                    toastr.error('NOMOR Test 2 MAX')
                    return
                }
                if ($scope.item.test.test == 'Test 3' && $scope.item.nomor > 13) {
                    toastr.error('NOMOR Test 3 MAX')
                    return
                }
                if ($scope.item.test.test == 'Test 4' && $scope.item.nomor > 10) {
                    toastr.error('NOMOR Test 4 MAX')
                    return
                }
                

                var data = {};

                var kuncijawaban = $scope.kuncijawaban
                for (let i = 0; i < kuncijawaban.length; i++) {
                    if (kuncijawaban[i].nomor == $scope.item.nomor &&
                        kuncijawaban[i].kuncijawaban == $scope.item.jawaban.toUpperCase() &&
                        kuncijawaban[i].test == $scope.item.test.test) {
                        // if ($scope.item.cfit.cfit == 'A') {
                        //     $scope.totalSkor = $scope.totalSkor + 1
                        // } else if ($scope.item.cfit.cfit == 'B') {
                        //     $scope.totalSkorB = $scope.totalSkorB + 1
                        // }
                        $scope.nilai = 1
                        break;
                    } else {
                        $scope.nilai = 0
                    }
                }
                if($scope.nomorcfit != ""){
                    for( var i = dataPsikologi.length - 1; i>=0; i-- ){
                        if(dataPsikologi[i].nomor == $scope.item.nomor){
                            data.norec = norec 
                            data.norec_apd = $scope.dataDaftarPsikologi.norec
                            data.nomor = $scope.item.nomor
                            data.jawaban = $scope.item.jawaban
                            data.cfit = $scope.item.cfit.cfit
                            data.idcfit= $scope.item.cfit.idcfit;
                            data.test= $scope.item.test.test
                            data.idtest= $scope.item.test.idtest
                            data.nilai= $scope.nilai
                            if (data.cfit == 'A') {
                                if (data.nilai == dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);
                                    $scope.totalSkor = $scope.totalSkor
                                } else if (data.nilai > dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);

                                    $scope.totalSkor += data.nilai 
                                } else if (data.nilai < dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);

                                    $scope.totalSkor += data.nilai - 1
                                }
                            } else if (data.cfit == 'B') {
                                if (data.nilai == dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);
                                    $scope.totalSkor = $scope.totalSkor
                                } else if (data.nilai > dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);

                                    $scope.totalSkor += data.nilai
                                } else if (data.nilai < dataPsikologi[i].nilai) {
                                    console.log(data.nilai, dataPsikologi[i].nilai);

                                    $scope.totalSkor += data.nilai - 1
                                }
                            }

                            dataPsikologi[i] = data

                            $scope.gridDaftarHasil = new kendo.data.DataSource({
                                data: dataPsikologi,
                                pageSize: 50,
                                total: dataPsikologi.length,
                                // serverPaging: true,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                            
                            
                        }
                    }
                    $scope.item.nomor = undefined
                    $scope.item.jawaban = undefined
                    $scope.nomorcfit = ""
                }else{
                    for (let i = 0; i < dataPsikologi.length; i++) {
                        // const element = dataPsikologi[i];
                        if (dataPsikologi[i].nomor == $scope.item.nomor &&
                            dataPsikologi[i].jawaban == $scope.item.jawaban &&
                            dataPsikologi[i].test == $scope.item.test.test &&
                            dataPsikologi[i].cfit == $scope.item.cfit.cfit) {
                            toastr.error('Jawaban Sudah Pernah diisi')
                            return
                        }
                    }
                    data = {
                        norec: norec,
                        norec_apd: $scope.dataDaftarPsikologi.norec,
                        nomor: $scope.item.nomor,
                        jawaban: $scope.item.jawaban,
                        cfit: $scope.item.cfit.cfit,
                        idcfit: $scope.item.cfit.idcfit,
                        test: $scope.item.test.test,
                        idtest: $scope.item.test.idtest,
                        nilai: $scope.nilai
                    }
                    dataPsikologi.push(data)
                    $scope.gridDaftarHasil = new kendo.data.DataSource({
                        data: dataPsikologi,
                        pageSize: 50,
                        total: dataPsikologi.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    if(data.cfit == 'A'){
                        $scope.totalSkor += data.nilai
                    } else if (data.cfit == 'B') {
                        $scope.totalSkorB += data.nilai
                    }
                    $scope.item.nomor = $scope.item.nomor + 1
                    $scope.item.jawaban = undefined
                }
                
                
            }
            
            
            function getLoadData() {
                
                // var tglawal = ""
                // var tglakhir = ""
                var noregistrasi = ""
                var tglawal = moment($scope.item.periodeAwal).format("YYYY-MM-DD 00:00:00")
                var tglakhir = moment($scope.item.periodeAkhir).format("YYYY-MM-DD 23:59:59")
                if ($scope.item.noregistrasi != undefined && $scope.item.noregistrasi != "") {
                    noregistrasi = "&noregistrasi=" + $scope.item.noregistrasi
                }
                
                console.log(cacheDataPsikologi);
                medifirstService.get('psikologi/get-daftar-pasien-psikologi?tglawal=' + tglawal + "&tglakhir=" + tglakhir + noregistrasi).then(function (data) {
                    var datas = data.data
                    // $scope.listJenisNorma = datas.jenisnorma
                    $scope.gridDaftarPsikologi = new kendo.data.DataSource({
                        data: datas.data,
                        pageSize: 10,
                        total: datas.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    for (let i = 0; i < datas.data.length; i++) {
                        // const element = datas[i];
                        datas.data[i].no = i + 1
                    }
                    var cachePsikologi = {
                        0:$scope.item.periodeAwal,
                        1:$scope.item.periodeAkhir,
                        2:$scope.item.noregistrasi
                    }
                    cacheHelper.set('DaftarPasienPsikologiCtrl', cachePsikologi)
                })
            }

            $scope.opsiGridDaftarPsikologi = {
                sortable: true,
                filterable: false,
                pageable: true,
				selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "5%"
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Tgl Masuk",
                        "width": "60px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "NoReg",
                        "width": "60px"
                    },
                    {
                        "field": "nocm",
                        "title": "NoRM",
                        "width": "50px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "70px"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "50px"
                    },
                    {
                        "field": "tglkeluar",
                        "title": "Tgl Pulang",
                        "width": "60px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "60px"
                    },
                ]
            }

            $scope.klikGrid = function (dataNormaPsikologi) {
                console.log(dataNormaPsikologi);
            }
            $scope.simpanNormaPsikologi = function () {
                var objSave = {
                    'id': $scope.item.idNormaPsikologi,
                    'objectjenisnormafk': $scope.item.jenisnorma.id,
                    'umurmin': $scope.item.umurmin,
                    'umurmax': $scope.item.umurmax,
                    'nilai': $scope.item.nilai,
                }
                console.log(objSave);
                // return

                medifirstService.post('psikologi/save-master-norma-psikologi', objSave).then(function (data) {
                    getLoadData()
                    $scope.item = {}
                    $scope.item.idNormaPsikologi = null;
                    $scope.popUpDataNormaPsikologi.close()
                })
            }
            $scope.batalNormaPsikologi = function () {
                $scope.item = {}
                $scope.popUpDataDaftarPsikologi.close()
                // $scope.item.idNormaPsikologi = ""
            }
            $scope.inputHasilPsikologi = function () {
                if ($scope.dataDaftarPsikologi == undefined) {
                    toastr.error('Data Belum dipilih')
                    return
                }
                $scope.tgllahir = $scope.dataDaftarPsikologi.tgllahir
                $scope.tglmasuk = $scope.dataDaftarPsikologi.tglmasuk

                // $scope.item.nomor = 1;
                var date = dateHelper.CountAge(new Date($scope.tgllahir), new Date($scope.tglmasuk))
                var umuryear = date.year,
                    umurmonth = date.month
                $scope.item.umur = umuryear + " Thn " + umurmonth + " Bln"
                loadHasilCFIT()
                loadKunciJawaban()
                $scope.totalSkor = 0
                $scope.popUpDataDaftarPsikologi.center().open()
            }

			$scope.inputEPPS = function(){
                $scope.changePage("EPPSpsikologi");
            }

            $scope.changePage = function (stateName) {
                console.log($scope.dataDaftarPsikologi)
                if ($scope.dataDaftarPsikologi == undefined) {
                    toastr.error('Data Belum dipilih')
                    return
                }
				var obj = {
                    noRegistrasi: $scope.dataDaftarPsikologi.noregistrasi,
                    nocm: $scope.dataDaftarPsikologi.nocm,
                    norec_apd: $scope.dataDaftarPsikologi.norec,
                }

                

                    var arrStr = {
                        0: $scope.dataDaftarPsikologi.noregistrasi,
                        1: $scope.dataDaftarPsikologi.nocm,
                        2: $scope.dataDaftarPsikologi.norec,
                        3: $scope.dataDaftarPsikologi.objectjeniskelaminfk,
                        4: $scope.dataDaftarPsikologi.namapasien,
                        5: $scope.dataDaftarPsikologi.tgllahir,
                        6: $scope.dataDaftarPsikologi.umur,
                    }
                    cacheHelper.set('EPPSpsikologiCtrl', arrStr);
        
                  $state.go(stateName, {
                    dataPasien: JSON.stringify(obj)

                  
                })
            }
            
 			$scope.simpanPsikologi = function () {
                var objSave = {
                    datapsikologi: dataPsikologi
                }
                // return
                medifirstService.post('psikologi/save-hasil-psikologi', objSave).then(function (data) {
                    // loadHasilCFIT()
                    medifirstService.get('psikologi/get-hasil-cfit-detail?norec_apd=' + $scope.dataDaftarPsikologi.norec).then(function (data) {
                        dataPsikologi = data.data.data
                        
                        $scope.gridDaftarHasil = new kendo.data.DataSource({
                            data: dataPsikologi,
                            pageSize: 50,
                            total: dataPsikologi.length,
                            // serverPaging: true,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    })
                })
            }

            function loadKunciJawaban() {
                medifirstService.get('psikologi/kunci-jawaban-cfit').then(function (data) {
                    $scope.kuncijawaban = data.data.data
                })
            }
                
            function loadHasilCFIT() {
                medifirstService.get('psikologi/get-hasil-cfit-detail?norec_apd=' + $scope.dataDaftarPsikologi.norec).then(function (data) {
                    dataPsikologi = data.data.data
                    for (let i = 0; i < dataPsikologi.length; i++) {
                        if (dataPsikologi[i].cfit == 'A') {
                            $scope.totalSkor = $scope.totalSkor + dataPsikologi[i].nilai
						}
						if (dataPsikologi[i].cfit == 'B') {
                            $scope.totalSkorB = $scope.totalSkorB + dataPsikologi[i].nilai
                        }
                        // if(dataPsikologi[i].test == 'Test 1'){
                        //     $scope.item.test = {

                        //     }
                        // }
                    }

                    $scope.gridDaftarHasil = new kendo.data.DataSource({
                        data: dataPsikologi,
                        pageSize: 50,
                        total: dataPsikologi.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }

            $scope.dataDaftarHasil = {
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "nomor",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "jawaban",
                        "title": "Jawaban",
                        "width": "40px"
                    },
                    {
                        "field": "cfit",
                        "title": "CFIT",
                        "width": "50px"
                    },
                    {
                        "field": "test",
                        "title": "Test",
                        "width": "50px"
                    },
                    {
                        "field": "nilai",
                        "title": "Nilai",
                        "width": "50px"
                    },
                    {
                        'command': [{
                                text: "Hapus",
                                click: HapusDetail,
                                imageClass: "k-icon k-i-delete",

                            },

                        ],
                        width: "100px"
                    }

                ]
            }

            function HapusDetail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.cfit == 'A') {
                    if (dataItem.nilai == 1) {
                        console.log('masuk nilai nihh');
                        $scope.totalSkor = $scope.totalSkor - 1
                }
                } else if (dataItem.cfit == 'B') {
                    if (dataItem.nilai == 1) {
                        $scope.totalSkorB = $scope.totalSkorB - 1
                    }
                }
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                for (var i = dataPsikologi.length - 1; i >= 0; i--) {
                    if (dataPsikologi[i].nomor == dataItem.nomor) {
                        dataPsikologi.splice(i, 1);
                    }
                }
                $scope.item = {}
                if (dataItem.norec == "") {
                    grid.removeRow(row);
                } else {
                    var objSave = {
                        norecs: dataItem.norec,
                        delete: true,
                        datapsikologi: [],
                        data: []
                    }
                   
                    medifirstService.post('psikologi/save-hasil-psikologi', objSave).then(function () {
                        loadHasilCFIT()
                    })
                }
            }
            $scope.getNormaSkala = function () {
                var date = dateHelper.CountAge(new Date($scope.tgllahir), new Date($scope.tglmasuk))
                var umuryear = date.year,
                    umurmonth = date.month
                var umurmin = 0;
                var umurmax = 0;
                console.log(date);
                console.log(umuryear);
                if (umuryear == 13) {
                    if (umurmonth >= 0 && umurmonth <= 4) {
                        umurmin = 13;
                        umurmax = 13.4;
                        console.log(umuryear + "," + umurmonth);
                    } else if (umurmonth >= 5 && umurmonth <= 12) {
                        umurmin = 13.5;
                        umurmax = 13.11;
                        console.log(umuryear + "," + umurmonth);
                    }
                } else if (umuryear == 14) {
                    if (umurmonth >= 0 && umurmonth <= 12) {
                        umurmin = 14;
                        umurmax = 14.11;
                        console.log(umuryear + "," + umurmonth);
                    }
                } else if (umuryear == 15) {
                    if (umurmonth >= 0 && umurmonth <= 12) {
                        umurmin = 15;
                        umurmax = 15.11;
                        console.log(umuryear + "," + umurmonth);
                    }
                } else if (umuryear == 16) {
                    if (umurmonth >= 0 && umurmonth <= 12) {
                        umurmin = 16;
                        umurmax = 16.11;
                        console.log(umuryear + "," + umurmonth);
                    }
                } else if (umuryear >= 17) {
                    umurmin = 17
                    umurmax = null
                    console.log(umuryear);
                }

                var rawscores = Math.round(($scope.totalSkor + $scope.totalSkorB) / 2)
                console.log(rawscores);

                medifirstService.get('psikologi/get-norma-skala?umurmin=' + umurmin + '&umurmax=' + umurmax + '&rawscores=' + rawscores).then(function (data) {
                    var datas = data.data.data[0].iq
                    // console.log(datas);
                    $scope.normaSkala = datas

                    var norec = {
                        norec: $scope.dataDaftarPsikologi.norec,
                        skoriq: $scope.normaSkala
                    }
                    if ($scope.normaSkala >= 170) {
                        $scope.kategoriSkala = 'Genius'
                    } else if ($scope.normaSkala >= 140 && $scope.normaSkala <= 169) {
                        $scope.kategoriSkala = 'Very Superior'
                    } else if ($scope.normaSkala >= 120 && $scope.normaSkala <= 139) {
                        $scope.kategoriSkala = 'Superior'
                    } else if ($scope.normaSkala >= 110 && $scope.normaSkala <= 119) {
                        $scope.kategoriSkala = 'High Average'
                    } else if ($scope.normaSkala >= 90 && $scope.normaSkala <= 109) {
                        $scope.kategoriSkala = 'Average'
                    } else if ($scope.normaSkala >= 80 && $scope.normaSkala <= 89) {
                        $scope.kategoriSkala = 'Low Average'
                    } else if ($scope.normaSkala >= 70 && $scope.normaSkala <= 79) {
                        $scope.kategoriSkala = 'Boderline Mental Retardation'
                    } else if ($scope.normaSkala >= 50 && $scope.normaSkala <= 69) {
                        $scope.kategoriSkala = 'Mild Mental Retardation'
                    } else if ($scope.normaSkala >= 36 && $scope.normaSkala <= 49) {
                        $scope.kategoriSkala = 'Moderate Mental Retardation'
                    } else if ($scope.normaSkala >= 20 && $scope.normaSkala <= 35) {
                        $scope.kategoriSkala = 'Severe Mental Retardation'
                    } else if ($scope.normaSkala <= 19) {
                        $scope.kategoriSkala = 'Profound Mental Retardation'
                    }
                    medifirstService.post('psikologi/kirim-iq-norma-skala', norec).then(function () {
                    })
                })
            }
            $scope.batalPsikologi = function () {
                $scope.totalSkor = 0;
                $scope.totalSkorB = 0;
                $scope.normaSkala = 0;
                $scope.item = {}
                $scope.popUpDataDaftarPsikologi.close()
            }
            $scope.inputKraepelin = function(){
                if ($scope.dataDaftarPsikologi == undefined) {
                    toastr.error("data Belum dipilih")
                    return
                }
                getDataKraepelin()
                $scope.popUpKraepelin.center().open()
            }
            $scope.opsiGridKraepelin = {
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "lajur",
                        "title": "Lajur",
                        "width": "30px"
                    },
                    {
                        "field": "nilai",
                        "title": "Nilai",
                        "width": "40px"
                    },
                    {
                        'command': [{
                                text: "Hapus",
                                click: HapusDetailLajur,
                                imageClass: "k-icon k-i-delete",

                            },

                        ],
                        width: "100px"
                    }
                    
                ]

            }
            $scope.nilai = function(){
                
                
                var data = {};
                if($scope.nomorKreapelin != ""){
                    for( var i = dataKraepelin.length - 1; i>=0; i-- ){
                        if(dataKraepelin[i].lajur == $scope.itemKraepelin.lajur){
                            data.norec = norecKraepelin
                            data.norec_apd = $scope.dataDaftarPsikologi.norec
                            data.lajur = $scope.itemKraepelin.lajur
                            data.nilai = $scope.itemKraepelin.nilai
                            dataKraepelin[i]= data
                            $scope.gridKraepelin = new kendo.data.DataSource({
                                data: dataKraepelin,
                                pageSize: 50,
                                total: dataKraepelin.length,
                                // serverPaging: true,
                                schema: {
                                    model: {
                                        fields: {}
                                    }
                                }
                            });
                        }
                    }
                }else{
                    for (let i = 0; i < dataKraepelin.length; i++) {
                        if (dataKraepelin[i].lajur == $scope.itemKraepelin.lajur) {
                            toastr.error('tidak bisa ditambah')
                            return
                        }
                        if (dataKraepelin[i].lajur > 49) {
                            toastr.error('Lajur Max')
                            // $scope.itemKraepelin.lajur= undefined
                            // $scope.itemKraepelin.nilai = undefined
                            return
                        }
                    }
                    data = {
                        norec: norecKraepelin,
                        norec_apd: $scope.dataDaftarPsikologi.norec,
                        lajur: $scope.itemKraepelin.lajur,
                        nilai: $scope.itemKraepelin.nilai
                    }
                    dataKraepelin.push(data)
                    $scope.gridKraepelin = new kendo.data.DataSource({
                        data: dataKraepelin,
                        pageSize: 50,
                        total: dataKraepelin.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.itemKraepelin.lajur = $scope.itemKraepelin.lajur + 1
                    $scope.itemKraepelin.nilai = undefined
                }
                
            }
            $scope.klikGridKraepelin = function (dataKraepelinSelected) {
                console.log(dataKraepelinSelected);
                norecKraepelin = dataKraepelinSelected.norec
                $scope.nomorKreapelin = dataKraepelinSelected.lajur
                $scope.itemKraepelin.lajur = dataKraepelinSelected.lajur
                $scope.itemKraepelin.nilai = dataKraepelinSelected.nilai
            }
            $scope.batalKraepelin = function(){
                $scope.itemKraepelin = {}
                $("#KgridKraepelin").data("kendoGrid").dataSource.data([]);
                $("#KgridHasilKraeplin").data("kendoGrid").dataSource.data([]);
                $scope.popUpKraepelin.close()
            }
            $scope.simpanKraepelin = function(){
                console.log(dataKraepelin);
                var objSave = {
                    data: dataKraepelin
                }
                medifirstService.post('psikologi/save-kraepelin', objSave).then(function(data){
                    getDataKraepelin()
                })
            }
            function getDataKraepelin(){
                $scope.jumlah=0
                medifirstService.get('psikologi/get-data-kraepelin?norec_apd='+ $scope.dataDaftarPsikologi.norec).then(function(data){
                    var datas = data.data.data
                    var datas2 = data.data.data2
                    dataKraepelin = datas
                    // dataHasilKraepelin = datas2
                    for (let i = 0; i < dataKraepelin.length; i++) {
                        // const element = datas[i];
                    $scope.jumlah = $scope.jumlah+ dataKraepelin[i].nilai
                    }
                    $scope.gridKraepelin = new kendo.data.DataSource({
                        data: dataKraepelin,
                        pageSize: 50,
                        total: dataKraepelin.length,
                        // serverPaging: true,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    // $scope.gridNormaKraepelin = new kendo.data.DataSource({
                    //     data: dataHasilKraepelin,
                    //     pageSize: 50,
                    //     total: dataHasilKraepelin.length,
                    //     // serverPaging: true,
                    //     schema: {
                    //         model: {
                    //             fields: {}
                    //         }
                    //     }
                    // });
                })
            }
            $scope.getNilaiKraepelin = function(){
                $scope.mean = ($scope.jumlah / 50).toFixed(3);
                var data = {}
                var process1 = []
                $scope.process = 0
                //nyari adouse
                $scope.x = 0
                $scope.y = 0
                $scope.xy = 0
                $scope.x2 = 0
                for (let i = 0; i < dataKraepelin.length; i++) {
                    data = {
                        input: dataKraepelin[i].nilai - $scope.mean
                    }
                    if(data.input < 0){
                        data.input = (data.input * -1)
                    }
                    process1.push(data)
                    $scope.process = $scope.process + process1[i].input 
                    $scope.x += dataKraepelin[i].lajur
                    $scope.y += dataKraepelin[i].nilai
                    $scope.xy += dataKraepelin[i].lajur * dataKraepelin[i].nilai
                    $scope.x2 += dataKraepelin[i].lajur * dataKraepelin[i].lajur
                }
                $scope.sxx = $scope.x2-($scope.x*$scope.x)/50
                $scope.sxy = $scope.xy-($scope.x*$scope.y)/50
                $scope.b1 = $scope.sxy / $scope.sxx
                $scope.a = $scope.mean-($scope.b1-25*5)
                $scope.x50 = $scope.a+($scope.b1*50)
                $scope.x0 = $scope.a
                $scope.hanker = ($scope.x50 - $scope.x0).toFixed(3)
                // console.log($scope.x, $scope.y, $scope.xy, $scope.x2, $scope.sxx, $scope.sxy, $scope.b1);
                $scope.avdev = ($scope.process / 50).toFixed(3)
                $scope.salkos = $scope.salah + $scope.skip
                hasilKrapealin()
            }
            function hasilKrapealin(){
                medifirstService.get('psikologi/get-norma-kraepelin?pendidikan='+ $scope.item.pendidikan.id + 
                '&panker=' + $scope.mean + '&janker=' + $scope.avdev + '&hanker=' + $scope.hanker +
                '&tianker=' + $scope.salkos).then(function (data) {
                    var datas = data.data.data
                    dataHasilKraepelin.push(datas)
                    $scope.gridNormaKraepelin = new kendo.data.DataSource({
                        data: datas
                    })
                })
            }
            $scope.opsiGridNormaKraepelin = {
                columns: [
                    {
                        "title": "Norma",
                        "columns": [
                            {
                                "field": "kompetensi",
                                "title": "Kompetensi",
                                "width": "70px"
                            }
                        ]
                    },
                    {
                        "title": "Pendidikan",
                        "columns": [
                            {
                                "field": "pengertian",
                                "title": "Pengertian",
                                "width": "80px"
                            },
                        ]
                    },
                    {
                        "field": "skor",
                        "title": "Skor",
                        "width": "40px"
                        
                    },
                    {
                        "title": "Hasil",
                        "columns": [
                            {
                                "title": "KS",
                                "width": "25px",
                                "template": "#: hasil == 'KS'? '✘' : ''#"
                            },
                            {
                                "title": "K",
                                "width": "25px",
                                "template": "#: hasil == 'K'? '✘' : ''#"
                            },
                            {
                                "title": "S",
                                "width": "25px",
                                "template": "#: hasil == 'S'? '✘' : ''#"
                            },
                            {
                                "title": "B",
                                "width": "25px",
                                "template": "#: hasil == 'B'? '✘' : ''#"
                            },
                            {
                                "title": "BS",
                                "width": "25px",
                                "template": "#: hasil == 'BS'? '✘' : ''#"
                            },
                        ]
                    },
                ]
            }
            $scope.simpanHasilKraepelin = function(){
                var objSave = {
                    norec: "",
                    data: dataHasilKraepelin[0],
                    norec_apd: $scope.dataDaftarPsikologi.norec
                }
                console.log(dataHasilKraepelin);
                // return
                medifirstService.post('psikologi/save-hasil-kraepelin', objSave).then(function(){
                    // getDataKraepelin()
                    hasilKrapealin()
                })
            }

            function HapusDetailLajur(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                for (var i = dataKraepelin.length - 1; i >= 0; i--) {
                    if (dataKraepelin[i].lajur == dataItem.lajur) {
                        dataKraepelin.splice(i, 1);
                    }
                }
                $scope.itemKraepelin = {}
                if (dataItem.norec == "") {
                    grid.removeRow(row);
                } else {
                    var objSave = {
                        norec: dataItem.norec,
                        delete: true,
                        data: []
                    }
                    medifirstService.post('psikologi/save-kraepelin', objSave).then(function () {
                        getDataKraepelin()
                        $scope.jumlah = 0
                    })
                }
            }

            $scope.inputIST = function(){
                if($scope.dataDaftarPsikologi == undefined){
                    toastr.error('Data Belum Dipilih')
                    return
                }
                getDataIST()
                $scope.tgllahir = $scope.dataDaftarPsikologi.tgllahir
                $scope.tglmasuk = $scope.dataDaftarPsikologi.tglmasuk

                $scope.itemIST.nomor = 1;
                if ($scope.itemIST.nomor >= 1 && $scope.itemIST.nomor <= 20) {
                    $scope.itemIST.test = "SE"
                } else if ($scope.itemIST.nomor >= 21 && $scope.itemIST.nomor <= 40) {
                    $scope.itemIST.test = "WA"
                }
                var date = dateHelper.CountAge(new Date($scope.tgllahir), new Date($scope.tglmasuk))
                var umuryear = date.year,
                    umurmonth = date.month
                $scope.itemIST.umurIST = umuryear
                $scope.popUpIST.center().open()
            }
            $scope.gridIST = {
                columns: [
                    {
                        "field": "nomor",
                        "title": "No"
                    },
                    {
                        "field": "jawaban",
                        "title": "Jawaban"
                    },
                    {
                        "field": "test",
                        "title": ""
                    },
                    {
                        "field": "nilai",
                        "title": "Nilai"
                    },
                    {
                        // "field": "nilai",
                        "title": "Simpan Data",
                        "template": "#: norec == '' ? 'Belum': 'Sudah'#"
                    },
                    {
                        'command': [{
                                text: "Hapus",
                                click: HapusIST,
                                imageClass: "k-icon k-i-delete",

                            },

                        ],
                        width: "100px"
                    }

                ]
            }
            function HapusIST(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.cfit == 'A') {
                    if (dataItem.nilai == 1) {
                        console.log('masuk nilai nihh');
                        $scope.totalSkor = $scope.totalSkor - 1
                    }
                } else if (dataItem.cfit == 'B') {
                    if (dataItem.nilai == 1) {
                        $scope.totalSkorB = $scope.totalSkorB - 1
                    }
                }
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                for (var i = dataIST.length - 1; i >= 0; i--) {
                    if (dataIST[i].nomor == dataItem.nomor) {
                        dataIST.splice(i, 1);
                    }
                }

                // if(dataIST.norec != ""){

                // }
                $scope.itemIST.nomor = undefined
                $scope.itemIST.jawaban = undefined
                console.log(dataItem.norec);
                
                if(dataItem.norec == ""){
                    grid.removeRow(row);
                }else{
                    var objSave = {
                        norec: dataItem.norec,
                        delete: true,
                        data: []
                    }
                    medifirstService.post('psikologi/save-ist',objSave).then(function(){
                        getDataIST()
                        
                    })
                }
            }
            $scope.jawabanIST = function(){
                
                
                if($scope.itemIST.nomor >= 1 && $scope.itemIST.nomor <= 20){
                    $scope.itemIST.test = "SE"
                } else if ($scope.itemIST.nomor >= 21 && $scope.itemIST.nomor <= 40) {
                    $scope.itemIST.test = "WA"
                } else if ($scope.itemIST.nomor >= 41 && $scope.itemIST.nomor <= 60) {
                    $scope.itemIST.test = "AN"
                } else if ($scope.itemIST.nomor >= 61 && $scope.itemIST.nomor <= 76) {
                    $scope.itemIST.test = "GE"
                } else if ($scope.itemIST.nomor >= 77 && $scope.itemIST.nomor <= 96) {
                    $scope.itemIST.test = "RA"
                } else if ($scope.itemIST.nomor >= 97 && $scope.itemIST.nomor <= 116) {
                    $scope.itemIST.test = "ZR"
                } else if ($scope.itemIST.nomor >= 117 && $scope.itemIST.nomor <= 136) {
                    $scope.itemIST.test = "FA"
                } else if ($scope.itemIST.nomor >= 137 && $scope.itemIST.nomor <= 156) {
                    $scope.itemIST.test = "WU"
                } else if ($scope.itemIST.nomor >= 157 && $scope.itemIST.nomor <= 176) {
                    $scope.itemIST.test = "ME"
                } 
                if ($scope.itemIST.nomor == undefined) {
                    toastr.error('Nomor Kosong')
                    $scope.itemIST.nomor = undefined
                    $scope.itemIST.jawaban = undefined
                    return
                }

                if ($scope.itemIST.nomor > 176) {
                    toastr.error('Nomor sudah Maksimal')
                    $scope.itemIST.nomor = undefined
                    $scope.itemIST.jawaban = undefined
                    return
                }
                // var nilaiD = 0
                for (let i = 0; i < kunJawIST.length; i++) {
                    if (kunJawIST[i].nomor == $scope.itemIST.nomor && kunJawIST[i].jawaban == $scope.itemIST.jawaban) {
                        console.log("jawaban harusnya ada");
                        $scope.itemIST.nilai = $scope.itemIST.nilai + kunJawIST[i].nilai
                        nilaiD = kunJawIST[i].nilai
                        break;
                    } else{
                        $scope.itemIST.nilai = $scope.itemIST.nilai + 0
                        nilaiD = 0
                    }
                }
                // console.log(nilaiD);
                var data = {}
                // if (dataIST.norec != "") {
                //     norecIST = dataIST.norec
                // }
                if($scope.nomorIST != ""){
                    for (var i = dataIST.length - 1; i >= 0; i--) {
                        if (dataIST[i].nomor == $scope.itemIST.nomor) {
                            data.norec = dataIST[i].norec
                            data.nomor = $scope.itemIST.nomor
                            data.test = $scope.itemIST.test
                            data.nilai = nilaiD
                            data.norec_apd = $scope.dataDaftarPsikologi.norec
                            data.jawaban= $scope.itemIST.jawaban.toLowerCase(),
                            data.tujuan = $scope.itemIST.tujuantest
                            dataIST[i] = data;

                            $scope.dataGridIST = new kendo.data.DataSource({
                                data: dataIST,
                                // pageSize: 50,
                                total: dataIST.length,
                            })
                            $scope.itemIST.jawaban = undefined

                        }

                    }
                    $scope.nomorIST = ""
                }else{
                    for (let i = 0; i < dataIST.length; i++) {
                        // const element = dataIST[i];
                        if (dataIST[i].nomor == $scope.itemIST.nomor) {
                            toastr.error('Nomor Sudah diisi')
                            $scope.itemIST.nomor = undefined
                            $scope.itemIST.jawaban = undefined
                            return
                        }
                    }
                    data = {
                        norec: norecIST,
                        nomor: $scope.itemIST.nomor,
                        test: $scope.itemIST.test,
                        tujuan: $scope.itemIST.tujuantest,
                        jawaban: $scope.itemIST.jawaban.toLowerCase(),
                        norec_apd: $scope.dataDaftarPsikologi.norec,
                        nilai: nilaiD
                    }
                    console.log(data);
                    
                    dataIST.push(data)
                    $scope.dataGridIST = new kendo.data.DataSource({
                        data: dataIST,
                        // pageSize: 50,
                        total: dataIST.length,
                    })
                        if (data.test == 'SE') {
                            $scope.itemIST.se += data.nilai
                        } else if (data.test == 'WA') {
                            $scope.itemIST.wa += data.nilai
                        } else if (data.test == 'AN') {
                            $scope.itemIST.an += data.nilai
                        } else if (data.test == 'GE') {
                            $scope.itemIST.ge += data.nilai
                        } else if (data.test == 'ME') {
                            $scope.itemIST.me += data.nilai
                        } else if (data.test == 'RA') {
                            $scope.itemIST.ra += data.nilai
                        } else if (data.test == 'ZR') {
                            $scope.itemIST.zr += data.nilai
                        } else if (data.test == 'FA') {
                            $scope.itemIST.fa += data.nilai
                        } else if (data.test == 'WU') {
                            $scope.itemIST.wu += data.nilai
                        }
                    //dibuat array nilainya
                    $scope.getNorma = {
                        // se: $scope.itemIST.se,
                        se: $scope.itemIST.se,
                        wa: $scope.itemIST.wa,
                        an: $scope.itemIST.an,
                        ge: $scope.itemIST.ge,
                        me: $scope.itemIST.me,
                        ra: $scope.itemIST.ra,
                        zr: $scope.itemIST.zr,
                        fa: $scope.itemIST.fa,
                        wu: $scope.itemIST.wu,

                    }
                    console.log($scope.getNorma);

                    $scope.itemIST.jawaban = undefined
                    $scope.itemIST.nomor = $scope.itemIST.nomor + 1
                }
                
                
            }
            $scope.simpanIST = function(){
                var objSave  = {
                    data: dataIST
                }
                console.log(objSave);
                // return 
                medifirstService.post('psikologi/save-ist', objSave).then(function(){
                    getDataIST()
                })
            }
            $scope.batalIST = function(){
                $scope.itemIST = {}
                $("#kendoGrid").data("kendoGrid").dataSource.data([]);
                $scope.dataIST = []
                $scope.jml = []
                $scope.x30 = []
                $scope.x31 = []
                $scope.x32 = []
                $scope.popUpIST.close()
            }
            $scope.klikGridIST = function(dataIST){
                $scope.nomorIST = dataIST.nomor
                $scope.itemIST.nomor = dataIST.nomor
                $scope.itemIST.jawaban = dataIST.jawaban
                $scope.itemIST.test = dataIST.test
                $scope.itemIST.tujuantest = dataIST.tujuan
                nilaiD = dataIST.nilai
            }
            function getDataIST(){
                //norma ist
                $scope.itemIST.se = 0;$scope.itemIST.wa = 0;$scope.itemIST.an = 0;$scope.itemIST.ge = 0;$scope.itemIST.me = 0;
                $scope.itemIST.ra = 0;$scope.itemIST.zr = 0;$scope.itemIST.fa = 0;$scope.itemIST.wu = 0;
                medifirstService.get('psikologi/get-hasil-ist?norec_apd='+$scope.dataDaftarPsikologi.norec).then(function(data){
                    var datas = data.data.data
                    dataIST = datas
                    if(datas.length > 0 ){
                        $scope.itemIST.tujuantest = datas[0].tujuan
                        for (let i = 0; i < dataIST.length; i++) {
                            console.log('y');
                            console.log(dataIST[i].test);
                            if (dataIST[i].test == 'SE') {
                                $scope.itemIST.se += dataIST[i].nilai
                                console.log($scope.itemIST.se);
                            } else if (dataIST[i].test == 'WA') {
                                $scope.itemIST.wa += dataIST[i].nilai
                            } else if (dataIST[i].test == 'AN') {
                                $scope.itemIST.an += dataIST[i].nilai
                            } else if (dataIST[i].test == 'GE') {
                                $scope.itemIST.ge += dataIST[i].nilai
                            } else if (dataIST[i].test == 'ME') {
                                $scope.itemIST.me += dataIST[i].nilai
                            } else if (dataIST[i].test == 'RA') {
                                $scope.itemIST.ra += dataIST[i].nilai
                            } else if (dataIST[i].test == 'ZR') {
                                $scope.itemIST.zr += dataIST[i].nilai
                            } else if (dataIST[i].test == 'FA') {
                                $scope.itemIST.fa += dataIST[i].nilai
                            } else if (dataIST[i].test == 'WU') {
                                $scope.itemIST.wu += dataIST[i].nilai
                            }
                        }
                        //dibuat array nilainya
                        $scope.getNorma = {
                            // se: $scope.itemIST.se,
                            se: $scope.itemIST.se,
                            wa: $scope.itemIST.wa,
                            an: $scope.itemIST.an,
                            ge: $scope.itemIST.ge,
                            me: $scope.itemIST.me,
                            ra: $scope.itemIST.ra,
                            zr: $scope.itemIST.zr,
                            fa: $scope.itemIST.fa,
                            wu: $scope.itemIST.wu,

                        }
                        // console.log($scope.getNorma);
                        $scope.dataGridIST = new kendo.data.DataSource({
                            data: dataIST,
                            // pageSize: 50,
                            total: dataIST.length,
                        })
                    }
                    // $scope.norecIST = 
                    //untuk ngeget nilai pertestnya
                    
                })
            }
            $scope.getIST = function(){
                // $scope.itemIST.umurIST
                var umur1 = $scope.itemIST.umurIST;
                var umur2 = $scope.itemIST.umurIST;
                if ($scope.itemIST.umurIST >= 19 && $scope.itemIST.umurIST <= 20) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 20
                } else if ($scope.itemIST.umurIST >= 21 && $scope.itemIST.umurIST <= 24) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 24
                } else if ($scope.itemIST.umurIST >= 25 && $scope.itemIST.umurIST <= 28) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 28
                } else if ($scope.itemIST.umurIST >= 29 && $scope.itemIST.umurIST <= 33) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 33
                } else if ($scope.itemIST.umurIST >= 34 && $scope.itemIST.umurIST <= 39) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 39
                } else if ($scope.itemIST.umurIST >= 40 && $scope.itemIST.umurIST <= 45) {
                    umur1 = $scope.itemIST.umurIST
                    umur2 = 45
                } else if ($scope.itemIST.umurIST >= 46) {
                    umur1 = 46
                    umur2 = 46
                }
                var objPost = {
                    norma: $scope.getNorma,
                    umur1: umur1,
                    umur2: umur2
                }
                console.log(objPost);
                // return
                medifirstService.post('psikologi/get-norma-ist',objPost).then(function(data){
                    var datas = data.data.data
                    $scope.dataIST = datas
                    $scope.jml = data.data
                    $scope.x30 = {
                        x30: datas[3].sw + datas[5].sw
                    }
                    $scope.x31 = {
                        x31: datas[2].sw + datas[6].sw
                    }
                    if ($scope.x30.x30 > $scope.x31.x31) {
                        $scope.x32={'x32':$scope.x30.x30-$scope.x31.x31};
                    } else{
                        $scope.x32 ={'x32':$scope.x31.x31 - $scope.x30.x30};
                    }
                    console.log(dataBuatHasilIST);
                    if($scope.x32.x32 <=10){
                        $scope.dominasi = "Seimbang";
                    } else if ($scope.x30.x30 >= $scope.x31.x31) {
                        $scope.dominasi = "Eksak";
                    } else if ($scope.x30.x30 <= $scope.x31.x31) {
                        $scope.dominasi = "Non Eksak";
                    }
                })
            }
            $scope.simpanHasilIST = function(){
                var objSave = {
                    'norec': norecISTDetail,
                    'se': $scope.dataIST[0],
                    'wa': $scope.dataIST[1],
                    'an': $scope.dataIST[2],
                    'ge': $scope.dataIST[3],
                    'me': $scope.dataIST[4],
                    'ra': $scope.dataIST[5],
                    'zr': $scope.dataIST[6],
                    'fa': $scope.dataIST[7],
                    'wu': $scope.dataIST[8],
                    'jml': {
                        rw: $scope.jml.rw,
                        sw: $scope.jml.gesamt
                    },
                    'iq': $scope.jml.iq,
                    'dominasi': $scope.dominasi,
                    'norec_apd':$scope.dataDaftarPsikologi.norec
                }
                medifirstService.post('psikologi/save-hasil-ist-detail', objSave).then(function(){

                })
                // console.log(objSave);
            }
        }
    ])
});