define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanHutangCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = '2022-01-01';
            $scope.item.tglakhir = $scope.now;
            $scope.norectelemedicine = ''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            medifirstService.getPart("akuntansi/get-data-combo-coa-part", true, true, 20).then(function (data) {
                $scope.listAkun = data;
            })

            medifirstService.get("registrasi/get-combo-perjanjian").then(function (e) {
                $scope.listRuangan = e.data.ruanganrajal
            })

            medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
                
                $scope.listKelompokPasien = data.data.kelompokpasien;
                $scope.listDokter2 = data.data.dokter;
            });

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("perencanaan/get-telemedicine?awal="+awal+"&akhir="+akhir).then(function (e) {
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


            $scope.TambahJasgir = function(){
                $scope.norecjasgir = ''
                $scope.item.nojasgir = ''
                $scope.item.uraianjasagiro = ''
                $scope.item.jumlahpemasukan = 0
                $scope.item.jumlahpengeluaran = 0
                $scope.item.tglpemasukan = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglpengeluaran = moment($scope.now).format('YYYY-MM-DD');
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                $scope.norectelemedicine = $scope.dataSelected.norec
                $scope.item.kdreservasi = $scope.dataSelected.kdreservasi
                $scope.item.keteranganjurnal = $scope.dataSelected.keteranganjurnal
                $scope.item.norm = $scope.dataSelected.norm
                $scope.item.tglreservasi = $scope.dataSelected.tglreservasi
                $scope.item.namapasien = $scope.dataSelected.namapasien
                $scope.item.jam = $scope.dataSelected.jam
                $scope.item.nohp = $scope.dataSelected.nohp
                $scope.item.nominal = $scope.dataSelected.nominal
                $scope.item.namaruangan = {id: $scope.dataSelected.idruangan, namaruangan: $scope.dataSelected.namaruangan}
                $scope.item.dokter = {id: $scope.dataSelected.idpegawai, namalengkap: $scope.dataSelected.namalengkap}
                $scope.item.kelompokpasien = {id: $scope.dataSelected.idkelompok, kelompokpasien: $scope.dataSelected.kelompokpasien}
                $scope.popupTambahJasgir.center().open()
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


            $scope.$watch('item.jumlahpemasukan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahpengeluaran = $scope.item.jumlahpemasukan
                }
            });

            $scope.SaveJasgir = function () {
                var objSave = {
                    "norec": $scope.norectelemedicine,
                    "kdreservasi": $scope.item.kdreservasi,
                    "norm": $scope.item.norm,
                    "tglreservasi": moment($scope.item.tglreservasi).format('YYYY-MM-DD'),
                    "jam": $scope.item.jam,
                    "namapasien": $scope.item.namapasien,
                    "objectruanganfk": $scope.item.namaruangan.id,
                    "objectkelompokpasienfk": $scope.item.kelompokpasien.id,
                    "objectdokterfk": $scope.item.dokter.id,
                    "nohp": $scope.item.nohp,
                    "nominal": $scope.item.nominal,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-telemedicine', objSave).then(function (e) {
                    $scope.popupTambahJasgir.center().close()
                    init();
                })

            }

            $scope.HapusJasgir = function () {
                var objSave = {
                    "norec": $scope.dataSelected.norec,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-telemedicine', objSave).then(function (e) {
                    init();
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
            

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "PasienTelemedicine.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:J1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Pasien Telemedicine",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },             
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "kdreservasi",
                        "title": "Kode Reservasi",
                        "width": "100px",
                    },
                    {
                        
                        "field": "norm",
                        "title": "No Rekam Medis",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglreservasi",
                        "title": "Tgl Reservasi",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jam",
                        "title": "Jam",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kelompokpasien",
                        "title": "Tipe",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nohp",
                        "title": "No Telepon",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nominal",
                        "title": "Nominal",
                        "width": "100px",
                    },
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});