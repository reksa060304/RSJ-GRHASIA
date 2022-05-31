define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('MahasiswaEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.currentKeterangan = [];
            $scope.item.namainstansi = medifirstService.getPegawaiLogin().namaLengkap;
            $scope.item.namauser = medifirstService.getUserLogin().kdUser;

            $scope.pemb = true;
            $scope.ru = true;
            var noOrder = '';
            var NorecKpe = '';
            var norec_kpe = '';
            var norecmhs = '';
            var gambar = ""
            // var images = ""
            loadDataCombo();
            LoadCache();
            
            function LoadCache() {
                var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                if (chacePeriode != undefined) {
                    NorecKpe = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
                } else {
                    init()
                }
            }
            if (ModelItem.getPegawai().jenisPegawai.qjenispegawai != 0) {
                $scope.tgl = false;
                $scope.pemb = false;
                $scope.ru = false;
                $scope.tmbhruangan = true;
            }

            function loadDataCombo() {
            $scope.isRouteLoading = true;


                var noregistrasi = "noregistrasi=" + $state.params.norec;
                medifirstService.get("sdm/penelitian/get-data-combo-penelitian?" + noregistrasi, true).then(function (datas) {
                    $scope.isRouteLoading = false;
                    var dat = datas.data
                    $scope.ListInstitusiPendidikan = dat.institusi;
                    $scope.ListJenisDiklat = dat.jenisdiklat;
                    $scope.ListJenisLayanan = dat.detailjenisproduk;
                    $scope.ListJenisKelamin = dat.jeniskelamin;
                    $scope.ListPegawai = dat.pegawai;
                    $scope.ListRuangan = dat.dataruangan;
                    $scope.kendo = datas.data.me.length;
                    $scope.ListLevelPendidikan = dat.levelpendidikan;
                    if (dat.pegawaiuser != '') {
                        $scope.item.notelp = dat.pegawaiuser[0].nomor
                    }
                    if (datas.data.norec != '') {
                        $scope.norec = datas.data.norec[0].jumlahpeserta
                    }
                    for (var i = 0; i < datas.data.me.length; i++) {
                        datas.data.me[i].no = i + 1
                    }
                    if (dat.sp != '') {
                        if (dat.sp != undefined) {
                            $scope.peneliti = true
                            toastr.error("Informasi, Data Sudah Diverifikasi !")
                        }
                    }
                    for (let i = 0; i < dat.me.length; i++) {
                        const element = dat.me[i];
                        element.images =dat.me[i].image;
                        // element.imagess = '<img src="DIKLAT/FileFoto/'+ dat.me[i].image+'" width="70" height="90" class="center">';
                        // images[i] = dat.me[i].image
                        // /../../../../../backend/public/DIKLAT/FileFoto/DIKLAT-MuhamadFazriAnnafi2-1709142-fazri@gmail.com.jpg
                    }
                    $scope.dataSourceGridDiagnosapasien = new kendo.data.DataSource({
                        data: datas.data.me,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.data.me.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                    });
                });


            }
            // var imageData = 
                        gambar = '../../../../../backend/public/DIKLAT/FileFoto/DIKLAT-MuhamadFazriAnnafi2-1709142-fazri@gmail.com.jpg'
            if (ModelItem.getPegawai().jenisPegawai.qjenispegawai != 0) {
                $scope.columnGridDiagnosapasien = {
                    toolbar: ["excel", ],
                    excel: {
                        fileName: "Laporan .xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var departemenss = "";
                        if ($scope.item.departement != undefined) {
                            departemenss = $scope.item.departement.departemen;
                        }
                        if ($scope.item.departemen != undefined) {
                            departemenss = $scope.item.departemen.departemen;
                        }
                        if ($scope.item.departement == undefined && $scope.item.departemen == undefined) {
                            departemenss = "Rumah Sakit Jiwa Grhasia";
                        }
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 1;
                        sheet.mergedCells = ["A1:D1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "Laporan Diagnosa Per-pasien " + departemenss,
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
                    groupable: false,

                    columns: [{
                            field: "no",
                            title: "No",
                            width: "30px",
                        },
                        {
                            field: "nama",
                            title: "Nama",
                            width: "100px",
                        },
                        {
                            field: "nim",
                            title: "NIM",
                            width: "70px",
                        },
                        {
                            field: "jeniskelamin",
                            title: "Gender",
                            width: "70px",
                        },
                        {
                            field: "namalengkap",
                            title: "Pembimbing",
                            width: "100px",
                        },
                        {
                            field: "namaruangan",
                            title: "Ruangan",
                            width: "100px",
                        },
                        {
                            field: "email",
                            title: "Email",
                            width: "50px",

                        },
                        {
                            field: "image",
                            title: "Image",
                            width: "50px",
                            template: "<span class='center'>#: image == null ? 'noimage': '✔'#</span>"
                            // template: '<img src="../../../../../../../backend/public/DIKLAT/FileFoto/#:images#" width="70" height="90" class="center"/>',
                            // template: "<div class='customer-photo' style='background-image: url(../../../../../backend/public/DIKLAT/FileFoto/DIKLAT-MuhamadFazriAnnafi2-1709142-fazri@gmail.com.jpg);'></div>",
                        },

                        {
                            command: [{
                                text: "Sertifikat",
                                click: cetaksertifikat
                            }],
                            width: 100
                        },


                    ],
                    // groupable: true,
                    // filterable: true,
                    columnMenu: true,
                    reorderable: true,
                    resizable: true,
                    sortable: true,
                    pageable: true,
                }
            } else {
                $scope.columnGridDiagnosapasien = {
                    toolbar: ["excel", ],
                    excel: {
                        fileName: "Laporan .xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var departemenss = "";
                        if ($scope.item.departement != undefined) {
                            departemenss = $scope.item.departement.departemen;
                        }
                        if ($scope.item.departemen != undefined) {
                            departemenss = $scope.item.departemen.departemen;
                        }
                        if ($scope.item.departement == undefined && $scope.item.departemen == undefined) {
                            departemenss = "Rumah Sakit Jiwa Grhasia";
                        }
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 1;
                        sheet.mergedCells = ["A1:D1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "Laporan Diagnosa Per-pasien " + departemenss,
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
                    groupable: false,

                    columns: [{
                            field: "no",
                            title: "No",
                            width: "30px",
                        },
                        {
                            field: "nama",
                            title: "Nama",
                            width: "100px",
                        },
                        {
                            field: "nim",
                            title: "NIM",
                            width: "70px",
                        },
                        {
                            field: "jeniskelamin",
                            title: "Gender",
                            width: "70px",
                        },
                        {
                            field: "namalengkap",
                            title: "Pembimbing",
                            width: "100px",
                        },
                        {
                            field: "namaruangan",
                            title: "Ruangan",
                            width: "100px",
                        },
                        {
                            field: "email",
                            title: "Email",
                            width: "50px",

                        },
                        {
                            field: "image",
                            title: "Image",
                            width: "50px",
                            template: "<span class='center'>#: image == null ? 'noimage': '✔'#</span>"
                            // template: '<img src="../../../../../../../backend/public/DIKLAT/FileFoto/#:images#" width="70" height="90" class="center"/>',
                            // template: "<div class='customer-photo' style='background-image: url(../../../../../backend/public/DIKLAT/FileFoto/DIKLAT-MuhamadFazriAnnafi2-1709142-fazri@gmail.com.jpg);'></div>",
                        },


                    ],
                    // groupable: true,
                    // filterable: true,
                    columnMenu: true,
                    reorderable: true,
                    resizable: true,
                    sortable: true,
                    pageable: true,
                }
            }
            
                $scope.klikGrid = function (dataSelected) {
                    $scope.isRouteLoading =true
                    var noregistrasi = "";
                    if (dataSelected != undefined) {
                        noregistrasi = "norec=" + dataSelected.norec_eks;
                       
                    }else{
                         $scope.isRouteLoading = false
                         return
                    }

                medifirstService.get("sdm/pendidikan/get-detail-pdruangan?" + noregistrasi, true).then(function (datas) {
                    var dat = datas.data.nor
                    $scope.item.nim = dat[0].nim;
                    $scope.item.jeniskelamin = { id:dat[0].jeniskelaminfk,
                        jeniskelamin: dat[0].jeniskelamin
                    };
                    $scope.item.namapeneliti = dat[0].nama;
                    $scope.item.telp = dat[0].nomorhp;
                    $scope.norec_maeks = dat[0].norec_eks;
                    $scope.item.email = dat[0].email;
                    $scope.isRouteLoading=false
                    console.log(dataSelected);
                });

            }
            function init() {
                if (noOrder == 'EditPenelitianEksternal') {
                    $scope.isRouteLoading = true;
                    medifirstService.get("sdm/penelitian/get-detail-penelitian-eksternal?" +
                        "Norec=" + NorecKpe, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas[0];
                        norec_kpe = datas.norec;

                        $scope.item.namauser = datas.namauser;
                        $scope.item.namainstansi = datas.institusipendidikan
                        $scope.item.notelp = datas.notelp;
                        $scope.item.jenis = {
                            id: datas.idjenis,
                            diklatkategori: datas.diklatkategori
                        };
                        $scope.item.layanan = {
                            id: datas.idlayanan,
                            detailjenisproduk: datas.detailjenisproduk
                        };
                        $scope.item.levelpendidikan = {
                            id: datas.idlevelpendidikan,
                            namaproduk: datas.levelpendidikan
                        };
                        $scope.item.jumlahpeserta = datas.jumlahpeserta
                        $scope.item.qty = datas.qty
                        $scope.item.satuan = datas.satuan
                        $scope.item.biaya = datas.biayapenelitian
                        $scope.item.tanggalMulai = datas.tanggalmulai;
                        $scope.item.tanggalSelesai = datas.tanggalselesai;

                    })

                }
            }



            $scope.addListKeterangan = function (bool, data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }

            }

            $scope.Batal = function () {
                $scope.item = {};
            }

            
            
            $scope.tambahMhs = function () {
                const url = baseTransaksi + 'sdm/pendidikan/save-pesertadidik'

                const form = document.querySelector('form')

                const formData = new FormData()
                var image = "noimage"
                
                $scope.isRouteLoading = true;
                //bikin if untuk ruangan dan pegawai
                var ruangan = null
                var pegawai = null
                if (document.querySelectorAll('[type=file]')[0].files[0] != undefined) {
                image = document.querySelectorAll('[type=file]')[0].files[0]
                }
                formData.append('norec', false)
                formData.append('noregistrasifk', $state.params.norec)
                formData.append('nama', $scope.item.namapeneliti)
                formData.append('nim', $scope.item.nim)
                formData.append('nomorhp', $scope.item.telp)
                formData.append('jeniskelaminfk', $scope.item.jeniskelamin.id)
                formData.append('objectruanganlastfk', ruangan)
                formData.append('objectpegawailastfk', pegawai)
                formData.append('email', $scope.item.email)
                formData.append('image', image)

                if ($scope.norec < $scope.kendo + 1) {
                    window.messageContainer.error("Data tidak berhasil disimpan Quota Peserta sudah Terpenuhi.");
                    $scope.isRouteLoading = false;
                    $scope.item = {};
                    return;
                }
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    // console.log(response)
                    if (response.status == 201) {
                        toastr.info('Sukses');
                        $scope.item = {};
                        $scope.isRouteLoading = false;
                        loadDataCombo();}
                    else{
                        toastr.info('Simpan Gagal');
                    }
                    // $scope.loadDataSip();
                    // $scope.batalSip();
                })
                // // var base64String = "";
                // const formData = new FormData()
                // const image = document.querySelectorAll('[type=file]')[0].files[0]
                // $scope.isRouteLoading = true;
                //  //bikin if untuk ruangan dan pegawai
                // var ruangan = null
                // var pegawai = null
                // console.log(image);
                // if (image == undefined) {
                //     var data = {
                //         "norec": false,
                //         "noregistrasifk": $state.params.norec,
                //         "nama": $scope.item.namapeneliti,
                //         "nim": $scope.item.nim,
                //         "nomorhp": $scope.item.telp,
                //         "jeniskelaminfk": $scope.item.jeniskelamin.id,
                //         "objectruanganlastfk": ruangan,
                //         "objectpegawailastfk": pegawai,
                //         "email": $scope.item.email,
                //         "image": "noimage",
                //     };
                //     
                //     medifirstService.post('sdm/pendidikan/save-pesertadidik', data).then(function (e) {
                //         $scope.item = {};
                //         // $state.go('DaftarPenelitianEksternal')
                //         $scope.isRouteLoading = false;
                //         loadDataCombo();
                //     })
                // }
                // else{
                //     var reader = new FileReader();
                //     console.log("next");
                //     reader.onload = function () {
                //         $scope.base64String = reader.result.replace("data:", "")
                //             .replace(/^.+,/, "");
                //         console.log($scope.base64String);
                //         // $scope.image = base64String
                    
                //         var data = {
                //             "norec": false,
                //             "noregistrasifk": $state.params.norec,
                //             "nama": $scope.item.namapeneliti,
                //             "nim": $scope.item.nim,
                //             "nomorhp": $scope.item.telp,
                //             "jeniskelaminfk": $scope.item.jeniskelamin.id,
                //             "objectruanganlastfk": ruangan,
                //             "objectpegawailastfk": pegawai,
                //             "email": $scope.item.email,
                //             "image": $scope.base64String,
                //         };
                //         if ($scope.norec < $scope.kendo + 1) {
                            
                //             window.messageContainer.error("Data tidak berhasil disimpan Quota Peserta sudah Terpenuhi.");
                //             $scope.item = {};
                //             return;
                //         }
                //         console.log($scope.base64String);
                //         medifirstService.post('sdm/pendidikan/save-pesertadidik', data).then(function (e) {
                //             $scope.item = {};
                //             // $state.go('DaftarPenelitianEksternal')
                //             $scope.isRouteLoading = false;
                //             loadDataCombo();
                //         })
                //     }
                //     reader.readAsDataURL(image)
                //     console.log(image);
                // }
                // formData.append('norec', false)
                // formData.append('noregistrasifk', $state.params.norec)
                // formData.append('nama', $scope.item.namapeneliti)
                // formData.append('nim', $scope.item.nim)
                // formData.append('nomorhp', $scope.item.telp)
                // formData.append('jeniskelaminfk', $scope.item.jeniskelamin.id)
                // formData.append('objectruanganlastfk', ruangan)
                // formData.append('objectpegawailastfk', pegawai)
                // formData.append('email', $scope.item.email)
                // formData.append('image', base64String)

                
                // var arr = document.cookie.split(';')
                // var authorization;
                // for (var i = 0; i < arr.length; i++) {
                //     var element = arr[i].split('=');
                //     if (element[0].indexOf('authorization') > 0) {
                //         authorization = element[1];
                //     }
                // }
                
                // fetch(url, {
                //     method: 'POST',
                //     body: formData,
                //     headers: {
                //         'X-AUTH-TOKEN': authorization
                //     }
                // }).then(response => {
                //     // console.log(response)
                //         $scope.isRouteLoading = false
                //     if (response.status == 201)
                //         toastr.info('Sukses');
                //     else
                //         toastr.info('Simpan Gagal');
                // })
            }

            $scope.updated = function () {
                const url = baseTransaksi + 'sdm/pendidikan/update-pesertadidik'

                const form = document.querySelector('form')

                const formData = new FormData()
                var image = "noimage"

                $scope.isRouteLoading = true;
                //bikin if untuk ruangan dan pegawai
                var ruangan = null
                var pegawai = null
                if (document.querySelectorAll('[type=file]')[0].files[0] != undefined) {
                    image = document.querySelectorAll('[type=file]')[0].files[0]
                }
                console.log(image);
                formData.append('norec', $scope.dataSelected.norec_eks)
                formData.append('noregistrasifk', $state.params.norec)
                formData.append('nama', $scope.item.namapeneliti)
                formData.append('nim', $scope.item.nim)
                formData.append('nomorhp', $scope.item.telp)
                formData.append('jeniskelaminfk', $scope.item.jeniskelamin.id)
                formData.append('objectruanganlastfk', ruangan)
                formData.append('objectpegawailastfk', pegawai)
                formData.append('email', $scope.item.email)
                formData.append('image', image)

                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
                // console.log(formData);
                // return
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                }).then(response => {
                    // console.log(response)
                    if (response.status == 201) {
                        toastr.info('Sukses');
                        $scope.item = {};
                        $scope.isRouteLoading = false;
                        loadDataCombo();
                    } else {
                        toastr.info('Simpan Gagal');
                    }
                    // $scope.loadDataSip();
                    // $scope.batalSip();
                })


                // $scope.isRouteLoading = true;
                // //bikin if untuk ruangan dan pegawai
                // var ruangan = null
                // var pegawai = null
                // // var NOREC = $scope.dataSelected.norec_eks
                // const image = document.querySelectorAll('[type=file]')[0].files[0]
                // console.log(image);
                
                // if (image == undefined) {
                //     var data = {
                //         "norec": $scope.dataSelected.norec_eks,
                //         "noregistrasifk": $state.params.norec,
                //         "nama": $scope.item.namapeneliti,
                //         "nim": $scope.item.nim,
                //         "nomorhp": $scope.item.telp,
                //         "jeniskelaminfk": $scope.item.jeniskelamin.id,
                //         "objectruanganlastfk": ruangan,
                //         "objectpegawailastfk": pegawai,
                //         "email": $scope.item.email,
                //         "image": "noimage"
                //     }
                //     medifirstService.post('sdm/pendidikan/update-pesertadidik', data).then(function (e) {
                //         $scope.item = {};
                //         // $state.go('DaftarPenelitianEksternal')
                //         $scope.isRouteLoading = false;
                //         loadDataCombo();
                //     })
                // } 
                // else {
                //     var reader = new FileReader();
                //     console.log("next");
                //     reader.onload = function () {
                //         $scope.base64String = reader.result.replace("data:", "")
                //             .replace(/^.+,/, "");
                //         console.log($scope.base64String);
                //         // $scope.image = base64String

                //         var data = {
                //             "norec": $scope.dataSelected.norec_eks,
                //             "noregistrasifk": $state.params.norec,
                //             "nama": $scope.item.namapeneliti,
                //             "nim": $scope.item.nim,
                //             "nomorhp": $scope.item.telp,
                //             "jeniskelaminfk": $scope.item.jeniskelamin.id,
                //             "objectruanganlastfk": ruangan,
                //             "objectpegawailastfk": pegawai,
                //             "email": $scope.item.email,
                //             "image": $scope.base64String
                //         }
                //         medifirstService.post('sdm/pendidikan/update-pesertadidik', data).then(function (e) {
                //             $scope.item = {};
                //             // $state.go('DaftarPenelitianEksternal')
                //             $scope.isRouteLoading = false;
                //             loadDataCombo();
                //         })
                //     }
                //     reader.readAsDataURL(image)
                //     console.log(image);
                // }
              

            }
            //tambah ruangan
            $scope.tambahRuangan = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                    return
                }
                $scope.item.nimm = $scope.dataSelected.nim
                $scope.item.namaPasien = $scope.dataSelected.nama;
                $scope.item.jeniskelamin = $scope.dataSelected.jeniskelamin;
                // $scope.itemDd.noRM = $scope.dataPasienSelectedR.nocm;
                // $scope.itemDd.namaPasien = $scope.dataPasienSelectedR.namapasien;
                // $scope.itemDd.tglLahir = moment($scope.dataPasienSelectedR.tgllahir).format('DD-MM-YYYY');
                // $scope.itemDd.noRegistrasi = $scope.dataPasienSelectedR.noregistrasi;
                loadDetailRiwayat();
                $scope.popUpTambahRuangan.center().open();
                var actions = $scope.popUpTambahRuangan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTambahRuangan.setOptions({
                    actions: actions
                });
                
            }

            $scope.TutupPopUps = function () {
                // $scope.itemDd.noRM = undefined;
                // $scope.itemDd.namaPasien = undefined;
                // $scope.itemDd.tglLahir = undefined;
                // $scope.itemDd.noRegistrasi = undefined;
                // $scope.itemDd.JumlahRawat = undefined;
                // $scope.dataDetailRegistrasi = new kendo.data.DataSource({
                //     data: []
                // });
                $scope.popUpTambahRuangan.close();
            }

            function loadDetailRiwayat() {
                $scope.isRouteLoading = true
                medifirstService.get("sdm/pendidikan/get-detail-pdruangan?noregistrasi=" + $scope.dataSelected.norec_eks).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataa = data.data.data;
                    for (var i = 0; i < dataa.length; i++) {
                        dataa[i].no = i + 1
                    }
                    $scope.dataDetail = new kendo.data.DataSource({
                        data: dataa,
                        pageSize: 10,
                        total: dataa.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }

            $scope.SearchEnterDetail = function () {
                loadDetailRiwayat();
            }
            $scope.columnDetail = {
                toolbar: ["excel", ],
                excel: {
                    fileName: "Laporan .xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    
                },
                groupable: false,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px",
                    },
                    {
                        field: "tglmasuk",
                        title: "Tanggal Masuk",
                        width: "100px",
                    },
                    {
                        field: "ruanganlast",
                        title: "Ruangan",
                        width: "100px",
                    },
                    {
                        field: "namalengkap",
                        title: "Pembimbing",
                        width: "100px",
                    },
                    {
                        "command": [{
                            text: "Hapus",
                            click: deleteRows
                        }],
                        width: 70
                    }
                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }
            $scope.saveruangan = function () {
            // $scope.isRouteLoading = true;
             //bikin if untuk ruangan dan pegawai
            
            var norec =''
            $scope.ruangan = null
            var data = {
                "norec": norec,
                "noregistrasifk": $scope.dataSelected.norec_eks,
                "tglmasuk": moment($scope.now).format('YYYY-MM-DD HH:mm'),
                "objectruanganasalfk": $scope.ruangan ? $scope.ruangan : null,
                "objectruanganlastfk": $scope.item.ruangan.id,
                "objectpegawaifk": $scope.item.pegawai.id,
                "norec_pdruangan": $scope.norec_maeks,
            };
            // return
            medifirstService.post('sdm/pendidikan/save-pdruangan', data).then(function (e) {
                // $scope.item = {};
                // $state.go('DaftarPenelitianEksternal')
                $scope.isRouteLoading = false;
                loadDataCombo();
                loadDetailRiwayat();
            })
            }

            $scope.klikGridDetail= function(dataPasienSelectedDetail){
            }

            $scope.deletedRow = function() {
                    $scope.isRouteLoading = true;
                var datasend = {
                    "statusenabled": true,
                    "norec": $scope.dataSelected.norec_eks,
                    "image": $scope.dataSelected.image,
                    "email": $scope.dataSelected.email
                };
                console.log(datasend);
                // return
                $scope.isRouteLoading = true;
                medifirstService.post("sdm/pendidikan/hapus-peserta-didik", datasend).then(function (e) {
                    $scope.isRouteLoading = false;
                    loadDataCombo();
                });
            }

            function deleteRows(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    // "a": 'okee',
                    "norec": dataItem.norec
                };
                // return
                medifirstService.post("sdm/pendidikan/save-pdruangan", datasend).then(function (e) {
                    loadDetailRiwayat();
                });
            }
            function cetaksertifikat(e) {
                 e.preventDefault();

                 var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                if (local != null) {
                    var profile = local.id;
                    var norec = dataItem.norec_eks;
                    console.log(dataItem);
                    // return
                    window.open(configuration.baseApiBackend + "report/cetak-sertifikat?norec=" + norec + '&kdprofile=' + profile +
                        '&nama=' + nama, '_blank');
                }
            }
        }
    ]);
});