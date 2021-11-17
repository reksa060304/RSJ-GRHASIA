define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPendapatanRuanganCtrlRev', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, DateHelper, medifirstService) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            Combo()

            function Combo() {
                var chacePeriode = cacheHelper.get('LaporanPendapatanRuanganCtrlRev');
                if(chacePeriode != undefined){                    
                    // var arrPeriode = chacePeriode.split('~');
                    $scope.item.tglawal = new Date(chacePeriode[0]);
                    $scope.item.tglakhir = new Date(chacePeriode[1]);                
                }else{
                    $scope.item.tglawal = $scope.now;
                    $scope.item.tglakhir = $scope.now;                 
                }

                medifirstService.get("kasir/get-data-combo-kasir", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function(data) {
                    $scope.listPegawai = data;
                });
            }
           
            $scope.getIsiComboRuangan = function(){
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.CariData = function () {
                LoadData()
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;                
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


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPendapatanRuanganCtrlRev', chacePeriode);

                var ttlALL = 0
                medifirstService.get("kasir/get-data-lap-pendapatan-ruanganNew?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemen
                    + tempRuanganId
                    + tempKelDokter
                    + tempKelPasienId).then(function (data) {
                      
                        for (var i = data.data.data.length - 1; i >= 0; i--) {
                            if($scope.item.KelompokPasien!=undefined && $scope.item.KelompokPasien.kelompokpasien !=data.data.data[i].kelompokpasien){
                                data.data.data.splice(i, 1);
                            }
                        // for (var i = 0; i < data.data.data.length; i++) {
                          

                       }
                        var total = 0;
                        var totalambyar = 0;

                       for (var i = data.data.data.length - 1; i >= 0; i--) {
                            data.data.data[i].jumlah = parseFloat(data.data.data[i].jumlah)
                            totalambyar = totalambyar + parseFloat(data.data.data[i].total)
                        }
                        $scope.item.total = totalambyar
                              $scope.isRouteLoading = false
                        $scope.dataPendapatanRuangan = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 50,
                            total: data.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    })
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
                toolbar:["excel"],
                excel: {
                    fileName:"Data Laporan Pendapatan Per Ruangan"+ moment($scope.item.tglawal).format( 'DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglakhir).format( 'DD/MMM/YYYY')+".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
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
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #','')}}</span>",
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