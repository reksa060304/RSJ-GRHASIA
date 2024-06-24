
define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InsidenInternalCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var idKeluhan = '';
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var noRegistrasifk = '';
            $scope.currentUmur = [];
            $scope.currentJenisInsiden = [];
            $scope.currentPelapor = [];
            $scope.currentInsiden = [];
            $scope.currentInsidenPesien = [];
            $scope.currentJiwa = [];
            $scope.currentAkibatInsiden = [];
            $scope.currentTindakanInsiden = [];
            $scope.currentKejadianSama = [];
            $scope.currentGrading = [];
            $scope.disabledText = false;

            var petugasInsidenInternal = '';
            var verifikatorInsidenInternal = ''

            LoadCombo();
            // LoadCache();                        

            function LoadCombo() {
                var nomor = 1;
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listDataRuangan = data;
                });
                // 
                medifirstService.get('sysadmin/general/get-combo-registrasi-general').then(function (data) {
                    var dataCombo = data.data;
                    $scope.listDataJenisKelamin = dataCombo.jeniskelamin;
                    $scope.listDataKelompokPasien = dataCombo.kelompokpasien;
                });

                medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                    $scope.listKeselamatanInput = e.data.insidenkeselamtanpasien;
                    $scope.listRegrading = e.data.regrading;

                    // petugas dan verifikator insiden
                    petugasInsidenInternal = e.data.petugasInsidenInternal
                    verifikatorInsidenInternal = e.data.verifikatorInsidenInternal

                    LoadCache();
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDataPegawai = data;                
                });
            }

            /**
             * 
             * @param {string} str
             * @returns {object} 
             */
            function konversiCheckBox(str){
                let hasil = {}
                
                str.split(',').forEach(function(data){
                    hasil[data] = true
                })

                return hasil
            }

            /**
             * 
             * @param {number} id
             * @param {Array} arr 
             * @returns {object} 
             */
            function konversiRadio(id, arr){
                let select = {}
                
                arr.forEach(function(data){
                    if(data['id'] == id){
                        select = data
                    }
                })

                return select
            }

            $scope.listUmur = [
                {
                    "id": 1,
                    "nama": "Umur*",
                    "detail": [
                        { "id": 1, "nama": "0 - 1 Bulan" },
                        { "id": 2, "nama": "> 1 bulan - 1 tahun" },
                        { "id": 3, "nama": "> 1 tahun - 5 tahun" },
                        { "id": 4, "nama": "> 5 tahun - 15 tahun" },
                        { "id": 5, "nama": "> 15 tahun - 30 tahun" },
                        { "id": 6, "nama": "> 30 tahun - 65 tahun" },
                        { "id": 7, "nama": "> 65 tahun" },
                    ]
                }
            ]

            $scope.listJenisInsiden = [
                {
                    "id": 2,
                    "nama": "Jenis Insiden*",
                    "detail": [
                        { "id": 1, "nama": "Kejadian Nyaris Cedera / KNC (Near miss)" },
                        { "id": 2, "nama": "Kejadian Tidak Cedera / KTC (No Harm)" },
                        { "id": 3, "nama": "Kejadian Tidak Diharapkan / KTD (Adverse Event)" },
                        { "id": 4, "nama": "KPC" },
                        { "id": 5, "nama": "Kejadian Sentinel (Sentinel Event)*" }
                    ]
                }
            ]

            $scope.listPelapor = [
                {
                    "id": 3,
                    "nama": "Orang Pertama Yang Melaporkan Insiden*",
                    "detail": [
                        { "id": 1, "nama": "Karyawan : Dokter / Perawat / Petugas Lainnya" },
                        { "id": 2, "nama": "Keluarga / Pendamping Pasien" },
                        { "id": 3, "nama": "Pasien" },
                        { "id": 4, "nama": "Pengunjung" },
                        { "id": 5, "nama": "Lain-lain" },
                    ]
                }
            ]

            $scope.listInsidenPasien = [
                {
                    "id": 5,
                    "nama": "Insiden Menyangkut Pasien",
                    "detail": [
                        { "id": 1, "nama": "Pasien Rawat Inap" },
                        { "id": 2, "nama": "Pasien Rawat Jalan" },
                        { "id": 3, "nama": "Pasien IGD" },
                        { "id": 4, "nama": " Lain-lain" },
                    ]
                }
            ]

            $scope.listJiwa = [
                {
                    "id": 6,
                    "nama": "Insiden terjadi pada pasien : ( jiwa dan sub spesialisasnya)",
                    "detail": [
                        { "id": 1, "nama": "Anak Remaja" },
                        { "id": 2, "nama": "Napza" },
                        { "id": 3, "nama": "Dewasa" },
                        { "id": 4, "nama": "Lansia" },
                        { "id": 5, "nama": "GMO" },
                        { "id": 6, "nama": "ELektromedik" },
                        { "id": 7, "nama": "  Lain-lain" },
                    ]
                }
            ]

            $scope.listAkibatInsiden = [
                {
                    "id": 7,
                    "nama": "Akibat Insiden Terhadap Pasien*",
                    "detail": [
                        { "id": 1, "nama": "Kematian" },
                        { "id": 2, "nama": "Cedera Irreversibe / Cedera Berat" },
                        { "id": 3, "nama": "Cedera Reversibel / Cedera Sedang" },
                        { "id": 4, "nama": "Cedera Ringan" },
                        { "id": 5, "nama": "Tidak Ada Cedera" },
                    ]
                }
            ]

            $scope.listKejadianSama = [
                {
                    "id": 8,
                    "nama": "Apakah Kejadian yang sama pernah terjadi di Unit Kerja Lain?*",
                    "detail": [
                        { "id": 1, "nama": "Ya" },
                        { "id": 2, "nama": "Tidak" },
                    ]
                }
            ]

            $scope.listTindakan = [
                {
                    "id": 9,
                    "nama": "Tindakan dilakukan oleh*",
                    "detail": [
                        { "id": 1, "nama": "Tim : Terdiri" },
                        { "id": 2, "nama": "Dokter" },
                        { "id": 3, "nama": "Petugas Lainnya" },
                        { "id": 4, "nama": "Perawat" },
                    ]
                }
            ]

            $scope.listGrading = [
                {
                    "id": 10,
                    "nama": "Grading Risiko Kejadian*(Diisi oleh atasan pelapor)",
                    "detail": [
                        { "id": 1, "nama": "BIRU" },
                        { "id": 2, "nama": "HIJAU" },
                        { "id": 3, "nama": "KUNING" },
                        { "id": 4, "nama": "MERAH" },
                    ]
                }
            ]

            function LoadCache() {
                var chacePeriode = cacheHelper.get('InsidenInternalCtrl');
                if (chacePeriode != undefined) {
                    kpid = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                // LoadCombo();D
                if (noOrder != '') {
                    if (noOrder == 'EditInsiden') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            norec = kpid                            
                            var datas = dat.data.data[0];

                            // data pasien
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.TglLahir = moment(datas.tgllahir).format('YYYY-MM-DD HH:mm');
                            $scope.item.JenisKelamin = { id: datas.jeniskelaminfk, jeniskelaminfk: datas.jeniskelaminfk, jeniskelamin: datas.jeniskelamin };
                            $scope.item.Ruangan = { value: datas.ruanganfk, id: datas.ruanganfk, text: datas.namaruangan }
                            $scope.item.TglMasuk = moment(datas.tglmasuk).format('YYYY-MM-DD HH:mm');
                            $scope.item.KelompokPasien = { id: datas.penanggungbiayapasienfk, penanggungbiayapasienfk: datas.penanggungbiayapasienfk, kelompokpasien: datas.kelompokpasien };
                            $scope.item.selectedUmur = konversiCheckBox(datas.umur)

                            // detail
                            $scope.item.TglInsiden = moment(datas.tglinsiden).format('YYYY-MM-DD HH:mm');
                            $scope.item.KeselamatanInput = { id: datas.insidenkeselamatanfk, keselamatan: datas.keselamatan };
                            $scope.item.Insiden = datas.insiden;
                            $scope.item.selectedJenisInsiden = konversiCheckBox(datas.jenisinsiden)
                            $scope.item.selectedPelapor = konversiCheckBox(datas.pelaporinsiden)
                            $scope.item.lokasiInsiden = datas.tempatinsiden;
                            $scope.item.selectedMenyangkut = konversiCheckBox(datas.insidenpenyangkut)
                            $scope.item.selectedJiwa = konversiCheckBox(datas.jiwa)
                            $scope.item.UnitKerja = datas.unitterkait;
                            $scope.item.selectedAkibatInsiden = konversiCheckBox(datas.akibatinsiden)
                            $scope.item.Tindakan = datas.penanganan;
                            $scope.item.selectedKejadianSama = konversiRadio(datas.kejadiansama, $scope.listKejadianSama[0].detail)
                            $scope.item.selectedTindakanOleh = konversiCheckBox(datas.dilakukanoleh)
                            $scope.item.Penanggulangan = datas.langkahpenanganan;

                            $scope.item.PembuatLaporan = { id: datas.PembuatLaporanfk, namalengkap: datas.PembuatLaporan };
                            $scope.item.TglLaporan = moment(datas.tgllapor).format('YYYY-MM-DD HH:mm');
                            $scope.item.PenerimaLaporan = { id: datas.penerimalaporanfk, namalengkap: datas.penerimalaporan };
                            $scope.item.TglTerimaLaporan = moment(datas.tglterima).format('YYYY-MM-DD HH:mm');
                            $scope.item.selectedGrading = konversiRadio(datas.grading, $scope.listGrading[0].detail)

                            $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: datas.jeniskesalamatanfk, jeniskeselamatan: datas.jeniskeselamatan };
                            $scope.item.KronologiInsiden = datas.kronologisinsiden;

                        }); //
                    } else if (noOrder == 'InputInsidenInternal') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-pasien-registrasi?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            var pegawaiLogin = medifirstService.getPegawaiLogin();
                            // console.log(pegawaiLogin)
                            $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                            noRegistrasifk = kpid;
                            $scope.item.TglInsiden = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglTerimaLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            $scope.item.TglLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                            var datas = dat.data.data[0];
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.TglLahir = new Date(datas.tgllahir);
                            $scope.item.JenisKelamin = { id: datas.objectjeniskelaminfk, jeniskelamin: datas.jeniskelamin }
                            $scope.item.Ruangan = { value: datas.id, text: datas.namaruangan, namaruangan:datas.namaruangan }
                            $scope.item.TglMasuk = new Date(datas.tglregistrasi)
                            $scope.item.KelompokPasien = { id: datas.objectkelompokpasienlastfk, kelompokpasien: datas.kelompokpasien }
                        });
                    } else if (noOrder == 'LihatInsiden') {
                        $scope.disabledText = true;
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            norec = kpid
                            var datas = dat.data.data[0];
                            
                            // data pasien
                            $scope.item.NamaPasien = datas.namapasien;
                            $scope.item.NoRM = datas.nocm;
                            $scope.item.TglLahir = moment(datas.tgllahir).format('YYYY-MM-DD HH:mm');
                            $scope.item.JenisKelamin = { id: datas.jeniskelaminfk, jeniskelaminfk: datas.jeniskelaminfk, jeniskelamin: datas.jeniskelamin };
                            $scope.item.Ruangan = { value: datas.ruanganfk, id: datas.ruanganfk, text: datas.namaruangan }
                            $scope.item.TglMasuk = moment(datas.tglmasuk).format('YYYY-MM-DD HH:mm');
                            $scope.item.KelompokPasien = { id: datas.penanggungbiayapasienfk, penanggungbiayapasienfk: datas.penanggungbiayapasienfk, kelompokpasien: datas.kelompokpasien };
                            $scope.item.selectedUmur = konversiCheckBox(datas.umur)

                            // detail
                            $scope.item.TglInsiden = moment(datas.tglinsiden).format('YYYY-MM-DD HH:mm');
                            $scope.item.KeselamatanInput = { id: datas.insidenkeselamatanfk, keselamatan: datas.keselamatan };
                            $scope.item.Insiden = datas.insiden;
                            $scope.item.selectedJenisInsiden = konversiCheckBox(datas.jenisinsiden)
                            $scope.item.selectedPelapor = konversiCheckBox(datas.pelaporinsiden)
                            $scope.item.lokasiInsiden = datas.tempatinsiden;
                            $scope.item.selectedMenyangkut = konversiCheckBox(datas.insidenpenyangkut)
                            $scope.item.selectedJiwa = konversiCheckBox(datas.jiwa)
                            $scope.item.UnitKerja = datas.unitterkait;
                            $scope.item.selectedAkibatInsiden = konversiCheckBox(datas.akibatinsiden)
                            $scope.item.Tindakan = datas.penanganan;
                            $scope.item.selectedKejadianSama = konversiRadio(datas.kejadiansama, $scope.listKejadianSama[0].detail)
                            $scope.item.selectedTindakanOleh = konversiCheckBox(datas.dilakukanoleh)
                            $scope.item.Penanggulangan = datas.langkahpenanganan;

                            // akhiran
                            $scope.item.PembuatLaporan = { id: datas.PembuatLaporanfk, namalengkap: datas.PembuatLaporan };
                            $scope.item.TglLaporan = moment(datas.tgllapor).format('YYYY-MM-DD HH:mm');
                            $scope.item.PenerimaLaporan = { id: datas.penerimalaporanfk, namalengkap: datas.penerimalaporan };
                            $scope.item.TglTerimaLaporan = moment(datas.tglterima).format('YYYY-MM-DD HH:mm');
                            $scope.item.selectedGrading = konversiRadio(datas.grading, $scope.listGrading[0].detail)

                            $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: datas.jeniskesalamatanfk, jeniskeselamatan: datas.jeniskeselamatan };
                            $scope.item.KronologiInsiden = datas.kronologisinsiden;
                        }); //
                    }
                } else {
                    var pegawaiLogin = medifirstService.getPegawaiLogin();
                    $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                }
            }

            $scope.CariPasien = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-data-detail-pasien-general?nocm=" + $scope.item.NoRM, true).then(function (data_ih) {
                    $scope.isRouteLoading = false;
                    var datas = data_ih.data;
                    var tanggal = $scope.now;
                    var tanggalLahir = new Date(datas.tgllahir);
                    var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                    var usia = umurzz.year;
                    $scope.item.NoRM = datas.nocm;
                    $scope.item.NamaPasien = datas.namapasien;
                    $scope.item.JenisKelamin = { id: datas.jkid, jenisKelamin: datas.jeniskelamin };
                    $scope.item.TglLahir = new Date(datas.tgllahir);

                })
            }

            $scope.getJenisKelamatan = function () {
                $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: $scope.item.KeselamatanInput.jeniskesalamatanfk, jeniskeselamatan: $scope.item.KeselamatanInput.jeniskeselamatan };
            }

            $scope.Save = function () {
                // if(noOrder == 'InputInsidenInternal'){
                //     // hanya petugas yang bisa input
                //     if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                //         toastr.error('Anda Bukan Petugas Insiden Internal')
                //         return
                //     }
                // }

                // if(noOrder == 'EditInsiden'){
                //     // hanya petugas dan verifikator yang bisa edit
                //     if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false || verifikatorInsidenInternal.includes($scope.pegawai.id.toString() == false) ){
                //         toastr.error('Anda Bukan Petugas Insiden Internal')
                //         return
                //     }
        
                // }

                
                if ($scope.item.KeselamatanInput == undefined) {
                    toastr.error('Peringatan, Insiden Keselamatan Belum Dipilih');
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan!')
                    .textContent('Apakah anda yakin akan menyimpan data ini?')
                    .ariaLabel('Lucky day')
                    .ok('Ya')
                    .cancel('Tidak')

                $mdDialog.show(confirm).then(function () {
                    $scope.Simpan();
                })
            };


            $scope.reset = function () {
                kosong();
                window.history.back();
            }

            function Kosong() {
                $scope.item = {};
            }

            $scope.Simpan = function () {
                

                var listRawRequired = [
                    // data pasien
                    "item.NamaPasien|ng-model|Nama Pasien",
                    "item.NoRM|ng-model|No Rekam Medis",
                    "item.TglLahir|k-ng-model|Tanggal Lahir",
                    "item.JenisKelamin|k-ng-model|Jenis Kelamin",
                    "item.Ruangan|k-ng-model|Ruangan",
                    "item.TglMasuk|k-ng-model|Tanggal Masuk",
                    "item.KelompokPasien|k-ng-model|Penanggung Biaya",
                    "item.selectedUmur|ng-model|Umur",

                    // detail
                    "item.TglInsiden|k-ng-model|Tanggal Insiden",
                    "item.Insiden|ng-model|Kronologis Insiden",
                    "item.selectedJenisInsiden|ng-model|Jenis Insiden",
                    "item.selectedPelapor|ng-model|Pelapor Insiden",
                    "item.lokasiInsiden|ng-model|Lokasi Insiden",
                    "item.selectedMenyangkut|ng-model|Insiden Menyangkut Pasien",
                    "item.selectedJiwa|ng-model|Insiden Terjadi Pada Pasien",
                    "item.UnitKerja|ng-model|Unit Kerja",
                    "item.selectedAkibatInsiden|ng-model|Akibat Insiden",
                    "item.selectedKejadianSama|ng-model|Kejadian Sama",
                    "item.selectedTindakanOleh|ng-model|Tindakan Dilakukan Oleh",

                    // Akhiran
                    "item.selectedGrading|ng-model|Grading",
                ]

                var isValid = medifirstService.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var dataSave = {
                        // data pasien
                        "norec": norec != undefined ? norec : '',
                        "namapasien": $scope.item.NamaPasien,
                        "nocm": $scope.item.NoRM,
                        "tglahir": moment($scope.item.TglLahir).format('YYYY-MM-DD HH:mm'),
                        "jeniskelaminfk": $scope.item.JenisKelamin.id,
                        "ruanganfk": $scope.item.Ruangan.value,
                        "tglmasuk": moment($scope.item.TglMasuk).format('YYYY-MM-DD HH:mm'),
                        "penanggungbiayapasienfk": $scope.item.KelompokPasien.id,
                        "umur": checkBoxToString($scope.item.selectedUmur),
                        
                        // data detail
                        "tglinsiden": $scope.item.TglInsiden != undefined ? moment($scope.item.TglInsiden).format('YYYY-MM-DD HH:mm') : null,
                        "insidenkeselamatanfk": $scope.item.KeselamatanInput.id,
                        "insiden": $scope.item.Insiden != undefined ? $scope.item.Insiden : '',
                        "jenisinsiden": checkBoxToString($scope.item.selectedJenisInsiden),
                        "pelaporinsiden": checkBoxToString($scope.item.selectedPelapor),
                        "tempatinsiden": $scope.item.lokasiInsiden != undefined ? $scope.item.lokasiInsiden : '',
                        "insidenpenyangkut": checkBoxToString($scope.item.selectedMenyangkut),
                        "jiwa": checkBoxToString($scope.item.selectedJiwa),
                        "insidenterjadi": checkBoxToString($scope.item.selectedJiwa),
                        "unitterkait": $scope.item.UnitKerja != undefined ? $scope.item.UnitKerja : '',
                        "akibatinsiden": checkBoxToString($scope.item.selectedAkibatInsiden),
                        "penanganan": $scope.item.Tindakan != undefined ? $scope.item.Tindakan : '',
                        "kejadiansama": $scope.item.selectedKejadianSama.id,
                        "dilakukanoleh": checkBoxToString($scope.item.selectedTindakanOleh),
                        "langkahpenanganan": $scope.item.Penanggulangan != undefined ? $scope.item.Penanggulangan : '',
                        "kronologisinsiden": $scope.item.KronologiInsiden != undefined ? $scope.item.KronologiInsiden : '',
                        
                        // akhiran
                        "pembuatlaporan": $scope.item.PembuatLaporan != undefined ? $scope.item.PembuatLaporan.namalengkap : '',
                        "pembuatlaporanfk": $scope.item.PembuatLaporan ? $scope.item.PembuatLaporan.id : null,
                        "tgllapor": $scope.item.TglLaporan != undefined ? moment($scope.item.TglLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "penerimalaporan": $scope.item.PenerimaLaporan != undefined ? $scope.item.PenerimaLaporan.namalengkap : '',
                        "penerimalaporanfk": $scope.item.PenerimaLaporan ? $scope.item.PenerimaLaporan.id : null,
                        "tglterima": $scope.item.TglTerimaLaporan != undefined ? moment($scope.item.TglTerimaLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "grading": $scope.item.selectedGrading.id,
                        "noregistrasifk": noRegistrasifk != undefined ? noRegistrasifk : null,
                    }
                    var objSave = {
                        data: dataSave,
                    }
                    console.log(objSave)

                    $scope.isRouteLoading = true;
                    medifirstService.post('pmkp/save-data-insiden-internal', objSave).then(function (e) {
                        $scope.isRouteLoading = false;
                        
                        Kosong();
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }

            /**
             * 
             * @param {Object} obj 
             * @returns {string}
             */
            function checkBoxToString(obj){
                let hasil = Object.keys(obj).filter(function(key){
                    if(obj[key] === true){
                      return obj[key]
                    }
                })

                return hasil.toString()
            }

            function selectedInsiden(idInsiden){
                let hasil = null

                $scope.listKeselamatanInput.forEach(function(item){
                    if(item.id == idInsiden){
                        hasil = item
                    }
                })

                return hasil
            }

            //** BATAS SUCI */
        }
    ]);
});