define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LPJCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.hidelpj = false
            $scope.noreclpj = ''
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

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listAsalProduk = e.data.asalproduk
            });

            function init() {
                $scope.isRouteLoading = true;

                var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
                let thun = tahun.toString();
                let bul=bulan.toString();
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-lpj?bulan="+bul+"&tahun="+thun).then(function (e) {
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


            $scope.TambahLPJ = function(){
                $scope.hidelpj = false
                $scope.noreclpj = ''
                $scope.item.itemJenisBukti = { id: 1, jenisbukti: "UP" }
                $scope.item.tglLPJ = moment($scope.now).format('YYYY-MM-DD');
                $scope.dataGridLPJ = []
                $scope.item.itembulan = undefined
                $scope.item.keteranganLPJ = ''
                $scope.item.nolpj = ''
                $scope.dataGridLPJ = {}
                $scope.popupTambahLPJ.center().open()
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

            $scope.SaveLPJ = function () {

                if($scope.noreclpj == ''){
                    var objSave = {
                        "norec": $scope.noreclpj,
                        "periode": $scope.item.itembulan.bulan,
                        "jenis_bukti": $scope.item.itemJenisBukti.jenisbukti,
                        "tgllpj": $scope.item.tglLPJ,
                        "keterangan": $scope.item.keteranganLPJ,
                        "nomor": $scope.item.nolpj,
                        "bulan": $scope.item.itembulan.id,
                        "objectasalprodukfk": $scope.item.sumberDanaLPJ.id,
                        "tahun": moment($scope.now).format('YYYY'),
                    }
                } else if($scope.noreclpj != ''){
                    var objSave = {
                        "norec": $scope.noreclpj,
                        "keterangan": $scope.item.keteranganLPJ,
                    }
                }
                
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-lpj', objSave).then(function (e) {
                    $scope.dataGridLPJ = {}
                    $scope.popupTambahLPJ.center().close()
                    init();
                })

            }

            $scope.HapusLPJ = function () {
                var objSave = {
                    "norec": $scope.dataSelected.norec,
                }
                
                console.log($scope.dataSelected);
                // return
                medifirstService.post('perencanaan/delete-lpj', objSave).then(function (e) {
                    init();
                })

            }

            $scope.EditLPJ = function(){
                $scope.hidelpj = true
                console.log($scope.dataSelected)
                $scope.noreclpj = $scope.dataSelected.norec
                $scope.item.keteranganLPJ = $scope.dataSelected.keterangan
                $scope.popupTambahLPJ.center().open()
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
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
            

            $scope.columnGrid = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "nolpj",
                        "title": "Nomor LPJ",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenis_bukti",
                        "title": "Jenis Bukti",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tgllpj",
                        "title": "Tanggal LPJ",
                        "width": "100px",
                    },
                    {
                        
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "periode",
                        "title": "Periode LPJ",
                        "width": "100px",
                    },
                    {
                        
                        "field": "total",
                        "title": "Total LPJ",
                        "width": "100px",
                    }
                ]
            };

            $scope.columnGridLPJ = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
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
            $scope.columnGridLPJS = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [{

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


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            $scope.columnGridLPJS = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [{

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
            $scope.klikGrid = function(e){
                medifirstService.get("perencanaan/get-spj-to-lpjs?bulan=" + moment(e.tgllpj).format('MM') + "&tahun=" + moment(e.tgllpj).format('YYYY')).then(function (e) {

                    $scope.dataGridLPJS = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 10,
                        total: e.data.data.length,
                        group: $scope.group,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jumlahdibayarverif: {
                                        type: "number"
                                    },
                                }
                            }
                        },
                        aggregate: [{
                            field: 'jumlahdibayarverif',
                            aggregate: 'sum'
                        }, ]
                    });
                });
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});