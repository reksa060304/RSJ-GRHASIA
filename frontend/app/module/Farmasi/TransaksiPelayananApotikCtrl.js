define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TransaksiPelayananApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var norec_apd = ''
            var statusPosting = true
            $scope.isRouteLoading = false;
            // var pegawaiUser = {}
            var statusClosingStok = false;
            var detail = ''
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananApotikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.KelompokUser = medifirstService.getKelompokUser();
                    if ($scope.KelompokUser == "apotik" || $scope.KelompokUser == "farmasi") {
                        $scope.farmasi = true;
                        $scope.Nonfarmasi = false;
                    } else {
                        $scope.farmasi = false;
                        $scope.Nonfarmasi = true;
                    }
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    norec_apd = chacePeriode[8]
                    detail = chacePeriode[9]
                    medifirstService.get("farmasi/get-detailPD?norec_apd=" + norec_apd, true).then(function (data_ih) {
                        $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
                        $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
                        $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
                        $scope.item.Norec_Pd = data_ih.data.detailPD[0].norec_pd
                        $scope.item.dokterdpjp = { id: data_ih.data.detailPD[0].pgid, namalengkap: data_ih.data.detailPD[0].namadokterdpjp }
                        // pegawaiUser = data_ih.data.datalogin[0]
                    });
                    init()
                } else {

                }
            }
            function init() {
                //debugger;
                $scope.isRouteLoading = true;
                if (detail == "detail") {
                    medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].iskronis == true || dat.data[i].iskronis == 't') {
                                dat.data[i].kronis = "✔"
                            } else {
                                dat.data[i].kronis = ""
                            }
                        }
                        $scope.dataGrid = dat.data;
                    });

                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        }
                        $scope.dataGridOK = dat.data;
                    });
                } else if (detail == "resep") {
                    var chacePeriode = cacheHelper.get('DaftarResepCtrl');
                    if (chacePeriode != undefined) {
                        var noresep = chacePeriode[0]
                        medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi + "&norec_resep=" + noresep, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                                if (dat.data[i].iskronis == true || dat.data[i].iskronis == 't') {
                                    dat.data[i].kronis = "✔"
                                } else {
                                    dat.data[i].kronis = ""
                                }
                            }
                            $scope.dataGrid = dat.data;
                        });

                        medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi + "&norec_resep=" + noresep, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            }
                            $scope.dataGridOK = dat.data;
                        });
                    }

                } else {
                    medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].iskronis == true || dat.data[i].iskronis == 't') {
                                dat.data[i].kronis = "✔"
                            } else {
                                dat.data[i].kronis = ""
                            }
                        }
                        $scope.dataGrid = dat.data;
                    });

                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        }
                        $scope.dataGridOK = dat.data;
                    });
                }
            }

            $scope.klikOK = function (dataSelectedOK) {
                if (dataSelectedOK != undefined) {
                    $scope.dataSelectedOK = dataSelectedOK;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.selectedData2 = [];
            $scope.selectedDataKronis = [];
            $scope.onClickKronis = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridKronis").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedDataKronis, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        $scope.selectedDataKronis.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedDataKronis.length; i++)
                            if ($scope.selectedDataKronis[i].produkfk === dataItem.produkfk) {
                                $scope.selectedDataKronis.splice(i, 1);
                                break;
                            }
                        $scope.selectedDataKronis.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDataKronis.length; i++)
                        if ($scope.selectedDataKronis[i].produkfk === dataItem.produkfk) {
                            $scope.selectedDataKronis.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            $scope.onClick = function (e) {

                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].produkfk === dataItem.produkfk) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].produkfk === dataItem.produkfk) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.columnGrid = [
                {
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    "width": 40
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "100px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "30px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "80px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "jasa",
                    "title": "Jasa",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "kronis",
                    "title": "Kronis",
                    "width": "100px"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "100px"
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "Tgl Exp",
                    "width": "90px",
                },
            ];

            $scope.columnGridOK = [
                {
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClickKronis($event)' />",
                    "width": 40
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "noresepok",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "100px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "30px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "80px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "75px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "jasa",
                    "title": "Jasa",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
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
                    "field": "tglstruk",
                    "title": "Tgl Struk",
                    "width": "50px"
                },
                {
                    "field": "nostruk",
                    "title": "NoTerima",
                    "width": "60px"
                },
                {
                    "field": "namaruanganasal",
                    "title": "Nama Ruangan Asal",
                    "width": "100px"
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Nama Ruangan Tujuan",
                    "width": "100px"
                },
                {
                    "field": "petugas",
                    "title": "Petugas",
                    "width": "100px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px"
                }
            ];
            $scope.columnPopUpAPD = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namakelas",
                    "title": "Kelas",
                    "width": "100px"
                },
                {
                    "field": "tglmasuk",
                    "title": "Tgl Masuk",
                    "width": "100px"
                },
                {
                    "field": "tglkeluar",
                    "title": "Tgl Keluar",
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
            $scope.back = function () {
                //$state.go("DaftarPasienApotik")
                window.history.back();
            }
            $scope.BridgingMiniR45 = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Resep terlebih dahulu!!")
                    return
                }//
                if ($scope.dataSelected.jeniskemasan != 'Racikan/Puyer') {
                    alert("Harus Racikan puyer!!")
                    return
                }
                var objSave =
                {
                    strukresep: $scope.dataSelected.norec_resep,
                    rke: $scope.dataSelected.rke
                }

                medifirstService.postbridgingminir45(objSave).then(function (e) {

                })
            }
            $scope.BridgingConsisD = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Resep terlebih dahulu!!")
                    return
                }
                if ($scope.dataSelected.jeniskemasan != 'Non Racikan') {
                    alert("Harus Non Racikan!!")
                    return
                }
                var kampret = prompt("Input Counter ID", "1");
                var objSave =
                {
                    strukresep: $scope.dataSelected.norec_resep,
                    counterid: kampret
                }

                medifirstService.post('bridging/farmasi/save-consis-d', objSave).then(function (e) {

                })
            }
            $scope.TambahObat = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     alert('Sudah verifikasi Tatarekening Tidak Bisa Menambah Obat!')
                //     return;
                // }                
                if ($scope.dataSelectedPopUpAPD != undefined) {
                    // * Validasi Untuk Sekali Bayar
                    //medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                    //$scope.dataSelected.noregistrasi, true).then(function(dat){                           
                    // if (dat.data.status == true) {
                    //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                    //     return;
                    // }else{

                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {

                            //** */
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: $scope.dataSelectedPopUpAPD.norec,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: { id: $scope.dataSelectedPopUpAPD.pgid, namalengkap: $scope.dataSelectedPopUpAPD.namadokter }
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                            // }
                            // });
                            // * Validasi Untuk Sekali Bayar
                        }
                    })
                    //  ** cek status closing
                } else {

                    // * Validasi Untuk Sekali Bayar
                    // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                    //     $scope.item.noregistrasi, true).then(function(dat){
                    //     if (dat.data.status == true) {
                    //         window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                    //         return;
                    //     }else{
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {

                            //** */
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: norec_apd,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: $scope.item.dokterdpjp
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                            //     }
                            // });
                            // * Validasi Untuk Sekali Bayar         
                        }
                    })
                    //  ** cek status closing           
                }

            }
            $scope.tambahtenaga = function () {
                $scope.popupDetailRegistrasi.center().open();
                $scope.dataPopUpAPD = [];
                $scope.isRouteLoading = true;
                medifirstService.get("farmasi/get-detail-reg-farmasi?" +
                    "noregistrasi=" + $scope.item.noregistrasi
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataPopUpAPD = dat.data;
                        // $scope.dataPopUp212 = new kendo.data.DataSource({
                        //     data: dat.data.daftar
                        // });
                        // $scope.dataPopUpPaketObat = dat.data.daftar;

                    });
            }
            $scope.paketObat = function () {

                $scope.popupPaketObat.center().open();
                $scope.dataPopUp = [];
                medifirstService.get("farmasi/get-daftar-paket-obat-pasien?" +
                    "noregistrasi=" + $scope.item.noregistrasi
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataPopUp = dat.data.daftar;
                        // $scope.dataPopUp212 = new kendo.data.DataSource({
                        //     data: dat.data.daftar
                        // });
                        // $scope.dataPopUpPaketObat = dat.data.daftar;

                    });
            }
            $scope.baruPopUp = function () {
                // * Validasi Untuk Sekali Bayar
                //medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //$scope.item.noregistrasi, true).then(function(dat){
                // if (dat.data.status == true) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                //     return;
                // }else{
                var arrStr = {
                    0: $scope.item.noMr,
                    1: $scope.item.namaPasien,
                    2: $scope.item.jenisKelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umur,
                    5: $scope.item.kelas.id,
                    6: $scope.item.kelas.namakelas,
                    7: $scope.item.tglRegistrasi,
                    8: norec_apd,
                    9: '',
                    10: $scope.item.jenisPenjamin,
                    11: $scope.item.kelompokPasien,
                    12: $scope.item.beratBadan,
                    13: $scope.item.AlergiYa,
                    14: '',
                    15: ''
                }
                cacheHelper.set('PaketObatPasienCtrl', arrStr);
                $state.go('PaketObatPasien')
                //     }
                // })
                // * Validasi Untuk Sekali Bayar                
            }

            $scope.ubahPopUp = function () {
                if ($scope.dataSelectedPopUp == undefined) {
                    alert("Pilih yg akan di ubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.item.noMr,
                    1: $scope.item.namaPasien,
                    2: $scope.item.jenisKelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umur,
                    5: $scope.item.kelas.id,
                    6: $scope.item.kelas.namakelas,
                    7: $scope.item.tglRegistrasi,
                    8: norec_apd,
                    9: '',
                    10: $scope.item.jenisPenjamin,
                    11: $scope.item.kelompokPasien,
                    12: $scope.item.beratBadan,
                    13: $scope.item.AlergiYa,
                    14: 'EditKirim',
                    15: $scope.dataSelectedPopUp.norec
                }
                cacheHelper.set('PaketObatPasienCtrl', chacePeriode);
                $state.go('PaketObatPasien')
            }

            $scope.EditResep = function () {
                // * Validasi Untuk Sekali Bayar
                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }

                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //     $scope.dataSelected.noregistrasi, true).then(function(dat){

                 // ** VALIDASI CLOSING STOK 
                 if (statusPosting == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Ubah Resep!')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa mengubah Obat!')
                    return;
                } 
                // else {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelas.id,
                        6: $scope.item.kelas.namakelas,
                        7: $scope.item.tglRegistrasi,
                        8: norec_apd,
                        9: 'EditResep',
                        10: $scope.item.jenisPenjamin,
                        11: $scope.item.kelompokPasien,
                        12: $scope.item.beratBadan,
                        13: $scope.item.AlergiYa,
                        14: $scope.dataSelected.norec_resep,
                        15: $scope.item.dokterdpjp
                    }
                    cacheHelper.set('InputResepApotikCtrl', arrStr);
                    $state.go('InputResepApotik')
                // }
                // });
                //debugger;

            }
            
            $scope.klikgrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected;
                }
                var resep = dataSelected.noresep.split("/");
                var tahunresep = moment(dataSelected.tglpelayanan).format('YYYY');
                var bulanclosing = resep[1].substr(2) + "." + tahunresep;

                medifirstService.get("sysadmin/general/get-sudah-posting?tgl=" +
                    $scope.dataSelected.tglpelayanan, true).then(function (dat) {
                        statusPosting = dat.data
                    });
                // statusPosting = true;
                medifirstService.get("logistik/cek-closing-persediaan?bulan=" + bulanclosing
                    + "&ruanganfk=" + dataSelected.depoid).then(function (dat) {                        
                        statusClosingStok = dat.data;
                    })
            }

            $scope.Retur = function () {
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening.')
                    return;
                }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                // $scope.dataSelected.noregistrasi, true).then(function(dat){
                
                 // ** VALIDASI CLOSING STOK 
                 if (statusPosting == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa retur Obat!')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa retur Obat!')
                    return;
                } 
                // else {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelas.id,
                        6: $scope.item.kelas.namakelas,
                        7: $scope.item.tglRegistrasi,
                        8: norec_apd,
                        9: 'EditResep',
                        10: $scope.item.jenisPenjamin,
                        11: $scope.item.kelompokPasien,
                        12: $scope.item.beratBadan,
                        13: $scope.item.AlergiYa,
                        14: $scope.dataSelected.norec_resep
                    }
                    cacheHelper.set('InputResepApotikReturCtrl', arrStr);
                    $state.go('InputResepApotikRetur')
                // }
                // });
                //debugger;
            }

            $scope.orderApotik = function () {
                $state.go("InputResepApotikOrder")
            }

            $scope.HapusResep = function () {
                $scope.isRouteLoading = true;
                 // ** VALIDASI CLOSING STOK 
                 if (statusPosting == true) {
                    window.messageContainer.error('Data Stok Sudah Diclosing Tidak Bisa Hapus Resep!')
                    return;
                }
                // **  VALIDASI CLOSING STOK 

                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                    return;
                }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //     return;
                // } else {
                    var stt = 'false'
                    if (confirm('Hapus resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        $scope.isRouteLoading = false;
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    var objDelete = { norec: $scope.dataSelected.norec_resep }
                    medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                        $scope.isRouteLoading = false;
                        LoadCache();
                        //##save Logging user
                        medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep="
                            + $scope.dataSelected.norec_resep

                        ).then(function (data) {
                        })
                        //##end 
                    })
                // }
                // });
            }
            
            $scope.cetakEtiket = function () {
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=' + $scope.dataSelected.norec_resep + '&cetak=1', function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakResep = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResep = function () {
                // if ($scope.dataSelected == undefined || ) {
                //     alert('Pilih resep yg akan di cetak')
                //     return;
                // }
                if ($scope.selectedData2.length != 0) {

                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                    }

                    var norec = $scope.selectedData2[0].norec_resep
                    var user = $scope.selectedData2[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiCeklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });


                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasi=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }


            }


            $scope.cetakLabelIdentitas = function () {
                var stt = 'false'
                if (confirm('View Label Indentitas Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelIdentitasPasien=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }


            $scope.cetakLabelResepAdm = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiAdmin=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResepKemo = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKemo=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResepTPN = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiTPN=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
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

            $scope.CetakSEP = function () {
                if ($scope.item.noregistrasi != undefined && $scope.item.kelompokPasien !== "Umum/Pribadi") {

                    //##save identifikasi sep
                    medifirstService.get("sysadmin/general/identifikasi-sep?norec_pd="
                        + $scope.item.Norec_Pd
                    ).then(function (data) {
                        var datas = data.data;
                    })
                    //##end

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.item.noregistrasi + '&view=false', function (response) {
                        // do something with response
                    });
                }
            }

            $scope.cetakLabeKecil = function () {
                if ($scope.selectedData2.length != 0) {

                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                    }

                    var norec = $scope.selectedData2[0].norec_resep
                    var user = $scope.selectedData2[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });


                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakLabelRekap = function () {
                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if ($scope.selectedData2.length != 0) {
                    var Produkfk = ''
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                    }
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + $scope.dataSelected.norec_resep).then(function (dat) {
                        $scope.datas = dat.data;
                        var JmlPagi = 0;
                        var JmlSiang = 0;
                        var JmlSore = 0;
                        var JmlMalam = 0;
                        $scope.datas.forEach(function (element) {
                            var customData = {};
                            for (var key in element) {
                                switch (key) {
                                    case "pagi":
                                        if (element.pagi != '-') {
                                            if (JmlPagi < 1) {
                                                JmlPagi = parseFloat(JmlPagi) + 1;
                                                // var stt = 'false'
                                                var isPagi = 'Pagi';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        } else {
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelected.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=-' + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelected.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    case "sore":
                                        if (element.sore != '-') {
                                            if (JmlSore < 1) {
                                                JmlSore = parseFloat(JmlSore) + 1;
                                                // var stt = 'false'
                                                var isSore = 'Sore';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelected.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    case "malam":
                                        if (element.malam != '-') {
                                            if (JmlMalam < 1) {
                                                JmlMalam = parseFloat(JmlMalam) + 1;
                                                // var stt = 'false'
                                                var isMalam = 'Malam';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelected.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    default:
                                        customData[key] = element[key];
                                        break;
                                }
                            };
                        });
                    })
                } else {
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + $scope.dataSelected.norec_resep).then(function (dat) {
                        $scope.datas = dat.data;
                        var JmlPagi = 0;
                        var JmlSiang = 0;
                        var JmlSore = 0;
                        var JmlMalam = 0;
                        $scope.datas.forEach(function (element) {
                            var customData = {};
                            for (var key in element) {
                                switch (key) {
                                    case "pagi":
                                        if (element.pagi != '-') {
                                            if (JmlPagi < 1) {
                                                JmlPagi = parseFloat(JmlPagi) + 1;
                                                // var stt = 'false'
                                                var isPagi = 'Pagi';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        } else {
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=-' + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    case "sore":
                                        if (element.sore != '-') {
                                            if (JmlSore < 1) {
                                                JmlSore = parseFloat(JmlSore) + 1;
                                                // var stt = 'false'
                                                var isSore = 'Sore';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    case "malam":
                                        if (element.malam != '-') {
                                            if (JmlMalam < 1) {
                                                JmlMalam = parseFloat(JmlMalam) + 1;
                                                // var stt = 'false'
                                                var isMalam = 'Malam';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                            }
                                        }
                                        break;
                                    default:
                                        customData[key] = element[key];
                                        break;
                                }
                            };
                        });
                    })
                }
            }

            $scope.cetakNoAntrianFarmasi = function () {
                var stt = 'false'
                if (confirm('View Antrian Farmasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + $scope.dataSelected.noresep + '&noregistrasi=' + $scope.dataSelected.noregistrasi + '&view=' + stt, function (response) {
                    // aadc=response;
                });
            }

            $scope.cetakLabelRekapRajal = function () {
                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }

            $scope.CetakResep23 = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelectedOK == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep-ok=1&nores=' + $scope.dataSelectedOK.norec_resep + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    // aadc=response;
                });
            }
            $scope.HapusKronis = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelectedOK.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                    return;
                }

                if ($scope.dataSelectedOK.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                    return;
                } else {
                    var stt = 'false'
                    if (confirm('Hapus resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        $scope.isRouteLoading = false;
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    var objDelete = { norec: $scope.dataSelectedOK.norec_resep }
                    medifirstService.post('farmasi/save-hapus-pelayananobat-kronis', objDelete).then(function (e) {
                        $scope.isRouteLoading = false;
                        LoadCache();
                        //##save Logging user
                        medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep="
                            + $scope.dataSelectedOK.norec_resep

                        ).then(function (data) {
                        })
                        //##end 
                    })
                }
            }

            $scope.cetakLabelResep23 = function () {
                if ($scope.selectedDataKronis.length != 0) {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedDataKronis.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedDataKronis[i].produkfk
                    }

                    var norec = $scope.selectedDataKronis[0].norec_resep
                    var user = $scope.selectedDataKronis[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiCeklis-Ok=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });

                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasi-ok=' + $scope.dataSelectedOK.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelectedOK.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakLabeBiru = function () {
                if ($scope.selectedData2.length == 0) {
                    toastr.warning("Data Belum Dipilih!!!")
                    return;
                }
                var stt = 'false'
                if (confirm('View Label resep Biru? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var Produkfk = ''
                for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                    Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                }

                var norec = $scope.selectedData2[0].norec_resep
                var user = medifirstService.getPegawaiLogin();

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiBiru-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    // aadc=response;
                });
            }

            $scope.Riwayat = function () {

                var nocm = "";
                if ($scope.item.noMr) {
                    nocm = $scope.item.noMr;
                }

                var noregistrasi = "";
                if ($scope.item.noregistrasi) {
                    noregistrasi = $scope.item.noregistrasi;
                }


                medifirstService.get("emr/get-transaksi-pelayanan?&noregistrasi=" + noregistrasi + "&nocm=" + nocm, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            } else {
                                dat.data[i].cekreseppulang = '-'
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridRiwayat = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                    $scope.popUpRiwayat.center().open();
                });
            }


            $scope.columnGridRiwayat = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                    "template": "<span class='style-center'>#: cekreseppulang #</span>"
                }
            ];
            $scope.data22 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        }

                    ]
                }
            };
            //***********************************
        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1