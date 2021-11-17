define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('RincianTagihanPenunjangCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', '$window',
        function ($scope, medifirstService, $state, cacheHelper, $window) {
            $scope.item = {};
            $scope.itemimg = {};
            // $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isLoading = false;
            $scope.disableDokterPengirim2 = true;
            $scope.hideDokterPengirim2 = true;
            var norec_apd = ''
            var norec_pd = ''

            var norec_pp = ''
            var no_cm = ''

            var norec_so = ''
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var departemenfk = ''
            $scope.item = {
                tglInput: new Date()
            };
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })
            LoadCache();
            $scope.selectImage = function () {
                console.log($scope.itemimg.gambar.keterangan)
                $scope.itemimg.keterangan = $scope.itemimg.gambar.keterangan
                var temp = $scope.itemimg.gambar.filename.slice(0, $scope.itemimg.gambar.filename.indexOf('.'))
                $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
            }
            function LoadCache() {
                var chacePeriode = cacheHelper.get('RincianTagihanPenunjang');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.kelompokPasien = chacePeriode[13]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    $scope.item.dokter = chacePeriode[14]
                    norec_apd = chacePeriode[8]
                    namaRuangan = chacePeriode[9]
                    namaRuanganFk = chacePeriode[10]
                    norec_pd = chacePeriode[11]
                    norec_so = chacePeriode[12]
                    departemenfk = chacePeriode[16]
                    $scope.item.jenisPenjamin = chacePeriode[17]
                    $scope.item.golonganDarah = chacePeriode[19]
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.warning('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    $scope.item.ruanganAsal = namaRuangan;
                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });

                    init()

                } else {

                }

            }
            function init() {
                $scope.isLoading = true;

                medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                    // $scope.listRuanganTujuan = dat.data.ruangantujuan;
                    // $scope.listLayanan = dat.data.produk;
                    // syamsu hard coded dr. Radiologi, krn table untuk group radiologi blm ada.
                    var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));

                    let dokterRadiologiID = [100489, 100493, 100031]; // radiologi
                    
                    let idloginUserToRadiologi = [];
                    idloginUserToRadiologi[30070] = 100489;
                    idloginUserToRadiologi[30071] = 100493;
                    idloginUserToRadiologi[30072] = 100031;

                    let dataDokter = [];

                    $scope.listDokter = dat.data.dokter;

                    if (datauserlogin.id == 14 || dokterRadiologiID.includes(idloginUserToRadiologi[datauserlogin.id])) {
                      if (datauserlogin.id != 14) {
                        dokterRadiologiID = [idloginUserToRadiologi[datauserlogin.id]];
                      }  

                      for (let o=0; o<dat.data.dokter.length; o++){
                        if (dokterRadiologiID.includes(dat.data.dokter[o].id)){
                          dataDokter.push(dat.data.dokter[o])
                        }
                      }

                      $scope.listDokter = dataDokter; //dat.data.dokter;
                    } 

                    $scope.listDataPMI = dat.data.pmi;
                })
                // if (norec_apd != null) {

                medifirstService.get("radiologi/get-rincian-pelayanan?noregistrasifk=" + norec_apd
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
                        if (dat.data.data.length > 0) {
                            $scope.item.tgllahir = dat.data.data[0].tgllahir
                            $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        }
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            dat.data.data[i].statCheckbox = false;
                            dat.data.data[i].noverifbayar =
                                (dat.data.data[i].nostruk != null ? dat.data.data[i].nostruk : '') + ' / ' +
                                (dat.data.data[i].nosbm != null ? dat.data.data[i].nosbm : '');
                            if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                                dat.data.data[i].statusbridging = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statusbridging = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].iscito == "1") {
                                dat.data.data[i].statuscito = "✔";
                                // ✅
                                // ✔
                            } else {
                                dat.data.data[i].statuscito = "✘";
                                // ✘
                                // ❎
                            }
                            if (dat.data.data[i].hr_norec != undefined && dat.data.data[i].hr_norec != '') {
                                dat.data.data[i].expertise = "✔";
                                // ✅
                                // ✔ expertise
                            } else {
                                dat.data.data[i].expertise = "✘";
                                // ✘
                                // ❎
                            }
                        }
                        if (dat.data.data.length > 0) {
                            if (dat.data.data[0].objectdepartemenfk == 3)
                                $scope.disableRad = true
                            if (dat.data.data[0].objectdepartemenfk == 27)
                                $scope.disableLab = true
                        }
                        $scope.isLoading = false;



                        $scope.dataGrid = {
                            data: dat.data.data,
                            _data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.data.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]

                        };

                        if (dat.data.data[0].objectdepartemenfk == 27) {
                            $scope.showRadiologi = true;
                        }
                        norec_pp = dat.data.data[0].norec_pp
                        no_cm = dat.data.data[0].nocm
                    }, function (error) {
                        $scope.isLoading = false;
                    });
                // } else {
                // $scope.isLoading = false;
                // }


            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.cekDokterLuar = function (bool) {
                if (bool) {
                    $scope.disableDokterPengirim1 = true;
                    $scope.disableDokterPengirim2 = false;
                    $scope.hideDokterPengirim1 = true;
                    $scope.hideDokterPengirim2 = false;
                } else {
                    $scope.disableDokterPengirim1 = false;
                    $scope.disableDokterPengirim2 = true;
                    $scope.hideDokterPengirim1 = false;
                    $scope.hideDokterPengirim2 = true;
                }
            }

            $scope.columnGrid = {
                columns: [
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px"
                    },
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "30px",
                    // },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                    },
                    {
                      "field": "idpatient",
                      "title": "ID Patient di Alat",
                      "width": "90px",
                    },                    
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },
                    // {
                    //     "field": "produkfk",
                    //     "title": "Kode",
                    //     "width" : "70px",
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Diskon",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                        // footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "jasa",
                        "title": "Jasa Cito",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                        footerTemplate: "<span class='style-center'>Total</span>",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                        footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                    },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px",
                    },
                    {
                        "field": "expertise",
                        "title": "Expertise",
                        "width": "50px",
                    },
                    {
                        "field": "noverifbayar",
                        "title": "No Verif/No Bayar",
                        "width": "120px"
                    },
                    {
                        "field": "statusbridging",
                        "title": "Bridging",
                        "width": "50px",
                    },
                    {
                        "field": "pmi",
                        "title": "PMI",
                        "width": "100px",
                    },
                    //  {
                    //     "field": "statuscito",
                    //     "title": "Status Cito",
                    //     "width": "30px",
                    // }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                // ,
                // pageable:{
                //     messages: {
                //         display: "Menampilkan {0} - {1} data dari {2} data"
                //     },
                //     refresh: true,
                //     pageSizes: true,
                //     buttonCount: 5

                // }
            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGrid._data, function (data) {
                    return data.norec_pp == dataItem.norec_pp;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.dataGrid._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data;

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

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 10,
                    total: ds.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]

                });

                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }


            $scope.columnGridOrder = [
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "30px",
                // },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty",
                    "width": "40px",
                }
            ];
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            var HttpClient = function () {
                this.get = function (aUrl, aCallback, aErrorCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status < 400)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.onerror = function() {
                      if (anHttpRequest.status > 399) {
                        if (aErrorCallback != null) {
                          aErrorCallback()
                        }
                      }
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.InputTindakan = function () {

                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                if ($scope.item) {
                    $state.go('InputTindakan', {
                        norecPD: norec_pd,
                        norecAPD: norec_apd,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }
            $scope.HapusTindakan = function () {
                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                var logData = []
                var dataDel = []
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        var data = {
                            "norec_pp": $scope.dataGrid._data[i].norec_pp,
                            "namaruangan": $scope.dataGrid._data[i].ruangan,
                        }
                        dataDel.push(data)

                        logData.push({
                            "norec_apd": $scope.dataGrid._data[i].norec_apd,
                            "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan,
                            "diskon": $scope.dataGrid._data[i].hargadiscount,
                            "noorder": $scope.dataGrid._data[i].noorder,
                            "harga": $scope.dataGrid._data[i].hargasatuan,
                            "jumlah": $scope.dataGrid._data[i].jumlah,
                            "klid": 6,
                            "prid": $scope.dataGrid._data[i].produkfk,
                            "jasa": 0,

                        })
                    }
                }

                var objDelete = {
                    "dataDel": dataDel,
                    "noregistrasi": $scope.item.noregistrasi
                };
                if (dataDel.length > 0) {

                    $scope.hideHapusTindakan = true
                    medifirstService.post('radiologi/delete-pelayanan-pasien', objDelete).then(function (e) {
                        if (e.status === 201) {
                            var objLog = {
                                pelayananpasiendelete: logData
                            }
                            medifirstService.postNonMessage('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {
                            })
                            let deleteExt = []
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                const elem = $scope.dataGrid._data[i]
                                if (elem.statCheckbox) {
                                    if (elem.statusbridging != '-' && elem.noorder != null) {
                                        if (elem.nourutrad == null )
                                        deleteExt.push({
                                            'noorder': elem.noorder,
                                            'produkfk': elem.produkfk,
                                            'nourutrad': elem.nourutrad,
                                            'nocm': elem.nocm
                                        })

                                    }
                                }
                            }
                            if (deleteExt.length > 0) {
                                medifirstService.postNonMessage('bridging/penunjang/save-hapus-order-lab', { 'data': deleteExt }).then(function (e) {
                                })

                                medifirstService.postNonMessage('bridging/penunjang/save-hapus-order-rad', { 'data': deleteExt }).then(function (e) {
                                })
                            }

                        }
                        init()
                        $scope.hideHapusTindakan = false
                    }, function (error) {
                        // $scope.isNext = false;
                        $scope.hideHapusTindakan = false
                    })
                }
                else {
                    toastr.warning('Checklist yang mau dihapus.', 'Peringatan')
                }
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {

                medifirstService.get("syadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            $scope.BridgingZeta = function () {
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        if ($scope.dataGrid._data[i].idbridging != null) {
                            toastr.info('Data sudah pernah dikirim ke RIS', 'Informasi')
                            return
                        }
                        var parameter = $scope.dataGrid._data[i].ruangan;
                        if (parameter.indexOf('Laboratorium') >= 0 ||
                            parameter.indexOf('Bank Darah') >= 0) {
                            toastr.warning('Kirim ke RIS hanya untuk Radiologi', 'Peringatan')
                            return
                        }

                        if ($scope.dataGrid._data[i].noorder == null) {
                            var data2 = [];
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                if ($scope.dataGrid._data[i].statCheckbox) {
                                    var data = {
                                        "produkfk": $scope.dataGrid._data[i].produkfk,
                                        "namaproduk": $scope.dataGrid._data[i].namaproduk,
                                        "qtyproduk": parseFloat($scope.dataGrid._data[i].jumlah),
                                        "objectruanganfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectruangantujuanfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectkelasfk": $scope.item.kelas.id,
                                        "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                        "namadokter": $scope.dataGrid._data[i].dokter,
                                        "dokterid": $scope.dataGrid._data[i].dokterid,
                                        "iscito": $scope.dataGrid._data[i].iscito,
                                        "nourut": $scope.dataGrid._data[i].no // syamsu
                                    }
                                    data2.push(data)
                                }
                            }

                            var objSave = {
                                status: "bridinglangsung",
                                norec_apd: norec_apd,
                                norec_pd: norec_pd,
                                norec_so: "",
                                qtyproduk: data2.length,
                                objectruanganfk: $scope.dataGrid._data[0].objectruanganfk,
                                objectruangantujuanfk: $scope.dataGrid._data[0].objectruanganfk,
                                departemenfk: $scope.dataGrid._data[0].objectdepartemenfk,
                                pegawaiorderfk: $scope.dataGrid._data[0].dokterid,
                                details: data2
                            }


                            medifirstService.post('radiologi/save-order-pelayanan', objSave).then(function (e) {
                                var responeData = e

                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": e.data.strukorder.noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-zeta', itemsave).then(function (e) {
                                    toastr.info('Data sedang dikirim ke RIS', 'Informasi')
                                    init()
                                })
                            })
                        } else {
                            if ($scope.dataGrid._data[i].idbridging == null) {
                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                            "noorder": $scope.dataGrid._data[i].noorder,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": dataPost[0].noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                }


                                medifirstService.post('bridging/penunjang/save-bridging-zeta', itemsave).then(function (e) {
                                  toastr.info('Data sedang dikirim ke RIS', 'Informasi')
                                  init()
                                })
                            }

                        }
                    }

                }

            }
            $scope.BridgingSysmex = function () {

                let datacek = []
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        datacek.push($scope.dataGrid._data[i])
                    }
                }
                if (datacek.length == 0) {
                    toastr.warning('Ceklis data yang mau dikirim', 'Peringatan')
                    return
                }
                $scope.popUpDokter.center().open();
            }
            $scope.simpanDokter = function (dokter) {
                if (dokter == undefined) {
                    toastr.warning('Pilih dokter dulu', 'Peringatan')
                    return
                }
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        if ($scope.dataGrid._data[i].idbridging != null) {
                            toastr.info('Data sudah pernah dikirim ke LIS','Informasi')
                            return
                        }
                        var parameter = $scope.dataGrid._data[i].ruangan;
                        if (parameter.indexOf('Radiologi') >= 0) {
                            toastr.warning('Kirim ke LIS hanya untuk Lab', 'Peringatan')
                            return
                        }
                        var dokterId = null
                        var namaDokter = null
                        if ($scope.dataGrid._data[i].noorder == null) {
                            var data2 = [];
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                if ($scope.dataGrid._data[i].statCheckbox) {
                                    var data = {
                                        "produkfk": $scope.dataGrid._data[i].produkfk,
                                        "namaproduk": $scope.dataGrid._data[i].namaproduk,
                                        "qtyproduk": parseFloat($scope.dataGrid._data[i].jumlah),
                                        "objectruanganfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectruangantujuanfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectkelasfk": $scope.item.kelas.id,
                                        "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                        "namadokter": $scope.dataGrid._data[i].dokter,
                                        "dokterid": $scope.dataGrid._data[i].dokterid,
                                        "iscito": $scope.dataGrid._data[i].iscito,
                                        "nourut": $scope.dataGrid._data[i].no
                                    }
                                    data2.push(data)
                                    dokterId =  $scope.dataGrid._data[i].dokterid
                                    namaDokter =  $scope.dataGrid._data[i].dokter
                                }
                            }

                            var objSave = {
                                status: "bridinglangsung",
                                norec_apd: norec_apd,
                                norec_pd: norec_pd,
                                norec_so: "",
                                qtyproduk: data2.length,
                                // norec_pp:$scope.dataGrid._data[0].norec_pp,
                                objectruanganfk: $scope.dataGrid._data[0].objectruanganfk,
                                objectruangantujuanfk: $scope.dataGrid._data[0].objectruanganfk,
                                departemenfk: $scope.dataGrid._data[0].objectdepartemenfk,
                                pegawaiorderfk: dokterId,//$scope.dataGrid._data[0].dokterid,

                                details: data2
                            }


                            medifirstService.post('radiologi/save-order-pelayanan', objSave).then(function (e) {
                                var responeData = e

                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": e.data.strukorder.noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": dokter.id,//$scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": dokter.namalengkap,//$scope.dataGrid._data[0].dokter,
                                    "iddokterorder":dokterId,// dokter.id,
                                    "namadokterorder": namaDokter,//dokter.namalengkap,
                                    "catatan": $scope.item.catatanLab != undefined ? $scope.item.catatanLab : null,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-vans-lab', itemsave).then(function (e) {
                                    // medifirstService.post('bridging/penunjang/save-bridging-sysmex', itemsave).then(function (e) {
                                    for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                        if ($scope.dataGrid._data[i].statCheckbox) {
                                            medifirstService.postLogging('Kirim ke LIS', 'Norec antrianpasien_t', $scope.dataGrid._data[i].norec_apd,
                                            'Kirim LIS No Order - ' + $scope.dataGrid._data[i].noorder + ' dengan No Registrasi ' + $scope.dataGrid._data[i].noregistrasi).then(function (res) {
                                            })
                                        }
                                    }
                                    init()
                                })
                            })

                        } else {
                            if ($scope.dataGrid._data[i].idbridging == null) {
                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                            "noorder": $scope.dataGrid._data[i].noorder,
                                        }
                                        dataPost.push(datasys)
                                        dokterId =  $scope.dataGrid._data[i].dokterid
                                        namaDokter =  $scope.dataGrid._data[i].dokter
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": dataPost[0].noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": dokter.id,//$scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": dokter.namalengkap,//$scope.dataGrid._data[0].dokter,
                                    "iddokterorder": dokterId,// dokter.id,
                                    "namadokterorder": namaDokter,//dokter.namalengkap,
                                    "catatan": $scope.item.catatanLab != undefined ? $scope.item.catatanLab : null,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-vans-lab', itemsave).then(function (e) {
                                    // medifirstService.post('bridging/penunjang/save-bridging-sysmex', itemsave).then(function (e) {
                                    for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                        if ($scope.dataGrid._data[i].statCheckbox) {
                                            medifirstService.postLogging('Kirim ke LIS', 'Norec antrianpasien_t', $scope.dataGrid._data[i].norec_apd,
                                            'Kirim LIS No Order - ' + $scope.dataGrid._data[i].noorder + ' dengan No Registrasi ' + $scope.dataGrid._data[i].noregistrasi).then(function (res) {
                                            })
                                        }
                                    }
                                    init()
                                })
                            }
                        }
                    }

                }
                $scope.popUpDokter.close();
            }
            $scope.kirimKeISP = function () {
              if ($scope.dataSelected == undefined) {
                toastr.warning('Pilih salah satu order pelayanan terlebih dahulu', 'Peringatan')
                return
              }

              $scope.noOrder = $scope.dataSelected.noorder;
              $scope.noregistrasi = $scope.dataSelected.noregistrasi
              $scope.norec_pp = $scope.dataSelected.norec_pp;
              $scope.norec_apd = $scope.dataSelected.norec_apd;
              $scope.nourutrad = ($scope.dataSelected.nourutrad === undefined ||  $scope.dataSelected.nourutrad === null) ? 1 : $scope.dataSelected.nourutrad;                
              $scope.noMr = ($scope.dataSelected.nocm === undefined || $scope.dataSelected.nocm === null) ? $scope.dataSelected.noMr : $scope.dataSelected.nocm
              
              if ($scope.showRadiologi == true) {

                  let viewer = null
                  var patienIdMr = $scope.noMr + '-' + $scope.nourutrad
                  var client = new HttpClient();

                  var errorFunc = function() {
                        toastr.error('Ada kesalahan jaringan')
                  }

                  var errorFuncRis = function() {
                    toastr.error('Ada kesalahan jaringan, harap periksa server RIS')
                  }

                  let awal = true

                  var sendISP = function (response) {
                    if (response === undefined || response === null || response == '') {
                      toastr.warning('Hasil foto gagal dikirim ke ISP, silahkan coba lagi', 'Peringatan')
                    }

                    let data = JSON.parse(response)

                    // if (data['completed'] == 32) {
                      toastr.info('Berhasil dikirim ke ISP', 'Informasi')
                    // } else {
                    //   toastr.warning('Hasil foto gagal dikirim ke ISP, silahkan coba lagi', 'Peringatan')
                    // }

                  }

                  var noMrFunc = function (response) {
                        if (response === undefined || response === null || response == '') {
                          if (awal)  {
                            awal = false
                            client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
                            'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr.split('-')[0], 
                            noMrFunc, errorFunc)
                          }  else {
                            toastr.warning('Hasil foto belum dikirim ke PACS', 'Peringatan')
                          }
                        } else {
                          let data = JSON.parse(response)
                          viewer = data[0]["0020000D"].Value[0]
                          client.get(config.urlRISEngine + '/ris-service/kirim-balik-ke-isp?studyID='+viewer,sendISP,errorFuncRis)
                          // $window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + $scope.norec_pp + "/" + $scope.noMr + "/" + viewer, "pacs");
                        }
                    }

                    client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
                      'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr, 
                      noMrFunc, errorFunc)
              }

            }

            $scope.LihatHasil = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.warning('Pilih salah satu order pelayanan terlebih dahulu', 'Peringatan')
                    return
                }
                $scope.noOrder = $scope.dataSelected.noorder;
                $scope.noregistrasi = $scope.dataSelected.noregistrasi
                $scope.norec_pp = $scope.dataSelected.norec_pp;
                $scope.norec_apd = $scope.dataSelected.norec_apd;
                $scope.nourutrad = ($scope.dataSelected.nourutrad === undefined ||  $scope.dataSelected.nourutrad === null) ? 1 : $scope.dataSelected.nourutrad;                
                $scope.noMr = ($scope.dataSelected.nocm === undefined || $scope.dataSelected.nocm === null) ? $scope.dataSelected.noMr : $scope.dataSelected.nocm
                
                var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));
                // var datauserlogin = medifirstService.getKelompokUser()// JSON.parse(localStorage.getItem('datauserlogin'));
                if ($scope.showRadiologi == true) {

                    //Diyan (PACS)
                    // medifirstService.get("radiologi/get-norec-hasil-radiologi?norec_pp=" + $scope.norec_pp + "&noregistrasifk=" + $scope.norec_apd)
                    //     .then(function (e) {
                    //         if (e.data.status) {
                    let viewer = null
                    var patienIdMr = $scope.noMr + '-' + $scope.nourutrad
                    var client = new HttpClient();

                    var errorFunc = function() {
                          toastr.error('Ada kesalahan jaringan')
                    }

                    let awal = true

                    var noMrFunc = function (response) {
                          if (response === undefined || response === null || response == '') {
                            if (awal)  {
                              awal = false
                              client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
                              'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr.split('-')[0], 
                              noMrFunc, errorFunc)
                            }  else {
                              toastr.warning('Hasil foto belum dikirim ke PACS', 'Peringatan')
                            }
                          } else {
                            let data = JSON.parse(response)
                            viewer = data[0]["0020000D"].Value[0]
                            $window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + $scope.norec_pp + "/" + $scope.noMr + "/" + viewer, "pacs");
                          }
                      }

                      client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
                        'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr, 
                        noMrFunc, errorFunc)
                        //     } else {
                        //         toastr.error('Data Tidak Tersedia')
                        //     }
                        // })                        
                } else {
                    var user = medifirstService.getPegawaiLogin();
                    var daftarCetak = [];
                    // for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    //     if ($scope.dataGrid._data[i].statCheckbox) {
                    //         // daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                    //         daftarCetak.push(
                    //             {
                    //                 "norec_pp": $scope.dataGrid._data[i].norec_pp, 
                    //                 "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan, 
                    //             }
                    //         )                        
                    //     }
                    // }
                    var dataCetakFix = '';
                    // var result = ''
                    // for (let i = 0; i < daftarCetak.length; i++) {
                    //     const element = daftarCetak[i];
                    //     if (daftarCetak.length == 1)
                    //     {
                    //         dataCetakFix = "'" + element.norec_pp + "'" 
                    //     }else if (daftarCetak.length == i + 1)
                    //     {
                    //         dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""  
                    //     }else
                    //     {
                    //         dataCetakFix = dataCetakFix + ""  + "'" + element.norec_pp + "'" + ","  
                    //     }

                    // } 
                    // if(daftarCetak.length == 0){
                    //     toastr.error('Ceklis data yang mau di cetak')
                    //    return
                    //  } 

                    if (norec_apd != null) {
                        var arrStr = {
                            0: $scope.item.noMr,
                            1: $scope.item.namaPasien,
                            2: $scope.item.jenisKelamin,
                            3: $scope.item.noregistrasi,
                            4: $scope.item.umur,
                            5: $scope.item.kelompokPasien,
                            6: $scope.item.tglRegistrasi,
                            7: norec_apd,
                            8: norec_pd,
                            9: $scope.item.kelas.id,
                            10: $scope.item.kelas.namakelas,
                            11: namaRuanganFk,
                            12: namaRuangan,
                            13: $scope.item.tgllahir,
                            14: $scope.item.objectjeniskelaminfk,
                            15: dataCetakFix,
                            // 16: $scope.dataGrid._data[i].tglpelayanan ,
                        }
                        cacheHelper.set('chaceHasilLab2', arrStr);

                        // $state.go('HasilLaboratoriumRev', {
                        //     norecPd: norec_pd,
                        //     norecApd: norec_apd,
                        //     norecPP: dataCetakFix

                        // })
                        $state.go('HasilLaboratorium', {
                            noOrder: $scope.noOrder,
                            // norecApd: norec_apd,
                            // norecPP: dataCetakFix
                        })
                        // if(urlHasilVansLab ==''){
                        //     toastr.error('Periksa Setting Data Fixed VANS LAB ')
                        //     return
                        // }
                        // $window.open(urlHasilVansLab + $scope.noOrder, "_blank");

                        // if (norec_apd != null) {
                        //     var arrStr = {
                        //         0: $scope.dataSelected.nocm,
                        //         1: $scope.dataSelected.namapasien,
                        //         2: $scope.dataSelected.jeniskelamin,
                        //         3: $scope.item.noregistrasi,
                        //         4: $scope.item.umur,
                        //         5: $scope.item.kelompokPasien,
                        //         6: $scope.item.tglRegistrasi,
                        //         7: norec_apd,
                        //         8: norec_pd,
                        //         9: $scope.item.kelas.id,
                        //         10: $scope.item.kelas.namakelas,
                        //         11: namaRuanganFk,
                        //         12: namaRuangan
                        //     }
                        //     cacheHelper.set('chaceHasilLab', arrStr);

                        //     $state.go('HasilLaboratorium', {
                        //         norecPd: norec_pd,
                        //         noOrder: $scope.noOrder,
                        //         norecApd: norec_apd
                        //     })
                        // } else {
                        //     toastr.info('Hasil Lab belum ada')
                    }
                }

            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item.noregistrasi != undefined && norec_apd != null) {
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

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec='
                        + $scope.item.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id +
                        '&strIdRuangan=ORDERRADIOLOGI' + norec_apd + '&view=' + stt, function (response) {
                            // do something with response
                        });

                }
            }
            $scope.CetakBuktiLayananPerTindakan = function () {
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                    }
                }

                if (daftarCetak.length == 0) {
                  toastr.warning('Ceklis data yang mau di cetak', 'Peringatan')
                    return
                }

                var resultCetak = daftarCetak.map(a => a).join("|");
                var pegawai = JSON.parse(localStorage.getItem('pegawai'))
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + pegawai.id + '&strIdRuangan=-&view=true', function (response) {

                });
            }
            // $scope.LihatEkpertise = function () {
            //     if ($scope.dataSelected == undefined) {

            //         toastr.error('Pilih Pelayanan Dulu')
            //         return
            //     }
            //     $scope.noOrder = $scope.dataSelected.noorder;
            //     if ($scope.showRadiologi == true) {


            //             var arrStr = {
            //                 0: $scope.dataSelected.nocm,
            //                 1: $scope.dataSelected.namapasien,
            //                 2: $scope.dataSelected.jeniskelamin,
            //                 3: $scope.item.noregistrasi,
            //                 4: $scope.item.umur,
            //                 5: $scope.item.kelompokPasien,
            //                 6: $scope.item.tglRegistrasi,
            //                 7: norec_apd,
            //                 8: norec_pd,
            //                 9: $scope.item.kelas.id,
            //                 10: $scope.item.kelas.namakelas,
            //                 11: namaRuanganFk,
            //                 12: namaRuangan
            //             }
            //             cacheHelper.set('chaceHasilRadiologi', arrStr);

            //             $state.go('HasilRadiologi', {
            //                 norecPd: norec_pd,
            //                 noOrder: $scope.noOrder,
            //                 norecApd: norec_apd
            //             })
            //         } 
            //     }


            $scope.LihatEkpertise = function () {
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = $scope.dataSelected.namaproduk
                $scope.item.dokters = $scope.dataSelected.dokter
                $scope.noeditExpertise1 = false;
                $scope.noeditExpertise2 = false;
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        $scope.noeditExpertise1 =true
                        $scope.norecHasilRadiologi = e.data[0].norec
                        $scope.item.nofoto = e.data[0].nofoto
                        $scope.item.tglInput = e.data[0].tanggal == null ? new Date() :new Date(e.data[0].tanggal)
                        $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                        $scope.item.keterangan = (e.data[0].keterangan == null) ? '' : e.data[0].keterangan.replace(/~/g, "\n")
                        $scope.noeditExpertise2 = $scope.pegawai.id != e.data[0].pegawaifk;
                    }
                    $scope.popUpEkpertise.center().open();
                })

                medifirstService.get('radiologi/get-ekspertise?norec_pp=' + $scope.dataSelected.norec_pp).then(function (e) {
                    if (e.data.status) {
                        if (e.data.data.list.length > 0) {
                            $scope.cekhasilrad = false;
                            $scope.listNamaGambar = e.data.data.list;
                            $scope.itemimg.gambar = { norec: e.data.data.list[0].norec, filename: e.data.data.list[0].filename }
                            $scope.itemimg.keterangan = e.data.data.list[0].keterangan
                            var temp = e.data.data.list[0].filename.slice(0, e.data.data.list[0].filename.indexOf('.'))
                            $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
                        }
                    } else {
                        $scope.cekhasilrad = true;
                        $scope.itemimg.img = "./images/noimage.png"
                        window.messageContainer.error("Belum Ada Ekspertise.");
                    }
                }).error(function (err) {
                    $scope.item.img = "./images/noimage.png"
                });

            }
            $scope.cetakEks = function () {

                if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
                }
            }
            $scope.itemPA = {}
            $scope.labPA = function () {
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.norecPA = ''
                $scope.itemPA.namaPelayanan = $scope.dataSelected.namaproduk
                $scope.itemPA.dokters = $scope.dataSelected.dokter
                $scope.itemPA.tglInput = new Date()
                $scope.findBy = 1
                medifirstService.get('laboratorium/get-hasil-lab-pa?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        let res = e.data[0]
                        $scope.itemdok.NoPa = res.nomorpa,
                            $scope.norecPA = res.norec
                        $scope.itemPA.tglInput = new Date(res.tanggal)
                        $scope.itemPA.dokter = { id: res.pegawaifk, namalengkap: res.namalengkap }
                        // $scope.itemPA.keterangan=res.keterangan.replace(/~/g,"\n")
                        if (res.jenis != null && res.jenis == 'sitologi')
                            $scope.findBy = 1
                        else
                            $scope.findBy = 0
                        if (res.dokterpengirimfk)
                            $scope.itemPA.dokterPengirim1 = { id: res.dokterpengirimfk, namalengkap: res.namadokterpengirim }
                        if (res.dokterluar)
                            $scope.itemPA.dokterPengirim2 = res.dokterluar
                        $scope.itemPA.diagnosaKlinik = res.diagnosaklinik
                        $scope.itemPA.ketKlinik = res.keteranganklinik
                        $scope.itemPA.diagnosaPB = res.diagnosapb
                        $scope.itemPA.ketPB = res.keteranganpb
                        $scope.itemPA.topografi = res.topografi
                        $scope.itemPA.morfologi = res.morfologi
                        if (res.makroskopik)
                            $scope.itemPA.makroskopik = res.makroskopik.replace(/~/g, "\n")
                        if (res.mikroskopik)
                            $scope.itemPA.mikroskopik = res.mikroskopik.replace(/~/g, "\n")
                        if (res.kesimpulan)
                            $scope.itemPA.kesimpulan = res.kesimpulan.replace(/~/g, "\n")
                        if (res.anjuran)
                            $scope.itemPA.anjuran = res.anjuran.replace(/~/g, "\n")

                    }
                    $scope.popUpPA.center().open();
                })

            }


            $scope.batalPA = function () {
                $scope.norecPA = ''
                $scope.itemPA = {}
                $scope.findBy = 1
                $scope.itemPA.tglInput = new Date()
                $scope.popUpPA.close();
            }

            $scope.saveLabPa = function () {
                // if ($scope.itemdok.NoPa == undefined) {
                //     window.messageContainer.error("Nomor Pa Tidak Boleh Kosong!");
                //     return;
                // }

                if ($scope.itemPA.tglInput == undefined) {
                    window.messageContainer.error("Tanggal Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.itemPA.dokter == undefined) {
                    window.messageContainer.error("Dokter Tidak Boleh Kosong!");
                    return;
                }

                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    tglinput: moment($scope.itemPA.tglInput).format('YYYY-MM-DD HH:mm'),
                    dokterid: $scope.itemPA.dokter.id,
                    nomor: $scope.itemdok.NoPa,
                    // keterangan: $scope.itemPA.keterangan.replace(/\n/ig,'~'),
                    pelayananpasienfk: $scope.dataSelected.norec_pp,
                    jenis: $scope.findBy == 1 ? 'sitologi' : 'pa',
                    isDokterLuar: $scope.itemPA.dokterLuar,
                    dokterpengirim1: $scope.itemPA.dokterPengirim1 != undefined ? $scope.itemPA.dokterPengirim1.id : null,
                    dokterpengirim2: $scope.itemPA.dokterPengirim2 != undefined ? $scope.itemPA.dokterPengirim2 : null,
                    diagnosaklinik: $scope.itemPA.diagnosaKlinik != undefined ? $scope.itemPA.diagnosaKlinik : null,
                    keteranganklinik: $scope.itemPA.ketKlinik != undefined ? $scope.itemPA.ketKlinik : null,
                    diagnosapb: $scope.itemPA.diagnosaPB != undefined ? $scope.itemPA.diagnosaPB : null,
                    keteranganpb: $scope.itemPA.ketPB != undefined ? $scope.itemPA.ketPB : null,
                    topografi: $scope.itemPA.topografi != undefined ? $scope.itemPA.topografi : null,
                    morfologi: $scope.itemPA.morfologi != undefined ? $scope.itemPA.morfologi : null,
                    makroskopik: $scope.itemPA.makroskopik != undefined ? $scope.itemPA.makroskopik.replace(/\n/ig, '~') : null,
                    mikroskopik: $scope.itemPA.mikroskopik != undefined ? $scope.itemPA.mikroskopik.replace(/\n/ig, '~') : null,
                    kesimpulan: $scope.itemPA.kesimpulan != undefined ? $scope.itemPA.kesimpulan.replace(/\n/ig, '~') : null,
                    anjuran: $scope.itemPA.anjuran != undefined ? $scope.itemPA.anjuran.replace(/\n/ig, '~') : null,
                    jaringanasal: $scope.itemPA.jaringanAsal != undefined ? $scope.itemPA.jaringanAsal : null,
                    norec_pd: norec_pd,
                    norec: $scope.norecPA
                }
                $scope.hideExper = true
                medifirstService.post('laboratorium/save-hasil-lab-pa', objSave).then(function (e) {
                    init();
                    $scope.hideExper = false
                    $scope.popUpPA.close()

                }, function (error) {
                    $scope.hideExper = false
                })
            }
            $scope.BatalEkpertise = function () {

                $scope.norecHasilRadiologi = ''
                $scope.item.nofoto = undefined
                $scope.item.tglInput = new Date()
                $scope.item.dokter = undefined
                $scope.item.keterangan = undefined
                $scope.popUpEkpertise.close();
            }

            $scope.SaveEkpertise = function () {
                // if ($scope.item.nofoto == undefined) {
                //     window.messageContainer.error("No Foto Tidak Boleh Kosong!");
                //     return;
                // }
                if ($scope.item.tglInput == undefined) {
                    window.messageContainer.error("Tanggal Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.dokter == undefined) {
                    window.messageContainer.error("Dokter Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.keterangan == undefined) {
                    window.messageContainer.error("Keterangan Tidak Boleh Kosong!");
                    return;
                }
                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    // nofoto: $scope.item.nofoto,
                    tglinput: moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    dokterid: $scope.item.dokter.id,
                    keterangan: ($scope.item.keterangan == null) ? '' : $scope.item.keterangan.replace(/\n/ig, '~'),
                    pelayananpasienfk: $scope.dataSelected.norec_pp,
                    norec_pd: norec_pd,
                    norec: $scope.norecHasilRadiologi,
                    tglpelayanan: $scope.dataSelected.tglpelayanan

                }
                $scope.hideExper = true
                medifirstService.post('radiologi/save-hasil-radiologi', objSave).then(function (e) {
                    init();
                    $scope.hideExper = false
                    $scope.popUpEkpertise.close()
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-pacs-report=1&jenis=report&norec=' + $scope.dataSelected.norec_pp + '&noorder=' + $scope.dataSelected.noorder + $scope.dataSelected.no + '&view=true', function (response) {
                    //         // do something with response
                    // });
                }, function (error) {
                    $scope.hideExper = false
                })
            }
            $scope.CheckImage = function () {
                // console.log($scope.itemimg.img)
                // console.log($scope.itemimg)
                // console.log($scope.itemimg.keterangan)
                var ket = $scope.itemimg.keterangan == null ? '' : $scope.itemimg.keterangan
                var html = "<style>"
                + "body{background-color: black; margin: 0px}"
                + ".frame-left{width: 100%; height: 86vh;  text-align: center; border: 1px solid #ffffff}"
                + ".frame-right{width: 350px; margin-left: 5px; padding-left: 5px; padding-right: 5px; height: 86vh; background: black; border: 1px solid #ffffff}"
                + "p{color: white; padding: 5px; margin: auto; font-family: 'Comfortaa', cursive;}"
                + "h3{color: white; padding: 5px 0px 0px 0px; margin: auto; font-family: 'Comfortaa', cursive;}"
                + ".container{margin: auto; padding-top: 5px; width: 100%; display: flex;}"
                + "img{max-width: 90%; max-height: 90%; margin-top: 15px; padding: 20px}"
                + "#header{background-color: #2a2d33;padding: 10px;}"
                + ".title-top{font-family: 'Comfortaa', cursive;}"
                + "</style>"
                + "<head>"
                + "<link href='https://fonts.googleapis.com/css2?family=Comfortaa&display=swap' rel='stylesheet'>"
                + "<title>E-Healthcare | RSUD CIBINONG  :: Transmedic - PACS Viewer</title>"
                + "</head>"
                + "<div id='header'>"
                + "<div style='margin-top: 9px'><span style='color:#ffffff; margin-left: 35px; font-size: 20pt !important; font-weight: bold; margin-top: 9px'>"
                + "<span class='title-top'>Transmedic </span>"
                + "<span class='title-top' style='font-weight: bold; color:#10c4b2;'>PACS Viewer</span>"
                + "</span>"
                + "<br>"
                + "<span class='title-top' style='color:#ffffff; font-size: 10pt; font-style: italic; margin-left: 40px; margin-top: 2px;'>"
                + "E-Healthcare | RSUD CIBINONG"
                + "</span></div>"
                + "</div>"
                + "<div class='container'>"
                + "<div class='frame-left'><img src='" + $scope.itemimg.img
                + "'></></div>"
                + "<div class='frame-right'><h3>Informasi dari Gambar: </h3><p style='font-size: 13px;'> " 
                + ket.replace(/\/n/g, '<br>') 
                + "</p></div>"
                + "</div>"

                var tab = window.open('http://localhost', '_BLANK');
                tab.document.write(html);
            }

            $scope.cetakLabPA = function () {
                if ($scope.dataSelected == undefined) return
                var stt = 'false'
                if (confirm('View Report? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var user = medifirstService.getPegawaiLogin();
                if ($scope.findBy == 0) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-histopatologi=1&norec=' + $scope.dataSelected.norec_pp + '&user=' + user.namaLengkap + '&view=' + stt, function (response) {

                    });
                } else {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-nonpapsmear=1&norec=' + $scope.dataSelected.norec_pp + '&user=' + user.namaLengkap + '&view=' + stt, function (response) {

                    });
                }
            }

            $scope.CetakEkspertise = function () {
                var user = medifirstService.getPegawaiLogin();
                $scope.hideExper = true
                medifirstService.post('radiologi/save-hasil-radiologi', objSave).then(function (e) {
                    init();
                    $scope.hideExper = false
                    $scope.popUpEkpertise.close()
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-pacs-report=1&jenis=report&norec=' + $scope.dataSelected.norec_pp + '&noorder=' + $scope.dataSelected.noorder + $scope.dataSelected.no + '&view=true', function (response) {
                    //         // do something with response
                    // });
                }, function (error) {
                    $scope.hideExper = false
                })
            }

            $scope.cetakLabPA = function () {
                if ($scope.dataSelected == undefined) return
                // var stt = 'false'
                // if (confirm('View Report? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // var user = medifirstService.getPegawaiLogin();                   
                // if($scope.findBy == 0){
                //     var client = new HttpClient();          
                //     client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-histopatologi=1&norec=' +  $scope.dataSelected.norec_pp + '&user=' + user.namaLengkap + '&view=' + stt , function (response) {

                //     });      
                // }else{
                //     var client = new HttpClient();          
                //     client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab-nonpapsmear=1&norec=' +  $scope.dataSelected.norec_pp + '&user=' + user.namaLengkap + '&view=' + stt , function (response) {

                //     });    
                // }

                var local = JSON.parse(localStorage.getItem('profile'))
                var user = medifirstService.getPegawaiLogin().namaLengkap

                var profile = local.id;
                if ($scope.findBy == 0) {
                    window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                        + '&user=' + user + '&jenis=his', '_blank');
                } else {
                    window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.dataSelected.norec_pp + '&kdprofile=' + profile
                        + '&user=' + user + '&jenis=sitologi', '_blank');
                }




            }
            $scope.CetakEkspertise = function () {
                var user = medifirstService.getPegawaiLogin();
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        // daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                        daftarCetak.push(
                            {
                                "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                "expertise": $scope.dataGrid._data[i].expertise,
                            }
                        )
                    }
                }

                if (daftarCetak.length == 0) {
                  toastr.warning('Ceklis data yang mau di cetak', 'Peringatan')
                    return
                }
                var dataCetakFix = '';
                var result = ''
                for (let i = 0; i < daftarCetak.length; i++) {
                    const element = daftarCetak[i];
                    if (element.expertise == "✘") {
                      toastr.warning("Expertise belum tersedia", 'Peringatan')
                        return;
                    }
                    dataCetakFix = dataCetakFix + "'" + element.norec_pp + "',"
                }
                // var resultCetak = dataCetakFix.map(a => a).join("|");                
                var stt = 'false'
                if (confirm('Lihat Expertise Radiologi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-expertise-radiologi=1&norec=' + dataCetakFix + '&strIdPegawai=' + user.namaLengkap + '&view=' + stt, function (response) {

                });

            }
            $scope.itemdok = {}
            $scope.model = {}
            $scope.inputDokterPelaksana = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                SeeDokterPelaksana();
                $scope.itemdok.tglPelayanans = $scope.dataSelected.tglpelayanan;
                $scope.itemdok.namaPelayanans = $scope.dataSelected.namaproduk;
                if ($scope.dataSelected.isparamedis == true)
                    $scope.itemdok.paramedis = true
                else
                    $scope.itemdok.paramedis = false
                $scope.popup_editor.center().open();

            }

            function SeeDokterPelaksana() {
                medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
                    $scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
                    // $scope.listPegawaiPemeriksa = data.data.pegawai;

                });
                medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
                    $scope.listPegawaiPemeriksa = data;

                });
                // $scope.isRouteLoading=true;
                medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataSelected.norec_pp).
                    then(function (data) {
                        $scope.sourceDokterPelaksana = data.data.data;
                        // $scope.isRouteLoading=false;

                    });
            }


            $scope.columnDokters = [
                {
                    field: "jenispetugaspe",
                    title: "Jenis Pelaksana",
                    width: "100px",
                    // template: "#= jenisPetugas.jenisPelaksana #"
                },
                {
                    field: "namalengkap",
                    title: "Nama Pegawai",
                    width: "200px",
                    // template: multiSelectArrayToString
                }
            ];
            $scope.simpanDokterPelaksana = function () {
                if ($scope.model.jenisPelaksana == undefined && $scope.itemdok.paramedis == undefined) {
                    if ($scope.model.jenisPelaksana == undefined) {
                        messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
                        return
                    }
                    if ($scope.model.pegawais == undefined) {
                        messageContainer.error("Pegawai Tidak Boleh Kosong")
                        return
                    }
                }


                var norec_ppp = "";
                if ($scope.dataDokterSelected != undefined) {
                    norec_ppp = $scope.dataDokterSelected.norec_ppp
                }

                if (norec_ppp == "") {
                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
                        for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
                            if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
                                // && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
                            ) {
                                messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
                                return
                            }
                        }
                    }
                }


                var pelayananpasienpetugas = {
                    norec_ppp: norec_ppp,
                    norec_pp: $scope.dataSelected.norec_pp,
                    norec_apd: $scope.dataSelected.norec_apd,
                    objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
                    objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
                    isparamedis: $scope.itemdok.paramedis,
                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }

                medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
                    var jenis = 'Input/Ubah Petugas Layanan';
                    var norec = e.data.data.norec
                    $scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
                    SeeDokterPelaksana();
                    // LoadData();


                    var data = {};
                    if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
                        if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                            data.dokter = $scope.model.pegawais.namalengkap
                            $scope.dataSelected.dokter = data.dokter

                        }
                    }

                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
                        for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
                            if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.itemdok.paramedis != true && $scope.model.pegawais == undefined) {
                                $scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
                                break
                            }

                        }
                    }
                    if ($scope.itemdok.paramedis == true) {
                        $scope.dataSelected.paramedis = "✔"

                    } else {
                        $scope.dataSelected.paramedis = ""

                    }
                    $scope.model.jenisPelaksana = undefined;
                    $scope.model.pegawais = undefined;
                    $scope.dataDokterSelected = undefined;
                })

            }


            $scope.hapusDokterPelaksana = function () {
                if ($scope.dataDokterSelected == undefined) {
                    messageContainer.error("Pilih data Pegawai dulu!!")
                    return
                }

                var pelayananpasienpetugas = {
                    norec_ppp: $scope.dataDokterSelected.norec_ppp,

                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }
                medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
                    SeeDokterPelaksana();
                    // LoadData();
                    $scope.model.jenisPelaksana = "";
                    $scope.model.pegawais = "";
                    $scope.dataDokterSelected = undefined;
                })
                var data = {};
                if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
                    if ($scope.dataSelected.namaPelayanan == $scope.itemdok.namaPelayanans) {
                        $scope.dataSelected.dokter = "-"

                    }
                }
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.batalDokterPelaksana = function () {
                // LoadData();
                $scope.model.jenisPelaksana = "";
                $scope.model.pegawais = "";
                $scope.dataDokterSelected = undefined;
                $scope.popup_editor.center().close();
            }

            $scope.clickD = function (dataDokterSelected) {
                if (dataDokterSelected != undefined) {
                    medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
                        .then(function (data) {

                            $scope.listPegawaiPemeriksa.add(data.data[0])
                            $scope.model.pegawais = data.data[0];

                        })
                    $scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }

                }
            }
            $scope.catatanLab = function () {
                delete $scope.item.catatanLab
                if ($scope.dataSelected == undefined) {
                  toastr.warning('Pilih salah satu order pelayanan terlebih dahulu', 'Peringatan')
                  return
                }
                if ($scope.dataSelected.noorder == null) {
                    toastr.warning('No Order belum ada ', 'Peringatan')
                    return
                }
                medifirstService.get("laboratorium/get-catatan-lab?noorer=" + $scope.dataSelected.noorder)
                    .then(function (data) {
                        if (data.data) {
                            $scope.item.catatanLab = data.data.catatan
                        }
                        $scope.popupCatatan.center().open()

                    })


            }
            $scope.saveCatatan = function () {
                var json = {
                    'noorder': $scope.dataSelected.noorder,
                    'catatan': $scope.item.catatanLab
                }
                medifirstService.post('laboratorium/save-catatan-lab', json).then(function (e) {
                    delete $scope.item.catatanLab
                    $scope.popupCatatan.close()
                })
            }

            $scope.inputPmi = function () {
                $scope.popUp.center().open()
            }

            $scope.SimpanPmi = function () {
                debugger;
                var json = {
                    'norec_pp': $scope.dataSelected.norec_pp,
                    'pmi': $scope.item.pmi.id
                }
                medifirstService.post('laboratorium/save-pmi', json).then(function (e) {
                    $scope.popUp.close()
                    $scope.item.pmi = '';
                    init();
                })
            }

            $scope.BatalPmi = function () {
                $scope.popUp.close()
            }

            $scope.getRiwayatLab = function () {
                $scope.resultGrids = new kendo.data.DataSource({
                    data: []
                })

                $scope.ColumnResult = {
                    toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "riwayatPemeriksaanLab.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: true,
                    serverPaging: true,
                    // dataBound: onDataBound,
                    excelExport: function (e) {

                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:H1"];
                        sheet.name = "Hasil";

                        var myHeaders = [

                            {
                                value: "Hasil Laboratorium",
                                fontSize: 15,
                                textAlign: "center",
                                background: "#c1d2d2",
                                // color:"#ffffff"
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    columns: [{
                        field: "tglpelayanan",
                        title: "Tgl. Pelayanan",
                        width: "20%"
                    }, {
                        field: "namaproduk",
                        title: "Nama Pemeriksaan",
                        width: "20%"
                    },
                    {
                        field: "detailpemeriksaan",
                        title: "Detail Pemeriksaan",
                        width: "20%"
                    }, {
                        field: "hasil",
                        title: "Hasil Pemeriksaan",
                        width: "15%",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                        },
                        editor: dynamicEditor
                    }, {
                        field: "nilaitext",
                        title: "Nilai Normal",
                        width: "15%"
                    },
                    // {
                    //     field: "tipedata",
                    //     title: "tipedata",
                    //     width: "0%"

                    // },
                    {
                        field: "satuanstandar",
                        title: "Satuan Hasil",
                        width: "20%"
                    },
                    {
                        field: "Metode",
                        title: "Metode",
                        width: "20%"
                    },

                    {
                        hidden: true,
                        field: "detailjenisproduk",
                        title: "Jenis Pemeriksaan"
                    },

                    {
                        hidden: true,
                        field: "nourutdetail"

                    }]
                };
                $scope.isRouteLoading = true
                var noRmGet = "";
                // medifirstService.get("laboratorium/get-pasien-lab-manual?nocmfk=" + $scope.item.noMr +'&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk ).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     if ( data.data.length > 0) {
                //         noRmGet =   data.data[0].id
                //     }


                // });
                var produkfkJoin = "";
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Pelayanan Yg Akan Di Lihat!");
                    return;
                }
                else if ($scope.dataSelected.length >= 2 & $scope.dataSelected.objectdepartemenfk == 3) {
                    window.messageContainer.error("Pilih salah Satu");
                    return;
                }
                // for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                //     if ($scope.dataGrid._data[i].statCheckbox) {

                //                 produkfkJoin= $scope.dataGrid._data[i].produkfk
                //                 $scope.dataGrid._data.selectRow.set

                //     }
                // }
                produkfkJoin = $scope.dataSelected.produkfk
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                if ($scope.item.tglAwal == undefined) {
                    tglAwal = "";
                    tglAkhir = "";
                }
                medifirstService.get("laboratorium/get-riwayat-lab-manual?nocmfk=" + $scope.item.noMr + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk
                    + "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&produkfk=" + produkfkJoin).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {

                            $scope.resultGridsRiwayat = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [
                                    { field: "tglpelayanan" },
                                    { field: "detailjenisproduk" },
                                    { field: "namaproduk" }

                                ],
                                // sort: { field: "nourutdetail", dir: "asc" },
                                schema: {
                                    model: {
                                        // id: "id",
                                        fields: {
                                            detailjenisproduk: { editable: false, type: "string" },
                                            detailpemeriksaan: { editable: false, type: "string" },
                                            memohasil: { editable: false, type: "string" },
                                            namaproduk: { editable: false, type: "string" },
                                            satuanstandar: { editable: false, type: "string" },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: { editable: false, type: "number" },
                                            nilaimin: { editable: false, type: "number" },
                                            hasil: { editable: (dynamicEditor) },
                                            nourutdetail: { editable: false, type: "number" },
                                            nilaitext: { editable: false, type: "string" }
                                        }
                                    }
                                },
                                change: function (e) {
                                    console.log("change :" + e.action);
                                    if (e.field && e.action === "itemchange") {
                                        if (e.items[0].hasil) {
                                            // $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
                                            let HasilInput = e.items[0].hasil
                                            if (HasilInput.indexOf("+/") >= 0) {
                                                let hssl = "positif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-/") >= 0) {
                                                let hssl = "negatif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if (hssl == nilaistring) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("<") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("<");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf(">") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split(">");
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (HasilInput.indexOf("-") >= 0) {
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("-");
                                                let hssl0 = parseFloat(hsslARr[0])
                                                let hssl = parseFloat(hsslARr[1])

                                                if (hssl0 >= a && hssl <= b) {
                                                    e.items[0].flag = "N"
                                                } else {
                                                    e.items[0].flag = "Y"
                                                }
                                            } else if (e.items[0].nilaimin == null) {
                                                let hssl = e.items[0].hasil
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();

                                                e.items[0].flag = "N"

                                            }
                                            else {
                                                if (e.items[0].nilaimin != null) {
                                                    let a = parseFloat(e.items[0].nilaimin)
                                                    let b = parseFloat(e.items[0].nilaimax)
                                                    let hssl = parseFloat(e.items[0].hasil)

                                                    if (hssl >= a && hssl <= b) {
                                                        e.items[0].flag = "N"
                                                    } else {
                                                        e.items[0].flag = "Y"
                                                    }
                                                } else {
                                                    let hssl = e.items[0].hasil
                                                    let nilaistring = e.items[0].nilaitext
                                                    nilaistring = nilaistring.toUpperCase();
                                                    hssl = hssl.toUpperCase();
                                                    if (hssl == nilaistring) {
                                                        e.items[0].flag = "N"
                                                    } else {
                                                        e.items[0].flag = "Y"
                                                    }
                                                }
                                            }
                                            //                                             alert('hasilna :'+e.items[0].hasil)
                                            e.items.state = "edit"
                                            //                                         } else {
                                            //                                             e.items.state = "add"
                                        }
                                        // $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        $scope.resultGrids.fetch();
                                    }
                                }
                            });
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Informasi')

                        }
                    });
                $scope.popUpRiwayatHasil.center().open();
            }

            $scope.hasilLabM = function () {
                var user = medifirstService.getPegawaiLogin();
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        // daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                        daftarCetak.push(
                            {
                                "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan,
                            }
                        )
                    }
                }
                var dataCetakFix = '';
                var result = ''
                for (let i = 0; i < daftarCetak.length; i++) {
                    const element = daftarCetak[i];
                    if (daftarCetak.length == 1) {
                        dataCetakFix = "'" + element.norec_pp + "'"
                    } else if (daftarCetak.length == i + 1) {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                    } else {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                    }

                }
                if (daftarCetak.length == 0) {
                    toastr.warning('Ceklis data yang mau di cetak', 'Peringatan')
                    return
                }

                if (norec_apd != null) {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelompokPasien,
                        6: $scope.item.tglRegistrasi,
                        7: norec_apd,
                        8: norec_pd,
                        9: $scope.item.kelas.id,
                        10: $scope.item.kelas.namakelas,
                        11: namaRuanganFk,
                        12: namaRuangan,
                        13: $scope.item.tgllahir,
                        14: $scope.item.objectjeniskelaminfk,
                        15: dataCetakFix,
                        // 16: $scope.dataGrid._data[i].tglpelayanan ,
                    }
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    $state.go('HasilLaboratoriumRev', {
                        norecPd: norec_pd,
                        norecApd: norec_apd,
                        norecPP: dataCetakFix

                    })
                }

            }

            $scope.closePopUp = function () {
                $scope.popUpRiwayatHasil.close();
            }

            //** BATAS */
        }
    ]);
});

