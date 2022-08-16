define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarPasienPsikologiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.totalSkor = 0
            $scope.totalSkorB = 0
            // $scope.item.idNormaPsikologi = null;
            $scope.now = new Date();
            var dataPsikologi = [];
            var norec = "";
            $scope.item.periodeAwal = moment($scope.now).format("YYYY-MM-DD 00:00:00")
            $scope.item.periodeAkhir = moment($scope.now).format("YYYY-MM-DD 23:59:59")
            loadCombo()
            getLoadData()

            function loadCombo() {
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
            }
            $scope.cfit = function () {
                $scope.item.nomor = 1
            }
            $scope.test = function () {
                $scope.item.nomor = 1
            }
            $scope.jawaban = function () {
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

                var data = {};

                var kuncijawaban = $scope.kuncijawaban
                for (let i = 0; i < kuncijawaban.length; i++) {
                    if (kuncijawaban[i].nomor == $scope.item.nomor &&
                        kuncijawaban[i].kuncijawaban == $scope.item.jawaban.toUpperCase() &&
                        kuncijawaban[i].test == $scope.item.test.test) {
                        if ($scope.item.cfit.cfit == 'A') {
                            $scope.totalSkor = $scope.totalSkor + 1
                        } else if ($scope.item.cfit.cfit == 'B') {
                            $scope.totalSkorB = $scope.totalSkorB + 1
                        }
                        $scope.nilai = 1
                        break;
                    } else {
                        $scope.nilai = 0
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
                $scope.item.nomor = $scope.item.nomor + 1
                $scope.item.jawaban = undefined
            }

            function getLoadData() {

                medifirstService.get('psikologi/get-daftar-pasien-psikologi?tglawal=' + $scope.item.periodeAwal + "&tglakhir=" + $scope.item.periodeAkhir).then(function (data) {
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
            $scope.simpanPsikologi = function () {
                var objSave = {
                    datapsikologi: dataPsikologi
                }
                console.log(objSave);
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
                    }
                    console.log(dataPsikologi);
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
                grid.removeRow(row);
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
            $scope.inputEPPS = function () {
                if ($scope.dataDaftarPsikologi == undefined) {
                    toastr.error('Data Belum dipilih')
                    return
                }

                console.log($scope.dataDaftarPsikologi)

                var obj = {
                    noRegistrasi: $scope.dataDaftarPsikologi.noregistrasi,
                    nocm: $scope.dataDaftarPsikologi.nocm,
                    norec_apd: $scope.dataDaftarPsikologi.norec,
                }

                $state.go('EPPSpsikologi', {
                    dataPasien: JSON.stringify(obj)
                });
            }
        }
    ])
});