define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanDetailPenerimaanKasirCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, DateHelper, medifirstService) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.listKasirMulti = [];
            $scope.item.listKasirMultis = [];
            Combo()

            function Combo() {
                var chacePeriode = cacheHelper.get('LaporanDetailPenerimaanKasirCtrl');
                if (chacePeriode != undefined) {
                    // var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglawal = new Date(chacePeriode[0]);
                    $scope.item.tglakhir = new Date(chacePeriode[1]);
                    // $scope.item.tglawals = new Date(chacePeriode[2]);
                    // $scope.item.tglakhirs = new Date(chacePeriode[3]);
                } else {
                    $scope.item.tglawal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglakhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    $scope.item.tglawals = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglakhirs = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    $scope.item.tglawalok = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglakhirok = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                }

                medifirstService.get("kasir/get-data-combo-kasir", true).then(function (dat) {
                    $scope.listKelompokLayanan = [
                        { id: 1, nama: 'Pendaftaran/Pemeriksaan' },
                        { id: 2, nama: 'Tindakan' },
                        { id: 3, nama: 'Farmasi' }
                    ]
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listKasir = dat.data.datakasir;
                    $scope.selectOptionsKasir = {
                        placeholder: "Pilih Kasir...",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,

                    };
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.CariData = function () {
                LoadData();
            }

            $scope.SearchData = function(){
                LoadData();
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var tempDepartemen = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemen = "&idDept=" + $scope.item.departement.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }

                var tempKelDokter = "";
                if ($scope.item.namaPegawai != undefined) {
                    tempKelDokter = "&dokter=" + $scope.item.namaPegawai.id;
                }

                var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
                }
                
                var tempNama = "";
                if ($scope.item.namaPasien != undefined) {
                  tempNama = "&namaPasien=" + $scope.item.namaPasien;
                }
        
                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                  tempNoReg = "&noReg=" + $scope.item.noReg;
                }

                var tempNoRm = "";
                if ($scope.item.noRm != undefined) {
                    tempNoRm = "&noRm=" + $scope.item.noRm;
                }

                var tempKelLayanan = "";
                if ($scope.item.Kellayanan != undefined) {
                    tempKelLayanan = "&KelLayanan=" + $scope.item.Kellayanan.id;
                }

                var tempsbm = "";
                if ($scope.item.nosbm != undefined) {
                    tempsbm = "&nosbm=" + $scope.item.nosbm;
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanDetailPenerimaanKasirCtrl', chacePeriode);

                var ttlALL = 0
                medifirstService.get("kasir/get-data-detail-lap-penerimaan-semua-kasir?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemen
                    + tempRuanganId
                    + tempKelDokter
                    + tempKelPasienId + tempNama + tempNoReg + tempNoRm + tempKelLayanan + tempsbm
                    + "&KasirArr=" + listKasir).then(function (data) {
                        $scope.isRouteLoading = false
                        $scope.dataPendapatanRuangan = new kendo.data.DataSource({
                            data: data.data,
                            // pageSize: 50,
                            total: data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },aggregate: [
								{ field: 'total', aggregate: 'sum' },
							]
                        });
                    })
            }

            function LoadDatas (){
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var tempNama = "";
                if ($scope.item.namaNonLayanan != undefined) {
                  tempNama = "&namaPasien=" + $scope.item.namaNonLayanan;
                }
        
                var tempNoReg = "";
                if ($scope.item.noTrans != undefined) {
                  tempNoReg = "&noTrans=" + $scope.item.noTrans;
                }

                var tempsbm = "";
                if ($scope.item.nosbm != undefined) {
                    tempsbm = "&nosbm=" + $scope.item.nosbm;
                }

                var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
                }

                var chacePeriode = {
                    2: tglAwal,
                    3: tglAkhir
                }
                cacheHelper.set('LaporanDetailPenerimaanKasirCtrl', chacePeriode);
                medifirstService.get("kasir/get-data-detail-lap-penerimaan-semua-kasir-non?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempNama + tempNoReg  + tempsbm
                    + "&KasirArr=" + listKasir).then(function (data) {
                        $scope.isRouteLoading = false
                        $scope.dataPendapatan = new kendo.data.DataSource({
                            data: data.data,
                            // pageSize: 50,
                            total: data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },aggregate: [
								{ field: 'total', aggregate: 'sum' },
							]
                        });
                    })
            }

            function LoadDataOK (){
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawalok).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhirok).format('YYYY-MM-DD HH:mm');
                var tempNama = "";
                if ($scope.item.namaNonLayanan != undefined) {
                  tempNama = "&namaPasien=" + $scope.item.namaNonLayanan;
                }
        
                var tempNoReg = "";
                if ($scope.item.noTrans != undefined) {
                  tempNoReg = "&noTrans=" + $scope.item.noTrans;
                }

                var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
                }

                var chacePeriode = {
                    4: tglAwal,
                    5: tglAkhir
                }
                cacheHelper.set('LaporanDetailPenerimaanKasirCtrl', chacePeriode);
                medifirstService.get("kasir/get-data-detail-lap-penerimaan-semua-kasir-ok?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempNama + tempNoReg 
                    + "&KasirArr=" + listKasir).then(function (data) {
                        $scope.isRouteLoading = false
                        $scope.dataPendapatanOK = new kendo.data.DataSource({
                            data: data.data,
                            // pageSize: 50,
                            total: data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        total: { type: "number" }
                                    }
                                }
                            },aggregate: [
								{ field: 'total', aggregate: 'sum' },
							]
                        });
                    })
            }

            $scope.CariDataS = function(){
                LoadDatas ();
            }

            $scope.SearchDataS = function(){
                LoadDatas ();
            }

            $scope.CariDataOK = function(){
                LoadDataOK ();
            }

            $scope.SearchDataOk = function(){
                LoadDataOK ();
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                ////debugger
            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnPendapatanRuangan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Detail Penerimaan Kasir Layanan" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                        "width": "110px",

                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>",
                        "width": "110px",

                    },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "110px",

                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "80px",

                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "200px",

                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",

                    },
                    {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "200px",

                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "120px",

                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Layanan",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Tindakan",
                        "width": "200px",
                    },
                    {
                        "field": "harga",
                        "title": "Harga",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: harga #','')}}</span>",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "50px",
                        groupFooterTemplate: "Jumlah",
						footerTemplate: "Total Penerimaan",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
						footerTemplate: "#: data.total.sum #",
						footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
						footerAttributes: { style: "text-align: right;" }
                    },                    
                    {
                        "field": "nomorverif",
                        "title": "No Verifikasi",
                        "width": "100px",                        
                    },
                    {
                        "field": "nosbm",
                        "title": "No Bayar",
                        "width": "100px",                        
                    },
                    {
                        "field": "kasir",
                        "title": "Kasir",
                        "width": "100px",                        
                    }
                ],
            };

            $scope.columnPendapatan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Detail Penerimaan Kasir Non Layanan" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                        "width": "110px",

                    },                    
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "200px",

                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",

                    },               
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "120px",

                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Layanan",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Tindakan",
                        "width": "200px",
                    },
                    {
                        "field": "harga",
                        "title": "Harga",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: harga #','')}}</span>",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "50px",
                        groupFooterTemplate: "Jumlah",
						footerTemplate: "Total Penerimaan",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
						footerTemplate: "#: data.total.sum #",
						footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
						footerAttributes: { style: "text-align: right;" }
                    },                                       
                    {
                        "field": "nosbm",
                        "title": "No Bayar",
                        "width": "100px",                        
                    },
                    {
                        "field": "kasir",
                        "title": "Kasir",
                        "width": "100px",                        
                    }
                ],
            };

            $scope.columnPendapatanOK = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Detail Penerimaan Kasir Obat Kronis" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                        "width": "110px",

                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>",
                        "width": "110px",

                    },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "110px",

                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "80px",

                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "200px",

                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",

                    },                                       
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "120px",

                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Layanan",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },                    
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
                        aggregates: ["sum"],
						footerTemplate: "#: data.total.sum #",
						footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.total.sum #', 'Rp.')}}</span>",
						footerAttributes: { style: "text-align: right;" }
                    },                    
                    {
                        "field": "nomorverif",
                        "title": "No Verifikasi",
                        "width": "100px",                        
                    },
                    {
                        "field": "nosbm",
                        "title": "No Bayar",
                        "width": "100px",                        
                    },
                    {
                        "field": "kasir",
                        "title": "Kasir",
                        "width": "100px",                        
                    }
                ],
            };


            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariData();
            }


            //--            
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
            //sdm service hanya sementara, nanti harus diganti pake service kasir !!

            // ManageSdm.getItem("service/list-generic/?view=Ruangan&select=id,reportDisplay").then(function (dat) {
            //     $scope.listRuangan = dat.data;
            // });

            // ManageSdm.getItem("service/list-generic/?view=KelompokPasien&select=*").then(function (dat) {
            //     $scope.listPasien = dat.data;
            // });


            $scope.tglPelayanan = $scope.item.pelayanan;
            $scope.dokter = $scope.item.namaPegawai;

            $scope.listDataFormat = [

                {
                    "id": 1, "format": "pdf"
                },
                {
                    "id": 2, "format": "xls"
                }

            ]

            //debugger
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawaiLogin();


        }
    ]);
});