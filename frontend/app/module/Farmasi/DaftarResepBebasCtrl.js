define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarResepBebasCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            // initialize.controller('DaftarResepBebasCtrl', ['$q', '$rootScope', '$scope', 'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var statusClosingStok = false;
            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepBebasCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
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

            $scope.cariEnter  = function(){
                init()
            }
            
            function loadCombo() {
                medifirstService.get("farmasi/get-datacombo_dp", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruanganfarmasi;
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
                $scope.dataGrid = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10,
                    total: 0,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {
                            }
                        }
                    }
                });
                // var Jra =""
                // if ($scope.item.jenisRacikan != undefined){
                //     var Jra ="&jenisobatfk=" +$scope.item.jenisRacikan.id
                // }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-daftar-jual-bebas?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien + rg
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            // var tanggal = $scope.now;
                            // var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            // var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            // dat.data.daftar[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                        }
                        var data2 = dat.data.daftar;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2[0].length,
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
                cacheHelper.set('DaftarResepBebasCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = array([
                    'Depo Farmasi IGD',
                    'Depo Farmasi Ranap',
                    'Depo Farmasi Rajal',
                    'Depo Farmasi IBS'
                ]);
            }
            $scope.cariFilter = function () {

                init();
            }

            // $scope.TransaksiPelayanan = function(){
            //     debugger;
            //     var arrStr ={ 0 : $scope.dataSelected.nocm ,
            //         1 : $scope.dataSelected.namapasien,
            //         2 : $scope.dataSelected.jeniskelamin,
            //         3 : $scope.dataSelected.noregistrasi, 
            //         4 : $scope.dataSelected.umur,
            //         5 : $scope.dataSelected.klid,
            //         6 : $scope.dataSelected.namakelas,
            //         7 : $scope.dataSelected.tglregistrasi,
            //         8 : $scope.dataSelected.norec_apd,
            //         9 : 'resep'
            //     }
            //     cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
            //     $state.go('TransaksiPelayananApotik')

            //     var arrStr2 ={ 0 : $scope.dataSelected.norec 
            //     }
            //     cacheHelper.set('DaftarResepCtrl', arrStr2);
            //     $state.go('DaftarResepCtrl')
            // }

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
                // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                //     //aadc=response;
                // });
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep-new=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }
            $scope.EditResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Data terlebih dahulu!!")
                    return;
                }

                if ($scope.dataSelected.nosbm != undefined) {
                    window.messageContainer.error('Resep ini telah dibayar!')
                    return;
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Edit Obat!')
                    return;
                }
                // **  VALIDASI CLOSING STOK 
                
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditResep',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('InputResepApotikNonLayananCtrl', chacePeriode);
                $state.go('InputResepApotikNonLayanan')
            }

            $scope.HapusResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Data terlebih dahulu!!")
                    return;
                }

                if ($scope.dataSelected.nosbm != undefined) {
                    window.messageContainer.error('Resep ini telah dibayar!')
                    return;
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Hapus Obat!')
                    return;
                }
                // **  VALIDASI CLOSING STOK   

                var objSave = {
                    norec_sp: $scope.dataSelected.norec,
                }
                medifirstService.post('farmasi/hapus-resep_ob', objSave).then(function (e) {
                    init()
                })
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
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
                },
                {
                    "field": "nostruk",
                    "title": "NoResep",
                    "width": "60px",
                },
                {
                    "field": "nostruk_intern",
                    "title": "No MR",
                    "width": "50px",
                },
                {
                    "field": "namapasien_klien",
                    "title": "Nama Pasien",
                    "width": "120px",
                },
                {
                    "field": "noteleponfaks",
                    "title": "No Telp",
                    "width": "120px",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "nosbm",
                    "title": "SBM",
                    "width": "100px"
                }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "resepke",
                            "title": "Rke",
                            "width": "30px",
                        },
                        {
                            "field": "jeniskemasan",
                            "title": "Jumlah",
                            "width": "50px"
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
                            "field": "hargatambahan",
                            "title": "Jasa",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargatambahan #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "70px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Exp",
                            "width": "90px",
                            // "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        }
                    ]
                }
            };
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
            function itungUsia(tgl) {
                debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
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
            
            $scope.LabelResep = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                // cetak-LabelFarmasiOB 
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiOBKecil=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {                    
                });
            }

            $scope.LabelIdentitas = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View Label identitas? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                // cetak-LabelFarmasiOB 
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelIdentitasPasienOB=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {                    
                });
            }

            $scope.ReturResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Data terlebih dahulu!!")
                    return;
                }

                if ($scope.dataSelected.nosbm != undefined) {
                    window.messageContainer.error('Resep ini telah dibayar!')
                    return;
                }

                // ** VALIDASI CLOSING STOK 
                if (statusClosingStok == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Retur Obat!')
                    return;
                }
                // **  VALIDASI CLOSING STOK     

                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'ReturResep',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('cacheReturObatBebas', chacePeriode);
                $state.go('InputResepApotikNonLayananRetur')
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
                var resep = dataSelected.nostruk.split("/");
                var tahunresep = moment(dataSelected.tglstruk).format('YYYY');
                var bulanclosing = resep[1].substr(2) + "." + tahunresep;
                medifirstService.get("logistik/cek-closing-persediaan?bulan=" + bulanclosing
                    + "&ruanganfk=" + dataSelected.objectruanganfk).then(function (dat) {
                        statusClosingStok = dat.data;
                    })
            }

            //* BATAS SUCI *//
        }
    ]);
});
