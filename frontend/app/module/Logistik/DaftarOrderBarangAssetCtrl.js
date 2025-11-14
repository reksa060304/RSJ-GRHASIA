define(['initialize','Configuration'], function (initialize,configuration) {
    'use strict';
    initialize.controller('DaftarOrderBarangAssetCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var baseTransaksi = configuration.baseApiBackend;
            var pegawaiUser = {}
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarOrderBarangAssetCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = $scope.now;
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

            $scope.newOrder = function () {
                $state.go('OrderBarangAsset')
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();            
            }

            $scope.deleteOrder = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.statusorder != '') {
                    alert("Sudah di kirim tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    norecorder: $scope.dataSelected.norec
                }

                medifirstService.post('logistik/delete-order-barang-ruangan',objSave).then(function (e) {
                    init()
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.namaruangantujuan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.namaruangantujuan
                }
                var rg2 = ""
                if ($scope.item.namaruanganpemesan != undefined) {
                    var rg2 = "&ruanganpemesanfk=" + $scope.item.namaruanganpemesan
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-data-order-barang-asset?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noorder=" + $scope.item.struk + rg + rg2 + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        // for (var i = 0; i < dat.data.daftar.length; i++) {
                        //     dat.data.daftar[i].no = i + 1                           
                        // }
                        var data2 = dat.data.daftar;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            for (let e = 0; e < data2[i].details.length; e++) {
                                data2[i].details[e].no = e + 1;                            
                            }
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
                        // $scope.dataGrid = dat.data.daftar;
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
                cacheHelper.set('DaftarOrderBarangAssetCtrl', chacePeriode);
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

            $scope.EditOrder = function () {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangAssetCtrl', chacePeriode);
                $state.go('OrderBarangAsset')
            }

            $scope.KirimBarang = function () {
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarang',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangAssetCtrl', chacePeriode);
                $state.go('KirimBarangAsset')
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarOrderBarangAsset.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Order Barang",
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
                    "field": "no",
                    "title": "No",
                    "width": "35px",
                },
                {
                    "field": "status",
                    "title": "Status",
                    "width": "100px"
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "60px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "100px",
                },
                {
                    "field": "jeniskirim",
                    "title": "Jenis Order",
                    "width": "80px",
                },
                {
                    "field": "jmlitem",
                    "title": "Item",
                    "width": "35px",
                    "template": "<span class='style-right'>#= kendo.toString(jmlitem) #</span>",
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Pemesan",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "120px",
                },
                {
                    "field": "petugas",
                    "title": "Petugas",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status Order",
                    "width": "100px",
                }
            ]
        }

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "35px",
                        },
                        {
                            "field": "kdproduk",
                            "title": "Kd Produk",
                            "width": "70px",
                        },
                        // {
                        //     "field": "kdsirs",
                        //     "title": "Kd Sirs",
                        //     "width": "70px",
                        // },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        // {
                        //     "field": "satuanstandar",
                        //     "title": "Satuan",
                        //     "width": "30px",
                        // },
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

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            $scope.cetak = function () {
                if (!$scope.dataSelected) {
                    alert("Pilih data order terlebih dahulu!");
                    return;
                }

                var pegawaiList = Array.isArray($scope.ListDataPegawai) ? $scope.ListDataPegawai : [];
                var jabatanList = Array.isArray($scope.ListDataJabatan) ? $scope.ListDataJabatan : [];

                // DataPegawai otomatis dari dataSelected
                $scope.item.DataPegawai = pegawaiList.find(x => x.namalengkap === $scope.dataSelected.petugas);

                // DataPegawai2 manual, tapi jika kosong, set default dari login
                if (!$scope.item.DataPegawai2 && $scope.dataLogin) {
                    var pegawaiLoginId = $scope.dataLogin?.pegawaiId;
                    if (pegawaiLoginId) {
                        $scope.item.DataPegawai2 = pegawaiList.find(x => x.id === pegawaiLoginId);
                    }
                }

                // Set jabatan otomatis
                if ($scope.item.DataPegawai) {
                    $scope.item.DataJabatan = jabatanList.find(x => x.id === $scope.dataSelected.jabatanMemintaId);
                }
                if ($scope.item.DataPegawai2) {
                    $scope.item.DataJabatan2 = jabatanList.find(x => x.id === $scope.dataLogin?.jabatanId);
                }

                $scope.popUp.center().open();
            };


            $scope.CetakAh = function () {
                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan
                }

                // Ambil langsung pegawai yang membuat order
                var pegawai2 = $scope.dataSelected.idPegawaiMeminta || '';
                    $scope.item.DataPegawai = {
                    id: $scope.dataSelected.idPegawaiMeminta,
                    namalengkap: $scope.dataSelected.petugas
                };

                var kdprofile = ''
                if ($scope.dataLogin && $scope.dataLogin.kdProfile) {
                    kdprofile = $scope.dataLogin.kdProfile
                } else {
                    var profileStorage = JSON.parse(localStorage.getItem('profile') || '{}')
                    if (profileStorage.id) {
                        kdprofile = profileStorage.id
                    }
                }

                var user = (window.pegawaiUser && pegawaiUser[0] && pegawaiUser[0].namalengkap) ? pegawaiUser[0].namalengkap : ''

                var url = baseTransaksi + 'report/cetak-bukti-order-barang-asset'
                    + '?norec=' + $scope.dataSelected.norec
                    + '&kdprofile=' + kdprofile
                    + '&pegawaiMengetahui=' + pegawai1
                    + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1
                    + '&jabatanMeminta=' + jabatan2
                    + '&user=' + user

                window.open(url, '_blank')
                $scope.popUp.close()
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
