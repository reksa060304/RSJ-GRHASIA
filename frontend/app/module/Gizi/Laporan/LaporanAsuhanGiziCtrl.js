define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanAsuhanGiziCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            // $scope.dataPasienSelected = {};

            $scope.isRouteLoading = false;
            var dataMenuSiklus = [];
            var data2 = [];
            var addDataDetail = [];


            loadCombo();


            function loadCombo() {
                var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
                if (chacePeriode != undefined) {

                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }

                medifirstService.get("gizi/get-combo", false).then(function (data) {
                    $scope.listKelas = data.data.kelas;
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listJenisDiet = data.data.jenisdiet;
                    $scope.optJenisDiet = {
                        placeholder: "Pilih Jenis Diet...",
                        dataTextField: "jenisdiet",
                        dataValueField: "id",
                        autoBind: false,
                    };
                    $scope.listKategoriDiet = data.data.kategorydiet;
                    $scope.listJenisWaktu = data.data.jeniswaktu;
                    $scope.listMenu = data.data.produk;
                    loadData();
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatTanggalNoTime = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.SearchData = function () {
                loadData()
            }

            function loadData() {
                dataMenuSiklus = [];
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }
                var noorder = ""
                if ($scope.item.noOrder != undefined) {
                    noorder = "&noorder=" + $scope.item.noOrder
                }
                var jenisDietId = ""
                if ($scope.item.jenisDiets != undefined) {
                    jenisDietId = "&jenisDietId=" + $scope.item.jenisDiets.id
                }
                var jenisWaktuId = ""
                if ($scope.item.jenisWaktu != undefined) {
                    jenisWaktuId = "&jenisWaktuId=" + $scope.item.jenisWaktu.id
                }
                var idpegawai = medifirstService.getPegawaiLogin().id
                console.log(medifirstService.getPegawaiLogin());
                medifirstService.get("gizi/get-laporan-asuhan-gizi?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk + noorder +
                        jenisDietId + jenisWaktuId + '&idpegawai='+ idpegawai )
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data.data
                        for (var i = 0; i < result.length; i++) {
                            result[i].no = i + 1
                            var tanggal = new Date(result[i].tglregistrasi);
                            var tanggalLahir = new Date(result[i].tgllahir);
                            var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                            result[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                            // if (result[i].strukkirimfk != null)
                            // 	result[i].status= "✔" ;
                            // else
                            // 	result[i].status= "✘" ;
                            result[i].jenisdiet = []
                            if (result[i].arrjenisdiet) {
                                var arr = result[i].arrjenisdiet.split(',')
                                if (arr.length > 0) {
                                    for (var x = 0; x < arr.length; x++) {
                                        const jenis = arr[x]
                                        for (var z = 0; z < $scope.listJenisDiet.length; z++) {
                                            const diet = $scope.listJenisDiet[z]
                                            if (jenis == diet.id) {
                                                result[i].jenisdiet.push(diet)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $scope.sourceGrid = new kendo.data.DataSource({
                            data: result,
                            pageSize: 10,
                            total: result.length,
                            serverPaging: false,
                            // group:$scope.group,


                        });
                        $scope.selectedOnCheck = [];
                        var chacePeriode = tglAwal + "~" + tglAkhir;
                        cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
                    });

            };
            $scope.group = {
                field: "jeniswaktu",
                aggregates: [{
                    field: "jeniswaktu",
                    aggregate: "count"
                }]
            };
            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.sourceGrid._data, function (data) {
                    return data.norec_op == dataItem.norec_op;
                });
                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
                        if (dataSelect.norec_op == $scope.selectedOnCheck[i].norec_op) {
                            $scope.selectedOnCheck.splice([i], 1)
                            break
                        }
                    }
                } else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedOnCheck.push(dataSelect)
                }


                /*GET MENU */
                if (dataSelect.statCheckbox) {
                    var tglMenu = moment(dataSelect.tglmenu).format('YYYY-MM-DD');
                    var arrTgl = tglMenu.split('-');
                    // var arrTgl = tglMenu.split('-');
                    if (arrTgl[2] == 31) {
                        arrTgl[2] = 11;
                    } else if ((arrTgl[2] % 10) == 0) {
                        arrTgl[2] = 10;
                    } else {
                        arrTgl[2] = arrTgl[2] % 10;
                    }
                    medifirstService.get("gizi/get-produk-menudiet?jenisDietId=" +
                        dataSelect.objectjenisdietfk +
                        "&kelasId=" + dataSelect.objectkelasfk +
                        "&siklusKe=" + arrTgl[2] +
                        "&jenisWaktuId=" + dataSelect.objectjeniswaktufk +
                        "&kategoryDiet=" + dataSelect.objectkategorydietfk +
                        "&norec_op=" + dataSelect.norec_op +
                        "&norec_pd=" + dataSelect.norec_pd
                    ).then(function (e) {
                        var result = e.data.data
                        result.forEach(function (res) {
                            dataMenuSiklus.push(res)

                        })
                        console.log(JSON.stringify(dataMenuSiklus));

                    })
                } else {
                    for (var i = dataMenuSiklus.length - 1; i >= 0; i--)
                        if (dataMenuSiklus[i].norec_op === dataSelect.norec_op) {
                            dataMenuSiklus.splice(i, 1);
                            // break;
                        }
                    row.removeClass("k-state-selected");
                    console.log(JSON.stringify(dataMenuSiklus));
                }

                /*end Get */
                console.log($scope.sourceGrid)
            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceGrid._data;
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedOnCheck = []
                    }
                } else {
                    isCheckAll = true;

                    for (var i = 0; i < tempData.length; i++) {

                        tempData[i].statCheckbox = true;
                        $scope.selectedOnCheck.push(tempData[i])

                        var tglMenu = moment(tempData[i].tglmenu).format('YYYY-MM-DD');
                        var arrTgl = tglMenu.split('-');
                        medifirstService.get("gizi/get-produk-menudiet?jenisDietId=" +
                            tempData[i].objectjenisdietfk +
                            "&kelasId=" + tempData[i].objectkelasfk +
                            "&siklusKe=" + arrTgl[2] +
                            "&jenisWaktuId=" + tempData[i].objectjeniswaktufk +
                            "&norec_op=" + tempData[i].norec_op +
                            "&norec_pd=" + tempData[i].norec_pd
                        ).then(function (e) {
                            var result = e.data.data
                            result.forEach(function (res) {
                                dataMenuSiklus.push(res)

                            })
                            console.log(JSON.stringify(dataMenuSiklus));

                        })
                    }
                }
                console.log($scope.selectedOnCheck)
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: true,
                });
                var grid = $('#kGrid').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();
            }

            $scope.columnGrid = {
                toolbar: ['excel'],
                excel: {
                    fileName: "Data Laporan Asuhan Gizi"  + ".xlsx",
                    allPages: true,
                }, excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:C1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Asuhan Gizi",
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
                columns: [{
                        "field": "tanggal",
                        "title": "Tgl Asuhan",
                        "width": "80px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nutrisionis",
                        "width": "80px",
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "120px",
                        headerAttributes: {
                            style: "white-space: normal"
                        }
                    },
                ]
            };

            /*END */


        }
    ]);
});