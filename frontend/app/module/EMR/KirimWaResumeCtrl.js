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
                            is_tte:         { type: 'number' },
                            tglkirimwa:     { type: 'string' }
                        }
                    }
                }
            });

            $scope.mainGridOptions = {
                scrollable: true,
                columns: [
                    { title: 'No', width: '45px', template: function (d) {
                        return ($scope.GridPasienResume.indexOf(d) + 1);
                    }},
                    { field: 'nocm',           title: 'No RM',          width: '100px' },
                    { field: 'namapasien',     title: 'Nama Pasien',     width: '180px' },
                    { field: 'kelompokpasien', title: 'Kelompok Pasien', width: '130px' },
                    { field: 'noregistrasi',   title: 'No Registrasi',   width: '130px' },
                    { field: 'tglresume',      title: 'Tgl Resume',      width: '130px' },
                    { field: 'namaruangan',    title: 'Ruangan',         width: '150px' },
                    { field: 'namadokter',     title: 'Dokter',          width: '160px' },
                    { title: 'No HP',          width: '130px',
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
                    }
                ]
            };

            // ── Klik baris grid ───────────────────────────────────────────────
            $scope.klikGrid = function (selected) {
                if (!selected || !selected.norec) return;
                $scope.dataSelected    = selected;
                $scope.selectedNomorHP = (selected.nohp || selected.notelepon || '').trim();
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

            $scope.previewResume = function(e) {
                if (e) e.preventDefault();
                if (!$scope.dataSelected) return;

                var pegawai = JSON.parse(localStorage.getItem('pegawai') || '{}');
                var nama = pegawai.namaLengkap || 'Admin';
                var pegawaittd = pegawai.id || '320263';
                var kdprofile = '30'; 

                var url = config.baseApiBackend + "report/cetak-resume-medis-v3?norec=" + $scope.dataSelected.norec
                        + "&kdprofile=" + kdprofile 
                        + "&nama=" + encodeURIComponent(nama) 
                        + "&pegawaittd=" + pegawaittd;

                window.open(url, '_blank');
            };

            $scope.lanjutKirimWa = function () {
                $scope.popupKonfirmasi.close();
                
                var noHP = ($scope.selectedNomorHP || '').trim();
                $scope.loadingSend = true;
                
                var payload = {
                    norec: $scope.dataSelected.norec,
                    noHP:  noHP
                };

                medifirstService.post('emr/send-wa-resume', payload).then(function (res) {
                    var d = res.data;
                    if (d.status === 200) {
                        if (d.mode === 'text_only') {
                            // Tampilkan warning kuning agar bisa dibaca oleh pihak RM
                            toastr.warning(d.message, 'Peringatan WaBlas', { timeOut: 10000 });
                        } else {
                            toastr.success(d.message || ('Resume Medis (PDF) berhasil dikirim ke WhatsApp ' + (d.noHP || noHP)));
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
