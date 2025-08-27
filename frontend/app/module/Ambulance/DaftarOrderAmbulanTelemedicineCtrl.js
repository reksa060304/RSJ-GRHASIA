define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('DaftarOrderAmbulanTelemedicineCtrl', ['$scope', '$state', 'CacheHelper', '$parse', 'DateHelper', '$window', 'MedifirstService',
        function ($scope, $state, cacheHelper, $parse, dateHelper, $window, medifirstService) {
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
            var dataProduk = [];

            let dataOrder = []
            let data2 = []

            $scope.item.belumVerifikasi = true;
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                    init();
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                    init();
                } else {
                    return;
                }
            }

            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                toastr.info('No Order : ' + data.nostruk + ' dipilih ', 'Info')
                $scope.dataSelected = data;
                
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
                    $scope.listPegawai = data;
                });

                medifirstService.get("ambulance/data/get-combo-telemedicine")
                    .then(function (da) {
    
                        $scope.listJenisKegiatan = new kendo.data.DataSource({
                            data: da.data.jeniskegiatan.map(function(item) {
                                return {
                                    id: item.id,
                                    namajeniskegiatan: item.namajeniskegiatan || item.namajeniskegiatan 
                                };
                            })
                        });
                        $scope.listDokter = da.data.dokter;
                        $scope.listPerawat = da.data.perawat;
                        $scope.listSupir = da.data.pegawai;
                        $scope.listAmbulan = da.data.nopol;
                        $scope.listVerifikasi = [
                            {id: 1, jenis: "Diterima"},
                            {id: 2, jenis: "Ditolak"}
                        ]
                    })
            }
            function init() {
                $scope.isRouteLoading = true;
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

                medifirstService.get("ambulance/get-data-order-ambulan-dari-telemedicine?" +
                    isNotVerif +
                    tglAwal +
                    tglAkhir +
                    rm +
                    nm
                    + noOrderan
                    + jmlRow
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                        }

                        var data = dat.data.data
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].status) {
                                case "MENUNGGU":
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                case "DITERIMA":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
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
                cacheHelper.set('DaftarOrderAmbulanTelemedicineCtrl', chacePeriode);
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

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            $scope.verifikasi = function () {
                if ($scope.dataSelected.status == "DITERIMA") {
                    toastr.error("Data Sudah diverifikasi tidak bisa di verifikasi kembali");
                    return;
                }

                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                
                $scope.btnSimpanVis = false
                $scope.headerVerif = $scope.dataSelected;
                $scope.item.noOrder = $scope.dataSelected.nostruk
                $scope.item.namaPasiens = $scope.dataSelected.namapasien

                $scope.popUpVerif.center().open();
                loadDataVerif();
            }
            function loadDataVerif() {
                $scope.isRouteLoading = true;
                data2 = []
                if (!$scope.popUp) {
                    $scope.popUp = {};
                }

                if (!$scope.popUp.kegiatan) {
                    $scope.popUp.kegiatan = $scope.listJenisKegiatan.data()[0] || {
                        id: 1,
                        namajeniskegiatan: "Menjemput Pasien"
                    };
                }

                $scope.$watch('popUp.kegiatan', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.popUp.kegiatan = newVal;
                    }
                });

                medifirstService.get("ambulance/get-data-detail-order-ambulan-dari-telemedicine?norec=" + $scope.dataSelected.norec, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var dataSource = dat.data.data;
                        
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].no = i + 1
                            data2.push(dataSource[i])
                        }

                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargatotal: { type: "number" }
                                    }
                                }
                            }, aggregate: [
                                { field: 'hargatotal', aggregate: 'sum' },
                            ]
                        });

                    });
            }

            // masukan data ke tabel verif
            $scope.columnVerif = {
                pageable: true,
                scrollable: true,
                columns : [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "200px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Jumlah",
                        "width": "70px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga",
                        "width": "140px"
                    },
                    {
                        "field": "hargatotal",
                        "title": "Total",
                        "width": "90px"
                    },
                    {
                        "field": "jarak",
                        "title": "Jarak (Kilometer)",
                        "width": "90px"
                    },
                    {
                        "field": "address",
                        "title": "Alamat",
                        "width": "200px"
                    },
                    {
                        "field": "s",
                        "title": "S",
                        "width": "100px",
                    },
                    {
                        "field": "o",
                        "title": "O",
                        "width": "100px",
                    },
                    {
                        "field": "a",
                        "title": "A",
                        "width": "100px",
                    },
                    {
                        "field": "p",
                        "title": "P",
                        "width": "100px",
                    },
                    {
                        "field": "totalskor",
                        "title": "Skor Panssec",
                        "width": "100px",
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "900px",
                        "encoded": false,
                    }                    
                ]
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
                ClearIsian();
            }

            $scope.simpanVerifikasi = function () {
                if ($scope.popUp == undefined || $scope.popUp == '' || $scope.popUp == null) {
                    toastr.error('Isi data terlebih dahulu !!')
                    return
                }

                if ($scope.popUp.noPolisi == undefined || $scope.popUp.noPolisi == '' || $scope.popUp.noPolisi == null) {
                    toastr.error('Kendaraan Harus Di isi')
                    return
                }

                if ($scope.popUp.driver == undefined || $scope.popUp.driver == '' || $scope.popUp.driver == null) {
                    toastr.error('Driver Harus Di isi')
                    return
                }

                if ($scope.popUp.verifikasiOrder == undefined || $scope.popUp.verifikasiOrder == '' || $scope.popUp.verifikasiOrder == null) {
                    toastr.error('Harus Diverifikasi')
                    return
                }

                if (!$scope.selectedPegawai || !$scope.selectedPegawai.length || !$scope.item.jenisPelaksana) {
                    toastr.error('Petugas 1 (Jenis dan Pegawai) harus diisi');
                    return;
                }

                // Valiadai agar tidak duplikat data pegawai
                $scope.validateStaffRoles = function() {
                    var roles = [];
                    
                    if ($scope.item.jenisPelaksana) {
                        roles.push($scope.item.jenisPelaksana.id);
                    }
                    
                    if ($scope.item.jenisPelaksana2) {
                        if (roles.includes($scope.item.jenisPelaksana2.id)) {
                            toastr.error('Jenis petugas tidak boleh sama!');
                            $scope.item.jenisPelaksana2 = null;
                            return false;
                        }
                        roles.push($scope.item.jenisPelaksana2.id);
                    }
                    
                    if ($scope.item.jenisPelaksana3) {
                        if (roles.includes($scope.item.jenisPelaksana3.id)) {
                            toastr.error('Jenis petugas tidak boleh sama!');
                            $scope.item.jenisPelaksana3 = null;
                            return false;
                        }
                        roles.push($scope.item.jenisPelaksana3.id);
                    }
                    
                    return true;
                };

                var petugas1 = null, petugas2 = null, petugas3 = null;

                // Petugas 1 (wajib)
                petugas1 = {
                    objectjenispetugaspefk: $scope.item.jenisPelaksana.id,
                    objectpegawaifk: $scope.selectedPegawai[0].id,
                    jenis: $scope.item.jenisPelaksana.jenispetugaspe,
                    pegawai: $scope.selectedPegawai[0]
                };
                
                // Petugas 2 (opsional)
                if ($scope.item.jenisPelaksana2 && $scope.selectedPegawai2 && $scope.selectedPegawai2.length > 0) {
                    petugas2 = {
                        objectjenispetugaspefk: $scope.item.jenisPelaksana2.id, 
                        objectpegawaifk: $scope.selectedPegawai2[0].id,
                        jenis: $scope.item.jenisPelaksana2.jenispetugaspe,
                        pegawai: $scope.selectedPegawai2[0]
                    };
                }
                
                // Petugas 3 (opsional)
                if ($scope.item.jenisPelaksana3 && $scope.selectedPegawai3 && $scope.selectedPegawai3.length > 0) {
                    petugas3 = {
                        objectjenispetugaspefk: $scope.item.jenisPelaksana3.id,
                        objectpegawaifk: $scope.selectedPegawai3[0].id, 
                        jenis: $scope.item.jenisPelaksana3.jenispetugaspe,
                        pegawai: $scope.selectedPegawai3[0]
                    };
                }

                var dataPost = $scope.sourceVerif._data;                
                var petugas = [];
                if (petugas1) petugas.push(petugas1);
                if (petugas2) petugas.push(petugas2);
                if (petugas3) petugas.push(petugas3);

                var driverData = petugas1.pegawai; // Ambil dari petugas pertama sebagai driver
                
                var itemsave = {
                    "bridging_data": dataPost,
                    "nomor_order": $scope.dataSelected.nostruk,
                    "nocm": $scope.headerVerif.nocm,
                    "norec_sp": $scope.dataSelected.norec,
                    "kendaraan": $scope.popUp.noPolisi.norec,
                    "kendaraan_nopolisi": $scope.popUp.noPolisi.nopolisi,
                    "kendaraan_uuid_telemedicine": $scope.popUp.noPolisi.uuid_telemedicine,

                    "driver_id": $scope.popUp.driver.id,
                    "driver_nama_lengkap": $scope.popUp.driver.namalengkap,
                    "driver_uuid_telemedicine": $scope.popUp.driver.uuid_telemedicine,
                    "kegiatan_id": $scope.popUp.kegiatan ? $scope.popUp.kegiatan.id : null,
                    "kegiatan_nama": $scope.popUp.kegiatan ? $scope.popUp.kegiatan.namajeniskegiatan : null,
                    "verifikasi": $scope.popUp.verifikasiOrder.jenis,
                    "petugaspelayananambulan": petugas.map(p => ({
                        objectjenispetugaspefk: p.objectjenispetugaspefk,
                        objectpegawaifk: p.objectpegawaifk,
                        uuid_telemedicine: p.pegawai.uuid || p.pegawai.uuid_telemedicine || p.uuid_telemedicine
                    })),
                    "messages": $scope.popUp.messages,
                }

                console.log('Data yang akan dikirim:', itemsave);
                console.log('Petugas data:', petugas);
                console.log('Driver data:', driverData);

                $scope.btnSimpanVis = true;
                medifirstService.post('ambulance/simpan-data-pelayanan-ambulan-dari-telemedicine', itemsave)
                    .then(function (response) {
                        console.log('Response berhasil:', response);
                        toastr.success('Verifikasi berhasil disimpan');
                        $scope.popUpVerif.close();
                        init();
                        ClearIsian();
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                        toastr.error('Gagal menyimpan verifikasi: ' + (error.data ? error.data.message : error.message));
                    })
                    .finally(function() {
                        $scope.btnSimpanVis = false;
                    });
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
            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var status = kendoGrid.dataItem(row).status;
                    switch (status) {
                        case "MENUNGGU":
                            $(row.cells).addClass("grey");
                            break;
                        case "DITERIMA":
                            $(row.cells).addClass("green");
                            break;
                    }
                }
            }
            // tanda1
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
                        "field": "nostruk",
                        "title": "No Order",
                        "width": "100px"
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Order",
                        "template": "#= new moment(new Date(tglstruk)).format('DD-MM-YYYY HH:mm') #",
                        "width": "100px"
                    },                    
                    {
                        "field": "tanggal_jemput",
                        "title": "Tgl Jemput",
                        "template": "#= tanggal_jemput ? new moment(new Date(tanggal_jemput)).format('DD-MM-YYYY HH:mm') : '' #",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rekam Medis",
                        "width": "70px"
                    },
                    {
                        "field": "namapasien_klien",
                        "title": "Nama Pemesan",
                        "width": "150px"
                    },
                    {
                        "field": "noteleponfaks",
                        "title": "Nomor Telepon Pemesan",
                        "width": "120px"
                    },
                    {
                        "field": "nama_pasien",
                        "title": "Nama Pasien",
                        "width": "150px"
                    },
                    {
                        "field": "totalharusdibayar",
                        "title": "Total",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "100px"
                    },
                    {
                        "field": "jenis_kegiatan",
                        "title": "Jenis Order",
                        "width": "200px"
                    }
                ]
            }

            // tanda1
            function ClearIsian() {
                $scope.dataSelected = undefined
                $scope.sourceVerif = undefined
                $scope.popUp = undefined
                $scope.headerVerif = undefined;
                $scope.item.noOrder = undefined
                $scope.item.namaPasiens = undefined;
                $scope.item.jenisPelaksana = undefined;
                $scope.item.jenisPelaksana2 = undefined;
                $scope.item.jenisPelaksana3 = undefined;
            }
            //********************************  $scope.cekBelumVerifs=true;***

            $scope.cetakSuratTugasAmbulan = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                if ($scope.dataSelected == null) {
                    toastr.error("Pilih data yang ingin di cetak");
                    return;
                }
                
                if ($scope.dataSelected.status !== "DITERIMA") {
                    toastr.error("Data harus diverifikasi terlebih dahulu");
                    return;
                }
                
                window.open(config.baseApiBackend + 
                    "report/get-cetak-surat-tugas-ambulan-telemedicine?norec=" + $scope.dataSelected.norec + 
                    "&kdprofile=" + profile,'_blank');
            }

            $scope.isinomersurat = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
            
                if ($scope.dataSelected.status !== "DITERIMA") {
                    toastr.error("Data harus diverifikasi terlebih dahulu");
                    return;
                }
                
                // Set nomor surat yang sudah ada jika tersedia
                $scope.item.nomorSurat = $scope.dataSelected.nomorsurat || ''; 
                $scope.popUpNomorSurat.center().open();
            }
            
            $scope.simpanNomorSurat = function () {
                if (!$scope.item.nomorSurat) {
                    toastr.error('Nomor surat harus diisi');
                    return;
                }
            
                var dataSimpan = {
                    norec: $scope.dataSelected.norec,
                    nomorsurat: $scope.item.nomorSurat,
                    dasarsurat: $scope.item.dasarSurat,
                };
            
                medifirstService.post('ambulance/simpan-nomor-surat-ambulan', dataSimpan)
                    .then(function (response) {
                        if (response.data.status) {
                            toastr.success(response.data.message);
                            $scope.popUpNomorSurat.close();
                            init();
                        } else {
                            toastr.error(response.data.message);
                        }
                    })
                    .catch(function(error) {
                        toastr.error('Terjadi kesalahan saat menyimpan nomor surat');
                    });
            }
            
            $scope.batalNomorSurat = function () {
                $scope.popUpNomorSurat.close();
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
				$scope.pelaksanaAmbulan3 = true;
				$scope.show = false;
				$scope.show2 = false;
				$scope.show3 = true;
			};
			$scope.hapusPelaksanaAmbulan2 = function () {
				$scope.show = true;
				$scope.show2 = false;
				$scope.pelaksanaAmbulan2 = false;
				$scope.item.jenisPelaksana2 = "";
				$scope.selectedPegawai2 = [];
			};
			$scope.hapusPelaksanaAmbulan3 = function () {
				$scope.show = false;
				$scope.show2 = true;
				$scope.pelaksanaAmbulan3 = false;
				$scope.item.jenisPelaksana3 = "";
				$scope.selectedPegawai3 = [];
			};
            $scope.isInArray = function (value, array) {
				return array.indexOf(value) > -1;
			}

			$scope.listIdPetugas = [13827, 176873]
			$scope.selectedPegawai = [];
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
			$scope.selectedPegawai2 = [];
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
			$scope.selectedPegawai3 = [];
			$scope.init3 = function () {
				var id = $scope.item.jenisPelaksana3.id;
				var model = 'dataSource3';
				var listArray = 'selectedPegawai3';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};

            medifirstService.get("tatarekening/tindakan/get-combo-telemedicine", true)
				.then(function (da) {
					$scope.listJenisPelaksana = da.data.jenispelaksana;
					$scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
					// $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
					if ($scope.pegawaiLogin.jenisPetugas != undefined) {
						if ($scope.pegawaiLogin.jenisPetugas.length > 0) {
							$scope.item.jenisPelaksana = { id: $scope.pegawaiLogin.jenisPetugas[0].id, jenispetugaspe: $scope.pegawaiLogin.jenisPetugas[0].jenispetugaspe };
							var id = $scope.pegawaiLogin.jenisPetugas[0].id;
							var model = 'dataSource';
							var listArray = 'selectedPegawai';
							var isInList = $scope.isInArray(id, $scope.listIdPetugas);
							if (isInList) {
								getGenericPegawai(model, listArray);
							} else {
								getPegawaiById(id, model, listArray);
							}
						}
					} else {
						// medifirstService.get("tatarekening/tindakan/get-jenispetugasbypegawai?idPegawai=" + $scope.pegawaiLogin.id, true).then(function (dat) {
						// 	//var id = $scope.item.jenisPelaksana.id;dat.data.jenispelaksana
						// 	$scope.item.jenisPelaksana = { id: dat.data.jenispelaksana[0].id, jenispetugaspe: dat.data.jenispelaksana[0].jenispetugaspe };
						// 	var id = dat.data.jenispelaksana[0].id;
						// 	var model = 'dataSource';
						// 	var listArray = 'selectedPegawai';
						// 	var isInList = $scope.isInArray(id, $scope.listIdPetugas);
						// 	if (isInList) {
						// 		getGenericPegawai(model, listArray);
						// 	} else {
						// 		getPegawaiById(id, model, listArray);
						// 	}
						// });

					}

				})


            function getPegawaiById(id, input, output) {
				//console.log($scope.selectedPegawai);
				var selectedData = $parse(output);
				selectedData.assign($scope, []);
				var model = $parse(input);
				medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function (dat) {
					$scope.listPegawai = new kendo.data.DataSource({
						data: dat.data.jenispelaksana
					});
					// $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
					model.assign($scope, $scope.listPegawai);

					var cookie = document.cookie.split(';');
					cookie = cookie[0].split('=');
					// if (cookie[1] == 'dokter')
					// $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]
					console.log($scope.pegawaiLogin)
					
				});
			}

             $scope.InputTagihan = function () {
                $state.go('InputTagihanNonlayananAmbulan')
            }
            
            // batas

        }
    ]);
});
