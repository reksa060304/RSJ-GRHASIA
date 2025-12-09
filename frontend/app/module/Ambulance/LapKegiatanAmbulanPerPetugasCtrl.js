define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('LapKegiatanAmbulanPerPetugasCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
        function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.popupExp = {};
            $scope.user = medifirstService.getPegawaiLogin();
            $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'))
            $scope.item.periodeAkhir = new Date();
            $scope.item.jmlRows = 50;
            $scope.item.listKasirMulti = []
            var dataPegawai = [];
            loadCombo()

            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function loadCombo() {
                $scope.selectOptionsKasir = {
						placeholder: "Pilih Petugas...",
						dataTextField: "namalengkap",
						dataValueField: "id",
						autoBind: false,

					};
				medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
					$scope.listKasir = dat.data.pegawai;
                    dataPegawai = dat.data.datapegawai;
					// if (dataPegawai != undefined) {
					// 	$scope.item.listKasirMulti = [
					// 		{ id: dataPegawai.objectpegawaifk, namalengkap: dataPegawai.namalengkap }
					// 	]
					// }
					loadData();
				});
			}

            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var listKasir = ""
				if ($scope.item.listKasirMulti.length != 0) {
					var a = ""
					var b = ""
					for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {
						var c = $scope.item.listKasirMulti[i].id
						b = "," + c
						a = a + b
					}
					listKasir = a.slice(1, a.length)
				}

                $q.all([
                    medifirstService.get("ambulance/laporan-kegiatan-ambulan-per-wilayah?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&petugasArr=" + listKasir),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data[0].data.length; i++) {
                        data[0].data[i].no = i + 1
                        // data[0].data[i].wilayah = ambilKotaKabupaten(data[0].data[i].address)
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
                        data: data[0].data,
                        // group: $scope.group,
                        pageSize: 10,
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5
                        },
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    no: { type: "number" },
                                    namajeniskegiatan: { type: "string" },
                                    nopolisi: { type: "string" },
                                    keteranganlainnya: { type: "string" },
                                    namapersonel: { type: "string" },
                                    lokasitujuan: { type: "string" },
                                    jarak: { type: "number" },
                                    hargasatuan: { type: "number" },
                                    namapasien_klien: { type: "string" }
                                }
                            },
                            total: function (response) {
                                return response.length;
                            }
                        },
                        sort: {
                            enabled: true
                        }
                    });


                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                    }

                    cacheHelper.set('LapKegiatanAmbulanCtrl', chacePeriode);
                });
            };

            $scope.columnDaftarPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "LaporanKegiatanAmbulanPerPetugas.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Kegiatan Ambulan Per Petugas",
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
                        "width": "30px",
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Order",
                        "width": "70px",
                    },
                    {
                        "field": "nostruk",
                        "title": "No Order",
                        "width": "70px",
                    },
                    {
                        "field": "namajeniskegiatan",
                        "title": "Jenis Kegiatan",
                        "width": "130px"
                    },
                    {
                        "field": "nopolisi",
                        "title": "Plat",
                        "width": "100px",
                    },
                    {
                        "field": "keteranganlainnya",
                        "title": "Nama Mobil",
                        "width": "100px",
                    },
                    {
                        "field": "petugas",
                        "title": "Nama Petugas",
                        "width": "150px",
                    },
                    {
                        "field": "address",
                        "title": "Lokasi Tujuan",
                        "width": "200px",
                    },
                ]
            };
            // $scope.group = [
            //     {
            //         field: "wilayah"
            //     }
            // ];

            // function ambilKotaKabupaten(alamat) {
            //     let match = alamat.match(/(Kota|Kabupaten|kota|kabupaten|kab.)\s([A-Za-z\s]+)/);
            //     return match ? match[0].trim() : null;
            // }
            //** BATAS */
        }
    ]);
});