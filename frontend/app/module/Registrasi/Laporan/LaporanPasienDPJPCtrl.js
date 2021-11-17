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

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

             medifirstService.get("registrasi/laporan/get-data-lap-pasien-dpjp?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data =data.data
                        var group =  []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            // for (var x = 0; x < group.length; x++) {
                            //    var element=  group[x]
                            //    // var jumlah = 
                            //     group[x].no = x + 1
                            //    if(element.namaruangan == element1.namaruangan && element.kelompokpasien == element1.kelompokpasien){
                                    
                            //         // $scope.totallaki= $scope.totallaki + parseFloat(group[x].laki)
                            //         // $scope.totalwanita= $scope.totalwanita + parseFloat(group[x].wanita)
                            //         // $scope.totalbaru= $scope.totalbaru + parseFloat(group[x].baru)
                            //         // $scope.totallama= $scope.totallama + parseFloat(group[x].lama)
                            //         // $scope.totaljumlah = $scope.totaljumlah + parseFloat(group[x].jumlah)

                            //         element.laki = parseFloat(element.laki) + parseFloat(element1.laki)
                            //         element.wanita = parseFloat(element.wanita) + parseFloat(element1.wanita)        
                            //         element.baru = parseFloat(element.baru) + parseFloat(element1.baru)       
                            //         element.lama = parseFloat(element.lama) + parseFloat(element1.lama)
                            //         element.tunai = parseFloat(element.tunai) + parseFloat(element1.tunai)
                            //         element.bpjs = parseFloat(element.bpjs) + parseFloat(element1.bpjs)
                            //         element.jamsostek = parseFloat(element.jamsostek) + parseFloat(element1.jamsostek)
                            //         element.swasta = parseFloat(element.swasta) + parseFloat(element1.swasta)
                            //         element.hardient = parseFloat(element.hardient) + parseFloat(element1.hardient)
                            //         element.iks = parseFloat(element.iks) + parseFloat(element1.iks)
                            //         element.thamrin = parseFloat(element.thamrin) + parseFloat(element1.thamrin)
                            //         element.jamkesda = parseFloat(element.jamkesda) + parseFloat(element1.jamkesda)
                            //         element.jamkesmas = parseFloat(element.jamkesmas) + parseFloat(element1.jamkesmas)
                            //         element.skmm = parseFloat(element.skmm) + parseFloat(element1.skmm)
                            //         element.karyawan = parseFloat(element.karyawan) + parseFloat(element1.karyawan)
                            //         // element.jumlah = parseFloat(element.laki) + parseFloat(element.wanita)
                            //         // element.total = parseFloat(element.jumlah) + parseFloat(element1.jumlah)  
                            //         podo = true  
                            //    }
                            // }
                            if(podo== false){
                                var datass ={
                                    anggrek1: element1.anggrek1,
                                    anggrek2: element1.anggrek2,
                                    dahlia: element1.dahlia,
                                    nicu: element1.nicu,
                                    icucovid: element1.icucovid,
                                    bougenvilleatas: element1.bougenvilleatas,
                                    bougenvillebawah: element1.bougenvillebawah,
                                    terataiatas: element1.terataiatas,
                                    terataibawah: element1.terataibawah,
                                    flamboyan: element1.flamboyan,
                                    cempaka: element1.cempaka,
                                    seruniatas: element1.seruniatas,
                                    serunibawah: element1.serunibawah,
                                    vip: element1.vip,
                                    icu: element1.icu,
                                    iccu: element1.iccu,
                                    melati1: element1.melati1,
                                    melati2: element1.melati2,
                                    melati3: element1.melati3,
                                    melati4: element1.melati4,
                                    camelia: element1.camelia,
                                    flamboyan2: element1.flamboyan2,
                                    hccu: element1.hccu,
                                    dokter: element1.dokter,
                                    total: element1.total,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.laki) + parseFloat(elemn.wanita)
                            // elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridK ={
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
                                        anggrek1: { type: "number" },
                                        anggrek2: { type: "number" },
                                        dahlia: { type: "number" },
                                        nicu: { type: "number" },
                                        icucovid: { type: "number" },
                                        bougenvilleatas: { type: "number" },
                                        bougenvillebawah: { type: "number" },
                                        terataiatas: { type: "number" },
                                        terataibawah: { type: "number" },
                                        flamboyan: { type: "number" },
                                        cempaka: { type: "number" },
                                        seruniatas: { type: "number" },
                                        serunibawah: { type: "number" },
                                        vip: { type: "number" },
                                        icu: { type: "number" },
                                        iccu: { type: "number" },
                                        melati1: { type: "number" },
                                        melati2: { type: "number" },
                                        melati3: { type: "number" },
                                        melati4: { type: "number" },
                                        camelia: { type: "number" },
                                        flamboyan2: { type: "number" },
                                        hccu: { type: "number" },
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
            $scope.columnGridK = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Laporan Pasien DPJP.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Pasien DPJP", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "200px",
                        
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "field": "anggrek1",
                        "title": "Anggrek 1",
                        "width": "82px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "anggrek2",
                        "title": "Anggrek 2",
                        "width": "85px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "dahlia",
                        "title": "Dahlia",
                        "width": "63px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "nicu",
                        "title": "Nicu",
                        "width": "49px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "icucovid",
                        "title": "ICU Covid",
                        "width": "87px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bougenvilleatas",
                        "title": "Bougenvile Atas",
                        "width": "127px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bougenvillebawah",
                        "title": "Bougenvile Bawah",
                        "width": "150px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "terataiatas",
                        "title": "Teratai Atas",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "terataibawah",
                        "title": "Teratai Bawah",
                        "width": "120px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "flamboyan",
                        "title": "Flamboyan Covid",
                        "width": "150px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "cempaka",
                        "title": "Cempaka",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "seruniatas",
                        "title": "Seruni Atas",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "serunibawah",
                        "title": "Seruni Bawah",
                        "width": "120px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "vip",
                        "title": "VIP",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "icu",
                        "title": "ICU",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "iccu",
                        "title": "ICCU",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "melati1",
                        "title": "Melati 1",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "melati2",
                        "title": "Melati 2",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "melati3",
                        "title": "Melati 3",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "melati4",
                        "title": "Melati 4",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "camelia",
                        "title": "Camelia",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "flamboyan2",
                        "title": "Flamboyan",
                        "width": "100px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "hccu",
                        "title": "HCCU",
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

                //     {
                //     hidden: true,
                //     field: "namaruangan",
                //     title: "Nama Ruangan",
                //     aggregates: ["count"],
                //     groupHeaderTemplate: "   #= value #    "
                // }

                ]
            }

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