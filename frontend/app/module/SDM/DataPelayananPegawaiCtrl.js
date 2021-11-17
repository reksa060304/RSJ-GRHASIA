define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DataPelayananPegawaiCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.listDokterMulti = [];
            FormLoad();
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

            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');                                
                $scope.pegawai = medifirstService.getPegawai();
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listStatus = dataCombo.statuspegawai;
                    $scope.listJenisPegawai = dataCombo.jenispegawai;
                    $scope.listKategory = dataCombo.kategorypegawai;
                    $scope.listJenisPetPelaksana = dataCombo.jenispetugaspe;
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {                    
                    $scope.listDokters = data;
                    $scope.selectOptionsDokter = {
                        placeholder: "Pilih Petugas Pelaksana",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
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
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');
            
                var jenisPetugasPe = "";
                if ($scope.item.JenisPetPelaksana != undefined) {
                    jenisPetugasPe = "jenisPetugasPe=" + $scope.item.JenisPetPelaksana.id;
                }
                
                var listDokterPemeriksa = ""
				if ($scope.listDokterMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.listDokterMulti.length - 1; i >= 0; i--) {

						var c = $scope.listDokterMulti[i].id
						b = "," + c
						a = a + b
					}
					listDokterPemeriksa = a.slice(1, a.length)
				}

                medifirstService.get("sdm/get-datapelayanan-pegawai?tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir
                + jenisPetugasPe + "&pgkArr="+ listDokterPemeriksa).then(function (data) {
                        $scope.isLoadingData = false;                        
                        var datas = data.data.data;
                        for (let i = 0; i < datas.length; i++) {
                            const element = datas[i];
                            element.no = i + 1;
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            // group: $scope.group,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });                
                });
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
            
            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DataPelayananPegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Data Pelayanan Pegawai",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                        "template": "<span class='style-left'>#: no #</span>"
                    },
                    {                       
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "100px",      
                        "template": "<span class='style-right'>{{formatTanggal('#: tglregistrasi #', '')}}</span>"                  
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Reg",
                        "width": "100px",                      
                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "100px",                        
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        // "template": "<span class='style-left'>#: ruangan #</span>"
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe",
                        "width": "100px",
                        "template": "<span class='style-left'>#: kelompokpasien #</span>"
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Layanan",
                        "width": "100px",
                        "template": "<span class='style-left'>#: jenisproduk #</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "220px",
                        "template": "<span class='style-left'>#: namaproduk #</span>"
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "80px",
                        "template": "<span class='style-right'>#: jumlah #</span>"
                    },                    
                    {
                        "field": "hargajual",
                        "title": "Harga",
                        "width": "150px",
                        "template": "<span class='style-right'>#: hargajual #</span>"
                    },
                    {
                        "field": "jenispelaksana",
                        "title": "Jenis Pelaksana",
                        "width": "120px",
                        "template": "<span class='style-left'>#: jenispelaksana #</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pelaksana",
                        "width": "180px",
                        "template": "<span class='style-left'>#: namalengkap #</span>"
                    },
                    // {
                    //     "field": "total",
                    //     "title": "Total",
                    //     "width": "150px",
                    //     "template": "<span class='style-right'>#: total #</span>"
                    // }
                ]
            };

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    // dataItem.details[i].statCheckbox = false;
                    dataItem.details[i].no = i + 1
                }               
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [                       
                        {
                            "field": "no",
                            "title": "No",
                            "width": "25px",
                        },
                        {
                            "field": "komponenharga",
                            "title": "Komponen Harga",
                            "width": "120px",
                        },                    
                        {
                            "field": "hargasatuan",
                            "title": "Harga",
                            "width": "100px",
                            "template": "<span class='style-right'>#: hargasatuan #</span>"
                        }                        
                    ]
                }
            };

            //** BATAS SUCI */
        }
    ]);
});