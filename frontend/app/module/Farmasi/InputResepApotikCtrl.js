define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputResepApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', '$window', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, $window, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            var norecAPD = $state.params.noRec;
            $scope.isRouteLoading = false;
            $scope.tambahobt = true;
            $scope.item = {};
            $scope.data = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.rke = 1;
            $scope.showInputObat = true
            $scope.showRacikan = false
            $scope.tombolSimpanVis = true
            $scope.disabledRuangan = true;
            $scope.statusConsis = false;
            $scope.item.hargaNetto = 0;
            $scope.butPaket = false;
            $scope.tglkadaluarsa = undefined;
            $scope.kdapotikonline = undefined
            $scope.isfornas = undefined
            $scope.HargaMaster = -1;
            $scope.disTanggal = false;
            $scope.item.paketPelayanan = false
            $scope.showTotalSetelah = false
            $scope.showChkPaket = true
            $scope.showChkHibah = true
            $scope.discito = false
            $scope.hidebpjs = true
            var statusTambah = true
            var pegawaiUser = {}
            var norec_apd = '';
            var noOrder = '';
            var norecResep = '';
            var dataProdukDetail = [];
            var noTerima = '';
            var data2 = [];
            var data2R = [];
            var dataOK = [];
            var hrg1 = 0
            var hrgsdk = 0
            var racikan = 0
            var strStatus = 0
            var tarifJasa = 0
            var isPemakaianObatAlkes = false;
            var norecSkrining = "";
            $scope.item.aturanPakai = "";
            var dataPaket = [];
            var dataPaketGrid = [];
            $scope.showGridKronis = false
            var chacePeriode = cacheHelper.get('InputResepApotikCtrl');
            if(chacePeriode[17] === "✔" || chacePeriode[17] === "✘"){
                $scope.discito = true
            } else if(chacePeriode[17] == null){
                $scope.discito = false
            } else if(chacePeriode[17] != "✔"){
                $scope.discito = false
            } else{
                $scope.discito = false
            }
            console.log(chacePeriode)
            
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            //* SKRINING */
            $scope.currentPrinsipBesar = [];
            $scope.currentAturanPakai = [];
            $scope.listDataPenulis1 = [
                {skrining: "a. Nama, tanggal lahir, jenis kelamin, dan identitas", id:1,
                masalah: [{ name: "Ya", id: 1},
                { name: "Tidak", id: 2}]},
            ];

            
            $scope.listDataPenulis2 = [
                {skrining: "b. Identitas dokter penulis resep dan paraf/keabsahan dokter", id:2,
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataPenulis3 = [
                {skrining: "c. Tanggal Resep", id:3,
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataPenulis4 = [
                {skrining: "d. Cara bayar pasien", id:4,
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
                // {skrining: "e. Ruangan/unit asal resep", id:5,
                // masalah: [{ name: "Ya", id: 1 },
                // { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataPenulis5 = [
                {skrining: "e. Ruangan/unit asal resep", id:5,
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            
            //farmaetis
            $scope.listDataTanggal1 = [
                {skrining: "a. Nama obat, bentuk sediaan",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataTanggal2 = [
                {skrining: "b. Dosis dan jumlah obat",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataTanggal3 = [
                {skrining: "c. Stabilitas dan inkompatibilitas sediaan",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataTanggal4 = [
                {skrining: "d. Aturan dan cara penggunaan",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            //list klinis
            $scope.listKlinis1 = [
                {skrining: "a. Ketepatan indikasi, dosis, dan waktu penggunaan obat",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis2 = [
                {skrining: "b. Duplikasi pengobatan",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis3 = [
                {skrining: "c. Potensi Alergi/Hipersensitivitas dan reaksi Obat yang Tidak Dikehendaki",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis4 = [
                {skrining: "d. Interaksi antara obat dan obat lain atau dengan makanan",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis5 = [
                {skrining: "e. Variasi kriteria penggunaan dari rumah sakit(PPK dan Formularium",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis6 = [
                {skrining: "f. Berat badan, tinggi badan pasien dan atau informasi fisiologis lainnya(jika diperlukan)",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listKlinis7 = [
                {skrining: "g. Kontraindikasi",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataPasienRM = [
                {skrining: "Tepat Pasien",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            // $scope.listDataTepatNama = [
            //     {skrining: "Tepat Nama Obat",
            //     masalah: [{ name: "Ya", id: 1 },
            //     { name: "Tidak", id: 2 }]},
            // ];
            $scope.listDataRM = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataPasien = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataLahir = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataBerat = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataDokter = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataRuang = [
                {skrining: "Tepat Nama Obat",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ]
            $scope.listDataStatus = [
                {skrining: "Tepat dosis dan jumlah obat",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataObat = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataKekuatan = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataJumlah = [
                {skrining: "Tepat rute pemberian",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataWaktu = [
                {skrining: "Tepat waktu pemberian",
                masalah: [{ name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }]},
            ];
            $scope.listDataStabilitas = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataAturan = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataIndikasi = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];

            $scope.listDataAlergi = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataKonsumsi = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataDuplikat = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataInteraksi = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataAntibiotik = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataPoli = [
                { name: "Ya", id: 1 },
                { name: "Tidak", id: 2 }
            ];
            $scope.listDataCek = [
                { name: "Tidak Semua", id: 1 },
                { name: "Ada Semua", id: 2 }
            ];

            $scope.listPrinsipBesar = [
                {
                    "id": 1,
                    "nama": "Ceklis Prinsip 7 Benar",
                    "detail": [
                        { "id": 1, "nama": "Benar Pasien" },
                        { "id": 2, "nama": "Benar Indikasi" },
                        { "id": 3, "nama": "Benar Obat" },
                        { "id": 4, "nama": "Benar Dosis" },
                        { "id": 5, "nama": "Benar Cara Pemberian" },
                        { "id": 6, "nama": "Benar Waktu Pemberian" },
                        { "id": 7, "nama": "Benar Dokumentasi" },
                    ]
                }
            ]
            $scope.listDataSigna = [
                {
                    "id": 1,
                    "nama": "Aturan Pakai",
                    "detail": [
                        { "id": 1, "nama": "P", 'isChecked': false },
                        { "id": 2, "nama": "S", 'isChecked': false },
                        { "id": 3, "nama": "Sr", 'isChecked': false },
                        { "id": 4, "nama": "M", 'isChecked': false }
                    ]
                }
            ];
            $scope.listJenisObat = [
                {
                    "id": 1,
                    "jenisobat": "Obat PRB"
                },
                {
                    "id": 2,
                    "jenisobat": "Obat Kronis Blm Stabil"
                },
                {
                    "id": 3,
                    "jenisobat": "Obat Kemoterapi"
                }
            ]

            $scope.listIterasi = [
                {
                    "id": 0,
                    "iterasi": "Non Iterasi"
                },
                {
                    "id": 1,
                    "iterasi": "Iterasi"
                }
            ]
            $scope.item.chkp = 0
            $scope.item.chks = 0
            $scope.item.chksr = 0
            $scope.item.chkm = 0
            $scope.addListAturanPakai = function (bool, data) {
                let jml = 0
                var index = $scope.currentAturanPakai.indexOf(data);
                if (bool == true) {
                    $scope.currentAturanPakai.push(data);
                    if (data.id == 1) {
                        $scope.item.chkp = 1
                        // jml =jml +1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 1
                        // jml =jml +1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 1
                        // jml =jml +1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 1
                        // jml =jml +1
                    }
                } else {
                    $scope.currentAturanPakai.splice(index, 1);
                    if (data.id == 1) {
                        $scope.item.chkp = 0
                        // jml =jml -1
                    }
                    if (data.id == 2) {
                        $scope.item.chks = 0
                        // jml =jml -1
                    }
                    if (data.id == 3) {
                        $scope.item.chksr = 0
                        // jml =jml -1
                    }
                    if (data.id == 4) {
                        $scope.item.chkm = 0
                        // jml =jml -1
                    }
                }
                if ($scope.item.chkp == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chks == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chksr == 1) {
                    jml = jml + 1
                }
                if ($scope.item.chkm == 1) {
                    jml = jml + 1
                }
                $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai = $scope.currentAturanPakai.length + 'x1'
                if (jml == 0) {
                    $scope.item.aturanPakai = ''
                }

            }

            $scope.addListPrinsipBesar = function (bool, data) {
                var index = $scope.currentPrinsipBesar.indexOf(data);
                if (_.filter($scope.currentPrinsipBesar, {
                    id: data.id
                }).length === 0)
                    $scope.currentPrinsipBesar.push(data);
                else {
                    $scope.currentPrinsipBesar.splice(index, 1);
                }

            }
            //* SKRINING */
            LoadCache();
            loadDefaultSkrining();

            function LoadCache() {
                // medifirstService.getDataTableTransaksi("akutansi/get-terakhir-posting", true).then(function(dat){
                //     var tgltgltgltgl = dat.data.data[0].max
                //     $scope.startDateOptions = {
                //         min: new Date(tgltgltgltgl),
                //         max: new Date($scope.now)
                //     };
                // })

                console.log($scope.data.Penulis1)
                

                $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
                if($scope.pegawaiLogin.jenisPegawai.jenispegawai =="Apoteker"){
                    $scope.item.ruangan = { id: 94, namaruangan: 'FARMASI' };
                }
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                });
                var chacePeriode2 = cacheHelper.get('cacheanuaing');
                if (chacePeriode2 != undefined) {
                    $scope.item.ruangan = chacePeriode2[0];
                    $scope.item.aturanPakai = chacePeriode2[1];
                    $scope.item.jenisKemasan = chacePeriode2[2];
                    $scope.item.route = chacePeriode2[3];
                }
                var chacePeriode = cacheHelper.get('InputResepApotikCtrl');
                console.log(chacePeriode)
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.nocm = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noRegistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglregistrasi = moment(chacePeriode[7]).format('YYYY-MM-DD HH:mm')
                    norec_apd = chacePeriode[8]
                    noOrder = chacePeriode[9]
                    $scope.item.jenisPenjamin = chacePeriode[10]
                    $scope.item.kelompokPasien = chacePeriode[11]
                    $scope.item.beratBadan = chacePeriode[12]
                    $scope.item.AlergiYa = chacePeriode[13]
                    norecResep = chacePeriode[14]
                    // $scope.item.penulisResep = chacePeriode[15]
                    $scope.item.nosep = chacePeriode[16]
                    $scope.item.tanggalsep = chacePeriode[17]
                    $scope.item.kodeapotikonline = chacePeriode[18]
                    $scope.item.kelompokpasien = chacePeriode[19]
                    $scope.item.kpid = chacePeriode[20]
                    if(chacePeriode[17] == '✔'){
                        $scope.item.cito = true
                    } else{
                        $scope.item.cito = false
                    }
                    $scope.item.tglAwal = new Date($scope.now);
                    $scope.item.resep = '-';
                    if ($scope.item.kelompokpasien != undefined){
                        if ($scope.item.kelompokpasien.match(/BPJS.*/)) {
                            $scope.hidebpjs = false
                        } else {
                            $scope.hidebpjs = true
                        }
                    }
                    
                    loadAlamat();
                } else {

                }
                var cachePemakaianOA = cacheHelper.get('cachePemakaianOA');
                var cachePemakaianOA = cacheHelper.get('cachePemakaianOA');
                if (cachePemakaianOA != undefined) {
                    isPemakaianObatAlkes = true
                    cacheHelper.set('cachePemakaianOA', undefined);
                }
            }

            function loadAlamat() {
                medifirstService.get("farmasi/get-alamat?noregistrasi=" + $scope.item.noRegistrasi + "&norec_apd=" + norec_apd).then(function (e) {
                    if ($scope.item.jenisPenjamin == undefined)
                        $scope.item.jenisPenjamin = e.data.kelompokpasien
                    $scope.item.alamatPasien = e.data.alamatlengkap
                    $scope.item.tglLahir = e.data.tgllahir;
                    $scope.item.AlergiYa = e.data.alergi;
                    $scope.item.RuangInput = e.data.ruanginput;
                    $scope.item.RuangRawat = e.data.ruangrawat;
                    $scope.item.Ruangrawat = e.data.ruangrawat;
                    $scope.item.TglPulang = e.data.tglpulang;
                    $scope.item.TglMeninggal = e.data.tglmeninggal;
                    $scope.item.StatKeluar = e.data.statuskeluar;
                    $scope.item.StatPulang = e.data.statuspulang;
                    $scope.item.norec_pd = e.data.norec_pd
                    if (e.data.noreservasi != ''){
                        $scope.item.noreservasi = e.data.noreservasi;
                        

                    }
                    $scope.item.kpid = e.data.kpid;
                    $scope.dpjp = { id: e.data.objectpegawaifk, namalengkap: e.data.namalengkap }
                    $scope.listRuangan = medifirstService.getMapLoginUserToRuangan();
                    // $scope.item.ruangan = $scope.listRuangan[0];
                    for (let i = 0; i < $scope.listRuangan.length; i++) {
                        const element = $scope.listRuangan[i];
                        if (e.data.objectdepartemenfk == 24 && element.id == 125) {
                            $scope.item.ruangan = { id: element.id, namaruangan: element.namaruangan };
                            break;
                        }
                        if (e.data.objectdepartemenfk == 16 && element.id == 116) {
                            $scope.item.ruangan = $scope.listRuangan[0];
                            $scope.item.ruangan = { id: element.id, namaruangan: element.namaruangan };
                            break;
                        }
                        if (e.data.objectdepartemenfk == 18 && element.id == 94) {
                            $scope.item.ruangan = { id: element.id, namaruangan: element.namaruangan };
                            break;
                        }
                        if (e.data.objectdepartemenfk == 25 && element.id == 556) {
                            $scope.item.ruangan = { id: element.id, namaruangan: element.namaruangan };
                            break;
                        }
                    }
                    init();
                })
            }
            function saveAntrol(param, task, norec_pd) {
                var data = {
                    "url": "antrean/updatewaktu",
                    "jenis": "antrean",
                    "method": "POST",
                    "data": {
                        "kodebooking": param,
                        "taskid": task, //Waktu mulai farmasi
                        "waktu": new Date().getTime()
                    }
                }
                saveMonitoringTaksId(norec_pd, task, new Date().getTime(), false)
                medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        saveMonitoringTaksId(norec_pd, task, new Date().getTime(), true)
                    } else {
                        repeatSendTaskId(norec_pd, task)
                    }
                })
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

            function repeatSendTaskId(norec_pd, taskid) {
                medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(function (e) {
                    var data = {
                        "url": "antrean/add",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": e.data
                    }
                    medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
                        // simpan log
                        medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
                            e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
                            JSON.stringify(data) + ' | ' + JSON.stringify(x.data))

                        // mengabil data catatan task id dari 1 - 4
                        medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
                            updateWaktuId(res, e.data.kodebooking, norec_pd)
                        })
                    })
                })
            }

            async function updateWaktuId(res, kodebooking, norec_pd) {
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    var data = {
                        "url": "antrean/updatewaktu",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": {
                            "kodebooking": kodebooking,
                            "taskid": element.taskid,
                            "waktu": parseInt(element.waktu)
                        }
                    }
                    await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                        if (e.data.metaData.code == 200) {
                            await saveMonitoringTaksId(norec_pd, element.taskid, parseInt(element.waktu), true);
                        }
                    })
                }
            }

            function loadDefaultSkrining() {
                $scope.data.Penulis1 = 1;
                $scope.data.Penulis2 = 1;
                $scope.data.Penulis3 = 1;
                $scope.data.Penulis4 = 1;
                $scope.data.Penulis5 = 1;
                $scope.data.Tanggal1 = 1;
                $scope.data.Tanggal2 = 1;
                $scope.data.Tanggal3 = 1;
                $scope.data.Tanggal4 = 1;
                $scope.data.klinis1 = 1;
                $scope.data.klinis2 = 2;
                $scope.data.klinis3 = 2;
                $scope.data.klinis4 = 2;
                $scope.data.klinis5 = 2;
                $scope.data.klinis6 = 2;
                $scope.data.klinis7 = 2;
                $scope.data.datapasienrm = 1;
                $scope.data.DataRuang = 1;
                $scope.data.DataStatus = 1;
                $scope.data.DataJumlah = 1;
                $scope.data.DataWaktu = 1;
                // $scope.data.Tanggal = 1;
                // $scope.data.klinis = 1;
                // $scope.data.DataRM = 1;
                // $scope.data.Pasien = 1;
                // $scope.data.DataLahir = 1;
                // $scope.data.Berat = 2;
                // $scope.data.DataDokter = 2;
                // $scope.data.DataRuang = 1;
                // $scope.data.DataStatus = 1;
                // $scope.data.Obat = 1;
                // $scope.data.DataKekuatan = 1;
                // $scope.data.DataJumlah = 1;
                // $scope.data.DataStabilitas = 2;
                // $scope.data.DataAturan = 2;
                // $scope.data.DataIndikasi = 2;
                // $scope.data.DataAlergi = 2;
                // $scope.data.DataKonsumsi = 2;
                // $scope.data.DataDuplikat = 2;
                // $scope.data.DataInteraksi = 2;
                // $scope.data.DataAntibiotik = 2;
                // $scope.data.DataPoli = 2;
            }

            $scope.getCheckisKronis = function (getCheckisKronis) {
                if (getCheckisKronis != undefined) {
                    $scope.getCheckisKronis = getCheckisKronis
                }
            }

            $scope.getCheckResepPulang = function (checkResepPulang) {
                if (checkResepPulang != undefined) {
                    $scope.checkResepPulang = checkResepPulang
                }
            }

            function init() {
                $scope.isRouteLoading = true;
                // debugger;
                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.listPenulisResep = dat.data.penulisresep;
                    // $scope.item.penulisResep = $scope.dpjp
                    $scope.listJenisKemasan = dat.data.jeniskemasan;
                    $scope.listProduk = dat.data.produkall;
                    $scope.listAsalProduk = dat.data.asalproduk;
                    $scope.listRoute = dat.data.route;
                    $scope.listAturanPakai = dat.data.signa;
                    $scope.listJenisRacikan = dat.data.jenisracikan;
                    $scope.listsatuanresep = dat.data.satuanresep;
                    pegawaiUser = dat.data.detaillogin[0];
                    $scope.item.tarifadminresep = dat.data.tarifadminresep.nilaifield
                    $scope.listsbsm = [{ id: 1, name: 'Sebelum Makan' }, { id: 2, name: 'Bersama' }, { id: 3, name: 'Sesudah Makan' }]
                    $scope.listPenyekriningResep = dat.data.penyekrining;

                    // $scope.item.ruangan = {id:$scope.listRuangan[0].id,namaruangan:$scope.listRuangan[0].namaruangan}
                    // $scope.item.penulisResep = {id:data_ih.data.detailresep.pgid,namalengkap:data_ih.data.detailresep.namalengkap}

                    if (noOrder != '') {
                        console.log(noOrder)
                        if (noOrder == 'EditResep') {
                            medifirstService.get("farmasi/get_detail-resep?norecResep=" + norecResep, true).then(function (data_ih) {
                                $scope.isRouteLoading = false;
                                LoadSkrining();
                                $scope.item.penulisResep = [];
                                $scope.disabledRuangan = true;
                                $scope.item.resep = data_ih.data.detailresep.noresep
                                $scope.item.ruangan = { id: data_ih.data.detailresep.id, namaruangan: data_ih.data.detailresep.namaruangan }
                                $scope.item.penulisResep = { id: data_ih.data.detailresep.pgid, namalengkap: data_ih.data.detailresep.namalengkap }
                                $scope.item.tglAwal = new Date(data_ih.data.detailresep.tglresep);
                                var resep = data_ih.data.detailresep.noresep.split("/");
                                var bulanNow = moment($scope.now).format('MM');
                                if (resep[1].substr(2) != bulanNow) {
                                    toastr.warning("Tanggal Resep Tidak Dapat Diubah (Hanya dapat diubah dibulan yang sama) ")
                                    $scope.disTanggal = true;
                                }
                                if (data_ih.data.detailresep.isreseppulang == '1') {
                                    $scope.checkResepPulang = true;
                                } else {
                                    $scope.checkResepPulang = false;
                                }
                                data2 = data_ih.data.pelayananPasien
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    // data.no = $scope.item.no                                 
                                    if (data2[i].iskronis == true) {
                                        data2[i].obtkronis = "✔"
                                    } else {
                                        data2[i].obtkronis = ""
                                    }
                                    data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                    data2[i].tglregistrasi = $scope.item.tglregistrasi
                                    // data.generik = null
                                    //data2[i].hargajual = $scope.item.hargaSatuan
                                    // data.jenisobatfk = null
                                    data2[i].kelasfk = $scope.item.kelas.id
                                    // (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                                    $scope.rckn = (parseFloat(data2[i].jumlah) / parseFloat(data2[i].dosis)) * parseFloat(data2[i].kekuatan)
                                    console.log(parseFloat(data2[i].jumlah), parseFloat(data2[i].dosis), parseFloat(data2[i].kekuatan));
                                    data2[i].jumlahracikan = data2[i].jeniskemasanfk == 1 ? $scope.rckn : null
                                    //data2[i].stock = $scope.item.stok
                                    //data2[i].harganetto = $scope.item.hargaSatuan
                                    //data2[i].nostrukterimafk = noTerima
                                    // data.ruanganfk = $scope.item.ruangan.id

                                    // data.rke = $scope.item.rke
                                    // data.jeniskemasanfk = $scope.item.jenisKemasan.id
                                    // data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                    // data2[i].aturanpakaifk = $scope.item.aturanPakai.id
                                    // data2[i].aturanpakai = $scope.item.aturanPakai.nama
                                    // data2[i].routefk = $scope.item.route.id
                                    // data2[i].route = $scope.item.route.name
                                    //data2[i].asalprodukfk = $scope.item.asal.id
                                    //data2[i].asalproduk = $scope.item.asal.asalproduk
                                    // data.produkfk = $scope.item.produk.id
                                    // data.namaproduk = $scope.item.produk.namaproduk
                                    // data.nilaikonversi = $scope.item.nilaiKonversi
                                    // data.satuanstandarfk = $scope.item.satuan.id
                                    // data.satuanstandar = $scope.item.satuan.satuanstandar
                                    // data.satuanviewfk = $scope.item.satuan.ssid
                                    // data.satuanview = $scope.item.satuan.satuanstandar
                                    //data2[i].jmlstok = $scope.item.stok
                                    // data.jumlah = $scope.item.jumlah
                                    //data2[i].hargasatuan = $scope.item.hargaSatuan
                                    //data2[i].hargadiscount = $scope.item.hargadiskon
                                    //data2[i].total = $scope.item.total
                                }
                                // $scope.dataGrid.add($scope.dataSelected)                                
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                // $scope.dataGrid = dat.data.orderpelayanan
                                // $scope.item.ruangan = {id:dat.data.strukorder.id,namaruangan:dat.data.strukorder.namaruangan}
                                // $scope.item.penulisResep = {id:dat.data.strukorder.pgid,namalengkap:dat.data.strukorder.namalengkap}
                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        } else {
                            medifirstService.get("farmasi/get-detail-order?noorder=" + noOrder, true).then(function (dat) {
                                $scope.isRouteLoading = false;
                                $scope.disabledRuangan = true;
                                $scope.item.penulisResep = [];
                                $scope.item.ruangan = { id: dat.data.strukorder.id, namaruangan: dat.data.strukorder.namaruangan }
                                $scope.item.penulisResep = { id: dat.data.strukorder.pgid, namalengkap: dat.data.strukorder.namalengkap }
                                if (dat.data.strukorder.isreseppulang == '1') {
                                    $scope.checkResepPulang = true;
                                } else {
                                    $scope.checkResepPulang = false;
                                }
                                data2 = dat.data.orderpelayanan
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    // data.no = $scope.item.no
                                    // medifirstService.getDataTableTransaksi("logistik/get-produkdetail?"+
                                    //     "produkfk="+ data2[i].produkfk +
                                    //     "&ruanganfk="+ $scope.item.ruangan.id , true).then(function(dat){
                                    //         //dataProdukDetail =dat.data.detail;
                                    //         // data2[i].jmlstok =dat.data.jmlstok / data2[i].nilaiKonversi
                                    //         // data2[i].jumlah =dat.data.detail.jumlah//parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                                    //         // $scope.item.hargaSatuan =0
                                    //         // $scope.item.hargadiskon =0
                                    //         // $scope.item.total =0
                                    //         // $scope.item.jumlahxmakan =1
                                    //         // $scope.item.dosis =dat.data.detail.dosis
                                    //         // $scope.item.jumlahxmakan =parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.item.dosis)

                                    //         // $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi
                                    //         // $scope.item.satuan = {ssid:$scope.dataSelected.satuanviewfk,satuanstandar:$scope.dataSelected.satuanview}
                                    //         for (var i = 0; i < dat.data.detail.length; i++) {
                                    //             if (parseFloat(data2[i].jumlah * parseFloat(data2[i].nilaikonversi) ) <= parseFloat(dat.data.detail[i].qtyproduk) ){
                                    //                 hrg1 = parseFloat(dat.data.detail[i].hargajual)* parseFloat(data2[i].nilaikonversi)
                                    //                 hrgsdk = parseFloat(dat.data.detail[i].hargadiscount) * parseFloat(data2[i].nilaikonversi)
                                    //                 data2[i].hargasatuan = hrg1
                                    //                 data2[i].hargadiscount = hrgsdk
                                    //                 data2[i].total = parseFloat(data2[i].jumlah) * (hrg1-hrgsdk)
                                    //                 data2[i].nostrukterimafk = dat.data.detail[i].norec
                                    //                 data2[i].asalproduk=dat.data.detail[i].asalproduk
                                    //                 data2[i].asalprodukfk=dat.data.detail[i].objectasalprodukfk
                                    //                 break;
                                    //             }
                                    //         }
                                    //         // data2[i].hargasatuan =dat.data.detail.hargajual
                                    //         // data2[i].hargadiscount = dat.data.detail.hargadiscount
                                    //         // data2[i].total = (dat.data.detail.hargajual-dat.data.detail.hargadiscount)*data2[i].jumlah
                                    // });

                                    data2[i].noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                    data2[i].tglregistrasi = $scope.item.tglregistrasi
                                    // data2[i].jumlahracikan = 
                                    // data.generik = null
                                    //data2[i].hargajual = $scope.item.hargaSatuan
                                    // data.jenisobatfk = null
                                    data2[i].kelasfk = $scope.item.kelas.id
                                    //data2[i].stock = $scope.item.stok
                                    //data2[i].harganetto = $scope.item.hargaSatuan
                                    //data2[i].nostrukterimafk = noTerima
                                    // data.ruanganfk = $scope.item.ruangan.id

                                    // data.rke = $scope.item.rke
                                    // data.jeniskemasanfk = $scope.item.jenisKemasan.id
                                    // data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                    // data2[i].aturanpakaifk = $scope.item.aturanPakai.id
                                    // data2[i].aturanpakai = $scope.item.aturanPakai.nama
                                    // data2[i].routefk = $scope.item.route.id
                                    // data2[i].route = $scope.item.route.name
                                    //data2[i].asalprodukfk = $scope.item.asal.id
                                    //data2[i].asalproduk = $scope.item.asal.asalproduk
                                    // data.produkfk = $scope.item.produk.id
                                    // data.namaproduk = $scope.item.produk.namaproduk
                                    // data.nilaikonversi = $scope.item.nilaiKonversi
                                    // data.satuanstandarfk = $scope.item.satuan.id
                                    // data.satuanstandar = $scope.item.satuan.satuanstandar
                                    // data.satuanviewfk = $scope.item.satuan.ssid
                                    // data.satuanview = $scope.item.satuan.satuanstandar
                                    //data2[i].jmlstok = $scope.item.stok
                                    // data.jumlah = $scope.item.jumlah
                                    //data2[i].hargasatuan = $scope.item.hargaSatuan
                                    //data2[i].hargadiscount = $scope.item.hargadiskon
                                    //data2[i].total = $scope.item.total
                                    if (data2[i].nilaikonversi == 0)
                                        data2[i].nilaikonversi = 1
                                    if (data2[i].obatkronis == "1") {
                                        var qtyOK = 0;
                                        data2[i].jumlahreal = parseFloat(data2[i].jumlah);
                                        qtyOK = (parseFloat(data2[i].jumlah) * 7) / 30
                                        data2[i].jumlah = qtyOK;
                                        data2[i].jumlahobat = qtyOK;
                                        data2[i].jumlahcetak = parseFloat(data2[i].jumlahreal) - qtyOK;
                                        data2[i].total = (parseFloat(qtyOK) * (parseFloat(data2[i].hargasatuan) - parseFloat(data2[i].hargadiscount)) * parseFloat(data2[i].nilaikonversi)) + parseFloat(data2[i].jasa);
                                        dataOK.push(data2[i]);
                                    }
                                }
                                for (let x = 0; x < dataOK.length; x++) {
                                    const element = dataOK[x];
                                    element.no = x + 1;
                                }
                                for (let j = 0; j < data2.length; j++) {
                                    const element = data2[j];
                                    if (element.iskronis == true) {
                                        element.obtkronis = "✔"
                                    } else {
                                        element.obtkronis = ""
                                    }
                                }
                                // $scope.dataGrid.add($scope.dataSelected)
                                $scope.dataGrid = new kendo.data.DataSource({
                                    data: data2
                                });
                                // $scope.dataGrid = dat.data.orderpelayanan

                                var subTotal = 0;
                                for (var i = data2.length - 1; i >= 0; i--) {
                                    subTotal = subTotal + parseFloat(data2[i].total)
                                }
                                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                            });
                        }
                    } else {
                        $scope.disabledRuangan = false;
                    }
                });

            }

            function LoadSkrining() {
                console.log(norecResep)
                medifirstService.get("farmasi/get-histori-skrining?norecResep=" + norecResep, true).then(function (data_ih) {
                    var datas = data_ih.data[0]
                    norecSkrining = datas.norec;
                    $scope.data.Penulis = datas.rpenulis;
                    $scope.data.Tanggal = datas.rtanggalresep;
                    $scope.data.klinis = datas.rklinis;
                    $scope.data.DataRM = datas.rmr;
                    $scope.data.Pasien = datas.rpasien;
                    $scope.data.DataLahir = datas.rtanggallahir;
                    $scope.data.Berat = datas.rberatbedan;
                    $scope.data.DataDokter = datas.rdokter;
                    $scope.data.DataRuang = datas.rruang;
                    $scope.data.DataStatus = datas.rstatusjamin;
                    $scope.data.Obat = datas.robat;
                    $scope.data.DataKekuatan = datas.rkekuatan;
                    $scope.data.DataJumlah = datas.rjumlahobat;
                    $scope.data.keteranganskrining = datas.ketskrining;
                    $scope.data.Penulis1 = datas.rpenulis
                    $scope.data.Penulis2 = datas.ridentitasdokter
                    $scope.data.Penulis3 = datas.rtanggalresep
                    $scope.data.Penulis4 = datas.rcarabayar
                    $scope.data.Penulis5 = datas.rruanganresep
                    $scope.data.Tanggal1 = datas.rnamaobat
                    $scope.data.Tanggal2 = datas.robat
                    $scope.data.Tanggal3 = datas.rstabilitas
                    $scope.data.Tanggal4 = datas.raturan
                    $scope.data.klinis1 = datas.rmr
                    $scope.data.klinis2 = datas.rberatbedan
                    $scope.data.klinis3 = datas.ralergi
                    $scope.data.klinis4 = datas.rinteraksi
                    $scope.data.klinis5 = datas.rvariasi
                    $scope.data.klinis6= datas.rbeban
                    $scope.data.klinis7 = datas.rdokter
                    $scope.data.datapasienrm = datas.rpasien
                    $scope.data.DataRuang = datas.rruang
                    $scope.data.DataStatus = datas.rstatusjamin
                    $scope.data.DataJumlah = datas.rjumlahobat
                    $scope.data.DataWaktu = datas.rdatawaktu
                    
                    if (datas.prinsipbesar != '' || datas.prinsipbesar != null) {
                        var prinsipbesar = datas.prinsipbesar.split(',')
                        prinsipbesar.forEach(function (data) {
                            $scope.listPrinsipBesar.forEach(function (e) {
                                for (let i in e.detail) {
                                    if (e.detail[i].id == data) {
                                        e.detail[i].isChecked = true
                                        var dataid = {
                                            "id": e.detail[i].id, "nama": e.detail[i].nama,
                                            "value": e.detail[i].id,
                                        }
                                        $scope.currentPrinsipBesar.push(dataid)
                                    }
                                }
                            })
                        })
                    }

                });
            }

            $scope.getSatuan = function () {   
/*
if(!pass || !cpass || !email || !cemail || !user){
Which will check for empty strings (""), null, undefined, false and the numbers 0 and NaN.
*/
                if(!$scope.item.produk){ //sama dengan $scope.item.produk === null
                    return
                }
                if(($scope.item.namaProduks == $scope.item.produk.namaproduk) && ($scope.item.namaRuangans == $scope.item.ruangan.namaruangan)){
                    return
                }   
                dataProdukDetail = []
                /* info stok all ruangan */
                medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        //dikasih nilai namaProduks & namaRuangans hanya ketika data yg dipilih ada data info stoknya/valid
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        $scope.item.namaRuangans = $scope.item.ruangan.namaruangan;
                        for (var i = 0; i < e.data.infostok.length; i++) {
                            e.data.infostok[i].no = i + 1
                        }
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        })
                    })
                /* end info stok all ruangan */

                GETKONVERSI()
            }
            // $scope.$watch('item.produk', function(newValue, oldValue){
            //     if (newValue != oldValue) {
            //         getSatuan()
            //     }
            // })
            function getSatuan() {
                /*
                if(!pass || !cpass || !email || !cemail || !user){
                Which will check for empty strings (""), null, undefined, false and the numbers 0 and NaN.
                */
                    $scope.item.jumlah = 0
                if (!$scope.item.produk) { //sama dengan $scope.item.produk === null
                    return
                }
                if (($scope.item.namaProduks == $scope.item.produk.namaproduk) && ($scope.item.namaRuangans == $scope.item.ruangan.namaruangan)) {
                    return
                }
                dataProdukDetail = []

                /* info stok all ruangan */
                medifirstService.get("farmasi/get-info-stok?produkfk=" + $scope.item.produk.id, true)
                    .then(function (e) {
                        //dikasih nilai namaProduks & namaRuangans hanya ketika data yg dipilih ada data info stoknya/valid
                        $scope.item.namaProduks = $scope.item.produk.namaproduk;
                        $scope.item.namaRuangans = $scope.item.ruangan.namaruangan;
                        for (var i = 0; i < e.data.infostok.length; i++) {
                            e.data.infostok[i].no = i + 1
                        }
                        $scope.dataGridStok = new kendo.data.DataSource({
                            data: e.data.infostok,
                            pageable: true,
                            pageSize: 5,
                            total: e.data.infostok.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        })
                    })
                /* end info stok all ruangan */

                GETKONVERSI()
            }
            function GETKONVERSI() {
                $scope.isRouteLoading = true
                if ($scope.item.produk == undefined) {
                    return
                }
                if ($scope.item.produk == "") {
                    return
                }
                $scope.listSatuan = $scope.item.produk.konversisatuan
                if ($scope.listSatuan.length == 0) {
                    $scope.listSatuan = ([{ ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }])
                }
                $scope.item.satuan = { ssid: $scope.item.produk.ssid, satuanstandar: $scope.item.produk.satuanstandar }
                $scope.item.nilaiKonversi = 1// $scope.item.satuan.nilaikonversi
                if ($scope.item.ruangan == undefined) {
                    //alert("Pilih Ruangan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     //alert("Pilih asal terlebih dahulu!!")
                //     return;
                // }


                $scope.item.diskonTotalPersen = 0
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = 0;
                $scope.item.dosis = 1
                $scope.item.jumlahxmakan = 1
                statusTambah = false
                $scope.HargaMaster = -1;
                dataProdukDetail = []
                medifirstService.get("farmasi/get-produkdetail?" +
                    "produkfk=" + $scope.item.produk.id +
                    "&ruanganfk=" + $scope.item.ruangan.id +
                    "&kpid=" + $scope.item.kpid, true).then(function (dat) {

                        dataProdukDetail = dat.data.detail;
                        $scope.item.stok = dat.data.jmlstok / $scope.item.nilaiKonversi
                        if (dat.data.kekuatan == undefined || dat.data.kekuatan == 0 || dat.data.kekuatan == "") {
                            dat.data.kekuatan = 1
                        }
                        $scope.item.kekuatan = parseFloat(dat.data.kekuatan)
                        $scope.item.sediaan = dat.data.sediaan
                        $scope.consis = dat.data.consis;
                        if (dataProdukDetail.length > 0){
                            $scope.HargaMaster = dataProdukDetail[0].hargajual;
                            $scope.kdapotikonline = dataProdukDetail[0].kdapotikonline;
                            $scope.isfornas = dataProdukDetail[0].isfornas;
                            $scope.tglkadaluarsa = moment(dataProdukDetail[0].tglkadaluarsa).format('YYYY-MM-DD HH:mm');
                        }
                        //parseFloat($scope.dataSelected.jumlah) / parseFloat($scope.dataSelected.nilaikonversi)
                        
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        // $scope.item.jumlahxmakan =1
                        if ($scope.dataSelected != undefined) {
                            // $scope.item.jumlah = 0
                            $scope.item.jumlah = parseFloat($scope.dataSelected.jumlahobat)
                            $scope.item.jumlahbulat = Math.ceil($scope.dataSelected.jumlah);
                            $scope.item.dosis = parseFloat($scope.dataSelected.dosis)
                            $scope.item.jumlahxmakan = ((parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan))
                            $scope.item.nilaiKonversi = $scope.dataSelected.nilaikonversi

                            //$scope.item.satuan = { ssid: $scope.dataSelected.satuanviewfk, satuanstandar: $scope.dataSelected.satuanview }
                            $scope.HargaMaster = $scope.dataSelected.hargasatuan
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.hargaNetto = $scope.dataSelected.harganetto
                            $scope.item.total = $scope.dataSelected.total
                            // return
                        }
                        statusTambah = true
                        $scope.tambahobt = true
                        $scope.isRouteLoading = false

                });

            }
            $scope.getNilaiKonversi = function () {
                $scope.item.nilaiKonversi = $scope.item.satuan.nilaikonversi
            }
            $scope.$watch('item.nilaiKonversi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        $scope.item.stok = parseFloat($scope.item.stok) * (parseFloat(oldValue) / parseFloat(newValue))
                        $scope.item.jumlah = 0//parseFloat($scope.item.jumlah) / parseFloat(newValue)
                        $scope.item.jumlahbulat = 0;
                        $scope.item.hargaSatuan = 0//hrg1 * parseFloat(newValue)
                        $scope.item.hargadiskon = 0//hrgsdk * parseFloat(newValue)
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0// parseFloat(newValue) *
                        // (hrg1-hrgsdk)
                        // $scope.item.jumlahxmakan =1
                        // $scope.item.dosis =1
                    }
                }
            });
            $scope.$watch('item.rke', function (newValue, oldValue) {
                if (newValue != oldValue) {                  
                    if (tarifJasa == 0) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                                break;
                            }
                        }
                    }
                }
            });
            // $scope.$watch('item.tglAwal', function(newValue, oldValue) {
            //     statusPosting == true
            //     if (newValue != oldValue  ) {
            //         statusPosting == true
            //         var tgltgl = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
            //         medifirstService.getDataTableTransaksi("akutansi/get-sudah-posting?tgl="+
            //             tgltgl, true).then(function(dat){
            //                 statusPosting = dat.data.status
            //                 if (statusPosting == true) {
            //                     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
            //                 }
            //             }
            //         )
            //     }
            //     $scope.tombolSimpanVis = true
            // });
            $scope.$watch('item.jumlahxmakan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        if ($scope.item.jenisKemasan.id == 2) {
                            $scope.item.jumlah = $scope.item.jumlah
                        } else {
                            $scope.item.jumlah = ((parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan))
                        }
                        // $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                        $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                    }
                }
            });
            $scope.$watch('item.dosis', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.stok > 0) {
                        // $scope.item.jumlah = parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)
                        $scope.item.jumlah = (parseFloat($scope.item.jumlahxmakan) * parseFloat($scope.item.dosis)) / parseFloat($scope.item.kekuatan)
                        $scope.item.jumlahbulat = $scope.item.jumlah//Math.ceil($scope.item.jumlah);
                    }
                }
            });
            $scope.$watch('item.jenisKemasan.jeniskemasan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue == 'Racikan') {
                        $scope.showRacikanDose = true
                    } else {
                        $scope.showRacikanDose = false
                    }
                    // if (newValue == 'Racikan') {
                    //    $scope.showInputObat =false
                    //    $scope.showRacikan = true
                    // }else{

                    //    $scope.showInputObat =true
                    //    $scope.showRacikan = false
                    // }
                }
            });

            $scope.$watch('item.hargadiskon', function (newValue, oldValue) {
                // debugger
                if (newValue != oldValue) {
                    hrgsdk = $scope.item.hargadiskon
                    $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                }
            })

            $scope.$watch('item.jumlah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.jenisKemasan == undefined) {
                        toastr.error('jenis kemasan harap di isi terlebih dahulu')
                        return
                    }
                    // if (racikan == 'Racikan') {
                    //     hrg1 = parseFloat($scope.item.totalSubTotalR)
                    //     hrgsdk = parseFloat($scope.item.totalDiskonR)
                    //     $scope.item.hargaSatuan =hrg1
                    //     $scope.item.hargadiskon =hrgsdk
                    //     $scope.item.total = parseFloat($scope.item.jumlah) * (hrg1-hrgsdk)
                    //     noTerima = null
                    // }else{
                    if ($scope.item.stok == 0) {
                        $scope.item.jumlah = 0
                        //alert('Stok kosong')

                        return;
                    }
                    var qty20 = 0
                    tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                    if (parseFloat(tarifJasa) != 0) {
                        if ($scope.item.jenisKemasan.id == 2) {
                            tarifJasa = parseFloat($scope.item.tarifadminresep)//800
                        }
                        if ($scope.item.jenisKemasan.id == 1) {
                            qty20 = Math.floor(parseFloat($scope.item.jumlah) / 20)
                            if (parseFloat($scope.item.jumlah) % 20 == 0) {
                                qty20 = qty20
                            } else {
                                qty20 = qty20 + 1
                            }

                            if (qty20 != 0) {
                                tarifJasa = tarifJasa * qty20
                            }

                        }
                    }
                    if ($scope.item.no == undefined) {
                        for (var i = data2.length - 1; i >= 0; i--) {
                            if (data2[i].rke == $scope.item.rke) {
                                tarifJasa = 0
                            }
                        }
                    }
                    // tarifJasa =
                    // if ($scope.dataSelected != undefined) {
                    //     $scope.item.jumlah = $scope.dataSelected.jumlah
                    //     $scope.item.jumlahbulat = $scope.dataSelected.jumlah                        
                    // }else{
                    $scope.item.jumlahbulat = Math.ceil($scope.item.jumlah);
                    // }

                    var ada = false;
                    console.log(dataProdukDetail);
                    console.log($scope.item.jumlah);
                    for (var i = 0; i < dataProdukDetail.length; i++) {
                        ada = false
                        if (parseFloat($scope.item.jumlah * parseFloat($scope.item.nilaiKonversi)) <= parseFloat(dataProdukDetail[i].qtyproduk)) {
                            $scope.HargaMaster = parseFloat(dataProdukDetail[i].hargajual)
                            hrg1 = Math.round(parseFloat(dataProdukDetail[i].hargajual) * parseFloat($scope.item.nilaiKonversi))
                            hrgsdk = parseFloat(dataProdukDetail[i].hargadiscount) * parseFloat($scope.item.nilaiKonversi)
                            $scope.item.hargaSatuan = hrg1
                            $scope.item.hargaNetto = Math.round(parseFloat(dataProdukDetail[i].harganetto) * parseFloat($scope.item.nilaiKonversi))
                            if ($scope.item.hargadiskon == 0) {
                                $scope.item.hargadiskon = hrgsdk
                            } else {
                                hrgsdk = $scope.item.hargadiskon
                            }
                            $scope.item.total = (parseFloat($scope.item.jumlahbulat) * (hrg1 - hrgsdk)) + parseFloat(tarifJasa)
                            noTerima = dataProdukDetail[i].norec
                            $scope.item.asal = { id: dataProdukDetail[i].objectasalprodukfk, asalproduk: dataProdukDetail[i].asalproduk }
                            ada = true;
                            break;
                        }
                    }
                    if (ada == false) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargadiskon = 0
                        $scope.item.hargaNetto = 0
                        $scope.item.total = 0
                        noTerima = ''
                        if($scope.dataSelected != undefined){
                            $scope.HargaMaster = $scope.dataSelected.hargasatuan
                            $scope.item.hargaSatuan = $scope.dataSelected.hargasatuan
                            $scope.item.hargadiskon = $scope.dataSelected.hargadiscount
                            $scope.item.hargaNetto = $scope.dataSelected.harganetto
                            $scope.item.total = $scope.dataSelected.total
                            hrg1 = $scope.dataSelected.hargasatuan
                            noTerima = $scope.dataSelected.nostrukterimafk
                        }
                        if (dataProdukDetail.length > 1) {
                            var stt = 'false'
                            if (confirm('Struk Penerimaan berbeda, merge/satukan stok? ')) {
                                var objSave =
                                {
                                    produkfk: $scope.item.produk.id,
                                    ruanganfk: $scope.item.ruangan.id
                                }

                                $scope.tombolSimpanVis = false;
                                medifirstService.post('farmasi/save-stock-merger', objSave).then(function (e) {
                                    Kosongkan()
                                })
                            } else {
                                // Do nothing!
                                stt = 'false'
                            }

                        }
                    }
                    if ($scope.item.jumlah == 0) {
                        $scope.item.hargaSatuan = 0
                        $scope.item.hargaNetto = 0
                    }
                    // }
                    // if ($scope.item.stok > 0) {
                    //     $scope.item.stok =parseFloat($scope.item.stok) * (parseFloat(oldValue)/ parseFloat(newValue))
                    // }
                }
            });

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.tambah = function () {
                if (statusTambah == false) {
                    return
                }
                if ($scope.item.penulisResep == undefined || $scope.item.penulisResep.id == null) {
                    alert("Penulis Resep Belum Diisi!!")
                    return;
                }
                if ($scope.item.ruangan == undefined) {
                    alert("Ruangan Belum Diisi!!")
                    return;
                }
                if ($scope.item.jumlah == 0) {
                    alert("Jumlah harus di isi!")
                    return;
                }
                //if ($scope.item.hargaSatuan == 0 && ($scope.item.stok == 0 || $scope.item.stok =="" || $scope.item.stok == undefined )) {
                if ($scope.item.hargaSatuan == 0 && $scope.HargaMaster != 0) {
                    alert("Harga Satuan tidak memiliki harga!")
                    return;
                }
                //if ($scope.item.total == 0 && $scope.item.hargaSatuan == 0 && parseFloat($scope.item.diskonTotalPersen) == 0 && ($scope.item.stok == 0 || $scope.item.stok =="" || $scope.item.stok == undefined )) {
                if ($scope.item.total == 0 && $scope.HargaMaster != 0  && $scope.item.hargaSatuan == 0 && parseFloat($scope.item.diskonTotalPersen) == 0) {
                    alert("Stok tidak ada harus di isi!")
                    return;
                }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                if (noTerima == '') {
                    $scope.item.jumlah = 0
                    alert("Jumlah blm di isi!!")
                    return;
                }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.aturanPakai == undefined) {
                    alert("Aturan Pakai Belum Diisi!!")
                    return;
                }

                var KetPakai = "";
                if ($scope.item.KeteranganPakai) {
                    KetPakai = $scope.item.KeteranganPakai;
                }

                var jRacikan = null
                if ($scope.item.jenisRacikan != undefined) {
                    jRacikan = $scope.item.jenisRacikan.id
                }
                var satuannya = null
                if ($scope.item.satuannya != undefined) {
                    satuannya = $scope.item.satuannya
                }
                var dosis = 1;
                if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                    dosis = $scope.item.dosis
                    $scope.item.jumlahxmakan = (parseFloat($scope.item.jumlah) / parseFloat($scope.item.dosis)) * parseFloat($scope.item.kekuatan)
                } else {
                    if ($scope.dataSelected != undefined) {
                        dosis = $scope.dataSelected.dosis
                    }
                    $scope.item.jumlahxmakan = $scope.item.jumlah
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }

                var qtyOK = 0;
                var qtyCetak = 0;
                var total = 0;
                var jumlahreal = 0;

                let jmlbulat = 0;
                let jml = 0 ;

                jmlbulat = $scope.item.jumlahbulat;
                jml = $scope.item.jumlah;
                if ($scope.checkisKronis == 'matiin kondisi ini/true') {
                    var datas = {};
                    $scope.showGridKronis = true


                    jumlahreal = parseFloat($scope.item.jumlah);
                    qtyOK = (parseFloat($scope.item.jumlah) * 23) / 30
                    jml = parseFloat($scope.item.jumlah) - qtyOK;
                    jmlbulat = jml;
                    qtyCetak = jumlahreal - jml;



                    // jumlahreal = parseFloat($scope.item.jumlah);
                    // qtyOK = (parseFloat($scope.item.jumlah) * 23) / 30
                    // $scope.item.jumlah = qtyOK;
                    // $scope.item.jumlahbulat = qtyOK;
                    // qtyCetak = jumlahreal - qtyOK;
                    total = (parseFloat(qtyOK) * (parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.hargadiskon)) * parseFloat($scope.item.nilaiKonversi)) + parseFloat(tarifJasa);
                    if ($scope.item.no != undefined) {
                        for (var i = dataOK.length - 1; i >= 0; i--) {
                            if (dataOK[i].no == $scope.item.no) {
                                datas.no = $scope.item.no
                                datas.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                                datas.tglregistrasi = moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')
                                datas.generik = null
                                datas.hargajual = String($scope.item.hargaSatuan)
                                datas.jenisobatfk = jRacikan
                                datas.kelasfk = $scope.item.kelas.id
                                datas.stock = String($scope.item.stok)
                                datas.harganetto = String($scope.item.hargaNetto)
                                datas.nostrukterimafk = noTerima
                                datas.ruanganfk = $scope.item.ruangan.id

                                datas.rke = $scope.item.rke
                                datas.jeniskemasanfk = $scope.item.jenisKemasan.id
                                datas.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                                // data.aturanpakaifk = $scope.item.aturanPakai.id
                                // data.aturanpakai = $scope.item.aturanPakai.name
                                datas.aturanpakai = $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
                                datas.ispagi = $scope.item.chkp
                                datas.issiang = $scope.item.chks
                                datas.issore = $scope.item.chksr
                                datas.ismalam = $scope.item.chkm
                                datas.iskronis = $scope.checkisKronis,
                                // data.aturanpakai2 = $scope.item.aturanPakai2
                                // data.sbsmid = $scope.item.sbsm.id
                                // data.sbsmname = $scope.item.sbsm.name
                                datas.routefk = null//$scope.item.route.id
                                datas.route = null//$scope.item.route.name
                                datas.asalprodukfk = $scope.item.asal.id
                                datas.asalproduk = $scope.item.asal.asalproduk
                                datas.produkfk = $scope.item.produk.id
                                datas.namaproduk = $scope.item.produk.namaproduk
                                datas.nilaikonversi = $scope.item.nilaiKonversi
                                datas.satuanstandarfk = $scope.item.satuan.ssid
                                datas.satuanstandar = $scope.item.satuan.satuanstandar
                                datas.satuanviewfk = $scope.item.satuan.ssid
                                datas.satuanview = $scope.item.satuan.satuanstandar
                                datas.jmlstok = String($scope.item.stok)
                                datas.jumlah = qtyOK
                                datas.jumlahobat = qtyOK
                                datas.jumlahcetak = qtyOK
                                datas.dosis = dosis
                                datas.hargasatuan = String($scope.item.hargaSatuan)
                                datas.hargadiscount = String($scope.item.hargadiskon)
                                datas.total = total
                                datas.jmldosis = String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan)
                                datas.jasa = tarifJasa
                                datas.keterangan = KetPakai
                                datas.satuandosis = satuannya

                                dataOK[i] = datas;
                            }
                        }
                    } else {
                        datas = {
                            no: nomor,
                            noregistrasifk: norec_apd,//$scope.item.noRegistrasi,
                            tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                            generik: null,
                            hargajual: String($scope.item.hargaSatuan),
                            jenisobatfk: jRacikan,
                            kelasfk: $scope.item.kelas.id,
                            stock: String($scope.item.stok),
                            harganetto: String($scope.item.hargaNetto),
                            nostrukterimafk: noTerima,
                            ruanganfk: $scope.item.ruangan.id,//£££
                            rke: $scope.item.rke,
                            jeniskemasanfk: $scope.item.jenisKemasan.id,
                            jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                            // aturanpakaifk:$scope.item.aturanPakai.id,
                            // aturanpakai:$scope.item.aturanPakai.name,
                            aturanpakai: $scope.item.aturanPakai,//+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                            ispagi: $scope.item.chkp,
                            issiang: $scope.item.chks,
                            issore: $scope.item.chksr,
                            ismalam: $scope.item.chkm,
                            iskronis: $scope.checkisKronis,
                            // aturanpakai2: $scope.item.aturanPakai2 ,
                            // sbsmid: $scope.item.sbsm.id,
                            // sbsmname: $scope.item.sbsm.name,
                            routefk: null,//,$scope.item.route.id,
                            route: null,//$scope.item.route.name,
                            asalprodukfk: $scope.item.asal.id,
                            asalproduk: $scope.item.asal.asalproduk,
                            produkfk: $scope.item.produk.id,
                            namaproduk: $scope.item.produk.namaproduk,
                            nilaikonversi: $scope.item.nilaiKonversi,
                            satuanstandarfk: $scope.item.satuan.ssid,
                            satuanstandar: $scope.item.satuan.satuanstandar,
                            satuanviewfk: $scope.item.satuan.ssid,
                            satuanview: $scope.item.satuan.satuanstandar,
                            jmlstok: String($scope.item.stok),
                            jumlah: qtyOK,
                            jumlahobat: qtyOK,
                            jumlahcetak: qtyOK,
                            dosis: dosis,
                            hargasatuan: String($scope.item.hargaSatuan),
                            hargadiscount: String($scope.item.hargadiskon),
                            total: total,
                            jmldosis: String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan),
                            jasa: tarifJasa,
                            keterangan: KetPakai,
                            satuandosis: satuannya
                        }
                        dataOK.push(datas)
                    }

                    $scope.dataGridKronis = new kendo.data.DataSource({
                        data: dataOK
                    });
                }

                $scope.disabledRuangan = true;
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.noregistrasifk = norec_apd//$scope.item.noRegistrasi
                            data.tglregistrasi = moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss')
                            data.generik = null
                            data.hargajual = String($scope.item.hargaSatuan)
                            data.jenisobatfk = jRacikan
                            data.kelasfk = $scope.item.kelas.id
                            data.stock = String($scope.item.stok)
                            data.harganetto = String($scope.item.hargaNetto)
                            data.nostrukterimafk = noTerima
                            data.ruanganfk = $scope.item.ruangan.id

                            data.rke = $scope.item.rke
                            data.jeniskemasanfk = $scope.item.jenisKemasan.id
                            data.jeniskemasan = $scope.item.jenisKemasan.jeniskemasan
                            // data.aturanpakaifk = $scope.item.aturanPakai.id
                            // data.aturanpakai = $scope.item.aturanPakai.name
                            data.aturanpakai = $scope.item.aturanPakai //+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name
                            data.ispagi = $scope.item.chkp
                            data.issiang = $scope.item.chks
                            data.issore = $scope.item.chksr
                            data.ismalam = $scope.item.chkm
                            data.iskronis = $scope.checkisKronis,
                                // data.aturanpakai2 = $scope.item.aturanPakai2
                                // data.sbsmid = $scope.item.sbsm.id
                                // data.sbsmname = $scope.item.sbsm.name
                                data.routefk = $scope.item.route != undefined ? $scope.item.route.id : null
                            data.route = $scope.item.route != undefined ? $scope.item.route.name : null
                            data.asalprodukfk = $scope.item.asal.id
                            data.asalproduk = $scope.item.asal.asalproduk
                            data.produkfk = $scope.item.produk.id
                            data.namaproduk = $scope.item.produk.namaproduk
                            data.nilaikonversi = $scope.item.nilaiKonversi
                            data.satuanstandarfk = $scope.item.satuan.ssid
                            data.satuanstandar = $scope.item.satuan.satuanstandar
                            data.satuanviewfk = $scope.item.satuan.ssid
                            data.satuanview = $scope.item.satuan.satuanstandar
                            data.jmlstok = String($scope.item.stok)
                            data.jumlah = jmlbulat//$scope.item.jumlahbulat
                            data.jumlahobat = jml//$scope.item.jumlah
                            data.dosis = dosis
                            data.hargasatuan = String($scope.item.hargaSatuan)
                            data.hargadiscount = String($scope.item.hargadiskon)
                            data.persendiscount = $scope.item.diskonTotalPersen
                            data.total = $scope.item.total
                            data.jmldosis = String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan)
                            data.jasa = tarifJasa
                            data.keterangan = KetPakai
                            data.satuanresepfk = $scope.item.satuanresep != undefined ? $scope.item.satuanresep.id : null
                            data.satuanresep = $scope.item.satuanresep != undefined ? $scope.item.satuanresep.satuanresep : null
                            data.tglkadaluarsa = $scope.tglkadaluarsa != undefined ? $scope.tglkadaluarsa : null
                            data.kdapotikonline = $scope.kdapotikonline
                            data.isfornas = $scope.isfornas
                            data.catatandokter = $scope.item.catatanDokter != undefined ? $scope.item.catatanDokter : null
                            data.satuandosis = satuannya
                            if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan') {
                                data.jumlahracikan = $scope.item.jumlahxmakan
                            }
                            data2[i] = data;
                            for (let i = 0; i < data2.length; i++) {
                                const element = data2[i];
                                if (element.iskronis == true) {
                                    element.obtkronis = "✔"
                                } else {
                                    element.obtkronis = ""
                                }

                            }
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                            }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                        }
                        // break;
                    }

                } else {
                    data = {
                        no: nomor,
                        noregistrasifk: norec_apd,//$scope.item.noRegistrasi,
                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                        generik: null,
                        hargajual: String($scope.item.hargaSatuan),
                        jenisobatfk: jRacikan,
                        kelasfk: $scope.item.kelas.id,
                        stock: String($scope.item.stok),
                        harganetto: String($scope.item.hargaNetto),
                        nostrukterimafk: noTerima,
                        ruanganfk: $scope.item.ruangan.id,//£££
                        rke: $scope.item.rke,
                        jeniskemasanfk: $scope.item.jenisKemasan.id,
                        jeniskemasan: $scope.item.jenisKemasan.jeniskemasan,
                        // aturanpakaifk:$scope.item.aturanPakai.id,
                        // aturanpakai:$scope.item.aturanPakai.name,
                        aturanpakai: $scope.item.aturanPakai,//+ ' x sehari ' + $scope.item.aturanPakai2 + ' ' + $scope.item.satuan.satuanstandar + ' ' + $scope.item.sbsm.name,
                        ispagi: $scope.item.chkp,
                        issiang: $scope.item.chks,
                        issore: $scope.item.chksr,
                        ismalam: $scope.item.chkm,
                        iskronis: $scope.checkisKronis,
                        // aturanpakai2: $scope.item.aturanPakai2 ,
                        // sbsmid: $scope.item.sbsm.id,
                        // sbsmname: $scope.item.sbsm.name,
                        routefk: $scope.item.route != undefined ? $scope.item.route.id : null,
                        route: $scope.item.route != undefined ? $scope.item.route.name : null,
                        asalprodukfk: $scope.item.asal.id,
                        asalproduk: $scope.item.asal.asalproduk,
                        produkfk: $scope.item.produk.id,
                        namaproduk: $scope.item.produk.namaproduk,
                        nilaikonversi: $scope.item.nilaiKonversi,
                        satuanstandarfk: $scope.item.satuan.ssid,
                        satuanstandar: $scope.item.satuan.satuanstandar,
                        satuanviewfk: $scope.item.satuan.ssid,
                        satuanview: $scope.item.satuan.satuanstandar,
                        jmlstok: String($scope.item.stok),
                        jumlah: jmlbulat,//$scope.item.jumlahbulat,
                        jumlahobat: jml,//$scope.item.jumlah,
                        dosis: dosis,
                        hargasatuan: String($scope.item.hargaSatuan),
                        hargadiscount: String($scope.item.hargadiskon),
                        persendiscount: $scope.item.diskonTotalPersen,
                        total: $scope.item.total,
                        jmldosis: String($scope.item.jumlahxmakan) + '/' + String(dosis) + '/' + String($scope.item.kekuatan),
                        jasa: tarifJasa,
                        keterangan: KetPakai,
                        satuanresepfk: $scope.item.satuanresep != undefined ? $scope.item.satuanresep.id : null,
                        satuanresep: $scope.item.satuanresep != undefined ? $scope.item.satuanresep.satuanresep : null,
                        tglkadaluarsa: $scope.tglkadaluarsa != undefined ? $scope.tglkadaluarsa : null,
                        kdapotikonline: $scope.kdapotikonline,
                        isfornas: $scope.isfornas,
                        catatandokter: $scope.item.catatanDokter != undefined ? $scope.item.catatanDokter : null,
                        jumlahracikan: $scope.item.jenisKemasan.jeniskemasan == 'Racikan' ? $scope.item.jumlahxmakan : null
                        ,satuandosis: satuannya
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    for (let i = 0; i < data2.length; i++) {
                        const element = data2[i];
                        if (element.iskronis == true) {
                            element.obtkronis = "✔"
                        } else {
                            element.obtkronis = ""
                        }

                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data2
                    });
                    var subTotal = 0;
                    for (var i = data2.length - 1; i >= 0; i--) {
                        subTotal = subTotal + parseFloat(data2[i].total)
                    }
                    $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                }
                if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                    $scope.item.rke = parseFloat($scope.item.rke) + 1
                    $scope.clearAturanPakai();

                }
                if ($scope.consis == 1) {
                    $scope.statusConsis = true;
                }
                // 26  0   t       jasa produksi non steril
                // 27  0   t       jasa pelayanan TPN
                // 28  0   t       jasa pelayanan handling cytotoxic
                // 29  0   t       jasa pelayanan IV Admixture
                // 30  0   t       jasa pelayanan Repacking obat injeksi
                // strStatus= $scope.item.produk.id

                Kosongkan()
                racikan = ''
                // statusTambah = false
            }
            $scope.clearAturanPakai = function(){
                $scope.currentAturanPakai = [];
                $scope.item.aturanPakai = "";
                $scope.item.chkp = 0;                    
                $scope.item.chks = 0;
                $scope.item.chksr = 0;
                $scope.item.chkm = 0;
                $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "P", 'isChecked': false },
                            { "id": 2, "nama": "S", 'isChecked': false },
                            { "id": 3, "nama": "Sr", 'isChecked': false },
                            { "id": 4, "nama": "M", 'isChecked': false }
                        ]
                    }
                ];
            }

            $scope.TambahObat = function () {
                // $scope.tambahobt = true
                $scope.tambah();
            }
            
            $scope.klikGrid = function (dataSelected) {
                dataProdukDetail = []
                if (statusTambah == false)
                    return
                var dataProduk = [];
                // $scope.item.jumlah = 0
                //no:no,
                $scope.item.no = dataSelected.no
                $scope.item.rke = dataSelected.rke
                medifirstService.get("farmasi/get-jenis-obat?jrid=" + dataSelected.jenisobatfk, true).then(function (JR) {
                    $scope.item.jenisRacikan = { id: JR.data.data[0].id, jenisracikan: JR.data.data[0].jenisracikan }
                });
                $scope.item.jenisKemasan = { id: dataSelected.jeniskemasanfk, jeniskemasan: dataSelected.jeniskemasan }
                $scope.item.satuanresep = { id: dataSelected.satuanresepfk, satuanresep: dataSelected.satuanresep }
                $scope.item.aturanPakai = dataSelected.aturanpakai
                if (noOrder != 'EditResep'){
                    $scope.item.catatanDokter = dataSelected.catatandokter
                }
                $scope.item.satuannya = dataSelected.satuandosis
                $scope.item.KeteranganPakai = dataSelected.keterangan
                $scope.item.diskonTotalPersen = dataSelected.persendiscount
                $scope.currentAturanPakai = []
                $scope.item.chkp = 0
                $scope.item.chks = 0
                $scope.item.chksr = 0
                $scope.item.chkm = 0
                let sp = false
                if (dataSelected.ispagi != "0") {
                    sp = true
                    $scope.item.chkp = 1
                }
                let ss = false
                if (dataSelected.issiang != "0") {
                    ss = true
                    $scope.item.chks = 1
                }
                let sr = false
                if (dataSelected.issore != "0") {
                    sr = true
                    $scope.item.chksr = 1
                }
                let sm = false
                if (dataSelected.ismalam != "0") {
                    sm = true
                    $scope.item.chkm = 1
                }
                // let sp = dataSelected.ispagi
                // let ss = dataSelected.issiang
                // let sm = dataSelected.ismalam
                let kr = false
                if (dataSelected.iskronis == true) {
                    kr = true
                    $scope.checkisKronis = true
                } else {
                    $scope.checkisKronis = false
                }
                $scope.listDataSigna = [
                    {
                        "id": 1,
                        "nama": "Aturan Pakai",
                        "detail": [
                            { "id": 1, "nama": "P", 'isChecked': sp },
                            { "id": 2, "nama": "S", 'isChecked': ss },
                            { "id": 3, "nama": "Sr", 'isChecked': sr },
                            { "id": 4, "nama": "M", 'isChecked': sm }
                        ]
                    }
                ];
                // let jml = 0
                // if (sp == true) {
                //     jml = jml+1
                // }
                // if (ss == true) {
                //     jml = jml+1
                // }
                // if (sm == true) {
                //     jml = jml+1
                // }
                // $scope.item.aturanPakai = jml + 'x1'
                // $scope.item.aturanPakai2 = dataSelected.aturanpakai2
                // $scope.item.sbsm = {id:dataSelected.sbsmid,name:dataSelected.sbsmname}
                // $scope.item.route = {id:dataSelected.routefk,name:dataSelected.route}
                if (dataSelected.asalprodukfk != 0) {
                    $scope.item.asal = { id: dataSelected.asalprodukfk, asalproduk: dataSelected.asalproduk }
                }
                for (var i = $scope.listProduk.length - 1; i >= 0; i--) {
                    if ($scope.listProduk[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listProduk[i]
                        break;
                    }
                }
                $scope.item.produk = dataProduk//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi
                $scope.getSatuan()
                // $scope.item.jumlah = dataSelected.jumlah
                // $scope.item.jumlahbulat = dataSelected.jumlah //$scope.item.jumlah//Math.ceil($scope.item.jumlah);
                tarifJasa = dataSelected.jasa
                // if ($scope.item.jenisKemasan.jeniskemasan == 'Racikan'){
                //     $scope.item.jumlahxmakan = dataSelected.jumlahxmakan
                //     $scope.item.dosis = dataSelected.dosis
                // }
                // $scope.item.dosis = dataSelected.dosis
                GETKONVERSI()
                // $scope.item.nilaiKonversi = dataSelected.nilaikonversi
                // $scope.item.satuan = {ssid:dataSelected.satuanviewfk,satuanstandar:dataSelected.satuanview}

                // $scope.item.jumlah = dataSelected.jumlah
                // $scope.item.hargaSatuan = dataSelected.hargasatuan
                // $scope.item.hargadiskon = dataSelected.hargadiscount
                // $scope.item.total = dataSelected.total
            }

            function Kosongkan() {
                $scope.item.produk = ''
                $scope.HargaMaster = -1;
                $scope.item.asal = ''
                $scope.item.satuan = ''
                $scope.item.nilaiKonversi = 0
                $scope.item.stok = 0
                $scope.item.jumlah = 0
                $scope.item.jumlahbulat = $scope.item.jumlah//Math.ceil($scope.item.jumlah);
                // $scope.item.dosis=1
                $scope.item.jumlahxmakan = 1
                $scope.item.hargadiskon = 0
                $scope.item.no = undefined
                $scope.item.total = 0
                $scope.item.hargaSatuan = 0
                $scope.item.hargaNetto = 0
                $scope.item.satuanresep = undefined;
                // $scope.item.aturanPakai=undefined;
                $scope.dataSelected = undefined
                $scope.item.KeteranganPakai = undefined
                $scope.tglkadaluarsa = undefined;
                $scope.item.diskonTotalPersen = 0
                $scope.item.satuannya = undefined
                $scope.item.dosis = undefined
                // $scope.listDataSigna = [
                //     {
                //         "id": 1,
                //         "nama": "Aturan Pakai",
                //         "detail": [
                //             { "id": 1, "nama": "P" ,'isChecked':false},
                //             { "id": 2, "nama": "S" ,'isChecked':false},
                //             { "id": 3, "nama": "Sr" ,'isChecked':false},
                //             { "id": 4, "nama": "M" ,'isChecked':false}
                //         ]
                //     }
                // ];
                $scope.dataSelected = undefined
                $scope.checkisKronis = false
                // $("#combobox").kendoComboBox();
                // var combobox = $("#combobox").data("kendoComboBox");
                // combobox.focus();          
            }

            $scope.batal = function () {
                var chacePeriode = {
                    0: $scope.item.ruangan,
                    1: '',//$scope.item.aturanPakai,
                    2: $scope.item.jenisKemasan,
                    3: $scope.item.route,
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: ''
                }
                cacheHelper.set('cacheanuaing', chacePeriode);
                Kosongkan()
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "40px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "70px",
                },
                {
                    "field": "jmldosis",
                    "title": "Jml/Dss/kkuatan",
                    "width": "90px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "jumlahracikan",
                    "title": "Jml Racikan",
                    "width": "100px",
                },
                {
                    "field": "dosis",
                    "title": "Dosis",
                    "width": "70px",
                },
                {
                    "field": "satuandosis",
                    "title": " ",
                    "width": "40px",
                },
                {
                    "field": "aturanpakai",
                    "title": "Aturan Pakai",
                    "width": "100px",
                },
                {
                    "field": "satuanresep",
                    "title": "Satuan Resep",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan Pakai",
                    "width": "120px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty ,",
                    "width": "50px",
                },
                // {
                //     "field": "jumlahobat",
                //     "title": "Qty o",
                //     "width": "50px",
                // },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "obtkronis",
                    "title": "Obt Kronis",
                    "width": "100px"
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "Tgl Exp",
                    "width": "100px"
                }
            ];
            // $scope.columnGridR = [
            // {
            //     "field": "no",
            //     "title": "No",
            //     "width" : "30px",
            // },
            // {
            //     "field": "rke",
            //     "title": "R/ke",
            //     "width" : "40px",
            // },
            // {
            //     "field": "jeniskemasan",
            //     "title": "Kemasan",
            //     "width" : "70px",
            // },
            // {
            //     "field": "asalproduk",
            //     "title": "Asal Produk",
            //     "width" : "100px",
            // },
            // {
            //     "field": "namaproduk",
            //     "title": "Deskripsi",
            //     "width" : "200px",
            // },
            // {
            //     "field": "satuanstandar",
            //     "title": "Satuan",
            //     "width" : "80px",
            // },
            // {
            //     "field": "jumlah",
            //     "title": "Qty",
            //     "width" : "70px",
            // },
            // {
            //     "field": "hargasatuan",
            //     "title": "Harga Satuan",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            // },
            // {
            //     "field": "hargadiscount",
            //     "title": "Harga Discount",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            // },
            // {
            //     "field": "total",
            //     "title": "Total",
            //     "width" : "100px",
            //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            // }
            // ];
            // $scope.mainGridOptions = {
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.kembali = function () {
                //$state.go("TransaksiPelayananApotik")
                window.history.back();
            }

            $scope.simpan = function () {
                // $scope.simpanSkrining()
                // return
                // $scope.savebtn = true
                $scope.tombolSimpanVis = false;
                medifirstService.get("farmasi/get-penjagaan-closing-kasir?noregistrasi=" + $scope.item.noRegistrasi ).then(function (e) {
                    
                    if (e.data.data2.length > 0) {
                        var cek2 = 2345;
                    } else{
                        var cek2 = 0;
                    }
                    if(e.data.detail[0].tglclosing == null){
                        var cek = 123;
                    } else{
                        var cek = 234;
                    }
                    
                    console.log(cek);
                    if (cek2 == 2345) {

                        messageContainer.error("Data yang sudah dibayar tidak bisa ditambah obat");
                    } else if(cek == 234){
                            
                        messageContainer.error("Data yang sudah diclosing tidak bisa ditambah obat");
                    } else if (cek == 123){
                        $scope.isRouteLoading = true;
                        $scope.tombolSimpanVis = false;
                        // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                        //     $scope.item.noRegistrasi, true).then(function(dat){
                        //     if (dat.data.status == true) {
                        //         alert('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                        //         return;
                        //     }
                        // });
                        // if ($scope.item.penulisResep == undefined) {
                        //     alert("Pilih Penulis Resep terlebih dahulu!!")
                        //     return
                        // }
                        var checkRP = 0;
                        if ($scope.checkResepPulang == true) {
                            checkRP = 1;
                        }
                        if (data2.length == 0) {
                            alert("Pilih Produk terlebih dahulu!!")
                            $scope.tombolSimpanVis = true;
                            return
                        }
                        if($scope.item.paketPelayanan == true){
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].hargasatuan = 0
                                data2[i].hargajual = 0
                                data2[i].total = 0

                            }
                        }
                        if($scope.item.brgHibah == true){
                            for (var i = data2.length - 1; i >= 0; i--) {
                                if(data2[i].asalprodukfk == 3){
                                    data2[i].hargasatuan = 0
                                    data2[i].hargajual = 0
                                    data2[i].total = 0
                                }
                            }
                        }
                        for (var i = data2.length - 1; i >= 0; i--) {
                            //if (data2[i].hargasatuan == 0 && parseFloat(data2[i].jmlstok)<=0 ) {
                            //if (data2[i].hargasatuan == 0 && $scope.HargaMaster != 0) {
                                if (data2[i].hargasatuan == 0 && parseFloat(data2[i].jmlstok)<=0) {
                                alert("Terdapat obat " + data2[i].namaproduk + " dengan harga kosong, kemungkinan stock kosong!!")
                                $scope.tombolSimpanVis = true;
                                $scope.isRouteLoading = false;
                                return
                            }

                        }
                        // for (var i = data2.length - 1; i >= 0; i--) {
                        //     if (parseFloat(data2[i].jmlstok) < parseFloat(data2[i].jumlah)) {
                        //         alert("Terdapat obat " + data2[i].namaproduk + " dengan jumlah melebihi STOK !! " + data2[i].namaproduk)
                        //         $scope.tombolSimpanVis = true;
                        //         $scope.isRouteLoading = false;
                        //         return
                        //     }

                        // }
                        var strukresep = {
                            tglresep: moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                            pasienfk: norec_apd,//
                            nocm: $scope.item.nocm,
                            namapasien: $scope.item.namaPasien,
                            penulisresepfk: $scope.item.penulisResep != undefined ? $scope.item.penulisResep.id : null, //req nenden
                            ruanganfk: $scope.item.ruangan.id,
                            jenisobatfk: $scope.item.route != undefined ? $scope.item.route.id : null,
                            noorder: noOrder,
                            status: strStatus,
                            norecResep: norecResep,
                            noresep: $scope.item.resep,
                            retur: '-',
                            isobatalkes: isPemakaianObatAlkes,
                            isreseppulang: checkRP != undefined ? checkRP : null,
                            ispaketpelayanan : $scope.item.paketPelayanan,
                            cito : $scope.item.cito
                        }
                        var objSave =
                        {
                            strukresep: strukresep,
                            pelayananpasien: data2//$scope.dataGrid._data
                        }

                        console.log(objSave)

                        console.log(data2)
                        $scope.tombolSimpanVis = false;
                        medifirstService.post('farmasi/save-pelayananobat', objSave).then(function (e) {
                            var resep = e.data.noresep.noresep.slice(-5)
                            // apotik online
                            if ($scope.item.kelompokpasien != undefined) {
                                if ($scope.item.jenisObat!=undefined){
                                    if ($scope.item.kelompokpasien.match(/BPJS.*/) && $scope.item.jenisObat.id == 2) {
                                        var apotikonline = {
                                            "TGLSJP": $scope.item.tanggalsep,
                                            "REFASALSJP": $scope.item.nosep,
                                            "POLIRSP": $scope.item.kodeapotikonline,
                                            "KDJNSOBAT": $scope.item.jenisObat.id,
                                            "NORESEP": e.data.noresep.noresep.slice(-5),
                                            "IDUSERSJP": $scope.item.nocm,
                                            "TGLRSP": moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                                            "TGLPELRSP": moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss'),
                                            "KdDokter": $scope.item.penulisResep.id,
                                            "iterasi": $scope.item.iterasi.id
                                        }

                                        var datas = {
                                            data: apotikonline
                                        }

                                        console.log(datas)

                                        medifirstService.post('bridging/bpjs/save-resep-apotik-online', datas).then(function (e) {
                                            var arrnonracikan = []
                                            var arrracikan = []
                                            var x = 0
                                            var no = ''
                                            var r1 = 0
                                            var r2 = 0
                                            for (var i = 0; i < data2.length; i++) {
                                                console.log(data2[i].isfornas)
                                                if (data2[i].isfornas == true) {
                                                    if (data2[i].jeniskemasanfk == 2) {
                                                        arrnonracikan[r1] = {
                                                            "NOSJP": $scope.item.nosep,
                                                            "NORESEP": resep,
                                                            "KDOBT": data2[i].kdapotikonline, //--
                                                            "NMOBAT": data2[i].namaproduk, //--
                                                            "SIGNA1OBT": data2[i].aturanpakai.substring(0, 1),
                                                            "SIGNA2OBT": data2[i].aturanpakai.slice(-1),
                                                            "JMLOBT": data2[i].jumlah,
                                                            "JHO": data2[i].jumlah / parseInt(data2[i].aturanpakai.substring(0, 1)), //--
                                                            "CatKhsObt": data2[i].keterangan,
                                                        }
                                                        r1++
                                                    } else {
                                                        x++
                                                        if (x < 10) {
                                                            no = '0' + x
                                                        } else {
                                                            no = '' + x
                                                        }
                                                        arrracikan[r2] = {
                                                            "NOSJP": $scope.item.nosep,
                                                            "NORESEP": resep,
                                                            "JNSROBT": "R." + no,
                                                            "KDOBT": data2[i].kdapotikonline, //--
                                                            "NMOBAT": data2[i].namaproduk, //--
                                                            "SIGNA1OBT": data2[i].aturanpakai.substring(0, 1),
                                                            "SIGNA2OBT": data2[i].aturanpakai.slice(-1),
                                                            "PERMINTAAN": data2[i].dosis,
                                                            "JMLOBT": data2[i].jumlah,
                                                            "JHO": 23, //--
                                                            "CatKhsObt": data2[i].keterangan,
                                                        }
                                                        r2++
                                                    }
                                                }
                                            }

                                            if (arrnonracikan != []) {
                                                var arr1 = {
                                                    data: arrnonracikan
                                                }

                                                medifirstService.post('bridging/bpjs/save-non-racikan-apotik-online', arr1).then(function (e) {});
                                            }

                                            if (arrracikan != []) {
                                                var arr2 = {
                                                    data: arrracikan
                                                }

                                                medifirstService.post('bridging/bpjs/save-racikan-apotik-online', arr2).then(function (e) {});
                                            }
                                        });
                                    }
                                }
                            // $scope.savebtn = false
                            }


                            // apotik online

                            $scope.data.noresep = e.data.noresep.norec
                            console.log($scope.data.noresep)
                            $scope.simpanSkrining()
                            $scope.tombolSimpanVis = true;
                            $scope.item.resep = e.data.noresep.norec;
                            if (dataOK.length > 0) {                        
                                var objSaveKronis = {
                                    strukresep: strukresep,
                                    norecresep: $scope.item.resep,
                                    pelayananpasienobatkronis: dataOK,
                                }
                                medifirstService.post('farmasi/save-pelayanan-obat-kronis', objSaveKronis).then(function (e) { });
                            }


                            // //Bridging Consis
                            // if ($scope.item.consisid != undefined) {
                            //     var objSave =
                            //         {
                            //             strukresep:$scope.item.resep,
                            //             counterid:$scope.item.consisid
                            //         }
                            //     medifirstService.postbridgingconsisd(objSave).then(function(e) {
                            //     })
                            // }
                            // //Bridging Consis
                            // //Bridging MiniR45
                            //     var objSave =
                            //         {
                            //             strukresep:$scope.item.resep
                            //         }

                            //     medifirstService.postbridgingminir45(objSave).then(function(e) {

                            //     })
                            // //Bridging minir45

                            //##save Logging user
                            medifirstService.get("sysadmin/logging/save-log-input-resep?norec_apd="
                                + norec_apd
                                + "&penulisresepfk="
                                + $scope.item.penulisResep.id
                                + "&ruanganfk="
                                + $scope.item.ruangan.id
                                + "&tglresep="
                                + moment($scope.item.tglAwal).format('YYYY-MM-DD hh:mm:ss')
                            ).then(function (data) {

                            })
                            //##end

                            // var stt = 'false'
                            // if (confirm('View resep? ')) {
                            //     // Save it!
                            //     stt='true';
                            // } else {
                            //     // Do nothing!
                            //     stt='false'
                            // }
                            // var client = new HttpClient();
                            // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep='+$scope.item.consisid+'&nores='+e.data.noresep.norec+'&view='+stt+'&user='+pegawaiUser.namalengkap, function(response) {
                            //     //aadc=response;
                            // });



                            // if (noOrder == 'EditResep') {
                            //     var objDelete = {norec:norecResep}
                            //     medifirstService.posthapuspelayananapotik(objDelete).then(function(e) {

                            //     })
                            // }
                            let params = $scope.item.noRegistrasi
                            if ($scope.item.noreservasi != undefined && $scope.item.noreservasi != '' && $scope.item.noreservasi != 'Kios-K') {
                                params = $scope.item.noreservasi
                            }
                            saveAntrol(params, 6, $scope.item.norec_pd) //waktu mulai farmasi
                            $scope.isRouteLoading = false;
                            $scope.tombolSimpanVis = true;
                            window.history.back();
                        }, function (error) {
                            $scope.isRouteLoading = false;
                            $scope.tombolSimpanVis = true;
                        })
                        var chacePeriode = {
                            0: $scope.item.ruangan,
                            1: '',//$scope.item.aturanPakai,
                            2: $scope.item.jenisKemasan,
                            3: $scope.item.route,
                            4: '',
                            5: '',
                            6: '',
                            7: '',
                            8: ''
                        }
                        cacheHelper.set('cacheanuaing', chacePeriode);

                        // $state.go("TransaksiPelayananApotik")
                    }
                });
                

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
            $scope.BatalR = function () {
                $scope.showInputObat = true
                $scope.showRacikan = false
                $scope.item.jenisKemasan = ''

                racikan = ''
            }
            $scope.hapus = function () {
                // if ($scope.item.jumlah == 0) {
                //     alert("Jumlah harus di isi!")
                //     return;
                // }
                // if ($scope.item.total == 0) {
                //     alert("Stok tidak ada harus di isi!")
                //     return;
                // }
                if ($scope.item.jenisKemasan == undefined) {
                    alert("Pilih Jenis Kemasan terlebih dahulu!!")
                    return;
                }
                // if ($scope.item.asal == undefined) {
                //     alert("Pilih Asal Produk terlebih dahulu!!")
                //     return;
                // }
                if ($scope.item.produk == undefined) {
                    alert("Pilih Produk terlebih dahulu!!")
                    return;
                }
                if ($scope.item.satuan == undefined) {
                    alert("Pilih Satuan terlebih dahulu!!")
                    return;
                }
                // var nomor =0
                // if ($scope.dataGrid == undefined) {
                //     nomor = 1
                // }else{
                //     nomor = data2.length+1
                // }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {

                            //data2[i] = data;
                            // delete data2[i]
                            data2.splice(i, 1);
                            dataOK.splice(i, 1);

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }
                            // data2.length = data2.length -1
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });
                            $scope.dataGridKronis = new kendo.data.DataSource({
                                data: dataOK
                            });
                            // for (var i = data2.length - 1; i >= 0; i--) {
                            //     subTotal=subTotal+ parseFloat(data2[i].total)
                            // }
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }
                        // break;
                    }

                }
                Kosongkan()
            }
            $scope.columnGridStok = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Stok",
                    "width": "50px",
                }

            ];

            $scope.simpanSkrining = function () {
                if ($scope.item.ruangan == undefined) {
                    alert("Ruangan tidak boleh kosong!")
                    return;
                }
                var listPrinsipBesar = ""
                var a = ""
                var b = ""
                for (var i = $scope.currentPrinsipBesar.length - 1; i >= 0; i--) {
                    var c = $scope.currentPrinsipBesar[i].id
                    b = "," + c
                    a = a + b
                }
                listPrinsipBesar = a.slice(1, a.length)
                var penulis = ""
                if ($scope.data.KetPenulis != undefined) {
                    var penulis = $scope.data.KetPenulis
                }
                var ketTanggal = ""
                if ($scope.data.KetTanggal != undefined) {
                    var ketTanggal = $scope.data.KetTanggal
                }
                var ketKlinis = ""
                if ($scope.data.KetKlinis != undefined) {
                    var ketKlinis = $scope.data.KetKlinis
                }
                var ketRM = ""
                if ($scope.data.KetRM != undefined) {
                    var ketRM = $scope.data.KetRM
                }
                var KetPasien = ""
                if ($scope.data.KetPasien != undefined) {
                    var KetPasien = $scope.data.KetPasien
                }
                var KetLahir = ""
                if ($scope.data.KetLahir != undefined) {
                    var KetLahir = $scope.data.KetLahir
                }
                var KetBerat = ""
                if ($scope.data.KetBerat != undefined) {
                    var KetBerat = $scope.data.KetBerat
                }
                var KetDokter = ""
                if ($scope.data.KetDokter != undefined) {
                    var KetDokter = $scope.data.KetDokter
                }
                var KetRuang = ""
                if ($scope.data.KetRuang != undefined) {
                    var KetRuang = $scope.data.KetRuang
                }
                var KetStatus = ""
                if ($scope.data.KetStatus != undefined) {
                    var KetStatus = $scope.data.KetStatus
                }
                var KetObat = ""
                if ($scope.data.KetObat != undefined) {
                    var KetObat = $scope.data.KetObat
                }
                var KetKekuatan = ""
                if ($scope.data.KetKekuatan != undefined) {
                    var KetKekuatan = $scope.data.KetKekuatan
                }
                var KetJumlah = ""
                if ($scope.data.KetJumlah != undefined) {
                    var KetJumlah = $scope.data.KetJumlah
                }
                var KetStabilitas = ""
                if ($scope.data.KetStabilitas != undefined) {
                    var KetStabilitas = $scope.data.KetStabilitas
                }
                var KetAturan = ""
                if ($scope.data.KetAturan != undefined) {
                    var KetAturan = $scope.data.KetAturan
                }
                var KetIndikasi = ""
                if ($scope.data.KetIndikasi != undefined) {
                    var KetIndikasi = $scope.data.KetIndikasi
                }
                var KetAlergi = ""
                if ($scope.data.KetAlergi != undefined) {
                    var KetAlergi = $scope.data.KetAlergi
                }
                var KetKonsumsi = ""
                if ($scope.data.KetKonsumsi != undefined) {
                    var KetKonsumsi = $scope.data.KetKonsumsi
                }
                var KetDuplikat = ""
                if ($scope.data.KetDuplikat != undefined) {
                    var KetDuplikat = $scope.data.KetDuplikat
                }
                var KetInteraksi = ""
                if ($scope.data.KetInteraksi != undefined) {
                    var KetInteraksi = $scope.data.KetInteraksi
                }
                var KetAntibiotik = ""
                if ($scope.data.KetAntibiotik != undefined) {
                    var KetAntibiotik = $scope.data.KetAntibiotik
                }
                var KetPoli = ""
                if ($scope.data.KetPoli != undefined) {
                    var KetPoli = $scope.data.KetPoli
                }
                var PenyekriningResep = ""
                if ($scope.data.PenyekriningResep != undefined) {
                    var PenyekriningResep = $scope.data.PenyekriningResep.id
                }
                var Peracik = ""
                if ($scope.data.Peracik != undefined) {
                    var Peracik = $scope.data.Peracik.id
                }
                var Pengecek = ""
                if ($scope.data.Pengecek != undefined) {
                    var Pengecek = $scope.data.Pengecek.id
                }
                var Penyerah = ""
                if ($scope.data.Penyerah != undefined) {
                    var Penyerah = $scope.data.Penyerah
                }
                var Penerima = ""
                if ($scope.data.Penerima != undefined) {
                    var Penerima = $scope.data.Penerima
                }
                var ketskrining = null
                if ($scope.data.keteranganskrining != undefined) {
                    ketskrining = $scope.data.keteranganskrining
                }

                var objSave = {
                    "norec": norecSkrining,
                    "norec_apd": $scope.data.noresep,
                    "objectruanganfk": $scope.item.ruangan.id,
                    "rpenulis": parseInt($scope.data.Penulis1),//udah
                    "ridentitasdokter": parseInt($scope.data.Penulis2),//udah
                    "rtanggalresep": parseInt($scope.data.Penulis3),//udah
                    "rcarabayar": parseInt($scope.data.Penulis4),//udah
                    "rruanganresep": parseInt($scope.data.Penulis5),//udah
                    "rnamaobat": parseInt($scope.data.Tanggal1),//udah
                    "robat": parseInt($scope.data.Tanggal2),//udah
                    "rstabilitas": parseInt($scope.data.Tanggal3),//udah
                    "raturan": parseInt($scope.data.Tanggal4),//udah
                    "rmr": parseInt($scope.data.klinis1),//udah
                    "rberatbedan": parseInt($scope.data.klinis2),//udah
                    "ralergi": parseInt($scope.data.klinis3),//udah
                    "rinteraksi": parseInt($scope.data.klinis4),//udah
                    "rvariasi": parseInt($scope.data.klinis5),//udah
                    "rbeban": parseInt($scope.data.klinis6),//udah
                    "rdokter": parseInt($scope.data.klinis7),//udah
                    "rpasien": parseInt($scope.data.datapasienrm),//udah
                    "rruang": parseInt($scope.data.DataRuang),
                    "rstatusjamin": parseInt($scope.data.DataStatus),
                    "rjumlahobat": parseInt($scope.data.DataJumlah),
                    "rdatawaktu": parseInt($scope.data.DataWaktu),
                    "ketskrining": ketskrining,
                }
                console.log(objSave);
                // return
                medifirstService.post('farmasi/save-data-skrining-farmasi', objSave).then(function (e) {
                    
                })
            }

            $scope.BatalSkring = function () {
                $scope.data = {}
                $scope.data.Penulis1 = 2;
                $scope.data.Penulis2 = 2;
                $scope.data.Penulis3 = 2;
                $scope.data.Penulis4 = 2;
                $scope.data.Penulis5 = 2;
                $scope.data.Tanggal1 = 2;
                $scope.data.Tanggal2 = 2;
                $scope.data.Tanggal3 = 2;
                $scope.data.Tanggal4 = 2;
                $scope.data.klinis1 = 2;
                $scope.data.klinis2 = 2;
                $scope.data.klinis3 = 2;
                $scope.data.klinis4 = 2;
                $scope.data.klinis5 = 2;
                $scope.data.klinis6 = 2;
                $scope.data.klinis7 = 2;
                $scope.data.datapasienrm = 2;
                $scope.data.DataRuang = 2;
                $scope.data.DataStatus = 2;
                $scope.data.DataJumlah = 2;
                $scope.data.DataWaktu = 2;
            }

            $scope.kembaliSKiring = function () {
                window.history.back();
            }
            $scope.showDiagnosa = function () {
                loadDiagnosa()

            }
            function loadDiagnosa(noreg) {
                medifirstService.get("sysadmin/general/get-diagnosa-pasien?noReg=" + $scope.item.noRegistrasi
                ).then(function (data) {
                    $scope.popUpDiagnosa.center().open()
                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.item.diagnosa = diagnosa
                    }
                });
            }

            $scope.columnGridSsS = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20%"
                },
                {
                    "field": "namapaket",
                    "title": "Nama Paket",
                    "width": "40%"
                }
            ]

            $scope.data2s = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "100px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "30px",
                        },
                        {
                            "field": "qty",
                            "title": "Qty",
                            "width": "30px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "70px"
                        },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "100px"
                        }
                    ]
                }
            };

            $scope.PaketObat = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Masih Kosong");
                    return;
                }

                dataPaket = []
                medifirstService.get("sysadmin/get-paket-obat?").then(function (data) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < data.data.data.length; i++) {
                        data.data.data[i].no = i + 1
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.popUpPaketObat.center().open();
                })
            }

            $scope.BatalPaket = function () {
                dataPaket = [];
                $scope.dataSource = new kendo.data.DataSource({
                    data: [],
                });
                $scope.popUpPaketObat.close();
            }

            $scope.klikGridSsS = function (dataSelectedSsS) {
                // bukan ini
                    return

                $scope.isRouteLoading = true;
                dataPaket = [];
                if (dataSelectedSsS != undefined) {
                    $scope.dataSelectedSsS = dataSelectedSsS
                    var KetPakai = "";
                    if ($scope.item.KeteranganPakai) {
                        KetPakai = $scope.item.KeteranganPakai;
                    }

                    var jRacikan = null
                    if ($scope.item.jenisRacikan != undefined) {
                        jRacikan = $scope.item.jenisRacikan.id
                    }
                    var dosis = 1;
                    var datas = 0;
                    for (let i = 0; i < $scope.dataSelectedSsS.details.length; i++) {
                        $scope.isRouteLoading = true;
                        const element = $scope.dataSelectedSsS.details[i];
                        if (element.produkfk != undefined) {
                            medifirstService.get("farmasi/get-produkdetail?" +
                                "produkfk=" + element.produkfk +
                                "&ruanganfk=" + $scope.item.ruangan.id +
                                "&kpid=" + $scope.item.kpid, true).then(function (dat) {
                                    dataProdukDetail = dat.data.detail[0];
                                    var nilaiKonversi = 1;
                                    datas = datas + 1;
                                    var stok = dat.data.jmlstok / nilaiKonversi
                                    var kekuatan = dat.data.kekuatan
                                    var sediaan = dat.data.sediaan
                                    if (parseFloat(stok) < parseFloat(element.qty)) {
                                        toastr.error("Stok untuk obat " + element.namaproduk + " kurang dari stok ruangan")
                                        return;
                                    }
                                    var nomor = 0
                                    if (data2 == undefined) {
                                        nomor = 1
                                    } else {
                                        nomor = data2.length + 1
                                    }
                                    let ispagi = 1
                                    if (element.ispagi == false) {
                                        ispagi = 0
                                    }
                                    let issiang = 1
                                    if (element.issiang == false) {
                                        issiang = 0
                                    }
                                    let issore = 1
                                    if (element.issore == false) {
                                        issore = 0
                                    }
                                    let ismalam = 1
                                    if (element.ismalam == false) {
                                        ismalam = 0
                                    }
                                    var data = {
                                        no: nomor,
                                        noregistrasifk: norec_apd,
                                        tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                                        generik: null,
                                        hargajual: String(dataProdukDetail.hargajual),
                                        jenisobatfk: jRacikan,
                                        kelasfk: $scope.item.kelas.id,
                                        stock: String(stok),
                                        harganetto: String(dataProdukDetail.hargajual),
                                        nostrukterimafk: dataProdukDetail.nostrukterimafk,
                                        ruanganfk: $scope.item.ruangan.id,
                                        rke: nomor,
                                        jeniskemasanfk: 2,
                                        jeniskemasan: "Non Racikan",
                                        aturanpakai: element.aturanpakai,
                                        ispagi: ispagi,
                                        issiang: issiang,
                                        issore: issore,
                                        ismalam: ismalam,
                                        iskronis: false,
                                        routefk: null,
                                        route: null,
                                        asalprodukfk: dataProdukDetail.objectasalprodukfk,
                                        asalproduk: dataProdukDetail.asalproduk,
                                        produkfk: element.produkfk,
                                        namaproduk: element.namaproduk,
                                        nilaikonversi: nilaiKonversi,
                                        satuanstandarfk: element.objectsatuanstandarfk,
                                        satuanstandar: element.satuanstandar,
                                        satuanviewfk: element.objectsatuanstandarfk,
                                        satuanview: element.satuanstandar,
                                        jmlstok: String(stok),
                                        jumlah: element.qty,
                                        jumlahobat: String(element.qty),
                                        dosis: 1,
                                        hargasatuan: String(dataProdukDetail.hargajual),
                                        hargadiscount: String(0),
                                        total: (parseFloat(element.qty) * parseFloat(dataProdukDetail.hargajual)),
                                        jmldosis: String(element.qty) + '/' + String(1) + '/' + String(kekuatan),
                                        jasa: 0,
                                        keterangan: element.keterangan,
                                        satuanresepfk: element.satuanresepfk != undefined ? element.satuanresepfk : null,
                                        satuanresep: element.satuanresep != undefined ? element.satuanresep : null,
                                    }
                                    dataPaket.push(data);
                                    data2.push(data)
                                    $scope.isRouteLoading = false;
                                    if (datas == $scope.dataSelectedSsS.details.length) {
                                        $scope.butPaket = true
                                    }
                                });
                        }
                    }
                }
            }

            $scope.tambahPaket = function () {
                $scope.butPaket = false;
                $scope.popUpPaketObat.close();
                if (dataPaket == undefined) {
                    toastr.error("data Belum Dipilih");
                    return;
                }
                // data2.push(dataPaket)
                // data2 = dataPaket
                for (let i = 0; i < data2.length; i++) {
                    const element = data2[i];
                    if (element.iskronis == true) {
                        element.obtkronis = "✔"
                    } else {
                        element.obtkronis = ""
                    }

                }
                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                });
                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat(data2[i].total)
                }
                $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                // if ($scope.item.jenisKemasan.jeniskemasan != 'Racikan') {
                //     $scope.item.rke = parseFloat($scope.item.rke) + 1
                // }
                // if ($scope.consis == 1) {
                //     $scope.statusConsis = true;
                // }
                // 26  0   t       jasa produksi non steril
                // 27  0   t       jasa pelayanan TPN
                // 28  0   t       jasa pelayanan handling cytotoxic
                // 29  0   t       jasa pelayanan IV Admixture
                // 30  0   t       jasa pelayanan Repacking obat injeksi
                // strStatus= $scope.item.produk.id

                Kosongkan()

                $scope.butPaket = false
                racikan = ''
                // statusTambah = false
            }

            $scope.Riwayat = function () {

                var nocm = "";
                if ($scope.item.nocm) {
                    nocm = $scope.item.nocm;
                }

                var noregistrasi = "";
                if ($scope.item.noregistrasi) {
                    noregistrasi = $scope.item.noregistrasi;
                }


                medifirstService.get("emr/get-transaksi-pelayanan?&noregistrasi=" + noregistrasi + "&nocm=" + nocm, true).then(function (dat) {
                    let group = [];
                    if (dat.statResponse == true) {
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            if (dat.data[i].reseppulang == '1') {
                                dat.data[i].cekreseppulang = '✔'
                            } else {
                                dat.data[i].cekreseppulang = '-'
                            }
                        }
                        var array = dat.data;
                        let sama = false

                        for (let i in array) {
                            array[i].count = 1
                            sama = false
                            for (let x in group) {
                                if (group[x].noresep == array[i].noresep) {
                                    sama = true;
                                    group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                }
                            }
                            if (sama == false) {
                                var dataDetail0 = [];
                                for (var f = 0; f < array.length; f++) {
                                    if (array[i].noresep == array[f].noresep) {
                                        dataDetail0.push(array[f]);
                                    };
                                }
                                let result = {
                                    noregistrasi: array[i].noregistrasi,
                                    tglpelayanan: array[i].tglpelayanan,
                                    tglorder: array[i].tglorder,
                                    noresep: array[i].noresep,
                                    count: array[i].count,
                                    aturanpakai: array[i].aturanpakai,
                                    namaruangandepo: array[i].namaruangandepo,
                                    namaruangan: array[i].namaruangan,
                                    dokter: array[i].dokter,
                                    cekreseppulang: array[i].cekreseppulang,
                                    details: dataDetail0
                                }
                                group.push(result)
                            }
                        }
                    }

                    $scope.dataGridRiwayat = group
                    console.log(group)
                    $scope.isRouteLoading = false;
                    $scope.popUpRiwayat.center().open();
                });
                if ($scope.item.ruangan == undefined) {
                    toastr.error("Ruangan Masih Kosong");
                    return;
                }
            }


            $scope.columnGridRiwayat = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                    "template": "<span class='style-center'>#: cekreseppulang #</span>"
                }
            ];
            $scope.data22 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",
                        },
                        {
                            "field": "keterangan",
                            "title": "Keterangan",
                            "width": "80px",
                        }

                    ]
                }
            };

            $scope.getNilaiPersenDiskon = function () {
                // debugger
                $scope.item.hargadiskon = 0;
                if ($scope.item.diskonTotalPersen > 0) {
                    var diskon = (parseFloat($scope.item.hargaSatuan) * parseFloat($scope.item.diskonTotalPersen)) / 100
                    $scope.item.hargadiskon = diskon;
                    $scope.item.total = parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.diskonTotal);
                }
            }

            $scope.getTotalDiskon = function () {
                // debugger
                $scope.item.diskonTotalPersen = 0;
                if ($scope.item.hargadiskon > 0) {
                    var diskon = (parseFloat($scope.item.hargadiskon) * 100) / parseFloat($scope.item.hargaSatuan)
                    $scope.item.diskonTotalPersen = diskon;
                    $scope.item.total = parseFloat($scope.item.hargaSatuan) - parseFloat($scope.item.diskonTotal);
                }
            }
            $scope.ceklisPaketPelayanan = function (bool, data) {
                $scope.item.paketPelayanan = bool
                if(bool == true){
                    $scope.showChkPaket = true
                    $scope.showChkHibah = false
                    $scope.showTotalSetelah = true
                    $scope.item.totalSetelah =  0
                 }else{
                    $scope.showTotalSetelah = false
                    $scope.showChkPaket = true
                    $scope.showChkHibah = true
                 }
            }
            $scope.ceklisBrgHibah = function (bool, data) {
                 $scope.item.brgHibah = bool
                 if(bool == true){        
                    $scope.showChkPaket = false
                    $scope.showChkHibah = true

                    $scope.showTotalSetelah = true
                    let totalSetelah = 0;
                    for (let index = 0; index < data2.length; index++) {
                       const element = data2[index];
                       if(data2[index].asalprodukfk != 3){
                           totalSetelah = totalSetelah +  data2[index].total
                       }
                    }
                    $scope.item.totalSetelah =  parseFloat(totalSetelah).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                 }else{
                    $scope.showTotalSetelah = false
                    $scope.showChkPaket = true
                    $scope.showChkHibah = true
                 }
            }
            //** BATAS */
        }
    ]);
});
