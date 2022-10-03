define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('MasterDataKampusCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem', '$timeout',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem, $timeout) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.currentKeterangan = [];
            $scope.item.namainstansi = medifirstService.getPegawaiLogin().namaLengkap;
            $scope.item.namauser = medifirstService.getUserLogin().kdUser;
            $scope.djp = 0;
            $scope.pemb = true;
            $scope.tbhbtn = true;
            $scope.updbtn = false;
            $scope.ru = true;
            var noOrder = '';
            var NorecKpe = '';
            var norec_kpe = '';
            var norecmhs = '';
            var gambar = ""
            var norecMs = "";
            // var images = ""
            loadDataCombo();
            // LoadCache();

            // function LoadCache() {
            //     var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
            //     if (chacePeriode != undefined) {
            //         NorecKpe = chacePeriode[0]
            //         noOrder = chacePeriode[1]
            //         init()
            //         var chacePeriode = {
            //             0: '',
            //             1: '',
            //             2: '',
            //             3: '',
            //             4: '',
            //             5: '',
            //             6: ''
            //         }
            //         cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
            //     } else {
            //         init()
            //     }
            // }
         

            function loadDataCombo() {
                $scope.isRouteLoading = true;
                medifirstService.get("diklat/get-combo-diklat?").then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.masterdatakampus
                    
                    $scope.dataSourceGridMasterDataKampus = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                    });
                });


            }
            $scope.columnGridMasterDataKampus = {
                toolbar: ["excel", ],
                excel: {
                    fileName: "Laporan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var departemenss = "";
                    if ($scope.item.departement != undefined) {
                        departemenss = $scope.item.departement.departemen;
                    }
                    if ($scope.item.departemen != undefined) {
                        departemenss = $scope.item.departemen.departemen;
                    }
                    if ($scope.item.departement == undefined && $scope.item.departemen == undefined) {
                        departemenss = "Rumah Sakit Jiwa Grhasia";
                    }
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan " + departemenss,
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
                groupable: false,

                columns: [{
                        field: "id",
                        title: "Id",
                        width: "70px",
                    },
                    {
                        field: "namalengkap",
                        title: "Nama Institusi",
                        width: "100px",
                    },
                    {
                        field: "alamat",
                        title: "Alamat",
                        width: "70px",
                    },
                    {
                        field: "email",
                        title: "Email",
                        width: "70px",
                    },
                    {
                        field: "namapj",
                        title: "Penanggung Jawab",
                        width: "100px",
                    },
                    {
                        field: "nohandphone",
                        title: "No. Telphone",
                        width: "100px",
                    },
                    {
                        field: "usereksternal",
                        title: "User Eksternal",
                        width: "100px",
                    },
                    


                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }

            $scope.klikGrid = function (dataSelected) {
                $scope.updbtn = true
                $scope.tbhbtn = false
                console.log(dataSelected);
                $scope.item.institusi = dataSelected.namalengkap
                $scope.item.hp = dataSelected.nohandphone
                $scope.item.pj = dataSelected.namapj
                $scope.item.alamat = dataSelected.alamat
                $scope.item.email = dataSelected.email
            }

            function init() {
                
            }



            $scope.addListKeterangan = function (bool, data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }

            }

            $scope.Batal = function () {
                $scope.item = {};
            }



            $scope.tambahKampus = function () {
                $scope.isRouteLoading = true
                var id ="";
                var objSave = {
                    "id": id,
                    'namalengkap':$scope.item.institusi,
                    'nohandphone': $scope.item.hp,
                    'nama':$scope.item.pj,
                    'alamat':$scope.item.alamat,
                    'email': $scope.item.email
                }
                medifirstService.post('diklat/save-master-data-kampus', objSave).then(function(){
                    $scope.item = {};
                    $scope.isRouteLoading= false
                    loadDataCombo()
                })
            }

            $scope.updated = function () {
                var id = $scope.dataSelected.id
                var data = {
                    "id": id,
                    'namalengkap': $scope.item.institusi,
                    'nohandphone': $scope.item.hp,
                    'nama': $scope.item.pj,
                    'alamat': $scope.item.alamat,
                    'email': $scope.item.email
                }
                medifirstService.post('diklat/save-master-data-kampus', data).then(function (e) {
                    $scope.item = {};
                    $scope.isRouteLoading = false;
                    $scope.updbtn = false
                    $scope.tbhbtn = true
                    loadDataCombo();
                })
            }
            //tambah ruangan
            $scope.tambahRuangan = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                    return
                }
                $scope.item.nimm = $scope.dataSelected.nim
                $scope.item.namaPasien = $scope.dataSelected.nama;
                $scope.item.jeniskelamin = $scope.dataSelected.jeniskelamin;
                // $scope.itemDd.noRM = $scope.dataPasienSelectedR.nocm;
                // $scope.itemDd.namaPasien = $scope.dataPasienSelectedR.namapasien;
                // $scope.itemDd.tglLahir = moment($scope.dataPasienSelectedR.tgllahir).format('DD-MM-YYYY');
                // $scope.itemDd.noRegistrasi = $scope.dataPasienSelectedR.noregistrasi;
                loadDetailRiwayat();
                $scope.popUpTambahRuangan.center().open();
                var actions = $scope.popUpTambahRuangan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTambahRuangan.setOptions({
                    actions: actions
                });

            }

            $scope.TutupPopUps = function () {
                // $scope.itemDd.noRM = undefined;
                // $scope.itemDd.namaPasien = undefined;
                // $scope.itemDd.tglLahir = undefined;
                // $scope.itemDd.noRegistrasi = undefined;
                // $scope.itemDd.JumlahRawat = undefined;
                // $scope.dataDetailRegistrasi = new kendo.data.DataSource({
                //     data: []
                // });
                $scope.popUpTambahRuangan.close();
            }

            function loadDetailRiwayat() {
                $scope.isRouteLoading = true
                medifirstService.get("sdm/pendidikan/get-detail-pdruangan?noregistrasi=" + $scope.dataSelected.norec_eks).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataa = data.data.data;
                    for (var i = 0; i < dataa.length; i++) {
                        dataa[i].no = i + 1
                    }
                    $scope.dataDetail = new kendo.data.DataSource({
                        data: dataa,
                        pageSize: 10,
                        total: dataa.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }

            $scope.SearchEnterDetail = function () {
                loadDetailRiwayat();
            }
            $scope.columnDetail = {
                toolbar: ["excel", ],
                excel: {
                    fileName: "Laporan .xlsx",
                    allPages: true,
                },
                excelExport: function (e) {

                },
                groupable: false,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px",
                    },
                    {
                        field: "ruanganlast",
                        title: "Ruangan",
                        width: "100px",
                    },
                    {
                        field: "namalengkap",
                        title: "Pembimbing",
                        width: "100px",
                    },
                    {
                        field: "tglmasuk",
                        title: "Tanggal Masuk",
                        width: "100px",
                    }, {
                        field: "tglkeluar",
                        title: "Tanggal Keluar",
                        width: "100px",
                    },
                    {
                        "command": [{
                            text: "Hapus",
                            click: deleteRows
                        }],
                        width: 70
                    }
                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }
            $scope.saveruangan = function () {
                // $scope.isRouteLoading = true;
                //bikin if untuk ruangan dan pegawai

                var norec = ''
                $scope.ruangan = null
                var data = {
                    "norec": norec,
                    "noregistrasifk": $scope.dataSelected.norec_eks,
                    "tglmasuk": moment($scope.item.tglmasuk).format('YYYY-MM-DD'),
                    "tglkeluar": moment($scope.item.tglkeluar).format('YYYY-MM-DD'),
                    "objectruanganasalfk": $scope.ruangan ? $scope.ruangan : null,
                    "objectruanganlastfk": $scope.item.ruangan.id,
                    "objectpegawaifk": $scope.item.pegawai.id,
                    "norec_pdruangan": $scope.norec_maeks,
                };
                // return
                medifirstService.post('sdm/pendidikan/save-pdruangan', data).then(function (e) {
                    // $scope.item = {};
                    // $state.go('DaftarPenelitianEksternal')
                    $scope.isRouteLoading = false;
                    $scope.item.ruangan = undefined
                    $scope.item.pegawai = undefined
                    $scope.item.tglmasuk = undefined
                    $scope.item.tglkeluar = undefined
                    loadDataCombo();
                    loadDetailRiwayat();
                })
            }

            $scope.deletedRow = function () {
                $scope.isRouteLoading = true;
                var datasend = {
                    "id": $scope.dataSelected.id
                };
                console.log(datasend);
                // return
                $scope.isRouteLoading = true;

                medifirstService.post("diklat/hapus-master-data-kampus", datasend).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.item = {};
                    $scope.tbhbtn = true
                    $scope.updbtn = false
                    loadDataCombo();
                });
            }

            function deleteRows(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    // "a": 'okee',
                    "norec": dataItem.norec
                };
                // return
                medifirstService.post("sdm/pendidikan/save-pdruangan", datasend).then(function (e) {
                    loadDetailRiwayat();
                });
            }

            function cetaksertifikat(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                if (local != null) {
                    var profile = local.id;
                    var norec = dataItem.norec_eks;
                    console.log(dataItem);
                    // return
                    window.open(configuration.baseApiBackend + "report/cetak-sertifikat?norec=" + norec + '&kdprofile=' + profile +
                        '&nama=' + nama, '_blank');
                }
            }
            var timeoutPromise;
            $scope.$watch('item.institusi', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal);
                    }
                }, 500)
            });
            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];
                console.log(filterField, filterValue);
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }
                if (filterField === "namalengkap") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                }
                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
                var allData = dataGrid.dataSource.data();
                var params = dataGrid.dataSource.filter();
                var query = new kendo.data.Query(allData);
                $scope.filteredData = query.filter(params).data;
            }
        }
    ]);
});