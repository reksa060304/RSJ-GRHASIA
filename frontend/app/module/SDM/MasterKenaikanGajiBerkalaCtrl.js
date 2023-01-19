define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterKenaikanGajiBerkalaCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, dateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = moment(new Date()).format('YYYY-MM-DD');
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.kategory = []
            $scope.item.jenis = []
            $scope.item.status = []
            FormLoad();
            LoadData();

            function FormLoad() {

                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                var tanggals = dateHelper.getDateTimeFormatted3($scope.date);

                //Tanggal Default
                $scope.item.tglawal = tanggals + " 00:00";
                $scope.item.tglakhir = tanggals + " 23:59";

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawai();

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listStatus = dataCombo.statuspegawai;
                    $scope.listJenisPegawai = dataCombo.jenispegawai;
                    $scope.listKategory = dataCombo.golonganpegawai;
                    $scope.ListGolonganPegawai = dataCombo.golonganpegawai
                    $scope.selectOptionsKategory = {
                        placeholder: "Pilih Golongan Pegawai...",
                        dataTextField: "golongan",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: true,

                    };
                    $scope.selectOptionsJenis = {
                        placeholder: "Pilih Jenis Pegawai...",
                        dataTextField: "jenispegawai",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: true,

                    };

                    $scope.selectOptionsStatus = {
                        placeholder: "Pilih Kedudukan Pegawai...",
                        dataTextField: "statuspegawai",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: true,

                    };
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData();
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                //debugger;

                var kateg = "";

                if ($scope.item.kategory.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kategory.length - 1; i >= 0; i--) {
                        var c = $scope.item.kategory[i].id
                        b = "," + c
                        a = a + b
                    }
                    kateg = "jenisKategId=" + a.slice(1, a.length)
                }
                var jenis = "";
                if ($scope.item.jenis.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.jenis.length - 1; i >= 0; i--) {
                        var c = $scope.item.jenis[i].id
                        b = "," + c
                        a = a + b
                    }
                    jenis = "&jenisPegId=" + a.slice(1, a.length)
                }

                var status = "";
                if ($scope.item.status.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.status.length - 1; i >= 0; i--) {
                        var c = $scope.item.status[i].id
                        b = "," + c
                        a = a + b
                    }
                    status = "&statusPegId=" + a.slice(1, a.length)
                }



                medifirstService.get("sdm/master-kenaikan-gajiberkala").then(function (data) {
                    $scope.isLoadingData = false;
                    var datas = data.data.data
                    // if ($scope.item.kategoryLap != undefined) {
                    //     for (let i = datas.length - 1; i >= 0; i--) {
                    //         const element = datas[i];
                    //         if ($scope.item.kategoryLap.nama != element.kategory)
                    //             datas.splice(i, 1)
                    //     }
                    // }
                    var bulan = 0
                    var tahun = 0
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        
                    }
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        group: $scope.group,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    // tipe: {
                                    //     type: "string"
                                    // },
                                    // kategory: {
                                    //     type: "string"
                                    // },
                                    // total: {
                                    //     type: "number"
                                    // },

                                }
                            }
                        },
                        selectable: true,
                        refresh: true,
                        // groupable:true,
                        // group: [{
                        //     field: "kategory",
                        //     aggregates: [{
                        //             field: 'total',
                        //             aggregate: 'sum'
                        //         },
                        //         // { field: "jumlah", aggregate: 'sum' },
                        //         // { field: 'harga', aggregate: 'sum' },
                        //     ]
                        // }, ],
                        // aggregate: [{
                        //         field: 'total',
                        //         aggregate: 'sum'
                        //     },

                        // ]

                    });


                })
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }
            // $scope.group = {
            //     field: "kategory",
            //     aggregates: [

            //         {
            //             field: "kategory",
            //             aggregate: "count"
            //         }]
            // };
            // $scope.aggregate = [

            //     {
            //         field: "kategory",
            //         aggregate: "count"
            //     }]
            // $scope.listKatLaporan = [{
            //     nama: 'Jenis Kelamin'
            // }, {
            //     nama: 'Jenis Kepegawaian'
            // }, {
            //     nama: 'Agama'
            // }, {
            //     nama: 'Pendidikan'
            // }, {
            //     nama: 'Jenis Usia'
            // }]
            $scope.columnLaporan = {
                toolbar: [{
                    name: "create",
                    text: "Buat Riwayat Pangkat dan Golongan",
                    template: '<button ng-click="create()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Master Kenaikan Gaji Berkala</button>'
                }, 'excel'],
                excel: {
                    fileName: "LaporanDaftarPegawaiNominatif.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:Q1"];
                    sheet.name = "Master Data Kenaikan Gaji Berkala";

                    var myHeaders = [{
                        value: "Master Data Kenaikan Gaji Berkala",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                scrollable: true,
                pageable: true,
                resizable: true,
                columns: [

                    {
                        "field": "no",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        "field": "golongan",
                        "title": "PANGKAT & GOLONGAN",
                        "width": "70px",
                    },
                    {
                        "field": "mkg",
                        "title": "MASA KERJA GOLONGAN",
                        "width": "30px",
                    },
                    {
                        "field": "gajipokok",
                        "title": "GAJI POKOK",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: gajipokok #', '')}}</span>"

                    },

                    // {
                    //     width: '10%',
                    //     hidden: true,
                    //     field: "kategory",
                    //     title: "Kategory",
                    //     aggregates: ["count"],
                    //     // groupHeaderTemplate: " #= value # (Jumlah: #= count#)"
                    // },

                ]
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.create = function(){
                $scope.popUpCreate.center().open()
            }
            $scope.tambahMKG = function(){
                var data = {
                    id: "",
                    golonganfk: $scope.item.golongan.id,
                    mkg: $scope.item.mkg,
                    gajipokok: $scope.item.gajipokok
                }
                var objSave = {
                    data: data
                }
                medifirstService.post('sdm/save-master-kenaikan-gaji', objSave).then(function(){
                    $scope.item.gajicopy = $scope.item.gajipokok
                    $scope.item.mkg = parseInt($scope.item.mkg)+ 1
                    $scope.item.gajipokok = undefined
                    document.querySelector("#txtData2").focus();

                })
            }
            $scope.pindah = function(){
                $scope.item.gajipokok = $scope.item.gajicopy
                $scope.item.gajicopy = undefined
                // $scope.item.gajipokok.focus()
                document.querySelector("#txtData").focus();
            }
            $scope.pindah2 = function () {
                $scope.item.gajipokok = $scope.item.gajicopy

                document.querySelector("#txtData").focus();
            }
            ///////////////////////////////////////////////////////////////////////
        }
    ]);
});