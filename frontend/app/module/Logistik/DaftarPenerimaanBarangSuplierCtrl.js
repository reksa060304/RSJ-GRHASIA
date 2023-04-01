define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPenerimaanBarangSuplierCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$mdDialog',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService,$mdDialog) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {};
            var statusClosingStok = false;
            $scope.passwordUbahHarga = undefined;
            $scope.hidesmeuastok = false
            var dataDetail = [];
            var dataCeklis = [];
            LoadCache();
            ComboLoad();
            function LoadCache() {
                // $scope.item.namarekanan = undefined
                var chacePeriode = cacheHelper.get('DaftarPenerimaanBarangSuplierCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }

            function ComboLoad() {
                medifirstService.get('logistik/get-combo-logistik-mini').then(function (dat) {
                    $scope.listDataJabatan = dat.data.jabatan;
                    $scope.passwordUbahHarga = dat.data.passwordubahharga;
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });

                // medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                //     $scope.listNamaBarang = data;
                // });

                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    $scope.listNamaBarang = dat.data.produk;
                });

                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                if($scope.pegawaiLogin.jenisPegawai.jenispegawai == "Apoteker"){
                    $scope.hidesmeuastok = true
                }
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
                // $scope.item.DataJabatan1 = undefined;                 
                // $scope.item.DataPegawai1 = undefined;
                // $scope.item.DataJabatan2 = undefined;                 
                // $scope.item.DataPegawai2 = undefined;
                // $scope.item.DataJabatan3 = undefined;
                // $scope.item.DataPegawai3 = undefined
            }

            $scope.CetakAh = function () {
                var user = medifirstService.getPegawaiLogin();
                var jabatan1 = ''
                if ($scope.item.DataJabatan1 != undefined) {
                    jabatan1 = $scope.item.DataJabatan1.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai1 != undefined) {
                    pegawai1 = $scope.item.DataPegawai1.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan2 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai2 = $scope.item.DataPegawai2.id;
                }

                var jabatan3 = ''
                if ($scope.item.DataJabatan3 != undefined) {
                    jabatan3 = $scope.item.DataJabatan3.namajabatan;
                }

                var pegawai3 = ''
                if ($scope.item.DataPegawai3 != undefined) {
                    pegawai3 = $scope.item.DataPegawai3.id;
                }


                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores=' + $scope.dataSelected.norec + '&pegawaiPenerima=' + pegawai2 + '&pegawaiPenyerahan=' + pegawai1 + '&pegawaiMengetahui=' + pegawai3
                    + '&jabatanPenerima=' + jabatan2 + '&jabatanPenyerahan=' + jabatan1 + '&jabatanMengetahui=' + jabatan3 + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                        //aadc=response; 

                    });
                $scope.popUp.close();
            }

            $scope.Tambah = function () {
                $state.go('PenerimaanBarangSuplier')
            }

            $scope.BatalTerima = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Dihapus !')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                if ($scope.dataSelected.nosbm != undefined) {
                    alert("Sudah di bayar tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    nostruk: $scope.dataSelected.norec,
                    noorderfk: $scope.dataSelected.noorderfk
                }
                medifirstService.post('logistik/delete-data-penerimaan', objSave).then(function (e) {
                    var forsave = {
                        nostruk: $scope.dataSelected.nostruk,
                    }
                    medifirstService.post('sysadmin/general/hapus-jurnal-penerimaan-barang', forsave).then(function (e) {
                        init();
                    });
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
                var noSppb = ""
                if ($scope.item.noSppb != undefined) {
                    noSppb = "&noSppb=" + $scope.item.noSppb
                }
                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                // console.log($scope.pegawaiLogin)
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-penerimaan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur +
                    "&namarekanan=" + $scope.item.namarekanan
                    + produkfk
                    + noSppb
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.daftar;
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            data2[i].statCheckbox2 = false;

                            for (let e = 0; e < data2[i].details.length; e++) {
                                data2[i].details[e].no = e + 1;
                            }
                        }
                        console.log(data2);
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                        pegawaiUser = dat.data.datalogin
                    });
                var objSave = {
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }

                medifirstService.post('sysadmin/general/save-jurnal-penerimaan-barang', objSave).then(function (data) { });

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

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.CetakBukti = function () {
                $scope.popUp.center().open();
            }

            $scope.EditTerima = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Diubah !')
                    return;
                }
                // **  VALIDASI CLOSING STOK 
                console.log($scope.dataSelected)
                console.log(pegawaiUser)
                $scope.isRouteLoading = true
                $scope.lanjutEdit()
                // medifirstService.get('logistik/cek-transaksi-use?norec=' + $scope.dataSelected.norec).then(function (e) {
                //     $scope.isRouteLoading = false
                //     if (e.data.isedit == true) {
                //         $scope.lanjutEdit()
                //     } else {
                //         toastr.error('Stok Telah Digunakan, Tidak Bisa Ubah Penerimaan')
                //         return
                //     }
                // })
            }

            $scope.gunakanSemuaStok = function(){
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda Yakin Menggunakan Semua Stok?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    $scope.saveGunakanSemuaStok();
                })
                
            } 

            $scope.saveGunakanSemuaStok = function(){
                var data2 = []
                data2 = $scope.dataSelected.details

                var ttlTotal = 0;
                var ttlDiskon = 0;
                var ttlPpn = 0;
                var grandTotal = 0;

                for (var i = data2.length - 1; i >= 0; i--) {
                    ttlTotal = ttlTotal + (parseFloat(data2[i].hargasatuan) * parseFloat(data2[i].qtyproduk))
                    ttlDiskon = ttlDiskon + (parseFloat(data2[i].hargadiscount) * parseFloat(data2[i].qtyproduk))
                    ttlPpn = ttlPpn + (parseFloat(data2[i].ppn) * parseFloat(data2[i].qtyproduk))
                }

                grandTotal = ttlTotal + ttlPpn - ttlDiskon

                var struk = {
                    nostruk: "",
                    ruanganfk: $scope.dataSelected.objectruanganfk,
                    namaruangan: $scope.dataSelected.namaruangan,
                    tglstruk: moment($scope.item.tgl).format('YYYY-MM-DD HH:mm:ss'),
                    pegawaimenerimafk: $scope.dataSelected.idpenerima,
                    namapegawaipenerima: $scope.dataSelected.namapenerima,
                    keterangan: null,
                    qtyproduk: data2.length,
                    total: ttlTotal
                }
                var objSave =
                {
                    struk: struk,
                    details: data2
                }

                medifirstService.post('logistik/save-pemakaian-ruangan', objSave).then(function (e) {
                    
                })
            }

            $scope.lanjutEdit = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier')
            }

            $scope.RegisAset = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'RegisAset',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('MasterBarangInvestasiCtrl', chacePeriode);
                $state.go('MasterBarangInvestasi')
            }

            $scope.HapusPenerimaan = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Dihapus !')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                if ($scope.dataSelected.nosbm != undefined) {
                    alert("Sudah di bayar tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                manageLogistikPhp.getDataTableTransaksi("penerimaan-suplier/delete-terima-barang-suplier?" + "norec_sp=" + $scope.dataSelected.norec, true).then(function (dat) {
                    init()
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.selectedData2 = [];
            $scope.selectRow2 = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                    console.log(checked);
                if (checked) {
                    $scope.selectedData2.push(dataItem);
                    
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox2 = true;
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec == dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
                console.log($scope.selectedData2);
            }
			var isCheckAll = false
            $scope.selectUnselectAllRow2 = function () {
                var tempData = $scope.mainGridOptions.columns;
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox2 = false;
                        $scope.selectedData2 = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox2 = true;
                        $scope.selectedData2.push(tempData[i])
                    }
                }
                console.log(tempData);

                console.log($scope.selectedData2)
                reloaddataSourceGrid(tempData);
            }
            function reloaddataSourceGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPenerimaanBarangSuplier.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Penerimaan Barang Suplier",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                scrollable: true,
                columns: [
                    {
                        "title": "#",
                        template: "# if (statCheckbox2) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' />" +
                            "# } #",
                        width: "30px"
                    },
                {
                    "field": "no",
                    "title": "No",
                    "width": "35px",
                },
                {
                    "field": "nofaktur",
                    "title": "No Dokumen",
                    "width": "100px",
                },
                {
                    "field": "nosppb",
                    "title": "No PO",
                    "width": "100px",
                    "template": "#if (nosppb) {# #= nosppb # #} else {# - #} #",
                },
                {
                    "field": "tglstruk",
                    "title": "Tanggal Penerimaan",
                    "width": "55px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Supplier",
                    "width": "120px",
                },
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },
                {
                    "field": "totalharusdibayar",
                    "title": "Total Tagihan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>"
                },
                {
                    "field": "isverifspj",
                    "title": "Verifikasi SPJ",
                    "width": "100px",
                    "template": "#if (isverifspj) {# #= 'Sudah Diverifikasi' # #} else {# - #} #",

                },
                {
                    "field": "tglverifspj",
                    "title": "Tanggal Verifikasi",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglverifspj #', '')}}</span>",

                    // "template": "#if (isverifspj) {# #= 'Sudah Diverifikasi' # #} else {# - #} #",

                },
                {
                    "field": "nospj",
                    "title": "NO SPJ",
                    "width": "120px",
                },
            ]
        }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGrid._data[0].details, function (data) {
                    return data.no == dataItem.no;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;
                var tempData = $scope.dataGrid._data[0].details;
                reloadDataGrid(tempData);
            }

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data[0].details;
                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
                reloadDataGrid(tempData);
            }

            $scope.cekData = function () {
                var tempData = $scope.dataGrid._data[0].details;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < 5; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }
                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 50,
                    // total:  ds.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                });


                var grid = $('#kGridDetail').data("kendoGrid");
                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].statCheckbox = false;
                    dataItem.details[i].no = i + 1
                }
                dataDetail = dataItem.details;
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        // {
                        //     "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        //     "template": "# if (statCheckbox) { #" +
                        //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                        //         "# } else { #" +
                        //         "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                        //         "# } #",
                        //     "width": "20px"
                        // },
                        {
                            "field": "no",
                            "title": "No",
                            "width": "45px",
                        },
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
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "hargadiscount",
                            "title": "Discount",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                        },
                        {
                            "field": "hargappn",
                            "title": "PPn",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "70px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Kadaluarsa",
                            "width": "70px",
                            "template": "<span class='style-right'>{{formatTanggal('#: tglkadaluarsa #', '')}}</span>"
                        },
                        {
                            "field": "nobatch",
                            "title": "nobatch",
                            "width": "50px"
                        }
                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatNumber = function (value, currency) {
                return number + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn '// + bln + ' bln'
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

            $scope.EditHead = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di edit!!")
                    return;
                }
                init2();
                $scope.popUpEditHead.center().open();
            }

            function init2() {
                medifirstService.get('logistik/get-combo-logistik').then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listKelompokProduk = dataCombo.kelompokproduk;
                    $scope.item.kelompokproduk = { id: 24, kelompokproduk: 'Barang Persediaan' }
                    $scope.listmataAnggaran = dataCombo.mataanggaran;
                    $scope.listKoordinator = dataCombo.jenisusulan;
                    $scope.item.koordinator = { id: 1, jenisusulan: 'Medis' };
                    $scope.listRuangan = dataCombo.ruangan;
                    $scope.listRuanganKK = dataCombo.ruangan;
                    $scope.listPegawai = dataCombo.detaillogin;
                    // $scope.listRekanan = dataCombo.rekanan;    
                    pegawaiUser = dataCombo.detaillogin[0];
                    $scope.listAsalBarang = dataCombo.asalproduk;
                    // $scope.listProduk = dat.data.produk;                   
                    medifirstService.get("logistik/get-data-produk-detail?idkelompokproduk=" + $scope.item.kelompokproduk.id, true).then(function (dat) {
                        $scope.listProduk = dat.data.produk;
                    });
                    medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                        $scope.listPegawaiPembuat = data;
                        $scope.listpegawaiKK = data;
                    });
                    medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                        $scope.listRekanan = data;
                    });
                });
                medifirstService.get("logistik/get-detail-penerimaan?norec=" + $scope.dataSelected.norec
                    , true).then(function (dat) {
                        var dataAhay = dat.data.detailterima;
                        $scope.item.noTerima = dat.data.detailterima.nostruk
                        $scope.item.noUsulan = dat.data.detailterima.nousulan
                        $scope.item.noOrder = dat.data.detailterima.nosppb
                        $scope.item.noKontrak = dat.data.detailterima.nokontrak
                        $scope.item.tglTerima = moment(dat.data.detailterima.tglstruk).format('DD-MM-YYYY HH:mm');//dat.data.detailterima.tglstruk
                        $scope.item.tglUsulan = dat.data.detailterima.tglrealisasi
                        $scope.item.tglAwal = dat.data.detailterima.tgldokumen
                        $scope.item.ketTerima = dat.data.detailterima.keteranganambil
                        $scope.item.namaPengadaan = dat.data.detailterima.namapengadaan
                        $scope.item.keterangan1 = dat.data.detailterima.keteranganlainnya
                        $scope.item.tahun = moment(dat.data.detailterima.tglstruk).format('YYYY');
                        $scope.item.kelompokproduk = { id: dat.data.pelayananPasien[0].kpid, kelompokproduk: dat.data.pelayananPasien[0].kelompokproduk }
                        $scope.item.asalproduk = { id: dat.data.pelayananPasien[0].asalprodukfk, asalProduk: dat.data.pelayananPasien[0].asalproduk }
                        $scope.item.ruanganPenerima = { id: dat.data.detailterima.id, namaruangan: dat.data.detailterima.namaruangan }
                        $scope.item.pegawaiPenerima = { id: dat.data.detailterima.pgid, namalengkap: dat.data.detailterima.namalengkap }
                        $scope.item.pegawaiPembuat = { id: dat.data.detailterima.objectpegawaipenanggungjawabfk, namalengkap: dat.data.detailterima.penanggungjawab }
                        $scope.item.tglFaktur = moment(dat.data.detailterima.tglfaktur).format('DD-MM-YYYY HH:mm');//dat.data.detailterima.tglfaktur
                        $scope.item.noFaktur = dat.data.detailterima.nofaktur
                        $scope.item.namaRekanan = { id: dat.data.detailterima.objectrekananfk, namarekanan: dat.data.detailterima.namarekanan }
                        $scope.item.mataAnggaran = { norec: dat.data.detailterima.mataanggranid, mataanggaran: dat.data.detailterima.namamataanggaran }
                        $scope.item.TglJatuhTempo = moment(dat.data.detailterima.tgljatuhtempo).format('DD-MM-YYYY HH:mm');
                    });
            }

            $scope.simpen = function () {
                var data = {
                    tglusulan: $scope.item.tglUsulan,
                    nousulan: $scope.item.noUsulan,
                    namapengadaan: $scope.item.namaPengadaan,
                    nokontrak: $scope.item.noKontrak,
                    noterima: $scope.item.noTerima,
                    tglterima: $scope.item.tglTerima,
                    kelompokproduk: $scope.item.kelompokproduk,
                    asalproduk: $scope.item.asalproduk,
                    ruangterima: $scope.item.ruanganPenerima,
                    pegawaipenerima: $scope.item.pegawaiPenerima,
                    tglfaktur: $scope.item.tglFaktur,
                    nofaktur: $scope.item.noFaktur,
                    rekanan: $scope.item.namaRekanan,
                    tgljatuhtempo: $scope.item.TglJatuhTempo,
                    norec: $scope.dataSelected.norec
                }

                medifirstService.post('logistik/update-head', data).then(function (e) {
                    $scope.popUpEditHead.close();
                    $scope.dataSelected.norec = '';
                    init();
                });
            }

            $scope.batal = function () {
                $scope.popUpEditHead.close();
                $scope.dataSelected.norec = '';
            }

            $scope.KlikFakturOtomatis = function (data) {
                /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
                var asalproduk = '';
                if ($scope.item.asalproduk != undefined) {
                    asalproduk = $scope.item.asalproduk.asalProduk
                }
                var nows = moment(new Date()).format('MM-YY')
                if (asalproduk.indexOf('Badan Layanan') > -1 || asalproduk == '')
                    $scope.item.noFaktur = 'PB/' + nows + '/APT/____'
                else if (asalproduk.indexOf('Hibah') > -1)
                    $scope.item.noFaktur = 'PB/' + nows + '/BG/____'
                else if (asalproduk.indexOf('Kas Kecil') > -1)
                    $scope.item.noFaktur = 'PB/' + nows + '/KK/____'

            };

            $scope.KlikFakturBlmAda = function (data) {
                /* Format No Faktur PB/BLN-THN/APT/NO URUT (APT = BLU, BG = Hibah,  KK = Kas  Kecil) */
                var asalproduk = '';
                if ($scope.item.asalproduk != undefined) {
                    asalproduk = $scope.item.asalproduk.asalProduk
                }
                $scope.item.noFaktur = "-";
            };

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                }
                // var bulanclosing = moment(dataSelected.tglstruk).format('MM.YYYY');
                // medifirstService.get("logistik/cek-closing-persediaan?bulan=" + bulanclosing
                //     + "&ruanganfk=" + dataSelected.objectruanganfk).then(function (dat) {
                //         statusClosingStok = dat.data;
                //     })
            }

            $scope.ubahHarga = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Diubah !')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                // $scope.isRouteLoading = true
                // medifirstService.get('logistik/cek-transaksi-use?norec=' + $scope.dataSelected.norec).then(function (e) {
                //     $scope.isRouteLoading = false
                //     if (e.data.isedit == true) {
                        $scope.popUpPassword.center().open();
                        // $scope.lanjutUbahHarga()
                //     } else {
                //         toastr.error('Stok Telah Digunakan, Tidak Bisa Ubah Penerimaan')
                //         return
                //     }
                // })
            }

            $scope.BatalkanUbahHarga = function () {
                $scope.item.kataKunciPass = "";
                $scope.item.kataKunciConfirm = "";
                $scope.popUpPassword.close();
            }

            $scope.LanjutKeUbahHarga = function () {
                $scope.isRouteLoading = true;
                if ($scope.passwordUbahHarga == undefined) {
                    alert("Autorisasi Tidak Ditemukan!!")
                    $scope.isRouteLoading = false;
                    return
                }

                medifirstService.get("sysadmin/general/get-validasi-autorisasi-password?namaautorisasi="
                    + $scope.passwordUbahHarga
                    + "&passcode=" + $scope.item.kataKunciPass, true).then(function (dat) {
                        var datas = dat.data;
                        if (datas.message == "Password Salah") {
                            toastr.error(datas.message + " Hubungi Pihak IT / SIMRS !", "Info ");
                            return;
                        } else {
                            $scope.item.kataKunciPass = "";
                            $scope.item.kataKunciConfirm = "";
                            $scope.popUpPassword.close();                            
                            $scope.isRouteLoading = false;
                            $scope.lanjutUbahHarga();
                        }
                    });
            }

            $scope.lanjutUbahHarga = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('UbahHargaPenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('UbahHargaPenerimaanBarangSuplier')
            }
            $scope.verifSPJ = function(){
                console.log($scope.selectedData2);
                
                // return
                if ($scope.selectedData2 == "") {
                    toastr.error('Checklist data dulu')
                    return
                }
                
                $scope.popUpVerif.center().open()

                // $scope.isRouteLoading = true
                
            }
            $scope.SimpanVerif = function(){
                $scope.isRouteLoading = true
                var objSave = {
                    data: $scope.selectedData2,
                    tglverif: moment($scope.item.tglverif).format('YYYY-MM-DD HH:mm'),
                    nospj: $scope.item.nospj
                }
                medifirstService.post('logistik/save-verif-spj', objSave).then(function (e) {
                    init();
                    $scope.isRouteLoading = false
                })
            }
            $scope.batalVerif = function(){
                $scope.popUpVerif.close()
            }
            //***********************************
        }
    ]);
});
