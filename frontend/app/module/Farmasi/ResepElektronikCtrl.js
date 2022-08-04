define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResepElektronikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.title = "Resep elektronik";
            $scope.dataVOloaded = true;
            $scope.item = {};
            $rootScope.isOpen = true;
            FormLoad();
            // $scope.item.namaPasien = "";
            // $scope.item.ruangan = "";
            // $scope.getIsiComboRuangan = function () {
            //     $scope.listRuangan = $scope.departemen.ruangan
            // }
            // $scope.notDetail = true;
            //define column untuk grid

            function FormLoad() {
                medifirstService.get('farmasi/get-datacombo_dp').then(function (e) {
                    $scope.listRuangan = e.data.ruanganpelayanan
                    $scope.listRuanganDepo = e.data.ruanganfarmasi
                })
            }
              var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows
                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var isambilobat = kendoGrid.dataItem(row).isambilobat;
                    if (isambilobat != null && isambilobat == '✔') {
                        $(row.cells[2]).addClass("green");
                         $(row.cells[16]).addClass("green");
                    }else{
                        // $(row.cells[1]).addClass("red");
                    }
                    var cito = kendoGrid.dataItem(row).cito;
                    if (cito != null && cito == '✔') {
                         $(row.cells[15]).addClass("red");
                    }else{
                        // $(row.cells[1]).addClass("red");
                    }
                    var statusorder = kendoGrid.dataItem(row).statusorder;
                    if (statusorder != null && statusorder == 'Menunggu') {
                         $(row.cells[11]).addClass("koneng");
                    }else if (statusorder != null && statusorder == 'Verifikasi') {
                        $(row.cells[11]).addClass("green");
                   }else{
                        // $(row.cells[1]).addClass("red");
                    }
                    var iskurir = kendoGrid.dataItem(row).iskurir;
                    if (iskurir != null && iskurir == '✔') {
                        $(row.cells[2]).addClass("koneng");
                         $(row.cells[17]).addClass("koneng");
                    }else{
                        // $(row.cells[1]).addClass("red");
                    }
                    
                }
            }
             $scope.arrColumnGridResepElektronik = {
                dataBound: onDataBound,
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Resep Elektronik",
                    allPages: true,
                },
                // filterable: {
                //     extra: false,
                //     operators: {
                //         string: {
                //             contains: "Contains",
                //             startswith: "Starts with"
                //         }
                //     }
                // },
                selectable: 'row',
                scrollable: true,
                pageable: true,
                groupable: true,  
                columns: [
                {
                    "field": "noantri",
                    "title": "No Antri",
                    "width": "40px",
                },
                {
                    "field": "noorder",
                    "title": "No Pesanan",
                    "width": "60px",


                }, {
                    "field": "nocm",
                    "title": "No Rekam Medis",
                    "width": "60px",


                }, {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "100px",

                }, {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "60px",

                }, {
                    "field": "namaruanganrawat",
                    "title": "Ruang Rawat",
                    "width": "100px",

                }, {
                    template: "#= new moment(new Date(tglorder)).format('DD-MM-YYYY HH:mm:ss') #",
                    "field": "strukOrder.tglOrder",
                    "title": "Tanggal/Jam Masuk",
                    "width": "100px",

                }, {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px",

                }, {
                    "field": "kelompokpasien",
                    "title": "Tipe Pasien",
                    "width": "60px",

                }, {
                    hidden: true,
                    "field": "namaruangan",
                    "width": "70px",
                    "title": "Depo",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # "

                }, {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "60px",

                }, {
                    "field": "namapengambilorder",
                    "title": "Pengambil Obat",
                    "width": "80px",

                },
                {
                    "field": "noruangan",
                    "title": "No Ruang",
                    "width": "80px",

                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "80px",

                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "width": "80px",
                },
                {
                    "field": "isbayar",
                    "title": "Sudah dibayar",
                    "width": "80px",

                },
                {
                    "field": "isambilobat",
                    "title": "Resep Di Ambil Di RS",
                    "width": "80px",

                },
                {
                    "field": "iskurir",
                    "title": "Resep Diantar Kurir",
                    "width": "80px",

                },
                {
                    "field": "statusgrab",
                    "title": "Order Grab",
                    "width": "80px",

                },
                
                {
                    hidden: true,
                    "field": "jenis",
                    "width": "70px",
                    "title": "Jenis",
                    aggregates: ["count"],
                    groupHeaderTemplate: " #= value # "

                },]
            };

            LoadCache();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('ResepElektronikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.startDate = new Date(chacePeriode[0]);
                    $scope.untilDate = new Date(chacePeriode[1]);
                    if (chacePeriode[2] != null)
                        $scope.noCm = chacePeriode[2]
                    if (chacePeriode[3] != null)
                        $scope.namaPasien = chacePeriode[3]
                    if (chacePeriode[4] != null)
                        $scope.noPesanan = chacePeriode[4]
                    if (chacePeriode[5] != null)
                        $scope.departemen = chacePeriode[5]
                    if (chacePeriode[6] != null)
                        $scope.checkPasienRanap = chacePeriode[6]
                    if (chacePeriode[7] != null)
                        $scope.checkPasienRajal = chacePeriode[7]
                        


                }
                else {
                    $scope.item.startDate = $scope.now;
                    $scope.item.untilDate = $scope.now;
                }
            }

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            $scope.ruanganId = "";
            $scope.group = {
                field: "jenis",
                aggregates: [{
                    field: "jenis",
                    aggregate: "count"
                }]
            };
            // $scope.arrColumnGridResepElektronik = [{
            //     "field": "strukOrder.noOrder",
            //     "title": "No Pesanan",


            // }, {
            //     "field": "pasien.noCm",
            //     "title": "No Rekam Medis",


            // }, {
            //     "field": "pasien.namaPasien",
            //     "title": "Nama Pasien",

            // }, {
            //     "field": "pasien.jenisKelamin.jenisKelamin",
            //     "title": "Jenis Kelamin",

            // }, {
            //     "field": "strukOrder.ruangan.namaRuangan",
            //     "title": "Ruang Rawat",

            // }, {
            //     template: "#= new moment(new Date(strukOrder.tglOrder)).format('DD-MM-YYYY HH:mm:ss') #",
            //     "field": "strukOrder.tglOrder",
            //     "title": "Tanggal/Jam Masuk",

            // }, {
            //     "field": "penulisResep.namaLengkap",
            //     "title": "Dokter",

            // }, {
            //     "field": "strukOrder.pasienDaftar.kelompokPasien.kelompokPasien",
            //     "title": "Tipe Pasien",

            // }, {
            //     hidden: true,
            //     "field": "strukOrder.ruanganTujuan.namaRuangan",
            //     "title": "Depo",
            //     aggregates: ["count"],
            //     groupHeaderTemplate: "Ruangan #= value # "

            // }, {
            //     "field": "statusAntrian",
            //     "title": "Status",

            // }, {
            //     "field": "strukOrder.namaPengambilOrder",
            //     "title": "Pengambil Obat",

            // }];

            // $scope.noCm = "";
            // $scope.startDate = new Date();
            // $scope.untilDate = new Date();
            // $scope.ruanganId = "";
            // $scope.group = {
            //     field: "strukOrder.ruanganTujuan.namaRuangan",
            //     aggregates: [{
            //         field: "strukOrder.ruanganTujuan.namaRuangan",
            //         aggregate: "count"
            //     }]
            // };
            $scope.listStatus = [
                { id: 0, status: 'Menunggu' },
                { id: 1, status: 'Produksi' },
                { id: 2, status: 'Packaging' },
                { id: 3, status: 'Selesai' },
                { id: 4, status: 'Penyerahan Obat' },
                { id: 5, status: 'Verifikasi' },
            ]
            $scope.selectOptionStatus = {
                placeholder: "Status...",
                dataTextField: "status",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,

            };            
            $scope.refresh = function () {
                $scope.isRouteLoading = true
                // debugger;
                var nocm = ''
                if ($scope.noCm != undefined) {
                    nocm = '&nocm=' + $scope.noCm
                }
                var namaPasien = ''
                if ($scope.namaPasien != undefined) {
                    namaPasien = '&namaPasien=' + $scope.namaPasien
                }
                var noPesanan = ''
                if ($scope.noPesanan != undefined) {
                    noPesanan = '&noPesanan=' + $scope.noPesanan
                }
                var departemenId = ''
                if ($scope.departemen != undefined) {
                    departemenId = '&departemenId=' + $scope.departemen.id
                }
                var ruanganId = ''
                if ($scope.ruangan != undefined) {
                    ruanganId = '&ruanganId=' + $scope.ruangan.id
                }
                var depoId = ''
                if ($scope.depo != undefined) {
                    depoId = '&depoId=' + $scope.depo.id
                }
                var checkPasienRanap = ''
                if ($scope.checkPasienRanap != undefined) {
                    checkPasienRanap = '&checkPasienRanap=' + $scope.checkPasienRanap
                }
                var checkPasienRajal = ''
                if ($scope.checkPasienRajal != undefined) {
                    checkPasienRajal = '&checkPasienRajal=' + $scope.checkPasienRajal
                }
                // var status = ''
                // if ($scope.status != undefined) {
                //     status = '&statusId=' + $scope.status.id
                // }
                var status = ""
                if ($scope.status != undefined) {
                    if ($scope.status.length != 0) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.status.length - 1; i >= 0; i--) {
                            var c = $scope.status[i].id
                            b = "," + c
                            a = a + b
                        }
                        status = a.slice(1, a.length)
                    }
                }

                var tglAwal = moment($scope.startDate).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.untilDate).format('YYYY-MM-DD');
                medifirstService.get('farmasi/get-daftar-order?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + nocm + namaPasien + noPesanan + ruanganId + departemenId + '&statusId=' + status + depoId + checkPasienRanap + checkPasienRajal).then(function (e) {
                    // findPasien.findOrderObat($scope.noCm, $scope.ruanganId, $scope.startDate, $scope.untilDate).then(function(e) {
                    for (var i = 0; i < e.data.length; i++) {
                        e.data[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(e.data[i].tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        e.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        //itungUsia(dat.data[i].tgllahir)
                        if (e.data[i].noorder == e.data[i].noresep) {
                            if (e.data[i].statusorder == 'Menunggu')
                                e.data[i].statusorder = 'Verifikasi'
                        }
                        if (e.data[i].checkreseppulang == '1') {
                            e.data[i].cekreseppulang = '✔'
                        } else {
                            e.data[i].cekreseppulang = '-'
                        }
                        
                        if (e.data[i].isambilobat == true) {
                            e.data[i].isambilobat = "✔"                            
                        }else{
                            e.data[i].isambilobat = "✘"
                        }   
                        if (e.data[i].cito == true) {
                            e.data[i].cito = "✔"                            
                        }else{
                            e.data[i].cito = "✘"
                        }                        
                        if (e.data[i].isordergrab == true) {
                            e.data[i].statusgrab = "Sudah Order"                            
                        }else{
                            e.data[i].statusgrab = "-"
                        }
                        if (e.data[i].iskurir == true) {
                            e.data[i].iskurir = "✔"                            
                        }else{
                            e.data[i].iskurir = "✘"
                        }
                        if (e.data[i].isbayar == true) {
                            e.data[i].isbayar = "Lunas"                            
                        }else{
                            e.data[i].isbayar = "Belum dibayar"
                        }

                    }
                    $scope.isRouteLoading = false
                    e.data.sort(function (a, b) {
                        if (a.noantri < b.noantri) { return -1; }
                        if (a.noantri > b.noantri) { return 1; }
                        return 0;
                    })
                    $scope.patienGrids = new kendo.data.DataSource({
                        //data: ModelItem.beforePost(e.data.data, true),
                        data: ModelItem.beforePost(e.data, true),
                        group: $scope.group
                    });


                });
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.noCm != undefined ? $scope.noCm : null,
                    3: $scope.namaPasien != undefined ? $scope.namaPasien : null,
                    4: $scope.noPesanan != undefined ? $scope.noPesanan : null,
                    5: $scope.departemen != undefined ? $scope.departemen : null,
                    6: $scope.checkPasienRanap !=undefined ? $scope.checkPasienRanap : null,
                    7: $scope.checkPasienRajal !=undefined ? $scope.checkPasienRajal : null
                }
                cacheHelper.set('ResepElektronikCtrl', chacePeriode);
            };
            $scope.refresh();


            $scope.now = new Date();
            $scope.detailOrder = function () {

                //$state.go('ResepElektronikDetail', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });

                // *** OLD
                // var arrStr ={ 0 : $scope.item.nocm ,
                //     1 : $scope.item.namapasien,
                //     2 : $scope.item.jeniskelamin,
                //     3 : $scope.item.noregistrasi, 
                //     4 : $scope.item.umur,
                //     5 : $scope.item.klid,
                //     6 : $scope.item.namakelas,
                //     7 : $scope.item.tglregistrasi,
                //     8 : $scope.item.norec_apd,
                //     9 : 'detail'
                // }
                // cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
                // $state.go('TransaksiPelayananApotik')
                var dataSet = []
                medifirstService.get("farmasi/get-detail-order?noorder=" + $scope.item.noorder, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglorders = moment(new Date(e.data.strukorder.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noorders = $scope.item.noorder
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    var dataGrids = e.data.orderpelayanan
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.namaruangan = e.data.strukorder.namaruangan
                        if ($scope.item.reseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }
                    // for (var i = e.data.orderpelayanan.length - 1; i >= 0; i--) {
                    //     e.data.orderpelayanan[i].no = i + 1
                    // for (let z = 0; z < e.data[i].details.length; z++) {
                    //     dataSet.push({
                    //         no: z + 1,
                    //         jeniskelamin: e.data[i].jeniskelamin,
                    //         kelompokpasien: e.data[i].kelompokpasien,
                    //         klid: e.data[i].klid,
                    //         namakelas: e.data[i].namakelas,
                    //         namalengkap: e.data[i].namalengkap,
                    //         namapasien: e.data[i].namapasien,
                    //         namapengambilorder: e.data[i].namapengambilorder,
                    //         namaruangan: e.data[i].namaruangan,
                    //         namaruanganrawat: e.data[i].namaruanganrawat,
                    //         nocm: e.data[i].nocm,
                    //         noorder: e.data[i].noorder,
                    //         norec: e.data[i].norec,
                    //         norec_apd: e.data[i].norec_apd,
                    //         noregistrasi: e.data[i].noregistrasi,
                    //         statusorder: e.data[i].statusorder,
                    //         tgllahir: e.data[i].tgllahir,
                    //         tglorder: e.data[i].tglorder,
                    //         tglregistrasi: e.data[i].tglregistrasi,
                    //         aturanpakai: e.data[i].details[z].aturanpakai,
                    //         hargasatuan: e.data[i].details[z].hargasatuan,
                    //         jeniskemasan: e.data[i].details[z].jeniskemasan,
                    //         jumlah: e.data[i].details[z].jumlah,
                    //         namaproduk: e.data[i].details[z].namaproduk,
                    //         noorder: e.data[i].details[z].noorder,
                    //         rke: e.data[i].details[z].rke,
                    //         satuanstandar: e.data[i].details[z].satuanstandar,
                    //         norecresep: e.data[i].details[z].norecresep,
                    //     })

                    // }
                    // }
                    // if (dataSet.length > 0) {
                    //     $scope.item.tglorders = dataSet[0].tglorder
                    //     $scope.item.noorders = dataSet[0].noorder
                    //     $scope.item.dokters = dataSet[0].namalengkap
                    //     $scope.item.statuss = dataSet[0].statusorder
                    // }
                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.orderpelayanan,
                        pageSize: 1000
                    });


                });
                $scope.popUp.center().open()
            }

            $scope.updateProduksi = function () {
                    

                    
                        if ($scope.item.statusorder != 'Menunggu') {
                            //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 1).then(function(e) {
                            //
                            //managePasien.updateStatusOrder($scope.item.noorder, 1).then(function(e) {
                            var strukresep = ""
                            if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                                strukresep = true
                            }
        
                            var objSave = {
                                noorder: $scope.item.noorder,
                                statusorder: 1,
                                tglambil: null,
                                namapengambil: null,
                                tglselesai: null,
                                namaselesai: null,
                                strukresep: strukresep
                            }
                            medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                                let params = $scope.item.noregistrasi    
                                if($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi !='Kios-K'){
                                    params = $scope.item.noreservasi
                                }
                                saveAntrol(params,5)
                                medifirstService.postLogging('Rubah Status Produksi Order Resep Elektronik', 'No Order Struk Order',
                                    $scope.item.noorder, 'Rubah Status Produksi Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                        $scope.refresh();
                                    })
                                    
                            });
                        } else {
                            toastr.error("Status Data Belum Diverifikasi !!")
                            return;
                        }
                //if ($scope.item.statusorder == 'Verifikasi') {
                
            }

            $scope.updatePackaging = function () {
                    

                    
                        if ($scope.item.statusorder != 'Menunggu') {
                            //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 2).then(function(e) {
                            // managePasien.updateStatusOrder($scope.item.noorder, 2).then(function(e) {
                            //     $scope.refresh();
                            // });;
                            var strukresep = ""
                            if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                                strukresep = true
                            }
        
                            var objSave =
                            {
                                noorder: $scope.item.noorder,
                                statusorder: 2,
                                tglambil: null,
                                namapengambil: null,
                                tglselesai: null,
                                namaselesai: null,
                                strukresep: strukresep
                            }
                            medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                                medifirstService.postLogging('Rubah Status Packaging Order Resep Elektronik', 'No Order Struk Order',
                                    $scope.item.noorder, 'Rubah Status Packaging Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                        $scope.refresh();
                                    })
                            });
                        } else {
                            if ($scope.item.statusorder == 'Menunggu') {
                                toastr.error("Status Data Belum Diverifikasi !!")
                                return;
                            } else {
                                toastr.error("Status Data Belum Produksi !!")
                                return;
                            }
                        }
                //if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Produksi') {
                
            }
            $scope.updateDone = function () {
                    

                    
                        if ($scope.item.statusorder != 'Menunggu') {
                            //managePasien.updateStatusOrder($scope.item.strukOrder.noOrder, 3).then(function(e) {
                            // managePasien.updateStatusOrder($scope.item.noorder, 3).then(function(e) {
                            //     $scope.refresh();
                            // });;
                            var strukresep = ""
                            if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                                strukresep = true
                            }
                            var objSave =
                            {
                                noorder: $scope.item.noorder,
                                statusorder: 3,
                                tglambil: null,
                                namapengambil: null,
                                tglselesai: null,
                                namaselesai: 'selesai',
                                strukresep: strukresep
                            }
                            medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                                var userLogin = medifirstService.getPegawaiLogin();
                                var Norec = $scope.item.noresep;
                                var Noreg = $scope.item.noregistrasi;
                                //grhasia ga perlu cetak ketika tekan selesai
                                // if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai') {
                                //     var stt = 'false'
                                //     if (confirm('View Antrian Farmasi? ')) {
                                //         // Save it!
                                //         stt = 'true';
                                //     } else {
                                //         // Do nothing!
                                //         stt = 'false'
                                //     }
                                //     var client = new HttpClient();
                                //     client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                                //         // aadc=response;
                                //     });
                                // }
        
        
                                medifirstService.postLogging('Rubah Status Selasai Order Resep Elektronik', 'No Order Struk Order',
                                    $scope.item.noorder, 'Rubah Status Selasai Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                        $scope.refresh();
                                    })
                            });
                            let params = $scope.item.noregistrasi    
                            if($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi !='Kios-K'){
                                params = $scope.item.noreservasi
                            } 
                            saveAntrol(params,7)
                        } else {
                            if ($scope.item.statusorder == 'Menunggu') {
                                toastr.error("Status Data Belum Diverifikasi !!")
                                return;
                            } else {
                                toastr.error("Status Data Belum Packaging !!")
                                return;
                            }
                        }
                //if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging') {
                
            }

            $scope.Riwayat = function () {

                var nocm = "";
                if ($scope.item.nocm) {
                    nocm = $scope.item.nocm;
                }

                console.log(nocm)

                var noregistrasi = "";
                if ($scope.item.noregistrasi) {
                    noregistrasi = $scope.item.noregistrasi;
                }


                medifirstService.get("farmasi/get-transaksi-pelayanan?nocm=" + nocm, true).then(function (dat) {
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
                                    details: dataDetail0,
                                   // keterangan:  array[i].keteranganpakai,
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridRiwayatObat = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                    $scope.popUpRiwayat.center().open();
                });
            }

            $scope.data22 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        sort:[{ field: "rke", dir: "asc" }],

                    }),
                    resizable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                            "hidden": "true",
                        },
                        {
                            "field": "rke",
                            "title": "R/",
                            "width": "35px",
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
                            "field": "keteranganpakai",
                            "title": "Keterangan",
                            "width": "400px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        }

                    ]
                }
            };

            $scope.columnGridRiwayatObat = [

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

            $scope.verifikasi = function () {
                medifirstService.get("farmasi/get-penjagaan-closing-kasir?noregistrasi=" + $scope.item.noregistrasi ).then(function (e) {
                    

                    if(e.data.detail[0].tglclosing == null){
                        var cek = 123;
                    } else{
                        var cek = 234;
                    }
          
                    console.log(cek);
          
                    if(cek == 234){
                        messageContainer.error("Data yang sudah diclosing tidak bisa ditambah obat");
                    } else if (cek == 123){
                        // debugger;
                        if ($scope.item.statusorder == 'Menunggu') {
                            //$state.go('ResepElektronikVerifikasi', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });
                            var arrStr = {
                                0: $scope.item.nocm,
                                1: $scope.item.namapasien,
                                2: $scope.item.jeniskelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.klid,
                                6: $scope.item.namakelas,
                                7: $scope.item.tglregistrasi,
                                8: $scope.item.norec_apd,
                                9: $scope.item.noorder,
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                17: $scope.item.cito,
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')

                            let params = $scope.item.noregistrasi    
                            if($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi !='Kios-K'){
                                params = $scope.item.noreservasi
                            } 
                            saveAntrol(params,6)
                        } else {
                            alert('Sudah di verifikasi!!')
                        }
                    }
                });
                
            }
            $scope.ambilObat = function () {
                        if ($scope.item.statusorder == 'Selesai') {
                            // noresep
                            $scope.item.tglambil = new Date()
                            $scope.item.namapengambil = $scope.item.namapasien 
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:2905/printvb/Pendaftaran?displaykeun=1&noantri=' + $scope.item.noantri + '&namapasien=' + $scope.item.nocm + ', ' + $scope.item.namapasien + '&view=true', function (response) {
                                // do something with response
                            });
                            // if ( $scope.item.statusorder == 'Selesai') {
                            
                            $scope.popup.center().open();
                            //$state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.strukOrder.noOrder, noAntrianPasien: $scope.item.strukOrder.noRegistrasi.noRec });
                            // $state.go('ResepElektronikAmbilObat', { noOrder: $scope.item.noorder, noAntrianPasien: $scope.item.norec_apd });
                            // } else {
                            // alert('Status harus Selesai!!')
                            // }
                        } else {
                            toastr.error("Status Data Harus Selesai !!")
                            return;
                        }
                

            }

            $scope.saveambilobat = function () {
                        var nm = ''
                        if ($scope.item.namapengambil != undefined) {
                            nm = $scope.item.namapengambil
                        }
                        var strukresep = ""
                        if ($scope.item.noorder == $scope.item.noresep) { //resep yang input langsung tanpa order
                            strukresep = true
                        }
                        var objSave =
                        {
                            noorder: $scope.item.noorder,
                            statusorder: 4,
                            tglambil: moment($scope.item.tglambil).format('YYYY-MM-DD HH:mm'),
                            namapengambil: nm,
                            strukresep: strukresep
                        }
                        medifirstService.post('farmasi/save-status-resepelektonik', objSave).then(function (e) {
                            medifirstService.postLogging('Rubah Status Sudah Di Ambil Order Resep Elektronik', 'No Order Struk Order',
                                $scope.item.noorder, 'Rubah Status Sudah Di Ambil Order Resep Elektronik No Order: ' + $scope.item.noorder + '/ Noregistrasi : ' + $scope.item.noregistrasi).then(function (res) {
                                    $scope.refresh();
                                    $scope.popup.close()
                                })
                        });
                
            }


            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                // {
                //     "field": "tglorder",
                //     "title": "Tgl Order",
                //     "width" : "50px",
                // },
                // {
                //     "field": "noorder",
                //     "title": "No Order",
                //     "width" : "60px",
                // },
                {
                    field: "rke",
                    title: "Rke",
                    width: "50px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "100px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "100px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "70px",
                }
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];
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
            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Kemasan",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Satuan",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Aturan Pakai",
                            width: "100px"
                        },
                        {
                            field: "jumlah",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };

            $scope.cetakLabeKecil = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + Norec + '&view=' + stt + '&user=' + userLogin.userLogin, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakLabelRekap = function () {
                var Norec = $scope.item.norecresep;
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + Norec).then(function (dat) {
                        $scope.datas = dat.data;
                        var JmlPagi = 0;
                        var JmlSiang = 0;
                        var JmlSore = 0;
                        var JmlMalam = 0;
                        var stt = 'false'
                        if (confirm('View Label resep? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
                                            }
                                        }
                                        break;
                                    case "siang":
                                        if (element.siang != '-') {
                                            if (JmlSiang < 1) {
                                                JmlSiang = parseFloat(JmlSiang) + 1;
                                                // var stt = 'false'
                                                var isSiang = 'Siang';
                                                var client = new HttpClient();
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
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
                                                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + Norec + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) { });
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

            $scope.klikGridS = function (dataSelected) {
                $scope.dataSelected = dataSelected;
            }

            $scope.BatalVerifikasi = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                //     return;
                // }

                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                //     return;
                // } else {
                if ($scope.item.norecresep == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.noorder == $scope.item.noresep) {
                    toastr.error('Tidak bisa Unverifikasi')
                    return
                }

                var stt = 'false'
                if (confirm('Yakin Mau Batal Verifikasi Resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                    stt = 'false'
                }

                if (stt) {
                    medifirstService.get('farmasi/get-nostruk-kasir?norecresep=' + $scope.item.norecresep).then(function (x) {
                        var nostruk = x.data[0].nostruk

                        if (nostruk != null) {
                            toastr.error('Tidak bisa batal verif karena sudah diverif kasir, harap hubungi kasir terlebih dahulu!')
                            return
                        } else {
                            var objDelete = {
                                norec: $scope.item.norecresep,
                                norec_order: $scope.item.norec_order,
                            }
                            medifirstService.post('farmasi/batal-verifikasi-order-resep', objDelete).then(function (e) {
                                medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                                    $scope.refresh()
                                    medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep="
                                        + $scope.item.norecresep).then(function (data) {
                                            // medifirstService.postLogging('Batal Verifikasi Order Resep Elektronik', 'Norec Struk Order', $state.params.noRec, 'Batal Verifikasi Order Resep Elektronik').then(function (res) {
                                            // })
                                        })
                                    // LoadCache()
                                })
                            });
                        }
                    })
                }

                //##save Logging user

                //##end 
                // }
            }

            $scope.cetakNomorAntrian = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                var Norec = $scope.item.noresep;
                var Noreg = $scope.item.noregistrasi;
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var stt = 'false'
                    if (confirm('View Antrian Farmasi? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + Norec + '&noregistrasi=' + Noreg + '&view=' + stt, function (response) {
                        // aadc=response;
                    });
                }
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosa-pasien?noReg=" + noreg
                ).then(function (data) {
                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.item.diagnosa = diagnosa
                    }
                });
            }
            $scope.detailVerif = function () {
                if ($scope.item.norecresep == null)
                    return
                $scope.dataGridVerif = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                medifirstService.get("farmasi/get_detail-resep?norecResep=" + $scope.item.norecresep, true).then(function (e) {
                    // medifirstService.get('farmasi/get-daftar-detail-order?norec_apd=' + $scope.item.norec_apd).then(function (e) {
                    $scope.item.tglreseps = moment(new Date($scope.item.tglorder)).format('DD-MM-YYYY HH:mm')
                    $scope.item.noreseps = e.data.detailresep.noresep
                    $scope.item.dokters = $scope.item.namalengkap
                    $scope.item.statuss = $scope.item.statusorder
                    $scope.item.namaPasienVerif = $scope.item.namapasien
                    $scope.item.norm = $scope.item.nocm
                    medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noregistrasi).then(function (e) {
                        $scope.item.alamat = e.data.alamatlengkap
                    })
                    loadDiagnosa($scope.item.noregistrasi)

                    var dataGrids = e.data.pelayananPasien
                    for (let i = 0; i < dataGrids.length; i++) {
                        const element = dataGrids[i];
                        element.namaruangan = $scope.item.namaruangan
                        if (element.isreseppulang == '1') {
                            element.chekreseppulang = '✔'
                        } else {
                            element.chekreseppulang = '-'
                        }
                    }

                    $scope.dataGridVerif = new kendo.data.DataSource({
                        data: dataGrids,
                        pageSize: 10
                    });


                });
                $scope.popUpDetailVerif.center().open()
            }


            $scope.columnGridVerif = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    field: "rke",
                    title: "Rke",
                    width: "40px",
                },
                {
                    field: "jeniskemasan",
                    title: "Jenis Kemasan",
                    width: "100px",
                },
                {
                    field: "namaproduk",
                    title: "Deskripsi",
                    width: "200px"
                },
                {
                    field: "satuanstandar",
                    title: "Satuan",
                    width: "80px"
                },
                {
                    field: "aturanpakai",
                    title: "Aturan Pakai",
                    width: "100px"
                },
                {
                    field: "jumlah",
                    title: "Qty",
                    width: "60px"
                },
                // {
                //     "field": "namalengkap",
                //     "title": "Dokter",
                //     "width" : "100px"
                // },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "chekreseppulang",
                    "title": "Resep Pulang",
                    "width": "110px",
                },
                // {
                //     "field": "statusorder",
                //     "title": "Status",
                //     "width" : "70px",
                // }
            ];

            $scope.cetakLabelRekapRajal = function () {
                var userLogin = medifirstService.getPegawaiLogin();
                if ($scope.item.statusorder == 'Verifikasi' || $scope.item.statusorder == 'Packaging' || $scope.item.statusorder == 'Selesai' || $scope.item.statusorder == 'Sudah Di Ambil') {
                    var Norec = $scope.item.norecresep;
                    var stt = 'false'
                    if (confirm('View Label? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + Norec + '&view=' + stt + '&user=' + userLogin.namaLengkap, function (response) {
                        // aadc=response;
                    });
                }
            }

            $scope.cetakResepDokter = function(){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                if ($scope.item.noorder == null){
                    toastr.error("PILIH NO ORDER !!")
                    return;
                }else{
                    var stt = 1
                    if (confirm('Cetak Resep Dengan Qty Setengahnya ? ')) {
                        // Save it!
                        stt = "1/2";
                    } else {
                        // Do nothing!
                        stt = 1
                    }
                    window.open(config.baseApiBackend + "report/cetak-resep-dokter?noorder=" + $scope.item.noorder + "&norec=" + $scope.item.norecresep 
                    + "&nocm=" + $scope.item.nocm + '&kodeprofile=' + profile + '&qtybagi=' + stt);
                    // // window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                    //     + '&user=' + user + '&jenis=his', '_blank');
                }
            }
            $scope.cetakResepDokterRev = function(){
                if ($scope.item.statusorder != 'Menunggu') {
                    var local = JSON.parse(localStorage.getItem('profile'));
                    var profile = local.id;
                    if ($scope.item.noorder == null){
                        toastr.error("PILIH NO ORDER !!")
                        return;
                    }else{
                        var stt = 1
                        window.open(config.baseApiBackend + "report/cetak-resep-dokter-rev?noorder=" + $scope.item.noorder + "&norec=" + $scope.item.norecresep 
                        + "&nocm=" + $scope.item.nocm + '&kodeprofile=' + profile + '&qtybagi=' + stt);
                        // // window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                        //     + '&user=' + user + '&jenis=his', '_blank');
                    }
                } else {
                    toastr.error("Status Data Belum Diverifikasi !!")
                    return;
                }
            }
            $scope.grab = {
                lokasiPengirim :  medifirstService.getProfile().alamatlengkap,
                lokasiPengirimLat :  medifirstService.getProfile().lat,
                lokasiPengirimLng :  medifirstService.getProfile().lng,
                recipient : {},
                sender:{}
            }

            $scope.orderGrab = function(){
                if ($scope.item.statusorder != 'Selesai') {
                    toastr.error("Status Data Harus Selesai !!")
                    return;
                }
                if ($scope.item.isordergrab == true) {
                    toastr.error("Sudah Di Order !!")
                    return;
                }
                
                $scope.grab.sender.firstName = medifirstService.getPegawaiLogin().namaLengkap
                $scope.grab.sender.companyName = medifirstService.getProfile().namalengkap
                $scope.grab.recipient.firstName = $scope.item.namapasien
                $scope.grab.recipient.phone = $scope.item.nohp
                $scope.grab.recipient.address = $scope.item.alamatlengkap
                
                $scope.popupGrab.center().open()
                setMap()

            }
            function setMap(){
               const myLatLng = { lat: parseFloat($scope.grab.lokasiPengirimLat), lng: parseFloat($scope.grab.lokasiPengirimLng) };
               let map = new google.maps.Map(document.getElementById("map"), {
                    center: myLatLng,
                    zoom: 15,
                    mapTypeId: "roadmap",
                    mapTypeControl: false,
                });
                   
            }

            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            function initMap(map_lat,map_lng) {
                  
                   let myLatlng = { lat: parseFloat(map_lat) , lng: parseFloat(map_lng) };
                   let map = new google.maps.Map(document.getElementById("map"), {
                        center: myLatlng,
                        zoom: 15,
                        mapTypeId: "roadmap",
                        mapTypeControl: false,
                    });

                     var marker = new google.maps.Marker({
                        map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: myLatlng,
                        title: 'Penerima Berada Disini',
                    });
                    marker.addListener("click", toggleBounce);
             }

            $scope.lanjutOrderGrab = function(){
                if($scope.grab.sender.firstName == undefined || $scope.grab.sender.firstName == null || $scope.grab.sender.firstName == '-'){
                   toastr.error('Nama Pengirim tidak boleh Kosong')
                   return
                }
                if($scope.grab.recipient.address == undefined || $scope.grab.recipient.address == null){
                   toastr.error('Mohon isi alamat lengkap untuk tujuan pengiriman')
                   return
                }
                if($scope.grab.recipient.phone == undefined || $scope.grab.recipient.phone == null){
                   toastr.error('No HP Penerima harus di isi')
                   return
                }
                if($scope.grab.sender.phone == undefined || $scope.grab.sender.phone == null){
                   toastr.error('No HP Pengirim harus di isi')
                   return
                }
                if($scope.grab.sender.email == undefined || $scope.grab.sender.email == null){
                   toastr.error('Email Pengirim harus di isi')
                   return
                }
                if($scope.grab.recipient.email == undefined || $scope.grab.recipient.email == null){
                   toastr.error('Email Penerima harus di isi')
                   return
                }

                var client = new HttpClient();
                $scope.isShowOrder = true
                client.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.grab.recipient.address 
                        + '&key=AIzaSyDYhPXYjgCmT7ZO8jZigFm8iPXY_e16C8M', function (response) {
                   var res = JSON.parse(response)
                   if(res.results.length == 0){
                      toastr.error('Mohon isi alamat dengan lengkap ','Koordinat lokasi tidak ditemukan')
                      return
                   }else{
                        toastr.info('Lat : '  +  res.results[0].geometry.location.lat + ', Lng : '+ res.results[0].geometry.location.lng,'Koordinat ditemukan')
                   }
                   
                   $scope.grab.tujuanLat = res.results[0].geometry.location.lat;
                   $scope.grab.tujuanLong =  res.results[0].geometry.location.lng;
                   initMap( $scope.grab.tujuanLat ,$scope.grab.tujuanLong )

                   medifirstService.get("farmasi/get_detail-resep?norecResep=" + $scope.item.norecresep, true).then(function (zz) {
                        let packageDetail = []
                        let totalOrder = 0
                        for (var i = 0; i < zz.data.pelayananPasien.length; i++) {
                            const element = zz.data.pelayananPasien[i]
                            totalOrder = totalOrder + parseFloat(element.total)
                            packageDetail.push({
                                "name": element.namaproduk,
                                "description": 'Aturan Pakai :' + element.aturanpakai,
                                "quantity": element.jumlah,
                                "price": parseFloat(element.hargasatuan),
                                "dimensions": {
                                    "height": 0,
                                    "width": 0,
                                    "depth": 0,
                                    "weight": 0
                                }
                            })
                        }
                      
                       let json = {
                            "req": {
                                "merchantOrderID": $scope.item.noorder,
                                "serviceType": "INSTANT",
                                "paymentMethod": "CASHLESS",
                                "packages": packageDetail,
                                "origin": {
                                    "address": $scope.grab.lokasiPengirim,
                                    "coordinates": {
                                        "latitude": parseFloat($scope.grab.lokasiPengirimLat),
                                        "longitude": parseFloat($scope.grab.lokasiPengirimLng)
                                    }
                                },
                                "destination": {
                                    "address":$scope.grab.recipient.address,
                                    "coordinates": {
                                        "latitude": parseFloat($scope.grab.tujuanLat) ,
                                        "longitude": parseFloat($scope.grab.tujuanLong )
                                    }
                                },
                                "recipient": {
                                    "firstName": $scope.grab.recipient.firstName,
                                    "lastName": "",
                                    "email": $scope.grab.recipient.email != undefined ? $scope.grab.recipient.email :"",
                                    "phone": $scope.grab.recipient.phone != undefined ? $scope.grab.recipient.phone :"",
                                    "smsEnabled": true
                                },
                                "sender": {
                                    "firstName": $scope.grab.sender.firstName ,
                                    "companyName":  $scope.grab.sender.companyName ,
                                    "email": $scope.grab.sender.email != undefined ? $scope.grab.sender.email :"",
                                    "phone": $scope.grab.sender.phone != undefined ? $scope.grab.sender.phone :"",
                                    "smsEnabled": true
                                },
                                "orderId": parseFloat($scope.item.noorder),
                                "totalOrder": totalOrder
                            }
                        }
                        medifirstService.postApi('api/grab/delivery',json).then(function (e) {
                           if(e.data.deliveryID != undefined){
                               toastr.success('Sukses Order, status : '+e.data.status,'No Kirim : '+e.data.deliveryID) 
                               updateStatusGrab(e.data)
                              
                           }else if(e.data.message!=undefined){
                               toastr.error(e.data.message,'Error') 
                           }else{
                               toastr.error(e.data.arg,'Error') 
                           }
                          
                           $scope.isShowOrder = false
                        },function(error){
                            toastr.error('Terjadi Kesalahan ','Info')
                            $scope.isShowOrder = false
                        })
                    })
                });
// 
            }
            function updateStatusGrab(response){
                let json = {
                    'isordergrab' : true,
                    'statusordergrab' : response.status,
                    'norec_order' : $scope.item.norec_order,
                    'nokirimgrab' : response.deliveryID
                }
                medifirstService.post('farmasi/update-status-grabexpress',json).then(function(e){
                    $scope.cancelOrder()
                    $scope.refresh()

                })
            }
            $scope.cancelOrder = function(){
                $scope.grab = {
                    lokasiPengirim :  medifirstService.getProfile().alamatlengkap,
                    lokasiPengirimLat :  medifirstService.getProfile().lat,
                    lokasiPengirimLng :  medifirstService.getProfile().lng,
                    recipient : {},
                    sender:{}
                }
                $scope.popupGrab.close()
            }
            function saveAntrol(param,waktu){
                var data = {
                   "url": "antrean/updatewaktu",
                   "jenis": "antrean",
                   "method": "POST",
                   "data":                                                 
                   {
                      "kodebooking": param,
                      "taskid": waktu,//Waktu akhir farmasi/mulai buat obat
                      "waktu": new Date().getTime()  
                   }
               }
               medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (e) {})
            }
            //** BATAS SUCI */
        }
    ]);
});