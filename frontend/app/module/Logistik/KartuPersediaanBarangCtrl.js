define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KartuPersediaanBarangCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper',
        function ($scope, medifirstService, $state, cacheHelper, dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            var details = [];
            var details2 = [];
            var details3 = [];
            var details4 = [];
            var details5 = [];
            var details6 = [];
            var details7 = [];
            var details8 = [];
            var detailsAll = [];
            $scope.selectedJenisProduk = []
            $scope.selectedDetailJenis = []
            LoadCache();
            loadCombo();
            $scope.item.neraca = false;
            var tglawal = moment($scope.item.tglAwal).format('YYYY-MM-DD 00:00');
            var tglakhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
            $scope.selectOptionsDetailJenis = {
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };

            $scope.selectOptJenisProduk = {
                dataTextField: "jenisproduk",
                dataValueField: "id",
                filter: "contains"
            };

            function LoadCache() {
                var chacePeriode = cacheHelper.get('KartuPersediaanBarangCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'))
                }
            }

            function loadCombo() {
                $scope.listDataRuangan = medifirstService.getMapLoginUserToRuangan();
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangLogistik')
            }

            function init() {
                $scope.isRouteLoading = true;
                var IdRuangan = ""
                if ($scope.item.namaRuangan != undefined) {
                    IdRuangan = "&ruanganfk=" + $scope.item.namaRuangan.id
                }
                var IdProduk = ""
                if ($scope.item.nmProduk != undefined) {
                    IdProduk = "&nmproduk=" + $scope.item.nmProduk
                }               
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-kartu-persediaan-barang?tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir + IdProduk + IdRuangan, true).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;
                        var saldoawal = 0.0;
                        var saldoakhir = 0.0;
                        var saldomasuk = 0.0;
                        var saldokeluar = 0.0;
                        var hargamasuk = 0;
                        var hargakeluar = 0;
                        var hargasisa = 0;                        
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            saldoakhir = parseFloat(datas[i].saldoakhir);
                            datas[i].saldoakhir = saldoakhir
                            // if(datas[i].status != ""){
                            if (datas[i].status == true) {
                                saldomasuk = parseFloat(datas[i].jumlah);
                                // hargamasuk = parseFloat(datas[i].harganetto1)
                                datas[i].saldomasuk = saldomasuk;
                                datas[i].saldokeluar = parseFloat(saldokeluar);
                                saldoawal = (parseFloat(datas[i].saldoakhir) - parseFloat(datas[i].jumlah));
                                datas[i].saldoawal = saldoawal;
                                datas[i].hargamasuk = hargamasuk + (parseFloat(datas[i].jumlah) * parseFloat(datas[i].harganetto1))
                            } else {                                
                                datas[i].saldomasuk = parseFloat(0);
                                datas[i].saldokeluar = parseFloat(datas[i].jumlah);
                                datas[i].saldoawal = (parseFloat(datas[i].saldoakhir) + parseFloat(datas[i].jumlah));
                                datas[i].hargakeluar = hargakeluar + (parseFloat(datas[i].jumlah) * parseFloat(datas[i].harganetto1))
                            }
                            datas[i].hargasisa = saldoakhir * parseFloat(datas[i].harganetto1);
                            if (datas[i].flag != undefined) {
                                datas[i].flag = datas[i].flag;
                            }else{
                                datas[i].flag = '-';
                            }
                        }

                        for (var i in datas) {
                            datas[i].saldomasuk = parseFloat(datas[i].saldomasuk.toFixed(2));
                            datas[i].saldokeluar = parseFloat(datas[i].saldokeluar.toFixed(2));
                            datas[i].saldoawal = parseFloat(datas[i].saldoawal.toFixed(2));
                            datas[i].saldoakhir = parseFloat(datas[i].saldoakhir.toFixed(2));
                            if (datas[i].hargamasuk == undefined) {
                                datas[i].hargamasuk = 0
                            }
                            if (datas[i].hargakeluar == undefined) {
                                datas[i].hargakeluar = 0
                            }
                            if (datas[i].hargasisa == undefined) {
                                datas[i].hargasisa = 0
                            }
                            datas[i].hargamasuk = parseFloat(datas[i].hargamasuk).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            datas[i].hargakeluar = parseFloat(datas[i].hargakeluar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            datas[i].hargasisa = parseFloat(datas[i].hargasisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 20,
                            total: datas.length,
                            serverPaging: false,
                        });
                        $scope.dataExcel = datas;
                        $scope.isRouteLoading = false;
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
                cacheHelper.set('KartuPersediaanBarangCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.cariPopUp = function () {
                console.log($scope.selectedJenisProduk)
                init();
                $scope.popUpCari.close()
            }

            $scope.batal = function () {
                $scope.popUpCari.close()
            }

            $scope.Neraca = function () {
                // debugger;
                if ($scope.item.neraca == true) {
                    $scope.item.ruangan = ''
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Kartu Persediaan Barang" + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + '-' + moment($scope.item.tglAkhir).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "40px",
                        headerAttributes: { style: "text-align : center" }
                    },
                    // {
                    //     field: "id",
                    //     title: "Kode",
                    //     width: "30px",
                    //     headerAttributes: { style: "text-align : center" }
                    // },
                    // {
                    //     field: "namaproduk",
                    //     title: "Nama Barang",
                    //     width: "130px",
                    //     headerAttributes: { style: "text-align : center" }
                    // },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" }
                    },
                    {
                        "field": "tglkejadian",
                        "title": "Tgl Transaksi",
                        "width": "100px",
                        type: "date",
                        format: "{0:dd/MM/yyyy}"
                    },
                    {
                        field: "flag",
                        title: "Transaksi",
                        width: "130px",
                        headerAttributes: { style: "text-align : center" }
                    },
                    {
                        field: "keterangan",
                        title: "Uraian",
                        width: "230px",
                        headerAttributes: { style: "text-align : left" }
                    },
                    {
                        field: "saldoawal",
                        title: "Saldo Awal",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" }
                    },
                    {
                        title: "Barang-Barang",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "saldomasuk",
                                title: "Masuk",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "saldokeluar",
                                title: "Keluar",
                                width: "80px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "saldoakhir",
                                title: "Sisa",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" },
                            }
                        ]
                    },
                    {
                        field: "harganetto1",
                        title: "Harga Satuan",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" }
                    },
                    {
                        title: "Jumlah Harga Barang",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                field: "hargamasuk",
                                title: "Bertambah",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" }
                            },
                            {
                                field: "hargakeluar",
                                title: "Berkurang",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" },
                            },
                            {
                                field: "hargasisa",
                                title: "Sisa",
                                width: "100px",
                                headerAttributes: { style: "text-align : center" },
                            }
                        ]
                    },
                    {
                        field: "",
                        title: "Keterangan",
                        width: "100px",
                        headerAttributes: { style: "text-align : center" }
                    }
                ],
            };

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

            //** BATAS SUCI */
        }
    ]);
});
