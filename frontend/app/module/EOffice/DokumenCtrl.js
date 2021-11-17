define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';

    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('DokumenCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', '$http', 'MedifirstService', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, DateHelper, $http, medifirstService, $state, cacheHelper) {
            var fileTypes = ['doc', 'docx']; //acceptable file types
            var files;
            $scope.item = {};
            $scope.now = new Date();
            $scope.item.ruanganTujuan = [];
            $scope.item.revisike = 0;
            var $norecHead = "-";
            var $norec = "-";
            var $nosuratawal = "";
            var $statusEditRevisi = "";
            var $idloginuser = 0;
            loadCombo();
            init();

            function loadCombo() {
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDiteruskan = data;
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                $scope.item.tanggalAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                medifirstService.get("eoffice/get-combo-input-surat", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listTipeSurat = dat.data.tipesurat;
                    $scope.listSifatSurat = dat.data.sifatsurat;
                    $scope.listJenisSurat = dat.data.jenissurat;
                    $scope.listSubJenisSurat = dat.data.subjenissurat;
                    $scope.listJenisArsip = dat.data.jenisarsip;
                    $scope.listStatusBerkas = dat.data.statusberkas;
                    $scope.item.nomorSurat = dat.data.nosurat;
                    $nosuratawal = dat.data.nosurat;
                    $scope.listInstalasi = dat.data.instalasi;
                    $scope.listUnitKerja = medifirstService.getMapLoginUserToRuangan();
                    $scope.item.unitKerja = $scope.listUnitKerja[0];
                    $scope.listStatus = dat.data.statusediting;
                    var jmlrevisi = 0;
                    var chacePeriode = cacheHelper.get('DaftarAgendaCtrl');
                    if (chacePeriode != undefined) {
                        //var arrPeriode = chacePeriode.split(':');
                        $scope.item.norec = chacePeriode[0];
                        $norecHead = chacePeriode[2];
                        $norec = chacePeriode[0];
                        if (chacePeriode[1] == "edit") {
                            $statusEditRevisi = "edit"
                            jmlrevisi = 1;
                        }
                        if (chacePeriode[1] == "revisi") {
                            $statusEditRevisi = "revisi"
                            $scope.item.status = { id: dat.data.statusediting[3].id, statusediting: dat.data.statusediting[3].statusediting };
                            jmlrevisi = 1;
                        }
                        if (chacePeriode[1] == "Verifikasi") {
                            $statusEditRevisi = "Verifikasi"
                            $scope.item.status = { id: dat.data.statusediting[5].id, statusediting: dat.data.statusediting[5].statusediting };
                            jmlrevisi = 1;
                        }
                        $scope.tittle = $statusEditRevisi + " Dokumen"
                        $scope.tittle = $scope.tittle.toUpperCase()
                        if ($norec != '-') {
                            medifirstService.get("eoffice/get-detail-daftar-surat?" +
                                "norec=" + $scope.item.norec + "&kelompok=-"
                                , true).then(function (dat) {
                                    $scope.isRouteLoading = false;
                                    $scope.item.tanggalAwal = dat.data.daftar[0].tglsurat
                                    $scope.item.namaSurat = dat.data.daftar[0].namasurat
                                    $scope.item.tipeSurat = { id: dat.data.daftar[0].objecttipesuratfk, name: dat.data.daftar[0].tipesurat }
                                    $scope.item.sifatSurat = { id: dat.data.daftar[0].objectsifatsuratfk, name: dat.data.daftar[0].tipesurat }
                                    $scope.item.statusBerkas = { id: dat.data.daftar[0].objectstatusberkasfk, name: dat.data.daftar[0].tipesurat }
                                    $scope.item.jenisSurat = { id: dat.data.daftar[0].objectjenissuratfk, name: dat.data.daftar[0].tipesurat }
                                    $scope.listSubJenisSurat = [{ id: dat.data.daftar[0].subjenissuratfk, subjenissurat: dat.data.daftar[0].subjenissurat }]
                                    $scope.item.subjenisSurat = { id: dat.data.daftar[0].subjenissuratfk, subjenissurat: dat.data.daftar[0].subjenissurat }
                                    $scope.item.jenisArsip = { id: dat.data.daftar[0].objectjenisarsipfk, name: dat.data.daftar[0].jenisarsip }
                                    $scope.item.jangkaWaktu = dat.data.daftar[0].jangkawaktu
                                    $scope.item.asalSurat = dat.data.daftar[0].asalsurat
                                    $scope.item.penerimaSurat = dat.data.daftar[0].penerimasurat
                                    $scope.item.ruanganPenerima = dat.data.daftar[0].ruanganpenerima
                                    $scope.item.nomorSurat = dat.data.daftar[0].nosurat
                                    $scope.item.perihal = dat.data.daftar[0].perihal
                                    $scope.item.lampiranPerihal = dat.data.daftar[0].lampiranperihal
                                    $scope.item.instalasi = { id: dat.data.daftar[0].objectdepartemenfk, namadepartemen: dat.data.daftar[0].namadepartemen }
                                    $scope.item.unitPembuat = dat.data.daftar[0].unitpembuat
                                    if ($scope.item.status == undefined) {
                                        $scope.item.status = { id: dat.data.daftar[0].objectstatusfk, statusediting: dat.data.daftar[0].statusediting }
                                    }
                                    $scope.item.revisike = parseFloat(dat.data.daftar[0].revisike) + parseFloat(jmlrevisi)
                                    $scope.item.ketrevisi = dat.data.daftar[0].keteranganrevisi
                                    $scope.item.wyswyg = dat.data.daftar[0].wyswyg


                                    medifirstService.get("eoffice/get-riwayat-surat?" +
                                        "nosurat=" + $scope.item.nomorSurat
                                        , true).then(function (dat) {
                                            $scope.isRouteLoading = false;
                                            for (var i = 0; i < dat.data.daftar.length; i++) {
                                                dat.data.daftar[i].no = i + 1
                                            }
                                            // if ($statusEditRevisi == "edit") {
                                            //     $scope.item.revisike = dat.data.daftar.length 
                                            // }else{
                                            //     $scope.item.revisike = dat.data.daftar.length + 1
                                            // }
                                            $idloginuser = dat.data.data.userData.id
                                            $scope.dataGridRiwayat = new kendo.data.DataSource({
                                                data: dat.data.daftar,
                                                pageSize: 200,
                                                total: dat.data.daftar,
                                                serverPaging: false,
                                                schema: {
                                                    model: {
                                                        fields: {
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                });
                        } else {
                            $scope.item.norec = '-'
                            $norec = '-'
                            $scope.tittle = "DOKUMEN BARU"
                            $scope.item.status = dat.data.statusediting[0];
                        }


                        // init();
                    } else {

                    }
                });

                medifirstService.get("eoffice/get-template-surat?"
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $idloginuser = dat.data.data.userData.id
                        $scope.dataGridTmp = new kendo.data.DataSource({
                            data: dat.data.daftar,
                            pageSize: 200,
                            total: dat.data.daftar,
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

            $scope.getSubJenisSurat = function () {
                if ($scope.item.jenisSurat == undefined) {
                    toastr.error("Jenis Surat Masih Kosong")
                    return;
                }

                medifirstService.get("eoffice/get-combo-sub-jenis-surat?idJenisSurat=" + $scope.item.jenisSurat.id
                    , true).then(function (dat) {
                        $scope.listSubJenisSurat = dat.data;
                    })
            }

            function getNomorSurat(str) {                
                var strs = "";
                if (str != undefined) {
                    strs = "&nosurat=" + str
                }
                var jenissurat = "";
                if ($scope.item.jenisSurat != undefined) {
                    jenissurat = "&jenissurat=" + $scope.item.jenisSurat.id
                }
                var subjenissurat = "";
                if ($scope.item.subjenisSurat != undefined) {
                    subjenissurat = "&subjenissurat=" + $scope.item.subjenisSurat.id
                }
                var deptid = "";
                if ($scope.item.instalasi != undefined) {
                    deptid = "&deptid=" + $scope.item.instalasi.id
                }
                medifirstService.get("eoffice/get-nomor-surats?" + jenissurat + subjenissurat + deptid + strs, true).then(function (dat) {                    
                    var datas = dat.data;
                    $scope.item.nomorSurat = datas
                })
            }

            $scope.getKodeSurat = function () {
                if ($statusEditRevisi == "") {
                    let str = $nosuratawal
                    if ($scope.item.jenisSurat != undefined) {
                        if ($scope.item.jenisSurat.name == "PANDUAN") {
                            str = str.replace("#KDSUBJENISSURAT#", "PER/PAN");
                        } else {
                            str = str.replace("#KDSUBJENISSURAT#", $scope.item.subjenisSurat.kode);
                        }
                    }
                    if ($scope.item.instalasi != undefined) {
                        str = str.replace("#KDINSTALASI#", $scope.item.instalasi.kodeexternal);
                    }
                    // $scope.item.nomorSurat = str
                    getNomorSurat(str)
                }
            }

            $scope.batal = function () {
                $state.go("DaftarAgenda");
            }

            // initial();
            function initial() {
                $scope.item = {};
                $scope.item.ruanganTujuan = [];
                $scope.item.pegawai = ModelItem.getPegawai();
                $scope.item.penerimaSurat = $scope.item.pegawai.namaLengkap;
                $scope.item.ruanganPenerima = $scope.item.pegawai.ruangan.namaRuangan;
            }


            $scope.listJangkaWaktuRange = [{ 'id': 1, 'name': 'Hari' }, { 'id': 2, 'name': 'Minggu' }, { 'id': 3, 'name': 'Bulan' }, { 'id': 4, 'name': 'Tahun' }]

            $scope.Cancel = function () {
                initial();
            }


            $scope.onSelectFile = function (e) {
                var tempArray = e.files[0].rawFile.name.split(".");
                files = e.files[0].rawFile;
                /*if(tempArray[tempArray.length-1] != "doc"){
                    window.messageContainer.error("File upload tidak sesuai \n extension file harus .doc atau docx");
                    
                    if(files != e.files[0].rawFile)
                    {
                        setTimeout(function(){ 
                            $(".k-widget.k-upload.k-header.k-upload-sync").find("ul").remove(); 
                        }, 5);
                    }
                }
                else
                {
                    files = e.files[0].rawFile;
                }*/
            }
            // $scope.createSuratNew = function () {
            //     $scope.popUpSip.center().open();
            //     // var actions = $scope.popUpStr.options.actions;
            //     // actions.splice(actions.indexOf("Close"), 1);
            //     // $scope.popUpStr.setOptions({ actions: actions });
            // }
            $scope.optionsData = {
                pageable: true,
                editable: false,
                toolbar: [
                    // {
                    //     name: "create", text: "Surat Baru",
                    //     template: '<button ng-click="createSuratNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Surat Baru</button>'
                    // },
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Harga Apotik" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains",
                            startswith: "Starts with"
                        }
                    }
                },
                selectable: 'row',
                pageable: true,
                editable: false,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                    },
                    // {
                    //     "field": "nopenerimaan",
                    //     "title": "No Penerimaan",
                    //     "width": "120px",
                    // },
                    {
                        "field": "id",
                        "title": "ID",
                        "width": "50px",
                    },
                    {
                        "field": "kdproduk",
                        "title": "Kode Produk",
                        "width": "50px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "120px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "60px",
                    },
                    {
                        "field": "hargabeli",
                        "title": "Harga Beli",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargabeli #', '')}}</span>"
                    },
                    {
                        "field": "hargajual",
                        "title": "Harga Jual",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargajual #', '')}}</span>"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tanggal",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                    },
                ]

            };
            $scope.columnGridRiwayat = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Riwayat.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Riwayat",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "tglrevisi",
                        "title": "Tanggal Revisi",
                        "width": "50px",
                    },
                    {
                        "field": "revisike",
                        "title": "Revisi Ke",
                        "width": "30px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Updated By",
                        "width": "60px",
                    },
                    {
                        "field": "filename",
                        "title": "File",
                        "width": "80px",
                    },
                    {
                        command: [
                            { imageClass: "k-icon k-i-download", text: "view", click: DownloadRiwayat },
                        ], title: "&nbsp;", width: '60px'
                    }
                ]
            };

            function DownloadRiwayat(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem == undefined) {
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }
                if (dataItem.filename != null) {
                    str1 = strBACKEND + 'storage/eoffice/dokumen?norec=' + dataItem.norec + '&filename=' + dataItem.filename;
                    window.open(str1, '_blank');
                } else {
                    toastr.error('File tidak ada')
                    return
                }
            }

            $scope.columnGridTmp = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "Daftar Template.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Template Surat",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "20px",
                    },
                    {
                        "field": "namasurat",
                        "title": "Nama Dokumen",
                        "width": "60px",
                    },
                    {
                        "field": "tglrevisi",
                        "title": "Tgl Revisi",
                        "width": "60px",
                    },
                    {
                        "field": "filename",
                        "title": "File",
                        "width": "60px",
                    },
                    {
                        command: [
                            { imageClass: "k-icon k-i-download", text: "view", click: Download },
                        ], title: "&nbsp;", width: '60px'
                    }
                ]
            };

            function Download(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = ''
                if (dataItem == undefined) {
                    toastr.error("Info, Data Belum Dipilih");
                    return;
                }
                if (dataItem.filename != null) {
                    str1 = strBACKEND + 'storage/eoffice/dokumen?norec=' + dataItem.norec + '&filename=' + dataItem.filename;
                    window.open(str1, '_blank');
                } else {
                    toastr.error('File tidak ada')
                    return
                }
            }

            function verifikasiDokumen() {
                $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
                if ($statusEditRevisi == "Verifikasi") {
                    if ($norec != "-") {

                        var objSave = {
                            "norec_head": $norecHead,
                            "norec": $norec,
                            "tglverifikasi": moment($scope.now).format("YYYY-MM-DD HH:mm"),
                            "objectpegawaipjawabfk": $scope.dataLogin.id
                        }
                        medifirstService.post('eoffice/verifikasi-dokumen-kontrol', objSave).then(function (e) { })
                    }
                }
            }

            $scope.Save = function () {
                if ($scope.item.tanggalAwal === undefined,
                    $scope.item.namaSurat === undefined,
                    $scope.item.tipeSurat === undefined,
                    // $scope.item.sifatSurat  === undefined,
                    // $scope.item.statusBerkas  === undefined,
                    $scope.item.jenisSurat === undefined,
                    $scope.item.subjenisSurat === undefined,
                    // $scope.item.jenisArsip === undefined,
                    // $scope.item.jangkaWaktu === undefined,
                    // $scope.item.jangkaWaktuRange === undefined,
                    // $scope.item.asalSurat === undefined,
                    // $scope.item.penerimaSurat === undefined,
                    // $scope.item.ruanganPenerima === undefined,
                    $scope.item.nomorSurat === undefined,
                    $scope.item.perihal === undefined,
                    $scope.item.lampiranPerihal === undefined,
                    $scope.item.status === undefined,
                    $scope.item.instalasi === undefined
                    // $scope.item.unitPembuat === undefined,
                    // $scope.item.ruanganTujuan === undefined
                ) {
                    toastr.warning("Lengkapi semua data");
                    return;
                }
                {

                    // var objSave = {
                    //         "tglSurat" : $scope.item.tanggalAwal , 
                    //          "namaSurat" :  ,
                    //          "tipePengirimSurat" :   ,
                    //          "sifatSurat" : $scope.item.sifatSurat.id ,
                    //          "statusBerkas" :   ,
                    //          "jenisSurat" : $scope.item.jenisSurat.id ,
                    //          "jenisArsip" :  ,
                    //          "jangkaWaktu" : $scope.item.jangkaWaktu ,
                    //          "asalSurat" :  ,
                    //          "pegawaiPenerima" : $scope.item.penerimaSurat ,
                    //          "ruanganPenerima" :  ,
                    //          "noSurat" : $scope.item.nomorSurat,
                    //          "perihal" : $scope.item.perihal ,
                    //          "lampiran" : $scope.item.lampiranPerihal
                    //          }
                    //   medifirstService.post('eoffice/save-surat',objSave).then(function(e) {
                    //      init()
                    // });

                    const url = baseTransaksi + 'eoffice/save-surat'

                    const form = document.querySelector('form')

                    const formData = new FormData()
                    const fileSIP = document.querySelectorAll('[type=file]')[0].files[0]
                    if (fileSIP != "" && fileSIP != undefined) {
                        // if (fileSIP.size > 1000000 || fileSIP.type != "application/pdf") { //dalam bytes
                        // toastr.error('Maksimum Ukuran File adalah 1 MB dalam Format PDF')
                        // return;
                        // }
                    }

                    formData.append('file', fileSIP)
                    if ($norec != '-') {
                        formData.append('norec', $norec)
                    } else {
                        formData.append('norec', '-')
                    }

                    if ($norecHead != '-') {
                        formData.append('norec_head', $norecHead)
                    } else {
                        formData.append('norec_head', '-')
                    }
                    formData.append('nosurat', $scope.item.nomorSurat)
                    formData.append('tglsurat', moment($scope.item.tanggalAwal).format('YYYY-MM-DD'))
                    formData.append('namasurat', $scope.item.namaSurat)
                    formData.append('objecttipesuratfk', $scope.item.tipeSurat.id)
                    // formData.append('objectsifatsuratfk', $scope.item.sifatSurat.id)
                    formData.append('objectjenissuratfk', $scope.item.jenisSurat.id)
                    // formData.append('objectjenisarsipfk', $scope.item.jenisArsip.id)
                    // formData.append('jangkawaktu', $scope.item.jangkaWaktu)
                    // formData.append('asalsurat', $scope.item.asalSurat)
                    // formData.append('penerimasurat', $scope.item.penerimaSurat)
                    // formData.append('ruanganpenerima', $scope.item.ruanganPenerima)
                    // formData.append('objectstatusberkasfk', $scope.item.statusBerkas.id)
                    formData.append('perihal', $scope.item.perihal == undefined ? null : $scope.item.perihal)
                    formData.append('lampiranperihal', $scope.item.lampiranPerihal == undefined ? null : $scope.item.lampiranPerihal)
                    formData.append('objectkelompoktransaksifk', 154)
                    formData.append('revisike', $scope.item.revisike)
                    // formData.append('tglrevisi', $$scope.item.lampiranPerihal)
                    formData.append('objectstatusfk', $scope.item.status.id)
                    formData.append('objectdepartemenfk', $scope.item.instalasi.id)
                    formData.append('isaktif', 1)
                    // formData.append('unitpembuat', $scope.item.unitPembuat)
                    formData.append('keteranganrevisi', $scope.item.ketrevisi == undefined ? null : $scope.item.ketrevisi)
                    formData.append('statuseditrevisi', $statusEditRevisi)
                    formData.append('idloginuser', $idloginuser)
                    formData.append('wyswyg', $scope.item.wyswyg == undefined ? null : $scope.item.wyswyg)
                    formData.append('unitkerjafk', $scope.item.unitKerja == undefined ? null : $scope.item.unitKerja.id)
                    formData.append('subjenissuratfk', $scope.item.subjenisSurat == undefined ? null : $scope.item.subjenisSurat.id)

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
                            verifikasiDokumen();
                            $state.go("DaftarAgenda");
                        }
                        else {
                            toastr.info('Simpan Gagal');
                        }
                        // $scope.loadDataSip();
                        // $scope.batalSip();


                    })
                }
            }
            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };

            $scope.generateQR = function () {
                $scope.popUpQR.center().open();
            }
            $scope.generate = function () {
                if (!$scope.item.pegawaiQr) {
                    toastr.error('Pilih Pegawai dulu')
                    return
                }
                var authorization = ""
                var arr = document.cookie.split(';')
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                authorization = authorization.split('.')
                let profile = medifirstService.getProfile().id
                let linkQR = configuration.baseApiBackend + 'eoffice/qrcode?id=' + $scope.item.pegawaiQr.id
                    + '&kdprofile=' + profile
                    + '&token=' + authorization[0]
                let qrcodeContainer = document.getElementById("qrcode");
                qrcodeContainer.innerHTML = "";
                console.log(linkQR)
                new QRCode(qrcodeContainer, {
                    text: linkQR,
                    width: 128,
                    height: 128,
                });
                // var dataURL = document.getElementById('qrcode').toDataURL();

            }


            $scope.copyQR = function () {
                var imageURL = document.querySelector('#qrcode img').getAttribute("src");
                $('#qrcode img').addClass('image-class');
                var imageElem = document.querySelector('.image-class');
                var range = document.createRange();
                range.selectNode(imageElem);
                window.getSelection().addRange(range);

                try {
                    // Now that we've selected the anchor text, execute the copy command  
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'Sukses' : 'Gagal';
                    toastr.info('Copy QRcode ' + msg);
                } catch (err) {
                    toastr.error('Oops, unable to copy');
                }

                // Remove the selections - NOTE: Should use
                // removeRange(range) when it is supported  
                window.getSelection().removeAllRanges();

            }
        }])
})