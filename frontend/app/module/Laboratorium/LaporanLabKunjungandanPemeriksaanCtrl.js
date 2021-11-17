define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanLabKunjungandanPemeriksaanCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};

            loadCombo()
            $scope.SearchData = function () {
                LoadData()
            }
            function loadCombo(){
                 medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans=data.data.ruanganlab;
                    })

                    medifirstService.get("registrasi/get-data-combo-new", true).then(function (data) {
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listJenisPelayanan = data.data.jenispelayanan;
            })
            $scope.isRouteLoading = false;     
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

             medifirstService.get("laboratorium/get-lap-kunjungan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
                        var data =data.data
                        $scope.dataSourceGridK ={
                            data: data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
								model: {
									fields: {
									}
								}
                            },
                            aggregate: [
                                { field: 'tunai', aggregate: 'sum' },
                                { field: 'bpjs', aggregate: 'sum' },
                                { field: 'jamsostek', aggregate: 'sum' },
                                { field: 'swasta', aggregate: 'sum' },
                                { field: 'hardient', aggregate: 'sum' },
                                { field: 'iks', aggregate: 'sum' },
                                { field: 'inhealth', aggregate: 'sum' },
                                { field: 'thamrin', aggregate: 'sum' },
                                { field: 'jamkesmas', aggregate: 'sum' },
                                { field: 'jamkesda', aggregate: 'sum' },
                                { field: 'skmm', aggregate: 'sum' },
                                { field: 'karyawan', aggregate: 'sum' },
							]
                        }
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-summary-usia?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data)
                    {
                        $scope.isRouteLoading = false;
                        var data2 = data.data;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.dataSourceGridDUsia = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                            model: { 
                                fields: {
                                    jml: {type: "number"},
                                }                               
                            }
                        },
                        aggregate: [
                            {field: "jml", aggregate:"sum"},
                        ]
                        });
                    });

            medifirstService.get("registrasi/laporan/get-data-lap-summary-pendidikan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
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
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.pendidikan == element1.pendidikan){
                                                
                                element.laki = parseFloat(element.laki) + parseFloat(element1.laki)
                                element.wanita = parseFloat(element.wanita) + parseFloat(element1.wanita)        
                                element.baru = parseFloat(element.baru) + parseFloat(element1.baru)       
                                element.lama = parseFloat(element.lama) + parseFloat(element1.lama)
                                element.tunai = parseFloat(element.tunai) + parseFloat(element1.tunai)
                                element.bpjs = parseFloat(element.bpjs) + parseFloat(element1.bpjs)
                                element.jamsostek = parseFloat(element.jamsostek) + parseFloat(element1.jamsostek)
                                element.swasta = parseFloat(element.swasta) + parseFloat(element1.swasta)
                                element.hardient = parseFloat(element.hardient) + parseFloat(element1.hardient)
                                element.iks = parseFloat(element.iks) + parseFloat(element1.iks)
                                element.thamrin = parseFloat(element.thamrin) + parseFloat(element1.thamrin)
                                element.jamkesda = parseFloat(element.jamkesda) + parseFloat(element1.jamkesda)
                                element.jamkesmas = parseFloat(element.jamkesmas) + parseFloat(element1.jamkesmas)
                                element.skmm = parseFloat(element.skmm) + parseFloat(element1.skmm)
                                element.karyawan = parseFloat(element.karyawan) + parseFloat(element1.karyawan)       
                                    podo = true   
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    pendidikan: element1.pendidikan,
                                    wanita: element1.wanita,
                                    tunai: element1.tunai,
                                    bpjs: element1.bpjs,
                                    jamsostek: element1.jamsostek,
                                    swasta: element1.swasta,
                                    hardient: element1.hardient,
                                    iks: element1.iks,
                                    thamrin: element1.thamrin,
                                    jamkesda: element1.jamkesda,
                                    jamkesmas: element1.jamkesmas,
                                    skmm: element1.skmm,
                                    karyawan: element1.karyawan,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.laki) + parseFloat(elemn.wanita)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridP ={
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: 
                            {
                                model: {
                                    fields: {   
                                        pendidikan: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        tunai: { type: "number" },
                                        bpjs: { type: "number" },
                                        jamsostek: { type: "number" },
                                        swasta: { type: "number" },
                                        hardient: { type: "number" },
                                        iks: { type: "number" },
                                        thamrin: { type: "number" },
                                        jamkesda: { type: "number" },
                                        jamkesmas: { type: "number" },
                                        skmm: { type: "number" },
                                        karyawan: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,

                            // aggregate: [
                            //     { field: 'NONPSI', aggregate: 'sum' },
                            //     { field: "PSIKIATRI", aggregate: 'sum' },
                            //     { field: "jumlah", aggregate: 'sum'},
                            // ]


                        }
                        // $scope.isRouteLoading = false;
                    })

             medifirstService.get("registrasi/laporan/get-data-lap-summary-daerah?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
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
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.namakotakabupaten == element1.namakotakabupaten){

                                    element.PSIKIATRI = parseFloat(element.PSIKIATRI) + parseFloat(element1.PSIKIATRI)
                                    element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)        
                                    podo = true  
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    namakotakabupaten: element1.namakotakabupaten,
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    pendidikan: element1.pendidikan,
                                    wanita: element1.wanita,
                                    tunai: element1.tunai,
                                    bpjs: element1.bpjs,
                                    jamsostek: element1.jamsostek,
                                    swasta: element1.swasta,
                                    hardient: element1.hardient,
                                    iks: element1.iks,
                                    thamrin: element1.thamrin,
                                    jamkesda: element1.jamkesda,
                                    jamkesmas: element1.jamkesmas,
                                    skmm: element1.skmm,
                                    karyawan: element1.karyawan,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.PSIKIATRI) + parseFloat(elemn.NONPSI)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridD ={
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
                                        namakotakabupaten: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        tunai: { type: "number" },
                                        bpjs: { type: "number" },
                                        jamsostek: { type: "number" },
                                        swasta: { type: "number" },
                                        hardient: { type: "number" },
                                        iks: { type: "number" },
                                        thamrin: { type: "number" },
                                        jamkesda: { type: "number" },
                                        jamkesmas: { type: "number" },
                                        skmm: { type: "number" },
                                        karyawan: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            // aggregate: [
                            //     { field: 'NONPSI', aggregate: 'sum' },
                            //     { field: "PSIKIATRI", aggregate: 'sum' },
                            //     { field: "jumlah", aggregate: 'sum'},
                            // ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                     medifirstService.get("registrasi/laporan/get-data-lap-summary-pekerjaan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
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
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.pekerjaan == element1.pekerjaan){

                                    element.PSIKIATRI = parseFloat(element.PSIKIATRI) + parseFloat(element1.PSIKIATRI)
                                    element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)        
                                    podo = true  
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    pekerjaan: element1.pekerjaan,
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    pendidikan: element1.pendidikan,
                                    wanita: element1.wanita,
                                    tunai: element1.tunai,
                                    bpjs: element1.bpjs,
                                    jamsostek: element1.jamsostek,
                                    swasta: element1.swasta,
                                    hardient: element1.hardient,
                                    iks: element1.iks,
                                    thamrin: element1.thamrin,
                                    jamkesda: element1.jamkesda,
                                    jamkesmas: element1.jamkesmas,
                                    skmm: element1.skmm,
                                    karyawan: element1.karyawan,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.PSIKIATRI) + parseFloat(elemn.NONPSI)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridPek ={
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
                                        pekerjaan: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        tunai: { type: "number" },
                                        bpjs: { type: "number" },
                                        jamsostek: { type: "number" },
                                        swasta: { type: "number" },
                                        hardient: { type: "number" },
                                        iks: { type: "number" },
                                        thamrin: { type: "number" },
                                        jamkesda: { type: "number" },
                                        jamkesmas: { type: "number" },
                                        skmm: { type: "number" },
                                        karyawan: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'NONPSI', aggregate: 'sum' },
                                { field: "PSIKIATRI", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum'},
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-summary-agama?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
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
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.agama == element1.agama){

                                    element.PSIKIATRI = parseFloat(element.PSIKIATRI) + parseFloat(element1.PSIKIATRI)
                                    element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)        
                                    podo = true  
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    agama: element1.agama,
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    pendidikan: element1.pendidikan,
                                    wanita: element1.wanita,
                                    tunai: element1.tunai,
                                    bpjs: element1.bpjs,
                                    jamsostek: element1.jamsostek,
                                    swasta: element1.swasta,
                                    hardient: element1.hardient,
                                    iks: element1.iks,
                                    thamrin: element1.thamrin,
                                    jamkesda: element1.jamkesda,
                                    jamkesmas: element1.jamkesmas,
                                    skmm: element1.skmm,
                                    karyawan: element1.karyawan,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.PSIKIATRI) + parseFloat(elemn.NONPSI)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridAg ={
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
                                        agama: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        tunai: { type: "number" },
                                        bpjs: { type: "number" },
                                        jamsostek: { type: "number" },
                                        swasta: { type: "number" },
                                        hardient: { type: "number" },
                                        iks: { type: "number" },
                                        thamrin: { type: "number" },
                                        jamkesda: { type: "number" },
                                        jamkesmas: { type: "number" },
                                        skmm: { type: "number" },
                                        karyawan: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'NONPSI', aggregate: 'sum' },
                                { field: "PSIKIATRI", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum'},
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                    medifirstService.get("registrasi/laporan/get-data-lap-summary-kujungan-tahunan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempRuanganId
                    + tempKelPasienId
                    + tempJenPelId).then(function (data) {
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
                            for (var x = 0; x < group.length; x++) {
                               var element=  group[x]
                               // var jumlah = 
                                group[x].no = x + 1
                               if(element.bulan == element1.bulan){

                                    element.PSIKIATRI = parseFloat(element.PSIKIATRI) + parseFloat(element1.PSIKIATRI)
                                    element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)        
                                    podo = true  
                               }
                            }
                            if(podo== false){
                                var datass ={
                                    bulan: element1.bulan,
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    pendidikan: element1.pendidikan,
                                    wanita: element1.wanita,
                                    tunai: element1.tunai,
                                    bpjs: element1.bpjs,
                                    jamsostek: element1.jamsostek,
                                    swasta: element1.swasta,
                                    hardient: element1.hardient,
                                    iks: element1.iks,
                                    thamrin: element1.thamrin,
                                    jamkesda: element1.jamkesda,
                                    jamkesmas: element1.jamkesmas,
                                    skmm: element1.skmm,
                                    karyawan: element1.karyawan,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                           var elemn= group[i] 
                            elemn.jumlah = parseFloat(elemn.PSIKIATRI) + parseFloat(elemn.NONPSI)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        
                        $scope.dataSourceGridKjT ={
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
                                        bulan: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        tunai: { type: "number" },
                                        bpjs: { type: "number" },
                                        jamsostek: { type: "number" },
                                        swasta: { type: "number" },
                                        hardient: { type: "number" },
                                        iks: { type: "number" },
                                        thamrin: { type: "number" },
                                        jamkesda: { type: "number" },
                                        jamkesmas: { type: "number" },
                                        skmm: { type: "number" },
                                        karyawan: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'NONPSI', aggregate: 'sum' },
                                { field: "PSIKIATRI", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum'},
                            ]


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
                    fileName: "Summary Register Pendaftaran Instalasi - Kunjungan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Kunjungan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "100px",
                        
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        groupFooterTemplate: "#=data.tunai.sum  #",
                         footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        groupFooterTemplate: "#=data.bpjs.sum  #",
                         footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        groupFooterTemplate: "#=data.jamsostek.sum  #",
                         footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        groupFooterTemplate: "#=data.swasta.sum  #",
                         footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        groupFooterTemplate: "#=data.hardient.sum  #",
                         footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        groupFooterTemplate: "#=data.iks.sum  #",
                         footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "inhealth",
                        "title": "Inhealth",
                        "width": "50px",
                        groupFooterTemplate: "#=data.iks.sum  #",
                         footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        groupFooterTemplate: "#=data.thamrin.sum  #",
                         footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        groupFooterTemplate: "#=data.jamkesmas.sum  #",
                         footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        groupFooterTemplate: "#=data.jamkesda.sum  #",
                         footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        groupFooterTemplate: "#=data.skmm.sum  #",
                         footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        groupFooterTemplate: "#=data.karyawan.sum  #",
                         footerTemplate: "#:data.karyawan.sum  #"

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


            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pendidikan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pendidikan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "pendidikan",
                        "title": "Jenjang Pendidikan",
                        "width": "100px",
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },

                ]
            }

            //  $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };


            $scope.aggregate = [
                {
                    field: "jumlah",
                    aggregate: "sum"
                }
            ]

            $scope.columnGridD = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Daerah.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Daerah)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "namakotakabupaten",
                        "title": "Kabupaten/Kota Madya",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                ]
            }

            $scope.aggregate = [
                {
                    field: "jumlah",
                    aggregate: "sum"
                }
            ]

            $scope.columnGridPek = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pekerjaan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pekerjaan)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },

                ]
            }

            $scope.columnGridUsia = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Jalan - Usia.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Jalan (Usia)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                            "field": "no",
                            "title": "No",
                            "width": "75px",
                            footerTemplate: "Total",
                            attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        } 
                        },
                        {
                            "field": "usia",
                            "title": "Usia",

                        },
                        {
                            "field": "jml",
                            "title": "Jumlah",
                            aggregates: ["sum"],
                            footerTemplate: "#: data.jml.sum #",

                        }
                ]

            }

            $scope.columnGridAg = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "agama",
                        "title": "Agama",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
                ]
            }

            $scope.columnGridKjT = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },      
                columns: [
                    
                     {
                        "field": "bulan",
                        "title": "Bulan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        
                        [
                        {
                            "field" : "laki",
                            "title" : "Laki-Laki",
                            "width": "75px",
                            // aggregates: ["sum"],        
                            //  groupFooterTemplate: "#=data.laki.sum  #",
                            // footerTemplate: "#:data.laki.sum  #"
                            
                        }, 
                        {
                            "field" : "wanita",
                            "title" : "Perempuan",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.wanita.sum  #",
                            // footerTemplate: "#:data.wanita.sum  #"
                        }
                        ],

                    },
                    {
                        "title": "Kunjungan",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center" },
                        "columns":
                        [{
                            "field" : "baru",
                            "title" : "Baru",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.baru.sum  #",
                            // footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field" : "lama",
                            "title" : "Lama",
                            "width": "75px",
                            // aggregates: ["sum"],
                            // groupFooterTemplate: "#=data.lama.sum  #",
                            // footerTemplate: "#:data.lama.sum  #"
                        }
                        ]
                    }, 
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.tunai.sum  #",
                        //  footerTemplate: "#:data.tunai.sum  #"

                     },
                     {
                        "field": "bpjs",
                        "title": "BPJS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.bpjs.sum  #",
                        //  footerTemplate: "#:data.bpjs.sum  #"

                     },
                     {
                        "field": "jamsostek",
                        "title": "Jmtk",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamsostek.sum  #",
                        //  footerTemplate: "#:data.jamsostek.sum  #"

                     },
                     {
                        "field": "swasta",
                        "title": "A. Swasta",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.swasta.sum  #",
                        //  footerTemplate: "#:data.swasta.sum  #"

                     },
                     {
                        "field": "hardient",
                        "title": "Hardient",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.hardient.sum  #",
                        //  footerTemplate: "#:data.hardient.sum  #"

                     },
                     {
                        "field": "iks",
                        "title": "IKS",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.iks.sum  #",
                        //  footerTemplate: "#:data.iks.sum  #"

                     },
                     {
                        "field": "thamrin",
                        "title": "Thamrin",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.thamrin.sum  #",
                        //  footerTemplate: "#:data.thamrin.sum  #"

                     },
                     {
                        "field": "jamkesmas",
                        "title": "Jamkesmas",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesmas.sum  #",
                        //  footerTemplate: "#:data.jamkesmas.sum  #"

                     },
                     {
                        "field": "jamkesda",
                        "title": "Jamkesda",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.jamkesda.sum  #",
                        //  footerTemplate: "#:data.jamkesda.sum  #"

                     },
                     {
                        "field": "skmm",
                        "title": "SKMM",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.skmm.sum  #",
                        //  footerTemplate: "#:data.skmm.sum  #"

                     },
                     {
                        "field": "karyawan",
                        "title": "Karyawan",
                        "width": "50px",
                        // groupFooterTemplate: "#=data.karyawan.sum  #",
                        //  footerTemplate: "#:data.karyawan.sum  #"

                     },
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