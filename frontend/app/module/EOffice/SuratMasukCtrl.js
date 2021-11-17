define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';

    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('SuratMasukCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', '$http', 'MedifirstService', '$state', 'CacheHelper',
        function ($rootScope, $scope, ModelItem, DateHelper, $http, medifirstService, $state, cacheHelper) {
            var fileTypes = ['doc', 'docx']; //acceptable file types
            var files;
            $scope.item = {};
            $scope.now = new Date();
            $scope.item.ruanganTujuan = [];
            var $norec = "-"
            loadCombo();

            function loadCombo() {
                $scope.item.tanggalAwal = moment($scope.now).format('DD-MM-YYYY');
                medifirstService.get("eoffice/get-combo-input-surat", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listTipeSurat = dat.data.tipesurat;
                    $scope.listSifatSurat = dat.data.sifatsurat;
                    $scope.listJenisSurat = dat.data.jenissurat;
                    $scope.listJenisArsip = dat.data.jenisarsip;
                    $scope.listStatusBerkas = dat.data.statusberkas;
                });
                medifirstService.getPart("sysadmin/general/get-ruangan-part", true, true, 20).then(function (data) {
                    $scope.listRuangan = data;
                    init();
                });
            }

            function init() {
                $scope.isRouteLoading = true;
                var chacePeriode = cacheHelper.get('SuratMasukCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.norec = chacePeriode[0];
                    $norec = chacePeriode[0];
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
                                $scope.item.jenisArsip = { id: dat.data.daftar[0].objectjenisarsipfk, name: dat.data.daftar[0].tipesurat }
                                $scope.item.jangkaWaktu = dat.data.daftar[0].jangkawaktu
                                $scope.item.asalSurat = dat.data.daftar[0].asalsurat
                                $scope.item.penerimaSurat = dat.data.daftar[0].penerimasurat
                                $scope.listRuangan = [{ id: dat.data.daftar[0].ruanganpenerimafk, namaruangan: dat.data.daftar[0].namaruangan }];                                
                                $scope.item.ruanganPenerima = $scope.listRuangan[0];//dat.data.daftar[0].ruanganpenerima
                                $scope.item.nomorSurat = dat.data.daftar[0].nosurat
                                $scope.item.perihal = dat.data.daftar[0].perihal
                                $scope.item.lampiranPerihal = dat.data.daftar[0].lampiranperihal
                            });
                    } else {
                        $scope.item.norec = '-'
                        $norec = '-'
                    }


                    // init();
                } else {


                }

            }
            $scope.batal = function () {
                $state.go("DaftarSuratMasuk");
            }

            initial();
            function initial() {
                $scope.item = {};
                $scope.item.ruanganTujuan = [];
                $scope.item.pegawai = ModelItem.getPegawai();
                $scope.item.penerimaSurat = $scope.item.pegawai.namaLengkap;
                // var ruangan = medifirstService.getMapLoginUserToRuangan();
                // $scope.item.ruanganPenerima = ruangan[0].namaruangan;
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

            $scope.Save = function () {
                if ($scope.item.tanggalAwal === undefined,
                    $scope.item.namaSurat === undefined,
                    // $scope.item.tipeSurat === undefined,
                    $scope.item.sifatSurat === undefined,
                    $scope.item.statusBerkas === undefined,
                    $scope.item.jenisSurat === undefined,
                    $scope.item.jenisArsip === undefined,
                    $scope.item.jangkaWaktu === undefined,
                    $scope.item.jangkaWaktuRange === undefined,
                    $scope.item.asalSurat === undefined,
                    $scope.item.penerimaSurat === undefined,
                    $scope.item.ruanganPenerima === undefined,
                    $scope.item.nomorSurat === undefined,
                    $scope.item.perihal === undefined,
                    $scope.item.lampiranPerihal === undefined,
                    $scope.item.ruanganTujuan === undefined) {
                    toastr.warning("Lengkapi semua data");
                    return;

                } else {

                    const url = baseTransaksi + 'eoffice/save-surat'
                    const form = document.querySelector('form')
                    const formData = new FormData()
                    const fileSIP = document.querySelectorAll('[type=file]')[0].files[0]
                    if (fileSIP != "" && fileSIP != undefined) {
                        if (fileSIP.size > 1000000 || fileSIP.type != "application/pdf") { //dalam bytes
                            toastr.error('Maksimum Ukuran File adalah 1 MB dalam Format PDF')
                            return;
                        }
                    }

                    formData.append('file', fileSIP)
                    if ($norec != '-') {
                        formData.append('norec', $norec)
                    } else {
                        formData.append('norec', '-')
                    }

                    formData.append('nosurat', $scope.item.nomorSurat)
                    formData.append('tglsurat', moment($scope.item.tanggalAwal).format('YYYY-MM-DD'))
                    formData.append('namasurat', $scope.item.namaSurat)
                    formData.append('objecttipesuratfk', $scope.item.tipeSurat  != undefined ? $scope.item.tipeSurat.id : null)
                    formData.append('objectsifatsuratfk', $scope.item.sifatSurat != undefined ? $scope.item.sifatSurat.id : null)
                    formData.append('objectjenissuratfk', $scope.item.jenisSurat != undefined ? $scope.item.jenisSurat.id : null)
                    formData.append('objectjenisarsipfk', $scope.item.jenisArsip != undefined ? $scope.item.jenisArsip.id : null)
                    formData.append('jangkawaktu', $scope.item.jangkaWaktu != undefined ? $scope.item.jangkaWaktu : null)
                    formData.append('asalsurat', $scope.item.asalSurat)
                    formData.append('penerimasurat', $scope.item.penerimaSurat)
                    formData.append('ruanganpenerima', $scope.item.ruanganPenerima != undefined ? $scope.item.ruanganPenerima.namaruangan : null)
                    formData.append('ruanganpenerimafk', $scope.item.ruanganPenerima != undefined ? $scope.item.ruanganPenerima.id : null)
                    formData.append('objectstatusberkasfk', $scope.item.statusBerkas.id)
                    formData.append('perihal', $scope.item.perihal)
                    formData.append('lampiranperihal', $scope.item.lampiranPerihal)
                    formData.append('objectkelompoktransaksifk', 153)

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
                        if (response.status == 201) {
                            toastr.info('Sukses');

                            $state.go("DaftarSuratMasuk");
                        }
                        else {
                            toastr.info('Simpan Gagal');
                        }
                    })
                }
            }

        }])
})