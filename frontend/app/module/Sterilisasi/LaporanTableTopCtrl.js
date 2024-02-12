define(['initialize','Configuration'], function (initialize,config) {
    'use strict';

    initialize.controller('LaporanTableTopCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
            
            $scope.isRouteLoading = false;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));

            $scope.item = {};
            $scope.cari = {};
            $scope.now = new Date();
            // var norec = '';
            // $scope.monthUngkul = {
            //     start: "year",
            //     depth: "year"
            // }

            // $scope.yearUngkul = {
            //     start: "decade",
            //     depth: "decade"
            // }

            // $scope.monthSelectorOptions = function () {
            //     return {
            //         start: "year",
            //         depth: "year",
            //         format: "MMMM yyyy",
            //     }
            // }

            // $scope.statusDataSource = [
            //     { id: 1, keterangan: 'Ndet' },
            //     { id: 2, keterangan: 'Det' },
            // ];

            LoadCombo();
            function LoadCombo() {
                var chacePeriode = cacheHelper.get('LaporanTableTopCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                    // if (chacePeriode[2] != undefined) {
                    //     $scope.item.pegawai = chacePeriode[2]
                    // }

                    // if (chacePeriode[3] != undefined) {
                    //     $scope.item.profesor = chacePeriode[3]
                    // }

                    // if (chacePeriode[4] != undefined) {
                    //     $scope.item.bangsal = chacePeriode[4]
                    // }

                    // if (chacePeriode[5] != undefined) {
                    //     $scope.item.indikasi = chacePeriode[5]
                    // }

                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    
                }
               
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuang = data;
                });

                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data
                });

                medifirstService.getPart("sysadmin/general/get-datacombo-kelompok-pasien", true, true, 20).then(function (data) {
                    $scope.listKelompokPasien = data;
                });
                
                $scope.item.bulan = moment($scope.now).format('MMMM');
                $scope.item.tanggalLaporanTableTop = moment(new Date()).format('YYYY-MM-DD HH:mm'); 
                $scope.item.tanggaltulisresep = moment(new Date()).format('YYYY-MM-DD HH:mm'); 

            }
           
            
            
            $scope.optionGridMaster = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Table Top Matachana " + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        "field": "nomor",
                        "title": "No",
                        "width": "10px"
                    },
                    {
                        "field": "tglinput",
                        "title": "Tanggal",
                        "width": "60px"
                    },
                    {
                        "field": "suhu",
                        "title": "Suhu",
                        "width": "25px"
                    },
                    {
                        "field": "loadke",
                        "title": "Load ke",
                        "width": "25px",
                    },
                    {
                        "field": "waktu",
                        "title": "Waktu(menit)",
                        "width": "25px",
                    },
                    {
                        "field": "asalalkes",
                        "title": "Asal Alkes",
                        "width": "70px",
                    },
                    {
                        "field": "namaalkes",
                        "title": "Nama Alkes",
                        "width": "70px",
                    },
                    {
                        "field": "petugas",
                        "title": "Petugas",
                        "width": "50px",
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "40px",
                    },
                ],
            };

            $scope.cariFilter = function () {
                init()
            }      

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
       
                medifirstService.get('sterilisasi/laporan-table-top-matachana?' + "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        
                        $scope.dataSource = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema:{
                              model:{
                                fields:{
                                  nilaiketerangan: {type: "number"},
                                  namalengkap: {type: "string"}
                                }
                              }
                            },
                
                        });
                        var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,                        
                    }
                    
                    cacheHelper.set('LaporanTableTopCtrl', chacePeriode);
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            function loadData() {
                // $scope.item = {}
                $scope.isRouteLoading = true;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));               
               medifirstService.get('sterilisasi/laporan-table-top-matachana?' + "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir
                    ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                            }
                        $scope.bambang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    },function (error) {
                    $scope.isRouteLoading = false;
                    var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    throw error;
                })
                    
            }

            // $scope.Tambah = function () {
            //     // $scope.item = {}
            //     $scope.isRouteLoading = false;
            //     $scope.isEdit = false
            //     $scope.disabledText = false
            //     $scope.dialogPopup.center().open()
                
            //     var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
            //     var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
            // }

            // $scope.clickedPopup = function () {
            //     $scope.item = {}
            //     $scope.dialogPopup.close();
            // }
            // $scope.Batal = function () {
            //     // $scope.item = {}
            //     $scope.dialogPopup.close();
            // }
            // $scope.Batal2 = function () {
            //     $scope.item = {}
            //     $scope.dialogPopup2.close();
            // }
            // $scope.lihatDetail = function () {
            //     init();
            // }

            // tambah baris copy resep
            $scope.dataRows = [];
            $scope.addRow = function() {
                $scope.dataRows.push({
                    namaproduk: "",
                    status: "",
                    qty: "",
                });
            };
            // $scope.removeRow = function(index) {
            //     $scope.dataRows.splice(index, 1);
            // };

            // $scope.Save = function () {
            //     $scope.isRouteLoading = true;
            //     var listRawRequired = [];

            //     var isValid = medifirstService.setValidation($scope, listRawRequired);
            //     if (isValid.status) {
            //         var dataProduk = [];

            //         $scope.dataRows.forEach(function (row) {
            //             var produk = {
            //                 namaobat: row.namaobat || null,
            //                 statusobat: row.statusobat || null, 
            //                 qty: row.qty || null
            //             };
            //             dataProduk.push(produk);
            //         });

            //         var data = {
            //             "norec": norec,
            //             "tanggalLaporanTableTop": moment($scope.item.tanggalLaporanTableTop).format('YYYY-MM-DD HH:mm'),
            //             "tanggaltulisresep": moment($scope.item.tanggaltulisresep).format('YYYY-MM-DD HH:mm'),
            //             "dokterfk": $scope.item.dokterfk != undefined ? $scope.item.dokterfk.value : 0,
            //             "ruanganfk": $scope.item.ruanganfk != undefined ? $scope.item.ruanganfk.value : 0,
            //             "statuspasienfk": $scope.item.statuspasienfk != undefined ? $scope.item.statuspasienfk.value : 0,
            //             "catatan": $scope.item.catatan != undefined ? $scope.item.catatan : '',
            //             "namapasien": $scope.item.namapasien != undefined ? $scope.item.namapasien : '',
            //             "norm": $scope.item.norm != undefined ? $scope.item.norm : '',
            //             "beratbadan": $scope.item.beratbadan != undefined ? $scope.item.beratbadan : '',
            //             "alergi": $scope.item.alergi != undefined ? $scope.item.alergi : '',
            //             "detailResep": dataProduk
            //         };

            //         var objSave = {
            //             data: data,
            //         };

            //         medifirstService.post("farmasi/copy-resep", objSave).then(function (e) {
            //             console.log('cek',$scope.statusDataSource);
            //             init();
            //             loadData();
            //         });
            //     } else {
            //         medifirstService.showMessages(isValid.messages);
            //     }
            //     $scope.isRouteLoading = false;
            //     $scope.dialogPopup.center().close();
            //     init();
            //     loadData();
            // };

            $scope.resetFilter = function () {
                $scope.cari = {};
                init()
            }
            
            // $scope.klikGrid = function (current) {
            //     toastr.info(current.noresep + " Terpilih");
            //     $scope.current = current;
            //     console.log(JSON.stringify($scope.current));
            // }

            // $scope.hapus = function () {
            //     if ($scope.dataSelect == undefined) {
            //         toastr.error('Pilih data dulu')
            //         return
            //     }
            //     var data = {
            //         "noresep":$scope.dataSelect.noresep,
            //     }
            //     medifirstService.post('farmasi/hapus-copy-resep',data).then(function (e) {
            //         init();
            //         loadData();
            //         $scope.item = {}
            //     });
            // }     

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.cetakLaporanTableTop = function(){
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                if ($scope.dataSelect == null){
                    toastr.error("Pilih data terlebih dahulu !!")
                    return;
                }else{
                    window.open(config.baseApiBackend + "report/cetak-copy-resep?noresep=" + $scope.dataSelect.noresep + "&kdprofile=" + profile);
                }
            }           

            //** BATAS SUCI */
        }
    ])
})