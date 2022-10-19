define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPasienDPJPCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                $scope.listInstalasi = [{
                    id: 1,
                    nama: "Instalasi Rawat Jalan"
                }, {
                    id: 2,
                    nama: "Instalasi Rawat Inap"
                }]
                 medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganrajal;
                    })

                    medifirstService.get("registrasi/get-data-combo-new", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listJenisPelayanan = data.data.jenispelayanan;
            })
                    
            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }
            function LoadData() {
                
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }

                var tempJenPelId = "";
                if ($scope.item.jenisPelayanan != undefined) {
                    tempJenPelId = "&jenisPelayanan=" + $scope.item.jenisPelayanan.id;
                }
                var instalasi = '';
                if ($scope.item.instalasi != undefined){
                    instalasi = "&instalasi=" + $scope.item.instalasi.id
                }
                
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-lap-pasien-dpjp?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir + instalasi).then(function (data) {
                        var data =data.data
                        var group =  []
                        var podo = false
                        $scope.dataSourceGridKranap ={
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: 
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {   
                                        dokter: { type: "string" },
                                        bima: { type: "number" },
                                        gatotkaca: { type: "number" },
                                        sadewa: { type: "number" },
                                        srikandi: { type: "number" },
                                        drupadi: { type: "number" },
                                        sembodro: { type: "number" },
                                        abimanyu: { type: "number" },
                                        kresna: { type: "number" },
                                        arjuna: { type: "number" },
                                        arimbi: { type: "number" },
                                        nakula: { type: "number" },
                                        yudistira: { type: "number" },
                                        total: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                            // group: [
                            //     {
                            //         field: "namaruangan", aggregates: [
                            //             { field: 'laki', aggregate: 'sum' },
                            //             { field: "wanita", aggregate: 'sum' },
                            //             { field: "baru", aggregate: 'sum' },
                            //             { field: "lama", aggregate: 'sum' },
                            //             { field: "tunai", aggregate: 'sum' },
                            //             { field: "bpjs", aggregate: 'sum' },
                            //             { field: "jamsostek", aggregate: 'sum' },
                            //             { field: "swasta", aggregate: 'sum' },
                            //             { field: "hardient", aggregate: 'sum' },
                            //             { field: "iks", aggregate: 'sum' },
                            //             { field: "thamrin", aggregate: 'sum' },
                            //             { field: "jamkesda", aggregate: 'sum' },
                            //             { field: "jamkesmas", aggregate: 'sum' },
                            //             { field: "skmm", aggregate: 'sum' },
                            //             { field: "karyawan", aggregate: 'sum' },
                            //         ]
                            //     },
                            // ],
                            // aggregate: [
                            //     { field: 'laki', aggregate: 'sum' },
                            //            { field: "wanita", aggregate: 'sum' },
                            //             { field: "baru", aggregate: 'sum' },
                            //             { field: "lama", aggregate: 'sum' },
                            //             { field: "tunai", aggregate: 'sum' },
                            //             { field: "bpjs", aggregate: 'sum' },
                            //             { field: "jamsostek", aggregate: 'sum' },
                            //             { field: "swasta", aggregate: 'sum' },
                            //             { field: "hardient", aggregate: 'sum' },
                            //             { field: "iks", aggregate: 'sum' },
                            //             { field: "thamrin", aggregate: 'sum' },
                            //             { field: "jamkesda", aggregate: 'sum' },
                            //             { field: "jamkesmas", aggregate: 'sum' },
                            //             { field: "skmm", aggregate: 'sum' },
                            //             { field: "karyawan", aggregate: 'sum' },
                            // ]


                        }
                        $scope.dataSourceGridKrajal ={
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: 
                            
                            {
                                model: {
                                    fields: {   
                                        dokter: { type: "string" },
                                        akupuntur: { type: "number" },
                                        ekg: { type: "number" },
                                        fisio: { type: "number" },
                                        gigi: { type: "number" },
                                        keswa: { type: "number" },
                                        kirbebas: { type: "number" },
                                        kirjasmani: { type: "number" },
                                        klinikkeperawatanjiwa: { type: "number" },
                                        konsulpsikologi: { type: "number" },
                                        napza: { type: "number" },
                                        ot: { type: "number" },
                                        penyakitdalam: { type: "number" },
                                        polijiwa: { type: "number" },
                                        poliumum: { type: "number" },
                                        spesialisanak: { type: "number" },
                                        spesialissaraf: { type: "number" },
                                        tw: { type: "number" },
                                        usg: { type: "number" },
                                        vct: { type: "number" },
                                        total: { type: "number" },
                                        
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                        }
                        if ($scope.item.instalasi.id == 1) {
                            $scope.rajal = true;
                            $scope.ranap = false;

                            for (var i = 0; i < data.length; i++) {
                                var element1 = data[i]
                                podo = false
                                if (podo == false) {
                                    var datass = {
                                        akupuntur: element1.akupuntur,
                                        dokter: element1.dokter,
                                        ekg: element1.ekg,
                                        fisio: element1.fisio,
                                        gigi: element1.gigi,
                                        keswa: element1.keswa,
                                        kirbebas: element1.kirbebas,
                                        kirjasmani: element1.kirjasmani,
                                        klinikkeperawatanjiwa: element1.klinikkeperawatanjiwa,
                                        konsulpsikologi: element1.konsulpsikologi,
                                        napza: element1.napza,
                                        ot: element1.ot,
                                        penyakitdalam: element1.penyakitdalam,
                                        polijiwa: element1.polijiwa,
                                        poliumum: element1.poliumum,
                                        spesialisanak: element1.spesialisanak,
                                        spesialissaraf: element1.spesialissaraf,
                                        total: element1.total,
                                        tw: element1.tw,
                                        usg: element1.usg,
                                        vct: element1.vct,
                                    }
                                    group.push(datass)
                                }

                            }
                            $scope.columnGridKrajal = {
                                toolbar: ["excel"],
                                // , "pdf"],

                                excel: {
                                    fileName: "Laporan Pasien DPJP.xlsx",
                                    allPages: true,

                                },

                                dataSource: $scope.dataExcel,
                                sortable: true,
                                pageable: true,
                                resizable: true,
                                excelExport: function (e) {
                                    var rows = e.workbook.sheets[0].rows;
                                    rows.unshift({
                                        cells: [{
                                            value: "Laporan Pasien DPJP",
                                            background: "#fffff"
                                        }]
                                    });
                                },
                                columns: [

                                    {
                                        "field": "dokter",
                                        "title": "Dokter",
                                        "width": "200px",
                                    },
                                    {
                                        "field": "akupuntur",
                                        "title": "AKUPUNTUR",
                                        "width": "82px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "ekg",
                                        "title": "EKG",
                                        "width": "85px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "fisio",
                                        "title": "FISIOTHERAPY",
                                        "width": "63px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "gigi",
                                        "title": "POLIKLINIK GIGI",
                                        "width": "49px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "keswa",
                                        "title": "KIR KESWA",
                                        "width": "87px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "kirbebas",
                                        "title": "KIR BEBAS NARKOBA",
                                        "width": "127px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "kirjasmani",
                                        "title": "KIR FISIK / JASMANI",
                                        "width": "150px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "klinikkeperawatanjiwa",
                                        "title": "KLINIK KEPERAWATAN JIWA",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "konsulpsikologi",
                                        "title": "KONSULTASI PSIKOLOGI",
                                        "width": "120px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "napza",
                                        "title": "NAPZA",
                                        "width": "150px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "ot",
                                        "title": "OKUPASI TERAPI",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "penyakitdalam",
                                        "title": "SPESIALIS PENYAKIT DALAM",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "polijiwa",
                                        "title": "POLIKLINIK JIWA",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "poliumum",
                                        "title": "POLIKLINIK UMUM",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "spesialisanak",
                                        "title": "SPESIALIS ANAK",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "spesialissaraf",
                                        "title": "SPESIALIS SARAF",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "tw",
                                        "title": "TERAPI WICARA",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "usg",
                                        "title": "USG",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "vct",
                                        "title": "VCT (Voluntari Conseling & Testing)",
                                        "width": "100px",
                                    },
                                    {
                                        "field": "total",
                                        "title": "Total",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },

                                ]
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                var element1 = data[i]
                                podo = false
                                if (podo == false) {
                                    var datass = {
                                        bima: element1.bima,
                                        gatotkaca: element1.gatotkaca,
                                        sadewa: element1.sadewa,
                                        srikandi: element1.srikandi,
                                        drupadi: element1.drupadi,
                                        sembodro: element1.sembodro,
                                        abimanyu: element1.abimanyu,
                                        kresna: element1.kresna,
                                        arjuna: element1.arjuna,
                                        arimbi: element1.arimbi,
                                        nakula: element1.nakula,
                                        yudistira: element1.yudistira,
                                        dokter: element1.dokter,
                                        total: element1.total,
                                    }
                                    group.push(datass)
                                }

                            }
                                $scope.rajal = false
                                $scope.ranap = true
                            $scope.columnGridKranap = {
                                toolbar: ["excel"],
                                // , "pdf"],

                                excel: {
                                    fileName: "Laporan Pasien DPJP.xlsx",
                                    allPages: true,

                                },

                                dataSource: $scope.dataExcel,
                                sortable: true,
                                pageable: true,
                                resizable: true,
                                excelExport: function (e) {
                                    var rows = e.workbook.sheets[0].rows;
                                    rows.unshift({
                                        cells: [{
                                            value: "Laporan Pasien DPJP",
                                            background: "#fffff"
                                        }]
                                    });
                                },
                                columns: [

                                    {
                                        "field": "dokter",
                                        "title": "Dokter",
                                        "width": "200px",
                                    },
                                    {
                                        "field": "bima",
                                        "title": "BIMA",
                                        "width": "82px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "gatotkaca",
                                        "title": "GATOTKACA",
                                        "width": "85px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "sadewa",
                                        "title": "SADEWA",
                                        "width": "63px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "srikandi",
                                        "title": "SRIKANDI",
                                        "width": "49px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "drupadi",
                                        "title": "DRUPADI",
                                        "width": "87px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "sembodro",
                                        "title": "SEMBODRO",
                                        "width": "127px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "abimanyu",
                                        "title": "ABIMANYU",
                                        "width": "150px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "kresna",
                                        "title": "KRESNA",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "arjuna",
                                        "title": "ARJUNA",
                                        "width": "120px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "arimbi",
                                        "title": "ARIMBI",
                                        "width": "150px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "nakula",
                                        "title": "NAKULA",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "yudistira",
                                        "title": "YUDISTIRA",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },
                                    {
                                        "field": "total",
                                        "title": "Total",
                                        "width": "100px",
                                        // groupFooterTemplate: "#=data.tunai.sum  #",
                                        //  footerTemplate: "#:data.tunai.sum  #"

                                    },

                                ]
                            }
                        }
                        // $scope.isRouteLoading = false;
                    })

            }


            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            // $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };
            // $scope.columnGridK = {
            //     toolbar: ["excel"],
            //     // , "pdf"],

            //     excel: {
            //         fileName: "Laporan Pasien DPJP.xlsx",
            //         allPages: true,

            //     },
            //     // pdf: {
            //     //     fileName: "LaporanPasienMasuk.pdf",
            //     //     allPages: true,
            //     // },

            //     dataSource: $scope.dataExcel,
            //     sortable: true,
            //     // reorderable: true,
            //     // filterable: true,
            //     pageable: true,
            //     // groupable: true,
            //     // columnMenu: true,
            //     resizable: true,
            //     excelExport: function (e) {
            //         var rows = e.workbook.sheets[0].rows;
            //         rows.unshift({
            //             cells: [{ value: "Laporan Pasien DPJP", background: "#fffff" }]
            //         });
            //     },      
            //     columns: [
                    
            //          {
            //             "field": "dokter",
            //             "title": "Dokter",
            //             "width": "200px",
                        
            //             // groupFooterTemplate: "Jumlah",
            //             // footerTemplate: "Total"
            //         },
            //         {
            //             "field": "bima",
            //             "title": "BIMA",
            //             "width": "82px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "gatotkaca",
            //             "title": "GATOTKACA",
            //             "width": "85px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "sadewa",
            //             "title": "SADEWA",
            //             "width": "63px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "srikandi",
            //             "title": "SRIKANDI",
            //             "width": "49px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "drupadi",
            //             "title": "DRUPADI",
            //             "width": "87px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "sembodro",
            //             "title": "SEMBODRO",
            //             "width": "127px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "abimanyu",
            //             "title": "ABIMANYU",
            //             "width": "150px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "kresna",
            //             "title": "KRESNA",
            //             "width": "100px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "arjuna",
            //             "title": "ARJUNA",
            //             "width": "120px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "arimbi",
            //             "title": "ARIMBI",
            //             "width": "150px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "nakula",
            //             "title": "NAKULA",
            //             "width": "100px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "yudistira",
            //             "title": "YUDISTIRA",
            //             "width": "100px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },
            //          {
            //             "field": "total",
            //             "title": "Total",
            //             "width": "100px",
            //             // groupFooterTemplate: "#=data.tunai.sum  #",
            //             //  footerTemplate: "#:data.tunai.sum  #"

            //          },

            //     //     {
            //     //     hidden: true,
            //     //     field: "namaruangan",
            //     //     title: "Nama Ruangan",
            //     //     aggregates: ["count"],
            //     //     groupHeaderTemplate: "   #= value #    "
            //     // }

            //     ]
            // }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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
            



            
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


        }
    ]);
});