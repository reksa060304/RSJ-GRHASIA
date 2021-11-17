define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRegistrasiSterilCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var datas = [];
            var data3 = [];
            var etos = [];
            var dataCheck = [];
            $scope.dataAh = [];
            var norecKirim = '';
            var noKirim = '';
            LoadCache();
            loadCombo();            
            var data2 = []

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarRegistrasiSterilCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');;
                    init();
                }
            }


            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });

                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listDataJabatan = dataCombo.jabatan;
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();
            }

            function init() {
                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.namaruangantujuan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.namaruangantujuan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("sterilisasi/get-daftar-registrasi-steril?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nokirim=" + $scope.item.struk + rg + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        data2 =  dat.data.daftar
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
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

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarRegistrasiSterilCtrl', chacePeriode);
                var jenispermintaanfk = '';
                var objSave = {
                    jenispermintaanfk: jenispermintaanfk,
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }
                // medifirstService.post('sysadmin/general/save-jurnal-amprahan-barang-all',objSave).then(function (data) {
                // });
            }

            $scope.klikGrid = function (data) {
                if (data != undefined) {
                    etos = data.details;
                }

            }            

            $scope.kirim = function(){
                // if ($scope.dataSelected == undefined) {
                //     toastr.error("Pilih yg akan di ubah!!")
                //     return;
                // }
                // if ($scope.dataSelected.statuskirim == 'Kirim') {
                //     toastr.error("Sudah dikirim")
                //     return;
                // }
                var chacePeriode = {
                    0: '',
                    1: 'PENGIRIMAN BARANG STERIL',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PengirimanBarangSterilCtrl', chacePeriode);
                $state.go('PengirimanBarangSteril')
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.Registrasi = function () {
                $state.go('RegistrasiBarangSteril')
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
                cacheHelper.set('RegistrasiBarangSterilCtrl', chacePeriode);
                $state.go('RegistrasiBarangSteril')
            }                                                                   

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },                
                {
                    "field": "tglstruk",
                    "title": "Tgl Struk",
                    "width": "50px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "NoStruk",
                    "width": "80px",
                },               
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },                
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "100px",
                },
                {
                    "field": "petugas",
                    "title": "Petugas",
                    "width": "100px",
                }                
            ];

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
                dataCheck = dataItem.details;
                $scope.dataAh = dataItem.details;
                $scope.dataGrid1 = dataItem.details;
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [                       
                        {
                            "field": "no",
                            "title": "No",
                            "width": "25px",
                        },
                        {
                            "field": "kdproduk",
                            "title": "Kd Produk",
                            "width": "50px",
                        },                       
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "150px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "40px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "40px",
                        }
                    ]
                }
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

            $scope.BatalKirim = function(){
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }               
                
                var objSave = {
                    nostruk: $scope.dataSelected.norec,
                    noorderfk: $scope.dataSelected.noorderfk,
                    nomorstruk: $scope.dataSelected.nostruk,
                }
                medifirstService.post('sterilisasi/delete-registrasi-barang-sterilisasi', objSave).then(function (e) {
                    medifirstService.postLogging('Batal Registrasi Alat CSSD', 'norec strukpelayanan_t', $scope.dataSelected.norec,
                    'Batal Registrasi Alat CSSD Noregistrasi : ' + $scope.dataSelected.nostruk).then(function (res) {
                    })               
                });
            }

            //** BATAS SUCI */
        }
    ]);
});
