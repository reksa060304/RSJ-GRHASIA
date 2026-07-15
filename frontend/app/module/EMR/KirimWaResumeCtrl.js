define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('KirimWaResumeCtrl', ['$scope', 'MedifirstService', 'ModelItem', '$q',
        function ($scope, medifirstService, modelItem, $q) {

            // ── State ─────────────────────────────────────────────────────────
            $scope.item            = {};
            $scope.dataSelected    = null;
            $scope.selectedNomorHP = '';
            $scope.loadingSend     = false;
            $scope.listKelompokPasien = [];
            $scope.listStatusKirim = [
                { id: 'semua', name: 'Semua' },
                { id: 'belum', name: 'Belum Terkirim' },
                { id: 'sudah', name: 'Sudah Terkirim' }
            ];
            $scope.item.statusKirim = $scope.listStatusKirim[1];

            // Default periode: awal bulan ini hingga sekarang
            $scope.item.periodeAwal  = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
            $scope.item.periodeAkhir = new Date();

            // ── Load Combo Kelompok Pasien ────────────────────────────────────
            function loadCombo() {
                medifirstService.get('rawatjalan/get-combo').then(function (res) {
                    $scope.listKelompokPasien = res.data.kelompokpasien || res.data || [];
                });
            }

            // ── Grid Options ──────────────────────────────────────────────────
            $scope.GridPasienResume = new kendo.data.DataSource({
                data: [],
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            nocm:           { type: 'string' },
                            namapasien:     { type: 'string' },
                            nohp:           { type: 'string' },
                            notelepon:      { type: 'string' },
                            noregistrasi:   { type: 'string' },
                            kelompokpasien: { type: 'string' },
                            namaruangan:    { type: 'string' },
                            namadokter:     { type: 'string' },
                            tglresume:      { type: 'string' },
                            tgldokumen:     { type: 'string' },
                            jenis_dokumen:  { type: 'string' },
                            emrfk:          { type: 'number' },
                            noemr_pasien:   { type: 'string' },
                            blade:          { type: 'string' },
                            is_tte:         { type: 'number' },
                            tglkirimwa:     { type: 'string' },
                            norec_apd:      { type: 'string' },
                            umur:           { type: 'string' },
                            jeniskelamin:   { type: 'string' },
                            puskesmas_tujuan: { type: 'string' },
                            nohp_puskesmas: { type: 'string' }
                        }
                    }
                }
            });

            $scope.mainGridOptions = {
                toolbar: ["excel"],
                excel: {
                    fileName: "DaftarKirimWaResume.xlsx",
                    allPages: true
                },
                scrollable: true,
                columns: [
                    { title: 'No', width: '45px', 
                        template: function (d) {
                            return ($scope.GridPasienResume.indexOf(d) + 1);
                        },
                        exportable: false
                    },
                    { field: 'nocm',           title: 'No RM',          width: '100px' },
                    { field: 'namapasien',     title: 'Nama Pasien',     width: '180px' },
                    { field: 'jenis_dokumen',  title: 'Jenis Dokumen',  width: '180px' },
                    { field: 'kelompokpasien', title: 'Kelompok Pasien', width: '130px' },
                    { field: 'noregistrasi',   title: 'No Registrasi',   width: '130px' },
                    { field: 'tgldokumen',     title: 'Tgl Dokumen',     width: '130px' },
                    { field: 'namaruangan',    title: 'Ruangan',         width: '150px' },
                    { field: 'namadokter',     title: 'Dokter',          width: '160px' },
                    { title: 'Puskesmas Tujuan', width: '150px',
                        template: function (d) { return d.puskesmas_tujuan || '-'; }
                    },
                    { title: 'No HP Puskesmas', width: '130px',
                        template: function (d) { return d.nohp_puskesmas || '-'; }
                    },
                    { title: 'No HP Pasien',          width: '130px',
                        template: function (d) { return d.nohp || d.notelepon || '-'; }
                    },
                    { title: 'Status TTE',     width: '120px',
                        template: function (d) {
                            if (d.is_tte === 1 || d.is_tte === '1') {
                                return '<span style="color:#27ae60; font-weight:bold;"><i class="fa fa-check-circle"></i> Sudah TTE</span>';
                            } else {
                                return '<span style="color:#c0392b; font-weight:bold;"><i class="fa fa-times-circle"></i> Belum TTE</span>';
                            }
                        }
                    },
                    { title: 'Status Kirim WA', width: '150px',
                        template: function (d) {
                            if (d.tglkirimwa) {
                                return '<span style="color:#27ae60; font-weight:bold;"><i class="fa fa-check-circle"></i> Sudah Kirim</span><br><small style="color:#7f8c8d; font-weight:normal;">' + d.tglkirimwa + '</small>';
                            } else {
                                return '<span style="color:#c0392b; font-weight:bold;"><i class="fa fa-times-circle"></i> Belum Kirim</span>';
                            }
                        }
                    },
                    { title: 'Aksi', width: '100px',
                        template: '<button class="k-button k-button-icontext" style="background-color: \\#3498db; color: \\#fff; border: none; padding: 4px 8px; border-radius: 4px;" ng-click="previewRow(dataItem)"><i class="fa fa-eye"></i> Preview</button>',
                        exportable: false
                    }
                ]
            };

            // ── Klik baris grid ───────────────────────────────────────────────
            $scope.klikGrid = function (selected) {
                if (!selected || !selected.norec) return;
                $scope.dataSelected    = selected;
                $scope.selectedNomorHP = (selected.nohp_puskesmas || selected.nohp || selected.notelepon || '').trim();
            };

            $scope.filterStatus = function () {
                var status = $scope.item.statusKirim;
                if (!status || status.id === 'semua') {
                    $scope.GridPasienResume.filter([]);
                } else if (status.id === 'belum') {
                    $scope.GridPasienResume.filter({
                        field: "tglkirimwa",
                        operator: function (val) {
                            return !val;
                        }
                    });
                } else if (status.id === 'sudah') {
                    $scope.GridPasienResume.filter({
                        field: "tglkirimwa",
                        operator: function (val) {
                            return !!val;
                        }
                    });
                }
            };


            // ── Cari Data ─────────────────────────────────────────────────────
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var nocm = ""
                if ($scope.item.noCm != undefined) {
                    nocm = "&noCm=" + $scope.item.noCm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    nama = "&namaPasien=" + $scope.item.namaPasien
                }
                var noRegistrasi = ""
                if ($scope.item.noRegistrasi != undefined) {
                    noRegistrasi = "&noRegistrasi=" + $scope.item.noRegistrasi
                }
                var kelompokPasienId = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kelompokPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id
                }

                $q.all([
                    medifirstService.get("emr/get-daftar-pasien-resume?" +
                        "periodeAwal=" + tglAwal +
                        "&periodeAkhir=" + tglAkhir
                        + nocm
                        + noRegistrasi
                        + nama
                        + kelompokPasienId),
                ]).then(function (res) {
                    $scope.isRouteLoading = false;
                    var data = res[0].data.data || [];
                    $scope.GridPasienResume.data(data);
                    $scope.filterStatus();
                    if (data.length === 0) {
                        window.messageContainer.info('Tidak ada data resume medis yang ditemukan.');
                    }
                }, function () {
                    $scope.isRouteLoading = false;
                    window.messageContainer.error('Gagal memuat data resume medis.');
                });
            };

            // ── Kirim WA ──────────────────────────────────────────────────────
            $scope.kirimWaResume = function () {
                if (!$scope.dataSelected) {
                    window.messageContainer.error('Pilih pasien dari tabel terlebih dahulu.');
                    return;
                }

                // Validasi Status TTE Dokter (bisa di-bypass jika checkbox test dicentang)
                if (!$scope.item.bypassTte && $scope.dataSelected.is_tte !== 1 && $scope.dataSelected.is_tte !== '1') {
                    window.messageContainer.error('Dokumen resume medis belum ditandatangani secara elektronik (TTE) oleh dokter.');
                    return;
                }

                var noHP = ($scope.selectedNomorHP || '').trim();
                if (!noHP) {
                    window.messageContainer.error('Nomor HP pasien kosong. Isi kolom No HP Tujuan terlebih dahulu.');
                    return;
                }

                // Tampilkan popup konfirmasi
                $scope.popupKonfirmasi.center().open();
            };

            $scope.tutupKonfirmasi = function() {
                $scope.popupKonfirmasi.close();
            };

            $scope.previewRow = function (d) {
                if (!d) return;

                var pegawai = JSON.parse(localStorage.getItem('pegawai') || '{}');
                var local   = JSON.parse(localStorage.getItem('profile') || '{}');
                var nama    = pegawai.namaLengkap || 'Admin';
                var pegawaittd = pegawai.id || '320263';
                var kdprofile  = local.id || '30';

                var url = '';

                if (d.emrfk) {
                    var blade = d.blade || '';

                    // Blade yang punya dedicated endpoint (butuh norec_apd, noregistrasi, umur, jeniskelamin)
                    var dedicatedRoutes = {
                        'rujukan-edukasi-psikiatri':
                            'report/cetak-rujukan-edukasi-psikiatri',
                        'rujukan-edukasi-pasien-dengan-komorbid-epilepsi':
                            'report/cetak-rujukan-edukasi-pasien-dengan-komorbid-epilepsi',
                        'rujukan-edukasi-pasien-dengan-komorbid-sindrome-geriatri-low-intake':
                            'report/cetak-rujukan-edukasi-pasien-dengan-komorbid-sindrome-geriatri-low-intake',
                        'rujukan-edukasi-pasien-dengan-komorbid-tuberculosis':
                            'report/cetak-rujukan-edukasi-pasien-dengan-komorbid-tuberculosis',
                        'rujukan-edukasi-pasien':
                            'report/cetak-rujukan-edukasi-pasien'
                    };

                    if (dedicatedRoutes[blade]) {
                        // Gunakan dedicated endpoint yang membutuhkan norec_apd, noregistrasi, umur, jeniskelamin
                        url = config.baseApiBackend + dedicatedRoutes[blade]
                            + '?nocm='        + d.nocm
                            + '&norec_apd='   + (d.norec_apd || '')
                            + '&emr='         + d.norec
                            + '&emrfk='       + d.emrfk
                            + '&kdprofile='   + kdprofile
                            + '&nama='        + encodeURIComponent(nama)
                            + '&noregistrasi='+ (d.noregistrasi || '')
                            + '&umur='        + (d.umur || '')
                            + '&jeniskelamin='+ (d.jeniskelamin || '');
                    } else {
                        // Blade generik (fred-diabetes-dom, fred-hipertensi-dom, dll) → get-cetak-surat-man
                        url = config.baseApiBackend + 'report/get-cetak-surat-man'
                            + '?nocm='       + d.nocm
                            + '&emr='        + d.norec
                            + '&noemr='      + (d.noemr_pasien || '')
                            + '&emrfk='      + d.emrfk
                            + '&kdprofile='  + kdprofile
                            + '&pegawaittd=' + pegawaittd
                            + '&blade='      + blade;
                    }
                } else {
                    // Resume Medis biasa
                    url = config.baseApiBackend + 'report/cetak-resume-medis-v3'
                        + '?norec='      + d.norec
                        + '&kdprofile='  + kdprofile
                        + '&nama='       + encodeURIComponent(nama)
                        + '&pegawaittd=' + pegawaittd;
                }

                window.open(url, '_blank');
            };

            $scope.previewResume = function(e) {
                if (e) e.preventDefault();
                if (!$scope.dataSelected) return;
                $scope.previewRow($scope.dataSelected, e);
            };

            $scope.lanjutKirimWa = function () {
                $scope.popupKonfirmasi.close();
                
                var noHP = ($scope.selectedNomorHP || '').trim();
                $scope.loadingSend = true;
                
                var payload = {
                    norec: $scope.dataSelected.norec,
                    noHP:  noHP,
                    emrfk: $scope.dataSelected.emrfk || null
                };

                medifirstService.post('emr/send-wa-resume', payload).then(function (res) {
                    var d = res.data;
                    if (d.status === 200) {
                        if (d.mode === 'text_only') {
                            // Tampilkan warning kuning agar bisa dibaca oleh pihak RM
                            toastr.warning(d.message, 'Peringatan WaBlas', { timeOut: 10000 });
                        } else {
                            toastr.success(d.message || ($scope.dataSelected.jenis_dokumen + ' (PDF) berhasil dikirim ke WhatsApp ' + (d.noHP || noHP)));
                        }
                        $scope.findData();
                    } else {
                        window.messageContainer.error(d.message || 'Terjadi kesalahan saat mengirim WA.');
                    }
                }).catch(function (err) {
                    var msg = (err.data && err.data.message) ? err.data.message : 'Terjadi kesalahan server.';
                    window.messageContainer.error(msg);
                }).finally(function () {
                    $scope.loadingSend = false;
                });
            };

            // ── Init ──────────────────────────────────────────────────────────
            loadCombo();
            $scope.findData();
        }
    ]);
});
