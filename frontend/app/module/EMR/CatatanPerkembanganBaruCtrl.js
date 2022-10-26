define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('CatatanPerkembanganBaruCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.tombolSimpanVis = true
            $scope.show = true;
            $scope.item = {}
            $scope.cc = {}
            $scope.now = moment(new Date()).format('YYYY-MM-DD')
            $scope.cc.emrfk = 3000440
            var nomorEMR = '-'
            var norecEMR = ''
            var dataCakem = []

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })

            
            loadData()
            function loadData(){
                var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
                console.log(cacheNomorEMR);
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
                medifirstService.get("emr/get-emr-cakem?noemr=" + $scope.cc.norec_emr + "&emrfk=" + $scope.cc.emrfk, true).then(function (data) {
                    console.log(data);
                    var datas = data.data.data
                    dataCakem = datas
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i+1                        
                    }
                    $scope.dataSourceGrid = new kendo.data.DataSource({
                        data: dataCakem,
                        pageSize: 10
                    });
                })
            }
            $scope.Batal = function(){
                $scope.popUpLembarCakem.close()
            }
            $scope.createData = function () {
                
                $scope.item.norec = undefined;
                $scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD 00:00')
                $scope.item.pegawai = {
                    text: medifirstService.getPegawaiLogin().namaLengkap,
                    value: medifirstService.getPegawaiLogin().id
                }
                if (dataCakem.length > 0) {
                    $scope.item.evaluasi = dataCakem[dataCakem.length - 1].evaluasi
                }
                $scope.popUpLembarCakem.center().open()
            }
            $scope.columnGrid = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="createData()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                }],
                // excel: {
                //     fileName: "Laporan Pengunjung Pemeriksaan.xlsx",
                //     allPages: true,
                // },
                // excelExport: function (e) {
                //     var sheet = e.workbook.sheets[0];
                //     sheet.frozenRows = 2;

                //     sheet.mergedCells = ["A1:I1"];

                //     var myHeaders = [{
                //         value: "Laporan Rekap Data Kunjungan Rawat Jalan",
                //         fontSize: 20,
                //         textAlign: "center",
                //         background: "#ffffff",
                //         // color:"#ffffff"
                //     }];
                //     sheet.rows.splice(0, 0, {
                //         cells: myHeaders,
                //         type: "header",
                //         height: 70
                //     });
                // },
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
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
                    "field": "pelaksanaan",
                        "title": "Pelaksanaan",
                        "width": "150px",
                    },
                    {
                        "field": "evaluasi",
                        "title": "Evaluasi",
                        "width": "180px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "80px",
                    },
                    {
                        "command": [{
                                text: "Edit",
                                click: edit,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: "Hapus",
                                click: hapus,
                                imageClass: "k-icon k-i-delete"
                            },
                        ],
                        title: "",
                        width: "150px",
                    }
                ]
            }

            function edit(e){
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                console.log(dataItem);
                $scope.item.norec = dataItem.norec_ec
                $scope.item.jam = moment(dataItem.jam).format('HH:mm')
                $scope.item.tanggal = moment(dataItem.tanggal).format('YYYY-MM-DD')
                $scope.item.pelaksanaan = dataItem.pelaksanaan
                $scope.item.evaluasi = dataItem.evaluasi
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
                var jsonSave = {
                    'norec': dataItem.norec_ec
                }
                medifirstService.post('emr/hapus-emr-cakem', jsonSave).then(function (e) {
                    $scope.item.norec = undefined
                    loadData()
                })
            }
            console.log($scope.cc.norec_emr);
            $scope.Save = function () {
                var norec = '-'
                if ($scope.item.norec != undefined) {
                    norec = $scope.item.norec
                }
                var tanggal = ''
                if($scope.item.tanggal != undefined){
                    tanggal = moment($scope.item.tanggal).format('YYYY-MM-DD')
                }
                var jam = ''
                if ($scope.item.jam != undefined) {
                    jam = moment($scope.item.jam).format('HH:mm')
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

        }
    ]);
});