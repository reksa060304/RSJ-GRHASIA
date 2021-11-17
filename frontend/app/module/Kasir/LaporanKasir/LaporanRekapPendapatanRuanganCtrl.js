define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanRekapPendapatanRuanganCtrl', ['CacheHelper', '$scope', 'DateHelper', 'MedifirstService',
        function (cacheHelper, $scope, DateHelper, medifirstService) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.KelPasien = ""
            Combo()

            function Combo() {
                var chacePeriode = cacheHelper.get('LaporanRekapPendapatanRuanganCtrl');
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
                    // $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listKelompokPasien = [
                        {id:1, kelompokpasien:"Tunai"},
                        {id:2, kelompokpasien:"Non Tunai"},
                    ]
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
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.kelompokpasien;
                }
                var tempKelDokter = "";
                if ($scope.item.namaPegawai != undefined) {
                    tempKelDokter = "&dokter=" + $scope.item.namaPegawai.id;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanRekapPendapatanRuanganCtrl', chacePeriode);

                var ttlALL = 0
                medifirstService.get("kasir/data-laporan-rekap-pendapatan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemen
                    + tempRuanganId                   
                    + tempKelPasienId).then(function (data) {
                        // debugger;
                        var total = 0;
                        var totalambyar = 0;
                        $scope.isRouteLoading = false;
                        var dataLaporan = data.data.laporan;  
                        for (var i = 0; i < data.data.laporan.length; i++) {    
                            totalambyar = parseFloat(totalambyar) + parseFloat(data.data.laporan[i].jumlahbiaya);
                        }
                        $scope.item.total = totalambyar
                        $scope.dataPendapatanRuangan = new kendo.data.DataSource({
                            data: dataLaporan,
                            pageSize: 50,
                            total: data.data.laporan.length,
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

            $scope.$watch('item.KelompokPasien', function (newValue, oldValue) {
                $scope.KelPasien = ""
                if ($scope.item.KelompokPasien != undefined) {
                    $scope.KelPasien == $scope.item.KelompokPasien.kelompokpasien;
                }
            });

            $scope.columnPendapatanRuangan = {
                toolbar:["excel"],
                excel: {
                    fileName:"Laporan Rekap Pendapatan "+ $scope.KelPasien + " " + moment($scope.item.tglawal).format( 'DD/MMM/YYYY') + "-"
                        + moment($scope.item.tglakhir).format( 'DD/MMM/YYYY')+".xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [                    
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",
                    
                    },                                        
                    {
                        "field": "jmlpasien",
                        "title": "Jml Pasien",
                        "width": "120px",
                    },
                    {
                        "field": "jumlahbiaya",
                        "title": "Jml Pendapatan",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahbiaya #','')}}</span>",
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pembayaran",
                        "width": "120px",

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

            //** BATAS **//
        }
    ]);
});