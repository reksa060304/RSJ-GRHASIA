define(['initialize'], function(initialize) {
'use strict';
    initialize.controller('LaporanResepDokterCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService',
        function($scope, dateHelper, $http, $state, medifirstService) {    	
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};                       
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');   
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;                     
            FormLoad();
            LoadCombo();             

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {                                                   
                    $scope.listRuangan = dat.data.ruanganall;
                    $scope.listDataDokter = dat.data.dokter; 
                    $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                });
            }

            function init() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var noregistrasi = ""
                var nocm = ""
                var dokter = ""
                if ($scope.item.dokter != undefined){
                    dokter = $scope.item.dokter.id
                }
                var ruangan = ""
                if ($scope.item.ruangan != undefined){
                    ruangan = $scope.item.ruangan.id
                }

                medifirstService.get("emr/get-transaksi-pelayanan?&noregistrasi=" + noregistrasi + "&nocm=" + nocm + 
                    "&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + "&dokter=" + dokter + "&ruangan=" + ruangan,  true).then(function (dat) {
                    let group = [];                                   
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if ( dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            }else{
                                dat.data[i].cekreseppulang = '-'
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,                                 
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridRiwayat = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                });
            }

            function FormLoad(){                
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
               LoadCombo();
            }                               

            $scope.ClearData = function () {
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
               $scope.item.ruangan = undefined;
               $scope.item.kelompokPasien = undefined;
               $scope.item.dokter = undefined;
            }

            $scope.cariFilter = function () {

                init();
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.formatRupiah = function(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() { 
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open( "GET", aUrl, true );            
                    anHttpRequest.send( null );
                }
            }

            $scope.CetakLapDetail = function() {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }

            $scope.CetakLapRekap = function(){
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }            
            

            $scope.CetakLapBhpDetail = function() {
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Detail Penjualan Obat BHP? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-DetailPenjualanObat-Bhp='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }

            $scope.CetakLapBhpRekap = function(){
                // $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Rekap Penjualan Obat BHP? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient(); 
                // $scope.isRouteLoading = false;      
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-RekapPenjualanObat-Bhp='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {
                    // do something with response
                    
                });
            }      
            
            $scope.CetakLapApotik = function() {
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');            
                
                var tempDokterId = "";
                if ($scope.item.dokter != undefined) {
                    tempDokterId = $scope.item.dokter.id;
                }
                
                var tempKelompokPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokPasien.id;
                }

                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                }                         

                var stt = 'false'
                if (confirm('View Laporan Kwitansi Apotik? ')){
                    // Save it!
                    stt='true';
                }else {
                    // Do nothing!
                    stt='false'
                }

                var client = new HttpClient();                     
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-KwitansiApotik='+ $scope.namaLengkap + '&tglAwal='+ tglAwal 
                            + '&tglAkhir='+ tglAkhir + '&strIdRuangan=' + tempRuanganId + '&strIdKelompokPasien=' + tempKelompokPasienId 
                            + '&strIdPegawai=' + tempDokterId + '&view='+ stt, function(response) {                    
                });
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanPengeluaranObat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Laporan Pengeluaran Obat",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns:[
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglresep",
                        "title": "Tanggal",
                        "width": "50px",
                    },
                    {
                        "field": "ruanganapotik",
                        "title": "Depo Farmasi",
                        "width": "120px",
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "60px",
                    },
                    {
                        "field": "nocm",
                        "title": "No. RM",
                        "width": "50px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                       footerTemplate: "<span>Total </span>"
                    },
                    {
                        "field": "tunai",
                        "title": "Tunai",
                        "width": "70px",
                        aggregates: ["sum"],
                        template: "<span class='style-right'>{{formatRupiah('#: tunai  #', '')}}",
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.tunai.sum  #', '')}}"
                    },
                    {
                        "field": "penjamin",
                        "title": "Penjamin",
                        "width": "50px",
                        aggregates: ["sum"],
                        template: "<span class='style-right'>{{formatRupiah('#: penjamin  #', '')}}",
                        groupFooterTemplate: "<span class='style-right'>{{formatRupiah('#: data.penjamin.sum  #', '')}}",
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.penjamin.sum  #', '')}}"
                    },
                    {
                        hidden: true,
                        field: "kelompokpasien",
                        title: "Kelompok Pasien",
                        aggregates: ["count"],
                        groupHeaderTemplate: " #= value # "
                    }
                ]                   
            };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnGridRiwayat = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "170px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                     "template": "<span class='style-center'>#: cekreseppulang #</span>"
                }
            ];
            $scope.data22 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",                            
                        }

                    ]
                }
            };
//////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});