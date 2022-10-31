define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('ChartOfAccountCtrl', ['$scope', 'MedifirstService', '$state',
        function ($scope, medifirstService, $state) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.hidehead = true
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
                var noakun = 'noaccount=' + $scope.item.noakunS
                if ($scope.item.noakunS == undefined) {
                    noakun = ''
                }
                var namaAkun = '&namaaccount=' + $scope.item.namaAkunS
                if ($scope.item.namaAkunS == undefined) {
                    namaAkun = ''
                }
                $scope.isRouteLoading = true;
                medifirstService.get("akuntansi/get-data-daftar-master-coa?" + noakun + namaAkun, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = dat.data.length - 1; i >= 0; i--) {
                        dat.data[i].no = i + 1
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: dat.data,
                        sort: [
                            {
                                field: "noaccount",
                                dir: "asc"
                            }
                        ],
                        pageSize: 12
                    });
                });
                medifirstService.get("akuntansi/get-data-combo-master", true).then(function (dat) {
                    $scope.listStruktur = dat.data.strukturaccount
                    $scope.listJenis = dat.data.jenisaccount
                    $scope.listKategory = dat.data.kategoryaccount
                    $scope.listStatus = dat.data.statusaccount
                    $scope.listSaldo = [{ id: 1, saldo: 'D' }, { id: 2, saldo: 'K' }]
                    $scope.listStatusEnabled = [{ id: 1, statusenabled: 'True' }, { id: 2, statusenabled: 'False' }]
                });

                $scope.item.statusenabled = { id: 1, statusenabled: 'True' }
            }
           
            $scope.cariFilter = function () {
                init();
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

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.$watch('item.struktur', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if($scope.item.struktur.id != 1){
                        medifirstService.get("akuntansi/get-head-coa?div="+$scope.item.struktur.id).then(function (e) {
                            $scope.listHeadStruktur = e.data
                        })
                        medifirstService.get("akuntansi/get-data-combo-master", true).then(function (dat) {
                            $scope.listStruktur = dat.data.strukturaccount
                        })
                        $scope.hidehead = false
                    } else{
                        $scope.hidehead = true
                    }
                }
            });

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
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noaccount",
                        "title": "No Akun",
                        "width": "100px"
                    },
                    {
                        "field": "namaaccount",
                        "title": "Nama Akun",
                        "width": "250px"
                    },
                    {
                        "field": "strukturaccount",
                        "title": "Struktur",
                        "width": "100px"
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
                    "field": "noaccount",
                    "title": "No Akun",
                    "width": "100px"
                },
                {
                    "field": "namaaccount",
                    "title": "Nama Akun",
                    "width": "250px"
                },
                {
                    "field": "saldonormaladd",
                    "title": "Saldo (+)",
                    "width": "60px"
                },
                {
                    "field": "saldonormalmin",
                    "title": "Saldo (-)",
                    "width": "60px"
                },
                // {
                //     "field": "jenisaccount",
                //     "title": "Jenis",
                //     // "width" : "100px"
                // },
                {
                    "field": "kategoryaccount",
                    "title": "Kategory",
                    "width": "100px"
                },
                // {
                //     "field": "statusaccount",
                //     "title": "Status",
                //     "width" : "100px"
                // },
                {
                    "field": "strukturaccount",
                    "title": "Struktur",
                    "width": "100px"
                }
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
                $scope.item.id = dataSelected.id
                $scope.item.noakun = dataSelected.noaccount
                $scope.item.namaAkun = dataSelected.namaaccount
                $scope.item.struktur = { id: dataSelected.objectstrukturaccountfk, strukturaccount: dataSelected.strukturaccount }
                medifirstService.get("akuntansi/get-head-coa?div="+$scope.item.struktur.id).then(function (e) {
                    $scope.listHeadStruktur = e.data
                })
                $scope.item.head = { id: dataSelected.idhead, namaaccount: dataSelected.namahead }
                $scope.item.jenis = { id: dataSelected.objectjenisaccountfk, jenisaccount: dataSelected.jenisaccount }
                $scope.item.kategory = { id: dataSelected.objectkategoryaccountfk, kategoryaccount: dataSelected.kategoryaccount }
                $scope.item.status = { id: dataSelected.objectstatusaccountfk, statusaccount: dataSelected.statusaccount }
                if (dataSelected.saldonormaladd == "D") {
                    $scope.item.saldoAdd = { id: 1, saldo: "D" }
                } else {
                    $scope.item.saldoAdd = { id: 2, saldo: "K" }
                }
                if (dataSelected.saldonormalmin == "D") {
                    $scope.item.saldoMin = { id: 1, saldo: "D" }
                } else {
                    $scope.item.saldoMin = { id: 2, saldo: "K" }
                }
                if (dataSelected.statusenabled == true) {
                    $scope.item.statusenabled = { id: 1, statusenabled: "True" }
                } else {
                    $scope.item.statusenabled = { id: 2, statusenabled: "False" }
                }
            }
            // $scope.data2 = function(dataItem) {
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [
            //             {
            //                 "field": "tglkebutuhan",
            //                 "title": "Tgl Kebutuhan",
            //                 "width" : "50px",
            //                 "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
            //             },
            //             {
            //                 "field": "prid",
            //                 "title": "Kode Produk",
            //                 "width" : "40px",
            //             },
            //             {
            //                 "field": "namaproduk",
            //                 "title": "Nama Produk",
            //                 "width" : "90px",
            //             },
            //             {
            //                 "field": "spesifikasi",
            //                 "title": "Spesifikasi",
            //                 "width" : "120px",
            //             },
            //             {
            //                 "field": "satuanstandar",
            //                 "title": "Satuan",
            //                 "width" : "20px",
            //             },
            //             {
            //                 "field": "qtyproduk",
            //                 "title": "Qty",
            //                 "width" : "20px",
            //             },
            //             {
            //                 "field": "hargasatuan",
            //                 "title": "Harga Satuan",
            //                 "width" : "40px",
            //                 "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            //             },
            //             {
            //                 "field": "total",
            //                 "title": "Total",
            //                 "width" : "50px",
            //                 "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            //             }
            //         ]
            //     }
            // };  
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };

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

                if ($scope.item.noakun == undefined) {
                    toastr.error('Kode Akun harus di isi')
                    return
                }
                if ($scope.item.namaAkun == undefined) {
                    toastr.error('Nama Akun harus di isi')
                    return
                }

                if ($scope.item.statusenabled == undefined) {
                    toastr.error('Status enabled belum di pilih')
                    return
                }

                var objectstrukturaccountfk = null
                if ($scope.item.struktur != undefined)
                    objectstrukturaccountfk = $scope.item.struktur.id

                var objectaccountheadfk = null
                if ($scope.item.head != undefined)
                    objectaccountheadfk = $scope.item.head.id

                var objSave =
                {
                    "id": idCoa,
                    "statusenabled": $scope.item.statusenabled.id == 1 ? true : false,
                    "objectstrukturaccountfk": objectstrukturaccountfk,
                    "kdaccount": $scope.item.noakun,
                    "namaaccount": $scope.item.namaAkun,
                    "objectaccountheadfk" : objectaccountheadfk
                }
                medifirstService.post('akuntansi/save-data-master-coa',objSave).then(function (e) {
                    init()
                    $scope.Batal()
                })
            }

            $scope.Batal = function () {
                delete $scope.item.id
                delete $scope.item.noakun
                delete $scope.item.namaAkun
                delete $scope.item.saldoAdd
                delete $scope.item.saldoMin
                delete $scope.item.jenis
                delete $scope.item.kategory
                delete $scope.item.status
                delete $scope.item.struktur
            }
            //***********************************
        }
    ]);
});
