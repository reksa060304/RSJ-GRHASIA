define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRegistrasiPasienFarmasiCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 50
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0
            $scope.rincianPelayanan = []
            $scope.user = medifirstService.getPegawaiLogin();
            loadCombo();
            function loadCombo() {
                var chacePeriode = cacheHelper.get('cacheDaftarRegisTtr');
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.item.noReg = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.item.noRm = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.nama = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.listDepartemen = [chacePeriode[5]]
                        $scope.item.instalasi = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.listRuangan = [chacePeriode[6]]
                        $scope.item.ruangan = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.listKelompokPasien = [chacePeriode[7]]
                        $scope.item.kelompokpasien = chacePeriode[7]
                    }

                    if (chacePeriode[9] != undefined) {
                        $scope.item.jmlRows = chacePeriode[9]
                    }

                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                })
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarRegistrasiPasienFarmasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien Farmasi",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        {
                            "field": "tglregistrasi",
                            "title": "Tgl Registrasi",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        },
                        {
                            "field": "noregistrasi",
                            "title": "NoReg",
                            "width": "80px"
                        },
                        {
                            "field": "nocm",
                            "title": "NoRM",
                            "width": "80px",
                            "template": "<span class='style-center'>#: nocm #</span>"
                        },
                        {
                            "field": "namapasien",
                            "title": "Nama Pasien",
                            "width": "150px",
                            "template": "<span class='style-left'>#: namapasien #</span>"
                        },
                        {
                            "field": "umur",
                            "title": "Umur",
                            "width": "150px",
                            "template": "<span class='style-left'>#: umur #</span>"
                        },
                        {
                            "field": "namaruangan",
                            "title": "Nama Ruangan",
                            "width": "150px",
                            "template": "<span class='style-left'>#: namaruangan #</span>"
                        },
                        // {
                        //     "field": "namadokter",
                        //     "title": "Nama Dokter",
                        //     "width": "150px",
                        //     "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                        // },
                        {
                            "field": "kelompokpasien",
                            "title": "Kelompok Pasien",
                            "width": "100px",
                            "template": "<span class='style-left'>#: kelompokpasien #</span>"
                        },
                        {
                            "field": "tglpulang",
                            "title": "Tgl Pulang",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                        },
                        {
                            "field": "statuspasien",
                            "title": "Stat Kunjungan",
                            "width": "100px",
                            "template": "<span class='style-center'>#: statuspasien #</span>"
                        },
                        {
                            "field": "tglmeninggal",
                            "title": "Stat Pasien",
                            "width": "100px",
                            "template": '# if( tglmeninggal==null) {# <span class="label label-primary text-center">Hidup</span> # } else {# <span class="label label-danger text-center">Meninggal</span> #} #'
                        },
                        // {
                        //     "field": "nostruk",
                        //     "title": "NoStrukVerif",
                        //     "width": "100px",
                        //     "template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
                        // },
                        // {
                        //     "field": "nosbm",
                        //     "title": "NoSBM",
                        //     "width": "100px",
                        //     "template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
                        // },
                        // {
                        //     "field": "kasir",
                        //     "title": "Kasir",
                        //     "width": "100px",
                        //     "template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
                        // },
                        // {
                        //     "field": "nosep",
                        //     "title": "No SEP",
                        //     "width": "150px",
                        //     "template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
                        // }
                        {
                            "command": [
                                {
                                    text: "Detail",
                                    click: getDetailPelayananResep,
                                    imageClass: "k-icon k-i-search"
                                }
                            ],
                            title: "",
                            width: "70px",
                        }
                    ]
            };

            $scope.TutupPopUp = function () {
                $scope.sourceRincians = [];
                $scope.popUpLayanan.close()
            }

            function getDetailPelayananResep(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                var dataSource = []
                medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + dataItem.noregistrasi, true).then(function (dat) {
                    $scope.popUpLayanan.center().open();
                    $scope.isRouteLoading = false;
                    $scope.dataPasienSelected = dataItem;
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
                    $scope.sourceRincians = dat.data;
                });
            }

            $scope.columnRincians = {
                sortable: true,
                // pageable: true,
                selectable: "row",
                columns: [
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
                ]
            }

            $scope.SearchData = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var reg = ""
                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                    tempNoReg = $scope.item.noReg

                }

                var rm = ""
                var tempNoRm = "";
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                    tempNoRm = $scope.item.noRm;
                }

                var nm = ""
                var tempNamaOrReg = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                    tempNamaOrReg = $scope.item.nama;
                }

                var ins = ""
                var tempInstalasiIdArr = {};
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                    tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }

                var rg = ""
                var tempRuanganIdArr = {};
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                    tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }

                var kp = ""
                var tempKelompokArr = {};
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                    tempKelompokArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompokpasien }
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                $q.all([
                    medifirstService.get("farmasi/get-data-registrasi-pasien-farmasi?" +
                        reg + rm + nm + ins + rg + kp
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (let i = 0; i < data[0].data.length; i++) {
                        const element = data[0].data[i];
                        element.no = i + 1
                        var tanggal = new Date(element.tglregistrasi);
                        var tanggalLahir = new Date(element.tgllahir);
                        var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                        element.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        pageSize: 10,
                        total: data[0].data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: tempNoReg,
                        3: tempNoRm,
                        4: tempNamaOrReg,
                        5: tempInstalasiIdArr,
                        6: tempRuanganIdArr,
                        7: tempKelompokArr,
                        // 8: tempDokterArr,
                        8: jmlRows
                    }
                    cacheHelper.set('cacheDaftarRegisTtr', chacePeriode);
                });

            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
                }
            }

            $scope.Detail = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var objSave = {
                        noregistrasi: $scope.dataPasienSelected.noregistrasi
                    }
                    medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (data) {

                    });
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    $state.go('RincianTagihan', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }

            $scope.DaftarRuangan = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noregistrasi
                    }

                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
                    $state.go('DetailRegistrasi', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
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

            $scope.klikRincian = function (dataSelectedRincian) {
                if (dataSelectedRincian != undefined) {
                    $scope.dataSelectedRincian = dataSelectedRincian;
                }
            }

            $scope.selectedData2 = [];
            $scope.onClick = function (e) {

                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid2").data("kendoGrid"),
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

            $scope.InputTindakanResep = function () {
                if ($scope.dataPasienSelected != undefined) {
                    medifirstService.get("farmasi/get-data-antrian-pasien?Noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
                        var dat = dat.data[0];
                        medifirstService.get("sysadmin/general/get-status-close/" + dat.noregistrasi, false).then(function (rese) {
                            if (rese.data.status == true) {
                                toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                                $scope.isSelesaiPeriksa = true
                            } else {
                                var arrStr = {
                                    0: $scope.dataPasienSelected.nocm,
                                    1: $scope.dataPasienSelected.namapasien,
                                    2: $scope.dataPasienSelected.jeniskelamin,
                                    3: $scope.dataPasienSelected.noregistrasi,
                                    4: $scope.dataPasienSelected.umur,
                                    5: dat.idkelas,
                                    6: dat.namakelas,
                                    7: $scope.dataPasienSelected.tglregistrasi,
                                    8: dat.norec_apd,
                                    9: '',
                                    10: $scope.dataPasienSelected.namapenjamin,
                                    11: $scope.dataPasienSelected.kelompokpasien,
                                    12: '',//$scope.item.beratBadan,
                                    13: '',//$scope.item.AlergiYa,
                                    14: '',
                                    15: { id: dat.objectpegawaifk, namalengkap: dat.namadokter }
                                }
                                cacheHelper.set('InputResepApotikCtrl', arrStr);
                                $state.go('InputResepApotik')
                            }
                        })
                    })
                } else {
                    toastr.error("Data Belum Dipilih!");
                    return;
                }
            }

            $scope.hapusResep = function () {
                if ($scope.dataSelectedRincian.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                    return;
                }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                if ($scope.dataSelectedRincian.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                    return;
                } else {
                    var stt = 'false'
                    if (confirm('Hapus resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    var objDelete = { norec: $scope.dataSelectedRincian.norec_resep }
                    medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                        LoadCache()
                    })
                    //##save Logging user
                    medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep="
                        + $scope.dataSelectedRincian.norec_resep

                    ).then(function (data) {
                        $scope.sourceRincians = [];
                        $scope.popUpLayanan.close()
                    })
                    //##end 
                }
                // });
            }

            $scope.ubahResep = function () {
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
                if ($scope.dataSelectedRincian.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa mengubah Obat!')
                    return;
                } else {
                    medifirstService.get("farmasi/get-data-antrian-pasien?Noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
                        $scope.sourceRincians = [];
                        $scope.popUpLayanan.close()
                        var dat = dat.data[0];
                        var arrStr = {
                            0: $scope.dataPasienSelected.nocm,
                            1: $scope.dataPasienSelected.namapasien,
                            2: $scope.dataPasienSelected.jeniskelamin,
                            3: $scope.dataPasienSelected.noregistrasi,
                            4: $scope.dataPasienSelected.umur,
                            5: dat.idkelas,
                            6: dat.namakelas,
                            7: $scope.dataPasienSelected.tglregistrasi,
                            8: dat.norec_apd,
                            9: 'EditResep',
                            10: $scope.dataPasienSelected.namapenjamin,
                            11: $scope.dataPasienSelected.kelompokpasien,
                            12: '',//$scope.item.beratBadan,
                            13: '',//$scope.item.AlergiYa,
                            14: $scope.dataSelectedRincian.norec_resep,
                            15: { id: dat.objectpegawaifk, namalengkap: dat.namadokter }
                        }
                        cacheHelper.set('InputResepApotikCtrl', arrStr);
                        $state.go('InputResepApotik')
                    });
                }
            }

            $scope.ReturResep = function () {
                // if ($scope.dataSelectedRincian.nostruk != undefined) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening.')
                //     return;
                // }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                // $scope.dataSelected.noregistrasi, true).then(function(dat){
                if ($scope.dataSelectedRincian.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa retur Obat!')
                    return;
                } else {
                    medifirstService.get("farmasi/get-data-antrian-pasien?Noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
                        $scope.sourceRincians = [];
                        $scope.popUpLayanan.close()
                        var dat = dat.data[0];
                        var arrStr = {
                            0: $scope.dataPasienSelected.nocm,
                            1: $scope.dataPasienSelected.namapasien,
                            2: $scope.dataPasienSelected.jeniskelamin,
                            3: $scope.dataPasienSelected.noregistrasi,
                            4: $scope.dataPasienSelected.umur,
                            5: dat.idkelas,
                            6: dat.namakelas,
                            7: $scope.dataPasienSelected.tglregistrasi,
                            8: dat.norec_apd,
                            9: 'EditResep',
                            10: $scope.dataPasienSelected.namapenjamin,
                            11: $scope.dataPasienSelected.kelompokpasien,
                            12: '',//$scope.item.beratBadan,
                            13: '',//$scope.item.AlergiYa,
                            14: $scope.dataSelectedRincian.norec_resep,
                            15: { id: dat.objectpegawaifk, namalengkap: dat.namadokter }
                        }
                        cacheHelper.set('InputResepApotikReturCtrl', arrStr);
                        $state.go('InputResepApotikRetur')
                    })
                }
            }

            $scope.CetakLabelIdentitas = function () {
                var stt = 'false'
                if (confirm('View Label Indentitas Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelIdentitasPasien=' + $scope.dataSelectedRincian.norec_resep + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) {
                    // aadc=response;
                });
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
                    var user = $scope.user.namaLengkap

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
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + $scope.dataSelectedRincian.norec_resep + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) {
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
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + $scope.dataSelectedRincian.norec_resep).then(function (dat) {
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
                                            }
                                        } else {
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelectedRincian.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=-' + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelectedRincian.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelectedRincian.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + $scope.dataSelectedRincian.norec_resep + '&Produkfk=' + Produkfk + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + $scope.dataSelectedRincian.norec_resep).then(function (dat) {
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
                                            }
                                        } else {
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=-' + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelectedRincian.norec_resep + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + $scope.user.namaLengkap, function (response) { });
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

            $scope.CetakResep = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelectedRincian == undefined) {
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
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelectedRincian.norec_resep + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    // aadc=response;
                });
            }

            $scope.CetakResep23 = function () {
                var user = medifirstService.getPegawaiLogin();
                if ($scope.dataSelectedRincian == undefined) {
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
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep-ok=1&nores=' + $scope.dataSelectedRincian.norec_resep + '&view=' + stt + '&user=' + user.namaLengkap, function (response) {
                    // aadc=response;
                });
            }

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

            $scope.detailRegistrasi = function () {
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    $scope.popupDetailRegistrasi.center().open();
                    $scope.dataPopUpAPD = [];
                    $scope.isRouteLoading = true;
                    medifirstService.get("farmasi/get-detail-reg-farmasi?" +
                        "noregistrasi=" + $scope.dataPasienSelected.noregistrasi
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                            }
                            $scope.dataPopUpAPD = dat.data;
                        })
                } else {
                    toastr.error("Data Belum Dipilih");
                    return;
                }
            }

            $scope.TambahObat = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     alert('Sudah verifikasi Tatarekening Tidak Bisa Menambah Obat!')
                //     return;
                // }
                debugger;
                // * Validasi Untuk Sekali Bayar
                //medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //$scope.dataSelected.noregistrasi, true).then(function(dat){                           
                // if (dat.data.status == true) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                //     return;
                // }else{
                medifirstService.get("farmasi/get-data-antrian-pasien?Noregistrasi=" + $scope.dataPasienSelected.noregistrasi, true).then(function (dat) {
                    var dat = dat.data[0];
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
                                    0: $scope.dataPasienSelected.nocm,
                                    1: $scope.dataPasienSelected.namapasien,
                                    2: $scope.dataPasienSelected.jeniskelamin,
                                    3: $scope.dataPasienSelected.noregistrasi,
                                    4: $scope.dataPasienSelected.umur,
                                    5: dat.idkelas,
                                    6: dat.namakelas,
                                    7: $scope.dataPasienSelected.tglregistrasi,
                                    8: dat.norec_apd,
                                    9: '',
                                    10: $scope.dataPasienSelected.namapenjamin,
                                    11: $scope.dataPasienSelected.kelompokpasien,
                                    12: '',//$scope.item.beratBadan,
                                    13: '',//$scope.item.AlergiYa,
                                    14: '',
                                    15: { id: dat.objectpegawaifk, namalengkap: dat.namadokter }
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
                                    0: $scope.dataPasienSelected.nocm,
                                    1: $scope.dataPasienSelected.namapasien,
                                    2: $scope.dataPasienSelected.jeniskelamin,
                                    3: $scope.dataPasienSelected.noregistrasi,
                                    4: $scope.dataPasienSelected.umur,
                                    5: dat.idkelas,
                                    6: dat.namakelas,
                                    7: $scope.dataPasienSelected.tglregistrasi,
                                    8: dat.norec_apd,
                                    9: '',
                                    10: $scope.dataPasienSelected.namapenjamin,
                                    11: $scope.dataPasienSelected.kelompokpasien,
                                    12: '',//$scope.item.beratBadan,
                                    13: '',//$scope.item.AlergiYa,
                                    14: '',
                                    15: { id: dat.objectpegawaifk, namalengkap: dat.namadokter }
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
                });
            }

            //** BATAS SUCI */
        }
    ]);
});