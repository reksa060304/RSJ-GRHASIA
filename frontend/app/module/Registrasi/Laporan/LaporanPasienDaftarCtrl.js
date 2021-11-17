define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanPasienDaftarCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;

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

            //debugger;
            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();

            $scope.CetakPasienDaftar = function () {
                // if($scope.item.format == undefined){
                //  alert('format file harus dipilih terlebih dahulu !!!')
                // }
                //debugger;
                if ($scope.item.tglawal == $scope.tglawal)
                    var tglawal = $scope.item.tglawal;
                else
                    var tglawal = DateHelper.getDateTimeFormatted2($scope.item.tglawal, "dd-MM-yyyy HH:mm");
                if ($scope.item.tglakhir == $scope.tglakhir)
                    var tglakhir = $scope.item.tglakhir;
                else
                    var tglakhir = DateHelper.getDateTimeFormatted2($scope.item.tglakhir, "dd-MM-yyyy HH:mm");

                if ($scope.item.KelompokPasien == undefined)
                    var kelompokPasien = "";
                else
                    var kelompokPasien = $scope.item.KelompokPasien.id;
                if ($scope.item.ruangan == undefined)
                    var ruangan = "";
                else
                    var ruangan = $scope.item.ruangan.id;
                if ($scope.item.departement == undefined)
                    var departement = "";
                else
                    var departement = $scope.item.departement.id;
                var stt = 'false'
                if (confirm('View Laporan Pasien Daftar? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=' + tglawal + '&tglAkhir=' + tglakhir + '&strIdRuangan=' + ruangan + '&strIdDepartement=' + departement + '&strIdKelompokPasien=' + kelompokPasien + '&strIdPegawai=' + $scope.pegawai.id + '&view=' + stt, function (response) {
                    // do something with response
                });
                // if(client.status==0){
                //     if($scope.item.format == undefined){
                //         alert('format file harus dipilih terlebih dahulu !!!');
                //     }else{
                //         var urlLaporan = ReportPelayanan.open('preporting/lapPelayananPasien?startDate=''+tglawal+'+tglawal+'&tglAkhir='+tglakhir+'&strIdRuangan='+ruangan+'&strIdDepartement='+departement+'&strIdKelompokPasien='+kelompokPasien+'&strIdDokter='+namaPegawai+'&format='+$scope.item.format.format);
                //         window.open(urlLaporan, '_blank');
                //     }
                // }   
            };

            medifirstService.get("registrasi/laporan/get-data-combo-laporan").then(function (dat) {
           
                // $scope.listPegawai = dat.data.dokter;
                $scope.listDepartemen = dat.data.departemen;
                // $scope.listPegawaiKasir = dat.data.kasir;
                //$scope.dataLogin = dat.data.datalogin[0];
                $scope.listPasien = dat.data.kelompokpasien;
                // $scope.listJenisLap = [{ id: 1, names: "Laporan Penerimaan Kasir Harian" },
                // { id: 2, names: "Laporan Penerimaan Kasir Perusahaan" }];
            });
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData()

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                //debugger;

                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }

                var tempKelPasienId = "";
                if ($scope.item.KelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.KelompokPasien.id;
                }

                var isTglPulang = ''
                if($scope.item.cekTglPulang != undefined){
                    isTglPulang ="&isTglPulang="+ $scope.item.cekTglPulang 
                } 

                var namaPasien = ''
                if($scope.item.nama != undefined){
                    namaPasien ="&namaPasien="+ $scope.item.nama
                }

                var noRm = ''
                if($scope.item.noRm != undefined){
                    noRm ="&noRm="+ $scope.item.noRm
                }

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-laporan-pasien-daftar?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    + tempKelPasienId
                    + namaPasien
                    + noRm
                    +isTglPulang).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            var tglaja = moment(new Date(datas[i].tglregistrasi)).format('YYYY-MM-DD');
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahir), new Date(datas[i].tglregistrasi));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr ' 
                        }
                        
                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });

                        $scope.dataExcel = data.data;
                    })
            }


            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanPasienDaftar.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Pasien Daftar", background: "#fffff" }]
                    });
                },
                sortable: true,
                pageable: true,
                selectable: "row",
                columns: [
                    {
                        "field": "tglregistrasi1",
                        "title": "Tgl Masuk",
                        "width": "100px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                        
                    },
                    {
                        "field": "jamregistrasi",
                        "title": "Jam Masuk",
                        "width": "80px",
                        // "template": "<span class='style-left'>{{formatJam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "180px",

                    },

                    {
                        "field": "ruangandaftar",
                        "title": "Unit Layanan",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "80px"

                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Tipe Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "statuspasien",
                        "title": "Status Pasien",
                        "width": "100px"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Penjamin",
                        "width": "150px"
                    },
                    {
                        "field": "jk",
                        "title": "JK",
                        "width": "50px"
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "200px"
                    },
                    {
                        "field": "agama",
                        "title": "Agama",
                        "width": "200px"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "200px"
                    },
                    {
                        "field": "alamatlengkap",
                        "title": "Alamat",
                        "width": "400px"
                    },
                    {
                        "field": "kecamatan",
                        "title": "Kecamatan",
                        "width": "200px"
                    },
                    {
                        "field": "kelurahan",
                        "title": "Kelurahan",
                        "width": "200px"
                    },
                    {
                        "field": "kabupaten",
                        "title": "Kabupaten",
                        "width": "200px"
                    },
                    {
                        "field": "suku",
                        "title": "Suku",
                        "width": "200px"
                    },
                    {
                        "field": "tgllahir1",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "100px"
                    },
                    {
                        "field": "dokterapd",
                        "title": "Dokter",
                        "width": "100px"
                    },
                    {
                        "field": "kodemasuk",
                        "title": "Kode",
                        "width": "100px"
                    },
                    {
                        "field": "diagnosamasuk",
                        "title": "Diagnosa Masuk",
                        "width": "300px"
                    },
                    {
                        "field": "pegawaimasuk",
                        "title": "Pegawai input(Masuk)",
                        "width": "200px"
                    },
                    {
                        "field": "kodekeluar",
                        "title": "Kode",
                        "width": "100px"
                    },
                    {
                        "field": "diagnosakeluar",
                        "title": "Diagnosa Primer",
                        "width": "300px"
                    },
                    {
                        "field": "pegawaiprimer",
                        "title": "Pegawai input(Primer)",
                        "width": "200px"
                    },
                    {
                        "field": "kasus",
                        "title": "Kasus",
                        "width": "80px"
                    },

                    //
                    // {
                    //     "field": "asalrujukan",
                    //     "title": "Asal Pasien",
                    //     "width": "100px"
                    // },
                    {
                        "field": "tglpulang1",
                        "title": "Tgl Keluar",
                        "width": "150px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "jampulang",
                        "title": "Jam Keluar",
                        "width": "150px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    // {
                    //     "field": "kondisipasien",
                    //     "title": "Keadaan",
                    //     "width": "100px"
                    // },
                    
                ]
            });




            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }


            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }
            
            $scope.RincianPelayanan = function(){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempDepartemenId = "";
                if ($scope.item.departement != undefined) {
                    tempDepartemenId = "&idDept=" + $scope.item.departement.id;
                }
                var tempRuanganId = "";
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
                }      
                var isTglPulang = ''
                if($scope.item.cekTglPulang != undefined){
                    isTglPulang ="&isTglPulang="+ $scope.item.cekTglPulang 
                }          
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanPasienDaftarCtrl', chacePeriode);
                medifirstService.get("registrasi/laporan/get-data-lap-rincian-pelayanan?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + tempDepartemenId
                    + tempRuanganId
                    +isTglPulang).then(function (data) {
                        $scope.isLoadingData = false;
                        $scope.popup_Laporan.center().open();                        
                        var datas = data.data;
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1;
                            var umur = DateHelper.CountAge(new Date(datas[i].tgllahirReal), new Date(datas[i].tglregistrasiReal));
                            var bln = umur.month,
                                thn = umur.year,
                                day = umur.day
                            var usia = (umur.year * 12) + umur.month;
                            datas[i].umur = thn + ' thn ' + bln + ' bln ' + day + ' hr ' 
                        }
                        $scope.sourceLaporanSatu = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 1000,
                            total: datas.length,
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

            $scope.columnLaporanSatu = {
                toolbar:["excel"],
                excel: {
                    fileName:"DataLaporanRincianPelayanan.xls",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "90px",
                        "template": "<span class='style-left'>#: tglregistrasi #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "90px",
                        "template": "<span class='style-center'>#: tglpulang #</span>"
                    },                    
                    {
                        "field": "jamperiksa",
                        "title": "Jam Periksa",
                        "width": "90px",
                        "template": "<span class='style-center'>#: jamperiksa #</span>"
                    }, 
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },    
                    {
                        "field": "ruanganakhir",
                        "title": "Ruangan Akhir",
                        "width": "120px"
                    },                                      
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px",
                        "template": "<span class='style-center'>#: dokter #</span>"
                    },
                    {
                        "field": "tipepasien",
                        "title": "Tipe Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tipepasien #</span>"
                    },
                    {
                        "field": "jenispasien",
                        "title": "Jenis Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jenispasien #</span>"
                    },                                       
                    // {
                    //     "field": "carabayar",
                    //     "title": "Cara Bayar",
                    //     "width": "100px",
                    //     "template": "<span class='style-center'>#: carabayar #</span>"
                    // },
                    {
                        "field": "noregistrasi",
                        "title": "Noregistrasi",
                        "width": "100px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },                                      
                    {
                        "field": "nocm",
                        "title": "No. Rm",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-center'>#: namapasien #</span>"
                    },                                      
                    {
                        "field": "nohp",
                        "title": "No Telepon",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nohp #</span>"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                        "template": "<span class='style-center'>#: tgllahir #</span>"
                    },                                                                          
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px",
                        "template": "<span class='style-center'>#: umur #</span>"
                    },  
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },                                    
                    {
                        "field": "agama",
                        "title": "Agama",
                        "width": "100px",
                        "template": "<span class='style-center'>#: agama #</span>"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pendidikan #</span>"
                    },                                     
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: pekerjaan #</span>"
                    },
                    {
                        "field": "statusperkawinan",
                        "title": "Status Perkawinan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: statusperkawinan #</span>"
                    },
                    {
                        "field": "alamat",
                        "title": "Alamat",
                        "width": "100px",
                        "template": "<span class='style-center'>#: alamat #</span>"
                    },                                     
                    {
                        "field": "kelurahan",
                        "title": "Kelurahan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kelurahan #</span>"
                    },
                    {
                        "field": "kecamatan",
                        "title": "Kecamatan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kecamatan #</span>"
                    },
                    {
                        "field": "kabupaten",
                        "title": "Kabupaten",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kabupaten #</span>"
                    },
                    {
                        "field": "kodepenyakit",
                        "title": "Kode Penyakit",
                        "width": "100px",
                        "template": "<span class='style-center'>#: kodepenyakit #</span>"
                    },
                ]
            };

            //* BATAS//
        }
    ]);
});