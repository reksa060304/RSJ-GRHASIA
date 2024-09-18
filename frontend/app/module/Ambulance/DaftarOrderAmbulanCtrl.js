define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderAmbulanCtrl', ['$scope', '$state', 'CacheHelper','$parse', 'DateHelper', '$window', 'MedifirstService',
        function ($scope, $state, cacheHelper,$parse, dateHelper, $window, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.jumlah = 1
			$scope.item.QtyPerOrang = 1
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.btnSimpanVis = false;
            $scope.headerVerif = {}

            let dataOrder = []

            $scope.item.belumVerifikasi = true;
            var loginRadiologi = false
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                } else {
                    return;
                }
            }

            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                toastr.info('No Order : ' + data.noorder + ' dipilih ', 'Info')
                $scope.dataSelected = data;
                medifirstService.get("sysadmin/general/get-acc-number-radiologi?noOrder=" + $scope.dataSelected.noorder)
                    .then(function (e) {
                        $scope.dataRisOrder = e.data.data[0]
                    })
                if ($scope.dataSelected.norec_apd != null) {
                    $scope.showBuktiLayanan = true
                }
                medifirstService.get("ambulance/get-data-apd?noregistrasi=" + $scope.dataSelected.noregistrasi
                    + "&noorder=" + $scope.dataSelected.noorder + "&idruangan=" + $scope.dataSelected.objectruangantujuanfk).then(function (e) {                        
                        $scope.norec_apd = e.data.data[0].norec_apd
                    })
            }

            function ClearIsian(){
                $scope.item.namaprodukInput = null
                $scope.item.KeteranganProduk = null
                $scope.item.jumlah = null
                $scope.item.hargabahanbakar = null
                $scope.item.Harga = null
                $scope.item.Total = null
                $scope.item.jenisPelaksana = null
                $scope.selectedPegawai = []
            }

            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienLaboratoriumCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    $scope.item.noReg = chacePeriode[4];
                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    init();
                }
            }
            function loadCombo() {
                var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {





                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listJenisPetugasPe = dat.data.jenispetugaspe;
                    $scope.listRuangan = dat.data.ruanganpelayanan
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokter = data;
                });

                medifirstService.get("tatarekening/tindakan/get-combo")
				.then(function (da) {
					$scope.listJenisPelaksana = da.data.jenispelaksana;
					if($scope.item.iddpjp != undefined) {
                        $scope.item.jenisPelaksana = { id: 4, jenispetugaspe: 'Dokter Pemeriksa' };
                        $scope.init2();
                    }
				})
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.ruanganOrder != undefined) {
                    var ins = "&idRuanganOrder=" + $scope.item.ruanganOrder.id
                }
                var rg = ""
                if ($scope.item.ruanganTujuan != undefined) {
                    var rg = "&idRuanganTujuan=" + $scope.item.ruanganTujuan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    var dok = "&pegId=" + $scope.item.dokter.id
                }

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var noOrderan = ""
                if ($scope.item.noOrderCari != undefined) {
                    var noOrderan = "&noOrders=" + $scope.item.noOrderCari
                }
                var isNotVerif = ""
                if ($scope.item.belumVerifikasi) {
                    var isNotVerif = "isNotVerif=" + true
                    var jmlRow = ""
                    if ($scope.item.jmlRow) {
                        jmlRow = "&jmlRow=" + $scope.item.jmlRow
                    }
                }
                var jmlRow = ""
                if ($scope.item.jmlRow) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }

                var tglAwal = ""
                var tglAkhir = ""
                if ($scope.cekBelumVerifs == false) {
                    tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                }

                medifirstService.get("ambulance/get-data-order-ambulan?" +
                    isNotVerif +
                    tglAwal +
                    tglAkhir +
                    reg +
                    rm +
                    nm +
                    ins + rg + kp
                    + dok
                    + noOrderan
                    + jmlRow
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';

                        }

                        var data = dat.data.data
                        // $scope.totalMasuk = 0
                        var Warnaku = [];
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].status) {
                                case "MASUK":
                                    // $scope.totalMasuk =   $scope.totalMasuk +1
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                case "Sudah Verifikasi":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                                // case "DIPANGGIL_SUSTER":
                                //     data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                                //     break;
                            }
                        }

                        $scope.listDataPasien = new kendo.data.DataSource({
                            data: data,
                            // group: $scope.group,
                            pageSize: 20,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                    });
            }

            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarOrderAmbulanCtrl', chacePeriode);
            }

            $scope.editOrder = function () {
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }

                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.objectkelasfk,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.objectruanganfk,
                    11: $scope.dataSelected.norec_pd,
                    12: $scope.dataSelected.norec_so,
                    13: $scope.dataSelected.kelompokpasien,
                    14: $scope.dataSelected.idjenisPelayanan,
                    15: $scope.dataSelected.jenispelayanan
                }
                cacheHelper.set('editOrderCache', arrStr);
                $state.go('TransaksiPelayananAmbulan')
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Order",
                    "width": "130px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "130px",
                },
                // {
                //     "field": "jeniskelamin",
                //     "title": "Jenis Kelamin",
                //     "width" : "70px",
                // },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "pegawaiorder",
                    "title": "Pengorder",
                    "width": "100px"
                },
                // {
                //     "field": "kelompokpasien",
                //     "title": "Kelompok Pasien",
                //     "width" : "100px",
                // },

                // {
                //     "field": "namakelas",
                //     "title": "Nama Kelas",
                //     "width" : "80px",
                // },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                // {
                //     "field": "",
                //     "title": "No Verifikasi",
                //     "width" : "120px",
                // },
            ];
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "50px",
                            "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "150px",

                        },
                        {
                            "field": "qtyproduk",
                            "title": "Jumlah",
                            "width": "50px",

                        }

                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }
            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn '// + bln + ' bln'
            }


            $scope.LihatHasil = function (data) {

                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if (loginRadiologi == true) {
                    if ($scope.dataRisOrder != undefined) {
                        $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.dataRisOrder.patient_id
                            + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                    } else {
                        toastr.info('Hasil Radiologi belum ada')
                    }
                } else {
                    if ($scope.norec_apd != undefined) {
                        var arrStr = {
                            0: $scope.dataSelected.nocm,
                            1: $scope.dataSelected.namapasien,
                            2: $scope.dataSelected.jeniskelamin,
                            3: $scope.dataSelected.noregistrasi,
                            4: $scope.dataSelected.umur,
                            5: $scope.dataSelected.kelompokpasien,
                            6: $scope.dataSelected.tglregistrasi,
                            7: $scope.norec_apd,
                            8: $scope.dataSelected.norec_pd,
                            9: $scope.dataSelected.objectkelasfk,
                            10: $scope.dataSelected.namakelas,
                            11: $scope.dataSelected.objectruanganfk,
                            12: $scope.dataSelected.namaruangan
                        }
                        cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);

                        $state.go('HasilLaboratorium', {
                            norecPd: $scope.dataSelected.norec_pd,
                            noOrder: $scope.dataSelected.noorder,
                            norecApd: $scope.norec_apd
                        })
                    } else {
                        toastr.info('Hasil Lab belum ada')
                    }

                }

            }

            $scope.verifikasi = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                delete $scope.item.dokterVerif
                $scope.btnSimpanVis = false
                $scope.headerVerif = $scope.dataSelected;
                $scope.item.noOrder = $scope.dataSelected.noorder;
                $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                loadDiagnosa($scope.dataSelected.noregistrasi)
                $scope.popUpVerif.center().open();
                loadDataVerif();
            }

            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosapasienbynoreg?noReg=" + noreg
                ).then(function (data) {

                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.headerVerif.diagnosa = diagnosa
                    }
                });
            }
            function loadDataVerif() {
                medifirstService.get("ambulance/get-order-pelayanan-ambulan?norec_so=" + $scope.dataSelected.norec_so
                    + "&objectkelasfk=" + $scope.dataSelected.objectkelasfk, true).then(function (dat) {
                        var dataSource = dat.data.data;
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].statCheckbox = false;
                            dataSource[i].no = i + 1
                        }
                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: dataSource,
                            pageSize: 10,
                            total: dataSource.length,
                            serverPaging: false,

                        });
                    });
            }
            $scope.columnVerif = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Jumlah",
                    "width": "40px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "140px"
                },


            ];

            $scope.selectRow = function (dataItem) {

                var dataSelect = _.find($scope.sourceVerif._data, function (data) {
                    return data.prid == dataItem.prid;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.sourceVerif._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceVerif._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }
            //refresh data grid
            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: false,

                });
                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
                // $scope.dataVOloaded = true;
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
            }

            $scope.simpanVerifikasi = function () {
                if ($scope.item.JenisPetugasPe == undefined) {
                    toastr.error('Jenis Petugas Pelaksana Harus Di isi')
                    return
                }

                if ($scope.item.dokterVerif == undefined) {
                    toastr.error('Petugas Pelaksana Harus Di isi')
                    return
                }

                var dataPost = [];
                for (var i = 0; i < $scope.sourceVerif._data.length; i++) {
                    // if($scope.sourceVerif._data[i].statCheckbox){
                    var datasys = {
                        "produkid": $scope.sourceVerif._data[i].prid,
                        "hargasatuan": $scope.sourceVerif._data[i].hargasatuan,
                        "qtyproduk": $scope.sourceVerif._data[i].qtyproduk,
                        "komponenharga": $scope.sourceVerif._data[i].details,
                        "tglpelayanan": $scope.sourceVerif._data[i].tglpelayanan
                    }
                    dataPost.push(datasys)
                    // }
                }
                var norec_pp = ''
                if ($scope.sourceVerif._data[0].norec_pp != null) {
                    norec_pp = $scope.sourceVerif._data[0].norec_pp
                }

                var itemsave = {
                    "bridging": dataPost,
                    "norec_pp": norec_pp,
                    "noorder": $scope.item.noOrder,
                    "norec_so": $scope.dataSelected.norec_so,
                    "objectkelasfk": $scope.dataSelected.objectkelasfk,
                    "norec_pd": $scope.dataSelected.norec_pd,
                    "objectruangantujuanfk": $scope.dataSelected.objectruangantujuanfk,
                    "objectpegawaiorderfk": $scope.dataSelected.objectpegawaiorderfk,
                    "iddokterverif": $scope.item.dokterVerif.id,
                    "namadokterverif": $scope.item.dokterVerif.namalengkap,
                    "iddokterorder": $scope.item.dokterOrder.id,
                    "namadokterorder": $scope.item.dokterOrder.namalengkap,
                    "idpetugaspe": $scope.item.JenisPetugasPe.id
                }

                if (dataPost.length > 0) {
                    for (let i = 0; i < dataPost.length; i++) {
                        const element = dataPost[i];
                        if (element.komponenharga.length == 0) {
                            toastr.error('Tindakan Belum ada Komponen Harganya')
                            return
                        }
                    }

                    $scope.btnSimpanVis = true;
                    medifirstService.post('ambulance/simpan-data-pelayanan-ambulan', itemsave)
                        .then(function (e) {
                            init()
                        });
                }
                else {
                    toastr.error('Belum ada data yang dipilih');
                }
            }
            $scope.hapusTindakan = function () {
                if ($scope.dataSelectedVerif == undefined) {
                    toastr.error('Pilih data dahulu!');
                    return;
                }

                var objDelete = {
                    "norec_op": $scope.dataSelectedVerif.norec_op,
                };
                medifirstService.post('ambulance/delete-order-pelayanan-ambulan', objDelete).then(function (e) {
                    loadDataVerif()
                })
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

            $scope.cetakBuktiLayanan = function () {

                if ($scope.dataSelected != undefined && $scope.norec_apd != null) {
                    // if ($scope.dataSelected.status != 'SELESAI DIPERIKSA') {
                    //     toastr.error('Pilih pasien yang sudah di verifikasi')
                    //     return
                    // }
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();

                    // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' 
                    //     + $scope.dataSelected.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id +
                    //     '&strIdRuangan=ORDERRADIOLOGI' +$scope.norec_apd + '&view='+ stt, function(response) {
                    //     // do something with response
                    // });
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' +
                        $scope.dataSelected.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&strIdRuangan=' +
                        $scope.dataSelected.objectruangantujuanfk + '&view=' + stt, function (response) {
                            //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
                            // do something with response
                        });

                }
            }
            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var status = kendoGrid.dataItem(row).status;
                    switch (status) {
                        case "MASUK":
                            $(row.cells).addClass("grey");
                            break;
                        case "Sudah Verifikasi":
                            $(row.cells).addClass("green");
                            break;
                        // case "SAMPLE CHECKIN":
                        //     $(row.cells).addClass("red");
                        //     break;
                    }
                    // if (status && status.indexOf("Sudah direspon") > -1) {
                    //     $(row.cells).addClass("green");
                    // }else{
                    //      $(row.cells).addClass("red");

                    // }
                }
            }
            $scope.mainGridOptions = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px"
                    },
                    {
                        "field": "tglorder",
                        "title": "Tgl Order",
                        "template": "#= new moment(new Date(tglorder)).format('DD-MM-YYYY HH:mm') #",
                        "width": "100px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rekam Medis",
                        "width": "70px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px"
                    },
                    {
                        "field": "namaruangan",
                        "title": " Ruangan Order",
                        "width": "130px"
                    },
                    {
                        "field": "ruangantujuan",
                        "title": "Ruangan Tujuan",
                        "width": "130px"
                    },
                    {
                        "field": "pegawaiorder",
                        "title": "Pengorder",
                        "width": "100px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "120px"
                    },
                ]
            }

            $scope.verifikasiNew = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                // delete $scope.item.dokterVerif
                // $scope.btnSimpanVis = false
                // $scope.headerVerif = $scope.dataSelected;
                $scope.item.noOrderA = $scope.dataSelected.noorder;
                $scope.item.namaPasienA = $scope.dataSelected.namapasien;
                $scope.item.nocmA = $scope.dataSelected.nocm;
                // $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                loadDiagnosa($scope.dataSelected.noregistrasi)
                $scope.popUpVerifNew.center().open();
                // loadDataVerif();
            }
          
            $scope.selectOptions = {
				placeholder: "Pilih Pegawai...",
				dataTextField: "namaLengkap",
				dataValueField: "id",
				filter: "contains"
			};

			$scope.tambah1 = function () {
				$scope.pelaksanaAmbulan2 = true;
				$scope.show = false;
				$scope.show2 = true;
			};

			$scope.show = true;
			$scope.tambah2 = function () {
				$scope.showJenisPelaksana2 = true;
				$scope.show = false;
				$scope.show2 = true;
			};
			$scope.hapusPelaksanaAmbulan2 = function () {
				$scope.show = true;
				$scope.show2 = false;
				$scope.pelaksanaAmbulan2 = false;
				$scope.item.jenisPelaksana2 = "";
				$scope.selectedPegawai2 = [];
			};

			$scope.isInArray = function (value, array) {
				return array.indexOf(value) > -1;
			}
			
			$scope.listIdPetugas = [13827, 176873]
			$scope.init1 = function () {
				var id = $scope.item.jenisPelaksana.id;
				var model = 'dataSource';
				var listArray = 'selectedPegawai';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};
			$scope.selectedPegawai = [];
			$scope.init2 = function () {
				var id = $scope.item.jenisPelaksana2.id;
				var model = 'dataSource2';
				var listArray = 'selectedPegawai2';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};

            $scope.columnDaftarTagihan = [
				{
					"field": "no",
					"title": "No",
					"width": "45px"
				},
				{
					"field": "namaproduk",
					"title": "Tagihan",
					"width": "200px"
				},
				{
					"field": "keterangan",
					"title": "Keterangan",
				},
				{
					"field": "jumlah",
					"title": "Qty",
					"width": "90px"
				},
				{
					"field": "penambahantarif",
					"title": "Qty Per Org/Per Km",
					"width": "90px"
				},
				{
					"field": "harga",
					"title": "Harga",
					"width": "110px"
				},
				{
					"field": "total",
					"title": "Total",
					"width": "110px"
				},
				{
					command: {
						text: "Hapus",
						width: "50px",
						align: "center",
						attributes: { align: "center" },
						click: hapusLayanan,
					},
					title: "",
					width: "80px",
				}
			];
			
			$scope.columnDaftarProduk = [
				{
					"field": "namaproduk",
					"title": "Nama Layanan",
					"width": "300px"
				}
			];

            function hapusLayanan(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				if (!dataItem) return

				
				$scope.dataDaftarTagihan.remove(dataItem);
				for (var i = dataProduk.length - 1; i >= 0; i--) {
					if (dataProduk[i].no == dataItem.no) {

						dataProduk.splice(i, 1);
						
						for (var j = dataProduk.length - 1; j >= 0; j--) {
							
						}
						

					}
				}

		

				var subTotal = 0;
				for (var i = dataProduk.length - 1; i >= 0; i--) {
					subTotal = subTotal + parseFloat(dataProduk[i].subTotal);
				}
				$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");


				if (
					$scope.gridPetugasPelaksana._data != null || $scope.gridPetugasPelaksana._data != undefined
					) {
					var gridPetugas = $scope.gridPetugasPelaksana._data;
					if (gridPetugas.length != 0) {
						for (var i = gridPetugas.length - 1; i >= 0; i--) {
							if (gridPetugas[i].idParent == dataItem.no) {
								gridPetugas.splice(i, 1);
							
								}
						}
					}
				}
			}

            $scope.CariProduk = function () {
				medifirstService.get("kasir/get-data-produk?namaproduk=" + $scope.item.namaproduk + "&take=50", false).then(function (data) {
					$scope.dataDaftarProduk = data.data.data;
				})
			}

            $scope.klikGrid = function(dataSelectedProduk){	

				if (dataSelectedProduk == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
                    return
				}
				$scope.dataSelectedProduk = dataSelectedProduk;
				$scope.item.namaprodukInput = $scope.dataSelectedProduk.namaproduk;
				if ($scope.dataSelectedProduk.namaproduk != "Pelayanan Lainnya") {
					$scope.item.KeteranganProduk = "-";
					$scope.disHarga = true;
				}else{	
					$scope.disHarga = false;									
				}
				
				// if (
				// 	$scope.dataSelectedProduk.id == 2329 && $scope.dataSelectedProduk.namaproduk == 'AMBULAN JENAZAH' ||
				// 	$scope.dataSelectedProduk.id == 2328 && $scope.dataSelectedProduk.namaproduk == 'AMBULAN'
				// ) {
				// 	$scope.QtyOrang = false;
				// 	$scope.checkQtyOrg = false;
				// 	$scope.noPolAmbulan = false;
				// 	$scope.hargabahanbakar = false;
				// 	$scope.pelaksanaAmbulan1 = false;
				// } else {
				// 	$scope.QtyOrang = true;
				// 	$scope.checkQtyOrg = true;
				// 	$scope.noPolAmbulan = true;
				// 	$scope.hargabahanbakar = true;
				// 	$scope.pelaksanaAmbulan1 = true;
				// 	$scope.item.noPolAmbulan = undefined;
				// }

				$scope.item.Harga = $scope.dataSelectedProduk.harga;
				$scope.item.idProduk = $scope.dataSelectedProduk.id;
				// $scope.item.jumlah = 1;
				// $scope.item.QtyPerOrang = 1;
			}

            function getPegawaiById(id, input, output) {
				var selectedData = $parse(output);
				selectedData.assign($scope, []);
				var model = $parse(input);
				medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function (dat) {
					$scope.listPegawai = new kendo.data.DataSource({
						data: dat.data.jenispelaksana
					});
					$scope.pegawaiLogin = medifirstService.getPegawaiLogin();
					model.assign($scope, $scope.listPegawai);

					var cookie = document.cookie.split(';');
					cookie = cookie[0].split('=');
					if (cookie[1] == 'dokter') {
						$scope.listPegawai.read();
						$scope.selectedPegawai = [($scope.listPegawai._view[dat.data.jenispelaksana.map(x => x.id).indexOf($scope.pegawaiLogin.id)])]//[({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]
					}

					if ($scope.item.iddpjp != undefined && id == 4) {
						$scope.listPegawai.read();
						$scope.selectedPegawai = [($scope.listPegawai._view[dat.data.jenispelaksana.map(x => x.id).indexOf($scope.item.iddpjp)])]
					}
				});
			}

            $scope.tambah = function () {
				if ($scope.item.namaprodukInput == undefined) {
					alert("pilih produk terlebih dahulu !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.KeteranganProduk == undefined) {
					alert("Keterangan Pelayanan Harus Diisi !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.Harga == 0 || $scope.item.Harga == 0.0) {
					alert("Harga Tidak Boleh Nol !!")
					return;
				}

				var no = 0
				if (dataOrder.length == 0) {
					no = 1
				} else {
					no = dataOrder[dataOrder.length - 1].no + 1
				}

				if ($scope.item.no != undefined) {
					no = $scope.item.no
				}
				var data = {};

				if ($scope.item.no != undefined) {//LAMA
					for (var i = dataOrder.length - 1; i >= 0; i--) {
						if (dataOrder[i].no == $scope.item.no) {
							data.no = $scope.item.no
							var bensin = null;
							var objectprodukasetfk = null;
							if ($scope.item.noPolAmbulan != undefined) {
								bensin = {
									id: $scope.item.noPolAmbulan.id,
									nopolisi: $scope.item.noPolAmbulan.nopolisi,
									harga: $scope.item.noPolAmbulan.harga,
									namaproduk: $scope.item.noPolAmbulan.namaproduk
								}
							}
							if (bensin != undefined) {
								if ($scope.item.noPolAmbulan.id != undefined) {
									objectprodukasetfk = $scope.item.noPolAmbulan.id;
								}
							}
							data.id = $scope.item.idProduk
							data.namaproduk = $scope.item.namaprodukInput
							data.jumlah = parseFloat($scope.item.jumlah)
							data.qtyoranglast = parseFloat($scope.item.QtyPerOrang)
							data.harga = parseFloat($scope.item.Harga)							
							data.totalK = $scope.item.Total //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
							data.keterangan = $scope.item.KeteranganProduk
							data.objectprodukasetfk = objectprodukasetfk;
							data.bahanbakar = bensin
                            data.penambahantarif = parseFloat($scope.item.hargabahanbakar)
                            data.total = (parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)) + parseFloat($scope.item.hargabahanbakar)
                            data.jenispelaksana = $scope.item.jenisPelaksana
                            
                            data.petugas = $scope.selectedPegawai

							dataOrder[i] = data;
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataOrder
							});
							var subTotal = 0;
							for (var i = dataOrder.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(dataOrder[i].totalK)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							ClearIsian();

						}
						// break;
					}
				} else {//BARU
					var bahanbakar = null;
					var objectprodukasetfk = null;
					if ($scope.item.noPolAmbulan != undefined) {
						bahanbakar = {
							id: $scope.item.noPolAmbulan.id,
							nopolisi: $scope.item.noPolAmbulan.nopolisi,
							harga: $scope.item.noPolAmbulan.harga,
							namaproduk: $scope.item.noPolAmbulan.namaproduk
						}
					}

					if (bahanbakar != undefined) {
						if ($scope.item.noPolAmbulan.id != undefined) {
							objectprodukasetfk = $scope.item.noPolAmbulan.id;
						}
					}

					data = {
						no: no,
						idproduk: $scope.item.idProduk,
						namaproduk: $scope.item.namaprodukInput,
						jumlah: parseFloat($scope.item.jumlah),
						qtyoranglast: parseFloat($scope.item.QtyPerOrang),
						harga: parseFloat($scope.item.Harga),
						keterangan: $scope.item.KeteranganProduk,
						totalK: $scope.item.Total, //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
						objectprodukasetfk: objectprodukasetfk,
						bahanbakar: bahanbakar,
                        penambahantarif: parseFloat($scope.item.hargabahanbakar),
                        total: (parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)) + parseFloat($scope.item.hargabahanbakar),
                        jenispelaksana: $scope.item.jenisPelaksana,
                        petugas: $scope.selectedPegawai,
					}
					dataOrder.push(data)
					// $scope.dataGrid.add($scope.dataSelectedProduk)
					$scope.dataDaftarTagihan = new kendo.data.DataSource({
						data: dataOrder
					});
					var subTotal = 0;
					for (var i = dataOrder.length - 1; i >= 0; i--) {
						subTotal = subTotal + parseFloat(dataOrder[i].totalK)
					}
					$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
					ClearIsian();
				}

				if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
					var pushData = {
						"idParent": data.no,
						"jenisPetugas": {
							"id": $scope.item.jenisPelaksana.id,
							"jenisPelaksana": $scope.item.jenisPelaksana.jenispetugaspe
						},
						"listPetugas": $scope.selectedPegawai
					}
					$scope.gridPetugasPelaksana.add(pushData);
				}

				if ($scope.item.jenisPelaksana2 && $scope.selectedPegawai2) {
					var pushData = {
						"idParent": data.no,
						"jenisPetugas": {
							"id": $scope.item.jenisPelaksana2.id,
							"jenisPelaksana": $scope.item.jenisPelaksana2.jenispetugaspe
						},
						"listPetugas": $scope.selectedPegawai2
					}
					$scope.gridPetugasPelaksana.add(pushData);
				}
			}

            $scope.klikGridDetail = function(data){
                // console.log(data)

                // data yang dipilih ke form
                $scope.item.no = data.no
                $scope.item.namaprodukInput = data.namaproduk
                $scope.item.KeteranganProduk = data.keterangan
                $scope.item.jumlah = data.jumlah
                $scope.item.hargabahanbakar = data.penambahantarif
                $scope.item.Harga = data.harga
                $scope.item.Total = data.total
                $scope.item.jenisPelaksana = data.jenispelaksana
                $scope.selectedPegawai = data.petugas
            }


            $scope.$watch('item.jumlah', function(newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						if ($scope.dataSelected != undefined) {
							if ($scope.dataSelected.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
									console.log($scope.item.Total)
								}
							}else if ($scope.dataSelected.namaproduk == 'AMBULAN JENAZAH'){
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
								}
							} else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						} else if ($scope.dataSelectedProduk != undefined) {
							if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							} else if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN JENAZAH'){
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							} else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						}
					}
				}
			});

			$scope.$watch('item.QtyPerOrang', function(newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						if ($scope.dataSelected != undefined) {
							if ($scope.dataSelected.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
								}
							} else if ($scope.dataSelected.namaproduk == 'AMBULAN JENAZAH'){
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
								}
							}else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						} else if ($scope.dataSelectedProduk != undefined) {
							if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							} else if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN JENAZAH'){
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							}else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						}
					}
				}
			});

			
            $scope.$watch('item.hargabahanbakar', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) +  parseFloat($scope.item.hargabahanbakar)
                }
            })
           
			$scope.$watch('item.Harga', function(newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						if ($scope.dataSelected != undefined) {
							if ($scope.dataSelected.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
								}
							} else if ($scope.dataSelected.namaproduk == 'AMBULAN JENAZAH'){
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelected.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelected.harga)) * parseFloat($scope.item.jumlah));
								}
							}else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						} else if ($scope.dataSelectedProduk != undefined) {
							if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 1.5 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							} else if ($scope.dataSelectedProduk.namaproduk == 'AMBULAN JENAZAH') {
								if ($scope.item.QtyPerOrang <= 5) {
									$scope.item.Total = parseFloat($scope.dataSelectedProduk.harga) * parseFloat($scope.item.jumlah)
								} else {
									$scope.item.Total = (((parseFloat($scope.item.QtyPerOrang) - 5) * parseFloat($scope.item.hargabahanbakar) * 2 + parseFloat($scope.dataSelectedProduk.harga)) * parseFloat($scope.item.jumlah));
								}
							}else {
								$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
							}
						}
					}
				}
			});

			$scope.changePage = function (stateName) {				
				var obj = {
					pageFrom: "InputTagihanNonLayanan",
					noRegistrasi: noRegistrasi2
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

            $scope.simpanVerifikasiNew = function () {
				if (dataOrder.length == 0) {
					alert("Pilih produk terlebih dahulu !")
					return;
				}
				var subTotal = 0;
				for (var i = dataOrder.length - 1; i >= 0; i--) {
					var petugasLayanan = [];
					subTotal = subTotal + parseFloat(dataOrder[i].totalK)
					if (dataOrder[i].petugas != undefined) {
						dataOrder[i].petugas.forEach(function (a) {
							if (dataOrder[i].no == a.idParent) {
								petugasLayanan.push({
									// "objectjenispetugaspefk": a.jenisPetugas.id,
                                    "objectpegawaifk": a.petugas.id,
                                    "objectjenispegawaifk": a.petugas.objectjenispegawaifk,
									// "listpegawai": a.listPetugas,
								})
							}
						})
					} else {
						petugasLayanan = [];
					}
					dataOrder[i].petugas = petugasLayanan
				}
				if (subTotal == undefined || subTotal == 0) {
					alert("Total tidak Boleh Kosong !")
					return;
				}
				var objSave = {
					norec: norec ?? null,
					kelompoktransaksifk: 9,
					keteranganlainnya: $scope.item.keterangan,
					namapasien: $scope.item.namaPasien_klien,
					notelp_klien: $scope.item.noTelp_klien,
					tglstruk: moment($scope.item.tglStruk).format('YYYY-MM-DD hh:mm:ss'),
					totalharusdibayar: parseFloat(subTotal),//parseFloat($scope.item.totalBilling),
					details: dataOrder,
				}
                console.log(objSave);
				medifirstService.post('ambulance/save-input-non-layanan-verif',objSave).then(function (data) {
					// if ($scope.KelompokUser != $scope.KelompokUserDiklit) {
					// 	noRegistrasi2 = data.data.data.norec
					// 	// $scope.changePage("PenerimaanPembayaranKasir");
					// }else{
					// 	window.history.back();
					// }
					
				})
			}

            $scope.gridPetugasPelaksana = new kendo.data.DataSource({
				data: []
			})

            $scope.detailGridOptions = function (dataItem) {
				return {
                dataSource: {
                    data: $scope.gridPetugasPelaksana._data,
                    filter: { field: "idParent", operator: "eq", value: dataItem.no }
                },
                columns: [
                    {
                    field: "jenisPetugas.jenisPelaksana",
                    title: "Jenis Pelaksana",
                    width: "100px",
                    template: "#= jenisPetugas.jenisPelaksana #"
                    },
                    {
                    field: "listPetugas[0].namalengkap",
                    title: "Nama Pegawai",
                    width: "200px",
                    template: multiSelectArrayToString
                    }
                ]
                };
			}

            function multiSelectArrayToString(item) {
				if (item.listPetugas !== "") {
					return item.listPetugas.map(function (elem) {
						return elem.namalengkap
					}).join(", ");
				}
			};


            //********************************  $scope.cekBelumVerifs=true;***

        }
    ]);
});
