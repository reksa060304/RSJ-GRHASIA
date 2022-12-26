define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PemungutanPenyetoranPajakCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 15;
            $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD');
            $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD');
            $scope.tglveriftopajak = undefined
            $scope.dataGridPPh = []
            $scope.dataGridPPN = []
            $scope.norecspj = ''
            $scope.nopajakpph=''
            $scope.nopajakppn=''
            $scope.norecpp=''
            $scope.norecpep=''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listJenisBukti = [
                { id: 1, jenisbukti: "UP" },
            ];

            

            $scope.listBulan = [
                { id: 1, bulan: "Januari" },
                { id: 2, bulan: "Februari" },
                { id: 3, bulan: "Maret" },
                { id: 4, bulan: "April" },
                { id: 5, bulan: "Mei" },
                { id: 6, bulan: "Juni" },
                { id: 7, bulan: "Juli" },
                { id: 8, bulan: "Agustus" },
                { id: 9, bulan: "September" },
                { id: 10, bulan: "Oktober" },
                { id: 11, bulan: "November" },
                { id: 12, bulan: "Desember" },
            ];

            $scope.dataGridPPh = new kendo.data.DataSource({
                data:  [],
                pageSize: 10,
                total: 0,
                group: $scope.group,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {
                        }
                    }
                },
                aggregate: [
                ]
            });

            $scope.dataGridPPN = new kendo.data.DataSource({
                data:  [],
                pageSize: 10,
                total: 0,
                group: $scope.group,
                serverPaging: false,
                schema: {
                    model: {
                        fields: {
                        }
                    }
                },
                aggregate: [
                ]
            });

            medifirstService.get("perencanaan/get-data-combo-pajak").then(function (e) {
                $scope.listJenisPajak = e.data.data
            })

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-spj-to-pajak?awal="+awal+"&akhir="+akhir).then(function (e) {
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: e.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: e.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    });
            }

            $scope.$watch('item.caridatapajak', function (newValue, oldValue) {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-spj-to-pajak?awal="+awal+"&akhir="+akhir+"&key="+$scope.item.caridatapajak).then(function (e) {
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: e.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: e.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    });
            });


            $scope.EntryPenyetoran = function(){
                //$scope.item.itemJenisBukti = { id: 1, jenisbukti: "UP" }
                medifirstService.get("perencanaan/get-pajak-udah-save?norec="+$scope.norecspj).then(function (e) {
                    if(e.data.data.length != 0){
                        $scope.item.tglPPh = moment(e.data.data[0].tglpph).format('YYYY-MM-DD');
                        $scope.item.tglPPn = moment(e.data.data[0].tglppn).format('YYYY-MM-DD');
                        $scope.item.jenispajak = {id: e.data.data[0].idpajak, jenispajak: e.data.data[0].jenispajak}
                        $scope.item.jumlahPPh = e.data.data[0].pph
                        $scope.item.jumlahPPn = e.data.data[0].ppn
                        $scope.item.jumlahPPhDinamis = e.data.data[0].pph
                        $scope.item.jumlahPPnDinamis = e.data.data[0].ppn
                        $scope.item.nopajak = e.data.data[0].nopajakpp
                        $scope.item.uraianpajak = e.data.data[0].uraianpajak
                        $scope.item.idbillppn = e.data.data[0].idbillppn
                        $scope.item.ntpnppn = e.data.data[0].ntpnppn
                        $scope.item.idbillpph = e.data.data[0].idbillpph
                        $scope.item.ntpnpph = e.data.data[0].ntpnpph
                    } else{
                        $scope.item.tglPPh = $scope.tglveriftopajak;
                        $scope.item.tglPPn = $scope.tglveriftopajak;
                        $scope.item.jenispajak = {id: 20, jenispajak: 'PPh : Pajak Penghasilan'}
                        $scope.item.nopajak = ''
                        $scope.norecspj = ''
                        
                    }
                })

                
                
                $scope.popupTambahPajak.center().open()
            }

            $scope.EntryPemungutan = function(){
                //$scope.item.itemJenisBukti = { id: 1, jenisbukti: "UP" }
                medifirstService.get("perencanaan/get-pajak-udah-save?norec="+$scope.norecspj).then(function (e) {
                    //console.log(e.data.data.length)
                    
                    if(e.data.pph.length != 0){
                        $scope.item.uraianpajak = e.data.pph[0].uraianpajak
                    } else if(e.data.pph.length != 0){
                        $scope.item.uraianpajak = e.data.ppn[0].uraianpajak
                    } else{
                        $scope.item.uraianpajak = ''
                    }

                    if(e.data.pph.length != 0){
                        $scope.dataGridPPh = new kendo.data.DataSource({
                            data:  e.data.pph,
                            pageSize: 10,
                            total: e.data.pph.length,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    } 
                    
                    if(e.data.ppn.length != 0){
                        $scope.dataGridPPN = new kendo.data.DataSource({
                            data:  e.data.ppn,
                            pageSize: 10,
                            total: e.data.ppn.length,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    } 
                    
                    if(e.data.pph.length == 0 && e.data.ppn.length == 0){
                        $scope.item.uraianpajak = ''
                        $scope.dataGridPPh = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            total: 0,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

                        $scope.dataGridPPN = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            total: 0,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    }
                })
                
                $scope.popupTambahPajak.center().open()
            }

            function FormLoad() {
                init()
            }
            

            $scope.$watch('item.itembulan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    medifirstService.get("perencanaan/get-spj-to-lpj?bulan="+$scope.item.itembulan.id+"&tahun="+moment($scope.now).format('YYYY')).then(function (e) {
                        
                        $scope.dataGridLPJ = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlahdibayarverif: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahdibayarverif', aggregate: 'sum' },
                            ]
                        });
                    });
                    
                }
            });

            $scope.$watch('item.jumlahPPh', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahPPhDinamis = 'Rp'+$scope.item.jumlahPPh
                }
            });

            $scope.$watch('item.jumlahPPn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahPPnDinamis = 'Rp'+$scope.item.jumlahPPn
                }
            });

            $scope.SavePajak = function () {

                var objSave = {
                    "norec": $scope.norecspj,
                    "uraianpajak": $scope.item.uraianPajak,
                    "nopajak": $scope.item.nopajak,
                    "pph": $scope.dataGridPPh.options.data,
                    "ppn": $scope.dataGridPPN.options.data,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-pajak', objSave).then(function (e) {
                    medifirstService.get("perencanaan/get-pajak-pph-ppn?norec="+$scope.norecspj).then(function (e) {
                        $scope.dataGridPemungutan = e.data.data
                        $scope.dataGridPenyetoran = e.data.data
                    });

                    console.log(e.data.result.nopajak)
                    $scope.item.nospjpemungutan = e.data.result.nopajak
                    $scope.item.nospjpenyetoran = e.data.results.nopajak
                    $scope.item.uraianspjp = e.data.result.uraianpajak
                    $scope.item.tglPPh = moment($scope.now).format('YYYY-MM-DD');
                    $scope.item.tglPPn = moment($scope.now).format('YYYY-MM-DD');
                    $scope.item.jenispajak = {id: 20, jenispajak: 'PPh : Pajak Penghasilan'}
                    $scope.item.jumlahPPh = 0
                    $scope.item.jumlahPPn = 0
                    $scope.item.idbillppn = e.data.result.idbillppn
                    $scope.item.ntpnppn = e.data.result.ntpnppn
                    $scope.item.idbillpph = e.data.result.idbillpph
                    $scope.item.ntpnpph = e.data.result.ntpnpph
                    $scope.item.jumlahPPhDinamis = 0
                    $scope.item.jumlahPPnDinamis = 0
                    $scope.item.nopajak = ''
                    $scope.item.uraianpajak = ''
                    $scope.item.idbillppn = ''
                    $scope.item.ntpnppn = ''
                    $scope.item.idbillpph = ''
                    $scope.item.ntpnpph = ''
                    $scope.norecpp = ''
                    $scope.norecpep = ''
                    $scope.nopajakppn = ''

                    $scope.dataGridPPh = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            total: 0,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

                        $scope.dataGridPPN = new kendo.data.DataSource({
                            data:  [],
                            pageSize: 10,
                            total: 0,
                            group: $scope.group,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });

                    $scope.popupTambahPajak.center().close()
                })

            }

            $scope.HapusPenyetoran = function () {
                var objSave = {
                    "norec": $scope.norecspj,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-pajak', objSave).then(function (e) {
                    $scope.item.nospjpemungutan = ''
                    $scope.item.nospjpenyetoran = ''
                })

            }

            $scope.$watch('item.idbillpph', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.idbillppn = $scope.item.idbillpph
                }
            });

            $scope.$watch('item.ntpnpph', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.ntpnppn = $scope.item.ntpnpph
                }
            });

            $scope.klikPPh = function (dataSelectedPPh) {
                if (dataSelectedPPh != undefined) {
                    console.log(dataSelectedPPh)
                    $scope.item.jenispajak = {id: dataSelectedPPh.objectjenispphfk, jenispajak: dataSelectedPPh.jenispph}
                    $scope.item.tglPPh = moment(dataSelectedPPh.tglpph).format('YYYY-MM-DD')
                    $scope.item.idbillpph = dataSelectedPPh.idbillpph
                    $scope.item.ntpnpph = dataSelectedPPh.ntpnpph
                    $scope.item.jumlahPPh = dataSelectedPPh.pph
                    $scope.norecpp = dataSelectedPPh.norecpp
                    $scope.norecpep = dataSelectedPPh.norecpep
                    $scope.nopajakpph = dataSelectedPPh.nopajakpph
                }
            }

            $scope.klikPPN = function (dataSelectedPPN) {
                if (dataSelectedPPN != undefined) {
                    console.log(dataSelectedPPN)
                    $scope.item.tglPPn = moment(dataSelectedPPN.tglppn).format('YYYY-MM-DD')
                    $scope.item.idbillppn = dataSelectedPPN.idbillppn
                    $scope.item.ntpnppn = dataSelectedPPN.ntpnppn
                    $scope.item.jumlahPPn = dataSelectedPPN.ppn
                    $scope.norecpp = dataSelectedPPN.norecpp
                    $scope.norecpep = dataSelectedPPN.norecpep
                    $scope.nopajakppn = dataSelectedPPN.nopajakppn
                }
            }

            $scope.TambahPPh = function () {

                console.log($scope.dataGridPPh);
                console.log($scope.dataGridPPN);
                if($scope.nopajakpph != ''){
                    for(var i =0; i<$scope.dataGridPPh.options.data.length; i++){
                        if($scope.dataGridPPh.options.data[i].nopajakpph == $scope.nopajakpph){
                            $scope.dataGridPPh.options.data[i].jenispph = $scope.item.jenispajak.jenispajak
                            $scope.dataGridPPh.options.data[i].objectjenispphfk = $scope.item.jenispajak.id
                            $scope.dataGridPPh.options.data[i].tglpph = moment($scope.item.tglPPh).format('YYYY-MM-DD')
                            $scope.dataGridPPh.options.data[i].idbillpph = $scope.item.idbillpph
                            $scope.dataGridPPh.options.data[i].ntpnpph = $scope.item.ntpnpph
                            $scope.dataGridPPh.options.data[i].pph = $scope.item.jumlahPPh
                            $scope.dataGridPPh.options.data[i].norecpp = $scope.norecpp
                            $scope.dataGridPPh.options.data[i].norecpep = $scope.norecpep
                        }
                    }

                    $scope.dataGridPPh = new kendo.data.DataSource({
                        data:  $scope.dataGridPPh.options.data,
                        pageSize: 10,
                        total: $scope.dataGridPPh.options.data.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                } else{
                    var objSavePPh = {
                        "jenispph": $scope.item.jenispajak.jenispajak,
                        "objectjenispphfk": $scope.item.jenispajak.id,
                        "tglpph": moment($scope.item.tglPPh).format('YYYY-MM-DD'),
                        "idbillpph": $scope.item.idbillpph,
                        "ntpnpph": $scope.item.ntpnpph,
                        "pph": $scope.item.jumlahPPh,
                        "norecpp": '',
                        "norecpep": '',
                        "nopajakpph": '',
                    }
                    console.log(objSavePPh);
                    
                    
    
                    $scope.dataGridPPh.options.data.push(objSavePPh)
    
                    $scope.dataGridPPh = new kendo.data.DataSource({
                        data:  $scope.dataGridPPh.options.data,
                        pageSize: 10,
                        total: $scope.dataGridPPh.options.data.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                }
                
                $scope.norecpp = ''
                $scope.norecpep = ''
                $scope.nopajakpph = ''
                
                // return
                
            }

            $scope.TambahPPN = function () {

                if($scope.nopajakppn != ''){
                    for(var i =0; i<$scope.dataGridPPN.options.data.length; i++){
                        if($scope.dataGridPPN.options.data[i].nopajakppn == $scope.nopajakppn){
                            $scope.dataGridPPN.options.data[i].tglppn = moment($scope.item.tglPPn).format('YYYY-MM-DD')
                            $scope.dataGridPPN.options.data[i].idbillppn = $scope.item.idbillppn
                            $scope.dataGridPPN.options.data[i].ntpnppn = $scope.item.ntpnppn
                            $scope.dataGridPPN.options.data[i].ppn = $scope.item.jumlahPPn
                            $scope.dataGridPPN.options.data[i].norecpp = $scope.norecpp
                            $scope.dataGridPPN.options.data[i].norecpep = $scope.norecpep
                        }
                    }

                    $scope.dataGridPPN = new kendo.data.DataSource({
                        data:  $scope.dataGridPPN.options.data,
                        pageSize: 10,
                        total: $scope.dataGridPPN.options.data.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                } else{
                    var objSavePPN = {
                        "jenisppn": 'PPN',
                        "tglppn": moment($scope.item.tglPPn).format('YYYY-MM-DD'),
                        "idbillppn": $scope.item.idbillppn,
                        "ntpnppn": $scope.item.ntpnppn,
                        "ppn": $scope.item.jumlahPPn,
                        "norecpp": '',
                        "norecpep": '',
                        "nopajakpph": '',
                        "nopajakppn": '',
                    }
                    console.log(objSavePPN);
    
                    $scope.dataGridPPN.options.data.push(objSavePPN)
    
                    $scope.dataGridPPN = new kendo.data.DataSource({
                        data:  $scope.dataGridPPN.options.data,
                        pageSize: 10,
                        total: $scope.dataGridPPN.options.data.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        },
                        aggregate: [
                        ]
                    });
                }
                
                $scope.norecpp = ''
                $scope.norecpep = ''
                $scope.nopajakppn = ''

                
                // return
                
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD');
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
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

            $scope.group = [
            ];

            $scope.columnGridPPh = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nopajakpph",
                        "title": "No PPh",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenispph",
                        "title": "Jenis PPh",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpph",
                        "title": "Tanggal PPh",
                        "width": "100px",
                    },
                    {
                        
                        "field": "idbillpph",
                        "title": "Id Billing",
                        "width": "100px",
                    },
                    {
                        
                        "field": "ntpnpph",
                        "title": "NTPN",
                        "width": "100px",
                    },
                    {
                        
                        "field": "pph",
                        "title": "Jumlah PPh",
                        "width": "100px",
                    }
                ]
            };

            $scope.columnGridPPN = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nopajakppn",
                        "title": "No PPN",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenisppn",
                        "title": "Jenis PPN",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglppn",
                        "title": "Tanggal PPN",
                        "width": "100px",
                    },
                    {
                        
                        "field": "idbillppn",
                        "title": "Id Billing",
                        "width": "100px",
                    },
                    {
                        
                        "field": "ntpnppn",
                        "title": "NTPN",
                        "width": "100px",
                    },
                    {
                        
                        "field": "ppn",
                        "title": "Jumlah PPN",
                        "width": "100px",
                    }
                ]
            };
            

            $scope.columnGridPemungutan = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "kode",
                        "title": "Kode",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglrealisasi",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                    }
                ]
            };


            $scope.columnGridPenyetoran = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "kode",
                        "title": "Kode",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglrealisasi",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                    }
                ]
            };

            $scope.columnGrid = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "command": [
                              {
                                 text: "Pilih",
                                 click: PilihSPJ,
                                 imageClass: "clinic fa",
                                 visible: function(dataItem) { return dataItem.nospp }
                              },
                          ],
                             title: "",
                             
                             width: "60px",
                             
                    },
                    {
                        
                        "field": "norealisasi",
                        "title": "Nomor SPJ",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "mataanggaran",
                        "title": "Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglverif",
                        "title": "Tgl Verif",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahdibayarverif",
                        "title": "Total",
                        "width": "100px",
                        aggregates: ["sum"],
                        template: "#: jumlahdibayarverif  #",
                        groupFooterTemplate: "#: data.jumlahdibayarverif.sum  #",
                        footerTemplate: "#: data.jumlahdibayarverif.sum  #"
                    }
                ]
            };

            function PilihSPJ(e) {
                e.preventDefault();
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                $scope.norecspj = dataItem.norec
                $scope.tglveriftopajak = moment(dataItem.tglrealisasi).format('YYYY-MM-DD HH:mm') 
                console.log($scope.tglveriftopajak)
                medifirstService.get("perencanaan/get-pajak-pph-ppn?norec="+dataItem.norec).then(function (e) {
                    $scope.dataGridPemungutan = e.data.data
                    $scope.dataGridPenyetoran = e.data.data


                    $scope.item.nospjpemungutan = e.data.data[0].nopajakpp
                    $scope.item.nospjpenyetoran = e.data.data[0].nopajakpep
                    if(e.data.data[0].uraianpajak != null){
                        $scope.item.uraianspjp = e.data.data[0].uraianpajak
                        $scope.item.uraianPajak = e.data.data[0].uraianpajak
                    } else{
                        $scope.item.uraianspjp = 'PPh dan PPn ' + e.data.data[0].uraian
                        $scope.item.uraianPajak = 'PPh dan PPn ' + e.data.data[0].uraian
                    }
                    
                    $scope.item.jumlahPPh = e.data.data[0].jumlah
                    $scope.item.jumlahPPhDinamis = 'Rp'+e.data.data[0].jumlah
                    $scope.item.jumlahPPn = e.data.data[1].jumlah
                    $scope.item.jumlahPPnDinamis = 'Rp'+e.data.data[1].jumlah
                });

            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});