define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPengeluaranBarangPerBulanCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarDistribusiBarangPerUnitCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }

            function loadCombo() {
                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listRuanganAsal = dataCombo.ruanganall;
                    $scope.listRuangan = dataCombo.ruanganall;
                    $scope.listKelompokBarang = dataCombo.kelompokproduk;
                    $scope.listJenisProduk = dataCombo.jenisproduk;
                    $scope.listAsalProduk = dataCombo.asalproduk;
                    $scope.listBulan = dataCombo.bulan;

                });
            }
            $scope.getJenisProduk = function () {
                var data = []
                for (let i = 0; i < $scope.listJenisProduk.length; i++) {
                    const element = $scope.listJenisProduk[i];
                    if (element.objectkelompokprodukfk == $scope.item.kelompokBarang.id) {
                        data.push(element)
                    }
                }

                $scope.listJenisBarang = data
            }
            function init() {
                $scope.isRouteLoading = true;
                var tglAwal =""
                var tglAkhir = ""
                var bulan = ""
                if ($scope.item.bulan != undefined) {
                    bulan = $scope.item.bulan.id
                }
                if (bulan == 1){
                    tglAwal = new Date(new Date().getFullYear() +'-01-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-01-31 23:59')
                }else if (bulan == 2){
                    tglAwal = new Date(new Date().getFullYear() +'-02-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-02-29 23:59')
                }else if (bulan == 3){
                    tglAwal = new Date(new Date().getFullYear() +'-03-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-03-31 23:59')
                }else if (bulan == 4){
                    tglAwal = new Date(new Date().getFullYear() +'-04-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-04-30 23:59')
                }else if (bulan == 5){
                    tglAwal = new Date(new Date().getFullYear() +'-05-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-05-31 23:59')
                }else if (bulan == 6){
                    tglAwal = new Date(new Date().getFullYear() +'-06-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-06-30 23:59')
                }else if (bulan == 7){
                    tglAwal = new Date(new Date().getFullYear() +'-07-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-07-31 23:59')
                }else if (bulan == 8){
                    tglAwal = new Date(new Date().getFullYear() +'-08-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-08-31 23:59')
                }else if (bulan == 9){
                    tglAwal = new Date(new Date().getFullYear() +'-09-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-09-30 23:59')
                }else if (bulan == 10){
                    tglAwal = new Date(new Date().getFullYear() +'-10-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-10-31 23:59')
                }else if (bulan == 11){
                    tglAwal = new Date(new Date().getFullYear() +'-11-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-11-30 23:59')
                }else {
                    tglAwal = new Date(new Date().getFullYear() +'-12-01 00:00')
                    tglAkhir = new Date(new Date().getFullYear() +'-12-31 23:59')
                }

                tglAwal = moment(tglAwal).format('YYYY-MM-DD 00:00');
                tglAkhir = moment(tglAkhir).format('YYYY-MM-DD 00:00');

                medifirstService.get("logistik/get-daftar-bareng-per-bulan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&bulan=" + bulan
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data;
                        var jenistransfer = '';
                        var subtotal = 0;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                            // datas[i].statCheckbox = false;
                            if (datas[i].jenispermintaanfk == 1) {
                                jenistransfer = "Amprahan";
                            } else {
                                jenistransfer = "Transfer";
                            }
                            datas[i].jenispermintaan = jenistransfer;
                            subtotal = parseFloat(datas[i].total) + subtotal
                        }
                        $scope.subTotals = subtotal
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                        pegawaiUser = dat.data.datalogin
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
                cacheHelper.set('DaftarDistribusiBarangPerUnitCtrl', chacePeriode);


            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.NewKirim = function () {
                $state.go('KirimBarangLogistik')
            }

            $scope.EditKirim = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di ubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: '',
                    2: 'EditKirim',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }

            $scope.Cetak = function () {
                var stt = 'false'
                if (confirm('View Bukti Kirim? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-pengeluaran=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    }
                ]
            };
            $scope.aggregate = [
                {
                    field: "namaruangan",
                    aggregate: "count"
                }
            ]

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Laporan Distribusi Barang Per Unit  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Rekap Pengeluaran Barang Gudang",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 20 });
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
                        "field": "namaproduk",
                        "title": "Produk",
                        "width": "150px",
                        // "template": "<span class='style-right'>{{formatTanggal('#: tglkirim #', '')}}</span>"
                    },
                    {
                        "field": "satuanstandar",
                        "title": "satuan",
                        "width": "60px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "100px",
                        template: "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp. ')}}</span>",
                    },{
                        "field": "tgl1",
                        "title": "1",
                        "width": "50px",
                    },
                    {
                        "field": "tgl2",
                        "title": "2",
                        "width": "50px",
                    },
                    {
                        "field": "tgl3",
                        "title": "3",
                        "width": "50px",
                    },
                    {
                        "field": "tgl4",
                        "title": "4",
                        "width": "50px",
                    },
                    {
                        "field": "tgl5",
                        "title": "5",
                        "width": "50px",
                    },
                    {
                        "field": "tgl6",
                        "title": "6",
                        "width": "50px",
                    },
                    {
                        "field": "tgl7",
                        "title": "7",
                        "width": "50px",
                    },
                    {
                        "field": "tgl8",
                        "title": "8",
                        "width": "50px",
                    },
                    {
                        "field": "tgl9",
                        "title": "9",
                        "width": "50px",
                    },
                    {
                        "field": "tgl10",
                        "title": "10",
                        "width": "50px",
                    },
                    {
                        "field": "tgl11",
                        "title": "11",
                        "width": "50px",
                    },
                    {
                        "field": "tgl12",
                        "title": "12",
                        "width": "50px",
                    },
                    {
                        "field": "tgl13",
                        "title": "13",
                        "width": "50px",
                    },
                    {
                        "field": "tgl14",
                        "title": "14",
                        "width": "50px",
                    },
                    {
                        "field": "tgl15",
                        "title": "15",
                        "width": "50px",
                    },
                    {
                        "field": "tgl16",
                        "title": "16",
                        "width": "50px",
                    },
                    {
                        "field": "tgl17",
                        "title": "17",
                        "width": "50px",
                    },
                    {
                        "field": "tgl18",
                        "title": "18",
                        "width": "50px",
                    },
                    {
                        "field": "tgl19",
                        "title": "19",
                        "width": "50px",
                    },
                    {
                        "field": "tgl20",
                        "title": "20",
                        "width": "50px",
                    },
                    {
                        "field": "tgl21",
                        "title": "21",
                        "width": "50px",
                    },
                    {
                        "field": "tgl22",
                        "title": "22",
                        "width": "50px",
                    },
                    {
                        "field": "tgl23",
                        "title": "23",
                        "width": "50px",
                    },
                    {
                        "field": "tgl24",
                        "title": "24",
                        "width": "50px",
                    },
                    {
                        "field": "tgl25",
                        "title": "25",
                        "width": "50px",
                    },
                    {
                        "field": "tgl26",
                        "title": "26",
                        "width": "50px",
                    },
                    {
                        "field": "tgl27",
                        "title": "27",
                        "width": "50px",
                    },
                    {
                        "field": "tgl28",
                        "title": "28",
                        "width": "50px",
                    },
                    {
                        "field": "tgl29",
                        "title": "29",
                        "width": "50px",
                    },
                    {
                        "field": "tgl30",
                        "title": "30",
                        "width": "50px",
                    },
                    {
                        "field": "tgl31",
                        "title": "31",
                        "width": "50px",
                    },
                    // {
                    //     hidden: true,
                    //     field: "namaruangan",
                    //     title: "Nama Ruangan",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                    // }
                ]
            }

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "30px",
                        }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatRupiah = function (value, number) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, ",");
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

            $scope.CetakDaftar = function () {
                var user = medifirstService.getPegawaiLogin();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59:59');
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = $scope.item.ruangan.id
                }

                var ra = ""
                if ($scope.item.RuanganAsal != undefined) {
                    var ra = $scope.item.RuanganAsal.id
                }

                var stt = 'false'
                if (confirm('View Daftar Pengeluaran Barang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-daftar-pengeluaran-barang=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuanganAsal=' + ra + '&idRuanganTuj=' + rg + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    //aadc=response;
                });
            }

            //***********************************
        }
    ]);
});
