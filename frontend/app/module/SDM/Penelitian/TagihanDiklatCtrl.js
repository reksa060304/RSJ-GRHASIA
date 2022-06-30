define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TagihanDiklatCtrl', ['CacheHelper', '$timeout', '$state', '$q', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $timeout, $state, $q, $scope, dateHelper, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataPasienSelected = {};
            $scope.showBayar = false;
            var norec_dkd = ""
            // var objSave = {}
            function showButton() {
                // $scope.showBtnBayarTagihan = true;
                // $scope.showBtnPerbaharui = true;
                // $scope.showBtnDetail = true;
            }
            FormLoad();
            // function detailDiklatTable() {
            //     medifirstService.get("sdm/diklat/get-data-detail-diklat?norec=" + norec_dkd).then(function (data) {
            //         $scope.dataDetailDiklat = data.data.data;
            //     })
            // }
            function FormLoad() {
                showButton();
                $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date());
                $q.all([
                    medifirstService.get("sdm/penelitian/daftar-tagihan-diklat?namaPelanggan=" + $scope.item.namaPelanggan + "&status=" + $scope.item.status + "&tglAwal=" + moment($scope.item.periodeAwal).format('YYYY-MM-DD') + "&tglAkhir=" + moment($scope.item.periodeAkhir).format('YYYY-MM-DD')),
                    medifirstService.get("kasir/get-data-combo-kasir")
                ]).then(function (data) {
                    $scope.listKelompokTransaksi = data[1].data.kelompoktransaksi
                    $scope.KelompokUserDiklit = data[1].data.diklit;
                    $scope.listPegawai = data[1].data.pegawai;
                    
                    console.log(data[1].data.pegawai);
                    $scope.KelompokUser = medifirstService.getKelompokUser();
                    if (data[0].statResponse) {
                        var dataFilter = []
                        for (var i = 0; i < data[0].data.length; i++) {
                            if (data[0][i].data.jenisTagihanId != 70) {
                                if (data[0][i].data.jenisTagihanId != 71) {
                                    if (data[0][i].data.jenisTagihanId != 62) {
                                        dataFilter.push(data[0].data[i])
                                    }
                                }
                            }
                        }
                        $scope.aggregate = [{
                            field: "totalDibayar",
                            aggregate: "sum"
                        }]
                        $scope.dataDaftarNonLayanan = new kendo.data.DataSource({
                            data: dataFilter,
                            pageSize: 10,
                            total: dataFilter.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        tglTransaksi: {
                                            type: "date"
                                        },

                                    }
                                }
                            },
                            aggregate: [{
                                field: 'totalDibayar',
                                aggregate: 'sum'
                            }, ]
                        });
                        // $scope.listKelompokTransaksi = data[1];
                        // $scope.listKelompokTransaksi = data[1].kelompoktransaksi;
                    }

                    $scope.listStatus = [{
                            id: 1,
                            namaExternal: "Lunas"
                        },
                        {
                            id: 2,
                            namaExternal: "Belum Bayar"
                        }
                    ]
                    var data = cacheHelper.get('DaftarNonLayananKasirCtrl');
                    if (data !== undefined) {
                        var splitResultData = data.split("#");
                        $scope.item.periodeAwal = dateHelper.setJamAwal(new Date(splitResultData[0]));
                        $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date(splitResultData[1]));
                    }
                    $timeout($scope.SearchData, 500);
                    if ($scope.KelompokUser != $scope.KelompokUserDiklit) {
                        $scope.showBayar = true
                    } else {
                        $scope.showBayar = false
                    }
                });

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDaftarNonLayanan = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "RekapDaftarTagihanNonLayan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:F1"];
                    sheet.frozenRows = 2;
                    sheet.name = "Report";
                    var myHeaders = [{
                        value: "Laporan Tagihan Non Layanan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        height: 70,
                        fontSize: 20,
                        textAlign: "center"
                    });
                },
                pageable: true,
                columns: [{
                        "field": "tglTransaksi",
                        "title": "Tanggal",
                        "width": "150px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglTransaksi #')}}</span>"
                    },
                    {
                        "field": "namaPelanggan",
                        "title": "Nama Pelanggan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaPelanggan #</span>"
                    },
                    {
                        "field": "jenisTagihan",
                        "title": "Jenis Tagihan",
                        "width": "150px",
                        "template": "<span class='style-center'>#: jenisTagihan #</span>"
                    },


                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: keterangan #</span>"
                    },
                    {
                        "field": "statusBayar",
                        "title": "Status",
                        "width": "150px",
                        "template": "<span class='style-center'>#: statusBayar #</span>"
                    },
                    {
                        "field": "totalDibayar",
                        "title": "Jumlah",
                        "width": "150px",
                        template: "<span class='style-right'>{{formatRupiah('#: totalDibayar #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        // footerTemplate: "#: data.totalDibayar.sum #",
                        footerTemplate: "{{formatRupiah('#: data.totalDibayar.sum #', 'Rp.')}}",
                    },
                ]
            }

            $scope.Bayar = function () {
                if ($scope.dataPasienSelected.statusBayar == "Lunas") {
                    toastr.error("Informasi, Tagihan Sudah Lunas !")
                    return;
                    // var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                    //     "Tagihan sudah Lunas", "Ok");

                    // $mdDialog.show(alertDialog).then(function () {

                    // });
                } else {
                    $scope.changePage2("PembayaranTagihanNonLayananKasir");
                }
            }

            $scope.changePage2 = function (stateName) {
                if ($scope.dataPasienSelected.noRec != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noRec
                    }
                    var tempCache = $scope.dataPasienSelected.noRec + "#0#DaftarNonLayananKasir";
                    cacheHelper.set('PembayaranTagihanNonLayananKasir', tempCache);
                    $state.go(stateName, {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error("Informasi, Silahkan pilih data terlebih dahulu !");
                    return;
                    // var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                    //     "Silahkan pilih data terlebih dahulu", "Ok");

                    // $mdDialog.show(alertDialog).then(function () {

                    // });
                }
            }

            $scope.changePage = function (stateName) {
                if ($scope.dataPasienSelected.noRec != undefined) {
                    $state.go(stateName, {
                        //ataPasien: JSON.stringify($scope.dataPasienSelected)
                    });
                } else {
                    toastr.error("Informasi, Silahkan pilih data terlebih dahulu !");
                    return;
                }
            }

            function checkValue(obj, param) {
                var res = "";
                var data = undefined;

                if (param.length > 1) {
                    if (obj[param[0]] != undefined)
                        data = obj[param[0]][param[1]];
                } else {
                    data = obj[param[0]];
                }

                if (data != undefined)
                    var res = data;

                return res;
            }

            function isInt(value) {
                var er = /^-?[0-9]+$/;

                return er.test(value);
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                $scope.item.periodeAkhir = dateHelper.setJamAkhir(new Date());

                $scope.SearchData();
            }

            $scope.Detail = function () {
                var tempCache = $scope.dataPasienSelected.noRec + "#1#DaftarNonLayananKasir";
                cacheHelper.set('PembayaranTagihanNonLayananKasir', tempCache);
                $state.go('PembayaranTagihanNonLayananKasir') //, {
                //     dataPasien: JSON.stringify(obj)
                // });
            }

            $scope.InputTagihan = function () {
                $state.go('InputTagihanNonLayanan')
            }

            //fungsi search data
            $scope.SearchData = function () {
                //kriteria pencarian
                var namaPelanggan = checkValue($scope.item, ["namaPelanggan"]);
                var tanggalAwal = checkValue($scope.item, ["periodeAwal"]);
                var tanggalAkhir = checkValue($scope.item, ["periodeAkhir"]);
                var status = checkValue($scope.item, ["status", "namaExternal"]);
                var jenisTagihan = checkValue($scope.item, ["kelompokTransaksi", "id"]);

                tanggalAwal = moment(tanggalAwal).format('YYYY-MM-DD HH:mm');
                tanggalAkhir = moment(tanggalAkhir).format('YYYY-MM-DD HH:mm');

                var tempCache = tanggalAwal + "#" + tanggalAkhir;
                cacheHelper.set('DaftarNonLayananKasirCtrl', tempCache);
                init(namaPelanggan, status, tanggalAwal, tanggalAkhir, jenisTagihan);
             
            }

            $scope.klikGridDetail = function (dataPasienDetailSelected) {
                console.log(dataPasienDetailSelected);
                $scope.item.jenisperan = {
                    id: dataPasienDetailSelected.objectpegawaifk,
                    jenisperan: dataPasienDetailSelected.jenisperan
                }
                $scope.item.pegawai = {
                    id: dataPasienDetailSelected.objectpegawaifk,
                    namalengkap: dataPasienDetailSelected.namalengkap
                }
                norec_dkd = ""
                $scope.norecdkd = dataPasienDetailSelected.norec
                // console.log($scope.norecdkd);
            }

            function seacrhDetail(){
                $scope.isRouteLoading = true;
                medifirstService.get('kasir/get-data-combo-kasir?detailjenisprodukfk=' + $scope.dataPasienSelected.detailjenisprodukId + "&norec_pp=" + $scope.dataPasienSelected.norec_spd).then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.listJenisPeran = e.data.jenisperan
                    console.log(e.data.detailkegiatandiklat.length);

                    $scope.dataDaftarDetailDiklat = new kendo.data.DataSource({
                        data: e.data.detailkegiatandiklat, //data,
                        pageSize: 10,
                        total: e.data.detailkegiatandiklat,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                    });
                    
                   
                })
            }

            $scope.JenisPeran = function(){
                if ($scope.dataPasienSelected.noRec == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }
                seacrhDetail()
                $scope.item.namaPelangganlook = $scope.dataPasienSelected.namaPelanggan;
                $scope.popupInputDetailTagihan.center().open();
            }
            $scope.batal = function(){
                $scope.item.pegawai = undefined;
                $scope.item.jenisperan = undefined;
                // objSave = {}
                norec_dkd= ""
                $scope.popupInputDetailTagihan.center().close();
            }
            var init = function (a, b, c, d, e) {
                $scope.isRouteLoading = true;
                $scope.aggregate = [{
                    field: "totalDibayar",
                    aggregate: "sum"
                }]
                medifirstService.get("sdm/penelitian/daftar-tagihan-diklat?namaPelanggan=" + a + "&status=" + b + "&tglAwal=" + c + "&tglAkhir=" + d + "&jenisTagihanId=" + e).then(function (data) {
                    var dataFilter = []
                    var data = data.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].jenisTagihanId != 70) {
                            if (data[i].jenisTagihanId != 71) {
                                if (data[i].jenisTagihanId != 62) {
                                    dataFilter.push(data[i])
                                }

                            }
                        }
                    }
                    $scope.isRouteLoading = false;
                    $scope.dataDaftarNonLayanan = new kendo.data.DataSource({
                        data: dataFilter, //data,
                        pageSize: 10,
                        //total: dat.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    tglTransaksi: {
                                        type: "date"
                                    },
                                    totalDibayar: {
                                        type: "number"
                                    }
                                }
                            }
                        },
                        aggregate: $scope.aggregate
                    });
                });
                return $scope.dataDaftarNonLayanan;
            }
            $scope.columnDaftarDetailDiklat = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "RekapDaftarTagihanNonLayan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:F1"];
                    sheet.frozenRows = 2;
                    sheet.name = "Report";
                    var myHeaders = [{
                        value: "Laporan Tagihan Non Layanan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        height: 70,
                        fontSize: 20,
                        textAlign: "center"
                    });
                },
                pageable: true,
                columns: [
                    {
                        "field": "jenisperan",
                        "title": "Peran",
                        "width": "150px",
                        // "template": "<span class='style-left'>#: namaPelanggan #</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pembimbing",
                        "width": "150px",
                        // "template": "<span class='style-center'>#: jenisTagihan #</span>"
                    },
                ]
            }
            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih")
                    return
                }
                
                $scope.dataPasienSelected = dataPasienSelected;

            }
            $scope.save = function(){
                var pegawai = ""
                var jenisperan = ""
                if ($scope.item.pegawai!= undefined || $scope.item.jenisperan != undefined) {
                    pegawai = $scope.item.pegawai.id
                    jenisperan = $scope.item.jenisperan.id
                }
                
                if ($scope.norecdkd != undefined) {
                    norec_dkd = $scope.norecdkd
                }
                if($scope.dataPasienSelected.detailjenisprodukId == 1956){
                    pegawai = null
                    jenisperan = null
                }
                var objSave = {
                    norec: norec_dkd,
                    norec_pp: $scope.dataPasienSelected.norec_spd,
                    objectjenisperanfk: jenisperan,
                    objectpegawaifk: pegawai,
                    kodeexternal: $scope.dataPasienSelected.jenisTagihan,
                    namaexternal: $scope.dataPasienSelected.keterangan,
                    objectdetailjenisproduk: $scope.dataPasienSelected.detailjenisprodukId
                }
                console.log(objSave);
                // return
                medifirstService.post('tagihan/save-tagihan-diklat', objSave).then(function (data) {
                    // init();
                // $scope.popupInputDetailTagihan.center().close();
                    norec_dkd = ""
                    $scope.norecdkd = undefined
                seacrhDetail()
                $scope.item.pegawai = undefined
                $scope.item.jenisperan = undefined
                })
            }
            $scope.delete = function(){
                if ($scope.norecdkd != undefined) {
                    norec_dkd = $scope.norecdkd
                }   
                var objSave = {
                    norec: norec_dkd,
                    statusenabled: false
                }
                console.log(objSave);
                medifirstService.post('tagihan/hapus-tagihan-diklat', objSave).then(function (data) {
                    // init();
                    $scope.item.pegawai = undefined;
                    $scope.item.jenisperan = undefined;
                    $scope.norecdkd = undefined
                    // objSave = {}
                    norec_dkd = ""
                    // $scope.popupInputDetailTagihan.center().close();
                    // $scope.item = {};
                    seacrhDetail()
                })
            }

            // BATAS //
        }
    ]);
});