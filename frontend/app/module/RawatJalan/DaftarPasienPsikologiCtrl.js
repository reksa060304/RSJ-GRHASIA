define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarPasienPsikologiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.item.idNormaPsikologi = null;
            $scope.now = new Date();
            $scope.item.periodeAwal = moment($scope.now).format("YYYY-MM-DD 00:00:00")
            $scope.item.periodeAkhir = moment($scope.now).format("YYYY-MM-DD 23:59:59")
            loadCombo()
            getLoadData()
            function loadCombo(){
                // var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienOperatorCtrl');
                // if (chacePeriode != undefined) {
                //     //debugger;
                //     var arrPeriode = chacePeriode //.split('~');
                //     $scope.item.periodeAwal = new Date(arrPeriode[0]);
                //     $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                //     if (arrPeriode[2] != "")
                //         $scope.item.noReg = arrPeriode[2];
                //     if (arrPeriode[3] != "")
                //         $scope.item.noRm = arrPeriode[3];
                //     if (arrPeriode[4] != "")
                //         $scope.item.nama = arrPeriode[4];
                //     if (arrPeriode[5] != "")
                //         $scope.item.instalasi = arrPeriode[5];
                // } else {
                //     $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                //     $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59')); //$scope.now;
                //     // $scope.item.tglpulang = $scope.now;					
                // }
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
                medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
                    //  debugger;
                    $scope.sourceDiagnosisPrimer = data;
                });
                medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
                    $scope.listDataPegawai = e;
                })
            }
            function getLoadData() {
                medifirstService.get('psikologi/get-daftar-pasien-psikologi').then(function (data) {
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
                })
            }

            $scope.opsiGridDaftarPsikologi = {
                // toolbar: [{
                //     name: "create",
                //     text: "Buat Data Master Norma Psikologi",
                //     template: '<button ng-click="createMasterNormaPsikologi()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Master Norma Psikologi</button>'
                // }],
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
                    // {
                    //     "field": "nilai",
                    //     "title": "Nama Dokter",
                    //     "width": "20%"
                    // },
                    // {
                    //     "field": "nilai",
                    //     "title": "Kelompok Pasien",
                    //     "width": "20%"
                    // },
                    {
                        "field": "tglkeluar",
                        "title": "Tgl Pulang",
                        "width": "60px"
                    },
                    // {
                    //     "field": "nilai",
                    //     "title": "Jenis Pelayanan",
                    //     "width": "20%"
                    // },
                    // {
                    //     "field": "subkategorifk",
                    //     "title": "Sub Kategori Pendidikan",
                    //     "width": "20%"
                    // },
                    // {
                    //     "command": [{
                    //             text: "Edit",
                    //             click: Edit,
                    //             imageClass: "k-icon k-i-pencil"
                    //         },
                    //         {
                    //             text: "Hapus",
                    //             click: Hapus,
                    //             imageClass: "k-icon k-i-delete"
                    //         },
                    //     ],
                    //     title: "",
                    //     width: "185px",
                    // }
                ]
            }
            $scope.createMasterNormaPsikologi = function () {
                $scope.popUpDataNormaPsikologi.center().open();
            }

            function Edit(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                $scope.item.umurmin = dataItem.umurmin
                $scope.item.umurmax = dataItem.umurmax
                $scope.item.nilai = dataItem.nilai
                $scope.item.jenisnorma = {
                    id: dataItem.objectjenisnormafk,
                    jenisnorma: dataItem.jenisnorma
                }
                $scope.item.idNormaPsikologi = dataItem.id
                $scope.popUpDataNormaPsikologi.center().open();

            }

            function Hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                };
                var objSave = {
                    'iddel': dataItem.id,

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
                $scope.popUpDataNormaPsikologi.close()
                $scope.item.idNormaPsikologi = ""
            }
            $scope.inputHasilPsikologi = function(){
                if ($scope.dataDaftarPsikologi == undefined) {
                    toastr.error('Data Belum dipilih')
                    return
                }
                $scope.item.no = 1;
                $scope.popUpDataDaftarPsikologi.center().open()
            }
            $scope.inputEPPS = function(){
                $scope.changePage("EPPSpsikologi");
            }

            $scope.changePage = function (stateName) {

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
                  });
              }

            $scope.dataDaftarHasil = {
                sortable: true,
                filterable: false,
                pageable: true,
                selectable: 'row',
                resizable: true,
                scrollable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "10px"
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Jawaban",
                        "width": "60px"
                    },
                    
                ]
            }
        }
    ])
});