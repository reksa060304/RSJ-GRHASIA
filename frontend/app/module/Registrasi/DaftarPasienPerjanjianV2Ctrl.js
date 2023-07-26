define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienPerjanjianV2Ctrl', ['DateHelper','CacheHelper', '$rootScope', '$scope', '$state', 'MedifirstService','$mdDialog',
        function (DateHelper,cacheHelper, $rootScope, $scope, $state, medifirstService, $mdDialog) {
            $scope.daftarpasienperjanjian = true;
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = false;
            $rootScope.isOpen = true;
            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + 1);
            $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.now = new Date();
            $scope.from = undefined;
            $scope.until = undefined;
            $scope.kodeReservasi = ''
            var kode = ''
            if (medifirstService.getKelompokUser() == 'operator'){
                $scope.daftarpasienperjanjian = false;
            }else{
                $scope.daftarpasienperjanjian = true;
            }
            
            if ($state.params.noOrder != "-") {
                kode = $state.params.noOrder
                $scope.kodeReservasi = kode
                var date = new Date();
                $scope.until = new Date(date.setDate(date.getDate() + 7));

            }   
            LoadCombo();
            LoadData();

            $scope.listStatus = [
                { id: 1, nama: 'Confirm' },//#
                { id: 2, nama: 'Reservasi' },
            ]
            $scope.Tracer = function () {
                if ($scope.item.noreservasi != undefined) {
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $scope.item.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //##save identifikasi tracer
                    // medifirstService.get("registrasi/identifikasi-tracer?norec_pd="
                    //     + $scope.dataPasienSelected.norec
                    // ).then(function (data) {
                    //     var datas = data.data;
                    // })
                    //##end

                    //cetakan langsung service VB6 by grh    
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer-online=1&norec=' + $scope.item.noreservasi + '&noCm=' + $scope.item.nocm + '&view=false', function (response) {
                        // do something with response
                    });


                }
            }

            // $scope.kodeReservasi = '';
            $scope.Column = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarReservasiOnline.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Reservasi Online",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns:
                    [{
                        field: "nocm",
                        title: "No RM",
                        width: 80
                    },
                    {
                        field: "namapasien",
                        title: "Nama Pasien",
                        width: 200
                    },
                    
                    {
                        field: "tgllahir",
                        title: "Tanggal Lahir",
                        template: "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>",
                        width: 120
                    }, 
                    {
                        field: "usia",
                        title: "Usia",
                        width: 200
                    },
                    {
                        field: "tipepasien",
                        title: "Status Pasien",
                        width: 100
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan Tujuan",
                        width: 200
                    },
                    {
                        field: "tanggalreservasi",
                        title: "Tanggal Reservasi",
                        template: "<span class='style-left'>{{formatTanggal('#: tanggalreservasi #')}}</span>",
                        width: 120
                    },
                    {
                        field: "jamreservasi",
                        title: "Jam",
                        width: 100
                    }, 
                    {
                        field: "status",
                        title: "Status",
                        width: 200
                    },
                    {
                        field: "notelepon",
                        title: "No HP",
                        width: 200
                    },
                    {
                        field: "tglinput",
                        title: "Tanggal Input",
                        width: 120,
                        template: "<span class='style-left'>{{formatTanggal('#: tglinput #')}}</span>",
                    }

                    ]
            };
            $scope.formatTanggal = function (tanggal) {
                if (tanggal != 'null')
                    return moment(tanggal).format('DD-MMM-YYYY');
                else
                    return '-';
            }
            $scope.Page = {
                refresh: true//,
                //pageSizes: true//,
                //buttonCount: 5
            }
            function LoadCombo() {
                medifirstService.get("registrasi/get-combo-perjanjian").then(function (e) {
                    $scope.listRuangan = e.data.ruanganrajal
                })
            }
            $scope.findData = function () {
                LoadData()

            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD');
                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.nama;
                }
                var ruanganId = "";
                if ($scope.namaRuangan != undefined) {
                    ruanganId = $scope.namaRuangan.id;
                }
                var namapasienpm = ''
                var namapasienapr = ''
                if ($scope.namaPasien != undefined) {
                    namapasienpm = $scope.namaPasien;
                    namapasienapr = $scope.namaPasien;
                }
                medifirstService.get("registrasi/get-data-pasien-reservasi-v2?"
                    + "tglAwal=" + tglAwal
                    + "&tglAkhir=" + tglAkhir
                    + "&kdReservasi=" + $scope.kodeReservasi
                    + "&statusRev=" + status
                    + "&namapasienpm=" + $scope.namaPasien
                    + "&ruanganId=" + ruanganId
                    + "&objectpegawaifk="+ medifirstService.getPegawaiLogin().id
                    // + "&namapasienapr=" + $scope.namaPasien
                ).then(function (data) {
                    $scope.isRouteLoading = false;

                     for (let i = 0; i < data.data.data.length; i++) {
                        const element = data.data.data[i];
                        var umur = DateHelper.CountAge(new Date(element.tgllahir), new Date(element.tanggalreservasi));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day
                        element.usia = thn + " Tahun " + bln + " Bulan " + day+" Hari"
                     }
                    $scope.listPasien = new kendo.data.DataSource({
                        data: data.data.data,
                        group: $scope.group,
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

            $scope.reconfirm = function () {
                // window.isPerjanjian = $scope.item.noreservasi;
                // findPasien.CheckNoReconfirm($scope.item.noreservasi).then(function(e) {
                if($scope.item.status == 'Confirm'){
                    toastr.error('Sudah Confirm')
                    return
                }
                if ($scope.item.nocm == undefined || $scope.item.nocm == null) {

                    //  var data={
                    //          "noreservasi":  $scope.item.noreservasi,                                 
                    // }

                    // manageAkuntansi.postupdatestatusconfirm(data).then(function(e) {
                    //        LoadData();
                    var cahce = {
                        0: $scope.item,
                        1: 'Online',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnline', cahce);
                    // var isMenuDinamis = JSON.parse(localStorage.getItem('isMenuDinamis'))
                    // if(isMenuDinamis && isMenuDinamis == true){
                    $state.go('RegistrasiPasienBaru', {
                        noRec: $scope.item.norec
                    });
                  

                }
                else {
                    cacheHelper.set('cacheStatusPasien', 'LAMA');
                    
                    var param = $scope.item.norec + "*" + $scope.item.nocm;
               
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cahce = {
                        0: $scope.item,
                        1: 'Online',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnline', cahce);
                    $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                        noCm: $scope.item.nocmfk
                    });
                    // })
                }
                // });
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

            $scope.CetakLaporan = function () {
                var tglAwal = moment($scope.from).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.until).format('YYYY-MM-DD 23:59');

                var status = "";
                if ($scope.status != undefined) {
                    status = $scope.status.id;
                }
                var stt = 'false'
                if (confirm('View Laporan Reservasi Online? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-LaporanReservasiOnline=1&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&statusId=' + status + '&namaKasir=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            $scope.hapusReservasi = function(){
                if ($scope.item== undefined){
                    toastr.error('silahkan pilih data ...')
                    return
                }
                if($scope.item.status =='Confirm'){
                    toastr.error('Pasien sudah di confirm, jadi tidak bisa di hapus ...')
                    return
                }
                var confirm = $mdDialog.confirm()
                                .title('Peringatan')
                                .textContent('Apakah anda yakin akan menghapus data ?')                                
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function () {
                                $scope.confirmDelete();
                            })
            }
            $scope.confirmDelete = function(){
                medifirstService.post( "reservasionline/delete",{"norec":$scope.item.norec})
                .then(function (data) {               
                   LoadData();            
                })
            }

        }
    ]);
});