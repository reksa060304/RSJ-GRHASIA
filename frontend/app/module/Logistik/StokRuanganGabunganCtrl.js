define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('StokRuanganGabunganCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            init();

            function init() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });
                initData();
            }
            
            $scope.cari = function () {
                initData()
            }
            
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function initData() {
                $scope.isRouteLoading = true;
                console.log($scope.item.namaBarang)
                var kdproduk = "";
                if ($scope.item.namaBarang !== undefined && $scope.item.namaBarang.namaproduk !== '') {
                    kdproduk = "&produkfk=" + $scope.item.namaBarang.id;
                }

                var namaproduk = "";
                if ($scope.item.namaProduk !== undefined) {
                    namaproduk = "&namaproduk=" + $scope.item.namaProduk;
                }

                medifirstService.get('logistik/get-stok-ruangan-gabungan?jmlRows=' + $scope.item.jmlRows +
                    namaproduk + kdproduk
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: datas.length,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    })
            }

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Stok Ruangan Gabungan" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                scrollable: true,

                pageable: true,
                // editable: true,  
                columns: [
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "width": "50px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "150px",
                    },
                    {
                        "title": "Farmasi",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": 'qtyfarmasi',
                                "title": "Stok",
                                "width": "50px",
                            },
                            {
                                "field": 'satuanstandar',
                                "title": "Satuan",
                                "width": "50px",
                            },
                            {
                                "field": 'hargabeli',
                                "title": "Harga Beli",
                                "width": "50px",
                            },
                            {
                                "field": 'hargajual',
                                "title": "Harga Jual",
                                "width": "50px",
                            }
                        ],

                    },
                    {
                        "title": "GD. Farmasi",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        columns: [
                            {
                                "field": 'qtygudang',
                                "title": "Stok",
                                "width": "50px",
                            },
                            {
                                "field": 'satuanstandar',
                                "title": "Satuan",
                                "width": "50px",
                            },
                            {
                                "field": 'hargabeli',
                                "title": "Harga Beli",
                                "width": "50px",
                            },
                            {
                                "field": 'hargajual',
                                "title": "Harga Jual",
                                "width": "50px",
                            }
                        ],

                    }
                ]

            };


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

            $scope.cetak = function () {
                var strIdRuangan = $scope.item.ruangan.id;

                var stt = 'false'
                if (confirm('View Laporan Data Stok Ruangan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-stokruangan=1&strIdRuangan=' + strIdRuangan + '&view=' + stt + '&user=' + $scope.dataLogin.namaLengkap, function (response) {
                });
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});