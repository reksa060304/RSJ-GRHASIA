define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('CatatanPerkembanganBaruV2Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {
            $scope.tombolSimpanVis = true
            $scope.show = true;
            $scope.item = {}
            $scope.cc = {}
            $scope.now = moment(new Date()).format('YYYY-MM-DD')
            $scope.cc.emrfk = 333335
            var nomorEMR = '-'
            var norecEMR = ''
            var dataCakem = []
            $scope.listItemEvaluasi = {
                tanggal: null,
                shift: null,
                pegawai: null,
                s: null,
                o: null,
                a: null,
                a1: null,
                a2: null,
                p: null,
                diagnosa1: null,
                diagnosa2: null,
                diagnosa2: null
            }
            $scope.item.tanggal = new Date()
            $scope.item.tanggaltindakan = new Date()
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.get("emr/get-datacombo-part-diagnosa-keperawatan" ).then(function (data) {
                console.log(data);
                $scope.listDiagnosaKep = data.data
            })
            $scope.item.pegawai = {
                text: medifirstService.getPegawaiLogin().namaLengkap,
                value: medifirstService.getPegawaiLogin().id
            }
            $scope.listShift = [
                {id:1, shift: 'Pagi'},
                // {id:2, shift: 'Siang'},
                {id:3, shift: 'Sore'},
                {id:4, shift: 'Malam'},

            ]
            $scope.loaddataaaa = function(){
                loadData()
            }
            loadData()
            function loadData(){
                medifirstService.get("emr/get-datacombo-part-diagnosa-keperawatan" ).then(function (data) {
                    console.log(data);
                    $scope.listDiagnosaKep = data.data
                })
                var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
                if (cacheNoREC != undefined) {
                    norecEMR = cacheNomorEMR[1]
                }
                if (cacheNomorEMR != undefined) {
                    nomorEMR = cacheNomorEMR[0]
                    norecEMR = cacheNomorEMR[1]
                    $scope.cc.norec_emr = nomorEMR
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
                    $scope.cc.tglLahir = chacePeriode[18]
                    $scope.cc.alamat = chacePeriode[15]
                    
                }
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
                medifirstService.get("emr/get-emr-cakem?noemr=" + $scope.cc.norec_emr + "&emrfk=" + $scope.cc.emrfk + "&tgl=" + moment($scope.item.tanggal).format('YYYY-MM-DD'), true).then(function (data) {
                    console.log(data);
                    var datas = data.data.data
                    
                    for (let i = 0; i < datas.length; i++) {
                        
                        datas[i].tanggal = moment(datas[i].tanggal).format('DD-MM-YYYY')
                        datas[i].diagnosa1 = {
                            text: datas[i].textdiagnosa1,
                            value: datas[i].iddiagnosa1
                        }
                        datas[i].diagnosa2 = {
                            text: datas[i].textdiagnosa2,
                            value: datas[i].iddiagnosa2
                        }
                        datas[i].diagnosa3 = {
                            text: datas[i].textdiagnosa3,
                            value: datas[i].iddiagnosa3
                        }
                        for (let j = 0; j < $scope.listShift.length; j++) {
                            if (datas[i].shift == $scope.listShift[j].id){
                                datas[i].shift = $scope.listShift[j].shift
                            }
                        }
                    }
                    dataCakem = datas
                        $scope.listItemEvaluasi = datas

                                
                    
                })
            }

            
            $scope.getintervensi = function(){
                $scope.listintervensi = $scope.item.diagnosaKep.details
            }
            $scope.getImplementasi = function(){
                $scope.listimplementasi = $scope.item.intervensi.details
            }
            $scope.item.diagnosakeper = {
                text: medifirstService.getPegawaiLogin().namaLengkap,
                value: medifirstService.getPegawaiLogin().id
            }
            $scope.Batal = function(){
                $scope.item = {}
                $scope.popUpLembarCakem.close()
            }
            $scope.columnGrid = function(data){
                console.log(data);
                return {
                    dataSource: new kendo.data.DataSource({
                    data: data,}),
                    toolbar: [{
                            name: "create",
                            text: "Tambah",
                            template: '<button ng-click="createData(data)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Tindakan Keperawatan</button>'
                        }],
                        selectable: "row",
                        pageable: true,
                        columns: [
                            {
                                "field": "tanggal",
                                "title": "Tanggal",
                                "width": "50px",
                            },
                            {
                                "field": "jam",
                                "title": "Jam",
                                "width": "50px",
                            },
                            {
                                "field": "implementasi",
                                "title": "Tindakan Keperawatan / Implementasi",
                                "width": "50px",
                            },
                            
                            // {
                            //     "command": [{
                            //         text: "Hapus",
                            //         click: hapus,
                            //         imageClass: "k-icon k-i-delete"
                            //     }, ],
                            //     title: "",
                            //     width: "50px",
                            // }
                        ]
                }
            }
            $scope.createData = function (data) {
                console.log(data);
                $scope.dataaaaa = data
                $scope.item.jam = new Date()
                // $scope.item.norec = undefined;
                // $scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD 00:00')
                // $scope.item.pegawai = {
                //     text: medifirstService.getPegawaiLogin().namaLengkap,
                //     value: medifirstService.getPegawaiLogin().id
                // }
                // if (dataCakem.length > 0) {
                //     $scope.item.evaluasi = dataCakem[dataCakem.length - 1].evaluasi
                // }
                $scope.popUpLembarCakem.center().open()
            }
            // $scope.columnGrid = {
                
            // }

            function edit(e){
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.objectpegawaifk != medifirstService.getPegawaiLogin().id){
                    alert("Tidak bisa diRubah!")
                    return;
                }
                $scope.item.norec = dataItem.norec_ec
                $scope.item.jam = new Date(moment(dataItem.tanggal).format('YYYY-MM-DD') + ' '+dataItem.jam)
                $scope.item.tanggal = moment(dataItem.tanggal).format('YYYY-MM-DD')
                $scope.item.pelaksanaan = dataItem.pelaksanaan
                $scope.item.evaluasi = dataItem.evaluasi
                $scope.listPegawai.add({
                    text: dataItem.namalengkap,
                    value: dataItem.objectpegawaifk
                })
                $scope.item.pegawai = {
                    text: dataItem.namalengkap,
                    value: dataItem.objectpegawaifk
                }
                // if (dataItem.objectpegawaifk != medifirstService.getPegawaiLogin().id) {
                //     toastr.error('Tidak bisa diubah')
                //     return
                // }

                $scope.popUpLembarCakem.center().open()
            }
            function hapus(e) {
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                if (dataItem.objectpegawaifk != medifirstService.getPegawaiLogin().id) {
                    alert("Tidak bisa dihapus!")
                    return;
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .htmlContent('Apakah Anda yakin ingin menghapus Catatan Perkembangan tersebut?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var jsonSave = {
                        'norec': dataItem.norec_ec
                    }
                    medifirstService.post('emr/hapus-emr-cakem', jsonSave).then(function (e) {
                        $scope.item.norec = undefined
                        loadData()
                    })
                })
                
            }
            console.log($scope.cc.norec_emr);
            $scope.Save = function () {
                
                var tanggal = ''
                if($scope.item.tanggal != undefined){
                    tanggal = moment($scope.item.tanggal).format('YYYY-MM-DD')
                }
                var jam = ''
                if ($scope.item.jam != undefined) {
                    jam = moment($scope.item.jam).format('HH:mm:ss')
                }
                var pelaksanaan= ''
                if ($scope.item.pelaksanaan != undefined) {
                    pelaksanaan = $scope.item.pelaksanaan
                }
                var evaluasi = ''
                if ($scope.item.evaluasi != undefined) {
                    evaluasi = $scope.item.evaluasi
                }
                var objectpegawaifk= ''
                if ($scope.item.pegawai != undefined) {
                    objectpegawaifk = $scope.item.pegawai.value
                }
                $scope.cc.jenisemr = 'asesmen'
                var data = {
                    norec: norec,
                    tanggal: tanggal,
                    jam: jam,
                    pelaksanaan: pelaksanaan,
                    evaluasi: evaluasi,
                    pegawaiinput: medifirstService.getPegawaiLogin().id,
                    objectpegawaifk: objectpegawaifk,
                }
                var jsonSave = {
                    head: $scope.cc,
                    data: data
                }
                console.log(jsonSave);
                // return

                medifirstService.post('emr/save-emr-cakem', jsonSave).then(function (e) {
                    $scope.item.jam = undefined
                    $scope.item.pelaksanaan = undefined
                    $scope.item.pegawai = undefined
                    $scope.popUpLembarCakem.close()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Perkembangan' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                        $rootScope.loadRiwayat()
                        var arrStr = {
                            0: e.data.data.noemr
                        }
                        console.log(arrStr);
                    cacheHelper.set('cacheNomorEMR', arrStr);
                        loadData()
                });
            }
            $scope.Cetak = function(){
                // console.log(cacheNomorEMR);
                var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                console.log(cacheNomorEMR[0]);
                // return
                if (cacheNomorEMR[0] == '-') {
                    return
                }
                
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(configuration.baseApiBackend + 'report/get-cetak-cakem?noemr=' + cacheNomorEMR[0] + '&emrfk=' + $scope.cc.emrfk +
                    '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }
            $scope.TambahEvaluasi = function(){
                var norec = '-'
                if ($scope.item.norec != undefined) {
                    norec = $scope.item.norec
                }
                var objSave = {
                    norec: norec,
                    tanggal: $scope.item.tanggal,
                    shift: $scope.item.shift.id,
                    objectpegawaifk: $scope.item.pegawai.value,
                    pegawaiinput: medifirstService.getPegawaiLogin().id,
                }
                var jsonSave = {
                    head: $scope.cc,
                    data: objSave
                }
                medifirstService.post('emr/save-emr-cakemv2', jsonSave).then(function (e) {
                    $scope.item.jam = undefined
                    $scope.item.pelaksanaan = undefined
                    $scope.item.pegawai = undefined
                    $scope.popUpLembarCakem.close()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Catatan Perkembangan' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    console.log(arrStr);
                    cacheHelper.set('cacheNomorEMR', arrStr);
                    loadData()
                });
            }
            $scope.SimpanTindakan = function(data){
                console.log(data);
                var objSave = {
                    norec_ec: data.norec_ec,
                    jam: moment($scope.item.jam).format('HH:mm'),
                    tanggal: moment($scope.item.tanggaltindakan).format('YYYY-MM-DD'),
                    tindakan: $scope.item.implementasi.value,
                    objectruanganfk: $scope.cc.objectruanganfk
                } 
                medifirstService.post('cakem/simpan-tindakan', objSave).then(function(){
                    $scope.item.jam = undefined
                    $scope.item.tindakan = undefined
                    $scope.item.diagnosaKep = undefined
                    $scope.item.intervensi = undefined
                    $scope.item.implementasi = undefined
                    loadData()
                    $scope.popUpLembarCakem.close()
                })
            }
            $scope.SimpanEvaluasi = function(data){
                console.log(data);
                medifirstService.post('cakem/simpan-evaluasi', data).then(function () {
                  
                    // $scope.item.jam = undefined
                    // $scope.item.tindakan = undefined
                    loadData()
                })
            }

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }
        }
    ]);
});