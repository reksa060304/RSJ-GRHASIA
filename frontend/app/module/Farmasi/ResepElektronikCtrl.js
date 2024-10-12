define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResepElektronikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.title = "Resep elektronik";
            $scope.dataVOloaded = true;
            $scope.item = {};
            $rootScope.isOpen = true;
            if ($state.params.noOrder != '-') {
                $scope.noPesanan = $state.params.noOrder
            }
            $scope.listwaktuPakai = [
                { id: 1, waktupakai: 'Pagi' },
                { id: 2, waktupakai: 'Siang' },
                { id: 3, waktupakai: 'Sore' },
                { id: 4, waktupakai: 'Malam' }
            ]
            $scope.selectedData2 = [];
            $scope.selectedData3 = [];
            $scope.cetak = []
            $scope.rmcetak = []
            $scope.startPrint = []
            $scope.fieldset = []
            $scope.resep = []
            $scope.norm = []
            $scope.checkpagi = []
            $scope.checksiang = []
            $scope.checkmalam = []
            $scope.cetakpagi = []
            $scope.cetaksiang = []
            $scope.cetakmalam = []
            $scope.WaktuPakaiMalam = []
            $scope.WaktuPakaiPagi = []
            $scope.WaktuPakaiSiang = []
            $scope.startPrintPagi = []
            $scope.startPrintSiang = []
            $scope.startPrintMalam = []
            FormLoad();
            // $scope.item.namaPasien = "";
            // $scope.item.ruangan = "";
            // $scope.getIsiComboRuangan = function () {
            //     $scope.listRuangan = $scope.departemen.ruangan
            // }
            // $scope.notDetail = true;
            //define column untuk grid

            function FormLoad() {
                medifirstService.get('farmasi/get-datacombo_dp').then(function (e) {
                    $scope.listRuangan = e.data.ruanganpelayanan
                    $scope.listRuanganDepo = e.data.ruanganfarmasi
                })
            }
            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows
                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var isambilobat = kendoGrid.dataItem(row).isambilobat;
                    if (isambilobat != null && isambilobat == '✔') {
                        $(row.cells[2]).addClass("green");
                        $(row.cells[16]).addClass("green");
                    } else {
                        // $(row.cells[1]).addClass("red");
                    }
                    var cito = kendoGrid.dataItem(row).cito;
                    if (cito != null && cito == '✔') {
                        $(row.cells[16]).addClass("red");
                    } else {
                        // $(row.cells[1]).addClass("red");
                    }
                    var statusorder = kendoGrid.dataItem(row).statusorder;
                    if (statusorder != null && statusorder == 'Menunggu') {
                        $(row.cells[11]).addClass("koneng");
                    } else if (statusorder != null && statusorder == 'Verifikasi') {
                        $(row.cells[11]).addClass("green");
                    } else {
                        // $(row.cells[1]).addClass("red");
                    }
                    var iskurir = kendoGrid.dataItem(row).iskurir;
                    if (iskurir != null && iskurir == '✔') {
                        $(row.cells[2]).addClass("koneng");
                        $(row.cells[17]).addClass("koneng");
                    } else {
                        // $(row.cells[1]).addClass("red");
                    }
                    var cekreseppulang = kendoGrid.dataItem(row).cekreseppulang;
                    if (cekreseppulang != null && cekreseppulang == '✔') {
                        // $(row.cells[2]).addClass("koneng");
                        $(row.cells[15]).addClass("hijaumuda");
                    } else {
                        // $(row.cells[1]).addClass("red");
                    }

                }
            }
            $scope.arrColumnGridResepElektronik = {
                dataBound: onDataBound,
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Resep Elektronik",
                    allPages: true,
                },
                // filterable: {
                //     extra: false,
                //     operators: {
                //         string: {
                //             contains: "Contains",
                //             startswith: "Starts with"
                //         }
                //     }
                // },
                selectable: 'row',
                sortable: true,
                scrollable: true,
                pageable: true,
                groupable: true,
                columns: [
                    {
                        "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                        "width": 40
                    },
                    {
                        "field": "noantri",
                        "title": "No Antri",
                        "width": "40px",
                    },
                    {
                        "field": "noorder",
                        "title": "No Pesanan",
                        "width": "60px",


                    }, {
                        "field": "nocm",
                        "title": "No Rekam Medis",
                        "width": "60px",


                    }, {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px",

                    }, {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "60px",

                    }, {
                        "field": "namaruanganrawat",
                        "title": "Ruang Rawat",
                        "width": "100px",

                    }, {
                        template: "#= new moment(new Date(tglorder)).format('DD-MM-YYYY HH:mm:ss') #",
                        "field": "strukOrder.tglOrder",
                        "title": "Tanggal/Jam Masuk",
                        "width": "100px",

                    }, {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "100px",

                    }, {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "60px",

                    }, {
                        hidden: true,
                        "field": "namaruangan",
                        "width": "70px",
                        "title": "Depo",
                        aggregates: ["count"],
                        groupHeaderTemplate: "Ruangan #= value # "

                    }, {
                        "field": "statusorder",
                        "title": "Status",
                        "width": "60px",

                    }, {
                        "field": "namapengambilorder",
                        "title": "Pengambil Obat",
                        "width": "80px",

                    },
                    {
                        "field": "noruangan",
                        "title": "No Ruang",
                        "width": "80px",

                    },
                    {
                        "field": "cekreseppulang",
                        "title": "Resep Pulang",
                        "width": "80px",

                    },
                    {
                        "field": "cito",
                        "title": "Cito",
                        "width": "80px",
                    },
                    {
                        "field": "isbayar",
                        "title": "Sudah dibayar",
                        "width": "80px",

                    },
                    {
                        "field": "isambilobat",
                        "title": "Resep Di Ambil Di RS",
                        "width": "80px",

                    },
                    {
                        "field": "iskurir",
                        "title": "Resep Diantar Kurir",
                        "width": "80px",

                    },
                    {
                        "field": "statusgrab",
                        "title": "Order Grab",
                        "width": "80px",

                    },
                    {
                        "command": [
                            {
                                text: "Selesai",
                                click: updateDone2,
                                imageClass: ""
                            },
                        ],
                        title: "#",
                        width: "80px",
                    },

                    {
                        hidden: true,
                        "field": "jenis",
                        "width": "70px",
                        "title": "Jenis",
                        aggregates: ["count"],
                        groupHeaderTemplate: " #= value # "

                    },]
            };

            LoadCache();
            function LoadCache() {

                var chacePeriode = cacheHelper.get('ResepElektronikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.startDate = new Date(chacePeriode[0]);
                    $scope.untilDate = new Date(chacePeriode[1]);
                    if (chacePeriode[2] != null)
                        $scope.noCm = chacePeriode[2]
                    if (chacePeriode[3] != null)
                        $scope.namaPasien = chacePeriode[3]
                    if (chacePeriode[5] != null)
                        $scope.departemen = chacePeriode[5]
                    if (chacePeriode[6] != null)
                        $scope.checkPasienRanap = chacePeriode[6]
                    if (chacePeriode[7] != null)
                        $scope.checkPasienRajal = chacePeriode[7]

                    // if (chacePeriode[4] != null)
                    //     $scope.noPesanan = chacePeriode[4]


                }
                else {
                    $scope.item.startDate = $scope.now;
                    $scope.item.untilDate = $scope.now;
                }
            }

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            $scope.ruanganId = "";
            $scope.group = {
                field: "jenis",
                aggregates: [{
                    field: "jenis",
                    aggregate: "count"
                }]
            };
            // $scope.arrColumnGridResepElektronik = [{
            //     "field": "strukOrder.noOrder",
            //     "title": "No Pesanan",


            // }, {
            //     "field": "pasien.noCm",
            //     "title": "No Rekam Medis",


            // }, {
            //     "field": "pasien.namaPasien",
            //     "title": "Nama Pasien",

            // }, {
            //     "field": "pasien.jenisKelamin.jenisKelamin",
            //     "title": "Jenis Kelamin",

            // }, {
            //     "field": "strukOrder.ruangan.namaRuangan",
            //     "title": "Ruang Rawat",

            // }, {
            //     template: "#= new moment(new Date(strukOrder.tglOrder)).format('DD-MM-YYYY HH:mm:ss') #",
            //     "field": "strukOrder.tglOrder",
            //     "title": "Tanggal/Jam Masuk",

            // }, {
            //     "field": "penulisResep.namaLengkap",
            //     "title": "Dokter",

            // }, {
            //     "field": "strukOrder.pasienDaftar.kelompokPasien.kelompokPasien",
            //     "title": "Tipe Pasien",

            // }, {
            //     hidden: true,
            //     "field": "strukOrder.ruanganTujuan.namaRuangan",
            //     "title": "Depo",
            //     aggregates: ["count"],
            //     groupHeaderTemplate: "Ruangan #= value # "

            // }, {
            //     "field": "statusAntrian",
            //     "title": "Status",

            // }, {
            //     "field": "strukOrder.namaPengambilOrder",
            //     "title": "Pengambil Obat",

            // }];

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            // $scope.ruanganId = "";
            // $scope.group = {
            //     field: "strukOrder.ruanganTujuan.namaRuangan",
            //     aggregates: [{
            //         field: "strukOrder.ruanganTujuan.namaRuangan",
            //         aggregate: "count"
            //     }]
            // };
            $scope.listStatus = [
                { id: 0, status: 'Menunggu' },
                { id: 1, status: 'Produksi' },
                { id: 2, status: 'Packaging' },
                { id: 3, status: 'Selesai' },
                { id: 4, status: 'Penyerahan Obat' },
                { id: 5, status: 'Verifikasi' },
            ]
            $scope.selectOptionStatus = {
                placeholder: "Status...",
                dataTextField: "status",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,

            };
            $scope.refresh = function () {
                $scope.isRouteLoading = true
                // debugger;

                var nocm = ''
                if ($scope.noCm != undefined) {
                    nocm = '&nocm=' + $scope.noCm
                }
                var namaPasien = ''
                if ($scope.namaPasien != undefined) {
                    namaPasien = '&namaPasien=' + $scope.namaPasien
                }

                var noPesanan = ''
                if ($scope.noPesanan != undefined) {
                    noPesanan = '&noPesanan=' + $scope.noPesanan
                }
                var departemenId = ''
                if ($scope.departemen != undefined) {
                    departemenId = '&departemenId=' + $scope.departemen.id
                }
                var ruanganId = ''
                if ($scope.ruangan != undefined) {
                    ruanganId = '&ruanganId=' + $scope.ruangan.id
                }
                var depoId = ''
                if ($scope.depo != undefined) {
                    depoId = '&depoId=' + $scope.depo.id
                }
                var checkPasienRanap = ''
                if ($scope.checkPasienRanap != undefined) {
                    checkPasienRanap = '&checkPasienRanap=' + $scope.checkPasienRanap
                }
                var checkPasienRajal = ''
                if ($scope.checkPasienRajal != undefined && $scope.checkPasienRajal != false) {
                    checkPasienRajal = '&checkPasienRajal=' + $scope.checkPasienRajal
                }
                // var status = ''
                // if ($scope.status != undefined) {
                //     status = '&statusId=' + $scope.status.id
                // }
                var status = ""
                if ($scope.status != undefined) {
                    if ($scope.status.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.status.length - 1; i >= 0; i--) {
                            var c = $scope.status[i].id
                            b = "," + c
                            a = a + b
                        }
                        status = a.slice(1, a.length)
                    }
                }

                var tglAwal = moment($scope.startDate).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.untilDate).format('YYYY-MM-DD');
                medifirstService.get('farmasi/get-daftar-order?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + nocm + namaPasien + noPesanan + ruanganId + departemenId + '&statusId=' + status + depoId + checkPasienRanap + checkPasienRajal).then(function (e) {
                    // findPasien.findOrderObat($scope.noCm, $scope.ruanganId, $scope.startDate, $scope.untilDate).then(function(e) {
                    var verif = 0
                    var nunggu = 0
                    var raciks = 0
                    var nonraciks = 0
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(e.data[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        e.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        //itungUsia(dat.data[i].tgllahir)


                        if (e.data[i].noorder == e.data[i].noresep) {
                            if (e.data[i].statusorder == 'Menunggu')
                                e.data[i].statusorder = 'Verifikasi'
                        }
                        if (e.data[i].checkreseppulang == '1') {
                            e.data[i].cekreseppulang = '✔'
                        } else {
                            e.data[i].cekreseppulang = '-'
                        }

                        if (e.data[i].isambilobat == true) {
                            e.data[i].isambilobat = "✔"
                        } else {
                            e.data[i].isambilobat = "✘"
                        }
                        if (e.data[i].cito == true) {
                            e.data[i].cito = "✔"
                        } else {
                            e.data[i].cito = "✘"
                        }
                        if (e.data[i].isordergrab == true) {
                            e.data[i].statusgrab = "Sudah Order"
                        } else {
                            e.data[i].statusgrab = "-"
                        }
                        if (e.data[i].iskurir == true) {
                            e.data[i].iskurir = "✔"
                        } else {
                            e.data[i].iskurir = "✘"
                        }
                        if (e.data[i].isbayar == true) {
                            e.data[i].isbayar = "Lunas"
                        } else {
                            e.data[i].isbayar = "Belum dibayar"
                        }

                        if (e.data[i].statusorder == 'Selesai') {
                            verif += 1
                        }
                        if (e.data[i].statusorder == 'Menunggu') {
                            nunggu += 1
                        }
                        if (e.data[i].jenis == 'Racikan') {
                            raciks += 1
                        }
                        if (e.data[i].jenis == 'Non Racikan') {
                            nonraciks += 1
                        }
                    }
                    $scope.verif = verif
                    $scope.nunggu = nunggu
                    $scope.raciks = raciks
                    $scope.nonraciks = nonraciks
                    $scope.isRouteLoading = false
                    e.data.sort(function (a, b) {
                        if (a.noantri < b.noantri) { return -1; }
                        if (a.noantri > b.noantri) { return 1; }
                        return 0;
                    })
                    $scope.patienGrids = new kendo.data.DataSource({
                        //data: ModelItem.beforePost(e.data.data, true),
                        data: ModelItem.beforePost(e.data, true),
                        group: $scope.group
                    });


                });
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.noCm != undefined ? $scope.noCm : null,
                    3: $scope.namaPasien != undefined ? $scope.namaPasien : null,
                    4: null,
                    5: $scope.departemen != undefined ? $scope.departemen : null,
                    6: $scope.checkPasienRanap != undefined ? $scope.checkPasienRanap : null,
                    7: $scope.checkPasienRajal != undefined ? $scope.checkPasienRajal : null
                }
                cacheHelper.set('ResepElektronikCtrl', chacePeriode);
            };
            $scope.refresh();


            $scope.now = new Date();
            $scope.detailOrder = function () {

                //$state.go('ResepElektronikDetail', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });

                // *** OLD
                // var arrStr ={ 0 : $scope.item.nocm ,
                //     1 : $scope.item.namapasien,
                //     2 : $scope.item.jeniskelamin,
                //     3 : $scope.item.noregistrasi, 
                //     4 : $scope.item.umur,
                //     5 : $scope.item.klid,
                //     6 : $scope.item.namakelas,
                //     7 : $scope.item.tglregistrasi,
                //     8 : $scope.item.norec_apd,
                //     9 : 'detail'
                // }
                // cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                // $state.go('TransaksiPelayananApotik')
                var dataSet = []
                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.item.noorder, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglorders = moment(new Date(e.data.strukorder.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noorders = $scope.item.noorder
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    var dataGrids = e.data.orderpelayanan
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.namaruangan = e.data.strukorder.namaruangan
                        if ($scope.item.reseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }
                    // for (var i = e.data.orderpelayanan.length - 1; i >= 0; i--) {
                    //     e.data.orderpelayanan[i].no = i + 1
                    // for (let z = 0; z < e.data[i].details.length; z++) {
                    //     dataSet.push({
                    //         no: z + 1,
                    //         jeniskelamin: e.data[i].jeniskelamin,
                    //         kelompokpasien: e.data[i].kelompokpasien,
                    //         klid: e.data[i].klid,
                    //         namakelas: e.data[i].namakelas,
                    //         namalengkap: e.data[i].namalengkap,
                    //         namapasien: e.data[i].namapasien,
                    //         namapengambilorder: e.data[i].namapengambilorder,
                    //         namaruangan: e.data[i].namaruangan,
                    //         namaruanganrawat: e.data[i].namaruanganrawat,
                    //         nocm: e.data[i].nocm,
                    //         noorder: e.data[i].noorder,
                    //         norec: e.data[i].norec,
                    //         norec_apd: e.data[i].norec_apd,
                    //         noregistrasi: e.data[i].noregistrasi,
                    //         statusorder: e.data[i].statusorder,
                    //         tgllahir: e.data[i].tgllahir,
                    //         tglorder: e.data[i].tglorder,
                    //         tglregistrasi: e.data[i].tglregistrasi,
                    //         aturanpakai: e.data[i].details[z].aturanpakai,
                    //         hargasatuan: e.data[i].details[z].hargasatuan,
                    //         jeniskemasan: e.data[i].details[z].jeniskemasan,
                    //         jumlah: e.data[i].details[z].jumlah,
                    //         namaproduk: e.data[i].details[z].namaproduk,
                    //         noorder: e.data[i].details[z].noorder,
                    //         rke: e.data[i].details[z].rke,
                    //         satuanstandar: e.data[i].details[z].satuanstandar,
                    //         norecresep: e.data[i].details[z].norecresep,
                    //     })

                    // }
                    // }
                    // if (dataSet.length > 0) {
                    //     $scope.item.tglorders = dataSet[0].tglorder
                    //     $scope.item.noorders = dataSet[0].noorder
                    //     $scope.item.dokters = dataSet[0].namalengkap
                    //     $scope.item.statuss = dataSet[0].statusorder
                    // }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.orderpelayanan,
                        pageSize: 1000
                    });


                });
                $scope.popUp.center().open()
            }

            $scope.updateProduksi = function () {
                if ($scope.item.statusorder != 'Menunggu') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 1).then(function(e) {
                    //
                    //managePasien.updateStatusOrder($scope.item.noorder, 1).then(function(e) {
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }

                    var objSave = {
                        noorder: $scope.item.noorder,
                        statusorder: 1,
                        tglambil: null,
                        namapengambil: null,
                        tglselesai: null,
                        namaselesai: null,
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        let params = $scope.item.noregistrasi
                        if ($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi != 'Kios-K') {
                            params = $scope.item.noreservasi
                        }
                        saveAntrol(params, 6, $scope.item.norec) //waktu layan faarmasi
                        medifirstService.postLogging('Rubah Status Produksi Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Produksi Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                $scope.refresh();
                            })

                    });
                } else {
                    toastr.error("Status Data Belum Diverifikasi !!")
                    return;
                }
                //if ($scope.item.statusorder == 'Verifikasi') {

            }

            $scope.updatePackaging = function () {
                if ($scope.item.statusorder != 'Menunggu') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 2).then(function(e) {
                    // managePasien.updateStatusOrder($scope.item.noorder, 2).then(function(e) {
                    //     $scope.refresh();
                    // });;
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }

                    var objSave =
                    {
                        noorder: $scope.item.noorder,
                        statusorder: 2,
                        tglambil: null,
                        namapengambil: null,
                        tglselesai: null,
                        namaselesai: null,
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        medifirstService.postLogging('Rubah Status Packaging Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Packaging Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                $scope.refresh();
                            })
                    });
                } else {
                    if ($scope.item.statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    } else {
                        toastr.error("Status Data Belum Produksi !!")
                        return;
                    }
                }
                //if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Produksi') {

            }
            $scope.updateDone = function () {
                if ($scope.item.statusorder != 'Menunggu') {
                    //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 3).then(function(e) {
                    // managePasien.updateStatusOrder($scope.item.noorder, 3).then(function(e) {
                    //     $scope.refresh();
                    // });;
                    var strukresep = ""
                    if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }
                    var objSave =
                    {
                        noorder: $scope.item.noorder,
                        statusorder: 3,
                        tglambil: null,
                        namapengambil: null,
                        tglselesai: null,
                        namaselesai: 'selesai',
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        var userLogin = medifirstService.getPegawaiLogin();
                        var Norec = $scope.item.noresep;
                        var Noreg = $scope.item.noregistrasi;
                        //grhasia ga perlu cetak ketika tekan selesai
                        // if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai') {
                        //     var stt = 'false'
                        //     if (confirm('View Antrian Farmasi? ')) {
                        //         // Save it!
                        //         stt = 'true';
                        //     } else {
                        //         // Do nothing!
                        //         stt = 'false'
                        //     }
                        //     var client = new HttpClient();
                        //     client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                        //         // aadc=response;
                        //     });
                        // }


                        medifirstService.postLogging('Rubah Status Selasai Order Resep Elektronik', 'No Order Struk Order',
                            $scope.item.noorder, 'Rubah Status Selasai Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                $scope.refresh();
                            })
                    });
                    let params = $scope.item.noregistrasi
                    if ($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi != 'Kios-K') {
                        params = $scope.item.noreservasi
                    }
                    saveAntrol(params, 7, $scope.item.norec)

                } else {
                    if ($scope.item.statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    } else {
                        toastr.error("Status Data Belum Packaging !!")
                        return;
                    }
                }
                //if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging') {

            }
            function updateDone2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.statusorder != 'Menunggu') {
                    var strukresep = ""
                    if (dataItem.noorder == dataItem.noresep) { //resep yang input langsung tanpa order
                        strukresep = true
                    }
                    var objSave =
                    {
                        noorder: dataItem.noorder,
                        statusorder: 3,
                        tglambil: null,
                        namapengambil: null,
                        tglselesai: null,
                        namaselesai: 'selesai',
                        strukresep: strukresep
                    }
                    medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                        var userLogin = medifirstService.getPegawaiLogin();
                        var Norec = dataItem.noresep;
                        var Noreg = dataItem.noregistrasi;


                        medifirstService.postLogging('Rubah Status Selasai Order Resep Elektronik', 'No Order Struk Order',
                            dataItem.noorder, 'Rubah Status Selasai Order Resep Elektronik No Order: ' + dataItem.noorder + '/ Noregistrasi : ' + dataItem.noregistrasi).then(function (res) {
                                $scope.refresh();
                            })
                    });
                    let params = dataItem.noregistrasi
                    if (dataItem.noreservasi != undefined && dataItem.noreservasi != '' && dataItem.noreservasi != 'Kios-K') {
                        params = dataItem.noreservasi
                    }
                    saveAntrol(params, 7, dataItem.norec)
                } else {
                    if (dataItem.statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    } else {
                        toastr.error("Status Data Belum Packaging !!")
                        return;
                    }
                }
            }

            $scope.Riwayat = function () {

                var nocm = "";
                if ($scope.item.nocm) {
                    nocm = $scope.item.nocm;
                }

                console.log(nocm)

                var noregistrasi = "";
                if ($scope.item.noregistrasi) {
                    noregistrasi = $scope.item.noregistrasi;
                }


                medifirstService.get("farmasi/get-transaksi-pelayanan?nocm=" + nocm, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            } else {
                                dat.data[i].cekreseppulang = '-'
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,
                                    details: dataDetail0,
                                    // keterangan:  array[i].keteranganpakai,
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridRiwayatObat = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                    $scope.popUpRiwayat.center().open();
                });
            }
            $scope.onClick = function (e) {

                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.noresep == dataItem.noresep;
                    });
                    console.log(result);
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++) {

                            if ($scope.selectedData2[i].noresep === dataItem.noresep) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }

                        }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++) {
                        if ($scope.selectedData2[i].noresep === dataItem.noresep) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }

                    }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.data22 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        sort: [{ field: "rke", dir: "asc" }],

                    }),
                    resizable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                            "hidden": "true",
                        },
                        {
                            "field": "rke",
                            "title": "R/",
                            "width": "35px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "keteranganpakai",
                            "title": "Keterangan",
                            "width": "400px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        }

                    ]
                }
            };

            $scope.columnGridRiwayatObat = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                    "template": "<span class='style-center'>#: cekreseppulang #</span>"
                }
            ];

            $scope.verifikasi = function () {
                // debugger;
                if ($scope.item.statusorder == 'Menunggu') {
                    var notf = {
                        data: $scope.item.noorder
                    }
                    medifirstService.postNonMessage('farmasi/disable-notif', notf).then(function () {

                    })
                    medifirstService.get("farmasi/get-penjagaan-verif-eresep?noorder=" + $scope.item.noorder).then(function (e) {


                        if (e.data.detail[0].tglresep == null) {
                            var cek = 123;
                        } else {
                            var cek = 234;
                        }

                        console.log(cek);

                        if (cek == 234) {
                            messageContainer.error("Data yang sudah diverif tidak bisa diverif ulang");
                        } else if (cek == 123) {
                            var arrStr = {
                                0: $scope.item.nocm,
                                1: $scope.item.namapasien,
                                2: $scope.item.jeniskelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.klid,
                                6: $scope.item.namakelas,
                                7: $scope.item.tglregistrasi,
                                8: $scope.item.norec_apd,
                                9: $scope.item.noorder,
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                17: $scope.item.cito,
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                        }
                    });
                } else {
                    alert('Sudah di verifikasi!!')
                }

            }
            $scope.preview = function () {
                console.log($scope.item)
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                window.open(config.baseApiBackend + "report/cetak-detail-order?noorder=" + $scope.item.noorder);

                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.item.noorder, true).then(function (dat) {
                });
            }
            $scope.ambilObat = function () {
                if ($scope.item.statusorder == 'Selesai') {
                    // noresep
                    $scope.item.tglambil = new Date()
                    $scope.item.namapengambil = $scope.item.namapasien
                    $scope.alamatlengkap = $scope.item.alamatlengkap
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.item.noantri + '&namapasien=' + $scope.item.nocm + ', ' + $scope.item.namapasien + '&view=true', function (response) {
                        // do something with response
                    });
                    // if ( $scope.item.statusorder == 'Selesai') {
                    let params = $scope.item.noregistrasi
                    if ($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi != 'Kios-K') {
                        params = $scope.item.noreservasi
                    }
                    saveAntrol(params, 7, $scope.item.norec) //waktu penyerahan obat faarmasi
                    // $scope.item.persyaratanAdministrasi1 = 'Belum Sesuai'
                    // $scope.item.persyaratanAdministrasi2 = 'Belum Sesuai'
                    // $scope.item.persyaratanAdministrasi3 = 'Belum Sesuai'
                    // $scope.item.persyaratanAdministrasi4 = 'Belum Sesuai'
                    // $scope.item.persyaratanFarmasetik1 = 'Belum Sesuai'
                    // $scope.item.persyaratanFarmasetik2 = 'Belum Sesuai'
                    // $scope.item.persyaratanFarmasetik3 = 'Belum Sesuai'
                    // $scope.item.persyaratanFarmasetik4 = 'Belum Sesuai'
                    // $scope.item.persyaratanKlinis1 = 'Belum Sesuai'
                    // $scope.item.persyaratanKlinis2 = 'Belum Sesuai'
                    // $scope.item.persyaratanKlinis3 = 'Belum Sesuai'
                    // $scope.item.persyaratanKlinis4 = 'Belum Sesuai'
                    // $scope.item.persyaratanKlinis5 = 'Belum Sesuai'
                    $scope.popup.center().open();
                    //$state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });
                    // $state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.noorder, noAntrianPasien: $scope.item.norec_apd });
                    // } else {
                    // alert('Status harus Selesai!!')
                    // }
                } else {
                    toastr.error("Status Data Harus Selesai !!")
                    return;
                }


            }

            $scope.saveambilobat = function () {
                var nm = ''
                if ($scope.item.namapengambil != undefined) {
                    nm = $scope.item.namapengambil
                }
                var strukresep = ""
                if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                    strukresep = true
                }
                var objSave =
                {
                    noorder: $scope.item.noorder,
                    statusorder: 4,
                    tglambil: moment($scope.item.tglambil).format('YYYY-MM-DD HH:mm'),
                    namapengambil: nm,
                    strukresep: strukresep
                }
                medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                    medifirstService.postLogging('Rubah Status Sudah Di Ambil Order Resep Elektronik', 'No Order Struk Order',
                        $scope.item.noorder, 'Rubah Status Sudah Di Ambil Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                            $scope.refresh();
                            $scope.popup.close()
                        })
                });

            }


            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                // {
                //     "field": "tglorder",
                //     "title": "Tgl Order",
                //     "width" : "50px",
                // },
                // {
                //     "field": "noorder",
                //     "title": "No Order",
                //     "width" : "60px",
                // },
                {
                    field: "rke",
                    title: "Rke",
                    width: "50px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "100px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "100px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "70px",
                }
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];
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
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Kemasan",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Satuan",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Aturan Pakai",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };

            $scope.cetakLabeKecil = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + Norec + '&view=' + stt + '&user=' + userLogin.userLogin, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakLabelRekap = function () {
                var Norec = $scope.item.norecresep;
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + Norec).then(function (dat) {
                        $scope.datas = dat.data;
                        var JmlPagi = 0;
                        var JmlSiang = 0;
                        var JmlSore = 0;
                        var JmlMalam = 0;
                        var stt = 'false'
                        if (confirm('View Label resep? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
                        $scope.datas.forEach(function (element) {
                            var customData = {};
                            for (var key in element) {
                                switch (key) {
                                    case "pagi":
                                        if (element.pagi != '-') {
                                            if (JmlPagi < 1) {
                                                JmlPagi = parseFloat(JmlPagi) + 1;
                                                // var stt = 'false'
                                                var isPagi = 'Pagi';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
                                            }
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
                                            }
                                        }
                                        break;
                                    case "sore":
                                        if (element.sore != '-') {
                                            if (JmlSore < 1) {
                                                JmlSore = parseFloat(JmlSore) + 1;
                                                // var stt = 'false'
                                                var isSore = 'Sore';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
                                            }
                                        }
                                        break;
                                    case "malam":
                                        if (element.malam != '-') {
                                            if (JmlMalam < 1) {
                                                JmlMalam = parseFloat(JmlMalam) + 1;
                                                // var stt = 'false'
                                                var isMalam = 'Malam';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
                                            }
                                        }
                                        break;
                                    default:
                                        customData[key] = element[key];
                                        break;
                                }
                            };
                        });
                    })
                }
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

            $scope.klikGridS = function (dataSelected) {
                $scope.dataSelected = dataSelected;
            }

            $scope.BatalVerifikasi = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                //     return;
                // }

                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //     return;
                // } else {
                if ($scope.item.norecresep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.noorder == $scope.item.noresep) {
                    toastr.error('Tidak bisa Unverifikasi')
                    return
                }

                var stt = 'false'
                if (confirm('Yakin Mau Batal Verifikasi Resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                    stt = 'false'
                }

                if (stt) {
                    medifirstService.get('farmasi/get-nostruk-kasir?norecresep=' + $scope.item.norecresep).then(function (x) {
                        var nostruk = x.data[0].nostruk

                        if (nostruk != null) {
                            toastr.error('Tidak bisa batal verif karena sudah diverif kasir, harap hubungi kasir terlebih dahulu!')
                            return
                        } else {
                            var objDelete = {
                                norec: $scope.item.norecresep,
                                norec_order: $scope.item.norec_order,
                            }
                            medifirstService.post('farmasi/batal-verifikasi-order-resep', objDelete).then(function (e) {
                                medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                                    $scope.refresh()
                                    medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep="
                                        + $scope.item.norecresep).then(function (data) {
                                            // medifirstService.postLogging('Batal Verifikasi Order Resep Elektronik', 'Norec Struk Order', $state.params.noRec, 'Batal Verifikasi Order Resep Elektronik').then(function (res) {
                                            // })
                                        })
                                    // LoadCache()
                                })
                            });
                        }
                    })
                }

                //##save Logging user

                //##end 
                // }
            }

            $scope.cetakNomorAntrian = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                var Norec = $scope.item.noresep;
                var Noreg = $scope.item.noregistrasi;
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var stt = 'false'
                    if (confirm('View Antrian Farmasi? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                        // aadc=response;
                    });
                }
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosa-pasien?noReg=" + noreg
                ).then(function (data) {
                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.item.diagnosa = diagnosa
                    }
                });
            }
            $scope.detailVerif = function () {
                if ($scope.item.norecresep == null)
                    return
                $scope.dataGridVerif = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                medifirstService.get("farmasi/get_detail-resep?norecResep=" + $scope.item.norecresep, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglreseps = moment(new Date($scope.item.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noreseps = e.data.detailresep.noresep
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    $scope.item.namaPasienVerif = $scope.item.namapasien
                    $scope.item.norm = $scope.item.nocm
                    medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noregistrasi).then(function (e) {
                        $scope.item.alamat = e.data.alamatlengkap
                    })
                    loadDiagnosa($scope.item.noregistrasi)

                    var dataGrids = e.data.pelayananPasien
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.statCheckbox = false
                        element.namaruangan = $scope.item.namaruangan
                        if (element.isreseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }

                    $scope.dataGridVerif = new kendo.data.DataSource({
                        data: dataGrids,
                        pageSize: 10
                    });


                });
                $scope.popUpDetailVerif.center().open()
            }
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGridVerif._data;
                console.log(tempData);
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedData3 = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                        $scope.selectedData3.push(tempData[i])
                    }
                }

                console.log($scope.selectedData3)
                reloaddataSourceGrid(tempData);
            }
            function reloaddataSourceGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,
                });
                var grid = $('#kGridVerif').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();

            }
            var isCheckAll = false
            $scope.selectRow = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridVerif").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                if (checked) {
                    var result = $.grep($scope.selectedData3, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        console.log(1);
                        dataItem.statCheckbox = false;

                        $scope.selectedData3.push(dataItem);
                    } else {
                        console.log(2);
                        for (var i = 0; i < $scope.selectedData3.length; i++)
                            if ($scope.selectedData3[i].produkfk === dataItem.produkfk) {
                                $scope.selectedData3.splice(i, 1);
                                break;
                            }
                        $scope.selectedData3.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    console.log(3);
                    dataItem.statCheckbox = true;
                    for (var i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].produkfk === dataItem.produkfk) {
                            $scope.selectedData3.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
                console.log($scope.selectedData3);
            }
            $scope.columnGridVerif = [
                {
                    "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    template: "# if (statCheckbox) { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow($event)' checked />" +
                        "# } else { #" +
                        "<input type='checkbox' class='checkbox' ng-click='selectRow($event)' />" +
                        "# } #",
                    width: "30px"
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    field: "rke",
                    title: "Rke",
                    width: "40px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "80px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "60px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "110px",
                },
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];

            $scope.cetakLabelRekapRajal = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + Norec + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakResepDokter = function () {

                if ($scope.item.noorder == null) {
                    toastr.error("PILIH NO ORDER !!")
                    return;
                } else {
                    var stt = 1
                    if (confirm('Cetak Resep Dengan Qty Setengahnya ? ')) {
                        // Save it!
                        stt = "1/2";
                    } else {
                        // Do nothing!
                        stt = 1
                    }
                    window.open(config.baseApiBackend + "report/cetak-resep-dokter?noorder=" + $scope.item.noorder + "&norec=" + $scope.item.norecresep
                        + "&nocm=" + $scope.item.nocm + '&kodeprofile=' + profile + '&qtybagi=' + stt);
                    // // window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                    //     + '&user=' + user + '&jenis=his', '_blank');
                }
            }
            $scope.cetakResepDokterRev = function () {
                if ($scope.item.statusorder != 'Menunggu') {
                    var local = JSON.parse(localStorage.getItem('profile'));
                    var profile = local.id;
                    if ($scope.item.noorder == null) {
                        toastr.error("PILIH NO ORDER !!")
                        return;
                    } else {
                        $scope.popUpResepDokter.center().open()
                    }
                } else {
                    toastr.error("Status Data Belum Diverifikasi !!")
                    return;
                }
            }
            $scope.CETAKRESEPDOKTERREV = function (data) {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                var stt = 1
                var cetakkin = data
                console.log(data);
                if (data == undefined) {
                    toastr.error("Pilih yang ingin dicetak !!")
                    return
                }
                window.open(config.baseApiBackend + "report/cetak-resep-dokter-rev?noorder=" + $scope.item.noorder + "&norec=" + $scope.item.norecresep +
                    "&nocm=" + $scope.item.nocm + '&kodeprofile=' + profile + '&qtybagi=' + stt + '&cetakkin=' + cetakkin);
                // // window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                //     + '&user=' + user + '&jenis=his', '_blank');
                $scope.popUpResepDokter.close()
            }
            $scope.grab = {
                lokasiPengirim: medifirstService.getProfile().alamatlengkap,
                lokasiPengirimLat: medifirstService.getProfile().lat,
                lokasiPengirimLng: medifirstService.getProfile().lng,
                recipient: {},
                sender: {}
            }

            $scope.orderGrab = function () {
                if ($scope.item.statusorder != 'Selesai') {
                    toastr.error("Status Data Harus Selesai !!")
                    return;
                }
                if ($scope.item.isordergrab == true) {
                    toastr.error("Sudah Di Order !!")
                    return;
                }

                $scope.grab.sender.firstName = medifirstService.getPegawaiLogin().namaLengkap
                $scope.grab.sender.companyName = medifirstService.getProfile().namalengkap
                $scope.grab.recipient.firstName = $scope.item.namapasien
                $scope.grab.recipient.phone = $scope.item.nohp
                $scope.grab.recipient.address = $scope.item.alamatlengkap

                $scope.popupGrab.center().open()
                setMap()

            }
            function setMap() {
                const myLatLng = { lat: parseFloat($scope.grab.lokasiPengirimLat), lng: parseFloat($scope.grab.lokasiPengirimLng) };
                let map = new google.maps.Map(document.getElementById("map"), {
                    center: myLatLng,
                    zoom: 15,
                    mapTypeId: "roadmap",
                    mapTypeControl: false,
                });

            }

            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            function initMap(map_lat, map_lng) {

                let myLatlng = { lat: parseFloat(map_lat), lng: parseFloat(map_lng) };
                let map = new google.maps.Map(document.getElementById("map"), {
                    center: myLatlng,
                    zoom: 15,
                    mapTypeId: "roadmap",
                    mapTypeControl: false,
                });

                var marker = new google.maps.Marker({
                    map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: myLatlng,
                    title: 'Penerima Berada Disini',
                });
                marker.addListener("click", toggleBounce);
            }

            $scope.showPop = function () {
                cacheHelper.set('norec_resep_qwertyuio', undefined);
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                console.log($scope.item)

                medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                    if (rese.data.status == true) {
                        toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                        $scope.isSelesaiPeriksa = true
                        return
                    } else {
                        $scope.listRuanganApd = []

                        $scope.listRuanganApd = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                        $scope.item.ruanganAntrian = $scope.listRuanganApd[0]
                        $scope.popupAntrians.center().open()

                    }
                })
            }


            $scope.inputTindakan = function () {
                if ($scope.item.ruanganAntrian == undefined) return
                medifirstService.get("radiologi/get-apd?noregistrasi="
                    + $scope.item.noregistrasi
                ).then(function (data) {
                    $scope.daftarApd = data.data.ruangan;
                    if ($scope.daftarApd.length > 0) {
                        var status = false
                        var norec_apd = ''
                        for (var i = 0; i < $scope.daftarApd.length; i++) {
                            status = false
                            if ($scope.daftarApd[i].id == $scope.item.ruanganAntrian.id) {
                                status = true
                                norec_apd = $scope.daftarApd[i].norec_apd
                                break
                            }
                        }
                        if (status == true) {
                            $scope.showTindakan(norec_apd)
                        } else {
                            $scope.saveAPD()
                        }
                    }
                })
            }

            $scope.showTindakan = function (norec_apd) {
                cacheHelper.set('norec_resep_qwertyuio', $scope.item.norecresep);
                $state.go('InputTindakan', {
                    norecPD: $scope.item.norec_pd,
                    norecAPD: norec_apd,

                });

            }

            $scope.saveAPD = function (argument) {
                $scope.tombolSimpanVis = true;
                var dataKonsul = {
                    "asalrujukanfk": 5, //datang sendiri
                    "norec_pd": $scope.item.norec_pd,
                    "dokterfk": $scope.item.pgid,
                    "objectruangantujuanfk": $scope.item.ruanganAntrian.id,
                    "objectruanganasalfk": $scope.item.ruid,
                    "objectkelasfk": $scope.item.klid,
                    "tglregistrasidate": moment($scope.item.tglregistrasi).format('YYYY-MM-DD')
                }
                medifirstService.post('radiologi/save-apd', dataKonsul).then(function (e) {
                    $scope.tombolSimpanVis = false;
                    var norec_apd = e.data.data.norec

                    $scope.showTindakan(norec_apd)

                }, function (error) {
                    $scope.tombolSimpanVis = true;
                })
            }

            $scope.lanjutOrderGrab = function () {
                if ($scope.grab.sender.firstName == undefined || $scope.grab.sender.firstName == null || $scope.grab.sender.firstName == '-') {
                    toastr.error('Nama Pengirim tidak boleh Kosong')
                    return
                }
                if ($scope.grab.recipient.address == undefined || $scope.grab.recipient.address == null) {
                    toastr.error('Mohon isi alamat lengkap untuk tujuan pengiriman')
                    return
                }
                if ($scope.grab.recipient.phone == undefined || $scope.grab.recipient.phone == null) {
                    toastr.error('No HP Penerima harus di isi')
                    return
                }
                if ($scope.grab.sender.phone == undefined || $scope.grab.sender.phone == null) {
                    toastr.error('No HP Pengirim harus di isi')
                    return
                }
                if ($scope.grab.sender.email == undefined || $scope.grab.sender.email == null) {
                    toastr.error('Email Pengirim harus di isi')
                    return
                }
                if ($scope.grab.recipient.email == undefined || $scope.grab.recipient.email == null) {
                    toastr.error('Email Penerima harus di isi')
                    return
                }

                var client = new HttpClient();
                $scope.isShowOrder = true
                client.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.grab.recipient.address
                    + '&key=AIzaSyDYhPXYjgCmT7ZO8jZigFm8iPXY_e16C8M', function (response) {
                        var res = JSON.parse(response)
                        if (res.results.length == 0) {
                            toastr.error('Mohon isi alamat dengan lengkap ', 'Koordinat lokasi tidak ditemukan')
                            return
                        } else {
                            toastr.info('Lat : ' + res.results[0].geometry.location.lat + ', Lng : ' + res.results[0].geometry.location.lng, 'Koordinat ditemukan')
                        }

                        $scope.grab.tujuanLat = res.results[0].geometry.location.lat;
                        $scope.grab.tujuanLong = res.results[0].geometry.location.lng;
                        initMap($scope.grab.tujuanLat, $scope.grab.tujuanLong)

                        medifirstService.get("farmasi/get_detail-resep?norecResep=" + $scope.item.norecresep, true).then(function (zz) {
                            let packageDetail = []
                            let totalOrder = 0
                            for (var i = 0; i < zz.data.pelayananPasien.length; i++) {
                                const element = zz.data.pelayananPasien[i]
                                totalOrder = totalOrder + parseFloat(element.total)
                                packageDetail.push({
                                    "name": element.namaproduk,
                                    "description": 'Aturan Pakai :' + element.aturanpakai,
                                    "quantity": element.jumlah,
                                    "price": parseFloat(element.hargasatuan),
                                    "dimensions": {
                                        "height": 0,
                                        "width": 0,
                                        "depth": 0,
                                        "weight": 0
                                    }
                                })
                            }

                            let json = {
                                "req": {
                                    "merchantOrderID": $scope.item.noorder,
                                    "serviceType": "INSTANT",
                                    "paymentMethod": "CASHLESS",
                                    "packages": packageDetail,
                                    "origin": {
                                        "address": $scope.grab.lokasiPengirim,
                                        "coordinates": {
                                            "latitude": parseFloat($scope.grab.lokasiPengirimLat),
                                            "longitude": parseFloat($scope.grab.lokasiPengirimLng)
                                        }
                                    },
                                    "destination": {
                                        "address": $scope.grab.recipient.address,
                                        "coordinates": {
                                            "latitude": parseFloat($scope.grab.tujuanLat),
                                            "longitude": parseFloat($scope.grab.tujuanLong)
                                        }
                                    },
                                    "recipient": {
                                        "firstName": $scope.grab.recipient.firstName,
                                        "lastName": "",
                                        "email": $scope.grab.recipient.email != undefined ? $scope.grab.recipient.email : "",
                                        "phone": $scope.grab.recipient.phone != undefined ? $scope.grab.recipient.phone : "",
                                        "smsEnabled": true
                                    },
                                    "sender": {
                                        "firstName": $scope.grab.sender.firstName,
                                        "companyName": $scope.grab.sender.companyName,
                                        "email": $scope.grab.sender.email != undefined ? $scope.grab.sender.email : "",
                                        "phone": $scope.grab.sender.phone != undefined ? $scope.grab.sender.phone : "",
                                        "smsEnabled": true
                                    },
                                    "orderId": parseFloat($scope.item.noorder),
                                    "totalOrder": totalOrder
                                }
                            }
                            medifirstService.postApi('api/grab/delivery', json).then(function (e) {
                                if (e.data.deliveryID != undefined) {
                                    toastr.success('Sukses Order, status : ' + e.data.status, 'No Kirim : ' + e.data.deliveryID)
                                    updateStatusGrab(e.data)

                                } else if (e.data.message != undefined) {
                                    toastr.error(e.data.message, 'Error')
                                } else {
                                    toastr.error(e.data.arg, 'Error')
                                }

                                $scope.isShowOrder = false
                            }, function (error) {
                                toastr.error('Terjadi Kesalahan ', 'Info')
                                $scope.isShowOrder = false
                            })
                        })
                    });
                // 
            }
            function updateStatusGrab(response) {
                let json = {
                    'isordergrab': true,
                    'statusordergrab': response.status,
                    'norec_order': $scope.item.norec_order,
                    'nokirimgrab': response.deliveryID
                }
                medifirstService.post('farmasi/update-status-grabexpress', json).then(function (e) {
                    $scope.cancelOrder()
                    $scope.refresh()

                })
            }
            $scope.cancelOrder = function () {
                $scope.grab = {
                    lokasiPengirim: medifirstService.getProfile().alamatlengkap,
                    lokasiPengirimLat: medifirstService.getProfile().lat,
                    lokasiPengirimLng: medifirstService.getProfile().lng,
                    recipient: {},
                    sender: {}
                }
                $scope.popupGrab.close()
            }
            function saveAntrol(param, waktu, norec_pd) {
                var data = {
                    "url": "antrean/updatewaktu",
                    "jenis": "antrean",
                    "method": "POST",
                    "data": {
                        "kodebooking": param,
                        "taskid": waktu, //Waktu akhir farmasi/mulai buat obat
                        "waktu": new Date().getTime()
                    }
                }
                saveMonitoringTaksId(norec_pd, waktu, new Date().getTime(), false)
                medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        saveMonitoringTaksId(norec_pd, waktu, new Date().getTime(), true)
                    } else {
                        repeatSendTaskId(norec_pd, waktu)
                    }
                })
            }

            function saveMonitoringTaksId(noregistrasifk, taskid, waktu, statuskirim) {
                var json = {
                    "noregistrasifk": noregistrasifk,
                    "taskid": taskid,
                    "waktu": waktu,
                    "statuskirim": statuskirim
                }
                medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(function (e) { })
            }

            function repeatSendTaskId(norec_pd, taskid) {
                medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(function (e) {
                    var data = {
                        "url": "antrean/add",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": e.data
                    }
                    medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
                        // simpan log
                        medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
                            e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
                            JSON.stringify(data) + ' | ' + JSON.stringify(x.data))

                        // mengabil data catatan task id dari 1 - 4
                        medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
                            updateWaktuId(res, e.data.kodebooking, norec_pd)
                        })
                    })
                })
            }

            async function updateWaktuId(res, kodebooking, norec_pd) {
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    var data = {
                        "url": "antrean/updatewaktu",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": {
                            "kodebooking": kodebooking,
                            "taskid": element.taskid,
                            "waktu": parseInt(element.waktu)
                        }
                    }
                    await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                        if (e.data.metaData.code == 200) {
                            await saveMonitoringTaksId(norec_pd, element.taskid, parseInt(element.waktu), true);
                        }
                    })
                }
            }


            $scope.waktucetak = function () {

                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    if ($scope.checkpagi[i] == true) {
                        $scope.cetakpagi[i] = true
                        $scope.WaktuPakaiPagi[i] = { id: 1, waktupakai: 'Pagi' }
                    } else if ($scope.checkpagi[i] == false) {
                        $scope.cetakpagi[i] = false
                        $scope.WaktuPakaiPagi[i] = undefined
                    }
                    if ($scope.checksiang[i] == true) {
                        $scope.cetaksiang[i] = true
                        $scope.WaktuPakaiSiang[i] = { id: 2, waktupakai: 'Siang' }
                    } else if ($scope.checksiang[i] == false) {
                        $scope.cetaksiang[i] = false
                        $scope.WaktuPakaiSiang[i] = undefined
                    }
                    if ($scope.checkmalam[i] == true) {
                        $scope.cetakmalam[i] = true
                        $scope.WaktuPakaiMalam[i] = { id: 4, waktupakai: 'Malam' }
                    } else if ($scope.checkmalam[i] == false) {
                        $scope.cetakmalam[i] = false
                        $scope.WaktuPakaiMalam[i] = undefined
                    }
                }

            }
            $scope.cetakUDD = function () {
                // if ($scope.item.noorder == undefined){
                //     toastr.error("Pilih Data !!")
                //     return;
                // }
                // if($scope.item.noorder == 'Menunggu'){
                //     toastr.error("Status Data Belum Diverifikasi !!")
                //     return;
                // }
                // $scope.WaktuPakaiPagi = {id:1,waktupakai: 'Pagi'}
                // $scope.WaktuPakaiSiang = {id:2,waktupakai: 'Siang'},
                // $scope.WaktuPakaiMalam = {id:4,waktupakai: 'Malam'}
                // $scope.normcetak = $scope.item.nocm
                // $scope.resepcetak = $scope.item.noresep
                // $scope.popUpDetailUDD.center().open()

                console.log($scope.selectedData2);
                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    if ($scope.selectedData2[i].statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    }
                    if ($scope.selectedData2[0] != undefined) {
                        $scope.norm[0] = $scope.selectedData2[0].nocm
                        $scope.resep[0] = $scope.selectedData2[0].noresep
                        $scope.fieldset[0] = true
                    } else if ($scope.selectedData2[0] == undefined) {
                        $scope.norm[0] = undefined
                        $scope.resep[0] = undefined
                        $scope.fieldset[0] = false
                    }
                    if ($scope.selectedData2[1] != undefined) {
                        $scope.norm[1] = $scope.selectedData2[1].nocm
                        $scope.resep[1] = $scope.selectedData2[1].noresep
                        $scope.fieldset[1] = true
                    } else if ($scope.selectedData2[1] == undefined) {
                        $scope.norm[1] = undefined
                        $scope.resep[1] = undefined
                        $scope.fieldset[1] = false
                    }
                    if ($scope.selectedData2[2] != undefined) {
                        $scope.norm[2] = $scope.selectedData2[2].nocm
                        $scope.resep[2] = $scope.selectedData2[2].noresep
                        $scope.fieldset[2] = true
                    } else if ($scope.selectedData2[2] == undefined) {
                        $scope.norm[2] = undefined
                        $scope.resep[2] = undefined
                        $scope.fieldset[2] = false
                    }


                }

                if ($scope.selectedData2.length > 0 && $scope.selectedData2.length < 4) {
                    $scope.popUpDetailUDD.center().open()
                } else {
                    toastr.error("Checklist maksimal 3")
                    return;
                }
            }

            $scope.cancelCetakUDDnya = function () {
                // $scope.selectedData2 = []
                $scope.popUpDetailUDD.close()
            }
            $scope.CetakUDDnya = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                var noreseparr = [], nocmarr = [], norec_apdarr = [], tglpagiarr = [], tglsiangarr = [], tglmalamarr = [], waktupagiarr = [],
                    waktusiangarr = [],
                    waktumalamarr = []
                var tglpagi = '',
                    tglsiang = '',
                    tglmalam = '',
                    waktupagi = '',
                    waktusiang = '',
                    waktumalam = ''
                var datas = []
                var data = {}
                var pasien1 = ''
                var pasien2 = ''
                var pasien3 = ''
                var cetaknyaatuh = ''
                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    noreseparr[i] = $scope.selectedData2[i].noresep
                    nocmarr[i] = $scope.selectedData2[i].nocm
                    norec_apdarr[i] = $scope.selectedData2[i].norec_apd
                    if ($scope.startPrintPagi[i] != undefined) {
                        tglpagiarr[i] = moment($scope.startPrintPagi[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.startPrintSiang[i] != undefined) {
                        tglsiangarr[i] = moment($scope.startPrintSiang[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.startPrintMalam[i] != undefined) {
                        tglmalamarr[i] = moment($scope.startPrintMalam[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.WaktuPakaiPagi[i] != undefined) {
                        waktupagiarr[i] = $scope.WaktuPakaiPagi[i].id
                    }
                    if ($scope.WaktuPakaiSiang[i] != undefined) {
                        waktusiangarr[i] = $scope.WaktuPakaiSiang[i].id
                    }
                    if ($scope.WaktuPakaiMalam[i] != undefined) {
                        waktumalamarr[i] = $scope.WaktuPakaiMalam[i].id
                    }
                    if ($scope.selectedData2.length == 1) {
                        if ($scope.checkmalam[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktumalamarr[0] + ',' + tglmalamarr[0]
                        }
                        if ($scope.checkpagi[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktupagiarr[0] + ',' + tglpagiarr[0]
                        }
                        if ($scope.checksiang[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktusiangarr[0] + ',' + tglsiangarr[0]
                        }
                        cetaknyaatuh = "pasien1=" + pasien1
                    }
                    if ($scope.selectedData2.length == 2) {
                        if ($scope.checkmalam[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktumalamarr[0] + ',' + tglmalamarr[0]
                        }
                        if ($scope.checkpagi[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktupagiarr[0] + ',' + tglpagiarr[0]
                        }
                        if ($scope.checksiang[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktusiangarr[0] + ',' + tglsiangarr[0]
                        }
                        if ($scope.checkmalam[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktumalamarr[1] + ',' + tglmalamarr[1]
                        }
                        if ($scope.checkpagi[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktupagiarr[1] + ',' + tglpagiarr[1]
                        }
                        if ($scope.checksiang[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktusiangarr[1] + ',' + tglsiangarr[1]
                        }
                        cetaknyaatuh = "pasien1=" + pasien1 + "&pasien2=" + pasien2

                    }
                    if ($scope.selectedData2.length == 3) {
                        if ($scope.checkmalam[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktumalamarr[0] + ',' + tglmalamarr[0]
                        }
                        if ($scope.checkpagi[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktupagiarr[0] + ',' + tglpagiarr[0]
                        }
                        if ($scope.checksiang[0] == true) {
                            pasien1 = norec_apdarr[0] + ',' + nocmarr[0] + ',' + noreseparr[0] + ',' + waktusiangarr[0] + ',' + tglsiangarr[0]
                        }

                        if ($scope.checkmalam[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktumalamarr[1] + ',' + tglmalamarr[1]
                        }
                        if ($scope.checkpagi[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktupagiarr[1] + ',' + tglpagiarr[1]
                        }
                        if ($scope.checksiang[1] == true) {
                            pasien2 = norec_apdarr[1] + ',' + nocmarr[1] + ',' + noreseparr[1] + ',' + waktusiangarr[1] + ',' + tglsiangarr[1]
                        }

                        if ($scope.checkmalam[2] == true) {
                            pasien3 = norec_apdarr[2] + ',' + nocmarr[2] + ',' + noreseparr[2] + ',' + waktumalamarr[2] + ',' + tglmalamarr[2]
                        }
                        if ($scope.checkpagi[2] == true) {
                            pasien3 = norec_apdarr[2] + ',' + nocmarr[2] + ',' + noreseparr[2] + ',' + waktupagiarr[2] + ',' + tglpagiarr[2]
                        }
                        if ($scope.checksiang[2] == true) {
                            pasien3 = norec_apdarr[2] + ',' + nocmarr[2] + ',' + noreseparr[2] + ',' + waktusiangarr[2] + ',' + tglsiangarr[2]
                        }
                        cetaknyaatuh = "pasien1=" + pasien1 + "&pasien2=" + pasien2 + "&pasien3=" + pasien3

                    }
                }

                var noresep = noreseparr.join()
                var nocm = nocmarr.join()
                var norec_apd = norec_apdarr.join()
                if (waktumalamarr.join() != '') {
                    waktumalam = "&waktumalam=" + waktumalamarr.join()
                }
                if (waktupagiarr.join() != '') {
                    waktupagi = "&waktupagi=" + waktupagiarr.join()
                }
                if (waktusiangarr.join() != '') {
                    waktusiang = "&waktusiang=" + waktusiangarr.join()
                }
                if (tglsiangarr.join() != '') {
                    tglsiang = "&tglsiang=" + tglsiangarr.join()
                }
                if (tglpagiarr.join() != '') {
                    tglpagi = "&tglpagi=" + tglpagiarr.join()
                }
                if (tglmalamarr.join() != '') {
                    tglmalam = "&tglmalam=" + tglmalamarr.join()
                }

                console.log(pasien1, pasien2, pasien3);
                window.open(config.baseApiBackend + "report/cetak-udd?" + cetaknyaatuh + '&kodeprofile=' + profile);
                return
                window.open(config.baseApiBackend + "report/cetak-udd?noorder=" + noresep + "&norec_apd=" + norec_apd
                    + "&nocm=" + nocm + '&kodeprofile=' + profile + tglmalam + tglpagi + tglsiang + waktumalam + waktupagi + waktusiang);
            }
            $scope.cetakTilik = function () {
                console.log($scope.selectedData2);
                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    if ($scope.selectedData2[i].statusorder == 'Menunggu') {
                        toastr.error("Status Data Belum Diverifikasi !!")
                        return;
                    }
                    $scope.norm[i] = $scope.selectedData2[i].nocm
                    $scope.resep[i] = $scope.selectedData2[i].noresep
                    $scope.fieldset[i] = true


                }

                if ($scope.selectedData2.length > 0 && $scope.selectedData2.length < 4) {
                    $scope.popUpDetailTilik.center().open()
                } else {
                    toastr.error("Checklist maksimal 3")
                    return;
                }
            }

            $scope.cancelCetakTiliknya = function () {
                for (let i = 0; i < $scope.selectedData2.length; i++) { }
                $scope.popUpDetailTilik.close()
            }
            $scope.CetakTiliknya = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                var noreseparr = [],
                    nocmarr = [],
                    norec_apdarr = [],
                    tglpagiarr = [],
                    tglsiangarr = [],
                    tglmalamarr = [],
                    waktupagiarr = [],
                    waktusiangarr = [],
                    waktumalamarr = []
                var tglpagi = '',
                    tglsiang = '',
                    tglmalam = '',
                    waktupagi = '',
                    waktusiang = '',
                    waktumalam = ''

                for (let i = 0; i < $scope.selectedData2.length; i++) {
                    noreseparr[i] = $scope.selectedData2[i].noresep
                    nocmarr[i] = $scope.selectedData2[i].nocm
                    norec_apdarr[i] = $scope.selectedData2[i].norec_apd
                    console.log($scope.startPrintPagi[i]);
                    if ($scope.startPrintPagi[i] != undefined) {
                        tglpagiarr[i] = moment($scope.startPrintPagi[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.startPrintSiang[i] != undefined) {
                        tglsiangarr[i] = moment($scope.startPrintSiang[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.startPrintMalam[i] != undefined) {
                        tglmalamarr[i] = moment($scope.startPrintMalam[i]).format('YYYY-MM-DD')
                    }
                    if ($scope.WaktuPakaiPagi[i] != undefined) {
                        waktupagiarr[i] = $scope.WaktuPakaiPagi[i].id
                    }
                    if ($scope.WaktuPakaiSiang[i] != undefined) {
                        waktusiangarr[i] = $scope.WaktuPakaiSiang[i].id
                    }
                    if ($scope.WaktuPakaiMalam[i] != undefined) {
                        waktumalamarr[i] = $scope.WaktuPakaiMalam[i].id
                    }

                }
                var noresep = noreseparr.join()
                var nocm = nocmarr.join()
                var norec_apd = norec_apdarr.join()
                if (waktumalamarr.join() != '') {
                    waktumalam = "&waktumalam=" + waktumalamarr.join()
                }
                if (waktupagiarr.join() != '') {
                    waktupagi = "&waktupagi=" + waktupagiarr.join()
                }
                if (waktusiangarr.join() != '') {
                    waktusiang = "&waktusiang=" + waktusiangarr.join()
                }
                if (tglsiangarr.join() != '') {
                    tglsiang = "&tglsiang=" + tglsiangarr.join()
                }
                if (tglpagiarr.join() != '') {
                    tglpagi = "&tglpagi=" + tglpagiarr.join()
                }
                if (tglmalamarr.join() != '') {
                    tglmalam = "&tglmalam=" + tglmalamarr.join()
                }
                window.open(config.baseApiBackend + "report/cetak-tilik?noorder=" + noresep + "&norec_apd=" + norec_apd +
                    "&nocm=" + nocm + '&kodeprofile=' + profile + tglmalam + tglpagi + tglsiang + waktumalam + waktupagi + waktusiang);
            }
            $scope.copyResep = function () {
                console.log($scope.item);
                if (Object.keys($scope.item).length == 0) {
                    toastr.error('Pilih data Pasien!')
                    return
                }
                window.open("/app/#/CopyResepCtrl/" + $scope.item.norec_order)

            }
            $scope.tombolotomatis = function () {
                var data = {}
                medifirstService.post('updatebro', data).then(function (data) {
                    console.log(data)
                })
            }
            $scope.daftarobatpulang = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu!')
                    return
                }
                if ($scope.item.statusorder == 'Menunggu') {
                    toastr.error('Resep belum di verifikasi')
                    return
                }
                // if ($scope.item.checkreseppulang != true ){
                //     toastr.error('Bukan Resep Pulang')
                //     return
                // }
                $scope.detailVerif()
                $scope.popUpDetailVerif.center().open()


            }

            // Tombol EMR
            $scope.emr = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                cacheHelper.set('cacheRekamMedis', undefined);
                cacheHelper.set('cacheRMelektronik', undefined);
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan + '`',
                    19: $scope.item.objectdepartemenfk
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                $state.go('RekamMedis.AsesmenMedis', {
                    noRec: $scope.item.norec_apd
                })
            }

            //** BATAS SUCI */
            $scope.cetakobatpulang = function () {
                var a = ""
                var b = ""
                for (var i = $scope.selectedData3.length - 1; i >= 0; i--) {
                    var c = $scope.selectedData3[i].produkfk
                    b = "," + c
                    a = a + b
                }
                $scope.produkfkkkk = a.slice(1, a.length)
                window.open(config.baseApiBackend + "report/cetak-obat-pulang?norec_order=" + $scope.item.norec_order + "&kdprofile=30" + "&produkfk=" + $scope.produkfkkkk + "&pegawai=" + medifirstService.getPegawaiLogin().id, '_BLANK')

            }
        }

    ]);
});