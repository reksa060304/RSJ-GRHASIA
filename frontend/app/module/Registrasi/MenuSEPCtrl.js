define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MenuSEPCtrl', ['$rootScope', '$scope', '$state', 'ModelItem', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, ModelItem, DateHelper, medifirstService) {
            $scope.now = new Date();
            var dataKabupaten = '';
            var dataKecamatan = '';
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            var ppkRumahSakit = ""
            var namappkRumahSakit = ""

            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                ppkRumahSakit = dat.data
            })
            medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
            $scope.approval = {};
            $scope.pengajuan = {};
            $scope.model = {};
            $scope.suplesi = {};
            $scope.item = {};
            $scope.int = {}
            $scope.listTujuan = [
                { id: "0", name: "Normal" },
                { id: "1", name: "Prosedur" },
                { id: "2", name: "Konsul Dokter" },
            ]
            $scope.listFlag = [
                { id: "0", name: "Prosedur Tidak Berkelanjutan" },
                { id: "1", name: "Prosedur dan Terapi Berkelanjutan" },
                { id: "2", name: "Konsul Dokter" },
            ]
            $scope.listPenunjang = [
                { id: "1", name: "Radioterapi" },
                { id: "2", name: "Kemoterapi" },
                { id: "3", name: "Rehabilitasi Medik" },
                { id: "4", name: "Rehabilitasi Psikososial" },
                { id: "5", name: "Transfusi Darah" },
                { id: "6", name: "Pelayanan Gigi" },
                { id: "7", name: "Laboratorium" },
                { id: "8", name: "USG" },
                { id: "9", name: "Farmasi" },
                { id: "10", name: "Lain-Lain" },
                { id: "11", name: "MRI" },
                { id: "12", name: "HEMODIALISA" },
            ]
            $scope.listAsesmen = [
                { id: "1", name: "Poli spesialis tidak tersedia pada hari sebelumnya" },
                { id: "2", name: "Jam Poli telah berakhir pada hari sebelumnya" },
                { id: "3", name: "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
                { id: "4", name: "Atas Instruksi RS" },
            ]

            $scope.listBiaya = [
                { "id": "1", "name": "Pribadi", "value": 1 },
                { "id": "2", "name": "Pemberi Kerja", "value": 2 },
                { "id": "3", "name": "Asuransi Kesehatan Tambahan", "value": 3 },
            ]
            $scope.listStatusPlg = [
                { "id": "1", name: "Atas Persetujuan Dokter" },
                { "id": "3", name: "Atas Permintaan Sendiri" },
                { "id": "4", name: "Meninggal" },
                { "id": "5", name: "Lain-lain" }
            ]
            $scope.item.tujuanKunj = $scope.listTujuan[0]
            $scope.isShowPembuatanSep = true;
            $scope.isShowPotensi = false;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.isShowIntegrasi2 = false;
            $scope.isShowFinger = false
            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            $scope.showApproval = function () {
                $scope.isShowApproval = !$scope.isShowApproval;
            }
            $scope.showTglPulang = function () {
                $scope.isShowTglPulang = !$scope.isShowTglPulang;
            }
            $scope.showIntegrasi = function () {
                $scope.isShowIntegrasi = !$scope.isShowIntegrasi;
            }
            $scope.showIntegrasi2 = function () {
                $scope.isShowIntegrasi2 = !$scope.isShowIntegrasi2;
            }
            $scope.showisShowFinger = function () {
                $scope.isShowFinger = !$scope.isShowFinger;
            }

            $scope.item.lakalantas = false;
            function getDPJP(kdSpesialis, jenisPel, tipe) {
                let now = moment(new Date()).format('YYYY-MM-DD')
                let json = {
                    "url": "referensi/dokter/pelayanan/" + jenisPel + "/tglPelayanan/" + now + "/Spesialis/" + kdSpesialis,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;

                    }
                    else toastr.info('Dokter DPJP tidak ada', 'Info')
                })
            }
            getDPJP('IGD', 1, '1')
            $scope.jenisPelayanan = [{
                "idjenispelayanan": 1, "jenispelayanan": "Rawat Inap"
            }, {
                "idjenispelayanan": 2, "jenispelayanan": "Rawat Jalan"
            }];
            $scope.jenisPengajuan = [{
                "idjenispengajuan": 1, "jenispengajuan": "Backdate"
            }, {
                "idjenispengajuan": 2, "jenispengajuan": "Finger Print"
            }];
            $scope.listPost = [{
                "id": 12, "name": "INSERT"
            }, {
                "id": 13, "name": "UPDATE"
            }];

            $scope.kelasRawat = [{
                "idkelas": 3, "namakelas": "Kelas I", "value": 1
            }, {
                "idkelas": 4, "namakelas": "Kelas II", "value": 2
            }, {
                "idkelas": 5, "namakelas": "Kelas III", "value": 3
            }];
            $scope.kelasRawat2 = [{
                "idkelas": 33, "namakelas": "Kelas I", "value": 1
            }, {
                "idkelas": 44, "namakelas": "Kelas II", "value": 2
            }, {
                "idkelas": 55, "namakelas": "Kelas III", "value": 3
            }];
            $scope.lakaLantas = [{
                "idlakalantas": 6, "lakalantas": "Ya", "value": 1
            }, {
                "idlakalantas": 7, "lakalantas": "Tidak", "value": 0
            }];
            $scope.asalRujukan = [{
                "idasalrujukan": 8, "asalrujukan": "Faskes 1", "value": 1
            }, {
                "idasalrujukan": 9, "asalrujukan": "Faskes 2 (RS)", "value": 2
            }];
            $scope.poliEksekutif = [{
                "id": 10, "eks": "Eksekutif", "value": 1
            }, {
                "id": 11, "eks": "Reguler", "value": 0
            }];

            // "penjamin": "{penjamin lakalantas -> 1=Jasa raharja PT, 2=BPJS Ketenagakerjaan, 3=TASPEN PT, 4=ASABRI PT} jika lebih dari 1 isi -> 1,2 (pakai delimiter koma)",

            $scope.penjamin = [{
                "id": 12, "name": "Jasa Raharja PT", "value": 1
            }, {
                "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2
            }, {
                "id": 14, "name": "TASPEN PT", "value": 3
            }, {
                "id": 15, "name": "ASABRI PT", "value": 4
            }];

            $scope.isRouteLoading = true;
            $scope.item.tipe = $scope.listPost[0]
            $scope.item.kelasRawat = $scope.kelasRawat[0];
            $scope.clear = function () {
                $scope.item = {};

                $scope.suplesi = {
                    tglSep: $scope.now,
                };
                $scope.approval = {
                    tglSep: $scope.now,
                }
                $scope.integ = {};
                $scope.pengajuan = {
                    tglSep: $scope.now,
                }
                $scope.tglplg = {
                    tglPulang: $scope.now,
                }
                $scope.isRouteLoading = false;
                $scope.now = new Date();
                var tanggals = DateHelper.getDateTimeFormatted3($scope.now);
                $scope.item = {
                    tglSep: $scope.now,
                };
                $scope.item.tglRujukan = tanggals + " 00:00";
                $scope.item.asalRujukan = $scope.asalRujukan[1];
                $scope.item.jenisPelayanan = $scope.jenisPelayanan[1];

                $scope.item.kelasRawat = $scope.kelasRawat[0];
                // $scope.item.lakaLantas = $scope.lakaLantas[1];
                $scope.item.poliEksekutif = $scope.poliEksekutif[1];
                $scope.item.cekNomorPeserta = true;

            };
            $scope.clear();
            $scope.findDataBySep = function (data) {
                $scope.isRouteLoading = true;
                manageServicePhp.cariSep(data).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            // *** CREATE SEP


            $scope.checkKepesertaanByNoBpjs = function () {
                if (!$scope.item.cekNomorPeserta) return;
                if ($scope.item.noKepesertaan === '' || $scope.item.noKepesertaan === undefined) return;
                $scope.isLoadingNoKartu = true;
                let json = {
                    "url": "Peserta/nokartu/" + $scope.item.noKepesertaan + "/tglSEP/" + new moment(new Date).format('YYYY-MM-DD'),
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.item.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.item.namaPeserta = e.data.response.peserta.nama;
                        $scope.item.tglLahir = tglLahir;
                        $scope.item.noIdentitas = e.data.response.peserta.nik;
                        $scope.item.kelasBridg = {
                            id: parseInt(e.data.response.peserta.hakKelas.kode),
                            kdKelas: e.data.response.peserta.hakKelas.kode,
                            nmKelas: e.data.response.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.peserta.hakKelas.keterangan,
                        };
                        for (let x = 0; x < $scope.kelasRawat.length; x++) {
                            const element = $scope.kelasRawat[x];
                            if (element.value == e.data.response.peserta.hakKelas.kode) {
                                $scope.item.kelasRawat = element
                                break
                            }

                        }

                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.item.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;

                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

                var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                if (arrKdPpkRUjukan != undefined) {
                    var kdPpkRujukan = arrKdPpkRUjukan[0];
                    var namaPpkRujukan = arrKdPpkRUjukan[1];
                }

            }


            $scope.currentListPenjamin = [];
            $scope.addListPenjamin = function (data) {
                var index = $scope.currentListPenjamin.indexOf(data);
                if (_.filter($scope.currentListPenjamin, {
                    id: data.id
                }).length === 0)
                    $scope.currentListPenjamin.push(data);
                else {
                    $scope.currentListPenjamin.splice(index, 1);
                }

            }
            $scope.clear();
            $scope.$watch('item.jenisPelayanan', function (e) {
                if (!e) return;
                if (e.jenispelayanan.indexOf('Inap') >= 0) {
                    medifirstService.get("bridging/bpjs/get-ruangan-ri").then(function (data) {
                        $scope.ruangans = data.data.data;
                    })
                } else {
                    medifirstService.get("bridging/bpjs/get-ruangan-rj").then(function (data) {
                        $scope.ruangans = data.data.data;
                    })
                    $scope.item.kelasRawat = $scope.kelasRawat[2];
                }
            })
            $scope.$watch('item.lakaLantas', function (e) {
                if (!e) return;
                if (e.lakalantas.indexOf('Ya') >= 0) {
                    $scope.LakaYa = true;
                    $scope.disableLokasi = false;
                    $scope.item.lokasiLaka = undefined;
                } else {
                    $scope.LakaYa = false;
                    $scope.disableLokasi = true;
                }
            })
            $scope.generateSepV2 = function () {
                if (!$scope.item.tipe) {
                    messageContainer.error('Pilih Tipe Post');
                    return;
                } else {

                    if ($scope.item.tipe.id === 12) {
                        $scope.status = 'Insert';
                        $scope.genSep2();
                    } else {
                        $scope.status = 'Update';
                        $scope.genSep2();
                    }
                }
            }
            $scope.generateSep = function () {
                if (!$scope.item.tipe) {
                    messageContainer.error('Pilih Tipe Post');
                    return;
                } else {

                    if ($scope.item.tipe.id === 12) {
                        $scope.status = 'Insert';
                        $scope.generateSepss();
                    } else {
                        $scope.status = 'Update';
                        $scope.generateSepss();
                    }
                }
            }
            $scope.genSep2 = function (data) {
                var listRawRequired = [
                    "item.noCm|ng-model|Nomor CM",
                    "item.noKepesertaan|ng-model|Nomor kartu",
                    "item.tglSep|k-ng-model|Tanggal Sep",
                    // "item.noRujukan|ng-model|Nomor Rujukan",
                    "item.tglRujukan|k-ng-model|Tanggal Rujukan",
                    // "item.jenisPelayanan|ng-model|Jenis Pelayanan",
                    "item.poliTujuan|k-ng-model|Poli Tujuan",
                    "item.diagnosa|ng-model|Diagnosa Awal",
                    // "item.kelasRawat|ng-model|Kelas Rawat",
                    // "item.lakaLantas|ng-model|Laka Lantas",
                ];
                if ($scope.item.lakalantas === true) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjamin.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjamin[i].value
                        b = "," + c
                        a = a + b
                    }
                    var listPenjamin = a.slice(1, a.length)

                }
                var kdPpkRujukan = "";
                if ($scope.item.faskesRujukan == true) {
                    if ($scope.item.namaAsalRujukanBrid != undefined) {
                        var arrKdPpkRUjukanBrid = $scope.item.namaAsalRujukanBrid.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukanBrid[0];
                    }
                } else {
                    if ($scope.item.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukan[0];
                    }
                }
                var kdDiagnoosa = "";
                if ($scope.item.diagnosa != undefined) {
                    var arrkdDiag = $scope.item.diagnosa.split(' - ');
                    kdDiagnoosa = arrkdDiag[0];
                }


                var poliTujuans = ""
                if ($scope.item.poliTujuan != undefined) {
                    poliTujuans = $scope.item.poliTujuan.kdinternal
                }
                var kdPropinsi = ""
                if ($scope.item.propinsi != undefined)
                    kdPropinsi = $scope.item.propinsi.kode

                var kdKabupaten = ""
                if ($scope.item.kabupaten != undefined)
                    kdKabupaten = $scope.item.kabupaten.kode

                var kdKecamatan = ""
                if ($scope.item.kecamatan != undefined)
                    kdKecamatan = $scope.item.kecamatan.kode

                // if(data.lakaLantas.value === 1)
                //     listRawRequired.push("item.lokasiLaka|ng-model|Lokasi Laka Lantas");
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.isRouteLoading = true;

                    var dataUpdate = {
                        "nosep": $scope.item.noSep === undefined ? "" : $scope.item.noSep,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        // "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": $scope.item.lakalantas == true ? new moment($scope.item.tglKejadian).format('YYYY-MM-DD') : "",
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,

                    };


                    var dataInsert = {
                        "nokartu": $scope.item.noKepesertaan,
                        "tglsep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                        "jenispelayanan": $scope.item.jenisPelayanan.idjenispelayanan,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,
                    };
                    if ($scope.status == 'Insert') {
                        var dataSend = {
                            "url": "SEP/2.0/insert",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "t_sep": {
                                        "noKartu": $scope.item.noKepesertaan,
                                        "tglSep": new moment($scope.item.tglSEP).format('YYYY-MM-DD'),
                                        "ppkPelayanan": ppkRumahSakit.trim(),
                                        "jnsPelayanan": $scope.item.jenisPelayanan.idjenispelayanan,
                                        "klsRawat": {
                                            "klsRawatHak": $scope.item.kelasRawat.value,
                                            "klsRawatNaik": $scope.item.klsRawatNaik ? $scope.item.klsRawatNaik.value : "",
                                            "pembiayaan": $scope.item.pembiayaan ? $scope.item.pembiayaan.id : "",
                                            "penanggungJawab": $scope.item.penanggungJawab ? $scope.item.penanggungJawab : ""
                                        },
                                        "noMR": $scope.item.noCm,
                                        "rujukan": {
                                            "asalRujukan": $scope.item.asalRujukan.value,
                                            "tglRujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                                            "noRujukan": $scope.item.noRujukan === undefined ? "" : $scope.item.noRujukan,
                                            "ppkRujukan": kdPpkRujukan != "null" ? kdPpkRujukan : ""
                                        },
                                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                                        "diagAwal": kdDiagnoosa,
                                        "poli": {
                                            "tujuan": poliTujuans,
                                            "eksekutif": $scope.item.poliEksekutif.value,
                                        },
                                        "cob": {
                                            "cob": $scope.item.cob === true ? "1" : "0"
                                        },
                                        "katarak": {
                                            "katarak": $scope.item.katarak === true ? "1" : "0"
                                        },
                                        "jaminan": {
                                            "lakaLantas": $scope.item.lakalantas === true ? "1" : "0",
                                            "penjamin": {
                                                "tglKejadian": $scope.item.lakalantas === true ? new moment($scope.item.tglKejadian).format('YYYY-MM-DD') : "",
                                                "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                                                "suplesi": {
                                                    "suplesi": $scope.item.suplesi === true ? "1" : "0",
                                                    "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                                                    "lokasiLaka": {
                                                        "kdPropinsi": kdPropinsi,
                                                        "kdKabupaten": kdKabupaten,
                                                        "kdKecamatan": kdKecamatan
                                                    }
                                                }
                                            }
                                        },
                                        "tujuanKunj": $scope.item.tujuanKunj ? $scope.item.tujuanKunj.id : "",
                                        "flagProcedure": $scope.item.flagProcedure ? $scope.item.flagProcedure.id : "",
                                        "kdPenunjang": $scope.item.kdPenunjang ? $scope.item.kdPenunjang.id : "",
                                        "assesmentPel": $scope.item.assesmentPel ? $scope.item.assesmentPel.id : "",
                                        "skdp": {
                                            "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                                            "kodeDPJP": $scope.item.kodeDPJP != undefined ? $scope.item.kodeDPJP.kode : "",
                                        },
                                        "dpjpLayan": $scope.item.dpjpLayan != undefined ? $scope.item.dpjpLayan.kode : "",
                                        "noTelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,
                                        "user": "Ramdanegie"
                                    }
                                }
                            }
                        }

                        medifirstService.postNonMessage("bridging/bpjs/tools", dataSend).then(function (e) {
                            // manageServicePhp.generateSEP(dataGen).then(function (e) {
                            document.getElementById("jsonCreateSep2").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    } else {
                        var dataSend = {
                            "url": "SEP/2.0/update",
                            "method": "PUT",
                            "data": {
                                "request": {
                                    "t_sep": {
                                        "noSep": $scope.item.noSep === undefined ? "" : $scope.item.noSep,

                                        "klsRawat": {
                                            "klsRawatHak": $scope.item.kelasRawat.value,
                                            "klsRawatNaik": $scope.item.klsRawatNaik ? $scope.item.klsRawatNaik.value : "",
                                            "pembiayaan": $scope.item.pembiayaan ? $scope.item.pembiayaan.id : "",
                                            "penanggungJawab": $scope.item.penanggungJawab ? $scope.item.penanggungJawab : ""
                                        },
                                        "noMR": $scope.item.noCm,

                                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                                        "diagAwal": kdDiagnoosa,
                                        "poli": {
                                            "tujuan": poliTujuans,
                                            "eksekutif": $scope.item.poliEksekutif.value,
                                        },
                                        "cob": {
                                            "cob": $scope.item.cob === true ? "1" : "0"
                                        },
                                        "katarak": {
                                            "katarak": $scope.item.katarak === true ? "1" : "0"
                                        },
                                        "jaminan": {
                                            "lakaLantas": $scope.item.lakalantas === true ? "1" : "0",
                                            "penjamin": {
                                                "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                                                "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                                                "suplesi": {
                                                    "suplesi": $scope.item.suplesi === true ? "1" : "0",
                                                    "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                                                    "lokasiLaka": {
                                                        "kdPropinsi": kdPropinsi,
                                                        "kdKabupaten": kdKabupaten,
                                                        "kdKecamatan": kdKecamatan
                                                    }
                                                }
                                            }
                                        },

                                        "dpjpLayan": $scope.item.dpjpLayan != undefined ? $scope.item.dpjpLayan.kode : "",
                                        "noTelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,
                                        "user": "Ramdanegie"
                                    }
                                }
                            }
                        }
                        medifirstService.postNonMessage("bridging/bpjs/tools", dataSend).then(function (e) {
                            document.getElementById("jsonCreateSep2").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    }


                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }
            $scope.generateSepss = function (data) {
                var listRawRequired = [
                    "item.noCm|ng-model|Nomor CM",
                    "item.noKepesertaan|ng-model|Nomor kartu",
                    "item.tglSep|k-ng-model|Tanggal Sep",
                    // "item.noRujukan|ng-model|Nomor Rujukan",
                    "item.tglRujukan|k-ng-model|Tanggal Rujukan",
                    // "item.jenisPelayanan|ng-model|Jenis Pelayanan",
                    "item.poliTujuan|k-ng-model|Poli Tujuan",
                    "item.diagnosa|ng-model|Diagnosa Awal",
                    // "item.kelasRawat|ng-model|Kelas Rawat",
                    // "item.lakaLantas|ng-model|Laka Lantas",
                ];
                if ($scope.item.lakalantas === true) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjamin.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjamin[i].value
                        b = "," + c
                        a = a + b
                    }
                    var listPenjamin = a.slice(1, a.length)

                }
                var kdPpkRujukan = "";
                if ($scope.item.faskesRujukan == true) {
                    if ($scope.item.namaAsalRujukanBrid != undefined) {
                        var arrKdPpkRUjukanBrid = $scope.item.namaAsalRujukanBrid.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukanBrid[0];
                    }
                } else {
                    if ($scope.item.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                        kdPpkRujukan = arrKdPpkRUjukan[0];
                    }
                }
                var kdDiagnoosa = "";
                if ($scope.item.diagnosa != undefined) {
                    var arrkdDiag = $scope.item.diagnosa.split(' - ');
                    kdDiagnoosa = arrkdDiag[0];
                }


                var poliTujuans = ""
                if ($scope.item.poliTujuan != undefined) {
                    poliTujuans = $scope.item.poliTujuan.kdinternal
                }
                var kdPropinsi = ""
                if ($scope.item.propinsi != undefined)
                    kdPropinsi = $scope.item.propinsi.kode

                var kdKabupaten = ""
                if ($scope.item.kabupaten != undefined)
                    kdKabupaten = $scope.item.kabupaten.kode

                var kdKecamatan = ""
                if ($scope.item.kecamatan != undefined)
                    kdKecamatan = $scope.item.kecamatan.kode

                // if(data.lakaLantas.value === 1)
                //     listRawRequired.push("item.lokasiLaka|ng-model|Lokasi Laka Lantas");
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.isRouteLoading = true;

                    var dataUpdate = {
                        "nosep": $scope.item.noSep === undefined ? "" : $scope.item.noSep,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        // "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,

                    };


                    var dataInsert = {
                        "nokartu": $scope.item.noKepesertaan,
                        "tglsep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                        "jenispelayanan": $scope.item.jenisPelayanan.idjenispelayanan,
                        "kelasrawat": $scope.item.kelasRawat.value,
                        "nomr": $scope.item.noCm,
                        "asalrujukan": $scope.item.asalRujukan.value,
                        "tglrujukan": new moment($scope.item.tglRujukan).format('YYYY-MM-DD'),
                        "norujukan": $scope.item.noRujukan === undefined ? 0 : $scope.item.noRujukan,
                        "ppkrujukan": kdPpkRujukan,
                        "catatan": $scope.item.catatan === undefined ? "" : $scope.item.catatan,
                        "diagnosaawal": kdDiagnoosa,
                        "politujuan": poliTujuans,
                        "eksekutif": $scope.item.poliEksekutif.value,
                        "cob": $scope.item.cob === true ? "1" : "0",
                        "katarak": $scope.item.katarak === true ? "1" : "0",
                        "lakalantas": $scope.item.lakalantas === true ? "1" : "0",
                        "penjamin": listPenjamin,
                        "keterangan": $scope.item.keteranganLaka != undefined ? $scope.item.keteranganLaka : "",
                        "tglKejadian": new moment($scope.item.tglKejadian).format('YYYY-MM-DD'),
                        "suplesi": $scope.item.suplesi === true ? "1" : "0",
                        "noSepSuplesi": $scope.item.nomorSepSuplesi != undefined ? $scope.item.nomorSepSuplesi : "",
                        "kdPropinsi": kdPropinsi,
                        "kdKabupaten": kdKabupaten,
                        "kdKecamatan": kdKecamatan,
                        "noSurat": $scope.item.skdp != undefined ? $scope.item.skdp : "",
                        "kodeDPJP": $scope.item.dokterDPJP != undefined ? $scope.item.dokterDPJP.kode : "",
                        "notelp": $scope.item.noTelpon === undefined ? 0 : $scope.item.noTelpon,
                    };
                    if ($scope.status == 'Insert') {
                        medifirstService.postNonMessage("bridging/bpjs/insert-sep-v1.1", dataInsert).then(function (e) {
                            // manageServicePhp.generateSEP(dataGen).then(function (e) {
                            document.getElementById("jsonCreateSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    } else {
                        medifirstService.putNonMessage("bridging/bpjs/update-sep-v1.1", dataUpdate).then(function (e) {
                            document.getElementById("jsonCreateSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                            window.messageContainer.error(e.data.metaData.message)
                        }).then(function () {
                            $scope.isRouteLoading = false;
                        })
                    }


                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }


            $scope.getPpkRujukan = function () {
                if ($scope.item.namaAsalRujukanBrid.length >= 3) {
                    medifirstService.get("bridging/bpjs/get-ref-faskes?kdNamaFaskes="
                        + $scope.item.namaAsalRujukanBrid
                        + "&jenisFakses="
                        + "2"

                    )
                        .then(function (e) {
                            if (e.statResponse) {
                                if (e.data.metaData.code == 200) {
                                    var result = e.data.response.faskes;
                                    for (var x = 0; x < result.length; x++) {
                                        var element = result[x];
                                        element.nama = element.kode + ' - ' + element.nama
                                    }
                                    $scope.listPpkRujukan = result;
                                }
                            }

                        })
                }
            }

            $scope.getDiagnosa = function () {
                if ($scope.item.diagnosa.length >= 3) {
                    medifirstService.get("bridging/bpjs/get-ref-diagnosa?kdNamaDiagnosa="
                        + $scope.item.diagnosa
                    )
                        .then(function (e) {
                            if (e.data.metaData.code == 200) {
                                $scope.listDiagnosa = e.data.response.diagnosa;
                            }
                            document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                        })
                }
            }
            // *** END CREATE SEP

            // ** HAPUS SEP
            $scope.hapusDataSep = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.deleteNonMessage("bridging/bpjs/delete-sep?nosep=" + data).then(function (e) {
                    document.getElementById("jsonHapusSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                    if (e.data.metaData.code === "200") {
                        var msgLogging = 'DELETE No SEP ' + data + ' menggunakan menu BPJSTools'
                        medifirstService.postLogging('Pemakaian Asuransi', 'nosep pemakaianasuransi_t', data, msgLogging).then(function (res) { })
                        var arrStatus = {
                            noSep: data
                        }
                        medifirstService.postNonMessage('registrasi/hapus-sep', arrStatus).then(function (e) { })
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.cariSepIN = function (data) {
                $scope.isRouteLoading = true;

                let json = {
                    "url": "SEP/Internal/" + data.noSep,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonInt").innerHTML = JSON.stringify(e.data, undefined, 4);

                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.finger = {}
            $scope.cariFinger = function (data) {
                $scope.isRouteLoading = true;

                let json = {
                    "url": "SEP/FingerPrint/Peserta/" + data.noKa + "/TglPelayanan/" + moment(data.TglPelayanan).format('YYYY-MM-DD'),
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonFinger2").innerHTML = JSON.stringify(e.data, undefined, 4);

                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.cariListFinger = function (data) {
                $scope.isRouteLoading = true;

                let json = {
                    "url": "SEP/FingerPrint/List/Peserta/TglPelayanan/" + moment(data.TglPelayanan).format('YYYY-MM-DD'),
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonFinger").innerHTML = JSON.stringify(e.data, undefined, 4);

                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.cariSepIN2 = function (data) {
                $scope.isRouteLoading = true;

                let json = {
                    "url": "SEP/internal/delete",
                    "method": "DELETE",
                    "data": {
                        "request": {
                            "t_sep": {
                                "noSep": data.noSep,
                                "noSurat": data.noSurat,
                                "tglRujukanInternal": moment(data.tglRujukanInternal).format('YYYY-MM-DD'),
                                "kdPoliTuj": data.kdPoliTuj.kdinternal,
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonInt2").innerHTML = JSON.stringify(e.data, undefined, 4);

                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.hapusDataSep2 = function (data) {
                $scope.isRouteLoading = true;

                let json = {
                    "url": "SEP/2.0/delete",
                    "method": "DELETE",
                    "data": {
                        "request": {
                            "t_sep": {
                                "noSep": data,
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonHapusSep2").innerHTML = JSON.stringify(e.data, undefined, 4);
                    if (e.data.metaData.code === "200") {
                        var msgLogging = 'DELETE No SEP ' + data + ' menggunakan menu BPJSTools'
                        medifirstService.postLogging('Pemakaian Asuransi', 'nosep pemakaianasuransi_t', data, msgLogging).then(function (res) { })
                        var arrStatus = {
                            noSep: data
                        }
                        medifirstService.postNonMessage('registrasi/hapus-sep', arrStatus).then(function (e) { })
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // **

            // ** Cari SEP
            $scope.findDataBySep = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + data).then(function (e) {
                    document.getElementById("jsonCekSep").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // **

            // ** Cari SUPLESI
            $scope.findSuplesiKecelakaan = function (data) {
                let json = {
                    "url": "sep/KllInduk/List/" + data.noKartu,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    document.getElementById("jsonSuplesiJasa2").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.findSuplesi = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get("bridging/bpjs/get-suplesi-jasaraharja?noKartu=" + data.noKartu
                    + "&tglPelayanan=" + moment(data.tglSep).format('YYYY-MM-DD')).then(function (e) {
                        document.getElementById("jsonSuplesiJasa").innerHTML = JSON.stringify(e.data, undefined, 4);
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
            }
            // ** POST APROVAL
            $scope.postPengajuanSep = function () {
           
                if ($scope.approval.jenisPelayanan == undefined) return
                let json= {}
                if($scope.approval.jenisPengajuan!= undefined) {
                     json = {
                        "url": "Sep/aprovalSEP",
                        "method": "POST",
                        "data":
                        {
                            "request": {
                                "t_sep": {
                                    "noKartu": $scope.approval.noKepesertaan,
                                    "tglSep": moment($scope.approval.tglSep).format('YYYY-MM-DD'),
                                    "jnsPelayanan": $scope.approval.jenisPelayanan.idjenispelayanan,
                                    "jnsPengajuan": $scope.approval.jenisPengajuan.idjenispengajuan,
                                    "keterangan": $scope.approval.keterangan === undefined ? "" : $scope.approval.keterangan,
                                    "user": "Ramdanegie"
                                }
                            }
                        }
    
                    }
                }else{
                     json = {
                        "url": "Sep/aprovalSEP",
                        "method": "POST",
                        "data":
                        {
                            "request": {
                                "t_sep": {
                                    "noKartu": $scope.approval.noKepesertaan,
                                    "tglSep": moment($scope.approval.tglSep).format('YYYY-MM-DD'),
                                    "jnsPelayanan": $scope.approval.jenisPelayanan.idjenispelayanan,
                                    "keterangan": $scope.approval.keterangan === undefined ? "" : $scope.approval.keterangan,
                                    "user": "Ramdanegie"
                                }
                            }
                        }
    
                    }
                }
              
                // var dataGen = {
                //     nokartu: $scope.approval.noKepesertaan,
                //     tglsep: new moment($scope.approval.tglSep).format('YYYY-MM-DD'),
                //     jenispelayanan: $scope.approval.jenisPelayanan.idjenispelayanan,
                //     keterangan: $scope.approval.keterangan === undefined ? "" : $scope.approval.keterangan
                // };

                $scope.isRouteLoading = true;
                medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                    document.getElementById("jsonResApproval").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            $scope.postPengajuan = function () {
                if ($scope.pengajuan.jenisPelayanan == undefined) return
                if ($scope.pengajuan.jenisPengajuan == undefined) return
                let json = {
                    "url": "Sep/pengajuanSEP",
                    "method": "POST",
                    "data":
                    {
                        "request": {
                            "t_sep": {
                                "noKartu": $scope.pengajuan.noKepesertaan,
                                "tglSep": moment($scope.pengajuan.tglSep).format('YYYY-MM-DD'),
                                "jnsPelayanan": $scope.pengajuan.jenisPelayanan.idjenispelayanan,
                                "jnsPengajuan": $scope.pengajuan.jenisPengajuan.idjenispengajuan,
                                "keterangan": $scope.pengajuan.keterangan === undefined ? "" : $scope.pengajuan.keterangan,
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                $scope.isRouteLoading = true;
                // var dataGen = {
                //     nokartu: $scope.pengajuan.noKepesertaan,
                //     tglsep: new moment($scope.pengajuan.tglSep).format('YYYY-MM-DD'),
                //     jenispelayanan: $scope.pengajuan.jenisPelayanan.idjenispelayanan,
                //     keterangan: $scope.pengajuan.keterangan === undefined ? "" : $scope.approval.keterangan
                // };

                medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                    document.getElementById("jsonResApprovalPengajuan").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                })
            }
            // **update PULANG
            $scope.updateTglPulang = function (data) {
                $scope.isRouteLoading = true;
                // var dateGenerate = {
                //     nosep: data.noSep,
                //     tglpulang: new moment(data.tglPulang).format('YYYY-MM-DD')
                // }
                var dateGenerate = {
                    'data': {
                        "request":
                        {
                            "t_sep":
                            {
                                "noSep": data.noSep,
                                "tglPulang": new moment(data.tglPulang).format('YYYY-MM-DD'),
                                "user": "ramdan"
                            }
                        }

                    }
                }

                medifirstService.putNonMessage('bridging/bpjs/update-tglpulang', dateGenerate).then(function (e) {
                    document.getElementById("jsonTglPulang").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.updateTglPulang2 = function (data) {
                $scope.isRouteLoading = true;
                let json = {
                    "url": "SEP/2.0/updtglplg",
                    "method": "PUT",
                    "data": {
                        "request": {
                            "t_sep": {
                                "noSep": data.noSep,
                                "statusPulang": data.statusPulang != undefined ? data.statusPulang.id : "",
                                "noSuratMeninggal": data.statusPulang != undefined && data.statusPulang.id == 4 ? (data.noSuratMeninggal!=undefined?data.noSuratMeninggal:"")  : "",
                                "tglMeninggal": data.statusPulang != undefined && data.statusPulang.id == 4 ? moment(data.tglMeninggal).format('YYYY-MM-DD') : "",
                                "tglPulang": moment(data.tglPulang).format('YYYY-MM-DD'),
                                "noLPManual": data.statusPulang != undefined && data.statusPulang.id == 4 ? (data.noLPManual!=undefined?data.noLPManual:"") : "",
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }


                medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                    document.getElementById("jsonTglPulang2").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.IntegrasiInaCBG = function (data) {
                $scope.isRouteLoading = true;
                medifirstService.get('bridging/bpjs/get-integrasi-inacbg?noSEP=' + data).then(function (e) {
                    document.getElementById("jsonInteg").innerHTML = JSON.stringify(e.data, undefined, 4);
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.checkKepesertaanByNoSep = function () {
                if (!$scope.item.cekNomorSep) return;
                if ($scope.item.noSep === '' || $scope.item.noSep === undefined) return;
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.item.noSep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.item.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.item.namaPeserta = e.data.response.peserta.nama;
                        $scope.item.tglLahir = tglLahir;
                        $scope.item.noIdentitas = e.data.response.peserta.nik;
                        $scope.item.kelasBridg = {
                            id: parseInt(e.data.response.peserta.hakKelas.kode),
                            kdKelas: e.data.response.peserta.hakKelas.kode,
                            nmKelas: e.data.response.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.peserta.hakKelas.keterangan,
                        };

                        $scope.item.kelasRawat = { idkelas: $scope.item.kelasBridg.id, namakelas: $scope.item.kelasBridg.nmKelas }
                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.item.ppkRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;

                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });

                var arrKdPpkRUjukan = $scope.item.namaAsalRujukan.split(' - ');
                if (arrKdPpkRUjukan != undefined) {
                    var kdPpkRujukan = arrKdPpkRUjukan[0];
                    var namaPpkRujukan = arrKdPpkRUjukan[1];
                }

            }
            $scope.checkKepesertaanByNoReg = function () {
                if (!$scope.item.cekNoRegistrasi) return;
                if ($scope.item.noRegistrasi === '' || $scope.item.noRegistrasi === undefined) return;
                $scope.isLoadingNoReg = true;
                medifirstService.get("bridging/bpjs/get-sep-bynoregistrasi?noRegistrasi="
                    + $scope.item.noRegistrasi)
                    .then(function (dat) {
                        if (dat.data.data.length > 0) {
                            toastr.info('Sukses', 'Info')
                            $scope.item.noSep = dat.data.data[0].nosep;
                            $scope.item.noRujukan = dat.data.data[0].norujukan;
                            var tglRujukan = new Date(dat.data.data[0].tglrujukan)
                            $scope.item.tglRujukan = tglRujukan;
                            $scope.item.noCm = dat.data.data[0].nocm;
                            $scope.item.ppkRujukan = dat.data.data[0].kdprovider + " - " + dat.data.data[0].nmprovider;
                            // $scope.item.ppkRujukan=dat.data.data[0].nmprovider;
                            $scope.item.kdPpkRujukan = dat.data.data[0].kdprovider;

                            if (dat.data.data[0].israwatinap == 'true') {
                                isRawatInap = 'true';
                                $scope.item.jenisPelayanan = $scope.jenisPelayanan[0];
                            } else {
                                isRawatInap = 'false';
                                $scope.item.jenisPelayanan = $scope.jenisPelayanan[1];
                            }

                            $scope.ruangans = ([{ id: dat.data.data[0].objectruanganlastfk, namaruangan: dat.data.data[0].namaruangan }])
                            $scope.item.poliTujuan = {
                                id: dat.data.data[0].objectruanganlastfk,
                                namaruangan: dat.data.data[0].namaruangan,
                                kdinternal: dat.data.data[0].kdinternal
                            };
                            if (dat.data.data[0].jenispelayanan == "REGULER") {
                                $scope.item.poliEksekutif = $scope.poliEksekutif[1]
                            } else {
                                $scope.item.poliEksekutif = $scope.poliEksekutif[0]
                            }
                            // $scope.item.poliEksekutif={value:parseInt(dat.data.data[0].objectjenispelayananfk),eks:dat.data.data[0].jenispelayanan}

                            if (dat.data.data[0].namakelas == 'Kelas I') {
                                $scope.item.kelasRawat = $scope.kelasRawat[0];
                            } else if (dat.data.data[0].namakelas == 'Kelas II') {
                                $scope.item.kelasRawat = $scope.kelasRawat[1];
                            } else if (dat.data.data[0].namakelas == 'Kelas III') {
                                $scope.item.kelasRawat = $scope.kelasRawat[2];
                            } else {
                                $scope.item.kelasRawat = $scope.kelasRawat[2];
                            }

                            $scope.item.diagnosa = dat.data.data[0].kddiagnosa;
                            $scope.item.noTelp = dat.data.data[0].notelepon
                        } else
                            toastr.error('Data Tidak Ada', 'Info')

                        $scope.isLoadingNoReg = false;
                    }, function (err) {
                        $scope.isLoadingNoReg = false;
                    });

            }
            medifirstService.getPart("bridging/bpjs/get-ref-faskes", true, true, 10).then(function (data) {
                $scope.listFaskesRujukan = data;
            });

            // medifirstService.getPart("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + $scope.model.rawatInap == true ? "1" : "2"
            //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10, true, true, 10).then(function (data) {
            //         $scope.listDPJP = data;
            //     });

            medifirstService.getPart("bridging/bpjs/get-ref-propinsi", true, true, 10).then(function (data) {
                $scope.listPropinsi = data;
            });
            var kodePropinsi = "";
            var kodeKab = "";
            $scope.$watch('item.propinsi', function (e) {
                if (e === undefined) return;
                kodePropinsi = e.kode
                medifirstService.getPart("bridging/bpjs/get-ref-kabupaten?kodePropinsi=" + kodePropinsi, true, true, 10).then(function (data) {
                    $scope.listKabupaten = data;
                    if (dataKabupaten != '')
                        $scope.item.kabupaten = dataKabupaten
                });
            })

            $scope.$watch('item.kabupaten', function (e) {
                if (e === undefined) return;
                kodeKab = e.kode
                medifirstService.getPart("bridging/bpjs/get-ref-kecamatan?kodeKabupaten=" + kodeKab, true, true, 10).then(function (data) {
                    $scope.listKecamatan = data;
                    if (dataKecamatan != '')
                        $scope.item.kecamatan = dataKecamatan
                });
            })


        }
    ]);
});