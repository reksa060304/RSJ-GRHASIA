define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('DaftarPenelitianEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem', '$mdDialog', '$timeout',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem, $mdDialog, $timeout) {
            $scope.item = {};
            $scope.itemMa = {};
            $scope.isRouteLoading = false;
            $scope.cetakkwd = false
            $scope.now = new Date();
            $scope.item.tahun = moment($scope.now).format('YYYY')
            $scope.item.bulan = moment($scope.now).format('MM')
            $scope.strukpelayananpenjamin = '';
            var cachetglawal = "";
            // if (cacheHelper.get('DaftarPenelitianEksternalCtrl')) {
            //     $scope.item.tglawal = new moment(cacheHelper.get('DaftarPenelitianEksternalCtrl')[0]).format('YYYY-MM-DD 00:00');
            //     $scope.item.tglakhir = new moment(cacheHelper.get('DaftarPenelitianEksternalCtrl')[1]).format('YYYY-MM-DD 23:59');
            // }else{
            //     $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
            //     $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
            // }
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.item.tanggalmulai = new moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tanggalselesai = new moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.tglpembayaran = false
            var norec = "";
			var dataProduk = [];
            getCombo()
            GetData()
            getDataMahasiswa()
            getDataDetailMahasiswa()
            function getDataDetailMahasiswa(){
                var tahun = ''
                if ($scope.item.tahun != undefined) {
                    tahun = "&tahun=" + moment($scope.item.tahun).format('YYYY')
                }
                var bulan =''
                if($scope.item.bulan != undefined){
                    bulan = "bulan=" + moment($scope.item.bulan).format('MM')
                }
                var instansi = '';
                if ($scope.item.instansi != undefined){
                    instansi = "&instansi=" + $scope.item.instansi.datakampus
                }
                var kegiatan = ''
                if($scope.item.kegiatan != undefined){
                    kegiatan = '&kegiatan='+ $scope.item.kegiatan.id
                }
                var pendidikan = ''
                if ($scope.item.pendidikan != undefined) {
                    pendidikan = '&pendidikan=' + $scope.item.pendidikan.pendidikan
                }
                medifirstService.get('diklat/get-data-detail-mahasiswa?' + bulan + tahun + instansi + kegiatan+pendidikan).then(function(data){
                    for (let i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataDetailMahasiswaGrid = new kendo.data.DataSource({
                        data: data.data.data,
                        total: data.data.data.length,
                        serverPaging: false,

                    })
                })
            }
            $scope.searchDetailMahasiswa = function(){
                getDataDetailMahasiswa()
            }
            $scope.tambahmahasiswa = function (current) {
                if ($scope.current == undefined) {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                var chacePeriode = {
                    0: $scope.current,
                    1: 'EditPenelitianEksternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
            cacheHelper.set('DaftarPenelitianEkstenalCtrl', chacePeriode);
            $state.go('TambahMahasiswa', {
                norec: $scope.current,
                noOrder: 'EditPenelitianEksternal'
            });
            }

            $scope.listStatusBayar = [
                {'id': 1,
                statusbayar: "Sudah Bayar"
                }, {
                    'id': 2,
                    statusbayar: "Belum Bayar"
            }]
            $scope.listStatusVerif = [{
                'id': 1,
                statusverif: "Sudah Verif"
            }, {
                'id': 2,
                statusverif: "Belum Verif"
            }]

            if (medifirstService.getKelompokUser() != 'diklit') {
                $scope.verif = false
                $scope.tagih = false
                $scope.daftarmahasiswa = true
                $scope.columnPenelitian = {
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Kegiatan Diklat Eksternal" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "Data kegiatan Daftar External",
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
                    sortable: true,
                    resizable: true,
                    groupable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "10%"
                        },
                        {
                            "field": "diklatkategori",
                            "title": "Jenis Diklat",
                            "width": "15%"
                        },
                        {
                            "field": "detailjenisproduk",
                            "title": "Kegiatan",
                            "width": "20%"
                        },
                        {
                            "field": "jumlahpeserta",
                            "title": "Peserta",
                            "width": "20%"
                        },
                        {
                            "field": "tanggalmulai",
                            "title": "Tanggal",
                            "width": "20%",
                            // "template": "<span class='style-center'>#: tanggalmulai # s/d #: tanggalselesai #</span>",
                            "footerTemplate": "TOTAL"
                        },
                        {
                            "title": "Status Bayar",
                            "width": "50px",
                            "template": "<span class='style-center'>#: nosbmlastfk != null || nosbklastfk != null  ? 'Lunas': 'Belum Bayar' #</span>"
                        },
                        {
                            "field": "biayapenelitian",
                            "title": "Biaya",
                            "width": "20%",
                            "template": "<span class='style-right'>{{formatRupiah('#: biayapenelitian #', 'Rp. ')}}</span>",
                            aggregates: ['sum'],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.biayapenelitian.sum #', 'Rp. ')}}</span>",
                        },
                        {
                            'command': [{
                                    text: "Invoice",
                                    click: cetakInvoice,
                                },

                            ],
                            "width": 100
                        },
                        
                    ]
                }
            } else {
                $scope.daftarmahasiswa = false
                $scope.verif = true
                $scope.tagih = true
                
                
                $scope.columnPenelitian2 = {
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Kegiatan Diklat Eksternal" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "Data kegiatan Daftar External",
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
                    sortable: true,
                    resizable: true,
                    groupable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "10px"
                        },
                        {
                            "field": "institusipendidikan",
                            "title": "Institusi Pendidikan",
                            "width": "50px"
                        },
                        {
                            "field": "diklatkategori",
                            "title": "Jenis Diklat",
                            "width": "50px"
                        },
                        {
                            "field": "detailjenisproduk",
                            "title": "Kegiatan",
                            "width": "50px"
                        },
                        {
                            "field": "jumlahpeserta",
                            "title": "Peserta",
                            "width": "20px"
                        },
                        {
                            "field": "tanggalmulai",
                            "title": "Tanggal",
                            "width": "50px",
                            // "template": "<span class='style-center'>#: tanggalmulai # s/d #: tanggalselesai #</span>"
                        },
                        {
                            "title": "Verif",
                            "width": "50px",
                            "template": "<span class='style-center'>#: noregistrasifk != null ? 'Sudah diverif': 'Belum diverif' #</span>"
                        },
                        {
                            "title": "Status Bayar",
                            "width": "50px",
                            "template": "<span class='style-center'>#: nosbmlastfk != null ? 'Lunas': details.length > 0 && nosbmlastfk == null ? 'Belum Lunas': 'Belum Bayar' #</span>"
                        },
                        {
                            "field": "biayapenelitian",
                            "title": "Biaya",
                            "width": "20%",
                            "template": "<span class='style-right'>{{formatRupiah('#: biayapenelitian #', 'Rp. ')}}</span>",
                            aggregates: ['sum'],
                            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.biayapenelitian.sum #', 'Rp. ')}}</span>",
                        },
                        {
                            'command': [
                                {
                                    text: "Invoice",
                                    click: cetakInvoice,
                                },
                                {
                                text: "nametag",
                                click: cetaknametag,
                            }, {
                                text: "Cetak Hasil Kegiatan",
                                click: cetakhasilkegiatan,
                            }],
                            "width": 80
                        },
                    ],
                }
                $scope.columnDetailMahasiswaGrid = {
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Mahasiswa Semua Instansi" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.mergedCells = ["A1:G1", "A2:G2"];
                        sheet.frozenRows = 2;
                        sheet.name = "Report";
                        var instansi = '';
                        var bulan = '';
                        if($scope.item.instansi != undefined){
                            instansi = $scope.item.instansi.datakampus
                        } else if ($scope.item.instansi == undefined) {
                            instansi = 'Semua Instansi'
                        }
                        if($scope.item.bulan != undefined){

                            bulan = 'Bulan ' + dateHelper.getBulanFormatted(new Date($scope.item.bulan)).split(" ")[0]
                            // moment($scope.item.bulan).format('MMMM')
                        }
                        var myHeaders = [{
                            value: "Data Mahasiswa "+ instansi,
                            fontSize: 16,
                            textAlign: "center",
                            background: "#ffffff",
                        }];
                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            height: 25
                        });
                        var myheader2 = [{
                            value: bulan + " Tahun "+ moment($scope.item.tahun).format('YYYY'),
                            fontSize: 14,
                            textAlign: "center",
                            background: "#ffffff",
                        }];
                        sheet.rows.splice(1, 0, {
                            cells: myheader2,
                            type: "header",
                            height: 25
                        });
                    },
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "25px"
                        },
                        {
                            "field": "nama",
                            "title": "Nama Mahasiswa",
                            "width": "200px"
                        },
                        {
                            "field": "nim",
                            "title": "NIM",
                            "width": "100px"
                        },
                        {
                            "field": "kegiatan",
                            "title": "Kegiatan",
                            "width": "120px"
                        },
                        {
                            "field": "institusipendidikan",
                            "title": "Instalasi Asal",
                            "width": "135px",
                        },
                        {
                            "field": "pendidikan",
                            "title": "Pendidikan",
                            "width": "180px",
                        },
                        {
                            "field": "diklatkategori",
                            "title": "Jenis",
                            "width": "85px",
                        },
                    ]
                }
            }
            function cetakInvoice(e){
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "norec": dataItem.norec
                }
                window.open(baseTransaksi + "report/diklat-invoice?norec=" + dataItem.norec);
            }
            $scope.columnMahasiswaAktif = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Mahasiswa Aktif" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "20px"
                    },
                    {
                        "field": "institusipendidikan",
                        "title": "Institusi Pendidikan",
                        "width": "100px"
                    },
                    {
                        "field": "nama",
                        "title": "Nama Lengkap",
                        "width": "100px"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "40px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pembimbing",
                        "width": "100px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "70px"
                    },
                    {
                        "field": "periode",
                        "title": "Periode",
                        "width": "80px"
                    },
                    
                ]
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            function GetData() {
                $scope.isRouteLoading = true;
                var tglAwal="";
                var tglAkhir = "";
                if ($scope.item.tglawal != undefined && $scope.item.tglakhir != undefined) {
                    tglAwal = "&tglawal=" + moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                    tglAkhir = "&tglakhir=" + moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                }
                var NamaPeneliti = "";
                // if ($scope.item.NamaPeneliti !== undefined) {
                //     NamaPeneliti = "&NamaPeneliti=" + $scope.item.NamaPeneliti
                // }
                // var Fakultas = "";
                // if ($scope.item.Fakultas !== undefined) {
                //     Fakultas = "&Fakultas=" + $scope.item.Fakultas.id;
                // }
                var InstitusiPendidikan = "";
                if ($scope.item.institusipendidikan !== undefined) {
                    InstitusiPendidikan = "&Fakultas=" + $scope.item.institusipendidikan;
                }
                var usr = ''
                if (medifirstService.getKelompokUser() != 'diklit') {
                    usr = "user=" + medifirstService.getUserLogin().kdUser;
                }
                var statusbayar = '';
                if ($scope.item.statusbayar != undefined) {
                    statusbayar = "&statusbayar=" + $scope.item.statusbayar.id
                }
                // return
                var modelid = "&modelid="+ModelItem.getPegawai().id;
                var kegiatandiklat= ''
                if ($scope.item.kegiatandiklat != undefined){
                    kegiatandiklat = "&kegiatandiklat=" + $scope.item.kegiatandiklat.id
                }
                var statusverif = '';
                if ($scope.item.statusverif != undefined) {
                    statusverif = "&statusverif=" + $scope.item.statusverif.id
                }
                medifirstService.get("sdm/penelitian/get-daftar-penelitian-eksternal?" + usr + tglAwal + tglAkhir + InstitusiPendidikan + modelid + statusbayar + kegiatandiklat + statusverif, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }
                        $scope.idpegawai = dat.data.idpegawai[0].usereksternal;
                        
                        $scope.DataPenelitian = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            schema: {
                                model: {
                                    fields: {
                                        institusipendidikan: {
                                            type: "string"
                                        },
                                        biayapenelitian: {
                                            type: "number"
                                        }
                                    }
                                }
                            },
                            aggregate: [{
                                field: "biayapenelitian",
                                aggregate: "sum"
                            }],
                            pageSize: 20,
                            serverPaging: false,
                        });

                        var chacePeriode = {
                            0: $scope.item.tglawal,
                            1: $scope.item.tglakhir,
                            2: '',
                            3: '',
                            4: '',
                            5: '',
                            6: ''
                        }
                        cacheHelper.set('DaftarPenelitianEksternalCtrl', chacePeriode);
                
                });
            }
            $scope.SearchDataMahasiswa = function(){
                getDataMahasiswa()
            }
            function getDataMahasiswa() {
                $scope.isRouteLoading = true
                var tanggalmulai = "tanggalmulai=" + moment($scope.item.tanggalmulai).format('YYYY-MM-DD HH:mm');
                var tanggalselesai = "&tanggalselesai=" + moment($scope.item.tanggalselesai).format('YYYY-MM-DD HH:mm');
                var jeniskegiatan = "";
                var mahasiswa = "";
                var institusipendidikan = "";
                if($scope.item.jeniskegiatan != undefined){
                    jeniskegiatan ="&jeniskegiatan="+$scope.item.jeniskegiatan.id
                }
                if($scope.itemMa.institusipendidikan != undefined){
                    institusipendidikan = "&institusipendidikan=" + $scope.itemMa.institusipendidikan
                }
                if ($scope.itemMa.mahasiswa != undefined) {
                    mahasiswa = "&mahasiswa=" + $scope.itemMa.mahasiswa
                }
                medifirstService.get("sdm/penelitian/get-daftar-mahasiswa-aktif?"+jeniskegiatan+mahasiswa+institusipendidikan).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        datas[i].periode = moment(datas[i].tanggalmulai).format('YYYY-MM-DD') + " S.D " + moment(datas[i].tanggalselesai).format('YYYY-MM-DD')
                    }
                    // $scope.idpegawai = dat.data.idpegawai[0].usereksternal;

                    $scope.DataMahasiswaAktif = new kendo.data.DataSource({
                        data: datas,
                        total: datas.length,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },

                        pageSize: 20,
                        serverPaging: false,
                        serverFiltering: true,
                        serverSorting: true
                    });

                    

                });
            }
            $scope.SearchData = function (e) {
                GetData()
            }

            $scope.ClearData = function () {
                $scope.item = {};
            }

            $scope.kl = function (current) {
                // toastr.info(current.norec + " Terpilih");
                $scope.current = current.norec;
                $scope.biayapenelitian = current.biayapenelitian;
                $scope.keteranganlainnya = current.detailjenisproduk;
                $scope.notelp = current.notelp;
                $scope.institusi = current.institusipendidikan;
                $scope.objectprodukfk = current.objectprodukfk
                $scope.jumlahpeserta = current.jumlahpeserta
                $scope.qty = current.qty
                $scope.hargasatuan = current.hargasatuan
                $scope.norec_sp = current.norec_sp
                $scope.statusBayar = current.nosbmlastfk
                $scope.nostruk = current.nostruk
                $scope.isverifikasi = current.isverifikasi
                $scope.count = current.count
                $scope.tanggalmulai = current.tanggalmulai
                $scope.noRegistrasi = current.noregistrasifk
                $scope.strukpelayananpenjamin = current.norec_spp
                if (medifirstService.getKelompokUser() == 'diklit') {
                    if (current.noregistrasifk != null) {
                        $scope.verif = false;
                        $scope.batalverif = true;
                        $scope.tglpembayaran = true
                    } else {
                        $scope.verif = true;
                        $scope.batalverif = false;
                        $scope.tglpembayaran = false

                    }

                    if (current.isverifikasi == 0) {
                        $scope.unveriftagih = false
                        $scope.tagih = true
                    } else if (current.isverifikasi == null && current.noregistrasifk != null) {
                        $scope.unveriftagih = true
                        $scope.tagih = false
                    } else {
                        $scope.tagih = true
                        $scope.verif = true
                        $scope.unveriftagih = false
                        $scope.batalverif = false;
                    }
                }
                
                
            }

            $scope.Ubah = function (current) {
                if ($scope.current == undefined) {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                // if ($scope.statusBayar != null) {
                //     toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Diubah !")
                //     return;
                // }
                var chacePeriode = {
                    0: $scope.current,
                    1: 'EditPenelitianEksternal',
                    2: $scope.idpegawai,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
                $state.go('PenelitianEksternal', {
                    norec: $scope.current,
                    noOrder: 'EditPenelitianEksternal'
                });
            }
            

            $scope.Hapus = function () {
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus kegiatan ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');
                    $mdDialog.show(confirm).then(function () {
                        $scope.isRouteLoading = true
                        if ($scope.count > 0) {
                        $scope.isRouteLoading = false
                            toastr.error("Informasi, Sudah ada data mahasiswa record tidak bisa dihapus....!")
                            return;
                        }

                        if ($scope.isverifikasi != null) {
                            $scope.isRouteLoading = false
                            toastr.error("Informasi, Data Sudah Diverif Tidak Bisa Dihapus !")
                            return;
                        }
                        if ($scope.statusBayar != null) {
                            $scope.isRouteLoading = false
                            toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa diHapus !")
                            return;
                        }
                        var objSave = {
                            norec: $scope.current
                        }

                        medifirstService.post('sdm/penelitian/batal-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                            GetData()
                        })
                    })
            }
            
            
            $scope.verifikasi = function(){
                $scope.isRouteLoading = true
                if ($scope.statusBayar != null) {
                    $scope.isRouteLoading = false
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Verif Kembali !")
                    return;
                }
                
                dataProduk = [{
                    id: $scope.objectprodukfk,
                    harga: $scope.hargasatuan,
                    jumlah: $scope.jumlahpeserta,
                    qtyoranglast: $scope.qty,
                    keterangan: $scope.keteranganlainnya
                }]
                var objSave = {
                    norec: norec,
                    kelompoktransaksifk: 13,
                    keteranganlainnya: $scope.keteranganlainnya,
                    namapasien_klien: $scope.institusi,
                    notelp_klien: $scope.notelp,
                    tglstruk: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    totalharusdibayar: parseFloat($scope.biayapenelitian), //parseFloat($scope.item.totalBilling),
                    isverifikasi: false,
                    details: dataProduk,
                }
                medifirstService.post('kasir/save-input-non-layanan', objSave).then(function (data) {
                    var data = {
                        "verif": 'true',
                        norec: $scope.current,
                        noregistrasifk: data.data.data.norec,
                    }
                    var objSave = {
                        data: data,
                    }
                    medifirstService.post('sdm/penelitian/verif-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                        GetData();
                        $scope.isRouteLoading = false
                    })
                })
            }

            $scope.batalverifikasi = function(){
                $scope.isRouteLoading = true
                if ($scope.current == undefined || $scope.current == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;

                }
                if($scope.isverifikasi == null){
                toastr.error('Sudah Verif Tagihan', 'Info');
                $scope.isRouteLoading = false
                return;
                }
                if ($scope.statusBayar != null) {
                    $scope.isRouteLoading = false
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Unverifikasi !")
                    return;
                }

                var objSave = {
                    norec: $scope.norec_sp,
                    nostruk: $scope.nostruk,
                }

                medifirstService.post('kasir/hapus-transaksi-non-layanan', objSave).then(function (data) {
                    GetData();
                    var data = {
                        "verif": 'true',
                        norec: $scope.current,
                        noregistrasifk: null,
                    }
                    var objSave = {
                        data: data,

                    }

                    medifirstService.post('sdm/penelitian/verif-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                        GetData();
                        $scope.isRouteLoading = false
                    })
                })
            }
            $scope.tagihan = function(){
                if ($scope.norec_sp == undefined || $scope.norec_sp == '') {
                    toastr.error('Verifikasi Dulu', 'Info');
                    return;
                }
                if ($scope.statusBayar != null) {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Diverif lagi !")
                    return;
                }
                $scope.isRouteLoading = true
                var data = {
                    norec: $scope.norec_sp,
                    isverifikasi: null,
                    tglverif: moment(new Date).format('YYYY-MM-DD hh:mm:ss')
                }
                medifirstService.post('sdm/penelitian/verif-tagihan-kegiatan-penelitian-eksternal', data).then(function (e) {
                    GetData();
                    $scope.isRouteLoading = false
                })
            }
            $scope.unveriftagihan = function(){
                if ($scope.norec_sp == undefined || $scope.norec_sp == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                if ($scope.statusBayar != null) {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Unverif Tagihan !")
                    return;
                }
                $scope.isRouteLoading = true
                var data = {
                    norec: $scope.norec_sp,
                    isverifikasi: false
                }

                medifirstService.post('sdm/penelitian/verif-tagihan-kegiatan-penelitian-eksternal', data).then(function (e) {
                    GetData();
                    $scope.isRouteLoading = false
                })
            }
            function cetaknametag(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "norec": dataItem.norec
                }
                // return
                window.open(baseTransaksi + "report/diklat-nametag?norec="+ dataItem.norec);
                
            }
            function cetakhasilkegiatan(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "norec": dataItem.norec
                }
                // return
                window.open(baseTransaksi + "report/diklat-cetakhasilkegiatan?norec=" + dataItem.norec,'__blank');
            }
            function getCombo(){
                medifirstService.get('diklat/get-combo-diklat').then(function(data){
                    $scope.listJenisKegiatan = data.data.jeniskegiatan
                    $scope.listInstansi = data.data.masterdatakampus
                    $scope.listKegiatan = data.data.kegiatan
                    $scope.listPendidikan = data.data.pendidikan
                })

            }
            
            // var timeoutPromise;
            // $scope.$watch('item.institusipendidikan', function (newVal, oldVal) {
            //     if (!newVal) return;
            //     $timeout.cancel(timeoutPromise);
            //     timeoutPromise = $timeout(function () {
            //         if (newVal && newVal !== oldVal) {
            //             applyFilter("institusipendidikan", newVal);
            //         }
            //     }, 500)
            // });
            // function applyFilter(filterField, filterValue) {
                
            //     var dataGrid = $("#kGrid").data("kendoGrid");
            //     var currFilterObject = dataGrid.dataSource.filter();
            //     var currentFilters = currFilterObject ? currFilterObject.filters : [];
            //     console.log(filterField, filterValue);
            //     if (currentFilters && currentFilters.length > 0) {
            //         for (var i = 0; i < currentFilters.length; i++) {
            //             if (currentFilters[i].field == filterField) {
            //                 currentFilters.splice(i, 1);
            //                 break;
            //             }
            //         }
            //     }
            //     if (filterField === "institusipendidikan") {
            //         currentFilters.push({
            //             field: filterField,
            //             operator: "contains",
            //             value: filterValue
            //         });
            //     }
            //     // if (filterField === "objecturaianpendapatanfk") {
            //     //     currentFilters.push({
            //     //         field: filterField,
            //     //         operator: "eq",
            //     //         value: filterValue.id
            //     //     });
            //     // }
            //     // if (filterField === "isperubahan") {
            //     //     if ($scope.item.perubahans == true) {
            //     //         currentFilters.push({
            //     //             field: filterField,
            //     //             operator: "eq",
            //     //             value: true
            //     //         });
            //     //     }
            //     //     if ($scope.item.nonPerubahans == true) {
            //     //         currentFilters.push({
            //     //             field: filterField,
            //     //             operator: "eq",
            //     //             value: false
            //     //         });
            //     //     }
            //     // }
            //     // if (filterField === "tahun") {
            //     //     currentFilters.push({
            //     //         field: filterField,
            //     //         operator: "eq",
            //     //         value: moment(filterValue).format('YYYY')

            //     //     });
            //     //     console.log(currentFilters);
            //     // }

            //     dataGrid.dataSource.filter({
            //         logic: "and",
            //         filters: currentFilters
            //     });
            //     var allData = dataGrid.dataSource.data();
            //     var params = dataGrid.dataSource.filter();
            //     var query = new kendo.data.Query(allData);
            //     $scope.filteredData = query.filter(params).data;
            // }
            // $scope.resetFilters = function () {
            //     var gridData = $("#kGrids").data("kendoGrid");
            //     gridData.dataSource.filter({});
            //     $scope.item = {};
            //     $scope.filteredData = [];
            // };
            $scope.tglbayar = function(){
                if ($scope.norec_sp == undefined || $scope.norec_sp == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                var norec = ""
                if ($scope.strukpelayananpenjamin != null){
                    norec = $scope.strukpelayananpenjamin
                }
                var totalsudahbayar = 0;
                if ($scope.strukpelayananpenjamin != null) {
                    norec = $scope.strukpelayananpenjamin
                }
                var data = {
                    norec: norec,
                    nostrukfk: $scope.norec_sp,
                    totalbiaya: $scope.biayapenelitian,
                    totalsudahpenjamin: $scope.biayapenelitian,
                    totalsisaharusbayar: $scope.biayapenelitian,
                    totalppenjamin: $scope.biayapenelitian,
                    totalharusdibayar: $scope.biayapenelitian,
                    totalsudahdibayar: totalsudahbayar,
                    totalsisapiutang: $scope.biayapenelitian,
                }
                var objSave = {
                    data: data
                }
                medifirstService.post('diklat/simpan-pleyanan-penjamin-diklat', objSave).then(function (data) {
                    GetData()
                    $scope.noRec = data.data.noRec
                    if ($scope.statusBayar != null) {
                        toastr.error("Informasi, Tagihan Sudah Lunas !")
                        return;
                        // var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        //     "Tagihan sudah Lunas", "Ok");

                        // $mdDialog.show(alertDialog).then(function () {

                        // });
                    } else {
                        $scope.changePage2("PembayaranPiutangDiklat");
                    }
                })
                
            }
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "3%",
                        },
                        {
                            "field": "tglsbm",
                            "title": "Tgl Bayar",
                            "width": "25%",
                            // "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                        },

                        {
                            "field": "nosbm",
                            "title": "No Sbm",
                            "width": "40%",
                            // "template": "<span class='style-center'>{{formatRupiah('#: hargasatuan #', 'Rp.')}}</span>"
                        },
                        {
                            "field": "totaldibayar",
                            "title": "Total dibayar",
                            "width": "25%",
                            "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp. ')}}</span>",
                            attributes: {
                                style: "text-align:right;"
                            },
                        },
                        {
                            'command': [
                                {
                                    text: "Kwitansi Diklat",
                                    click: CetakKwD,
                                }
                            ],
                            "width": 80
                        },

                    ]
                }
            };
            $scope.changePage2 = function (stateName) {
                var obj = {
                    // pageFrom: "DaftarPembayaranDiklat", //"PembayaranTagihanNonLayananKasir",
                    noRegistrasi: $scope.noRec
                }

                $state.go(stateName, {
                    dataPasien: JSON.stringify(obj)
                });
            }
            function CetakKwD(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
                    toastr.warning('Data Belum Dipilih, Peringatan!');
                    return;
                }
                window.open(configuration.baseApiBackend + "report/diklat-kwitansi?" + '&strIdPegawai=' + medifirstService.getPegawaiLogin().namaLengkap + '&nosbm=' + dataItem.nosbm);
            }
        }
    ]);
});