
define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend;
    initialize.controller('TTDElektronikCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$mdDialog', '$parse', 
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $mdDialog, $parse) {
            $scope.item = {};

            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            cacheHelper.set('cacheNomorEMR', undefined);

            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''

            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false;
            $scope.disabledSimpan = false;
            $scope.disabledBatal = false;
            $scope.verify = {}
            $scope.PegawaiLogin2 = {};
            $scope.item.periodeAwal = new Date(moment(new Date()).format('YYYY-MM-DD 00:00'));
            $scope.item.periodeAkhir = new Date(moment(new Date()).format('YYYY-MM-DD 23:59'));
            var paramSearch = ''
            var pegawai = medifirstService.getPegawaiLogin()
            $scope.SistoleChart = false;
            $scope.NonSistoleChart = false;

           
            if ($state.params.noRec == undefined) {
                cacheHelper.get('cacheRekamMedis', undefined);
            }
            $scope.listPage = [
                {id:1,page:'Halaman 1'},
                {id:2,page:'Halaman 2'},
                {id:3,page:'Halaman 3'},
                {id:4,page:'Halaman 4'},
                {id:5,page:'Halaman 5'},
                {id:6,page:'Halaman 6'},
                {id:7,page:'Halaman 7'},
                {id:8,page:'Halaman 8'},
                {id:9,page:'Halaman 9'},
                {id:10,page:'Halaman 10'},
                {id:11,page:'Halaman 11'},
                {id:12,page:'Halaman 12'},
            ]
            $scope.item.page = {
                id:1, page:'Halaman 1'
            }
            $scope.cacheRM = undefined
            $scope.cachePARAM = undefined
            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {
                    $scope.cacheRM = chacePeriode
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.qnocm =   $scope.item.noMr
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    delete  $scope.item.periodeAwal
                    delete  $scope.item.periodeAkhir
                    init()
                  
                    medifirstService.get("bsre-esign/get-combo", true).then(function (dat) {
                        $scope.listPegawai = dat.data.pegawai;
                     
                 
                    });
                }
                if (!$state.params.noRec) {
                    $scope.cacheRM = undefined
                    $scope.cachePARAM = '-'
                    medifirstService.get("bsre-esign/get-combo", true).then(function (dat) {
                        $scope.listPegawai = dat.data.pegawai;
        
                        $scope.item.qdokter = {id:pegawai.id,namalengkap:pegawai.namaLengkap}
                        init()
                 
                    });
                }
                var onDataBound = function (e) {
                    var kendoGrid = $("#Grid").data("kendoGrid"); // get the grid widget
                    var rows = e.sender.element.find("tbody tr"); // get all rows
                    // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (kendoGrid.dataItem(row).status == '✔') {
                            $(row.cells[14]).addClass("green");
                        } else {
                            $(row.cells[14]).addClass("red");
                        }
                    }
                }
                $scope.columnDaftar = {
                    selectable: 'row',
                    dataBound: onDataBound,
                    pageable: true,
                    groupable: true,
                    toolbar: [
                        {
                            name: "add", text: "Tambah",
                            template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>',
    
                        },
    
                    ],
                    columns:
                        [
                            {
                                "command": [
                                    { text: "Download", click: DownloadBerkas, imageClass: "k-icon k-i-download" },
                                    { text: "View", click: LihatBerkas, imageClass: " fa fa-eye" },
                                    { text: "Delete", click: hapus, imageClass: "k-icon k-i-close", },
                                    { text: "Edit", click: editBerkas, imageClass: "k-icon k-i-pencil" },
                                    { text: "Verify", click: verifyData, imageClass: "fa fa-check" },
                                    { text: "Koordinat", click: koordinatData, imageClass: "fa fa-check" },
                                ],
                                title: "",
                                width: "180px",
                                hidden: $scope.cachePARAM != undefined
                            },
                            {
                                "command": [
                                    { text: "Download", click: DownloadBerkas2, imageClass: "k-icon k-i-download" },
                                    { text: "View", click: LihatBerkas, imageClass: " fa fa-eye" },
                                    { text: "Sign Doc", click: tandaTangan, imageClass: "fa fa-key" },
                                    { text: "Verify", click: verifyData, imageClass: "fa fa-check" },
                                    { text: "Koordinat", click: koordinatData, imageClass: "fa fa-check" },

                                ],
                                title: "",
                                width: "180px",
                                hidden: $scope.cachePARAM == undefined
                            },
                            {
                                "field": "noregistrasi",
                                "title": "No Registrasi",
                                "width": "120px",
                            },
                            {
                                "field": "nocm",
                                "title": "No RM",
                                "width": "120px",
                                hidden: $scope.cachePARAM == undefined
                            },
                            {
                                "field": "namapasien",
                                "title": "Nama Pasien",
                                "width": "200px",
                                hidden: $scope.cachePARAM == undefined
                            },
    
                            {
                                "field": "tglemr",
                                "title": "Tgl Pengajuan",
                                "width": "120px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                            },
                            {
                                "field": "tglttd",
                                "title": "Tgl TTD",
                                "width": "120px",
                                "template": "<span class='style-left'>{{formatTanggal('#: tglttd #')}}</span>"
                            },
                            {
                                "field": "namadokumen",
                                "title": "Nama Dokumen",
                                "width": "200px",
                            },
                            {
                                "field": "nomoremr",
                                "title": "No EMR",
                                "width": "120px",
                            },
                            {
                                "field": "deskripsi",
                                "title": "Deskripsi",
                                "width": "200px",
                            },
                            {
                                "field": "namalengkap",
                                "title": "Pegawai",
                                "width": "230px",
                            },
                            {
                                "field": "nik_pegawai",
                                "title": "NIK",
                                "width": "150px",
                            },
                            {
                                "field": "namafile",
                                "title": "File",
                                "width": "200px",
                            },
                            {
                                "field": "status",
                                "title": "Status TTD",
                                "width": "200px",
                            },
    
                        ]
                }
            }
            $scope.SearchData = function () {
                init()
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                    init()
                }
                else {
                    paramSearch = 'nocm=' + $scope.item.noMr
                    init()
                }
            }
            $scope.refresh = function () {
                init()
            }
            function init() {
                var noregistrasi = ''
                if ($scope.item.qnoreg) {
                    noregistrasi = '&noregistrasi=' + $scope.item.qnoreg
                }
                var qdokter = ''
                if ($scope.item.qdokter) {
                    qdokter = '&dokter=' + $scope.item.qdokter.id
                }
                var qnocm = ''
                if ($scope.item.qnocm) {
                    qnocm = '&nocm=' + $scope.item.qnocm
                }
                var qnama = ''
                if ($scope.item.qnama) {
                    qnama = '&namapasien=' + $scope.item.qnama
                }
                var dari = ''
                if ($scope.item.periodeAwal) {
                    dari = '&dari=' + moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm')
                }
                var sampai = ''
                if ($scope.item.periodeAkhir) {
                    sampai = '&sampai=' + moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm')
                }
                $scope.isRouteLoading = true
                medifirstService.get("bsre-esign/get-ttd?" + paramSearch
                    + noregistrasi
                    + qdokter
                    + qnocm
                    + qnama
                    + dari
                    + sampai
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false
                        for (let x = 0; x < dat.data.data.length; x++) {
                            const element = dat.data.data[x];
                            element.status = element.status == true ? '✔' : '✘'
                        }
                        $scope.dataDaftar = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageSize: 10,
                            group: {
                                field: "noregistrasi",
                            },
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

            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null') return ''
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
          
      

            if ($scope.cachePARAM != undefined) {
                $(".k-grid-toolbar#Grid").hide();
            }
            $scope.inputBaru = function () {
                if ($scope.cacheRM == undefined) {
                    toastr.error('Tidak bisa menambah data')
                    return
                }
                clear()
                $scope.dataSelected = undefined
                $scope.norecDOK = undefined
                $scope.popUpFile.center().open()
            }
            $scope.batal = function () {
                $scope.popUpFile.close()
            }
            function clear() {
                document.getElementById("formFile2").reset();
                document.getElementById("formFile").reset();

                document.getElementById("filePasien").removeAttribute("disabled");
                document.getElementById("fileTTD").removeAttribute("disabled");
                delete $scope.item.namafile
                delete $scope.item.keterangan
                delete $scope.item.pegawai
                delete $scope.item.nik
                delete $scope.item.namadokumen
                delete $scope.item.nomoremr
                delete $scope.item.linkQR
                delete $scope.item.reason
                delete $scope.norecDOK
                delete $scope.item.passphrase
            }
            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }
            function editBerkas(e) {

                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if ($scope.cacheRM == undefined) {
                    toastr.error('Tidak bisa memproses data')
                    return
                }
                $scope.item.norecDOK = dataItem.id
                $scope.item.pegawai = { id: dataItem.pegawaifk, namalengkap: dataItem.namalengkap }
                $scope.item.nik = dataItem.nik_pegawai
                $scope.item.namadokumen = dataItem.namadokumen
                $scope.item.nomoremr = dataItem.nomoremr
                $scope.item.linkQR = dataItem.linkQR
                $scope.item.reason = dataItem.reason
                document.getElementById("filePasien").setAttribute("disabled", "disabled");
                document.getElementById("fileTTD").setAttribute("disabled", "disabled");
                $scope.popUpFile.center().open()
            }
            function verifyData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status != '✔') {
                    toastr.error('Dokumen ini belum di tanda tangani')
                    return
                }
                $scope.verify = {}
                medifirstService.get("bsre-esign/verify-ttd?id=" + dataItem.id).then(function (dat) {
                    if (dat.data == false || dat.data.status != undefined) {
                        toastr.error(dat.data.message)
                        return
                    }
                    $scope.verify = dat.data
                    $scope.popUp2.center().open()
                });
            }
            function Paging(e, paging){
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                const pdfUrl = strBACKEND + "service/storage_path?path=" + e.file +
                    "&mimetype=application/pdf";
                console.log(pdfUrl);
                // Dapatkan referensi ke elemen <canvas>
                var canvas = document.getElementById('pdfCanvas');
                // Muat dokumen PDF
                pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
                    // Pilih halaman PDF yang akan ditampilkan (misalnya, halaman pertama)
                    var pageNumber = paging;

                    // Muat halaman PDF
                    pdf.getPage(pageNumber).then(function (page) {
                        // Dapatkan konteks 2D dari elemen <canvas>
                        var context = canvas.getContext('2d');

                        // Dapatkan ukuran halaman PDF
                        var viewport = page.getViewport({
                            scale: 1
                        });

                        // Sesuaikan ukuran elemen <canvas> dengan ukuran halaman PDF
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        // Render halaman PDF ke elemen <canvas>
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                });
            }
            function koordinatData(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                Paging(dataItem, 1)
                $scope.dataItem = dataItem
                $scope.popUpk.center().open().maximize()
            }
            function hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if ($scope.cacheRM == undefined) {
                    toastr.error('Tidak bisa memproses data')
                    return
                }
                medifirstService.post("bsre-esign/delete-ttd?id=" + dataItem.id).then(function (dat) {
                    init()
                });
            }
            function LihatBerkas(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage_path?path=" + dataItem.file
                    + "&mimetype=application/pdf");
            }
            function DownloadBerkas(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
              
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage_path?path=" + dataItem.file + "&type=download" + "&filename=" + dataItem.namafile
                    + "&mimetype=application/pdf");
            }
            function DownloadBerkas2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status != '✔') {
                    toastr.error('Dokumen ini belum di tanda tangani')
                    return
                }
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage_path?path=" + dataItem.file + "&type=download" + "&filename=" + dataItem.namafile
                    + "&mimetype=application/pdf");
            }
            

            $scope.Save = function (data) {
                if ($scope.item.pegawai == undefined) {
                    toastr.error("Pegawai harus di isi!")
                    return
                }
                if ($scope.item.nik == undefined) {
                    toastr.error("NIK harus di isi!")
                    return
                }
                if ($scope.item.namadokumen == undefined) {
                    toastr.error("Nama Dokumen harus di isi!")
                    return
                }
                const file = document.getElementById("filePasien").files[0];
                const file2 = document.getElementById("fileTTD").files[0];
                if (file == undefined) {
                    toastr.error('Silahkan Dokumen File Berkas')
                    return;
                }


                const url = baseTransaksi + 'bsre-esign/save-ttd'
                const formData = new FormData()

                if (file != undefined) {
                    if (file.size > 10485760) {
                        toastr.error('Maksumum Ukuran File adalah 10 MB.')
                        return;
                    }
                    if (file.type != "application/pdf") {
                        toastr.error('File yang diizinkan dalam bentuk format PDF.')
                        return;
                    }
                }

                formData.append('file', file)
                formData.append('imageTTD', file2 ? file2 : null)
                formData.append('norec', $scope.norecDOK != undefined ? $scope.norecDOK : '-')
                formData.append('noregistrasi', $scope.item.noregistrasi)
                formData.append('nocm', $scope.item.noMr)
                formData.append('norec_pd', norec_pd)
                formData.append('pegawaifk', $scope.item.pegawai ? $scope.item.pegawai.id : null)
                formData.append('nik', $scope.item.nik)
                formData.append('namadokumen', $scope.item.namadokumen)
                formData.append('nomoremr', $scope.item.nomoremr)
                formData.append('linkQR', $scope.item.linkQR ? $scope.item.linkQR : null)
                formData.append('reason', $scope.item.reason ? $scope.item.reason : null)
                var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }

                var btnSimpan = angular.element(document.getElementById("btnSimpan"));
                var btnBatal = angular.element(document.getElementById("btnBatal"));
                var spinElementSimpan = angular.element('<span class="fa fa-spinner fa-spin"></span>&nbsp;<span> Sedang menyimpan</span>');
                var textElementSimpan = angular.element('<span class="k-icon k-update"></span><span>Simpan</span>');

                btnSimpan.empty();
                btnSimpan.append(spinElementSimpan);
                $scope.disabledSimpan = true;
                $scope.disabledBatal = true;
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.status != 400) {
                            var pesan = $scope.dataSelected == undefined ? "Simpan" : "Edit";
                            medifirstService.postLogging(pesan + ' TTD BSRE', 'Norec emr_bsre_t', result.dokumen.id,
                                pesan + ' TTD BSRE pada No Registrasi '
                                + $scope.item.noregistrasi + ' - Pasien : ' + $scope.item.namaPasien
                                + ' Dokumen ' + $scope.item.namadokumen).then(function (res) {
                                })

                            toastr.success(pesan + " Berkas berhasil.");

                            btnSimpan.empty();
                            btnSimpan.append(textElementSimpan);
                            $scope.disabledSimpan = false;
                            $scope.disabledBatal = false;
                            clear();
                            init();

                            $scope.popUpFile.close()

                        } else {
                            toastr.error(result.message);
                        }


                    })
                    .catch((error) => {
                        toastr.error(error.message);

                        btnSimpan.empty();
                        btnSimpan.append(textElementSimpan);
                        $scope.disabledSimpan = false;
                        $scope.disabledBatal = false;
                        // $scope.disabledSimpan = false;
                        // $scope.disabledBatal = false;
                        // $scope.popUpFile.close()
                    });
            }

            $scope.edit = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                // $scope.item.namafile = { id: $scope.dataSelected.objectberkaspasien, nama: $scope.dataSelected.namafile.split('_')[0] }

                $scope.item.norecDOK = $scope.dataSelected.id
                $scope.item.pegawai = { id: $scope.dataSelected.pegawaifk, namalengkap: $scope.dataSelected.namalengkap }
                $scope.item.nik = $scope.dataSelected.nik
                $scope.item.namadokumen = $scope.dataSelected.namadokumen
                $scope.item.nomoremr = $scope.dataSelected.nomoremr
                $scope.item.linkQR = $scope.dataSelected.linkQR
                $scope.item.reason = $scope.dataSelected.reason


                $scope.popUpFile.center().open()
            }
            $scope.hapus = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('pilih data dulu')
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('bsre-esign/delete-ttd', { norec: $scope.dataSelected.norec }).then(function (e) {
                        init()
                        medifirstService.postLogging('Hapus TTD BSRE', 'Norec emr_bsre_t', $scope.dataSelected.norec,
                            'Hapus Berkas Pasien ' + $scope.dataSelected.namadokumen + ' pada No Registrasi  '
                            + $scope.item.noregistrasi + ' - Pasien : ' + $scope.item.namaPasien).then(function (res) {
                            })
                        $scope.dataSelected = undefined
                    })
                })


            }
            $scope.changeTTD = function (e) {
                if (e) {
                    $scope.item.nik = e.noidentitas
                }
            }

            $scope.cekUser = function () {
                if (!$scope.item.nik) {
                    toastr.error('NIK harus di isi')
                    return
                }
                var btnSimpan = angular.element(document.getElementById("btnSimpanCek"));
                var spinElementSimpan = angular.element('<span class="fa fa-spinner fa-spin"></span>&nbsp;<span> Checking</span>');
                var textElementSimpan = angular.element('<span class="k-icon k-update"></span><span>Cek Status</span>');

                btnSimpan.empty();
                btnSimpan.append(spinElementSimpan);

                medifirstService.get("bsre-esign/user/status/" + $scope.item.nik).then(function (dat) {
                    btnSimpan.empty();
                    btnSimpan.append(textElementSimpan);
                    if (dat.data.status_code == 1111) {
                        toastr.success(dat.data.message, 'BSRE')
                    } else {
                        toastr.warning(dat.data.message, 'BSRE')
                    }
                });


            }
            function tandaTangan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status == '✔') {
                    toastr.error('Dokumen ini sudah di tanda tangani')
                    return
                }
                var pegawai = medifirstService.getPegawaiLogin()
                if(pegawai.id != dataItem.pegawaifk){
                    toastr.error('Dokumen ini hanya boleh di tanda tangan oleh '+dataItem.namalengkap+ '. Silahkan login menggunakan akun tsb')
                    return
                }
                clear()
                $scope.item.norecDOK = dataItem.id
                $scope.item.pegawai = { id: dataItem.pegawaifk, namalengkap: dataItem.namalengkap }
                $scope.item.nik = dataItem.nik_pegawai
                $scope.item.file = dataItem.file
                $scope.item.namadokumen = dataItem.namadokumen
                $scope.item.nomoremr = dataItem.nomoremr
                $scope.item.linkQR = dataItem.linkQR
                $scope.item.reason = dataItem.reason
                $scope.popUpTTD.center().open()
            }
            $scope.lihatDok = function () {

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage_path?path=" + $scope.item.file
                    + "&mimetype=application/pdf");
            }
            $scope.SaveUpdate = function () {
                if ($scope.item.pegawai == undefined) {
                    toastr.error("Pegawai harus di isi!")
                    return
                }
                if ($scope.item.nik == undefined) {
                    toastr.error("NIK harus di isi!")
                    return
                }
                if ($scope.item.namadokumen == undefined) {
                    toastr.error("Nama Dokumen harus di isi!")
                    return
                }
                if ($scope.item.passphrase == undefined) {
                    toastr.error("Pass Phrase harus di isi!")
                    return
                }
                // var json = {
                //     'norec': $scope.item.norecDOK,
                //     'passphrase': $scope.item.passphrase,
                //     'nik': $scope.item.nik,
                //     'reason': $scope.item.reason ? $scope.item.reason : null,
                //     'iduser': medifirstService.getUserLogin().id,
                //     'page': $scope.item.page.id,
                //     'xAxis': $scope.xaxis,
                //     'yAxis': $scope.yaxis,
                //     'width': $scope.item.sizeWidth,
                //     'height': $scope.item.sizeHeight
                //     // 'namadokumen': $scope.item.namadokumen
                // }
                var json = {
                    'norec': $scope.item.norecDOK,
                    'passphrase': $scope.item.passphrase,
                    'nik': $scope.item.nik,
                    'reason': $scope.item.reason ? $scope.item.reason : null,
                    'page': $scope.item.page != undefined ? $scope.item.page.id : '1',
                    'iduser': medifirstService.getUserLogin().id
                }


                var btnSimpan = angular.element(document.getElementById("btnSimpan2"));
                var btnBatal = angular.element(document.getElementById("btnBatal2"));
                var spinElementSimpan = angular.element('<span class="fa fa-spinner fa-spin"></span>&nbsp;<span> Sedang menyimpan</span>');
                var textElementSimpan = angular.element('<span class="k-icon k-update"></span><span>Simpan</span>');

                btnSimpan.empty();
                btnSimpan.append(spinElementSimpan);


                medifirstService.post('bsre-esign/save-ttd-pengajuan', json).then(function (e) {

                    btnSimpan.empty();
                    btnSimpan.append(textElementSimpan);
                    $scope.popUpFile.close()
                    clear();
                    init();

                }, function (error) {

                    btnSimpan.empty();
                    btnSimpan.append(textElementSimpan);
                    $scope.disabledSimpan = false;
                    $scope.disabledBatal = false;
                })

            }
            $scope.batal = function(){
                $scope.popUpTTD.close()
            }
            $scope.cekDulu = function(){
                if($scope.item.sizeWidth == undefined){
                    toastr.error('Lebar Barcode Wajib Diisi')
                    return
                }
                if ($scope.item.sizeHeight == undefined) {
                    toastr.error('Tinggi Barcode Wajib Diisi')
                    return
                }
                const canvas = document.getElementById('pdfCanvas');
                const ctx = canvas.getContext('2d');
                const imageElement = document.getElementById('movingImage');
                const canvasRect = canvas.getBoundingClientRect();
                $scope.xaxis = imageElement.offsetLeft
                $scope.yaxis = imageElement.offsetTop
                $scope.popUpk.close()
            }
            $scope.changePage = function (e, page) {
                Paging(e, page.id)
            }
            // Dapatkan referensi ke elemen gambar
            const movingImage = document.getElementById('movingImage');

            // Fungsi untuk menggerakkan gambar ke koordinat (x, y)
            function moveImageTo(x, y) {
                movingImage.style.left = x + 'px';
                movingImage.style.top = y + 'px';
            }

            // Panggil fungsi untuk memindahkan gambar ke (200px, 200px)
            moveImageTo(200, 200);
            let isDragging = false;
            let offsetX, offsetY;

            movingImage.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - parseInt(movingImage.style.left, 10);
                offsetY = e.clientY - parseInt(movingImage.style.top, 10);
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                moveImageTo(x, y);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            //slider
            const image = document.getElementById('movingImage');
            const widthSlider = document.getElementById('imageWidthSlider');
            const heightSlider = document.getElementById('imageHeightSlider');
            const widthInput = document.getElementById('imageWidthInput');
            const heightInput = document.getElementById('imageHeightInput');

            // Fungsi untuk mengatur ukuran gambar
            function resizeImage() {
                const newWidth = widthInput.value;
                const newHeight = heightInput.value;
                image.style.width = newWidth + 'px';
                image.style.height = newHeight + 'px';
            }

            // Menambahkan event listener untuk slide
            widthSlider.addEventListener('input', resizeImage);
            heightSlider.addEventListener('input', resizeImage);

            // Menambahkan event listener untuk input angka
            widthInput.addEventListener('input', resizeImage);
            heightInput.addEventListener('input', resizeImage);

            // Inisialisasi ukuran awal gambar
            resizeImage();
            $scope.$watch('item.sizeWidth', function(newValue, oldValue){
                if (newValue!= oldValue){
                    document.getElementById('imageWidthInput').value = $scope.item.sizeWidth
                    document.getElementById('imageHeightInput').value = $scope.item.sizeWidth
                    $scope.item.sizeHeight = $scope.item.sizeWidth
                    const image = document.getElementById('movingImage');
                    const widthSlider = document.getElementById('imageWidthSlider');
                    const heightSlider = document.getElementById('imageHeightSlider');
                    const widthInput = document.getElementById('imageWidthInput');
                    const heightInput = document.getElementById('imageHeightInput');

                    // Fungsi untuk mengatur ukuran gambar
                    function resizeImage() {
                        const newWidth = widthInput.value;
                        const newHeight = heightInput.value;
                        image.style.width = newWidth + 'px';
                        image.style.height = newHeight + 'px';
                    }

                    // Menambahkan event listener untuk slide
                    widthSlider.addEventListener('input', resizeImage);
                    heightSlider.addEventListener('input', resizeImage);

                    // Menambahkan event listener untuk input angka
                    widthInput.addEventListener('input', resizeImage);
                    heightInput.addEventListener('input', resizeImage);

                    // Inisialisasi ukuran awal gambar
                    resizeImage();
                }
            })
            $scope.$watch('item.sizeHeight', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    document.getElementById('imageHeightInput').value = $scope.item.sizeHeight
                    const image = document.getElementById('movingImage');
                    const widthSlider = document.getElementById('imageWidthSlider');
                    const heightSlider = document.getElementById('imageHeightSlider');
                    const widthInput = document.getElementById('imageWidthInput');
                    const heightInput = document.getElementById('imageHeightInput');

                    // Fungsi untuk mengatur ukuran gambar
                    function resizeImage() {
                        const newWidth = widthInput.value;
                        const newHeight = heightInput.value;
                        image.style.width = newWidth + 'px';
                        image.style.height = newHeight + 'px';
                    }

                    // Menambahkan event listener untuk slide
                    widthSlider.addEventListener('input', resizeImage);
                    heightSlider.addEventListener('input', resizeImage);

                    // Menambahkan event listener untuk input angka
                    widthInput.addEventListener('input', resizeImage);
                    heightInput.addEventListener('input', resizeImage);

                    // Inisialisasi ukuran awal gambar
                    resizeImage();
                     
                }
            })
            

        }
    ]);
});
