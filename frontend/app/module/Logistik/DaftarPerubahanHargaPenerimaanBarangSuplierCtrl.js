define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPerubahanHargaPenerimaanBarangSuplierCtrl', ['$scope', 'ModelItem', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($scope, ModelItem, dateHelper, medifirstService, cacheHelper) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPerubahanHargaPenerimaanBarangSuplierCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);

                    init();
                }
                else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00:00');//$scope.now;
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59:59');// $scope.now;
                    init();
                }
            }

            function loadCombo() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });
            }
          
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var KdSirs1 = ""
                if ($scope.item.KdSirs1 != undefined) {
                    KdSirs1 = "&KdSirs1=" + $scope.item.KdSirs1
                }
                var KdSirs2 = ""
                if ($scope.item.KdSirs2 != undefined) {
                    KdSirs2 = "&KdSirs2=" + $scope.item.KdSirs2
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-penerimaan-harga?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&namarekanan=" + $scope.item.namarekanan
                    + produkfk + KdSirs1 + KdSirs2
                    , true).then(function (dat) {

                        $scope.isRouteLoading = false;
                        var datas = dat.data.data;
                        var total = 0;
                        var totalQty = 0;
                        var ppn = 0;
                        var diskon = 0;
                        for (var i = 0; i < datas.length; i++) {
                            var y = 0
                            datas[i].no = i + 1
                            total = parseFloat(datas[i].total) + total;
                            totalQty = parseFloat(datas[i].qtyproduk) + totalQty;
                        }
                        $scope.item.SubTotalQty = parseFloat(totalQty).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.item.SubTotal = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");                       
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
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
                cacheHelper.set('DaftarPenerimaanBarangSuplierCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }            

            $scope.columnGrid = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Detail Penerimaan Barang Suplier  " + moment($scope.item.tglAwal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglAkhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:N1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Detail Penerimaan Barang Suplier",
                        fontSize: 10,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });
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
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "width": "80px"
                    },                   
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },
                    {
                        "field": "nofaktur",
                        "title": "No Terima",
                        "width": "80px",
                    },
                    {
                        "field": "nofaktur",
                        "title": "No Faktur",
                        "width": "80px",
                    },
                    {
                        "field": "tglfaktur",
                        "title": "Tanggal",
                        "width": "60px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglfaktur #', '')}}</span>"
                    },   
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "80px",
                    },
                    {
                        "field": "namarekanan",
                        "title": "Nama Rekanan",
                        "width": "90px",
                    },                                    
                    {
                        "field": "qtyproduk",
                        "title": "Qty Terima",
                        "width": "55px",
                        "template": "<span class='style-right'>#= kendo.toString(qtyproduk) #</span>",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargabaru",
                        "title": "Harga Baru",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargabaru #', '')}}</span>"
                    },                                     
                    {
                        "field": "tglkadaluarsa",
                        "title": "Tanggal Expire",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                    }
                ]
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
            //***********************************
        }
    ]);
});
