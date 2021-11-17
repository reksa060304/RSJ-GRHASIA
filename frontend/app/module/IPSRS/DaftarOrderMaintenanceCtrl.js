define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderMaintenanceCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.itemd = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.showBtn = false
            var jenisForm = 0
            var tabNumber = 1
            var pegawaiUser = {}
            $scope.item.listPegawaiMulti = []
            // if ($state.params.jenis == "1") {
            //     $scope.item.title = 'Manajemen Kebersihan Tempat Tidur'
            //     jenisForm = 16
            // }
            // if ($state.params.jenis == "2") {
            //     $scope.item.title = 'Manajemen Kebersihan Area RS'
            //     jenisForm = 35
            // }
            // if ($state.params.jenis == "3") {
            //     $scope.item.title = 'Manajemen Pest Control'
            //     jenisForm = 14
            // }
            // if ($state.params.jenis == "4") {
            //     $scope.item.title = 'Manajemen Saluran Air Limbah'
            //     jenisForm = 18
            // }
            //$scope.item.tittle = "Daftar Tempat Tidur"
            userRuangan();
            LoadCache();
            loadCombo();

            function userRuangan(){
                
                var listUserRuangan = medifirstService.getMapLoginUserToRuangan();
                $scope.userLoginRuangan = listUserRuangan[0].id
                if ($scope.userLoginRuangan == 58 ){
                    $scope.showBtn = true
                }        
              
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarRuanganSanitasiCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init2();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = $scope.now;
                    init2();
                }
            }
           
            function loadCombo() {
                $scope.item.tglMulai = new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                $scope.item.tglSelesai = new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                $scope.dataLogin2 = medifirstService.getMapLoginUserToRuangan();
                // $scope.ad = $scope.dataLogin2[0].id;
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                    $scope.listStaff = data;
                    $scope.selectOptionsPegawai = {
						placeholder: "Pilih Pegawai...",
						dataTextField: "namalengkap",
						dataValueField: "id",
						// dataSource:{
						//     data: $scope.listRuangan
						// },
						autoBind: false,
					};
                });  
                
               medifirstService.getPart("ipsrs/get-jenis-alat").then(function (data) {
                    $scope.listJenisAlat = data;
                });
                medifirstService.getPart("ipsrs/get-jenis-pekerjaan").then(function (data) {
                    $scope.listJenisKerusakan = data;
                }); 
                medifirstService.getPart("ipsrs/get-status-pekerjaan").then(function (data) {
                    $scope.listStatus = data;
                }); 
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangLogistik')
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();            
            }

            $scope.deleteOrder = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.statusorder != '') {
                    alert("Sudah di kirim tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    norecorder: $scope.dataSelected.norec
                }

                medifirstService.post('logistik/delete-order-barang-ruangan',objSave).then(function (e) {
                    init()
                })
            }

            function init2() {
                $scope.isRouteLoading = true;
                var desc = ""
                if ($scope.item.desc != undefined) {
                    var desc = "&desc=" + $scope.item.cariDesc
                }
                var manage = ''
                if (tabNumber == 1) {
                    manage = 'aingmacan'
                }
                var jenisalat = ''
                if ($scope.item.jenisAlatCari != undefined) {
                    jenisalat = "&jenisalat=" + $scope.item.jenisAlatCari.id
                }
                var idRuangan= "&idRuangan=" + $scope.userLoginRuangan

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("ipsrs/get-daftar-permohonan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + jenisalat + idRuangan +
                    "&manage=" + manage
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.data;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            var respon=''
                            if (data2[i].startdate!=null){
                                var diff2= Math.abs(new Date(data2[i].tglplanning) - new Date(data2[i].startdate))
                                respon= Math.floor(((diff2/1000)/60)/60) + " jam " + Math.floor(Math.floor((diff2/1000)/60) - Math.floor(Math.floor(((diff2/1000)/60)/60) * 60)) + " menit" 
                            }
                            var durasi=''
                            if (data2[i].duedate!=null){
                                var diff= Math.abs(new Date(data2[i].duedate) - new Date(data2[i].startdate))
                                durasi= Math.floor(((diff/1000)/60)/60) + " jam " + Math.floor(Math.floor((diff/1000)/60) - Math.floor(Math.floor(((diff/1000)/60)/60) * 60)) + " menit" 
                            }
                            data2[i].respon= respon
                            data2[i].durasi= durasi
                        }
                        $scope.dataGrid2 = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarRuanganSanitasiCtrl', chacePeriode);
            }

            function init() {
                $scope.isRouteLoading = true;
                var desc = ""
                if ($scope.item.desc != undefined) {
                    var desc = "&desc=" + $scope.item.cariDesc
                }
                var manage = ''
                if (tabNumber == 1) {
                    manage = 'aingmacan'
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("ipsrs/get-daftar-permohonan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + desc + '&arrru=' + jenisForm +
                    "&manage=" + manage
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data2 = dat.data.data;                       
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                }
                            }
                        });
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarRuanganSanitasiCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                tabNumber = 2
                init();
            }   

            $scope.cariFilter2 = function () {
                tabNumber = 1
                init2();
            } 

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.EditOrder = function () {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangLogistikCtrl', chacePeriode);
                $state.go('OrderBarangLogistik')
            }

            $scope.KirimBarang = function () {
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarang',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikCtrl', chacePeriode);
                $state.go('KirimBarangLogistik')
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {                    
                    dataItem.details[i].no = i + 1
                }

                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [                        
                        {
                            "field": "no",
                            "title": "No",
                            "width": "25px",
                        },                        
                        {
                            "field": "namalengkap",
                            "title": "Nama Staff",
                            "width": "150px",
                        },                        
                    ]
                }
            };

            $scope.optionsDaftarPermohonan = {
                toolbar:["excel"],
                excel: {
                    fileName: "Data Permohonan cetakan "+moment($scope.now).format( 'DD/MMM/YYYY')+".xlsx",
                    allPages: true,

                },
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    var columns = e.workbook.sheets[0].columns;
                    columns.forEach(function(column){
                        // also delete the width if it is set
                        delete column.width;
                        column.autoWidth = true;
                    });
                    rows.unshift({
                        cells: [{ value: "Data Permohonan cetakan "+moment($scope.now).format( 'DD/MMM/YYYY'), background: "#fffff" }]
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "80px",
                    },
                    {
                        "field": "namapelapor",
                        "title": "Pelapor",
                        "width": "80px",
                    },
                    {
                        "field": "rincianexecuteplanning_askep",
                        "title": "Laporan kerusakan",
                        "width": "100px",
                    },
                    {
                        "field": "tglplanning",
                        "title": "Tgl diterima",
                        "width": "60px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Penanggung Jawab",
                        "width": "80px",
                    },
                    {
                        "field": "startdate",
                        "title": "Tgl Mulai",
                        "width": "60px",
                    },
                    {
                        "field": "respon",
                        "title": "Respon",
                        "width": "60px",
                    },
                    {
                        "field": "duedate",
                        "title": "Tgl Selesai",
                        "width": "60px",
                    },
                    {
                        "field": "durasi",
                        "title": "Pengerjaan",
                        "width": "50px",
                    },
                    {
                        "field": "deskripsiplanning",
                        "title": "WorkList",
                        "width": "100px",
                    },
                    {
                        "field": "keteranganverifikasi",
                        "title": "Identifikasi",
                        "width": "100px",
                    },
                    {
                        "field": "jeniskerusakan",
                        "title": "Jenis kerusakan",
                        "width": "100px",
                    },
                    {
                        "field": "jenisalat",
                        "title": "Jenis alat",
                        "width": "100px",
                    },
                    {
                        "field": "statuspekerjaan",
                        "title": "Status",
                        "width": "50px",
                    }
                ],

            };

            // $scope.columnGrid = [
            //     {
            //         "field": "no",
            //         "title": "No",
            //         "width": "20px",
            //     },
            //     {
            //         "field": "namaruangan",
            //         "title": "Ruangan",
            //         "width": "80px",
            //     },
            //     {
            //         "field": "namapelapor",
            //         "title": "Pelapor",
            //         "width": "80px",
            //     },
            //     {
            //         "field": "rincianexecuteplanning_askep",
            //         "title": "Laporan kerusakan",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "tglplanning",
            //         "title": "Tgl diterima",
            //         "width": "60px"
            //     },
            //     {
            //         "field": "nama",
            //         "title": "Alokasi staff",
            //         "width": "80px",
            //     },
            //     {
            //         "field": "startdate",
            //         "title": "Tgl Mulai",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "respon",
            //         "title": "Respon",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "duedate",
            //         "title": "Tgl Selesai",
            //         "width": "60px",
            //     },
            //     {
            //         "field": "durasi",
            //         "title": "Pengerjaan",
            //         "width": "50px",
            //     },
            //     {
            //         "field": "deskripsiplanning",
            //         "title": "WorkList",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "keteranganverifikasi",
            //         "title": "Identifikasi",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "jeniskerusakan",
            //         "title": "Jenis kerusakan",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "jenisalat",
            //         "title": "Jenis alat",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "statuspekerjaan",
            //         "title": "Status",
            //         "width": "50px",
            //     }
            // ];
           
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
                   
            $scope.signDate = function () {               
                $scope.popupSignDate.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalSD = function () {            
                $scope.popupSignDate.close();   
            }
            $scope.saveSD = function () {        
                var objSave = 
                    {
                        norec : '',
                        tglplanning : $scope.item.signdate,
                        objectruanganfk : $scope.item.idruangan
                    }
                medifirstService.post('sanitasi/save-signdate',objSave).then(function(e) {
                    $scope.popupSignDate.close();
                    init2()
                })    
                   
            }

            $scope.alokasiStaff = function () {               
                $scope.popupAlokasiStaff.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalAS = function () {            
                $scope.popupAlokasiStaff.close();   
            }
            $scope.saveAS = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        objectpegawaipjawabfk : $scope.item.staff.id
                    }
                medifirstService.post('ipsrs/save-alokasistaff',objSave).then(function(e) {
                    $scope.popupAlokasiStaff.close();
                    init2()
                })    
                   
            }

            $scope.worklist = function () {               
                $scope.popupWorkList.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalWL = function () {            
                $scope.popupWorkList.close();   
            }
            $scope.saveWL = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        deskripsiplanning : $scope.item.worklist
                    }
                medifirstService.post('ipsrs/save-worklist',objSave).then(function(e) {
                    $scope.popupWorkList.close();
                    init2()
                })    
                   
            }

            $scope.identifikasi = function () {               
                $scope.popupIdentifikasi.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan
            }
            $scope.batalIdentifikasi = function () {            
                $scope.popupIdentifikasi.close();   
            }
            $scope.saveIdentifikasi = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        identifikasi : $scope.item.identifikasi
                    }
                medifirstService.post('ipsrs/save-identifikasi-kerusakan',objSave).then(function(e) {
                    $scope.popupIdentifikasi.close();
                    init2()
                })    
                   
            }

            $scope.jenisKerusakan = function () {               
                $scope.popupJenisKerusakan.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.jeniskerusakan

                medifirstService.getPart("ipsrs/get-jenis-pekerjaan").then(function (data) {
                    $scope.listJenisKerusakan = data;
                }); 

            }
            $scope.batalJenisKerusakan = function () {            
                $scope.popupJenisKerusakan.close();   
            }
            $scope.saveJenisKerusakan = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        jenisKerusakan : $scope.item.jenisKerusakan.id
                    }
                medifirstService.post('ipsrs/save-jenis-kerusakan',objSave).then(function(e) {
                    $scope.popupJenisKerusakan.close();
                    init2()
                })    
                   
            }

            $scope.jenisAlat = function () {               
                $scope.popupJenisAlat.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.descalat =  $scope.dataSelected.jenisalat

                medifirstService.getPart("ipsrs/get-jenis-alat").then(function (data) {
                    $scope.listJenisAlat = data;
                }); 

            }
            $scope.batalJenisAlat = function () {            
                $scope.popupJenisAlat.close();   
            }
            $scope.saveJenisAlat = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        jenisAlat : $scope.item.jenisAlat.id
                    }
                medifirstService.post('ipsrs/save-jenis-alat',objSave).then(function(e) {
                    $scope.popupJenisAlat.close();
                    init2()
                })    
                   
            }

            $scope.Status = function () {               
                $scope.popupStatus.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan

                medifirstService.getPart("ipsrs/get-status-pekerjaan").then(function (data) {
                    $scope.listStatus = data;
                }); 
            }
            $scope.batalStatus = function () {            
                $scope.popupStatus.close();   
            }
            $scope.saveStatus = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec,
                        //keteranganverifikasi : $scope.item.inspeksi,
                        objectstatuspekerjaanfk : $scope.item.status.id
                    }
                medifirstService.post('ipsrs/save-status-pekerjaan',objSave).then(function(e) {
                    $scope.popupStatus.close();
                    init2()
                })    
                   
            }
            $scope.startBtn = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-startdate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.finishBtn = function () {        
                var objSave = 
                    {
                        norec : $scope.dataSelected.norec
                    }
                medifirstService.post('sanitasi/save-duedate',objSave).then(function(e) {
                    $scope.popupInspeksi.close();
                    init2()
                })    
                   
            }
            $scope.DetailBtn = function () {               
                $scope.popupDetail.center().open();
                $scope.item.idruangan =  $scope.dataSelected.idruangan
                $scope.item.desc =  $scope.dataSelected.namaruangan

                $scope.item.signdate =  $scope.dataSelected.tglplanning
                $scope.item.startdate =  $scope.dataSelected.startdate
                $scope.item.duedate =  $scope.dataSelected.duedate
                $scope.item.staff =  $scope.dataSelected.namalengkap
                $scope.item.worklist =  $scope.dataSelected.deskripsiplanning
                $scope.item.inspeksi =  $scope.dataSelected.keteranganverifikasi
                $scope.item.inspeksistaff =  $scope.dataSelected.pegawaipj
            }
            $scope.batalDetail = function () {            
                $scope.popupDetail.close();   
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai2 = $scope.item.DataPegawai.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-order=1&nores=' + $scope.dataSelected.norec + '&pegawaiMegetahui=' + pegawai1 + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1 + '&jabatanMeminta=' + jabatan2 + '&view=' + stt + '&user=' + pegawaiUser[0].namalengkap, function (response) {
                        //aadc=response; 

                    });                
                $scope.popUp.close();
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



            $scope.hapus = function (){
                if ($scope.dataSelected == undefined){
                    toastr.error('Pilih data dulu!')
                    return
                }
                var del=confirm("Yakin mau menghapus data ini?");
                
                if (del) {
                    medifirstService.post('ipsrs/hapus-permohonan-ipsrs', { norec: $scope.dataSelected.norec }).then(function (e) {
                        init2()
                    })
                }
            }

            function batalPengerjaan(){
                $scope.itemd = {};
                $scope.item.tglMulai = new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                $scope.item.tglSelesai = new Date(moment($scope.now).format('YYYY-MM-DD HH:mm'));
                $scope.item.jenisAlat = undefined;
                $scope.item.identifikasi = undefined;
                $scope.item.jenisKerusakan = undefined;
                $scope.item.listPegawaiMulti = {};
                $scope.item.worklist = undefined;
                $scope.item.status = undefined;
                $scope.popupPengerjaan.close();
            }

            $scope.batalPengerjaan = function(){
                batalPengerjaan()
            }

            $scope.Pengerjaan = function (){
                if ($scope.dataSelected == undefined) {
                   toastr.error("Data Belum Dipilih!")
                   return;
                }

                if ($scope.dataSelected.statuspekerjaan == "Selesai") {
                    toastr.error("Status Pekerjaan Telah Selesai!")
                    return;
                }

                $scope.itemd.tglLapor = $scope.dataSelected.tglplanning;
                $scope.itemd.Ruangan = $scope.dataSelected.namaruangan;
                $scope.itemd.namaPelapor = $scope.dataSelected.pelapor;
                $scope.itemd.kerusakan = $scope.dataSelected.rincianexecuteplanning_askep;
                $scope.item.tglMulai = moment($scope.dataSelected.startdate).format('YYYY-MM-DD HH:mm');
                $scope.item.tglSelesai = moment($scope.dataSelected.duedate).format('YYYY-MM-DD HH:mm');
                $scope.item.jenisAlat = {id:$scope.dataSelected.objectjenisalatfk,reportdisplay:$scope.dataSelected.jenisalat};
                $scope.item.jenisKerusakan = {id:$scope.dataSelected.idjeniskerusakan,reportdisplay:$scope.dataSelected.jeniskerusakan};
                $scope.item.status = {id:$scope.dataSelected.objectstatuspekerjaanfk ,reportdisplay:$scope.dataSelected.statuspekerjaan};
                $scope.item.staff = {id:$scope.dataSelected.objectpegawaipjawabfk ,namalengkap:$scope.dataSelected.namalengkap};
                $scope.item.listPegawaiMulti = $scope.dataSelected.details;
                $scope.item.worklist = $scope.dataSelected.deskripsiplanning;
                $scope.item.identifikasi = $scope.dataSelected.keteranganverifikasi;
                $scope.popupPengerjaan.center().open();
            }

            $scope.savePengerjaan = function(){
                
                if ($scope.dataSelected == undefined) {
                    toastr.error("Data Belum Dipilih!")
                    return;
                }                

                if (moment($scope.item.tglMulai).format('YYYY-MM-DD HH:mm') == moment($scope.item.tglSelesai).format('YYYY-MM-DD HH:mm')) {
                    toastr.error("Tanggal Mulai dan Tanggal Selasai Tidak Boleh Sama!")
                    return;
                }

                if ($scope.item.staff == undefined) {
                    toastr.error("Petugas Penanggung Jawab Belum Diisi!")
                    return
                }

                if ($scope.item.listPegawaiMulti.length == 0) {
                    toastr.error("Alokasi Staff Masih Kosong!")
                    return;
                }
                var datapegawai = [];
                if ($scope.item.listPegawaiMulti.length != 0) {
                    for (var i = $scope.item.listPegawaiMulti.length - 1; i >= 0; i--) {
                        var data = {
                            'idpegawai' : $scope.item.listPegawaiMulti[i].id,
                            'namalengkap' : $scope.item.listPegawaiMulti[i].namalengkap,
                        }
                        datapegawai.push(data);
                    }
                }

                var strukplanning = {
                    'tglmulai' : $scope.item.tglMulai != undefined ? moment($scope.item.tglMulai).format('YYYY-MM-DD HH:mm') : null,
                    'tglselesai' : $scope.item.tglSelesai != undefined ? moment($scope.item.tglSelesai).format('YYYY-MM-DD HH:mm') : null,
                    'jenisalat' : $scope.item.jenisAlat != undefined ? $scope.item.jenisAlat.id : null,
                    'identifikasikerusakan' : $scope.item.identifikasi != undefined ? $scope.item.identifikasi : null,
                    'penanngungjawab' : $scope.item.staff != undefined ? $scope.item.staff.id : null,
                    'jeniskerusakan' : $scope.item.jenisKerusakan != undefined ? $scope.item.jenisKerusakan.id : null,
                    'worklist' : $scope.item.worklist != undefined ? $scope.item.worklist : null,
                    'status' : $scope.item.status != undefined ? $scope.item.status.id : null,
                }

                var objSave = {
                    norec : $scope.dataSelected.norec,
                    strukplanning : strukplanning,
                    datapegawai : datapegawai,
                }

                medifirstService.post('ipsrs/save-pengerjaan-permohonan',objSave).then(function(e) {
                    init();
                })    
            }

           //** BATAS SUCI */
        }
    ]);
});
