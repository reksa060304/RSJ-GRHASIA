define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DataPiutangInstitusiCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
            var norec = "";
            LoadCombo();
            Load();

            function Load() {
                var chacePeriode = cacheHelper.get('DaftarPenelitianPegawaiCtrl');
                if (chacePeriode != undefined) {
                    // var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglawal = new Date(chacePeriode[0]);
                    $scope.item.tglakhir = new Date(chacePeriode[1]);

                } else {
                    $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            function LoadCombo() {
                medifirstService.get("sdm/penelitian/get-data-combo-penelitian?", true).then(function (datas) {
                    var dat = datas.data;
                    $scope.listDataInstitusiPendidikan = dat.institusi;
                    $scope.listDataFakultas = dat.fakultas;
                });
            }

            function GetData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var NamaPeneliti = "";
                if ($scope.item.NamaPeneliti !== undefined) {
                    NamaPeneliti = "&NamaPeneliti=" + $scope.item.NamaPeneliti
                }
                var JudulPenelitian = "";
                if ($scope.item.JudulPenelitian !== undefined) {
                    JudulPenelitian = "&JudulPenelitians=" + $scope.item.JudulPenelitian;
                }
                var UnitKerja = "";
                if ($scope.item.UnitKerja !== undefined) {
                    UnitKerja = "&UnitKerja=" + $scope.item.UnitKerja;
                }
                medifirstService.get("sdm/penelitian/get-data-piutang-institusi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    NamaPeneliti + JudulPenelitian + UnitKerja, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    var datas = dat.data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                    }

                    $scope.DataPenelitian = new kendo.data.DataSource({
                        data: datas,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('DaftarPenelitianPegawaiCtrl', chacePeriode);
                });
            }

            $scope.SearchData = function (e) {
                GetData()
            }

            $scope.ClearData = function () {
                $scope.item = {};
            }

            $scope.kl = function (current) {
                toastr.info(current.namalengkap + " Terpilih");
                $scope.current = current;
                console.log(JSON.stringify($scope.current));
            }

            $scope.Ubah = function (current) {

                if ($scope.current == undefined) {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }

                var chacePeriode = {
                    0: $scope.current.norec,
                    1: 'EditPenelitianPegawai',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('PenelitianPegawaCtrl', chacePeriode);
                $state.go('PenelitianPegawai', {
                    norec: $scope.current.norec,
                    noOrder: 'EditPenelitianPegawai'
                });
            }

            $scope.Hapus = function (current) {
                if ($scope.current == undefined || $scope.current == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }

                var data = {
                    // kpid:  $scope.current.kpid, 
                    norec: $scope.current.norec,
                    tglbatal: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }

                var objSave = {
                    data: data,
                }

                medifirstService.post('sdm/penelitian/batal-kegiatan-penelitian-pegawai', objSave).then(function (e) {
                    GetData()
                })
            }

            $scope.columnPenelitian = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Piutang Institusi " + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Data Piutang Institusi Pendidikan periode " + moment($scope.item.tglawal).format('DD MMM YYYY') + " S.D " + moment($scope.item.tglakhir).format('DD MMM YYYY'),
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });

                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "kegiatan",
                        "title": "Kegiatan",
                        "width": "200px"
                    },
                    {
                        "field": "jeniskegiatan",
                        "title": "Jenis Pendidikan",
                        "width": "200px"
                    },
                    {
                        "field": "institusipendidikan",
                        "title": "Institusi",
                        "width": "200px"
                    },
                    {
                        "field": "jenjangpendidikan",
                        "title": "Jenjang Pendidikan",
                        "width": "200px"
                    },
                    {
                        "title": "Tanggal Kegiatan",
                        "width": "20%",
                        "columns": [
                            {"field":"tanggalmulai",
                            "width":"80px"},
                            {
                                "template":"S.D",
                                "width": "50px"
                            },
                            {"field": "tanggalselesai",
                            "width": "80px"
                            }
                        ]
                    },
                    {
                        "field": "jumlahpeserta",
                        "title": "Jumlah Mahasiswa",
                        "width": "30px"
                    },
                    {
                        "field": "qty",
                        "title": "Waktu",
                        "width": "30px"
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "130px"
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Tarif",
                        "width": "50px"
                    },
                    {
                        "field": "biayapenelitian",
                        "title": "Tagihan",
                        "width": "80px"
                    },
                    
                ]
            }
        }
    ]);
});