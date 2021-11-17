define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KartuStokPersediaanCtrl', ['$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
        function ($scope, ModelItem, dateHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.selectOptionsDetailJenis = {
                dataTextField: "detailjenisproduk",
                dataValueField: "id",
                filter: "contains"
            };
            loadTanggal();
            // $scope.awalBulanClosing = new Date("2021-01-01 00:00:00");
            // $scope.akhirBulanClosing = new Date("2021-08-01 00:00:00");

            function loadTanggal() {
                medifirstService.get('logistik/get-bulanclosing').then(function (data) {
                    var datas = data.data;
                    $scope.awalBulanClosing = new Date(datas[0].tglawal);
                    $scope.akhirBulanClosing = new Date(datas[datas.length - 1].tglawal);                    
                    $scope.monthSelectorOptions = function () {
                        return {
                            start: "year",
                            depth: "year",
                            format: "MMMM yyyy",
                        }
                    }                         
                    FormLoad();
                })
            }

            function FormLoad() {
                $scope.isRouteLoading = true;
                $scope.item.bulan = $scope.now;
                $scope.item = {
                    kelUser: document.cookie.split(';')[0].split('=')[1],
                    from: $scope.now,
                    until: $scope.now
                }
                if ($scope.item.kelUser !== "logistik")
                    $scope.isUnit = true;

                $scope.daftarKartuStok = new kendo.data.DataSource({
                    data: []
                });

                $scope.item.from = moment($scope.now).format('YYYY-MM-DD 00:00:00');
                $scope.item.until = moment($scope.now).format('YYYY-MM-DD 23:59:59');
                $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                // $scope.item.ruangan = { id: $scope.listRuangan[0].id, namaruangan: $scope.listRuangan[0].namaruangan }
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });

                medifirstService.get('logistik/get-combo-logistik').then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataCombo = data.data;
                    $scope.item.passwordSo = dataCombo.passwordstokopname;
                    $scope.listKelompokBarang = dataCombo.kelompokproduk
                    $scope.item.kelompokBarang = { id: 24, kelompokproduk: 'Barang Persediaan' }
                });
            }

            $scope.ProsesCari = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var date = new Date($scope.item.bulan);
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var tglAwal = moment(firstDay).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment(lastDay).format('YYYY-MM-DD 23:59');
                var lalu = parseFloat(moment($scope.item.bulan).format('M')) - 1;
                var bulanlalu = ""
                if (lalu.length > 1) {
                    bulanlalu = "&bulan=" + lalu + "." + moment($scope.now).format('YYYY');
                } else {
                    bulanlalu = "&bulan=" + "0" + lalu + "." + moment($scope.now).format('YYYY');
                }
                var ruanganId = "";
                if ($scope.item.ruangan !== undefined) {
                    ruanganId = "&ruanganfk=" + $scope.item.ruangan.id
                }
                var kdproduk = "";
                if ($scope.item.namaBarang !== undefined) {
                    kdproduk = "&produkfk=" + $scope.item.namaBarang.id;
                }

                medifirstService.get("logistik/get-data-kartu-stok-beta?"
                    + "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir
                    + ruanganId + kdproduk + bulanlalu, true).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data;

                        for (let i = 0; i < datas.length; i++) {
                            const element = datas[i];
                            element.no = 1 + i;
                        }

                        $scope.daftarKartuStok = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            serverPaging: false,
                            total: datas.length,
                        });
                    });
            }

            $scope.BatalStokOpname = function () {
                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();
            }

            $scope.perbaikiData = function () {
                $scope.popUp.center().open();
            }

            $scope.lanjutkan = function () {
                var ruanganId = "";
                if ($scope.item.ruangan !== undefined) {
                    ruanganId = $scope.item.ruangan.id
                }
                var kdproduk = "";
                if ($scope.item.namaBarang !== undefined) {
                    kdproduk = $scope.item.namaBarang.id;
                }

                if ($scope.item.kataKunciPass != $scope.item.passwordSo) {
                    alert('Kata kunci / password salah')
                    $scope.isRouteLoading = false;
                    $scope.popUp.close();
                    return
                }

                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUp.close();

                var objSave = {
                    "ruanganfk": ruanganId,
                    "produkfk": kdproduk,
                    "tglawal": moment($scope.item.from).format('YYYY-MM-DD 00:00:00')
                }
                medifirstService.post('logistik/save-perbaiki-kartu-stok', objSave).then(function (e) {
                    loadData()
                })
            }

            $scope.Proses = function () {
                var listRawRequired = [
                    "item.ruangan|k-ng-model|Ruangan",
                    "item.from|k-ng-model|Periode awal",
                    "item.until|k-ng-model|Periode akhir",
                    "item.until|k-ng-model|Periode akhir",
                    "item.kelompokBarang|k-ng-model|Kelompok produk",
                    "item.namaBarang|k-ng-model|Nama produk"
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {

                    var from, until, ruanganId, produkId;

                    if (!$scope.item.from && !$scope.item.until) {
                        from = '';
                        until = '';
                    } else {
                        from = DateHelper.getPeriodeFormatted(new Date($scope.item.from));
                        until = DateHelper.getPeriodeFormatted(new Date($scope.item.until));
                    }

                    if (!$scope.item.ruangan) {
                        ruanganId = ''
                    } else {
                        ruanganId = $scope.item.ruangan.id
                    }

                    if (!$scope.item.namaBarang) {
                        produkId = ''
                    } else {
                        produkId = $scope.item.namaBarang.id
                    }

                    findProduk.getKartuStokSRO(from, until, ruanganId, produkId).then(function (e) {
                        // console.log(JSON.stringify(e.data));
                        e.data.tanggalKejadian = DateHelper.getPeriodeFormatted(new Date(e.data.tanggalKejadian));

                        $scope.daftarKartuStok = new kendo.data.DataSource({
                            data: e.data
                        });
                    })
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.enableNamaBarang = false;
            $scope.columnKartuStok = {
                toolbar: ["excel"],
                excel: {
                    fileName: "KartuStok",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var rows = e.workbook.sheets[0].rows;
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Kartu Stok",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                sortable: true,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: "45px",
                        Template: "<span class='style-center'>#: no #</span>",
                    },
                    {
                        field: "tanggal",
                        title: "Tanggal",
                        width: "100px",
                        Template: "<span class='style-center'>#: tanggal #</span>",
                    },
                    {
                        field: "produk",
                        title: "Nama Barang",
                        width: "220px",
                        Template: "<span class='style-center'>#: produk #</span>",
                    },
                    {
                        field: "keterangan",
                        title: "Keterangan",
                        width: "250px",
                        Template: "<span class='style-center'>#: keterangan #</span>",
                        footerTemplate: "<span class='style-right'></span>"
                    },
                    {
                        field: "saldoawal",
                        title: "Saldo Awal",
                        width: "100px",
                        Template: "<span class='style-center'>#: saldoawal #</span>",
                    },
                    {
                        field: "qtyterima",
                        title: "Saldo Masuk",
                        width: "100px",
                        Template: "<span class='style-center'>#: qtyterima #</span>",
                    },
                    {
                        field: "qtykeluar",
                        title: "Saldo Keluar",
                        width: "100px",
                        Template: "<span class='style-center'>#: qtykeluar #</span>",
                        footerTemplate: "<span class='style-right'></span>"
                    },
                    {
                        field: "saldoakhir",
                        title: "Saldo Akhir",
                        width: "100px",
                        Template: "<span class='style-center'>#: saldoakhir #</span>",
                        footerTemplate: "<span class='style-right'></span>"
                    }
                ],
            };

            $scope.batal = function () {
                init();
            }
        }
    ]);
});