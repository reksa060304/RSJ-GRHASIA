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
            $scope.norecspj = ''
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
                    if(e.data.data.length != 0){
                        $scope.item.tglPPh = moment(e.data.data[0].tglpph).format('YYYY-MM-DD');
                        $scope.item.tglPPn = moment(e.data.data[0].tglppn).format('YYYY-MM-DD');
                        $scope.item.jenispajak = {id: e.data.data[0].idpajak, jenispajak: e.data.data[0].jenispajak}
                        $scope.item.jumlahPPh = e.data.data[0].pph
                        $scope.item.jumlahPPn = e.data.data[0].ppn
                        $scope.item.jumlahPPhDinamis = e.data.data[0].pph
                        $scope.item.jumlahPPnDinamis = e.data.data[0].ppn
                        $scope.item.nopajak = e.data.data[0].nopajakpep
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

                var idbillppn = null;
                if($scope.item.idbillppn != undefined){
                    idbillppn = $scope.item.idbillppn
                }

                var ntpnppn = null;
                if($scope.item.ntpnppn != undefined){
                    ntpnppn = $scope.item.ntpnppn
                }

                var idbillpph = null;
                if($scope.item.idbillpph != undefined){
                    idbillpph = $scope.item.idbillpph
                }

                var ntpnpph = null;
                if($scope.item.ntpnpph != undefined){
                    ntpnpph = $scope.item.ntpnpph
                }

                var objSave = {
                    "norec": $scope.norecspj,
                    "uraianpajak": $scope.item.uraianPajak,
                    "nopajak": $scope.item.nopajak,
                    "jenispph": $scope.item.jenispajak.id,
                    "pph": $scope.item.jumlahPPh,
                    "ppn": $scope.item.jumlahPPn,
                    "idbillppn": idbillppn,
                    "ntpnppn": ntpnppn,
                    "idbillpph": idbillpph,
                    "ntpnpph": ntpnpph,
                    "tglpph": moment($scope.item.tglPPh).format('YYYY-MM-DD'),
                    "tglppn": moment($scope.item.tglPPn).format('YYYY-MM-DD'),
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-pajak', objSave).then(function (e) {
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