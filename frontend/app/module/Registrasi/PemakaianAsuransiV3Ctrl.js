define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict'
    initialize.controller('PemakaianAsuransiV3Ctrl', ['$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($scope, modelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {
            $scope.now = new Date();
            
            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.norecAPD;
            $scope.item = {};
            $scope.isRujukan = false
            $scope.isRujukanManual = false
            $scope.isRouteLoading = false
            $scope.formRawatJalan = false
            $scope.formRawatInap = false
            $scope.formIgd = false
            var ceknobpjsdouble = false;
            var namappkRumahSakit = ""
            var kodeppkRumahSakit = ""
            $scope.listRuanganPoli = []
            $scope.listRuanganIGD = []
            $scope.listHistoryPelayanan = []
            $scope.totalPasienBPJSRajal = [];
            $scope.totalPasienUmumRajal = [];
            $scope.sourceKelas = []
            $scope.listPilih = [
                { id: 1, name: 'Rujukan' }, 
                { id: 2, name: 'Rujukan Manual/IGD' },
                { id: 7, name: 'Pasca RI' },
            ];
            $scope.listAsalRujukan = [
                { id: 1, name: 'Faskes Tingkat 1' }, 
                { id: 2, name: 'Faskes Tingkat 2' },
            ];
            $scope.listPelayanan = [
                { id: 1, name: 'Rawat Jalan' }, 
                { id: 2, name: 'Rawat Inap' },
            ];
            $scope.listlakaLantas = [
                { id: "0", name: 'Bukan Kecelakaan' }, 
                { id: "1", name: 'Kecelakaan LaluLintas dan bukan Kecelakaan Kerja' },
                { id: "2", name: 'Kecelakaan LaluLintas dan Kecelakaan Kerja' },
                { id: "3", name: 'Kecelakaan Kerja' },
            ];
            $scope.listJenis = [
                { id: 1, name: 'Rencana Rawat Inap' }, 
                { id: 2, name: 'Rencana Kontrol' }
            ];
            $scope.listFilter = [
                { kode: 2, nama: 'Tgl Rencana Kontrol' }, 
                { kode: 1, nama: 'Tgl Entri' }
            ]
            $scope.listPembiaya = [
                { kode: 1, nama: 'Pribadi' },
                { kode: 2, nama: 'Pemberi Kerja' },
                { kode: 3, nama: 'Asuransi Kesehatan Tambahan' },
            ]
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
            ]
            $scope.listAsesmen = [
                { id: "1", name: "Poli spesialis tidak tersedia pada hari sebelumnya" },
                { id: "2", name: "Jam Poli telah berakhir pada hari sebelumnya" },
                { id: "3", name: "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
                { id: "4", name: "Atas Instruksi RS" },
                { id: "5", name: "Tujuan Kontrol" },
            ]

            $scope.comboBoxOptionsAsalRujukan = {
                placeholder:"ketik nama asal rujukan minimal 3 karakter",
                dataTextField:"nama",
                autoBind: "false",
                minLength:1,
                dataValuetField:"id",
                filter: "contains",
                filtering:function(e){
                    getFaskes($scope.combobox.text());            
                }
            }

            function getFaskes(nama) {
                if (nama.length < 3) return
                let json = {
                    "url": "referensi/faskes/1/" + nama,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code == 200) {
                        $scope.listPpkRujukan = e.data.response.faskes;
                    } else toastr.info(e.data.metaData.message, 'Info')
                })
            }

            $scope.comboBoxOptionsDPJPMelayani = {
                placeholder:"ketik nama dokter minimal 3 karakter",
                dataTextField:"nama",
                autoBind: "false",
                minLength:3,
                dataValuetField:"id",
                filter: "contains",
                filtering:function(e){
                    getDPJP(e.filter.value);            
                }
            }

            function getDPJP(nama) {
                if(!$scope.item.subSpesialis) {
                    toastr.error("Harap pilih Sub/Spesialis terlebih dahulu !");
                    return
                }
                let tglPelayanan = new moment($scope.item.tglSep).format('YYYY-MM-DD')
                let jenisPel = 1
                let kdSpesialis = $scope.item.subSpesialis.kdinternal
                let json = {
                    "url": "referensi/dokter/pelayanan/" + jenisPel + "/tglPelayanan/" + tglPelayanan + "/Spesialis/" + kdSpesialis,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;
                        // set defautl dpjp
                        if(nama == "defaultdpjp") {
                            for (let i = 0; i < $scope.listDPJP.length; i++) {
                                const element = $scope.listDPJP[i];
                                if(element.kode == $scope.item.pasien.kddokterbpjs){
                                    $scope.item.dpjpMelayani = element
                                }
                            }
                        }
                    }
                    else toastr.info('Dokter DPJP tidak ada', 'Info')
                })
            }

            loadCombo()
            function loadCombo() {
                $scope.isRouteLoading = true
                medifirstService.get("bridging/bpjs/get-ruangan-rj").then(function (data) {
                    $scope.isRouteLoading = false
                    var dataruangan = data.data.data;
                    for (let i = 0; i < dataruangan.length; i++) {
                        const element = dataruangan[i];
                        if(element.objectdepartemenfk != 24) {
                            $scope.listRuanganPoli.push(element)
                        }
                        if(element.objectdepartemenfk == 24) {
                            $scope.listRuanganIGD.push(element)
                        }
                    }
                    loadPertama()
                })
                medifirstService.getPart("registrasi/get-diagnosa-saeutik", true, true, 10).then(function (data) {
                    $scope.sourceDiagnosa = data;
                });
                medifirstService.get("registrasi/get-combo-kelas").then(function (e) {
                    var data = e.data.kelas
                    for (let x = 0; x < data.length; x++) {
                        const element = data[x];
                        // if (element.kodebpjsnaikkelas != null) {
                            $scope.sourceKelas.push(element)
                        // }
                    }
                })
                
                
                let prov = {
                    "url": "referensi/propinsi",
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", prov).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listPropinsi = e.data.response.list;;
                    }
                });

                let poli = {
                    "url": "ref/poli",
                    "jenis": "antrean",
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", poli).then(function (e) {
                    $scope.listSpesialKontrol = [
                        {
                            "nmpoli": "SARANA KEMOTERAPI",
                            "nmsubspesialis": "SARANA KEMOTERAPI",
                            "kdsubspesialis": "KEM",
                            "kdpoli": "KEM"
                        },
                    ]
                    if (e.data.metaData.code == 1) {
                        for (let i = 0; i < e.data.response.length; i++) {
                            const element = e.data.response[i];
                            $scope.listSpesialKontrol.push(element);
                        }
                    }
                });
            }

            $scope.resetPilihForm = function () {
                $scope.isRujukan = !$scope.isRujukan
                $scope.isRujukanManual = !$scope.isRujukanManual

                var idpilahan = $scope.item.pilih.id
                // set form
                switch(idpilahan) {
                    case 1:
                        $scope.formRawatJalan = true
                        $scope.formRawatInap = false
                        $scope.formIgd = false
                        $scope.formPascaRI = false

                        $scope.isRujukan = true;
                        $scope.isRujukanManual = false;
                        break;
                    case 2:
                        $scope.formRawatJalan = false
                        $scope.formRawatInap = false
                        $scope.formIgd = true
                        $scope.item.pelayanan = $scope.listPelayanan[0]
                        $scope.formPascaRI = false

                        $scope.isRujukan = false;
                        $scope.isRujukanManual = true;
                        break;
                    case 7:
                        $scope.formRawatJalan = false
                        $scope.formRawatInap = false
                        $scope.formIgd = false
                        $scope.formPascaRI = true
                        $scope.item.pelayanan = $scope.listPelayanan[0]
                        $scope.item.asalRujukan = $scope.listAsalRujukan[1]
                        $scope.item.ppkAsalRujukan = namappkRumahSakit
                        $scope.item.kodeppkAsalRujukan = kodeppkRumahSakit

                        $scope.isRujukan = false;
                        $scope.isRujukanManual = true;
                        break;
                }
                setDefault()
            }

            function setDefault () {
                $scope.item.tglSep = $scope.now
                delete $scope.item.noRujukan
                delete $scope.item.ppkAsalPeserta
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
                    $scope.item.kodebooking = e.data[0].kodebooking;
                    $scope.item.statuspasien = e.data[0].statuspasien;
                    $scope.item.noantrian = e.data[0].noantrian;
                    $scope.item.noTelpons = e.data[0].notelepon
                    $scope.item.tglRegistrasi = e.data[0].tglregistrasi

                    // balikin
                    if($scope.item.pasien == undefined) {
                        window.alert("Maaf, data pasien tidak ditemukan !");
                        history.back()
                    }

                    // set form otomatis
                    $scope.item.subSpesialis = { id: e.data[0].objectruanganfk, namaruangan: e.data[0].namaruangan, kdinternal: e.data[0].kdinternal }
                    $scope.item.tglSep = $scope.now
                    $scope.item.pelayanan = $scope.listPelayanan[0]
                    if($scope.item.pasien.israwatinap == "true") {
                        $scope.item.pilih = $scope.listPilih[1]
                        $scope.item.pelayanan = $scope.listPelayanan[1]
                        $scope.isRujukanManual = true
                        $scope.changePelayanan($scope.item.pelayanan)
                    } else {
                        if($scope.item.pasien.kdinternal != null && $scope.item.pasien.kdinternal.includes('IGD')) {
                            $scope.item.pilih = $scope.listPilih[1]
                            $scope.item.pelayanan = $scope.listPelayanan[0]
                            $scope.isRujukanManual = true
                            $scope.changePelayanan($scope.item.pelayanan)
                        } else {
                            $scope.item.pilih = $scope.listPilih[0]
                            $scope.item.asalRujukan = $scope.listAsalRujukan[0]
                            $scope.item.tujuanKunj = $scope.listTujuan[0]
                            $scope.isRujukan = true
                            $scope.formRawatJalan = true
                        }
                    }
                    getDPJP("defaultdpjp");
                    
                    if($scope.item.pasien.nobpjs == null || $scope.item.pasien.nobpjs == '' || $scope.item.pasien.nobpjs == '-') {
                        if ($scope.item.pasien.noidentitas == null || $scope.item.pasien.noidentitas.length > 16 || $scope.item.pasien.noidentitas.length < 16) {
                            window.alert("Nomor pasien bpjs belum ada atau nik tidak sesuai, harap lengkapi terlebih dahulu !");
                            history.back()
                        } else {
                            apiPeserta($scope.item.pasien.noidentitas, "nik");
                        }
                    } else {
                        ceknobpjsdouble = false
                        $scope.isRouteLoading = true
                        medifirstService.get("registrasi/cek-nobpjs?nobpjs=" + $scope.item.pasien.nobpjs + "&idnocm=" + $scope.item.pasien.nocmfk)
                        .then(function (data) {
                            $scope.ceks = data.data;
                            $scope.isRouteLoading = false
                            if ($scope.ceks.data.length >= 1) {
                                var nocm = $scope.ceks.data[0].nocm;
                                var nama = $scope.ceks.data[0].namapasien;
                                toastr.error("NO BPJS ini sudah di pakai oleh pasien RM : " + nocm + " (" + nama + ") !", "Peringatan")
                                ceknobpjsdouble = true
                            }
                            apiPeserta($scope.item.pasien.nobpjs, "nokartu");
                        })
                    }

                    let formattedDate = new moment(new Date(e.data[0].tglregistrasi)).format('YYYY-MM-DD')
                    medifirstService.get(`registrasi/get-total-pasien-poli-bpjs?idruangan=${$scope.item.pasien.idruangan}&tglRegis=${formattedDate}`).then(function (dat) {
                        $scope.totalPasienBPJSRajal = dat.data.data
                    });
                    medifirstService.get(`registrasi/get-total-pasien-poli-umum?idruangan=${$scope.item.pasien.idruangan}&tglRegis=${formattedDate}`).then(function (dat) {
                        $scope.totalPasienUmumRajal = dat.data.data
                    });
                })
            }

            $scope.getHistoryPelayanan = function() {
                $scope.listHistoryPelayanan = []
                medifirstService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + $scope.item.pasienbpjs.noKartu).then(function (data) {
                    if (data.data.metaData.code == 200) {
                        $scope.listHistoryPelayanan = data.data.response.histori
                        for (let i = 0; i < $scope.listHistoryPelayanan.length; i++) {
                            const element = $scope.listHistoryPelayanan[i];
                            if(element.jnsPelayanan == "1") {
                                $scope.listHistoryPelayanan[i].namajnsPelayanan = "Rawat Inap"
                            }
                            if(element.jnsPelayanan == "2") {
                                $scope.listHistoryPelayanan[i].namajnsPelayanan = "Rawat Jalan"
                            }
                        }
                    } else {
                        window.messageContainer.error(data.data.metaData.message);
                    }
                })
            }

            // API
            medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                kodeppkRumahSakit = dat.data
            })


            function getPemakaianAsuransiByNoReg(noreg) {
                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-history-pemakaianasuransi-new?noregistrasi=" + noreg).then(function (x) {
                    $scope.isRouteLoading = false;
                    if (x.data.data.length > 0) {
                        $scope.item.pemakaianasuransi = x.data.data[0]
                        let json = {
                            "url": `SEP/${$scope.item.pemakaianasuransi.nosep}`,
                            "method": "GET",
                            "data": null
                        }
                        $scope.isRouteLoading = true;
                        medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                            $scope.isRouteLoading = false;
                            if (e.data.metaData.code === "200") {
                                $scope.dataSep = e.data.response;
                                if($scope.item.pasien.israwatinap == "true") { 
                                    if($scope.dataSep.jnsPelayanan == "Rawat Inap") {
                                        $scope.isUpdate = true;
                                    }
                                } else {
                                    $scope.isUpdate = true;
                                }
                                $scope.item.tglSep = $scope.dataSep.tglSep;
                                for (let i = 0; i < $scope.listAsalRujukan.length; i++) {
                                    const elementi = $scope.listAsalRujukan[i];
                                    if(elementi.id == $scope.item.pemakaianasuransi.asalrujukanfk) {
                                        $scope.item.asalRujukan = elementi;
                                        break;
                                    }
                                }
                                $scope.item.noRujukan = $scope.dataSep.noRujukan;
                                $scope.item.isEksekutif = $scope.dataSep.poliEksekutif == "0" ? false : true;
                                for (let j = 0; j < $scope.listRuanganPoli.length; j++) {
                                    const elementj = $scope.listRuanganPoli[j];
                                    if(elementj.kdinternal == $scope.item.pemakaianasuransi.polirujukankode && elementj.namaruangan == $scope.item.pemakaianasuransi.polirujukannama) {
                                        $scope.item.subSpesialis = elementj;
                                    }
                                }
                                $scope.item.dpjpMelayani = { kode: $scope.dataSep.dpjp.kdDPJP, nama: $scope.dataSep.dpjp.nmDPJP };
                                $scope.item.kodeppkAsalRujukan = $scope.item.pemakaianasuransi.kdprovider;
                                $scope.item.ppkAsalRujukan = $scope.item.pemakaianasuransi.nmprovider;
                                $scope.item.tglRujukan = $scope.item.pemakaianasuransi.tglrujukan;
                                $scope.item.noSurkon = $scope.dataSep.kontrol.noSurat;
                                $scope.item.dpjpSurkon = $scope.dataSep.kontrol.nmDokter;
                                $scope.item.kodedpjpSurkon = $scope.dataSep.kontrol.kdDokter;
                                $scope.item.isCOB = $scope.dataSep.cob == "0" ? false : true;
                                // rawat inap
                                if($scope.item.pemakaianasuransi.objectkelasdijaminfk != null) {
                                    $scope.item.kelasDitanggung = { id: $scope.item.pemakaianasuransi.objectkelasdijaminfk, namakelas: $scope.item.pemakaianasuransi.namakelas }
                                }
                                $scope.item.isKatarak  = $scope.dataSep.katarak == "0" ? false : true;
                                // naik kelas
                                $scope.item.isNaikKelas = $scope.dataSep.klsRawat.klsRawatNaik == null ? false : true;
                                $scope.checkNaikKelas($scope.item.isNaikKelas)
                                if ($scope.item.pemakaianasuransi.klsrawatnaik) {
                                    $scope.item.naikKelas = true
                                    for (let k = 0; k < $scope.sourceKelas.length; k++) {
                                        const elementk = $scope.sourceKelas[k];
                                        if (elementk.id == $scope.item.pemakaianasuransi.klsrawatnaik) {
                                            $scope.item.klsRawatNaik = elementk
                                            break
                                        }
                                    }
                                }
                                if ($scope.item.pemakaianasuransi.pembiayaan) {
                                    for (let l = 0; l < $scope.listPembiaya.length; l++) {
                                        const elementl = $scope.listPembiaya[l];
                                        if (elementl.id == $scope.item.pemakaianasuransi.pembiayaan) {
                                            $scope.item.pembiayaan = elementl
                                            break
                                        }
                                    }
                                }
                                if ($scope.item.pemakaianasuransi.penanggungjawab) {
                                    $scope.item.penanggungJawab = $scope.item.pemakaianasuransi.penanggungjawab
                                }
                                if($scope.item.pemakaianasuransi.objectdiagnosafk != null) {
                                    let namakodediagnosa = $scope.item.pemakaianasuransi.kddiagnosa + "-" + $scope.item.pemakaianasuransi.namadiagnosa
                                    $scope.item.diagnosa = {id: $scope.item.pemakaianasuransi.objectdiagnosafk, nama: namakodediagnosa, kddiagnosa: $scope.item.pemakaianasuransi.kddiagnosa };
                                }
                                $scope.item.catatan = $scope.dataSep.catatan;
                                $scope.item.statusKecelakaan = {id: $scope.dataSep.kdStatusKecelakaan, name: $scope.dataSep.nmstatusKecelakaan };
                                // lakalantas
                                $scope.item.tglKejadian = $scope.dataSep.lokasiKejadian.tglKejadian
                                if($scope.dataSep.lokasiKejadian.kdProp != null){
                                    $scope.listPropinsi = [{ kode: $scope.item.pemakaianasuransi.kdpropinsi, nama: $scope.item.pemakaianasuransi.namapropinsi }];
                                    $scope.item.provinsi = $scope.listPropinsi[0]
                                }
                                if($scope.dataSep.lokasiKejadian.kdKab != null){
                                    $scope.item.kabkota = { kode: $scope.item.pemakaianasuransi.kdkabupaten, nama: $scope.item.pemakaianasuransi.namakabupaten }

                                }
                                if($scope.dataSep.lokasiKejadian.kdKec != null){
                                    $scope.item.kecamatan = { kode:  $scope.item.pemakaianasuransi.kdkecamatan, nama:  $scope.item.pemakaianasuransi.namakecamatan }
                                }
                                if($scope.dataSep.lokasiKejadian.ketkejadian != null){
                                    $scope.item.ketkejadian = $scope.dataSep.lokasiKejadian.ketkejadian
                                }
                                // rawat jalan
                                $scope.item.tujuanKunj = { id: $scope.dataSep.tujuanKunj.kode, name: $scope.dataSep.tujuanKunj.nama };
                                $scope.changeTujuanKunjungan($scope.item.tujuanKunj)
                                $scope.item.prosedur = { id: $scope.dataSep.flagProcedure.kode, name: $scope.dataSep.flagProcedure.nama };
                                $scope.changeProsedur($scope.item.prosedur)
                                if($scope.dataSep.kdPenunjang.kode != "0") {
                                    $scope.item.penunjang = { id: $scope.dataSep.kdPenunjang.kode, name: $scope.dataSep.kdPenunjang.nama };
                                }
                                if($scope.dataSep.assestmenPel.kode != "0") {
                                    $scope.item.assesment = { id: $scope.dataSep.assestmenPel.kode, name: $scope.dataSep.assestmenPel.nama };
                                }
                                if ($scope.item.pemakaianasuransi.poliasalkode) {
                                    $scope.item.poliasalkode = $scope.item.pemakaianasuransi.poliasalkode
                                }
                            } else {
                                window.messageContainer.error("Sep tidak ditemukan !");
                            }
                        })
                    }
                })
            }

            function apiPeserta(nomor, type) {
                let tlgpelayanan = new moment(new Date).format("YYYY-MM-DD")
                let json = {
                    "url": `Peserta/${type}/${nomor}/tglSEP/${tlgpelayanan}`,
                    "method": "GET",
                    "data": null,
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code === "200") { 
                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                        $scope.item.pasienbpjs = e.data.response.peserta
                        $scope.item.noTelepon = $scope.item.pasien.notelepon
                        $scope.item.statusKecelakaan = $scope.listlakaLantas[0]
                        if ($scope.item.pasienbpjs.hakKelas.kode == 1) {
                            $scope.item.kelasDitanggung = { id: "3", namakelas: 'Kelas I', kodebpjsnaikkelas: $scope.item.pasienbpjs.hakKelas.kode }
                        } else if ($scope.item.pasienbpjs.hakKelas.kode == 2) {
                            $scope.item.kelasDitanggung = { id: "2", namakelas: 'Kelas II', kodebpjsnaikkelas: $scope.item.pasienbpjs.hakKelas.kode }
                        } else if ($scope.item.pasienbpjs.hakKelas.kode == 3) {
                            $scope.item.kelasDitanggung = { id: "1", namakelas: 'Kelas III', kodebpjsnaikkelas: $scope.item.pasienbpjs.hakKelas.kode }
                        }
                        getPemakaianAsuransiByNoReg($scope.item.pasien.noregistrasi);
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                })
            }
            $scope.getDataKabKota = function (e) {
                if (e === undefined) return;
                let json = {
                    "url": "referensi/kabupaten/propinsi/" + e.kode,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listKabupaten = e.data.response.list;
                    }
                })
            }
            $scope.getDataKecamatan = function (e) {
                if (e === undefined) return;
                let json = {
                    "url": "referensi/kecamatan/kabupaten/" + e.kode,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listKecamatan = e.data.response.list;
                    }
                })
            }

            function loadRujukan(){
                var urlApi = ""
                if(!$scope.item.asalRujukan) { toastr.error("Harap pilih Asal Rujukan terlebih dahulu !"); return; }
                if($scope.item.asalRujukan.id == 1) { urlApi = `Rujukan/List/Peserta/${$scope.item.pasienbpjs.noKartu}` }
                if($scope.item.asalRujukan.id == 2) { urlApi = `Rujukan/RS/List/Peserta/${$scope.item.pasienbpjs.noKartu}` }
                var json = {
                    "url": urlApi,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
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
                        $scope.popupRujukan.open().maximize();
                    } else {
                        toastr.error(e.data.metaData.message, 'Info');
                    }
                })
                if($scope.listHistoryPelayanan.length == 0) {
                    $scope.getHistoryPelayanan()
                }
            }

            function loadGridKontrol(){
                var tahun = moment($scope.kontrol.bulan).format('YYYY'); 
                var bulan = moment($scope.kontrol.bulan).format('MM');
                var noka = $scope.item.pasienbpjs.noKartu
                var filter = $scope.kontrol.filter.kode;

                var json = {
                    "url": `RencanaKontrol/ListRencanaKontrol/Bulan/${bulan}/Tahun/${tahun}/Nokartu/${noka}/filter/${filter}`,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    var result = e.data;
                    var dataKon = [];
                    if(result.metaData.code == "200") {
                        for (let i = 0; i < e.data.response.list.length; i++) {
                            e.data.response.list[i].no = i + 1;
                        }
                        dataKon = result.response.list;
                    }
                    toastr.info(result.metaData.message, 'Rencana Kontrol/SPRI')
                    $scope.dataSourceSPRI = new kendo.data.DataSource({
                        data: dataKon,
                        pageSize: 10,
                        serverPaging: false,
                    });
                    $scope.popUpRSPRI.open().maximize();
                })
            }

            function saveSPRILokal(tipe) {
				loadGridKontrol()
				var data = {
					'tipe':tipe,
					'nosuratkontrol': $scope.kontrol.resNoSurat ,
					'jnspelayanan':   $scope.kontrol.jenisPelayanan.id == 1?'Rawat Inap':'Rawat Jalan',
					'jnskontrol':  $scope.kontrol.jenisPelayanan.id,
					'namajnskontrol':  $scope.kontrol.jenisPelayanan.id == 1?'SPRI':'Surat Kontrol',
					'tglrencanakontrol':moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
					'tglterbitkontrol': moment(new Date()).format('YYYY-MM-DD') ,
					'nosepasalkontrol':$scope.kontrol.sep?$scope.kontrol.sep :null ,
					'poliasal':  $scope.item.pasien.namaruangan,
					'politujuan':  $scope.kontrol.poliKontrol ?$scope.kontrol.poliKontrol.kdsubspesialis :null,
					'namapolitujuan':  $scope.kontrol.poliKontrol ?$scope.kontrol.poliKontrol.nmsubspesialis :null,
					'tglsep': $scope.kontrol.tglSep ?$scope.kontrol.tglSep :null,
					'kodedokter': $scope.kontrol.kodeDokter.kode ,
					'namadokter': $scope.kontrol.kodeDokter.nama ,
					'nokartu':$scope.kontrol.noKartu,
					'nama':$scope.item.pasien.namapasien ,
					'norec_pd': $scope.currentNorecPD ,
				};
				medifirstService.post("bridging/bpjs/save-rencana-kontrol", data).then(function (z) {})
			}
            // End API

            // Event Change
            $scope.changePelayanan = function (e) {
                if(e == undefined) return
                if($scope.item.pilih.id == 7) return
                switch(e.id) {
                    case 1:
                        $scope.formIgd = true
                        $scope.formRawatInap = false
                        break;
                    case 2:
                        $scope.formIgd = false
                        $scope.formRawatInap = true
                        $scope.item.asalRujukan = $scope.listAsalRujukan[1]
                        $scope.item.ppkAsalRujukan = namappkRumahSakit
                        $scope.item.kodeppkAsalRujukan = kodeppkRumahSakit
                        break;
                }
            }

            $scope.popUpRujukan = function (e) {
                loadRujukan()
            }

            $scope.setRujukan = function (data) {
                if (data != undefined) {
                    $scope.item.noRujukan = data.noKunjungan
                    $scope.item.tglRujukan = new Date(data.tglKunjungan);
                    $scope.item.kodeppkAsalRujukan = data.provPerujuk.kode
                    $scope.item.ppkAsalRujukan = data.provPerujuk.nama
                    $scope.poliRujukanKode = data.poliRujukan.kode
                    $scope.poliRujukanNama = data.poliRujukan.nama
                    toastr.info(data.peserta.statusPeserta.keterangan, 'Status Peserta');
                    medifirstService.get("registrasi/get-diagnosa-saeutik?kddiagnosa=" + data.diagnosa.kode, true, true, 10)
                    .then(function (xx) {
                        $scope.sourceDiagnosa.add(xx.data[0])
                        $scope.item.diagnosa = xx.data[0]
                    })
                    var countKunjungan = 0
                    for (let i = 0; i < $scope.listHistoryPelayanan.length; i++) {
                        if ($scope.item.noRujukan != undefined && $scope.item.noRujukan.length > 8
                            && $scope.listHistoryPelayanan[i].noRujukan == $scope.item.noRujukan) {
                            countKunjungan = countKunjungan + 1
                        }
                    }
                    var jml = 0
                    jml = countKunjungan + 1
                    toastr.info('Kunjungan ke- ' + jml + ' Dengan Rujukan yang sama.', 'Info')
                    if(data.poliRujukan.kode == "HDL") {
                        setTglRujukan(data.noKunjungan, data.diagnosa.kode);
                    } else {
                        $scope.popupRujukan.close()
                    }
                }
            }

            function setTglRujukan(norujukan,diagnosa) {
                var json = {
                    "url": `Rujukan/Khusus/insert`,
                    "method": "POST",
                    "data": {
                        "noRujukan": norujukan,
                        "diagnosa": [
                            {"kode": "P;"+ diagnosa},
                        ],
                        "procedure": [],
                        "user": medifirstService.getPegawaiLogin().namaLengkap
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    var result = e.data;
                    if(result.metaData.code == "200") {
                        $scope.item.tglRujukan = new Date(result.response.rujukan.tglrujukan_awal);
                    } else {
                        var tglberlakumsg = result.metaData.message.substr(33, 10);
                        var tglberlaku = tglberlakumsg.replace(/-/g, "/")
                        var dateMomentObject = moment(tglberlaku, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
                        var dateObject = dateMomentObject.toDate();
                        if(dateObject instanceof Date) {
                            $scope.item.tglRujukan = dateObject;
                        }
                    }
                    $scope.popupRujukan.close()
                })
            }

            $scope.changeStatusKecelakaan = function (e) {
                if(e == undefined) return
                if(e.id !== "0") {
                    $scope.lakaLantas = true
                    $scope.item.tglKejadian = $scope.now
                } else {
                    $scope.lakaLantas = false
                    $scope.item.tglKejadian = $scope.now
                    delete $scope.item.noLP
                    delete $scope.item.provinsi
                    delete $scope.item.kabkota
                    delete $scope.item.kecamatan
                    delete $scope.item.ketkejadian
                }
            }

            $scope.checkNaikKelas = function (e) {
                if(e) {
                    $scope.naikKelas = true
                } else {
                    $scope.naikKelas = false
                }
            }

            $scope.cariSurkonSpri = function () {
                $scope.myVar2 = 0
                $scope.kontrol = {
                    bulan : new Date(),
                    jenisPelayanan: $scope.listJenis[1],
                    noKartu: $scope.item.pasienbpjs.noKartu,
                    filter: $scope.listFilter[0]
                }
                loadGridKontrol()
            }

            $scope.cariRencana = function(){
                loadGridKontrol()
            }

            $scope.resetFormSurkon = function () {
                delete $scope.kontrol.poliKontrol
                delete $scope.kontrol.kodeDokter
            }

            $scope.saveSPRI = function () {
                if(!$scope.kontrol.jenisPelayanan) {
                    toastr.error('Harap pilih jenis kontrol telebih dahulu !');
                    return;
                }
                if(!$scope.kontrol.tglRencanaKontrol) {
                    toastr.error('Harap isi Tanggal Rencana Kontrol / Inap telebih dahulu !');
                    return;
                }
                if(!$scope.kontrol.poliKontrol) {
                    toastr.error('Harap isi Spesialis / SubSpesialis telebih dahulu !');
                    return;
                }
                if(!$scope.kontrol.kodeDokter) {
                    toastr.error('Harap isi DPJP Tujuan Kontrol / Inap telebih dahulu !');
                    return;
                }

                if ($scope.kontrol.jenisPelayanan.id == 1) {
                    if(!$scope.kontrol.noKartu) {
                        toastr.error('Harap isi No kartu peserta dibagian Data Kartu Peserta !');
                        return;
                    }

                    if ($scope.kontrol.noSuratKontrol == undefined) {
                        // insert

                        let json = {
                            "url": "RencanaKontrol/InsertSPRI",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "noKartu": $scope.kontrol.noKartu,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdsubspesialis,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }

                        $scope.isRouteLoading =true
                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSPRI
								saveSPRILokal('insert')
								
                                toastr.success(e.data.response.noSPRI, e.data.metaData.message);
                                $scope.myVar = 0
                            } else {
								$scope.isRouteLoading =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    } else {
                        // update
                        let json = {
                            "url": "RencanaKontrol/UpdateSPRI",
                            "method": "PUT",
                            "data": {
                                "request": {
                                    "noSPRI": $scope.kontrol.noSuratKontrol,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdsubspesialis,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }


                        $scope.isRouteLoading =true
                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSPRI
								saveSPRILokal('update')
								
                                toastr.success(e.data.response.noSPRI, e.data.metaData.message);
                                $scope.myVar = 0
                            } else {
								$scope.isRouteLoading =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    }
                } else {
                    if(!$scope.kontrol.sep) {
                        toastr.error('Harap isi No Sep telebih dahulu !');
                        return;
                    }

                    if ($scope.kontrol.noSuratKontrol == undefined) {
                        // insert
                        let json = {
                            "url": "RencanaKontrol/insert",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "noSEP": $scope.kontrol.sep,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdsubspesialis,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }

                        $scope.isRouteLoading = true
                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSuratKontrol
								saveSPRILokal('insert')
								
                                toastr.success(e.data.response.noSuratKontrol, e.data.metaData.message);
                                $scope.myVar = 0
                            } else {
								$scope.isRouteLoading =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    } else {
                        // update
                        let json = {
                            "url": "RencanaKontrol/Update",
                            "method": "PUT",
                            "data": {
                                "request": {
                                    "noSuratKontrol": $scope.kontrol.noSuratKontrol,
                                    "noSEP": $scope.kontrol.sep,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdsubspesialis,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }

                        $scope.isRouteLoading = true
                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSuratKontrol
								saveSPRILokal('update')
                                toastr.success(e.data.response.noSuratKontrol, e.data.metaData.message);
                                $scope.myVar = 0
                            } else {
								$scope.isRouteLoading =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    }

                }
            }

            $scope.batalSPRI = function(){
				$scope.popUpRSPRI.close()
			}

            $scope.setKontrol = function (data) {
                if (data != undefined) {
                    $scope.item.noSurkon = data.noSuratKontrol
                    $scope.item.kodedpjpSurkon = data.kodeDokter
                    $scope.item.dpjpSurkon = data.namaDokter
                    // kontrol rawat jalan
                    if($scope.isRujukan) {
                        $scope.item.tujuanKunj = $scope.listTujuan[2]
                        $scope.item.assesment = $scope.listAsesmen[4]
                    }
                    $scope.popUpRSPRI.close()
                }
            }

            $scope.getJadwalDok = function(e, setDefault = null){
                delete $scope.kontrol.kodeDokter
                if(!e) return;
                if(!$scope.kontrol.jenisPelayanan) {
                    delete $scope.kontrol.poliKontrol
                    toastr.error("Harap pilih terlebih dahulu jenis kontrol !");
                    return;
                }
                if(!$scope.kontrol.tglRencanaKontrol) {
                    delete $scope.kontrol.poliKontrol
                    toastr.error("Harap pilih terlebih dahulu tgl rencana kontrol !");
                    return;
                }

                var tgl = moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD');
                var jp = $scope.kontrol.jenisPelayanan.id
                $scope.listDPJPKontrol = []
                let json = {
                    "url": "RencanaKontrol/JadwalPraktekDokter/JnsKontrol/" + jp + "/KdPoli/" + e.kdsubspesialis + "/TglRencanaKontrol/" + tgl,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code == 200) {
                        for (let x = 0; x < e.data.response.list.length; x++) {
                            const element = e.data.response.list[x];
                            element.kode = element.kodeDokter
                            element.nama = element.namaDokter
                        }
                        $scope.listDPJPKontrol = e.data.response.list;

                        if(setDefault != null) {
                            $scope.kontrol.kodeDokter = { kode: setDefault.kodeDokter, nama: setDefault.namaDokter }
                        }
                    }
                    else {
                        toastr.info(e.data.metaData.message, 'Jadwal Dokter')
                    }

                })
            }

            $scope.changeTujuanKunjungan = function(e) {
                if(e == undefined) return;
                if(e.id == "1") {
                    $scope.isProsedur = true;
                    delete $scope.item.prosedur
                    delete $scope.item.penunjang
                    delete $scope.item.assesment
                } else {
                    $scope.isProsedur = false;
                }
            }
            $scope.changeProsedur = function (e) {
                if(e == undefined) return;
                $scope.listPenunjang = e.details
            }
            // End Event Change

            // Grid Column
            function cetakSPRI(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var profile = medifirstService.getProfile();
                var json = JSON.stringify(dataItem);
                var base64 = btoa(json)

                window.open(configuration.baseApiBackend + 'report/cetak-skdpspri?noregistrasi='+ $scope.item.pasien.noregistrasi +'&qbinary='+ base64 +'&kdprofile=' + profile.kdprofile, "_blank")
            }
            function editSPRI(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                $scope.kontrol.sep = dataItem.noSepAsalKontrol
                $scope.kontrol.noKartu = dataItem.noKartu
                $scope.kontrol.tglRencanaKontrol = new Date(dataItem.tglRencanaKontrol)
                if (dataItem.jnsKontrol == '2') {
                    $scope.kontrol.jenisPelayanan = $scope.listJenis[1]
                } else {
                    $scope.kontrol.jenisPelayanan = $scope.listJenis[0]
                }
                $scope.kontrol.noSuratKontrol = dataItem.noSuratKontrol
                var ruang = {}
                for (let i = 0; i < $scope.listSpesialKontrol.length; i++) {
                    const element = $scope.listSpesialKontrol[i];
                    if (element.kdsubspesialis == dataItem.poliTujuan) {
                        ruang = element
                        break
                    }
                }
                $scope.kontrol.poliKontrol = ruang
                $scope.getJadwalDok($scope.kontrol.poliKontrol, dataItem);
                // $scope.kontrol.kodeDokter = { kode: dataItem.kodeDokter, nama: dataItem.namaDokter }
                $scope.myVar2 = 1
            }
            function hapusSPRI(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (confirm('Apakah Anda yang ingin menghapus data ?')) {
                	// Save it!
                    let json = {
                        "url": "RencanaKontrol/Delete",
                        "method": "DELETE",
                        "data":   {
                            "request": {
                                "t_suratkontrol":{
                                "noSuratKontrol": dataItem.noSuratKontrol,
                                "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }
                    }
                    $scope.isRouteLoading = true
                    medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
    
                        if (e.data.metaData.code === "200") {
                            var data = {
                                'tipe':'delete',
                                'nosuratkontrol': dataItem.noSuratKontrol ,
                            };
                            medifirstService.post("bridging/bpjs/save-rencana-kontrol", data).then(function (z) {
                                loadGridKontrol()
                            })
                            toastr.info(e.data.metaData.message)
                        } else {
                            toastr.error(e.data.metaData.message)
                        }
                        $scope.isRouteLoading = false
                    })
                } else {
                	// Do nothing!
                    console.log('false')
                }
            }
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Belum') { $(this).addClass('red') }
                    if ($(this).text() == 'Sudah') { $(this).addClass('green') }
                })
            }
            $scope.columnSPRI = {
                selectable: 'row',
				dataBound: onDataBound,
				pageable: true,
                columns: [
                {
                    "command": [
                        {
                            text: " Cetak",
                            click: cetakSPRI,
                        },
                        {
                            text: " Edit",
                            click: editSPRI,
                        },
                        {
                            text: " Hapus",
                            click: hapusSPRI,
                        }
                    ],
                    title: "",
                    width: "230px",
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "noSuratKontrol",
                    "title": "No Surat",
                    "width": "180px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setKontrol(dataItem)\"  style=\"margin:0 0 5px\">#:  noSuratKontrol #</button> ",

                },
                {
                    "field": "namaJnsKontrol",
                    "title": "Jenis",
                    "width": "150px",
                },
                {
                    "field": "terbitSEP",
                    "title": "Terbit SEP",
                    "width": "100px",
                },
                {
                    "field": "tglRencanaKontrol",
                    "title": "Tgl Rencana Kontrol",
                    "width": "100px",
                }, 
                {

                    "field": "namaPoliAsal",
                    "title": "Poli Asal",
                    "width": "100px",
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

                    "field": "noSepAsalKontrol",
                    "title": "No SEP Asal",
                    "width": "180px",
                },
                {

                    "field": "tglTerbitKontrol",
                    "title": "Tgl Terbit Kontrol ",
                    "width": "100px",
                }]
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
                        "title": "Sub/Spesialis",
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
                        "title": "Nama Asal Rujukan",
                        "width": "200px"
                    },
                ]
            };
            // End Grid Column

            // Event Click
            $scope.saveAsuransi = async function (type) {
                saveMonitoringTaksId($scope.currentNorecPD, 3, new Date().getTime(), false);
                if (ceknobpjsdouble == true) {
                    toastr.error('No BPJS Terdeteksi Double, Sesuaikan No BPJS dengan pasiennya', 'Peringatan')
                    return;
                }

                if ($scope.poliRujukanKode != undefined && $scope.item.pasien.kdinternal != $scope.poliRujukanKode) {
                    $scope.item.politujuankode = $scope.item.pasien.namaruangan
                    $scope.item.poliasalkode = $scope.poliRujukanNama
                    $scope.item.statuskunjungan = 2
                }

                if ($scope.item.pasien.kelompokpasien.toLowerCase().indexOf('umum') > -1) {
                    toastr.error('Jaminan tidak sesuai')
                    return
                }

                switch(type) {
                    case "RawatJalan":
                        validasiRawatJalan();
                        break;
                    case "RawatInap":
                        validasiRawatInap();
                        break;
                    case "Igd":
                        validasiIgd();
                        break;
                    case "PascaRI":
                        validasiPascaRI();
                        break;
                }

                if(!$scope.item.statusKecelakaan) { toastr.error("Status Kecelakaan tidak boleh kosong !"); return; }
                else { 
                    if($scope.item.statusKecelakaan.id != "0") {
                        if(!$scope.item.noLP) { toastr.error("No. LP tidak boleh kosong !"); return; }
                    }
                }

                var jnsPelayanan = "";
                if($scope.item.pasien.israwatinap == "true") {
                    jnsPelayanan = "1"
                } else {
                    jnsPelayanan = "2"
                }

                var kelasJaminan = "";
                if ($scope.item.kelasDitanggung) {
                    if ($scope.item.kelasDitanggung.id == "1")
                        kelasJaminan = "3"
                    if ($scope.item.kelasDitanggung.id == "2")
                        kelasJaminan = "2"
                    if ($scope.item.kelasDitanggung.id == "3")
                        kelasJaminan = "1"
                }
                else {
                    kelasJaminan = "3"
                }

                var kelasNaik = "";
                var pembiayaan = "";
                var penanggungJawab = "";
                if($scope.item.isNaikKelas) {
                    kelasNaik = $scope.item.naikKelas.kodebpjsnaikkelas
                    pembiayaan = $scope.item.pembiayaan.kode
                    penanggungJawab = $scope.item.penanggungJawab
                }

                var asalRujukan = "2";
                if($scope.item.asalRujukan){
                    asalRujukan = $scope.item.asalRujukan.id
                }

                var tglRujukan = new moment($scope.now).format('YYYY-MM-DD');
                if($scope.item.tglRujukan) {
                    tglRujukan = new moment($scope.item.tglRujukan).format('YYYY-MM-DD')
                }

                var noRujukan = "";
                if($scope.item.noRujukan) {
                    noRujukan = $scope.item.noRujukan
                }

                var ppkRujukan = kodeppkRumahSakit;
                if($scope.item.ppkAsalRujukan) {
                    ppkRujukan = $scope.item.kodeppkAsalRujukan
                }

                var catatan = "";
                if($scope.item.catatan) {
                    catatan = $scope.item.catatan
                }

                var politujuan = ""
                if($scope.item.subSpesialis) {
                    politujuan = $scope.item.subSpesialis.kdinternal
                }
                var polieksekutif = ""
                if($scope.item.isEksekutif) {
                    polieksekutif = "1"
                } else {
                    polieksekutif = "0"
                }

                var cob = ""
                if($scope.item.isCOB) {
                    cob = "1"
                } else {
                    cob = "0"
                }

                var katarak = ""
                if($scope.item.isKatarak) {
                    katarak = "1"
                } else {
                    katarak = "0"
                }
                
                var noLP = ""
                var tglKejadian = ""
                var keterangan = ""
                var suplesi = "0"
                var noSepSuplesi = ""
                var kdPropinsi = ""
                var kdKabupaten = ""
                var kdKecamatan = ""
                if($scope.item.statusKecelakaan.id != "0") {
                    noLP = $scope.item.noLP
                    if($scope.item.tglKejadian){
                        tglKejadian = new moment($scope.item.tglKejadian).format("YYYY-MM-DD")
                    }
                    if($scope.item.ketkejadian) {
                        keterangan = $scope.item.ketkejadian
                    }
                    if($scope.item.provinsi) {
                        kdPropinsi = $scope.item.provinsi.kode
                    }
                    if($scope.item.kabkota) {
                        kdKabupaten = $scope.item.kabkota.kode
                    }
                    if($scope.item.kecamatan) {
                        kdKecamatan = $scope.item.kecamatan.kode
                    } 
                }

                var tujuanKunj = "0"
                if($scope.item.tujuanKunj){
                    tujuanKunj = $scope.item.tujuanKunj.id
                }
                var flagProcedure = ""
                if($scope.item.prosedur){
                    flagProcedure = $scope.item.prosedur.id
                }
                var kdPenunjang = ""
                if($scope.item.penunjang){
                    kdPenunjang = $scope.item.penunjang.id
                }
                var assesmentPel = ""
                if($scope.item.assesment){
                    assesmentPel = $scope.item.assesment.id
                }

                var noSurat = ""
                if($scope.item.noSurkon) {
                    noSurat = $scope.item.noSurkon
                }
                var kodeDPJP = ""
                if($scope.item.dpjpSurkon){
                    kodeDPJP = $scope.item.kodedpjpSurkon
                }

                var dpjpLayan = ""
                if($scope.item.pasien.israwatinap == "false") {
                    if($scope.item.dpjpMelayani) {
                        dpjpLayan = $scope.item.dpjpMelayani.kode
                    }
                }

                var kdJenisPelayanan = "";
                if ($scope.item.pasien.israwatinap == "true") {
                    kdJenisPelayanan = "1";
                } else {
                    kdJenisPelayanan = "2";
                }

                // 0904R004
                var poliTujuans = "";
                if ($scope.item.pasien.noruangan != null) {
                    poliTujuans = $scope.item.pasien.noruangan;
                } else {
                    poliTujuans = "";
                }

                var noKartu = "";
                if ( $scope.item.pasien.nobpjs != undefined) {
                    var noKartu =  $scope.item.pasien.nobpjs;
                } else {
                    var noKartu = '';
                }

                if(!$scope.isUpdate) { 
                    // kirim antrol sebelum buat sep
                    if(kdJenisPelayanan == "2" && $scope.item.pasien.kdinternal != 'IGD' && $scope.item.pasien.kdinternal != 'IRM'  ) 
                    {
                        if (kdJenisPelayanan == "2" && $scope.item.pasien.kdinternal != 'HDL') {
                            if(!dpjpLayan) {
                                $scope.isSimpan = false;
                                toastr.error("DPJP yang melayani belum diisi !")
                                return
                            }
    
                            var cekAntrol = {
                                "url": `antrean/pendaftaran/kodebooking/${$scope.item.kodebooking}`,
                                "jenis": "antrean",
                                "method": "GET",
                                "data": null
                            }
                            let resCekAntrol = await medifirstService.postNonMessage('bridging/bpjs/tools', cekAntrol)
                            if(resCekAntrol.data.metaData.code !== 200){
                                var jeniskunjungan,nomorreferensi,statuspasien,kodeDokterBPJS;
                                if($scope.item.statuspasien == 'BARU'){ statuspasien = '1'; } 
                                else { statuspasien = '0'; }
    
                                let pilihan = $scope.item.asalRujukan.id.toString()
                                switch (pilihan) {
                                    case "1":
                                        jeniskunjungan = 1
                                        nomorreferensi = $scope.item.noRujukan == undefined ? "" : $scope.item.noRujukan
                                        if($scope.item.noSurkon) { 
                                            jeniskunjungan = 3
                                            nomorreferensi = $scope.item.noSurkon
                                        }
                                        break;
                                    case "2":
                                        jeniskunjungan = 4
                                        nomorreferensi = $scope.item.noRujukan == undefined ? "" : $scope.item.noRujukan
                                        if($scope.item.noSurkon) { 
                                            jeniskunjungan = 3
                                            nomorreferensi = $scope.item.noSurkon
                                        }
                                        break;
                                    case "7":
                                        jeniskunjungan = 3
                                        nomorreferensi = $scope.item.noRujukan == undefined ? "" : $scope.item.noRujukan
                                        break;
                                }
    
                                if ($scope.poliRujukanKode != undefined && $scope.item.pasien.kdinternal != $scope.poliRujukanKode) {
                                    jeniskunjungan = 2
                                    nomorreferensi = $scope.item.noRujukan === undefined ? "" : $scope.item.noRujukan
                                }
    
                                var json  = {
                                    "url": "jadwaldokter/kodepoli/"+ poliTujuans +"/tanggal/"+ moment($scope.item.tglRegistrasi).format('YYYY-MM-DD'),
                                    "jenis": "antrean",
                                    "method": "GET",
                                    "data": null
                                }
                                let resJadwalDokter = await medifirstService.postNonMessage('bridging/bpjs/tools', json)
                                if(resJadwalDokter.data.metaData.code == 200){
                                    for (var i = resJadwalDokter.data.response.length - 1; i >= 0; i--) {
                                        const element = resJadwalDokter.data.response[i]
                                        const dokternya =  $scope.item.dpjpMelayani ? $scope.item.dpjpMelayani.kode : ""
                                        if(element.kodedokter == dokternya){
                                            kodeDokterBPJS = {
                                                "jadwal" : element.jadwal,
                                                "namadokter" : element.namadokter,
                                                "kodedokter" : element.kodedokter,
                                                "kapasitaspasien": element.kapasitaspasien,
                                            }
                                            break;
                                        }
                                    }
                                }

                                var sisakuotajkn = 0;
                                for (let i = 0; i < $scope.totalPasienBPJSRajal.length; i++) {
                                    const element = $scope.totalPasienBPJSRajal[i];
                                    if(kodeDokterBPJS) {
                                        if(kodeDokterBPJS.kodedokter == element.kddokterbpjs) {
                                            sisakuotajkn = kodeDokterBPJS.kapasitaspasien - element.pasienterdaftar
                                        }
                                    }
                                }
                                var sisakuotanonjkn = 0;
                                for (let i = 0; i < $scope.totalPasienUmumRajal.length; i++) {
                                    const element = $scope.totalPasienUmumRajal[i];
                                    if(kodeDokterBPJS) {
                                        if(kodeDokterBPJS.kodedokter == element.kddokterbpjs) {
                                            sisakuotanonjkn = kodeDokterBPJS.kapasitaspasien - element.pasienterdaftar
                                        }
                                    }
                                }
    
                                var jsonAntrol = {
                                    "url": "antrean/add",
                                    "jenis": "antrean",
                                    "method": "POST",
                                    "data": {
                                        "kodebooking": $scope.item.kodebooking,
                                        "jenispasien": "JKN",
                                        "nomorkartu": noKartu,
                                        "nik": $scope.item.pasien.noidentitas,
                                        "nohp": $scope.item.noTelpons,
                                        "kodepoli": $scope.item.pasien.kdinternal,
                                        "namapoli": $scope.item.pasien.namaruangan,
                                        "pasienbaru": statuspasien,
                                        "norm": $scope.item.pasien.nocm,
                                        "tanggalperiksa": moment($scope.item.pasien.tglregistrasi).format('YYYY-MM-DD'),
                                        "kodedokter": kodeDokterBPJS ? kodeDokterBPJS.kodedokter : "",
                                        "namadokter": kodeDokterBPJS ? kodeDokterBPJS.namadokter : "", 
                                        "jampraktek": kodeDokterBPJS ? kodeDokterBPJS.jadwal : "",  
                                        "jeniskunjungan": jeniskunjungan,
                                        "nomorreferensi": nomorreferensi,
                                        "nomorantrean": $scope.item.noantrian,
                                        "angkaantrean": $scope.item.noantrian,
                                        "estimasidilayani": new Date().getTime(),
                                        "sisakuotajkn": sisakuotajkn,
                                        "kuotajkn": kodeDokterBPJS ? kodeDokterBPJS.kapasitaspasien : 0,
                                        "sisakuotanonjkn": sisakuotanonjkn,
                                        "kuotanonjkn": kodeDokterBPJS ? kodeDokterBPJS.kapasitaspasien : 0,
                                        "keterangan": ""
                                    }
                                }
                                let resTambahAntrean = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonAntrol)
                                if(resTambahAntrean.data.metaData.code == 200){
                                    $scope.saveLogging('Antrol Task ID', 'norec Pasien Daftar',
                                    $scope.item.pasien.noregistrasi, 'Tambah Antrean Kode ' + $scope.item.pasien.noregistrasi +' | '+
                                    JSON.stringify(jsonAntrol) + ' | '+ JSON.stringify(resTambahAntrean.data))
    
                                    // kirim taks id
                                    medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=3&norec_pd=' + $scope.currentNorecPD).then(function (res) {
                                        updateWaktuId(res, $scope.item.kodebooking, $scope.currentNorecPD)
                                    })
    
                                } else {
                                    toastr.error(resTambahAntrean.data.metaData.message,'Peringatan')
                                    return
                                }
                            }
                        }
                        
                    }

                    var dataSend = {
                        "url": "SEP/2.0/insert",
                        "method": "POST",
                        "data": {
                            "request": {
                               "t_sep": {
                                    "noKartu": $scope.item.pasienbpjs.noKartu,
                                    "tglSep": new moment($scope.item.tglSep).format('YYYY-MM-DD'),
                                    "ppkPelayanan": kodeppkRumahSakit,
                                    "jnsPelayanan": jnsPelayanan,
                                    "klsRawat": {
                                        "klsRawatHak": kelasJaminan,
                                        "klsRawatNaik": kelasNaik,
                                        "pembiayaan": pembiayaan,
                                        "penanggungJawab": penanggungJawab
                                    },
                                    "noMR": $scope.item.pasien.nocm,
                                    "rujukan": {
                                        "asalRujukan": asalRujukan,
                                        "tglRujukan": tglRujukan,
                                        "noRujukan": noRujukan,
                                        "ppkRujukan": ppkRujukan
                                    },
                                    "catatan": catatan,
                                    "diagAwal": $scope.item.diagnosa.kddiagnosa,
                                    "poli":{
                                        "tujuan": politujuan == null ? "" : politujuan,
                                        "eksekutif": polieksekutif
                                    },
                                    "cob":{
                                        "cob": cob
                                    },
                                    "katarak": {
                                        "katarak": katarak
                                    },
                                    "jaminan": {
                                        "lakaLantas": $scope.item.statusKecelakaan.id,
                                        "noLP": noLP,
                                        "penjamin": {
                                            "tglKejadian": tglKejadian,
                                            "keterangan": keterangan,
                                            "suplesi": {
                                                "suplesi": suplesi,
                                                "noSepSuplesi": noSepSuplesi,
                                                "lokasiLaka": {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "tujuanKunj": tujuanKunj,
                                    "flagProcedure": flagProcedure,
                                    "kdPenunjang": kdPenunjang,
                                    "assesmentPel": assesmentPel,
                                    "skdp":{
                                        "noSurat": noSurat,
                                        "kodeDPJP": kodeDPJP
                                    },
                                    "dpjpLayan": dpjpLayan,
                                    "noTelp": $scope.item.noTelepon,
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }
                    }

                } else {
                    var dataSend = {
                        "url": "SEP/2.0/update",
                        "method": "PUT",
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noSep": $scope.dataSep.noSep,
                                    "klsRawat":{
                                        "klsRawatHak": kelasJaminan,
                                        "klsRawatNaik": kelasNaik,
                                        "pembiayaan": pembiayaan,
                                        "penanggungJawab": penanggungJawab
                                    },
                                    "noMR": $scope.item.pasien.nocm,
                                    "catatan": catatan,
                                    "diagAwal": $scope.item.diagnosa.kddiagnosa,
                                    "poli": {
                                        "tujuan": politujuan == null ? "" : politujuan,
                                        "eksekutif": polieksekutif
                                    },
                                    "cob": {
                                        "cob": cob
                                    },
                                    "katarak": {
                                        "katarak": katarak
                                    },
                                    "jaminan": {
                                        "lakaLantas": $scope.item.statusKecelakaan.id,
                                        "penjamin": {
                                            "tglKejadian": tglKejadian,
                                            "keterangan": keterangan,
                                            "suplesi": {
                                                "suplesi": suplesi,
                                                "noSepSuplesi": noSepSuplesi,
                                                "lokasiLaka": {
                                                    "kdPropinsi": kdPropinsi,
                                                    "kdKabupaten": kdKabupaten,
                                                    "kdKecamatan": kdKecamatan
                                                }
                                            }
                                        }
                                    },
                                    "dpjpLayan": dpjpLayan,
                                    "noTelp": $scope.item.noTelepon,
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }
                    }
                    
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", dataSend).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code == "200") {
                        if(!$scope.isUpdate){
                            $scope.dataSep = e.data.response.sep
                            toastr.success('Generate SEP Success. No SEP : ' + $scope.dataSep.noSep, 'Status');
                            $scope.isUpdate = true
                        } else {
                            $scope.dataSep = e.data.response.sep
                            toastr.success('Update SEP Success. No SEP : ' + $scope.dataSep.noSep, 'Status');
                        }
                        $scope.SimpanNonGenerate('bridging');
                    } else {
                        window.messageContainer.error(e.data.metaData.message)
                    }
                }, function (err) {
                    $scope.isRouteLoading = false;
                });
            }

            function validasiRawatJalan(){
                if(!$scope.item.noRujukan) { toastr.error("No.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.subSpesialis) { toastr.error("Sub/Spesialis tidak boleh kosong !"); return; }
                if(!$scope.item.dpjpMelayani) { toastr.error("DPJP yang Melayani tidak boleh kosong !"); return; }
                if(!$scope.item.ppkAsalRujukan) { toastr.error("PPK Asal Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.tglRujukan) { toastr.error("Tgl.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.diagnosa) { toastr.error("Diagnosa tidak boleh kosong !"); return; }
                if(!$scope.item.noTelepon) { toastr.error("No Telepon tidak boleh kosong !"); return; }
            }
            function validasiRawatInap(){
                if(!$scope.item.tglRujukan) { toastr.error("Tgl.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.noRujukan) { toastr.error("No.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.noSurkon) { toastr.error("No.SPRI tidak boleh kosong !"); return; }
                if(!$scope.item.dpjpSurkon) { toastr.error("DPJP Pemberi Surat SKDP/SPRI tidak boleh kosong !"); return; }
                if(!$scope.item.kelasDitanggung) { toastr.error("Kelas Rawat tidak boleh kosong !"); return; }
                if($scope.item.isNaikKelas) {
                    if(!$scope.item.naikKelas) { toastr.error("Kelas Rawat Inap tidak boleh kosong !"); return; }
                    if(!$scope.item.pembiayaan) { toastr.error("Pembiayaan tidak boleh kosong !"); return; }
                    if(!$scope.item.penanggungJawab) { toastr.error("Penanggung Jawab tidak boleh kosong !"); return; }
                }
                if(!$scope.item.diagnosa) { toastr.error("Diagnosa tidak boleh kosong !"); return; }
                if(!$scope.item.noTelepon) { toastr.error("No Telepon tidak boleh kosong !"); return; }
            }
            function validasiIgd(){
                if(!$scope.item.subSpesialis) { toastr.error("Sub/Spesialis tidak boleh kosong !"); return; }
                if(!$scope.item.dpjpMelayani) { toastr.error("DPJP yang Melayani tidak boleh kosong !"); return; }
                if(!$scope.item.diagnosa) { toastr.error("Diagnosa tidak boleh kosong !"); return; }
                if(!$scope.item.noTelepon) { toastr.error("No Telepon tidak boleh kosong !"); return; }
            }
            function validasiPascaRI(){
                if(!$scope.item.subSpesialis) { toastr.error("Sub/Spesialis tidak boleh kosong !"); return; }
                if(!$scope.item.dpjpMelayani) { toastr.error("DPJP yang Melayani tidak boleh kosong !"); return; }
                if(!$scope.item.ppkAsalRujukan) { toastr.error("PPK Asal Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.tglRujukan) { toastr.error("Tgl.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.noRujukan) { toastr.error("No.Rujukan tidak boleh kosong !"); return; }
                if(!$scope.item.diagnosa) { toastr.error("Diagnosa tidak boleh kosong !"); return; }
                if(!$scope.item.noTelepon) { toastr.error("No Telepon tidak boleh kosong !"); return; }
            }

            $scope.SimpanNonGenerate = function (statusCreateSep) {

                var id_AsPasien = ""
                var norec_PA = ""
                if($scope.item.pemakaianasuransi) {
                    id_AsPasien = $scope.item.pemakaianasuransi.norec_ap
                    norec_PA = $scope.item.pemakaianasuransi.norec
                }

                var kelasDitanggungs = "";
                if ($scope.item.kelasDitanggung) { kelasDitanggungs = $scope.item.kelasDitanggung.id } 
                else { kelasDitanggungs = "1" };

                var kdProviders = "";
                var namaProviders = "";
                if($scope.item.ppkAsalRujukan) {
                    kdProviders = $scope.item.kodeppkAsalRujukan
                    namaProviders = $scope.item.ppkAsalRujukan
                } else {
                    kdProviders = kodeppkRumahSakit
                    namaProviders = namappkRumahSakit
                }

                var norujukan = "";
                if ($scope.item.noRujukan) { norujukan = $scope.item.noRujukan }
                var tglRujukan = new moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
                if ($scope.item.tglRujukan) { tglRujukan = new moment($scope.item.tglRujukan).format('YYYY-MM-DD HH:mm:ss') }

                var tanggalsep = "";
                if ($scope.item.tglSep) { tanggalsep = new moment($scope.item.tglSep).format('YYYY-MM-DD HH:mm:ss') }

                var catatans = "";
                if ($scope.item.catatan) { catatans = $scope.item.catatan }

                var lokasiLakaLantas = "";
                if ($scope.item.lokasiLakaLantas){ lokasiLakaLantas = $scope.item.lokasiLakaLantas }
                var listPenjaminLakas = ""

                var kunjungan = 0;
                if ($scope.item.pasien.israwatinap == 'true') {
                    kunjungan = 3
                } else if ($scope.item.statuskunjungan) {
                    kunjungan = $scope.item.statuskunjungan
                } else {
                    kunjungan = 1
                }

                var asuransipasien = {
                    id_ap: id_AsPasien,
                    noregistrasi: $scope.item.pasien.noregistrasi,
                    nocm: $scope.item.pasien.nocm,
                    alamatlengkap: $scope.item.pasien.alamatlengkap,
                    objecthubunganpesertafk: 1,
                    objectjeniskelaminfk: $scope.item.pasien.objectjeniskelaminfk,
                    kdinstitusiasal: $scope.item.pasien.objectrekananfk,
                    kdpenjaminpasien: $scope.item.pasien.objectrekananfk,
                    objectkelasdijaminfk: kelasDitanggungs,
                    namapeserta: $scope.item.pasienbpjs.nama,
                    nikinstitusiasal: $scope.item.pasien.objectrekananfk,
                    noasuransi: $scope.item.pasienbpjs.noKartu,
                    alamat: $scope.item.pasien.alamatlengkap,
                    nocmfkpasien: $scope.item.pasien.nocmfk,
                    noidentitas: $scope.item.pasien.noidentitas,
                    qasuransi: $scope.item.pasien.objectkelompokpasienlastfk,
                    kelompokpasien: $scope.item.pasien.objectkelompokpasienlastfk,
                    tgllahir: $scope.item.pasien.tgllahir != undefined ? moment($scope.item.pasien.tgllahir).format('YYYY-MM-DD') : null,
                    jenispeserta: $scope.item.pasienbpjs.jenisPeserta.keterangan,
                    kdprovider: kdProviders,
                    nmprovider: namaProviders,
                    notelpmobile: $scope.item.noTelepon,                  
                }

                var pemakaianasuransi = {
                    norec_pa: norec_PA,
                    noregistrasifk: $scope.currentNorecPD,
                    tglregistrasi: $scope.item.pasien.tglregistrasi,
                    diagnosisfk: $scope.item.diagnosa.id,
                    lakalantas: $scope.item.statusKecelakaan.id,
                    nokepesertaan: $scope.item.pasienbpjs.noKartu,
                    norujukan: norujukan,
                    nosep: $scope.dataSep.noSep,
                    tglrujukan: tglRujukan,
                    objectdiagnosafk: $scope.item.diagnosa.id,
                    tanggalsep: tanggalsep,
                    catatan: catatans,
                    lokasilaka: lokasiLakaLantas,
                    penjaminlaka: listPenjaminLakas,
                    cob: $scope.item.isCOB ? $scope.item.isCOB : false,
                    katarak: $scope.item.isKatarak ? $scope.item.isKatarak : false,
                    keteranganlaka: $scope.item.ketkejadian ? $scope.item.ketkejadian : "",
                    tglkejadian: $scope.item.statusKecelakaan != undefined && $scope.item.statusKecelakaan.id != 0 && $scope.item.tglKejadian ? moment($scope.item.tglKejadian).format("YYYY-MM-DD") : null,
                    suplesi: false,
                    nosepsuplesi: "",
                    kdpropinsi: $scope.item.provinsi ? $scope.item.provinsi.kode : null,
                    namapropinsi: $scope.item.provinsi ? $scope.item.provinsi.nama : null,
                    kdkabupaten: $scope.item.kabkota ? $scope.item.kabkota.kode : null,
                    namakabupaten: $scope.item.kabkota ? $scope.item.kabkota.nama : null,
                    kdkecamatan: $scope.item.kecamatan ? $scope.item.kecamatan.kode : null,
                    namakecamatan: $scope.item.kecamatan ? $scope.item.kecamatan.nama : null,
                    nosuratskdp: $scope.item.noSurkon ? $scope.item.noSurkon : "",
                    kodedpjp: $scope.item.kodedpjpSurkon ? $scope.item.kodedpjpSurkon : null,
                    namadpjp: $scope.item.dpjpSurkon ? $scope.item.dpjpSurkon : null,
                    prolanisprb: $scope.item.pasienbpjs.informasi.prolanisPRB,
                    asalrujukanfk: $scope.item.asalRujukan ? $scope.item.asalRujukan.id : null,
                    polirujukankode: $scope.item.pasien.kdinternal,
                    polirujukannama: $scope.item.pasien.namaruangan,/// $scope.item.pasien.namaexternal
                    kodedpjpmelayani: $scope.item.dpjpMelayani ? $scope.item.dpjpMelayani.kode : null,
                    namadjpjpmelayanni: $scope.item.dpjpMelayani ? $scope.item.dpjpMelayani.nama : null,
                    klsrawatnaik: $scope.item.naikKelas ? $scope.item.naikKelas.id : null,
                    pembiayaan: $scope.item.pembiayaan ? $scope.item.pembiayaan.id : null,
                    penanggungjawab: $scope.item.penanggungJawab ? $scope.item.penanggungJawab : null,
                    tujuankunj: $scope.item.tujuanKunj ? $scope.item.tujuanKunj.id : null,
                    flagprocedure: $scope.item.prosedur ? $scope.item.prosedur.id : null,
                    kdpenunjang: $scope.item.penunjang ? $scope.item.penunjang.id : null,
                    assesmentpel: $scope.item.assesment ? $scope.item.assesment.id : null,
                    statuskunjungan: kunjungan,
                    poliasalkode: $scope.item.poliasalkode ? $scope.item.poliasalkode : null,
                    politujuankode: $scope.item.politujuankode ? $scope.item.politujuankode : null,
                }
                var objSave = {
                    asuransipasien: asuransipasien,
                    pemakaianasuransi: pemakaianasuransi
                }
                $scope.isRouteLoading = true
                medifirstService.post("registrasi/save-asuransipasien", objSave).then(function (e) {
                    var msgLogging = ""
                    var lognosep = $scope.dataSep.noSep
                    if(!$scope.item.pemakaianasuransi) {
                        $scope.item.pemakaianasuransi = {};
                    }
                    $scope.item.pemakaianasuransi.nosep = e.data.PA.nosep
                    $scope.item.pemakaianasuransi.nmprovider = e.data.AP.nmprovider
                    $scope.item.pemakaianasuransi.poliasalkode = e.data.PA.poliasalkode
                    $scope.item.pemakaianasuransi.tglcreate = e.data.PA.tglcreate
                    $scope.item.pemakaianasuransi.flagprocedure = e.data.PA.flagprocedure
                    $scope.item.pemakaianasuransi.statuskunjungan = e.data.PA.statuskunjungan
                    // if (nosep == "") {
                    //     statusCreateSep = 'manual'
                    //     lognosep = "kosong"
                    // }
                    if (norec_PA == "") {
                        msgLogging = "INSERT ";
                    } else {
                        msgLogging = "UPDATE ";
                    }
                    msgLogging += 'No SEP ' + $scope.dataSep.noSep + ' dibuat ' + statusCreateSep + ' dengan tgl sep ' + tanggalsep + ' di No Registrasi ' + $scope.item.pasien.noregistrasi
                    medifirstService.postLogging('Pemakaian Asuransi', 'Norec pasiendaftar_t', $scope.currentNorecPD, msgLogging).then(function (res) { })
                    $scope.isRouteLoading = false

                }, function (error) {
                    $scope.isRouteLoading = false
                })
            }

            $scope.hapusAsuransi = function () {
                var confirm = $mdDialog.confirm()
                .title('Peringatan')
                .textContent('Apakah Anda yakin ingin menghapus SEP ?')
                .ariaLabel('Lucky day')
                .cancel('Tidak')
                .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    let json = {
                        "url": "SEP/2.0/delete",
                        "method": "DELETE",
                        "data": {
                            "request": {
                                "t_sep": {
                                    "noSep": $scope.dataSep.noSep,
                                    "user": medifirstService.getPegawaiLogin().namaLengkap
                                }
                            }
                        }
                    }
                    medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                        if (e.data.metaData.code === "200") {
                            var msgLogging = 'DELETE No SEP ' + $scope.dataSep.noSep + ' di No Registrasi ' + $scope.item.pasien.noregistrasi
                            medifirstService.postLogging('Pemakaian Asuransi', 'nosep pemakaianasuransi_t', $scope.dataSep.noSep, msgLogging).then(function (res) { })
                            var arrStatus = {
                                noSep: $scope.dataSep.noSep
                            }
                            medifirstService.postNonMessage('registrasi/hapus-sep', arrStatus).then(function (e) { })
                            window.messageContainer.log("Success Delete SEP");
                            $scope.dataSep = undefined
                            $scope.isUpdate = false
                            location.reload()
                        }
                        else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                    })
                })
            }
            $scope.cetakAsuransiHtml = function () {
                var profile = medifirstService.getProfile();
                window.open(configuration.baseApiBackend + 'report/cetak-sep-v3?noregistrasi='+ $scope.item.pasien.noregistrasi +'&kdprofile=' + profile.kdprofile, "_blank")
            }
            $scope.rujukAsuransi = function () {}

            $scope.pasienLama = function () {
                $state.go('RegistrasiPasienLama');
            }

            $scope.cetakAsuransi = function () { 
                var qrcode = new QRCode("qr_code", {
					text: $scope.item.pasienbpjs.noKartu,
					width: 128,
					height: 128,
					colorDark : "#000000",
					colorLight : "#ffffff",
					correctLevel : QRCode.CorrectLevel.H
				});

                if ($scope.item.pasien.noregistrasi != undefined && $scope.item.pasien.kelompokpasien !== "Umum/Pribadi") {
					let json = {
						"url": "SEP/" + $scope.item.pemakaianasuransi.nosep ,
						"method": "GET",
						"data": null
					}
					medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
						if (e.data.metaData.code == 200) {
							cetakSEP(e.data.response)
						}
						else toastr.info(e.data.metaData.message, 'Info')
					})
				}
            }
            
            $scope.listPenjaminLaka = [
                { "id": 12, "name": "Jasa Raharja PT", "value": 1 },
                { "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2 },
                { "id": 14, "name": "TASPEN PT", "value": 3 },
                { "id": 15, "name": "ASABRI PT", "value": 4 }
            ];
			$scope.currentListPenjaminLaka = []
            function cetakSEP(response) {
           
                var nosep = response.noSep
                var nmperujuk = $scope.item.pemakaianasuransi.nmprovider

                var tglsep = response.tglSep
                var nokartu =response.peserta.noKartu + '  ( MR. ' + response.peserta.noMr + ' )';
                var nmpst =response.peserta.nama
                var tgllahir = response.peserta.tglLahir
                var jnskelamin =response.peserta.kelamin== 'L' ? '  Kelamin : Laki-Laki' : '  Kelamin :Perempuan';
                var poli = response.jnsPelayanan== 'Rawat Inap' ? '-' : $scope.item.pasien.namaruangan;
                var faskesperujuk = response.jnsPelayanan== 'Rawat Inap' ? namappkRumahSakit : nmperujuk;
                var notelp = $scope.item.pasien.notelepon
                var dxawal = response.diagnosa.substring(0, 45);
                var catatan = response.catatan
                var jnspst = response.peserta.jnsPeserta
                var FLAGCOB = response.cob
                var cob = '-';
                if (FLAGCOB) {
                    cob = response.cob ? response.cob : null
                }

                //cob non aktif
                var FLAGNAIKKELAS = response.klsRawat.klsRawatNaik != null &&  response.klsRawat.klsRawatNaik != '' ? '1' : '0'
                var klsrawat_naik = response.klsRawat.klsRawatNaik != null &&  response.klsRawat.klsRawatNaik != '' ?response.klsRawat.klsRawatNaik:''

                var jnsrawat = response.jnsPelayanan == 'Rawat Inap'  ? 'R.Inap' : 'R.Jalan';
                var klsrawat = response.peserta.hakKelas//response.kelasRawat
                if (response.jnsPelayanan == 'Rawat Inap') {
					var kelasrawat = response.kelasRawat
				} else {
					var kelasrawat = '-'
				}
                var prolanis =  ""
                var eksekutif = response.jnsPelayanan == 'Rawat Inap'  ? '' : response.poliEksekutif== 1 ? ' (Poli Eksekutif)' : '';
                var katarak = response.katarak ;
                var potensiprb = ""
                var statuskll = response.kdStatusKecelakaan
                var _kodejaminan = '-';
                if (response.kdStatusKecelakaan !='' && response.kdStatusKecelakaan!='0') {
					var pen =  response.penjamin.split(', ')
                    var a = ""
                    var b = ""
					for (let x = 0; x < 	$scope.listPenjaminLaka.length; x++) {
						const element = 	$scope.listPenjaminLaka[x];
						for (let z = 0; z < pen.length; z++) {
							const element2 = pen[z];
							if(element2 == element.name){
								$scope.currentListPenjaminLaka.push({value:element.value})
							}
						}
					}
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = ";" + c
                        a = a + b
                    }
                    _kodejaminan = a.slice(1, a.length)
                }
                var dokter = (response.jnsPelayanan == 'Rawat Inap') ? (response.kontrol.nmDokter ) : response.dpjp.nmDPJP ;
                var FLAGPROSEDUR = $scope.item.pemakaianasuransi.flagprocedure

                var kunjungan = 0;
                if (response.jnsPelayanan == 'Rawat Inap') {
                    kunjungan = 3
                } else if ($scope.item.pemakaianasuransi.statuskunjungan) {
                    kunjungan = $scope.item.pemakaianasuransi.statuskunjungan
                } else {
                    kunjungan = 1
                }

                var isrujukanthalasemia_hemofilia = 0

                if ($scope.item.pasien.namaruangan.indexOf('IGD') >-1) {
                    nmperujuk = '';
                    kunjungan = 0;
                    FLAGPROSEDUR = null;
                }
                var poliPerujuk = '-'
                if ($scope.item.pemakaianasuransi.poliasalkode) {
                    poliPerujuk = $scope.item.pemakaianasuransi.poliasalkode
                }

                var backdate = medifirstService.cekBackdate(tglsep,  $scope.item.pemakaianasuransi.tglcreate ?  $scope.item.pemakaianasuransi.tglcreate : tglsep);
                var ispotensiHEMOFILIA_cetak = 0
				var cetakan = 1;
				medifirstService.jspdfSEP2(nosep + backdate, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, kelasrawat, jnspst, cob, jnsrawat, klsrawat,
                    prolanis, eksekutif, _kodejaminan, statuskll, katarak, potensiprb,cetakan, dokter, kunjungan, FLAGPROSEDUR, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik,
					 isrujukanthalasemia_hemofilia, ispotensiHEMOFILIA_cetak,namappkRumahSakit);


            }
            $scope.iCare = function () {
                var dpjpLayan = ""
                if($scope.item.pasien.israwatinap == "false") {
                    if($scope.item.dpjpMelayani) {
                        dpjpLayan = $scope.item.dpjpMelayani.kode
                    }
                } else {
                    if($scope.item.dpjpSurkon) {
                        dpjpLayan = $scope.item.kodedpjpSurkon
                    }
                }
                let json = {
                    "url": "api/rs/validate",
                    "method": "POST",
                    "jenis": "i-care",
                    "data":  {
                        "param": $scope.item.pasienbpjs.noKartu,
                        "kodedokter": dpjpLayan ? parseInt(dpjpLayan) :null
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == "200") {
                        window.open(e.data.response.url, "_blank")
                    }  else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                })
              
            }

            async function updateWaktuId(res, kodebooking, norec_pd) {
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    var data = {
                        "url": "antrean/updatewaktu",
                        "jenis": "antrean",
                        "method": "POST",
                        "data":
                        {
                            "kodebooking": kodebooking,
                            "taskid": element.taskid,
                            "waktu": parseInt(element.waktu)
                        }
                    }
                    await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                        if(e.data.metaData.code == 200) {
                            await saveMonitoringTaksId(norec_pd,  element.taskid, parseInt(element.waktu), true);
                        }
                    })
                }
            }

            function saveMonitoringTaksId(noregistrasifk, taskid, waktu, statuskirim) {
                var json = {
                    "noregistrasifk": noregistrasifk,
                    "taskid": taskid,
                    "waktu": waktu,
                    "statuskirim": statuskirim
                }
                medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(function (e) {})
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            // End Event Click
        }
    ]);
});
