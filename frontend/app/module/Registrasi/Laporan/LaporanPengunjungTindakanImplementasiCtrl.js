define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPengunjungTindakanImplementasiCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, DateHelper, medifirstService) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.listKasirMulti = [];
            $scope.item.listKasirMultis = [];
            $scope.item.TindakanMulti = []
            // $scope.item.isTglSBM = true;
            // $("#isTglSBM").load(function(){
            //     $(this).checked = true;
            // });
            //document.getElementById("isTglSBM").checked = true;
            //$("#grid tbody input:checkbox").prop("checked", true);
            //$("#isTglSBM").kendoCheckBox();
            // $("#isTglSBM").prop("checked",true);
            Combo()

            $scope.item.periodeBerdasarkan = 1;


            function Combo() {
                medifirstService.get("emr/get-datacombo-part-diagnosa-keperawatan" ).then(function (data) {
                    console.log(data);
                    $scope.listDiagnosaKep = data.data
                })
                // medifirstService.get('sysadmin/general/get-produk-nonobat').then(function (data) {
                //     console.log(data.data);
                //     $scope.listTindakan = data.data
                //     $scope.selectOptionsRuangan = {
                //         placeholder: "Pilih Tindakan...",
                //         dataTextField: "namaproduk",
                //         dataValueField: "id",
                //         // dataSource:{
                //         //     data: $scope.listRuangan
                //         // },
                //         autoBind: true,

                //     };
                // })
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

                medifirstService.getPart("sysadmin/general/get-combo-carabayar", true, true, 20).then(function (data) {
                    $scope.listCarabayar = data;
                });
                $scope.getintervensi = function(){
                    $scope.listLabelIntervensi = $scope.item.diagnosaKep.details
                }
                $scope.getImplementasi = function(){
                    $scope.listImplementasi = $scope.item.labelintervensi.details
                }
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.CariData = function () {
                LoadData();
            }

            $scope.SearchData = function () {
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

                var tempDiagnosaKeperawatan = "";
                if ($scope.item.diagnosaKep != undefined) {
                    tempDiagnosaKeperawatan = "&diagnosakeperawatan=" + $scope.item.diagnosaKep.id;
                }

                var tempLabelIntervensi = "";
                if ($scope.item.labelintervensi != undefined) {
                    tempLabelIntervensi = "&intervensi=" + $scope.item.labelintervensi.id;
                }
                var tempImplementasi = "";
                if ($scope.item.implementasi != undefined) {
                    tempImplementasi = "&implementasi=" + $scope.item.implementasi.id;
                }
                var tempKelDokter = "";
                if ($scope.item.namaPegawai != undefined) {
                    tempKelDokter = "&dokter=" + $scope.item.namaPegawai.id;
                }

                // var listKasir = ""
                // if ($scope.item.listKasirMulti.length != 0) {
                //     var a = ""
                //     var b = ""
                //     for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {

                //         var c = $scope.item.listKasirMulti[i].id
                //         b = "," + c
                //         a = a + b
                //     }
                //     listKasir = a.slice(1, a.length)
                // }

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

                // var tempKelLayanan = "";
                // if ($scope.item.Kellayanan != undefined) {
                //     tempKelLayanan = "&KelLayanan=" + $scope.item.Kellayanan.id;
                // }

                // var tempsbm = "";
                // if ($scope.item.nosbm != undefined) {
                //     tempsbm = "&nosbm=" + $scope.item.nosbm;
                // }

                // var tempproduk = "";
                // if ($scope.item.namaproduk != undefined) {
                //     tempproduk = "&namaproduk=" + $scope.item.namaproduk;
                // }

                // var tempCarabayar = "";
                // if ($scope.item.caraBayar != undefined) {
                //     tempCarabayar = "&carabayar=" + $scope.item.caraBayar.id;
                // }

                // var tempisTglSBM = "";
                // if ($scope.item.isTglSBM != undefined) {
                //     if ($scope.item.isTglSBM) {
                //         tempisTglSBM = "&isTglSBM=true";
                //     } else {
                //         tempisTglSBM = "&isTglSBM=false";
                //     }
                // }

                var tempPeriodeBerdasarkan = "&periodeBerdasarkan=tglpulang";


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanDetailPenerimaanKasirCtrl', chacePeriode);

                var ttlALL = 0

                medifirstService.get("emr/get-datacombo-part-diagnosa-keperawatan" ).then(function (data) {
                    console.log(data);
                    $scope.listDiagnosaKep = data.data
                })
                medifirstService.get("tindakan/get-laporan-tindakan-implementasi?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + 
                    // "&ArrTindakan="+ listTindakan+
                    tempDepartemen +
                    tempRuanganId +
                    tempNama + 
                    tempNoReg + 
                    tempKelDokter +
                    tempDiagnosaKeperawatan +
                    tempLabelIntervensi +
                    tempImplementasi +
                    tempNoRm)
                   .then(function (data) {
                    $scope.isRouteLoading = false
                    $scope.dataTindakan = new kendo.data.DataSource({
                        data: data.data,
                        // pageSize: 50,
                        total: data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    total: {
                                        type: "number"
                                    }
                                }
                            }
                        },
                        aggregate: [{
                            field: 'total',
                            aggregate: 'sum'
                        }, ]
                    });
                })
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnTindakan = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Laporan Detail Tindakan Keperawatan / Implementasi" + moment($scope.item.tglawal).format('DD/MMM/YYYY') + "-" +
                        moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                sortable: true,
                resizable: true,
                groupable: true,
                columns: [{
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                        "width": "110px",
                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "80px",
                    }, 
                    {
                        "field": "noregistrasifk",
                        "title": "Noregistrasi",
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
                        "field": "diagnosakeperawatan",
                        "title": "Diagnosa Keperawatan",
                        "width": "200px",
                    },
                    {
                        "field": "intervensi",
                        "title": "Label Intervensi",
                        "width": "200px",
                    },
                    {
                        "field": "implementasi",
                        "title": "Implementasi",
                        "width": "200px",
                    },
                    {
                        "field": "tglemr",
                        "title": "Tgl Layanan",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "200px",
                    }
                ]
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
                    "id": 1,
                    "format": "pdf"
                },
                {
                    "id": 2,
                    "format": "xls"
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