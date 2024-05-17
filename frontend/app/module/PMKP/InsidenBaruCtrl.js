define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InsidenBaruCtrl', ['$rootScope', '$scope', 'ModelItem', '$mdDialog', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $mdDialog, $state, dateHelper, cacheHelper, medifirstService) {
            let date = new Date()
            let max = new Date(new Date().setMonth(new Date().getMonth() + 1))
            $scope.minDate = date
            $scope.maxDate = max
            
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.pegawai = ModelItem.getPegawai();
            var kpid = '';
            var noOrder = '';
            var norec = '';
            var noRegistrasifk = '';

            // Petugas
            // var petugasInsidenInternal = '';
            // var verifikatorInsidenInternal = ''            
            
            $scope.disabledText = false;

            // Selected checkbox
            $scope.selectedUmur = null
            $scope.selectedJenisInsiden = null
            $scope.selectedPelapor = null
            $scope.selectedJenisPasien = null
            $scope.selectedKategoriPasien = null
            $scope.selectedAkibatInsiden = null
            $scope.selectedTindakanOleh = null
            $scope.selectedGrading = null

            // Data cehckbox
            $scope.listUmur = [
                { "id": 1, "nama": "0 - 1 Bulan" },
                { "id": 2, "nama": "> 1 bulan - 1 tahun" },
                { "id": 3, "nama": "> 1 tahun - 5 tahun" },
                { "id": 4, "nama": "> 5 tahun - 15 tahun" },
                { "id": 5, "nama": "> 15 tahun - 30 tahun" },
                { "id": 6, "nama": "> 30 tahun - 65 tahun" },
                { "id": 7, "nama": "> 65 tahun" }
            ]

            $scope.listJenisInsiden = [
                { "id": 1, "nama": "Kejadian Nyaris Cedera / KNC (Near miss)" },
                { "id": 2, "nama": "Kejadian Tidak Cedera / KTC (No Harm)" },
                { "id": 3, "nama": "Kejadian Tidak Diharapkan / KTD (Adverse Event)" },
                { "id": 4, "nama": "KPC" },
                { "id": 5, "nama": "Kejadian Sentinel (Sentinel Event)" },
            ]

            $scope.listPelapor = [
                { "id": 1, "nama": "Karyawan : Dokter / Perawat / Petugas Lainnya" },
                { "id": 2, "nama": "Keluarga / Pendamping Pasien" },
                { "id": 3, "nama": "Pasien" },
                { "id": 4, "nama": "Pengunjung" },
                { "id": 5, "nama": "Lain-lain" },
            ]

            $scope.listJenisPasien = [
                { "id": 1, "nama": "Pasien Rawat Inap" },
                { "id": 2, "nama": "Pasien Rawat Jalan" },
                { "id": 3, "nama": "Pasien IGD" },
                { "id": 4, "nama": " Lain-lain" },
            ]

            $scope.listKategoriPasien = [
                { "id": 1, "nama": "Anak Remaja" },
                { "id": 2, "nama": "Napza" },
                { "id": 3, "nama": "Dewasa" },
                { "id": 4, "nama": "Lansia" },
                { "id": 5, "nama": "GMO" },
                { "id": 6, "nama": "Elektromedik" },
                { "id": 7, "nama": "Lain-lain" },
            ]

            $scope.listAkibatInsiden = [
                { "id": 1, "nama": "Kematian" },
                { "id": 2, "nama": "Cedera Irreversibe / Cedera Berat" },
                { "id": 3, "nama": "Cedera Reversibel / Cedera Sedang" },
                { "id": 4, "nama": "Cedera Ringan" },
                { "id": 5, "nama": "Tidak Ada Cedera" },
            ]

            $scope.listKejadianSama = [
                { "id": 1, "nama": "Ya" },
                { "id": 2, "nama": "Tidak" }
            ]

            $scope.listTindakan = [
                { "id": 1, "nama": "Tim : Terdiri" },
                { "id": 2, "nama": "Dokter" },
                { "id": 3, "nama": "Petugas Lainnya" },
                { "id": 4, "nama": "Perawat" },
            ]

            $scope.listGrading = [
                { "id": 1, "nama": "BIRU" },
                { "id": 2, "nama": "HIJAU" },
                { "id": 3, "nama": "KUNING" },
                { "id": 4, "nama": "MERAH" },
            ]

            // Handle checkbox

            LoadCombo();                      

            function LoadCombo() {
                var nomor = 1;

                $scope.isRouteLoading = true;

                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listDataRuangan = data;
                    
                    medifirstService.get('sysadmin/general/get-combo-registrasi-general').then(function (data) {
                        var dataCombo = data.data;
                        $scope.listDataJenisKelamin = dataCombo.jeniskelamin;
                        $scope.listDataKelompokPasien = dataCombo.kelompokpasien;
                    });
                    
                    medifirstService.get('pmkp/get-data-combo-pmkp').then(function (e) {
                        $scope.listKeselamatanInput = e.data.insidenkeselamtanpasien;
                        $scope.listRegrading = e.data.regrading;
    
                        // petugas dan verifikator insiden
                        // petugasInsidenInternal = e.data.petugasInsidenInternal
                        // verifikatorInsidenInternal = e.data.verifikatorInsidenInternal
    
                        LoadCache();
                    });

                    medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                        $scope.listDataPegawai = data;                
                    });

                    $scope.isRouteLoading = false;
                });
            }

            function LoadCache() {
                var chacePeriode = cacheHelper.get('InsidenBaruCtrl');
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
                    cacheHelper.set('InsidenBaruCtrl', chacePeriode);
                } else {
                    init()
                }
            }

            function init() {
                // LoadCombo();D
                if (noOrder != '') {
                    if (noOrder == 'EditInsidenBaru') {
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true)
                            .then(function (response) {
                                $scope.isRouteLoading = false;
                                norec = kpid                            
                                let dataInsiden = response.data.data[0]

                                // data orang
                                $scope.item.NamaPasien = dataInsiden.namapasien
                                $scope.item.JenisKelamin = { id: dataInsiden.jeniskelaminfk, jeniskelaminfk: dataInsiden.jeniskelaminfk, jeniskelamin: dataInsiden.jeniskelamin }
                                $scope.item.TglMasuk = moment(dataInsiden.tglmasuk).format('YYYY-MM-DD HH:mm')
                                $scope.item.selectedUmur = konversiCheckBox(dataInsiden.umur)
                                
                                // rincian
                                $scope.item.TglInsiden = moment(dataInsiden.tglinsiden).format('YYYY-MM-DD HH:mm')
                                $scope.item.KeselamatanInput = selectedInsiden(dataInsiden.insidenkeselamatanfk)
                                $scope.item.Insiden = dataInsiden.insiden
                                $scope.item.selectedJenisInsiden = konversiCheckBox(dataInsiden.jenisinsiden)
                                $scope.item.selectedPelapor = konversiCheckBox(dataInsiden.pelaporinsiden)
                                $scope.item.lokasiInsiden = dataInsiden.tempatinsiden
                                $scope.item.selectedJenisPasien = konversiCheckBox(dataInsiden.insidenpenyangkut)
                                $scope.item.selectedKategoriPasien = konversiCheckBox(dataInsiden.insidenterjadi)
                                $scope.item.UnitKerja = dataInsiden.unitterkait
                                $scope.item.selectedAkibatInsiden = konversiCheckBox(dataInsiden.akibatinsiden)
                                $scope.item.Tindakan = dataInsiden.penanganan
                                $scope.item.selectedKejadianSama = konversiRadio(dataInsiden.kejadiansama, $scope.listKejadianSama)
                                $scope.item.selectedTindakanOleh = konversiCheckBox(dataInsiden.dilakukanoleh)
                                $scope.item.Penanggulangan = dataInsiden.langkahpenanganan
                                
                                // akhiran
                                $scope.item.PembuatLaporan = { id: dataInsiden.pembuatlaporanfk, namalengkap: dataInsiden.pembuatlaporan };
                                $scope.item.TglLaporan = moment(dataInsiden.tgllapor).format('YYYY-MM-DD HH:mm');
                                $scope.item.PenerimaLaporan = { id: dataInsiden.penerimalaporanfk, namalengkap: dataInsiden.penerimalaporan };
                                $scope.item.TglTerimaLaporan = moment(dataInsiden.tglterima).format('YYYY-MM-DD HH:mm');
                                $scope.item.selectedGrading = konversiRadio(dataInsiden.grading, $scope.listGrading)

                                // $scope.item.KelompokPasien = { id: dataInsiden.penanggungbiayapasienfk, penanggungbiayapasienfk: dataInsiden.penanggungbiayapasienfk, kelompokpasien: dataInsiden.kelompokpasien };
                                // $scope.item.TglLahir = moment(dataInsiden.tgllahir).format('YYYY-MM-DD HH:mm');
                                // $scope.item.KronologiInsiden = dataInsiden.kronologisinsiden;
                                // $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: dataInsiden.jeniskesalamatanfk, jeniskeselamatan: dataInsiden.jeniskeselamatan };
                            })
                    } else if (noOrder == 'LihatInsidenBaru') {
                        $scope.disabledText = true;
                        $scope.isRouteLoading = true;
                        medifirstService.get("pmkp/get-data-insiden-internal?Norec=" + kpid, true)
                            .then(function (response) {
                                $scope.isRouteLoading = false;
                                norec = kpid
                                let dataInsiden = response.data.data[0]
                                
                                // data orang
                                $scope.item.NamaPasien = dataInsiden.namapasien
                                $scope.item.JenisKelamin = { id: dataInsiden.jeniskelaminfk, jeniskelaminfk: dataInsiden.jeniskelaminfk, jeniskelamin: dataInsiden.jeniskelamin }
                                $scope.item.TglMasuk = moment(dataInsiden.tglmasuk).format('YYYY-MM-DD HH:mm')
                                $scope.item.selectedUmur = konversiCheckBox(dataInsiden.umur)
                                
                                // rincian
                                $scope.item.TglInsiden = moment(dataInsiden.tglinsiden).format('YYYY-MM-DD HH:mm')
                                $scope.item.KeselamatanInput = selectedInsiden(dataInsiden.insidenkeselamatanfk)
                                $scope.item.Insiden = dataInsiden.insiden
                                $scope.item.selectedJenisInsiden = konversiCheckBox(dataInsiden.jenisinsiden)
                                $scope.item.selectedPelapor = konversiCheckBox(dataInsiden.pelaporinsiden)
                                $scope.item.lokasiInsiden = dataInsiden.tempatinsiden
                                $scope.item.selectedJenisPasien = konversiCheckBox(dataInsiden.insidenpenyangkut)
                                $scope.item.selectedKategoriPasien = konversiCheckBox(dataInsiden.insidenterjadi)
                                $scope.item.UnitKerja = dataInsiden.unitterkait
                                $scope.item.selectedAkibatInsiden = konversiCheckBox(dataInsiden.akibatinsiden)
                                $scope.item.Tindakan = dataInsiden.penanganan
                                $scope.item.selectedKejadianSama = konversiRadio(dataInsiden.kejadiansama, $scope.listKejadianSama)
                                $scope.item.selectedTindakanOleh = konversiCheckBox(dataInsiden.dilakukanoleh)
                                $scope.item.Penanggulangan = dataInsiden.langkahpenanganan
                                
                                // akhiran
                                $scope.item.PembuatLaporan = { id: dataInsiden.pembuatlaporanfk, namalengkap: dataInsiden.pembuatlaporan };
                                $scope.item.TglLaporan = moment(dataInsiden.tgllapor).format('YYYY-MM-DD HH:mm');
                                $scope.item.PenerimaLaporan = { id: dataInsiden.penerimalaporanfk, namalengkap: dataInsiden.penerimalaporan };
                                $scope.item.TglTerimaLaporan = moment(dataInsiden.tglterima).format('YYYY-MM-DD HH:mm');
                                $scope.item.selectedGrading = konversiRadio(dataInsiden.grading, $scope.listGrading)

                                // $scope.item.KelompokPasien = { id: dataInsiden.penanggungbiayapasienfk, penanggungbiayapasienfk: dataInsiden.penanggungbiayapasienfk, kelompokpasien: dataInsiden.kelompokpasien };
                                // $scope.item.TglLahir = moment(dataInsiden.tgllahir).format('YYYY-MM-DD HH:mm');
                                // $scope.item.KronologiInsiden = dataInsiden.kronologisinsiden;
                                // $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: dataInsiden.jeniskesalamatanfk, jeniskeselamatan: dataInsiden.jeniskeselamatan };
                            });
                    } else if (noOrder == 'InputInsidenBaru') {
                        var pegawaiLogin = medifirstService.getPegawaiLogin();
                        
                        $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                        $scope.item.TglInsiden = moment($scope.now).format('YYYY-MM-DD HH:mm');
                        $scope.item.TglTerimaLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                        $scope.item.TglLaporan = moment($scope.now).format('YYYY-MM-DD HH:mm');
                        // $scope.item.selectedUmur = conversiCheckBox('1,2,3')

                        
                    }
                } else {
                    var pegawaiLogin = medifirstService.getPegawaiLogin();
                    $scope.item.PembuatLaporan = { id: pegawaiLogin.id, namalengkap: pegawaiLogin.namaLengkap }
                }
            }

            $scope.$watch('item.KeselamatanInput', function(){
                console.log('Hai')
                if($scope.item.KeselamatanInput){
                    $scope.item.JenisKeselamatanInput = { jeniskesalamatanfk: $scope.item.KeselamatanInput.jeniskesalamatanfk, jeniskeselamatan: $scope.item.KeselamatanInput.jeniskeselamatan };
                }
            })

            $scope.Save = function () {
                // if(noOrder == 'InputInsidenBaru'){
                //     // hanya petugas yang bisa input
                //     if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                //         toastr.error('Anda Bukan Petugas Insiden')
                //         return
                //     }
                // }

                // if(noOrder == 'EditInsidenBaru'){
                //     // hanya petugas dan verifikator yang bisa edit
                //     if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false || verifikatorInsidenInternal.includes($scope.pegawai.id.toString() == false) ){
                //         toastr.error('Anda Bukan Petugas Insiden')
                //         return
                //     }
                // }

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

            $scope.Simpan = function () {
                
                // console.log($scope.selectedKategoriPasien)
                var listRawRequired = [
                    "item.NamaPasien|ng-model|Nama Pasien",
                    "item.JenisKelamin|k-ng-model|Jenis Kelamin",
                    "item.TglMasuk|k-ng-model|Tanggal Masuk",
                    "item.selectedUmur|ng-model|Umur",
                    "item.selectedJenisInsiden|ng-model|Jenis Insiden",
                    "item.selectedPelapor|ng-model|Pelapor Insiden",
                    "item.selectedJenisPasien|ng-model|Insiden Menyangkut Pasien",
                    "item.selectedKategoriPasien|ng-model|Insiden Terjadi Pada Pasien",
                    "item.selectedAkibatInsiden|ng-model|Akibat Insiden",
                    "item.selectedKejadianSama|ng-model|Kejadian Sama",
                    "item.selectedTindakanOleh|ng-model|Tindakan Dilakukan Oleh",
                    "item.selectedGrading|ng-model|Grading",
                ]

                var isValid = medifirstService.setValidation($scope, listRawRequired);

                if (isValid.status) {

                    let dataSave = {
                        // data orang
                        "norec": norec != undefined ? norec : null,
                        "nocm": $scope.item.NoRM ? $scope.item.NoRM : null,
                        "namapasien": $scope.item.NamaPasien,
                        "tglahir": moment($scope.item.TglLahir).format('YYYY-MM-DD HH:mm'),
                        "jeniskelaminfk": $scope.item.JenisKelamin.id,
                        "ruanganfk": $scope.item.Ruangan ? $scope.item.Ruangan.value : null,
                        "tglmasuk": moment($scope.item.TglMasuk).format('YYYY-MM-DD HH:mm'),
                        "penanggungbiayapasienfk": $scope.item.KelompokPasien ? $scope.item.KelompokPasien.id : null,
                        "umur": checkBoxToString($scope.item.selectedUmur),
                        
                        // rincian kejadian
                        "tglinsiden": $scope.item.TglInsiden != undefined ? moment($scope.item.TglInsiden).format('YYYY-MM-DD HH:mm') : null,
                        "insidenkeselamatanfk": $scope.item.KeselamatanInput.id,
                        "insiden": $scope.item.Insiden != undefined ? $scope.item.Insiden : '',
                        "jenisinsiden": checkBoxToString($scope.item.selectedJenisInsiden),
                        "pelaporinsiden": checkBoxToString($scope.item.selectedPelapor),
                        "tempatinsiden": $scope.item.lokasiInsiden != undefined ? $scope.item.lokasiInsiden : null,
                        "insidenpenyangkut": checkBoxToString($scope.item.selectedJenisPasien),
                        "insidenterjadi": checkBoxToString($scope.item.selectedKategoriPasien),
                        "unitterkait": $scope.item.UnitKerja != undefined ? $scope.item.UnitKerja : '',
                        "akibatinsiden": checkBoxToString($scope.item.selectedAkibatInsiden),
                        "penanganan": $scope.item.Tindakan != undefined ? $scope.item.Tindakan : '',
                        "kejadiansama": $scope.item.selectedKejadianSama.id,
                        "dilakukanoleh": checkBoxToString($scope.item.selectedTindakanOleh),
                        "langkahpenanganan": $scope.item.Penanggulangan != undefined ? $scope.item.Penanggulangan : '',
                        
                        // akhiran
                        "pembuatlaporanfk": $scope.item.PembuatLaporan ? $scope.item.PembuatLaporan.id : null,
                        "pembuatlaporan": $scope.item.PembuatLaporan != undefined ? $scope.item.PembuatLaporan.namalengkap : '',
                        "tgllapor": $scope.item.TglLaporan != undefined ? moment($scope.item.TglLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "penerimalaporanfk": $scope.item.PenerimaLaporan ? $scope.item.PenerimaLaporan.id : null,
                        "penerimalaporan": $scope.item.PenerimaLaporan != undefined ? $scope.item.PenerimaLaporan.namalengkap : '',
                        "tglterima": $scope.item.TglTerimaLaporan != undefined ? moment($scope.item.TglTerimaLaporan).format('YYYY-MM-DD HH:mm') : null,
                        "grading": $scope.item.selectedGrading.id,
                        "noregistrasifk": noRegistrasifk != undefined ? noRegistrasifk : null,
                        
                        // ambigu
                        "jiwa": $scope.selectedKategoriPasien,
                        // "kronologisinsiden": $scope.item.KronologiInsiden != undefined ? $scope.item.KronologiInsiden : '',
                    }
                    
                    let objSave = {
                        data: dataSave,
                    }

                    console.log(objSave)

                    $scope.isRouteLoading = true
                    medifirstService.post('pmkp/save-data-insiden-internal', objSave).then(function (e) {
                        $scope.isRouteLoading = false
                        
                        Kosong();
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }

            function Kosong() {
                $scope.item = {};
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

            /**
             * 
             * @param {number} idInsiden 
             * @returns {Object}
             */
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