define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict'
    initialize.controller('PemakaianAsuransiV2Ctrl', ['$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($scope, modelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {
            $scope.now = new Date();

            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            var dataKabupaten = '';
            var dataKecamatan = '';
            loadCombo()
            loadPertama();
            $scope.item = {};
            $scope.model = {};
            $scope.rujukan = {}
            $scope.model.tglSEP = $scope.now;
            var tanggals = dateHelper.getDateTimeFormatted3($scope.now);
            $scope.model.tglRujukan = tanggals + " 00:00";
            $scope.model.tglPelayanan = $scope.now;
            $scope.model.tglLakalantas = $scope.now;
            $scope.bpjs = true;
            $scope.isNext = true;
            $scope.isHapusSep = true;
            $scope.isBatal = true;
            $scope.isKembali = true;
            var cacheNoreg = '';
            var responData = "";
            var kdSpesialis = '';
            var jenisPel = ""
            var ppkRumahSakit = ""
            var namappkRumahSakit = ""
            var namafield = "kodePPKRujukan"
            var noRegistrasis = ""
            var statusBridgingTemporary = 'false'
            var ceknobpjsdouble = false;
            $scope.listDPJP = []
            $scope.listDPJP2 = []
            $scope.listAsalRujuk = [
                { id: 1, nama: 'Faskes 1', asalrujukan: 'Puskesmas', order: 1 },
                { id: 2, nama: 'Rumah Sakit', asalrujukan: 'Rumah sakit', order: 2 },
                { id: 7, nama: 'Pasca RI', asalrujukan: 'Pasca Rawat Inap', order: 3 }
            ]
            $scope.model.asalRujukan = $scope.listAsalRujuk[0].id
            $scope.listLakaLantas = [
                { id: "0", name: "Bukan Kecelakaan lalu lintas [BKLL]" },
                { id: "1", name: "KLL dan bukan kecelakaan Kerja [BKK]" },
                { id: "2", name: "KLL dan KK" },
                { id: "3", name: "KK" },
            ]
            $scope.captionRujukan = 'No Rujukan'
            // medifirstService.get('sysadmin/settingdatafixed/get/' + namafield).then(function (dat) {
            //     ppkRumahSakit = dat.data
            // })
            // medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
            //     namappkRumahSakit = dat.data
            // })
            // medifirstService.get('sysadmin/settingdatafixed/get/statusBridgingTemporary').then(function (dat) {
            //     statusBridgingTemporary = dat.data
            // })

            $scope.isShowLaka = false
            $scope.showLakaLantas = function () {
                $scope.isShowLaka = !$scope.isShowLaka;
            }

            $scope.listPenjaminLaka = [
                { "id": 12, "name": "Jasa Raharja PT", "value": 1 },
                { "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2 },
                { "id": 14, "name": "TASPEN PT", "value": 3 },
                { "id": 15, "name": "ASABRI PT", "value": 4 }
            ];
            $scope.listTujuan = [
                { id: "0", name: "Normal" },
                { id: "1", name: "Prosedur" },
                { id: "2", name: "Konsul Dokter" },
            ]
            $scope.listFlag = [
                {
                    id: "0", name: "Prosedur Tidak Berkelanjutan",
                    details: [
                        { id: "7", name: "Laboratorium" },
                        { id: "8", name: "USG" },
                        { id: "11", name: "MRI" },
                        { id: "9", name: "Farmasi" },
                        { id: "10", name: "Lain-Lain" },
                    ]
                },
                {
                    id: "1", name: "Prosedur dan Terapi Berkelanjutan",
                    details: [
                        { id: "1", name: "Radioterapi" },
                        { id: "2", name: "Kemoterapi" },
                        { id: "3", name: "Rehabilitasi Medik" },
                        { id: "4", name: "Rehabilitasi Psikososial" },
                        { id: "5", name: "Transfusi Darah" },
                        { id: "6", name: "Pelayanan Gigi" },
                        { id: "12", name: "HEMODIALISA" },
                    ]
                },
                // { id: "2", name: "Konsul Dokter" },
            ]
            $scope.changeFlag = function (items) {
                $scope.listPenunjang = items.details
            }
            // $scope.listPenunjang = [
            //     { id: "1", name: "Radioterapi" },
            //     { id: "2", name: "Kemoterapi" },
            //     { id: "3", name: "Rehabilitasi Medik" },
            //     { id: "4", name: "Rehabilitasi Psikososial" },
            //     { id: "5", name: "Transfusi Darah" },
            //     { id: "6", name: "Pelayanan Gigi" },
            //     { id: "7", name: "Laboratorium" },
            //     { id: "8", name: "USG" },
            //     { id: "9", name: "Farmasi" },
            //     { id: "10", name: "Lain-Lain" },
            //     { id: "11", name: "MRI" },
            //     { id: "12", name: "HEMODIALISA" },
            // ]

            $scope.listAsesmen = [
                { id: "1", name: "Poli spesialis tidak tersedia pada hari sebelumnya" },
                { id: "2", name: "Jam Poli telah berakhir pada hari sebelumnya" },
                { id: "3", name: "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
                { id: "4", name: "Atas Instruksi RS" },
                { id: "5", name: "Tujuan Kontrol" },
            ]

            $scope.listBiaya = [
                { "id": "1", "name": "Pribadi", "value": 1 },
                { "id": "2", "name": "Pemberi Kerja", "value": 2 },
                { "id": "3", "name": "Asuransi Kesehatan Tambahan", "value": 3 },
            ]
            $scope.ListAsuransi = [
                { "id": "1", "name": "No. SEP Otomatis" }
            ];
            // $scope.listLakaLantas = [
            //     { "id": "0", "name": "Tidak Lakalantas" },
            //     { "id": "1", "name": "Ya Lakalantas" }
            // ];
            var cacheAsalRujuk = ''
            $scope.model.tujuanKunj = $scope.listTujuan[0]
            $scope.model.lakalantas = $scope.listLakaLantas[0]
            $scope.isCheckSEP = true;
            // $scope.model.lakalantas = false;
            function loadCombo() {
                medifirstService.get("registrasi/get-combo-pemakaian-asuransi", true)
                    .then(function (dat) {
                        $scope.listAsalRujukan = dat.data.asalrujukan;
                        $scope.listKelompokPasien = dat.data.kelompokpasien;
                        $scope.sourceHubunganPasien = dat.data.hubunganpeserta;
                        $scope.sourceKelompokPasien = dat.data.kelompokpasien;
                        // $scope.sourceRekanan= dat.data.rekanan;
                        $scope.sourceKelasDitanggung = dat.data.kelas;
                        $scope.sourceAsalRujukan = dat.data.asalrujukan;
                        $scope.litKelasNaik = []
                        for (let x = 0; x < dat.data.kelas.length; x++) {
                            const element = dat.data.kelas[x];
                            if (element.kodebpjsnaikkelas != null) {
                                $scope.litKelasNaik.push(element)
                            }
                        }
                        // $scope.item.kelompokPasien={id:dat.data.kelompokpasien[1].id,kelompokpasien:dat.data.kelompokpasien[1].kelompokpasien}
                        // $scope.model.institusiAsalPasien={id:dat.data.rekanan[689].id,namarekanan:dat.data.rekanan[689].namarekanan}
                        $scope.model.hubunganPeserta = { id: dat.data.hubunganpeserta[2].id, hubunganpeserta: dat.data.hubunganpeserta[2].hubunganpeserta }
                        cacheAsalRujuk = cacheHelper.get('cacheAsalRujukan')
                        if (cacheAsalRujuk != '' && cacheAsalRujuk != undefined) {
                            $scope.model.asalRujukan = cacheAsalRujuk.id

                        } else {

                            $scope.model.asalRujukan = $scope.listAsalRujuk[0].id// { id: dat.data.asalrujukan[0].id, asalrujukan: dat.data.asalrujukan[0].asalrujukan }
                        }


                        ppkRumahSakit = dat.data.kodePPKRujukan;
                        namappkRumahSakit = dat.data.namaPPKRujukan;
                        statusBridgingTemporary = dat.data.statusBridgingTemporary;

                    });
            }

            function loadPertama() {

                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-pasien-bynorec?norec_pd="
                    + $scope.currentNorecPD
                    + "&norec_apd="
                    + $scope.currentNorecAPD)
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.item.pasien = e.data[0];
                        noRegistrasis = $scope.item.pasien.noregistrasi
                        $scope.item.pasien.tglregistrasi = moment(new Date($scope.item.pasien.tglregistrasi)).format('YYYY-MM-DD HH:mm')
                        $scope.item.pasien.tgllahir = moment(new Date($scope.item.pasien.tgllahir)).format('YYYY-MM-DD')

                        $scope.model.noTelpons = e.data[0].notelepon;
                        $scope.model.noKepesertaan = e.data[0].nobpjs;
                        $scope.model.noIdentitas = e.data[0].noidentitas;
                        $scope.listKelompokPasien = ([{ id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien }]);
                        $scope.item.kelompokPasien = { id: e.data[0].objectkelompokpasienlastfk, kelompokpasien: e.data[0].kelompokpasien };
                        $scope.sourceRekanan = ([{ id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }])
                        $scope.model.institusiAsalPasien = { id: e.data[0].objectrekananfk, namarekanan: e.data[0].namarekanan }
                        $scope.item.jenispelayanan = e.data[0].jenispelayanan;
                        if ($scope.item.jenispelayanan == "EKSEKUTIF") {
                            $scope.model.poliEksekutif = true;
                        }
                        else
                            $scope.model.poliEksekutif = false;
                        if (e.data[0].israwatinap == "true") {
                            $scope.model.rawatInap = true;
                            $scope.captionRujukan = 'No Rujukan'
                            jenisPel = "1"
                        } else {
                            $scope.model.rawatInap = false;
                            $scope.captionRujukan = 'No Rujukan'
                            jenisPel = "2"
                        }
                        kdSpesialis = $scope.item.pasien.kdinternal

                        // ** rujukan dari transdata eklikik
                        var cacheTransdata = cacheHelper.get('cacheRujukanTransdataPA');
                        if (cacheTransdata != undefined) {
                            $scope.model.noRujukan = cacheTransdata.norujukan
                            $scope.model.namaAsalRujukan = cacheTransdata.kodeppkasal + " - " + cacheTransdata.asalrujukan
                            if (cacheTransdata.kddiagnosa) {
                                medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + cacheTransdata.kddiagnosa, true, true, 10)
                                    .then(function (data) {
                                        $scope.sourceDiagnosa.add(data.data[0])
                                        $scope.model.diagnosa = data.data[0]
                                    })

                            }
                            cacheHelper.set('cacheRujukanTransdataPA', undefined);
                        }
                        // ** rujukan dari transdata eklikik                   
                        var cachePasienDaftar = cacheHelper.get('CachePemakaianAsuransi');

                        $scope.cachePasienDaftar = cacheHelper.get('CachePemakaianAsuransi');
                        if (cachePasienDaftar != undefined) {
                            var arrPasienDaftar = cachePasienDaftar.split('~');
                            if (arrPasienDaftar[0] == 'null' && arrPasienDaftar[1] == 'null') {
                                if ($scope.item.pasien.israwatinap == 'true') {
                                    $scope.model.asalRujukan = $scope.listAsalRujuk[1].id
                                    $scope.model.namaAsalRujukan = ppkRumahSakit + ' - ' + namappkRumahSakit
                                }
                                return
                            }
                            $scope.cacheIdAP = arrPasienDaftar[0];
                            $scope.cacheNorecPA = arrPasienDaftar[1];
                            cacheNoreg = arrPasienDaftar[2];
                            if ($scope.item.pasien.noregistrasi != cacheNoreg)
                                $scope.cacheNorecPA = undefined;
                            // $scope.generateSKDP(true)
                            getPemakaianAsuransiByNoReg($scope.cacheNorecPA)

                        } else {
                            // $scope.generateSKDP(true)
                            getPemakaianAsuransiByNoReg($scope.item.pasien.noregistrasi)

                        }
                    });
            }

            medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                $scope.sourceDiagnosa = data;

            });

            function getPemakaianAsuransiByNoReg(noreg) {
                medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi="
                    // +$scope.item.pasien.noregistrasi
                    + noreg
                )
                    .then(function (x) {
                        if (x.data.data.length > 0) {
                            $scope.cacheIdAP = x.data.data[0].norec_ap;
                            $scope.cacheNorecPA = x.data.data[0].norec;

                            $scope.model.noKepesertaan = x.data.data[0].nokepesertaan
                            $scope.model.namaPeserta = x.data.data[0].namapeserta
                            $scope.model.noIdentitas = x.data.data[0].noidentitas
                            // $scope.model.alamatPeserta ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            $scope.model.jenisPeserta = x.data.data[0].jenisPeserta
                            // $scope.model.noTelpons ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            $scope.model.hubunganPeserta = { id: x.data.data[0].objecthubunganpesertafk, hubunganpeserta: x.data.data[0].hubunganpeserta }
                            $scope.model.noSep = x.data.data[0].nosep
                            $scope.model.tglSEP = x.data.data[0].tanggalsep
                            // $scope.sourceKelasDitanggung = [{ id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }]
                            $scope.model.kelasDitanggung = { id: x.data.data[0].objectkelasdijaminfk, namakelas: x.data.data[0].namakelas }
                            $scope.model.catatan = x.data.data[0].catatan
                            $scope.model.noRujukan = x.data.data[0].norujukan
                            if (cacheAsalRujuk == undefined || cacheAsalRujuk == '') {
                                if (x.data.data[0].asalrujukanfk)
                                    $scope.model.asalRujukan = x.data.data[0].asalrujukanfk// { id: x.data.data[0].asalrujukanfk, asalrujukan: x.data.data[0].asalrujukan }
                            }

                            // $scope.model.asalRujukan ={id:x.data.data[0].objectkelompokpasienlastfk,kelompokpasien:x.data.data[0].kelompokpasien}
                            if ($scope.model.rawatInap == true) {
                                if (x.data.data[0].norujukan != null && x.data.data[0].norujukan != '') {
                                    $scope.model.noRujukan = x.data.data[0].norujukan
                                } else {
                                    $scope.model.noRujukan = $scope.model.skdp
                                }
                                $scope.model.namaAsalRujukan = ppkRumahSakit + " - " + namappkRumahSakit
                            } else {
                                $scope.model.namaAsalRujukan = x.data.data[0].kdprovider + " - " + x.data.data[0].nmprovider
                            }
                            $scope.model.tglRujukan = x.data.data[0].tglrujukan
                            if (x.data.data[0].objectdiagnosafk)
                                $scope.model.diagnosa = { id: x.data.data[0].objectdiagnosafk, kddiagnosa: x.data.data[0].kddiagnosa, nama: x.data.data[0].kddiagnosa + ' - ' + x.data.data[0].namadiagnosa }
                            $scope.model.tglLahir = x.data.data[0].tgllahir
                            $scope.item.kelompokPasien = { id: x.data.data[0].objectkelompokpasienlastfk, kelompokpasien: x.data.data[0].kelompokpasien }
                            // $scope.model.institusiAsalPasien ={id:x.data.data[0].kdpenjaminpasien,namarekanan:x.data.data[0].namarekanan}
                            $scope.model.institusiAsalPasien = { id: x.data.data[0].objectrekananfk, namarekanan: x.data.data[0].namarekananpd }
                            $scope.model.lokasiLakaLantas = x.data.data[0].lokasilakalantas
                            $scope.model.jenisPeserta = x.data.data[0].jenispeserta
                            if (x.data.data[0].kodedpjp) {
                                let resDpjp = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                                $scope.listDPJP.push(resDpjp);
                                $scope.model.dokterDPJP = { kode: x.data.data[0].kodedpjp, nama: x.data.data[0].namadpjp }
                            }
                            if (x.data.data[0].kodedpjpmelayani) {
                                let resDpjp = { kode: x.data.data[0].kodedpjpmelayani, nama: x.data.data[0].namadjpjpmelayanni }
                                $scope.listDPJP2.push(resDpjp);
                                $scope.model.DPJPMelayani = { kode: x.data.data[0].kodedpjpmelayani, nama: x.data.data[0].namadjpjpmelayanni }
                            }

                            if (x.data.data[0].lakalantas != null) {
                                // $scope.model.lakalantas = true
                                // if (result.lakalantas != 0) {
                                for (let z = 0; z < $scope.listLakaLantas.length; z++) {
                                    const element = $scope.listLakaLantas[z];
                                    if (element.id == x.data.data[0].lakalantas) {
                                        $scope.model.lakalantas = element
                                        break
                                    }
                                }
                                $scope.model.tglLakalantas = x.data.data[0].tglkejadian
                                if (x.data.data[0].kdpropinsi != null) {
                                    if ($scope.listPropinsi == undefined || $scope.listPropinsi.length == 0)
                                        $scope.listPropinsi = [{ kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi }];

                                    $scope.model.propinsi = { kode: x.data.data[0].kdpropinsi, nama: x.data.data[0].namapropinsi }
                                }
                                dataKabupaten = { kode: x.data.data[0].kdkabupaten, nama: x.data.data[0].namakabupaten }
                                dataKecamatan = { kode: x.data.data[0].kdkecamatan, nama: x.data.data[0].namakecamatan }
                                $scope.model.keteranganLaka = x.data.data[0].keteranganlaka
                                if (x.data.data[0].suplesi == true) {
                                    $scope.model.suplesi = true
                                    $scope.model.nomorSepSuplesi = x.data.data[0].nosepsuplesi
                                }
                            }

                            let resultD = x.data.data[0]
                            if (resultD.klsrawatnaik) {
                                $scope.model.naikKelas = true
                                for (let z = 0; z < $scope.litKelasNaik.length; z++) {
                                    const element = $scope.litKelasNaik[z];
                                    if (element.id == resultD.klsrawatnaik) {
                                        $scope.model.klsRawatNaik = element
                                        break
                                    }
                                }
                            }
                            if (resultD.pembiayaan) {
                                for (let z = 0; z < $scope.listBiaya.length; z++) {
                                    const element = $scope.listBiaya[z];
                                    if (element.id == resultD.pembiayaan) {
                                        $scope.model.pembiayaan = element
                                        break
                                    }
                                }
                            }
                            if (resultD.penanggungjawab) {
                                $scope.model.penanggungJawab = resultD.penanggungjawab
                            }
                            if (resultD.tujuankunj) {
                                for (let z = 0; z < $scope.listTujuan.length; z++) {
                                    const element = $scope.listTujuan[z];
                                    if (element.id == resultD.tujuankunj) {
                                        $scope.model.tujuanKunj = element
                                        break
                                    }
                                }
                            }
                            if (resultD.flagprocedure) {
                                for (let z = 0; z < $scope.listFlag.length; z++) {
                                    const element = $scope.listFlag[z];
                                    if (element.id == resultD.flagprocedure) {
                                        $scope.model.flagProcedure = element
                                        break
                                    }
                                }
                            }
                            if (resultD.kdpenunjang) {
                                for (let z = 0; z < $scope.listPenunjang.length; z++) {
                                    const element = $scope.listPenunjang[z];
                                    if (element.id == resultD.kdpenunjang) {
                                        $scope.model.kdPenunjang = element
                                        break
                                    }
                                }
                            }
                            if (resultD.assesmentpel) {
                                for (let z = 0; z < $scope.listAsesmen.length; z++) {
                                    const element = $scope.listAsesmen[z];
                                    if (element.id == resultD.assesmentpel) {
                                        $scope.model.assesmentPel = element
                                        break
                                    }
                                }
                            }
                            if (x.data.data[0].penjaminlaka != '' && x.data.data[0].penjaminlaka != null) {
                                var penjaminsLaka = x.data.data[0].penjaminlaka.split(',')
                                penjaminsLaka.forEach(function (data) {
                                    $scope.listPenjaminLaka.forEach(function (e) {
                                        if (e.value == data) {
                                            e.isChecked = true
                                            var dataid = {
                                                "id": e.id,
                                                "name": e.name,
                                                "value": data
                                            }
                                            $scope.currentListPenjaminLaka.push(dataid)
                                        }
                                    })
                                })
                            }
                            $scope.model.skdp = x.data.data[0].nosuratskdp
                            // $scope.model.dokterDPJP = x.data.data[0].cob
                            $scope.model.cob = x.data.data[0].cob
                            $scope.model.katarak = x.data.data[0].katarak
                            if (x.data.data[0].tglcreate)
                                $scope.model.tglcreate = x.data.data[0].tglcreate
                            if (x.data.data[0].statuskunjungan)
                                $scope.model.statuskunjungan = x.data.data[0].statuskunjungan
                            if (x.data.data[0].poliasalkode)
                                $scope.model.poliasalkode = x.data.data[0].poliasalkode
                            if (x.data.data[0].poliasalkode)
                                $scope.model.poliasalkode = x.data.data[0].poliasalkode
                        }
                    });
            }

            $scope.$watch('item.kelompokPasien', function (e) {
                if (e === undefined) return;
                medifirstService.get("registrasi/get-penjaminbykelompokpasien?kdKelompokPasien=" + e.id)
                    .then(function (z) {
                        $scope.sourceRekanan = z.data.rekanan;
                        if (e.kelompokpasien.indexOf('BPJS') >= -1 || e.kelompokpasien.toUpperCase().indexOf('JKN') >= -1 || e.kelompokpasien.toUpperCase().indexOf('KEMENKES') >= -1) {
                            $scope.model.institusiAsalPasien = { id: $scope.sourceRekanan[0].id, namarekanan: $scope.sourceRekanan[0].namarekanan };
                            $scope.isCheckSEP = true;
                            $scope.noBPJS = true;
                            $scope.asuransilain = false;
                            $scope.bpjs = true;
                        } else if (e.kelompokpasien == 'Umum/Pribadi') {
                            $scope.model.institusiAsalPasien = { id: $scope.sourceRekanan[0].id, namarekanan: $scope.sourceRekanan[0].namarekanan };
                            $scope.asuransilain = true;
                            $scope.bpjs = false;
                            $scope.isCheckSEP = false;
                            kosongkan()
                        }
                        else {
                            // $scope.model.institusiAsalPasien='';
                            $scope.model.sendiri = true;
                            $scope.Sendiri($scope.model.sendiri);
                            $scope.asuransilain = true;
                            $scope.bpjs = false;
                            $scope.isCheckSEP = false;
                            // kosongkan()
                        }

                    })
            });
            function kosongkan() {
                $scope.model.noKepesertaan = '';
                $scope.model.namaPeserta = '';
                $scope.model.noIdentitas = '';
                $scope.model.alamatPeserta = '';
                $scope.model.jenisPeserta = '';
                $scope.model.noTelpons = '';
                $scope.model.noSep = '';
                // $scope.model.tglsep='';
                // $scope.model.kelasDitanggung='';
                $scope.model.catatan = '';
                $scope.model.noRujukan = '';
                $scope.model.namaAsalRujukan = '';
                // $scope.model.tglRujukan='';
                // $scope.model.diagnosa='';
                $scope.model.lokasiLakaLantas = '';
            }

            $scope.Sendiri = function (data) {
                if (data === true) {
                    $scope.model.namaPeserta = $scope.item.pasien.namapasien;
                    $scope.model.tglLahir = new Date($scope.item.pasien.tgllahir)
                    $scope.model.noIdentitas = $scope.item.pasien.noidentitas;
                    $scope.model.alamatPeserta = $scope.item.pasien.alamatlengkap;
                    $scope.model.noKepesertaan = $scope.item.pasien.nobpjs;
                    $scope.model.noTelpons = $scope.item.pasien.notelepon;
                    $scope.model.noIdentitas = $scope.item.pasien.noidentitas;

                    $scope.kelasBpjs = false;
                    $scope.kelasPenjamin = true;
                } else {
                    $scope.model.noKepesertaan = "";
                    $scope.model.namaPeserta = "";
                    $scope.model.tglLahir = "";
                    $scope.model.noIdentitas = "";
                    $scope.model.alamatPeserta = "";
                    $scope.model.noTelpons = "";
                    $scope.model.noKepesertaan = "";
                    $scope.model.noIdentitas = "";


                    $scope.kelasBpjs = true;
                    $scope.kelasPenjamin = false;
                }
                $scope.disableSEP = data;
            };
            $scope.tutup = function () {
                $scope.popupRujukan.close()
            }
            $scope.klikNoRujukanMulti = function (data) {
                if (data != undefined) {
                    $scope.model.noRujukan = data.noKunjungan
                    $scope.model.tglRujukan = data.tglKunjungan
                    $scope.kodeProvider = data.provPerujuk.kode
                    $scope.namaProvider = data.provPerujuk.nama
                    $scope.model.faskesRujukan = false;
                    $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                }
            }
            $scope.setRujukan = function (data) {
                if (data != undefined) {
                    // $scope.model.noRujukan = data.noKunjungan
                    // $scope.model.tglRujukan = data.tglKunjungan
                    // $scope.kodeProvider = data.provPerujuk.kode
                    // $scope.namaProvider = data.provPerujuk.nama
                    // $scope.model.faskesRujukan = false;
                    // $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;

                    $scope.model.noRujukan = data.noKunjungan;
                    $scope.model.tglRujukan = new Date(data.tglKunjungan);
                    var tglLahir = new Date(data.peserta.tglLahir);
                    $scope.model.namaPeserta = data.peserta.nama;
                    $scope.model.tglLahir = tglLahir;
                    $scope.model.noIdentitas = data.peserta.nik;
                    $scope.model.kelasBridg = {
                        id: parseInt(data.peserta.hakKelas.kode),
                        kdKelas: data.peserta.hakKelas.kode,
                        nmKelas: data.peserta.hakKelas.keterangan,
                        namakelas: data.peserta.hakKelas.keterangan,
                    };
                    if ($scope.model.kelasBridg.id == 1) {
                        $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                    } else if ($scope.model.kelasBridg.id == 2) {
                        $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                    } else if ($scope.model.kelasBridg.id == 3) {
                        $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                    }
                    $scope.poliRujukanKode = data.poliRujukan.kode
                    $scope.poliRujukanNama = data.poliRujukan.nama
                    $scope.kodeProvider = data.provPerujuk.kode;
                    $scope.namaProvider = data.provPerujuk.nama;
                    $scope.model.faskesRujukan = false;
                    $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                    $scope.model.jenisPeserta = data.peserta.jenisPeserta.keterangan;
                    $scope.model.prolanis = data.peserta.informasi.prolanisPRB;
                    $scope.model.noTelpons = data.peserta.mr.noTelepon;
                    $scope.model.tglRujukan = new Date(data.tglKunjungan);

                    toastr.info(data.peserta.statusPeserta.keterangan, 'Status Peserta');

                    medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + data.diagnosa.kode, true, true, 10)
                        .then(function (xx) {
                            $scope.sourceDiagnosa.add(xx.data[0])
                            $scope.model.diagnosa = xx.data[0]
                        })
                    getDPJP($scope.poliRujukanKode, 1, 'all')

                    // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)

                    $scope.popupRujukan.close()
                }
            }

            function getDPJP(kdSpesialis, jenisPel, tipe) {
                let now = new moment($scope.now).format('YYYY-MM-DD')
                let json = {
                    "url": "referensi/dokter/pelayanan/" + jenisPel + "/tglPelayanan/" + now + "/Spesialis/" + kdSpesialis,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        if (tipe == 'all') {
                            $scope.listDPJP2 = e.data.response.list;
                            $scope.listDPJP = e.data.response.list;
                        }
                        if (tipe == '1') {
                            $scope.listDPJP = e.data.response.list;
                        }
                        if (tipe == '2') {
                            $scope.listDPJP2 = e.data.response.list;
                        }

                    }
                    else toastr.info('Dokter DPJP tidak ada', 'Info')
                })
            }
            $scope.Sendiria = function (data) {
                getDPJP(kdSpesialis, 1, '1')
            }
            $scope.Sendiriaa = function (data) {
                getDPJP(kdSpesialis, 1, '2')
            }
            $scope.columnNoRujukanMulti = {

                selectable: 'cell',
                pageable: true,
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noKunjungan",
                        "title": "Nomor Rujukan",
                        "width": "150px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setRujukan(dataItem)\"  style=\"margin:0 0 5px\">#:  noKunjungan #</button> ",

                    },
                    {
                        "field": "poliRujukan.nama",
                        "title": "Nama Poli",
                        "width": "120px",
                    },
                    {
                        "field": "tglKunjungan",
                        "title": "Tanggal Dirujuk",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.kode",
                        "title": "Kode Asal Rujukan",
                        "width": "100px"
                    },
                    {
                        "field": "provPerujuk.nama",
                        "title": "Kode Asal Rujukan",
                        "width": "200px"
                    },

                ]
            };
            function checkKepesertan() {
                if ($scope.model.cekNomorPeserta == true) {

                    if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                    if ($scope.model.rawatInap === true || $scope.item.pasien.kdinternal == "IGD") {
                        $scope.isLoadingNoKartu = true;
                        medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                var tglLahir = new Date(e.data.response.peserta.tglLahir);
                                $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                                $scope.model.namaPeserta = e.data.response.peserta.nama;
                                $scope.model.tglLahir = tglLahir;
                                $scope.model.noIdentitas = e.data.response.peserta.nik;
                                $scope.model.kelasBridg = {
                                    id: parseInt(e.data.response.peserta.hakKelas.kode),
                                    kdKelas: e.data.response.peserta.hakKelas.kode,
                                    nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                    namakelas: e.data.response.peserta.hakKelas.keterangan,
                                };
                                if ($scope.model.kelasBridg.id == 1) {
                                    $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                } else if ($scope.model.kelasBridg.id == 2) {
                                    $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                } else if ($scope.model.kelasBridg.id == 3) {
                                    $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                }
                                $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                                $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                                $scope.model.faskesRujukan = false;
                                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                                $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                                toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                                $scope.model.cobNama = e.data.response.peserta.cob.nmAsuransi;
                                var jenisFaskes = "rs"
                                if ($scope.model.asalRujukan != undefined) {
                                    if ($scope.model.asalRujukan == 1)
                                        jenisFaskes = "pcare"
                                    if ($scope.model.asalRujukan == 2)
                                        jenisFaskes = "rs"
                                }

                                getDPJP(kdSpesialis, 1, 'all')

                                // $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                            } else {
                                window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    } else {
                        var jenisFaskes = "rs"
                        if ($scope.model.asalRujukan != undefined) {
                            if ($scope.model.asalRujukan == 1)
                                jenisFaskes = "pcare"
                            if ($scope.model.asalRujukan == 2)
                                jenisFaskes = "rs"
                        }
                        $scope.isLoadingNoKartu = true
                        medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                var tglLahir = new Date(e.data.response.peserta.tglLahir);
                                $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                                $scope.model.namaPeserta = e.data.response.peserta.nama;
                                $scope.model.tglLahir = tglLahir;
                                $scope.model.noIdentitas = e.data.response.peserta.nik;
                                $scope.model.kelasBridg = {
                                    id: parseInt(e.data.response.peserta.hakKelas.kode),
                                    kdKelas: e.data.response.peserta.hakKelas.kode,
                                    nmKelas: e.data.response.peserta.hakKelas.keterangan,
                                    namakelas: e.data.response.peserta.hakKelas.keterangan,
                                };
                                if ($scope.model.kelasBridg.id == 1) {
                                    $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                } else if ($scope.model.kelasBridg.id == 2) {
                                    $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                } else if ($scope.model.kelasBridg.id == 3) {
                                    $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                }
                                $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                                $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                                $scope.model.faskesRujukan = false;
                                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                                $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                                toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                                var jenisFaskes = "rs"
                                if ($scope.model.asalRujukan != undefined) {
                                    if ($scope.model.asalRujukan == 1)
                                        jenisFaskes = "pcare"
                                    if ($scope.model.asalRujukan == 2)
                                        jenisFaskes = "rs"
                                }
                                getDPJP(kdSpesialis, 1, 'all')

                            } else {
                                window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                        medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                // polirujukanbpjs = e.data.response.rujukan.poliRujukan.kode;
                                $scope.model.noRujukan = e.data.response.rujukan.noKunjungan;
                                if (e.data.response.rujukan.tglKunjungan != moment($scope.model.tglSEP).format('YYYY-MM-DD')) {
                                   //$scope.model.tujuanKunj = $scope.listTujuan[2]
                                    //$scope.model.assesmentPel = $scope.listAsesmen[4]
                                }
                                $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);
                                var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                                $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                                $scope.model.tglLahir = tglLahir;
                                $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                                $scope.model.kelasBridg = {
                                    id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                                    kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                                    nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                    namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                                };
                                if ($scope.model.kelasBridg.id == 1) {
                                    $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                                } else if ($scope.model.kelasBridg.id == 2) {
                                    $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                                } else if ($scope.model.kelasBridg.id == 3) {
                                    $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                                }
                                $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                                $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                                $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                                $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                                $scope.model.faskesRujukan = false;
                                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                                $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                                $scope.model.prolanis = e.data.response.rujukan.peserta.informasi.prolanisPRB;
                                $scope.model.noTelpons = e.data.response.rujukan.peserta.mr.noTelepon;
                                $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);

                                medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                                    .then(function (data) {
                                        $scope.sourceDiagnosa.add(data.data[0])
                                        $scope.model.diagnosa = data.data[0]
                                    })

                                // get Dokter DPJP By Histori
                                $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)

                                // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                                //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" 
                                //     + kdSpesialis ).then(function (z) {
                                //         if (z.data.metaData.code == 200)
                                //             $scope.listDPJP = z.data.response.list;
                                //         else
                                //             toastr.info('Dokter DPJP tidak ada', 'Info')
                                // });

                                toastr.info(e.data.response.rujukan.noKunjungan, 'No Rujukan');
                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });

                    }
                } else if ($scope.model.cekNomorRujukanMulti == true) {
                    if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                    $scope.isLoadingNoKartu = true;
                    var jenisFaskes = "rs"
                    if ($scope.model.asalRujukan != undefined) {
                        if ($scope.model.asalRujukan == 1)
                            jenisFaskes = "pcare"
                        if ($scope.model.asalRujukan == 2)
                            jenisFaskes = "rs"
                    }
                    if ($scope.model.asalRujukan == 7) {
                        medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                // for (var i = 0; i < e.data.response.histori.length; i++) {
                                //     e.data.response.histori[i].no = i+1;
                                // };
                                // $scope.sourceHistoryPelayanan =  e.data.response.histori;
                                // $scope.popupHistoryPelayanan.center().open();
                                // $scope.showPilihNomor=true;

                                $scope.listHistori = e.data.response.histori;

                                for (let i = 0; i < e.data.response.histori.length; i++) {
                                    const element = e.data.response.histori[i];
                                    element.no = i + 1
                                }
                                $scope.popUpHistoriPelayananPeserta.center().open()
                                $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                                    data: e.data.response.histori,
                                    pageSize: 10,
                                    total: e.data.response.histori.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
                                            }
                                        }
                                    }
                                });


                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                                // window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    }
                    else {
                        medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu-multi?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                            if (e.data.metaData.code === "200") {
                                for (var i = 0; i < e.data.response.rujukan.length; i++) {
                                    e.data.response.rujukan[i].no = i + 1;
                                };
                                $scope.sourceNoRujukanMulti = new kendo.data.DataSource({
                                    data: e.data.response.rujukan,
                                    pageSize: 10,
                                    total: e.data.response.rujukan.length,
                                    serverPaging: false,
                                    schema: {
                                        model: {
                                            fields: {
                                            }
                                        }
                                    }
                                });
                                // $scope.sourceNoRujukanMulti =  e.data.response.rujukan;
                                $scope.popupRujukan.center().open();
                                $scope.showPilihNomor = true;

                            } else {
                                toastr.error(e.data.metaData.message, 'Info');
                                // window.messageContainer.error(e.data.metaData.message);
                            }
                            $scope.isLoadingNoKartu = false;
                        }, function (err) {
                            $scope.isLoadingNoKartu = false;
                        });
                    }
                }
            }

            $scope.checkKepesertaanByNoBpjs = function () {
                // if (!$scope.model.cekNomorPeserta) return;

                if ($scope.model.sendiri === true) return;
                if ($scope.model.noKepesertaan === '' || $scope.model.noKepesertaan === undefined) return;
                if ($scope.model.cekNomorPeserta == true || $scope.model.cekNomorRujukanMulti == true) {

                    ceknobpjsdouble = false
                    medifirstService.get("registrasi/cek-nobpjs?nobpjs=" + $scope.model.noKepesertaan + "&idnocm=" + $scope.item.pasien.nocmfk)
                        .then(function (data) {
                            $scope.ceks = data.data;
                            if ($scope.ceks.data.length >= 1) {

                                var nocm = $scope.ceks.data[0].nocm;
                                var nama = $scope.ceks.data[0].namapasien;
                                toastr.error("NO BPJS ini sudah di pakai oleh pasien RM : " + nocm + " (" + nama + ") !", "Peringatan")
                                ceknobpjsdouble = true
                                return;
                            } else {
                                checkKepesertan()
                            }
                        })
                }




                // medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.model.noKepesertaan + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                //     if (e.data.metaData.code === "200") {
                //         var tglLahir = new Date(e.data.response.peserta.tglLahir);
                //         $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                //         $scope.model.namaPeserta = e.data.response.peserta.nama;
                //         $scope.model.tglLahir = tglLahir;
                //         $scope.model.noIdentitas = e.data.response.peserta.nik;
                //         $scope.model.kelasBridg = {
                //             id: parseInt(e.data.response.peserta.hakKelas.kode),
                //             kdKelas: e.data.response.peserta.hakKelas.kode,
                //             nmKelas: e.data.response.peserta.hakKelas.keterangan,
                //             namakelas: e.data.response.peserta.hakKelas.keterangan,
                //         };
                //         if ($scope.model.kelasBridg.id == 1) {
                //             $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                //         } else if ($scope.model.kelasBridg.id == 2) {
                //             $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                //         } else if ($scope.model.kelasBridg.id == 3) {
                //             $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                //         }
                //         $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                //         $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                //         $scope.model.faskesRujukan = false;
                //         $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                //         $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.keterangan;
                //         $scope.model.prolanis = e.data.response.peserta.informasi.prolanisPRB;
                //         toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                //         var jenisFaskes = "rs"
                //         if ($scope.model.asalRujukan != undefined) {
                //             if ($scope.model.asalRujukan.id == 1)
                //                 jenisFaskes = "pcare"
                //             if ($scope.model.asalRujukan.id == 2)
                //                 jenisFaskes = "rs"

                //         }
                //         if ($scope.model.asalRujukan.id == 7) {
                //             medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + e.data.response.peserta.noKartu).then(function (data) {
                //                 if (data.data.metaData.code == 200) {
                //                     $scope.listHistori = data.data.response.histori;

                //                     for (let i = 0; i < data.data.response.histori.length; i++) {
                //                         const element = data.data.response.histori[i];
                //                         element.no = i + 1
                //                     }
                //                     $scope.popUpHistoriPelayananPeserta.center().open()
                //                     $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                //                         data: data.data.response.histori,
                //                         pageSize: 10,
                //                         total: data.data.response.histori.length,
                //                         serverPaging: false,
                //                         schema: {
                //                             model: {
                //                                 fields: {
                //                                 }
                //                             }
                //                         }
                //                     });
                //                 }
                //             })

                //         }

                //         medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "-nokartu?nokartu=" + $scope.model.noKepesertaan).then(function (e) {
                //             if (e.data.metaData.code === "200") {
                //                 $scope.model.noRujukan = e.data.response.rujukan.noKunjungan;
                //                 $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);
                //                 var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                //                 $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                //                 $scope.model.tglLahir = tglLahir;
                //                 $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                //                 $scope.model.kelasBridg = {
                //                     id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                //                     kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                //                     nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                //                     namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                //                 };
                //                 if ($scope.model.kelasBridg.id == 1) {
                //                     $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                //                 } else if ($scope.model.kelasBridg.id == 2) {
                //                     $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                //                 } else if ($scope.model.kelasBridg.id == 3) {
                //                     $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                //                 }
                //                 // debugger
                //                 $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                //                 $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                //                 $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                //                 $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                //                 $scope.model.faskesRujukan = false;
                //                 $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                //                 $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                //                 $scope.model.prolanis = e.data.response.rujukan.peserta.informasi.prolanisPRB;
                //                 $scope.model.noTelpons = e.data.response.rujukan.peserta.mr.noTelepon;
                //                 $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan);

                //                 medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                //                     .then(function (data) {
                //                         $scope.sourceDiagnosa.add(data.data[0])
                //                         $scope.model.diagnosa = data.data[0]
                //                     })

                //                 // get Dokter DPJP By Histori
                //                 $scope.getHistoriPelayananPesesta($scope.model.noKepesertaan)
                //                 // end Histori

                //                 // var kodespe = e.data.response.rujukan.poliRujukan.kode
                //                 // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                //                 //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kodespe).then(function (data) {
                //                 //         if (data.data.metaData.code == 200)
                //                 //             $scope.listDPJP = data.data.response.list;
                //                 //         else
                //                 //             toastr.info('Dokter DPJP tidak ada', 'Info')
                //                 //     });

                //                 toastr.info(e.data.response.rujukan.noKunjungan, 'No Rujukan');
                //             } else {
                //                 toastr.error(e.data.metaData.message, 'Info');
                //             }
                //         })
                //     } else {
                //         window.messageContainer.error(e.data.metaData.message);
                //     }
                //     $scope.isLoadingNoKartu = false;
                // }, function (err) {
                //     $scope.isLoadingNoKartu = false;
                // });



            }


            // check kepesertaan berdasarkan NIK
            $scope.checkKepesertaanByNik = function () {
                if (!$scope.model.cekNikPeserta) return;
                if (!$scope.model.noIdentitas) return;
                if ($scope.model.sendiri) return;
                if ($scope.model.noIdentitas.length > 16) {
                    window.messageContainer.error("NIK Lebih Dari 16 Digit");
                    return;
                }
                if ($scope.model.noIdentitas.length < 16) {
                    window.messageContainer.error("NIK Kurang Dari 16 Digit");
                    return;
                }

                $scope.isLoadingNIK = true;

                medifirstService.get("bridging/bpjs/get-nik?nik=" + $scope.model.noIdentitas + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.model.namaPeserta = e.data.response.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        $scope.model.noIdentitas = e.data.response.peserta.nik;
                        $scope.model.kelasBridg = {
                            id: parseInt(e.data.response.peserta.hakKelas.kode),
                            kdKelas: e.data.response.peserta.hakKelas.kode,
                            nmKelas: e.data.response.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.peserta.hakKelas.keterangan,
                        };

                        if ($scope.model.kelasBridg.id == 1) {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if ($scope.model.kelasBridg.id == 2) {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }

                        $scope.kodeProvider = e.data.response.peserta.provUmum.kdProvider;
                        $scope.namaProvider = e.data.response.peserta.provUmum.nmProvider;
                        $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                        $scope.model.jenisPeserta = e.data.response.peserta.jenisPeserta.nmJenisPeserta;
                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNIK = false;
                }, function (err) {
                    $scope.isLoadingNIK = false;
                });
            };

            $scope.checkDataRujukan = function () {
                if (!$scope.model.cekNomorRujukan) return;
                if (!$scope.model.noRujukan) return;
                if ($scope.model.sendiri) return;


                $scope.isLoadingRujukan = true;
                var jenisFaskes = "rs"
                if ($scope.model.asalRujukan != undefined) {
                    if ($scope.model.asalRujukan == 1)
                        jenisFaskes = "pcare"
                    if ($scope.model.asalRujukan == 2)
                        jenisFaskes = "rs"

                }
                medifirstService.get("bridging/bpjs/get-rujukan-" + jenisFaskes + "?norujukan=" + $scope.model.noRujukan).then(function (e) {
                    // debugger;
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.rujukan.peserta.tglLahir);
                        $scope.model.tglRujukan = new Date(e.data.response.rujukan.tglKunjungan)
                        $scope.model.noKepesertaan = $scope.noKartu = e.data.response.rujukan.peserta.noKartu;
                        $scope.model.namaPeserta = e.data.response.rujukan.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        $scope.model.noIdentitas = e.data.response.rujukan.peserta.nik;
                        $scope.model.kelasBridg = {
                            id: parseInt(e.data.response.rujukan.peserta.hakKelas.kode),
                            kdKelas: e.data.response.rujukan.peserta.hakKelas.kode,
                            nmKelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                            namakelas: e.data.response.rujukan.peserta.hakKelas.keterangan,
                        };
                        if ($scope.model.kelasBridg.id == 1) {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if ($scope.model.kelasBridg.id == 2) {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }
                        $scope.poliRujukanKode = e.data.response.rujukan.poliRujukan.kode
                        $scope.poliRujukanNama = e.data.response.rujukan.poliRujukan.nama
                        $scope.kodeProvider = e.data.response.rujukan.provPerujuk.kode;
                        $scope.namaProvider = e.data.response.rujukan.provPerujuk.nama;
                        $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                        $scope.model.jenisPeserta = e.data.response.rujukan.peserta.jenisPeserta.keterangan;
                        medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + e.data.response.rujukan.diagnosa.kode, true, true, 10)
                            .then(function (data) {
                                $scope.sourceDiagnosa.add(data.data[0])
                                $scope.model.diagnosa = data.data[0]
                            })

                        // get Dokter DPJP By Histori
                        $scope.getHistoriPelayananPesesta(e.data.response.rujukan.peserta.noKartu)
                        // end Histori

                        // var kodespe = e.data.response.rujukan.poliRujukan.kode
                        // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                        //     + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).then(function (data) {
                        //         if (data.data.metaData.code == 200)
                        //             $scope.listDPJP = data.data.response.list;
                        //         else
                        //             toastr.info('Dokter DPJP tidak ada', 'Info')
                        //     });

                        // $scope.sourceDiagnosa.add({ kddiagnosa: e.data.response.rujukan.diagnosa.kode });
                        // $scope.model.diagnosa = { kddiagnosa: e.data.response.rujukan.diagnosa.kode };
                        toastr.info(e.data.response.rujukan.peserta.statusPeserta.keterangan, 'Status Peserta');
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingRujukan = false;
                }, function (err) {
                    $scope.isLoadingRujukan = false;
                });
            };

            $scope.getHistoriPelayananPesesta = function (noKartu) {
                medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + noKartu).then(function (data) {
                    if (data.data.metaData.code == 200) {
                        $scope.listHistori = data.data.response.histori;

                        if ($scope.listHistori.length > 0) {
                            var countKunjungan = 0

                            for (let i = 0; i < $scope.listHistori.length; i++) {
                                if ($scope.model.noRujukan != undefined && $scope.model.noRujukan.length > 8
                                    && $scope.listHistori[i].noRujukan == $scope.model.noRujukan) {
                                    countKunjungan = countKunjungan + 1
                                }
                            }
                            var jml = 0
                            jml = countKunjungan + 1

                            toastr.info('Kunjungan ke- ' + jml + ' Dengan Rujukan yang sama.', 'Info')

                            jenisPel = $scope.listHistori[0].jnsPelayanan
                            var kodeNamaPoli = $scope.listHistori[0].poli.split(' ');
                            if (kodeNamaPoli.length > 0)
                                medifirstService.get("bridging/bpjs/get-poli?kodeNamaPoli=" + kodeNamaPoli[0]).then(function (e) {
                                    if (e.data.metaData.code == 200) {
                                        var resPoli = e.data.response.poli;
                                        if (resPoli.length > 0) {
                                            for (let i in resPoli) {
                                                if ($scope.listHistori[0].poli == resPoli[i].nama) {
                                                    kdSpesialis = resPoli[i].kode
                                                    break
                                                }
                                            }
                                            // var kodespe = e.data.response.rujukan.poliRujukan.kode
                                            if ($scope.item.pasien.kdinternal == "IGD") {
                                                jenisPel = "1"
                                            }
                                            getDPJP(kdSpesialis, jenisPel, 'all')

                                        }
                                    }

                                });
                        }
                    }
                    else
                        $scope.listHistori = []
                });
            }
            //delete sep
            $scope.DeleteSep = function () {
                hapusSep()
            }
            function hapusSep() {
                let json = {
                    "url": "SEP/2.0/delete",
                    "method": "DELETE",
                    "data": {
                        "request": {
                            "t_sep": {
                                "noSep": $scope.model.noSep,
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var msgLogging = 'DELETE No SEP ' + $scope.model.noSep + ' di No Registrasi ' + $scope.item.pasien.noregistrasi
                        medifirstService.postLogging('Pemakaian Asuransi', 'nosep pemakaianasuransi_t', $scope.model.noSep, msgLogging).then(function (res) { })
                        var arrStatus = {
                            noSep: $scope.model.noSep
                        }
                        medifirstService.postNonMessage('registrasi/hapus-sep', arrStatus).then(function (e) { })
                        window.messageContainer.log("Success Delete SEP");
                        $scope.model.generateNoSEP = false;
                        $scope.disableSEP = false;
                        $scope.model.noSep = '';
                    }
                    else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                })
            }

            // check kepesertaan berdasarkan SEP
            $scope.checkKepesertaanBySep = function () {

                if ($scope.model.sendiri) return;
                if ($scope.model.isCheckSEP) return;

                $scope.isLoadingSEP = true;
                if ($scope.model.noSep === "" || $scope.model.noSep === undefined) {
                    window.messageContainer.error("No SEP Tidak Ada");
                    return;
                }
                medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        $scope.disableSEP = true;
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.model.namaPeserta = e.data.response.peserta.nama;
                        $scope.model.tglLahir = tglLahir;
                        // $scope.model.noIdentitas = e.data.response.peserta.nik;

                        if (e.data.response.peserta.hakKelas == 'Kelas 1') {
                            $scope.model.kelasDitanggung = { id: "3", namakelas: 'Kelas I' }
                        } else if (e.data.response.peserta.hakKelas == 'Kelas 2') {
                            $scope.model.kelasDitanggung = { id: "2", namakelas: 'Kelas II' }
                        } else {
                            $scope.model.kelasDitanggung = { id: "1", namakelas: 'Kelas III' }
                        }
                        $scope.model.jenisPeserta = e.data.response.peserta.jnsPeserta;
                        $scope.model.noRujukan = e.data.response.noRujukan
                        // $scope.model.tglSEP = new Date(e.data.response.tglSep)
                        $scope.model.catatan = e.data.response.catatan
                        $scope.listDPJP2 = [{ kode: e.data.response.dpjp.kdDPJP, nama: e.data.response.dpjp.nmDPJP }]
                        $scope.listDPJP = [{ kode: e.data.response.kontrol.kdDokter, nama: e.data.response.kontrol.nmDokter }]
                        $scope.model.DPJPMelayani = { kode: e.data.response.dpjp.kdDPJP, nama: e.data.response.dpjp.nmDPJP }

                        $scope.model.dokterDPJP = { kode: e.data.response.kontrol.kdDokter, nama: e.data.response.kontrol.nmDokter }
                        $scope.model.skdp = e.data.response.kontrol.noSurat
                        medifirstService.get("registrasi/get-diagnosa-saeutik?namadiagnosa=" + e.data.response.diagnosa, true, true, 10)
                            .then(function (data) {
                                if (data.data.length > 0) {
                                    for (let i = 0; i < data.data.length; i++) {
                                        const element = data.data[i];
                                        if (element.namadiagnosa == e.data.response.diagnosa) {
                                            $scope.sourceDiagnosa.add(element)
                                            $scope.model.diagnosa = element
                                            break
                                        }
                                    }
                                }


                            })
                        // if (e.data.response.lakaLantas.status === "0") {
                        //     // magics will appear
                        // } else {
                        //     $scope.model.lakalantas = true;
                        //     $scope.model.lokasiLakaLantas = e.data.response.lakaLantasketerangan;
                        // }
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingSEP = false;
                }, function (err) {
                    $scope.isLoadingSEP = false;
                });
            };

            $scope.generateSEP = function () {

                if (!$scope.model.generateNoSEP) return;
                if ($scope.item.kelompokPasien.kelompokpasien.toLowerCase().indexOf('umum') > -1) {
                    toastr.error('Jaminan tidak sesuai')
                    return
                }
                var listRawRequired = [
                    "item.pasien.namaruangan|k-ng-model|Ruangan",
                    // "item.asalRujukan|ng-model|Asal Rujukan",
                    "item.kelompokPasien|ng-model|Kelompok Pasien",
                    // "item.pegawai|ng-model|Dokter Tidak ada jadwal hari ini",
                    // "model.namaPenjamin|k-ng-model|Nama Penjamin",
                    "model.institusiAsalPasien|ng-model|Institusi Asal Pasien",
                    "model.noKepesertaan|ng-model|No Kepesertaan",
                    "model.asalRujukan|k-ng-model|Asal Rujukan",
                    // "model.noRujukan|ng-model|No Rujukan",
                    "model.tglRujukan|ng-model|Tgl Rujukan",
                    "model.diagnosa|k-ng-model|Diagnosa",
                    "model.kelasDitanggung|k-ng-model|Kelas ditanggung"
                ];

                var isValid = modelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var kelasJaminan;
                    // if ($scope.model.rawatInap == false) {
                    //     kelasJaminan = "3";
                    // } else {
                    // if ($scope.model.kelasBridg != undefined) {
                    //     kelasJaminan = $scope.model.kelasBridg.id.toString();
                    // } else {
                    if ($scope.model.kelasDitanggung != undefined) {
                        if ($scope.model.kelasDitanggung.id == "1")
                            kelasJaminan = "3"
                        if ($scope.model.kelasDitanggung.id == "2")
                            kelasJaminan = "2"
                        if ($scope.model.kelasDitanggung.id == "3")
                            kelasJaminan = "1"
                    }
                    else
                        kelasJaminan = "3"
                    // }
                    // }
                    var naikKelasHak = ""
                    if ($scope.model.klsRawatNaik != undefined) {
                        naikKelasHak = $scope.model.klsRawatNaik.kodebpjsnaikkelas
                    }
                    var noKartu = "";
                    if ($scope.model.noKepesertaan != undefined) {
                        var noKartu = $scope.model.noKepesertaan;
                    } else {
                        var noKartu = '';
                    }

                    var kdJenisPelayanan = "";
                    if ($scope.model.rawatInap === true)
                        kdJenisPelayanan = "1";
                    else
                        kdJenisPelayanan = "2";

                    var kddiagnosaawal = "";
                    if ($scope.model.diagnosa != undefined)
                        kddiagnosaawal = $scope.model.diagnosa.kddiagnosa;
                    else
                        kddiagnosaawal = "";

                    var catatan = "";
                    if ($scope.model.catatan != undefined)
                        catatan = $scope.model.catatan;
                    else
                        catatan = "";

                    var polisEksekutif = "";
                    if ($scope.model.poliEksekutif)
                        polisEksekutif = "1"
                    else
                        polisEksekutif = "0"

                    var lokasiLakaLantas = "";
                    if ($scope.model.lokasiLakaLantas != undefined)
                        lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                    else
                        lokasiLakaLantas = "";


                    var noTelp = "";
                    if ($scope.model.noTelpons != undefined)
                        noTelp = $scope.model.noTelpons;
                    else
                        noTelp = "";

                    var KdAsalRujukan = $scope.model.asalRujukan;
                    // if ($scope.model.asalRujukan != undefined) {
                    //     if ($scope.model.asalRujukan.asalrujukan === "Puskesmas") {
                    //         KdAsalRujukan = "1"
                    //     }
                    //     else {
                    //         KdAsalRujukan = "2"
                    //     }
                    // }

                    var kdPpkRujukan = "";
                    if ($scope.model.faskesRujukan == true) {
                        if ($scope.model.namaAsalRujukanBrid != undefined) {
                            kdPpkRujukan = $scope.model.namaAsalRujukanBrid.kode;
                        }
                    } else {
                        if ($scope.model.namaAsalRujukan != undefined) {
                            var arrKdPpkRUjukan = $scope.model.namaAsalRujukan.split(' - ');
                            kdPpkRujukan = arrKdPpkRUjukan[0];
                        }
                    }


                    // 0904R004
                    var poliTujuans = "";
                    if ($scope.item.pasien.kdinternal != null)
                        poliTujuans = $scope.item.pasien.kdinternal;
                    else
                        poliTujuans = "";

                    var listPenjaminLakas = ""
                    if ($scope.model.lakalantas != undefined) {
                        var a = ""
                        var b = ""
                        for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                            var c = $scope.currentListPenjaminLaka[i].value
                            b = "," + c
                            a = a + b
                        }
                        listPenjaminLakas = a.slice(1, a.length)
                    }
                    var kdPropinsi = ""
                    if ($scope.model.propinsi != undefined)
                        kdPropinsi = $scope.model.propinsi.kode

                    var kdKabupaten = ""
                    if ($scope.model.kabupaten != undefined)
                        kdKabupaten = $scope.model.kabupaten.kode

                    var kdKecamatan = ""
                    if ($scope.model.kecamatan != undefined)
                        kdKecamatan = $scope.model.kecamatan.kode





                    $scope.isSimpan = true;
                    //##Generate SEP
                    if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                        var dataSend = {
                            "url": "SEP/2.0/insert",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "t_sep": {
                                        "noKartu": noKartu,
                                        "tglSep": new moment($scope.model.tglSEP).format('YYYY-MM-DD'),
                                        "ppkPelayanan": ppkRumahSakit.trim(),
                                        "jnsPelayanan": kdJenisPelayanan,
                                        "klsRawat": {
                                            "klsRawatHak": kelasJaminan,
                                            "klsRawatNaik": naikKelasHak,
                                            "pembiayaan": $scope.model.pembiayaan ? $scope.model.pembiayaan.id : "",
                                            "penanggungJawab": $scope.model.penanggungJawab ? $scope.model.penanggungJawab : ""
                                        },
                                        "noMR": $scope.item.pasien.nocm,
                                        "rujukan": {
                                            "asalRujukan": KdAsalRujukan,
                                            "tglRujukan": new moment($scope.model.tglRujukan).format('YYYY-MM-DD'),
                                            "noRujukan": $scope.model.noRujukan === undefined ? "" : $scope.model.noRujukan,
                                            "ppkRujukan": kdPpkRujukan
                                        },
                                        "catatan": catatan,
                                        "diagAwal": kddiagnosaawal,
                                        "poli": {
                                            "tujuan": poliTujuans,
                                            "eksekutif": polisEksekutif
                                        },
                                        "cob": {
                                            "cob": $scope.model.cob === true ? "1" : "0"
                                        },
                                        "katarak": {
                                            "katarak": $scope.model.katarak === true ? "1" : "0"
                                        },
                                        "jaminan": {
                                            "lakaLantas": $scope.model.lakalantas ? $scope.model.lakalantas.id : "0",
                                            "noLP":"",
                                            "penjamin": {
                                                "tglKejadian": $scope.model.lakalantas && $scope.model.lakalantas.id != 0 ? moment($scope.model.tglLakalantas).format('YYYY-MM-DD') : "",
                                                "keterangan": $scope.model.keteranganLaka ? $scope.model.keteranganLaka : "",
                                                "suplesi": {
                                                    "suplesi": $scope.model.suplesi === true ? "1" : "0",
                                                    "noSepSuplesi": $scope.model.nomorSepSuplesi ? $scope.model.nomorSepSuplesi : "",
                                                    "lokasiLaka": {
                                                        "kdPropinsi": kdPropinsi,
                                                        "kdKabupaten": kdKabupaten,
                                                        "kdKecamatan": kdKecamatan
                                                    }
                                                }
                                            }
                                        },
                                        "tujuanKunj": $scope.model.tujuanKunj ? $scope.model.tujuanKunj.id : "",
                                        "flagProcedure": $scope.model.flagProcedure ? $scope.model.flagProcedure.id : "",
                                        "kdPenunjang": $scope.model.kdPenunjang ? $scope.model.kdPenunjang.id : "",
                                        "assesmentPel": $scope.model.assesmentPel ? $scope.model.assesmentPel.id : "",
                                        "skdp": {
                                            "noSurat": $scope.model.skdp ? $scope.model.skdp : "",
                                            "kodeDPJP": $scope.model.dokterDPJP ? $scope.model.dokterDPJP.kode : ""
                                        },
                                        "dpjpLayan": $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.kode : "",
                                        "noTelp": noTelp,
                                        "user": "Ramdanegie"
                                    }
                                }
                            }
                        }

                        medifirstService.postNonMessage("bridging/bpjs/tools", dataSend).then(function (e) {
                            if (e.data.metaData.code == "200") {
                                $scope.successGenerateSep = e.data.metaData.code;
                                $scope.model.noSep = e.data.response.sep.noSep;
                                $scope.model.generateNoSEP = false;
                                $scope.disableSEP = true;
                                $scope.isHapusSep = true;
                                toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                                $scope.SimpanNonGenerate('bridging');
                                $scope.isSimpan = false;
                            } else {
                                $scope.isSimpan = false;
                                // $scope.isNext = false;
                                window.messageContainer.error(e.data.metaData.message)
                            }
                            $scope.isLoadingRujukan = false;
                        }, function (err) {
                            $scope.isLoadingRujukan = false;
                        });
                    }
                    //## Update SEP
                    else if ($scope.model.noSep != undefined) {
                        if ($scope.model.noSep.length > 10) {
                            var dataUpdate = {
                                "url": "SEP/2.0/update",
                                "method": "PUT",
                                "data": {
                                    "request": {
                                        "t_sep": {
                                            "noSep": $scope.model.noSep == undefined ? "" : $scope.model.noSep,
                                            "klsRawat": {
                                                "klsRawatHak": kelasJaminan,
                                                "klsRawatNaik": naikKelasHak,
                                                "pembiayaan": $scope.model.pembiayaan ? $scope.model.pembiayaan.id : "",
                                                "penanggungJawab": $scope.model.penanggungJawab ? $scope.model.penanggungJawab : ""
                                            },
                                            "noMR": $scope.item.pasien.nocm,
                                            "catatan": catatan,
                                            "diagAwal": kddiagnosaawal,
                                            "poli": {
                                                "tujuan": poliTujuans,
                                                "eksekutif": polisEksekutif
                                            },
                                            "cob": {
                                                "cob": $scope.model.cob === true ? "1" : "0"
                                            },
                                            "katarak": {
                                                "katarak": $scope.model.katarak === true ? "1" : "0"
                                            },
                                            "jaminan": {
                                                "lakaLantas": $scope.model.lakalantas ? $scope.model.lakalantas.id : "0",
                                                "penjamin": {
                                                    "tglKejadian": $scope.model.lakalantas && $scope.model.lakalantas.id != 0 ? moment($scope.model.tglLakalantas).format('YYYY-MM-DD') : "",
                                                    "keterangan": $scope.model.keteranganLaka ? $scope.model.keteranganLaka : "",
                                                    "suplesi": {
                                                        "suplesi": $scope.model.suplesi === true ? "1" : "0",
                                                        "noSepSuplesi": $scope.model.nomorSepSuplesi ? $scope.model.nomorSepSuplesi : "",
                                                        "lokasiLaka": {
                                                            "kdPropinsi": kdPropinsi,
                                                            "kdKabupaten": kdKabupaten,
                                                            "kdKecamatan": kdKecamatan
                                                        }
                                                    }
                                                }
                                            },
                                            "dpjpLayan": $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.kode : "",
                                            "noTelp": noTelp,
                                            "user": "Ramdanegie"
                                        }
                                    }
                                }
                            }
                            medifirstService.postNonMessage("bridging/bpjs/tools", dataUpdate).then(function (e) {
                                if (e.data.metaData.code == "200") {

                                    $scope.successGenerateSep = e.data.metaData.code;
                                    if (e.data.response != null) {
                                        $scope.model.noSep = e.data.response;
                                    }
                                    $scope.model.generateNoSEP = false;
                                    $scope.disableSEP = true;
                                    $scope.isHapusSep = true;
                                    toastr.success('Update SEP Success', 'Status');
                                    $scope.SimpanNonGenerate('bridging');
                                    $scope.isSimpan = false;
                                } else {
                                    // $scope.isNext = false;
                                    window.messageContainer.error(e.data.metaData.message)
                                    $scope.isSimpan = false;
                                }
                                $scope.isLoadingRujukan = false;
                            }, function (err) {
                                $scope.isLoadingRujukan = false;
                            });
                        }
                        //## End Update SEP
                    }
                }
            };

            $scope.SimpanNonGenerate = function (statusCreateSep) {

                $scope.hideBtnSimpan = true
                var noasuransi = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noasuransi = '';
                } else
                    noasuransi = $scope.model.noKepesertaan;

                var noidentitas = "";
                if ($scope.model.noIdentitas == undefined) {
                    noidentitas = '';
                } else
                    noidentitas = $scope.model.noIdentitas;

                var diagnosisfk = null;
                if ($scope.model.diagnosa == undefined) {
                    diagnosisfk = null;
                } else
                    diagnosisfk = $scope.model.diagnosa.id;

                var norujukan = "";
                if ($scope.model.noRujukan == undefined) {
                    norujukan = '';
                } else
                    norujukan = $scope.model.noRujukan;

                var noKepesertaans = "";
                if ($scope.model.noKepesertaan == undefined) {
                    noKepesertaans = '';
                } else
                    noKepesertaans = $scope.model.noKepesertaan;

                var nosep = "";
                if ($scope.model.noSep == undefined) {
                    nosep = '';
                } else
                    nosep = $scope.model.noSep;

                var tanggalsep = "";
                if ($scope.model.tglSEP == undefined) {
                    tanggalsep = null;
                } else
                    tanggalsep = new moment($scope.model.tglSEP).format('YYYY-MM-DD HH:mm:ss');;

                var tglRujukan = "";
                if ($scope.model.tglRujukan == undefined) {
                    tglRujukan = '';
                } else
                    tglRujukan = new moment($scope.model.tglRujukan).format('YYYY-MM-DD HH:mm:ss');


                var noCM = "";
                if ($scope.item.pasien.nocm == undefined)
                    noCM = ''
                else
                    noCM = $scope.item.pasien.nocm

                var catatans = "";
                if ($scope.model.catatan == undefined) {
                    catatans = '';
                } else
                    catatans = $scope.model.catatan;

                var kdProviders = "-";
                var namaProviders = "-";
                if ($scope.model.faskesRujukan == true) {
                    if ($scope.model.namaAsalRujukanBrid != undefined) {
                        kdProviders = $scope.model.namaAsalRujukanBrid.kode
                        namaProviders = $scope.model.namaAsalRujukanBrid.nama
                    }
                } else {
                    if ($scope.model.namaAsalRujukan != undefined) {
                        var arrKdPpkRUjukan = $scope.model.namaAsalRujukan.split(' - ');
                        kdProviders = arrKdPpkRUjukan[0];
                        namaProviders = arrKdPpkRUjukan[1];
                    }
                }

                if (namaProviders == undefined) {
                    namaProviders = "-";
                }

                medifirstService.get("registrasi/get-asuransipasienbynocm?nocm="
                    + $scope.item.pasien.nocm)
                    .then(function (f) {
                        $scope.cekTableAsuransiPas = f.data.data[0];
                    });

                // debugger
                var id_AsPasien = "";
                if ($scope.cacheIdAP != undefined) {
                    id_AsPasien = $scope.cacheIdAP;
                }
                if (id_AsPasien == "null") {
                    id_AsPasien = ""
                }

                var norec_PA = "";

                if ($scope.cacheNorecPA != undefined) {
                    norec_PA = $scope.cacheNorecPA;
                }
                if (norec_PA == "null") {
                    norec_PA = ""
                }


                var alamatPesertas = "";
                if ($scope.model.alamatPeserta != undefined)
                    alamatPesertas = $scope.model.alamatPeserta;

                var kelasDitanggungs = null;
                if ($scope.model.kelasDitanggung != undefined)
                    kelasDitanggungs = $scope.model.kelasDitanggung.id;


                if ($scope.model.institusiAsalPasien == undefined) {
                    window.messageContainer.error("Institusi Asal Pasien harus di isi")
                    return
                }

                var namaPesertas = "";
                if ($scope.model.namaPeserta != undefined)
                    namaPesertas = $scope.model.namaPeserta;

                var jenisPesertas = "";
                if ($scope.model.jenisPeserta != undefined)
                    jenisPesertas = $scope.model.jenisPeserta;
                var lokasiLakaLantas = "";
                if ($scope.model.lokasiLakaLantas != undefined)
                    lokasiLakaLantas = $scope.model.lokasiLakaLantas;
                else
                    lokasiLakaLantas = "";

                var listPenjaminLakas = ""
                if ($scope.model.lakalantas) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = "," + c
                        a = a + b
                    }
                    listPenjaminLakas = a.slice(1, a.length)
                }

                var noTelp = "";
                if ($scope.model.noTelpons != undefined)
                    noTelp = $scope.model.noTelpons;
                var jenisPeserta = ""
                if ($scope.model.jenisPeserta != undefined)
                    jenisPeserta = $scope.model.jenisPeserta

                var asuransipasien = {
                    id_ap: id_AsPasien,
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    nocm: noCM,
                    alamatlengkap: alamatPesertas,
                    objecthubunganpesertafk: $scope.model.hubunganPeserta.id,
                    objectjeniskelaminfk: $scope.item.pasien.objectjeniskelaminfk,
                    kdinstitusiasal: $scope.model.institusiAsalPasien.id,
                    kdpenjaminpasien: $scope.model.institusiAsalPasien.id,
                    objectkelasdijaminfk: kelasDitanggungs,
                    namapeserta: namaPesertas,
                    nikinstitusiasal: $scope.model.institusiAsalPasien.id,
                    noasuransi: noasuransi,
                    alamat: $scope.item.pasien.alamatlengkap,
                    nocmfkpasien: $scope.item.pasien.nocmfk,
                    noidentitas: noidentitas,
                    qasuransi: $scope.item.kelompokPasien.id,
                    kelompokpasien: $scope.item.kelompokPasien.id,
                    tgllahir: $scope.model.tglLahir != undefined ? moment($scope.model.tglLahir).format('YYYY-MM-DD') : null,
                    jenispeserta: jenisPesertas,
                    kdprovider: kdProviders,
                    nmprovider: namaProviders,
                    notelpmobile: noTelp,
                    jenispeserta: jenisPeserta,
                }

                var pemakaianasuransi = {
                    norec_pa: norec_PA,
                    noregistrasifk: $scope.currentNorecPD,
                    tglregistrasi: $scope.item.pasien.tglregistrasi,
                    diagnosisfk: diagnosisfk,
                    lakalantas: $scope.model.lakalantas ? $scope.model.lakalantas.id : "0",
                    nokepesertaan: noKepesertaans,
                    norujukan: norujukan,
                    nosep: nosep,
                    tglrujukan: tglRujukan,
                    // objectasuransipasienfk: $scope.model.noKepesertaan,
                    objectdiagnosafk: diagnosisfk,
                    tanggalsep: tanggalsep,
                    catatan: catatans,
                    lokasilaka: lokasiLakaLantas,
                    penjaminlaka: listPenjaminLakas,
                    cob: $scope.model.cob ? $scope.model.cob : false,
                    katarak: $scope.model.katarak ? $scope.model.katarak : false,
                    keteranganlaka: $scope.model.keteranganLaka ? $scope.model.keteranganLaka : "",
                    tglkejadian: $scope.model.lakalantas != undefined && $scope.model.lakalantas.id != 0 && $scope.model.tglLakalantas ? moment($scope.model.tglLakalantas).format("YYYY-MM-DD") : null,
                    suplesi: $scope.model.suplesi ? $scope.model.suplesi : false,
                    nosepsuplesi: $scope.model.nomorSepSuplesi ? $scope.model.nomorSepSuplesi : "",
                    kdpropinsi: $scope.model.propinsi ? $scope.model.propinsi.kode : null,
                    namapropinsi: $scope.model.propinsi ? $scope.model.propinsi.nama : null,
                    kdkabupaten: $scope.model.kabupaten ? $scope.model.kabupaten.kode : null,
                    namakabupaten: $scope.model.kabupaten ? $scope.model.kabupaten.nama : null,
                    kdkecamatan: $scope.model.kecamatan ? $scope.model.kecamatan.kode : null,
                    namakecamatan: $scope.model.kecamatan ? $scope.model.kecamatan.nama : null,
                    nosuratskdp: $scope.model.skdp ? $scope.model.skdp : "",
                    kodedpjp: $scope.model.dokterDPJP ? $scope.model.dokterDPJP.kode : null,
                    namadpjp: $scope.model.dokterDPJP ? $scope.model.dokterDPJP.nama : null,
                    prolanisprb: $scope.model.prolanis ? $scope.model.prolanis : null,
                    asalrujukanfk: $scope.model.asalRujukan ? $scope.model.asalRujukan : null,
                    polirujukankode: $scope.item.pasien.kdinternal,
                    polirujukannama: $scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    kodedpjpmelayani: $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.kode : null,
                    namadjpjpmelayanni: $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.nama : null,

                    klsrawatnaik: $scope.model.klsRawatNaik ? $scope.model.klsRawatNaik.id : null,
                    pembiayaan: $scope.model.pembiayaan ? $scope.model.pembiayaan.id : null,
                    penanggungjawab: $scope.model.penanggungJawab ? $scope.model.penanggungJawab : null,
                    tujuankunj: $scope.model.tujuanKunj ? $scope.model.tujuanKunj.id : null,
                    flagprocedure: $scope.model.flagProcedure ? $scope.model.flagProcedure.id : null,
                    kdpenunjang: $scope.model.kdPenunjang ? $scope.model.kdPenunjang.id : null,
                    assesmentpel: $scope.model.assesmentPel ? $scope.model.assesmentPel.id : null,
                    statuskunjungan: $scope.model.statuskunjungan ? $scope.model.statuskunjungan : null,
                    poliasalkode: $scope.model.poliasalkode ? $scope.model.poliasalkode : null,
                    politujuankode: $scope.model.politujuankode ? $scope.model.politujuankode : null,
                }
                var objSave = {
                    asuransipasien: asuransipasien,
                    pemakaianasuransi: pemakaianasuransi
                }
                medifirstService.post("registrasi/save-asuransipasien", objSave).then(function (e) {
                    var msgLogging = ""
                    var lognosep = nosep
                    if (nosep == "") {
                        statusCreateSep = 'manual'
                        lognosep = "kosong"
                    }
                    if (norec_PA == "") {
                        msgLogging = "INSERT ";
                    } else {
                        msgLogging = "UPDATE ";
                    }
                    msgLogging += 'No SEP ' + nosep + ' dibuat ' + statusCreateSep + ' dengan tgl sep ' + tanggalsep + ' di No Registrasi ' + $scope.item.pasien.noregistrasi
                    medifirstService.postLogging('Pemakaian Asuransi', 'Norec pasiendaftar_t', $scope.currentNorecPD, msgLogging).then(function (res) { })

                    responData = e.data;
                    $scope.resultPA = e.data.PA;
                    $scope.model.tglcreate = e.data.PA.tglcreate;
                    $scope.isBatal = true;
                    $scope.isKembali = true;


                    var cachePasienDaftars = $scope.resultPA.objectasuransipasienfk
                        + "~" + $scope.resultPA.norec
                        + "~" + $scope.item.pasien.noregistrasi;
                    cacheHelper.set('CachePemakaianAsuransi', cachePasienDaftars);

                    if (e.data.status == 201 && $scope.cachePasienDaftar == undefined) {
                        $scope.Back();
                        $scope.hideBtnSimpan = false
                    } else {
                        $scope.hideBtnSimpan = false
                    }

                }, function (error) {
                    $scope.hideBtnSimpan = false
                })
            }

            $scope.Save = function () {
                if (ceknobpjsdouble == true) {
                    toastr.error('No BPJS Terdeteksi Double, Sesuaikan No BPJS dengan pasiennya', 'Peringatan')
                    return;
                }
                if ($scope.poliRujukanKode != undefined && $scope.item.pasien.kdinternal != $scope.poliRujukanKode) {
                    $scope.model.politujuankode = $scope.item.pasien.namaruangan
                    $scope.model.poliasalkode = $scope.poliRujukanNama
                    $scope.model.statuskunjungan = 2
                }


                if ($scope.model.generateNoSEP) {

                    if (statusBridgingTemporary == 'false') {

                        if ($scope.poliRujukanKode != undefined && $scope.item.pasien.kdinternal != $scope.poliRujukanKode) {
                            var confirm = $mdDialog.confirm()
                                .title('Informasi')
                                .textContent('Pasien Kontrol ? Jika ya maka poli yg dikirim ke BPJS = ' + $scope.item.pasien.namaruangan
                                    + ', jika tidak maka ' + $scope.poliRujukanNama)
                                .ariaLabel('Lucky day')
                                .cancel('Tidak')
                                .ok('Ya')
                            $mdDialog.show(confirm).then(function (e) {
                                // alert('COnfirm')


                                $scope.generateSEP();
                            }, function () {
                                // alert('cancel')

                                $scope.item.pasien.kdinternal = $scope.poliRujukanKode
                                $scope.item.pasien.namaruangan = $scope.poliRujukanNama
                                $scope.generateSEP();
                            });

                        } else {
                            $scope.generateSEP();
                        }

                    } else {
                        /*
                        * dummy SEP
                        */
                        $scope.createDummySEP()

                    }
                } else {
                    $scope.SimpanNonGenerate('manual');
                }
            }
            $scope.createDummySEP = function () {
                if ($scope.model.noSep == '' || $scope.model.noSep == undefined) {
                    medifirstService.get('bridging/bpjs/generate-sep-dummy?kodeppk=' + ppkRumahSakit).then(function (e) {
                        // debugger
                        $scope.successGenerateSep = 200;
                        $scope.model.noSep = e.data;
                        $scope.model.generateNoSEP = false;
                        $scope.disableSEP = true;
                        $scope.isHapusSep = true;
                        toastr.success('Generate SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                        $scope.SimpanNonGenerate('bridging-dummy');
                    })
                } else {
                    $scope.successGenerateSep = 200;
                    // $scope.model.noSep = e.data;
                    $scope.model.generateNoSEP = false;
                    $scope.disableSEP = true;
                    $scope.isHapusSep = true;
                    toastr.success('Update SEP Success. No SEP : ' + $scope.model.noSep, 'Status');
                    $scope.SimpanNonGenerate('bridging-dummy');
                }

            }
            $scope.Back = function () {
                // window.history.back();

                // $state.go('RegistrasiPasienLamaRev');
            }


            $scope.cekLaka = function (bool) {
                if (bool) {
                    let json = {
                        "url": "referensi/propinsi",
                        "method": "GET",
                        "data": null
                    }
                    $scope.listPropinsi = []
                    medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                        if (e.data.metaData.code == 200) {
                            $scope.listPropinsi = e.data.response.list;
                        }
                    })
                }
            }
            let prov = {
                "url": "referensi/propinsi",
                "method": "GET",
                "data": null
            }
            $scope.listPropinsi = []
            medifirstService.postNonMessage("bridging/bpjs/tools", prov).then(function (e) {
                if (e.data.metaData.code == 200) {
                    $scope.listPropinsi = e.data.response.list;;
                }
            });


            // medifirstService.getPart("bridging/bpjs/get-ref-propinsi", true, true, 10).then(function (data) {
            //     $scope.listPropinsi = data;
            // });
            var kodePropinsi = "";
            var kodeKab = "";
            $scope.$watch('model.propinsi', function (e) {
                if (e === undefined) return;
                kodePropinsi = e.kode
                let json = {
                    "url": "referensi/kabupaten/propinsi/" + e.kode,
                    "method": "GET",
                    "data": null
                }
                $scope.listKabupaten = []
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listKabupaten = e.data.response.list;
                        if (dataKabupaten != '')
                            $scope.model.kabupaten = dataKabupaten
                    }
                })

            })

            $scope.$watch('model.kabupaten', function (e) {
                if (e === undefined) return;
                kodeKab = e.kode
                let json = {
                    "url": "referensi/kecamatan/kabupaten/" + e.kode,
                    "method": "GET",
                    "data": null
                }
                $scope.listKecamatan = []
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listKecamatan = e.data.response.list;
                        if (dataKecamatan != '')
                            $scope.model.kecamatan = dataKecamatan
                    }
                })
            })
            $scope.$watch('model.lakalantas', function (e) {
                if (e === false) {
                    delete $scope.model.propinsi
                    delete $scope.model.kabupaten
                    delete $scope.model.kecamatan
                    delete $scope.model.nomorSepSuplesi
                    delete $scope.model.keteranganLaka
                    // // remove item
                    // $scope.currentListPenjaminLaka.forEach(function (item) {
                    //     for (var i = 0; i < $scope.currentListPenjaminLaka.length; i++) {
                    //         if ($scope.currentListPenjaminLaka[i].id == item.id) {
                    //             $scope.currentListPenjaminLaka.splice(i, 1);
                    //         }
                    //     }
                    // })
                    // $scope.listPenjaminLaka.forEach(function (e) {
                    //     e.isChecked = false
                    // })

                }
            })

            // medifirstService.getDataDummyPHP("bridging/bpjs/get-ref-faskes-part", true, true, 10).then(function (data) {
            //     $scope.listPpkRujukan = data;

            // });
            // $scope.$watch('model.asalRujukan', function (e) {
            //     if (e === undefined) return;
            //     var jenis = ""
            //     if (e == 1)
            //         jenis = 1
            //     else if (e == 2)
            //         jenis = 2
            //     else if (e == 3)
            //         jenis = 1
            //     else
            //         jenis = 2
            //     medifirstService.getPart("bridging/bpjs/get-ref-faskes-part?jenisFaskes="
            //         + jenis, true, 10, 10)
            //         .then(function (x) {
            //             $scope.listPpkRujukan = x;
            //         })

            // })
            $scope.currentListPenjaminLaka = [];
            $scope.addListPenjamin = function (data) {
                var index = $scope.currentListPenjaminLaka.indexOf(data);
                if (_.filter($scope.currentListPenjaminLaka, {
                    id: data.id
                }).length === 0)
                    $scope.currentListPenjaminLaka.push(data);
                else {
                    $scope.currentListPenjaminLaka.splice(index, 1);
                }
            }
            $scope.generateSKDP = function (data) {
                if (data === true) {
                    $scope.model.cekNoSkdp = true
                    var tglAwal = moment(new Date()).format('YYYY-MM-DD')
                    var tglAkhir = moment(new Date()).format('YYYY-MM-DD')

                    let json = {
                        "url": "RencanaKontrol/ListRencanaKontrol/tglAwal/" + tglAwal + "/tglAkhir/" + tglAkhir + "/filter/2",
                        "method": "GET",
                        "data": null
                    }

                    medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                        var dataKon = []
                        if (e.data.metaData.code == 200) {
                            for (var i = e.data.response.list.length - 1; i >= 0; i--) {
                                const element = e.data.response.list[i]
                                if ($scope.model.noKepesertaan == element.noKartu) {
                                    dataKon.push(element)
                                }

                            }
                            $scope.popUpRSPRI.center().open()

                        } else toastr.info(e.data.metaData.message, 'Rencana Kontrol/SPRI')
                        if (dataKon.length > 0) {
                            for (let x = 0; x < dataKon.length; x++) {
                                const element = dataKon[x];
                                element.no = x + 1
                            }
                        }

                        $scope.dataSourceSPRI = new kendo.data.DataSource({
                            data: dataKon,
                            pageSize: 10,
                            serverPaging: false,
                        });
                    })

                } else {
                    // delete $scope.model.skdp
                }
            };
            $scope.ceklisNoKartu = function (bool) {
                // body...
                if (bool) {
                    $scope.model.generateNoSEP = true
                    $scope.model.cekNomorRujukanMulti = false
                }
                else
                    $scope.model.generateNoSEP = false
            }
            $scope.ceklisNomorRujukanMulti = function (bool) {
                if (bool) {
                    $scope.model.generateNoSEP = true
                    $scope.model.cekNomorPeserta = false
                    checkKepesertan()
                }
                else
                    $scope.model.generateNoSEP = false
            }

            $scope.cetakSEP = function () {
                if (noRegistrasis != "") {

                    // //##save identifikasi sep
                    // medifirstService.get("operator/identifikasi-sep?norec_pd="
                    //     + $scope.cacheNorecPD
                    // ).then(function (data) {
                    //     var datas = data.data;
                    // })
                    // //##end


                    if (statusBridgingTemporary == 'false') {
                        medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.model.noSep).then(function (e) {
                            if (e.data.metaData.code === "200" || e.data.metaData.code === "404") {
                                // var client = new HttpClient();
                                // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + noRegistrasis + '&view=false', function (response) {
                                //     // do something with response
                                // });
                                cetakSEP()
                            } else {
                                window.messageContainer.error('SEP tidak ada atau tidak sesuai dengan Vclaim mohon dicek kembali !');
                            }
                        });
                    } else {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + noRegistrasis + '&view=false', function (response) {
                            // do something with response
                        });

                    }

                }
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
            $scope.columnHistoriPeserta = {

                selectable: 'cell',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "noSep",
                        "title": "No SEP",
                        "width": "130px",

                        "template": "<button class=\"k-button custom-button\" ng-click=\"setSep(dataItem)\"  style=\"margin:0 0 5px\">#:  noSep #</button> ",

                    },
                    {
                        "field": "tglSep",
                        "title": "Tgl SEP",
                        "width": "100px"
                    },
                    {
                        "field": "noRujukan",
                        "title": "No Rujukan",
                        "width": "90px"
                    },
                    {
                        "field": "noKartu",
                        "title": "No Kartu",
                        "width": "90px"
                    },
                    {
                        "field": "namaPeserta",
                        "title": "Nama Pasien",
                        "width": "90px"
                    },
                    {
                        "field": "kelasRawat",
                        "title": "Kelas",
                        "width": "90px"
                    },
                    {
                        "field": "poli",
                        "title": "Poli",
                        "width": "90px"
                    },
                    {
                        "field": "diagnosa",
                        "title": "Diagnosa",
                        "width": "150px"
                    },

                ]
            };


            $scope.setSep = function (dataHistorySelect) {
                $scope.model.noRujukan = dataHistorySelect.noSep
                $scope.kodeProvider = ppkRumahSakit
                $scope.namaProvider = namappkRumahSakit
                $scope.model.faskesRujukan = false;
                $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
                $scope.popUpHistoriPelayananPeserta.close()
                //     // $scope.dataHistorySelect = dataHistorySelect
            }
            $scope.historiPelayanan = function (data) {
                if (data === true) {
                    if ($scope.model.noKepesertaan == undefined) return
                    medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.model.noKepesertaan).then(function (data) {
                        if (data.data.metaData.code == 200) {
                            for (let i = 0; i < data.data.response.histori.length; i++) {
                                const element = data.data.response.histori[i];
                                element.no = i + 1
                            }
                            $scope.popUpHistoriPelayananPeserta.center().open()
                            $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                                data: data.data.response.histori,
                                pageSize: 10,
                                total: data.data.response.histori.length,
                                serverPaging: false,
                                schema: {
                                    model: {
                                        fields: {
                                        }
                                    }
                                }
                            });
                        }
                    })
                } else {
                    $scope.popUpHistoriPelayananPeserta.close()
                    $scope.dataSourceHistoriPeserta = new kendo.data.DataSource({
                        data: [],
                        pageSize: 10,
                        total: 0,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                }

            };

            $scope.comboBoxOptions = {
                placeholder: "ketik minimal 3 karakter",
                dataTextField: "nama",
                autoBind: "false",
                minLength: 3,
                dataValuetField: "id",
                filter: "contains",
                filtering: function (e) {
                    getFaskes($scope.combobox.text());
                }
            }

            function getFaskes(nama) {
                if (nama.length < 3) return
                if ($scope.model.asalRujukan == undefined) return
                let json = {
                    "url": "referensi/faskes/" + nama + "/" + $scope.model.asalRujukan,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listPpkRujukan = e.data.response.faskes;
                    } else toastr.info(e.data.metaData.message, 'Info')
                })
            }

            $scope.comboBoxOptions = {
                placeholder: "ketik minimal 3 karakter",
                dataTextField: "nama",
                autoBind: "false",
                minLength: 3,
                dataValuetField: "id",
                filter: "contains",
                filtering: function (e) {
                    getFaskes($scope.combobox.text());
                }
            }

            function getFaskes(nama) {
                if (nama.length < 3) return
                if ($scope.model.asalRujukan == undefined) return
                let json = {
                    "url": "referensi/faskes/" + nama + "/" + $scope.model.asalRujukan,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listPpkRujukan = e.data.response.faskes;
                    } else toastr.info(e.data.metaData.message, 'Info')
                })
            }
            function cetakSEP() {
                //onCetakSEP($('#lblnosep').html());
                var nosep = $scope.model.noSep
                var nmperujuk = $scope.model.namaAsalRujukan.split(" - ")[1]

                var tglsep = moment($scope.model.tglSEP).format('YYYY-MM-DD')
                var nokartu = $scope.model.noKepesertaan + '  ( MR. ' + $scope.item.pasien.nocm + ' )';
                var nmpst = $scope.item.pasien.namapasien
                var tgllahir = $scope.item.pasien.tgllahir
                var jnskelamin = $scope.item.pasien.objectjeniskelaminfk == '1' ? '  Kelamin : Laki-Laki' : '  Kelamin :Perempuan';
                var poli = $scope.item.pasien.israwatinap == 'true' ? '-' : $scope.item.pasien.namaruangan;
                var faskesperujuk = $scope.item.pasien.israwatinap == 'true' ? namappkRumahSakit : nmperujuk;
                var notelp = $scope.model.noTelpons
                var dxawal = $scope.model.diagnosa.nama.substring(0, 45);
                var catatan = $scope.model.catatan
                var jnspst = $scope.model.jenisPeserta
                var FLAGCOB = $scope.model.cob
                var cob = '-';
                if (FLAGCOB) {
                    cob = $scope.model.cobNama ? $scope.model.cobNama : null
                }

                //cob non aktif
                var FLAGNAIKKELAS = $scope.model.naikKelas == true ? '1' : '0'
                var klsrawat_naik = $scope.model.klsRawatNaik ? $scope.model.klsRawatNaik.namakelas : ""

                var jnsrawat = $scope.item.pasien.israwatinap == 'true' ? 'R.Inap' : 'R.Jalan';
                var klsrawat = $scope.model.kelasDitanggung ? $scope.model.kelasDitanggung.namakelas : '-';
                var prolanis = $scope.model.prolanis ? $scope.model.prolanis : ""
                var eksekutif = $scope.item.pasien.israwatinap == 'true' ? '' : $scope.model.poliEksekutif == true ? ' (Poli Eksekutif)' : '';
                //var penjaminJR = $('#chkjaminan_JR').is(":checked") == true ? 'Jasa Raharja PT' : '';
                //var penjaminTK = $('#chkjaminan_BPJSTK').is(":checked") == true ? 'BPJS Ketenagakerjaan' : '';
                //var penjaminTP = $('#chkjaminan_TASPEN').is(":checked") == true ? 'PT TASPEN' : '';
                //var penjaminAS = $('#chkjaminan_ASABRI').is(":checked") == true ? 'ASABRI' : '';
                var katarak = $scope.model.katarak == true ? '1' : '0';
                var potensiprb = $scope.model.prolanis ? $scope.model.prolanis : ""
                var statuskll = $scope.model.lakalantas ? $scope.model.lakalantas.id : ""
                var _kodejaminan = '-';
                if ($scope.model.lakalantas) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = ";" + c
                        a = a + b
                    }
                    _kodejaminan = a.slice(1, a.length)
                }
                var dokter = ($scope.item.pasien.israwatinap == 'true') ? ($scope.model.dokterDPJP ? $scope.model.dokterDPJP.nama : "") : $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.nama : "";
                var FLAGPROSEDUR = $scope.model.flagProcedure ? $scope.model.flagProcedure.id : null

                var kunjungan = 0;
                if ($scope.item.pasien.israwatinap == 'true') {
                    kunjungan = 3
                } else if ($scope.model.statuskunjungan) {
                    kunjungan = $scope.model.statuskunjungan
                } else {
                    kunjungan = 1
                }

                var isrujukanthalasemia_hemofilia = 0

                if ($scope.item.pasien.kdinternal == 'UGD' || $scope.item.pasien.kdinternal == 'IGD') {
                    nmperujuk = '';
                    kunjungan = 0;
                    FLAGPROSEDUR = null;
                }
                var poliPerujuk = '-'
                if ($scope.model.poliasalkode) {
                    poliPerujuk = $scope.model.poliasalkode
                }

                //var sepdate = new Date(tglsep);
                //var currDate = new Date(dataSEP.sep.sep.FDATE);
                //var backdate = sepdate < new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()) ? " (BACKDATE)" : "";

                var backdate = cekBackdate(tglsep, $scope.model.tglcreate ? $scope.model.tglcreate : tglsep);
                var ispotensiHEMOFILIA_cetak = 0
                cetakanSEP(nosep + backdate, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, jnspst, cob, jnsrawat, klsrawat,
                    prolanis, eksekutif, _kodejaminan, statuskll, katarak, potensiprb, dokter, kunjungan, FLAGPROSEDUR, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik, isrujukanthalasemia_hemofilia, ispotensiHEMOFILIA_cetak);


            }
            function nmPenjaminan(id) {
                var ret = '';
                switch (id) {
                    case '1':
                        ret = 'Jasa Raharja PT';
                        break;
                    case '2':
                        ret = 'BPJS Ketenagakerjaan';
                        break;
                    case '3':
                        ret = 'TASPEN';
                        break;
                    case '4':
                        ret = 'ASABRI';
                        break;
                }
                return ret;
            }
            function cekBackdate(tglsep, fdate) {
                var sepdate = new Date(tglsep);
                var currDate = new Date(fdate);
                var backdate = sepdate < new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()) ? " (BACKDATE)" : "";
                return backdate;
            }
            function _nmstatuskll(id) {
                var ret = '';
                switch (id) {
                    case '1':
                        ret = '*Peserta Mengalami Kecelakaan lalulintas,penjaminan akan dikoordinasikan RS';
                        break;
                    case '2':
                        ret = '*Peserta Mengalami Kecelakaan lalulintas dan kerja, penjaminan akan dikoordinasikan RS';
                        break;
                    case '3':
                        ret = '*Peserta Mengalami Kecelakaan kerja, penjaminan akan dikoordinasikan RS';
                        break;
                }
                return ret;
            }

            function cetakanSEP(nosep, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, jnspst, cob, jnsrawat, klsrawat,
                prolanis, eksekutif, penjamin, statuskll, katarak, potensiprb, dokter, kunjungan, berkelanjutan, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik, is_rujukanThalasemia_Hemofilia, ispotensiHEMOFILIA_cetak) {


                var cetakan = 1;
                //---------------------
                //jspdfctk(nosep, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, jnspst, cob, jnsrawat, klsrawat,
                //    prolanis, eksekutif, penjamin, statuskll, katarak, potensiprb, cetakan);

                medifirstService.jspdfSEP(nosep, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan,
                    jnspst, cob, jnsrawat, klsrawat, prolanis, eksekutif, penjamin, statuskll, katarak, potensiprb, cetakan, dokter, kunjungan, berkelanjutan, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik, is_rujukanThalasemia_Hemofilia,
                    ispotensiHEMOFILIA_cetak,namappkRumahSakit)

            }

            function jspdfctk(nosep, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan,
                jnspst, cob, jnsrawat, klsrawat, prolanis, eksekutif, penjamin, statuskll, katarak, potensiprb, cetakan, dokter, kunjungan, berkelanjutan, poliPerujuk = '', FLAGNAIKKELAS, klsrawat_naik
                , is_rujukanThalasemia_Hemofilia, ispotensiHEMOFILIA_cetak
            ) {

                var flagSepFinger = '0'//$('#flagSepFinger').val();
                // if (flagSepFinger == "99") {
                //     getCariFlagSEPFinger(nosep, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan,
                //         jnspst, cob, jnsrawat, klsrawat, prolanis, eksekutif, penjamin, statuskll, katarak, potensiprb, cetakan, dokter, kunjungan, berkelanjutan, poliPerujuk = '', FLAGNAIKKELAS, klsrawat_naik
                //         , is_rujukanThalasemia_Hemofilia, ispotensiHEMOFILIA_cetak);

                //     //batal cetak, get flagging dulu
                //     return false;
                // }

                if (is_rujukanThalasemia_Hemofilia == undefined || is_rujukanThalasemia_Hemofilia == null) {
                    is_rujukanThalasemia_Hemofilia = $('#txtisrujukanthahemo').val();
                }

                if (ispotensiHEMOFILIA_cetak == undefined || ispotensiHEMOFILIA_cetak == null) {
                    ispotensiHEMOFILIA_cetak = $('#txtispotensiHEMOFILIA_cetak').val();
                }

                var imgData = "data:image/jpeg;base64,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"
                var doc = new jsPDF('l', 'mm', [100, 210]);
                doc.addImage(imgData, 'PNG', 10, 6, 45, 10);

                doc.setProperties({
                    title: 'Cetak SEP',
                    subject: 'SEP'
                });

                //cob non aktif
                // COB_NonAktif
                var tglsep_tmp = new Date(tglsep);
                var tglCobNonAktif = new Date();
                var klsrawat_hak = klsrawat
                var klsrawat_naik = (FLAGNAIKKELAS == "1") ? klsrawat_naik : "-";

                var lblcob = '';//(tglsep_tmp < tglCobNonAktif) ? 'COB ' : '';
                var cob = '';//(tglsep_tmp < tglCobNonAktif) ? ': ' + cob.substring(0, 30) : '';

                doc.setFontSize(11);
                doc.text(58, 10, 'SURAT ELEGIBILITAS PESERTA');
                doc.text(58, 15, namappkRumahSakit);
                doc.setFontSize(16);
                doc.text(130, 10, potensiprb == '1' ? 'PASIEN POTENSI PRB' : '');
                //doc.text(130, 10, 'PASIEN POTENSI PRB');

                doc.setFontSize(9);
                if (ispotensiHEMOFILIA_cetak == "1") {
                    doc.text(130, 15, "Potensi Simplifikasi Rujukan");
                    doc.text(130, 20, "Pelayanan Thalasemia Mayor-Hemofilia");
                }

                doc.text(10, 25, 'No.SEP');
                doc.text(10, 30, 'Tgl.SEP');
                doc.text(10, 35, 'No.Kartu');
                doc.text(10, 40, 'Nama Peserta');
                doc.text(10, 45, 'Tgl.Lahir');
                doc.text(10, 50, 'No.Telepon');
                doc.text(10, 55, 'Sub/Spesialis');
                doc.text(10, 60, 'Dokter');
                doc.text(10, 65, 'Faskes Perujuk');
                doc.text(10, 70, 'Diagnosa Awal');
                doc.text(10, 75, 'Catatan');

                doc.text(40, 25, ': ' + nosep);
                doc.text(40, 30, ': ' + tglsep);
                doc.text(40, 35, ': ' + nokartu);
                doc.text(40, 40, ': ' + nmpst);
                doc.text(40, 45, ': ' + tgllahir + jnskelamin);
                doc.text(40, 50, ': ' + notelp);
                doc.text(40, 55, ': ' + poli + eksekutif);
                doc.text(40, 60, ': ' + dokter);
                doc.text(40, 65, ': ' + faskesperujuk);
                doc.text(40, 70, ': ' + dxawal);
                doc.text(40, 75, ': ' + catatan);
                doc.setFontSize(8);
                doc.text(120, 25, katarak == '1' ? '* PASIEN OPERASI KATARAK' : '');
                doc.setFontSize(9);
                doc.text(120, 30, 'Peserta ');
                doc.text(120, 35, lblcob);
                doc.text(120, 40, 'Jns.Rawat ');

                //doc.text(120, 45, 'Kls.Hak ');
                //doc.text(120, 55, 'Penjamin ');

                doc.text(120, 45, 'Jns.Kunjungan ');

                doc.text(120, 55, 'Poli Perujuk ');
                doc.text(120, 60, 'Kls.Hak ');
                doc.text(120, 65, 'Kls.Rawat ');//60
                doc.text(120, 70, 'Penjamin ');//65

                doc.text(145, 15, prolanis);
                doc.text(145, 30, ': ' + jnspst);
                doc.text(140, 35, cob);
                doc.text(145, 40, ': ' + jnsrawat);

                var kunjunganText;
                switch (kunjungan) {
                    case 1:
                        kunjunganText = "Konsultasi dokter (pertama)";
                        break;
                    case 2:
                        kunjunganText = "Kunjungan rujukan internal";
                        break;
                    case 3:
                        kunjunganText = "Kunjungan Kontrol (ulangan)";
                        break;
                    default:
                        kunjunganText = "";
                        break;
                }

                doc.text(145, 45, ': - ' + kunjunganText);

                if (berkelanjutan != null) {
                    if (berkelanjutan == 0)
                        doc.text(145, 50, ': - ' + "Prosedur tidak berkelanjutan");
                    else if (berkelanjutan == 1)
                        doc.text(145, 50, ': - ' + "Prosedur dan terapi berkelanjutan");
                }

                doc.text(145, 55, ': ' + poliPerujuk);
                doc.text(145, 60, ': ' + klsrawat_hak);
                doc.text(145, 65, ': ' + klsrawat_naik);

                if (penjamin != null) {
                    if (penjamin != '-') {
                        var _penjamin = penjamin.split(';');
                        var col = 70;
                        var _infoJKK = '';
                        for (var i = 0; i < _penjamin.length; i++) {
                            var nama = nmPenjaminan(_penjamin[i]);
                            if (i == 0) {
                                doc.text(145, col, ': ' + nama);
                                _infoJKK = nama;
                            }
                            else {
                                doc.text(145, col, '  ' + nama);
                                _infoJKK = _infoJKK + ',' + nama;
                            }
                            col = col + 4;
                        }
                        if (_penjamin.length > 0) {
                            doc.setFontSize(6);
                            doc.text(10, 90, _nmstatuskll(statuskll));
                            doc.text(10, 92, ' dgn ' + _infoJKK + ' terlebih dahulu.');
                        }

                    }
                }

                doc.setFontSize(9);
                if (flagSepFinger == "1") {
                    doc.setFontSize(7);
                    doc.text(120, 90, 'Dengan tampilnya SEP ini merupakan validasi terhadap eligibilitas Peserta');
                    doc.text(120, 93, 'secara elektronik dan peserta dapat mengakses pelayanan kesehatan');
                    doc.text(120, 96, 'rujukan sesuai ketentuan berlaku');
                } else {
                    doc.setFontSize(9);
                    doc.text(150, 80, 'Pasien/Keluarga Pasien');
                    doc.text(150, 85, '________________');
                }
                doc.setFontSize(6);
                doc.text(10, 80, '*Saya menyetujui BPJS Kesehatan menggunakan infomasi medis pasien jika diperlukan.');
                doc.text(10, 83, '*SEP Bukan sebagai bukti penjaminan peserta.');

                if (jnsrawat.toLowerCase().includes("inap")) {
                    doc.text(10, 85, '** Dengan diterbitkannya SEP ini, Peserta rawat inap telah mendapatkan informasi dan menempati');
                    doc.text(10, 87, 'kelas rawat sesuai hak kelasnya (terkecuali kelas penuh atau naik kelas sesuai aturan yang berlaku)');
                }
                //tanggal+time
                var d = new Date();
                var strDateTime = [
                    [d.getFullYear(),
                    AddZero(d.getMonth() + 1),
                    AddZero(d.getDate())
                    ].join("-"),
                    [
                        AddZero(d.getHours()),
                        AddZero(d.getMinutes())
                    ].join(":"),
                    d.getHours() >= 12 ? "PM" : "AM"].join(" ");
                doc.text(10, 95, 'Cetakan ke ' + cetakan + ' ' + strDateTime);

                var string = doc.output('datauristring');
                var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
                var x = window.open('', '_blank', 'width=1024,height=600,directories=0,status=0,titlebar=0,scrollbars=0,menubar=0,toolbar=0,location=0,resizable=1');
                x.focus();
                x.document.write(iframe);
                x.document.close();
            }
            function AddZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }
            $scope.columnSPRI = {

                selectable: 'cell',
                pageable: true,
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                    },
                    {
                        "field": "noSuratKontrol",
                        "title": "No Surat",
                        "width": "240px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"setKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  noSuratKontrol #</button> ",

                    },

                    {
                        "field": "namaJnsKontrol",
                        "title": "Jenis",
                        "width": "100px"
                    },
                    {
                        "field": "tglRencanaKontrol",
                        "title": "Tgl Rencana Kontrol",
                        "width": "100px"
                    },
                    {

                        "field": "noSepAsalKontrol",
                        "title": "No SEP Asal",
                        "width": "100px"
                    },
                    {

                        "field": "namaPoliAsal",
                        "title": "Poli Asal",
                        "width": "150px"
                    },
                    {

                        "field": "namaPoliTujuan",
                        "title": "Poli Tujuan",
                        "width": "150px"
                    },
                    {

                        "field": "namaDokter",
                        "title": "DPJP",
                        "width": "200px"
                    },
                    {
                        "command": [
                            {
                                text: " Cetak",
                                click: cetakSPRI,
                                imageClass: " fa fa-print"
                            }],
                        title: "",
                        width: "110px",
                    }


                ]
            };

            $scope.setKontrol = function (data) {
                if (data != undefined) {
                    $scope.model.skdp = data.noSuratKontrol
                    if ($scope.listDPJP == undefined || $scope.listDPJP.length == 0) {
                        $scope.listDPJP = [{ kode: data.kodeDokter, nama: data.namaDokter }]

                    } else {
                        if ($scope.listDPJP.length > 0) {
                            var status = false
                            for (let x = 0; x < $scope.listDPJP.length; x++) {
                                const element = $scope.listDPJP[x];
                                if (element.kode == data.kodeDokter) {
                                    status = true
                                }
                            }
                            if (status == false) {
                                $scope.listDPJP.add({ kode: data.kodeDokter, nama: data.namaDokter })
                            }
                        }
                    }
                    $scope.model.dokterDPJP = { kode: data.kodeDokter, nama: data.namaDokter }
                    $scope.popUpRSPRI.close()
                }
            }
            function cetakSPRI(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let nosuratkontrol = dataItem.noSuratKontrol
                let tglrencanakontrol = dataItem.tglRencanaKontrol
                let txttglentrirencanakontrol = dataItem.tglTerbitKontrol
                let noka = dataItem.noKartu
                let nama = $scope.item.pasien.namapasien
                let tgllahir = moment(new Date($scope.item.pasien.tgllahir)).format('YYYY-MM-DD')
                let namaPoliTujuan = dataItem.namaPoliTujuan
                let jeniskelamin = $scope.item.pasien.jeniskelamin
                let jnsKontrol = dataItem.jnsKontrol
                let namaDokter = dataItem.namaDokter
                let kddx = $scope.model.diagnosa ? $scope.model.diagnosa.nama : '-'
                let nmdpjpsepasal = $scope.model.DPJPMelayani ? $scope.model.DPJPMelayani.nama : dataItem.namaDokter
                jspdfctkSurat(nosuratkontrol, tglrencanakontrol, txttglentrirencanakontrol, noka,
                    nama, tgllahir, namappkRumahSakit, namaPoliTujuan, jeniskelamin, '-', '-',
                    jnsKontrol, kddx, tglrencanakontrol, namaDokter, nmdpjpsepasal);
            }
            function jspdfctkSurat(norujukan, tglrencanakontrol, tglterbitrencanakontrol, nokartu, nmpst, tgllahir, ppkperujuk, polirencanarujuk,
                jnskelamin, dxawal, catatan, jnspelayanan, kddx, tglrcnrujukan, nmdpjprencanarujuk, nmdpjpsepasal) {

                var jnspelayanan = 2;
                var imgData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAjANQDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+wr/go9+27pP/AAT7/ZY8X/tFah4MvPiDqOmaroXhbwt4Rt746Ta6r4o8TXT2umf2xrItb06VotokVxe6hdR2lzcyR24tLSF7q5ix9t4e8GVePOJsJw/TxkMBTqUq+JxWKlD2sqWGw0eap7GjzQ9rWm3GFOLnGKcuebUYs+X4w4lp8J5HiM3nhpYucKlKhQw6l7OM69aTjD2lTll7OnGzlOSjJtLlinKSP55Lz/g4q/au+N3wI8LXn7L/AOyl4UPx61v4uQ/CPV9HmufFPxKtTqPiTw/f+I/A954E8K6TB4f1LWJ9QsPD3i1PEA1bURa+GptK025mj1Gx1Z2sv3yHgBwvk2d4mHEvE+K/sOjlTzWlWUcNl0vZ4evDD42GNxNV16dFU54jCuh7KnzYhVakU6c6S5/yWXi7nuZZXQlkmRUP7UqY9YCpTbr4yPPWpSrYaWFoU1SnUc4UcR7X2k+Wi4Qk1ONT3f0++Hh/4LTfC34Jw/Hj40eMvh18cviNc2surat+yt4V8CeB/C9j4J0A2TXB3eLtA0j/AISXx14ytnYLN4b0HWLKztfJZLXVPE1xi0l/AfEnNuDcPKeD8OeFp16GGlONbOsyzfM3i8XyP+JgcDKcsPGi7PSvS9tWi24xw7UU44yzjx34V4VfEmQZRk3GuaUY1a+YcKy5MBXwuChSc/aYKphaE62a46EtJZfSqUnKKl7GtiKvLSn4v4s/4LpeLPCPgP4Yalf/ALPGjnx34uXxDqviTR5vGGp2ejaXoGieKNU8I26WjvosmoweIb3VvD+vre6bfxMuixWtlJI161+Yrb8UqcW1KVHDylgo+2q88qkfayUIwhUlSVrxclNyhO8ZfAkr35tP5jzb6d+b5PkHC+JxHh1g3n2brMcVmWDnnGKo4LC5fgc0xWT040W8FLE08xr4vL8wVfDYiLWChSoSk68q7hS+tf8AgoH+3V8QPh3/AMEttU/bU/Zwu4/B3i3WdC+GfiLwwfFWg6X4hbR7fxb4l0fTdW0++0vUY59LvJ7eG7vLNLrypYHZFvLYFHjNfufhBkuUca8W5Jl2bUK1XLcxw+KrVaMK1TD1b08JVrQXtaTU1y1Iq/K1zJdmf2JV8RZZ54UZV4icOQqYBZ5leV5phKOOo06tbCxx06aq4etBp0qk6TdSl7SKcJ8qqw92UT4h+NH7Xf8AwUQ/Yx/Za/ZY/bw8eftJfD39o/4Y/Fm9+CjfE74Har8APCnww1XStI+MHheHxIw8E+OPCGtS3t5quiAXNhbz6rZRWjv9nvbjTrmHz7ZP07J+FOAeL+JuJuCcDw9j+HsyyuGcf2bnVLPcVmVKrVynEyw6+uYLF0VCFKt7s5RpTc0uaEakXaT58xz/AIu4dyTI+KMVnOEzjBY+eW/XcsnlVDBTp08woqt/s2Jw9RylOn70E6kVFvlk4yV0fR//AAU0/a1/am+GP7VX/BPb9nr9nH4raL8H9J/aw17xR4d8X+JdY+GXhj4kXulmC88Jx6VqVppfiMxIZLGHVr1ZLKG9s0uZJEM02IVB+e8OeFuGcy4Y48z7iHK62bVeF6GGxGEw9HMsTl8Kt44p1ac6mHu7TlShabhNxSdlqexxnn2eYLPeE8oyfHU8vp57Vr0sRWqYKhjJwtKgqc4wrWV4qcrxUo3b1ehg+F/2sv21P2Y/+Cn3wR/YW/aO+KngX9pr4Z/tKfD3XvE/gr4kaX8KdI+EHjbwbregab4p1Ga11DSPDOrahod9ppfwpPZzJKt1cXCatZXcF5ZNY3Vrc74nhbg/iTw2znjXh7LMbw5mPDuPoYbGZfUzSrm2DxdGvUw1NSp1cTSp1oVLYqM01yxi6U4ShPnjKOVDPuI8l41y3hjOMdhs6wWc4SrWw2MhgaeX4nD1aUK83GdOhUnSlC9Bxd7t+0jJSjyyjLqv2TP+ChPxn8b/ALYv/BVT4RfFd9G8R/C/9jqRvFnw3g0TQLLSPFFp4e0+28RTaj4anvLTy4db+0QaGktneanFJqKX0sivdvayRwW/NxTwFlGC4S8Mc1ytVsPmXFqWFzCVavOrhpYipLDqniIwnd0eWVZqcKbVNwSagpJylvkPFmY4niHjnL8e6dbBcPP2+DVKlGnXjSgqznRco6VbqknGU05qTfvOLSXD/sYfGj/gqF+3V8GNH/bO+Hv7Qf7MPgHwr4t8WeIF8G/st6p8JLzxN4Yi8L+G/Etxok+ieP8A4vadrv8AwsDRPF93aWdxcG50nTbi1gkn03UH0eK0un02Ls4vyfw14Jzirwhj8h4kx2KwuFoPF8S0s1hhsS8TiMPGtGtgcpqUPqFbCQlOMeWrUjKSjUpqq5xVR83DmY8bcT5dT4iwmbZLhaGIr1fq+STwEq1BUaNZ0nSxeYQqfW6WIlGMnenBpNwk6ajJwX6f/tv/ABX8ffBL9kT4w/FjwJfWOh/EDwd4X0jU9KvJLK01ywsdSuPEWg6feqLTVLZrW+g+z3t3BE11aDIZJ/KSRVC/z5nOInhMBjMRhp2nSjelOcIt29pGKcoPmjdxequ0m9G7HN47cWZ7wN4Rca8WcO4ilg89yXLcLicDiKmHo4ylRrVMzwGGqN4fE050a0XSr1YJVKbS5lO3MkfOFx+2N8UPG/wp/Zo+Gnwnj8O6h+13+0d8NvDPjTULh9Nafwj8IfBdzZ2r+K/jB4q0iSWUDTbZpJIvCnh6aVl1zWZobdBPbRLa3vnvM8RWw+AoYbkeZY6hTqybjenhqTS9piakey2pwfxzaWq0f5lU8ZuKc84T8MeGOEo5diPGDxI4ayzO8RUlhufKOD8kqUaUs24xzXBylJLDU3KUMpy6c2sdjZwppVKUFSrfT/xf/ag+H/7NcPw48DeOtS8ZfE/4teOLWPTvC3gvwD4Rj174i+Pr3TLUJq3iGPwxoSWOl6Npj3EUs93eTPpuj2RaaOBzFZ3Bh9DE4+jgVQo1pVcRiaq5adKjS569ZxXvTVOFoxjfVt8sVrbZ2/UuMfFLh7wzhw1kWfYnOuKeLs9pRw2VZLw/k8cfxHxBWwtJLF5jHK8BGhhcFhXUjOpWrTlhsHQvONOThRqOGx8FP2rvg/8AHTRPHWqeG9T1Xw1qXwtuprL4oeD/AIgaRceD/GHw9ngt7m6dvFGi6id9lZvb2d7LBqMc09jOlnc+XcFoJFWsLmOGxcK0oSlTlh244ilWi6VWg0m/3kZbKydpXcXZ66M7eCPFrg7jvA59i8txWLyzE8K1Z0OKcn4hwdTJ854dqU6dSq3muCxLvRoyp0a0qeIjOpQqKjV5al4SS8h8Hf8ABQr4O+PNU0dvDXgX496h8PfEXiSHwnoPxmg+Dvimf4W6rrM982nQtBrdrDcalFo0t5tgXxDc6NBoyysUmvIfLkK81LOsLWlH2dLGSozqezhilhajw8pN8qtNXkot6c7io33aPjsm+kTwbn2LwbyzIeP8Rw7mOZQyjL+NIcG5rU4VxeNqV/q0HTx1KFTExwUq1qazGrgoYJTdp1ocsmvWPjv+1b8MvgFrXg/wZrlp4w8a/Ez4g/an8FfCz4aeG7rxf471+1st4vNUTSrZ4INO0a1aOVZ9W1W8srJfJuSkkgtLsw9GMzHD4OdKlNVatetf2WHoQdWtNLeXKrKMV/NJpaPs7fXce+LPC/h/jsnyXHUc4zzifiH2ryThThjLaucZ9mFKhf22KWEpShDDYKk4yU8Xi61CiuSryykqNZw8wvf2yfBvxN/Zy/aI+IfwW1TVtD+IPwY8JeMBr/hPxx4Zl0Txn8P/ABjpOh6je6db+J/COtRyBQ1xZSvbs4u9OvjaXMIkla3uIkweZ0q+BxtbCylCthadXnp1afJVo1Ywk4qpTnfqtN4uzWtmj5av4z5NxR4b+I3EXBOKxmA4i4KyfOf7QyjPcslgc64eznCYDEV8NTzTKMbGVk6lGTpuSq4au6VWClJ06kI/JHwM/wCCs3gaD9mn4b/ED42aT8TfGXjD+zZo/i14u+GHwh1+88A+D7+PXr/TrNvEXiFILHwtp2qXemJpd/daZpV7Msc18qJb2hlhta83CcR0VgKFbFxr1avL/tNTD4abo0pc7ivaTsqcZOPK3GLdm9ldI/IeBPpcZFT8MuGuIeOMJxPnWc/Vpx4uzjhfg/MK3D+T144/EYai8yzGMKGVYfFVcLHC16uFwlaajOukqdHnhSP0D8Y/ta/CLwn8Ovhx8SrJvGHj3S/i/a2F38MdE+G/gvXvGHirxlFqFhFqcbWGi6fah7KO2sp45tQn1mbTLaw+ZLmaORWQezVzHDU6FCuva1o4lReHhQpTq1KqlFS92EVpZO7cnFLqz+hc58XuD8o4b4b4moPOc/wvGNKhW4XwPDWS5hnGbZzDEYeGKi8PgsPSvQjTozjPEVMbPDUsPqqk4yTR598Pv28Phf8AEjWPiD4E0jwT8XNH+M/w58Mv4s1T4G+LvBf/AAjXxK1nSY2iBk8LWGo6iuk665Fxasiwaum9bq3kQtDKJBjRzfD15VqMaWJjiqFP2ksJUpezryjp/DUpcs91tLqj53h7x74W4lxnEOQ4PI+L8Hxrw3lbzfFcCZvkv9mcTY3CRcE5ZVh8RiVhMfK1Sk0oYuPMqtOSvCXMfNP/AATY/bk+Ln7SWneKtB+LXgHxxrGpad8SPF2i6b8TtH8EaTpHgfRtJsLK01DTvC/jK407UohY+J7Tfc25kttIaCZZtPhuZ2uWe4m4MizbE46NSGJo1ZSjXqwjXjSjGlCMUnGnVcZaVFqtItbJu+p+Z/Ro8deL/EvDZtgOLsgz3GYnDcS5vgsNxRg8jweDyLBYTD0aOIw2V5zUw2JiqGaUr1KfNSwjpzU8PCpUdRupP6f+Jv7cvw3+G/iTxh4ctvh38d/iOvw3Lf8ACx/EPw1+FWueIPCvgoRW4u7tNR165bTLLULmwtis9/baE2qPZwlnuDH5cgX0MRm1ChOrBUMXX9h/HnQw8506Vld803yqTitWoc1up+o8UeO3DXDWZ5xltLhzj3iRcNt/6yZjwzwnjswynJFCn7assTmFV4WhiKuHpNVK9LAPFOjC7qOPLK2F4p/4KP8A7LXhP4a/Bj4xX3i3VLn4Y/G7xLe+FdA8WWOiXU9v4d1XTVYamnjHT2Meq6MumTq8GoIlld3EHlyXCwS2wSV4qZ5l9OhhcU6knh8XUdOFRQdoSj8XtV8UeV6S0bWr1WpwZr9JTwrynhngrjKvm+Kq8L8c5nXynAZtQwNWdPLcXhk/rSznDvlxWDWFqJ08So0a1SnyyqKE6aU5U/Cf/BSD9n7xR8YfCPwYudJ+LngrW/iJdfYfhz4g+Inwv8SeCfC3jq7cstonh2916G1vriDU5PIh0u8n023tru5u7W2MkU1xCkip55gqmJp4VxxNKdd2oTr4epSp1n05HNJtS0UW4pNtLdmOUfSU8Pc14yyfgqphOL8kx3EdX2HDeY8R8LZlkeVZ9Wk2qKy6vj4Ua9SnipckMLWqYanTrVKtKnzRnUgpfflewf0EFABQB+Jv/Be34jeK/CP7DsfgbwL8OPC/xb8UfGj4ufDf4cReAvFHh9vFFvqmm6nrkRaWz0iGezv4r6fxEfC/hyx1nStR0vVtG1TxJp1zpepWV+1tcR/r/gfhcvxPHUKmPzWtlMctybNs2pYjD4lYWr/sVGmqz9o4zhKnRw9aria1KrTqUalKjONWnOF4v8y8VMyeGyCllmHoYXG4/OMXSo0MvxFP20sRQo1aP1idKknGd6dWthKTqwnTnSliKbhOM3FnQfskeAPhR/wSy/Yl+HejfFjw98CPhD8b/HdzqWr3nh3wu+rWela98XvEVjdNonhSfxV4k1rxj4kv08P6WdJ8I+IPGt/rLaBp8ENxeq+n6ZcwrN8p4q8d08/4ix2PWbY/F5dG2Ayd5pVpQnXpUVdTVDDUMNQw9LE4hSxPJ7CLpRqR9tJzVz57H8S8L+DHBeCq8RYnh/Jc8zapWoZVgateph6WZ8Q4ijUeCwEsVVniq8KEH7DC43M6s1g8HTk61WpSpyjzeWeFf27f2+vD9n8Pvjd+0V8N/gb8KP2aJ/FOvaf481CW51a08aQabpF1qeh3tja+H7rXNV1ufxBDq1mR4csdL0+Y+I71bQO0Gi3c+oW/4zSzrOYexxePw2DwuXSqSjUnzzVeycoOPsZXkpqUfcUeZzdr2i21/POV+O3j9l2H4e448ReHeB+FPDaWa5jh+Iq0p4mlm9LCYKri8DXo0MHPMsZja2YQxdD/AITcPhcI/wC0qypJyhgqs8RDs/29fAHgH9sb9kfwl+1P+zn8MvAXxdvvCx1PxZp0eveHfEen+INW8HJdalbeMbC1tNA1zwvqFxqui67ayaxf6Hq/9pQX7adqcdvbTXN0PtXRnFGjmeW08wwWHo4l0+arHnhOM5UryVVJQnTk5QmuaUJcylyysm3r6vj7w/w/4y+EOUeK3hvwvkHF9fKnis3w8cfluZYbMMXk0auJp5zQpUcvx2V4irisDj6MsZiMBjPrMMQ8NiY06U6tVe1+HP22/jhP8ff+DezxP4u1Gz03T9d0G58C/D/X7LRtNs9H0q3v/BXxN0PSLQ2GlafDb2On291oaaReizs4Iba2e5eGGNEQKP3L6NeMeN454bqSUYzp0syoTUYqMVKlga8VaKSUU4crskkr2R7nh3x1U8QfoxZRm+Io4bD4/L1T4dzChgsNRweEp4jJMfTwlF4fCYeFOhh6dXALB1/Y0acKVOVWUIRjFJL5q/bx+B3xN+Df/BNH9gz9sLXv2j/Hvx88E/Bdf2VvHEH7Lvxj0PwZF8I9Q/t7wpoJ0rS4n+HmheC9fvbbw1mLSrBfFd/4nnl0WS7Mt4J3uY9Q/ceCM6y3N/EXjfhOhw/gcjxmcf6zYOXEuUVsY81p+wxVf2tRrH18ZQhLEa1Z/VaeGiqyglDlUXT+84pyzG5dwbwvxBVzjFZrhst/sPErJMxpYdYCftaFLkgnhKeHqyVHSnD28qzdNyvK/Mp/Qn/BVfxj4++Kf7Yf/BET4g/BiPwr4U+IXxEkv/GngG3+KFhrF74T0DV/Flr8Ndd0208Y6doEtnrc9lpyX/2a/t9Nlt7syRFYyhzjwfDHCYHLOE/GXAZu8TisBl6hg8dLLZ0YYqvSws8woVJ4SpXU6MZ1HDmhKopRs9Uz1uOcRi8dxD4a4vLlQoYvGOWJwqxsakqFKpiI4OrCOIhScarjBTtNQalddD9Fvgz/AME9/wBoHxT+3P4c/bz/AG2PjP8ACjx18R/hV4Bvvh/8I/hn8CvCHifw14A8Iw6xaapaXniHULzxlrWp+ILvVp7PXdazbuGgnm1JJvPit9PtrRvgM448yHDcFYjgfg7J80wWX5njoY/NcxzvF4bEY7FulOlOFCnDCUaeHhSjOhR95e9FU7crlOU19dl3Cea1+J6PFPEmY4HFYzA4WWEwGCyzD1qOEw6qRnGVWcsRVnVlUcatTTZud7qMFE+OP+CW8VtP/wAFff8Ags/FexwTWMviTwjBdx3KxyWkkEuv+JkmhuVkDQtFJH5iSxygq6b1dSAwr63xLco+FHhA4OSmsPipQcW1JSVDDNONtbp2aa2drHz3BKi/EDxGUknF1qCkpWcWnVrJqV9LNXTT3Vzi/wBsf9jz41/8Eh9I+Jn7d3/BOD4xz+EvglpuvaX4w+On7Hfj1n1r4UahYa1r2n6LLqPgiOe43WSre6xa2sVhAdP8SaRpz+Xofii4sYIdBXs4S4tyfxWq5dwT4hZQsVnNShVwmScW4G1HNKdSjQqVlTxjjG024UpSc5e0w9Wor1sNGcnXObiLh7MuAKeN4o4PzB0MthVhiMz4exV6mBnGrVhTc8Mm/d96pGKguStTg/3VdxSpH6T/ALWXxltP2iP+CRPi/wCOllot54bt/iz8CPh747GgXxdrnRpfEWt+D9QudMaZ4oGuorK5mlgtr3yYlvrZIrxI0SdVH81+IOUSyCrxLks60MRLK8XiMD7eFuWssPilTjUsm+VzilKULvkk3BtuJ839I7MY5v8ARr47zONKVFY/hvLMV7KfxU3WzbKpyhdpcyjJtKVlzJKVlc/LHwN8P7n9hbUP+Ccv7Z8fizxP4l0X4t2EPgn446nrN5c3tlpuh+MrG2XRtG0+3mZhZaP4e8KXMsmlWRmZJtQ8GpfKtuGSGP8AO6NF5S8kzT2lScMSlSxcpttRhVS5YpdIwpu8VfWVK+h/FuRcPVfAjEfRv8a45tmmZ4Li+hDJOOsVja9WtQw2BzqhTWDwWHpzb9jg8uympOWEoObjPEZMq6VNOMI/Zni5fjBrX/BZTxVbeAvFvgLwv4hT9mfT/wDhXmofEPw5rXjDw/d+G5I/D91rFvoVhpWv+HpYNYnvJNcvDeW189uLG21WOSGUzlk9Sr9ZlxPUVGpRpz+oR9hKvTlVg4Wg5qCjODUr87unaylpqftOcLjHG/TPzalkGb5BleYrwyw/+rmI4iy3G5zl9bLZRy+rjKeAoYTH5fOGMnWljqzrU68qfsKWLjKEvaNr628A/sNfEF/jL+0V8V/jP8TfB+vw/tJ/B5/hT4z8N/DXwhrHgywgaO10zTLLxJatqviPxDI+qQaXaX0Ukk8khe51GaVSkZeJ/So5TW+tY3E4qvSn9ew31erToU5UlooxVRc05+8oprXq+2h+u8P+BPEUuNPEfizjXijJswh4l8HS4TzrLeGcnxuS0IONLDYWhmdJ4vMcwk8VDC0q8ZSnKTlUxE5Lli5RfyDN8Rf2vf8Agk/4W8FeGfiTaeCv2gv2PdL8TWfgvw/4x0VJ/DvxO8E6Vq13eXOnWGo2TMbG5MFss5soZotQt7i5iaw/t2zSSzA8z2+ZcO06VOuqWNyyNRUoVYXhiKUZNuMZR2dle26b051dH49PiPxi+iXlWSZZxLRyTxD8HMLmlHJMuznBRnl3FGSYTF1q1XDYfE0W/YVHTpKp7CE4YinUqxeH+v0Yyo2WS4+Lfiv/AIK//FK4+HXi7wB4W1+4/Zp8I3nw5vfid4R1vxXp934LvdN8F6hqNr4d0/SvEPh25sNUbUrzW7u6uWvHiWCHWLd7dmlLAvianEuIdCrRpzeApOg69KdSLpONJyUFGcHGXM5tu+3MrBKpxfm30xOKqnDmb8P5VmFTwyyitw3X4oyjHZth62S18NkuIxFLLsPhMxy6ph8U8TWx1arUdZwUIYym6bc7r1/xn+yZ8Ufhbpv7eX7SPxI+JngzxNqnxr/Zy8R6JrvhbwH4N1XwnoUGr+HPDsUGma6seq+IdenknGnWN5FcCSdpJbnVLqcSIreWemrluIw8c4x1evSqSxWBqQnTo0pU4KUIWjP3pzbfKne/WT1Psc68I+KuFcL4+eJXEvE+S5niuN/DbM8Dj8qyHJsXlOAp4zLcuhDC49RxeY4+cqn1ahXhU5puUquKqzUknynmHwxSNf8AghJrQWONQ3wO+JzuFRF3ufHHiTLvgDc5IBLtliQDngY58P8A8kjP/sExH/p2Z8twvGK+gXjrRir8DcTydopXk89zG8nZay/vO70WuiND4DftT+Pfh98B/wDgnl+zJ8FfCnhbWfi98bfhMuqweJ/iBd6hD4L8CeFtFbUGvtXvbDSDHq+v30qWl6bXSbK809X+yCOS6DXEYSsHmFajg8lwGFp054nF4bmVSs5eyo04c3NJqPvTekrRTjtvqjp4B8Vs/wCHuAvo6+F/BOU5VjeMOOOEVi6ea8Q1cRDJchyrBPEOvjK2HwfLjMfXnGjX9lhKNbDqXseWVW9SNqvgHR/H+i/8FoLK3+JfjPSfHPiib9le7vJtV0LwkvgzRrO2mnkWDSNN0k6xr11LbWTRzEahf6pcXt287+aIkjjiRUY1ocUpV6satR5e25Qp+yik27RjHmm7Lu5Nu5jw/g+IcF9NahT4nzrCZ7ms/CqtWqYvAZQslwVGlOclTweGwjxmPqzpUHGbWIxGKqV6znLmUFGMI91/wRUz/wAKc/aEzn/k5fxtwc8H+zdFzweh9a24V/3XG/8AYfV/9Jge99CS/wDqb4iXv/yc3O9+/wBWwVz0H4f/ALSXx2/bO/4aFm+Dl14A+DnwM+GmueLfhxH4s1/w5ffED4l+OtU0vTbk6pqul6H/AGx4e8M+GdPlgMTWh1X+3Loi9gaS3kkt7mBdqOOxeafXXhXRwuEoTqUPaTg61etKMXzSjDmhTpxttzc71WmjR9Dw94l8e+NX/ERJ8GVeHuDOBOGcdm/Dcc2zDLa/EHE+fYvC4ao8Vi8LgfrmXZZleHnT5XReL+vVbVqblTlKnUgvw48DqrfsY/sERuFkQ/8ABQPXUZXVWR1N14ODKyEFCrZO5CCpBIIwTXydL/kV5P8A9jqf50z+F8iSfgr4ARklKL+kJj01JJpp1cmTTi7pp9Vazu9D9lP+Ckir/wANY/8ABL47VyP2k7MBto3Y/wCEm+HpxnGcZAOM4yAetfUZ5/yMcg/7D1/6XRP7P+kql/xFv6LWi/5OXR1sr2/tPh3S+9r627n7H19Mf2aFABQB+Nn/AAVj+KfjD9nLxN+x7+0toOh2/ibw78N/iH458N+MvD1/BFcaZrGn+N9M8K6jb2k6zwzwWeoInge/u/D+sPGZNH1620+9gPnIit85nuOxeVVsuzLCzqQ9lLFYWuqc5Q9rh8XTpqrRm4/YqwpSi09HommnY/jX6WPGOf8Ahfm3g74oZRh3jMDw7n3EWTZ5gJfwMfgOIsHlVaWErNxnGlOpSyPESweJkv8AZsbToVI3klF9R+2f4K8Sft/fstfAL4ofstSeE9fm0n4l+DfjLpSeMrhtPiGl6HZazDqek34gt72db3StZeC18QaJFme5XT722tvtF1Haxyzm1Ced5dg6+X+zny4iji4+1bjpT5m4ysm7xnZVILVqLSu7HpeM+T5n4/eFnh/xX4VPKMxnhOJcn4ywsc6m6EFhMHh8bSxeErqnCrU9vhMZKFPH4GD9pU+r1qdL2lWNKMvmzxd/wVI8B/FzwB4U/Z68O2N14l+MHxQ1nXvgx401WD4Ua1pPhDw9eeKNP8QeErTxt4Y0bUtUvb260yDXbjSJrjR7jULfXrbQru/vJzFqWmtptz59TiGniaNHAwj7TF15ywuIksNUhRp+0jUp+1pRk5OUVUcPcclP2bk370XF/m+cfSm4d4u4eyvw9y2jXzLi3inGZjwVm2Khwpi8LlOX180oZjlFDOsvwOIxdavPC08dUwk6uEqV6ePpYGrXrT5cTh3hqnrWt/GXSP8AgjF/wTP0R/j74n0LxV478NReJdB+G/hfwvbSRjxT4+8VX2t+ItB8IWM15JHPqdlpU9zdal4k8STW1jHbaNb3jpZM8NnFe/qvhT4e5txTmGXcNYZxcKH+0ZljEmqOBy9Vk61SUt51Hz+zoqydWtOEbRipTX7z4Z5Nj/AbwXyXh7izMcBmWbZa8xWHpZZSnDDyxOZY3FZhSwFOpVkqmLjh516k6+NlSoJ0+ZRopQg6nJfs4fsv+Bf27v8Agk3ovhz4yanN8M/D37Wd7ZftAeLofh2mn+G7Pwnr+uaxo2t3+neGYtbh1KysvD99r2gTalY2k8cyWum6slhBK6W8U7/T0/8AjUPibnq4XowxtLJ86zOnl+HxsZVUqOJoqk4VPq7pOUoKU5LkUFGT5eSMY8q9PgHw9yePh/mmXxf9m5ZxhxDj+MJYTBQpYejllbNZ4SriMJhIyjKnTwksXhauJo0lFRoUsTHD00oUoncXX/BG74XfErwr8Jvh98cf2qf2of2hPgN8I5PDN14I+Cfirxb4E0v4Z3Vv4RsINK8OWOuxeCfA2hap4j0mw0mBdOhju9Xe6Fq84i1CJrm5ab14+LmZZdis0x+S8McNZDnmarExxmc4XC42pmMZYqo6uInQeMxtanh6tSrL2jcKSjzKN4NRil9hLw8wWMoYDCZnnmd5tleAdGWGy2vXwsME1QgoUY1VhsNSnWpxppQSlUcuVu01zSv9d/HH9hb4LfHr9oX9lb48eMNV8Sab4l/ZMuNd1f4ZeD/DuoaXpfhy/n1H+xlgl1yxbT59QuNP0SXSbE2ltpl1p8PKwXEjQt5T/KZLxrnGR5DxPkmEpYeph+KY0KWZYvEU6tXEU40/bOSoz9pGnGdZVZ80qkaj+1FX1Xv5nwxluaZtkeaYipWhWyF1amCw9GcKdGbn7Ozqx5HNwpOnHljCUF0bs7PF+P8A/wAE/wDwV8ZfinL8dvA3xl+P37M3xp1Lw5ZeD/FXjv4AePx4YXx74Z0tpG0fTfHXhjV9N13wzr8uh+dONE1Q6ba6tYLMU+2zRxW6Q7ZFx3jMoyxZJjcoyLiPJ6eIni8Lgs9wP1n6jialva1MFiaVShiaCrcsfbUvaSpTtfkTcm8814Uw2Y455phcxzXJsxnRjh6+KyrF+w+tUYX9nDFUKkKtGq6V37OfJGpC/wATsrZv7MP/AATu/Ze/Zd8H/GX4baTL4g+KfiP9o+TVr/49+L/jH4tTxd8SfitFrVnqFrqMPiC9ii0uWPS2h1fVpFTTrO1m+0ajc311e3N8Y7qPTiTj7iXiXF5RmNVUMsw/DypQyPCZRhXhMuyt0Z05U3Qg3VTqKVKkr1JyXLTjCMIwvFxkvCOSZJh8xwdN1cdWzh1JZpiMwxCxGMxyqRnGaqySg1C1So0oRi7zc3KUrSXz5rv/AARc+CvjLSNA+GnxA/aQ/bI+IP7NnhbV9P1jQf2ZvF/xum1P4Y240qcz6VoN9djRIfGGreFdIJEOjaPqHiKaXSreOFLPUI5YxMfeoeMGcYSrXzHAcPcI4DiHE0qlGvxHhcmVPMpe1VqteEfbPCUsVV3rVqeHSqybc6bTseTV8OctxFOlgsXnHEOLyahUhUpZLiMyc8EvZu8KU5ezWIqUKe1OnOq3TSSjNNXP0W+L/wCzz4D+L3wC179nG6juvCHw71nwxofg+2tfCCWeny6B4e8O3OkzaTpuhxT2tzZWltZwaNZ2EELWskUVmvlIgwpH5BmcJZvDFrG1qtSpjpzq4mu5c1apVqVfbVKkpyT5p1Kl5Tk02229zt474Fynj7gnOOBMxq4nAZRnODw+ArVMtdKnicPh8NicNiaccM6tOrShZ4WnTtKnJKm2kr2a89+JP7G/wP8Aih+zfoH7JfiddZ/4QPw3ovh618Kz2+tQx+MtIl8GxxWul+IbO/mtpYptQgWZ7e/lk06SyuIdRubV7aOO5RU46+U4fEZfHAzjUeGpKlCNRP34SgnyPn5XHnaUtGveTlZW2+X4l8FeCOKvDPAeE2Zwx/8Aq7leDy2hldenjIrN8FVyeCp4PH0sVOlOnLExjKcKznh3Rq069ak6UY1Eo898Q/2Fvhv8RtN+DN/feM/iR4b+LPwI8Pad4a8A/HLwbrlnoXxHj03TrNbIWut3H9m3eka3ZXcfmvfWd7pjRzyXeoAMkWpahFc5VspoV44WTq16eJwkI06OLpTUK/LFWtN8rjNPqnHW77u/mcReA/DXEmG4LxFfOuJcs4u4Cy7DZZkHHeS46jgOJI4bDUVQVLHVPq1XB46hWjzOvRr4ZxnKriNYwxOIhV9J8D/s06B4b8NfEHQPGvxA+K3xnufilp39keNNa+JvjO6vZ5tI+wz6euk+HNJ8Pw+H/D3g2wWG6uJT/wAIzpOnX011Mbm6vriWK2MG9LAwhTrQq1sTiniI8lWeIqttxs48sIwUIUlZv+HGLu7tt2Ppci8Mcvy3LOIcvzviHizjWrxVhvqed43ijOqtepPB+wnh1hMtwmXQy/LsmoKFWpL/AITMJhq86s/a1a9SUabh893X/BODwH4km8H6L8TPjd+0J8W/hV8Pta0/X/CHwf8AiB44sNT8J22oaWz/ANnR67qFpoNj4l8U6fp8T/ZtPtdZ1iaS1tN1qLl4JriOXieR0ajpRxGLxuJw9GcZ0sNWqqVNSj8Km1BVKkY7RU5Oy0vZtP8AO6v0bMgzKeTYLifjjxD4v4T4exuHzDJ+DuIc8w+KymliMK5fVo4/EUsBQzPNcPh4S9lh6WNxk5UqV6SqunOpGfsnx4/Y8+Gvxz8VeB/iT/bPjT4W/Fz4bW8lh4K+Kfwt1i38PeKNM0mUyl9AvUubHUdK1jQCbi5xpeoafJGiXV3BG6Wt7eQXHVjMsoYupRr89XD4mgrUsRh5KFSMf5HeMoyhq/dlFrVrZtP7Tj7wb4Z47zbIuJvrudcK8YcM05UMk4q4VxlPLs1wuElz82X141aGJwmNy9+0q2wuIw8oxVatCMlSrVqdSzpX7MGhWXw7+Knw78UfFf4tfETVfjXoOo6F4q8YfEHxfDrGvR2E2k3GkeT4T0O2sdN8J+GLLT7e+lmW10Lw7apPcTLNqcl46wGOoZcvq+Jpzr4qv9Zi6datWnzuKlGUUoRUY0qSs3ZRgrvV8zRthPCvBUeG+LeHsz4r4v4jxPGuAr5fm+dcQ5vHG46nQq4Srg1TyrBUsPhsoyqjQp15zjRwOXUlUqS58TKvJQcZPDv7Ivws8Ofsrt+yFBN4lu/hfN4N1jwXd3dzqkI8T3Fnr13eajqV+NShs47aG+bUb+4urfy7D7Lb/uoBbvChVlDLcPDL/wCzV7R4f2UqTbkvaNTblKXMlZS5m2tLLRWsPLfB/hTLfCl+D0J5nW4WnkuMyWtWq4qH9qVKOPq1sRicQsTCjGlCu8TXqVafLQ9lT92Hs5QjZ+I+I/8AgnH8Gdc8I/s++F9M8dfE3wV45/Zn0J9I+GPxP8GeJNP0bx9a6NNPm4i1TOl3Gn31pJKWVWTT7bymluIFlNtd3lrcc1TIcPOhglGpiaU8AvZ4fFUpKNRJ6uEpcrg7rW1k7X6Np/EZl9Gvg3HZL4e5bhc84pyTO/DLAywPC/FeS5jh8FntLCTnzVKeKf1Wphq9OUr2tQpuPPUgpeyrVqVTuvhv+wp8MPhp8ddG/aMsvGHxS8V/FS08F6z4M8ReIvHvi3/hKLrxpDq8sLLquttcWMK2d9ptvDHp2nWmgppOi22nwWsEelrJC802lDKMPQxcMcqmIqYhUpUp1K1T2jqqTXvTulZxSslBRiopLl6v3OGvAbhbhjjzBeJFDOeKs24ro5LjclzLMc/zf+1KudwxkoNYvHOpQgqNfDU4Rw+Go4COEwVPD06VOOFUoSnOj4D/AGEPBPwn+KPif4h/CT4rfGf4Z6D438Xx+OvGPwp8L+I9C/4V5rviNbtryd2sNY8NarqWn6dqDvJFqFlpupWss1pIbKG8t7SK1gtlRyilhsRUr4bEYqhCrV9tVw9OcPYTne792VOUoxltJRkm1omlZLDIPATI+EuKs04i4Q4s414Yy/PM4jn2c8J5XmWB/wBXcfmSqutUboYzLMXicPhsRKUo4ihhsTSnOjJ0IVqdGNKFPjtE/wCCePwV07x38S9f+HvxY+M3hDwd8SvEl7q/xY+DfgL4lRaV8P8AxDrl5LNLqmn6nBp1ifEGj2WoJdXNtqOmafrWn3b2FzJp0V3bacIbSJPh+lQq1KkamOw1HGN1qmGjUlSoV1JtuSvBT9nK7T5JpNOykloeThfo3cHYHPeI8xyLijjjIsk4rx9bH8UcG5HxF9R4ezTFYic5YmlWhRw/9oYXC4lVatLEYfC46hUlQqSw0K1PDKFGGZp//BMT9nrw94D+FHgA+I/HcPgr4MfG7Vfjn4atrrW9Jikk13VJtOe20PVtSfSVaXQrKXTbKOPyhb6hcJ5qSXvmTCRM6fD2E9nhsNB15Qw2Lni6UE05Obs+R2jdwjyrZc1r+91OTC/Rb8PcDkXCXDkcw4g/sbgzjjF8d5XQnjMKqk8fip4aVPAYrEfVFKeAoPC0Yx5FTxNSPOpV+afMvpX46fsy/Dr45eNfgP8AEPxjqeuaT4h+AHxG03x74Km0nULS0s9Q1RNQ0m5Gja1b3lpci8stQu9J05FS1ktL0MHign/fla7sVl1LG1cJWn7T2mCq/WKfs3p7vLKSmrO8PcTb0aSetj9M468LuHePc84C4izfEZhhsy8PeI8PxDks8FXpU6NfEU6+ErywmOpVaNVVcPWqYPDp+ylRrRtJRqWm0fStdp+lhQAUAfnj/wAFR7T4q3X7Hvjl/g74Ri8YeLbDWvCupvbR+G7XxXrejaRYatHcah4k8L6RdWd+f+Eg0cLFNbX9nayajplq97fWOy4gSRPF4gWIeWVvqtP2tVSpytyKpOMVJOU6cWn78ejScoq7WqP50+lRS4sq+Deevg3KI5xm9DG5VipU45bSzbHYLB4fFxqYjMsrwdWjiP8AhQwaUZ08RRpSxOFpSrV6HLUpqUfxu/Zo/bp/bY/Za+A/hfxJ8Vfhf46+Ivw71D4vtp1gnivwjr9j4hbwPHol1L40/svxGthAmmyWXiK60K58PT+JLe7t9Zv7rxBYwTG3srh7D5jAZtm2X4OnPEYatiKMsVyxU6VT2rpcj9ooSUdH7Rw9nzp88nKK0Wn8Y+GPjv43+FfAWVZlxXwtn3EnDuJ4x+q4aGa5PmFHMpZGsDVlnKweYxw8Fh50cyrYCpls8xpVoY3EVcww9OTp0Zuh+hP7Sf8AwWI/YZ/ZU+A9l8WYPI1X4heMItR1bwT8ArDQrXwv8VNW8Q38z3N/qHivR7i1E3hDRpdTuJZ9V8Zamk1pq7m5l0B/EV2fKf8AfvDrw14g8Qq1Cpl2X4jLMolLnxWb5jga+EoUI8z9oqcK0KU8ViZO/LSo3TbVSpUhSkqj/vPBeKPAf+qmC4pyrLa2Dnm31jGYTJcZks8jzt4yvVnUxVbG4LE4ejWw/tMROpUrY9qpSxcpSrYatilNSl/Mz+3P+3n/AMFQv21vhR+zf8XfCHw38f8AhH4UeJ5PH1odB+Dfwy8Waros3xDtvGut2VnoWq6hfaPrWpeJbST4aXPgttPkZl8PeJLnVPEtvHY3FxY31pY/1ZwVwP4bcHZpxDlWLzDA4rNMMsDP2+b5jhaVZYCWDoznWpQhVo08PNZjHGe0SX1jDxp4eTnGM4Sn+dcT8U8bcSYDJ8fh8HisPga7xcfZZdgq9Sm8XHE1YxpTnKnUnWi8E8Nyv+DWlUrJRbjKMf6RfjV4P+N+u/8ABJr9nDQPiN8NLbSfi1pKfspXvxJ8AeF/hFP4+0XwtH4d8XeE7nxAup/BPwVbqNb0XRNKtftHijwLodvFYQCO/wBNtUS1tkSv56yfF5NQ8UuIa+X5jKrlVV8UQy7HYnNY4GtiXiMLio0HTznGSfsa1arLlw2NrSc3eFSTc5Nn7FmOHzKrwHk9LGYKNPH01kUsZhaOAeLp0FSxFB1ufLcMv3tOnTjethaSUV70ElFHy74I179qn4QfBLw14N+FngD48+ENQuf2gPjF8UvAvi/wx8LvGPhPwN4/8Nax8efAJPhqL9nJfB/iu4+D/hPVfB3ivxzeeGvAHjnXPCWgaH4V8J6j4o027m1nWNPtrD6XG0OGM2znEYzM8dkeLpxyLKcsxuExOZYTFY3AYmjkeO/2h8QfW8LHNsVSxeFwUMRjsFQxVeticVTw1SCo0qkp+HhqueZfltHD4HC5ph5vNcxx2FxFHA4ihhsXRqZphf3Kyf6vXeX0J4eviZUcLiqlCjSoUJ14SdSpCMfR18W/tG2nxh8dfFrxf4R/ab8WfEbw78Nf2j/APivSNP8ABmueHfCXwytPEn7VHg3w98Nbr4PeItM+H2qprGhaf8FbfTviDqs/hP8A4WN4r1vQ9M1PU7W1tPFDS21t5/1Xh+eU4LKsJiuHMLl+IzHh7HYWrPGUcRisxnh+GcXXzGObYepj6Xsq9TOJVMBSWK/s/C0a1SlTlKWGtKXb9YziOYYrH4ihnVfGUcHnGFr044epRw+CjWzzD0cHLL60MJP2lKGWqGLqOh9cr1KcJzio1m0ui+H/AIv/AG+fEnhex17W/FP7QGmXnwvvtDh8L6WPh1HpsXxQ0r/htG98EJqfxAs/EfgW08T+IGvf2cZrS+vYGi8NXkej+V441KxtdaSS5jwx+E4Gw+JnQo4XIqkMyhWeJqf2g6jy2r/qfDGungJ4fGyw1Dk4hjKEJXxEHVvgqc5UWovXCYjimtQjVqV81hLBSpKhD6moLHQ/1jlhlPFxrYWNeq55O4ykmqMlTtiZxjUTa3/H37Jfxr+MH7ef7RPj3wz4T8F+DNE8J/Ev9kL4leGfjh4p0XxJD8ULkfCzwLe6trHgH4J63bW1posnhrxpqEUfgr4lPe66NKj0nXtetr7RtQvjp7Q8+B4pybKeB8gwOJxWMxlbFZdxXl2JybDVsO8tj/aeNhSpY7OaMpTqrEYOm3jMuUKHtHVoUJQrU4c6e2LyHMsw4ozfFUKGHw9OhjeH8ZRzOvTrLGv6jhZVKmFy2qoxp+xxMksNjOar7NU6tVSpzly25v4HeIv+CgHjzQ/A+l/Ef4ifF3QG8dfFLwhovxi0rQ/APiHRviH8KdVj+EPxn1T4k6fp/ivxn8LLDwlpXw/1jxzpHgS28OXHgU+M9J8PTRafFpnjO5/4SNFm6c6w/AuBrY2rl+Ayqv8AUssxdbKatbHUK2AzOm81yinl1SphcHmdTFVcfSwVXGyxEcb9Uq106jqYOP1fTDLK3FeKpYWnjMXmFL61jsPTzCFLC1aeMwNRZfmNTGQjXxGBjh4YSpiqeGVF4V4iFFqChiZe2150/tB/8FFLrQpPhn4VvPFOtfGG0/Y0079qi8j1Hwl4XtvFdj4jHgtvhLP8HtR8LyaRbXFj4q1b4hnVvi5o1reWUVxqV/oltpFoTp88+lHo/sHgCNdZjioYWjlMuLqnDMHTxWJlhZ4f65/asc2p4lVZRnhaWA9llVaUJuNOFaVWfvxVUy/tbi6VL6lQlXqZhHh2GeSU6FBV41vq31B5fOi6alGvUxftMfTjKKlOdONOPuNwOZ8QyfttwS6N8WfALfEL4oeONA/Z1/aU0fwT40uPh98QLHxP4Y8J6/8AHX9mC4m8Laq3j74f+CtV8UfFDR/Adj8RdZ8JXUvgWK51qXSzbaLpniOfSB9s6KC4Nkq2V45YDLcFXz/h2tjMHHH4GeGxOKoZJxJFYml9Rx+MpYbLa2Onl9HFRWOcaKqc1aph41fcwqviROnj8K8XjcVSyjOaeGxLwmLjWoYermmSN0J/WsJhp18bTwscXUoN4VSqOHLThWdP3vWj4g/brk8O2F/pXxN+Mvia18GfDGPx74Ln8J/DnXrCHxnr8v7UC6DpHgz4iN8R/hd4f8b+LtT0b4Pmey1y3/sDwe3iDSnj8VNaJPbRak/l+w4JWInCrluUYaWMzJ4HGLFZhQqPB0Fw17erjMvWX5nXwWEp1s2tOjL2+LWHqp4VScZOmvQ9rxO6UZQxuY1o4fBfWsNKhg6sViarztUqeHxf1zA0sTiJ08vvGqvZUPa037flvFTPBb39s79oa4b4s69a/F/4pPHqfjdvCnhD4bWOm6Cni34k6Tqv7bGgfC6Pxb8B7j/hXFzpng/RNI+HkT/C2aWLWvidqUPirxNbeKRpMk8TTn24cIZBH+y6EspyxOng/rWLzGdSu8Ll1WlwdXzN4XPI/wBoRqYutVx7/tOKdHLacsNhpYb2qT5TypcRZs/r9WOYY5qeJ9hh8HGFL2+Mpz4kpYJYjK5fU3DD0qeETwLaqY2ar1lX5G1c9Y8I/tEftZ64/wCzv/wiviD4t/Eq90zxN4e/4Sjx7ovhnXtY+H3j/wALeMPi58RPDvj3wH4m07S/hXpGiaf4w/Z78O6VoPhrx94p8W3ngjV5PEUen6l4U8PXVjPqN5feZisg4WorP/rNDKsuhUw2I+rYGtiKFLH4HFYTKsBiMDjsNUqZnVrVMJn2Iq18RgcNhYYyksO6lPFYiM1ThDvw+b59V/sj2FXH4yUK1L22KpUKtTCYqhiMwxdHFYWtCGBp0oYjKaNOlRxVevLDVPbKE6FGUXOU+otviB+2b4avf2S9FN7+0zr/AIz1GT4D+Ovif4m8U+Fpb/wt4vs/iv8AEi40X4zfD6/8LeDvhfa+FvB9j8JvCemrqV9c+NPEXh3VvD9j4g0K58MjVruLVLp+WWA4QxMOKa3Jw5QwdNZ3gstw2FxKhicJPK8ujWyjHwxOLzKWJxc80xVR04RweHxFKvOhXjifZRdOK2WL4joyyGnzZzVxM/7LxWNrV6DnQxEcdjJU8xwk6GHwUaGHjgKEOeTxNWjUpRq0nR52pyPaP2y/iF4sT9pLwj4h+FXw1+Mvj/Vf2efgH+0E3jp/BXhLxboMOk3vxXl+EOheD/8AhGPGd74Yv9J8Ta7Hax634mew8C2PjPXbHRfDmtywaYdUggs5fH4RwGFfDuKw+Z5jlGBpZ/nuQ/UljMVha7qwytZrXxf1nBwxMKuGoOTo4ZTxs8HQnWxFFSq+ycpr0eIsXiP7Zw9XA4PMcVPKcqzb619Ww9ekqcsc8vpYf2OJlQnCtVUVVrOGFjiKsadGo1D2iUX846X4m/b58SeGntrbx9+0bo8HgPRfHV14N1zT/htHa6j47+wftiaN4H8GXXiy38dfDm31/wAQtL8ANS1DU7a01bStB1HVdHt4vGesaeb20kmr6GrhuBsPiFKWB4fqvHVsFHGUamYuVPA8/CVbG4yOFlgswlQw9s9p06cp0qlenSqyeEo1OSSR5EK3FVai1HFZvTWFp4qWGqxwajLFcvENPDYeVdYrCKrWvlU5zUalOlOpTSxNSHNFs7Dzv2yv+E7tPCMepfGq3sofipqPwik+MC/Drw7P8Sbn4M2n7aeoaHbajceOrrwNPbNHc/BcW92NeFgun/2L5PjOK2GoAao3JbhH6jPFOnk8pyyynmqyn+0MRHL45vPg+nWlTjgo41SvHOOaPsOd1Pbc2DcvZ/ujovxF9ajQU8yUVjp5e8w+qUXjHl0eI50lN4mWFcdcutL2vJyeztiUub33znh/40/txHVP2bPDt/oX7Q0Hizwp8QzoXi3xDrXg/Wbvw98WPhfdftEfFzwBd3ni7RtH+Hg8LWOr+GfhR4T8C+JPEHjHxJ4j8J3t/J4p0TxB4N0S6tr3UZm6K+T8F+z4ir06+QSwuKwHt8Lh6OLowxGV5lHIMqx0IYStVx/1mdLEZpisbh6GEw+HxUILDVqGLrQlCmljSzLib2mTUZ0s2Vehi/ZV6tTD1JUcfgpZvj8JKWIp08J7CNShgKGFrVcRWrUJSdelVw9KSlNn1p+xxc/tKPqGvaP8dvE3xq8VaB4u/ZN+BnxI1a/8ceHdP0TVPDvxm8WReO7T4o+FvBNz4e8NeG10e506xsvDpPg9kvtQ0K/jtL8TR3GqT+d8txbHh1U6FbJMNk+Fr4XijOsvpQweIqVqWIyjCvBTyzE42OIxOI9rGpOeI/2u8Kdem5Q5XGlHl97h6Wc81WnmlbMq9LEZDlmMqSxNGNOpRzGusVHG0MNKlRoqnKEY0f8AZ/enSlyyunN3+Ffg2vxQ+DXhZvg58N/Dvxe8M/st+FPiX8PdL8U/tU/C/wDZo8TfDH9pTxp4Pv8A4e+PbweH/GfhHWPBOs+KPHfinwb44s/B2l+OPjtong69l8RxeI1tZbOzuZdev4vtc3/s3N8Ss3zHEZVieJcVl2Pq4bhnMuIsNmXDuDxcMfgYe3weLpYyjhsFhsXgp4urgskrYuCw7w7mpyiqEH8xl317LqH9nYOjmFHJKGMwkK+eYLJq2CznE4eWExUvZYmhUw1Sviq+HxMcPDE5pTw8nWVblcYt1ZrZ1Lx/+3nqGhXmhfEfS/iX8QPGXjX9nX4Papqfg2w+EYfwL8GvGWjeKfht/wAJZF420PWfh7eeDfiT4n+Jml6peeIba78HeLr+9+Huu6X4v0DUfCFlpmk6Xq1tlTwHBFOtCvl9TLsBhMHxBm1KnjJ5rbG5vhK2FzH6q8HWo4+GMy7DZdVpQoSji8LThj6FXCV6eLnUq1KUtJ4viiVKVLGQxuLxGJyjL5zw0MBfC5diKdfB+3WJpVMJLD4yvjYTlVUsPiJywlWGIpTw8YU4VI9neeLv2mPiz8eNY0zUPBPxytPhjD8e/wBnbxRJ4N8Y+GPE+o2PgXxD8Mv26vCej3GqaL4ouPBfhzQ10TV/hJoo+Il7pnhLVfFnhnTvB9zYarqOtNqsWpzS8cMJw5leSUqlPGZLPMnkef4ZYzCYnDU542hmXBWKqxpVsNHGYit7almtb+z4VMVSwuJqYuNSlTo+ydJLpliM5x+aVITw2ZxwSzXKK7w+IoVpxwtXBcT0KbnSrvD0aSp1MBT+tyhQnXoww7hOVX2im3+8FfiJ+oBQAUAFADWRHXYyKy/3WUFfyII/SgTjFqzSa7NJr7j55u/2Qv2Tb/xPP42vv2X/ANne88Z3N4NQufF138FPhrceJ7i/DBhfT6/N4ZfVZbwMAwuZLtptwB35FfQR4s4phho4OHEvEEcJGHs44WOc5jHDRp7ckaCxKpKFvsqNvI8qWQZFOu8TPJcpniXLmeIll2DlXcv5nVdF1HLzcrn0DbWtrZ28FpaW0FraWsaQ21rbQxwW9vFEAscUEMSrHFHGoCokaqqAAKABXgynKcpTnKUpybcpSblKTe7lJttt9W3qerGMYpRilGMUkoxSSSWySWiS6JE9SMKACgAoAKACgDnLDwf4S0rxHr3jDS/C3hzTfFviq30u08T+KbDRNMs/EfiO10OKaDRLbXtbt7WPU9Yt9HhuLiHS4dQuriPT4p5o7RYUlcN0TxeKq4ehhKuJxFTC4WVWWGw061SeHw8qzTrSoUZSdOlKq4xdV04xdRxTndpGMcPh4VquIhQowxFdQjWrxpQjWrRpJqnGrVUVOoqabUFOTUE2o2uzo65zYKAPH2/Z5+ALjxQG+B3wfYeOHjk8ahvhn4LI8XyRan/bcT+KAdEP/CQPHrP/ABN421b7WU1P/T1Iuv3tet/b+er6tbOs2X1JNYP/AIUcZ/sidP2LWG/ffuE6P7p+y5L0/c+HQ8/+ycqft75Zl7+s2eJ/2LDf7Q1P2qdf93+9tU/eL2nNafv/ABanonhrwx4a8GaHp3hjwf4e0Pwp4a0iE22k+HvDWk2GhaHpduZHmMGnaTpdva2FlCZZJJTFbW8SGSR3K7mYnz8RicRjK1TE4vEVsViKr5quIxFWpXrVZWS5qlWrKVSbskryk3ZJdDro0KOGpQoYejSoUaatTo0acKVKCve0KcFGEVdt2ikrs3KxNQoAKACgAoAKACgAoAKACgAoAKAA/9k="
                var doc = new jsPDF('l', 'mm', [95, 210]);
                doc.addImage(imgData, 'PNG', 10, 6, 45, 10);

                doc.setProperties({
                    title: 'Cetak Rencana Kontrol/Inap',
                    subject: 'Rencana Kunjungan Kontrol/Inap'
                });

                doc.setFontSize(11);
                jnspelayanan == 2 ? doc.text(58, 10, 'SURAT RENCANA KONTROL') : doc.text(58, 10, 'SURAT RENCANA INAP');
                doc.text(58, 15, ppkperujuk);

                doc.setFontSize(12);
                doc.text(140, 10, 'No.  ' + norujukan);
                doc.setFontSize(10);
                var _tglberlakurjk = new Date(tglrencanakontrol);
                _tglberlakurjk.setDate(_tglberlakurjk.getDate());

                var _ddrujuk = _tglberlakurjk.getDate();
                var _mmrujuk = _tglberlakurjk.getMonth() + 1;
                var _mmmrujuk = strbulan((('' + _mmrujuk).length < 2 ? '0' : '') + _mmrujuk);
                var _yrujuk = _tglberlakurjk.getFullYear();
                var _tglrencanakontrol = [_ddrujuk, _mmmrujuk, _yrujuk].join(' ');


                doc.setFontSize(10);
                jnspelayanan == 2 ? doc.text(10, 25, 'Kepada Yth') : doc.text(10, 25, '');

                doc.text(10, 35, 'Mohon Pemeriksaan dan Penanganan Lebih Lanjut :');
                doc.text(10, 40, 'No.Kartu');
                doc.text(10, 45, 'Nama Peserta');
                doc.text(10, 50, 'Tgl.Lahir');
                doc.text(10, 55, 'Diagnosa');
                jnspelayanan == 2 ? doc.text(10, 60, 'Rencana Kontrol') : doc.text(10, 60, 'Rencana Inap');

                if (jnspelayanan == 2) {
                    doc.text(40, 25, nmdpjprencanarujuk);
                    doc.text(40, 30, 'Sp./Sub. ' + polirencanarujuk);
                }
                doc.text(40, 40, ': ' + nokartu);
                doc.text(40, 45, ': ' + nmpst + ' (' + jnskelamin + ')');

                var _tgllahir = new Date(tgllahir);
                _tgllahir.setDate(_tgllahir.getDate());

                var _ddlahir = _tgllahir.getDate();
                var _mmlahir = _tgllahir.getMonth() + 1;
                var _mmmlahir = strbulan((('' + _mmlahir).length < 2 ? '0' : '') + _mmlahir);
                var _ylahir = _tgllahir.getFullYear();
                var _tgllahir = [_ddlahir, _mmmlahir, _ylahir].join(' ');

                var _tglentrirencanakontrol = new Date();
                var _dd2 = _tglentrirencanakontrol.getDate();
                var _mm2 = _tglentrirencanakontrol.getMonth() + 1;
                var _mmm2 = strbulan((('' + _mm2).length < 2 ? '0' : '') + _mm2);
                var _y2 = _tglentrirencanakontrol.getFullYear();
                var tglentrirencanakontrol = [_dd2, _mmm2, _y2].join(' ');


                doc.text(40, 50, ': ' + _tgllahir);
                //diagnosa
                var dx = dxHIV(kddx) == true ? kddx : dxawal;
                doc.text(40, 55, ': ' + dx);
                doc.text(40, 60, ': ' + _tglrencanakontrol);

                doc.text(10, 67, 'Demikian atas bantuannya,diucapkan banyak terima kasih.');

                doc.setFontSize(8);

                //tanggal+time
                var d = new Date();
                var strDateTime = [[AddZero(d.getDate()),
                AddZero(d.getMonth() + 1),
                d.getFullYear()].join("-"),
                [AddZero(d.getHours()),
                AddZero(d.getMinutes())].join(":"),
                d.getHours() >= 12 ? "PM" : "AM"].join(" ");

                doc.setFontSize(6);
                doc.text(10, 87, 'Tgl.Entri: ' + tglterbitrencanakontrol + ' | Tgl.Cetak: ' + strDateTime);

                //tanggal        
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var tgl = (('' + day).length < 2 ? '0' : '') + day + ' ' +
                    strbulan((('' + month).length < 2 ? '0' : '') + month) + ' ' +
                    d.getFullYear();

                doc.setFontSize(10);
                //doc.text(135, 70, tgl);
                if (nmdpjpsepasal == null) nmdpjpsepasal = '-'
                doc.text(150, 72, 'Mengetahui DPJP,');
                doc.text(150, 87, jnspelayanan == 2 ? nmdpjpsepasal : nmdpjprencanarujuk);


                var string = doc.output('datauristring');
                var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
                var x = window.open('', '_blank', 'width=1024,height=600,directories=0,status=0,titlebar=0,scrollbars=0,menubar=0,toolbar=0,location=0,resizable=1');
                x.focus();
                x.document.write(iframe);
                x.document.close();

            }

            function strbulan(id) {
                var nama;
                switch (id) {
                    case '01':
                        nama = 'Januari';
                        break
                    case '02':
                        nama = 'Februari';
                        break
                    case '03':
                        nama = 'Maret';
                        break
                    case '04':
                        nama = 'April';
                        break
                    case '05':
                        nama = 'Mei';
                        break
                    case '06':
                        nama = 'Juni';
                        break
                    case '07':
                        nama = 'Juli';
                        break
                    case '08':
                        nama = 'Agustus';
                        break
                    case '09':
                        nama = 'September';
                        break
                    case '10':
                        nama = 'Oktober';
                        break
                    case '11':
                        nama = 'Nopember';
                        break
                    case '12':
                        nama = 'Desember';
                        break
                }
                return nama;
            }

            function AddZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }
            function dxHIV(kode) {
                var str = "B20,B20.0,B20.1,B20.2,B20.3,B20.4,B20.5,B20.6,B20.7,B20.8,B20.9,B21,B21.0,B21.1,B21.2,B21.3,B21.7,B21.8,B21.9,B22,B22.0,B22.1,B22.2,B22.7,B23,B23.0,B23.1,B23.2,B23.8,B24";
                var ret = str.includes(kode);
                return ret;
            }
            $scope.listPel = [
                { kode: 1, nama: 'Rawat Inap' },
                { kode: 2, nama: 'Rawat Jalan' }
            ]
            $scope.listTipeRujukan = [
                { "nama": "Penuh", "kode": 0 },
                { "nama": "Partial", "kode": 1 },
                { "nama": "Rujuk Balik", "kode": 2 }
            ];
            $scope.rujukan.pelayanan = $scope.listPel[1]
            $scope.rujukan.tipe = $scope.listTipeRujukan[0].kode
            $scope.rujukan.tglRujukan = new Date()
            $scope.rujukan.tglRencanaKunjungan = new Date()
            $scope.rujukan.dari = new Date()
            $scope.rujukan.sampai = new Date()
            $scope.popRujukan = function () {
                $scope.rujukan.SEP = $scope.model.noSep;
                $scope.popUpRuj.center().open()
            }
            $scope.tutupRujuk = function () {
                $scope.popUpRuj.close()
            }
            $scope.comboBoxOptions3 = {
                placeholder: "ketik minimal 3 karakter",
                dataTextField: "nama",
                autoBind: "false",
                minLength: 3,
                dataValuetField: "kode",
                filter: "contains",
                filtering: function (e) {
                    getFaskesna(e.filter.value);
                }
            }

            function getFaskesna(nama) {
                if (nama.length < 3) return
                let json = {
                    "url": "referensi/faskes/" + nama + "/2",
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listFaskesRuj = e.data.response.faskes
                    }
                    else toastr.info(e.data.metaData.message, 'Info')
                })
            }
            $scope.comboBoxOptions2 = {
                placeholder: "ketik minimal 3 karakter",
                dataTextField: "nama",
                autoBind: "false",
                minLength: 3,
                dataValuetField: "kode",
                filter: "contains",
                filtering: function (e) {
                    getPolina(e.filter.value);
                }
            }

            function getPolina(nama) {
                if (nama.length < 3) return
                var json = {
                    "url": "referensi/poli/" + nama,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listPolina = e.data.response.poli
                    }
                    else toastr.info(e.data.metaData.message, 'Info')
                })
            }
            $scope.comboBoxOptions4 = {
                placeholder: "ketik minimal 3 karakter",
                dataTextField: "nama",
                autoBind: "false",
                minLength: 3,
                dataValuetField: "kode",
                filter: "contains",
                filtering: function (e) {
                    getDiag(e.filter.value);
                }
            }

            function getDiag(nama) {
                if (nama.length < 3) return
                var json = {
                    "url": "referensi/diagnosa/" + nama,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDiagna = e.data.response.diagnosa
                    }
                    else toastr.info(e.data.metaData.message, 'Info')
                })
            }
            $scope.cariRujukan2 = function () {
                if (!$scope.rujukan.SEP) return
                $scope.isRouteLoading = true
                $scope.isRujukan = false
                var json = {
                    "url": "SEP/" + $scope.rujukan.SEP,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false
                    if (e.data.metaData.code == 200) {
                        for (let x = 0; x < $scope.listPel.length; x++) {
                            const element = $scope.listPel[x];
                            if (element.nama == e.data.response.jnsPelayanan) {
                                $scope.rujukan.pelayanan = element
                                break
                            }
                        }
                        $scope.rujukan.tglRujukan = new Date(e.data.response.tglSep)
                        $scope.isRujukan = true

                        var json = {
                            "url": "Peserta/nokartu/" + e.data.response.peserta.noKartu + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD'),
                            "method": "GET",
                            "data": null
                        }
                        medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (z) {
                            $scope.isRouteLoading = false
                            if (z.data.metaData.code == 200) {
                                $scope.rujukan.rujukFaskes = z.data.response.peserta.provUmum.kdProvider + '-' + z.data.response.peserta.provUmum.nmProvider

                            }
                        })
                    }
                    else toastr.info(e.data.metaData.message, 'Info')
                })

            }
            $scope.saveRujuk = function () {

                var json = {
                    "url": "Rujukan/2.0/insert",
                    "method": "POST",
                    "data":
                    {
                        "request": {
                            "t_rujukan": {
                                "noSep": $scope.rujukan.SEP,
                                "tglRujukan": moment($scope.rujukan.tglRujukan).format('YYYY-MM-DD'),
                                "tglRencanaKunjungan": moment($scope.rujukan.tglRencanaKunjungan).format('YYYY-MM-DD'),
                                "ppkDirujuk": $scope.rujukan.tipe == 0 || $scope.rujukan.tipe == 1 ? $scope.rujukan.faskes.kode : $scope.rujukan.rujukFaskes.split('-')[0],
                                "jnsPelayanan": $scope.rujukan.pelayanan ? $scope.rujukan.pelayanan.kode : "",
                                "catatan": $scope.rujukan.catatan ? $scope.rujukan.catatan : "",
                                "diagRujukan": $scope.rujukan.diagnosa ? $scope.rujukan.diagnosa.kode : "",
                                "tipeRujukan": $scope.rujukan.tipe,
                                "poliRujukan": $scope.rujukan.tipe == 2 ? "" : ($scope.rujukan.poli ? $scope.rujukan.poli.kode : ""),
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                $scope.isSave = true
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (x) {
                    $scope.isRouteLoading = false
                    $scope.isSave = false
                    if (x.data.metaData.code == 200) {
                        let response2 = x.data.response.rujukan
                        var ppk = ""
                        var ppkNama = ""
                        if ($scope.rujukan.tipe == 0 || $scope.rujukan.tipe == 1) {
                            ppk = $scope.rujukan.faskes.kode
                            ppkNama = $scope.rujukan.faskes.nama
                        } else {
                            ppk = $scope.rujukan.rujukFaskes.split('-')[0]
                            ppkNama = $scope.rujukan.rujukFaskes.split('-')[1]
                        }
                        if (response2 != undefined) {
                            var data = {
                                tipe: $scope.rujukan.insert == undefined ? 'save' : 'update',
                                nosep: $scope.rujukan.SEP,
                                tglrujukan: response2.tglRujukan,
                                jenispelayanan: $scope.rujukan.pelayanan.kode,
                                ppkdirujuk: response2.tujuanRujukan.nama,
                                kdppkdirujuk: ppk,
                                catatan: $scope.rujukan.catatan,
                                diagnosarujukan: response2.diagnosa.nama,
                                polirujukan: response2.poliTujuan.nama,
                                tiperujukan: $scope.rujukan.tipe,
                                nama: response2.peserta.nama,
                                nokartu: response2.peserta.noKartu,
                                tglsep: null,
                                sex: response2.peserta.kelamin,
                                norujukan: response2.noRujukan,
                                nocm: response2.peserta.noMr,
                                tglBerlakuKunjungan: response2.tglBerlakuKunjungan,
                                tglRencanaKunjungan: response2.tglRencanaKunjungan,

                            };
                        } else {
                            var data = {
                                tipe: $scope.rujukan.insert == undefined ? 'save' : 'update',
                                nosep: $scope.rujukan.SEP,
                                tglrujukan: moment($scope.rujukan.tglRujukan).format('YYYY-MM-DD'),
                                jenispelayanan: $scope.rujukan.pelayanan.kode,
                                ppkdirujuk: ppkNama,
                                kdppkdirujuk: ppk,
                                catatan: $scope.rujukan.catatan,
                                diagnosarujukan: $scope.rujukan.diagnosa ? $scope.rujukan.diagnosa.kode : "",
                                polirujukan: $scope.rujukan.tipe == 2 ? "" : ($scope.rujukan.poli ? $scope.rujukan.poli.kode : ""),
                                tiperujukan: $scope.rujukan.tipe,
                                // nama: response2.peserta.nama,
                                // nokartu: response2.peserta.noKartu,
                                // tglsep: null,
                                // sex: response2.peserta.kelamin,
                                norujukan: $scope.rujukan.noRujukan ? $scope.rujukan.noRujukan : "",
                                // nocm: response2.peserta.noMr,
                                // tglBerlakuKunjungan: response2.tglBerlakuKunjungan,
                                tglRencanaKunjungan: moment($scope.rujukan.tglRencanaKunjungan).format('YYYY-MM-DD'),

                            };
                        }

                        medifirstService.postNonMessage("bridging/bpjs/save-rujukan", data).then(function (z) {

                        })

                        toastr.success(x.data.metaData.message, 'Info')
                    } else
                        toastr.info(x.data.metaData.message, 'Info')
                })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.columnGridRujukan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Rujukan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Sheets";

                    var myHeaders = [{
                        value: "Daftar Rujukan",
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
                        "command": [
                            {
                                text: " Cetak",
                                click: cetakRuj,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: " Hapus",
                                click: hapusRuj,
                                imageClass: "k-icon k-delete"
                            }],
                        title: "",
                        width: "200px",
                    },
                    {
                        "field": "tglrujukan",
                        "title": "Tgl Rujukan",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglrujukan #')}}</span>"
                    },
                    {
                        "field": "tglrencanakunjungan",
                        "title": "Tgl Rencana Kunjungan",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglrencanakunjungan #')}}</span>"
                    },
                    {
                        "field": "norujukan",
                        "title": "No Rujukan",
                        "width": "150px"
                    },
                    {
                        "field": "nocm",
                        "title": "NoRM",
                        "width": "70px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "nama",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: nama #</span>"
                    },

                    {
                        "field": "nosep",
                        "title": "No SEP",
                        "width": "150px",
                        "template": "<span class='style-left'>#: nosep #</span>"
                    },
                    // {
                    //     "field": "tglsep",
                    //     "title": "Tgl SEP",
                    //     "width": "80px",
                    //     "template": "<span class='style-left'>{{formatTanggal('#: tglsep #')}}</span>"
                    // },
                    {
                        "field": "nokartu",
                        "title": "No Kartu",
                        "width": "90px",
                        "template": "<span class='style-left'>#: nokartu #</span>"
                    },
                    {
                        "field": "jenispelayanannama",
                        "title": "Jenis Pelayanan",
                        "width": "80px",
                        "template": "<span class='style-left'>#: jenispelayanannama #</span>"
                    },
                    {
                        "field": "tiperujukannama",
                        "title": "Tipe",
                        "width": "80px",
                        "template": "<span class='style-left'>#: tiperujukannama #</span>"
                    },

                    {
                        "field": "namaruangan",
                        "title": "Poli Rujukan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },

                    {
                        "field": "ppkdirujuk",
                        "title": "PPK Dirujuk",
                        "width": "150px",
                        "template": "<span class='style-left'>#: ppkdirujuk #</span>"
                    },

                    {
                        "field": "diagnosarujukan",
                        "title": "Diagnosa",
                        "width": "300px",
                        "template": "<span class='style-center'>#: diagnosarujukan #</span>"
                    },
                 
                ]
            };

            function hapusRuj(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                let json = {
                    "url": "Rujukan/delete",
                    "method": "DELETE",
                    "data":
                    {
                        "request": {
                            "t_rujukan": {
                                "noRujukan": dataItem.norujukan,
                                "user": "Ramdanegie"
                            }
                        }
                    }
                }
                medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var data = {
                            tipe: 'delete',
                            norujukan: dataItem.norujukan,
                        };
                        medifirstService.post("bridging/bpjs/save-rujukan", data).then(function (z) {
                            $scope.cariRujukanList()
                        })
                        toastr.info(e.data.metaData.message, 'Information');
                    } else {

                        toastr.warning(e.data.metaData.message, 'Warning');
                    }
                }).then(function () {
                });
            }
            function cetakRuj(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                vcetak(dataItem.norujukan,
                    dataItem.tglrujukan, dataItem.nokartu,
                    dataItem.nama, dataItem.tgllahir,
                    dataItem.ppkdirujuk, namappkRumahSakit,
                    dataItem.namaruangan, dataItem.sex,
                    dataItem.diagnosarujukan, dataItem.catatan,
                    dataItem.tiperujukan, dataItem.jenispelayanan, 
                    dataItem.diagnosarujukan,
                    dataItem.tglrencanakunjungan
                )
            }

            $scope.cariRujukanList = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.rujukan.dari).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.rujukan.sampai).format('YYYY-MM-DD');

                var noRujukan = ""
                if ($scope.rujukan.noRujukan != undefined) {
                    noRujukan = "&norujukan=" + $scope.rujukan.noRujukan
                }
                var rm = ""
                if ($scope.rujukan.nocm != undefined) {
                    rm = "&nocm=" + $scope.rujukan.nocm
                }

                medifirstService.get("bridging/bpjs/get-daftar-rujukan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    noRujukan + rm
                )
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var result = data.data.data
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].jenispelayanan == 1 && result[i].jenispelayanan != null)
                                result[i].jenispelayanannama = 'Rawat Inap'
                            else
                                result[i].jenispelayanannama = 'Rawat Jalan'

                            if (result[i].tiperujukan == "0")
                                result[i].tiperujukannama = 'Penuh'
                            else if (result[i].tiperujukan == "1")
                                result[i].tiperujukannama = 'Partial'
                            else if (result[i].tiperujukan == "2")
                                result[i].tiperujukannama = 'Rujuk Balik'
                        }
                        $scope.dataSourceRuj = new kendo.data.DataSource({
                            data: result,
                            pageSize: 10,
                            total: result,
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
            function vcetak(n, t, i, r, u, e, o, h, c, l, a, v, y, p, w) {
                var k = new jsPDF("l", "mm", [95, 210]),
                    nt, g, ct, tt, d, at;
                var imgData = "data:image/jpeg;base64,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"

                k.addImage(imgData, "JPEG", 10, 6, 45, 10);
                k.setProperties({
                    title: "Cetak Rujukan",
                    subject: "RUJUKAN"
                });
                k.setFontSize(11);
                k.text(58, 10, "SURAT RUJUKAN");
                k.text(58, 15, o);
                k.setFontSize(12);
                k.text(140, 10, "No.  " + n);
                k.setFontSize(10);
                nt = new Date(t);
                nt.setDate(nt.getDate());
                var pt = nt.getDate(),
                    st = nt.getMonth() + 1,
                    wt = f((("" + st).length < 2 ? "0" : "") + st),
                    bt = nt.getFullYear(),
                    kt = [pt, wt, bt].join(" ");
                k.text(140, 15, "Tgl. " + kt);
                k.text(140, 30, v == "0" ? "== Rujukan Penuh ==" : v == "1" ? "== Rujukan Partial ==" : "== Rujuk Balik (Non PRB) ==");
                k.text(140, 35, y == "1" ? "Rawat Inap" : "Rawat Jalan");
                k.setFontSize(10);
                k.text(10, 25, "Kepada Yth");
                k.text(10, 35, "Mohon Pemeriksaan dan Penanganan Lebih Lanjut :");
                k.text(10, 40, "No.Kartu");
                k.text(10, 45, "Nama Peserta");
                k.text(10, 50, "Tgl.Lahir");
                k.text(10, 55, "Diagnosa");
                k.text(10, 60, "Keterangan");
                y == "1" ? k.text(40, 25, ": " + e) : v == "2" ? k.text(40, 25, ": " + e) : v == "1" ? k.text(40, 25, ": " + e) : (k.text(40, 25, ": " + h), k.text(40, 30, "  " + e));
                k.text(40, 40, ": " + i);
                k.text(40, 45, ": " + r + " (" + c + ")");
                g = new Date(u);
                g.setDate(g.getDate());
                var dt = g.getDate(),
                    ht = g.getMonth() + 1,
                    gt = f((("" + ht).length < 2 ? "0" : "") + ht),
                    ni = g.getFullYear(),
                    g = [dt, gt, ni].join(" ");
                k.text(40, 50, ": " + g);
                ct = b(p) == !0 ? p : l;
                k.text(40, 55, ": " + ct);
                k.text(40, 60, ": " + a);
                k.text(10, 67, "Demikian atas bantuannya,diucapkan banyak terima kasih.");
                tt = new Date(t);
                tt.setDate(tt.getDate() + 90);
                var ut = tt.getDate(),
                    it = tt.getMonth() + 1,
                    ft = f((("" + it).length < 2 ? "0" : "") + it),
                    et = tt.getFullYear(),
                    ti = [ut, ft, et].join(" "),
                    rt = new Date(w);
                rt.setDate(rt.getDate());
                var ut = rt.getDate(),
                    it = rt.getMonth() + 1,
                    ft = f((("" + it).length < 2 ? "0" : "") + it),
                    et = rt.getFullYear(),
                    lt = [ut, ft, et].join(" ");
                k.setFontSize(8);
                v == "1" ? (k.text(10, 73, v == "1" ? "* Rujukan ini Rujukan Parsial, tidak dapat digunakan untuk penerbitan SEP pada FKRTL penerima rujukan." : ""), k.text(10, 77, "* Tgl.Rencana Berkunjung " + lt)) : v == "0" && (k.text(10, 73, "* Rujukan Berlaku Sampai Dengan " + ti), k.text(10, 77, "* Tgl.Rencana Berkunjung " + lt));
                d = new Date;
                at = [
                    [s(d.getDate()), s(d.getMonth() + 1), d.getFullYear()].join("-"), [s(d.getHours()), s(d.getMinutes())].join(":"), d.getHours() >= 12 ? "PM" : "AM"
                ].join(" ");
                k.setFontSize(6);
                k.text(10, 87, "Tgl.Cetak." + at);
                var vt = d.getMonth() + 1,
                    yt = d.getDate(),
                    ui = (("" + yt).length < 2 ? "0" : "") + yt + " " + f((("" + vt).length < 2 ? "0" : "") + vt) + " " + d.getFullYear();
                k.setFontSize(10);
                k.text(150, 77, "Mengetahui,");
                k.text(150, 85, "_____________");
                var ii = k.output("datauristring"),
                    ri = "<iframe width='100%' height='100%' src='" + ii + "'><\/iframe>",
                    ot = window.open("", "_blank", "width=1024,height=600,directories=0,status=0,titlebar=0,scrollbars=0,menubar=0,toolbar=0,location=0,resizable=1");
                ot.focus();
                ot.document.write(ri);
                ot.document.close()
            }
            function f(id) {
                var nama;
                switch (id) {
                    case '01':
                        nama = 'Januari';
                        break
                    case '02':
                        nama = 'Februari';
                        break
                    case '03':
                        nama = 'Maret';
                        break
                    case '04':
                        nama = 'April';
                        break
                    case '05':
                        nama = 'Mei';
                        break
                    case '06':
                        nama = 'Juni';
                        break
                    case '07':
                        nama = 'Juli';
                        break
                    case '08':
                        nama = 'Agustus';
                        break
                    case '09':
                        nama = 'September';
                        break
                    case '10':
                        nama = 'Oktober';
                        break
                    case '11':
                        nama = 'Nopember';
                        break
                    case '12':
                        nama = 'Desember';
                        break
                }
                return nama;
            }
            function b(kode) {
                var str = "B20,B20.0,B20.1,B20.2,B20.3,B20.4,B20.5,B20.6,B20.7,B20.8,B20.9,B21,B21.0,B21.1,B21.2,B21.3,B21.7,B21.8,B21.9,B22,B22.0,B22.1,B22.2,B22.7,B23,B23.0,B23.1,B23.2,B23.8,B24";
                var ret = str.includes(kode);
                return ret;
            }
            function s(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }
        }

    ]);
});
