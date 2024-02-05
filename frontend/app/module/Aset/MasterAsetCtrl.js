define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterAsetCtrl', ['$scope', 'MedifirstService', '$state',
        function ($scope, medifirstService, $state) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;

            $scope.isEdit = false

            $scope.item.statusEnabledOption = [{ value: true, name: 'Aktif' }, {value: false, name: 'Tidak Aktif'}];

            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                init();
            }

            function loadCombo() {
                // manageLogistikPhp.getDataTableTransaksi("logistik/get-datacombo_dp", true).then(function(dat){
                //     pegawaiUser = dat.data.datalogin
                // });
                // $scope.listJenisRacikan = [{id:1,jenisracikan:'Puyer'}]
            }

            $scope.Tambah = function () {
                $state.go('MasterChartOfAccountCtrl')
            }

            function init() {
                var urian = 'urian=' + $scope.item.urianS
                if ($scope.item.urianS == undefined) {
                    urian = ''
                }
                var kodeAkun = '&kodeakun=' + $scope.item.kodeakunS
                if ($scope.item.kodeakunS == undefined) {
                    kodeAkun = ''
                }
                $scope.isRouteLoading = true;
                medifirstService.get("asset/get-master-asset?" + urian + kodeAkun, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = dat.data.length - 1; i >= 0; i--) {
                        dat.data[i].no = i + 1
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dat.data,
                        sort: [
                            {
                                field: "id",
                                dir: "asc"
                            }
                        ],
                        pageSize: 12,
                    });
                });
                // medifirstService.get("akuntansi/get-data-combo-master", true).then(function (dat) {
                //     $scope.listStruktur = dat.data.strukturaccount
                //     $scope.listJenis = dat.data.jenisaccount
                //     $scope.listKategory = dat.data.kategoryaccount
                //     $scope.listStatus = dat.data.statusaccount
                //     $scope.listSaldo = [{ id: 1, saldo: 'D' }, { id: 2, saldo: 'K' }]
                //     $scope.listStatusEnabled = [{ id: 1, statusenabled: 'True' }, { id: 2, statusenabled: 'False' }]
                // });
            }
           
            $scope.cariFilter = function () {
                init();
            }

            $scope.riwayatSaldo = function () {
                $scope.item.objectaccountfk = $scope.dataSelected.id
                $scope.item.noakunP = $scope.dataSelected.noaccount
                $scope.item.namaAkunP = $scope.dataSelected.namaaccount
                medifirstService.get("akuntansi/get-data-daftar-saldo-awal?coaid=" + $scope.dataSelected.id, true).then(function (dat) {
                    for (var i = dat.data.length - 1; i >= 0; i--) {
                        dat.data[i].no = i + 1
                    }
                    $scope.dataPopUp = new kendo.data.DataSource({
                        data: dat.data,
                        sort: [
                            {
                                field: "tgl",
                                dir: "asc"
                            }
                        ],
                        pageSize: 12
                    });
                });

                $scope.item.tglSaldo = $scope.now;
                $scope.item.saldoDebet = 0
                $scope.item.saldoKredit = 0
                $scope.item.saldoStatus = 1
                $scope.popupRiwayatSaldo.center().open();
            }

            $scope.CariCoaPOP = function () {

                medifirstService.get("akuntansi/get-data-daftar-saldo-awal?noaccount=" + $scope.item.noakunP, true).then(function (dat) {
                    for (var i = dat.data.length - 1; i >= 0; i--) {
                        dat.data[i].no = i + 1
                    }
                    $scope.dataPopUp = new kendo.data.DataSource({
                        data: dat.data,
                        sort: [
                            {
                                field: "tgl",
                                dir: "asc"
                            }
                        ],
                        pageSize: 12
                    });
                    $scope.item.objectaccountfk = dat.data[0].id
                    $scope.item.id = dat.data[0].id
                    $scope.item.noakunP = dat.data[0].noaccount
                    $scope.item.namaAkunP = dat.data[0].namaaccount
                });

                $scope.item.tglSaldo = $scope.now;
                $scope.item.saldoDebet = 0
                $scope.item.saldoKredit = 0
                $scope.item.saldoStatus = 1
                $scope.popupRiwayatSaldo.center().open();
            }

            $scope.klikPopUp = function (dataSelectedPopUp) {
                $scope.item.norecSaldo = dataSelectedPopUp.norec
                $scope.item.tglSaldo = dataSelectedPopUp.tgl
                $scope.item.saldoDebet = dataSelectedPopUp.hargasatuand
                $scope.item.saldoKredit = dataSelectedPopUp.hargasatuank
                $scope.item.saldoStatus = dataSelectedPopUp.statusenabled
            }

            $scope.batalSaldo = function () {
                $scope.item.norecSaldo = undefined
                $scope.item.tglSaldo = $scope.now;
                $scope.item.saldoDebet = 0
                $scope.item.saldoKredit = 0
                $scope.item.saldoStatus = 1
            }

            $scope.tambahSaldo = function () {
                var norec_tea = $scope.item.norecSaldo
                if ($scope.item.norecSaldo == undefined) {
                    norec_tea = '-'
                }
                var tgltgl = moment($scope.item.tglSaldo).format('YYYYMM');
                var objSave = {
                    norec: norec_tea,
                    objectaccountfk: $scope.item.id,
                    hargasatuand: $scope.item.saldoDebet,
                    hargasatuank: $scope.item.saldoKredit,
                    statusenabled: $scope.item.saldoStatus,
                    ym: tgltgl,
                }

                medifirstService.post('akuntansi/save-data-saldo-awal',objSave).then(function (e) {
                    $scope.item.tglSaldo = $scope.now;
                    $scope.item.saldoDebet = 0
                    $scope.item.saldoKredit = 0
                    $scope.item.saldoStatus = 1
                    $scope.item.norecSaldo = undefined
                    medifirstService.get("akuntansi/get-data-daftar-saldo-awal?coaid=" + $scope.item.id, true).then(function (dat) {
                        for (var i = dat.data.length - 1; i >= 0; i--) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataPopUp = new kendo.data.DataSource({
                            data: dat.data,
                            sort: [
                                {
                                    field: "tgl",
                                    dir: "asc"
                                }
                            ],
                            pageSize: 12
                        });
                    });
                })

            }

            $scope.hapusSaldo = function () {
                var objSave = {
                    head: $scope.item.norecSaldo
                }
                medifirstService.post('akuntansi/save-hapus-saldo-awal',objSave).then(function (e) {
                    medifirstService.get("akuntansi/get-data-daftar-saldo-awal?coaid=" + $scope.item.id, true).then(function (dat) {
                        for (var i = dat.data.length - 1; i >= 0; i--) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataPopUp = new kendo.data.DataSource({
                            data: dat.data,
                            sort: [
                                {
                                    field: "tgl",
                                    dir: "asc"
                                }
                            ],
                            pageSize: 12
                        });
                    });
                    $scope.item.norecSaldo = undefined
                    $scope.item.tglSaldo = $scope.now;
                    $scope.item.saldoDebet = 0
                    $scope.item.saldoKredit = 0
                    $scope.item.saldoStatus = 1
                })


            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGridExcel = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Master Coa  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                selectable: 'row',
                columns: [
                    {
                        "field": "id",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "akun",
                        "title": "Akun",
                    },
                    {
                        "field": "kelompok",
                        "title": "Kelompok",
                    },
                    {
                        "field": "jenis",
                        "title": "Jenis",
                    },
                    {
                        "field": "object",
                        "title": "object",
                        "width": "60px"
                    },
                    {
                        "field": "rinciobject",
                        "title": "Rinci Object"
                    },
                    {
                        "field": "subrinci",
                        "title": "Sub Rinci",
                    },
                    {
                        "field": "subsubrinci",
                        "title": "Sub Sub Rinci"
                    },
                    {
                        "field": "level",
                        "title": "Level",
                    },
                    {
                        "field": "urian",
                        "title": "Urian"
                    },
                    {
                        "field": "kodeakun",
                        "title": "Kode Akun"
                    }
                ]
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "akun",
                    "title": "Akun",
                    "width": "100px"
                },
                {
                    "field": "kelompok",
                    "title": "Kelompok",
                    "width": "250px"
                },
                {
                    "field": "jenis",
                    "title": "Jenis",
                    "width": "60px"
                },
                {
                    "field": "rinciobject",
                    "title": "Rinci Object",
                    "width": "60px"
                },
            ];

            $scope.columnPopUp = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px"
                },
                {
                    "field": "tgl",
                    "title": "Tanggal",
                    "width": "60px"
                },
                {
                    "field": "hargasatuand",
                    "title": "Saldo Debet",
                    "width": "130px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuand #', '')}}</span>"
                },
                {
                    "field": "hargasatuank",
                    "title": "Saldo Kredit",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuank #', '')}}</span>"
                },
                {
                    "field": "statusenabled",
                    "title": "Status",
                    "width": "20px"
                }
            ];

            $scope.klikGrid = function (dataSelected) {
                $scope.isEdit = true

                if(dataSelected != undefined){
                    $scope.modelGrid = dataSelected
                    
                    if($scope.modelGrid.statusenabled == true) {
                        $scope.modelGrid.statusenabled = { value: true, name: 'Aktif' }
                    }else{
                        $scope.modelGrid.statusenabled = { value: false, name: 'Tidak Aktif' }
                    }

                    $scope.item.statusenabled = $scope.modelGrid.statusenabled
                    $scope.item.akun = $scope.modelGrid.akun
                    $scope.item.kelompok = $scope.modelGrid.kelompok
                    $scope.item.jenis = $scope.modelGrid.jenis
                    $scope.item.object = $scope.modelGrid.object
                    $scope.item.rinciobject = $scope.modelGrid.rinciobject
                    $scope.item.subrinci = $scope.modelGrid.subrinci
                    $scope.item.subsubrinci = $scope.modelGrid.subsubrinci
                    $scope.item.level = $scope.modelGrid.level
                    $scope.item.urian = $scope.modelGrid.urian
                    $scope.item.kodeakun = $scope.modelGrid.kodeakun
                }

                // $scope.item.id = dataSelected.id
                // $scope.item.noakun = dataSelected.noaccount
                // $scope.item.namaAkun = dataSelected.namaaccount
                // $scope.item.struktur = { id: dataSelected.objectstrukturaccountfk, strukturaccount: dataSelected.strukturaccount }
                // $scope.item.jenis = { id: dataSelected.objectjenisaccountfk, jenisaccount: dataSelected.jenisaccount }
                // $scope.item.kategory = { id: dataSelected.objectkategoryaccountfk, kategoryaccount: dataSelected.kategoryaccount }
                // $scope.item.status = { id: dataSelected.objectstatusaccountfk, statusaccount: dataSelected.statusaccount }
                // if (dataSelected.saldonormaladd == "D") {
                //     $scope.item.saldoAdd = { id: 1, saldo: "D" }
                // } else {
                //     $scope.item.saldoAdd = { id: 2, saldo: "K" }
                // }
                // if (dataSelected.saldonormalmin == "D") {
                //     $scope.item.saldoMin = { id: 1, saldo: "D" }
                // } else {
                //     $scope.item.saldoMin = { id: 2, saldo: "K" }
                // }
                // if (dataSelected.statusenabled == true) {
                //     $scope.item.statusenabled = { id: 1, statusenabled: "True" }
                // } else {
                //     $scope.item.statusenabled = { id: 2, statusenabled: "False" }
                // }
            }
            
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

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

            $scope.simpan = function () {
                var idCoa = ''
                if ($scope.item.id != undefined)
                    idCoa = $scope.item.id

                if ($scope.item.statusenabled == undefined) {
                    toastr.error('Status enabled harus di isi')
                    return
                }
                if ($scope.item.akun == undefined) {
                    toastr.error('Akun harus di isi')
                    return
                }
                if ($scope.item.kelompok == undefined) {
                    toastr.error('Kelompok harus di isi')
                    return
                }

                if ($scope.item.jenis == undefined) {
                    toastr.error('Jenis harus di isi')
                    return
                }

                if ($scope.item.object == undefined) {
                    toastr.error('Object harus di isi')
                    return
                }
                if ($scope.item.rinciobject == undefined) {
                    toastr.error('Rinci object harus di isi')
                    return
                }
                if ($scope.item.subrinci == undefined) {
                    toastr.error('Sub rinci harus di isi')
                    return
                }
                if ($scope.item.subsubrinci == undefined) {
                    toastr.error('Sub sub rinci harus di isi')
                    return
                }
                if ($scope.item.level == undefined) {
                    toastr.error('Level harus di isi')
                    return
                }
                if ($scope.item.urian == undefined) {
                    toastr.error('Urian harus di isi')
                    return
                }

                var objSave =
                {
                    "id": idCoa,
                    "statusenabled": $scope.item.statusenabled.value,
                    "akun": $scope.item.akun,
                    "kelompok": $scope.item.kelompok,
                    "jenis": $scope.item.jenis,
                    "object": $scope.item.object,
                    "rinciobject": $scope.item.rinciobject,
                    "subrinci": $scope.item.subrinci,
                    "subsubrinci": $scope.item.subsubrinci,
                    "level": $scope.item.level,
                    "urian": $scope.item.urian,
                    "kodeakun": $scope.item.kodeakun,
                }
                medifirstService.post('asset/save-master-asset',objSave).then(function (e) {
                    init()
                    $scope.Batal()
                })
            }
            
            $scope.Batal = function () {
                $scope.isEdit = !$scope.isEdit

                delete $scope.item.id
                delete $scope.item.statusenabled
                delete $scope.item.akun
                delete $scope.item.kelompok
                delete $scope.item.jenis
                delete $scope.item.object
                delete $scope.item.rinciobject
                delete $scope.item.subrinci
                delete $scope.item.subsubrinci
                delete $scope.item.level
                delete $scope.item.urian
                delete $scope.item.kodeakun
            }

            $scope.edit = function () {
                if($scope.isEdit == true){
                    var idCoa = ''
                    if ($scope.item.id != undefined)
                        idCoa = $scope.item.id

                    if ($scope.item.statusenabled == undefined) {
                        toastr.error('Status enabled harus di isi')
                        return
                    }
                    if ($scope.item.akun == undefined) {
                        toastr.error('Akun harus di isi')
                        return
                    }
                    if ($scope.item.kelompok == undefined) {
                        toastr.error('Kelompok harus di isi')
                        return
                    }

                    if ($scope.item.jenis == undefined) {
                        toastr.error('Jenis harus di isi')
                        return
                    }

                    if ($scope.item.object == undefined) {
                        toastr.error('Object harus di isi')
                        return
                    }
                    if ($scope.item.rinciobject == undefined) {
                        toastr.error('Rinci object harus di isi')
                        return
                    }
                    if ($scope.item.subrinci == undefined) {
                        toastr.error('Sub rinci harus di isi')
                        return
                    }
                    if ($scope.item.subsubrinci == undefined) {
                        toastr.error('Sub sub rinci harus di isi')
                        return
                    }
                    if ($scope.item.level == undefined) {
                        toastr.error('Level harus di isi')
                        return
                    }
                    if ($scope.item.urian == undefined) {
                        toastr.error('Urian harus di isi')
                        return
                    }

                    var objSave =
                    {
                        "id": $scope.modelGrid.id,
                        "statusenabled": $scope.item.statusenabled.value,
                        "akun": $scope.item.akun,
                        "kelompok": $scope.item.kelompok,
                        "jenis": $scope.item.jenis,
                        "object": $scope.item.object,
                        "rinciobject": $scope.item.rinciobject,
                        "subrinci": $scope.item.subrinci,
                        "subsubrinci": $scope.item.subsubrinci,
                        "level": $scope.item.level,
                        "urian": $scope.item.urian,
                        "kodeakun": $scope.item.kodeakun,
                    }
                    medifirstService.post('asset/edit-master-asset',objSave).then(function (e) {
                        init()
                        $scope.Batal()
                    })
                }else {

                }
            }
            //***********************************
        }
    ]);
});
