define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PemberianObatCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$parse',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $parse) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglOperasi = new Date();
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var norec_Emr = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            $scope.header.DataNoregis = '';
            var myVar = 0
            var detail = ''
            var datana = [];
            var data2 = [];
            var data_head = [];
            var data_Save = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            $scope.SistoleChart = false;
            $scope.NonSistoleChart = false;
            FormLoad()


            function FormLoad() {
                $scope.isRouteLoading = false;
                LoadCacheHelper()
                medifirstService.get("emr/get-data-combo-emr", true).then(function (dat) {
                    var dataCombo = dat.data.vitalsigns
                    for (var i = 0; i < dataCombo.length; i++) {
                        if (dataCombo[i].id == 1) {
                            dataCombo[i].simbol = "⮟";
                        } else if (dataCombo[i].id == 2) {
                            dataCombo[i].simbol = "⮝";
                        } else if (dataCombo[i].id == 3) {
                            dataCombo[i].simbol = "●";
                        } else if (dataCombo[i].id == 4) {
                            dataCombo[i].simbol = "▲";
                        }
                    }
                    $scope.listVitalSigns = dataCombo;
                });

                medifirstService.get("emr/get-data-keterangan-pengkajianicu", true).then(function (dat) {
                    var data_gcs = dat.data.gcs;
                    var data_infus = dat.data.infus;
                    var data_jenisvent = dat.data.jenisvent;
                    for (var i = 0; i < data_gcs.length; i++) {
                        data_gcs[i].no = i + 1
                    }
                    for (var i = 0; i < data_jenisvent.length; i++) {
                        data_jenisvent[i].no = i + 1
                    }
                    for (var i = 0; i < data_jenisvent.length; i++) {
                        data_jenisvent[i].no = i + 1
                    }

                    $scope.GridPasien = new kendo.data.DataSource({
                        data: data_gcs,
                        group: $scope.groups,
                        pageSize: 15,
                        total: data_gcs.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    $scope.dataInfus = new kendo.data.DataSource({
                        data: data_infus,
                        pageSize: 50,
                        total: data_infus.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    $scope.dataJenisVent = new kendo.data.DataSource({
                        data: data_jenisvent,
                        pageSize: 50,
                        total: data_jenisvent.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });
            }

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    // if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                    //     $scope.showTombol = true
                    // }
                    //  medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                    //     $scope.item.noregistrasi, true).then(function (dat) {
                    //         $scope.item.statusVerif = dat.data.status
                    //     });
                    medifirstService.get("farmasi/get-daftar-resep?noregistrasi="+$scope.item.noregistrasi, true).then(function (dat) {
                        let Data = dat.data.daftar;
                        for (var i = Data.length - 1; i >= 0; i--) {
                            Data[i].no = i+1
                        }
                        $scope.dataDaftar = new kendo.data.DataSource({
                            data: Data,
                            total: Data,
                        });
                    });
                    // medifirstService.get("emr/get-data-riwayat-emr-icu?NoRegistrasi=" + norec_pd, true).then(function (dat) {
                    //     var dataRiwayat = dat.data.data_riwayat
                    //     $scope.isRouteLoading = false;
                    //     for (var i = 0; i < dataRiwayat.length; i++) {
                    //         dataRiwayat[i].no = i + 1
                    //     }
                    //     $scope.dataDaftar = new kendo.data.DataSource({
                    //         data: dataRiwayat,
                    //         total: dataRiwayat,
                    //     });
                    // });
                }
                // init()
            }
            $scope.back = function(){
                $scope.myVar = 1
                $scope.visible =false
            }
            $scope.visible =false
            $scope.create = function () {
                $scope.visible =true
                $scope.myVar = 2
                GridColumnLoad();
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    toastr.info('Data Terpilih');
                    $scope.dataSelected  = dataSelected
                }
            }

            $scope.Lihat = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.warning('Pilih Data Yang Akan Dilihat, Peringatan!')
                    return;
                }
                $scope.visible = true
                norec_Emr = $scope.dataSelected.norec;
                GridColumnLoad();
                medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                    let datatata = dat.data
                    for (var i = datatata.length - 1; i >= 0; i--) {
                        datatata[i].group = '. ORAL/TOPIKAL/SUPP/INHALASI'
                    }
                    datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : ".. IV/IM/SC/IVFD"
                                })

                    datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : "... HIGH ALERT"
                                })
                   datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "Nama Perawat I",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : ".... Keterangan"
                                })
                   datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "Nama Perawat II",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : ".... Keterangan"
                                })
                   datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "RAPID TEST",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : ".... Keterangan"
                                })
                   datatata.push({
                                    "nocm": "000010",
                                    "namapasien": "SYAHRUL MAHFUD",
                                    "jeniskelamin": "LAKI-LAKI",
                                    "tglpelayanan": "2020-07-27 15:08:47",
                                    "produkfk": 4041580,
                                    "namaproduk": "HASIL PCR",
                                    "satuanstandar": "TABLET",
                                    "jumlah": 10,
                                    "hargasatuan": "1495",
                                    "hargadiscount": "0",
                                    "nostruk": null,
                                    "noregistrasi": "2007000006",
                                    "noresep": "O/2007/00003",
                                    "rke": "3",
                                    "jeniskemasan": "Non Racikan",
                                    "norec_resep": "a4a2c9a0-cfe0-11ea-8da4-9bdb2946",
                                    "detail": {
                                        "userData": {
                                            "namauser": "admin.perawat",
                                            "id": 30027
                                        },
                                        "noReg": "2007000006"
                                    },
                                    "jasa": "0",
                                    "depoid": 59,
                                    "namaruangandepo": "GD. Farmasi ",
                                    "aturanpakai": "3x1",
                                    "dokter": "dr. Abdurrahman  Amma, M.Kes, Sp.KJ",
                                    "namaruangan": "ARJUNA",
                                    "kekuatan": "5 MG",
                                    "ispagi": true,
                                    "issiang": true,
                                    "ismalam": true,
                                    "issore": false,
                                    "group" : ".... Keterangan"
                                })
                    $scope.data1 = new kendo.data.DataSource({
                        data: dat.data,
                        total: dat.data,
                        group: { field: "group" },
                        schema: {
                            model: {
                            }
                        }
                    });
                });
                // init()
                
                // medifirstService.get("emr/get-data-detail-emr-icu?NorecRmi=" + norec_Emr, true).then(function (dat) {
                //     var Data = dat.data.Details;
                //     var Datas = $scope.data1._data
                //     for (var i = 0; i < Datas.length; i++) {
                //         for (var j = 0; j < Data.length; j++) {
                //             if (Data[j].group == Datas[i].group) {
                //                 // if (Data[j].column == Datas[i].desc) {
                //                 for (var k = 0; k < Object.keys(Datas[i]).length; k++) {
                //                     var Tutu = Object.keys(Datas[i])[k]
                //                     if (Data[j].column == Datas[i].desc && Data[j].field == Tutu) {
                //                         Datas[i][Tutu] = Data[j].nilaiobservasi
                //                         $scope.myVar = 2
                //                     }
                //                 }
                //                 // }
                //             }
                //         }
                //     }
                // });
            }


            $scope.columnDaftar = {
                // toolbar: [{
                //     name: "create", text: "Input Baru",
                //     template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Konsul</button>'
                // },],
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 40 },
                    { field: "tglresep", title: "Tanggal", width: 120 },
                    { field: "noresep", title: "No Resep", width: 120 },
                    { field: "namaruangan", title: "Ruangan", width: 120 },
                    { field: "dokter", title: "Dokter", width: 120 },
                    // { field: "", title: "Keterangan", width: 120 },
                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }, { name: "edit", text: "Edit", click: editData }], title: "&nbsp;", width: 120 }
                ],
            };

            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            //  LoadCache();
            //  function LoadCache(){
            //      var chacePeriode = cacheHelper.get('TransaksiPelayananLaboratoriumDokterCtrl');
            //      if(chacePeriode != undefined){
            //          norec_apd = chacePeriode[0]
            //          nocm_str = chacePeriode[1]
            //          // $scope.item.ruanganAsal = namaRuangan;
            //          // manageSarprasPhp.getDataTableTransaksi("logistik/get_detailPD?norec_apd="+norec_apd, true).then(function(data_ih){
            //          //     $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
            //          //     $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
            //          //     $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
            //          // });
            //          init()
            //     }else{

            //     }

            // }

            $scope.groups = {
                field: "reportdisplay",
                aggregates: [
                    {
                        field: "reportdisplay",
                        aggregate: "count"
                    }]
            };

            $scope.aggregate = [
                {
                    field: "reportdisplay",
                    aggregate: "count"
                }
            ]

            $scope.ColumnPasien = {
                sortable: true,
                selectable: "row",
                columns: [
                    {
                        "field": "namagcs",
                        "title": "GCS",
                        "width": "150px",
                    },
                    {
                        hidden: true,
                        field: "reportdisplay",
                        title: "Head",
                        // aggregates: ["count"],
                        // groupHeaderTemplate: "Head #= value # (Jumlah: #= count#)"
                    }
                ]
            }

            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            $scope.ColumnInfus = {
                sortable: true,
                selectable: "row",
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "45px",
                    // },
                    {
                        "field": "namainfus",
                        "title": "Nama Infus",
                        "width": "180px"
                    }
                ]
            }

            $scope.ColumnJenisVent = {
                sortable: true,
                selectable: "row",
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "45px",
                    // },
                    {
                        "field": "namajenisvent",
                        "title": "Jenis Vent",
                        "width": "80px"
                    }
                ]
            }

            function init() {
               

                // GridColumnLoad();
                
            }

            function GridColumnLoad() {
                $scope.group = {
                    field: "group"
                };

                $scope.columnData1 = {

                    selectable: 'cell',
                    pageable: true,
                    // dataBound: $scope.onDataBound,
                    columns: [
                        {
                            "hidden": true,
                            "field": "group",
                            "title": ".",
                            "width": "300px"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Obat",
                            "width": "300px"
                        },
                        {
                            "field": "rute",
                            "title": "Rute",
                            "width": "50px"
                        },
                        {
                            "field": "dosis",
                            "title": "Dosis",
                            "width": "80px"
                        },
                        {
                            "field": "lamapemberian",
                            "title": "Lama Pemberian",
                            "width": "80px"
                        },
                        {
                            "field": "iddokter",
                            "title": "Id Dokter",
                            "width": "100px"
                        },
                        {
                            "field": "tgl1",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl2",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl3",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl4",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl5",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl6",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl7",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl8",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl9",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl10",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                        {
                            "field": "tgl11",
                            "title": "Tgl/Jam",
                            "width": "100px"
                        },
                    ]
                };
            }

            $scope.onDataBound = function (e) {
                var grid = $("#kGrid").data("kendoGrid");
                $(grid.tbody).on("click", "td", function (e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 1) {
                        var colDateIdx = colIdx - 1;
                        var columns = grid.options.columns[colDateIdx].title;
                        var field = grid.options.columns[colDateIdx].field;
                        var datas = {
                            judulatas: columns,
                            judulsamping: $scope.selectedData.desc,
                            group: $scope.selectedData.group,
                            field: field
                        };
                        data_head.push(datas);

                        if ($scope.selectedData.group == "1. VITAL SIGNS") {
                            $scope.vitalSigns = true;
                        } else {
                            $scope.vitalSigns = false;
                        }
                        $scope.showDetail(data_head, $scope.selectedData);
                    }
                });
            }

            $scope.showDetail = function (data_head, selectedData) {
                // debugger;
                if (data_head.length > 0) {

                    $scope.item.GroupHeader = data_head[0].group;
                    $scope.item.Deskripsi = data_head[0].judulsamping;
                    $scope.item.JamInput = data_head[0].judulatas;
                    for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                        for (var j = 0; j < data_head.length; j++) {
                            if (data_head[0].group == "1. VITAL SIGNS") {
                                $scope.SistoleChart = true;
                                $scope.NonSistoleChart = false;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        var isi = $scope.selectedData[Object.keys($scope.selectedData)[i]].split(" ");
                                        // var isiCombo = isi[1].split(" ");
                                        medifirstService.get("emr/get-data-riwayat-emr-icu-detail?NoRegistrasi=" + norec_pd, true).then(function (dat) {
                                            var datas = dat.data.data_riwayat;
                                            for (var i = 0; i < datas.length; i++) {
                                                if (datas[i].objectvitalsigns != undefined || datas[i].objectvitalsigns != null) {
                                                    if (datas[i].objectvitalsigns == 1) {
                                                        datas[i].simbol = "⮟";
                                                    } else if (datas[i].objectvitalsigns == 2) {
                                                        datas[i].simbol = "⮝";
                                                    } else if (datas[i].objectvitalsigns == 3) {
                                                        datas[i].simbol = "●";
                                                    } else if (datas[i].objectvitalsigns == 4) {
                                                        datas[i].simbol = "▲";
                                                    }
                                                    $scope.item.VSigns = { id: datas[i].objectvitalsigns, vitalsigns: datas[i].vitalsigns, simbol: datas[i].simbol }
                                                }
                                            }
                                            $scope.item.Isian = isi[1]
                                        });
                                    }
                                }
                            } else {
                                $scope.SistoleChart = false;
                                $scope.NonSistoleChart = true;
                                if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                    if ($scope.selectedData[Object.keys($scope.selectedData)[i]] != "") {
                                        $scope.item.Isian = $scope.selectedData[Object.keys($scope.selectedData)[i]]
                                    }
                                }
                            }
                        }
                    }
                    $scope.PopUpDetailPeserta.center().open();
                } else {
                    $scope.PopUpDetailPeserta.center().open();
                }

            }

            $scope.tambah = function () {
                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                if (data_head[0].group == "1. VITAL SIGNS" && $scope.item.VSigns == undefined) {
                    toastr.warning('Vital Signs harus diisi, Peringatan!')
                    return;
                }

                var vital = null;
                if ($scope.item.VSigns != undefined) {
                    vital = $scope.item.VSigns.id
                }

                for (var i = 0; i < Object.keys($scope.selectedData).length; i++) {
                    for (var j = 0; j < data_head.length; j++) {
                        if (data_head[0].group == "1. VITAL SIGNS") {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.VSigns.simbol + " " + $scope.item.Isian
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital
                                }
                                data_Save.push(datas);
                            }
                        } else {
                            if (data_head[j].field == Object.keys($scope.selectedData)[i]) {
                                $scope.selectedData[Object.keys($scope.selectedData)[i]] = $scope.item.Isian
                                var datas = {
                                    column: data_head[0].judulatas,
                                    desc: data_head[0].judulsamping,
                                    group: data_head[0].group,
                                    field: data_head[0].field,
                                    keteranganobservasi: $scope.selectedData[Object.keys($scope.selectedData)[i]],
                                    vitalsigns: vital
                                }
                                data_Save.push(datas);
                            }
                        }
                    }
                }
                kosongkeun()
                $scope.PopUpDetailPeserta.close();
            }

            $scope.batal = function () {
                kosongkeun()
                $scope.PopUpDetailPeserta.close();
            }

            function kosongkeun() {
                $scope.selectedData = undefined;
                data_head = [];
                $scope.item.Isian = undefined;
                $scope.item.VSigns = undefined;
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.simpanERM = function () {
                debugger;
                if (data_Save.length == 0) {
                    toastr.warning('Data Belum Terambil, Peringatan!')
                    return;
                }

                var objSave = {
                    norec: norec_Emr,
                    norec_apd: norec_apd,
                    tglinput: moment($scope.now).format('YYYY-MM-DD hh:mm'),
                    details: data_Save//$scope.data1._data
                }
                console.log(objSave);
                medifirstService.post('emr/save-data-emr-icu', objSave).then(function (e) {
                    // init();
                    // $scope.BatalOrder();
                    // managePhp.postLogging('Simpan EMR ICU', 'Norec strukorder_t',e.data.strukorder.norec, 'Menu Dokter').then(function (res) {
                    // })
                    LoadCacheHelper();
                    $scope.myVar = 1;
                })
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            // $scope.cetakResep = function(){
            //     if ($scope.dataSelected == undefined) {
            //         alert('Pilih resep yg akan di cetak')
            //         return;
            //     }
            //     var stt = 'false'
            //     if (confirm('View resep? ')) {
            //         // Save it!
            //         stt='true';
            //     } else {
            //         // Do nothing!
            //         stt='false'
            //     }
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores='+$scope.dataSelected.norec_resep+'&view='+stt+'&user='+$scope.dataSelected.detail.userData.namauser, function(response) {
            //         // aadc=response;
            //     });
            // }
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
            // $scope.back=function(){
            //     $state.go('DaftarAntrianDokterRajal')
            // }

            // $scope.showInputDiagnosaDokter=function(){
            //     var arrStr =cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
            //     cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
            //     $state.go('InputDiagnosaDokter')
            // }
            // $scope.resep = function() {
            //     var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
            //     cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
            //     $state.go('InputResepApotikOrderRev')
            // }
            // $scope.inputTindakanDokter = function() {
            //     var arrStr =cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
            //     cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
            //      $state.go('InputTindakanPelayananDokterRev',{
            //             norecPD:norec_pd,
            //             norecAPD: norec_apd,

            //         });
            // }
            // $scope.laboratorium = function() {
            //     var arrStr =cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
            //     cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
            //     $state.go('TransaksiPelayananLaboratoriumDokterRev')
            // }
            // $scope.radiologi = function() {
            //     var arrStr =cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl')
            //     cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
            //     $state.go('TransaksiPelayananRadiologiDokterRev')
            // }
            // $scope.rekamMedisElektronik=function(){
            //     var arrStr =cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
            //     cacheHelper.set('cacheRMelektronik', arrStr);
            //     $state.go('RekamMedisElektronik')
            // }
            // $scope.inputCPPT = function () {
            //     var arrStr = cacheHelper.get('TransaksiPelayananLaboratoriumDokterRevCtrl');
            //     cacheHelper.set('cacheCPPT', arrStr);
            //     $state.go('CPPT')
            // }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1
