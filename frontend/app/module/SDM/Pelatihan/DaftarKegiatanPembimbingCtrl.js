define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarKegiatanPembimbingCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.itemP = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0
            loadCombo();
            loadData();
            medifirstService.getPegawaiLogin();
            console.log(medifirstService.getPegawaiLogin());
            function loadCombo() {
                var chacePeriode = cacheHelper.get('cacheDaftarRegisTtr');
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.item.noReg = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.item.noRm = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.nama = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.listDepartemen = [chacePeriode[5]]
                        $scope.item.instalasi = chacePeriode[5]
                    }

                    if (chacePeriode[6] != undefined) {
                        $scope.listRuangan = [chacePeriode[6]]
                        $scope.item.ruangan = chacePeriode[6]
                    }

                    if (chacePeriode[7] != undefined) {
                        $scope.item.listKelompokPasien = [chacePeriode[7]]
                        $scope.item.kelompokpasien = chacePeriode[7]
                    }

                    if (chacePeriode[8] != undefined) {
                        $scope.item.dokter = chacePeriode[8]
                        $scope.item.listDokter2 = chacePeriode[8]
                    }

                    if (chacePeriode[9] != undefined) {
                        $scope.item.jmlRows = chacePeriode[9]
                    }

                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listDokter = dat.data.dokter;
                    $scope.listDokter2 = dat.data.dokter;
                })
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRegistrasiPasien.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Dokter",
                        "width": "150px",
                        // "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                    },
                    {
                        "field": "institusipendidikan",
                        "title": "Institusi Pendidikan",
                        "width": "150px",
                        // "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                    },
                    {
                        "field": "kegiatan",
                        "title": "Kegiatan",
                        "width": "80px"
                    },
                    {
                        "field": "diklatkategori",
                        "title": "Jenis Kegiatan",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "peserta",
                        "title": "Peserta",
                        "width": "150px",
                        "template": "#: peserta #"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "150px",
                        // "template": "#: peserta #"
                    },
                    {
                        "field": "periode",
                        "title": "Periode Kegiatan",
                        "width": "150px",
                        // "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "tglmasukbimbingan",
                        "title": "Tanggal Masuk Bimbingan",
                        "width": "150px",
                        // "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "tglkeluarbimbingan",
                        "title": "Tanggal Keluar Bimbingan",
                        "width": "150px",
                        // "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                ]
            };


            $scope.SearchData = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                
                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                
                
                medifirstService.get("diklat/get-daftar-kegiatan-pembimbing?pegawai="+ medifirstService.getPegawaiLogin().id ).then(function (data) {
                $scope.isRouteLoading = false;
                // $scope.dataDaftarPasienPulang = data[0].data;
                var datas = data.data;
                console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i+1
                                
                    
        
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                // var chacePeriode = {
                //     0: tglAwal,
                //     1: tglAkhir,
                //     2: tempNoReg,
                //     3: tempNoRm,
                //     4: tempNamaOrReg,
                //     5: tempInstalasiIdArr,
                //     6: tempRuanganIdArr,
                //     7: tempKelompokArr,
                //     8: tempDokterArr,
                //     9: jmlRows
                // }
                // cacheHelper.set('cacheDaftarRegisTtr', chacePeriode);
                });

            };
            $scope.columnDaftarDetailDiklat = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "RekapDaftarTagihanNonLayan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.mergedCells = ["A1:F1"];
                    sheet.frozenRows = 2;
                    sheet.name = "Report";
                    var myHeaders = [{
                        value: "Laporan Tagihan Non Layanan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        height: 70,
                        fontSize: 20,
                        textAlign: "center"
                    });
                },
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        // "template": "<span class='style-center'>#: jenisTagihan #</span>"
                    },
                    {
                        "field": "tglhasilkegiatan",
                        "title": "Waktu",
                        "width": "80px",
                        // "template": "<span class='style-left'>#: namaPelanggan #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        // "template": "<span class='style-center'>#: jenisTagihan #</span>"
                    },
                    {
                        "field": "hasilkegiatan",
                        "title": "Kegiatan",
                        "width": "150px",
                        // "template": "<span class='style-center'>#: jenisTagihan #</span>"
                    },
                ]
            }
            $scope.TutupPopUps = function() {
                $scope.itemP = {}
                $scope.popUpHasilKegiatan.close();
            }
            $scope.klikGrid = function (dataPasienSelected) {
                $scope.itemP = {}
                $scope.itemP.tglinput = $scope.now
                console.log($scope.itemP.tglinput);
                $scope.itemP.ruangan = {
                    id: dataPasienSelected.id_ruangan,
                    namaruangan: dataPasienSelected.namaruangan
                }
                $scope.itemP.pembimbing = {
                    id: medifirstService.getPegawaiLogin().id,
                    namalengkap: medifirstService.getPegawaiLogin().namaLengkap
                }
                $scope.listRuangan = [{
                    id: dataPasienSelected.id_ruangan, namaruangan: dataPasienSelected.namaruangan
                }]
                console.log(dataPasienSelected);
                var myStr = dataPasienSelected.peserta;
                var strArray = myStr.split(", ");
                console.log(strArray);
                $scope.itemP.institusipendidikan = dataPasienSelected.institusipendidikan
                $scope.itemP.tglmasukbimbingan = dataPasienSelected.tglmasukbimbingan
                $scope.itemP.tglkeluarbimbingan = dataPasienSelected.tglkeluarbimbingan
                // $scope.itemP.daftarmahasiswa
                var oke = [];
                // // Display array values on page
                for (var i = 0; i < strArray.length; i++) {
                    oke[i] = (i + 1) + ". " + strArray[i] + "\n";
                }
                $scope.itemP.daftarmahasiswa = oke.join("");
                console.log($scope.itemP.daftarmahasiswa);
                detailKegiatan()
                $scope.popUpHasilKegiatan.center().open();
            }
            function detailKegiatan(){
                $scope.isRouteLoading = true;
                medifirstService.get('diklat/get-hasilkegiatan?noregistrasifk=' + $scope.dataPasienSelected.kegiatanfk + '&pegawaifk=' + medifirstService.getPegawaiLogin().id + "&ruangan=" + $scope.dataPasienSelected.id_ruangan + "&tglmasukbimbingan=" + $scope.dataPasienSelected.tglmasukbimbingan + "&tglkeluarbimbingan=" + $scope.dataPasienSelected.tglkeluarbimbingan)
                .then(function(data){
                    $scope.isRouteLoading = false;
                    var datas = data.data
                    console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i+1;
                    }
                    $scope.dataDaftarDetailDiklat = new kendo.data.DataSource({
                        data: datas, //data,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                    });
                })
            }
            $scope.saveKegiatan = function(){
                $scope.isRouteLoading = true;
                var objSave = {
                    tglhasilkegiatan: moment($scope.itemP.tglinput).format('YYYY-MM-DD HH:mm'),
                    objectruanganfk: $scope.itemP.ruangan.id,
                    hasilkegiatan: $scope.itemP.kegiatan,
                    kegiatanfk : $scope.dataPasienSelected.kegiatanfk,
                    mahasiswa: $scope.itemP.daftarmahasiswa,
                    tglmasukbimbingan: $scope.itemP.tglmasukbimbingan,
                    tglkeluarbimbingan: $scope.itemP.tglkeluarbimbingan,
                    objectpegawaifk: medifirstService.getPegawaiLogin().id
                }
                console.log(objSave);
                // return
                medifirstService.post('diklat/save/kegiatan-diklat', objSave).then(function(data){
                    $scope.isRouteLoading = false;
                    detailKegiatan()
                })
            }
            // END ################
        }
    ]);
});