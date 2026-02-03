define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend; 
    initialize.controller('BerkasIdentitasPasienCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$mdDialog', '$parse',
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
            $scope.PegawaiLogin2 = {};
            var paramSearch =''
            $scope.SistoleChart = false;
            $scope.NonSistoleChart = false;

            medifirstService.get(`emr/combo-jenis-berkas-pasien-new`, true).then(function (dat) {
                $scope.listJenisBerkas = dat.data;
            });

            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
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
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    if ($scope.header.DataNoregis == true) {
                        paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                  
                    } else {
                        paramSearch ='nocm=' + $scope.item.noMr
                    }
                    initBerkasPasien()
  
                }
  
             
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                    initBerkasPasien()
                }
                else {
                    paramSearch ='nocm=' + $scope.item.noMr
                    initBerkasPasien()
                }
            }
            $scope.refresh = function () {
                initBerkasPasien()
            }

            function initBerkasPasien() {
                $scope.isRouteLoading = true

                medifirstService.get("registrasi/get-berkas-pasien?nocm=" + $scope.item.noMr, true).then(function (dat) {
                    $scope.isRouteLoading = false
                    var mappedData = []
                    if (dat.data && dat.data.data) {
                        mappedData = dat.data.data.map(function(item) {
                            return {
                                norec: item.norec,
                                nocm: item.nocm,
                                tglberkas: item.tglberkas,
                                namafile: item.namafile,
                                deskripsi: item.deskripsi,
                                file: item.file
                            }
                        })
                    }
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: mappedData,
                        pageSize: 10,
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
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [ 
                        {
                            "field": "tglberkas",
                            "title": "Tgl Upload",
                            "width": "15%",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglberkas #')}}</span>"
                        },
                        {
                            "field": "namafile",
                            "title": "Nama File",
                            "width": "30%",
                        },
                        {
                            "field": "deskripsi",
                            "title": "Deskripsi",
                            "width": "40%",
                        },
                        {
                            "command": [
                                { text: "Lihat", click: LihatBerkas },
                                { text: "Download", click: DownloadBerkas }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }
            $scope.inputBaru = function () {
                clear()
                $scope.dataSelected = undefined
                $scope.popUpFile.center().open()
            }
            $scope.batal = function () {
                $scope.popUpFile.close()
            }
            function clear() {
                document.getElementById("formFile").reset();
                delete $scope.item.namafile
                delete $scope.item.keterangan
            }
            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }
            function LihatBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/dokumenpasienm?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }

            function DownloadBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/dokumenpasienm/download?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
        }
    ]);
});
